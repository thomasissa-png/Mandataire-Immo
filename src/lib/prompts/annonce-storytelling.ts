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
    dpe?: string // ex: "C", "D", "E" — obligatoire legalement
  }>
  cible_clients: string
  gamme_prix: string
  // Donnees locales enrichies (depuis API DVF)
  donnees_locales?: {
    prix_m2_moyen?: number
    lat?: number | null
    lon?: number | null
    postcode?: string
    dernieres_transactions?: Array<{
      date: string
      prix: number
      surface: number
      prix_m2: number
      type: string
    }>
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
    dpe?: string
  }
  nombre_annonces?: number
  // Contact mandataire pour le CTA
  telephone_contact?: string
  email_contact?: string
}

export function buildAnnonceStorytellingPrompt(input: AnnonceStorytellingInput): {
  system: string
  user: string
} {
  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.dernieres_transactions?.length)

  const system = `Tu es un redacteur immobilier specialise dans les annonces storytelling haut de gamme pour le marche francais. Tu transformes des descriptions techniques de biens en recits immersifs qui projettent l'acheteur dans sa future vie.

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres d'experience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le reseau du client utilise un autre terme.
- VARIATION PRIX : ne pas systematiquement citer le prix au m2. Varier entre "quartier prisé", fourchette de prix, ou simplement le prix du bien sans reference au m2.
- OBLIGATOIRE DPE : chaque annonce DOIT contenir une mention DPE. Si le DPE est fourni dans les donnees du bien, l'afficher clairement (ex: "DPE : C"). Si le DPE n'est pas fourni, ecrire en fin d'annonce : "[DPE : information en cours — sera communique avant publication]". Ne JAMAIS ecrire "DPE : non communique" (formulation illegale depuis 2021).

REGLES EDITORIALES :
- Chaque annonce fait entre 600 et 900 mots — c'est un vrai texte, pas une fiche technique
- Structure narrative obligatoire : accroche quartier -> histoire du bien -> projection de vie de l'acheteur -> appel a l'action
- Chaque annonce DOIT contenir des elements hyper-locaux UNIQUEMENT s'ils sont presents dans les donnees fournies (donnees_locales ou zone_geo). NE PAS inventer de noms de rues, ecoles, commerces ou boulangeries.
- Les prix au m2 doivent etre coherents avec la zone (utilise les donnees fournies)
- Jamais de cliches immobiliers : "bel appartement lumineux", "proche commerces et transports", "dans un ecrin de verdure", "coup de coeur assure"
- Le ton est celui d'un conseiller qui connait intimement le quartier, pas d'un agent qui lit une fiche
- Tutoie le lecteur (l'acheteur potentiel)
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Pas de superlatif non justifie ("le plus beau", "exceptionnel") — prefere des details concrets
- Inclure les mentions legales obligatoires : prix, surface Carrez si applicable, DPE (voir regle DPE ci-dessus)

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
Points forts : ${b.points_forts}
DPE : ${'dpe' in b && b.dpe ? b.dpe : '[DPE : information en cours — sera communique avant publication]'}${'description_detaillee' in b && b.description_detaillee ? `\nDescription detaillee : ${b.description_detaillee}` : ''}`
    )
    .join('\n\n')

  const donneesLocales = donneesLocalesDisponibles
    ? `
DONNEES LOCALES VERIFIEES (utilise UNIQUEMENT ces references, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNEES LOCALES : non disponibles. Rester general sur les references locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, ecoles, boulangeries, arrets de transport ou marches.`

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
- Cite au moins 2 elements locaux precis par annonce — UNIQUEMENT si ces elements sont dans les donnees locales ci-dessus ou dans zone_geo. NE RIEN INVENTER.
- L'accroche courte (150 car.) doit donner envie de lire la suite — pas un resume technique
- Le CTA final redirige vers ${input.prenom}${input.telephone_contact ? ` (${input.telephone_contact})` : ''}${input.email_contact ? ` ou ${input.email_contact}` : ''}`

  return { system, user }
}
