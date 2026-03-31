import type { NextAuthOptions, Session, User, Account } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { query } from "@/lib/db"

/**
 * Comparaison de mot de passe avec bcryptjs (import dynamique pour ne charger
 * que cote serveur et reduire le bundle client).
 */
async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Hash un mot de passe avec bcryptjs.
 * Salt rounds = 12 (bon compromis securite/performance).
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 12)
}

interface ClientRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  password_hash: string | null
  email_verified: boolean
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
    error: "/sign-in",
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.toLowerCase().trim()

        const { rows } = await query<ClientRow>(
          "SELECT id, email, first_name, last_name, password_hash, email_verified FROM clients WHERE email = $1 LIMIT 1",
          [email]
        )

        const client = rows[0]
        if (!client || !client.password_hash) {
          return null
        }

        const isValid = await verifyPassword(
          credentials.password,
          client.password_hash
        )
        if (!isValid) {
          return null
        }

        return {
          id: client.id,
          email: client.email,
          name:
            [client.first_name, client.last_name].filter(Boolean).join(" ") ||
            null,
          firstName: client.first_name,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      // Google OAuth : créer le client dans la DB s'il n'existe pas
      if (account?.provider === "google" && user.email) {
        const email = user.email.toLowerCase().trim()
        const { rows } = await query<{ id: string }>(
          "SELECT id FROM clients WHERE email = $1 LIMIT 1",
          [email]
        )

        if (rows.length === 0) {
          // Créer le compte automatiquement
          const nameParts = (user.name || "").split(" ")
          const firstName = nameParts[0] || ""
          const lastName = nameParts.slice(1).join(" ") || ""

          await query(
            `INSERT INTO clients (email, first_name, last_name, email_verified, status, created_at)
             VALUES ($1, $2, $3, TRUE, 'pending', NOW())
             ON CONFLICT (email) DO NOTHING`,
            [email, firstName, lastName]
          )
        }

        // Récupérer l'ID client pour le token
        const { rows: clientRows } = await query<ClientRow>(
          "SELECT id, email, first_name, last_name FROM clients WHERE email = $1 LIMIT 1",
          [email]
        )

        if (clientRows[0]) {
          user.id = clientRows[0].id
          ;(user as User & { firstName?: string | null }).firstName = clientRows[0].first_name
          user.name = [clientRows[0].first_name, clientRows[0].last_name].filter(Boolean).join(" ") || user.name
        }
      }

      return true
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT
      user?: User & { firstName?: string | null }
    }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.firstName = (user as User & { firstName?: string | null })
          .firstName
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        ;(session.user as Session["user"] & { firstName?: string | null }).firstName =
          token.firstName as string | null
      }
      return session
    },
  },
}
