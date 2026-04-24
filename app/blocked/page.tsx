"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

const G = "#18A66D", GL = "#F0FBF6", GB = "#D1F5E3"
const INK = "#111827", MUTED = "#6B7280", BD = "#E5E7EB"

export default function BlockedPage() {
  const [reason, setReason]   = useState<"trial" | "payment" | "cancelled" | "paused">("paused")
  const [plan,   setPlan]     = useState<string>("trial")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Konto gesperrt | TerminStop"
    // Reason aus URL
    const params = new URLSearchParams(window.location.search)
    const r = params.get("reason") as typeof reason | null
    if (r) setReason(r)
    const p = params.get("plan")
    if (p) setPlan(p)
  }, [])

  async function goToCheckout(priceId: string) {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = "/login"; return }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ priceId }),
    })
    const json = await res.json()
    setLoading(false)
    if (json.url) window.location.href = json.url
  }

  async function goToPortal() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = "/login"; return }
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const json = await res.json()
    setLoading(false)
    if (json.url) window.location.href = json.url
  }

  function handleLogout() {
    supabase.auth.signOut().then(() => {
      localStorage.removeItem("company_id")
      localStorage.removeItem("company_name")
      window.location.href = "/login"
    })
  }

  const PLANS = [
    { key: "starter",  label: "Starter",  price: "39 €/Monat",  sms: "100 SMS",   priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!  },
    { key: "pro",      label: "Pro",       price: "109 €/Monat", sms: "400 SMS",   priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!       },
    { key: "business", label: "Business",  price: "229 €/Monat", sms: "1.000 SMS", priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!  },
  ]

  const info = {
    trial: {
      icon: "⏰",
      title: "Dein Testzeitraum ist abgelaufen",
      desc:  "Du hast TerminStop 14 Tage kostenlos getestet — wähle jetzt ein Paket, um weiterzumachen. Deine Daten bleiben vollständig erhalten.",
      showPlans: true,
      showPortal: false,
    },
    payment: {
      icon: "💳",
      title: "Zahlung fehlgeschlagen",
      desc:  "Wir konnten deine letzte Zahlung nicht einziehen. Bitte aktualisiere deine Zahlungsmethode im Kundenportal, um deinen Zugang wiederherzustellen.",
      showPlans: false,
      showPortal: true,
    },
    cancelled: {
      icon: "❌",
      title: "Dein Abo wurde gekündigt",
      desc:  "Du hast dein Abo gekündigt oder es wurde beendet. Wähle ein neues Paket, um TerminStop wieder zu nutzen. Deine Daten sind sicher.",
      showPlans: true,
      showPortal: false,
    },
    paused: {
      icon: "🔒",
      title: "Konto vorübergehend gesperrt",
      desc:  "Dein Konto wurde gesperrt. Bitte wende dich an den Administrator unter terminstop.business@gmail.com.",
      showPlans: false,
      showPortal: false,
    },
  }[reason]

  return (
    <div style={{
      minHeight: "100dvh", background: "#F9FAFB",
      fontFamily: "'Inter','Manrope',sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none", fontSize: 22, fontWeight: 900, letterSpacing: "-.4px" }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: INK }}>Stop</span>
          </a>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 24, padding: "36px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>

          {/* Icon + Heading */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 52, marginBottom: 16, lineHeight: 1 }}>{info.icon}</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: INK, margin: "0 0 12px", letterSpacing: "-.4px" }}>
              {info.title}
            </h1>
            <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
              {info.desc}
            </p>
          </div>

          {/* Pakete wählen */}
          {info.showPlans && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>
                Paket wählen
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PLANS.map(p => (
                  <div key={p.key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    border: `1.5px solid ${p.key === "pro" ? G : BD}`,
                    borderRadius: 14, padding: "14px 18px",
                    background: p.key === "pro" ? GL : "#fff",
                    gap: 12, flexWrap: "wrap",
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: INK, display: "flex", alignItems: "center", gap: 8 }}>
                        {p.label}
                        {p.key === "pro" && (
                          <span style={{ fontSize: 10, fontWeight: 700, background: G, color: "#fff", padding: "2px 8px", borderRadius: 99 }}>Empfohlen</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{p.price} · {p.sms}/Monat</div>
                    </div>
                    <button
                      onClick={() => goToCheckout(p.priceId)}
                      disabled={loading}
                      style={{
                        padding: "9px 18px", borderRadius: 10, border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 13, fontWeight: 700,
                        background: p.key === "pro" ? G : "#F3F4F6",
                        color: p.key === "pro" ? "#fff" : INK,
                        opacity: loading ? 0.6 : 1, whiteSpace: "nowrap",
                      }}
                    >
                      {loading ? "…" : "Wählen →"}
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 14 }}>
                Monatlich kündbar · Keine versteckten Kosten
              </p>
            </div>
          )}

          {/* Kundenportal */}
          {info.showPortal && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={goToPortal}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 14, fontWeight: 700, background: G, color: "#fff",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Weiterleitung…" : "Zahlungsmethode aktualisieren →"}
              </button>
            </div>
          )}

          {/* Kontakt + Abmelden */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${BD}`, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <a href="mailto:terminstop.business@gmail.com" style={{ fontSize: 13, color: MUTED, textDecoration: "none" }}>
              Fragen? terminstop.business@gmail.com
            </a>
            <button onClick={handleLogout} style={{ fontSize: 13, color: MUTED, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
