/**
 * Tests unitaires pour src/lib/referral.ts
 *
 * Pourquoi ces tests existent :
 * Le code parrainage est visible par le mandataire (dashboard) et partagé
 * à ses prospects (lien de parrainage). Un code mal généré (caractères ambigus,
 * format cassé, prénom non normalisé) casse le parcours d'inscription filleul
 * et fait perdre des commissions au parrain.
 * Le masquage email est affiché côté RGPD — un email non masqué est une
 * violation de données personnelles.
 *
 * Données adversariales : accents, emojis, chaînes vides, emails sans @.
 */

import { describe, it, expect } from "vitest"
import {
  normalizeToAscii,
  generateReferralCode,
  generateFallbackCode,
  maskEmail,
} from "@/lib/referral"

// ─── normalizeToAscii ───────────────────────────────────────────────

describe("normalizeToAscii", () => {
  it("retire les accents et passe en majuscules (Éric → ERIC)", () => {
    expect(normalizeToAscii("Éric")).toBe("ERIC")
  })

  it("normalise les accents composés (Stéphane → STEPHANE)", () => {
    expect(normalizeToAscii("Stéphane")).toBe("STEPHANE")
  })

  it("supprime les tirets et caractères spéciaux (Jean-Pierre → JEANPIERRE)", () => {
    expect(normalizeToAscii("Jean-Pierre")).toBe("JEANPIERRE")
  })

  it("retourne une chaîne vide si input vide", () => {
    expect(normalizeToAscii("")).toBe("")
  })

  it("conserve les chiffres (Agent007 → AGENT007)", () => {
    expect(normalizeToAscii("Agent007")).toBe("AGENT007")
  })

  it("gère les caractères spéciaux uniquement (***) → chaîne vide", () => {
    expect(normalizeToAscii("***")).toBe("")
  })

  it("gère les cédilles et trémas (François Noël → FRANCOISNOEL)", () => {
    expect(normalizeToAscii("François Noël")).toBe("FRANCOISNOEL")
  })
})

// ─── generateReferralCode ───────────────────────────────────────────

describe("generateReferralCode", () => {
  it("génère un code au format IMMOCREW-XXXX#### (prénom 4+ chars)", () => {
    const code = generateReferralCode("Sophie")
    expect(code).toMatch(/^IMMOCREW-SOPH[A-HJ-NP-Z2-9]{4}$/)
  })

  it("utilise le prénom complet si < 4 caractères (Jo)", () => {
    const code = generateReferralCode("Jo")
    expect(code).toMatch(/^IMMOCREW-JO[A-HJ-NP-Z2-9]{4}$/)
  })

  it("normalise les accents dans le prénom (Élodie → ELOD)", () => {
    const code = generateReferralCode("Élodie")
    expect(code).toMatch(/^IMMOCREW-ELOD[A-HJ-NP-Z2-9]{4}$/)
  })

  it("utilise USER comme fallback si prénom vide après normalisation", () => {
    const code = generateReferralCode("")
    expect(code).toMatch(/^IMMOCREW-USER[A-HJ-NP-Z2-9]{4}$/)
  })

  it("utilise USER comme fallback si prénom = caractères spéciaux seuls", () => {
    const code = generateReferralCode("---")
    expect(code).toMatch(/^IMMOCREW-USER[A-HJ-NP-Z2-9]{4}$/)
  })

  it("ne contient jamais de caractères ambigus (O, 0, I, 1)", () => {
    // Exécuter plusieurs fois pour couvrir le hasard
    for (let i = 0; i < 50; i++) {
      const code = generateReferralCode("Test")
      const randomPart = code.slice("IMMOCREW-TEST".length)
      expect(randomPart).not.toMatch(/[O01I]/)
    }
  })

  it("a une longueur totale de 13 caractères pour un prénom de 4+ chars", () => {
    // IMMOCREW- (9) + 4 prénom + 4 random = 17
    const code = generateReferralCode("Sophie")
    expect(code.length).toBe(17)
  })

  it("génère des codes différents à chaque appel (non déterministe)", () => {
    const codes = new Set<string>()
    for (let i = 0; i < 20; i++) {
      codes.add(generateReferralCode("Test"))
    }
    // Au moins 2 codes différents sur 20 (probabilité collision quasi nulle)
    expect(codes.size).toBeGreaterThan(1)
  })
})

// ─── generateFallbackCode ───────────────────────────────────────────

describe("generateFallbackCode", () => {
  it("génère un code au format IMMOCREW-USER suivi de 6 caractères du userId", () => {
    const code = generateFallbackCode("a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    expect(code).toMatch(/^IMMOCREW-USER[A-Z0-9]{6}$/)
  })

  it("supprime les tirets du UUID avant extraction", () => {
    const code = generateFallbackCode("abcdef12-3456-7890-abcd-ef1234567890")
    expect(code).toBe("IMMOCREW-USERABCDEF")
  })

  it("passe le suffixe en majuscules", () => {
    const code = generateFallbackCode("abcdef00-0000-0000-0000-000000000000")
    expect(code).toBe("IMMOCREW-USERABCDEF")
  })

  it("gère un userId court (< 6 chars utiles)", () => {
    const code = generateFallbackCode("ab")
    expect(code).toBe("IMMOCREW-USERAB")
  })
})

// ─── maskEmail ──────────────────────────────────────────────────────

describe("maskEmail", () => {
  it("masque un email standard (jean.dupont@gmail.com → j**@gmail.com)", () => {
    expect(maskEmail("jean.dupont@gmail.com")).toBe("j**@gmail.com")
  })

  it("masque un email avec un local part court (ab@test.fr → a**@test.fr)", () => {
    expect(maskEmail("ab@test.fr")).toBe("a**@test.fr")
  })

  it("masque un email avec un seul caractère local (a@x.com → a**@x.com)", () => {
    expect(maskEmail("a@x.com")).toBe("a**@x.com")
  })

  it("retourne ***@*** si pas de @ dans l'email", () => {
    expect(maskEmail("invalid-email")).toBe("***@***")
  })

  it("retourne ***@*** si chaîne vide", () => {
    expect(maskEmail("")).toBe("***@***")
  })

  it("préserve le domaine complet (user+tag@long-domain.co.uk)", () => {
    expect(maskEmail("user+tag@long-domain.co.uk")).toBe("u**@long-domain.co.uk")
  })
})
