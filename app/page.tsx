"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/* ─── Canvas Particle Network ─────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const N = 72
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number }
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6, alpha: Math.random() * 0.5 + 0.2,
    }))

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -999, y: -999 } }
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      // move & wrap
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        // subtle mouse repulsion
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) { p.vx += dx / d * 0.08; p.vy += dy / d * 0.08 }
        // friction
        p.vx *= 0.995; p.vy *= 0.995
      }
      // lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(24,166,109,${(1 - d / 130) * 0.18})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
      // dots
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(24,166,109,${p.alpha})`
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none md:pointer-events-auto" />
}

/* ─── 3D Tilt Card ─────────────────────────────────────────── */
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)`
    el.style.transition = "transform 0.1s ease"
  }
  const onLeave = () => {
    const el = ref.current!
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)"
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

/* ─── Magnetic Button ────────────────────────────────────────── */
function MagneticBtn({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.25
    const y = (e.clientY - r.top - r.height / 2) * 0.25
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = "transform 0.15s ease"
  }
  const onLeave = () => {
    const el = ref.current!
    el.style.transform = "translate(0,0)"
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)"
  }
  return (
    <a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </a>
  )
}

/* ─── Scroll Reveal ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
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
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes glow { 0%,100%{box-shadow:0 0 25px 0 rgba(24,166,109,0.4)} 50%{box-shadow:0 0 55px 12px rgba(24,166,109,0.6)} }
        @keyframes wordIn { 0%{opacity:0;transform:translateY(12px) skewY(3deg)} 15%,85%{opacity:1;transform:translateY(0) skewY(0)} 100%{opacity:0;transform:translateY(-12px) skewY(-3deg)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes holo { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes borderRot { 0%{--a:0deg} 100%{--a:360deg} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(500%)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes orbit { 0%{transform:rotate(0deg) translateX(120px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        @keyframes orbit2 { 0%{transform:rotate(180deg) translateX(80px) rotate(-180deg)} 100%{transform:rotate(540deg) translateX(80px) rotate(-540deg)} }

        .grad-btn { background:linear-gradient(270deg,#18A66D,#00E87A,#0D7A54,#18A66D); background-size:300% 100%; animation:gradShift 5s ease infinite; }
        .glow-btn { animation:glow 3s ease-in-out infinite; }
        .word-anim { animation:wordIn 2.4s ease-in-out; }
        .marquee-track { animation:marquee 28s linear infinite; }
        .float-anim { animation:float 7s ease-in-out infinite; }
        .shimmer-text { background:linear-gradient(90deg,#18A66D 0%,#4AE89B 30%,#00FFB3 50%,#4AE89B 70%,#18A66D 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
        .holo-card { background:linear-gradient(135deg,#0C2A1C 0%,#102918 20%,#0f3a22 35%,#18A66D22 50%,#0f3a22 65%,#102918 80%,#0C2A1C 100%); background-size:400% 400%; animation:holo 6s ease infinite; position:relative; overflow:hidden; }
        .holo-card::before { content:''; position:absolute; inset:-2px; border-radius:inherit; padding:2px; background:linear-gradient(135deg,#18A66D,#4AE89B,#00FFB3,#18A66D,#4AE89B); background-size:400% 400%; animation:holo 4s ease infinite; -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; }
        .card-3d { transform-style:preserve-3d; }
        .scanline-fx { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
        .scanline-fx::after { content:''; position:absolute; top:0; left:0; right:0; height:30%; background:linear-gradient(transparent,rgba(0,255,120,0.03),transparent); animation:scanline 5s linear infinite; }
        .orbit-dot { position:absolute; top:50%; left:50%; width:8px; height:8px; margin:-4px; border-radius:50%; }
        .orbit-1 { animation:orbit 8s linear infinite; background:#18A66D; box-shadow:0 0 12px #18A66D; }
        .orbit-2 { animation:orbit2 5s linear infinite; background:#4AE89B; box-shadow:0 0 8px #4AE89B; }
        .pulse-ring { position:absolute; inset:0; border-radius:50%; background:rgba(24,166,109,0.3); animation:pulse-ring 2s cubic-bezier(0,0,0.2,1) infinite; }
        .bg-grid-dark { background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px); background-size:60px 60px; }
        .bg-grid-light { background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px); background-size:60px 60px; }
        .noise { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }
      `}</style>

      <div className="min-h-screen text-white" style={{ fontFamily: "'Inter','Manrope',system-ui,sans-serif" }}>

        {/* ─── NAVBAR ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-[#02060A]/80 backdrop-blur-2xl border-b border-white/6">
          <span className="text-lg font-black tracking-tight select-none">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-white">Stop</span>
          </span>
          <div className="flex items-center gap-5">
            <a href="#wie-es-funktioniert" className="text-sm text-white/35 hover:text-white transition-colors hidden md:block">So funktioniert's</a>
            <a href="#preise" className="text-sm text-white/35 hover:text-white transition-colors hidden md:block">Preise</a>
            <a href="/login" className="text-sm text-white/35 hover:text-white transition-colors hidden md:block">Login</a>
            <a href="/demo" className="text-sm text-white/50 hover:text-[#4AE89B] transition-colors hidden md:block border border-white/10 hover:border-[#18A66D]/40 px-4 py-2 rounded-full">
              Live-Demo
            </a>
            <a href="/lead" className="grad-btn text-white text-sm px-5 py-2.5 rounded-full font-bold shadow-lg shadow-[#18A66D]/25 hover:opacity-90 transition-opacity">
              Kostenlos anfragen
            </a>
          </div>
        </nav>

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#02060A] overflow-hidden pt-16">
          <ParticleCanvas />

          {/* Radial glow center */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.12) 0%, transparent 65%)" }} />

          {/* Orbiting dots decoration (desktop) */}
          <div className="absolute top-[30%] right-[12%] w-0 h-0 hidden xl:block" style={{ zIndex: 1 }}>
            <div className="orbit-dot orbit-1" />
            <div className="orbit-dot orbit-2" />
            <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", border: "1px dashed rgba(24,166,109,0.1)", top: -120, left: -120 }} />
          </div>

          <div className="bg-grid-dark absolute inset-0 pointer-events-none" />
          <div className="noise absolute inset-0 pointer-events-none opacity-40" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT TEXT */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/4 border border-white/10 text-white/60 text-xs font-semibold px-4 py-2.5 rounded-full mb-8 backdrop-blur">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="pulse-ring" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18A66D]" />
                </span>
                SMS-Erinnerungen für Ihren&nbsp;
                <span className="text-[#18A66D] font-black" key={heroWord} style={{ animation: "wordIn 2.4s ease-in-out" }}>
                  {words[heroWord]}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black leading-[1.0] tracking-tight mb-7">
                <span className="text-white">Kein Termin</span><br />
                <span className="shimmer-text">geht mehr<br />verloren.</span>
              </h1>

              <p className="text-lg text-white/40 leading-relaxed mb-10 max-w-md">
                TerminStop erinnert Ihre Kunden automatisch per SMS –
                damit Termine eingehalten werden und Sie sich auf das Wesentliche konzentrieren können.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <MagneticBtn href="/lead"
                  className="grad-btn glow-btn inline-flex items-center justify-center gap-2 text-white px-10 py-4 rounded-full font-black text-base cursor-pointer shadow-2xl shadow-[#18A66D]/30">
                  Kostenlose Beratung sichern →
                </MagneticBtn>
                <a href="/demo"
                  className="inline-flex items-center justify-center gap-2 text-white/50 px-6 py-4 rounded-full text-sm hover:text-[#4AE89B] transition-colors border border-white/10 hover:border-[#18A66D]/40 backdrop-blur">
                  🎭 Live-Demo ansehen
                </a>
              </div>

              {/* Animated stats */}
              <div className="flex flex-wrap gap-10 pt-8 border-t border-white/6">
                {[
                  { to: 50, suffix: "+", label: "Betriebe aktiv" },
                  { to: 95, suffix: "%", label: "Weniger Ausfälle" },
                  { to: 10, suffix: " Min.", label: "Einrichtung" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white">
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PHONE – 3D tilt */}
            <TiltCard className="flex justify-center lg:justify-end">
              <div className="relative float-anim" style={{ animationDelay: "0.5s" }}>
                <div className="absolute -inset-12 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(24,166,109,0.2) 0%, transparent 65%)" }} />
                {/* Outer ring glow */}
                <div className="absolute -inset-3 rounded-[54px] opacity-40"
                  style={{ background: "linear-gradient(135deg, rgba(24,166,109,0.3), transparent 60%)" }} />

                <div className="relative bg-[#070F09] p-[14px] rounded-[50px] border border-[#18A66D]/20"
                  style={{ boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(24,166,109,0.1) inset, 0 0 60px rgba(24,166,109,0.08)" }}>

                  <div className="w-[290px] h-[590px] rounded-[38px] overflow-hidden relative scanline-fx"
                    style={{ background: "linear-gradient(180deg, #0a1a0d 0%, #060d08 100%)" }}>

                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-3">
                      <span className="text-[11px] text-white/40 font-semibold tabular-nums">9:41</span>
                      <div className="w-[54px] h-[18px] bg-black rounded-full mx-auto" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 14 }} />
                      <div className="flex items-center gap-1">
                        <div className="w-[16px] h-[7px] rounded-sm border border-white/20 relative"><div className="absolute left-0.5 top-0.5 bottom-0.5 w-3/4 bg-[#18A66D] rounded-sm" /></div>
                      </div>
                    </div>

                    {/* Notification */}
                    <div className="mx-3 mb-3 bg-white/6 backdrop-blur rounded-2xl p-3.5 border border-white/8 flex items-center gap-3"
                      style={{ boxShadow: "0 4px 20px rgba(24,166,109,0.1)" }}>
                      <div className="w-10 h-10 bg-[#18A66D] rounded-xl flex items-center justify-center shrink-0"
                        style={{ boxShadow: "0 0 20px rgba(24,166,109,0.5)" }}>
                        <span className="text-white text-base font-black">T</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white">TerminStop</div>
                        <div className="text-[10px] text-white/30 truncate">SMS-Erinnerung · Jetzt</div>
                      </div>
                      <div className="w-2 h-2 bg-[#18A66D] rounded-full" style={{ boxShadow: "0 0 8px #18A66D" }} />
                    </div>

                    {/* Chat */}
                    <div className="px-4 space-y-3">
                      <div className="bg-[#18A66D] text-white text-[12px] leading-[1.65] rounded-2xl rounded-tl-sm p-4 max-w-[88%]"
                        style={{ boxShadow: "0 8px 30px rgba(24,166,109,0.35)" }}>
                        Hallo Frau Schmidt 👋<br /><br />
                        Sie haben morgen,<br /><strong>Dienstag um 14:00 Uhr</strong><br />einen Termin bei uns.<br /><br />
                        Wir freuen uns auf Sie!<br />
                        <span className="text-white/50 text-[10px]">– Friseurstudio Elegance</span>
                      </div>
                      <div className="text-[9px] text-white/20 pl-1">✓✓ Zugestellt · 24h vorher</div>
                      <div className="flex justify-end">
                        <div className="bg-white/8 border border-white/10 text-white/80 text-[12px] leading-[1.6] rounded-2xl rounded-tr-sm p-3.5 max-w-[78%]">
                          Danke! Bin pünktlich da 🙂
                        </div>
                      </div>
                      <div className="text-[9px] text-white/20 text-right pr-1">Gelesen</div>
                    </div>

                    {/* Confirmed */}
                    <div className="absolute bottom-5 left-3 right-3">
                      <div className="bg-[#18A66D]/15 border border-[#18A66D]/30 backdrop-blur-sm rounded-2xl p-3.5 flex items-center gap-3"
                        style={{ boxShadow: "0 0 30px rgba(24,166,109,0.15)" }}>
                        <div className="w-8 h-8 bg-[#18A66D] rounded-full flex items-center justify-center shrink-0"
                          style={{ boxShadow: "0 0 15px rgba(24,166,109,0.5)" }}>
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#4AE89B]">Termin bestätigt</div>
                          <div className="text-[10px] text-white/30">Kundin erscheint pünktlich</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#18A66D]/40 to-transparent" />
          </div>
        </section>

        {/* ══ MARQUEE STRIP ══ */}
        <section className="bg-[#04100A]/80 border-y border-[#18A66D]/15 py-4 overflow-hidden">
          <div className="flex">
            <div className="marquee-track flex gap-12 shrink-0">
              {[...industries, ...industries].map((b, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <div className="w-1.5 h-1.5 bg-[#18A66D] rounded-full" style={{ boxShadow: "0 0 6px #18A66D" }} />
                  <span className="text-sm text-white/35 font-medium whitespace-nowrap">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROBLEM ══ */}
        <section className="bg-white py-32 bg-grid-light">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="max-w-2xl mb-20">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Das Problem</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#02060A] leading-[1.1] mb-6">
                  Terminausfälle kosten Sie<br />täglich echtes Geld.
                </h2>
                <p className="text-[#6B7280] text-lg leading-relaxed">Jeder Betrieb verliert täglich durch No-Shows Umsatz. Nicht einmal, sondern jeden Tag.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E8EDF0] rounded-2xl overflow-hidden shadow-sm">
              {[
                { to: 50, suffix: "€", pre: "", label: "Verlust pro Ausfall", desc: "Jeder verpasste Termin ist Umsatz, der einfach nicht stattfindet." },
                { to: 9, suffix: "×", pre: "bis ", label: "Ausfälle pro Woche", desc: "Im Schnitt erlebt jeder Betrieb mehrfach pro Woche, dass Kunden nicht erscheinen." },
                { to: 2000, suffix: "€+", pre: "bis ", label: "Verlust pro Monat", desc: "Was nach wenig klingt, summiert sich zu Tausenden Euro im Jahr." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className={`p-10 bg-white ${i < 2 ? "border-b md:border-b-0 md:border-r border-[#F0F0F0]" : ""}`}>
                    <div className="text-5xl font-black text-[#02060A] mb-3 tabular-nums">
                      {item.pre}<Counter to={item.to} suffix={item.suffix} />
                    </div>
                    <div className="text-sm font-bold text-[#02060A] mb-2">{item.label}</div>
                    <div className="text-sm text-[#9CA3AF] leading-relaxed">{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-8 bg-[#02060A] rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-white font-bold text-lg mb-1">Die Lösung? Ein automatisches SMS-System.</div>
                  <div className="text-white/35 text-sm">Einmal einrichten – läuft dauerhaft. Kein Aufwand, keine Technik-Kenntnisse.</div>
                </div>
                <a href="/lead" className="shrink-0 grad-btn text-white px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#18A66D]/25 whitespace-nowrap">
                  Jetzt kostenlos anfragen →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="wie-es-funktioniert" className="bg-[#02060A] py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="max-w-2xl mb-16">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">So funktioniert's</div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6">Drei Schritte.<br />Dann läuft es von selbst.</h2>
                <p className="text-white/35 text-lg">Kein IT-Studium. Kein Aufwand. Für immer.</p>
              </div>
            </Reveal>
            <div className="space-y-4">
              {[
                { num: "01", title: "Einmalig einrichten – in unter 10 Minuten", desc: "Wir richten TerminStop gemeinsam mit Ihnen ein. Persönlicher Onboarding-Support inklusive. Keine Technik-Kenntnisse nötig.", tag: "Persönliche Begleitung" },
                { num: "02", title: "Kunden erhalten automatisch eine SMS", desc: "24 Stunden vor jedem Termin verschickt TerminStop eine personalisierte Erinnerung – mit Ihrem Namen, dem genauen Termin und dem richtigen Ton.", tag: "Vollständig automatisch" },
                { num: "03", title: "Ihre Termine werden tatsächlich eingehalten", desc: "Weniger Ausfälle, planbarere Tage, mehr Umsatz. Sie sehen in der Übersicht, wer bestätigt hat – und können rechtzeitig reagieren.", tag: "95% Erfolgsquote" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 100}>
                  <TiltCard className="bg-white/3 border border-white/7 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start hover:bg-white/5 hover:border-[#18A66D]/20 transition-colors duration-300 cursor-default">
                    <div className="text-[72px] font-black leading-none text-white/5 shrink-0 select-none md:w-24 text-center group-hover:text-[#18A66D]/10 transition-colors">{s.num}</div>
                    <div className="flex-1 pt-1">
                      <div className="inline-block bg-[#18A66D]/12 border border-[#18A66D]/20 text-[#4AE89B] text-[11px] font-bold px-3 py-1 rounded-full mb-3">{s.tag}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                      <p className="text-white/40 leading-relaxed">{s.desc}</p>
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
                <div className="absolute -inset-8 rounded-full opacity-25 pointer-events-none" style={{ background: "radial-gradient(ellipse, #18A66D33 0%, transparent 70%)" }} />
                <div className="relative bg-[#02060A] p-3 rounded-[46px] shadow-2xl border border-[#18A66D]/15" style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 40px rgba(24,166,109,0.06)" }}>
                  <div className="bg-white w-[280px] h-[565px] rounded-[36px] overflow-hidden">
                    <div className="bg-[#18A66D] px-5 pt-8 pb-6">
                      <div className="text-white/60 text-[11px] mb-1 font-medium">Guten Morgen 👋</div>
                      <div className="text-white font-black text-xl mb-3">Heute, 6 Termine</div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="bg-white/15 rounded-xl px-3 py-1.5 text-white/85 text-[11px] font-semibold">5 ✓ bestätigt</div>
                        <div className="bg-white/8 rounded-xl px-3 py-1.5 text-white/50 text-[11px]">1 ausstehend</div>
                      </div>
                    </div>
                    <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 border border-[#E8EDF0] mb-4">
                      <div className="text-[10px] text-[#9CA3AF] mb-1 font-bold uppercase tracking-wide">Nächster Termin</div>
                      <div className="text-sm font-bold text-[#02060A]">Maria Schmidt</div>
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
                          <span className="text-[11px] text-[#02060A] font-medium flex-1">{a.name}</span>
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
                <h2 className="text-4xl md:text-5xl font-black text-[#02060A] leading-[1.1] mb-6">Alles im Blick.<br />Nichts verpassen.</h2>
                <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">Ihr komplettes Terminmanagement an einem Ort – übersichtlich, einfach, immer aktuell.</p>
                <div className="space-y-4">
                  {[
                    { icon: "📋", title: "Tagesübersicht auf einen Blick", desc: "Sehen Sie sofort, welche Kunden kommen – und wer noch nicht bestätigt hat." },
                    { icon: "📱", title: "Automatische SMS-Erinnerungen", desc: "24h vor jedem Termin geht eine personalisierte Nachricht raus – ohne Ihr Zutun." },
                    { icon: "👥", title: "Kundenkartei", desc: "Alle Kontakte und die komplette Terminhistorie an einem Ort." },
                    { icon: "📊", title: "Auswertungen & Einblicke", desc: "Sehen Sie auf einen Blick, wie sich Ihr Betrieb entwickelt." },
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="w-11 h-11 bg-[#F0F9F4] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-[#E8FBF3] group-hover:scale-110 transition-all duration-200">{f.icon}</div>
                      <div className="pt-0.5">
                        <div className="font-bold text-[#02060A] mb-1">{f.title}</div>
                        <div className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ COMPARISON ══ */}
        <section className="bg-[#02060A] py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-14">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">Mit oder ohne<br />TerminStop.</h2>
                <p className="text-white/35">Der Unterschied – schwarz auf weiß.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Reveal delay={0}>
                <div className="bg-white/3 border border-white/8 rounded-2xl p-8 h-full">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 font-bold text-sm border border-red-900/30">✗</div>
                    <h3 className="font-bold text-white">Ohne TerminStop</h3>
                  </div>
                  {["Kunden vergessen Termine – Sie erfahren es zu spät", "Sie rufen selbst an – kostet Zeit und Nerven", "Unberechenbare Tage, lückenhafte Auslastung", "Keine Vorwarnung – kein Reaktionsspielraum", "Bis zu €2.000+ Umsatzverlust pro Monat"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3">
                      <span className="text-red-400/70 shrink-0 mt-0.5">✗</span>
                      <span className="text-white/35 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="relative rounded-2xl p-8 overflow-hidden h-full" style={{ background: "linear-gradient(135deg, #0C2A1C, #102218)" }}>
                  <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(24,166,109,0.08), transparent 60%)" }} />
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #18A66D, transparent 70%)" }} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-8 h-8 rounded-full bg-[#18A66D] flex items-center justify-center text-white font-bold text-sm" style={{ boxShadow: "0 0 15px rgba(24,166,109,0.4)" }}>✓</div>
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
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="bg-[#F7FAFB] py-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center mb-16">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Echte Ergebnisse</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#02060A] mb-3">Was Betriebe berichten.</h2>
                <p className="text-[#9CA3AF]">Keine Versprechen – nur echte Erfahrungen.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((r, i) => (
                <Reveal key={i} delay={i * 80}>
                  <TiltCard className="bg-white border border-[#E8EDF0] rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-default h-full">
                    <div className="flex items-start justify-between mb-5">
                      <div className="bg-[#E8FBF3] text-[#18A66D] text-xs font-bold px-3 py-1.5 rounded-full">✓ {r.result}</div>
                      <div className="text-[#F59E0B] text-sm">★★★★★</div>
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-6 italic">„{r.text}"</p>
                    <div className="flex items-center gap-3 pt-5 border-t border-[#F0F0F0]">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#18A66D] to-[#0A7A4F] text-white flex items-center justify-center rounded-full text-sm font-black shrink-0">{r.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-bold text-[#02060A]">{r.name}</div>
                        <div className="text-xs text-[#9CA3AF]">{r.role} · {r.city}</div>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="preise" className="bg-[#02060A] py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">Preise</div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">Einfach. Transparent.<br />Ohne Überraschungen.</h2>
                <p className="text-white/35 text-lg">Wählen Sie das Paket passend zu Ihrem Terminvolumen. Monatlich kündbar.</p>
              </div>
            </Reveal>

            {/* ROI callout */}
            <Reveal delay={100}>
              <div className="max-w-2xl mx-auto mb-14">
                <div className="bg-[#18A66D]/8 border border-[#18A66D]/20 rounded-2xl px-7 py-5 flex items-center gap-5">
                  <div className="text-3xl shrink-0">💡</div>
                  <div>
                    <div className="font-bold text-white mb-1">Zur Einordnung</div>
                    <div className="text-sm text-white/45 leading-relaxed">
                      Schon <strong className="text-white">2–3 verhinderte Ausfälle pro Monat</strong> decken das Pro-Paket vollständig –
                      alles darüber hinaus ist direkter Gewinn für Ihren Betrieb.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan, i) => (
                <Reveal key={i} delay={i * 100}>
                  {plan.popular ? (
                    /* HOLOGRAPHIC PRO CARD */
                    <div className="relative rounded-2xl flex flex-col holo-card" style={{ minHeight: 480 }}>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#18A66D] to-[#4AE89B] text-white text-[11px] font-bold px-5 py-1.5 rounded-full whitespace-nowrap z-10"
                        style={{ boxShadow: "0 0 20px rgba(24,166,109,0.5)" }}>
                        ✓ Meistgewählt
                      </div>
                      <div className="p-8 flex flex-col h-full relative z-10">
                        <div className="mb-6">
                          <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#4AE89B]">{plan.name}</div>
                          <div className="text-5xl font-black mb-1 text-white">
                            €{plan.price}
                            <span className="text-base font-normal ml-1 text-white/35">/Monat</span>
                          </div>
                          <div className="text-sm text-white/35">{plan.sms} · €{plan.perDay}/Tag</div>
                        </div>
                        <div className="space-y-2.5 flex-1 mb-8">
                          {plan.features.map((f, j) => (
                            <div key={j} className="flex items-center gap-2.5">
                              <span className="text-[#4AE89B] text-sm shrink-0">✓</span>
                              <span className="text-sm text-white/75">{f}</span>
                            </div>
                          ))}
                        </div>
                        <a href="/lead" className="block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all bg-[#18A66D] text-white hover:bg-[#15C47D]"
                          style={{ boxShadow: "0 0 30px rgba(24,166,109,0.4)" }}>
                          Jetzt anfragen →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <TiltCard className="bg-white/4 border border-white/8 rounded-2xl p-8 flex flex-col hover:border-[#18A66D]/25 hover:bg-white/6 transition-all duration-300 cursor-default">
                      <div className="mb-6">
                        <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-white/30">{plan.name}</div>
                        <div className="text-5xl font-black mb-1 text-white">
                          €{plan.price}
                          <span className="text-base font-normal ml-1 text-white/25">/Monat</span>
                        </div>
                        <div className="text-sm text-white/30">{plan.sms} · €{plan.perDay}/Tag</div>
                      </div>
                      <div className="space-y-2.5 flex-1 mb-8">
                        {plan.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2.5">
                            <span className="text-[#18A66D] text-sm shrink-0">✓</span>
                            <span className="text-sm text-white/55">{f}</span>
                          </div>
                        ))}
                      </div>
                      <a href="/lead" className="block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all border border-white/10 text-white/60 hover:border-[#18A66D]/40 hover:text-white hover:bg-white/4">
                        Jetzt anfragen →
                      </a>
                    </TiltCard>
                  )}
                </Reveal>
              ))}
            </div>
            <p className="text-center text-xs text-white/20">
              Auch als €69-, €149- und €189-Paket verfügbar · Alle Preise sind Endpreise · Monatlich kündbar, kein Vertrag
            </p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="bg-white py-32 bg-grid-light">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <Reveal>
              <div className="text-center mb-14">
                <div className="text-xs font-bold uppercase tracking-widest text-[#18A66D] mb-5">FAQ</div>
                <h2 className="text-4xl md:text-5xl font-black text-[#02060A] mb-4">Häufige Fragen.</h2>
                <p className="text-[#9CA3AF]">Alles, was Sie wissen möchten – bevor Sie anfragen.</p>
              </div>
            </Reveal>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-[#E8EDF0] rounded-2xl overflow-hidden bg-white">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 hover:bg-[#F7FAFB] transition-colors">
                    <span className="font-semibold text-[#02060A] text-sm leading-snug">{faq.q}</span>
                    <span className={`text-[#18A66D] text-2xl shrink-0 transition-transform duration-300 font-light leading-none ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-7 pb-6 pt-4 text-sm text-[#6B7280] leading-relaxed border-t border-[#F0F4F0]">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="relative overflow-hidden bg-[#02060A] py-40">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[600px] rounded-full opacity-20 float-anim"
              style={{ background: "radial-gradient(ellipse, #18A66D 0%, transparent 65%)" }} />
          </div>
          <div className="bg-grid-dark absolute inset-0 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#18A66D]/10 border border-[#18A66D]/18 text-[#4AE89B] text-xs font-semibold px-5 py-2.5 rounded-full mb-10">
                ✓ Kostenlos · Unverbindlich · 15 Minuten
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
                Hören Sie auf,<br />
                <span className="shimmer-text">Geld zu verlieren.</span>
              </h2>
              <p className="text-white/35 text-xl leading-relaxed mb-14 max-w-xl mx-auto">
                Ein 15-minütiges Gespräch – und Sie wissen, was TerminStop konkret für Ihren Betrieb bedeutet.
              </p>
              <MagneticBtn href="/lead"
                className="grad-btn glow-btn inline-flex items-center gap-3 text-white font-black px-14 py-5 rounded-full hover:opacity-90 transition-opacity shadow-2xl shadow-[#18A66D]/40 text-base cursor-pointer">
                Jetzt kostenloses Gespräch sichern →
              </MagneticBtn>
              <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/20 text-sm">
                <span>✓ Kein Vertrag</span>
                <span>✓ Persönliches Gespräch</span>
                <span>✓ Klare Antworten</span>
                <span>✓ Sofort startklar</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-[#02060A] border-t border-white/5 py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-base font-black">
                <span className="text-[#18A66D]">Termin</span>
                <span className="text-white">Stop</span>
              </span>
              <p className="text-xs text-white/18 mt-1">Weniger Ausfälle. Mehr Umsatz.</p>
            </div>
            <div className="flex gap-6 text-xs text-white/20">
              {["Impressum", "Datenschutz", "AGB", "AVV", "Login"].map((l, i) => (
                <a key={i} href={`/${l.toLowerCase()}`} className="hover:text-white/50 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
