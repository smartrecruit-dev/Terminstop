import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

function formatDT(date: string, time: string): string {
  return new Date(`${date}T${time}`).toLocaleString("de-DE", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
  }) + " Uhr"
}

async function sendSMS(to: string, message: string) {
  const res = await fetch("https://gateway.seven.io/api/sms", {
    method: "POST",
    headers: { "X-Api-Key": process.env.SEVEN_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ to, text: message, from: "TerminStop" }),
  })
  return res.ok
}

/**
 * POST /api/book
 *
 * Submission from the public booking page /book/[slug].
 * - Checks availability (employees vs. booked slots at same date/time)
 * - If slot is free  → status = "confirmed", sends confirmation SMS immediately
 * - If slot is full  → status = "pending",   owner must confirm manually
 *
 * Body:
 *   company_id, name, phone, date, time, service_name?, note?, request_text?, booking_type
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      company_id,
      name,
      phone,
      date,
      time,
      service_name,
      note,
      request_text,
      booking_type, // "service" | "open" | "callback"
      employee_id,  // optional: assigned employee
    } = body

    if (!company_id || !name || !phone) {
      return NextResponse.json({ error: "company_id, name und phone sind Pflichtfelder" }, { status: 400 })
    }

    // ── Kapazitätsprüfung (nur wenn Datum+Zeit vorhanden) ──────────────────────
    let autoConfirm = false

    if (date && time && booking_type !== "callback") {
      if (employee_id) {
        // Mitarbeiter-spezifisch: ist dieser Mitarbeiter frei?
        const { count: bookedCount } = await supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company_id)
          .eq("employee_id", employee_id)
          .eq("date", date)
          .eq("time", time)
          .in("status", ["pending", "confirmed"])
        autoConfirm = (bookedCount ?? 0) === 0
      } else {
        // Allgemeine Kapazitätsprüfung
        const { count: empCount } = await supabase
          .from("employees")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company_id)
          .eq("active", true)
        const capacity = Math.max(empCount ?? 0, 1)
        const { count: bookedCount } = await supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company_id)
          .eq("date", date)
          .eq("time", time)
          .in("status", ["pending", "confirmed"])
        autoConfirm = (bookedCount ?? 0) < capacity
      }
    }

    // ── Terminnamen zusammenstellen ────────────────────────────────────────────
    let appointmentName = name.trim()
    if (booking_type === "service" && service_name)
      appointmentName = `${name.trim()} [Online: ${service_name}]`
    else if (booking_type === "open")
      appointmentName = `${name.trim()} [Online: Termin]`
    else if (booking_type === "callback")
      appointmentName = `${name.trim()} [Rückruf]`

    const newStatus = autoConfirm ? "confirmed" : "pending"

    // ── Termin einfügen ────────────────────────────────────────────────────────
    const { data: inserted, error: insertErr } = await supabase
      .from("appointments")
      .insert({
        company_id,
        name:           appointmentName,
        phone:          phone.trim(),
        note:           note?.trim() || null,
        date:           booking_type === "callback" ? null : (date || null),
        time:           booking_type === "callback" ? null : (time || null),
        status:         newStatus,
        online_booking: true,
        request_text:   request_text?.trim() || null,
        employee_id:    employee_id || null,
        reminded:       false,
      })
      .select("id")
      .single()

    if (insertErr) {
      const msg = insertErr.message?.includes("RATE_LIMIT")
        ? "Du hast heute bereits 3 Anfragen gesendet. Bitte morgen erneut versuchen."
        : "Etwas ist schiefgelaufen. Bitte versuche es erneut."
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    // ── Automatische Bestätigung: SMS sofort senden ────────────────────────────
    if (autoConfirm && date && time) {
      const { data: company } = await supabase
        .from("companies")
        .select("name, sms_count_month, sms_limit, sms_month, paused")
        .eq("id", company_id)
        .single()

      const shouldSend = company && !company.paused

      if (shouldSend) {
        // Monatlichen Zähler-Reset prüfen
        const now = new Date()
        const currentMonth = now.getFullYear() * 100 + (now.getMonth() + 1)
        if ((company.sms_month || 0) !== currentMonth) {
          await supabase.from("companies").update({ sms_count_month: 0, sms_month: currentMonth }).eq("id", company_id)
          company.sms_count_month = 0
        }

        const used  = company.sms_count_month ?? 0
        const limit = company.sms_limit ?? 100

        if (used < limit) {
          const cleanName = name.trim().replace(/\s*\[.*?\]\s*/g, "")
          const msg = `Hallo ${cleanName}, Ihr Termin am ${formatDT(date, time)} bei ${company.name} wurde bestätigt. Wir freuen uns auf Sie!`

          try {
            const ok = await sendSMS(formatPhone(phone.trim()), msg)
            if (ok) {
              await supabase.rpc("increment_sms_count", { company_id_input: company_id })
              // Mark SMS as sent on the appointment
              await supabase.from("appointments")
                .update({ reminded: true, sms_sent_at: new Date().toISOString() })
                .eq("id", inserted.id)
            }
          } catch (smsErr) {
            console.error("Auto-confirm SMS error:", smsErr)
            // Don't fail the booking because of SMS error
          }
        }
      }
    }

    return NextResponse.json({
      success:       true,
      confirmed:     autoConfirm,
      appointment_id: inserted?.id,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
