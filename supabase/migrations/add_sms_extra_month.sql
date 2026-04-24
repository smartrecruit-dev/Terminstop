-- Migration: Extra-SMS-Kontingent pro Monat
-- Einmalig in Supabase SQL-Editor ausführen

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS sms_extra_month integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN companies.sms_extra_month IS
  'Dazugekaufte Extra-SMS für den laufenden Monat. Wird beim Monatsreset auf 0 gesetzt.';
