import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

// ---------------------------------------------------------------------------
// POST /api/auth/reset-password
// Demande de reinitialisation : genere un token et "envoie" un email.
// Securite : retourne toujours le meme message, que l'email existe ou non
// (pas de timing attack sur l'existence d'un compte).
// ---------------------------------------------------------------------------

interface RequestResetBody {
  email: string
}

export async function POST(request: NextRequest) {
  let body: RequestResetBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: "L'adresse email est requise" },
      { status: 400 }
    )
  }

  const trimmedEmail = email.toLowerCase().trim()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json(
      { error: "Adresse email invalide" },
      { status: 400 }
    )
  }

  // Message generique retourne dans tous les cas (securite)
  const genericMessage =
    "Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé."

  // Chercher l'utilisateur
  const { rows } = await query<{ id: string }>(
    "SELECT id FROM clients WHERE email = $1 LIMIT 1",
    [trimmedEmail]
  )

  if (rows.length === 0) {
    // Ne pas reveler que l'email n'existe pas
    return NextResponse.json({ message: genericMessage })
  }

  const userId = rows[0].id

  // Invalider les anciens tokens non utilises pour cet utilisateur
  await query(
    "UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE",
    [userId]
  )

  // Generer un nouveau token (expire dans 1 heure)
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h

  await query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt.toISOString()]
  )

  // TODO: Brancher un provider email (Resend, SendGrid, etc.)
  // Pour le MVP, on log le lien dans la console serveur.
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`
  console.log(`[RESET PASSWORD] Lien de réinitialisation pour ${trimmedEmail}: ${resetUrl}`)

  return NextResponse.json({
    message: genericMessage,
    // En dev uniquement : retourner le lien pour tester sans email
    ...(process.env.NODE_ENV === "development" && { resetUrl }),
  })
}

// ---------------------------------------------------------------------------
// PUT /api/auth/reset-password
// Reinitialisation effective : verifie le token et met a jour le mot de passe.
// ---------------------------------------------------------------------------

interface ResetPasswordBody {
  token: string
  newPassword: string
}

export async function PUT(request: NextRequest) {
  let body: ResetPasswordBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { token, newPassword } = body

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Le token et le nouveau mot de passe sont requis" },
      { status: 400 }
    )
  }

  // Validation mot de passe (minimum 8 caracteres)
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    )
  }

  // Verifier le token : non expire, non utilise
  const { rows } = await query<{
    id: string
    user_id: string
    expires_at: Date
    used: boolean
  }>(
    "SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = $1 LIMIT 1",
    [token]
  )

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Ce lien de réinitialisation est invalide." },
      { status: 400 }
    )
  }

  const resetToken = rows[0]

  if (resetToken.used) {
    return NextResponse.json(
      { error: "Ce lien a déjà été utilisé. Fais une nouvelle demande de réinitialisation." },
      { status: 400 }
    )
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Ce lien a expiré. Fais une nouvelle demande de réinitialisation." },
      { status: 400 }
    )
  }

  // Hash du nouveau mot de passe
  const passwordHash = await hashPassword(newPassword)

  // Mettre a jour le mot de passe et marquer le token comme utilise
  try {
    await query(
      "UPDATE clients SET password_hash = $1 WHERE id = $2",
      [passwordHash, resetToken.user_id]
    )

    await query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
      [resetToken.id]
    )
  } catch (err) {
    console.error("Error resetting password:", err)
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: "Ton mot de passe a été réinitialisé avec succès. Tu peux te connecter.",
  })
}
