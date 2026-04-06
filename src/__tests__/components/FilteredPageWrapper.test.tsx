/**
 * Tests pour FilteredPageWrapper (dashboard)
 *
 * Pourquoi ces tests existent :
 * FilteredPageWrapper est le wrapper de filtrage partagé par toutes les pages
 * du dashboard (posts, articles, annonces). Il gère :
 * 1. Le filtre par mois (via MonthFilter)
 * 2. Le toggle archives (afficher/masquer les livrables archivés)
 * 3. L'archivage via API PATCH + toast feedback
 *
 * Si le filtre mois bug, Sophie voit les mauvais contenus.
 * Si l'archivage silently fail, elle croit avoir archivé mais le livrable revient.
 * Si le toast ne s'affiche pas, elle n'a aucun feedback sur son action.
 *
 * Stratégie : render avec une children function qui expose les livrables filtrés,
 * vérifier que le filtrage par mois et par statut archive fonctionne.
 * Mock fetch pour l'archivage, fake timers pour le toast 3s.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import type { Deliverable } from "@/types/deliverable"

// Fixtures
const DELIVERABLES: Deliverable[] = [
  {
    id: "d1",
    type: "post",
    title: "Post Instagram mars",
    month: "2026-03",
    status: "delivered",
    created_at: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "d2",
    type: "article_seo",
    title: "Article SEO février",
    month: "2026-02",
    status: "delivered",
    created_at: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "d3",
    type: "annonce",
    title: "Annonce archivée",
    month: "2026-03",
    status: "archived",
    created_at: "2026-03-01T10:00:00.000Z",
  },
]

/** Children helper qui affiche les titres des livrables filtrés */
function renderChildren(
  filtered: Deliverable[],
  _showArchived: boolean,
  onArchiveToggle: (id: string) => void
) {
  return (
    <div data-testid="children">
      {filtered.map((d) => (
        <div key={d.id} data-testid={`item-${d.id}`}>
          <span>{d.title}</span>
          <button onClick={() => onArchiveToggle(d.id)}>
            Archiver {d.id}
          </button>
        </div>
      ))}
    </div>
  )
}

describe("FilteredPageWrapper", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("affiche le MonthFilter quand il y a des deliverables avec des mois", () => {
    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    // MonthFilter est rendu : on devrait voir le bouton "Tous" et les mois
    expect(screen.getByText("Tous")).toBeInTheDocument()
  })

  it("filtre les livrables par mois sélectionné", () => {
    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    // Par défaut (pas de filtre mois, archives masquées) : d1 et d2 visibles, d3 archivé masqué
    expect(screen.getByText("Post Instagram mars")).toBeInTheDocument()
    expect(screen.getByText("Article SEO février")).toBeInTheDocument()

    // Cliquer sur "Mars 2026" pour filtrer
    fireEvent.click(screen.getByText("Mars 2026"))

    // Seul le post de mars est visible (l'archivé est masqué par défaut)
    expect(screen.getByText("Post Instagram mars")).toBeInTheDocument()
    expect(screen.queryByText("Article SEO février")).not.toBeInTheDocument()
  })

  it("affiche le toggle archives quand archivedCount > 0", () => {
    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    // Le bouton doit afficher le compteur d'archives
    expect(screen.getByText(/Archives \(1\)/)).toBeInTheDocument()
  })

  it("n'affiche PAS le toggle archives quand aucun livrable n'est archivé", () => {
    const noArchives = DELIVERABLES.filter((d) => d.status !== "archived")

    render(
      <FilteredPageWrapper deliverables={noArchives}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    expect(screen.queryByText(/Archives/)).not.toBeInTheDocument()
  })

  it("affiche les livrables archivés quand le toggle est activé", () => {
    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    // L'annonce archivée est masquée par défaut
    expect(screen.queryByText("Annonce archivée")).not.toBeInTheDocument()

    // Activer le toggle archives
    fireEvent.click(screen.getByText(/Archives \(1\)/))

    // Maintenant l'annonce archivée est visible
    expect(screen.getByText("Annonce archivée")).toBeInTheDocument()
  })

  it("appelle fetch PATCH et affiche un toast success après archivage", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "archived" }),
    })

    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    // Cliquer sur le bouton d'archivage du premier livrable
    fireEvent.click(screen.getByText("Archiver d1"))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/deliverables/d1/archive",
        { method: "PATCH" }
      )
    })

    // Toast success affiché
    await waitFor(() => {
      expect(screen.getByText("Archivé !")).toBeInTheDocument()
    })
  })

  it("affiche un toast erreur quand le fetch échoue", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    })

    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    fireEvent.click(screen.getByText("Archiver d1"))

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors de l'archivage/)
      ).toBeInTheDocument()
    })
  })

  it("le toast disparaît après 3 secondes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })

    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "archived" }),
    })

    render(
      <FilteredPageWrapper deliverables={DELIVERABLES}>
        {renderChildren}
      </FilteredPageWrapper>
    )

    fireEvent.click(screen.getByText("Archiver d1"))

    await waitFor(() => {
      expect(screen.getByText("Archivé !")).toBeInTheDocument()
    })

    // Avancer de 3 secondes
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText("Archivé !")).not.toBeInTheDocument()

    vi.useRealTimers()
  })
})
