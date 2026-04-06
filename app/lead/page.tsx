"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

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
        body { background: #F5F7FC; }

        .lead-root {
          min-height: 100vh;
          background: #F5F7FC;
          color: #0B0D14;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* subtle grid texture */
        .lead-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none; z-index: 0;
        }

        /* nav */
        .lead-nav {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 40px; height: 64px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(16px);
        }
        @media (max-width: 640px) { .lead-nav { padding: 0 20px; } }

        .lead-logo { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
        .lead-logo .green { color: #18A66D; }
        .lead-logo .dark { color: #0B0D14; }

        .lead-back {
          font-size: 13px; color: #6B7280;
          text-decoration: none; transition: color 0.2s;
          display: flex; align-items: center; gap: 4px;
        }
        .lead-back:hover { color: #0B0D14; }

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
          background: #F0FBF5;
          border: 1px solid rgba(24,166,109,0.25);
          color: #149A60; font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 28px;
          letter-spacing: 0.3px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #18A66D;
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .lead-h1 {
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 900; line-height: 1.1;
          letter-spacing: -1.5px; margin-bottom: 18px;
          color: #0B0D14;
        }
        .lead-h1 .accent { color: #18A66D; }

        .lead-sub {
          font-size: 16px; color: #6B7280;
          line-height: 1.7; margin-bottom: 44px;
          max-width: 420px;
        }

        /* feature items */
        .features { display: flex; flex-direction: column; gap: 22px; margin-bottom: 48px; }
        .feat-item { display: flex; align-items: flex-start; gap: 16px; }
        .feat-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: all 0.2s;
        }
        .feat-item:hover .feat-icon {
          border-color: rgba(24,166,109,0.3);
          box-shadow: 0 0 0 3px rgba(24,166,109,0.08);
        }
        .feat-title { font-size: 14px; font-weight: 700; color: #0B0D14; margin-bottom: 3px; }
        .feat-desc { font-size: 13px; color: #6B7280; line-height: 1.55; }

        /* kpis */
        .kpis {
          display: flex; gap: 36px; flex-wrap: wrap;
          padding-top: 28px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .kpi-val {
          font-size: 24px; font-weight: 900; color: #18A66D;
          letter-spacing: -0.5px;
        }
        .kpi-lbl { font-size: 12px; color: #9CA3AF; margin-top: 2px; }

        /* ── RIGHT: Card ── */
        .form-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05);
        }

        /* green top accent line */
        .form-card-top {
          height: 3px;
          background: #18A66D;
        }

        .card-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .card-title { font-size: 17px; font-weight: 700; color: #0B0D14; }
        .card-sub { font-size: 12px; color: #9CA3AF; margin-top: 4px; }

        .form-inner { padding: 24px 28px 28px; }

        .field { margin-bottom: 16px; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #6B7280; letter-spacing: 0.6px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: #F9FAFB;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px; color: #0B0D14;
          font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.18s;
        }
        .field input::placeholder,
        .field textarea::placeholder { color: #C4C9D4; }
        .field input:focus,
        .field textarea:focus {
          border-color: #18A66D;
          background: white;
          box-shadow: 0 0 0 3px rgba(24,166,109,0.1);
        }
        .field textarea { resize: none; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .submit-btn {
          width: 100%; margin-top: 8px;
          padding: 15px; border-radius: 10px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; outline: none;
          background: #18A66D;
          color: white;
          transition: background 0.2s, box-shadow 0.2s, transform 0.12s;
          box-shadow: 0 4px 16px rgba(24,166,109,0.25);
          letter-spacing: 0.2px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #149A60;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(24,166,109,0.32);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #6B7280; box-shadow: none; }

        .spin {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 6px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .micro-trust {
          display: flex; justify-content: center; gap: 20px;
          margin-top: 14px;
          font-size: 11px; color: #9CA3AF;
        }

        /* error */
        .form-error {
          display: flex; gap: 10px; align-items: center;
          background: #FFF5F5;
          border: 1px solid #FCA5A5;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #EF4444; margin-bottom: 16px;
        }

        /* ── SUCCESS ── */
        .success-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          text-align: center;
        }
        .success-top {
          background: linear-gradient(135deg, #F0FBF5, #E8F8F0);
          padding: 44px 32px;
          border-bottom: 1px solid rgba(24,166,109,0.12);
        }
        .success-check {
          width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 18px;
          background: #18A66D;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; color: white;
          box-shadow: 0 8px 24px rgba(24,166,109,0.3);
          animation: checkPop 0.45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-title { font-size: 22px; font-weight: 800; color: #0B0D14; margin-bottom: 8px; }
        .success-sub { font-size: 14px; color: #6B7280; }
        .success-body { padding: 28px 32px; }
        .success-text { font-size: 14px; color: #6B7280; line-height: 1.7; margin-bottom: 24px; }
        .success-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; text-align: left; }
        .success-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; }
        .s-check {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: #F0FBF5;
          border: 1px solid rgba(24,166,109,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #18A66D;
        }
        .back-btn {
          display: block; width: 100%;
          padding: 13px; border-radius: 10px;
          background: #F9FAFB;
          border: 1px solid rgba(0,0,0,0.1);
          color: #374151; font-size: 14px; font-weight: 600;
          cursor: pointer; text-align: center;
          text-decoration: none; transition: all 0.18s;
        }
        .back-btn:hover { background: #F0FBF5; border-color: rgba(24,166,109,0.3); color: #18A66D; }

        /* fade-in on mount */
        .fade-in {
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
        }
        .fade-in-delay {
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.6s ease 0.15s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="lead-root">

        {/* Nav */}
        <nav className="lead-nav">
          <a href="/" className="lead-logo">
            <span className="green">Termin</span>
            <span className="dark">Stop</span>
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
              <span className="accent">in 15 Minuten.</span>
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
                <div className="form-card-top" />
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
                      <label>Unternehmen <span style={{ textTransform: "none", fontWeight: 400, color: "#C4C9D4" }}>(optional)</span></label>
                      <input
                        placeholder="z. B. Autohaus Müller GmbH"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label>Nachricht <span style={{ textTransform: "none", fontWeight: 400, color: "#C4C9D4" }}>(optional)</span></label>
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
                    Wir melden uns <strong style={{ color: "#0B0D14" }}>innerhalb von 24 Stunden</strong> persönlich
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
