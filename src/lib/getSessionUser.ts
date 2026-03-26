import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface SessionUser {
  id: string
  email: string
  name: string | null
  firstName: string | null
}

/**
 * Recupere l'utilisateur connecte depuis la session NextAuth.
 * Retourne null si pas de session active.
 *
 * Remplace `currentUser()` de Clerk dans toutes les routes serveur.
 *
 * @example
 * const user = await getSessionUser()
 * if (!user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
 * const email = user.email
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    firstName: (session.user as SessionUser).firstName ?? null,
  }
}
