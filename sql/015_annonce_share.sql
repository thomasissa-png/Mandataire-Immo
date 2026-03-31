-- ============================================================================
-- 015_annonce_share.sql
-- Ajoute un token de partage public sur les deliverables (annonces).
-- Permet de generer un lien public /annonce/[token] sans authentification.
-- Idempotent — peut etre relance N fois.
-- ============================================================================

ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS share_token TEXT;

-- Index unique pour lookup rapide par token
CREATE UNIQUE INDEX IF NOT EXISTS idx_deliverables_share_token
  ON deliverables (share_token)
  WHERE share_token IS NOT NULL;
