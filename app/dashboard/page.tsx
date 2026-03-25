"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import deLocale from "@fullcalendar/core/locales/de"

export default function Dashboard() {

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")

  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  const [monthlySMS, setMonthlySMS] = useState(0)
  const [totalSMS, setTotalSMS] = useState(0)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")

    if (!storedId) {
      window.location.href = "/login"
    } else {
      setCompanyId(storedId)
      setCompanyName(storedName || "")
    }
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

  useEffect(() => {
    async function loadSMSStats() {

      if (!companyId) return

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const { count: monthly } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .not("sms_sent_at", "is", null)
        .gte("sms_sent_at", startOfMonth.toISOString())

      const { count: total } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .not("sms_sent_at", "is", null)

      setMonthlySMS(monthly || 0)
      setTotalSMS(total || 0)
    }

    loadSMSStats()
  }, [companyId])

  async function handleSubmit(e:any){
    e.preventDefault()
    if (!companyId) return

    const { data } = await supabase
      .from("appointments")
      .insert([{
        name,
        phone,
        date,
        time,
        status: "pending",
        company_id: companyId
      }])
      .select()

    if (data) {
      setJustAddedId(data[0].id)
      setTimeout(() => setJustAddedId(null), 1500)
    }

    setName("")
    setPhone("")
    setDate("")
    setTime("")
    loadAppointments()
  }

  function handleLogout(){
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const now = new Date()

  const futureAppointments = appointments.filter(a => {
    const dt = new Date(`${a.date}T${a.time}`)
    return dt >= now
  })

  const todayStr = new Date().toISOString().split("T")[0]

  const todayAppointments = futureAppointments.filter(a => a.date === todayStr)

  const todayCount = todayAppointments.length
  const nextAppointment = futureAppointments[0]
  const upcoming = todayAppointments.slice(0, 3)

  return (

    <div className="min-h-screen bg-[#F7F7F5] text-black">

      <div className="flex justify-between items-center px-10 py-6 border-b border-black/5">
        <div className="flex gap-8 text-sm">
          <a href="/dashboard" className="font-medium">Dashboard</a>
          <a href="/calendar" className="text-black/40">Kalender</a>
        </div>
        <button onClick={handleLogout} className="text-sm text-black/40 hover:text-black">
          Logout
        </button>
      </div>

      <div className="p-10 max-w-6xl mx-auto">

        <div className="mb-10">
          <div className="text-sm text-black/40 mb-2">
            Willkommen zurück
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            {companyName || "Ihr Unternehmen"}
          </h1>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-medium mb-1">
            {todayCount > 0
              ? `${todayCount} Termine heute`
              : "Heute ist entspannt"}
          </h2>

          <p className="text-black/40 text-sm">
            {nextAppointment
              ? `Nächster Termin um ${nextAppointment.time}`
              : "Keine Termine geplant"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl">
            <div className="text-sm text-black/40">SMS diesen Monat</div>
            <div className="text-2xl font-semibold">{monthlySMS}</div>
          </div>

          <div className="bg-white p-6 rounded-xl">
            <div className="text-sm text-black/40">SMS gesamt</div>
            <div className="text-2xl font-semibold">{totalSMS}</div>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl hover:shadow-md transition">
            <div className="text-sm text-black/40">Heutige Termine</div>
            <div className="text-2xl font-semibold">{todayCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl hover:shadow-md transition">
            <div className="text-sm text-black/40">Nächster Termin</div>
            <div className="text-lg font-medium">{nextAppointment?.name || "-"}</div>
            <div className="text-sm text-black/40">{nextAppointment?.time}</div>
          </div>

          <div className="bg-white p-6 rounded-xl hover:shadow-md transition">
            <div className="text-sm text-black/40">System</div>
            <div className="font-medium">Aktiv</div>
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl mb-12">

          <div className="text-sm text-black/40 mb-4">Heute</div>

          <FullCalendar
            plugins={[timeGridPlugin]}
            locale={deLocale}
            initialView="timeGridDay"
            height={300}
            headerToolbar={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            events={appointments.map(a => {
              const start = new Date(`${a.date}T${a.time}`)
              const end = new Date(start.getTime() + 30 * 60000)
              return { title: "", start, end }
            })}
          />

        </div>

        <div className="grid grid-cols-2 gap-12">

          <div>
            <h2 className="text-lg mb-4">Neuer Termin</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input className="border border-black/20 p-3 rounded-lg" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="border border-black/20 p-3 rounded-lg" placeholder="Telefon" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input className="border border-black/20 p-3 rounded-lg" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
              <input className="border border-black/20 p-3 rounded-lg" type="time" value={time} onChange={(e)=>setTime(e.target.value)} />

              <button className="bg-black text-white p-3 rounded-lg">
                Termin speichern
              </button>
            </form>
          </div>

          <div>

            <h2 className="text-lg mb-4">Heute</h2>

            {upcoming.length === 0 ? (
              <div className="text-black/40 text-sm">
                Keine Termine – alles im Griff 👍
              </div>
            ) : (

              <div className="flex flex-col gap-4">

                {upcoming.map((a)=>(
                  <div key={a.id}
                    className={`bg-white p-5 rounded-xl hover:shadow-md transition
                    ${justAddedId === a.id ? "animate-pulse" : ""}`}>

                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-black/40">
                      {a.time}
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}