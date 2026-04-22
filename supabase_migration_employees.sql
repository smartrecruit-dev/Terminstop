-- TerminStop: Mitarbeiter-Tabelle
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS employees (
  id         uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid    REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name       text    NOT NULL,
  active     boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Inhaber kann nur eigene Mitarbeiter sehen/bearbeiten
CREATE POLICY "employees_own_company"
  ON employees FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Index für schnelle company-Abfragen
CREATE INDEX IF NOT EXISTS employees_company_idx ON employees(company_id);
