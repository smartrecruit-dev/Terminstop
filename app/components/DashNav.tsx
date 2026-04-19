"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabaseClient"

type NavItem = { href: string; label: string; icon: React.ReactNode; active?: boolean }

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconBell = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const IconGrid = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
)

const DESKTOP_BASE = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar",  label: "Kalender"  },
  { href: "/customers", label: "Kunden"    },
]
const DESKTOP_ADDON  = [{ href: "/requests", label: "Anfragen" }]
const DESKTOP_MORE_BASE = [
  { href: "/insights", label: "Einblicke"     },
  { href: "/settings", label: "Einstellungen" },
]
const DESKTOP_MORE_ADDON = [{ href: "/services", label: "Buchungsseite" }]

const MOBILE_BASE: NavItem[] = [
  { href: "/dashboard", label: "Start",    icon: <IconHome />    },
  { href: "/calendar",  label: "Kalender", icon: <IconCalendar />},
  { href: "/customers", label: "Kunden",   icon: <IconUsers />   },
  { href: "/settings",  label: "Mehr",     icon: <IconGrid />    },
]
const MOBILE_ADDON: NavItem = { href: "/requests", label: "Anfragen", icon: <IconBell /> }

export default function DashNav({
  active, companyId, onLogout,
}: {
  active: string
  companyId: string | null
  onLogout: () => void
}) {
  const [pendingCount, setPendingCount] = useState(0)
  const [bookingAddon, setBookingAddon] = useState(false)
  const [moreOpen, setMoreOpen]         = useState(false)
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
    supabase.from("companies").select("booking_addon").eq("id", companyId).single()
      .then(({ data }) => setBookingAddon(!!data?.booking_addon))
    supabase.from("appointments").select("id", { count: "exact", head: true })
      .eq("company_id", companyId).eq("online_booking", true).eq("status", "pending")
      .then(({ count }) => setPendingCount(count || 0))
  }, [companyId])

  const desktopLinks = bookingAddon ? [...DESKTOP_BASE, ...DESKTOP_ADDON] : DESKTOP_BASE
  const desktopMore  = bookingAddon ? [...DESKTOP_MORE_ADDON, ...DESKTOP_MORE_BASE] : DESKTOP_MORE_BASE
  const mobileLinks  = bookingAddon
    ? [...MOBILE_BASE.slice(0, 3), MOBILE_ADDON, MOBILE_BASE[3]]
    : MOBILE_BASE

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 58,
        fontFamily: "'Inter','Manrope',sans-serif",
      }}>
        {/* Logo + Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/dashboard" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.3px" }}>
              <span style={{ color: "#18A66D" }}>Termin</span>
              <span style={{ color: "#111827" }}>Stop</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: 2 }}>
            {desktopLinks.map(item => {
              const isActive = active === item.href
              return (
                <a key={item.href} href={item.href} style={{
                  position: "relative", textDecoration: "none",
                  padding: "6px 14px", borderRadius: 9,
                  fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#111827" : "#6B7280",
                  background: isActive ? "#F0FBF6" : "transparent",
                  transition: "all .12s",
                }}>
                  {item.label}
                  {isActive && (
                    <span style={{
                      position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                      width: 20, height: 2.5, borderRadius: 99, background: "#18A66D",
                    }} />
                  )}
                  {item.href === "/requests" && pendingCount > 0 && (
                    <span style={{
                      position: "absolute", top: 2, right: 2,
                      background: "#EF4444", color: "#fff",
                      fontSize: 9, fontWeight: 800, minWidth: 16, height: 16,
                      borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", padding: "0 3px",
                    }}>{pendingCount}</span>
                  )}
                </a>
              )
            })}

            {/* Mehr-Dropdown */}
            <div ref={moreRef} style={{ position: "relative" }}>
              <button onClick={() => setMoreOpen(v => !v)} style={{
                padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13.5, fontWeight: desktopMore.some(m => m.href === active) ? 700 : 500,
                color: desktopMore.some(m => m.href === active) ? "#111827" : "#6B7280",
                background: desktopMore.some(m => m.href === active) ? "#F0FBF6" : "transparent",
                transition: "all .12s", display: "flex", alignItems: "center", gap: 4,
              }}>
                Mehr
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {moreOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100,
                  background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.10)", minWidth: 190, overflow: "hidden",
                }}>
                  {desktopMore.map(item => (
                    <a key={item.href} href={item.href} onClick={() => setMoreOpen(false)} style={{
                      display: "block", padding: "11px 16px", fontSize: 13.5,
                      fontWeight: active === item.href ? 700 : 500,
                      color: active === item.href ? "#18A66D" : "#374151",
                      background: active === item.href ? "#F0FBF6" : "transparent",
                      textDecoration: "none", transition: "background .1s",
                    }}
                    onMouseEnter={e => { if (active !== item.href) (e.currentTarget as HTMLElement).style.background = "#F9FAFB" }}
                    onMouseLeave={e => { if (active !== item.href) (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                      {item.label}
                    </a>
                  ))}
                  <div style={{ borderTop: "1px solid #F3F4F6", margin: "4px 0" }} />
                  <button onClick={onLogout} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "11px 16px", fontSize: 13.5, fontWeight: 500,
                    color: "#EF4444", background: "transparent", border: "none",
                    cursor: "pointer", transition: "background .1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rechts */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 6, fontSize: 12, color: "#18A66D", fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, background: "#18A66D", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            System aktiv
          </div>
          <button onClick={onLogout} className="hidden md:block" style={{
            fontSize: 13, color: "#6B7280", background: "#F3F4F6",
            border: "none", cursor: "pointer", padding: "7px 14px",
            borderRadius: 9, fontWeight: 600, transition: "all .12s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#E5E7EB")}
          onMouseLeave={e => (e.currentTarget.style.background = "#F3F4F6")}>
            Abmelden
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav (nur auf Mobilgeräten) ── */}
      <div className="ts-mobile-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff",
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        zIndex: 50,
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 8,
        display: "flex",
      }}>
        {mobileLinks.map(item => {
          const isActive = active === item.href
          return (
            <a key={item.href} href={item.href} style={{
              position: "relative",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
              padding: "4px 12px",
              textDecoration: "none",
              color: isActive ? "#18A66D" : "#9CA3AF",
              transition: "color .12s",
              minWidth: 52,
            }}>
              {/* Active dot */}
              {isActive && (
                <span style={{
                  position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                  width: 28, height: 3, borderRadius: 99, background: "#18A66D",
                }} />
              )}
              <span style={{ lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: .2 }}>
                {item.label}
              </span>
              {item.href === "/requests" && pendingCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 6,
                  background: "#EF4444", color: "#fff",
                  fontSize: 9, fontWeight: 800, minWidth: 15, height: 15,
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", padding: "0 2px",
                }}>{pendingCount}</span>
              )}
            </a>
          )
        })}
      </div>
      <style>{`
        @media (min-width: 768px) { .ts-mobile-nav { display: none !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </>
  )
}
