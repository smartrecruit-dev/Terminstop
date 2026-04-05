"use client"

import { useState, useEffect, useRef } from "react"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroWord, setHeroWord] = useState(0)
  const words = ["Friseur.", "Werkstatt.", "Praxis.", "Betrieb."]

  useEffect(() => {
    const t = setInterval(() => setHeroWord(w => (w + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [])

  const reviews = [
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Ich hätte nicht gedacht, dass es so schnell wirkt.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle", stars: 5 },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h Zeitaufwand/Woche", stars: 5 },
    { text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.", name: "Dr. Andreas B.", role: "Physiotherapiepraxis", city: "Berlin", result: "Keine kurzfristigen Absagen", stars: 5 },
    { text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.", name: "Markus S.", role: "KFZ-Werkstatt", city: "Stuttgart", result: "+18% Auslastung", stars: 5 },
  ]

  const faqs = [
    { q: "Muss ich eine App installieren oder etwas technisch einrichten?", a: "Nein. TerminStop läuft komplett im Browser – keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich." },
    { q: "Was kostet TerminStop monatlich?", a: "Unsere Pakete starten ab €39 pro Monat – je nach Anzahl Ihrer Termine. Im Beratungsgespräch finden wir gemeinsam das passende Paket. Kein Vertrag, monatlich kündbar." },
    { q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?", a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe – keine Vorkenntnisse nötig. Und wenn mal etwas nicht klappt, sind wir persönlich erreichbar." },
    { q: "Was passiert, wenn ein Kunde nicht auf die SMS antwortet?", a: "Das System erinnert trotzdem – und Sie sehen in der Übersicht, wer bestätigt hat und wer nicht. So können Sie gezielt reagieren, bevor es zu einem Ausfall kommt." },
    { q: "Wie lange dauert es, bis ich erste Ergebnisse sehe?", a: "Die meisten Kunden berichten bereits nach der ersten Woche von weniger Ausfällen. Die Erinnerungen wirken sofort – weil Ihre Kunden sie sofort erhalten." },
    { q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?", a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes." },
  ]

  const plans = [
    {
      name: "Starter", price: 39, sms: "0 – 100 SMS", perDay: "1,30",
      popular: false,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"],
    },
    {
      name: "Pro", price: 109, sms: "250 – 400 SMS", perDay: "3,63",
      popular: true,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"],
    },
    {
      name: "Max", price: 229, sms: "800 – 1000 SMS", perDay: "7,63",
      popular: false,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"],
    },
  ]

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(1deg); }
          66%       { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-24px); }
        }
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px 0px rgba(24,166,109,0.35); }
          50%       { box-shadow: 0 0 60px 10px rgba(24,166,109,0.55); }
        }
        @keyframes wordFade {
          0%   { opacity: 0; transform: translateY(10px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes borderSpin {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ping-slow {
          0%  { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(2.2); opacity: 0; }
          100%{ transform: scale(2.2); opacity: 0; }
        }
        .animate-float  { animation: float  6s ease-in-out infinite; }
        .animate-floatB { animation: floatB 8s ease-in-out infinite; }
        .animate-glow   { animation: glow   3s ease-in-out infinite; }
        .animate-word   { animation: wordFade 2.2s ease-in-out; }
        .animate-fadeUp { animation: fadeUp 0.7s ease forwards; }
        .ping-slow::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(24,166,109,0.4);
          animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite;
        }
        .grad-btn {
          background: linear-gradient(270deg, #18A66D, #15C47D, #0D7A54, #18A66D);
          background-size: 300% 100%;
          animation: gradShift 5s ease infinite;
        }
        .card-glow:hover { box-shadow: 0 0 0 1px rgba(24,166,109,0.4), 0 20px 60px rgba(24,166,109,0.1); }
        .shimmer-text {
          background: linear-gradient(90deg, #4AE89B 0%, #18A66D 40%, #4AE89B 60%, #18A66D 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .plan-popular-border {
          background: linear-gradient(#0C1A14, #0C1A14) padding-box,
                      linear-gradient(135deg, #18A66D, #4AE89B, #18A66D) border-box;
          border: 2px solid transparent;
        }
      `}</style>

      <div className="min-h-screen text-[#0C1A14]" style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif" }}>

        {/* ─── NAV ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-[#050D08]/85 backdrop-blur-2xl border-b border-white/8">
          <span className="text-lg font-bold tracking-tight select-none">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-white">Stop</span>
          </span>
          <div className="flex items-center gap-5">
            <a href="#wie-es-funktioniert" className="text-sm text-white/40 hover:text-white transition-colors hidden md:block">So funktioniert's</a>
            <a href="#preise" className="text-sm text-white/40 hover:text-white transition-colors hidden md:block">Preise</a>
            <a href="/login" className="text-sm text-white/40 hover:text-white transition-colors hidden md:block">Login</a>
            <a href="/lead" className="grad-btn text-white text-sm px-5 py-2.5 rounded-full font-bold shadow-lg shadow-[#18A66D]/20 hover:opacity-90 transition-opacity">
              Kostenlos anfragen
            </a>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#050D08] overflow-hidden pt-16">

          {/* Animated background orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none animate-float"
            style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.14) 0%, transparent 65%)" }} />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] pointer-events-none animate-floatB"
            style={{ background: "radial-gradient(circle, rgba(24,166,109,0.08) 0%, transparent 70%)", animationDelay: "2s" }} />
          <div className="absolute top-10 left-10 w-[250px] h-[250px] pointer-events-none animate-floatB"
            style={{ background: "radial-gradient(circle, rgba(24,166,109,0.06) 0%, transparent 70%)", animationDelay: "4s" }} />

          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

          {/* Dots top-right */}
          <div className="absolute top-24 right-16 opacity-20 hidden lg:block"
            style={{ backgroundImage: "radial-gradient(circle, #18A66D 1.5px, transparent 1.5px)", backgroundSize: "22px 22px", width: 132, height: 110 }} />
          <div className="absolute bottom-32 left-16 opacity-10 hidden lg:block"
            style={{ backgroundImage: "radial-gradient(circle, #18A66D 1.5px, transparent 1.5px)", backgroundSize: "22px 22px", width: 110, height: 88 }} />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className="animate-fadeUp" style={{ animationDelay: "0.1s" }}>

              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-white/70 text-xs font-semibold px-4 py-2.5 rounded-full mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="ping-slow relative inline-flex rounded-full h-2 w-2 bg-[#18A66D]" />
                </span>
                Automatische SMS-Erinnerungen für Ihren
                <span className="text-[#18A66D] font-bold" key={heroWord} style={{ animation: "wordFade 2.2s ease-in-out" }}>
                  {words[heroWord]}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight text-white mb-7">
                Kein Termin<br />
                <span className="shimmer-text">geht mehr<br />verloren.</span>
              </h1>

              <p className="text-lg text-white/45 leading-relaxed mb-10 max-w-md">
                TerminStop erinnert Ihre Kunden automatisch per SMS –
                damit Termine eingehalten werden und Sie sich auf das Wesentliche konzentrieren.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <a href="/lead"
                  className="grad-btn animate-glow inline-flex items-center justify-center gap-2 text-white px-9 py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90 shadow-xl">
                  Kostenlose Beratung sichern →
                </a>
                <a href="#wie-es-funktioniert"
                  className="inline-flex items-center justify-center gap-2 text-white/50 px-6 py-4 rounded-full text-sm hover:text-white transition-colors border border-white/10 hover:border-white/20">
                  So funktioniert's ↓
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 pt-8 border-t border-white/8">
                {[
                  { v: "50+", l: "Betriebe aktiv" },
                  { v: "95%", l: "Weniger Ausfälle" },
                  { v: "< 10 Min.", l: "Einrichtung" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">{s.v}</div>
                    <div className="text-xs text-white/35 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – Phone */}
            <div className="flex justify-center lg:justify-end animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              <div className="relative animate-float" style={{ animationDelay: "1s" }}>
                <div className="absolute -inset-10 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.25) 0%, transparent 65%)" }} />
                <div className="relative bg-[#0a1510] p-[13px] rounded-[50px] border border-white/10"
                  style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(24,166,109,0.15) inset" }}>

                  {/* Scanline effect */}
                  <div className="absolute inset-[13px] rounded-[38px] overflow-hidden pointer-events-none z-20 opacity-[0.03]">
                    <div style={{ width: "100%", height: "40%", background: "linear-gradient(transparent,rgba(255,255,255,0.8),transparent)", animation: "scanline 4s linear infinite" }} />
                  </div>

                  <div className="w-[288px] h-[580px] rounded-[38px] overflow-hidden relative"
                    style={{ background: "linear-gradient(180deg, #0e1e16 0%, #0a1410 100%)" }}>

                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-3">
                      <span className="text-[11px] text-white/50 font-semibold tabular-nums">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-[18px] h-[9px] rounded-sm border border-white/30 relative">
                          <div className="absolute left-0.5 top-0.5 bottom-0.5 w-3/4 bg-[#18A66D] rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Notification card */}
                    <div className="mx-3 bg-white/8 backdrop-blur-sm rounded-2xl p-3.5 mb-3 border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#18A66D] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#18A66D]/40">
                        <span className="text-white text-base font-black">T</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white">TerminStop</div>
                        <div className="text-[10px] text-white/35 truncate">SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full shrink-0" style={{ boxShadow: "0 0 8px #18A66D" }} />
                    </div>

                    {/* SMS bubble */}
                    <div className="px-4 space-y-3">
                      <div className="relative max-w-[88%]">
                        <div className="bg-[#18A66D] text-white text-[11.5px] leading-[1.65] rounded-2xl rounded-tl-sm p-4 shadow-xl shadow-[#18A66D]/30">
                          Hallo Frau Schmidt 👋<br /><br />
                          Sie haben morgen,<br />
                          <strong>Dienstag um 14:00 Uhr</strong><br />
                          einen Termin bei uns.<br /><br />
                          Wir freuen uns auf Sie!<br />
                          <span className="text-white/50 text-[10px]">– Friseurstudio Elegance</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-white/20 pl-1">✓✓ Zugestellt · 24h vor Termin</div>

                      <div className="flex justify-end">
                        <div className="bg-white/10 border border-white/10 text-white/80 text-[11.5px] leading-[1.6] rounded-2xl rounded-tr-sm p-3.5 max-w-[78%]">
                          Danke! Bin pünktlich da 🙂
                        </div>
                      </div>
                      <div className="text-[9px] text-white/20 text-right pr-1">Gelesen</div>
                    </div>

                    {/* Confirmed card */}
                    <div className="absolute bottom-5 left-3 right-3">
                      <div className="bg-[#18A66D]/15 border border-[#18A66D]/35 backdrop-blur-sm rounded-2xl p-3.5 flex items-center gap-3"
                        style={{ boxShadow: "0 0 30px rgba(24,166,109,0.15)" }}>
                        <div className="w-8 h-8 bg-[#18A66D] rounded-full flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 12px rgba(24,166,109,0.5)" }}>
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#4AE89B]">Termin bestätigt</div>
                          <div className="text-[10px] text-white/35">Kundin erscheint pünktlich</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>
        </section>

        {/* ══ INDUSTRY STRIP ══ */}
        <section className="bg-[#0A1410] border-y border-white/8 py-4 overflow-hidden">
          <div className="flex gap-8 items-center justify-center flex-wrap px-6">
            <span className="text-[11px] text-white/25 font-bold uppercase tracking-widest shrink-0">Für alle Branchen</span>
            {["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio"].map((b, i) => (
              <span key={i} className="text-sm text-white/40 hover:text-white/70 transition-colors cursor-default">{b}</span>
            ))}
          </div>
        </section>

        {/* ══ PROBLEM ══ */}
        <section className="bg-white py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="max-w-2xl mb-20">
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Problem</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-[1.1] mb-6">
                Terminausfälle kosten Sie<br />täglich echtes Geld.
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Jeder Betrieb, der Termine vergibt, verliert durch No-Shows Umsatz. Nicht einmal, sondern jeden Tag.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#F0F0F0] rounded-2xl overflow-hidden">
              {[
                { value: "€50", label: "Verlust pro Ausfall", desc: "Jeder verpasste Termin ist Umsatz, der nicht stattfindet – plus Ihre verlorene Zeit." },
                { value: "4–9×", label: "Ausfälle pro Woche", desc: "Im Schnitt erlebt jeder Betrieb mehrfach pro Woche, dass Kunden einfach nicht erscheinen." },
                { value: "€2.000+", label: "Verlust pro Monat", desc: "Was nach wenig klingt, summiert sich zu Tausenden Euro im Jahr." },
              ].map((item, i) => (
                <div key={i} className={`p-10 ${i < 2 ? "border-b md:border-b-0 md:border-r border-[#F0F0F0]" : ""}`}>
                  <div className="text-5xl font-black text-[#0C1A14] mb-3 tabular-nums">{item.value}</div>
                  <div className="text-sm font-bold text-[#0C1A14] mb-2">{item.label}</div>
                  <div className="text-sm text-[#9CA3AF] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#050D08] rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-white font-bold text-lg mb-1">Die Lösung? Ein automatisches SMS-System.</div>
                <div className="text-white/40 text-sm">Einmal einrichten – läuft dauerhaft. Ohne Aufwand, ohne Technik-Kenntnisse.</div>
              </div>
              <a href="/lead" className="shrink-0 grad-btn text-white px-7 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#18A66D]/25 whitespace-nowrap">
                Jetzt kostenlos anfragen →
              </a>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="wie-es-funktioniert" className="bg-[#050D08] py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="max-w-2xl mb-16">
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">So funktioniert's</div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6">
                Drei Schritte.<br />Dann läuft es von selbst.
              </h2>
              <p className="text-white/40 text-lg">Kein IT-Studium. Kein Aufwand. Für immer.</p>
            </div>

            <div className="space-y-4">
              {[
                { num: "01", title: "Einmalig einrichten – in unter 10 Minuten", desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Persönlicher Onboarding-Support inklusive. Keine Technik-Kenntnisse nötig.", tag: "Persönliche Begleitung" },
                { num: "02", title: "Kunden erhalten automatisch eine SMS", desc: "24 Stunden vor jedem Termin verschickt TerminStop eine personalisierte Erinnerung – mit Ihrem Namen, dem genauen Termin und dem richtigen Ton.", tag: "Vollständig automatisch" },
                { num: "03", title: "Ihre Termine werden tatsächlich eingehalten", desc: "Weniger Ausfälle, planbarere Tage, mehr Umsatz. Sie sehen in der Übersicht, wer bestätigt hat – und können bei Bedarf rechtzeitig reagieren.", tag: "95% Erfolgsquote" },
              ].map((s, i) => (
                <div key={i} className="group bg-white/4 border border-white/8 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start hover:bg-white/7 hover:border-[#18A66D]/25 transition-all duration-300 card-glow">
                  <div className="text-[72px] font-black leading-none text-white/6 shrink-0 select-none group-hover:text-[#18A66D]/15 transition-colors md:w-24 text-center">{s.num}</div>
                  <div className="flex-1 pt-1">
                    <div className="inline-block bg-[#18A66D]/15 border border-[#18A66D]/25 text-[#4AE89B] text-[11px] font-bold px-3 py-1 rounded-full mb-3">{s.tag}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                    <p className="text-white/45 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRODUCT SHOWCASE ══ */}
        <section className="bg-white py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Phone 2 – Dashboard */}
            <div className="flex justify-center">
              <div className="relative animate-floatB" style={{ animationDelay: "0.5s" }}>
                <div className="absolute -inset-8 rounded-full opacity-30 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, #18A66D22 0%, transparent 70%)" }} />
                <div className="relative bg-[#0C1A14] p-3 rounded-[46px] shadow-2xl border border-white/8">
                  <div className="bg-white w-[278px] h-[560px] rounded-[36px] overflow-hidden">
                    <div className="bg-[#18A66D] px-5 pt-8 pb-6">
                      <div className="text-white/60 text-[11px] mb-1 font-medium">Guten Morgen 👋</div>
                      <div className="text-white font-black text-xl mb-3">Heute, 6 Termine</div>
                      <div className="flex gap-2">
                        <div className="bg-white/15 rounded-xl px-3 py-1.5 text-white/80 text-[11px] font-semibold">5 ✓ bestätigt</div>
                        <div className="bg-white/10 rounded-xl px-3 py-1.5 text-white/60 text-[11px]">1 ausstehend</div>
                      </div>
                    </div>
                    <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 border border-[#E8EDF0] mb-4">
                      <div className="text-[10px] text-[#9CA3AF] mb-1 font-bold uppercase tracking-wide">Nächster Termin</div>
                      <div className="text-sm font-bold text-[#0C1A14]">Maria Schmidt</div>
                      <div className="text-xs text-[#6B7280]">14:00 Uhr · Damenhaarschnitt</div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#18A66D] rounded-full" style={{ boxShadow: "0 0 4px #18A66D" }} />
                        <span className="text-[10px] text-[#18A66D] font-semibold">SMS gesendet ✓</span>
                      </div>
                    </div>
                    <div className="px-4 space-y-2">
                      {[
                        { time: "09:00", name: "Thomas B.", s: "✓", c: "#18A66D" },
                        { time: "10:30", name: "Anna L.", s: "✓", c: "#18A66D" },
                        { time: "12:00", name: "Klaus M.", s: "✓", c: "#18A66D" },
                        { time: "14:00", name: "Maria S.", s: "→", c: "#F59E0B" },
                        { time: "16:00", name: "Peter H.", s: "○", c: "#D1D5DB" },
                      ].map((a, j) => (
                        <div key={j} className="flex items-center gap-3 bg-[#F7FAFB] rounded-xl p-2.5">
                          <span className="text-[11px] text-[#9CA3AF] w-10 shrink-0 font-medium tabular-nums">{a.time}</span>
                          <span className="text-[11px] text-[#0C1A14] font-medium flex-1">{a.name}</span>
                          <span className="text-sm font-bold" style={{ color: a.c }}>{a.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Dashboard</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-[1.1] mb-6">
                Alles im Blick.<br />Nichts verpassen.
              </h2>
              <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">
                Ihr komplettes Terminmanagement an einem Ort – übersichtlich, einfach, immer aktuell.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📋", title: "Tagesübersicht auf einen Blick", desc: "Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                  { icon: "📱", title: "Automatische SMS-Erinnerungen", desc: "24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                  { icon: "👥", title: "Kundenkartei", desc: "Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                  { icon: "📊", title: "Auswertungen & Einblicke", desc: "Sehen Sie, wie sich Ihr Betrieb entwickelt." },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4 group cursor-default">
                    <div className="w-11 h-11 bg-[#F0F9F4] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-[#E8FBF3] group-hover:scale-105 transition-all">
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

        {/* ══ COMPARISON ══ */}
        <section className="bg-[#F7FAFB] py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-[1.1] mb-4">Mit oder ohne<br />TerminStop.</h2>
              <p className="text-[#6B7280]">Der Unterschied – schwarz auf weiß.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E8EDF0] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] font-bold text-sm">✗</div>
                  <h3 className="font-bold text-[#0C1A14]">Ohne TerminStop</h3>
                </div>
                {["Kunden vergessen Termine – Sie erfahren es zu spät", "Sie rufen selbst an – das kostet Zeit und Nerven", "Unberechenbare Tage, lückenhafte Auslastung", "Keine Vorwarnung – kein Reaktionsspielraum", "Bis zu €2.000+ Umsatzverlust pro Monat"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span className="text-[#EF4444] shrink-0 mt-0.5">✗</span>
                    <span className="text-[#6B7280] text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#050D08] rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none opacity-20"
                  style={{ background: "radial-gradient(circle, #18A66D 0%, transparent 70%)" }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-full bg-[#18A66D] flex items-center justify-center text-white font-bold text-sm">✓</div>
                    <h3 className="font-bold text-white">Mit TerminStop</h3>
                  </div>
                  {["Kunden werden automatisch erinnert – und erscheinen", "Kein manueller Aufwand, kein Nachtelefonieren", "Planbare Tage, maximale Auslastung", "Rechtzeitig informiert – Zeit zum Reagieren", "Monatliche Einsparung durch Automatisierung"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3">
                      <span className="text-[#18A66D] shrink-0 mt-0.5">✓</span>
                      <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="bg-[#050D08] py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Echte Ergebnisse</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Was Betriebe berichten.</h2>
              <p className="text-white/35">Keine Versprechen – nur echte Erfahrungen.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white/4 border border-white/8 rounded-2xl p-8 flex flex-col hover:bg-white/6 hover:border-white/12 transition-all duration-300 card-glow">
                  <div className="flex items-start justify-between mb-5">
                    <div className="bg-[#18A66D]/15 border border-[#18A66D]/25 text-[#4AE89B] text-xs font-bold px-3 py-1.5 rounded-full">✓ {r.result}</div>
                    <div className="text-[#F59E0B] text-sm">{"★".repeat(r.stars)}</div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6 italic">„{r.text}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#18A66D] to-[#0A7A4F] text-white flex items-center justify-center rounded-full text-sm font-black shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{r.name}</div>
                      <div className="text-xs text-white/30">{r.role} · {r.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="preise" className="bg-white py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Preise</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] leading-[1.1] mb-4">
                Einfach. Transparent.<br />Ohne Überraschungen.
              </h2>
              <p className="text-[#6B7280] text-lg">Wählen Sie das Paket passend zu Ihrem Terminvolumen. Monatlich kündbar.</p>
            </div>

            {/* ROI callout */}
            <div className="max-w-2xl mx-auto mb-14">
              <div className="bg-[#F0F9F4] border border-[#18A66D]/20 rounded-2xl px-7 py-5 flex items-center gap-5">
                <div className="text-3xl shrink-0">💡</div>
                <div>
                  <div className="font-bold text-[#0C1A14] mb-1">Zur Einordnung</div>
                  <div className="text-sm text-[#6B7280] leading-relaxed">
                    Schon <strong className="text-[#0C1A14]">2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig –
                    alles darüber ist direkter Gewinn für Ihren Betrieb.
                  </div>
                </div>
              </div>
            </div>

            {/* 3 plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? "plan-popular-border shadow-2xl shadow-[#18A66D]/15"
                      : "bg-[#F7FAFB] border border-[#E8EDF0] hover:border-[#18A66D]/30 hover:shadow-xl hover:-translate-y-1"
                  }`}
                  style={plan.popular ? { background: "#0C1A14" } : {}}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#18A66D] text-white text-[11px] font-bold px-5 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-[#18A66D]/30">
                      ✓ Meistgewählt
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${plan.popular ? "text-[#18A66D]" : "text-[#9CA3AF]"}`}>
                      {plan.name}
                    </div>
                    <div className={`text-5xl font-black mb-1 ${plan.popular ? "text-white" : "text-[#0C1A14]"}`}>
                      €{plan.price}
                      <span className={`text-base font-normal ml-1 ${plan.popular ? "text-white/35" : "text-[#9CA3AF]"}`}>/Monat</span>
                    </div>
                    <div className={`text-sm ${plan.popular ? "text-white/40" : "text-[#9CA3AF]"}`}>
                      {plan.sms} · €{plan.perDay}/Tag
                    </div>
                  </div>

                  <div className="space-y-2.5 flex-1 mb-8">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <span className="text-[#18A66D] text-sm shrink-0">✓</span>
                        <span className={`text-sm ${plan.popular ? "text-white/75" : "text-[#6B7280]"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="/lead"
                    className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all ${
                      plan.popular
                        ? "grad-btn text-white hover:opacity-90 shadow-lg shadow-[#18A66D]/30"
                        : "bg-white border border-[#E8EDF0] text-[#0C1A14] hover:border-[#18A66D] hover:text-[#18A66D] hover:shadow-md"
                    }`}
                  >
                    Jetzt anfragen →
                  </a>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-[#9CA3AF]">
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar, kein Vertrag
            </p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="bg-[#F7FAFB] py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <div className="text-center mb-14">
              <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">FAQ</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0C1A14] mb-4">Häufige Fragen.</h2>
              <p className="text-[#6B7280]">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-[#E8EDF0] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 hover:bg-[#F7FAFB] transition-colors"
                  >
                    <span className="font-semibold text-[#0C1A14] text-sm leading-snug">{faq.q}</span>
                    <span className={`text-[#18A66D] text-2xl shrink-0 transition-transform duration-300 font-light leading-none ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-7 pb-6 pt-4 text-sm text-[#6B7280] leading-relaxed border-t border-[#F0F4F0]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="relative overflow-hidden bg-[#050D08] py-36">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[500px] rounded-full opacity-25 animate-float"
              style={{ background: "radial-gradient(ellipse, #18A66D 0%, transparent 65%)" }} />
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#18A66D]/12 border border-[#18A66D]/20 text-[#4AE89B] text-xs font-semibold px-5 py-2.5 rounded-full mb-10">
              ✓ Kostenlos · Unverbindlich · 15 Minuten
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
              Hören Sie auf,<br />
              <span className="shimmer-text">Geld zu verlieren.</span>
            </h2>
            <p className="text-white/40 text-xl leading-relaxed mb-12 max-w-xl mx-auto">
              Ein 15-minütiges Gespräch – und Sie wissen, was TerminStop
              konkret für Ihren Betrieb bedeutet.
            </p>
            <a href="/lead"
              className="grad-btn animate-glow inline-flex items-center gap-3 text-white font-bold px-12 py-5 rounded-full hover:opacity-90 transition-opacity shadow-2xl shadow-[#18A66D]/40 text-base">
              Jetzt kostenloses Gespräch sichern →
            </a>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/25 text-sm">
              <span>✓ Kein Vertrag</span>
              <span>✓ Persönliches Gespräch</span>
              <span>✓ Klare Antworten</span>
              <span>✓ Sofort startklar</span>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-[#050D08] border-t border-white/6 py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-base font-bold">
                <span className="text-[#18A66D]">Termin</span>
                <span className="text-white">Stop</span>
              </span>
              <p className="text-xs text-white/20 mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
            </div>
            <div className="flex gap-6 text-xs text-white/25">
              <a href="/impressum" className="hover:text-white/60 transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-white/60 transition-colors">Datenschutz</a>
              <a href="/agb" className="hover:text-white/60 transition-colors">AGB</a>
              <a href="/avv" className="hover:text-white/60 transition-colors">AVV</a>
              <a href="/login" className="hover:text-white/60 transition-colors">Login</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
