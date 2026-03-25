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
  const system = `Tu es un specialiste du personal branding digital pour les professionnels de l'immobilier. Tu rediges des bios optimisees pour chaque plateforme, en respectant les contraintes de caracteres et les codes de chaque reseau.

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres d'experience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS ecrire un nombre d'annees d'experience different de celui fourni. Si annees_experience = ${input.annees_experience}, ecrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le reseau du client utilise un autre terme.

REGLES EDITORIALES :
- Chaque bio respecte STRICTEMENT la limite de caracteres de sa plateforme
- Tutoie le lecteur quand le format le permet (Instagram, general) — vouvoiement acceptable sur LinkedIn et Google Business si le ton du mandataire est formel
- L'IA est INVISIBLE : ces bios sont ecrites comme si ${input.prenom} les avait redigees
- Zero jargon marketing
- Chaque bio mentionne la zone geographique precise (pas "en France" mais "${input.zone_geo.ville}")
- Les bios doivent etre coherentes entre elles (meme message, adapte au format)
- Pas de liste generique de qualites ("a l'ecoute, reactif, professionnel") — utiliser des preuves concretes

CONTRAINTES PAR PLATEFORME :

**Instagram (150 caracteres max)** :
- Chaque caractere compte — aller a l'essentiel
- Format : ligne 1 = qui + ou | ligne 2 = specialite ou accroche | ligne 3 = CTA ou emoji
- Emojis acceptes (2-3 max, pertinents)
- Pas de hashtags dans la bio Instagram

**LinkedIn (300 caracteres max — section "titre")** :
- Ton plus professionnel
- Inclure : poste + reseau + zone + specialite
- Pas d'emojis (ou 1 maximum)
- Mots-cles SEO LinkedIn (visibles dans les recherches)

**Google Business (750 caracteres max)** :
- Ton expert et local
- Cible les proprietaires et acheteurs qui cherchent un professionnel
- Inclure : zone, specialite, anciennete, argument de confiance
- Pas d'emojis
- Penser SEO local : "mandataire immobilier [ville]", "estimation gratuite [ville]"

**Presentation generale (500-800 mots)** :
- Texte complet reutilisable sur site web, profil reseau, signature email longue
- Storytelling court : parcours, motivation, methode, zone d'expertise
- ${input.accroche_identitaire ? `Integrer l'accroche identitaire : "${input.accroche_identitaire}"` : 'Creer une accroche identitaire coherente avec les bios courtes'}

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
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
POSITIONNEMENT DEJA DEFINI (L1 — a respecter) :
- Accroche identitaire : "${input.accroche_identitaire}"
${input.piliers_differenciation?.length ? `- Piliers de differenciation : ${input.piliers_differenciation.join(' | ')}` : ''}`
    : ''

  const user = `Redige les 4 versions de bio pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL COMPLET :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Anciennete : ${input.annees_experience} ans
- Specialite : ${input.specialite}
- Volume : ${input.nb_transactions_an} transactions/an
- Gamme de prix : ${input.gamme_prix}
- Cible clients : ${input.cible_clients}
- Ton souhaite : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
${input.certifications?.length ? `- Certifications : ${input.certifications.join(', ')}` : ''}
${input.langues?.length ? `- Langues : ${input.langues.join(', ')}` : ''}
${input.hobbies_pro ? `- Centre d'interet pro : ${input.hobbies_pro}` : ''}
${input.histoire?.parcours_avant_immo ? `- Parcours avant l'immobilier : ${input.histoire.parcours_avant_immo}` : ''}
${input.histoire?.pourquoi_immobilier ? `- Pourquoi l'immobilier : ${input.histoire.pourquoi_immobilier}` : ''}
${input.histoire?.anecdote_memorable ? `- Anecdote memorable : ${input.histoire.anecdote_memorable}` : ''}
${biensResume}
${positionnementStr}

PRESENCE EN LIGNE ACTUELLE :
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : '- Instagram : a creer'}
${input.reseaux_sociaux.linkedin ? `- LinkedIn : ${input.reseaux_sociaux.linkedin}` : '- LinkedIn : a creer'}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : '- Site web : aucun'}

CONSIGNES :
- La bio Instagram doit IMPERATIVEMENT tenir en 150 caracteres — compte chaque caractere. Si ca depasse, raccourcis.
- La bio LinkedIn doit fonctionner comme un titre de recherche : quand quelqu'un cherche "mandataire immobilier ${input.zone_geo.ville}" sur LinkedIn, ${input.prenom} doit apparaitre
- La bio Google Business est cruciale pour le SEO local : integrer naturellement les mots-cles "mandataire immobilier ${input.zone_geo.ville}", "estimation gratuite", le nom des quartiers
- La presentation generale doit pouvoir etre utilisee telle quelle sur une page "A propos" d'un site web
- Les 4 bios doivent raconter la meme histoire, adaptee au format — pas 4 messages contradictoires
- ${input.accroche_identitaire ? `L'accroche identitaire "${input.accroche_identitaire}" doit etre integree ou adaptee dans chaque format` : 'Proposer une accroche identitaire coherente qui se decline sur les 4 formats'}`

  return { system, user }
}
