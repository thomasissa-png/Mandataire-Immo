/**
 * Tests pour PostsFiltered (dashboard/posts)
 *
 * Pourquoi ces tests existent :
 * PostsFiltered est la page principale des posts sociaux de Sophie.
 * Elle affiche les posts par plateforme (Instagram, LinkedIn, Facebook, TikTok)
 * avec un filtre par plateforme et des infos visuelles (hashtags, brief visuel).
 *
 * Si le filtre plateforme ignore activePlatforms, Sophie voit des posts
 * pour Facebook alors qu'elle n'y est pas active — confusion et perte de confiance.
 * Si "Photo recommandée" vs "Visuel généré" est inversé, Sophie perd du temps
 * à chercher un visuel qui n'existe pas.
 *
 * Stratégie : on injecte des posts avec metadata variées (plateforme, hashtags,
 * visual_key) et on vérifie le rendu conditionnel et le filtre plateforme.
 * Mock de canAutoGenerate (pas de logique IA à tester ici) et fetch.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { PostsFiltered } from "@/app/dashboard/posts/PostsFiltered"
import type { Deliverable } from "@/types/deliverable"

// Mock des dépendances
vi.mock("@/lib/generate-post-visual", () => ({
  canAutoGenerate: vi.fn(() => false),
}))

vi.mock("@/lib/tracking", () => ({
  track: vi.fn(),
}))

vi.mock("@/lib/markdownRenderer", () => ({
  markdownToHtml: (md: string) => `<p>${md}</p>`,
  stripMarkdown: (md: string) => md,
}))

// Fixtures de posts
const POSTS: Deliverable[] = [
  {
    id: "p1",
    type: "post",
    title: "Post Instagram — 5 raisons de vivre à La Doutre",
    month: "2026-03",
    status: "delivered",
    created_at: "2026-03-15T10:00:00.000Z",
    metadata: {
      plateforme: "Instagram",
      hashtags: ["immobilier", "angers", "LaDoutre"],
      brief_visuel: "Photo de la rue piétonne de La Doutre au soleil couchant",
    },
  },
  {
    id: "p2",
    type: "post",
    title: "Post LinkedIn — Marché immobilier Angers T1 2026",
    month: "2026-03",
    status: "delivered",
    created_at: "2026-03-10T10:00:00.000Z",
    metadata: {
      plateforme: "LinkedIn",
      hashtags: ["immobilier", "angers", "marche"],
      brief_visuel: "Infographie statistiques marché",
      visual_key: "visuals/p2-infographie.png",
    },
  },
  {
    id: "p3",
    type: "post",
    title: "Post Facebook — Nouveau bien rue de Bressigny",
    month: "2026-03",
    status: "delivered",
    created_at: "2026-03-05T10:00:00.000Z",
    metadata: {
      plateforme: "Facebook",
      brief_visuel: "Photo facade maison",
    },
  },
]

describe("PostsFiltered", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: "Contenu" }),
    })
  })

  it("affiche les posts avec le bon label plateforme", () => {
    render(
      <PostsFiltered
        posts={POSTS}
        activePlatforms={["Instagram", "LinkedIn", "Facebook"]}
      />
    )

    // Les type labels sont rendus via DeliverableCard
    expect(screen.getByText("Instagram")).toBeInTheDocument()
    expect(screen.getByText("LinkedIn")).toBeInTheDocument()
    expect(screen.getByText("Facebook")).toBeInTheDocument()
  })

  it("affiche les boutons de filtre par plateforme quand > 1 plateforme", () => {
    render(
      <PostsFiltered
        posts={POSTS}
        activePlatforms={["Instagram", "LinkedIn", "Facebook"]}
      />
    )

    // Il y a deux boutons "Tous" (MonthFilter + filtre plateforme)
    // On vérifie que le filtre plateforme affiche "Tous (3)" avec le count
    expect(screen.getByText(/Tous \(3\)/)).toBeInTheDocument()
    // Les filtres contiennent le nom de plateforme avec le count entre parenthèses
    expect(screen.getByText(/Instagram \(1\)/)).toBeInTheDocument()
    expect(screen.getByText(/LinkedIn \(1\)/)).toBeInTheDocument()
  })

  it("n'affiche PAS le bouton filtre Facebook quand activePlatforms n'inclut pas Facebook", () => {
    render(
      <PostsFiltered
        posts={POSTS}
        activePlatforms={["Instagram", "LinkedIn"]}
      />
    )

    // Le bouton filtre Facebook (avec count) ne devrait pas apparaître
    // Note : le post p3 a "Facebook" dans son titre donc il est dans le DOM,
    // mais le bouton de filtre "Facebook (1)" ne doit pas s'afficher
    expect(screen.queryByText(/Facebook \(\d+\)/)).not.toBeInTheDocument()
  })

  it("filtre par plateforme quand on clique sur un filtre", () => {
    render(
      <PostsFiltered
        posts={POSTS}
        activePlatforms={["Instagram", "LinkedIn", "Facebook"]}
      />
    )

    // Cliquer sur filtre Instagram
    fireEvent.click(screen.getByText(/Instagram \(1\)/))

    // Seul le post Instagram est visible
    expect(screen.getByText(/5 raisons de vivre à La Doutre/)).toBeInTheDocument()
    expect(screen.queryByText(/Marché immobilier/)).not.toBeInTheDocument()
  })

  it("affiche 'Photo recommandée' quand pas de visual_key", () => {
    // Utiliser seulement le post p1 (pas de visual_key)
    render(
      <PostsFiltered
        posts={[POSTS[0]]}
        activePlatforms={["Instagram"]}
      />
    )

    expect(screen.getByText(/Photo recommandée/)).toBeInTheDocument()
  })

  it("affiche 'Visuel généré pour toi' quand visual_key existe", () => {
    // Utiliser seulement le post p2 (avec visual_key)
    render(
      <PostsFiltered
        posts={[POSTS[1]]}
        activePlatforms={["LinkedIn"]}
      />
    )

    expect(screen.getByText(/Visuel généré pour toi/)).toBeInTheDocument()
  })

  it("affiche les hashtags", () => {
    render(
      <PostsFiltered
        posts={[POSTS[0]]}
        activePlatforms={["Instagram"]}
      />
    )

    expect(screen.getByText("#immobilier")).toBeInTheDocument()
    expect(screen.getByText("#angers")).toBeInTheDocument()
    expect(screen.getByText("#LaDoutre")).toBeInTheDocument()
  })
})
