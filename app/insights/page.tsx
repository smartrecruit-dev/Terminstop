"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Insights() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("company_id")

    if (!storedId) {
      window.location.href = "/login"
    } else {
      setCompanyId(storedId)
    }
  }, [])

  useEffect(() => {
    async function load() {
      if (!companyId) return

      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("company_id", companyId)

      if (data) setAppointments(data)
    }

    load()
  }, [companyId])

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const todayAppointments = appointments.filter(a => a.date === todayStr)

  const done = todayAppointments.filter(a => a.status === "done").length
  const open = todayAppointments.filter(a => a.status === "pending").length

  // 🧠 Einschätzung
  let insight = ""
  let explanation = ""

  if (todayAppointments.length === 0) {
    insight = "Keine Termine geplant"
    explanation = "Für den heutigen Tag sind aktuell keine Termine hinterlegt."
  } else if (done >= open) {
    insight = "Stabiler Ablauf"
    explanation = "Die Mehrheit Ihrer Termine wird wahrgenommen – Ihr System läuft zuverlässig."
  } else {
    insight = "Optimierung möglich"
    explanation = "Ein Teil Ihrer Termine ist noch offen – hier besteht Verbesserungspotenzial."
  }

  // 📊 LETZTE 7 TAGE
 const formatLocalDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const last7Days = [...Array(7)].map((_, i) => {
  const d = new Date()
  d.setDate(today.getDate() - (6 - i))

  const dateStr = formatLocalDate(d)

  return {
    date: dateStr,
    count: appointments.filter(a => a.date === dateStr).length
  }
})

  const max = Math.max(...last7Days.map(d => d.count), 1)

  return (

    <div className="min-h-screen bg-[#F7F7F5] text-black">

      {/* NAV */}
      <div className="flex justify-between items-center px-12 py-6 border-b border-black/5">
        <div className="flex gap-6 text-sm">
          <a href="/dashboard" className="text-black/40 hover:text-black">Dashboard</a>
          <a href="/calendar" className="text-black/40 hover:text-black">Kalender</a>
          <a href="/insights" className="font-medium">Einblicke</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">

        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-4xl font-semibold mb-4">
            Einblicke
          </h1>

          <p className="text-black/50">
            Überblick über Ihre Termine und aktuelle Entwicklung
          </p>
        </div>

        {/* HEUTE */}
        <div className="mb-14">
          <div className="text-sm text-black/40 mb-3">
            Heute
          </div>

          <div className="text-3xl font-semibold mb-4">
            {todayAppointments.length} Termine
          </div>

          <div className="flex gap-10 text-sm text-black/60">
            <div>✔ {done} erledigt</div>
            <div>• {open} offen</div>
          </div>
        </div>

        {/* EINSCHÄTZUNG */}
        <div className="mb-16">
          <div className="text-sm text-black/40 mb-3">
            Einschätzung
          </div>

          <div className="text-xl font-medium mb-2">
            {insight}
          </div>

          <div className="text-black/50 text-sm">
            {explanation}
          </div>
        </div>

      {/* 📊 WOCHENVERLAUF (LINE CHART) */}
<div className="mb-16">

  <div className="text-sm text-black/40 mb-6">
    Entwicklung (letzte 7 Tage)
  </div>

  <div className="bg-white p-6 rounded-xl border border-black/5">

    <svg viewBox="0 0 300 100" className="w-full h-32">

      {/* Linie */}
      <polyline
        fill="none"
        stroke="black"
        strokeWidth="2"
        points={last7Days.map((d, i) => {
          const x = (i / 6) * 300
          const y = 100 - (d.count / max) * 80
          return `${x},${y}`
        }).join(" ")}
      />

      {/* Punkte */}
      {last7Days.map((d, i) => {
        const x = (i / 6) * 300
        const y = 100 - (d.count / max) * 80

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="black"
          />
        )
      })}

    </svg>
    <div className="text-xs text-black/40 mt-2">
  {last7Days[6].count > last7Days[0].count
    ? "Trend steigend"
    : last7Days[6].count < last7Days[0].count
    ? "Trend rückläufig"
    : "Konstant"}
</div>

    {/* Labels */}
    <div className="flex justify-between mt-4 text-[10px] text-black/40">
      {last7Days.map((d, i) => (
        <div key={i}>
          {d.date.slice(5)}
        </div>
      ))}
    </div>

  </div>

</div>

        {/* SYSTEM */}
        <div className="mb-20">
          <div className="text-sm text-black/40 mb-3">
            Systemstatus
          </div>

          <div className="text-black/60 text-sm leading-relaxed">
            Erinnerungen aktiv ✔ <br />
            System läuft stabil ✔ <br /><br />
            Die Auswertung basiert auf Ihren aktuellen Terminaktivitäten
            und wird automatisch im Hintergrund aktualisiert.
          </div>
        </div>

        {/* ERKLÄRUNG */}
        <div className="mb-20">
          <div className="text-sm text-black/40 mb-3">
            Wie TerminStop unterstützt
          </div>

          <div className="text-black/60 leading-relaxed">
            TerminStop erinnert Ihre Kunden automatisch an bevorstehende Termine.
            Dadurch erscheinen mehr Kunden zuverlässig, Ausfälle werden reduziert
            und Ihr Tagesablauf bleibt planbar.
          </div>
        </div>

        {/* SUPPORT (clean, kein Kasten) */}
        <div className="text-black/50 text-sm leading-relaxed border-t border-black/10 pt-10">

          <div className="mb-4 font-medium text-black">
            Unterstützung & Kontakt
          </div>

          <p className="mb-4">
            Sollten Fragen auftreten oder Unterstützung benötigt werden,
            können Sie uns jederzeit per E-Mail kontaktieren.
            Wir empfehlen diesen Weg für eine strukturierte und schnelle Bearbeitung.
          </p>

          <p className="mb-4">
            In dringenden Fällen erreichen Sie uns zusätzlich telefonisch.
          </p>

          <div>
            E-Mail: terminstopp.business@gmail.com <br />
            Telefon: 0151 54212634
          </div>

        </div>

      </div>

    </div>
  )
}