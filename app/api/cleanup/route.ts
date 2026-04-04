import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { error, count } = await supabase
      .from("appointments")
      .delete({ count: "exact" })
      .lt("date", new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    if (error) {
      console.log("CLEANUP ERROR:", error)
      return NextResponse.json({ success: false, error })
    }

    console.log(`✅ CLEANUP: ${count} alte Termine gelöscht`)
    return NextResponse.json({ success: true, deleted: count })

  } catch (err) {
    console.log("GLOBAL ERROR:", err)
    return NextResponse.json({ success: false, error: err })
  }
}
