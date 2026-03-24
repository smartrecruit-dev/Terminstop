import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import twilio from "twilio"

// ✅ Supabase (Service Role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ✅ Twilio
const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
)

// 📞 Telefonnummer normalisieren
function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")

  if (cleaned.startsWith("0")) {
    cleaned = "+49" + cleaned.substring(1)
  }

  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }

  return cleaned
}

export async function GET() {
  try {
    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    console.log("NOW:", now.toISOString())
    console.log("IN 24H:", in24h.toISOString())

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

      const appointmentDate = new Date(`${a.date}T${a.time}`)

      console.log("CHECK:", a.id, appointmentDate.toISOString())

      // 🔥 STABILE LOGIK (KEIN ENGER ZEITRAHMEN MEHR)
      if (
        appointmentDate > now &&
        appointmentDate <= in24h &&
        !a.reminded
      ) {

        try {
          // 🔥 Firmenname holen
          const { data: company } = await supabase
            .from("companies")
            .select("name")
            .eq("id", a.company_id)
            .single()

          const companyName = company?.name || "dem Unternehmen"

          // 🔥 SMS senden
          await client.messages.create({
            body: `Reminder: Dein Termin bei ${companyName} ist morgen um ${a.time}`,
            from: process.env.TWILIO_PHONE!,
            to: formatPhone(a.phone)
          })

          // 🔥 Als gesendet markieren
          await supabase
            .from("appointments")
            .update({ reminded: true })
            .eq("id", a.id)

          sentCount++

          console.log("✅ SMS SENT:", a.phone)

        } catch (smsError) {
          console.log("❌ TWILIO ERROR:", smsError)
        }

      } else {
        console.log("⏭️ SKIPPED:", a.id)
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      message: `${sentCount} SMS gesendet`
    })

  } catch (err) {
    console.log("GLOBAL ERROR:", err)
    return NextResponse.json({ success: false, error: err })
  }
}