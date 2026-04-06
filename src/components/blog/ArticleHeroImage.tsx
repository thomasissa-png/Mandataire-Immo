import Image from "next/image"
import { getArticleImage, type ArticleImage } from "@/lib/city-image"

interface ArticleHeroImageProps {
  title: string
  slug: string
  category: string
}

/**
 * Image hero pour les articles de blog.
 * Affiche uniquement pour les articles géolocalisés (photo de ville).
 * Les articles sans ville n'affichent pas de hero (pas de valeur ajoutée).
 * Compact sur mobile (80px), plus grand sur desktop (200px).
 */
export function ArticleHeroImage({
  title,
  slug,
  category,
}: ArticleHeroImageProps) {
  const image: ArticleImage = getArticleImage(title, slug, category, 1200, 400)

  // Pas de hero pour les articles sans ville — CategoryIcon suffit dans la grille
  if (image.type !== "city") return null

  return (
    <figure className="relative w-full h-[160px] tablet:h-[240px] rounded-xl overflow-hidden mb-8">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {image.cityName && (
        <div className="absolute bottom-2 left-3 tablet:bottom-3 tablet:left-4 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 tablet:w-4 tablet:h-4 text-white/90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-white/90 text-caption tablet:text-body-sm font-medium">
            {image.cityName}
          </span>
        </div>
      )}
    </figure>
  )
}
