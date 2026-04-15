"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

type NavItem = { href: string; label: string; icon: string; active?: boolean }

const DESKTOP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar",  label: "Kalender"  },
  { href: "/customers", label: "Kunden"    },
  { href: "/insights",  label: "Einblicke" },
  { href: "/requests",  label: "Anfragen"  },
  { href: "/services",  label: "Buchung"   },
]

const MOBILE_LINKS: NavItem[] = [
  { href: "/dashboard", label: "Start",     icon: "🏠" },
  { href: "/calendar",  label: "Kalender",  icon: "📅" },
  { href: "/customers", label: "Kunden",    icon: "👥" },
  { href: "/requests",  label: "Anfragen",  icon: "🔔" },
  { href: "/insights",  label: "Einblicke", icon: "📊" },
]

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

  useEffect(() => {
    if (!companyId) return
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("online_booking", true)
      .eq("status", "pending")
      .then(({ count }) => setPendingCount(count || 0))
  }, [companyId])

  return (
    <>
      {/* Desktop */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
          <div className="hidden md:flex gap-1">
            {DESKTOP_LINKS.map(item => (
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
        {MOBILE_LINKS.map(item => (
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
