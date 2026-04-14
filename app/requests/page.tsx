"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

type Request = {
  id: string
  name: string
  phone: string
  date: string | null
  time: string | null
  note: string | null
  request_text: string | null
  created_at: string
  status: string
}

function cleanName(raw: string) {
  return raw.replace(/\s*\[.*?\]\s*/g, "").trim()
}
function getTag(raw: string) {
  const m = raw.match(/\[([^\]]+)\]/)
  return m ? m[1] : null
}
function formatDate(d: string | null, t: string | null) {
  if (!d) return null
  const dt = new Date(`${d}T${t || "00:00"}`)
  return dt.toLocaleString("de-DE", { weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) + " Uhr"
}

const NAV = [
  { href:"/dashboard", label:"Dashboard",  icon:"🏠" },
  { href:"/calendar",  label:"Kalender",   icon:"📅" },
  { href:"/customers", label:"Kunden",     icon:"👥" },
  { href:"/insights",  label:"Einblicke",  icon:"📊" },
  { href:"/requests",  label:"Anfragen",   icon:"🔔", active:true },
  { href:"/services",  label:"Buchung",    icon:"🔗" },
]

export default function RequestsPage() {
  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [requests,    setRequests]    = useState<Request[]>([])
  const [loading,     setLoading]     = useState(true)
  const [acting,      setActing]      = useState<string | null>(null)
  const [toast,       setToast]       = useState<{ msg:string; ok:boolean } | null>(null)

  useEffect(() => {
    const id   = localStorage.getItem("company_id")
    const name = localStorage.getItem("company_name")
    if (!id) { window.location.href = "/login"; return }
    setCompanyId(id)
    setCompanyName(name || "")
  }, [])

  useEffect(() => { if (companyId) load() }, [companyId])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from("appointments")
      .select("id, name, phone, date, time, note, request_text, created_at, status")
      .eq("company_id", companyId!)
      .eq("online_booking", true)
      .in("status", ["pending", "confirmed", "cancelled"])
      .order("created_at", { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  async function act(id: string, action: "confirm" | "reject") {
    setActing(id)
    const res = await fetch("/api/confirm-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: id, action, companyName })
    })
    const json = await res.json()
    setActing(null)
    if (json.success) {
      showToast(action === "confirm" ? "✓ Bestätigt – SMS wurde gesendet" : "Anfrage abgelehnt", action === "confirm")
      load()
    } else {
      showToast("Fehler: " + json.error, false)
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem("company_id")
    localStorage.removeItem("company_name")
    window.location.href = "/login"
  }

  const pending   = requests.filter(r => r.status === "pending")
  const confirmed = requests.filter(r => r.status === "confirmed")
  const cancelled = requests.filter(r => r.status === "cancelled")

  return (
    <div className="min-h-screen text-[#1F2A37] overflow-x-hidden" style={{ fontFamily:"'Inter','Manrope',sans-serif", backgroundColor:"#F7FAFC" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:9999, background: toast.ok ? "#065F46" : "#7F1D1D", color:"#fff", padding:"10px 20px", borderRadius:12, fontSize:14, fontWeight:600, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span><span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1">
            {[
              { href:"/dashboard", label:"Dashboard" },
              { href:"/calendar",  label:"Kalender" },
              { href:"/customers", label:"Kunden" },
              { href:"/insights",  label:"Einblicke" },
              { href:"/requests",  label:"Anfragen", active:true },
              { href:"/services",  label:"Buchung" },
            ].map(item => (
              <a key={item.href} href={item.href}
                className={`text-sm px-4 py-2 rounded-lg transition ${(item as any).active ? "font-semibold text-[#1F2A37] bg-[#F7FAFC]" : "text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC]"}`}>
                {item.label}
                {item.href === "/requests" && pending.length > 0 && (
                  <span className="ml-1.5 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending.length}</span>
                )}
              </a>
            ))}
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">Logout</button>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 flex justify-around items-center px-1 py-2">
        {NAV.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition relative ${item.active ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.href === "/requests" && pending.length > 0 && (
              <span style={{ position:"absolute", top:0, right:0, background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {pending.length}
              </span>
            )}
          </a>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-12">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1F2A37]">Online-Anfragen</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Kunden, die über Ihren QR-Code oder Link gebucht haben. Bestätigen Sie Anfragen — erst dann erscheinen sie im Kalender.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center text-[#9CA3AF] text-sm">
            <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#18A66D] rounded-full animate-spin mx-auto mb-3" />
            Wird geladen …
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm font-medium text-[#374151]">Noch keine Anfragen</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Sobald Kunden über Ihren Buchungslink buchen, erscheinen sie hier.</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* ── Offene Anfragen ── */}
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#EF4444] uppercase tracking-wider mb-2 px-1">
                  🔴 {pending.length} offene Anfrage{pending.length > 1 ? "n" : ""}
                </p>
                <div className="space-y-3">
                  {pending.map(r => (
                    <RequestCard key={r.id} r={r} acting={acting}
                      onConfirm={() => act(r.id, "confirm")}
                      onReject={() => act(r.id, "reject")} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Bestätigte ── */}
            {confirmed.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#059669] uppercase tracking-wider mb-2 px-1 mt-6">
                  ✓ Bestätigt ({confirmed.length})
                </p>
                <div className="space-y-2">
                  {confirmed.map(r => (
                    <RequestCard key={r.id} r={r} acting={acting} done />
                  ))}
                </div>
              </div>
            )}

            {/* ── Abgelehnte ── */}
            {cancelled.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 px-1 mt-6">
                  Abgelehnt ({cancelled.length})
                </p>
                <div className="space-y-2">
                  {cancelled.map(r => (
                    <RequestCard key={r.id} r={r} acting={acting} done />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

function RequestCard({ r, acting, onConfirm, onReject, done }: {
  r: Request
  acting: string | null
  onConfirm?: () => void
  onReject?: () => void
  done?: boolean
}) {
  const tag  = getTag(r.name)
  const name = cleanName(r.name)
  const dt   = formatDate(r.date, r.time)
  const isCallback = tag === "Rückruf"
  const isLoading  = acting === r.id

  const statusColor = r.status === "confirmed" ? "#059669" : r.status === "cancelled" ? "#9CA3AF" : "#F59E0B"
  const statusLabel = r.status === "confirmed" ? "Bestätigt" : r.status === "cancelled" ? "Abgelehnt" : "Offen"

  return (
    <div className={`bg-white rounded-2xl border ${r.status === "pending" ? "border-[#FDE68A] shadow-md" : "border-[#E5E7EB]"} overflow-hidden`}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-[#1F2A37]">{name}</span>
              {tag && (
                <span style={{ background: isCallback ? "#EFF6FF" : "#F0FDF4", color: isCallback ? "#1D4ED8" : "#065F46", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>
                  {tag}
                </span>
              )}
            </div>
            <a href={`tel:${r.phone}`} className="text-sm text-[#4F6EF7] font-medium mt-0.5 block hover:underline">
              📞 {r.phone}
            </a>
          </div>
          <div style={{ color: statusColor, fontSize:11, fontWeight:700, background: r.status === "pending" ? "#FEF3C7" : r.status === "confirmed" ? "#D1FAE5" : "#F3F4F6", padding:"3px 10px", borderRadius:20, flexShrink:0 }}>
            {statusLabel}
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          {isCallback ? (
            <p className="text-[#6B7280]">📞 Möchte zurückgerufen werden</p>
          ) : dt ? (
            <p className="text-[#1F2A37] font-semibold">🗓 {dt}</p>
          ) : null}
          {r.request_text && (
            <p className="text-[#6B7280]">💬 {r.request_text}</p>
          )}
          {r.note && (
            <p className="text-[#9CA3AF] text-xs">Notiz: {r.note}</p>
          )}
          <p className="text-[#9CA3AF] text-xs">
            Eingegangen: {new Date(r.created_at).toLocaleString("de-DE", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })} Uhr
          </p>
        </div>
      </div>

      {!done && r.status === "pending" && (
        <div className="px-5 pb-4 flex gap-2">
          <button
            onClick={onConfirm}
            disabled={!!isLoading}
            className="flex-1 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-xl transition">
            {isLoading ? "…" : "✓ Bestätigen + SMS"}
          </button>
          <button
            onClick={onReject}
            disabled={!!isLoading}
            className="flex-1 bg-[#F3F4F6] hover:bg-[#FEF2F2] disabled:opacity-50 text-[#6B7280] hover:text-[#DC2626] font-semibold text-sm py-2.5 rounded-xl transition border border-[#E5E7EB] hover:border-[#FECACA]">
            Ablehnen
          </button>
        </div>
      )}
    </div>
  )
}
