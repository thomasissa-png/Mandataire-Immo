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
      "Comment rediger une annonce immobiliere qui fait appeler (guide mandataire 2026)",
    mot_cle_principal: "rediger annonce immobiliere",
    mots_cles_secondaires: [
      "comment ecrire une annonce immobiliere",
      "annonce immobiliere accrocheuse",
      "exemple annonce immobiliere originale",
    ],
    categorie: "Annonces",
    angle:
      "Methode pratique pour ecrire des annonces qui generent des appels, avec exemples avant/apres",
    priorite: 1,
    statut: "publie",
  },
  {
    slug: "calendrier-editorial-agent-immobilier",
    titre:
      "Calendrier editorial pour mandataire immobilier : le plan sur 30 jours",
    mot_cle_principal: "calendrier editorial agent immobilier",
    mots_cles_secondaires: [
      "calendrier editorial immobilier",
      "quoi poster instagram agent immobilier",
      "idees posts reseaux sociaux immobilier",
    ],
    categorie: "Strategie",
    angle:
      "Un plan de publication concret sur 30 jours que Sophie peut copier-coller",
    priorite: 2,
    statut: "publie",
  },
  {
    slug: "se-differencier-mandataire-immobilier",
    titre:
      "Se differencier quand on est mandataire immobilier : 7 leviers concrets",
    mot_cle_principal: "se demarquer mandataire immobilier",
    mots_cles_secondaires: [
      "differencier agent immobilier concurrent",
      "personal branding agent immobilier",
      "marketing immobilier sans budget",
    ],
    categorie: "Strategie",
    angle:
      "Leviers de differenciation accessibles sans budget pour un mandataire solo",
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
      "Pas-a-pas pour creer et optimiser sa fiche Google et apparaitre dans les resultats locaux",
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
      "Vue d'ensemble des canaux digitaux prioritaires pour un mandataire qui part de zero",
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
    categorie: "Reseaux sociaux",
    angle:
      "Strategie Instagram concrete pour un mandataire solo qui veut transformer ses followers en clients",
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
    categorie: "Reseaux sociaux",
    angle:
      "Comment utiliser LinkedIn pour generer des contacts entrants de vendeurs et investisseurs",
    priorite: 7,
    statut: "planifie",
  },
  {
    slug: "community-manager-immobilier-faut-il-deleguer",
    titre:
      "Community manager immobilier : faut-il deleguer ses reseaux sociaux ?",
    mot_cle_principal: "community manager immobilier",
    mots_cles_secondaires: [
      "externaliser marketing immobilier",
      "cm freelance immobilier",
      "contenu marketing mandataire immobilier",
    ],
    categorie: "Marketing digital",
    angle:
      "Comparatif faire soi-meme vs CM freelance vs service automatise — avantages et couts reels",
    priorite: 8,
    statut: "planifie",
  },

  // Cluster 2 — Annonces
  {
    slug: "photos-immobilieres-smartphone",
    titre:
      "Photos immobilieres au smartphone : 10 astuces pour des visuels pros",
    mot_cle_principal: "photos immobilieres smartphone",
    mots_cles_secondaires: [
      "photo annonce immobiliere",
      "photographier bien immobilier",
      "photos immobilier sans photographe",
    ],
    categorie: "Annonces",
    angle:
      "Techniques simples pour prendre des photos vendables avec un telephone, sans materiel pro",
    priorite: 9,
    statut: "planifie",
  },
  {
    slug: "description-bien-immobilier-exemples",
    titre:
      "Description de bien immobilier : 5 exemples qui font la difference",
    mot_cle_principal: "description bien immobilier",
    mots_cles_secondaires: [
      "texte annonce immobiliere exemple",
      "annonce immobiliere storytelling",
      "description appartement a vendre",
    ],
    categorie: "Annonces",
    angle:
      "Exemples concrets avant/apres de descriptions qui transforment une annonce banale en annonce irresistible",
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
      "Specificites de LeBonCoin pour les pros et techniques pour maximiser la visibilite de ses annonces",
    priorite: 11,
    statut: "planifie",
  },

  // Cluster 4 — SEO local
  {
    slug: "referencement-local-immobilier-guide",
    titre:
      "Referencement local pour mandataire immobilier : le guide pas-a-pas",
    mot_cle_principal: "referencement local mandataire immobilier",
    mots_cles_secondaires: [
      "SEO local agent immobilier",
      "comment apparaitre sur Google agent immobilier",
      "visibilite locale mandataire",
    ],
    categorie: "SEO local",
    angle:
      "Actions concretes pour apparaitre dans les resultats Google quand un vendeur cherche un mandataire dans ta ville",
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
      "Methode pour systematiser la collecte d'avis et les transformer en levier d'acquisition",
    priorite: 13,
    statut: "planifie",
  },
  {
    slug: "seo-immobilier-mandataire-debutant",
    titre:
      "SEO immobilier pour mandataire : les bases pour etre trouve sur Google",
    mot_cle_principal: "SEO immobilier",
    mots_cles_secondaires: [
      "referencement naturel immobilier",
      "strategie seo agent immobilier",
      "blog immobilier referencement",
    ],
    categorie: "SEO local",
    angle:
      "Les fondamentaux du SEO expliques simplement pour un mandataire qui n'a jamais fait de referencement",
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
    categorie: "Reseaux sociaux",
    angle:
      "Strategie pour apporter de la valeur dans les groupes Facebook et convertir les membres en clients",
    priorite: 15,
    statut: "planifie",
  },

  // Cluster 5 — Personal branding
  {
    slug: "marque-personnelle-mandataire-immobilier",
    titre:
      "Marque personnelle pour mandataire immobilier : deviens la reference de ta ville",
    mot_cle_principal: "marque personnelle mandataire",
    mots_cles_secondaires: [
      "personal branding agent immobilier",
      "se faire connaitre mandataire immobilier",
      "image de marque immobilier",
    ],
    categorie: "Personal branding",
    angle:
      "Comment construire une identite forte qui fait que les vendeurs pensent a toi en premier",
    priorite: 16,
    statut: "planifie",
  },
  {
    slug: "se-faire-connaitre-mandataire-immobilier",
    titre:
      "Se faire connaitre en tant que mandataire immobilier : 10 actions a lancer cette semaine",
    mot_cle_principal: "se faire connaitre mandataire",
    mots_cles_secondaires: [
      "visibilite mandataire immobilier",
      "comment avoir plus de mandats",
      "generer mandats entrants",
    ],
    categorie: "Personal branding",
    angle:
      "Actions immediates et gratuites pour gagner en visibilite locale en partant de zero",
    priorite: 17,
    statut: "planifie",
  },

  // Cluster 6 — Video
  {
    slug: "video-immobiliere-mandataire-guide",
    titre:
      "Video immobiliere : le guide complet pour mandataires (meme si tu detestes la camera)",
    mot_cle_principal: "video immobiliere",
    mots_cles_secondaires: [
      "video visite virtuelle",
      "filmer un bien immobilier",
      "video marketing immobilier",
    ],
    categorie: "Video",
    angle:
      "Pourquoi la video est devenue incontournable et comment s'y mettre sans stress ni materiel couteux",
    priorite: 18,
    statut: "planifie",
  },
  {
    slug: "reels-agent-immobilier-idees",
    titre:
      "Reels pour mandataire immobilier : 15 idees de videos courtes qui marchent",
    mot_cle_principal: "Reels agent immobilier",
    mots_cles_secondaires: [
      "reels instagram immobilier idees",
      "tiktok immobilier",
      "videos courtes agent immobilier",
    ],
    categorie: "Video",
    angle:
      "Formats de Reels testes et approuves dans l'immobilier avec des scripts prets a tourner",
    priorite: 19,
    statut: "planifie",
  },
  {
    slug: "script-video-immobilier-templates",
    titre:
      "Scripts video immobilier : 5 templates prets a l'emploi pour tes Reels et YouTube",
    mot_cle_principal: "script video immobilier",
    mots_cles_secondaires: [
      "scenario video immobilier",
      "script reel immobilier",
      "video youtube agent immobilier",
    ],
    categorie: "Video",
    angle:
      "Templates de scripts mot-a-mot que le mandataire peut lire et tourner en 10 minutes",
    priorite: 20,
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
