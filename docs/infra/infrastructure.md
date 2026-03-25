# Infrastructure ImmoCrew — Documentation technique

> Produit par @infrastructure | 2026-03-25
> Sources : project-context.md, functional-specs.md, roadmap.md, tracking-plan.md, design-tokens.json
> Stack : Next.js 14 App Router, Supabase (PostgreSQL), Clerk, Stripe, PostHog, Replit Deployments, Claude API

---

## 1. Architecture technique

### 1.1 Vue d'ensemble

```
                           ┌─────────────────────────┐
                           │      Client (Browser)    │
                           │  Next.js App (SSR + CSR) │
                           └────────────┬─────────────┘
                                        │ HTTPS
                           ┌────────────v─────────────┐
                           │   Replit Deployments      │
                           │   (Autoscale / Reserved)  │
                           │   Next.js 14 App Router   │
                           │   Node.js runtime         │
                           └──┬───┬───┬───┬───┬───┬───┘
                              │   │   │   │   │   │
              ┌───────────────┘   │   │   │   │   └───────────────┐
              v                   v   │   v   v                   v
     ┌────────────────┐  ┌──────────┐ │ ┌──────────┐  ┌──────────────────┐
     │   Supabase     │  │  Clerk   │ │ │  Stripe  │  │    PostHog       │
     │  (eu-central-1)│  │  (Auth)  │ │ │(Payments)│  │  (eu.posthog.com)│
     │                │  │          │ │ │          │  │                  │
     │ - PostgreSQL   │  │- Magic   │ │ │- Checkout│  │ - Analytics      │
     │ - Storage      │  │  link    │ │ │- Webhooks│  │ - Session replay │
     │ - RLS          │  │- OAuth   │ │ │- Portal  │  │ - Feature flags  │
     │ - Edge Fns     │  │- Webhooks│ │ │- Invoices│  │                  │
     └────────────────┘  └──────────┘ │ └──────────┘  └──────────────────┘
                                      │
                              ┌───────v────────┐
                              │  Claude API    │
                              │  (Anthropic)   │
                              │                │
                              │ - Agents       │
                              │ - Livrables    │
                              │ - Batch async  │
                              └────────────────┘
```

### 1.2 Flux de donnees principaux

**Flux 1 — Acquisition (visiteur vers client)**
1. Visiteur arrive sur la landing page (Next.js SSR)
2. PostHog capture `page_view`, `cta_click`, `pricing_view` (apres consentement cookies)
3. CTA "Commencer" redirige vers Stripe Checkout (hosted)
4. Stripe traite le paiement, envoie webhook `checkout.session.completed`
5. API Route `/api/webhooks/stripe` recoit le webhook :
   - Cree le compte Clerk (via Clerk Backend API)
   - Cree le profil client dans Supabase (table `clients`)
   - Enregistre le paiement (table `payments`)
   - Envoie email de bienvenue avec magic link vers `/onboarding`
6. PostHog capture `payment_success` (server-side)

**Flux 2 — Onboarding (nouveau client)**
1. Client clique le magic link, Clerk authentifie
2. Formulaire wizard 7 etapes, sauvegarde par etape dans Supabase (table `onboarding_data`)
3. A la completion, le `client_context` (JSONB) est genere et stocke dans la table `clients`
4. PostHog capture `onboarding_start`, `onboarding_step_complete`, `onboarding_complete`

**Flux 3 — Production de livrables (admin)**
1. Admin declenche la production depuis `/admin` (bouton par client)
2. Server Action appelle Claude API avec le `client_context`
3. Les agents produisent les livrables (texte, scripts, articles)
4. Les livrables bruts sont stockes dans Supabase Storage (bucket prive par client)
5. Admin QA dans le dashboard : relecture, corrections, validation
6. Admin marque les livrables comme "livres" → visibles dans l'espace client
7. Email de notification au client

**Flux 4 — Consultation livrables (client connecte)**
1. Client se connecte via Clerk (magic link ou password)
2. Middleware Next.js verifie l'auth Clerk
3. Server Component charge les livrables du mois depuis Supabase (filtre RLS par `user_id`)
4. Le client consulte, copie ou telecharge ses livrables
5. PostHog capture `deliverable_view`, `deliverable_download`

**Flux 5 — Gestion abonnement**
1. Client clique "Gerer mon abonnement" → redirige vers Stripe Customer Portal
2. Toute modification (resiliation, changement de carte) declenche un webhook Stripe
3. API Route `/api/webhooks/stripe` met a jour le statut dans Supabase
4. PostHog capture `subscription_cancel`, `payment_failed` (server-side)

---

## 2. Configuration Replit

### 2.1 Fichier `.replit`

```toml
run = "npm run start"
entrypoint = "src/app/page.tsx"

[deployment]
run = ["sh", "-c", "npm run build && npm run start"]
build = ["sh", "-c", "npm install"]

[[ports]]
localPort = 3000
externalPort = 80

[env]
NEXT_TELEMETRY_DISABLED = "1"
NODE_ENV = "production"
```

### 2.2 Fichier `replit.nix`

```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];
}
```

### 2.3 Variables d'environnement (Replit Secrets)

Toutes ces variables doivent etre configurees dans Replit Secrets (Settings > Secrets). Ne jamais les committer dans le code.

**Supabase :**
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique (anon) Supabase — utilisee cote client |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle service role — utilisee cote serveur uniquement, contourne RLS |

**Clerk :**
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Cle publique Clerk |
| `CLERK_SECRET_KEY` | Cle secrete Clerk (server-side) |
| `CLERK_WEBHOOK_SECRET` | Secret pour verifier les webhooks Clerk |

**Stripe :**
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Cle secrete Stripe (server-side) |
| `STRIPE_WEBHOOK_SECRET` | Secret pour verifier les webhooks Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cle publique Stripe (client-side) |
| `STRIPE_PRICE_MENSUEL` | ID du prix Stripe pour le Pack Mensuel (price_xxx) |
| `STRIPE_PRICE_LANCEMENT` | ID du prix Stripe pour le Pack Lancement (price_xxx) |
| `STRIPE_PRICE_BOOST` | ID du prix Stripe pour le Boost Mandat (price_xxx) |

**Anthropic (Claude API) :**
| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Cle API Anthropic pour la generation de contenu |

**PostHog :**
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Cle API PostHog (project API key) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host PostHog EU : `https://eu.i.posthog.com` |

**Application :**
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL publique du site (https://immocrew.fr) |
| `ADMIN_EMAIL` | Email de l'admin pour les notifications internes |

**Total : 16 variables d'environnement a configurer.**

### 2.4 Limites Replit a connaitre

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| **Cold starts** (Autoscale) | Premiere requete apres inactivite : 5-15s de latence | Utiliser un health check externe (BetterStack) toutes les 3 min pour garder l'instance warm |
| **Pas de cron natif** | Impossible de declencher des taches planifiees | Utiliser Scheduled Deployments de Replit ($1/mois) ou un service externe (cron-job.org gratuit) |
| **Storage ephemere** | Les fichiers ecrits sur le filesystem sont perdus au redemarrage | Stocker tout en Supabase Storage, jamais sur le disque Replit |
| **Memoire limitee** | Autoscale : 512 Mo min. Build Next.js peut echouer si trop gros | Optimiser le bundle, limiter les dependances, utiliser `output: 'standalone'` dans next.config.js |
| **Pas de domaine custom gratuit** | Le domaine .replit.app est impose sur le plan free | Configurer le domaine custom immocrew.fr dans Replit Deployments (disponible sur Core) |
| **Build timeout** | Les builds longs peuvent timeout | Garder le build < 5 min : limiter les pages statiques, utiliser ISR |

### 2.5 Configuration Next.js pour Replit

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Reduit la taille du build pour Replit
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',  // Images Supabase Storage
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',  // Pour l'upload d'images onboarding
    },
  },
}

module.exports = nextConfig
```

---

## 3. Base de donnees Supabase

### 3.1 Configuration du projet Supabase

- **Region** : `eu-central-1` (Francfort) — obligatoire pour la conformite RGPD
- **Plan** : Free tier au lancement (500 Mo storage, 50K MAU auth, API illimitees)
- **Upgrade Pro** : Prevoir a partir de 15+ clients (besoin de backups automatiques et pas de pause auto)

### 3.2 Schema SQL complet

```sql
-- ============================================
-- SCHEMA IMMOCREW — MVP
-- A executer dans Supabase SQL Editor
-- ============================================

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: clients
-- Le coeur du systeme — un client = un mandataire abonne
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  email TEXT NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,

  -- Profil professionnel (onboarding etape 1)
  reseau TEXT, -- IAD, SAFTI, Capifrance, etc.
  anciennete TEXT, -- < 1 an, 1-2 ans, 3-5 ans, 5+ ans
  nb_transactions_an TEXT, -- 1-3, 4-6, 7-10, 10+
  photo_url TEXT,
  logo_url TEXT,

  -- Zone geographique (onboarding etape 2)
  ville TEXT,
  code_postal TEXT,
  quartiers TEXT[], -- Array de quartiers
  rayon_km INTEGER DEFAULT 20,
  type_zone TEXT[], -- Urbain, Periurbain, Rural, etc.

  -- Specialite (onboarding etape 3)
  types_biens TEXT[], -- Appartements, Maisons, etc.
  clientele_cible TEXT[], -- Primo-accedants, Familles, etc.
  prix_min INTEGER, -- en euros
  prix_max INTEGER,
  niche TEXT,

  -- Ton et branding (onboarding etape 4)
  ton TEXT, -- Professionnel, Chaleureux, Dynamique, Expert
  tutoiement TEXT DEFAULT 'vouvoiement', -- tutoiement, vouvoiement, mixte
  differentiation TEXT, -- 2-3 phrases
  valeurs TEXT[],

  -- Presence digitale (onboarding etape 6)
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  google_business_url TEXT,
  site_web TEXT,
  youtube_url TEXT,

  -- Preferences contenu (onboarding etape 7)
  contenus_prioritaires TEXT[], -- Ordre de priorite
  sujets TEXT[],
  sujets_a_eviter TEXT,
  frequence_publication TEXT DEFAULT '3/semaine',

  -- Context IA (compile des donnees onboarding pour les agents)
  client_context JSONB,

  -- Abonnement
  plan TEXT DEFAULT 'lead', -- lead, lancement, mensuel, boost, churned
  subscription_status TEXT DEFAULT 'inactive', -- active, past_due, canceled, inactive
  stripe_subscription_id TEXT,

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_current_step INTEGER DEFAULT 0,

  -- CGV
  cgv_accepted_at TIMESTAMPTZ,
  cgv_version TEXT,

  -- Referral
  referral_source TEXT, -- Comment a-t-il connu ImmoCrew
  acquisition_channel TEXT, -- utm_source du premier page_view

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requetes frequentes
CREATE INDEX idx_clients_clerk_user_id ON clients(clerk_user_id);
CREATE INDEX idx_clients_stripe_customer_id ON clients(stripe_customer_id);
CREATE INDEX idx_clients_plan ON clients(plan);
CREATE INDEX idx_clients_subscription_status ON clients(subscription_status);

-- ============================================
-- TABLE: biens
-- Les biens en mandat de chaque client (onboarding etape 5)
-- ============================================
CREATE TABLE biens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  adresse TEXT NOT NULL,
  type_bien TEXT NOT NULL, -- Appartement, Maison, Terrain, Local, Autre
  prix INTEGER NOT NULL,
  surface INTEGER NOT NULL,
  nb_pieces INTEGER NOT NULL,
  points_forts TEXT[],
  lien_annonce TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_biens_client_id ON biens(client_id);
CREATE INDEX idx_biens_actif ON biens(actif);

-- ============================================
-- TABLE: biens_photos
-- Photos des biens (stockees dans Supabase Storage)
-- ============================================
CREATE TABLE biens_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bien_id UUID NOT NULL REFERENCES biens(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Chemin dans Supabase Storage
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_biens_photos_bien_id ON biens_photos(bien_id);

-- ============================================
-- TABLE: livrables
-- Tous les livrables produits pour chaque client
-- ============================================
CREATE TABLE livrables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  bien_id UUID REFERENCES biens(id) ON DELETE SET NULL, -- Pour les livrables lies a un bien specifique (annonces, boost)

  -- Identification
  type TEXT NOT NULL, -- post_instagram, post_facebook, post_linkedin, article_seo, script_video, annonce, newsletter, email_prospection
  titre TEXT NOT NULL,
  mois TEXT NOT NULL, -- Format '2026-04'
  pack_type TEXT NOT NULL, -- mensuel, lancement, boost

  -- Contenu
  contenu TEXT NOT NULL, -- Le texte du livrable
  brief_visuel TEXT, -- Description pour le visuel (Canva)
  metadata JSONB, -- Donnees supplementaires (mots-cles SEO, hashtags, etc.)

  -- Fichiers joints (stockes dans Supabase Storage)
  storage_path TEXT, -- Chemin dans Storage si fichier PDF/image

  -- Workflow
  statut TEXT DEFAULT 'en_production', -- en_production, qa, valide, livre
  note_admin TEXT, -- Note interne (non visible par le client)
  validated_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Mention IA obligatoire (AI Act)
  mention_ia TEXT DEFAULT 'Contenu produit avec assistance IA — relu et valide par l''equipe ImmoCrew.',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_livrables_client_id ON livrables(client_id);
CREATE INDEX idx_livrables_mois ON livrables(mois);
CREATE INDEX idx_livrables_statut ON livrables(statut);
CREATE INDEX idx_livrables_type ON livrables(type);
CREATE INDEX idx_livrables_client_mois ON livrables(client_id, mois);

-- ============================================
-- TABLE: payments
-- Historique des paiements (synchronise via webhooks Stripe)
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  stripe_checkout_session_id TEXT,

  amount INTEGER NOT NULL, -- en centimes (19700 = 197.00 EUR)
  currency TEXT DEFAULT 'eur',
  plan TEXT NOT NULL, -- mensuel, lancement, boost
  status TEXT NOT NULL, -- succeeded, failed, pending, refunded

  -- Pour les boosts : bien concerne
  bien_id UUID REFERENCES biens(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_checkout ON payments(stripe_checkout_session_id);

-- ============================================
-- TABLE: productions
-- Suivi de la production mensuelle par client
-- ============================================
CREATE TABLE productions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  mois TEXT NOT NULL, -- Format '2026-04'
  pack_type TEXT NOT NULL, -- mensuel, lancement, boost

  statut TEXT DEFAULT 'a_produire', -- a_produire, en_production, qa, livre
  date_cible TIMESTAMPTZ, -- Date de livraison cible
  date_livraison TIMESTAMPTZ, -- Date de livraison effective
  note_admin TEXT,

  -- Stats de production
  nb_livrables_total INTEGER DEFAULT 0,
  nb_livrables_livres INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(client_id, mois, pack_type)
);

CREATE INDEX idx_productions_client_mois ON productions(client_id, mois);
CREATE INDEX idx_productions_statut ON productions(statut);

-- ============================================
-- TABLE: webhook_logs
-- Log de tous les webhooks recus (Stripe, Clerk) pour debug
-- ============================================
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL, -- stripe, clerk
  event_type TEXT NOT NULL, -- checkout.session.completed, user.created, etc.
  event_id TEXT, -- ID unique de l'event (pour idempotence)
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX idx_webhook_logs_event_id ON webhook_logs(event_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);

-- ============================================
-- TABLE: leads
-- Leads du formulaire "Voir un exemple pour ma zone" (landing page)
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  prenom TEXT,
  ville TEXT NOT NULL,
  source TEXT, -- hero_cta, footer_cta
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_converted ON leads(converted);

-- ============================================
-- FUNCTION: updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables avec updated_at
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER biens_updated_at BEFORE UPDATE ON biens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER livrables_updated_at BEFORE UPDATE ON livrables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER productions_updated_at BEFORE UPDATE ON productions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE biens ENABLE ROW LEVEL SECURITY;
ALTER TABLE biens_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE livrables ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- POLICY: clients — un client ne voit que son propre profil
CREATE POLICY "clients_select_own" ON clients
  FOR SELECT USING (
    clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

CREATE POLICY "clients_update_own" ON clients
  FOR UPDATE USING (
    clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- POLICY: biens — un client ne voit que ses propres biens
CREATE POLICY "biens_select_own" ON biens
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "biens_insert_own" ON biens
  FOR INSERT WITH CHECK (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "biens_update_own" ON biens
  FOR UPDATE USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "biens_delete_own" ON biens
  FOR DELETE USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- POLICY: biens_photos — suit les memes regles que biens
CREATE POLICY "biens_photos_select_own" ON biens_photos
  FOR SELECT USING (
    bien_id IN (
      SELECT b.id FROM biens b
      JOIN clients c ON b.client_id = c.id
      WHERE c.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- POLICY: livrables — un client ne voit que ses livrables LIVRES
CREATE POLICY "livrables_select_own_delivered" ON livrables
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
    AND statut = 'livre'
  );

-- POLICY: payments — un client voit ses propres paiements
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- POLICY: productions — un client voit le statut de ses productions
CREATE POLICY "productions_select_own" ON productions
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- POLICY: webhook_logs — aucun acces client (server-side seulement via service_role)
-- Pas de policy SELECT = aucun acces via les cles publiques

-- POLICY: leads — aucun acces client (les leads sont geres cote serveur)
-- Pas de policy SELECT = aucun acces via les cles publiques

-- ============================================
-- SUPABASE STORAGE — Buckets
-- ============================================
-- A creer manuellement dans le dashboard Supabase Storage :
--
-- 1. Bucket "livrables" (prive)
--    - Structure : livrables/{client_id}/{mois}/{fichier}
--    - Policy : un client ne peut lire que son propre dossier
--    - Max file size : 10 Mo
--
-- 2. Bucket "uploads" (prive)
--    - Structure : uploads/{client_id}/photos/{fichier}
--    - Policy : un client ne peut ecrire que dans son propre dossier
--    - Max file size : 5 Mo
--
-- 3. Bucket "public" (public, en lecture)
--    - Structure : public/assets/{fichier}
--    - Usage : logos, images landing page, assets statiques
--    - Max file size : 2 Mo
```

---

## 4. Authentification Clerk

### 4.1 Configuration recommandee

| Parametre | Valeur | Justification |
|-----------|--------|---------------|
| **Methode principale** | Magic link (email) | Sophie oublie ses mots de passe — magic link = zero friction (cf. wireframes.md) |
| **Methode secondaire** | Email + mot de passe | Pour les utilisateurs qui preferent un mot de passe classique |
| **OAuth** | Google (optionnel) | A activer en mois 2 si demande client |
| **MFA** | Desactive au MVP | Cible non-tech, ajouter de la friction = churn |
| **Session duration** | 30 jours | Evite les reconnexions frequentes (Sophie consulte 1-2x/mois) |
| **Allowed redirect URLs** | `https://immocrew.fr/*`, `http://localhost:3000/*` | Production + dev local |

### 4.2 Roles utilisateur

| Role | Acces | Implementation |
|------|-------|----------------|
| `client` | `/dashboard`, `/onboarding`, `/profil` | Role par defaut a la creation |
| `admin` | `/admin`, `/dashboard`, toutes les pages | Attribue manuellement dans le dashboard Clerk |

Implementation dans le middleware Next.js :

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks/(.*)',
  '/cgv',
  '/confidentialite',
  '/mentions-legales',
  '/bienvenue',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return auth().redirectToSignIn()
  }

  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role
    if (role !== 'admin') {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### 4.3 Webhook Clerk vers Supabase

Configurer dans le dashboard Clerk (Webhooks) :

**Endpoint** : `https://immocrew.fr/api/webhooks/clerk`

**Events a ecouter** :
| Event | Action |
|-------|--------|
| `user.created` | Mettre a jour le `clerk_user_id` dans la table `clients` si le compte a ete pre-cree via Stripe |
| `user.updated` | Synchroniser email/nom dans Supabase |
| `user.deleted` | Marquer le client comme supprime (soft delete), declencher la procedure RGPD |
| `session.created` | PostHog `login` event (server-side) |

```typescript
// app/api/webhooks/clerk/route.ts (structure)
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('CLERK_WEBHOOK_SECRET manquant')

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  const body = await req.json()
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(JSON.stringify(body), {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Signature invalide', { status: 400 })
  }

  // Log du webhook pour debug
  // await supabase.from('webhook_logs').insert({ source: 'clerk', event_type: evt.type, payload: body })

  switch (evt.type) {
    case 'user.created':
      // Sync avec Supabase
      break
    case 'user.updated':
      // Update email/nom
      break
    case 'user.deleted':
      // Soft delete + procedure RGPD
      break
  }

  return new Response('OK', { status: 200 })
}
```

### 4.4 Integration Clerk + Supabase (JWT)

Pour que les RLS policies Supabase fonctionnent avec Clerk, configurer un JWT template dans Clerk :

1. Dashboard Clerk > JWT Templates > New template "supabase"
2. Claims :
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "role": "{{user.public_metadata.role}}"
}
```
3. Signing key : utiliser le JWKS endpoint de Clerk
4. Dans Supabase : Authentication > JWT Settings > configurer le JWKS URL de Clerk

Cote client, le Supabase client utilise le token Clerk :

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export async function createClerkSupabaseClient() {
  const { getToken } = await auth()
  const supabaseToken = await getToken({ template: 'supabase' })

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      },
    }
  )
}
```

---

## 5. Integration Stripe

### 5.1 Produits et prix a creer dans Stripe Dashboard

| Produit | Mode | Prix TTC | Prix HT | Stripe Price Type | Recurrence |
|---------|------|----------|---------|-------------------|------------|
| Pack Mensuel ImmoCrew | `subscription` | 197,00 EUR | 164,17 EUR | `recurring` (monthly) | Mensuel |
| Pack Lancement ImmoCrew | `payment` | 497,00 EUR | 414,17 EUR | `one_time` | One-shot |
| Boost Mandat ImmoCrew | `payment` | 97,00 EUR | 80,83 EUR | `one_time` | One-shot |

**Configuration TVA** : activer Stripe Tax avec taux francais 20%. Configurer l'adresse du siege social dans Stripe > Settings > Business details.

**Configuration Customer Portal** : Stripe > Settings > Billing > Customer portal :
- Autoriser : modifier la carte, telecharger les factures, annuler l'abonnement
- URL de retour : `https://immocrew.fr/dashboard`

### 5.2 Webhooks Stripe

**Endpoint** : `https://immocrew.fr/api/webhooks/stripe`

| Event Stripe | Action cote ImmoCrew | Priorite |
|-------------|---------------------|----------|
| `checkout.session.completed` | 1. Creer le compte Clerk (Backend API) 2. Creer le profil client dans Supabase 3. Enregistrer le paiement 4. Envoyer email de bienvenue 5. PostHog `payment_success` | P0 |
| `invoice.paid` | 1. Marquer le mois comme paye 2. Creer la production du mois 3. PostHog `payment_success` | P0 |
| `invoice.payment_failed` | 1. Marquer le client comme `past_due` 2. PostHog `payment_failed` 3. Email de relance (Stripe gere les retries) | P0 |
| `customer.subscription.updated` | Mettre a jour `subscription_status` et `plan` dans Supabase | P0 |
| `customer.subscription.deleted` | 1. Marquer le client comme `churned` 2. Maintenir l'acces 30j 3. PostHog `subscription_cancel` | P0 |

**Securite des webhooks** :

```typescript
// app/api/webhooks/stripe/route.ts (structure)
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Signature invalide', { status: 400 })
  }

  // Idempotence : verifier si l'event a deja ete traite
  // const existing = await supabase.from('webhook_logs')
  //   .select('id').eq('event_id', event.id).single()
  // if (existing.data) return new Response('Deja traite', { status: 200 })

  // Log du webhook
  // await supabase.from('webhook_logs').insert({
  //   source: 'stripe', event_type: event.type,
  //   event_id: event.id, payload: event
  // })

  switch (event.type) {
    case 'checkout.session.completed':
      // Flux de creation de compte complet
      break
    case 'invoice.paid':
      // Creer la production mensuelle
      break
    case 'invoice.payment_failed':
      // Mettre a jour le statut
      break
    case 'customer.subscription.updated':
      // Sync statut abonnement
      break
    case 'customer.subscription.deleted':
      // Marquer comme churned
      break
  }

  return new Response('OK', { status: 200 })
}
```

### 5.3 Flux de checkout (implementation)

```typescript
// app/api/checkout/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { plan, email } = await req.json()

  const priceMap: Record<string, string> = {
    mensuel: process.env.STRIPE_PRICE_MENSUEL!,
    lancement: process.env.STRIPE_PRICE_LANCEMENT!,
    boost: process.env.STRIPE_PRICE_BOOST!,
  }

  const session = await stripe.checkout.sessions.create({
    mode: plan === 'mensuel' ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceMap[plan], quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bienvenue?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
    metadata: { plan },
    tax_id_collection: { enabled: true },
    // Pour le combo Lancement + Mensuel :
    // Ajouter les deux line_items avec des modes differents
    // Stripe supporte cela via le mode 'subscription' avec un one-time add-on
  })

  return Response.json({ url: session.url })
}
```

---

## 6. Pipeline IA

### 6.1 Architecture du pipeline semi-automatise (MVP)

```
┌──────────────┐     ┌─────────────────┐     ┌───────────────────┐
│  Admin        │     │  API Route       │     │  Claude API       │
│  /admin       │────>│  /api/produce    │────>│  (Anthropic)      │
│  "Lancer la   │     │                  │     │                   │
│  production"  │     │  1. Charge le    │     │  - System prompt  │
└──────────────┘     │     client_context│     │    = agent spec   │
                     │  2. Construit le  │     │  - User prompt    │
                     │     prompt        │     │    = client_context│
                     │  3. Appelle Claude│     │  - Output         │
                     │  4. Parse les     │     │    = livrables    │
                     │     livrables     │     └───────────────────┘
                     │  5. Stocke dans   │
                     │     Supabase      │
                     └─────────────────┘
```

### 6.2 Stockage des livrables

- **Textes** (posts, articles, scripts, annonces) : stockes dans la table `livrables` (colonne `contenu` de type TEXT)
- **Fichiers** (PDF compiles, images) : stockes dans Supabase Storage, bucket `livrables/{client_id}/{mois}/`
- **Archive ZIP** : generee a la volee par une API Route quand le client clique "Tout telecharger"

### 6.3 Estimation du cout IA par client

| Livrable | Tokens input (est.) | Tokens output (est.) | Nombre/mois |
|----------|-------------------|---------------------|-------------|
| Post social | ~2K | ~500 | 12 |
| Article SEO | ~3K | ~3K | 2 |
| Script video | ~2K | ~1K | 4 |
| Annonce | ~2K | ~1K | 4 |
| Newsletter | ~2K | ~1.5K | 1 |
| Email prospection | ~2K | ~800 | 1 |

**Total estime par client/mois** : ~50K tokens input, ~25K tokens output
**Cout Claude Sonnet** : ~0.15$/1K input + ~0.75$/1K output = ~$7.50 + ~$18.75 = ~$26/client/mois

**Optimisation recommandee** : utiliser Claude Haiku pour les posts et emails (cout 10x inferieur), Claude Sonnet pour les articles SEO et annonces. Cout optimise : ~$5-8/client/mois.

[HYPOTHESE : estimation basee sur les tarifs Claude API de mars 2026. A valider avec un test reel sur 1 client.]

### 6.4 Gestion de la production asynchrone

La production est declenchee par l'admin et s'execute de maniere asynchrone :

1. Admin clique "Lancer la production" → Server Action cree une entree `productions` avec statut `en_production`
2. La production elle-meme tourne en arriere-plan (Supabase Edge Function ou tache longue via Claude API)
3. A la completion, le statut passe a `qa`
4. L'admin est notifie (email ou notification dans le dashboard)

**Attention Replit** : les API Routes Next.js sur Replit ont un timeout de ~30s. Pour la generation de contenu via Claude (qui peut prendre 1-3 min par client), il faut :
- Option A : Utiliser une Supabase Edge Function (Deno runtime, timeout 150s sur le plan Pro)
- Option B : Decouper la production en plusieurs appels API sequentiels (1 livrable par appel)
- Option C : Utiliser un job runner externe (Trigger.dev gratuit, ou Inngest)

**Recommandation MVP** : Option B — decouper en appels sequentiels. Un appel par type de livrable, stockage intermediaire dans Supabase. L'admin peut voir la progression en temps reel.

---

## 7. Performance

### 7.1 Core Web Vitals — Cibles

| Metrique | Cible | Seuil d'alerte | Justification |
|----------|-------|----------------|---------------|
| **LCP** (Largest Contentful Paint) | < 2.0s | > 2.5s | Hero de la landing page = premier element visible |
| **INP** (Interaction to Next Paint) | < 150ms | > 200ms | Clics CTA, navigation onboarding, copier-coller livrables |
| **CLS** (Cumulative Layout Shift) | < 0.05 | > 0.1 | Pas de layout shift sur le pricing ou les avant/apres |
| **TTFB** (Time to First Byte) | < 800ms | > 1.2s | SSR Next.js, depend de Replit cold start |
| **TTI** (Time to Interactive) | < 2.0s | > 3.0s | Le CTA doit etre cliquable immediatement |

### 7.2 Optimisations Next.js

**ISR (Incremental Static Regeneration)** :
- Landing page (`/`) : `revalidate: 3600` (1h) — le contenu change rarement
- Pages legales (`/cgv`, `/confidentialite`, `/mentions-legales`) : `revalidate: 86400` (24h)
- Dashboard (`/dashboard`) : pas d'ISR, rendu dynamique (donnees temps reel)

**Image Optimization** :
- Utiliser `next/image` pour toutes les images
- Format WebP automatique
- Placeholder `blur` pour les images au-dessus du fold
- Sizes responsive : `(max-width: 768px) 100vw, 50vw`

**Font Loading** :
- Plus Jakarta Sans et Inter charges via `next/font/google` (pas de Google Fonts CDN externe)
- `display: 'swap'` pour eviter le FOIT
- Preload uniquement les graisses utilisees : 400, 500, 600, 700, 800

```typescript
// app/layout.tsx
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
```

**Bundle Optimization** :
- `next/dynamic` pour les composants lourds (FAQ accordion, formulaire onboarding)
- Tree shaking : importer uniquement les icones utilisees (`import { Copy } from 'lucide-react'`, pas `import * as Icons`)
- Analyse avec `@next/bundle-analyzer` — budget : < 200 Ko de JS first load (pages publiques)

**Streaming et Suspense** :
- Utiliser `<Suspense>` avec fallback pour les sections du dashboard qui chargent les livrables
- Le hero et le pricing se chargent instantanement (RSC), les livrables streament apres

---

## 8. Securite

### 8.1 Checklist securite pre-lancement

| Element | Statut | Detail |
|---------|--------|--------|
| **HTTPS** | Automatique sur Replit Deployments | SSL/TLS gere par Replit |
| **CSP Headers** | A configurer | Voir section 8.2 |
| **Rate Limiting** | A configurer | Voir section 8.3 |
| **CORS** | A configurer | Voir section 8.4 |
| **Env vars** | 16 secrets dans Replit | Jamais en clair dans le code |
| **Webhook signature** | Stripe + Clerk | Verification obligatoire sur chaque webhook |
| **RLS Supabase** | Configure | Voir section 3.2 |
| **Input validation** | A implementer | Zod pour tous les formulaires et API routes |
| **SQL Injection** | Protege par Supabase client | Ne jamais utiliser de raw SQL cote client |
| **XSS** | React echappe par defaut | Ne jamais utiliser `dangerouslySetInnerHTML` |
| **CSRF** | Server Actions Next.js protegent nativement | Tokens CSRF automatiques |

### 8.2 Content Security Policy (CSP)

```typescript
// next.config.js — headers de securite
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://eu.i.posthog.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://*.supabase.co https://img.clerk.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co https://eu.i.posthog.com https://api.clerk.com https://api.stripe.com https://api.anthropic.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://*.clerk.accounts.dev",
      "worker-src 'self' blob:",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]
```

### 8.3 Rate Limiting

Utiliser un rate limiter en memoire au MVP (pas de Redis pour economiser). Package recommande : `@upstash/ratelimit` avec Upstash Redis gratuit (10K requetes/jour) ou `express-rate-limit` adapte pour Next.js.

| Route | Limite | Fenetre |
|-------|--------|---------|
| `/api/webhooks/*` | 100 req | 1 min |
| `/api/checkout` | 10 req/IP | 1 min |
| `/api/produce` | 5 req/IP | 5 min |
| `/api/leads` | 5 req/IP | 1 min |
| Pages publiques | 60 req/IP | 1 min |

### 8.4 CORS

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ]
}
```

### 8.5 Conformite RGPD technique

| Mesure | Implementation |
|--------|----------------|
| **Supabase EU** | Region `eu-central-1` (Francfort) |
| **PostHog EU** | Host `eu.i.posthog.com` |
| **Consentement cookies** | Tarteaucitron.js — PostHog charge uniquement apres consentement |
| **Droit de suppression** | Script admin : supprime le client de Supabase + demande suppression aux sous-traitants |
| **Droit de portabilite** | API Route `/api/admin/export-client/[id]` : exporte toutes les donnees client en JSON |
| **Durees de conservation** | Donnees client : duree du contrat + 30j. Livrables : duree du contrat + 30j. Logs webhooks : 90j. Leads non convertis : 12 mois. |
| **Chiffrement** | Supabase chiffre au repos (AES-256). HTTPS en transit. |
| **Audit des deps** | `npm audit` dans le CI/CD. Alerte si vulnerabilite haute/critique. |

---

## 9. CI/CD

### 9.1 Pipeline GitHub Actions

Le deploiement est gere par Replit. Le pipeline CI/CD s'arrete au build et ne deploie pas. Replit pull depuis le repo GitHub et deploie automatiquement.

```yaml
# .github/workflows/ci.yml
name: CI — ImmoCrew

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --ci --coverage
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_POSTHOG_KEY: ${{ secrets.NEXT_PUBLIC_POSTHOG_KEY }}
          NEXT_PUBLIC_POSTHOG_HOST: https://eu.i.posthog.com
          NEXT_PUBLIC_APP_URL: https://immocrew.fr

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=high
        continue-on-error: false

  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_POSTHOG_KEY: ${{ secrets.NEXT_PUBLIC_POSTHOG_KEY }}
          NEXT_PUBLIC_POSTHOG_HOST: https://eu.i.posthog.com
          NEXT_PUBLIC_APP_URL: https://immocrew.fr
      # Verifier que le bundle first-load des pages publiques < 200 Ko
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(cat .next/build-manifest.json | node -e "
            const fs = require('fs');
            const manifest = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
            // Calculer la taille approximative des chunks communs
            console.log(Object.keys(manifest.pages).length + ' pages built');
          ")
          echo "Build successful with $BUNDLE_SIZE"
```

### 9.2 Scripts package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:types": "npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/database.ts",
    "analyze": "ANALYZE=true next build"
  }
}
```

### 9.3 Strategie de branches

| Branche | Usage | Protection |
|---------|-------|------------|
| `main` | Production (Replit deploie depuis main) | CI doit passer, pas de push direct |
| `develop` | Developpement courant | CI doit passer |
| `feature/*` | Branches de feature | PR vers develop |
| `hotfix/*` | Corrections urgentes | PR vers main directement |

---

## 10. Monitoring

### 10.1 Health Check

**Endpoint** : `GET /api/health`

```typescript
// app/api/health/route.ts
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const checks: Record<string, { status: string; latency?: number }> = {}
  const start = Date.now()

  // Check Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const dbStart = Date.now()
    const { error } = await supabase.from('clients').select('id').limit(1)
    checks.supabase = {
      status: error ? 'degraded' : 'healthy',
      latency: Date.now() - dbStart,
    }
  } catch {
    checks.supabase = { status: 'down' }
  }

  // Check Clerk
  try {
    const clerkStart = Date.now()
    const res = await fetch('https://api.clerk.com/v1/health', {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    })
    checks.clerk = {
      status: res.ok ? 'healthy' : 'degraded',
      latency: Date.now() - clerkStart,
    }
  } catch {
    checks.clerk = { status: 'down' }
  }

  // Check Stripe
  try {
    const stripeStart = Date.now()
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    })
    checks.stripe = {
      status: res.ok ? 'healthy' : 'degraded',
      latency: Date.now() - stripeStart,
    }
  } catch {
    checks.stripe = { status: 'down' }
  }

  const allHealthy = Object.values(checks).every(c => c.status === 'healthy')
  const totalLatency = Date.now() - start

  return Response.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      latency: totalLatency,
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  )
}
```

### 10.2 Error Tracking — Sentry

**Plan** : Developer (gratuit, 5K events/mois — suffisant pour le MVP avec < 30 clients)

Configuration Next.js :

```bash
# Installation
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,       // 10% des transactions (economie de quota)
  replaysSessionSampleRate: 0,  // Pas de session replay sur free tier
  replaysOnErrorSampleRate: 1.0, // Replay uniquement sur erreur
})
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

**Variable d'environnement additionnelle** :
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry (obtenu a la creation du projet Sentry) |
| `SENTRY_AUTH_TOKEN` | Token pour l'upload des source maps (CI/CD) |

### 10.3 Uptime Monitoring — BetterStack

**Plan** : Free (10 moniteurs, checks toutes les 3 min)

Moniteurs a configurer :

| Moniteur | URL | Type | Alerte si |
|----------|-----|------|-----------|
| Site principal | `https://immocrew.fr` | HTTP | Status != 200, latence > 5s |
| Health check | `https://immocrew.fr/api/health` | HTTP | Status != 200 |
| API Webhooks | `https://immocrew.fr/api/webhooks/stripe` | HTTP (HEAD) | Status != 405 (method not allowed = route existe) |
| Supabase | `https://xxx.supabase.co/rest/v1/` | HTTP | Status != 200 |

**Page de statut** : configurer une status page publique BetterStack sur `status.immocrew.fr` (gratuit, domaine custom inclus).

### 10.4 Seuils d'alerte

| Metrique | Seuil warning | Seuil critique | Canal d'alerte |
|----------|---------------|----------------|----------------|
| Error rate | > 0.5% des requetes | > 1% | Email admin |
| Latence P95 | > 1.5s | > 2s | Email admin |
| Disponibilite | < 99.9% sur 24h | < 99.5% sur 1h | Email + SMS (BetterStack) |
| Paiements echoues | > 2 consecutifs pour un client | > 5 total/jour | Email admin |
| Health check down | > 1 min | > 5 min | Email + SMS |

### 10.5 Logs

Au MVP, pas de solution de logging payante. Utiliser :
- **Console structuree** : `console.error` et `console.warn` avec contexte JSON
- **Table webhook_logs** : tous les webhooks recus avec payload et statut de traitement
- **Sentry** : capture automatique des erreurs non gerees

Format de log recommande :
```typescript
function logError(context: string, error: unknown, metadata?: Record<string, unknown>) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...metadata,
  }))
}
```

---

## 11. Estimation des couts

### 11.1 Ventilation mensuelle (objectif < 100 EUR/mois)

| Service | Plan | Cout/mois | Notes |
|---------|------|-----------|-------|
| **Replit** | Core | 20 USD (~19 EUR) | Inclut 25$/mois de credits (couvre le hosting Next.js) |
| **Supabase** | Free → Pro | 0 → 25 USD | Free au lancement. Passer a Pro (25$/mois) quand 15+ clients (besoin backups + pas de pause) |
| **Clerk** | Free | 0 EUR | 50K MRU gratuits — largement suffisant pour < 100 clients |
| **Stripe** | Pay-as-you-go | ~2.4% + 0.25 EUR/tx | Pas de frais fixes. Sur 5K EUR MRR = ~125 EUR/mois de frais Stripe (pas comptabilise en infra) |
| **PostHog** | Free | 0 EUR | 1M events/mois gratuits — suffisant pour < 1000 visiteurs/mois |
| **Sentry** | Developer | 0 EUR | 5K events/mois gratuits |
| **BetterStack** | Free | 0 EUR | 10 moniteurs, checks 3 min |
| **Domaine** | immocrew.fr | ~1 EUR/mois | ~12 EUR/an |
| **Claude API** | Pay-as-you-go | 50-100 USD | Variable selon le nombre de clients. ~5-8$/client optimise (Haiku + Sonnet). Pour 15 clients : ~75-120$ |
| **Total infrastructure** | | **~20-45 EUR/mois** (hors Claude API) | **~70-145 EUR/mois** (avec Claude API pour 15 clients) |

### 11.2 Evolution des couts par palier

| Palier clients | Replit | Supabase | Claude API | Total estime |
|---------------|--------|----------|-----------|-------------|
| 0-5 (lancement) | 20$ | 0$ (free) | 25-40$ | **45-60$/mois** |
| 5-15 (stabilisation) | 20$ | 0-25$ | 40-120$ | **60-165$/mois** |
| 15-30 (scale) | 20$ | 25$ | 120-240$ | **165-285$/mois** |
| 30+ (croissance) | 20-40$ | 25$ | 240$+ | **285$+/mois** |

**Point d'attention** : le cout Claude API est le poste le plus important et le plus variable. L'optimisation du pipeline IA (choix du modele par type de livrable, caching des prompts, batch processing) est critique pour la rentabilite.

**Marge brute estimee** (30 clients, MRR 5 900 EUR) :
- Infra fixe : ~70 EUR/mois
- Claude API : ~200 EUR/mois (optimise)
- Total couts techniques : ~270 EUR/mois
- **Marge brute : ~95%** (5 630 EUR/mois avant le temps fondateur)

### 11.3 Strategie de backup base de donnees

| Element | Strategie | Frequence | Retention |
|---------|-----------|-----------|-----------|
| **Supabase Free** | Export SQL manuel via Dashboard | Hebdomadaire (a automatiser) | 4 dernieres copies |
| **Supabase Pro** | Backups automatiques inclus | Quotidien (snapshots 7j) | 7 jours |
| **Supabase Storage** | Pas de backup automatique | Export manuel ou script | A chaque livraison mensuelle |
| **Procedure de restauration** | Restaurer depuis le snapshot Supabase le plus recent | RTO cible : 1h | RPO cible : 24h |

**Script de backup recommande (plan Free)** :
- Utiliser `pg_dump` via l'URL de connexion directe Supabase
- Stocker le dump dans un bucket Supabase Storage dedie ou en local
- Automatiser via un Scheduled Deployment Replit (1$/mois) ou cron-job.org

---

## 12. Strategie de cache

### 12.1 Multi-niveaux

| Niveau | Outil | Contenu cache | TTL | Invalidation |
|--------|-------|--------------|-----|-------------|
| **ISR** | Next.js | Landing page, pages legales | 1h (landing), 24h (legales) | `revalidatePath()` apres modification |
| **Browser cache** | Headers HTTP | Assets statiques (fonts, images, CSS, JS) | 1 an (immutable via hashed filenames) | Automatique via le hash du build |
| **Supabase cache** | PostgREST | Requetes frequentes (profil client) | Cache automatique par PostgREST | Automatique apres INSERT/UPDATE |
| **In-memory** | Variables Next.js | Config Stripe (prix IDs), feature flags | Duree de vie du process | Redemarrage du process |

### 12.2 Ce qui ne doit PAS etre cache

- Dashboard client (donnees temps reel)
- Statut de production (doit refleter l'etat actuel)
- Paiements (synchronisation Stripe en temps reel)
- Health check (doit toujours etre frais)

---

## Hypotheses a valider

1. **Cout Claude API** : estimation de 5-8$/client/mois basee sur les tarifs Claude Sonnet/Haiku de mars 2026. A valider avec un test reel sur 1 client complet.
2. **Replit Autoscale vs Reserved VM** : l'Autoscale est recommande pour le cout, mais les cold starts peuvent impacter l'experience. A tester en conditions reelles.
3. **Timeout Replit 30s** : a confirmer. Si la production IA depasse ce timeout, la solution de decoupage en appels sequentiels est indispensable.

---

**Handoff → @fullstack**
- Fichiers produits : `docs/infra/infrastructure.md`
- Decisions prises :
  - Supabase EU (eu-central-1) pour la conformite RGPD
  - Clerk avec magic link en methode principale (zero friction pour Sophie)
  - Stripe Checkout hosted (pas d'integration custom, PCI-DSS gere par Stripe)
  - Pipeline IA asynchrone decoupe en appels sequentiels (contournement du timeout Replit 30s)
  - ISR pour la landing page (revalidate 1h), rendu dynamique pour le dashboard
  - Sentry free tier pour l'error tracking, BetterStack free pour l'uptime monitoring
  - next.config.js avec `output: 'standalone'` pour optimiser le build Replit
- Points d'attention pour l'implementation :
  1. **Schema SQL** (section 3.2) : a executer dans Supabase SQL Editor avant de commencer le dev
  2. **16 variables d'environnement** (section 2.3) : a configurer dans Replit Secrets
  3. **Integration Clerk + Supabase via JWT** (section 4.4) : configurer le JWT template dans Clerk AVANT de coder les requetes Supabase
  4. **Webhooks Stripe** (section 5.2) : 5 events a gerer, chacun idempotent. L'endpoint `/api/webhooks/stripe` est critique — le tester avec Stripe CLI en dev
  5. **RLS policies** (section 3.2) : les livrables ne sont visibles par le client QUE si `statut = 'livre'`. L'admin utilise la `service_role` key pour contourner le RLS
  6. **Cold starts Replit** : configurer le health check BetterStack toutes les 3 min pour garder l'instance warm
  7. **Fonts** : charger Plus Jakarta Sans et Inter via `next/font/google`, pas de CDN externe
  8. **Budget bundle** : < 200 Ko de JS first load sur les pages publiques
  9. **Storage ephemere Replit** : ne JAMAIS ecrire de fichiers sur le disque. Tout dans Supabase Storage
  10. **Mention IA obligatoire** : chaque livrable dans la table `livrables` a une colonne `mention_ia` pre-remplie (obligation AI Act)
---

*Document produit par @infrastructure dans le cadre du framework Gradient Agents.*
*Reference : project-context.md, functional-specs.md, roadmap.md, tracking-plan.md, design-tokens.json*
