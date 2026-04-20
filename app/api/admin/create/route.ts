import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isValidEmail, formatPhone } from "@/app/lib/security"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In-memory rate limiter for company creation: max 10 per hour per IP
const creationRateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isCreationRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = creationRateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    creationRateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

function checkAdminAuth(req: NextRequest) {
  const secret = (req.headers.get("x-admin-secret") || "").trim()
  const expected = (process.env.ADMIN_SECRET || "").trim()
  if (!expected) return false
  return secret === expected
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    // Rate limiting: max 10 company creations per hour per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isCreationRateLimited(ip)) {
      return NextResponse.json({ error: "Zu viele Erstellungen. Bitte versuchen Sie es in einer Stunde erneut." }, { status: 429 })
    }

    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, E-Mail und Passwort sind erforderlich" }, { status: 400 })
    }

    // Basic email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 })
    }

    // Minimum password length 8 (increased from 6)
    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben" }, { status: 400 })
    }

    // 1. Auth-User anlegen mit eigenem Passwort
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || "User konnte nicht erstellt werden" }, { status: 500 })
    }

    const userId = authData.user.id

    // 2. Company-Record anlegen
    const companyData: any = {
      id: userId,
      user_id: userId,
      name: name.trim(),
      email: email.trim(),
      paused: false,
      booking_addon: false,
      sms_count: 0,
    }

    // Telefon nur eintragen wenn angegeben
    if (phone && phone.trim()) {
      companyData.notification_phone = formatPhone(phone.trim())
    }

    const { error: companyError } = await supabaseAdmin
      .from("companies")
      .insert(companyData)

    if (companyError) {
      // Rollback: User wieder löschen
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: companyError.message }, { status: 500 })
    }

    // Return the plaintext password so admin can send it to customer
    // (Note: admin must securely share this with the customer separately)
    return NextResponse.json({
      success: true,
      userId,
      email: email.trim(),
      password,
      name: name.trim(),
      message: `Betrieb "${name.trim()}" wurde erfolgreich angelegt.`,
    })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
