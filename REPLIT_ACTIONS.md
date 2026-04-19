# Actions Replit -- ImmoCrew

> Commandes a executer manuellement dans le shell Replit par le fondateur.
> Chaque section est autonome et idempotente (peut etre relancee sans risque).
> Derniere mise a jour : 2026-04-19 (Session 12)

---

## 1. Migrations SQL (010-014)

### Contexte
Les migrations 015-019 ont ete passees en prod (session 10-11), mais les 010-014 manquent.
L'erreur "Erreur lors de la sauvegarde" a la fin de l'onboarding est causee par l'absence des colonnes `onboarding_draft*` (migration 010).

### Pre-requis
- Acces au shell Replit avec `$DATABASE_URL` configure
- Backup recommande avant execution (optionnel car idempotent)

### Commandes (dans l'ordre)

```bash
# Verifier quelles colonnes existent deja
psql $DATABASE_URL -c "\d clients" | grep -E "onboarding_draft|email_unsub"
psql $DATABASE_URL -c "\dt email_logs"
psql $DATABASE_URL -c "\dt agent_pages"

# Passer les migrations dans l'ordre
psql $DATABASE_URL -f sql/010_onboarding_draft.sql
psql $DATABASE_URL -f sql/011_email_nurturing.sql
psql $DATABASE_URL -f sql/012_email_unsubscribe.sql
psql $DATABASE_URL -f sql/013_agent_pages.sql
psql $DATABASE_URL -f sql/014_transaction_type.sql
```

### Verification post-migration

```bash
# Verifier que toutes les colonnes/tables sont presentes
psql $DATABASE_URL -c "\d clients" | grep -E "onboarding_draft|email_unsub|referral_credit"
psql $DATABASE_URL -c "\dt email_logs"
psql $DATABASE_URL -c "\dt agent_pages"
psql $DATABASE_URL -c "\d property_pages" | grep transaction_type
```

### Resultats attendus
| Migration | Type | Ce qu'elle fait |
|-----------|------|-----------------|
| 010 | ALTER TABLE | Ajoute `onboarding_draft` (JSONB), `onboarding_draft_step` (INT), `onboarding_draft_updated_at` (TIMESTAMPTZ) sur `clients` |
| 011 | CREATE TABLE | Cree `email_logs` (suivi emails nurturing) + index |
| 012 | ALTER TABLE | Ajoute `email_unsubscribed` (BOOL), `email_unsubscribed_at` (TIMESTAMPTZ) sur `clients` |
| 013 | CREATE TABLE | Cree `agent_pages` (landing pages mandataires) + index |
| 014 | ALTER TABLE | Ajoute `transaction_type` (TEXT, default 'vente') sur `property_pages` |

### Rollback (si necessaire)

```bash
# ATTENTION : rollback = perte de donnees dans ces colonnes/tables
# Ne faire que si probleme avere

# 014
psql $DATABASE_URL -c "ALTER TABLE property_pages DROP COLUMN IF EXISTS transaction_type;"

# 013
psql $DATABASE_URL -c "DROP TABLE IF EXISTS agent_pages CASCADE;"

# 012
psql $DATABASE_URL -c "ALTER TABLE clients DROP COLUMN IF EXISTS email_unsubscribed;"
psql $DATABASE_URL -c "ALTER TABLE clients DROP COLUMN IF EXISTS email_unsubscribed_at;"

# 011
psql $DATABASE_URL -c "DROP TABLE IF EXISTS email_logs CASCADE;"

# 010
psql $DATABASE_URL -c "ALTER TABLE clients DROP COLUMN IF EXISTS onboarding_draft;"
psql $DATABASE_URL -c "ALTER TABLE clients DROP COLUMN IF EXISTS onboarding_draft_step;"
psql $DATABASE_URL -c "ALTER TABLE clients DROP COLUMN IF EXISTS onboarding_draft_updated_at;"
```

---

## 2. Stripe Production Setup

### Pre-requis
1. Compte Stripe en mode **live** (pas test)
2. Creer un Restricted API Key avec les permissions : `Products: Write`, `Prices: Write`, `Checkout Sessions: Write`, `Customers: Write`, `Subscriptions: Write`, `Webhook Endpoints: Write`
3. Creer un webhook endpoint dans le dashboard Stripe pointant vers `https://immocrew.fr/api/stripe/webhook`

### Variables d'environnement a configurer dans Replit Secrets

| Variable | Ou la trouver | Exemple |
|----------|---------------|---------|
| `STRIPE_SECRET_KEY` | Dashboard Stripe > Developers > API Keys (clé live `sk_live_...`) | `sk_live_51Abc...` |
| `STRIPE_PUBLIC_KEY` | Dashboard Stripe > Developers > API Keys (clé publishable `pk_live_...`) | `pk_live_51Abc...` |
| `STRIPE_WEBHOOK_SECRET` | Dashboard Stripe > Developers > Webhooks > Signing secret | `whsec_...` |

### Commande de setup

```bash
# Creer les produits et prix dans Stripe
STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-setup.ts
```

Le script est **idempotent** : il verifie si les produits existent deja (via `metadata.immocrew_pack`) avant de les creer.

### Apres execution

Le script affiche les Price IDs a copier dans Replit Secrets :

```
STRIPE_PRICE_MENSUEL=price_xxx
STRIPE_PRICE_TRIMESTRIEL=price_xxx
STRIPE_PRICE_ANNUEL=price_xxx
STRIPE_PRICE_BOOST=price_xxx
```

### Checklist de test E2E Stripe

- [ ] **Checkout mensuel** : cliquer sur "Commencer" sur le pack Mensuel, completer le paiement (carte test `4242 4242 4242 4242`), verifier la creation de l'abonnement dans Stripe Dashboard
- [ ] **Checkout trimestriel** : idem pack Trimestriel (360EUR)
- [ ] **Checkout annuel** : idem pack Annuel (1200EUR)
- [ ] **Boost mandat** : acheter un Boost (100EUR, paiement unique), verifier que le client est bien abonne avant
- [ ] **Webhook checkout.session.completed** : verifier dans les logs Replit que le webhook est recu et que le client passe en `status: active` dans la DB
- [ ] **Webhook customer.subscription.deleted** : annuler un abonnement dans Stripe Dashboard, verifier que le client passe en `status: canceled`
- [ ] **Parrainage + credit** : creer un code parrain, l'utiliser lors d'un checkout, verifier que `referral_credit_months_remaining` est incremente
- [ ] **Code promo** : utiliser un code promo (ex: `IMMOCREW-DEMO`), verifier le trial de 30 jours
- [ ] **Portail client** : cliquer sur "Gerer mon abonnement" dans le dashboard, verifier l'acces au portail Stripe Customer Portal

### Evenements webhook requis

Configurer dans Stripe Dashboard > Webhooks > Events :
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

---

## 3. Pipeline IA -- Test de production

### Pre-requis : Variables d'environnement

| Variable | Usage | Ou la trouver |
|----------|-------|---------------|
| `ANTHROPIC_API_KEY` | Generation de contenu (posts, articles, annonces, scripts) via Claude | console.anthropic.com > API Keys |
| `OPENAI_API_KEY` | Generation d'images (visuels posts Instagram via DALL-E) | platform.openai.com > API Keys |
| `RESEND_API_KEY` | Envoi d'emails (nurturing, welcome, notifications) | resend.com > API Keys |
| `CRON_SECRET` | Authentification des crons (`/api/cron/*`) | Generer un UUID : `uuidgen` ou `openssl rand -hex 32` |

### Test batch complet (1 client)

Scenario : generer un mois complet de contenu pour un client test.

#### Etape 1 : Creer un client test via l'onboarding
1. S'inscrire sur le site avec un email de test
2. Completer l'onboarding avec des donnees realistes (zone: "Lyon 3e", reseau: "IAD", specialite: "Appartements anciens")
3. Noter le `client_id` en DB

#### Etape 2 : Declencher la generation manuelle

```bash
# Via l'API admin (authentifie)
curl -X POST https://immocrew.fr/api/admin/trigger-production \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"clientId": "CLIENT_ID_ICI"}'
```

Ou via le cron hebdomadaire :

```bash
curl -X POST https://immocrew.fr/api/cron/weekly-produce \
  -H "x-cron-secret: $CRON_SECRET"
```

#### Etape 3 : Verifier les livrables generes

Un mois complet doit produire :

| Type | Quantite/mois | Frequence | Verification |
|------|---------------|-----------|--------------|
| Posts reseaux sociaux | 12 | 3/semaine | Dashboard > Mes contenus > Posts |
| Articles SEO | 4 | 1/semaine | Dashboard > Mes contenus > Articles |
| Scripts video | 4 | 1/semaine | Dashboard > Mes contenus > Scripts |
| Annonces immobilieres | 4 | 1/semaine | Dashboard > Mes contenus > Annonces |

#### Etape 4 : Audit qualite par @mandataire

Pour chaque type de livrable, verifier :

**Posts (12)**
- [ ] Personnalises pour la zone du client (nom de ville, quartier, prix au m2)
- [ ] Varier les formats : conseil, temoignage, actu marche, behind-the-scenes
- [ ] Ton du client respecte (formel vs decontracte)
- [ ] Hashtags pertinents et localises
- [ ] Pas de contenu generique copie-collable pour un autre mandataire

**Articles SEO (4)**
- [ ] Titre optimise SEO local (ex: "Acheter a Lyon 3e : guide quartier par quartier")
- [ ] Structure H1/H2/H3 correcte
- [ ] > 800 mots par article
- [ ] Maillage interne vers la landing page mandataire
- [ ] Donnees locales reelles (prix, ecoles, transports)

**Scripts video (4)**
- [ ] Duree cible 30-60 secondes par script
- [ ] Accroche forte en premiere phrase
- [ ] Appel a l'action clair
- [ ] Adapte au format Reel/TikTok

**Annonces (4)**
- [ ] Storytelling (pas juste "bel appartement lumineux")
- [ ] Donnees du bien presentes (surface, prix, quartier)
- [ ] Appel a l'action avec les coordonnees du mandataire
- [ ] Differenciation vs annonce generique

### Monitoring post-lancement

Verifier quotidiennement pendant la premiere semaine :
- [ ] Cron `weekly-produce` tourne sans erreur (logs Replit)
- [ ] Cron `nurturing` envoie les emails J2/J7/J14 aux nouveaux inscrits
- [ ] Cron `generate-articles` produit les articles planifies
- [ ] Aucune erreur `429 Too Many Requests` (rate limiting Claude/OpenAI)
- [ ] Cout API < budget prevu (~3-5EUR/client/mois)

---

## 4. Favicons et Assets (Session 12)

### Fichiers crees automatiquement (Session 12)

| Fichier | Type | Statut |
|---------|------|--------|
| `src/app/icon.svg` | Favicon SVG (32x32) | EXISTAIT |
| `src/app/apple-icon.tsx` | Apple Touch Icon PNG dynamique (180x180) | CREE S12 |
| `src/app/twitter-image.tsx` | Twitter Card PNG dynamique (1200x630) | CREE S12 |
| `src/app/opengraph-image.tsx` | OG Image PNG dynamique (1200x630) | EXISTAIT |
| `src/app/manifest.ts` | PWA manifest (icones SVG + PNG refs) | MIS A JOUR S12 |
| `src/app/layout.tsx` | Metadata complete (icons, theme-color, msapplication, twitter) | MIS A JOUR S12 |
| `public/browserconfig.xml` | Tiles Windows/Bing | CREE S12 |
| `public/safari-pinned-tab.svg` | Safari pinned tab monochrome | CREE S12 |

### PNG a generer manuellement (pour le manifest PWA)

Le manifest reference `icon-192x192.png` et `icon-512x512.png`. Ces fichiers PNG doivent etre generes a partir du SVG source.

**Option 1** : [realfavicongenerator.net](https://realfavicongenerator.net)
1. Uploader `src/app/icon.svg`
2. Couleur theme : `#1B2A4A` (primary)
3. Couleur de fond iOS : `#1B2A4A`
4. Couleur tile Windows : `#1B2A4A`
5. Telecharger le package et placer les PNG dans `public/`

**Option 2** : convertir avec ImageMagick
```bash
convert -background "#1B2A4A" -resize 192x192 src/app/icon.svg public/icon-192x192.png
convert -background "#1B2A4A" -resize 512x512 src/app/icon.svg public/icon-512x512.png
```

**Verification** : [realfavicongenerator.net/favicon_checker](https://realfavicongenerator.net/favicon_checker)

Les specs completes sont dans `docs/design/favicon-assets.md`.

---

## 5. Checklist pre-lancement complete

### DNS & Domaine
- [ ] Domaine `immocrew.fr` reserve et pointe vers Replit
- [ ] Certificat SSL actif (automatique avec Replit Deployments)

### Base de donnees
- [ ] Toutes les migrations 001-019 passees (voir section 1)
- [ ] Backup automatique configure

### Stripe
- [ ] Mode live active (voir section 2)
- [ ] Webhook configure et teste
- [ ] Portail client Stripe active

### Pipeline IA
- [ ] Cles API configurees (voir section 3)
- [ ] Test batch reussi pour 1 client
- [ ] Crons configures dans Replit (weekly-produce, nurturing, generate-articles)

### SEO & Indexation
- [ ] Google Search Console configure (verifier propriete)
- [ ] Bing Webmaster Tools configure
- [ ] Sitemap soumis aux deux moteurs
- [ ] robots.txt verifie

### Analytics
- [ ] Umami Cloud configure (website ID dans layout.tsx)
- [ ] Cookie consent fonctionnel

### Legal
- [ ] CGV publiees et a jour
- [ ] Mentions legales publiees
- [ ] Politique de confidentialite publiee
- [ ] Bandeau cookies fonctionnel
