/**
 * Tests pour les composants de la landing page mandataire /agent/[slug]
 *
 * Pourquoi ces tests existent :
 * - La page mandataire est la vitrine publique de Sophie. Un bug visible
 *   (téléphone masqué, prix mal formaté, photo cassée) = prospect perdu.
 * - HeroSection : l'accroche tronquée à 120 chars évite un pavé illisible.
 * - ContactSection : le fallback "Parlons de ton projet immobilier" garantit
 *   qu'un texte est toujours affiché même si ce_qui_te_differencie est vide.
 * - MesBiensSection : l'état vide avec CTA "Me contacter" évite une section morte.
 * - MaMethodeSection : les 3 étapes par défaut garantissent du contenu même sans
 *   personnalisation.
 * - TemoignagesSection : masquée si vide pour éviter un bloc "Ils m'ont fait confiance"
 *   sans témoignage (contre-productif).
 * - ReseauxSection : masquée si tous les champs vides pour éviter un bloc inutile.
 *
 * Ce qui est testé :
 * - Rendu conditionnel : photo vs initiales, téléphone visible/masqué
 * - Troncature de l'accroche à 120 chars
 * - Formatage des prix en EUR avec espace insécable
 * - États vides de chaque section
 * - Affichage des témoignages avec nom + contexte + date optionnelle
 */

import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import {
  HeroSection,
  ContactSection,
  MesBiensSection,
  MaMethodeSection,
  TemoignagesSection,
  ReseauxSection,
} from "@/components/agent/AgentPageSections"
import type { AgentProfile, AgentBienSummary } from "@/types/agent"

// ─── Fixtures ──────────────────────────────────────────────────────

function makeProfile(overrides: Partial<AgentProfile> = {}): AgentProfile {
  return {
    prenom: "Sophie",
    nom: "Martin",
    telephone: "06 12 34 56 78",
    photo_profil_key: "",
    reseau: "IAD",
    ville: "Angers",
    quartiers: "La Doutre, Centre-ville",
    departement: "49",
    specialites: "Résidentiel, Ancien",
    type_biens: "Appartements, Maisons",
    gamme_prix: "100K - 300K",
    bio_personnelle: "Je suis passionnée par l'immobilier depuis 10 ans.",
    bio_generee: null,
    ce_qui_te_differencie: "Je connais chaque rue d'Angers.",
    valeurs: "Transparence, Disponibilité",
    experience_annees: "10",
    nb_transactions_an: "15",
    linkedin_url: "",
    instagram: "",
    facebook: "",
    site_web: "",
    temoignages: [],
    methode_etapes: [],
    ...overrides,
  }
}

function makeBien(overrides: Partial<AgentBienSummary> = {}): AgentBienSummary {
  return {
    id: "bien_1",
    slug: "appartement-t3-angers",
    titre: "Appartement T3",
    titre_annonce: "Superbe T3 lumineux",
    city: "Angers",
    prix: 195000,
    type_bien: "Appartement",
    surface: 65,
    pieces: 3,
    photos_staging: [],
    photos_originales: [],
    ...overrides,
  }
}

// ─── HeroSection ──────────────────────────────────────────────────

describe("HeroSection", () => {
  it("affiche les initiales si photo_profil_key est vide", () => {
    render(<HeroSection profile={makeProfile({ photo_profil_key: "" })} />)
    expect(screen.getByText("SM")).toBeInTheDocument()
  })

  it("affiche la photo via /api/images/ si photo_profil_key renseigné", () => {
    render(<HeroSection profile={makeProfile({ photo_profil_key: "photo_sophie.jpg" })} />)
    const img = screen.getByAltText("Photo de Sophie Martin")
    expect(img).toHaveAttribute("src", "/api/images/photo_sophie.jpg")
  })

  it("tronque l'accroche à 120 chars max", () => {
    const longBio = "A".repeat(200) + ". Suite de la bio."
    render(<HeroSection profile={makeProfile({ bio_personnelle: longBio, bio_generee: null })} />)
    // L'accroche est la première phrase + "." mais tronquée à ~120 chars
    const accrocheElements = screen.queryAllByText(/A{10,}/)
    // Vérifier que le texte affiché ne dépasse pas 120 chars
    for (const el of accrocheElements) {
      expect(el.textContent!.length).toBeLessThanOrEqual(120)
    }
  })

  it("affiche l'accroche complète si elle fait moins de 120 chars", () => {
    const shortBio = "Je suis Sophie, mandataire IAD à Angers. Suite."
    render(<HeroSection profile={makeProfile({ bio_personnelle: shortBio, bio_generee: null })} />)
    expect(screen.getByText("Je suis Sophie, mandataire IAD à Angers.")).toBeInTheDocument()
  })

  it("affiche le bouton Appeler si téléphone renseigné", () => {
    render(<HeroSection profile={makeProfile({ telephone: "06 12 34 56 78" })} />)
    expect(screen.getByText("Appeler")).toBeInTheDocument()
  })

  it("masque le bouton Appeler si téléphone vide", () => {
    render(<HeroSection profile={makeProfile({ telephone: "" })} />)
    expect(screen.queryByText("Appeler")).not.toBeInTheDocument()
  })

  it("affiche le nom complet en H1", () => {
    render(<HeroSection profile={makeProfile()} />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sophie Martin")
  })

  it("affiche le réseau en badge", () => {
    render(<HeroSection profile={makeProfile({ reseau: "SAFTI" })} />)
    expect(screen.getByText("Mandataire SAFTI")).toBeInTheDocument()
  })

  it("affiche la ville et le département", () => {
    render(<HeroSection profile={makeProfile({ ville: "Angers", departement: "49" })} />)
    expect(screen.getByText("Angers (49)")).toBeInTheDocument()
  })

  it("utilise bio_generee en priorité sur bio_personnelle pour l'accroche", () => {
    render(
      <HeroSection
        profile={makeProfile({
          bio_generee: "Bio générée par IA. Deuxième phrase.",
          bio_personnelle: "Bio personnelle. Autre chose.",
        })}
      />
    )
    expect(screen.getByText("Bio générée par IA.")).toBeInTheDocument()
    expect(screen.queryByText("Bio personnelle.")).not.toBeInTheDocument()
  })
})

// ─── ContactSection ───────────────────────────────────────────────

describe("ContactSection", () => {
  it("affiche le bouton Appeler et le bouton Email côte à côte", () => {
    render(
      <ContactSection
        profile={makeProfile({ telephone: "06 12 34 56 78" })}
        email="sophie@immocrew.fr"
      />
    )
    expect(screen.getByText("Appeler")).toBeInTheDocument()
    expect(screen.getByText("Envoyer un email")).toBeInTheDocument()
  })

  it("masque le bouton Appeler si pas de téléphone", () => {
    render(
      <ContactSection
        profile={makeProfile({ telephone: "" })}
        email="sophie@immocrew.fr"
      />
    )
    expect(screen.queryByText("Appeler")).not.toBeInTheDocument()
    expect(screen.getByText("Envoyer un email")).toBeInTheDocument()
  })

  it("affiche le fallback si ce_qui_te_differencie est vide", () => {
    render(
      <ContactSection
        profile={makeProfile({ ce_qui_te_differencie: "" })}
        email="sophie@immocrew.fr"
      />
    )
    expect(screen.getByText("Parlons de ton projet immobilier")).toBeInTheDocument()
  })

  it("affiche ce_qui_te_differencie si renseigné", () => {
    render(
      <ContactSection
        profile={makeProfile({ ce_qui_te_differencie: "Je connais chaque rue d'Angers." })}
        email="sophie@immocrew.fr"
      />
    )
    expect(screen.getByText("Je connais chaque rue d'Angers.")).toBeInTheDocument()
    expect(screen.queryByText("Parlons de ton projet immobilier")).not.toBeInTheDocument()
  })

  it("le lien email contient le sujet avec le nom de l'agent", () => {
    render(
      <ContactSection
        profile={makeProfile()}
        email="sophie@immocrew.fr"
      />
    )
    const emailLink = screen.getByText("Envoyer un email").closest("a")
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:sophie%40immocrew.fr")
    )
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("subject=")
    )
  })
})

// ─── MesBiensSection ─────────────────────────────────────────────

describe("MesBiensSection", () => {
  it("affiche l'état vide avec message et CTA si aucun bien", () => {
    render(<MesBiensSection biens={[]} />)
    expect(
      screen.getByText(/Pas de bien en vente actuellement/)
    ).toBeInTheDocument()
    expect(screen.getByText("Me contacter →")).toBeInTheDocument()
  })

  it("affiche la grille de biens avec prix en euros", () => {
    const biens = [
      makeBien({ id: "b1", prix: 195000, titre_annonce: "T3 lumineux" }),
      makeBien({ id: "b2", prix: 350000, titre_annonce: "Maison 5 pièces" }),
    ]
    render(<MesBiensSection biens={biens} />)
    expect(screen.getByText("T3 lumineux")).toBeInTheDocument()
    expect(screen.getByText("Maison 5 pièces")).toBeInTheDocument()
    // Prix formaté avec espace et €
    expect(screen.getByText(/195[\s\u00a0]?000 €/)).toBeInTheDocument()
    expect(screen.getByText(/350[\s\u00a0]?000 €/)).toBeInTheDocument()
  })

  it("affiche le titre en fallback si titre_annonce est null", () => {
    render(<MesBiensSection biens={[makeBien({ titre_annonce: null, titre: "Appartement T3" })]} />)
    expect(screen.getByText("Appartement T3")).toBeInTheDocument()
  })

  it("affiche le type de bien, les pièces et la surface", () => {
    render(<MesBiensSection biens={[makeBien({ type_bien: "Appartement", pieces: 3, surface: 65 })]} />)
    // Le texte contient "Appartement · 3 pièces · 65 m²"
    expect(screen.getByText(/Appartement/)).toBeInTheDocument()
    expect(screen.getByText(/3 pièces/)).toBeInTheDocument()
    expect(screen.getByText(/65 m²/)).toBeInTheDocument()
  })

  it("utilise le slug du bien pour le lien si disponible", () => {
    render(<MesBiensSection biens={[makeBien({ slug: "mon-appart", id: "b1" })]} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/bien/mon-appart")
  })

  it("utilise l'id du bien pour le lien si slug est null", () => {
    render(<MesBiensSection biens={[makeBien({ slug: null, id: "bien_42" })]} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/bien/bien_42")
  })
})

// ─── MaMethodeSection ─────────────────────────────────────────────

describe("MaMethodeSection", () => {
  it("affiche les 3 étapes par défaut si methode_etapes est vide", () => {
    render(<MaMethodeSection profile={makeProfile({ methode_etapes: [] })} />)
    expect(screen.getByText("Estimation gratuite et personnalisée de ton bien")).toBeInTheDocument()
    expect(screen.getByText("Mise en valeur professionnelle (photos, annonce, diffusion)")).toBeInTheDocument()
    expect(screen.getByText(/Accompagnement de A à Z/)).toBeInTheDocument()
  })

  it("affiche les étapes personnalisées si methode_etapes renseigné", () => {
    const etapes = ["Visite du bien", "Estimation", "Publication"]
    render(<MaMethodeSection profile={makeProfile({ methode_etapes: etapes })} />)
    expect(screen.getByText("Visite du bien")).toBeInTheDocument()
    expect(screen.getByText("Estimation")).toBeInTheDocument()
    expect(screen.getByText("Publication")).toBeInTheDocument()
    // Les étapes par défaut ne doivent pas apparaître
    expect(screen.queryByText(/Estimation gratuite et personnalisée/)).not.toBeInTheDocument()
  })

  it("affiche le numéro de chaque étape (1, 2, 3)", () => {
    render(<MaMethodeSection profile={makeProfile({ methode_etapes: [] })} />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("limite les étapes personnalisées à 4 maximum", () => {
    const etapes = ["Étape 1", "Étape 2", "Étape 3", "Étape 4", "Étape 5"]
    render(<MaMethodeSection profile={makeProfile({ methode_etapes: etapes })} />)
    expect(screen.getByText("Étape 4")).toBeInTheDocument()
    expect(screen.queryByText("Étape 5")).not.toBeInTheDocument()
  })
})

// ─── TemoignagesSection ──────────────────────────────────────────

describe("TemoignagesSection", () => {
  it("est masquée si temoignages est vide", () => {
    const { container } = render(
      <TemoignagesSection profile={makeProfile({ temoignages: [] })} />
    )
    expect(container.innerHTML).toBe("")
  })

  it("affiche le nom et le texte du témoignage", () => {
    render(
      <TemoignagesSection
        profile={makeProfile({
          temoignages: [
            { nom: "Jean Dupont", texte: "Excellent accompagnement !", contexte: "Achat maison", date: "2024" },
          ],
        })}
      />
    )
    expect(screen.getByText("Jean Dupont")).toBeInTheDocument()
    expect(screen.getByText("Excellent accompagnement !")).toBeInTheDocument()
  })

  it("affiche le contexte et la date du témoignage", () => {
    render(
      <TemoignagesSection
        profile={makeProfile({
          temoignages: [
            { nom: "Marie", texte: "Super !", contexte: "Vente T2", date: "Mars 2024" },
          ],
        })}
      />
    )
    expect(screen.getByText(/Vente T2/)).toBeInTheDocument()
    expect(screen.getByText(/Mars 2024/)).toBeInTheDocument()
  })

  it("affiche la date sans séparateur si contexte est vide", () => {
    render(
      <TemoignagesSection
        profile={makeProfile({
          temoignages: [
            { nom: "Pierre", texte: "Très bien.", contexte: "", date: "2024" },
          ],
        })}
      />
    )
    expect(screen.getByText("2024")).toBeInTheDocument()
  })

  it("gère l'absence de date (optionnelle)", () => {
    render(
      <TemoignagesSection
        profile={makeProfile({
          temoignages: [
            { nom: "Claire", texte: "Parfait.", contexte: "Achat" },
          ],
        })}
      />
    )
    expect(screen.getByText("Claire")).toBeInTheDocument()
    expect(screen.getByText("Achat")).toBeInTheDocument()
  })
})

// ─── ReseauxSection ─────────────────────────────────────────────

describe("ReseauxSection", () => {
  it("est masquée si tous les champs réseaux sont vides", () => {
    const { container } = render(
      <ReseauxSection
        profile={makeProfile({
          linkedin_url: "",
          instagram: "",
          facebook: "",
          site_web: "",
        })}
      />
    )
    expect(container.innerHTML).toBe("")
  })

  it("affiche les labels texte sous chaque icône", () => {
    render(
      <ReseauxSection
        profile={makeProfile({
          linkedin_url: "https://linkedin.com/in/sophie",
          instagram: "https://instagram.com/sophie",
          facebook: "",
          site_web: "",
        })}
      />
    )
    expect(screen.getByText("LinkedIn")).toBeInTheDocument()
    expect(screen.getByText("Instagram")).toBeInTheDocument()
    expect(screen.queryByText("Facebook")).not.toBeInTheDocument()
    expect(screen.queryByText("Site web")).not.toBeInTheDocument()
  })

  it("affiche uniquement les réseaux renseignés", () => {
    render(
      <ReseauxSection
        profile={makeProfile({
          linkedin_url: "",
          instagram: "",
          facebook: "https://facebook.com/sophie",
          site_web: "https://sophie-immo.fr",
        })}
      />
    )
    expect(screen.queryByText("LinkedIn")).not.toBeInTheDocument()
    expect(screen.getByText("Facebook")).toBeInTheDocument()
    expect(screen.getByText("Site web")).toBeInTheDocument()
  })

  it("les liens s'ouvrent dans un nouvel onglet", () => {
    render(
      <ReseauxSection
        profile={makeProfile({
          linkedin_url: "https://linkedin.com/in/sophie",
          instagram: "",
          facebook: "",
          site_web: "",
        })}
      />
    )
    const link = screen.getByText("LinkedIn").closest("a")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})
