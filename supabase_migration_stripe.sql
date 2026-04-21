-- TerminStop V2: Stripe-Spalten für companies-Tabelle
-- Einmalig in Supabase SQL-Editor ausführen

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS plan                   text DEFAULT 'trial';
