"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"

type View = "day" | "week" | "month"

function toStr(d: Date) {
  return d.toISOString().split("T")[0]
}
function parseStr(s: string) {
  const [y, m, day] = s.split("-").map(Number)
  return new Date(y, m - 1, day)
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function startOfWeek(d: Date) {
  const r = new Date(d)
  const dow = r.getDay() === 0 ? 6 : r.getDay() - 1 // Mon=0
  r.setDate(r.getDate() - dow)
  return r
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const WEEKDAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
const MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]

export default function CalendarPage() {
  useEffect(() => { document.title = "Kalender | TerminStop" }, [])

  const [appointments, setAppointments] = useState<any[]>([])
  const [companyId, setCompanyId]       = useState<string | null>(null)
  const [view, setView]                 = useState<View>("week")
  const [cursor, setCursor]             = useState(new Date())   // "where are we navigating"
  const [selected, setSelected]         = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const today    = useMemo(() => new Date(), [])
  const todayStr = useMemo(() => toStr(today), [today])

  /* ── Auth ── */
  useEffect(() => {
    const id   = localStorage.getItem("company_id")
    const name = localStorage.getItem("company_name")
    if (!id) { window.location.href = "/login"; return }
    setCompanyId(id)
  }, [])

  /* ── Load ── */
  async function loadAppointments() {
    if (!companyId) return
    const { data } = await supabase
      .from("appointments").select("*")
      .eq("company_id", companyId)
      .not("status", "eq", "cancelled")
      .or("online_booking.is.null,online_booking.eq.false,status.eq.confirmed")
      .order("date", { ascending: true })
      .order("time", { ascending: true })
    if (data) setAppointments(data)
  }
  useEffect(() => { loadAppointments() }, [companyId])

  /* ── Actions ── */
  async function toggleDone(a: any) {
    const ns = a.status === "done" ? "pending" : "done"
    await supabase.from("appointments").update({ status: ns }).eq("id", a.id)
    if (selected) setSelected({ ...selected, status: ns })
    loadAppointments()
  }
  async function deleteAppointment(id: string) {
    await supabase.from("appointments").delete().eq("id", id)
    setSelected(null); setConfirmDelete(false); loadAppointments()
  }
  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id"); localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  /* ── Navigation ── */
  function prev() {
    setCursor(c => {
      if (view === "day")   return addDays(c, -1)
      if (view === "week")  return addDays(c, -7)
      return new Date(c.getFullYear(), c.getMonth() - 1, 1)
    })
  }
  function next() {
    setCursor(c => {
      if (view === "day")   return addDays(c, 1)
      if (view === "week")  return addDays(c, 7)
      return new Date(c.getFullYear(), c.getMonth() + 1, 1)
    })
  }
  function goToday() { setCursor(new Date()) }

  /* ── Derived ── */
  const cursorStr   = toStr(cursor)
  const isToday     = cursorStr === todayStr

  // Week: 7 days starting from Mon of cursor's week
  const weekStart = useMemo(() => startOfWeek(cursor), [cursor])
  const weekDays  = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  // Month grid: fill full weeks
  const monthDays = useMemo(() => {
    const ms   = startOfMonth(cursor)
    const dow  = ms.getDay() === 0 ? 6 : ms.getDay() - 1  // Mon=0
    const days: (Date | null)[] = Array(dow).fill(null)
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    for (let d = 1; d <= total; d++) days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [cursor])

  // Day stats
  const dayAppts  = appointments.filter(a => a.date === cursorStr)
  const doneToday = dayAppts.filter(a => a.status === "done").length

  // Period label
  function periodLabel() {
    if (view === "day") {
      return cursor.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    }
    if (view === "week") {
      const end = addDays(weekStart, 6)
      const sameMonth = weekStart.getMonth() === end.getMonth()
      if (sameMonth) return `${weekStart.getDate()}. – ${end.getDate()}. ${MONTHS_DE[end.getMonth()]} ${end.getFullYear()}`
      return `${weekStart.getDate()}. ${MONTHS_DE[weekStart.getMonth()]} – ${end.getDate()}. ${MONTHS_DE[end.getMonth()]} ${end.getFullYear()}`
    }
    return `${MONTHS_DE[cursor.getMonth()]} ${cursor.getFullYear()}`
  }

  const hours = Array.from({ length: 15 }, (_, i) => i + 6)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "'Inter','Manrope',sans-serif", color: "#1F2A37" }}>
      <DashNav active="/calendar" companyId={companyId} onLogout={handleLogout} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 100px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>

          {/* Left: title + label */}
          <div>
            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 }}>
              {view === "day" ? "Tagesansicht" : view === "week" ? "Wochenansicht" : "Monatsansicht"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {/* Nav arrows */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={prev} style={navBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={next} style={navBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-.4px" }}>
                {periodLabel()}
              </h1>
              {!isToday && view === "day" && (
                <button onClick={goToday} style={{ fontSize: 12, color: "#18A66D", background: "#F0FBF6", border: "1.5px solid #D1F5E3", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontWeight: 700 }}>
                  Heute
                </button>
              )}
              {view !== "day" && (
                <button onClick={goToday} style={{ fontSize: 12, color: "#18A66D", background: "#F0FBF6", border: "1.5px solid #D1F5E3", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontWeight: 700 }}>
                  Heute
                </button>
              )}
            </div>
          </div>

          {/* Right: view switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 4 }}>
            {(["day", "week", "month"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700, transition: "all .15s",
                background: view === v ? "#18A66D" : "transparent",
                color: view === v ? "#fff" : "#6B7280",
              }}>
                {v === "day" ? "Tag" : v === "week" ? "Woche" : "Monat"}
              </button>
            ))}
          </div>
        </div>

        {/* ── DAY STATS ── */}
        {view === "day" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Gesamt", value: dayAppts.length, sub: "Termine" },
              { label: "Erledigt", value: doneToday, sub: "abgehakt", green: true },
              { label: "Offen", value: dayAppts.length - doneToday, sub: "ausstehend" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.green ? "#18A66D" : "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* ════ DAY VIEW ════ */}
        {view === "day" && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Stundenplan</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>06:00 – 20:59 Uhr</span>
            </div>
            {hours.map(hour => {
              const slot = dayAppts.filter(a => parseInt(a.time?.split(":")[0] || "0") === hour)
              const isCur = isSameDay(cursor, today) && hour === today.getHours()
              const isPast = isSameDay(cursor, today) && hour < today.getHours()
              return (
                <div key={hour} style={{ display: "flex", gap: 16, padding: "14px 24px", borderBottom: "1px solid #F9FAFB", background: isCur ? "#F0FBF6" : isPast ? "transparent" : undefined, opacity: isPast ? .5 : 1 }}>
                  <div style={{ flexShrink: 0, width: 52 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isCur ? "#18A66D" : "#9CA3AF" }}>
                      {String(hour).padStart(2,"0")}:00
                    </div>
                    {isCur && <div style={{ fontSize: 9, color: "#18A66D", fontWeight: 700 }}>Jetzt</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    {slot.length === 0
                      ? <div style={{ fontSize: 12, color: "#E5E7EB" }}>—</div>
                      : slot.map(a => {
                          const done = a.status === "done"
                          return (
                            <div key={a.id} onClick={() => { setSelected(a); setConfirmDelete(false) }}
                              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderRadius: 12, cursor: "pointer", marginBottom: 6, transition: "all .15s",
                                background: done ? "#F0FBF6" : "#1F2A37", color: done ? "#111827" : "#fff",
                              }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, padding: "2px 8px", borderRadius: 7, background: done ? "#D1F5E3" : "rgba(255,255,255,0.12)", color: done ? "#18A66D" : "rgba(255,255,255,0.8)" }}>{a.time}</span>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 700, textDecoration: done ? "line-through" : undefined, opacity: done ? .6 : 1 }}>{a.name}</div>
                                  {a.note && <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>{a.note}</div>}
                                </div>
                              </div>
                              <button onClick={e => { e.stopPropagation(); toggleDone(a) }}
                                style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${done ? "#18A66D" : "rgba(255,255,255,0.3)"}`, background: done ? "#18A66D" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>}
                              </button>
                            </div>
                          )
                        })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ════ WEEK VIEW ════ */}
        {view === "week" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {weekDays.map((day, i) => {
              const dStr   = toStr(day)
              const items  = appointments.filter(a => a.date === dStr)
              const isT    = dStr === todayStr
              const isPast = dStr < todayStr
              const done   = items.filter(a => a.status === "done").length
              return (
                <div key={i} style={{ borderRadius: 18, border: `1.5px solid ${isT ? "#18A66D" : "#E5E7EB"}`, overflow: "hidden", background: "#fff", opacity: isPast && !isT ? .75 : 1 }}>
                  {/* Day header */}
                  <div style={{ padding: "12px 8px", textAlign: "center", background: isT ? "#18A66D" : "#F9FAFB", borderBottom: `1px solid ${isT ? "transparent" : "#E5E7EB"}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, color: isT ? "rgba(255,255,255,0.8)" : "#9CA3AF", marginBottom: 4 }}>
                      {WEEKDAYS_SHORT[i]}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: isT ? "#fff" : "#111827" }}>{day.getDate()}</div>
                    <div style={{ fontSize: 10, color: isT ? "rgba(255,255,255,0.7)" : "#9CA3AF", marginTop: 2 }}>
                      {MONTHS_DE[day.getMonth()].slice(0, 3)}
                    </div>
                    {items.length > 0 && (
                      <div style={{ fontSize: 9, fontWeight: 700, marginTop: 4, color: isT ? "rgba(255,255,255,0.7)" : "#6B7280" }}>
                        {items.length} Termin{items.length !== 1 ? "e" : ""}
                      </div>
                    )}
                  </div>
                  {/* Items */}
                  <div style={{ padding: "8px 6px", minHeight: 120, maxHeight: 300, overflowY: "auto", background: isT ? "#F0FBF6" : "#fff" }}>
                    {items.length === 0
                      ? <div style={{ textAlign: "center", paddingTop: 20, fontSize: 10, color: "#E5E7EB" }}>Frei</div>
                      : items.map(a => (
                          <div key={a.id} onClick={() => { setSelected(a); setConfirmDelete(false) }}
                            style={{ fontSize: 11, padding: "6px 8px", borderRadius: 8, marginBottom: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s",
                              background: a.status === "done" ? "#D1F5E3" : isT ? "#18A66D" : "#F3F4F6",
                              color: a.status === "done" ? "#18A66D" : isT ? "#fff" : "#374151",
                              textDecoration: a.status === "done" ? "line-through" : undefined,
                              opacity: a.status === "done" ? .7 : 1,
                            }}>
                            <span style={{ fontWeight: 800, flexShrink: 0 }}>{a.time}</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                          </div>
                        ))
                    }
                  </div>
                  {/* Progress bar */}
                  {items.length > 0 && (
                    <div style={{ padding: "0 8px 8px" }}>
                      <div style={{ height: 3, background: "#F3F4F6", borderRadius: 4 }}>
                        <div style={{ height: "100%", borderRadius: 4, background: "#18A66D", width: `${Math.round((done/items.length)*100)}%`, transition: "width .4s" }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ════ MONTH VIEW ════ */}
        {view === "month" && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, overflow: "hidden" }}>
            {/* Weekday headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #F3F4F6" }}>
              {WEEKDAYS_SHORT.map(d => (
                <div key={d} style={{ padding: "12px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: .8 }}>{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {monthDays.map((day, i) => {
                if (!day) return <div key={i} style={{ minHeight: 90, borderRight: "1px solid #F9FAFB", borderBottom: "1px solid #F9FAFB", background: "#FAFAFA" }} />
                const dStr   = toStr(day)
                const items  = appointments.filter(a => a.date === dStr)
                const isT    = dStr === todayStr
                const isPast = dStr < todayStr
                const isCurM = day.getMonth() === cursor.getMonth()
                return (
                  <div key={i} onClick={() => { setCursor(day); setView("day") }}
                    style={{ minHeight: 90, borderRight: "1px solid #F9FAFB", borderBottom: "1px solid #F9FAFB", padding: "8px 6px", cursor: "pointer", transition: "background .15s",
                      background: isT ? "#F0FBF6" : "transparent", opacity: isCurM ? 1 : .4,
                    }}
                    onMouseEnter={e => { if (!isT) (e.currentTarget as HTMLElement).style.background = "#F9FAFB" }}
                    onMouseLeave={e => { if (!isT) (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                    {/* Day number */}
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", marginBottom: 4,
                      background: isT ? "#18A66D" : "transparent",
                      color: isT ? "#fff" : isPast ? "#9CA3AF" : "#111827",
                      fontSize: 13, fontWeight: isT ? 900 : 600,
                    }}>
                      {day.getDate()}
                    </div>
                    {/* Appointment dots / chips */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {items.slice(0, 3).map(a => (
                        <div key={a.id} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          background: a.status === "done" ? "#D1F5E3" : isT ? "#18A66D" : "#F0FBF6",
                          color: a.status === "done" ? "#065F46" : isT ? "#fff" : "#18A66D",
                        }}>
                          {a.time} {a.name}
                        </div>
                      ))}
                      {items.length > 3 && (
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, paddingLeft: 6 }}>+{items.length - 3} weitere</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Upcoming (nächste Termine) ── */}
        {view === "month" && (() => {
          const upcoming = appointments
            .filter(a => a.date && a.date >= todayStr && a.status !== "done")
            .slice(0, 5)
          if (!upcoming.length) return null
          return (
            <div style={{ marginTop: 20, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Nächste Termine</span>
              </div>
              {upcoming.map(a => (
                <div key={a.id} onClick={() => { setSelected(a); setConfirmDelete(false) }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: "1px solid #F9FAFB", cursor: "pointer", transition: "background .12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F9FAFB"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div style={{ flexShrink: 0, textAlign: "center", background: "#F0FBF6", border: "1px solid #D1F5E3", borderRadius: 10, padding: "6px 10px", minWidth: 50 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#18A66D", textTransform: "uppercase" }}>
                      {parseStr(a.date).toLocaleDateString("de-DE", { month: "short" })}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#111827", lineHeight: 1 }}>
                      {parseStr(a.date).getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                      {a.time} Uhr · {parseStr(a.date).toLocaleDateString("de-DE", { weekday: "long" })}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          )
        })()}

      </div>

      {/* ── DETAIL POPUP ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "0 16px" }}
          onClick={() => { setSelected(null); setConfirmDelete(false) }}>
          <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 360, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "20px 24px 18px", background: selected.status === "done" ? "#F0FBF6" : "#1F2A37" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, color: selected.status === "done" ? "#18A66D" : "rgba(255,255,255,0.4)" }}>Termindetails</span>
                <button onClick={() => { setSelected(null); setConfirmDelete(false) }}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: selected.status === "done" ? "#E5E7EB" : "rgba(255,255,255,0.1)", color: selected.status === "done" ? "#6B7280" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  ✕
                </button>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: selected.status === "done" ? "#111827" : "#fff" }}>{selected.name}</div>
              <div style={{ fontSize: 13, marginTop: 4, color: selected.status === "done" ? "#6B7280" : "rgba(255,255,255,0.55)" }}>
                {selected.date && parseStr(selected.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
                {selected.time && ` · ${selected.time} Uhr`}
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {selected.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📞</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Telefon</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{selected.phone}</div>
                  </div>
                </div>
              )}
              {selected.note && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📝</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Notiz</div>
                    <div style={{ fontSize: 14, color: "#111827" }}>{selected.note}</div>
                  </div>
                </div>
              )}
              <div style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: selected.status === "done" ? "#F0FBF6" : "#FFFBEB",
                color: selected.status === "done" ? "#18A66D" : "#D97706" }}>
                {selected.status === "done" ? "✓ Termin wahrgenommen" : "⏳ Ausstehend"}
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => toggleDone(selected)} style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all .15s",
                background: selected.status === "done" ? "#F3F4F6" : "#18A66D",
                color: selected.status === "done" ? "#6B7280" : "#fff",
                boxShadow: selected.status === "done" ? "none" : "0 4px 16px rgba(24,166,109,0.25)" }}>
                {selected.status === "done" ? "Als offen markieren" : "Als erledigt markieren ✓"}
              </button>
              {!confirmDelete
                ? <button onClick={() => setConfirmDelete(true)} style={{ width: "100%", padding: "12px", borderRadius: 13, border: "1.5px solid #FECACA", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#EF4444", background: "transparent", transition: "all .15s" }}>
                    Termin löschen
                  </button>
                : <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, textAlign: "center", margin: "0 0 12px" }}>Wirklich löschen? Kann nicht rückgängig gemacht werden.</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Abbrechen</button>
                      <button onClick={() => deleteAppointment(selected.id)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Löschen</button>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .week-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 10, border: "1.5px solid #E5E7EB",
  background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
  justifyContent: "center", color: "#6B7280", transition: "all .15s",
}
