"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import SetupChecklist from "../components/SetupChecklist"

export default function Dashboard() {

    useEffect(() => { document.title = "Dashboard | TerminStop" }, [])

const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")

  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) { window.location.href = "/login"; return }

    // Pausiert-Check bei jedem Dashboard-Aufruf
    supabase
      .from("companies")
      .select("paused")
      .eq("id", storedId)
      .single()
      .then(({ data }) => {
        if (data?.paused) {
          localStorage.removeItem("company_id")
          localStorage.removeItem("company_name")
          window.location.href = "/login"
        } else {
          setCompanyId(storedId)
          setCompanyName(storedName || "")
        }
      })
  }, [])

  async function loadAppointments() {
    if (!companyId) return
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: true })
      .order("time", { ascending: true })
    if (error) { console.log("LOAD ERROR:", error); return }
    if (data) setAppointments(data)
  }

  useEffect(() => {
    if (companyId) {
      loadAppointments()
      loadCustomers()
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

  async function toggleDone(a: any) {
    const newStatus = a.status === "done" ? "pending" : "done"
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", a.id)
    if (error) console.log("UPDATE ERROR:", error)
    loadAppointments()
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (!companyId) { console.log("NO COMPANY ID"); return }
    if (!name || !phone || !date || !time) { console.log("FEHLENDE FELDER"); return }

    setIsSubmitting(true)

    const { data, error } = await supabase
      .from("appointments")
      .insert([{ name, phone, date, time, note, status: "pending", company_id: companyId }])
      .select()

    console.log("INSERT DATA:", data)
    console.log("INSERT ERROR:", error)

    if (error) { alert("Fehler beim Speichern"); setIsSubmitting(false); return }

    if (data) {
      setJustAddedId(data[0].id)
      setTimeout(() => setJustAddedId(null), 1200)
    }

    setName(""); setPhone(""); setDate(""); setTime(""); setNote("")
    setIsSubmitting(false)
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 2500)
    loadAppointments()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const now = new Date()
  const todayStr = now.toISOString().split("T")[0]

  const filteredAppointments = appointments.filter(a => a.date === todayStr)

  const nextOpen = filteredAppointments.find(a => {
    if (a.status === "done") return false
    const dateTime = new Date(`${a.date}T${a.time}`)
    return dateTime.getTime() >= now.getTime() - 30 * 60 * 1000 // ab 30 min vor dem Termin anzeigen
  })
  const doneCount = filteredAppointments.filter(a => a.status === "done").length
  const openCount = filteredAppointments.filter(a => a.status !== "done").length
  const completionPct = filteredAppointments.length > 0
    ? Math.round((doneCount / filteredAppointments.length) * 100)
    : 0

  const greeting = () => {
    const h = now.getHours()
    if (h < 12) return "Guten Morgen"
    if (h < 18) return "Guten Tag"
    return "Guten Abend"
  }

  const inp = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"

  const AppointmentForm = () => (
    <form onSubmit={async (e) => { await handleSubmit(e); setShowForm(false) }} className="flex flex-col gap-4">
      {/* Name */}
      <div className="relative">
        <label className="block text-xs font-bold text-[#6B7280] mb-1.5">Name</label>
        <input className={inp} placeholder="Max Mustermann" value={name}
          onChange={e => { setName(e.target.value); setCustomerSearch(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off" />
        {showSuggestions && customerSearch.length > 0 && (
          <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
            {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 5).map(c => (
              <button key={c.id} type="button"
                onMouseDown={() => { setName(c.name); setPhone(c.phone); setCustomerSearch(""); setShowSuggestions(false) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F0FDF6] transition flex items-center justify-between">
                <span className="font-semibold text-[#111827]">{c.name}</span>
                <span className="text-xs text-[#9CA3AF]">{c.phone}</span>
              </button>
            ))}
            {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).length === 0 && (
              <div className="px-4 py-3 text-xs text-[#9CA3AF]">Nicht in der Kartei</div>
            )}
          </div>
        )}
      </div>
      {/* Telefon */}
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-1.5">Telefonnummer</label>
        <input className={inp} placeholder="0151 12345678" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
      </div>
      {/* Datum + Zeit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-1.5">Datum</label>
          <input type="date" className={inp} value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-1.5">Uhrzeit</label>
          <input type="time" className={inp} value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </div>
      {/* Notiz */}
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-1.5">Notiz <span className="font-normal">(optional)</span></label>
        <input className={inp} placeholder="z.B. Erstbesuch" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          formSuccess ? "bg-[#F0FBF6] text-[#18A66D] border border-[#D1F5E3]"
          : isSubmitting ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          : "bg-[#18A66D] text-white hover:bg-[#15955F]"
        }`}>
        {formSuccess ? "✓ Gespeichert!" : isSubmitting ? "Speichert …" : "Termin speichern →"}
      </button>
    </form>
  )

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F9FAFB" }}>
      <DashNav active="/dashboard" companyId={companyId} onLogout={handleLogout} />

      {/* ── Mobiles Formular-Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden" style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full bg-white rounded-t-2xl p-6 pb-8 max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111827]">Neuer Termin</h2>
              <button onClick={() => setShowForm(false)} className="text-[#9CA3AF] text-xl font-light">✕</button>
            </div>
            <AppointmentForm />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-10">

        {/* Onboarding */}
        {companyId && <SetupChecklist companyId={companyId} appointmentCount={appointments.length} />}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-[#9CA3AF] font-medium">
              {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-xl font-bold text-[#111827]">
              {filteredAppointments.length === 0
                ? "Heute keine Termine"
                : `${filteredAppointments.length} ${filteredAppointments.length === 1 ? "Termin" : "Termine"} heute`}
            </h1>
          </div>
          {/* + Button Desktop */}
          <button onClick={() => setShowForm(true)}
            className="hidden md:flex items-center gap-2 bg-[#18A66D] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#15955F] transition">
            + Termin
          </button>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Terminliste ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">📅</div>
                  <div className="text-sm font-semibold text-[#374151] mb-1">Noch keine Termine für heute</div>
                  <div className="text-xs text-[#9CA3AF]">Tippe auf + um einen Termin hinzuzufügen</div>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {filteredAppointments.map((a: any) => {
                    const isDone = a.status === "done"
                    const isNext = a.id === nextOpen?.id
                    const isNew = a.id === justAddedId
                    return (
                      <div key={a.id}
                        className={`flex items-center gap-4 px-5 py-4 transition-all ${
                          isDone ? "opacity-40" : isNext ? "bg-[#F0FBF6]" : "hover:bg-[#FAFAFA]"
                        } ${isNew ? "animate-pulse" : ""}`}>
                        {/* Zeit */}
                        <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 ${
                          isNext ? "bg-[#18A66D] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}>
                          {a.time}
                        </div>
                        {/* Name + Notiz */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold truncate ${isDone ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>
                            {a.name}
                          </div>
                          {a.note && <div className="text-xs text-[#9CA3AF] truncate">{a.note}</div>}
                        </div>
                        {/* Erledigt-Button */}
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

          {/* ── Desktop Formular (seitlich) ── */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-sm font-bold text-[#111827] mb-4">Neuer Termin</h2>
              <AppointmentForm />
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobiler FAB ── */}
      <button onClick={() => setShowForm(true)}
        className="md:hidden fixed bottom-20 right-5 z-40 w-14 h-14 bg-[#18A66D] text-white text-2xl font-bold rounded-full shadow-xl flex items-center justify-center hover:bg-[#15955F] transition">
        +
      </button>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
