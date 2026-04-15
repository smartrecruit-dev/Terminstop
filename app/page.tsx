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

/* ─── Mock Dashboard Preview ────────────────────────────────── */
function DashboardMock() {
  const G = "#18A66D"; const B = "#E5E7EB"; const M = "#6B7280"; const T = "#111827"
  const appts = [
    { time:"09:00", name:"Michael B.", service:"Haarschnitt", status:"confirmed" },
    { time:"10:30", name:"Sarah L.",   service:"Coloring",    status:"confirmed" },
    { time:"12:00", name:"Klaus W.",   service:"Bart",        status:"pending"   },
    { time:"14:00", name:"Anna P.",    service:"Haarschnitt", status:"confirmed" },
    { time:"15:30", name:"Tim R.",     service:"Styling",     status:"confirmed" },
  ]
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${B}`, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)", fontFamily:"inherit" }}>
      {/* Browser bar */}
      <div style={{ background:"#F3F4F6", borderBottom:`1px solid ${B}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
        </div>
        <div style={{ flex:1, background:"#E5E7EB", borderRadius:6, padding:"4px 12px", fontSize:11, color:M, textAlign:"center", maxWidth:240, margin:"0 auto" }}>
          app.terminstop.de/dashboard
        </div>
      </div>
      {/* App header */}
      <div style={{ borderBottom:`1px solid ${B}`, padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontWeight:800, fontSize:14 }}><span style={{ color:G }}>Termin</span><span style={{ color:T }}>Stop</span></span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:8, height:8, background:G, borderRadius:"50%" }} />
          <span style={{ fontSize:11, color:G, fontWeight:600 }}>System aktiv</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:"16px 20px" }}>
        {/* Mini stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
          {[
            { label:"Heute", val:"5", icon:"📅" },
            { label:"SMS gesendet", val:"4", icon:"✉️" },
            { label:"Ausfälle", val:"0", icon:"✅" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#F9FAFB", border:`1px solid ${B}`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontSize:16 }}>{s.icon}</div>
              <div style={{ fontSize:16, fontWeight:900, color:T, lineHeight:1.2 }}>{s.val}</div>
              <div style={{ fontSize:10, color:M, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Appointment list */}
        <div style={{ fontSize:11, fontWeight:700, color:M, letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Heutige Termine</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {appts.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:a.status==="pending"?"#FFFBEB":"#F9FAFB", border:`1px solid ${a.status==="pending"?"#FDE68A":B}`, borderRadius:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:M, width:36, flexShrink:0 }}>{a.time}</div>
              <div style={{ width:26, height:26, background: a.status==="pending"?"#FEF3C7":G, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color: a.status==="pending"?"#92400E":"#fff", fontWeight:800, flexShrink:0 }}>
                {a.name.charAt(0)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.name}</div>
                <div style={{ fontSize:10, color:M }}>{a.service}</div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:980, background: a.status==="pending"?"#FEF3C7":"#ECFDF5", color: a.status==="pending"?"#B45309":"#065F46" }}>
                {a.status==="pending"?"Ausstehend":"✓ SMS"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Phone SMS Mock ────────────────────────────────────────── */
function SmsMock() {
  const G = "#18A66D"
  return (
    <div style={{ width:220, background:"#1C1C1E", borderRadius:36, padding:"10px", boxShadow:"0 24px 60px rgba(0,0,0,0.2)", border:"6px solid #2C2C2E", position:"relative" }}>
      {/* Notch */}
      <div style={{ width:80, height:20, background:"#1C1C1E", borderRadius:"0 0 14px 14px", margin:"0 auto 8px", position:"relative", zIndex:2 }} />
      <div style={{ background:"#fff", borderRadius:26, overflow:"hidden", minHeight:320, padding:"16px 12px" }}>
        {/* Status bar */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#111", fontWeight:600, marginBottom:14, padding:"0 4px" }}>
          <span>9:41</span>
          <span>●●●</span>
        </div>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ width:40, height:40, background:"#E5E7EB", borderRadius:"50%", margin:"0 auto 6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💈</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#111" }}>Friseur Müller</div>
          <div style={{ fontSize:10, color:"#8E8E93" }}>SMS-Nachricht</div>
        </div>
        {/* Bubble */}
        <div style={{ background:"#E9E9EB", borderRadius:"18px 18px 18px 4px", padding:"10px 14px", fontSize:12, color:"#111", lineHeight:1.5, marginBottom:8 }}>
          Hallo Michael, zur Erinnerung: Ihr Termin bei <strong>Friseur Müller</strong> ist morgen um <strong>10:00 Uhr</strong>. Bis dann! 👋
        </div>
        <div style={{ fontSize:10, color:"#8E8E93", marginLeft:4, marginBottom:16 }}>Heute, 14:00 Uhr</div>
        {/* Reply bar */}
        <div style={{ background:"#F2F2F7", borderRadius:20, padding:"8px 14px", fontSize:11, color:"#8E8E93", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>Nachricht</span>
          <span style={{ color:G, fontWeight:700, fontSize:13 }}>↑</span>
        </div>
      </div>
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
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Das System läuft einfach.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle" },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h / Woche" },
    { text: "Endlich kein Papierchaos mehr. Ich sehe alle Termine auf einen Blick und die SMS gehen automatisch raus. Meine Kunden fragen mich, wie ich das mache.", name: "Mehmet A.", role: "Kfz-Werkstatt", city: "Stuttgart", result: "0 Ausfälle / Woche" },
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
    { name: "Einsteiger", for: "Bis ca. 100 Termine / Monat", highlight: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"] },
    { name: "Wachstum", for: "100–400 Termine / Monat", highlight: true, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"] },
    { name: "Profi", for: "Stark ausgelastete Betriebe", highlight: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"] },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  const addonFeatures = [
    { icon:"🔗", title:"Eigene Buchungsseite", desc:"Ihre persönliche URL — Kunden buchen direkt, ohne Telefonanruf." },
    { icon:"📲", title:"QR-Code zum Aufstellen", desc:"An der Kasse oder im Schaufenster — Kunden scannen und buchen sofort." },
    { icon:"📥", title:"Anfragen im Dashboard", desc:"Alle Online-Buchungen landen direkt bei Ihnen. Sie bestätigen mit einem Klick." },
    { icon:"✉️", title:"Automatische Bestätigungs-SMS", desc:"Sobald Sie bestätigen, bekommt der Kunde sofort eine SMS — ohne Ihr Zutun." },
    { icon:"🗂️", title:"Leistungen wählbar", desc:"Kunden können Ihre Leistungen auswählen oder einfach einen offenen Termin anfragen." },
    { icon:"📞", title:"Rückruf-Funktion", desc:"Kunden können auch einen Rückruf anfragen — Sie werden benachrichtigt." },
  ]

  const F  = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"
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

  return (
    <>
      <style>{`
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(8px); }
          15%, 85% { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-8px); }
        }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes smsIn {
          0%   { opacity:0; transform:translateY(16px) scale(.96); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }

        .word-slot   { animation: wordIn 2.8s cubic-bezier(.16,1,.3,1); }
        .marquee-wrap{ animation: marquee 38s linear infinite; }
        .sms-pop     { animation: smsIn .55s cubic-bezier(.16,1,.3,1) forwards; }

        .nav-desktop-only { display:none!important; }
        @media(min-width:768px){ .nav-desktop-only { display:inline-flex!important; } }
        .nav-cta-short { display:inline; }
        .nav-cta-long  { display:none; }
        @media(min-width:768px){ .nav-cta-short{display:none;} .nav-cta-long{display:inline;} }

        .card-lift { transition:box-shadow .22s ease, transform .22s ease, border-color .22s ease; }
        .card-lift:hover { box-shadow:0 10px 36px rgba(0,0,0,0.09)!important; transform:translateY(-3px); border-color:#D1D5DB!important; }

        .btn-primary {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:#18A66D; color:#fff; border:none; border-radius:10px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition:background .18s, box-shadow .18s, transform .15s;
          box-shadow:0 2px 10px rgba(24,166,109,0.25); letter-spacing:-.1px;
        }
        .btn-primary:hover { background:#15955F; box-shadow:0 4px 20px rgba(24,166,109,0.35); transform:translateY(-1px); }

        .btn-outline {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:#fff; color:#374151; border:1.5px solid #E5E7EB; border-radius:10px;
          font-weight:600; cursor:pointer; text-decoration:none;
          transition:border-color .18s, background .18s, color .18s;
        }
        .btn-outline:hover { border-color:#18A66D; color:#18A66D; background:#F0FBF6; }

        .btn-white {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:#fff; color:#18A66D; border:none; border-radius:10px;
          font-weight:700; cursor:pointer; text-decoration:none;
          transition:background .18s, transform .15s; box-shadow:0 2px 12px rgba(0,0,0,0.12);
        }
        .btn-white:hover { background:#F0FBF6; transform:translateY(-1px); }

        .faq-item { border-bottom:1px solid #F3F4F6; }
        .faq-item:first-child { border-top:1px solid #F3F4F6; }
        .faq-btn { background:none; border:none; cursor:pointer; width:100%; text-align:left; }
        .faq-btn:hover { background:#FAFAFA; }

        .tag-green {
          display:inline-flex; align-items:center; gap:6px;
          background:#F0FBF6; border:1px solid #BBF7D0;
          color:#16A34A; font-size:11px; font-weight:700; letter-spacing:.4px;
          padding:5px 13px; border-radius:980px;
        }

        .before-after-col { flex:1; min-width:260px; }

        @media(max-width:768px){
          .sec-pad { padding-top:64px!important; padding-bottom:64px!important; padding-left:20px!important; padding-right:20px!important; }
          .hero-row { flex-direction:column!important; }
          .hide-mobile { display:none!important; }
          .hero-h1 { font-size:40px!important; letter-spacing:-2px!important; }
          .sms-float { display:none!important; }
        }
        @media(min-width:769px){ .show-mobile-only { display:none!important; } }
      `}</style>

      <div style={{ fontFamily:F, color:TXT, background:BG, overflowX:"hidden" }}>

        {/* ══ NAVBAR ══════════════════════════════════════════════ */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100, height:60,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 28px",
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(20px) saturate(150%)",
          borderBottom:`1px solid ${BORDER}`,
        }}>
          <a href="/" style={{ textDecoration:"none", fontSize:16, fontWeight:800, letterSpacing:"-.5px", display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, background:GREEN, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>T</span>
            </div>
            <span style={{ color:TXT }}>Termin<span style={{ color:GREEN }}>Stop</span></span>
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <a href="#wie-es-funktioniert" className="nav-desktop-only" style={{ fontSize:14, color:MUTED, textDecoration:"none", fontWeight:500, padding:"6px 12px", borderRadius:8 }}>So funktioniert's</a>
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

        {/* ══ HERO ════════════════════════════════════════════════ */}
        <section style={{
          paddingTop:60, position:"relative", overflow:"hidden",
          background:`linear-gradient(180deg,#F0FBF6 0%,#FFFFFF 50%)`,
        }}>
          {/* Grid */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"linear-gradient(rgba(24,166,109,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(24,166,109,0.06) 1px,transparent 1px)",
            backgroundSize:"48px 48px",
            maskImage:"radial-gradient(ellipse 80% 50% at 50% 0%,black 30%,transparent 100%)",
          }} />

          <div style={{ maxWidth:1100, margin:"0 auto", padding:"64px 32px 0", position:"relative", zIndex:2 }}>
            {/* Top area: text left */}
            <div style={{ textAlign:"center", maxWidth:720, margin:"0 auto 52px" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:980, padding:"6px 16px", marginBottom:28 }}>
                <span style={{ width:6, height:6, background:GREEN, borderRadius:"50%", display:"inline-block" }} />
                <span style={{ fontSize:13, color:GREEN, fontWeight:600 }}>
                  Digitales Terminbüro für Ihren&nbsp;
                  <span style={{ fontWeight:800 }} key={heroWord} className="word-slot">{words[heroWord]}</span>
                </span>
              </div>

              <h1 className="hero-h1" style={{ fontSize:"clamp(42px,6vw,76px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-2.5px", margin:"0 0 22px", color:TXT }}>
                Ihr Betrieb.{" "}
                <span style={{ color:GREEN }}>Automatisch.</span>
              </h1>

              <p style={{ fontSize:"clamp(16px,2vw,18px)", color:MUTED, lineHeight:1.75, maxWidth:520, margin:"0 auto 36px", fontWeight:400 }}>
                TerminStop ersetzt Zettelwirtschaft und Hinterhertelefonieren — mit Kalender, Kundenkartei und automatischen SMS-Erinnerungen. In 10 Minuten eingerichtet.
              </p>

              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:12 }}>
                <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"15px 34px" }}>Kostenlose Beratung →</a>
                <a href="/demo" className="btn-outline" style={{ fontSize:16, padding:"15px 28px" }}>Live-Demo ansehen</a>
              </div>
              <p style={{ fontSize:12, color:MUTED2, margin:0 }}>✓ Kein Vertrag &nbsp;·&nbsp; ✓ Monatlich kündbar &nbsp;·&nbsp; ✓ Persönliches Onboarding</p>
            </div>

            {/* Dashboard preview */}
            <div style={{ position:"relative", maxWidth:820, margin:"0 auto" }}>
              <DashboardMock />
              {/* Floating SMS bubble */}
              <div className="sms-float" style={{ position:"absolute", bottom:40, right:-60, zIndex:10 }}>
                <div className="sms-pop" style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:"14px 18px", boxShadow:"0 12px 40px rgba(0,0,0,0.12)", maxWidth:220 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:32, height:32, background:GREEN, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>✉️</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:TXT, marginBottom:3 }}>SMS verschickt</div>
                      <div style={{ fontSize:11, color:MUTED, lineHeight:1.5 }}>„Hallo Michael, Ihr Termin ist morgen um 10:00 Uhr..."</div>
                    </div>
                  </div>
                  <div style={{ fontSize:10, color:MUTED2, marginTop:8, textAlign:"right" }}>Gerade eben · automatisch</div>
                </div>
              </div>
              {/* Fade bottom */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to bottom, transparent, #fff)", pointerEvents:"none" }} />
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ background:BG, borderTop:`1px solid ${BORDER}`, marginTop:0 }}>
            <div style={{ maxWidth:820, margin:"0 auto", display:"flex", justifyContent:"center" }}>
              {[
                { to:50, suffix:"+", label:"Betriebe aktiv" },
                { to:95, suffix:"%", label:"Weniger Ausfälle" },
                { to:10, suffix:" Min", label:"Einrichtung" },
              ].map((s, i) => (
                <div key={i} style={{ flex:1, padding:"24px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", textAlign:"center" }}>
                  <div style={{ fontSize:"clamp(26px,3vw,36px)", fontWeight:900, color:TXT, letterSpacing:"-1px" }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize:12, color:MUTED2, marginTop:4, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ INDUSTRY STRIP ═══════════════════════════════════════ */}
        <div style={{ borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, padding:"12px 0", overflow:"hidden", background:BG2 }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-wrap" style={{ display:"flex", gap:48, flexShrink:0 }}>
              {[...industries, ...industries].map((b,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <div style={{ width:4, height:4, background:GREEN, borderRadius:"50%", opacity:.5 }} />
                  <span style={{ fontSize:13, color:MUTED2, fontWeight:500, whiteSpace:"nowrap" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ PROBLEM / BEFORE-AFTER ══════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:520, margin:"0 auto 60px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  So läuft es heute. So sollte es laufen.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.7, margin:0 }}>Jeder Ausfall ist bares Geld. Und meistens wäre er vermeidbar gewesen.</p>
              </div>
            </Reveal>

            {/* Before / After */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:56 }}>
              {/* Before */}
              <Reveal delay={0} className="before-after-col">
                <div style={{ background:"#FFF7F7", border:"1px solid #FED7D7", borderRadius:16, padding:"28px", height:"100%", boxSizing:"border-box" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                    <div style={{ width:32, height:32, background:"#FEE2E2", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>😤</div>
                    <span style={{ fontWeight:800, fontSize:15, color:"#991B1B" }}>Ohne TerminStop</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {[
                      "Kunden erscheinen nicht — ohne Vorwarnung",
                      "Hinterhertelefonieren kostet täglich Zeit",
                      "Termine auf Zetteln oder im Kopf",
                      "Keine Übersicht, wer kommt und wer nicht",
                      "Umsatz geht verloren, ohne dass man es merkt",
                    ].map((item, i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ color:"#DC2626", fontSize:13, marginTop:2, flexShrink:0 }}>✕</span>
                        <span style={{ fontSize:14, color:"#7F1D1D", lineHeight:1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* After */}
              <Reveal delay={80} className="before-after-col">
                <div style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:16, padding:"28px", height:"100%", boxSizing:"border-box" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                    <div style={{ width:32, height:32, background:"#DCFCE7", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✅</div>
                    <span style={{ fontWeight:800, fontSize:15, color:"#14532D" }}>Mit TerminStop</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {[
                      "SMS-Erinnerung 24h vorher — automatisch",
                      "Kein Anrufen mehr — läuft von alleine",
                      "Alle Termine digital, immer griffbereit",
                      "Voller Überblick über Auslastung und Kunden",
                      "Weniger Ausfälle = mehr Umsatz, jeden Monat",
                    ].map((item, i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ color:GREEN, fontSize:13, marginTop:2, flexShrink:0 }}>✓</span>
                        <span style={{ fontSize:14, color:"#14532D", lineHeight:1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gap:16 }} className="stat-grid">
              <style>{`.stat-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:700px){.stat-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { to:50, suffix:"€", pre:"bis ", label:"Verlust pro Ausfall", desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet.", accent:false },
                { to:9,  suffix:"×", pre:"bis ", label:"Ausfälle pro Woche",  desc:"Im Schnitt erlebt jeder Betrieb mehrfach wöchentlich Ausfälle.", accent:false },
                { to:2000, suffix:"€", pre:"bis ", label:"Verlust pro Monat", desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr.", accent:true },
              ].map((item,i) => (
                <Reveal key={i} delay={i*80}>
                  <div className="card-lift" style={{ padding:"32px 28px", background:item.accent?GREEN_L:BG2, border:`1px solid ${item.accent?GREEN_B:BORDER}`, borderRadius:16, boxSizing:"border-box" }}>
                    <div style={{ fontSize:"clamp(36px,5vw,52px)", fontWeight:900, color:item.accent?GREEN:TXT, marginBottom:10, letterSpacing:"-2px", lineHeight:1 }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:6 }}>{item.label}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.65 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
        <section id="wie-es-funktioniert" className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 60px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>So funktioniert's</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Drei Schritte.<br />Dann läuft alles.
                </h2>
                <p style={{ fontSize:16, color:MUTED, margin:0, lineHeight:1.65 }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>

            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {[
                { num:"01", icon:"🤝", tag:"Persönliche Begleitung", title:"Einmalig einrichten — in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein. Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive.", detail:"Sie brauchen nur Ihren Browser — keine Software." },
                { num:"02", icon:"⚡", tag:"Vollautomatisch", title:"Ihr digitales Büro läuft — sofort und automatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen 24h vor jedem Termin automatisch raus — mit Ihrem Namen.", detail:"Ohne Ihr Zutun. Tag und Nacht." },
                { num:"03", icon:"📈", tag:"95% Erfolgsquote", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. TerminStop arbeitet dauerhaft für Sie im Hintergrund.", detail:"Kunden, die kommen. Umsatz, der bleibt." },
              ].map((s,i) => (
                <Reveal key={i} delay={i*80} className="before-after-col">
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                      <div style={{ width:44, height:44, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
                      <span style={{ fontSize:38, fontWeight:900, color:BG3, letterSpacing:"-2px", lineHeight:1, userSelect:"none" }}>{s.num}</span>
                    </div>
                    <div style={{ display:"inline-block", background:GREEN_L, border:`1px solid ${GREEN_B}`, color:GREEN, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:980, marginBottom:12, letterSpacing:".4px" }}>{s.tag}</div>
                    <h3 style={{ fontSize:16, fontWeight:800, color:TXT, margin:"0 0 10px", letterSpacing:"-0.3px", lineHeight:1.35 }}>{s.title}</h3>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:"0 0 14px" }}>{s.desc}</p>
                    <div style={{ background:BG2, borderRadius:8, padding:"10px 14px", fontSize:12, color:GREEN, fontWeight:600, border:`1px solid ${GREEN_B}` }}>→ {s.detail}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 56px" }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Alles inklusive</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px", color:TXT }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.65, margin:0 }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe — alles in einem.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gap:16 }} className="features-grid">
              <style>{`.features-grid{grid-template-columns:repeat(2,1fr)} @media(max-width:700px){.features-grid{grid-template-columns:1fr!important}}`}</style>

              {[
                { icon:"📅", color:"#10B981", bg:"#ECFDF5", border:"#A7F3D0", label:"Vollautomatisch", title:"SMS-Erinnerungen", desc:"24h vor jedem Termin geht eine personalisierte SMS raus — mit Ihrem Namen, ohne Ihr Zutun. Nie wieder hinterhertelefonieren.", extra:"Ihre Kunden werden zuverlässig erinnert — Sie müssen nichts tun." },
                { icon:"👥", color:"#6366F1", bg:"#EEF2FF", border:"#C7D2FE", label:"Voller Überblick", title:"Kundenkartei", desc:"Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist — und wer nicht.", extra:"Alle Kundendaten griffbereit — auf dem Handy oder PC." },
                { icon:"🗓️", color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A", label:"Immer aktuell", title:"Digitaler Kalender", desc:"Tag- und Wochenansicht auf dem Handy, Tablet oder PC. Nie wieder Zettelwirtschaft — alles an einem Ort.", extra:"Von unterwegs erreichbar — jederzeit, überall." },
                { icon:"📊", color:"#EC4899", bg:"#FDF2F8", border:"#FBCFE8", label:"Datengestützt", title:"Auswertungen & Einblicke", desc:"Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb schwarz auf weiß.", extra:"Entscheidungen auf Basis echter Zahlen — nicht nach Gefühl." },
              ].map((f,i) => (
                <Reveal key={i} delay={i*60}>
                  <div className="card-lift" style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16, padding:"32px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:18 }}>
                      <div style={{ width:48, height:48, background:f.bg, border:`1px solid ${f.border}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:f.color, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{f.label}</div>
                        <h3 style={{ fontSize:19, fontWeight:800, color:TXT, margin:0, letterSpacing:"-0.4px" }}>{f.title}</h3>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, margin:"0 0 16px" }}>{f.desc}</p>
                    <div style={{ background:BG2, borderRadius:8, padding:"10px 14px", fontSize:12, color:TXT, fontWeight:600, borderLeft:`3px solid ${f.color}`, lineHeight:1.4 }}>
                      {f.extra}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop:16, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:14, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
                <div>
                  <span style={{ color:TXT, fontWeight:700, fontSize:15 }}>Alles in einem Paket. Ab €1,30/Tag.</span>
                  <span style={{ color:MUTED, fontSize:13, marginLeft:12 }}>Monatlich kündbar · Kein Vertrag</span>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"11px 24px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ SMS SECTION ══════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:1040, margin:"0 auto", display:"flex", gap:60, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
            {/* Phone */}
            <Reveal delay={0}>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <SmsMock />
              </div>
            </Reveal>

            {/* Text */}
            <Reveal delay={100}>
              <div style={{ flex:1, minWidth:280, maxWidth:440 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>So sieht's aus</div>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1, margin:"0 0 18px", color:TXT }}>
                  Jeder Kunde bekommt eine SMS — automatisch.
                </h2>
                <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, margin:"0 0 28px" }}>
                  24 Stunden vor dem Termin geht eine persönliche SMS raus — mit dem Namen Ihres Betriebs. Kein Anruf, keine manuelle Arbeit, keine vergessenen Erinnerungen.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { icon:"✓", text:"Personalisiert mit Ihrem Betriebsnamen" },
                    { icon:"✓", text:"Automatisch — 24h vor dem Termin" },
                    { icon:"✓", text:"Funktioniert für alle Kunden gleichzeitig" },
                    { icon:"✓", text:"Sie müssen gar nichts tun" },
                  ].map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ width:22, height:22, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:GREEN, fontWeight:700, flexShrink:0 }}>{item.icon}</span>
                      <span style={{ fontSize:14, color:TXT, fontWeight:500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ REVIEWS ══════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>Echte Ergebnisse</div>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:0, color:TXT }}>Was Betriebe berichten.</h2>
              </div>
            </Reveal>
            <div style={{ display:"grid", gap:16 }} className="reviews-grid">
              <style>{`.reviews-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:900px){.reviews-grid{grid-template-columns:1fr 1fr!important}} @media(max-width:600px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
              {reviews.map((r,i) => (
                <Reveal key={i} delay={i*60}>
                  <div className="card-lift" style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px", display:"flex", flexDirection:"column", height:"100%", boxSizing:"border-box" }}>
                    <div style={{ color:"#F59E0B", fontSize:13, letterSpacing:2, marginBottom:14 }}>★★★★★</div>
                    <p style={{ fontSize:14, color:MUTED, lineHeight:1.8, flex:1, marginBottom:16 }}>„{r.text}"</p>
                    <div style={{ paddingTop:16, borderTop:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, background:GREEN, color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, flexShrink:0 }}>{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:TXT }}>{r.name}</div>
                          <div style={{ fontSize:11, color:MUTED2 }}>{r.role} · {r.city}</div>
                        </div>
                      </div>
                      <div style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, color:GREEN, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:980, whiteSpace:"nowrap" }}>✓ {r.result}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══════════════════════════════════════════════ */}
        <section id="preise" className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
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
                <div style={{ background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:14, padding:"18px 28px", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
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
              {tiers.map((tier,i) => (
                <Reveal key={i} delay={i*70}>
                  {tier.highlight ? (
                    <div style={{ background:GREEN, border:`1px solid ${GREEN}`, borderRadius:18, padding:"32px 28px", position:"relative", boxShadow:`0 8px 40px rgba(24,166,109,0.25)`, height:"100%", boxSizing:"border-box" }}>
                      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:TXT, color:"#fff", fontSize:11, fontWeight:700, padding:"5px 18px", borderRadius:980, whiteSpace:"nowrap" }}>✓ Meistgewählt</div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.75)", marginBottom:8 }}>{tier.name}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", marginBottom:24, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,0.2)" }}>{tier.for}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:32 }}>
                        {tier.features.map((f,j) => (
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
                        {tier.features.map((f,j) => (
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

        {/* ══ ADD-ON ════════════════════════════════════════════════ */}
        <section id="online-buchung" className="sec-pad" style={{ padding:"96px 32px", background:BG }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                <div className="tag-green">Add-on</div>
                <span style={{ fontSize:13, color:MUTED }}>Optional zubuchbar zu jedem Paket</span>
              </div>
              <div style={{ maxWidth:600, marginBottom:48 }}>
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
              {addonFeatures.map((f,i) => (
                <Reveal key={i} delay={i*50}>
                  <div className="card-lift" style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px", height:"100%", boxSizing:"border-box", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ width:40, height:40, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:14 }}>{f.icon}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:6 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop:16, background:GREEN_L, border:`1px solid ${GREEN_B}`, borderRadius:14, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
                <div>
                  <span style={{ color:TXT, fontWeight:700, fontSize:15 }}>Online-Buchung als Add-on hinzubuchen.</span>
                  <span style={{ color:MUTED, fontSize:13, marginLeft:12 }}>Auf Anfrage · Zu jedem Paket</span>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13, padding:"11px 24px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:BG2 }}>
          <div style={{ maxWidth:720, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div className="tag-green" style={{ marginBottom:18 }}>FAQ</div>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:0, color:TXT }}>Häufige Fragen.</h2>
              </div>
            </Reveal>
            <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
              {faqs.map((faq,i) => (
                <div key={i} className="faq-item">
                  <button className="faq-btn" onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ padding:"20px 24px", borderRadius:0, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:TXT, textAlign:"left", lineHeight:1.4 }}>{faq.q}</span>
                    <span style={{ color:openFaq===i?GREEN:MUTED2, fontSize:20, flexShrink:0, transition:"transform .2s", transform:openFaq===i?"rotate(45deg)":"none", display:"inline-block" }}>+</span>
                  </button>
                  {openFaq===i && (
                    <div style={{ padding:"0 24px 20px", fontSize:14, color:MUTED, lineHeight:1.75 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════════ */}
        <section className="sec-pad" style={{ padding:"96px 32px", background:GREEN }}>
          <Reveal>
            <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:1, textTransform:"uppercase", marginBottom:20 }}>Jetzt loslegen</div>
              <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 18px", color:"#fff" }}>
                Starten Sie noch heute.
              </h2>
              <p style={{ fontSize:17, color:"rgba(255,255,255,0.8)", lineHeight:1.7, margin:"0 0 40px" }}>
                Kostenlose Beratung, persönliches Onboarding, monatlich kündbar.<br />Kein Risiko, kein Kleingedrucktes.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
                <a href="/lead" className="btn-white" style={{ fontSize:16, padding:"15px 34px" }}>Kostenlose Beratung →</a>
                <a href="/demo" style={{ display:"inline-flex", alignItems:"center", fontSize:16, padding:"15px 28px", color:"rgba(255,255,255,0.85)", fontWeight:600, textDecoration:"none", borderRadius:10, border:"1.5px solid rgba(255,255,255,0.35)", transition:"border-color .2s" }}>Demo ansehen</a>
              </div>
              <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
                {["✓ Kein Vertrag","✓ Monatlich kündbar","✓ Onboarding inklusive"].map((t,i) => (
                  <span key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══ FOOTER ═══════════════════════════════════════════════ */}
        <footer style={{ background:BG2, borderTop:`1px solid ${BORDER}`, padding:"40px 32px" }}>
          <div style={{ maxWidth:1040, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:28, height:28, background:GREEN, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontWeight:900, fontSize:13 }}>T</span>
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:TXT, letterSpacing:"-.4px" }}>Termin<span style={{ color:GREEN }}>Stop</span></span>
            </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[{href:"/impressum",label:"Impressum"},{href:"/datenschutz",label:"Datenschutz"},{href:"/agb",label:"AGB"},{href:"/avv",label:"AVV"}].map(l => (
                <a key={l.href} href={l.href} style={{ fontSize:13, color:MUTED2, textDecoration:"none", fontWeight:500, transition:"color .2s" }}
                  onMouseEnter={e=>(e.currentTarget.style.color=TXT)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED2)}>
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
