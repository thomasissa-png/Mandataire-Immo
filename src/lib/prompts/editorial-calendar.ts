/**
 * Prompt — Calendrier editorial 30 jours
 * Utilise pour : L5 (Pack Lancement)
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
  cible_clients: string
  // Contexte de generation
  date_debut?: string // ISO date, defaut: aujourd'hui
  frequence_hebdo?: number // publications par semaine, defaut: 5
  sujets_prioritaires?: string[]
  evenements_locaux?: string[]
}

export function buildEditorialCalendarPrompt(input: EditorialCalendarInput): { system: string; user: string } {
  const dateDebut = input.date_debut || new Date().toISOString().slice(0, 10)
  const frequence = input.frequence_hebdo || 5

  const system = `Tu es un community manager expert en immobilier, specialise dans la creation de calendriers editoriaux pour des mandataires independants en France.

## Ton role
Produire un calendrier editorial de 30 jours, concret et actionnable, adapte au profil du mandataire, a sa zone geographique et a son style de communication.

## Regles absolues
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
  ].filter(Boolean).join(", ") || "Aucun reseau configure"

  const user = `Cree un calendrier editorial de 30 jours pour ce mandataire immobilier :

## Profil
- Nom : ${input.prenom} ${input.nom}
- Reseau : ${input.reseau}
- Specialite : ${input.specialite}
- Experience : ${input.nb_transactions_an} transactions/an
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement})
- Quartiers de reference : ${input.zone_geo.quartiers.join(", ") || "non precises"}
- Clients cibles : ${input.cible_clients}
- Ce qui le differencie : ${input.ce_qui_differencie}
- Valeurs : ${input.valeurs}
- Ton : ${input.ton}
- Reseaux sociaux actifs : ${reseauxSection}
${biensSection}
${evenementsSection}
${sujetsSection}

## Parametres
- Date de debut : ${dateDebut}
- Frequence : ${frequence} publications/semaine
- Duree : 30 jours

Genere exactement 30 jours de calendrier. Chaque entree doit etre unique et localisee.`

  return { system, user }
}
