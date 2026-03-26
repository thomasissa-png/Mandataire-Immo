/**
 * Tests pour le composant FAQ (accordion)
 *
 * Pourquoi ces tests existent :
 * - La FAQ repond aux 10 objections de Sophie et Thomas (cf. personas.md).
 *   Si une question disparait ou si l'accordion est casse, on perd des conversions.
 * - L'accessibilite (aria-expanded) est obligatoire pour la conformite RGAA.
 * - Le comportement "un seul item ouvert a la fois" est une spec UX (cf. wireframes.md).
 */

import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FAQ } from "@/components/landing/FAQ"

describe("FAQ", () => {
  it("renders the section heading", () => {
    render(<FAQ />)
    expect(
      screen.getByText(/Tu as des questions/i)
    ).toBeInTheDocument()
  })

  it("renders all 10 FAQ questions", () => {
    render(<FAQ />)
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(10)
  })

  it("renders the first question text", () => {
    render(<FAQ />)
    expect(
      screen.getByText("C'est quoi exactement ImmoCrew ?")
    ).toBeInTheDocument()
  })

  it("renders the IA transparency question (AI Act compliance)", () => {
    render(<FAQ />)
    expect(
      screen.getByText("Le contenu est fait par une IA ?")
    ).toBeInTheDocument()
  })

  it("renders the pricing question", () => {
    render(<FAQ />)
    expect(
      screen.getByText(/150.*mois.*rentable/i)
    ).toBeInTheDocument()
  })

  it("all items are closed by default (aria-expanded=false)", () => {
    render(<FAQ />)
    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("aria-expanded", "false")
    })
  })

  it("opens an item when clicked (aria-expanded=true)", () => {
    render(<FAQ />)
    const firstButton = screen.getAllByRole("button")[0]
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute("aria-expanded", "true")
  })

  it("closes an open item when clicked again", () => {
    render(<FAQ />)
    const firstButton = screen.getAllByRole("button")[0]
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute("aria-expanded", "false")
  })

  it("closes the previously open item when another is clicked (single open)", () => {
    render(<FAQ />)
    const buttons = screen.getAllByRole("button")
    const firstButton = buttons[0]
    const secondButton = buttons[1]

    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute("aria-expanded", "true")

    fireEvent.click(secondButton)
    expect(secondButton).toHaveAttribute("aria-expanded", "true")
    expect(firstButton).toHaveAttribute("aria-expanded", "false")
  })

  it("shows answer content when item is opened", () => {
    render(<FAQ />)
    const firstButton = screen.getAllByRole("button")[0]
    fireEvent.click(firstButton)

    // The answer text for the first question should be visible
    expect(
      screen.getByText(/\u00e9quipe marketing externalis\u00e9e/i)
    ).toBeInTheDocument()
  })
})
