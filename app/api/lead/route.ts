import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isValidEmail, sanitize } from "@/app/lib/security"

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
// Max 3 Anfragen pro IP pro Stunde
const RATE_LIMIT   = 3
const WINDOW_MS    = 60 * 60 * 1000 // 1 Stunde

const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true // erlaubt
  }

  if (entry.count >= RATE_LIMIT) {
    return false // gesperrt
  }

  entry.count++
  return true // erlaubt
}

// Alte Einträge alle 10 Minuten aufräumen (Speicher schonen)
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap.entries()) {
    if (now > entry.resetAt) rateMap.delete(ip)
  }
}, 10 * 60 * 1000)

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP ermitteln (Vercel setzt x-forwarded-for)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  // Rate Limit prüfen
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte in einer Stunde erneut versuchen." },
      { status: 429 }
    )
  }

  // Body parsen
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
  }

  const { name, phone, email, company, message } = body

  // Pflichtfelder prüfen
  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Pflichtfelder (Name, Telefon, E-Mail) fehlen." },
      { status: 400 }
    )
  }

  // Email validation using centralized security utility
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ungültige E-Mail-Adresse." },
      { status: 400 }
    )
  }

  // Sanitize all input fields using centralized utility
  const sanitizedName = sanitize(name, 200)
  const sanitizedPhone = sanitize(phone, 50)
  const sanitizedEmail = sanitize(email, 200).toLowerCase()
  const sanitizedCompany = sanitize(company, 200) || null
  const sanitizedMessage = sanitize(message, 1000) || null

  // In Datenbank eintragen
  const { error } = await supabase
    .from("leads")
    .insert([{
      name:    sanitizedName,
      phone:   sanitizedPhone,
      email:   sanitizedEmail,
      company: sanitizedCompany,
      message: sanitizedMessage,
    }])

  if (error) {
    console.error("[Lead API] Supabase error:", error)
    return NextResponse.json(
      { error: "Beim Speichern ist ein Fehler aufgetreten. Bitte erneut versuchen." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
