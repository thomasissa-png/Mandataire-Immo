# Restructuration de l'offre — ImmoCrew

> Produit par @creative-strategy | 2026-04-02
> Sources : project-context.md, docs/strategy/personas.md, docs/strategy/brand-platform.md

---

## Signal d'alerte préalable

**Incohérence pricing détectée dans project-context.md.**
La promesse de marque (section "Positionnement") indique 197€/mois. Le tableau pricing indique 150€/mois.
Ce document tranche sur 150€/mois (voir section "Résolution" en bas).

---

## Diagnostic

Le problème est exact. La structure actuelle crée une décision séquentielle :
Sophie voit 400€ + 150€ = 550€ premier mois — au-dessus de son budget déclaré (300€/mois max) et en contradiction avec le message "équipe marketing dédiée".

Trois frictions supplémentaires :

1. **Le Pack Lancement ne se suffit pas à lui-même.** Bio + charte + 20 posts = contenu à valeur dégressive. Dès le mois 2, Sophie n'a plus de contenu. Elle est forcée de prendre le mensuel. Cette dépendance est visible — ça ressemble à un funnel piège.
2. **La valeur relative est incohérente.** 400€ one-shot pour du setup (fait une fois) vs 150€/mois pour du contenu récurrent (valeur cumulée chaque mois). Sur 12 mois : 400€ de setup vs 1 800€ de contenu. Le setup coûte trop cher pour ce qu'il vaut.
3. **Paralysie du choix.** Deux offres dont aucune ne se suffit à elle-même = le réflexe naturel est de ne rien choisir.

---

## Les 4 options en 1 tableau

| Option | Structure | Sophie comprend en 10s | Budget OK | Friction | Rétention | MRR 30 clients |
|--------|-----------|----------------------|-----------|----------|-----------|----------------|
| A — Mois 1 augmenté à prix distinct | Mois 1 : 200€ / Mois 2+ : 150€ | Oui | Oui | Faible | Forte | 4 500€ |
| **B — Un seul prix, setup inclus** | **150€/mois, mois 1 augmenté offert** | **Oui** | **Oui** | **Nulle** | **Maximale** | **4 500€** |
| C — 2 packs autonomes | Lancement 400€ OU Mensuel 150€ avec mini-onboarding | Non | Oui | Forte | Correcte | Variable |
| D — Prix unique 200€/mois | 200€ pour toujours, setup inclus | Oui | Limite | Faible | Maximale | 6 000€ |

---

## Recommandation — Option B retenue

**Un seul abonnement à 150€/mois. Mois 1 augmenté, inclus dans le prix.**

### Pourquoi Option B gagne

Option D est meilleure en MRR (6 000€ vs 4 500€), mais 200€/mois dépasse le seuil psychologique de Sophie (67% de son budget max). 150€/mois = 1 vente/an pour rentabiliser — ce calcul, Sophie le fait naturellement, et il est favorable.

Option B supprime tout calcul comparatif. Une décision. Une action. Un abonnement.

Le coût marginal du mois 1 augmenté est quasi-nul (100% IA) — offrir le setup ne grève pas la marge.

### Structure finale

**ImmoCrew — 150€/mois, sans engagement**

| Mois | Contenu |
|------|---------|
| Mois 1 (Setup inclus) | Bio optimisée + charte visuelle + 20 posts + calendrier 30j + 5 annonces + 5 articles SEO locaux + 10 scripts Reels |
| Mois 2+ (Récurrent) | 12 posts (3/sem) + 4 scripts vidéo + 4 articles SEO + 1 newsletter + 4 annonces + 1 email prospection + calendrier mensuel |

Le mois 1 augmenté est présenté comme "Démarrage clé en main inclus" — pas comme "valeur 400€ offerte". Sophie ne doit pas percevoir une remise, mais un service complet.

**Boost Mandat conservé :** 100€/bien, réservé abonnés. Inchangé.

---

## Résolution de l'incohérence pricing (197€ vs 150€)

**Décision : 150€/mois.** La mention "197€/mois" dans la section Positionnement de project-context.md est une version antérieure. 150€ est cohérent avec le budget Sophie, plus simple à communiquer, et l'objectif MRR est atteint via les Boosts Mandat.
Mettre à jour la section "Positionnement" de project-context.md (référence 197€ → 150€).

---

## Scénario de revenus révisé

| Source | Volume | CA mensuel |
|--------|--------|------------|
| Abonnements | 30 clients | 4 500€ |
| Boost Mandat | 14 boosts | 1 400€ |
| **Total** | | **5 900€** |

Atteint l'objectif avec 0.47 boost/client/mois — cohérent avec 4-5 transactions/an.

---

## Impact sur le code existant

- **Landing page** : 1 seule carte pricing (supprimer les 2 packs). Le mois 1 augmenté = feature visible, pas offre séparée.
- **Onboarding** : supprimer la sélection de pack au step 1. Le formulaire brief mois 1 reste mais présenté comme "personnalisation de ton espace".
- **Base de données** : simplifier en `subscription_type = 'monthly'` + flag `is_first_month`. Supprimer le produit one-shot à 400€ dans Stripe.
- **Dashboard client** : affichage conditionnel du volume de livrables selon `is_first_month`.
- **Canal partenariats** : remplacer "offrir le Pack Lancement au team leader" par "offrir le premier mois gratuit" dans project-context.md.

---

## Hypothèses à valider

- [HYPOTHESE : coût marginal du mois 1 augmenté quasi-nul car 100% IA — à confirmer avec estimation tokens Claude mois 1 vs mois N.]
- [HYPOTHESE : Sophie raisonne en "est-ce que je peux me le permettre ce mois-ci ?" plutôt qu'en ROI immédiat — à valider par entretien client ou A/B test landing.]

---

---

## Formules d'engagement

> Décision fondateur 2026-04-02 : scinder l'abonnement unique 150€/mois en 3 formules avec discount à l'engagement.

### Les 3 formules

| Formule | Prix facturé | Équivalent/mois | Économie | Engagement |
|---------|-------------|-----------------|----------|------------|
| Mensuel | 150€/mois | 150€/mois | — | Sans engagement |
| Trimestriel | 360€ / 3 mois | 120€/mois | 30€/mois (20%) | 3 mois |
| Annuel | 1 200€ / an | 100€/mois | 50€/mois (33%) | 12 mois |

**Règles de calcul :** prix ronds, pas de charm pricing. Trimestriel = 150€ × 3 × 0,80 = 360€. Annuel = 150€ × 12 × 0,67 = 1 206€ → arrondi à 1 200€ (cohérence et mémorabilité).

### Logique des discounts

**Pourquoi 20% trimestriel (pas 10-15%) :**
30€/mois économisés = 90€ sur 3 mois — un montant tangible, pas symbolique. En dessous, Sophie fait le calcul et considère que l'économie ne justifie pas l'engagement. 20% est le seuil psychologique minimal pour déclencher un changement comportemental sur une décision à 150€/mois.

**Pourquoi 33% annuel :**
50€/mois économisés = 600€/an = 4 mois offerts. C'est l'argument qui fonctionne : "tu paies 8 mois, tu en as 12". Pour Sophie, 1 200€ en une fois représente 5-6% d'une commission — acceptable si elle a confiance dans le produit.

**Seuil budget Sophie :**
- Mensuel : 150€ — confort total, dans le budget déclaré
- Trimestriel : 360€ paiement unique — au-dessus du budget mensuel mais paiement trimestriel. Présenter en équivalent mensuel (120€) + épargne automatique sur 3 mois
- Annuel : 1 200€ — paiement unique significatif. Réservé aux Sophie qui ont déjà 1-2 mois d'expérience produit (upsell en-cours d'abonnement, pas en acquisition froide)

### Formule featured : Trimestriel

Mettre en avant le Trimestriel, pas l'Annuel. Raisons :
1. Sophie doit d'abord faire confiance au produit — l'Annuel en acquisition froide = objection trésorerie
2. 3 mois = durée suffisante pour voir les premiers résultats (mandats entrants, followers, trafic SEO)
3. 90% de rétention à 3 mois (KPI North Star) — si Sophie reste 3 mois, elle reste 12

### Scénario de revenus — 30 clients

| Formule | Clients | MRR équivalent | Paiements upfront (tréso) |
|---------|---------|----------------|--------------------------|
| Mensuel (40%) | 12 | 1 800€/mois | 0€ |
| Trimestriel (45%) | 13 | 1 560€/mois | 4 680€ tous les 3 mois |
| Annuel (15%) | 5 | 500€/mois | 6 000€/an (~500€/mois) |
| **Total** | **30** | **3 860€/mois** | |
| + Boost Mandat (14 boosts) | — | 1 400€/mois | — |
| **MRR total** | | **5 260€/mois** | |

[HYPOTHESE : répartition 40/45/15 basée sur le comportement observé sur les SaaS avec discount trimestriel — à valider après 3 mois de données réelles.]

Note : le MRR équivalent baisse (3 860€ vs 4 500€ tout-mensuel) mais la trésorerie s'améliore via les paiements upfront. Le Boost Mandat compense l'écart.

### Présentation landing page

**3 cartes pricing, hiérarchie claire :**
- Gauche : Mensuel (sobre, sans badge)
- Centre : Trimestriel — badge "Recommandé" + surlignage couleur primaire
- Droite : Annuel — badge "Meilleur prix"

**CTAs différenciés :**
- Mensuel : "Commencer ce mois" (sans engagement, friction minimale)
- Trimestriel : "Démarrer 3 mois" (engagement volontaire)
- Annuel : "Passer à l'annuel" (réservé aux abonnés existants en priority — proposer aussi en acquisition)

**Économie mise en avant :**
- Trimestriel : "Économise 90€ tous les 3 mois"
- Annuel : "4 mois offerts — économise 600€ par an"

### Boost Mandat — inchangé

100€/bien, réservé abonnés (toutes formules). Le discount d'engagement ne s'applique pas aux Boosts — c'est un achat ponctuel lié à une transaction, pas un abonnement. La cohérence du prix unique 100€/bien sur toutes les formules simplifie la décision.

### Mois gratuit (code promo)

Le mois d'essai gratuit s'applique au Mensuel uniquement. Pour Trimestriel et Annuel : proposer le premier mois à 0€ puis facturation du solde (360€ - 120€ = 240€ ou 1 200€ - 100€ = 1 100€). Cette mécanique évite les abus (inscriptions annuelles gratuites + résiliation).

### Hypothèses à valider

- [HYPOTHESE : répartition clients 40/45/15 — à ajuster selon données réelles à M+3]
- [HYPOTHESE : 20% est le seuil psychologique de discount pour Sophie — à tester via A/B landing page]
- [HYPOTHESE : l'Annuel est mieux converti en upsell (abonnés existants) qu'en acquisition froide — à monitorer via le tunnel Stripe]

---

**Handoff → @fullstack**
- Fichiers produits : `docs/strategy/pricing-restructure.md`
- Décisions prises : offre unique 150€/mois, setup mois 1 inclus, suppression du Pack Lancement comme offre séparée, Boost Mandat conservé à 100€/bien
- Points d'attention :
  - Landing page : 1 carte pricing, pas 2
  - Onboarding : plus de choix de pack au step 1
  - DB : flag `is_first_month` sur la table subscriptions, supprimer le produit Stripe 400€
  - Résoudre l'incohérence 197€ vs 150€ dans project-context.md avant tout déploiement copy
  - Boost Mandat reste un upsell post-abonnement — ne pas le mettre sur la même ligne que l'abonnement
