"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

type Service = {
  id: string
  name: string
  duration: number
  price: number | null
}

type Company = {
  id: string
  name: string
  booking_note: string | null
}

type Step = "service" | "datetime" | "contact" | "confirm" | "done"

export default function BookingPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const [company, setCompany]   = useState<Company | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Booking state
  const [step, setStep]                   = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate]                   = useState("")
  const [time, setTime]                   = useState("")
  const [name, setName]                   = useState("")
  const [phone, setPhone]                 = useState("")
  const [note, setNote]                   = useState("")
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState("")

  useEffect(() => {
    loadCompany()
  }, [slug])

  async function loadCompany() {
    setLoading(true)

    // Load company by slug (strict isolation — only this company)
    const { data: co, error: coErr } = await supabase
      .from("companies")
      .select("id, name, booking_note, booking_active")
      .eq("slug", slug)
      .single()

    if (coErr || !co) {
      setNotFound(true)
      setLoading(false)
      return
    }

    if (co.booking_active === false) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setCompany({ id: co.id, name: co.name, booking_note: co.booking_note })

    // Load only this company's active services
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
    setSubmitting(true)
    setError("")

    // Build ISO datetime for the appointment
    const appointmentAt = new Date(`${date}T${time}:00`).toISOString()

    const { error: insertErr } = await supabase
      .from("appointments")
      .insert({
        company_id:   company.id,
        service_id:   selectedService.id,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        note:         note.trim() || null,
        appointment_at: appointmentAt,
        status:       "pending",
      })

    if (insertErr) {
      if (insertErr.message?.includes("RATE_LIMIT")) {
        setError("Du hast heute bereits 3 Anfragen gesendet. Bitte morgen erneut versuchen oder den Betrieb direkt anrufen.")
      } else {
        setError("Fehler beim Speichern. Bitte versuche es erneut.")
      }
      setSubmitting(false)
      return
    }

    setStep("done")
    setSubmitting(false)
  }

  // ─── Helpers ───────────────────────────────────────────────────
  function formatPrice(p: number | null) {
    if (p == null) return null
    return p.toFixed(2).replace(".", ",") + " €"
  }

  function formatDuration(min: number) {
    if (min < 60) return `${min} Min.`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m === 0 ? `${h} Std.` : `${h} Std. ${m} Min.`
  }

  // Min date = today
  const today = new Date().toISOString().split("T")[0]

  // ─── Loading / Not-found ───────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#6B7280", fontFamily: "system-ui, sans-serif" }}>Wird geladen…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2A37", marginBottom: 8 }}>Seite nicht gefunden</h1>
          <p style={{ color: "#6B7280" }}>Dieser Buchungslink ist nicht aktiv oder existiert nicht.</p>
        </div>
      </div>
    )
  }

  // ─── Done ─────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "40px 32px", maxWidth: 440, width: "100%", margin: "0 16px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ width: 64, height: 64, background: "#D1FAE5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1F2A37", marginBottom: 8 }}>Anfrage gesendet!</h2>
          <p style={{ color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>
            Deine Anfrage bei <strong>{company?.name}</strong> wurde übermittelt.<br />
            Du wirst kontaktiert, sobald der Termin bestätigt ist.
          </p>
          <div style={{ background: "#F3F4F6", borderRadius: 12, padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
              <strong>Leistung:</strong> {selectedService?.name}<br />
              <strong>Dauer:</strong> {formatDuration(selectedService?.duration || 0)}<br />
              <strong>Wunschtermin:</strong> {new Date(`${date}T${time}`).toLocaleString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} Uhr
            </p>
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>Du kannst dieses Fenster jetzt schließen.</p>
        </div>
      </div>
    )
  }

  // ─── Main Booking Flow ─────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#2563EB", padding: "20px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 4px", letterSpacing: 0.5, textTransform: "uppercase" }}>Online-Buchung</p>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>{company?.name}</h1>
          {company?.booking_note && (
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>{company.booking_note}</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#1D4ED8", padding: "0 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", gap: 4, paddingBottom: 1 }}>
          {(["service", "datetime", "contact", "confirm"] as Step[]).map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 3,
              background: ["service","datetime","contact","confirm"].indexOf(step) >= i ? "#93C5FD" : "rgba(255,255,255,0.2)",
              borderRadius: 2,
              transition: "background 0.3s"
            }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── STEP 1: Service ───────────────────────── */}
        {step === "service" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2A37", marginBottom: 4 }}>Leistung wählen</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Was kann {company?.name} für dich tun?</p>

            {services.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", color: "#6B7280" }}>
                Aktuell sind keine Leistungen hinterlegt.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {services.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => { setSelectedService(svc); setStep("datetime") }}
                    style={{
                      background: "#fff",
                      border: "2px solid #E5E7EB",
                      borderRadius: 12,
                      padding: "16px 20px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563EB"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none" }}
                  >
                    <div>
                      <p style={{ fontWeight: 600, color: "#1F2A37", margin: "0 0 4px", fontSize: 16 }}>{svc.name}</p>
                      <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>{formatDuration(svc.duration)}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {svc.price != null && (
                        <p style={{ fontWeight: 700, color: "#2563EB", margin: "0 0 2px", fontSize: 16 }}>{formatPrice(svc.price)}</p>
                      )}
                      <span style={{ fontSize: 20, color: "#D1D5DB" }}>›</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Date & Time ───────────────────── */}
        {step === "datetime" && (
          <div>
            <button onClick={() => setStep("service")} style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
              ← Zurück
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2A37", marginBottom: 4 }}>Wunschtermin</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>
              <strong>{selectedService?.name}</strong> · {formatDuration(selectedService?.duration || 0)}
            </p>

            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Datum</span>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={e => setDate(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 15, color: "#1F2A37", outline: "none", boxSizing: "border-box" }}
                />
              </label>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Uhrzeit</span>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  step={900}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 15, color: "#1F2A37", outline: "none", boxSizing: "border-box" }}
                />
              </label>
            </div>

            <button
              onClick={() => setStep("contact")}
              disabled={!date || !time}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "14px 0",
                background: date && time ? "#2563EB" : "#D1D5DB",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: date && time ? "pointer" : "not-allowed",
                transition: "background 0.2s"
              }}
            >
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP 3: Contact ───────────────────────── */}
        {step === "contact" && (
          <div>
            <button onClick={() => setStep("datetime")} style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
              ← Zurück
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2A37", marginBottom: 4 }}>Deine Kontaktdaten</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Damit {company?.name} dich kontaktieren kann.</p>

            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Vor- und Nachname *</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="z.B. Max Mustermann"
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 15, color: "#1F2A37", outline: "none", boxSizing: "border-box" }}
                />
              </label>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Telefonnummer *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="z.B. 0151 12345678"
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 15, color: "#1F2A37", outline: "none", boxSizing: "border-box" }}
                />
              </label>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Anmerkung <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></span>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="z.B. bitte an der Rückseite klingeln"
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 15, color: "#1F2A37", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </label>
            </div>

            <button
              onClick={() => setStep("confirm")}
              disabled={!name.trim() || !phone.trim()}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "14px 0",
                background: name.trim() && phone.trim() ? "#2563EB" : "#D1D5DB",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: name.trim() && phone.trim() ? "pointer" : "not-allowed",
                transition: "background 0.2s"
              }}
            >
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP 4: Confirm ───────────────────────── */}
        {step === "confirm" && (
          <div>
            <button onClick={() => setStep("contact")} style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
              ← Zurück
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2A37", marginBottom: 4 }}>Zusammenfassung</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Bitte überprüfe deine Angaben.</p>

            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 16 }}>
              <Row label="Betrieb"    value={company?.name || ""} />
              <Row label="Leistung"   value={selectedService?.name || ""} />
              <Row label="Dauer"      value={formatDuration(selectedService?.duration || 0)} />
              {selectedService?.price != null && <Row label="Preis" value={formatPrice(selectedService.price) || ""} />}
              <Row label="Termin"     value={new Date(`${date}T${time}`).toLocaleString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " Uhr"} />
              <Row label="Name"       value={name} />
              <Row label="Telefon"    value={phone} last />
              {note && <Row label="Anmerkung" value={note} last />}
            </div>

            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#1D4ED8", lineHeight: 1.5 }}>
              ℹ️ Dies ist eine Terminanfrage. {company?.name} wird dich zur Bestätigung kontaktieren.
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                {error}
              </div>
            )}

            <button
              onClick={submitBooking}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px 0",
                background: submitting ? "#93C5FD" : "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              {submitting ? "Wird gesendet…" : "Terminanfrage absenden ✓"}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>
              Mit dem Absenden stimmst du der Verarbeitung deiner Daten zu.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px 16px 40px", fontSize: 12, color: "#9CA3AF" }}>
        Powered by <span style={{ color: "#2563EB", fontWeight: 600 }}>TerminStop</span>
      </div>
    </div>
  )
}

// Helper component for summary rows
function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
      <span style={{ fontSize: 14, color: "#6B7280", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: "#1F2A37", fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  )
}
