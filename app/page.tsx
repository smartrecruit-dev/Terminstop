"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/* ─── Canvas Particle Network ─────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const N = 55
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number }
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4, alpha: Math.random() * 0.3 + 0.1,
    }))

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        p.vx *= 0.998; p.vy *= 0.998
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(24,166,109,${(1 - d / 120) * 0.12})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(24,166,109,${p.alpha})`
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

/* ─── 3D Tilt Card ─────────────────────────────────────────── */
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.015,1.015,1.015)`
    el.style.transition = "transform 0.1s ease"
  }
  const onLeave = () => {
    const el = ref.current!
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)"
    el.style.transition = "transform 0.5s ease"
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  )
}

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
          const ease = 1 - Math.pow(1 - p, 3)
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

/* ─── Scroll Reveal ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`
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
    const t = setInterval(() => setHeroWord(w => (w + 1) % words.length), 2400)
    return () => clearInterval(t)
  }, [])

  const reviews = [
    { text: "Seit wir TerminStop nutzen, sind unsere Ausfälle in den ersten zwei Wochen um mehr als die Hälfte zurückgegangen. Ich hätte nicht gedacht, dass es so schnell wirkt.", name: "Thomas M.", role: "Autohaus", city: "München", result: "−58% Ausfälle" },
    { text: "Ich hab 10 Minuten gebraucht um es einzurichten. Seitdem läuft es einfach. Meine Kunden kommen pünktlicher und ich muss nicht mehr hinterhertelefonieren.", name: "Sandra K.", role: "Friseurstudio", city: "Hamburg", result: "−3h Zeitaufwand/Woche" },
    { text: "Wir haben das System vor 3 Monaten eingeführt. Seitdem haben wir kaum noch kurzfristige Absagen. Der Aufwand war minimal, der Effekt enorm.", name: "Dr. Andreas B.", role: "Physiotherapiepraxis", city: "Berlin", result: "Keine kurzfristigen Absagen" },
    { text: "Ich war skeptisch, ob SMS wirklich funktioniert. Nach dem ersten Monat war ich überzeugt. Unsere Auslastung ist spürbar gestiegen.", name: "Markus S.", role: "KFZ-Werkstatt", city: "Stuttgart", result: "+18% Auslastung" },
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
    { name: "Starter", price: 39, sms: "0 – 100 SMS", perDay: "1,30", popular: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Persönliches Onboarding", "Support per E-Mail"] },
    { name: "Pro", price: 109, sms: "250 – 400 SMS", perDay: "3,63", popular: true, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Prioritäts-Support"] },
    { name: "Max", price: 229, sms: "800 – 1000 SMS", perDay: "7,63", popular: false, features: ["Automatische SMS-Erinnerungen", "Terminübersicht & Dashboard", "Kundenkartei", "Kalenderansicht", "Auswertungen & Einblicke", "Persönliches Onboarding", "Persönlicher Ansprechpartner", "Individuelle Einrichtung"] },
  ]

  const industries = ["Friseur", "KFZ-Werkstatt", "Arztpraxis", "Handwerk", "Kosmetik", "Physiotherapie", "Tattoo-Studio", "Nagelstudio", "Zahnarzt", "Optiker", "Hundesalon", "Massage"]

  return (
    <>
      <style>{`
        @keyframes wordIn { 0%{opacity:0;transform:translateY(10px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-10px)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.2);opacity:0} }

        .marquee-track { animation: marquee 30s linear infinite; }
        .float-anim { animation: float 7s ease-in-out infinite; }
        .pulse-ring { position:absolute; inset:0; border-radius:50%; background:rgba(24,166,109,0.25); animation:pulse-ring 2s cubic-bezier(0,0,0.2,1) infinite; }

        .cta-primary { background:#18A66D; color:#fff; transition:background 0.2s, box-shadow 0.2s; box-shadow:0 4px 20px rgba(24,166,109,0.25); }
        .cta-primary:hover { background:#149A60; box-shadow:0 6px 28px rgba(24,166,109,0.35); }

        .cta-secondary { background:transparent; border:1.5px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.6); transition:all 0.2s; }
        .cta-secondary:hover { border-color:rgba(24,166,109,0.5); color:#fff; background:rgba(24,166,109,0.06); }

        .cta-dark { background:#18A66D; color:#fff; transition:background 0.2s, box-shadow 0.2s; box-shadow:0 4px 20px rgba(24,166,109,0.3); }
        .cta-dark:hover { background:#149A60; }

        .bg-grid-dark { background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:72px 72px; }
        .bg-grid-light { background-image:linear-gradient(rgba(0,0,0,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.035) 1px,transparent 1px); background-size:72px 72px; }

        .hero-headline-accent { color:#18A66D; }

        .pricing-card-popular {
          background:linear-gradient(160deg,#06091A 0%,#0B0F20 100%);
          border:1.5px solid rgba(24,166,109,0.35);
          box-shadow:0 20px 60px rgba(24,166,109,0.12), 0 0 0 1px rgba(24,166,109,0.08);
        }
      `}</style>

      <div className="min-h-screen" style={{ fontFamily: "'Inter','Manrope',system-ui,sans-serif" }}>

        {/* ─── NAVBAR ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100/80">
          <span className="text-lg font-black tracking-tight select-none">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#0B0D14]">Stop</span>
          </span>
          <div className="flex items-center gap-5">
            <a href="#wie-es-funktioniert" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block">So funktioniert's</a>
            <a href="#preise" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block">Preise</a>
            <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden md:block">Login</a>
            <a href="/demo" className="text-sm text-gray-500 hover:text-gray-900 hidden md:block border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-full transition-all">
              Live-Demo
            </a>
            <a href="/lead" className="cta-primary text-sm px-5 py-2.5 rounded-full font-bold">
              Kostenlos anfragen
            </a>
          </div>
        </nav>

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16" style={{ background: "linear-gradient(160deg, #06091A 0%, #080C1C 60%, #0A0F22 100%)" }}>
          <ParticleCanvas />

          {/* Soft radial light */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.08) 0%, transparent 60%)" }} />

          <div className="bg-grid-dark absolute inset-0 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT TEXT */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 border border-white/10 text-white/50 text-xs font-semibold px-4 py-2 rounded-full mb-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="pulse-ring" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18A66D]" />
                </span>
                SMS-Erinnerungen für Ihren&nbsp;
                <span className="text-[#18A66D] font-black" key={heroWord} style={{ animation: "wordIn 2.4s ease-in-out" }}>
                  {words[heroWord]}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black leading-[1.05] tracking-tight mb-7 text-white">
                Kein Termin<br />
                geht mehr<br />
                <span className="hero-headline-accent">verloren.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: "rgba(255,255,255,0.45)" }}>
                TerminStop erinnert Ihre Kunden automatisch per SMS –
                damit Termine eingehalten werden und Sie sich auf das Wesentliche konzentrieren können.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <a href="/lead" className="cta-primary inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-base cursor-pointer">
                  Kostenlose Beratung sichern →
                </a>
                <a href="/demo" className="cta-secondary inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm cursor-pointer">
                  Live-Demo ansehen
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 pt-8 border-t border-white/8">
                {[
                  { to: 50, suffix: "+", label: "Betriebe aktiv" },
                  { to: 95, suffix: "%", label: "Weniger Ausfälle" },
                  { to: 10, suffix: " Min.", label: "Einrichtung" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white tabular-nums">
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PHONE */}
            <TiltCard className="flex justify-center lg:justify-end">
              <div className="relative float-anim" style={{ animationDelay: "0.5s" }}>
                <div className="absolute -inset-16 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.1) 0%, transparent 60%)" }} />

                <div className="relative p-[14px] rounded-[50px]" style={{ background: "#070F09", boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(24,166,109,0.12) inset", border: "1px solid rgba(24,166,109,0.15)" }}>
                  <div className="w-[290px] h-[590px] rounded-[38px] overflow-hidden" style={{ background: "linear-gradient(180deg, #0a1a0d 0%, #060d08 100%)" }}>

                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-3">
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>9:41</span>
                      <div className="w-[54px] h-[18px] bg-black rounded-full" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 14 }} />
                      <div className="flex items-center gap-1">
                        <div className="w-[16px] h-[7px] rounded-sm relative" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                          <div className="absolute left-0.5 top-0.5 bottom-0.5 w-3/4 rounded-sm bg-[#18A66D]" />
                        </div>
                      </div>
                    </div>

                    {/* Notification */}
                    <div className="mx-3 mb-3 backdrop-blur rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(24,166,109,0.08)" }}>
                      <div className="w-10 h-10 bg-[#18A66D] rounded-xl flex items-center justify-center shrink-0"
                        style={{ boxShadow: "0 0 18px rgba(24,166,109,0.4)" }}>
                        <span className="text-white text-base font-black">T</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white">TerminStop</div>
                        <div className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full" style={{ boxShadow: "0 0 6px #18A66D" }} />
                    </div>

                    {/* Chat */}
                    <div className="px-4 space-y-3">
                      <div className="bg-[#18A66D] text-white text-[12px] leading-[1.65] rounded-2xl rounded-tl-sm p-4 max-w-[88%]"
                        style={{ boxShadow: "0 8px 24px rgba(24,166,109,0.28)" }}>
                        Hallo Frau Schmidt 👋<br /><br />
                        Sie haben morgen,<br /><strong>Dienstag um 14:00 Uhr</strong><br />einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>– Friseurstudio Elegance</span>
                      </div>
                      <div className="text-[9px] pl-1" style={{ color: "rgba(255,255,255,0.2)" }}>✓✓ Zugestellt · 24h vorher</div>
                      <div className="flex justify-end">
                        <div className="text-[12px] leading-[1.6] rounded-2xl rounded-tr-sm p-3.5 max-w-[78%]" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                          Danke! Bin pünktlich da 🙂
                        </div>
                      </div>
                      <div className="text-[9px] text-right pr-1" style={{ color: "rgba(255,255,255,0.2)" }}>Gelesen</div>
                    </div>

                    {/* Confirmed */}
                    <div className="absolute bottom-5 left-3 right-3">
                      <div className="backdrop-blur-sm rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(24,166,109,0.12)", border: "1px solid rgba(24,166,109,0.25)", boxShadow: "0 0 24px rgba(24,166,109,0.1)" }}>
                        <div className="w-8 h-8 bg-[#18A66D] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#4AE89B]">Termin bestätigt</div>
                          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Kundin erscheint pünktlich</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>
        </section>

        {/* ══ MARQUEE STRIP ══ */}
        <section className="bg-white border-y border-gray-100 py-4 overflow-hidden">
          <div className="flex">
            <div className="marquee-track flex gap-12 shrink-0">
              {[...industries, ...industries].map((b, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <div className="w-1.5 h-1.5 bg-[#18A66D] rounded-full" />
                  <span className="text-sm font-medium whitespace-nowrap text-gray-400">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROBLEM ══ */}
        <section className="bg-white py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="max-w-2xl mb-20">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Problem</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] leading-[1.1] mb-6">
                  Terminausfälle kosten Sie<br />täglich echtes Geld.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">Jeder Betrieb verliert täglich durch No-Shows Umsatz. Nicht einmal, sondern jeden Tag.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {[
                { to: 50, suffix: "€", pre: "", label: "Verlust pro Ausfall", desc: "Jeder verpasste Termin ist Umsatz, der einfach nicht stattfindet." },
                { to: 9, suffix: "×", pre: "bis ", label: "Ausfälle pro Woche", desc: "Im Schnitt erlebt jeder Betrieb mehrfach pro Woche, dass Kunden nicht erscheinen." },
                { to: 2000, suffix: "€+", pre: "bis ", label: "Verlust pro Monat", desc: "Was nach wenig klingt, summiert sich zu Tausenden Euro im Jahr." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className={`p-10 bg-white ${i < 2 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}`}>
                    <div className="text-5xl font-black text-[#0B0D14] mb-3 tabular-nums">
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div className="text-sm font-bold text-[#0B0D14] mb-2">{item.label}</div>
                    <div className="text-sm text-gray-400 leading-relaxed">{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-8 rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: "#06091A" }}>
                <div>
                  <div className="text-white font-bold text-lg mb-1">Die Lösung? Ein automatisches SMS-System.</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Einmal einrichten – läuft dauerhaft. Kein Aufwand, keine Technik-Kenntnisse.</div>
                </div>
                <a href="/lead" className="shrink-0 cta-dark px-8 py-3.5 rounded-full font-bold text-sm whitespace-nowrap">
                  Jetzt kostenlos anfragen →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="wie-es-funktioniert" className="py-32 bg-grid-light" style={{ background: "#F5F7FC" }}>
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="max-w-2xl mb-16">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">So funktioniert's</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] leading-[1.1] mb-6">Drei Schritte.<br />Dann läuft es von selbst.</h2>
                <p className="text-gray-500 text-lg">Kein IT-Studium. Kein Aufwand. Dauerhaft.</p>
              </div>
            </Reveal>
            <div className="space-y-4">
              {[
                { num: "01", title: "Einmalig einrichten – in unter 10 Minuten", desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Persönlicher Onboarding-Support inklusive. Keine Technik-Kenntnisse nötig.", tag: "Persönliche Begleitung" },
                { num: "02", title: "Kunden erhalten automatisch eine SMS", desc: "24 Stunden vor jedem Termin verschickt TerminStop eine personalisierte Erinnerung – mit Ihrem Namen, dem genauen Termin und dem richtigen Ton.", tag: "Vollständig automatisch" },
                { num: "03", title: "Ihre Termine werden tatsächlich eingehalten", desc: "Weniger Ausfälle, planbarere Tage, mehr Umsatz. Sie sehen in der Übersicht, wer bestätigt hat – und können rechtzeitig reagieren.", tag: "95% Erfolgsquote" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 100}>
                  <TiltCard className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start cursor-default shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="text-[72px] font-black leading-none shrink-0 select-none md:w-24 text-center" style={{ color: "rgba(24,166,109,0.1)" }}>{s.num}</div>
                    <div className="flex-1 pt-1">
                      <div className="inline-block bg-[#F0FBF5] border border-[#18A66D]/20 text-[#18A66D] text-[11px] font-bold px-3 py-1 rounded-full mb-3">{s.tag}</div>
                      <h3 className="text-xl font-bold text-[#0B0D14] mb-3">{s.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRODUCT SHOWCASE ══ */}
        <section className="bg-white py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <TiltCard className="flex justify-center">
              <div className="relative float-anim" style={{ animationDelay: "1s" }}>
                <div className="absolute -inset-8 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(ellipse, #18A66D44 0%, transparent 70%)" }} />
                <div className="relative p-3 rounded-[46px] shadow-2xl" style={{ background: "#02060A", border: "1px solid rgba(24,166,109,0.12)", boxShadow: "0 40px 80px rgba(0,0,0,0.18)" }}>
                  <div className="bg-white w-[280px] h-[565px] rounded-[36px] overflow-hidden">
                    <div className="bg-[#18A66D] px-5 pt-8 pb-6">
                      <div className="text-white/60 text-[11px] mb-1 font-medium">Guten Morgen 👋</div>
                      <div className="text-white font-black text-xl mb-3">Heute, 6 Termine</div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="bg-white/15 rounded-xl px-3 py-1.5 text-white/85 text-[11px] font-semibold">5 ✓ bestätigt</div>
                        <div className="bg-white/8 rounded-xl px-3 py-1.5 text-white/50 text-[11px]">1 ausstehend</div>
                      </div>
                    </div>
                    <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 mb-4">
                      <div className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Nächster Termin</div>
                      <div className="text-sm font-bold text-[#0B0D14]">Maria Schmidt</div>
                      <div className="text-xs text-gray-500">14:00 Uhr · Damenhaarschnitt</div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#18A66D] rounded-full" />
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
                        <div key={j} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                          <span className="text-[11px] text-gray-400 w-10 shrink-0 font-medium tabular-nums">{a.time}</span>
                          <span className="text-[11px] text-[#0B0D14] font-medium flex-1">{a.name}</span>
                          <span className="text-sm font-bold" style={{ color: a.c }}>{a.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <Reveal delay={100}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Dashboard</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] leading-[1.1] mb-6">Alles im Blick.<br />Nichts verpassen.</h2>
                <p className="text-gray-500 text-lg mb-10 leading-relaxed">Ihr komplettes Terminmanagement an einem Ort – übersichtlich, einfach, immer aktuell.</p>
                <div className="space-y-5">
                  {[
                    { title: "Tagesübersicht auf einen Blick", desc: "Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                    { title: "Automatische SMS-Erinnerungen", desc: "24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                    { title: "Kundenkartei", desc: "Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                    { title: "Auswertungen & Einblicke", desc: "Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="w-2 h-2 mt-2 bg-[#18A66D] rounded-full shrink-0" />
                      <div>
                        <div className="font-bold text-[#0B0D14] mb-1">{f.title}</div>
                        <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ COMPARISON ══ */}
        <section className="py-32" style={{ background: "#06091A" }}>
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-14">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">Mit oder ohne<br />TerminStop.</h2>
                <p style={{ color: "rgba(255,255,255,0.35)" }}>Der Unterschied – schwarz auf weiß.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Reveal delay={0}>
                <div className="rounded-2xl p-8 h-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 font-bold text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>✗</div>
                    <h3 className="font-bold text-white">Ohne TerminStop</h3>
                  </div>
                  {["Kunden vergessen Termine – Sie erfahren es zu spät", "Sie rufen selbst an – kostet Zeit und Nerven", "Unberechenbare Tage, lückenhafte Auslastung", "Keine Vorwarnung – kein Reaktionsspielraum", "Bis zu €2.000+ Umsatzverlust pro Monat"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3">
                      <span className="text-red-400/60 shrink-0 mt-0.5">✗</span>
                      <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="relative rounded-2xl p-8 overflow-hidden h-full" style={{ background: "linear-gradient(135deg, #0C2A1C, #102218)", border: "1px solid rgba(24,166,109,0.2)" }}>
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #18A66D, transparent 70%)" }} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-8 h-8 rounded-full bg-[#18A66D] flex items-center justify-center text-white font-bold text-sm">✓</div>
                      <h3 className="font-bold text-white">Mit TerminStop</h3>
                    </div>
                    {["Kunden werden automatisch erinnert – und erscheinen", "Kein manueller Aufwand, kein Nachtelefonieren", "Planbare Tage, maximale Auslastung", "Rechtzeitig informiert – Zeit zum Reagieren", "Monatliche Einsparung durch Automatisierung"].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 mb-3">
                        <span className="text-[#18A66D] shrink-0 mt-0.5">✓</span>
                        <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="bg-white py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Echte Ergebnisse</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] mb-3">Was Betriebe berichten.</h2>
                <p className="text-gray-400">Keine Versprechen – nur echte Erfahrungen.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 80}>
                  <TiltCard className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default h-full">
                    <div className="flex items-start justify-between mb-5">
                      <div className="bg-[#F0FBF5] text-[#18A66D] text-xs font-bold px-3 py-1.5 rounded-full">✓ {r.result}</div>
                      <div className="text-yellow-400 text-sm">★★★★★</div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6 italic">„{r.text}"</p>
                    <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#18A66D] to-[#0A7A4F] text-white flex items-center justify-center rounded-full text-sm font-black shrink-0">{r.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-bold text-[#0B0D14]">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.role} · {r.city}</div>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="preise" className="py-32" style={{ background: "#F5F7FC" }}>
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Preise</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] leading-[1.1] mb-4">Einfach. Transparent.<br />Ohne Überraschungen.</h2>
                <p className="text-gray-500 text-lg">Wählen Sie das Paket passend zu Ihrem Terminvolumen. Monatlich kündbar.</p>
              </div>
            </Reveal>

            {/* ROI callout */}
            <Reveal delay={100}>
              <div className="max-w-2xl mx-auto mb-14">
                <div className="bg-white border border-[#18A66D]/15 rounded-2xl px-7 py-5 flex items-center gap-5 shadow-sm">
                  <div className="w-10 h-10 bg-[#F0FBF5] rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#18A66D] font-black text-lg">↑</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#0B0D14] mb-1">Zur Einordnung</div>
                    <div className="text-sm text-gray-500 leading-relaxed">
                      Schon <strong className="text-[#0B0D14]">2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig –
                      alles darüber hinaus ist direkter Gewinn.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 100}>
                  {plan.popular ? (
                    <div className="relative rounded-2xl flex flex-col pricing-card-popular" style={{ minHeight: 480 }}>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#18A66D] text-white text-[11px] font-bold px-5 py-1.5 rounded-full whitespace-nowrap z-10">
                        ✓ Meistgewählt
                      </div>
                      <div className="p-8 flex flex-col h-full">
                        <div className="mb-6">
                          <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#4AE89B]">{plan.name}</div>
                          <div className="text-5xl font-black mb-1 text-white">
                            €{plan.price}
                            <span className="text-base font-normal ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>/Monat</span>
                          </div>
                          <div className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{plan.sms} · €{plan.perDay}/Tag</div>
                        </div>
                        <div className="space-y-3 flex-1 mb-8">
                          {plan.features.map((f, j) => (
                            <div key={j} className="flex items-center gap-2.5">
                              <span className="text-[#4AE89B] text-sm shrink-0">✓</span>
                              <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <a href="/lead" className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-[#18A66D] text-white hover:bg-[#149A60] transition-colors">
                          Jetzt anfragen →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <TiltCard className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:border-[#18A66D]/30 hover:shadow-md transition-all duration-300 cursor-default shadow-sm">
                      <div className="mb-6">
                        <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-400">{plan.name}</div>
                        <div className="text-5xl font-black mb-1 text-[#0B0D14]">
                          €{plan.price}
                          <span className="text-base font-normal ml-1 text-gray-400">/Monat</span>
                        </div>
                        <div className="text-sm text-gray-400">{plan.sms} · €{plan.perDay}/Tag</div>
                      </div>
                      <div className="space-y-3 flex-1 mb-8">
                        {plan.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2.5">
                            <span className="text-[#18A66D] text-sm shrink-0">✓</span>
                            <span className="text-sm text-gray-600">{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="block w-full py-3.5 rounded-xl font-bold text-sm text-center border border-gray-200 text-gray-600 hover:border-[#18A66D] hover:text-[#18A66D] hover:bg-[#F0FBF5] transition-all">
                        Jetzt anfragen →
                      </a>
                    </TiltCard>
                  )}
                </Reveal>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar, kein Vertrag
            </p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="bg-white py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center mb-14">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">FAQ</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B0D14] mb-4">Häufige Fragen.</h2>
                <p className="text-gray-400">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors bg-white">
                    <span className="font-semibold text-[#0B0D14] text-sm leading-snug">{faq.q}</span>
                    <span className={`text-[#18A66D] text-2xl shrink-0 transition-transform duration-300 font-light leading-none ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-7 pb-6 pt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 bg-white">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="relative overflow-hidden py-40" style={{ background: "linear-gradient(160deg, #06091A 0%, #080C1C 100%)" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[500px] rounded-full float-anim" style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.1) 0%, transparent 60%)" }} />
          </div>
          <div className="bg-grid-dark absolute inset-0 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 border text-xs font-semibold px-5 py-2.5 rounded-full mb-10" style={{ background: "rgba(24,166,109,0.08)", border: "1px solid rgba(24,166,109,0.18)", color: "rgba(74,232,155,0.9)" }}>
                ✓ Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
                Hören Sie auf,<br />
                <span className="text-[#18A66D]">Geld zu verlieren.</span>
              </h2>
              <p className="text-xl leading-relaxed mb-14 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
                Ein 15-minütiges Gespräch – und Sie wissen, was TerminStop konkret für Ihren Betrieb bedeutet.
              </p>
              <a href="/lead" className="cta-primary inline-flex items-center gap-3 font-black px-14 py-5 rounded-full text-base cursor-pointer">
                Jetzt kostenloses Gespräch sichern →
              </a>
              <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.22)" }}>
                <span>✓ Kein Vertrag</span>
                <span>✓ Persönliches Gespräch</span>
                <span>✓ Klare Antworten</span>
                <span>✓ Sofort startklar</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-white border-t border-gray-100 py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-base font-black">
                <span className="text-[#18A66D]">Termin</span>
                <span className="text-[#0B0D14]">Stop</span>
              </span>
              <p className="text-xs text-gray-400 mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
              {["Impressum", "Datenschutz", "AGB", "AVV", "Login"].map((l, i) => (
                <a key={i} href={`/${l.toLowerCase()}`} className="hover:text-gray-700 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
