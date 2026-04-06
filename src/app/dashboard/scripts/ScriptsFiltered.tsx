"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

const CONFORT_TIPS: Record<string, string> = {
  debutant: "Tes scripts sont adaptés pour les débutants : diaporamas (photos + texte animé) ou face caméra simple — à toi de choisir ce qui te convient le mieux.",
  a_laise: "Face caméra + plans du bien/quartier. 30-60 secondes, ton naturel. Tu peux aussi mixer avec des diaporamas.",
  expert: "Tu peux te lancer sur du storytelling complet : POV, time-lapse, avant/après. Les scripts sont détaillés scène par scène.",
}

interface ScriptsFilteredProps {
  scripts: Deliverable[]
  confortCamera?: string
}

export function ScriptsFiltered({ scripts, confortCamera = "debutant" }: ScriptsFilteredProps) {
  const confortTip = CONFORT_TIPS[confortCamera] || CONFORT_TIPS.debutant
  return (
    <FilteredPageWrapper deliverables={scripts} showArchiveToggle>
      {(filtered) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucun script pour le moment — tes premiers contenus arrivent bientôt.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Conseil global */}
            <div className="rounded-lg bg-warning-50 border border-warning-200 p-4 mb-2">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0" aria-hidden="true">🎬</span>
                <div>
                  <p className="text-body-sm font-semibold text-warning-800">Comment filmer tes vidéos</p>
                  <p className="text-body-sm text-warning-700 mt-1 mb-2 font-medium">
                    {confortTip}
                  </p>
                  <ul className="text-caption text-warning-700 space-y-0.5">
                    <li>• Smartphone en <strong>mode portrait</strong> (vertical 9:16)</li>
                    <li>• Lumière naturelle face à toi (pas de contre-jour)</li>
                    <li>• Pas de montage nécessaire — filme et publie directement</li>
                    <li>• Publie sur Instagram Reels le <strong>vendredi entre 19h et 21h</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {filtered.map((d) => {
              const meta = d.metadata as Record<string, unknown> | undefined
              const briefTournage = typeof meta?.brief_tournage === "string" ? meta.brief_tournage : null
              const duree = typeof meta?.duree_secondes === "number" ? meta.duree_secondes : null
              const hook = typeof meta?.hook === "string" ? meta.hook : null

              return (
                <div key={d.id}>
                  <DeliverableCard
                    id={d.id}
                    type={d.type}
                    typeLabel={duree ? `Script vidéo · ~${duree}s` : "Script vidéo"}
                    typeColor="bg-warning-50 text-warning-800"
                    title={d.title}
                    status={d.status}
                    createdAt={d.created_at}
                  />
                  {/* Brief tournage sous chaque script */}
                  <div className="mt-1.5 ml-1 space-y-1">
                    {hook && (
                      <p className="text-caption text-neutral-500">
                        <span className="font-semibold text-neutral-600">Accroche :</span> {hook}
                      </p>
                    )}
                    {briefTournage && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-caption" aria-hidden="true">📍</span>
                        <p className="text-caption text-neutral-500">
                          <span className="font-semibold text-neutral-600">Où filmer :</span> {briefTournage}
                        </p>
                      </div>
                    )}
                    <p className="text-caption text-neutral-400">
                      Publie sur Instagram Reels · Vendredi 19h-21h
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </FilteredPageWrapper>
  )
}
