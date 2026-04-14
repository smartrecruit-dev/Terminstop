"use client"

import { useState, useEffect, useRef } from "react"

/* ─── Animated Counter ──────────────────────────────────────── */
function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Scroll Reveal ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroWord, setHeroWord] = useState(0)
  const words = ["Friseur.", "Werkstatt.", "Praxis.", "Betrieb."]

  useEffect(() => {
    const t = setInterval(() => setHeroWord(w => (w + 1) % words.length), 2600)
    return () => clearInterval(t)
  }, [])

  const reviews = [
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle" },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h / Woche" },
    { text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.", name: "Dr. Andreas B.", role: "Physiotherapiepraxis", city: "Berlin", result: "Keine Absagen mehr" },
    { text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.", name: "Markus S.", role: "KFZ-Werkstatt", city: "Stuttgart", result: "+18% Auslastung" },
  ]

  const faqs = [
    { q: "Ist TerminStop nur für SMS-Erinnerungen?", a: "Nein – SMS-Erinnerungen sind nur eine von vier Funktionen. TerminStop ist Ihr komplettes digitales Terminbüro: mit digitalem Kalender, Kundenkartei mit vollständiger Terminhistorie, automatischen SMS-Erinnerungen und Auswertungen über Ihre Entwicklung. Alles in einem System, ab €1,30 pro Tag." },
    { q: "Muss ich eine App installieren oder etwas technisch einrichten?", a: "Nein. TerminStop läuft komplett im Browser – keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich." },
    { q: "Was kostet TerminStop monatlich?", a: "Das hängt davon ab, wie viele Termine Sie im Monat haben. Unser Einstieg liegt bei €1,30 pro Tag – die meisten Betriebe zahlen zwischen €39 und €109 pro Monat. Im kurzen Erstgespräch finden wir gemeinsam das passende Paket. Kein Vertrag, monatlich kündbar." },
    { q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?", a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe – keine Vorkenntnisse nötig." },
    { q: "Was passiert, wenn ein Kunde nicht auf die SMS antwortet?", a: "Das System erinnert trotzdem – und Sie sehen in der Übersicht, wer bestätigt hat und wer nicht. So können Sie gezielt reagieren, bevor es zu einem Ausfall kommt." },
    { q: "Wie lange dauert es, bis ich erste Ergebnisse sehe?", a: "Die meisten Kunden berichten bereits nach der ersten Woche von weniger Ausfällen. Die Erinnerungen wirken sofort." },
    { q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?", a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes." },
  ]

  const tiers = [
    {
      name: "Einsteiger",
      for: "Für Betriebe bis ca. 100 Termine / Monat",
      tag: null,
      dark: false,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"],
    },
    {
      name: "Wachstum",
      for: "Für Betriebe mit 100–400 Terminen / Monat",
      tag: "✓ Meistgewählt",
      dark: true,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"],
    },
    {
      name: "Profi",
      for: "Für stark ausgelastete Betriebe",
      tag: null,
      dark: false,
      features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"],
    },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  const compRows = [
    { label:"Kosten",               them:"15–30 % Provision pro Buchung",   us:"Ab €1,30 / Tag — individuell" },
    { label:"Vertragslaufzeit",      them:"Oft 12+ Monate gebunden",         us:"Monatlich kündbar" },
    { label:"Ihre Kundendaten",      them:"Gehören der Plattform",           us:"Gehören ausschließlich Ihnen" },
    { label:"SMS-Erinnerungen",      them:"✗ Nicht enthalten",               us:"✓ Vollautomatisch" },
    { label:"Eigene Kundenkartei",   them:"✗ Nicht enthalten",               us:"✓ Mit Verlauf & Notizen" },
    { label:"Auswertungen",          them:"Kaum / eingeschränkt",            us:"✓ Vollständig inklusive" },
    { label:"Kundenbindung",         them:"Kunden vergleichen Preise",       us:"Direktkontakt — kein Vergleich" },
  ]

  const F = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"

  return (
    <>
      <style>{`
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(8px); }
          12%, 88% { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-8px); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-14px); }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(1); opacity:.5; }
          100% { transform:scale(2.2); opacity:0; }
        }
        @keyframes marquee {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        .float-phone { animation: float 8s ease-in-out infinite; }
        .pulse-ring  { position:absolute; inset:0; border-radius:50%; background:rgba(24,166,109,.2); animation:pulse-ring 2.2s cubic-bezier(0,.2,.2,1) infinite; }
        .marquee-wrap { animation: marquee 32s linear infinite; }
        .word-slot { animation: wordIn 2.6s ease-in-out; }
        .badge-pill { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,.1); border-radius:980px; padding:5px 14px; margin-bottom:32px; background:rgba(255,255,255,.04); max-width:100%; flex-wrap:wrap; }
        @media(max-width:600px){ .badge-pill { font-size:11px; padding:5px 10px; } }

        /* Buttons */
        .btn-primary {
          display:inline-flex; align-items:center; justify-content:center;
          background:#18A66D; color:#fff; border:none; border-radius:980px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition:background .18s, box-shadow .18s;
          box-shadow:0 2px 12px rgba(24,166,109,.28);
        }
        .btn-primary:hover { background:#149A60; box-shadow:0 4px 20px rgba(24,166,109,.38); }

        .btn-ghost {
          display:inline-flex; align-items:center; justify-content:center;
          background:transparent; color:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.14);
          border-radius:980px; font-weight:600; cursor:pointer; text-decoration:none;
          transition:color .18s, border-color .18s, background .18s;
        }
        .btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,.35); background:rgba(255,255,255,.05); }

        .btn-outline {
          display:inline-flex; align-items:center; justify-content:center;
          background:transparent; color:#374151; border:1px solid #E5E7EB;
          border-radius:980px; font-weight:600; cursor:pointer; text-decoration:none;
          transition:border-color .18s, color .18s, background .18s;
        }
        .btn-outline:hover { border-color:#18A66D; color:#18A66D; background:#F0FBF5; }

        /* Accordion */
        .faq-item { border-bottom:1px solid #F3F4F6; }
        .faq-item:first-child { border-top:1px solid #F3F4F6; }

        /* Mobile layout */
        @media(max-width:768px){
          .sec-pad{padding-top:64px!important;padding-bottom:64px!important;padding-left:20px!important;padding-right:20px!important}
          .hero-phone-hide{display:none!important}
          .showcase-phone-hide{display:none!important}
        }
      `}</style>

      <div style={{ fontFamily: F, color: "#0B0D14" }}>

        {/* ══ NAVBAR ══ */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:50,
          height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px",
          background:"rgba(255,255,255,.88)", backdropFilter:"blur(20px) saturate(180%)",
          borderBottom:"1px solid rgba(0,0,0,.07)",
        }}>
          <a href="/" style={{ textDecoration:"none", fontSize:17, fontWeight:800, letterSpacing:"-0.5px" }}>
            <span style={{ color:"#18A66D" }}>Termin</span>
            <span style={{ color:"#0B0D14" }}>Stop</span>
          </a>
          <div style={{ display:"flex", alignItems:"center", gap:28 }}>
            <a href="#wie-es-funktioniert" style={{ fontSize:13, color:"#6B7280", textDecoration:"none", fontWeight:500 }} className="hidden md:block">So funktioniert's</a>
            <a href="#preise" style={{ fontSize:13, color:"#6B7280", textDecoration:"none", fontWeight:500 }} className="hidden md:block">Preise</a>
            <a href="/login" style={{ fontSize:13, color:"#6B7280", textDecoration:"none", fontWeight:500 }} className="hidden md:block">Login</a>
            <a href="/demo" style={{ fontSize:13, color:"#6B7280", textDecoration:"none", fontWeight:500, padding:"6px 16px", border:"1px solid #E5E7EB", borderRadius:980 }} className="hidden md:block">Demo</a>
            {/* Login-Button nur auf Mobile */}
            <a href="/login" className="block md:hidden" style={{ fontSize:13, color:"#6B7280", textDecoration:"none", fontWeight:600, padding:"6px 14px", border:"1px solid #E5E7EB", borderRadius:980, background:"rgba(255,255,255,.9)" }}>Login</a>
            <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"8px 20px" }}>Kostenlos anfragen</a>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section style={{
          minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
          background:"linear-gradient(170deg,#06091A 0%,#080C1E 55%,#09101F 100%)",
          paddingTop:52, overflow:"hidden", position:"relative",
        }}>
          {/* single soft glow */}
          <div style={{
            position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)",
            width:600, height:480, borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(24,166,109,.09) 0%,transparent 68%)",
            pointerEvents:"none",
          }} />

          <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 32px", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="hero-grid">
            <style>{`.hero-grid{grid-template-columns:1fr 1fr} @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;text-align:center}.hero-btns{justify-content:center!important}.hero-stats{justify-content:center!important}}`}</style>

            {/* LEFT */}
            <div>
              {/* badge */}
              <div className="badge-pill">
                <span style={{ position:"relative", display:"flex", width:7, height:7, flexShrink:0 }}>
                  <span className="pulse-ring" />
                  <span style={{ position:"relative", display:"inline-flex", borderRadius:"50%", width:7, height:7, background:"#18A66D" }} />
                </span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,.45)", fontWeight:600, letterSpacing:.2 }}>
                  Digitales Terminbüro für Ihren&nbsp;<span style={{ color:"#18A66D", fontWeight:800, display:"inline-block" }} key={heroWord} className="word-slot">{words[heroWord]}</span>
                </span>
              </div>

              {/* headline */}
              <h1 style={{ fontSize:"clamp(40px,5vw,72px)", fontWeight:900, lineHeight:1.04, letterSpacing:"-2px", color:"#fff", margin:"0 0 24px" }}>
                Ihr Betrieb.<br />
                Digital.<br />
                <span style={{ color:"#18A66D" }}>Automatisch.</span>
              </h1>

              <p style={{ fontSize:18, color:"rgba(255,255,255,.42)", lineHeight:1.65, maxWidth:420, margin:"0 0 40px" }}>
                TerminStop ist Ihr komplettes digitales Terminbüro — mit Kalender, Kundenkartei, automatischen SMS-Erinnerungen und Auswertungen. Alles in einem. In 10 Minuten eingerichtet.
              </p>

              <div className="hero-btns" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:52 }}>
                <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 32px" }}>Kostenlose Beratung →</a>
                <a href="/demo" className="btn-ghost" style={{ fontSize:15, padding:"14px 28px" }}>Live-Demo ansehen</a>
              </div>

              {/* stats */}
              <div className="hero-stats" style={{ display:"flex", gap:40, paddingTop:32, borderTop:"1px solid rgba(255,255,255,.07)" }}>
                {[
                  { to:50, suffix:"+", label:"Betriebe aktiv" },
                  { to:95, suffix:"%", label:"Weniger Ausfälle" },
                  { to:10, suffix:" Min.", label:"Einrichtung" },
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-1px" }}><Counter to={s.to} suffix={s.suffix} /></div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.28)", marginTop:2, fontWeight:500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – phone */}
            <div style={{ display:"flex", justifyContent:"flex-end" }} className="hero-phone-hide">
              <div className="float-phone" style={{ position:"relative" }}>
                <div style={{
                  position:"absolute", inset:-40, borderRadius:"50%",
                  background:"radial-gradient(ellipse,rgba(24,166,109,.11) 0%,transparent 65%)",
                  pointerEvents:"none",
                }} />
                <div style={{
                  background:"#070F09", padding:14, borderRadius:50,
                  border:"1px solid rgba(24,166,109,.14)",
                  boxShadow:"0 48px 96px rgba(0,0,0,.55), 0 0 0 1px rgba(24,166,109,.08) inset",
                }}>
                  <div style={{ width:290, height:590, borderRadius:38, overflow:"hidden", background:"linear-gradient(180deg,#0a1a0d 0%,#060d08 100%)" }}>
                    {/* status bar */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 12px" }}>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600 }}>9:41</span>
                      <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:14, width:54, height:18, background:"#000", borderRadius:9 }} />
                      <div style={{ width:16, height:7, borderRadius:2, border:"1px solid rgba(255,255,255,.2)", position:"relative" }}>
                        <div style={{ position:"absolute", left:2, top:2, bottom:2, width:"75%", background:"#18A66D", borderRadius:1 }} />
                      </div>
                    </div>
                    {/* notification */}
                    <div style={{ margin:"0 12px 12px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", borderRadius:18, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:40, height:40, background:"#18A66D", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"#fff", fontWeight:900, fontSize:15 }}>T</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#fff" }}>TerminStop</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div style={{ width:8, height:8, background:"#18A66D", borderRadius:"50%" }} />
                    </div>
                    {/* chat */}
                    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
                      <div style={{ background:"#18A66D", color:"#fff", fontSize:12, lineHeight:1.65, borderRadius:"18px 18px 18px 4px", padding:"14px 16px", maxWidth:"88%", boxShadow:"0 6px 20px rgba(24,166,109,.25)" }}>
                        Hallo Frau Schmidt 👋<br /><br />
                        Sie haben morgen,<br /><strong>Dienstag um 14:00 Uhr</strong><br />einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span style={{ fontSize:10, color:"rgba(255,255,255,.45)" }}>– Friseurstudio Elegance</span>
                      </div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,.2)", paddingLeft:4 }}>✓✓ Zugestellt · 24h vorher</div>
                      <div style={{ display:"flex", justifyContent:"flex-end" }}>
                        <div style={{ background:"rgba(255,255,255,.09)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.8)", fontSize:12, lineHeight:1.6, borderRadius:"18px 18px 4px 18px", padding:"12px 14px", maxWidth:"78%" }}>
                          Danke! Bin pünktlich da 🙂
                        </div>
                      </div>
                    </div>
                    {/* confirmed */}
                    <div style={{ position:"absolute", bottom:20, left:12, right:12 }}>
                      <div style={{ background:"rgba(24,166,109,.12)", border:"1px solid rgba(24,166,109,.22)", borderRadius:18, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:32, height:32, background:"#18A66D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ color:"#fff", fontSize:14 }}>✓</span>
                        </div>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#4AE89B" }}>Termin bestätigt</div>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>Kundin erscheint pünktlich</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ INDUSTRY STRIP ══ */}
        <section style={{ background:"#fff", borderTop:"1px solid #F3F4F6", borderBottom:"1px solid #F3F4F6", padding:"14px 0", overflow:"hidden" }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-wrap" style={{ display:"flex", gap:48, flexShrink:0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <div style={{ width:5, height:5, background:"#18A66D", borderRadius:"50%", opacity:.7 }} />
                  <span style={{ fontSize:13, color:"#9CA3AF", fontWeight:500, whiteSpace:"nowrap" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROBLEM ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:560, marginBottom:64 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 18px" }}>
                  Zettelwirtschaft, Telefonate,<br />No-Shows. Täglich.
                </h2>
                <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, margin:0 }}>
                  Kein Überblick über Kunden, kein digitaler Kalender, kein System — und dazu noch Kunden, die einfach nicht erscheinen. Das kostet Sie jeden Tag Zeit und Geld.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", border:"1px solid #F3F4F6", borderRadius:20, overflow:"hidden" }} className="stat-grid">
              <style>{`.stat-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:700px){.stat-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { to:50, suffix:"€", pre:"", label:"Verlust pro Ausfall", desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet." },
                { to:9,  suffix:"×", pre:"bis ", label:"Ausfälle pro Woche", desc:"Im Schnitt erlebt jeder Betrieb mehrfach pro Woche Ausfälle." },
                { to:2000, suffix:"€+", pre:"bis ", label:"Verlust pro Monat", desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ padding:"48px 40px", background:"#fff", borderRight: i < 2 ? "1px solid #F3F4F6" : "none" }} className={i < 2 ? "stat-item-border" : ""}>
                    <div style={{ fontSize:52, fontWeight:900, color:"#0B0D14", marginBottom:10, letterSpacing:"-2px", fontVariantNumeric:"tabular-nums" }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#0B0D14", marginBottom:6 }}>{item.label}</div>
                    <div style={{ fontSize:14, color:"#9CA3AF", lineHeight:1.6 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150}>
              <div style={{ marginTop:20, background:"#06091A", borderRadius:20, padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:4 }}>Die Lösung? Automatisch. Einmal einrichten. Fertig.</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:14 }}>Kein Aufwand, keine Technik-Kenntnisse. Läuft dauerhaft von selbst.</div>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:14, padding:"12px 28px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="wie-es-funktioniert" className="sec-pad" style={{ background:"#F9FAFB", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:520, marginBottom:64 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>So funktioniert's</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 18px" }}>
                  Drei Schritte.<br />Dann läuft es.
                </h2>
                <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, margin:0 }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { num:"01", title:"Einmalig einrichten – in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein: Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive – kein technisches Vorwissen nötig.", tag:"Persönliche Begleitung" },
                { num:"02", title:"Ihr digitales Büro läuft – sofort und vollautomatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen automatisch raus – 24h vor jedem Termin, mit Ihrem Namen. Sie sehen auf einen Blick, wer bestätigt hat und wer nicht.", tag:"Alles in einem" },
                { num:"03", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. Kein Hinterhertelefonieren, keine Zettelwirtschaft – TerminStop arbeitet dauerhaft für Sie im Hintergrund.", tag:"95 % Erfolgsquote" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ background:"#fff", border:"1px solid #F3F4F6", borderRadius:18, padding:"32px 36px", display:"flex", gap:32, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ fontSize:64, fontWeight:900, lineHeight:1, color:"rgba(24,166,109,.1)", flexShrink:0, width:80, textAlign:"center", userSelect:"none" }}>{s.num}</div>
                    <div>
                      <span style={{ display:"inline-block", background:"#F0FBF5", border:"1px solid rgba(24,166,109,.2)", color:"#18A66D", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:980, marginBottom:12 }}>{s.tag}</span>
                      <h3 style={{ fontSize:18, fontWeight:800, color:"#0B0D14", margin:"0 0 10px", letterSpacing:"-0.3px" }}>{s.title}</h3>
                      <p style={{ fontSize:15, color:"#6B7280", lineHeight:1.65, margin:0 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4 FEATURE PILLARS ══ */}
        <section className="sec-pad" style={{ background:"#F9FAFB", padding:"100px 32px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:580, margin:"0 auto 64px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Alles inklusive</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 16px" }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, margin:0 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe — und gibt Ihnen dabei mehr Einblick als je zuvor.
                </p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gap:20 }} className="features4-grid">
              <style>{`.features4-grid{grid-template-columns:repeat(2,1fr)} @media(max-width:700px){.features4-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { icon:"📅", title:"Digitaler Kalender", tag:"Notizbuch adé", desc:"Tag- und Wochenübersicht für alle Termine. Auf dem Handy, Tablet oder PC — immer aktuell, immer dabei. Nie wieder Zettelwirtschaft." },
                { icon:"👥", title:"Kundenkartei", tag:"Voller Überblick", desc:"Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist — und wer nicht." },
                { icon:"📱", title:"Automatische SMS-Erinnerungen", tag:"Vollautomatisch", desc:"24h vor jedem Termin geht automatisch eine personalisierte SMS raus — ohne Ihr Zutun. Nie wieder hinterhertelefonieren." },
                { icon:"📊", title:"Auswertungen & Einblicke", tag:"Datengestützt", desc:"Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb endlich schwarz auf weiß." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div style={{ background:"#fff", border:"1px solid #F3F4F6", borderRadius:20, padding:"32px", boxShadow:"0 1px 4px rgba(0,0,0,.04)", height:"100%", boxSizing:"border-box" as any }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                      <div style={{ width:48, height:48, background:"#F0FBF5", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{f.icon}</div>
                      <div>
                        <span style={{ display:"inline-block", background:"#F0FBF5", border:"1px solid rgba(24,166,109,.2)", color:"#18A66D", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:980, marginBottom:6 }}>{f.tag}</span>
                        <h3 style={{ fontSize:16, fontWeight:800, color:"#0B0D14", margin:0, letterSpacing:"-0.2px" }}>{f.title}</h3>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, margin:0 }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={100}>
              <div style={{ marginTop:24, background:"#06091A", borderRadius:20, padding:"24px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" as any }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:40, height:40, background:"rgba(24,166,109,.15)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ color:"#18A66D", fontWeight:900, fontSize:18 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:2 }}>Alles in einem Paket — keine versteckten Extras.</div>
                    <div style={{ color:"rgba(255,255,255,.35)", fontSize:13 }}>Kalender + Kundenkartei + SMS + Auswertungen · ab €1,30/Tag</div>
                  </div>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:14, padding:"12px 24px", flexShrink:0 }}>Kostenlos anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ PRODUCT SHOWCASE ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="showcase-grid">
            <style>{`.showcase-grid{grid-template-columns:1fr 1fr} @media(max-width:900px){.showcase-grid{grid-template-columns:1fr!important}}`}</style>

            {/* phone */}
            <div style={{ display:"flex", justifyContent:"center" }} className="showcase-phone-hide">
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", inset:-32, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(24,166,109,.06) 0%,transparent 70%)", pointerEvents:"none" }} />
                <div style={{ background:"#02060A", padding:12, borderRadius:44, border:"1px solid rgba(24,166,109,.1)", boxShadow:"0 32px 64px rgba(0,0,0,.12)" }}>
                  <div style={{ width:280, height:565, borderRadius:34, overflow:"hidden", background:"#fff" }}>
                    <div style={{ background:"#18A66D", padding:"32px 20px 24px" }}>
                      <div style={{ color:"rgba(255,255,255,.6)", fontSize:11, marginBottom:4, fontWeight:500 }}>Guten Morgen 👋</div>
                      <div style={{ color:"#fff", fontWeight:900, fontSize:20, marginBottom:12 }}>Heute, 6 Termine</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,.15)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,.85)", fontSize:11, fontWeight:600 }}>5 ✓ bestätigt</div>
                        <div style={{ background:"rgba(255,255,255,.08)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,.5)", fontSize:11 }}>1 ausstehend</div>
                      </div>
                    </div>
                    <div style={{ margin:"0 16px", marginTop:-16, background:"#fff", borderRadius:16, padding:16, border:"1px solid #F3F4F6", boxShadow:"0 4px 16px rgba(0,0,0,.07)", marginBottom:12 }}>
                      <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:4, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>Nächster Termin</div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#0B0D14" }}>Maria Schmidt</div>
                      <div style={{ fontSize:12, color:"#6B7280" }}>14:00 Uhr · Damenhaarschnitt</div>
                      <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:6, height:6, background:"#18A66D", borderRadius:"50%" }} />
                        <span style={{ fontSize:10, color:"#18A66D", fontWeight:600 }}>SMS gesendet ✓</span>
                      </div>
                    </div>
                    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:6 }}>
                      {[
                        { time:"09:00", name:"Thomas B.", s:"✓", c:"#18A66D" },
                        { time:"10:30", name:"Anna L.", s:"✓", c:"#18A66D" },
                        { time:"12:00", name:"Klaus M.", s:"✓", c:"#18A66D" },
                        { time:"14:00", name:"Maria S.", s:"→", c:"#F59E0B" },
                        { time:"16:00", name:"Peter H.", s:"○", c:"#D1D5DB" },
                      ].map((a, j) => (
                        <div key={j} style={{ display:"flex", alignItems:"center", gap:12, background:"#F9FAFB", borderRadius:12, padding:"10px 12px" }}>
                          <span style={{ fontSize:11, color:"#9CA3AF", width:36, flexShrink:0, fontWeight:500 }}>{a.time}</span>
                          <span style={{ fontSize:11, color:"#0B0D14", fontWeight:500, flex:1 }}>{a.name}</span>
                          <span style={{ fontSize:13, fontWeight:700, color:a.c }}>{a.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Reveal delay={80}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Das Dashboard</div>
                <h2 style={{ fontSize:"clamp(28px,3.5vw,46px)", fontWeight:900, letterSpacing:"-1.2px", lineHeight:1.1, margin:"0 0 16px" }}>Alles im Blick.<br />Nichts verpassen.</h2>
                <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, marginBottom:40 }}>Ihr komplettes Terminmanagement an einem Ort – übersichtlich, einfach, immer aktuell.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  {[
                    { title:"Tagesübersicht auf einen Blick", desc:"Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                    { title:"Automatische SMS-Erinnerungen", desc:"24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                    { title:"Kundenkartei", desc:"Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                    { title:"Auswertungen & Einblicke", desc:"Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
                  ].map((f, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                      <div style={{ width:6, height:6, background:"#18A66D", borderRadius:"50%", marginTop:8, flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:700, color:"#0B0D14", marginBottom:3, fontSize:15 }}>{f.title}</div>
                        <div style={{ fontSize:14, color:"#6B7280", lineHeight:1.6 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ COMPETITOR COMPARISON ══ */}
        <section style={{ background:"#06091A", padding:"100px 32px" }} className="sec-pad">
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:580, margin:"0 auto 56px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Der Vergleich</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, color:"#fff", letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px" }}>
                  Was andere kosten.<br /><span style={{ color:"#18A66D" }}>Was Sie bekommen.</span>
                </h2>
                <p style={{ fontSize:16, color:"rgba(255,255,255,.32)", margin:0 }}>
                  Buchungsportale & Marktplätze klingen verlockend — bis man genau hinschaut.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              {/* ── Desktop Table (hidden on mobile) ── */}
              <div className="comp-desktop">
                <style>{`.comp-desktop{display:block} @media(max-width:600px){.comp-desktop{display:none!important}}`}</style>
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                    <div style={{ padding:"18px 24px" }} />
                    <div style={{ padding:"18px 16px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:13, color:"rgba(255,255,255,.3)", fontWeight:600 }}>Klassische Portale</span>
                    </div>
                    <div style={{ padding:"18px 16px", textAlign:"center", background:"rgba(24,166,109,.07)", borderLeft:"1px solid rgba(24,166,109,.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:14, fontWeight:800, color:"#4AE89B" }}>TerminStop ✓</span>
                    </div>
                  </div>
                  {compRows.map((row, i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr", borderBottom: i < compRows.length-1 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                      <div style={{ padding:"15px 24px", display:"flex", alignItems:"center" }}>
                        <span style={{ fontSize:13, color:"rgba(255,255,255,.4)", fontWeight:500 }}>{row.label}</span>
                      </div>
                      <div style={{ padding:"15px 16px", borderLeft:"1px solid rgba(255,255,255,.04)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,.22)", lineHeight:1.5, textAlign:"center" as any }}>{row.them}</span>
                      </div>
                      <div style={{ padding:"15px 16px", background:"rgba(24,166,109,.04)", borderLeft:"1px solid rgba(24,166,109,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:12, color:"rgba(74,232,155,.9)", fontWeight:600, lineHeight:1.5, textAlign:"center" as any }}>{row.us}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Mobile Cards (hidden on desktop) ── */}
              <div className="comp-mobile">
                <style>{`.comp-mobile{display:none} @media(max-width:600px){.comp-mobile{display:block}}`}</style>
                {/* Column labels */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                  <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"11px", textAlign:"center" as any }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,.3)", fontWeight:600 }}>Klassische Portale</span>
                  </div>
                  <div style={{ background:"rgba(24,166,109,.1)", border:"1px solid rgba(24,166,109,.25)", borderRadius:12, padding:"11px", textAlign:"center" as any }}>
                    <span style={{ fontSize:13, fontWeight:800, color:"#4AE89B" }}>TerminStop ✓</span>
                  </div>
                </div>
                {/* Each category as a card */}
                <div style={{ display:"flex", flexDirection:"column" as any, gap:10 }}>
                  {compRows.map((row, i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"14px 16px" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase" as any, letterSpacing:1.5, marginBottom:10 }}>{row.label}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:"10px 12px" }}>
                          <span style={{ fontSize:12, color:"rgba(255,255,255,.25)", lineHeight:1.5 }}>{row.them}</span>
                        </div>
                        <div style={{ background:"rgba(24,166,109,.07)", border:"1px solid rgba(24,166,109,.15)", borderRadius:10, padding:"10px 12px" }}>
                          <span style={{ fontSize:12, color:"rgba(74,232,155,.9)", fontWeight:600, lineHeight:1.5 }}>{row.us}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ marginTop:24, display:"flex", flexDirection:"column" as any, alignItems:"center", gap:16, textAlign:"center" as any }}>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.22)", margin:0 }}>
                  Bei 100 Buchungen/Monat à €50 zahlen Sie über ein Buchungsportal bis zu <strong style={{ color:"rgba(255,255,255,.45)" }}>€1.500 Provision</strong>. TerminStop kostet <strong style={{ color:"#4AE89B" }}>ab €1,30 / Tag</strong>.
                </p>
                <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 32px" }}>Jetzt wechseln →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:60 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Echte Ergebnisse</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 10px" }}>Was Betriebe berichten.</h2>
                <p style={{ fontSize:16, color:"#9CA3AF", margin:0 }}>Keine Versprechen – nur echte Erfahrungen.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="reviews-grid">
              <style>{`.reviews-grid{grid-template-columns:1fr 1fr} @media(max-width:700px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ background:"#fff", border:"1px solid #F3F4F6", borderRadius:20, padding:"32px", display:"flex", flexDirection:"column", height:"100%", boxShadow:"0 1px 4px rgba(0,0,0,.04)", transition:"box-shadow .2s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                      <div style={{ background:"#F0FBF5", color:"#18A66D", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:980 }}>✓ {r.result}</div>
                      <div style={{ color:"#FBBF24", fontSize:12, letterSpacing:1 }}>★★★★★</div>
                    </div>
                    <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, flex:1, marginBottom:24, fontStyle:"italic" }}>„{r.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:20, borderTop:"1px solid #F9FAFB" }}>
                      <div style={{ width:36, height:36, background:"linear-gradient(135deg,#18A66D,#0A7A4F)", color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, flexShrink:0 }}>{r.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#0B0D14" }}>{r.name}</div>
                        <div style={{ fontSize:12, color:"#9CA3AF" }}>{r.role} · {r.city}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="preise" className="sec-pad" style={{ background:"#F9FAFB", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:600, margin:"0 auto 16px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Ihr Paket</div>
                <h2 style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px" }}>Individuell angepasst.<br />Passend für Ihren Betrieb.</h2>
                <p style={{ fontSize:16, color:"#6B7280", margin:0, lineHeight:1.6 }}>
                  Kein Einheitspaket. Wir schauen gemeinsam, wie viele Termine Sie haben —<br className="hidden md:block" /> und finden das Paket, das sich ab dem ersten Monat rechnet.
                </p>
              </div>
            </Reveal>

            {/* Anchor: ab €1,30 / Tag */}
            <Reveal delay={60}>
              <div style={{ display:"flex", justifyContent:"center", margin:"32px 0 48px" }}>
                <div style={{ background:"#fff", border:"1px solid rgba(24,166,109,.2)", borderRadius:20, padding:"20px 32px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#9CA3AF", marginBottom:4 }}>Einstieg bereits</div>
                    <div style={{ fontSize:36, fontWeight:900, color:"#0B0D14", letterSpacing:"-1px", lineHeight:1 }}>ab €1,30 <span style={{ fontSize:16, fontWeight:600, color:"#9CA3AF" }}>/ Tag</span></div>
                    <div style={{ fontSize:12, color:"#9CA3AF", marginTop:4 }}>Monatlich kündbar · Kein Vertrag</div>
                  </div>
                  <div style={{ width:1, height:52, background:"#E5E7EB" }} />
                  <div style={{ fontSize:13, color:"#6B7280", maxWidth:220, lineHeight:1.55 }}>
                    Schon <strong style={{ color:"#0B0D14" }}>2–3 verhinderte Ausfälle</strong> decken das Paket vollständig ab.
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Tier cards */}
            <div style={{ display:"grid", gap:16, alignItems:"start" }} className="pricing-grid">
              <style>{`.pricing-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
              {tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 70}>
                  {tier.dark ? (
                    <div style={{ background:"#06091A", border:"1.5px solid rgba(24,166,109,.3)", borderRadius:20, padding:"32px 28px", position:"relative", boxShadow:"0 16px 48px rgba(24,166,109,.1)" }}>
                      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"#18A66D", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 16px", borderRadius:980, whiteSpace:"nowrap" }}>{tier.tag}</div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(74,232,155,.8)", marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginBottom:24, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,.08)" }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#4AE89B", fontSize:13, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:"rgba(255,255,255,.65)" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-primary" style={{ display:"block", textAlign:"center", fontSize:14, padding:"14px 0", borderRadius:12, width:"100%", boxSizing:"border-box" }}>Passendes Paket anfragen →</a>
                    </div>
                  ) : (
                    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:20, padding:"32px 28px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#9CA3AF", marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:"#9CA3AF", marginBottom:24, paddingBottom:20, borderBottom:"1px solid #F3F4F6" }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#18A66D", fontSize:13, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:"#6B7280" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-outline" style={{ display:"block", textAlign:"center", fontSize:14, padding:"14px 0", borderRadius:12, width:"100%", boxSizing:"border-box" }}>Passendes Paket anfragen →</a>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p style={{ textAlign:"center", fontSize:13, color:"#9CA3AF", marginTop:28, lineHeight:1.7 }}>
                Die meisten Betriebe zahlen zwischen <strong style={{ color:"#6B7280" }}>€39 und €109 / Monat</strong> · Monatlich kündbar · Alle Preise sind Endpreise
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:56 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>FAQ</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 10px" }}>Häufige Fragen.</h2>
                <p style={{ fontSize:16, color:"#9CA3AF", margin:0 }}>Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width:"100%", textAlign:"left", padding:"22px 0", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, background:"none", border:"none", cursor:"pointer" }}
                  >
                    <span style={{ fontSize:15, fontWeight:600, color:"#0B0D14", lineHeight:1.5 }}>{faq.q}</span>
                    <span style={{ color:"#18A66D", fontSize:22, flexShrink:0, fontWeight:300, lineHeight:1, transform: openFaq === i ? "rotate(45deg)" : "none", transition:"transform .25s" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom:22, fontSize:14, color:"#6B7280", lineHeight:1.7, paddingRight:32 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="sec-pad" style={{ background:"linear-gradient(170deg,#06091A 0%,#080C1E 100%)", padding:"120px 32px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(24,166,109,.08) 0%,transparent 65%)", pointerEvents:"none" }} />
          <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", position:"relative" }}>
            <Reveal>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(24,166,109,.08)", border:"1px solid rgba(24,166,109,.18)", color:"rgba(74,232,155,.85)", fontSize:12, fontWeight:600, padding:"7px 18px", borderRadius:980, marginBottom:36 }}>
                ✓ Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:900, color:"#fff", letterSpacing:"-2px", lineHeight:1.04, margin:"0 0 20px" }}>
                Ihr Betrieb.<br /><span style={{ color:"#18A66D" }}>Endlich digital.</span>
              </h2>
              <p style={{ fontSize:18, color:"rgba(255,255,255,.38)", lineHeight:1.65, maxWidth:480, margin:"0 auto 44px" }}>
                Kalender, Kundenkartei, SMS-Erinnerungen und Auswertungen — in einem System, in 10 Minuten eingerichtet. Sprechen Sie kurz mit uns und starten Sie noch heute.
              </p>
              <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"16px 40px" }}>
                Kostenloses Gespräch sichern →
              </a>
              <div style={{ marginTop:32, display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
                {["Kein Vertrag","Monatlich kündbar","Persönliches Onboarding","In 10 Min. startklar"].map((t, i) => (
                  <span key={i} style={{ fontSize:13, color:"rgba(255,255,255,.22)" }}>✓ {t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ background:"#fff", borderTop:"1px solid #F3F4F6", padding:"28px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <span style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.5px" }}>
              <span style={{ color:"#18A66D" }}>Termin</span>
              <span style={{ color:"#0B0D14" }}>Stop</span>
            </span>
            <div style={{ display:"flex", gap:24 }}>
              {[["Impressum","/impressum"],["Datenschutz","/datenschutz"],["AGB","/agb"],["AVV","/avv"],["Login","/login"]].map(([l, h]) => (
                <a key={h} href={h} style={{ fontSize:13, color:"#9CA3AF", textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}