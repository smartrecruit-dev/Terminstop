"use client"

import { useState, useEffect } from "react"

export default function LandingPage() {

  // ⭐ REVIEW STATE
  const [reviewIndex, setReviewIndex] = useState(0)

  const reviews = [
    {
      text: "Seit wir TerminStop nutzen, sind unsere Ausfälle massiv gesunken. Einfach ein No-Brainer.",
      name: "Autohaus Müller GmbH",
      stars: 5
    },
    {
      text: "Super einfach, keine Einarbeitung nötig. Läuft einfach im Hintergrund.",
      name: "Friseurstudio Elegance",
      stars: 4
    },
    {
      text: "Wir sparen täglich Zeit und unsere Termine werden endlich eingehalten.",
      name: "Physiotherapie Berger",
      stars: 5
    },
    {
      text: "Hat unseren kompletten Ablauf verbessert. Weniger Stress, mehr Umsatz.",
      name: "KFZ-Service Schneider",
      stars: 4.5
    },
    {
      text: "Genau das, was wir gebraucht haben. Simpel, aber extrem effektiv.",
      name: "Studio BeautyLine",
      stars: 5
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const renderStars = (stars:number) => {
    if (stars === 5) return "★★★★★"
    if (stars === 4.5) return "★★★★☆"
    if (stars === 4) return "★★★★☆"
    return "★★★★☆"
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-black">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-16 py-6 border-b border-black/5">
        <div className="text-sm font-medium text-black/60">TerminStop</div>
        <a href="/login" className="text-sm text-black/50 hover:text-black">
          Login
        </a>
      </div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-10 py-36 text-center">
        <h1 className="text-6xl font-semibold mb-8 leading-tight">
          Termine, die eingehalten werden.
        </h1>

        <p className="text-xl text-black/60 mb-10">
          Automatische Erinnerungen sorgen dafür, dass Ihre Kunden erscheinen –
          und Ihr Alltag planbar bleibt.
        </p>

        <a href="/lead" className="bg-black text-white px-10 py-4 rounded-xl hover:scale-105 transition">
          Kostenlose Beratung sichern
        </a>
      </div>

      {/* IMAGE + TEXT */}
      <div className="max-w-7xl mx-auto px-10 py-24 grid grid-cols-2 gap-20 items-center">

        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Weniger Chaos im Alltag
          </h2>

          <p className="text-black/60 text-lg mb-6">
            Terminausfälle bringen Ihren gesamten Tag durcheinander.
          </p>

          <p className="text-black/50">
            TerminStop erinnert Ihre Kunden automatisch –
            bevor der Termin stattfindet.
          </p>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

      </div>

      {/* PHONE + TEXT */}
      <div className="max-w-7xl mx-auto px-10 py-28 grid grid-cols-2 gap-20 items-center">

        <div className="flex justify-center">
          <div className="bg-black p-3 rounded-[40px] shadow-2xl">
            <div className="bg-[#f2f2f7] w-[300px] h-[600px] rounded-[32px] relative overflow-hidden">

              <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-xl shadow p-3">

                <div className="text-[10px] text-black/40 mb-1">
                  TerminStop
                </div>

                <div className="text-xs leading-snug">
                  Sehr geehrter Herr Mustermann,<br />
                  wir erinnern Sie an Ihren Termin morgen um 10:00 Uhr.<br /><br />
                  Wir freuen uns auf Sie.<br />
                  Ihr Team der Mustermann GmbH
                </div>

              </div>

            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Individuell angepasst
          </h2>

          <p className="text-black/60 text-lg mb-6">
            Jede Nachricht wird an Ihr Unternehmen angepasst –
            professionell und persönlich.
          </p>

          <p className="text-black/50">
            So fühlen sich Ihre Kunden angesprochen und erscheinen zuverlässiger.
          </p>
        </div>

      </div>

      {/* BENEFITS */}
      <div className="max-w-6xl mx-auto px-10 py-24 grid grid-cols-3 gap-12 text-center">

        <div>
          <div className="text-lg font-medium mb-2">📅 Planbarkeit</div>
          <div className="text-black/50 text-sm">
            Strukturierte Tage ohne Lücken
          </div>
        </div>

        <div>
          <div className="text-lg font-medium mb-2">⏱ Zeit sparen</div>
          <div className="text-black/50 text-sm">
            Kein Nachtelefonieren mehr
          </div>
        </div>

        <div>
          <div className="text-lg font-medium mb-2">💰 Mehr Umsatz</div>
          <div className="text-black/50 text-sm">
            Weniger Ausfälle
          </div>
        </div>

      </div>

      {/* 🤝 TEAM / TRUST */}
      <div className="max-w-7xl mx-auto px-10 py-28 grid grid-cols-2 gap-20 items-center">

        <div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Persönlicher Support
          </h2>

          <p className="text-black/60 text-lg mb-6">
            Wir begleiten Sie bei der Einrichtung und stehen Ihnen jederzeit zur Seite.
          </p>

          <p className="text-black/50">
            Kein anonymer Support – sondern echte Unterstützung,
            wenn Sie sie brauchen.
          </p>
        </div>

      </div>

      {/* 📊 COMPARISON TABLE */}
      <div className="max-w-5xl mx-auto px-10 py-28">

        <h2 className="text-3xl font-semibold text-center mb-16">
          Der Unterschied im Alltag
        </h2>

        <div className="overflow-hidden rounded-2xl border border-black/10">

          <div className="grid grid-cols-3 text-sm">

            <div className="p-6 font-medium text-black/50">Funktion</div>
            <div className="p-6 text-black/50">Ohne TerminStop</div>
            <div className="p-6 bg-black text-white">TerminStop</div>

            {[
              ["Erinnerungen", "❌", "✔"],
              ["Weniger Ausfälle", "❌", "✔"],
              ["Zeitersparnis", "❌", "✔"],
              ["Automatisierung", "❌", "✔"],
              ["Planbarkeit", "⚠️", "✔"]
            ].map((row, i) => (
              <div key={i} className="contents">
                <div className="p-6 border-t border-black/5">{row[0]}</div>
                <div className="p-6 border-t border-black/5 text-black/40">{row[1]}</div>
                <div className="p-6 border-t border-black/5 bg-black/5 font-medium">{row[2]}</div>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* ⭐ REVIEWS */}
      <div className="max-w-6xl mx-auto px-10 py-28">

        <h2 className="text-3xl font-semibold text-center mb-16">
          Vertrauen von Unternehmen
        </h2>

        <div className="overflow-hidden">

          <div
            className="flex gap-6 transition-transform duration-700"
            style={{
              transform: `translateX(-${reviewIndex * 33.333}%)`
            }}
          >

            {reviews.map((r, i) => (
              <div
                key={i}
                className="min-w-[33.333%] bg-white border border-black/10 rounded-2xl p-6 shadow-sm"
              >

                <div className="text-yellow-500 text-sm mb-3">
                  {renderStars(r.stars)}
                </div>

                <p className="text-black/70 text-sm mb-6">
                  "{r.text}"
                </p>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full text-xs">
                    {r.name.charAt(0)}
                  </div>

                  <div className="text-xs text-black/60">
                    {r.name}
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* TEXT BLOCK */}
      <div className="max-w-3xl mx-auto text-center px-6 pb-24">

        <p className="text-black/60 text-lg leading-relaxed">
          TerminStop ist kein kompliziertes System –
          sondern eine einfache Lösung für ein echtes Problem.
        </p>

      </div>

      {/* 🔥 FINAL CTA UPGRADE */}
      <div className="text-center py-32 px-6">

        <h2 className="text-4xl font-semibold mb-6">
          Machen Sie Ihre Termine endlich planbar.
        </h2>

        <p className="text-black/60 text-lg mb-6 max-w-xl mx-auto">
          Weniger Ausfälle, weniger Stress – und volle Kontrolle über Ihren Tag.
        </p>

        <p className="text-black/40 text-sm mb-10">
          Unverbindlich. Schnell eingerichtet. Sofort einsatzbereit.
        </p>

        <a href="/lead" className="bg-black text-white px-12 py-4 rounded-xl hover:scale-105 transition shadow-lg">
          Jetzt kostenlose Beratung sichern
        </a>

      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-black/40 py-12 space-y-3">
        <div>TerminStop – Weniger Ausfälle. Mehr Umsatz.</div>

        <div className="flex justify-center gap-6">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
        </div>
      </div>

    </div>
  )
}