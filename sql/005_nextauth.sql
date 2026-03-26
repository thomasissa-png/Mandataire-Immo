-- Migration : Passage de Clerk a NextAuth.js
-- A executer sur la base PostgreSQL Replit
-- Idempotent : utilise IF NOT EXISTS et ADD COLUMN IF NOT EXISTS

-- 1. Ajouter password_hash pour l'auth email/password
ALTER TABLE clients ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Ajouter email_verified pour le magic link
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- 3. Table verification_tokens pour les magic links NextAuth
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 4. Index sur email (doit etre unique pour l'auth)
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email_unique ON clients (email)
  WHERE email IS NOT NULL;

-- 5. Rendre clerk_user_id nullable (on ne l'utilise plus, mais on garde la colonne
--    pour ne pas perdre de donnees historiques)
-- Note : clerk_user_id est deja nullable dans la plupart des cas. Si NOT NULL,
-- il faudra : ALTER TABLE clients ALTER COLUMN clerk_user_id DROP NOT NULL;

-- 6. Les colonnes first_name et last_name existent deja dans la table clients.
--    Elles seront reutilisees directement par NextAuth.
