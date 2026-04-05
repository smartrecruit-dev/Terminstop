"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function CustomersPage() {

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<any | null>(null)

  // Formular
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) window.location.href = "/login"
    else {
      setCompanyId(storedId)
      setCompanyName(storedName || "")
    }
  }, [])

  useEffect(() => {
    if (companyId) {
      loadCustomers()
      loadAppointments()
    }
  }, [companyId])

  async function loadCustomers() {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", companyId)
      .order("name", { ascending: true })
    if (data) setCustomers(data)
  }

  async function loadAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: false })
    if (data) setAppointments(data)
  }

  async function handleSave(e: any) {
    e.preventDefault()
    if (!name || !phone || !companyId) return
    setSaving(true)

    const { error } = await supabase
      .from("customers")
      .insert([{ name, phone, note, company_id: companyId }])

    if (!error) {
      setName(""); setPhone(""); setNote("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      loadCustomers()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("customers").delete().eq("id", id)
    setSelected(null)
    setConfirmDelete(false)
    loadCustomers()
  }

  function handleLogout() {
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const customerAppointments = selected
    ? appointments.filter(a => a.phone === selected.phone)
    : []

  return (
    <div className="min-h-screen text-[#1F2A37]" style={{ fontFamily: "'Inter', 'Manrope', sans-serif", backgroundColor: "#F7FAFC" }}>

      {/* ─── NAV ─── */}
      <nav className="flex justify-between items-center px-8 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-base font-bold mr-2">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="flex gap-1">
            <a href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Dashboard</a>
            <a href="/calendar" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Kalender</a>
            <a href="/customers" className="text-sm font-semibold text-[#1F2A37] bg-[#F7FAFC] px-4 py-2 rounded-lg">Kunden</a>
            <a href="/insights" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Einblicke</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#18A66D] font-medium">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
            System aktiv
          </div>
          <button onClick={handleLogout} className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs text-[#6B7280] font-medium mb-1 uppercase tracking-wider">Kundenverwaltung</div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
              Kunden von <span className="text-[#18A66D]">{companyName || "Ihrem Betrieb"}</span>
            </h1>
            <p className="text-[#6B7280] mt-1 text-sm">{customers.length} Kunden gespeichert</p>
          </div>
          <div className="flex items-center gap-2 bg-[#E8FBF3] border border-[#6EE7B7] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full" />
            Kundenkartei aktiv
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ─── KUNDENLISTE ─── */}
          <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <input
                type="text"
                placeholder="Kunden suchen (Name oder Telefon)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
              />
            </div>

            <div className="divide-y divide-[#F3F4F6] overflow-y-auto max-h-[520px]">
              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <div className="text-sm font-semibold text-[#1F2A37] mb-1">
                    {search ? "Kein Treffer" : "Noch keine Kunden"}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {search ? "Andere Suche versuchen." : "Fügen Sie rechts Ihren ersten Kunden hinzu."}
                  </div>
                </div>
              ) : (
                filtered.map(c => {
                  const cAppts = appointments.filter(a => a.phone === c.phone)
                  const isSelected = selected?.id === c.id
                  return (
                    <div
                      key={c.id}
                      onClick={() => { setSelected(isSelected ? null : c); setConfirmDelete(false) }}
                      className={`flex items-center justify-between px-6 py-4 cursor-pointer transition ${isSelected ? "bg-[#F0FDF6]" : "hover:bg-[#FAFAFA]"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-[#E8FBF3] rounded-full flex items-center justify-center text-sm font-bold text-[#18A66D] shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#1F2A37]">{c.name}</div>
                          <div className="text-xs text-[#9CA3AF] mt-0.5">{c.phone}</div>
                          {c.note && <div className="text-xs text-[#6B7280] mt-0.5 italic">{c.note}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {cAppts.length > 0 && (
                          <div className="text-xs bg-[#F7FAFC] border border-[#E5E7EB] text-[#6B7280] px-2.5 py-1 rounded-full">
                            {cAppts.length} Termin{cAppts.length !== 1 ? "e" : ""}
                          </div>
                        )}
                        <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#18A66D]" : "bg-[#E5E7EB]"}`} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ─── RECHTE SPALTE ─── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Kunden-Detail oder Formular */}
            {selected ? (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F0FDF6] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#18A66D] font-semibold uppercase tracking-wider">Kundenprofil</div>
                    <div className="text-base font-bold text-[#1F2A37] mt-0.5">{selected.name}</div>
                  </div>
                  <button
                    onClick={() => { setSelected(null); setConfirmDelete(false) }}
                    className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#D1D5DB] transition text-sm"
                  >✕</button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F7FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-sm shrink-0">📞</div>
                    <div>
                      <div className="text-xs text-[#9CA3AF]">Telefon</div>
                      <div className="text-sm font-semibold text-[#1F2A37]">{selected.phone}</div>
                    </div>
                  </div>
                  {selected.note && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#F7FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-sm shrink-0">📝</div>
                      <div>
                        <div className="text-xs text-[#9CA3AF]">Notiz</div>
                        <div className="text-sm text-[#1F2A37]">{selected.note}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F7FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-sm shrink-0">📅</div>
                    <div>
                      <div className="text-xs text-[#9CA3AF]">Termine insgesamt</div>
                      <div className="text-sm font-semibold text-[#1F2A37]">{customerAppointments.length} Termin{customerAppointments.length !== 1 ? "e" : ""}</div>
                    </div>
                  </div>

                  {/* Terminverlauf */}
                  {customerAppointments.length > 0 && (
                    <div>
                      <div className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-wide mb-2">Verlauf</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {customerAppointments.slice(0, 8).map(a => (
                          <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${a.status === "done" ? "bg-[#F0FDF6] text-[#18A66D]" : "bg-[#F7FAFC] text-[#6B7280]"}`}>
                            <span>{a.date} · {a.time} Uhr</span>
                            <span className="font-semibold">{a.status === "done" ? "✓ Erschienen" : "Ausstehend"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-5">
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-[#EF4444] border border-[#FECACA] hover:bg-[#FEF2F2] transition"
                    >
                      Kunden löschen
                    </button>
                  ) : (
                    <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
                      <p className="text-xs text-[#EF4444] font-semibold text-center mb-3">Wirklich löschen?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-lg text-sm bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7FAFC] transition">Abbrechen</button>
                        <button onClick={() => handleDelete(selected.id)} className="flex-1 py-2 rounded-lg text-sm font-bold bg-[#EF4444] text-white hover:bg-[#DC2626] transition">Löschen</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ─── NEUER KUNDE FORMULAR ─── */
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB]">
                  <h2 className="text-sm font-bold text-[#1F2A37]">Neuer Kunde</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">Stammkunden hier eintragen</p>
                </div>

                <form onSubmit={handleSave} className="px-6 py-6 flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Name</label>
                    <input
                      className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                      placeholder="Max Mustermann"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Telefonnummer</label>
                    <input
                      className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                      placeholder="+49 170 1234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                      Notiz <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                      placeholder="z. B. Stammkunde, Allergien..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`mt-1 w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                      success ? "bg-[#E8FBF3] text-[#18A66D] border border-[#6EE7B7]"
                      : saving ? "bg-[#6B7280] text-white cursor-not-allowed"
                      : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-[#18A66D]/20"
                    }`}
                  >
                    {success ? "✓ Kunde gespeichert!" : saving ? "Speichern..." : "Kunden speichern →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
