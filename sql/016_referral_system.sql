-- ============================================================================
-- 016_referral_system.sql
-- Systeme de parrainage ImmoCrew
-- Tables : referral_codes, referrals + colonne clients.referral_credit_months_remaining
--
-- Prerequis : 008_definitive_fix.sql (table clients avec id TEXT)
-- Usage : psql $DATABASE_URL < sql/016_referral_system.sql
-- Idempotent : peut etre relance N fois sans erreur.
-- ============================================================================


-- ============================================================================
-- TABLE : referral_codes
-- Un code unique par parrain, lie a un client
-- ============================================================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id    TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  code       VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);


-- ============================================================================
-- TABLE : referrals
-- Chaque parrainage : parrain -> filleul, avec statut de conversion
-- ============================================================================
CREATE TABLE IF NOT EXISTS referrals (
  id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  referral_code_id        TEXT NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referrer_user_id        TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  referee_user_id         TEXT REFERENCES clients(id) ON DELETE SET NULL,
  referee_email           VARCHAR(255),
  status                  VARCHAR(20) NOT NULL DEFAULT 'pending',
  referrer_credit_months  INT NOT NULL DEFAULT 0,
  referee_trial_days      INT NOT NULL DEFAULT 0,
  converted_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contrainte d'idempotence : un filleul ne peut etre parraine qu'une fois par code
  CONSTRAINT uq_referral_code_referee UNIQUE (referral_code_id, referee_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);


-- ============================================================================
-- EXTENSION : colonne referral_credit_months_remaining sur clients
-- Mois gratuits disponibles, decrementes a chaque cycle de facturation
-- ============================================================================
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referral_credit_months_remaining INT NOT NULL DEFAULT 0;


-- ============================================================================
-- VERIFICATION
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referral_codes') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : referral_codes';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrals') THEN
    RAISE EXCEPTION 'TABLE MANQUANTE : referrals';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'referral_credit_months_remaining') THEN
    RAISE EXCEPTION 'COLONNE MANQUANTE : clients.referral_credit_months_remaining';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUCCES : Systeme de parrainage installe.';
  RAISE NOTICE 'Tables : referral_codes, referrals';
  RAISE NOTICE 'Colonne ajoutee : clients.referral_credit_months_remaining';
  RAISE NOTICE '========================================';
END $$;
