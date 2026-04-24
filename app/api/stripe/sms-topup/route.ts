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

// SMS-Pakete: { priceId, smsAmount, label }
// Stripe Price IDs für Einmalkauf (im Stripe-Dashboard anlegen, dann in .env setzen)
const SMS_PACKAGES = [
  {
    priceId: process.env.STRIPE_SMS_50_PRICE_ID!,
    smsAmount: 50,
    label: "50 Extra-SMS",
  },
  {
    priceId: process.env.STRIPE_SMS_100_PRICE_ID!,
    smsAmount: 100,
    label: "100 Extra-SMS",
  },
  {
    priceId: process.env.STRIPE_SMS_200_PRICE_ID!,
    smsAmount: 200,
    label: "200 Extra-SMS",
  },
]

const VALID_TOPUP_PRICE_IDS = new Set(SMS_PACKAGES.map(p => p.priceId))

export async function POST(req: NextRequest) {
  try {
    // Auth
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.replace("Bearer ", "").trim()
    if (!token) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token)
    if (authErr || !user) return NextResponse.json({ error: "Ungültige Sitzung" }, { status: 401 })

    const { priceId } = await req.json()

    if (!priceId || !VALID_TOPUP_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: "Ungültige Preis-ID" }, { status: 400 })
    }

    const pkg = SMS_PACKAGES.find(p => p.priceId === priceId)!

    // Company laden
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("id, name, stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!company) return NextResponse.json({ error: "Betrieb nicht gefunden" }, { status: 404 })

    // Stripe Customer sicherstellen
    let customerId = company.stripe_customer_id
    if (customerId) {
      try { await stripe.customers.retrieve(customerId) } catch { customerId = null }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: company.name,
        metadata: { company_id: company.id, user_id: user.id },
      })
      customerId = customer.id
      await supabaseAdmin.from("companies").update({ stripe_customer_id: customerId }).eq("id", company.id)
    }

    // Einmalige Checkout-Session (mode: "payment")
    const session = await stripe.checkout.sessions.create({
      customer:  customerId,
      mode:      "payment",
      locale:    "de",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=sms&topup=success`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=sms`,
      billing_address_collection: "auto",
      payment_method_types: ["card", "sepa_debit"],
      metadata: {
        company_id:  company.id,
        type:        "sms_topup",
        sms_amount:  String(pkg.smsAmount),
        label:       pkg.label,
      },
      custom_text: {
        submit: {
          message: `${pkg.label} für ${company.name} — werden sofort nach der Zahlung gutgeschrieben.`,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("[sms-topup]", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
