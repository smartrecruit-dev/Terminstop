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
  id: string; name: string; email: string; paused: boolean
  slug: string | null; booking_addon: boolean
  notification_phone: string | null; sms_count: number
  appointments: number; customers: number; created_at: string
}

type Tab = "zentrale" | "betriebe" | "coldcall" | "notizen"

type PriceRow = { id: string; name: string; price: string; desc: string }

const COLD_CALL_SCRIPT = [
  { title: "1️⃣  Einstieg – Name + Begrüßung", bg: "#ECFDF5", border: "#6EE7B7",
    tip: "Ruhig, freundlich, klar. Warte bis die Person ihren Namen sagt.",
    text: '"Schönen guten Tag, mein Name ist Marvin Passe – ich grüße Sie herzlich!"',
    sub: '→ Person sagt ihren Namen\n→ Du: "Frau / Herr [Name], schön, dass Sie rangehen."' },
  { title: "2️⃣  Transparenz-Opener – Der Vertrauens-Booster", bg: "#FFFBEB", border: "#FDE68A",
    tip: "Hier lachen die meisten – genau das will man. Kurz Pause lassen nach dem Lachen.",
    text: '"Ich muss direkt ehrlich zu Ihnen sein – das ist ein Akquiseanruf. 😄\nMöchten Sie jetzt gleich auflegen … oder geben Sie mir 30 Sekunden,\num Ihnen zu erklären worum es geht?"',
    sub: '→ Fast alle sagen "Na gut, 30 Sekunden" – dann direkt in den Pitch.' },
  { title: "3️⃣  Der 30-Sekunden-Pitch", bg: "#EFF6FF", border: "#BFDBFE",
    tip: "Konkret bleiben. Kein Fachjargon. Auf die Uhr schauen – wirklich 30 Sek.",
    text: '"Wir helfen kleinen Betrieben – Friseuren, Kosmetikstudios, Praxen –\ndabei, dass Kunden ihre Termine nicht mehr vergessen.\nTerminStop sendet automatisch eine SMS-Erinnerung, 24 Stunden vorher.\nKein Aufwand, keine App, läuft komplett im Hintergrund.\nAb unter 2 Euro am Tag."' },
  { title: "4️⃣  Qualifizieren – Haben die das Problem?", bg: GL, border: GB,
    tip: "Fragen stellen statt reden. Wer fragt, führt das Gespräch.",
    text: '"Kennen Sie das – Kunden die einfach nicht erscheinen oder 10 Minuten vorher absagen?"',
    sub: '→ JA: "Genau das lösen wir."\n→ NEIN: "Wie machen Sie das aktuell? Rufen Sie vorher manuell an?"' },
  { title: "5️⃣  Konkret machen – Nutzen zeigen", bg: "#F5F3FF", border: "#DDD6FE",
    tip: "Zahlen wirken. Lass sie kurz rechnen.",
    text: '"Stellen Sie sich vor, nur ein Termin pro Woche fällt nicht mehr aus –\nbei einem Durchschnittsumsatz von 40 € wären das über 160 € mehr im Monat.\nDas System kostet einen Bruchteil davon."' },
  { title: "6️⃣  Abschluss – Nächster Schritt", bg: GL, border: GB,
    tip: "Nicht fragen OB sie wollen – fragen WIE es weitergeht.",
    text: '"Ich richte Sie in 2 Minuten ein – ich brauche nur Ihren Namen,\nIhre E-Mail-Adresse und Ihre Handynummer.\nDann können Sie heute noch loslegen. Darf ich das kurz machen?"' },
  { title: '🔄  Einwand: "Kein Interesse"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Nicht aufgeben – noch eine Frage stellen.",
    text: '"Verstehe ich völlig. Darf ich kurz fragen –\nwie läuft das bei Ihnen aktuell? Rufen Sie Kunden vor dem Termin manuell an,\noder läuft das bei Ihnen problemlos?"',
    sub: '→ Falls manuell: "Das ist ja ganz schön Aufwand – genau das nehmen wir Ihnen ab."' },
  { title: '🔄  Einwand: "Zu teuer"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Perspektive verschieben – vom Preis zum Nutzen.",
    text: '"Das verstehe ich. Wenn ich Ihnen sage: unter 2 Euro am Tag –\ndas ist weniger als eine Tasse Kaffee.\nUnd wenn nur ein Termin pro Woche nicht mehr ausfällt,\nhat sich das schon mehrfach gerechnet.\nWir können auch klein anfangen – einfach testen."' },
  { title: '🔄  Einwand: "Ich muss das erst überlegen"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Verbindlichen nächsten Schritt vereinbaren, nicht einfach auflegen.",
    text: '"Klar, das ist absolut verständlich. Was wäre denn das Konkrete,\nüber das Sie noch nachdenken möchten? Vielleicht kann ich das direkt klären.\nOder: Wann passt es Ihnen, dass ich kurz nochmal anrufe?"' },
  { title: "✅  Ziel des Anrufs", bg: GL, border: GB, tip: "",
    text: "Name + E-Mail + Handynummer → direkt in Supabase anlegen → Betrieb ist sofort live.\nDer Kunde bekommt von dir eine E-Mail mit den Login-Daten." },
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
  const map = { green: { bg: GL, fg: G, border: GB }, gray: { bg: "#F3F4F6", fg: M, border: BD }, blue: { bg: "#EFF6FF", fg: "#3B82F6", border: "#BFDBFE" }, red: { bg: "#FEF2F2", fg: RED, border: "#FECACA" }, yellow: { bg: "#FFFBEB", fg: "#D97706", border: "#FDE68A" } }
  const c = map[color]
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: c.bg, color: c.fg, border: `1px solid ${c.border}`, letterSpacing: .3 }}>{label}</span>
}

function CopyBtn({ text, label = "Kopieren" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
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
  const [loadError, setLoadError] = useState("")
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<"all" | "active" | "paused" | "addon">("all")
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [edits, setEdits]         = useState<Record<string, Partial<Company>>>({})
  const [saving, setSaving]       = useState<string | null>(null)

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Sales Tracker
  type SalesEntry = { anrufe: number; gespraeche: number; termine: number; closes: number }
  const todayKey = new Date().toISOString().split("T")[0]
  const [salesLog, setSalesLog] = useState<Record<string, SalesEntry>>({})
  const [salesDate, setSalesDate] = useState(todayKey)

  useEffect(() => {
    try {
      const s = localStorage.getItem("admin_sales")
      if (s) setSalesLog(JSON.parse(s))
    } catch {}
  }, [])

  function getSalesEntry(date: string): SalesEntry {
    return salesLog[date] || { anrufe: 0, gespraeche: 0, termine: 0, closes: 0 }
  }

  function updateSales(date: string, field: keyof SalesEntry, val: number) {
    const updated = { ...salesLog, [date]: { ...getSalesEntry(date), [field]: Math.max(0, val) } }
    setSalesLog(updated)
    localStorage.setItem("admin_sales", JSON.stringify(updated))
  }

  function pct(a: number, b: number) {
    if (!b) return "—"
    return Math.round((a / b) * 100) + " %"
  }

  // Notizen
  const [notes, setNotes]           = useState("")
  const [prices, setPrices]         = useState<PriceRow[]>([])
  const [newPriceName, setNewPriceName]   = useState("")
  const [newPricePrice, setNewPricePrice] = useState("")
  const [newPriceDesc, setNewPriceDesc]   = useState("")
  const [notesSaved, setNotesSaved] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret")
    if (saved) { setSecret(saved); setAuthed(true) }
  }, [])

  useEffect(() => { if (authed) loadCompanies() }, [authed])

  // Notizen aus localStorage laden
  useEffect(() => {
    try {
      const n = localStorage.getItem("admin_notes")
      const p = localStorage.getItem("admin_prices")
      if (n) setNotes(n)
      if (p) setPrices(JSON.parse(p))
    } catch {}
  }, [])

  function saveNotes(n: string) {
    setNotes(n)
    localStorage.setItem("admin_notes", n)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 1500)
  }

  function savePrices(p: PriceRow[]) {
    setPrices(p)
    localStorage.setItem("admin_prices", JSON.stringify(p))
  }

  function addPrice() {
    if (!newPriceName.trim()) return
    const row: PriceRow = { id: Date.now().toString(), name: newPriceName.trim(), price: newPricePrice.trim(), desc: newPriceDesc.trim() }
    savePrices([...prices, row])
    setNewPriceName(""); setNewPricePrice(""); setNewPriceDesc("")
  }

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
    setLoading(true); setLoadError("")
    const res = await fetch("/api/admin/companies", { headers: { "x-admin-secret": secret } })
    if (res.status === 401) {
      setAuthed(false)
      sessionStorage.removeItem("admin_secret")
      setAuthError("Falsches Passwort.")
      setLoading(false); return
    }
    const json = await res.json()
    if (json.error) { setLoadError(json.error); setLoading(false); return }
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
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: "100dvh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 24, padding: "44px 36px", width: "100%", maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}><span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span></div>
          <div style={{ fontSize: 13, color: M, marginTop: 4 }}>Admin-Kommandozentrale</div>
        </div>
        {authError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: RED }}>⚠️ {authError}</div>}
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
            placeholder="Admin-Passwort" style={{ ...inp, fontSize: 15, padding: "14px 16px" }} autoFocus />
          <button type="submit" style={{ ...btnStyle("green"), padding: "14px", fontSize: 15 }}>Einloggen →</button>
        </form>
      </div>
    </div>
  )

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: BG, fontFamily: "'Inter','Manrope',sans-serif" }}>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.ok ? G : RED, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
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
              ["coldcall", "📞 Cold-Call"],
              ["notizen",  "📝 Notizen"],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                background: tab === t ? GL : "transparent",
                color: tab === t ? G : M,
              }}>
                {label}
                {t === "betriebe" && companies.length > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 10, background: BD, color: M, padding: "1px 6px", borderRadius: 10 }}>{companies.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={loadCompanies} style={{ ...btnStyle("gray"), fontSize: 11 }}>⟳ Refresh</button>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem("admin_secret") }}
            style={{ fontSize: 12, color: M, background: "none", border: "none", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ════ ZENTRALE ════ */}
        {tab === "zentrale" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.5px" }}>Kommandozentrale 🛡️</h1>

            {/* MRR Banner */}
            <div style={{ background: `linear-gradient(135deg, ${G}, #15955F)`, borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: .8, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Geschätzter MRR</div>
                <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>~{(activeCount * 40).toLocaleString("de")} €</div>
                <div style={{ fontSize: 12, opacity: .75, marginTop: 4 }}>{activeCount} aktive Betriebe × 40 € – Richtwert</div>
              </div>
              <div style={{ display: "flex", gap: 28 }}>
                {[{ v: thisMonth, l: "Neu diesen Monat" }, { v: addonCount, l: "Mit Add-on" }, { v: companies.length - activeCount, l: "Pausiert" }].map(s => (
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
                { icon: "🏢", label: "Betriebe gesamt",  value: companies.length,               color: T },
                { icon: "✅", label: "Aktiv",             value: activeCount,                    color: G },
                { icon: "🔖", label: "Buchungs-Add-on",  value: addonCount,                     color: "#3B82F6" },
                { icon: "📱", label: "SMS gesamt",        value: totalSMS.toLocaleString("de"),  color: T },
                { icon: "📅", label: "Termine gesamt",   value: totalAppts.toLocaleString("de"), color: T },
                { icon: "👥", label: "Kunden gesamt",    value: totalCusts.toLocaleString("de"), color: T },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: k.color, letterSpacing: "-.5px", lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: M, fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: .4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* ── Sales Tracker ── */}
            {(() => {
              const entry = getSalesEntry(salesDate)
              const allDates = Object.keys(salesLog).sort((a, b) => b.localeCompare(a))
              const totalAnrufe     = allDates.reduce((s, d) => s + salesLog[d].anrufe, 0)
              const totalGespraeche = allDates.reduce((s, d) => s + salesLog[d].gespraeche, 0)
              const totalTermine    = allDates.reduce((s, d) => s + salesLog[d].termine, 0)
              const totalCloses     = allDates.reduce((s, d) => s + salesLog[d].closes, 0)

              const metrics = [
                { key: "anrufe"     as keyof SalesEntry, label: "📞 Anrufe",       color: "#6B7280", bg: "#F9FAFB" },
                { key: "gespraeche" as keyof SalesEntry, label: "💬 Gespräche",    color: "#3B82F6", bg: "#EFF6FF" },
                { key: "termine"    as keyof SalesEntry, label: "📅 Termine",      color: "#D97706", bg: "#FFFBEB" },
                { key: "closes"     as keyof SalesEntry, label: "✅ Closes",       color: G,         bg: GL },
              ]

              return (
                <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 20 }}>
                  <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: T }}>📊 Sales-Auswertung</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: M }}>Datum:</span>
                      <input type="date" value={salesDate} onChange={e => setSalesDate(e.target.value)}
                        style={{ ...inp, width: "auto", padding: "6px 10px", fontSize: 12 }} />
                    </div>
                  </div>

                  <div style={{ padding: "20px 22px" }}>
                    {/* Eingabe-Zeile */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                      {metrics.map(m => (
                        <div key={m.key} style={{ background: m.bg, border: `1px solid ${BD}`, borderRadius: 14, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>{m.label}</div>
                          <input
                            type="number" min={0} value={entry[m.key] || ""}
                            onChange={e => updateSales(salesDate, m.key, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            style={{ width: "100%", border: `1.5px solid ${BD}`, borderRadius: 9, padding: "8px 10px", fontSize: 22, fontWeight: 900, color: m.color, background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const, textAlign: "center" as const }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Conversion-Funnel */}
                    <div style={{ background: BG, borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: T, textTransform: "uppercase", letterSpacing: .4, marginBottom: 14 }}>Conversion-Funnel — {salesDate}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                        {[
                          { label: "Anrufe",     value: entry.anrufe,     color: "#6B7280", bg: "#F3F4F6" },
                          { label: "Gespräche",  value: entry.gespraeche, color: "#3B82F6", bg: "#DBEAFE", rate: pct(entry.gespraeche, entry.anrufe) },
                          { label: "Termine",    value: entry.termine,    color: "#D97706", bg: "#FDE68A", rate: pct(entry.termine, entry.gespraeche) },
                          { label: "Closes",     value: entry.closes,     color: G,         bg: GB,        rate: pct(entry.closes, entry.termine) },
                        ].map((step, i) => (
                          <div key={step.label} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                            <div style={{ flex: 1, textAlign: "center", background: step.bg, borderRadius: 12, padding: "12px 8px" }}>
                              <div style={{ fontSize: 28, fontWeight: 900, color: step.color, lineHeight: 1 }}>{step.value}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginTop: 4 }}>{step.label}</div>
                            </div>
                            {i < 3 && (
                              <div style={{ textAlign: "center", padding: "0 6px", flexShrink: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: step.rate === "—" ? M : G }}>{step.rate}</div>
                                <div style={{ fontSize: 16, color: BD }}>→</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Gesamtquote */}
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BD}`, display: "flex", gap: 24, flexWrap: "wrap" }}>
                        {[
                          { label: "Gesamt-Closequote", value: pct(entry.closes, entry.anrufe) },
                          { label: "Gespräche / Anruf", value: pct(entry.gespraeche, entry.anrufe) },
                          { label: "Termin / Gespräch", value: pct(entry.termine, entry.gespraeche) },
                          { label: "Close / Termin",    value: pct(entry.closes, entry.termine) },
                        ].map(s => (
                          <div key={s.label}>
                            <div style={{ fontSize: 10, color: M, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{s.label}</div>
                            <div style={{ fontSize: 18, fontWeight: 900, color: s.value === "—" ? M : G }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gesamtübersicht aller Tage */}
                    {allDates.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T, textTransform: "uppercase", letterSpacing: .4, marginBottom: 10 }}>Gesamt-Auswertung ({allDates.length} Tage)</div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", background: `linear-gradient(135deg, ${G}, #15955F)`, borderRadius: 14, padding: "16px 20px" }}>
                          {[
                            { label: "Anrufe",    value: totalAnrufe },
                            { label: "Gespräche", value: totalGespraeche },
                            { label: "Termine",   value: totalTermine },
                            { label: "Closes",    value: totalCloses },
                            { label: "Ø Closequote", value: pct(totalCloses, totalAnrufe) },
                          ].map(s => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .3, marginTop: 3 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                        {/* Letzte 5 Tage */}
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                          {allDates.slice(0, 5).map(d => {
                            const e = salesLog[d]
                            return (
                              <div key={d} onClick={() => setSalesDate(d)}
                                style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 14px", borderRadius: 10, background: d === salesDate ? GL : "transparent", cursor: "pointer", border: `1px solid ${d === salesDate ? GB : "transparent"}` }}>
                                <span style={{ fontSize: 12, color: M, fontWeight: 600, minWidth: 90 }}>{new Date(d).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}</span>
                                {[{ l: "📞", v: e.anrufe }, { l: "💬", v: e.gespraeche }, { l: "📅", v: e.termine }, { l: "✅", v: e.closes }].map(x => (
                                  <span key={x.l} style={{ fontSize: 12, color: T, fontWeight: 700 }}>{x.l} {x.v}</span>
                                ))}
                                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: G }}>{pct(e.closes, e.anrufe)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Neueste Betriebe */}
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T }}>Neueste Betriebe</span>
                <button onClick={() => setTab("betriebe")} style={{ ...btnStyle("gray"), fontSize: 11 }}>Alle anzeigen →</button>
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: M }}>Lädt …</div>
              ) : loadError ? (
                <div style={{ padding: 24, color: RED, fontSize: 13 }}>⚠️ Fehler: {loadError}</div>
              ) : companies.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: M, fontSize: 13 }}>Keine Betriebe gefunden. Passwort korrekt?</div>
              ) : companies.slice(0, 8).map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i < Math.min(7, companies.length - 1) ? `1px solid ${BD}` : "none" }}>
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

        {/* ════ BETRIEBE ════ */}
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
            ) : loadError ? (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: 24, color: RED, fontSize: 13 }}>
                ⚠️ {loadError} — Passwort prüfen oder Vercel Env-Vars kontrollieren.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(c => {
                  const isOpen = expanded === c.id
                  const e = edits[c.id] || {}
                  const val = (field: keyof Company) => (field in e ? e[field] : c[field]) as any

                  return (
                    <div key={c.id} style={{ background: "#fff", border: `1px solid ${c.paused ? "#FDE68A" : BD}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", flexWrap: "wrap" }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: c.paused ? "#FCD34D" : G, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: T }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                          {c.slug && <div style={{ fontSize: 11, color: G, fontWeight: 600 }}>/{c.slug}</div>}
                        </div>
                        <div style={{ display: "flex", gap: 18 }}>
                          {[{ v: c.appointments, l: "Termine" }, { v: c.customers, l: "Kunden" }, { v: c.sms_count || 0, l: "SMS" }].map(s => (
                            <div key={s.l} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 15, fontWeight: 900, color: T }}>{s.v}</div>
                              <div style={{ fontSize: 9, color: M, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{s.l}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {c.paused && <Badge label="PAUSIERT" color="yellow" />}
                          {c.booking_addon && <Badge label="BUCHUNG" color="blue" />}
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
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

                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${BD}`, background: BG, padding: "20px 20px 24px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Betriebsname</label>
                              <input value={val("name") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], name: ev.target.value } }))} style={{ ...inp, fontSize: 12 }} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Telefon</label>
                              <input value={val("notification_phone") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], notification_phone: ev.target.value } }))} placeholder="+49151…" style={{ ...inp, fontSize: 12 }} type="tel" />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>Slug</label>
                              <input value={val("slug") || ""} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], slug: ev.target.value } }))} placeholder="friseur-mueller" style={{ ...inp, fontSize: 12 }} />
                              {(val("slug") || c.slug) && <div style={{ fontSize: 10, color: G, marginTop: 3 }}>terminstop.de/book/{val("slug") || c.slug}</div>}
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>SMS-Zähler</label>
                              <input value={val("sms_count") ?? c.sms_count} onChange={ev => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], sms_count: parseInt(ev.target.value) || 0 } }))} type="number" min={0} style={{ ...inp, fontSize: 12 }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                            {[{ key: "booking_addon", label: "🔖 Buchungs-Add-on" }, { key: "paused", label: "⏸ Konto pausiert" }].map(toggle => {
                              const isOn = val(toggle.key as keyof Company) as boolean
                              return (
                                <div key={toggle.key} onClick={() => setEdits(p => ({ ...p, [c.id]: { ...p[c.id], [toggle.key]: !isOn } }))}
                                  style={{ display: "flex", alignItems: "center", gap: 10, background: isOn ? GL : "#fff", border: `1px solid ${isOn ? GB : BD}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", transition: "all .15s" }}>
                                  <div style={{ width: 38, height: 20, borderRadius: 10, background: isOn ? G : BD, position: "relative", transition: "background .2s", flexShrink: 0 }}>
                                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: isOn ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: isOn ? G : M }}>{toggle.label}</span>
                                </div>
                              )
                            })}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                            <button onClick={() => saveEdits(c.id)} disabled={saving === c.id || Object.keys(e).length === 0}
                              style={{ ...btnStyle("green"), opacity: Object.keys(e).length === 0 ? .5 : 1, cursor: Object.keys(e).length === 0 ? "not-allowed" : "pointer" }}>
                              {saving === c.id ? "Speichert …" : "💾 Speichern"}
                            </button>
                            <button onClick={() => { setEdits(p => { const n = { ...p }; delete n[c.id]; return n }); setExpanded(null) }} style={btnStyle("gray")}>Abbrechen</button>
                          </div>
                          <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 12, padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 24px" }}>
                            {[{ label: "User-ID", value: c.id }, { label: "E-Mail", value: c.email }, { label: "Erstellt", value: new Date(c.created_at).toLocaleString("de-DE") }, { label: "Termine", value: String(c.appointments) }, { label: "Kunden", value: String(c.customers) }, { label: "SMS", value: String(c.sms_count || 0) }].map(row => (
                              <div key={row.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: M, fontWeight: 700, minWidth: 75 }}>{row.label}:</span>
                                <span style={{ fontSize: 11, color: T, fontFamily: row.label === "User-ID" ? "monospace" : "inherit", wordBreak: "break-all" }}>{row.value}</span>
                                {(row.label === "User-ID" || row.label === "E-Mail") && <CopyBtn text={row.value} label="⎘" />}
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

        {/* ════ COLD-CALL ════ */}
        {tab === "coldcall" && (
          <div style={{ maxWidth: 680 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 20px", letterSpacing: "-.4px" }}>📞 Cold-Call Leitfaden</h1>
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <CopyBtn text={COLD_CALL_SCRIPT.map(s => `${s.title}\n${s.text}`).join("\n\n")} label="📋 Alles kopieren" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {COLD_CALL_SCRIPT.map(s => (
                  <div key={s.title} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: T, marginBottom: s.tip ? 8 : 10, letterSpacing: .2, textTransform: "uppercase" }}>{s.title}</div>
                    {s.tip && (
                      <div style={{ fontSize: 11, color: M, fontStyle: "italic", background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "6px 10px", marginBottom: 10, borderLeft: "3px solid rgba(0,0,0,0.08)" }}>
                        💡 {s.tip}
                      </div>
                    )}
                    <div style={{ fontSize: 14, color: T, lineHeight: 1.75, whiteSpace: "pre-line", fontStyle: "italic", fontWeight: 500 }}>{s.text}</div>
                    {s.sub && (
                      <div style={{ marginTop: 10, fontSize: 12, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line", background: "rgba(255,255,255,0.5)", borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${s.border}` }}>
                        {s.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ NOTIZEN ════ */}
        {tab === "notizen" && (
          <div style={{ maxWidth: 900 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: "0 0 6px", letterSpacing: "-.4px" }}>📝 Notizen & Preistabelle</h1>
            <p style={{ fontSize: 13, color: M, margin: "0 0 24px" }}>Alles was du im Call brauchst – wird lokal gespeichert, bleibt immer da.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

              {/* Notizblock */}
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T }}>📋 Notizblock</span>
                  {notesSaved && <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>✓ Gespeichert</span>}
                </div>
                <textarea
                  value={notes}
                  onChange={e => saveNotes(e.target.value)}
                  placeholder={"Hier kannst du alles reinschreiben:\n– To-dos\n– Gesprächsnotizen\n– Kontakte\n– Ideen\n\nWird automatisch gespeichert."}
                  style={{
                    width: "100%", minHeight: 380, border: "none", outline: "none",
                    padding: "20px", fontSize: 13.5, lineHeight: 1.8,
                    color: T, fontFamily: "'Inter','Manrope',sans-serif",
                    resize: "vertical", background: "#FAFDF9", boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Preistabelle */}
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T }}>💰 Preistabelle</span>
                  <p style={{ fontSize: 12, color: M, margin: "2px 0 0" }}>Pakete & Preise für den Call</p>
                </div>

                {/* Neue Zeile */}
                <div style={{ padding: "16px 20px", background: GL, borderBottom: `1px solid ${GB}`, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8 }}>
                    <input value={newPriceName} onChange={e => setNewPriceName(e.target.value)} placeholder="Paketname (z.B. Basis)" style={{ ...inp, fontSize: 12 }} />
                    <input value={newPricePrice} onChange={e => setNewPricePrice(e.target.value)} placeholder="z.B. 39 €/Mo" style={{ ...inp, fontSize: 12 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <input value={newPriceDesc} onChange={e => setNewPriceDesc(e.target.value)} placeholder="Beschreibung / Leistungen" style={{ ...inp, fontSize: 12 }}
                      onKeyDown={e => e.key === "Enter" && addPrice()} />
                    <button onClick={addPrice} style={{ ...btnStyle("green"), padding: "8px 16px" }}>+ Hinzufügen</button>
                  </div>
                </div>

                {/* Zeilen */}
                <div style={{ minHeight: 200 }}>
                  {prices.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: M, fontSize: 13 }}>
                      Noch keine Einträge. Füge oben deine Pakete hinzu.
                    </div>
                  ) : (
                    prices.map((row, i) => (
                      <div key={row.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px", borderBottom: i < prices.length - 1 ? `1px solid ${BD}` : "none", transition: "background .12s" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: T }}>{row.name}</span>
                            {row.price && (
                              <span style={{ fontSize: 12, fontWeight: 700, color: G, background: GL, border: `1px solid ${GB}`, borderRadius: 8, padding: "2px 10px" }}>{row.price}</span>
                            )}
                          </div>
                          {row.desc && <div style={{ fontSize: 12, color: M, lineHeight: 1.5 }}>{row.desc}</div>}
                        </div>
                        <button onClick={() => savePrices(prices.filter(p => p.id !== row.id))}
                          style={{ fontSize: 11, color: RED, background: "#FEF2F2", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer", flexShrink: 0 }}>
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {prices.length > 0 && (
                  <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end" }}>
                    <CopyBtn text={prices.map(r => `${r.name}${r.price ? " – " + r.price : ""}${r.desc ? "\n  " + r.desc : ""}`).join("\n\n")} label="📋 Tabelle kopieren" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`* { box-sizing: border-box; } input:focus, textarea:focus { border-color: ${G} !important; }`}</style>
    </div>
  )
}
