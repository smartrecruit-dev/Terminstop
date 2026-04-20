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

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    // Companies ohne created_at (Spalte existiert nicht in der Tabelle)
    const { data: companies, error } = await supabaseAdmin
      .from("companies")
      .select("id, name, paused, slug, booking_addon, notification_phone, booking_note, sms_count, sms_count_month, sms_limit, sms_month")

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Auth-User laden → Email + created_at kommen von hier
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const userMap: Record<string, { email: string; created_at: string }> = {}
    users.forEach(u => {
      userMap[u.id] = { email: u.email || "—", created_at: u.created_at || "" }
    })

    // Termine & Kunden-Anzahl
    const ids = (companies || []).map(c => c.id)
    const [{ data: apptCounts }, { data: custCounts }] = await Promise.all([
      supabaseAdmin.from("appointments").select("company_id").in("company_id", ids),
      supabaseAdmin.from("customers").select("company_id").in("company_id", ids),
    ])

    const apptMap: Record<string, number> = {}
    const custMap: Record<string, number> = {}
    ;(apptCounts || []).forEach(a => { apptMap[a.company_id] = (apptMap[a.company_id] || 0) + 1 })
    ;(custCounts || []).forEach(c => { custMap[c.company_id] = (custMap[c.company_id] || 0) + 1 })

    const enriched = (companies || [])
      .map(c => ({
        ...c,
        email:        userMap[c.id]?.email      || "—",
        created_at:   userMap[c.id]?.created_at || "",
        appointments: apptMap[c.id] || 0,
        customers:    custMap[c.id] || 0,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ companies: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
