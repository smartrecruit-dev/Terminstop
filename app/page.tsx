"use client"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-black">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-16 py-6 border-b border-black/5">
        <div className="text-sm tracking-wide text-black/60">
          TerminStop
        </div>
        <a href="/login" className="text-sm text-black/50 hover:text-black">
          Login
        </a>
      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-10 py-32 grid grid-cols-2 gap-24 items-center">

        <div>
          <h1 className="text-6xl font-semibold leading-tight mb-8">
            Keine Terminausfälle mehr.
          </h1>

          <p className="text-xl text-black/50 mb-6">
            TerminStop sorgt dafür, dass Ihre Kunden zuverlässig erscheinen –
            durch automatische SMS-Erinnerungen.
          </p>

          <p className="text-lg text-black/40 mb-10">
            Für Friseure, Werkstätten und Dienstleister mit Terminen.
          </p>

          <a href="/login" className="bg-black text-white px-8 py-4 rounded-xl text-sm inline-block">
            Jetzt starten
          </a>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            className="rounded-2xl shadow-lg"
          />
        </div>

      </div>

      {/* TRUST NUMBERS */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 text-center py-16 text-sm text-black/50">
        <div>
          <div className="text-2xl font-semibold text-black">50+</div>
          Unternehmen
        </div>
        <div>
          <div className="text-2xl font-semibold text-black">1000+</div>
          Erinnerungen / Monat
        </div>
        <div>
          <div className="text-2xl font-semibold text-black">-70%</div>
          Ausfälle
        </div>
      </div>

      {/* 🖥️ WAS IST TERMINSTOP */}
      <div className="max-w-7xl mx-auto px-10 py-28 grid grid-cols-2 gap-24 items-center">

        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Was ist TerminStop?
          </h2>

          <p className="text-black/60 text-lg leading-relaxed mb-6">
            TerminStop ist ein einfaches System für Unternehmen,
            die mit Terminen arbeiten.
          </p>

          <p className="text-black/60 text-lg leading-relaxed mb-6">
            Sie tragen einen Termin ein – und Ihr Kunde erhält automatisch
            eine Erinnerung per SMS.
          </p>

          <p className="text-black/60 text-lg leading-relaxed">
            So vermeiden Sie Ausfälle, sparen Zeit
            und steigern Ihren Umsatz.
          </p>

        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
            className="rounded-2xl shadow-lg"
          />
        </div>

      </div>

      {/* ⚙️ HOW IT WORKS */}
      <div className="bg-white py-24">

        <div className="max-w-6xl mx-auto px-10 text-center">

          <h2 className="text-3xl font-semibold mb-12">
            So einfach funktioniert es
          </h2>

          <div className="grid grid-cols-3 gap-10 text-sm">

            <div>
              <div className="text-4xl mb-3">📅</div>
              Termin eintragen
            </div>

            <div>
              <div className="text-4xl mb-3">📲</div>
              SMS wird automatisch gesendet
            </div>

            <div>
              <div className="text-4xl mb-3">✅</div>
              Kunde erscheint
            </div>

          </div>

        </div>

      </div>

      {/* 🔥 CASE STUDY */}
      <div className="bg-white py-24 border-y border-black/5">

        <div className="max-w-5xl mx-auto px-10 text-center">

          <h2 className="text-3xl font-semibold mb-10">
            Ergebnis aus der Praxis
          </h2>

          <div className="bg-[#F7F7F5] p-10 rounded-2xl border border-black/5">

            <div className="text-lg font-medium mb-4">
              Friseursalon Elegance
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm text-black/60">

              <div>
                <div className="font-medium text-black">Vorher</div>
                6–8 Ausfälle / Woche
              </div>

              <div>
                <div className="font-medium text-black">Nachher</div>
                1–2 Ausfälle / Woche
              </div>

              <div>
                <div className="font-medium text-black">Ergebnis</div>
                +1.000€ – 1.500€ zusätzlicher Umsatz / Monat
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 💥 ERFOLGSGARANTIE */}
      <div className="bg-white py-28 border-y border-black/5">

        <div className="max-w-6xl mx-auto px-10 text-center">

          <h2 className="text-3xl font-semibold mb-6">
            100% risikofrei – unsere Geld-zurück-Garantie
          </h2>

          <p className="text-black/60 text-lg max-w-2xl mx-auto mb-12">
            Wir sind überzeugt, dass TerminStop Ihre Terminausfälle deutlich reduziert.
            Sollten Sie keinen spürbaren Unterschied feststellen,
            erhalten Sie Ihr Geld vollständig zurück.
          </p>

          {/* Diagramm */}
          <div className="flex justify-center gap-16 items-end mb-8">

            <div className="text-center">
              <div className="h-40 w-20 bg-black/10 rounded-lg"></div>
              <div className="text-xs mt-2 text-black/40">Ohne TerminStop</div>
            </div>

            <div className="text-center">
              <div className="h-16 w-20 bg-black rounded-lg"></div>
              <div className="text-xs mt-2 text-black/40">Mit TerminStop</div>
            </div>

          </div>

          <div className="text-sm text-black/40">
            Weniger Ausfälle – mehr planbare Termine
          </div>

        </div>

      </div>

      {/* 🔥 VERGLEICH */}
      <div className="bg-white border-y border-black/5 py-28">

        <div className="max-w-5xl mx-auto px-10">

          <h2 className="text-3xl font-semibold text-center mb-16">
            Der Unterschied im Alltag
          </h2>

          <div className="overflow-hidden rounded-2xl border border-black/10">

            <div className="grid grid-cols-3 text-sm">

              <div className="p-6 font-medium text-black/50">Funktion</div>
              <div className="p-6 text-black/50">Andere</div>
              <div className="p-6 bg-black text-white">TerminStop</div>

              {[
                ["Automatische Erinnerung", "❌", "✔"],
                ["Weniger Ausfälle", "❌", "✔"],
                ["Zeit sparen", "❌", "✔"],
                ["Einfache Bedienung", "⚠️", "✔"],
                ["Support", "❌", "✔"]
              ].map((row, i) => (
                <div key={i} className="contents">
                  <div className="p-6 border-t border-black/5">{row[0]}</div>
                  <div className="p-6 border-t border-black/5 text-black/40">{row[1]}</div>
                  <div className="p-6 border-t border-black/5 bg-black/5 font-medium">{row[2]}</div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* 🤝 TEAM */}
      <div className="bg-white py-28">

        <div className="max-w-6xl mx-auto px-10 grid grid-cols-2 gap-20 items-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              className="rounded-2xl shadow-md"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Persönliche Unterstützung
            </h2>

            <p className="text-black/60 text-lg leading-relaxed">
              Wir unterstützen Sie dabei, Ihr System optimal zu nutzen
              und Ihre Termine effizient zu organisieren.
            </p>

          </div>

        </div>

      </div>

      {/* PRICING */}
<div className="bg-white py-28">

  <div className="max-w-6xl mx-auto px-10 text-center">

    <h2 className="text-3xl font-semibold mb-6">
      Individuelle Lösungen für Ihr Unternehmen
    </h2>

    <p className="text-black/50 max-w-2xl mx-auto mb-14">
      TerminStop wird individuell an Ihr Unternehmen angepasst – je nach Terminanzahl,
      Auslastung und Anforderungen. So stellen wir sicher, dass Sie das Maximum aus Ihrem System herausholen.
    </p>

    <div className="grid grid-cols-2 gap-10">

      {/* BASIC */}
      <div className="border border-black/10 rounded-2xl p-10">

        <div className="text-xl mb-4 font-medium">
          Für kleinere Betriebe
        </div>

        <ul className="text-black/60 space-y-3 mb-8">
          <li>✔ Automatische SMS-Erinnerungen</li>
          <li>✔ Weniger Terminausfälle</li>
          <li>✔ Einfache Einrichtung</li>
        </ul>

        <div className="text-sm text-black/40 mb-6">
          Individuelle Preisgestaltung je nach Terminaufkommen
        </div>

        <a href="/login" className="border border-black px-6 py-3 rounded-lg">
          Erstgespräch vereinbaren
        </a>

      </div>

      {/* PRO */}
      <div className="border-2 border-black rounded-2xl p-10 bg-black text-white shadow-lg">

        <div className="text-xs mb-2 text-white/60">
          EMPFOHLEN
        </div>

        <div className="text-xl mb-4 font-medium">
          Für wachsende Betriebe
        </div>

        <ul className="text-white/80 space-y-3 mb-8">
          <li>✔ Persönliche Betreuung</li>
          <li>✔ Auswertungen & Optimierung</li>
          <li>✔ Maximale Auslastung</li>
        </ul>

        <div className="text-sm text-white/60 mb-6">
          Individuelles Angebot im Erstgespräch
        </div>

        <a href="/login" className="bg-white text-black px-6 py-3 rounded-lg">
          Beratung starten
        </a>

      </div>

    </div>

  </div>

</div>

      {/* FOOTER */}
      <div className="text-center text-xs text-black/40 py-12 space-y-3">
        <div>TerminStop – Weniger Ausfälle. Mehr Umsatz.</div>

        <div className="flex justify-center gap-6">
        <a href="/impressum">Impressum</a>
<a href="/datenschutz">Datenschutz</a>
<a href="/agb">AGB</a>
        </div>
      </div>

    </div>
  )
}