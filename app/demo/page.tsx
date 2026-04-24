"use client"

import { useState, useEffect } from "react"
import { DEMO_COMPANY, generateDemoAppointments } from "./demoData"

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconLink = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

// ── DemoForm ──────────────────────────────────────────────────────────────────
interface DemoFormProps {
  name: string; setName: (v: string) => void
  phone: string; setPhone: (v: string) => void
  date: string; setDate: (v: string) => void
  time: string; setTime: (v: string) => void
  note: string; setNote: (v: string) => void
  isSubmitting: boolean; formSuccess: boolean
  onSubmit: (e: React.FormEvent) => void
}
function DemoForm({ name, setName, phone, setPhone, date, setDate, time, setTime, note, setNote, isSubmitting, formSuccess, onSubmit }: DemoFormProps) {
  const inp = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Name</label>
        <input className={inp} placeholder="Max Mustermann" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Telefonnummer</label>
        <input className={inp} placeholder="0151 12345678" value={phone} onChange={e => setPhone(e.target.value)} type="tel" required />
      </div>
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
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">
          Notiz <span className="font-normal normal-case text-[#9CA3AF]">(optional)</span>
        </label>
        <input className={inp} placeholder="z.B. Erstbesuch" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="flex items-center gap-2.5 bg-[#F0FBF6] border border-[#D1F5E3] rounded-xl px-4 py-3">
        <span className="text-base">📱</span>
        <div>
          <div className="text-xs font-semibold text-[#18A66D]">SMS-Erinnerung automatisch geplant</div>
          <div className="text-xs text-[#18A66D]/70">24 Stunden vor dem Termin</div>
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          formSuccess ? "bg-[#F0FBF6] text-[#18A66D] border border-[#D1F5E3]"
          : isSubmitting ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          : "bg-[#18A66D] text-white hover:bg-[#15955F] active:scale-[.98]"
        }`}>
        {formSuccess ? "✓ Termin gespeichert!" : isSubmitting ? "Speichert …" : "Termin speichern →"}
      </button>
    </form>
  )
}

// ── Main Demo Page ────────────────────────────────────────────────────────────
export default function DemoDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId]   = useState<string | null>(null)
  const [formSuccess, setFormSuccess]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm]         = useState(false)

  const [name, setName]   = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate]   = useState("")
  const [time, setTime]   = useState("")
  const [note, setNote]   = useState("")

  useEffect(() => { setAppointments(generateDemoAppointments()) }, [])

  function toggleDone(a: any) {
    setAppointments(prev => prev.map(x => x.id === a.id ? { ...x, status: x.status === "done" ? "pending" : "done" } : x))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !date || !time) return
    setIsSubmitting(true)
    setTimeout(() => {
      const newId = `demo-${Date.now()}`
      setAppointments(prev => [...prev, { id: newId, name, phone, date, time, note, status: "pending" }])
      setJustAddedId(newId); setTimeout(() => setJustAddedId(null), 1200)
      setName(""); setPhone(""); setDate(""); setTime(""); setNote("")
      setIsSubmitting(false); setFormSuccess(true)
      setTimeout(() => { setFormSuccess(false); setShowForm(false) }, 1800)
    }, 500)
  }

  const now      = new Date()
  const todayStr = now.toISOString().split("T")[0]
  const allToday = appointments.filter(a => a.date === todayStr).sort((a, b) => a.time.localeCompare(b.time))
  const doneCount = allToday.filter(a => a.status === "done").length
  const openCount = allToday.filter(a => a.status !== "done").length
  const pct       = allToday.length > 0 ? Math.round((doneCount / allToday.length) * 100) : 0
  const nextOpen  = allToday.find(a => {
    if (a.status === "done") return false
    const [h, m] = a.time.split(":").map(Number)
    return new Date(a.date).setHours(h, m) >= now.getTime() - 30 * 60 * 1000
  })

  const formProps: DemoFormProps = { name, setName, phone, setPhone, date, setDate, time, setTime, note, setNote, isSubmitting, formSuccess, onSubmit: handleSubmit }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Manrope',sans-serif", background: "#F9FAFB" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        /* Bottom nav: flex on mobile, gone on tablet/desktop */
        .demo-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #E5E7EB;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
          z-index: 50;
          padding-top: 8px;
          padding-bottom: max(10px, env(safe-area-inset-bottom));
          justify-content: space-around;
          align-items: center;
        }
        @media (min-width: 768px) { .demo-bottom-nav { display: none; } }
        .demo-nav-link { transition: background .12s, color .12s; text-decoration: none; }
        .demo-nav-link:hover { background: #F9FAFB !important; }
      `}</style>

      {/* Demo Banner */}
      <div style={{ background: "linear-gradient(90deg,#7C3AED,#9333EA)", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 600, gap: 12, flexWrap: "wrap" }}>
        <span>🎭 Demo-Modus – Alle Daten sind fiktiv · Keine SMS werden versendet</span>
        <a href="/register" style={{ background: "#fff", color: "#7C3AED", padding: "6px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 12, whiteSpace: "nowrap" }}>
          Kostenlos registrieren →
        </a>
      </div>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 58 }}>
        {/* Left: Logo + page links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="/" style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.3px", textDecoration: "none" }}>
            <span style={{ color: "#18A66D" }}>Termin</span><span style={{ color: "#111827" }}>Stop</span>
          </a>
          <div className="hidden md:flex" style={{ gap: 2 }}>
            {[
              { href: "/demo", label: "Dashboard", active: true },
              { href: "/demo/calendar", label: "Kalender" },
              { href: "/demo/customers", label: "Kunden" },
            ].map(item => (
              <a key={item.href} href={item.href} className="demo-nav-link" style={{
                position: "relative", padding: "6px 14px",
                borderRadius: 9, fontSize: 13.5,
                fontWeight: item.active ? 700 : 500,
                color: item.active ? "#111827" : "#6B7280",
                background: item.active ? "#F0FBF6" : "transparent",
              }}>
                {item.label}
                {item.active && <span style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, borderRadius: 99, background: "#18A66D" }} />}
              </a>
            ))}
          </div>
        </div>

        {/* Right: demo indicator + add-on pill + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Demo pulse */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 6, fontSize: 12, color: "#18A66D", fontWeight: 600, marginRight: 4 }}>
            <span style={{ width: 7, height: 7, background: "#18A66D", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            Demo aktiv
          </div>
          {/* Booking page demo pill */}
          <a href="/demo/buchung" className="hidden md:inline-flex" style={{
            alignItems: "center", gap: 6,
            background: "#0F1923", color: "#fff",
            fontSize: 12, fontWeight: 700,
            padding: "6px 13px", borderRadius: 8,
            textDecoration: "none",
            border: "1px solid rgba(24,166,109,0.4)",
          }}>
            <span style={{ width: 6, height: 6, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
            Buchungsseite Demo
          </a>
          <a href="/register" style={{ fontSize: 13, color: "#fff", background: "#18A66D", padding: "7px 16px", borderRadius: 9, fontWeight: 700, textDecoration: "none" }}>
            Kostenlos registrieren →
          </a>
        </div>
      </nav>

      {/* Mobile form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111827]">Neuer Termin</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-sm">✕</button>
            </div>
            <DemoForm {...formProps} />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-10">

        {/* Header */}
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

        {/* Progress bar */}
        {allToday.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#6B7280]">{doneCount} von {allToday.length} erledigt</span>
                <span className="text-xs font-bold text-[#18A66D]">{pct} %</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#18A66D] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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

        {/* Buchungs-Add-on Banner */}
        <a href="/demo/buchung" style={{ display: "block", textDecoration: "none", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔗</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>Buchungsseite Demo</div>
                <div style={{ fontSize: 12, color: "#B45309" }}>So buchen Ihre Kunden rund um die Uhr — interaktive Demo ansehen</div>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 14px", whiteSpace: "nowrap" }}>
              Demo ansehen →
            </span>
          </div>
        </a>

        <div className="flex gap-5 items-start">
          {/* Appointment list */}
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
                      <div key={a.id} className={`flex items-center gap-4 px-5 py-4 transition-all ${isDone ? "opacity-40" : isNext ? "bg-[#F0FBF6]" : "hover:bg-[#FAFAFA]"} ${isNew ? "animate-pulse" : ""}`}>
                        <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 min-w-[46px] text-center ${isNext ? "bg-[#18A66D] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                          {a.time}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold truncate ${isDone ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>{a.name}</div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {a.employee_name && (
                              <span style={{ fontSize: 11, color: a.employee_color, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: a.employee_color }} />
                                {a.employee_name}
                              </span>
                            )}
                            {a.service_name && <span className="text-xs text-[#9CA3AF]">{a.service_name}</span>}
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#18A66D] bg-[#F0FBF6] px-2.5 py-1 rounded-full font-medium shrink-0">
                          <span className="w-1 h-1 bg-[#18A66D] rounded-full" />SMS ✓
                        </div>
                        <button onClick={() => toggleDone(a)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? "bg-[#18A66D] border-[#18A66D]" : "border-[#D1D5DB] hover:border-[#18A66D]"}`}>
                          {isDone && <span className="text-white text-xs font-bold">✓</span>}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop form */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sticky top-20">
              <h2 className="text-sm font-bold text-[#111827] mb-4">Neuer Termin</h2>
              <DemoForm {...formProps} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button onClick={() => setShowForm(true)}
        className="md:hidden fixed bottom-20 right-5 z-40 w-14 h-14 bg-[#18A66D] text-white text-3xl font-light rounded-full shadow-xl flex items-center justify-center hover:bg-[#15955F] transition active:scale-95">
        +
      </button>

      {/* Mobile Bottom Nav — controlled entirely by CSS class (no inline display) */}
      <div className="demo-bottom-nav">
        {[
          { href: "/demo", label: "Start", icon: <IconHome />, active: true },
          { href: "/demo/calendar", label: "Kalender", icon: <IconCalendar /> },
          { href: "/demo/customers", label: "Kunden", icon: <IconUsers /> },
          { href: "/demo/buchung", label: "Buchung", icon: <IconLink /> },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px", textDecoration: "none", color: item.active ? "#18A66D" : "#9CA3AF", minWidth: 52 }}>
            {item.active && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, borderRadius: 99, background: "#18A66D" }} />}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, letterSpacing: .2 }}>{item.label}</span>
          </a>
        ))}
        <a href="/register" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px", textDecoration: "none", color: "#18A66D", minWidth: 52 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: .2 }}>Registrieren</span>
        </a>
      </div>
    </div>
  )
}
