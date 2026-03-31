/**
 * Utilitaires pour le systeme de parrainage ImmoCrew.
 *
 * - generateReferralCode : genere un code unique IMMOCREW-{PRENOM}{4_ALPHANUM}
 * - maskEmail : masque un email pour affichage RGPD (j**@gmail.com)
 * - normalizeToAscii : normalise les accents pour le code (Eric -> ERIC)
 */

const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

/**
 * Normalise une chaine en retirant les accents et caracteres speciaux.
 * Eric -> ERIC, Stephane -> STEPHANE, Jean-Pierre -> JEANPIERRE
 */
export function normalizeToAscii(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
}

/**
 * Genere un code parrainage au format IMMOCREW-{PRENOM(4 chars max)}{4 chars alnum}.
 *
 * @param prenom - Prenom du parrain (accents acceptes, normalises automatiquement)
 * @returns Code au format IMMOCREW-SOPH7K2M
 *
 * @example
 * generateReferralCode("Sophie")  // "IMMOCREW-SOPH7K2M"
 * generateReferralCode("Eric")    // "IMMOCREW-ERIC2B7Q"
 * generateReferralCode("Jo")      // "IMMOCREW-JO4X9P3R" (prenom < 4 chars : tel quel)
 */
export function generateReferralCode(prenom: string): string {
  const normalized = normalizeToAscii(prenom).slice(0, 4)
  const prefix = normalized || "USER"

  let random = ""
  for (let i = 0; i < 4; i++) {
    random += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)]
  }

  return `IMMOCREW-${prefix}${random}`
}

/**
 * Genere un code fallback base sur un uuid (utilise si collision apres 5 tentatives).
 *
 * @param userId - ID du client (TEXT, format uuid)
 * @returns Code au format IMMOCREW-USERabc123
 */
export function generateFallbackCode(userId: string): string {
  const suffix = userId.replace(/-/g, "").slice(0, 6).toUpperCase()
  return `IMMOCREW-USER${suffix}`
}

/**
 * Masque un email pour affichage RGPD.
 * jean.dupont@gmail.com -> j**@gmail.com
 * ab@test.fr -> a**@test.fr
 *
 * @param email - Email complet
 * @returns Email masque
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return "***@***"

  const firstChar = local[0]
  return `${firstChar}**@${domain}`
}
