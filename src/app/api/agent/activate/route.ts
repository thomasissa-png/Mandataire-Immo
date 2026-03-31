/**
 * POST /api/agent/activate
 * Active la landing page mandataire pour le client connecté.
 * Génère un slug unique à partir du prénom + nom.
 */
import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

// ─── Slugify inline (pas de lib externe) ────────────────────────────

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// ─── Types ──────────────────────────────────────────────────────────

interface ClientRow {
  id: string
  client_context: Record<string, unknown> | null
  first_name: string | null
  last_name: string | null
}

interface ExistingPage {
  slug: string
  status: string
}

// ─── Validation ─────────────────────────────────────────────────────

const VALID_PACKS = new Set(["lancement", "mensuel"])

// ─── Handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const pack = (body as Record<string, unknown>)?.pack
  if (typeof pack !== "string" || !VALID_PACKS.has(pack)) {
    return NextResponse.json(
      { error: "Pack invalide. Valeurs acceptées : lancement, mensuel" },
      { status: 400 }
    )
  }

  try {
    // 1. Récupérer le client
    const { rows: clients } = await query<ClientRow>(
      "SELECT id, client_context, first_name, last_name FROM clients WHERE email = $1 LIMIT 1",
      [user.email]
    )

    if (clients.length === 0) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
    }

    const client = clients[0]
    const ctx = (client.client_context ?? {}) as Record<string, unknown>

    // 2. Vérifier qu'une page n'existe pas déjà
    const { rows: existing } = await query<ExistingPage>(
      "SELECT slug, status FROM agent_pages WHERE client_id = $1 LIMIT 1",
      [client.id]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { slug: existing[0].slug, status: existing[0].status, message: "Page déjà existante" },
        { status: 200 }
      )
    }

    // 3. Générer le slug
    const prenom = typeof ctx.prenom === "string" ? ctx.prenom : client.first_name || ""
    const nom = typeof ctx.nom === "string" ? ctx.nom : client.last_name || ""

    if (!prenom.trim() && !nom.trim()) {
      return NextResponse.json(
        { error: "Prénom et nom requis dans ton profil pour activer ta page." },
        { status: 400 }
      )
    }

    let baseSlug = slugify(`${prenom} ${nom}`)
    let slug = baseSlug

    // Gérer les collisions de slug
    const { rows: slugConflicts } = await query<{ slug: string }>(
      "SELECT slug FROM agent_pages WHERE slug LIKE $1",
      [`${baseSlug}%`]
    )
    if (slugConflicts.length > 0) {
      const existingSlugs = new Set(slugConflicts.map((r) => r.slug))
      let counter = 2
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // 4. Bio : laisser null (la page publique utilise bio_personnelle en fallback)
    // La génération IA sera activée quand ANTHROPIC_API_KEY sera configurée
    const bioGeneree = null

    // 5. INSERT
    await query(
      `INSERT INTO agent_pages (client_id, slug, status, bio_generee, activated_at)
       VALUES ($1, $2, 'active', $3, NOW())`,
      [client.id, slug, bioGeneree]
    )

    return NextResponse.json({ slug, status: "active" }, { status: 201 })
  } catch (err) {
    console.error("POST /api/agent/activate error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'activation de ta page mandataire." },
      { status: 500 }
    )
  }
}
