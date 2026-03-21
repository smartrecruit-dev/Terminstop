"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleLogin(e: FormEvent){
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("email", email.trim())
      .eq("password", password.trim())

    if(error){
      alert("Fehler: " + error.message)
      setLoading(false)
      return
    }

    if(!data || data.length === 0){
      alert("Login fehlgeschlagen")
      setLoading(false)
      return
    }

    const company = data[0]

    // 🔥 Speicherung für Dashboard
    localStorage.setItem("company_id", company.id)
    localStorage.setItem("company_name", company.name)

    router.push("/dashboard")
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F7F7F5] to-[#EFEFEA]">

      {/* CARD */}
      <div className="bg-white border border-black/10 rounded-2xl p-10 w-[380px] shadow-md">

        {/* BRAND */}
        <div className="mb-10 text-center">

          <div className="text-sm tracking-wide text-black/50 mb-2">
            TerminStop
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Zugriff auf Ihr System
          </h1>

          <p className="text-sm text-black/60 mt-2">
            Verwalten Sie Ihre Termine effizient und ohne Ausfälle
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            className="border border-black/20 p-3 rounded-lg bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition"
            placeholder="E-Mail"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            className="border border-black/20 p-3 rounded-lg bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition"
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            className="bg-black text-white p-3 rounded-lg mt-2 hover:opacity-90 transition"
            type="submit"
          >
            {loading ? "Bitte warten..." : "Einloggen"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-6 text-xs text-black/40 text-center">
          Sicherer Zugriff für Ihr Unternehmen
        </div>

      </div>

    </div>
  )
}