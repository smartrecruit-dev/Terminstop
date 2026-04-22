"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

type Service     = { id: string; name: string; duration: number; price: number | null }
type Employee    = { id: string; name: string }
type Company     = { id: string; name: string; booking_note: string | null }
type BookingType = "service" | "open" | "callback"
type Step        = "type" | "employee" | "datetime" | "service" | "contact" | "confirm" | "done"
type Avail       = "idle" | "checking" | "available" | "full"

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

// Step order: employee (if any) → date+time → service
// "employee" step is auto-skipped when no employees are configured
const STEP_ORDER: Record<BookingType, Step[]> = {
  service:  ["type", "employee", "datetime", "service", "contact", "confirm"],
  open:     ["type", "employee", "datetime", "contact", "confirm"],
  callback: ["type", "contact", "confirm"],
}

export default function BookingPage() {
  const params = useParams()
  const slug   = params?.slug as string

  const [company,           setCompany]          = useState<Company | null>(null)
  const [services,          setServices]         = useState<Service[]>([])
  const [employees,         setEmployees]        = useState<Employee[]>([])
  const [loading,           setLoading]          = useState(true)
  const [notFound,          setNotFound]         = useState(false)

  const [step,              setStep]             = useState<Step>("type")
  const [bookingType,       setBookingType]      = useState<BookingType>("service")
  const [selectedService,   setSelectedService]  = useState<Service | null>(null)
  const [selectedEmployee,  setSelectedEmployee] = useState<Employee | null>(null)
  const [requestText,       setRequestText]      = useState("")
  const [date,              setDate]             = useState("")
  const [time,              setTime]             = useState("")
  const [name,              setName]             = useState("")
  const [phone,             setPhone]            = useState("")
  const [note,              setNote]             = useState("")
  const [submitting,        setSubmitting]       = useState(false)
  const [error,             setError]            = useState("")
  const [avail,             setAvail]            = useState<Avail>("idle")
  const [confirmed,         setConfirmed]        = useState(false)

  useEffect(() => { if (slug) loadCompany() }, [slug])

  async function loadCompany() {
    setLoading(true)
    const { data: co, error: coErr } = await supabase
      .from("companies")
      .select("id, name, booking_note, booking_active, slug")
      .eq("slug", slug).single()
    if (coErr || !co || co.booking_active === false) {
      setNotFound(true); setLoading(false); return
    }
    setCompany({ id: co.id, name: co.name, booking_note: co.booking_note })
    const [{ data: svcs }, { data: emps }] = await Promise.all([
      supabase.from("services").select("id, name, duration, price")
        .eq("company_id", co.id).eq("active", true).order("name"),
      supabase.from("employees").select("id, name")
        .eq("company_id", co.id).eq("active", true).order("created_at", { ascending: true }),
    ])
    setServices(svcs || [])
    setEmployees(emps || [])
    setLoading(false)
  }

  // Check availability — pass employee_id if one is selected
  const checkAvailability = useCallback(async (d: string, t: string, empId?: string | null) => {
    if (!company || !d || !t) { setAvail("idle"); return }
    setAvail("checking")
    try {
      const eid = empId !== undefined ? empId : selectedEmployee?.id
      const params = new URLSearchParams({ company_id: company.id, date: d, time: t })
      if (eid) params.set("employee_id", eid)
      const res  = await fetch(`/api/availability?${params}`)
      const json = await res.json()
      setAvail(json.available ? "available" : "full")
    } catch {
      setAvail("idle")
    }
  }, [company, selectedEmployee])

  // Skip "employee" step if no employees are configured
  function nextStep(current: Step, type: BookingType): Step {
    const steps = STEP_ORDER[type]
    let idx = steps.indexOf(current) + 1
    while (idx < steps.length) {
      const s = steps[idx]
      if (s === "employee" && employees.length === 0) { idx++; continue }
      return s
    }
    return current
  }
  function prevStep(current: Step, type: BookingType): Step {
    const steps = STEP_ORDER[type]
    let idx = steps.indexOf(current) - 1
    while (idx >= 0) {
      const s = steps[idx]
      if (s === "employee" && employees.length === 0) { idx--; continue }
      return s
    }
    return "type"
  }

  function goNext() { setStep(s => nextStep(s, bookingType)) }
  function goBack() { setStep(s => prevStep(s, bookingType)) }

  function progressPct() {
    const steps = STEP_ORDER[bookingType].filter(s => s !== "type")
    const idx   = (steps as Step[]).indexOf(step)
    return idx < 0 ? 0 : Math.round(((idx + 1) / steps.length) * 100)
  }

  async function submitBooking() {
    if (!company) return
    setSubmitting(true); setError("")

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id:   company.id,
        name:         name.trim(),
        phone:        phone.trim(),
        date:         bookingType === "callback" ? null : date || null,
        time:         bookingType === "callback" ? null : time || null,
        service_name: selectedService?.name || null,
        note:         note.trim() || null,
        request_text: requestText.trim() || null,
        booking_type: bookingType,
        employee_id:  selectedEmployee?.id || null,
      }),
    })
    const json = await res.json()

    if (!res.ok || json.error) {
      setError(json.error || "Etwas ist schiefgelaufen.")
      setSubmitting(false); return
    }

    setConfirmed(json.confirmed === true)
    setStep("done")
    setSubmitting(false)
  }

  const today    = new Date().toISOString().split("T")[0]
  const initials = company?.name
    ? company.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  /* ── CSS ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; background: #0A0F0D; }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes popIn     { 0% { opacity:0; transform:scale(.7); } 60% { transform:scale(1.06); } 100% { opacity:1; transform:scale(1); } }
    @keyframes shimmer   { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes checkDraw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
    @keyframes pulse     { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.04); } }
    .step-enter { animation: fadeUp .38s cubic-bezier(.16,1,.3,1) both; }
    .card-hover { transition: all .22s cubic-bezier(.16,1,.3,1); }
    .card-hover:hover { border-color: #18A66D !important; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(24,166,109,0.18) !important; }
    .card-hover:active { transform: translateY(0) scale(.99); }
    .svc-hover { transition: all .18s ease; }
    .svc-hover:hover { border-color: #18A66D !important; background: #F0FBF6 !important; box-shadow: 0 6px 20px rgba(24,166,109,0.1) !important; }
    input[type="date"]::-webkit-calendar-picker-indicator { opacity: .5; cursor: pointer; }
    input:focus, textarea:focus { border-color: #18A66D !important; box-shadow: 0 0 0 4px rgba(24,166,109,0.12) !important; outline: none !important; }
    /* font-size 16px prevents iOS auto-zoom on focus */
    .ts-input { width:100%; padding:16px 18px; border:1.5px solid #E5E7EB; border-radius:14px; font-size:16px; color:#111827; background:#fff; font-family:inherit; transition:border-color .15s, box-shadow .15s; -webkit-appearance:none; appearance:none; }
    .ts-input::placeholder { color: #C4C9D4; }
    textarea.ts-input { resize:none; line-height:1.6; }
    input[type="date"].ts-input, input[type="time"].ts-input { cursor:pointer; }
    @media (max-width: 390px) {
      .ts-input { font-size:16px; padding:14px 16px; }
      .primary-btn { font-size:14px; padding:15px; }
      .type-card { padding:18px; gap:14px; }
    }
    .primary-btn { width:100%; padding:17px; background:linear-gradient(135deg,#18A66D,#15955F); color:#fff; border:none; border-radius:15px; font-size:15px; font-weight:800; cursor:pointer; letter-spacing:.2px; box-shadow:0 8px 28px rgba(24,166,109,0.35); transition:all .22s; display:flex; align-items:center; justify-content:center; gap:8px; }
    .primary-btn:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(24,166,109,0.45); }
    .primary-btn:active { transform:translateY(0); }
    .primary-btn:disabled { background:linear-gradient(135deg,#D1D5DB,#9CA3AF); cursor:not-allowed; box-shadow:none; transform:none; }
    .back-btn { display:flex; align-items:center; gap:6px; background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.55); font-size:14px; font-weight:600; padding:8px 0; transition:color .15s; }
    .back-btn:hover { color:rgba(255,255,255,0.9); }
    .skeleton { background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 400px 100%; animation: shimmer 1.4s ease infinite; border-radius: 10px; }
    .type-card { background:#fff; border:1.5px solid #F0F0F0; border-radius:20px; padding:22px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:18px; width:100%; box-shadow:0 2px 16px rgba(0,0,0,0.05); transition:all .22s cubic-bezier(.16,1,.3,1); }
    .type-card:hover { border-color:#18A66D; transform:translateY(-3px); box-shadow:0 12px 40px rgba(24,166,109,0.15); }
    .type-card:active { transform:translateY(0) scale(.99); }
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
          {bookingType === "callback"
            ? "Rückruf angefragt!"
            : confirmed
              ? "Termin bestätigt! ✓"
              : "Anfrage gesendet!"}
        </h2>
        <p style={{ color:"#6B7280", lineHeight:1.7, fontSize:15, margin:"0 0 8px", maxWidth:360 }}>
          {confirmed
            ? <>Dein Termin bei <strong style={{ color:"#111827" }}>{company?.name}</strong> ist fest gebucht.</>
            : <>Deine Anfrage bei <strong style={{ color:"#111827" }}>{company?.name}</strong> ist eingegangen.</>
          }
        </p>
        <p style={{ color:"#9CA3AF", fontSize:13, margin:"0 0 36px", maxWidth:320, lineHeight:1.6 }}>
          {confirmed
            ? "Du hast soeben eine SMS-Bestätigung erhalten. Wir freuen uns auf deinen Besuch!"
            : bookingType === "callback"
              ? "Du wirst so bald wie möglich zurückgerufen."
              : "Der Betrieb meldet sich kurz bei dir zur Bestätigung."}
        </p>

        {/* Summary */}
        <div style={{ width:"100%", maxWidth:420, background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:18, overflow:"hidden", marginBottom:24, boxShadow:"0 4px 20px rgba(0,0,0,0.04)", textAlign:"left" }}>
          <div style={{ background: confirmed ? "#F0FBF6" : "#FFFBEB", borderBottom:`1px solid ${confirmed ? "#D1F5E3" : "#FDE68A"}`, padding:"12px 18px" }}>
            <span style={{ fontSize:12, fontWeight:700, color: confirmed ? "#18A66D" : "#92400E", textTransform:"uppercase", letterSpacing:.8 }}>
              {confirmed ? "✓ Automatisch bestätigt" : "⏳ Anfrage eingegangen"}
            </span>
          </div>
          {bookingType !== "callback" && date && <DRow label="Termin"      value={formatDT(date, time)} />}
          {bookingType === "callback"           && <DRow label="Art"        value="Rückruf" />}
          {selectedEmployee                     && <DRow label="Mitarbeiter" value={selectedEmployee.name} />}
          {selectedService                      && <DRow label="Leistung"   value={selectedService.name} />}
          {requestText                          && <DRow label="Anliegen"   value={requestText} />}
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
    type: "", employee: "Mitarbeiter wählen", service: "Leistung wählen",
    datetime: "Datum & Uhrzeit", contact: "Kontakt", confirm: "Bestätigung", done: "",
  }

  return (
    <Shell css={css}>

      {/* ══ HERO HEADER ══ */}
      <div style={{ background:"linear-gradient(170deg, #0A0F0D 0%, #0D1F15 40%, #0F2318 100%)", padding:"env(safe-area-inset-top,0) 0 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle, rgba(24,166,109,0.22) 0%, transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(24,166,109,0.12) 0%, transparent 65%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 22px 28px", position:"relative" }}>

          {/* Top row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
            {showBack ? (
              <button className="back-btn" onClick={goBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Zurück
              </button>
            ) : <div />}
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.07)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 12px 5px 6px" }}>
              <div style={{ width:22, height:22, background:"linear-gradient(135deg,#18A66D,#0F8F63)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>T</span>
              </div>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:700, letterSpacing:.4 }}>TerminStop</span>
            </div>
          </div>

          {/* Company info */}
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ width:66, height:66, background:"linear-gradient(135deg, #18A66D, #0F8F63)", borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff", flexShrink:0, boxShadow:"0 8px 32px rgba(24,166,109,0.5), inset 0 1px 0 rgba(255,255,255,0.2)", letterSpacing:"-1px" }}>
              {initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:800, color:"rgba(24,166,109,0.8)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>Online-Buchung</div>
              <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", margin:0, letterSpacing:"-.6px", lineHeight:1.1 }}>{company?.name}</h1>
              {company?.booking_note && (
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"8px 0 0", lineHeight:1.55, fontWeight:500 }}>{company.booking_note}</p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {showBack && (
            <div style={{ marginTop:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{stepLabel[step]}</span>
                <span style={{ fontSize:11, color:"rgba(24,166,109,0.9)", fontWeight:800 }}>{progressPct()}%</span>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"linear-gradient(90deg, #18A66D, #22C97E)", borderRadius:4, width:`${progressPct()}%`, transition:"width .5s cubic-bezier(.16,1,.3,1)", boxShadow:"0 0 12px rgba(24,166,109,0.7)" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ flex:1, maxWidth:560, margin:"0 auto", width:"100%", padding:"28px 18px 60px" }}>

        {/* ── STEP: type ── */}
        {step === "type" && (
          <div className="step-enter">
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:23, fontWeight:900, color:"#111827", margin:"0 0 8px", letterSpacing:"-.5px" }}>Wie kann ich helfen?</h2>
              <p style={{ color:"#9CA3AF", fontSize:14, margin:0, lineHeight:1.65, fontWeight:500 }}>Wähle, wie du einen Termin vereinbaren möchtest.</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {services.length > 0 && (
                <button className="type-card"
                  onClick={() => { setBookingType("service"); setSelectedService(null); setStep("datetime") }}>
                  <div style={{ width:56, height:56, background:"linear-gradient(135deg, #18A66D, #0F8F63)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:"0 6px 20px rgba(24,166,109,0.35)" }}>✂️</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:800, color:"#111827", margin:"0 0 5px", fontSize:16 }}>Leistung buchen</p>
                    <p style={{ color:"#9CA3AF", margin:0, fontSize:13, fontWeight:500 }}>{services.length} Leistung{services.length > 1 ? "en" : ""} verfügbar · Datum zuerst wählen</p>
                  </div>
                  <div style={{ width:36, height:36, background:"#F0FBF6", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18A66D" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </button>
              )}

              <button className="type-card"
                onClick={() => { setBookingType("open"); setStep("datetime") }}>
                <div style={{ width:56, height:56, background:"linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:"0 6px 20px rgba(79,70,229,0.35)" }}>🗓️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:800, color:"#111827", margin:"0 0 5px", fontSize:16 }}>Termin anfragen</p>
                  <p style={{ color:"#9CA3AF", margin:0, fontSize:13, fontWeight:500 }}>Wunschtermin wählen & anfragen</p>
                </div>
                <div style={{ width:36, height:36, background:"#EEF2FF", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>

              <button className="type-card"
                onClick={() => { setBookingType("callback"); setStep("contact") }}>
                <div style={{ width:56, height:56, background:"linear-gradient(135deg, #F59E0B, #D97706)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:"0 6px 20px rgba(245,158,11,0.35)" }}>📞</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:800, color:"#111827", margin:"0 0 5px", fontSize:16 }}>Rückruf anfragen</p>
                  <p style={{ color:"#9CA3AF", margin:0, fontSize:13, fontWeight:500 }}>Nummer hinterlassen · ich rufe zurück</p>
                </div>
                <div style={{ width:36, height:36, background:"#FFFBEB", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>
            </div>

            {/* Trust bar */}
            <div style={{ marginTop:32, background:"#fff", border:"1.5px solid #F0F0F0", borderRadius:16, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-around", gap:12 }}>
                {[
                  { icon:"🔒", label:"Datenschutz",   sub:"DSGVO-konform" },
                  { icon:"⚡", label:"Schnell",        sub:"In 2 Minuten fertig" },
                  { icon:"✉️", label:"Kostenlos",      sub:"Keine Kosten für dich" },
                ].map(t => (
                  <div key={t.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{t.icon}</div>
                    <div style={{ fontSize:11, fontWeight:800, color:"#374151" }}>{t.label}</div>
                    <div style={{ fontSize:10, color:"#9CA3AF", fontWeight:500, marginTop:1 }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: employee ── */}
        {step === "employee" && employees.length > 0 && (
          <div className="step-enter">
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Bei wem möchtest du buchen?</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0, lineHeight:1.6 }}>Wähle einen Mitarbeiter oder buche bei dem nächsten Verfügbaren.</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {employees.map(emp => (
                <button key={emp.id} className="type-card"
                  onClick={() => { setSelectedEmployee(emp); goNext() }}
                  style={{ background:"#fff", border:`1.5px solid ${selectedEmployee?.id === emp.id ? "#18A66D" : "#F0F0F0"}` }}>
                  <div style={{ width:52, height:52, background:"linear-gradient(135deg, #18A66D, #0F8F63)", borderRadius:17, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:"#fff", flexShrink:0, letterSpacing:"-1px", boxShadow:"0 6px 18px rgba(24,166,109,0.3)" }}>
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0, textAlign:"left" }}>
                    <p style={{ fontWeight:800, color:"#111827", margin:"0 0 4px", fontSize:16 }}>{emp.name}</p>
                    <p style={{ color:"#9CA3AF", margin:0, fontSize:13, fontWeight:500 }}>Verfügbarkeit wird geprüft nach Datumswahl</p>
                  </div>
                  <div style={{ width:36, height:36, background:"#F0FBF6", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18A66D" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </button>
              ))}

              {/* Option: beliebiger Mitarbeiter */}
              <button className="type-card"
                onClick={() => { setSelectedEmployee(null); goNext() }}
                style={{ background: selectedEmployee === null ? "#F0FBF6" : "#fff", border:`1.5px solid ${selectedEmployee === null ? "#18A66D" : "#E5E7EB"}`, opacity:.85 }}>
                <div style={{ width:52, height:52, background:"linear-gradient(135deg, #6B7280, #374151)", borderRadius:17, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, boxShadow:"0 6px 18px rgba(0,0,0,0.15)" }}>
                  👥
                </div>
                <div style={{ flex:1, minWidth:0, textAlign:"left" }}>
                  <p style={{ fontWeight:800, color:"#111827", margin:"0 0 4px", fontSize:16 }}>Egal — nächster Verfügbarer</p>
                  <p style={{ color:"#9CA3AF", margin:0, fontSize:13, fontWeight:500 }}>Automatisch dem freien Mitarbeiter zugeteilt</p>
                </div>
                <div style={{ width:36, height:36, background:"#F3F4F6", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: datetime (NOW FIRST) ── */}
        {step === "datetime" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Wann passt es dir?</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0 }}>Wähle Datum und Uhrzeit für deinen Termin.</p>
            </div>

            {/* Zeige gewählten Mitarbeiter als Info-Badge */}
            {selectedEmployee && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#F0FBF6", border:"1.5px solid #D1F5E3", borderRadius:12, padding:"8px 14px", marginBottom:18 }}>
                <div style={{ width:26, height:26, background:"#18A66D", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", flexShrink:0 }}>
                  {selectedEmployee.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"#18A66D" }}>{selectedEmployee.name}</span>
                <button onClick={() => { setSelectedEmployee(null); setAvail("idle") }}
                  style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:16, padding:"0 0 0 4px", lineHeight:1 }}>✕</button>
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

            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:20 }}>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Datum</label>
                <input type="date" value={date} min={today}
                  onChange={e => {
                    setDate(e.target.value)
                    setAvail("idle")
                    if (e.target.value && time) checkAvailability(e.target.value, time, selectedEmployee?.id)
                  }}
                  className="ts-input" />
              </div>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 }}>Uhrzeit</label>
                <input type="time" value={time}
                  onChange={e => {
                    setTime(e.target.value)
                    setAvail("idle")
                    if (date && e.target.value) checkAvailability(date, e.target.value, selectedEmployee?.id)
                  }}
                  step={900} className="ts-input" />
              </div>
            </div>

            {/* Availability indicator */}
            {avail === "checking" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
                <Spin small /> <span style={{ fontSize:13, color:"#6B7280" }}>Verfügbarkeit wird geprüft …</span>
              </div>
            )}
            {avail === "available" && (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"#F0FBF6", border:"1px solid #D1F5E3", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
                <div style={{ width:28, height:28, background:"#18A66D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#18A66D" }}>Zeitfenster verfügbar</div>
                  <div style={{ fontSize:12, color:"#15955F" }}>Dein Termin wird nach dem Absenden sofort bestätigt</div>
                </div>
              </div>
            )}
            {avail === "full" && (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
                <div style={{ width:28, height:28, background:"#F59E0B", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>⏳</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#92400E" }}>Alle Mitarbeiter belegt</div>
                  <div style={{ fontSize:12, color:"#B45309" }}>Deine Anfrage wird weitergeleitet — der Betrieb meldet sich bei dir</div>
                </div>
              </div>
            )}

            <button className="primary-btn" onClick={goNext} disabled={!date || !time}>
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP: service (AFTER DATETIME) ── */}
        {step === "service" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Leistung auswählen</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0 }}>Was soll für dich gemacht werden?</p>
            </div>

            {/* Selected date/time reminder */}
            {date && time && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#F0FBF6", border:"1.5px solid #D1F5E3", borderRadius:12, padding:"8px 16px", marginBottom:22 }}>
                <span style={{ fontSize:14 }}>📅</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#18A66D" }}>{formatDT(date, time)}</span>
                {avail === "available" && (
                  <span style={{ fontSize:11, fontWeight:700, color:"#15955F", background:"#D1F5E3", borderRadius:99, padding:"2px 8px" }}>✓ frei</span>
                )}
              </div>
            )}

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

        {/* ── STEP: contact ── */}
        {step === "contact" && (
          <div className="step-enter">
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-.4px" }}>Deine Kontaktdaten</h2>
              <p style={{ color:"#6B7280", fontSize:14, margin:0, lineHeight:1.6 }}>
                {bookingType === "callback"
                  ? "Hinterlasse deine Nummer — der Betrieb ruft dich zurück."
                  : "Damit wir deinen Termin bestätigen können."}
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
                <span style={{ fontSize:13, fontWeight:800, color:"#18A66D" }}>Deine Buchung</span>
              </div>
              {bookingType !== "callback" && date && <DRow label="Termin"      value={formatDT(date, time)} />}
              {bookingType === "callback"           && <DRow label="Art"        value="Rückruf" />}
              {selectedEmployee                     && <DRow label="Mitarbeiter" value={selectedEmployee.name} />}
              {selectedService                      && <DRow label="Leistung"   value={`${selectedService.name} · ${formatDur(selectedService.duration)}`} />}
              {selectedService?.price != null       && <DRow label="Preis"      value={formatPrice(selectedService.price) || ""} />}
              {requestText                          && <DRow label="Anliegen"   value={requestText} />}
              <DRow label="Name"    value={name} />
              <DRow label="Telefon" value={phone} last={!note} />
              {note && <DRow label="Anmerkung" value={note} last />}
            </div>

            {/* Availability info banner */}
            {bookingType !== "callback" && (
              <div style={{
                background: avail === "available" ? "#F0FBF6" : "#FFFBEB",
                border:     `1px solid ${avail === "available" ? "#D1F5E3" : "#FDE68A"}`,
                borderRadius:14, padding:"14px 18px", marginBottom:20,
                display:"flex", gap:12, alignItems:"flex-start",
              }}>
                <span style={{ fontSize:18, flexShrink:0, lineHeight:1 }}>
                  {avail === "available" ? "✅" : "⏳"}
                </span>
                <p style={{ fontSize:13, color: avail === "available" ? "#166534" : "#92400E", lineHeight:1.65, margin:0 }}>
                  {avail === "available"
                    ? "Super! Dieser Termin ist frei — deine Buchung wird nach dem Absenden sofort bestätigt und du bekommst eine SMS."
                    : avail === "full"
                      ? `Zu diesem Zeitpunkt sind alle Mitarbeiter belegt. ${company?.name} prüft deinen Wunschtermin und meldet sich bei dir.`
                      : `${company?.name} wird deinen Termin prüfen und sich kurz bei dir melden.`
                  }
                </p>
              </div>
            )}

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:14, padding:"14px 18px", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span>⚠️</span>
                <p style={{ fontSize:13, color:"#DC2626", lineHeight:1.6, margin:0 }}>{error}</p>
              </div>
            )}

            <button className="primary-btn" onClick={submitBooking} disabled={submitting}>
              {submitting
                ? <><Spin /><span>Wird gesendet …</span></>
                : bookingType === "callback"
                  ? "Rückruf anfragen →"
                  : avail === "available"
                    ? "Termin jetzt buchen →"
                    : "Anfrage absenden →"}
            </button>

            <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", marginTop:14, lineHeight:1.6 }}>
              🔒 Deine Daten werden sicher übertragen und nur für diese Buchung verwendet.
            </p>
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ borderTop:"1px solid #EAECEF", padding:"18px 20px", background:"#fff", textAlign:"center" }}>
        <PoweredBy />
      </div>
    </Shell>
  )
}

/* ── Shell ── */
function Shell({ children, css }: { children: React.ReactNode; css?: string }) {
  return (
    <div style={{ minHeight:"100dvh", background:"#F4F6F8", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif", display:"flex", flexDirection:"column", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {children}
    </div>
  )
}

function PoweredBy() {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#F9FAFB", border:"1px solid #EAECEF", borderRadius:20, padding:"6px 14px 6px 8px" }}>
      <div style={{ width:22, height:22, background:"linear-gradient(135deg, #18A66D, #0F8F63)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>T</span>
      </div>
      <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:500 }}>Powered by <strong style={{ color:"#18A66D", fontWeight:800 }}>TerminStop</strong></span>
    </div>
  )
}

function Spin({ small }: { small?: boolean }) {
  const s = small ? 14 : 16
  return <div style={{ width:s, height:s, border:`2.5px solid ${small ? "rgba(100,100,100,0.3)" : "rgba(255,255,255,0.35)"}`, borderTopColor: small ? "#6B7280" : "#fff", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />
}

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

function DRow({ label, value, last }: { label:string; value:string; last?:boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"13px 20px", borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
      <span style={{ fontSize:13, color:"#9CA3AF", flexShrink:0, fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:13, color:"#111827", fontWeight:700, textAlign:"right", wordBreak:"break-word" }}>{value}</span>
    </div>
  )
}
