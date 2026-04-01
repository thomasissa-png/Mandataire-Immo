/**
 * Tests pour le composant StrategieContent (dashboard/strategie)
 *
 * Pourquoi ces tests existent :
 * StrategieContent affiche la fondation marketing du mandataire (bio, positionnement,
 * landing page). Ces contenus sont permanents — contrairement aux posts mensuels.
 * Si une section manque sans message explicatif, ou si le brief graphique (usage
 * interne) s'affiche par erreur, le mandataire est confus. Le texte intro guide
 * l'usage (copier/regenrer) : s'il disparait, le mandataire ne sait pas quoi faire
 * de ces contenus.
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { StrategieContent } from "@/app/dashboard/strategie/StrategieContent"
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

const makeDel = (type: string, title: string): Deliverable => ({
  id: `del-${type}`,
  type: type as Deliverable["type"],
  title,
  month: "2026-03",
  status: "delivered",
  created_at: new Date().toISOString(),
})

const FULL_STRATEGIE: Deliverable[] = [
  makeDel("bio", "Bio Instagram optimisee"),
  makeDel("positionnement", "Positionnement mandataire Angers"),
  makeDel("landing_page", "Landing page pro"),
]

describe("StrategieContent", () => {
  it("affiche les 3 sections : Bio, Positionnement, Landing page", () => {
    render(<StrategieContent strategie={FULL_STRATEGIE} />)

    expect(screen.getByText("Ta bio")).toBeInTheDocument()
    expect(screen.getByText("Ton positionnement")).toBeInTheDocument()
    expect(screen.getByText("Ta landing page")).toBeInTheDocument()
  })

  it("affiche les titres des deliverables dans chaque section", () => {
    render(<StrategieContent strategie={FULL_STRATEGIE} />)

    expect(screen.getByText("Bio Instagram optimisee")).toBeInTheDocument()
    expect(screen.getByText("Positionnement mandataire Angers")).toBeInTheDocument()
    expect(screen.getByText("Landing page pro")).toBeInTheDocument()
  })

  it("n'affiche PAS le brief graphique meme s'il est dans les donnees", () => {
    const withBrief = [
      ...FULL_STRATEGIE,
      makeDel("brief_graphique", "Brief graphique visuel"),
    ]
    render(<StrategieContent strategie={withBrief} />)

    // Le brief graphique ne doit pas apparaitre comme section
    expect(screen.queryByText("Brief graphique visuel")).not.toBeInTheDocument()
    // Les 3 sections normales sont toujours la
    expect(screen.getByText("Ta bio")).toBeInTheDocument()
  })

  it("affiche l'etat vide pour une section sans contenu", () => {
    // Seulement la bio — pas de positionnement ni landing
    const partial = [makeDel("bio", "Bio seule")]
    render(<StrategieContent strategie={partial} />)

    // La bio est presente
    expect(screen.getByText("Bio seule")).toBeInTheDocument()

    // Les sections vides affichent le message d'etat vide
    const emptyMessages = screen.getAllByText(
      /pas encore généré/i
    )
    expect(emptyMessages).toHaveLength(2) // positionnement + landing_page
  })

  it("le texte intro mentionne 'Copier' et 'Regénérer'", () => {
    render(<StrategieContent strategie={FULL_STRATEGIE} />)

    expect(screen.getByText(/copier/i, { selector: "strong" })).toBeInTheDocument()
    expect(screen.getByText(/regénérer/i, { selector: "strong" })).toBeInTheDocument()
  })

  it("affiche le hint de chaque section pour guider le mandataire", () => {
    render(<StrategieContent strategie={FULL_STRATEGIE} />)

    expect(screen.getByText(/instagram, linkedin et facebook/i)).toBeInTheDocument()
    expect(screen.getByText(/pourquoi toi/i)).toBeInTheDocument()
    expect(screen.getByText(/page web personnalisée/i)).toBeInTheDocument()
  })

  it("affiche 3 etats vides quand aucun deliverable n'est fourni", () => {
    render(<StrategieContent strategie={[]} />)

    const emptyMessages = screen.getAllByText(/pas encore généré/i)
    expect(emptyMessages).toHaveLength(3)

    // Les 3 titres de section sont toujours affiches
    expect(screen.getByText("Ta bio")).toBeInTheDocument()
    expect(screen.getByText("Ton positionnement")).toBeInTheDocument()
    expect(screen.getByText("Ta landing page")).toBeInTheDocument()
  })

  it("affiche le lien vers le profil pour modifier ses infos", () => {
    render(<StrategieContent strategie={FULL_STRATEGIE} />)

    const profilLink = screen.getByRole("link", { name: /mon profil/i })
    expect(profilLink).toHaveAttribute("href", "/dashboard/profile")
  })
})
