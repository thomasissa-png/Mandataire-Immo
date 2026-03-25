# Plan d'orchestration — ImmoCrew

## Demande utilisateur
Lancer le projet ImmoCrew en mode autopilot : service de marketing IA pour mandataires immobiliers indépendants. Séquencer toutes les phases (0→5) avec parallélisation, checkpoints, vérification de drift, et enrichissement de project-context.md à chaque phase.

## Mode détecté
Nouveau projet — Stade "Idée", historique quasi-vide (1 entrée @elon uniquement)

## Profil utilisateur
- Niveau technique : Technique (framework multi-agents, stack Next.js/Supabase)
- Ton de communication : Mixte (technique + métier)
- Mode d'interaction : Autopilot (demandé explicitement)

## Complexité estimée
Lourde — ~12 agents, 5 phases, nécessitera 2-3 sessions

## Type de projet
SaaS + Service productisé — le contenu marketing EST le produit. L'ordre est adapté en conséquence.

---

## Plan par phase

### Phase 0 — Fondations stratégiques
- **Agents** : @creative-strategy, @product-manager, @data-analyst, @legal
- **Parallélisation** : @creative-strategy + @legal en parallèle (batch 1), puis @agent-factory (batch 1b, crée @mandataire à partir des personas), puis @product-manager (batch 2, dépend de brand-platform), puis @data-analyst (batch 3, dépend de product-vision + persona)
- **Statut** : TERMINÉ (validé par utilisateur 2026-03-25)
- **Livrables attendus** :
  - docs/strategy/brand-platform.md (@creative-strategy)
  - docs/strategy/personas.md (@creative-strategy)
  - docs/product/product-vision.md (@product-manager)
  - docs/product/roadmap.md (@product-manager)
  - docs/product/functional-specs.md (@product-manager)
  - docs/analytics/kpi-framework.md (@data-analyst)
  - docs/analytics/tracking-plan.md (@data-analyst)
  - docs/legal/legal-audit.md (@legal)
  - docs/legal/rgpd-checklist.md (@legal)
- **Livrables reçus** :
  - docs/strategy/brand-platform.md (221 lignes) — OK
  - docs/strategy/personas.md (371 lignes) — OK
  - docs/legal/legal-audit.md (302 lignes) — OK
  - docs/product/product-vision.md (165 lignes) — OK
  - docs/product/functional-specs.md (828 lignes) — OK
  - docs/product/roadmap.md (144 lignes) — OK
  - .claude/agents/mandataire.md (231 lignes) — OK (agent @mandataire créé par @agent-factory)
  - docs/analytics/kpi-framework.md (~500 lignes) — OK
  - docs/analytics/tracking-plan.md (~500 lignes) — OK
  - docs/legal/rgpd-checklist.md — NON PRODUIT (fusionné dans legal-audit.md)
- **Verdict vérification** :
  - @creative-strategy : OK (brand-platform complet et différenciant, personas détaillés avec verbatims)
  - @legal : OK (RGPD + AI Act + CGV + Hoguet couverts, 3 points marqués "À vérifier avec juriste")
  - @agent-factory : OK (agent @mandataire fonctionnel, grille 8 critères)
  - @product-manager : OK (vision + specs 828 lignes + roadmap 6 mois)
  - @data-analyst : OK (KPI framework AARRR 40+ KPIs, tracking plan 22 events PostHog)
- **Checkpoint utilisateur** : VALIDÉ par l'utilisateur (2026-03-25). Positionnement confirmé comme clé de succès.

### Phase 1 — Expérience utilisateur
- **Agents** : @ux, @design, @copywriter, @creative-strategy (audit critique)
- **Parallélisation** : @ux d'abord (batch 1), puis @design + @copywriter en parallèle (batch 2), @creative-strategy audit en parallèle
- **Statut** : TERMINÉ
- **Livrables attendus** :
  - docs/ux/user-flows.md
  - docs/ux/wireframes.md
  - docs/design/design-system.md
  - docs/design/design-tokens.json
  - docs/copy/landing-page-copy.md
  - docs/copy/brand-voice.md

### Phase 2 — Développement
- **Agents** : @infrastructure, @fullstack, @qa
- **Parallélisation** : @infrastructure d'abord (batch 1), puis @fullstack (batch 2), puis @qa (batch 3)
- **Statut** : TERMINÉ
- **Livrables reçus** :
  - docs/infra/infrastructure.md — LIVRÉ (700 lignes, 12 sections)
  - src/ (code application) — LIVRÉ (26 fichiers, landing + API + dashboard + onboarding + admin)
  - .env.example — LIVRÉ (16 env vars)
  - docs/qa/qa-strategy.md + tests/ — LIVRÉ (66 tests, 7 suites, 3.4s)
  - docs/qa/TESTING.md — LIVRÉ
  - vitest.config.ts — LIVRÉ
- **Escalations** : 15 events PostHog P0 manquants, invoice.payment_failed non géré dans webhook Stripe
- **Décision utilisateur** : DB changée de Supabase → Replit PostgreSQL + Object Storage (code à adapter)

### Phase 3 — Contenu & SEO
- **Agents** : @seo, @geo
- **Parallélisation** : @seo + @geo en parallèle
- **Statut** : TERMINÉ
- **Livrables reçus** :
  - docs/seo/seo-strategy.md — LIVRÉ (stratégie complète, cocon 4 piliers, timeline M1-M6)
  - docs/seo/keyword-map.md — LIVRÉ (6 clusters, 50+ mots-clés)
  - docs/seo/metadata-templates.md — LIVRÉ (code TS intégrable, sitemap, robots, JSON-LD)
  - docs/geo/geo-strategy.md — LIVRÉ (visibilité LLM, monitoring, baseline zéro confirmé)
  - docs/geo/content-restructuring.md — LIVRÉ (audit landing, Schema.org specs)
  - docs/geo/llm-content-templates.md — LIVRÉ (5 templates contenu LLM-friendly)

### Phase 4 — Acquisition
- **Agents** : @growth, @social
- **Parallélisation** : @growth + @social en parallèle
- **Statut** : EN COURS
- **Livrables attendus** :
  - docs/growth/growth-strategy.md
  - docs/social/social-strategy.md
  - docs/social/editorial-calendar.md

---

## Feedbacks remontants
| # | Sévérité | Agent source | Agent cible | Problème | Statut |
|---|---|---|---|---|---|

## Décisions d'arbitrage
| # | Sujet | Décision | Justification | Agents impactés |
|---|---|---|---|---|

---

## Journal d'avancement
- **2026-03-25** : Initialisation. project-context.md validé (qualité OK sur tous les champs critiques). Plan créé. Phase 0 lancée.
- **2026-03-25** : Batch 1 Phase 0 lancé : @creative-strategy + @legal en parallèle.
- **2026-03-25** : Demande utilisateur ajoutée — créer un agent @mandataire via @agent-factory après livraison des personas par @creative-strategy. Cet agent servira de "testeur métier" pour toutes les revues.
- **2026-03-25** : Phase 0 terminée et validée par l'utilisateur. Positionnement confirmé.
- **2026-03-25** : Phase 1 terminée. @ux, @design, @copywriter livrés. Directive IA ajoutée au brand-platform.
- **2026-03-25** : Audit critique @creative-strategy livré. Corrections : marché 80K→40-50K, LinkedIn 20%→10-15%, objection ChatGPT Thomas ajoutée.
- **2026-03-25** : Phase 2 lancée. @infrastructure bloqué par rate limit API — à relancer en prochaine session.
- **2026-03-25** : Session 2. @infrastructure relancé et livré (700 lignes, schéma SQL 8 tables, config Replit/Clerk/Stripe/PostHog, pipeline IA, sécurité, coûts).
- **2026-03-25** : @fullstack livré (26 fichiers). Landing page 9 composants, 4 API routes, dashboard client, onboarding wizard 7 étapes, admin. TypeScript strict, 0 erreurs.
- **2026-03-25** : @qa lancé (stratégie + tests Vitest + config).
- **2026-03-25** : @qa livré (66 tests, 7 suites). Escalations : 15 events PostHog manquants, invoice.payment_failed absent.
- **2026-03-25** : Phase 3 lancée. @seo + @geo en parallèle.
- **2026-03-25** : @geo livré (3 fichiers). Baseline zéro confirmé, page comparatif Cocoon-Immo prioritaire.
- **2026-03-25** : @seo livré (3 fichiers). 50+ mots-clés, fenêtre "mandataire" confirmée vs "agence" Cocoon-Immo.
- **2026-03-25** : Décision utilisateur : Replit PostgreSQL + Object Storage remplace Supabase.
- **2026-03-25** : Phase 4 lancée. @growth + @social en parallèle.

## État pour reprise prochaine session
- **Phases terminées** : 0, 1, 2, 3
- **Phase en cours** : 4 (acquisition) — @growth + @social lancés
- **Phases à faire** : 3 (SEO/GEO), 4 (acquisition), revue finale
- **Pour reprendre** : lire project-context.md + docs/orchestration-plan.md, vérifier si @qa a terminé, puis lancer Phase 3
