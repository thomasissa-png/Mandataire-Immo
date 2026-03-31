/**
 * Prompt — Bio optimisee multi-format (Instagram, LinkedIn, Google Business, general)
 * Utilise pour : L2 (Pack Lancement — 4 versions de bio)
 * Output : JSON avec les 4 formats de bio
 */

export interface BioMultiformatInput {
  prenom: string
  nom: string
  reseau: string
  annees_experience: number
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  nb_transactions_an: number
  gamme_prix: string
  cible_clients: string
  reseaux_sociaux: { instagram?: string; facebook?: string; linkedin?: string; site_web?: string }
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  // Issu du positionnement (L1) si deja genere
  accroche_identitaire?: string // La phrase signature de L1
  piliers_differenciation?: string[] // Les 3 piliers de L1
  // Histoire personnelle (depuis ClientContext)
  histoire?: {
    parcours_avant_immo: string
    pourquoi_immobilier: string
    anecdote_memorable: string
  }
  // Infos complementaires pour les bios
  certifications?: string[] // ex: "Certifiee negociateur immobilier"
  langues?: string[] // ex: ["Francais", "Anglais"]
  hobbies_pro?: string // ex: "Passionnee de renovation" (pertinent pour la bio)
}

export function buildBioMultiformatPrompt(input: BioMultiformatInput): {
  system: string
  user: string
} {
  const system = `Tu es un spécialiste du personal branding digital pour les professionnels de l'immobilier. Tu rédiges des bios optimisées pour chaque plateforme, en respectant les contraintes de caractères et les codes de chaque réseau.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.

RÈGLES ÉDITORIALES :
- Chaque bio respecte STRICTEMENT la limite de caractères de sa plateforme
- Tutoie le lecteur quand le format le permet (Instagram, général) — vouvoiement acceptable sur LinkedIn et Google Business si le ton du mandataire est formel
- L'IA est INVISIBLE : ces bios sont écrites comme si ${input.prenom} les avait rédigées
- Zéro jargon marketing
- Chaque bio mentionne la zone géographique précise (pas "en France" mais "${input.zone_geo.ville}")
- Les bios doivent être cohérentes entre elles (même message, adapté au format)
- Pas de liste générique de qualités ("à l'écoute, réactif, professionnel") — utiliser des preuves concrètes

CONTRAINTES PAR PLATEFORME :

**Instagram (150 caractères max)** :
- Chaque caractère compte — aller à l'essentiel
- Format : ligne 1 = qui + où | ligne 2 = spécialité ou accroche | ligne 3 = CTA ou emoji
- Emojis acceptés (2-3 max, pertinents)
- Pas de hashtags dans la bio Instagram

**LinkedIn (300 caractères max — section "titre")** :
- Ton plus professionnel
- Inclure : poste + réseau + zone + spécialité
- Pas d'emojis (ou 1 maximum)
- Mots-clés SEO LinkedIn (visibles dans les recherches)

**Google Business (750 caractères max)** :
- Ton expert et local
- Cible les propriétaires et acheteurs qui cherchent un professionnel
- Inclure : zone, spécialité, ancienneté, argument de confiance
- Pas d'emojis
- Penser SEO local : "mandataire immobilier [ville]", "estimation gratuite [ville]"

**Présentation générale (500-800 mots)** :
- Texte complet réutilisable sur site web, profil réseau, signature email longue
- Storytelling court : parcours, motivation, méthode, zone d'expertise
- ${input.accroche_identitaire ? `Intégrer l'accroche identitaire : "${input.accroche_identitaire}"` : 'Créer une accroche identitaire cohérente avec les bios courtes'}

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "bios": {
    "instagram": {
      "texte": "La bio Instagram (150 car. max)",
      "nombre_caracteres": 142
    },
    "linkedin": {
      "texte": "Le titre LinkedIn (300 car. max)",
      "nombre_caracteres": 285
    },
    "google_business": {
      "texte": "La description Google Business (750 car. max)",
      "nombre_caracteres": 620
    },
    "general": {
      "texte": "La presentation generale en Markdown (500-800 mots)",
      "nombre_mots": 650
    }
  }
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const biensResume = input.biens.length > 0
    ? `Types de biens geres : ${Array.from(new Set(input.biens.map((b) => b.type))).join(', ')}. Gamme de prix des biens actuels : ${Math.min(...input.biens.map((b) => b.prix)).toLocaleString('fr-FR')}€ - ${Math.max(...input.biens.map((b) => b.prix)).toLocaleString('fr-FR')}€.`
    : ''

  const positionnementStr = input.accroche_identitaire
    ? `
POSITIONNEMENT DÉJÀ DÉFINI (L1 — à respecter) :
- Accroche identitaire : "${input.accroche_identitaire}"
${input.piliers_differenciation?.length ? `- Piliers de différenciation : ${input.piliers_differenciation.join(' | ')}` : ''}`
    : ''

  const user = `Rédige les 4 versions de bio pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL COMPLET :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Ancienneté : ${input.annees_experience} ans
- Spécialité : ${input.specialite}
- Volume : ${input.nb_transactions_an} transactions/an
- Gamme de prix : ${input.gamme_prix}
- Cible clients : ${input.cible_clients}
- Ton souhaité : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le différencie : ${input.ce_qui_differencie}
${input.certifications?.length ? `- Certifications : ${input.certifications.join(', ')}` : ''}
${input.langues?.length ? `- Langues : ${input.langues.join(', ')}` : ''}
${input.hobbies_pro ? `- Centre d'intérêt pro : ${input.hobbies_pro}` : ''}
${input.histoire?.parcours_avant_immo ? `- Parcours avant l'immobilier : ${input.histoire.parcours_avant_immo}` : ''}
${input.histoire?.pourquoi_immobilier ? `- Pourquoi l'immobilier : ${input.histoire.pourquoi_immobilier}` : ''}
${input.histoire?.anecdote_memorable ? `- Anecdote mémorable : ${input.histoire.anecdote_memorable}` : ''}
${biensResume}
${positionnementStr}

PRESENCE EN LIGNE ACTUELLE :
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : '- Instagram : à créer'}
${input.reseaux_sociaux.linkedin ? `- LinkedIn : ${input.reseaux_sociaux.linkedin}` : '- LinkedIn : à créer'}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : '- Site web : aucun'}

CONSIGNES :
- La bio Instagram doit IMPÉRATIVEMENT tenir en 150 caractères — compte chaque caractère. Si ça dépasse, raccourcis.
- La bio LinkedIn doit fonctionner comme un titre de recherche : quand quelqu'un cherche "mandataire immobilier ${input.zone_geo.ville}" sur LinkedIn, ${input.prenom} doit apparaître
- La bio Google Business est cruciale pour le SEO local : intégrer naturellement les mots-clés "mandataire immobilier ${input.zone_geo.ville}", "estimation gratuite", le nom des quartiers
- La présentation générale doit pouvoir être utilisée telle quelle sur une page "À propos" d'un site web
- Les 4 bios doivent raconter la même histoire, adaptée au format — pas 4 messages contradictoires
- ${input.accroche_identitaire ? `L'accroche identitaire "${input.accroche_identitaire}" doit être intégrée ou adaptée dans chaque format` : 'Proposer une accroche identitaire cohérente qui se décline sur les 4 formats'}`

  return { system, user }
}
