/**
 * Prompt — Scripts video/Reels scene par scene
 * Utilise pour : L7 (10 scripts Pack Lancement), M2 (4 scripts/mois Pack Mensuel), B2 (1 Reel Boost)
 * Output : JSON avec scripts structures scene par scene
 */

export interface ScriptVideoInput {
  prenom: string
  nom: string
  reseau: string
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  nb_transactions_an: number
  cible_clients: string
  gamme_prix: string
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  // Contexte video
  nombre_scripts: number
  format: 'reel' | 'youtube_short' | 'mix'
  confort_camera: 'debutant' | 'a_laise' | 'expert'
  sujets_prioritaires?: string[]
  historique_sujets?: string[]
  // Pour le Boost (un seul bien)
  bien_unique?: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
    description_detaillee?: string
  }
  donnees_locales?: {
    prix_m2_moyen?: number
    ecoles?: string[]
    transports?: string[]
    commerces?: string[]
    parcs?: string[]
    tendance_marche?: string
  }
}

export function buildScriptVideoPrompt(input: ScriptVideoInput): {
  system: string
  user: string
} {
  const confortInstructions = {
    debutant: `Le mandataire n'est pas a l'aise devant la camera. Les scripts doivent etre :
- Courts (15-30 secondes max)
- Avec des textes a l'ecran plutot que de la voix off quand possible
- Des plans simples (pas de mouvements complexes)
- Des phrases courtes et naturelles (comme si on parlait a un ami)
- Option "face camera" minimale — privilegier les plans du bien/quartier avec texte superpose`,

    a_laise: `Le mandataire est a l'aise devant la camera. Les scripts peuvent :
- Durer 30-60 secondes
- Alterner face camera et plans du bien/quartier
- Inclure de la voix off naturelle
- Proposer des transitions dynamiques`,

    expert: `Le mandataire est tres a l'aise devant la camera. Les scripts peuvent :
- Durer jusqu'a 90 secondes
- Inclure des sequences face camera elaborees
- Proposer des formats storytelling complets
- Utiliser des techniques avancees (POV, time-lapse, before/after)`
  }

  const system = `Tu es un scenariste specialise dans les videos courtes pour les professionnels de l'immobilier. Tu crees des scripts Reels/Shorts detailles, scene par scene, que le mandataire peut tourner seul avec son smartphone.

REGLES ABSOLUES :
- Chaque script est decoupe scene par scene avec : duree, texte a dire OU texte a l'ecran, indication visuelle, musique/son suggere
- Les scripts sont adaptes au niveau de confort camera du mandataire
- Chaque video doit raconter quelque chose — pas de contenu generique "regardez ce bel appart"
- Elements locaux obligatoires : nom du quartier, rue, commerce, point de repere
- Tutoie le spectateur dans les textes a l'ecran et la voix off
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Pas de materiel pro requis — tout se tourne au smartphone
- Les premieres 3 secondes sont CRUCIALES : hook visuel ou textuel percutant
- Chaque script se termine par un CTA clair (appeler ${input.prenom}, visiter le profil, envoyer un message)

${confortInstructions[input.confort_camera]}

TYPES DE VIDEOS A ALTERNER :
1. Visite bien : mini-visite guidee d'un bien en vente (le best-seller des Reels immo)
2. Decouverte quartier : balade dans un quartier avec tips locaux
3. Conseil pro : astuce acheteur/vendeur delivree en face camera ou texte
4. Coulisse metier : une journee type, une estimation, une signature
5. Avant/apres : transformation d'un bien, ou difference entre annonce classique et annonce storytelling
6. Tendance marche : chiffre cle du marche local presente de maniere visuelle

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
{
  "scripts": [
    {
      "titre": "Titre du Reel (pour organisation interne)",
      "type": "visite" | "quartier" | "conseil" | "coulisse" | "avant_apres" | "marche",
      "duree_totale_secondes": 30,
      "hook": "Les 3 premieres secondes — texte a l'ecran ou phrase d'accroche",
      "scenes": [
        {
          "numero": 1,
          "duree_secondes": 5,
          "visuel": "Description precise de ce qu'on voit a l'ecran",
          "texte_ecran": "Texte superpose a l'ecran (ou null si voix off)",
          "voix_off": "Ce que le mandataire dit (ou null si texte ecran)",
          "indication_tournage": "Conseil pratique pour filmer cette scene"
        }
      ],
      "musique_suggeree": "Type de musique ou titre/artiste sugger",
      "cta_final": "L'appel a l'action de fin",
      "brief_tournage": "Resume des lieux et moments necessaires pour tourner ce Reel"
    }
  ]
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const biensATraiter = input.bien_unique ? [input.bien_unique] : input.biens

  const biensStr = biensATraiter
    .map(
      (b, i) =>
        `Bien ${i + 1}: ${b.titre} — ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pieces. Points forts: ${b.points_forts}`
    )
    .join('\n')

  const sujetsInstr = input.sujets_prioritaires?.length
    ? `Sujets prioritaires a traiter : ${input.sujets_prioritaires.join(', ')}.`
    : ''

  const historiqueInstr = input.historique_sujets?.length
    ? `Sujets deja traites (a ne pas repeter) : ${input.historique_sujets.join(', ')}.`
    : ''

  const donneesLocales = input.donnees_locales
    ? `
DONNEES LOCALES :
${input.donnees_locales.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales.ecoles?.length ? `- Ecoles : ${input.donnees_locales.ecoles.join(', ')}` : ''}
${input.donnees_locales.transports?.length ? `- Transports : ${input.donnees_locales.transports.join(', ')}` : ''}
${input.donnees_locales.commerces?.length ? `- Commerces : ${input.donnees_locales.commerces.join(', ')}` : ''}
${input.donnees_locales.parcs?.length ? `- Parcs : ${input.donnees_locales.parcs.join(', ')}` : ''}
${input.donnees_locales.tendance_marche ? `- Tendance marche : ${input.donnees_locales.tendance_marche}` : ''}`
    : ''

  const user = `Cree ${input.nombre_scripts} script(s) video pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Specialite : ${input.specialite}
- Experience : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
- Cible clients : ${input.cible_clients}
- Confort camera : ${input.confort_camera}
- Format : ${input.format === 'mix' ? 'Mix Reels Instagram + YouTube Shorts' : input.format === 'reel' ? 'Reels Instagram' : 'YouTube Shorts'}

BIENS DISPONIBLES POUR LES SCRIPTS :
${biensStr || 'Aucun bien actif — concentre les scripts sur les conseils, le quartier et le marche.'}
${donneesLocales}

CONSIGNES :
${sujetsInstr}
${historiqueInstr}
- Varie les types de videos (visite, quartier, conseil, coulisse, avant/apres, marche)
- ${input.bien_unique ? 'Ce script est pour un Boost Mandat : concentre-toi sur ce bien specifique. Mets en valeur ses points forts uniques.' : 'Ne fais pas plus de 50% de videos "visite bien" — alterner avec du contenu conseil et quartier.'}
- Chaque script doit etre realisable par ${input.prenom} seul(e) avec un smartphone
- Les indications de tournage doivent etre concretes : "Filme depuis l'entree en marchant lentement vers le salon" pas "Plan du salon"
- Le hook des 3 premieres secondes doit arreter le scroll`

  return { system, user }
}
