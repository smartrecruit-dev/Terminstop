import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sanitize, isValidEmail, isValidPhone } from "@/app/lib/security"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/

// In-memory rate limiter: max 5 registrations per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Zu viele Registrierungsversuche. Bitte später erneut versuchen." }, { status: 429 })
    }

    const body = await req.json()
    const email     = sanitize(body.email, 200).toLowerCase()
    const password  = typeof body.password === "string" ? body.password.trim() : ""
    const companyName = sanitize(body.companyName, 100)
    const slug      = sanitize(body.slug, 40).toLowerCase()

    // Validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben" }, { status: 400 })
    }
    if (!companyName) {
      return NextResponse.json({ error: "Betriebsname fehlt" }, { status: 400 })
    }
    if (!SLUG_REGEX.test(slug)) {
      return NextResponse.json({ error: "Ungültiger Buchungslink" }, { status: 400 })
    }

    // Slug availability check
    const { data: existing } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Dieser Buchungslink ist bereits vergeben" }, { status: 409 })
    }

    // Create Supabase auth user (email_confirm: true = sofort aktiv, kein Verify-Mail)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData?.user) {
      // E-Mail already exists
      if (authError?.message?.includes("already")) {
        return NextResponse.json({ error: "Diese E-Mail ist bereits registriert" }, { status: 409 })
      }
      return NextResponse.json({ error: authError?.message || "Registrierung fehlgeschlagen" }, { status: 500 })
    }

    const userId = authData.user.id

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

    // Create company row
    const { error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        user_id:       userId,
        name:          companyName,
        slug:          slug,
        booking_addon: true,
        paused:        false,
        sms_limit:     100,
        sms_count_month: 0,
      })

    if (companyError) {
      // Rollback: delete the created user
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.error("[register] company insert failed:", companyError.message)
      return NextResponse.json({ error: "Registrierung fehlgeschlagen. Bitte erneut versuchen." }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId })

  } catch (e: any) {
    console.error("[register]", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
