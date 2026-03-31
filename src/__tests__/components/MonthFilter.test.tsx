/**
 * Tests pour le composant MonthFilter (dashboard)
 *
 * Pourquoi ces tests existent :
 * Le filtre par mois contrôle l'affichage des leads et statistiques du dashboard.
 * Si "Tous" ne reset pas le filtre, ou si le clic sur un mois envoie la mauvaise
 * valeur, le mandataire voit des données filtrées sans le savoir — décisions
 * business faussées (ex : "je n'ai eu aucun lead ce mois" alors que le filtre
 * est bloqué sur un ancien mois).
 *
 * Stratégie : on injecte des availableMonths fixes pour éviter la dépendance
 * à la date courante (sinon les tests cassent chaque mois).
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MonthFilter } from "@/components/dashboard/MonthFilter"

const FIXED_MONTHS = ["2026-03", "2026-02", "2026-01"]

describe("MonthFilter", () => {
  it("affiche le bouton 'Tous' et les boutons de mois fournis", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth={null}
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    expect(screen.getByText("Tous")).toBeInTheDocument()
    // Les mois sont affichés en format court : "Mars 2026", "Fév 2026", "Janv 2026"
    expect(screen.getByText("Mars 2026")).toBeInTheDocument()
    expect(screen.getByText("Fév 2026")).toBeInTheDocument()
    expect(screen.getByText("Janv 2026")).toBeInTheDocument()
  })

  it("marque 'Tous' comme actif (aria-pressed) quand selectedMonth est null", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth={null}
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    const tousButton = screen.getByRole("button", { name: /tous les mois/i })
    expect(tousButton).toHaveAttribute("aria-pressed", "true")
  })

  it("marque le mois sélectionné comme actif (aria-pressed)", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth="2026-02"
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    const fevButton = screen.getByRole("button", { name: /Février 2026/i })
    expect(fevButton).toHaveAttribute("aria-pressed", "true")

    const tousButton = screen.getByRole("button", { name: /tous les mois/i })
    expect(tousButton).toHaveAttribute("aria-pressed", "false")
  })

  it("appelle onChange avec la valeur du mois au clic sur un mois", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth={null}
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    fireEvent.click(screen.getByText("Mars 2026"))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith("2026-03")
  })

  it("appelle onChange(null) au clic sur 'Tous'", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth="2026-03"
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    fireEvent.click(screen.getByText("Tous"))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it("affiche tous les boutons avec un rôle button accessible", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth={null}
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    // "Tous" + 3 mois = 4 boutons
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(4)
  })

  it("a un nav avec aria-label pour l'accessibilité", () => {
    const onChange = vi.fn()
    render(
      <MonthFilter
        selectedMonth={null}
        onChange={onChange}
        availableMonths={FIXED_MONTHS}
      />
    )

    expect(screen.getByRole("navigation", { name: /filtrer par mois/i })).toBeInTheDocument()
  })
})
