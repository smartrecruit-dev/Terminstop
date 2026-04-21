"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"


const C = {
  green:      "#18A66D",
  greenHover: "#149A63",
  greenDeep:  "#0F8A57",
  greenInk:   "#0A6B43",
  greenSoft:  "#F0FBF6",
  greenBorder:"#D1F5E3",
  greenGlow:  "rgba(24,166,109,0.18)",
  ink:        "#0A0F1A",
  text:       "#0F1B2D",
  text2:      "#384559",
  muted:      "#5B6779",
  muted2:     "#8A95A6",
  bg:         "#FFFFFF",
  bg2:        "#FAFBFC",
  bg3:        "#F4F6F9",
  border:     "#E8ECF1",
}
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif"
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

// Slugify: converts any string to valid slug
function slugify(val: string) {
  return val
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

type SlugState = "idle" | "checking" | "available" | "taken" | "invalid"

export default function RegisterPage() {
  const router = useRouter()

  // Registration gate
  if (process.env.NEXT_PUBLIC_REGISTRATION_OPEN !== "true") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F9", fontFamily: FONT, padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 12 }}>Bald verfügbar</h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: 28 }}>
            Wir arbeiten noch an ein paar letzten Details.<br />Die Registrierung öffnet in Kürze.
          </p>
          <a href="/" style={{ display: "inline-block", padding: "12px 28px", background: C.green, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Zurück zur Startseite →
          </a>
        </div>
      </div>
    )
  }

  const [companyName, setCompanyName] = useState("")
  const [email,       setEmail]       = useState("")
  const [password,    setPassword]    = useState("")
  const [slug,        setSlug]        = useState("")
  const [slugManual,  setSlugManual]  = useState(false) // user edited slug manually
  const [slugState,   setSlugState]   = useState<SlugState>("idle")
  const [slugMsg,     setSlugMsg]     = useState("")
  const [showPw,      setShowPw]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState("")
  const [step,        setStep]        = useState<"form" | "success">("form")

  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-generate slug from company name unless user edited it manually
  useEffect(() => {
    if (!slugManual && companyName) {
      setSlug(slugify(companyName))
    }
  }, [companyName, slugManual])

  // Check slug availability with debounce
  const checkSlug = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setSlugState("idle")
      setSlugMsg("")
      return
    }
    setSlugState("checking")
    try {
      const res = await fetch(`/api/check-slug?slug=${encodeURIComponent(value)}`)
      const json = await res.json()
      if (json.error) {
        setSlugState("invalid")
        setSlugMsg(json.error)
      } else if (json.available) {
        setSlugState("available")
        setSlugMsg("Verfügbar ✓")
      } else {
        setSlugState("taken")
        setSlugMsg("Bereits vergeben — wähle einen anderen")
      }
    } catch {
      setSlugState("idle")
    }
  }, [])

  useEffect(() => {
    if (slugTimer.current) clearTimeout(slugTimer.current)
    slugTimer.current = setTimeout(() => checkSlug(slug), 480)
    return () => { if (slugTimer.current) clearTimeout(slugTimer.current) }
  }, [slug, checkSlug])

  // Password strength
  const pwStrength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3
  const pwColors = ["", "#EF4444", "#F59E0B", "#3B82F6", C.green]
  const pwLabels = ["", "Zu kurz", "Schwach", "Gut", "Stark"]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (slugState === "taken" || slugState === "invalid") {
      setError("Bitte wähle einen gültigen und verfügbaren Buchungslink.")
      return
    }
    if (slugState === "checking") {
      setError("Bitte warte, bis die Verfügbarkeit geprüft wurde.")
      return
    }
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.")
      return
    }

    setLoading(true)
    try {
      // 1. Create account via API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, password, slug }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Registrierung fehlgeschlagen.")
        setLoading(false)
        return
      }

      // 2. Sign in automatically
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (signInError || !authData?.session) {
        // Account created but auto-login failed → send to login
        router.push("/login?registered=1")
        return
      }

      // 3. Load company and redirect
      const compRes = await fetch("/api/auth/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: authData.session.access_token }),
      })
      const compJson = await compRes.json()

      if (compJson.company) {
        localStorage.setItem("company_id", compJson.company.id)
        localStorage.setItem("company_name", compJson.company.name)
      }

      // Mark as new user → show onboarding flow
      localStorage.setItem("is_new_user", "1")
      localStorage.setItem("onboarding_pending", "1")
      router.push("/onboarding")
    } catch (e: any) {
      setError("Ein Fehler ist aufgetreten. Bitte erneut versuchen.")
      setLoading(false)
    }
  }

  const inp = {
    width: "100%" as const,
    background: C.bg2,
    border: `1.5px solid ${C.border}`,
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 15,
    color: C.text,
    fontFamily: "inherit",
    outline: "none",
    transition: `border-color 180ms, box-shadow 180ms`,
    boxSizing: "border-box" as const,
  }

  const slugBorderColor =
    slugState === "available" ? C.green :
    slugState === "taken" || slugState === "invalid" ? "#EF4444" :
    C.border

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg3}; font-family: ${FONT}; }

        .inp:focus { border-color: ${C.green} !important; box-shadow: 0 0 0 3px rgba(24,166,109,0.12) !important; }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 15px 24px; border-radius: 12px;
          background: ${C.green}; color: #fff; border: none;
          font-family: inherit; font-size: 16px; font-weight: 700; cursor: pointer;
          transition: background 200ms, transform 180ms, box-shadow 200ms;
          box-shadow: 0 6px 20px -4px ${C.greenGlow};
          letter-spacing: -0.1px;
        }
        .btn-primary:hover:not(:disabled) {
          background: ${C.greenHover};
          transform: translateY(-1px);
          box-shadow: 0 10px 28px -6px ${C.greenGlow};
        }
        .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ${EASE} both; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s ${EASE} both; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "stretch" }}>

        {/* ── Left Panel: Form ── */}
        <div style={{
          flex: "1 1 520px", maxWidth: 600, padding: "48px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          background: C.bg,
          borderRight: `1px solid ${C.border}`,
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenDeep})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 14px -2px ${C.greenGlow}`,
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: "-0.5px" }}>T</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>
              Termin<span style={{ color: C.green }}>Stop</span>
            </span>
          </a>

          {step === "success" ? (
            <div className="fade-up" style={{ textAlign: "center", padding: "24px 0" }}>
              <div className="check-pop" style={{
                width: 72, height: 72, background: C.greenSoft,
                border: `2px solid ${C.greenBorder}`, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px", fontSize: 32,
              }}>✓</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: C.ink, letterSpacing: "-1px", margin: "0 0 12px" }}>
                Willkommen bei TerminStop!
              </h2>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                Dein Account ist fertig. Du wirst weitergeleitet…
              </p>
            </div>
          ) : (
            <div className="fade-up">
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: C.greenSoft, border: `1px solid ${C.greenBorder}`,
                  color: C.greenInk, fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
                  padding: "5px 12px", borderRadius: 980, marginBottom: 16,
                }}>
                  <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%" }} />
                  14 Tage kostenlos — ohne Kreditkarte
                </div>
                <h1 style={{
                  fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900,
                  color: C.ink, letterSpacing: "-1.5px", lineHeight: 1.05,
                  margin: "0 0 10px",
                }}>
                  Betrieb registrieren.
                </h1>
                <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  In 2 Minuten eingerichtet. Kein Vertrag, monatlich kündbar.
                </p>
              </div>

              {error && (
                <div style={{
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: 10, padding: "12px 16px",
                  fontSize: 14, color: "#DC2626", marginBottom: 20,
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Company Name */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7, letterSpacing: "-0.1px" }}>
                    Betriebsname
                  </label>
                  <input
                    className="inp"
                    style={inp}
                    type="text"
                    placeholder="z.B. Friseur Müller"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required
                    autoFocus
                    maxLength={100}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
                    Buchungslink
                    <span style={{ fontWeight: 400, color: C.muted2, marginLeft: 6 }}>(Deine persönliche URL)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 13, color: C.muted2, fontWeight: 500, userSelect: "none",
                      pointerEvents: "none", whiteSpace: "nowrap",
                    }}>
                      terminstop.de/book/
                    </div>
                    <input
                      className="inp"
                      style={{
                        ...inp,
                        paddingLeft: 158,
                        borderColor: slugBorderColor,
                        fontFamily: "ui-monospace, SF Mono, Menlo, monospace",
                        fontSize: 14,
                      }}
                      type="text"
                      placeholder="mein-betrieb"
                      value={slug}
                      onChange={e => {
                        setSlugManual(true)
                        setSlug(slugify(e.target.value))
                      }}
                      required
                      maxLength={40}
                      spellCheck={false}
                      autoComplete="off"
                    />
                    {/* Status indicator */}
                    {slug.length >= 3 && (
                      <div style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        fontSize: 12, fontWeight: 700,
                        color: slugState === "available" ? C.green : slugState === "checking" ? C.muted2 : "#EF4444",
                      }}>
                        {slugState === "checking" ? "…" : slugMsg}
                      </div>
                    )}
                  </div>
                  {slug && (
                    <div style={{ fontSize: 12, color: C.muted2, marginTop: 6 }}>
                      Kunden buchen unter:{" "}
                      <span style={{ color: C.green, fontWeight: 600 }}>
                        terminstop.de/book/{slug || "dein-betrieb"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
                    E-Mail-Adresse
                  </label>
                  <input
                    className="inp"
                    style={inp}
                    type="email"
                    placeholder="du@betrieb.de"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
                    Passwort
                    <span style={{ fontWeight: 400, color: C.muted2, marginLeft: 6 }}>mind. 8 Zeichen</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="inp"
                      style={{ ...inp, paddingRight: 52 }}
                      type={showPw ? "text" : "password"}
                      placeholder="Sicheres Passwort"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 18, color: C.muted2, padding: 4,
                      }}
                      aria-label={showPw ? "Passwort verstecken" : "Passwort anzeigen"}
                    >
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 4, borderRadius: 2,
                            background: i <= pwStrength ? pwColors[pwStrength] : C.border,
                            transition: "background 300ms",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: pwColors[pwStrength], fontWeight: 600 }}>
                        {pwLabels[pwStrength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || slugState === "taken" || slugState === "checking" || slugState === "invalid"}
                  style={{ marginTop: 6 }}
                >
                  {loading ? (
                    <><div className="spinner" /> Wird eingerichtet…</>
                  ) : (
                    <>Jetzt kostenlos starten →</>
                  )}
                </button>

                {/* Trust signals */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", paddingTop: 4 }}>
                  {["✓ 14 Tage gratis", "✓ Kein Vertrag", "✓ Monatlich kündbar"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: C.muted2, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </form>

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                <span style={{ fontSize: 14, color: C.muted2 }}>Bereits Kunde?{" "}
                  <a href="/login" style={{ color: C.green, fontWeight: 700, textDecoration: "none" }}>
                    Einloggen →
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Panel: Value props ── */}
        <div style={{
          flex: "1 1 400px",
          background: `linear-gradient(160deg, ${C.greenDeep} 0%, ${C.greenInk} 100%)`,
          padding: "48px 56px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}
          className="hide-mobile-panel"
        >
          {/* Deco circles */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 20,
            }}>
              Was du bekommst
            </div>
            <h2 style={{
              fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 900,
              color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.05,
              margin: "0 0 40px",
            }}>
              Dein digitales<br />Terminbüro.
            </h2>

            {/* Feature list */}
            {[
              { icon: "📅", title: "Eigene Buchungsseite", desc: "Kunden buchen rund um die Uhr — du schläfst, das System arbeitet." },
              { icon: "✉️", title: "Automatische SMS", desc: "Erinnerungen gehen 24h vorher raus. Nie wieder hinterhertelefonieren." },
              { icon: "👥", title: "Kundenkartei", desc: "Alle Kunden an einem Ort. Verlauf, Notizen, Nummern." },
              { icon: "📊", title: "Auswertungen", desc: "Sieh genau, wie dein Betrieb läuft — Zahlen statt Bauchgefühl." },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                marginBottom: i < 3 ? 24 : 0,
                animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${100 + i * 80}ms both`,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}

            {/* Social proof */}
            <div style={{
              marginTop: 40, padding: "20px 22px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
            }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontStyle: "italic", marginBottom: 12 }}>
                „Seit TerminStop habe ich 3 Stunden pro Woche weniger Aufwand. Das System läuft einfach."
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                }}>S</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Sandra K.</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Friseurstudio · Hamburg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hide-mobile-panel { display: none !important; }
        }
      `}</style>
    </>
  )
}
