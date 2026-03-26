import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

/**
 * GET /api/setup-admin
 * Crée le compte admin automatiquement à partir des variables d'environnement
 * ADMIN_EMAIL et ADMIN_PASSWORD. Idempotent — ne fait rien si le compte existe.
 *
 * Usage : curl https://ton-site.replit.app/api/setup-admin
 * Ou simplement visiter l'URL dans le navigateur.
 *
 * Prérequis : ADMIN_EMAIL et ADMIN_PASSWORD dans les Secrets Replit.
 */
export async function GET() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "Variables ADMIN_EMAIL et ADMIN_PASSWORD manquantes dans les Secrets Replit.",
        instructions: "Ajoute ADMIN_EMAIL=ton@email.com et ADMIN_PASSWORD=ton-mot-de-passe dans Replit → Secrets.",
      },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD doit contenir au moins 8 caractères." },
      { status: 400 }
    )
  }

  try {
    // Check if admin account already exists
    const { rows: existing } = await query<{ id: string }>(
      "SELECT id FROM clients WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    )

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: `Le compte admin ${email} existe déjà. Tu peux te connecter sur /sign-in.`,
        created: false,
      })
    }

    // Create admin account
    const passwordHash = await hashPassword(password)
    await query(
      `INSERT INTO clients (email, first_name, last_name, password_hash, email_verified, status, created_at)
       VALUES ($1, $2, $3, $4, TRUE, 'active', NOW())`,
      [email.toLowerCase().trim(), "Admin", "ImmoCrew", passwordHash]
    )

    return NextResponse.json({
      success: true,
      message: `Compte admin créé : ${email}. Tu peux te connecter sur /sign-in avec ton mot de passe.`,
      created: true,
    })
  } catch (err) {
    console.error("[setup-admin] Error:", err)
    return NextResponse.json(
      {
        error: "Erreur lors de la création du compte admin.",
        details: err instanceof Error ? err.message : String(err),
        hint: "As-tu exécuté la migration SQL ? ALTER TABLE clients ADD COLUMN IF NOT EXISTS password_hash TEXT; ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;",
      },
      { status: 500 }
    )
  }
}
