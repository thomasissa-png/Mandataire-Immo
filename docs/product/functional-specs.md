# Spécifications Fonctionnelles MVP — ImmoCrew

> Produit par @product-manager | 2026-03-25
> Sources : project-context.md, product-vision.md, personas.md, legal-audit.md
> Statut : V1

---

## 1. Landing page (P0)

**Objectif** : Convertir un visiteur mandataire immobilier en lead (CTA formulaire) ou en client (CTA paiement) en moins de 3 minutes de lecture.

**URL** : `immocrew.fr` (page unique type landing — pas de navigation multi-pages au MVP)

### 1.1 Section Hero

**User story** : En tant que mandataire qui arrive sur le site (via LinkedIn, groupe Facebook ou Google), je comprends en 5 secondes ce qu'ImmoCrew fait pour moi et pourquoi c'est différent.

**Contenu attendu** :
- Titre principal (H1) : promesse directe orientée résultat (ex : "Ton équipe marketing à 197€/mois")
- Sous-titre : explication en 1 phrase du service (livrables finis, personnalisés, prêts à publier)
- CTA principal : "Voir un exemple pour ma zone" (lien vers formulaire court) ou "Découvrir les packs"
- Élément visuel : mockup de livrables (posts Instagram, article SEO, annonce) personnalisés avec un vrai quartier

**Critères d'acceptation** :
- [ ] Le hero est visible sans scroll (above the fold) sur desktop et mobile
- [ ] Le titre ne contient aucun jargon marketing (pas de "funnel", "content strategy", "ROI")
- [ ] Le CTA est un bouton visible avec couleur contrastée
- [ ] Temps de chargement < 2s (LCP)
- [ ] Le tutoiement est utilisé conformément au ton de marque

### 1.2 Section Problème / Solution

**User story** : En tant que Sophie (mandataire 2 ans, 4-5 ventes/an), je me reconnais dans les problèmes décrits et je comprends comment ImmoCrew les résout concrètement.

**Contenu attendu** :
- 3-4 problèmes formulés avec les mots du persona : irrégularité des publications, annonces standardisées, page blanche le soir devant Canva, aucun mandat entrant via le digital
- Pour chaque problème : la réponse ImmoCrew en 1 phrase orientée résultat
- Ton : empathique et direct ("Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva.")

**Critères d'acceptation** :
- [ ] Minimum 3 problèmes identifiables par Sophie ET Thomas
- [ ] Chaque problème est formulé à la 2e personne du singulier (tu/toi)
- [ ] Aucune promesse de résultat chiffré (pas de "double tes ventes") — obligation de moyens, pas de résultat (cf. CGV, `docs/legal/legal-audit.md` section 3.1)

### 1.3 Section Avant / Après annonce

**User story** : En tant que mandataire sceptique, je vois la différence concrète entre une annonce standard et une annonce ImmoCrew, et je me dis "c'est exactement ce qu'il me faudrait".

**Contenu attendu** :
- 2-3 exemples côte à côte : annonce "avant" (type "Bel appartement lumineux, proche commerces") vs annonce "après" ImmoCrew (storytelling hyper-local avec quartier, écoles, ambiance, prix au m²)
- Les exemples utilisent de vraies zones géographiques françaises (Angers, Montpellier, Bordeaux)
- Label discret sous chaque exemple : "Contenu produit avec assistance IA — relu et validé par l'équipe ImmoCrew" (obligation AI Act, cf. `docs/legal/legal-audit.md` section 2.2.A)

**Critères d'acceptation** :
- [ ] Minimum 2 avant/après visibles sans interaction (pas de carousel au MVP)
- [ ] Les annonces "après" mentionnent des éléments hyper-locaux vérifiables (nom de quartier, école, transport)
- [ ] Mention IA présente sur chaque exemple (conformité AI Act)
- [ ] Affichage responsive (côte à côte desktop, empilé mobile)

### 1.4 Section Social proof

**User story** : En tant que mandataire hésitant, je vois que d'autres professionnels comme moi utilisent le service et sont satisfaits.

**Contenu attendu** :
- Au lancement (pas de vrais clients) : métriques du service ("X livrables produits", "Y annonces réécrites") + verbatims du beta test
- Dès mois 1-2 : témoignages clients réels avec prénom, réseau (IAD/SAFTI), zone géo, et résultat concret
- Logos des réseaux ciblés (IAD, SAFTI, Capifrance) avec mention "Nos clients viennent de ces réseaux" (pas "partenaires officiels")

**Critères d'acceptation** :
- [ ] Minimum 2 éléments de preuve sociale visibles
- [ ] Aucune mention "partenaire" des réseaux (risque juridique — ImmoCrew n'est pas partenaire officiel)
- [ ] Les témoignages incluent le contexte professionnel (réseau, ancienneté, zone) pour que Sophie/Thomas s'identifient
- [ ] Si témoignages fictifs au lancement : ne pas les présenter comme réels (transparence)

### 1.5 Section Pricing (3 packs)

**User story** : En tant que mandataire intéressé, je comprends les 3 offres, ce qu'elles incluent, et laquelle est faite pour moi. Le prix est justifié par la valeur livrée.

**Contenu attendu** :

| Pack | Prix | Positionnement | Livrables listés |
|------|------|----------------|-----------------|
| **Pack Lancement** | 497€ (one-shot) | "Ton marketing clé en main en 7 jours" | Positionnement, bio optimisée, 5 templates annonces, 5 articles SEO local, calendrier éditorial 30j, 20 posts, 10 scripts Reels, kit graphique |
| **Pack Mensuel** | 197€/mois | "Ton équipe marketing chaque mois" — mis en avant (recommended) | 12 posts/mois, 4 scripts vidéo, 2 articles SEO, 1 newsletter, 4 annonces personnalisées, 1 email prospection |
| **Boost Mandat** | 97€/mandat | "Fais briller ton nouveau bien" | Annonce storytelling, 3 posts + 1 Reel dédiés, mini landing page, email blast acheteurs |

- Chaque pack : bouton CTA distinct
- Sous le pricing : phrase de réassurance ("Pas d'engagement, résiliation libre" pour le mensuel / "Satisfait ou remboursé 14 jours" pour le lancement)
- Tous les prix affichés **TTC** (cible = micro-entrepreneurs, pensent en TTC). Mention "HT" disponible au survol ou en petits caractères.

**Critères d'acceptation** :
- [ ] Les 3 packs sont visibles simultanément (cards côte à côte desktop, empilées mobile)
- [ ] Le Pack Mensuel est visuellement mis en avant (badge "Populaire" ou bordure colorée)
- [ ] Chaque livrable est listé de manière explicite (pas de "et plus encore")
- [ ] Les prix TTC sont affichés en gros, les prix HT en mention secondaire
- [ ] Mention de la garantie 14 jours pour le Pack Lancement (cf. `docs/legal/legal-audit.md` section 3.2)
- [ ] CTA de chaque pack pointe vers Stripe Checkout (cf. section 4)

### 1.6 Section FAQ

**User story** : En tant que mandataire qui hésite encore, je trouve les réponses à mes dernières objections avant de m'engager.

**Contenu attendu** (minimum 8 questions, basées sur les objections personas) :
1. "C'est quoi exactement ImmoCrew ?" → Service de marketing complet, pas un outil
2. "Le contenu est fait par une IA ?" → Oui, avec assistance IA + relecture humaine (transparence AI Act)
3. "Comment c'est personnalisé pour ma zone ?" → Questionnaire d'onboarding, données hyper-locales
4. "197€/mois, c'est rentable ?" → 1 mandat supplémentaire rembourse 1 an
5. "Je n'ai pas le temps de publier." → 3 min par post, copier-coller
6. "Mon réseau me donne déjà des templates." → Templates génériques vs contenu personnalisé
7. "Comment je reçois mes livrables ?" → Espace client en ligne, chaque mois
8. "Je peux arrêter quand je veux ?" → Résiliation libre, pas d'engagement
9. "Qui est derrière ImmoCrew ?" → Présentation du fondateur (transparence, confiance)

**Critères d'acceptation** :
- [ ] Format accordion (question cliquable, réponse dépliable)
- [ ] Minimum 8 questions couvrant les objections de Sophie ET Thomas
- [ ] Mention explicite de l'utilisation d'IA dans au moins 1 réponse (obligation AI Act)
- [ ] Ton tutoiement, direct, sans jargon

### 1.7 Section CTA final (footer de conversion)

**User story** : En tant que visiteur convaincu après lecture de la page, j'ai un dernier CTA clair pour passer à l'action.

**Contenu attendu** :
- Titre de rappel ("Prêt à avoir ton équipe marketing ?")
- CTA principal : "Commencer maintenant" → Stripe Checkout ou formulaire d'onboarding
- CTA secondaire : "Voir un exemple gratuit pour ma zone" → formulaire court (prénom + ville + email)
- Mentions légales en footer : lien CGV, Politique de Confidentialité, Mentions Légales (cf. section 7)

**Critères d'acceptation** :
- [ ] 2 CTA visibles (achat direct + lead magnet)
- [ ] Liens footer obligatoires : CGV, Politique de Confidentialité, Mentions Légales
- [ ] Bandeau cookies visible au premier chargement (cf. section 7)
- [ ] Lien vers contact@immocrew.fr ou formulaire de contact

---

## 2. Formulaire d'onboarding client (P0)

<!-- Zone géo, spécialité, ton, biens en cours, comptes sociaux, logo/photo, préférences contenu -->
[Section à compléter]

---

## 3. Espace client (P0)

<!-- Connexion Clerk, voir livrables du mois, télécharger, historique mois précédents -->
[Section à compléter]

---

## 4. Paiement Stripe (P0)

<!-- Abonnement mensuel 197€, one-shot Pack Lancement 497€, Boost Mandat 97€, checkout, webhooks -->
[Section à compléter]

---

## 5. Dashboard interne — admin (P1)

<!-- Liste clients, statut production, dates livraison, métriques basiques -->
[Section à compléter]

---

## 6. Intégrations IA (P1)

<!-- Pipeline : onboarding → project-context client → agents Gradient → livrables → espace client -->
[Section à compléter]

---

## 7. Exigences légales transverses (P0)

<!-- Mentions IA (AI Act), banner cookies, CGV, mentions légales, RGPD — cf. docs/legal/legal-audit.md -->
[Section à compléter]

---

*Document produit par @product-manager dans le cadre du framework Gradient Agents.*
