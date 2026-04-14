"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

type Service = { id: string; name: string; duration: number; price: number | null }
type Company = { id: string; name: string; booking_note: string | null }
type BookingType = "service" | "open" | "callback"
type Step = "type" | "service" | "datetime" | "contact" | "confirm" | "done"

function formatDur(m: number) {
  if (m < 60) return `${m} Min.`
  const h = Math.floor(m / 60), r = m % 60
  return r === 0 ? `${h} Std.` : `${h} Std. ${r} Min.`
}
function formatPrice(p: number | null) {
  return p == null ? null : p.toFixed(2).replace(".", ",") + "\u00A0€"
}
function formatDT(date: string, time: string) {
  return new Date(`${date}T${time}`).toLocaleString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }) + " Uhr"
}

const STEP_ORDER: Record<BookingType, Step[]> = {
  service:  ["type","service","datetime","contact","confirm"],
  open:     ["type","datetime","contact","confirm"],
  callback: ["type","contact","confirm"],
}

export default function BookingPage() {
  const params = useParams()
  const slug   = params?.slug as string

  const [company,  setCompany]  = useState<Company | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [step,            setStep]            = useState<Step>("type")
  const [bookingType,     setBookingType]     = useState<BookingType>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [requestText,     setRequestText]     = useState("")
  const [date,            setDate]            = useState("")
  const [time,            setTime]            = useState("")
  const [name,            setName]            = useState("")
  const [phone,           setPhone]           = useState("")
  const [note,            setNote]            = useState("")
  const [submitting,      setSubmitting]      = useState(false)
  const [error,           setError]           = useState("")

  useEffect(() => { if (slug) loadCompany() }, [slug])

  async function loadCompany() {
    setLoading(true)
    const { data: co, error: coErr } = await supabase
      .from("companies")
      .select("id, name, booking_note, booking_active")
      .eq("slug", slug)
      .single()
    if (coErr || !co || co.booking_active === false) {
      setNotFound(true); setLoading(false); return
    }
    setCompany({ id: co.id, name: co.name, booking_note: co.booking_note })
    const { data: svcs } = await supabase
      .from("services")
      .select("id, name, duration, price")
      .eq("company_id", co.id).eq("active", true).order("name")
    setServices(svcs || [])
    setLoading(false)
  }

  function goNext() {
    const steps = STEP_ORDER[bookingType]
    const idx   = steps.indexOf(step)
    if (idx < steps.length - 1) setStep(steps[idx + 1])
  }
  function goBack() {
    const steps = STEP_ORDER[bookingType]
    const idx   = steps.indexOf(step)
    if (idx > 0) setStep(steps[idx - 1])
  }

  // Progress: exclude "confirm" from bar count
  function progressPct() {
    const steps = STEP_ORDER[bookingType].filter(s => s !== "confirm")
    const idx   = steps.indexOf(step)
    return idx < 0 ? 100 : Math.round(((idx) / (steps.length - 1)) * 100)
  }

  async function submitBooking() {
    if (!company) return
    setSubmitting(true); setError("")

    let appointmentName = name.trim()
    if (bookingType === "service" && selectedService) {
      appointmentName = `${name.trim()} [Online: ${selectedService.name}]`
    } else if (bookingType === "open") {
      appointmentName = `${name.trim()} [Online: Termin]`
    } else {
      appointmentName = `${name.trim()} [Rückruf]`
    }

    const { error: insertErr } = await supabase
      .from("appointments")
      .insert({
        company_id:    company.id,
        name:          appointmentName,
        phone:         phone.trim(),
        note:          note.trim() || null,
        date:          bookingType === "callback" ? null : date || null,
        time:          bookingType === "callback" ? null : time || null,
        status:        "pending",
        online_booking: true,
        request_text:  requestText.trim() || null,
      })

    if (insertErr) {
      setError(insertErr.message?.includes("RATE_LIMIT")
        ? "Du hast heute bereits 3 Anfragen gesendet. Bitte morgen erneut versuchen."
        : "Etwas ist schiefgelaufen. Bitte versuche es erneut.")
      setSubmitting(false); return
    }
    setStep("done"); setSubmitting(false)
  }

  const today = new Date().toISOString().split("T")[0]

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) return (
    <Scaffold>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:12, padding:"60px 0" }}>
        <Spinner />
        <p style={{ color:"#94A3B8", fontSize:14 }}>Wird geladen …</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Scaffold>
  )

  if (notFound) return (
    <Scaffold>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, padding:"60px 24px", textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:"0 0 8px" }}>Link nicht gefunden</h1>
        <p style={{ color:"#64748B", lineHeight:1.6, fontSize:15, margin:0 }}>Dieser Buchungslink ist nicht aktiv.<br/>Bitte wende dich direkt an den Betrieb.</p>
      </div>
    </Scaffold>
  )

  // ─── Done ────────────────────────────────────────────────────────
  if (step === "done") return (
    <Scaffold>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
        <div style={{ width:80, height:80, background:"linear-gradient(135deg,#4F6EF7,#7C3AED)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20 }}>✓</div>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1E293B", margin:"0 0 10px" }}>
          {bookingType === "callback" ? "Rückruf angefragt!" : "Anfrage gesendet!"}
        </h2>
        <p style={{ color:"#64748B", lineHeight:1.65, fontSize:15, margin:"0 0 28px", maxWidth:340 }}>
          Deine Anfrage bei <strong style={{ color:"#1E293B" }}>{company?.name}</strong> ist eingegangen.
          {bookingType === "callback"
            ? " Du wirst so bald wie möglich zurückgerufen."
            : " Du wirst kontaktiert, sobald der Termin bestätigt ist."}
        </p>
        <div style={{ background:"#F8FAFF", borderRadius:20, padding:"4px 0", border:"1px solid #EEF2FF", width:"100%", maxWidth:400 }}>
          {bookingType !== "callback" && date && <SummaryRow label="Wunschtermin" value={formatDT(date, time)} />}
          {selectedService && <SummaryRow label="Leistung" value={selectedService.name} />}
          {requestText && <SummaryRow label="Anliegen" value={requestText} />}
          <SummaryRow label="Name"    value={name} />
          <SummaryRow label="Telefon" value={phone} last />
        </div>
        <p style={{ marginTop:24, fontSize:13, color:"#94A3B8" }}>Du kannst dieses Fenster jetzt schließen.</p>
      </div>
    </Scaffold>
  )

  // ─── Header ──────────────────────────────────────────────────────
  const showProgress = step !== "type"

  return (
    <div style={{ minHeight:"100dvh", background:"#F1F5FF", fontFamily:"'Inter',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>

      {/* ── Top bar ── */}
      <div style={{ background:"linear-gradient(135deg,#4F6EF7 0%,#7C3AED 100%)", padding:"env(safe-area-inset-top,0px) 0 0" }}>
        <div style={{ maxWidth:520, margin:"0 auto", padding:"20px 20px 24px" }}>
          {showProgress && (
            <button onClick={goBack}
              style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:20, color:"#fff", fontSize:13, fontWeight:600, padding:"6px 14px", cursor:"pointer", marginBottom:14, display:"inline-flex", alignItems:"center", gap:6 }}>
              ← Zurück
            </button>
          )}
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", margin:"0 0 4px" }}>
            Online-Buchung
          </p>
          <h1 style={{ color:"#fff", fontSize:22, fontWeight:800, margin:0, letterSpacing:-0.3 }}>{company?.name}</h1>
          {company?.booking_note && (
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13, margin:"8px 0 0", lineHeight:1.6 }}>{company.booking_note}</p>
          )}

          {/* Progress bar */}
          {showProgress && (
            <div style={{ marginTop:16, height:3, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"rgba(255,255,255,0.9)", borderRadius:4, width:`${progressPct()}%`, transition:"width 0.4s ease" }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Content card ── */}
      <div style={{ flex:1, maxWidth:520, margin:"0 auto", width:"100%", padding:"0 12px 32px" }}>
        <div style={{ background:"#fff", borderRadius:"24px 24px 20px 20px", marginTop:-12, boxShadow:"0 8px 40px rgba(79,110,247,0.1)", padding:"28px 20px 24px", minHeight:400 }}>

          {/* ── STEP: type ── */}
          {step === "type" && (
            <div>
              <h2 style={sh2}>Wie kann {company?.name} helfen?</h2>
              <p style={sp}>Wähle, wie du einen Termin vereinbaren möchtest.</p>

              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:20 }}>
                {services.length > 0 && (
                  <TypeCard
                    icon="✂️"
                    title="Leistung auswählen"
                    sub={`${services.length} Leistung${services.length > 1 ? "en" : ""} verfügbar`}
                    active={bookingType === "service"}
                    onClick={() => { setBookingType("service"); setSelectedService(null); setStep("service") }}
                  />
                )}
                <TypeCard
                  icon="📅"
                  title="Einfach Termin vereinbaren"
                  sub="Ich weiß noch nicht genau was — einfach Termin"
                  active={bookingType === "open"}
                  onClick={() => { setBookingType("open"); setStep("datetime") }}
                />
                <TypeCard
                  icon="📞"
                  title="Rückruf wünschen"
                  sub="Ich möchte zunächst kurz gesprochen werden"
                  active={bookingType === "callback"}
                  onClick={() => { setBookingType("callback"); setStep("contact") }}
                />
              </div>
            </div>
          )}

          {/* ── STEP: service ── */}
          {step === "service" && (
            <div>
              <h2 style={sh2}>Leistung wählen</h2>
              <p style={sp}>Was soll {company?.name} für dich tun?</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
                {services.map(svc => (
                  <button key={svc.id}
                    onClick={() => { setSelectedService(svc); goNext() }}
                    style={{ background: selectedService?.id === svc.id ? "#F0F4FF" : "#F8FAFF", border:`2px solid ${selectedService?.id === svc.id ? "#4F6EF7" : "#EEF2FF"}`, borderRadius:16, padding:"16px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, transition:"all 0.15s" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, color:"#1E293B", margin:"0 0 3px", fontSize:15, lineHeight:1.3 }}>{svc.name}</p>
                      <p style={{ color:"#94A3B8", margin:0, fontSize:13 }}>{formatDur(svc.duration)}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                      {svc.price != null && <span style={{ fontWeight:800, color:"#4F6EF7", fontSize:16 }}>{formatPrice(svc.price)}</span>}
                      <div style={{ width:30, height:30, background:"linear-gradient(135deg,#4F6EF7,#7C3AED)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700 }}>›</div>
                    </div>
                  </button>
                ))}

                {/* Wunsch eingeben */}
                <div style={{ marginTop:4 }}>
                  <p style={{ fontSize:13, color:"#94A3B8", marginBottom:8 }}>Oder kurz beschreiben was du brauchst:</p>
                  <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                    placeholder="z.B. Farbbehandlung, Nagelpflege, Beratung …"
                    rows={2}
                    style={{ width:"100%", padding:"12px 14px", border:"2px solid #EEF2FF", borderRadius:14, fontSize:14, color:"#1E293B", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#F8FAFF" }} />
                  {requestText.trim() && (
                    <Btn onClick={() => { setSelectedService(null); goNext() }} style={{ marginTop:8 }}>
                      Weiter mit freiem Wunsch →
                    </Btn>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP: datetime ── */}
          {step === "datetime" && (
            <div>
              <h2 style={sh2}>Wann passt es?</h2>
              {selectedService && (
                <div style={{ background:"#F0F4FF", borderRadius:10, padding:"8px 14px", marginBottom:16, display:"inline-flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#4F6EF7" }}>{selectedService.name}</span>
                  <span style={{ color:"#C7D2FE" }}>·</span>
                  <span style={{ fontSize:13, color:"#64748B" }}>{formatDur(selectedService.duration)}</span>
                </div>
              )}
              {bookingType === "open" && (
                <div style={{ marginBottom:16 }}>
                  <label style={slabel}>Was ist dein Anliegen? <span style={{ fontWeight:400, color:"#94A3B8" }}>(optional)</span></label>
                  <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                    placeholder="z.B. Beratungsgespräch, Inspektion, Haare schneiden …"
                    rows={2}
                    style={{ width:"100%", padding:"13px 14px", border:"2px solid #EEF2FF", borderRadius:14, fontSize:14, color:"#1E293B", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <label>
                  <span style={slabel}>Datum</span>
                  <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                    style={sinput} />
                </label>
                <label>
                  <span style={slabel}>Uhrzeit</span>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} step={900}
                    style={sinput} />
                </label>
              </div>
              <Btn onClick={goNext} disabled={!date || !time} style={{ marginTop:20 }}>Weiter →</Btn>
            </div>
          )}

          {/* ── STEP: contact ── */}
          {step === "contact" && (
            <div>
              <h2 style={sh2}>Deine Kontaktdaten</h2>
              <p style={sp}>
                {bookingType === "callback"
                  ? `Hinterlasse deine Nummer — ${company?.name} ruft dich zurück.`
                  : `Damit ${company?.name} dich zur Bestätigung erreicht.`}
              </p>

              {bookingType === "callback" && (
                <div style={{ marginBottom:16 }}>
                  <label style={slabel}>Was ist dein Anliegen? <span style={{ fontWeight:400, color:"#94A3B8" }}>(optional)</span></label>
                  <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                    placeholder="z.B. Frage zum Preis, Beratung, allgemeine Infos …"
                    rows={2}
                    style={{ width:"100%", padding:"13px 14px", border:"2px solid #EEF2FF", borderRadius:14, fontSize:14, color:"#1E293B", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <label>
                  <span style={slabel}>Vor- und Nachname *</span>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Max Mustermann" style={sinput} />
                </label>
                <label>
                  <span style={slabel}>Telefonnummer *</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0151 12345678" style={sinput} />
                </label>
                <label>
                  <span style={slabel}>Anmerkung <span style={{ fontWeight:400, color:"#94A3B8" }}>(optional)</span></span>
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="z.B. bitte kurz klingeln"
                    rows={2}
                    style={{ width:"100%", padding:"13px 14px", border:"2px solid #EEF2FF", borderRadius:14, fontSize:14, color:"#1E293B", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                </label>
              </div>
              <Btn onClick={goNext} disabled={!name.trim() || !phone.trim()} style={{ marginTop:20 }}>Weiter →</Btn>
            </div>
          )}

          {/* ── STEP: confirm ── */}
          {step === "confirm" && (
            <div>
              <h2 style={sh2}>Alles korrekt?</h2>
              <p style={sp}>Überprüfe kurz deine Angaben.</p>

              <div style={{ background:"#F8FAFF", borderRadius:18, padding:"4px 0", border:"1px solid #EEF2FF", marginBottom:16 }}>
                <SummaryRow label="Betrieb"  value={company?.name || ""} />
                {bookingType === "service" && selectedService && <SummaryRow label="Leistung" value={selectedService.name} />}
                {bookingType === "service" && selectedService && <SummaryRow label="Dauer"    value={formatDur(selectedService.duration)} />}
                {selectedService?.price != null && <SummaryRow label="Preis" value={formatPrice(selectedService.price) || ""} />}
                {requestText && <SummaryRow label="Anliegen" value={requestText} />}
                {bookingType !== "callback" && date && <SummaryRow label="Wunschtermin" value={formatDT(date, time)} />}
                {bookingType === "callback" && <SummaryRow label="Art" value="Rückruf" />}
                <SummaryRow label="Name"    value={name} />
                <SummaryRow label="Telefon" value={phone} last={!note} />
                {note && <SummaryRow label="Anmerkung" value={note} last />}
              </div>

              <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"12px 14px", marginBottom:16, fontSize:13, color:"#1D4ED8", lineHeight:1.6 }}>
                ℹ️ {bookingType === "callback"
                  ? `${company?.name} wird dich so bald wie möglich zurückrufen.`
                  : `Dies ist eine Anfrage. ${company?.name} bestätigt den Termin und meldet sich bei dir.`}
              </div>

              {error && (
                <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 14px", marginBottom:16, fontSize:14, color:"#DC2626", lineHeight:1.5 }}>
                  {error}
                </div>
              )}

              <Btn onClick={submitBooking} disabled={submitting}>
                {submitting ? "Wird gesendet …" : bookingType === "callback" ? "Rückruf anfragen ✓" : "Anfrage absenden ✓"}
              </Btn>

              <p style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:12, lineHeight:1.5 }}>
                Mit dem Absenden stimmst du der Verarbeitung deiner Kontaktdaten zu.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:16 }}>
          Powered by <span style={{ color:"#4F6EF7", fontWeight:700 }}>TerminStop</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]:focus, input[type="time"]:focus, input[type="text"]:focus, input[type="tel"]:focus {
          border-color: #4F6EF7 !important;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.12);
        }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────
const sh2: React.CSSProperties = { fontSize:21, fontWeight:800, color:"#1E293B", margin:"0 0 4px", letterSpacing:-0.3 }
const sp:  React.CSSProperties = { color:"#64748B", fontSize:14, margin:"0 0 4px", lineHeight:1.5 }
const slabel: React.CSSProperties = { display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }
const sinput: React.CSSProperties = { width:"100%", padding:"14px 16px", border:"2px solid #EEF2FF", borderRadius:14, fontSize:15, color:"#1E293B", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#FAFBFF", transition:"border-color 0.15s" }

// ── Components ────────────────────────────────────────────────

function Scaffold({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 100%)", fontFamily:"'Inter',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      {children}
    </div>
  )
}

function Spinner() {
  return <div style={{ width:40, height:40, border:"3px solid #E8EEFF", borderTopColor:"#4F6EF7", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
}

function TypeCard({ icon, title, sub, active, onClick }: { icon:string; title:string; sub:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick}
      style={{ background: active ? "#F0F4FF" : "#F8FAFF", border:`2px solid ${active ? "#4F6EF7" : "#EEF2FF"}`, borderRadius:18, padding:"16px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, transition:"all 0.15s", width:"100%" }}>
      <div style={{ width:44, height:44, background: active ? "linear-gradient(135deg,#4F6EF7,#7C3AED)" : "#EEF2FF", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, transition:"all 0.15s" }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, color:"#1E293B", margin:"0 0 3px", fontSize:15 }}>{title}</p>
        <p style={{ color:"#94A3B8", margin:0, fontSize:13, lineHeight:1.3 }}>{sub}</p>
      </div>
      <div style={{ color: active ? "#4F6EF7" : "#CBD5E1", fontSize:18, flexShrink:0 }}>›</div>
    </button>
  )
}

function Btn({ onClick, disabled, children, style }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width:"100%", padding:"15px 0", background: disabled ? "#E2E8F0" : "linear-gradient(135deg,#4F6EF7 0%,#7C3AED 100%)", color: disabled ? "#94A3B8" : "#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer", transition:"all 0.2s", letterSpacing:0.2, boxShadow: disabled ? "none" : "0 4px 20px rgba(79,110,247,0.35)", ...style }}>
      {children}
    </button>
  )
}

function SummaryRow({ label, value, last }: { label:string; value:string; last?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"11px 18px", borderBottom: last ? "none" : "1px solid #EEF2FF" }}>
      <span style={{ fontSize:13, color:"#94A3B8", flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color:"#1E293B", fontWeight:600, textAlign:"right", wordBreak:"break-word" }}>{value}</span>
    </div>
  )
}
