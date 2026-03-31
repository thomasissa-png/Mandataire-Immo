"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

function detectPlatform(title: string) {
  const t = title.toLowerCase()
  if (t.includes("instagram") || t.includes("reel") || t.includes("story")) return { icon: "📸", name: "Instagram", color: "bg-secondary-50 text-secondary-700" }
  if (t.includes("linkedin")) return { icon: "💼", name: "LinkedIn", color: "bg-primary-50 text-primary-700" }
  if (t.includes("facebook")) return { icon: "📘", name: "Facebook", color: "bg-info-50 text-info-700" }
  if (t.includes("tiktok")) return { icon: "🎵", name: "TikTok", color: "bg-neutral-100 text-neutral-700" }
  return { icon: "📱", name: "Post", color: "bg-secondary-50 text-secondary-700" }
}

interface PostsFilteredProps {
  posts: Deliverable[]
}

export function PostsFiltered({ posts }: PostsFilteredProps) {
  return (
    <FilteredPageWrapper deliverables={posts} showArchiveToggle>
      {(filtered) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucun post pour cette période — change de mois ou vérifie tes filtres.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const platform = detectPlatform(post.title)
              return (
                <DeliverableCard
                  key={post.id}
                  id={post.id}
                  type={post.type}
                  typeLabel={platform.name}
                  typeColor={platform.color}
                  title={post.title}
                  status={post.status}
                  createdAt={post.created_at}
                />
              )
            })}
          </div>
        )
      }
    </FilteredPageWrapper>
  )
}
