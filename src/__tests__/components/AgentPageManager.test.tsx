/**
 * Tests pour les composants du dashboard page mandataire
 *
 * Pourquoi ces tests existent :
 * - ActivatePageButton : si pack = null, Sophie voit "Choisis un pack" au lieu
 *   du bouton d'activation. Sans ce guard, elle pourrait tenter d'activer sans pack
 *   et recevoir une erreur 400 incompréhensible.
 * - IndexationToggle : l'explication contextuelle activé/désactivé aide Sophie
 *   à comprendre l'impact du toggle sans documentation externe.
 *
 * Ce qui est testé :
 * - ActivatePageButton : affichage conditionnel selon pack null/renseigné
 * - ActivatePageButton : états loading, success, error
 * - IndexationToggle : texte d'explication dynamique
 * - IndexationToggle : état aria-checked synchronisé
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ActivatePageButton, IndexationToggle } from "@/components/dashboard/AgentPageManager"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}))

// Mock fetch global
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// ─── ActivatePageButton ──────────────────────────────────────────

describe("ActivatePageButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("affiche 'Choisis un pack' si pack est null", () => {
    render(<ActivatePageButton pack={null} />)
    expect(screen.getByText(/Choisis un pack/)).toBeInTheDocument()
    expect(screen.queryByText("Activer ma page →")).not.toBeInTheDocument()
  })

  it("affiche un lien vers les offres si pack est null", () => {
    render(<ActivatePageButton pack={null} />)
    const link = screen.getByText("Voir les offres →")
    expect(link.closest("a")).toHaveAttribute("href", "/#pricing")
  })

  it("affiche le bouton d'activation si pack est renseigné", () => {
    render(<ActivatePageButton pack="lancement" />)
    expect(screen.getByText("Activer ma page →")).toBeInTheDocument()
    expect(screen.queryByText(/Choisis un pack/)).not.toBeInTheDocument()
  })

  it("affiche l'état loading pendant l'activation", async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // never resolves

    render(<ActivatePageButton pack="lancement" />)
    fireEvent.click(screen.getByText("Activer ma page →"))

    await waitFor(() => {
      expect(screen.getByText("Activation en cours…")).toBeInTheDocument()
    })
  })

  it("affiche l'état success après activation réussie", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ slug: "sophie-martin" }),
    })

    render(<ActivatePageButton pack="mensuel" />)
    fireEvent.click(screen.getByText("Activer ma page →"))

    await waitFor(() => {
      expect(screen.getByText("Ta page est active !")).toBeInTheDocument()
    })
  })

  it("affiche le message d'erreur si l'API retourne une erreur", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Prénom et nom requis dans ton profil pour activer ta page." }),
    })

    render(<ActivatePageButton pack="lancement" />)
    fireEvent.click(screen.getByText("Activer ma page →"))

    await waitFor(() => {
      expect(screen.getByText(/Prénom et nom requis/)).toBeInTheDocument()
    })
  })

  it("affiche une erreur réseau si fetch échoue", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    render(<ActivatePageButton pack="lancement" />)
    fireEvent.click(screen.getByText("Activer ma page →"))

    await waitFor(() => {
      expect(screen.getByText(/Erreur de connexion/)).toBeInTheDocument()
    })
  })

  it("le bouton est désactivé pendant le loading", async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    render(<ActivatePageButton pack="lancement" />)
    const button = screen.getByText("Activer ma page →")
    fireEvent.click(button)

    await waitFor(() => {
      const loadingButton = screen.getByText("Activation en cours…").closest("button")
      expect(loadingButton).toBeDisabled()
    })
  })

  it("envoie le pack dans le body de la requête", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ slug: "sophie-martin" }),
    })

    render(<ActivatePageButton pack="mensuel" />)
    fireEvent.click(screen.getByText("Activer ma page →"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/agent/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: "mensuel" }),
      })
    })
  })
})

// ─── IndexationToggle ────────────────────────────────────────────

describe("IndexationToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("affiche l'explication 'Activé' quand initialValue est true", () => {
    render(<IndexationToggle slug="sophie-martin" initialValue={true} />)
    expect(screen.getByText(/Activé/)).toBeInTheDocument()
    expect(screen.getByText(/prospects peuvent te trouver/)).toBeInTheDocument()
  })

  it("affiche l'explication 'Désactivé' quand initialValue est false", () => {
    render(<IndexationToggle slug="sophie-martin" initialValue={false} />)
    expect(screen.getByText(/Désactivé/)).toBeInTheDocument()
    expect(screen.getByText(/accessible uniquement via le lien direct/)).toBeInTheDocument()
  })

  it("le switch a le bon aria-checked initial", () => {
    render(<IndexationToggle slug="sophie-martin" initialValue={true} />)
    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("aria-checked", "true")
  })

  it("le switch a aria-label 'Visible sur Google'", () => {
    render(<IndexationToggle slug="sophie-martin" initialValue={false} />)
    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveAttribute("aria-label", "Visible sur Google")
  })

  it("toggle change l'état visuellement au clic", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })

    render(<IndexationToggle slug="sophie-martin" initialValue={false} />)
    const toggle = screen.getByRole("switch")

    expect(toggle).toHaveAttribute("aria-checked", "false")

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(toggle).toHaveAttribute("aria-checked", "true")
    })
  })

  it("envoie un PATCH avec indexation: true quand on active", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })

    render(<IndexationToggle slug="sophie-martin" initialValue={false} />)
    fireEvent.click(screen.getByRole("switch"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/agent/sophie-martin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indexation: true }),
      })
    })
  })

  it("revient à l'état précédent si le PATCH échoue", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    render(<IndexationToggle slug="sophie-martin" initialValue={true} />)
    const toggle = screen.getByRole("switch")

    fireEvent.click(toggle)

    await waitFor(() => {
      // Revient à true après échec
      expect(toggle).toHaveAttribute("aria-checked", "true")
    })
  })

  it("affiche un message d'erreur si le PATCH échoue", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    render(<IndexationToggle slug="sophie-martin" initialValue={true} />)
    fireEvent.click(screen.getByRole("switch"))

    await waitFor(() => {
      expect(screen.getByText(/sauvegarde a échoué/)).toBeInTheDocument()
    })
  })

  it("affiche un message d'erreur réseau si fetch échoue", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    render(<IndexationToggle slug="sophie-martin" initialValue={false} />)
    fireEvent.click(screen.getByRole("switch"))

    await waitFor(() => {
      expect(screen.getByText(/Erreur de connexion/)).toBeInTheDocument()
    })
  })
})
