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
      result: "Keine kurzfristigen Absagen",
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
      a: "Unsere Pakete starten ab €39 pro Monat – je nach Anzahl Ihrer Termine. Im Beratungsgespräch finden wir gemeinsam das passende Paket. Kein Vertrag, monatlich kündbar."
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
      a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes."
    },
  ]

  const plans = [
    { name: "Starter", sms: "0 – 100", price: 39,  perDay: "1,30", popular: false },
    { name: "Basic",   sms: "100 – 250", price: 69,  perDay: "2,30", popular: false },
    { name: "Pro",     sms: "250 – 400", price: 109, perDay: "3,63", popular: true  },
    { name: "Growth",  sms: "400 – 600", price: 149, perDay: "4,97", popular: false },
    { name: "Scale",   sms: "600 – 800", price: 189, perDay: "6,30", popular: false },
    { name: "Max",     sms: "800 – 1000",price: 229, perDay: "7,63", popular: false },
  ]

  const features = [
    "Automatische SMS-Erinnerungen",
    "Terminübersicht & Dashboard",
    "Kundenkartei",
    "Kalenderansicht",
    "Auswertungen & Einblicke",
    "Persönliches Onboarding",
    "Persönlicher Support",
  ]

  return (
    <div className="min-h-screen text-[#0C1A14]" style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-[#050D08]/90 backdrop-blur-xl border-b border-white/8">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-[#18A66D]">Termin</span>
          <span className="text-white">Stop</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="#wie-es-funktioniert" className="text-sm text-white/50 hover:text-white transition hidden md:block">So funktioniert's</a>
          <a href="#preise" className="text-sm text-white/50 hover:text-white transition hidden md:block">Preise</a>
          <a href="/login" className="text-sm text-white/50 hover:text-white transition hidden md:block">Login</a>
          <a href="/lead" className="bg-[#18A66D] text-white text-sm px-5 py-2 rounded-full hover:bg-[#15C47D] transition font-semibold">
            Kostenlos anfragen
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO – Dark, cinematic, Apple-style
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#050D08] overflow-hidden pt-16">

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.07) 0%, transparent 70%)" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#18A66D]/15 border border-[#18A66D]/30 text-[#4AE89B] text-xs font-semibold px-4 py-2 rounded-full mb-8">
                <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
                Automatische SMS-Erinnerungen
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight text-white mb-6">
                Kein Termin<br />
                <span className="text-[#18A66D]">geht mehr<br />verloren.</span>
              </h1>

              <p className="text-lg text-white/55 leading-relaxed mb-10 max-w-lg">
                TerminStop erinnert Ihre Kunden automatisch per SMS –
                damit Termine eingehalten werden und Sie sich auf Ihr Handwerk konzentrieren können.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <a href="/lead"
                  className="inline-flex items-center justify-center gap-2 bg-[#18A66D] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#15C47D] transition-all shadow-xl shadow-[#18A66D]/30">
                  Kostenlose Beratung sichern
                  <span className="text-lg">→</span>
                </a>
                <a href="#wie-es-funktioniert"
                  className="inline-flex items-center justify-center gap-2 text-white/60 px-6 py-4 rounded-full font-medium text-sm hover:text-white transition border border-white/10 hover:border-white/20">
                  So funktioniert's ↓
                </a>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8">
                {[
                  { value: "50+", label: "Betriebe aktiv" },
                  { value: "95%", label: "Weniger Ausfälle" },
                  { value: "< 10 Min.", label: "Einrichtung" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Phone */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-[50px] blur-[60px] scale-90"
                  style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.35) 0%, transparent 70%)" }} />
                <div className="relative bg-[#0C1A14] p-[14px] rounded-[50px] shadow-2xl border border-white/10">
                  <div className="w-[290px] h-[580px] rounded-[38px] overflow-hidden relative"
                    style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0f172a 100%)" }}>

                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-3">
                      <span className="text-[11px] text-white/60 font-semibold">9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <div className="w-4 h-2 rounded-sm bg-white/30" />
                        <div className="text-white/40 text-[10px]">●●●</div>
                      </div>
                    </div>

                    {/* Notification header */}
                    <div className="mx-4 bg-white/8 backdrop-blur rounded-2xl p-3 mb-4 flex items-center gap-3 border border-white/10">
                      <div className="w-9 h-9 bg-[#18A66D] rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-black">T</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">TerminStop</div>
                        <div className="text-[10px] text-white/40">Nachricht · Jetzt</div>
                      </div>
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full" />
                    </div>

                    {/* Chat */}
                    <div className="px-4 space-y-3">
                      <div className="bg-[#18A66D] text-white text-[11.5px] leading-[1.6] rounded-2xl rounded-tl-md p-4 max-w-[86%] shadow-lg">
                        Hallo Frau Schmidt 👋<br /><br />
                        Sie haben morgen, <strong>Dienstag um 14:00 Uhr</strong> einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span className="opacity-60 text-[10px]">– Friseurstudio Elegance</span>
                      </div>
                      <div className="text-[9px] text-white/25 pl-1">✓✓ Zugestellt · 24h vor Termin</div>

                      <div className="flex justify-end">
                        <div className="bg-white/12 border border-white/10 text-white text-[11.5px] leading-[1.6] rounded-2xl rounded-tr-md p-3.5 max-w-[75%]">
                          Danke! Ich bin pünktlich da 🙂
                        </div>
                      </div>
                      <div className="text-[9px] text-white/25 text-right pr-1">Gelesen</div>
                    </div>

                    {/* Confirmed banner */}
                    <div className="absolute bottom-6 left-4 right-4">
                      <div className="bg-[#18A66D]/20 border border-[#18A66D]/40 backdrop-blur rounded-2xl p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#18A66D] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#4AE89B]">Termin bestätigt</div>
                          <div className="text-[10px] text-white/40">Kunde erscheint pünktlich</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs">Scrollen</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          INDUSTRIES STRIP
      ══════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#F0F0F0] py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-3 md:gap-6 items-center">
          <span className="text-xs text-[#9CA3AF] font-medium uppercase tracking-widest mr-4">Für alle, die Termine vergeben:</span>
          {["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio"].map((b, i) => (
            <span key={i} className="text-sm text-[#6B7280] font-medium">{b}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROBLEM – Bold numbers
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="max-w-2xl mb-20">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Problem</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-tight mb-6">
              Terminausfälle kosten Sie<br />täglich echtes Geld.
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Jeder Betrieb, der Termine vergibt, verliert durch No-Shows Umsatz. Nicht einmal, sondern jeden Tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F0F0F0]">
            {[
              { value: "€50", label: "Verlust pro Ausfall", desc: "Jeder verpasste Termin ist Umsatz, der nicht stattfindet – plus Ihre verlorene Zeit." },
              { value: "4–9×", label: "Ausfälle pro Woche", desc: "Im Schnitt erlebt jeder Betrieb mehrfach pro Woche, dass Kunden nicht erscheinen." },
              { value: "€2.000+", label: "Verlust pro Monat", desc: "Was nach wenig klingt, summiert sich schnell zu Tausenden Euro im Jahr." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10">
                <div className="text-5xl font-black text-[#0C1A14] mb-3" style={{ fontVariantNumeric: "tabular-nums" }}>{item.value}</div>
                <div className="text-sm font-bold text-[#0C1A14] mb-2">{item.label}</div>
                <div className="text-sm text-[#9CA3AF] leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#0C1A14] rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-white font-bold text-lg mb-1">Die Lösung? Ein automatisches SMS-System.</div>
              <div className="text-white/45 text-sm">Einmal einrichten – läuft dauerhaft. Ohne Aufwand, ohne Technik-Kenntnisse.</div>
            </div>
            <a href="/lead" className="shrink-0 bg-[#18A66D] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#15C47D] transition shadow-lg shadow-[#18A66D]/30 whitespace-nowrap">
              Jetzt kostenlos anfragen →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="wie-es-funktioniert" className="bg-[#F7FAFB] py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="max-w-2xl mb-20">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">So funktioniert's</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-tight mb-6">
              Drei Schritte.<br />Dann läuft es von selbst.
            </h2>
            <p className="text-[#6B7280] text-lg">Kein IT-Studium. Kein Aufwand. Für immer.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "Einmalig einrichten – in unter 10 Minuten",
                desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Persönlicher Onboarding-Support inklusive. Sie brauchen keinerlei Technik-Kenntnisse.",
                tag: "Persönliche Begleitung"
              },
              {
                num: "02",
                title: "Kunden erhalten automatisch eine SMS",
                desc: "24 Stunden vor jedem Termin verschickt TerminStop eine personalisierte Erinnerung – mit Ihrem Namen, dem genauen Termin und dem richtigen Ton.",
                tag: "Vollständig automatisch"
              },
              {
                num: "03",
                title: "Ihre Termine werden tatsächlich eingehalten",
                desc: "Weniger Ausfälle, planbarere Tage, mehr Umsatz. Sie sehen jederzeit in der Übersicht, wer bestätigt hat – und können bei Bedarf rechtzeitig reagieren.",
                tag: "95% Erfolgsquote"
              },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start border border-[#E8EDF0] hover:border-[#18A66D]/30 hover:shadow-lg transition-all duration-300">
                <div className="text-[80px] font-black leading-none text-[#F0F4F0] shrink-0 select-none md:w-28 text-center">{s.num}</div>
                <div className="flex-1 pt-1">
                  <div className="inline-block bg-[#E8FBF3] text-[#18A66D] text-xs font-bold px-3 py-1 rounded-full mb-3">{s.tag}</div>
                  <h3 className="text-xl font-bold text-[#0C1A14] mb-3">{s.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRODUCT SHOWCASE
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Phone – reused but styled differently */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-[300px]">
              <div className="absolute -inset-8 rounded-full opacity-40"
                style={{ background: "radial-gradient(ellipse, #18A66D22 0%, transparent 70%)" }} />
              <div className="relative bg-[#0C1A14] p-3 rounded-[46px] shadow-2xl border border-white/5">
                <div className="bg-white w-[276px] h-[560px] rounded-[36px] overflow-hidden">

                  {/* App header */}
                  <div className="bg-[#18A66D] px-5 pt-8 pb-5">
                    <div className="text-white/70 text-xs mb-1 font-medium">Guten Morgen 👋</div>
                    <div className="text-white font-black text-lg">Heute, 6 Termine</div>
                  </div>

                  {/* Next appointment */}
                  <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 border border-[#E8EDF0] mb-4">
                    <div className="text-[10px] text-[#9CA3AF] mb-1 font-semibold">NÄCHSTER TERMIN</div>
                    <div className="text-sm font-bold text-[#0C1A14]">Maria Schmidt</div>
                    <div className="text-xs text-[#6B7280]">14:00 Uhr · Damenhaarschnitt</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full" />
                      <span className="text-[10px] text-[#18A66D] font-semibold">SMS gesendet ✓</span>
                    </div>
                  </div>

                  {/* Appointments list */}
                  <div className="px-4 space-y-2.5">
                    {[
                      { time: "09:00", name: "Thomas B.", status: "✓", color: "#18A66D" },
                      { time: "10:30", name: "Anna L.", status: "✓", color: "#18A66D" },
                      { time: "12:00", name: "Klaus M.", status: "✓", color: "#18A66D" },
                      { time: "14:00", name: "Maria S.", status: "→", color: "#F59E0B" },
                      { time: "16:00", name: "Peter H.", status: "○", color: "#9CA3AF" },
                    ].map((apt, j) => (
                      <div key={j} className="flex items-center gap-3 bg-[#F7FAFB] rounded-xl p-2.5">
                        <div className="text-xs text-[#9CA3AF] w-10 shrink-0 font-medium">{apt.time}</div>
                        <div className="text-xs text-[#0C1A14] font-medium flex-1">{apt.name}</div>
                        <div className="text-sm font-bold" style={{ color: apt.color }}>{apt.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Dashboard</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-tight mb-6">
              Alles im Blick.<br />Nichts verpassen.
            </h2>
            <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">
              Ihr komplettes Terminmanagement an einem Ort –
              übersichtlich, einfach, und immer aktuell.
            </p>

            <div className="space-y-4">
              {[
                { icon: "📋", title: "Tagesübersicht auf einen Blick", desc: "Sehen Sie sofort, welche Kunden kommen – und welche noch nicht bestätigt haben." },
                { icon: "📱", title: "Automatische SMS-Erinnerungen", desc: "24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                { icon: "👥", title: "Kundenkartei", desc: "Alle Kontakte und die komplette Terminhistorie Ihrer Kunden an einem Ort." },
                { icon: "📊", title: "Auswertungen & Einblicke", desc: "Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 bg-[#F0F9F4] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-[#E8FBF3] transition">
                    {f.icon}
                  </div>
                  <div className="pt-0.5">
                    <div className="font-bold text-[#0C1A14] mb-1">{f.title}</div>
                    <div className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMPARISON
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#F7FAFB] py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-tight mb-4">
              Mit oder ohne<br />TerminStop.
            </h2>
            <p className="text-[#6B7280]">Der Unterschied – schwarz auf weiß.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E8EDF0] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] font-bold text-sm">✗</div>
                <h3 className="font-bold text-[#0C1A14]">Ohne TerminStop</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Kunden vergessen Termine – Sie erfahren es zu spät",
                  "Sie rufen selbst an oder schreiben – kostet Zeit",
                  "Unberechenbare Tage, lückenhafte Auslastung",
                  "Keine Vorwarnung – kein Reaktionsspielraum",
                  "Bis zu €2.000+ Umsatzverlust pro Monat",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#EF4444] shrink-0 mt-0.5 text-sm">✗</span>
                    <span className="text-[#6B7280] text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0C1A14] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #18A66D 0%, transparent 70%)" }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-8 h-8 rounded-full bg-[#18A66D] flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <h3 className="font-bold text-white">Mit TerminStop</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Kunden werden automatisch erinnert – und erscheinen",
                    "Kein manueller Aufwand, kein Nachtelefonieren",
                    "Planbare Tage, maximale Auslastung",
                    "Rechtzeitig informiert – Zeit zum Reagieren",
                    "Monatliche Einsparung durch Automatisierung",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#18A66D] shrink-0 mt-0.5 text-sm">✓</span>
                      <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#050D08] py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Echte Ergebnisse</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Was Betriebe berichten.
            </h2>
            <p className="text-white/40">Keine Versprechen – nur echte Erfahrungen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white/8 hover:border-white/15 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="bg-[#18A66D]/20 border border-[#18A66D]/30 text-[#4AE89B] text-xs font-bold px-3 py-1.5 rounded-full">
                    ✓ {r.result}
                  </div>
                  <div className="text-[#F59E0B] text-sm">{"★".repeat(r.stars)}</div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6 italic">
                  „{r.text}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#18A66D] to-[#0A7A4F] text-white flex items-center justify-center rounded-full text-sm font-black shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="text-xs text-white/35">{r.role} · {r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════ */}
      <section id="preise" className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Preise</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-tight mb-4">
              Einfach. Transparent.<br />Ohne Überraschungen.
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Wählen Sie das Paket passend zu Ihrem Terminvolumen.
              Kein Vertrag – monatlich kündbar.
            </p>
          </div>

          {/* ROI teaser */}
          <div className="max-w-2xl mx-auto mb-14">
            <div className="bg-[#F0F9F4] border border-[#18A66D]/20 rounded-2xl px-7 py-5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="text-3xl">💡</div>
              <div>
                <div className="font-bold text-[#0C1A14] mb-1">Zur Einordnung</div>
                <div className="text-sm text-[#6B7280] leading-relaxed">
                  Schon <strong className="text-[#0C1A14]">2 verhinderte Ausfälle pro Monat</strong> decken den Starter-Preis vollständig.
                  Alles darüber hinaus ist direkter Gewinn für Ihren Betrieb.
                </div>
              </div>
            </div>
          </div>

          {/* 6-plan grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-200 ${
                  plan.popular
                    ? "bg-[#0C1A14] text-white shadow-2xl shadow-[#0C1A14]/20 ring-2 ring-[#18A66D]"
                    : "bg-[#F7FAFB] border border-[#E8EDF0] hover:border-[#18A66D]/30 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#18A66D] text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ✓ Meistgewählt
                  </div>
                )}

                <div className="mb-5">
                  <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.popular ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
                    {plan.name}
                  </div>
                  <div className={`text-4xl font-black mb-1 ${plan.popular ? "text-white" : "text-[#0C1A14]"}`}>
                    €{plan.price}
                    <span className={`text-base font-normal ml-1 ${plan.popular ? "text-white/40" : "text-[#9CA3AF]"}`}>/Monat</span>
                  </div>
                  <div className={`text-sm ${plan.popular ? "text-white/50" : "text-[#9CA3AF]"}`}>
                    {plan.sms} SMS · €{plan.perDay}/Tag
                  </div>
                </div>

                <div className="space-y-2 flex-1 mb-6">
                  {features.slice(0, i < 2 ? 5 : features.length).map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <span className={`text-sm ${plan.popular ? "text-[#18A66D]" : "text-[#18A66D]"}`}>✓</span>
                      <span className={`text-sm ${plan.popular ? "text-white/80" : "text-[#6B7280]"}`}>{f}</span>
                    </div>
                  ))}
                  {i < 2 && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[#E5E7EB]">—</span>
                      <span className={`text-sm ${plan.popular ? "text-white/30" : "text-[#D1D5DB]"}`}>Auswertungen & Einblicke</span>
                    </div>
                  )}
                </div>

                <a
                  href="/lead"
                  className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition ${
                    plan.popular
                      ? "bg-[#18A66D] text-white hover:bg-[#15C47D] shadow-lg shadow-[#18A66D]/30"
                      : "bg-white border border-[#E8EDF0] text-[#0C1A14] hover:border-[#18A66D] hover:text-[#18A66D]"
                  }`}
                >
                  Jetzt anfragen →
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#9CA3AF]">
            Alle Preise sind Endpreise gemäß §19 UStG (Kleinunternehmerregelung) – es wird keine Umsatzsteuer berechnet. · Monatlich kündbar, kein Vertrag.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#F7FAFB] py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] mb-4">
              Häufige Fragen.
            </h2>
            <p className="text-[#6B7280]">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#E8EDF0] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 hover:bg-[#F7FAFB] transition"
                >
                  <span className="font-semibold text-[#0C1A14] text-sm leading-snug">{faq.q}</span>
                  <span className={`text-[#18A66D] text-2xl shrink-0 transition-transform duration-300 font-light ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-6 text-sm text-[#6B7280] leading-relaxed border-t border-[#F0F4F0] pt-5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#050D08] py-32">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, #18A66D 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#18A66D]/15 border border-[#18A66D]/25 text-[#4AE89B] text-xs font-semibold px-5 py-2.5 rounded-full mb-8">
            ✓ Kostenlos · Unverbindlich · 15 Minuten
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Hören Sie auf,<br />
            <span className="text-[#18A66D]">Geld zu verlieren.</span>
          </h2>

          <p className="text-white/50 text-xl leading-relaxed mb-12 max-w-xl mx-auto">
            Ein 15-minütiges Gespräch – und Sie wissen, was TerminStop
            konkret für Ihren Betrieb bedeutet.
          </p>

          <a
            href="/lead"
            className="inline-flex items-center gap-3 bg-[#18A66D] text-white font-bold px-12 py-5 rounded-full hover:bg-[#15C47D] transition-all shadow-2xl shadow-[#18A66D]/40 text-base hover:scale-105"
          >
            Jetzt kostenloses Gespräch sichern
            <span className="text-xl">→</span>
          </a>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-white/30 text-sm">
            <span>✓ Kein Vertrag</span>
            <span>✓ Persönliches Gespräch</span>
            <span>✓ Klare Antworten</span>
            <span>✓ Sofort startklar</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#050D08] border-t border-white/8 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-base font-bold">
              <span className="text-[#18A66D]">Termin</span>
              <span className="text-white">Stop</span>
            </span>
            <p className="text-xs text-white/25 mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="/impressum" className="hover:text-white/70 transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-white/70 transition">Datenschutz</a>
            <a href="/agb" className="hover:text-white/70 transition">AGB</a>
            <a href="/avv" className="hover:text-white/70 transition">AVV</a>
            <a href="/login" className="hover:text-white/70 transition">Login</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
