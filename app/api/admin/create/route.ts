import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkAdminAuth(req: NextRequest) {
  const secret = (req.headers.get("x-admin-secret") || "").trim()
  const expected = (process.env.ADMIN_SECRET || "").trim()
  if (!expected) return false
  return secret === expected
}

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  const special = "!@#$%"
  let pw = special[Math.floor(Math.random() * special.length)]
  for (let i = 0; i < 9; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  return pw.split("").sort(() => Math.random() - 0.5).join("")
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { name, email, phone } = await req.json()

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, E-Mail und Telefon sind erforderlich" }, { status: 400 })
    }

    const password = generatePassword()

    // 1. Auth-User anlegen
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || "User konnte nicht erstellt werden" }, { status: 500 })
    }

    const userId = authData.user.id

    // 2. Company-Record anlegen (id = user id, wegen RLS)
    const { error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        id: userId,
        name: name.trim(),
        notification_phone: formatPhone(phone.trim()),
        paused: false,
        booking_addon: false,
        sms_count: 0,
      })

    if (companyError) {
      // Rollback: User wieder löschen
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: companyError.message }, { status: 500 })
    }

    // 3. Willkommens-SMS senden
    const welcomeMsg = `Hallo ${name.trim()}, willkommen bei TerminStop! 🎉 Ihr Login: terminstop.de/login | E-Mail: ${email.trim()} | Passwort: ${password} | Bei Fragen: terminstop.business@gmail.com`

    let smsSent = false
    try {
      const smsRes = await fetch("https://gateway.seven.io/api/sms", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.SEVEN_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formatPhone(phone.trim()),
          text: welcomeMsg,
          from: "TerminStop",
        }),
      })
      smsSent = smsRes.ok
    } catch {
      smsSent = false
    }

    return NextResponse.json({
      success: true,
      userId,
      email: email.trim(),
      password,
      smsSent,
      message: `Betrieb "${name}" wurde erfolgreich angelegt.`,
    })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
