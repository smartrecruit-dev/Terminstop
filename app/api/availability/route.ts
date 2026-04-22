import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/availability?company_id=xxx&date=2026-04-22&time=10:00
 *
 * Returns how many employee slots are free at the requested date+time.
 * capacity = number of active employees (min 1 for single-person shops)
 * booked   = appointments at same date+time that are pending or confirmed
 * available = free > 0
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const company_id = searchParams.get("company_id")
  const date       = searchParams.get("date")
  const time       = searchParams.get("time")

  if (!company_id || !date || !time) {
    return NextResponse.json({ error: "company_id, date und time sind Pflichtfelder" }, { status: 400 })
  }

  try {
    // 1. Kapazität: Anzahl aktiver Mitarbeiter (min. 1)
    const { count: empCount } = await supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("active", true)

    const capacity = Math.max(empCount ?? 0, 1)

    // 2. Bereits gebuchte Termine zur gleichen Zeit
    const { count: bookedCount } = await supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("date", date)
      .eq("time", time)
      .in("status", ["pending", "confirmed"])

    const booked = bookedCount ?? 0
    const free   = Math.max(capacity - booked, 0)

    return NextResponse.json({
      available: free > 0,
      capacity,
      booked,
      free,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
