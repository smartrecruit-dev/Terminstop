"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

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
      setFormError("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.")
    }
  }

  return (
    <div
      className="min-h-screen text-[#1F2A37]"
      style={{
        fontFamily: "'Inter', 'Manrope', sans-serif",
        backgroundColor: "#F7FAFC",
        backgroundImage: "radial-gradient(ellipse at 80% 0%, #D1FAE5 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #E0F2FE 0%, transparent 50%)"
      }}
    >

      {/* ─── MINI NAV ─── */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-5 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm">
        <a href="/">
          <span className="text-base font-bold">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
        </a>
        <a href="/" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition flex items-center gap-1">
          ← Zurück zur Startseite
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 flex flex-col lg:flex-row gap-16 items-start">

        {/* ─── LEFT: Info ─── */}
        <div className="lg:flex-1 lg:pt-4">

          <div className="inline-flex items-center gap-2 bg-[#E8FBF3] text-[#18A66D] text-xs font-semibold px-4 py-2 rounded-full mb-6">
            ✓ Kostenlos & unverbindlich
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4 leading-tight">
            Kostenlose Beratung<br />
            <span className="text-[#18A66D]">in 15 Minuten</span>
          </h1>

          <p className="text-[#6B7280] text-base leading-relaxed mb-8">
            Wir zeigen Ihnen, wie TerminStop in Ihrem Betrieb funktioniert –
            und was es konkret für Sie bedeutet.
          </p>

          {/* Was Sie erwartet */}
          <div className="space-y-4 mb-10">
            {[
              { icon: "📞", title: "Persönliches Gespräch", desc: "Kein anonymer Support – Sie sprechen direkt mit uns." },
              { icon: "⚡", title: "Schnelle Einrichtung", desc: "Wir zeigen Ihnen, wie das System in unter 10 Minuten läuft." },
              { icon: "💡", title: "Konkrete Einschätzung", desc: "Sie erfahren, wie viel Sie monatlich durch TerminStop sparen können." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1F2A37]">{item.title}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-5 pt-8 border-t border-[#E5E7EB]">
            {[
              { value: "50+", label: "Betriebe aktiv" },
              { value: "95%", label: "Weniger Ausfälle" },
              { value: "Ø 8 Min.", label: "Einrichtung" },
            ].map((kpi, i) => (
              <div key={i}>
                <div className="text-lg font-black text-[#18A66D]">{kpi.value}</div>
                <div className="text-xs text-[#6B7280]">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Form / Success ─── */}
        <div className="w-full lg:w-[460px] flex-shrink-0">

          {!success ? (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-xl shadow-[#1F2A37]/5 overflow-hidden">

              {/* Card header */}
              <div className="px-8 py-6 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-bold text-[#1F2A37]">Anfrage senden</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                </p>
              </div>

              {/* Error */}
              {formError && (
                <div className="mx-8 mt-5 flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
                  <span className="text-[#EF4444] text-sm">⚠</span>
                  <span className="text-sm text-[#EF4444]">{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Name</label>
                  <input
                    className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                    placeholder="Max Mustermann"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Telefon + E-Mail nebeneinander */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Telefon</label>
                    <input
                      className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                      placeholder="+49 170..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">E-Mail</label>
                    <input
                      type="email"
                      className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                      placeholder="firma@..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Unternehmen */}
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                    Unternehmen <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                    placeholder="z. B. Autohaus Müller GmbH"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                {/* Nachricht */}
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                    Nachricht <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition resize-none"
                    placeholder="Kurze Info zu Ihrem Betrieb oder Anliegen..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-1 w-full py-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                    loading
                      ? "bg-[#6B7280] text-white cursor-not-allowed"
                      : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-[#18A66D]/20"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Wird gesendet...
                    </span>
                  ) : (
                    "Kostenlose Beratung anfragen →"
                  )}
                </button>

                {/* Micro trust */}
                <div className="flex items-center justify-center gap-5 text-xs text-[#9CA3AF] pt-1">
                  <span>✓ Kein Vertrag</span>
                  <span>✓ Kostenlos</span>
                  <span>✓ Unverbindlich</span>
                </div>

              </form>
            </div>

          ) : (

            /* ─── SUCCESS STATE ─── */
            <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-xl shadow-[#1F2A37]/5 overflow-hidden text-center">
              <div className="bg-gradient-to-br from-[#0F8F63] to-[#1FB07A] px-8 py-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Anfrage gesendet!
                </h2>
                <p className="text-white/80 text-sm">
                  Wir haben Ihre Anfrage erhalten.
                </p>
              </div>

              <div className="px-8 py-8">
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  Wir melden uns <strong className="text-[#1F2A37]">innerhalb von 24 Stunden</strong> persönlich bei Ihnen –
                  per Telefon oder E-Mail, ganz wie es Ihnen passt.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Persönliches Beratungsgespräch",
                    "Konkrete Einschätzung für Ihren Betrieb",
                    "Einrichtung in unter 10 Minuten",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#1F2A37]">
                      <div className="w-5 h-5 bg-[#E8FBF3] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#18A66D] text-xs">✓</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[#F7FAFC] border border-[#E5E7EB] text-[#1F2A37] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#E5E7EB] transition"
                >
                  ← Zurück zur Startseite
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
