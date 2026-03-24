export default function AGB() {
  return (
    <div className="min-h-screen bg-white text-black px-10 py-20 max-w-3xl mx-auto">

      <h1 className="text-3xl font-semibold mb-10">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Geltungsbereich</h2>
      <p className="mb-4">
        Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Software „TerminStop“
        durch Unternehmen (B2B).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Leistungsbeschreibung</h2>
      <p className="mb-4">
        TerminStop ist eine Softwarelösung zur Terminverwaltung und zum Versand automatisierter
        SMS-Erinnerungen.
      </p>

      <p className="mb-4">
        Der Anbieter stellt die Software online zur Verfügung. Ein Anspruch auf bestimmte Funktionen
        besteht nicht.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Vertragsschluss</h2>
      <p className="mb-4">
        Der Vertrag kommt zustande, sobald der Kunde sich registriert und die Nutzung beginnt
        oder eine Vereinbarung getroffen wird.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Preise und Zahlung</h2>
      <p className="mb-4">
        Die Nutzung erfolgt im Rahmen eines monatlichen Abonnements.
      </p>

      <p className="mb-4">
        Alle Preise verstehen sich als Nettopreise. Aufgrund der Kleinunternehmerregelung gemäß § 19 UStG
        wird keine Umsatzsteuer ausgewiesen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Pflichten des Kunden</h2>
      <ul className="mb-4 list-disc pl-6 text-black/60">
        <li>Der Kunde stellt sicher, dass er berechtigt ist, SMS zu versenden</li>
        <li>Der Kunde holt erforderliche Einwilligungen ein</li>
        <li>Der Kunde nutzt das System nicht für Spam oder rechtswidrige Inhalte</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Verfügbarkeit</h2>
      <p className="mb-4">
        Der Anbieter bemüht sich um eine hohe Verfügbarkeit der Software, garantiert jedoch keine
        unterbrechungsfreie Nutzung.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Haftung</h2>
      <p className="mb-4">
        Der Anbieter haftet nur für Vorsatz und grobe Fahrlässigkeit.
      </p>

      <p className="mb-4">
        Für entgangenen Gewinn oder indirekte Schäden wird keine Haftung übernommen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">8. Datenverarbeitung</h2>
      <p className="mb-4">
        Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">9. Vertragslaufzeit und Kündigung</h2>
      <p className="mb-4">
        Der Vertrag läuft auf unbestimmte Zeit und kann monatlich gekündigt werden.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">10. Änderungen</h2>
      <p className="mb-4">
        Der Anbieter behält sich vor, diese AGB jederzeit anzupassen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">11. Schlussbestimmungen</h2>
      <p className="mb-4">
        Es gilt das Recht der Bundesrepublik Deutschland.
      </p>

      <p className="text-sm text-black/50 mt-10">
        Stand: {new Date().toLocaleDateString()}
      </p>

    </div>
  )
}