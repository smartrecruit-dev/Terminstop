"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

type Service    = { id: string; name: string; duration: number; price: number | null }
type Company    = { id: string; name: string; booking_note: string | null }
type BookingType = "service" | "open" | "callback"
type Step        = "type" | "service" | "datetime" | "contact" | "confirm" | "done"

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
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
  }) + " Uhr"
}

const STEP_ORDER: Record<BookingType, Step[]> = {
  service:  ["type", "service", "datetime", "contact", "confirm"],
  open:     ["type", "datetime", "contact", "confirm"],
  callback: ["type", "contact", "confirm"],
}

const G  = "#18A66D"
const GL = "#F0FBF6"
const GB = "#D1F5E3"
const T  = "#111827"
const M  = "#6B7280"
const M2 = "#9CA3AF"
const BG = "#F9FAFB"
const WH = "#FFFFFF"
const BD = "#E5E7EB"

/* ── shared input style ─────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  border: `1.5px solid ${BD}`, borderRadius: 12,
  fontSize: 15, color: T, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
  background: WH, transition: "border-color .15s, box-shadow .15s",
}
const lbl: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 700,
  color: "#374151", marginBottom: 6,
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
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
      .select("id, name, booking_note, booking_active, booking_addon")
      .eq("slug", slug).single()
    if (coErr || !co || co.booking_active === false || co.booking_addon === false) {
      setNotFound(true); setLoading(false); return
    }
    setCompany({ id: co.id, name: co.name, booking_note: co.booking_note })
    const { data: svcs } = await supabase
      .from("services").select("id, name, duration, price")
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
    else setStep("type")
  }

  function progressPct() {
    const steps = STEP_ORDER[bookingType]
    const idx   = steps.indexOf(step)
    return idx < 0 ? 0 : Math.round((idx / (steps.length - 1)) * 100)
  }

  async function submitBooking() {
    if (!company) return
    setSubmitting(true); setError("")
    let appointmentName = name.trim()
    if (bookingType === "service" && selectedService)
      appointmentName = `${name.trim()} [Online: ${selectedService.name}]`
    else if (bookingType === "open")
      appointmentName = `${name.trim()} [Online: Termin]`
    else
      appointmentName = `${name.trim()} [Rückruf]`

    const { error: insertErr } = await supabase.from("appointments").insert({
      company_id:     company.id,
      name:           appointmentName,
      phone:          phone.trim(),
      note:           note.trim() || null,
      date:           bookingType === "callback" ? null : date || null,
      time:           bookingType === "callback" ? null : time || null,
      status:         "pending",
      online_booking: true,
      request_text:   requestText.trim() || null,
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

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) return (
    <Shell>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:14, padding:"80px 0" }}>
        <div style={{ width:44, height:44, border:`3px solid ${GB}`, borderTopColor:G, borderRadius:"50%", animation:"spin .7s linear infinite" }} />
        <p style={{ color:M2, fontSize:14, margin:0 }}>Lädt …</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Shell>
  )

  if (notFound) return (
    <Shell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px", textAlign:"center" }}>
        <div style={{ width:72, height:72, background:BG, border:`1.5px solid ${BD}`, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:20 }}>🔍</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:T, margin:"0 0 10px" }}>Link nicht gefunden</h1>
        <p style={{ color:M, lineHeight:1.65, fontSize:15, margin:0, maxWidth:300 }}>Dieser Buchungslink ist nicht aktiv. Bitte wende dich direkt an den Betrieb.</p>
      </div>
    </Shell>
  )

  /* ── Done ────────────────────────────────────────────────── */
  if (step === "done") return (
    <Shell>
      <style>{`@keyframes popIn{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
        <div style={{ width:80, height:80, background:G, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#fff", marginBottom:24, boxShadow:`0 12px 40px rgba(24,166,109,0.3)`, animation:"popIn .5s cubic-bezier(.16,1,.3,1)" }}>✓</div>
        <h2 style={{ fontSize:26, fontWeight:900, color:T, margin:"0 0 10px", letterSpacing:"-.5px" }}>
          {bookingType === "callback" ? "Rückruf angefragt!" : "Anfrage gesendet!"}
        </h2>
        <p style={{ color:M, lineHeight:1.7, fontSize:15, margin:"0 0 32px", maxWidth:340 }}>
          Deine Anfrage bei <strong style={{ color:T }}>{company?.name}</strong> ist eingegangen.
          {bookingType === "callback"
            ? " Du wirst so bald wie möglich zurückgerufen."
            : " Du erhältst eine Bestätigung, sobald der Termin freigegeben wurde."}
        </p>

        <div style={{ width:"100%", maxWidth:400, background:WH, border:`1.5px solid ${BD}`, borderRadius:16, overflow:"hidden" }}>
          {bookingType !== "callback" && date && <SRow label="Wunschtermin" value={formatDT(date, time)} />}
          {selectedService && <SRow label="Leistung" value={selectedService.name} />}
          {requestText && <SRow label="Anliegen" value={requestText} />}
          <SRow label="Name"    value={name} />
          <SRow label="Telefon" value={phone} last />
        </div>

        <p style={{ marginTop:28, fontSize:13, color:M2 }}>Du kannst dieses Fenster jetzt schließen.</p>

        <div style={{ marginTop:32, display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:20, height:20, background:G, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>T</span>
          </div>
          <span style={{ fontSize:12, color:M2 }}>Powered by <strong style={{ color:G }}>TerminStop</strong></span>
        </div>
      </div>
    </Shell>
  )

  /* ── Main ────────────────────────────────────────────────── */
  const showBack = step !== "type"

  return (
    <Shell>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input:focus, textarea:focus { border-color:${G}!important; box-shadow:0 0 0 3px rgba(24,166,109,0.12)!important; outline:none; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity:.5; cursor:pointer; }
        * { -webkit-tap-highlight-color:transparent; }
        .step-anim { animation:fadeUp .35s cubic-bezier(.16,1,.3,1); }
        .type-card { transition:all .18s ease; }
        .type-card:hover { border-color:${G}!important; background:${GL}!important; transform:translateY(-1px); box-shadow:0 6px 20px rgba(24,166,109,0.1); }
        .svc-btn { transition:all .18s ease; }
        .svc-btn:hover { border-color:${G}!important; background:${GL}!important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:WH, borderBottom:`1px solid ${BD}`, padding:"env(safe-area-inset-top,0) 0 0" }}>
        <div style={{ maxWidth:520, margin:"0 auto", padding:"16px 20px 16px" }}>

          {/* Top row: back + brand */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            {showBack ? (
              <button onClick={goBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:M, fontSize:14, fontWeight:600, padding:"4px 0" }}>
                <span style={{ fontSize:18, lineHeight:1 }}>←</span> Zurück
              </button>
            ) : <div />}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, background:G, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>T</span>
              </div>
              <span style={{ fontSize:12, color:M2, fontWeight:600 }}>TerminStop</span>
            </div>
          </div>

          {/* Company info */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:52, height:52, background:GL, border:`1.5px solid ${GB}`, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>📅</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:.8, textTransform:"uppercase", marginBottom:3 }}>Online-Buchung</div>
              <h1 style={{ fontSize:20, fontWeight:900, color:T, margin:0, letterSpacing:"-.4px", lineHeight:1.2 }}>{company?.name}</h1>
              {company?.booking_note && (
                <p style={{ fontSize:13, color:M, margin:"5px 0 0", lineHeight:1.5 }}>{company.booking_note}</p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {showBack && (
            <div style={{ marginTop:16 }}>
              <div style={{ height:3, background:BG, borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", background:G, borderRadius:4, width:`${progressPct()}%`, transition:"width .4s ease" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex:1, maxWidth:520, margin:"0 auto", width:"100%", padding:"20px 16px 40px" }}>

        {/* ── STEP: type ── */}
        {step === "type" && (
          <div className="step-anim">
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.4px" }}>Wie kann ich helfen?</h2>
              <p style={{ color:M, fontSize:14, margin:0, lineHeight:1.5 }}>Wähle, wie du einen Termin vereinbaren möchtest.</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {services.length > 0 && (
                <button className="type-card" onClick={() => { setBookingType("service"); setSelectedService(null); setStep("service") }}
                  style={{ background:WH, border:`1.5px solid ${BD}`, borderRadius:16, padding:"18px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, width:"100%" }}>
                  <div style={{ width:48, height:48, background:GL, border:`1px solid ${GB}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>✂️</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, color:T, margin:"0 0 4px", fontSize:15 }}>Leistung wählen</p>
                    <p style={{ color:M2, margin:0, fontSize:13 }}>{services.length} Leistung{services.length > 1 ? "en" : ""} verfügbar</p>
                  </div>
                  <span style={{ color:M2, fontSize:20, fontWeight:300 }}>›</span>
                </button>
              )}

              <button className="type-card" onClick={() => { setBookingType("open"); setStep("datetime") }}
                style={{ background:WH, border:`1.5px solid ${BD}`, borderRadius:16, padding:"18px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, width:"100%" }}>
                <div style={{ width:48, height:48, background:"#EEF2FF", border:"1px solid #C7D2FE", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🗓️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:T, margin:"0 0 4px", fontSize:15 }}>Termin vereinbaren</p>
                  <p style={{ color:M2, margin:0, fontSize:13 }}>Ich möchte einfach einen Termin anfragen</p>
                </div>
                <span style={{ color:M2, fontSize:20, fontWeight:300 }}>›</span>
              </button>

              <button className="type-card" onClick={() => { setBookingType("callback"); setStep("contact") }}
                style={{ background:WH, border:`1.5px solid ${BD}`, borderRadius:16, padding:"18px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, width:"100%" }}>
                <div style={{ width:48, height:48, background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>📞</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:T, margin:"0 0 4px", fontSize:15 }}>Rückruf wünschen</p>
                  <p style={{ color:M2, margin:0, fontSize:13 }}>Ich möchte zuerst kurz sprechen</p>
                </div>
                <span style={{ color:M2, fontSize:20, fontWeight:300 }}>›</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: service ── */}
        {step === "service" && (
          <div className="step-anim">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.4px" }}>Leistung wählen</h2>
              <p style={{ color:M, fontSize:14, margin:0 }}>Was soll für dich gemacht werden?</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {services.map(svc => (
                <button key={svc.id} className="svc-btn"
                  onClick={() => { setSelectedService(svc); goNext() }}
                  style={{ background:WH, border:`1.5px solid ${BD}`, borderRadius:14, padding:"15px 16px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, width:"100%" }}>
                  <div style={{ width:40, height:40, background:GL, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, color:G, fontWeight:800 }}>
                    {svc.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, color:T, margin:"0 0 3px", fontSize:15, lineHeight:1.3 }}>{svc.name}</p>
                    <p style={{ color:M2, margin:0, fontSize:13 }}>{formatDur(svc.duration)}</p>
                  </div>
                  {svc.price != null && (
                    <span style={{ fontWeight:800, color:T, fontSize:15, background:BG, padding:"4px 10px", borderRadius:8, whiteSpace:"nowrap", flexShrink:0 }}>{formatPrice(svc.price)}</span>
                  )}
                  <span style={{ color:M2, fontSize:18, flexShrink:0 }}>›</span>
                </button>
              ))}
            </div>

            <div style={{ background:BG, border:`1.5px solid ${BD}`, borderRadius:14, padding:"16px" }}>
              <p style={{ fontSize:13, fontWeight:700, color:T, margin:"0 0 10px" }}>Oder kurz beschreiben:</p>
              <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                placeholder="z.B. Farbbehandlung, Beratung, Nagelpflege …"
                rows={2}
                style={{ ...inp, resize:"none", marginBottom:requestText.trim() ? 10 : 0 }} />
              {requestText.trim() && (
                <PrimaryBtn onClick={() => { setSelectedService(null); goNext() }}>
                  Weiter mit dieser Beschreibung →
                </PrimaryBtn>
              )}
            </div>
          </div>
        )}

        {/* ── STEP: datetime ── */}
        {step === "datetime" && (
          <div className="step-anim">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.4px" }}>Wann passt es?</h2>
              <p style={{ color:M, fontSize:14, margin:0 }}>Wähle deinen Wunschtermin.</p>
            </div>

            {selectedService && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:GL, border:`1px solid ${GB}`, borderRadius:10, padding:"7px 14px", marginBottom:20 }}>
                <span style={{ fontSize:13, fontWeight:700, color:G }}>{selectedService.name}</span>
                <span style={{ color:GB }}>·</span>
                <span style={{ fontSize:13, color:M }}>{formatDur(selectedService.duration)}</span>
              </div>
            )}

            {bookingType === "open" && (
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>Dein Anliegen <span style={{ fontWeight:400, color:M2 }}>(optional)</span></label>
                <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                  placeholder="z.B. Inspektion, Beratung, Haarschnitt …"
                  rows={2} style={{ ...inp, resize:"none" }} />
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:24 }}>
              <div>
                <label style={lbl}>Datum</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Uhrzeit</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} step={900} style={inp} />
              </div>
            </div>

            <PrimaryBtn onClick={goNext} disabled={!date || !time}>Weiter →</PrimaryBtn>
          </div>
        )}

        {/* ── STEP: contact ── */}
        {step === "contact" && (
          <div className="step-anim">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.4px" }}>Deine Kontaktdaten</h2>
              <p style={{ color:M, fontSize:14, margin:0, lineHeight:1.5 }}>
                {bookingType === "callback"
                  ? "Hinterlasse deine Nummer — der Betrieb ruft zurück."
                  : "Damit der Betrieb deinen Termin bestätigen kann."}
              </p>
            </div>

            {bookingType === "callback" && (
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>Was ist dein Anliegen? <span style={{ fontWeight:400, color:M2 }}>(optional)</span></label>
                <textarea value={requestText} onChange={e => setRequestText(e.target.value)}
                  placeholder="z.B. Frage zum Preis, Beratung …"
                  rows={2} style={{ ...inp, resize:"none" }} />
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:24 }}>
              <div>
                <label style={lbl}>Vor- und Nachname *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Max Mustermann" style={inp} autoComplete="name" />
              </div>
              <div>
                <label style={lbl}>Telefonnummer *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0151 12345678" style={inp} autoComplete="tel" />
              </div>
              <div>
                <label style={lbl}>Anmerkung <span style={{ fontWeight:400, color:M2 }}>(optional)</span></label>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="z.B. bitte kurz klingeln"
                  rows={2} style={{ ...inp, resize:"none" }} />
              </div>
            </div>

            <PrimaryBtn onClick={goNext} disabled={!name.trim() || !phone.trim()}>Weiter →</PrimaryBtn>
          </div>
        )}

        {/* ── STEP: confirm ── */}
        {step === "confirm" && (
          <div className="step-anim">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.4px" }}>Alles korrekt?</h2>
              <p style={{ color:M, fontSize:14, margin:0 }}>Überprüfe deine Angaben.</p>
            </div>

            {/* Summary card */}
            <div style={{ background:WH, border:`1.5px solid ${BD}`, borderRadius:16, overflow:"hidden", marginBottom:16 }}>
              <div style={{ background:GL, borderBottom:`1px solid ${GB}`, padding:"12px 18px", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, background:G, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>📋</div>
                <span style={{ fontSize:13, fontWeight:700, color:G }}>Deine Anfrage</span>
              </div>
              {bookingType !== "callback" && date && <SRow label="Wunschtermin" value={formatDT(date, time)} />}
              {bookingType === "callback" && <SRow label="Art" value="Rückruf" />}
              {selectedService && <SRow label="Leistung" value={`${selectedService.name} · ${formatDur(selectedService.duration)}`} />}
              {selectedService?.price != null && <SRow label="Preis" value={formatPrice(selectedService.price) || ""} />}
              {requestText && <SRow label="Anliegen" value={requestText} />}
              <SRow label="Name"    value={name} />
              <SRow label="Telefon" value={phone} last={!note} />
              {note && <SRow label="Anmerkung" value={note} last />}
            </div>

            {/* Info box */}
            <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#92400E", lineHeight:1.6, display:"flex", gap:10 }}>
              <span style={{ flexShrink:0 }}>ℹ️</span>
              <span>{bookingType === "callback"
                ? `${company?.name} wird dich so bald wie möglich zurückrufen.`
                : `Dies ist eine Anfrage — ${company?.name} bestätigt den Termin und meldet sich bei dir.`}
              </span>
            </div>

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:14, color:"#DC2626", lineHeight:1.5, display:"flex", gap:10 }}>
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <PrimaryBtn onClick={submitBooking} disabled={submitting}>
              {submitting
                ? <><Spin /> Wird gesendet …</>
                : bookingType === "callback" ? "Rückruf anfragen →" : "Anfrage absenden →"}
            </PrimaryBtn>

            <p style={{ textAlign:"center", fontSize:12, color:M2, marginTop:12, lineHeight:1.5 }}>
              Mit dem Absenden stimmst du der Verarbeitung deiner Kontaktdaten zu.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop:`1px solid ${BD}`, padding:"14px 20px", textAlign:"center", background:WH }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
          <div style={{ width:18, height:18, background:G, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:9, fontWeight:900 }}>T</span>
          </div>
          <span style={{ fontSize:12, color:M2 }}>Powered by <strong style={{ color:G }}>TerminStop</strong></span>
        </div>
      </div>
    </Shell>
  )
}

/* ── Shell ───────────────────────────────────────────────────── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:"100dvh", background:BG, fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter',sans-serif", display:"flex", flexDirection:"column" }}>
      {children}
    </div>
  )
}

/* ── Primary Button ─────────────────────────────────────────── */
function PrimaryBtn({ onClick, disabled, children }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding:"15px 0",
      background: disabled ? "#E5E7EB" : G,
      color: disabled ? "#9CA3AF" : "#fff",
      border:"none", borderRadius:13, fontSize:15, fontWeight:700,
      cursor: disabled ? "not-allowed" : "pointer",
      transition:"all .18s", letterSpacing:0.1,
      boxShadow: disabled ? "none" : "0 4px 20px rgba(24,166,109,0.28)",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    }}>
      {children}
    </button>
  )
}

/* ── Spinner ─────────────────────────────────────────────────── */
function Spin() {
  return <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />
}

/* ── Summary Row ─────────────────────────────────────────────── */
function SRow({ label, value, last }: { label:string; value:string; last?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"12px 18px", borderBottom: last ? "none" : `1px solid ${BD}` }}>
      <span style={{ fontSize:13, color:M2, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color:T, fontWeight:600, textAlign:"right", wordBreak:"break-word" }}>{value}</span>
    </div>
  )
}
