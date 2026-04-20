"use client"

import { useEffect, useState } from "react"
import { DEMO_COMPANY, generateDemoAppointments } from "../demoData"

function DemoBanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #7C3AED, #9333EA)",
      color: "white", padding: "10px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontSize: "13px", fontWeight: 600, gap: 12, flexWrap: "wrap",
    }}>
      <span>🎭 Demo-Modus – Alle Daten sind fiktiv · Keine SMS werden versendet</span>
      <a href="/lead" style={{ background: "white", color: "#7C3AED", padding: "6px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "12px", whiteSpace: "nowrap" }}>
        Jetzt kostenlos testen →
      </a>
    </div>
  )
}

export default function DemoCalendarPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [view, setView] = useState<"day" | "week">("day")
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    setAppointments(generateDemoAppointments())
  }, [])

  function toggleDone(a: any) {
    const updated = { ...a, status: a.status === "done" ? "pending" : "done" }
    setAppointments(prev => prev.map(x => x.id === a.id ? updated : x))
    if (selected?.id === a.id) setSelected(updated)
  }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const hours = Array.from({ length: 15 }, (_, i) => i + 6) // 6–20
  const dayAppointments = appointments.filter(a => a.date === todayStr).sort((a, b) => a.time.localeCompare(b.time))
  const doneToday = dayAppointments.filter(a => a.status === "done").length
  const openToday = dayAppointments.filter(a => a.status !== "done").length
  const currentHour = today.getHours()

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() + i)
    return d
  })

  return (
    <div className="min-h-screen text-[#1F2A37] overflow-x-hidden" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F7FAFC" }}>
      <style>{`
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
        @media (min-width: 768px) { .demo-bottom-nav { display: none !important; } }
      `}</style>

      <DemoBanner />

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 58 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="/" style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.3px", textDecoration: "none" }}>
            <span style={{ color: "#18A66D" }}>Termin</span><span style={{ color: "#111827" }}>Stop</span>
          </a>
          <div className="hidden md:flex" style={{ gap: 2 }}>
            {[
              { href: "/demo", label: "Dashboard" },
              { href: "/demo/calendar", label: "Kalender", active: true },
              { href: "/demo/customers", label: "Kunden" },
            ].map(item => (
              <a key={item.href} href={item.href} style={{ position: "relative", textDecoration: "none", padding: "6px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: item.active ? 700 : 500, color: item.active ? "#111827" : "#6B7280", background: item.active ? "#F0FBF6" : "transparent" }}>
                {item.label}
                {item.active && <span style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, borderRadius: 99, background: "#18A66D" }} />}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 6, fontSize: 12, color: "#18A66D", fontWeight: 600, marginRight: 4 }}>
            <span style={{ width: 7, height: 7, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
            Demo aktiv
          </div>
          <a href="/demo/buchung" className="hidden md:inline-flex" style={{ alignItems: "center", gap: 6, background: "#0F1923", color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 13px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(24,166,109,0.4)" }}>
            <span style={{ width: 6, height: 6, background: "#18A66D", borderRadius: "50%", display: "inline-block" }} />
            Buchungs-Add-on
          </a>
          <a href="/lead" style={{ fontSize: 13, color: "#fff", background: "#18A66D", padding: "7px 16px", borderRadius: 9, fontWeight: 700, textDecoration: "none" }}>
            Jetzt testen →
          </a>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="demo-bottom-nav">
        {[
          { href: "/demo", label: "Start", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/></svg> },
          { href: "/demo/calendar", label: "Kalender", active: true, icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
          { href: "/demo/customers", label: "Kunden", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { href: "/demo/buchung", label: "Buchung", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
          { href: "/lead", label: "Testen", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ position: "relative", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, padding: "4px 8px", textDecoration: "none", color: item.active ? "#18A66D" : "#9CA3AF", minWidth: 44 }}>
            {item.active && <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, borderRadius: 99, background: "#18A66D" }} />}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, letterSpacing: 0.2 }}>{item.label}</span>
          </a>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 pb-24 md:pb-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs text-[#6B7280] font-medium mb-1 uppercase tracking-wider">
              {today.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
              {view === "day" ? "Tagesansicht" : "Wochenansicht"}
            </h1>
            <p className="text-[#6B7280] mt-1 text-sm">
              {view === "day"
                ? `${dayAppointments.length} Termine heute · ${doneToday} erledigt · ${openToday} offen`
                : "Übersicht der nächsten 7 Tage"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm self-start">
            <button onClick={() => setView("day")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${view === "day" ? "bg-[#18A66D] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1F2A37]"}`}>Tag</button>
            <button onClick={() => setView("week")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${view === "week" ? "bg-[#18A66D] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1F2A37]"}`}>Woche</button>
          </div>
        </div>

        {/* DAY KPI */}
        {view === "day" && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 shadow-sm">
              <div className="text-xs text-[#6B7280] uppercase tracking-wide font-medium mb-2">Gesamt</div>
              <div className="text-2xl font-black text-[#1F2A37]">{dayAppointments.length}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">Termine heute</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 shadow-sm">
              <div className="text-xs text-[#6B7280] uppercase tracking-wide font-medium mb-2">Erledigt</div>
              <div className="text-2xl font-black text-[#18A66D]">{doneToday}</div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-2">
                <div className="bg-[#18A66D] h-1.5 rounded-full transition-all duration-700"
                  style={{ width: dayAppointments.length > 0 ? `${Math.round((doneToday / dayAppointments.length) * 100)}%` : "0%" }} />
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 shadow-sm">
              <div className="text-xs text-[#6B7280] uppercase tracking-wide font-medium mb-2">Offen</div>
              <div className="text-2xl font-black text-[#1F2A37]">{openToday}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">Noch ausstehend</div>
            </div>
          </div>
        )}

        {/* DAY VIEW */}
        {view === "day" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1F2A37]">Stundenplan</h2>
              <span className="text-xs text-[#6B7280]">06:00 – 20:59 Uhr</span>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {hours.map((hour) => {
                const slot = dayAppointments.filter((a: any) => parseInt(a.time.split(":")[0]) === hour)
                const isCurrent = hour === currentHour
                const isPast = hour < currentHour
                return (
                  <div key={hour} className={`flex gap-4 px-6 py-4 transition ${isCurrent ? "bg-[#F0FDF6]" : isPast ? "opacity-50" : ""}`}>
                    <div className="flex-shrink-0 w-16 pt-0.5">
                      <div className={`text-xs font-bold ${isCurrent ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
                        {String(hour).padStart(2, "0")}:00
                      </div>
                      {isCurrent && <div className="text-[9px] text-[#18A66D] font-semibold mt-0.5">Jetzt</div>}
                    </div>
                    <div className="flex-1">
                      {slot.length === 0 ? (
                        <div className="text-xs text-[#D1D5DB] py-1">—</div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {slot.map((a: any) => {
                            const isDone = a.status === "done"
                            return (
                              <div
                                key={a.id}
                                onClick={() => setSelected(a)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition ${
                                  isDone ? "bg-[#F0FDF6] border border-[#6EE7B7]/40" : "bg-[#1F2A37] text-white hover:bg-[#2D3A4A]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${isDone ? "bg-[#D1FAE5] text-[#18A66D]" : "bg-white/10 text-white/80"}`}>
                                    {a.time}
                                  </div>
                                  <div>
                                    <div className={`text-sm font-semibold ${isDone ? "text-[#1F2A37] line-through opacity-60" : "text-white"}`}>{a.name}</div>
                                    {a.note && <div className={`text-xs mt-0.5 ${isDone ? "text-[#6B7280]" : "text-white/50"}`}>{a.note}</div>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${isDone ? "bg-[#D1FAE5] text-[#18A66D]" : "bg-[#18A66D]/20 text-[#18A66D]"}`}>
                                    <span className="w-1 h-1 bg-[#18A66D] rounded-full" />
                                    SMS ✓
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleDone(a) }}
                                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                                      isDone ? "bg-[#18A66D] border-[#18A66D]" : "border-white/30 hover:border-white"
                                    }`}
                                  >
                                    {isDone && <span className="text-white text-xs">✓</span>}
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {view === "week" && (
          <>
            {/* Mobile: alle 7 Tage, horizontal scrollbar (2 sichtbar) */}
            <div className="md:hidden overflow-x-auto pb-2">
              <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                {weekDays.map((day, i) => {
                  const dStr = day.toISOString().split("T")[0]
                  const items = appointments.filter(a => a.date === dStr).sort((a, b) => a.time.localeCompare(b.time))
                  const isToday = dStr === todayStr
                  const doneCount = items.filter(a => a.status === "done").length
                  return (
                    <div key={i} style={{ width: "calc(50vw - 24px)", minWidth: 160 }} className={`rounded-2xl border overflow-hidden transition flex-shrink-0 ${isToday ? "border-[#18A66D] shadow-md shadow-[#18A66D]/10" : "border-[#E5E7EB] bg-white"}`}>
                      <div className={`px-4 py-3 text-center border-b ${isToday ? "bg-[#18A66D]" : "bg-[#F7FAFC] border-[#E5E7EB]"}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-white/80" : "text-[#9CA3AF]"}`}>
                          {day.toLocaleDateString("de-DE", { weekday: "long" })}
                        </div>
                        <div className={`text-2xl font-black mt-0.5 ${isToday ? "text-white" : "text-[#1F2A37]"}`}>
                          {day.getDate()}. {day.toLocaleDateString("de-DE", { month: "short" })}
                        </div>
                        {items.length > 0 && (
                          <div className={`text-[10px] font-medium mt-1 ${isToday ? "text-white/70" : "text-[#6B7280]"}`}>
                            {items.length} Termin{items.length !== 1 ? "e" : ""}
                          </div>
                        )}
                      </div>
                      <div className={`p-3 flex flex-col gap-2 overflow-y-auto ${isToday ? "bg-[#F0FDF6]" : "bg-white"}`} style={{ minHeight: 160, maxHeight: 280 }}>
                        {items.length === 0 ? (
                          <div className="flex items-center justify-center h-full pt-6">
                            <span className="text-xs text-[#D1D5DB]">Keine Termine</span>
                          </div>
                        ) : (
                          items.map((a: any) => (
                            <div
                              key={a.id}
                              onClick={() => setSelected(a)}
                              className={`text-xs px-3 py-2 rounded-xl cursor-pointer transition flex items-center gap-2 ${
                                a.status === "done" ? "bg-[#D1FAE5] text-[#18A66D] line-through opacity-60"
                                : isToday ? "bg-[#18A66D] text-white"
                                : "bg-[#F7FAFC] text-[#1F2A37] border border-[#E5E7EB]"
                              }`}
                            >
                              <span className="font-bold shrink-0">{a.time}</span>
                              <span className="truncate">{a.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                      {items.length > 0 && (
                        <div className="px-3 pb-3">
                          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                            <div className="bg-[#18A66D] h-1.5 rounded-full transition-all" style={{ width: `${Math.round((doneCount / items.length) * 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Desktop: 7 Tage Grid, scrollbar */}
            <div className="hidden md:grid grid-cols-7 gap-3">
              {weekDays.map((day, i) => {
                const dStr = day.toISOString().split("T")[0]
                const items = appointments.filter(a => a.date === dStr).sort((a, b) => a.time.localeCompare(b.time))
                const isToday = dStr === todayStr
                const doneCount = items.filter(a => a.status === "done").length
                return (
                  <div key={i} className={`rounded-2xl border overflow-hidden transition ${isToday ? "border-[#18A66D] shadow-md shadow-[#18A66D]/10" : "border-[#E5E7EB] bg-white"}`}>
                    <div className={`px-3 py-3 text-center border-b ${isToday ? "bg-[#18A66D]" : "bg-[#F7FAFC] border-[#E5E7EB]"}`}>
                      <div className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-white/80" : "text-[#9CA3AF]"}`}>
                        {day.toLocaleDateString("de-DE", { weekday: "short" })}
                      </div>
                      <div className={`text-xl font-black mt-0.5 ${isToday ? "text-white" : "text-[#1F2A37]"}`}>{day.getDate()}</div>
                      {items.length > 0 && (
                        <div className={`text-[10px] font-medium mt-1 ${isToday ? "text-white/70" : "text-[#6B7280]"}`}>
                          {items.length} Termin{items.length !== 1 ? "e" : ""}
                        </div>
                      )}
                    </div>
                    <div className={`p-2 flex flex-col gap-1.5 overflow-y-auto ${isToday ? "bg-[#F0FDF6]" : "bg-white"}`} style={{ minHeight: 120, maxHeight: 320 }}>
                      {items.length === 0 ? (
                        <div className="flex items-center justify-center h-full pt-4">
                          <span className="text-[10px] text-[#D1D5DB]">Frei</span>
                        </div>
                      ) : (
                        items.map((a: any) => (
                          <div
                            key={a.id}
                            onClick={() => setSelected(a)}
                            className={`text-[10px] px-2 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1 ${
                              a.status === "done" ? "bg-[#D1FAE5] text-[#18A66D] line-through opacity-60"
                              : isToday ? "bg-[#18A66D] text-white"
                              : "bg-[#F7FAFC] text-[#1F2A37] border border-[#E5E7EB] hover:border-[#18A66D]"
                            }`}
                          >
                            <span className="font-bold shrink-0">{a.time}</span>
                            <span className="truncate">{a.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {items.length > 0 && (
                      <div className="px-2 pb-2">
                        <div className="w-full bg-[#E5E7EB] rounded-full h-1">
                          <div className="bg-[#18A66D] h-1 rounded-full transition-all" style={{ width: `${Math.round((doneCount / items.length) * 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* DETAIL POPUP */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-5 ${selected.status === "done" ? "bg-[#F0FDF6]" : "bg-[#1F2A37]"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-xs font-semibold uppercase tracking-wider ${selected.status === "done" ? "text-[#18A66D]" : "text-white/50"}`}>Termindetails</div>
                <button onClick={() => setSelected(null)} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition ${selected.status === "done" ? "bg-[#E5E7EB] text-[#6B7280] hover:bg-[#D1D5DB]" : "bg-white/10 text-white hover:bg-white/20"}`}>✕</button>
              </div>
              <div className={`text-xl font-bold ${selected.status === "done" ? "text-[#1F2A37]" : "text-white"}`}>{selected.name}</div>
              <div className={`text-sm mt-1 ${selected.status === "done" ? "text-[#6B7280]" : "text-white/60"}`}>{selected.date} · {selected.time} Uhr</div>
            </div>
            <div className="px-6 py-5 space-y-4">
              {selected.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F7FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-sm shrink-0">📞</div>
                  <div>
                    <div className="text-xs text-[#6B7280] font-medium">Telefon</div>
                    <div className="text-sm font-semibold text-[#1F2A37]">{selected.phone}</div>
                  </div>
                </div>
              )}
              {selected.note && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F7FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-sm shrink-0">📝</div>
                  <div>
                    <div className="text-xs text-[#6B7280] font-medium">Notiz</div>
                    <div className="text-sm text-[#1F2A37]">{selected.note}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8FBF3] border border-[#6EE7B7]/40 rounded-lg flex items-center justify-center text-sm shrink-0">📱</div>
                <div>
                  <div className="text-xs text-[#6B7280] font-medium">SMS-Erinnerung</div>
                  <div className="text-sm font-semibold text-[#18A66D]">Gesendet ✓</div>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${selected.status === "done" ? "bg-[#E8FBF3] text-[#18A66D]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                <span>{selected.status === "done" ? "✓ Termin wahrgenommen" : "⏳ Ausstehend"}</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => toggleDone(selected)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-md ${
                  selected.status === "done"
                    ? "bg-[#F7FAFC] border border-[#E5E7EB] text-[#6B7280] hover:bg-[#E5E7EB]"
                    : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-[#18A66D]/20"
                }`}
              >
                {selected.status === "done" ? "Als offen markieren" : "Als erledigt markieren ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
