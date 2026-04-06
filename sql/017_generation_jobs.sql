-- Table generation_jobs : suivi de la génération hebdomadaire par client
-- Chaque ligne = 1 semaine de contenus pour 1 client
CREATE TABLE IF NOT EXISTS generation_jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL, -- format "2026-W14" (année + numéro de semaine ISO)
  week_number INTEGER NOT NULL, -- 1, 2, 3, 4 dans le cycle mensuel (1 = première semaine du mois)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  deliverable_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,
  UNIQUE(client_id, week_key)
);

CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs (status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_pending ON generation_jobs (status, next_retry_at) WHERE status IN ('pending', 'failed');

-- Ajouter colonne week_key aux deliverables pour tracer la semaine d'origine
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS week_key TEXT;
