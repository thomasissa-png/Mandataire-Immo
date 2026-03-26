import { createHmac } from "crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

/**
 * Génère le token admin attendu à partir du mot de passe.
 * Déterministe : même password → même token.
 */
export function generateAdminToken(password: string): string {
  return createHmac("sha256", password)
    .update("immocrew-admin")
    .digest("hex")
}

/**
 * Vérifie si la requête courante a un cookie admin valide.
 * À utiliser dans les Server Components et les Route Handlers.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false

  const expected = generateAdminToken(adminPassword)
  return token === expected
}

export { COOKIE_NAME, COOKIE_MAX_AGE }
