export default function Impressum() {
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  return (
    <div
      className="min-h-screen bg-[#F7FAFC] text-[#1F2A37] px-6 py-16"
      style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-sm text-[#6B7280] hover:text-[#1F2A37] transition mb-6 inline-block">← Zurück</a>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold">
              <span className="text-[#18A66D]">Termin</span>
              <span className="text-[#1F2A37]">Stop</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1F2A37] mb-3">Impressum</h1>
          <p className="text-[#6B7280] text-sm">
            Angaben gemäß § 5 TMG · Stand: {today}
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10 shadow-sm space-y-10 text-sm leading-relaxed text-[#374151]">

          {/* Anbieter */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Anbieter</h2>
            <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4 text-[#1F2A37]">
              <strong>TerminStop</strong><br />
              Marvin Passe<br />
              Hinterm Stieberge 16<br />
              31535 Neustadt am Rübenberge<br />
              Deutschland
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Kontakt</h2>
            <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4 text-[#1F2A37]">
              E-Mail:{" "}
              <a href="mailto:terminstop.business@gmail.com" className="text-[#18A66D] hover:underline">
                terminstop.business@gmail.com
              </a>
              <br />
              Telefon: 0151 54212634
            </div>
          </section>

          {/* Umsatzsteuer */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Umsatzsteuer</h2>
            <p>
              Gemäß § 19 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer
              ausgewiesen und erhoben. Eine Umsatzsteuer-Identifikationsnummer liegt
              nicht vor.
            </p>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4 text-[#1F2A37]">
              Marvin Passe<br />
              Hinterm Stieberge 16<br />
              31535 Neustadt am Rübenberge<br />
              Deutschland
            </div>
          </section>

          {/* Streitschlichtung */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Streitschlichtung</h2>
            <p className="mb-3">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#18A66D] hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen. Unser Angebot richtet sich ausschließlich
              an Unternehmer im Sinne des § 14 BGB (B2B).
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Haftung für Inhalte</h2>
            <p className="mb-3">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
              als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
              erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
              umgehend entfernen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Haftung für Links</h2>
            <p className="mb-3">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
              Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
              Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Urheberrecht</h2>
            <p className="mb-3">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
              Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
              wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
              als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
              aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          {/* Datenschutz Hinweis */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <a href="/datenschutz" className="text-[#18A66D] hover:underline">
                Datenschutzerklärung
              </a>
              .
            </p>
          </section>

          {/* Stand */}
          <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Stand: {today}</p>
            <p className="text-xs text-[#9CA3AF]">TerminStop · Marvin Passe</p>
          </div>

        </div>

        {/* Navigation zu anderen Rechtstexten */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/datenschutz" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Datenschutzerklärung</a>
          <a href="/agb" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">AGB</a>
          <a href="/avv" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Auftragsverarbeitungsvertrag</a>
        </div>

      </div>
    </div>
  )
}
