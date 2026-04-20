import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { randomInt } from "crypto"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkAdminAuth(req: NextRequest) {
  const secret   = (req.headers.get("x-admin-secret") || "").trim()
  const expected = (process.env.ADMIN_SECRET || "").trim()
  if (!expected) return false
  return secret === expected
}

// Sicheres zufälliges Passwort generieren via Node.js crypto (CSPRNG)
function generatePassword(length = 12): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars[randomInt(0, chars.length)]
  }
  return password
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { userId, newPassword } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId fehlt" }, { status: 400 })
    }

    const password = newPassword?.trim() || generatePassword()

    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, password })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
