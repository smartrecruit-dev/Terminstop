"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Insights() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [smsCount, setSmsCount] = useState<number>(0)
  const [smsLimit, setSmsLimit] = useState<number>(200)

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

  useEffect(() => {
    async function load() {
      if (!companyId) return

      const { data: appts } = await supabase
        .from("appointments")
        .select("*")
        .eq("company_id", companyId)
      if (appts) setAppointments(appts)

      const { data: company } = await supabase
        .from("companies")
        .select("sms_count, sms_limit")
        .eq("id", companyId)
        .single()
      if (company) {
        setSmsCount(company.sms_count ?? 0)
        setSmsLimit(company.sms_limit ?? 200)
      }
    }
    load()
  }, [companyId])

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const todayAppointments = appointments.filter(a => a.date === todayStr)
  const done = todayAppointments.filter(a => a.status === "done").length
  const open = todayAppointments.filter(a => a.status === "pending").length
  const completionPct = todayAppointments.length > 0
    ? Math.round((done / todayAppointments.length) * 100)
    : 0

  // Gesamtstatistik (alle Tage)
  const totalAll = appointments.length
  const doneAll = appointments.filter(a => a.status === "done").length
  const successRateAll = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0

  // Einschätzung
  let insightLabel = ""
  let insightColor = ""
  let insightBg = ""
  let explanation = ""

  if (todayAppointments.length === 0) {
    insightLabel = "Keine Termine geplant"
    insightColor = "text-[#6B7280]"
    insightBg = "bg-[#F7FAFC]"
    explanation = "Für den heutigen Tag sind aktuell keine Termine hinterlegt."
  } else if (completionPct >= 80) {
    insightLabel = "Hervorragender Tag"
    insightColor = "text-[#18A66D]"
    insightBg = "bg-[#E8FBF3]"
    explanation = "Ihr System läuft auf Hochtouren – die große Mehrheit Ihrer Termine wird wahrgenommen."
  } else if (done >= open) {
    insightLabel = "Stabiler Ablauf"
    insightColor = "text-[#18A66D]"
    insightBg = "bg-[#E8FBF3]"
    explanation = "Die Mehrheit Ihrer Termine wird wahrgenommen – Ihr System läuft zuverlässig."
  } else {
    insightLabel = "Optimierung möglich"
    insightColor = "text-[#D97706]"
    insightBg = "bg-[#FEF3C7]"
    explanation = "Ein Teil Ihrer Termine ist noch offen. SMS-Erinnerungen sind aktiv und helfen, Ausfälle zu reduzieren."
  }

  // Letzte 7 Tage
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
    const dayAppointments = appointments.filter(a => a.date === dateStr)
    return {
      date: dateStr,
      label: d.toLocaleDateString("de-DE", { weekday: "short" }),
      dayNum: d.getDate(),
      count: dayAppointments.length,
      done: dayAppointments.filter(a => a.status === "done").length,
    }
  })

  const max = Math.max(...last7Days.map(d => d.count), 1)
  const trendUp = last7Days[6].count > last7Days[0].count
  const trendDown = last7Days[6].count < last7Days[0].count

  // Letzte 30 Tage für Gesamttrend
  const last30Total = appointments.filter(a => {
    const d = new Date(a.date)
    const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 30
  }).length

  return (
    <div
      className="min-h-screen text-[#1F2A37] overflow-x-hidden"
      style={{ fontFamily: "'Inter', 'Manrope', sans-serif", backgroundColor: "#F7FAFC" }}
    >

      {/* ─── NAVBAR ─── */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1">
            <a href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Dashboard</a>
            <a href="/calendar" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Kalender</a>
            <a href="/customers" className="text-sm text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC] px-4 py-2 rounded-lg transition">Kunden</a>
            <a href="/insights" className="text-sm font-semibold text-[#1F2A37] bg-[#F7FAFC] px-4 py-2 rounded-lg">Einblicke</a>
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
          { href: "/dashboard", label: "Dashboard", icon: "🏠" },
          { href: "/calendar", label: "Kalender", icon: "📅" },
          { href: "/customers", label: "Kunden", icon: "👥" },
          { href: "/insights", label: "Einblicke", icon: "📊", active: true },
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

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 pb-24 md:pb-10">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs text-[#6B7280] font-medium mb-1 uppercase tracking-wider">
              {today.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">Einblicke</h1>
            <p className="text-[#6B7280] mt-1 text-sm">
              Ihre Terminentwicklung und Systemstatus auf einen Blick.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#E8FBF3] border border-[#6EE7B7] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full self-start">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
            SMS-Erinnerungen aktiv
          </div>
        </div>

        {/* ─── KPI OVERVIEW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-3">Heute</div>
            <div className="text-3xl font-black text-[#1F2A37]">{todayAppointments.length}</div>
            <div className="text-xs text-[#6B7280] mt-1">Termine geplant</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-3">Erledigt</div>
            <div className="text-3xl font-black text-[#18A66D]">{done}</div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#18A66D] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-3">Termine</div>
            <div className="text-3xl font-black text-[#1F2A37]">{totalAll}</div>
            <div className="text-xs text-[#6B7280] mt-1">Letzte 31 Tage</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-3">Erfolgsquote</div>
            <div className="text-3xl font-black text-[#18A66D]">{successRateAll}%</div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#18A66D] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${successRateAll}%` }}
              />
            </div>
          </div>
        </div>

        {/* ─── SMS KONTINGENT ─── */}
        {(() => {
          const smsRemaining = Math.max(smsLimit - smsCount, 0)
          const smsPct = smsLimit > 0 ? Math.round((smsCount / smsLimit) * 100) : 0
          const smsWarning = smsPct >= 90
          const smsOk = smsPct < 75
          const currentMonthLabel = today.toLocaleDateString("de-DE", { month: "long", year: "numeric" })
          return (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#1F2A37]">SMS-Kontingent</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">{currentMonthLabel} · Reset am 1. des Monats</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                  smsWarning ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#E8FBF3] text-[#18A66D]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${smsWarning ? "bg-[#D97706]" : "bg-[#18A66D]"}`} />
                  {smsWarning ? "Fast aufgebraucht" : "Aktiv"}
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-4xl font-black text-[#1F2A37]">{smsCount}</span>
                    <span className="text-sm text-[#6B7280] ml-2">von {smsLimit} SMS gesendet</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${smsOk ? "text-[#18A66D]" : smsWarning ? "text-[#D97706]" : "text-[#1F2A37]"}`}>
                      {smsRemaining}
                    </div>
                    <div className="text-xs text-[#6B7280]">noch verfügbar</div>
                  </div>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${
                      smsWarning ? "bg-[#D97706]" : "bg-[#18A66D]"
                    }`}
                    style={{ width: `${Math.min(smsPct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1.5">
                  <span>0</span>
                  <span>{smsPct}% genutzt</span>
                  <span>{smsLimit}</span>
                </div>
                {smsWarning && (
                  <div className="mt-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-3 text-xs text-[#92400E]">
                    ⚠️ Ihr SMS-Kontingent ist fast aufgebraucht. Bitte melden Sie sich bei uns, um Ihr Paket anzupassen.
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* ─── EINSCHÄTZUNG ─── */}
        <div className={`${insightBg} border border-[#E5E7EB] rounded-2xl p-6 mb-8 flex items-start gap-5`}>
          <div className="w-12 h-12 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-center text-2xl shrink-0 shadow-sm">
            {todayAppointments.length === 0 ? "📭" : completionPct >= 80 ? "🏆" : done >= open ? "✅" : "💡"}
          </div>
          <div>
            <div className={`text-base font-bold ${insightColor} mb-1`}>{insightLabel}</div>
            <div className="text-sm text-[#6B7280] leading-relaxed">{explanation}</div>
          </div>
        </div>

        {/* ─── WOCHENVERLAUF CHART ─── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1F2A37]">Entwicklung der letzten 7 Tage</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Termine pro Tag</p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
              trendUp ? "bg-[#E8FBF3] text-[#18A66D]" :
              trendDown ? "bg-[#FEF3C7] text-[#D97706]" :
              "bg-[#F7FAFC] text-[#6B7280]"
            }`}>
              {trendUp ? "↗ Steigend" : trendDown ? "↘ Rückläufig" : "→ Konstant"}
            </div>
          </div>

          <div className="px-6 pt-6 pb-4">
            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-32 mb-3">
              {last7Days.map((d, i) => {
                const barHeight = max > 0 ? Math.max((d.count / max) * 100, d.count > 0 ? 8 : 0) : 0
                const isToday = d.date === todayStr
                const doneHeight = d.count > 0 ? (d.done / d.count) * barHeight : 0

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    {d.count > 0 && (
                      <div className="text-xs font-bold text-[#6B7280]">{d.count}</div>
                    )}
                    <div className="w-full relative flex flex-col justify-end" style={{ height: "100px" }}>
                      {d.count > 0 ? (
                        <div className="w-full rounded-lg overflow-hidden flex flex-col justify-end" style={{ height: `${barHeight}%` }}>
                          {/* Done part */}
                          <div
                            className="w-full bg-[#18A66D] transition-all duration-700"
                            style={{ height: `${(d.done / d.count) * 100}%` }}
                          />
                          {/* Pending part */}
                          <div
                            className={`w-full transition-all duration-700 ${isToday ? "bg-[#93C5FD]" : "bg-[#E5E7EB]"}`}
                            style={{ height: `${((d.count - d.done) / d.count) * 100}%` }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-[#F3F4F6] rounded-full" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Labels */}
            <div className="flex gap-2">
              {last7Days.map((d, i) => {
                const isToday = d.date === todayStr
                return (
                  <div key={i} className="flex-1 text-center">
                    <div className={`text-[10px] font-semibold ${isToday ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
                      {d.label}
                    </div>
                    <div className={`text-[10px] ${isToday ? "text-[#18A66D] font-bold" : "text-[#D1D5DB]"}`}>
                      {d.dayNum}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <div className="w-3 h-3 bg-[#18A66D] rounded-sm" />
                Erledigt
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <div className="w-3 h-3 bg-[#E5E7EB] rounded-sm" />
                Offen
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2-COL: Tagesübersicht + Gesamtstatistik ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Heute im Detail */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#1F2A37]">Heute im Detail</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {today.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Termine gesamt", value: todayAppointments.length, icon: "📅" },
                { label: "Erledigt", value: done, icon: "✅", green: true },
                { label: "Noch offen", value: open, icon: "⏳" },
                { label: "Abschlussrate", value: `${completionPct}%`, icon: "📊", green: completionPct >= 70 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-[#6B7280]">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.green ? "text-[#18A66D]" : "text-[#1F2A37]"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gesamtstatistik */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#1F2A37]">Übersicht letzte 31 Tage</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Ältere Termine werden automatisch bereinigt</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Termine gesamt", value: totalAll, icon: "📋" },
                { label: "Erfolgreich wahrgenommen", value: doneAll, icon: "✅", green: true },
                { label: "Letzte 7 Tage", value: last30Total, icon: "📆" },
                { label: "Erfolgsquote (letzte 31 Tage)", value: `${successRateAll}%`, icon: "🏆", green: successRateAll >= 70 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-[#6B7280]">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.green ? "text-[#18A66D]" : "text-[#1F2A37]"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SYSTEMSTATUS ─── */}
        <div className="bg-[#1F2A37] text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#18A66D] rounded-xl flex items-center justify-center text-base">⚙️</div>
            <div>
              <div className="text-sm font-bold">Systemstatus</div>
              <div className="text-xs text-white/50">Alle Dienste laufen</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "SMS-Erinnerungen", status: "Aktiv", ok: true },
              { label: "Automatisierung", status: "Läuft stabil", ok: true },
              { label: "Datenübertragung", status: "Verbunden", ok: true },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-white/70">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
                  <span className="text-xs text-[#18A66D] font-semibold">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-4">
            Die Auswertung basiert auf Ihren aktuellen Terminaktivitäten und wird automatisch aktualisiert.
          </p>
        </div>

        {/* ─── WIE TERMINSTOP UNTERSTÜTZT ─── */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#1F2A37]">Wie TerminStop unterstützt</h2>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "📱", title: "Automatische Erinnerungen", desc: "Kunden erhalten 24h vor dem Termin eine persönliche SMS – ohne Ihr Zutun." },
              { icon: "📉", title: "Weniger Ausfälle", desc: "Durch rechtzeitige Erinnerungen erscheinen deutlich mehr Kunden zuverlässig." },
              { icon: "📆", title: "Planbarer Alltag", desc: "Ihr Kalender bleibt strukturiert und Ihr Tag vorhersehbar." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#E8FBF3] rounded-xl flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-[#1F2A37]">{item.title}</div>
                <div className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SUPPORT ─── */}
        <div className="border border-[#E5E7EB] bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#1F2A37]">Unterstützung & Kontakt</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Wir sind persönlich für Sie erreichbar</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
              Sollten Fragen auftreten oder Unterstützung benötigt werden, können Sie uns jederzeit kontaktieren.
              Wir empfehlen E-Mail für eine strukturierte Bearbeitung. In dringenden Fällen sind wir auch telefonisch erreichbar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="mailto:terminstopp.business@gmail.com"
                className="flex items-center gap-3 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 hover:border-[#18A66D] transition group"
              >
                <div className="w-9 h-9 bg-[#E8FBF3] rounded-lg flex items-center justify-center text-base shrink-0">✉️</div>
                <div>
                  <div className="text-xs text-[#6B7280] font-medium">E-Mail</div>
                  <div className="text-sm font-semibold text-[#1F2A37] group-hover:text-[#18A66D] transition">
                    terminstop.business@gmail.com
                  </div>
                </div>
              </a>
              <a
                href="tel:015154219634"
                className="flex items-center gap-3 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 hover:border-[#18A66D] transition group"
              >
                <div className="w-9 h-9 bg-[#E8FBF3] rounded-lg flex items-center justify-center text-base shrink-0">📞</div>
                <div>
                  <div className="text-xs text-[#6B7280] font-medium">Telefon</div>
                  <div className="text-sm font-semibold text-[#1F2A37] group-hover:text-[#18A66D] transition">
                    0151 54219634
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
