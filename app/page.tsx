"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const h = () => setY(window.scrollY)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])
  return y
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

/* ─── Animated Counter ── */
function Counter({ to, suffix = "", duration = 2200 }: { to: number; suffix?: string; duration?: number }) {
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
          const ease = 1 - Math.pow(1 - p, 4)
          setVal(Math.round(to * ease))
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

/* ─── Reveal ── */
function Reveal({ children, delay = 0, y = 28, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const { ref, vis } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    }}>
      {children}
    </div>
  )
}

/* ─── Magnetic Button ── */
function MagneticBtn({ children, href, className, style }: { children: React.ReactNode; href: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.35
    const y = (e.clientY - r.top - r.height / 2) * 0.35
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }, [])
  const handleLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0,0)"
  }, [])
  return (
    <a ref={ref} href={href} className={className} style={{ ...style, transition:"transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.2s, box-shadow 0.2s" }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroWord, setHeroWord] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [cursorHover, setCursorHover] = useState(false)
  const scrollY = useScrollY()
  const words = ["Friseur.", "Werkstatt.", "Praxis.", "Betrieb."]

  useEffect(() => {
    const t = setInterval(() => setHeroWord(w => (w + 1) % words.length), 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", move)
    const links = document.querySelectorAll("a, button")
    const on = () => setCursorHover(true)
    const off = () => setCursorHover(false)
    links.forEach(l => { l.addEventListener("mouseenter", on); l.addEventListener("mouseleave", off) })
    return () => {
      window.removeEventListener("mousemove", move)
      links.forEach(l => { l.removeEventListener("mouseenter", on); l.removeEventListener("mouseleave", off) })
    }
  }, [])

  const reviews = [
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle" },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h / Woche" },
    { text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.", name: "Dr. Andreas B.", role: "Physiotherapiepraxis", city: "Berlin", result: "Keine Absagen mehr" },
    { text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.", name: "Markus S.", role: "KFZ-Werkstatt", city: "Stuttgart", result: "+18% Auslastung" },
  ]

  const faqs = [
    { q: "Ist TerminStop nur für SMS-Erinnerungen?", a: "Nein – SMS-Erinnerungen sind nur eine von vier Funktionen. TerminStop ist Ihr komplettes digitales Terminbüro: mit digitalem Kalender, Kundenkartei mit vollständiger Terminhistorie, automatischen SMS-Erinnerungen und Auswertungen über Ihre Entwicklung. Alles in einem System, monatlich ab €39." },
    { q: "Muss ich eine App installieren oder etwas technisch einrichten?", a: "Nein. TerminStop läuft komplett im Browser – keine App, keine Software, keine technischen Vorkenntnisse. Die Einrichtung dauert unter 10 Minuten und wir begleiten Sie dabei persönlich." },
    { q: "Was kostet TerminStop monatlich?", a: "Unsere Pakete starten ab €39 pro Monat – je nach Anzahl Ihrer Termine. Im Beratungsgespräch finden wir gemeinsam das passende Paket. Kein Vertrag, monatlich kündbar." },
    { q: "Funktioniert das auch für meinen Betrieb – ich bin kein IT-Unternehmen?", a: "Genau dafür ist TerminStop gebaut. Die meisten unserer Kunden sind Handwerker, Friseure, Praxen oder KFZ-Betriebe – keine Vorkenntnisse nötig." },
    { q: "Was passiert, wenn ein Kunde nicht auf die SMS antwortet?", a: "Das System erinnert trotzdem – und Sie sehen in der Übersicht, wer bestätigt hat und wer nicht. So können Sie gezielt reagieren, bevor es zu einem Ausfall kommt." },
    { q: "Wie lange dauert es, bis ich erste Ergebnisse sehe?", a: "Die meisten Kunden berichten bereits nach der ersten Woche von weniger Ausfällen. Die Erinnerungen wirken sofort." },
    { q: "Gibt es eine Mindestlaufzeit oder einen Vertrag?", a: "Nein. TerminStop ist monatlich kündbar – ohne Mindestlaufzeit, ohne Kündigungsfristen. Kein Risiko, kein Kleingedrucktes." },
  ]

  const plans = [
    { name: "Starter", price: 39, sms: "0–100 SMS", perDay: "1,30", popular: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"] },
    { name: "Pro", price: 109, sms: "250–400 SMS", perDay: "3,63", popular: true, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"] },
    { name: "Max", price: 229, sms: "800–1000 SMS", perDay: "7,63", popular: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"] },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  const compRows = [
    { label: "Kosten",             them: "15–30 % Provision pro Buchung",  us: "Ab €39 / Monat — fertig" },
    { label: "Vertragslaufzeit",   them: "Oft 12+ Monate gebunden",        us: "Monatlich kündbar" },
    { label: "Ihre Kundendaten",   them: "Gehören der Plattform",          us: "Gehören ausschließlich Ihnen" },
    { label: "SMS-Erinnerungen",   them: "Nicht enthalten",                us: "Vollautomatisch" },
    { label: "Kundenkartei",       them: "Nicht enthalten",                us: "Mit Verlauf & Notizen" },
    { label: "Auswertungen",       them: "Kaum / eingeschränkt",           us: "Vollständig inklusive" },
    { label: "Kundenbindung",      them: "Kunden vergleichen Preise",      us: "Direktkontakt — kein Vergleich" },
  ]

  const serif = "'Cormorant Garamond', 'Playfair Display', Georgia, serif"
  const sans  = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  const navScrolled = scrollY > 40

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body { cursor: none !important; }
        a, button { cursor: none !important; }

        /* ── Custom Cursor ── */
        .cur-dot {
          position: fixed; width: 6px; height: 6px; background: #18A66D;
          border-radius: 50%; pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s, width 0.3s, height 0.3s, background 0.3s;
        }
        .cur-ring {
          position: fixed; width: 36px; height: 36px;
          border: 1px solid rgba(24,166,109,0.5); border-radius: 50%;
          pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
        }
        .cur-ring.hover {
          width: 56px; height: 56px;
          background: rgba(24,166,109,0.07);
          border-color: rgba(24,166,109,0.8);
        }

        /* ── Grain overlay ── */
        .grain::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.35; mix-blend-mode: overlay;
        }

        /* ── Marquee ── */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 40s linear infinite; }

        /* ── Word cycle ── */
        @keyframes wordReveal {
          0%   { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .word-anim { animation: wordReveal 2.8s cubic-bezier(0.16,1,0.3,1); }

        /* ── Float ── */
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        .floating { animation: float 10s ease-in-out infinite; }

        /* ── Pulse ── */
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.6); opacity: 0; } }
        .pulse-ring { animation: pulse 2.4s ease-out infinite; }

        /* ── Line draw ── */
        @keyframes drawLine { from { scaleX: 0; } to { scaleX: 1; } }

        /* ── Shimmer on CTA button ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* ── Buttons ── */
        .btn-emerald {
          display: inline-flex; align-items: center; justify-content: center;
          background: #18A66D; color: #fff; border: none; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: 0.01em;
          position: relative; overflow: hidden;
        }
        .btn-emerald::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          background-size: 200% 100%; background-position: -200% center;
        }
        .btn-emerald:hover::after { animation: shimmer 0.7s ease forwards; }
        .btn-emerald:hover { background: #149A60; box-shadow: 0 0 0 4px rgba(24,166,109,0.15); }

        .btn-ghost-lux {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.15); text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 500;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .btn-ghost-lux:hover { color: #fff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }

        .btn-outline-lux {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; color: #111318;
          border: 1px solid #D4D8DE; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 500;
          transition: color 0.2s, border-color 0.2s;
        }
        .btn-outline-lux:hover { border-color: #18A66D; color: #18A66D; }

        /* ── Divider line ── */
        .h-line { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
        .h-line-light { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent); }

        /* ── Section label ── */
        .sect-label {
          font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; color: #18A66D;
          display: flex; align-items: center; gap: 10px;
        }
        .sect-label::before {
          content: ''; display: block; width: 24px; height: 1px; background: #18A66D;
        }

        /* ── FAQ ── */
        .faq-row { border-bottom: 1px solid rgba(0,0,0,0.07); }
        .faq-row:first-child { border-top: 1px solid rgba(0,0,0,0.07); }

        /* ── Card hover ── */
        .lux-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1); }
        .lux-card:hover { transform: translateY(-4px); box-shadow: 0 24px 64px rgba(0,0,0,0.1) !important; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-two-col { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .hero-text { text-align: center; }
          .hero-ctas { justify-content: center !important; }
          .hero-stats { justify-content: center !important; }
        }
        @media (max-width: 768px) {
          .sec { padding: 80px 24px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .showcase-phone { display: none !important; }
          .comp-desk { display: none !important; }
          .comp-mob { display: block !important; }
          .nav-links { display: none !important; }
        }
        @media (min-width: 769px) {
          .comp-mob { display: none !important; }
        }
      `}</style>

      {/* ── Custom Cursor ── */}
      <div className="cur-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className={`cur-ring ${cursorHover ? "hover" : ""}`} style={{ left: cursorPos.x, top: cursorPos.y }} />

      <div style={{ fontFamily: sans, color: "#111318", background: "#fff", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════ */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          background: navScrolled ? "rgba(4,6,20,0.94)" : "transparent",
          backdropFilter: navScrolled ? "blur(24px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background 0.4s, border 0.4s, backdrop-filter 0.4s",
        }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}>
            <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: "#18A66D", letterSpacing: "-0.5px" }}>Termin</span>
            <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>Stop</span>
          </a>
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[["So funktioniert's","#wie-es-funktioniert"],["Preise","#preise"],["Login","/login"]].map(([l,h]) => (
              <a key={h} href={h} style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", fontWeight: 400, letterSpacing: "0.01em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.45)")}>{l}</a>
            ))}
            <a href="/demo" style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 500, padding: "7px 18px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, letterSpacing: "0.02em", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)" }}>Demo</a>
          </div>
          <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize: 13, padding: "9px 22px", borderRadius: 7 }}>
            Kostenlos anfragen
          </MagneticBtn>
        </nav>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="grain" style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          background: "linear-gradient(150deg, #020510 0%, #050A18 40%, #060C18 70%, #04080F 100%)",
          paddingTop: 60, overflow: "hidden", position: "relative",
        }}>
          {/* ambient orbs */}
          <div style={{ position:"absolute", top:"20%", left:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(24,166,109,0.06) 0%, transparent 65%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"10%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(24,166,109,0.04) 0%, transparent 65%)", pointerEvents:"none" }} />
          {/* decorative lines */}
          <div style={{ position:"absolute", top:0, left:"50%", width:1, height:"100%", background:"linear-gradient(180deg,transparent,rgba(255,255,255,0.03),transparent)", pointerEvents:"none" }} />

          <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 48px", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="hero-two-col">

            {/* LEFT */}
            <div className="hero-text">
              {/* live badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:44 }}>
                <span style={{ position:"relative", display:"flex", width:8, height:8 }}>
                  <span className="pulse-ring" style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(24,166,109,0.25)" }} />
                  <span style={{ position:"relative", width:8, height:8, borderRadius:"50%", background:"#18A66D", display:"block" }} />
                </span>
                <span style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:500, letterSpacing:"0.15em", textTransform:"uppercase" }}>
                  Digitales Terminbüro für{" "}
                  <span style={{ color:"rgba(255,255,255,0.7)", fontWeight:600 }} key={heroWord} className="word-anim">{words[heroWord]}</span>
                </span>
              </div>

              {/* headline — serif */}
              <h1 style={{ fontFamily:serif, fontSize:"clamp(52px,6.5vw,92px)", fontWeight:500, lineHeight:1.0, letterSpacing:"-1px", color:"#fff", marginBottom:8 }}>
                Ihr Betrieb.
              </h1>
              <h1 style={{ fontFamily:serif, fontSize:"clamp(52px,6.5vw,92px)", fontWeight:500, lineHeight:1.0, letterSpacing:"-1px", color:"#fff", marginBottom:8 }}>
                Digital.
              </h1>
              <h1 style={{ fontFamily:serif, fontSize:"clamp(52px,6.5vw,92px)", fontWeight:300, lineHeight:1.0, letterSpacing:"-1px", color:"#18A66D", fontStyle:"italic", marginBottom:40 }}>
                Automatisch.
              </h1>

              <p style={{ fontFamily:sans, fontSize:16, color:"rgba(255,255,255,0.35)", lineHeight:1.75, maxWidth:400, marginBottom:52, fontWeight:300, letterSpacing:"0.01em" }}>
                Kalender, Kundenkartei, SMS-Erinnerungen und Auswertungen — alles in einem System. In 10 Minuten eingerichtet.
              </p>

              <div className="hero-ctas" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:64 }}>
                <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize:14, padding:"14px 32px", borderRadius:8 }}>
                  Kostenlose Beratung →
                </MagneticBtn>
                <MagneticBtn href="/demo" className="btn-ghost-lux" style={{ fontSize:14, padding:"14px 28px", borderRadius:8 }}>
                  Live-Demo ansehen
                </MagneticBtn>
              </div>

              {/* stats */}
              <div className="hero-stats" style={{ display:"flex", gap:52, paddingTop:40, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { to:50, suffix:"+", label:"Betriebe aktiv" },
                  { to:95, suffix:"%", label:"Weniger Ausfälle" },
                  { to:10, suffix:" Min.", label:"Einrichtung" },
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontFamily:serif, fontSize:40, fontWeight:500, color:"#fff", letterSpacing:"-1px", lineHeight:1 }}>
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:6, fontWeight:400, letterSpacing:"0.05em", textTransform:"uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – phone */}
            <div className="hero-right" style={{ display:"flex", justifyContent:"flex-end" }}>
              <div className="floating" style={{ position:"relative" }}>
                <div style={{ position:"absolute", inset:-60, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(24,166,109,0.09) 0%, transparent 60%)", pointerEvents:"none" }} />
                {/* Outer shell */}
                <div style={{
                  background:"linear-gradient(145deg,#1a1a1a,#0a0a0a)", padding:14, borderRadius:56,
                  border:"1px solid rgba(255,255,255,0.07)",
                  boxShadow:"0 80px 160px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.08) inset",
                }}>
                  <div style={{ width:290, height:600, borderRadius:44, overflow:"hidden", background:"linear-gradient(180deg,#0a1409 0%,#060d07 100%)", position:"relative" }}>
                    {/* notch */}
                    <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:90, height:28, background:"#000", borderRadius:"0 0 18px 18px", zIndex:10 }} />
                    {/* status */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 22px 10px", marginTop:14 }}>
                      <span style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,0.25)", fontWeight:600 }}>9:41</span>
                      <div style={{ width:14, height:6, borderRadius:2, border:"1px solid rgba(255,255,255,0.18)", position:"relative" }}>
                        <div style={{ position:"absolute", left:2, top:1.5, bottom:1.5, width:"70%", background:"#18A66D", borderRadius:1 }} />
                      </div>
                    </div>
                    {/* notification card */}
                    <div style={{ margin:"4px 14px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"13px 15px", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:42, height:42, background:"linear-gradient(135deg,#18A66D,#0D7A4E)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ fontFamily:serif, color:"#fff", fontWeight:700, fontSize:18 }}>T</span>
                      </div>
                      <div>
                        <div style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:"#fff", marginBottom:1 }}>TerminStop</div>
                        <div style={{ fontFamily:sans, fontSize:10, color:"rgba(255,255,255,0.25)" }}>SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div style={{ marginLeft:"auto", width:7, height:7, background:"#18A66D", borderRadius:"50%" }} />
                    </div>
                    {/* message */}
                    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
                      <div style={{
                        background:"linear-gradient(135deg,#18A66D,#0f8a55)",
                        color:"#fff", fontFamily:sans, fontSize:12.5, lineHeight:1.7,
                        borderRadius:"20px 20px 20px 4px", padding:"15px 17px", maxWidth:"88%",
                        boxShadow:"0 8px 28px rgba(24,166,109,0.28)"
                      }}>
                        Hallo Frau Schmidt,<br /><br />
                        Sie haben morgen,<br /><strong>Dienstag um 14:00 Uhr</strong><br />einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>– Friseurstudio Elegance</span>
                      </div>
                      <div style={{ fontFamily:sans, fontSize:9, color:"rgba(255,255,255,0.18)", paddingLeft:4 }}>✓✓ Zugestellt · 24h vorher</div>
                      <div style={{ display:"flex", justifyContent:"flex-end" }}>
                        <div style={{
                          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
                          color:"rgba(255,255,255,0.75)", fontFamily:sans, fontSize:12.5, lineHeight:1.65,
                          borderRadius:"20px 20px 4px 20px", padding:"13px 15px", maxWidth:"78%"
                        }}>
                          Danke! Bin pünktlich da
                        </div>
                      </div>
                    </div>
                    {/* confirmed */}
                    <div style={{ position:"absolute", bottom:18, left:14, right:14 }}>
                      <div style={{ background:"rgba(24,166,109,0.1)", border:"1px solid rgba(24,166,109,0.2)", borderRadius:18, padding:"13px 15px", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:32, height:32, background:"#18A66D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ color:"#fff", fontSize:14 }}>✓</span>
                        </div>
                        <div>
                          <div style={{ fontFamily:sans, fontSize:11, fontWeight:700, color:"#4AE89B" }}>Termin bestätigt</div>
                          <div style={{ fontFamily:sans, fontSize:10, color:"rgba(255,255,255,0.28)" }}>Kundin erscheint pünktlich</div>
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
        <section style={{ background:"#fafafa", borderTop:"1px solid #EBEBED", borderBottom:"1px solid #EBEBED", padding:"14px 0", overflow:"hidden" }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-track" style={{ display:"flex", gap:56, flexShrink:0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                  <div style={{ width:3, height:3, background:"#18A66D", borderRadius:"50%", opacity:0.6 }} />
                  <span style={{ fontFamily:sans, fontSize:12, color:"#B8BDC8", fontWeight:400, whiteSpace:"nowrap", letterSpacing:"0.08em", textTransform:"uppercase" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PROBLEM
        ══════════════════════════════════════════ */}
        <section className="sec grain" style={{ background:"#fff", padding:"128px 48px", position:"relative" }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <Reveal>
              <div className="sect-label" style={{ marginBottom:28 }}>Das Problem</div>
              <div style={{ maxWidth:580, marginBottom:80 }}>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, marginBottom:24, color:"#111318" }}>
                  Zettelwirtschaft, Telefonate,<br />No-Shows.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#6B7280" }}>Täglich.</em>
                </h2>
                <p style={{ fontFamily:sans, fontSize:16, color:"#6B7280", lineHeight:1.8, fontWeight:300 }}>
                  Kein Überblick, kein System — und Kunden, die einfach nicht erscheinen. Das kostet Sie jeden Tag Zeit und Geld.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }} className="grid-3 stat-grid-border">
              <style>{`.stat-grid-border>div+div{border-left:1px solid #EBEBED} @media(max-width:768px){.stat-grid-border>div+div{border-left:none;border-top:1px solid #EBEBED}}`}</style>
              {[
                { to:50,   suffix:"€",  pre:"",     label:"Verlust pro Ausfall",  desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet." },
                { to:9,    suffix:"×",  pre:"bis ", label:"Ausfälle pro Woche",   desc:"Im Schnitt erlebt jeder Betrieb mehrfach pro Woche Ausfälle." },
                { to:2000, suffix:"€+", pre:"bis ", label:"Verlust pro Monat",    desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div style={{ padding:"56px 48px" }}>
                    <div style={{ fontFamily:serif, fontSize:"clamp(52px,5vw,72px)", fontWeight:500, color:"#111318", marginBottom:16, letterSpacing:"-2px", lineHeight:1 }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontFamily:sans, fontSize:13, fontWeight:600, color:"#111318", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>{item.label}</div>
                    <div style={{ fontFamily:sans, fontSize:14, color:"#9CA3AF", lineHeight:1.7 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="h-line-light" style={{ margin:"0 0 0 0" }} />

            <Reveal delay={120}>
              <div style={{ marginTop:16, background:"#04081A", borderRadius:12, padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontFamily:serif, fontSize:20, color:"#fff", marginBottom:6, fontWeight:400, letterSpacing:"-0.2px" }}>Die Lösung? Automatisch. Einmal einrichten. Fertig.</div>
                  <div style={{ fontFamily:sans, fontSize:13.5, color:"rgba(255,255,255,0.28)", fontWeight:300 }}>Kein Aufwand, keine Technik-Kenntnisse. Läuft dauerhaft von selbst.</div>
                </div>
                <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize:13.5, padding:"12px 26px", borderRadius:7, flexShrink:0 }}>
                  Jetzt anfragen →
                </MagneticBtn>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section id="wie-es-funktioniert" className="sec" style={{ background:"#04081A", padding:"128px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", right:"-10%", transform:"translateY(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(24,166,109,0.05) 0%, transparent 65%)", pointerEvents:"none" }} />
          <div style={{ maxWidth:920, margin:"0 auto", position:"relative" }}>
            <Reveal>
              <div className="sect-label" style={{ marginBottom:28, color:"rgba(24,166,109,0.9)" }}>
                <span style={{ background:"rgba(24,166,109,0.9)" }} />
                So funktioniert's
              </div>
              <div style={{ maxWidth:520, marginBottom:88 }}>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#fff", marginBottom:20 }}>
                  Drei Schritte.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"rgba(255,255,255,0.4)" }}>Dann läuft es.</em>
                </h2>
                <p style={{ fontFamily:sans, fontSize:15.5, color:"rgba(255,255,255,0.3)", lineHeight:1.8, fontWeight:300 }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[
                { num:"01", title:"Einmalig einrichten – in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein: Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive – kein technisches Vorwissen nötig.", tag:"Persönliche Begleitung" },
                { num:"02", title:"Ihr digitales Büro läuft – sofort und vollautomatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen automatisch raus – 24h vor jedem Termin. Sie sehen auf einen Blick, wer bestätigt hat und wer nicht.", tag:"Alles in einem" },
                { num:"03", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. Kein Hinterhertelefonieren, keine Zettelwirtschaft – TerminStop arbeitet dauerhaft für Sie im Hintergrund.", tag:"95 % Erfolgsquote" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ display:"flex", gap:0, borderTop: i===0 ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"44px 0" }}>
                    <div style={{ fontFamily:serif, fontSize:64, fontWeight:300, color:"rgba(255,255,255,0.07)", flexShrink:0, width:100, lineHeight:1, letterSpacing:"-2px" }}>{s.num}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:sans, fontSize:10.5, fontWeight:600, color:"#18A66D", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>{s.tag}</div>
                      <h3 style={{ fontFamily:serif, fontSize:"clamp(18px,2.5vw,26px)", fontWeight:500, color:"#fff", marginBottom:14, letterSpacing:"-0.3px", lineHeight:1.2 }}>{s.title}</h3>
                      <p style={{ fontFamily:sans, fontSize:14.5, color:"rgba(255,255,255,0.32)", lineHeight:1.75, fontWeight:300 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════ */}
        <section className="sec" style={{ background:"#fff", padding:"128px 48px" }}>
          <div style={{ maxWidth:1060, margin:"0 auto" }}>
            <Reveal>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:88, flexWrap:"wrap", gap:32 }}>
                <div>
                  <div className="sect-label" style={{ marginBottom:24 }}>Alles inklusive</div>
                  <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#111318" }}>
                    Kein Einzeltool.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#9CA3AF" }}>Ein komplettes System.</em>
                  </h2>
                </div>
                <p style={{ fontFamily:sans, fontSize:15, color:"#6B7280", lineHeight:1.8, maxWidth:320, fontWeight:300 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe — in einem einzigen System.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:2 }} className="grid-2">
              {[
                { num:"01", title:"Digitaler Kalender",            sub:"Notizbuch adé",    desc:"Tag- und Wochenübersicht für alle Termine. Auf dem Handy, Tablet oder PC — immer aktuell." },
                { num:"02", title:"Kundenkartei",                  sub:"Voller Überblick",  desc:"Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist." },
                { num:"03", title:"Automatische SMS-Erinnerungen", sub:"Vollautomatisch",   desc:"24h vor jedem Termin geht eine personalisierte SMS raus — ohne Ihr Zutun. Nie wieder hinterhertelefonieren." },
                { num:"04", title:"Auswertungen & Einblicke",      sub:"Datengestützt",    desc:"Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Ihr Betrieb schwarz auf weiß." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="lux-card" style={{ background:"#FAFAFA", border:"1px solid #EBEBED", padding:"44px 40px", height:"100%", boxSizing:"border-box" as any }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
                      <span style={{ fontFamily:sans, fontSize:10.5, fontWeight:600, color:"#18A66D", letterSpacing:"0.1em", textTransform:"uppercase" }}>{f.sub}</span>
                      <span style={{ fontFamily:serif, fontSize:32, fontWeight:300, color:"rgba(0,0,0,0.07)", letterSpacing:"-1px" }}>{f.num}</span>
                    </div>
                    <h3 style={{ fontFamily:serif, fontSize:"clamp(20px,2.2vw,28px)", fontWeight:500, color:"#111318", marginBottom:16, letterSpacing:"-0.3px", lineHeight:1.15 }}>{f.title}</h3>
                    <p style={{ fontFamily:sans, fontSize:14, color:"#6B7280", lineHeight:1.75, fontWeight:300 }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop:2, background:"#04081A", padding:"26px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
                <p style={{ fontFamily:sans, fontSize:14, color:"rgba(255,255,255,0.3)", margin:0, fontWeight:300 }}>
                  Alles in einem Paket · Kalender + Kundenkartei + SMS + Auswertungen · <strong style={{ color:"rgba(255,255,255,0.6)", fontWeight:500 }}>ab €39/Monat</strong>
                </p>
                <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize:13.5, padding:"11px 22px", borderRadius:7, flexShrink:0 }}>
                  Kostenlos anfragen →
                </MagneticBtn>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SHOWCASE
        ══════════════════════════════════════════ */}
        <section className="sec" style={{ background:"#FAFAFA", padding:"128px 48px", borderTop:"1px solid #EBEBED" }}>
          <div style={{ maxWidth:1060, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:96, alignItems:"center" }} className="grid-2 showcase-grid">
            <style>{`.showcase-grid > :first-child { order: 0 } @media(max-width:768px){ .showcase-grid > :first-child { order: 1 } }`}</style>

            {/* phone */}
            <div className="showcase-phone" style={{ display:"flex", justifyContent:"center" }}>
              <div style={{ position:"relative" }}>
                <div style={{ background:"linear-gradient(145deg,#e8e8e8,#f8f8f8)", padding:12, borderRadius:44, boxShadow:"0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                  <div style={{ width:282, height:566, borderRadius:34, overflow:"hidden", background:"#fff" }}>
                    {/* header */}
                    <div style={{ background:"linear-gradient(135deg,#18A66D,#0f8a55)", padding:"28px 20px 22px" }}>
                      <div style={{ fontFamily:sans, color:"rgba(255,255,255,0.55)", fontSize:11, marginBottom:4, fontWeight:400 }}>Guten Morgen</div>
                      <div style={{ fontFamily:serif, color:"#fff", fontWeight:500, fontSize:22, marginBottom:12, letterSpacing:"-0.3px" }}>Heute, 6 Termine</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,0.14)", borderRadius:8, padding:"5px 11px", color:"rgba(255,255,255,0.85)", fontSize:11, fontFamily:sans, fontWeight:500 }}>5 ✓ bestätigt</div>
                        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:8, padding:"5px 11px", color:"rgba(255,255,255,0.45)", fontSize:11, fontFamily:sans }}>1 ausstehend</div>
                      </div>
                    </div>
                    {/* next card */}
                    <div style={{ margin:"-12px 14px 10px", background:"#fff", borderRadius:14, padding:14, boxShadow:"0 4px 20px rgba(0,0,0,0.08)", position:"relative", zIndex:1, border:"1px solid #F0F0F0" }}>
                      <div style={{ fontFamily:sans, fontSize:10, color:"#9CA3AF", marginBottom:4, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Nächster Termin</div>
                      <div style={{ fontFamily:serif, fontSize:16, fontWeight:500, color:"#111318" }}>Maria Schmidt</div>
                      <div style={{ fontFamily:sans, fontSize:12, color:"#6B7280" }}>14:00 Uhr · Damenhaarschnitt</div>
                      <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:5, height:5, background:"#18A66D", borderRadius:"50%" }} />
                        <span style={{ fontFamily:sans, fontSize:10, color:"#18A66D", fontWeight:600 }}>SMS gesendet ✓</span>
                      </div>
                    </div>
                    {/* list */}
                    <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:5 }}>
                      {[
                        { time:"09:00", name:"Thomas B.", s:"✓", c:"#18A66D" },
                        { time:"10:30", name:"Anna L.",   s:"✓", c:"#18A66D" },
                        { time:"12:00", name:"Klaus M.",  s:"✓", c:"#18A66D" },
                        { time:"14:00", name:"Maria S.",  s:"→", c:"#F59E0B" },
                        { time:"16:00", name:"Peter H.",  s:"○", c:"#D1D5DB" },
                      ].map((a, j) => (
                        <div key={j} style={{ display:"flex", alignItems:"center", gap:10, background:"#FAFAFA", borderRadius:10, padding:"9px 12px" }}>
                          <span style={{ fontFamily:sans, fontSize:11, color:"#9CA3AF", width:34, flexShrink:0 }}>{a.time}</span>
                          <span style={{ fontFamily:sans, fontSize:11, color:"#111318", fontWeight:500, flex:1 }}>{a.name}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:a.c }}>{a.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Reveal delay={60}>
              <div>
                <div className="sect-label" style={{ marginBottom:28 }}>Das Dashboard</div>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(32px,3.8vw,52px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.07, color:"#111318", marginBottom:20 }}>
                  Alles im Blick.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#9CA3AF" }}>Nichts verpassen.</em>
                </h2>
                <p style={{ fontFamily:sans, fontSize:15.5, color:"#6B7280", lineHeight:1.8, marginBottom:48, fontWeight:300 }}>
                  Ihr komplettes Terminmanagement an einem Ort — übersichtlich, einfach, immer aktuell.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {[
                    { title:"Tagesübersicht auf einen Blick",    desc:"Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                    { title:"Automatische SMS-Erinnerungen",     desc:"24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                    { title:"Kundenkartei",                      desc:"Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                    { title:"Auswertungen & Einblicke",          desc:"Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
                  ].map((f, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:20, padding:"20px 0", borderBottom:"1px solid #F0F0F0" }}>
                      <div style={{ width:1, height:"100%", minHeight:20, background:"#18A66D", flexShrink:0, marginTop:4, alignSelf:"stretch" }} />
                      <div>
                        <div style={{ fontFamily:serif, fontSize:17, fontWeight:500, color:"#111318", marginBottom:4, letterSpacing:"-0.2px" }}>{f.title}</div>
                        <div style={{ fontFamily:sans, fontSize:13.5, color:"#6B7280", lineHeight:1.65, fontWeight:300 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMPARISON
        ══════════════════════════════════════════ */}
        <section className="sec grain" style={{ background:"#04081A", padding:"128px 48px", position:"relative" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div className="sect-label" style={{ marginBottom:28, color:"rgba(24,166,109,0.9)" }}>
                <span style={{ background:"rgba(24,166,109,0.9)" }} />
                Der Vergleich
              </div>
              <div style={{ maxWidth:560, marginBottom:80 }}>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#fff", marginBottom:20 }}>
                  Was andere kosten.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#18A66D" }}>Was Sie bekommen.</em>
                </h2>
                <p style={{ fontFamily:sans, fontSize:15.5, color:"rgba(255,255,255,0.25)", lineHeight:1.8, fontWeight:300 }}>
                  Buchungsportale klingen verlockend — bis man genau hinschaut.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              {/* Desktop */}
              <div className="comp-desk" style={{ border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1fr", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ padding:"18px 28px" }} />
                  <div style={{ padding:"18px 20px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,0.2)", fontWeight:500, letterSpacing:"0.05em" }}>Klassische Portale</span>
                  </div>
                  <div style={{ padding:"18px 20px", textAlign:"center", background:"rgba(24,166,109,0.05)", borderLeft:"1px solid rgba(24,166,109,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:serif, fontSize:15, fontWeight:600, color:"#4AE89B" }}>TerminStop</span>
                  </div>
                </div>
                {compRows.map((row, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1fr", borderBottom: i < compRows.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ padding:"16px 28px", display:"flex", alignItems:"center" }}>
                      <span style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,0.3)", fontWeight:400 }}>{row.label}</span>
                    </div>
                    <div style={{ padding:"16px 20px", borderLeft:"1px solid rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,0.15)", lineHeight:1.5, textAlign:"center" as any }}>{row.them}</span>
                    </div>
                    <div style={{ padding:"16px 20px", background:"rgba(24,166,109,0.03)", borderLeft:"1px solid rgba(24,166,109,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:sans, fontSize:12, color:"rgba(74,232,155,0.9)", fontWeight:500, lineHeight:1.5, textAlign:"center" as any }}>{row.us}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile */}
              <div className="comp-mob" style={{ display:"none" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                  <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", padding:"12px", textAlign:"center" as any, borderRadius:4 }}>
                    <span style={{ fontFamily:sans, fontSize:11, color:"rgba(255,255,255,0.25)", fontWeight:500 }}>Klassische Portale</span>
                  </div>
                  <div style={{ background:"rgba(24,166,109,0.08)", border:"1px solid rgba(24,166,109,0.2)", padding:"12px", textAlign:"center" as any, borderRadius:4 }}>
                    <span style={{ fontFamily:serif, fontSize:13, fontWeight:600, color:"#4AE89B" }}>TerminStop</span>
                  </div>
                </div>
                {compRows.map((row, i) => (
                  <div key={i} style={{ border:"1px solid rgba(255,255,255,0.05)", marginBottom:6, padding:"14px 16px", borderRadius:4 }}>
                    <div style={{ fontFamily:sans, fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{row.label}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <div style={{ background:"rgba(255,255,255,0.03)", padding:"10px 12px", borderRadius:4 }}>
                        <span style={{ fontFamily:sans, fontSize:11.5, color:"rgba(255,255,255,0.2)", lineHeight:1.5 }}>{row.them}</span>
                      </div>
                      <div style={{ background:"rgba(24,166,109,0.06)", border:"1px solid rgba(24,166,109,0.12)", padding:"10px 12px", borderRadius:4 }}>
                        <span style={{ fontFamily:sans, fontSize:11.5, color:"rgba(74,232,155,0.9)", fontWeight:500, lineHeight:1.5 }}>{row.us}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ marginTop:48, textAlign:"center" }}>
                <p style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,0.18)", marginBottom:24, fontWeight:300 }}>
                  Bei 100 Buchungen/Monat à €50 zahlen Sie über ein Portal bis zu{" "}
                  <strong style={{ color:"rgba(255,255,255,0.38)", fontWeight:500 }}>€1.500 Provision</strong>.
                  TerminStop kostet <strong style={{ color:"#4AE89B", fontWeight:500 }}>€39</strong>.
                </p>
                <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize:15, padding:"14px 32px", borderRadius:8 }}>
                  Jetzt wechseln →
                </MagneticBtn>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════════ */}
        <section className="sec" style={{ background:"#fff", padding:"128px 48px", borderTop:"1px solid #EBEBED" }}>
          <div style={{ maxWidth:1060, margin:"0 auto" }}>
            <Reveal>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:80, flexWrap:"wrap", gap:24 }}>
                <div>
                  <div className="sect-label" style={{ marginBottom:24 }}>Echte Ergebnisse</div>
                  <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#111318" }}>
                    Was Betriebe<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#9CA3AF" }}>berichten.</em>
                  </h2>
                </div>
                <p style={{ fontFamily:sans, fontSize:14, color:"#9CA3AF", margin:0, fontWeight:300 }}>Keine Versprechen – nur echte Erfahrungen.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }} className="grid-2">
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="lux-card" style={{ background:"#FAFAFA", border:"1px solid #EBEBED", padding:"44px 40px", display:"flex", flexDirection:"column", height:"100%", boxSizing:"border-box" as any }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
                      <span style={{ fontFamily:sans, fontSize:10.5, fontWeight:600, color:"#18A66D", letterSpacing:"0.1em", textTransform:"uppercase" }}>{r.result}</span>
                      <span style={{ color:"#FBBF24", fontSize:11, letterSpacing:"2px" }}>★★★★★</span>
                    </div>
                    <p style={{ fontFamily:serif, fontSize:17, color:"#374151", lineHeight:1.75, flex:1, marginBottom:32, fontStyle:"italic", fontWeight:400 }}>
                      „{r.text}"
                    </p>
                    <div style={{ display:"flex", alignItems:"center", gap:14, paddingTop:24, borderTop:"1px solid #EBEBED" }}>
                      <div style={{ width:36, height:36, background:"linear-gradient(135deg,#18A66D,#0A7A4F)", color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:serif, fontSize:15, fontWeight:600 }}>{r.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontFamily:serif, fontSize:14, fontWeight:600, color:"#111318" }}>{r.name}</div>
                        <div style={{ fontFamily:sans, fontSize:12, color:"#9CA3AF" }}>{r.role} · {r.city}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════ */}
        <section id="preise" className="sec" style={{ background:"#FAFAFA", padding:"128px 48px", borderTop:"1px solid #EBEBED" }}>
          <div style={{ maxWidth:980, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div className="sect-label" style={{ marginBottom:24, justifyContent:"center" }}>Preise</div>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#111318", marginBottom:16 }}>
                  Einfach. Transparent.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#9CA3AF" }}>Ohne Überraschungen.</em>
                </h2>
                <p style={{ fontFamily:sans, fontSize:15.5, color:"#6B7280", margin:0, fontWeight:300 }}>Monatlich kündbar, kein Vertrag.</p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div style={{ maxWidth:480, margin:"36px auto 64px", background:"#fff", border:"1px solid rgba(24,166,109,0.15)", padding:"16px 24px", display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ color:"#18A66D", fontSize:16, fontWeight:300 }}>↑</span>
                <p style={{ fontFamily:sans, fontSize:13.5, color:"#6B7280", margin:0, lineHeight:1.65, fontWeight:300 }}>
                  Schon <strong style={{ color:"#111318", fontWeight:500 }}>2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig ab.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, alignItems:"start" }} className="grid-3">
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 70}>
                  {plan.popular ? (
                    <div style={{ background:"#04081A", border:"1px solid rgba(24,166,109,0.2)", padding:"44px 36px", position:"relative", boxShadow:"0 32px 80px rgba(24,166,109,0.08)" }}>
                      <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#18A66D", color:"#fff", fontFamily:sans, fontSize:10.5, fontWeight:600, padding:"4px 18px", letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>Meistgewählt</div>
                      <div style={{ fontFamily:sans, fontSize:10.5, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(74,232,155,0.7)", marginBottom:20 }}>{plan.name}</div>
                      <div style={{ marginBottom:4 }}>
                        <span style={{ fontFamily:serif, fontSize:60, fontWeight:400, color:"#fff", letterSpacing:"-3px", lineHeight:1 }}>€{plan.price}</span>
                        <span style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,0.25)", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,0.2)", marginBottom:32, fontWeight:300 }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <span style={{ color:"#4AE89B", fontSize:11, flexShrink:0 }}>✓</span>
                            <span style={{ fontFamily:sans, fontSize:13.5, color:"rgba(255,255,255,0.5)", fontWeight:300 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <MagneticBtn href="/lead" className="btn-emerald" style={{ display:"block", textAlign:"center", fontSize:13.5, padding:"14px 0", width:"100%", boxSizing:"border-box", borderRadius:6 }}>
                        Jetzt anfragen →
                      </MagneticBtn>
                    </div>
                  ) : (
                    <div className="lux-card" style={{ background:"#fff", border:"1px solid #EBEBED", padding:"44px 36px", boxSizing:"border-box" as any }}>
                      <div style={{ fontFamily:sans, fontSize:10.5, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:20 }}>{plan.name}</div>
                      <div style={{ marginBottom:4 }}>
                        <span style={{ fontFamily:serif, fontSize:60, fontWeight:400, color:"#111318", letterSpacing:"-3px", lineHeight:1 }}>€{plan.price}</span>
                        <span style={{ fontFamily:sans, fontSize:13, color:"#9CA3AF", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontFamily:sans, fontSize:12, color:"#9CA3AF", marginBottom:32, fontWeight:300 }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <span style={{ color:"#18A66D", fontSize:11, flexShrink:0 }}>✓</span>
                            <span style={{ fontFamily:sans, fontSize:13.5, color:"#6B7280", fontWeight:300 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <MagneticBtn href="/lead" className="btn-outline-lux" style={{ display:"block", textAlign:"center", fontSize:13.5, padding:"14px 0", width:"100%", boxSizing:"border-box", borderRadius:6 }}>
                        Jetzt anfragen →
                      </MagneticBtn>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            <p style={{ textAlign:"center", fontFamily:sans, fontSize:11.5, color:"#C4C9D4", marginTop:20, fontWeight:300, letterSpacing:"0.02em" }}>
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section className="sec" style={{ background:"#fff", padding:"128px 48px", borderTop:"1px solid #EBEBED" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <Reveal>
              <div style={{ marginBottom:72 }}>
                <div className="sect-label" style={{ marginBottom:24 }}>FAQ</div>
                <h2 style={{ fontFamily:serif, fontSize:"clamp(36px,4.5vw,62px)", fontWeight:500, letterSpacing:"-0.5px", lineHeight:1.05, color:"#111318", marginBottom:12 }}>
                  Häufige Fragen.
                </h2>
                <p style={{ fontFamily:sans, fontSize:15.5, color:"#9CA3AF", fontWeight:300 }}>Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-row">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width:"100%", textAlign:"left", padding:"24px 0", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, background:"none", border:"none", cursor:"none" }}
                  >
                    <span style={{ fontFamily:serif, fontSize:18, fontWeight:500, color:"#111318", lineHeight:1.4, letterSpacing:"-0.2px" }}>{faq.q}</span>
                    <span style={{ color:"#18A66D", fontSize:24, flexShrink:0, fontWeight:300, lineHeight:1, transform: openFaq === i ? "rotate(45deg)" : "none", transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1)", display:"block" }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: openFaq === i ? "400px" : "0",
                    overflow:"hidden",
                    transition:"max-height 0.4s cubic-bezier(0.16,1,0.3,1)"
                  }}>
                    <p style={{ fontFamily:sans, paddingBottom:24, fontSize:14.5, color:"#6B7280", lineHeight:1.8, paddingRight:48, fontWeight:300, margin:0 }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════ */}
        <section className="sec grain" style={{ background:"linear-gradient(155deg,#020510 0%,#050A18 50%,#04080F 100%)", padding:"160px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:800, height:600, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(24,166,109,0.07) 0%, transparent 60%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"20%", left:"15%", width:1, height:"60%", background:"linear-gradient(180deg,transparent,rgba(24,166,109,0.12),transparent)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"20%", right:"15%", width:1, height:"60%", background:"linear-gradient(180deg,transparent,rgba(24,166,109,0.08),transparent)", pointerEvents:"none" }} />

          <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative" }}>
            <Reveal>
              <div style={{ fontFamily:sans, display:"inline-flex", alignItems:"center", gap:8, color:"rgba(74,232,155,0.7)", fontSize:11, fontWeight:500, padding:"8px 20px", border:"1px solid rgba(24,166,109,0.15)", marginBottom:52, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 style={{ fontFamily:serif, fontSize:"clamp(48px,7vw,96px)", fontWeight:400, color:"#fff", letterSpacing:"-2px", lineHeight:0.98, marginBottom:28 }}>
                Ihr Betrieb.<br /><em style={{ fontStyle:"italic", fontWeight:300, color:"#18A66D" }}>Endlich digital.</em>
              </h2>
              <p style={{ fontFamily:sans, fontSize:16, color:"rgba(255,255,255,0.28)", lineHeight:1.8, maxWidth:480, margin:"0 auto 56px", fontWeight:300 }}>
                Kalender, Kundenkartei, SMS-Erinnerungen und Auswertungen — in einem System, in 10 Minuten eingerichtet.
              </p>
              <MagneticBtn href="/lead" className="btn-emerald" style={{ fontSize:16, padding:"18px 44px", borderRadius:8 }}>
                Kostenloses Gespräch sichern →
              </MagneticBtn>
              <div style={{ marginTop:44, display:"flex", justifyContent:"center", gap:36, flexWrap:"wrap" }}>
                {["Kein Vertrag","Monatlich kündbar","Persönliches Onboarding","In 10 Min. startklar"].map((t, i) => (
                  <span key={i} style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,0.18)", fontWeight:300, letterSpacing:"0.03em" }}>— {t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ background:"#04081A", borderTop:"1px solid rgba(255,255,255,0.05)", padding:"28px 48px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:1 }}>
              <span style={{ fontFamily:serif, fontSize:18, fontWeight:600, color:"#18A66D", letterSpacing:"-0.3px" }}>Termin</span>
              <span style={{ fontFamily:serif, fontSize:18, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:"-0.3px" }}>Stop</span>
            </a>
            <div style={{ display:"flex", gap:28 }}>
              {[["Impressum","/impressum"],["Datenschutz","/datenschutz"],["AGB","/agb"],["AVV","/avv"],["Login","/login"]].map(([l, h]) => (
                <a key={h} href={h} style={{ fontFamily:sans, fontSize:12, color:"rgba(255,255,255,0.2)", textDecoration:"none", fontWeight:300, letterSpacing:"0.02em", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}>{l}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
