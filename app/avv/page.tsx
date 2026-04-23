export default function AVV() {
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
          <h1 className="text-3xl font-bold text-[#1F2A37] mb-3">
            Auftragsverarbeitungsvertrag (AVV)
          </h1>
          <p className="text-[#6B7280] text-sm">
            Gemäß Art. 28 DSGVO · Stand: {today}
          </p>
        </div>

        {/* Intro Box */}
        <div className="bg-[#E8FBF3] border border-[#6EE7B7]/50 rounded-2xl px-6 py-5 mb-8">
          <div className="text-sm text-[#1F2A37] leading-relaxed">
            Dieser Auftragsverarbeitungsvertrag (AVV) wird zwischen dem Kunden (nachfolgend
            „Verantwortlicher") und TerminStop / Marvin Passe (nachfolgend „Auftragsverarbeiter")
            als Bestandteil der Hauptvereinbarung (AGB) geschlossen. Er regelt die Verarbeitung
            personenbezogener Daten gemäß Art. 28 der EU-Datenschutz-Grundverordnung (DSGVO).
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10 shadow-sm space-y-10 text-sm leading-relaxed text-[#374151]">

          {/* Parteien */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-4">Vertragsparteien</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4">
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Verantwortlicher</div>
                <div className="text-sm text-[#1F2A37]">
                  Das jeweilige Unternehmen, das TerminStop nutzt und personenbezogene Daten
                  seiner Kunden (Terminempfänger) in die Plattform einträgt.
                </div>
              </div>
              <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4">
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Auftragsverarbeiter</div>
                <div className="text-sm text-[#1F2A37]">
                  <strong>Marvin Passe</strong><br />
                  Hinterm Stieberge 16, 31535 Neustadt am Rübenberge<br />
                  E-Mail: terminstop.business@gmail.com<br />
                  Tel.: 0151 54219634
                </div>
              </div>
            </div>
          </section>

          {/* Art. 1 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 1 – Gegenstand und Dauer der Verarbeitung</h2>
            <p className="mb-3">
              Der Auftragsverarbeiter verarbeitet personenbezogene Daten im Auftrag und nach
              Weisung des Verantwortlichen im Rahmen der Nutzung der SaaS-Plattform TerminStop.
            </p>
            <p className="mb-3">
              Die Verarbeitung erfolgt für die Dauer des bestehenden Nutzungsvertrages (AGB).
              Nach Beendigung des Vertrages werden alle personenbezogenen Daten des
              Verantwortlichen innerhalb von 30 Tagen gelöscht oder – auf schriftlichen Wunsch –
              zurückgegeben, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          {/* Art. 2 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 2 – Art und Zweck der Verarbeitung</h2>
            <p className="mb-3">Die Verarbeitung umfasst folgende Tätigkeiten:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Speicherung von Namen und Telefonnummern der Terminempfänger</li>
              <li>Speicherung von Termindaten (Datum, Uhrzeit, Notizen)</li>
              <li>Automatisierter Versand von SMS-Erinnerungen an Terminempfänger</li>
              <li>Verwaltung und Anzeige von Terminstatus (offen / erledigt)</li>
              <li>
                Bei aktiviertem Online-Buchungs-Add-on: Entgegennahme und Speicherung
                von Buchungsanfragen, die Endkunden über die öffentliche Buchungsseite
                einreichen (Name, Telefonnummer, Dienstleistungswunsch, Anfragetext);
                Anzeige dieser Anfragen im Dashboard des Verantwortlichen; Versand einer
                Bestätigungs-SMS nach manueller Freigabe durch den Verantwortlichen
              </li>
            </ul>
            <p className="mb-3">
              Der Zweck der Verarbeitung ist die technische Bereitstellung und der Betrieb der
              Terminverwaltungs- und SMS-Erinnerungsplattform TerminStop.
            </p>
            <p>
              Eine Verarbeitung der Daten zu anderen Zwecken – insbesondere für eigene
              Marketingzwecke des Auftragsverarbeiters – findet nicht statt.
            </p>
          </section>

          {/* Art. 3 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 3 – Art der personenbezogenen Daten und Kategorien betroffener Personen</h2>

            <p className="mb-2 font-medium text-[#1F2A37]">Betroffene Personen:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4 text-[#4B5563]">
              <li>Kunden / Patienten / Terminempfänger des Verantwortlichen</li>
            </ul>

            <p className="mb-2 font-medium text-[#1F2A37]">Kategorien personenbezogener Daten:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4 text-[#4B5563]">
              <li>Name (Vor- und/oder Nachname)</li>
              <li>Mobilfunknummer</li>
              <li>Termindaten (Datum, Uhrzeit)</li>
              <li>Freitextnotizen zum Termin (optional, durch Verantwortlichen eingetragen)</li>
              <li>
                Bei Online-Buchungs-Add-on zusätzlich: Buchungsanfragen von Endkunden
                (Name, Telefonnummer, gewünschte Dienstleistung, Anfragetext) –
                eingereicht über die öffentliche Buchungsseite des Verantwortlichen
              </li>
            </ul>

            <p className="mb-3">
              Der Verantwortliche ist dafür verantwortlich, dass keine besonderen Kategorien
              personenbezogener Daten gemäß Art. 9 DSGVO (z. B. Gesundheitsdaten, biometrische
              Daten) in das System eingetragen werden, sofern nicht ausdrücklich schriftlich
              vereinbart.
            </p>
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-3 text-xs text-[#92400E]">
              <strong>Hinweis für Arztpraxen, Therapeuten und ähnliche Berufsgruppen:</strong> Wenn
              aus dem Terminkontext Rückschlüsse auf den Gesundheitszustand von Patienten möglich
              sind (z. B. Fachrichtung der Praxis), handelt es sich um besondere Kategorien gemäß
              Art. 9 DSGVO. In diesem Fall ist vorab eine gesonderte schriftliche Vereinbarung
              mit dem Auftragsverarbeiter erforderlich.
            </div>
          </section>

          {/* Art. 4 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 4 – Pflichten des Auftragsverarbeiters</h2>
            <p className="mb-3">Der Auftragsverarbeiter verpflichtet sich:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3 text-[#4B5563]">
              <li>
                personenbezogene Daten ausschließlich auf Weisung des Verantwortlichen zu verarbeiten,
                es sei denn, eine rechtliche Verpflichtung schreibt eine andere Verarbeitung vor;
              </li>
              <li>
                sicherzustellen, dass alle Personen, die Zugang zu den Daten haben, zur
                Vertraulichkeit verpflichtet sind;
              </li>
              <li>
                geeignete technische und organisatorische Maßnahmen (TOM) gemäß Art. 32 DSGVO
                zu implementieren und aufrechtzuerhalten;
              </li>
              <li>
                den Verantwortlichen unverzüglich zu informieren, wenn eine Weisung nach
                Auffassung des Auftragsverarbeiters gegen DSGVO oder andere Datenschutzvorschriften
                verstößt;
              </li>
              <li>
                den Verantwortlichen bei der Erfüllung seiner Pflichten (z. B. Betroffenenanfragen,
                Datenschutz-Folgenabschätzung) im zumutbaren Rahmen zu unterstützen;
              </li>
              <li>
                nach Wahl des Verantwortlichen nach Beendigung der Verarbeitung alle
                personenbezogenen Daten zu löschen oder zurückzugeben;
              </li>
              <li>
                dem Verantwortlichen alle erforderlichen Informationen zum Nachweis der
                Einhaltung der Pflichten nach Art. 28 DSGVO zur Verfügung zu stellen.
              </li>
            </ul>
          </section>

          {/* Art. 5 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 5 – Technische und organisatorische Maßnahmen (TOM)</h2>
            <p className="mb-3">
              Der Auftragsverarbeiter trifft folgende Maßnahmen zur Datensicherheit
              gemäß Art. 32 DSGVO:
            </p>

            <div className="space-y-3">
              {[
                { title: "Zutrittskontrolle", desc: "Serverinfrastruktur wird durch Supabase und Vercel in gesicherten Rechenzentren betrieben. Physischer Zugang ist ausgeschlossen." },
                { title: "Zugangskontrolle", desc: "Zugang zur Plattform nur mit Benutzername und Passwort. Passwörter werden nicht im Klartext gespeichert." },
                { title: "Zugriffskontrolle", desc: "Jeder Betrieb hat ausschließlich Zugriff auf seine eigenen Daten (Mandantentrennung durch company_id)." },
                { title: "Weitergabekontrolle", desc: "Alle Datenübertragungen erfolgen verschlüsselt über HTTPS/TLS. SMS-Versand über seven.io mit verschlüsselter API-Kommunikation." },
                { title: "Eingabekontrolle", desc: "Zugang zur Datenbank (Supabase) ist auf autorisierte Dienste beschränkt. Direkte Datenbankzugriffe von außen sind nicht möglich." },
               { title: "Auftragskontrolle", desc: "Verarbeitung durch Unterauftragsverarbeiter nur im Rahmen der dokumentierten Vereinbarungen (seven.io, Supabase, Vercel)." },
                { title: "Verfügbarkeitskontrolle", desc: "Regelmäßige automatische Datensicherungen durch Supabase. Monitoring der Systemverfügbarkeit." },
                { title: "Trennungsgebot", desc: "Daten verschiedener Kunden werden durch eindeutige Unternehmens-IDs (company_id) konsequent getrennt verarbeitet." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3">
                  <div className="w-2 h-2 bg-[#18A66D] rounded-full shrink-0 mt-1.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#1F2A37] mb-0.5">{item.title}</div>
                    <div className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Art. 6 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 6 – Unterauftragsverarbeiter</h2>
            <p className="mb-4">
              Der Auftragsverarbeiter setzt folgende Unterauftragsverarbeiter ein, denen
              der Verantwortliche mit Abschluss dieses AVV zustimmt:
            </p>

            <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F7FAFC] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Anbieter</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Zweck</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1F2A37]">Sitz / Transfer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {[
                    { name: "Supabase Inc.", purpose: "Datenbankdienst, Authentifizierung", location: "USA · SCCs" },
                    { name: "Vercel Inc.", purpose: "Hosting, Webanwendung", location: "USA · SCCs" },
                    { name: "seven communications GmbH & Co. KG", purpose: "SMS-Versand", location: "Deutschland · DSGVO (EU)" },
                    { name: "Stripe Payments Europe, Ltd.", purpose: "Zahlungsabwicklung", location: "Irland · DSGVO (EU)" },
                    { name: "Resend Inc.", purpose: "Transaktionale E-Mails", location: "USA · SCCs" },
                    { name: "GitHub Inc.", purpose: "Code-Hosting, Versionsverwaltung", location: "USA · SCCs" },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white hover:bg-[#FAFAFA] transition">
                      <td className="px-4 py-3 font-medium text-[#1F2A37]">{row.name}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.purpose}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-[#6B7280]">
              SCCs = EU-Standardvertragsklauseln gemäß Durchführungsbeschluss (EU) 2021/914.
              Alle genannten Anbieter haben entsprechende Datenschutzvereinbarungen (DPA) abgeschlossen.
            </p>
            <p className="mt-3">
              Der Auftragsverarbeiter informiert den Verantwortlichen rechtzeitig über beabsichtigte
              Änderungen hinsichtlich der Hinzuziehung oder des Austauschs von Unterauftragsverarbeitern.
              Der Verantwortliche hat das Recht, berechtigte Einwände zu erheben.
            </p>
          </section>

          {/* Art. 7 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 7 – Pflichten des Verantwortlichen</h2>
            <p className="mb-3">Der Verantwortliche ist verpflichtet:</p>
            <ul className="list-disc pl-6 space-y-2 text-[#4B5563]">
              <li>
                sicherzustellen, dass er die Daten der betroffenen Personen (Terminempfänger)
                nur auf einer gültigen Rechtsgrundlage gemäß Art. 6 DSGVO in die Plattform einträgt;
              </li>
              <li>
                seine eigenen Kunden / Patienten über die Verarbeitung ihrer Daten
                (insbesondere den SMS-Versand) in seiner Datenschutzerklärung zu informieren;
              </li>
              <li>
                bei Nutzung des Online-Buchungs-Add-ons sicherzustellen, dass Endkunden,
                die über die öffentliche Buchungsseite Anfragen stellen, vor der Übermittlung
                ihrer Daten über die Datenverarbeitung informiert werden (z. B. durch einen
                Datenschutzhinweis auf der Buchungsseite oder in den eigenen Geschäftsbedingungen);
              </li>
              <li>
                Anfragen betroffener Personen (Auskunft, Löschung etc.) unverzüglich
                an den Auftragsverarbeiter weiterzuleiten, soweit der Auftragsverarbeiter
                für die Umsetzung zuständig ist;
              </li>
              <li>
                den Auftragsverarbeiter unverzüglich zu informieren, wenn er
                Unregelmäßigkeiten in der Datenverarbeitung feststellt;
              </li>
              <li>
                keine besonderen Kategorien personenbezogener Daten (Art. 9 DSGVO)
                ohne gesonderte Vereinbarung in das System einzutragen.
              </li>
            </ul>
          </section>

          {/* Art. 8 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 8 – Datenpannen und Meldepflichten</h2>
            <p className="mb-3">
              Der Auftragsverarbeiter informiert den Verantwortlichen unverzüglich,
              spätestens jedoch innerhalb von 48 Stunden, sobald ihm eine Verletzung
              des Schutzes personenbezogener Daten (Datenpanne) bekannt wird, die
              Daten des Verantwortlichen betrifft.
            </p>
            <p className="mb-3">
              Die Meldung enthält mindestens:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>eine Beschreibung der Art der Datenpanne;</li>
              <li>die Kategorien und die ungefähre Zahl der betroffenen Personen;</li>
              <li>die wahrscheinlichen Folgen der Verletzung;</li>
              <li>die ergriffenen oder vorgeschlagenen Abhilfemaßnahmen.</li>
            </ul>
            <p>
              Der Verantwortliche ist für die Meldung an die zuständige Aufsichtsbehörde
              gemäß Art. 33 DSGVO sowie ggf. die Benachrichtigung der betroffenen Personen
              gemäß Art. 34 DSGVO verantwortlich.
            </p>
          </section>

          {/* Art. 9 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 9 – Weisungsrecht</h2>
            <p className="mb-3">
              Der Verantwortliche kann dem Auftragsverarbeiter jederzeit Weisungen
              hinsichtlich der Verarbeitung personenbezogener Daten erteilen.
              Weisungen können schriftlich oder in Textform (E-Mail) erteilt werden.
            </p>
            <p>
              Der Auftragsverarbeiter setzt Weisungen im Rahmen des technisch und
              betrieblich Möglichen um. Ist der Auftragsverarbeiter der Ansicht, dass eine
              Weisung gegen geltendes Datenschutzrecht verstößt, informiert er den
              Verantwortlichen unverzüglich. In diesem Fall ist der Auftragsverarbeiter
              berechtigt, die Ausführung der Weisung bis zur Klärung auszusetzen.
            </p>
          </section>

          {/* Art. 10 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">Art. 10 – Schlussbestimmungen</h2>
            <p className="mb-3">
              Dieser AVV ist Bestandteil der zwischen den Parteien geschlossenen Hauptvereinbarung
              (AGB). Im Widerspruchsfall geht dieser AVV den AGB in datenschutzrechtlichen
              Fragen vor.
            </p>
            <p className="mb-3">
              Es gilt das Recht der Bundesrepublik Deutschland.
              Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Auftragsverarbeiters.
            </p>
            <p>
              Änderungen dieses AVV bedürfen der Textform. Mündliche Nebenabreden
              bestehen nicht.
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
          <a href="/datenschutz" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Datenschutzerklärung</a>
          <a href="/agb" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">AGB</a>
        </div>

      </div>
    </div>
  )
}
