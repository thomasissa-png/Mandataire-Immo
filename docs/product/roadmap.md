# Roadmap 6 mois — ImmoCrew

> Produit par @product-manager | 2026-03-25
> Sources : project-context.md, product-vision.md, brand-platform.md
> Période : mars 2026 — septembre 2026

---

## Semaine 1-2 : MVP (Lancement technique)

**Livrables clés :**
- Landing page complète : hero ("Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva"), problème, solution, pricing 3 offres, FAQ, témoignages placeholder, CTA
- Formulaire d'onboarding client (zone géo, spécialité, ton, biens en cours, comptes sociaux, logo/photo) → alimente le project-context par client
- Paiement Stripe Checkout : Pack Lancement 497€, Pack Mensuel 197€/mois, Boost Mandat 97€
- Espace client basique (Clerk auth + page de téléchargement des livrables du mois)
- Mentions légales, CGV (B2B, garantie 14j volontaire), politique de confidentialité RGPD
- Domaine immocrew.fr réservé + déploiement Replit
- PostHog intégré (analytics basiques)

**Métriques de succès :**
- Site live et fonctionnel (0 bug bloquant sur le parcours achat)
- Paiement Stripe test réussi sur les 3 offres
- Formulaire d'onboarding fonctionnel (données enregistrées en Supabase)

**Risques :**
- Scope creep sur le design → se limiter au MVP, pas de polish visuel excessif
- Intégration Stripe/Clerk/Supabase plus longue que prévu → prévoir 2j de marge

**Dépendances :**
- Domaine immocrew.fr réservé
- Compte Stripe activé (vérification identité)
- Contenus juridiques validés (cf. legal-audit.md)

---

## Semaine 3-4 : Beta & Premiers clients

**Livrables clés :**
- 3-5 clients beta recrutés via LinkedIn DMs (annonce réécrite gratuitement → conversion Pack Lancement)
- Production manuelle des premiers livrables via agents Gradient (1 session complète par client)
- Avant/après d'annonces réelles documentés (captures + métriques)
- Collecte de 2-3 témoignages clients (verbatim + photo)
- Lancement Product Hunt ("19 agents IA font le marketing des agents immobiliers")
- Post IndieHackers (building in public, chiffres réels)
- Création comptes sociaux : LinkedIn company, Instagram, YouTube

**Métriques de succès :**
- 3-5 clients beta actifs (au moins 1 payant)
- Délai de livraison Pack Lancement < 7 jours
- Taux d'utilisation des livrables > 50% (posts effectivement publiés par le client)
- 1 témoignage exploitable sur la landing page

**Risques :**
- Livrables perçus comme génériques → investir 30 min de personnalisation manuelle par client au-delà des agents
- Pas assez de réponses LinkedIn → augmenter le volume à 50 DMs/semaine, varier les hooks
- Product Hunt flop → pas grave, c'est un bonus, pas le canal principal

**Dépendances :**
- Pipeline agents Gradient opérationnel (19 agents testés sur 1 client réel)
- Landing page live avec témoignages intégrables
- Au moins 5 annonces réelles récupérées pour les avant/après

---

## Mois 2-3 : Itération & Stabilisation

**Livrables clés :**
- Dashboard interne (liste clients, statut production par client, dates de livraison, historique)
- Emails automatiques : bienvenue post-achat, livraison mensuelle (lien espace client), relance J+3 si non téléchargé
- Intégration Calendly pour call d'onboarding 15 min (lien dans le flow post-achat)
- Optimisation pipeline agents : réduire le temps de production de 2h à 1h par client
- Templates de QA standardisés (checklist avant livraison : personnalisation locale, ton, zéro erreur factuelle)
- LinkedIn organique : 3 posts/semaine (avant/après, tips, cas clients)
- Premiers posts dans les groupes Facebook mandataires (apport de valeur, pas de promo directe)

**Métriques de succès :**
- 10-15 clients actifs (mix Pack Lancement + Pack Mensuel)
- MRR ~2 000-3 000€
- Délai de livraison mensuel < 48h
- Rétention mois 1 → mois 2 : 100% (zéro churn sur les premiers clients)
- Temps de production par client < 1.5h

**Risques :**
- Charge opérationnelle qui explose avec 10+ clients → dashboard interne critique, ne pas reporter
- Churn des premiers clients si les livrables mois 2 sont moins bons que le Pack Lancement → QA rigoureuse, appel de suivi au mois 2
- Emails automatiques mal configurés → tester sur soi-même avant activation

**Dépendances :**
- Outil d'emailing choisi (Resend ou Loops — rester sur du gratuit/low-cost)
- Calendly account (free tier suffit)
- Retours clients beta intégrés dans le pipeline agents

---

## Mois 4-6 : Scale & Acquisition

**Livrables clés :**
- Automatisation poussée : pipeline agents → livrables quasi-automatiques (intervention humaine = QA seule, 30 min/client)
- SEO : 2 articles/semaine sur le blog ImmoCrew (requêtes cibles : "comment écrire une annonce immobilière", "calendrier éditorial agent immobilier", etc.)
- YouTube : 2 vidéos/mois (scripts par @copywriter, SEO par @seo)
- Premiers partenariats team leaders IAD/SAFTI : 1 Pack Lancement offert au team leader → recommandation équipe (5-15 filleuls)
- Upsell Boost Mandat systématique : email automatique à chaque client quand il mentionne un nouveau bien
- Page cas clients sur le site (3-5 avant/après avec métriques)
- Contrats trimestriels optionnels (-10%) pour réduire le churn

**Métriques de succès :**
- 30 clients récurrents actifs
- MRR 5 900€ (15 mensuels + 2 lancements/mois + 10 boosts/mois)
- Rétention à 3 mois >= 90%
- Temps opérationnel total < 8h/semaine
- 1 partenariat team leader actif (5+ clients issus du partenariat)
- 3+ articles rankés en page 1 Google sur des requêtes locales

**Risques :**
- Plafond solo à 30+ clients → l'automatisation est non-négociable, prioriser sur tout le reste
- Partenariats team leaders lents à concrétiser → démarrer les conversations dès le mois 3
- SEO trop lent (3-6 mois pour ranker) → accepté, LinkedIn et Facebook restent les canaux rapides
- Saisonnalité août : préparer des contenus "hors saison" (bilan, préparation rentrée) dès juillet

**Dépendances :**
- Blog technique opérationnel sur immocrew.fr
- Chaîne YouTube créée et optimisée
- Au moins 10 clients actifs pour avoir assez de cas clients crédibles
- Pipeline agents suffisamment fiable pour < 30 min de QA par client

---

## Jalons clés (résumé)

| Jalon | Date cible | Critère de validation |
|-------|-----------|----------------------|
| Site live + paiement fonctionnel | 8 avril 2026 | 1er paiement test réussi |
| Premier client payant | 15 avril 2026 | Pack Lancement facturé |
| 5 clients actifs | 30 avril 2026 | 5 comptes avec livrables livrés |
| 10 clients récurrents | 31 mai 2026 | 10 abonnés Pack Mensuel |
| Opérations < 2h/jour | 30 juin 2026 | Tracking temps réel |
| 1er partenariat team leader | 31 juillet 2026 | Accord signé |
| 30 clients, MRR 5 900€ | 30 septembre 2026 | Dashboard Stripe |

---

*Document produit dans le cadre du framework Gradient Agents.*
*Référence : project-context.md, product-vision.md, brand-platform.md*
