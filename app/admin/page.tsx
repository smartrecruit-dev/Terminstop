"use client"

import { useEffect, useState } from "react"

const G   = "#18A66D"
const GL  = "#F0FBF6"
const GB  = "#D1F5E3"
const T   = "#111827"
const M   = "#6B7280"
const BD  = "#E5E7EB"
const BG  = "#F9FAFB"
const RED = "#EF4444"

type Company = {
  id: string
  name: string
  email: string
  paused: boolean
  slug: string | null
  booking_addon: boolean
  notification_phone: string | null
  sms_count: number
  appointments: number
  customers: number
  created_at: string
}

type Tab = "zentrale" | "betriebe" | "create" | "coldcall"

const COLD_CALL_SCRIPT = [
  {
    title: "🟢 Einstieg (5 Sek.)",
    bg: "#ECFDF5", border: "#6EE7B7",
    text: '"Guten Tag, mein Name ist Marvin von TerminStop.\nIch störe nur kurz – haben Sie 60 Sekunden?"',
  },
  {
    title: "🎯 Problem ansprechen (15 Sek.)",
    bg: "#EFF6FF", border: "#BFDBFE",
    text: '"Wir helfen Betrieben wie Ihrem dabei, Terminausfälle zu reduzieren.\nHaben Sie das Problem, dass Kunden Termine vergessen oder kurzfristig absagen?"',
  },
  {
    title: "💡 Lösung (15 Sek.)",
    bg: GL, border: GB,
    text: '"TerminStop sendet Ihren Kunden automatisch 24 Stunden vor jedem Termin\neine SMS-Erinnerung. Kein Aufwand für Sie – läuft komplett automatisch.\nAb 1,30 € pro Tag."',
  },
  {
    title: "⚡ Abschluss (10 Sek.)",
    bg: "#FFFBEB", border: "#FDE68A",
    text: '"Ich kann Sie in 2 Minuten einrichten –\nich brauche nur Ihren Namen und Ihre E-Mail.\nDarf ich das kurz machen?"',
  },
  {
    title: "🔄 Einwand: Kein Interesse",
    bg: "#FEF2F2", border: "#FECACA",
    text: '"Verstehe ich. Darf ich fragen – haben Sie aktuell ein System\nfür SMS-Erinnerungen oder läuft das noch manuell?"',
  },
  {
    title: "🔄 Einwand: Zu teuer",
    bg: "#FEF2F2", border: "#FECACA",
    text: '"1,30 € pro Tag – das ist weniger als ein Kaffee.\nUnd wenn nur ein Termin pro Woche nicht ausfällt,\nhat sich\'s schon gerechnet.\nWollen wir\'s einfach mal 2 Wochen kostenlos testen?"',
  },
]

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", border: `1.5px solid ${BD}`,
  borderRadius: 10, fontSize: 13, color: T, background: "#fff",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
}

const btnStyle = (v: "green" | "gray" | "red" | "blue" | "yellow"): React.CSSProperties => ({
  padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 700, transition: "all .12s", whiteSpace: "nowrap",
  background: v === "green" ? G : v === "red" ? "#FEE2E2" : v === "blue" ? "#EFF6FF" : v === "yellow" ? "#FFFBEB" : "#F3F4F6",
  color: v === "green" ? "#fff" : v === "red" ? RED : v === "blue" ? "#3B82F6" : v === "yellow" ? "#D97706" : T,
})

function Badge({ label, color }: { label: string; color: "green" | "gray" | "blue" | "red" | "yellow" }) {
  const map = {
    green:  { bg: GL,        fg: G,         border: GB },
    gray:   { bg: "#F3F4F6", fg: M,         border: BD },
    blue:   { bg: "#EFF6FF", fg: "#3B82F6", border: "#BFDBFE" },
    red:    { bg: "#FEF2F2", fg: RED,        border: "#FECACA" },
    yellow: { bg: "#FFFBEB", fg: "#D97706",  border: "#FDE68A" },
  }
  const c = map[color]
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: .3 }}>
      {label}
    </span>
  )
}

function CopyBtn({ text, label = "Kopieren" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
      style={{ ...btnStyle("gray"), fontSize: 11 }}>
      {copied ? "✓ Kopiert!" : label}
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [secret, setSecret]       = useState("")
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState("")
  const [tab, setTab]             = useState<Tab>("zentrale")

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<"all" | "active" | "paused" | "addon">("all")
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [edits, setEdits]         = useState<Record<string, Partial<Company>>>({})
  const [saving, setSaving]       = useState<string | null>(null)

  // Create form
  const [newName, setNewName]     = useState("")
  const [newEmail, setNewEmail]   = useState("")
  const [newPhone, setNewPhone]   = useState("")
  const [newPw, setNewPw]         = useState("")
  const [newAddon, setNewAddon]   = useState(false)
  const [creating, setCreating]   = useState(false)
  const [createResult, setCreateResult] = useState<any>(null)
  const [createError, setCreateError]   = useState("")

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret")
    if (saved) { setSecret(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    if (authed) loadCompanies()
  }, [authed])

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) return
    setAuthed(true)
    sessionStorage.setItem("admin_secret", secret.trim())
  }

  async function loadCompanies() {
    setLoading(true)
    const res = await fetch("/api/admin/companies", { headers: { "x-admin-secret": secret } })
    if (res.status === 401) {
      setAuthed(false)
      sessionStorage.removeItem("admin_secret")
      setAuthError("Falsches Passwort.")
      setLoading(false)
      return
    }
    const json = await res.json()
    setCompanies(json.companies || [])
    setLoading(false)
  }

  async function quickUpdate(companyId: string, updates: Partial<Company>) {
    const res = await fetch("/api/admin/update-company", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ companyId, updates }),
    })
    const json = await res.json()
    if (json.success) { showToast("Gespeichert ✓"); loadCompanies() }
    else showToast(json.error || "Fehler beim Speichern", false)
  }

  async function saveEdits(companyId: string) {
    const e = edits[companyId]
    if (!e || Object.keys(e).length === 0) return
    setSaving(companyId)
    await quickUpdate(companyId, e)
    setSaving(null)
    setEdits(prev => { const n = { ...prev }; delete n[companyId]; return n })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true); setCreateError(""); setCreateResult(null)
    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone, password: newPw }),
    })
    const json = await res.json()
    setCreating(false)
    if (json.error) {
      setCreateError(json.error)
    } else {
      if (newAddon && json.userId) await quickUpdate(json.userId, { booking_addon: true })
      setCreateResult({ ...json, withAddon: newAddon })
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewPw(""); setNewAddon(false)
      loadCompanies()
    }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activeCount = companies.filter(c => !c.paused).length
  const addonCount  = companies.filter(c => c.booking_addon).length
  const totalSMS    = companies.reduce((s, c) => s + (c.sms_count || 0), 0)
  const totalAppts  = companies.reduce((s, c) => s + (c.appointments || 0), 0)
  const totalCusts  = companies.reduce((s, c) => s + (c.customers || 0), 0)
  const thisMonth   = companies.filter(c => {
    const d = new Date(c.created_at), now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const filtered = companies
    .filter(c => filter === "all" ? true : filter === "active" ? !c.paused : filter === "paused" ? c.paused : c.booking_addon)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase()) || (c.slug || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 24, padding: "44px 36px", width: "100%", maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
          </div>
          <div style={{ fontSize: 13, color: M, marginTop: 4 }}>Admin-Kommandozentrale</div>
        </div>
        {authError && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: RED }}>
            ⚠️ {authError}
          </div>
        )}
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
            placeholder="Admin-Passwort" style={{ ...inp, fontSize: 15, padding: "14px 16px" }} autoFocus />
          <button type="submit" style={{ ...btnStyle("green"), padding: "14px", fontSize: 15 }}>
            Einloggen →
          </button>
        </form>
      </div>
    </div>
  )

  // ── E-Mail Vorlage ─────────────────────────────────────────────────────────
  function emailTemplate(r: any) {
    return `Betreff: Dein TerminStop-Zugang ist bereit 🎉

Hallo ${r.name},

willkommen bei TerminStop! Ich habe deinen Zugang eingerichtet.

DEINE LOGIN-DATEN:
Link:     https://terminstop.de/login
E-Mail:   ${r.email}
Passwort: ${r.password}

Melde dich einfach an und leg direkt los.${r.withAddon ? "\n\nDu hast das Online-Buchungs-Add-on – richte deinen persönlichen Buchungslink unter Einstellungen ein." : ""}

Bei Fragen bin ich jederzeit erreichbar.

Viele Grüße,
Marvin Passe
TerminStop
Tel.: 0151 54219634
terminstop.business@gmail.com`
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: BG, fontFamily: "'Inter','Manrope',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.ok ? G : RED, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BD}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, background: RED, padding: "2px 7px", borderRadius: 20, marginLeft: 8 }}>ADMIN</span>
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {([
              ["zentrale", "📊 Zentrale"],
              ["betriebe", "🏢 Betriebe"],
              ["create",   "➕ Neu anlegen"],
              ["coldcall", "📞 Cold-Call"],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                background: tab === t ? GL : "transparent",
                color: tab === t ? G : M,
              }}>
                {label}
                {t === "betriebe" && companies.length > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 10, background: BD, color: M, padding: "1px 6px", borderRadius: 10 }}>
                    {companies.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={loadCompanies} style={{ ...btnStyle("gray"), fontSize: 11 }}>⟳ Refresh</button>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem("admin_secret") }}
            style={{ fontSize: 12, color: M, background: "none", border: "none", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ════════════════════════════════════════════════════════
            ZENTRALE
        ════════════════════════════════════════════════════════ */}
        {tab === "zentrale" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.5px" }}>Kommandozentrale 🛡️</h1>

            {/* MRR Banner */}
            <div style={{ background: `linear-gradient(135deg, ${G}, #15955F)`, borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: .8, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Geschätzter MRR</div>
                <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>~{(activeCount * 40).toLocaleString("de")} €</div>
                <div style={{ fontSize: 12, opacity: .75, marginTop: 4 }}>{activeCount} aktive Betriebe × 40 € – nur ein Richtwert</div>
              </div>
              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { v: thisMonth, l: "Neu diesen Monat" },
                  { v: addonCount, l: "Mit Add-on" },
                  { v: companies.length - activeCount, l: "Pausiert" },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 30, fontWeight: 900 }}>{s.v}</div>
                    <div style={{ fontSize: 11, opacity: .8, fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { icon: "🏢", label: "Betriebe gesamt",  value: companies.length,              color: T },
                { icon: "✅", label: "Aktiv",             value: activeCount,                   color: G },
                { icon: "🔖", label: "Buchungs-Add-on",  value: addonCount,                    color: "#3B82F6" },
                { icon: "📱", label: "SMS gesamt",        value: totalSMS.toLocaleString("de"), color: T },
                { icon: "📅", label: "Termine gesamt",   value: totalAppts.toLocaleString("de"),color: T },
                { icon: "👥", label: "Kunden gesamt",    value: totalCusts.toLocaleString("de"),color: T },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: k.color, letterSpacing: "-.5px", lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: M, fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: .4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Neueste Betriebe */}
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T }}>Neueste Betriebe</span>
                <button onClick={() => setTab("betriebe")} style={{ ...btnStyle("gray"), fontSize: 11 }}>Alle anzeigen →</button>
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: M }}>Lädt …</div>
              ) : companies.slice(0, 8).map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i < 7 ? `1px solid ${BD}` : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.paused ? "#FCD34D" : G, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {c.booking_addon && <Badge label="ADD-ON" color="blue" />}
                    {c.paused ? <Badge label="PAUSIERT" color="yellow" /> : <Badge label="AKTIV" color="green" />}
                  </div>
                  <div style={{ fontSize: 11, color: M, flexShrink: 0, minWidth: 70, textAlign: "right" }}>
                    {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            BETRIEBE
        ════════════════════════════════════════════════════════ */}
        {tab === "betriebe" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 2px", letterSpacing: "-.4px" }}>Alle Betriebe</h1>
                <p style={{ fontSize: 13, color: M, margin: 0 }}>{filtered.length} von {companies.length}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen …" style={{ ...inp, width: 220 }} />
                {(["all", "active", "paused", "addon"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ ...btnStyle(filter === f ? "green" : "gray"), fontSize: 11 }}>
                    {f === "all" ? "Alle" : f === "active" ? "✅ Aktiv" : f === "paused" ? "⏸ Pausiert" : "🔖 Add-on"}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: M }}>Lädt …</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(c => {
                  const isOpen = expanded === c.id
                  const e = edits[c.id] || {}
                  const val = (field: keyof Company) => (field in e ? e[field] : c[field]) as any

                  return (
                    <div key={c.id} style={{ background: "#fff", border: `1px solid ${c.paused ? "#FDE68A" : BD}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

                      {/* ── Kompakt-Row ── */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", flexWrap: "wrap" }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: c.paused ? "#FCD34D" : G, flexShrink: 0 }} />

                        <div style={{ flex: 1, minWidth: 150 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: T }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                          {c.slug && <div style={{ fontSize: 11, color: G, fontWeight: 600 }}>/{c.slug}</div>}
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: 18 }}>
                          {[{ v: c.appointments, l: "Termine" }, { v: c.customers, l: "Kunden" }, { v: c.sms_count || 0, l: "SMS" }].map(s => (
                            <div key={s.l} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 15, fontWeight: 900, color: T }}>{s.v}</div>
                              <div style={{ fontSize: 9, color: M, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{s.l}</div>
                            </div>
                          ))}
                        </div>

                        {/* Badges */}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {c.paused        && <Badge label="PAUSIERT"  color="yellow" />}
                          {c.booking_addon  && <Badge label="BUCHUNG"   color="blue"   />}
                          {c.notification_phone && <Badge label="📱 SMS" color="green" />}
                          {!c.notification_phone && <Badge label="Kein Tel." color="gray" />}
                        </div>

                        {/* Quick actions */}
                        <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap" }}>
                          <button onClick={() => quickUpdate(c.id, { booking_addon: !c.booking_addon })} style={{ ...btnStyle(c.booking_addon ? "blue" : "gray"), padding: "6px 10px", fontSize: 11 }}>
                            {c.booking_addon ? "🔖 An" : "🔖 Aus"}
                          </button>
                          <button onClick={() => quickUpdate(c.id, { paused: !c.paused })} style={{ ...btnStyle(c.paused ? "green" : "yellow"), padding: "6px 10px", fontSize: 11 }}>
                            {c.paused ? "▶ Aktiv" : "⏸ Pause"}
                          </button>
                          <button onClick={() => setExpanded(isOpen ? null : c.id)} style={{ ...btnStyle("gray"), padding: "6px 10px", fontSize: 11 }}>
                            {isOpen ? "▲ Zu" : "✏️ Details"}
                          </button>
                        </div>

                        <div style={{ fontSize: 11, color: M, flexShrink: 0 }}>
                          {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>

                      {/* ── Detail/Edit Panel ── */}
                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${BD}`, background: BG, padding: "20px 20px 24px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>

                            {/* Name */}
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Betriebsname</label>
                              <input value={val("name") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], name: ev.target.value } }))} style={{ ...inp, fontSize: 12 }} />
                            </div>

                            {/* Phone */}
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Telefon (SMS-Benachrichtigung)</label>
                              <input value={val("notification_phone") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], notification_phone: ev.target.value } }))} placeholder="+49151…" style={{ ...inp, fontSize: 12 }} type="tel" />
                            </div>

                            {/* Slug */}
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Buchungslink-Slug</label>
                              <input value={val("slug") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], slug: ev.target.value } }))} placeholder="friseur-mueller" style={{ ...inp, fontSize: 12 }} />
                              {(val("slug") || c.slug) && (
                                <div style={{ fontSize: 10, color: G, marginTop: 3 }}>terminstop.de/book/{val("slug") || c.slug}</div>
                              )}
                            </div>

                            {/* SMS Count */}
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>SMS-Zähler (manuell setzen)</label>
                              <input value={val("sms_count") ?? c.sms_count} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], sms_count: parseInt(ev.target.value) || 0 } }))} type="number" min={0} style={{ ...inp, fontSize: 12 }} />
                            </div>
                          </div>

                          {/* Toggles */}
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                            {[
                              { key: "booking_addon", label: "🔖 Buchungs-Add-on" },
                              { key: "paused",        label: "⏸ Konto pausiert"  },
                            ].map(toggle => {
                              const isOn = val(toggle.key as keyof Company) as boolean
                              return (
                                <div key={toggle.key}
                                  onClick={() => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], [toggle.key]: !isOn } }))}
                                  style={{ display: "flex", alignItems: "center", gap: 10, background: isOn ? GL : "#fff", border: `1px solid ${isOn ? GB : BD}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", transition: "all .15s" }}>
                                  <div style={{ width: 38, height: 20, borderRadius: 10, background: isOn ? G : BD, position: "relative", transition: "background .2s", flexShrink: 0 }}>
                                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: isOn ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: isOn ? G : M }}>{toggle.label}</span>
                                </div>
                              )
                            })}
                          </div>

                          {/* Save / Cancel */}
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                            <button onClick={() => saveEdits(c.id)} disabled={saving === c.id || Object.keys(e).length === 0}
                              style={{ ...btnStyle("green"), opacity: Object.keys(e).length === 0 ? .5 : 1, cursor: Object.keys(e).length === 0 ? "not-allowed" : "pointer" }}>
                              {saving === c.id ? "Speichert …" : "💾 Änderungen speichern"}
                            </button>
                            <button onClick={() => { setEdits(p => { const n = { ...p }; delete n[c.id]; return n }); setExpanded(null) }} style={btnStyle("gray")}>
                              Abbrechen
                            </button>
                          </div>

                          {/* Info */}
                          <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 12, padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 24px" }}>
                            {[
                              { label: "User-ID",    value: c.id },
                              { label: "E-Mail",     value: c.email },
                              { label: "Erstellt",   value: new Date(c.created_at).toLocaleString("de-DE") },
                              { label: "Termine",    value: String(c.appointments) },
                              { label: "Kunden",     value: String(c.customers) },
                              { label: "SMS gesamt", value: String(c.sms_count || 0) },
                            ].map(row => (
                              <div key={row.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: M, fontWeight: 700, minWidth: 75 }}>{row.label}:</span>
                                <span style={{ fontSize: 11, color: T, fontFamily: row.label === "User-ID" ? "monospace" : "inherit", wordBreak: "break-all" }}>{row.value}</span>
                                {(row.label === "User-ID" || row.label === "E-Mail") && (
                                  <CopyBtn text={row.value} label="⎘" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            NEU ANLEGEN
        ════════════════════════════════════════════════════════ */}
        {tab === "create" && (
          <div style={{ maxWidth: 580 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.4px" }}>➕ Neuen Betrieb anlegen</h1>

            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 20 }}>

              {createError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 13, color: RED }}>
                  ⚠️ {createError}
                </div>
              )}

              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Betriebsname *",   ph: "z.B. Friseur Müller",  type: "text",     val: newName,  set: setNewName,  req: true },
                  { label: "E-Mail (Login) *",  ph: "inhaber@betrieb.de",   type: "email",    val: newEmail, set: setNewEmail, req: true },
                  { label: "Handynummer",        ph: "0151 12345678",        type: "tel",      val: newPhone, set: setNewPhone, req: false },
                  { label: "Passwort setzen *",  ph: "mind. 6 Zeichen",     type: "password", val: newPw,    set: setNewPw,    req: true },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input value={f.val} onChange={e => f.set(e.target.value)}
                      type={f.type} placeholder={f.ph} style={inp} required={f.req} minLength={f.label.includes("Passwort") ? 6 : undefined} />
                    {f.label.includes("Passwort") && newPw.length > 0 && newPw.length < 6 && (
                      <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>Mindestens 6 Zeichen</div>
                    )}
                  </div>
                ))}

                {/* Add-on Toggle */}
                <div onClick={() => setNewAddon(!newAddon)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: newAddon ? GL : BG, border: `1px solid ${newAddon ? GB : BD}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all .15s" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T }}>🔖 Online-Buchungs-Add-on</div>
                    <div style={{ fontSize: 11, color: M, marginTop: 2 }}>Buchungsseite + Anfragen direkt aktivieren</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: newAddon ? G : BD, position: "relative", transition: "all .2s", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: newAddon ? 23 : 3, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                  </div>
                </div>

                <button type="submit" disabled={creating} style={{ ...btnStyle("green"), padding: "14px", fontSize: 14, opacity: creating ? .7 : 1, cursor: creating ? "not-allowed" : "pointer" }}>
                  {creating ? "Wird angelegt …" : "Betrieb anlegen →"}
                </button>
              </form>
            </div>

            {/* Erfolg + E-Mail Vorlage */}
            {createResult && (
              <div style={{ background: "#fff", border: `1px solid ${GB}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: G }}>✓ Betrieb angelegt!</div>
                  <CopyBtn text={emailTemplate(createResult)} label="📋 Vorlage kopieren" />
                </div>

                {/* Login-Daten Kacheln */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    { label: "E-Mail",    value: createResult.email },
                    { label: "Passwort",  value: createResult.password },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: M, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, minWidth: 70 }}>{row.label}</span>
                      <span style={{ fontSize: 13, color: T, fontWeight: 700, background: BG, padding: "6px 14px", borderRadius: 8, fontFamily: "monospace", flex: 1 }}>{row.value}</span>
                      <CopyBtn text={row.value} />
                    </div>
                  ))}
                </div>

                {/* E-Mail Vorlage */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
                    📧 E-Mail-Vorlage (anpassen & versenden)
                  </div>
                  <pre style={{ fontSize: 12, color: T, lineHeight: 1.7, fontFamily: "monospace", background: BG, border: `1px solid ${BD}`, borderRadius: 12, padding: "16px 18px", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                    {emailTemplate(createResult)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            COLD-CALL
        ════════════════════════════════════════════════════════ */}
        {tab === "coldcall" && (
          <div style={{ maxWidth: 680 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.4px" }}>📞 Cold-Call Leitfaden</h1>

            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <CopyBtn text={COLD_CALL_SCRIPT.map(s => `${s.title}\n${s.text}`).join("\n\n")} label="📋 Alles kopieren" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COLD_CALL_SCRIPT.map(s => (
                  <div key={s.title} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 18px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T, marginBottom: 7, letterSpacing: .2 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: T, lineHeight: 1.7, whiteSpace: "pre-line", fontStyle: "italic" }}>{s.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: G }}>✓ Anruf erfolgreich?</div>
                <div style={{ fontSize: 13, color: M, marginTop: 2 }}>Betrieb anlegen – dauert 30 Sekunden.</div>
              </div>
              <button onClick={() => setTab("create")} style={{ ...btnStyle("green"), padding: "12px 24px", fontSize: 14 }}>
                ➕ Betrieb anlegen →
              </button>
            </div>
          </div>
        )}

      </div>
      <style>{`* { box-sizing: border-box; } input:focus { border-color: ${G} !important; box-shadow: 0 0 0 3px ${GL}; }`}</style>
    </div>
  )
}
