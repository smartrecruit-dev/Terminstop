"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

const G = "#18A66D"
const GD = "#0F8A57"
const GI = "#0A6B43"
const GL = "#F0FBF6"
const GB = "#D1F5E3"
const T = "#0F1B2D"
const M = "#5B6779"
const BD = "#E8ECF1"
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"

const STEPS = [
  { id: 1, title: "Willkommen 👋",        sub: "Lass uns deinen Betrieb einrichten" },
  { id: 2, title: "Erste Leistung",        sub: "Was bietest du an?" },
  { id: 3, title: "Buchungsseite",         sub: "Dein Link für Kunden" },
  { id: 4, title: "Fertig! 🎉",            sub: "Alles bereit" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]           = useState(1)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)

  // Step 1
  const [companyName, setCompanyName] = useState("")
  const [phone, setPhone]             = useState("")

  // Step 2
  const [services, setServices] = useState([
    { name: "", duration: "30", price: "" },
  ])

  // Step 3
  const [slug, setSlug]           = useState("")
  const [slugSaved, setSlugSaved] = useState(false)

  useEffect(() => {
    document.title = "Einrichtung | TerminStop"
    const id   = localStorage.getItem("company_id")
    const name = localStorage.getItem("company_name")
    if (!id) { router.push("/login"); return }
    setCompanyId(id)
    setCompanyName(name || "")

    // Load existing slug
    supabase.from("companies").select("slug, phone").eq("id", id).single().then(({ data }) => {
      if (data?.slug) setSlug(data.slug)
      if (data?.phone) setPhone(data.phone)
    })
  }, [])

  // ── Step 1: Save company info ─────────────────────────────────────────────
  async function saveStep1() {
    if (!companyId || !companyName.trim()) return
    setLoading(true)
    await supabase.from("companies").update({
      name:  companyName.trim(),
      phone: phone.trim() || null,
    }).eq("id", companyId)
    localStorage.setItem("company_name", companyName.trim())
    setLoading(false)
    setStep(2)
  }

  // ── Step 2: Save services ─────────────────────────────────────────────────
  async function saveStep2() {
    if (!companyId) return
    const valid = services.filter(s => s.name.trim())
    if (valid.length === 0) { setStep(3); return }
    setLoading(true)
    const rows = valid.map(s => ({
      company_id: companyId,
      name:       s.name.trim(),
      duration:   parseInt(s.duration) || 30,
      price:      s.price ? parseFloat(s.price.replace(",", ".")) : null,
    }))
    await supabase.from("services").insert(rows)
    setLoading(false)
    setStep(3)
  }

  // ── Step 3: Save slug ─────────────────────────────────────────────────────
  async function saveStep3() {
    if (!companyId) return
    setLoading(true)
    if (slug.trim()) {
      await supabase.from("companies").update({ slug: slug.trim() }).eq("id", companyId)
      setSlugSaved(true)
    }
    setLoading(false)
    setStep(4)
  }

  // ── Finish ────────────────────────────────────────────────────────────────
  function finish() {
    localStorage.removeItem("onboarding_pending")
    router.push("/dashboard")
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "#F9FAFB", border: `1.5px solid ${BD}`,
    borderRadius: 12, padding: "13px 15px", fontSize: 15, color: T,
    fontFamily: FONT, outline: "none", boxSizing: "border-box",
    transition: "border .15s",
  }

  const btn = (disabled = false): React.CSSProperties => ({
    padding: "14px 28px", borderRadius: 12, border: "none",
    cursor: disabled ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700,
    background: disabled ? "#E5E7EB" : `linear-gradient(135deg, ${G} 0%, ${GD} 100%)`,
    color: disabled ? M : "#fff", transition: "all .2s",
    boxShadow: disabled ? "none" : "0 4px 16px -4px rgba(10,107,67,0.35)",
  })

  return (
    <div style={{ minHeight: "100dvh", background: "#F4F6F9", fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 80px" }}>

      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: T, letterSpacing: "-.5px" }}>
          Termin<span style={{ color: G }}>Stop</span>
        </span>
      </a>

      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 520, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800,
                background: step > s.id ? G : step === s.id ? GD : "#E5E7EB",
                color: step >= s.id ? "#fff" : M,
                transition: "all .3s",
                boxShadow: step === s.id ? `0 0 0 4px ${GL}` : "none",
              }}>
                {step > s.id ? "✓" : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step > s.id ? G : BD, transition: "background .3s", margin: "0 4px" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {STEPS.map(s => (
            <div key={s.id} style={{ fontSize: 11, color: step === s.id ? G : M, fontWeight: step === s.id ? 700 : 400, width: 80, textAlign: s.id === 1 ? "left" : s.id === 4 ? "right" : "center" }}>
              {s.title}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 520, background: "#fff", borderRadius: 24, padding: "36px 36px", boxShadow: "0 4px 32px -8px rgba(15,27,45,0.10)", border: `1px solid ${BD}` }}>

        {/* ── Step 1: Betrieb ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>👋</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 6px" }}>Willkommen bei TerminStop!</h1>
            <p style={{ fontSize: 15, color: M, margin: "0 0 28px", lineHeight: 1.6 }}>
              Lass uns in 4 Schritten deinen Betrieb einrichten. Das dauert nur 2 Minuten.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                  Betriebsname *
                </label>
                <input
                  style={inp}
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="z.B. Friseursalon Müller"
                  onFocus={e => (e.target.style.borderColor = G)}
                  onBlur={e => (e.target.style.borderColor = BD)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                  Telefonnummer <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <input
                  style={inp}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="z.B. 0151 12345678"
                  type="tel"
                  onFocus={e => (e.target.style.borderColor = G)}
                  onBlur={e => (e.target.style.borderColor = BD)}
                />
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <button onClick={saveStep1} disabled={!companyName.trim() || loading} style={btn(!companyName.trim() || loading)}>
                {loading ? "Speichern …" : "Weiter →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Leistungen ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>✂️</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 6px" }}>Deine Leistungen</h2>
            <p style={{ fontSize: 15, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
              Welche Leistungen können Kunden bei dir buchen? Du kannst jederzeit weitere hinzufügen.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {services.map((svc, i) => (
                <div key={i} style={{ background: "#F9FAFB", border: `1.5px solid ${BD}`, borderRadius: 14, padding: "16px 16px" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input
                      style={{ ...inp, flex: 2, minWidth: 140 }}
                      placeholder="Name (z.B. Herrenhaarschnitt)"
                      value={svc.name}
                      onChange={e => { const s = [...services]; s[i].name = e.target.value; setServices(s) }}
                      onFocus={e => (e.target.style.borderColor = G)}
                      onBlur={e => (e.target.style.borderColor = BD)}
                    />
                    <input
                      style={{ ...inp, flex: 1, minWidth: 80 }}
                      placeholder="Preis €"
                      value={svc.price}
                      onChange={e => { const s = [...services]; s[i].price = e.target.value; setServices(s) }}
                      onFocus={e => (e.target.style.borderColor = G)}
                      onBlur={e => (e.target.style.borderColor = BD)}
                    />
                    <select
                      value={svc.duration}
                      onChange={e => { const s = [...services]; s[i].duration = e.target.value; setServices(s) }}
                      style={{ ...inp, flex: 1, minWidth: 100 }}
                    >
                      {["15","20","30","45","60","75","90","120"].map(d => (
                        <option key={d} value={d}>{d} Min.</option>
                      ))}
                    </select>
                    {services.length > 1 && (
                      <button onClick={() => setServices(services.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 18, padding: "0 4px", alignSelf: "center" }}>×</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setServices([...services, { name: "", duration: "30", price: "" }])}
              style={{ marginTop: 10, background: GL, border: `1px dashed ${GB}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, color: G, cursor: "pointer", width: "100%" }}>
              + Weitere Leistung hinzufügen
            </button>

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ padding: "13px 20px", borderRadius: 12, border: `1.5px solid ${BD}`, background: "#fff", color: M, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                ← Zurück
              </button>
              <button onClick={saveStep2} disabled={loading} style={btn(loading)}>
                {loading ? "Speichern …" : services.some(s => s.name.trim()) ? "Speichern & weiter →" : "Überspringen →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Buchungsseite ── */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🔗</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: T, margin: "0 0 6px" }}>Deine Buchungsseite</h2>
            <p style={{ fontSize: 15, color: M, margin: "0 0 24px", lineHeight: 1.6 }}>
              Kunden können über diesen Link direkt bei dir buchen. Du kannst ihn später noch ändern.
            </p>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: .5, marginBottom: 7 }}>
                Dein Buchungslink
              </label>
              <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${BD}`, borderRadius: 12, overflow: "hidden", background: "#F9FAFB" }}>
                <span style={{ padding: "13px 14px", fontSize: 13, color: M, background: "#F3F4F6", borderRight: `1px solid ${BD}`, whiteSpace: "nowrap", flexShrink: 0 }}>
                  terminstop.de/book/
                </span>
                <input
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="dein-betrieb"
                  style={{ flex: 1, padding: "13px 15px", border: "none", outline: "none", fontSize: 14, color: T, background: "transparent", fontFamily: FONT }}
                />
              </div>
              <p style={{ fontSize: 12, color: M, marginTop: 6 }}>Nur Kleinbuchstaben, Zahlen und Bindestriche.</p>
            </div>

            {slug && (
              <div style={{ background: GL, border: `1px solid ${GB}`, borderRadius: 14, padding: "14px 18px", marginTop: 16 }}>
                <div style={{ fontSize: 12, color: G, fontWeight: 700, marginBottom: 4 }}>Deine Buchungsseite:</div>
                <a href={`/book/${slug}`} target="_blank" style={{ fontSize: 14, color: G, fontWeight: 700, textDecoration: "none" }}>
                  terminstop.de/book/{slug} ↗
                </a>
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ padding: "13px 20px", borderRadius: 12, border: `1.5px solid ${BD}`, background: "#fff", color: M, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                ← Zurück
              </button>
              <button onClick={saveStep3} disabled={loading} style={btn(loading)}>
                {loading ? "Speichern …" : slug.trim() ? "Speichern & weiter →" : "Überspringen →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Fertig ── */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: T, margin: "0 0 12px" }}>Alles bereit!</h2>
            <p style={{ fontSize: 15, color: M, margin: "0 0 32px", lineHeight: 1.7 }}>
              Dein Betrieb ist eingerichtet. Du kannst jetzt Termine eintragen,<br />
              Kunden verwalten und deine Buchungsseite teilen.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                { icon: "📅", title: "Termine verwalten",      desc: "Trage deinen ersten Termin ein",         href: "/dashboard" },
                { icon: "🔗", title: "Buchungsseite teilen",   desc: slug ? `terminstop.de/book/${slug}` : "Link in Einstellungen konfigurieren", href: slug ? `/book/${slug}` : "/settings" },
                { icon: "💳", title: "Paket wählen",           desc: "14 Tage kostenlos — danach ab 39 €",    href: "/settings" },
              ].map(item => (
                <a key={item.title} href={item.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#F9FAFB", border: `1px solid ${BD}`, borderRadius: 14, textDecoration: "none", transition: "border .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = GB)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = BD)}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: M, marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: M, fontSize: 16 }}>→</div>
                </a>
              ))}
            </div>

            <button onClick={finish} style={btn()}>
              Zum Dashboard →
            </button>
          </div>
        )}
      </div>

      {/* Skip link */}
      {step < 4 && (
        <button onClick={finish} style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: M, textDecoration: "underline" }}>
          Einrichtung überspringen
        </button>
      )}

    </div>
  )
}
