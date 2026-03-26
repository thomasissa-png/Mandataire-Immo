/**
 * Tests unitaires pour src/lib/enrich-property.ts
 *
 * Pourquoi ces tests existent :
 * enrich-property.ts appelle 3 APIs externes (gouv geocoding, DVF cquest, ADEME DPE)
 * et produit des donnees affichees sur la page /bien/[id]. Une regression ici
 * affiche des prix au m2 faux, des DPE inexacts, ou des coordonnees GPS erronees
 * sur des pages publiques — impact direct sur la credibilite du mandataire.
 *
 * Strategie de mock : global.fetch est mocke pour simuler les reponses API
 * sans appel reseau. Chaque test restaure le mock pour eviter les effets de bord.
 *
 * Angle mort identifie par @reviewer dans cross-review-v4.md (m3).
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  enrichProperty,
  enrichPropertyExtended,
  generateShortAnnonce,
} from "@/lib/enrich-property"

// ─── Fixtures ────────────────────────────────────────────────────────

const GEOCODING_RESPONSE_VALID = {
  features: [
    {
      geometry: { coordinates: [-0.5518, 47.4784] },
      properties: {
        label: "12 rue de la Paix, 49000 Angers",
        postcode: "49000",
        city: "Angers",
      },
    },
  ],
}

const GEOCODING_RESPONSE_EMPTY = { features: [] }

const DVF_RESPONSE_VALID = {
  resultats: [
    {
      date_mutation: "2024-06-15",
      valeur_fonciere: 250000,
      surface_reelle_bati: 80,
      type_local: "Appartement",
    },
    {
      date_mutation: "2024-03-10",
      valeur_fonciere: 180000,
      surface_reelle_bati: 60,
      type_local: "Appartement",
    },
    {
      // Filtre : surface 0 doit etre exclu
      date_mutation: "2024-01-01",
      valeur_fonciere: 100000,
      surface_reelle_bati: 0,
      type_local: "Terrain",
    },
  ],
}

const DVF_RESPONSE_EMPTY = { resultats: [] }

const DPE_RESPONSE_VALID = {
  results: [
    {
      classe_consommation_energie: "C",
      classe_estimation_ges: "B",
      consommation_energie: 145.3,
      estimation_ges: 22.7,
    },
  ],
}

const DPE_RESPONSE_EMPTY = { results: [] }

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Cree un mock fetch qui repond differemment selon l'URL appelee.
 * Simule les 3 APIs (geocoding, DVF, DPE) en un seul mock.
 */
function createFetchMock(overrides: {
  geocoding?: object | "timeout" | "error"
  dvf?: object | "timeout" | "error"
  dpe?: object | "timeout" | "error"
}) {
  return vi.fn(async (url: string | URL | Request) => {
    const urlStr = typeof url === "string" ? url : url.toString()

    // Geocoding API
    if (urlStr.includes("api-adresse.data.gouv.fr")) {
      if (overrides.geocoding === "timeout") {
        throw new DOMException("The operation was aborted", "AbortError")
      }
      if (overrides.geocoding === "error") {
        return new Response(null, { status: 500 })
      }
      return new Response(JSON.stringify(overrides.geocoding ?? GEOCODING_RESPONSE_VALID), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // DVF API
    if (urlStr.includes("api.cquest.org/dvf")) {
      if (overrides.dvf === "timeout") {
        throw new DOMException("The operation was aborted", "AbortError")
      }
      if (overrides.dvf === "error") {
        return new Response(null, { status: 500 })
      }
      return new Response(JSON.stringify(overrides.dvf ?? DVF_RESPONSE_VALID), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // DPE ADEME API
    if (urlStr.includes("data.ademe.fr")) {
      if (overrides.dpe === "timeout") {
        throw new DOMException("The operation was aborted", "AbortError")
      }
      if (overrides.dpe === "error") {
        return new Response(null, { status: 500 })
      }
      return new Response(JSON.stringify(overrides.dpe ?? DPE_RESPONSE_VALID), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // URL non reconnue — echouer explicitement
    throw new Error(`[TEST] URL non mockee : ${urlStr}`)
  })
}

// ─── Tests ───────────────────────────────────────────────────────────

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("geocodeAddress (via enrichProperty)", () => {
  // geocodeAddress est privee, on la teste indirectement via enrichProperty

  it("retourne les coordonnees et la ville pour une adresse valide", async () => {
    global.fetch = createFetchMock({ geocoding: GEOCODING_RESPONSE_VALID })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.lat).toBe(47.4784)
    expect(result!.lon).toBe(-0.5518)
    expect(result!.city).toBe("Angers")
    expect(result!.postcode).toBe("49000")

    // Verifie que l'API geocoding a ete appelee avec l'adresse encodee
    const firstCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(firstCall).toContain("api-adresse.data.gouv.fr")
    expect(firstCall).toContain(encodeURIComponent("12 rue de la Paix, 49000 Angers"))
  })

  it("retourne null si aucun resultat de geocoding", async () => {
    global.fetch = createFetchMock({ geocoding: GEOCODING_RESPONSE_EMPTY })

    const result = await enrichProperty("adresse inexistante XYZ123")

    expect(result).toBeNull()
  })

  it("retourne null si l'API geocoding repond en erreur (500)", async () => {
    global.fetch = createFetchMock({ geocoding: "error" })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).toBeNull()
  })

  it("retourne null si l'API geocoding timeout", async () => {
    global.fetch = createFetchMock({ geocoding: "timeout" })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).toBeNull()
  })
})

describe("fetchDVFData (via enrichProperty)", () => {
  it("calcule le prix moyen au m2 et retourne les transactions filtrees", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_VALID,
    })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    // 2 transactions valides (la 3e a surface 0 -> filtree)
    expect(result!.dernieres_transactions).toHaveLength(2)

    // Prix m2 moyen : (250000/80 + 180000/60) / 2 = (3125 + 3000) / 2 = 3063 (arrondi)
    expect(result!.prix_m2_moyen).toBe(3063)

    // Verification des transactions individuelles
    expect(result!.dernieres_transactions[0]).toEqual({
      date: "2024-06-15",
      prix: 250000,
      surface: 80,
      prix_m2: 3125,
      type: "Appartement",
    })
  })

  it("retourne prix_m2_moyen null si aucune transaction DVF", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_EMPTY,
    })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.prix_m2_moyen).toBeNull()
    expect(result!.dernieres_transactions).toHaveLength(0)
  })

  it("retourne prix_m2_moyen null si l'API DVF timeout", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: "timeout",
    })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.prix_m2_moyen).toBeNull()
    expect(result!.dernieres_transactions).toHaveLength(0)
  })

  it("retourne prix_m2_moyen null si l'API DVF repond 500", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: "error",
    })

    const result = await enrichProperty("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.prix_m2_moyen).toBeNull()
  })
})

describe("fetchDPEData (via enrichPropertyExtended)", () => {
  it("retourne les donnees DPE pour des coordonnees valides", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_VALID,
      dpe: DPE_RESPONSE_VALID,
    })

    const result = await enrichPropertyExtended("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.dpe).not.toBeNull()
    expect(result!.dpe!.classe).toBe("C")
    expect(result!.dpe!.ges_classe).toBe("B")
    expect(result!.dpe!.valeur_energie).toBe(145.3)
    expect(result!.dpe!.valeur_ges).toBe(22.7)
  })

  it("retourne dpe null si aucun DPE trouve pour ces coordonnees", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_VALID,
      dpe: DPE_RESPONSE_EMPTY,
    })

    const result = await enrichPropertyExtended("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.dpe).toBeNull()
  })

  it("retourne dpe null si l'API ADEME timeout", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_VALID,
      dpe: "timeout",
    })

    const result = await enrichPropertyExtended("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.dpe).toBeNull()
    // DVF doit quand meme fonctionner (appels paralleles, un echec n'affecte pas l'autre)
    expect(result!.prix_m2_moyen).toBe(3063)
  })

  it("retourne dpe null si l'API ADEME repond 500", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_VALID,
      dvf: DVF_RESPONSE_VALID,
      dpe: "error",
    })

    const result = await enrichPropertyExtended("12 rue de la Paix, 49000 Angers")

    expect(result).not.toBeNull()
    expect(result!.dpe).toBeNull()
  })

  it("retourne null completement si geocoding echoue (DPE et DVF non appeles)", async () => {
    global.fetch = createFetchMock({
      geocoding: GEOCODING_RESPONSE_EMPTY,
      dvf: DVF_RESPONSE_VALID,
      dpe: DPE_RESPONSE_VALID,
    })

    const result = await enrichPropertyExtended("adresse inexistante")

    expect(result).toBeNull()
    // Seule l'API geocoding doit avoir ete appelee
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})

describe("generateShortAnnonce", () => {
  it("retourne le texte inchange si deja sous la limite", () => {
    const short = "Un bel appartement en centre-ville."
    expect(generateShortAnnonce(short)).toBe(short)
  })

  it("ne depasse jamais 1500 caracteres (limite par defaut)", () => {
    // Generer un texte long avec des phrases completes
    const longText = Array.from(
      { length: 100 },
      (_, i) => `Phrase numero ${i + 1} de cette annonce immobiliere detaillee.`
    ).join(" ")

    expect(longText.length).toBeGreaterThan(1500)

    const result = generateShortAnnonce(longText)
    expect(result.length).toBeLessThanOrEqual(1500)
  })

  it("ne coupe pas au milieu d'un mot", () => {
    // Texte long sans ponctuation forte dans la seconde moitie
    // pour forcer le fallback vers lastIndexOf(" ")
    const words = Array.from({ length: 300 }, (_, i) => `mot${i}`).join(" ")

    const result = generateShortAnnonce(words, 100)

    // Le resultat ne doit pas se terminer par un fragment de mot
    // Il doit soit finir par "..." (coupe au dernier espace) soit etre un mot complet
    if (result.endsWith("...")) {
      // Avant les "...", on doit avoir un espace ou le debut du texte
      const beforeEllipsis = result.slice(0, -3)
      const lastChar = beforeEllipsis[beforeEllipsis.length - 1]
      // Le dernier caractere avant "..." ne doit pas etre au milieu d'un mot
      // (il doit etre la fin d'un mot complet, donc le caractere suivant dans l'original serait un espace)
      expect(words.charAt(beforeEllipsis.length)).toBe(" ")
    }
  })

  it("respecte une limite personnalisee", () => {
    const text = "Premiere phrase. Deuxieme phrase. Troisieme phrase. Quatrieme phrase. Cinquieme phrase assez longue."
    const result = generateShortAnnonce(text, 60)
    expect(result.length).toBeLessThanOrEqual(60)
  })

  it("coupe a la derniere phrase complete si possible", () => {
    const text = "Premiere phrase. Deuxieme phrase. Troisieme phrase qui est beaucoup plus longue que les autres."
    const result = generateShortAnnonce(text, 50)

    // Doit couper apres "Deuxieme phrase." (position 33) car c'est la derniere phrase
    // complete avant la limite de 50 caracteres et c'est apres 50% de la limite
    expect(result).toBe("Premiere phrase. Deuxieme phrase.")
  })

  it("supprime le formatage Markdown quand le texte est tronque", () => {
    // generateShortAnnonce ne nettoie le Markdown que si le texte depasse maxLength.
    // On utilise donc une limite basse pour forcer la troncation + nettoyage.
    const markdown =
      "## Titre principal\n\n**Un texte en gras** et *en italique*.\n\nDeuxieme paragraphe avec du contenu supplementaire pour depasser la limite."
    const result = generateShortAnnonce(markdown, 80)

    expect(result).not.toContain("##")
    expect(result).not.toContain("**")
  })

  it("retourne une chaine non vide pour un texte non vide", () => {
    const text = "Au moins une phrase."
    const result = generateShortAnnonce(text)
    expect(result.length).toBeGreaterThan(0)
  })
})
