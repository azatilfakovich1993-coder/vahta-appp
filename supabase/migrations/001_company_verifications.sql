-- Таблица верификаций компаний
CREATE TABLE IF NOT EXISTS company_verifications (
  code         TEXT PRIMARY KEY,
  company_name TEXT,
  payment_id   TEXT,
  verified     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  verified_at  TIMESTAMPTZ
);

ALTER TABLE company_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_all"   ON company_verifications FOR SELECT USING (true);
CREATE POLICY "insert_all" ON company_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "update_all" ON company_verifications FOR UPDATE USING (true);
