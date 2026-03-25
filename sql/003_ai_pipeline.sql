-- Migration : Support du pipeline IA (Phase 6)
-- A executer sur la base PostgreSQL Replit
-- Idempotent : utilise IF NOT EXISTS et ADD COLUMN IF NOT EXISTS

-- 1. Ajouter client_context JSONB a la table clients (si absent)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_context JSONB;

-- 2. Ajouter les colonnes manquantes a la table deliverables
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 3. Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_deliverables_client_id ON deliverables (client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_client_email_status ON deliverables (client_email, status);
CREATE INDEX IF NOT EXISTS idx_deliverables_month ON deliverables (month);

-- 4. Index unique sur clerk_user_id pour l'UPSERT onboarding
-- (necessaire pour ON CONFLICT (clerk_user_id))
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_clerk_user_id ON clients (clerk_user_id)
  WHERE clerk_user_id IS NOT NULL;
