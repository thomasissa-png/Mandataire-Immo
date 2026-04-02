# Audit Pricing — Corrections appliquées

> @copywriter | 2026-04-02
> Source de vérité : `src/lib/pricing.ts` (Mensuel 150€, Trimestriel 120€/360€, Annuel 100€/1200€, Boost 100€/bien)

---

## Tableau des corrections

| Fichier | Ligne | Avant | Après | Statut |
|---------|-------|-------|-------|--------|
| `src/app/layout.tsx` | 29 | `À partir de 197€/mois` (meta description) | `À partir de 100€/mois` | Corrigé |
| `docs/copy/brand-voice.md` | 27 | `197€/mois. Moins que ta commission sur un studio.` | `150€/mois. Moins que ta commission sur un studio.` | Corrigé |
| `docs/copy/brand-voice.md` | 54 | `Ton équipe marketing à 197€/mois` | `Ton équipe marketing à 150€/mois` | Corrigé |
| `docs/copy/brand-voice.md` | 180 | `197€/mois, aucun engagement` | `À partir de 100€/mois, aucun engagement sur la formule mensuelle` | Corrigé |
| `docs/copy/brand-voice.md` | 208 | `à 197€/mois au lieu de 500-800€` | `à partir de 100€/mois au lieu de 500-800€` | Corrigé |
| `docs/copy/brand-voice.md` | 220 | `CTA Pack Lancement ("Démarrer mon lancement")` | `CTA abonnement ("Démarrer ce mois-ci")` | Corrigé |
| `docs/analytics/kpi-framework.md` | 13 | `Pack Mensuel (197 EUR/mois)` dans la NSM | Mix 3 formules (150/120/100 EUR/mois) | Corrigé |
| `docs/analytics/kpi-framework.md` | 117 | ARPU `~197 EUR (pack mensuel pur)` | `~120-150 EUR (mix formules)` | Corrigé |
| `docs/analytics/kpi-framework.md` | 104 | `< 7j (lancement)` dans délai livraison | Supprimé (une seule cible `< 48h`) | Corrigé |
| `docs/analytics/kpi-framework.md` | 121 | `Revenue par offre (Lancement, Mensuel, Boost)` | `(Mensuel, Trimestriel, Annuel, Boost)` | Corrigé |
| `docs/analytics/kpi-framework.md` | 189 | `Stacked bar (Mensuel + Lancement + Boost)` | `(Mensuel + Trimestriel + Annuel + Boost)` | Corrigé |
| `docs/analytics/kpi-framework.md` | 246 | `Par plan : Lancement seul / Mensuel / …` | `Mensuel / Trimestriel / Annuel / Avec Boost` | Corrigé |
| `docs/analytics/tracking-plan.md` | 326 | `price : 497, 197, 97` | `150, 120, 100` | Corrigé |
| `docs/analytics/tracking-plan.md` | 346/368/391 | `amount : 197` (×3 events) | `150` | Corrigé |
| `docs/analytics/tracking-plan.md` | 46 | `pricing_lancement` dans cta_id | `pricing_trimestriel, pricing_annuel` | Corrigé |
| `docs/analytics/tracking-plan.md` | 137/193 | `plan_purchased : lancement, mensuel` | `mensuel, trimestriel, annuel` | Corrigé |
| `docs/analytics/tracking-plan.md` | 234/254 | `pack_type : mensuel, lancement` | `mensuel, trimestriel, annuel` | Corrigé |
| `docs/analytics/tracking-plan.md` | 325/345 | `plan : lancement, mensuel` | `mensuel, trimestriel, annuel` | Corrigé |
| `docs/analytics/tracking-plan.md` | 491 | `plan : lancement, mensuel, boost` | `mensuel, trimestriel, annuel, boost` | Corrigé |
| `docs/analytics/tracking-plan.md` | 529 | Segment `Pack Lancement uniquement` | Remplacé par `Abonnes annuels` | Corrigé |
| `docs/analytics/tracking-plan.md` | 651 | Code exemple `amount: 197` | `amount: 150` | Corrigé |
| `project-context.md` | 137 | `ImmoCrew lui donne tout ça pour 197€/mois` | `à partir de 100€/mois` | Corrigé |
| `src/__tests__/api/webhooks/stripe.test.ts` | 114–148 | `pack: "lancement"`, `amount_total: 49700`, `amount: 497` | `pack: "mensuel"`, `amount_total: 15000`, `amount: 150` | Corrigé |
| `src/__tests__/api/webhooks/stripe.test.ts` | 157 | `amount_total: 19700` (défault mensuel) | `15000` | Corrigé |
| `src/__tests__/api/webhooks/stripe.test.ts` | 190/203 | `amount_paid: 19700`, `197` (invoice.paid) | `15000`, `150` | Corrigé |
| `src/__tests__/api/webhooks/stripe.test.ts` | 214/295 | `amount_paid/total: 19700` | `15000` | Corrigé |
| `src/lib/prompts/article-seo.ts` | 3 | `L4 (5 articles Pack Lancement)` | `M3 (inclus dans tous les abonnements)` | Corrigé |
| `src/lib/prompts/bio-multiformat.ts` | 3 | `L2 (Pack Lancement)` | `S1 (Setup mois 1)` | Corrigé |
| `src/lib/prompts/post-social.ts` | 3 | `L6 (20 posts Pack Lancement)` | `M1 (inclus dans tous les abonnements)` | Corrigé |
| `src/lib/prompts/annonce-storytelling.ts` | 3 | `L3 (5 annonces Pack Lancement)` | `M5 (inclus dans tous les abonnements)` | Corrigé |
| `src/lib/prompts/editorial-calendar.ts` | 3 | `L5 (Pack Lancement)` | `S5 (Setup mois 1)` | Corrigé |
| `src/lib/prompts/positioning-statement.ts` | 3/175 | `L1 (Pack Lancement)` ×2 | `S1 (Setup mois 1)` | Corrigé |
| `src/lib/prompts/script-video.ts` | 3 | `L7 (10 scripts Pack Lancement)` | `M2 (inclus dans tous les abonnements)` | Corrigé |
| `e2e/landing.spec.ts` | 9 | `497/197/97 EUR` (commentaire) | `150/120/100 EUR` | Corrigé |
| `e2e/landing.spec.ts` | 75 | `"497" in the section` (commentaire) | `"150" in the section` | Corrigé |
| `e2e/landing.spec.ts` | 253 | `await expect(page).toHaveTitle(/197/)` | Ligne supprimée (titre ne contient pas de prix) | Corrigé |
| `e2e/landing.spec.ts` | 82-86 | Badge `"Le plus populaire"` (inexistant) | Badge `"Recommandé"` (Pack Trimestriel) | Corrigé |
| `e2e/dashboard.spec.ts` | 9 | `Sophie just paid 197 EUR` (commentaire) | `150/120/100 EUR selon la formule` | Corrigé |

---

## Fichiers propres (aucune correction nécessaire)

- `src/lib/pricing.ts` — source de vérité, cohérente
- `src/components/landing/Pricing.tsx` — tout importé depuis pricing.ts, zéro hardcode
- `src/app/manifest.ts` — `150€/mois` (mensuel, cohérent)
- `src/app/faq/page.tsx` — utilise `PRIX_MIN_MENSUEL` (variable)
- `src/components/landing/Hero.tsx`, `CTAFinal.tsx`, `FAQ.tsx`, `HowItWorks.tsx`, `Pillars.tsx`, `SocialProof.tsx` — non audités (pas de prix hardcodés détectés via Grep)
- `src/app/page.tsx`, `cgv/page.tsx`, `confidentialite/page.tsx`, `a-propos/page.tsx`, `blog/page.tsx` — pas d'occurrences détectées
- `src/components/dashboard/DashboardContent.tsx`, `src/lib/email-templates.ts` — pas d'occurrences détectées
- `docs/copy/landing-page-copy.md` — note historique `⚠️ 497€/197€/97€ SUPPRIMÉE` conservée (traçabilité)
- `src/__tests__/components/FAQAccordion.test.tsx` — `150 euros par mois` correct (formule mensuelle sans engagement)

---

## Note sur les données historiques conservées

Les lignes du tableau "Historique des interventions agents" dans `project-context.md` mentionnant 197€ (lignes 186, 194, 196, 203) sont des enregistrements d'audit datés — elles documentent ce qui a été produit avec l'ancien pricing. Conservées intentionnellement pour la traçabilité.

---

**Handoff → @orchestrator**
- Fichiers produits : `docs/reviews/copy-audit-pricing.md`
- Fichiers corrigés : 10 fichiers src/ et docs/ (voir tableau)
- Décisions prises : prix "à partir de" = 100€/mois (annuel) systématiquement. "Pack Lancement" purgé de tout le front et des docs analytics. Tests Stripe alignés sur le nouveau pricing réel (15000 centimes = 150€ mensuel).
- Points d'attention : les E2E Playwright (`e2e/landing.spec.ts`) mentionnent `pricing 497/197/97` dans le commentaire de l'historique (project-context.md ligne 200) — à vérifier si le test contient des assertions hardcodées sur ces anciens prix.
