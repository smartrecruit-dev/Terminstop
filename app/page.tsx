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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms`
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
    { name: "Einsteiger", for: "Bis ca. 100 Termine / Monat", tag: null, dark: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"] },
    { name: "Wachstum", for: "100–400 Termine / Monat", tag: "Meistgewählt", dark: true, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"] },
    { name: "Profi", for: "Stark ausgelastete Betriebe", tag: null, dark: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"] },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  const addonFeatures = [
    { icon: "⬡", title: "Eigene Buchungsseite", desc: "Ihre persönliche URL — Kunden buchen direkt, ohne Telefonanruf." },
    { icon: "⬡", title: "QR-Code zum Aufstellen", desc: "An der Kasse oder im Schaufenster — Kunden scannen und buchen sofort." },
    { icon: "⬡", title: "Anfragen im Dashboard", desc: "Alle Online-Buchungen landen direkt bei Ihnen. Sie bestätigen mit einem Klick." },
    { icon: "⬡", title: "Automatische Bestätigungs-SMS", desc: "Sobald Sie bestätigen, bekommt der Kunde sofort eine SMS — ohne Ihr Zutun." },
    { icon: "⬡", title: "Leistungen wählbar", desc: "Kunden können Ihre Leistungen auswählen oder einfach einen offenen Termin anfragen." },
    { icon: "⬡", title: "Rückruf-Funktion", desc: "Kunden können auch einen Rückruf anfragen — Sie werden benachrichtigt." },
  ]

  const F = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"

  // Farben
  const BG      = "#04060F"
  const SURF    = "#080C18"
  const SURF2   = "#0C1121"
  const BORDER  = "rgba(255,255,255,0.07)"
  const BORDER2 = "rgba(255,255,255,0.12)"
  const GREEN   = "#18A66D"
  const GREEN2  = "#0EA060"
  const GLOW    = "rgba(24,166,109,0.15)"
  const TXT     = "#F0F4FF"
  const MUTED   = "rgba(240,244,255,0.45)"
  const MUTED2  = "rgba(240,244,255,0.25)"

  return (
    <>
      <style>{`
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(10px) skewY(2deg); }
          15%, 85% { opacity:1; transform:translateY(0) skewY(0); }
          100% { opacity:0; transform:translateY(-10px) skewY(-2deg); }
        }
        @keyframes marquee {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%,100% { opacity:.5; transform:scale(1); }
          50%     { opacity:1; transform:scale(1.08); }
        }

        .word-slot { animation: wordIn 2.8s cubic-bezier(.16,1,.3,1); }
        .marquee-wrap { animation: marquee 36s linear infinite; }
        .float-el { animation: float 7s ease-in-out infinite; }

        .nav-desktop-only { display:none!important; }
        @media(min-width:768px){ .nav-desktop-only { display:inline-flex!important; } }
        .nav-cta-short { display:inline; }
        .nav-cta-long  { display:none; }
        @media(min-width:768px){ .nav-cta-short { display:none; } .nav-cta-long { display:inline; } }

        .card-hover {
          transition: border-color .25s, box-shadow .25s, transform .25s;
        }
        .card-hover:hover {
          border-color: rgba(24,166,109,0.3) !important;
          box-shadow: 0 0 0 1px rgba(24,166,109,0.15), 0 20px 60px rgba(0,0,0,0.4) !important;
          transform: translateY(-2px);
        }

        .btn-primary {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background: linear-gradient(135deg, #18A66D 0%, #0EA060 100%);
          color:#fff; border:none; border-radius:10px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition: box-shadow .2s, transform .15s, opacity .15s;
          box-shadow: 0 0 0 1px rgba(24,166,109,0.4), 0 4px 24px rgba(24,166,109,0.3);
          letter-spacing:-0.2px;
        }
        .btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(24,166,109,0.6), 0 8px 36px rgba(24,166,109,0.45);
          transform: translateY(-1px);
          opacity:.95;
        }

        .btn-ghost {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background: rgba(255,255,255,0.05);
          color: rgba(240,244,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius:10px; font-weight:600; cursor:pointer; text-decoration:none;
          transition: background .2s, border-color .2s, color .2s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          color: #F0F4FF;
        }

        .btn-outline {
          display:inline-flex; align-items:center; justify-content:center;
          background:transparent; color:rgba(240,244,255,0.6);
          border:1px solid rgba(255,255,255,0.1); border-radius:10px;
          font-weight:600; cursor:pointer; text-decoration:none;
          transition: border-color .2s, color .2s, background .2s;
        }
        .btn-outline:hover { border-color:rgba(24,166,109,0.5); color:#18A66D; background:rgba(24,166,109,0.06); }

        .gradient-text {
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-green {
          background: linear-gradient(135deg, #18A66D 0%, #4AE89B 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .noise-overlay {
          position:absolute; inset:0; pointer-events:none; z-index:1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 200px 200px;
          opacity:.4;
        }

        .grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .tag {
          display:inline-flex; align-items:center; gap:6px;
          background: rgba(24,166,109,0.1);
          border: 1px solid rgba(24,166,109,0.25);
          color: #4AE89B;
          font-size:11px; font-weight:700; letter-spacing:0.5px;
          padding:5px 12px; border-radius:980px;
        }

        .faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .faq-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }

        @media(max-width:768px){
          .sec-pad { padding-top:64px!important; padding-bottom:64px!important; padding-left:20px!important; padding-right:20px!important; }
          .hide-mobile { display:none!important; }
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
          height:56,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 28px",
          background:"rgba(4,6,15,0.8)",
          backdropFilter:"blur(24px) saturate(160%)",
          borderBottom:`1px solid ${BORDER}`,
        }}>
          <a href="/" style={{ textDecoration:"none", fontSize:16, fontWeight:800, letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, background:"linear-gradient(135deg,#18A66D,#0EA060)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:13 }}>T</span>
            </div>
            <span style={{ color:TXT }}>TerminStop</span>
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <a href="#wie-es-funktioniert" className="nav-desktop-only" style={{ fontSize:13, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8, transition:"color .2s" }}>So funktioniert's</a>
            <a href="#preise" className="nav-desktop-only" style={{ fontSize:13, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8 }}>Preise</a>
            <a href="#online-buchung" className="nav-desktop-only" style={{ fontSize:13, color:GREEN, textDecoration:"none", fontWeight:600, padding:"6px 12px", borderRadius:8, alignItems:"center", gap:6 }}>
              <span style={{ background:"rgba(24,166,109,0.12)", border:"1px solid rgba(24,166,109,0.25)", borderRadius:980, padding:"2px 8px", fontSize:10, color:"#4AE89B", fontWeight:700, marginRight:4 }}>Neu</span>
              Online-Buchung
            </a>
            <a href="/login" className="nav-desktop-only" style={{ fontSize:13, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8 }}>Login</a>
            <a href="/login" className="show-mobile-only" style={{ fontSize:13, color:MUTED, textDecoration:"none", fontWeight:600, padding:"7px 14px", border:`1px solid ${BORDER2}`, borderRadius:9, background:"rgba(255,255,255,0.04)", whiteSpace:"nowrap" }}>Login</a>
            <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"8px 18px", marginLeft:4 }}>
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
          paddingTop:56, position:"relative", overflow:"hidden",
          background:`radial-gradient(ellipse 100% 70% at 50% -10%, rgba(24,166,109,0.12) 0%, transparent 65%), ${BG}`,
        }}>
          <div className="grid-bg" />
          <div className="noise-overlay" />

          {/* Glow orbs */}
          <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", width:800, height:500, borderRadius:"50%", background:`radial-gradient(ellipse, rgba(24,166,109,0.07) 0%, transparent 65%)`, pointerEvents:"none", zIndex:1 }} />

          <div style={{ maxWidth:760, margin:"0 auto", padding:"0 24px", textAlign:"center", position:"relative", zIndex:2 }}>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${BORDER2}`, borderRadius:980, padding:"6px 16px", marginBottom:32 }}>
              <span style={{ width:6, height:6, background:GREEN, borderRadius:"50%", display:"inline-block", boxShadow:`0 0 6px ${GREEN}` }} />
              <span style={{ fontSize:12, color:MUTED, fontWeight:500 }}>
                Digitales Terminbüro für Ihren&nbsp;
                <span style={{ color:TXT, fontWeight:700 }} key={heroWord} className="word-slot">{words[heroWord]}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize:"clamp(44px,7vw,88px)",
              fontWeight:900, lineHeight:1.0,
              letterSpacing:"-3px",
              margin:"0 0 28px",
              color:TXT,
            }}>
              Ihr Betrieb.{" "}
              <br />
              <span className="gradient-text-green">Automatisch.</span>
            </h1>

            <p style={{ fontSize:"clamp(16px,2vw,19px)", color:MUTED, lineHeight:1.7, maxWidth:520, margin:"0 auto 44px", fontWeight:400 }}>
              TerminStop ersetzt Zettelwirtschaft und Hinterhertelefonieren — mit Kalender, Kundenkartei und automatischen SMS-Erinnerungen. In 10 Minuten eingerichtet.
            </p>

            {/* CTAs */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:64 }}>
              <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 32px" }}>
                Kostenlose Beratung →
              </a>
              <a href="/demo" className="btn-ghost" style={{ fontSize:15, padding:"14px 28px" }}>
                Live-Demo ansehen
              </a>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", justifyContent:"center", gap:0, background:"rgba(255,255,255,0.03)", border:`1px solid ${BORDER}`, borderRadius:16, overflow:"hidden" }}>
              {[
                { to:50, suffix:"+", label:"Betriebe aktiv" },
                { to:95, suffix:"%", label:"Weniger Ausfälle" },
                { to:10, suffix:" Min", label:"Einrichtung" },
              ].map((s, i) => (
                <div key={i} style={{ flex:1, padding:"20px 24px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", textAlign:"center" }}>
                  <div style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:900, color:TXT, letterSpacing:"-1px" }}>
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
        <div style={{ borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, padding:"12px 0", overflow:"hidden", background:SURF }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-wrap" style={{ display:"flex", gap:48, flexShrink:0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <div style={{ width:4, height:4, background:GREEN, borderRadius:"50%", opacity:.6 }} />
                  <span style={{ fontSize:12, color:MUTED2, fontWeight:500, whiteSpace:"nowrap" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PROBLEM
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"88px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:480, marginBottom:56 }}>
                <div className="tag" style={{ marginBottom:20 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 16px", color:TXT }}>
                  Ausfälle kosten Sie täglich Geld.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.7, margin:0 }}>
                  Kein Überblick, kein System — und Kunden, die einfach nicht erscheinen. Das summiert sich.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:1, background:BORDER, borderRadius:20, overflow:"hidden" }} className="stat-grid">
              <style>{`.stat-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:700px){.stat-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { to:50, suffix:"€", pre:"bis ", label:"Verlust pro Ausfall", desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet.", col:"#F0F4FF" },
                { to:9, suffix:"×", pre:"bis ", label:"Ausfälle pro Woche", desc:"Im Schnitt erlebt jeder Betrieb mehrfach wöchentlich Ausfälle.", col:"#F0F4FF" },
                { to:2000, suffix:"€", pre:"bis ", label:"Verlust pro Monat", desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr.", col:GREEN },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ padding:"44px 36px", background:SURF }}>
                    <div style={{ fontSize:"clamp(40px,5vw,60px)", fontWeight:900, color:item.col, marginBottom:12, letterSpacing:"-2px", fontVariantNumeric:"tabular-nums" }}>
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
        <section id="wie-es-funktioniert" className="sec-pad" style={{ padding:"88px 32px", background:SURF }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 64px" }}>
                <div className="tag" style={{ marginBottom:20 }}>So funktioniert's</div>
                <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Drei Schritte.<br />Dann läuft alles.
                </h2>
                <p style={{ fontSize:16, color:MUTED, margin:0, lineHeight:1.65 }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>

            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {[
                { num:"01", tag:"Persönliche Begleitung", title:"Einmalig einrichten — in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein. Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive." },
                { num:"02", tag:"Vollautomatisch", title:"Ihr digitales Büro läuft — sofort und automatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen 24h vor jedem Termin automatisch raus — mit Ihrem Namen." },
                { num:"03", tag:"95% Erfolgsquote", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. TerminStop arbeitet dauerhaft für Sie im Hintergrund." },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-hover" style={{ background:SURF2, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px 32px", display:"flex", gap:28, alignItems:"flex-start" }}>
                    <div style={{ fontSize:48, fontWeight:900, lineHeight:1, color:"rgba(255,255,255,0.06)", flexShrink:0, width:60, textAlign:"center", userSelect:"none", fontVariantNumeric:"tabular-nums" }}>{s.num}</div>
                    <div>
                      <span style={{ display:"inline-block", background:"rgba(24,166,109,0.08)", border:"1px solid rgba(24,166,109,0.2)", color:"#4AE89B", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:980, marginBottom:10, letterSpacing:".5px" }}>{s.tag}</span>
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
            FEATURES BENTO
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"88px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 56px" }}>
                <div className="tag" style={{ marginBottom:20 }}>Alles inklusive</div>
                <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.65, margin:0 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe.
                </p>
              </div>
            </Reveal>

            {/* Bento Grid */}
            <div style={{ display:"grid", gap:3 }} className="bento-grid">
              <style>{`
                .bento-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; }
                @media(max-width:700px){ .bento-grid { grid-template-columns: 1fr !important; } }
              `}</style>

              {/* Big card top left */}
              <Reveal delay={0}>
                <div className="card-hover" style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:18, padding:"36px", gridRow:"span 1", height:"100%", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:`radial-gradient(ellipse, ${GLOW} 0%, transparent 70%)`, pointerEvents:"none" }} />
                  <div style={{ width:44, height:44, background:"rgba(24,166,109,0.1)", border:"1px solid rgba(24,166,109,0.2)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:20 }}>📅</div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#4AE89B", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Vollautomatisch</div>
                  <h3 style={{ fontSize:20, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.4px" }}>SMS-Erinnerungen</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>24h vor jedem Termin geht eine personalisierte SMS raus — mit Ihrem Namen, ohne Ihr Zutun. Nie wieder hinterhertelefonieren.</p>
                </div>
              </Reveal>

              {/* Top right */}
              <Reveal delay={60}>
                <div className="card-hover" style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:18, padding:"36px", height:"100%", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, background:`radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)`, pointerEvents:"none" }} />
                  <div style={{ width:44, height:44, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:20 }}>👥</div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#818CF8", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Voller Überblick</div>
                  <h3 style={{ fontSize:20, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.4px" }}>Kundenkartei</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist — und wer nicht.</p>
                </div>
              </Reveal>

              {/* Bottom left */}
              <Reveal delay={100}>
                <div className="card-hover" style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:18, padding:"36px", height:"100%", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, background:`radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)`, pointerEvents:"none" }} />
                  <div style={{ width:44, height:44, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:20 }}>🗓️</div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#FCD34D", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Immer aktuell</div>
                  <h3 style={{ fontSize:20, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.4px" }}>Digitaler Kalender</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>Tag- und Wochenansicht auf dem Handy, Tablet oder PC. Nie wieder Zettelwirtschaft — alles an einem Ort.</p>
                </div>
              </Reveal>

              {/* Bottom right */}
              <Reveal delay={140}>
                <div className="card-hover" style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:18, padding:"36px", height:"100%", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:-30, right:-30, width:140, height:140, background:`radial-gradient(ellipse, rgba(236,72,153,0.07) 0%, transparent 70%)`, pointerEvents:"none" }} />
                  <div style={{ width:44, height:44, background:"rgba(236,72,153,0.1)", border:"1px solid rgba(236,72,153,0.2)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:20 }}>📊</div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#F9A8D4", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Datengestützt</div>
                  <h3 style={{ fontSize:20, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.4px" }}>Auswertungen</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb schwarz auf weiß.</p>
                </div>
              </Reveal>
            </div>

            {/* CTA below bento */}
            <Reveal delay={80}>
              <div style={{ marginTop:16, background:SURF, border:`1px solid ${BORDER}`, borderRadius:16, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
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
        <section className="sec-pad" style={{ padding:"88px 32px", background:SURF }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag" style={{ marginBottom:20 }}>Echte Ergebnisse</div>
                <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:0, color:TXT }}>Was Betriebe berichten.</h2>
              </div>
            </Reveal>
            <div style={{ display:"grid", gap:12 }} className="reviews-grid">
              <style>{`.reviews-grid{grid-template-columns:1fr 1fr} @media(max-width:700px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-hover" style={{ background:SURF2, border:`1px solid ${BORDER}`, borderRadius:18, padding:"28px", display:"flex", flexDirection:"column", height:"100%" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                      <div style={{ background:"rgba(24,166,109,0.1)", border:"1px solid rgba(24,166,109,0.2)", color:"#4AE89B", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:980 }}>✓ {r.result}</div>
                      <div style={{ color:"#FBBF24", fontSize:12, letterSpacing:2 }}>★★★★★</div>
                    </div>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, flex:1, marginBottom:20, fontStyle:"italic" }}>„{r.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:18, borderTop:`1px solid ${BORDER}` }}>
                      <div style={{ width:36, height:36, background:"linear-gradient(135deg,#18A66D,#0A7A4F)", color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, flexShrink:0 }}>{r.name.charAt(0)}</div>
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
        <section id="preise" className="sec-pad" style={{ padding:"88px 32px", background:BG }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 16px" }}>
                <div className="tag" style={{ marginBottom:20 }}>Ihr Paket</div>
                <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Individuell angepasst.<br />Passend für Ihren Betrieb.
                </h2>
                <p style={{ fontSize:16, color:MUTED, margin:0, lineHeight:1.65 }}>
                  Kein Einheitspaket. Im Gespräch finden wir gemeinsam das richtige Paket.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div style={{ display:"flex", justifyContent:"center", margin:"32px 0 44px" }}>
                <div style={{ background:SURF, border:`1px solid rgba(24,166,109,0.2)`, borderRadius:16, padding:"18px 28px", display:"flex", alignItems:"center", gap:20, boxShadow:`0 0 40px rgba(24,166,109,0.07)` }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:MUTED2, marginBottom:4 }}>Einstieg bereits ab</div>
                    <div style={{ fontSize:34, fontWeight:900, color:TXT, letterSpacing:"-1px", lineHeight:1 }}>€1,30 <span style={{ fontSize:15, fontWeight:500, color:MUTED }}>/ Tag</span></div>
                    <div style={{ fontSize:11, color:MUTED2, marginTop:4 }}>Monatlich kündbar · Kein Vertrag</div>
                  </div>
                  <div style={{ width:1, height:48, background:BORDER }} />
                  <div style={{ fontSize:13, color:MUTED, maxWidth:200, lineHeight:1.6 }}>
                    Schon <strong style={{ color:TXT }}>2–3 verhinderte Ausfälle</strong> decken das Paket vollständig ab.
                  </div>
                </div>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:3 }} className="pricing-grid">
              <style>{`.pricing-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
              {tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 70}>
                  {tier.dark ? (
                    <div style={{ background:`linear-gradient(160deg, rgba(24,166,109,0.12) 0%, ${SURF2} 60%)`, border:"1px solid rgba(24,166,109,0.3)", borderRadius:18, padding:"32px 28px", position:"relative", boxShadow:`0 0 60px rgba(24,166,109,0.08)`, height:"100%", boxSizing:"border-box" }}>
                      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#18A66D,#0EA060)", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 18px", borderRadius:980, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(24,166,109,0.4)" }}>✓ Meistgewählt</div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#4AE89B", marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:MUTED2, marginBottom:24, paddingBottom:20, borderBottom:`1px solid rgba(255,255,255,0.08)` }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#4AE89B", fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:13, color:"rgba(240,244,255,0.7)" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-primary" style={{ display:"block", textAlign:"center", fontSize:14, padding:"13px 0", borderRadius:10, width:"100%", boxSizing:"border-box" }}>Paket anfragen →</a>
                    </div>
                  ) : (
                    <div className="card-hover" style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:18, padding:"32px 28px", height:"100%", boxSizing:"border-box" }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:MUTED2, marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:MUTED2, marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:32 }}>
                        {tier.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:GREEN, fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:13, color:MUTED }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-outline" style={{ display:"block", textAlign:"center", fontSize:14, padding:"13px 0", borderRadius:10, width:"100%", boxSizing:"border-box" }}>Paket anfragen →</a>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p style={{ textAlign:"center", fontSize:13, color:MUTED2, marginTop:24 }}>
                Die meisten Betriebe zahlen zwischen <strong style={{ color:MUTED }}>€39 und €109 / Monat</strong> · Monatlich kündbar · Alle Preise sind Endpreise (§19 UStG)
              </p>
            </Reveal>

            {/* Add-on teaser */}
            <Reveal delay={120}>
              <a href="#online-buchung" style={{ textDecoration:"none", display:"block", marginTop:16 }}>
                <div className="card-hover" style={{ background:SURF, border:"1px dashed rgba(24,166,109,0.3)", borderRadius:16, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:38, height:38, background:"rgba(24,166,109,0.1)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🔗</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                        <span style={{ fontSize:14, fontWeight:700, color:TXT }}>Add-on: Online-Buchung</span>
                        <span style={{ background:"rgba(24,166,109,0.1)", border:"1px solid rgba(24,166,109,0.25)", color:"#4AE89B", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:980 }}>Optional</span>
                      </div>
                      <p style={{ fontSize:13, color:MUTED, margin:0 }}>QR-Code + eigene Buchungsseite + SMS-Bestätigung — zu jedem Paket zubuchbar.</p>
                    </div>
                  </div>
                  <span style={{ fontSize:13, color:GREEN, fontWeight:600, flexShrink:0 }}>Mehr erfahren →</span>
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            ADD-ON: ONLINE BUCHUNG
        ══════════════════════════════════════════════ */}
        <section id="online-buchung" className="sec-pad" style={{ padding:"88px 32px", background:SURF, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"10%", right:"-5%", width:500, height:400, borderRadius:"50%", background:`radial-gradient(ellipse, rgba(24,166,109,0.06) 0%, transparent 65%)`, pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"5%", left:"-5%", width:400, height:320, borderRadius:"50%", background:`radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 65%)`, pointerEvents:"none" }} />

          <div style={{ maxWidth:1000, margin:"0 auto", position:"relative" }}>
            <Reveal>
              <div style={{ maxWidth:560, marginBottom:52 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div className="tag">Optionales Add-on</div>
                  <div style={{ height:1, flex:1, background:BORDER }} />
                </div>
                <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, color:TXT, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px" }}>
                  Online-Buchung.<br /><span className="gradient-text-green">Kunden buchen sich selbst.</span>
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.65, margin:0 }}>
                  Ergänzen Sie TerminStop um eine eigene Buchungsseite mit QR-Code — so können Kunden rund um die Uhr Termine anfragen, ohne dass Sie ans Telefon müssen.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:3 }} className="addon-grid">
              <style>{`.addon-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:900px){.addon-grid{grid-template-columns:repeat(2,1fr)!important}} @media(max-width:560px){.addon-grid{grid-template-columns:1fr!important}}`}</style>
              {addonFeatures.map((f, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="card-hover" style={{ background:SURF2, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", height:"100%", boxSizing:"border-box" }}>
                    <div style={{ width:36, height:36, background:"rgba(24,166,109,0.08)", border:"1px solid rgba(24,166,109,0.15)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                      <span style={{ color:"#4AE89B", fontSize:14, fontWeight:700 }}>✓</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:6, letterSpacing:"-0.2px" }}>{f.title}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <div style={{ marginTop:32, display:"flex", flexDirection:"column", alignItems:"center", gap:14, textAlign:"center" }}>
                <p style={{ fontSize:13, color:MUTED2, margin:0 }}>
                  Das Add-on ist für jeden TerminStop-Kunden optional zubuchbar — fragen Sie uns einfach im Gespräch danach.
                </p>
                <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 36px" }}>
                  Online-Buchung mit anfragen →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"88px 32px", background:BG }}>
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag" style={{ marginBottom:20 }}>FAQ</div>
                <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 10px", color:TXT }}>Häufige Fragen.</h2>
                <p style={{ fontSize:15, color:MUTED, margin:0 }}>Alles, was Sie wissen möchten — bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div>
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 40}>
                  <div className="faq-item">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width:"100%", textAlign:"left", padding:"20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, background:"none", border:"none", cursor:"pointer" }}
                    >
                      <span style={{ fontSize:15, fontWeight:600, color:TXT, lineHeight:1.5 }}>{faq.q}</span>
                      <span style={{ color:GREEN, fontSize:20, flexShrink:0, fontWeight:300, lineHeight:1, transform: openFaq === i ? "rotate(45deg)" : "none", transition:"transform .25s cubic-bezier(.16,1,.3,1)" }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ paddingBottom:20, fontSize:14, color:MUTED, lineHeight:1.75, paddingRight:32 }}>{faq.a}</div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"100px 32px", background:SURF, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:500, borderRadius:"50%", background:`radial-gradient(ellipse, rgba(24,166,109,0.1) 0%, transparent 65%)`, pointerEvents:"none" }} />
          <div className="grid-bg" />

          <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
            <Reveal>
              <div className="tag" style={{ marginBottom:24 }}>Jetzt starten</div>
              <h2 style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:900, letterSpacing:"-2.5px", lineHeight:1.04, margin:"0 0 20px", color:TXT }}>
                Weniger Ausfälle.<br />
                <span className="gradient-text-green">Ab morgen.</span>
              </h2>
              <p style={{ fontSize:17, color:MUTED, lineHeight:1.65, maxWidth:440, margin:"0 auto 44px" }}>
                Kostenlose Beratung, persönliches Onboarding, monatlich kündbar. Kein Risiko.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"16px 40px" }}>
                  Kostenlos anfragen →
                </a>
                <a href="/demo" className="btn-ghost" style={{ fontSize:16, padding:"16px 32px" }}>
                  Demo ansehen
                </a>
              </div>
              <p style={{ marginTop:28, fontSize:12, color:MUTED2 }}>
                Ab €1,30/Tag · Keine Mindestlaufzeit · In 10 Minuten eingerichtet
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer style={{ background:BG, borderTop:`1px solid ${BORDER}`, padding:"32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <a href="/" style={{ textDecoration:"none", fontSize:15, fontWeight:800, letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:24, height:24, background:"linear-gradient(135deg,#18A66D,#0EA060)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:11 }}>T</span>
            </div>
            <span style={{ color:TXT }}>TerminStop</span>
          </a>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {[
              { label:"Impressum", href:"/impressum" },
              { label:"Datenschutz", href:"/datenschutz" },
              { label:"AGB", href:"/agb" },
              { label:"AVV", href:"/avv" },
              { label:"Login", href:"/login" },
            ].map((l, i) => (
              <a key={i} href={l.href} style={{ fontSize:12, color:MUTED2, textDecoration:"none", fontWeight:500, transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = MUTED)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED2)}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ fontSize:12, color:MUTED2 }}>© {new Date().getFullYear()} TerminStop · Marvin Passe</div>
        </footer>

      </div>
    </>
  )
}
