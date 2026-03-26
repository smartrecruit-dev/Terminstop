"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function CalendarPage() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [view, setView] = useState<"day" | "week">("day")
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    if (!storedId) window.location.href = "/login"
    else setCompanyId(storedId)
  }, [])

  async function loadAppointments() {
    if (!companyId) return

    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if (data) setAppointments(data)
  }

  useEffect(() => {
    loadAppointments()
  }, [companyId])

  async function toggleDone(a:any) {
    const newStatus = a.status === "done" ? "pending" : "done"

    await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", a.id)

    loadAppointments()
  }

  function handleLogout() {
    localStorage.removeItem("company_id")
    window.location.href = "/login"
  }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const hours = Array.from({ length: 15 }, (_, i) => i + 6)

  const dayAppointments = appointments.filter(a => a.date === todayStr)

  const doneToday = dayAppointments.filter(a => a.status === "done").length

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() + i)
    return d
  })

  return (

    <div className="min-h-screen bg-[#F7F7F5] text-black">

     {/* NAVBAR */}
<div className="flex justify-between items-center px-10 py-6 border-b border-black/5">
  <div className="flex gap-8 text-sm">
    <a href="/dashboard" className="text-black/40 hover:text-black transition">
      Dashboard
    </a>
    <a href="/calendar" className="font-medium">
      Kalender
    </a>
    <a href="/insights" className="text-black/40 hover:text-black transition">
      Einblicke
    </a>
  </div>

  <button onClick={handleLogout} className="text-sm text-black/40 hover:text-black transition">
    Logout
  </button>
</div>

<div className="p-10 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-2xl font-semibold">
              {view === "day" ? "Heute" : "Woche"}
            </h1>
            {view === "day" && (
              <div className="text-sm text-black/40 mt-1">
                {today.toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long"
                })}
              </div>
            )}
          </div>

          <div className="flex gap-4 text-sm">
            <button onClick={()=>setView("day")} className={view === "day" ? "font-medium" : "text-black/40"}>
              Tag
            </button>
            <button onClick={()=>setView("week")} className={view === "week" ? "font-medium" : "text-black/40"}>
              Woche
            </button>
          </div>

        </div>

        {/* DONE KPI */}
        {view === "day" && (
          <div className="mb-6 text-sm text-black/50">
            {doneToday} Termine erledigt heute
          </div>
        )}

        {/* DAY VIEW */}
        {view === "day" && (

          <div className="flex flex-col gap-5">

            {hours.map((hour) => {

              const slot = dayAppointments.filter((a:any) => {
                const h = parseInt(a.time.split(":")[0])
                return h === hour
              })

              return (
                <div key={hour} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">

                  <div className="text-sm text-black/40 mb-3">
                    {hour}:00 – {hour}:59
                  </div>

                  {slot.length === 0 ? (
                    <div className="text-black/20 text-sm">frei</div>
                  ) : (
                    <div className="flex flex-col gap-3">

                      {slot.map((a:any) => {

                        const isDone = a.status === "done"

                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelected(a)}
                            className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition
                              ${isDone
                                ? "bg-green-100 text-green-700"
                                : "bg-[#111827] text-white hover:bg-black"
                              }`}
                          >

                            <div>
                              <div className="font-medium">{a.name}</div>
                              <div className="text-xs opacity-70">{a.time}</div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleDone(a)
                              }}
                              className={`text-xs px-3 py-1 rounded-lg
                                ${isDone
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-black"
                                }`}
                            >
                              ✓
                            </button>

                          </div>
                        )

                      })}

                    </div>
                  )}

                </div>
              )
            })}

          </div>

        )}

        {/* WEEK VIEW */}
        {view === "week" && (

          <div className="grid grid-cols-7 gap-4">

            {weekDays.map((day, i) => {

              const dStr = day.toISOString().split("T")[0]
              const items = appointments.filter(a => a.date === dStr)

              return (
                <div key={i} className="bg-white p-4 rounded-xl border border-black/5">

                  <div className="text-xs text-black/40 mb-2">
                    {day.toLocaleDateString("de-DE", { weekday: "short" })}
                  </div>

                  <div className="text-sm font-medium mb-3">
                    {day.getDate()}
                  </div>

                  <div className="flex flex-col gap-2">

                    {items.slice(0,4).map((a:any) => (
                      <div key={a.id} className="text-xs bg-black/5 px-2 py-1 rounded">
                        {a.time} • {a.name}
                      </div>
                    ))}

                    {items.length > 4 && (
                      <div className="text-xs text-black/40">
                        +{items.length - 4}
                      </div>
                    )}

                  </div>

                </div>
              )

            })}

          </div>

        )}

      </div>

      {/* POPUP */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">{selected.name}</h2>
            <p className="text-sm text-black/40 mb-4">{selected.time}</p>

            <button
              onClick={() => toggleDone(selected)}
              className="w-full bg-black text-white py-2 rounded-lg text-sm"
            >
              Status ändern
            </button>
          </div>
        </div>
      )}

    </div>
  )
}