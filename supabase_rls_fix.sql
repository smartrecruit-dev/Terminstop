-- ============================================================
-- TerminStop: RLS-Fix + Rate-Limiting
-- Im Supabase SQL Editor ausführen
-- ============================================================

-- ── 1. COMPANIES: Öffentlicher Lesezugriff für Buchungsseite ──
-- Ohne das findet /book/[slug] den Betrieb nie.

DROP POLICY IF EXISTS "public_read_company_for_booking" ON companies;
CREATE POLICY "public_read_company_for_booking" ON companies
  FOR SELECT USING (true);
-- Hinweis: Schreiben ist weiterhin nur für authentifizierte Nutzer möglich.


-- ── 2. SERVICES: Kaputte Policy durch korrekte ersetzen ──

DROP POLICY IF EXISTS "company_own_services" ON services;

-- Betrieb darf nur eigene Services lesen/schreiben (anhand auth.uid)
CREATE POLICY "company_own_services" ON services
  FOR ALL USING (
    company_id::text = (
      SELECT raw_user_meta_data->>'company_id'
      FROM auth.users
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id::text = (
      SELECT raw_user_meta_data->>'company_id'
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Öffentlicher Lesezugriff auf aktive Services bleibt (für Buchungsseite)
DROP POLICY IF EXISTS "public_read_active_services" ON services;
CREATE POLICY "public_read_active_services" ON services
  FOR SELECT USING (active = true);


-- ── 3. APPOINTMENTS: Öffentliches Einfügen mit Rate-Limiting ──

DROP POLICY IF EXISTS "public_insert_appointments" ON appointments;
DROP POLICY IF EXISTS "company_own_appointments" ON appointments;

-- Betrieb sieht nur eigene Termine
CREATE POLICY "company_own_appointments" ON appointments
  FOR ALL USING (
    company_id::text = (
      SELECT raw_user_meta_data->>'company_id'
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- Kunden dürfen Termine eintragen (öffentlich)
CREATE POLICY "public_insert_appointments" ON appointments
  FOR INSERT WITH CHECK (true);


-- ── 4. RATE-LIMITING TRIGGER ──
-- Max. 3 Buchungsanfragen pro Telefonnummer pro 24 Stunden.
-- Verhindert Spam und Missbrauch serverseitig.

CREATE OR REPLACE FUNCTION check_booking_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count integer;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM appointments
  WHERE customer_phone = NEW.customer_phone
    AND company_id     = NEW.company_id
    AND created_at     > NOW() - INTERVAL '24 hours';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'RATE_LIMIT: Zu viele Buchungsanfragen. Bitte in 24 Stunden erneut versuchen.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_booking_rate_limit ON appointments;
CREATE TRIGGER trg_booking_rate_limit
  BEFORE INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION check_booking_rate_limit();


-- ── 5. SICHERSTELLEN: user_metadata enthält company_id ──
-- (Nur zur Info – das muss beim Anlegen eines Nutzers gesetzt werden)
-- UPDATE auth.users SET raw_user_meta_data = jsonb_set(
--   raw_user_meta_data, '{company_id}', '"<COMPANY_UUID>"'
-- ) WHERE email = 'kunde@beispiel.de';

-- ============================================================
-- Fertig! Jetzt funktionieren:
-- ✓ Buchungsseite (/book/[slug]) ist öffentlich erreichbar
-- ✓ Leistungen können gespeichert werden
-- ✓ Rate-Limit: max. 3 Anfragen pro Telefon pro 24h
-- ============================================================
