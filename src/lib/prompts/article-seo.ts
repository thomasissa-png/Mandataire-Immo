/**
 * Prompt — Articles SEO local (900-1200 mots)
 * Utilise pour : L4 (5 articles Pack Lancement), M3 (2 articles/mois Pack Mensuel)
 * Output : JSON avec Markdown + frontmatter SEO
 */

export interface ArticleSeoInput {
  prenom: string
  nom: string
  reseau: string
  specialite: string
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
  // Donnees locales pour enrichir
  donnees_locales?: {
    prix_m2_moyen?: number
    ecoles?: string[]
    transports?: string[]
    commerces?: string[]
    parcs?: string[]
    tendance_marche?: string
    population?: number
    evenements_locaux?: string[]
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
  const system = `Tu es un redacteur SEO specialise dans l'immobilier local en France. Tu rediges des articles de blog optimises pour le referencement naturel, destines a positionner un mandataire immobilier en premiere page Google sur des requetes locales.

REGLES ABSOLUES :
- Chaque article fait entre 900 et 1200 mots — assez long pour le SEO, assez concis pour etre lu
- Le mot-cle principal doit apparaitre dans le titre H1, le premier paragraphe, au moins 2 sous-titres H2, et dans la meta description
- Densite de mots-cles naturelle : 1-2% max. Pas de keyword stuffing
- Chaque article DOIT contenir des donnees locales reelles : prix au m2, noms de quartiers, ecoles, transports, commerces
- Tutoie le lecteur (l'acheteur ou vendeur potentiel)
- Le ton est expert mais accessible — un pro qui partage son savoir, pas un cours magistral
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Zero jargon marketing (pas de "optimiser votre investissement", "maximiser votre ROI")
- Pas de promesse de resultat chiffree
- Inclure un appel a l'action naturel vers ${input.prenom} en fin d'article
- Le maillage interne est prepare : suggerer 2-3 liens internes vers d'autres articles potentiels

TYPES D'ARTICLES A PRODUIRE (varier) :
1. Guide quartier : "Vivre a [quartier] : le guide complet pour s'installer"
2. Guide vendeur : "Vendre son appartement a [ville] : les etapes cles"
3. Guide acheteur : "Acheter a [quartier] : ce que les annonces ne disent pas"
4. Marche local : "Prix immobilier a [ville] en [annee] : analyse quartier par quartier"
5. Conseil pratique : "Premiere visite a [ville] : 7 choses a verifier avant de signer"
6. Comparatif quartiers : "[Quartier A] vs [Quartier B] : ou acheter a [ville] ?"

STRUCTURE DE CHAQUE ARTICLE :
1. **Frontmatter** : title, meta_description (155 car. max), slug, mot_cle_principal, mots_cles_secondaires
2. **Introduction** (100-150 mots) : accroche concrete, promesse de l'article, mot-cle dans les 2 premieres phrases
3. **Corps** (600-800 mots) : 3-5 sections H2, chacune avec un angle precis, des donnees locales, des conseils actionnables
4. **Conclusion + CTA** (100-150 mots) : resume des points cles, appel a l'action vers ${input.prenom}
5. **Liens internes suggeres** : 2-3 titres d'articles complementaires

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
{
  "articles": [
    {
      "frontmatter": {
        "title": "Titre H1 optimise SEO (50-65 caracteres)",
        "meta_description": "Meta description (max 155 caracteres)",
        "slug": "slug-url-optimise",
        "mot_cle_principal": "requete cible principale",
        "mots_cles_secondaires": ["requete 2", "requete 3"]
      },
      "contenu_markdown": "Article complet en Markdown avec titres H2/H3",
      "liens_internes_suggeres": ["Titre article lie 1", "Titre article lie 2"],
      "nombre_mots": 1050
    }
  ]
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const motsClesStr = input.mots_cles_cibles?.length
    ? `Mots-cles cibles fournis : ${input.mots_cles_cibles.join(', ')}.`
    : `Genere des mots-cles pertinents bases sur : "mandataire immobilier ${input.zone_geo.ville}", "vendre appartement ${input.zone_geo.ville}", "acheter maison ${input.zone_geo.quartiers[0] || input.zone_geo.ville}", "prix immobilier ${input.zone_geo.ville}", "estimation gratuite ${input.zone_geo.ville}".`

  const articlesExistantsStr = input.articles_deja_rediges?.length
    ? `Articles deja publies (ne pas refaire les memes sujets) : ${input.articles_deja_rediges.join(', ')}.`
    : ''

  const donneesLocales = input.donnees_locales
    ? `
DONNEES LOCALES (a integrer dans les articles) :
${input.donnees_locales.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales.ecoles?.length ? `- Ecoles : ${input.donnees_locales.ecoles.join(', ')}` : ''}
${input.donnees_locales.transports?.length ? `- Transports : ${input.donnees_locales.transports.join(', ')}` : ''}
${input.donnees_locales.commerces?.length ? `- Commerces : ${input.donnees_locales.commerces.join(', ')}` : ''}
${input.donnees_locales.parcs?.length ? `- Parcs : ${input.donnees_locales.parcs.join(', ')}` : ''}
${input.donnees_locales.tendance_marche ? `- Tendance du marche : ${input.donnees_locales.tendance_marche}` : ''}
${input.donnees_locales.population ? `- Population : ${input.donnees_locales.population.toLocaleString('fr-FR')} habitants` : ''}
${input.donnees_locales.evenements_locaux?.length ? `- Evenements locaux : ${input.donnees_locales.evenements_locaux.join(', ')}` : ''}`
    : ''

  const biensStr = input.biens.length > 0
    ? input.biens
        .map(
          (b) =>
            `- ${b.titre} : ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pieces`
        )
        .join('\n')
    : 'Aucun bien actif.'

  const user = `Redige ${input.nombre_articles} article(s) SEO local pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Specialite : ${input.specialite}
- Experience : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
- Cible clients : ${input.cible_clients}
- Gamme de prix : ${input.gamme_prix}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}

BIENS EN COURS (pour exemples concrets dans les articles) :
${biensStr}
${donneesLocales}

CONSIGNES SEO :
${motsClesStr}
${articlesExistantsStr}
${input.mois_cible ? `Mois de publication cible : ${input.mois_cible} — adapter les references saisonnieres.` : ''}

- Varie les types d'articles (guide quartier, guide vendeur, guide acheteur, marche local, conseil pratique)
- Chaque article doit cibler une requete longue traine differente
- Utilise des donnees locales precises — pas de "proche commerces" mais le nom du commerce
- L'article doit apporter une vraie valeur au lecteur, pas juste du remplissage SEO
- Le CTA en fin d'article doit etre naturel : ${input.prenom} est presente(e) comme l'expert(e) local(e) a contacter`

  return { system, user }
}
