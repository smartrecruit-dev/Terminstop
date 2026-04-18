"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import SetupChecklist from "../components/SetupChecklist"

// ─────────────────────────────────────────────────────────────────────────────
// AppointmentForm ist AUSSERHALB der Dashboard-Komponente definiert →
// verhindert, dass React das Formular bei jedem State-Update neu mountet
// (= Input verliert den Fokus nach jedem Buchstaben)
// ─────────────────────────────────────────────────────────────────────────────
interface FormProps {
  name: string; setName: (v: string) => void
  phone: string; setPhone: (v: string) => void
  date: string; setDate: (v: string) => void
  time: string; setTime: (v: string) => void
  note: string; setNote: (v: string) => void
  isSubmitting: boolean
  formSuccess: boolean
  customers: any[]
  customerSearch: string; setCustomerSearch: (v: string) => void
  showSuggestions: boolean; setShowSuggestions: (v: boolean) => void
  onSubmit: (e: React.FormEvent, closeAfter?: boolean) => void
  closeForm?: () => void
}

function AppointmentForm({
  name, setName, phone, setPhone, date, setDate, time, setTime,
  note, setNote, isSubmitting, formSuccess, customers,
  customerSearch, setCustomerSearch, showSuggestions, setShowSuggestions,
  onSubmit, closeForm,
}: FormProps) {
  const inp = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  ).slice(0, 5)

  return (
    <form onSubmit={e => onSubmit(e, !!closeForm)} className="flex flex-col gap-4">

      {/* Name + Autocomplete */}
      <div className="relative">
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Name</label>
        <input
          className={inp}
          placeholder="Max Mustermann"
          value={name}
          onChange={e => { setName(e.target.value); setCustomerSearch(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {showSuggestions && customerSearch.length > 0 && (
          <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
            {filtered.length > 0 ? filtered.map(c => (
              <button key={c.id} type="button"
                onMouseDown={() => { setName(c.name); setPhone(c.phone || ""); setCustomerSearch(""); setShowSuggestions(false) }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#F0FDF6] transition flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F0FBF6] flex items-center justify-center text-[#18A66D] text-xs font-bold shrink-0">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">{c.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{c.phone}</div>
                </div>
              </button>
            )) : (
              <div className="px-4 py-3 text-xs text-[#9CA3AF]">Nicht in der Kartei – wird neu angelegt</div>
            )}
          </div>
        )}
      </div>

      {/* Telefon */}
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Telefonnummer</label>
        <input className={inp} placeholder="0151 12345678" value={phone}
          onChange={e => setPhone(e.target.value)} type="tel" />
      </div>

      {/* Datum + Zeit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Datum</label>
          <input type="date" className={inp} value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Uhrzeit</label>
          <input type="time" className={inp} value={time} onChange={e => setTime(e.target.value)} required />
        </div>
      </div>

      {/* Notiz */}
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">
          Notiz <span className="font-normal normal-case text-[#9CA3AF]">(optional)</span>
        </label>
        <input className={inp} placeholder="z.B. Erstbesuch, Farbe" value={note}
          onChange={e => setNote(e.target.value)} />
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          formSuccess
            ? "bg-[#F0FBF6] text-[#18A66D] border border-[#D1F5E3]"
            : isSubmitting
            ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
            : "bg-[#18A66D] text-white hover:bg-[#15955F] active:scale-[.98]"
        }`}>
        {formSuccess ? "✓ Termin gespeichert!" : isSubmitting ? "Speichert …" : "Termin speichern →"}
      </button>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  useEffect(() => { document.title = "Dashboard | TerminStop" }, [])

  const [name, setName]   = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate]   = useState("")
  const [time, setTime]   = useState("")
  const [note, setNote]   = useState("")

  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId]   = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess]   = useState(false)
  const [showForm, setShowForm]         = useState(false)

  const [companyId, setCompanyId]     = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [customers, setCustomers]     = useState<any[]>([])
  const [customerSearch, setCustomerSearch]       = useState("")
  const [showSuggestions, setShowSuggestions]     = useState(false)

  useEffect(() => {
    const storedId   = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) { window.location.href = "/login"; return }
    supabase.from("companies").select("paused").eq("id", storedId).single()
      .then(({ data }) => {
        if (data?.paused) {
          localStorage.removeItem("company_id"); localStorage.removeItem("company_name")
          window.location.href = "/login"
        } else {
          setCompanyId(storedId); setCompanyName(storedName || "")
        }
      })
  }, [])

  useEffect(() => {
    if (companyId) { loadAppointments(); loadCustomers() }
  }, [companyId])

  async function loadAppointments() {
    if (!companyId) return
    const { data } = await supabase.from("appointments").select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: true }).order("time", { ascending: true })
    if (data) setAppointments(data)
  }

  async function loadCustomers() {
    const { data } = await supabase.from("customers").select("*")
      .eq("company_id", companyId).order("name", { ascending: true })
    if (data) setCustomers(data)
  }

  async function toggleDone(a: any) {
    const newStatus = a.status === "done" ? "pending" : "done"
    await supabase.from("appointments").update({ status: newStatus }).eq("id", a.id)
    loadAppointments()
  }

  async function handleSubmit(e: React.FormEvent, closeAfter = false) {
    e.preventDefault()
    if (!companyId || !name || !phone || !date || !time) return
    setIsSubmitting(true)
    const { data, error } = await supabase.from("appointments")
      .insert([{ name, phone, date, time, note, status: "pending", company_id: companyId }])
      .select()
    if (error) { alert("Fehler beim Speichern"); setIsSubmitting(false); return }
    if (data) { setJustAddedId(data[0].id); setTimeout(() => setJustAddedId(null), 1200) }
    setName(""); setPhone(""); setDate(""); setTime(""); setNote("")
    setCustomerSearch(""); setShowSuggestions(false)
    setIsSubmitting(false)
    setFormSuccess(true)
    setTimeout(() => { setFormSuccess(false); if (closeAfter) setShowForm(false) }, 1800)
    loadAppointments()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id"); localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const now        = new Date()
  const todayStr   = now.toISOString().split("T")[0]
  const allToday   = appointments.filter(a => a.date === todayStr)
  const doneCount  = allToday.filter(a => a.status === "done").length
  const openCount  = allToday.filter(a => a.status !== "done").length
  const nextOpen   = allToday.find(a => {
    if (a.status === "done") return false
    return new Date(`${a.date}T${a.time}`).getTime() >= now.getTime() - 30 * 60 * 1000
  })

  const formProps: FormProps = {
    name, setName, phone, setPhone, date, setDate, time, setTime,
    note, setNote, isSubmitting, formSuccess, customers,
    customerSearch, setCustomerSearch, showSuggestions, setShowSuggestions,
    onSubmit: handleSubmit,
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F9FAFB" }}>
      <DashNav active="/dashboard" companyId={companyId} onLogout={handleLogout} />

      {/* ── Mobiles Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111827]">Neuer Termin</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-sm">✕</button>
            </div>
            <AppointmentForm {...formProps} closeForm={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-10">

        {/* Onboarding */}
        {companyId && <SetupChecklist companyId={companyId} appointmentCount={appointments.length} />}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-[#9CA3AF] font-medium mb-0.5">
              {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-xl font-bold text-[#111827]">
              {allToday.length === 0 ? "Heute keine Termine" : `${allToday.length} Termin${allToday.length !== 1 ? "e" : ""} heute`}
            </h1>
          </div>
          <button onClick={() => setShowForm(true)}
            className="hidden md:flex items-center gap-2 bg-[#18A66D] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#15955F] transition active:scale-[.97]">
            + Termin
          </button>
        </div>

        {/* ── Tages-Fortschritt (nur wenn Termine da) ── */}
        {allToday.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#6B7280]">{doneCount} von {allToday.length} erledigt</span>
                <span className="text-xs font-bold text-[#18A66D]">{Math.round((doneCount / allToday.length) * 100)} %</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#18A66D] rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((doneCount / allToday.length) * 100)}%` }} />
              </div>
            </div>
            {openCount > 0 && (
              <div className="text-right shrink-0">
                <div className="text-lg font-black text-[#111827]">{openCount}</div>
                <div className="text-xs text-[#9CA3AF] font-medium">offen</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-5 items-start">

          {/* ── Terminliste ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {allToday.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">📅</div>
                  <div className="text-sm font-semibold text-[#374151] mb-1">Noch keine Termine für heute</div>
                  <div className="text-xs text-[#9CA3AF]">Tippe auf + um einen Termin hinzuzufügen</div>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {allToday.map((a: any) => {
                    const isDone = a.status === "done"
                    const isNext = a.id === nextOpen?.id
                    const isNew  = a.id === justAddedId
                    return (
                      <div key={a.id}
                        className={`flex items-center gap-4 px-5 py-4 transition-all ${
                          isDone ? "opacity-40" : isNext ? "bg-[#F0FBF6]" : "hover:bg-[#FAFAFA]"
                        } ${isNew ? "animate-pulse" : ""}`}>
                        {/* Zeit-Badge */}
                        <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 min-w-[46px] text-center ${
                          isNext ? "bg-[#18A66D] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}>
                          {a.time}
                        </div>
                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold truncate ${isDone ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>
                            {a.name}
                          </div>
                          {a.note && <div className="text-xs text-[#9CA3AF] truncate mt-0.5">{a.note}</div>}
                        </div>
                        {/* Erledigt */}
                        <button onClick={() => toggleDone(a)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isDone ? "bg-[#18A66D] border-[#18A66D]" : "border-[#D1D5DB] hover:border-[#18A66D]"
                          }`}>
                          {isDone && <span className="text-white text-xs font-bold">✓</span>}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop Formular ── */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sticky top-20">
              <h2 className="text-sm font-bold text-[#111827] mb-4">Neuer Termin</h2>
              <AppointmentForm {...formProps} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobiler FAB ── */}
      <button onClick={() => setShowForm(true)}
        className="md:hidden fixed bottom-20 right-5 z-40 w-14 h-14 bg-[#18A66D] text-white text-3xl font-light rounded-full shadow-xl flex items-center justify-center hover:bg-[#15955F] transition active:scale-95">
        +
      </button>
    </div>
  )
}
