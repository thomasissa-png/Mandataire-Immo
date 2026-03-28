-- ============================================================================
-- 009_photo_upload.sql
-- Ajouts pour la feature "Upload photos + Annonces complètes"
-- Idempotent — peut être relancé N fois.
-- ============================================================================

-- Colonne pour tracker la date de génération d'annonce
ALTER TABLE property_pages ADD COLUMN IF NOT EXISTS annonce_generated_at TIMESTAMPTZ;

-- Index composite pour les requêtes dashboard Sophie (liste des biens par client + filtre status)
CREATE INDEX IF NOT EXISTS idx_property_pages_client_status ON property_pages (client_id, status);
