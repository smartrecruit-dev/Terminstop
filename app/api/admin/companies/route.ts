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

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    // Alle Companies laden
    const { data: companies, error } = await supabaseAdmin
      .from("companies")
      .select("id, name, paused, slug, booking_addon, notification_phone, booking_note, sms_count, created_at")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Auth-User-Emails laden
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    users.forEach(u => { if (u.email) emailMap[u.id] = u.email })

    // Termine & Kunden-Anzahl pro Company laden
    const ids = (companies || []).map(c => c.id)

    const [{ data: apptCounts }, { data: custCounts }] = await Promise.all([
      supabaseAdmin
        .from("appointments")
        .select("company_id")
        .in("company_id", ids),
      supabaseAdmin
        .from("customers")
        .select("company_id")
        .in("company_id", ids),
    ])

    const apptMap: Record<string, number> = {}
    const custMap: Record<string, number> = {}
    ;(apptCounts || []).forEach(a => { apptMap[a.company_id] = (apptMap[a.company_id] || 0) + 1 })
    ;(custCounts || []).forEach(c => { custMap[c.company_id] = (custMap[c.company_id] || 0) + 1 })

    // User-IDs zu Companies matchen über auth.users
    // companies haben keine user_id direkt — stattdessen per RLS (auth.uid() = company.id)
    const enriched = (companies || []).map(c => ({
      ...c,
      email: emailMap[c.id] || "—",
      appointments: apptMap[c.id] || 0,
      customers: custMap[c.id] || 0,
    }))

    return NextResponse.json({ companies: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
