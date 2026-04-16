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

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { companyId, updates } = await req.json()
    if (!companyId || !updates) {
      return NextResponse.json({ error: "companyId und updates erforderlich" }, { status: 400 })
    }

    // Allowed fields to update
    const allowed = ["booking_addon", "slug", "notification_phone", "paused"]
    const filtered: Record<string, any> = {}
    for (const key of allowed) {
      if (key in updates) filtered[key] = updates[key]
    }

    if (Object.keys(filtered).length === 0) {
      return NextResponse.json({ error: "Keine gültigen Felder zum Aktualisieren" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("companies")
      .update(filtered)
      .eq("id", companyId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, updated: filtered })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
