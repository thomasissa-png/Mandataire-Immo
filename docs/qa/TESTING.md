# Guide de Tests -- ImmoCrew

> Produit par @qa | 2026-03-25

---

## Lancer les tests

### Prerequis

```bash
npm install
```

### Commandes

```bash
# Lancer tous les tests une fois
npm test

# Lancer les tests en mode watch (relance a chaque modification)
npm run test:watch

# Lancer les tests avec rapport de couverture
npm run test:coverage
```

### Lancer un fichier de test specifique

```bash
npx vitest run src/__tests__/api/checkout.test.ts
npx vitest run src/__tests__/components/FAQ.test.tsx
```

---

## Structure des tests

```
src/__tests__/
  setup.ts                              # Setup global (jest-dom matchers)
  api/
    checkout.test.ts                    # Route GET /api/checkout (7 tests)
    leads.test.ts                       # Route POST /api/leads (9 tests)
    webhooks/
      stripe.test.ts                    # Webhook Stripe - 4 events (13 tests)
      clerk.test.ts                     # Webhook Clerk - user.created (8 tests)
  components/
    FAQ.test.tsx                        # Accordion FAQ (10 tests)
    Pricing.test.tsx                    # Pricing cards - prix, CTA, mentions (11 tests)
    Header.test.tsx                     # Navigation + menu mobile (8 tests)
```

**Total : 66 tests couvrant les chemins critiques du MVP.**

---

## Ce que les tests couvrent

### API Routes (P0 -- chemins de monetisation et acquisition)

| Route | Tests | Ce qui est verifie |
|-------|-------|-------------------|
| `GET /api/checkout` | 7 | Pack invalide (400), redirect Stripe, mode subscription vs payment, session sans URL (500), erreur Stripe (500) |
| `POST /api/leads` | 9 | JSON invalide (400), email manquant/invalide (400), upsert OK, normalisation email, source par defaut, champs optionnels null, erreur Supabase (500) |
| `POST /api/webhooks/stripe` | 13 | Signature manquante (400), signature invalide (400), checkout.session.completed (client + payment), invoice.paid, subscription.updated (active/inactive), subscription.deleted (churn), event inconnu, erreur handler (500) |
| `POST /api/webhooks/clerk` | 8 | Headers svix manquants (400), signature invalide (400), user.created sync, email manquant, noms null, event ignore |

### Composants (P0/P1 -- interface landing page)

| Composant | Tests | Ce qui est verifie |
|-----------|-------|-------------------|
| `FAQ` | 10 | 10 questions rendues, accordion ouvre/ferme, un seul ouvert a la fois, aria-expanded, contenu reponse |
| `Pricing` | 11 | 3 packs, prix corrects (497/197/97), badge "Le plus populaire", mentions legales (garantie 14j, sans engagement), liens CTA vers /api/checkout, TTC |
| `Header` | 8 | Logo, nav links, hamburger aria-label, menu mobile toggle, fermeture au clic, CTA vers #pricing |

---

## Strategie de mocking

Toutes les dependances externes sont mockees. Aucun test ne fait d'appel reseau.

| Dependance | Mock |
|------------|------|
| Stripe SDK | `vi.mock("@/lib/stripe")` -- mock de `stripe.checkout.sessions.create` et `stripe.webhooks.constructEvent` |
| Supabase | `vi.mock("@/lib/supabase")` -- mock de `createAdminSupabaseClient` retournant `.from().upsert()/.insert()/.update().eq()` |
| Svix (Clerk) | `vi.mock("svix")` -- classe MockWebhook avec `.verify()` mock |
| next/headers | `vi.mock("next/headers")` -- mock de `headers()` avec store mutable |
| Env vars | Definies dans `vitest.config.ts > test.env` -- aucune variable reelle utilisee |

---

## Test manuel Stripe (avec Stripe CLI)

### Prerequis
1. Installer Stripe CLI : `brew install stripe/stripe-cli/stripe` (macOS)
2. Se connecter : `stripe login`

### Tester les webhooks localement

```bash
# Terminal 1 : lancer le serveur Next.js
npm run dev

# Terminal 2 : ecouter les webhooks Stripe et les forwarder
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3 : declencher un event de test
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
```

### Tester le flow de paiement complet

1. Aller sur `http://localhost:3000`
2. Cliquer sur un CTA pricing
3. Sur la page Stripe Checkout, utiliser la carte de test : `4242 4242 4242 4242` (exp : n'importe quelle date future, CVC : n'importe quels chiffres)
4. Verifier dans le terminal `stripe listen` que le webhook `checkout.session.completed` est bien recu
5. Verifier dans Supabase que le client et le paiement sont crees

### Cartes de test Stripe

| Scenario | Numero de carte |
|----------|----------------|
| Paiement reussi | `4242 4242 4242 4242` |
| Paiement refuse | `4000 0000 0000 0002` |
| Carte expiree | `4000 0000 0000 0069` |
| 3D Secure requis | `4000 0025 0000 3155` |

---

## Checklist pre-launch

### Tests automatises
- [x] 66 tests unitaires passent (`npm test`)
- [ ] Coverage > 80% sur les chemins critiques (`npm run test:coverage`)
- [ ] Aucun test flaky (lancer `npm test` 3 fois de suite)

### Stripe
- [ ] Checkout fonctionne pour les 3 packs (lancement, mensuel, boost)
- [ ] Webhook `checkout.session.completed` cree le client en base
- [ ] Webhook `invoice.paid` enregistre le paiement
- [ ] Webhook `customer.subscription.deleted` marque le client comme "churned"
- [ ] Stripe Customer Portal est configure et accessible
- [ ] Cartes de test : paiement reussi + refuse + 3D Secure

### Clerk
- [ ] Connexion par email + mot de passe fonctionne
- [ ] Connexion par magic link fonctionne
- [ ] Webhook `user.created` synchronise le user dans Supabase
- [ ] Middleware protege /dashboard, /onboarding, /admin

### Landing page
- [ ] Hero visible above the fold (desktop + mobile)
- [ ] Les 10 questions FAQ s'ouvrent et se ferment correctement
- [ ] Les 3 packs pricing affichent les bons prix TTC
- [ ] CTA pricing redirige bien vers Stripe Checkout
- [ ] Formulaire lead capture fonctionne (email + ville)
- [ ] Page responsive (tester sur iPhone 375px et desktop 1440px)

### Conformite
- [ ] Mention IA sous les avant/apres
- [ ] Mention IA dans la FAQ (question 2)
- [ ] Liens footer : CGV, Politique de Confidentialite, Mentions Legales
- [ ] Bandeau cookies fonctionnel (PostHog ne charge pas sans consentement)

### Performance
- [ ] LCP < 2s (tester avec Lighthouse dans Chrome DevTools)
- [ ] INP < 150ms
- [ ] CLS < 0.05
- [ ] Bundle size verifie (pas de package > 100KB inutile)

### Tracking PostHog
- [ ] `page_view` capture automatiquement (verifier dans PostHog dashboard)
- [ ] Les 15 autres events P0 sont implementes (voir qa-strategy.md section 4)
  **NOTE : actuellement 0/15 events custom sont implementes -- a signaler a @fullstack**

---

*Document produit par @qa dans le cadre du framework Gradient Agents.*
