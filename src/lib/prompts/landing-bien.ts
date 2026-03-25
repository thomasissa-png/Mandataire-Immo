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
    dpe?: string // ex: "C", "D" — obligatoire legalement
  }
  // Optionnel : annonce deja generee par B1
  annonce_storytelling?: string
  // Contact du mandataire (vraies coordonnees, pas de placeholders)
  email_contact: string
  telephone_contact?: string
  // Donnees locales enrichies (depuis onboarding)
  donnees_locales?: {
    prix_m2_moyen?: number
    commerces?: string[]
    ecoles?: string[]
    transports?: string[]
    ambiance_quartier?: string
  }
  // Personnalisation visuelle optionnelle
  couleur_principale?: string // ex: "#1B2A4A" (defaut: bleu nuit)
  couleur_accent?: string // ex: "#F27A1A" (defaut: orange)
}

export function buildLandingBienPrompt(input: LandingBienInput): { system: string; user: string } {
  const system = `Tu es un developpeur web et copywriter specialise en immobilier. Tu crees des mini landing pages elegantes et efficaces pour presenter un bien immobilier a la vente.

## Ton role
Generer le code HTML complet d'une page standalone de presentation d'un bien immobilier. Cette page sera hebergee telle quelle — elle doit etre autonome (CSS inline, pas de dependances externes sauf Google Fonts).

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres d'experience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le professionnel est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "Mandataire" dans les textes de la page (ex: "Votre mandataire", pas "Votre agent immobilier").
- UTILISER LES VRAIES COORDONNEES du mandataire fournies ci-dessous. Ne JAMAIS ecrire "06 00 00 00 00" ou un email placeholder.
- Le domaine email IAD est "iadfrance.fr", PAS "iad.fr".

## Regles techniques
- HTML5 valide, responsive (mobile-first), accessible (aria-labels, contrastes WCAG AA)
- CSS inline dans une balise <style> — pas de fichier externe
- Police : Inter (Google Fonts) avec fallback system-ui
- Palette : ${input.couleur_principale || '#1B2A4A'} pour les titres, ${input.couleur_accent || '#F27A1A'} pour les CTA, blanc/gris clair pour le fond
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

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.commerces?.length || input.donnees_locales.ecoles?.length || input.donnees_locales.transports?.length || input.donnees_locales.prix_m2_moyen)

  const donneesLocalesSection = donneesLocalesDisponibles
    ? `
DONNEES LOCALES VERIFIEES pour la section quartier (utilise UNIQUEMENT ces references) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}EUR` : ''}
${input.donnees_locales!.commerces?.length ? `- Commerces : ${input.donnees_locales!.commerces.join(', ')}` : ''}
${input.donnees_locales!.ecoles?.length ? `- Ecoles : ${input.donnees_locales!.ecoles.join(', ')}` : ''}
${input.donnees_locales!.transports?.length ? `- Transports : ${input.donnees_locales!.transports.join(', ')}` : ''}
${input.donnees_locales!.ambiance_quartier ? `- Ambiance : ${input.donnees_locales!.ambiance_quartier}` : ''}`
    : `
DONNEES LOCALES : non disponibles. Pour la section quartier, rester general (nom de ville et quartier uniquement). NE PAS inventer de commodites, ecoles ou transports.`

  const user = `Cree une mini landing page pour ce bien immobilier :

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse : ${input.bien.adresse}
- Prix : ${input.bien.prix.toLocaleString("fr-FR")} EUR
- Surface : ${input.bien.surface} m2
- Pieces : ${input.bien.pieces}
- Points forts : ${input.bien.points_forts}
- DPE : ${input.bien.dpe || '[DPE : information en cours — sera communique avant publication]'}
${annonceSection}

## Le mandataire
- Nom : ${input.prenom} ${input.nom}
- Titre : Mandataire ${input.reseau} (PAS "Agent immobilier")
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement})
- Ton : ${input.ton}
${contactSection}

IMPORTANT : utiliser les VRAIES coordonnees ci-dessus dans les liens mailto: et tel:. Aucun placeholder.

## Contexte local
- Ville : ${input.zone_geo.ville}
- Quartiers de reference : ${input.zone_geo.quartiers.join(", ") || input.bien.adresse}
${donneesLocalesSection}

Genere le HTML complet. La page doit donner envie de contacter le mandataire pour une visite. Le titre professionnel affiche sur la page doit etre "Mandataire ${input.reseau}", jamais "Agent immobilier".`

  return { system, user }
}
