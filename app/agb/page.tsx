export default function AGB() {
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
          <h1 className="text-3xl font-bold text-[#1F2A37] mb-3">Allgemeine Geschäftsbedingungen (AGB)</h1>
          <p className="text-[#6B7280] text-sm">
            Nutzungsbedingungen für die SaaS-Plattform TerminStop · Stand: {today}
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10 shadow-sm space-y-10 text-sm leading-relaxed text-[#374151]">

          {/* § 1 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 1 Geltungsbereich und Vertragsparteien</h2>
            <p className="mb-3">
              Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge zwischen
            </p>
            <div className="bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-5 py-4 mb-3 text-[#1F2A37]">
              <strong>Marvin Passe</strong>, Hinterm Stieberge 16, 31535 Neustadt am Rübenberge, Deutschland<br />
              E-Mail: terminstop.business@gmail.com · Tel.: 0151 54219634<br />
              (nachfolgend „Anbieter")
            </div>
            <p className="mb-3">
              und Unternehmen, Gewerbetreibenden oder Selbstständigen (nachfolgend „Kunde"), die die
              Software „TerminStop" nutzen. Ein Vertragsschluss mit Verbrauchern im Sinne des § 13 BGB
              ist ausgeschlossen.
            </p>
            <p className="mb-3">
              Entgegenstehende oder abweichende Bedingungen des Kunden werden nicht anerkannt,
              es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
            <p>
              Diese AGB gelten auch für alle zukünftigen Geschäfte mit dem Kunden, soweit es sich
              um Rechtsgeschäfte verwandter Art handelt.
            </p>
          </section>

          {/* § 2 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 2 Leistungsbeschreibung</h2>
            <p className="mb-3">
              TerminStop ist eine webbasierte Software-as-a-Service-Lösung (SaaS) zur
              digitalen Verwaltung von Terminen, Kundendaten und Geschäftsprozessen für
              kleine Dienstleistungsbetriebe. Die Plattform umfasst insbesondere:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Erfassung und Verwaltung von Termindaten sowie Kalenderansicht (Tages- und Wochenansicht)</li>
              <li>Kundenkartei (Verwaltung von Kundenstammdaten und Terminhistorie)</li>
              <li>Automatischer Versand von SMS-Erinnerungen über den Dienstleister seven.io</li>
              <li>Dashboard zur Übersicht und Verwaltung von Terminen</li>
              <li>Auswertungen und Einblicke zur Terminentwicklung</li>
            </ul>
            <p className="mb-3">
  Der Anbieter erbringt die Leistungen über die technische Infrastruktur von
  Supabase Inc. (Datenbankdienst), Vercel Inc. (Hosting) sowie seven communications
  GmbH & Co. KG (SMS-Versand). Der Kunde nimmt zur Kenntnis, dass die Verfügbarkeit
  der Plattform auch von diesen Drittanbietern abhängt.
</p>

            <p className="mb-3">
              Ein Anspruch auf bestimmte Funktionen, Erweiterungen oder eine spezifische
              Systemarchitektur besteht nicht. Der Anbieter ist berechtigt, den Funktionsumfang
              weiterzuentwickeln, zu verändern oder einzuschränken, sofern dies dem Kunden
              zumutbar ist.
            </p>
            <p>
              Die Plattform richtet sich ausschließlich an gewerbliche Kunden (B2B). Eine Nutzung
              für private Zwecke ist nicht gestattet.
            </p>
          </section>

          {/* § 3 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 3 Vertragsschluss und Registrierung</h2>
            <p className="mb-3">
              Der Vertrag kommt durch eines der folgenden Ereignisse zustande:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>Registrierung des Kunden auf der Plattform und erstmalige Nutzung, oder</li>
              <li>schriftliche oder elektronische Vereinbarung zwischen Anbieter und Kunde</li>
            </ul>
            <p className="mb-3">
              Mit der Registrierung bestätigt der Kunde, dass er unternehmerisch tätig ist und
              diese AGB gelesen und akzeptiert hat. Der Kunde ist verpflichtet, bei der
              Registrierung wahrheitsgemäße Angaben zu machen.
            </p>
            <p className="mb-3">
              Der Anbieter ist berechtigt, eine Registrierung ohne Angabe von Gründen abzulehnen
              oder einen bestehenden Account bei schwerwiegendem Missbrauch zu sperren.
            </p>
            <p>
              Der Kunde ist verantwortlich für die Sicherheit seiner Zugangsdaten und hat den
              Anbieter unverzüglich zu informieren, wenn ein Missbrauch seines Accounts bekannt wird.
            </p>
          </section>

          {/* § 4 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 4 Preise, Abrechnung und Zahlung</h2>
            <p className="mb-3">
              Die Nutzung von TerminStop erfolgt gegen ein monatliches Entgelt gemäß der zum
              Zeitpunkt des Vertragsschlusses gültigen Preisliste. Die aktuellen Preise werden
              dem Kunden vor Vertragsschluss kommuniziert.
            </p>
            <p className="mb-3">
              Alle Preise verstehen sich als Nettopreise in Euro. Da der Anbieter die
              Kleinunternehmerregelung gemäß § 19 UStG in Anspruch nimmt, wird keine
              Umsatzsteuer ausgewiesen und erhoben.
            </p>
            <p className="mb-3">
              Die Rechnungsstellung erfolgt monatlich im Voraus. Zahlungen sind innerhalb
              von 14 Tagen nach Rechnungsstellung fällig. Bei Zahlungsverzug ist der
              Anbieter berechtigt, den Zugang zur Plattform zu sperren, bis der ausstehende
              Betrag beglichen ist.
            </p>
            <p className="mb-3">
              Der Anbieter behält sich vor, Preise mit einer Ankündigungsfrist von mindestens
              30 Tagen anzupassen. Widerspricht der Kunde der Preisanpassung nicht innerhalb
              von 14 Tagen nach Ankündigung, gilt die Anpassung als akzeptiert. Im Fall des
              Widerspruchs ist der Kunde berechtigt, den Vertrag zum Ende des laufenden
              Abrechnungszeitraums zu kündigen.
            </p>
            <p>
              Kosten, die durch den SMS-Versand über seven.io entstehen, können je nach
              Volumen und Zielland variieren und sind, sofern nicht ausdrücklich im Preis
              enthalten, gesondert zu entrichten.
            </p>
            <p className="mb-3">
  Die Zahlung erfolgt per Dauerauftrag des Kunden. Der Kunde verpflichtet sich,
  einen Dauerauftrag über den vereinbarten Monatsbetrag einzurichten, der jeweils
  zum 1. eines Kalendermonats auf das Konto des Anbieters überwiesen wird.
  Die Bankverbindung des Anbieters wird dem Kunden gesondert mitgeteilt.
</p>

          </section>

          {/* § 5 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 5 Pflichten und Verantwortung des Kunden</h2>
            <p className="mb-3">Der Kunde ist verpflichtet:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3 text-[#4B5563]">
              <li>
                sicherzustellen, dass er gegenüber den Empfängern der SMS-Erinnerungen
                die erforderliche rechtliche Grundlage (z. B. Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO
                oder berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO) besitzt;
              </li>
              <li>
                die Empfänger der SMS über die Verarbeitung ihrer Daten zu informieren
                und ggf. deren Einwilligung einzuholen, bevor Telefonnummern in das System
                eingetragen werden;
              </li>
              <li>
                das System ausschließlich für geschäftliche Terminverwaltung und
                zugehörige Erinnerungen zu nutzen und keine Spam-Nachrichten, Werbebotschaften
                ohne Rechtsgrundlage oder anderweitig rechtswidrige Inhalte zu versenden;
              </li>
              <li>
                keine sensiblen personenbezogenen Daten (z. B. Gesundheitsdaten nach Art. 9 DSGVO)
                in das System einzutragen, sofern keine ausdrückliche schriftliche Genehmigung
                des Anbieters vorliegt;
              </li>
              <li>
                Zugangsdaten geheim zu halten und unbefugten Dritten keinen Zugang zu gewähren;
              </li>
              <li>
                den Anbieter unverzüglich zu informieren, wenn der Verdacht besteht, dass
                Zugangsdaten in unbefugte Hände gelangt sind.
              </li>
            </ul>
            <p>
              Der Kunde stellt den Anbieter von sämtlichen Ansprüchen Dritter frei, die aus
              einer rechtswidrigen Nutzung der Plattform durch den Kunden entstehen, einschließlich
              angemessener Kosten der Rechtsverteidigung.
            </p>
          </section>

          {/* § 6 */}
          <section>
  <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 6 SMS-Versand und Drittanbieter</h2>
  <p className="mb-3">
    Der SMS-Versand erfolgt über seven communications GmbH & Co. KG, Willestr. 4-6,
    24103 Kiel, Deutschland (seven.io). Seven.io ist ein deutsches Unternehmen mit
    Serverstandort in Deutschland – eine Datenübermittlung in Drittländer findet
    nicht statt.
  </p>
  <p className="mb-3">
    Der Anbieter übernimmt keine Gewährleistung für die Zustellung einzelner
    SMS-Nachrichten. Faktoren wie Netzprobleme, blockierte Nummern oder
    Entscheidungen des Empfängers können die Zustellung beeinflussen.
  </p>
  <p className="mb-3">
    Automatisierte Erinnerungsprozesse werden über zeitgesteuerte Aufgaben
    (Cron-Jobs) ausgeführt. Der Anbieter ist bemüht, diese zuverlässig zu betreiben,
    übernimmt jedoch keine Garantie für die minutengenaue Ausführung.
  </p>
  <p>
    Der Kunde ist verpflichtet, beim Eintragen von Telefonnummern das korrekte
    Format (internationales Format, z. B. +49...) zu verwenden, um eine
    ordnungsgemäße Zustellung zu ermöglichen.
  </p>
</section>


          {/* § 7 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 7 Verfügbarkeit und Wartung</h2>
            <p className="mb-3">
              Der Anbieter strebt eine Verfügbarkeit der Plattform von mindestens 95 %
              im monatlichen Durchschnitt an. Hiervon ausgenommen sind geplante Wartungsarbeiten
              sowie Ausfälle, die durch Drittanbieter (Supabase, Vercel, seven.io) verursacht werden.
            </p>
            <p className="mb-3">
              Geplante Wartungsarbeiten werden dem Kunden, soweit möglich, mindestens
              24 Stunden im Voraus angekündigt.
            </p>
            <p>
              Ein Anspruch auf Minderung oder Schadensersatz wegen vorübergehender
              Nichtverfügbarkeit besteht nur im Rahmen der gesetzlichen Regelungen und
              der Haftungsbestimmungen dieser AGB.
            </p>
          </section>

          {/* § 8 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 8 Haftung und Haftungsbeschränkung</h2>
            <p className="mb-3">
              Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens,
              des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz oder grober
              Fahrlässigkeit beruhen.
            </p>
            <p className="mb-3">
              Bei leichter Fahrlässigkeit haftet der Anbieter nur, soweit eine wesentliche
              Vertragspflicht (Kardinalpflicht) verletzt wurde. In diesem Fall ist die Haftung
              auf den vertragstypisch vorhersehbaren Schaden begrenzt.
            </p>
            <p className="mb-3">
              Eine weitergehende Haftung des Anbieters ist ausgeschlossen. Insbesondere haftet
              der Anbieter nicht für:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>entgangenen Gewinn oder mittelbare Schäden des Kunden;</li>
              <li>Schäden durch nicht zugestellte SMS-Nachrichten;</li>
              <li>Schäden infolge von Ausfällen oder Fehlern der Drittanbieter (Supabase, Vercel, seven.io);</li>
              <li>
                Schäden, die dadurch entstehen, dass der Kunde keine rechtmäßige Grundlage
                für den SMS-Versand vorweisen kann;
              </li>
              <li>Datenverluste, sofern der Kunde keine eigene Datensicherung vorgenommen hat.</li>
            </ul>
            <p>
              Die vorstehenden Haftungsbeschränkungen gelten auch zugunsten der Erfüllungs-
              und Verrichtungsgehilfen des Anbieters.
            </p>
          </section>

          {/* § 9 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 9 Datenschutz und Auftragsverarbeitung</h2>
            <p className="mb-3">
              Der Anbieter verarbeitet personenbezogene Daten ausschließlich gemäß der
              geltenden Datenschutzgesetze, insbesondere der DSGVO und des BDSG.
              Einzelheiten ergeben sich aus der Datenschutzerklärung des Anbieters.
            </p>
            <p className="mb-3">
              Soweit der Kunde personenbezogene Daten Dritter (insbesondere seiner eigenen
              Kunden) in die Plattform einträgt, handelt der Anbieter als Auftragsverarbeiter
              gemäß Art. 28 DSGVO. Der Abschluss eines Auftragsverarbeitungsvertrages (AVV)
              ist in diesem Fall gesetzlich vorgeschrieben und wird gesondert vereinbart.
            </p>
            <p className="mb-3">
              Der Kunde ist in diesem Verhältnis Verantwortlicher im Sinne des Art. 4 Nr. 7 DSGVO
              und trägt die Verantwortung dafür, dass die Verarbeitung der Daten seiner Kunden
              auf einer geeigneten Rechtsgrundlage basiert.
            </p>
            <p>
              Der Anbieter setzt folgende Unterauftragsverarbeiter ein:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-[#4B5563]">
              <li>Supabase Inc., USA – Datenbankdienst und Authentifizierung</li>
              <li>Vercel Inc., USA – Hosting und Bereitstellung der Webanwendung</li>
              <li>seven communications GmbH & Co. KG, Deutschland – SMS-Versand</li>
              <li>GitHub Inc., USA – Versionsverwaltung und Code-Hosting</li>
            </ul>
          </section>

          {/* § 10 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 10 Vertragslaufzeit und Kündigung</h2>
            <p className="mb-3">
              Der Vertrag wird auf unbestimmte Zeit geschlossen und ist von beiden Seiten
              mit einer Frist von 30 Tagen zum Ende eines Kalendermonats kündbar.
            </p>
            <p className="mb-3">
              Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
              Ein wichtiger Grund liegt insbesondere vor, wenn:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3 text-[#4B5563]">
              <li>der Kunde trotz Mahnung mit zwei Monatsbeiträgen in Zahlungsverzug ist;</li>
              <li>der Kunde gegen wesentliche Pflichten dieser AGB verstößt;</li>
              <li>der Kunde die Plattform für rechtswidrige Zwecke nutzt.</li>
            </ul>
            <p className="mb-3">
              Kündigungen bedürfen der Textform (E-Mail genügt) an:
              terminstop.business@gmail.com
            </p>
            <p>
              Nach Vertragsende werden die Daten des Kunden innerhalb von 30 Tagen
              gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              Der Kunde ist dafür verantwortlich, vor Vertragsende eigene Datensicherungen
              vorzunehmen.
            </p>
          </section>

          {/* § 11 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 11 Nutzungsrechte und geistiges Eigentum</h2>
            <p className="mb-3">
              Der Anbieter räumt dem Kunden für die Dauer des Vertragsverhältnisses ein
              nicht-exklusives, nicht übertragbares Recht zur Nutzung der Plattform ein.
            </p>
            <p className="mb-3">
              Alle Rechte an der Software, dem Quellcode, dem Design und den Inhalten der
              Plattform verbleiben beim Anbieter. Eine Vervielfältigung, Weitergabe,
              Bearbeitung oder sonstige Verwertung ist ohne ausdrückliche Genehmigung
              nicht gestattet.
            </p>
            <p>
              Der Kunde räumt dem Anbieter das Recht ein, die vom Kunden eingetragenen
              Daten zum Zweck der Vertragserfüllung zu verarbeiten und zu speichern.
            </p>
          </section>

          {/* § 12 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 12 Änderungen der AGB</h2>
            <p className="mb-3">
              Der Anbieter ist berechtigt, diese AGB mit einer Ankündigungsfrist von mindestens
              30 Tagen zu ändern. Die Ankündigung erfolgt per E-Mail an die vom Kunden
              hinterlegte Adresse.
            </p>
            <p className="mb-3">
              Widerspricht der Kunde der Änderung nicht innerhalb von 14 Tagen nach
              Zugang der Ankündigung, gelten die neuen AGB als akzeptiert. Auf dieses
              Widerspruchsrecht und die Folgen des Schweigens wird der Anbieter in der
              Ankündigung ausdrücklich hinweisen.
            </p>
            <p>
              Im Fall des Widerspruchs ist der Kunde berechtigt, den Vertrag zum Zeitpunkt
              des Inkrafttretens der neuen AGB zu kündigen.
            </p>
          </section>

          {/* § 13 */}
          <section>
            <h2 className="text-base font-bold text-[#1F2A37] mb-3">§ 13 Schlussbestimmungen</h2>
            <p className="mb-3">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
              UN-Kaufrechts (CISG).
            </p>
            <p className="mb-3">
              Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem
              Vertrag ist, sofern der Kunde Kaufmann, juristische Person des öffentlichen
              Rechts oder öffentlich-rechtliches Sondervermögen ist, der Sitz des Anbieters.
            </p>
            <p className="mb-3">
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein
              oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
              Die unwirksame Bestimmung ist durch eine wirksame zu ersetzen, die dem
              wirtschaftlichen Zweck der unwirksamen Bestimmung möglichst nahekommt.
            </p>
            <p>
              Nebenabreden, Änderungen und Ergänzungen bedürfen der Textform.
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
          <a href="/impressum" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Impressum</a>
          <a href="/datenschutz" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Datenschutzerklärung</a>
          <a href="/avv" className="text-xs text-[#6B7280] hover:text-[#18A66D] transition border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg">Auftragsverarbeitungsvertrag</a>
        </div>

      </div>
    </div>
  )
}
