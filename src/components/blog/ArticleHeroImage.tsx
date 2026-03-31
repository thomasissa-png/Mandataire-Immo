import Image from "next/image"
import { getArticleImage, type ArticleImage } from "@/lib/city-image"

interface ArticleHeroImageProps {
  title: string
  slug: string
  category: string
}

/**
 * Image hero pour les articles de blog.
 * Affiche une photo de ville si l'article est géolocalisé,
 * sinon une photo thématique liée à la catégorie.
 *
 * Rendu SSR — Server Component (pas de "use client").
 */
export function ArticleHeroImage({
  title,
  slug,
  category,
}: ArticleHeroImageProps) {
  const image: ArticleImage = getArticleImage(title, slug, category, 1200, 400)

  return (
    <figure className="relative w-full h-[200px] tablet:h-[300px] rounded-xl overflow-hidden mb-8">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />
      {/* Overlay gradient pour lisibilité du crédit */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Nom de la ville si détecté */}
      {image.type === "city" && image.cityName && (
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white/90"
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
          <span className="text-white/90 text-body-sm font-medium">
            {image.cityName}
          </span>
        </div>
      )}

      {/* Crédit photographe */}
      <figcaption className="absolute bottom-3 right-4 text-white/60 text-caption">
        Photo : {image.photographer} / Unsplash
      </figcaption>
    </figure>
  )
}
