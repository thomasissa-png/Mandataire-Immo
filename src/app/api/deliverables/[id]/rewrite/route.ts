import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { getClientContext } from "@/lib/client-context"
import { generateJSON } from "@/lib/claude"

/**
 * POST /api/deliverables/[id]/rewrite
 * Régénère le contenu d'un deliverable via IA.
 * Max 3 réécritures par deliverable. Accepte un commentaire optionnel
 * de Sophie pour guider la réécriture.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  // Commentaire optionnel de Sophie
  let comment = ""
  try {
    const body = await request.json()
    comment = typeof body.comment === "string" ? body.comment.trim() : ""
  } catch {
    // Pas de body = pas de commentaire
  }

  // Vérifier ownership + récupérer le contenu actuel
  const { rows } = await query<{
    id: string
    content: string
    title: string
    type: string
    client_id: string
    rewrite_count: number
    metadata: Record<string, unknown>
  }>(
    `SELECT d.id, d.content, d.title, d.type, d.client_id,
            COALESCE(d.rewrite_count, 0) as rewrite_count, d.metadata
     FROM deliverables d
     JOIN clients c ON d.client_id = c.id
     WHERE d.id = $1 AND c.email = $2`,
    [id, session.user.email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Contenu introuvable" }, { status: 404 })
  }

  const deliverable = rows[0]

  if (deliverable.rewrite_count >= 3) {
    return NextResponse.json(
      { error: "Nombre maximum de réécritures atteint (3). Contacte-nous à contact@immocrew.fr pour une révision manuelle." },
      { status: 429 }
    )
  }

  // Si pas de clé API, mode dégradé (incrémenter le compteur + message)
  if (!process.env.ANTHROPIC_API_KEY) {
    await query(
      `UPDATE deliverables SET rewrite_count = COALESCE(rewrite_count, 0) + 1 WHERE id = $1`,
      [id]
    )
    return NextResponse.json({
      content: deliverable.content,
      rewriteCount: deliverable.rewrite_count + 1,
      message: "La réécriture sera disponible quand le service IA sera activé.",
    })
  }

  // Récupérer le contexte client pour la régénération
  let ctx
  try {
    ctx = await getClientContext(deliverable.client_id)
  } catch {
    return NextResponse.json({ error: "Impossible de charger ton profil" }, { status: 500 })
  }

  // Construire le prompt de réécriture
  const systemPrompt = `Tu es un expert en marketing immobilier pour mandataires indépendants.
Tu dois RÉÉCRIRE le contenu ci-dessous en gardant le même format et la même longueur.
Le contenu doit être personnalisé pour ${ctx.prenom} ${ctx.nom}, mandataire ${ctx.reseau} à ${ctx.zone_geo.ville}.
Ton : ${ctx.ton}. Direct, concret, zéro jargon.
${comment ? `\nLa mandataire a demandé cette modification : "${comment}"` : ""}
${deliverable.rewrite_count > 0 ? `\nCette réécriture est la tentative #${deliverable.rewrite_count + 1}. Propose quelque chose de SIGNIFICATIVEMENT différent des versions précédentes.` : ""}

IMPORTANT : retourne UNIQUEMENT le nouveau contenu, sans explication ni commentaire.`

  const userPrompt = `Contenu actuel à réécrire :\n\n${deliverable.content}`

  try {
    const result = await generateJSON<{ contenu: string }>(
      {
        system: systemPrompt,
        user: `${userPrompt}\n\nRetourne un JSON : { "contenu": "le nouveau texte ici" }`,
        maxTokens: 4096,
      }
    )

    const newContent = result.data.contenu

    // Mettre à jour en base
    await query(
      `UPDATE deliverables
       SET content = $1,
           rewrite_count = COALESCE(rewrite_count, 0) + 1,
           metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{last_rewrite_comment}', $2::jsonb)
       WHERE id = $3`,
      [newContent, JSON.stringify(comment || null), id]
    )

    return NextResponse.json({
      content: newContent,
      rewriteCount: deliverable.rewrite_count + 1,
    })
  } catch (err) {
    console.error("[rewrite] AI generation error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la réécriture. Réessaie dans quelques secondes." },
      { status: 500 }
    )
  }
}
