"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import DashNav from "../components/DashNav"

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

function buildWhatsAppLink(phone: string, name: string, date: string | null, time: string | null, companyName: string) {
  const cleanPhone = phone.replace(/\D/g, "")
  const normalizedPhone = cleanPhone.startsWith("0") ? "49" + cleanPhone.slice(1) : cleanPhone
  const dt = formatDate(date, time)
  let msg = ""
  if (dt) {
    msg = `Hallo ${cleanName(name)}, Ihr Termin am ${dt} bei ${companyName} wurde bestätigt. Wir freuen uns auf Sie!`
  } else {
    msg = `Hallo ${cleanName(name)}, Ihre Anfrage bei ${companyName} wurde bestätigt. Wir werden uns bei Ihnen melden!`
  }
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(msg)}`
}

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
      showToast(action === "confirm" ? "✓ Bestätigt – erscheint jetzt im Kalender" : "Anfrage abgelehnt", action === "confirm")
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

      <DashNav active="/requests" companyId={companyId} onLogout={handleLogout} />

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
                    <RequestCard key={r.id} r={r} acting={acting} companyName={companyName}
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
                    <RequestCard key={r.id} r={r} acting={acting} companyName={companyName} done />
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
                    <RequestCard key={r.id} r={r} acting={acting} companyName={companyName} done />
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

function RequestCard({ r, acting, onConfirm, onReject, done, companyName }: {
  r: Request
  acting: string | null
  onConfirm?: () => void
  onReject?: () => void
  done?: boolean
  companyName: string
}) {
  const tag  = getTag(r.name)
  const name = cleanName(r.name)
  const dt   = formatDate(r.date, r.time)
  const isCallback = tag === "Rückruf"
  const isLoading  = acting === r.id

  const statusColor = r.status === "confirmed" ? "#059669" : r.status === "cancelled" ? "#9CA3AF" : "#F59E0B"
  const statusLabel = r.status === "confirmed" ? "Bestätigt" : r.status === "cancelled" ? "Abgelehnt" : "Offen"

  const waLink = buildWhatsAppLink(r.phone, r.name, r.date, r.time, companyName)

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
            {isLoading ? "…" : "✓ Bestätigen"}
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp senden"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"#25D366", borderRadius:12, width:44, flexShrink:0, textDecoration:"none" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <button
            onClick={onReject}
            disabled={!!isLoading}
            className="flex-1 bg-[#F3F4F6] hover:bg-[#FEF2F2] disabled:opacity-50 text-[#6B7280] hover:text-[#DC2626] font-semibold text-sm py-2.5 rounded-xl transition border border-[#E5E7EB] hover:border-[#FECACA]">
            Ablehnen
          </button>
        </div>
      )}

      {/* WhatsApp button for confirmed bookings */}
      {r.status === "confirmed" && (
        <div className="px-5 pb-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#F0FDF4", border:"1px solid #BBF7D0", color:"#15803D", borderRadius:12, padding:"8px 16px", textDecoration:"none", fontSize:13, fontWeight:600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#15803D">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp schreiben
          </a>
        </div>
      )}
    </div>
  )
}
