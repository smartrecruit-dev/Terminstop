import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

/**
 * POST /api/admin/change-email
 * Body: { userId: string, newEmail: string }
 *
 * Ändert die E-Mail-Adresse eines Auth-Users über die Supabase Admin-API.
 * Kein E-Mail-Verify erforderlich (admin.updateUserById → sofort aktiv).
 */
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { userId, newEmail } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId fehlt" }, { status: 400 })
    }
    if (!newEmail?.trim()) {
      return NextResponse.json({ error: "newEmail fehlt" }, { status: 400 })
    }

    const email = newEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email,
      email_confirm: true, // Sofort aktiv, kein E-Mail-Verify
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[admin] Changed email for user ${userId} → ${email}`)
    return NextResponse.json({ success: true, email: data.user.email })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
