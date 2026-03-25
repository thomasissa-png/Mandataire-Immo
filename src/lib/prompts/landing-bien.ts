/**
 * Prompt — Mini landing page pour un bien immobilier
 * Utilise pour : B3 (Boost Mandat)
 * Output : JSON avec HTML complet auto-hebergeable
 */

export interface LandingBienInput {
  prenom: string
  nom: string
  reseau: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  reseaux_sociaux: { instagram?: string; facebook?: string; linkedin?: string; site_web?: string }
  // Bien specifique
  bien: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }
  // Optionnel : annonce deja generee par B1
  annonce_storytelling?: string
  // Contact du mandataire
  email_contact: string
  telephone_contact?: string
}

export function buildLandingBienPrompt(input: LandingBienInput): { system: string; user: string } {
  const system = `Tu es un developpeur web et copywriter specialise en immobilier. Tu crees des mini landing pages elegantes et efficaces pour presenter un bien immobilier a la vente.

## Ton role
Generer le code HTML complet d'une page standalone de presentation d'un bien immobilier. Cette page sera hebergee telle quelle — elle doit etre autonome (CSS inline, pas de dependances externes sauf Google Fonts).

## Regles absolues
- HTML5 valide, responsive (mobile-first), accessible (aria-labels, contrastes WCAG AA)
- CSS inline dans une balise <style> — pas de fichier externe
- Police : Inter (Google Fonts) avec fallback system-ui
- Palette : bleu nuit (#1B2A4A) pour les titres, orange (#F27A1A) pour les CTA, blanc/gris clair pour le fond
- Section hero avec le titre du bien et l'accroche
- Section description avec le texte storytelling (fourni ou a generer)
- Section caracteristiques (surface, pieces, prix, points forts) en grille
- Section quartier (description locale, commodites, transports)
- Section contact avec les coordonnees du mandataire et un lien mailto + tel
- Footer avec mentions legales minimales (nom, reseau, "Non contractuel")
- Pas de JavaScript — page purement statique
- Le prix doit etre affiche en format francais (espaces, EUR)
- Ne pas utiliser de placeholder d'images — utiliser des blocs colores avec des icones CSS

## Format de sortie
Reponds UNIQUEMENT avec un objet JSON valide :
{
  "titre_page": "Titre pour la balise <title>",
  "meta_description": "Description pour le meta tag",
  "html": "<!DOCTYPE html>\\n<html>... code HTML complet ...</html>"
}`

  const annonceSection = input.annonce_storytelling
    ? `\nAnnonce storytelling deja generee (a integrer dans la section description) :\n${input.annonce_storytelling}`
    : "\nPas d'annonce pre-generee — redige une description attractive du bien en te basant sur ses caracteristiques."

  const contactSection = [
    `Email : ${input.email_contact}`,
    input.telephone_contact ? `Telephone : ${input.telephone_contact}` : null,
    input.reseaux_sociaux.instagram ? `Instagram : ${input.reseaux_sociaux.instagram}` : null,
    input.reseaux_sociaux.facebook ? `Facebook : ${input.reseaux_sociaux.facebook}` : null,
  ].filter(Boolean).join("\n")

  const user = `Cree une mini landing page pour ce bien immobilier :

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse : ${input.bien.adresse}
- Prix : ${input.bien.prix.toLocaleString("fr-FR")} EUR
- Surface : ${input.bien.surface} m2
- Pieces : ${input.bien.pieces}
- Points forts : ${input.bien.points_forts}
${annonceSection}

## Le mandataire
- Nom : ${input.prenom} ${input.nom}
- Reseau : ${input.reseau}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement})
- Ton : ${input.ton}
${contactSection}

## Contexte local
- Ville : ${input.zone_geo.ville}
- Quartiers de reference : ${input.zone_geo.quartiers.join(", ") || input.bien.adresse}

Genere le HTML complet. La page doit donner envie de contacter le mandataire pour une visite.`

  return { system, user }
}
