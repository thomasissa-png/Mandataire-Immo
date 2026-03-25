-- ============================================
-- MIGRATION 002 — Systeme de versioning des prompts
-- A executer dans Replit PostgreSQL
--
-- Objectif : chaque image generee est associee a une version
-- de prompt, permettant a Yann et Lucas d'auditer les images
-- en sachant exactement quel prompt a ete utilise.
-- ============================================

-- Extension pour les UUID (si pas deja active)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: prompt_versions
-- Historique versionne de tous les prompts de generation d'images
-- ============================================
CREATE TABLE IF NOT EXISTS prompt_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identification du prompt
  prompt_type TEXT NOT NULL,           -- photo_annonce, visuel_post, cover_article, etc.
  version_number INTEGER NOT NULL,     -- v1, v2, v3... auto-incrementee par type
  prompt_text TEXT NOT NULL,           -- Le prompt complet
  prompt_hash TEXT NOT NULL,           -- SHA-256 tronque a 16 chars — detecte les changements

  -- Metadata
  changelog TEXT,                      -- "Ajout angle exterieur", "Correction ton trop corporate"
  created_by TEXT,                     -- Email de qui a modifie le prompt
  is_active BOOLEAN DEFAULT TRUE,      -- Un seul actif par type a la fois

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompt_versions_type ON prompt_versions(prompt_type);
CREATE INDEX idx_prompt_versions_active ON prompt_versions(prompt_type, is_active);
CREATE INDEX idx_prompt_versions_hash ON prompt_versions(prompt_hash);

-- Contrainte : un seul prompt actif par type
-- (geree au niveau applicatif pour plus de flexibilite,
--  mais on peut aussi utiliser un index partiel unique)
CREATE UNIQUE INDEX idx_prompt_versions_unique_active
  ON prompt_versions(prompt_type)
  WHERE is_active = true;

-- ============================================
-- TABLE: generated_images
-- Chaque image generee avec son lien vers la version du prompt
-- ============================================
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Liens
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  prompt_version_id UUID NOT NULL REFERENCES prompt_versions(id) ON DELETE RESTRICT,

  -- Image
  storage_path TEXT NOT NULL,          -- Chemin dans Replit Object Storage
  status TEXT DEFAULT 'generated',     -- generated, delivered, archived

  -- Audit par Yann et Lucas
  audit_status TEXT,                   -- NULL (non audite), approved, rejected, needs_revision
  audit_notes TEXT,                    -- "Couleurs trop saturees", "Angle pas realiste"
  audited_by TEXT,                     -- Email de l'auditeur (yann@..., lucas@...)
  audited_at TIMESTAMPTZ,             -- Date de l'audit

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_images_client ON generated_images(client_id);
CREATE INDEX idx_generated_images_prompt_version ON generated_images(prompt_version_id);
CREATE INDEX idx_generated_images_audit ON generated_images(audit_status);
CREATE INDEX idx_generated_images_pending_audit ON generated_images(audit_status)
  WHERE audit_status IS NULL;

-- ============================================
-- Trigger updated_at (pas necessaire ici car pas de updated_at,
-- mais on ajoute un commentaire pour la coherence)
-- ============================================

COMMENT ON TABLE prompt_versions IS 'Historique versionne des prompts de generation d images. Chaque type de prompt a une seule version active a la fois.';
COMMENT ON TABLE generated_images IS 'Images generees avec lien vers la version du prompt utilisee. Permet l audit par Yann et Lucas.';
COMMENT ON COLUMN generated_images.prompt_version_id IS 'RESTRICT on delete — on ne peut pas supprimer une version de prompt si des images y sont associees.';
