import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json()
    if (!access_token) {
      return NextResponse.json({ error: "Kein Token" }, { status: 400 })
    }

    // Token verifizieren und User ermitteln
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(access_token)
    if (userError || !user) {
      return NextResponse.json({ error: "Ungültiger Token" }, { status: 401 })
    }

    // Company per Service Role suchen (umgeht RLS komplett)
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("id, name, paused")
      .eq("user_id", user.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: "Konto nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json({ company })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
