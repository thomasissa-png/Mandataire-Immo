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
- **Statut** : EN COURS
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
  - docs/analytics/kpi-framework.md — EN COURS (@data-analyst)
  - docs/analytics/tracking-plan.md — EN COURS (@data-analyst)
  - docs/legal/rgpd-checklist.md — NON PRODUIT (fusionné dans legal-audit.md)
- **Verdict vérification** :
  - @creative-strategy : OK (brand-platform complet et différenciant, personas détaillés avec verbatims)
  - @legal : OK (RGPD + AI Act + CGV + Hoguet couverts, 3 points marqués "À vérifier avec juriste")
  - @agent-factory : OK (agent @mandataire fonctionnel, grille 8 critères)
  - @product-manager : OK (vision + specs 828 lignes + roadmap 6 mois)
  - @data-analyst : EN COURS
- **Checkpoint utilisateur** : OBLIGATOIRE après Phase 0 — en attente de @data-analyst

### Phase 1 — Expérience utilisateur
- **Agents** : @ux, @design, @copywriter
- **Parallélisation** : @ux d'abord, puis @design + @copywriter en parallèle (brand-platform disponible)
- **Statut** : En attente
- **Livrables attendus** :
  - docs/ux/user-flows.md
  - docs/ux/wireframes.md
  - docs/design/design-system.md
  - docs/design/design-tokens.json
  - docs/copy/landing-page-copy.md
  - docs/copy/brand-voice.md

### Phase 2 — Développement
- **Agents** : @infrastructure, @fullstack, @qa
- **Parallélisation** : @infrastructure d'abord (setup), puis @fullstack, puis @qa
- **Statut** : En attente
- **Livrables attendus** :
  - docs/infra/infrastructure.md
  - src/ (code application)
  - docs/qa/qa-strategy.md + tests/

### Phase 3 — Contenu & SEO
- **Agents** : @seo, @geo
- **Parallélisation** : @seo d'abord, puis @geo
- **Statut** : En attente
- **Livrables attendus** :
  - docs/seo/seo-strategy.md
  - docs/seo/keyword-map.md
  - docs/geo/geo-strategy.md

### Phase 4 — Acquisition
- **Agents** : @growth, @social
- **Parallélisation** : @growth d'abord, puis @social
- **Statut** : En attente
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
