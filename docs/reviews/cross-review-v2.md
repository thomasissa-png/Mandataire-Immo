# Revue croisee V2 — ImmoCrew — 2026-03-25

> Produit par @reviewer | 2026-03-25
> Revue de suivi : verification des 5 actions prioritaires identifiees en V1
> Verdict : **GO avec reserves mineures**

---

## Resume executif (non-technique)

Les 5 blocages identifies en V1 ont tous ete traites. La migration Supabase vers Replit PostgreSQL est propre -- zero trace de Supabase dans le code ou les dependances. Les pages legales existent et sont completes. Le tracking PostHog couvre 12 des 14 events customs (les 2 manquants sont mineurs). Le webhook Stripe gere maintenant les echecs de paiement. Le SEO technique (sitemap, robots, JSON-LD) est en place. Il reste deux points mineurs avant la mise en production : 2 events de tracking non branches et des placeholders juridiques a remplir avec les vraies coordonnees de la societe.

## Resume technique

- **Coherence globale** : tres bonne — toutes les contradictions bloquantes de V1 sont resolues
- **Blocages critiques** : aucun
- **Recommandation** : GO avec reserves mineures

---

## 1. Corrections validees

| # | Action V1 | Statut | Detail |
|---|-----------|--------|--------|
| 1 | Migration Supabase vers Replit PostgreSQL + Object Storage | **RESOLU** | `src/lib/supabase.ts` supprime. `src/lib/db.ts` (Pool pg natif, parametres securises) et `src/lib/storage.ts` (Replit Object Storage) crees. `grep -r supabase src/` = 0 resultats. `package.json` ne contient pas `@supabase/supabase-js`. Webhook Stripe, leads, admin — tous migres vers `query()` de db.ts. |
| 2 | Pages legales (CGV, mentions legales, confidentialite) | **RESOLU** | 3 pages creees : `/cgv`, `/mentions-legales`, `/confidentialite`. Contenu complet (17 articles CGV, 7 sections mentions, 9 sections privacy). Prix 497/197/97 coherents dans les CGV. Liens inter-pages fonctionnels. Footer pointe vers les 3 pages. Sitemap les inclut. |
| 3 | Events PostHog + bandeau consentement cookies | **PARTIELLEMENT RESOLU** | 12/14 events customs implementes (voir detail ci-dessous). Bandeau cookies present avec opt-out par defaut, boutons Accepter/Refuser, lien vers /confidentialite. RGPD conforme. |
| 4 | Handler `invoice.payment_failed` dans webhook Stripe | **RESOLU** | Handler complet : status client passe a `past_due`, paiement enregistre avec status `failed`, event `payment_failed` tracke server-side. Gestion robuste (verification customerEmail avant tracking). |
| 5 | SEO : sitemap, robots, JSON-LD | **RESOLU** | `sitemap.ts` present (4 URLs, priorites correctes). `robots.ts` present (disallow dashboard/onboarding/admin/api). JSON-LD Organization dans layout.tsx, Service (3 offres avec prix corrects) et FAQPage (6 questions) dans page.tsx. |

---

## 2. Problemes residuels

### 2.1 Events PostHog : 2/14 non branches (MINEUR)

Events definis dans le type `TrackingEvent` mais jamais appeles dans le code :

- **`onboarding_step_abandon`** — defini mais aucun `track("onboarding_step_abandon")` dans le code. La logique de detection d'abandon (fermeture de page, navigation away) n'est pas implementee.
- **`deliverable_download`** — defini mais aucun `track("deliverable_download")` dans le code. Le composant `DeliverableCard.tsx` tracke `deliverable_view` mais pas le download.

Impact : ces 2 events sont P0 dans le tracking-plan.md mais leur absence n'empeche pas le lancement. Ils seront utiles pour l'optimisation du funnel post-lancement.

### 2.2 Placeholders juridiques non remplaces (MINEUR)

Les 3 pages legales contiennent des placeholders a remplacer avant mise en production :
- `[NOM DE LA SOCIETE]`, `[FORME JURIDIQUE]`, `[MONTANT]` (capital)
- `[ADRESSE COMPLETE]`, `[NUMERO SIRET]`, `[NUMERO TVA]`
- `[VILLE DU SIEGE SOCIAL]`, `[PRENOM NOM]` (directeur publication)

Ce sont des informations que seul l'utilisateur peut fournir. Les pages sont structurellement completes mais juridiquement non publiables en l'etat.

### 2.3 Metadata sans accents (TRES MINEUR)

Les `<title>` des pages legales n'ont pas d'accents (`Conditions Generales de Vente` au lieu de `Conditions Generales de Vente`). Le contenu HTML utilise correctement les entites (`&eacute;`, etc.) mais les metadata Next.js sont en texte brut sans accents. Impact SEO negligeable mais perfectible.

---

## 3. Score par phase

| Phase | Completude | Coherence | Actionnabilite | Score moyen |
|-------|------------|-----------|----------------|-------------|
| 0 — Fondations (strategie, personas, brand) | 5/5 | 5/5 | 5/5 | **5.0** |
| 1 — Experience (UX, design, copy) | 5/5 | 5/5 | 5/5 | **5.0** |
| 2 — Developpement (code, infra, tracking) | 5/5 | 5/5 | 4/5 | **4.7** |
| 3 — SEO/GEO | 5/5 | 5/5 | 5/5 | **5.0** |
| 4 — Acquisition (growth, social) | 5/5 | 5/5 | 4/5 | **4.7** |

Phase 2 passe de 3.3 a 4.7 : migration DB propre, tracking quasi-complet, webhook Stripe robuste. -1 en actionnabilite pour les 2 events manquants.

Phase 4 : -1 car les events d'abandon/download alimentent les metriques de retention du growth plan.

---

## 4. Score global

**8.5/10**

Justification :
- +4 points : fondations strategiques impeccables, zero contradiction sur le positionnement/prix/ton entre 14 agents
- +2 points : code propre, migration DB complete, architecture coherente
- +1.5 points : conformite legale et RGPD solide (bandeau, pages, AI Act)
- +1 point : SEO technique complet (sitemap, robots, JSON-LD 3 schemas)
- -0.5 : 2 events tracking P0 non branches
- -0.5 : placeholders juridiques a remplir (dependent de l'utilisateur)
- -0.5 : pas de tests automatises verifies sur les nouveaux composants (pages legales, CookieConsent, tracking)

---

## 5. Verdict final

**GO avec reserves mineures.**

Les reserves ne sont pas bloquantes pour un deploiement en pre-production / beta :

1. **Remplir les placeholders juridiques** dans les 3 pages legales avant tout paiement reel. Responsable : utilisateur.
2. **Brancher `onboarding_step_abandon` et `deliverable_download`** dans le code. Responsable : @fullstack. Estimation : 1-2h.
3. **Ajouter les accents** dans les metadata des pages legales. Responsable : @fullstack. Estimation : 5 min.

Le projet est deployable en l'etat pour du beta-testing. Pour la production avec paiements reels, seul le point 1 (placeholders juridiques) est un prealable non negociable.

---

**Handoff -> @orchestrator**
- Fichiers produits : `docs/reviews/cross-review-v2.md`
- Decisions prises : GO avec reserves mineures (upgrade depuis GO avec reserves de la V1)
- Points d'attention : placeholders juridiques a remplir (utilisateur), 2 events tracking a brancher (@fullstack, 1-2h), accents metadata (@fullstack, 5 min)
- Aucun agent supplementaire a reinvoquer — les reserves sont des finitions, pas des chantiers
