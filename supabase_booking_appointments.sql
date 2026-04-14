-- ============================================================
-- TerminStop: Buchungs-Tabelle für Kundenanfragen
-- Einmalig im Supabase SQL Editor ausführen
-- ============================================================

-- Spalten für Buchungsanfragen in der appointments-Tabelle
-- (falls appointments noch nicht existiert, wird sie hier angelegt)

CREATE TABLE IF NOT EXISTS appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  service_id       uuid REFERENCES services(id) ON DELETE SET NULL,
  customer_name    text NOT NULL,
  customer_phone   text NOT NULL,
  note             text,
  appointment_at   timestamptz NOT NULL,
  status           text NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
  created_at       timestamptz DEFAULT now()
);

-- Falls appointments schon existiert: fehlende Spalten ergänzen
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS service_id     uuid REFERENCES services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_name  text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS note           text,
  ADD COLUMN IF NOT EXISTS appointment_at timestamptz,
  ADD COLUMN IF NOT EXISTS status         text DEFAULT 'pending';

-- RLS aktivieren
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Betrieb darf nur eigene Termine lesen/schreiben
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'company_own_appointments'
  ) THEN
    CREATE POLICY "company_own_appointments" ON appointments
      FOR ALL USING (
        company_id::text = (
          SELECT raw_user_meta_data->>'company_id'
          FROM auth.users WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'public_insert_appointments'
  ) THEN
    CREATE POLICY "public_insert_appointments" ON appointments
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_appointments_company    ON appointments(company_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service    ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_at         ON appointments(appointment_at);

-- ============================================================
-- Fertig! Kunden können jetzt über /book/[slug] Termine
-- anfragen. Der Betrieb sieht sie im Dashboard.
-- ============================================================
