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
 * POST /api/admin/delete-company
 * Body: { companyId: string }
 *
 * Löscht einen Betrieb vollständig:
 * 1. Auth-User aus Supabase Auth entfernen (verhindert Login)
 * 2. companies-Zeile wird durch ON DELETE CASCADE automatisch mitgelöscht
 * Historische Daten (Termine, Kunden) werden dabei ebenfalls gelöscht.
 * Nur für Sicherheitsfälle / auf ausdrücklichen Wunsch des Kunden verwenden.
 */
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { companyId } = await req.json()
    if (!companyId) return NextResponse.json({ error: "companyId fehlt" }, { status: 400 })

    // 1. user_id der Company ermitteln
    const { data: company, error: fetchErr } = await supabaseAdmin
      .from("companies")
      .select("user_id, name")
      .eq("id", companyId)
      .single()

    if (fetchErr || !company) {
      return NextResponse.json({ error: "Betrieb nicht gefunden" }, { status: 404 })
    }

    // 2. Auth-User löschen (cascaded: companies + alle verknüpften Daten via RLS/FK)
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(company.user_id)
    if (authErr) {
      return NextResponse.json({ error: "Auth-User konnte nicht gelöscht werden: " + authErr.message }, { status: 500 })
    }

    console.log(`[admin] Deleted company "${company.name}" (${companyId}), user ${company.user_id}`)
    return NextResponse.json({ success: true, deleted: company.name })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
