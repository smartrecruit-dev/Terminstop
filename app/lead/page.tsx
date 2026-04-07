"use client"

import { useState } from "react"

/* ─── Main Page ─────────────────────────────────────────────── */
export default function LeadPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState("")

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    setFormError("")

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, company, message }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || "Beim Senden ist ein Fehler aufgetreten. Bitte erneut versuchen.")
      } else {
        setSuccess(true)
        setName(""); setPhone(""); setEmail(""); setCompany(""); setMessage("")
      }
    } catch {
      setFormError("Netzwerkfehler. Bitte Internetverbindung prüfen und erneut versuchen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #FFFFFF;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .lead-root {
          min-height: 100vh;
          background: #FFFFFF;
          color: #0B0D14;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif;
        }

        /* ── Nav ── */
        .lead-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 40px; height: 52px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        @media (max-width: 640px) { .lead-nav { padding: 0 20px; } }

        .lead-logo {
          font-size: 17px; font-weight: 800;
          letter-spacing: -0.5px; text-decoration: none;
        }
        .lead-logo .g { color: #18A66D; }
        .lead-logo .d { color: #0B0D14; }

        .lead-back {
          font-size: 13px; color: #6B7280;
          text-decoration: none; transition: color 0.15s;
          display: flex; align-items: center; gap: 4px;
        }
        .lead-back:hover { color: #0B0D14; }

        /* ── Layout ── */
        .lead-body {
          max-width: 1060px; margin: 0 auto;
          padding: 72px 24px 100px;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 72px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .lead-body { grid-template-columns: 1fr; gap: 52px; }
        }
        @media (max-width: 640px) {
          .lead-body { padding: 48px 20px 72px; }
        }

        /* ── Left column ── */
        .lead-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F0FBF5;
          border: 1px solid rgba(24,166,109,0.22);
          color: #149A60; font-size: 11.5px; font-weight: 600;
          padding: 5px 13px; border-radius: 100px; margin-bottom: 32px;
          letter-spacing: 0.2px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #18A66D;
          animation: pulseDot 2.5s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.65); }
        }

        .lead-h1 {
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -1.5px; margin-bottom: 20px;
          color: #0B0D14;
        }
        .lead-h1 .accent { color: #18A66D; }

        .lead-sub {
          font-size: 16px; color: #6B7280;
          line-height: 1.72; margin-bottom: 48px;
          max-width: 400px; font-weight: 400;
        }

        /* Feature list */
        .features { display: flex; flex-direction: column; gap: 24px; margin-bottom: 52px; }
        .feat-item { display: flex; align-items: flex-start; gap: 16px; }

        .feat-icon-wrap {
          width: 42px; height: 42px; flex-shrink: 0;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .feat-item:hover .feat-icon-wrap {
          border-color: rgba(24,166,109,0.4);
          box-shadow: 0 0 0 3px rgba(24,166,109,0.07);
        }
        .feat-icon-svg {
          width: 18px; height: 18px;
          color: #18A66D;
        }

        .feat-title { font-size: 14px; font-weight: 700; color: #0B0D14; margin-bottom: 3px; }
        .feat-desc { font-size: 13px; color: #6B7280; line-height: 1.6; }

        /* KPIs */
        .kpis {
          display: flex; gap: 40px; flex-wrap: wrap;
          padding-top: 32px;
          border-top: 1px solid #F0F0F0;
        }
        .kpi-val {
          font-size: 26px; font-weight: 900; color: #18A66D;
          letter-spacing: -0.5px; line-height: 1;
        }
        .kpi-lbl { font-size: 11.5px; color: #9CA3AF; margin-top: 5px; font-weight: 500; }

        /* ── Right column: Form card ── */
        .form-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02);
          overflow: hidden;
        }

        .form-card-accent {
          height: 3px;
          background: linear-gradient(90deg, #18A66D, #4AE89B);
        }

        .card-header {
          padding: 22px 26px 18px;
          border-bottom: 1px solid #F3F4F6;
        }
        .card-title { font-size: 16px; font-weight: 700; color: #0B0D14; letter-spacing: -0.2px; }
        .card-sub { font-size: 12px; color: #9CA3AF; margin-top: 4px; font-weight: 400; }

        .form-inner { padding: 22px 26px 26px; }

        .field { margin-bottom: 15px; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #6B7280; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 7px;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 9px;
          padding: 11px 14px;
          font-size: 14px; color: #0B0D14;
          font-family: inherit;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          -webkit-appearance: none;
        }
        .field input::placeholder,
        .field textarea::placeholder { color: #C4CAD4; }
        .field input:focus,
        .field textarea:focus {
          border-color: #18A66D;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(24,166,109,0.1);
        }
        .field textarea { resize: none; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 400px) { .two-col { grid-template-columns: 1fr; } }

        .submit-btn {
          width: 100%; margin-top: 6px;
          padding: 14px 20px; border-radius: 9px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; outline: none;
          background: #18A66D;
          color: white;
          transition: background 0.18s, box-shadow 0.18s;
          box-shadow: 0 1px 3px rgba(24,166,109,0.3), 0 4px 12px rgba(24,166,109,0.2);
          letter-spacing: 0.1px;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) {
          background: #149A60;
          box-shadow: 0 1px 3px rgba(24,166,109,0.4), 0 6px 18px rgba(24,166,109,0.28);
        }
        .submit-btn:active:not(:disabled) { background: #128A55; box-shadow: none; }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; background: #9CA3AF; box-shadow: none; }

        .spin {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          vertical-align: middle; margin-right: 7px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .micro-trust {
          display: flex; justify-content: center; gap: 18px;
          margin-top: 13px;
          font-size: 11px; color: #9CA3AF; font-weight: 500;
        }

        .form-error {
          display: flex; gap: 10px; align-items: center;
          background: #FFF5F5;
          border: 1px solid #FECACA;
          border-radius: 9px; padding: 10px 14px;
          font-size: 13px; color: #EF4444; margin-bottom: 15px;
        }

        /* ── Success ── */
        .success-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          overflow: hidden;
          text-align: center;
        }
        .success-top {
          background: #F9FAFB;
          padding: 48px 32px 40px;
          border-bottom: 1px solid #F0F0F0;
        }
        .success-check {
          width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 20px;
          background: #18A66D;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(24,166,109,0.28);
          animation: checkPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-title {
          font-size: 22px; font-weight: 800; color: #0B0D14;
          letter-spacing: -0.5px; margin-bottom: 8px;
        }
        .success-sub { font-size: 14px; color: #6B7280; }
        .success-body { padding: 28px 32px 32px; }
        .success-text {
          font-size: 14px; color: #6B7280; line-height: 1.72;
          margin-bottom: 24px;
        }
        .success-list {
          display: flex; flex-direction: column; gap: 12px;
          margin-bottom: 28px; text-align: left;
        }
        .success-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: #374151;
        }
        .s-check {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: #F0FBF5;
          border: 1px solid rgba(24,166,109,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .back-btn {
          display: block; width: 100%;
          padding: 13px; border-radius: 9px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          color: #374151; font-size: 14px; font-weight: 600;
          cursor: pointer; text-align: center;
          text-decoration: none; transition: all 0.15s;
          font-family: inherit;
        }
        .back-btn:hover { background: #F0FBF5; border-color: rgba(24,166,109,0.3); color: #18A66D; }

        /* Footer */
        .lead-footer {
          border-top: 1px solid #F3F4F6;
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        .lead-footer span { font-size: 12px; color: #D1D5DB; }
        .lead-footer a { font-size: 12px; color: #D1D5DB; text-decoration: none; transition: color 0.15s; }
        .lead-footer a:hover { color: #9CA3AF; }
      `}</style>

      <div className="lead-root">

        {/* Nav */}
        <nav className="lead-nav">
          <a href="/" className="lead-logo">
            <span className="g">Termin</span>
            <span className="d">Stop</span>
          </a>
          <a href="/" className="lead-back">← Zurück</a>
        </nav>

        {/* Body */}
        <div className="lead-body">

          {/* ── LEFT ── */}
          <div>
            <div className="lead-badge">
              <span className="badge-dot" />
              Kostenlos &amp; unverbindlich
            </div>

            <h1 className="lead-h1">
              Kostenlose Beratung<br />
              <span className="accent">in 15 Minuten.</span>
            </h1>

            <p className="lead-sub">
              Wir zeigen Ihnen, wie TerminStop in Ihrem Betrieb funktioniert —
              und was es konkret für Sie bedeutet.
            </p>

            <div className="features">
              {[
                {
                  icon: (
                    <svg className="feat-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                  title: "Persönliches Gespräch",
                  desc: "Kein anonymer Support – Sie sprechen direkt mit uns.",
                },
                {
                  icon: (
                    <svg className="feat-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                  title: "Schnelle Einrichtung",
                  desc: "Wir zeigen Ihnen, wie das System in unter 10 Minuten läuft.",
                },
                {
                  icon: (
                    <svg className="feat-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  ),
                  title: "Konkrete Einschätzung",
                  desc: "Sie erfahren, wie viel Sie monatlich durch TerminStop sparen können.",
                },
              ].map((item, i) => (
                <div key={i} className="feat-item">
                  <div className="feat-icon-wrap">{item.icon}</div>
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
          <div>
            {!success ? (
              <div className="form-card">
                <div className="form-card-accent" />
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
                      <label>
                        Unternehmen{" "}
                        <span style={{ textTransform: "none", fontWeight: 400, color: "#C4CAD4" }}>(optional)</span>
                      </label>
                      <input
                        placeholder="z. B. Autohaus Müller GmbH"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label>
                        Nachricht{" "}
                        <span style={{ textTransform: "none", fontWeight: 400, color: "#C4CAD4" }}>(optional)</span>
                      </label>
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
                  <div className="success-check">
                    <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="success-title">Anfrage gesendet!</div>
                  <div className="success-sub">Wir haben Ihre Anfrage erhalten.</div>
                </div>
                <div className="success-body">
                  <p className="success-text">
                    Wir melden uns <strong style={{ color: "#0B0D14", fontWeight: 700 }}>innerhalb von 24 Stunden</strong> persönlich
                    bei Ihnen – per Telefon oder E-Mail, ganz wie es Ihnen passt.
                  </p>
                  <div className="success-list">
                    {[
                      "Persönliches Beratungsgespräch",
                      "Konkrete Einschätzung für Ihren Betrieb",
                      "Einrichtung in unter 10 Minuten",
                    ].map((item, i) => (
                      <div key={i} className="success-item">
                        <div className="s-check">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#18A66D" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
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

        {/* Footer */}
        <footer className="lead-footer">
          <span>© {new Date().getFullYear()} TerminStop</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Datenschutz", "/datenschutz"], ["AGB", "/agb"], ["Impressum", "/impressum"]].map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>
        </footer>

      </div>
    </>
  )
}
