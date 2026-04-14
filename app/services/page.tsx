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
  const [editId, setEditId]           = useState<string | null>(null)

  // Slug-Editor
  const [slugEdit, setSlugEdit]       = useState("")
  const [slugSaving, setSlugSaving]   = useState(false)
  const [slugMsg, setSlugMsg]         = useState("")

  useEffect(() => {
    const storedId   = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) { window.location.href = "/login"; return }
    setCompanyId(storedId)
    setCompanyName(storedName || "")
  }, [])

  useEffect(() => {
    if (!companyId) return
    loadAll()
  }, [companyId])

  async function loadAll() {
    setLoading(true)
    const { data: company } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", companyId)
      .single()
    if (company) {
      setSlug(company.slug || null)
      setSlugEdit(company.slug || "")
    }

    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true })
    if (data) setServices(data)
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
    const payload = {
      company_id: companyId,
      name: newName.trim(),
      duration: parseInt(newDuration) || 30,
      price: newPrice ? parseFloat(newPrice.replace(",", ".")) : null,
      active: true,
    }
    if (editId) {
      await supabase.from("services").update(payload).eq("id", editId)
    } else {
      await supabase.from("services").insert(payload)
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
    if (!confirm("Dienstleistung wirklich löschen?")) return
    await supabase.from("services").delete().eq("id", id)
    loadAll()
  }

  function startEdit(s: Service) {
    setEditId(s.id)
    setNewName(s.name)
    setNewDuration(String(s.duration))
    setNewPrice(s.price != null ? String(s.price).replace(".", ",") : "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function saveSlug() {
    if (!slugEdit.trim()) return
    const clean = slugEdit.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
    setSlugSaving(true)
    setSlugMsg("")
    const { error } = await supabase
      .from("companies")
      .update({ slug: clean })
      .eq("id", companyId)
    if (error) {
      setSlugMsg("Dieser Link ist bereits vergeben. Bitte einen anderen wählen.")
    } else {
      setSlug(clean)
      setSlugEdit(clean)
      setSlugMsg("✓ Gespeichert")
    }
    setSlugSaving(false)
  }

  const bookingUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : "https://terminstop.de"}/book/${slug}` : null

  return (
    <div className="min-h-screen text-[#1F2A37] overflow-x-hidden" style={{ fontFamily:"'Inter','Manrope',sans-serif", backgroundColor:"#F7FAFC" }}>

      {/* NAVBAR */}
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
              { href:"/services",  label:"Buchung", active:true },
              { href:"/insights",  label:"Einblicke" },
            ].map(item => (
              <a key={item.href} href={item.href}
                className={`text-sm px-4 py-2 rounded-lg transition ${item.active ? "font-semibold text-[#1F2A37] bg-[#F7FAFC]" : "text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC]"}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">Logout</button>
      </nav>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 flex justify-around items-center px-2 py-2">
        {[
          { href:"/dashboard", label:"Dashboard", icon:"🏠" },
          { href:"/calendar",  label:"Kalender",  icon:"📅" },
          { href:"/customers", label:"Kunden",    icon:"👥" },
          { href:"/services",  label:"Buchung",   icon:"🔗", active:true },
          { href:"/insights",  label:"Einblicke", icon:"📊" },
        ].map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${item.active ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 pb-28 md:pb-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2A37]">Online-Buchung</h1>
          <p className="text-[#6B7280] text-sm mt-1">Pflegen Sie Ihre Leistungen und teilen Sie Ihren Buchungslink.</p>
        </div>

        {/* ── BUCHUNGSLINK ── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#1F2A37]">Ihr Buchungslink</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Dieser Link ist nur für Ihren Betrieb. Kunden landen direkt bei Ihnen.</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#6B7280]">
                <span className="text-[#9CA3AF] mr-1 shrink-0">/book/</span>
                <input
                  className="flex-1 bg-transparent outline-none text-[#1F2A37] font-medium"
                  value={slugEdit}
                  onChange={e => setSlugEdit(e.target.value)}
                  placeholder="ihr-betrieb-stadtname"
                />
              </div>
              <button onClick={saveSlug} disabled={slugSaving}
                className="bg-[#18A66D] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0F8F63] transition disabled:opacity-50">
                {slugSaving ? "..." : "Speichern"}
              </button>
            </div>
            {slugMsg && (
              <p className={`text-xs mb-3 ${slugMsg.startsWith("✓") ? "text-[#18A66D]" : "text-[#EF4444]"}`}>{slugMsg}</p>
            )}
            {bookingUrl && (
              <div className="bg-[#E8FBF3] border border-[#6EE7B7]/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#18A66D] font-medium truncate hover:underline">{bookingUrl}</a>
                <button
                  onClick={() => navigator.clipboard.writeText(bookingUrl)}
                  className="text-xs text-[#18A66D] font-semibold whitespace-nowrap bg-white border border-[#6EE7B7]/50 px-3 py-1.5 rounded-lg hover:bg-[#F0FBF6] transition">
                  Kopieren
                </button>
              </div>
            )}
            {!slug && (
              <p className="text-xs text-[#9CA3AF]">Tragen Sie einen Link-Namen ein und speichern Sie ihn, um Ihren Buchungslink zu aktivieren.</p>
            )}
          </div>
        </div>

        {/* ── QR CODE ── */}
        {bookingUrl && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#1F2A37]">QR-Code</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Zum Ausdrucken oder Zeigen auf dem Handy.</p>
            </div>
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(bookingUrl)}&color=1F2A37&bgcolor=FFFFFF`}
                  alt="QR Code"
                  width={160} height={160}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                  Drucken Sie diesen QR-Code aus, stellen Sie ihn an der Kasse auf oder zeigen Sie ihn Kunden auf dem Handy.
                  Ein Scan öffnet direkt Ihre Buchungsseite.
                </p>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bookingUrl)}&color=1F2A37&bgcolor=FFFFFF`}
                  download="terminstop-qrcode.png"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1F2A37] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#111827] transition">
                  ↓ QR-Code herunterladen
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── LEISTUNGEN HINZUFÜGEN ── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#1F2A37]">{editId ? "Leistung bearbeiten" : "Leistung hinzufügen"}</h2>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Name</label>
                <input
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10"
                  placeholder="z.B. Haarschnitt"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Dauer (Min.)</label>
                <select
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2A37] focus:outline-none focus:border-[#18A66D]"
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}>
                  {[15,20,30,45,60,75,90,120].map(d => (
                    <option key={d} value={d}>{d} Min.</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Preis (€, optional)</label>
                <input
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10"
                  placeholder="z.B. 25"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveService} disabled={saving || !newName.trim()}
                className="bg-[#18A66D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0F8F63] transition disabled:opacity-40">
                {saving ? "Speichern..." : editId ? "Aktualisieren" : "Hinzufügen"}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setNewName(""); setNewDuration("30"); setNewPrice("") }}
                  className="text-sm text-[#6B7280] px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F7FAFC] transition">
                  Abbrechen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── LEISTUNGSLISTE ── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1F2A37]">Ihre Leistungen</h2>
            <span className="text-xs text-[#6B7280]">{services.filter(s => s.active).length} aktiv</span>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-sm text-[#9CA3AF]">Laden...</div>
          ) : services.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="text-3xl mb-3">✂️</div>
              <p className="text-sm text-[#6B7280]">Noch keine Leistungen eingetragen.</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Fügen Sie Ihre erste Leistung oben hinzu.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {services.map(s => (
                <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.active ? "bg-[#18A66D]" : "bg-[#D1D5DB]"}`} />
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold truncate ${s.active ? "text-[#1F2A37]" : "text-[#9CA3AF] line-through"}`}>{s.name}</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">
                        {s.duration} Min.{s.price != null ? ` · €${Number(s.price).toFixed(2).replace(".", ",")}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(s)}
                      className="text-xs text-[#6B7280] hover:text-[#1F2A37] border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC] transition">
                      Bearbeiten
                    </button>
                    <button onClick={() => toggleActive(s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${s.active ? "text-[#D97706] border-[#FDE68A] bg-[#FEF3C7] hover:bg-[#FDE68A]" : "text-[#18A66D] border-[#6EE7B7] bg-[#E8FBF3] hover:bg-[#D1FAE5]"}`}>
                      {s.active ? "Deaktivieren" : "Aktivieren"}
                    </button>
                    <button onClick={() => deleteService(s.id)}
                      className="text-xs text-[#EF4444] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA] px-3 py-1.5 rounded-lg transition">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
