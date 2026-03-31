"use client"

import Image from "next/image"
import { useState } from "react"
import { getArticleThumbnail } from "@/lib/city-image"

interface ArticleThumbnailProps {
  title: string
  slug: string
  category: string
  /** Taille de la vignette */
  size?: "sm" | "md"
}

/**
 * Vignette d'image pour les cartes d'articles dans la grille du blog.
 * Affiche une photo de ville ou thématique selon le contenu de l'article.
 * Fallback gracieux vers un fond coloré si l'image ne charge pas.
 */
export function ArticleThumbnail({
  title,
  slug,
  category,
  size = "sm",
}: ArticleThumbnailProps) {
  const [hasError, setHasError] = useState(false)
  const image = getArticleThumbnail(title, slug, category)

  const sizeClasses = size === "sm"
    ? "w-16 h-16 tablet:w-20 tablet:h-20"
    : "w-24 h-24 tablet:w-32 tablet:h-32"

  if (hasError) {
    return null
  }

  return (
    <div
      className={`${sizeClasses} relative rounded-lg overflow-hidden flex-shrink-0`}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover"
        sizes={size === "sm" ? "80px" : "128px"}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
