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

  async function handleSubmit(e:any){
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("leads")
      .insert([{
        name,
        phone,
        email,
        company,
        message
      }])

    setLoading(false)

    if (!error) {
      setSuccess(true)
      setName("")
      setPhone("")
      setEmail("")
      setCompany("")
      setMessage("")
    } else {
      console.log(error)
      alert("Fehler beim Senden")
    }
  }

  return (

    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-xl">

        {!success ? (
          <>
            {/* HEADER */}
            <div className="mb-10">

              <button
                onClick={() => router.push("/")}
                className="text-sm text-black/50 hover:text-black mb-6"
              >
                ← Zurück
              </button>

              <h1 className="text-3xl font-semibold mb-3 text-black/60">
                Kostenlose Beratung
              </h1>

              <p className="text-black/60 text-sm leading-relaxed">
                Wir zeigen Ihnen, wie Sie Ausfälle reduzieren und Ihren Ablauf optimieren.
              </p>

            </div>

            {/* CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-black/10">

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* NAME */}
                <div>
                  <label className="text-sm font-medium text-black mb-1 block">
                    Name
                  </label>
                  <input
                    className="w-full border border-black/20 p-3 rounded-lg 
                    focus:outline-none focus:border-black 
                    bg-white text-black placeholder:text-black/30"
                    placeholder="Max Mustermann"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm font-medium text-black mb-1 block">
                    Telefonnummer
                  </label>
                  <input
                    className="w-full border border-black/20 p-3 rounded-lg 
                    focus:outline-none focus:border-black 
                    bg-white text-black placeholder:text-black/30"
                    placeholder="+49 123 456789"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-medium text-black mb-1 block">
                    E-Mail
                  </label>
                  <input
                    className="w-full border border-black/20 p-3 rounded-lg 
                    focus:outline-none focus:border-black 
                    bg-white text-black placeholder:text-black/30"
                    placeholder="beispiel@email.de"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* COMPANY */}
                <div>
                  <label className="text-sm font-medium text-black mb-1 block">
                    Unternehmen (optional)
                  </label>
                  <input
                    className="w-full border border-black/20 p-3 rounded-lg 
                    focus:outline-none focus:border-black 
                    bg-white text-black placeholder:text-black/30"
                    placeholder="Ihre Firma"
                    value={company}
                    onChange={(e)=>setCompany(e.target.value)}
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-sm font-medium text-black mb-1 block">
                    Nachricht (optional)
                  </label>
                  <textarea
                    className="w-full border border-black/20 p-3 rounded-lg 
                    focus:outline-none focus:border-black 
                    bg-white text-black placeholder:text-black/30"
                    placeholder="Kurze Info zu Ihrem Anliegen"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                  />
                </div>

                {/* BUTTON */}
                <button
                  className="bg-black text-white p-3 rounded-lg mt-4 hover:bg-[#111] transition font-medium"
                  disabled={loading}
                >
                  {loading ? "Senden..." : "Beratung anfragen"}
                </button>

              </form>

            </div>
          </>
        ) : (
          <div className="text-center bg-white p-10 rounded-2xl shadow-lg border border-black/10">

            <h2 className="text-2xl font-semibold mb-3 text-black/60">
              Anfrage gesendet ✅
            </h2>

            <p className="text-black/60 text-sm mb-6">
              Wir melden uns schnellstmöglich bei Ihnen.
            </p>

            <button
              onClick={() => router.push("/")}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Zur Startseite
            </button>

          </div>
        )}

      </div>

    </div>
  )
}