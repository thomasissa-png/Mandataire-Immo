/**
 * Prompt — Mini landing page pour un bien immobilier
 * Utilise pour : B3 (Boost Mandat), route /bien/[id] (Versiroom integration)
 * Output : JSON avec HTML complet auto-hebergeable
 * Enrichi avec donnees DVF/DPE/geocoding quand disponibles (Versiroom pipeline)
 */

export interface LandingBienDvfData {
  prix_median_m2: number
  periode: string // ex: "2024-2025"
  nb_transactions: number
  source: string // ex: "DVF open data — base DGFiP"
}

export interface LandingBienDpeData {
  classe_dpe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  classe_ges: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  consommation_kwh?: number
  emissions_co2?: number
  source: string // ex: "ADEME — base DPE"
}

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
    dpe?: string // ex: "C", "D" — obligatoire legalement (legacy, remplace par dvf/dpe si disponibles)
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
  // Donnees d'enrichissement Versiroom (optionnelles — upgrade par rapport a la version B3 de base)
  dvf?: LandingBienDvfData
  dpe_data?: LandingBienDpeData
  coordonnees_geo?: {
    latitude: number
    longitude: number
    adresse_ban: string // adresse normalisee BAN
  }
  // URLs des visuels home staging (generees par le pipeline Versiroom)
  visuels_home_staging?: Array<{
    url: string
    piece: string // ex: "salon", "chambre"
    style: string // ex: "scandinave"
  }>
  // Personnalisation visuelle optionnelle
  couleur_principale?: string // ex: "#1B2A4A" (defaut: bleu nuit)
  couleur_accent?: string // ex: "#F27A1A" (defaut: orange)
}

export function buildLandingBienPrompt(input: LandingBienInput): { system: string; user: string } {
  // Calcul DVF si disponible
  const hasDvf = !!input.dvf
  const hasDpeData = !!input.dpe_data
  const hasVisuels = input.visuels_home_staging && input.visuels_home_staging.length > 0
  const hasCoordonnees = !!input.coordonnees_geo

  let dvfSection = ''
  if (hasDvf) {
    const prixM2Bien = Math.round(input.bien.prix / input.bien.surface)
    const ecartDvf = Math.round(((prixM2Bien - input.dvf!.prix_median_m2) / input.dvf!.prix_median_m2) * 100)
    dvfSection = `
## Donnees DVF verifiees (source : ${input.dvf!.source})
Integrer ces donnees dans une section "Marche local" de la page :
- Prix median au m2 du secteur : ${input.dvf!.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Periode : ${input.dvf!.periode}
- Transactions enregistrees : ${input.dvf!.nb_transactions}
- Prix/m2 de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2 (ecart ${ecartDvf > 0 ? '+' : ''}${ecartDvf}% vs mediane)
Presenter comme des FAITS publics verifies, pas des estimations. Citer la source en footer.`
  }

  let dpeSection = ''
  if (hasDpeData) {
    const dpeLabels: Record<string, string> = {
      A: 'Tres performant', B: 'Performant', C: 'Bon', D: 'Moyen',
      E: 'Passable', F: 'Peu performant — passoire energetique', G: 'Tres peu performant — passoire energetique',
    }
    dpeSection = `
## Donnees DPE verifiees (source : ${input.dpe_data!.source})
Integrer dans la section caracteristiques avec un badge visuel colore :
- Classe energetique : ${input.dpe_data!.classe_dpe} — ${dpeLabels[input.dpe_data!.classe_dpe] || input.dpe_data!.classe_dpe}
- Emissions GES : ${input.dpe_data!.classe_ges}
${input.dpe_data!.consommation_kwh ? `- Consommation : ${input.dpe_data!.consommation_kwh} kWh/m2/an` : ''}
${input.dpe_data!.emissions_co2 ? `- Emissions : ${input.dpe_data!.emissions_co2} kgCO2/m2/an` : ''}
Utiliser les couleurs standard du DPE francais (vert fonce pour A → rouge pour G) pour le badge.`
  }

  let visuelsSection = ''
  if (hasVisuels) {
    visuelsSection = `
## Visuels home staging (Versiroom)
La page DOIT inclure une section "Visuels de mise en scene" avec les images home staging :
${input.visuels_home_staging!.map((v, i) => `- Image ${i + 1} : ${v.piece} (style ${v.style}) — URL : ${v.url}`).join('\n')}
Ajouter une mention visible sous chaque image : "Home staging virtuel — mobilier non inclus dans la vente"
Afficher les images dans une grille responsive (1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop).`
  }

  let carteSection = ''
  if (hasCoordonnees) {
    carteSection = `
## Localisation
Ajouter une section carte avec une iframe OpenStreetMap centree sur les coordonnees :
- Latitude : ${input.coordonnees_geo!.latitude}
- Longitude : ${input.coordonnees_geo!.longitude}
- Adresse BAN : ${input.coordonnees_geo!.adresse_ban}
Utiliser une iframe OpenStreetMap (pas de JS necessaire) : https://www.openstreetmap.org/export/embed.html?bbox=...&layer=mapnik&marker=lat,lon`
  }

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
${hasDvf || hasDpeData ? '\n- Les donnees DVF et DPE sont des FAITS publics verifies — les presenter comme tels, jamais comme des estimations. Citer les sources en footer.' : ''}

## Regles techniques
- HTML5 valide, responsive (mobile-first), accessible (aria-labels, contrastes WCAG AA)
- CSS inline dans une balise <style> — pas de fichier externe
- Police : Inter (Google Fonts) avec fallback system-ui
- Palette : ${input.couleur_principale || '#1B2A4A'} pour les titres, ${input.couleur_accent || '#F27A1A'} pour les CTA, blanc/gris clair pour le fond
- Section hero avec le titre du bien et l'accroche
- Section description avec le texte storytelling (fourni ou a generer)
${!input.annonce_storytelling ? '- IMPORTANT : si aucune annonce storytelling n\'est fournie, tu DOIS generer une description immersive du bien de MINIMUM 300 mots. Decrire piece par piece avec projection de vie, pas une fiche technique. L\'acheteur doit pouvoir s\'imaginer vivre dans ce bien en lisant la description.' : ''}
- Section caracteristiques (surface, pieces, prix, points forts${hasDpeData ? ', badge DPE colore' : ''}) en grille
${hasDvf ? '- Section "Marche local" avec donnees DVF (prix median, nb transactions, positionnement du bien)' : ''}
- Section quartier (description locale, commodites, transports${hasCoordonnees ? ', carte OpenStreetMap' : ''})
${hasVisuels ? '- Section "Visuels de mise en scene" avec grille d\'images home staging + mention legale' : ''}
- Section contact avec les coordonnees du mandataire et un lien mailto + tel
- Footer avec mentions legales minimales (nom, reseau, "Non contractuel"${hasDvf || hasDpeData ? ', sources des donnees DVF/DPE' : ''})
- Pas de JavaScript — page purement statique
- Le prix doit etre affiche en format francais (espaces, EUR)
${!hasVisuels ? '- Ne pas utiliser de placeholder d\'images — utiliser des blocs colores avec des icones CSS' : ''}

## Format de sortie
Reponds UNIQUEMENT avec un objet JSON valide :
{
  "titre_page": "Titre pour la balise <title>",
  "meta_description": "Description pour le meta tag",
  "html": "<!DOCTYPE html>\\n<html>... code HTML complet ...</html>"
}${dvfSection}${dpeSection}${visuelsSection}${carteSection}`

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

  // DPE : priorite aux donnees structurees Versiroom, fallback sur le champ legacy
  const dpeDisplay = hasDpeData
    ? `${input.dpe_data!.classe_dpe} (GES: ${input.dpe_data!.classe_ges})${input.dpe_data!.consommation_kwh ? ` — ${input.dpe_data!.consommation_kwh} kWh/m2/an` : ''}`
    : input.bien.dpe || '[DPE : information en cours — sera communique avant publication]'

  // DVF contexte prix pour le user prompt
  let dvfUserSection = ''
  if (hasDvf) {
    const prixM2Bien = Math.round(input.bien.prix / input.bien.surface)
    dvfUserSection = `
## Donnees marche local (DVF)
- Prix median du secteur : ${input.dvf!.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Prix de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2
- Periode : ${input.dvf!.periode} (${input.dvf!.nb_transactions} transactions)
- Source : ${input.dvf!.source}
Integrer ces donnees dans une section dediee "Marche local" avec un visuel clair (barre ou badge).`
  }

  // Visuels home staging pour le user prompt
  let visuelsUserSection = ''
  if (hasVisuels) {
    visuelsUserSection = `
## Visuels home staging
${input.visuels_home_staging!.map((v, i) => `- Image ${i + 1} : <img src="${v.url}" alt="Home staging ${v.piece} style ${v.style}">`).join('\n')}
Afficher dans une grille avec la mention "Home staging virtuel — mobilier non inclus dans la vente" sous chaque image.`
  }

  // Carte pour le user prompt
  let carteUserSection = ''
  if (hasCoordonnees) {
    const lat = input.coordonnees_geo!.latitude
    const lon = input.coordonnees_geo!.longitude
    const bbox = `${lon - 0.005},${lat - 0.005},${lon + 0.005},${lat + 0.005}`
    carteUserSection = `
## Localisation
Adresse normalisee : ${input.coordonnees_geo!.adresse_ban}
Iframe carte : <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}" style="width:100%;height:300px;border:0"></iframe>`
  }

  const user = `Cree une mini landing page pour ce bien immobilier :

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse : ${hasCoordonnees ? input.coordonnees_geo!.adresse_ban : input.bien.adresse}
- Prix : ${input.bien.prix.toLocaleString("fr-FR")} EUR
- Surface : ${input.bien.surface} m2
- Pieces : ${input.bien.pieces}
- Points forts : ${input.bien.points_forts}
- DPE : ${dpeDisplay}
${annonceSection}
${dvfUserSection}
${visuelsUserSection}
${carteUserSection}

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

Genere le HTML complet. La page doit donner envie de contacter le mandataire pour une visite. Le titre professionnel affiche sur la page doit etre "Mandataire ${input.reseau}", jamais "Agent immobilier".${hasDvf || hasDpeData ? '\nLes donnees DVF et DPE sont des FAITS publics verifies — citer les sources dans le footer.' : ''}`

  return { system, user }
}
