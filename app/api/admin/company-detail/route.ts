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

  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get("id")
  if (!companyId) {
    return NextResponse.json({ error: "company id fehlt" }, { status: 400 })
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const monthStart = today.substring(0, 7) + "-01"

    const [
      { data: todayAppts },
      { data: monthAppts },
      { data: customers },
      { data: services },
    ] = await Promise.all([
      supabaseAdmin
        .from("appointments")
        .select("id, name, phone, time, status, note, reminded, sms_sent_at, online_booking")
        .eq("company_id", companyId)
        .eq("date", today)
        .order("time", { ascending: true }),

      supabaseAdmin
        .from("appointments")
        .select("id, name, date, time, status, reminded")
        .eq("company_id", companyId)
        .gte("date", monthStart)
        .order("date", { ascending: false }),

      supabaseAdmin
        .from("customers")
        .select("id, name, phone, created_at")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(10),

      supabaseAdmin
        .from("services")
        .select("id, name, duration, price, active")
        .eq("company_id", companyId)
        .order("name"),
    ])

    // Stats berechnen
    const totalAppts     = (monthAppts || []).length
    const doneAppts      = (monthAppts || []).filter(a => a.status === "done").length
    const smsThisMonth   = (monthAppts || []).filter(a => a.reminded).length
    const upcomingAppts  = (monthAppts || []).filter(a => a.date >= today && a.status !== "done")

    return NextResponse.json({
      todayAppointments:   todayAppts    || [],
      monthAppointments:   monthAppts    || [],
      upcomingAppointments: upcomingAppts.slice(0, 10),
      customers:           customers     || [],
      services:            services      || [],
      stats: {
        totalThisMonth:  totalAppts,
        doneThisMonth:   doneAppts,
        smsThisMonth,
        customerCount:   (customers || []).length,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
