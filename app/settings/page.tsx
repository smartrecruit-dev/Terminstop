"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import QRCode from "../components/QRCode"

type Section = "buchungsseite" | "konto" | "sms"

export default function SettingsPage() {
  useEffect(() => { document.title = "Einstellungen | TerminStop" }, [])

  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [userEmail,   setUserEmail]   = useState("")
  const [memberSince, setMemberSince] = useState("")
  const [loading,     setLoading]     = useState(true)
  const [bookingAddon, setBookingAddon] = useState(false)
  const [section, setSection]         = useState<Section>("konto")

  // Buchungsseite
  const [bookingNote,   setBookingNote]   = useState("")
  const [slug,          setSlug]          = useState("")
  const [bookingSaving, setBookingSaving] = useState(false)
  const [bookingMsg,    setBookingMsg]    = useState("")

  // Passwort
  const [pwOld,     setPwOld]     = useState("")
  const [pwNew,     setPwNew]     = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwSaving,  setPwSaving]  = useState(false)
  const [pwMsg,     setPwMsg]     = useState("")
  const [pwErr,     setPwErr]     = useState("")
  const [pwOldShow, setPwOldShow] = useState(false)
  const [pwNewShow, setPwNewShow] = useState(false)

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
  }, [])

  useEffect(() => { if (companyId) loadSettings() }, [companyId])

  async function loadSettings() {
    setLoading(true)
    const [{ data: co }, { data: { user } }] = await Promise.all([
      supabase.from("companies").select("name, booking_note, slug, booking_addon").eq("id", companyId!).single(),
      supabase.auth.getUser(),
    ])
    if (co) {
      setCompanyName(co.name || "")
      setBookingNote(co.booking_note || "")
      setSlug(co.slug || "")
      setBookingAddon(!!co.booking_addon)
      if (co.booking_addon) setSection("buchungsseite")
    }
    if (user) {
      setUserEmail(user.email || "")
      setMemberSince(user.created_at ? new Date(user.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }) : "")
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

  async function savePassword() {
    setPwErr(""); setPwMsg("")
    if (!pwOld) { setPwErr("Bitte altes Passwort eingeben."); return }
    if (pwNew.length < 6) { setPwErr("Neues Passwort: mindestens 6 Zeichen."); return }
    if (pwNew !== pwConfirm) { setPwErr("Neue Passwörter stimmen nicht überein."); return }
    if (pwNew === pwOld) { setPwErr("Neues Passwort muss sich vom alten unterscheiden."); return }
    setPwSaving(true)

    // Altes Passwort verifizieren
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: pwOld,
    })
    if (signInErr) {
      setPwErr("Altes Passwort ist falsch.")
      setPwSaving(false); return
    }

    // Neues Passwort setzen
    const { error } = await supabase.auth.updateUser({ password: pwNew })
    setPwSaving(false)
    if (error) { setPwErr("Fehler: " + error.message); return }
    setPwMsg("✓ Passwort erfolgreich geändert")
    setPwOld(""); setPwNew(""); setPwConfirm("")
    setTimeout(() => setPwMsg(""), 4000)
  }

  const G = "#18A66D", GL = "#F0FBF6", GB = "#D1F5E3"
  const T = "#111827", M = "#6B7280", BD = "#E5E7EB", RED = "#EF4444"

  const inp = {
    width: "100%", background: "#F9FAFB", border: `1.5px solid ${BD}`,
    borderRadius: 12, padding: "12px 15px", fontSize: 14, color: T,
    fontFamily: "inherit", outline: "none", transition: "border .15s",
    boxSizing: "border-box" as const,
  }

  const card: React.CSSProperties = {
    background: "#fff", border: `1px solid ${BD}`, borderRadius: 20,
    padding: "28px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  }

  const saveBtn = (disabled: boolean) => ({
    padding: "11px 24px", borderRadius: 11, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13.5, fontWeight: 700, transition: "all .15s",
    background: disabled ? "#E5E7EB" : G, color: disabled ? M : "#fff",
  })

  const smsPreview = `Hallo [Kundenname], Ihr Termin bei ${companyName || "Ihrem Betrieb"} ist morgen um [Uhrzeit] Uhr. Wir freuen uns auf Sie!`

  const sections: { id: Section; label: string }[] = [
    ...(bookingAddon ? [{ id: "buchungsseite" as Section, label: "🔗 Buchungsseite" }] : []),
    { id: "konto",  label: "🔐 Passwort & Konto" },
    { id: "sms",    label: "📱 SMS-Vorschau"      },
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

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 20px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 4px", letterSpacing: "-.4px" }}>Einstellungen</h1>
          <p style={{ fontSize: 14, color: M, margin: 0 }}>{companyName}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#fff", border: `1px solid ${BD}`, borderRadius: 14, padding: 5, width: "fit-content", flexWrap: "wrap" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: section === s.id ? 700 : 500,
              background: section === s.id ? GL : "transparent",
              color: section === s.id ? G : M,
              transition: "all .15s",
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── BUCHUNGSSEITE ── */}
        {section === "buchungsseite" && bookingAddon && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: T, margin: "0 0 6px" }}>🔗 Buchungsseite</h2>
            <p style={{ fontSize: 14, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
              Deine öffentliche Buchungsseite, die Kunden per Link oder QR-Code aufrufen.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>Buchungslink</label>
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
              {bookingMsg && <span style={{ fontSize: 13, color: bookingMsg.startsWith("✓") ? G : RED, fontWeight: 600 }}>{bookingMsg}</span>}
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
                }}>Leistungen →</a>
              </div>
            </div>
          </div>
        )}

        {/* ── KONTO & PASSWORT ── */}
        {section === "konto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Konto-Info */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 18px" }}>👤 Konto-Informationen</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Betriebsname",   value: companyName  },
                  { label: "E-Mail-Adresse", value: userEmail    },
                  { label: "Mitglied seit",  value: memberSince  },
                  { label: "Buchungs-Add-on",value: bookingAddon ? "✅ Aktiv" : "—" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", gap: 16, padding: "12px 16px", background: "#F9FAFB", borderRadius: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, minWidth: 130, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 14, color: T, fontWeight: 500 }}>{row.value || "—"}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: M, marginTop: 14, marginBottom: 0 }}>
                Um den Betriebsnamen oder die E-Mail-Adresse zu ändern, wende dich bitte an den Support.
              </p>
            </div>

            {/* Passwort ändern */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>🔐 Passwort ändern</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 22px", lineHeight: 1.6 }}>
                Gib zuerst dein aktuelles Passwort ein, dann das neue.
              </p>

              {pwErr && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 11, padding: "11px 15px", marginBottom: 16, fontSize: 13, color: RED }}>
                  ⚠️ {pwErr}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>

                {/* Altes Passwort */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6 }}>
                    Aktuelles Passwort
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={pwOldShow ? "text" : "password"}
                      value={pwOld}
                      onChange={e => setPwOld(e.target.value)}
                      placeholder="Dein aktuelles Passwort"
                      autoComplete="current-password"
                      style={{ ...inp, paddingRight: 44 }}
                      onFocus={e => (e.target.style.borderColor = G)}
                      onBlur={e => (e.target.style.borderColor = BD)}
                    />
                    <button onClick={() => setPwOldShow(v => !v)} type="button"
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: M, fontSize: 16, padding: 0, lineHeight: 1 }}>
                      {pwOldShow ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: `1px dashed ${BD}`, margin: "4px 0" }} />

                {/* Neues Passwort */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6 }}>
                    Neues Passwort <span style={{ fontWeight: 400, textTransform: "none" }}>(min. 6 Zeichen)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={pwNewShow ? "text" : "password"}
                      value={pwNew}
                      onChange={e => setPwNew(e.target.value)}
                      placeholder="Neues Passwort"
                      autoComplete="new-password"
                      style={{
                        ...inp, paddingRight: 44,
                        borderColor: pwNew ? (pwNew.length >= 6 ? "#6EE7B7" : "#FECACA") : BD
                      }}
                    />
                    <button onClick={() => setPwNewShow(v => !v)} type="button"
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: M, fontSize: 16, padding: 0, lineHeight: 1 }}>
                      {pwNewShow ? "🙈" : "👁"}
                    </button>
                  </div>
                  {/* Stärke-Anzeige */}
                  {pwNew && (
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      {[6, 8, 10, 12].map(n => (
                        <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: pwNew.length >= n ? (n <= 7 ? "#FCA5A5" : n <= 9 ? "#FCD34D" : G) : BD, transition: "background .2s" }} />
                      ))}
                      <span style={{ fontSize: 11, color: M, marginLeft: 4 }}>
                        {pwNew.length < 6 ? "Zu kurz" : pwNew.length < 8 ? "Schwach" : pwNew.length < 10 ? "Mittel" : "Stark"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bestätigen */}
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={e => setPwConfirm(e.target.value)}
                  placeholder="Neues Passwort bestätigen"
                  autoComplete="new-password"
                  style={{ ...inp, borderColor: pwConfirm ? (pwConfirm === pwNew ? "#6EE7B7" : "#FECACA") : BD }}
                />
                {pwConfirm && pwConfirm !== pwNew && (
                  <p style={{ fontSize: 12, color: RED, margin: 0 }}>Passwörter stimmen nicht überein.</p>
                )}
                {pwConfirm && pwConfirm === pwNew && pwNew.length >= 6 && (
                  <p style={{ fontSize: 12, color: G, margin: 0, fontWeight: 600 }}>✓ Passwörter stimmen überein</p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={savePassword}
                  disabled={pwSaving || !pwOld || !pwNew || !pwConfirm}
                  style={saveBtn(pwSaving || !pwOld || !pwNew || !pwConfirm)}>
                  {pwSaving ? "Wird geprüft …" : "Passwort ändern"}
                </button>
                {pwMsg && <span style={{ fontSize: 13, color: G, fontWeight: 600 }}>{pwMsg}</span>}
              </div>
            </div>

            {/* Konto löschen / Abmelden */}
            <div style={{ ...card, borderColor: "#FEE2E2" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: T, margin: "0 0 6px" }}>Abmelden</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 16px" }}>Du wirst aus deinem Konto abgemeldet.</p>
              <button onClick={handleLogout} style={{
                padding: "10px 22px", borderRadius: 11, border: "none", cursor: "pointer",
                fontSize: 13.5, fontWeight: 700, background: "#FEF2F2", color: RED,
              }}>
                Abmelden →
              </button>
            </div>
          </div>
        )}

        {/* ── SMS-VORSCHAU ── */}
        {section === "sms" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* SMS-Vorschau */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>📱 So sieht deine SMS-Erinnerung aus</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
                Diese Nachricht erhalten deine Kunden automatisch 24 Stunden vor ihrem Termin.
              </p>

              {/* Handy-Mockup */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <div style={{ width: 260, background: "#1C1C1E", borderRadius: 32, padding: "20px 12px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                  <div style={{ background: "#2C2C2E", borderRadius: 20, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>T</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>TerminStop</div>
                        <div style={{ fontSize: 10, color: "#8E8E93" }}>Jetzt</div>
                      </div>
                    </div>
                    <div style={{ background: "#3A3A3C", borderRadius: "12px 12px 12px 4px", padding: "10px 14px", maxWidth: "100%" }}>
                      <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.5 }}>{smsPreview}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Erklärung */}
              <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T, marginBottom: 10 }}>Was wird automatisch ersetzt?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { placeholder: "[Kundenname]", description: "Der Name des Kunden aus deinem System" },
                    { placeholder: companyName || "[Betriebsname]", description: "Dein Betriebsname (so eingestellt im System)" },
                    { placeholder: "[Uhrzeit]",     description: "Die Uhrzeit des gebuchten Termins" },
                  ].map(row => (
                    <div key={row.placeholder} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <code style={{ fontSize: 12, background: "#fff", border: `1px solid ${GB}`, borderRadius: 7, padding: "3px 8px", color: G, fontWeight: 700, flexShrink: 0 }}>
                        {row.placeholder}
                      </code>
                      <span style={{ fontSize: 13, color: M }}>{row.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistik */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 18px" }}>📊 SMS-Versand</h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: "📱", label: "Automatisch versandt",     value: "Täglich, 24h vorher" },
                  { icon: "✅", label: "Zustellung",               value: "Deutschland, Österreich, CH" },
                  { icon: "🔒", label: "Absender",                 value: "TerminStop" },
                  { icon: "💡", label: "Nur bestätigte Termine",   value: "Keine SMS bei offenen Anfragen" },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, minWidth: 180, background: "#F9FAFB", borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: T, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input:focus, textarea:focus { border-color: ${G} !important; }
      `}</style>
    </div>
  )
}
