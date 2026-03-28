"use client"

import type { PropertyPage } from "@/types/property"

// ─── Types ────────────────────────────────────────────────────────

interface BienCardProps {
  bien: PropertyPage
}

// ─── Status badges ────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: "Brouillon",
    className: "bg-warning-50 text-warning-800",
  },
  published: {
    label: "Publié",
    className: "bg-success-50 text-success-700",
  },
  archived: {
    label: "Archivé",
    className: "bg-neutral-100 text-neutral-500",
  },
}

// ─── Formatter prix ───────────────────────────────────────────────

const formatPrix = (prix: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(prix)
}

// ─── Composant ────────────────────────────────────────────────────

export function BienCard({ bien }: BienCardProps) {
  const statusConfig = STATUS_CONFIG[bien.status] || STATUS_CONFIG.draft
  const firstPhoto =
    bien.photos_originales && bien.photos_originales.length > 0
      ? bien.photos_originales[0]
      : null

  return (
    <article className="rounded-lg bg-card border border-border overflow-hidden shadow-xs hover:shadow-md hover:border-secondary/30 transition-all duration-150">
      {/* Photo ou placeholder */}
      <div className="relative aspect-[16/9] bg-neutral-100">
        {firstPhoto ? (
          <img
            src={firstPhoto.url}
            alt={bien.titre || `${bien.type_bien} — ${bien.adresse}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
        )}

        {/* Badge statut */}
        <span
          className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-caption font-semibold ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>

        {/* Nombre de photos */}
        {bien.photos_originales && bien.photos_originales.length > 0 && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-caption font-medium">
            {bien.photos_originales.length} photo
            {bien.photos_originales.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-display text-body font-semibold text-primary line-clamp-1 mb-1">
          {bien.titre || `${bien.type_bien} — ${bien.adresse}`}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {bien.type_bien && (
            <span className="px-2 py-0.5 rounded bg-primary-50 text-caption text-primary-700">
              {bien.type_bien}
            </span>
          )}
          {bien.surface > 0 && (
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-caption text-neutral-600">
              {bien.surface} m²
            </span>
          )}
          {bien.pieces > 0 && (
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-caption text-neutral-600">
              {bien.pieces} pièce{bien.pieces > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <p className="text-h4 font-display font-bold text-secondary-700 mb-3">
          {formatPrix(bien.prix)}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`/dashboard/biens/${bien.id}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-secondary-50 text-body-sm font-semibold text-secondary-700 hover:bg-secondary-100 transition-colors"
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Modifier
          </a>

          {bien.status === "published" && bien.slug && (
            <a
              href={`/bien/${bien.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg border border-border text-body-sm font-medium text-neutral-600 hover:text-secondary-700 hover:border-secondary/30 transition-colors"
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Voir la page
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
