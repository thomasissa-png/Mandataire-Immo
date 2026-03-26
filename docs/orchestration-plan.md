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
- **Statut** : TERMINÉ
- **Livrables reçus** :
  - docs/growth/growth-strategy.md — LIVRÉ (308 lignes, funnel AARRR, unit economics, 4 canaux, scripts DM)
  - docs/social/social-strategy.md — LIVRÉ (337 lignes)
  - docs/social/editorial-calendar.md — LIVRÉ (126 lignes)
  - docs/social/content-templates.md — NON PRODUIT (timeout, reporté)

### Phase 5 — Revue finale + corrections
- **Agents** : @reviewer (x2), @mandataire, @ux, @design, @product-manager
- **Statut** : TERMINÉ
- **Livrables reçus** :
  - docs/reviews/cross-review-report.md — V1 (GO avec réserves)
  - docs/reviews/cross-review-v2.md — V2 (8.5/10, GO avec réserves mineures)
  - docs/reviews/mandataire-audit.md — LIVRÉ (verdict À RETRAVAILLER → corrections appliquées)
  - docs/ux/ux-audit.md — LIVRÉ (7.5/10 → corrections appliquées → ~9/10)
  - docs/design/design-audit.md — LIVRÉ (8.2/10 → corrections WCAG appliquées → ~9.5/10)
- **Corrections appliquées** :
  - Migration Supabase → Replit PostgreSQL (10 fichiers)
  - Pages légales (CGV, mentions, confidentialité)
  - 14/14 events PostHog P0 implémentés
  - invoice.payment_failed webhook handler
  - sitemap.ts, robots.ts, JSON-LD (Organization, Service, FAQPage)
  - Cookie consent RGPD + a11y
  - Faux témoignages → métriques vérifiables
  - CTA Hero corrigé, jargon supprimé, prix reformulé
  - Dashboard vide redesigné
  - Onboarding : sessionStorage + steps optionnelles
  - Contrastes WCAG AA corrigés (3 corrections)
  - aria-hidden sur éléments décoratifs

### Phase 6 — Pipeline IA (TERMINÉE)
- **Agents** : @fullstack, @ia, @product-manager, @mandataire, @reviewer
- **Statut** : TERMINÉ — 9.2/10 revue V3, GO avec reserves mineures corrigees
- **Livrables livres** :
  - src/lib/claude.ts — client Anthropic avec retry backoff
  - src/lib/client-context.ts — compilation donnees onboarding (interface etendue : donnees_locales, histoire, confort_camera)
  - src/lib/enrich-property.ts — enrichissement auto via API Adresse gouv + DVF
  - src/lib/prompts/*.ts — 10 fichiers de prompts (ameliores anti-hallucination, scores 9/10)
  - src/app/api/generate/pack-mensuel/route.ts — 6 types livrables
  - src/app/api/generate/pack-lancement/route.ts — 9 types livrables
  - src/app/api/generate/boost-mandat/route.ts — 5 types livrables
  - src/app/api/admin/trigger-production/route.ts — bouton admin
  - src/app/api/onboarding/route.ts — persistance complete 10 etapes
  - src/app/api/monthly-update/route.ts — formulaire mensuel
  - src/app/api/portal/route.ts — Stripe Customer Portal
  - src/app/api/enrich-property/route.ts — enrichissement auto
  - src/app/dashboard/monthly-update/page.tsx — formulaire mensuel UI
  - src/components/admin/TriggerProductionButton.tsx — bouton trigger
  - sql/003_ai_pipeline.sql — migration DB
  - src/app/icon.svg — favicon
  - docs/ia/onboarding-requirements.md — rapport infos onboarding
  - docs/product/pipeline-audit.md — audit couverture pricing
  - docs/reviews/ — 7 rapports d'audit (Sophie v1+v2, Marc v1+v2, V3, preferences, comparaison Versiroom)
- **Scores qualite** : Sophie 9.06/10, Marc 9.1/10, Reviewer V3 9.2/10
- **Infos VERSI** : SIRET 91286261200013, 54 rue Henri Barbusse, 92000 Nanterre — renseignees dans CGV, mentions legales, confidentialite

---

## Feedbacks remontants
| # | Sévérité | Agent source | Agent cible | Problème | Statut |
|---|---|---|---|---|---|
| 1 | CRITIQUE | @product-manager | @fullstack + @ia | Pipeline IA non codé — cœur du produit absent | SPÉCIFIÉ dans ai-services-roadmap.md, à implémenter |
| 2 | BLOQUANT | @mandataire | fondateur | Placeholders CGV (SIRET, adresse) — bloquant légal | En attente infos société VERSI |
| 3 | CRITIQUE | @product-manager | @fullstack | Données onboarding non persistées en base — seuls email/nom/ville sauvés | À coder |

## Décisions d'arbitrage
| # | Sujet | Décision | Justification | Agents impactés |
|---|---|---|---|---|
| 1 | Base de données | Replit PostgreSQL + Object Storage remplace Supabase | Simplifie la stack, réduit les coûts | @fullstack, @infrastructure |
| 2 | Règle n°5 CLAUDE.md | "Mindset IA, pas équipe humaine" ajoutée | Le pipeline IA avait été oublié — cette règle empêche la répétition | Tous les agents |
| 3 | Kit graphique | Non automatisable — brief graphique IA en P0, Canva en P1, freelance en P2 | LLM texte ne produit pas de fichiers Canva vectoriels | @fullstack, @design |

---

## Journal d'avancement
- **2026-03-25 S1** : Initialisation. project-context.md validé. Plan créé. Phase 0 lancée.
- **2026-03-25 S1** : Phase 0 terminée (brand-platform, personas, roadmap, specs, KPIs, tracking, legal, agent @mandataire).
- **2026-03-25 S1** : Phase 1 terminée (UX, design, copy, audit créatif).
- **2026-03-25 S1** : Phase 2 lancée. @infrastructure bloqué par rate limit API.
- **2026-03-25 S2** : Phase 2 terminée (@infrastructure + @fullstack 26 fichiers + @qa 66 tests).
- **2026-03-25 S2** : Phase 3 terminée (@seo + @geo, 6 livrables).
- **2026-03-25 S2** : Phase 4 lancée (@growth + @social).
- **2026-03-25 S3** : Phase 4 terminée (@growth + @social livrés).
- **2026-03-25 S3** : Phase 5 — Revue V1 (@reviewer), V2, corrections blockers (DB migration, legal, PostHog, SEO).
- **2026-03-25 S3** : Audits frontend : @mandataire (À RETRAVAILLER → corrections), @ux (7.5→9/10), @design (8.2→9.5/10).
- **2026-03-25 S3** : DÉCOUVERTE CRITIQUE — pipeline IA non codé. Postmortem + roadmap services IA par @product-manager.
- **2026-03-25 S3** : Règle n°5 ajoutée à CLAUDE.md : "Mindset IA, pas équipe humaine".
- **2026-03-25 S3** : Clôture session. Phase 6 (pipeline IA) préparée mais non lancée.

## État pour reprise prochaine session
- **Phases terminées** : 0, 1, 2, 3, 4, 5
- **Phase en cours** : 6 (pipeline IA) — spécifiée, non codée
- **Chantier critique** : implémenter le pipeline IA (docs/product/ai-services-roadmap.md)
- **Blockers** : infos société VERSI pour placeholders CGV
- **Pour reprendre** : voir mémo de reprise ci-dessous dans project-context.md
