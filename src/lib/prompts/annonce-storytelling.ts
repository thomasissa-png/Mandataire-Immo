/**
 * Prompt — Annonces immobilieres storytelling (600-900 mots)
 * Utilise pour : L3 (5 annonces Pack Lancement), M5 (4 annonces/mois Pack Mensuel), B1 (annonce Boost Mandat)
 * Output : Markdown par annonce avec accroche courte
 */

export interface AnnonceStorytellingInput {
  prenom: string
  nom: string
  reseau: string
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  cible_clients: string
  gamme_prix: string
  // Contexte optionnel pour enrichir les annonces
  donnees_locales?: {
    prix_m2_moyen?: number
    ecoles?: string[]
    transports?: string[]
    commerces?: string[]
    parcs?: string[]
    tendance_marche?: string
  }
  // Pour le Boost Mandat (un seul bien)
  bien_unique?: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
    description_detaillee?: string
  }
  nombre_annonces?: number
}

export function buildAnnonceStorytellingPrompt(input: AnnonceStorytellingInput): {
  system: string
  user: string
} {
  const system = `Tu es un redacteur immobilier specialise dans les annonces storytelling haut de gamme pour le marche francais. Tu transformes des descriptions techniques de biens en recits immersifs qui projettent l'acheteur dans sa future vie.

REGLES ABSOLUES :
- Chaque annonce fait entre 600 et 900 mots — c'est un vrai texte, pas une fiche technique
- Structure narrative obligatoire : accroche quartier → histoire du bien → projection de vie de l'acheteur → appel a l'action
- Chaque annonce DOIT contenir des elements hyper-locaux : nom du quartier, rues proches, ecoles precises, commerces reels, transports, parcs
- Les prix au m2 doivent etre coherents avec la zone (utilise les donnees fournies)
- Jamais de cliches immobiliers : "bel appartement lumineux", "proche commerces et transports", "dans un ecrin de verdure", "coup de coeur assure"
- Le ton est celui d'un conseiller qui connait intimement le quartier, pas d'un agent qui lit une fiche
- Tutoie le lecteur (l'acheteur potentiel)
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Pas de superlatif non justifie ("le plus beau", "exceptionnel") — prefere des details concrets
- Inclure les mentions legales obligatoires : prix, surface Carrez si applicable, DPE si disponible

STRUCTURE DE CHAQUE ANNONCE :

1. **Accroche quartier** (2-3 phrases) : Plonger le lecteur dans le quartier. Un detail sensoriel ou de vie quotidienne. Pas le bien tout de suite.

2. **Decouverte du bien** (3-4 paragraphes) : Visite guidee piece par piece. Details concrets (pas "pieces spacieuses" mais "le salon de 28m2 ouvre sur une terrasse plein sud"). Points forts naturellement integres au recit.

3. **Projection de vie** (1-2 paragraphes) : "Imagine ton dimanche matin..." — projeter l'acheteur dans des scenes de vie concretes liees aux atouts du bien ET du quartier.

4. **Les chiffres** (court paragraphe) : Surface, pieces, prix, charges le cas echeant. Factuel.

5. **Appel a l'action** (2-3 phrases) : Contact direct avec ${input.prenom}. Ton chaleureux, pas commercial.

FORMATS DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
{
  "annonces": [
    {
      "bien_titre": "Titre du bien",
      "annonce_complete": "Le texte complet de l'annonce en Markdown (600-900 mots)",
      "accroche_courte": "Version courte 150 caracteres max pour SeLoger/LeBonCoin",
      "titre_annonce": "Titre accrocheur pour l'annonce (pas le titre technique du bien)",
      "mots_cles_seo": ["mot-cle-1", "mot-cle-2"]
    }
  ]
}`

  const biensATraiter = input.bien_unique
    ? [input.bien_unique]
    : input.biens

  const biensStr = biensATraiter
    .map(
      (b, i) =>
        `--- Bien ${i + 1} ---
Titre : ${b.titre}
Type : ${b.type}
Adresse : ${b.adresse}
Prix : ${b.prix.toLocaleString('fr-FR')}€
Surface : ${b.surface}m²
Pieces : ${b.pieces}
Points forts : ${b.points_forts}${'description_detaillee' in b && b.description_detaillee ? `\nDescription detaillee : ${b.description_detaillee}` : ''}`
    )
    .join('\n\n')

  const donneesLocales = input.donnees_locales
    ? `
DONNEES LOCALES (a integrer dans les annonces) :
${input.donnees_locales.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales.ecoles?.length ? `- Ecoles du quartier : ${input.donnees_locales.ecoles.join(', ')}` : ''}
${input.donnees_locales.transports?.length ? `- Transports : ${input.donnees_locales.transports.join(', ')}` : ''}
${input.donnees_locales.commerces?.length ? `- Commerces : ${input.donnees_locales.commerces.join(', ')}` : ''}
${input.donnees_locales.parcs?.length ? `- Parcs et espaces verts : ${input.donnees_locales.parcs.join(', ')}` : ''}
${input.donnees_locales.tendance_marche ? `- Tendance du marche : ${input.donnees_locales.tendance_marche}` : ''}`
    : ''

  const nombre = input.nombre_annonces || biensATraiter.length

  const user = `Redige ${nombre} annonce(s) storytelling pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${input.zone_geo.quartiers.join(', ') || input.zone_geo.ville}
- Specialite : ${input.specialite}
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Cible clients : ${input.cible_clients}
- Gamme de prix : ${input.gamme_prix}

BIENS A TRAITER :
${biensStr}
${donneesLocales}

CONSIGNES :
- Chaque annonce doit etre unique dans son approche narrative (pas la meme structure pour tous les biens)
- Adapte le ton et l'angle selon le type de bien : un T2 investisseur n'a pas le meme recit qu'une maison familiale
- Cite au moins 2 elements locaux precis par annonce (ecole, commerce, parc, transport, rue)
- L'accroche courte (150 car.) doit donner envie de lire la suite — pas un resume technique
- Le CTA final redirige vers ${input.prenom} (telephone ou message)`

  return { system, user }
}
