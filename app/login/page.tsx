"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("email", email.trim())
      .eq("password", password.trim())

    if (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setError("E-Mail oder Passwort ist nicht korrekt.")
      setLoading(false)
      return
    }

    const company = data[0]
    localStorage.setItem("company_id", company.id)
    localStorage.setItem("company_name", company.name)
    router.push("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "'Inter', 'Manrope', sans-serif",
        backgroundColor: "#F7FAFC",
        backgroundImage: "radial-gradient(ellipse at 60% 0%, #D1FAE5 0%, transparent 60%), radial-gradient(ellipse at 10% 100%, #E0F2FE 0%, transparent 50%)"
      }}
    >
      <div className="hidden lg:flex flex-col justify-center pr-20 max-w-md">
        <div className="mb-6">
          <span className="text-3xl font-black tracking-tight">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1F2A37] mb-4 leading-snug">
          Weniger Ausfälle.<br />Mehr Planbarkeit.
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
          Verwalten Sie Ihre Termine, beobachten Sie Ihre Entwicklung
          und lassen Sie SMS-Erinnerungen automatisch für Sie arbeiten.
        </p>
        <div className="space-y-3">
          {["Automatische SMS-Erinnerungen", "Übersicht über alle Termine", "Einblicke & Auswertungen"].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#E8FBF3] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#18A66D] text-xs">✓</span>
              </div>
              <span className="text-sm text-[#6B7280]">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-10 pt-8 border-t border-[#E5E7EB]">
          <div><div className="text-lg font-black text-[#18A66D]">50+</div><div className="text-xs text-[#6B7280]">Betriebe</div></div>
          <div className="h-6 w-px bg-[#E5E7EB]" />
          <div><div className="text-lg font-black text-[#18A66D]">95%</div><div className="text-xs text-[#6B7280]">Weniger Ausfälle</div></div>
          <div className="h-6 w-px bg-[#E5E7EB]" />
          <div><div className="text-lg font-black text-[#18A66D]">4.9★</div><div className="text-xs text-[#6B7280]">Bewertung</div></div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 w-full max-w-[400px] shadow-xl shadow-[#1F2A37]/5">
        <div className="lg:hidden text-center mb-8">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-[#18A66D]">Termin</span>
            <span className="text-[#1F2A37]">Stop</span>
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1F2A37] mb-1">Willkommen zurück</h1>
          <p className="text-sm text-[#6B7280]">Melden Sie sich an, um Ihr Dashboard zu öffnen.</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 mb-5">
            <span className="text-[#EF4444] text-sm flex-shrink-0">⚠</span>
            <span className="text-sm text-[#EF4444]">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">E-Mail</label>
            <input
              type="email"
              className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
              placeholder="firma@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 pr-11 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:outline-none focus:border-[#18A66D] focus:ring-2 focus:ring-[#18A66D]/10 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition text-sm px-1"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              loading ? "bg-[#6B7280] text-white cursor-not-allowed" : "bg-[#18A66D] text-white hover:bg-[#0F8F63] shadow-[#18A66D]/20"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Anmeldung läuft...
              </span>
            ) : "Einloggen →"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F3F4F6]">
          <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
            <span className="text-[#18A66D]">🔒</span>
            <span>Sicherer Zugriff für Ihr Unternehmen</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#18A66D] rounded-full animate-pulse" />
              <span>System aktiv</span>
            </div>
            <span>·</span>
            <span>SMS-Erinnerungen laufen</span>
          </div>
        </div>
      </div>
    </div>
  )
}
