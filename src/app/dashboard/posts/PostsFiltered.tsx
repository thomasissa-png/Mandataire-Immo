"use client"

import { useState, useMemo } from "react"
import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

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
}

export function PostsFiltered({ posts }: PostsFilteredProps) {
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)

  // Compter les posts par plateforme
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of posts.filter((d) => d.status !== "archived")) {
      const platform = getPlatform(p)
      counts[platform.name] = (counts[platform.name] || 0) + 1
    }
    return counts
  }, [posts])

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
                      {/* Conseil de publication sous chaque post */}
                      <div className="flex items-center gap-2 mt-1 ml-1">
                        <span className="text-caption text-neutral-400">{platform.tip}</span>
                      </div>
                      {/* Hashtags */}
                      {hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 ml-1">
                          {hashtags.slice(0, 5).map((tag) => (
                            <span key={tag} className="text-caption text-secondary-500">
                              #{tag.replace(/^#/, "")}
                            </span>
                          ))}
                        </div>
                      )}
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
