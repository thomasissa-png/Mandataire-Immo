"use client"

import { useState, useMemo } from "react"
import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"
import { canAutoGenerate, generatePostVisualUrl } from "@/lib/generate-post-visual"

// ─── Plateformes ─────────────────────────────────────────────────

interface PlatformInfo {
  icon: string
  name: string
  color: string
  badgeColor: string
  tip: string
}

const PLATFORMS: Record<string, PlatformInfo> = {
  instagram: {
    icon: "📸",
    name: "Instagram",
    color: "bg-secondary-50 text-secondary-700",
    badgeColor: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    tip: "Publie entre 18h et 20h · Format carré ou 4:5 · 3-5 hashtags max",
  },
  linkedin: {
    icon: "💼",
    name: "LinkedIn",
    color: "bg-primary-50 text-primary-700",
    badgeColor: "bg-[#0077B5]",
    tip: "Publie entre 7h et 9h · Pas de hashtags en excès (3 max) · Accroche percutante en 1re ligne",
  },
  facebook: {
    icon: "📘",
    name: "Facebook",
    color: "bg-info-50 text-info-700",
    badgeColor: "bg-[#1877F2]",
    tip: "Publie entre 12h et 13h · Les posts avec photo marchent 2x mieux · Pose une question pour l'engagement",
  },
  tiktok: {
    icon: "🎵",
    name: "TikTok",
    color: "bg-neutral-100 text-neutral-700",
    badgeColor: "bg-black",
    tip: "Publie entre 19h et 21h · Vertical 9:16 · Son tendance si possible",
  },
}

const DEFAULT_PLATFORM: PlatformInfo = {
  icon: "📱",
  name: "Post",
  color: "bg-secondary-50 text-secondary-700",
  badgeColor: "bg-neutral-500",
  tip: "Publie aux heures de forte activité de ton audience locale",
}

function getPlatform(d: Deliverable): PlatformInfo {
  const meta = d.metadata as Record<string, unknown> | undefined
  if (meta?.plateforme && typeof meta.plateforme === "string") {
    const key = meta.plateforme.toLowerCase()
    if (PLATFORMS[key]) return PLATFORMS[key]
    // Chercher par inclusion
    for (const [k, v] of Object.entries(PLATFORMS)) {
      if (key.includes(k)) return v
    }
  }
  // Fallback : détecter dans le titre
  const t = d.title.toLowerCase()
  if (t.includes("instagram") || t.includes("reel")) return PLATFORMS.instagram
  if (t.includes("linkedin")) return PLATFORMS.linkedin
  if (t.includes("facebook")) return PLATFORMS.facebook
  if (t.includes("tiktok")) return PLATFORMS.tiktok
  return DEFAULT_PLATFORM
}

// ─── Composant ───────────────────────────────────────────────────

interface PostsFilteredProps {
  posts: Deliverable[]
  activePlatforms?: string[]
}

export function PostsFiltered({ posts, activePlatforms }: PostsFilteredProps) {
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)

  // Compter les posts par plateforme — uniquement les plateformes actives de Sophie
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of posts.filter((d) => d.status !== "archived")) {
      const platform = getPlatform(p)
      // N'afficher que les plateformes où Sophie est active
      if (activePlatforms && !activePlatforms.includes(platform.name)) continue
      counts[platform.name] = (counts[platform.name] || 0) + 1
    }
    return counts
  }, [posts, activePlatforms])

  return (
    <FilteredPageWrapper deliverables={posts} showArchiveToggle>
      {(filtered) => {
        // Appliquer le filtre plateforme
        const displayed = platformFilter
          ? filtered.filter((d) => getPlatform(d).name === platformFilter)
          : filtered

        return (
          <>
            {/* Filtre par plateforme */}
            {Object.keys(platformCounts).length > 1 && (
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setPlatformFilter(null)}
                  className={`flex-shrink-0 px-3 py-1.5 min-h-[44px] rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
                    !platformFilter ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Tous ({filtered.length})
                </button>
                {Object.entries(platformCounts).map(([name, count]) => {
                  const info = Object.values(PLATFORMS).find((p) => p.name === name) || DEFAULT_PLATFORM
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setPlatformFilter(name)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
                        platformFilter === name ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      <span aria-hidden="true">{info.icon}</span>
                      {name} ({count})
                    </button>
                  )
                })}
              </div>
            )}

            {/* État vide */}
            {displayed.length === 0 ? (
              <div className="rounded-lg bg-card border border-border p-8 text-center">
                <p className="text-body text-neutral-500">
                  {platformFilter
                    ? `Aucun post ${platformFilter} pour cette période.`
                    : "Aucun post pour cette période — change de mois ou vérifie tes filtres."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayed.map((post) => {
                  const platform = getPlatform(post)
                  const meta = post.metadata as Record<string, unknown> | undefined
                  const hashtags = Array.isArray(meta?.hashtags) ? (meta.hashtags as string[]) : []
                  const briefVisuel = typeof meta?.brief_visuel === "string" ? meta.brief_visuel : null

                  return (
                    <div key={post.id}>
                      <DeliverableCard
                        id={post.id}
                        type={post.type}
                        typeLabel={platform.name}
                        typeColor={platform.color}
                        title={post.title}
                        status={post.status}
                        createdAt={post.created_at}
                      />
                      {/* Infos sous chaque post : heure + brief visuel + hashtags */}
                      <div className="mt-1.5 ml-1 space-y-1">
                        <p className="text-caption text-neutral-400">{platform.tip}</p>
                        {briefVisuel && (() => {
                          const autoVisual = canAutoGenerate(briefVisuel)
                            ? generatePostVisualUrl({ briefVisuel, titre: post.title, plateforme: platform.name.toLowerCase() })
                            : null
                          return (
                            <div className="flex items-start gap-1.5">
                              <span className="text-caption" aria-hidden="true">📷</span>
                              <div>
                                <p className="text-caption text-neutral-500">
                                  <span className="font-semibold text-neutral-600">Visuel :</span> {briefVisuel}
                                </p>
                                {autoVisual && (
                                  <a
                                    href={autoVisual.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-1 text-caption font-semibold text-secondary-700 hover:underline"
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Télécharger le visuel prêt à publier
                                  </a>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                        {hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {hashtags.slice(0, 8).map((tag) => (
                              <span key={tag} className="text-caption text-secondary-500">
                                #{tag.replace(/^#/, "")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )
      }}
    </FilteredPageWrapper>
  )
}
