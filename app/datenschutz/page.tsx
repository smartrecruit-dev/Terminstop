export default function Datenschutz() {
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
          <h1 className="text-3xl font-bold text-[#1F2A37] mb-3">Datenschutzerklärung</h1>
          <p className="text-[#6B7280] text-sm">
            Gemäß Art. 13, 14 DSGVO · Stand: {today}
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10 shadow-sm space-y-10 text-sm leading-relaxed text-[#374151]">

          {/* § 1 Verantwortlicher */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">1. Verantwortlicher</h2>
            <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4 text-[#1F2A37]">
              <strong>Marvin Passe</strong><br />
              Hinterm Stieberge 16<br />
              31535 Neustadt am Rübenberge<br />
              Deutschland<br /><br />
              E-Mail: terminstop.business@gmail.com<br />
              Telefon: 0151 54212634
            </div>
            <p className="mt-3">
              Der Verantwortliche im Sinne der Datenschutz-Grundverordnung (DSGVO)
              und anderer nationaler Datenschutzgesetze sowie sonstiger
              datenschutzrechtlicher Bestimmungen ist die oben genannte Person.
            </p>
          </section>

          {/* § 2 Allgemeines */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">2. Allgemeines zur Datenverarbeitung</h2>
            <p className="mb-3">
              Wir verarbeiten personenbezogene Daten grundsätzlich nur, soweit dies
              zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte
              und Leistungen erforderlich ist. Eine Verarbeitung personenbezogener
              Daten erfolgt nur mit Ihrer Einwilligung oder wenn die Verarbeitung
              durch eine gesetzliche Vorschrift erlaubt ist.
            </p>
            <p>
              Personenbezogene Daten werden gelöscht oder gesperrt, sobald der Zweck
              der Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten
              dem entgegenstehen.
            </p>
          </section>

          {/* § 3 Bereitstellung der Website */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">3. Bereitstellung der Website und Hosting</h2>
            <p className="mb-3">
              Die Website und die Webanwendung von TerminStop werden über die
              Infrastruktur von <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133,
              Covina, CA 91723, USA, gehostet.
            </p>
            <p className="mb-3">
              Bei jedem Aufruf der Website werden automatisch folgende Daten
              in sogenannten Server-Logfiles erfasst:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>IP-Adresse des anfragenden Geräts</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Aufgerufene URL</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL (zuvor besuchte Seite)</li>
            </ul>
            <p className="mb-3">
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
              Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an einem sicheren und stabilen Betrieb der Website).
            </p>
            <p className="mb-3">
              Da Vercel in den USA ansässig ist, erfolgt eine Übermittlung in ein Drittland.
              Vercel hat EU-Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO
              abgeschlossen. Weitere Informationen:
              {" "}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#18A66D] hover:underline">vercel.com/legal/privacy-policy</a>
            </p>
          </section>

          {/* § 4 Cookies */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">4. Cookies</h2>
            <p className="mb-3">
              Unsere Website verwendet ausschließlich technisch notwendige Cookies.
              Diese Cookies sind erforderlich, um grundlegende Funktionen der Website
              bereitzustellen (z. B. Session-Verwaltung, Authentifizierung).
            </p>
            <p className="mb-3">
              Technisch notwendige Cookies werden auf Basis von Art. 6 Abs. 1 lit. f DSGVO
              gesetzt und erfordern keine gesonderte Einwilligung. Sie werden gelöscht,
              sobald die Sitzung beendet wird oder nach einer angemessenen Zeitspanne.
            </p>
            <p>
              Wir setzen keine Marketing-, Analyse- oder Tracking-Cookies ein.
              Ein Cookie-Banner ist daher nicht erforderlich.
            </p>
          </section>

          {/* § 5 Kontakt- und Anfrage-Formular (Lead) */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">5. Kontakt- und Beratungsanfragen</h2>
            <p className="mb-3">
              Auf unserer Website bieten wir ein Formular zur Anfrage eines kostenlosen
              Beratungsgesprächs an. Bei Nutzung dieses Formulars werden folgende Daten erhoben:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Name</li>
              <li>Telefonnummer</li>
              <li>E-Mail-Adresse</li>
              <li>Unternehmensname (optional)</li>
              <li>Nachricht (optional)</li>
            </ul>
            <p className="mb-3">
              Die Daten werden in unserer Datenbank (Supabase) gespeichert und
              ausschließlich zur Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme genutzt.
              Eine Weitergabe an Dritte findet nicht statt.
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher
              Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
              der Bearbeitung von Anfragen).
            </p>
            <p>
              Die Daten werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet wurde
              und keine weiteren Kontakte mehr zu erwarten sind, spätestens nach 6 Monaten,
              sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          {/* § 6 Nutzerkonto und Dashboard */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">6. Nutzerkonto und Dashboard (B2B-Kunden)</h2>
            <p className="mb-3">
              Für die Nutzung der TerminStop-Plattform erhalten Unternehmenskunden
              einen Zugang zum Dashboard. Dabei werden folgende Daten verarbeitet:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>E-Mail-Adresse (Zugangsdaten)</li>
              <li>Unternehmensname</li>
              <li>Unternehmensspezifische Termindaten (Datum, Uhrzeit, Notizen)</li>
              <li>Namen und Telefonnummern der Terminempfänger des Kunden</li>
            </ul>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
            <p className="mb-3">
              Hinsichtlich der Daten der Terminempfänger (Endkunden des B2B-Kunden)
              handelt TerminStop als Auftragsverarbeiter gemäß Art. 28 DSGVO.
              Verantwortlich für die Rechtmäßigkeit dieser Datenverarbeitung ist der
              jeweilige B2B-Kunde. Einzelheiten regelt der Auftragsverarbeitungsvertrag (AVV).
            </p>
            <p>
              Die Zugangsdaten werden in der Datenbank von Supabase Inc. gespeichert.
              Nach Vertragsbeendigung werden alle Daten innerhalb von 30 Tagen gelöscht.
            </p>
          </section>

          {/* § 7 SMS-Versand */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">7. Automatisierter SMS-Versand</h2>
            <p className="mb-3">
              Der Versand von SMS-Erinnerungen erfolgt über den Dienst
              <strong> Twilio Inc.</strong>, 375 Beale Street, Suite 300,
              San Francisco, CA 94105, USA.
            </p>
            <p className="mb-3">
              Zur Durchführung des SMS-Versands werden folgende Daten an Twilio übermittelt:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Mobilfunknummer des Empfängers</li>
              <li>Inhalt der SMS-Nachricht (Name, Datum, Uhrzeit des Termins)</li>
            </ul>
            <p className="mb-3">
              Da Twilio in den USA ansässig ist, erfolgt eine Datenübermittlung in ein Drittland.
              Die Übermittlung erfolgt auf Basis von EU-Standardvertragsklauseln (SCCs)
              gemäß Art. 46 Abs. 2 lit. c DSGVO. Twilio hat ein Data Processing Agreement (DPA)
              abgeschlossen. Weitere Informationen:
              {" "}<a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#18A66D] hover:underline">twilio.com/legal/privacy</a>
            </p>
            <p>
              Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO
              (Vertragserfüllung gegenüber dem B2B-Kunden) sowie Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse des B2B-Kunden an der Terminerinnerung).
              Die Verantwortung für das Vorliegen einer geeigneten Rechtsgrundlage
              gegenüber den Terminempfängern liegt beim jeweiligen B2B-Kunden.
            </p>
          </section>

          {/* § 8 Datenbank */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">8. Datenbankdienst (Supabase)</h2>
            <p className="mb-3">
              Zur Speicherung und Verwaltung aller Plattformdaten nutzen wir den Dienst
              <strong> Supabase Inc.</strong>, 970 Toa Payoh North, #07-04,
              Singapur 318992 (EU-Serverstandort verfügbar).
            </p>
            <p className="mb-3">
              In der Datenbank werden gespeichert:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Unternehmensdaten der B2B-Kunden</li>
              <li>Termindaten inkl. Kundennamen und Telefonnummern</li>
              <li>Lead-Anfragen (Beratungsformular)</li>
            </ul>
            <p className="mb-3">
              Supabase hat ein Data Processing Agreement (DPA) abgeschlossen.
              Bei Speicherung auf US-Servern erfolgt die Übermittlung auf Basis
              von EU-Standardvertragsklauseln. Weitere Informationen:
              {" "}<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#18A66D] hover:underline">supabase.com/privacy</a>
            </p>
          </section>

          {/* § 9 Zahlungsabwicklung */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">9. Zahlungsabwicklung</h2>
            <p className="mb-3">
              Die Abrechnung der Nutzungsgebühren erfolgt auf Basis individueller
              Vereinbarungen per Dauerauftrag / Überweisung. Es werden keine
              Zahlungsdaten (Kreditkartennummern, Bankdaten) auf unseren Servern
              gespeichert.
            </p>
            <p>
              Bankdaten werden ausschließlich im Rahmen des Zahlungsverkehrs zwischen
              dem Kunden und seiner Bank verarbeitet. TerminStop hat keinen Zugriff
              auf diese Daten.
            </p>
          </section>

          {/* § 10 Aufbewahrungsfristen */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">10. Speicherdauer und Löschung</h2>
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F7FAFC] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Datenkategorie</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Speicherdauer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {[
                    { cat: "Server-Logfiles (Vercel)", dur: "Maximal 30 Tage" },
                    { cat: "Lead-Anfragen (Beratungsformular)", dur: "6 Monate nach letztem Kontakt" },
                    { cat: "Kundendaten (B2B-Account)", dur: "Dauer des Vertrages + 30 Tage nach Kündigung" },
                    { cat: "Termindaten inkl. Endkundendaten", dur: "Dauer des Vertrages + 30 Tage nach Kündigung" },
                    { cat: "Rechnungs- und Vertragsdaten", dur: "10 Jahre (gesetzliche Aufbewahrungspflicht §§ 147 AO, 257 HGB)" },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-4 py-3 text-[#1F2A37]">{row.cat}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.dur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* § 11 Betroffenenrechte */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">11. Ihre Rechte als betroffene Person</h2>
            <p className="mb-3">
              Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer
              personenbezogenen Daten:
            </p>
            <div className="space-y-3">
              {[
                { right: "Auskunft (Art. 15 DSGVO)", desc: "Sie können jederzeit Auskunft über die zu Ihrer Person gespeicherten Daten verlangen." },
                { right: "Berichtigung (Art. 16 DSGVO)", desc: "Sie haben das Recht, unrichtige Daten berichtigen zu lassen." },
                { right: "Löschung (Art. 17 DSGVO)", desc: "Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen." },
                { right: "Einschränkung (Art. 18 DSGVO)", desc: "Sie können unter bestimmten Voraussetzungen die Einschränkung der Verarbeitung verlangen." },
                { right: "Datenübertragbarkeit (Art. 20 DSGVO)", desc: "Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen Format zu erhalten." },
                { right: "Widerspruch (Art. 21 DSGVO)", desc: "Sie können der Verarbeitung Ihrer Daten auf Basis berechtigter Interessen jederzeit widersprechen." },
                { right: "Widerruf (Art. 7 Abs. 3 DSGVO)", desc: "Sofern die Verarbeitung auf einer Einwilligung basiert, können Sie diese jederzeit widerrufen." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3">
                  <div className="w-2 h-2 bg-[#18A66D] rounded-full shrink-0 mt-1.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#1F2A37] mb-0.5">{item.right}</div>
                    <div className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
              {" "}<a href="mailto:terminstopp.business@gmail.com" className="text-[#18A66D] hover:underline">terminstopp.business@gmail.com</a>
            </p>
          </section>

          {/* § 12 Beschwerderecht */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">12. Beschwerderecht bei der Aufsichtsbehörde</h2>
            <p className="mb-3">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            </p>
            <p>
              Die für uns zuständige Aufsichtsbehörde ist die des Bundeslandes,
              in dem der Verantwortliche seinen Wohnsitz hat. Eine Liste aller deutschen
              Aufsichtsbehörden finden Sie unter:
              {" "}<a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" className="text-[#18A66D] hover:underline">bfdi.bund.de</a>
            </p>
          </section>

          {/* § 13 Drittanbieter-Übersicht */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">13. Übersicht der eingesetzten Dienstleister</h2>
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F7FAFC] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Dienst</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Zweck</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Sitz</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Grundlage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {[
                    { name: "Vercel Inc.", purpose: "Hosting", location: "USA", basis: "SCCs" },
                    { name: "Supabase Inc.", purpose: "Datenbank", location: "USA/EU", basis: "DPA + SCCs" },
                    { name: "Twilio Inc.", purpose: "SMS-Versand", location: "USA", basis: "SCCs" },
                    { name: "GitHub Inc.", purpose: "Code-Hosting", location: "USA", basis: "SCCs" },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-4 py-3 font-medium text-[#1F2A37]">{row.name}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.purpose}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.location}</td>
                      <td className="px-4 py-3 text-[#18A66D] font-medium">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#6B7280]">
              SCCs = EU-Standardvertragsklauseln · DPA = Data Processing Agreement
            </p>
          </section>

          {/* § 14 Änderungen */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">14. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen
              der gesetzlichen Lage oder bei Änderungen unserer Dienste anzupassen.
              Die jeweils aktuelle Version ist auf dieser Seite abrufbar.
              Wir empfehlen, diese Seite regelmäßig zu prüfen.
            </p>
          </section>

          {/* Stand */}
          <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Stand: {today}</p>
            <p className="text-xs text-[#9CA3AF]">TerminStop · Marvin Passe</p>
          </div>

        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/impressum" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Impressum</a>
          <a href="/agb" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">AGB</a>
          <a href="/avv" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">AVV</a>
        </div>

      </div>
    </div>
  )
}
