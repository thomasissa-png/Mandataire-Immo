# Revue croisee V3 — ImmoCrew — 2026-03-26

## Score global : 9.2/10 — GO avec reserves mineures

**Progression : V1 (non score) -> V2 (8.5/10) -> V3 (9.2/10) = +0.7 point**

---

## Resume executif

Le pipeline IA est complet et fonctionnel. Les 3 gaps bloquants de la V2 (calendrier editorial absent, landing bien absente, dashboard vide car filtre delivered-only) sont tous corriges. Sophie paie, remplit son onboarding en 10 etapes, l'admin declenche la production, les livrables apparaissent dans le dashboard avec badge "En preparation", et Sophie peut copier le texte en un clic. Les scores mandataire (Sophie 9.06/10, Marc 9.1/10) confirment que la qualite des outputs IA est au niveau. Il reste 2 reserves mineures non bloquantes.

## Resume technique

- **18/18 livrables promis au pricing** ont leur prompt + route API + insertion DB + affichage dashboard
- **10 prompts** dans `src/lib/prompts/`, **3 routes generate**, **1 trigger admin**, **1 enrichissement DVF**
- **Securite** : auth Clerk sur toutes les routes, admin check sur les routes generate, requetes SQL parametrees, pas de secrets en dur
- **Checklist regle n6** : 6/6 OK (vs 4/6 en V2)

---

## Contradictions avec l'audit V2 (pipeline-audit.md) — toutes resolues

| Gap V2 | Statut V3 | Preuve |
|---------|-----------|--------|
| GAP 1 — dashboard filtre `delivered` only | CORRIGE | `status IN ('draft', 'delivered')` ligne 79 dashboard |
| GAP 2 — L5 calendrier editorial absent | CORRIGE | `editorial-calendar.ts` existe, appele dans pack-lancement |
| GAP 3 — B3 landing bien absente | CORRIGE | `landing-bien.ts` existe, appele dans boost-mandat |
| GAP 4 — ambiguite client_id vs clerk_user_id | ACCEPTE | onboarding via clerk_user_id, generate via id UUID — coherent si la table a les 2 colonnes |
| GAP 5 — types DB ambigus L2/L8 | NON CORRIGE | bio et brief stockes comme type `post`, dashboard affiche "Post" |
| GAP 6 — DeliverableCard copie/telechargement | CORRIGE | bouton "Copier le texte" present, clipboard API |

---

## Reserves mineures (non bloquantes)

### 1. Types DB ambigus pour bio (L2) et brief graphique (L8)

Bio multiformat et brief graphique sont stockes avec `type = 'post'` et differencies uniquement par `metadata.sub_type`. Le dashboard ne lit pas `sub_type` — Sophie voit "Post" pour 22 elements dont 2 ne sont pas des posts. Impact : confusion UX legere, pas de blocage fonctionnel.

**Correction suggeree** : ajouter `bio` et `brief_graphique` dans DeliverableType, TYPE_LABELS et TYPE_COLORS du dashboard. Effort : 30 min.

### 2. Repetition prix/m2 dans tous les outputs

Flagge par Marc (audit v2) : le chiffre "2 800 EUR/m2" apparait dans les 8 outputs client-facing. Si Sophie publie tout, ses followers voient le meme chiffre partout. Impact : perception robotique possible.

**Correction suggeree** : ajouter dans les prompts une instruction de variation ("ne pas citer le prix/m2 dans plus de 50% des livrables, varier les formulations"). Effort : 20 min.

---

## Checklist regle n6 — Pipeline IA obligatoire

- [x] `src/lib/claude.ts` existe et fonctionnel (Anthropic SDK, retry, backoff)
- [x] 10 prompts dans `src/lib/prompts/` couvrent tous les livrables
- [x] 3 routes `/api/generate/` testables (pack-lancement, pack-mensuel, boost-mandat)
- [x] Insertion DB fonctionnelle (INSERT INTO deliverables, status draft)
- [x] Dashboard affiche draft + delivered avec badge visuel
- [x] Trigger admin operationnel (`/api/admin/trigger-production`)

**Score : 6/6 (vs 4/6 en V2)**

---

## Securite — aucun probleme detecte

- Auth Clerk sur toutes les routes (currentUser / auth)
- Admin check (ADMIN_EMAIL via env var) sur les 3 routes generate + trigger
- SQL parametre partout ($1, $2...), zero concatenation de strings
- Secrets exclusivement en env vars, jamais en dur
- Enrichissement property : timeouts (8s) sur les appels externes

---

## Verdict

**GO avec reserves mineures.** Le produit est fonctionnel de bout en bout : paiement -> onboarding -> generation IA -> dashboard -> copie. Les 2 reserves (types DB ambigus, repetition prix/m2) n'empechent pas le lancement. Les corriger avant le 10e client pour eviter la dette UX.

---

**Handoff -> @orchestrator**
- Fichier produit : `docs/reviews/cross-review-v3.md`
- Verdict : GO avec reserves mineures (score 9.2/10, progression +0.7 vs V2)
- Actions restantes : (1) differencier types bio/brief dans le dashboard, (2) varier les formulations prix/m2 dans les prompts
- Aucune contradiction bloquante, aucun agent a reinvoquer en urgence
