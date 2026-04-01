/**
 * Tests pour DeliverableCard (dashboard)
 *
 * Pourquoi ces tests existent :
 * DeliverableCard est le composant central du dashboard Sophie.
 * Chaque livrable (post, article SEO, annonce) est affiché via cette carte.
 * Un badge "Nouveau" manquant = Sophie ne voit pas ses contenus frais.
 * Un bouton "Copier" cassé = Sophie ne peut pas utiliser son contenu.
 * Un badge de statut incorrect = confusion sur l'état du livrable.
 *
 * Stratégie : on teste le rendu conditionnel (badges, boutons) selon
 * les props status/createdAt, et le comportement du bouton Copier.
 * On mocke fetch (chargement contenu), track (analytics), et
 * markdownRenderer (pas de logique Markdown à tester ici).
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

// Mock des dépendances
vi.mock("@/lib/tracking", () => ({
  track: vi.fn(),
}))

vi.mock("@/lib/markdownRenderer", () => ({
  markdownToHtml: (md: string) => `<p>${md}</p>`,
  stripMarkdown: (md: string) => md,
}))

// Props de base réutilisées dans chaque test
const BASE_PROPS = {
  id: "del-001",
  type: "post",
  typeLabel: "Instagram",
  typeColor: "bg-secondary-50 text-secondary-700",
  title: "5 astuces pour vendre vite à Angers",
}

describe("DeliverableCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Mock fetch par défaut : retourne un contenu
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: "Contenu du post" }),
    })
  })

  it("affiche le titre et le type label", () => {
    render(<DeliverableCard {...BASE_PROPS} />)

    expect(screen.getByText("5 astuces pour vendre vite à Angers")).toBeInTheDocument()
    expect(screen.getByText("Instagram")).toBeInTheDocument()
  })

  it("affiche le badge 'Nouveau' si le livrable a moins de 48h et status=delivered", () => {
    const recentDate = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1h ago

    render(
      <DeliverableCard
        {...BASE_PROPS}
        status="delivered"
        createdAt={recentDate}
      />
    )

    expect(screen.getByText("Nouveau")).toBeInTheDocument()
  })

  it("n'affiche PAS le badge 'Nouveau' si le livrable a plus de 48h", () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() // 72h ago

    render(
      <DeliverableCard
        {...BASE_PROPS}
        status="delivered"
        createdAt={oldDate}
      />
    )

    expect(screen.queryByText("Nouveau")).not.toBeInTheDocument()
  })

  it("affiche le badge 'En validation' quand status=pending_review", () => {
    render(
      <DeliverableCard
        {...BASE_PROPS}
        status="pending_review"
        createdAt={new Date().toISOString()}
      />
    )

    expect(screen.getByText("En validation")).toBeInTheDocument()
  })

  it("affiche le badge 'Archivé' quand status=archived", () => {
    render(
      <DeliverableCard
        {...BASE_PROPS}
        status="archived"
        createdAt={new Date().toISOString()}
      />
    )

    expect(screen.getByText("Archivé")).toBeInTheDocument()
  })

  it("affiche le bouton Copier pour status=delivered", () => {
    render(<DeliverableCard {...BASE_PROPS} status="delivered" />)

    expect(
      screen.getByRole("button", { name: /copier le texte/i })
    ).toBeInTheDocument()
  })

  it("n'affiche PAS le bouton Copier pour status=draft", () => {
    render(<DeliverableCard {...BASE_PROPS} status="draft" />)

    expect(
      screen.queryByRole("button", { name: /copier le texte/i })
    ).not.toBeInTheDocument()
  })

  it("affiche la date au format français", () => {
    // 15 mars 2026
    render(
      <DeliverableCard
        {...BASE_PROPS}
        createdAt="2026-03-15T10:00:00.000Z"
      />
    )

    // Le composant affiche "15 mars" en format court
    expect(screen.getByText("15 mars")).toBeInTheDocument()
  })

  it("affiche 'Regénérer' quand le contenu est expanded et status=delivered", async () => {
    render(
      <DeliverableCard
        {...BASE_PROPS}
        status="delivered"
        content="Contenu initial"
      />
    )

    // Expand en cliquant sur "Voir le contenu"
    fireEvent.click(screen.getByText("Voir le contenu"))

    await waitFor(() => {
      expect(screen.getByText(/Regénérer/)).toBeInTheDocument()
    })
  })

  it("affiche le message 'En cours de rédaction' pour un draft", () => {
    render(<DeliverableCard {...BASE_PROPS} status="draft" />)

    expect(
      screen.getByText(/en cours de rédaction/i)
    ).toBeInTheDocument()
  })
})
