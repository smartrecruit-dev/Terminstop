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

function cleanName(raw: string) {
  return raw.replace(/\s*\[.*?\]\s*/g, "").trim()
}

function formatDT(date: string | null, time: string | null): string | null {
  if (!date) return null
  const dt = new Date(`${date}T${time || "00:00"}`)
  return dt.toLocaleString("de-DE", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit"
  }) + " Uhr"
}

async function sendConfirmationSMS(phone: string, name: string, date: string | null, time: string | null, companyName: string) {
  const cleanedName = cleanName(name)
  const dt = formatDT(date, time)

  let message: string
  if (dt) {
    message = `Hallo ${cleanedName}, Ihr Termin am ${dt} bei ${companyName} wurde bestätigt. Wir freuen uns auf Sie!`
  } else {
    message = `Hallo ${cleanedName}, Ihre Anfrage bei ${companyName} wurde bestätigt. Wir werden uns in Kürze bei Ihnen melden!`
  }

  const response = await fetch("https://gateway.seven.io/api/sms", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.SEVEN_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: formatPhone(phone),
      text: message,
      from: "TerminStop"
    })
  })

  const result = await response.json()
  return { ok: response.ok, result, message }
}

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, action, companyName } = await req.json()
    if (!appointmentId || !action) {
      return NextResponse.json({ error: "appointmentId und action erforderlich" }, { status: 400 })
    }

    if (action === "confirm") {
      // Termin bestätigen
      const { error: updateErr } = await supabaseAdmin
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId)
      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

      // Kundendaten laden für SMS
      const { data: appt } = await supabaseAdmin
        .from("appointments")
        .select("phone, name, date, time, company_id")
        .eq("id", appointmentId)
        .single()

      if (appt?.phone) {
        try {
          const name = companyName || "Ihrem Betrieb"
          const smsResult = await sendConfirmationSMS(appt.phone, appt.name, appt.date, appt.time, name)

          // SMS-Zähler erhöhen
          await supabaseAdmin.rpc("increment_sms_count", { company_id_input: appt.company_id })

          return NextResponse.json({ success: true, action: "confirmed", sms: smsResult.ok ? "sent" : "failed" })
        } catch (smsErr: any) {
          // SMS-Fehler soll Bestätigung nicht blockieren
          console.error("SMS error:", smsErr)
          return NextResponse.json({ success: true, action: "confirmed", sms: "error" })
        }
      }

      return NextResponse.json({ success: true, action: "confirmed" })
    }

    if (action === "reject") {
      const { error } = await supabaseAdmin
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, action: "rejected" })
    }

    return NextResponse.json({ error: "Ungültige action" }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
