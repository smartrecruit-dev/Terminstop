import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, action } = await req.json()
    if (!appointmentId || !action) {
      return NextResponse.json({ error: "appointmentId und action erforderlich" }, { status: 400 })
    }

    if (action === "confirm") {
      const { error } = await supabaseAdmin
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, action: "confirmed" })
    }

    if (action === "reject") {
      const { error } = await supabaseAdmin
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, action: "rejected" })
    }

    return NextResponse.json({ error: "Ungültige action" }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
