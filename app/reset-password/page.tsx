"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const router = useRouter()

  const [ready,    setReady]    = useState(false)   // recovery session aktiv?
  const [password, setPassword] = useState("")
  const [confirm,  setConfirm]  = useState("")
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [error,    setError]    = useState("")
  const [showPw,   setShowPw]   = useState(false)

  // Supabase setzt die Session automatisch wenn der Recovery-Link geklickt wird
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    // Falls Session schon aktiv (page reload)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.")
      return
    }
    if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/.test(password)) {
      setError("Das Passwort muss mindestens ein Sonderzeichen enthalten (!@#$%...).")
      return
    }
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.")
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError("Das Passwort konnte nicht gesetzt werden. Bitte fordere einen neuen Link an.")
      return
    }

    setDone(true)
    setTimeout(() => router.push("/dashboard"), 2500)
  }

  const G  = "#18A66D"
  const GL = "#F0FBF6"
  const GB = "#D1F5E3"

  const cardStyle: React.CSSProperties = {
    background:"#fff", border:"1px solid #E5E7EB", borderRadius:24,
    padding:"40px 32px", maxWidth:400, width:"100%",
    boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
  }

  const wrap: React.CSSProperties = {
    minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center",
    background:"#F9FAFB", fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",
    padding:"24px",
  }

  /* ── Done ── */
  if (done) return (
    <div style={wrap}>
      <div style={{ ...cardStyle, textAlign:"center" }}>
        <div style={{ width:64, height:64, background:GL, border:`1px solid ${GB}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 20px" }}>✓</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 10px", letterSpacing:"-.4px" }}>Passwort geändert!</h1>
        <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, margin:0 }}>Du wirst gleich automatisch weitergeleitet …</p>
      </div>
    </div>
  )

  /* ── Kein Recovery-Token ── */
  if (!ready) return (
    <div style={wrap}>
      <div style={{ ...cardStyle, textAlign:"center" }}>
        <div style={{ width:64, height:64, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 20px" }}>🔒</div>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 10px" }}>Link ungültig oder abgelaufen</h1>
        <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.65, margin:"0 0 24px" }}>
          Bitte fordere einen neuen Passwort-Link an.
        </p>
        <a href="/forgot-password" style={{ display:"inline-block", background:G, color:"#fff", padding:"12px 24px", borderRadius:12, fontSize:14, fontWeight:700, textDecoration:"none" }}>
          Neuen Link anfordern →
        </a>
      </div>
    </div>
  )

  /* ── Formular ── */
  return (
    <div style={wrap}>
      <div style={cardStyle}>
        <div style={{ marginBottom:28 }}>
          <a href="/" style={{ textDecoration:"none", fontSize:20, fontWeight:900, letterSpacing:"-.5px" }}>
            <span style={{ color:G }}>Termin</span><span style={{ color:"#111827" }}>Stop</span>
          </a>
        </div>

        <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:"0 0 8px", letterSpacing:"-.4px" }}>Neues Passwort setzen</h1>
        <p style={{ fontSize:14, color:"#6B7280", margin:"0 0 28px", lineHeight:1.6 }}>
          Wähle ein neues Passwort für dein Konto.
        </p>

        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:14, color:"#DC2626", lineHeight:1.5 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleReset} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Neues Passwort</label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mind. 8 Zeichen + Sonderzeichen"
                required
                style={{ width:"100%", padding:"13px 44px 13px 16px", border:"1.5px solid #E5E7EB", borderRadius:12, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#F9FAFB" }}
                onFocus={e => e.currentTarget.style.borderColor = G}
                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#9CA3AF", padding:"4px" }}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Passwort bestätigen</label>
            <input
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Passwort wiederholen"
              required
              style={{ width:"100%", padding:"13px 16px", border:`1.5px solid ${confirm && confirm !== password ? "#FECACA" : confirm && confirm === password ? GB : "#E5E7EB"}`, borderRadius:12, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#F9FAFB" }}
              onFocus={e => e.currentTarget.style.borderColor = G}
              onBlur={e => { if (!confirm || confirm !== password) e.currentTarget.style.borderColor = "#E5E7EB" }}
            />
            {confirm && confirm === password && (
              <p style={{ fontSize:12, color:G, marginTop:5, fontWeight:600 }}>✓ Passwörter stimmen überein</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirm}
            style={{
              marginTop:4, padding:"14px",
              background: loading || !password || !confirm ? "#E5E7EB" : G,
              color: loading || !password || !confirm ? "#9CA3AF" : "#fff",
              border:"none", borderRadius:12, fontSize:15, fontWeight:700,
              cursor: loading || !password || !confirm ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: loading || !password || !confirm ? "none" : "0 4px 16px rgba(24,166,109,0.25)",
              transition:"all .18s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />
                Wird gespeichert …
              </>
            ) : "Passwort speichern →"}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
