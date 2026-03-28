/**
 * POST /api/biens
 * Crée une fiche bien pour le mandataire connecté (Sophie).
 * Génère un slug unique, insère en base avec status='draft'.
 * Lance en fire-and-forget le géocodage BAN + enrichissement DVF.
 *
 * Rendu : SSR (mutation authentifiée)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { enrichProperty } from "@/lib/enrich-property"
import type { PropertyPage } from "@/types/property"

// ─── GET : Liste des biens du mandataire ──────────────────────────

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const { rows } = await query<PropertyPage>(
      `SELECT id, client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
              points_forts, description_detaillee, annonce_longue, annonce_courte,
              titre_annonce, accroche_courte, photos_originales, photos_staging,
              status, slug, published_at, created_at, updated_at
       FROM property_pages
       WHERE client_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    )

    return NextResponse.json({ biens: rows })
  } catch (err) {
    console.error("[GET /api/biens] Erreur:", err)
    return NextResponse.json(
      { error: "Impossible de charger tes biens" },
      { status: 500 }
    )
  }
}

// ─── Validation ────────────────────────────────────────────────────

interface CreateBienBody {
  titre: string
  type_bien: string
  adresse: string
  prix: number
  surface: number
  pieces: number
  points_forts: string
  description_detaillee?: string
}

function validateBody(body: unknown): { valid: true; data: CreateBienBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Corps de requête invalide" }
  }

  const b = body as Record<string, unknown>

  const requiredStrings = ["titre", "type_bien", "adresse", "points_forts"] as const
  for (const field of requiredStrings) {
    if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
      return { valid: false, error: `Le champ "${field}" est requis` }
    }
  }

  if (typeof b.prix !== "number" || b.prix <= 0) {
    return { valid: false, error: "Prix invalide — doit être un nombre positif" }
  }
  if (typeof b.surface !== "number" || b.surface <= 0) {
    return { valid: false, error: "Surface invalide — doit être un nombre positif" }
  }
  if (typeof b.pieces !== "number" || b.pieces <= 0 || !Number.isInteger(b.pieces)) {
    return { valid: false, error: "Nombre de pièces invalide — doit être un entier positif" }
  }

  return {
    valid: true,
    data: {
      titre: (b.titre as string).trim(),
      type_bien: (b.type_bien as string).trim(),
      adresse: (b.adresse as string).trim(),
      prix: b.prix as number,
      surface: b.surface as number,
      pieces: b.pieces as number,
      points_forts: (b.points_forts as string).trim(),
      description_detaillee:
        typeof b.description_detaillee === "string" && b.description_detaillee.trim()
          ? b.description_detaillee.trim()
          : undefined,
    },
  }
}

// ─── Slug ──────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

async function generateUniqueSlug(adresse: string): Promise<string> {
  const base = slugify(adresse)
  if (!base) {
    // Fallback si l'adresse ne produit aucun caractère valide
    return `bien-${Date.now()}`
  }

  // Vérifier l'unicité
  const { rows } = await query<{ slug: string }>(
    "SELECT slug FROM property_pages WHERE slug LIKE $1",
    [`${base}%`]
  )

  if (rows.length === 0) return base

  const existingSlugs = new Set(rows.map((r) => r.slug))
  if (!existingSlugs.has(base)) return base

  // Ajouter un suffixe numérique
  let counter = 2
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++
  }
  return `${base}-${counter}`
}

// ─── Route ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 })
  }

  const validation = validateBody(body)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const data = validation.data
  const slug = await generateUniqueSlug(data.adresse)

  // Insérer le bien en base
  const { rows } = await query<{ id: string }>(
    `INSERT INTO property_pages (
      client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
      points_forts, description_detaillee, slug, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft')
    RETURNING id`,
    [
      user.id,
      user.email,
      data.titre,
      data.type_bien,
      data.adresse,
      data.prix,
      data.surface,
      data.pieces,
      data.points_forts,
      data.description_detaillee || null,
      slug,
    ]
  )

  const propertyId = rows[0].id

  // Fire-and-forget : géocodage BAN + enrichissement DVF
  // Note Replit autoscale : on ne fait PAS await ici car c'est un enrichissement
  // non-critique. Les données seront disponibles lors de la génération d'annonce.
  // Si l'enrichissement échoue, l'annonce sera générée sans données DVF.
  enrichProperty(data.adresse)
    .then(async (enriched) => {
      if (enriched) {
        await query(
          `UPDATE property_pages SET
            lat = $1, lon = $2, city = $3, postcode = $4,
            dvf_prix_m2_moyen = $5, dvf_transactions = $6,
            updated_at = NOW()
          WHERE id = $7`,
          [
            enriched.lat,
            enriched.lon,
            enriched.city,
            enriched.postcode,
            enriched.prix_m2_moyen,
            JSON.stringify(enriched.dernieres_transactions),
            propertyId,
          ]
        )
        console.log(`[Enrichissement] Bien ${propertyId} enrichi avec succès`)
      }
    })
    .catch((err) => {
      console.error(`[Enrichissement] Erreur pour bien ${propertyId}:`, err)
    })

  return NextResponse.json({ id: propertyId, slug })
}
