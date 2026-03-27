-- Migration : Corrections post-audit QA session 6
-- Corrige les divergences entre le code et le schema SQL
-- Idempotent : utilise IF NOT EXISTS et ADD COLUMN IF NOT EXISTS

-- 1. Table leads (utilisee par api/leads/route.ts mais jamais creee)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT NOT NULL,
  name TEXT,
  city TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_unique ON leads (email);

-- 2. Colonnes manquantes sur payments
-- Le code (webhooks/stripe) insere stripe_session_id et stripe_customer_id
-- mais la migration 001 definissait stripe_payment_intent_id et stripe_invoice_id
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- 3. Colonne updated_at sur clients
-- Utilisee par monthly-update/route.ts et enrich-property/route.ts
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Index sur clients.stripe_customer_id
-- 3 UPDATE dans webhooks/stripe filtrent sur cette colonne sans index
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer_id ON clients (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
