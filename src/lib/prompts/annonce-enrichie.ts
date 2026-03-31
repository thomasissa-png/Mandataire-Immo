/**
 * Prompt — Annonce immobiliere enrichie DVF/DPE (version longue + courte)
 * Utilise pour : Versiroom integration — annonce avec donnees publiques verifiees
 * Génère 2 versions : longue storytelling ImmoCrew (600-800 mots) + courte portail (SeLoger 1500 car. max)
 * Modele cible : Claude Sonnet (meilleur ratio qualite/cout pour du redactionnel long)
 */

export interface DvfData {
  prix_median_m2: number // ex: 2720
  periode: string // ex: "2024-2025"
  nb_transactions: number // ex: 142
  source: string // ex: "DVF open data — base DGFiP"
}

export interface DpeData {
  classe_dpe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  classe_ges: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  consommation_kwh?: number // kWh/m2/an
  emissions_co2?: number // kgCO2/m2/an
  date_diagnostic?: string // ex: "2025-06-15"
  source: string // ex: "ADEME — base DPE"
}

export interface CoordonneesGeo {
  latitude: number
  longitude: number
  adresse_ban: string // adresse normalisee par la BAN
  code_insee: string
  code_postal: string
}

export interface AnnonceEnrichieInput {
  // Profil mandataire (ClientContext standard)
  prenom: string
  nom: string
  reseau: string
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  cible_clients: string
  // Contact mandataire
  telephone_contact?: string
  email_contact?: string
  // Bien immobilier
  bien: {
    titre: string
    type: string // ex: "Appartement T3", "Maison 5 pieces"
    adresse: string
    prix: number
    surface: number
    pieces: number
    chambres?: number
    etage?: number
    ascenseur?: boolean
    balcon?: boolean
    terrasse?: boolean
    parking?: boolean
    cave?: boolean
    annee_construction?: number
    charges_mensuelles?: number
    taxe_fonciere?: number
    points_forts: string
    description_detaillee?: string
  }
  // Donnees d'enrichissement Versiroom
  dvf: DvfData
  dpe: DpeData
  coordonnees: CoordonneesGeo
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
}

export function buildAnnonceEnrichiePrompt(input: AnnonceEnrichieInput): {
  system: string
  user: string
} {
  const donneesLocalesDisponibles =
    input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen ||
      input.donnees_locales.dernieres_transactions?.length)

  // Comparaison prix bien vs prix median DVF
  const prixM2Bien = Math.round(input.bien.prix / input.bien.surface)
  const ecartDvf = Math.round(((prixM2Bien - input.dvf.prix_median_m2) / input.dvf.prix_median_m2) * 100)
  const positionMarche =
    ecartDvf > 10
      ? 'au-dessus de la médiane du quartier'
      : ecartDvf < -10
        ? 'en dessous de la médiane du quartier'
        : 'dans la médiane du quartier'

  // Label DPE lisible
  const dpeLabels: Record<string, string> = {
    A: 'très performant (classe A)',
    B: 'performant (classe B)',
    C: 'bon (classe C)',
    D: 'moyen (classe D)',
    E: 'passable (classe E)',
    F: 'peu performant (classe F) — passoire énergétique',
    G: 'très peu performant (classe G) — passoire énergétique',
  }
  const dpeLabel = dpeLabels[input.dpe.classe_dpe] || input.dpe.classe_dpe

  const system = `Tu es un rédacteur immobilier expert du marché français. Tu rédiges des annonces immobilières storytelling enrichies avec des données publiques vérifiées (DVF, DPE).

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres. Les seuls chiffres autorisés sont ceux fournis dans les données ci-dessous.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le professionnel est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire".
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, ou les algorithmes.

## Données DVF — FAITS VÉRIFIÉS (source : ${input.dvf.source})
Ces données sont des faits publics officiels. Les présenter comme tels dans le texte, pas comme des estimations :
- Prix médian au m2 dans le secteur : ${input.dvf.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Période de référence : ${input.dvf.periode}
- Nombre de transactions sur la période : ${input.dvf.nb_transactions}
- Prix au m2 de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2 (${positionMarche}, écart ${ecartDvf > 0 ? '+' : ''}${ecartDvf}%)

## Données DPE — FAITS VÉRIFIÉS (source : ${input.dpe.source})
Ces données sont des diagnostics officiels. Ne JAMAIS les omettre (obligation légale) :
- Classe énergétique : ${input.dpe.classe_dpe} — ${dpeLabel}
- Émissions GES : ${input.dpe.classe_ges}
${input.dpe.consommation_kwh ? `- Consommation : ${input.dpe.consommation_kwh} kWh/m2/an` : ''}
${input.dpe.emissions_co2 ? `- Emissions CO2 : ${input.dpe.emissions_co2} kgCO2/m2/an` : ''}
${input.dpe.date_diagnostic ? `- Date du diagnostic : ${input.dpe.date_diagnostic}` : ''}

## Intégration des données dans le texte
- DVF : intégrer naturellement les données de prix ("le quartier affiche un prix médian de X EUR/m2 sur la période Y, avec Z transactions enregistrées")
- DPE : intégrer comme atout si classe A-C, mentionner factuellement si classe D-E, signaler les implications si classe F-G
- Ne JAMAIS présenter les données DVF/DPE comme des estimations — ce sont des faits publics vérifiés
- Citer la source en fin d'annonce : "Données DVF: [source]. DPE: [source]."

## Règles éditoriales
- Version LONGUE : 600-800 mots, storytelling immersif ImmoCrew (accroche quartier → découverte bien → projection de vie → chiffres vérifiés → CTA)
- Version COURTE : 1500 caractères max, format portail SeLoger/LeBonCoin (factuel, structuré, les données clés en premier)
- Tutoie le lecteur (l'acheteur potentiel)
- Pas de clichés immobiliers : "bel appartement lumineux", "proche commerces", "écrin de verdure"
- Inclure les mentions légales : prix, surface, DPE obligatoire, charges si disponibles

## Format de sortie
Réponds UNIQUEMENT avec un JSON valide :
{
  "version_longue": {
    "titre": "Titre accrocheur (~60 caractères)",
    "texte": "Texte complet 600-800 mots avec données DVF/DPE intégrées, en Markdown",
    "mentions_legales": "Prix, surface Carrez, DPE, sources des données"
  },
  "version_courte": {
    "titre": "Titre SeLoger (~50 caractères)",
    "texte": "Texte <=1500 caractères, factuel, structuré",
    "caracteres": 0
  },
  "mots_cles_seo": ["mot-clé-1", "mot-clé-2"]
}`

  // Construction des donnees locales
  const donneesLocalesStr = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES (utilise UNIQUEMENT ces références, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNÉES LOCALES : non disponibles en dehors des données DVF/DPE ci-dessus. Rester général sur les références locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, écoles ou transports.`

  // Caracteristiques complementaires du bien
  const caracComplementaires: string[] = []
  if (input.bien.chambres) caracComplementaires.push(`${input.bien.chambres} chambre(s)`)
  if (input.bien.etage !== undefined)
    caracComplementaires.push(`Etage ${input.bien.etage}${input.bien.ascenseur ? ' avec ascenseur' : ''}`)
  if (input.bien.balcon) caracComplementaires.push('Balcon')
  if (input.bien.terrasse) caracComplementaires.push('Terrasse')
  if (input.bien.parking) caracComplementaires.push('Parking')
  if (input.bien.cave) caracComplementaires.push('Cave')
  if (input.bien.annee_construction)
    caracComplementaires.push(`Construction : ${input.bien.annee_construction}`)
  if (input.bien.charges_mensuelles)
    caracComplementaires.push(
      `Charges : ${input.bien.charges_mensuelles.toLocaleString('fr-FR')} EUR/mois`
    )
  if (input.bien.taxe_fonciere)
    caracComplementaires.push(
      `Taxe fonciere : ${input.bien.taxe_fonciere.toLocaleString('fr-FR')} EUR/an`
    )

  const user = `Rédige une annonce enrichie pour ce bien immobilier (version longue + version courte).

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse normalisee (BAN) : ${input.coordonnees.adresse_ban}
- Prix : ${input.bien.prix.toLocaleString('fr-FR')} EUR
- Surface : ${input.bien.surface} m2
- Pieces : ${input.bien.pieces}
- Points forts : ${input.bien.points_forts}
${caracComplementaires.length > 0 ? `- Autres : ${caracComplementaires.join(', ')}` : ''}
${input.bien.description_detaillee ? `- Description détaillée : ${input.bien.description_detaillee}` : ''}

## Prix au m2 de ce bien vs marché
- Prix/m2 du bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR
- Médiane DVF du secteur : ${input.dvf.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Position : ${positionMarche} (${ecartDvf > 0 ? '+' : ''}${ecartDvf}%)
- Base : ${input.dvf.nb_transactions} transactions sur ${input.dvf.periode}

## DPE
- Classe : ${input.dpe.classe_dpe} — ${dpeLabel}
- GES : ${input.dpe.classe_ges}
${input.dpe.consommation_kwh ? `- Consommation : ${input.dpe.consommation_kwh} kWh/m2/an` : ''}

## Le mandataire
- ${input.prenom} ${input.nom}, mandataire ${input.reseau}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${input.zone_geo.quartiers.join(', ') || input.zone_geo.ville}
- Spécialité : ${input.specialite}
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
${input.telephone_contact ? `- Tel : ${input.telephone_contact}` : ''}
${input.email_contact ? `- Email : ${input.email_contact}` : ''}

## Contexte local
${donneesLocalesStr}

## Consignes
- Version LONGUE : 600-800 mots, storytelling ImmoCrew. Intégrer les données DVF et DPE comme des faits naturellement dans le récit (pas en bloc séparé).
- Version COURTE : <=1500 caractères, format SeLoger. Structure : titre, localisation, surface/pièces, DPE, prix/m2 vs marché, points forts, contact. Factuel et dense.
- Les données DVF/DPE sont des FAITS publics vérifiés — les présenter comme tels.
- Inclure les sources en fin de chaque version.
- Le CTA redirige vers ${input.prenom}${input.telephone_contact ? ` (${input.telephone_contact})` : ''}${input.email_contact ? ` ou ${input.email_contact}` : ''}.`

  return { system, user }
}
