/**
 * Tests pour le composant AnnonceList (dashboard/annonces)
 *
 * Pourquoi ces tests existent :
 * AnnonceList est le composant central pour les annonces immobilieres du mandataire.
 * Le partage (share link), la copie portail (LeBonCoin, SeLoger, Bien'ici) et le
 * modal d'export sont des actions a forte valeur : si le bouton Partager ne genere
 * pas de lien, ou si le modal n'affiche pas le bon titre/description, le mandataire
 * ne peut pas publier ses annonces — impact direct sur son activite.
 *
 * Le badge "Nouveau" guide l'attention du mandataire vers les contenus frais.
 * S'il ne s'affiche pas (ou s'affiche au-dela de 48h), l'UX est degradee.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AnnonceList } from "@/components/dashboard/AnnonceList"

// Mock tracking — on ne veut pas d'appels reels
vi.mock("@/lib/tracking", () => ({
  track: vi.fn(),
}))

// Mock markdownRenderer — rendu simplifie pour les tests
vi.mock("@/lib/markdownRenderer", () => ({
  markdownToHtml: (md: string) => `<p>${md}</p>`,
  stripMarkdown: (md: string) => md.replace(/[#*_]/g, ""),
}))

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
}
Object.assign(navigator, { clipboard: mockClipboard })

// Helper : date recente (il y a 1 heure)
const RECENT_DATE = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
// Helper : date ancienne (il y a 3 jours)
const OLD_DATE = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

const BASE_ANNONCES = [
  {
    id: "ann-1",
    title: "Appartement T3 Centre-Ville Angers",
    status: "delivered" as const,
    createdAt: RECENT_DATE,
    shareToken: null,
  },
  {
    id: "ann-2",
    title: "Maison 5 pieces La Doutre",
    status: "delivered" as const,
    createdAt: OLD_DATE,
    shareToken: null,
  },
]

describe("AnnonceList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockClipboard.writeText.mockResolvedValue(undefined)
  })

  it("affiche chaque annonce avec son titre", () => {
    render(<AnnonceList annonces={BASE_ANNONCES} />)

    expect(screen.getByText("Appartement T3 Centre-Ville Angers")).toBeInTheDocument()
    expect(screen.getByText("Maison 5 pieces La Doutre")).toBeInTheDocument()
  })

  it("affiche le badge 'Nouveau' si l'annonce a moins de 48h", () => {
    render(<AnnonceList annonces={BASE_ANNONCES} />)

    // L'annonce recente (1h) doit avoir le badge
    const badges = screen.getAllByText("Nouveau")
    expect(badges).toHaveLength(1)
  })

  it("n'affiche pas le badge 'Nouveau' pour une annonce de plus de 48h", () => {
    const oldOnly = [
      { id: "ann-old", title: "Vieille annonce", status: "delivered" as const, createdAt: OLD_DATE, shareToken: null },
    ]
    render(<AnnonceList annonces={oldOnly} />)

    expect(screen.queryByText("Nouveau")).not.toBeInTheDocument()
  })

  it("affiche le badge 'En preparation' pour les annonces draft", () => {
    const drafts = [
      { id: "ann-draft", title: "Annonce brouillon", status: "draft" as const, createdAt: RECENT_DATE, shareToken: null },
    ]
    render(<AnnonceList annonces={drafts} />)

    expect(screen.getByText("En préparation")).toBeInTheDocument()
  })

  it("cree un share link au clic sur Partager et affiche le bouton Ouvrir", async () => {
    const shareUrl = "https://immocrew.fr/share/abc123"
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shareUrl }),
    })

    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    const partagerBtn = screen.getByRole("button", { name: /partager/i })
    fireEvent.click(partagerBtn)

    // Attend que le bouton "Ouvrir" apparaisse (signe que le share a reussi)
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /ouvrir/i })).toBeInTheDocument()
    })

    // Le lien pointe vers la bonne URL
    const ouvrirLink = screen.getByRole("link", { name: /ouvrir/i })
    expect(ouvrirLink).toHaveAttribute("href", shareUrl)

    // Le lien a ete copie dans le clipboard
    expect(mockClipboard.writeText).toHaveBeenCalledWith(shareUrl)
  })

  it("ouvre le modal portail avec titre et description separes au clic sur un portail", async () => {
    const contentText = "Belle description de l'appartement T3"
    // Mock le fetch du contenu
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: contentText }),
    })

    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    // Expand l'annonce d'abord (clic sur le titre)
    const titre = screen.getByText("Appartement T3 Centre-Ville Angers")
    fireEvent.click(titre)

    // Attend que le contenu charge et que les boutons portail apparaissent
    await waitFor(() => {
      expect(screen.getByText("LeBonCoin")).toBeInTheDocument()
    })

    // Clic sur LeBonCoin pour ouvrir le modal
    fireEvent.click(screen.getByText("LeBonCoin"))

    // Le modal affiche le titre du portail
    await waitFor(() => {
      expect(screen.getByText("Exporter pour LeBonCoin")).toBeInTheDocument()
    })

    // Le modal affiche le label "Titre de l'annonce"
    expect(screen.getByText("Titre de l'annonce")).toBeInTheDocument()

    // Le modal affiche le label "Description"
    expect(screen.getByText(/Description/)).toBeInTheDocument()
  })

  it("les boutons copier titre / description / tout fonctionnent dans le modal", async () => {
    const contentText = "Description complete du bien immobilier"
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: contentText }),
    })

    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    // Expand
    fireEvent.click(screen.getByText("Appartement T3 Centre-Ville Angers"))
    await waitFor(() => {
      expect(screen.getByText("LeBonCoin")).toBeInTheDocument()
    })

    // Ouvre modal LeBonCoin
    fireEvent.click(screen.getByText("LeBonCoin"))
    await waitFor(() => {
      expect(screen.getByText("Exporter pour LeBonCoin")).toBeInTheDocument()
    })

    // Bouton "Copier" pour le titre (premier bouton "Copier" dans le modal)
    const copyButtons = screen.getAllByText("Copier")
    // Il y a le bouton "Copier" du header + ceux du modal — prendre ceux du modal
    // Le modal a 2 boutons "Copier" (titre + description)
    const modalCopyBtns = copyButtons.filter(
      (btn) => btn.closest(".fixed") !== null
    )
    expect(modalCopyBtns.length).toBeGreaterThanOrEqual(2)

    // Copier le titre
    fireEvent.click(modalCopyBtns[0])
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith("Appartement T3 Centre-Ville Angers")
    })

    // Copier titre + description (bouton footer)
    const copyAllBtn = screen.getByText("Copier titre + description")
    fireEvent.click(copyAllBtn)
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining("Appartement T3 Centre-Ville Angers")
      )
    })
  })

  it("le bouton Ouvrir n'apparait pas avant le partage", () => {
    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    expect(screen.queryByRole("link", { name: /ouvrir/i })).not.toBeInTheDocument()
  })

  it("le bouton Copier (tout) copie le contenu complet dans le clipboard", async () => {
    const contentText = "Description magnifique du bien"
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: contentText }),
    })

    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    const copierBtn = screen.getByRole("button", { name: /copier le texte complet/i })
    fireEvent.click(copierBtn)

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(contentText)
    })
  })

  it("ne crash pas quand le fetch du contenu echoue", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<AnnonceList annonces={[BASE_ANNONCES[0]]} />)

    // Expand via le titre — ne doit pas planter
    fireEvent.click(screen.getByText("Appartement T3 Centre-Ville Angers"))

    await waitFor(() => {
      // Pas de contenu expanse, pas de crash
      expect(screen.queryByText("Exporter pour")).not.toBeInTheDocument()
    })
  })

  it("affiche le badge Archive pour les annonces archivees", () => {
    const archived = [
      { id: "ann-arch", title: "Annonce archivee", status: "archived" as const, createdAt: OLD_DATE, shareToken: null },
    ]
    render(<AnnonceList annonces={archived} />)

    expect(screen.getByText("Archivé")).toBeInTheDocument()
  })
})
