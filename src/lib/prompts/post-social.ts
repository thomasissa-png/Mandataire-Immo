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
  const system = `Tu es un redacteur marketing specialise dans l'immobilier en France. Tu rediges des posts pour les reseaux sociaux de mandataires immobiliers independants.

REGLES ABSOLUES :
- Tu tutoies toujours le lecteur du post (le prospect/abonne, pas le mandataire)
- Zero jargon marketing ou technique (pas de "lead", "funnel", "ROI", "optimiser")
- Chaque post doit mentionner un element LOCAL precis : nom de quartier, rue, ecole, parc, commerce, prix au m2 reel
- Jamais de placeholder type "[inserer ici]" ou "[votre quartier]" — utilise les donnees fournies
- Pas de promesse de resultat chiffree ("double tes ventes", "+50% de mandats")
- Le ton est celui d'un professionnel passionné par sa zone, pas d'un community manager generique
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

  const user = `Genere ${input.nombre_posts} posts pour ${input.prenom} ${input.nom}, mandataire immobilier chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Specialite : ${input.specialite}
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Experience : ${input.nb_transactions_an} transactions/an
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

CONSIGNES DE GENERATION :
${plateformeInstr}
${sujetsInstr}
${historiqueInstr}
${biensAvanInstr}
${input.mois_cible ? `Mois cible pour les dates suggerees : ${input.mois_cible}.` : ''}

Varie les types de posts (bien, conseil, coulisse, local, temoignage, marche). Ne fais pas plus de 40% de posts "bien" — Sophie ne doit pas ressembler a un panneau publicitaire.
Chaque post doit inclure au moins un element hyper-local (nom de quartier, rue, commerce, ecole, parc de ${input.zone_geo.ville}).`

  return { system, user }
}
