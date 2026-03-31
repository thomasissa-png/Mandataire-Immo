/**
 * Prompt — Home staging virtuel par IA (generation d'images DE REFERENCE)
 * Utilise pour : Versiroom integration — visuels de home staging pour pages de biens
 * Modele cible : gpt-image-1 (OpenAI) — generation d'image a partir de texte
 * Fallback : Replicate SDXL (si OpenAI indisponible ou trop cher)
 * Cout estime : ~0.04-0.08 USD/image, max 5 images/bien
 *
 * IMPORTANT — Ce prompt genere des IMAGES DE REFERENCE (studio shots) a partir
 * d'une description textuelle de la piece. Ce n'est PAS une retouche de photo
 * existante (inpainting). Pour du home staging sur une VRAIE photo du bien,
 * il faudrait un pipeline inpainting separe (DALL-E image editing, Stable
 * Diffusion inpainting) qui n'est pas implemente dans cette version.
 *
 * Les images generees sont des illustrations d'ambiance montrant le potentiel
 * de la piece avec du mobilier. Elles doivent TOUJOURS porter la mention legale :
 * "Home staging virtuel — mobilier non inclus dans la vente — photo non contractuelle"
 */

export interface HomeStagingInput {
  // Piece a stager
  type_piece: 'salon' | 'chambre' | 'cuisine' | 'salle_de_bain' | 'bureau' | 'entree' | 'salle_a_manger'
  style: 'moderne' | 'scandinave' | 'classique' | 'cosy' | 'industriel' | 'minimaliste'
  // Dimensions et contraintes physiques
  dimensions?: {
    longueur_m?: number
    largeur_m?: number
    surface_m2?: number
  }
  contraintes: {
    lumiere_naturelle: 'abondante' | 'moderee' | 'faible'
    forme_piece: 'rectangulaire' | 'carree' | 'en_L' | 'mansardee' | 'irreguliere'
    hauteur_plafond?: 'standard' | 'haute' | 'basse' | 'sous_pente'
    sol_existant?: string // ex: "parquet chene clair", "carrelage blanc"
    murs_existants?: string // ex: "blanc", "papier peint fleuri"
    elements_fixes?: string[] // ex: ["cheminee", "poutre apparente", "baie vitree"]
  }
  // Contexte du bien (pour coherence des proportions)
  type_bien?: string // ex: "T3 ancien", "studio neuf"
  gamme_prix?: 'entree' | 'milieu' | 'premium' // influence le style du mobilier
  // Photo source (reference pour la description textuelle)
  description_photo_source?: string // ex: "piece vide, murs blancs, fenetre a gauche, parquet"
}

// Labels lisibles pour l'injection dans le prompt
const LABELS_PIECE: Record<HomeStagingInput['type_piece'], string> = {
  salon: 'salon / pièce de vie',
  chambre: 'chambre à coucher',
  cuisine: 'cuisine',
  salle_de_bain: 'salle de bain',
  bureau: 'bureau / espace de travail',
  entree: 'entrée / hall',
  salle_a_manger: 'salle à manger',
}

const LABELS_STYLE: Record<HomeStagingInput['style'], string> = {
  moderne: 'moderne et épuré — lignes droites, matériaux nobles (bois, métal, verre), palette neutre avec touches de couleur',
  scandinave: 'scandinave — bois clair, blanc dominant, textiles chaleureux, plantes vertes, luminosité maximale',
  classique: 'classique élégant — meubles de caractère, tissus riches, symétrie, couleurs chaudes (beige, taupe, bordeaux)',
  cosy: 'cosy et chaleureux — plaids, coussins, éclairage doux, bois, tapis moelleux, ambiance cocon',
  industriel: 'industriel chic — métal brut, bois recyclé, briques apparentes, luminaires statement, palette sombre',
  minimaliste: 'minimaliste — très peu de meubles, lignes pures, espace vide délibéré, palette monochrome',
}

const MOBILIER_PAR_PIECE: Record<HomeStagingInput['type_piece'], string> = {
  salon: 'canapé 2 ou 3 places, table basse, meuble TV bas, tapis, lampe sur pied, quelques coussins, 1-2 cadres au mur, plante verte',
  chambre: 'lit double avec tête de lit, 2 tables de chevet, lampes de chevet, linge de lit soigné, petit tapis, commode ou armoire, 1 cadre au mur',
  cuisine: 'ustensiles sur le plan de travail (planche à découper, bocaux), tabourets de bar si îlot, corbeille de fruits, herbes aromatiques, torchon design',
  salle_de_bain: 'serviettes roulées, panier en osier, plante verte, distributeur de savon, bougies, petit tabouret ou échelle porte-serviettes',
  bureau: 'bureau épuré, chaise ergonomique, lampe de bureau, quelques livres, plante, organiseur, écran (optionnel)',
  entree: 'console étroite, miroir, patère ou porte-manteaux, petit vide-poches, plante, tapis d\'entrée',
  salle_a_manger: 'table à manger 4-6 places, chaises assorties, suspension au-dessus de la table, chemin de table, bougeoir, vaisselle décorative',
}

/**
 * Construit le prompt textuel a envoyer a gpt-image-1 pour generer une image de home staging.
 *
 * IMPORTANT : gpt-image-1 prend un seul prompt texte (pas de system/user split).
 * Le retour est donc une string unique, pas le pattern {system, user} des autres prompts.
 * Cela dit, on exporte aussi une version {system, user} pour compatibilite avec le pattern standard.
 */
export function buildHomeStagingPrompt(input: HomeStagingInput): string {
  const pieceLabel = LABELS_PIECE[input.type_piece]
  const styleLabel = LABELS_STYLE[input.style]
  const mobilierSuggere = MOBILIER_PAR_PIECE[input.type_piece]

  // Dimensions
  let dimensionsStr = ''
  if (input.dimensions) {
    const parts: string[] = []
    if (input.dimensions.surface_m2) parts.push(`environ ${input.dimensions.surface_m2}m2`)
    if (input.dimensions.longueur_m && input.dimensions.largeur_m)
      parts.push(`${input.dimensions.longueur_m}m x ${input.dimensions.largeur_m}m`)
    if (parts.length > 0) dimensionsStr = `La piece fait ${parts.join(' (')}${parts.length > 1 ? ')' : ''}.`
  }

  // Contraintes physiques
  const contraintesLines: string[] = []
  contraintesLines.push(`Lumière naturelle : ${input.contraintes.lumiere_naturelle}`)
  contraintesLines.push(`Forme de la pièce : ${input.contraintes.forme_piece}`)
  if (input.contraintes.hauteur_plafond)
    contraintesLines.push(`Hauteur sous plafond : ${input.contraintes.hauteur_plafond}`)
  if (input.contraintes.sol_existant)
    contraintesLines.push(`Sol existant (à conserver tel quel) : ${input.contraintes.sol_existant}`)
  if (input.contraintes.murs_existants)
    contraintesLines.push(`Murs existants (à conserver tels quels) : ${input.contraintes.murs_existants}`)
  if (input.contraintes.elements_fixes?.length)
    contraintesLines.push(
      `Éléments fixes à conserver : ${input.contraintes.elements_fixes.join(', ')}`
    )

  // Gamme de mobilier
  const gammeStr =
    input.gamme_prix === 'premium'
      ? 'Mobilier haut de gamme, matériaux nobles, finitions soignées.'
      : input.gamme_prix === 'entree'
        ? 'Mobilier accessible et fonctionnel, style IKEA/Maisons du Monde, propre et moderne.'
        : 'Mobilier milieu de gamme, bon rapport qualité/aspect, marques type AM.PM, La Redoute Intérieurs.'

  // Description photo source
  const photoDesc = input.description_photo_source
    ? `La photo montre : ${input.description_photo_source}. Garde cette structure exacte de la pièce.`
    : ''

  const prompt = `Photographie professionnelle de home staging virtuel d'un(e) ${pieceLabel}, style ${styleLabel}.

RÈGLE ABSOLUE — GARDER LA STRUCTURE IDENTIQUE :
- Ne PAS modifier la structure de la pièce (murs, portes, fenêtres, plafond).
- Ne PAS ajouter de fenêtres, portes, vélux ou ouvertures qui n'existent pas.
- Ne PAS changer le sol ni les murs — conserver les revêtements existants.
- Ne PAS déplacer les éléments fixes (cheminée, poutres, radiateurs).
- UNIQUEMENT ajouter du mobilier, de la décoration et de l'éclairage d'appoint.

${photoDesc}

PIÈCE ET DIMENSIONS :
${dimensionsStr}
${contraintesLines.join('\n')}

MOBILIER À AJOUTER (proportions réalistes par rapport à la taille de la pièce) :
${mobilierSuggere}
${gammeStr}

QUALITÉ IMAGE :
- Éclairage naturel réaliste, pas de lumière artificielle visible sauf lampes décoratives
- Proportions correctes du mobilier par rapport à la pièce (un canapé 3 places ne rentre pas dans 8m2)
- Ombres cohérentes avec les sources de lumière
- Rendu photoréaliste haute résolution, angle de prise de vue immobilier standard (légère contre-plongée)
- Pas de personnes dans l'image
- Couleurs naturelles, pas de filtres excessifs

MENTION OBLIGATOIRE : cette image est un home staging virtuel — les meubles présentés ne sont pas inclus dans la vente.`

  return prompt
}

/**
 * Version compatible avec le pattern {system, user} des autres prompts.
 * Le system contient les instructions generales, le user le prompt specifique a la piece.
 * Note : pour gpt-image-1, utiliser buildHomeStagingPrompt() qui retourne un seul string.
 */
export function buildHomeStagingPromptPair(input: HomeStagingInput): {
  system: string
  user: string
} {
  const system = `Tu es un expert en home staging virtuel. Tu génères des descriptions précises de mises en scène d'intérieur pour des biens immobiliers à la vente. Chaque description sera utilisée pour générer une image photoréaliste.

## Garde-fous absolus
- JAMAIS de modification structurelle : pas d'ajout de fenêtres, portes, cloisons
- JAMAIS de changement de sol ou de murs — on garde les revêtements existants
- JAMAIS de déformation des proportions — le mobilier doit être à l'échelle de la pièce
- UNIQUEMENT ajout de mobilier, décoration, textiles et éclairage d'appoint
- Mention obligatoire : "Home staging virtuel — mobilier non inclus dans la vente"

## Objectif
Créer une image qui aide l'acheteur à se projeter dans la pièce vide, sans le tromper sur l'état réel du bien.`

  const user = buildHomeStagingPrompt(input)

  return { system, user }
}
