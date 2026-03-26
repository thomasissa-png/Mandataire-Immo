import { test, expect } from "./fixtures"

/**
 * E2E tests pour la page /bien/[id] — ImmoCrew
 *
 * Pourquoi ces tests existent :
 * La page bien est le livrable final visible par les acheteurs potentiels.
 * Un lien casse, un 500 non gere, ou une mention legale manquante sur le
 * home staging peut engager la responsabilite juridique du mandataire.
 * Ces tests verifient que la route repond correctement et que la structure
 * HTML attendue est presente.
 *
 * Angle mort identifie par @reviewer dans cross-review-v4.md (m2).
 *
 * Contrainte technique :
 * La page /bien/[id] necessite une connexion PostgreSQL pour charger les
 * donnees du bien. En environnement de test sans DB :
 * - Un ID inexistant retourne 404 (notFound() dans le composant)
 * - Un ID valide sans DB retourne 500 (query() echoue)
 * Les tests ci-dessous verifient les deux scenarios et s'adaptent a la
 * presence ou non de la DB.
 */

test.describe("Page /bien/[id] — routes et structure", () => {
  test("retourne 404 ou erreur pour un ID inexistant", async ({ page }) => {
    // Un ID bidon ne correspond a aucun enregistrement.
    // Comportement attendu : 404 (notFound()) si la DB est accessible,
    // ou 500 si la DB est injoignable. Dans les deux cas, pas de 200.
    const response = await page.goto("/bien/id-totalement-inexistant-xyz-999")

    expect(response).not.toBeNull()
    const status = response!.status()

    // On accepte 404 (comportement nominal) ou 500 (pas de DB en CI)
    expect([404, 500]).toContain(status)

    // Si 404 : verifier qu'un message clair est affiche (pas une page blanche)
    if (status === 404) {
      // Next.js affiche sa page 404 par defaut ou une page custom not-found.tsx
      const body = await page.textContent("body")
      expect(body).toBeTruthy()
      expect(body!.length).toBeGreaterThan(0)
    }
  })

  test("retourne 404 ou erreur pour un slug inexistant", async ({ page }) => {
    const response = await page.goto("/bien/appartement-fictif-centre-ville")

    expect(response).not.toBeNull()
    const status = response!.status()
    expect([404, 500]).toContain(status)
  })

  test("ne retourne jamais 200 pour un ID clairement invalide", async ({ page }) => {
    // Tests d'injection basiques — ces IDs ne doivent jamais matcher un bien
    const invalidIds = [
      "'; DROP TABLE property_pages; --",
      "<script>alert(1)</script>",
      "../../../etc/passwd",
    ]

    for (const id of invalidIds) {
      const response = await page.goto(`/bien/${encodeURIComponent(id)}`)
      expect(response).not.toBeNull()
      // Jamais un 200 pour ces IDs — 404, 500, ou 400 sont tous acceptables
      expect(response!.status()).not.toBe(200)
    }
  })
})

test.describe("Page /bien/[id] — structure HTML (si DB accessible)", () => {
  /**
   * Ces tests ne peuvent passer que si :
   * 1. La DB PostgreSQL est accessible
   * 2. Au moins un bien avec status='published' existe
   *
   * En CI sans DB, ces tests sont skipped automatiquement.
   * Pour les lancer localement : s'assurer qu'un bien publie existe en DB.
   */

  test("affiche les sections attendues pour un bien publie", async ({ page }) => {
    // Tenter de charger un bien — on essaie avec un slug generique
    // Si la DB n'est pas accessible, on skip le test proprement
    const response = await page.goto("/bien/test-bien-publie")

    if (!response || response.status() !== 200) {
      test.skip(true, "DB non accessible ou bien test non trouve — test skip en CI")
      return
    }

    // Section header du bien — toujours presente
    const main = page.locator("main")
    await expect(main).toBeVisible()

    // H1 : titre du bien
    const h1 = page.getByRole("heading", { level: 1 })
    await expect(h1).toBeVisible()

    // Prix : toujours affiche
    await expect(page.getByText(/\d+.*EUR/)).toBeVisible()

    // Section contact : toujours presente (CTA en bas de page)
    await expect(page.getByText("Interesse par ce bien")).toBeVisible()
  })

  test("affiche la mention legale home staging si visuels staging presents", async ({
    page,
  }) => {
    // Ce test verifie la conformite juridique : si des photos de home staging
    // virtuel sont affichees, la mention "non contractuelle" DOIT etre visible.
    const response = await page.goto("/bien/test-bien-staging")

    if (!response || response.status() !== 200) {
      test.skip(true, "DB non accessible ou bien avec staging non trouve — test skip en CI")
      return
    }

    // Verifier si des visuels staging sont presents sur la page
    const stagingBadge = page.getByText(/Staging/)
    const hasStagingVisible = await stagingBadge.isVisible().catch(() => false)

    if (hasStagingVisible) {
      // Mention legale OBLIGATOIRE si staging present
      // Deux emplacements possibles : galerie et footer
      const mentionGalerie = page.getByText("Home staging virtuel")
      const mentionFooter = page.getByText("projections non contractuelles")

      const hasGalerieMention = await mentionGalerie.isVisible().catch(() => false)
      const hasFooterMention = await mentionFooter.isVisible().catch(() => false)

      expect(
        hasGalerieMention || hasFooterMention,
        "Mention legale home staging absente — obligation juridique pour les visuels de projection"
      ).toBe(true)
    }
  })
})

test.describe("Page /bien/[id] — footer et mentions legales", () => {
  test("le footer contient la mention prix FAI", async ({ page }) => {
    const response = await page.goto("/bien/test-bien-publie")

    if (!response || response.status() !== 200) {
      test.skip(true, "DB non accessible — test skip en CI")
      return
    }

    // Mention obligatoire : "frais d'agence inclus"
    await expect(page.getByText(/frais d.*agence inclus/i)).toBeVisible()
  })
})

test.describe("Page /bien/[id] — composants visuels (smoke tests)", () => {
  /**
   * Smoke tests pour verifier que les composants property ne crashent pas
   * au rendu. En l'absence de DB, on verifie au minimum que la route
   * repond sans erreur 500 catastrophique (uncaught exception).
   */

  test("la page ne genere pas d'erreur JavaScript non catchee", async ({ page }) => {
    const jsErrors: string[] = []
    page.on("pageerror", (err) => jsErrors.push(err.message))

    await page.goto("/bien/test-composants-visuels")

    // Meme si la page retourne 404/500 (pas de DB), il ne doit pas y avoir
    // d'erreur JavaScript non catchee (indication d'un composant casse)
    const criticalErrors = jsErrors.filter(
      (e) =>
        // Filtrer les erreurs attendues (hydration warnings, etc.)
        !e.includes("Hydration") && !e.includes("hydrat")
    )

    expect(
      criticalErrors,
      `Erreurs JS non catchees sur /bien/[id] : ${criticalErrors.join(", ")}`
    ).toHaveLength(0)
  })
})
