"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    )

    setLoading(false)

    if (err) {
      setError("Es gab ein Problem. Bitte versuche es erneut.")
      return
    }

    setSent(true)
  }

  const G = "#18A66D"

  if (sent) return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFB", fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif", padding:"24px" }}>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:24, padding:"40px 32px", maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ width:64, height:64, background:"#F0FBF6", border:"1px solid #D1F5E3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 20px" }}>✉️</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 10px", letterSpacing:"-.4px" }}>E-Mail gesendet!</h1>
        <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, margin:"0 0 28px" }}>
          Wir haben einen Link an <strong style={{ color:"#111827" }}>{email}</strong> geschickt. Klicke auf den Link um ein neues Passwort zu setzen.
        </p>
        <p style={{ fontSize:13, color:"#9CA3AF", margin:"0 0 24px" }}>Kein Link angekommen? Schau auch im Spam-Ordner nach.</p>
        <a href="/login" style={{ display:"block", textAlign:"center", fontSize:14, color:G, fontWeight:700, textDecoration:"none" }}>← Zurück zum Login</a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFB", fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif", padding:"24px" }}>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:24, padding:"40px 32px", maxWidth:400, width:"100%", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>

        {/* Logo */}
        <div style={{ marginBottom:28 }}>
          <a href="/" style={{ textDecoration:"none", fontSize:20, fontWeight:900, letterSpacing:"-.5px" }}>
            <span style={{ color:G }}>Termin</span><span style={{ color:"#111827" }}>Stop</span>
          </a>
        </div>

        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 8px", letterSpacing:"-.4px" }}>Passwort zurücksetzen</h1>
        <p style={{ fontSize:14, color:"#6B7280", margin:"0 0 28px", lineHeight:1.6 }}>
          Gib deine E-Mail-Adresse ein — wir schicken dir einen Link zum Zurücksetzen.
        </p>

        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:14, color:"#DC2626" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>E-Mail-Adresse</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="firma@beispiel.de"
              required
              autoComplete="email"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #E5E7EB", borderRadius:12, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#F9FAFB", transition:"border-color .15s" }}
              onFocus={e => e.currentTarget.style.borderColor = G}
              onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            style={{
              padding:"14px", background: loading || !email.trim() ? "#E5E7EB" : G,
              color: loading || !email.trim() ? "#9CA3AF" : "#fff",
              border:"none", borderRadius:12, fontSize:15, fontWeight:700,
              cursor: loading || !email.trim() ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: loading || !email.trim() ? "none" : "0 4px 16px rgba(24,166,109,0.25)",
              transition:"all .18s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />
                Wird gesendet …
              </>
            ) : "Link senden →"}
          </button>
        </form>

        <div style={{ marginTop:24, textAlign:"center" }}>
          <a href="/login" style={{ fontSize:13, color:"#9CA3AF", textDecoration:"none", fontWeight:500 }}>← Zurück zum Login</a>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
