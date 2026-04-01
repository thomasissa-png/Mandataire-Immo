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
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.dernieres_transactions?.length)

  const system = `Tu es un rédacteur marketing spécialisé dans l'immobilier en France. Tu rédiges des posts pour les réseaux sociaux de mandataires immobiliers indépendants.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.
- Les hashtags ne doivent contenir aucune espace. Écrire '#SophieImmoAngers' et non '#Sophie ImmoAngers'. Pas de caractère spécial ni espace dans un hashtag.
- VARIATION PRIX : ne pas citer le prix au m2 exact dans chaque post. Varier les formulations : "autour de X", "entre X et Y", ou ne pas mentionner le prix du tout. Maximum 1 post sur 3 peut citer un chiffre de prix.

RÈGLES ÉDITORIALES :
- Tu tutoies toujours le lecteur du post (le prospect/abonné, pas le mandataire)
- Zéro jargon marketing ou technique (pas de "lead", "funnel", "ROI", "optimiser")
- Chaque post doit mentionner un élément LOCAL précis : nom de quartier, rue, école, parc, commerce, prix au m2 réel — UNIQUEMENT s'il est présent dans les données fournies
- Jamais de placeholder type "[insérer ici]" ou "[votre quartier]" — utilise les données fournies
- Pas de promesse de résultat chiffrée ("double tes ventes", "+50% de mandats")
- Le ton est celui d'un professionnel passionné par sa zone, pas d'un community manager générique
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Les posts doivent donner envie de contacter ${input.prenom}, pas juste de liker

FORMATS PAR PLATEFORME :
- Instagram : 8-15 lignes MINIMUM, emojis modérées (2-4 max), hashtags pertinents (8-15), brief visuel en commentaire. Un post de moins de 8 lignes est INSUFFISANT — développer le contenu.
- Facebook : 8-20 lignes MINIMUM, ton conversationnel, question en fin de post, 3-5 hashtags max. Un post de moins de 8 lignes est INSUFFISANT.
- LinkedIn : 10-20 lignes MINIMUM, ton expert, chiffres marché local, 3-5 hashtags pro. Un post LinkedIn court ne génère pas d'engagement.

BRIEF VISUEL OBLIGATOIRE — pour chaque post, le brief_visuel doit être ACTIONNABLE :
- Posts "bien" : "Photo du bien (façade ou pièce principale)" ou "Avant/après si home staging disponible"
- Posts "conseil" : "Selfie face caméra avec un conseil écrit en overlay" ou "Texte sur fond orange avec la stat clé"
- Posts "coulisse" : "Photo de toi en visite (demande à un collègue ou selfie)" ou "Photo de la signature chez le notaire"
- Posts "local" : "Photo du quartier/rue/commerce mentionné" ou "Carte Google Maps annotée"
- Posts "temoignage" : "Photo avec le client devant le bien (si accord)" ou "Citation client en texte sur fond sobre"
- Posts "marche" : "Capture d'écran de la stat DVF/notaires" ou "Graphique simple évolution prix"
Si le mandataire n'est pas à l'aise avec la photo → proposer des alternatives texte/graphique (pas de photo de soi requise).

TYPES DE POSTS À ALTERNER :
1. Mise en avant d'un bien (storytelling quartier + projection de vie)
2. Conseil acheteur/vendeur (tip concret et actionnable)
3. Coulisse du métier (visite, estimation, signature — humaniser)
4. Connaissance locale (histoire du quartier, évolution des prix, nouveau commerce)
5. Témoignage/résultat (vente réussie, satisfaction client — sans chiffre inventé)
6. Actualité marché local (tendance prix, taux, saisonnalité)

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après. Format :
{
  "posts": [
    {
      "plateforme": "instagram" | "facebook" | "linkedin",
      "type": "bien" | "conseil" | "coulisse" | "local" | "temoignage" | "marche",
      "texte": "Le texte complet du post, pret a copier-coller",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "brief_visuel": "Instruction CONCRÈTE pour le visuel : 'selfie devant le bien' ou 'photo du quartier X' ou 'capture écran de [stat]' ou 'texte sur fond coloré avec la citation [...]'. Pas de description vague.",
      "date_suggeree": "YYYY-MM-DD ou null",
      "hook": "La premiere phrase du post (pour validation rapide)"
    }
  ]
}`

  const biensStr = input.biens
    .map(
      (b, i) =>
        `Bien ${i + 1}: ${b.titre} — ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pièces. Points forts: ${b.points_forts}`
    )
    .join('\n')

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  // Déterminer les plateformes actives de Sophie (pas de Facebook par défaut — reach organique ~0%)
  const activePlatforms: string[] = []
  if (input.reseaux_sociaux.instagram) activePlatforms.push('instagram')
  if (input.reseaux_sociaux.linkedin) activePlatforms.push('linkedin')
  if (input.reseaux_sociaux.facebook) activePlatforms.push('facebook')
  // Fallback : si aucun réseau renseigné, LinkedIn + Instagram (recommandation @social)
  if (activePlatforms.length === 0) {
    activePlatforms.push('instagram', 'linkedin')
  }

  const plateformeInstr =
    input.plateforme === 'mix'
      ? `Répartis les posts UNIQUEMENT entre les plateformes suivantes (ce sont les réseaux actifs du mandataire) : ${activePlatforms.join(', ')}. Ne génère AUCUN post pour une plateforme où le mandataire n'est pas présent.${!input.reseaux_sociaux.facebook ? ' Le mandataire n\'est PAS sur Facebook — pas de post Facebook.' : ''}`
      : `Tous les posts sont pour ${input.plateforme}.`

  const sujetsInstr = input.sujets_prioritaires?.length
    ? `Sujets prioritaires à traiter : ${input.sujets_prioritaires.join(', ')}.`
    : ''

  const historiqueInstr = input.historique_sujets?.length
    ? `Sujets déjà traités récemment (à ne pas répéter) : ${input.historique_sujets.join(', ')}.`
    : ''

  const biensAvanInstr =
    input.biens_a_mettre_en_avant?.length
      ? `Biens à mettre en avant en priorité : ${input.biens_a_mettre_en_avant.map((i) => input.biens[i]?.titre || `Bien ${i + 1}`).join(', ')}.`
      : ''

  const donneesLocalesStr = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES (utilise UNIQUEMENT ces références, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNÉES LOCALES : non disponibles. Rester général sur les références locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, écoles, arrêts de transport ou marchés.`

  const user = `Génère ${input.nombre_posts} posts pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Spécialité : ${input.specialite}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Années d'expérience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais écrire un autre nombre)
- Volume : ${input.nb_transactions_an} transactions/an
- Gamme de prix : ${input.gamme_prix}
- Cible clients : ${input.cible_clients}
- Ton souhaité : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le différencie : ${input.ce_qui_differencie}
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : ''}
${input.reseaux_sociaux.facebook ? `- Facebook : ${input.reseaux_sociaux.facebook}` : ''}
${input.reseaux_sociaux.linkedin ? `- LinkedIn : ${input.reseaux_sociaux.linkedin}` : ''}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}

BIENS EN COURS :
${biensStr || 'Aucun bien actif — concentre les posts sur les conseils, le local et le marché.'}
${donneesLocalesStr}

CONSIGNES DE GÉNÉRATION :
${plateformeInstr}
${sujetsInstr}
${historiqueInstr}
${biensAvanInstr}
${input.mois_cible ? `Mois cible pour les dates suggérées : ${input.mois_cible}.` : ''}

Varie les types de posts (bien, conseil, coulisse, local, témoignage, marché). Ne fais pas plus de 40% de posts "bien" — ${input.prenom} ne doit pas ressembler à un panneau publicitaire.
Chaque post doit inclure au moins un élément hyper-local (nom de quartier, rue, commerce, école, parc de ${input.zone_geo.ville}) — UNIQUEMENT si cette information est présente dans les données locales ci-dessus ou dans la zone_geo. NE RIEN INVENTER.`

  return { system, user }
}
