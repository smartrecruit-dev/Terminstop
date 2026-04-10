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
                <span style={{ fontSize:12, color:"rgba(255,255,255,.45)", fontWeight:600, letterSpacing:.2, whiteSpace:"nowrap" }}>
                  SMS-Erinnerungen für Ihren&nbsp;
                  <span style={{ color:"#18A66D", fontWeight:800 }} key={heroWord} className="word-slot">{words[heroWord]}</span>
                </span>
              </div>

              {/* headline */}
              <h1 style={{ fontSize:"clamp(40px,5vw,72px)", fontWeight:900, lineHeight:1.04, letterSpacing:"-2px", color:"#fff", margin:"0 0 24px" }}>
                Kein Termin<br />
                geht mehr<br />
                <span style={{ color:"#18A66D" }}>verloren.</span>
              </h1>

              <p style={{ fontSize:18, color:"rgba(255,255,255,.42)", lineHeight:1.65, maxWidth:420, margin:"0 0 40px" }}>
                TerminStop erinnert Ihre Kunden automatisch per SMS — damit Termine eingehalten werden und Sie sich auf Ihr Handwerk konzentrieren können.
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
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
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
        <section style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ maxWidth:560, marginBottom:64 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Das Problem</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 18px" }}>
                  Terminausfälle kosten Sie<br />täglich echtes Geld.
                </h2>
                <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, margin:0 }}>
                  Jeder Betrieb verliert täglich durch No-Shows Umsatz — nicht einmal, sondern jeden Tag.
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
        <section id="wie-es-funktioniert" style={{ background:"#F9FAFB", padding:"100px 32px" }}>
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
                { num:"01", title:"Einmalig einrichten – in unter 10 Minuten", desc:"Wir richten TerminStop gemeinsam mit Ihnen ein. Persönlicher Onboarding-Support inklusive.", tag:"Persönliche Begleitung" },
                { num:"02", title:"Kunden erhalten automatisch eine SMS", desc:"24 Stunden vor jedem Termin verschickt TerminStop eine personalisierte Erinnerung – mit Ihrem Namen und dem genauen Termin.", tag:"Vollständig automatisch" },
                { num:"03", title:"Ihre Termine werden tatsächlich eingehalten", desc:"Weniger Ausfälle, planbarere Tage, mehr Umsatz. Sie sehen, wer bestätigt hat – und können rechtzeitig reagieren.", tag:"95 % Erfolgsquote" },
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

        {/* ══ PRODUCT SHOWCASE ══ */}
        <section style={{ background:"#fff", padding:"100px 32px" }}>
          <div style={{ maxWidth:1080, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="showcase-grid">
            <style>{`.showcase-grid{grid-template-columns:1fr 1fr} @media(max-width:900px){.showcase-grid{grid-template-columns:1fr!important}}`}</style>

            {/* phone */}
            <div style={{ display:"flex", justifyContent:"center" }}>
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

        {/* ══ COMPARISON ══ */}
        <section style={{ background:"#06091A", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto 56px" }}>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, color:"#fff", letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px" }}>Mit oder ohne<br />TerminStop.</h2>
                <p style={{ fontSize:16, color:"rgba(255,255,255,.32)", margin:0 }}>Der Unterschied – schwarz auf weiß.</p>
              </div>
            </Reveal>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="comp-grid">
              <style>{`.comp-grid{grid-template-columns:1fr 1fr} @media(max-width:700px){.comp-grid{grid-template-columns:1fr!important}}`}</style>
              <Reveal>
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"36px 32px", height:"100%" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#F87171", fontWeight:700, fontSize:14 }}>✗</div>
                    <span style={{ fontWeight:700, color:"#fff", fontSize:16 }}>Ohne TerminStop</span>
                  </div>
                  {["Kunden vergessen Termine – Sie erfahren es zu spät","Sie rufen selbst an – kostet Zeit und Nerven","Unberechenbare Tage, lückenhafte Auslastung","Keine Vorwarnung – kein Reaktionsspielraum","Bis zu €2.000+ Umsatzverlust pro Monat"].map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:14 }}>
                      <span style={{ color:"rgba(239,68,68,.5)", flexShrink:0, marginTop:1 }}>✗</span>
                      <span style={{ fontSize:14, color:"rgba(255,255,255,.32)", lineHeight:1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div style={{ background:"linear-gradient(140deg,#0D2E1C,#0F2419)", border:"1px solid rgba(24,166,109,.2)", borderRadius:20, padding:"36px 32px", height:"100%", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, right:0, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(24,166,109,.12),transparent 70%)", pointerEvents:"none" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#18A66D", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14 }}>✓</div>
                    <span style={{ fontWeight:700, color:"#fff", fontSize:16 }}>Mit TerminStop</span>
                  </div>
                  {["Kunden werden automatisch erinnert – und erscheinen","Kein manueller Aufwand, kein Nachtelefonieren","Planbare Tage, maximale Auslastung","Rechtzeitig informiert – Zeit zum Reagieren","Monatliche Einsparung durch Automatisierung"].map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:14 }}>
                      <span style={{ color:"#18A66D", flexShrink:0, marginTop:1 }}>✓</span>
                      <span style={{ fontSize:14, color:"rgba(255,255,255,.65)", lineHeight:1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section style={{ background:"#fff", padding:"100px 32px" }}>
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
        <section id="preise" style={{ background:"#F9FAFB", padding:"100px 32px" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <Reveal>
              <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 16px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#18A66D", marginBottom:16 }}>Preise</div>
                <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.08, margin:"0 0 14px" }}>Einfach. Transparent.<br />Ohne Überraschungen.</h2>
                <p style={{ fontSize:17, color:"#6B7280", margin:0 }}>Monatlich kündbar, kein Vertrag.</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div style={{ maxWidth:560, margin:"32px auto 48px", background:"#fff", border:"1px solid rgba(24,166,109,.15)", borderRadius:16, padding:"18px 24px", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:36, height:36, background:"#F0FBF5", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"#18A66D", fontWeight:900, fontSize:16 }}>↑</span>
                </div>
                <p style={{ fontSize:14, color:"#6B7280", margin:0, lineHeight:1.6 }}>
                  Schon <strong style={{ color:"#0B0D14" }}>2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig ab.
                </p>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, alignItems:"start" }} className="pricing-grid">
              <style>{`.pricing-grid{grid-template-columns:repeat(3,1fr)} @media(max-width:800px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 70}>
                  {plan.popular ? (
                    <div style={{ background:"#06091A", border:"1.5px solid rgba(24,166,109,.3)", borderRadius:20, padding:"32px 28px", position:"relative", boxShadow:"0 16px 48px rgba(24,166,109,.1)" }}>
                      <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"#18A66D", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 16px", borderRadius:980, whiteSpace:"nowrap" }}>✓ Meistgewählt</div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(74,232,155,.8)", marginBottom:16 }}>{plan.name}</div>
                      <div style={{ marginBottom:6 }}>
                        <span style={{ fontSize:48, fontWeight:900, color:"#fff", letterSpacing:"-2px" }}>€{plan.price}</span>
                        <span style={{ fontSize:15, color:"rgba(255,255,255,.35)", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.3)", marginBottom:28 }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#4AE89B", fontSize:13, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:"rgba(255,255,255,.65)" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-primary" style={{ display:"block", textAlign:"center", fontSize:14, padding:"14px 0", borderRadius:12, width:"100%", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  ) : (
                    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:20, padding:"32px 28px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#9CA3AF", marginBottom:16 }}>{plan.name}</div>
                      <div style={{ marginBottom:6 }}>
                        <span style={{ fontSize:48, fontWeight:900, color:"#0B0D14", letterSpacing:"-2px" }}>€{plan.price}</span>
                        <span style={{ fontSize:15, color:"#9CA3AF", marginLeft:4 }}>/Monat</span>
                      </div>
                      <div style={{ fontSize:13, color:"#9CA3AF", marginBottom:28 }}>{plan.sms} · €{plan.perDay}/Tag</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
                        {plan.features.map((f, j) => (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ color:"#18A66D", fontSize:13, flexShrink:0 }}>✓</span>
                            <span style={{ fontSize:14, color:"#6B7280" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="btn-outline" style={{ display:"block", textAlign:"center", fontSize:14, padding:"14px 0", borderRadius:12, width:"100%", boxSizing:"border-box" }}>Jetzt anfragen →</a>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            <p style={{ textAlign:"center", fontSize:12, color:"#C4C9D4", marginTop:20 }}>
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar
            </p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section style={{ background:"#fff", padding:"100px 32px" }}>
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
        <section style={{ background:"linear-gradient(170deg,#06091A 0%,#080C1E 100%)", padding:"120px 32px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(24,166,109,.08) 0%,transparent 65%)", pointerEvents:"none" }} />
          <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", position:"relative" }}>
            <Reveal>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(24,166,109,.08)", border:"1px solid rgba(24,166,109,.18)", color:"rgba(74,232,155,.85)", fontSize:12, fontWeight:600, padding:"7px 18px", borderRadius:980, marginBottom:36 }}>
                ✓ Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:900, color:"#fff", letterSpacing:"-2px", lineHeight:1.04, margin:"0 0 20px" }}>
                Hören Sie auf,<br /><span style={{ color:"#18A66D" }}>Geld zu verlieren.</span>
              </h2>
              <p style={{ fontSize:18, color:"rgba(255,255,255,.38)", lineHeight:1.65, maxWidth:460, margin:"0 auto 44px" }}>
                Ein 15-minütiges Gespräch – und Sie wissen, was TerminStop konkret für Ihren Betrieb bedeutet.
              </p>
              <a href="/lead" className="btn-primary" style={{ fontSize:16, padding:"16px 40px" }}>
                Kostenloses Gespräch sichern →
              </a>
              <div style={{ marginTop:32, display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
                {["Kein Vertrag","Persönliches Gespräch","Klare Antworten","Sofort startklar"].map((t, i) => (
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
