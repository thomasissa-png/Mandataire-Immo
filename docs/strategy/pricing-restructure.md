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

**Handoff → @fullstack**
- Fichiers produits : `docs/strategy/pricing-restructure.md`
- Décisions prises : offre unique 150€/mois, setup mois 1 inclus, suppression du Pack Lancement comme offre séparée, Boost Mandat conservé à 100€/bien
- Points d'attention :
  - Landing page : 1 carte pricing, pas 2
  - Onboarding : plus de choix de pack au step 1
  - DB : flag `is_first_month` sur la table subscriptions, supprimer le produit Stripe 400€
  - Résoudre l'incohérence 197€ vs 150€ dans project-context.md avant tout déploiement copy
  - Boost Mandat reste un upsell post-abonnement — ne pas le mettre sur la même ligne que l'abonnement
