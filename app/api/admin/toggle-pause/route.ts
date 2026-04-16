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
    const { companyId, paused } = await req.json()
    if (!companyId) return NextResponse.json({ error: "companyId fehlt" }, { status: 400 })

    const { error } = await supabaseAdmin
      .from("companies")
      .update({ paused: !!paused })
      .eq("id", companyId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, paused: !!paused })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
