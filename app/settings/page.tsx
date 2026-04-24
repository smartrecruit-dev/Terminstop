"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import QRCode from "../components/QRCode"
import { useToast } from "../components/Toast"

type Section = "buchungsseite" | "mitarbeiter" | "konto" | "sms" | "abo"

type Employee = {
  id: string
  name: string
  active: boolean
}

export default function SettingsPage() {
  const toast = useToast()
  useEffect(() => { document.title = "Einstellungen | TerminStop" }, [])

  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [userEmail,   setUserEmail]   = useState("")
  const [memberSince, setMemberSince] = useState("")
  const [loading,     setLoading]     = useState(true)
  const [bookingAddon, setBookingAddon] = useState(false)
  const [section, setSection]         = useState<Section>("konto")
  const [plan,    setPlan]            = useState<string>("trial")
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  // SMS-Verbrauch
  const [smsUsed,       setSmsUsed]       = useState(0)
  const [smsLimit,      setSmsLimit]      = useState(0)
  const [smsExtra,      setSmsExtra]      = useState(0)
  const [topupLoading,  setTopupLoading]  = useState<string | null>(null)

  // Buchungsseite
  const [bookingNote,   setBookingNote]   = useState("")
  const [slug,          setSlug]          = useState("")
  const [bookingSaving, setBookingSaving] = useState(false)
  const [bookingMsg,    setBookingMsg]    = useState("")

  // Mitarbeiter
  const [employees,     setEmployees]     = useState<Employee[]>([])
  const [empLoading,    setEmpLoading]    = useState(false)
  const [empName,       setEmpName]       = useState("")
  const [empAdding,     setEmpAdding]     = useState(false)
  const [empError,      setEmpError]      = useState("")

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

    // Nach Stripe-Rücksprung direkt auf richtigen Tab springen
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab") as Section | null
    if (tab && ["buchungsseite","mitarbeiter","konto","sms","abo"].includes(tab)) {
      setSection(tab)
    }
    if (params.get("topup") === "success") {
      setTimeout(() => toast.success("Extra-SMS gutgeschrieben!", "Deine zusätzlichen SMS sind sofort verfügbar."), 500)
    }
  }, [])

  useEffect(() => { if (companyId) loadSettings() }, [companyId])
  useEffect(() => { if (companyId && section === "mitarbeiter") loadEmployees() }, [companyId, section])

  async function loadSettings() {
    setLoading(true)
    const [{ data: co }, { data: { user } }] = await Promise.all([
      supabase.from("companies").select("name, booking_note, slug, booking_addon, plan, stripe_customer_id, sms_count_month, sms_limit, sms_extra_month, created_at, paused").eq("id", companyId!).single(),
      supabase.auth.getUser(),
    ])
    if (co) {
      const plan = co.plan || "trial"

      // Gesperrt prüfen
      if (co.paused) {
        const reason = plan === "cancelled" ? "cancelled" : plan === "trial" ? "trial" : "payment"
        window.location.href = `/blocked?reason=${reason}&plan=${plan}`
        return
      }
      // Trial abgelaufen?
      if (plan === "trial" && co.created_at) {
        const expired = Date.now() - new Date(co.created_at).getTime() > 14 * 24 * 60 * 60 * 1000
        if (expired) {
          await supabase.from("companies").update({ paused: true }).eq("id", companyId!)
          window.location.href = "/blocked?reason=trial&plan=trial"
          return
        }
      }

      setCompanyName(co.name || "")
      setBookingNote(co.booking_note || "")
      setSlug(co.slug || "")
      setBookingAddon(!!co.booking_addon)
      setPlan(plan)
      setSmsUsed(co.sms_count_month || 0)
      setSmsLimit(co.sms_limit || 0)
      setSmsExtra(co.sms_extra_month || 0)
      setSection("buchungsseite")
    }
    if (user) {
      setUserEmail(user.email || "")
      setMemberSince(user.created_at ? new Date(user.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }) : "")
    }
    setLoading(false)
  }

  async function loadEmployees() {
    if (!companyId) return
    setEmpLoading(true)
    const { data } = await supabase
      .from("employees")
      .select("id, name, active")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true })
    setEmployees(data || [])
    setEmpLoading(false)
  }

  async function addEmployee() {
    const trimmed = empName.trim()
    if (!trimmed) return
    if (employees.length >= 5) { setEmpError("Maximal 5 Mitarbeiter möglich."); return }
    setEmpAdding(true); setEmpError("")
    const { error } = await supabase
      .from("employees")
      .insert({ company_id: companyId, name: trimmed, active: true })
    setEmpAdding(false)
    if (error) {
      setEmpError("Fehler beim Hinzufügen.")
    } else {
      setEmpName("")
      toast.success("Mitarbeiter hinzugefügt!", `${trimmed} wurde angelegt.`)
      loadEmployees()
    }
  }

  async function toggleEmployee(emp: Employee) {
    await supabase.from("employees").update({ active: !emp.active }).eq("id", emp.id)
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, active: !e.active } : e))
  }

  async function deleteEmployee(emp: Employee) {
    if (!confirm(`Mitarbeiter „${emp.name}" wirklich löschen?`)) return
    const { error } = await supabase.from("employees").delete().eq("id", emp.id)
    if (error) {
      toast.error("Fehler", "Mitarbeiter konnte nicht gelöscht werden.")
    } else {
      toast.success("Gelöscht", `${emp.name} wurde entfernt.`)
      setEmployees(prev => prev.filter(e => e.id !== emp.id))
    }
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
    if (error) {
      toast.error("Fehler beim Speichern", error.message)
    } else {
      toast.success("Gespeichert!", "Deine Buchungsseite wurde aktualisiert.")
    }
    setBookingMsg("")
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
    toast.success("Passwort geändert!", "Dein neues Passwort ist aktiv.")
    setPwMsg("")
    setPwOld(""); setPwNew(""); setPwConfirm("")
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
    { id: "buchungsseite", label: "Buchungsseite" },
    { id: "mitarbeiter",   label: "Mitarbeiter"   },
    { id: "konto",         label: "Konto"         },
    { id: "sms",           label: "SMS-Vorschau"  },
    { id: "abo",           label: "Abo & Zahlung" },
  ]

  async function openPortal() {
    setPortalLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    const json = await res.json()
    setPortalLoading(false)
    if (json.url) window.location.href = json.url
  }

  async function startCheckout(priceId: string, planKey: string) {
    setCheckoutLoading(planKey)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ priceId }),
    })
    const json = await res.json()
    setCheckoutLoading(null)
    if (json.url) window.location.href = json.url
  }

  async function startTopup(priceId: string, key: string) {
    setTopupLoading(key)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch("/api/stripe/sms-topup", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ priceId }),
    })
    const json = await res.json()
    setTopupLoading(null)
    if (json.url) window.location.href = json.url
    else toast.error("Fehler", json.error || "Unbekannter Fehler")
  }

  const SMS_PACKAGES = [
    { key: "sms50",  label: "50 Extra-SMS",  price: "9,90 €",  priceId: process.env.NEXT_PUBLIC_STRIPE_SMS_50_PRICE_ID!  },
    { key: "sms100", label: "100 Extra-SMS", price: "17,90 €", priceId: process.env.NEXT_PUBLIC_STRIPE_SMS_100_PRICE_ID! },
    { key: "sms200", label: "200 Extra-SMS", price: "29,90 €", priceId: process.env.NEXT_PUBLIC_STRIPE_SMS_200_PRICE_ID! },
  ]

  const PLANS = [
    { key: "starter",  label: "Starter",  price: "39 €",  sms: "100 SMS",  priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID! },
    { key: "pro",      label: "Pro",       price: "109 €", sms: "400 SMS",  priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID! },
    { key: "business", label: "Business",  price: "229 €", sms: "1.000 SMS",priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID! },
  ]

  const planLabel: Record<string, string> = {
    trial: "Testzeitraum (14 Tage)", starter: "Starter", pro: "Pro", business: "Business", cancelled: "Gekündigt",
  }

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
        <div style={{ display: "flex", gap: 2, marginBottom: 24, background: "#fff", border: `1px solid ${BD}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12.5, fontWeight: section === s.id ? 700 : 500,
              background: section === s.id ? GL : "transparent",
              color: section === s.id ? G : M,
              transition: "all .15s",
              whiteSpace: "nowrap",
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── BUCHUNGSSEITE ── */}
        {section === "buchungsseite" && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: T, margin: "0 0 6px" }}>Buchungsseite</h2>
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

        {/* ── MITARBEITER ── */}
        {section === "mitarbeiter" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={card}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: T, margin: "0 0 6px" }}>Mitarbeiter</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
                Lege bis zu 5 Mitarbeiter an. Das System prüft automatisch, ob ein Mitarbeiter zum gewünschten Termin verfügbar ist.
                Hast du keine Mitarbeiter angelegt, gilt dein Betrieb als Einzelperson (Kapazität = 1).
              </p>

              {/* Mitarbeiter-Liste */}
              {empLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                  <div style={{ width: 28, height: 28, border: `3px solid ${GL}`, borderTopColor: G, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              ) : employees.length === 0 ? (
                <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "20px 24px", textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T, marginBottom: 4 }}>Noch keine Mitarbeiter</div>
                  <div style={{ fontSize: 13, color: M }}>Füge deinen ersten Mitarbeiter hinzu — oder lass es leer für Einzelbetrieb.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {employees.map(emp => (
                    <div key={emp.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderRadius: 14,
                      border: `1.5px solid ${emp.active ? GB : BD}`,
                      background: emp.active ? GL : "#F9FAFB",
                      gap: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: emp.active ? G : "#D1D5DB",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 800, color: "#fff",
                        }}>
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T }}>{emp.name}</div>
                          <div style={{ fontSize: 12, color: emp.active ? G : M, fontWeight: 600 }}>
                            {emp.active ? "✓ Aktiv" : "Inaktiv"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        {/* Toggle aktiv/inaktiv */}
                        <button
                          onClick={() => toggleEmployee(emp)}
                          title={emp.active ? "Deaktivieren" : "Aktivieren"}
                          style={{
                            padding: "7px 13px", borderRadius: 9, border: `1px solid ${emp.active ? BD : GB}`,
                            cursor: "pointer", fontSize: 12, fontWeight: 700,
                            background: emp.active ? "#fff" : GL,
                            color: emp.active ? M : G,
                          }}
                        >
                          {emp.active ? "Pausieren" : "Aktivieren"}
                        </button>
                        {/* Löschen */}
                        <button
                          onClick={() => deleteEmployee(emp)}
                          title="Mitarbeiter löschen"
                          style={{
                            padding: "7px 10px", borderRadius: 9, border: "1px solid #FEE2E2",
                            cursor: "pointer", fontSize: 14, background: "#FEF2F2", color: RED,
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Neuen Mitarbeiter hinzufügen */}
              {employees.length < 5 ? (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                    Mitarbeiter hinzufügen
                  </label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      value={empName}
                      onChange={e => { setEmpName(e.target.value); setEmpError("") }}
                      onKeyDown={e => { if (e.key === "Enter") addEmployee() }}
                      placeholder="Name des Mitarbeiters"
                      style={{ ...inp, flex: 1, minWidth: 180, maxWidth: 300 }}
                    />
                    <button
                      onClick={addEmployee}
                      disabled={empAdding || !empName.trim()}
                      style={saveBtn(empAdding || !empName.trim())}
                    >
                      {empAdding ? "Wird hinzugefügt …" : "+ Hinzufügen"}
                    </button>
                  </div>
                  {empError && (
                    <p style={{ fontSize: 13, color: RED, margin: "8px 0 0", fontWeight: 600 }}>⚠️ {empError}</p>
                  )}
                </div>
              ) : (
                <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400E" }}>
                  ⚠️ Maximale Anzahl von 5 Mitarbeitern erreicht. Lösche einen Mitarbeiter, um einen neuen hinzuzufügen.
                </div>
              )}

              {/* Info-Box */}
              <div style={{ marginTop: 24, background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "14px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T, marginBottom: 8 }}>Wie funktioniert das?</div>
                <div style={{ fontSize: 13, color: M, lineHeight: 1.7 }}>
                  Wenn ein Kunde einen Termin bucht, prüft das System wie viele aktive Mitarbeiter du hast.
                  Sind noch freie Plätze → <strong style={{ color: G }}>automatisch bestätigt</strong> + SMS-Bestätigung an den Kunden.
                  Sind alle Mitarbeiter belegt → Anfrage landet als <strong style={{ color: T }}>Ausstehend</strong> in deinem Dashboard.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── KONTO & PASSWORT ── */}
        {section === "konto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Konto-Info */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 18px" }}>Konto-Informationen</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Betriebsname",   value: companyName  },
                  { label: "E-Mail-Adresse", value: userEmail    },
                  { label: "Mitglied seit",  value: memberSince  },
                  { label: "Aktueller Plan", value: planLabel[plan] || plan },
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
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>Passwort ändern</h2>
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

            {/* SMS-Verbrauch & Extra kaufen */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>SMS-Verbrauch diesen Monat</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 20px", lineHeight: 1.6 }}>
                Dein aktuelles Kontingent und optionale Extra-SMS, die nur für diesen Monat gelten.
              </p>

              {/* Fortschrittsbalken */}
              {(() => {
                const total = smsLimit + smsExtra
                const pct   = total > 0 ? Math.min(100, Math.round((smsUsed / total) * 100)) : 0
                const barColor = pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : G
                return (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 28, fontWeight: 900, color: T }}>{smsUsed}</span>
                        <span style={{ fontSize: 15, color: M, marginLeft: 4 }}>/ {total} SMS</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{pct}% verbraucht</span>
                    </div>
                    <div style={{ height: 10, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99, transition: "width .4s" }} />
                    </div>
                    {smsExtra > 0 && (
                      <div style={{ fontSize: 12, color: G, marginTop: 6, fontWeight: 600 }}>
                        + {smsExtra} dazugekaufte Extra-SMS diesen Monat
                      </div>
                    )}
                    {pct >= 80 && (
                      <div style={{ marginTop: 10, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#92400E", fontWeight: 600 }}>
                        ⚠️ Du hast {100 - pct}% deines SMS-Kontingents übrig — kaufe jetzt nach, um lückenlos weiter zu senden.
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Extra-SMS kaufen */}
              <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T, marginBottom: 4 }}>Extra-SMS dazukaufen</div>
                <div style={{ fontSize: 13, color: M, marginBottom: 16, lineHeight: 1.6 }}>
                  Einmalige Zahlung — die SMS gelten nur für den laufenden Monat und verfallen danach.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {SMS_PACKAGES.map(pkg => (
                    <div key={pkg.key} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      border: `1.5px solid ${BD}`, borderRadius: 12, padding: "13px 16px",
                      background: "#FAFAFA", gap: 12, flexWrap: "wrap",
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T }}>{pkg.label}</div>
                        <div style={{ fontSize: 12, color: M, marginTop: 2 }}>Einmalig · {pkg.price} · nur diesen Monat</div>
                      </div>
                      <button
                        onClick={() => startTopup(pkg.priceId, pkg.key)}
                        disabled={topupLoading === pkg.key}
                        style={{
                          padding: "9px 18px", borderRadius: 9, border: "none",
                          cursor: topupLoading === pkg.key ? "not-allowed" : "pointer",
                          fontSize: 13, fontWeight: 700, background: G, color: "#fff",
                          opacity: topupLoading === pkg.key ? 0.6 : 1, whiteSpace: "nowrap",
                        }}
                      >
                        {topupLoading === pkg.key ? "Weiterleitung…" : `Kaufen ${pkg.price} →`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SMS-Vorschau */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>So sieht deine SMS-Erinnerung aus</h2>
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
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 18px" }}>SMS-Versand</h2>
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

        {/* ── ABO & ZAHLUNG ── */}
        {section === "abo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Aktueller Plan */}
            <div style={card}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>Dein aktuelles Paket</h2>
              <p style={{ fontSize: 14, color: M, margin: "0 0 20px", lineHeight: 1.6 }}>
                Hier siehst du dein aktives Paket und kannst es jederzeit ändern oder kündigen.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#F0FBF6", border: "1px solid #D1F5E3", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 28 }}>
                  {plan === "trial" ? "🎉" : plan === "starter" ? "⚡" : plan === "pro" ? "🚀" : plan === "business" ? "🏢" : "❌"}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T }}>{planLabel[plan] || plan}</div>
                  <div style={{ fontSize: 13, color: M, marginTop: 2 }}>
                    {plan === "trial" ? "14 Tage kostenlos testen — danach Paket wählen" :
                     plan === "starter" ? "39 € / Monat · bis 100 SMS" :
                     plan === "pro" ? "109 € / Monat · bis 400 SMS" :
                     plan === "business" ? "229 € / Monat · bis 1.000 SMS" :
                     "Kein aktives Abo"}
                  </div>
                </div>
              </div>

              {/* Portal Button (wenn bereits Abo) */}
              {["starter", "pro", "business"].includes(plan) && (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  style={{ ...saveBtn(portalLoading), display: "flex", alignItems: "center", gap: 8 }}
                >
                  {portalLoading ? "Weiterleitung…" : "Abo verwalten / kündigen →"}
                </button>
              )}
            </div>

            {/* Pakete */}
            {(plan === "trial" || plan === "cancelled") && (
              <div style={card}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>Paket wählen</h2>
                <p style={{ fontSize: 14, color: M, margin: "0 0 20px", lineHeight: 1.6 }}>
                  Alle Pakete beinhalten 14 Tage gratis — danach monatlich kündbar.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {PLANS.map(p => (
                    <div key={p.key} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      border: `1.5px solid ${p.key === "pro" ? G : BD}`,
                      borderRadius: 14, padding: "16px 20px",
                      background: p.key === "pro" ? "#F0FBF6" : "#fff",
                      gap: 16, flexWrap: "wrap",
                    }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: T, display: "flex", alignItems: "center", gap: 8 }}>
                          {p.label}
                          {p.key === "pro" && <span style={{ fontSize: 11, fontWeight: 700, background: G, color: "#fff", padding: "2px 9px", borderRadius: 980 }}>Empfohlen</span>}
                        </div>
                        <div style={{ fontSize: 13, color: M, marginTop: 3 }}>{p.price} / Monat · {p.sms}</div>
                      </div>
                      <button
                        onClick={() => startCheckout(p.priceId, p.key)}
                        disabled={checkoutLoading === p.key}
                        style={{
                          padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                          fontSize: 13, fontWeight: 700, background: p.key === "pro" ? G : "#F3F4F6",
                          color: p.key === "pro" ? "#fff" : T, whiteSpace: "nowrap",
                          opacity: checkoutLoading === p.key ? 0.6 : 1,
                        }}
                      >
                        {checkoutLoading === p.key ? "Weiterleitung…" : "Jetzt wählen →"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan upgraden wenn bereits aktiv */}
            {["starter", "pro", "business"].includes(plan) && (
              <div style={card}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: T, margin: "0 0 6px" }}>Paket wechseln</h2>
                <p style={{ fontSize: 14, color: M, margin: "0 0 4px" }}>
                  Upgrades und Downgrades über das Stripe-Kundenportal möglich.
                </p>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  style={{ ...saveBtn(false), marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  {portalLoading ? "Weiterleitung…" : "Paket wechseln →"}
                </button>
              </div>
            )}
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
