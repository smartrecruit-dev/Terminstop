"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabaseClient"

type NavItem = { href: string; label: string; icon: string; active?: boolean }

// Kern-Links — immer sichtbar
const DESKTOP_BASE = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar",  label: "Kalender"  },
  { href: "/customers", label: "Kunden"    },
]

// Nur mit Booking Add-on
const DESKTOP_ADDON = [
  { href: "/requests",  label: "Anfragen"  },
]

// Mehr-Menü — weniger prominent
const DESKTOP_MORE_BASE = [
  { href: "/insights",  label: "Einblicke" },
  { href: "/settings",  label: "⚙️ Einstellungen" },
]
const DESKTOP_MORE_ADDON = [
  { href: "/services",  label: "Buchung"   },
]

const MOBILE_BASE: NavItem[] = [
  { href: "/dashboard", label: "Start",    icon: "🏠" },
  { href: "/calendar",  label: "Kalender", icon: "📅" },
  { href: "/customers", label: "Kunden",   icon: "👥" },
  { href: "/settings",  label: "Mehr",     icon: "⚙️" },
]
const MOBILE_ADDON: NavItem = { href: "/requests", label: "Anfragen", icon: "🔔" }

export default function DashNav({
  active,
  companyId,
  onLogout,
}: {
  active: string
  companyId: string | null
  onLogout: () => void
}) {
  const [pendingCount, setPendingCount] = useState(0)
  const [bookingAddon, setBookingAddon] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    if (!companyId) return

    // Fetch booking_addon flag
    supabase
      .from("companies")
      .select("booking_addon")
      .eq("id", companyId)
      .single()
      .then(({ data }) => setBookingAddon(!!data?.booking_addon))

    // Fetch pending online bookings
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("online_booking", true)
      .eq("status", "pending")
      .then(({ count }) => setPendingCount(count || 0))
  }, [companyId])

  // Build nav arrays based on add-on status
  const desktopLinks = bookingAddon
    ? [...DESKTOP_BASE, ...DESKTOP_ADDON]
    : DESKTOP_BASE

  const desktopMore = bookingAddon
    ? [...DESKTOP_MORE_ADDON, ...DESKTOP_MORE_BASE]
    : DESKTOP_MORE_BASE

  const mobileLinks: NavItem[] = bookingAddon
    ? [...MOBILE_BASE.slice(0, 3), MOBILE_ADDON, MOBILE_BASE[3]]
    : MOBILE_BASE

  return (
    <>
      {/* Desktop */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1 items-center">
            {desktopLinks.map(item => (
              <a key={item.href} href={item.href}
                className={`relative text-sm px-4 py-2 rounded-lg transition ${
                  active === item.href
                    ? "font-semibold text-[#1F2A37] bg-[#F7FAFC]"
                    : "text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC]"
                }`}>
                {item.label}
                {item.href === "/requests" && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </a>
            ))}
            {/* Mehr-Dropdown */}
            <div ref={moreRef} style={{ position: "relative" }}>
              <button onClick={() => setMoreOpen(v => !v)}
                className={`relative text-sm px-4 py-2 rounded-lg transition ${
                  desktopMore.some(m => m.href === active)
                    ? "font-semibold text-[#1F2A37] bg-[#F7FAFC]"
                    : "text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FAFC]"
                }`}>
                Mehr ▾
              </button>
              {moreOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0,
                  background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 100,
                  minWidth: 180, overflow: "hidden",
                }}>
                  {desktopMore.map(item => (
                    <a key={item.href} href={item.href}
                      onClick={() => setMoreOpen(false)}
                      style={{
                        display: "block", padding: "10px 16px", fontSize: 13, fontWeight: 500,
                        color: active === item.href ? "#18A66D" : "#374151",
                        background: active === item.href ? "#F0FBF6" : "transparent",
                        textDecoration: "none", transition: "background .12s",
                      }}
                      onMouseEnter={e => { if (active !== item.href) (e.currentTarget as HTMLElement).style.background = "#F9FAFB" }}
                      onMouseLeave={e => { if (active !== item.href) (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#18A66D] font-medium">
            <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
            System aktiv
          </div>
          <button onClick={onLogout}
            className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition px-3 py-1.5 rounded-lg hover:bg-[#F7FAFC]">
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 flex justify-around items-center px-2 py-2 pb-safe" style={{ paddingBottom:"max(8px, env(safe-area-inset-bottom))" }}>
        {mobileLinks.map(item => (
          <a key={item.href} href={item.href}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
              active === item.href ? "text-[#18A66D]" : "text-[#9CA3AF]"
            }`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.href === "/requests" && pendingCount > 0 && (
              <span style={{ position:"absolute", top:0, right:2, background:"#EF4444", color:"#fff", fontSize:9, fontWeight:700, minWidth:15, height:15, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 2px" }}>
                {pendingCount}
              </span>
            )}
          </a>
        ))}
      </div>
    </>
  )
}
