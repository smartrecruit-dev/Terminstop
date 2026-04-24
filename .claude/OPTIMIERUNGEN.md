# TerminStop — Optimierungsliste (Marvin, 23. April 2026)

## Status: [ ] = offen, [x] = erledigt

---

[x] 1. **Dashboard kein Scrollen** — Buchungsseite-Karte nicht sichtbar beim Runterscrollen. Dashboard soll nur Terminpflege zeigen, keine weiteren Sektionen darunter.

[x] 2. **Einstellungen: Keine Emojis** — Tabs mit vernünftigen Zeichen statt Emojis. Alles kleiner und geordneter. Einblicke-Feld bleibt.

[x] 3. **IP-Rate-Limiting Buchungsformular** — Max. 2 Buchungen pro IP alle 6 Stunden. Vernünftige Emojis (Datenschutz etc.) sind ok, sonst clean halten.

[x] 4. **Datenschutz-Frage klären** — Willigt der Kunde automatisch ein wenn er über das Online-Tool bucht? Rechtliche Einschätzung + ggf. Checkbox einbauen.

[x] 5. **Sicherheit vollständig prüfen** — Alles durchleuchten: API-Routes, RLS, Auth, Rate-Limiting, Input-Sanitization.

[x] 6. **SMS-Limit: Was passiert wenn überschritten?** — Werden SMS automatisch geblockt? Was sieht der Betrieb? Verhalten dokumentieren und ggf. fixen.

[x] 7. **Landingpage Emojis raus** — Emoji ohne/mit TerminStop entfernen. Geschenk-Emoji beim Add-on raus. Alle störenden Emojis entfernen.

[x] 8. **Rechtstexte anpassen und einfügen** — AGB, Datenschutz, Impressum prüfen und auf den aktuellen Stand bringen.

[x] 9. **Onboarding für neue Kunden** — Nach der Registrierung einen geführten Onboarding-Flow zeigen.

[x] 10. **Admin-Tool: Kunden pausieren/stoppen/löschen** — Sofortiges Pausieren, Stoppen oder Löschen ohne Datenverlust. Für Sicherheitsfälle.

[x] 11. **Stripe-Kündigung → Zugang sperren** — Wenn Kunde über Stripe kündigt, muss Zugang automatisch gesperrt/pausiert werden.

[x] 12. **Live-Demo anpassen** — Demo-Seiten auf aktuellen Programmstand bringen. Buchungsseiten-Demo ebenfalls.

[x] 13. **Logo ändern** — Vercel-Dreieck-Favicon durch TerminStop-Logo ersetzen.

[x] 14. **"Jetzt testen" raus auf Demo** — Da man sich direkt registrieren kann. Wo landen Registrierungsdaten? Marvin braucht Zugriff darauf.

[x] 15. **E-Mail + Passwort von Kunden ändern** — Admin-Tool zum Ändern ohne Datenverlust.

[x] 16. **Buchungstool stoppen bei SMS-Limit** — Wenn Limit erreicht: Kunden können nicht buchen, zeige Seite "Bitte direkt an den Betrieb wenden".

---

## Reihenfolge (empfohlen)
Zuerst die sicherheitsrelevanten und funktionskritischen Punkte:
5 → 3 → 6 → 16 → 11 → 10 → 14 → dann UX/Design: 1 → 2 → 7 → dann rechtlich: 4 → 8 → dann Rest: 9 → 12 → 13 → 15
