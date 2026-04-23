-- ── IP-Rate-Limiting für das öffentliche Buchungsformular ──────────────────
-- Max. 2 Buchungen pro IP-Hash pro Betrieb alle 6 Stunden.
-- Die IP-Adresse wird gehasht (SHA-256) gespeichert, keine Klardaten.
-- Diese Tabelle wird von der Next.js API-Route /api/book genutzt.

CREATE TABLE IF NOT EXISTS ip_bookings (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash    text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index für schnelle Abfragen beim Rate-Limit-Check
CREATE INDEX IF NOT EXISTS ip_bookings_lookup_idx ON ip_bookings(ip_hash, company_id, created_at);

-- Alte Einträge automatisch löschen (älter als 24 Stunden) - wird von Postgres natively nicht unterstützt,
-- daher löschen wir alte Einträge bei der nächsten Prüfung in der API.
-- Optional: pg_cron einrichten wenn gewünscht.

-- RLS: Diese Tabelle wird nur vom Service-Role-Key zugegriffen (server-side),
-- daher keine RLS-Policy notwendig. Service-Role bypassed RLS anyway.
-- Zur Sicherheit dennoch RLS aktivieren und keine öffentlichen Policies erlauben:
ALTER TABLE ip_bookings ENABLE ROW LEVEL SECURITY;
-- Keine Policies = niemand außer Service Role kann zugreifen.
