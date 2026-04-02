-- Table promo_codes : codes promotionnels pour essai gratuit
CREATE TABLE IF NOT EXISTS promo_codes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'trial_month', -- trial_month, discount_percent, discount_amount
  value INTEGER NOT NULL DEFAULT 30, -- 30 jours pour trial_month, % ou centimes pour discount
  pack TEXT NOT NULL DEFAULT 'mensuel', -- mensuel, lancement, all
  max_uses INTEGER DEFAULT NULL, -- NULL = illimité
  current_uses INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT NULL, -- NULL = pas d'expiration
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes (code);

-- Table promo_redemptions : historique d'utilisation
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  promo_code_id TEXT NOT NULL REFERENCES promo_codes(id),
  client_email TEXT NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, client_email) -- 1 utilisation par client par code
);

-- Insérer 10 codes promo "1 mois gratuit Pack Mensuel"
INSERT INTO promo_codes (code, type, value, pack, max_uses) VALUES
  ('IMMOCREW-DEMO', 'trial_month', 30, 'mensuel', NULL),
  ('MANDATAIRE-VIP', 'trial_month', 30, 'mensuel', 50),
  ('IAD-2026', 'trial_month', 30, 'mensuel', 100),
  ('SAFTI-2026', 'trial_month', 30, 'mensuel', 100),
  ('CAPIFRANCE-2026', 'trial_month', 30, 'mensuel', 100),
  ('LINKEDIN-PROMO', 'trial_month', 30, 'mensuel', 200),
  ('SALON-IMMO', 'trial_month', 30, 'mensuel', 50),
  ('BIENVENUE', 'trial_month', 30, 'mensuel', NULL),
  ('PARTENAIRE-01', 'trial_month', 30, 'mensuel', 20),
  ('PARTENAIRE-02', 'trial_month', 30, 'mensuel', 20)
ON CONFLICT (code) DO NOTHING;
