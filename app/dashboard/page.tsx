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

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  
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

    if (error) {
      console.log("LOAD ERROR:", error)
      return
    }

    if (data) setAppointments(data)
  }

  useEffect(() => {
    if (companyId) loadAppointments()
  }, [companyId])

  async function toggleDone(a:any) {
    const newStatus = a.status === "done" ? "pending" : "done"

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", a.id)

    if (error) {
      console.log("UPDATE ERROR:", error)
    }

    loadAppointments()
  }

  async function handleSubmit(e:any){
    e.preventDefault()

    if (!companyId) {
      console.log("NO COMPANY ID")
      return
    }

    if (!name || !phone || !date || !time) {
      console.log("FEHLENDE FELDER")
      return
    }

    const { data, error } = await supabase
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

    console.log("INSERT DATA:", data)
    console.log("INSERT ERROR:", error)

    if (error) {
      alert("Fehler beim Speichern")
      return
    }

    if (data) {
      setJustAddedId(data[0].id)
      setTimeout(() => setJustAddedId(null), 1200)
    }

    setName("")
    setPhone("")
    setDate("")
    setTime("")
    setNote("")

    loadAppointments()
  }

  function handleLogout(){
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const now = new Date()
  const todayStr = now.toISOString().split("T")[0]

  const filteredAppointments = appointments.filter(a => {
    if (a.date !== todayStr) return false

    const dateTime = new Date(`${a.date}T${a.time}`)
    const diffHours = (dateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return diffHours >= -3
  })

  const nextOpen = filteredAppointments.find(a => a.status !== "done")

  return (

    <div className="min-h-screen bg-[#F7F7F5] text-black">

      {/* NAV */}
      <div className="flex justify-between items-center px-12 py-6 border-b border-black/5">
        <div className="flex gap-6 text-sm">
          <a href="/dashboard" className="font-medium">Dashboard</a>
          <a href="/calendar" className="text-black/40 hover:text-black transition">Kalender</a>
          <a href="/insights" className="text-black/40 hover:text-black transition">Einblicke</a>
        </div>

        <button onClick={handleLogout} className="text-sm text-black/40 hover:text-black transition">
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* HEADER */}
        <div className="mb-10">
          <div className="text-sm text-black/40 mb-2">
            {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </div>

          <h1 className="text-4xl font-semibold mb-2">
            {companyName || "Ihr Unternehmen"}
          </h1>

          <div className="text-black/50">
            Fokus auf aktuelle Termine
          </div>
        </div>

        {/* FOKUS */}
        <div className="mb-10 bg-white p-6 rounded-xl border border-black/5">
          <div className="text-xs text-black/40 mb-2">Heute im Fokus</div>

          <div className="text-lg font-medium mb-1">
            {filteredAppointments.length} Termine
          </div>

          <div className="text-sm text-black/40">
            {filteredAppointments.filter(a => a.status === "done").length} erledigt •{" "}
            {filteredAppointments.filter(a => a.status !== "done").length} offen
          </div>
        </div>

        {/* NEXT */}
        {nextOpen && (
          <div className="mb-10 bg-white p-5 rounded-xl border border-black/5">
            <div className="text-xs text-black/40 mb-1">Nächster Termin</div>
            <div className="text-lg font-medium">{nextOpen.name}</div>
            <div className="text-sm text-black/40">{nextOpen.time}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-20">

          {/* LISTE */}
          <div className="flex flex-col gap-4">
            {filteredAppointments.map((a:any) => {

              const isDone = a.status === "done"
              const isNew = a.id === justAddedId

              return (
                <div key={a.id}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 rounded-xl
                    transition-all duration-500
                    ${isDone ? "opacity-40" : "hover:bg-black/5"}
                    ${isNew ? "animate-[fadeInUp_0.4s_ease]" : ""}
                  `}>

                  <div className="flex gap-4 items-center">
                    <div className="text-sm text-black/40 w-14">{a.time}</div>

                    <div>
                      <div className={`text-lg ${isDone ? "line-through" : ""}`}>
                        {a.name}
                      </div>

                      {a.note && (
                        <div className="text-xs text-black/40">{a.note}</div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDone(a)}
                    className={`w-5 h-5 rounded-full border transition ${
                      isDone ? "bg-green-500 border-green-500" : "border-black/20 hover:border-black"
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* FORM */}
          <div>
            <h2 className="text-lg mb-4">Neuer Termin</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <input className="border-b p-2 bg-transparent" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="border-b p-2 bg-transparent" placeholder="Telefon" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input className="border-b p-2 bg-transparent" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
              <input className="border-b p-2 bg-transparent" type="time" value={time} onChange={(e)=>setTime(e.target.value)} />

              <input className="border-b p-2 bg-transparent"
                placeholder="Notiz (optional)"
                value={note}
                onChange={(e)=>setNote(e.target.value)}
              />

              <button className="mt-6 bg-black text-white py-3 rounded-lg">
                Speichern
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  )
}