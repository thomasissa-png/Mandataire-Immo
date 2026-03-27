-- ============================================================================
-- 008_definitive_fix.sql
-- Script de convergence DEFINITIF — idempotent, peut etre relance N fois.
-- Cree TOUTES les tables, TOUTES les colonnes, TOUS les index.
-- Ne depend d'aucune migration precedente.
--
-- Usage : copier-coller ce script dans la console SQL PostgreSQL (Replit)
-- ou executer : psql $DATABASE_URL < sql/008_definitive_fix.sql
-- ============================================================================

-- ============================================================================
-- TABLE 1 : clients
-- Utilisee par TOUT le systeme : auth, onboarding, dashboard, admin, webhooks
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  password_hash TEXT,                    -- auth.ts:64, sign-up/route.ts:71, setup-admin/route.ts:54
  email_verified BOOLEAN DEFAULT FALSE,  -- auth.ts:64, sign-up/route.ts:71
  clerk_user_id TEXT,                    -- legacy Clerk, conserve pour historique (admin/clients/[id]/page.tsx:19)
  stripe_customer_id TEXT,               -- webhooks/stripe/route.ts:52, portal/route.ts:33
  stripe_subscription_id TEXT,           -- webhooks/stripe/route.ts:52
  pack TEXT,                             -- webhooks/stripe/route.ts:52, dashboard/page.tsx:76
  status TEXT DEFAULT 'pending',         -- webhooks/stripe/route.ts:52,139,155,195
  client_context JSONB,                  -- onboarding/route.ts:138, monthly-update/route.ts:41,146
  paid_at TIMESTAMPTZ,                   -- webhooks/stripe/route.ts:52
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()   -- enrich-property/route.ts:53, monthly-update/route.ts:148
);

-- TOUTES les colonnes en ALTER — couvre le cas ou la table existe avec un schema partiel
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS pack TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_context JSONB;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Index clients
-- UNIQUE partiel sur email — requis pour ON CONFLICT (email) WHERE email IS NOT NULL
-- Utilise par : onboarding/route.ts:141, webhooks/stripe/route.ts:54
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email_unique ON clients (email) WHERE email IS NOT NULL;

-- UNIQUE partiel sur clerk_user_id (legacy, conserve)
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_clerk_user_id ON clients (clerk_user_id) WHERE clerk_user_id IS NOT NULL;

-- Index sur stripe_customer_id — requis pour les 3 UPDATE dans webhooks/stripe
-- (customer.subscription.updated:139, invoice.payment_failed:155, customer.subscription.deleted:195)
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer_id ON clients (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;


-- ============================================================================
-- TABLE 2 : deliverables
-- Livrables generes par le pipeline IA
-- Utilisee par : pack-lancement, pack-mensuel, boost-mandat, dashboard, admin
-- ============================================================================
CREATE TABLE IF NOT EXISTS deliverables (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id TEXT,                        -- boost-mandat/route.ts:249, pack-mensuel/route.ts:289
  client_email TEXT,                     -- idem
  type TEXT NOT NULL,                    -- idem
  title TEXT,                            -- idem
  content TEXT,                          -- idem
  status TEXT DEFAULT 'pending',         -- idem
  month TEXT,                            -- idem
  metadata JSONB DEFAULT '{}',           -- idem
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colonnes ajoutees progressivement — TOUTES les colonnes, pas juste les incrementales
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS month TEXT;
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE deliverables ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Index deliverables
CREATE INDEX IF NOT EXISTS idx_deliverables_client_id ON deliverables (client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_client_email_status ON deliverables (client_email, status);
CREATE INDEX IF NOT EXISTS idx_deliverables_month ON deliverables (month);


-- ============================================================================
-- TABLE 3 : payments
-- Historique des paiements Stripe
-- Utilisee par : webhooks/stripe/route.ts:71-84,118-131,162-175
--                admin/clients/[id]/page.tsx:59
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT,                            -- webhooks/stripe/route.ts:72
  stripe_payment_intent_id TEXT,         -- legacy, conserve
  stripe_invoice_id TEXT,                -- legacy, conserve
  stripe_session_id TEXT,                -- webhooks/stripe/route.ts:72 (session.id)
  stripe_customer_id TEXT,               -- webhooks/stripe/route.ts:73 (session.customer)
  amount INTEGER NOT NULL DEFAULT 0,     -- webhooks/stripe/route.ts:78
  currency TEXT DEFAULT 'eur',           -- webhooks/stripe/route.ts:80
  pack TEXT,                             -- webhooks/stripe/route.ts:81
  status TEXT DEFAULT 'succeeded',       -- webhooks/stripe/route.ts:82
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOUTES les colonnes en ALTER — couvre le cas ou la table existe avec un schema partiel
ALTER TABLE payments ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS pack TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'succeeded';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Index payments
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments (email);


-- ============================================================================
-- TABLE 4 : property_pages
-- Pages de biens publies (parcours /bien/[id])
-- Utilisee par : bien/[id]/page.tsx:17, home-staging/route.ts:71,156
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_id TEXT NOT NULL,
  client_email TEXT NOT NULL,

  -- Informations du bien
  titre TEXT NOT NULL,
  type_bien TEXT NOT NULL,
  adresse TEXT NOT NULL,
  prix INTEGER NOT NULL,
  surface INTEGER NOT NULL,
  pieces INTEGER NOT NULL,
  points_forts TEXT,
  description_detaillee TEXT,

  -- Geocoding
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  city TEXT,
  postcode TEXT,

  -- DVF / DPE
  dvf_prix_m2_moyen INTEGER,
  dvf_transactions JSONB DEFAULT '[]',
  dpe_classe TEXT,
  dpe_ges_classe TEXT,
  dpe_valeur_energie DOUBLE PRECISION,
  dpe_valeur_ges DOUBLE PRECISION,

  -- Annonces generees
  annonce_longue TEXT,
  annonce_courte TEXT,
  titre_annonce TEXT,
  accroche_courte TEXT,

  -- Visuels home staging
  photos_originales JSONB DEFAULT '[]',
  photos_staging JSONB DEFAULT '[]',

  -- Contact mandataire
  email_contact TEXT,
  telephone_contact TEXT,
  nom_mandataire TEXT,

  -- Statut et dates
  status TEXT NOT NULL DEFAULT 'draft',
  slug TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index property_pages
CREATE INDEX IF NOT EXISTS idx_property_pages_client_id ON property_pages (client_id);
CREATE INDEX IF NOT EXISTS idx_property_pages_status ON property_pages (status);
CREATE INDEX IF NOT EXISTS idx_property_pages_slug ON property_pages (slug);
CREATE INDEX IF NOT EXISTS idx_property_pages_city ON property_pages (city);
CREATE INDEX IF NOT EXISTS idx_property_pages_created_at ON property_pages (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_pages_slug_unique ON property_pages (slug) WHERE slug IS NOT NULL;


-- ============================================================================
-- TABLE 5 : verification_tokens
-- NextAuth magic links
-- Utilisee par : NextAuth internals
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);


-- ============================================================================
-- TABLE 6 : password_reset_tokens
-- Reset de mot de passe
-- Utilisee par : auth/reset-password/route.ts:63,72,132,164,170
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens (token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);


-- ============================================================================
-- TABLE 7 : leads
-- Capture de leads depuis la landing page
-- Utilisee par : api/leads/route.ts:36-48
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT NOT NULL,
  name TEXT,
  city TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index leads — UNIQUE sur email pour ON CONFLICT (email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_unique ON leads (email);


-- ============================================================================
-- VERIFICATION FINALE
-- ============================================================================
-- Ce bloc SELECT permet de verifier que toutes les tables existent apres execution.
-- Si une erreur survient ici, c'est que le script a un probleme.
DO $$
BEGIN
  -- Verifier que chaque table existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : clients';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deliverables') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : deliverables';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : payments';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_pages') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : property_pages';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verification_tokens') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : verification_tokens';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'password_reset_tokens') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : password_reset_tokens';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : leads';
  END IF;

  -- Verifier les colonnes critiques sur clients
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'password_hash') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : clients.password_hash';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'email_verified') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : clients.email_verified';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'updated_at') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : clients.updated_at';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'client_context') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : clients.client_context';
  END IF;

  -- Verifier les colonnes critiques sur payments
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_session_id') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : payments.stripe_session_id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_customer_id') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : payments.stripe_customer_id';
  END IF;

  -- Verifier les colonnes critiques sur deliverables
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'client_id') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.client_id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'title') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.title';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'content') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.content';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'type') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.type';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'metadata') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.metadata';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deliverables' AND column_name = 'status') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : deliverables.status';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUCCES : Toutes les tables et colonnes sont presentes.';
  RAISE NOTICE '7 tables : clients, deliverables, payments, property_pages, verification_tokens, password_reset_tokens, leads';
  RAISE NOTICE '========================================';
END $$;
