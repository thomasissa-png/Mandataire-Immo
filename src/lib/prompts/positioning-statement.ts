/**
 * Prompt — Positionnement + proposition de valeur personnalisee
 * Utilise pour : L1 (Pack Lancement — premier livrable, fondation de tous les autres)
 * Output : JSON avec Markdown structure
 */

export interface PositioningStatementInput {
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
  // Contexte supplementaire pour le positionnement (depuis ClientContext.histoire)
  histoire?: {
    parcours_avant_immo: string
    pourquoi_immobilier: string
    anecdote_memorable: string
  }
  // Legacy fields (retrocompatibilite)
  parcours_avant_immo?: string // ex: "10 ans assistante de direction"
  pourquoi_immobilier?: string // ex: "Passion pour l'habitat, envie de liberte"
  anecdote_memorable?: string // ex: "Ma premiere vente, c'etait..."
  donnees_locales?: {
    prix_m2_moyen?: number
    tendance_marche?: string
    population?: number
    concurrents_locaux?: string[] // noms d'agences/mandataires connus dans la zone
  }
}

export function buildPositioningStatementPrompt(input: PositioningStatementInput): {
  system: string
  user: string
} {
  const system = `Tu es un stratégiste en personal branding spécialisé dans l'immobilier. Tu crées des documents de positionnement pour des mandataires immobiliers indépendants. Ce document est la FONDATION de toute leur communication — il sert de référence pour tous les contenus futurs (posts, articles, annonces, bio).

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.

RÈGLES ÉDITORIALES :
- Le positionnement doit être UNIQUE à ce mandataire — pas un template avec des variables changées
- Chaque phrase doit pouvoir être dite à voix haute par ${input.prenom} sans que ça sonne faux
- Le ton est déterminé par le profil du mandataire (pas par toi)
- L'IA est INVISIBLE : le document est écrit comme si un stratégiste humain l'avait rédigé après un entretien approfondi
- Zéro jargon marketing : pas de "proposition de valeur", "positionnement", "personal branding" DANS le contenu produit (ces mots sont dans la structure, pas dans les textes à réutiliser)
- Les différenciateurs doivent être RÉELS et VÉRIFIABLES, pas des platitudes ("à l'écoute", "professionnel")
- Ancrer le positionnement dans la zone géographique — ${input.prenom} n'est pas "un bon mandataire", c'est "LA référence immobilière de [quartier]"
- Le document doit être directement réutilisable par les autres prompts (posts, bio, articles)

STRUCTURE DU DOCUMENT :

1. **Accroche identitaire** (1-2 phrases)
   La phrase que ${input.prenom} met en signature email, en bio, en intro de présentation. Maximum 25 mots. Doit contenir : qui + où + pour qui.

2. **Proposition de valeur** (3-5 phrases)
   Pourquoi un vendeur ou acheteur à ${input.zone_geo.ville} devrait choisir ${input.prenom} plutôt qu'un autre. Concret, pas de bullshit.

3. **Les 3 piliers de différenciation**
   Trois arguments concrets et uniques. Chaque pilier = un titre court + 2-3 phrases d'explication avec exemples.

4. **Histoire personnelle** (100-150 mots)
   Le parcours de ${input.prenom} raconté en mode storytelling — de l'avant-immobilier à aujourd'hui. Ce qui l'a amenée ici, ce qui la motive, ce qui la rend crédible. Pas un CV, une histoire.

5. **Profil type des clients idéaux** (50-80 mots)
   Qui sont les clients que ${input.prenom} sert le mieux ? Type de projet, profil, attentes.

6. **Tonalité de communication recommandée**
   3-4 adjectifs avec explication + exemples de phrases types à utiliser et à éviter.

7. **Mots-clés identitaires** (liste de 10-15 mots)
   Les mots que ${input.prenom} doit utiliser régulièrement dans sa communication pour construire sa marque personnelle.

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "positionnement": {
    "accroche_identitaire": "La phrase signature (max 25 mots)",
    "proposition_valeur": "3-5 phrases de proposition de valeur",
    "piliers_differenciation": [
      {
        "titre": "Titre court du pilier",
        "explication": "2-3 phrases avec exemples concrets"
      }
    ],
    "histoire_personnelle": "Le storytelling du parcours (100-150 mots)",
    "clients_ideaux": "Description du profil client ideal (50-80 mots)",
    "tonalite": {
      "adjectifs": ["adjectif1", "adjectif2", "adjectif3"],
      "phrases_a_utiliser": ["exemple 1", "exemple 2"],
      "phrases_a_eviter": ["anti-exemple 1", "anti-exemple 2"]
    },
    "mots_cles_identitaires": ["mot1", "mot2"],
    "document_complet_markdown": "Le document complet formaté en Markdown, prêt à être lu comme un livrable autonome"
  }
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const biensStr = input.biens.length > 0
    ? input.biens
        .map(
          (b) =>
            `- ${b.type} a ${b.adresse} (${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m²)`
        )
        .join('\n')
    : 'Aucun bien actif actuellement.'

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.tendance_marche || input.donnees_locales.population || input.donnees_locales.concurrents_locaux?.length)

  const donneesLocales = donneesLocalesDisponibles
    ? `
CONTEXTE LOCAL VÉRIFIÉ (utilise UNIQUEMENT ces données, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² à ${input.zone_geo.ville} : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.tendance_marche ? `- Tendance du marché : ${input.donnees_locales!.tendance_marche}` : ''}
${input.donnees_locales!.population ? `- Population : ${input.donnees_locales!.population.toLocaleString('fr-FR')} hab.` : ''}
${input.donnees_locales!.concurrents_locaux?.length ? `- Concurrents locaux connus (pour calibration INTERNE uniquement — NE JAMAIS citer ces noms dans le document final) : ${input.donnees_locales!.concurrents_locaux.join(', ')}` : ''}`
    : `
CONTEXTE LOCAL : données détaillées non disponibles. Ancrer le positionnement sur le nom de ville et quartiers fournis dans zone_geo. NE PAS inventer de prix m2, de concurrents ou de données démographiques.`

  const user = `Crée le document de positionnement pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL COMPLET :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers de référence : ${quartiersStr}
- Ancienneté : ${input.annees_experience} ans dans l'immobilier
- Spécialité : ${input.specialite}
- Volume : ${input.nb_transactions_an} transactions/an
- Gamme de prix : ${input.gamme_prix}
- Cible clients : ${input.cible_clients}
- Ton souhaité : ${input.ton}
- Valeurs déclarées : ${input.valeurs}
- Ce qui la/le différencie (ses propres mots) : ${input.ce_qui_differencie}
${input.histoire?.parcours_avant_immo || input.parcours_avant_immo ? `- Parcours avant l'immobilier : ${input.histoire?.parcours_avant_immo || input.parcours_avant_immo}` : ''}
${input.histoire?.pourquoi_immobilier || input.pourquoi_immobilier ? `- Pourquoi l'immobilier : ${input.histoire?.pourquoi_immobilier || input.pourquoi_immobilier}` : ''}
${input.histoire?.anecdote_memorable || input.anecdote_memorable ? `- Anecdote mémorable : ${input.histoire?.anecdote_memorable || input.anecdote_memorable}` : ''}

BIENS ACTUELS (donne une idée de son activité) :
${biensStr}

PRÉSENCE EN LIGNE :
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : '- Instagram : aucun'}
${input.reseaux_sociaux.facebook ? `- Facebook : ${input.reseaux_sociaux.facebook}` : '- Facebook : aucun'}
${input.reseaux_sociaux.linkedin ? `- LinkedIn : ${input.reseaux_sociaux.linkedin}` : '- LinkedIn : aucun'}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : '- Site web : aucun'}
${donneesLocales}

CONSIGNES :
- Le positionnement doit ancrer ${input.prenom} comme référence locale à ${input.zone_geo.ville}, spécifiquement sur les quartiers ${quartiersStr}
- Si le parcours avant l'immobilier est fourni, l'intégrer dans l'histoire personnelle comme une force (les compétences transférables)
- Les piliers de différenciation doivent être CONCRETS : pas "proche de ses clients" mais "répond à chaque appel en moins de 2h, même le dimanche" (si c'est vrai selon le profil)
- L'accroche identitaire sera réutilisée dans la bio (L2), les posts (L6/M1), et les articles (L4/M3) — elle doit être mémorable et répétable
- Le document Markdown complet doit être livrable tel quel au client comme premier livrable du Pack Lancement`

  return { system, user }
}
