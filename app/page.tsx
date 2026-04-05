"use client"

import { useState } from "react"

export default function LandingPage() {

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reviews = [
    {
      text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Ich hätte nicht gedacht, dass es so schnell wirkt.",
      name: "Thomas M.",
      role: "Autohaus",
      city: "München",
      result: "−58% Ausfälle",
      stars: 5
    },
    {
      text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.",
      name: "Sandra K.",
      role: "Friseurstudio",
      city: "Hamburg",
      result: "−3h Zeitaufwand/Woche",
      stars: 5
    },
    {
      text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.",
      name: "Dr. Andreas B.",
      role: "Physiotherapiepraxis",
      city: "Berlin",
      result: "Keine kurzfristigen Absagen mehr",
      stars: 5
    },
    {
      text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.",
      name: "Markus S.",
      role: "KFZ-Werkstatt",
      city: "Stuttgart",
      result: "+18% Auslastung",
      stars: 5
    },
  ]

  const faqs = [
    {
      q: "Muss ich eine App installieren oder etwas technisch einrichten?",
      a: "Nein. TerminStop läuft komplett im Browser – keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich."
    },
    {
      q: "Was kostet TerminStop monatlich?",
      a: "Unsere Pakete starten ab €39 pro Monat. Der Preis richtet sich nach Ihrem Terminvolumen – je mehr Termine, desto mehr SMS-Erinnerungen. Im Beratungsgespräch finden wir gemeinsam das passende Paket für Sie."
    },
    {
      q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?",
      a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe – keine Vorkenntnisse nötig. Und wenn mal etwas nicht klappt, sind wir persönlich erreichbar."
    },
    {
      q: "Was passiert, wenn ein Kunde nicht auf die SMS antwortet?",
      a: "Das System erinnert trotzdem – und Sie sehen in der Übersicht, wer bestätigt hat und wer nicht. So können Sie gezielt reagieren, bevor es zu einem Ausfall kommt."
    },
    {
      q: "Wie lange dauert es, bis ich erste Ergebnisse sehe?",
      a: "Die meisten Kunden berichten bereits nach der ersten Woche von weniger Ausfällen. Die Erinnerungen wirken sofort – weil Ihre Kunden sie sofort erhalten."
    },
    {
      q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?",
      a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Sie können jederzeit aufhören, wenn Sie nicht zufrieden sind. Wir sind aber überzeugt, dass Sie es nicht tun werden."
    },
  ]

  const plans = [
    {
      name: "Starter",
      price: 39,
      sms: "bis 100",
      desc: "Perfekt für den Einstieg",
      highlight: false,
      features: [
        "bis 100 SMS-Erinnerungen/Monat",
        "Terminübersicht & Dashboard",
        "Kundenkartei",
        "Persönliches Onboarding",
        "E-Mail-Support",
      ]
    },
    {
      name: "Pro",
      price: 109,
      sms: "bis 300",
      desc: "Für wachsende Betriebe",
      highlight: true,
      features: [
        "bis 300 SMS-Erinnerungen/Monat",
        "Terminübersicht & Dashboard",
        "Kundenkartei",
        "Persönliches Onboarding",
        "Prioritäts-Support",
        "Kalenderansicht",
        "Auswertungen & Einblicke",
      ]
    },
    {
      name: "Business",
      price: 229,
      sms: "unbegrenzt",
      desc: "Für große Betriebe",
      highlight: false,
      features: [
        "Unbegrenzte SMS-Erinnerungen",
        "Terminübersicht & Dashboard",
        "Kundenkartei",
        "Persönliches Onboarding",
        "Persönlicher Ansprechpartner",
        "Kalenderansicht",
        "Auswertungen & Einblicke",
        "Individuelle Einrichtung",
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1F2A37]" style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-[#18A66D]">Termin</span>
          <span className="text-[#1F2A37]">Stop</span>
        </span>
        <div className="flex items-center gap-5">
          <a href="#wie-es-funktioniert" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">So funktioniert's</a>
          <a href="#preise" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">Preise</a>
          <a href="/login" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">Login</a>
          <a href="/lead" className="bg-[#18A66D] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#0F8F63] transition font-semibold shadow-sm">
            Jetzt anfragen
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#18A66D]/8 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#18A66D]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-24 pb-24 text-center">

          {/* Industry tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Friseur", "Handwerk", "KFZ-Betrieb", "Arztpraxis", "Kosmetik", "Physiotherapie"].map((b, i) => (
              <span key={i} className="text-xs text-[#6B7280] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-sm">
                {b}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-[64px] font-black mb-6 leading-[1.05] tracking-tight text-[#1F2A37]">
            Ihre Kunden kommen.<br />
            <span className="text-[#18A66D]">Garantiert.</span>
          </h1>

          <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
            TerminStop erinnert Ihre Kunden automatisch per SMS –
            damit kein Termin mehr vergessen wird und Ihr Alltag planbar bleibt.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="/lead"
              className="bg-[#18A66D] text-white px-10 py-4 rounded-xl hover:bg-[#0F8F63] transition font-bold shadow-lg shadow-[#18A66D]/30 text-base"
            >
              Kostenlose Beratung sichern →
            </a>
            <span className="text-[#9CA3AF] text-sm">Kein Vertrag · Keine versteckten Kosten</span>
          </div>

          {/* Floating stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { value: "50+", label: "Betriebe aktiv" },
              { value: "95%", label: "Weniger Ausfälle" },
              { value: "4.9 ★", label: "Kundenbewertung" },
              { value: "8 Min.", label: "Einrichtung" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl px-4 py-4 shadow-sm text-center">
                <div className="text-[#18A66D] font-black text-xl leading-none mb-1">{stat.value}</div>
                <div className="text-xs text-[#9CA3AF]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="bg-[#1F2A37] py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
              Das kostet Sie Geld – jeden Tag
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Was Terminausfälle wirklich bedeuten
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Kein theoretisches Problem – sondern täglich bares Geld.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: "💸", value: "€50", label: "Verlust pro Ausfall", desc: "Jeder nicht erschienene Kunde kostet Umsatz – und Ihre wertvolle Zeit." },
              { icon: "📉", value: "4–9×", label: "Ausfälle pro Woche", desc: "Im Schnitt verpasst jeder Betrieb mehrmals wöchentlich Einnahmen." },
              { icon: "🗓", value: "bis €2.000", label: "Verlust pro Monat", desc: "Echte Einnahmen, die nicht stattfinden – obwohl der Slot gebucht war." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center hover:bg-white/8 transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{item.value}</div>
                <div className="text-sm font-semibold text-white/60 mb-3">{item.label}</div>
                <div className="text-xs text-white/35 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#18A66D]/15 border border-[#18A66D]/30 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold mb-1">Die Lösung ist einfacher als Sie denken.</div>
              <div className="text-white/50 text-sm">Ein automatisches System, das Ihre Kunden erinnert – bevor es zu einem Ausfall kommt.</div>
            </div>
            <a href="/lead" className="bg-[#18A66D] text-white text-sm px-7 py-3 rounded-xl hover:bg-[#0F8F63] transition font-semibold whitespace-nowrap shrink-0 shadow-lg">
              Jetzt lösen →
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="wie-es-funktioniert" className="max-w-5xl mx-auto px-6 md:px-10 py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-[#18A66D]/20">
            So einfach geht's
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
            Drei Schritte. Fertig.
          </h2>
          <p className="text-[#6B7280] max-w-md mx-auto">
            Kein IT-Studium. Kein Aufwand. Einmal einrichten – für immer laufen lassen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] h-px bg-gradient-to-r from-transparent via-[#18A66D]/30 to-transparent" />

          {[
            {
              step: "01",
              icon: "⚙️",
              title: "Einmalig einrichten",
              desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Dauert unter 10 Minuten. Keine Technik-Kenntnisse nötig.",
              note: "Persönlicher Onboarding-Support inklusive"
            },
            {
              step: "02",
              icon: "📱",
              title: "Kunden werden erinnert",
              desc: "24 Stunden vor jedem Termin erhalten Ihre Kunden eine persönliche SMS – mit Ihrem Namen und dem genauen Termin.",
              note: "Automatisch, individuell, ohne Ihr Zutun"
            },
            {
              step: "03",
              icon: "✅",
              title: "Termine werden gehalten",
              desc: "Kunden erscheinen pünktlich. Sie haben volle Übersicht. Ihr Alltag wird planbar – ohne Mehraufwand.",
              note: "95% Erfolgsquote in der Praxis"
            },
          ].map((s, i) => (
            <div key={i} className="relative bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute top-5 right-6 text-[#F3F4F6] text-5xl font-black select-none leading-none">{s.step}</div>
              <div className="w-12 h-12 bg-[#E8FBF3] rounded-xl flex items-center justify-center text-2xl mb-6 relative z-10">
                {s.icon}
              </div>
              <h3 className="text-base font-bold text-[#1F2A37] mb-2">{s.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="flex items-center gap-2 text-xs text-[#18A66D] font-semibold">
                <span className="w-4 h-4 bg-[#E8FBF3] rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PHONE MOCK + FEATURES ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Phone */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#18A66D]/12 rounded-[50px] blur-3xl scale-110" />
              <div className="relative bg-[#1F2A37] p-3 rounded-[44px] shadow-2xl">
                <div className="bg-[#f2f2f7] w-[280px] h-[560px] rounded-[36px] overflow-hidden relative">
                  <div className="bg-[#f2f2f7] px-6 pt-4 pb-2 flex justify-between items-center">
                    <span className="text-[10px] text-black/50 font-medium">9:41</span>
                    <span className="text-[10px] text-black/50 font-medium">●●●</span>
                  </div>
                  <div className="bg-white border-b border-black/5 px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E8FBF3] rounded-full flex items-center justify-center">
                      <span className="text-[#18A66D] text-xs font-bold">T</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-black">TerminStop</div>
                      <div className="text-[9px] text-black/40">SMS · Jetzt</div>
                    </div>
                    <div className="ml-auto w-2 h-2 bg-[#18A66D] rounded-full" />
                  </div>
                  <div className="px-4 py-5 space-y-3">
                    <div className="bg-[#18A66D] text-white text-[11px] leading-relaxed rounded-2xl rounded-tl-sm p-3.5 max-w-[88%] shadow-sm">
                      Hallo Frau Schmidt, 👋<br /><br />
                      wir erinnern Sie an Ihren Termin<br />
                      <strong>morgen, Dienstag um 14:00 Uhr</strong>.<br /><br />
                      Wir freuen uns auf Sie!<br />
                      <span className="opacity-70 text-[10px]">– Friseurstudio Elegance</span>
                    </div>
                    <div className="text-[9px] text-black/30 pl-1">✓✓ Zugestellt · 24h vor Termin</div>
                    <div className="bg-white border border-black/10 text-black/80 text-[11px] leading-relaxed rounded-2xl rounded-tr-sm p-3 max-w-[80%] ml-auto shadow-sm">
                      Danke! Ich bin pünktlich da 🙂
                    </div>
                    <div className="text-[9px] text-black/30 text-right pr-1">Gelesen · 09:43</div>
                  </div>
                  <div className="absolute bottom-5 left-4 right-4">
                    <div className="bg-[#E8FBF3] border border-[#18A66D]/20 rounded-xl p-3 flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#18A66D] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#18A66D]">Termin bestätigt</div>
                        <div className="text-[9px] text-[#18A66D]/70">Kunde erscheint pünktlich</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#18A66D]/20">
              So sieht Ihre Erinnerung aus
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Persönlich.<br />Automatisch.<br />Wirksam.
            </h2>
            <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
              Jede SMS trägt Ihren Unternehmensnamen, den genauen Termin und den richtigen Ton.
              Einmal eingerichtet – läuft für immer.
            </p>
            <div className="space-y-3">
              {[
                { icon: "🏷", title: "Ihr Name, Ihr Stil", desc: "Jede Nachricht wirkt wie von Ihnen persönlich geschrieben." },
                { icon: "⏰", title: "Immer zum richtigen Zeitpunkt", desc: "24 Stunden vor dem Termin – automatisch, ohne Ihr Zutun." },
                { icon: "📊", title: "Volle Übersicht", desc: "Sie sehen jederzeit, wer bestätigt hat und wer nicht." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl p-4 hover:border-[#18A66D]/30 transition">
                  <div className="w-9 h-9 bg-[#E8FBF3] rounded-lg flex items-center justify-center text-base shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#1F2A37]">{item.title}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full mb-4 border border-[#18A66D]/20">
            Echte Ergebnisse
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
            Was Betriebe berichten
          </h2>
          <p className="text-[#6B7280]">Keine Hochglanzversprechen – nur echte Erfahrungen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm flex flex-col hover:shadow-md hover:border-[#18A66D]/20 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 bg-[#E8FBF3] text-[#18A66D] text-xs font-bold px-3 py-1.5 rounded-full">
                  ✓ {r.result}
                </div>
                <div className="text-[#F59E0B] text-sm">{"★".repeat(r.stars)}</div>
              </div>
              <p className="text-[#1F2A37] text-sm leading-relaxed flex-1 mb-5 italic">
                „{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F3F4F6]">
                <div className="w-9 h-9 bg-gradient-to-br from-[#18A66D] to-[#0F8F63] text-white flex items-center justify-center rounded-full text-sm font-bold shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1F2A37]">{r.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{r.role} · {r.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="bg-[#F7FAFC] border-y border-[#E5E7EB] py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
              Mit oder ohne TerminStop
            </h2>
            <p className="text-[#6B7280]">Der Unterschied ist schwarz auf weiß.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-[#FECACA] bg-white rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#FEE2E2] rounded-full flex items-center justify-center text-sm text-[#EF4444]">✗</div>
                <h3 className="font-bold text-[#1F2A37]">Ohne TerminStop</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Kunden vergessen Termine – und erscheinen nicht",
                  "Sie telefonieren hinterher oder verlieren den Slot",
                  "Unberechenbare Tage, lückenhafte Kalender",
                  "Keine Möglichkeit, vorher zu reagieren",
                  "Bis zu €2.000 Verlust pro Monat",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#EF4444] text-sm mt-0.5 shrink-0">✗</span>
                    <span className="text-sm text-[#6B7280]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-[#18A66D] bg-[#F0FDF6] rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#D1FAE5] rounded-full flex items-center justify-center text-sm text-[#18A66D]">✓</div>
                <h3 className="font-bold text-[#1F2A37]">Mit TerminStop</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Kunden werden automatisch erinnert – und erscheinen",
                  "Kein manueller Aufwand, kein Nachtelefonieren",
                  "Planbare Tage, volle Auslastung",
                  "Rechtzeitig reagieren, bevor Ausfälle entstehen",
                  "Monatliche Einsparung durch Automatisierung",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#18A66D] text-sm mt-0.5 shrink-0">✓</span>
                    <span className="text-sm text-[#1F2A37] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="preise" className="max-w-6xl mx-auto px-6 md:px-10 py-28">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-[#18A66D]/20">
            Transparent & fair
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
            Einfache Preise. Klarer Nutzen.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto">
            Kein Abo-Chaos, keine versteckten Kosten. Wählen Sie das Paket, das zu Ihrem Betrieb passt –
            und kündigen Sie jederzeit.
          </p>
        </div>

        {/* ROI callout */}
        <div className="bg-[#1F2A37] rounded-2xl px-8 py-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div>
            <div className="text-white font-semibold text-sm mb-1">💡 Zur Einordnung</div>
            <div className="text-white/60 text-sm leading-relaxed">
              Schon <strong className="text-white">2 verhinderte Ausfälle pro Monat</strong> decken den Starter-Preis vollständig. Der Rest ist reiner Gewinn.
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#18A66D] font-black text-2xl">ab €39</div>
            <div className="text-white/40 text-xs">pro Monat</div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-200 ${
                plan.highlight
                  ? "bg-[#18A66D] text-white shadow-2xl shadow-[#18A66D]/30 scale-[1.02]"
                  : "bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1F2A37] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  Meistgewählt
                </div>
              )}

              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-white/60" : "text-[#18A66D]"}`}>
                  {plan.name}
                </div>
                <div className={`text-4xl font-black mb-1 ${plan.highlight ? "text-white" : "text-[#1F2A37]"}`}>
                  €{plan.price}
                  <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-white/60" : "text-[#9CA3AF]"}`}>/Monat</span>
                </div>
                <div className={`text-sm ${plan.highlight ? "text-white/70" : "text-[#6B7280]"}`}>{plan.desc}</div>
              </div>

              <div className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.highlight ? "bg-white/20" : "bg-[#E8FBF3]"
                    }`}>
                      <span className={`text-[10px] ${plan.highlight ? "text-white" : "text-[#18A66D]"}`}>✓</span>
                    </div>
                    <span className={`text-sm ${plan.highlight ? "text-white/90" : "text-[#1F2A37]"}`}>{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="/lead"
                className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition ${
                  plan.highlight
                    ? "bg-white text-[#18A66D] hover:bg-white/90 shadow-lg"
                    : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-md shadow-[#18A66D]/20"
                }`}
              >
                Jetzt anfragen →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Auch als €69- und €189-Paket verfügbar · Alle Preise zzgl. MwSt. · Monatlich kündbar
        </p>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
              Häufige Fragen
            </h2>
            <p className="text-[#6B7280]">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F7FAFC] transition"
                >
                  <span className="font-semibold text-[#1F2A37] text-sm leading-snug">{faq.q}</span>
                  <span className={`text-[#18A66D] text-xl shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-4 bg-[#F7FAFC]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden mx-4 md:mx-8 my-16 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D7A54] via-[#18A66D] to-[#22C080]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative px-8 py-24 text-center text-white max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-white/20">
            ✓ Kein Risiko · Persönliche Beratung · 15 Minuten
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hören Sie auf, Geld zu verlieren.
          </h2>
          <p className="text-white/75 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Buchen Sie jetzt ein kostenloses Beratungsgespräch.
            Wir zeigen Ihnen in 15 Minuten, was TerminStop für Ihren Betrieb bedeutet.
          </p>
          <a
            href="/lead"
            className="inline-block bg-white text-[#18A66D] font-bold px-12 py-4 rounded-xl hover:scale-105 hover:shadow-2xl transition-all shadow-xl text-base"
          >
            Jetzt kostenloses Gespräch sichern →
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/50 text-sm">
            <span>✓ Kein Vertrag</span>
            <span>✓ Persönliches Gespräch</span>
            <span>✓ Klare Antworten</span>
            <span>✓ Sofort startklar</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#E5E7EB] bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-base font-bold">
              <span className="text-[#18A66D]">Termin</span>
              <span className="text-[#1F2A37]">Stop</span>
            </span>
            <p className="text-xs text-[#9CA3AF] mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
          </div>
          <div className="flex gap-6 text-xs text-[#9CA3AF]">
            <a href="/impressum" className="hover:text-[#1F2A37] transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-[#1F2A37] transition">Datenschutz</a>
            <a href="/agb" className="hover:text-[#1F2A37] transition">AGB</a>
            <a href="/avv" className="hover:text-[#1F2A37] transition">AVV</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
