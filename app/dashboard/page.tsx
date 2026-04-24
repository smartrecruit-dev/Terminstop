"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"
import SetupChecklist from "../components/SetupChecklist"

// ─────────────────────────────────────────────────────────────────────────────
type Employee = { id: string; name: string; active: boolean }

interface FormProps {
  name: string; setName: (v: string) => void
  phone: string; setPhone: (v: string) => void
  date: string; setDate: (v: string) => void
  time: string; setTime: (v: string) => void
  note: string; setNote: (v: string) => void
  employeeId: string; setEmployeeId: (v: string) => void
  employees: Employee[]
  isSubmitting: boolean
  formSuccess: boolean
  customers: any[]
  customerSearch: string; setCustomerSearch: (v: string) => void
  showSuggestions: boolean; setShowSuggestions: (v: boolean) => void
  onSubmit: (e: React.FormEvent, closeAfter?: boolean) => void
  closeForm?: () => void
}

function AppointmentForm({
  name, setName, phone, setPhone, date, setDate, time, setTime,
  note, setNote, employeeId, setEmployeeId, employees,
  isSubmitting, formSuccess, customers,
  customerSearch, setCustomerSearch, showSuggestions, setShowSuggestions,
  onSubmit, closeForm,
}: FormProps) {
  const inp = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  ).slice(0, 5)

  return (
    <form onSubmit={e => onSubmit(e, !!closeForm)} className="flex flex-col gap-4">
      <div className="relative">
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Name</label>
        <input className={inp} placeholder="Max Mustermann" value={name}
          onChange={e => { setName(e.target.value); setCustomerSearch(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off" autoCorrect="off" spellCheck={false} />
        {showSuggestions && customerSearch.length > 0 && (
          <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
            {filtered.length > 0 ? filtered.map(c => (
              <button key={c.id} type="button"
                onMouseDown={() => { setName(c.name); setPhone(c.phone || ""); setCustomerSearch(""); setShowSuggestions(false) }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#F0FDF6] transition flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8FBF3] flex items-center justify-center text-[#18A66D] text-xs font-black shrink-0">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">{c.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{c.phone}</div>
                </div>
              </button>
            )) : (
              <div className="px-4 py-3 text-xs text-[#9CA3AF]">Nicht in der Kartei – wird neu angelegt</div>
            )}
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Telefonnummer</label>
        <input className={inp} placeholder="0151 12345678" value={phone}
          onChange={e => setPhone(e.target.value)} type="tel" />
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
        <input className={inp} placeholder="z.B. Erstbesuch, Farbe" value={note}
          onChange={e => setNote(e.target.value)} />
      </div>
      {employees.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">
            Mitarbeiter <span className="font-normal normal-case text-[#9CA3AF]">(optional)</span>
          </label>
          <select
            className={inp}
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
          >
            <option value="">— Kein Mitarbeiter zugewiesen</option>
            {employees.filter(e => e.active).map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      )}
      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
          formSuccess ? "bg-[#E8FBF3] text-[#18A66D] border border-[#B6F0D5]"
          : isSubmitting ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          : "bg-[#18A66D] text-white hover:bg-[#15955F] shadow-[#18A66D]/20 active:scale-[.98]"
        }`}>
        {formSuccess ? "✓ Termin gespeichert!" : isSubmitting ? "Speichert …" : "Termin speichern →"}
      </button>
    </form>
  )
}

function TrialBanner() {
  const [visible, setVisible] = useState(false)
  const [daysLeft, setDaysLeft] = useState(14)

  useEffect(() => {
    const isNew = localStorage.getItem("is_new_user") === "1"
    if (!isNew) return

    // Check plan from DB — hide banner if paid plan is active
    const companyId = localStorage.getItem("company_id")
    if (companyId) {
      supabase.from("companies").select("plan").eq("id", companyId).single().then(({ data }) => {
        if (data?.plan && data.plan !== "trial") {
          localStorage.removeItem("is_new_user")
          setVisible(false)
          return
        }
        // Calculate days left (14 from first visit)
        const firstVisit = localStorage.getItem("trial_start")
        if (!firstVisit) {
          localStorage.setItem("trial_start", Date.now().toString())
          setDaysLeft(14)
        } else {
          const elapsed = Date.now() - parseInt(firstVisit)
          const days = Math.max(0, 14 - Math.floor(elapsed / (1000 * 60 * 60 * 24)))
          setDaysLeft(days)
        }
        setVisible(true)
      })
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      background: "linear-gradient(135deg, #0F8A57 0%, #0A6B43 100%)",
      borderRadius: 16, padding: "16px 20px", marginBottom: 20,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, flexWrap: "wrap",
      boxShadow: "0 4px 20px -6px rgba(10,107,67,0.35)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>🎉</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2 }}>
            Willkommen bei TerminStop! Dein Test läuft.
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            {daysLeft > 0
              ? `Noch ${daysLeft} Tag${daysLeft !== 1 ? "e" : ""} kostenlos — danach einfach ein Paket wählen.`
              : "Dein Testzeitraum ist abgelaufen — wähle jetzt dein Paket."}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <a href="/#preise" style={{
          fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 10,
          background: "#fff", color: "#0A6B43", textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)", whiteSpace: "nowrap",
        }}>
          Pakete ansehen →
        </a>
        <button
          onClick={() => { localStorage.removeItem("is_new_user"); setVisible(false) }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 18, padding: 4, lineHeight: 1 }}
          aria-label="Schließen"
        >×</button>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Guten Morgen"
  if (h < 18) return "Guten Tag"
  return "Guten Abend"
}

function InitialAvatar({ name, done }: { name: string; done: boolean }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
      background: done ? "#F3F4F6" : "#E8FBF3",
      color: done ? "#9CA3AF" : "#18A66D",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 800, letterSpacing: -0.5,
    }}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  useEffect(() => { document.title = "Dashboard | TerminStop" }, [])

  const [name, setName]   = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate]   = useState("")
  const [time, setTime]   = useState("")
  const [note, setNote]   = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [employees, setEmployees]   = useState<Employee[]>([])

  const [appointments, setAppointments] = useState<any[]>([])
  const [justAddedId, setJustAddedId]   = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess]   = useState(false)
  const [showForm, setShowForm]         = useState(false)

  const [companyId, setCompanyId]     = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [customers, setCustomers]     = useState<any[]>([])
  const [customerSearch, setCustomerSearch]   = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(true)
  const [smsUsed, setSmsUsed]   = useState(0)
  const [smsLimit, setSmsLimit] = useState(100)
  const [plan, setPlan]         = useState("trial")

  useEffect(() => {
    const storedId   = localStorage.getItem("company_id")
    const storedName = localStorage.getItem("company_name")
    if (!storedId) { window.location.href = "/login"; return }
    setCompanyName(storedName || "")
    Promise.all([
      supabase.from("companies").select("paused, sms_count_month, sms_limit, plan, name, created_at").eq("id", storedId).single(),
      supabase.from("appointments").select("*").eq("company_id", storedId)
        .order("date", { ascending: true }).order("time", { ascending: true }),
      supabase.from("customers").select("*").eq("company_id", storedId).order("name", { ascending: true }),
      supabase.from("employees").select("id, name, active").eq("company_id", storedId).order("created_at", { ascending: true }),
    ]).then(async ([coRes, apptRes, custRes, empRes]) => {
      const co = coRes.data
      if (co) {
        const plan = co.plan || "trial"

        // Gesperrt durch Admin oder Zahlung
        if (co.paused) {
          const reason = plan === "cancelled" ? "cancelled" : plan === "trial" ? "trial" : "payment"
          window.location.href = `/blocked?reason=${reason}&plan=${plan}`
          return
        }

        // Trial abgelaufen? (plan=trial + created_at älter als 14 Tage)
        if (plan === "trial" && co.created_at) {
          const createdAt = new Date(co.created_at).getTime()
          const trialDays = 14
          const expired   = Date.now() - createdAt > trialDays * 24 * 60 * 60 * 1000
          if (expired) {
            // Account automatisch pausieren
            await supabase.from("companies").update({ paused: true }).eq("id", storedId)
            window.location.href = "/blocked?reason=trial&plan=trial"
            return
          }
        }
      }
      setCompanyId(storedId)
      if (coRes.data) {
        setSmsUsed(coRes.data.sms_count_month || 0)
        setSmsLimit(coRes.data.sms_limit || 100)
        setPlan(coRes.data.plan || "trial")
        if (coRes.data.name) setCompanyName(coRes.data.name)
      }
      if (apptRes.data) setAppointments(apptRes.data)
      if (custRes.data) setCustomers(custRes.data)
      if (empRes.data)  setEmployees(empRes.data)
    }).finally(() => setLoading(false))
  }, [])

  async function loadAppointments() {
    if (!companyId) return
    const { data } = await supabase.from("appointments").select("*")
      .eq("company_id", companyId)
      .order("date", { ascending: true }).order("time", { ascending: true })
    if (data) setAppointments(data)
  }

  async function toggleDone(a: any) {
    await supabase.from("appointments").update({ status: a.status === "done" ? "pending" : "done" }).eq("id", a.id)
    loadAppointments()
  }

  async function handleSubmit(e: React.FormEvent, closeAfter = false) {
    e.preventDefault()
    if (!companyId || !name || !phone || !date || !time) return
    setIsSubmitting(true)
    const { data, error } = await supabase.from("appointments")
      .insert([{ name, phone, date, time, note, status: "pending", company_id: companyId, employee_id: employeeId || null }]).select()
    if (error) { alert("Fehler beim Speichern"); setIsSubmitting(false); return }
    if (data) { setJustAddedId(data[0].id); setTimeout(() => setJustAddedId(null), 1200) }
    setName(""); setPhone(""); setDate(""); setTime(""); setNote(""); setEmployeeId("")
    setCustomerSearch(""); setShowSuggestions(false)
    setIsSubmitting(false); setFormSuccess(true)
    setTimeout(() => { setFormSuccess(false); if (closeAfter) setShowForm(false) }, 1800)
    loadAppointments()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id"); localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const now      = new Date()
  const todayStr = now.toISOString().split("T")[0]
  const allToday = appointments.filter(a => a.date === todayStr)
  const doneCount = allToday.filter(a => a.status === "done").length
  const openCount = allToday.filter(a => a.status !== "done").length
  const nextOpen  = allToday.find(a => {
    if (a.status === "done") return false
    return new Date(`${a.date}T${a.time}`).getTime() >= now.getTime() - 30 * 60 * 1000
  })

  const formProps: FormProps = {
    name, setName, phone, setPhone, date, setDate, time, setTime,
    note, setNote, employeeId, setEmployeeId, employees,
    isSubmitting, formSuccess, customers,
    customerSearch, setCustomerSearch, showSuggestions, setShowSuggestions,
    onSubmit: handleSubmit,
  }

  // ── Skeleton ──
  if (loading) return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F4F6F9" }}>
      <DashNav active="/dashboard" companyId={null} onLogout={handleLogout} />
      <style>{`@keyframes skpulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div style={{ width: 180, height: 14, borderRadius: 8, background: "#E5E7EB", marginBottom: 10, animation: "skpulse 1.4s infinite" }} />
        <div style={{ width: 260, height: 26, borderRadius: 8, background: "#E5E7EB", marginBottom: 28, animation: "skpulse 1.4s infinite 0.1s" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
          {[0,1,2].map(i => <div key={i} style={{ height: 90, borderRadius: 20, background: "#fff", border: "1px solid #E5E7EB", animation: `skpulse 1.4s infinite ${i*0.1}s` }} />)}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F3F4F6", animation: `skpulse 1.4s infinite ${i*0.1}s` }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: "45%", height: 13, borderRadius: 8, background: "#F3F4F6", marginBottom: 6, animation: `skpulse 1.4s infinite ${i*0.1}s` }} />
                <div style={{ width: "28%", height: 10, borderRadius: 8, background: "#F3F4F6", animation: `skpulse 1.4s infinite ${i*0.1+0.05}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F4F6F9" }}>
      <style>{`
        @keyframes skpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .appt-row { transition: background .12s; }
        .appt-row:hover { background: #FAFAFA; }
        .appt-row.is-next { background: #F0FDF6; }
        .appt-row.is-done { opacity: .45; }
      `}</style>

      <DashNav active="/dashboard" companyId={companyId} onLogout={handleLogout} />

      {/* ── Mobiles Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[92dvh] overflow-y-auto"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111827]">Neuer Termin</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-sm">✕</button>
            </div>
            <AppointmentForm {...formProps} closeForm={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-7 pb-28 md:pb-10">

        {/* Trial-Banner für neue Nutzer */}
        <TrialBanner />

        {/* SMS-Limit Banner */}
        {smsUsed >= smsLimit && (
          <div style={{
            background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
            borderRadius: 16, padding: "16px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
            boxShadow: "0 4px 20px -6px rgba(220,38,38,0.35)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⛔</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2 }}>SMS-Limit erreicht</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  Du hast {smsUsed} von {smsLimit} SMS verbraucht. Keine weiteren SMS bis zum nächsten Monat — oder upgrade dein Paket.
                </div>
              </div>
            </div>
            <a href="/settings" style={{ fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 10, background: "#fff", color: "#DC2626", textDecoration: "none", whiteSpace: "nowrap" }}>
              Paket upgraden →
            </a>
          </div>
        )}

        {/* SMS-Limit Warnung bei 80% */}
        {smsUsed < smsLimit && smsUsed / smsLimit >= 0.8 && (
          <div style={{
            background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
            borderRadius: 16, padding: "14px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
            boxShadow: "0 4px 20px -6px rgba(217,119,6,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                Noch {smsLimit - smsUsed} SMS übrig diesen Monat ({smsUsed}/{smsLimit} verbraucht)
              </div>
            </div>
            <a href="/settings" style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.2)", color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}>
              Upgrade →
            </a>
          </div>
        )}

        {/* Onboarding */}
        {companyId && <SetupChecklist companyId={companyId} appointmentCount={appointments.length} />}

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#18A66D" }}>
              {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl font-black text-[#111827] leading-tight">
              {getGreeting()}{companyName ? `, ${companyName.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              {allToday.length === 0 ? "Heute noch keine Termine eingetragen" : `${allToday.length} Termin${allToday.length !== 1 ? "e" : ""} für heute`}
            </p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="hidden md:flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition active:scale-[.97] shrink-0"
            style={{ background: "#18A66D", boxShadow: "0 4px 14px rgba(24,166,109,0.25)" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Termin
          </button>
        </div>

        {/* ── KPI-Karten ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Heute",
              value: allToday.length,
              sub: "Termine",
              color: "#111827",
              bg: "#fff",
              accent: "#E5E7EB",
              extra: null,
            },
            {
              label: "Erledigt",
              value: doneCount,
              sub: allToday.length > 0 ? `von ${allToday.length}` : "–",
              color: "#18A66D",
              bg: "#F0FDF6",
              accent: "#B6F0D5",
              extra: null,
            },
            {
              label: "Nächster",
              value: nextOpen ? nextOpen.time : "–",
              sub: nextOpen ? nextOpen.name.split(" ")[0] : "Alle erledigt",
              color: "#111827",
              bg: "#fff",
              accent: "#E5E7EB",
              extra: null,
            },
            {
              label: "SMS diesen Monat",
              value: `${smsUsed}/${smsLimit}`,
              sub: smsUsed >= smsLimit ? "⛔ Limit erreicht" : `${smsLimit - smsUsed} übrig`,
              color: smsUsed >= smsLimit ? "#DC2626" : smsUsed / smsLimit >= 0.8 ? "#D97706" : "#18A66D",
              bg: smsUsed >= smsLimit ? "#FEF2F2" : "#fff",
              accent: smsUsed >= smsLimit ? "#FECACA" : "#E5E7EB",
              extra: { used: smsUsed, limit: smsLimit },
            },
          ].map((card, i) => (
            <div key={i} style={{
              background: card.bg,
              border: `1px solid ${card.accent}`,
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              animation: `slideUp .3s ease both`,
              animationDelay: `${i * 60}ms`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 8 }}>
                {card.label}
              </div>
              <div style={{ fontSize: card.extra ? 20 : 26, fontWeight: 900, color: card.color, lineHeight: 1, letterSpacing: "-1px" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card.sub}
              </div>
              {card.extra && (
                <div style={{ height: 4, background: "#F3F4F6", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${Math.min(100, Math.round((card.extra.used / card.extra.limit) * 100))}%`,
                    background: card.extra.used >= card.extra.limit ? "#DC2626" : card.extra.used / card.extra.limit >= 0.8 ? "#F59E0B" : "#18A66D",
                    transition: "width .5s ease",
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Tages-Fortschrittsbalken ── */}
        {allToday.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "14px 20px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{doneCount} von {allToday.length} Terminen erledigt</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#18A66D" }}>{Math.round((doneCount / allToday.length) * 100)} %</span>
            </div>
            <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #18A66D, #22C97E)",
                borderRadius: 99, transition: "width .5s cubic-bezier(.4,0,.2,1)",
                width: `${Math.round((doneCount / allToday.length) * 100)}%`
              }} />
            </div>
          </div>
        )}

        <div className="flex gap-5 items-start">

          {/* ── Terminliste ── */}
          <div className="flex-1 min-w-0">
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {allToday.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: "#F0FDF6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontSize: 28
                  }}>📅</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Noch keine Termine heute</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Tippe auf + um den ersten Termin einzutragen</div>
                </div>
              ) : (
                <div>
                  {allToday.map((a: any, idx: number) => {
                    const isDone = a.status === "done"
                    const isNext = a.id === nextOpen?.id
                    const isNew  = a.id === justAddedId
                    return (
                      <div key={a.id}
                        className={`appt-row${isDone ? " is-done" : ""}${isNext ? " is-next" : ""}`}
                        style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "14px 20px",
                          borderBottom: idx < allToday.length - 1 ? "1px solid #F3F4F6" : "none",
                          borderLeft: isNext ? "3px solid #18A66D" : "3px solid transparent",
                          animation: isNew ? "slideUp .3s ease" : undefined,
                        }}>

                        {/* Avatar */}
                        <InitialAvatar name={a.name} done={isDone} />

                        {/* Zeit-Badge */}
                        <div style={{
                          fontSize: 12, fontWeight: 800,
                          padding: "5px 10px", borderRadius: 10, flexShrink: 0,
                          background: isNext ? "#18A66D" : isDone ? "#F3F4F6" : "#F0FDF6",
                          color: isNext ? "#fff" : isDone ? "#9CA3AF" : "#18A66D",
                          minWidth: 52, textAlign: "center",
                        }}>
                          {a.time}
                        </div>

                        {/* Infos */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 700,
                            color: isDone ? "#9CA3AF" : "#111827",
                            textDecoration: isDone ? "line-through" : "none",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>
                            {a.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                            {a.phone}{a.note ? ` · ${a.note}` : ""}
                          </div>
                        </div>

                        {/* SMS-Badge */}
                        <div className="hidden sm:flex" style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                          background: "#F0FDF6", color: "#18A66D", border: "1px solid #B6F0D5",
                          flexShrink: 0, alignItems: "center", gap: 4
                        }}>
                          <span style={{ width: 5, height: 5, background: "#18A66D", borderRadius: "50%" }} />
                          SMS ✓
                        </div>

                        {/* Done-Button */}
                        <button onClick={() => toggleDone(a)}
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            border: isDone ? "2px solid #18A66D" : "2px solid #D1D5DB",
                            background: isDone ? "#18A66D" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, cursor: "pointer", transition: "all .15s",
                          }}>
                          {isDone && <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span>}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Weitere Termine (nicht heute) - kompakt */}
            {appointments.filter(a => a.date > todayStr).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10, paddingLeft: 4 }}>
                  Nächste Termine
                </div>
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  {appointments.filter(a => a.date > todayStr).slice(0, 5).map((a: any, idx: number, arr: any[]) => (
                    <div key={a.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 18px",
                      borderBottom: idx < arr.length - 1 ? "1px solid #F9FAFB" : "none",
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: "#6B7280",
                        background: "#F3F4F6", borderRadius: 8, padding: "4px 8px", flexShrink: 0, minWidth: 76, textAlign: "center"
                      }}>
                        {new Date(a.date + "T00:00").toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#18A66D", background: "#F0FDF6", borderRadius: 8, padding: "4px 8px", flexShrink: 0 }}>
                        {a.time}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Desktop Sidebar ── */}
          <div className="hidden md:flex flex-col gap-4 w-72 flex-shrink-0">

            {/* Neuer Termin */}
            <div style={{
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 20, padding: "20px", position: "sticky", top: 76,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E8FBF3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>＋</div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#111827", margin: 0 }}>Neuer Termin</h2>
              </div>
              <AppointmentForm {...formProps} />
            </div>

          </div>

        </div>
      </div>

      {/* ── Mobiler FAB ── */}
      <button onClick={() => setShowForm(true)}
        className="md:hidden fixed bottom-20 right-5 z-40 w-14 h-14 text-white text-3xl font-light rounded-full flex items-center justify-center transition active:scale-95"
        style={{ background: "#18A66D", boxShadow: "0 6px 20px rgba(24,166,109,0.4)" }}>
        +
      </button>
    </div>
  )
}
