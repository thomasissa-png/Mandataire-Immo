import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

interface SignUpBody {
  firstName: string
  lastName: string
  email: string
  password: string
}

/**
 * POST /api/auth/sign-up
 * Cree un nouveau compte utilisateur avec email/password.
 * L'utilisateur est ensuite redirige vers /sign-in pour se connecter.
 */
export async function POST(request: NextRequest) {
  let body: SignUpBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { firstName, lastName, email, password } = body

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    )
  }

  const trimmedEmail = email.toLowerCase().trim()

  // Validation basique de l'email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json(
      { error: "Adresse email invalide" },
      { status: 400 }
    )
  }

  // Validation mot de passe (minimum 8 caracteres)
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caracteres" },
      { status: 400 }
    )
  }

  // Verifier si l'email existe deja
  const { rows: existing } = await query<{ id: string }>(
    "SELECT id FROM clients WHERE email = $1 LIMIT 1",
    [trimmedEmail]
  )

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Un compte existe deja avec cette adresse email" },
      { status: 409 }
    )
  }

  // Hash du mot de passe et creation du compte
  const passwordHash = await hashPassword(password)

  try {
    await query(
      `INSERT INTO clients (email, first_name, last_name, password_hash, email_verified, created_at)
       VALUES ($1, $2, $3, $4, TRUE, NOW())`,
      [trimmedEmail, firstName.trim(), lastName.trim(), passwordHash]
    )
  } catch (err) {
    console.error("Error creating user:", err)
    return NextResponse.json(
      { error: "Erreur lors de la creation du compte" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
