/**
 * Prompt — Email de prospection vendeurs + email blast acheteurs
 * Utilise pour : M6 (1 email prospection/mois), B4 (email blast acheteurs Boost Mandat)
 * Output : JSON avec HTML email + version texte brut
 */

export interface EmailProspectionInput {
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
  cible_clients: string
  gamme_prix: string
  reseaux_sociaux: { instagram?: string; facebook?: string; linkedin?: string; site_web?: string }
  // Coordonnees reelles du mandataire (pas de placeholders)
  email_contact: string // ex: "sophie.martin@iadfrance.fr"
  telephone_contact: string // ex: "06 12 34 56 78"
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  // Type d'email
  type_email: 'prospection_vendeurs' | 'blast_acheteurs'
  // Contexte prospection vendeurs
  resultats_recents?: string // ex: "3 ventes ce trimestre, delai moyen 45 jours"
  argument_principal?: string // ex: "estimation gratuite en 24h"
  // Contexte blast acheteurs
  bien_a_promouvoir?: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
    lien_annonce?: string
  }
  criteres_acheteurs?: string // ex: "T3/T4, budget 200-300K, famille"
  donnees_locales?: {
    prix_m2_moyen?: number
    tendance_marche?: string
    delai_vente_moyen?: string
    nombre_ventes_trimestre?: number
  }
}

export function buildEmailProspectionPrompt(input: EmailProspectionInput): {
  system: string
  user: string
} {
  const isProspection = input.type_email === 'prospection_vendeurs'

  const system = `Tu es un rédacteur spécialisé dans les emails immobiliers pour le marché français. Tu rédiges des emails ${isProspection ? 'de prospection pour convaincre des propriétaires de confier la vente de leur bien' : 'de promotion immobilière pour informer des acheteurs potentiels d\'un bien correspondant à leurs critères'}.

## Règles anti-erreur absolues
- NE JAMAIS inventer de noms de commerces, écoles, restaurants, marchés ou lieux qui ne sont pas dans les données fournies. Si les données locales détaillées ne sont pas disponibles, utiliser UNIQUEMENT les informations du champ zone_geo (ville, quartiers) sans inventer de détails spécifiques.
- NE JAMAIS inventer de chiffres d'expérience, de nombre de transactions, de prix au m2 ou de statistiques. Utiliser UNIQUEMENT les chiffres fournis dans le profil client.
- Ne JAMAIS écrire un nombre d'années d'expérience différent de celui fourni. Si annees_experience = ${input.annees_experience}, écrire "${input.annees_experience} ans", jamais un autre chiffre.
- L'année courante est 2026. Ne jamais mentionner 2024 ou 2025 comme année courante.
- Le mandataire est un MANDATAIRE immobilier (pas un "agent immobilier"). Toujours utiliser le terme "mandataire" sauf si le réseau du client utilise un autre terme.
- Le domaine email IAD est "iadfrance.fr", PAS "iad.fr". Si le réseau est IAD, vérifier que le mailto utilise @iadfrance.fr.
- UTILISER LES VRAIES COORDONNÉES du mandataire fournies ci-dessous. Ne JAMAIS écrire "06 00 00 00 00" ou un email placeholder.

RÈGLES ÉDITORIALES :
- Email court et percutant : 150-250 mots maximum. Chaque mot compte.
- Tutoie le destinataire
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Zéro jargon marketing ou technique
- Pas de promesse de résultat chiffrée non vérifiable
- Le ton est direct et professionnel — ni agressif ni suppliant
- ${isProspection ? 'Pas de "cold email" agressif. Le ton est celui d\'un voisin expert qui propose son aide.' : 'L\'email doit donner envie de visiter, pas de forcer la main.'}
- L'objet doit donner envie d'ouvrir (pas de majuscules, pas de "URGENT", pas de "$$$")
- Conformité : inclure lien désabonnement, mentions légales, coordonnées expéditeur

${isProspection ? `STRUCTURE EMAIL PROSPECTION VENDEURS :
1. **Objet** (30-50 car.) : personnalisé avec le nom de la ville ou du quartier
2. **Accroche** (1-2 phrases) : observation locale concrète (nouveau commerce, prix en hausse, bien vendu dans la rue)
3. **Valeur ajoutée** (2-3 phrases) : ce que ${input.prenom} apporte de différent (connaissance locale, résultats récents, méthode)
4. **Proposition** (1-2 phrases) : une offre concrète (estimation gratuite, avis de valeur, rencontre café)
5. **CTA** (1 phrase) : action simple et non engageante
6. **Signature** : nom, titre, coordonnées

Objectif : que le propriétaire réponde "oui je veux bien une estimation" ou "dis-moi en plus".` :

`STRUCTURE EMAIL BLAST ACHETEURS :
1. **Objet** (30-50 car.) : le type de bien + le quartier
2. **Accroche** (1-2 phrases) : pourquoi ce bien va leur plaire (correspondance avec leurs critères)
3. **Mini-description** (3-5 phrases) : storytelling court du bien — pas une fiche technique
4. **Les chiffres clés** (liste courte) : prix, surface, pièces, quartier
5. **CTA** (1 phrase) : proposer une visite, envoyer les photos, ou appeler
6. **Signature** : nom, titre, coordonnées

Objectif : que l'acheteur réponde "je veux visiter" ou "envoie-moi les photos".`}

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "email": {
    "objet": "Objet de l'email (30-50 car.)",
    "preview_text": "Pre-header (60 car. max)",
    "html": "Le HTML complet de l'email avec inline styles",
    "texte_brut": "Version texte brut",
    "type": "${input.type_email}",
    "cible": "${isProspection ? 'Proprietaires de la zone' : 'Acheteurs correspondant aux criteres'}",
    "taux_ouverture_estime": "Estimation qualitative : eleve/moyen/faible avec justification"
  }
}`

  const quartiersStr = input.zone_geo.quartiers.length > 0
    ? input.zone_geo.quartiers.join(', ')
    : input.zone_geo.ville

  const donneesLocalesDisponibles = input.donnees_locales &&
    (input.donnees_locales.prix_m2_moyen || input.donnees_locales.tendance_marche || input.donnees_locales.delai_vente_moyen || input.donnees_locales.nombre_ventes_trimestre)

  const donneesLocales = donneesLocalesDisponibles
    ? `
DONNÉES LOCALES VÉRIFIÉES (utilise UNIQUEMENT ces chiffres, ne rien inventer) :
${input.donnees_locales!.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales!.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales!.tendance_marche ? `- Tendance : ${input.donnees_locales!.tendance_marche}` : ''}
${input.donnees_locales!.delai_vente_moyen ? `- Délai de vente moyen : ${input.donnees_locales!.delai_vente_moyen}` : ''}
${input.donnees_locales!.nombre_ventes_trimestre ? `- Ventes ce trimestre : ${input.donnees_locales!.nombre_ventes_trimestre}` : ''}`
    : `
DONNÉES LOCALES : non disponibles. Ne pas citer de chiffres locaux (prix m2, délai de vente, nombre de ventes). Rester sur des arguments qualitatifs.`

  let contexteSpecifique = ''

  if (isProspection) {
    contexteSpecifique = `
CONTEXTE PROSPECTION :
${input.resultats_recents ? `- Résultats récents : ${input.resultats_recents}` : '- Aucun résultat récent fourni — ne pas inventer de chiffres.'}
${input.argument_principal ? `- Argument principal : ${input.argument_principal}` : '- Proposer une estimation gratuite comme argument par défaut.'}
- L'email cible les propriétaires de ${input.zone_geo.ville} qui pourraient envisager de vendre`
  } else {
    const bien = input.bien_a_promouvoir
    contexteSpecifique = bien
      ? `
BIEN A PROMOUVOIR :
- ${bien.titre} — ${bien.type}
- Adresse : ${bien.adresse}
- Prix : ${bien.prix.toLocaleString('fr-FR')}€
- Surface : ${bien.surface}m², ${bien.pieces} pieces
- Points forts : ${bien.points_forts}
${bien.lien_annonce ? `- Lien annonce : ${bien.lien_annonce}` : ''}
${input.criteres_acheteurs ? `- Profil acheteur cible : ${input.criteres_acheteurs}` : ''}`
      : 'Aucun bien spécifique fourni — générer un email générique de prospection acheteur.'
  }

  const user = `Rédige un email ${isProspection ? 'de prospection vendeurs' : 'de promotion acheteurs'} pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Spécialité : ${input.specialite}
- Années d'expérience : ${input.annees_experience} ans (CHIFFRE EXACT — ne jamais écrire un autre nombre)
- Volume : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le différencie : ${input.ce_qui_differencie}
- Gamme de prix : ${input.gamme_prix}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}
${contexteSpecifique}
${donneesLocales}

CONSIGNES :
- L'email doit être ultra-court (150-250 mots). Un email long = un email non lu.
- L'objet doit contenir le nom de ${input.zone_geo.ville} ou d'un quartier pour la pertinence locale
- Le HTML doit etre minimaliste : fond blanc, texte noir, une couleur d'accent (#2563EB), police systeme
- Inclure un placeholder désabonnement : {{unsubscribe_url}}
- Signature OBLIGATOIRE avec les VRAIES coordonnées :
  ${input.prenom} ${input.nom} — Mandataire ${input.reseau}
  Email : ${input.email_contact}
  ${input.telephone_contact ? `Telephone : ${input.telephone_contact}` : ''}
  ${input.zone_geo.ville}
- Le mailto dans le HTML doit pointer vers ${input.email_contact} (PAS un placeholder)
- ${input.telephone_contact ? `Le lien tel: doit pointer vers ${input.telephone_contact}` : 'Pas de numéro de téléphone fourni — ne pas inventer de numéro.'}
- Le CTA doit être une action simple : répondre à l'email, appeler, ou cliquer sur un lien unique`

  return { system, user }
}
