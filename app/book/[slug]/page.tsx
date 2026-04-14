"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

type Service = { id: string; name: string; duration: number; price: number | null }
type Company = { id: string; name: string; booking_note: string | null }
type Step = "service" | "datetime" | "contact" | "confirm" | "done"

function formatDur(m: number) {
  if (m < 60) return `${m} Min.`
  const h = Math.floor(m / 60), r = m % 60
  return r === 0 ? `${h} Std.` : `${h} Std. ${r} Min.`
}

function formatPrice(p: number | null) {
  if (p == null) return null
  return p.toFixed(2).replace(".", ",") + " €"
}

function formatDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toLocaleString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }) + " Uhr"
}

const STEP_LABELS = ["Leistung", "Termin", "Kontakt", "Bestätigung"]

export default function BookingPage() {
  const params  = useParams()
  const slug    = params?.slug as string

  const [company,  setCompany]  = useState<Company | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [step,            setStep]            = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date,            setDate]            = useState("")
  const [time,            setTime]            = useState("")
  const [name,            setName]            = useState("")
  const [phone,           setPhone]           = useState("")
  const [note,            setNote]            = useState("")
  const [submitting,      setSubmitting]      = useState(false)
  const [error,           setError]           = useState("")

  useEffect(() => {
    if (slug) loadCompany()
  }, [slug])

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
      .eq("company_id", co.id)
      .eq("active", true)
      .order("name")

    setServices(svcs || [])
    setLoading(false)
  }

  async function submitBooking() {
    if (!company || !selectedService) return
    setSubmitting(true); setError("")

    const { error: insertErr } = await supabase
      .from("appointments")
      .insert({
        company_id: company.id,
        name:       `${name.trim()} [Online: ${selectedService.name}]`,
        phone:      phone.trim(),
        note:       note.trim() || null,
        date:       date,
        time:       time,
        status:     "pending",
      })

    if (insertErr) {
      setError(insertErr.message?.includes("RATE_LIMIT")
        ? "Du hast heute bereits 3 Anfragen gesendet. Bitte morgen erneut versuchen oder den Betrieb direkt anrufen."
        : "Etwas ist schiefgelaufen. Bitte versuche es erneut.")
      setSubmitting(false); return
    }
    setStep("done"); setSubmitting(false)
  }

  const today = new Date().toISOString().split("T")[0]
  const stepIndex = ["service","datetime","contact","confirm"].indexOf(step)

  // ── Loading ──────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8FAFF", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:44, height:44, border:"3px solid #E8EEFF", borderTopColor:"#4F6EF7", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 16px" }} />
        <p style={{ color:"#94A3B8", fontSize:14 }}>Wird geladen …</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── Not found ────────────────────────────────────────────────
  if (notFound) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8FAFF", fontFamily:"system-ui,sans-serif", padding:"0 24px" }}>
      <div style={{ textAlign:"center", maxWidth:380 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#1E293B", marginBottom:8 }}>Link nicht gefunden</h1>
        <p style={{ color:"#64748B", lineHeight:1.6, fontSize:15 }}>Dieser Buchungslink ist nicht aktiv. Bitte wende dich direkt an den Betrieb.</p>
      </div>
    </div>
  )

  // ── Done ─────────────────────────────────────────────────────
  if (step === "done") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #F0F4FF 0%, #F8FAFF 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif", padding:"24px 16px" }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"40px 32px", maxWidth:460, width:"100%", boxShadow:"0 20px 60px rgba(79,110,247,0.12)", textAlign:"center" }}>
        <div style={{ width:72, height:72, background:"linear-gradient(135deg, #4F6EF7, #7C3AED)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:32 }}>✓</div>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1E293B", marginBottom:8 }}>Anfrage gesendet!</h2>
        <p style={{ color:"#64748B", marginBottom:28, lineHeight:1.6, fontSize:15 }}>
          Deine Anfrage bei <strong style={{ color:"#1E293B" }}>{company?.name}</strong> ist eingegangen.<br/>
          Du wirst in Kürze kontaktiert.
        </p>
        <div style={{ background:"#F8FAFF", borderRadius:16, padding:"20px", textAlign:"left", border:"1px solid #E8EEFF" }}>
          <SummaryRow label="Leistung" value={selectedService?.name || ""} />
          <SummaryRow label="Dauer"    value={formatDur(selectedService?.duration || 0)} />
          <SummaryRow label="Wunschtermin" value={formatDateTime(date, time)} last />
        </div>
        <p style={{ marginTop:24, fontSize:13, color:"#94A3B8" }}>Du kannst dieses Fenster jetzt schließen.</p>
      </div>
    </div>
  )

  // ── Main flow ────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFF", fontFamily:"system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)", padding:"28px 24px 80px" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, fontWeight:600, letterSpacing:1.2, textTransform:"uppercase", marginBottom:6 }}>
            Online-Buchung
          </p>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:800, margin:0, letterSpacing:-0.5 }}>
            {company?.name}
          </h1>
          {company?.booking_note && (
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, margin:"10px 0 0", lineHeight:1.6 }}>
              {company.booking_note}
            </p>
          )}
        </div>
      </div>

      {/* Card pulled up over header */}
      <div style={{ maxWidth:520, margin:"-52px auto 0", padding:"0 16px 40px" }}>
        <div style={{ background:"#fff", borderRadius:24, boxShadow:"0 20px 60px rgba(79,110,247,0.12)", overflow:"hidden" }}>

          {/* Progress steps */}
          <div style={{ padding:"20px 24px 0" }}>
            <div style={{ display:"flex", gap:6, marginBottom:20 }}>
              {STEP_LABELS.map((label, i) => (
                <div key={i} style={{ flex:1, textAlign:"center" }}>
                  <div style={{
                    height:4, borderRadius:4, marginBottom:6,
                    background: i <= stepIndex ? "linear-gradient(90deg, #4F6EF7, #7C3AED)" : "#EEF2FF",
                    transition:"background 0.4s"
                  }} />
                  <span style={{
                    fontSize:10, fontWeight:600, letterSpacing:0.5,
                    color: i <= stepIndex ? "#4F6EF7" : "#CBD5E1"
                  }}>
                    {label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding:"0 24px 28px" }}>

            {/* ── STEP 1: Service ── */}
            {step === "service" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1E293B", marginBottom:4 }}>Was darf es sein?</h2>
                <p style={{ color:"#64748B", fontSize:14, marginBottom:20 }}>Wähle eine Leistung von {company?.name}.</p>
                {services.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"32px 0", color:"#94A3B8" }}>
                    Aktuell sind keine Leistungen verfügbar.
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {services.map(svc => (
                      <button key={svc.id} onClick={() => { setSelectedService(svc); setStep("datetime") }}
                        style={{
                          background:"#F8FAFF", border:"2px solid #EEF2FF", borderRadius:16,
                          padding:"16px 20px", textAlign:"left", cursor:"pointer", transition:"all 0.2s",
                          display:"flex", alignItems:"center", justifyContent:"space-between"
                        }}
                        onMouseEnter={e => {
                          const b = e.currentTarget as HTMLButtonElement
                          b.style.borderColor = "#4F6EF7"
                          b.style.background = "#F0F4FF"
                          b.style.transform = "translateY(-1px)"
                          b.style.boxShadow = "0 4px 16px rgba(79,110,247,0.15)"
                        }}
                        onMouseLeave={e => {
                          const b = e.currentTarget as HTMLButtonElement
                          b.style.borderColor = "#EEF2FF"
                          b.style.background = "#F8FAFF"
                          b.style.transform = "none"
                          b.style.boxShadow = "none"
                        }}>
                        <div>
                          <p style={{ fontWeight:700, color:"#1E293B", margin:"0 0 4px", fontSize:15 }}>{svc.name}</p>
                          <p style={{ color:"#94A3B8", margin:0, fontSize:13 }}>{formatDur(svc.duration)}</p>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          {svc.price != null && (
                            <span style={{ fontWeight:800, color:"#4F6EF7", fontSize:16 }}>{formatPrice(svc.price)}</span>
                          )}
                          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#4F6EF7,#7C3AED)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, flexShrink:0 }}>›</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Date & Time ── */}
            {step === "datetime" && (
              <div>
                <BackBtn onClick={() => setStep("service")} />
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1E293B", marginBottom:4 }}>Wann passt es dir?</h2>
                <div style={{ background:"#F0F4FF", borderRadius:12, padding:"10px 14px", marginBottom:20, display:"inline-flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#4F6EF7" }}>✓ {selectedService?.name}</span>
                  <span style={{ color:"#CBD5E1" }}>·</span>
                  <span style={{ fontSize:13, color:"#64748B" }}>{formatDur(selectedService?.duration || 0)}</span>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <label>
                    <span style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>Datum</span>
                    <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                      style={{ width:"100%", padding:"13px 16px", border:"2px solid #EEF2FF", borderRadius:12, fontSize:15, color:"#1E293B", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                  </label>
                  <label>
                    <span style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>Uhrzeit</span>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} step={900}
                      style={{ width:"100%", padding:"13px 16px", border:"2px solid #EEF2FF", borderRadius:12, fontSize:15, color:"#1E293B", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                  </label>
                </div>
                <PrimaryBtn onClick={() => setStep("contact")} disabled={!date || !time} style={{ marginTop:20 }}>
                  Weiter →
                </PrimaryBtn>
              </div>
            )}

            {/* ── STEP 3: Contact ── */}
            {step === "contact" && (
              <div>
                <BackBtn onClick={() => setStep("datetime")} />
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1E293B", marginBottom:4 }}>Deine Kontaktdaten</h2>
                <p style={{ color:"#64748B", fontSize:14, marginBottom:20 }}>Damit wir dich zur Bestätigung erreichen.</p>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <label>
                    <span style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>Vor- und Nachname *</span>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Max Mustermann"
                      style={{ width:"100%", padding:"13px 16px", border:"2px solid #EEF2FF", borderRadius:12, fontSize:15, color:"#1E293B", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                  </label>
                  <label>
                    <span style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>Telefonnummer *</span>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0151 12345678"
                      style={{ width:"100%", padding:"13px 16px", border:"2px solid #EEF2FF", borderRadius:12, fontSize:15, color:"#1E293B", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                  </label>
                  <label>
                    <span style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>
                      Anmerkung <span style={{ fontWeight:400, color:"#94A3B8" }}>(optional)</span>
                    </span>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      placeholder="z.B. bitte kurz klingeln"
                      rows={3}
                      style={{ width:"100%", padding:"13px 16px", border:"2px solid #EEF2FF", borderRadius:12, fontSize:15, color:"#1E293B", outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }} />
                  </label>
                </div>
                <PrimaryBtn onClick={() => setStep("confirm")} disabled={!name.trim() || !phone.trim()} style={{ marginTop:20 }}>
                  Weiter →
                </PrimaryBtn>
              </div>
            )}

            {/* ── STEP 4: Confirm ── */}
            {step === "confirm" && (
              <div>
                <BackBtn onClick={() => setStep("contact")} />
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1E293B", marginBottom:4 }}>Alles korrekt?</h2>
                <p style={{ color:"#64748B", fontSize:14, marginBottom:20 }}>Überprüfe kurz deine Angaben.</p>

                <div style={{ background:"#F8FAFF", borderRadius:16, padding:"4px 0", border:"1px solid #EEF2FF", marginBottom:16 }}>
                  <SummaryRow label="Betrieb"   value={company?.name || ""} />
                  <SummaryRow label="Leistung"  value={selectedService?.name || ""} />
                  <SummaryRow label="Dauer"     value={formatDur(selectedService?.duration || 0)} />
                  {selectedService?.price != null && <SummaryRow label="Preis" value={formatPrice(selectedService.price) || ""} />}
                  <SummaryRow label="Termin"    value={formatDateTime(date, time)} />
                  <SummaryRow label="Name"      value={name} />
                  <SummaryRow label="Telefon"   value={phone} last={!note} />
                  {note && <SummaryRow label="Anmerkung" value={note} last />}
                </div>

                <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#1D4ED8", lineHeight:1.6 }}>
                  ℹ️ Dies ist eine Terminanfrage. {company?.name} wird dich zur Bestätigung kontaktieren.
                </div>

                {error && (
                  <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:14, color:"#DC2626", lineHeight:1.5 }}>
                    {error}
                  </div>
                )}

                <PrimaryBtn onClick={submitBooking} disabled={submitting}>
                  {submitting ? "Wird gesendet …" : "Jetzt Anfrage senden ✓"}
                </PrimaryBtn>

                <p style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:12 }}>
                  Mit dem Absenden stimmst du der Verarbeitung deiner Kontaktdaten zu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:20 }}>
          Powered by <span style={{ color:"#4F6EF7", fontWeight:700 }}>TerminStop</span>
        </p>
      </div>
    </div>
  )
}

// ── Reusable components ──────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ background:"none", border:"none", color:"#4F6EF7", cursor:"pointer", fontSize:14, fontWeight:600, padding:"0 0 16px", display:"flex", alignItems:"center", gap:4 }}>
      ← Zurück
    </button>
  )
}

function PrimaryBtn({ onClick, disabled, children, style }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width:"100%", padding:"15px 0",
        background: disabled ? "#E2E8F0" : "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)",
        color: disabled ? "#94A3B8" : "#fff",
        border:"none", borderRadius:14, fontSize:15, fontWeight:700,
        cursor: disabled ? "not-allowed" : "pointer",
        transition:"all 0.2s", letterSpacing:0.3,
        boxShadow: disabled ? "none" : "0 4px 20px rgba(79,110,247,0.4)",
        ...style
      }}>
      {children}
    </button>
  )
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"12px 20px", borderBottom: last ? "none" : "1px solid #EEF2FF" }}>
      <span style={{ fontSize:13, color:"#94A3B8", flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color:"#1E293B", fontWeight:600, textAlign:"right" }}>{value}</span>
    </div>
  )
}
