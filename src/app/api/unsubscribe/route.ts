/**
 * GET /api/unsubscribe?token=...
 *
 * Désinscrit un client des emails nurturing.
 * Le token est l'email encodé en base64 (V1 — suffisant pour un lien cliqué depuis la boîte mail).
 * Pas d'auth requise.
 * Retourne une page HTML simple de confirmation.
 *
 * Rendu : SSR (mutation publique)
 */

import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return new NextResponse(buildHtmlPage("Lien invalide", "Ce lien de désinscription est invalide."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  // Décoder le token (email en base64)
  let email: string
  try {
    email = Buffer.from(token, "base64").toString("utf-8")
  } catch {
    return new NextResponse(buildHtmlPage("Lien invalide", "Ce lien de désinscription est invalide."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  // Vérifier que l'email ressemble à un email
  if (!email.includes("@")) {
    return new NextResponse(buildHtmlPage("Lien invalide", "Ce lien de désinscription est invalide."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  // Mettre à jour le client
  const { rowCount } = await query(
    `UPDATE clients
     SET email_unsubscribed = TRUE, email_unsubscribed_at = NOW()
     WHERE email = $1 AND (email_unsubscribed = FALSE OR email_unsubscribed IS NULL)`,
    [email]
  )

  if (rowCount === 0) {
    // Client non trouvé ou déjà désinscrit — on affiche quand même un message positif
    // pour ne pas révéler si l'email existe dans la base
    return new NextResponse(
      buildHtmlPage(
        "Désinscription confirmée",
        "Tu ne recevras plus nos emails. Si c'est une erreur, contacte-nous à support@immocrew.fr"
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  console.log(`[Unsubscribe] Client désinscrit : ${email}`)

  return new NextResponse(
    buildHtmlPage(
      "Désinscription confirmée",
      "Tu ne recevras plus nos emails. Si c'est une erreur, contacte-nous à support@immocrew.fr"
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}

// ---------------------------------------------------------------------------
// Page HTML simple de confirmation
// ---------------------------------------------------------------------------

function buildHtmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ImmoCrew</title>
<style>
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F8F9FA;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1B2A4A;
  }
  .card {
    max-width: 480px;
    width: 90%;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 48px 32px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  h1 { font-size: 24px; margin: 0 0 16px; }
  p { font-size: 16px; line-height: 1.6; color: #6B7280; margin: 0; }
  a { color: #F27A1A; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="card">
  <h1>${title}</h1>
  <p>${message.replace("support@immocrew.fr", '<a href="mailto:support@immocrew.fr">support@immocrew.fr</a>')}</p>
</div>
</body>
</html>`
}
