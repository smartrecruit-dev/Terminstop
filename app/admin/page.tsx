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

type Tab = "zentrale" | "betriebe" | "coldcall" | "notizen" | "rueckrufe" | "leads"

type LeadStatus = "neu" | "angerufen" | "nicht_erreicht" | "interesse" | "kein_interesse" | "termin" | "kunde"

type Lead = {
  id: string
  name: string
  phone: string
  email: string
  city: string
  category: string
  notiz: string
  status: LeadStatus
  createdAt: string
  updatedAt: string
}

const LEAD_STATUS: Record<LeadStatus, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  neu:             { emoji: "🔵", label: "Neu",              color: "#6B7280", bg: "#F9FAFB", border: BD        },
  angerufen:       { emoji: "📞", label: "Angerufen",        color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  nicht_erreicht:  { emoji: "📵", label: "Nicht erreicht",   color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  interesse:       { emoji: "💬", label: "Interesse",        color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  kein_interesse:  { emoji: "❌", label: "Kein Interesse",   color: M,         bg: "#F3F4F6", border: BD        },
  termin:          { emoji: "📅", label: "Termin vereinbart",color: "#D97706", bg: "#FFF7ED", border: "#FED7AA" },
  kunde:           { emoji: "✅", label: "Kunde geworden",   color: G,         bg: GL,        border: GB        },
}

const LEAD_CATEGORIES = [
  "Kosmetikstudio", "Friseursalon", "Nagelstudio", "Zahnarztpraxis",
  "Physiotherapie", "Massagepraxis", "Yogastudio", "Fitnessstudio",
  "Tattoo-Studio", "Hundesalon", "Heilpraktiker", "Optiker", "Sonstiges",
]

type PriceRow = { id: string; name: string; price: string; desc: string }

type Rückruf = {
  id: string
  name: string
  phone: string
  datum: string
  notiz: string
  status: "offen" | "versucht" | "erledigt" | "kein_interesse"
}

type ScriptBlock = {
  id: string
  title: string
  bg: string
  border: string
  tip: string
  text: string
  sub: string
}

const DEFAULT_SCRIPT: ScriptBlock[] = [
  { id: "1", title: "1️⃣  Einstieg – Name + Begrüßung", bg: "#ECFDF5", border: "#6EE7B7",
    tip: "Ruhig, freundlich, klar. Warte bis die Person ihren Namen sagt.",
    text: '"Schönen guten Tag, mein Name ist Marvin Passe – ich grüße Sie herzlich!"',
    sub: '→ Person sagt ihren Namen\n→ Du: "Frau / Herr [Name], schön, dass Sie rangehen."' },
  { id: "2", title: "2️⃣  Transparenz-Opener – Der Vertrauens-Booster", bg: "#FFFBEB", border: "#FDE68A",
    tip: "Hier lachen die meisten – genau das will man. Kurz Pause lassen nach dem Lachen.",
    text: '"Ich muss direkt ehrlich zu Ihnen sein – das ist ein Akquiseanruf. 😄\nMöchten Sie jetzt gleich auflegen … oder geben Sie mir 30 Sekunden,\num Ihnen zu erklären worum es geht?"',
    sub: '→ Fast alle sagen "Na gut, 30 Sekunden" – dann direkt in den Pitch.' },
  { id: "3", title: "3️⃣  Der 30-Sekunden-Pitch", bg: "#EFF6FF", border: "#BFDBFE",
    tip: "Konkret bleiben. Kein Fachjargon. Auf die Uhr schauen – wirklich 30 Sek.",
    text: '"Wir helfen kleinen Betrieben – Friseuren, Kosmetikstudios, Praxen –\ndabei, dass Kunden ihre Termine nicht mehr vergessen.\nTerminStop sendet automatisch eine SMS-Erinnerung, 24 Stunden vorher.\nKein Aufwand, keine App, läuft komplett im Hintergrund.\nAb unter 2 Euro am Tag."',
    sub: "" },
  { id: "4", title: "4️⃣  Qualifizieren – Haben die das Problem?", bg: GL, border: GB,
    tip: "Fragen stellen statt reden. Wer fragt, führt das Gespräch.",
    text: '"Kennen Sie das – Kunden die einfach nicht erscheinen oder 10 Minuten vorher absagen?"',
    sub: '→ JA: "Genau das lösen wir."\n→ NEIN: "Wie machen Sie das aktuell? Rufen Sie vorher manuell an?"' },
  { id: "5", title: "5️⃣  Konkret machen – Nutzen zeigen", bg: "#F5F3FF", border: "#DDD6FE",
    tip: "Zahlen wirken. Lass sie kurz rechnen.",
    text: '"Stellen Sie sich vor, nur ein Termin pro Woche fällt nicht mehr aus –\nbei einem Durchschnittsumsatz von 40 € wären das über 160 € mehr im Monat.\nDas System kostet einen Bruchteil davon."',
    sub: "" },
  { id: "6", title: "6️⃣  Abschluss – Nächster Schritt", bg: GL, border: GB,
    tip: "Nicht fragen OB sie wollen – fragen WIE es weitergeht.",
    text: '"Ich richte Sie in 2 Minuten ein – ich brauche nur Ihren Namen,\nIhre E-Mail-Adresse und Ihre Handynummer.\nDann können Sie heute noch loslegen. Darf ich das kurz machen?"',
    sub: "" },
  { id: "7", title: '🔄  Einwand: "Kein Interesse"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Nicht aufgeben – noch eine Frage stellen.",
    text: '"Verstehe ich völlig. Darf ich kurz fragen –\nwie läuft das bei Ihnen aktuell? Rufen Sie Kunden vor dem Termin manuell an,\noder läuft das bei Ihnen problemlos?"',
    sub: '→ Falls manuell: "Das ist ja ganz schön Aufwand – genau das nehmen wir Ihnen ab."' },
  { id: "8", title: '🔄  Einwand: "Zu teuer"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Perspektive verschieben – vom Preis zum Nutzen.",
    text: '"Das verstehe ich. Wenn ich Ihnen sage: unter 2 Euro am Tag –\ndas ist weniger als eine Tasse Kaffee.\nUnd wenn nur ein Termin pro Woche nicht mehr ausfällt,\nhat sich das schon mehrfach gerechnet.\nWir können auch klein anfangen – einfach testen."',
    sub: "" },
  { id: "9", title: '🔄  Einwand: "Ich muss das erst überlegen"', bg: "#FEF2F2", border: "#FECACA",
    tip: "Verbindlichen nächsten Schritt vereinbaren, nicht einfach auflegen.",
    text: '"Klar, das ist absolut verständlich. Was wäre denn das Konkrete,\nüber das Sie noch nachdenken möchten? Vielleicht kann ich das direkt klären.\nOder: Wann passt es Ihnen, dass ich kurz nochmal anrufe?"',
    sub: "" },
  { id: "10", title: "✅  Ziel des Anrufs", bg: GL, border: GB,
    tip: "",
    text: "Name + E-Mail + Handynummer → direkt in Supabase anlegen → Betrieb ist sofort live.\nDer Kunde bekommt von dir eine E-Mail mit den Login-Daten.",
    sub: "" },
]

const STATUS_META: Record<Rückruf["status"], { label: string; color: string; bg: string; border: string }> = {
  offen:          { label: "Offen",          color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  versucht:       { label: "Versucht",        color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  erledigt:       { label: "Erledigt ✓",      color: G,         bg: GL,        border: GB       },
  kein_interesse: { label: "Kein Interesse",  color: M,         bg: "#F3F4F6", border: BD       },
}

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", border: `1.5px solid ${BD}`,
  borderRadius: 10, fontSize: 13, color: T, background: "#fff",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
}

const btnStyle = (v: "green" | "gray" | "red" | "blue" | "yellow" | "purple"): React.CSSProperties => ({
  padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 700, transition: "all .12s", whiteSpace: "nowrap",
  background: v === "green" ? G : v === "red" ? "#FEE2E2" : v === "blue" ? "#EFF6FF" : v === "yellow" ? "#FFFBEB" : v === "purple" ? "#F5F3FF" : "#F3F4F6",
  color: v === "green" ? "#fff" : v === "red" ? RED : v === "blue" ? "#3B82F6" : v === "yellow" ? "#D97706" : v === "purple" ? "#7C3AED" : T,
})

function Badge({ label, color }: { label: string; color: "green" | "gray" | "blue" | "red" | "yellow" | "purple" }) {
  const map = {
    green:  { bg: GL,        fg: G,        border: GB       },
    gray:   { bg: "#F3F4F6", fg: M,        border: BD       },
    blue:   { bg: "#EFF6FF", fg: "#3B82F6",border: "#BFDBFE"},
    red:    { bg: "#FEF2F2", fg: RED,       border: "#FECACA"},
    yellow: { bg: "#FFFBEB", fg: "#D97706", border: "#FDE68A"},
    purple: { bg: "#F5F3FF", fg: "#7C3AED", border: "#DDD6FE"},
  }
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

  // ── Sales Tracker ────────────────────────────────────────────────────────
  type SalesEntry = { anrufe: number; gespraeche: number; termine: number; closes: number }
  const todayKey = new Date().toISOString().split("T")[0]
  const [salesLog, setSalesLog] = useState<Record<string, SalesEntry>>({})
  const [salesDate, setSalesDate] = useState(todayKey)

  // ── Cold-Call Skript (editierbar) ────────────────────────────────────────
  const [script, setScript]           = useState<ScriptBlock[]>(DEFAULT_SCRIPT)
  const [scriptEditing, setScriptEditing] = useState(false)
  const [editScript, setEditScript]   = useState<ScriptBlock[]>(DEFAULT_SCRIPT)
  const [newBlock, setNewBlock]       = useState<Partial<ScriptBlock>>({ bg: GL, border: GB })

  // ── Rückruf-Liste ────────────────────────────────────────────────────────
  const [rueckrufe, setRueckrufe]     = useState<Rückruf[]>([])
  const [rfFilter, setRfFilter]       = useState<"alle" | Rückruf["status"]>("alle")
  const [rfOpen, setRfOpen]           = useState<string | null>(null)
  const [newRF, setNewRF]             = useState<Partial<Rückruf>>({ status: "offen", datum: todayKey })

  // ── Leads (manuell) ──────────────────────────────────────────────────────
  const [leads, setLeads]               = useState<Lead[]>([])
  const [leadSearch, setLeadSearch]     = useState("")
  const [leadCityFilter, setLeadCityFilter] = useState("Alle")
  const [leadCatFilter, setLeadCatFilter]   = useState("Alle")
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | "alle">("alle")
  const [leadExpanded, setLeadExpanded] = useState<string | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [newLead, setNewLead]           = useState<Partial<Lead>>({ status: "neu", category: LEAD_CATEGORIES[0] })

  function saveLeads(list: Lead[]) {
    setLeads(list)
    localStorage.setItem("admin_leads", JSON.stringify(list))
  }
  function addLead() {
    if (!newLead.name?.trim()) return
    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name.trim(),
      phone: newLead.phone?.trim() || "",
      email: newLead.email?.trim() || "",
      city: newLead.city?.trim() || "",
      category: newLead.category || LEAD_CATEGORIES[0],
      notiz: newLead.notiz?.trim() || "",
      status: newLead.status || "neu",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveLeads([lead, ...leads])
    setNewLead({ status: "neu", category: newLead.category || LEAD_CATEGORIES[0], city: newLead.city || "" })
    setShowLeadForm(false)
    showToast("Lead hinzugefügt ✓")
  }
  function updateLead(id: string, updates: Partial<Lead>) {
    saveLeads(leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
  }
  function deleteLead(id: string) {
    saveLeads(leads.filter(l => l.id !== id))
  }

  // ── Notizen ──────────────────────────────────────────────────────────────
  const [notes, setNotes]             = useState("")
  const [prices, setPrices]           = useState<PriceRow[]>([])
  const [newPriceName, setNewPriceName]   = useState("")
  const [newPricePrice, setNewPricePrice] = useState("")
  const [newPriceDesc, setNewPriceDesc]   = useState("")
  const [notesSaved, setNotesSaved]   = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret")
    if (saved) { setSecret(saved); setAuthed(true) }
  }, [])

  useEffect(() => { if (authed) loadCompanies() }, [authed])

  useEffect(() => {
    try {
      const s  = localStorage.getItem("admin_sales")
      const n  = localStorage.getItem("admin_notes")
      const p  = localStorage.getItem("admin_prices")
      const sc = localStorage.getItem("admin_script")
      const rf = localStorage.getItem("admin_rueckrufe")
      if (s)  setSalesLog(JSON.parse(s))
      if (n)  setNotes(n)
      if (p)  setPrices(JSON.parse(p))
      if (sc) { const parsed = JSON.parse(sc); setScript(parsed); setEditScript(parsed) }
      if (rf) setRueckrufe(JSON.parse(rf))
      const ld = localStorage.getItem("admin_leads")
      if (ld) setLeads(JSON.parse(ld))
    } catch {}
  }, [])

  // ── Sales helpers ─────────────────────────────────────────────────────────
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

  // ── Skript helpers ────────────────────────────────────────────────────────
  function saveScript() {
    setScript(editScript)
    localStorage.setItem("admin_script", JSON.stringify(editScript))
    setScriptEditing(false)
    showToast("Skript gespeichert ✓")
  }
  function resetScript() {
    setEditScript(DEFAULT_SCRIPT)
    setScript(DEFAULT_SCRIPT)
    localStorage.removeItem("admin_script")
    showToast("Skript zurückgesetzt")
  }
  function updateBlock(id: string, field: keyof ScriptBlock, val: string) {
    setEditScript(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b))
  }
  function addBlock() {
    if (!newBlock.title?.trim() || !newBlock.text?.trim()) return
    const block: ScriptBlock = {
      id: Date.now().toString(),
      title: newBlock.title || "",
      bg: newBlock.bg || GL,
      border: newBlock.border || GB,
      tip: newBlock.tip || "",
      text: newBlock.text || "",
      sub: newBlock.sub || "",
    }
    setEditScript(prev => [...prev, block])
    setNewBlock({ bg: GL, border: GB })
  }
  function removeBlock(id: string) {
    setEditScript(prev => prev.filter(b => b.id !== id))
  }

  // ── Rückruf helpers ───────────────────────────────────────────────────────
  function saveRueckrufe(list: Rückruf[]) {
    setRueckrufe(list)
    localStorage.setItem("admin_rueckrufe", JSON.stringify(list))
  }
  function addRueckruf() {
    if (!newRF.name?.trim() || !newRF.phone?.trim()) return
    const rf: Rückruf = {
      id: Date.now().toString(),
      name: newRF.name.trim(),
      phone: newRF.phone.trim(),
      datum: newRF.datum || todayKey,
      notiz: newRF.notiz || "",
      status: newRF.status || "offen",
    }
    saveRueckrufe([rf, ...rueckrufe])
    setNewRF({ status: "offen", datum: todayKey })
    showToast("Rückruf hinzugefügt ✓")
  }
  function updateRueckruf(id: string, updates: Partial<Rückruf>) {
    saveRueckrufe(rueckrufe.map(r => r.id === id ? { ...r, ...updates } : r))
  }
  function deleteRueckruf(id: string) {
    saveRueckrufe(rueckrufe.filter(r => r.id !== id))
  }

  // ── Notizen helpers ───────────────────────────────────────────────────────
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

  // ── General helpers ───────────────────────────────────────────────────────
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
      setAuthed(false); sessionStorage.removeItem("admin_secret")
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
  const activeCount  = companies.filter(c => !c.paused).length
  const addonCount   = companies.filter(c => c.booking_addon).length
  const totalSMS     = companies.reduce((s, c) => s + (c.sms_count || 0), 0)
  const totalAppts   = companies.reduce((s, c) => s + (c.appointments || 0), 0)
  const totalCusts   = companies.reduce((s, c) => s + (c.customers || 0), 0)
  const thisMonth    = companies.filter(c => {
    const d = new Date(c.created_at), now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const risikoList   = companies.filter(c => !c.paused && c.appointments === 0)
  const topList      = [...companies].sort((a, b) => b.appointments - a.appointments).slice(0, 5)

  const filtered = companies
    .filter(c => filter === "all" ? true : filter === "active" ? !c.paused : filter === "paused" ? c.paused : c.booking_addon)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const rfFiltered = rueckrufe
    .filter(r => rfFilter === "alle" ? true : r.status === rfFilter)
    .sort((a, b) => a.datum.localeCompare(b.datum))

  const offeneRueckrufe = rueckrufe.filter(r => r.status === "offen" || r.status === "versucht").length

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
            <span style={{ color: G }}>Termin</span><span style={{ color: T }}>Stop</span>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, background: RED, padding: "2px 7px", borderRadius: 20, marginLeft: 8 }}>ADMIN</span>
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {([
              ["zentrale",   "📊 Zentrale"],
              ["betriebe",   "🏢 Betriebe"],
              ["coldcall",   "📞 Skript"],
              ["rueckrufe",  "📋 Rückrufe"],
              ["leads",      "🔍 Lead-Finder"],
              ["notizen",    "📝 Notizen"],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: tab === t ? 700 : 500,
                background: tab === t ? GL : "transparent",
                color: tab === t ? G : M, position: "relative",
              }}>
                {label}
                {t === "betriebe" && companies.length > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 10, background: BD, color: M, padding: "1px 6px", borderRadius: 10 }}>{companies.length}</span>
                )}
                {t === "rueckrufe" && offeneRueckrufe > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 10, background: RED, color: "#fff", padding: "1px 6px", borderRadius: 10 }}>{offeneRueckrufe}</span>
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

            {/* Risiko + Top-Performer nebeneinander */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

              {/* Risiko-Betriebe */}
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T }}>Risiko-Betriebe</div>
                    <div style={{ fontSize: 11, color: M }}>Aktiv aber noch 0 Termine eingetragen</div>
                  </div>
                  {risikoList.length > 0 && <span style={{ marginLeft: "auto", background: "#FEF2F2", color: RED, fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 20 }}>{risikoList.length}</span>}
                </div>
                {risikoList.length === 0 ? (
                  <div style={{ padding: "28px 20px", textAlign: "center", color: M, fontSize: 13 }}>
                    {companies.length === 0 ? "Keine Daten geladen" : "✅ Alle aktiven Betriebe haben Termine"}
                  </div>
                ) : (
                  <div style={{ maxHeight: 240, overflowY: "auto" }}>
                    {risikoList.map((c, i) => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: i < risikoList.length - 1 ? `1px solid ${BD}` : "none" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#FCD34D", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: T, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: M }}>{c.email}</div>
                        </div>
                        <div style={{ fontSize: 11, color: M, flexShrink: 0 }}>
                          {new Date(c.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                        </div>
                        <button onClick={() => {
                          setNewRF({ name: c.name, phone: c.notification_phone || "", datum: todayKey, status: "offen", notiz: `Onboarding-Follow-up: ${c.name}` })
                          setTab("rueckrufe")
                        }} style={{ ...btnStyle("yellow"), padding: "4px 10px", fontSize: 10 }}>
                          + Rückruf
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top-Performer */}
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T }}>Top-Performer</div>
                    <div style={{ fontSize: 11, color: M }}>Die 5 aktivsten Betriebe nach Terminen</div>
                  </div>
                </div>
                {topList.length === 0 ? (
                  <div style={{ padding: "28px 20px", textAlign: "center", color: M, fontSize: 13 }}>Keine Daten geladen</div>
                ) : (
                  topList.map((c, i) => {
                    const maxAppts = topList[0].appointments || 1
                    const barPct   = Math.max(6, Math.round((c.appointments / maxAppts) * 100))
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: i < topList.length - 1 ? `1px solid ${BD}` : "none" }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? "#D97706" : M, minWidth: 18, textAlign: "center" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                          <div style={{ height: 5, background: BD, borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${barPct}%`, background: G, borderRadius: 3, transition: "width .4s" }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: T }}>{c.appointments}</div>
                          <div style={{ fontSize: 9, color: M, fontWeight: 700, textTransform: "uppercase" }}>Termine</div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
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
                { key: "anrufe"     as keyof SalesEntry, label: "📞 Anrufe",    color: "#6B7280", bg: "#F9FAFB" },
                { key: "gespraeche" as keyof SalesEntry, label: "💬 Gespräche", color: "#3B82F6", bg: "#EFF6FF" },
                { key: "termine"    as keyof SalesEntry, label: "📅 Termine",   color: "#D97706", bg: "#FFFBEB" },
                { key: "closes"     as keyof SalesEntry, label: "✅ Closes",    color: G,         bg: GL },
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
                          { label: "Anrufe",    value: entry.anrufe,     color: "#6B7280", bg: "#F3F4F6" },
                          { label: "Gespräche", value: entry.gespraeche, color: "#3B82F6", bg: "#DBEAFE", rate: pct(entry.gespraeche, entry.anrufe) },
                          { label: "Termine",   value: entry.termine,    color: "#D97706", bg: "#FDE68A", rate: pct(entry.termine, entry.gespraeche) },
                          { label: "Closes",    value: entry.closes,     color: G,         bg: GB,        rate: pct(entry.closes, entry.termine) },
                        ].map((step, i) => (
                          <div key={step.label} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                            <div style={{ flex: 1, textAlign: "center", background: step.bg, borderRadius: 12, padding: "12px 8px" }}>
                              <div style={{ fontSize: 28, fontWeight: 900, color: step.color, lineHeight: 1 }}>{step.value}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginTop: 4 }}>{step.label}</div>
                            </div>
                            {i < 3 && (
                              <div style={{ textAlign: "center", padding: "0 6px", flexShrink: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: (step as any).rate === "—" ? M : G }}>{(step as any).rate}</div>
                                <div style={{ fontSize: 16, color: BD }}>→</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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

                    {/* Gesamt-Auswertung aller Tage */}
                    {allDates.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: T, textTransform: "uppercase", letterSpacing: .4, marginBottom: 10 }}>Gesamt-Auswertung ({allDates.length} Tage)</div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", background: `linear-gradient(135deg, ${G}, #15955F)`, borderRadius: 14, padding: "16px 20px" }}>
                          {[
                            { label: "Anrufe",       value: totalAnrufe },
                            { label: "Gespräche",    value: totalGespraeche },
                            { label: "Termine",      value: totalTermine },
                            { label: "Closes",       value: totalCloses },
                            { label: "Ø Closequote", value: pct(totalCloses, totalAnrufe) },
                          ].map(s => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .3, marginTop: 3 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
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
                <div style={{ padding: 40, textAlign: "center", color: M, fontSize: 13 }}>Keine Betriebe gefunden.</div>
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
                          {!c.paused && c.appointments === 0 && <Badge label="KEIN TERMIN" color="red" />}
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

        {/* ════ COLD-CALL / SKRIPT ════ */}
        {tab === "coldcall" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: 0, letterSpacing: "-.4px" }}>📞 Cold-Call Skript</h1>
              <div style={{ display: "flex", gap: 8 }}>
                {scriptEditing ? (
                  <>
                    <button onClick={() => { setEditScript(script); setScriptEditing(false) }} style={btnStyle("gray")}>Abbrechen</button>
                    <button onClick={resetScript} style={{ ...btnStyle("red"), fontSize: 11 }}>↩ Standard</button>
                    <button onClick={saveScript} style={btnStyle("green")}>💾 Skript speichern</button>
                  </>
                ) : (
                  <>
                    <CopyBtn text={script.map(s => `${s.title}\n${s.text}`).join("\n\n")} label="📋 Alles kopieren" />
                    <button onClick={() => { setEditScript(script); setScriptEditing(true) }} style={btnStyle("purple")}>✏️ Bearbeiten</button>
                  </>
                )}
              </div>
            </div>

            {scriptEditing ? (
              /* ── EDIT MODE ── */
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {editScript.map((block, idx) => (
                  <div key={block.id} style={{ background: block.bg, border: `2px solid ${block.border}`, borderRadius: 16, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: M, fontWeight: 700 }}>#{idx + 1}</span>
                      <input
                        value={block.title}
                        onChange={e => updateBlock(block.id, "title", e.target.value)}
                        placeholder="Titel des Schritts"
                        style={{ ...inp, fontSize: 13, fontWeight: 800, flex: 1, background: "rgba(255,255,255,0.7)" }}
                      />
                      <button onClick={() => removeBlock(block.id)} style={{ background: "#FEF2F2", color: RED, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✕ Löschen</button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>💡 Coaching-Hinweis (optional)</label>
                      <input value={block.tip} onChange={e => updateBlock(block.id, "tip", e.target.value)} placeholder="Interner Hinweis für dich…" style={{ ...inp, fontSize: 12, background: "rgba(255,255,255,0.7)" }} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Skript-Text (Sprichst du so aus)</label>
                      <textarea value={block.text} onChange={e => updateBlock(block.id, "text", e.target.value)} rows={4}
                        style={{ ...inp, resize: "vertical", fontSize: 13, lineHeight: 1.7, background: "rgba(255,255,255,0.7)", fontStyle: "italic" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Verzweigung / Reaktion (optional)</label>
                      <textarea value={block.sub} onChange={e => updateBlock(block.id, "sub", e.target.value)} rows={2}
                        style={{ ...inp, resize: "vertical", fontSize: 12, lineHeight: 1.6, background: "rgba(255,255,255,0.7)" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 10, color: M, fontWeight: 700, marginBottom: 3 }}>Hintergrund</label>
                        <input type="color" value={block.bg} onChange={e => updateBlock(block.id, "bg", e.target.value)} style={{ height: 32, width: 48, border: "none", borderRadius: 8, cursor: "pointer" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10, color: M, fontWeight: 700, marginBottom: 3 }}>Randfarbe</label>
                        <input type="color" value={block.border} onChange={e => updateBlock(block.id, "border", e.target.value)} style={{ height: 32, width: 48, border: "none", borderRadius: 8, cursor: "pointer" }} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Neuer Block */}
                <div style={{ background: "#fff", border: `2px dashed ${BD}`, borderRadius: 16, padding: "20px" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: M, marginBottom: 12 }}>+ Neuen Schritt hinzufügen</div>
                  <input value={newBlock.title || ""} onChange={e => setNewBlock(p => ({ ...p, title: e.target.value }))} placeholder="Titel" style={{ ...inp, marginBottom: 8 }} />
                  <textarea value={newBlock.text || ""} onChange={e => setNewBlock(p => ({ ...p, text: e.target.value }))} placeholder="Skript-Text …" rows={3}
                    style={{ ...inp, resize: "vertical", marginBottom: 8 }} />
                  <input value={newBlock.tip || ""} onChange={e => setNewBlock(p => ({ ...p, tip: e.target.value }))} placeholder="Coaching-Hinweis (optional)" style={{ ...inp, marginBottom: 8 }} />
                  <input value={newBlock.sub || ""} onChange={e => setNewBlock(p => ({ ...p, sub: e.target.value }))} placeholder="Verzweigung (optional)" style={{ ...inp, marginBottom: 12 }} />
                  <button onClick={addBlock} style={{ ...btnStyle("green") }}>+ Block hinzufügen</button>
                </div>
              </div>
            ) : (
              /* ── VIEW MODE ── */
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {script.map(s => (
                    <div key={s.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
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
            )}
          </div>
        )}

        {/* ════ RÜCKRUFE ════ */}
        {tab === "rueckrufe" && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: 0, letterSpacing: "-.4px" }}>📋 Rückruf-Liste</h1>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {offeneRueckrufe > 0 && <span style={{ fontSize: 13, fontWeight: 800, color: RED }}>{offeneRueckrufe} offen</span>}
              </div>
            </div>
            <p style={{ fontSize: 13, color: M, margin: "0 0 20px" }}>Kontakte die zurückgerufen werden sollen – lokal gespeichert.</p>

            {/* Neuer Rückruf */}
            <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "20px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T, marginBottom: 14 }}>+ Neuen Rückruf eintragen</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input value={newRF.name || ""} onChange={e => setNewRF(p => ({ ...p, name: e.target.value }))} placeholder="Name / Firma" style={{ ...inp, fontSize: 12 }} />
                <input value={newRF.phone || ""} onChange={e => setNewRF(p => ({ ...p, phone: e.target.value }))} placeholder="Telefonnummer" style={{ ...inp, fontSize: 12 }} type="tel" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 10, marginBottom: 10 }}>
                <input type="date" value={newRF.datum || todayKey} onChange={e => setNewRF(p => ({ ...p, datum: e.target.value }))} style={{ ...inp, fontSize: 12 }} />
                <select value={newRF.status || "offen"} onChange={e => setNewRF(p => ({ ...p, status: e.target.value as Rückruf["status"] }))}
                  style={{ ...inp, fontSize: 12, cursor: "pointer" }}>
                  {(Object.keys(STATUS_META) as Rückruf["status"][]).map(s => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
                <input value={newRF.notiz || ""} onChange={e => setNewRF(p => ({ ...p, notiz: e.target.value }))} placeholder="Notiz (optional)"
                  style={{ ...inp, fontSize: 12 }} onKeyDown={e => e.key === "Enter" && addRueckruf()} />
              </div>
              <button onClick={addRueckruf} style={{ ...btnStyle("green") }}>+ Hinzufügen</button>
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {([["alle", "Alle"], ...Object.entries(STATUS_META).map(([k, v]) => [k, v.label])] as [string, string][]).map(([k, label]) => (
                <button key={k} onClick={() => setRfFilter(k as any)} style={{
                  ...btnStyle("gray"), fontSize: 11,
                  background: rfFilter === k ? T : "#F3F4F6",
                  color: rfFilter === k ? "#fff" : T,
                }}>
                  {label}
                  {k !== "alle" && rueckrufe.filter(r => r.status === k).length > 0 && (
                    <span style={{ marginLeft: 5, opacity: .7 }}>{rueckrufe.filter(r => r.status === k).length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Liste */}
            {rfFiltered.length === 0 ? (
              <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "40px 20px", textAlign: "center", color: M, fontSize: 13 }}>
                {rueckrufe.length === 0 ? "Noch keine Rückrufe eingetragen. Fang oben an!" : "Keine Einträge für diesen Filter."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rfFiltered.map(r => {
                  const meta    = STATUS_META[r.status]
                  const isOpen  = rfOpen === r.id
                  const isPast  = r.datum < todayKey
                  const isToday = r.datum === todayKey

                  return (
                    <div key={r.id} style={{ background: "#fff", border: `1px solid ${isToday ? GB : isPast && r.status === "offen" ? "#FECACA" : BD}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", flexWrap: "wrap" }}>
                        {/* Datum-Indikator */}
                        <div style={{ textAlign: "center", background: isToday ? GL : isPast && r.status === "offen" ? "#FEF2F2" : BG, borderRadius: 10, padding: "6px 10px", flexShrink: 0, minWidth: 56 }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: isToday ? G : isPast && r.status === "offen" ? RED : T, lineHeight: 1 }}>
                            {new Date(r.datum + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric" })}
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: M, textTransform: "uppercase" }}>
                            {new Date(r.datum + "T12:00:00").toLocaleDateString("de-DE", { month: "short" })}
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 120 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: T }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: M }}>{r.phone}</div>
                          {r.notiz && <div style={{ fontSize: 11, color: M, marginTop: 2, fontStyle: "italic" }}>{r.notiz}</div>}
                        </div>

                        <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, flexShrink: 0 }}>
                          {meta.label}
                        </span>

                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <a href={`tel:${r.phone}`} style={{ ...btnStyle("green"), textDecoration: "none", padding: "6px 12px", fontSize: 12 }}>📞 Anrufen</a>
                          <button onClick={() => setRfOpen(isOpen ? null : r.id)} style={{ ...btnStyle("gray"), padding: "6px 10px", fontSize: 11 }}>
                            {isOpen ? "▲" : "✏️"}
                          </button>
                          <button onClick={() => deleteRueckruf(r.id)} style={{ ...btnStyle("red"), padding: "6px 10px", fontSize: 11 }}>✕</button>
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${BD}`, background: BG, padding: "16px 18px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                          <div style={{ flex: 1, minWidth: 140 }}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Status</label>
                            <select value={r.status} onChange={e => updateRueckruf(r.id, { status: e.target.value as Rückruf["status"] })}
                              style={{ ...inp, fontSize: 12, cursor: "pointer" }}>
                              {(Object.keys(STATUS_META) as Rückruf["status"][]).map(s => (
                                <option key={s} value={s}>{STATUS_META[s].label}</option>
                              ))}
                            </select>
                          </div>
                          <div style={{ flex: 1, minWidth: 140 }}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Neues Datum</label>
                            <input type="date" value={r.datum} onChange={e => updateRueckruf(r.id, { datum: e.target.value })} style={{ ...inp, fontSize: 12 }} />
                          </div>
                          <div style={{ flex: 2, minWidth: 200 }}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Notiz</label>
                            <input value={r.notiz} onChange={e => updateRueckruf(r.id, { notiz: e.target.value })} placeholder="Gesprächsnotiz …" style={{ ...inp, fontSize: 12 }} />
                          </div>
                          <button onClick={() => setRfOpen(null)} style={{ ...btnStyle("green"), alignSelf: "flex-end" }}>✓ OK</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ LEADS ════ */}
        {tab === "leads" && (() => {
          // Alle Städte + Kategorien aus vorhandenen Leads ableiten
          const allCities = ["Alle", ...Array.from(new Set(leads.map(l => l.city).filter(Boolean))).sort()]
          const allCats   = ["Alle", ...LEAD_CATEGORIES]

          const filteredLeads = leads.filter(l => {
            if (leadCityFilter !== "Alle" && l.city !== leadCityFilter) return false
            if (leadCatFilter !== "Alle" && l.category !== leadCatFilter) return false
            if (leadStatusFilter !== "alle" && l.status !== leadStatusFilter) return false
            if (leadSearch && !l.name.toLowerCase().includes(leadSearch.toLowerCase()) &&
                !l.phone.includes(leadSearch) && !l.city.toLowerCase().includes(leadSearch.toLowerCase())) return false
            return true
          })

          // KPI-Zahlen
          const kpis = (Object.keys(LEAD_STATUS) as LeadStatus[]).map(s => ({
            ...LEAD_STATUS[s], key: s, count: leads.filter(l => l.status === s).length
          })).filter(k => k.count > 0)

          return (
            <div style={{ maxWidth: 960 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: T, margin: 0, letterSpacing: "-.4px" }}>🔍 Lead-Manager</h1>
                <button onClick={() => setShowLeadForm(v => !v)} style={{ ...btnStyle("green"), padding: "9px 18px" }}>
                  {showLeadForm ? "✕ Abbrechen" : "+ Lead eintragen"}
                </button>
              </div>
              <p style={{ fontSize: 13, color: M, margin: "0 0 18px" }}>
                Alle Betriebe die du recherchiert hast — Status tracken, filtern, direkt anrufen.
              </p>

              {/* ── Formular: neuer Lead ── */}
              {showLeadForm && (
                <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 20, padding: "20px 22px", marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T, marginBottom: 14 }}>Neuen Lead eintragen</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Name / Firma *</label>
                      <input value={newLead.name || ""} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="z.B. Kosmetik Müller" style={{ ...inp, fontSize: 12 }} autoFocus />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Telefon</label>
                      <input value={newLead.phone || ""} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="0511 123456" style={{ ...inp, fontSize: 12 }} type="tel" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>E-Mail</label>
                      <input value={newLead.email || ""} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="info@beispiel.de" style={{ ...inp, fontSize: 12 }} type="email" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Stadt</label>
                      <input value={newLead.city || ""} onChange={e => setNewLead(p => ({ ...p, city: e.target.value }))} placeholder="z.B. Hannover" style={{ ...inp, fontSize: 12 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Kategorie</label>
                      <select value={newLead.category || LEAD_CATEGORIES[0]} onChange={e => setNewLead(p => ({ ...p, category: e.target.value }))} style={{ ...inp, fontSize: 12, cursor: "pointer" }}>
                        {LEAD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Notiz</label>
                      <input value={newLead.notiz || ""} onChange={e => setNewLead(p => ({ ...p, notiz: e.target.value }))} placeholder="z.B. Inhaberin heißt Petra" style={{ ...inp, fontSize: 12 }}
                        onKeyDown={e => e.key === "Enter" && addLead()} />
                    </div>
                  </div>
                  <button onClick={addLead} style={{ ...btnStyle("green"), padding: "10px 22px" }}>✓ Hinzufügen</button>
                </div>
              )}

              {/* ── Status-KPIs ── */}
              {kpis.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  <div onClick={() => setLeadStatusFilter("alle")} style={{
                    padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                    background: leadStatusFilter === "alle" ? T : "#fff",
                    color: leadStatusFilter === "alle" ? "#fff" : T,
                    fontSize: 12, fontWeight: 700, border: `1px solid ${BD}`,
                  }}>
                    Alle ({leads.length})
                  </div>
                  {kpis.map(k => (
                    <div key={k.key} onClick={() => setLeadStatusFilter(k.key === leadStatusFilter ? "alle" : k.key as LeadStatus)}
                      style={{
                        padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                        background: leadStatusFilter === k.key ? k.bg : "#fff",
                        color: leadStatusFilter === k.key ? k.color : M,
                        fontSize: 12, fontWeight: 700, border: `1px solid ${leadStatusFilter === k.key ? k.border : BD}`,
                        transition: "all .12s",
                      }}>
                      {k.emoji} {k.label} ({k.count})
                    </div>
                  ))}
                </div>
              )}

              {/* ── Filter-Leiste ── */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <input value={leadSearch} onChange={e => setLeadSearch(e.target.value)} placeholder="🔎 Name, Telefon, Stadt …"
                  style={{ ...inp, width: 220, fontSize: 12 }} />
                <select value={leadCityFilter} onChange={e => setLeadCityFilter(e.target.value)}
                  style={{ ...inp, width: "auto", fontSize: 12, cursor: "pointer" }}>
                  {allCities.map(c => <option key={c} value={c}>{c === "Alle" ? "📍 Alle Städte" : c}</option>)}
                </select>
                <select value={leadCatFilter} onChange={e => setLeadCatFilter(e.target.value)}
                  style={{ ...inp, width: "auto", fontSize: 12, cursor: "pointer" }}>
                  {allCats.map(c => <option key={c} value={c}>{c === "Alle" ? "🏷 Alle Kategorien" : c}</option>)}
                </select>
                {(leadSearch || leadCityFilter !== "Alle" || leadCatFilter !== "Alle" || leadStatusFilter !== "alle") && (
                  <button onClick={() => { setLeadSearch(""); setLeadCityFilter("Alle"); setLeadCatFilter("Alle"); setLeadStatusFilter("alle") }}
                    style={{ ...btnStyle("gray"), fontSize: 11 }}>✕ Filter zurücksetzen</button>
                )}
                <span style={{ fontSize: 12, color: M, marginLeft: "auto" }}>{filteredLeads.length} Ergebnisse</span>
              </div>

              {/* ── Lead-Liste ── */}
              {leads.length === 0 ? (
                <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T, marginBottom: 6 }}>Noch keine Leads eingetragen</div>
                  <div style={{ fontSize: 13, color: M, marginBottom: 16 }}>Trag Betriebe ein die du auf Google findest — Name, Telefon, Stadt, Kategorie.</div>
                  <button onClick={() => setShowLeadForm(true)} style={{ ...btnStyle("green"), padding: "10px 20px" }}>+ Ersten Lead eintragen</button>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 16, padding: "40px 20px", textAlign: "center", color: M, fontSize: 13 }}>
                  Keine Leads für diese Filter.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredLeads.map(lead => {
                    const meta   = LEAD_STATUS[lead.status]
                    const isOpen = leadExpanded === lead.id
                    return (
                      <div key={lead.id} style={{ background: "#fff", border: `1px solid ${lead.status === "kunde" ? GB : lead.status === "termin" ? "#FED7AA" : BD}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", flexWrap: "wrap" }}>

                          {/* Status-Dot */}
                          <div style={{ fontSize: 18, flexShrink: 0 }}>{meta.emoji}</div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 140 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: T }}>{lead.name}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                              {lead.city && <span style={{ fontSize: 11, color: M }}>📍 {lead.city}</span>}
                              {lead.category && <span style={{ fontSize: 11, color: M }}>· {lead.category}</span>}
                              {lead.phone && <span style={{ fontSize: 11, color: T, fontWeight: 600 }}>📞 {lead.phone}</span>}
                              {lead.email && <span style={{ fontSize: 11, color: "#3B82F6" }}>✉ {lead.email}</span>}
                            </div>
                            {lead.notiz && <div style={{ fontSize: 11, color: M, marginTop: 3, fontStyle: "italic" }}>{lead.notiz}</div>}
                          </div>

                          {/* Status-Badge */}
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, flexShrink: 0 }}>
                            {meta.label}
                          </span>

                          {/* Schnell-Status: die wichtigsten Aktionen */}
                          <div style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap" }}>
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} style={{ ...btnStyle("green"), textDecoration: "none", padding: "6px 10px", fontSize: 11 }}>📞</a>
                            )}
                            {(["angerufen", "nicht_erreicht", "interesse", "kein_interesse", "termin", "kunde"] as LeadStatus[])
                              .filter(s => s !== lead.status)
                              .slice(0, 3)
                              .map(s => (
                                <button key={s} onClick={() => updateLead(lead.id, { status: s })}
                                  style={{ ...btnStyle("gray"), padding: "6px 9px", fontSize: 10, color: LEAD_STATUS[s].color, background: LEAD_STATUS[s].bg, border: `1px solid ${LEAD_STATUS[s].border}` }}>
                                  {LEAD_STATUS[s].emoji}
                                </button>
                              ))
                            }
                            <button onClick={() => setLeadExpanded(isOpen ? null : lead.id)} style={{ ...btnStyle("gray"), padding: "6px 10px", fontSize: 11 }}>
                              {isOpen ? "▲" : "✏️"}
                            </button>
                            <button onClick={() => deleteLead(lead.id)} style={{ ...btnStyle("red"), padding: "6px 9px", fontSize: 11 }}>✕</button>
                          </div>
                        </div>

                        {/* Detail-Editor */}
                        {isOpen && (
                          <div style={{ borderTop: `1px solid ${BD}`, background: BG, padding: "16px 18px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 12 }}>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Name</label>
                                <input value={lead.name} onChange={e => updateLead(lead.id, { name: e.target.value })} style={{ ...inp, fontSize: 12 }} />
                              </div>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Telefon</label>
                                <input value={lead.phone} onChange={e => updateLead(lead.id, { phone: e.target.value })} style={{ ...inp, fontSize: 12 }} type="tel" />
                              </div>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>E-Mail</label>
                                <input value={lead.email} onChange={e => updateLead(lead.id, { email: e.target.value })} style={{ ...inp, fontSize: 12 }} />
                              </div>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Stadt</label>
                                <input value={lead.city} onChange={e => updateLead(lead.id, { city: e.target.value })} style={{ ...inp, fontSize: 12 }} />
                              </div>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Kategorie</label>
                                <select value={lead.category} onChange={e => updateLead(lead.id, { category: e.target.value })} style={{ ...inp, fontSize: 12, cursor: "pointer" }}>
                                  {LEAD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Status</label>
                                <select value={lead.status} onChange={e => updateLead(lead.id, { status: e.target.value as LeadStatus })} style={{ ...inp, fontSize: 12, cursor: "pointer" }}>
                                  {(Object.keys(LEAD_STATUS) as LeadStatus[]).map(s => (
                                    <option key={s} value={s}>{LEAD_STATUS[s].emoji} {LEAD_STATUS[s].label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>Notiz / Gesprächsnotiz</label>
                              <textarea value={lead.notiz} onChange={e => updateLead(lead.id, { notiz: e.target.value })} rows={2}
                                style={{ ...inp, resize: "vertical", fontSize: 12, lineHeight: 1.6 }} />
                            </div>
                            <div style={{ fontSize: 10, color: M, marginTop: 8 }}>
                              Eingetragen: {new Date(lead.createdAt).toLocaleDateString("de-DE")} · Zuletzt geändert: {new Date(lead.updatedAt).toLocaleDateString("de-DE")}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

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

                <div style={{ minHeight: 200 }}>
                  {prices.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: M, fontSize: 13 }}>
                      Noch keine Einträge. Füge oben deine Pakete hinzu.
                    </div>
                  ) : (
                    prices.map((row, i) => (
                      <div key={row.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px", borderBottom: i < prices.length - 1 ? `1px solid ${BD}` : "none" }}>
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
      <style>{`* { box-sizing: border-box; } input:focus, textarea:focus, select:focus { border-color: ${G} !important; outline: none; }`}</style>
    </div>
  )
}
