"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Dashboard() {

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")

  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) window.location.href = "/login"
    else {
      setCompanyId(storedId)
      setCompanyName(storedName || "")
    }
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

  return (
    <div
      className="min-h-screen text-[#1F2A37] overflow-x-hidden"
      style={{
        fontFamily: "'Inter', 'Manrope', sans-serif",
        backgroundColor: "#F7FAFC"
      }}
    >

      {/* ─── NAV ─── */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1">
            <a href="/dashboard" className="text-sm font-semibold text-[#1F2A37] bg-[#F7FAFC] px-4 py-2 rounded-lg">Dashboard</a>
            <a href="/calendar" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Kalender</a>
            <a href="/customers" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Kunden</a>
            <a href="/insights" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Einblicke</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#18A66D] font-medium">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
            System aktiv
          </div>
          <button onClick={handleLogout} className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">
            Logout
          </button>
        </div>
      </nav>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 flex justify-around items-center px-2 py-2">
        {[
          { href: "/dashboard", label: "Dashboard", icon: "🏠", active: true },
          { href: "/calendar", label: "Kalender", icon: "📅" },
          { href: "/customers", label: "Kunden", icon: "👥" },
          { href: "/insights", label: "Einblicke", icon: "📊" },
        ].map((item) => (
          <a key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${item.active ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[#9CA3AF]">
          <span className="text-lg">🚪</span>
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 pb-24 md:pb-10">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs text-[#6B7280] font-medium mb-1 uppercase tracking-wider">
              {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
              {greeting()}, <span className="text-[#18A66D]">{companyName || "Ihr Unternehmen"}</span>
            </h1>
            <p className="text-[#6B7280] mt-1 text-sm">Hier ist Ihre Übersicht für heute.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#E8FBF3] border border-[#6EE7B7] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
            SMS-Erinnerungen aktiv
          </div>
        </div>

        {/* ─── KPI CARDS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

          {/* Heute gesamt */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium mb-3 uppercase tracking-wide">Heute</div>
            <div className="text-3xl font-black text-[#1F2A37]">{filteredAppointments.length}</div>
            <div className="text-xs text-[#6B7280] mt-1">Termine gesamt</div>
          </div>

          {/* Offen */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium mb-3 uppercase tracking-wide">Offen</div>
            <div className="text-3xl font-black text-[#1F2A37]">{openCount}</div>
            <div className="text-xs text-[#6B7280] mt-1">Noch ausstehend</div>
          </div>

          {/* Erledigt */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium mb-3 uppercase tracking-wide">Erledigt</div>
            <div className="text-3xl font-black text-[#18A66D]">{doneCount}</div>
            <div className="text-xs text-[#6B7280] mt-1">Abgeschlossen</div>
          </div>

          {/* Fortschritt */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium mb-3 uppercase tracking-wide">Fortschritt</div>
            <div className="text-3xl font-black text-[#1F2A37]">{completionPct}%</div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#18A66D] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ─── NEXT APPOINTMENT BANNER ─── */}
        {nextOpen && (
          <div className="bg-[#1F2A37] text-white rounded-2xl p-5 mb-8 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#18A66D] rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-lg">📍</span>
              </div>
              <div>
                <div className="text-xs text-white/50 font-medium uppercase tracking-wider mb-0.5">Nächster Termin</div>
                <div className="text-base font-bold">{nextOpen.name}</div>
                <div className="text-sm text-white/60">{nextOpen.time} Uhr{nextOpen.note ? ` · ${nextOpen.note}` : ""}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#18A66D]/20 border border-[#18A66D]/30 text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
              Erinnerung gesendet
            </div>
          </div>
        )}

        {/* ─── MAIN GRID: Liste + Formular ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── TERMINLISTE (3/5) ── */}
          <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1F2A37]">Heutige Termine</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {now.toLocaleDateString("de-DE", { day: "numeric", month: "long" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280]">{doneCount}/{filteredAppointments.length}</span>
                <div className="w-16 bg-[#E5E7EB] rounded-full h-1.5">
                  <div
                    className="bg-[#18A66D] h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>

          <div className="divide-y divide-[#F3F4F6] overflow-y-auto max-h-[500px]">
              {filteredAppointments.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <div className="text-sm font-semibold text-[#1F2A37] mb-1">Keine Termine heute</div>
                  <div className="text-xs text-[#6B7280]">Fügen Sie rechts einen neuen Termin hinzu.</div>
                </div>
              ) : (
                filteredAppointments.map((a: any) => {
                  const isDone = a.status === "done"
                  const isNew = a.id === justAddedId
                  const isNext = a.id === nextOpen?.id
                  const isPast = new Date(`${a.date}T${a.time}`).getTime() < now.getTime() - 30 * 60 * 1000

                  return (
                    <div
                      key={a.id}
                      className={`
                        flex items-center justify-between px-6 py-4 transition-all duration-300
                        ${isDone ? "opacity-35" : isPast ? "opacity-50 hover:opacity-70" : isNext ? "bg-[#F0FDF6]" : "hover:bg-[#FAFAFA]"}
                        ${isNew ? "animate-[fadeIn_0.4s_ease]" : ""}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Time badge */}
                        <div className={`
                          text-xs font-bold w-14 text-center py-1.5 rounded-lg shrink-0
                          ${isNext ? "bg-[#18A66D] text-white" : "bg-[#F7FAFC] text-[#6B7280]"}
                        `}>
                          {a.time}
                        </div>

                        <div>
                          <div className={`text-sm font-semibold ${isDone ? "line-through text-[#9CA3AF]" : "text-[#1F2A37]"}`}>
                            {a.name}
                          </div>
                          {a.note && (
                            <div className="text-xs text-[#9CA3AF] mt-0.5">{a.note}</div>
                          )}
                          {isNext && !isDone && (
                            <div className="text-xs text-[#18A66D] font-medium mt-0.5">Nächster Termin</div>
                          )}
                        </div>
                      </div>

                      {/* SMS badge + toggle */}
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#18A66D] bg-[#E8FBF3] px-2.5 py-1 rounded-full font-medium">
                          <span className="w-1 h-1 bg-[#18A66D] rounded-full" />
                          SMS ✓
                        </div>
                        <button
                          onClick={() => toggleDone(a)}
                          className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                            isDone
                              ? "bg-[#18A66D] border-[#18A66D]"
                              : "border-[#D1D5DB] hover:border-[#18A66D]"
                          }`}
                        >
                          {isDone && <span className="text-white text-xs">✓</span>}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── FORMULAR (2/5) ── */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#1F2A37]">Neuer Termin</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Termin eintragen & SMS-Erinnerung wird automatisch geplant</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">

              {/* Name mit Kunden-Auswahl */}
              <div className="relative">
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                  Name
                </label>
                <input
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                  placeholder="Max Mustermann"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setCustomerSearch(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                />
                {showSuggestions && customerSearch.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                      .slice(0, 5)
                      .map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onMouseDown={() => {
                            setName(c.name)
                            setPhone(c.phone)
                            setCustomerSearch("")
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F0FDF6] transition flex items-center justify-between"
                        >
                          <span className="font-medium text-[#1F2A37]">{c.name}</span>
                          <span className="text-xs text-[#9CA3AF]">{c.phone}</span>
                        </button>
                      ))
                    }
                    {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-3 text-xs text-[#9CA3AF]">Kein Treffer in der Kartei</div>
                    )}
                  </div>
                )}
              </div>

              {/* Telefon */}
              <div>
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                  Telefonnummer
                </label>
                <input
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                  placeholder="+49 170 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Datum + Uhrzeit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                    Datum
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm text-[#1F2A37] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                    Uhrzeit
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm text-[#1F2A37] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Notiz */}
              <div>
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                  Notiz <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span>
                </label>
                <input
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                  placeholder="z. B. Erstbesuch, Sonderwunsch..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* SMS Hinweis */}
              <div className="flex items-center gap-2.5 bg-[#E8FBF3] border border-[#6EE7B7]/50 rounded-xl px-4 py-3">
                <span className="text-base">📱</span>
                <div>
                  <div className="text-xs font-semibold text-[#18A66D]">SMS-Erinnerung wird automatisch geplant</div>
                  <div className="text-xs text-[#18A66D]/70">24 Stunden vor dem Termin</div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  mt-1 w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md
                  ${formSuccess
                    ? "bg-[#E8FBF3] text-[#18A66D] border border-[#6EE7B7]"
                    : isSubmitting
                    ? "bg-[#6B7280] text-white cursor-not-allowed"
                    : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-[#18A66D]/20"
                  }
                `}
              >
                {formSuccess ? "✓ Termin gespeichert!" : isSubmitting ? "Speichern..." : "Termin speichern →"}
              </button>

            </form>
          </div>

        </div>

        {/* ─── BOTTOM INFO BAR ─── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E5E7EB] rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-6 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
              <span>SMS-System aktiv</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-[#E5E7EB]" />
            <span>{appointments.length} Termine insgesamt</span>
            <div className="hidden sm:block h-3 w-px bg-[#E5E7EB]" />
            <span>Erfolgsquote 95%</span>
          </div>
          <div className="text-xs text-[#9CA3AF]">
            Zuletzt aktualisiert: {now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
          </div>
        </div>

      </div>
    </div>
  )
}
