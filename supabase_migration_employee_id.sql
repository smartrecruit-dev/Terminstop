-- TerminStop: employee_id Spalte in appointments
-- Run once in Supabase SQL Editor

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS employee_id uuid
  REFERENCES employees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS appointments_employee_idx ON appointments(employee_id);
