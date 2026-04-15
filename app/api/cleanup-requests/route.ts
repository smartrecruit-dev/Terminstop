import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // ── Auth: prüfe CRON_SECRET ──────────────────────────────────
  const authHeader = req.headers.get("authorization")
  const secret     = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── Supabase Admin Client (umgeht RLS) ───────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── Alle Online-Buchungsanfragen löschen die älter als 7 Tage ─
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const cutoffISO = cutoff.toISOString()

  const { data, error, count } = await supabase
    .from("appointments")
    .delete({ count: "exact" })
    .eq("online_booking", true)
    .lt("created_at", cutoffISO)

  if (error) {
    console.error("[cleanup-requests] Supabase error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`[cleanup-requests] ${count} Anfragen gelöscht (älter als ${cutoffISO})`)

  return NextResponse.json({
    success: true,
    deleted: count ?? 0,
    cutoff:  cutoffISO,
    message: `${count ?? 0} Anfrage(n) erfolgreich gelöscht.`,
  })
}
