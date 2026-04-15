"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

interface ChecklistProps {
  companyId: string
  appointmentCount: number
}

interface CheckItem {
  id: string
  label: string
  desc: string
  href: string
  done: boolean
}

export default function SetupChecklist({ companyId, appointmentCount }: ChecklistProps) {
  const [items, setItems]     = useState<CheckItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hidden, setHidden]   = useState(false)

  useEffect(() => {
    if (!companyId) return
    load()
  }, [companyId, appointmentCount])

  async function load() {
    const [{ data: company }, { count: serviceCount }] = await Promise.all([
      supabase.from("companies").select("notification_phone, slug").eq("id", companyId).single(),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    ])

    setItems([
      {
        id: "termin",
        label: "Ersten Termin eintragen",
        desc: "Trag Name, Telefon, Datum und Uhrzeit ein – SMS läuft dann automatisch.",
        href: "/dashboard",
        done: appointmentCount > 0,
      },
      {
        id: "telefon",
        label: "Benachrichtigungs-Nummer setzen",
        desc: "Erhalte eine SMS wenn eine neue Online-Anfrage eingeht.",
        href: "/settings",
        done: !!company?.notification_phone,
      },
      {
        id: "buchungslink",
        label: "Buchungslink einrichten",
        desc: "Richte deinen persönlichen Link ein (terminstop.de/book/dein-betrieb).",
        href: "/settings",
        done: !!company?.slug,
      },
      {
        id: "leistungen",
        label: "Leistungen hinzufügen",
        desc: "Kunden wählen bei der Online-Buchung aus deinen Leistungen aus.",
        href: "/services",
        done: (serviceCount || 0) > 0,
      },
    ])
    setLoading(false)
  }

  if (loading || hidden) return null
  const doneCount  = items.filter(i => i.done).length
  const totalCount = items.length
  if (doneCount === totalCount) return null  // alles erledigt — ausblenden

  const pct = Math.round((doneCount / totalCount) * 100)

  const G  = "#18A66D"
  const GL = "#F0FBF6"
  const GB = "#D1F5E3"

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 20,
      padding: "24px 28px",
      marginBottom: 28,
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      position: "relative",
    }}>
      {/* Dismiss */}
      <button
        onClick={() => setHidden(true)}
        style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9CA3AF", padding:4 }}
        aria-label="Ausblenden">
        ✕
      </button>

      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Einrichtung abschließen</span>
          <span style={{ fontSize:11, fontWeight:700, background:GL, color:G, border:`1px solid ${GB}`, padding:"2px 10px", borderRadius:20 }}>
            {doneCount}/{totalCount} erledigt
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, background:"#F3F4F6", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:G, borderRadius:99, transition:"width .5s ease" }} />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:10 }}>
        {items.map(item => (
          <a key={item.id} href={item.href} style={{ textDecoration:"none" }}>
            <div style={{
              display:"flex", alignItems:"flex-start", gap:12,
              padding:"12px 14px", borderRadius:14,
              background: item.done ? GL : "#F9FAFB",
              border: `1px solid ${item.done ? GB : "#E5E7EB"}`,
              transition:"all .15s",
              cursor: item.done ? "default" : "pointer",
            }}>
              <div style={{
                width:24, height:24, borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                background: item.done ? G : "#E5E7EB",
                fontSize:12, fontWeight:900, color: item.done ? "#fff" : "#9CA3AF",
              }}>
                {item.done ? "✓" : ""}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color: item.done ? G : "#111827", marginBottom:2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.5 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
