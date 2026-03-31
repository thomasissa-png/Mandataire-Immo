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
  // Photos originales du bien (uploadees par le mandataire)
  photos_originales?: Array<{
    url: string
    ordre: number
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
## Données DVF vérifiées (source : ${input.dvf!.source})
Intégrer ces données dans une section "Marché local" de la page :
- Prix médian au m2 du secteur : ${input.dvf!.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Période : ${input.dvf!.periode}
- Transactions enregistrées : ${input.dvf!.nb_transactions}
- Prix/m2 de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2 (écart ${ecartDvf > 0 ? '+' : ''}${ecartDvf}% vs médiane)
Présenter comme des FAITS publics vérifiés, pas des estimations. Citer la source en footer.`
  }

  let dpeSection = ''
  if (hasDpeData) {
    const dpeLabels: Record<string, string> = {
      A: 'Très performant', B: 'Performant', C: 'Bon', D: 'Moyen',
      E: 'Passable', F: 'Peu performant — passoire énergétique', G: 'Très peu performant — passoire énergétique',
    }
    dpeSection = `
## Données DPE vérifiées (source : ${input.dpe_data!.source})
Intégrer dans la section caractéristiques avec un badge visuel coloré :
- Classe énergétique : ${input.dpe_data!.classe_dpe} — ${dpeLabels[input.dpe_data!.classe_dpe] || input.dpe_data!.classe_dpe}
- Émissions GES : ${input.dpe_data!.classe_ges}
${input.dpe_data!.consommation_kwh ? `- Consommation : ${input.dpe_data!.consommation_kwh} kWh/m2/an` : ''}
${input.dpe_data!.emissions_co2 ? `- Emissions : ${input.dpe_data!.emissions_co2} kgCO2/m2/an` : ''}
Utiliser les couleurs standard du DPE français (vert foncé pour A → rouge pour G) pour le badge.`
  }

  let visuelsSection = ''
  if (hasVisuels) {
    visuelsSection = `
## Visuels home staging (Versiroom)
La page DOIT inclure une section "Visuels de mise en scène" avec les images home staging :
${input.visuels_home_staging!.map((v, i) => `- Image ${i + 1} : ${v.piece} (style ${v.style}) — URL : ${v.url}`).join('\n')}
Ajouter une mention visible sous chaque image : "Home staging virtuel — mobilier non inclus dans la vente"
Afficher les images dans une grille responsive (1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop).`
  }

  const hasPhotos = input.photos_originales && input.photos_originales.length > 0
  let photosSection = ''
  if (hasPhotos && !hasVisuels) {
    // Photos originales en fallback si pas de visuels home staging
    const sortedPhotos = [...input.photos_originales!].sort((a, b) => a.ordre - b.ordre)
    photosSection = `
## Photos du bien (uploadées par le mandataire)
La page DOIT inclure une galerie photo avec les images réelles du bien :
${sortedPhotos.map((p, i) => `- Photo ${i + 1} : <img src="${p.url}" alt="Photo ${i + 1} du bien" loading="lazy">`).join('\n')}
Afficher les photos dans une grille responsive (1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop).
La première photo doit être affichée en plus grand (pleine largeur) comme photo principale.`
  } else if (hasPhotos && hasVisuels) {
    const sortedPhotos = [...input.photos_originales!].sort((a, b) => a.ordre - b.ordre)
    photosSection = `
## Photos réelles du bien
En plus des visuels home staging, inclure une section "Photos du bien" avec les images réelles :
${sortedPhotos.map((p, i) => `- Photo ${i + 1} : <img src="${p.url}" alt="Photo ${i + 1} du bien" loading="lazy">`).join('\n')}
Placer cette section AVANT la section home staging.`
  }

  let carteSection = ''
  if (hasCoordonnees) {
    carteSection = `
## Localisation
Ajouter une section carte avec une iframe OpenStreetMap centrée sur les coordonnées :
- Latitude : ${input.coordonnees_geo!.latitude}
- Longitude : ${input.coordonnees_geo!.longitude}
- Adresse BAN : ${input.coordonnees_geo!.adresse_ban}
Utiliser une iframe OpenStreetMap (pas de JS nécessaire) : https://www.openstreetmap.org/export/embed.html?bbox=...&layer=mapnik&marker=lat,lon`
  }

  const system = `Tu es un développeur web et copywriter spécialisé en immobilier. Tu crées des mini landing pages élégantes et efficaces pour présenter un bien immobilier à la vente.

## Ton rôle
Générer le code HTML complet d'une page standalone de présentation d'un bien immobilier. Cette page sera hébergée telle quelle — elle doit être autonome (CSS inline, pas de dépendances externes sauf Google Fonts).

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le professionnel est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "Mandataire" dans les textes de la page (ex: "Votre mandataire", pas "Votre agent immobilier").
- UTILISER LES VRAIES COORDONNÉES du mandataire fournies ci-dessous. Ne JAMAIS écrire "06 00 00 00 00" ou un email placeholder.
- Le domaine email IAD est "iadfrance.fr", PAS "iad.fr".
${hasDvf || hasDpeData ? '\n- Les données DVF et DPE sont des FAITS publics vérifiés — les présenter comme tels, jamais comme des estimations. Citer les sources en footer.' : ''}

## Règles techniques
- HTML5 valide, responsive (mobile-first), accessible (aria-labels, contrastes WCAG AA)
- CSS inline dans une balise <style> — pas de fichier externe
- Police : Inter (Google Fonts) avec fallback system-ui
- Palette : ${input.couleur_principale || '#1B2A4A'} pour les titres, ${input.couleur_accent || '#F27A1A'} pour les CTA, blanc/gris clair pour le fond
- Section hero avec le titre du bien et l'accroche
- Section description avec le texte storytelling (fourni ou à générer)
${!input.annonce_storytelling ? '- IMPORTANT : si aucune annonce storytelling n\'est fournie, tu DOIS générer une description immersive du bien de MINIMUM 300 mots. Décrire pièce par pièce avec projection de vie, pas une fiche technique. L\'acheteur doit pouvoir s\'imaginer vivre dans ce bien en lisant la description.' : ''}
- Section caractéristiques (surface, pièces, prix, points forts${hasDpeData ? ', badge DPE coloré' : ''}) en grille
${hasDvf ? '- Section "Marché local" avec données DVF (prix médian, nb transactions, positionnement du bien)' : ''}
- Section quartier (description locale, commodités, transports${hasCoordonnees ? ', carte OpenStreetMap' : ''})
${hasVisuels ? '- Section "Visuels de mise en scène" avec grille d\'images home staging + mention légale' : ''}
- Section contact avec les coordonnées du mandataire et un lien mailto + tel
- Footer avec mentions légales minimales (nom, réseau, "Non contractuel"${hasDvf || hasDpeData ? ', sources des données DVF/DPE' : ''})
- Pas de JavaScript — page purement statique
- Le prix doit être affiché en format français (espaces, EUR)
${!hasVisuels && !hasPhotos ? '- Ne pas utiliser de placeholder d\'images — utiliser des blocs colorés avec des icônes CSS' : ''}
${hasPhotos ? '- Section "Photos du bien" avec galerie des photos réelles uploadées par le mandataire' : ''}

## Format de sortie
Réponds UNIQUEMENT avec un objet JSON valide :
{
  "titre_page": "Titre pour la balise <title>",
  "meta_description": "Description pour le meta tag",
  "html": "<!DOCTYPE html>\\n<html>... code HTML complet ...</html>"
}${dvfSection}${dpeSection}${photosSection}${visuelsSection}${carteSection}`

  const annonceSection = input.annonce_storytelling
    ? `\nAnnonce storytelling deja generee (a integrer dans la section description) :\n${input.annonce_storytelling}`
    : "\nPas d'annonce pré-générée — rédige une description attractive du bien en te basant sur ses caractéristiques."

  const contactSection = [
    `Email : ${input.email_contact}`,
    input.telephone_contact ? `Telephone : ${input.telephone_contact}` : null,
    input.reseaux_sociaux.instagram ? `Instagram : ${input.reseaux_sociaux.instagram}` : null,
    input.reseaux_sociaux.facebook ? `Facebook : ${input.reseaux_sociaux.facebook}` : null,
  ].filter(Boolean).join("\n")

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.dernieres_transactions?.length)

  const donneesLocalesSection = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES pour la section quartier (utilise UNIQUEMENT ces références) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNÉES LOCALES : non disponibles. Pour la section quartier, rester général (nom de ville et quartier uniquement). NE PAS inventer de commodités, écoles ou transports.`

  // DPE : priorite aux donnees structurees Versiroom, fallback sur le champ legacy
  const dpeDisplay = hasDpeData
    ? `${input.dpe_data!.classe_dpe} (GES: ${input.dpe_data!.classe_ges})${input.dpe_data!.consommation_kwh ? ` — ${input.dpe_data!.consommation_kwh} kWh/m2/an` : ''}`
    : input.bien.dpe || '[DPE : information en cours — sera communiqué avant publication]'

  // DVF contexte prix pour le user prompt
  let dvfUserSection = ''
  if (hasDvf) {
    const prixM2Bien = Math.round(input.bien.prix / input.bien.surface)
    dvfUserSection = `
## Données marché local (DVF)
- Prix médian du secteur : ${input.dvf!.prix_median_m2.toLocaleString('fr-FR')} EUR/m2
- Prix de ce bien : ${prixM2Bien.toLocaleString('fr-FR')} EUR/m2
- Période : ${input.dvf!.periode} (${input.dvf!.nb_transactions} transactions)
- Source : ${input.dvf!.source}
Intégrer ces données dans une section dédiée "Marché local" avec un visuel clair (barre ou badge).`
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
Adresse normalisée : ${input.coordonnees_geo!.adresse_ban}
Iframe carte : <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}" style="width:100%;height:300px;border:0"></iframe>`
  }

  const user = `Crée une mini landing page pour ce bien immobilier :

## Le bien
- Titre : ${input.bien.titre}
- Type : ${input.bien.type}
- Adresse : ${hasCoordonnees ? input.coordonnees_geo!.adresse_ban : input.bien.adresse}
- Prix : ${input.bien.prix.toLocaleString("fr-FR")} EUR
- Surface : ${input.bien.surface} m2
- Pièces : ${input.bien.pieces}
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

IMPORTANT : utiliser les VRAIES coordonnées ci-dessus dans les liens mailto: et tel:. Aucun placeholder.

## Contexte local
- Ville : ${input.zone_geo.ville}
- Quartiers de référence : ${input.zone_geo.quartiers.join(", ") || input.bien.adresse}
${donneesLocalesSection}

Génère le HTML complet. La page doit donner envie de contacter le mandataire pour une visite. Le titre professionnel affiché sur la page doit être "Mandataire ${input.reseau}", jamais "Agent immobilier".${hasDvf || hasDpeData ? '\nLes données DVF et DPE sont des FAITS publics vérifiés — citer les sources dans le footer.' : ''}`

  return { system, user }
}
