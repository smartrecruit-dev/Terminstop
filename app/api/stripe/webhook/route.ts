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

// Map Stripe Price IDs → plan names
function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!]: "starter",
    [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!]:     "pro",
    [process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!]:"business",
  }
  return map[priceId] || "starter"
}

// SMS limits per plan
function getSmsLimit(plan: string): number {
  return plan === "business" ? 1000 : plan === "pro" ? 400 : 100
}

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── Zahlung erfolgreich: Abo aktivieren ──
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "subscription") break

        const companyId      = session.metadata?.company_id
        const plan           = session.metadata?.plan || "starter"
        const subscriptionId = session.subscription as string
        const customerId     = session.customer as string

        if (!companyId) break

        await supabaseAdmin
          .from("companies")
          .update({
            stripe_customer_id:     customerId,
            stripe_subscription_id: subscriptionId,
            plan:                   plan,
            paused:                 false,
            sms_limit:              getSmsLimit(plan),
          })
          .eq("id", companyId)

        console.log(`[webhook] Activated ${plan} for company ${companyId}`)
        break
      }

      // ── Abo aktualisiert (Plan-Wechsel) ──
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const companyId = sub.metadata?.company_id
        if (!companyId) break

        const priceId = sub.items.data[0]?.price?.id
        const plan    = priceId ? getPlanFromPriceId(priceId) : "starter"

        // Only update if subscription is active
        if (sub.status === "active" || sub.status === "trialing") {
          await supabaseAdmin
            .from("companies")
            .update({
              plan:      plan,
              paused:    false,
              sms_limit: getSmsLimit(plan),
            })
            .eq("id", companyId)

          console.log(`[webhook] Updated plan to ${plan} for company ${companyId}`)
        }
        break
      }

      // ── Zahlung fehlgeschlagen ──
      case "invoice.payment_failed": {
        const invoice   = event.data.object as Stripe.Invoice & { subscription?: string | null }
        const subId     = typeof invoice.subscription === "string" ? invoice.subscription : null
        if (!subId) break

        const sub = await stripe.subscriptions.retrieve(subId)
        const companyId = sub.metadata?.company_id
        if (!companyId) break

        // Pause the company — they can re-activate via Customer Portal
        await supabaseAdmin
          .from("companies")
          .update({ paused: true })
          .eq("id", companyId)

        console.log(`[webhook] Payment failed — paused company ${companyId}`)
        break
      }

      // ── Abo gekündigt ──
      case "customer.subscription.deleted": {
        const sub       = event.data.object as Stripe.Subscription
        const companyId = sub.metadata?.company_id
        if (!companyId) break

        await supabaseAdmin
          .from("companies")
          .update({ plan: "cancelled", paused: true })
          .eq("id", companyId)

        console.log(`[webhook] Subscription cancelled for company ${companyId}`)
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }
  } catch (e: any) {
    console.error("[webhook] Handler error:", e.message)
    return NextResponse.json({ error: "Handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
