"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import QRCode from "../components/QRCode"

type Section = "buchungsseite" | "konto"

export default function SettingsPage() {
  useEffect(() => { document.title = "Einstellungen | TerminStop" }, [])

  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [loading,     setLoading]     = useState(true)
  const [bookingAddon, setBookingAddon] = useState(false)
  const [section, setSection]         = useState<Section>("konto")

  // Buchungsseite
  const [bookingNote,   setBookingNote]   = useState("")
  const [slug,          setSlug]          = useState("")
  const [bookingSaving, setBookingSaving] = useState(false)
  const [bookingMsg,    setBookingMsg]    = useState("")

  // Konto
  const [displayName, setDisplayName] = useState("")
  const [nameSaving,  setNameSaving]  = useState(false)
  const [nameMsg,     setNameMsg]     = useState("")

  // PW
  const [pwNew,     setPwNew]     = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwSaving,  setPwSaving]  = useState(false)
  const [pwMsg,     setPwMsg]     = useState("")
  const [pwErr,     setPwErr]     = useState("")

  function handleLogout() {
    supabase.auth.signOut().then(() => {
      localStorage.removeItem("company_id")
      localStorage.removeItem("company_name")
      window.location.href = "/login"
    })
  }

  useEffect(() => {
    const id   = localStorage.getItem("company_id")
    const name = localStorage.getItem("company_name")
    if (!id) { window.location.href = "/login"; return }
    setCompanyId(id)
    setCompanyName(name || "")
    setDisplayName(name || "")
  }, [])

  useEffect(() => { if (companyId) loadSettings() }, [companyId])

  async function loadSettings() {
    setLoading(true)
    const { data } = await supabase
      .from("companies")
      .select("name, booking_note, slug, booking_addon")
      .eq("id", companyId!)
      .single()
    if (data) {
      setDisplayName(data.name || "")
      setBookingNote(data.booking_note || "")
      setSlug(data.slug || "")
      setBookingAddon(!!data.booking_addon)
      if (data.booking_addon) setSection("buchungsseite")
    }
    setLoading(false)
  }

  async function saveBookingSettings() {
    if (!companyId) return
    setBookingSaving(true); setBookingMsg("")
    if (slug.trim()) {
      const { data: existing } = await supabase
        .from("companies").select("id").eq("slug", slug.trim()).neq("id", companyId).single()
      if (existing) {
        setBookingMsg("❌ Dieser Link ist bereits vergeben.")
        setBookingSaving(false); return
      }
    }
    const { error } = await supabase.from("companies")
      .update({ booking_note: bookingNote.trim() || null, slug: slug.trim() || null })
      .eq("id", companyId)
    setBookingSaving(false)
    setBookingMsg(error ? "❌ Fehler beim Speichern." : "✓ Gespeichert")
    setTimeout(() => setBookingMsg(""), 3000)
  }

  async function saveDisplayName() {
    if (!companyId) return
    setNameSaving(true); setNameMsg("")
    const { error } = await supabase.from("companies")
      .update({ name: displayName.trim() }).eq("id", companyId)
    if (!error) {
      localStorage.setItem("company_name", displayName.trim())
      setCompanyName(displayName.trim())
    }
    setNameSaving(false)
    setNameMsg(error ? "❌ Fehler." : "✓ Name aktualisiert")
    setTimeout(() => setNameMsg(""), 3000)
  }

  async function savePassword() {
    setPwErr(""); setPwMsg("")
    if (pwNew.length < 6) { setPwErr("Mindestens 6 Zeichen erforderlich."); return }
    if (pwNew !== pwConfirm) { setPwErr("Passwörter stimmen nicht überein."); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwNew })
    setPwSaving(false)
    if (error) { setPwErr("Fehler: " + error.message); return }
    setPwMsg("✓ Passwort geändert")
    setPwNew(""); setPwConfirm("")
    setTimeout(() => setPwMsg(""), 3000)
  }

  const G = "#18A66D", GL = "#F0FBF6", GB = "#D1F5E3"
  const T = "#111827", M = "#6B7280", BD = "#E5E7EB"

  const inp = {
    width: "100%", background: "#F9FAFB", border: `1.5px solid ${BD}`,
    borderRadius: 12, padding: "12px 15px", fontSize: 14, color: T,
    fontFamily: "inherit", outline: "none", transition: "border .15s",
    boxSizing: "border-box" as const,
  }

  const card = {
    background: "#fff", border: `1px solid ${BD}`, borderRadius: 20,
    padding: "28px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  }

  const saveBtn = (disabled: boolean) => ({
    padding: "11px 24px", borderRadius: 11, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13.5, fontWeight: 700, transition: "all .15s",
    background: disabled ? "#E5E7EB" : G, color: disabled ? M : "#fff",
  })

  const sections = [
    ...(bookingAddon ? [{ id: "buchungsseite" as Section, label: "🔗 Buchungsseite" }] : []),
    { id: "konto" as Section, label: "👤 Konto & Passwort" },
  ]

  if (loading) return (
    <div style={{ minHeight: "100dvh", background: "#F9FAFB" }}>
      <DashNav active="/settings" companyId={companyId} onLogout={handleLogout} />
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${GL}`, borderTopColor: G, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100dvh", background: "#F9FAFB", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <DashNav active="/settings" companyId={companyId} onLogout={handleLogout} />

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 4px", letterSpacing: "-.4px" }}>Einstellungen</h1>
          <p style={{ fontSize: 14, color: M, margin: 0 }}>{companyName}</p>
        </div>

        {/* Tabs */}
        {sections.length > 1 && (
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#fff", border: `1px solid ${BD}`, borderRadius: 14, padding: 5, width: "fit-content" }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 13.5, fontWeight: section === s.id ? 700 : 500,
                background: section === s.id ? GL : "transparent",
                color: section === s.id ? G : M,
                transition: "all .15s",
              }}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* ── BUCHUNGSSEITE ── */}
        {section === "buchungsseite" && bookingAddon && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: T, margin: "0 0 6px" }}>🔗 Buchungsseite</h2>
            <p style={{ fontSize: 14, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
              Deine öffentliche Buchungsseite, die Kunden per Link oder QR-Code aufrufen.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
              {/* Slug */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                  Buchungslink
                </label>
                <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${BD}`, borderRadius: 12, overflow: "hidden", background: "#F9FAFB" }}>
                  <span style={{ padding: "13px 14px", fontSize: 13, color: M, background: "#F3F4F6", borderRight: `1px solid ${BD}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                    terminstop.de/book/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="dein-betrieb"
                    style={{ flex: 1, padding: "13px 15px", border: "none", outline: "none", fontSize: 14, color: T, background: "transparent", fontFamily: "inherit" }}
                  />
                </div>
                <p style={{ fontSize: 12, color: M, marginTop: 5 }}>Nur Kleinbuchstaben, Zahlen und Bindestriche.</p>
              </div>

              {/* Hinweis */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                  Hinweis auf der Buchungsseite <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <textarea
                  value={bookingNote}
                  onChange={e => setBookingNote(e.target.value)}
                  placeholder="z.B. Bitte 10 Minuten früher erscheinen · Parkplätze vorhanden"
                  rows={3}
                  style={{ ...inp, resize: "none" }}
                />
              </div>
            </div>

            {/* Vorschau & QR */}
            {slug && (
              <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: .4, marginBottom: 2 }}>Deine Buchungsseite</div>
                    <a href={`/book/${slug}`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 14, color: G, fontWeight: 700, textDecoration: "none" }}>
                      terminstop.de/book/{slug} ↗
                    </a>
                  </div>
                </div>
                <QRCode url={`https://terminstop.de/book/${slug}`} label="QR-Code für Kunden" />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
              <button onClick={saveBookingSettings} disabled={bookingSaving} style={saveBtn(bookingSaving)}>
                {bookingSaving ? "Speichert …" : "Speichern"}
              </button>
              {bookingMsg && <span style={{ fontSize: 13, color: bookingMsg.startsWith("✓") ? G : "#DC2626", fontWeight: 600 }}>{bookingMsg}</span>}
            </div>

            <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T, marginBottom: 2 }}>Leistungen verwalten</div>
                  <div style={{ fontSize: 13, color: M }}>Was Kunden auf deiner Seite auswählen können.</div>
                </div>
                <a href="/services" style={{
                  fontSize: 13, fontWeight: 700, color: G, textDecoration: "none",
                  background: "#fff", border: `1px solid ${GB}`, borderRadius: 10,
                  padding: "9px 16px", whiteSpace: "nowrap",
                }}>
                  Leistungen →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── KONTO ── */}
        {section === "konto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Betriebsname */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 5px" }}>Betriebsname</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 20px", lineHeight: 1.6 }}>
                Erscheint in SMS-Erinnerungen und auf der Buchungsseite.
              </p>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Dein Betriebsname"
                style={{ ...inp, marginBottom: 16 }}
                onFocus={e => (e.target.style.borderColor = G)}
                onBlur={e => (e.target.style.borderColor = BD)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={saveDisplayName} disabled={nameSaving || !displayName.trim()} style={saveBtn(nameSaving || !displayName.trim())}>
                  {nameSaving ? "Speichert …" : "Name speichern"}
                </button>
                {nameMsg && <span style={{ fontSize: 13, color: nameMsg.startsWith("✓") ? G : "#DC2626", fontWeight: 600 }}>{nameMsg}</span>}
              </div>
            </div>

            {/* Passwort */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 5px" }}>Passwort ändern</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 20px", lineHeight: 1.6 }}>Mindestens 6 Zeichen.</p>

              {pwErr && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 11, padding: "11px 15px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
                  ⚠️ {pwErr}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                <input
                  type="password"
                  value={pwNew}
                  onChange={e => setPwNew(e.target.value)}
                  placeholder="Neues Passwort"
                  autoComplete="new-password"
                  style={{ ...inp, borderColor: pwNew && pwNew.length >= 6 ? "#6EE7B7" : BD }}
                  onFocus={e => (e.target.style.borderColor = G)}
                  onBlur={e => (e.target.style.borderColor = pwNew && pwNew.length >= 6 ? "#6EE7B7" : BD)}
                />
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={e => setPwConfirm(e.target.value)}
                  placeholder="Passwort bestätigen"
                  autoComplete="new-password"
                  style={{ ...inp, borderColor: pwConfirm ? (pwConfirm === pwNew ? "#6EE7B7" : "#FECACA") : BD }}
                  onFocus={e => (e.target.style.borderColor = G)}
                  onBlur={e => (e.target.style.borderColor = pwConfirm ? (pwConfirm === pwNew ? "#6EE7B7" : "#FECACA") : BD)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={savePassword} disabled={pwSaving || !pwNew || !pwConfirm} style={saveBtn(pwSaving || !pwNew || !pwConfirm)}>
                  {pwSaving ? "Speichert …" : "Passwort ändern"}
                </button>
                {pwMsg && <span style={{ fontSize: 13, color: G, fontWeight: 600 }}>{pwMsg}</span>}
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
