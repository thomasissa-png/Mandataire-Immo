import { NextRequest, NextResponse } from "next/server"
import {
  generateAdminToken,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
} from "@/lib/admin-auth"

/**
 * POST /api/admin/auth
 * Vérifie le mot de passe admin et pose un cookie de session.
 */
export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré dans les variables d'environnement." },
      { status: 500 }
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  if (!body.password) {
    return NextResponse.json(
      { error: "Mot de passe requis" },
      { status: 400 }
    )
  }

  if (body.password !== adminPassword) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    )
  }

  const token = generateAdminToken(adminPassword)

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return response
}
