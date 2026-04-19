"use client"

import { useState, useEffect } from "react"
import { DEMO_COMPANY, generateDemoAppointments } from "./demoData"

// ── Farben ────────────────────────────────────────────────────────────────────
const G = {
  green: "#18A66D", greenDeep: "#15955F", greenInk: "#0D6B46",
  greenSoft: "#F0FBF6", greenBorder: "#D1F5E3",
  ink: "#111827", text: "#374151", muted: "#6B7280", muted2: "#9CA3AF",
  bg: "#fff", bg2: "#F9FAFB", border: "#E5E7EB",
  purple: "#7C3AED",
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconLink = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

// ── Demo Banner ───────────────────────────────────────────────────────────────
function DemoBanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg,#7C3AED,#9333EA)", color: "#fff",
      padding: "10px 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between", fontSize: 13, fontWeight: 600,
      gap: 12, flexWrap: "wrap",
    }}>
      <span>🎭 Demo-Modus – Alle Daten sind fiktiv · Keine SMS werden versendet</span>
      <a href="/lead" style={{
        background: "#fff", color: "#7C3AED", padding: "6px 16px",
        borderRadius: 8, fontWeight: 700, textDecoration: "none",
        fontSize: 12, whiteSpace: "nowrap",
      }}>
        Jetzt kostenlos testen →
      </a>
    </div>
  )
}

// ── DemoForm ──────────────────────────────────────────────────────────────────
interface DemoFormProps {
  name: string; setName: (v: string) => void
  phone: string; setPhone: (v: string) => void
  date: string; setDate: (v: string) => void
  time: string; setTime: (v: string) => void
  note: string; setNote: (v: string) => void
  isSubmitting: boolean; formSuccess: boolean
  onSubmit: (e: React.FormEvent) => void
}
function DemoForm({ name, setName, phone, setPhone, date, setDate, time, setTime, note, setNote, isSubmitting, formSuccess, onSubmit }: DemoFormProps) {
  const inp = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Name</label>
        <input className={inp} placeholder="Max Mustermann" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Telefonnummer</label>
        <input className={inp} placeholder="0151 12345678" value={phone} onChange={e => setPhone(e.target.value)} type="tel" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Datum</label>
          <input type="date" className={inp} value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Uhrzeit</label>
          <input type="time" className={inp} value={time} onChange={e => setTime(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">
          Notiz <span className="font-normal normal-case text-[#9CA3AF]">(optional)</span>
        </label>
        <input className={inp} placeholder="z.B. Erstbesuch" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="flex items-center gap-2.5 bg-[#F0FBF6] border border-[#D1F5E3] rounded-xl px-4 py-3">
        <span className="text-base">📱</span>
        <div>
          <div className="text-xs font-semibold text-[#18A66D]">SMS-Erinnerung automatisch geplant</div>
          <div className="text-xs text-[#18A66D]/70">24 Stunden vor dem Termin</div>
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          formSuccess ? "bg-[#F0FBF6] text-[#18A66D] border border-[#D1F5E3]"
          : isSubmitting ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          : "bg-[#18A66D] text-white hover:bg-[#15955F] active:scale-[.98]"
        }`}>
        {formSuccess ? "✓ Termin gespeichert!" : isSubmitting ? "Speichert …" : "Termin speichern →"}
      </button>
    </form>
  )
}

// ── Booking Demo Panel ────────────────────────────────────────────────────────
function BookingDemoPanel() {
  const [step, setStep] = useState(0) // 0=start, 1=type, 2=form, 3=success
  const [type, setType] = useState<string | null>(null)
  const [bName, setBName] = useState("")
  const [bPhone, setBPhone] = useState("")
  const [bDate, setBDate] = useState("")
  const [bTime, setBTime] = useState("")
  const [sending, setSending] = useState(false)
  const [incomingVisible, setIncomingVisible] = useState(false)

  function reset() { setStep(0); setType(null); setBName(""); setBPhone(""); setBDate(""); setBTime(""); setIncomingVisible(false) }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setStep(3)
      setTimeout(() => setIncomingVisible(true), 600)
    }, 800)
  }

  const types = [
    { id: "leistung", icon: "✂️", label: "Leistung buchen", desc: "Wähle eine Leistung" },
    { id: "termin",   icon: "📅", label: "Freier Termin",   desc: "Wunschzeit anfragen" },
    { id: "rueckruf", icon: "📞", label: "Rückruf",         desc: "Wir rufen zurück" },
  ]

  const steps = [
    { num: 1, label: "Art wählen" },
    { num: 2, label: "Details" },
    { num: 3, label: "Abschicken" },
  ]

  const explanations = [
    { title: "Ihre Kunden öffnen die Buchungsseite", desc: "Per Link oder QR-Code — von überall, jederzeit, ohne App." },
    { title: "Sie wählen, was sie brauchen", desc: "Leistung, freier Termin oder einfach ein Rückruf — alles möglich." },
    { title: "Kurz Name & Uhrzeit eingeben", desc: "Kein Account, kein Passwort. Dauert 60 Sekunden." },
    { title: "Anfrage landet bei Ihnen im Dashboard", desc: "Sie bestätigen mit einem Klick — fertig. Der Kunde bekommt automatisch eine SMS." },
  ]

  const inp2 = {
    width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#fff",
    outline: "none", boxSizing: "border-box" as const,
  }

  return (
    <>
      <style>{`
        @keyframes bookFadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes incomingSlide { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        .book-step-card { transition: transform .15s, box-shadow .15s; }
        .book-step-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(24,166,109,0.18) !important; }
        @media (max-width: 700px) {
          .booking-demo-wrap { flex-direction: column !important; }
          .booking-demo-phone { margin: 0 auto !important; }
          .booking-demo-right { max-width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 64px" }}>

        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: 48, paddingTop: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(24,166,109,0.1)", border: "1px solid rgba(24,166,109,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, background: G.green, borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: G.green, textTransform: "uppercase" as const, letterSpacing: 1 }}>Live-Demo · Buchungs-Add-on</span>
          </div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-1.5px", color: G.ink, margin: "0 0 12px" }}>
            So buchen Ihre Kunden — <span style={{ color: G.green }}>rund um die Uhr.</span>
          </h2>
          <p style={{ fontSize: 16, color: G.muted, maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
            Probieren Sie es selbst aus. Klicken Sie sich durch die Buchungsseite — genauso sieht es Ihr Kunde.
          </p>
        </div>

        {/* Split: phone + explanation */}
        <div className="booking-demo-wrap" style={{ display: "flex", gap: 48, alignItems: "flex-start", marginBottom: 48 }}>

          {/* Phone frame */}
          <div className="booking-demo-phone" style={{ flex: "0 0 auto" }}>
            <div style={{ width: 270, position: "relative" }}>
              {/* Phone shell */}
              <div style={{
                background: "#1a1a2e", borderRadius: 36, padding: "14px 10px",
                boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}>
                {/* Notch */}
                <div style={{ width: 70, height: 20, background: "#0d0d1a", borderRadius: 99, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, background: "#2a2a3e", borderRadius: "50%" }} />
                </div>

                {/* Screen */}
                <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", minHeight: 420 }}>

                  {/* Dark header */}
                  <div style={{ background: "linear-gradient(160deg, #0F1923 0%, #1a2e20 100%)", padding: "14px 14px 12px" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: .8, marginBottom: 6 }}>Online-Buchung</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: step > 0 ? 10 : 0 }}>
                      <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#18A66D,#15955F)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff" }}>FM</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "-.3px" }}>Friseur Müller</div>
                        <div style={{ fontSize: 7, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>terminstop.de/friseur-mueller</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    {step > 0 && step < 3 && (
                      <div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {steps.map((s) => (
                            <div key={s.num} style={{ flex: 1, height: 3, borderRadius: 99, background: s.num <= step ? G.green : "rgba(255,255,255,0.15)", transition: "background .3s" }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Schritt {step} von 3</div>
                      </div>
                    )}
                  </div>

                  {/* Screen content */}
                  <div style={{ padding: "14px", minHeight: 340, background: "#f8fafc" }}>

                    {/* Step 0: Start */}
                    {step === 0 && (
                      <div style={{ animation: "bookFadeIn .3s ease" }}>
                        <div style={{ textAlign: "center", paddingTop: 8 }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>✂️</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: G.ink, marginBottom: 4 }}>Termin anfragen</div>
                          <div style={{ fontSize: 9.5, color: G.muted, lineHeight: 1.5, marginBottom: 16 }}>In 2 Minuten — kein Account nötig</div>
                          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" as const }}>
                            {["🔒 Sicher", "⚡ In 2 Min", "✓ Kostenlos"].map(t => (
                              <span key={t} style={{ fontSize: 7.5, fontWeight: 600, color: G.muted, background: "#fff", border: `1px solid ${G.border}`, borderRadius: 99, padding: "3px 7px" }}>{t}</span>
                            ))}
                          </div>
                          <button onClick={() => setStep(1)} style={{
                            background: `linear-gradient(135deg,${G.green},${G.greenDeep})`,
                            color: "#fff", fontWeight: 800, fontSize: 11, border: "none",
                            borderRadius: 10, padding: "10px 20px", cursor: "pointer", width: "100%",
                            boxShadow: "0 4px 14px rgba(24,166,109,0.35)",
                          }}>
                            Jetzt Termin anfragen →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Type selection */}
                    {step === 1 && (
                      <div style={{ animation: "bookFadeIn .3s ease" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: "uppercase" as const, letterSpacing: .5, marginBottom: 12 }}>Was kann ich für Sie tun?</div>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                          {types.map(t => (
                            <button key={t.id} className="book-step-card" onClick={() => { setType(t.id); setStep(2) }} style={{
                              display: "flex", alignItems: "center", gap: 10,
                              background: "#fff", border: `1.5px solid ${G.border}`, borderRadius: 10,
                              padding: "10px 12px", cursor: "pointer", textAlign: "left" as const,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", width: "100%",
                            }}>
                              <div style={{ width: 32, height: 32, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.icon}</div>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: G.ink }}>{t.label}</div>
                                <div style={{ fontSize: 9, color: G.muted }}>{t.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Form */}
                    {step === 2 && (
                      <div style={{ animation: "bookFadeIn .3s ease" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: "uppercase" as const, letterSpacing: .5, marginBottom: 10 }}>Ihre Angaben</div>
                        <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Name</div>
                            <input style={{ ...inp2 }} placeholder="Max Mustermann" value={bName} onChange={e => setBName(e.target.value)} required />
                          </div>
                          <div>
                            <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Telefonnummer</div>
                            <input style={{ ...inp2 }} placeholder="0151 12345678" value={bPhone} onChange={e => setBPhone(e.target.value)} required />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            <div>
                              <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Datum</div>
                              <input type="date" style={{ ...inp2 }} value={bDate} onChange={e => setBDate(e.target.value)} required />
                            </div>
                            <div>
                              <div style={{ fontSize: 8.5, fontWeight: 700, color: G.muted, marginBottom: 3 }}>Uhrzeit</div>
                              <input type="time" style={{ ...inp2 }} value={bTime} onChange={e => setBTime(e.target.value)} required />
                            </div>
                          </div>
                          <button type="submit" disabled={sending} style={{
                            background: sending ? "#9CA3AF" : `linear-gradient(135deg,${G.green},${G.greenDeep})`,
                            color: "#fff", fontWeight: 800, fontSize: 10, border: "none",
                            borderRadius: 9, padding: "9px", cursor: sending ? "not-allowed" : "pointer", marginTop: 4,
                            boxShadow: sending ? "none" : "0 4px 12px rgba(24,166,109,0.3)",
                          }}>
                            {sending ? "Wird gesendet …" : "Anfrage absenden →"}
                          </button>
                          <button type="button" onClick={() => setStep(1)} style={{ fontSize: 9, color: G.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>← Zurück</button>
                        </form>
                      </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                      <div style={{ animation: "bookFadeIn .4s ease", textAlign: "center", paddingTop: 20 }}>
                        <div style={{ animation: "checkPop .4s ease", width: 52, height: 52, background: G.greenSoft, border: `2px solid ${G.greenBorder}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 22 }}>✓</div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: G.ink, marginBottom: 6 }}>Anfrage eingegangen!</div>
                        <div style={{ fontSize: 9.5, color: G.muted, lineHeight: 1.6, marginBottom: 14 }}>
                          Friseur Müller prüft Ihren Wunschtermin und bestätigt per SMS.
                        </div>
                        <div style={{ background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 10, padding: "8px 10px", marginBottom: 14 }}>
                          <div style={{ fontSize: 8.5, color: G.green, fontWeight: 700 }}>📱 SMS-Bestätigung folgt in Kürze</div>
                        </div>
                        <button onClick={reset} style={{ fontSize: 9, color: G.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                          Demo neu starten
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* Home bar */}
                <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 99, margin: "10px auto 0" }} />
              </div>

              {/* QR badge floating */}
              <div style={{
                position: "absolute", bottom: 60, right: -18,
                background: "#fff", border: `1px solid ${G.border}`,
                borderRadius: 10, padding: "7px 9px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 28, height: 28, background: G.ink, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 10 10" fill="white">
                    <rect x="0" y="0" width="4" height="4" /><rect x="6" y="0" width="4" height="4" />
                    <rect x="0" y="6" width="4" height="4" /><rect x="6" y="6" width="1" height="1" />
                    <rect x="8" y="6" width="2" height="2" /><rect x="6" y="8" width="2" height="2" />
                    <rect x="4" y="4" width="2" height="2" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, fontWeight: 800, color: G.ink }}>QR-Code</div>
                  <div style={{ fontSize: 7, color: G.muted }}>Zum Aufstellen</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: step explanations + features */}
          <div className="booking-demo-right" style={{ flex: 1, minWidth: 0, maxWidth: 520 }}>
            {/* Step indicator */}
            <div style={{ marginBottom: 32 }}>
              {explanations.map((ex, i) => {
                const isActive = i === step
                const isDone = i < step
                return (
                  <div key={i} style={{
                    display: "flex", gap: 16, marginBottom: 20,
                    opacity: isActive ? 1 : isDone ? 0.5 : 0.3,
                    transition: "opacity .3s",
                  }}>
                    <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? G.green : isDone ? G.greenSoft : G.bg2, border: `2px solid ${isActive ? G.green : isDone ? G.greenBorder : G.border}`, transition: "all .3s" }}>
                      {isDone ? (
                        <span style={{ color: G.green, fontSize: 13, fontWeight: 800 }}>✓</span>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 800, color: isActive ? "#fff" : G.muted }}>{i + 1}</span>
                      )}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: G.ink, marginBottom: 3, letterSpacing: "-0.2px" }}>{ex.title}</div>
                      <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{ex.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Feature pills */}
            <div style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: G.muted, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 14 }}>Im Add-on enthalten</div>
              {[
                ["🔗", "Eigene Buchungsseite (Ihre URL)"],
                ["📲", "QR-Code für Kasse / Schaufenster"],
                ["📥", "Anfragen direkt im Dashboard"],
                ["✉️", "Automatische Bestätigungs-SMS"],
                ["🗂️", "Leistungen & Rückruf-Option"],
                ["📱", "Funktioniert auf jedem Gerät"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 13.5, color: G.text, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div style={{ background: "linear-gradient(135deg, #0F1923, #1a2e20)", borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 }}>Add-on Preis</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>229 €</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>/Monat</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Monatlich kündbar · Einrichtung inklusive · Kein Risiko</div>
              <a href="/lead" style={{
                display: "block", textAlign: "center" as const,
                background: "linear-gradient(135deg, #18A66D, #15955F)",
                color: "#fff", fontWeight: 800, fontSize: 15,
                padding: "14px", borderRadius: 11, textDecoration: "none",
                boxShadow: "0 4px 20px rgba(24,166,109,0.4)", letterSpacing: "-0.2px",
              }}>
                Add-on anfragen →
              </a>
            </div>
          </div>
        </div>

        {/* ── Incoming request preview ─────────────────────────────────── */}
        {step === 3 && (
          <div style={{ animation: "incomingSlide .5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.muted, textTransform: "uppercase" as const, letterSpacing: 1 }}>↓ &nbsp;So sieht es bei Ihnen aus</div>
            </div>
            <div style={{ maxWidth: 640, margin: "0 auto", background: G.bg, border: `1px solid ${G.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,27,45,0.08)" }}>
              <div style={{ background: "#FFFBEB", borderBottom: `1px solid #FDE68A`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, background: "#F59E0B", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>🔔 Neue Online-Anfrage eingegangen</span>
              </div>
              <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
                <div style={{ width: 44, height: 44, background: G.greenSoft, border: `1px solid ${G.greenBorder}`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✂️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: G.ink, marginBottom: 2 }}>{bName || "Max Mustermann"}</div>
                  <div style={{ fontSize: 13, color: G.muted }}>{bPhone || "0151 12345678"} · {bDate || "Heute"} {bTime || "10:00 Uhr"}</div>
                </div>
                <button style={{
                  background: G.green, color: "#fff", fontWeight: 800, fontSize: 13,
                  border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                  whiteSpace: "nowrap" as const, flexShrink: 0,
                }}>
                  ✓ Bestätigen
                </button>
              </div>
              <div style={{ background: G.bg2, borderTop: `1px solid ${G.border}`, padding: "10px 20px", fontSize: 11.5, color: G.muted }}>
                Nach Bestätigung bekommt der Kunde automatisch eine SMS-Benachrichtigung.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ── Main Demo Page ────────────────────────────────────────────────────────────
export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "buchung">("dashboard")
  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId]   = useState<string | null>(null)
  const [formSuccess, setFormSuccess]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm]         = useState(false)

  const [name, setName]   = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate]   = useState("")
  const [time, setTime]   = useState("")
  const [note, setNote]   = useState("")

  useEffect(() => { setAppointments(generateDemoAppointments()) }, [])

  function toggleDone(a: any) {
    setAppointments(prev => prev.map(x => x.id === a.id ? { ...x, status: x.status === "done" ? "pending" : "done" } : x))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !date || !time) return
    setIsSubmitting(true)
    setTimeout(() => {
      const newId = `demo-${Date.now()}`
      setAppointments(prev => [...prev, { id: newId, name, phone, date, time, note, status: "pending" }])
      setJustAddedId(newId); setTimeout(() => setJustAddedId(null), 1200)
      setName(""); setPhone(""); setDate(""); setTime(""); setNote("")
      setIsSubmitting(false); setFormSuccess(true)
      setTimeout(() => { setFormSuccess(false); setShowForm(false) }, 1800)
    }, 500)
  }

  const now      = new Date()
  const todayStr = now.toISOString().split("T")[0]
  const allToday = appointments.filter(a => a.date === todayStr).sort((a, b) => a.time.localeCompare(b.time))
  const doneCount = allToday.filter(a => a.status === "done").length
  const openCount = allToday.filter(a => a.status !== "done").length
  const pct       = allToday.length > 0 ? Math.round((doneCount / allToday.length) * 100) : 0
  const nextOpen  = allToday.find(a => {
    if (a.status === "done") return false
    const [h, m] = a.time.split(":").map(Number)
    return new Date(a.date).setHours(h, m) >= now.getTime() - 30 * 60 * 1000
  })

  const formProps: DemoFormProps = { name, setName, phone, setPhone, date, setDate, time, setTime, note, setNote, isSubmitting, formSuccess, onSubmit: handleSubmit }

  const mobileNav = [
    { href: "/demo", label: "Start", icon: <IconHome />, active: activeTab === "dashboard", onClick: () => setActiveTab("dashboard") },
    { href: "/demo/calendar", label: "Kalender", icon: <IconCalendar />, active: false, onClick: undefined },
    { href: "/demo/customers", label: "Kunden", icon: <IconUsers />, active: false, onClick: undefined },
  ]

  const tabs: { id: "dashboard" | "buchung"; label: string; badge?: string }[] = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "buchung", label: "🔗 Buchungs-Add-on", badge: "229 €/Mo" },
  ]

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Manrope',sans-serif", background: G.bg2 }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .demo-tab { cursor:pointer; border:none; transition:all .15s; }
        .demo-tab:hover { background: #F9FAFB !important; }
      `}</style>

      <DemoBanner />

      {/* ── Nav ── */}
      <nav style={{
        background: "#fff", borderBottom: `1px solid ${G.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 58,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.3px", textDecoration: "none" }}>
            <span style={{ color: G.green }}>Termin</span><span style={{ color: G.ink }}>Stop</span>
          </a>
          <div style={{ display: "flex", gap: 2 }} className="hidden md:flex">
            {[
              { label: "Dashboard", tab: "dashboard" as const },
              { label: "Kalender", href: "/demo/calendar" },
              { label: "Kunden", href: "/demo/customers" },
            ].map(item => (
              item.tab ? (
                <button key={item.label} className="demo-tab" onClick={() => setActiveTab(item.tab!)} style={{
                  position: "relative", textDecoration: "none", padding: "6px 14px",
                  borderRadius: 9, fontSize: 13.5, fontWeight: activeTab === item.tab ? 700 : 500,
                  color: activeTab === item.tab ? G.ink : G.muted,
                  background: activeTab === item.tab ? G.greenSoft : "transparent",
                }}>
                  {item.label}
                  {activeTab === item.tab && <span style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, borderRadius: 99, background: G.green }} />}
                </button>
              ) : (
                <a key={item.label} href={item.href} style={{ position: "relative", textDecoration: "none", padding: "6px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 500, color: G.muted }}>
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: G.green, fontWeight: 600 }} className="hidden md:flex">
            <span style={{ width: 7, height: 7, background: G.green, borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            Demo aktiv
          </div>
          <a href="/lead" style={{ fontSize: 13, color: "#fff", background: G.green, border: "none", cursor: "pointer", padding: "7px 16px", borderRadius: 9, fontWeight: 700, textDecoration: "none" }}>
            Jetzt testen →
          </a>
        </div>
      </nav>

      {/* ── Tab bar ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} className="demo-tab" onClick={() => setActiveTab(tab.id)} style={{
              padding: "14px 20px 12px", fontWeight: activeTab === tab.id ? 800 : 500,
              fontSize: 14, color: activeTab === tab.id ? G.green : G.muted,
              background: "transparent", borderBottom: activeTab === tab.id ? `2.5px solid ${G.green}` : "2.5px solid transparent",
              borderTop: "none", borderLeft: "none", borderRight: "none",
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" as const,
              cursor: "pointer", marginBottom: -1,
            }}>
              {tab.label}
              {tab.badge && (
                <span style={{ fontSize: 10, fontWeight: 800, background: activeTab === tab.id ? G.green : "#F3F4F6", color: activeTab === tab.id ? "#fff" : G.muted, borderRadius: 99, padding: "2px 8px" }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Dashboard Tab ── */}
      {activeTab === "dashboard" && (
        <>
          {/* Mobile form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-end md:hidden"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
              onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
              <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[92dvh] overflow-y-auto shadow-2xl">
                <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-[#111827]">Neuer Termin</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-sm">✕</button>
                </div>
                <DemoForm {...formProps} />
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-[#9CA3AF] font-medium mb-0.5">
                  {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 className="text-xl font-bold text-[#111827]">
                  {allToday.length === 0 ? "Heute keine Termine" : `${allToday.length} Termin${allToday.length !== 1 ? "e" : ""} heute`}
                </h1>
              </div>
              <button onClick={() => setShowForm(true)}
                className="hidden md:flex items-center gap-2 bg-[#18A66D] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#15955F] transition active:scale-[.97]">
                + Termin
              </button>
            </div>

            {/* Progress bar */}
            {allToday.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#6B7280]">{doneCount} von {allToday.length} erledigt</span>
                    <span className="text-xs font-bold text-[#18A66D]">{pct} %</span>
                  </div>
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#18A66D] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {openCount > 0 && (
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-[#111827]">{openCount}</div>
                    <div className="text-xs text-[#9CA3AF] font-medium">offen</div>
                  </div>
                )}
              </div>
            )}

            {/* Hint: switch to booking tab */}
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>🔗</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>Buchungs-Add-on aktivieren</div>
                  <div style={{ fontSize: 11, color: "#B45309" }}>Kunden buchen rund um die Uhr — direkt in dieses Dashboard.</div>
                </div>
              </div>
              <button onClick={() => setActiveTab("buchung")} style={{ fontSize: 12, fontWeight: 700, color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 14px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                Demo ansehen →
              </button>
            </div>

            <div className="flex gap-5 items-start">
              {/* Appointment list */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                  {allToday.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="text-5xl mb-3">📅</div>
                      <div className="text-sm font-semibold text-[#374151] mb-1">Noch keine Termine für heute</div>
                      <div className="text-xs text-[#9CA3AF]">Tippe auf + um einen Termin hinzuzufügen</div>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F3F4F6]">
                      {allToday.map((a: any) => {
                        const isDone = a.status === "done"
                        const isNext = a.id === nextOpen?.id
                        const isNew  = a.id === justAddedId
                        return (
                          <div key={a.id} className={`flex items-center gap-4 px-5 py-4 transition-all ${isDone ? "opacity-40" : isNext ? "bg-[#F0FBF6]" : "hover:bg-[#FAFAFA]"} ${isNew ? "animate-pulse" : ""}`}>
                            <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 min-w-[46px] text-center ${isNext ? "bg-[#18A66D] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                              {a.time}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold truncate ${isDone ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>{a.name}</div>
                              {a.note && <div className="text-xs text-[#9CA3AF] truncate mt-0.5">{a.note}</div>}
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#18A66D] bg-[#F0FBF6] px-2.5 py-1 rounded-full font-medium shrink-0">
                              <span className="w-1 h-1 bg-[#18A66D] rounded-full" />SMS ✓
                            </div>
                            <button onClick={() => toggleDone(a)}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? "bg-[#18A66D] border-[#18A66D]" : "border-[#D1D5DB] hover:border-[#18A66D]"}`}>
                              {isDone && <span className="text-white text-xs font-bold">✓</span>}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop form */}
              <div className="hidden md:block w-72 flex-shrink-0">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sticky top-20">
                  <h2 className="text-sm font-bold text-[#111827] mb-4">Neuer Termin</h2>
                  <DemoForm {...formProps} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile FAB */}
          <button onClick={() => setShowForm(true)}
            className="md:hidden fixed bottom-20 right-5 z-40 w-14 h-14 bg-[#18A66D] text-white text-3xl font-light rounded-full shadow-xl flex items-center justify-center hover:bg-[#15955F] transition active:scale-95">
            +
          </button>
        </>
      )}

      {/* ── Buchungs-Add-on Tab ── */}
      {activeTab === "buchung" && <BookingDemoPanel />}

      {/* ── Conversion strip ── */}
      <div style={{
        background: "linear-gradient(135deg, #0D6B46, #18A66D)",
        padding: "48px 32px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 12 }}>Das war die Demo</div>
          <h3 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", margin: "0 0 12px", lineHeight: 1.1 }}>
            Bereit für Ihren echten Betrieb?
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 28px", lineHeight: 1.65 }}>
            Kein Vertrag, keine versteckten Kosten. In 10 Minuten einsatzbereit.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            <a href="/lead" style={{
              background: "#fff", color: G.greenInk, fontWeight: 800, fontSize: 15,
              padding: "15px 30px", borderRadius: 12, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)", letterSpacing: "-0.2px",
            }}>
              Jetzt kostenlos testen →
            </a>
            <a href="/" style={{
              background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: 15,
              padding: "15px 24px", borderRadius: 12, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              Zur Landingpage
            </a>
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" as const }}>
            {["✓ Kein Vertrag", "✓ Monatlich kündbar", "✓ Persönliches Onboarding"].map(t => (
              <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div style={{ display: "flex", position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${G.border}`, boxShadow: "0 -2px 12px rgba(0,0,0,0.06)", zIndex: 50, paddingBottom: "max(10px,env(safe-area-inset-bottom))", justifyContent: "space-around", alignItems: "center", paddingTop: 8 }} className="md:hidden">
        {mobileNav.map(item => (
          item.onClick ? (
            <button key={item.label} onClick={item.onClick} style={{ position: "relative", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, padding: "4px 12px", color: item.active ? G.green : G.muted2, minWidth: 52, background: "none", border: "none", cursor: "pointer" }}>
              {item.active && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, borderRadius: 99, background: G.green }} />}
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, letterSpacing: .2 }}>{item.label}</span>
            </button>
          ) : (
            <a key={item.label} href={item.href} style={{ position: "relative", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, padding: "4px 12px", textDecoration: "none", color: item.active ? G.green : G.muted2, minWidth: 52 }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: .2 }}>{item.label}</span>
            </a>
          )
        ))}
        <button onClick={() => setActiveTab("buchung")} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, padding: "4px 12px", color: activeTab === "buchung" ? G.green : G.muted2, minWidth: 52, background: "none", border: "none", cursor: "pointer" }}>
          <IconLink />
          <span style={{ fontSize: 10, fontWeight: activeTab === "buchung" ? 700 : 500, letterSpacing: .2 }}>Buchung</span>
        </button>
        <a href="/lead" style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, padding: "4px 12px", textDecoration: "none", color: G.green, minWidth: 52 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: .2 }}>Testen</span>
        </a>
      </div>
    </div>
  )
}
