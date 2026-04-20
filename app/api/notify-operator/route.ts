import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { formatPhone, isValidPhone } from "@/app/lib/security"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In-Memory Rate-Limit: max 3 requests per IP per minute (stricter than before)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
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

    // Input validation: sanitize and validate field lengths
    const validCustomerName = typeof customer_name === "string" ? customer_name.trim().slice(0, 100) : ""
    const validBookingType = typeof booking_type === "string" ? booking_type.trim().slice(0, 50) : ""
    const validServiceName = typeof service_name === "string" ? service_name.trim().slice(0, 100) : ""

    // Validate date format (YYYY-MM-DD)
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Ungültiges Datumsformat (YYYY-MM-DD)" }, { status: 400 })
    }

    // Validate time format (HH:MM)
    if (time && !/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: "Ungültiges Zeitformat (HH:MM)" }, { status: 400 })
    }

    // Betreiber-Telefon laden and check company status
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("id, name, notification_phone, booking_addon, paused, sms_count_month, sms_limit")
      .eq("id", company_id)
      .single()

    if (!company) {
      return NextResponse.json({ error: "Betrieb nicht gefunden" }, { status: 404 })
    }

    if (!company?.notification_phone) {
      return NextResponse.json({ skipped: true, reason: "Kein notification_phone hinterlegt" })
    }

    // Telefonnummer validieren bevor SMS-Versand
    if (!isValidPhone(company.notification_phone)) {
      return NextResponse.json({ skipped: true, reason: "Ungültige Telefonnummer" })
    }

    // Check if company has booking_addon enabled
    if (!company.booking_addon) {
      return NextResponse.json({ skipped: true, reason: "Booking-Addon nicht aktiviert" })
    }

    // Check if company is paused
    if (company.paused) {
      return NextResponse.json({ skipped: true, reason: "Betrieb ist pausiert" })
    }

    // Hinweis: SMS-Limit wird nur zur Überwachung geführt, blockiert nicht.
    // Admin sieht im Dashboard wenn Betrieb über Limit ist (Nachberechnung 0,10 €/SMS).

    // Nachricht zusammenbauen
    const cleanName = (validCustomerName || "Unbekannt").replace(/\s*\[.*?\]\s*/g, "").trim()
    let msg = `TerminStop: Neue Buchungsanfrage von ${cleanName}`
    if (validServiceName) msg += ` (${validServiceName})`
    if (date && time) {
      const dt = new Date(`${date}T${time}`).toLocaleString("de-DE", {
        weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit"
      })
      msg += ` am ${dt} Uhr`
    } else if (validBookingType === "callback") {
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
