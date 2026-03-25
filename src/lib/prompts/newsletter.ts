/**
 * Prompt — Newsletter mensuelle HTML
 * Utilise pour : M4 (1 newsletter/mois Pack Mensuel)
 * Output : JSON avec HTML email + version texte brut
 */

export interface NewsletterInput {
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
  // Contexte newsletter
  mois_cible: string // ex: "avril 2026"
  bien_du_mois?: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }
  donnees_locales?: {
    prix_m2_moyen?: number
    tendance_marche?: string
    evenements_locaux?: string[]
    nouveaux_commerces?: string[]
  }
  historique_newsletters?: string[] // sujets des newsletters precedentes
  nombre_abonnes_approx?: number
}

export function buildNewsletterPrompt(input: NewsletterInput): {
  system: string
  user: string
} {
  const system = `Tu es un redacteur specialise dans les newsletters immobilieres locales. Tu rediges des emails mensuels que les mandataires envoient a leur base de contacts (acheteurs, vendeurs, anciens clients). L'objectif : rester dans l'esprit du contact, apporter de la valeur, et generer des prises de contact.

REGLES ABSOLUES :
- L'email doit donner envie d'etre lu — pas un catalogue de biens
- Tutoie le lecteur
- Ton chaleureux et local — comme une lettre d'un voisin expert en immobilier
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Zero jargon marketing
- L'email doit etre responsive (HTML simple, compatible tous clients mail)
- Pas d'images embedees (problemes de delivrabilite) — juste du texte structure avec HTML basique
- Le HTML doit utiliser des inline styles uniquement (compatibilite email)
- Longueur totale : 400-600 mots de contenu texte
- Objet de l'email : 40-60 caracteres, personnalise, pas clickbait

STRUCTURE DE LA NEWSLETTER :
1. **Objet** : accrocheur, local, avec le nom de la ville ou du quartier
2. **Edito personnel** (80-120 mots) : ${input.prenom} partage une observation sur le marche local, un evenement du quartier, ou une anecdote pro. Ton personnel et authentique.
3. **Bien du mois** (100-150 mots) : mise en avant d'un bien avec mini-storytelling (pas une fiche technique). Lien vers l'annonce complete.
4. **Conseil du mois** (80-120 mots) : un conseil concret et actionnable pour les vendeurs OU les acheteurs. Alterne chaque mois.
5. **Le chiffre du mois** (30-50 mots) : une donnee marche local commentee (prix m2, nombre de ventes, delai de vente).
6. **CTA final** (30-50 mots) : invitation a contacter ${input.prenom} pour une estimation, un projet, ou juste discuter.
7. **Footer** : coordonnees, lien desabonnement, mentions legales

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
{
  "newsletter": {
    "objet_email": "Objet de l'email (40-60 car.)",
    "preview_text": "Texte de pre-header (80 car. max)",
    "html": "Le HTML complet de l'email, pret a envoyer",
    "texte_brut": "Version texte brut de l'email (pour les clients mail qui n'affichent pas le HTML)",
    "sections": {
      "edito": "Texte de l'edito (pour reference)",
      "bien_du_mois": "Texte du bien du mois",
      "conseil": "Texte du conseil",
      "chiffre": "Le chiffre du mois"
    }
  }
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const bienDuMois = input.bien_du_mois || input.biens[0]
  const bienDuMoisStr = bienDuMois
    ? `Bien a mettre en avant ce mois-ci :
- ${bienDuMois.titre} — ${bienDuMois.type}, ${bienDuMois.adresse}
- ${bienDuMois.prix.toLocaleString('fr-FR')}€, ${bienDuMois.surface}m², ${bienDuMois.pieces} pieces
- Points forts : ${bienDuMois.points_forts}`
    : 'Aucun bien specifique a mettre en avant — concentre le bien du mois sur un type de bien recherche dans la zone.'

  const autresBiens = input.biens
    .filter((b) => b.titre !== bienDuMois?.titre)
    .map((b) => `- ${b.titre} : ${b.type}, ${b.prix.toLocaleString('fr-FR')}€, ${b.surface}m²`)
    .join('\n')

  const donneesLocales = input.donnees_locales
    ? `
DONNEES LOCALES :
${input.donnees_locales.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales.tendance_marche ? `- Tendance : ${input.donnees_locales.tendance_marche}` : ''}
${input.donnees_locales.evenements_locaux?.length ? `- Evenements locaux : ${input.donnees_locales.evenements_locaux.join(', ')}` : ''}
${input.donnees_locales.nouveaux_commerces?.length ? `- Nouveaux commerces : ${input.donnees_locales.nouveaux_commerces.join(', ')}` : ''}`
    : ''

  const historiqueStr = input.historique_newsletters?.length
    ? `Sujets deja traites dans les newsletters precedentes (varier) : ${input.historique_newsletters.join(', ')}.`
    : ''

  const user = `Redige la newsletter de ${input.mois_cible} pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Specialite : ${input.specialite}
- Experience : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
- Cible clients : ${input.cible_clients}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}
${input.reseaux_sociaux.instagram ? `- Instagram : ${input.reseaux_sociaux.instagram}` : ''}
${input.nombre_abonnes_approx ? `- Base d'abonnes : ~${input.nombre_abonnes_approx} contacts` : ''}

${bienDuMoisStr}

AUTRES BIENS EN COURS :
${autresBiens || 'Aucun autre bien.'}
${donneesLocales}

CONSIGNES :
${historiqueStr}
- L'edito doit etre ancre dans le mois de ${input.mois_cible} (saisonnalite, evenements, ambiance)
- Le conseil du mois doit etre ultra-concret (pas "preparez votre bien" mais "repeins les plinthes et change les poignees de porte — ca coute 50€ et ca change tout")
- Le chiffre du mois utilise les donnees locales fournies. Si aucune donnee n'est disponible, propose un format "Le saviez-vous ?" avec un fait immobilier local pertinent
- Le HTML doit etre simple : fond blanc, texte noir, une couleur d'accent (#2563EB), police systeme (Arial, sans-serif)
- Inclure un lien de desabonnement en footer (placeholder : {{unsubscribe_url}})
- Signature : ${input.prenom} ${input.nom} — ${input.reseau}, ${input.zone_geo.ville}`

  return { system, user }
}
