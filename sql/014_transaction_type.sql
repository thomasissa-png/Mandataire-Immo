-- Ajout du type de transaction (vente/location) sur les biens
-- Idempotent : utilise IF NOT EXISTS

ALTER TABLE property_pages ADD COLUMN IF NOT EXISTS transaction_type TEXT NOT NULL DEFAULT 'vente';
