"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

/* ─── Canvas Particle Network (same as homepage) ───────────── */
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

    const N = 55
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number }
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.5, alpha: Math.random() * 0.45 + 0.15,
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
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) { p.vx += dx / d * 0.07; p.vy += dy / d * 0.07 }
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.2) { p.vx *= 0.96; p.vy *= 0.96 }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(24,166,109,${(1 - dist / 130) * 0.18})`
            ctx.lineWidth = 0.6
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74,232,155,${p.alpha})`
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function LeadPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    setFormError("")
    const { error } = await supabase
      .from("leads")
      .insert([{ name, phone, email, company, message }])
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setName(""); setPhone(""); setEmail(""); setCompany(""); setMessage("")
    } else {
      console.log(error)
      setFormError("Beim Senden ist ein Fehler aufgetreten. Bitte erneut versuchen.")
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        body { background: #02060A; }

        .lead-root {
          min-height: 100vh;
          background: #02060A;
          color: #E8F5F0;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ambient glow blobs */
        .lead-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(24,166,109,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .lead-root::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(74,232,155,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* nav */
        .lead-nav {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(24,166,109,0.12);
          background: rgba(2,6,10,0.85);
          backdrop-filter: blur(16px);
        }
        @media (max-width: 640px) { .lead-nav { padding: 16px 20px; } }

        .lead-logo { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
        .lead-logo .green { color: #18A66D; }
        .lead-logo .white { color: #E8F5F0; }

        .lead-back {
          font-size: 13px; color: rgba(232,245,240,0.45);
          text-decoration: none; transition: color 0.2s;
          display: flex; align-items: center; gap-4px;
        }
        .lead-back:hover { color: #4AE89B; }

        /* canvas bg */
        .canvas-wrap {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }

        /* layout */
        .lead-body {
          position: relative; z-index: 5;
          max-width: 1100px; margin: 0 auto;
          padding: 60px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 460px;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .lead-body { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .lead-body { padding: 40px 16px 60px; }
        }

        /* ── LEFT ── */
        .lead-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(24,166,109,0.12);
          border: 1px solid rgba(24,166,109,0.3);
          color: #4AE89B; font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;
          letter-spacing: 0.3px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4AE89B;
          box-shadow: 0 0 8px #4AE89B;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .lead-h1 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; line-height: 1.15;
          letter-spacing: -1px; margin-bottom: 16px; color: #E8F5F0;
        }
        .lead-h1 .shimmer {
          background: linear-gradient(90deg, #18A66D 0%, #4AE89B 40%, #00FFB3 55%, #4AE89B 70%, #18A66D 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .lead-sub {
          font-size: 16px; color: rgba(232,245,240,0.5);
          line-height: 1.7; margin-bottom: 40px;
          max-width: 440px;
        }

        /* feature items */
        .features { display: flex; flex-direction: column; gap: 20px; margin-bottom: 44px; }
        .feat-item {
          display: flex; align-items: flex-start; gap: 16px;
        }
        .feat-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: rgba(24,166,109,0.1);
          border: 1px solid rgba(24,166,109,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: all 0.3s;
        }
        .feat-item:hover .feat-icon {
          background: rgba(24,166,109,0.2);
          border-color: rgba(74,232,155,0.4);
          box-shadow: 0 0 16px rgba(24,166,109,0.2);
        }
        .feat-title { font-size: 14px; font-weight: 700; color: #E8F5F0; margin-bottom: 3px; }
        .feat-desc { font-size: 13px; color: rgba(232,245,240,0.45); line-height: 1.5; }

        /* kpis */
        .kpis {
          display: flex; gap: 32px; flex-wrap: wrap;
          padding-top: 28px;
          border-top: 1px solid rgba(24,166,109,0.12);
        }
        .kpi-val {
          font-size: 22px; font-weight: 900; color: #4AE89B;
          text-shadow: 0 0 20px rgba(74,232,155,0.4);
        }
        .kpi-lbl { font-size: 12px; color: rgba(232,245,240,0.4); margin-top: 2px; }

        /* ── RIGHT: Card ── */
        .form-card {
          background: linear-gradient(145deg, rgba(10,30,20,0.95), rgba(5,18,12,0.98));
          border: 1px solid rgba(24,166,109,0.25);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 60px rgba(24,166,109,0.08), 0 32px 64px rgba(0,0,0,0.5);
        }
        /* animated top border */
        .form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #18A66D, #4AE89B, #00FFB3, #4AE89B, #18A66D, transparent);
          background-size: 200% auto;
          animation: borderFlow 3s linear infinite;
        }
        @keyframes borderFlow {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .card-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(24,166,109,0.1);
        }
        .card-title { font-size: 17px; font-weight: 700; color: #E8F5F0; }
        .card-sub { font-size: 12px; color: rgba(232,245,240,0.35); margin-top: 4px; }

        .form-inner { padding: 24px 28px 28px; }

        .field { margin-bottom: 16px; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: rgba(232,245,240,0.4); letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(24,166,109,0.18);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px; color: #E8F5F0;
          font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .field input::placeholder,
        .field textarea::placeholder { color: rgba(232,245,240,0.22); }
        .field input:focus,
        .field textarea:focus {
          border-color: rgba(74,232,155,0.5);
          background: rgba(24,166,109,0.06);
          box-shadow: 0 0 0 3px rgba(24,166,109,0.1);
        }
        .field textarea { resize: none; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .submit-btn {
          width: 100%; margin-top: 8px;
          padding: 15px; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; outline: none;
          background: linear-gradient(270deg, #18A66D, #00E87A, #4AE89B, #18A66D);
          background-size: 300% auto;
          color: #02060A;
          animation: gradShift 4s ease infinite;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 0 28px rgba(24,166,109,0.35);
          letter-spacing: 0.3px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 0 40px rgba(24,166,109,0.5);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; animation: none; background: #1a2a20; color: #4AE89B; }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .spin {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(2,6,10,0.3);
          border-top-color: #02060A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 6px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .micro-trust {
          display: flex; justify-content: center; gap: 20px;
          margin-top: 12px;
          font-size: 11px; color: rgba(232,245,240,0.28);
        }

        /* error */
        .form-error {
          display: flex; gap: 10px; align-items: center;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #F87171; margin-bottom: 16px;
        }

        /* ── SUCCESS ── */
        .success-card {
          background: linear-gradient(145deg, rgba(10,30,20,0.95), rgba(5,18,12,0.98));
          border: 1px solid rgba(24,166,109,0.25);
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 0 60px rgba(24,166,109,0.1), 0 32px 64px rgba(0,0,0,0.5);
          position: relative;
          text-align: center;
        }
        .success-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #18A66D, #4AE89B, #18A66D, transparent);
          background-size: 200% auto;
          animation: borderFlow 3s linear infinite;
        }
        .success-top {
          background: linear-gradient(135deg, rgba(24,166,109,0.15), rgba(0,255,179,0.05));
          padding: 40px 32px;
        }
        .success-check {
          width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px;
          background: rgba(24,166,109,0.2);
          border: 2px solid rgba(74,232,155,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; color: #4AE89B;
          box-shadow: 0 0 32px rgba(74,232,155,0.3);
          animation: checkPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-title { font-size: 24px; font-weight: 800; color: #4AE89B; margin-bottom: 8px; }
        .success-sub { font-size: 14px; color: rgba(232,245,240,0.5); }
        .success-body { padding: 28px 32px; }
        .success-text { font-size: 14px; color: rgba(232,245,240,0.6); line-height: 1.7; margin-bottom: 24px; }
        .success-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; text-align: left; }
        .success-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(232,245,240,0.8); }
        .s-check {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(24,166,109,0.15);
          border: 1px solid rgba(74,232,155,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #4AE89B;
        }
        .back-btn {
          display: block; width: 100%;
          padding: 13px; border-radius: 12px;
          background: rgba(24,166,109,0.08);
          border: 1px solid rgba(24,166,109,0.2);
          color: #4AE89B; font-size: 14px; font-weight: 600;
          cursor: pointer; text-align: center;
          text-decoration: none; transition: all 0.2s;
        }
        .back-btn:hover {
          background: rgba(24,166,109,0.15);
          border-color: rgba(74,232,155,0.4);
        }

        /* fade-in on mount */
        .fade-in {
          opacity: 0; transform: translateY(24px);
          animation: fadeUp 0.7s ease forwards;
        }
        .fade-in-delay {
          opacity: 0; transform: translateY(24px);
          animation: fadeUp 0.7s ease 0.2s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="lead-root">
        {/* Particle canvas */}
        <div className="canvas-wrap">
          <ParticleCanvas />
        </div>

        {/* Nav */}
        <nav className="lead-nav">
          <a href="/" className="lead-logo">
            <span className="green">Termin</span>
            <span className="white">Stop</span>
          </a>
          <a href="/" className="lead-back">← Zurück</a>
        </nav>

        {/* Body */}
        <div className="lead-body">

          {/* ── LEFT ── */}
          <div className="fade-in">
            <div className="lead-badge">
              <span className="badge-dot" />
              Kostenlos &amp; unverbindlich
            </div>

            <h1 className="lead-h1">
              Kostenlose Beratung<br />
              <span className="shimmer">in 15 Minuten</span>
            </h1>

            <p className="lead-sub">
              Wir zeigen Ihnen, wie TerminStop in Ihrem Betrieb funktioniert –
              und was es konkret für Sie bedeutet.
            </p>

            <div className="features">
              {[
                { icon: "📞", title: "Persönliches Gespräch", desc: "Kein anonymer Support – Sie sprechen direkt mit uns." },
                { icon: "⚡", title: "Schnelle Einrichtung", desc: "Wir zeigen Ihnen, wie das System in unter 10 Minuten läuft." },
                { icon: "💡", title: "Konkrete Einschätzung", desc: "Sie erfahren, wie viel Sie monatlich durch TerminStop sparen können." },
              ].map((item, i) => (
                <div key={i} className="feat-item">
                  <div className="feat-icon">{item.icon}</div>
                  <div>
                    <div className="feat-title">{item.title}</div>
                    <div className="feat-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="kpis">
              {[
                { value: "50+", label: "Betriebe aktiv" },
                { value: "95%", label: "Weniger Ausfälle" },
                { value: "Ø 8 Min.", label: "Einrichtung" },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="kpi-val">{kpi.value}</div>
                  <div className="kpi-lbl">{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="fade-in-delay">
            {!success ? (
              <div className="form-card">
                <div className="card-header">
                  <div className="card-title">Anfrage senden</div>
                  <div className="card-sub">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</div>
                </div>

                <div className="form-inner">
                  {formError && (
                    <div className="form-error">
                      <span>⚠</span> {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label>Name</label>
                      <input
                        placeholder="Max Mustermann"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="two-col">
                      <div className="field">
                        <label>Telefon</label>
                        <input
                          placeholder="+49 170..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="field">
                        <label>E-Mail</label>
                        <input
                          type="email"
                          placeholder="firma@..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label>Unternehmen <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(232,245,240,0.25)" }}>(optional)</span></label>
                      <input
                        placeholder="z. B. Autohaus Müller GmbH"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label>Nachricht <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(232,245,240,0.25)" }}>(optional)</span></label>
                      <textarea
                        rows={3}
                        placeholder="Kurze Info zu Ihrem Betrieb oder Anliegen..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? (
                        <><span className="spin" />Wird gesendet...</>
                      ) : (
                        "Kostenlose Beratung anfragen →"
                      )}
                    </button>

                    <div className="micro-trust">
                      <span>✓ Kein Vertrag</span>
                      <span>✓ Kostenlos</span>
                      <span>✓ Unverbindlich</span>
                    </div>
                  </form>
                </div>
              </div>

            ) : (
              <div className="success-card">
                <div className="success-top">
                  <div className="success-check">✓</div>
                  <div className="success-title">Anfrage gesendet!</div>
                  <div className="success-sub">Wir haben Ihre Anfrage erhalten.</div>
                </div>
                <div className="success-body">
                  <p className="success-text">
                    Wir melden uns <strong style={{ color: "#E8F5F0" }}>innerhalb von 24 Stunden</strong> persönlich
                    bei Ihnen – per Telefon oder E-Mail, ganz wie es Ihnen passt.
                  </p>
                  <div className="success-list">
                    {[
                      "Persönliches Beratungsgespräch",
                      "Konkrete Einschätzung für Ihren Betrieb",
                      "Einrichtung in unter 10 Minuten",
                    ].map((item, i) => (
                      <div key={i} className="success-item">
                        <div className="s-check">✓</div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <a href="/" className="back-btn">← Zurück zur Startseite</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
