-- Migration initiale : creation des tables de base
-- A executer sur la base PostgreSQL Replit AVANT les migrations 003+
-- Idempotent : utilise IF NOT EXISTS

-- 1. Table clients (coeur du systeme)
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  password_hash TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  clerk_user_id TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  pack TEXT,
  status TEXT DEFAULT 'pending',
  client_context JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table deliverables (livrables generes par le pipeline IA)
CREATE TABLE IF NOT EXISTS deliverables (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  client_email TEXT,
  type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending',
  month TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table payments (historique des paiements Stripe)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  pack TEXT,
  status TEXT DEFAULT 'succeeded',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Index essentiels
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email_unique ON clients (email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_clerk_user_id ON clients (clerk_user_id) WHERE clerk_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deliverables_client_id ON deliverables (client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_client_email_status ON deliverables (client_email, status);
CREATE INDEX IF NOT EXISTS idx_deliverables_month ON deliverables (month);
-- Ajouter email a payments si absent (tables existantes peuvent ne pas l'avoir)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS email TEXT;
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments (email);

-- 5. Table verification_tokens (NextAuth magic links)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 6. Table password_reset_tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens (token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);
