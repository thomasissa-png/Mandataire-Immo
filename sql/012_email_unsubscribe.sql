-- 012 : Ajout colonnes désinscription email sur clients
-- Permet aux clients de se désinscrire des emails nurturing via un lien dans le footer.

ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_unsubscribed BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_unsubscribed_at TIMESTAMPTZ;
