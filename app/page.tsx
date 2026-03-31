"use client"

import { useState, useEffect } from "react"

export default function LandingPage() {

  // ⭐ REVIEW STATE
  const [reviewIndex, setReviewIndex] = useState(0)

  const reviews = [
    {
      text: "Seit wir TerminStop nutzen, sind unsere Ausfälle massiv gesunken. Einfach ein No-Brainer.",
      name: "Autohaus Müller GmbH",
      role: "Autohaus",
      stars: 5
    },
    {
      text: "Super einfach, keine Einarbeitung nötig. Läuft einfach im Hintergrund.",
      name: "Friseurstudio Elegance",
      role: "Friseur & Beauty",
      stars: 4
    },
    {
      text: "Wir sparen täglich Zeit und unsere Termine werden endlich eingehalten.",
      name: "Physiotherapie Berger",
      role: "Gesundheit & Therapie",
      stars: 5
    },
    {
      text: "Hat unseren kompletten Ablauf verbessert. Weniger Stress, mehr Umsatz.",
      name: "KFZ-Service Schneider",
      role: "Werkstatt",
      stars: 4.5
    },
    {
      text: "Genau das, was wir gebraucht haben. Simpel, aber extrem effektiv.",
      name: "Studio BeautyLine",
      role: "Kosmetikstudio",
      stars: 5
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const renderStars = (stars: number) => {
    if (stars === 5) return "★★★★★"
    if (stars === 4.5) return "★★★★½"
    return "★★★★☆"
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1F2A37]" style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-5 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">Features</a>
          <a href="#vergleich" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">Vergleich</a>
          <a href="/login" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition">Login</a>
          <a href="/lead" className="bg-[#18A66D] text-white text-sm px-5 py-2 rounded-xl hover:bg-[#15956200] hover:bg-[#0F8F63] transition font-medium">
            Kostenlos starten
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="max-w-5xl mx-auto px-8 md:px-10 pt-28 pb-20 text-center">

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-4 py-2 rounded-full mb-8">
          <span>✓</span>
          <span>500+ Unternehmen vertrauen TerminStop</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-[#1F2A37]">
          Termine, die{" "}
          <span className="text-[#18A66D]">eingehalten</span>{" "}
          werden.
        </h1>

        <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
          Automatische SMS-Erinnerungen sorgen dafür, dass Ihre Kunden erscheinen –
          und Ihr Alltag planbar bleibt.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="/lead"
            className="bg-[#18A66D] text-white px-10 py-4 rounded-xl hover:bg-[#0F8F63] transition font-semibold shadow-lg shadow-[#18A66D]/20 text-base"
          >
            Kostenlose Beratung sichern →
          </a>
          <a
            href="#demo"
            className="text-[#6B7280] text-sm hover:text-[#1F2A37] transition underline underline-offset-4"
          >
            Demo ansehen
          </a>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Unternehmen" },
            { value: "95%", label: "Weniger Ausfälle" },
            { value: "24/7", label: "Automatisch" },
            { value: "4.9 ★", label: "Kundenbewertung" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl px-4 py-4 shadow-sm">
              <div className="text-xl font-bold text-[#18A66D]">{kpi.value}</div>
              <div className="text-xs text-[#6B7280] mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IMAGE + TEXT (Weniger Chaos) ─── */}
      <section className="max-w-7xl mx-auto px-8 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            Das Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Weniger Chaos<br />im Alltag
          </h2>
          <p className="text-[#6B7280] text-lg mb-5 leading-relaxed">
            Terminausfälle bringen Ihren gesamten Tag durcheinander – und kosten bares Geld.
          </p>
          <p className="text-[#6B7280] leading-relaxed">
            TerminStop erinnert Ihre Kunden automatisch per SMS –
            bevor der Termin stattfindet. Keine manuelle Arbeit. Kein Stress.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {["Bis zu 80% weniger Terminausfälle", "Monatliche Einsparung €200–500", "Einrichtung in unter 5 Minuten"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#E8FBF3] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#18A66D] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#1F2A37]">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            className="rounded-2xl shadow-xl w-full object-cover"
            alt="Team bei der Arbeit"
          />
        </div>
      </section>

      {/* ─── PHONE + TEXT (SMS Preview) ─── */}
      <section id="demo" className="max-w-7xl mx-auto px-8 md:px-10 py-28 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        {/* Phone Mock */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#18A66D]/10 rounded-[50px] blur-3xl scale-110" />
            <div className="relative bg-[#1F2A37] p-3 rounded-[44px] shadow-2xl">
              <div className="bg-[#f2f2f7] w-[280px] h-[560px] rounded-[36px] overflow-hidden relative">

                {/* Status bar */}
                <div className="bg-[#f2f2f7] px-6 pt-4 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-black/50 font-medium">9:41</span>
                  <span className="text-[10px] text-black/50">●●●</span>
                </div>

                {/* Chat header */}
                <div className="bg-white border-b border-black/5 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8FBF3] rounded-full flex items-center justify-center">
                    <span className="text-[#18A66D] text-xs font-bold">T</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">TerminStop</div>
                    <div className="text-[9px] text-black/40">SMS-Erinnerung</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="px-4 py-5 space-y-3">
                  <div className="bg-[#18A66D] text-white text-[11px] leading-relaxed rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                    Hallo Herr Mustermann, 👋<br /><br />
                    wir erinnern Sie an Ihren Termin morgen um <strong>10:00 Uhr</strong>.<br /><br />
                    Wir freuen uns auf Sie!<br />
                    <span className="opacity-75">– Team der Mustermann GmbH</span>
                  </div>
                  <div className="text-[9px] text-black/30 pl-1">Gesendet: 24h vor dem Termin ✓✓</div>

                  <div className="bg-white border border-black/10 text-black text-[11px] leading-relaxed rounded-2xl rounded-tr-sm p-3 max-w-[85%] ml-auto">
                    Danke für die Erinnerung! Ich komme pünktlich. 🙏
                  </div>
                </div>

                {/* Success badge */}
                <div className="absolute bottom-6 left-4 right-4">
                  <div className="bg-[#E8FBF3] border border-[#18A66D]/20 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-[#18A66D] text-base">✓</span>
                    <div>
                      <div className="text-[10px] font-semibold text-[#18A66D]">Termin bestätigt</div>
                      <div className="text-[9px] text-[#18A66D]/70">95% Erfolgsquote</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            So sieht es aus
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Individuell angepasst –<br />professionell & persönlich
          </h2>
          <p className="text-[#6B7280] text-lg mb-5 leading-relaxed">
            Jede Nachricht wird an Ihr Unternehmen angepasst –
            mit Ihrem Namen, Ihrer Uhrzeit, Ihrem Ton.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            So fühlen sich Ihre Kunden angesprochen und erscheinen zuverlässiger.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "⏰", title: "24h vorher", desc: "Automatische Erinnerung" },
              { icon: "✅", title: "Bestätigung", desc: "Kunde wird informiert" },
              { icon: "🎯", title: "Persönlich", desc: "Individueller Ton" },
              { icon: "📊", title: "99.9% Uptime", desc: "Immer zuverlässig" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-3 items-start shadow-sm">
                <div className="w-8 h-8 bg-[#E8FBF3] rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1F2A37]">{item.title}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES (3-spaltig) ─── */}
      <section id="features" className="bg-white border-y border-[#E5E7EB] py-24">
        <div className="max-w-6xl mx-auto px-8 md:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Warum TerminStop?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
              Alles was Sie brauchen
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📅",
                title: "Planbarkeit",
                desc: "Strukturierte Tage ohne Lücken. Wissen Sie immer, wer wirklich kommt.",
                highlight: "Bis zu 80% weniger Ausfälle"
              },
              {
                icon: "⏱",
                title: "Zeit sparen",
                desc: "Kein Nachtelefonieren mehr. Das System läuft automatisch – 24/7.",
                highlight: "Ø 2h gespart pro Woche"
              },
              {
                icon: "💰",
                title: "Mehr Umsatz",
                desc: "Jeder erschienene Termin ist Umsatz. Weniger Ausfälle = mehr Einnahmen.",
                highlight: "+€200–500 pro Monat"
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-2xl p-8 hover:shadow-md transition">
                <div className="w-12 h-12 bg-[#E8FBF3] rounded-xl flex items-center justify-center text-2xl mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1F2A37] mb-3">{f.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-[#18A66D] text-xs font-semibold bg-[#E8FBF3] px-3 py-1.5 rounded-full">
                  <span>✓</span> {f.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Stepper) ─── */}
      <section className="max-w-5xl mx-auto px-8 md:px-10 py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
          So einfach geht's
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-16">
          In 4 Schritten zu mehr Planbarkeit
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {[
            { step: "1", icon: "📋", title: "Termin eintragen", desc: "Kunde bucht Termin in Ihrem System" },
            { step: "2", icon: "🤖", title: "System erkennt", desc: "Automatische Zeitplanung im Hintergrund" },
            { step: "3", icon: "📱", title: "SMS versenden", desc: "Kunde erhält persönliche Erinnerung" },
            { step: "4", icon: "🎉", title: "Termin wahrgenommen", desc: "Kunde erscheint pünktlich" },
          ].map((s, i) => (
            <div key={i} className="relative flex flex-col items-center">
              {i < 3 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-0.5 bg-[#E5E7EB] w-full" />
              )}
              <div className="w-12 h-12 bg-[#18A66D] text-white rounded-full flex items-center justify-center text-base font-bold mb-4 relative z-10 shadow-md shadow-[#18A66D]/30">
                {s.step}
              </div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-sm font-semibold text-[#1F2A37] mb-1">{s.title}</div>
              <div className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#1F2A37] text-white rounded-2xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#18A66D] rounded-full animate-pulse" />
            <span className="text-sm">System läuft automatisch im Hintergrund</span>
          </div>
          <span className="text-[#18A66D] text-sm font-semibold">24/7 verfügbar ✓</span>
        </div>
      </section>

      {/* ─── TEAM / TRUST ─── */}
      <section className="max-w-7xl mx-auto px-8 md:px-10 py-28 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="rounded-2xl shadow-xl w-full object-cover"
            alt="Persönlicher Support"
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            Persönlicher Support
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Kein anonymer Support –<br />echte Menschen
          </h2>
          <p className="text-[#6B7280] text-lg mb-5 leading-relaxed">
            Wir begleiten Sie bei der Einrichtung und stehen Ihnen jederzeit zur Seite.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            Kein Ticket-System ohne Antwort – sondern echte Unterstützung, wenn Sie sie brauchen.
          </p>
          <div className="flex gap-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#18A66D]">500+</div>
              <div className="text-xs text-[#6B7280] mt-1">Betriebe</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#18A66D]">98%</div>
              <div className="text-xs text-[#6B7280] mt-1">Zufriedenheit</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#18A66D]">4.9★</div>
              <div className="text-xs text-[#6B7280] mt-1">Bewertung</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section id="vergleich" className="max-w-5xl mx-auto px-8 md:px-10 py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
            Der Unterschied im Alltag
          </h2>
          <p className="text-[#6B7280] mt-3">Schwarz auf weiß – was TerminStop verändert.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="grid grid-cols-3 text-sm">
            <div className="p-5 font-semibold text-[#6B7280] bg-[#F7FAFC] border-b border-[#E5E7EB]">Funktion</div>
            <div className="p-5 text-[#6B7280] bg-[#F7FAFC] border-b border-[#E5E7EB]">Ohne TerminStop</div>
            <div className="p-5 bg-[#18A66D] text-white font-semibold border-b border-[#18A66D]">
              <span className="text-[#18A66D] bg-white rounded-md px-2 py-0.5 text-xs mr-2">✓</span>
              Mit TerminStop
            </div>

            {[
              ["Erinnerungen", "❌ Keine", "✓ Automatisch per SMS"],
              ["Terminausfälle", "❌ Bis zu 30%", "✓ Unter 5%"],
              ["Zeitaufwand", "❌ Manuell nachtelefonieren", "✓ Null – läuft von selbst"],
              ["Automatisierung", "❌ Nicht vorhanden", "✓ 24/7 im Hintergrund"],
              ["Planbarkeit", "⚠️ Unsicher", "✓ Vollständige Kontrolle"],
            ].map((row, i) => (
              <div key={i} className="contents">
                <div className="p-5 border-t border-[#E5E7EB] text-[#1F2A37] font-medium bg-white">{row[0]}</div>
                <div className="p-5 border-t border-[#E5E7EB] text-[#9CA3AF] bg-white">{row[1]}</div>
                <div className="p-5 border-t border-[#E5E7EB] text-[#18A66D] font-medium bg-[#F0FDF6]">{row[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-28">
        <div className="max-w-6xl mx-auto px-8 md:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              ★★★★★ 4.9 / 5 Bewertung
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37]">
              Vertrauen von Unternehmen
            </h2>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${reviewIndex * 33.333}%)` }}
            >
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="min-w-[33.333%] bg-[#F7FAFC] border border-[#E5E7EB] rounded-2xl p-7 shadow-sm flex-shrink-0"
                >
                  <div className="text-[#F59E0B] text-sm mb-3">{renderStars(r.stars)}</div>
                  <p className="text-[#1F2A37] text-sm mb-6 leading-relaxed italic">
                    „{r.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#18A66D] text-white flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1F2A37]">{r.name}</div>
                      <div className="text-xs text-[#6B7280]">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === reviewIndex ? "bg-[#18A66D] w-6" : "bg-[#E5E7EB]"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEXT BLOCK ─── */}
      <div className="max-w-3xl mx-auto text-center px-6 py-20">
        <p className="text-[#6B7280] text-xl leading-relaxed">
          TerminStop ist kein kompliziertes System –
          sondern eine <span className="text-[#18A66D] font-semibold">einfache Lösung</span> für ein echtes Problem.
        </p>
      </div>

      {/* ─── FINAL CTA ─── */}
      <section className="mx-4 mb-16 bg-gradient-to-r from-[#0F8F63] to-[#1FB07A] rounded-3xl px-8 py-20 text-center text-white shadow-xl shadow-[#18A66D]/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Machen Sie Ihre Termine endlich planbar.
          </h2>
          <p className="text-white/80 text-lg mb-4">
            Weniger Ausfälle, weniger Stress – und volle Kontrolle über Ihren Tag.
          </p>
          <p className="text-white/60 text-sm mb-10">
            Unverbindlich. Schnell eingerichtet. Sofort einsatzbereit.
          </p>
          <a
            href="/lead"
            className="inline-block bg-white text-[#18A66D] font-bold px-12 py-4 rounded-xl hover:scale-105 transition shadow-lg text-base"
          >
            Jetzt kostenlose Beratung sichern →
          </a>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            <span>✓ 14 Tage kostenlos testen</span>
            <span>✓ Keine Kreditkarte nötig</span>
            <span>✓ Sofort einsatzbereit</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#E5E7EB] bg-white py-12 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-base font-bold">
              <span className="text-[#18A66D]">Termin</span>
              <span className="text-[#1F2A37]">Stop</span>
            </span>
            <p className="text-xs text-[#6B7280] mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
          </div>
          <div className="flex gap-6 text-xs text-[#6B7280]">
            <a href="/impressum" className="hover:text-[#1F2A37] transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-[#1F2A37] transition">Datenschutz</a>
            <a href="/agb" className="hover:text-[#1F2A37] transition">AGB</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
