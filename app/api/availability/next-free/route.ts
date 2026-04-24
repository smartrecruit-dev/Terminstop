import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_REGEX = /^\d{2}:\d{2}$/

/**
 * GET /api/availability/next-free
 *   ?company_id=xxx&date=YYYY-MM-DD&time=HH:MM[&employee_id=yyy]
 *
 * Scans forward (15-min steps, 08:00–19:45, up to 14 days) to find the
 * next available appointment slot after the given date+time.
 *
 * Returns { found: true, date, time } or { found: false }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const company_id  = searchParams.get("company_id")?.trim()
  const date        = searchParams.get("date")?.trim()
  const time        = searchParams.get("time")?.trim()
  const employee_id = searchParams.get("employee_id")?.trim()

  if (!company_id || !date || !time) {
    return NextResponse.json({ error: "company_id, date und time sind Pflichtfelder" }, { status: 400 })
  }
  if (!UUID_REGEX.test(company_id)) return NextResponse.json({ error: "Ungültige company_id" }, { status: 400 })
  if (employee_id && !UUID_REGEX.test(employee_id)) return NextResponse.json({ error: "Ungültige employee_id" }, { status: 400 })
  if (!DATE_REGEX.test(date)) return NextResponse.json({ error: "Ungültiges Datum" }, { status: 400 })
  if (!TIME_REGEX.test(time)) return NextResponse.json({ error: "Ungültige Uhrzeit" }, { status: 400 })

  try {
    // ── Fetch capacity (once) ─────────────────────────────────────────────────
    const { count: empCount } = await supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("active", true)
    const capacity = Math.max(empCount ?? 0, 1)

    // ── Fetch all booked slots in the next 14 days (one query) ────────────────
    const startDate = date
    const endDt     = new Date(`${date}T${time}`)
    endDt.setDate(endDt.getDate() + 14)
    const endDate = endDt.toISOString().split("T")[0]

    const { data: booked } = await supabase
      .from("appointments")
      .select("date, time, employee_id")
      .eq("company_id", company_id)
      .in("status", ["pending", "confirmed"])
      .gte("date", startDate)
      .lte("date", endDate)

    // ── Build lookup: "date|time" → count (or set for employee-specific) ──────
    const slotCount = new Map<string, number>()          // "date|time" → total booked
    const empSlots  = new Set<string>()                  // "date|time|employee_id" → taken

    for (const a of booked ?? []) {
      if (!a.date || !a.time) continue
      const key = `${a.date}|${a.time}`
      slotCount.set(key, (slotCount.get(key) ?? 0) + 1)
      if (a.employee_id) empSlots.add(`${key}|${a.employee_id}`)
    }

    // ── Scan forward from date+time in 15-min steps ───────────────────────────
    const START_HOUR = 8    // 08:00
    const END_HOUR   = 20   // 19:45 is last slot
    const STEP_MIN   = 15

    // Start scanning from the NEXT slot after the given time
    let cursor = new Date(`${date}T${time}`)
    cursor.setMinutes(cursor.getMinutes() + STEP_MIN)

    const limit = new Date(`${date}T${time}`)
    limit.setDate(limit.getDate() + 14)

    while (cursor <= limit) {
      const h = cursor.getHours()
      const m = cursor.getMinutes()

      // Only check business hours
      if (h >= START_HOUR && (h < END_HOUR || (h === END_HOUR - 1 && m <= 45))) {
        const d = cursor.toISOString().split("T")[0]
        const t = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        const key = `${d}|${t}`

        let isFree = false
        if (employee_id) {
          isFree = !empSlots.has(`${key}|${employee_id}`)
        } else {
          isFree = (slotCount.get(key) ?? 0) < capacity
        }

        if (isFree) {
          return NextResponse.json({ found: true, date: d, time: t })
        }
      }

      // Advance 15 minutes
      cursor.setMinutes(cursor.getMinutes() + STEP_MIN)

      // If we crossed midnight, jump to start of next day at START_HOUR
      if (cursor.getHours() >= END_HOUR) {
        cursor.setDate(cursor.getDate() + 1)
        cursor.setHours(START_HOUR, 0, 0, 0)
      }
    }

    return NextResponse.json({ found: false })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
