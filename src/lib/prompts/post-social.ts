/**
 * Prompt — Posts reseaux sociaux (Instagram, Facebook, LinkedIn)
 * Utilise pour : L6 (20 posts Pack Lancement), M1 (12 posts/mois Pack Mensuel), B2 (3 posts Boost)
 * Output : JSON array de posts prets a publier
 */

export interface PostSocialInput {
  prenom: string
  nom: string
  reseau: string
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  annees_experience: number
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
  gamme_prix: string
  cible_clients: string
  // Donnees locales enrichies (depuis onboarding)
  donnees_locales?: {
    prix_m2_moyen: number
    commerces: string[]
    ecoles: string[]
    transports: string[]
    ambiance_quartier: string
  }
  // Contexte de generation
  plateforme: 'instagram' | 'facebook' | 'linkedin' | 'mix'
  nombre_posts: number
  sujets_prioritaires?: string[]
  biens_a_mettre_en_avant?: number[] // index dans le tableau biens
  mois_cible?: string // ex: "avril 2026"
  historique_sujets?: string[] // pour eviter les repetitions
}

export function buildPostSocialPrompt(input: PostSocialInput): {
  system: string
  user: string
} {
  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.commerces.length > 0 || input.donnees_locales.ecoles.length > 0 || input.donnees_locales.transports.length > 0)

  const system = `Tu es un redacteur marketing specialise dans l'immobilier en France. Tu rediges des posts pour les reseaux sociaux de mandataires immobiliers independants.

## Regles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, ecoles, restaurants, marches ou lieux qui ne sont pas dans les donnees fournies. Si les donnees locales detaillees ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de details specifiques.
- NE JAMAIS inventer de chiffres d'experience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS ecrire un nombre d'annees d'experience different de celui fourni. Si annees_experience = ${input.annees_experience}, ecrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'annee courante est 2026. Ne jamais mentionner 2024 ou 2025 comme annee courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le reseau du client utilise un autre terme.
- Les hashtags ne doivent contenir aucune espace. Ecrire '#SophieImmoAngers' et non '#Sophie ImmoAngers'. Pas de caractere special ni espace dans un hashtag.
- VARIATION PRIX : ne pas citer le prix au m2 exact dans chaque post. Varier les formulations : "autour de X", "entre X et Y", ou ne pas mentionner le prix du tout. Maximum 1 post sur 3 peut citer un chiffre de prix.

REGLES EDITORIALES :
- Tu tutoies toujours le lecteur du post (le prospect/abonne, pas le mandataire)
- Zero jargon marketing ou technique (pas de "lead", "funnel", "ROI", "optimiser")
- Chaque post doit mentionner un element LOCAL precis : nom de quartier, rue, ecole, parc, commerce, prix au m2 reel — UNIQUEMENT s'il est present dans les donnees fournies
- Jamais de placeholder type "[inserer ici]" ou "[votre quartier]" — utilise les donnees fournies
- Pas de promesse de resultat chiffree ("double tes ventes", "+50% de mandats")
- Le ton est celui d'un professionnel passionne par sa zone, pas d'un community manager generique
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Les posts doivent donner envie de contacter ${input.prenom}, pas juste de liker

FORMATS PAR PLATEFORME :
- Instagram : 5-15 lignes, emojis moderees (2-4 max), hashtags pertinents (8-15), brief visuel en commentaire
- Facebook : 5-20 lignes, ton conversationnel, question en fin de post, 3-5 hashtags max
- LinkedIn : 8-20 lignes, ton expert, chiffres marche local, 3-5 hashtags pro

TYPES DE POSTS A ALTERNER :
1. Mise en avant d'un bien (storytelling quartier + projection de vie)
2. Conseil acheteur/vendeur (tip concret et actionnable)
3. Coulisse du metier (visite, estimation, signature — humaniser)
4. Connaissance locale (histoire du quartier, evolution des prix, nouveau commerce)
5. Temoignage/resultat (vente reussie, satisfaction client — sans chiffre invente)
6. Actualite marche local (tendance prix, taux, saisonnalite)

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres. Format :
{
  "posts": [
    {
      "plateforme": "instagram" | "facebook" | "linkedin",
      "type": "bien" | "conseil" | "coulisse" | "local" | "temoignage" | "marche",
      "texte": "Le texte complet du post, pret a copier-coller",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "brief_visuel": "Description de la photo/visuel ideal pour accompagner le post",
      "date_suggeree": "YYYY-MM-DD ou null",
      "hook": "La premiere phrase du post (pour validation rapide)"
    }
  ]
}`

  const biensStr = input.biens
    .map(
      (b, i) =>
        `Bien ${i + 1}: ${b.titre} — ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pieces. Points forts: ${b.points_forts}`
    )
    .join('\n')

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const plateformeInstr =
    input.plateforme === 'mix'
      ? `Repartis les posts entre Instagram, Facebook et LinkedIn de maniere equilibree.`
      : `Tous les posts sont pour ${input.plateforme}.`

  const sujetsInstr = input.sujets_prioritaires?.length
    ? `Sujets prioritaires a traiter : ${input.sujets_prioritaires.join(', ')}.`
    : ''

  const historiqueInstr = input.historique_sujets?.length
    ? `Sujets deja traites recemment (a ne pas repeter) : ${input.historique_sujets.join(', ')}.`
    : ''

  const biensAvanInstr =
    input.biens_a_mettre_en_avant?.length
      ? `Biens a mettre en avant en priorite : ${input.biens_a_mettre_en_avant.map((i) => input.biens[i]?.titre || `Bien ${i + 1}`).join(', ')}.`
      : ''

  const donneesLocalesStr = donneesLocalesDisponibles
    ? `
DONNEES LOCALES VERIFIEES (utilise UNIQUEMENT ces references, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m2 : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}EUR` : ''}
${input.donnees_locales!.commerces.length > 0 ? `- Commerces de reference : ${input.donnees_locales!.commerces.join(', ')}` : ''}
${input.donnees_locales!.ecoles.length > 0 ? `- Ecoles de reference : ${input.donnees_locales!.ecoles.join(', ')}` : ''}
${input.donnees_locales!.transports.length > 0 ? `- Transports : ${input.donnees_locales!.transports.join(', ')}` : ''}
${input.donnees_locales!.ambiance_quartier ? `- Ambiance quartier : ${input.donnees_locales!.ambiance_quartier}` : ''}`
    : `
DONNEES LOCALES : non disponibles. Rester general sur les references locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, ecoles, arrets de transport ou marches.`

  const user = `Genere ${input.nombre_posts} posts pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Specialite : ${input.specialite}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Annees d'experience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais ecrire un autre nombre)
- Volume : ${input.nb_transactions_an} transactions/an
- Gamme de prix : ${input.gamme_prix}
- Cible clients : ${input.cible_clients}
- Ton souhaite : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : ''}
${input.reseaux_sociaux.facebook ? `- Facebook : ${input.reseaux_sociaux.facebook}` : ''}
${input.reseaux_sociaux.linkedin ? `- LinkedIn : ${input.reseaux_sociaux.linkedin}` : ''}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}

BIENS EN COURS :
${biensStr || 'Aucun bien actif — concentre les posts sur les conseils, le local et le marche.'}
${donneesLocalesStr}

CONSIGNES DE GENERATION :
${plateformeInstr}
${sujetsInstr}
${historiqueInstr}
${biensAvanInstr}
${input.mois_cible ? `Mois cible pour les dates suggerees : ${input.mois_cible}.` : ''}

Varie les types de posts (bien, conseil, coulisse, local, temoignage, marche). Ne fais pas plus de 40% de posts "bien" — ${input.prenom} ne doit pas ressembler a un panneau publicitaire.
Chaque post doit inclure au moins un element hyper-local (nom de quartier, rue, commerce, ecole, parc de ${input.zone_geo.ville}) — UNIQUEMENT si cette information est presente dans les donnees locales ci-dessus ou dans la zone_geo. NE RIEN INVENTER.`

  return { system, user }
}
