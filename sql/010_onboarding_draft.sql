-- ============================================================================
-- 010_onboarding_draft.sql
-- Ajoute les colonnes de brouillon d'onboarding sur la table clients.
-- Permet a Sophie de fermer l'onglet et reprendre son onboarding plus tard.
-- Idempotent : peut etre relance N fois.
-- ============================================================================

ALTER TABLE clients ADD COLUMN IF NOT EXISTS onboarding_draft JSONB DEFAULT NULL;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS onboarding_draft_step INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS onboarding_draft_updated_at TIMESTAMPTZ;
