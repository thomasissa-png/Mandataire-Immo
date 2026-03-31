/**
 * /dashboard/biens/[id] — Fiche bien avec photos, annonce et page publique
 *
 * Rendu : SSR (données dynamiques, auth requise)
 * Les composants PhotoUploader et AnnonceBlock sont des Client Components.
 */

import { notFound } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import type { PropertyPage } from "@/types/property"
import { PhotoUploader } from "@/components/biens/PhotoUploader"
import { AnnonceBlock } from "@/components/biens/AnnonceBlock"
import { BienFicheClient } from "@/components/biens/BienFicheClient"
import { BienHeader } from "@/components/biens/BienHeader"

export default async function BienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getSessionUser()
  if (!user) {
    return null
  }

  // Fetch le bien
  const { rows } = await query<PropertyPage>(
    `SELECT id, client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
            points_forts, description_detaillee, annonce_longue, annonce_courte,
            titre_annonce, accroche_courte, photos_originales, photos_staging,
            status, slug, published_at, created_at, updated_at
     FROM property_pages
     WHERE id = $1 AND client_id = $2
     LIMIT 1`,
    [id, user.id]
  )

  if (rows.length === 0) {
    notFound()
  }

  const bien = rows[0]
  const photos = bien.photos_originales || []
  const hasAnnonce = !!(bien.annonce_longue && bien.titre_annonce)

  const existingAnnonce = hasAnnonce
    ? {
        annonce_longue: bien.annonce_longue!,
        annonce_courte: bien.annonce_courte || "",
        titre_annonce: bien.titre_annonce!,
        accroche_courte: bien.accroche_courte || "",
        page_url: bien.slug ? `/bien/${bien.slug}` : "",
      }
    : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Retour */}
      <a
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Retour au dashboard
      </a>

      {/* En-tête bien (Client Component — édition inline) */}
      <BienHeader
        propertyId={bien.id}
        titre={bien.titre}
        type_bien={bien.type_bien}
        adresse={bien.adresse}
        prix={bien.prix}
        surface={bien.surface}
        pieces={bien.pieces}
        points_forts={bien.points_forts}
      />

      {/* Sections — gérées par le Client Component pour la réactivité photos→annonce */}
      <BienFicheClient
        propertyId={bien.id}
        initialPhotos={photos}
        existingAnnonce={existingAnnonce}
        slug={bien.slug}
      />
    </div>
  )
}
