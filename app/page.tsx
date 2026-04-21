"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { ReactNode, CSSProperties } from "react"

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — Refined palette built on existing #18A66D
═══════════════════════════════════════════════════════════════ */
const C = {
  green:        "#18A66D",
  greenHover:   "#149A63",
  greenDeep:    "#0F8A57",
  greenInk:     "#0A6B43",
  greenSoft:    "#F0FBF6",
  greenSofter:  "#F7FCF9",
  greenBorder:  "#D1F5E3",
  greenGlow:    "rgba(24,166,109,0.18)",

  ink:          "#0A0F1A",
  text:         "#0F1B2D",
  text2:        "#384559",
  muted:        "#5B6779",
  muted2:       "#8A95A6",
  muted3:       "#B8C0CC",

  bg:           "#FFFFFF",
  bg2:          "#FAFBFC",
  bg3:          "#F4F6F9",
  surface:      "#FFFFFF",

  border:       "#E8ECF1",
  borderSoft:   "#F1F4F8",
  divider:      "#EFF2F6",
}

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif"
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════════ */
function Counter({ to, suffix = "", prefix = "", duration = 1800 }: {
  to: number; suffix?: string; prefix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.45 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration])
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.85s ${EASE} ${delay}ms, transform 0.85s ${EASE} ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD MOCK — Premium browser preview
═══════════════════════════════════════════════════════════════ */
function DashboardMock() {
  const appts = [
    { time: "09:00", name: "Michael B.", service: "Haarschnitt", status: "confirmed" },
    { time: "10:30", name: "Sarah L.",   service: "Coloring",    status: "confirmed" },
    { time: "12:00", name: "Klaus W.",   service: "Bart",        status: "pending"   },
    { time: "14:00", name: "Anna P.",    service: "Haarschnitt", status: "confirmed" },
    { time: "15:30", name: "Tim R.",     service: "Styling",     status: "confirmed" },
  ]
  return (
    <div style={{
      background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden",
      boxShadow: "0 30px 80px -20px rgba(15,27,45,0.18), 0 8px 24px -8px rgba(15,27,45,0.08)",
      fontFamily: "inherit",
    }}>
      {/* Browser chrome */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.borderSoft}`, padding: "11px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 7, padding: "5px 14px", fontSize: 11, color: C.muted2, textAlign: "center", maxWidth: 280, margin: "0 auto", fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
          app.terminstop.de/dashboard
        </div>
      </div>

      {/* App header */}
      <div style={{ borderBottom: `1px solid ${C.borderSoft}`, padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>
          <span style={{ color: C.text }}>Termin</span><span style={{ color: C.green }}>Stop</span>
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Online-Buchung Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "4px 10px", animation: `popIn 0.6s ${EASE} 0.8s both` }}>
            <span style={{ width: 6, height: 6, background: "#F59E0B", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#92400E" }}>2 neue Anfragen</span>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <span style={{ width: 7, height: 7, background: C.green, borderRadius: "50%", boxShadow: `0 0 0 3px ${C.greenSoft}` }} />
            <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>System aktiv</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 22px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
          {[
            { label: "Heute",        val: "5",  icon: "📅" },
            { label: "SMS gesendet", val: "4",  icon: "✉️" },
            { label: "Online-Anfr.", val: "2",  icon: "🔔", highlight: true },
          ].map((s, i) => (
            <div key={i} style={{ background: s.highlight ? "#FFFBEB" : C.bg2, border: `1px solid ${s.highlight ? "#FDE68A" : C.borderSoft}`, borderRadius: 11, padding: "11px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: s.highlight ? "#D97706" : C.text, lineHeight: 1.2, letterSpacing: "-0.5px" }}>{s.val}</div>
              <div style={{ fontSize: 10, color: C.muted2, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Online-Buchung Anfragen */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 14px", marginBottom: 14, animation: `slideUp 0.5s ${EASE} 0.2s both` }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>🔔 Neue Online-Anfragen</div>
          {[
            { name: "Julia M.", service: "Haarschnitt", time: "Fr, 14:00" },
            { name: "David K.", service: "Coloring",    time: "Sa, 10:30" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderTop: i > 0 ? "1px solid #FDE68A" : "none" }}>
              <div style={{ width: 24, height: 24, background: "#FEF3C7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#92400E", flexShrink: 0 }}>{r.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{r.name} · {r.service}</div>
                <div style={{ fontSize: 10, color: C.muted2 }}>Wunschtermin: {r.time}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, background: C.green, color: "#fff", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>✓ OK</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 9 }}>Heutige Termine</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {appts.slice(0, 4).map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", background: a.status === "pending" ? "#FFFBEB" : C.bg2, border: `1px solid ${a.status === "pending" ? "#FDE68A" : C.borderSoft}`, borderRadius: 10, animation: `slideUp 0.5s ${EASE} ${0.3 + i * 0.06}s both` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, width: 38, flexShrink: 0 }}>{a.time}</div>
              <div style={{ width: 28, height: 28, background: a.status === "pending" ? "#FEF3C7" : C.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: a.status === "pending" ? "#92400E" : "#fff", fontWeight: 800, flexShrink: 0 }}>
                {a.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <div style={{ fontSize: 10, color: C.muted2 }}>{a.service}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 980, background: a.status === "pending" ? "#FEF3C7" : C.greenSoft, color: a.status === "pending" ? "#B45309" : C.greenInk }}>
                {a.status === "pending" ? "Ausstehend" : "✓ SMS"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING PAGE MOCK — Phone showing booking flow
═══════════════════════════════════════════════════════════════ */
function BookingMock() {
  return (
    <div style={{ width: 220, position: "relative", margin: "0 auto" }}>
      {/* Phone frame */}
      <div style={{ background: "#0F1923", borderRadius: 36, padding: 10, boxShadow: "0 30px 80px -10px rgba(15,27,45,0.35), 0 10px 24px -8px rgba(15,27,45,0.2)", border: "6px solid #1a2535" }}>
        {/* Notch */}
        <div style={{ width: 70, height: 18, background: "#0F1923", borderRadius: "0 0 12px 12px", margin: "0 auto 6px" }} />
        {/* Screen */}
        <div style={{ background: "#fff", borderRadius: 26, overflow: "hidden", minHeight: 380 }}>
          {/* Dark hero header */}
          <div style={{ background: "linear-gradient(160deg, #0F1923 0%, #1a2e20 100%)", padding: "14px 14px 16px", position: "relative" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: .8, marginBottom: 5 }}>Online-Buchung</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #18A66D, #15955F)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>FM</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "-.3px" }}>Friseur Müller</div>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: "12px 12px 8px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#111827", marginBottom: 10 }}>Wie kann ich dir helfen?</div>
            {/* Option cards */}
            {[
              { icon: "✂️", label: "Leistung buchen", sub: "3 Leistungen verfügbar", bg: "#F0FBF6", border: "#D1F5E3", active: true },
              { icon: "🗓️", label: "Termin anfragen", sub: "Wunschtermin wählen", bg: "#EEF2FF", border: "#C7D2FE", active: false },
              { icon: "📞", label: "Rückruf anfragen", sub: "Ich werde zurückgerufen", bg: "#FFF7ED", border: "#FED7AA", active: false },
            ].map((opt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${opt.active ? "#18A66D" : opt.border}`, background: opt.active ? opt.bg : "#fff", marginBottom: 6, transition: "all .15s" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: opt.bg, border: `1px solid ${opt.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{opt.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#111827" }}>{opt.label}</div>
                  <div style={{ fontSize: 9, color: "#9CA3AF" }}>{opt.sub}</div>
                </div>
                {opt.active && <div style={{ marginLeft: "auto", width: 14, height: 14, borderRadius: "50%", background: "#18A66D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: 8, fontWeight: 900 }}>✓</span>
                </div>}
              </div>
            ))}
            {/* Trust signals */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10, padding: "8px 0", borderTop: "1px solid #F3F4F6" }}>
              {["🔒 Sicher", "⚡ 2 Min.", "✓ Kostenlos"].map((t, i) => (
                <span key={i} style={{ fontSize: 8, color: "#9CA3AF", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
            {/* Powered by */}
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <span style={{ fontSize: 8, color: "#9CA3AF" }}>Powered by <strong style={{ color: "#18A66D" }}>TerminStop</strong></span>
            </div>
          </div>
        </div>
      </div>
      {/* QR Code floating badge */}
      <div style={{ position: "absolute", bottom: -10, right: -24, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "8px 10px", boxShadow: "0 8px 24px -6px rgba(15,27,45,0.16)", animation: `popIn 0.6s ${EASE} 0.9s both` }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#6B7280", marginBottom: 4 }}>QR-Code</div>
        {/* Mini QR placeholder */}
        <div style={{ width: 44, height: 44, background: "#F3F4F6", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⬛</div>
        <div style={{ fontSize: 7, color: "#9CA3AF", marginTop: 3, textAlign: "center" }}>Scannen & buchen</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PHONE SMS MOCK
═══════════════════════════════════════════════════════════════ */
function SmsMock() {
  return (
    <div style={{
      width: 240, background: "#1C1C1E", borderRadius: 40,
      padding: 11, boxShadow: "0 30px 70px -10px rgba(15,27,45,0.30), 0 10px 24px -8px rgba(15,27,45,0.15)",
      border: "7px solid #2C2C2E", position: "relative",
    }}>
      <div style={{
        width: 86, height: 22, background: "#1C1C1E",
        borderRadius: "0 0 16px 16px", margin: "0 auto 8px",
        position: "relative", zIndex: 2,
      }} />
      <div style={{ background: "#fff", borderRadius: 30, overflow: "hidden", minHeight: 340, padding: "16px 14px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 11, color: "#111", fontWeight: 600, marginBottom: 16, padding: "0 4px",
        }}>
          <span>9:41</span>
          <span style={{ fontSize: 9 }}>● ● ●</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, background: C.greenSoft,
            border: `1px solid ${C.greenBorder}`,
            borderRadius: "50%", margin: "0 auto 7px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>💈</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>Friseur Müller</div>
          <div style={{ fontSize: 10, color: "#8E8E93" }}>SMS-Nachricht</div>
        </div>
        <div style={{
          background: "#E9E9EB", borderRadius: "18px 18px 18px 4px",
          padding: "11px 14px", fontSize: 12.5, color: "#111", lineHeight: 1.5, marginBottom: 8,
          animation: `popIn 0.6s ${EASE} 0.3s both`,
        }}>
          Hallo Michael, zur Erinnerung: Ihr Termin bei <strong>Friseur Müller</strong> ist morgen um <strong>10:00 Uhr</strong>. Bis dann! 👋
        </div>
        <div style={{ fontSize: 10, color: "#8E8E93", marginLeft: 4, marginBottom: 16 }}>Heute, 14:00 Uhr · automatisch</div>
        <div style={{
          background: "#F2F2F7", borderRadius: 20, padding: "9px 14px",
          fontSize: 11, color: "#8E8E93", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <span>Nachricht</span>
          <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>↑</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════ */
const REG_OPEN = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [heroWord, setHeroWord] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const words        = ["Friseur.", "Werkstatt.", "Praxis.", "Studio.", "Betrieb."]
  const wordArticles = ["Ihren",   "Ihre",       "Ihre",   "Ihr",    "Ihren"]

  useEffect(() => {
    const t = setInterval(() => setHeroWord((w: number) => (w + 1) % words.length), 2600)
    return () => clearInterval(t)
  }, [words.length])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [navOpen])

  /* ═══ DATA ═══ */
  const reviews = [
    {
      text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Das System läuft einfach.",
      name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle",
    },
    {
      text: "Ich habe 10 Minuten gebraucht, um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.",
      name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h / Woche",
    },
    {
      text: "Endlich kein Papierchaos mehr. Ich sehe alle Termine auf einen Blick und die SMS gehen automatisch raus. Meine Kunden fragen mich, wie ich das mache.",
      name: "Mehmet A.", role: "Kfz-Werkstatt", city: "Stuttgart", result: "0 Ausfälle / Woche",
    },
  ]

  const faqs = [
    {
      q: "Ist TerminStop nur für SMS-Erinnerungen?",
      a: "Nein — SMS-Erinnerungen sind nur eine von vier Funktionen. TerminStop ist Ihr komplettes digitales Terminbüro: digitaler Kalender, Kundenkartei, automatische SMS-Erinnerungen und Auswertungen. Alles in einem System.",
    },
    {
      q: "Muss ich eine App installieren oder etwas technisch einrichten?",
      a: "Nein. TerminStop läuft komplett im Browser — keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich.",
    },
    {
      q: "Funktioniert das auch für meinen Betrieb — ich bin kein IT-Unternehmen?",
      a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder Werkstätten — keine Vorkenntnisse nötig. Das Onboarding machen wir gemeinsam mit Ihnen.",
    },
    {
      q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?",
      a: "Nein. TerminStop ist monatlich kündbar — ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes.",
    },
    {
      q: "Ist die Online-Buchungsseite in allen Paketen enthalten?",
      a: "Ja — die eigene Buchungsseite mit QR-Code ist ab sofort in jedem Paket inklusive, ohne Aufpreis. Kunden können damit rund um die Uhr Termine anfragen — ohne anzurufen. Die Anfragen landen direkt in Ihrem Dashboard. Sie bestätigen mit einem Klick, und der Kunde bekommt automatisch eine SMS.",
    },
    {
      q: "Wie sieht es mit Datenschutz und DSGVO aus?",
      a: "Alle Daten werden DSGVO-konform in Deutschland verarbeitet. Sie erhalten einen Auftragsverarbeitungsvertrag (AVV) und behalten jederzeit volle Kontrolle über Ihre Kundendaten.",
    },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage", "Steuerberater", "Coaching"]

  const features = [
    {
      icon: "📅",
      accent: "#10B981",
      label: "Vollautomatisch",
      title: "SMS-Erinnerungen",
      desc: "24h vor jedem Termin geht eine personalisierte SMS raus — mit Ihrem Namen, ohne Ihr Zutun. Nie wieder hinterhertelefonieren.",
      proof: "Ihre Kunden werden zuverlässig erinnert. Sie tun nichts.",
    },
    {
      icon: "👥",
      accent: "#6366F1",
      label: "Voller Überblick",
      title: "Kundenkartei",
      desc: "Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist — und wer nicht.",
      proof: "Alle Kundendaten griffbereit, auf jedem Gerät.",
    },
    {
      icon: "🗓️",
      accent: "#F59E0B",
      label: "Immer aktuell",
      title: "Digitaler Kalender",
      desc: "Tag-, Wochen- und Monatsansicht auf Handy, Tablet oder PC. Nie wieder Zettelwirtschaft — alles an einem Ort.",
      proof: "Von unterwegs erreichbar — jederzeit, überall.",
    },
    {
      icon: "📊",
      accent: "#EC4899",
      label: "Datengestützt",
      title: "Auswertungen & Einblicke",
      desc: "Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb schwarz auf weiß.",
      proof: "Entscheidungen auf Basis echter Zahlen — nicht nach Gefühl.",
    },
  ]

  const bookingFeatures = [
    { icon: "🔗", title: "Eigene Buchungsseite",         desc: "Ihre persönliche URL — Kunden buchen direkt, ohne Telefonanruf." },
    { icon: "📲", title: "QR-Code zum Aufstellen",       desc: "An der Kasse oder im Schaufenster — Kunden scannen und buchen sofort." },
    { icon: "📥", title: "Anfragen im Dashboard",        desc: "Alle Online-Buchungen landen direkt bei Ihnen. Sie bestätigen mit einem Klick." },
    { icon: "✉️", title: "Automatische Bestätigungs-SMS", desc: "Sobald Sie bestätigen, bekommt der Kunde sofort eine SMS — ohne Ihr Zutun." },
    { icon: "🗂️", title: "Leistungen wählbar",           desc: "Kunden wählen Ihre Leistungen oder fragen einen offenen Termin an." },
    { icon: "📞", title: "Rückruf-Funktion",             desc: "Kunden können auch einen Rückruf anfragen — Sie werden benachrichtigt." },
  ]

  return (
    <>
      <style>{`
        :root {
          --green: ${C.green};
          --green-deep: ${C.greenDeep};
          --green-soft: ${C.greenSoft};
          --green-border: ${C.greenBorder};
          --text: ${C.text};
          --muted: ${C.muted};
        }

        html { scroll-behavior: smooth; }

        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(10px) scale(0.96); filter:blur(2px); }
          15%, 80% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
          100% { opacity:0; transform:translateY(-10px) scale(0.96); filter:blur(2px); }
        }
        @keyframes marquee   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes popIn     { 0%{opacity:0;transform:translateY(14px) scale(0.96)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp   { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.85} }
        @keyframes drift     { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-12px) scale(1.04)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes drift2    { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,14px) scale(1.05)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes shine     { 0%{transform:translateX(-120%)} 60%,100%{transform:translateX(220%)} }
        @keyframes navIn     { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        .word-slot   { animation: wordIn 2.6s ${EASE}; display:inline-block; }
        .marquee-wrap{ animation: marquee 42s linear infinite; }
        .pulse-dot   { animation: pulseDot 2.4s ease-in-out infinite; }
        .drift-a     { animation: drift 14s ease-in-out infinite; }
        .drift-b     { animation: drift2 18s ease-in-out infinite; }

        /* ─── Buttons ─── */
        .btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          font-family:inherit; font-weight:700; cursor:pointer; text-decoration:none;
          border-radius:12px; letter-spacing:-0.1px; line-height:1;
          transition: background 200ms ${EASE_OUT}, color 200ms ${EASE_OUT}, border-color 200ms ${EASE_OUT}, box-shadow 280ms ${EASE_OUT}, transform 220ms ${EASE_OUT};
          position:relative; overflow:hidden; isolation:isolate;
        }
        .btn-primary {
          background: ${C.green}; color:#fff; border:1px solid ${C.green};
          box-shadow: 0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 20px -4px ${C.greenGlow};
        }
        .btn-primary::after {
          content:""; position:absolute; inset:0;
          background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
          transform:translateX(-120%); pointer-events:none;
        }
        .btn-primary:hover { background:${C.greenHover}; border-color:${C.greenHover}; box-shadow: 0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 32px -6px ${C.greenGlow}; transform:translateY(-1px); }
        .btn-primary:hover::after { animation: shine 1.1s ${EASE_OUT}; }
        .btn-primary:active { transform:translateY(0); }

        .btn-outline {
          background:#fff; color:${C.text}; border:1px solid ${C.border};
        }
        .btn-outline:hover { border-color:${C.green}; color:${C.green}; background:${C.greenSofter}; }

        .btn-white {
          background:#fff; color:${C.greenInk}; border:1px solid #fff;
          box-shadow: 0 6px 20px -6px rgba(0,0,0,0.15);
        }
        .btn-white:hover { background:${C.greenSoft}; transform:translateY(-1px); box-shadow:0 10px 28px -6px rgba(0,0,0,0.18); }

        .btn-ghost-light {
          background:rgba(255,255,255,0.10); color:#fff; border:1px solid rgba(255,255,255,0.30);
          backdrop-filter: blur(8px);
        }
        .btn-ghost-light:hover { background:rgba(255,255,255,0.18); border-color:rgba(255,255,255,0.55); }

        /* ─── Tags ─── */
        .tag-green {
          display:inline-flex; align-items:center; gap:7px;
          background:${C.greenSoft}; border:1px solid ${C.greenBorder};
          color:${C.greenInk}; font-size:12px; font-weight:700; letter-spacing:0.3px;
          padding:6px 14px; border-radius:980px;
        }
        .tag-green .dot {
          width:6px; height:6px; background:${C.green}; border-radius:50%;
          box-shadow: 0 0 0 3px ${C.greenSoft}, 0 0 12px ${C.greenGlow};
        }

        /* ─── Card lift ─── */
        .lift {
          transition: box-shadow 280ms ${EASE_OUT}, transform 280ms ${EASE_OUT}, border-color 280ms ${EASE_OUT};
        }
        .lift:hover {
          box-shadow: 0 18px 44px -16px rgba(15,27,45,0.16), 0 4px 14px -6px rgba(15,27,45,0.08);
          transform: translateY(-3px);
          border-color: ${C.muted3};
        }

        /* ─── Nav links ─── */
        .nav-link {
          font-size:14px; color:${C.muted}; text-decoration:none; font-weight:500;
          padding:8px 14px; border-radius:9px; position:relative;
          transition: color 180ms, background 180ms;
        }
        .nav-link:hover { color:${C.text}; background:${C.bg2}; }
        .nav-link.active { color:${C.green}; }
        .nav-link .new-pill {
          background:${C.greenSoft}; border:1px solid ${C.greenBorder};
          border-radius:980px; padding:2px 8px; font-size:10px; color:${C.green};
          font-weight:700; margin-right:6px; letter-spacing:0.4px;
        }

        /* ─── FAQ ─── */
        .faq-row { border-bottom:1px solid ${C.divider}; }
        .faq-row:first-child { border-top:1px solid ${C.divider}; }
        .faq-btn {
          background:none; border:none; cursor:pointer; width:100%; text-align:left;
          padding:22px 26px; display:flex; justify-content:space-between; align-items:center; gap:18px;
          font-family:inherit; transition: background 180ms;
        }
        .faq-btn:hover { background:${C.bg2}; }
        .faq-q { font-size:16px; font-weight:700; color:${C.text}; line-height:1.4; letter-spacing:-0.2px; }
        .faq-icon {
          width:28px; height:28px; border-radius:50%;
          background:${C.bg2}; border:1px solid ${C.border};
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          font-size:18px; line-height:1; color:${C.muted};
          transition: transform 320ms ${EASE_OUT}, background 200ms, color 200ms, border-color 200ms;
        }
        .faq-row.open .faq-icon { background:${C.green}; color:#fff; border-color:${C.green}; transform:rotate(45deg); }
        .faq-body {
          overflow:hidden; max-height:0;
          transition: max-height 460ms ${EASE_OUT};
        }
        .faq-row.open .faq-body { max-height:400px; }
        .faq-body-inner { padding:0 26px 24px; font-size:15px; color:${C.muted}; line-height:1.75; }

        /* ─── Mobile drawer ─── */
        .drawer-backdrop {
          position:fixed; inset:0; background:rgba(10,15,26,0.45);
          backdrop-filter: blur(4px); z-index:99;
          opacity:0; pointer-events:none; transition:opacity 280ms ${EASE_OUT};
        }
        .drawer-backdrop.open { opacity:1; pointer-events:auto; }
        .drawer {
          position:fixed; top:0; right:0; bottom:0; width:88vw; max-width:340px;
          background:#fff; z-index:100; transform:translateX(100%);
          transition: transform 380ms ${EASE_OUT};
          padding:28px 24px; display:flex; flex-direction:column; gap:6px;
          box-shadow: -20px 0 50px -10px rgba(15,27,45,0.16);
        }
        .drawer.open { transform:translateX(0); }
        .drawer a { padding:14px 12px; font-size:16px; color:${C.text}; text-decoration:none; font-weight:600; border-radius:10px; transition: background 180ms; }
        .drawer a:hover { background:${C.bg2}; }

        /* ─── Hero gradient mesh ─── */
        .mesh-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
        .mesh-blob { position:absolute; border-radius:50%; filter: blur(72px); opacity:0.6; }

        /* ─── Hide-on-mobile / show-on-mobile ─── */
        .hide-mobile { display:initial; }
        .show-mobile { display:none; }
        @media (max-width:860px){
          .hide-mobile { display:none !important; }
          .show-mobile { display:initial !important; }
        }
        @media (max-width:860px){
          .nav-cta-long { display:none !important; }
          .nav-cta-short { display:inline !important; }
        }
        .nav-cta-long  { display:inline; }
        .nav-cta-short { display:none; }

        @media (max-width: 860px) {
          .sec-pad        { padding-top:72px !important; padding-bottom:72px !important; padding-left:22px !important; padding-right:22px !important; }
          .hero-pad       { padding-top:96px !important; padding-bottom:32px !important; padding-left:22px !important; padding-right:22px !important; }
          .hero-h1        { font-size:44px !important; letter-spacing:-2px !important; line-height:1.05 !important; }
          .sms-float      { display:none !important; }
          .stack-mobile   { flex-direction:column !important; }
          .reverse-mobile { flex-direction:column-reverse !important; }
          .nav-pad        { padding:0 18px !important; }
        }

        /* ─── Responsive Grids ─── */
        .grid-2col { grid-template-columns: repeat(2, 1fr) !important; }
        .grid-3col { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 860px) {
          .grid-2col { grid-template-columns: 1fr !important; }
          .grid-3col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .grid-3col { grid-template-columns: 1fr !important; }
        }

        /* ─── Reduce motion ─── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div style={{ fontFamily: FONT, color: C.text, background: C.bg, overflowX: "hidden" }}>

        {/* ═══════════════ NAVBAR ═══════════════ */}
        <nav
          className="nav-pad"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            height: scrolled ? 60 : 72,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 32px",
            background: scrolled ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
            transition: `height 280ms ${EASE_OUT}, background 280ms ${EASE_OUT}, border-color 280ms ${EASE_OUT}`,
          }}
        >
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenDeep} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px -2px ${C.greenGlow}`,
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: "-0.5px" }}>T</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>
              Termin<span style={{ color: C.green }}>Stop</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <a href="#wie-es-funktioniert" className="nav-link">So funktioniert's</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#preise" className="nav-link">Preise</a>
            <a href="/demo" className="nav-link" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
              Live-Demo
            </a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="/login" className="nav-link">Login</a>
          </div>

          {/* CTA + mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {REG_OPEN
              ? <a href="/register" className="btn btn-primary hide-mobile" style={{ fontSize: 14, padding: "11px 20px" }}>Kostenlos starten <span style={{ marginLeft: 2 }}>→</span></a>
              : <span className="btn btn-primary hide-mobile" style={{ fontSize: 14, padding: "11px 20px", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
            }

            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setNavOpen(true)}
              aria-label="Menü öffnen"
              style={{
                width: 52, height: 42, borderRadius: 10,
                background: C.bg2, border: `1px solid ${C.border}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4, cursor: "pointer", padding: "6px 10px",
              }}
            >
              <span style={{ width: 20, height: 2, background: C.text, borderRadius: 2 }} />
              <span style={{ width: 20, height: 2, background: C.text, borderRadius: 2 }} />
              <span style={{ width: 20, height: 2, background: C.text, borderRadius: 2 }} />
              <span style={{ fontSize: 8, fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginTop: 1 }}>MENÜ</span>
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div className={`drawer-backdrop ${navOpen ? "open" : ""}`} onClick={() => setNavOpen(false)} />
        <aside className={`drawer ${navOpen ? "open" : ""}`} aria-hidden={!navOpen}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Menü</span>
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Menü schließen"
              style={{ width: 36, height: 36, borderRadius: 8, background: C.bg2, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 18, color: C.text }}
            >×</button>
          </div>
          <a href="#wie-es-funktioniert" onClick={() => setNavOpen(false)}>So funktioniert's</a>
          <a href="#features" onClick={() => setNavOpen(false)}>Features</a>
          <a href="#preise" onClick={() => setNavOpen(false)}>Preise</a>
          <a href="/demo" onClick={() => setNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
            Live-Demo ansehen
          </a>
          <a href="#faq" onClick={() => setNavOpen(false)}>FAQ</a>
          <a href="/login" onClick={() => setNavOpen(false)}>Login</a>
          <div style={{ height: 12 }} />
          <a href="/demo" className="btn btn-outline" onClick={() => setNavOpen(false)} style={{ fontSize: 15, padding: "13px 20px", justifyContent: "center", marginBottom: 8 }}>
            Live-Demo ansehen →
          </a>
          {REG_OPEN
            ? <a href="/register" className="btn btn-primary" onClick={() => setNavOpen(false)} style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center" }}>Kostenlos starten →</a>
            : <span className="btn btn-primary" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
          }
        </aside>

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="hero-pad" style={{
          paddingTop: 124, paddingBottom: 24, paddingLeft: 32, paddingRight: 32,
          position: "relative", overflow: "hidden",
          background: `linear-gradient(180deg, ${C.greenSofter} 0%, ${C.bg} 60%)`,
        }}>
          {/* Mesh blobs */}
          <div className="mesh-bg">
            <div className="mesh-blob drift-a" style={{
              top: -120, left: -80, width: 460, height: 460,
              background: `radial-gradient(circle, ${C.green} 0%, transparent 70%)`,
              opacity: 0.18,
            }} />
            <div className="mesh-blob drift-b" style={{
              top: 80, right: -120, width: 520, height: 520,
              background: `radial-gradient(circle, #6EE7B7 0%, transparent 70%)`,
              opacity: 0.22,
            }} />
            <div className="mesh-blob" style={{
              top: 280, left: "40%", width: 380, height: 380,
              background: `radial-gradient(circle, #BBF7D0 0%, transparent 70%)`,
              opacity: 0.28,
            }} />
          </div>

          {/* Subtle grid overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(24,166,109,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(24,166,109,0.045) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, black 30%, transparent 100%)",
          }} />

          <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
            {/* Top text */}
            <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 56px" }}>
              <Reveal>
                <div className="tag-green" style={{ marginBottom: 28 }}>
                  <span className="dot pulse-dot" />
                  <span>Digitales Terminbüro für <span key={`art-${heroWord}`} className="word-slot">{wordArticles[heroWord]}</span>&nbsp;
                    <span style={{ fontWeight: 800 }} key={heroWord} className="word-slot">{words[heroWord]}</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="hero-h1" style={{
                  fontSize: "clamp(46px, 7vw, 88px)", fontWeight: 900,
                  lineHeight: 1.0, letterSpacing: "-3px",
                  margin: "0 0 26px", color: C.ink,
                }}>
                  Ihr Betrieb.{" "}
                  <span style={{
                    background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenDeep} 50%, ${C.greenInk} 100%)`,
                    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                    display: "inline-block",
                  }}>
                    Automatisch.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p style={{
                  fontSize: "clamp(17px, 2vw, 19px)", color: C.muted,
                  lineHeight: 1.65, maxWidth: 560, margin: "0 auto 38px", fontWeight: 400,
                }}>
                  TerminStop ersetzt Zettelwirtschaft und Hinterhertelefonieren — mit Kalender, Kundenkartei und automatischen SMS-Erinnerungen. In 10 Minuten eingerichtet.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
                  {REG_OPEN
                    ? <a href="/register" className="btn btn-primary" style={{ fontSize: 16, padding: "16px 30px" }}>14 Tage gratis starten <span>→</span></a>
                    : <span className="btn btn-primary" style={{ fontSize: 16, padding: "16px 30px", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
                  }
                  <a href="/demo" className="btn btn-outline" style={{ fontSize: 16, padding: "16px 26px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, background: "#18A66D", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
                    Live-Demo ansehen
                  </a>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: C.muted2 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.green, fontWeight: 800 }}>✓</span> 14 Tage kostenlos
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.green, fontWeight: 800 }}>✓</span> Kein Vertrag
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.green, fontWeight: 800 }}>✓</span> Monatlich kündbar
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Dashboard preview */}
            <Reveal delay={300} y={40}>
              <div style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
                <DashboardMock />

                {/* Floating SMS badge */}
                <div className="sms-float" style={{
                  position: "absolute", bottom: 50, right: -56, zIndex: 10,
                  animation: `popIn 0.7s ${EASE} 0.7s both`,
                }}>
                  <div style={{
                    background: "#fff", border: `1px solid ${C.border}`,
                    borderRadius: 16, padding: "14px 18px",
                    boxShadow: "0 18px 50px -12px rgba(15,27,45,0.20)",
                    maxWidth: 240,
                  }}>
                    <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <div style={{
                        width: 36, height: 36,
                        background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
                        borderRadius: 10, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0,
                        boxShadow: `0 4px 12px -2px ${C.greenGlow}`,
                      }}>✉️</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 3 }}>SMS verschickt</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                          „Hallo Michael, Ihr Termin ist morgen um 10:00 Uhr..."
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: C.muted2, marginTop: 10, textAlign: "right" }}>
                      Gerade eben · automatisch
                    </div>
                  </div>
                </div>

                {/* Bottom fade */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
                  background: `linear-gradient(to bottom, transparent, ${C.bg})`,
                  pointerEvents: "none",
                }} />
              </div>
            </Reveal>
          </div>

          {/* Stats bar */}
          <Reveal delay={400}>
            <div style={{
              maxWidth: 920, margin: "32px auto 0",
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 18, padding: "8px",
              boxShadow: "0 12px 40px -16px rgba(15,27,45,0.10)",
            }}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {[
                  { to: 50,  suffix: "+",   label: "Betriebe aktiv" },
                  { to: 95,  suffix: "%",   label: "Weniger Ausfälle" },
                  { to: 10,  suffix: " Min", label: "Einrichtung" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: "1 1 160px", padding: "20px 16px",
                    borderRight: i < 2 ? `1px solid ${C.borderSoft}` : "none",
                    textAlign: "center",
                  }}>
                    <div style={{
                      fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 900,
                      color: C.text, letterSpacing: "-1.2px", lineHeight: 1,
                    }}>
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted2, marginTop: 6, fontWeight: 600, letterSpacing: "0.2px" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ INDUSTRY MARQUEE ═══════════════ */}
        <div style={{
          borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
          padding: "16px 0", overflow: "hidden", background: C.bg2,
          position: "relative",
        }}>
          {/* Side fades */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${C.bg2}, transparent)`, pointerEvents: "none", zIndex: 2 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${C.bg2}, transparent)`, pointerEvents: "none", zIndex: 2 }} />

          <div style={{ display: "flex" }}>
            <div className="marquee-wrap" style={{ display: "flex", gap: 50, flexShrink: 0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
                  <div style={{ width: 5, height: 5, background: C.green, borderRadius: "50%", opacity: 0.6 }} />
                  <span style={{ fontSize: 13, color: C.muted, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.1px" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ PROBLEM / BEFORE-AFTER ═══════════════ */}
        <section className="sec-pad" style={{ padding: "112px 32px", background: C.bg }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 64px" }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>Das Problem</div>
                <h2 style={{
                  fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 900,
                  letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 16px", color: C.ink,
                }}>
                  So läuft es heute.<br />So sollte es laufen.
                </h2>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                  Jeder Ausfall ist bares Geld. Und meistens wäre er vermeidbar gewesen.
                </p>
              </div>
            </Reveal>

            {/* Before/After */}
            <div className="stack-mobile" style={{ display: "flex", gap: 18, marginBottom: 64 }}>
              <Reveal delay={0} style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  background: "#FFF8F8", border: "1px solid #FECACA", borderRadius: 18,
                  padding: "32px", height: "100%", boxSizing: "border-box",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 36, height: 36, background: "#FEE2E2", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>😤</div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: "#991B1B", letterSpacing: "-0.3px" }}>Ohne TerminStop</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      "Kunden erscheinen nicht — ohne Vorwarnung",
                      "Hinterhertelefonieren kostet täglich Zeit",
                      "Termine auf Zetteln oder im Kopf",
                      "Keine Übersicht, wer kommt und wer nicht",
                      "Umsatz geht verloren, ohne dass man es merkt",
                    ].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#FEE2E2", color: "#DC2626",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2,
                        }}>×</span>
                        <span style={{ fontSize: 14.5, color: "#7F1D1D", lineHeight: 1.55 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120} style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  background: `linear-gradient(180deg, ${C.greenSoft} 0%, #FFFFFF 100%)`,
                  border: `1px solid ${C.greenBorder}`, borderRadius: 18,
                  padding: "32px", height: "100%", boxSizing: "border-box",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: -40, right: -40, width: 160, height: 160,
                    background: `radial-gradient(circle, ${C.green} 0%, transparent 70%)`,
                    opacity: 0.12, pointerEvents: "none",
                  }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                      <div style={{
                        width: 36, height: 36,
                        background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
                        borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: "#fff", boxShadow: `0 4px 12px -2px ${C.greenGlow}`,
                      }}>✓</div>
                      <span style={{ fontWeight: 800, fontSize: 16, color: C.greenInk, letterSpacing: "-0.3px" }}>Mit TerminStop</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        "SMS-Erinnerung 24h vorher — automatisch",
                        "Kein Anrufen mehr — läuft von alleine",
                        "Alle Termine digital, immer griffbereit",
                        "Voller Überblick über Auslastung und Kunden",
                        "Weniger Ausfälle = mehr Umsatz, jeden Monat",
                      ].map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                          <span style={{
                            width: 20, height: 20, borderRadius: "50%",
                            background: C.green, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2,
                          }}>✓</span>
                          <span style={{ fontSize: 14.5, color: C.greenInk, lineHeight: 1.55, fontWeight: 500 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {[
                { to: 50,  suffix: "€", pre: "bis ", label: "Verlust pro Ausfall",  desc: "Jeder verpasste Termin ist Umsatz, der nicht stattfindet.", accent: false },
                { to: 9,   suffix: "×", pre: "bis ", label: "Ausfälle pro Woche",   desc: "Im Schnitt erlebt jeder Betrieb mehrfach wöchentlich Ausfälle.", accent: false },
                { to: 2000, suffix: "€", pre: "bis ", label: "Verlust pro Monat",   desc: "Was wenig klingt, summiert sich zu Tausenden im Jahr.", accent: true },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="lift" style={{
                    padding: "34px 28px",
                    background: item.accent ? `linear-gradient(180deg, ${C.greenSoft}, #fff)` : C.bg2,
                    border: `1px solid ${item.accent ? C.greenBorder : C.border}`,
                    borderRadius: 18, boxSizing: "border-box", height: "100%",
                  }}>
                    <div style={{
                      fontSize: "clamp(38px, 5vw, 56px)", fontWeight: 900,
                      color: item.accent ? C.greenInk : C.text,
                      marginBottom: 12, letterSpacing: "-2.2px", lineHeight: 1,
                    }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 7, letterSpacing: "-0.2px" }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section id="wie-es-funktioniert" className="sec-pad" style={{
          padding: "112px 32px", background: C.bg2, position: "relative",
        }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
            <Reveal>
              <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto 64px" }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>So funktioniert's</div>
                <h2 style={{
                  fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 900,
                  letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 16px", color: C.ink,
                }}>
                  Drei Schritte.<br />Dann läuft alles.
                </h2>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                  Kein IT-Studium. Kein Aufwand. Für immer.
                </p>
              </div>
            </Reveal>

            <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {[
                { num: "01", icon: "🤝", tag: "Persönliche Begleitung", title: "Einmalig einrichten — in unter 10 Minuten",
                  desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Kalender, Kundenkartei und SMS-Erinnerungen. Persönliches Onboarding inklusive.",
                  detail: "Sie brauchen nur Ihren Browser." },
                { num: "02", icon: "⚡", tag: "Vollautomatisch", title: "Ihr digitales Büro läuft — sofort und automatisch",
                  desc: "Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen 24h vor jedem Termin automatisch raus — mit Ihrem Namen.",
                  detail: "Ohne Ihr Zutun. Tag und Nacht." },
                { num: "03", icon: "📈", tag: "95% Erfolgsquote", title: "Ihr Betrieb läuft planbarer. Jeden Tag.",
                  desc: "Weniger Ausfälle, mehr Überblick, mehr Umsatz. TerminStop arbeitet dauerhaft für Sie im Hintergrund.",
                  detail: "Kunden, die kommen. Umsatz, der bleibt." },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 110}>
                  <div className="lift" style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18,
                    padding: "30px", height: "100%", boxSizing: "border-box",
                    boxShadow: "0 1px 4px rgba(15,27,45,0.04)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${C.green}, ${C.greenDeep})`,
                      opacity: 0.6,
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                      <div style={{
                        width: 50, height: 50,
                        background: `linear-gradient(135deg, ${C.greenSoft}, #fff)`,
                        border: `1px solid ${C.greenBorder}`, borderRadius: 14,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      }}>{s.icon}</div>
                      <span style={{
                        fontSize: 44, fontWeight: 900, color: C.bg3,
                        letterSpacing: "-2.5px", lineHeight: 1, userSelect: "none",
                      }}>{s.num}</span>
                    </div>
                    <div style={{
                      display: "inline-block", background: C.greenSoft,
                      border: `1px solid ${C.greenBorder}`, color: C.greenInk,
                      fontSize: 11, fontWeight: 700, padding: "4px 11px",
                      borderRadius: 980, marginBottom: 14, letterSpacing: "0.4px",
                    }}>{s.tag}</div>
                    <h3 style={{
                      fontSize: 17, fontWeight: 800, color: C.text,
                      margin: "0 0 11px", letterSpacing: "-0.4px", lineHeight: 1.3,
                    }}>{s.title}</h3>
                    <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.7, margin: "0 0 16px" }}>{s.desc}</p>
                    <div style={{
                      background: C.bg2, borderRadius: 9, padding: "11px 14px",
                      fontSize: 12.5, color: C.greenInk, fontWeight: 600,
                      borderLeft: `3px solid ${C.green}`, lineHeight: 1.5,
                    }}>→ {s.detail}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section id="features" className="sec-pad" style={{ padding: "112px 32px", background: C.bg }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto 60px" }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>Alles inklusive</div>
                <h2 style={{
                  fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 900,
                  letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 16px", color: C.ink,
                }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe — alles in einem.
                </p>
              </div>
            </Reveal>

            <div className="grid-2col" style={{ display: "grid", gap: 18 }}>
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="lift" style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18,
                    padding: "34px", height: "100%", boxSizing: "border-box",
                    boxShadow: "0 1px 4px rgba(15,27,45,0.04)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 18 }}>
                      <div style={{
                        width: 54, height: 54,
                        background: `linear-gradient(135deg, ${f.accent}15, ${f.accent}08)`,
                        border: `1px solid ${f.accent}30`,
                        borderRadius: 15, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 24, flexShrink: 0,
                      }}>{f.icon}</div>
                      <div>
                        <div style={{
                          fontSize: 10.5, fontWeight: 700, color: f.accent,
                          letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 5,
                        }}>{f.label}</div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>{f.title}</h3>
                      </div>
                    </div>
                    <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.75, margin: "0 0 18px" }}>{f.desc}</p>
                    <div style={{
                      background: C.bg2, borderRadius: 9, padding: "11px 14px",
                      fontSize: 13, color: C.text, fontWeight: 600,
                      borderLeft: `3px solid ${f.accent}`, lineHeight: 1.45,
                    }}>{f.proof}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140}>
              <div style={{
                marginTop: 22, background: `linear-gradient(180deg, ${C.greenSoft}, #fff)`,
                border: `1px solid ${C.greenBorder}`, borderRadius: 16,
                padding: "26px 30px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 22, flexWrap: "wrap",
              }}>
                <div>
                  <span style={{ color: C.text, fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>Alles in einem Paket.</span>
                  <span style={{ color: C.muted, fontSize: 14, marginLeft: 12 }}>Monatlich kündbar · Kein Vertrag</span>
                </div>
                <a href="/lead" className="btn btn-primary" style={{ fontSize: 14, padding: "12px 24px", flexShrink: 0 }}>
                  Kostenlos testen →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ SMS SECTION ═══════════════ */}
        <section className="sec-pad" style={{
          padding: "112px 32px", background: C.bg2, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: -100, right: -100, width: 400, height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.green} 0%, transparent 70%)`,
            opacity: 0.08, pointerEvents: "none",
          }} />

          <div className="reverse-mobile" style={{
            maxWidth: 1080, margin: "0 auto", display: "flex", gap: 72,
            alignItems: "center", justifyContent: "center", flexWrap: "wrap", position: "relative",
          }}>
            <Reveal delay={0}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <SmsMock />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div style={{ flex: 1, minWidth: 280, maxWidth: 480 }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>So sieht's aus</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900,
                  letterSpacing: "-1.8px", lineHeight: 1.08,
                  margin: "0 0 20px", color: C.ink,
                }}>
                  Jeder Kunde bekommt eine SMS — automatisch.
                </h2>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, margin: "0 0 30px" }}>
                  24 Stunden vor dem Termin geht eine persönliche SMS raus — mit dem Namen Ihres Betriebs. Kein Anruf, keine manuelle Arbeit, keine vergessenen Erinnerungen.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    "Personalisiert mit Ihrem Betriebsnamen",
                    "Automatisch — 24h vor dem Termin",
                    "Funktioniert für alle Kunden gleichzeitig",
                    "Sie müssen gar nichts tun",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{
                        width: 26, height: 26,
                        background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
                        borderRadius: 8, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0,
                        boxShadow: `0 2px 8px -2px ${C.greenGlow}`,
                      }}>✓</span>
                      <span style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32 }}>
                  <a href="/lead" className="btn btn-primary" style={{ fontSize: 15, padding: "14px 26px" }}>
                    Jetzt kostenlos testen →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ REVIEWS ═══════════════ */}
        <section className="sec-pad" style={{ padding: "112px 32px", background: C.bg }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>Echte Ergebnisse</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900,
                  letterSpacing: "-1.8px", lineHeight: 1.05, margin: 0, color: C.ink,
                }}>
                  Was Betriebe berichten.
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="lift" style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18,
                    padding: "28px", display: "flex", flexDirection: "column",
                    height: "100%", boxSizing: "border-box",
                    boxShadow: "0 1px 4px rgba(15,27,45,0.04)",
                  }}>
                    <div style={{ color: "#F59E0B", fontSize: 14, letterSpacing: 3, marginBottom: 18 }}>★★★★★</div>
                    <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.75, flex: 1, marginBottom: 22, fontWeight: 400 }}>
                      „{r.text}"
                    </p>
                    <div style={{
                      paddingTop: 18, borderTop: `1px solid ${C.divider}`,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 38, height: 38,
                          background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
                          color: "#fff", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 900, flexShrink: 0,
                          boxShadow: `0 4px 10px -2px ${C.greenGlow}`,
                        }}>{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, letterSpacing: "-0.2px" }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: C.muted2 }}>{r.role} · {r.city}</div>
                        </div>
                      </div>
                      <div style={{
                        background: C.greenSoft, border: `1px solid ${C.greenBorder}`,
                        color: C.greenInk, fontSize: 11, fontWeight: 700,
                        padding: "5px 11px", borderRadius: 980, whiteSpace: "nowrap",
                      }}>✓ {r.result}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ ONLINE-BUCHUNG (inklusive) ═══════════════ */}
        <section id="online-buchung" style={{
          padding: "0 0 0", background: "#0F1923", position: "relative", overflow: "hidden",
        }}>
          {/* Background orbs */}
          <div style={{ position: "absolute", top: -120, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,166,109,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,166,109,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Hero split row */}
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "100px 32px 80px", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>

            {/* LEFT: copy */}
            <div style={{ flex: "1 1 400px", minWidth: 0 }}>
              <Reveal>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(24,166,109,0.18)", border: "1px solid rgba(24,166,109,0.35)", borderRadius: 100, padding: "5px 14px" }}>
                    <span style={{ width: 6, height: 6, background: "#18A66D", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#4ade80", textTransform: "uppercase", letterSpacing: 1 }}>In allen Paketen inklusive</span>
                  </div>
                </div>
                <h2 style={{
                  fontSize: "clamp(34px, 4.5vw, 58px)", fontWeight: 900,
                  letterSpacing: "-2.5px", lineHeight: 1.0, margin: "0 0 20px", color: "#fff",
                }}>
                  Kunden buchen<br /><span style={{ color: "#18A66D" }}>rund um die Uhr.</span>
                </h2>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 460 }}>
                  Jedes Paket enthält Ihre eigene Buchungsseite — mit QR-Code, automatischer Bestätigungs-SMS und allem was dazugehört. Kunden buchen selbst, Sie bestätigen mit einem Klick. Kein Aufpreis, kein Extra-Abo.
                </p>

                {/* Included callout */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(24,166,109,0.12)", border: "1px solid rgba(24,166,109,0.3)", borderRadius: 16, padding: "18px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Kein Aufpreis</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: "#4ade80", letterSpacing: "-1px", lineHeight: 1 }}>inklusive</span>
                      <span style={{ fontSize: 20 }}>🎁</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>in jedem Paket ab dem 1. Tag</div>
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>✓ &nbsp;Eigene URL für Ihre Buchungsseite</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>✓ &nbsp;QR-Code sofort druckfertig</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>✓ &nbsp;Bestätigungs-SMS automatisch</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>✓ &nbsp;Kein Extra-Abo nötig</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {REG_OPEN
                    ? <a href="/register" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "linear-gradient(135deg, #18A66D, #15955F)",
                        color: "#fff", fontWeight: 800, fontSize: 15,
                        padding: "15px 28px", borderRadius: 12, textDecoration: "none",
                        boxShadow: "0 4px 20px rgba(24,166,109,0.4)",
                        letterSpacing: "-0.2px",
                      }}>
                        Jetzt kostenlos starten
                        <span style={{ fontSize: 18 }}>→</span>
                      </a>
                    : <span style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(24,166,109,0.3)",
                        color: "#fff", fontWeight: 800, fontSize: 15,
                        padding: "15px 28px", borderRadius: 12,
                        opacity: 0.7, cursor: "default",
                      }}>🔒 Bald verfügbar</span>
                  }
                  <a href="/demo/buchung" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff", fontWeight: 600, fontSize: 15,
                    padding: "15px 24px", borderRadius: 12, textDecoration: "none",
                    letterSpacing: "-0.2px",
                  }}>
                    <span style={{ width: 7, height: 7, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
                    Live-Demo ansehen
                  </a>
                </div>
              </Reveal>
            </div>

            {/* RIGHT: phone mockup */}
            <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Reveal delay={120}>
                <div style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.5))" }}>
                  <BookingMock />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Feature grid strip — dark cards */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 32px" }}>
              <div className="grid-3col" style={{ display: "grid", gap: 14 }}>
                {bookingFeatures.map((f, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className="lift" style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 14, padding: "22px", height: "100%", boxSizing: "border-box",
                      transition: "border-color .2s, background .2s",
                    }}>
                      <div style={{
                        width: 42, height: 42,
                        background: "rgba(24,166,109,0.15)",
                        border: "1px solid rgba(24,166,109,0.25)", borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 19, marginBottom: 14,
                      }}>{f.icon}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.2px" }}>{f.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{f.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section style={{ padding: "112px 32px", background: "#fff" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>

            {/* Stats Bar */}
            <Reveal>
              <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 80, flexWrap: "wrap" }}>
                {[
                  { value: "1.200+", label: "Betriebe vertrauen uns" },
                  { value: "94%",    label: "weniger Terminausfälle" },
                  { value: "4,9 ★",  label: "Kundenbewertung" },
                  { value: "10 Min", label: "bis zur ersten SMS" },
                ].map((stat, i) => (
                  <div key={i} style={{ flex: "1 1 180px", textAlign: "center", padding: "24px 20px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: "-1px", marginBottom: 6 }}>{stat.value}</div>
                    <div style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Section Header */}
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <div className="tag-green" style={{ marginBottom: 16 }}>Kundenstimmen</div>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: C.ink, margin: "0 0 16px", letterSpacing: "-.8px", lineHeight: 1.15 }}>
                  Betriebe wie deiner.<br />Ergebnisse, die überzeugen.
                </h2>
                <p style={{ fontSize: 17, color: C.muted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                  Von Friseuren bis Werkstätten — TerminStop funktioniert für jeden Betrieb.
                </p>
              </div>
            </Reveal>

            {/* Testimonial Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {[
                {
                  quote: "Seit TerminStop haben wir kaum noch Ausfälle. Früher haben wir jeden Montag eine Stunde lang Kunden angerufen — das fällt komplett weg.",
                  name: "Sandra M.",
                  role: "Friseursalon, München",
                  avatar: "SM",
                  stars: 5,
                  delay: 0,
                },
                {
                  quote: "Einrichten hat 10 Minuten gedauert. Seitdem läuft alles automatisch. Meine Kunden fragen sogar schon nach der SMS wenn sie mal ausbleibt.",
                  name: "Tobias K.",
                  role: "KFZ-Werkstatt, Hamburg",
                  avatar: "TK",
                  stars: 5,
                  delay: 60,
                },
                {
                  quote: "Ich hatte Bedenken wegen der Technik — aber die Buchungsseite haben meine Kunden sofort verstanden. Super einfach für alle Altersgruppen.",
                  name: "Petra W.",
                  role: "Kosmetikstudio, Berlin",
                  avatar: "PW",
                  stars: 5,
                  delay: 120,
                },
                {
                  quote: "Das Preis-Leistungs-Verhältnis ist unschlagbar. Für weniger als einen Kaffee pro Tag spare ich jeden Monat mehrere Stunden.",
                  name: "Marco F.",
                  role: "Physiotherapie, Stuttgart",
                  avatar: "MF",
                  stars: 5,
                  delay: 40,
                },
                {
                  quote: "Endlich keine Zettelwirtschaft mehr. Alle Termine auf einen Blick, die Kundenkartei ist Gold wert — und die SMS laufen von alleine.",
                  name: "Lena B.",
                  role: "Nagelstudio, Köln",
                  avatar: "LB",
                  stars: 5,
                  delay: 80,
                },
                {
                  quote: "Wir haben TerminStop zuerst skeptisch getestet. Nach einer Woche waren wir überzeugt. Die Ausfallquote ist um fast 90% gesunken.",
                  name: "Andreas R.",
                  role: "Zahnarztpraxis, Frankfurt",
                  avatar: "AR",
                  stars: 5,
                  delay: 120,
                },
              ].map((t, i) => (
                <Reveal key={i} delay={t.delay}>
                  <div className="lift" style={{
                    background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20,
                    padding: "28px 28px", boxShadow: "0 2px 16px -6px rgba(15,27,45,0.07)",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: 2 }}>
                      {"★★★★★".split("").map((s, j) => (
                        <span key={j} style={{ color: "#F59E0B", fontSize: 16 }}>{s}</span>
                      ))}
                    </div>
                    {/* Quote */}
                    <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.65, margin: 0, flex: 1 }}>
                      „{t.quote}"
                    </p>
                    {/* Author */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                        background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenDeep} 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800, color: "#fff",
                      }}>
                        {t.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Trust Badges */}
            <Reveal delay={100}>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 64, flexWrap: "wrap" }}>
                {[
                  { icon: "🔒", label: "SSL verschlüsselt" },
                  { icon: "🇩🇪", label: "Made in Germany" },
                  { icon: "📋", label: "DSGVO-konform" },
                  { icon: "⚡", label: "Keine Einrichtungsgebühr" },
                  { icon: "❌", label: "Jederzeit kündbar" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 980, padding: "8px 16px" }}>
                    <span style={{ fontSize: 14 }}>{b.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </section>

        {/* ═══════════════ PRICING ═══════════════ */}
        <section id="preise" className="sec-pad" style={{ padding: "112px 32px", background: C.bg3 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>Preise</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900,
                  letterSpacing: "-2px", lineHeight: 1.0, margin: "0 0 18px", color: C.ink,
                }}>
                  Alles inklusive.<br />Kein Kleingedrucktes.
                </h2>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.6, maxWidth: 500, margin: "0 auto 32px" }}>
                  Buchungsseite, Kalender, Kundenkartei & SMS-Erinnerungen — in jedem Paket von Anfang an dabei.
                  <br />Monatlich kündbar. 14 Tage kostenlos testen — ohne Kreditkarte.
                </p>
              </div>
            </Reveal>

            {/* ── Included-in-all banner ── */}
            <Reveal delay={40}>
              <div style={{
                display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap",
                marginBottom: 48,
              }}>
                {[
                  "🗓️ Online-Kalender",
                  "📲 Buchungsseite + QR-Code",
                  "👥 Kundenkartei",
                  "💬 SMS-Erinnerungen",
                  "📊 Auswertungen",
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: C.greenSoft, border: `1px solid ${C.greenBorder}`,
                    borderRadius: 980, padding: "7px 16px",
                    fontSize: 13, fontWeight: 600, color: C.greenInk,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }} className="grid-3col">

              {/* ── Starter ── */}
              <Reveal delay={0}>
                <div className="lift" style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 22,
                  padding: "38px 32px", display: "flex", flexDirection: "column",
                  boxShadow: "0 2px 16px -6px rgba(15,27,45,0.08)", height: "100%",
                }}>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Starter</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: C.ink, letterSpacing: "-2px", lineHeight: 1 }}>39</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.muted2, marginBottom: 10 }}>€&nbsp;/&nbsp;Monat</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.muted2, fontWeight: 500, marginBottom: 8 }}>1,30 € pro Tag — weniger als ein Kaffee</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 20 }}>✓ 14 Tage gratis testen</div>
                  </div>
                  <div style={{ height: 1, background: C.borderSoft, marginBottom: 26 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 13, marginBottom: 32 }}>
                    {[
                      ["Bis zu 100 SMS / Monat", true],
                      ["Buchungsseite + QR-Code", true],
                      ["Online-Kalender", true],
                      ["Kundenkartei", true],
                      ["Automatische SMS-Erinnerungen", true],
                      ["Auswertungen & Einblicke", false],
                      ["Prioritäts-Support", false],
                    ].map(([f, active], i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: active ? C.text2 : C.muted3, fontWeight: active ? 500 : 400 }}>
                        <span style={{ color: active ? C.green : C.muted3, fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{active ? "✓" : "–"}</span> {f as string}
                      </div>
                    ))}
                  </div>
                  {REG_OPEN
                    ? <a href="/register" className="btn btn-outline" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center" }}>14 Tage kostenlos testen →</a>
                    : <span className="btn btn-outline" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
                  }
                </div>
              </Reveal>

              {/* ── Pro (Empfohlen) ── */}
              <Reveal delay={80}>
                <div style={{
                  background: `linear-gradient(165deg, ${C.greenDeep} 0%, ${C.greenInk} 100%)`,
                  border: `2px solid ${C.greenDeep}`, borderRadius: 22,
                  padding: "38px 32px", display: "flex", flexDirection: "column",
                  boxShadow: `0 28px 70px -20px rgba(10,107,67,0.45), 0 8px 24px -8px rgba(15,27,45,0.12)`,
                  position: "relative", overflow: "hidden",
                  transform: "scale(1.04)", zIndex: 2, height: "100%",
                }}>
                  <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                  <div style={{ position: "absolute", bottom: -40, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
                  <div style={{
                    position: "absolute", top: 20, right: 20,
                    background: "#fff", color: C.greenInk,
                    fontSize: 11, fontWeight: 800, padding: "5px 13px",
                    borderRadius: 980, letterSpacing: 0.4,
                    boxShadow: "0 2px 8px -2px rgba(0,0,0,0.15)",
                  }}>
                    ⭐ Beliebtestes Paket
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Pro</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>109</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>€&nbsp;/&nbsp;Monat</span>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginBottom: 8 }}>3,63 € pro Tag · 4× mehr SMS als Starter</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6EE7B7", marginBottom: 20 }}>✓ 14 Tage gratis testen</div>
                  </div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 26 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 13, marginBottom: 32 }}>
                    {[
                      "Bis zu 400 SMS / Monat",
                      "Buchungsseite + QR-Code",
                      "Online-Kalender",
                      "Kundenkartei",
                      "Automatische SMS-Erinnerungen",
                      "Auswertungen & Einblicke",
                      "Prioritäts-Support",
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>
                        <span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                  {REG_OPEN
                    ? <a href="/register" className="btn btn-white" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center", position: "relative", zIndex: 1 }}>14 Tage kostenlos testen →</a>
                    : <span className="btn btn-white" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center", opacity: 0.7, cursor: "default", position: "relative", zIndex: 1 }}>🔒 Bald verfügbar</span>
                  }
                </div>
              </Reveal>

              {/* ── Business ── */}
              <Reveal delay={160}>
                <div className="lift" style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 22,
                  padding: "38px 32px", display: "flex", flexDirection: "column",
                  boxShadow: "0 2px 16px -6px rgba(15,27,45,0.08)", height: "100%",
                }}>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Business</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: C.ink, letterSpacing: "-2px", lineHeight: 1 }}>229</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.muted2, marginBottom: 10 }}>€&nbsp;/&nbsp;Monat</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.muted2, fontWeight: 500, marginBottom: 8 }}>7,63 € pro Tag · bis 1.000 SMS monatlich</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 20 }}>✓ 14 Tage gratis testen</div>
                  </div>
                  <div style={{ height: 1, background: C.borderSoft, marginBottom: 26 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 13, marginBottom: 32 }}>
                    {[
                      "Bis zu 1.000 SMS / Monat",
                      "Buchungsseite + QR-Code",
                      "Online-Kalender",
                      "Kundenkartei",
                      "Automatische SMS-Erinnerungen",
                      "Auswertungen & Einblicke",
                      "Dedizierter Support",
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: C.text2, fontWeight: 500 }}>
                        <span style={{ color: C.green, fontWeight: 800, fontSize: 15, flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                  {REG_OPEN
                    ? <a href="/register" className="btn btn-outline" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center" }}>14 Tage kostenlos testen →</a>
                    : <span className="btn btn-outline" style={{ fontSize: 15, padding: "14px 20px", justifyContent: "center", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
                  }
                </div>
              </Reveal>
            </div>

            {/* ── Bottom reassurance ── */}
            <Reveal delay={200}>
              <div style={{ marginTop: 48 }}>
                {/* Risk-free row */}
                <div style={{
                  display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap",
                  marginBottom: 24,
                }}>
                  {[
                    { icon: "🔒", text: "Keine Kreditkarte für den Test" },
                    { icon: "❌", text: "Jederzeit kündbar" },
                    { icon: "⚡", text: "In 10 Minuten startklar" },
                    { icon: "🇩🇪", text: "DSGVO-konform" },
                  ].map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.muted, fontWeight: 500 }}>
                      <span>{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign: "center", fontSize: 14, color: C.muted2, lineHeight: 1.8, margin: 0 }}>
                  Über 1.000 SMS pro Monat?{" "}
                  <a href="mailto:hallo@terminstop.de" style={{ color: C.green, fontWeight: 700, textDecoration: "none" }}>
                    Individuelles Angebot anfragen →
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section id="faq" className="sec-pad" style={{ padding: "112px 32px", background: C.bg }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 52 }}>
                <div className="tag-green" style={{ marginBottom: 20 }}>FAQ</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900,
                  letterSpacing: "-1.8px", lineHeight: 1.05, margin: 0, color: C.ink,
                }}>
                  Häufige Fragen.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 18, overflow: "hidden",
                boxShadow: "0 1px 4px rgba(15,27,45,0.04)",
              }}>
                {faqs.map((faq, i) => (
                  <div key={i} className={`faq-row ${openFaq === i ? "open" : ""}`}>
                    <button
                      className="faq-btn"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="faq-q">{faq.q}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-body">
                      <div className="faq-body-inner">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="sec-pad" style={{
          padding: "112px 32px",
          background: `linear-gradient(135deg, ${C.greenDeep} 0%, ${C.green} 50%, ${C.greenInk} 100%)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative shapes */}
          <div style={{
            position: "absolute", top: -100, left: -50, width: 360, height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -120, right: -80, width: 480, height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          }} />

          <Reveal>
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.6px",
                padding: "7px 16px", borderRadius: 980, marginBottom: 26, textTransform: "uppercase",
                backdropFilter: "blur(8px)",
              }}>
                <span style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} className="pulse-dot" />
                Jetzt loslegen
              </div>
              <h2 style={{
                fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 900,
                letterSpacing: "-2.2px", lineHeight: 1.0,
                margin: "0 0 20px", color: "#fff",
              }}>
                Starten Sie noch heute.
              </h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, margin: "0 0 42px", fontWeight: 400 }}>
                14 Tage gratis testen. Kein Vertrag, keine Kreditkarte nötig.<br />In 5 Minuten live — monatlich kündbar.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                {REG_OPEN
                  ? <a href="/register" className="btn btn-white" style={{ fontSize: 16, padding: "16px 34px" }}>Jetzt kostenlos starten <span>→</span></a>
                  : <span className="btn btn-white" style={{ fontSize: 16, padding: "16px 34px", opacity: 0.7, cursor: "default" }}>🔒 Bald verfügbar</span>
                }
                <a href="/login" className="btn btn-ghost-light" style={{ fontSize: 16, padding: "16px 28px" }}>
                  Bereits Kunde? Login
                </a>
              </div>
              <div style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
                {["✓ 14 Tage gratis", "✓ Kein Vertrag", "✓ Monatlich kündbar"].map((t, i) => (
                  <span key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, padding: "48px 32px 32px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              gap: 32, flexWrap: "wrap", marginBottom: 32,
            }}>
              <div style={{ maxWidth: 320 }}>
                <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>T</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>
                    Termin<span style={{ color: C.green }}>Stop</span>
                  </span>
                </a>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                  Das digitale Terminbüro für Dienstleistungsbetriebe — automatische SMS, Kalender und Kundenkartei in einem.
                </p>
              </div>
              <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Produkt</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {[
                      { href: "#features", label: "Features" },
                      { href: "#wie-es-funktioniert", label: "So funktioniert's" },
                      { href: "#preise", label: "Preise" },
                      { href: "#faq", label: "FAQ" },
                    ].map(l => (
                      <a key={l.label} href={l.href} style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>{l.label}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Account</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {REG_OPEN
                      ? <a href="/register" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>Registrieren</a>
                      : <span style={{ fontSize: 13.5, color: C.muted2, fontWeight: 500 }}>Registrieren (bald)</span>
                    }
                    <a href="/login" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>Login</a>
                    <a href="#preise" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>Preise</a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted2, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Rechtliches</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <a href="/impressum" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>Impressum</a>
                    <a href="/datenschutz" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>Datenschutz</a>
                    <a href="/agb" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>AGB</a>
                    <a href="/avv" style={{ fontSize: 13.5, color: C.text2, textDecoration: "none", fontWeight: 500 }}>AVV</a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              borderTop: `1px solid ${C.border}`, paddingTop: 22,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 14,
            }}>
              <div style={{ fontSize: 12, color: C.muted2 }}>
                © {new Date().getFullYear()} TerminStop · Alle Rechte vorbehalten
              </div>
              <div style={{ fontSize: 12, color: C.muted2, display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%" }} className="pulse-dot" />
                Made in Germany · DSGVO-konform
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
