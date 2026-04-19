# Plan d'orchestration -- ImmoCrew Session 12

## Demande utilisateur
Session 12 : Production assets (favicons/icones/OG), documentation migrations SQL 010-014, Stripe prod setup doc, pipeline IA test doc. Branche renommee en `claude/immocrew-s12-prod-assets-bg1w0`.

## Mode detecte
Projet existant (Stade: V1 avancee, 11 sessions precedentes) -- phases ciblees uniquement

## Profil utilisateur
- Niveau technique : Expert
- Ton de communication : Technique
- Mode d'interaction : Autopilot (feu vert explicite)

## Complexite estimee
Moyenne -- orchestrateur direct (pas de delegation agents), 1 session

Estimation de cout : ~$0 (pas de Task agents lances — tout execute par l'orchestrateur)

## Plan par mission

### Mission 0 -- Renommage branche + propagation
- Action : `git branch -m` + Grep/replace ancien nom
- Statut : COMPLETE
- Resultat : branche renommee, aucune reference residuelle detectee

### Mission 1 -- Favicons + icones
- 1.1 Audit public/ + specs : COMPLETE (Read/Glob direct, specs dans `docs/design/favicon-assets.md`)
- 1.2 Creation fichiers : COMPLETE
  - `src/app/twitter-image.tsx` : CREE (1200x630 PNG dynamique, meme design que opengraph-image.tsx)
  - `src/app/apple-icon.tsx` : CREE (180x180 PNG dynamique, remplace le SVG non-supporté par iOS)
  - `src/app/manifest.ts` : MIS A JOUR (ajout icons PNG 192x192 + 512x512)
  - `src/app/layout.tsx` : MIS A JOUR (icons metadata complete, theme-color, msapplication, twitter, mask-icon, manifest ref, JSON-LD logo corrige)
  - `public/browserconfig.xml` : CREE (tiles Windows/Bing, TileColor #1B2A4A)
  - `public/safari-pinned-tab.svg` : CREE (monochrome noir, maison stylisee)
- 1.3 Verification SEO : COMPLETE (checklist 12 points PASS)
- 1.4 Tests presence favicons : COMPLETE (`src/__tests__/lib/favicon-assets.test.ts`, 29 tests)
- Statut : COMPLETE
- Note : PNG 192x192 et 512x512 pour le manifest doivent etre generes manuellement (voir REPLIT_ACTIONS.md)

### Mission 2 -- Migrations SQL 010-014 (documentation)
- Action : Read/validate + REPLIT_ACTIONS.md
- Statut : COMPLETE
- Verification : 5 fichiers existent, syntaxe correcte, idempotents (IF NOT EXISTS), rollback documente

### Mission 3 -- Stripe prod setup (documentation)
- Action : verifier stripe-setup.ts + documenter dans REPLIT_ACTIONS.md
- Statut : COMPLETE
- Verification : script idempotent, 4 produits/prix, env vars documentees, checklist E2E

### Mission 4 -- Test pipeline IA (documentation)
- Action : documenter dans REPLIT_ACTIONS.md
- Statut : COMPLETE
- Verification : 4 env vars, batch test 1 client, checklist qualite, monitoring post-lancement

### Mission 5 -- Commit & push
- Statut : EN COURS

## Fichiers crees/modifies cette session

| Fichier | Action | Mission |
|---------|--------|---------|
| `src/app/twitter-image.tsx` | CREE | M1 |
| `src/app/apple-icon.tsx` | CREE | M1 |
| `src/app/manifest.ts` | MODIFIE | M1 |
| `src/app/layout.tsx` | MODIFIE | M1 |
| `public/browserconfig.xml` | CREE | M1 |
| `public/safari-pinned-tab.svg` | CREE | M1 |
| `docs/design/favicon-assets.md` | CREE | M1 |
| `src/__tests__/lib/favicon-assets.test.ts` | CREE | M1 |
| `REPLIT_ACTIONS.md` | CREE | M2-4 |
| `docs/orchestration-plan.md` | MODIFIE | M0-5 |

## Metriques live
| Phase | Agents | Paralleles | Relances | P0 | Cout estime | Statut |
|---|---|---|---|---|---|---|
| M0 | 0 | 0 | 0 | 0 | $0 | COMPLETE |
| M1 | 0 | 0 | 0 | 0 | $0 | COMPLETE |
| M2-4 | 0 | 0 | 0 | 0 | $0 | COMPLETE |
| M5 | 0 | 0 | 0 | 0 | $0 | EN COURS |

<!-- SESSION: phases=4 tasks_prod=0 tasks_consult=0 -->
