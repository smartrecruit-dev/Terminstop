-- TerminStop: SMS monthly tracking column
-- Run once in Supabase SQL Editor

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS sms_month integer DEFAULT 0;
