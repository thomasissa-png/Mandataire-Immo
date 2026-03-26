-- Migration : Pages bien avec visuels, texte enrichi et donnees DVF/DPE
-- A executer sur la base PostgreSQL Replit
-- Idempotent : utilise IF NOT EXISTS

-- 1. Table principale des biens publies (pages /bien/[id])
CREATE TABLE IF NOT EXISTS property_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_id TEXT NOT NULL,
  client_email TEXT NOT NULL,

  -- Informations du bien
  titre TEXT NOT NULL,
  type_bien TEXT NOT NULL,                    -- "appartement", "maison", "studio", etc.
  adresse TEXT NOT NULL,
  prix INTEGER NOT NULL,                       -- en euros
  surface INTEGER NOT NULL,                    -- en m2
  pieces INTEGER NOT NULL,
  points_forts TEXT,
  description_detaillee TEXT,

  -- Geocoding (API Adresse gouv)
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  city TEXT,
  postcode TEXT,

  -- DVF / DPE
  dvf_prix_m2_moyen INTEGER,                  -- prix moyen au m2 du quartier
  dvf_transactions JSONB DEFAULT '[]',         -- dernieres transactions DVF
  dpe_classe TEXT,                             -- A, B, C, D, E, F, G
  dpe_ges_classe TEXT,                         -- classe GES
  dpe_valeur_energie DOUBLE PRECISION,         -- kWh/m2/an
  dpe_valeur_ges DOUBLE PRECISION,             -- kgCO2/m2/an

  -- Annonces generees
  annonce_longue TEXT,                         -- version storytelling complete (600-900 mots)
  annonce_courte TEXT,                         -- version portail (max 1500 caracteres, SeLoger)
  titre_annonce TEXT,                          -- titre accrocheur
  accroche_courte TEXT,                        -- 150 caracteres max

  -- Visuels home staging
  photos_originales JSONB DEFAULT '[]',        -- array de {key, url, piece, ordre}
  photos_staging JSONB DEFAULT '[]',           -- array de {key, url, piece, style, photo_originale_key, ordre}

  -- Contact mandataire
  email_contact TEXT,
  telephone_contact TEXT,
  nom_mandataire TEXT,

  -- Statut et dates
  status TEXT NOT NULL DEFAULT 'draft',        -- draft, published, archived
  slug TEXT,                                   -- slug SEO (genere depuis titre + ville)
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_property_pages_client_id ON property_pages (client_id);
CREATE INDEX IF NOT EXISTS idx_property_pages_status ON property_pages (status);
CREATE INDEX IF NOT EXISTS idx_property_pages_slug ON property_pages (slug);
CREATE INDEX IF NOT EXISTS idx_property_pages_city ON property_pages (city);
CREATE INDEX IF NOT EXISTS idx_property_pages_created_at ON property_pages (created_at DESC);

-- 3. Index unique sur slug pour les URLs publiques
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_pages_slug_unique ON property_pages (slug)
  WHERE slug IS NOT NULL;
