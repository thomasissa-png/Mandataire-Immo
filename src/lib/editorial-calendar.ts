/**
 * Calendrier editorial pre-defini — 20 sujets d'articles SEO
 * Planifies sur 3 mois (avril-juin 2026), publication 2x/semaine
 * Bases sur docs/seo/keyword-map.md — clusters 1 a 6
 */

export interface EditorialTopic {
  slug: string
  titre: string
  mot_cle_principal: string
  mots_cles_secondaires: string[]
  categorie: string
  angle: string
  priorite: number
  statut: "publie" | "planifie" | "genere"
}

export const EDITORIAL_TOPICS: EditorialTopic[] = [
  // ── Articles deja publies (1-5) ──────────────────────────────────
  {
    slug: "comment-rediger-annonce-immobiliere",
    titre:
      "Comment rédiger une annonce immobilière qui fait appeler (guide mandataire 2026)",
    mot_cle_principal: "rediger annonce immobiliere",
    mots_cles_secondaires: [
      "comment ecrire une annonce immobiliere",
      "annonce immobiliere accrocheuse",
      "exemple annonce immobiliere originale",
    ],
    categorie: "Annonces",
    angle:
      "Méthode pratique pour écrire des annonces qui génèrent des appels, avec exemples avant/après",
    priorite: 1,
    statut: "publie",
  },
  {
    slug: "calendrier-editorial-agent-immobilier",
    titre:
      "Calendrier éditorial pour mandataire immobilier : le plan sur 30 jours",
    mot_cle_principal: "calendrier editorial agent immobilier",
    mots_cles_secondaires: [
      "calendrier editorial immobilier",
      "quoi poster instagram agent immobilier",
      "idees posts reseaux sociaux immobilier",
    ],
    categorie: "Stratégie",
    angle:
      "Un plan de publication concret sur 30 jours que Sophie peut copier-coller",
    priorite: 2,
    statut: "publie",
  },
  {
    slug: "se-differencier-mandataire-immobilier",
    titre:
      "Se différencier quand on est mandataire immobilier : 7 leviers concrets",
    mot_cle_principal: "se demarquer mandataire immobilier",
    mots_cles_secondaires: [
      "differencier agent immobilier concurrent",
      "personal branding agent immobilier",
      "marketing immobilier sans budget",
    ],
    categorie: "Stratégie",
    angle:
      "Leviers de différenciation accessibles sans budget pour un mandataire solo",
    priorite: 3,
    statut: "publie",
  },
  {
    slug: "google-business-profile-mandataire",
    titre:
      "Google Business Profile pour mandataire immobilier : le guide complet",
    mot_cle_principal: "Google Business Profile agent immobilier",
    mots_cles_secondaires: [
      "fiche Google My Business immobilier",
      "comment apparaitre sur Google agent immobilier",
      "referencement local mandataire immobilier",
    ],
    categorie: "SEO local",
    angle:
      "Pas-à-pas pour créer et optimiser sa fiche Google et apparaître dans les résultats locaux",
    priorite: 4,
    statut: "publie",
  },
  {
    slug: "marketing-digital-mandataire-immobilier",
    titre:
      "Marketing digital pour mandataire immobilier : par ou commencer en 2026",
    mot_cle_principal: "marketing digital immobilier France",
    mots_cles_secondaires: [
      "marketing mandataire immobilier",
      "strategie digitale mandataire immobilier",
      "marketing immobilier agent",
    ],
    categorie: "Marketing digital",
    angle:
      "Vue d'ensemble des canaux digitaux prioritaires pour un mandataire qui part de zéro",
    priorite: 5,
    statut: "publie",
  },

  // ── Articles planifies (6-20) ────────────────────────────────────

  // Cluster 3 — Reseaux sociaux
  {
    slug: "instagram-mandataire-immobilier-guide",
    titre:
      "Instagram pour mandataire immobilier : le guide pour gagner des mandats",
    mot_cle_principal: "contenu instagram mandataire immobilier",
    mots_cles_secondaires: [
      "quoi poster instagram agent immobilier",
      "reels instagram immobilier idees",
      "idees posts reseaux sociaux immobilier",
    ],
    categorie: "Réseaux sociaux",
    angle:
      "Stratégie Instagram concrète pour un mandataire solo qui veut transformer ses followers en clients",
    priorite: 6,
    statut: "planifie",
  },
  {
    slug: "linkedin-mandataire-immobilier",
    titre:
      "LinkedIn pour mandataire immobilier : attirer des vendeurs sans prospecter",
    mot_cle_principal: "posts linkedin agent immobilier",
    mots_cles_secondaires: [
      "linkedin immobilier strategie",
      "personal branding agent immobilier",
      "contenu linkedin mandataire",
    ],
    categorie: "Réseaux sociaux",
    angle:
      "Comment utiliser LinkedIn pour générer des contacts entrants de vendeurs et investisseurs",
    priorite: 7,
    statut: "planifie",
  },
  {
    slug: "community-manager-immobilier-faut-il-deleguer",
    titre:
      "Community manager immobilier : faut-il déléguer ses réseaux sociaux ?",
    mot_cle_principal: "community manager immobilier",
    mots_cles_secondaires: [
      "externaliser marketing immobilier",
      "cm freelance immobilier",
      "contenu marketing mandataire immobilier",
    ],
    categorie: "Marketing digital",
    angle:
      "Comparatif faire soi-même vs CM freelance vs service automatisé — avantages et coûts réels",
    priorite: 8,
    statut: "planifie",
  },

  // Cluster 2 — Annonces
  {
    slug: "photos-immobilieres-smartphone",
    titre:
      "Photos immobilières au smartphone : 10 astuces pour des visuels pros",
    mot_cle_principal: "photos immobilieres smartphone",
    mots_cles_secondaires: [
      "photo annonce immobiliere",
      "photographier bien immobilier",
      "photos immobilier sans photographe",
    ],
    categorie: "Annonces",
    angle:
      "Techniques simples pour prendre des photos vendables avec un téléphone, sans matériel pro",
    priorite: 9,
    statut: "planifie",
  },
  {
    slug: "description-bien-immobilier-exemples",
    titre:
      "Description de bien immobilier : 5 exemples qui font la différence",
    mot_cle_principal: "description bien immobilier",
    mots_cles_secondaires: [
      "texte annonce immobiliere exemple",
      "annonce immobiliere storytelling",
      "description appartement a vendre",
    ],
    categorie: "Annonces",
    angle:
      "Exemples concrets avant/après de descriptions qui transforment une annonce banale en annonce irrésistible",
    priorite: 10,
    statut: "planifie",
  },
  {
    slug: "annonce-leboncoin-mandataire",
    titre:
      "Annonce LeBonCoin immobilier : comment sortir du lot en tant que mandataire",
    mot_cle_principal: "annonce LeBonCoin immobilier",
    mots_cles_secondaires: [
      "annonce immobiliere qui attire",
      "publier annonce leboncoin pro",
      "optimiser annonce leboncoin immobilier",
    ],
    categorie: "Annonces",
    angle:
      "Spécificités de LeBonCoin pour les pros et techniques pour maximiser la visibilité de ses annonces",
    priorite: 11,
    statut: "planifie",
  },

  // Cluster 4 — SEO local
  {
    slug: "referencement-local-immobilier-guide",
    titre:
      "Référencement local pour mandataire immobilier : le guide pas-à-pas",
    mot_cle_principal: "referencement local mandataire immobilier",
    mots_cles_secondaires: [
      "SEO local agent immobilier",
      "comment apparaitre sur Google agent immobilier",
      "visibilite locale mandataire",
    ],
    categorie: "SEO local",
    angle:
      "Actions concrètes pour apparaître dans les résultats Google quand un vendeur cherche un mandataire dans ta ville",
    priorite: 12,
    statut: "planifie",
  },
  {
    slug: "avis-google-mandataire-immobilier",
    titre: "Avis Google pour mandataire immobilier : comment en obtenir (et les utiliser)",
    mot_cle_principal: "avis Google mandataire immobilier",
    mots_cles_secondaires: [
      "demander avis google client",
      "repondre avis google immobilier",
      "avis positifs agent immobilier",
    ],
    categorie: "SEO local",
    angle:
      "Méthode pour systématiser la collecte d'avis et les transformer en levier d'acquisition",
    priorite: 13,
    statut: "planifie",
  },
  {
    slug: "seo-immobilier-mandataire-debutant",
    titre:
      "SEO immobilier pour mandataire : les bases pour être trouvé sur Google",
    mot_cle_principal: "SEO immobilier",
    mots_cles_secondaires: [
      "referencement naturel immobilier",
      "strategie seo agent immobilier",
      "blog immobilier referencement",
    ],
    categorie: "SEO local",
    angle:
      "Les fondamentaux du SEO expliqués simplement pour un mandataire qui n'a jamais fait de référencement",
    priorite: 14,
    statut: "planifie",
  },

  // Cluster 4 — Reseaux sociaux (suite)
  {
    slug: "facebook-groupes-mandataire-immobilier",
    titre:
      "Groupes Facebook immobilier : comment les utiliser pour trouver des mandats",
    mot_cle_principal: "Facebook groupes immobilier",
    mots_cles_secondaires: [
      "groupes facebook mandataire",
      "prospection facebook immobilier",
      "facebook agent immobilier strategie",
    ],
    categorie: "Réseaux sociaux",
    angle:
      "Stratégie pour apporter de la valeur dans les groupes Facebook et convertir les membres en clients",
    priorite: 15,
    statut: "planifie",
  },

  // Cluster 5 — Personal branding
  {
    slug: "marque-personnelle-mandataire-immobilier",
    titre:
      "Marque personnelle pour mandataire immobilier : deviens la référence de ta ville",
    mot_cle_principal: "marque personnelle mandataire",
    mots_cles_secondaires: [
      "personal branding agent immobilier",
      "se faire connaitre mandataire immobilier",
      "image de marque immobilier",
    ],
    categorie: "Personal branding",
    angle:
      "Comment construire une identité forte qui fait que les vendeurs pensent à toi en premier",
    priorite: 16,
    statut: "planifie",
  },
  {
    slug: "se-faire-connaitre-mandataire-immobilier",
    titre:
      "Se faire connaître en tant que mandataire immobilier : 10 actions à lancer cette semaine",
    mot_cle_principal: "se faire connaitre mandataire",
    mots_cles_secondaires: [
      "visibilite mandataire immobilier",
      "comment avoir plus de mandats",
      "generer mandats entrants",
    ],
    categorie: "Personal branding",
    angle:
      "Actions immédiates et gratuites pour gagner en visibilité locale en partant de zéro",
    priorite: 17,
    statut: "planifie",
  },

  // Cluster 6 — Video
  {
    slug: "video-immobiliere-mandataire-guide",
    titre:
      "Vidéo immobilière : le guide complet pour mandataires (même si tu détestes la caméra)",
    mot_cle_principal: "video immobiliere",
    mots_cles_secondaires: [
      "video visite virtuelle",
      "filmer un bien immobilier",
      "video marketing immobilier",
    ],
    categorie: "Vidéo",
    angle:
      "Pourquoi la vidéo est devenue incontournable et comment s'y mettre sans stress ni matériel coûteux",
    priorite: 18,
    statut: "planifie",
  },
  {
    slug: "reels-agent-immobilier-idees",
    titre:
      "Reels pour mandataire immobilier : 15 idées de vidéos courtes qui marchent",
    mot_cle_principal: "Reels agent immobilier",
    mots_cles_secondaires: [
      "reels instagram immobilier idees",
      "tiktok immobilier",
      "videos courtes agent immobilier",
    ],
    categorie: "Vidéo",
    angle:
      "Formats de Reels testés et approuvés dans l'immobilier avec des scripts prêts à tourner",
    priorite: 19,
    statut: "planifie",
  },
  {
    slug: "script-video-immobilier-templates",
    titre:
      "Scripts vidéo immobilier : 5 templates prêts à l'emploi pour tes Reels et YouTube",
    mot_cle_principal: "script video immobilier",
    mots_cles_secondaires: [
      "scenario video immobilier",
      "script reel immobilier",
      "video youtube agent immobilier",
    ],
    categorie: "Vidéo",
    angle:
      "Templates de scripts mot-à-mot que le mandataire peut lire et tourner en 10 minutes",
    priorite: 20,
    statut: "planifie",
  },

  // ── Angles morts critiques (audit creative-strategy 2026-03-26) ──
  {
    slug: "mandats-entrants-sans-prospecter",
    titre:
      "Comment avoir des mandats entrants sans prospecter (et sans budget pub)",
    mot_cle_principal: "mandats entrants mandataire immobilier",
    mots_cles_secondaires: [
      "comment generer des mandats",
      "mandats sans prospecter",
      "mandats entrants agent immobilier",
      "generer mandats entrants immobilier",
    ],
    categorie: "Stratégie",
    angle:
      "Les 4 leviers digitaux pour recevoir des mandats au lieu d'aller les chercher — chaque levier nécessite du contenu régulier",
    priorite: 6, // Haute priorite — middle funnel, requete volumineuse
    statut: "planifie",
  },
  {
    slug: "budget-marketing-mandataire-immobilier",
    titre:
      "Quel budget marketing pour un mandataire immobilier ? (comparatif 2026)",
    mot_cle_principal: "budget marketing mandataire immobilier",
    mots_cles_secondaires: [
      "combien coute community manager immobilier",
      "tarif freelance marketing immobilier",
      "cout marketing agent immobilier",
      "externaliser marketing immobilier prix",
    ],
    categorie: "Stratégie",
    angle:
      "Comparatif honnête : freelance vs templates réseau vs service productisé — sans nommer de concurrent, avec les vrais chiffres du marché",
    priorite: 7, // Haute priorite — bottom funnel, intention commerciale
    statut: "planifie",
  },
]

/**
 * Retourne le prochain sujet "planifie" dans l'ordre de priorite.
 * Retourne undefined si tous les sujets sont publies ou generes.
 */
export function getNextPlannedTopic(): EditorialTopic | undefined {
  return EDITORIAL_TOPICS.find((t) => t.statut === "planifie")
}

/**
 * Retourne un sujet par son index (0-based).
 */
export function getTopicByIndex(index: number): EditorialTopic | undefined {
  return EDITORIAL_TOPICS[index]
}

/**
 * Retourne la liste des articles deja publies (pour le maillage interne).
 */
export function getPublishedTitles(): string[] {
  return EDITORIAL_TOPICS.filter((t) => t.statut === "publie").map(
    (t) => t.titre
  )
}
