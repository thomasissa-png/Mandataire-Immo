/**
 * Tests pour le composant FAQAccordion (page FAQ dédiée)
 *
 * Pourquoi ces tests existent :
 * - Le composant FAQAccordion est distinct du FAQ landing (FAQ.tsx).
 *   Il est réutilisable avec des items dynamiques passés en props.
 * - Le premier item est ouvert par défaut (spec UX : réponse immédiate).
 * - Comportement "un seul item ouvert à la fois" : même spec que le FAQ landing.
 * - Accessibilité : aria-expanded, aria-controls, id uniques — conformité RGAA.
 *
 * Ce qui est testé :
 * - Rendu initial : premier item ouvert, les autres fermés
 * - Interaction : click ouvre un item et ferme les autres
 * - ARIA : aria-expanded synchronisé, aria-controls pointe vers le bon panel
 * - IDs uniques et correspondance heading/panel
 */

import { describe, it, expect } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
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

  it("le premier item est ouvert par défaut (aria-expanded=true)", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
  })

  it("les autres items sont fermés par défaut (aria-expanded=false)", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    expect(buttons[1]).toHaveAttribute("aria-expanded", "false")
    expect(buttons[2]).toHaveAttribute("aria-expanded", "false")
  })

  it("cliquer sur un item fermé l'ouvre et ferme l'item ouvert", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    // État initial : item 0 ouvert
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false")

    // Click sur item 1
    fireEvent.click(buttons[1])

    expect(buttons[1]).toHaveAttribute("aria-expanded", "true")
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false")
    expect(buttons[2]).toHaveAttribute("aria-expanded", "false")
  })

  it("cliquer sur l'item déjà ouvert le ferme (aucun item ouvert)", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    // Item 0 est ouvert par défaut
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")

    // Click sur item 0 pour le fermer
    fireEvent.click(buttons[0])

    // Tous fermés
    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-expanded", "false")
    }
  })

  it("un seul item ouvert à la fois — vérification sur 3 clicks successifs", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    // Click item 2
    fireEvent.click(buttons[2])
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true")
    expect(buttons.filter((b) => b.getAttribute("aria-expanded") === "true")).toHaveLength(1)

    // Click item 1
    fireEvent.click(buttons[1])
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true")
    expect(buttons.filter((b) => b.getAttribute("aria-expanded") === "true")).toHaveLength(1)

    // Click item 0
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
    expect(buttons.filter((b) => b.getAttribute("aria-expanded") === "true")).toHaveLength(1)
  })

  it("chaque bouton a un id unique au format faq-page-heading-{index}", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute("id", `faq-page-heading-${index}`)
    })
  })

  it("chaque bouton a un aria-controls pointant vers le panel correspondant", () => {
    render(<FAQAccordion items={MOCK_ITEMS} />)
    const buttons = screen.getAllByRole("button")

    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute("aria-controls", `faq-page-panel-${index}`)
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
    expect(container.querySelector("[role='region']")).toBeNull()
  })
})
