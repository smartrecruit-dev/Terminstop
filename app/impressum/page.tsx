export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #F0F0F0", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#18A66D" }}>Termin</span>
          <span style={{ color: "#0B0D14" }}>Stop</span>
        </a>
        <a href="/" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}>← Zurück</a>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#18A66D", marginBottom: 16 }}>Rechtliches</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: "#0B0D14", letterSpacing: "-1px", marginBottom: 8 }}>Impressum</h1>
          <p style={{ color: "#9CA3AF", fontSize: 14 }}>Angaben gemäß § 5 TMG</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

          <Section title="Anbieter">
            <p>TerminStop</p>
            <p>Marvin Passe</p>
            <p>Hinterm Stieberge 16</p>
            <p>31535 Neustadt am Rübenberge</p>
            <p>Deutschland</p>
          </Section>

          <Section title="Kontakt">
            <p>E-Mail: <a href="mailto:terminstop.business@gmail.com" style={{ color: "#18A66D" }}>terminstop.business@gmail.com</a></p>
          </Section>

          <Section title="Umsatzsteuer">
            <p>
              Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt">
            <p>Marvin Passe</p>
            <p>Hinterm Stieberge 16</p>
          </Section>

          <Section title="Streitschlichtung">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: "#18A66D" }}>
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p style={{ marginTop: 12 }}>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

          <Section title="Haftung für Inhalte">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </Section>

          <Section title="Haftung für Links">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </Section>

          <Section title="Urheberrecht">
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </Section>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #F0F0F0", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>© {new Date().getFullYear()} TerminStop</span>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Datenschutz", "/datenschutz"], ["AGB", "/agb"], ["AVV", "/avv"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}>{label}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#6B7280", marginBottom: 12, borderBottom: "1px solid #F0F0F0", paddingBottom: 10 }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 2 }}>
        {children}
      </div>
    </div>
  )
}
