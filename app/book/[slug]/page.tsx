"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

type Service     = { id: string; name: string; duration: number; price: number | null }
type Company     = { id: string; name: string; booking_note: string | null }
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
  const initials = company?.name
    ? company.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  /* ── CSS ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; }
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes popIn   { 0% { opacity:0; transform:scale(.75); } 100% { opacity:1; transform:scale(1); } }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes checkDraw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
    .step-enter { animation: fadeUp .32s cubic-bezier(.16,1,.3,1); }
    .card-hover { transition: all .2s ease; }
    .card-hover:hover { border-color: #18A66D !important; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(24,166,109,0.13) !important; }
    .card-hover:active { transform: translateY(0); }
    .svc-hover { transition: all .18s ease; }
    .svc-hover:hover { border-color: #18A66D !important; background: #F0FBF6 !important; }
    input[type="date"]::-webkit-calendar-picker-indicator { opacity: .5; cursor: pointer; }
    input:focus, textarea:focus { border-color: #18A66D !important; box-shadow: 0 0 0 4px rgba(24,166,109,0.1) !important; outline: none !important; }
    .ts-input { width:100%; padding:14px 16px; border:1.5px solid #E5E7EB; border-radius:13px; font-size:15px; color:#111827; background:#fff; font-family:inherit; transition:border-color .15s, box-shadow .15s; }
    .ts-input::placeholder { color: #9CA3AF; }
    textarea.ts-input { resize:none; }
    .primary-btn { width:100%; padding:16px; background:#18A66D; color:#fff; border:none; border-radius:14px; font-size:15px; font-weight:700; cursor:pointer; letter-spacing:.2px; box-shadow:0 6px 24px rgba(24,166,109,0.28); transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
    .primary-btn:hover { background:#15955F; transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,166,109,0.35); }
    .primary-btn:active { transform:translateY(0); }
    .primary-btn:disabled { background:#E5E7EB; color:#9CA3AF; cursor:not-allowed; box-shadow:none; transform:none; }
    .back-btn { display:flex; align-items:center; gap:6px; background:none; border:none; cursor:pointer; color:#6B7280; font-size:14px; font-weight:600; padding:8px 0; transition:color .15s; }
    .back-btn:hover { color:#111827; }
    .skeleton { background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 400px 100%; animation: shimmer 1.4s ease infinite; border-radius: 8px; }
  `

  /* ── Loading ── */
  if (loading) return (
    <Shell css={css}>
      <div style={{ background:"#fff" }}>
        <div style={{ maxWidth:540, margin:"0 auto", padding:"28px 20px" }}>
          <div className="skeleton" style={{ width:140, height:14, marginBottom:12 }} />
          <div className="skeleton" style={{ width:240, height:28, marginBottom:8 }} />
          <div className="skeleton" style={{ width:"80%", height:14 }} />
        </div>
      </div>
      <div style={{ maxWidth:540, margin:"0 auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:12 }}>
        {[1,2,3].map(i => (
          <div key={i} className="skeleton" style={{ height:82, borderRadius:16 }} />
        ))}
      </div>
    </Shell>
  )

  /* ── Not Found ── */
  if (notFound) return (
    <Shell css={css}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px", textAlign:"center" }}>
        <div style={{ width:80, height:80, background:"#F9FAFB", border:"1.5px solid #E5E7EB", borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20 }}>🔍</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 10px" }}>Buchungsseite nicht gefunden</h1>
        <p style={{ color:"#6B7280", lineHeight:1.65, fontSize:15, margin:0, maxWidth:300 }}>Dieser Link ist nicht aktiv. Bitte wende dich direkt an den Betrieb.</p>
      </div>
    </Shell>
  )

  /* ── Done ── */
  if (step === "done") return (
    <Shell css={css}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", textAlign:"center" }}>

        {/* Success icon */}
        <div style={{ position:"relative", marginBottom:28 }}>
          <div style={{ width:96, height:96, background:"linear-gradient(135deg, #18A66D, #15955F)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 16px 48px rgba(24,166,109,0.35)", animation:"popIn .5s cubic-bezier(.16,1,.3,1)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M10 22L18 30L34 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray:40, strokeDashoffset:40, animation:"checkDraw .4s .3s ease forwards" }} />
            </svg>
          </div>
          <div style={{ position:"absolute", inset:-8, borderRadius:"50%", border:"2px solid #D1F5E3", animation:"popIn .6s .1s ease backwards" }} />
        </div>

        <h2 style={{ fontSize:28, fontWeight:900, color:"#111827", margin:"0 0 10px", letterSpacing:"-.6px" }}>
          {bookingType === "callback" ? "Rückruf angefragt!" : "Anfrage gesendet!"}
        </h2>
        <p style={{ color:"#6B7280", lineHeight:1.7, fontSize:15, margin:"0 0 8px", maxWidth:360 }}>
          Deine Anfrage bei <strong style={{ color:"#111827" }}>{company?.name}</strong> ist eingegangen.
        </p>
        <p style={{ color:"#9CA3AF", fontSize:13, margin:"0 0 36px", maxWidth:320, lineHeight:1.6 }}>
          {bookingType === "callback"
            ? "Du wirst so bald wie möglich zurückgerufen."
            : "Der Betrieb wird sich mit einer Bestätigung bei dir melden."}
        </p>

        {/* Summary */}
        <div style={{ width:"100%", maxWidth:420, background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, overflow:"hidden", marginBottom:24, boxShadow:"0 4px 20px rgba(0,0,0,0.04)", textAlign:"left" }}>
          <div style={{ background:"#F0FBF6", borderBottom:"1px solid #D1F5E3", padding:"12px 18px" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#18A66D", textTransform:"uppercase", letterSpacing:.8 }}>Zusammenfassung</span>
          </div>
          {bookingType !== "callback" && date && <DRow label="Wunschtermin" value={formatDT(date, time)} />}
          {bookingType === "callback" && <DRow label="Art" value="Rückruf" />}
          {selectedService && <DRow label="Leistung" value={selectedService.name} />}
          {requestText && <DRow label="Anliegen" value={requestText} />}
          <DRow label="Name"    value={name} />
          <DRow label="Telefon" value={phone} last />
        </div>

        <p style={{ fontSize:13, color:"#9CA3AF", marginBottom:32 }}>Du kannst dieses Fenster jetzt schließen.</p>

        <PoweredBy />
      </div>
    </Shell>
  )

  /* ── Main ── */
  const showBack = step !== "type"
  const stepLabel: Record<Step, string> = {
    type: "", service: "Leistung wählen", datetime: "Datum & Uhrzeit",
    contact: "Kontakt", confirm: "Bestätigung", done: "",
  }

  return (
    <Shell css={css}>

      {/* ══ HERO HEADER ══ */}
      <div style={{ background:"linear-gradient(160deg, #0F1923 0%, #1a2e20 50%, #0F1923 100%)", padding:"env(safe-area-inset-top,0) 0 0", position:"relative", overflow:"hidden" }}>

        {/* Subtle background orbs */}
        <div style={{ position:"absolute", top:-60, right:-60, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(24,166,109,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(24,166,109,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:540, margin:"0 auto", padding:"22px 20px 24px", position:"relative" }}>

          {/* Top row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            {showBack ? (
              <button className="back-btn" onClick={goBack} style={{ color:"rgba(255,255,255,0.6)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Zurück
              </button>
            ) : <div />}
            <div style={{ display:"flex", alignItems:"center", gap:7, opacity:.7 }}>
              <div style={{ width:20, height:20, background:"#18A66D", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontSize:9, fontWeight:900 }}>T</span>
              </div>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600, letterSpacing:.3 }}>TerminStop</span>
            </div>
          </div>

          {/* Company info */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:58, height:58, background:"linear-gradient(135deg, #18A66D, #15955F)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:"#fff", flexShrink:0, boxShadow:"0 6px 20px rgba(24,166,109,0.4)", letterSpacing:"-1px" }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Online-Buchung</div>
              <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", margin:0, letterSpacing:"-.5px", lineHeight:1.15 }}>{company?.name}</h1>
              {company?.booking_note && (
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:"6px 0 0", lineHeight:1.5 }}>{company.booking_note}</p>
              )}
            </div>
          </div>

          {/* Progress */}
          {showBack && (
            <div style={{ marginTop:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{stepLabel[step]}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{progressPct()}%</span>
              </div>
              <div style={{ height:3, background:"rgba(255,255,255,0.1)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"#18A66D", borderRadius:4, width:`${progressPct()}%`, transition:"width .4s ease", boxShadow:"0 0 8px rgba(24,166,109,0.6)" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ flex:1, maxWidth:540, margin:"0 auto", width:"100%", padding:"24px 16px 48px" }}>

        {/* ── STEP: type ── */}
        {step === "type" && (
          <div className="step-enter">
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Wie kann ich dir helfen?</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0, lineHeight:1.6 }}>Wähle, wie du einen Termin vereinbaren möchtest.</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {services.length > 0 && (
                <button className="card-hover"
                  onClick={() => { setBookingType("service"); setSelectedService(null); setStep("service") }}
                  style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, padding:"20px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:16, width:"100%", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ width:52, height:52, background:"linear-gradient(135deg, #F0FBF6, #D1F5E3)", border:"1.5px solid #D1F5E3", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>✂️</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:800, color:"#111827", margin:"0 0 4px", fontSize:15 }}>Leistung buchen</p>
                    <p style={{ color:"#9CA3AF", margin:0, fontSize:13 }}>{services.length} Leistung{services.length > 1 ? "en" : ""} verfügbar</p>
                  </div>
                  <div style={{ width:32, height:32, background:"#F9FAFB", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </button>
              )}

              <button className="card-hover"
                onClick={() => { setBookingType("open"); setStep("datetime") }}
                style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, padding:"20px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:16, width:"100%", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width:52, height:52, background:"linear-gradient(135deg, #EEF2FF, #C7D2FE)", border:"1.5px solid #C7D2FE", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🗓️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:800, color:"#111827", margin:"0 0 4px", fontSize:15 }}>Termin anfragen</p>
                  <p style={{ color:"#9CA3AF", margin:0, fontSize:13 }}>Wunschtermin wählen & anfragen</p>
                </div>
                <div style={{ width:32, height:32, background:"#F9FAFB", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>

              <button className="card-hover"
                onClick={() => { setBookingType("callback"); setStep("contact") }}
                style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, padding:"20px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:16, width:"100%", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width:52, height:52, background:"linear-gradient(135deg, #FFF7ED, #FED7AA)", border:"1.5px solid #FED7AA", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>📞</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:800, color:"#111827", margin:"0 0 4px", fontSize:15 }}>Rückruf anfragen</p>
                  <p style={{ color:"#9CA3AF", margin:0, fontSize:13 }}>Ich werde so schnell wie möglich zurückgerufen</p>
                </div>
                <div style={{ width:32, height:32, background:"#F9FAFB", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop:28, display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
              {[["🔒", "Sicher & verschlüsselt"], ["⚡", "In 2 Min. gebucht"], ["✓", "Kostenlos anfragen"]].map(([icon, label]) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:13 }}>{icon}</span>
                  <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: service ── */}
        {step === "service" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Leistung auswählen</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0 }}>Was soll für dich gemacht werden?</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {services.map(svc => (
                <button key={svc.id} className="svc-hover"
                  onClick={() => { setSelectedService(svc); goNext() }}
                  style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:16, padding:"16px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14, width:"100%", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ width:44, height:44, background:"linear-gradient(135deg, #F0FBF6, #D1F5E3)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#18A66D", flexShrink:0, letterSpacing:"-1px" }}>
                    {svc.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, color:"#111827", margin:"0 0 4px", fontSize:15, lineHeight:1.3 }}>{svc.name}</p>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:12, color:"#9CA3AF", background:"#F3F4F6", padding:"2px 8px", borderRadius:6, fontWeight:600 }}>{formatDur(svc.duration)}</span>
                      {svc.price != null && (
                        <span style={{ fontSize:12, color:"#18A66D", background:"#F0FBF6", padding:"2px 8px", borderRadius:6, fontWeight:700 }}>{formatPrice(svc.price)}</span>
                      )}
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            {/* Free-text option */}
            <div style={{ background:"#F9FAFB", border:"1.5px solid #E5E7EB", borderRadius:16, padding:"18px" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#374151", margin:"0 0 10px" }}>Oder kurz beschreiben:</p>
              <LimitedTextarea value={requestText} onChange={setRequestText}
                placeholder="z.B. Farbbehandlung, Beratung …" rows={2} />
              {requestText.trim() && (
                <div style={{ marginTop:10 }}>
                  <button className="primary-btn" onClick={() => { setSelectedService(null); goNext() }}>
                    Weiter mit dieser Beschreibung →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP: datetime ── */}
        {step === "datetime" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Wann passt es dir?</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0 }}>Wähle deinen Wunschtermin.</p>
            </div>

            {selectedService && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#F0FBF6", border:"1.5px solid #D1F5E3", borderRadius:12, padding:"8px 16px", marginBottom:22 }}>
                <div style={{ width:8, height:8, background:"#18A66D", borderRadius:"50%" }} />
                <span style={{ fontSize:13, fontWeight:700, color:"#18A66D" }}>{selectedService.name}</span>
                <span style={{ fontSize:13, color:"#9CA3AF" }}>·</span>
                <span style={{ fontSize:13, color:"#6B7280" }}>{formatDur(selectedService.duration)}</span>
              </div>
            )}

            {bookingType === "open" && (
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>
                  Dein Anliegen <span style={{ fontWeight:400, color:"#9CA3AF" }}>(optional)</span>
                </label>
                <LimitedTextarea value={requestText} onChange={setRequestText}
                  placeholder="z.B. Haarschnitt, Inspektion, Beratung …" rows={2} />
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Datum</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className="ts-input" />
              </div>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Uhrzeit</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} step={900} className="ts-input" />
              </div>
            </div>

            <button className="primary-btn" onClick={goNext} disabled={!date || !time}>
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP: contact ── */}
        {step === "contact" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Deine Kontaktdaten</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0, lineHeight:1.6 }}>
                {bookingType === "callback"
                  ? "Hinterlasse deine Nummer — der Betrieb ruft dich zurück."
                  : "Damit der Betrieb deinen Termin bestätigen kann."}
              </p>
            </div>

            {bookingType === "callback" && (
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>
                  Dein Anliegen <span style={{ fontWeight:400, color:"#9CA3AF" }}>(optional)</span>
                </label>
                <LimitedTextarea value={requestText} onChange={setRequestText}
                  placeholder="z.B. Frage zum Preis, Beratung …" rows={2} />
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Vor- und Nachname *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Max Mustermann" className="ts-input" autoComplete="name" />
              </div>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Telefonnummer *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0151 12345678" className="ts-input" autoComplete="tel" />
              </div>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>
                  Anmerkung <span style={{ fontWeight:400, color:"#9CA3AF" }}>(optional)</span>
                </label>
                <LimitedTextarea value={note} onChange={setNote}
                  placeholder="z.B. bitte kurz klingeln …" rows={2} />
              </div>
            </div>

            <button className="primary-btn" onClick={goNext} disabled={!name.trim() || !phone.trim()}>
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP: confirm ── */}
        {step === "confirm" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Alles korrekt?</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0 }}>Bitte überprüfe deine Angaben vor dem Absenden.</p>
            </div>

            {/* Summary card */}
            <div style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, overflow:"hidden", marginBottom:16, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
              <div style={{ background:"linear-gradient(135deg, #F0FBF6, #E8F8F2)", borderBottom:"1px solid #D1F5E3", padding:"14px 20px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, background:"#18A66D", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:"#18A66D" }}>Deine Anfrage</span>
              </div>
              {bookingType !== "callback" && date && <DRow label="Wunschtermin" value={formatDT(date, time)} />}
              {bookingType === "callback" && <DRow label="Art" value="Rückruf" />}
              {selectedService && <DRow label="Leistung" value={`${selectedService.name} · ${formatDur(selectedService.duration)}`} />}
              {selectedService?.price != null && <DRow label="Preis" value={formatPrice(selectedService.price) || ""} />}
              {requestText && <DRow label="Anliegen" value={requestText} />}
              <DRow label="Name"    value={name} />
              <DRow label="Telefon" value={phone} last={!note} />
              {note && <DRow label="Anmerkung" value={note} last />}
            </div>

            {/* Info */}
            <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:14, padding:"14px 18px", marginBottom:20, display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:18, flexShrink:0, lineHeight:1 }}>ℹ️</span>
              <p style={{ fontSize:13, color:"#92400E", lineHeight:1.65, margin:0 }}>
                {bookingType === "callback"
                  ? `${company?.name} ruft dich so bald wie möglich zurück.`
                  : `Dies ist eine Anfrage. ${company?.name} bestätigt deinen Termin und meldet sich bei dir.`}
              </p>
            </div>

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:14, padding:"14px 18px", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span>⚠️</span>
                <p style={{ fontSize:13, color:"#DC2626", lineHeight:1.6, margin:0 }}>{error}</p>
              </div>
            )}

            <button className="primary-btn" onClick={submitBooking} disabled={submitting}>
              {submitting
                ? <><Spin /><span>Wird gesendet …</span></>
                : bookingType === "callback" ? "Rückruf anfragen →" : "Anfrage jetzt absenden →"}
            </button>

            <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", marginTop:14, lineHeight:1.6 }}>
              🔒 Deine Daten werden sicher übertragen und nur für diese Anfrage verwendet.
            </p>
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ borderTop:"1px solid #F3F4F6", padding:"16px 20px", background:"#fff", textAlign:"center" }}>
        <PoweredBy />
      </div>
    </Shell>
  )
}

/* ── Shell ─────────────────────────────────────────────────────── */
function Shell({ children, css }: { children: React.ReactNode; css?: string }) {
  return (
    <div style={{ minHeight:"100dvh", background:"#F9FAFB", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif", display:"flex", flexDirection:"column" }}>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {children}
    </div>
  )
}

/* ── Powered By ─────────────────────────────────────────────────── */
function PoweredBy() {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:7 }}>
      <div style={{ width:20, height:20, background:"linear-gradient(135deg, #18A66D, #15955F)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:9, fontWeight:900 }}>T</span>
      </div>
      <span style={{ fontSize:12, color:"#9CA3AF" }}>Powered by <strong style={{ color:"#18A66D" }}>TerminStop</strong></span>
    </div>
  )
}

/* ── Spinner ───────────────────────────────────────────────────── */
function Spin() {
  return <div style={{ width:16, height:16, border:"2.5px solid rgba(255,255,255,0.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />
}

/* ── Limited Textarea ──────────────────────────────────────────── */
const MAX = 160
function LimitedTextarea({ value, onChange, placeholder, rows = 2 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  const left = MAX - value.length
  const warn = left <= 20
  return (
    <div style={{ position:"relative" }}>
      <textarea value={value} onChange={e => onChange(e.target.value.slice(0, MAX))}
        placeholder={placeholder} rows={rows} maxLength={MAX}
        className="ts-input" style={{ paddingBottom:28 }} />
      <span style={{ position:"absolute", bottom:10, right:12, fontSize:11, fontWeight:600, color: warn ? (left <= 0 ? "#DC2626" : "#F59E0B") : "#9CA3AF", pointerEvents:"none" }}>
        {left} Zeichen übrig
      </span>
    </div>
  )
}

/* ── Detail Row ────────────────────────────────────────────────── */
function DRow({ label, value, last }: { label:string; value:string; last?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"13px 20px", borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
      <span style={{ fontSize:13, color:"#9CA3AF", flexShrink:0, fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:13, color:"#111827", fontWeight:700, textAlign:"right", wordBreak:"break-word" }}>{value}</span>
    </div>
  )
}
