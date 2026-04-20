"use client"

import { useState } from "react"

// ── Farben ────────────────────────────────────────────────────────────────────
const G = {
  green: "#18A66D", greenDeep: "#15955F", greenInk: "#0D6B46",
  greenSoft: "#F0FBF6", greenBorder: "#D1F5E3",
  ink: "#111827", text: "#374151", muted: "#6B7280", muted2: "#9CA3AF",
  bg: "#fff", bg2: "#F9FAFB", border: "#E5E7EB",
  dark: "#0F1923",
}

// ── Interactive Phone Mockup ───────────────────────────────────────────────────
function PhoneDemo({ onComplete }: { onComplete?: (name: string, phone: string, date: string, time: string) => void }) {
  const [step, setStep] = useState(0)
  const [type, setType] = useState<string | null>(null)
  const [bName, setBName] = useState("")
  const [bPhone, setBPhone] = useState("")
  const [bDate, setBDate] = useState("")
  const [bTime, setBTime] = useState("")
  const [sending, setSending] = useState(false)

  function reset() { setStep(0); setType(null); setBName(""); setBPhone(""); setBDate(""); setBTime("") }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setStep(3)
      onComplete?.(bName || "Max Mustermann", bPhone || "0151 12345678", bDate || "Heute", bTime || "10:00")
    }, 800)
  }

  const types = [
    { id: "schnitt",  icon: "✂️", label: "Haarschnitt",    price: "ab 25 €", dur: "45 Min" },
    { id: "farbe",    icon: "🎨", label: "Färben",          price: "ab 55 €", dur: "90 Min" },
    { id: "pflege",   icon: "💆", label: "Pflege-Ritual",   price: "ab 40 €", dur: "60 Min" },
    { id: "termin",   icon: "📅", label: "Freier Termin",   price: "kostenlos", dur: "frei" },
    { id: "rueckruf", icon: "📞", label: "Rückruf anfragen", price: "kostenlos", dur: "–" },
  ]

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 7, padding: "7px 9px", fontSize: 10.5, color: "#fff",
    outline: "none", boxSizing: "border-box",
  }

  return (
    <div style={{ width: 260, margin: "0 auto", position: "relative" }}>
      {/* Phone shell */}
      <div style={{
        background: "#12121e",
        borderRadius: 38, padding: "14px 8px 18px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        {/* Side buttons */}
        <div style={{ position: "absolute", left: -3, top: 100, width: 3, height: 28, background: "#2a2a3e", borderRadius: "3px 0 0 3px" }} />
        <div style={{ position: "absolute", left: -3, top: 138, width: 3, height: 52, background: "#2a2a3e", borderRadius: "3px 0 0 3px" }} />
        <div style={{ position: "absolute", right: -3, top: 120, width: 3, height: 52, background: "#2a2a3e", borderRadius: "0 3px 3px 0" }} />

        {/* Notch */}
        <div style={{ width: 80, height: 22, background: "#0a0a14", borderRadius: 99, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, background: "#1e1e2e", borderRadius: "50%", border: "1px solid #333" }} />
          <div style={{ width: 12, height: 6, background: "#1e1e2e", borderRadius: 4 }} />
        </div>

        {/* Screen */}
        <div style={{ background: "#f8fafc", borderRadius: 26, overflow: "hidden", minHeight: 440 }}>

          {/* Dark booking header */}
          <div style={{ background: "linear-gradient(160deg, #0F1923 0%, #1a2e20 100%)", padding: "14px 14px 12px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: .8, marginBottom: 5 }}>Online-Buchung</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: step > 0 && step < 3 ? 10 : 0 }}>
              <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#18A66D,#15955F)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff", flexShrink: 0 }}>FM</div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 900, color: "#fff" }}>Friseur Müller</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)" }}>terminstop.de/friseur-mueller</div>
              </div>
            </div>
            {step > 0 && step < 3 && (
              <div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3].map(n => (
                    <div key={n} style={{ flex:1, height:3, borderRadius:99, background: n <= step ? G.green : "rgba(255,255,255,0.15)", transition:"background .3s" }} />
                  ))}
                </div>
                <div style={{ fontSize:7, color:"rgba(255,255,255,0.4)", marginTop:3 }}>Schritt {step} von 3</div>
              </div>
            )}
          </div>

          {/* Screen body */}
          <div style={{ padding: "12px", background: "#f8fafc", minHeight: 370 }}>

            {/* Step 0: Welcome */}
            {step === 0 && (
              <div style={{ animation: "fadeUp .3s ease" }}>
                <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
                  <div style={{ width: 52, height: 52, background: G.greenSoft, border: `2px solid ${G.greenBorder}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 10px" }}>✂️</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: G.ink, marginBottom: 4, letterSpacing: "-.3px" }}>Termin anfragen</div>
                  <div style={{ fontSize: 9.5, color: G.muted, lineHeight: 1.5, marginBottom: 16 }}>In 2 Minuten — kein Account, keine App</div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5, marginBottom: 18 }}>
                    {["🔒 Sicher", "⚡ 2 Min", "✓ Gratis"].map(t => (
                      <span key={t} style={{ fontSize: 8, fontWeight: 600, color: G.muted, background: "#fff", border: `1px solid ${G.border}`, borderRadius: 99, padding: "3px 8px" }}>{t}</span>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} style={{ background: `linear-gradient(135deg,${G.green},${G.greenDeep})`, color: "#fff", fontWeight: 800, fontSize: 11.5, border: "none", borderRadius: 10, padding: "11px 0", cursor: "pointer", width: "100%", boxShadow: "0 4px 14px rgba(24,166,109,0.35)" }}>
                    Jetzt Termin anfragen →
                  </button>
                </div>
                {/* Ratings */}
                <div style={{ background: "#fff", border: `1px solid ${G.border}`, borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 1 }}>{"★★★★★".split("").map((s,i) => <span key={i} style={{ fontSize: 11, color: "#F59E0B" }}>{s}</span>)}</div>
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, color: G.ink }}>4.9 · 128 Buchungen</div>
                    <div style={{ fontSize: 7.5, color: G.muted }}>Schnell & zuverlässig</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Service selection */}
            {step === 1 && (
              <div style={{ animation: "fadeUp .3s ease" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Was darf es sein?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {types.map(t => (
                    <button key={t.id} onClick={() => { setType(t.id); setStep(2) }} style={{ display: "flex", alignItems: "center", gap: 9, background: "#fff", border: `1.5px solid ${G.border}`, borderRadius: 9, padding: "8px 10px", cursor: "pointer", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color .15s" }}>
                      <div style={{ width: 30, height: 30, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{t.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: G.ink }}>{t.label}</div>
                        <div style={{ fontSize: 8.5, color: G.muted }}>{t.dur} · {t.price}</div>
                      </div>
                      <span style={{ fontSize: 12, color: G.muted2 }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Contact form */}
            {step === 2 && (
              <div style={{ animation: "fadeUp .3s ease" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Ihre Angaben</div>
                <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Name</div>
                    <input style={inp} placeholder="Max Mustermann" value={bName} onChange={e => setBName(e.target.value)} required />
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Telefon</div>
                    <input style={inp} placeholder="0151 12345678" value={bPhone} onChange={e => setBPhone(e.target.value)} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    <div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Datum</div>
                      <input type="date" style={inp} value={bDate} onChange={e => setBDate(e.target.value)} required />
                    </div>
                    <div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Uhrzeit</div>
                      <input type="time" style={inp} value={bTime} onChange={e => setBTime(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ background: "rgba(24,166,109,0.12)", border: "1px solid rgba(24,166,109,0.25)", borderRadius: 7, padding: "6px 9px", display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 10 }}>📱</span>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>SMS-Bestätigung nach Freigabe</span>
                  </div>
                  <button type="submit" disabled={sending} style={{ background: sending ? "rgba(255,255,255,0.2)" : `linear-gradient(135deg,${G.green},${G.greenDeep})`, color: "#fff", fontWeight: 800, fontSize: 10.5, border: "none", borderRadius: 9, padding: "9px", cursor: sending ? "not-allowed" : "pointer", boxShadow: sending ? "none" : "0 4px 12px rgba(24,166,109,0.3)" }}>
                    {sending ? "Wird gesendet …" : "Anfrage absenden →"}
                  </button>
                  <button type="button" onClick={() => setStep(1)} style={{ fontSize: 8.5, color: G.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Zurück</button>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div style={{ animation: "fadeUp .4s ease", textAlign: "center", padding: "20px 8px 0" }}>
                <div style={{ animation: "checkPop .5s ease", width: 54, height: 54, background: G.greenSoft, border: `2px solid ${G.greenBorder}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 22 }}>✓</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: G.ink, marginBottom: 6, letterSpacing: "-.3px" }}>Anfrage eingegangen!</div>
                <div style={{ fontSize: 9.5, color: G.muted, lineHeight: 1.6, marginBottom: 14 }}>
                  Friseur Müller prüft den Wunschtermin und bestätigt kurz per SMS.
                </div>
                <div style={{ background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 10, padding: "9px 12px", marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: G.green, marginBottom: 2 }}>📱 Sie bekommen eine SMS sobald bestätigt</div>
                  <div style={{ fontSize: 8.5, color: G.greenDeep }}>Normalerweise innerhalb von wenigen Minuten</div>
                </div>
                <button onClick={reset} style={{ fontSize: 9, color: G.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Demo neu starten
                </button>
              </div>
            )}

          </div>
        </div>
        {/* Home bar */}
        <div style={{ width: 70, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, margin: "10px auto 0" }} />
      </div>

      {/* Floating QR badge */}
      <div style={{ position: "absolute", bottom: 72, right: -22, background: "#fff", border: `1px solid ${G.border}`, borderRadius: 11, padding: "8px 10px", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 30, height: 30, background: G.ink, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 10 10" fill="white">
            <rect x="0" y="0" width="4" height="4"/><rect x="6" y="0" width="4" height="4"/>
            <rect x="0" y="6" width="4" height="4"/><rect x="6" y="6" width="1" height="1"/>
            <rect x="8" y="6" width="2" height="2"/><rect x="6" y="8" width="2" height="2"/>
            <rect x="4" y="4" width="2" height="2"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 800, color: G.ink }}>QR-Code</div>
          <div style={{ fontSize: 7.5, color: G.muted }}>Zum Aufstellen</div>
        </div>
      </div>
    </div>
  )
}

// ── Incoming Request Card ────────────────────────────────────────────────────
function IncomingCard({ name, phone, date, time, visible }: { name: string; phone: string; date: string; time: string; visible: boolean }) {
  const [confirmed, setConfirmed] = useState(false)
  if (!visible) return null
  return (
    <div style={{ animation: "slideIn .5s ease", background: G.bg, border: `1px solid ${G.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,27,45,0.08)" }}>
      <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, background: "#F59E0B", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 12.5, fontWeight: 800, color: "#92400E" }}>🔔 Neue Online-Anfrage</span>
        <span style={{ fontSize: 11, color: "#B45309", marginLeft: "auto" }}>Gerade eben</span>
      </div>
      {confirmed ? (
        <div style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: G.greenSoft, border: `1.5px solid ${G.greenBorder}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.green }}>Bestätigt!</div>
            <div style={{ fontSize: 12.5, color: G.muted }}>SMS wurde automatisch an {name} gesendet.</div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 42, height: 42, background: G.greenSoft, border: `1.5px solid ${G.greenBorder}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✂️</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: G.ink, marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 12.5, color: G.muted }}>{phone} · {date} um {time} Uhr</div>
          </div>
          <button onClick={() => setConfirmed(true)} style={{ background: G.green, color: "#fff", fontWeight: 800, fontSize: 13.5, border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 4px 12px rgba(24,166,109,0.3)", transition: "transform .1s" }}>
            ✓ Bestätigen
          </button>
        </div>
      )}
      <div style={{ background: G.bg2, borderTop: `1px solid ${G.border}`, padding: "9px 18px", fontSize: 11.5, color: G.muted }}>
        Nach Ihrer Bestätigung bekommt der Kunde automatisch eine SMS — ohne Ihr weiteres Zutun.
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BuchungDemo() {
  const [incoming, setIncoming] = useState({ name: "Max Mustermann", phone: "0151 12345678", date: "Heute", time: "10:00" })
  const [showIncoming, setShowIncoming] = useState(false)

  function handleBookingComplete(name: string, phone: string, date: string, time: string) {
    setIncoming({ name, phone, date, time })
    setShowIncoming(true)
  }

  const features = [
    { icon: "🔗", title: "Eigene Buchungsseite", desc: "Ihre persönliche URL — z.B. terminstop.de/ihr-betrieb. Kunden buchen direkt, ohne anzurufen." },
    { icon: "📲", title: "QR-Code inklusive", desc: "Drucken oder aufstellen. Kunden scannen den Code und landen sofort auf Ihrer Buchungsseite." },
    { icon: "📥", title: "Anfragen im Dashboard", desc: "Alle Buchungsanfragen landen direkt bei Ihnen. Ein Klick genügt zur Bestätigung." },
    { icon: "✉️", title: "Automatische SMS", desc: "Sobald Sie bestätigen, bekommt der Kunde eine SMS — komplett automatisch, ohne Ihr Zutun." },
    { icon: "🗂️", title: "Leistungen auswählen", desc: "Kunden wählen aus Ihren Leistungen oder fragen einen offenen Wunschtermin an." },
    { icon: "📞", title: "Rückruf-Funktion", desc: "Keine Zeit für eine Buchung? Kunden können auch einen Rückruf anfragen." },
  ]

  const howItWorks = [
    { step: "01", icon: "📲", title: "Kunde öffnet die Seite", desc: "Per Link in der Bio, per QR-Code an der Kasse oder im Schaufenster — jederzeit, auf jedem Gerät.", color: "#EEF2FF", border: "#C7D2FE", iconBg: "#6366F1" },
    { step: "02", icon: "✏️", title: "Buchung in 2 Minuten", desc: "Leistung wählen, Name und Wunschtermin eingeben — kein Account, keine App, keine Hürde.", color: "#FFF7ED", border: "#FED7AA", iconBg: "#F97316" },
    { step: "03", icon: "🔔", title: "Sie werden benachrichtigt", desc: "Die Anfrage erscheint sofort in Ihrem Dashboard. Sie bestätigen mit einem einzigen Klick.", color: "#F0FBF6", border: "#D1F5E3", iconBg: "#18A66D" },
    { step: "04", icon: "📱", title: "Kunde bekommt SMS", desc: "Automatisch, sofort, ohne Ihr Zutun. Der Kunde ist informiert — Sie haben einen neuen Termin.", color: "#FFFBEB", border: "#FDE68A", iconBg: "#F59E0B" },
  ]

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Manrope',sans-serif", background: G.bg }}>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkPop  { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes glow      { 0%,100%{box-shadow:0 0 20px rgba(24,166,109,.2)} 50%{box-shadow:0 0 40px rgba(24,166,109,.4)} }

        /* Bottom nav: flex on mobile, gone on tablet/desktop */
        .demo-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #E5E7EB;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
          z-index: 50;
          padding-top: 8px;
          padding-bottom: max(10px, env(safe-area-inset-bottom));
          justify-content: space-around;
          align-items: center;
        }
        @media (min-width: 768px) { .demo-bottom-nav { display: none; } }

        /* Responsive: stack columns on mobile */
        @media (max-width: 768px) {
          .demo-split { flex-direction: column !important; }
          .demo-split-phone { margin: 0 auto 40px !important; }
          .demo-howit-grid { grid-template-columns: 1fr !important; }
          .demo-features-grid { grid-template-columns: 1fr 1fr !important; }
          .demo-usecases-grid { grid-template-columns: 1fr 1fr !important; }
          .demo-hero-inner { padding: 56px 20px 44px !important; }
          .demo-section-pad { padding: 56px 20px !important; }
          .demo-price-row { flex-direction: column !important; align-items: stretch !important; }
        }
        @media (max-width: 480px) {
          .demo-features-grid { grid-template-columns: 1fr !important; }
          .demo-usecases-grid { grid-template-columns: 1fr !important; }
          .demo-split-phone { width: 100% !important; max-width: 280px !important; }
        }
      `}</style>

      {/* ── Demo Banner ── */}
      <div style={{ background: "linear-gradient(90deg,#7C3AED,#9333EA)", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 600, gap: 12, flexWrap: "wrap" }}>
        <span>🎭 Demo-Modus – Alle Daten sind fiktiv</span>
        <a href="/lead" style={{ background: "#fff", color: "#7C3AED", padding: "6px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 12 }}>
          Jetzt kostenlos testen →
        </a>
      </div>

      {/* ── Nav ── */}
      <nav style={{ background: "#fff", borderBottom: `1px solid ${G.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 58 }}>
        {/* Left: Logo + regular demo pages */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="/" style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.3px", textDecoration: "none" }}>
            <span style={{ color: G.green }}>Termin</span><span style={{ color: G.ink }}>Stop</span>
          </a>
          <div className="hidden md:flex" style={{ gap: 2 }}>
            {[
              { href: "/demo", label: "Dashboard" },
              { href: "/demo/calendar", label: "Kalender" },
              { href: "/demo/customers", label: "Kunden" },
            ].map(item => (
              <a key={item.href} href={item.href} style={{ position: "relative", textDecoration: "none", padding: "6px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 500, color: G.muted, background: "transparent", transition: "color .12s" }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {/* Right: active indicator + back button + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Active page label */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 7, background: G.dark, border: "1px solid rgba(24,166,109,0.35)", borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ width: 6, height: 6, background: G.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Buchungs-Add-on Demo</span>
          </div>
          <a href="/lead" style={{ fontSize: 13, color: "#fff", background: G.green, padding: "7px 16px", borderRadius: 9, fontWeight: 700, textDecoration: "none" }}>
            Jetzt testen →
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ background: G.dark, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -60, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,166,109,.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="demo-hero-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 32px 64px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(24,166,109,.15)", border: "1px solid rgba(24,166,109,.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: G.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: "#4ade80", textTransform: "uppercase" as const, letterSpacing: 1 }}>Add-on · 229 €/Monat</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, color: "#fff", letterSpacing: "-2.5px", lineHeight: 1.0, margin: "0 0 18px" }}>
              Ihre Kunden buchen<br /><span style={{ color: G.green }}>rund um die Uhr.</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.6)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
              Mit dem Buchungs-Add-on bekommt Ihr Betrieb eine eigene Buchungsseite — inklusive QR-Code, automatischer SMS-Bestätigung und direkter Übersicht in Ihrem Dashboard.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
              <a href="#demo" style={{ background: `linear-gradient(135deg,${G.green},${G.greenDeep})`, color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 26px", borderRadius: 11, textDecoration: "none", boxShadow: "0 4px 20px rgba(24,166,109,.4)" }}>
                Demo ausprobieren ↓
              </a>
              <a href="/lead" style={{ background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 600, fontSize: 15, padding: "14px 22px", borderRadius: 11, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
                Jetzt anfragen
              </a>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" as const }}>
              {["✓ Monatlich kündbar", "✓ Einrichtung inklusive", "✓ Sofort einsatzbereit"].map(t => (
                <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "80px 32px", background: G.bg2 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 10 }}>So funktioniert's</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.5px", margin: "0 0 12px" }}>
              Von der Anfrage zur Bestätigung — in Sekunden.
            </h2>
            <p style={{ fontSize: 16, color: G.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
              Der komplette Ablauf ist vollautomatisch. Ihre einzige Aufgabe: einmal auf Bestätigen drücken.
            </p>
          </div>

          <div className="demo-howit-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {howItWorks.map((item, i) => (
              <div key={i} style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius: 16, padding: "24px 26px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 46, height: 46, background: item.iconBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: G.muted2, marginBottom: 4, letterSpacing: .5 }}>Schritt {item.step}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: G.ink, marginBottom: 6, letterSpacing: "-0.3px" }}>{item.title}</div>
                    <div style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: -10, right: -4, fontSize: 64, opacity: .06, fontWeight: 900, color: G.ink, lineHeight: 1 }}>{item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTERACTIVE DEMO
      ══════════════════════════════════════ */}
      <section id="demo" className="demo-section-pad" style={{ padding: "80px 32px", background: G.bg }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 10 }}>Live-Demo</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.5px", margin: "0 0 12px" }}>
              Probieren Sie es selbst aus.
            </h2>
            <p style={{ fontSize: 16, color: G.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
              Klicken Sie sich durch — genauso sieht Ihre Buchungsseite aus. Schicken Sie eine Demo-Anfrage ab und sehen Sie, was in Ihrem Dashboard ankommt.
            </p>
          </div>

          <div className="demo-split" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>

            {/* Phone */}
            <div className="demo-split-phone" style={{ flex: "0 0 auto" }}>
              <PhoneDemo onComplete={handleBookingComplete} />
            </div>

            {/* Right: explanation + incoming */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: G.ink, letterSpacing: "-0.5px", marginBottom: 8 }}>Was Ihre Kunden sehen</h3>
                <p style={{ fontSize: 14.5, color: G.muted, lineHeight: 1.7, marginBottom: 24 }}>
                  Die Buchungsseite läuft komplett in Ihrem Namen — mit Ihrem Logo, Ihren Leistungen und Ihren Zeiten. Kunden brauchen keine App und keinen Account.
                </p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[
                    { icon: "👆", title: "1 — Seite öffnen", desc: "Über Link, QR-Code oder direkt aus Ihrer Instagram-Bio." },
                    { icon: "✏️", title: "2 — Leistung wählen & Daten eingeben", desc: "Klick auf eine Leistung, Name und Wunschtermin — fertig." },
                    { icon: "📥", title: "3 — Anfrage landet bei Ihnen", desc: "Sofort im Dashboard, sichtbar auf dem Smartphone — ein Klick zur Bestätigung." },
                    { icon: "📱", title: "4 — Automatische SMS an den Kunden", desc: "Der Kunde ist informiert. Sie haben einen neuen Termin im Kalender." },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, background: G.greenSoft, border: `1.5px solid ${G.greenBorder}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard incoming preview */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.muted, textTransform: "uppercase" as const, letterSpacing: .8, marginBottom: 14 }}>
                  ↓ So sieht es bei Ihnen aus
                </div>
                {!showIncoming ? (
                  <div style={{ background: G.bg2, border: `2px dashed ${G.border}`, borderRadius: 16, padding: "28px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>👆</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: G.muted }}>Schicken Sie die Demo-Anfrage ab</div>
                    <div style={{ fontSize: 13, color: G.muted2, marginTop: 4 }}>und sehen Sie hier, was in Ihrem Dashboard landet.</div>
                  </div>
                ) : (
                  <IncomingCard {...incoming} visible={showIncoming} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHERE TO USE
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "80px 32px", background: G.bg2 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 10 }}>Einsatzmöglichkeiten</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.2px", margin: "0 0 12px" }}>Überall dort, wo Kunden auf Sie treffen.</h2>
            <p style={{ fontSize: 15.5, color: G.muted, maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>
              Ob online oder offline — Ihre Buchungsseite funktioniert überall. Ein Link, ein QR-Code, überall einsetzbar.
            </p>
          </div>

          <div className="demo-usecases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              {
                icon: "🪟", title: "Schaufenster & Kasse",
                badge: "Meistgenutzt", badgeColor: G.green,
                desc: "Stellen Sie den QR-Code auf die Theke oder kleben Sie ihn ins Schaufenster. Kunden scannen und buchen während sie warten.",
                visual: (
                  <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: "#2a2a3e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🪟</div>
                    <div>
                      <div style={{ width: 80, height: 7, background: "rgba(255,255,255,0.15)", borderRadius: 99, marginBottom: 5 }} />
                      <div style={{ width: 52, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
                    </div>
                    <div style={{ marginLeft: "auto", width: 28, height: 28, background: "#111827", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="white">
                        <rect x="0" y="0" width="4" height="4"/><rect x="1" y="1" width="2" height="2" fill="#111827"/>
                        <rect x="6" y="0" width="4" height="4"/><rect x="7" y="1" width="2" height="2" fill="#111827"/>
                        <rect x="0" y="6" width="4" height="4"/><rect x="1" y="7" width="2" height="2" fill="#111827"/>
                        <rect x="5" y="5" width="1" height="1"/><rect x="7" y="6" width="2" height="1"/><rect x="6" y="8" width="2" height="2"/>
                      </svg>
                    </div>
                  </div>
                ),
              },
              {
                icon: "📸", title: "Instagram Bio & Stories",
                badge: "Beliebt", badgeColor: "#E1306C",
                desc: "Link in der Bio oder in der Story — Kunden tippen drauf und landen direkt auf Ihrer Buchungsseite. Kein Umweg, keine Erklärung nötig.",
                visual: (
                  <div style={{ background: "linear-gradient(135deg, #405DE6, #E1306C)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✂️</div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>friseur_mueller</div>
                        <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)" }}>terminstop.de/friseur-mueller</div>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 7, padding: "6px 10px", fontSize: 9.5, fontWeight: 700, color: "#fff", textAlign: "center" as const }}>🔗 Jetzt Termin buchen →</div>
                  </div>
                ),
              },
              {
                icon: "🗺️", title: "Google Maps Profil",
                badge: "Empfohlen", badgeColor: "#4285F4",
                desc: "Fügen Sie den Link in Ihr Google Business Profil ein. Kunden die Sie bei Google suchen, können direkt buchen — ohne anzurufen.",
                visual: (
                  <div style={{ background: "#fff", border: `1px solid ${G.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, background: "#FEEBC8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📍</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: G.ink }}>Friseur Müller</div>
                        <div style={{ display: "flex", gap: 1 }}>{"★★★★★".split("").map((s,i) => <span key={i} style={{ fontSize: 8, color: "#F59E0B" }}>{s}</span>)}</div>
                      </div>
                    </div>
                    <div style={{ background: G.green, borderRadius: 6, padding: "5px 10px", fontSize: 9, fontWeight: 700, color: "#fff", textAlign: "center" as const }}>Termin buchen</div>
                  </div>
                ),
              },
              {
                icon: "💬", title: "WhatsApp & Direktnachricht",
                badge: "Schnell eingerichtet", badgeColor: "#25D366",
                desc: "Schicken Sie den Buchungslink direkt per WhatsApp an bestehende Kunden. Kein hin und her, kein Warten auf eine Antwort.",
                visual: (
                  <div style={{ background: "#ECE5DD", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                    <div style={{ background: "#DCF8C6", borderRadius: "10px 10px 0 10px", padding: "8px 12px", marginBottom: 6, maxWidth: "80%", marginLeft: "auto" }}>
                      <div style={{ fontSize: 9.5, color: "#111827", marginBottom: 3 }}>Hier ist dein Buchungslink 😊</div>
                      <div style={{ fontSize: 8.5, color: G.greenDeep, fontWeight: 600 }}>terminstop.de/friseur-mueller</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: "10px 10px 10px 0", padding: "8px 12px", maxWidth: "70%" }}>
                      <div style={{ fontSize: 9.5, color: "#111827" }}>Danke! Gleich gebucht 👍</div>
                    </div>
                  </div>
                ),
              },
              {
                icon: "🖨️", title: "Visitenkarte & Flyer",
                badge: "Offline", badgeColor: "#8B5CF6",
                desc: "Drucken Sie die URL oder den QR-Code auf Ihre Visitenkarte, Flyer oder Gutscheine. Kunden haben alles dabei, wenn sie buchen möchten.",
                visual: (
                  <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 900, color: "#fff", marginBottom: 3 }}>✂️ Friseur Müller</div>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Musterstraße 12, München</div>
                        <div style={{ fontSize: 8.5, color: "#a5b4fc", fontWeight: 600 }}>terminstop.de/friseur-mueller</div>
                      </div>
                      <div style={{ width: 28, height: 28, background: "rgba(255,255,255,0.15)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 10 10" fill="white">
                          <rect x="0" y="0" width="4" height="4"/><rect x="1" y="1" width="2" height="2" fill="transparent"/>
                          <rect x="6" y="0" width="4" height="4"/><rect x="5" y="5" width="2" height="2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                icon: "🌐", title: "Eigene Website",
                badge: "Professionell", badgeColor: "#0EA5E9",
                desc: "Fügen Sie den Link oder ein Buchungs-Button auf Ihrer Website ein. Besucher buchen direkt — ohne dass sie woanders hin müssen.",
                visual: (
                  <div style={{ background: "#fff", border: `1px solid ${G.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                      {["#F87171", "#FCD34D", "#4ADE80"].map(c => <div key={c} style={{ width: 8, height: 8, background: c, borderRadius: "50%" }} />)}
                    </div>
                    <div style={{ height: 8, background: G.bg2, borderRadius: 4, marginBottom: 5, width: "70%" }} />
                    <div style={{ height: 6, background: G.bg2, borderRadius: 4, marginBottom: 8, width: "50%" }} />
                    <div style={{ background: G.green, borderRadius: 6, padding: "5px 12px", fontSize: 9, fontWeight: 700, color: "#fff", display: "inline-block" }}>Termin buchen →</div>
                  </div>
                ),
              },
            ].map((item, i) => (
              <div key={i} style={{ background: G.bg, border: `1px solid ${G.border}`, borderRadius: 16, padding: "22px", overflow: "hidden" }}>
                {item.visual}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: G.ink, letterSpacing: "-0.2px" }}>{item.title}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "#fff", background: item.badgeColor, borderRadius: 99, padding: "2px 8px", marginLeft: "auto", whiteSpace: "nowrap" as const }}>{item.badge}</span>
                </div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SMS PREVIEW
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "72px 32px", background: G.bg }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="demo-split" style={{ display: "flex", gap: 64, alignItems: "center" }}>
            {/* Left: explanation */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 12 }}>Automatische SMS</div>
              <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.2px", margin: "0 0 16px" }}>
                Der Kunde wird automatisch informiert.
              </h2>
              <p style={{ fontSize: 15.5, color: G.muted, lineHeight: 1.7, marginBottom: 24 }}>
                Sobald Sie eine Buchungsanfrage bestätigen, bekommt der Kunde eine SMS — vollautomatisch, ohne Ihr weiteres Zutun. Kein Tippen, kein Anrufen, kein Vergessen.
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {[
                  "SMS geht raus innerhalb von Sekunden nach Ihrer Bestätigung",
                  "Enthält Datum, Uhrzeit und Betriebsname",
                  "Kein eigenes SMS-System nötig — alles über TerminStop",
                  "Kunden haben die Bestätigung direkt auf dem Handy",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: G.green, flexShrink: 0, marginTop: 2 }}>✓</div>
                    <span style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: SMS mockup */}
            <div style={{ flex: "0 0 auto", textAlign: "center" }}>
              <div style={{ background: "#1a1a2e", borderRadius: 32, padding: "14px 8px 20px", width: 220, boxShadow: "0 32px 64px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.07)", position: "relative" }}>
                <div style={{ width: 60, height: 18, background: "#0a0a14", borderRadius: 99, margin: "0 auto 10px" }} />
                <div style={{ background: "#f0f0f0", borderRadius: 22, overflow: "hidden", minHeight: 320 }}>
                  {/* Status bar */}
                  <div style={{ background: "#1a1a2e", padding: "8px 14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>9:41</span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <div style={{ width: 12, height: 7, border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 2, position: "relative" }}>
                        <div style={{ position: "absolute", inset: 1, background: "#4ade80", borderRadius: 1, width: "80%" }} />
                      </div>
                    </div>
                  </div>
                  {/* SMS header */}
                  <div style={{ background: "#fff", padding: "12px 14px 8px", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#18A66D,#15955F)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✂️</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: G.ink }}>TerminStop</div>
                        <div style={{ fontSize: 9, color: G.muted }}>SMS Benachrichtigung</div>
                      </div>
                    </div>
                  </div>
                  {/* SMS bubble */}
                  <div style={{ padding: "16px 12px" }}>
                    <div style={{ background: "#E8E8ED", borderRadius: "14px 14px 14px 2px", padding: "12px 14px", fontSize: 11, color: G.ink, lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: G.greenDeep }}>✓ Termin bestätigt!</div>
                      <div style={{ marginBottom: 4 }}>Hallo Max,</div>
                      <div style={{ marginBottom: 8 }}>Ihr Termin bei <strong>Friseur Müller</strong> wurde bestätigt:</div>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: G.ink }}>📅 Montag, 28. April</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: G.ink }}>⏰ 10:00 Uhr</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: G.ink }}>✂️ Haarschnitt</div>
                      </div>
                      <div style={{ fontSize: 9.5, color: G.muted }}>Wir freuen uns auf Sie!</div>
                    </div>
                    <div style={{ fontSize: 8.5, color: G.muted2, textAlign: "center" as const, marginTop: 8 }}>Gesendet über TerminStop</div>
                  </div>
                </div>
                <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, margin: "10px auto 0" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          QR CODE VISUAL
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "80px 32px", background: G.bg2 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="demo-split" style={{ display: "flex", gap: 64, alignItems: "center" }}>

            {/* QR visual */}
            <div style={{ flex: "0 0 auto", textAlign: "center" }}>
              <div style={{ background: G.dark, borderRadius: 24, padding: 28, display: "inline-block", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <svg width="130" height="130" viewBox="0 0 10 10" style={{ display: "block" }}>
                    {/* QR code pattern */}
                    <rect x="0" y="0" width="3" height="3" fill="#111827"/><rect x="1" y="1" width="1" height="1" fill="white"/>
                    <rect x="7" y="0" width="3" height="3" fill="#111827"/><rect x="8" y="1" width="1" height="1" fill="white"/>
                    <rect x="0" y="7" width="3" height="3" fill="#111827"/><rect x="1" y="8" width="1" height="1" fill="white"/>
                    <rect x="4" y="0" width="1" height="1" fill="#111827"/><rect x="6" y="0" width="1" height="1" fill="#111827"/>
                    <rect x="3" y="1" width="1" height="1" fill="#111827"/><rect x="5" y="1" width="1" height="1" fill="#111827"/>
                    <rect x="4" y="2" width="1" height="1" fill="#111827"/><rect x="6" y="2" width="1" height="1" fill="#111827"/>
                    <rect x="3" y="3" width="2" height="1" fill="#111827"/><rect x="6" y="3" width="1" height="1" fill="#111827"/>
                    <rect x="0" y="4" width="1" height="1" fill="#111827"/><rect x="2" y="4" width="2" height="1" fill="#111827"/>
                    <rect x="5" y="4" width="2" height="1" fill="#111827"/><rect x="9" y="4" width="1" height="1" fill="#111827"/>
                    <rect x="1" y="5" width="1" height="1" fill="#111827"/><rect x="4" y="5" width="1" height="1" fill="#111827"/>
                    <rect x="6" y="5" width="1" height="1" fill="#111827"/><rect x="8" y="5" width="2" height="1" fill="#111827"/>
                    <rect x="0" y="6" width="2" height="1" fill="#111827"/><rect x="3" y="6" width="1" height="1" fill="#111827"/>
                    <rect x="5" y="6" width="1" height="1" fill="#111827"/><rect x="7" y="6" width="2" height="1" fill="#111827"/>
                    <rect x="3" y="7" width="1" height="1" fill="#111827"/><rect x="5" y="7" width="1" height="1" fill="#111827"/>
                    <rect x="7" y="7" width="1" height="1" fill="#111827"/><rect x="9" y="7" width="1" height="1" fill="#111827"/>
                    <rect x="4" y="8" width="2" height="1" fill="#111827"/><rect x="7" y="8" width="1" height="1" fill="#111827"/>
                    <rect x="3" y="9" width="1" height="1" fill="#111827"/><rect x="6" y="9" width="1" height="1" fill="#111827"/>
                    <rect x="8" y="9" width="2" height="1" fill="#111827"/>
                  </svg>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.5)", textAlign: "center" }}>terminstop.de/friseur-mueller</div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
                {["📱 Scannen", "🖨️ Drucken", "🪟 Aufstellen"].map(t => (
                  <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: G.muted, background: G.bg, border: `1px solid ${G.border}`, borderRadius: 99, padding: "5px 12px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right: explanation */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 12 }}>QR-Code inklusive</div>
              <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.2px", margin: "0 0 16px" }}>
                Einfach aufstellen — und Kunden buchen von selbst.
              </h2>
              <p style={{ fontSize: 15.5, color: G.muted, lineHeight: 1.7, marginBottom: 24 }}>
                Jede Buchungsseite bekommt automatisch einen eigenen QR-Code. Den können Sie ausdrucken, laminieren und an der Kasse, im Schaufenster oder auf Visitenkarten platzieren.
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {[
                  "Funktioniert mit jedem Smartphone — kein App-Download nötig",
                  "Der QR-Code führt direkt auf Ihre persönliche Buchungsseite",
                  "Kunden scannen, buchen, fertig — in unter 2 Minuten",
                  "Perfekt für Kasse, Schaufenster, Instagram-Bio oder Visitenkarte",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: G.green, flexShrink: 0, marginTop: 1 }}>✓</div>
                    <span style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "80px 32px", background: G.bg }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 10 }}>Alles dabei</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: 900, color: G.ink, letterSpacing: "-1.2px", margin: 0 }}>Im Add-on enthalten.</h2>
          </div>
          <div className="demo-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 14, padding: "22px 24px", transition: "border-color .2s, transform .2s" }}>
                <div style={{ width: 44, height: 44, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: G.ink, marginBottom: 6, letterSpacing: "-0.2px" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICE + CTA
      ══════════════════════════════════════ */}
      <section className="demo-section-pad" style={{ padding: "80px 32px", background: G.dark, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,166,109,.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(74,222,128,1)", textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 12 }}>Preise</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,46px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.8px", margin: "0 0 14px" }}>
              229 € im Monat — das wars.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>
              Kein Einrichtungspreis, keine versteckten Kosten, keine Mindestlaufzeit. Monatlich kündbar — zu jedem Paket hinzubuchbar.
            </p>
          </div>

          <div className="demo-price-row" style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" as const }}>
            {[
              { label: "Buchungsseite", value: "Sofort aktiv" },
              { label: "QR-Code", value: "Inklusive" },
              { label: "SMS-Bestätigung", value: "Automatisch" },
              { label: "Laufzeit", value: "Monatlich" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "14px 20px", textAlign: "center", flex: "1 1 120px" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 3 }}>{item.value}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="/lead" style={{ display: "inline-block", background: `linear-gradient(135deg,${G.green},${G.greenDeep})`, color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 40px", borderRadius: 13, textDecoration: "none", boxShadow: "0 4px 24px rgba(24,166,109,.4)", letterSpacing: "-0.2px", marginBottom: 14 }}>
              Add-on anfragen →
            </a>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)" }}>
              Einfach anfragen — wir richten alles für Sie ein.
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Bottom Nav — controlled by CSS class, no inline display ── */}
      <div className="demo-bottom-nav">
        {[
          { href: "/demo", label: "Dashboard", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/></svg> },
          { href: "/demo/calendar", label: "Kalender", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
          { href: "/demo/buchung", label: "Buchung", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>, active: true },
          { href: "/lead", label: "Testen", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px", textDecoration: "none", color: item.active ? G.green : G.muted2, minWidth: 52 }}>
            {item.active && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, borderRadius: 99, background: G.green }} />}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, letterSpacing: .2 }}>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
