-- ============================================================
-- TerminStop: Online-Buchung + Services
-- Einmalig im Supabase SQL Editor ausführen
-- ============================================================

-- 1. Slug-Spalte in companies (eindeutige URL pro Betrieb)
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS slug        text UNIQUE,
  ADD COLUMN IF NOT EXISTS booking_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS booking_note   text;

-- 2. Services-Tabelle (Dienstleistungen pro Betrieb)
CREATE TABLE IF NOT EXISTS services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        text NOT NULL,
  duration    integer NOT NULL DEFAULT 30,  -- Minuten
  price       numeric(8,2),                  -- optional, z.B. 25.00
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 3. RLS für services aktivieren
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Betrieb darf nur eigene Services lesen/schreiben
CREATE POLICY "company_own_services" ON services
  FOR ALL USING (
    company_id = (
      SELECT id FROM companies
      WHERE id = company_id
        AND id::text = (SELECT raw_user_meta_data->>'company_id'
                        FROM auth.users WHERE id = auth.uid())
    )
  );

-- Öffentlicher Lesezugriff auf aktive Services (für Buchungsseite)
CREATE POLICY "public_read_active_services" ON services
  FOR SELECT USING (active = true);

-- 4. Index für schnelle Slug-Suche
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_services_company ON services(company_id);

-- ============================================================
-- NACH dem Ausführen: Für jeden bestehenden Kunden einen
-- Slug setzen im Table Editor (companies → slug-Spalte).
-- Beispiel: "friseur-mueller-neustadt", "autostudio-conrad"
-- Nur Kleinbuchstaben, Bindestriche, keine Sonderzeichen.
-- ============================================================
