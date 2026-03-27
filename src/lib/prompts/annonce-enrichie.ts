/**
 * Prompt — Annonce immobiliere enrichie DVF/DPE (version longue + courte)
 * Utilise pour : Versiroom integration — annonce avec donnees publiques verifiees
 * Genere 2 versions : longue storytelling ImmoCrew (600-800 mots) + courte portail (SeLoger 1500 car. max)
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
    (input.donnees_locales.commerces?.length ||
      input.donnees_locales.ecoles?.length ||
      input.donnees_locales.transports?.length ||
      input.donnees_locales.prix_m2_moyen)

  // Comparaison prix bien vs prix median DVF
  const prixM2Bien = Math.round(input.bien.prix / input.bien.surface)
  const ecartDvf = Math.round(((prixM2Bien - input.dvf.prix_median_m2) / input.dvf.prix_median_m2) * 100)
  const positionMarche =
    ecartDvf > 10
      ? 'au-dessus de la mediane du quartier'
      : ecartDvf < -10
        ? 'en dessous de la mediane du quartier'
        : 'dans la mediane du quartier'

  // Label DPE lisible
  const dpeLabels: Record<string, string> = {
    A: 'tres performant (classe A)',
    B: 'performant (classe B)',
    C: 'bon (classe C)',
    D: 'moyen (classe D)',
    E: 'passable (classe E)',
    F: 'peu performant (classe F) — passoire energetique',
    G: 'tres peu performant (classe G) — passoire energetique',
  }
  const dpeLabel = dpeLabels[input.dpe.classe_dpe] || input.dpe.classe_dpe

  const system = `Tu es un redacteur immobilier expert du marche francais. Tu rediges des annonces immobilieres storytelling enrichies avec des donnees publiques verifiees (DVF, DPE).

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres. Les seuls chiffres autorises sont ceux fournis dans les donnees ci-dessous.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le professionnel est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire".
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, ou les algorithmes.

## Donnees DVF — FAITS VERIFIES (source : ${input.dvf.source})
Ces donnees sont des faits publics officiels. Les presenter comme tels dans le texte, pas comme des estimations :
- Prix median au m2 dans le secteur : ${input.dvf.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Periode de reference : ${input.dvf.periode}
- Nombre de transactions sur la periode : ${input.dvf.nb_transactions}
- Prix au m2 de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2 (${positionMarche}, ecart ${ecartDvf > 0 ? '+' : ''}${ecartDvf}%)

## Donnees DPE — FAITS VERIFIES (source : ${input.dpe.source})
Ces donnees sont des diagnostics officiels. Ne JAMAIS les omettre (obligation legale) :
- Classe energetique : ${input.dpe.classe_dpe} — ${dpeLabel}
- Emissions GES : ${input.dpe.classe_ges}
${input.dpe.consommation_kwh ? `- Consommation : ${input.dpe.consommation_kwh} kWh/m2/an` : ''}
${input.dpe.emissions_co2 ? `- Emissions CO2 : ${input.dpe.emissions_co2} kgCO2/m2/an` : ''}
${input.dpe.date_diagnostic ? `- Date du diagnostic : ${input.dpe.date_diagnostic}` : ''}

## Integration des donnees dans le texte
- DVF : integrer naturellement les donnees de prix ("le quartier affiche un prix median de X EUR/m2 sur la periode Y, avec Z transactions enregistrees")
- DPE : integrer comme atout si classe A-C, mentionner factuellement si classe D-E, signaler les implications si classe F-G
- Ne JAMAIS presenter les donnees DVF/DPE comme des estimations — ce sont des faits publics verifies
- Citer la source en fin d'annonce : "Donnees DVF: [source]. DPE: [source]."

## Regles editoriales
- Version LONGUE : 600-800 mots, storytelling immersif ImmoCrew (accroche quartier → decouverte bien → projection de vie → chiffres verifies → CTA)
- Version COURTE : 1500 caracteres max, format portail SeLoger/LeBonCoin (factuel, structure, les donnees cles en premier)
- Tutoie le lecteur (l'acheteur potentiel)
- Pas de cliches immobiliers : "bel appartement lumineux", "proche commerces", "ecrin de verdure"
- Inclure les mentions legales : prix, surface, DPE obligatoire, charges si disponibles

## Format de sortie
Reponds UNIQUEMENT avec un JSON valide :
{
  "version_longue": {
    "titre": "Titre accrocheur (~60 caracteres)",
    "texte": "Texte complet 600-800 mots avec donnees DVF/DPE integrees, en Markdown",
    "mentions_legales": "Prix, surface Carrez, DPE, sources des donnees"
  },
  "version_courte": {
    "titre": "Titre SeLoger (~50 caracteres)",
    "texte": "Texte <=1500 caracteres, factuel, structure",
    "caracteres": 0
  },
  "mots_cles_seo": ["mot-cle-1", "mot-cle-2"]
}`

  // Construction des donnees locales
  const donneesLocalesStr = donneesLocalesDisponibles
    ? `
DONNEES LOCALES VERIFIEES (utilise UNIQUEMENT ces references, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m2 : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')} EUR` : ''}
${input.donnees_locales!.commerces?.length ? `- Commerces : ${input.donnees_locales!.commerces.join(', ')}` : ''}
${input.donnees_locales!.ecoles?.length ? `- Ecoles : ${input.donnees_locales!.ecoles.join(', ')}` : ''}
${input.donnees_locales!.transports?.length ? `- Transports : ${input.donnees_locales!.transports.join(', ')}` : ''}
${input.donnees_locales!.ambiance_quartier ? `- Ambiance : ${input.donnees_locales!.ambiance_quartier}` : ''}`
    : `
DONNEES LOCALES : non disponibles en dehors des donnees DVF/DPE ci-dessus. Rester general sur les references locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, ecoles ou transports.`

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

  const user = `Redige une annonce enrichie pour ce bien immobilier (version longue + version courte).

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse normalisee (BAN) : ${input.coordonnees.adresse_ban}
- Prix : ${input.bien.prix.toLocaleString('fr-FR')} EUR
- Surface : ${input.bien.surface} m2
- Pieces : ${input.bien.pieces}
- Points forts : ${input.bien.points_forts}
${caracComplementaires.length > 0 ? `- Autres : ${caracComplementaires.join(', ')}` : ''}
${input.bien.description_detaillee ? `- Description detaillee : ${input.bien.description_detaillee}` : ''}

## Prix au m2 de ce bien vs marche
- Prix/m2 du bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR
- Mediane DVF du secteur : ${input.dvf.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Position : ${positionMarche} (${ecartDvf > 0 ? '+' : ''}${ecartDvf}%)
- Base : ${input.dvf.nb_transactions} transactions sur ${input.dvf.periode}

## DPE
- Classe : ${input.dpe.classe_dpe} — ${dpeLabel}
- GES : ${input.dpe.classe_ges}
${input.dpe.consommation_kwh ? `- Consommation : ${input.dpe.consommation_kwh} kWh/m2/an` : ''}

## Le mandataire
- ${input.prenom} ${input.nom}, mandataire ${input.reseau}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${input.zone_geo.quartiers.join(', ') || input.zone_geo.ville}
- Specialite : ${input.specialite}
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
${input.telephone_contact ? `- Tel : ${input.telephone_contact}` : ''}
${input.email_contact ? `- Email : ${input.email_contact}` : ''}

## Contexte local
${donneesLocalesStr}

## Consignes
- Version LONGUE : 600-800 mots, storytelling ImmoCrew. Integrer les donnees DVF et DPE comme des faits naturellement dans le recit (pas en bloc separe).
- Version COURTE : <=1500 caracteres, format SeLoger. Structure : titre, localisation, surface/pieces, DPE, prix/m2 vs marche, points forts, contact. Factuel et dense.
- Les donnees DVF/DPE sont des FAITS publics verifies — les presenter comme tels.
- Inclure les sources en fin de chaque version.
- Le CTA redirige vers ${input.prenom}${input.telephone_contact ? ` (${input.telephone_contact})` : ''}${input.email_contact ? ` ou ${input.email_contact}` : ''}.`

  return { system, user }
}
