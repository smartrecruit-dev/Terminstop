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
    { label:"Kosten",               them:"15–30 % Provision pro Buchung",   us:"Ab €39 / Monat — fertig" },
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
          0%   { opacity:0; transform:translateY(6px); }
          12%, 88% { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-6px); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-12px); }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(1); opacity:.4; }
          100% { transform:scale(2.4); opacity:0; }
        }
        @keyframes marquee {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        .float-phone { animation: float 9s ease-in-out infinite; }
        .pulse-ring  { position:absolute; inset:0; border-radius:50%; background:rgba(24,166,109,.15); animation:pulse-ring 2.4s cubic-bezier(0,.2,.2,1) infinite; }
        .marquee-wrap { animation: marquee 36s linear infinite; }
        .word-slot { animation: wordIn 2.6s ease-in-out; }

        * { box-sizing: border-box; }

        .btn-primary {
          display:inline-flex; align-items:center; justify-content:center;
          background:#18A66D; color:#fff; border:none; border-radius:10px;
          font-weight:600; cursor:pointer; text-decoration:none; letter-spacing:-0.1px;
          transition:background .15s, transform .1s, box-shadow .15s;
          box-shadow:0 1px 2px rgba(0,0,0,.08), 0 4px 16px rgba(24,166,109,.22);
        }
        .btn-primary:hover { background:#149A60; transform:translateY(-1px); box-shadow:0 2px 4px rgba(0,0,0,.1), 0 8px 24px rgba(24,166,109,.3); }
        .btn-primary:active { transform:translateY(0); }

        .btn-ghost {
          display:inline-flex; align-items:center; justify-content:center;
          background:transparent; color:rgba(255,255,255,.5); border:1px solid rgba(255,255,255,.12);
          border-radius:10px; font-weight:500; cursor:pointer; text-decoration:none;
          transition:color .15s, border-color .15s, background .15s;
        }
        .btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,.3); background:rgba(255,255,255,.06); }

        .btn-outline {
          display:inline-flex; align-items:center; justify-content:center;
          background:transparent; color:#374151; border:1px solid #E5E7EB;
          border-radius:10px; font-weight:500; cursor:pointer; text-decoration:none;
          transition:border-color .15s, color .15s, background .15s;
        }
        .btn-outline:hover { border-color:#18A66D; color:#18A66D; }

        .faq-item { border-bottom:1px solid #F0F1F3; }
        .faq-item:first-child { border-top:1px solid #F0F1F3; }

        .review-card:hover { box-shadow:0 8px 32px rgba(0,0,0,.08)!important; transform:translateY(-2px); }
        .review-card { transition:box-shadow .2s, transform .2s; }

        @media(max-width:768px){
          .sec-pad{padding-top:72px!important;padding-bottom:72px!important;padding-left:24px!important;padding-right:24px!important}
          .hero-phone-hide{display:none!important}
          .showcase-phone-hide{display:none!important}
        }
      `}</style>

      <div style={{ fontFamily: F, color: "#111318", background: "#fff" }}>

        {/* ══ NAVBAR ══ */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:50,
          height:56, display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 40px",
          background:"rgba(255,255,255,.92)", backdropFilter:"blur(24px) saturate(180%)",
          borderBottom:"1px solid rgba(0,0,0,.06)",
        }}>
          <a href="/" style={{ textDecoration:"none", fontSize:16, fontWeight:800, letterSpacing:"-0.6px" }}>
            <span style={{ color:"#18A66D" }}>Termin</span>
            <span style={{ color:"#111318" }}>Stop</span>
          </a>
          <div style={{ display:"flex", alignItems:"center", gap:32 }}>
            <a href="#wie-es-funktioniert" style={{ fontSize:13.5, color:"#6B7280", textDecoration:"none", fontWeight:500, letterSpacing:"-0.1px" }} className="hidden md:block">So funktioniert's</a>
            <a href="#preise" style={{ fontSize:13.5, color:"#6B7280", textDecoration:"none", fontWeight:500, letterSpacing:"-0.1px" }} className="hidden md:block">Preise</a>
            <a href="/login" style={{ fontSize:13.5, color:"#6B7280", textDecoration:"none", fontWeight:500, letterSpacing:"-0.1px" }} className="hidden md:block">Login</a>
            <a href="/demo" style={{ fontSize:13.5, color:"#374151", textDecoration:"none", fontWeight:500, padding:"7px 16px", border:"1px solid #E5E7EB", borderRadius:9, letterSpacing:"-0.1px" }} className="hidden md:block">Demo</a>
            <a href="/login" className="block md:hidden" style={{ fontSize:13, color:"#374151", textDecoration:"none", fontWeight:500, padding:"7px 14px", border:"1px solid #E5E7EB", borderRadius:9 }}>Login</a>
            <a href="/lead" className="btn-primary" style={{ fontSize:13.5, padding:"8px 18px" }}>Kostenlos anfragen</a>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section style={{
          minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
          background:"linear-gradient(160deg,#04081A 0%,#070C1D 50%,#080E1C 100%)",
          paddingTop:56, overflow:"hidden", position:"relative",
        }}>
          {/* ambient glow */}
          <div style={{
            position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
            width:700, height:500, borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(24,166,109,.07) 0%,transparent 65%)",
            pointerEvents:"none",
          }} />

          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:96, alignItems:"center" }} className="hero-grid">
            <style>{`.hero-grid{grid-template-columns:1fr 1fr} @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;text-align:center}.hero-btns{justify-content:center!important}.hero-stats{justify-content:center!important}}`}</style>

            {/* LEFT */}
            <div>
              {/* live indicator */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:36 }}>
                <span style={{ position:"relative", display:"flex", width:7, height:7, flexShrink:0 }}>
                  <span className="pulse-ring" />
                  <span style={{ position:"relative", display:"inline-flex", borderRadius:"50%", width:7, height:7, background:"#18A66D" }} />
                </span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,.35)", fontWeight:500, letterSpacing:.3 }}>
                  Digitales Terminbüro für{" "}
                  <span style={{ color:"rgba(255,255,255,.75)", fontWeight:700, display:"inline-block" }} key={heroWord} className="word-slot">{words[heroWord]}</span>
                </span>
              </div>

              {/* headline */}
              <h1 style={{ fontSize:"clamp(44px,5.2vw,76px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-2.5px", color:"#fff", margin:"0 0 28px" }}>
                Ihr Betrieb.<br />
                Digital.<br />
                <span style={{ color:"#18A66D" }}>Automatisch.</span>
              </h1>

              <p style={{ fontSize:17, color:"rgba(255,255,255,.38)", lineHeight:1.7, maxWidth:400, margin:"0 0 44px", letterSpacing:"-0.1px" }}>
                Kalender, Kundenkartei, SMS-Erinnerungen und Auswertungen — alles in einem System. In 10 Minuten eingerichtet.
              </p>

              <div className="hero-btns" style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:56 }}>
                <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 28px" }}>Kostenlose Beratung →</a>
                <a href="/demo" className="btn-ghost" style={{ fontSize:15, padding:"14px 24px" }}>Live-Demo ansehen</a>
              </div>

              {/* stats */}
              <div className="hero-stats" style={{ display:"flex", gap:48, paddingTop:36, borderTop:"1px solid rgba(255,255,255,.06)" }}>
                {[
                  { to:50, suffix:"+", label:"Betriebe aktiv" },
                  { to:95, suffix:"%", label:"Weniger Ausfälle" },
                  { to:10, suffix:" Min.", label:"Einrichtung" },
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:"-1.5px" }}><Counter to={s.to} suffix={s.suffix} /></div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.25)", marginTop:3, fontWeight:500, letterSpacing:".1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – phone */}
            <div style={{ display:"flex", justifyContent:"flex-end" }} className="hero-phone-hide">
              <div className="float-phone" style={{ position:"relative" }}>
                <div style={{
                  position:"absolute", inset:-48, borderRadius:"50%",
                  background:"radial-gradient(ellipse,rgba(24,166,109,.08) 0%,transparent 65%)",
                  pointerEvents:"none",
                }} />
                <div style={{
                  background:"#060C0A", padding:12, borderRadius:52,
                  border:"1px solid rgba(255,255,255,.06)",
                  boxShadow:"0 64px 128px rgba(0,0,0,.6), 0 0 0 1px rgba(24,166,109,.06) inset",
                }}>
                  <div style={{ width:288, height:588, borderRadius:40, overflow:"hidden", background:"linear-gradient(180deg,#091409 0%,#050a06 100%)" }}>
                    {/* status bar */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 12px" }}>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", fontWeight:600 }}>9:41</span>
                      <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:14, width:54, height:18, background:"#000", borderRadius:9 }} />
                      <div style={{ width:16, height:7, borderRadius:2, border:"1px solid rgba(255,255,255,.18)", position:"relative" }}>
                        <div style={{ position:"absolute", left:2, top:2, bottom:2, width:"75%", background:"#18A66D", borderRadius:1 }} />
                      </div>
                    </div>
                    {/* notification */}
                    <div style={{ margin:"0 12px 12px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:18, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:40, height:40, background:"#18A66D", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"#fff", fontWeight:900, fontSize:15 }}>T</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#fff" }}>TerminStop</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,.28)" }}>SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div style={{ width:7, height:7, background:"#18A66D", borderRadius:"50%" }} />
                    </div>
                    {/* chat */}
                    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
                      <div style={{ background:"#18A66D", color:"#fff", fontSize:12, lineHeight:1.65, borderRadius:"18px 18px 18px 4px", padding:"14px 16px", maxWidth:"88%", boxShadow:"0 6px 24px rgba(24,166,109,.2)" }}>
                        Hallo Frau Schmidt,<br /><br />
                        Sie haben morgen,<br /><strong>Dienstag um 14:00 Uhr</strong><br />einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span style={{ fontSize:10, color:"rgba(255,255,255,.4)" }}>– Friseurstudio Elegance</span>
                      </div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,.18)", paddingLeft:4 }}>✓✓ Zugestellt · 24h vorher</div>
                      <div style={{ display:"flex", justifyContent:"flex-end" }}>
                        <div style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.09)", color:"rgba(255,255,255,.75)", fontSize:12, lineHeight:1.6, borderRadius:"18px 18px 4px 18px", padding:"12px 14px", maxWidth:"78%" }}>
                          Danke! Bin pünktlich da
                        </div>
                      </div>
                    </div>
                    {/* confirmed */}
                    <div style={{ position:"absolute", bottom:20, left:12, right:12 }}>
                      <div style={{ background:"rgba(24,166,109,.1)", border:"1px solid rgba(24,166,109,.18)", borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:30, height:30, background:"#18A66D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ color:"#fff", fontSize:13 }}>✓</span>
                        </div>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#4AE89B" }}>Termin bestätigt</div>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,.28)" }}>Kundin erscheint pünktlich</div>
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
        <section style={{ background:"#fafafa", borderTop:"1px solid #F0F1F3", borderBottom:"1px solid #F0F1F3", padding:"13px 0", overflow:"hidden" }}>
          <div style={{ display:"flex" }}>
            <div className="marquee-wrap" style={{ display:"flex", gap:52, flexShrink:0 }}>
              {[...industries, ...industries].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <div style={{ width:4, height:4, background:"#18A66D", borderRadius:"50%", opacity:.5 }} />
                  <span style={{ fontSize:12.5, color:"#B0B7C3", fontWeight:500, whiteSpace:"nowrap", letterSpacing:".1px" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROBLEM ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"112px 40px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:540, marginBottom:72 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 20px", color:"#111318" }}>
                  Zettelwirtschaft, Telefonate,<br />No-Shows. Täglich.
                </h2>
                <p style={{ fontSize:16.5, color:"#6B7280", lineHeight:1.7, margin:0, letterSpacing:"-0.1px" }}>
                  Kein Überblick, kein System — und Kunden, die einfach nicht erscheinen. Das kostet Sie jeden Tag Zeit und Geld.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", border:"1px solid #F0F1F3", borderRadius:18, overflow:"hidden" }} className="stat-grid">
              <style>{`.stat-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:700px){.stat-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { to:50, suffix:"€", pre:"", label:"Verlust pro Ausfall", desc:"Jeder verpasste Termin ist Umsatz, der nicht stattfindet." },
                { to:9,  suffix:"×", pre:"bis ", label:"Ausfälle pro Woche", desc:"Im Schnitt erlebt jeder Betrieb mehrfach pro Woche Ausfälle." },
                { to:2000, suffix:"€+", pre:"bis ", label:"Verlust pro Monat", desc:"Was wenig klingt, summiert sich zu Tausenden im Jahr." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ padding:"52px 44px", background:"#fff", borderRight: i < 2 ? "1px solid #F0F1F3" : "none" }}>
                    <div style={{ fontSize:54, fontWeight:900, color:"#111318", marginBottom:12, letterSpacing:"-2.5px", fontVariantNumeric:"tabular-nums" }}>
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:"#111318", marginBottom:8, letterSpacing:"-0.2px" }}>{item.label}</div>
                    <div style={{ fontSize:13.5, color:"#9CA3AF", lineHeight:1.65 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140}>
              <div style={{ marginTop:16, background:"#06091A", borderRadius:16, padding:"26px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:4, letterSpacing:"-0.3px" }}>Die Lösung? Automatisch. Einmal einrichten. Fertig.</div>
                  <div style={{ color:"rgba(255,255,255,.3)", fontSize:13.5, letterSpacing:"-0.1px" }}>Kein Aufwand, keine Technik-Kenntnisse. Läuft dauerhaft von selbst.</div>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13.5, padding:"11px 24px", flexShrink:0 }}>Jetzt anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="wie-es-funktioniert" className="sec-pad" style={{ background:"#fafafa", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:880, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:480, marginBottom:72 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>So funktioniert's</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 18px", color:"#111318" }}>
                  Drei Schritte.<br />Dann läuft es.
                </h2>
                <p style={{ fontSize:16.5, color:"#6B7280", lineHeight:1.7, margin:0, letterSpacing:"-0.1px" }}>Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { num:"01", title:"Einmalig einrichten – in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein: Kalender, Kundenkartei und SMS-Erinnerungen. Persönlicher Onboarding-Support inklusive – kein technisches Vorwissen nötig.", tag:"Persönliche Begleitung" },
                { num:"02", title:"Ihr digitales Büro läuft – sofort und vollautomatisch", desc:"Termine im Kalender, Kunden in der Kartei, SMS-Erinnerungen gehen automatisch raus – 24h vor jedem Termin, mit Ihrem Namen. Sie sehen auf einen Blick, wer bestätigt hat und wer nicht.", tag:"Alles in einem" },
                { num:"03", title:"Ihr Betrieb läuft planbarer. Jeden Tag.", desc:"Weniger Ausfälle, mehr Überblick, mehr Umsatz. Kein Hinterhertelefonieren, keine Zettelwirtschaft – TerminStop arbeitet dauerhaft für Sie im Hintergrund.", tag:"95 % Erfolgsquote" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ background:"#fff", border:"1px solid #F0F1F3", borderRadius:16, padding:"32px 36px", display:"flex", gap:36, alignItems:"flex-start" }}>
                    <div style={{ fontSize:60, fontWeight:900, lineHeight:1, color:"rgba(24,166,109,.08)", flexShrink:0, width:72, textAlign:"center", userSelect:"none", letterSpacing:"-2px" }}>{s.num}</div>
                    <div>
                      <span style={{ display:"inline-block", background:"#F0FBF5", color:"#18A66D", fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:7, marginBottom:13, letterSpacing:".05em" }}>{s.tag}</span>
                      <h3 style={{ fontSize:17, fontWeight:700, color:"#111318", margin:"0 0 10px", letterSpacing:"-0.4px" }}>{s.title}</h3>
                      <p style={{ fontSize:14.5, color:"#6B7280", lineHeight:1.7, margin:0, letterSpacing:"-0.1px" }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4 FEATURE PILLARS ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:520, margin:"0 auto 72px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Alles inklusive</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 16px", color:"#111318" }}>
                  Kein Einzeltool.<br />Ein komplettes System.
                </h2>
                <p style={{ fontSize:16.5, color:"#6B7280", lineHeight:1.7, margin:0, letterSpacing:"-0.1px" }}>
                  TerminStop ersetzt Notizbuch, Papierkalender und Erinnerungsanrufe — in einem.
                </p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gap:12 }} className="features4-grid">
              <style>{`.features4-grid{grid-template-columns:repeat(2,1fr)} @media(max-width:700px){.features4-grid{grid-template-columns:1fr!important}}`}</style>
              {[
                { icon:"📅", title:"Digitaler Kalender", tag:"Notizbuch adé", desc:"Tag- und Wochenübersicht für alle Termine. Auf dem Handy, Tablet oder PC — immer aktuell, immer dabei." },
                { icon:"👥", title:"Kundenkartei", tag:"Voller Überblick", desc:"Stammkunden anlegen, Verlauf einsehen, Notizen hinterlegen. Sie wissen immer, wer zuverlässig ist." },
                { icon:"📱", title:"Automatische SMS-Erinnerungen", tag:"Vollautomatisch", desc:"24h vor jedem Termin geht automatisch eine personalisierte SMS raus — ohne Ihr Zutun." },
                { icon:"📊", title:"Auswertungen & Einblicke", tag:"Datengestützt", desc:"Wie hoch ist Ihre Erfolgsquote? Welche Kunden kommen regelmäßig? Sehen Sie Ihren Betrieb schwarz auf weiß." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ background:"#fafafa", border:"1px solid #F0F1F3", borderRadius:16, padding:"32px", height:"100%", boxSizing:"border-box" as any }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                      <div style={{ width:44, height:44, background:"#fff", border:"1px solid #F0F1F3", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{f.icon}</div>
                      <div>
                        <span style={{ display:"inline-block", background:"#F0FBF5", color:"#18A66D", fontSize:10.5, fontWeight:600, padding:"3px 10px", borderRadius:6, marginBottom:6, letterSpacing:".05em" }}>{f.tag}</span>
                        <h3 style={{ fontSize:15, fontWeight:700, color:"#111318", margin:0, letterSpacing:"-0.3px" }}>{f.title}</h3>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, margin:0, letterSpacing:"-0.1px" }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={100}>
              <div style={{ marginTop:14, background:"#06091A", borderRadius:16, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" as any }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, background:"rgba(24,166,109,.12)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ color:"#18A66D", fontWeight:700, fontSize:16 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:600, fontSize:14.5, marginBottom:2, letterSpacing:"-0.3px" }}>Alles in einem Paket — keine versteckten Extras.</div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:13, letterSpacing:"-0.1px" }}>Kalender + Kundenkartei + SMS + Auswertungen · ab €39/Monat</div>
                  </div>
                </div>
                <a href="/lead" className="btn-primary" style={{ fontSize:13.5, padding:"11px 22px", flexShrink:0 }}>Kostenlos anfragen →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ PRODUCT SHOWCASE ══ */}
        <section className="sec-pad" style={{ background:"#fafafa", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:1040, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:96, alignItems:"center" }} className="showcase-grid">
            <style>{`.showcase-grid{grid-template-columns:1fr 1fr} @media(max-width:900px){.showcase-grid{grid-template-columns:1fr!important}}`}</style>

            {/* phone */}
            <div style={{ display:"flex", justifyContent:"center" }} className="showcase-phone-hide">
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", inset:-32, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(24,166,109,.05) 0%,transparent 70%)", pointerEvents:"none" }} />
                <div style={{ background:"#fff", padding:12, borderRadius:44, border:"1px solid #E5E7EB", boxShadow:"0 24px 64px rgba(0,0,0,.08)" }}>
                  <div style={{ width:280, height:560, borderRadius:34, overflow:"hidden", background:"#fff" }}>
                    <div style={{ background:"#18A66D", padding:"28px 20px 22px" }}>
                      <div style={{ color:"rgba(255,255,255,.55)", fontSize:11, marginBottom:4, fontWeight:500 }}>Guten Morgen</div>
                      <div style={{ color:"#fff", fontWeight:800, fontSize:19, marginBottom:12, letterSpacing:"-0.5px" }}>Heute, 6 Termine</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,.14)", borderRadius:8, padding:"5px 11px", color:"rgba(255,255,255,.85)", fontSize:11, fontWeight:600 }}>5 ✓ bestätigt</div>
                        <div style={{ background:"rgba(255,255,255,.07)", borderRadius:8, padding:"5px 11px", color:"rgba(255,255,255,.45)", fontSize:11 }}>1 ausstehend</div>
                      </div>
                    </div>
                    <div style={{ margin:"0 14px", marginTop:-14, background:"#fff", borderRadius:14, padding:14, border:"1px solid #F0F1F3", boxShadow:"0 4px 16px rgba(0,0,0,.06)", marginBottom:10 }}>
                      <div style={{ fontSize:10, color:"#9CA3AF", marginBottom:4, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Nächster Termin</div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#111318", letterSpacing:"-0.3px" }}>Maria Schmidt</div>
                      <div style={{ fontSize:12, color:"#6B7280" }}>14:00 Uhr · Damenhaarschnitt</div>
                      <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:5, height:5, background:"#18A66D", borderRadius:"50%" }} />
                        <span style={{ fontSize:10, color:"#18A66D", fontWeight:600 }}>SMS gesendet ✓</span>
                      </div>
                    </div>
                    <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:5 }}>
                      {[
                        { time:"09:00", name:"Thomas B.", s:"✓", c:"#18A66D" },
                        { time:"10:30", name:"Anna L.", s:"✓", c:"#18A66D" },
                        { time:"12:00", name:"Klaus M.", s:"✓", c:"#18A66D" },
                        { time:"14:00", name:"Maria S.", s:"→", c:"#F59E0B" },
                        { time:"16:00", name:"Peter H.", s:"○", c:"#D1D5DB" },
                      ].map((a, j) => (
                        <div key={j} style={{ display:"flex", alignItems:"center", gap:10, background:"#fafafa", borderRadius:10, padding:"9px 12px" }}>
                          <span style={{ fontSize:11, color:"#9CA3AF", width:34, flexShrink:0, fontWeight:500 }}>{a.time}</span>
                          <span style={{ fontSize:11, color:"#111318", fontWeight:500, flex:1, letterSpacing:"-0.1px" }}>{a.name}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:a.c }}>{a.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Reveal delay={80}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Das Dashboard</div>
                <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.07, margin:"0 0 16px", color:"#111318" }}>Alles im Blick.<br />Nichts verpassen.</h2>
                <p style={{ fontSize:16.5, color:"#6B7280", lineHeight:1.7, marginBottom:44, letterSpacing:"-0.1px" }}>Ihr komplettes Terminmanagement an einem Ort – übersichtlich, einfach, immer aktuell.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
                  {[
                    { title:"Tagesübersicht auf einen Blick", desc:"Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                    { title:"Automatische SMS-Erinnerungen", desc:"24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                    { title:"Kundenkartei", desc:"Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                    { title:"Auswertungen & Einblicke", desc:"Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
                  ].map((f, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                      <div style={{ width:20, height:20, background:"#F0FBF5", border:"1px solid rgba(24,166,109,.2)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <span style={{ color:"#18A66D", fontSize:11, fontWeight:700 }}>✓</span>
                      </div>
                      <div>
                        <div style={{ fontWeight:700, color:"#111318", marginBottom:3, fontSize:14.5, letterSpacing:"-0.3px" }}>{f.title}</div>
                        <div style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.65, letterSpacing:"-0.1px" }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ COMPETITOR COMPARISON ══ */}
        <section style={{ background:"#06091A", padding:"112px 40px" }} className="sec-pad">
          <div style={{ maxWidth:920, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:540, margin:"0 auto 64px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Der Vergleich</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, color:"#fff", letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 14px" }}>
                  Was andere kosten.<br /><span style={{ color:"#18A66D" }}>Was Sie bekommen.</span>
                </h2>
                <p style={{ fontSize:15.5, color:"rgba(255,255,255,.28)", margin:0, letterSpacing:"-0.1px" }}>
                  Buchungsportale klingen verlockend — bis man genau hinschaut.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              {/* Desktop */}
              <div className="comp-desktop">
                <style>{`.comp-desktop{display:block} @media(max-width:600px){.comp-desktop{display:none!important}}`}</style>
                <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:18, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                    <div style={{ padding:"18px 24px" }} />
                    <div style={{ padding:"18px 16px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:12.5, color:"rgba(255,255,255,.25)", fontWeight:600 }}>Klassische Portale</span>
                    </div>
                    <div style={{ padding:"18px 16px", textAlign:"center", background:"rgba(24,166,109,.06)", borderLeft:"1px solid rgba(24,166,109,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:13.5, fontWeight:700, color:"#4AE89B" }}>TerminStop ✓</span>
                    </div>
                  </div>
                  {compRows.map((row, i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr", borderBottom: i < compRows.length-1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                      <div style={{ padding:"15px 24px", display:"flex", alignItems:"center" }}>
                        <span style={{ fontSize:13, color:"rgba(255,255,255,.35)", fontWeight:500, letterSpacing:"-0.1px" }}>{row.label}</span>
                      </div>
                      <div style={{ padding:"15px 16px", borderLeft:"1px solid rgba(255,255,255,.03)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,.18)", lineHeight:1.5, textAlign:"center" as any }}>{row.them}</span>
                      </div>
                      <div style={{ padding:"15px 16px", background:"rgba(24,166,109,.03)", borderLeft:"1px solid rgba(24,166,109,.09)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:12, color:"rgba(74,232,155,.9)", fontWeight:600, lineHeight:1.5, textAlign:"center" as any }}>{row.us}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div className="comp-mobile">
                <style>{`.comp-mobile{display:none} @media(max-width:600px){.comp-mobile{display:block}}`}</style>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                  <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"11px", textAlign:"center" as any }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,.28)", fontWeight:600 }}>Klassische Portale</span>
                  </div>
                  <div style={{ background:"rgba(24,166,109,.09)", border:"1px solid rgba(24,166,109,.22)", borderRadius:12, padding:"11px", textAlign:"center" as any }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#4AE89B" }}>TerminStop ✓</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column" as any, gap:8 }}>
                  {compRows.map((row, i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.25)", textTransform:"uppercase" as any, letterSpacing:"0.1em", marginBottom:10 }}>{row.label}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,.04)", borderRadius:9, padding:"10px 12px" }}>
                          <span style={{ fontSize:11.5, color:"rgba(255,255,255,.22)", lineHeight:1.5 }}>{row.them}</span>
                        </div>
                        <div style={{ background:"rgba(24,166,109,.06)", border:"1px solid rgba(24,166,109,.13)", borderRadius:9, padding:"10px 12px" }}>
                          <span style={{ fontSize:11.5, color:"rgba(74,232,155,.9)", fontWeight:600, lineHeight:1.5 }}>{row.us}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ marginTop:24, display:"flex", flexDirection:"column" as any, alignItems:"center", gap:16, textAlign:"center" as any }}>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.2)", margin:0, letterSpacing:"-0.1px" }}>
                  Bei 100 Buchungen/Monat à €50 zahlen Sie über ein Buchungsportal bis zu <strong style={{ color:"rgba(255,255,255,.42)" }}>€1.500 Provision</strong>. TerminStop kostet <strong style={{ color:"#4AE89B" }}>€39</strong>.
                </p>
                <a href="/lead" className="btn-primary" style={{ fontSize:15, padding:"14px 28px" }}>Jetzt wechseln →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:1040, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:72 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Echte Ergebnisse</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 10px", color:"#111318" }}>Was Betriebe berichten.</h2>
                <p style={{ fontSize:15.5, color:"#9CA3AF", margin:0, letterSpacing:"-0.1px" }}>Keine Versprechen – nur echte Erfahrungen.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }} className="reviews-grid">
              <style>{`.reviews-grid{grid-template-columns:1fr 1fr} @media(max-width:700px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="review-card" style={{ background:"#fafafa", border:"1px solid #F0F1F3", borderRadius:18, padding:"32px", display:"flex", flexDirection:"column", height:"100%" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
                      <div style={{ background:"#F0FBF5", color:"#18A66D", fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:7, letterSpacing:".03em" }}>✓ {r.result}</div>
                      <div style={{ color:"#FBBF24", fontSize:11, letterSpacing:"1.5px" }}>★★★★★</div>
                    </div>
                    <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.75, flex:1, marginBottom:24, fontStyle:"italic", letterSpacing:"-0.1px" }}>„{r.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:20, borderTop:"1px solid #F0F1F3" }}>
                      <div style={{ width:34, height:34, background:"linear-gradient(135deg,#18A66D,#0A7A4F)", color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0 }}>{r.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#111318", letterSpacing:"-0.2px" }}>{r.name}</div>
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
        <section id="preise" className="sec-pad" style={{ background:"#fafafa", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:920, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:520, margin:"0 auto 18px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>Preise</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 14px", color:"#111318" }}>Einfach. Transparent.<br />Ohne Überraschungen.</h2>
                <p style={{ fontSize:16.5, color:"#6B7280", margin:0, letterSpacing:"-0.1px" }}>Monatlich kündbar, kein Vertrag.</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div style={{ maxWidth:520, margin:"32px auto 52px", background:"#fff", border:"1px solid rgba(24,166,109,.14)", borderRadius:14, padding:"16px 22px", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:34, height:34, background:"#F0FBF5", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"#18A66D", fontWeight:700, fontSize:15 }}>↑</span>
                </div>
                <p style={{ fontSize:13.5, color:"#6B7280", margin:0, lineHeight:1.6, letterSpacing:"-0.1px" }}>
                  Schon <strong style={{ color:"#111318" }}>2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig ab.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, alignItems:"start" }} className="pricing-grid">
              <style>{`.pricing-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 70}>
                  {plan.popular ? (
                    <div style={{ background:"#06091A", border:"1.5px solid rgba(24,166,109,.25)", borderRadius:18, padding:"32px 26px", position:"relative", boxShadow:"0 20px 56px rgba(24,166,109,.08)" }}>
                      <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:"#18A66D", color:"#fff", fontSize:11, fontWeight:600, padding:"4px 16px", borderRadius:980, whiteSpace:"nowrap", letterSpacing:".02em" }}>Meistgewählt</div>
                      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(74,232,155,.7)", marginBottom:16 }}>{plan.name}</div>
                      <div style={{ marginBottom:4 }}>
                        <span style={{ fontSize:50, fontWeight:900, color:"#fff", letterSpacing:"-2.5px" }}>€{plan.price}</span>
                        <span style={{ fontSize:14, color:"rgba(255,255,255,.3)", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontSize:12.5, color:"rgba(255,255,255,.25)", marginBottom:28, letterSpacing:"-0.1px" }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#4AE89B", fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:13.5, color:"rgba(255,255,255,.6)", letterSpacing:"-0.1px" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-primary" style={{ display:"block", textAlign:"center", fontSize:14, padding:"13px 0", borderRadius:10, width:"100%", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  ) : (
                    <div style={{ background:"#fff", border:"1px solid #E8EAED", borderRadius:18, padding:"32px 26px" }}>
                      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:16 }}>{plan.name}</div>
                      <div style={{ marginBottom:4 }}>
                        <span style={{ fontSize:50, fontWeight:900, color:"#111318", letterSpacing:"-2.5px" }}>€{plan.price}</span>
                        <span style={{ fontSize:14, color:"#9CA3AF", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontSize:12.5, color:"#9CA3AF", marginBottom:28, letterSpacing:"-0.1px" }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#18A66D", fontSize:12, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:13.5, color:"#6B7280", letterSpacing:"-0.1px" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-outline" style={{ display:"block", textAlign:"center", fontSize:14, padding:"13px 0", borderRadius:10, width:"100%", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            <p style={{ textAlign:"center", fontSize:12, color:"#C4C9D4", marginTop:18, letterSpacing:"-0.1px" }}>
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar
            </p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="sec-pad" style={{ background:"#fff", padding:"112px 40px", borderTop:"1px solid #F0F1F3" }}>
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:64 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#18A66D", marginBottom:18 }}>FAQ</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:900, letterSpacing:"-1.8px", lineHeight:1.06, margin:"0 0 10px", color:"#111318" }}>Häufige Fragen.</h2>
                <p style={{ fontSize:15.5, color:"#9CA3AF", margin:0, letterSpacing:"-0.1px" }}>Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width:"100%", textAlign:"left", padding:"22px 0", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, background:"none", border:"none", cursor:"pointer" }}
                  >
                    <span style={{ fontSize:15, fontWeight:600, color:"#111318", lineHeight:1.5, letterSpacing:"-0.2px" }}>{faq.q}</span>
                    <span style={{ color:"#18A66D", fontSize:22, flexShrink:0, fontWeight:300, lineHeight:1, transform: openFaq === i ? "rotate(45deg)" : "none", transition:"transform .22s" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom:22, fontSize:14, color:"#6B7280", lineHeight:1.75, paddingRight:32, letterSpacing:"-0.1px" }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="sec-pad" style={{ background:"linear-gradient(160deg,#04081A 0%,#07091C 100%)", padding:"128px 40px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:640, height:420, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(24,166,109,.06) 0%,transparent 65%)", pointerEvents:"none" }} />
          <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center", position:"relative" }}>
            <Reveal>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(24,166,109,.07)", border:"1px solid rgba(24,166,109,.15)", color:"rgba(74,232,155,.8)", fontSize:12, fontWeight:500, padding:"7px 18px", borderRadius:9, marginBottom:40, letterSpacing:".02em" }}>
                Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 style={{ fontSize:"clamp(36px,5vw,68px)", fontWeight:900, color:"#fff", letterSpacing:"-2.5px", lineHeight:1.02, margin:"0 0 22px" }}>
                Ihr Betrieb.<br /><span style={{ color:"#18A66D" }}>Endlich digital.</span>
              </h2>
              <p style={{ fontSize:17, color:"rgba(255,255,255,.32)", lineHeight:1.7, maxWidth:440, margin:"0 auto 48px", letterSpacing:"-0.1px" }}>
                Kalender, Kundenkartei, SMS-Erinnerungen und Auswertungen — in einem System, in 10 Minuten eingerichtet.
              </p>
              <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"16px 36px" }}>
                Kostenloses Gespräch sichern →
              </a>
              <div style={{ marginTop:36, display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
                {["Kein Vertrag","Monatlich kündbar","Persönliches Onboarding","In 10 Min. startklar"].map((t, i) => (
                  <span key={i} style={{ fontSize:12.5, color:"rgba(255,255,255,.2)", letterSpacing:"-0.1px" }}>✓ {t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ background:"#fff", borderTop:"1px solid #F0F1F3", padding:"28px 40px" }}>
          <div style={{ maxWidth:920, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <span style={{ fontSize:15, fontWeight:800, letterSpacing:"-0.6px" }}>
              <span style={{ color:"#18A66D" }}>Termin</span>
              <span style={{ color:"#111318" }}>Stop</span>
            </span>
            <div style={{ display:"flex", gap:24 }}>
              {[["Impressum","/impressum"],["Datenschutz","/datenschutz"],["AGB","/agb"],["AVV","/avv"],["Login","/login"]].map(([l, h]) => (
                <a key={h} href={h} style={{ fontSize:13, color:"#9CA3AF", textDecoration:"none", letterSpacing:"-0.1px" }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
