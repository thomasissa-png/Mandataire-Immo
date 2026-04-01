/**
 * Prompt — Articles SEO local (900-1200 mots)
 * Utilise pour : L4 (5 articles Pack Lancement), M3 (4 articles/mois Pack Mensuel — 1/semaine)
 * Output : JSON avec Markdown + frontmatter SEO
 */

export interface ArticleSeoInput {
  prenom: string
  nom: string
  reseau: string
  specialite: string
  annees_experience: number
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  nb_transactions_an: number
  gamme_prix: string
  cible_clients: string
  reseaux_sociaux: { instagram?: string; facebook?: string; linkedin?: string; site_web?: string }
  // SEO specifique
  mots_cles_cibles?: string[]
  articles_deja_rediges?: string[] // titres des articles existants pour eviter doublons
  nombre_articles: number
  // Format : "blog" (900-1200 mots, defaut) ou "linkedin" (400-600 mots, pour mandataires sans site web)
  format?: 'blog' | 'linkedin'
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
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  mois_cible?: string
}

export function buildArticleSeoPrompt(input: ArticleSeoInput): {
  system: string
  user: string
} {
  const isLinkedin = input.format === 'linkedin'
  const wordRange = isLinkedin ? '400 et 600' : '900 et 1200'

  const system = `Tu es un rédacteur SEO spécialisé dans l'immobilier local en France. Tu rédiges des ${isLinkedin ? 'articles courts pour LinkedIn' : 'articles de blog optimisés pour le référencement naturel'}, destinés à positionner un mandataire immobilier ${isLinkedin ? 'comme expert local sur LinkedIn' : 'en première page Google sur des requêtes locales'}.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.
- VARIATION PRIX : ne pas citer le prix au m2 exact à chaque paragraphe. Varier entre fourchettes, tendances qualitatives ("quartier accessible", "en hausse"), et références sans chiffre. Maximum 2 mentions chiffrées du prix/m2 par article.

RÈGLES ÉDITORIALES :
- Chaque article fait entre ${wordRange} mots${isLinkedin ? ' — format LinkedIn, pas de frontmatter SEO' : ' — assez long pour le SEO, assez concis pour être lu'}
- Le mot-clé principal doit apparaître dans le titre H1, le premier paragraphe, au moins 2 sous-titres H2, et dans la meta description
- Densité de mots-clés naturelle : 1-2% max. Pas de keyword stuffing
- Chaque article DOIT contenir des données locales réelles : prix au m2, noms de quartiers, écoles, transports, commerces
- Tutoie le lecteur (l'acheteur ou vendeur potentiel)
- Le ton est expert mais accessible — un pro qui partage son savoir, pas un cours magistral
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Zéro jargon marketing (pas de "optimiser votre investissement", "maximiser votre ROI")
- Pas de promesse de résultat chiffrée
- Inclure un appel à l'action naturel vers ${input.prenom} en fin d'article
- Le maillage interne est préparé : suggérer 2-3 liens internes vers d'autres articles potentiels

TYPES D'ARTICLES À PRODUIRE (varier) :
1. Guide quartier : "Vivre à [quartier] : le guide complet pour s'installer"
2. Guide vendeur : "Vendre son appartement à [ville] : les étapes clés"
3. Guide acheteur : "Acheter à [quartier] : ce que les annonces ne disent pas"
4. Marché local : "Prix immobilier à [ville] en [année] : analyse quartier par quartier"
5. Conseil pratique : "Première visite à [ville] : 7 choses à vérifier avant de signer"
6. Comparatif quartiers : "[Quartier A] vs [Quartier B] : où acheter à [ville] ?"

STRUCTURE DE CHAQUE ARTICLE :
1. **Frontmatter** : title, meta_description (155 car. max), slug, mot_cle_principal, mots_cles_secondaires
2. **Introduction** (100-150 mots) : accroche concrète, promesse de l'article, mot-clé dans les 2 premières phrases
3. **Corps** (600-800 mots) : 3-5 sections H2, chacune avec un angle précis, des données locales, des conseils actionnables
4. **Conclusion + CTA** (100-150 mots) : résumé des points clés, appel à l'action vers ${input.prenom}
5. **Liens internes suggérés** : 2-3 titres d'articles complémentaires

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "articles": [
    {
      "frontmatter": {
        "title": "Titre H1 optimisé SEO (50-65 caractères)",
        "meta_description": "Meta description (max 155 caractères)",
        "slug": "slug-url-optimisé",
        "mot_cle_principal": "requête cible principale",
        "mots_cles_secondaires": ["requête 2", "requête 3"]
      },
      "contenu_markdown": "Article complet en Markdown avec titres H2/H3",
      "liens_internes_suggeres": ["Titre article lié 1", "Titre article lié 2"],
      "nombre_mots": 1050
    }
  ]
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const motsClesStr = input.mots_cles_cibles?.length
    ? `Mots-clés cibles fournis : ${input.mots_cles_cibles.join(', ')}.`
    : `Génère des mots-clés pertinents basés sur : "mandataire immobilier ${input.zone_geo.ville}", "vendre appartement ${input.zone_geo.ville}", "acheter maison ${input.zone_geo.quartiers[0] || input.zone_geo.ville}", "prix immobilier ${input.zone_geo.ville}", "estimation gratuite ${input.zone_geo.ville}".`

  const articlesExistantsStr = input.articles_deja_rediges?.length
    ? `Articles déjà publiés (ne pas refaire les mêmes sujets) : ${input.articles_deja_rediges.join(', ')}.`
    : ''

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.dernieres_transactions?.length)

  const donneesLocales = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES (utilise UNIQUEMENT ces références, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.dernieres_transactions?.length ? `- Dernières transactions DVF : ${input.donnees_locales!.dernieres_transactions.slice(0, 3).map(t => `${t.type} ${t.surface}m² à ${t.prix_m2}€/m²`).join(', ')}` : ''}`
    : `
DONNÉES LOCALES : non disponibles. Rester général sur les références locales (nom de ville et quartier uniquement). NE PAS inventer de noms de commerces, écoles, arrêts de transport ou marchés.`

  const biensStr = input.biens.length > 0
    ? input.biens
        .map(
          (b) =>
            `- ${b.titre} : ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pièces`
        )
        .join('\n')
    : 'Aucun bien actif.'

  const user = `Rédige ${input.nombre_articles} ${isLinkedin ? 'article(s) LinkedIn (400-600 mots)' : 'article(s) SEO local (900-1200 mots)'} pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Spécialité : ${input.specialite}
- Années d'expérience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais écrire un autre nombre)
- Volume : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le différencie : ${input.ce_qui_differencie}
- Cible clients : ${input.cible_clients}
- Gamme de prix : ${input.gamme_prix}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}

BIENS EN COURS (pour exemples concrets dans les articles) :
${biensStr}
${donneesLocales}

CONSIGNES SEO :
${motsClesStr}
${articlesExistantsStr}
${input.mois_cible ? `Mois de publication cible : ${input.mois_cible} — adapter les références saisonnières.` : ''}

- Varie les types d'articles (guide quartier, guide vendeur, guide acheteur, marché local, conseil pratique)
- Chaque article doit cibler une requête longue traîne différente
- Utilise des données locales précises — pas de "proche commerces" mais le nom du commerce — UNIQUEMENT si ces noms sont dans les données locales ci-dessus. NE RIEN INVENTER.
- L'article doit apporter une vraie valeur au lecteur, pas juste du remplissage SEO
- Le CTA en fin d'article doit être naturel : ${input.prenom} est présenté(e) comme l'expert(e) local(e) à contacter
- L'année courante est 2026. Toute référence temporelle doit utiliser 2026, jamais 2024 ou 2025.`

  return { system, user }
}
