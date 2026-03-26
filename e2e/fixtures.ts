import { test as base, expect } from "@playwright/test"

/**
 * Extended test fixtures for ImmoCrew E2E tests.
 *
 * Auth strategy (NextAuth.js):
 * Protected routes (/dashboard, /onboarding, /admin) are guarded by
 * NextAuth JWT middleware. For E2E tests on public routes (landing, blog,
 * legal pages), no auth bypass is needed. For protected route tests,
 * the middleware redirects to /sign-in — tests verify redirect behavior
 * rather than accessing the authenticated content directly.
 */

export const test = base.extend<{
  /** Navigate and wait for hydration (Next.js specific) */
  navigateAndWait: (path: string) => Promise<void>
}>({
  navigateAndWait: async ({ page }, use) => {
    const navigate = async (path: string) => {
      await page.goto(path, { waitUntil: "networkidle" })
    }
    await use(navigate)
  },
})

export { expect }

/**
 * Onboarding test data — matches FIELD_LABELS in onboarding/page.tsx
 * Uses Sophie persona from project-context.md for realistic test data.
 */
export const SOPHIE_ONBOARDING = {
  // Step 1: Ton identite
  prenom: "Sophie",
  nom: "Martin",
  telephone: "06 12 34 56 78",
  // Step 2: Ton reseau
  reseau: "IAD",
  experience_annees: "2",
  nb_transactions_an: "5",
  // Step 3: Ta zone
  ville: "Angers",
  quartiers: "La Doutre, Centre-ville",
  departement: "49 - Maine-et-Loire",
  // Step 4: Ta specialite
  type_biens: "Appartements, maisons anciennes",
  gamme_prix: "100K - 300K EUR",
  cible_clients: "Primo-accedants, familles",
  // Step 5: Ton style
  ton_communication:
    "Je suis directe mais bienveillante. Je tutoie mes clients.",
  valeurs: "Transparence, disponibilite, honnetete",
  ce_qui_te_differencie:
    "Je connais chaque rue de La Doutre, j'y vis depuis 10 ans.",
} as const

/**
 * Expected pricing data — must match PACKS in Pricing.tsx
 * Updated 2026-03-26: prix ronds (400/150/100)
 */
export const EXPECTED_PACKS = [
  { name: "Pack Lancement", price: "400", href: "/api/checkout?pack=lancement" },
  { name: "Pack Mensuel", price: "150", href: "/api/checkout?pack=mensuel" },
  { name: "Boost Mandat", price: "100", href: "/api/checkout?pack=boost" },
] as const
