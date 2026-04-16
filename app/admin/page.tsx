"use client"

import { useEffect, useState, useRef } from "react"

// ── Farben ────────────────────────────────────────────────────────────────────
const G   = "#18A66D"
const GL  = "#F0FBF6"
const GB  = "#D1F5E3"
const T   = "#111827"
const M   = "#6B7280"
const BD  = "#E5E7EB"
const BG  = "#F9FAFB"
const RED = "#EF4444"

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Cold-Call Script ──────────────────────────────────────────────────────────
const COLD_CALL_SCRIPT = `COLD-CALL LEITFADEN – TerminStop

EINSTIEG (5 Sek.)
"Guten Tag, mein Name ist Marvin von TerminStop.
Ich stoere nur kurz – haben Sie 60 Sekunden?"

PROBLEM ANSPRECHEN (15 Sek.)
"Wir helfen Betrieben wie Ihrem dabei,
Terminausfaelle zu reduzieren.
Haben Sie das Problem, dass Kunden
Termine vergessen oder kurzfristig absagen?"

LOESUNG (15 Sek.)
"TerminStop sendet Ihren Kunden
automatisch 24 Stunden vor jedem Termin
eine SMS-Erinnerung.
Kein Aufwand fuer Sie – laeuft komplett automatisch.
Ab 1,30 EUR pro Tag."

ABSCHLUSS (10 Sek.)
"Ich kann Sie in 2 Minuten einrichten –
ich brauche nur Ihren Namen und Ihre E-Mail.
Darf ich das kurz machen?"

EINWAND: "Kein Interesse"
"Verstehe ich. Darf ich fragen –
haben Sie aktuell ein System fuer
SMS-Erinnerungen oder laeuft das noch manuell?"

EINWAND: "Zu teuer"
"1,30 EUR pro Tag – das ist weniger als
ein Kaffee. Und wenn nur ein Termin
pro Woche nicht ausfaellt, hat sich's
schon gerechnet. Wollen wir's einfach
mal 2 Wochen kostenlos testen?"

ZIEL DES ANRUFS
Name + E-Mail + Handynummer
-> Direkt anlegen -> Betrieb ist sofort live!`

// ── Helpers ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", border: `1.5px solid ${BD}`,
  borderRadius: 10, fontSize: 13, color: T, background: "#fff",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
}

const btn = (variant: "green" | "gray" | "red" | "blue"): React.CSSProperties => ({
  padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 700, transition: "all .12s", whiteSpace: "nowrap",
  background:
    variant === "green" ? G :
    variant === "red"   ? "#FEE2E2" :
    variant === "blue"  ? "#EFF6FF" :
    "#F3F4F6",
  color:
    variant === "green" ? "#fff" :
    variant === "red"   ? RED :
    variant === "blue"  ? "#3B82F6" :
    T,
})

function Badge({ label, color }: { label: string; color: string }) {
  const map: Record<string, { bg: string; fg: string; border: string }> = {
    green:  { bg: GL,       fg: G,        border: GB },
    gray:   { bg: "#F3F4F6", fg: M,       border: BD },
    blue:   { bg: "#EFF6FF", fg: "#3B82F6", border: "#BFDBFE" },
    red:    { bg: "#FEF2F2", fg: RED,      border: "#FECACA" },
    yellow: { bg: "#FFFBEB", fg: "#D97706", border: "#FDE68A" },
  }
  const c = map[color] || map.gray
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
      background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      letterSpacing: .3,
    }}>
      {label}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = T }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: "-.5px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: M, fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: M, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [secret, setSecret]     = useState("")
  const [authed, setAuthed]     = useState(false)
  const [authError, setAuthError] = useState("")
  const [tab, setTab]           = useState<Tab>("zentrale")

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading]   = useState(false)
  const [search, setSearch]     = useState("")
  const [filter, setFilter]     = useState<"all" | "active" | "paused" | "addon">("all")

  // Inline edit state: { [companyId]: { field: value } }
  const [editing, setEditing]   = useState<Record<string, Partial<Company>>>({})
  const [saving, setSaving]     = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Create
  const [newName, setNewName]   = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newAddon, setNewAddon] = useState(false)
  const [creating, setCreating] = useState(false)
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
    setAuthError("")
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

  async function applyUpdate(companyId: string, updates: Partial<Company>) {
    setSaving(companyId)
    const res = await fetch("/api/admin/update-company", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ companyId, updates }),
    })
    const json = await res.json()
    setSaving(null)
    if (json.success) {
      showToast("Gespeichert ✓")
      setEditing(prev => { const n = { ...prev }; delete n[companyId]; return n })
      loadCompanies()
    } else {
      showToast(json.error || "Fehler", false)
    }
  }

  async function quickUpdate(companyId: string, updates: Partial<Company>) {
    const res = await fetch("/api/admin/update-company", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ companyId, updates }),
    })
    const json = await res.json()
    if (json.success) { showToast("Gespeichert ✓"); loadCompanies() }
    else showToast(json.error || "Fehler", false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true); setCreateError(""); setCreateResult(null)
    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone }),
    })
    const json = await res.json()
    setCreating(false)
    if (json.error) {
      setCreateError(json.error)
    } else {
      setCreateResult(json)
      // If add-on selected, activate it now
      if (newAddon && json.userId) {
        await quickUpdate(json.userId, { booking_addon: true })
      }
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewAddon(false)
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const activeCount  = companies.filter(c => !c.paused).length
  const addonCount   = companies.filter(c => c.booking_addon).length
  const totalSMS     = companies.reduce((s, c) => s + (c.sms_count || 0), 0)
  const totalAppts   = companies.reduce((s, c) => s + (c.appointments || 0), 0)

  // Rough MRR: active companies × base price (estimate — no real price data stored)
  // We just show active count × €40 as placeholder label
  const mrrEstimate  = activeCount * 40

  const filtered = companies
    .filter(c => {
      if (filter === "active") return !c.paused
      if (filter === "paused") return c.paused
      if (filter === "addon")  return c.booking_addon
      return true
    })
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.slug || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 24, padding: "44px 36px", width: "100%", maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🛡️</div>
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.5px" }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
          </span>
          <p style={{ fontSize: 13, color: M, marginTop: 4 }}>Admin-Kommandozentrale</p>
        </div>
        {authError && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: RED }}>
            ⚠️ {authError}
          </div>
        )}
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
            placeholder="Admin-Passwort" style={{ ...inp, fontSize: 14, padding: "13px 16px" }} autoFocus />
          <button type="submit" style={{ ...btn("green"), padding: "13px", fontSize: 14 }}>
            Einloggen →
          </button>
        </form>
      </div>
    </div>
  )

  // ── Main Admin UI ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: BG, fontFamily: "'Inter','Manrope',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.ok ? G : RED, color: "#fff",
          padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "fadeIn .2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <div style={{
        background: "#fff", borderBottom: `1px solid ${BD}`,
        padding: "0 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
        height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-.4px", flexShrink: 0 }}>
            <span style={{ color: G }}>Termin</span>
            <span style={{ color: T }}>Stop</span>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, background: RED, padding: "2px 7px", borderRadius: 20, marginLeft: 8, letterSpacing: .3 }}>
              ADMIN
            </span>
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {([
              ["zentrale",  "📊 Zentrale"],
              ["betriebe",  "🏢 Betriebe"],
              ["create",    "➕ Neu anlegen"],
              ["coldcall",  "📞 Cold-Call"],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                background: tab === t ? GL : "transparent",
                color: tab === t ? G : M, transition: "all .12s",
              }}>
                {label}
                {t === "betriebe" && companies.length > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: BD, color: M, padding: "1px 6px", borderRadius: 10 }}>
                    {companies.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={loadCompanies} style={{ ...btn("gray"), fontSize: 11 }}>⟳ Refresh</button>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem("admin_secret") }}
            style={{ fontSize: 12, color: M, background: "none", border: "none", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ══════════════════════════════════════════════════════════════════
            TAB: ZENTRALE
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "zentrale" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 4px", letterSpacing: "-.5px" }}>
                Kommandozentrale 🛡️
              </h1>
              <p style={{ fontSize: 13, color: M, margin: 0 }}>Alles auf einen Blick.</p>
            </div>

            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
              <StatCard icon="🏢" label="Betriebe gesamt"  value={companies.length} />
              <StatCard icon="✅" label="Aktiv"             value={activeCount}  color={G} />
              <StatCard icon="⏸️" label="Pausiert"          value={companies.length - activeCount} color={companies.length - activeCount > 0 ? "#D97706" : M} />
              <StatCard icon="🔖" label="Mit Buchungs-Add-on" value={addonCount} color="#3B82F6" sub={`${Math.round(addonCount / (companies.length || 1) * 100)}% aller Betriebe`} />
              <StatCard icon="📱" label="SMS gesamt"        value={totalSMS.toLocaleString("de")} />
              <StatCard icon="📅" label="Termine gesamt"    value={totalAppts.toLocaleString("de")} />
            </div>

            {/* Revenue estimate banner */}
            <div style={{
              background: `linear-gradient(135deg, ${G} 0%, #15955F 100%)`,
              borderRadius: 20, padding: "24px 28px", marginBottom: 28, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: .8, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>
                  Geschätzter MRR (Richtwert)
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>
                  ~{mrrEstimate.toLocaleString("de")} €
                </div>
                <div style={{ fontSize: 12, opacity: .75, marginTop: 4 }}>
                  Basis: {activeCount} aktive Betriebe × 40 €/Monat — nur ein Richtwert
                </div>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{addonCount}</div>
                  <div style={{ fontSize: 11, opacity: .8, fontWeight: 600 }}>Add-on aktiv</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    {companies.filter(c => {
                      const d = new Date(c.created_at)
                      const now = new Date()
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    }).length}
                  </div>
                  <div style={{ fontSize: 11, opacity: .8, fontWeight: 600 }}>Neu diesen Monat</div>
                </div>
              </div>
            </div>

            {/* Recent signups */}
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T }}>Neueste Betriebe</span>
                <button onClick={() => setTab("betriebe")} style={{ ...btn("gray"), fontSize: 11 }}>
                  Alle anzeigen →
                </button>
              </div>
              {companies.slice(0, 5).map((c, i) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 22px",
                  borderBottom: i < 4 ? `1px solid ${BD}` : "none",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    🏢
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {c.booking_addon && <Badge label="ADD-ON" color="blue" />}
                    {c.paused ? <Badge label="PAUSIERT" color="yellow" /> : <Badge label="AKTIV" color="green" />}
                  </div>
                  <div style={{ fontSize: 11, color: M, flexShrink: 0 }}>
                    {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: BETRIEBE
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "betriebe" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 2px", letterSpacing: "-.4px" }}>Alle Betriebe</h1>
                <p style={{ fontSize: 13, color: M, margin: 0 }}>{filtered.length} von {companies.length} angezeigt</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Name, E-Mail oder Slug …"
                  style={{ ...inp, width: 240 }} />
                {(["all", "active", "paused", "addon"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    ...btn(filter === f ? "green" : "gray"),
                    fontSize: 11,
                    opacity: filter === f ? 1 : .8,
                  }}>
                    {f === "all" ? "Alle" : f === "active" ? "✅ Aktiv" : f === "paused" ? "⏸ Pausiert" : "🔖 Add-on"}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: M, fontSize: 14 }}>Lädt …</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: M, fontSize: 14, background: "#fff", borderRadius: 20, border: `1px solid ${BD}` }}>
                Keine Betriebe gefunden.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(c => {
                  const isExpanded = expanded === c.id
                  const edits = editing[c.id] || {}
                  return (
                    <div key={c.id} style={{
                      background: "#fff", border: `1px solid ${c.paused ? "#FDE68A" : BD}`,
                      borderRadius: 16, overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}>
                      {/* ── Row ── */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", flexWrap: "wrap" }}>

                        {/* Status dot */}
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.paused ? "#FCD34D" : G, flexShrink: 0 }} />

                        {/* Name + Email */}
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: T }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                          {c.slug && (
                            <div style={{ fontSize: 11, color: G, fontWeight: 600 }}>
                              terminstop.de/book/{c.slug}
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                          {[
                            { v: c.appointments, l: "TERMINE" },
                            { v: c.customers,    l: "KUNDEN"  },
                            { v: c.sms_count||0, l: "SMS"     },
                          ].map(s => (
                            <div key={s.l} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 16, fontWeight: 900, color: T }}>{s.v}</div>
                              <div style={{ fontSize: 9, color: M, fontWeight: 700, letterSpacing: .5 }}>{s.l}</div>
                            </div>
                          ))}
                        </div>

                        {/* Badges */}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
                          {c.paused       && <Badge label="PAUSIERT"  color="yellow" />}
                          {c.booking_addon && <Badge label="BUCHUNG"   color="blue"   />}
                          {c.notification_phone && <Badge label="SMS ✓" color="green" />}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {/* Toggle Add-on */}
                          <button
                            onClick={() => quickUpdate(c.id, { booking_addon: !c.booking_addon })}
                            title={c.booking_addon ? "Add-on deaktivieren" : "Add-on aktivieren"}
                            style={{
                              ...btn(c.booking_addon ? "blue" : "gray"),
                              padding: "7px 12px", fontSize: 11,
                            }}>
                            {c.booking_addon ? "🔖 Add-on an" : "🔖 Add-on aus"}
                          </button>

                          {/* Pause/Unpause */}
                          <button
                            onClick={() => quickUpdate(c.id, { paused: !c.paused })}
                            style={{ ...btn(c.paused ? "green" : "gray"), padding: "7px 12px", fontSize: 11 }}>
                            {c.paused ? "▶ Reaktivieren" : "⏸ Pausieren"}
                          </button>

                          {/* Expand/edit */}
                          <button
                            onClick={() => setExpanded(isExpanded ? null : c.id)}
                            style={{ ...btn("gray"), padding: "7px 12px", fontSize: 11 }}>
                            {isExpanded ? "▲ Zuklappen" : "✏️ Bearbeiten"}
                          </button>
                        </div>

                        {/* Joined date */}
                        <div style={{ fontSize: 11, color: M, flexShrink: 0 }}>
                          {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>

                      {/* ── Expand: Inline Edit ── */}
                      {isExpanded && (
                        <div style={{
                          borderTop: `1px solid ${BD}`, background: BG,
                          padding: "20px 22px",
                          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14,
                        }}>
                          {/* Slug */}
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                              Buchungslink-Slug
                            </label>
                            <input
                              value={edits.slug !== undefined ? (edits.slug || "") : (c.slug || "")}
                              onChange={e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], slug: e.target.value } }))}
                              placeholder="z.B. friseur-mueller"
                              style={{ ...inp, fontSize: 12 }}
                            />
                            <div style={{ fontSize: 10, color: M, marginTop: 4 }}>
                              terminstop.de/book/<b>{edits.slug !== undefined ? (edits.slug || "…") : (c.slug || "…")}</b>
                            </div>
                          </div>

                          {/* Phone */}
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                              Benachrichtigungs-Nummer
                            </label>
                            <input
                              value={edits.notification_phone !== undefined ? (edits.notification_phone || "") : (c.notification_phone || "")}
                              onChange={e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], notification_phone: e.target.value } }))}
                              placeholder="+49151…"
                              style={{ ...inp, fontSize: 12 }}
                              type="tel"
                            />
                          </div>

                          {/* Save row */}
                          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                            <button
                              onClick={() => applyUpdate(c.id, edits)}
                              disabled={saving === c.id || Object.keys(edits).length === 0}
                              style={{
                                ...btn("green"), flex: 1,
                                opacity: saving === c.id || Object.keys(edits).length === 0 ? .5 : 1,
                                cursor: Object.keys(edits).length === 0 ? "not-allowed" : "pointer",
                              }}>
                              {saving === c.id ? "Speichert …" : "Speichern ✓"}
                            </button>
                            <button
                              onClick={() => { setEditing(prev => { const n = { ...prev }; delete n[c.id]; return n }); setExpanded(null) }}
                              style={{ ...btn("gray") }}>
                              Abbrechen
                            </button>
                          </div>

                          {/* Info row */}
                          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 8, borderTop: `1px solid ${BD}` }}>
                            <div style={{ fontSize: 11, color: M }}>
                              <b>ID:</b> <span style={{ fontFamily: "monospace", fontSize: 10 }}>{c.id}</span>
                            </div>
                            <div style={{ fontSize: 11, color: M }}>
                              <b>Erstellt:</b> {new Date(c.created_at).toLocaleString("de-DE")}
                            </div>
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

        {/* ══════════════════════════════════════════════════════════════════
            TAB: NEU ANLEGEN
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "create" && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.4px" }}>➕ Neuen Betrieb anlegen</h1>

            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: 13, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
                Nach dem Anlegen bekommt der Betrieb sofort eine <b>SMS mit seinen Login-Daten</b>. Du kannst direkt loslegen.
              </p>

              {createError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 13, color: RED }}>
                  ⚠️ {createError}
                </div>
              )}

              {createResult && (
                <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "20px", marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: G, marginBottom: 14 }}>✓ Betrieb erfolgreich angelegt!</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "E-Mail",    value: createResult.email },
                      { label: "Passwort",  value: createResult.password },
                      { label: "SMS",       value: createResult.smsSent ? "✓ Versendet" : "⚠️ Nicht versendet" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: M, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, minWidth: 70 }}>{row.label}</span>
                        <span style={{ fontSize: 13, color: T, fontWeight: 700, background: "#F9FAFB", padding: "5px 12px", borderRadius: 8, fontFamily: "monospace", flex: 1 }}>
                          {row.value}
                        </span>
                        {row.label !== "SMS" && (
                          <button onClick={() => navigator.clipboard.writeText(row.value || "").then(() => showToast("Kopiert!"))}
                            style={{ ...btn("gray"), padding: "5px 10px", fontSize: 11 }}>
                            Kopieren
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: RED, fontWeight: 600, margin: "12px 0 0" }}>
                    ⚠️ Passwort notieren — wird nur einmal angezeigt!
                  </p>
                </div>
              )}

              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Betriebsname", key: "name", placeholder: "z.B. Friseur Müller", type: "text", value: newName, set: setNewName },
                  { label: "E-Mail (Login)", key: "email", placeholder: "inhaber@betrieb.de", type: "email", value: newEmail, set: setNewEmail },
                  { label: "Handynummer (SMS)", key: "phone", placeholder: "0151 12345678", type: "tel", value: newPhone, set: setNewPhone },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input value={f.value} onChange={e => f.set(e.target.value)}
                      type={f.type} placeholder={f.placeholder} style={inp} required />
                  </div>
                ))}

                {/* Add-on toggle */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: newAddon ? GL : BG, border: `1px solid ${newAddon ? GB : BD}`,
                  borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                  transition: "all .15s",
                }}
                  onClick={() => setNewAddon(!newAddon)}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T }}>🔖 Online-Buchungs-Add-on</div>
                    <div style={{ fontSize: 11, color: M, marginTop: 2 }}>
                      Buchungsseite + Anfragen-Dashboard direkt aktivieren
                    </div>
                  </div>
                  <div style={{
                    width: 44, height: 24, borderRadius: 12, background: newAddon ? G : BD,
                    position: "relative", transition: "all .2s", flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 3,
                      left: newAddon ? 23 : 3, transition: "left .2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }} />
                  </div>
                </div>

                <button type="submit" disabled={creating} style={{
                  ...btn("green"), padding: "14px", fontSize: 14,
                  opacity: creating ? .7 : 1, cursor: creating ? "not-allowed" : "pointer",
                }}>
                  {creating ? "Wird angelegt …" : "Betrieb anlegen + SMS senden →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: COLD-CALL
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "coldcall" && (
          <div style={{ maxWidth: 700 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.4px" }}>📞 Cold-Call Leitfaden</h1>

            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: M, lineHeight: 1.5 }}>
                  Ziel: Name + E-Mail + Nummer → sofort anlegen → Betrieb ist live.
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(COLD_CALL_SCRIPT).then(() => showToast("Kopiert!"))}
                  style={{ ...btn("gray"), flexShrink: 0 }}>
                  📋 Kopieren
                </button>
              </div>

              {/* Sections */}
              {[
                { title: "🟢 Einstieg (5 Sek.)", color: "#ECFDF5", border: "#6EE7B7",
                  text: '"Guten Tag, mein Name ist Marvin von TerminStop.\nIch störe nur kurz – haben Sie 60 Sekunden?"' },
                { title: "🎯 Problem ansprechen (15 Sek.)", color: "#EFF6FF", border: "#BFDBFE",
                  text: '"Wir helfen Betrieben wie Ihrem dabei, Terminausfälle zu reduzieren.\nHaben Sie das Problem, dass Kunden Termine vergessen oder kurzfristig absagen?"' },
                { title: "💡 Lösung (15 Sek.)", color: "#F0FBF6", border: GB,
                  text: '"TerminStop sendet Ihren Kunden automatisch 24 Stunden vor jedem Termin\neine SMS-Erinnerung. Kein Aufwand für Sie – läuft komplett automatisch.\nAb 1,30 € pro Tag."' },
                { title: "⚡ Abschluss (10 Sek.)", color: "#FFFBEB", border: "#FDE68A",
                  text: '"Ich kann Sie in 2 Minuten einrichten –\nich brauche nur Ihren Namen und Ihre E-Mail.\nDarf ich das kurz machen?"' },
                { title: "🔄 Einwand: Kein Interesse", color: "#FEF2F2", border: "#FECACA",
                  text: '"Verstehe ich. Darf ich fragen –\nhaben Sie aktuell ein System für SMS-Erinnerungen\noder läuft das noch manuell?"' },
                { title: "🔄 Einwand: Zu teuer", color: "#FEF2F2", border: "#FECACA",
                  text: '"1,30 € pro Tag – das ist weniger als ein Kaffee.\nUnd wenn nur ein Termin pro Woche nicht ausfällt,\nhat sich\'s schon gerechnet.\nWollen wir\'s einfach mal 2 Wochen kostenlos testen?"' },
              ].map(section => (
                <div key={section.title} style={{
                  background: section.color, border: `1px solid ${section.border}`,
                  borderRadius: 12, padding: "14px 16px", marginBottom: 10,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T, marginBottom: 8, letterSpacing: .2 }}>
                    {section.title}
                  </div>
                  <div style={{ fontSize: 13, color: T, lineHeight: 1.7, whiteSpace: "pre-line", fontStyle: "italic" }}>
                    {section.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-Create CTA */}
            <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: G }}>✓ Anruf erfolgreich?</div>
                <div style={{ fontSize: 13, color: M, marginTop: 2 }}>Betrieb direkt anlegen – dauert 30 Sekunden.</div>
              </div>
              <button onClick={() => setTab("create")} style={{ ...btn("green"), padding: "12px 24px", fontSize: 14 }}>
                ➕ Betrieb anlegen →
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; }
        input:focus { border-color: ${G} !important; box-shadow: 0 0 0 3px ${GL}; }
      `}</style>
    </div>
  )
}
