"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Service = {
  id: string
  name: string
  duration: number
  price: number | null
  active: boolean
}

const DURATIONS = [15, 20, 30, 45, 60, 75, 90, 105, 120]

function formatDur(m: number) {
  if (m < 60) return `${m} Min.`
  const h = Math.floor(m / 60), r = m % 60
  return r === 0 ? `${h} Std.` : `${h} Std. ${r} Min.`
}

export default function ServicesPage() {
  const [companyId, setCompanyId]     = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [slug, setSlug]               = useState<string | null>(null)
  const [services, setServices]       = useState<Service[]>([])
  const [loading, setLoading]         = useState(true)

  // Form
  const [newName, setNewName]         = useState("")
  const [newDuration, setNewDuration] = useState("30")
  const [newPrice, setNewPrice]       = useState("")
  const [saving, setSaving]           = useState(false)
  const [saveError, setSaveError]     = useState("")
  const [editId, setEditId]           = useState<string | null>(null)

  // Slug
  const [slugEdit, setSlugEdit]       = useState("")
  const [slugSaving, setSlugSaving]   = useState(false)
  const [slugMsg, setSlugMsg]         = useState("")

  // Copied state
  const [copied, setCopied]           = useState(false)

  useEffect(() => {
    const storedId   = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) { window.location.href = "/login"; return }
    setCompanyId(storedId)
    setCompanyName(storedName || "")
  }, [])

  useEffect(() => { if (companyId) loadAll() }, [companyId])

  async function loadAll() {
    setLoading(true)
    const { data: co } = await supabase
      .from("companies").select("slug").eq("id", companyId!).single()
    if (co) { setSlug(co.slug || null); setSlugEdit(co.slug || "") }

    const { data } = await supabase
      .from("services").select("*")
      .eq("company_id", companyId!).order("created_at", { ascending: true })
    setServices(data || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  async function saveService() {
    if (!newName.trim() || !companyId) return
    setSaving(true)
    setSaveError("")
    const payload = {
      company_id: companyId,
      name:       newName.trim(),
      duration:   parseInt(newDuration) || 30,
      price:      newPrice ? parseFloat(newPrice.replace(",", ".")) : null,
      active:     true,
    }
    const { error } = editId
      ? await supabase.from("services").update(payload).eq("id", editId)
      : await supabase.from("services").insert(payload)

    if (error) {
      setSaveError("Fehler beim Speichern. Bitte erneut versuchen.")
      setSaving(false)
      return
    }
    setNewName(""); setNewDuration("30"); setNewPrice(""); setEditId(null)
    setSaving(false)
    loadAll()
  }

  async function toggleActive(s: Service) {
    await supabase.from("services").update({ active: !s.active }).eq("id", s.id)
    loadAll()
  }

  async function deleteService(id: string) {
    if (!confirm("Leistung wirklich löschen?")) return
    await supabase.from("services").delete().eq("id", id)
    loadAll()
  }

  function startEdit(s: Service) {
    setEditId(s.id)
    setNewName(s.name)
    setNewDuration(String(s.duration))
    setNewPrice(s.price != null ? String(s.price).replace(".", ",") : "")
    setSaveError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function saveSlug() {
    if (!slugEdit.trim()) return
    const clean = slugEdit.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
    setSlugSaving(true); setSlugMsg("")
    const { error } = await supabase
      .from("companies").update({ slug: clean }).eq("id", companyId!)
    if (error) {
      setSlugMsg("Dieser Link ist bereits vergeben.")
    } else {
      setSlug(clean); setSlugEdit(clean); setSlugMsg("✓ Gespeichert")
    }
    setSlugSaving(false)
  }

  function copyUrl() {
    if (!bookingUrl) return
    navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://terminstop.de"
  const bookingUrl = slug ? `${origin}/book/${slug}` : null

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#1F2A37] overflow-x-hidden"
      style={{ fontFamily:"'Inter','Manrope',sans-serif", backgroundColor:"#F7FAFC" }}>

      {/* ── NAVBAR ── */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span><span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1">
            {[
              { href:"/dashboard", label:"Dashboard" },
              { href:"/calendar",  label:"Kalender" },
              { href:"/customers", label:"Kunden" },
              { href:"/insights",  label:"Einblicke" },
              { href:"/services",  label:"Buchung", active:true },
            ].map(item => (
              <a key={item.href} href={item.href}
                className={`text-sm px-4 py-2 rounded-lg transition ${item.active
                  ? "font-semibold text-[#1F2A37] bg-[#F7FAFC]"
                  : "text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC]"}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <button onClick={handleLogout}
          className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">
          Logout
        </button>
      </nav>

      {/* ── MOBILE NAV ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 flex justify-around items-center px-2 py-2">
        {[
          { href:"/dashboard", label:"Start",     icon:"🏠" },
          { href:"/calendar",  label:"Kalender",  icon:"📅" },
          { href:"/customers", label:"Kunden",    icon:"👥" },
          { href:"/insights",  label:"Einblicke", icon:"📊" },
          { href:"/services",  label:"Buchung",   icon:"🔗", active:true },
        ].map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition ${
              item.active ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-12">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1F2A37]">Online-Buchung</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Verwalten Sie Ihre Leistungen und teilen Sie Ihren persönlichen Buchungslink.
          </p>
        </div>

        {/* ── BUCHUNGSLINK ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm mb-5">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Ihr persönlicher Link</p>
          </div>
          <div className="px-5 py-5">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl overflow-hidden">
                <span className="text-xs text-[#9CA3AF] px-3 py-3 whitespace-nowrap border-r border-[#E5E7EB] bg-[#F3F4F6] hidden sm:inline">/book/</span>
                <input
                  className="flex-1 px-3 py-3 bg-transparent outline-none text-sm text-[#1F2A37] font-medium min-w-0"
                  value={slugEdit}
                  onChange={e => setSlugEdit(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveSlug()}
                  placeholder="ihr-betrieb-stadtname"
                />
              </div>
              <button onClick={saveSlug} disabled={slugSaving || !slugEdit.trim()}
                className="shrink-0 bg-[#1F2A37] text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-[#374151] transition disabled:opacity-40">
                {slugSaving ? "..." : "Speichern"}
              </button>
            </div>

            {slugMsg && (
              <p className={`text-xs mb-3 ${slugMsg.startsWith("✓") ? "text-[#18A66D]" : "text-[#EF4444]"}`}>
                {slugMsg}
              </p>
            )}

            {bookingUrl ? (
              <div className="bg-[#F0FDF9] border border-[#6EE7B7]/40 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#059669] font-medium truncate hover:underline">
                  {bookingUrl}
                </a>
                <button onClick={copyUrl}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                    copied
                      ? "bg-[#D1FAE5] border-[#6EE7B7] text-[#059669]"
                      : "bg-white border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}>
                  {copied ? "✓ Kopiert" : "Kopieren"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#9CA3AF]">
                Geben Sie einen Link-Namen ein (z.B. <span className="font-mono">friseur-mueller-berlin</span>) und klicken Sie auf Speichern.
              </p>
            )}
          </div>
        </div>

        {/* ── QR CODE ── */}
        {bookingUrl && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm mb-5">
            <div className="px-5 py-4 border-b border-[#F3F4F6]">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">QR-Code</p>
            </div>
            <div className="px-5 py-5 flex items-center gap-6">
              <div className="shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(bookingUrl)}&color=1F2A37&bgcolor=FFFFFF&qzone=1`}
                  alt="QR Code"
                  width={140} height={140}
                  className="rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2A37] mb-1">Direkt an der Kasse scannen</p>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                  Drucken Sie den Code aus oder zeigen Sie ihn auf dem Bildschirm — Kunden landen sofort bei Ihnen.
                </p>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(bookingUrl)}&color=1F2A37&bgcolor=FFFFFF&qzone=2`}
                  download="terminstop-qrcode.png"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1F2A37] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#374151] transition">
                  ↓ Herunterladen (600×600)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── LEISTUNG HINZUFÜGEN / BEARBEITEN ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm mb-5">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              {editId ? "Leistung bearbeiten" : "Neue Leistung"}
            </p>
            {editId && (
              <button
                onClick={() => { setEditId(null); setNewName(""); setNewDuration("30"); setNewPrice(""); setSaveError("") }}
                className="text-xs text-[#6B7280] hover:text-[#EF4444] transition">
                Abbrechen
              </button>
            )}
          </div>
          <div className="px-5 py-5 space-y-4">

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-[#374151] mb-1.5 block">Bezeichnung *</label>
              <input
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1F2A37] focus:ring-2 focus:ring-[#1F2A37]/10 transition"
                placeholder="z.B. Haarschnitt, Massage, Beratungsgespräch …"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveService()}
              />
            </div>

            {/* Dauer + Preis */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-1.5 block">Dauer</label>
                <select
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] focus:outline-none focus:border-[#1F2A37] transition"
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}>
                  {DURATIONS.map(d => <option key={d} value={d}>{formatDur(d)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-1.5 block">
                  Preis <span className="font-normal text-[#9CA3AF]">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 pr-8 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1F2A37] transition"
                    placeholder="25"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">€</span>
                </div>
              </div>
            </div>

            {saveError && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 text-sm text-[#DC2626]">
                {saveError}
              </div>
            )}

            <button
              onClick={saveService}
              disabled={saving || !newName.trim()}
              className="w-full bg-[#18A66D] hover:bg-[#0F8F63] disabled:bg-[#D1D5DB] text-white font-semibold text-sm py-3 rounded-xl transition">
              {saving ? "Speichern …" : editId ? "Änderungen speichern" : "+ Leistung hinzufügen"}
            </button>
          </div>
        </div>

        {/* ── LEISTUNGSLISTE ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Ihre Leistungen</p>
            <span className="text-xs text-[#9CA3AF]">
              {services.filter(s => s.active).length} aktiv · {services.length} gesamt
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-[#9CA3AF]">
              <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#1F2A37] rounded-full animate-spin mx-auto mb-3" />
              Wird geladen …
            </div>
          ) : services.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-12 h-12 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-3 text-xl">✂️</div>
              <p className="text-sm font-medium text-[#374151]">Noch keine Leistungen</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Fügen Sie Ihre erste Leistung oben hinzu.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F9FAFB]">
              {services.map(s => (
                <div key={s.id} className={`px-5 py-4 flex items-center gap-4 transition ${editId === s.id ? "bg-[#F0FDF9]" : "hover:bg-[#F9FAFB]"}`}>

                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${s.active ? "bg-[#18A66D]" : "bg-[#D1D5DB]"}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${s.active ? "text-[#1F2A37]" : "text-[#9CA3AF] line-through"}`}>
                      {s.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {formatDur(s.duration)}
                      {s.price != null && ` · €\u00A0${Number(s.price).toFixed(2).replace(".", ",")}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => startEdit(s)}
                      className="text-xs text-[#6B7280] hover:text-[#1F2A37] border border-[#E5E7EB] px-2.5 py-1.5 rounded-lg hover:bg-[#F7FAFC] transition">
                      Bearbeiten
                    </button>
                    <button onClick={() => toggleActive(s)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition ${
                        s.active
                          ? "text-[#92400E] border-[#FDE68A] bg-[#FEF3C7] hover:bg-[#FDE68A]"
                          : "text-[#065F46] border-[#A7F3D0] bg-[#D1FAE5] hover:bg-[#A7F3D0]"
                      }`}>
                      {s.active ? "Pausieren" : "Aktivieren"}
                    </button>
                    <button onClick={() => deleteService(s.id)}
                      className="text-xs text-[#D1D5DB] hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-[#FEF2F2] transition">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sicherheitshinweis */}
        <div className="mt-5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-4 py-3.5 flex gap-3">
          <span className="text-lg shrink-0">🔒</span>
          <div>
            <p className="text-xs font-semibold text-[#0369A1] mb-0.5">Spam-Schutz aktiv</p>
            <p className="text-xs text-[#0369A1]/80 leading-relaxed">
              Jede Telefonnummer kann maximal 3 Anfragen pro 24 Stunden senden.
              Mehrfacheintragungen werden automatisch blockiert.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
