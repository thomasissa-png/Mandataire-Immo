-- Migration 011 : table email_logs pour le suivi des emails nurturing
-- Idempotent : utilise IF NOT EXISTS

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id TEXT NOT NULL REFERENCES clients(id),
  email_type TEXT NOT NULL,  -- 'nurturing_j2', 'nurturing_j7', 'nurturing_j14', 'welcome', etc.
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent',  -- 'sent', 'failed', 'skipped'
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_email_logs_client_type ON email_logs (client_id, email_type);
