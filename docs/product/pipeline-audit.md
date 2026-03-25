# Audit Croise Pipeline IA — ImmoCrew

> Produit par @product-manager | 2026-03-25
> Sources auditees : project-context.md, docs/product/ai-services-roadmap.md, src/lib/claude.ts, src/lib/client-context.ts, src/lib/prompts/ (8 fichiers), src/app/api/generate/ (3 routes), src/app/api/admin/trigger-production/route.ts, src/app/api/onboarding/route.ts, src/app/api/portal/route.ts, src/app/dashboard/page.tsx

---

## 1. Matrice de couverture

### Legende

- **Prompt** : fichier existant dans `src/lib/prompts/`
- **Route API** : logique presente dans la route `/api/generate/`
- **Insert DB** : insertion dans la table `deliverables` codee
- **Dashboard** : affichage des livrables dans le dashboard client
- **Verdict** : OK / PARTIEL / MANQUANT / NON AUTOMATISABLE

---

### 1.1 Pack Lancement (497€ — one-shot)

| # | Livrable promis (pricing) | Prompt | Route API | Insert DB | Dashboard | Verdict |
|---|--------------------------|--------|-----------|-----------|-----------|---------|
| L1 | Positionnement + mise en avant expertise | `positioning-statement.ts` | `pack-lancement/route.ts` | OUI (type `article_seo`, sub_type `positioning_statement`) | OUI (affiché comme type `article_seo`) | **OK** |
| L2 | Bio optimisée (tous profils) | `bio-multiformat.ts` | `pack-lancement/route.ts` | OUI (type `post`, sub_type `bio_multiformat`) | **PARTIEL** — le type `post` masque qu'il s'agit d'une bio ; le TYPE_LABELS du dashboard affiche "Post" au lieu de "Bio" | **PARTIEL** — type DB ambigu |
| L3 | 5 templates annonces storytelling | `annonce-storytelling.ts` | `pack-lancement/route.ts` | OUI (type `annonce`, x5) | OUI | **OK** |
| L4 | 5 articles SEO local | `article-seo.ts` | `pack-lancement/route.ts` | OUI (type `article_seo`, x5) | OUI | **OK** |
| L5 | Calendrier éditorial 30 jours | ABSENT — aucun fichier `editorial-calendar.ts` | ABSENT — non géneré dans la route | NON | NON | **MANQUANT (bloquant)** |
| L6 | 20 posts prêts à publier | `post-social.ts` | `pack-lancement/route.ts` | OUI (type `post`, x20) | OUI | **OK** |
| L7 | 10 scripts Reels | `script-video.ts` | `pack-lancement/route.ts` | OUI (type `script_video`, x10) | OUI | **OK** |
| L8 | Kit graphique personnalisé | NON AUTOMATISABLE (décision roadmap) — brief graphique généré manuellement en statique dans la route (contenu hardcodé, pas d'appel IA) | Route insere un brief statique (pas de prompt IA) | OUI (type `post`, sub_type `design_brief`) | OUI (affiché comme "Post") | **PARTIEL** — le brief graphique est inséré en base sans appel Claude ; le dashboard affiche "Post" au lieu de "Brief graphique" |

**Bilan Pack Lancement : 5 OK / 2 PARTIEL / 1 MANQUANT**

---

### 1.2 Pack Mensuel (197€/mois — récurrent)

| # | Livrable promis (pricing) | Prompt | Route API | Insert DB | Dashboard | Verdict |
|---|--------------------------|--------|-----------|-----------|-----------|---------|
| M1 | 12 posts réseaux sociaux | `post-social.ts` | `pack-mensuel/route.ts` | OUI (type `post`, x12) | OUI | **OK** |
| M2 | 4 scripts vidéo | `script-video.ts` | `pack-mensuel/route.ts` | OUI (type `script_video`, x4) | OUI | **OK** |
| M3 | 2 articles SEO local | `article-seo.ts` | `pack-mensuel/route.ts` | OUI (type `article_seo`, x2) | OUI | **OK** |
| M4 | 1 newsletter | `newsletter.ts` | `pack-mensuel/route.ts` | OUI (type `newsletter`) | OUI | **OK** |
| M5 | 4 annonces immobilières personnalisées | `annonce-storytelling.ts` | `pack-mensuel/route.ts` | OUI (type `annonce`, x4) | OUI | **OK** |
| M6 | 1 email prospection vendeurs | `email-prospection.ts` | `pack-mensuel/route.ts` | OUI (type `email_prospection`) | OUI | **OK** |

**Bilan Pack Mensuel : 6/6 OK**

---

### 1.3 Boost Mandat (97€/bien — ponctuel)

| # | Livrable promis (pricing) | Prompt | Route API | Insert DB | Dashboard | Verdict |
|---|--------------------------|--------|-----------|-----------|-----------|---------|
| B1 | Annonce storytelling du bien | `annonce-storytelling.ts` | `boost-mandat/route.ts` | OUI (type `annonce`, metadata `boost: true`) | OUI | **OK** |
| B2 | 3 posts dédiés + 1 Reel | `post-social.ts` + `script-video.ts` | `boost-mandat/route.ts` | OUI (3 posts + 1 script_video, metadata `boost: true`) | OUI | **OK** |
| B3 | Mini landing page du bien | ABSENT — aucun prompt `landing-bien.ts` | ABSENT — non générée dans la route | NON | NON | **MANQUANT (bloquant)** |
| B4 | Email blast acheteurs | `email-prospection.ts` (type_email `blast_acheteurs`) | `boost-mandat/route.ts` | OUI (type `email_prospection`, sub_type `email_blast_acheteurs`) | OUI | **OK** |

**Bilan Boost Mandat : 3 OK / 1 MANQUANT**

---

### Synthese globale

| Pack | Total livrables | OK | PARTIEL | MANQUANT | NON AUTOMATISABLE |
|------|-----------------|-----|---------|----------|-------------------|
| Pack Lancement | 8 | 5 | 2 (L2, L8) | 1 (L5) | 0 |
| Pack Mensuel | 6 | 6 | 0 | 0 | 0 |
| Boost Mandat | 4 | 3 | 0 | 1 (B3) | 0 |
| **TOTAL** | **18** | **14** | **2** | **2** | **0** |

---

## 2. Gaps identifies

### 2.1 Parcours Sophie — etape par etape

**Etape 1 : Payer**
Statut : OK. Stripe est integre, le webhook met a jour la table `clients`. Non audite ici mais present dans le repo selon la roadmap.

**Etape 2 : Remplir l'onboarding**
Statut : OK avec un bémol.

La route `POST /api/onboarding` persiste bien les données en JSONB dans la colonne `client_context` de la table `clients` via UPSERT sur `clerk_user_id`. Le `client-context.ts` parse correctement ce JSONB avec fallbacks et normalisation.

Bémol identifié : la route onboarding fait un UPSERT sur `clerk_user_id` mais la route `getClientContext` fait une requete `SELECT ... WHERE id = $1` (colonne `id`, pas `clerk_user_id`). La route de génération reçoit un `client_id` (colonne `id` UUID). Il faut vérifier que la table `clients` a bien une colonne `id` distincte du `clerk_user_id`, et que l'admin dispose de cet `id` pour déclencher la production. Ce n'est pas bloquant si la table a bien les deux colonnes, mais c'est un point de risque opérationnel.

**Etape 3 : Recevoir ses livrables dans son dashboard**
Statut : PARTIEL — deux gaps actifs.

Gap 1 — Le dashboard filtre `status = 'delivered'` uniquement. Toutes les routes de génération insèrent les livrables avec `status = 'draft'`. Il n'existe aucune route, aucun script, aucune logique de passage `draft → delivered` dans les fichiers audités. Consequence directe : Sophie ne verra jamais ses livrables dans le dashboard, même si la génération fonctionne parfaitement.

Gap 2 — Le livrable L5 (calendrier editorial 30 jours) et le livrable B3 (mini landing page) ne sont pas générés. Pour un client Pack Lancement, les livrables promis au pricing (20 posts, 5 articles, 5 annonces, 10 scripts, **calendrier editorial**, kit graphique) ne correspondent pas à ce que reçoit vraiment Sophie — le calendrier éditorial est absent.

**Etape 4 : Copier / télécharger les livrables**
Statut : NON AUDITÉ dans cette session — le composant `DeliverableCard` est référencé dans le dashboard mais le fichier `src/components/dashboard/DeliverableCard.tsx` n'a pas été lu. Il faut vérifier que ce composant expose bien un bouton "Copier" ou un lien de téléchargement.

---

### 2.2 Liste exhaustive des gaps bloquants

**GAP 1 — BLOQUANT CRITIQUE : aucun mécanisme `draft → delivered`**

Tous les livrables sont insérés avec `status = 'draft'`. Le dashboard ne requete que `status = 'delivered'`. L'espace client sera donc toujours vide, même après une génération réussie. Il manque :
- Soit une route admin `POST /api/admin/approve-deliverables` qui passe les livrables d'un client de `draft` à `delivered`
- Soit une modification du dashboard pour afficher les livrables `draft` (avec une bannière "En cours de validation")
- Soit une logique dans les routes de génération pour passer directement en `delivered` si aucune QA humaine n'est requise

**GAP 2 — BLOQUANT : L5 absent (calendrier éditorial 30 jours — Pack Lancement)**

Le calendrier éditorial est explicitement listé dans le pricing du Pack Lancement (497€). Il n'existe aucun prompt `editorial-calendar.ts` dans `src/lib/prompts/` et la route `pack-lancement/route.ts` ne génère pas ce livrable. Ce gap constitue un écart entre ce que Sophie paie et ce qu'elle reçoit.

**GAP 3 — BLOQUANT : B3 absent (mini landing page — Boost Mandat)**

La mini landing page du bien est explicitement promise dans le pricing du Boost Mandat (97€/bien). Il n'existe aucun prompt `landing-bien.ts` et la route `boost-mandat/route.ts` ne génère pas ce livrable. Même constat : écart pricing vs livraison réelle.

**GAP 4 — RISQUE OPERATIONNEL : ambiguïté client_id vs clerk_user_id**

La route onboarding identifie le client par `clerk_user_id`. La route `getClientContext` identifie le client par `id` (UUID interne). L'admin doit connaitre l'`id` UUID pour déclencher la production — si ce n'est pas exposé dans l'interface admin, le déclenchement est impossible en pratique.

**GAP 5 — QUALITE : types DB ambigus pour L2 et L8**

- L2 (Bio multiformat) est stockée avec `type = 'post'` — elle s'affiche "Post" dans le dashboard alors que c'est une bio
- L8 (Brief graphique) est stocké avec `type = 'post'` — il s'affiche "Post" alors que c'est un brief graphique
- Le dashboard ne différencie pas ces sous-types via `metadata.sub_type`, ce qui nuit à l'expérience Sophie

**GAP 6 — NON VÉRIFIÉ : composant DeliverableCard**

Le fichier `src/components/dashboard/DeliverableCard.tsx` n'a pas été audité. Il est impossible de confirmer que Sophie peut copier ou télécharger ses livrables depuis le dashboard.

---

## 3. Checklist regle n°5 (pipeline IA obligatoire)

- [x] `src/lib/claude.ts` existe et est fonctionnel — client Anthropic initialisé, retry avec backoff exponentiel, `generate()` et `generateJSON()` exportés
- [x] Chaque type de livrable automatisable a un prompt dans `src/lib/prompts/` — 8 fichiers présents (post-social, annonce-storytelling, article-seo, script-video, newsletter, email-prospection, positioning-statement, bio-multiformat)
- [ ] Chaque type de livrable **promis au pricing** a un prompt — ECHEC : `editorial-calendar.ts` absent (L5), `landing-bien.ts` absent (B3)
- [x] Au moins une route `/api/generate/` est testable — 3 routes présentes et appelant réellement Claude API via `generateJSON()`
- [x] Un livrable de test pourrait être généré et inséré dans la table `deliverables` — OUI, la logique d'insertion est codée avec `INSERT INTO deliverables`
- [ ] Le dashboard client **affiche** les livrables — ECHEC : le dashboard filtre `status = 'delivered'` mais les routes insèrent en `status = 'draft'`. Sophie ne verra rien.

**Score checklist : 4/6 — 2 points bloquants**

---

## 4. Recommandations par priorité

### P0 — A faire avant le premier client (bloquant)

**R1 — Corriger le filtre dashboard `draft → delivered` (effort : 2h)**

Choisir une des trois options et l'implémenter :

Option A (recommandée pour MVP) : modifier le dashboard pour afficher les livrables en `status IN ('draft', 'delivered')` avec un badge visuel "En préparation" pour les `draft`. C'est la solution la plus rapide et elle permet à Sophie de voir ses livrables dès la génération, avec un message clair.

Option B : ajouter une route admin `POST /api/admin/approve-deliverable` qui passe un livrable de `draft` à `delivered`. Cohérent avec le workflow QA humaine décrit dans ai-services-roadmap.md, mais ajoute une étape manuelle.

Option C : passer directement en `status = 'delivered'` dans les routes de génération. Supprime la QA humaine — acceptable uniquement si les prompts sont validés.

**R2 — Créer le prompt et la logique de génération pour L5 (calendrier éditorial 30 jours) (effort : 3h)**

- Créer `src/lib/prompts/editorial-calendar.ts` avec le format JSON `{date, platform, type, sujet, angle, hashtags[]}` décrit dans ai-services-roadmap.md section 2.1
- Ajouter la génération dans `pack-lancement/route.ts` après L6
- Ajouter un type `calendrier` dans TYPE_LABELS et TYPE_COLORS du dashboard

**R3 — Vérifier et documenter le flux client_id pour l'admin (effort : 1h)**

Vérifier que l'interface admin expose l'`id` UUID des clients (pas seulement leur email ou leur `clerk_user_id`), pour que le trigger de production soit opérationnel.

---

### P1 — Avant la généralisation (mois 1)

**R4 — Créer le prompt et la logique pour B3 (mini landing page) (effort : 5h)**

- Créer `src/lib/prompts/landing-bien.ts` — génère du HTML standalone avec les données du bien
- Ajouter la génération dans `boost-mandat/route.ts`
- Stocker le HTML dans la table `deliverables` (type `landing_page`)
- Ajouter le type au dashboard avec un lien d'aperçu

La roadmap classe B3 en P1 (priorité mois 2) ce qui est cohérent — mais il faut informer Sophie au moment de l'achat que la landing page est livrée sous 48-72h, pas en instantané.

**R5 — Corriger les types DB pour L2 et L8 (effort : 1h)**

- L2 : changer `type` de `'post'` à `'bio'` (ou ajouter `'bio'` dans DeliverableType)
- L8 : changer `type` de `'post'` à `'brief_graphique'`
- Mettre à jour TYPE_LABELS et TYPE_COLORS dans le dashboard

**R6 — Auditer DeliverableCard pour la copie/téléchargement (effort : 0.5h)**

Lire `src/components/dashboard/DeliverableCard.tsx` et vérifier que Sophie peut copier le contenu en un clic. Si absent, ajouter un bouton "Copier le texte" (clipboard API) et un bouton "Télécharger (.txt ou .md)".

---

### P2 — Amélioration continue (mois 2+)

**R7 — Ajouter un prompt `design_brief` IA pour L8 (effort : 2h)**

Actuellement, le brief graphique est un texte statique assemblé sans appel Claude. Créer un prompt `design-brief.ts` qui génère un vrai brief personnalisé (palette couleurs, typos, moodboard textuel) en appelant `generateJSON()`. C'est une amélioration de la valeur perçue du Pack Lancement.

**R8 — Cron job pour déclenchement mensuel automatique (effort : 3h)**

Automatiser le déclenchement du Pack Mensuel via un cron (Vercel Cron ou équivalent Replit) — sans ça, l'admin doit déclencher manuellement chaque mois pour chaque client.

---

## Hypotheses a valider

- [HYPOTHESE : la table `clients` a bien une colonne `id` (UUID) distincte de `clerk_user_id` — à confirmer avec le schema DB]
- [HYPOTHESE : le composant `DeliverableCard` expose une fonctionnalité de copie — à confirmer par lecture du fichier]
- [HYPOTHESE : le webhook Stripe crée bien la ligne client en DB avec les colonnes `email`, `id`, `pack`, `stripe_customer_id` — non audité dans cette session]

---

*Document produit dans le cadre du framework Gradient Agents.*
*Référence : project-context.md, docs/product/ai-services-roadmap.md, src/lib/, src/app/api/generate/, src/app/dashboard/*
