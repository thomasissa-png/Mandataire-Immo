"use client"

import { useState } from "react"

interface GenerateResult {
  success: boolean
  title?: string
  slug?: string
  category?: string
  word_count?: number
  preview?: string
  error?: string
  details?: string
}

interface Props {
  nextTopicTitle: string | null
  nextTopicSlug: string | null
  nextTopicCategory: string | null
}

export default function GenerateArticleButton({
  nextTopicTitle,
  nextTopicSlug,
  nextTopicCategory,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)

  async function handleGenerate() {
    if (loading) return
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto: true }),
      })

      const data: GenerateResult = await response.json()

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || "Erreur inconnue",
          details: data.details,
        })
      } else {
        setResult(data)
      }
    } catch (err) {
      setResult({
        success: false,
        error: "Erreur reseau",
        details: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setLoading(false)
    }
  }

  if (!nextTopicTitle) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-display text-h3 text-primary mb-2">
          Articles SEO
        </h2>
        <p className="text-body-sm text-neutral-500">
          Tous les sujets du calendrier editorial ont ete generes.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h2 className="font-display text-h3 text-primary mb-4">
        Articles SEO
      </h2>

      {/* Prochain sujet */}
      <div className="mb-4 p-4 rounded-lg bg-neutral-50 border border-border">
        <p className="text-caption text-neutral-500 mb-1">
          Prochain article a generer
        </p>
        <p className="text-body font-semibold text-foreground">
          {nextTopicTitle}
        </p>
        <div className="flex gap-2 mt-2">
          <span className="text-caption bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
            {nextTopicCategory}
          </span>
          <span className="text-caption bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
            {nextTopicSlug}
          </span>
        </div>
      </div>

      {/* Bouton */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg font-display font-semibold text-body-sm text-white bg-secondary hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-normal"
      >
        {loading ? "Generation en cours..." : "Generer un article SEO"}
      </button>

      {loading && (
        <p className="text-caption text-neutral-500 mt-2 text-center">
          La generation prend 30 a 60 secondes. Ne ferme pas cette page.
        </p>
      )}

      {/* Resultat */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            result.success
              ? "bg-success-50 border-success-200"
              : "bg-error-50 border-error-200"
          }`}
        >
          {result.success ? (
            <>
              <p className="text-body-sm font-semibold text-success-800 mb-1">
                Article genere avec succes
              </p>
              <p className="text-body-sm text-foreground font-semibold">
                {result.title}
              </p>
              <div className="flex gap-2 mt-2 mb-3">
                <span className="text-caption bg-white text-neutral-600 px-2 py-0.5 rounded-full">
                  {result.category}
                </span>
                <span className="text-caption bg-white text-neutral-600 px-2 py-0.5 rounded-full">
                  {result.word_count} mots
                </span>
              </div>
              {result.preview && (
                <p className="text-caption text-neutral-600 line-clamp-3">
                  {result.preview}
                </p>
              )}
              <a
                href={`/blog/${result.slug}`}
                className="inline-block mt-3 text-body-sm text-secondary hover:underline"
              >
                Voir l&apos;article
              </a>
            </>
          ) : (
            <>
              <p className="text-body-sm font-semibold text-error-700 mb-1">
                Erreur
              </p>
              <p className="text-caption text-error-600">
                {result.error}
              </p>
              {result.details && (
                <p className="text-caption text-error-500 mt-1">
                  {result.details}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
