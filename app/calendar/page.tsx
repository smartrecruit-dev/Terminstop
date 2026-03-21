"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import deLocale from "@fullcalendar/core/locales/de"
import { supabase } from "../lib/supabaseClient"

export default function CalendarPage() {

  const [events, setEvents] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [view, setView] = useState("timeGridDay")

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")
    if (!storedId) window.location.href = "/login"
    else setCompanyId(storedId)
  }, [])

  async function loadAppointments(){

    if (!companyId) return

    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if(data){

      const calendarEvents = data.map((a:any)=>{

        const start = new Date(`${a.date}T${a.time}`)
        const end = new Date(start.getTime() + 30 * 60000)

        return {
          id: a.id,
          title: a.name,
          start,
          end
        }

      })

      setEvents(calendarEvents)

    }

  }

  useEffect(()=>{
    loadAppointments()
  },[companyId])

  async function handleEventDrop(info:any){

    const event = info.event
    const newStart = new Date(event.start)

    const newDate =
      newStart.getFullYear() + "-" +
      String(newStart.getMonth()+1).padStart(2,"0") + "-" +
      String(newStart.getDate()).padStart(2,"0")

    const newTime =
      String(newStart.getHours()).padStart(2,"0") + ":" +
      String(newStart.getMinutes()).padStart(2,"0")

    const { error } = await supabase
      .from("appointments")
      .update({
        date: newDate,
        time: newTime
      })
      .eq("id", event.id)

    if(error){
      alert("Fehler beim Verschieben")
    } else {
      loadAppointments()
    }

  }

  function handleLogout(){
    localStorage.removeItem("company_id")
    window.location.href = "/login"
  }

  return (

    <div className="min-h-screen bg-[#F7F7F5] text-black">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-black/5">

        <div className="flex gap-8 text-sm">
          <a href="/dashboard" className="text-black/40 hover:text-black">
            Dashboard
          </a>
          <a href="/calendar" className="font-medium">
            Kalender
          </a>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-black/40 hover:text-black"
        >
          Logout
        </button>

      </div>

      <div className="p-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-semibold">
            Kalender
          </h1>

          {/* VIEW SWITCH */}
          <div className="flex gap-4 text-sm">

            <button
              onClick={()=>setView("timeGridDay")}
              className={view === "timeGridDay" ? "font-medium" : "text-black/40"}
            >
              Tag
            </button>

            <button
              onClick={()=>setView("timeGridWeek")}
              className={view === "timeGridWeek" ? "font-medium" : "text-black/40"}
            >
              Woche
            </button>

          </div>

        </div>

        {/* CALENDAR */}
        <div className="bg-white border border-black/5 rounded-xl p-4">

          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            locale={deLocale}

            initialView={view}
            key={view} // wichtig für Wechsel

            editable={true}
            eventDrop={handleEventDrop}

            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:30:00"

            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }}

            eventOverlap={false}
            slotEventOverlap={false}

            height="auto"

            events={events}

          />

        </div>

      </div>

    </div>

  )
}