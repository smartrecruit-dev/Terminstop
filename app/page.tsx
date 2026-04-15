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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.06 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
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
    const t = setInterval(() => setHeroWord(w => (w + 1) % words.length), 2800)
    return () => clearInterval(t)
  }, [])

  const reviews = [
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle" },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h / Woche" },
  ]

  const faqs = [
    { q: "Ist TerminStop nur für SMS-Erinnerungen?", a: "Nein – SMS-Erinnerungen sind nur eine von vier Funktionen. TerminStop ist Ihr komplettes digitales Terminbüro: mit digitalem Kalender, Kundenkartei, automatischen SMS-Erinnerungen und Auswertungen. Alles in einem System, ab €1,30 pro Tag." },
    { q: "Muss ich eine App installieren oder etwas technisch einrichten?", a: "Nein. TerminStop läuft komplett im Browser – keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich." },
    { q: "Was kostet TerminStop monatlich?", a: "Das hängt davon ab, wie viele Termine Sie im Monat haben. Unser Einstieg liegt bei €1,30 pro Tag – die meisten Betriebe zahlen zwischen €39 und €109 pro Monat. Im kurzen Erstgespräch finden wir gemeinsam das passende Paket. Kein Vertrag, monatlich kündbar." },
    { q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?", a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe – keine Vorkenntnisse nötig." },
    { q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?", a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes." },
    { q: "Was ist das Add-on Online-Buchung?", a: "Das Online-Buchungs-Add-on gibt Ihrem Betrieb eine eigene Buchungsseite mit QR-Code. Kunden können damit rund um die Uhr Termine anfragen – ohne anzurufen. Die Anfragen landen direkt in Ihrem Dashboard. Sie bestätigen mit einem Klick, und der Kunde bekommt automatisch eine SMS." },
  ]

  const tiers = [
    { name: "Einsteiger", for: "Bis ca. 100 Termine / Monat", tag: null, highlight: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"] },
    { name: "Wachstum", for: "100–400 Termine / Monat", tag: "Meistgewählt", highlight: true, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"] },
    { name: "Profi", for: "Stark ausgelastete Betriebe", tag: null, highlight: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"] },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  const addonFeatures = [
    { icon: "🔗", title: "Eigene Buchungsseite", desc: "Ihre persönliche URL — Kunden buchen direkt, ohne Telefonanruf." },
    { icon: "📲", title: "QR-Code zum Aufstellen", desc: "An der Kasse oder im Schaufenster — Kunden scannen und buchen sofort." },
    { icon: "📥", title: "Anfragen im Dashboard", desc: "Alle Online-Buchungen landen direkt bei Ihnen. Sie bestätigen mit einem Klick." },
    { icon: "✉️", title: "Automatische Bestätigungs-SMS", desc: "Sobald Sie bestätigen, bekommt der Kunde sofort eine SMS — ohne Ihr Zutun." },
    { icon: "🗂️", title: "Leistungen wählbar", desc: "Kunden können Ihre Leistungen auswählen oder einfach einen offenen Termin anfragen." },
    { icon: "📞", title: "Rückruf-Funktion", desc: "Kunden können auch einen Rückruf anfragen — Sie werden benachrichtigt." },
  ]

  const F = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"

  const GREEN   = "#18A66D"
  const GREEN_L = "#F0FBF6"
  const GREEN_B = "#D1F5E3"
  const TXT     = "#111827"
  const MUTED   = "#6B7280"
  const MUTED2  = "#9CA3AF"
  const BG      = "#FFFFFF"
  const BG2     = "#F9FAFB"
  const BG3     = "#F3F4F6"
  const BORDER  = "#E5E7EB"
  const BORDER2 = "#D1D5DB"

  return (
    <>
      <style>{`
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(8px); }
          15%, 85% { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-8px); }
        }
        @keyframes marquee {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }

        .word-slot { animation: wordIn 2.8s cubic-bezier(.16,1,.3,1); }
        .marquee-wrap { animation: marquee 38s linear infinite; }

        .nav-desktop-only { display:none!important; }
        @media(min-width:768px){ .nav-desktop-only { display:inline-flex!important; } }
        .nav-cta-short { display:inline; }
        .nav-cta-long  { display:none; }
        @media(min-width:768px){ .nav-cta-short { display:none; } .nav-cta-long { display:inline; } }

        .card-lift {
          transition: box-shadow .22s ease, transform .22s ease, border-color .22s ease;
        }
        .card-lift:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important;
          transform: translateY(-2px);
          border-color: #D1D5DB !important;
        }

        .btn-primary {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background: #18A66D;
          color:#fff; border:none; border-radius:10px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition: background .18s, box-shadow .18s, transform .15s;
          box-shadow: 0 2px 10px rgba(24,166,109,0.25);
          letter-spacing:-0.1px;
        }
        .btn-primary:hover {
          background: #15955F;
          box-shadow: 0 4px 20px rgba(24,166,109,0.35);
          transform: translateY(-1px);
        }

        .btn-outline {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background: #fff;
          color: #374151;
          border: 1.5px solid #E5E7EB;
          border-radius:10px; font-weight:600; cursor:pointer; text-decoration:none;
          transition: border-color .18s, background .18s, color .18s;
        }
        .btn-outline:hover {
          border-color: #18A66D;
          color: #18A66D;
          background: #F0FBF6;
        }

        .btn-white {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background: #fff; color: #18A66D;
          border: none; border-radius:10px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition: background .18s, transform .15s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        }
        .btn-white:hover { background:#F0FBF6; transform:translateY(-1px); }

        .faq-item { border-bottom: 1px solid #F3F4F6; }
        .faq-item:first-child { border-top: 1px solid #F3F4F6; }
        .faq-btn { background:none; border:none; cursor:pointer; width:100%; text-align:left; }
        .faq-btn:hover { background:#FAFAFA; }

        .tag-green {
          display:inline-flex; align-items:center; gap:6px;
          background: #F0FBF6;
          border: 1px solid #BBF7D0;
          color: #16A34A;
          font-size:11px; font-weight:700; letter-spacing:0.4px;
          padding:5px 13px; border-radius:980px;
        }

        @media(max-width:768px){
          .sec-pad { padding-top:60px!important; padding-bottom:60px!important; padding-left:20px!important; padding-right:20px!important; }
          .hide-mobile { display:none!important; }
          .hero-h1 { font-size:42px!important; letter-spacing:-2px!important; }
        }
        @media(min-width:769px){
          .show-mobile-only { display:none!important; }
        }
      `}</style>

      <div style={{ fontFamily: F, color: TXT, background: BG, overflowX:"hidden" }}>

        {/* ══════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════ */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          height:60,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 28px",
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(20px) saturate(150%)",
          borderBottom:`1px solid ${BORDER}`,
        }}>
          <a href="/" style={{ textDecoration:"none", fontSize:16, fontWeight:800, letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, background:GREEN, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>T</span>
            </div>
            <span style={{ color:TXT }}>Termin<span style={{ color:GREEN }}>Stop</span></span>
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <a href="#wie-es-funktioniert" className="nav-desktop-only" style={{ fontSize:14, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8, transition:"color .2s" }}>So funktioniert's</a>
            <a href="#preise" className="nav-desktop-only" style={{ fontSize:14, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8 }}>Preise</a>
            <a href="#online-buchung" className="nav-desktop-only" style={{ fontSize:14, color:GREEN, textDecoration:"none", fontWeight:600, padding:"6px 12px", borderRadius:8, alignItems:"center", gap:6 }}>
              <span style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:980, padding:"2px 8px", fontSize:10, color:GREEN, fontWeight:700, marginRight:4 }}>Neu</span>
              Online-Buchung
            </a>
            <a href="/login" className="nav-desktop-only" style={{ fontSize:14, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8 }}>Login</a>
            <a href="/login" className="show-mobile-only btn-outline" style={{ fontSize:13, padding:"7px 14px" }}>Login</a>
            <a href="/lead" className="btn-primary" style={{ fontSize:14, padding:"9px 20px", marginLeft:4 }}>
              <span className="nav-cta-short">Anfragen →</span>
              <span className="nav-cta-long">Kostenlos anfragen</span>
            </a>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section style={{
          minHeight:"100vh",
          display:"flex", alignItems:"center", justifyContent:"center",
          paddingTop:60, position:"relative", overflow:"hidden",
          background:`linear-gradient(180deg, #F0FBF6 0%, #FFFFFF 55%)`,
        }}>
          {/* Subtle grid */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"linear-gradient(rgba(24,166,109,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(24,166,109,0.05) 1px,transparent 1px)",
            backgroundSize:"48px 48px",
            maskImage:"radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%)",
          }} />

          <div style={{ maxWidth:780, margin:"0 auto", padding:"60px 24px 80px", textAlign:"center", position:"relative", zIndex:2 }}>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:980, padding:"6px 16px", marginBottom:32 }}>
              <span style={{ width:6, height:6, background:GREEN, borderRadius:"50%", display:"inline-block" }} />
              <span style={{ fontSize:13, color:GREEN, fontWeight:600 }}>
                Digitales Terminbüro für Ihren&nbsp;
                <span style={{ fontWeight:800 }} key={heroWord} className="word-slot">{words[heroWord]}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-h1" style={{
              fontSize:"clamp(44px,7vw,80px)",
              fontWeight:900, lineHeight:1.0,
              letterSpacing:"-2.5px",
              margin:"0 0 24px",
              color:TXT,
            }}>
              Ihr Betrieb.{" "}
              <br />
              <span style={{ color:GREEN }}>Automatisch.</span>
            </h1>

            <p style={{ fontSize:"clamp(16px,2vw,19px)", color:MUTED, lineHeight:1.75, maxWidth:520, margin:"0 auto 44px", fontWeight:400 }}>
              TerminStop ersetzt Zettelwirtschaft und Hinterhertelefonieren — mit Kalender, Kundenkartei und automatischen SMS-Erinnerungen. In 10 Minuten eingerichtet.
            </p>

            {/* CTAs */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:64 }}>
              <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"15px 34px" }}>
                Kostenlose Beratung →
              </a>
              <a href="/demo" className="btn-outline" style={{ fontSize:16, padding:"15px 28px" }}>
                Live-Demo ansehen
              </a>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", justifyContent:"center", background:BG, border:`1px solid ${BORDER}`, borderRadius:16, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
              {[
                { to:50, suffix:"+", label:"Betriebe aktiv" },
                { to:95, suffix:"%", label:"Weniger Ausfälle" },
                { to:10, suffix:" Min", label:"Einrichtung" },
              ].map((s, i) => (
                <div key={i} style={{ flex:1, padding:"22px 24px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", textAlign:"center" }}>
                  <div style={{ fontSize:"clamp(24px,3vw,34px)", fontWeight:900, color:TXT, letterSpacing:"-1px" }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize:12, color:MUTED2, marginTop:4, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════
            INDUSTRY STRIP
        ══════════════════════════════════════════════ */}
        <div style={{ borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, padding:"12px 0", overflow:"hidden", background:BG2 }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-wrap" style={{ display:"flex", gap:48, flexShrink:0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <div style={{ width:4, height:4, background:GREEN, borderRadius:"50%", opacity:.6 }} />
                  <span style={{ fontSize:13, color:MUTED2, fontWeight:500, whiteSpace:"nowrap" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PROBLEM
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:500, marginBottom:56 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Ausfälle kosten Sie täglich Geld.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.7, margin:0 }}>
                  Kein Überblick, kein System — und Kunden, die einfach nicht erscheinen. Das summiert sich.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:16 }} className="stat-grid">
              <style>{`.stat-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:700px){.stat-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { to:50, suffix:"€", pre:"bis ", label:"Verlust pro Ausfall", desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet.", accent:false },
                { to:9, suffix:"×", pre:"bis ", label:"Ausfälle pro Woche", desc:"Im Schnitt erlebt jeder Betrieb mehrfach wöchentlich Ausfälle.", accent:false },
                { to:2000, suffix:"€", pre:"bis ", label:"Verlust pro Monat", desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr.", accent:true },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-lift" style={{ padding:"36px 32px", background: item.accent ? GREEN_L : BG2, border:`1px solid ${item.accent ? GREEN_B : BORDER}`, borderRadius:16, height:"100%", boxSizing:"border-box" }}>
                    <div style={{ fontSize:"clamp(38px,5vw,56px)", fontWeight:900, color: item.accent ? GREEN : TXT, marginBottom:10, letterSpacing:"-2px", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:8 }}>{item.label}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.65 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section id="wie-es-funktioniert" className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 60px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>So funktioniert's</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Drei Schritte.<br />Dann läuft alles.
                </h2>
                <p style={{ fontSize:16, color:MUTED, margin:0, lineHeight:1.65 }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { num:"01", tag:"Persönliche Begleitung", title:"Einmalig einrichten — in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein. Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive." },
                { num:"02", tag:"Vollautomatisch", title:"Ihr digitales Büro läuft — sofort und automatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen 24h vor jedem Termin automatisch raus — mit Ihrem Namen." },
                { num:"03", tag:"95% Erfolgsquote", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. TerminStop arbeitet dauerhaft für Sie im Hintergrund." },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:14, padding:"28px 32px", display:"flex", gap:28, alignItems:"flex-start", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:44, fontWeight:900, lineHeight:1, color:BG3, flexShrink:0, width:56, textAlign:"center", userSelect:"none", fontVariantNumeric:"tabular-nums" }}>{s.num}</div>
                    <div>
                      <span style={{ display:"inline-block", background:GREEN_L, border:`1px solid ${GREEN_B}`, color:GREEN, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:980, marginBottom:10, letterSpacing:".4px" }}>{s.tag}</span>
                      <h3 style={{ fontSize:17, fontWeight:800, color:TXT, margin:"0 0 8px", letterSpacing:"-0.3px" }}>{s.title}</h3>
                      <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 56px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Alles inklusive</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.65, margin:0 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:16 }} className="features-grid">
              <style>{`
                .features-grid { grid-template-columns: repeat(2,1fr); }
                @media(max-width:700px){ .features-grid { grid-template-columns:1fr!important; } }
              `}</style>

              {[
                { icon:"📅", color:"#10B981", bg:"#ECFDF5", border:"#A7F3D0", label:"Vollautomatisch", title:"SMS-Erinnerungen", desc:"24h vor jedem Termin geht eine personalisierte SMS raus — mit Ihrem Namen, ohne Ihr Zutun. Nie wieder hinterhertelefonieren." },
                { icon:"👥", color:"#6366F1", bg:"#EEF2FF", border:"#C7D2FE", label:"Voller Überblick", title:"Kundenkartei", desc:"Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist — und wer nicht." },
                { icon:"🗓️", color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A", label:"Immer aktuell", title:"Digitaler Kalender", desc:"Tag- und Wochenansicht auf dem Handy, Tablet oder PC. Nie wieder Zettelwirtschaft — alles an einem Ort." },
                { icon:"📊", color:"#EC4899", bg:"#FDF2F8", border:"#FBCFE8", label:"Datengestützt", title:"Auswertungen", desc:"Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb schwarz auf weiß." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16, padding:"32px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ width:46, height:46, background:f.bg, border:`1px solid ${f.border}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:21, marginBottom:18 }}>{f.icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:f.color, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>{f.label}</div>
                    <h3 style={{ fontSize:19, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.4px" }}>{f.title}</h3>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, margin:0 }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop:16, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:14, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
                <div>
                  <span style={{ color:TXT, fontWeight:700, fontSize:15 }}>Alles in einem Paket. Ab €1,30/Tag.</span>
                  <span style={{ color:MUTED, fontSize:13, marginLeft:12 }}>Monatlich kündbar · Kein Vertrag</span>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"10px 22px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Echte Ergebnisse</div>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:0, color:TXT }}>Was Betriebe berichten.</h2>
              </div>
            </Reveal>
            <div style={{ display:"grid", gap:16 }} className="reviews-grid">
              <style>{`.reviews-grid{grid-template-columns:1fr 1fr} @media(max-width:700px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px", display:"flex", flexDirection:"column", height:"100%", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                      <div style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, color:GREEN, fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:980 }}>✓ {r.result}</div>
                      <div style={{ color:"#F59E0B", fontSize:13, letterSpacing:2 }}>★★★★★</div>
                    </div>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.8, flex:1, marginBottom:20 }}>„{r.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:18, borderTop:`1px solid ${BORDER}` }}>
                      <div style={{ width:36, height:36, background:GREEN, color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, flexShrink:0 }}>{r.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:TXT }}>{r.name}</div>
                        <div style={{ fontSize:12, color:MUTED2 }}>{r.role} · {r.city}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════ */}
        <section id="preise" className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 16px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Ihr Paket</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Individuell angepasst.<br />Passend für Ihren Betrieb.
                </h2>
                <p style={{ fontSize:16, color:MUTED, margin:0, lineHeight:1.65 }}>
                  Kein Einheitspaket. Im Gespräch finden wir gemeinsam das richtige Paket.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div style={{ display:"flex", justifyContent:"center", margin:"32px 0 44px" }}>
                <div style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:14, padding:"18px 28px", display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:MUTED2, marginBottom:4 }}>Einstieg bereits ab</div>
                    <div style={{ fontSize:34, fontWeight:900, color:TXT, letterSpacing:"-1px", lineHeight:1 }}>€1,30 <span style={{ fontSize:15, fontWeight:500, color:MUTED }}>/ Tag</span></div>
                    <div style={{ fontSize:11, color:MUTED2, marginTop:4 }}>Monatlich kündbar · Kein Vertrag</div>
                  </div>
                  <div style={{ width:1, height:48, background:GREEN_B }} />
                  <div style={{ fontSize:13, color:MUTED, maxWidth:200, lineHeight:1.6 }}>
                    Schon <strong style={{ color:TXT }}>2–3 verhinderte Ausfälle</strong> decken das Paket vollständig ab.
                  </div>
                </div>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:16 }} className="pricing-grid">
              <style>{`.pricing-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
              {tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 70}>
                  {tier.highlight ? (
                    <div style={{ background:GREEN, border:`1px solid ${GREEN}`, borderRadius:18, padding:"32px 28px", position:"relative", boxShadow:`0 8px 40px rgba(24,166,109,0.25)`, height:"100%", boxSizing:"border-box" }}>
                      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:TXT, color:"#fff", fontSize:11, fontWeight:700, padding:"5px 18px", borderRadius:980, whiteSpace:"nowrap" }}>✓ Meistgewählt</div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.75)", marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", marginBottom:24, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,0.2)" }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#fff", fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:"rgba(255,255,255,0.9)", fontWeight:500 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-white" style={{ width:"100%", fontSize:14, padding:"13px 20px", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  ) : (
                    <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:18, padding:"32px 28px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:MUTED2, marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:MUTED2, marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:GREEN, fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:MUTED, fontWeight:500 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-outline" style={{ width:"100%", fontSize:14, padding:"13px 20px", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            ADD-ON
        ══════════════════════════════════════════════ */}
        <section id="online-buchung" className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, flexWrap:"wrap" }}>
                <div className="tag-green">Add-on</div>
                <span style={{ fontSize:13, color:MUTED }}>Optional zubuchbar zu jedem Paket</span>
              </div>
              <div style={{ maxWidth:600, marginBottom:52 }}>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Online-Buchung —<br />Kunden buchen rund um die Uhr.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.7, margin:0 }}>
                  Geben Sie Ihrem Betrieb eine eigene Buchungsseite. Kunden scannen den QR-Code und fragen Termine an — Sie bestätigen mit einem Klick.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:12 }} className="addon-grid">
              <style>{`.addon-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.addon-grid{grid-template-columns:repeat(2,1fr)!important}} @media(max-width:500px){.addon-grid{grid-template-columns:1fr!important}}`}</style>
              {addonFeatures.map((f, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:22, marginBottom:12 }}>{f.icon}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:6 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop:16, background:BG, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                <div>
                  <span style={{ color:TXT, fontWeight:700, fontSize:15 }}>Online-Buchung als Add-on hinzubuchen.</span>
                  <span style={{ color:MUTED, fontSize:13, marginLeft:12 }}>Auf Anfrage · Zu jedem Paket</span>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"10px 22px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:720, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>FAQ</div>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:0, color:TXT }}>Häufige Fragen.</h2>
              </div>
            </Reveal>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding:"20px 16px", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:TXT, textAlign:"left", lineHeight:1.4 }}>{faq.q}</span>
                    <span style={{ color:openFaq === i ? GREEN : MUTED2, fontSize:18, flexShrink:0, transition:"transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding:"0 16px 20px", fontSize:14, color:MUTED, lineHeight:1.75 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:GREEN }}>
          <Reveal>
            <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
              <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 20px", color:"#fff" }}>
                Starten Sie noch heute.
              </h2>
              <p style={{ fontSize:17, color:"rgba(255,255,255,0.8)", lineHeight:1.7, margin:"0 0 44px" }}>
                Kostenlose Beratung, persönliches Onboarding, monatlich kündbar.<br />Kein Risiko, kein Kleingedrucktes.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <a href="/lead" className="btn-white" style={{ fontSize:16, padding:"15px 34px" }}>Kostenlose Beratung →</a>
                <a href="/demo" style={{ display:"inline-flex", alignItems:"center", fontSize:16, padding:"15px 28px", color:"rgba(255,255,255,0.85)", fontWeight:600, textDecoration:"none", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.35)", transition:"border-color .2s, background .2s" }}>Demo ansehen</a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer style={{ background:BG2, borderTop:`1px solid ${BORDER}`, padding:"40px 32px" }}>
          <div style={{ maxWidth:1040, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:28, height:28, background:GREEN, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontWeight:900, fontSize:13 }}>T</span>
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:TXT, letterSpacing:"-0.4px" }}>Termin<span style={{ color:GREEN }}>Stop</span></span>
            </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[
                { href:"/impressum", label:"Impressum" },
                { href:"/datenschutz", label:"Datenschutz" },
                { href:"/agb", label:"AGB" },
                { href:"/avv", label:"AVV" },
              ].map(l => (
                <a key={l.href} href={l.href} style={{ fontSize:13, color:MUTED2, textDecoration:"none", fontWeight:500, transition:"color .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = TXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED2)}>
                  {l.label}
                </a>
              ))}
            </div>
            <div style={{ fontSize:12, color:MUTED2 }}>© {new Date().getFullYear()} TerminStop</div>
          </div>
        </footer>

      </div>
    </>
  )
}
