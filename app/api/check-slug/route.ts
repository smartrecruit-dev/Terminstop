import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Nur Kleinbuchstaben, Zahlen, Bindestriche; 3–40 Zeichen
const SLUG_REGEX = /^[a-z0-9-]{3,40}$/

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.toLowerCase().trim()

  if (!slug) {
    return NextResponse.json({ available: false, error: "Kein Slug angegeben" })
  }

  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({
      available: false,
      error: "Nur Kleinbuchstaben, Zahlen und Bindestriche (3–40 Zeichen)",
    })
  }

  const { data } = await supabaseAdmin
    .from("companies")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  return NextResponse.json({ available: !data })
}
