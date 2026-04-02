/**
 * Tests pour le composant FAQAccordion (page FAQ dédiée)
 *
 * Pourquoi ces tests existent :
 * - Le composant FAQAccordion est distinct du FAQ landing (FAQ.tsx).
 *   Il utilise <details>/<summary> HTML natifs pour le SEO (contenu visible sans JS).
 * - Le premier item est ouvert par défaut (spec UX : réponse immédiate).
 * - Accessibilité : aria-controls, id uniques, role="region" — conformité RGAA.
 *
 * Ce qui est testé :
 * - Rendu initial : tous les items affichés, premier ouvert
 * - IDs uniques et correspondance heading/panel
 * - Panels et leur aria-labelledby
 * - Contenu visible au premier rendu
 * - Gestion liste vide
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FAQAccordion } from "@/components/faq/FAQAccordion"

const MOCK_ITEMS = [
  {
    question: "Comment fonctionne ImmoCrew ?",
    answer: "ImmoCrew te livre chaque mois tes contenus marketing personnalisés.",
  },
  {
    question: "Combien ça coûte ?",
    answer: "À partir de 150 euros par mois, sans engagement.",
  },
  {
    question: "Est-ce que je peux annuler à tout moment ?",
    answer: "Oui, tu peux annuler ton abonnement quand tu veux.",
  },
]

describe("FAQAccordion", () => {
  it("affiche toutes les questions passées en props", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)

    for (const item of MOCK_ITEMS) {
      expect(screen.getByText(item.question)).toBeInTheDocument()
    }
  })

  it("le premier item est ouvert par défaut (attribut open)", () => {
    const { container } = render(<FAQAccordion items={MOCK_ITEMS} />)
    const detailsElements = container.querySelectorAll("details")

    expect(detailsElements[0]).toHaveAttribute("open")
  })

  it("les autres items sont fermés par défaut (pas d'attribut open)", () => {
    const { container } = render(<FAQAccordion items={MOCK_ITEMS} />)
    const detailsElements = container.querySelectorAll("details")

    expect(detailsElements[1]).not.toHaveAttribute("open")
    expect(detailsElements[2]).not.toHaveAttribute("open")
  })

  it("chaque summary a un id unique au format faq-page-heading-{index}", () => {
    const { container } = render(<FAQAccordion items={MOCK_ITEMS} />)
    const summaries = container.querySelectorAll("summary")

    summaries.forEach((summary, index) => {
      expect(summary).toHaveAttribute("id", `faq-page-heading-${index}`)
    })
  })

  it("chaque summary a un aria-controls pointant vers le panel correspondant", () => {
    const { container } = render(<FAQAccordion items={MOCK_ITEMS} />)
    const summaries = container.querySelectorAll("summary")

    summaries.forEach((summary, index) => {
      expect(summary).toHaveAttribute("aria-controls", `faq-page-panel-${index}`)
    })
  })

  it("chaque panel a un id correspondant et aria-labelledby vers le heading", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const panels = screen.getAllByRole("region")

    panels.forEach((panel, index) => {
      expect(panel).toHaveAttribute("id", `faq-page-panel-${index}`)
      expect(panel).toHaveAttribute("aria-labelledby", `faq-page-heading-${index}`)
    })
  })

  it("le contenu de la réponse du premier item est visible au rendu initial", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)

    expect(
      screen.getByText("ImmoCrew te livre chaque mois tes contenus marketing personnalisés.")
    ).toBeInTheDocument()
  })

  it("gère une liste vide sans erreur", () => {
    const { container } = render(<FAQAccordion items={[]} />)
    expect(container.querySelector("details")).toBeNull()
  })

  it("affiche le bon nombre de details elements", () => {
    const { container } = render(<FAQAccordion items={MOCK_ITEMS} />)
    const detailsElements = container.querySelectorAll("details")
    expect(detailsElements).toHaveLength(3)
  })

  it("chaque réponse est dans le DOM (SSR-friendly, visible par les crawlers)", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)

    for (const item of MOCK_ITEMS) {
      expect(screen.getByText(item.answer)).toBeInTheDocument()
    }
  })
})
