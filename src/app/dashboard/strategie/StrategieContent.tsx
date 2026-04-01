"use client"

import { useState, useCallback } from "react"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

const SECTIONS: {
  type: string
  title: string
  icon: string
  hint: string
  color: string
}[] = [
  {
    type: "bio",
    title: "Ta bio",
    icon: "📋",
    hint: "Copie-la sur Instagram, LinkedIn et Facebook. Adapte la longueur selon la plateforme.",
    color: "border-l-secondary-300",
  },
  {
    type: "positionnement",
    title: "Ton positionnement",
    icon: "🎯",
    hint: "Ton argumentaire unique — à utiliser quand un prospect te demande « pourquoi toi ? »",
    color: "border-l-primary-300",
  },
  {
    type: "landing_page",
    title: "Ta landing page",
    icon: "🌐",
    hint: "Ta page web personnalisée — partage-la dans tes emails et réseaux.",
    color: "border-l-success-400",
  },
]

const TYPE_LABELS: Record<string, string> = {
  bio: "Bio",
  positionnement: "Positionnement",
  landing_page: "Landing page",
}

const TYPE_COLORS: Record<string, string> = {
  bio: "bg-secondary-50 text-secondary-600",
  positionnement: "bg-primary-50 text-primary-700",
  landing_page: "bg-success-50 text-success-700",
}

interface StrategieContentProps {
  strategie: Deliverable[]
}

export function StrategieContent({ strategie }: StrategieContentProps) {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-lg bg-info-50 border border-info-200 p-4">
        <p className="text-body-sm text-info-800">
          Ces contenus sont ta <strong>fondation marketing</strong> — ils ne changent pas chaque mois.
          Clique sur un contenu pour le voir, le <strong>copier</strong>, ou demander une <strong>réécriture</strong> si ça ne te convient pas.
        </p>
      </div>

      {/* Sections fixes par type */}
      {SECTIONS.map((section) => {
        const item = strategie.find((d) => d.type === section.type)

        return (
          <div key={section.type}>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" aria-hidden="true">{section.icon}</span>
              <h2 className="font-display text-h4 text-primary">{section.title}</h2>
            </div>
            <p className="text-caption text-neutral-400 mb-3">{section.hint}</p>

            {item ? (
              <DeliverableCard
                id={item.id}
                type={item.type}
                typeLabel={TYPE_LABELS[item.type] || item.type}
                typeColor={TYPE_COLORS[item.type] || "bg-neutral-100 text-neutral-600"}
                title={item.title}
                status={item.status}
                createdAt={item.created_at}
              />
            ) : (
              <div className="rounded-lg bg-neutral-50 border border-border border-dashed p-6 text-center">
                <p className="text-body-sm text-neutral-400">
                  Pas encore généré — ce contenu arrivera avec ton prochain pack.
                </p>
              </div>
            )}
          </div>
        )
      })}

      {/* Lien profil */}
      <div className="rounded-lg bg-card border border-border p-4 flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">👤</span>
        <div className="flex-1">
          <p className="text-body-sm font-semibold text-primary">Envie de modifier tes infos ?</p>
          <p className="text-caption text-neutral-500">
            Les changements de ton profil seront pris en compte lors de la prochaine génération.
          </p>
        </div>
        <a
          href="/dashboard/profile"
          className="flex-shrink-0 px-4 py-2 rounded-full bg-secondary text-white font-display font-bold text-caption hover:bg-secondary-600 transition-all shadow-sm"
        >
          Mon profil →
        </a>
      </div>
    </div>
  )
}
