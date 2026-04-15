import { NextRequest, NextResponse } from "next/server"
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

function getNowInBerlin(): Date {
  const now = new Date()
  const berlinTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  )
  return berlinTime
}

function parseLocalDate(date: string, time: string): Date {
  const berlinNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  )
  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const result = new Date(berlinNow)
  result.setFullYear(year, month - 1, day)
  result.setHours(hour, minute, 0, 0)
  return result
}

export async function GET(req: NextRequest) {
  // ── Auth-Check: nur Aufrufe mit gültigem CRON_SECRET erlaubt ──
  const authHeader = req.headers.get("authorization")
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = getNowInBerlin()
    console.log("NOW (Berlin):", now.toString())

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("reminded", false)
      .neq("status", "cancelled")
      // Online-Buchungen nur erinnern wenn bereits bestätigt
      .or("online_booking.is.null,online_booking.eq.false,status.eq.confirmed")

    if (error) {
      console.log("DB ERROR:", error)
      return NextResponse.json({ success: false, error })
    }

    let sentCount = 0

    for (const a of data || []) {
      const appointmentDate = parseLocalDate(a.date, a.time)
      const diffMs = appointmentDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      console.log("DEBUG:", {
        id: a.id,
        appointment: appointmentDate.toString(),
        diffHours
      })

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

          await supabase.rpc("increment_sms_count", {
            company_id_input: a.company_id
          })

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
