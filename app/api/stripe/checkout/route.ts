import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_PRICE_IDS = new Set([
  process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
])

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.replace("Bearer ", "").trim()
    if (!token) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token)
    if (authErr || !user) return NextResponse.json({ error: "Ungültige Sitzung" }, { status: 401 })

    const { priceId } = await req.json()

    // Whitelist check
    if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: "Ungültige Preis-ID" }, { status: 400 })
    }

    // Load company
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("id, name, stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!company) return NextResponse.json({ error: "Betrieb nicht gefunden" }, { status: 404 })

    // Get or create Stripe Customer
    let customerId = company.stripe_customer_id

    // Verify customer exists in current Stripe mode (test vs live)
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId)
      } catch {
        // Customer doesn't exist in this mode — create a new one
        customerId = null
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: company.name,
        metadata: { company_id: company.id, user_id: user.id },
      })
      customerId = customer.id

      await supabaseAdmin
        .from("companies")
        .update({ stripe_customer_id: customerId })
        .eq("id", company.id)
    }

    // Determine plan name for metadata
    const planMap: Record<string, string> = {
      [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!]: "starter",
      [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!]:     "pro",
      [process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!]:"business",
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/#preise`,
      metadata: {
        company_id: company.id,
        plan: planMap[priceId] || "starter",
      },
      subscription_data: {
        metadata: {
          company_id: company.id,
          plan: planMap[priceId] || "starter",
        },
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("[stripe/checkout]", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
