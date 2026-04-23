# TerminStop — Nächste Session (Dashboard + E-Mail)

Stand: 21. April 2026

---

## Was als nächstes kommt

### 1. Dashboard-Upgrade (Priorität hoch)
Das bestehende Dashboard soll deutlich attraktiver und nützlicher für den Kunden werden.
Ziel: Jeder der sich einloggt soll das Gefühl haben, echten Mehrwert zu sehen.

Ideen / Richtung:
- Bessere KPI-Cards mit echten Insights (z.B. Trend-Pfeile, Vergleich Vormonat)
- "Heute"-Übersicht prominenter — nächster Termin groß hervorgehoben
- Schnell-Aktionen (Termin hinzufügen, SMS manuell senden)
- Motivations-Element: "Diese Woche X SMS gesendet, X € Umsatz gesichert"
- Leere Zustände verbessern (wenn noch keine Daten da sind → Onboarding-Hinweise)
- Mobile-First Optimierung (die meisten Betriebe schauen auf dem Handy)
- Buchungsanfragen-Bereich im Dashboard (Online-Buchungen die auf Bestätigung warten)

### 2. E-Mail-Vorlagen im Dashboard (Priorität mittel)
Kunden sollen ihre eigenen E-Mail-Vorlagen oder zumindest den SMS-Text anpassen können.

Konkret:
- Einstellungsseite: SMS-Text-Vorlage editierbar machen (Platzhalter wie {name}, {datum}, {uhrzeit}, {betrieb})
- Vorschau der SMS wie sie beim Kunden ankommt
- Transaktionale E-Mails (Resend) — Vorlagen die TerminStop intern verschickt:
  - Willkommens-E-Mail (bereits gebaut, eventuell anpassen)
  - Zahlungsbestätigung (bereits gebaut)
  - Abo-Erinnerung (noch nicht gebaut)
  - Passwort-Reset (noch nicht gebaut)

---

## Aktueller Technischer Stand

- **Stripe**: Vollständig eingerichtet (Test-Modus), Webhooks laufen
- **Resend**: Domain terminstop.de verifiziert, API-Key gesetzt, Basis-E-Mails senden
- **Supabase**: Alle Tabellen up to date (incl. sms_month column)
- **Registrierung**: GESPERRT via NEXT_PUBLIC_REGISTRATION_OPEN (default = gesperrt)
- **Demo-Seiten**: /demo und /demo/buchung — öffentlich, vollständig korrekt (kein 229€ mehr)
- **Landingpage**: Buchungsseite als inklusive in allen Paketen kommuniziert, Testimonials auf 3, Stats auf 50+

## Offene Todos
- Dashboard verbessern (s.o.)
- E-Mail-Vorlagen/SMS-Vorlage editierbar machen
- End-to-End Test vor dem Launch
- HEAD.lock Problem: Manchmal blockiert git-Prozess — aus Terminal manuell löschen mit:
  `rm ~/termin-stop/.git/HEAD.lock`
