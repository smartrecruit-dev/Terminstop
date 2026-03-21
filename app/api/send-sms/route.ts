import { NextResponse } from "next/server"
import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
)

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

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { phone, message } = body

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE!,
      to: formatPhone(phone)
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message
    })

  }

}