/**
 * Prompt — Scripts video/Reels scene par scene
 * Utilise pour : M2 (4 scripts/mois, inclus dans tous les abonnements), B2 (1 Reel Boost)
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
  annees_experience: number
  // Contexte video
  nombre_scripts: number
  format: 'reel' | 'youtube_short' | 'mix'
  // "diaporama" = script pour Reel a partir de photos, sans se filmer (ideal pour debutants)
  type_video?: 'face_camera' | 'diaporama' | 'mix'
  confort_camera: 'debutant' | 'a_laise' | 'expert' | ''
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
}

export function buildScriptVideoPrompt(input: ScriptVideoInput): {
  system: string
  user: string
} {
  const confortLevel = input.confort_camera || 'debutant'

  const confortInstructions: Record<string, string> = {
    debutant: `Le mandataire n'est pas à l'aise devant la caméra (ou n'a pas précisé son niveau). Les scripts doivent être :
- Courts (15-30 secondes max)
- Avec des textes à l'écran plutôt que de la voix off quand possible
- Des plans simples (pas de mouvements complexes)
- Des phrases courtes et naturelles (comme si on parlait à un ami)
- Option "face caméra" minimale — privilégier les plans du bien/quartier avec texte superposé
- PRIVILÉGIER le format diaporama : photos avec texte animé, musique tendance, pas besoin de se filmer`,

    a_laise: `Le mandataire est à l'aise devant la caméra. Les scripts peuvent :
- Durer 30-60 secondes
- Alterner face caméra et plans du bien/quartier
- Inclure de la voix off naturelle
- Proposer des transitions dynamiques`,

    expert: `Le mandataire est très à l'aise devant la caméra. Les scripts peuvent :
- Durer jusqu'à 90 secondes
- Inclure des séquences face caméra élaborées
- Proposer des formats storytelling complets
- Utiliser des techniques avancées (POV, time-lapse, before/after)`
  }

  const diaporamaInstructions = input.type_video === 'diaporama' || (confortLevel === 'debutant' && input.type_video !== 'face_camera')
    ? `
FORMAT DIAPORAMA (prioritaire pour ce mandataire) :
- Les scripts "diaporama" utilisent des PHOTOS statiques avec texte animé par-dessus
- Pas besoin de se filmer — le mandataire prend des photos et l'appli fait le montage
- Structure : photo 1 (3s) + texte hook -> photo 2 (3s) + texte info -> photo 3 (3s) + texte CTA
- Indiquer pour chaque scène : quelle photo prendre (ex: "Photo de la façade depuis le trottoir d'en face")
- Le mandataire publie DIRECTEMENT sans montage — les photos et le texte sont ajoutés via l'interface Reels d'Instagram
- Musique tendance Instagram suggérée pour chaque script`
    : ''

  const system = `Tu es un scénariste spécialisé dans les vidéos courtes pour les professionnels de l'immobilier. Tu crées des scripts Reels/Shorts détaillés, scène par scène, que le mandataire peut tourner seul avec son smartphone.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.

RÈGLES ÉDITORIALES :
- Chaque script est découpé scène par scène avec : durée, texte à dire OU texte à l'écran, indication visuelle, musique/son suggéré
- Les scripts sont adaptés au niveau de confort caméra du mandataire
- Chaque vidéo doit raconter quelque chose — pas de contenu générique "regardez ce bel appart"
- Éléments locaux obligatoires : nom du quartier, rue, commerce, point de repère
- Tutoie le spectateur dans les textes à l'écran et la voix off
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Pas de matériel pro requis — tout se tourne au smartphone
- Les premières 3 secondes sont CRUCIALES : hook visuel ou textuel percutant
- Chaque script se termine par un CTA clair (appeler ${input.prenom}, visiter le profil, envoyer un message)

${confortInstructions[confortLevel]}
${diaporamaInstructions}

TYPES DE VIDÉOS À ALTERNER :
1. Visite bien : mini-visite guidée d'un bien en vente (le best-seller des Reels immo)
2. Découverte quartier : balade dans un quartier avec tips locaux
3. Conseil pro : astuce acheteur/vendeur délivrée en face caméra ou texte
4. Coulisse métier : une journée type, une estimation, une signature
5. Avant/après : transformation d'un bien, ou différence entre annonce classique et annonce storytelling
6. Tendance marché : chiffre clé du marché local présenté de manière visuelle

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
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
          "visuel": "Description précise de ce qu'on voit à l'écran",
          "texte_ecran": "Texte superposé à l'écran (ou null si voix off)",
          "voix_off": "Ce que le mandataire dit (ou null si texte ecran)",
          "indication_tournage": "Conseil pratique pour filmer cette scene"
        }
      ],
      "musique_suggeree": "Type de musique ou titre/artiste suggéré",
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
        `Bien ${i + 1}: ${b.titre} — ${b.type}, ${b.adresse}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m², ${b.pieces} pièces. Points forts: ${b.points_forts}`
    )
    .join('\n')

  const sujetsInstr = input.sujets_prioritaires?.length
    ? `Sujets prioritaires à traiter : ${input.sujets_prioritaires.join(', ')}.`
    : ''

  const historiqueInstr = input.historique_sujets?.length
    ? `Sujets déjà traités (à ne pas répéter) : ${input.historique_sujets.join(', ')}.`
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

  const user = `Crée ${input.nombre_scripts} script(s) vidéo pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Spécialité : ${input.specialite}
- Expérience : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le différencie : ${input.ce_qui_differencie}
- Cible clients : ${input.cible_clients}
- Années d'expérience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais écrire un autre nombre)
- Confort caméra : ${confortLevel}
- Format : ${input.format === 'mix' ? 'Mix Reels Instagram + YouTube Shorts' : input.format === 'reel' ? 'Reels Instagram' : 'YouTube Shorts'}
- Type vidéo préféré : ${input.type_video === 'diaporama' ? 'Diaporama (photos + texte, sans se filmer)' : input.type_video === 'face_camera' ? 'Face caméra' : 'Mix (adapter au confort caméra)'}

BIENS DISPONIBLES POUR LES SCRIPTS :
${biensStr || 'Aucun bien actif — concentre les scripts sur les conseils, le quartier et le marché.'}
${donneesLocales}

CONSIGNES :
${sujetsInstr}
${historiqueInstr}
- Varie les types de vidéos (visite, quartier, conseil, coulisse, avant/après, marché)
- ${input.bien_unique ? 'Ce script est pour un Boost Mandat : concentre-toi sur ce bien spécifique. Mets en valeur ses points forts uniques.' : 'Ne fais pas plus de 50% de vidéos "visite bien" — alterner avec du contenu conseil et quartier.'}
- Chaque script doit être réalisable par ${input.prenom} seul(e) avec un smartphone
- Les indications de tournage doivent être concrètes : "Filme depuis l'entrée en marchant lentement vers le salon" pas "Plan du salon"
- Le hook des 3 premières secondes doit arrêter le scroll`

  return { system, user }
}
