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

  const system = `Tu es un redacteur specialise dans les emails immobiliers pour le marche francais. Tu rediges des emails ${isProspection ? 'de prospection pour convaincre des proprietaires de confier la vente de leur bien' : 'de promotion immobiliere pour informer des acheteurs potentiels d\'un bien correspondant a leurs criteres'}.

REGLES ABSOLUES :
- Email court et percutant : 150-250 mots maximum. Chaque mot compte.
- Tutoie le destinataire
- L'IA est INVISIBLE : ne jamais mentionner l'IA
- Zero jargon marketing ou technique
- Pas de promesse de resultat chiffree non verifiable
- Le ton est direct et professionnel — ni agressif ni suppliant
- ${isProspection ? 'Pas de "cold email" agressif. Le ton est celui d\'un voisin expert qui propose son aide.' : 'L\'email doit donner envie de visiter, pas de forcer la main.'}
- L'objet doit donner envie d'ouvrir (pas de majuscules, pas de "URGENT", pas de "$$$")
- Conformite : inclure lien desabonnement, mentions legales, coordonnees expediteur

${isProspection ? `STRUCTURE EMAIL PROSPECTION VENDEURS :
1. **Objet** (30-50 car.) : personnalise avec le nom de la ville ou du quartier
2. **Accroche** (1-2 phrases) : observation locale concrete (nouveau commerce, prix en hausse, bien vendu dans la rue)
3. **Valeur ajoutee** (2-3 phrases) : ce que ${input.prenom} apporte de different (connaissance locale, resultats recents, methode)
4. **Proposition** (1-2 phrases) : une offre concrete (estimation gratuite, avis de valeur, rencontre cafe)
5. **CTA** (1 phrase) : action simple et non engageante
6. **Signature** : nom, titre, coordonnees

Objectif : que le proprietaire reponde "oui je veux bien une estimation" ou "dis-moi en plus".` :

`STRUCTURE EMAIL BLAST ACHETEURS :
1. **Objet** (30-50 car.) : le type de bien + le quartier
2. **Accroche** (1-2 phrases) : pourquoi ce bien va leur plaire (correspondance avec leurs criteres)
3. **Mini-description** (3-5 phrases) : storytelling court du bien — pas une fiche technique
4. **Les chiffres cles** (liste courte) : prix, surface, pieces, quartier
5. **CTA** (1 phrase) : proposer une visite, envoyer les photos, ou appeler
6. **Signature** : nom, titre, coordonnees

Objectif : que l'acheteur reponde "je veux visiter" ou "envoie-moi les photos".`}

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
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

  const donneesLocales = input.donnees_locales
    ? `
DONNEES LOCALES :
${input.donnees_locales.prix_m2_moyen ? `- Prix moyen au m² : ${input.donnees_locales.prix_m2_moyen.toLocaleString('fr-FR')}€` : ''}
${input.donnees_locales.tendance_marche ? `- Tendance : ${input.donnees_locales.tendance_marche}` : ''}
${input.donnees_locales.delai_vente_moyen ? `- Delai de vente moyen : ${input.donnees_locales.delai_vente_moyen}` : ''}
${input.donnees_locales.nombre_ventes_trimestre ? `- Ventes ce trimestre : ${input.donnees_locales.nombre_ventes_trimestre}` : ''}`
    : ''

  let contexteSpecifique = ''

  if (isProspection) {
    contexteSpecifique = `
CONTEXTE PROSPECTION :
${input.resultats_recents ? `- Resultats recents : ${input.resultats_recents}` : '- Aucun resultat recent fourni — ne pas inventer de chiffres.'}
${input.argument_principal ? `- Argument principal : ${input.argument_principal}` : '- Proposer une estimation gratuite comme argument par defaut.'}
- L'email cible les proprietaires de ${input.zone_geo.ville} qui pourraient envisager de vendre`
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
      : 'Aucun bien specifique fourni — generer un email generique de prospection acheteur.'
  }

  const user = `Redige un email ${isProspection ? 'de prospection vendeurs' : 'de promotion acheteurs'} pour ${input.prenom} ${input.nom}, mandataire chez ${input.reseau}.

PROFIL DU MANDATAIRE :
- Zone : ${input.zone_geo.ville} (${input.zone_geo.departement}), quartiers : ${quartiersStr}
- Specialite : ${input.specialite}
- Experience : ${input.nb_transactions_an} transactions/an
- Ton : ${input.ton}
- Valeurs : ${input.valeurs}
- Ce qui la/le differencie : ${input.ce_qui_differencie}
- Gamme de prix : ${input.gamme_prix}
${input.reseaux_sociaux.site_web ? `- Site web : ${input.reseaux_sociaux.site_web}` : ''}
${contexteSpecifique}
${donneesLocales}

CONSIGNES :
- L'email doit etre ultra-court (150-250 mots). Un email long = un email non lu.
- L'objet doit contenir le nom de ${input.zone_geo.ville} ou d'un quartier pour la pertinence locale
- Le HTML doit etre minimaliste : fond blanc, texte noir, une couleur d'accent (#2563EB), police systeme
- Inclure un placeholder desabonnement : {{unsubscribe_url}}
- Signature : ${input.prenom} ${input.nom} — ${input.reseau}, ${input.zone_geo.ville}
- Le CTA doit etre une action simple : repondre a l'email, appeler, ou cliquer sur un lien unique`

  return { system, user }
}
