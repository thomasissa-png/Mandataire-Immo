// SSR — Public endpoint (pas d'auth requise).
// Valide un code parrainage saisi au checkout.
// Rate limit : 10 req/min par IP.

import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface ReferralCodeRow {
  id: string
  user_id: string
  code: string
}

interface ClientRow {
  first_name: string | null
  client_context: Record<string, unknown> | null
}

// Rate limiter en memoire — Map<ip, { count, resetAt }>
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// Nettoyage periodique pour eviter les fuites memoire
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip)
    }
  }
}, 60_000)

export async function POST(request: NextRequest) {
  // Rate limit par IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { valid: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
    )
  }

  // Valider le body
  let body: { code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ valid: false, error: "invalid_request" })
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : ""

  if (!code || code.length > 30) {
    return NextResponse.json({ valid: false, error: "code_not_found" })
  }

  // Chercher le code en base
  const { rows: codes } = await query<ReferralCodeRow>(
    `SELECT id, user_id, code FROM referral_codes WHERE code = $1 AND is_active = TRUE LIMIT 1`,
    [code]
  )

  if (codes.length === 0) {
    return NextResponse.json({ valid: false, error: "code_not_found" })
  }

  const referralCode = codes[0]

  // Recuperer le prenom du parrain pour l'affichage
  const { rows: clients } = await query<ClientRow>(
    `SELECT first_name, client_context FROM clients WHERE id = $1 LIMIT 1`,
    [referralCode.user_id]
  )

  let referrerFirstName = "un membre"

  if (clients.length > 0) {
    const client = clients[0]
    if (client.first_name) {
      referrerFirstName = client.first_name
    } else {
      const ctx = client.client_context as Record<string, unknown> | null
      if (ctx) {
        const profile = ctx.profile as Record<string, unknown> | undefined
        if (profile?.prenom && typeof profile.prenom === "string") {
          referrerFirstName = profile.prenom
        }
      }
    }
  }

  return NextResponse.json({
    valid: true,
    referrer_first_name: referrerFirstName,
    discount_label: "1 semaine offerte sur ton premier mois",
  })
}
