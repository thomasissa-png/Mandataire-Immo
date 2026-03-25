import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { generate, generateJSON } from "@/lib/claude"
import { getClientContext, type ClientContext } from "@/lib/client-context"
import { trackServer } from "@/lib/tracking"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"

interface BienInput {
  titre: string
  type: string
  adresse: string
  prix: number
  surface: number
  pieces: number
  points_forts: string
}

interface BoostMandatBody {
  client_id: string
  bien: BienInput
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/boost-mandat
 * Genere le pack Boost Mandat pour un bien specifique.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  const user = await currentUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.emailAddresses[0]?.emailAddress
  if (!userEmail || userEmail !== adminEmail) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
  }

  let body: BoostMandatBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { client_id, bien } = body
  if (!client_id || !bien || !bien.titre) {
    return NextResponse.json(
      { error: "client_id et bien (avec titre) sont requis" },
      { status: 400 }
    )
  }

  let ctx: ClientContext
  try {
    ctx = await getClientContext(client_id)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Client context error"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { rows: clientRows } = await query<{ email: string }>(
    "SELECT email FROM clients WHERE id = $1",
    [client_id]
  )
  const clientEmail = clientRows[0]?.email
  if (!clientEmail) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  const month = new Date().toISOString().slice(0, 7)

  await trackServer("production_started", userEmail, {
    client_id,
    pack_type: "boost",
    bien_titre: bien.titre,
  })

  const deliverableIds: string[] = []

  try {
    // B1 : Annonce storytelling pour le bien
    const annoncePrompt = buildAnnonceStorytellingPrompt({
      ...ctx,
      bien_unique: bien,
      nombre_annonces: 1,
    })
    const annonceResult = await generateJSON<{ annonces: Array<{ bien_titre: string; annonce_complete: string; accroche_courte: string; titre_annonce: string; mots_cles_seo: string[] }> }>(
      { ...annoncePrompt, maxTokens: 4096 }
    )
    for (const annonce of annonceResult.data.annonces) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "annonce",
        title: annonce.titre_annonce,
        content: annonce.annonce_complete,
        metadata: { accroche_courte: annonce.accroche_courte, bien_titre: bien.titre, boost: true },
        month,
      })
      deliverableIds.push(id)
    }

    // B2 : 3 posts + 1 Reel dedies au bien
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 3,
      biens_a_mettre_en_avant: [0],
      // Overrider les biens avec uniquement le bien boost
      biens: [bien],
    })
    const postsResult = await generateJSON<{ posts: Array<{ plateforme: string; type: string; texte: string; hashtags: string[]; brief_visuel: string; hook: string }> }>(
      { ...postsPrompt, maxTokens: 4096 }
    )
    for (const post of postsResult.data.posts) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "post",
        title: post.hook || `Post boost ${bien.titre}`,
        content: post.texte,
        metadata: { hashtags: post.hashtags, brief_visuel: post.brief_visuel, plateforme: post.plateforme, boost: true, bien_titre: bien.titre },
        month,
      })
      deliverableIds.push(id)
    }

    // 1 script Reel dedie au bien
    const reelResult = await generateReelScript(ctx, bien)
    const reelId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "script_video",
      title: `Reel — ${bien.titre}`,
      content: reelResult,
      metadata: { boost: true, bien_titre: bien.titre },
      month,
    })
    deliverableIds.push(reelId)

    // B4 : Email blast acheteurs
    const emailResult = await generateEmailBlast(ctx, bien)
    const emailId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "email_prospection",
      title: `Email blast — ${bien.titre}`,
      content: emailResult,
      metadata: { boost: true, bien_titre: bien.titre, sub_type: "email_blast_acheteurs" },
      month,
    })
    deliverableIds.push(emailId)

  } catch (err) {
    console.error("Error generating boost mandat:", err)
    return NextResponse.json(
      {
        error: "Erreur lors de la generation",
        details: err instanceof Error ? err.message : String(err),
        deliverable_ids: deliverableIds,
      },
      { status: 500 }
    )
  }

  await trackServer("production_completed", userEmail, {
    client_id,
    pack_type: "boost",
    bien_titre: bien.titre,
    deliverables_count: deliverableIds.length,
  })

  return NextResponse.json({
    deliverable_ids: deliverableIds,
    status: "completed",
    count: deliverableIds.length,
  })
}

// --- Helpers ---

async function insertDeliverable(params: {
  clientEmail: string
  clientId: string
  type: string
  title: string
  content: string
  metadata: Record<string, unknown>
  month: string
}): Promise<string> {
  const { rows } = await query<DeliverableRow>(
    `INSERT INTO deliverables (client_email, client_id, type, title, content, metadata, month, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', NOW())
     RETURNING id`,
    [
      params.clientEmail,
      params.clientId,
      params.type,
      params.title,
      params.content,
      JSON.stringify(params.metadata),
      params.month,
    ]
  )
  return rows[0].id
}

// --- Prompts provisoires ---

async function generateReelScript(ctx: ClientContext, bien: BienInput): Promise<string> {
  const result = await generate({
    system: `Tu es un redacteur de scripts video courts (Reels 30-60s) pour mandataires immobiliers en France.`,
    user: `Redige 1 script Reel pour mettre en avant ce bien :
Titre: ${bien.titre}. Type: ${bien.type}. Adresse: ${bien.adresse}. Prix: ${bien.prix.toLocaleString("fr-FR")}EUR.
Surface: ${bien.surface}m2. Pieces: ${bien.pieces}. Points forts: ${bien.points_forts}.
Mandataire: ${ctx.prenom} ${ctx.nom}, ${ctx.reseau}, ${ctx.zone_geo.ville}. Ton: ${ctx.ton}.
Format: decoupage scene par scene avec texte voix off et indications visuelles.`,
    maxTokens: 2048,
  })
  return result.content
}

async function generateEmailBlast(ctx: ClientContext, bien: BienInput): Promise<string> {
  const result = await generate({
    system: `Tu es un redacteur d'emails immobiliers. Tu rediges des emails de presentation de bien a une base d'acheteurs potentiels.`,
    user: `Redige 1 email pour presenter ce bien a des acheteurs potentiels :
Bien: ${bien.titre}, ${bien.type}, ${bien.adresse}, ${bien.prix.toLocaleString("fr-FR")}EUR, ${bien.surface}m2, ${bien.pieces} pieces.
Points forts: ${bien.points_forts}.
Mandataire: ${ctx.prenom} ${ctx.nom}, ${ctx.reseau}, ${ctx.zone_geo.ville}. Ton: ${ctx.ton}.
L'email doit donner envie de visiter. CTA: contacter ${ctx.prenom}.`,
    maxTokens: 2048,
  })
  return result.content
}
