import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In-Memory Rate-Limit: max 5 Anfragen pro IP pro Minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

export async function POST(req: NextRequest) {
  try {
    // Rate-Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    }

    const { company_id, booking_type, customer_name, service_name, date, time } = await req.json()

    if (!company_id) {
      return NextResponse.json({ error: "company_id fehlt" }, { status: 400 })
    }

    // Betreiber-Telefon laden
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("name, notification_phone")
      .eq("id", company_id)
      .single()

    if (!company?.notification_phone) {
      return NextResponse.json({ skipped: true, reason: "Kein notification_phone hinterlegt" })
    }

    // Nachricht zusammenbauen
    const cleanName = (customer_name || "Unbekannt").replace(/\s*\[.*?\]\s*/g, "").trim()
    let msg = `TerminStop: Neue Buchungsanfrage von ${cleanName}`
    if (service_name) msg += ` (${service_name})`
    if (date && time) {
      const dt = new Date(`${date}T${time}`).toLocaleString("de-DE", {
        weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit"
      })
      msg += ` am ${dt} Uhr`
    } else if (booking_type === "callback") {
      msg += ` – Rückrufanfrage`
    }
    msg += `. Jetzt bestätigen: terminstop.de/requests`

    // SMS senden
    const res = await fetch("https://gateway.seven.io/api/sms", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.SEVEN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to:   formatPhone(company.notification_phone),
        text: msg,
        from: "TerminStop",
      }),
    })

    const result = await res.json()
    return NextResponse.json({ success: res.ok, result })

  } catch (e: any) {
    console.error("[notify-operator]", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
