import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import twilio from "twilio"

// ✅ Supabase
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
      const diffMs = appointmentDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      if (diffHours <= 24 && diffHours > 0) {

        try {

          // 🔥 Firmenname holen
          const { data: company } = await supabase
            .from("companies")
            .select("name")
            .eq("id", a.company_id)
            .single()

          const companyName = company?.name || "unserem Unternehmen"

          // 🔥 Kundenname
          const customerName = a.name || "Kunde"

          // 🔥 FINAL SMS TEXT
          const message = `Hallo ${customerName} 👋

wir möchten Sie daran erinnern, dass Ihr Termin bei ${companyName} morgen um ${a.time} Uhr stattfindet.

Wir freuen uns auf Sie!
Ihr Team von ${companyName} 😊`

          // 🔥 SMS senden
          await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE!,
            to: formatPhone(a.phone)
          })

          // 🔥 markieren
          await supabase
            .from("appointments")
            .update({ reminded: true })
            .eq("id", a.id)

          sentCount++

          console.log("✅ SMS SENT:", a.phone)

        } catch (smsError) {
          console.log("❌ TWILIO ERROR:", smsError)
        }

      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount
    })

  } catch (err) {
    console.log("GLOBAL ERROR:", err)
    return NextResponse.json({ success: false, error: err })
  }
}