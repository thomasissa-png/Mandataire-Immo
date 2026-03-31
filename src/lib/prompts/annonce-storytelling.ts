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
    photo_count?: number // nombre de photos disponibles
    page_url?: string // URL de la page publique du bien
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

  const system = `Tu es un rédacteur immobilier spécialisé dans les annonces storytelling haut de gamme pour le marché français. Tu transformes des descriptions techniques de biens en récits immersifs qui projettent l'acheteur dans sa future vie.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.
- VARIATION PRIX : ne pas systématiquement citer le prix au m2. Varier entre "quartier prisé", fourchette de prix, ou simplement le prix du bien sans référence au m2.
- OBLIGATOIRE DPE : chaque annonce DOIT contenir une mention DPE. Si le DPE est fourni dans les données du bien, l'afficher clairement (ex: "DPE : C"). Si le DPE n'est pas fourni, écrire en fin d'annonce : "[DPE : information en cours — sera communiqué avant publication]". Ne JAMAIS écrire "DPE : non communiqué" (formulation illégale depuis 2021).

RÈGLES ÉDITORIALES :
- Chaque annonce fait entre 600 et 900 mots — c'est un vrai texte, pas une fiche technique
- Structure narrative obligatoire : accroche quartier -> histoire du bien -> projection de vie de l'acheteur -> appel à l'action
- Chaque annonce DOIT contenir des éléments hyper-locaux UNIQUEMENT s'ils sont présents dans les données fournies (donnees_locales ou zone_geo). NE PAS inventer de noms de rues, écoles, commerces ou boulangeries.
- Les prix au m2 doivent être cohérents avec la zone (utilise les données fournies)
- Jamais de clichés immobiliers : "bel appartement lumineux", "proche commerces et transports", "dans un écrin de verdure", "coup de coeur assuré"
- Le ton est celui d'un conseiller qui connaît intimement le quartier, pas d'un agent qui lit une fiche
- Tutoie le lecteur (l'acheteur potentiel)
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Pas de superlatif non justifié ("le plus beau", "exceptionnel") — préfère des détails concrets
- Inclure les mentions légales obligatoires : prix, surface Carrez si applicable, DPE (voir règle DPE ci-dessus)

STRUCTURE DE CHAQUE ANNONCE :

1. **Accroche quartier** (2-3 phrases) : Plonger le lecteur dans le quartier. Un détail sensoriel ou de vie quotidienne. Pas le bien tout de suite.

2. **Découverte du bien** (3-4 paragraphes) : Visite guidée pièce par pièce. Détails concrets (pas "pièces spacieuses" mais "le salon de 28m2 ouvre sur une terrasse plein sud"). Points forts naturellement intégrés au récit.

3. **Projection de vie** (1-2 paragraphes) : "Imagine ton dimanche matin..." — projeter l'acheteur dans des scènes de vie concrètes liées aux atouts du bien ET du quartier.

4. **Les chiffres** (court paragraphe) : Surface, pièces, prix, charges le cas échéant. Factuel.

5. **Appel à l'action** (2-3 phrases) : Contact direct avec ${input.prenom}. Ton chaleureux, pas commercial.

FORMATS DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "annonces": [
    {
      "bien_titre": "Titre du bien",
      "annonce_complete": "Le texte complet de l'annonce en Markdown (600-900 mots)",
      "accroche_courte": "Version courte 150 caractères max pour SeLoger/LeBonCoin",
      "titre_annonce": "Titre accrocheur pour l'annonce (pas le titre technique du bien)",
      "mots_cles_seo": ["mot-clé-1", "mot-clé-2"]
    }
  ]
}`

  const biensATraiter = input.bien_unique
    ? [input.bien_unique]
    : input.biens

  const biensStr = biensATraiter
    .map((b, i) => {
      const dpe = 'dpe' in b && b.dpe ? b.dpe : '[DPE : information en cours — sera communiqué avant publication]'
      const descLine = 'description_detaillee' in b && b.description_detaillee ? `\nDescription détaillée : ${b.description_detaillee}` : ''
      const photoCount = 'photo_count' in b ? (b.photo_count as number | undefined) : undefined
      const photoLine = photoCount ? `\nPhotos : ${photoCount} photo${photoCount > 1 ? 's' : ''} disponible${photoCount > 1 ? 's' : ''}` : ''
      const urlLine = 'page_url' in b && b.page_url ? `\nPage avec photos : ${b.page_url}` : ''
      return `--- Bien ${i + 1} ---
Titre : ${b.titre}
Type : ${b.type}
Adresse : ${b.adresse}
Prix : ${b.prix.toLocaleString('fr-FR')}€
Surface : ${b.surface}m²
Pièces : ${b.pieces}
Points forts : ${b.points_forts}
DPE : ${dpe}${descLine}${photoLine}${urlLine}`
    })
    .join('\n\n')

  const donneesLocales = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES (utilise UNIQUEMENT ces références, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNÉES LOCALES : non disponibles. Rester général sur les références locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, écoles, boulangeries, arrêts de transport ou marchés.`

  const nombre = input.nombre_annonces || biensATraiter.length

  const user = `Rédige ${nombre} annonce(s) storytelling pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${input.zone_geo.quartiers.join(', ') || input.zone_geo.ville}
- Spécialité : ${input.specialite}
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Cible clients : ${input.cible_clients}
- Gamme de prix : ${input.gamme_prix}

BIENS À TRAITER :
${biensStr}
${donneesLocales}

CONSIGNES :
- Chaque annonce doit être unique dans son approche narrative (pas la même structure pour tous les biens)
- Adapte le ton et l'angle selon le type de bien : un T2 investisseur n'a pas le même récit qu'une maison familiale
- Cite au moins 2 éléments locaux précis par annonce — UNIQUEMENT si ces éléments sont dans les données locales ci-dessus ou dans zone_geo. NE RIEN INVENTER.
- L'accroche courte (150 car.) doit donner envie de lire la suite — pas un résumé technique
- Le CTA final redirige vers ${input.prenom}${input.telephone_contact ? ` (${input.telephone_contact})` : ''}${input.email_contact ? ` ou ${input.email_contact}` : ''}`

  return { system, user }
}
