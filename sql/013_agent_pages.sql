-- Migration 013 : table agent_pages (landing pages mandataires)
-- Idempotent : utilise IF NOT EXISTS

CREATE TABLE IF NOT EXISTS agent_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id TEXT NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'frozen')),
  indexation BOOLEAN NOT NULL DEFAULT FALSE,
  bio_generee TEXT,
  edition_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_pages_slug ON agent_pages(slug);
CREATE INDEX IF NOT EXISTS idx_agent_pages_client ON agent_pages(client_id);
