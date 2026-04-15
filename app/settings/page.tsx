"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import QRCode from "../components/QRCode"

type Section = "benachrichtigungen" | "buchungsseite" | "konto"

export default function SettingsPage() {
    useEffect(() => { document.title = "Einstellungen | TerminStop" }, [])

const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [loading,     setLoading]     = useState(true)
  const [section,     setSection]     = useState<Section>("benachrichtigungen")

  // Benachrichtigungs-Telefon
  const [notifPhone,      setNotifPhone]      = useState("")
  const [notifSaving,     setNotifSaving]     = useState(false)
  const [notifMsg,        setNotifMsg]        = useState("")

  // Buchungsseite
  const [bookingNote,     setBookingNote]     = useState("")
  const [slug,            setSlug]            = useState("")
  const [bookingSaving,   setBookingSaving]   = useState(false)
  const [bookingMsg,      setBookingMsg]      = useState("")

  // Konto
  const [displayName,     setDisplayName]     = useState("")
  const [nameSaving,      setNameSaving]      = useState(false)
  const [nameMsg,         setNameMsg]         = useState("")

  // PW
  const [pwCurrent,       setPwCurrent]       = useState("")
  const [pwNew,           setPwNew]           = useState("")
  const [pwConfirm,       setPwConfirm]       = useState("")
  const [pwSaving,        setPwSaving]        = useState(false)
  const [pwMsg,           setPwMsg]           = useState("")
  const [pwErr,           setPwErr]           = useState("")

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
      .select("name, notification_phone, booking_note, slug")
      .eq("id", companyId!)
      .single()
    if (data) {
      setDisplayName(data.name || "")
      setNotifPhone(data.notification_phone || "")
      setBookingNote(data.booking_note || "")
      setSlug(data.slug || "")
    }
    setLoading(false)
  }

  async function saveNotifPhone() {
    if (!companyId) return
    setNotifSaving(true); setNotifMsg("")
    const { error } = await supabase
      .from("companies")
      .update({ notification_phone: notifPhone.trim() || null })
      .eq("id", companyId)
    setNotifSaving(false)
    setNotifMsg(error ? "❌ Fehler beim Speichern." : "✓ Gespeichert")
    setTimeout(() => setNotifMsg(""), 3000)
  }

  async function saveBookingSettings() {
    if (!companyId) return
    setBookingSaving(true); setBookingMsg("")

    // Slug-Verfügbarkeit prüfen
    if (slug.trim()) {
      const { data: existing } = await supabase
        .from("companies").select("id").eq("slug", slug.trim()).neq("id", companyId).single()
      if (existing) {
        setBookingMsg("❌ Dieser Link ist bereits vergeben.")
        setBookingSaving(false); return
      }
    }

    const { error } = await supabase
      .from("companies")
      .update({ booking_note: bookingNote.trim() || null, slug: slug.trim() || null })
      .eq("id", companyId)
    setBookingSaving(false)
    setBookingMsg(error ? "❌ Fehler beim Speichern." : "✓ Gespeichert")
    setTimeout(() => setBookingMsg(""), 3000)
  }

  async function saveDisplayName() {
    if (!companyId) return
    setNameSaving(true); setNameMsg("")
    const { error } = await supabase
      .from("companies")
      .update({ name: displayName.trim() })
      .eq("id", companyId)
    if (!error) {
      localStorage.setItem("company_name", displayName.trim())
      setCompanyName(displayName.trim())
    }
    setNameSaving(false)
    setNameMsg(error ? "❌ Fehler beim Speichern." : "✓ Name aktualisiert")
    setTimeout(() => setNameMsg(""), 3000)
  }

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "Mindestens 8 Zeichen erforderlich."
    if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/.test(pw))
      return "Mindestens ein Sonderzeichen erforderlich (!@#$%...)."
    return null
  }

  async function savePassword() {
    setPwErr(""); setPwMsg("")
    const validErr = validatePassword(pwNew)
    if (validErr) { setPwErr(validErr); return }
    if (pwNew !== pwConfirm) { setPwErr("Passwörter stimmen nicht überein."); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwNew })
    setPwSaving(false)
    if (error) { setPwErr("Fehler: " + error.message); return }
    setPwMsg("✓ Passwort geändert")
    setPwCurrent(""); setPwNew(""); setPwConfirm("")
    setTimeout(() => setPwMsg(""), 3000)
  }

  const G = "#18A66D"; const GL = "#F0FBF6"; const GB = "#D1F5E3"
  const T = "#111827"; const M = "#6B7280"; const BD = "#E5E7EB"
  const BG2 = "#F9FAFB"

  const inputCls = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "benachrichtigungen", label: "Benachrichtigungen", icon: "🔔" },
    { id: "buchungsseite",      label: "Buchungsseite",      icon: "🔗" },
    { id: "konto",              label: "Konto & Passwort",   icon: "👤" },
  ]

  if (loading) return (
    <div style={{ minHeight:"100dvh", background:BG2 }}>
      <DashNav active="/settings" companyId={companyId} onLogout={handleLogout} />
      <div className="flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-2 border-[#D1F5E3] border-t-[#18A66D] rounded-full animate-spin" />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:"100dvh", background:BG2, fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      <DashNav active="/settings" companyId={companyId} onLogout={handleLogout} />

      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:900, color:T, margin:"0 0 4px", letterSpacing:"-.5px" }}>Einstellungen</h1>
          <p style={{ fontSize:14, color:M, margin:0 }}>{companyName}</p>
        </div>

        <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* Sidebar */}
          <div style={{ width:200, flexShrink:0, background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:8, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer",
                  background: section === s.id ? GL : "transparent",
                  color: section === s.id ? G : T,
                  fontWeight: section === s.id ? 700 : 500,
                  fontSize:14, textAlign:"left", transition:"all .15s",
                }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:280 }}>

            {/* ── BENACHRICHTIGUNGEN ── */}
            {section === "benachrichtigungen" && (
              <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize:17, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.3px" }}>🔔 Benachrichtigungen</h2>
                <p style={{ fontSize:14, color:M, margin:"0 0 24px", lineHeight:1.6 }}>
                  Wenn eine neue Online-Buchungsanfrage eingeht, bekommst du automatisch eine SMS auf diese Nummer.
                </p>

                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:M, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>
                    Benachrichtigungs-Telefon
                  </label>
                  <input
                    className={inputCls}
                    type="tel"
                    value={notifPhone}
                    onChange={e => setNotifPhone(e.target.value)}
                    placeholder="z.B. 0151 12345678"
                    autoComplete="tel"
                  />
                  <p style={{ fontSize:12, color:M, marginTop:6 }}>
                    Leer lassen um keine Benachrichtigungen zu erhalten.
                  </p>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <button onClick={saveNotifPhone} disabled={notifSaving}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${notifSaving ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" : "bg-[#18A66D] text-white hover:bg-[#15955F]"}`}>
                    {notifSaving ? "Speichert …" : "Speichern"}
                  </button>
                  {notifMsg && <span style={{ fontSize:13, color: notifMsg.startsWith("✓") ? G : "#DC2626", fontWeight:600 }}>{notifMsg}</span>}
                </div>

                {notifPhone && (
                  <div style={{ marginTop:20, background:GL, border:`1px solid ${GB}`, borderRadius:12, padding:"12px 16px", fontSize:13, color:G, lineHeight:1.6 }}>
                    ✓ Neue Anfragen werden an <strong>{notifPhone}</strong> gesendet.
                  </div>
                )}
              </div>
            )}

            {/* ── BUCHUNGSSEITE ── */}
            {section === "buchungsseite" && (
              <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize:17, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.3px" }}>🔗 Buchungsseite</h2>
                <p style={{ fontSize:14, color:M, margin:"0 0 24px", lineHeight:1.6 }}>
                  Passe deine öffentliche Buchungsseite an, die Kunden per QR-Code oder Link aufrufen.
                </p>

                <div style={{ display:"flex", flexDirection:"column", gap:18, marginBottom:24 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:M, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>
                      Buchungslink (URL)
                    </label>
                    <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${BD}`, borderRadius:12, overflow:"hidden", background:"#F9FAFB" }}>
                      <span style={{ padding:"13px 12px", fontSize:13, color:M, background:"#F3F4F6", borderRight:`1px solid ${BD}`, whiteSpace:"nowrap", flexShrink:0 }}>
                        terminstop.de/book/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="dein-betrieb"
                        style={{ flex:1, padding:"13px 14px", border:"none", outline:"none", fontSize:14, color:T, background:"transparent", fontFamily:"inherit" }}
                      />
                    </div>
                    <p style={{ fontSize:12, color:M, marginTop:5 }}>Nur Kleinbuchstaben, Zahlen und Bindestriche.</p>
                  </div>

                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:M, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>
                      Hinweis auf der Buchungsseite
                    </label>
                    <textarea
                      className={inputCls}
                      value={bookingNote}
                      onChange={e => setBookingNote(e.target.value)}
                      placeholder="z.B. Bitte 15 Minuten früher erscheinen · Parkplätze vorhanden"
                      rows={3}
                      style={{ resize:"none" }}
                    />
                    <p style={{ fontSize:12, color:M, marginTop:5 }}>Wird unter deinem Betriebsnamen auf der Buchungsseite angezeigt.</p>
                  </div>
                </div>

                {slug && (
                  <>
                    <div style={{ background:"#F9FAFB", border:`1px solid ${BD}`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, color:M }}>Deine Buchungsseite:</span>
                      <a href={`/book/${slug}`} target="_blank" rel="noreferrer"
                        style={{ fontSize:13, color:G, fontWeight:700, textDecoration:"none" }}>
                        terminstop.de/book/{slug} ↗
                      </a>
                    </div>
                    <div style={{ marginBottom:24 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:T, margin:"0 0 12px" }}>QR-Code für Kunden</p>
                      <QRCode
                        url={`https://terminstop.de/book/${slug}`}
                        label="Kunden scannen diesen Code, um direkt auf deine Buchungsseite zu gelangen."
                      />
                    </div>
                  </>
                )}

                <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <button onClick={saveBookingSettings} disabled={bookingSaving}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${bookingSaving ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" : "bg-[#18A66D] text-white hover:bg-[#15955F]"}`}>
                    {bookingSaving ? "Speichert …" : "Speichern"}
                  </button>
                  {bookingMsg && <span style={{ fontSize:13, color: bookingMsg.startsWith("✓") ? G : "#DC2626", fontWeight:600 }}>{bookingMsg}</span>}
                </div>

                {/* Link zu Leistungen */}
                <div style={{ marginTop:20, background:GL, border:`1px solid ${GB}`, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T, marginBottom:2 }}>Leistungen verwalten</div>
                    <div style={{ fontSize:12, color:M }}>Welche Dienste Kunden auf deiner Buchungsseite auswählen können.</div>
                  </div>
                  <a href="/services"
                    style={{ flexShrink:0, fontSize:13, fontWeight:700, color:G, textDecoration:"none", background:"#fff", border:`1px solid ${GB}`, borderRadius:10, padding:"8px 14px", whiteSpace:"nowrap" }}>
                    Leistungen bearbeiten →
                  </a>
                </div>
              </div>
            )}

            {/* ── KONTO ── */}
            {section === "konto" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Name */}
                <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                  <h2 style={{ fontSize:17, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.3px" }}>👤 Betriebsname</h2>
                  <p style={{ fontSize:14, color:M, margin:"0 0 20px", lineHeight:1.6 }}>
                    Dieser Name erscheint in SMS-Erinnerungen und auf der Buchungsseite.
                  </p>
                  <input
                    className={`${inputCls} mb-4`}
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Dein Betriebsname"
                  />
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <button onClick={saveDisplayName} disabled={nameSaving || !displayName.trim()}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${nameSaving || !displayName.trim() ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" : "bg-[#18A66D] text-white hover:bg-[#15955F]"}`}>
                      {nameSaving ? "Speichert …" : "Name speichern"}
                    </button>
                    {nameMsg && <span style={{ fontSize:13, color: nameMsg.startsWith("✓") ? G : "#DC2626", fontWeight:600 }}>{nameMsg}</span>}
                  </div>
                </div>

                {/* Passwort */}
                <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                  <h2 style={{ fontSize:17, fontWeight:800, color:T, margin:"0 0 6px", letterSpacing:"-.3px" }}>🔐 Passwort ändern</h2>
                  <p style={{ fontSize:14, color:M, margin:"0 0 20px", lineHeight:1.6 }}>
                    Mindestens 8 Zeichen und ein Sonderzeichen (!@#$%...).
                  </p>

                  {pwErr && (
                    <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 mb-4 text-sm text-[#DC2626]">
                      ⚠️ {pwErr}
                    </div>
                  )}

                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                    <input className={inputCls} type="password" value={pwNew}
                      onChange={e => setPwNew(e.target.value)} placeholder="Neues Passwort" autoComplete="new-password" />
                    <input className={`${inputCls} ${pwConfirm && pwConfirm !== pwNew ? "border-red-300" : pwConfirm && pwConfirm === pwNew ? "border-green-300" : ""}`}
                      type="password" value={pwConfirm}
                      onChange={e => setPwConfirm(e.target.value)} placeholder="Neues Passwort bestätigen" autoComplete="new-password" />
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <button onClick={savePassword} disabled={pwSaving || !pwNew || !pwConfirm}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${pwSaving || !pwNew || !pwConfirm ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" : "bg-[#18A66D] text-white hover:bg-[#15955F]"}`}>
                      {pwSaving ? "Speichert …" : "Passwort ändern"}
                    </button>
                    {pwMsg && <span style={{ fontSize:13, color:G, fontWeight:600 }}>{pwMsg}</span>}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
