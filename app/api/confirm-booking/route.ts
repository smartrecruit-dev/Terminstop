import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, action, companyName } = await req.json()
    if (!appointmentId || !action) {
      return NextResponse.json({ error: "appointmentId und action erforderlich" }, { status: 400 })
    }

    // Appointment laden
    const { data: appt, error: fetchErr } = await supabaseAdmin
      .from("appointments")
      .select("id, name, phone, date, time, company_id, online_booking")
      .eq("id", appointmentId)
      .single()

    if (fetchErr || !appt) {
      return NextResponse.json({ error: "Termin nicht gefunden" }, { status: 404 })
    }

    if (action === "confirm") {
      // Status auf confirmed setzen
      await supabaseAdmin
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId)

      // SMS an Kunden senden
      try {
        const customerName = (appt.name as string).replace(/\s*\[.*?\]\s*/g, "").trim()
        let message = `Hallo ${customerName}, Ihre Anfrage bei ${companyName || "uns"} wurde bestätigt`
        if (appt.date && appt.time) {
          const dt = new Date(`${appt.date}T${appt.time}`)
          const dtStr = dt.toLocaleString("de-DE", {
            weekday:"long", day:"numeric", month:"long",
            hour:"2-digit", minute:"2-digit"
          })
          message += ` für ${dtStr} Uhr`
        }
        message += `. Wir freuen uns auf Sie! – TerminStop`

        await fetch("https://gateway.seven.io/api/sms", {
          method: "POST",
          headers: {
            "X-Api-Key": process.env.SEVEN_API_KEY!,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to:   formatPhone(appt.phone as string),
            text: message,
            from: "TerminStop"
          })
        })
      } catch (smsErr) {
        // SMS-Fehler ignorieren — Termin ist trotzdem bestätigt
        console.error("SMS-Fehler:", smsErr)
      }

      return NextResponse.json({ success: true, action: "confirmed" })
    }

    if (action === "reject") {
      await supabaseAdmin
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)

      // Optional: Absage-SMS
      try {
        const customerName = (appt.name as string).replace(/\s*\[.*?\]\s*/g, "").trim()
        const message = `Hallo ${customerName}, leider können wir Ihre Anfrage bei ${companyName || "uns"} zum gewünschten Zeitpunkt nicht annehmen. Bitte kontaktieren Sie uns direkt. – TerminStop`

        await fetch("https://gateway.seven.io/api/sms", {
          method: "POST",
          headers: {
            "X-Api-Key": process.env.SEVEN_API_KEY!,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to:   formatPhone(appt.phone as string),
            text: message,
            from: "TerminStop"
          })
        })
      } catch { /* ignore */ }

      return NextResponse.json({ success: true, action: "rejected" })
    }

    return NextResponse.json({ error: "Ungültige action" }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
