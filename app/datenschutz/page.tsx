export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-white text-black px-10 py-20 max-w-3xl mx-auto">

      <h1 className="text-3xl font-semibold mb-10">Datenschutzerklärung</h1>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Allgemeine Hinweise</h2>
      <p className="mb-4">
        Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen.
        Wir verarbeiten Ihre Daten ausschließlich im Rahmen der gesetzlichen Vorschriften
        (Datenschutz-Grundverordnung – DSGVO).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Verantwortlicher</h2>
      <p className="mb-4">
        Marvin Passe<br />
        TerminStop<br />
        Niedersachsen, Deutschland<br />
        E-Mail: terminstop.business@gmail.com<br />
        Telefon: 0151 54219634
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Art der verarbeiteten Daten</h2>
      <ul className="mb-4 list-disc pl-6 text-black/60">
        <li>Kontaktdaten (z. B. Telefonnummern)</li>
        <li>Terminbezogene Daten (Datum, Uhrzeit)</li>
        <li>Unternehmensdaten</li>
        <li>Technische Zugriffsdaten (Server-Logs)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Zweck der Verarbeitung</h2>
      <p className="mb-4">
        Die Verarbeitung erfolgt zur Bereitstellung unserer Softwarelösung zur
        Terminverwaltung und zum Versand automatisierter SMS-Erinnerungen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Rechtsgrundlagen</h2>
      <p className="mb-4">
        Die Verarbeitung erfolgt auf Grundlage von:
      </p>
      <ul className="mb-4 list-disc pl-6 text-black/60">
        <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
        <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Hosting & Infrastruktur</h2>
      <p className="mb-4">
        Unsere Anwendung wird über externe Anbieter betrieben:
      </p>
      <ul className="mb-4 list-disc pl-6 text-black/60">
        <li>Vercel (Hosting)</li>
        <li>Supabase (Datenbank)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. SMS-Versand (Twilio)</h2>
      <p className="mb-4">
        Für den Versand von SMS nutzen wir den Dienstleister Twilio Inc. (USA).
        Dabei können personenbezogene Daten (z. B. Telefonnummern) in die USA übertragen werden.
      </p>

      <p className="mb-4">
        Die Übermittlung erfolgt auf Grundlage geeigneter Garantien gemäß Art. 46 DSGVO.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">8. Verantwortung der Nutzer</h2>
      <p className="mb-4">
        Unsere Kunden (Unternehmen) sind selbst dafür verantwortlich, die Einwilligung
        ihrer Endkunden zur Kontaktaufnahme per SMS einzuholen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">9. Speicherdauer</h2>
      <p className="mb-4">
        Daten werden nur so lange gespeichert, wie dies zur Erfüllung der jeweiligen Zwecke notwendig ist.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">10. Ihre Rechte</h2>
      <p className="mb-4">
        Sie haben jederzeit das Recht auf:
      </p>
      <ul className="mb-4 list-disc pl-6 text-black/60">
        <li>Auskunft</li>
        <li>Berichtigung</li>
        <li>Löschung</li>
        <li>Einschränkung der Verarbeitung</li>
        <li>Datenübertragbarkeit</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">11. Widerspruchsrecht</h2>
      <p className="mb-4">
        Sie können der Verarbeitung Ihrer Daten jederzeit widersprechen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">12. Sicherheit</h2>
      <p className="mb-4">
        Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen.
      </p>

      <p className="text-sm text-black/50 mt-10">
        Stand: {new Date().toLocaleDateString()}
      </p>

    </div>
  )
}