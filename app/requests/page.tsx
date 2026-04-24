"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useAccessGuard } from "../lib/useAccessGuard"
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
  return dt.toLocaleString("de-DE", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit"
  }) + " Uhr"
}

export default function RequestsPage() {
    useEffect(() => { document.title = "Anfragen | TerminStop" }, [])

const [companyId,    setCompanyId]    = useState<string | null>(null)
  useAccessGuard(companyId) // → redirect to /blocked if locked
  const [companyName,  setCompanyName]  = useState("")
  const [bookingAddon, setBookingAddon] = useState<boolean | null>(null)
  const [requests,     setRequests]     = useState<Request[]>([])
  const [loading,      setLoading]      = useState(true)
  const [acting,       setActing]       = useState<string | null>(null)
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null)

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

    // Add-on Status immer frisch laden
    const { data: co } = await supabase
      .from("companies")
      .select("booking_addon")
      .eq("id", companyId!)
      .single()
    setBookingAddon(co?.booking_addon ?? false)

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

  async function act(id: string, action: "confirm" | "reject", skipSms = false) {
    setActing(id)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ""
    const res = await fetch("/api/confirm-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ appointmentId: id, action, companyName, skipSms })
    })
    const json = await res.json()
    setActing(null)
    if (json.success) {
      if (action === "confirm") {
        if (skipSms) {
          showToast("✓ Als erledigt markiert", true)
        } else {
          const smsOk = json.sms === "sent"
          showToast(
            smsOk ? "✓ Bestätigt — SMS an Kunden gesendet" : "✓ Bestätigt — SMS konnte nicht gesendet werden",
            smsOk
          )
        }
      } else {
        showToast("Anfrage abgelehnt", false)
      }
      load()
    } else {
      showToast("Fehler: " + json.error, false)
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
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
    <div className="min-h-screen text-[#1F2A37] overflow-x-hidden" style={{ fontFamily: "'Inter','Manrope',sans-serif", backgroundColor: "#F7FAFC" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: toast.ok ? "#065F46" : "#7F1D1D",
          color: "#fff", padding: "12px 24px", borderRadius: 14, fontSize: 14,
          fontWeight: 600, boxShadow: "0 6px 28px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 8
        }}>
          {toast.ok ? "📱" : "⚠️"} {toast.msg}
        </div>
      )}

      <DashNav active="/requests" companyId={companyId} onLogout={handleLogout} />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-12">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1F2A37]">Online-Anfragen</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Kunden, die über Ihren QR-Code oder Link gebucht haben. Bei Bestätigung wird automatisch eine SMS verschickt.
          </p>
        </div>

        {/* ── ADD-ON GESPERRT ── */}
        {bookingAddon === false && (
          <div style={{
            background:"#fff", border:"2px dashed #E5E7EB", borderRadius:20,
            padding:"40px 28px", textAlign:"center"
          }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔔</div>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#1F2A37", marginBottom:8 }}>
              Online-Buchung ist noch nicht freigeschaltet
            </h2>
            <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.65, maxWidth:360, margin:"0 auto 24px" }}>
              Sobald das Add-on aktiv ist, landen alle Kundenanfragen hier — und Sie bestätigen mit einem Klick.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:300, margin:"0 auto 28px" }}>
              {[
                "Anfragen direkt aus Ihrem Buchungslink",
                "Bestätigen per Klick — Kunde bekommt SMS",
                "Offene Anfragen mit rotem Badge sichtbar",
              ].map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, textAlign:"left" }}>
                  <span style={{ color:"#18A66D", fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13, color:"#374151" }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="mailto:terminstop.business@gmail.com?subject=Online-Buchung Add-on anfragen"
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"#18A66D", color:"#fff", textDecoration:"none",
                fontSize:14, fontWeight:700, padding:"12px 28px", borderRadius:12,
                boxShadow:"0 4px 16px rgba(24,166,109,0.25)"
              }}>
              Add-on anfragen →
            </a>
            <p style={{ fontSize:12, color:"#9CA3AF", marginTop:12 }}>
              Sprechen Sie uns an — wir schalten es für Sie frei.
            </p>
          </div>
        )}

        {/* Stats bar */}
        {bookingAddon === true && !loading && requests.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center">
              <div className="text-2xl font-bold text-[#EF4444]">{pending.length}</div>
              <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Offen</div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center">
              <div className="text-2xl font-bold text-[#059669]">{confirmed.length}</div>
              <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Bestätigt</div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center">
              <div className="text-2xl font-bold text-[#9CA3AF]">{cancelled.length}</div>
              <div className="text-xs text-[#6B7280] mt-0.5 font-medium">Abgelehnt</div>
            </div>
          </div>
        )}

        {bookingAddon === true && loading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center text-[#9CA3AF] text-sm">
            <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#18A66D] rounded-full animate-spin mx-auto mb-3" />
            Wird geladen …
          </div>
        ) : bookingAddon === true && requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-sm font-semibold text-[#374151]">Noch keine Anfragen</p>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
              Sobald Kunden über Ihren Buchungslink buchen,<br />erscheinen sie hier.
            </p>
          </div>
        ) : bookingAddon === true ? (
          <div className="space-y-6">

            {/* ── Offene Anfragen ── */}
            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                  <p className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    {pending.length} offene Anfrage{pending.length > 1 ? "n" : ""}
                  </p>
                </div>
                <div className="space-y-3">
                  {pending.map(r => {
                    const isCallback = getTag(r.name) === "Rückruf"
                    return (
                      <RequestCard key={r.id} r={r} acting={acting}
                        onConfirm={() => act(r.id, "confirm", isCallback)}
                        onReject={() => act(r.id, "reject")} />
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── Bestätigte ── */}
            {confirmed.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <p className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                    Bestätigt ({confirmed.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {confirmed.map(r => (
                    <RequestCard key={r.id} r={r} acting={acting} done />
                  ))}
                </div>
              </section>
            )}

            {/* ── Abgelehnte ── */}
            {cancelled.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Abgelehnt ({cancelled.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {cancelled.map(r => (
                    <RequestCard key={r.id} r={r} acting={acting} done />
                  ))}
                </div>
              </section>
            )}

          </div>
        ) : null}
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
  const tag        = getTag(r.name)
  const name       = cleanName(r.name)
  const dt         = formatDate(r.date, r.time)
  const isCallback = tag === "Rückruf"
  const isLoading  = acting === r.id

  const isPending   = r.status === "pending"
  const isConfirmed = r.status === "confirmed"
  const isCancelled = r.status === "cancelled"

  const statusConfig = isConfirmed
    ? { label: "Bestätigt", color: "#059669", bg: "#D1FAE5" }
    : isCancelled
    ? { label: "Abgelehnt", color: "#9CA3AF", bg: "#F3F4F6" }
    : { label: "Offen",     color: "#D97706", bg: "#FEF3C7" }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: isPending ? "2px solid #FDE68A" : "1px solid #E5E7EB",
      overflow: "hidden",
      boxShadow: isPending ? "0 4px 20px rgba(239,68,68,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s"
    }}>

      {/* Coloured top accent bar for pending */}
      {isPending && (
        <div style={{ height: 3, background: "linear-gradient(90deg,#F59E0B,#EF4444)", borderRadius: "20px 20px 0 0" }} />
      )}
      {isConfirmed && (
        <div style={{ height: 3, background: "linear-gradient(90deg,#10B981,#059669)", borderRadius: "20px 20px 0 0" }} />
      )}

      <div style={{ padding: "16px 20px 14px" }}>

        {/* Row 1: name + status badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1F2A37", letterSpacing: -0.2 }}>{name}</span>
              {tag && (
                <span style={{
                  background: isCallback ? "#EFF6FF" : "#F0FDF4",
                  color: isCallback ? "#1D4ED8" : "#065F46",
                  fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20
                }}>
                  {tag}
                </span>
              )}
            </div>
            <a href={`tel:${r.phone}`} style={{
              fontSize: 13, color: "#4F6EF7", fontWeight: 600, marginTop: 3,
              display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none"
            }}>
              📞 {r.phone}
            </a>
          </div>

          <div style={{
            background: statusConfig.bg, color: statusConfig.color,
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, flexShrink: 0,
            whiteSpace: "nowrap"
          }}>
            {statusConfig.label}
          </div>
        </div>

        {/* Row 2: details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {isCallback ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
              <span>📞</span><span>Möchte zurückgerufen werden</span>
            </div>
          ) : dt ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#F0FDF4", border: "1px solid #D1FAE5",
              borderRadius: 10, padding: "5px 10px", fontSize: 13,
              fontWeight: 700, color: "#065F46", width: "fit-content"
            }}>
              🗓 {dt}
            </div>
          ) : null}

          {r.request_text && (
            <div style={{
              background: "#F8FAFC", borderRadius: 10, padding: "8px 12px",
              fontSize: 13, color: "#374151", lineHeight: 1.5,
              borderLeft: "3px solid #E5E7EB"
            }}>
              💬 {r.request_text}
            </div>
          )}

          {r.note && (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              Notiz: {r.note}
            </p>
          )}

          <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>
            {new Date(r.created_at).toLocaleString("de-DE", {
              day: "numeric", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit"
            })} Uhr
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {!done && isPending && (
        <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
          <button
            onClick={onConfirm}
            disabled={!!isLoading}
            style={{
              flex: 1, background: isLoading ? "#E5E7EB" : "#059669",
              color: isLoading ? "#9CA3AF" : "#fff", border: "none",
              borderRadius: 12, fontSize: 14, fontWeight: 700,
              padding: "12px 0", cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow: isLoading ? "none" : "0 4px 14px rgba(5,150,105,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6
            }}>
            {isLoading ? (
              <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            ) : "✓"} {isLoading ? "…" : isCallback ? "Als erledigt markieren" : "Bestätigen + SMS"}
          </button>

          <button
            onClick={onReject}
            disabled={!!isLoading}
            style={{
              flex: 1, background: "#F9FAFB", color: "#6B7280",
              border: "1.5px solid #E5E7EB", borderRadius: 12, fontSize: 14,
              fontWeight: 600, padding: "12px 0", cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s", opacity: isLoading ? 0.5 : 1
            }}>
            Ablehnen
          </button>
        </div>
      )}

      {/* SMS hint for confirmed — nur bei Nicht-Rückrufen */}
      {isConfirmed && !isCallback && (
        <div style={{
          margin: "0 16px 14px",
          background: "#F0FDF4", border: "1px solid #D1FAE5",
          borderRadius: 10, padding: "8px 12px",
          fontSize: 12, color: "#065F46", fontWeight: 500
        }}>
          📱 SMS-Bestätigung wurde an den Kunden gesendet
        </div>
      )}
      {isConfirmed && isCallback && (
        <div style={{
          margin: "0 16px 14px",
          background: "#F0FBF6", border: "1px solid #D1F5E3",
          borderRadius: 10, padding: "8px 12px",
          fontSize: 12, color: "#065F46", fontWeight: 500
        }}>
          ✓ Rückruf erledigt
        </div>
      )}
    </div>
  )
}
