import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendSMS(to: string, message: string) {
  const response = await fetch("https://gateway.seven.io/api/sms", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.SEVEN_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to,
      text: message,
      from: "Terminstop"
    })
  })

  const result = await response.json()

  if (!response.ok || result.success === "false") {
    throw new Error(`Seven.io Fehler: ${JSON.stringify(result)}`)
  }

  return result
}

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

function parseLocalDate(date: string, time: string) {
  const dateTimeString = `${date}T${time}:00`
  return new Date(new Date(dateTimeString).toLocaleString("en-US", { timeZone: "Europe/Berlin" }))
}

export async function GET() {
  try {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }))

    console.log("NOW:", now.toString())

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("reminded", false)

    if (error) {
      console.log("DB ERROR:", error)
      return NextResponse.json({ success: false, error })
    }

    let sentCount = 0

    for (const a of data || []) {
      const appointmentDate = parseLocalDate(a.date, a.time)
      const diffMs = appointmentDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      console.log("DEBUG:", { id: a.id, appointment: appointmentDate.toString(), diffHours })

      if (diffHours <= 24 && diffHours > 0) {
        try {
          const { data: company } = await supabase
            .from("companies")
            .select("name")
            .eq("id", a.company_id)
            .single()

          const companyName = company?.name || "unserem Unternehmen"
          const customerName = a.name || "Kunde"
          const message = `Hallo ${customerName}, Ihr Termin bei ${companyName} ist morgen um ${a.time} Uhr. Wir freuen uns auf Sie!`

          const result = await sendSMS(formatPhone(a.phone), message)
          console.log("SEVEN.IO RESULT:", result)

          await supabase
            .from("appointments")
            .update({
              reminded: true,
              sms_sent_at: new Date().toISOString()
            })
            .eq("id", a.id)

          sentCount++
          console.log("✅ SMS SENT:", a.phone)

        } catch (smsError) {
          console.log("❌ SEVEN.IO ERROR:", smsError)
        }
      } else {
        console.log("⏭️ SKIPPED:", a.id)
      }
    }

    return NextResponse.json({ success: true, sent: sentCount })

  } catch (err) {
    console.log("GLOBAL ERROR:", err)
    return NextResponse.json({ success: false, error: err })
  }
}
