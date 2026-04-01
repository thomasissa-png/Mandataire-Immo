/**
 * Tests pour le composant ScriptsFiltered (dashboard/scripts)
 *
 * Pourquoi ces tests existent :
 * ScriptsFiltered affiche les scripts video du mandataire avec des metadonnees
 * cles (duree, accroche, brief tournage). Si le conseil global de tournage
 * disparait, le mandataire debutant ne sait pas comment filmer. Si la duree
 * ou l'accroche ne s'affiche pas, le mandataire perd le contexte du script.
 * L'etat vide doit etre explicite pour eviter la confusion "bug vs pas de contenu".
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ScriptsFiltered } from "@/app/dashboard/scripts/ScriptsFiltered"
import type { Deliverable } from "@/types/deliverable"

// Mock tracking
vi.mock("@/lib/tracking", () => ({
  track: vi.fn(),
}))

// Mock markdownRenderer
vi.mock("@/lib/markdownRenderer", () => ({
  markdownToHtml: (md: string) => `<p>${md}</p>`,
  stripMarkdown: (md: string) => md.replace(/[#*_]/g, ""),
}))

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
})

// Mock FilteredPageWrapper — rend directement les enfants sans filtre
// pour isoler le test de ScriptsFiltered
vi.mock("@/components/dashboard/FilteredPageWrapper", () => ({
  FilteredPageWrapper: ({
    deliverables,
    children,
  }: {
    deliverables: Deliverable[]
    showArchiveToggle?: boolean
    children: (filtered: Deliverable[], showArchived: boolean, onArchiveToggle: (id: string) => void) => React.ReactNode
  }) => <div>{children(deliverables, false, vi.fn())}</div>,
}))

const makeScript = (
  id: string,
  title: string,
  meta?: Record<string, unknown>
): Deliverable => ({
  id,
  type: "script_video",
  title,
  month: "2026-03",
  status: "delivered",
  created_at: new Date().toISOString(),
  metadata: meta,
})

const SCRIPTS: Deliverable[] = [
  makeScript("sc-1", "Script visite appartement T3", {
    duree_secondes: 45,
    hook: "Decouvrez ce T3 lumineux en plein centre",
    brief_tournage: "Filmer dans le salon face a la baie vitree, lumiere naturelle",
  }),
  makeScript("sc-2", "Script quartier La Doutre", {
    duree_secondes: 30,
    hook: "Le quartier le plus recherche d'Angers",
    brief_tournage: null,
  }),
]

describe("ScriptsFiltered", () => {
  it("affiche le conseil global de tournage", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    expect(screen.getByText("Comment filmer tes vidéos")).toBeInTheDocument()
    expect(screen.getByText(/mode portrait/i)).toBeInTheDocument()
    expect(screen.getByText(/lumière naturelle/i)).toBeInTheDocument()
  })

  it("affiche les titres des scripts", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    expect(screen.getByText("Script visite appartement T3")).toBeInTheDocument()
    expect(screen.getByText("Script quartier La Doutre")).toBeInTheDocument()
  })

  it("affiche la duree en secondes dans le label du type", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    // Le typeLabel contient "~45s" pour le premier script
    expect(screen.getByText(/Script vidéo · ~45s/)).toBeInTheDocument()
    expect(screen.getByText(/Script vidéo · ~30s/)).toBeInTheDocument()
  })

  it("affiche l'accroche (hook) sous chaque script", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    expect(screen.getByText("Decouvrez ce T3 lumineux en plein centre")).toBeInTheDocument()
    expect(screen.getByText("Le quartier le plus recherche d'Angers")).toBeInTheDocument()
  })

  it("affiche le brief tournage quand il est present", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    expect(
      screen.getByText("Filmer dans le salon face a la baie vitree, lumiere naturelle")
    ).toBeInTheDocument()
  })

  it("n'affiche pas de brief tournage quand metadata est null", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    // Le second script a brief_tournage: null — pas de "Ou filmer" pour lui
    // On verifie qu'il y a exactement 1 mention "Ou filmer"
    const briefLabels = screen.getAllByText(/où filmer/i)
    expect(briefLabels).toHaveLength(1)
  })

  it("affiche l'etat vide quand il n'y a pas de scripts", () => {
    render(<ScriptsFiltered scripts={[]} />)

    expect(
      screen.getByText(/aucun script pour le moment/i)
    ).toBeInTheDocument()

    // Le conseil de tournage ne s'affiche pas en etat vide
    expect(screen.queryByText("Comment filmer tes vidéos")).not.toBeInTheDocument()
  })

  it("affiche un script sans metadata sans crash", () => {
    const noMeta = [makeScript("sc-bare", "Script sans metadata")]
    render(<ScriptsFiltered scripts={noMeta} />)

    expect(screen.getByText("Script sans metadata")).toBeInTheDocument()
    // Pas de duree dans le label, juste "Script video"
    expect(screen.getByText("Script vidéo")).toBeInTheDocument()
    // Pas d'accroche ni de brief
    expect(screen.queryByText(/accroche/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/où filmer/i)).not.toBeInTheDocument()
  })

  it("affiche le conseil de publication sous chaque script", () => {
    render(<ScriptsFiltered scripts={SCRIPTS} />)

    const pubTips = screen.getAllByText(/vendredi 19h-21h/i)
    expect(pubTips).toHaveLength(2) // un par script
  })
})
