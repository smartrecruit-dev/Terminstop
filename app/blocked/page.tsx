"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

const G = "#18A66D", GL = "#F0FBF6", GB = "#D1F5E3"
const INK = "#111827", MUTED = "#6B7280", BD = "#E5E7EB"

export default function BlockedPage() {
  const [reason, setReason]   = useState<"trial" | "payment" | "cancelled" | "paused" | "sms_limit">("paused")
  const [plan,   setPlan]     = useState<string>("trial")
  useEffect(() => {
    document.title = "Konto gesperrt | TerminStop"
    // Reason aus URL
    const params = new URLSearchParams(window.location.search)
    const r = params.get("reason") as typeof reason | null
    if (r) setReason(r)
    const p = params.get("plan")
    if (p) setPlan(p)
  }, [])

  const CONTACT = "terminstop.business@gmail.com"

  function bookingMailto(label: string, price: string) {
    const subject = encodeURIComponent(`Paket-Buchung: ${label} (${price}/Monat)`)
    const body = encodeURIComponent(`Hallo,\n\nich möchte das ${label}-Paket (${price}/Monat) bei TerminStop buchen.\n\nBitte sendet mir die Zahlungsdetails (IBAN / Überweisung).\n\nViele Grüße`)
    return `mailto:${CONTACT}?subject=${subject}&body=${body}`
  }

  function handleLogout() {
    supabase.auth.signOut().then(() => {
      localStorage.removeItem("company_id")
      localStorage.removeItem("company_name")
      window.location.href = "/login"
    })
  }

  const PLANS = [
    { key: "starter",  label: "Starter",  price: "39 €",  sms: "100 SMS"   },
    { key: "pro",      label: "Pro",       price: "109 €", sms: "400 SMS"   },
    { key: "business", label: "Business",  price: "229 €", sms: "1.000 SMS" },
  ]

  const IconSVG = ({ path, color }: { path: string; color: string }) => (
    <div style={{ width: 64, height: 64, background: `${color}15`, border: `2px solid ${color}25`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
      <svg width="28" height="28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </div>
  )

  const info = {
    trial: {
      icon: <IconSVG color="#F59E0B" path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
      title: "Dein Testzeitraum ist abgelaufen",
      desc:  "Du hast TerminStop 14 Tage kostenlos getestet — wähle jetzt ein Paket, um weiterzumachen. Deine Daten bleiben vollständig erhalten.",
      showPlans: true,
      showPortal: false,
    },
    payment: {
      icon: <IconSVG color="#DC2626" path="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />,
      title: "Zahlung fehlgeschlagen",
      desc:  "Wir konnten deine letzte Zahlung nicht einziehen. Bitte aktualisiere deine Zahlungsmethode im Kundenportal, um deinen Zugang wiederherzustellen.",
      showPlans: false,
      showPortal: true,
    },
    cancelled: {
      icon: <IconSVG color="#6B7280" path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
      title: "Dein Abo wurde gekündigt",
      desc:  "Du hast dein Abo gekündigt oder es wurde beendet. Wähle ein neues Paket, um TerminStop wieder zu nutzen. Deine Daten sind sicher.",
      showPlans: true,
      showPortal: false,
    },
    paused: {
      icon: <IconSVG color="#6B7280" path="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />,
      title: "Konto vorübergehend gesperrt",
      desc:  "Dein Konto wurde gesperrt. Bitte wende dich an den Administrator unter terminstop.business@gmail.com.",
      showPlans: false,
      showPortal: false,
    },
    sms_limit: {
      icon: <IconSVG color="#F59E0B" path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
      title: "SMS-Kontingent aufgebraucht",
      desc:  "Du hast dein kostenloses SMS-Kontingent (100 SMS) im Testzeitraum aufgebraucht. Wähle ein Paket, um unbegrenzt weiterzumachen. Deine Daten bleiben vollständig erhalten.",
      showPlans: true,
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
            {info.icon}
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
                    <a
                      href={bookingMailto(p.label, p.price)}
                      style={{
                        padding: "9px 18px", borderRadius: 10,
                        fontSize: 13, fontWeight: 700, textDecoration: "none",
                        background: p.key === "pro" ? G : "#F3F4F6",
                        color: p.key === "pro" ? "#fff" : INK,
                        whiteSpace: "nowrap", display: "inline-block",
                      }}
                    >
                      Jetzt buchen →
                    </a>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 14 }}>
                Monatlich kündbar · Keine versteckten Kosten
              </p>
            </div>
          )}

          {/* Zahlung fehlgeschlagen → per E-Mail melden */}
          {info.showPortal && (
            <div style={{ marginTop: 24 }}>
              <a
                href={`mailto:${CONTACT}?subject=${encodeURIComponent("Zahlung fehlgeschlagen – Hilfe benötigt")}&body=${encodeURIComponent("Hallo,\n\nbei meinem TerminStop-Konto ist eine Zahlung fehlgeschlagen. Bitte helft mir, das zu lösen.\n\nViele Grüße")}`}
                style={{
                  display: "block", width: "100%", padding: "13px", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, background: G, color: "#fff",
                  textDecoration: "none", textAlign: "center",
                }}
              >
                Per E-Mail Kontakt aufnehmen →
              </a>
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
