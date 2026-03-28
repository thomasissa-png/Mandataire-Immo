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

  const formatPrix = (prix: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(prix)
  }

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

      {/* En-tête bien */}
      <div className="rounded-lg bg-card border border-border p-5 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-h2 text-primary font-bold mb-1">
              {bien.titre || `${bien.type_bien} — ${bien.adresse}`}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded bg-primary-50 text-caption font-medium text-primary-700">
                {bien.type_bien}
              </span>
              <span className="text-body-sm text-neutral-500">
                {bien.adresse}
              </span>
            </div>
          </div>
          <p className="text-h3 font-display font-bold text-secondary-700 flex-shrink-0">
            {formatPrix(bien.prix)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {bien.surface > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
              {bien.surface} m²
            </span>
          )}
          {bien.pieces > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
              {bien.pieces} pièce{bien.pieces > 1 ? "s" : ""}
            </span>
          )}
          {bien.points_forts && (
            <span className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700">
              {bien.points_forts}
            </span>
          )}
        </div>
      </div>

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
