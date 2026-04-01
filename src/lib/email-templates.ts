/**
 * Templates email nurturing — ImmoCrew
 *
 * 3 emails de séquence post-inscription : J+2, J+7, J+14.
 * HTML inline simple, responsive, couleurs ImmoCrew.
 * Ton : brand-voice.md — complice, concret, tutoiement.
 */

import { PACK_MENSUEL } from "@/lib/pricing"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailTemplateParams {
  prenom: string
  email: string
  dashboardUrl: string
  pricingUrl: string
  unsubscribeUrl: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// ---------------------------------------------------------------------------
// Couleurs ImmoCrew
// ---------------------------------------------------------------------------

const COLORS = {
  bleuNuit: "#1B2A4A",
  orange: "#F27A1A",
  orangeHover: "#D9680F",
  fondGris: "#F8F9FA",
  textePrincipal: "#1B2A4A",
  texteSecondaire: "#6B7280",
  blanc: "#FFFFFF",
} as const

// ---------------------------------------------------------------------------
// Layout HTML partagé
// ---------------------------------------------------------------------------

function wrapInLayout(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ImmoCrew</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.fondGris};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COLORS.fondGris};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:${COLORS.blanc};border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="background-color:${COLORS.bleuNuit};padding:24px 32px;text-align:center;">
<span style="font-size:24px;font-weight:700;color:${COLORS.blanc};letter-spacing:0.5px;">ImmoCrew</span>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:32px;color:${COLORS.textePrincipal};font-size:16px;line-height:1.6;">
${content}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:24px 32px;background-color:${COLORS.fondGris};text-align:center;font-size:13px;color:${COLORS.texteSecondaire};line-height:1.5;">
<p style="margin:0 0 8px;">ImmoCrew — Ton équipe marketing immobilier</p>
<p style="margin:0 0 8px;">VERSI — 75 rue de la République, 69002 Lyon</p>
<p style="margin:0;"><a href="${unsubscribeUrl}" style="color:${COLORS.texteSecondaire};text-decoration:underline;">Se désinscrire</a></p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
<tr>
<td style="background-color:${COLORS.orange};border-radius:6px;">
<a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;color:${COLORS.blanc};font-size:16px;font-weight:600;text-decoration:none;">
${text}
</a>
</td>
</tr>
</table>`
}

// ---------------------------------------------------------------------------
// J+2 — "Tes premiers contenus sont prêts" (Pack Lancement)
// ---------------------------------------------------------------------------

export function nurturingJ2(params: EmailTemplateParams): EmailTemplate {
  const { prenom, dashboardUrl, unsubscribeUrl } = params
  const prixMensuel = PACK_MENSUEL.price

  const subject = `Salut ${prenom} — ton kit marketing est prêt !`

  const html = wrapInLayout(`
<p style="margin:0 0 16px;font-size:18px;font-weight:600;">Salut ${prenom},</p>

<p style="margin:0 0 16px;">Ton Pack Lancement est prêt. Voici ce qu'on a préparé pour toi :</p>

<ul style="margin:0 0 16px;padding-left:20px;">
<li style="margin-bottom:8px;">Tes <strong>20 posts</strong> personnalisés pour tes réseaux</li>
<li style="margin-bottom:8px;">Tes <strong>5 articles SEO</strong> sur ta zone</li>
<li style="margin-bottom:8px;">Tes <strong>5 annonces</strong> rédigées pour tes biens</li>
<li style="margin-bottom:8px;">Tes <strong>10 scripts Reels</strong></li>
<li style="margin-bottom:8px;">Ton <strong>plan de publication</strong> sur 30 jours</li>
</ul>

<p style="margin:0 0 16px;">Tout est dans ton espace client. Tu ouvres, tu copies, tu publies. 3 minutes par post.</p>

${ctaButton("Voir mes contenus", dashboardUrl)}

<p style="margin:0 0 16px;">Et pour la suite ? Le <strong>Pack Mensuel à ${prixMensuel}€/mois</strong>, c'est 12 posts, 4 articles SEO et 4 annonces livrés chaque mois. Comme ça, tu ne retombes pas dans le silence radio au bout de 30 jours.</p>

<p style="margin:0 0 8px;">À très vite,</p>
<p style="margin:0;font-weight:600;">L'équipe ImmoCrew</p>
`, unsubscribeUrl)

  const text = `Salut ${prenom},

Ton Pack Lancement est prêt. Voici ce qu'on a préparé pour toi :

- 20 posts personnalisés pour tes réseaux
- 5 articles SEO sur ta zone
- 5 annonces rédigées pour tes biens
- 10 scripts Reels
- Ton plan de publication sur 30 jours

Tout est dans ton espace client : ${dashboardUrl}

Tu ouvres, tu copies, tu publies. 3 minutes par post.

Et pour la suite ? Le Pack Mensuel à ${prixMensuel}€/mois, c'est 12 posts, 4 articles SEO et 4 annonces livrés chaque mois.

À très vite,
L'équipe ImmoCrew`

  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// J+7 — "Comment ça se passe ?" (tous les clients)
// ---------------------------------------------------------------------------

export function nurturingJ7(params: EmailTemplateParams): EmailTemplate {
  const { prenom, unsubscribeUrl } = params

  const subject = `${prenom}, tu as publié tes premiers posts ?`

  const html = wrapInLayout(`
<p style="margin:0 0 16px;font-size:18px;font-weight:600;">Salut ${prenom},</p>

<p style="margin:0 0 16px;">Ça fait une semaine que tu as rejoint ImmoCrew. Tu as eu le temps de publier tes premiers posts ?</p>

<p style="margin:0 0 8px;font-weight:600;">3 conseils pour maximiser l'impact :</p>

<ol style="margin:0 0 16px;padding-left:20px;">
<li style="margin-bottom:12px;"><strong>La régularité, c'est la clé.</strong> Mieux vaut 3 posts par semaine qu'un gros batch tous les 15 jours. Les algorithmes récompensent la constance.</li>
<li style="margin-bottom:12px;"><strong>Pense local.</strong> Ajoute toujours le nom de ta ville ou de ton quartier dans tes posts. #ImmobilierLyon, #AppartementVilleubanneGratteCiel — les hashtags locaux attirent les bons contacts.</li>
<li style="margin-bottom:12px;"><strong>Les stories, c'est gratuit.</strong> Repartage tes posts en story avec un petit commentaire perso. Ça double ta visibilité sans effort.</li>
</ol>

<p style="margin:0 0 16px;">Une question ? Un truc qui bloque ? Réponds à cet email, on est là.</p>

${ctaButton("Besoin d'aide ? Écris-nous", "mailto:contact@immocrew.fr")}

<p style="margin:0 0 8px;">À bientôt,</p>
<p style="margin:0;font-weight:600;">L'équipe ImmoCrew</p>
`, unsubscribeUrl)

  const text = `Salut ${prenom},

Ça fait une semaine que tu as rejoint ImmoCrew. Tu as eu le temps de publier tes premiers posts ?

3 conseils pour maximiser l'impact :

1. La régularité, c'est la clé. Mieux vaut 3 posts par semaine qu'un gros batch tous les 15 jours. Les algorithmes récompensent la constance.

2. Pense local. Ajoute toujours le nom de ta ville ou de ton quartier dans tes posts. #ImmobilierLyon, #AppartementVilleubanneGratteCiel — les hashtags locaux attirent les bons contacts.

3. Les stories, c'est gratuit. Repartage tes posts en story avec un petit commentaire perso. Ça double ta visibilité sans effort.

Une question ? Un truc qui bloque ? Réponds à cet email, on est là.

À bientôt,
L'équipe ImmoCrew`

  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// J+14 — "Ton bilan 2 semaines" (Pack Lancement sans mensuel)
// ---------------------------------------------------------------------------

export function nurturingJ14(params: EmailTemplateParams): EmailTemplate {
  const { prenom, pricingUrl, unsubscribeUrl } = params
  const prixMensuel = PACK_MENSUEL.price

  const subject = `2 semaines déjà — tu passes au mensuel, ${prenom} ?`

  const html = wrapInLayout(`
<p style="margin:0 0 16px;font-size:18px;font-weight:600;">Salut ${prenom},</p>

<p style="margin:0 0 16px;">Ça fait 2 semaines que tu as reçu ton Pack Lancement. Si tu as commencé à publier, tu as dû voir les premiers retours : des likes, des commentaires, peut-être un contact entrant.</p>

<p style="margin:0 0 8px;font-weight:600;">Ce qu'on t'a livré :</p>
<ul style="margin:0 0 16px;padding-left:20px;">
<li style="margin-bottom:6px;">20 posts prêts à publier</li>
<li style="margin-bottom:6px;">5 articles SEO pour ta zone</li>
<li style="margin-bottom:6px;">5 annonces rédigées</li>
<li style="margin-bottom:6px;">10 scripts Reels</li>
</ul>

<p style="margin:0 0 16px;">Mais dans 2 semaines, tu auras tout utilisé. Et c'est là que la plupart des mandataires retombent dans le silence radio — 2 mois sans poster, les algorithmes t'oublient.</p>

<p style="margin:0 0 16px;"><strong>Le Pack Mensuel à ${prixMensuel}€/mois</strong>, c'est simple : chaque mois, tu reçois 12 posts, 4 scripts vidéo, 4 articles SEO, 4 annonces et 1 newsletter. Sans engagement — tu arrêtes quand tu veux.</p>

<p style="margin:0 0 16px;">Si tu veux continuer à poster régulièrement sans y passer tes soirées, c'est fait pour toi.</p>

${ctaButton("Voir le Pack Mensuel", pricingUrl)}

<p style="margin:0 0 16px;font-size:14px;color:${COLORS.texteSecondaire};">Tu connais un collègue mandataire qui galère avec ses réseaux ? Transfère-lui cet email — on lui offrira un diagnostic gratuit de sa présence en ligne.</p>

<p style="margin:0 0 8px;">À bientôt,</p>
<p style="margin:0;font-weight:600;">L'équipe ImmoCrew</p>
`, unsubscribeUrl)

  const text = `Salut ${prenom},

Ça fait 2 semaines que tu as reçu ton Pack Lancement. Si tu as commencé à publier, tu as dû voir les premiers retours.

Ce qu'on t'a livré :
- 20 posts prêts à publier
- 5 articles SEO pour ta zone
- 5 annonces rédigées
- 10 scripts Reels

Mais dans 2 semaines, tu auras tout utilisé. Et c'est là que la plupart des mandataires retombent dans le silence radio.

Le Pack Mensuel à ${prixMensuel}€/mois, c'est simple : chaque mois, tu reçois 12 posts, 4 scripts vidéo, 4 articles SEO, 4 annonces et 1 newsletter. Sans engagement.

Si tu veux continuer à poster régulièrement sans y passer tes soirées, c'est fait pour toi.

Voir le Pack Mensuel : ${pricingUrl}

Tu connais un collègue mandataire qui galère avec ses réseaux ? Transfère-lui cet email — on lui offrira un diagnostic gratuit de sa présence en ligne.

À bientôt,
L'équipe ImmoCrew`

  return { subject, html, text }
}
