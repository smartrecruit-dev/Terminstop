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

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, E-Mail und Passwort sind erforderlich" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Passwort muss mindestens 6 Zeichen haben" }, { status: 400 })
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

    // Kein SMS-Versand mehr – Marvin schickt manuell eine E-Mail
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
