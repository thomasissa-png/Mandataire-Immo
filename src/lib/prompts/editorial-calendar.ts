/**
 * Prompt — Calendrier editorial 30 jours
 * Utilise pour : S5 (Setup mois 1, inclus dans tous les abonnements)
 * Output : JSON array de 30 entrees (date, plateforme, type, sujet, angle, hashtags)
 */

export interface EditorialCalendarInput {
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
  reseaux_sociaux: { instagram?: string; facebook?: string; linkedin?: string; site_web?: string }
  nb_transactions_an: number
  annees_experience: number
  cible_clients: string
  gamme_prix?: string
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
  // Contexte de generation
  date_debut?: string // ISO date, defaut: aujourd'hui
  frequence_hebdo?: number // publications par semaine, defaut: 5
  sujets_prioritaires?: string[]
  evenements_locaux?: string[]
}

export function buildEditorialCalendarPrompt(input: EditorialCalendarInput): { system: string; user: string } {
  const dateDebut = input.date_debut || new Date().toISOString().slice(0, 10)
  const frequence = input.frequence_hebdo || 5

  const system = `Tu es un community manager expert en immobilier, spécialisé dans la creation de calendriers éditoriaux pour des mandataires independants en France.

## Ton role
Produire un calendrier editorial de 30 jours, concret et actionnable, adapte au profil du mandataire, a sa zone geographique et a son style de communication.

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres d'experience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS ecrire un nombre d'annees d'experience different de celui fourni. Si annees_experience = ${input.annees_experience}, ecrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.

## Regles editoriales
- Chaque entree doit etre suffisamment detaillee pour qu'un autre agent IA puisse rediger le post complet sans contexte supplementaire
- Varier les types de contenu : conseil, bien en avant, vie de quartier, coulisses metier, temoignage, actu marche, contenu educatif
- Alterner les plateformes selon leurs forces : Instagram (visuel, Reels), Facebook (communaute locale, albums), LinkedIn (expertise, marche)
- Les sujets doivent etre hyper-localises : nommer les quartiers, les ecoles, les commerces, les evenements
- Ne jamais repeter le meme angle deux fois dans le mois
- Respecter le rythme de ${frequence} publications par semaine (pas de publication le dimanche sauf evenement)
- Le ton doit correspondre au style du mandataire : "${input.ton}"

## Format de sortie
Reponds UNIQUEMENT avec un objet JSON valide :
{
  "calendrier": [
    {
      "jour": 1,
      "date": "YYYY-MM-DD",
      "plateforme": "instagram" | "facebook" | "linkedin",
      "type": "conseil" | "bien" | "quartier" | "coulisses" | "temoignage" | "marche" | "educatif" | "reel",
      "sujet": "Description precise du sujet (1-2 phrases)",
      "angle": "Angle editorial precis — ce qui rend ce post unique",
      "hashtags": ["hashtag1", "hashtag2", "..."],
      "heure_suggeree": "HH:MM"
    }
  ]
}`

  const biensSection = input.biens.length > 0
    ? `\nBiens actuellement en vente :\n${input.biens.map((b, i) => `${i + 1}. ${b.titre} — ${b.type}, ${b.surface}m2, ${b.pieces} pieces, ${b.prix}EUR, ${b.adresse}. Points forts : ${b.points_forts}`).join("\n")}`
    : "\nAucun bien en vente actuellement — privilegier le contenu expertise, quartier et conseil."

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.dernieres_transactions?.length)

  const donneesLocalesSection = donneesLocalesDisponibles
    ? `\nDONNEES LOCALES VERIFIEES (utilise UNIQUEMENT ces references dans les sujets de posts, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `\nDONNEES LOCALES : non disponibles. Dans les sujets de posts, utiliser UNIQUEMENT les noms de ville et quartiers fournis dans zone_geo. NE PAS inventer de noms de commerces, ecoles, marches ou arrets de transport.`

  const evenementsSection = input.evenements_locaux && input.evenements_locaux.length > 0
    ? `\nEvenements locaux a integrer : ${input.evenements_locaux.join(", ")}`
    : ""

  const sujetsSection = input.sujets_prioritaires && input.sujets_prioritaires.length > 0
    ? `\nSujets prioritaires demandes par le client : ${input.sujets_prioritaires.join(", ")}`
    : ""

  const reseauxSection = [
    input.reseaux_sociaux.instagram ? `Instagram: ${input.reseaux_sociaux.instagram}` : null,
    input.reseaux_sociaux.facebook ? `Facebook: ${input.reseaux_sociaux.facebook}` : null,
    input.reseaux_sociaux.linkedin ? `LinkedIn: ${input.reseaux_sociaux.linkedin}` : null,
  ].filter(Boolean).join(", ") || "Aucun réseau configuré"

  const user = `Cree un calendrier editorial de 30 jours pour ce mandataire immobilier :

## Profil
- Nom : ${input.prenom} ${input.nom}
- Réseau : ${input.reseau}
- Specialite : ${input.specialite}
- Annees d'experience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais ecrire un autre nombre)
- Volume : ${input.nb_transactions_an} transactions/an
${input.gamme_prix ? `- Gamme de prix : ${input.gamme_prix}` : ''}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement})
- Quartiers de reference : ${input.zone_geo.quartiers.join(", ") || "non precises"}
- Clients cibles : ${input.cible_clients}
- Ce qui le differencie : ${input.ce_qui_differencie}
- Valeurs : ${input.valeurs}
- Ton : ${input.ton}
- Réseaux sociaux actifs : ${reseauxSection}
${biensSection}
${donneesLocalesSection}
${evenementsSection}
${sujetsSection}

## Parametres
- Date de debut : ${dateDebut}
- Frequence : ${frequence} publications/semaine
- Duree : 30 jours

Génère exactement 30 jours de calendrier. Chaque entree doit etre unique et localisee.`

  return { system, user }
}
