import { NextResponse } from "next/server"

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone, message } = body

    const response = await fetch("https://gateway.seven.io/api/sms", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.SEVEN_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: formatPhone(phone),
        text: message,
        from: "Terminstopp"
      })
    })

    const result = await response.json()
    return NextResponse.json({ success: true, result })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
