"use client"

import { useEffect, useState } from "react"

const G  = "#18A66D"
const GL = "#F0FBF6"
const GB = "#D1F5E3"
const T  = "#111827"
const M  = "#6B7280"
const BD = "#E5E7EB"
const BG = "#F9FAFB"

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

type Tab = "overview" | "create" | "coldcall"

const COLD_CALL_SCRIPT = `📞 COLD-CALL LEITFADEN – TerminStop

──────────────────────────────────────
🟢 EINSTIEG (5 Sek.)
──────────────────────────────────────
"Guten Tag, mein Name ist Marvin von TerminStop.
Ich störe nur kurz – haben Sie 60 Sekunden?"

──────────────────────────────────────
🎯 PROBLEM ANSPRECHEN (15 Sek.)
──────────────────────────────────────
"Wir helfen Betrieben wie Ihrem dabei,
Terminausfälle zu reduzieren.
Haben Sie das Problem, dass Kunden
Termine vergessen oder kurzfristig absagen?"

──────────────────────────────────────
💡 LÖSUNG (15 Sek.)
──────────────────────────────────────
"TerminStop sendet Ihren Kunden
automatisch 24 Stunden vor jedem Termin
eine SMS-Erinnerung.
Kein Aufwand für Sie – läuft komplett automatisch.
Ab 1,30€ pro Tag."

──────────────────────────────────────
⚡ ABSCHLUSS (10 Sek.)
──────────────────────────────────────
"Ich kann Sie in 2 Minuten einrichten –
ich brauche nur Ihren Namen und Ihre E-Mail.
Darf ich das kurz machen?"

──────────────────────────────────────
🔄 EINWAND: "Kein Interesse"
──────────────────────────────────────
"Verstehe ich. Darf ich fragen –
haben Sie aktuell ein System für
SMS-Erinnerungen oder läuft das noch manuell?"

──────────────────────────────────────
🔄 EINWAND: "Zu teuer"
──────────────────────────────────────
"1,30€ pro Tag – das ist weniger als
ein Kaffee. Und wenn nur ein Termin
pro Woche nicht ausfällt, hat sich's
schon gerechnet. Wollen wir's einfach
mal 2 Wochen kostenlos testen?"

──────────────────────────────────────
✅ ZIEL DES ANRUFS
──────────────────────────────────────
Name + E-Mail + Handynummer →
Direkt hier unten anlegen →
Betrieb ist sofort live!`

export default function AdminPage() {
  const [secret, setSecret]         = useState("")
  const [authed, setAuthed]         = useState(false)
  const [authError, setAuthError]   = useState("")
  const [tab, setTab]               = useState<Tab>("overview")

  // Overview
  const [companies, setCompanies]   = useState<Company[]>([])
  const [loading, setLoading]       = useState(false)
  const [search, setSearch]         = useState("")

  // Create
  const [newName, setNewName]       = useState("")
  const [newEmail, setNewEmail]     = useState("")
  const [newPhone, setNewPhone]     = useState("")
  const [creating, setCreating]     = useState(false)
  const [createResult, setCreateResult] = useState<any>(null)
  const [createError, setCreateError]   = useState("")

  // Toast
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret")
    if (saved) { setSecret(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    if (authed && tab === "overview") loadCompanies()
  }, [authed, tab])

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) return
    // Wir versuchen gleich einen API-Call — wenn 401 zurückkommt, ist das Passwort falsch
    setAuthed(true)
    sessionStorage.setItem("admin_secret", secret.trim())
    setAuthError("")
  }

  async function loadCompanies() {
    setLoading(true)
    const res = await fetch("/api/admin/companies", {
      headers: { "x-admin-secret": secret }
    })
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

  async function togglePause(c: Company) {
    const res = await fetch("/api/admin/toggle-pause", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ companyId: c.id, paused: !c.paused }),
    })
    const json = await res.json()
    if (json.success) {
      showToast(c.paused ? `${c.name} reaktiviert ✓` : `${c.name} pausiert`, json.ok !== false)
      loadCompanies()
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError("")
    setCreateResult(null)
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
      setNewName(""); setNewEmail(""); setNewPhone("")
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: `1.5px solid ${BD}`,
    borderRadius: 10, fontSize: 14, color: T, background: "#fff",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  }

  const btn = (variant: "green" | "gray" | "red"): React.CSSProperties => ({
    padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 700, transition: "all .15s",
    background: variant === "green" ? G : variant === "red" ? "#FEE2E2" : "#F3F4F6",
    color: variant === "green" ? "#fff" : variant === "red" ? "#DC2626" : T,
  })

  // ── Login Screen ──
  if (!authed) return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "40px 32px", width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-.5px" }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
          </span>
          <p style={{ fontSize: 13, color: M, marginTop: 4 }}>Admin-Cockpit</p>
        </div>
        {authError && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
            ⚠️ {authError}
          </div>
        )}
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password" value={secret} onChange={e => setSecret(e.target.value)}
            placeholder="Admin-Passwort" style={inp} autoFocus
          />
          <button type="submit" style={{ ...btn("green"), padding: "12px" }}>
            Einloggen →
          </button>
        </form>
      </div>
    </div>
  )

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const totalSMS   = companies.reduce((s, c) => s + (c.sms_count || 0), 0)
  const activeCount = companies.filter(c => !c.paused).length

  // ── Admin UI ──
  return (
    <div style={{ minHeight: "100dvh", background: BG, fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.ok ? G : "#DC2626", color: "#fff",
          padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", animation: "fadeIn .2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BD}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-.4px" }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
            <span style={{ fontSize: 11, color: M, fontWeight: 600, marginLeft: 8, background: "#F3F4F6", padding: "2px 8px", borderRadius: 20 }}>Admin</span>
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["overview", "create", "coldcall"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: tab === t ? GL : "transparent",
                color: tab === t ? G : M,
                transition: "all .15s",
              }}>
                {t === "overview" ? "📊 Übersicht" : t === "create" ? "➕ Neu anlegen" : "📞 Cold-Call"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { setAuthed(false); sessionStorage.removeItem("admin_secret") }}
          style={{ fontSize: 12, color: M, background: "none", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Betriebe gesamt", value: companies.length, icon: "🏢" },
                { label: "Aktiv", value: activeCount, icon: "✅" },
                { label: "Pausiert", value: companies.length - activeCount, icon: "⏸️" },
                { label: "SMS gesamt", value: totalSMS.toLocaleString("de"), icon: "📱" },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: T, letterSpacing: "-.5px" }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: M, fontWeight: 600 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Search + Refresh */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Betrieb oder E-Mail suchen …" style={{ ...inp, maxWidth: 320 }} />
              <button onClick={loadCompanies} style={btn("gray")}>
                🔄 Aktualisieren
              </button>
            </div>

            {/* Companies Table */}
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: M }}>Lädt …</div>
            ) : (
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: M, fontSize: 14 }}>Keine Betriebe gefunden.</div>
                ) : filtered.map((c, i) => (
                  <div key={c.id} style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${BD}` : "none",
                    background: c.paused ? "#FAFAFA" : "#fff",
                    flexWrap: "wrap",
                  }}>
                    {/* Status dot */}
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.paused ? "#D1D5DB" : G, flexShrink: 0 }} />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: c.paused ? M : T }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: M, marginTop: 2 }}>{c.email}</div>
                      {c.slug && <div style={{ fontSize: 11, color: G, marginTop: 1 }}>/{c.slug}</div>}
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: T }}>{c.appointments}</div>
                        <div style={{ fontSize: 10, color: M, fontWeight: 600 }}>TERMINE</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: T }}>{c.customers}</div>
                        <div style={{ fontSize: 10, color: M, fontWeight: 600 }}>KUNDEN</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: T }}>{c.sms_count || 0}</div>
                        <div style={{ fontSize: 10, color: M, fontWeight: 600 }}>SMS</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                      {c.paused && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: "#F3F4F6", color: M, padding: "3px 8px", borderRadius: 20 }}>PAUSIERT</span>
                      )}
                      {c.booking_addon && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: GL, color: G, border: `1px solid ${GB}`, padding: "3px 8px", borderRadius: 20 }}>BUCHUNG</span>
                      )}
                      {c.notification_phone && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: "#EFF6FF", color: "#3B82F6", border: "1px solid #BFDBFE", padding: "3px 8px", borderRadius: 20 }}>SMS ✓</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => togglePause(c)} style={btn(c.paused ? "green" : "gray")}>
                        {c.paused ? "▶ Reaktivieren" : "⏸ Pausieren"}
                      </button>
                    </div>

                    {/* Joined */}
                    <div style={{ fontSize: 11, color: M, flexShrink: 0 }}>
                      {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── NEUEN BETRIEB ANLEGEN ── */}
        {tab === "create" && (
          <div style={{ maxWidth: 520 }}>
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: T, margin: "0 0 6px", letterSpacing: "-.4px" }}>➕ Neuen Betrieb anlegen</h2>
              <p style={{ fontSize: 13, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
                Nach dem Anlegen bekommt der Betrieb sofort eine SMS mit seinen Login-Daten.
              </p>

              {createError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626" }}>
                  ⚠️ {createError}
                </div>
              )}

              {createResult && (
                <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "20px", marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: G, marginBottom: 12 }}>✓ Betrieb erfolgreich angelegt!</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Betrieb", value: createResult.message?.split('"')[1] },
                      { label: "E-Mail", value: createResult.email },
                      { label: "Passwort", value: createResult.password },
                      { label: "SMS", value: createResult.smsSent ? "✓ Versendet" : "⚠️ Nicht versendet" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: M, fontWeight: 600, minWidth: 70 }}>{row.label}</span>
                        <span style={{ fontSize: 13, color: T, fontWeight: 600, background: "#F9FAFB", padding: "4px 10px", borderRadius: 8, fontFamily: "monospace" }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: M, margin: "12px 0 0", lineHeight: 1.5 }}>
                    Speichere das Passwort — es wird nur einmal angezeigt.
                  </p>
                </div>
              )}

              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                    Betriebsname
                  </label>
                  <input value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="z.B. Friseur Müller" style={inp} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                    E-Mail (für Login)
                  </label>
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    type="email" placeholder="inhaber@betrieb.de" style={inp} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                    Handynummer (für SMS)
                  </label>
                  <input value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    type="tel" placeholder="0151 12345678" style={inp} required />
                </div>
                <button type="submit" disabled={creating} style={{
                  ...btn("green"), padding: "13px",
                  opacity: creating ? .7 : 1,
                  cursor: creating ? "not-allowed" : "pointer",
                }}>
                  {creating ? "Wird angelegt …" : "Betrieb anlegen + SMS senden →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── COLD CALL ── */}
        {tab === "coldcall" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: T, margin: 0, letterSpacing: "-.4px" }}>📞 Cold-Call Leitfaden</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(COLD_CALL_SCRIPT).then(() => showToast("Kopiert!", true))}
                  style={btn("gray")}>
                  Kopieren
                </button>
              </div>
              <pre style={{
                fontSize: 13, color: T, lineHeight: 1.8, fontFamily: "'Courier New', monospace",
                background: BG, border: `1px solid ${BD}`, borderRadius: 12,
                padding: "20px", whiteSpace: "pre-wrap", wordBreak: "break-word",
                margin: 0,
              }}>
                {COLD_CALL_SCRIPT}
              </pre>

              {/* Quick-Create nach erfolgreichem Call */}
              <div style={{ marginTop: 24, background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "16px 20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: G, margin: "0 0 10px" }}>
                  ✓ Anruf erfolgreich? Betrieb direkt anlegen:
                </p>
                <button onClick={() => setTab("create")} style={{ ...btn("green"), width: "100%", padding: "11px" }}>
                  ➕ Jetzt Betrieb anlegen →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
