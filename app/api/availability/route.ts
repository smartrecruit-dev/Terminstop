import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/availability?company_id=xxx&date=2026-04-22&time=10:00[&employee_id=yyy]
 *
 * Without employee_id: checks overall capacity (active employees count vs booked slots)
 * With employee_id:    checks if that specific employee is free at that date+time
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const company_id  = searchParams.get("company_id")
  const date        = searchParams.get("date")
  const time        = searchParams.get("time")
  const employee_id = searchParams.get("employee_id") // optional

  if (!company_id || !date || !time) {
    return NextResponse.json({ error: "company_id, date und time sind Pflichtfelder" }, { status: 400 })
  }

  try {
    if (employee_id) {
      // ── Mitarbeiter-spezifisch: ist dieser Mitarbeiter zu dem Zeitpunkt frei? ──
      const { count: bookedCount } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("company_id", company_id)
        .eq("employee_id", employee_id)
        .eq("date", date)
        .eq("time", time)
        .in("status", ["pending", "confirmed"])

      const booked = bookedCount ?? 0
      return NextResponse.json({
        available: booked === 0,
        capacity: 1,
        booked,
        free: booked === 0 ? 1 : 0,
      })
    }

    // ── Allgemein: Gesamtkapazität prüfen ──────────────────────────────────────
    const { count: empCount } = await supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("active", true)

    const capacity = Math.max(empCount ?? 0, 1)

    const { count: bookedCount } = await supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("date", date)
      .eq("time", time)
      .in("status", ["pending", "confirmed"])

    const booked = bookedCount ?? 0
    const free   = Math.max(capacity - booked, 0)

    return NextResponse.json({ available: free > 0, capacity, booked, free })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
