"use client"

import { useState, useEffect } from "react"

export default function LandingPage() {

  const [reviewIndex, setReviewIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reviews = [
    {
      text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Ich hätte nicht gedacht, dass es so schnell wirkt.",
      name: "Thomas M.",
      role: "Autohaus, München",
      result: "−58% Ausfälle in 2 Wochen",
      stars: 5
    },
    {
      text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.",
      name: "Sandra K.",
      role: "Friseurstudio, Hamburg",
      result: "−3h Zeitaufwand pro Woche",
      stars: 5
    },
    {
      text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.",
      name: "Dr. Andreas B.",
      role: "Physiotherapiepraxis, Berlin",
      result: "Kaum noch kurzfristige Absagen",
      stars: 5
    },
    {
      text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.",
      name: "Markus S.",
      role: "KFZ-Werkstatt, Stuttgart",
      result: "+18% Auslastung in Monat 1",
      stars: 4.5
    },
  ]

  const faqs = [
    {
      q: "Muss ich eine App installieren oder etwas technisch einrichten?",
      a: "Nein. TerminStop läuft komplett im Hintergrund – Sie brauchen keine App, keine Software und keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich."
    },
    {
      q: "Was kostet TerminStop monatlich?",
      a: "Sie zahlen einen fixen Monatsbetrag abhängig von Ihrem Volumen – keine versteckten Kosten, keine Überraschungen. Im Beratungsgespräch nennen wir Ihnen den genauen Preis für Ihre Situation. Die meisten Betriebe haben sich TerminStop nach wenigen Wochen bereits refinanziert."
    },
    {
      q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?",
      a: "Genau dafür ist TerminStop gebaut. Die meisten Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe. Keine Vorkenntnisse nötig – und wenn doch mal etwas nicht klappt, sind wir persönlich erreichbar."
    },
    {
      q: "Was passiert, wenn ein Kunde nicht auf die SMS antwortet?",
      a: "Das System erinnert trotzdem – und Sie sehen in der Übersicht, wer bestätigt hat und wer nicht. So können Sie gezielt reagieren, bevor es zu einem Ausfall kommt."
    },
    {
      q: "Wie lange dauert es, bis ich erste Ergebnisse sehe?",
      a: "Die meisten Kunden berichten bereits nach der ersten Woche von weniger Ausfällen. Die Erinnerungen wirken sofort – weil Ihre Kunden sie sofort erhalten."
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
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
      <nav className="flex justify-between items-center px-8 md:px-16 py-5 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-[#18A66D]">Termin</span>
          <span className="text-[#1F2A37]">Stop</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="#wie-es-funktioniert" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">So funktioniert's</a>
          <a href="#preise" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition hidden md:block">Preise</a>
          <a href="/login" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition">Login</a>
          <a href="/lead" className="bg-[#18A66D] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#0F8F63] transition font-semibold shadow-sm">
            Jetzt anfragen
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="max-w-5xl mx-auto px-8 md:px-10 pt-24 pb-20 text-center">

        <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-[#FDE68A]">
          <span>💡</span>
          <span>Jeder ausgefallene Termin kostet Sie durchschnittlich €50</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-[#1F2A37]">
          Ihre Kunden kommen.<br />
          <span className="text-[#18A66D]">Zuverlässig.</span>
        </h1>

        <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
          TerminStop erinnert Ihre Kunden automatisch per SMS –
          damit Termine eingehalten werden und Ihr Alltag planbar bleibt.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="/lead"
            className="bg-[#18A66D] text-white px-10 py-4 rounded-xl hover:bg-[#0F8F63] transition font-bold shadow-lg shadow-[#18A66D]/25 text-base"
          >
            Kostenlose Beratung sichern →
          </a>
          <span className="text-[#9CA3AF] text-sm">Kein Vertrag · Keine versteckten Kosten</span>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="text-[#18A66D] font-bold text-base">500+</span>
            <span>Betriebe aktiv</span>
          </div>
          <div className="text-[#E5E7EB]">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#18A66D] font-bold text-base">95%</span>
            <span>weniger Ausfälle</span>
          </div>
          <div className="text-[#E5E7EB]">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#18A66D] font-bold text-base">4.9★</span>
            <span>Kundenbewertung</span>
          </div>
          <div className="text-[#E5E7EB]">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#18A66D] font-bold text-base">Ø 8 Min.</span>
            <span>Einrichtung</span>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM (The Cost) ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-20">
        <div className="max-w-5xl mx-auto px-8 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
              Was Terminausfälle Sie wirklich kosten
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Kein theoretisches Problem – sondern täglich bares Geld.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: "💸",
                value: "€50",
                label: "Verlust pro Ausfall",
                desc: "Nicht erschienene Kunden kosten nicht nur den Umsatz – sondern auch Ihre Zeit."
              },
              {
                icon: "📉",
                value: "4–9×",
                label: "Ausfälle pro Woche",
                desc: "Im Schnitt hat jeder Betrieb mehrmals wöchentlich Kunden, die nicht erscheinen."
              },
              {
                icon: "🗓",
                value: "€300–7500",
                label: "Verlust pro Monat",
                desc: "Das sind echte Einnahmen, die schlicht nicht stattfinden – obwohl der Slot gebucht war."
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#FEF9F0] border border-[#FDE68A] rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-3xl font-bold text-[#D97706] mb-1">{item.value}</div>
                <div className="text-sm font-semibold text-[#1F2A37] mb-2">{item.label}</div>
                <div className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#1F2A37] rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div>
              <div className="font-semibold mb-1">Die gute Nachricht:</div>
              <div className="text-white/70 text-sm">Das lässt sich mit einem automatischen System komplett vermeiden.</div>
            </div>
            <a href="/lead" className="bg-[#18A66D] text-white text-sm px-6 py-3 rounded-xl hover:bg-[#0F8F63] transition font-semibold whitespace-nowrap flex-shrink-0">
              Problem lösen →
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="wie-es-funktioniert" className="max-w-5xl mx-auto px-8 md:px-10 py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            So einfach
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
            Drei Schritte. Fertig.
          </h2>
          <p className="text-[#6B7280] max-w-md mx-auto">
            Kein IT-Studium. Kein Aufwand. Einmal einrichten – für immer laufen lassen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              title: "Kunden werden automatisch erinnert",
              desc: "24 Stunden vor jedem Termin erhalten Ihre Kunden eine persönliche SMS – mit Ihrem Namen und dem genauen Termin.",
              note: "Individuell angepasst an Ihr Unternehmen"
            },
            {
              step: "03",
              icon: "✅",
              title: "Ihre Termine werden eingehalten",
              desc: "Kunden erscheinen pünktlich. Sie haben volle Übersicht. Ihr Alltag wird planbarer – ohne Mehraufwand.",
              note: "95% Erfolgsquote in der Praxis"
            },
          ].map((s, i) => (
            <div key={i} className="relative bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="text-[#E5E7EB] text-5xl font-black absolute top-6 right-7 select-none leading-none">{s.step}</div>
              <div className="w-12 h-12 bg-[#E8FBF3] rounded-xl flex items-center justify-center text-2xl mb-5">
                {s.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1F2A37] mb-3">{s.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="flex items-center gap-2 text-xs text-[#18A66D] font-semibold">
                <span>✓</span>
                <span>{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW (Phone + Features) ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-28">
        <div className="max-w-7xl mx-auto px-8 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* Phone Mock */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#18A66D]/10 rounded-[50px] blur-3xl scale-110" />
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
                      <div className="text-[9px] text-black/40">SMS • Jetzt</div>
                    </div>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full" />
                    </div>
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
                      <div className="w-7 h-7 bg-[#18A66D] rounded-full flex items-center justify-center flex-shrink-0">
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
            <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              So sieht Ihre Erinnerung aus
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Persönlich.<br />Automatisch.<br />Wirksam.
            </h2>
            <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
              Jede SMS trägt Ihren Unternehmensnamen, den genauen Termin und den richtigen Ton.
              Einmal eingerichtet – läuft für immer.
            </p>

            <div className="space-y-4">
              {[
                { icon: "🏷", title: "Ihr Name, Ihr Stil", desc: "Jede Nachricht wirkt wie von Ihnen persönlich geschrieben." },
                { icon: "⏰", title: "Immer zum richtigen Zeitpunkt", desc: "24 Stunden vor dem Termin – automatisch, ohne Ihr Zutun." },
                { icon: "📊", title: "Volle Übersicht", desc: "Sie sehen jederzeit, wer bestätigt hat und wer nicht." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl p-4">
                  <div className="w-9 h-9 bg-[#E8FBF3] rounded-lg flex items-center justify-center text-base flex-shrink-0">
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
        </div>
      </section>

      {/* ─── SOCIAL PROOF / REVIEWS ─── */}
      <section className="max-w-6xl mx-auto px-8 md:px-10 py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Echte Ergebnisse
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
            Was Betriebe berichten
          </h2>
          <p className="text-[#6B7280]">Keine Hochglanzversprechen – nur echte Erfahrungen.</p>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${reviewIndex * 50}%)` }}
          >
            {reviews.map((r, i) => (
              <div
                key={i}
                className="min-w-[50%] bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm flex-shrink-0"
              >
                {/* Result badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#E8FBF3] text-[#18A66D] text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                  ✓ {r.result}
                </div>

                <div className="text-[#F59E0B] text-sm mb-4">{renderStars(r.stars)}</div>

                <p className="text-[#1F2A37] text-base mb-7 leading-relaxed">
                  „{r.text}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-[#E5E7EB]">
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

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === reviewIndex ? "bg-[#18A66D] w-6" : "bg-[#E5E7EB] w-2"}`}
            />
          ))}
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-28">
        <div className="max-w-5xl mx-auto px-8 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
              Mit oder ohne TerminStop
            </h2>
            <p className="text-[#6B7280]">Der Unterschied ist schwarz auf weiß.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without */}
            <div className="border border-[#FECACA] bg-[#FFF5F5] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#FEE2E2] rounded-full flex items-center justify-center text-sm">✗</div>
                <h3 className="font-bold text-[#1F2A37]">Ohne TerminStop</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Kunden vergessen Termine – und erscheinen nicht",
                  "Sie telefonieren hinterher oder verlieren den Slot",
                  "Unberechenbare Tage, lückenhafte Kalender",
                  "Keine Möglichkeit vorher zu reagieren",
                  "Bis zu €800 Verlust pro Monat",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#EF4444] text-sm mt-0.5 flex-shrink-0">✗</span>
                    <span className="text-sm text-[#6B7280]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With */}
            <div className="border border-[#6EE7B7] bg-[#F0FDF6] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#D1FAE5] rounded-full flex items-center justify-center text-sm">✓</div>
                <h3 className="font-bold text-[#1F2A37]">Mit TerminStop</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Kunden werden automatisch erinnert – und erscheinen",
                  "Kein manueller Aufwand, kein Nachtelefonieren",
                  "Planbare Tage, volle Auslastung",
                  "Rechtzeitig reagieren, bevor Ausfälle entstehen",
                  "Monatliche Einsparung €500–7500",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#18A66D] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-[#1F2A37]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="preise" className="max-w-4xl mx-auto px-8 md:px-10 py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          Transparent & fair
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
          Einfache Preisgestaltung
        </h2>
        <p className="text-[#6B7280] mb-14 max-w-lg mx-auto">
          Kein Abo-Chaos, keine versteckten Gebühren. Sie zahlen einen festen Betrag –
          und wissen immer, wofür.
        </p>

        <div className="bg-white border-2 border-[#18A66D] rounded-3xl p-10 shadow-xl shadow-[#18A66D]/10 max-w-md mx-auto relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#18A66D] text-white text-xs font-bold px-4 py-1.5 rounded-full">
            Meistgewählt
          </div>

          <div className="text-5xl font-black text-[#1F2A37] mb-1">
            Ab <span className="text-[#18A66D]">€39</span>
          </div>
          <div className="text-[#6B7280] text-sm mb-8">pro Monat · Je nach Volumen</div>

          <div className="space-y-3 text-left mb-10">
            {[
              "Automatische SMS-Erinnerungen",
              "Persönliches Onboarding (inklusive)",
              "Dashboard & Übersicht",
              "Individuelle Nachrichtenvorlage",
              "Persönlicher Support",
              "Keine Vertragsbindung",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#E8FBF3] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#18A66D] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#1F2A37]">{item}</span>
              </div>
            ))}
          </div>

          <a
            href="/lead"
            className="block w-full bg-[#18A66D] text-white py-4 rounded-xl hover:bg-[#0F8F63] transition font-bold text-center shadow-md shadow-[#18A66D]/20"
          >
            Jetzt anfragen →
          </a>

          <p className="text-xs text-[#9CA3AF] mt-4">
            Im Gespräch nennen wir Ihnen den genauen Preis für Ihre Situation.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white border-y border-[#E5E7EB] py-28">
        <div className="max-w-3xl mx-auto px-8 md:px-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-3">
              Häufige Fragen
            </h2>
            <p className="text-[#6B7280]">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F7FAFC] transition"
                >
                  <span className="font-semibold text-[#1F2A37] text-sm leading-snug">{faq.q}</span>
                  <span className={`text-[#18A66D] text-xl flex-shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
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
      <section className="mx-4 md:mx-8 my-16 bg-gradient-to-br from-[#0F8F63] via-[#18A66D] to-[#1FB07A] rounded-3xl px-8 py-20 text-center text-white shadow-2xl shadow-[#18A66D]/20">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-7">
            ✓ Kein Risiko · Persönliche Beratung
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hören Sie auf, Geld zu verlieren.
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Buchen Sie jetzt ein kostenloses Beratungsgespräch.
            Wir zeigen Ihnen in 15 Minuten, was TerminStop für Ihren Betrieb bedeutet.
          </p>
          <a
            href="/lead"
            className="inline-block bg-white text-[#18A66D] font-bold px-12 py-4 rounded-xl hover:scale-105 transition shadow-xl text-base"
          >
            Jetzt kostenloses Gespräch buchen →
          </a>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span>✓ Kein Vertrag</span>
            <span>✓ Persönliches Gespräch</span>
            <span>✓ Klare Antworten</span>
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
