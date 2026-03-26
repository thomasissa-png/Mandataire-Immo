# Strategie QA -- ImmoCrew MVP

> Produit par @qa | 2026-03-25
> Sources : project-context.md, functional-specs.md, infrastructure.md, tracking-plan.md, code source src/
> Stack de test : Vitest + React Testing Library (unitaires/integration), Playwright (E2E prevu semaine 2+)

---

## 1. Contexte et decisions

### Contexte equipe
Projet solo founder avec framework Gradient Agents. La CI doit rester legere et rapide (< 5 min). Pas de pipeline E2E bloquant au MVP -- les tests E2E Playwright seront ajoutes en phase Beta (semaine 3-4 de la roadmap).

### Choix du framework de test
- **Vitest** : choisi car natif ESM, compatible Next.js, rapide, API identique a Jest. Vitest et Playwright sont absents du package.json -- installation requise.
- **React Testing Library** : standard pour tester les composants React sans coupler aux details d'implementation.
- **Playwright** : prevu pour les parcours E2E (inscription -> paiement -> onboarding -> dashboard). Reporte a la phase Beta car le flow complet necessite Stripe CLI + Clerk en mode test + Supabase seeds.

### Strategie de mocking
Toutes les dependances externes sont mockees dans les tests unitaires :
- **Stripe** : mock du SDK `stripe` (checkout.sessions.create, webhooks.constructEvent)
- **Supabase** : mock de `@/lib/supabase` (createAdminSupabaseClient retourne un client mock)
- **Clerk** : mock de `@clerk/nextjs/server` (middleware, auth)
- **Svix** : mock de `svix` (Webhook.verify)
- **PostHog** : mock de `posthog-js`
- **next/headers** : mock de `headers()` et `cookies()`
- **Variables d'environnement** : definies dans vitest.config.ts via `env`

---

## 2. Matrice de couverture par fonctionnalite

| Zone | Fichier(s) source | Tests unitaires | Tests E2E (Beta) | Priorite |
|------|-------------------|-----------------|-------------------|----------|
| **API Checkout** | `src/app/api/checkout/route.ts` | `checkout.test.ts` -- pack invalide (400), redirect Stripe, erreur Stripe (500) | Flow complet avec Stripe CLI | P0 |
| **API Leads** | `src/app/api/leads/route.ts` | `leads.test.ts` -- email invalide (400), JSON invalide (400), succes, erreur Supabase (500) | Formulaire lead magnet landing | P0 |
| **Webhook Stripe** | `src/app/api/webhooks/stripe/route.ts` | `stripe.test.ts` -- signature manquante (400), signature invalide (400), checkout.session.completed, invoice.paid, subscription.updated, subscription.deleted, event inconnu | Replay webhook Stripe CLI | P0 |
| **Webhook Clerk** | `src/app/api/webhooks/clerk/route.ts` | `clerk.test.ts` -- headers manquants (400), signature invalide (400), user.created sync, email manquant | N/A (declenche par Clerk) | P0 |
| **Composant FAQ** | `src/components/landing/FAQ.tsx` | `FAQ.test.tsx` -- rendu 10 questions, accordion ouvre/ferme, un seul ouvert a la fois, accessibilite aria-expanded | Scroll + clic FAQ | P1 |
| **Composant Pricing** | `src/components/landing/Pricing.tsx` | `Pricing.test.tsx` -- 3 packs affiches, prix corrects (497/197/97), badge "Le plus populaire", liens checkout | Clic CTA -> redirection | P0 |
| **Composant Header** | `src/components/landing/Header.tsx` | `Header.test.tsx` -- logo, nav desktop, menu mobile toggle, fermeture au clic lien, aria-label | Navigation mobile | P1 |
| **Middleware** | `src/middleware.ts` | Non teste unitairement (Clerk middleware wrappeur) | Protection routes /dashboard, /admin, /onboarding | P1 |
| **Landing page** | `src/app/page.tsx` | Non teste (Server Component, rendu statique) | Chargement < 2s, LCP, scroll complet | P1 |
| **Dashboard** | `src/app/dashboard/page.tsx` | Non teste au MVP (depend Supabase + Clerk) | Parcours client complet | P1 |
| **Onboarding** | `src/app/onboarding/page.tsx` | Non teste au MVP (wizard multi-etapes, complexite elevee) | Parcours onboarding 7 etapes | P1 |
| **Admin** | `src/app/admin/page.tsx` | Non teste au MVP (depend Supabase + Clerk) | Gestion clients | P1 |

---

## 3. Priorisation

### P0 -- Bloquants lancement (cette session)
1. Configuration Vitest + scripts npm
2. Tests API Checkout (route de paiement = chemin critique)
3. Tests API Leads (capture de leads = acquisition)
4. Tests Webhook Stripe (synchronisation paiements = revenus)
5. Tests Webhook Clerk (creation comptes = onboarding)
6. Tests Pricing (prix affiches = engagement contractuel)

### P1 -- Semaine 2 -- FAIT (2026-03-26)
7. Tests FAQ (composant interactif) -- FAIT
8. Tests Header (navigation mobile) -- FAIT
9. Pipeline CI GitHub Actions (lint + typecheck + test) -- A FAIRE
10. Tests E2E Playwright (parcours complet landing -> checkout) -- FAIT (e2e/landing.spec.ts, e2e/api-smoke.spec.ts)
11. Tests E2E Playwright onboarding wizard -- FAIT (e2e/onboarding.spec.ts)
12. Tests E2E Playwright dashboard + auth protection -- FAIT (e2e/dashboard.spec.ts)
13. Tests E2E pages legales -- FAIT (e2e/legal-pages.spec.ts)

### P2 -- Phase Beta (semaine 3-4)
14. Tests de performance Lighthouse CI
15. Tests d'accessibilite axe-core integres aux tests E2E
16. Tests de regression visuelle (screenshots)
17. Tests E2E dashboard avec Clerk test instance (empty state + deliverables)

---

## 4. Couverture tracking-plan PostHog

### Audit du code source

**Resultat : 0 event custom implemente sur 16 events P0 du tracking-plan.**

Le seul tracking en place est le `capture_pageview: true` automatique de PostHog dans `src/components/PostHogProvider.tsx`, qui couvre l'event `page_view` (P0).

### Events P0 manquants dans le code

| Event | Fichier ou il devrait etre | Composant/Route |
|-------|---------------------------|-----------------|
| `cta_click` | `src/components/landing/Hero.tsx`, `Pricing.tsx`, `CTAFinal.tsx`, `Footer.tsx` | Chaque bouton CTA |
| `pricing_view` | `src/components/landing/Pricing.tsx` | IntersectionObserver sur la section |
| `lead_form_submit` | `src/app/api/leads/route.ts` ou composant formulaire | Soumission formulaire lead |
| `onboarding_start` | `src/app/onboarding/page.tsx` | Premier affichage etape 1 |
| `onboarding_step_complete` | `src/app/onboarding/page.tsx` | Validation chaque etape |
| `onboarding_step_abandon` | `src/app/onboarding/page.tsx` | beforeunload / navigation |
| `onboarding_complete` | `src/app/onboarding/page.tsx` | Soumission recapitulatif |
| `checkout_start` | `src/app/api/checkout/route.ts` ou composant CTA | Avant redirection Stripe |
| `payment_success` | `src/app/api/webhooks/stripe/route.ts` | Webhook checkout.session.completed |
| `payment_failed` | `src/app/api/webhooks/stripe/route.ts` | Webhook invoice.payment_failed (non gere) |
| `subscription_cancel` | `src/app/api/webhooks/stripe/route.ts` | Webhook customer.subscription.deleted |
| `login` | Integration Clerk | Post-authentification |
| `deliverable_view` | `src/app/dashboard/page.tsx` | Ouverture livrable |
| `deliverable_download` | `src/app/dashboard/page.tsx` | Telechargement livrable |

**Action requise** : signaler a @fullstack pour implementation de tous les events P0 avant le lancement. Le tracking est indispensable pour mesurer le funnel (cf. kpi-framework.md).

### Event P0 partiellement couvert

| Event | Statut | Detail |
|-------|--------|--------|
| `page_view` | Couvert (auto) | `capture_pageview: true` dans PostHogProvider. Proprietes UTM non enrichies manuellement mais PostHog les capture automatiquement via le referrer. |

### Bug detecte : event `invoice.payment_failed` absent du webhook Stripe

Le webhook Stripe (`src/app/api/webhooks/stripe/route.ts`) ne gere pas l'event `invoice.payment_failed`. La spec fonctionnelle (section 4.3) et le tracking-plan (event `payment_failed` P0) le requierent. Seuls `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated` et `customer.subscription.deleted` sont geres.

**Escalade @fullstack** : ajouter le case `invoice.payment_failed` dans le switch du webhook Stripe (fichier `src/app/api/webhooks/stripe/route.ts`, ligne 153).

---

## 5. Conventions de test

### Nommage
- Fichiers : `src/__tests__/api/<route>.test.ts` et `src/__tests__/components/<Composant>.test.tsx`
- Describe : nom du fichier source
- It/test : description en anglais du comportement attendu (convention standard)

### Structure d'un test
```typescript
describe("POST /api/leads", () => {
  it("returns 400 if email is missing", async () => {
    // Arrange - setup mocks et donnees
    // Act - appeler la route
    // Assert - verifier le resultat
  })
})
```

### Mocking
- Chaque fichier de test mock ses dependances en haut du fichier avec `vi.mock()`
- Les env vars sont definies dans `vitest.config.ts` > `test.env`
- Les mocks sont reinitialises entre chaque test via `beforeEach(() => vi.clearAllMocks())`

---

*Document produit par @qa dans le cadre du framework Gradient Agents.*
*Reference : project-context.md, functional-specs.md, infrastructure.md, tracking-plan.md*
