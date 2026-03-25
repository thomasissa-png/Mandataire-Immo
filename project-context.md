# Contexte Projet — ImmoCrew

> Ce fichier est lu par tous les agents avant toute action.
> Remplis chaque champ. Les champs vides bloquent les agents.
> **ATTENTION** : ce fichier peut contenir des informations stratégiques (budget, pricing, concurrents). S'assurer que le repo est **privé** si des données confidentielles y sont renseignées.
> Dernière mise à jour : 2026-03-25

---

## Identité
- **Nom du projet** : ImmoCrew (nom de travail — à valider)
- **URL (si existante)** : immocrew.fr (à réserver)
- **Secteur** : Marketing digital pour professionnels de l'immobilier (mandataires indépendants)
- **Stade** : [x] Idée  [ ] MVP  [ ] Beta  [ ] Production  [ ] Croissance
- **Date de début** : 2026-03-25

---

## Cible
- **Persona principal** : Sophie, 38 ans, mandataire immobilière chez IAD depuis 2 ans. Elle fait 4-5 transactions/an pour un CA de ~22K€ de commissions. Elle sait qu'elle devrait poster sur les réseaux sociaux et travailler son SEO local, mais elle n'a ni le temps ni les compétences. Elle publie 2 semaines, disparaît 3 mois. Ses annonces ressemblent à toutes les autres : "Bel appartement lumineux, proche commerces." Elle rêve d'avoir une équipe marketing mais ne peut pas se la payer. Son réseau lui fournit des templates Canva génériques qu'elle n'utilise même plus.
- **Problème principal** : Pas de visibilité locale = pas de mandats entrants = dépendance au porte-à-porte et au bouche-à-oreille. 65% des pros immobiliers n'ont pas de compétences digitales. Le contenu marketing régulier et personnalisé est un cauchemar pour un indépendant seul.
- **Alternative actuelle** : Templates génériques du réseau (IAD, SAFTI) + tentatives sporadiques sur Canva + posts Instagram irréguliers + parfois un CM freelance à 300-800€/mois avec des résultats médiocres. Cocoon-Immo pour les agences (99-299€/mois) mais peu adapté aux mandataires indépendants.
- **Persona secondaire** : Thomas, 45 ans, mandataire expérimenté (5+ ans, 10 transactions/an). Il a compris l'importance du digital mais veut déléguer intégralement. Budget plus élevé, attentes de qualité supérieures. Cible premium (pack complet).

---

## Positionnement
- **Promesse unique** : Ton équipe marketing dédiée à 197€/mois — chaque mois, tu reçois tes posts, tes articles SEO, tes annonces, et tes scripts vidéo, 100% personnalisés pour ta zone, tes biens, et ton personal branding. Tu publies, on fait le reste.
- **Ton de marque** : Direct et complice — comme un collègue marketing qui te tutoie, parle concret, et ne te fait jamais sentir idiot de ne pas maîtriser le digital. Zéro jargon inutile, 100% orienté résultats.
- **3 mots qui DÉFINISSENT la marque** : Concret, Personnalisé, Efficace
- **3 mots qui ne DÉFINISSENT PAS la marque** : Générique, Technique, Froid
- **Concurrent principal** : Cocoon-Immo (99€/mois SaaS self-service, 299€/mois clé-en-main avec chef de projet)
- **Notre différence clé vs lui** : Cocoon-Immo vend des OUTILS (templates, planificateur). ImmoCrew livre des RÉSULTATS FINIS — posts prêts à publier, articles rédigés, annonces personnalisées. C'est la différence entre donner un marteau et livrer la maison construite. De plus, chaque livrable est hyper-personnalisé (quartier, rue, écoles, transports, prix au m²) — pas un template avec le nom de la ville en variable.

---

## Objectifs
- **Objectif principal à 6 mois** : 30 clients récurrents, MRR 5 900€ (mix packs mensuels + lancements + boosts)
- **KPI North Star** : Nombre de clients récurrents actifs (abonnés au pack mensuel)
- **Objectif secondaire** : 90% de rétention à 3 mois (un client qui reste 3 mois reste 12 mois)
- **Ce que le succès ressemble à 12 mois** : 60+ clients récurrents, MRR 12K€+, acquisition 100% organique, 2 premiers partenariats team leaders réseau, NPS ≥60, opérations gérées en <8h/semaine

---

## Stack technique
- **Frontend** : [x] Next.js  [ ] React  [ ] Expo/React Native  [ ] Autre :
- **Backend** : API Routes Next.js + Server Actions
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Clerk
- **Hébergement** : Replit (Deployments)
- **Outils IA utilisés** : Claude API (génération de contenu personnalisé via le framework Gradient Agents — 19 agents coordonnés : @copywriter, @seo, @geo, @social, @design, @creative-strategy)
- **Budget IA mensuel (tokens)** : À définir (estimation : 50-100€/mois pour 30 clients)
- **Volume d'usage IA prévu** : ~30 sessions d'agents/mois (1 par client), chaque session génère 12 posts + 2 articles + 4 annonces + 4 scripts vidéo
- **Latence IA cible** : Pas de contrainte temps réel — production batch, livrables livrés sous 24-48h
- **Outils d'analytics** : PostHog

---

## Modèle économique et juridique
- **Modèle économique** : [x] SaaS  [ ] E-commerce  [ ] Marketplace  [ ] App mobile  [ ] Site vitrine  [ ] API/produit technique  [ ] Média/contenu  [ ] Open source  [ ] Autre : Service productisé (abonnement + one-shots)
- **Pays de commercialisation** : France
- **Données sensibles collectées** : [x] Non  [ ] Oui (on collecte uniquement : nom, zone géographique, spécialité immobilière, ton de communication — aucune donnée financière client)
- **Utilisation d'IA générative** : [x] Oui — usage prévu : Production intégrale du contenu marketing (textes, scripts, stratégie) via agents IA coordonnés. Les livrables sont relus/validés avant livraison.

### Détail du pricing

| Offre | Prix | Contenu | Cible |
|-------|------|---------|-------|
| Pack Lancement (one-shot) | 497€ | Positionnement, bio optimisée, 5 templates annonces, 5 articles SEO local, calendrier éditorial 30j, 20 posts, 10 scripts Reels, kit graphique | Nouveaux clients — onboarding |
| Pack Mensuel | 197€/mois | 12 posts/mois, 4 scripts vidéo, 2 articles SEO, 1 newsletter, 4 annonces personnalisées, 1 email prospection | Récurrent — cœur du business |
| Boost Mandat (upsell) | 97€/mandat | Annonce storytelling, 3 posts + 1 Reel dédiés, mini landing page, email blast acheteurs | Ponctuel — par bien à vendre |

### Scénario de revenus (objectif 5K/mois)

| Source | Volume | CA mensuel |
|--------|--------|------------|
| Packs mensuels | 15 clients | 2 955€ |
| Packs lancement | 2/mois | 994€ |
| Boosts mandat | 10/mois | 970€ |
| **Total** | | **4 919€** |

---

## Contraintes
- **Budget mensuel infrastructure** : < 100€ (Replit + Supabase + domaine + email)
- **Budget mensuel acquisition** : 0€ — acquisition 100% organique (SEO, LinkedIn, groupes Facebook, Product Hunt, partenariats)
- **Budget analytics** : 0€ (PostHog gratuit tier)
- **Timeline de lancement** : Site + Pack Lancement opérationnel en 2 semaines. Premiers clients beta en semaine 3. Facturation dès le mois 2.
- **Contraintes légales ou sectorielles** : RGPD standard. Loi Hoguet (pas de contrainte directe — on ne fait pas de transaction immobilière). Mention obligatoire que le contenu est produit avec assistance IA si requis par évolution réglementaire.
- **Ressources disponibles** : [x] Solo + framework Gradient Agents (19 agents IA)

---

## Existant (projets en place uniquement)
- **URL du site actuel** : Aucun (création from scratch)
- **Comptes sociaux existants** : À créer (LinkedIn company page, Instagram, YouTube)
- **Outils analytics en place** : Aucun
- **Contenu existant** : Aucun
- **Historique SEO** : Aucun (nouveau domaine)

---

## Stratégie d'acquisition — Funnel détaillé (brief pour @growth et @social)

### Canal #1 — LinkedIn (conversion rapide, prioritaire)
- **Cible** : Mandataires IAD, SAFTI, Capifrance actifs sur LinkedIn
- **Tactique** : 50 DMs/semaine avec avant/après d'une de LEURS annonces réécrite gratuitement
- **Hook** : "J'ai réécrit une de tes annonces avec mon équipe IA. Gratuit. Voici le résultat."
- **Conversion attendue** : 20% réponse → 10% conversion = ~4 clients/mois
- **Contenu organique** : 3 posts/semaine (avant/après annonces, tips concrets, cas clients)

### Canal #2 — Groupes Facebook (acquisition communautaire)
- **Cible** : Groupes "Mandataires immobiliers France", groupes IAD non-officiels, groupes SAFTI
- **Tactique** : Apporter de la valeur (tips, templates gratuits, réponses aux questions). Aider 50 personnes → 5 achètent.
- **Conversion attendue** : 1-2 clients/mois

### Canal #3 — YouTube + SEO (moteur long terme)
- **Requêtes cibles** : "comment écrire une annonce immobilière", "calendrier éditorial agent immobilier", "se différencier mandataire IAD", "Google Business Profile agent immobilier"
- **Format** : Vidéos 5-10 min, scripts générés par @copywriter, optimisés par @seo
- **Conversion attendue** : 1-2 clients/mois à partir du mois 3-4

### Canal #4 — Partenariats team leaders
- **Cible** : Responsables de secteur IAD/SAFTI/Capifrance (équipes de 10-50 mandataires)
- **Tactique** : Offrir le Pack Lancement gratuit au team leader, il recommande à son équipe
- **Conversion attendue** : 1 partenariat/trimestre = 5-15 clients d'un coup

### Lancement Product Hunt + IndieHackers
- Lancement programmé semaine 3. Story : "J'ai créé une équipe de 19 agents IA qui fait le marketing des agents immobiliers."

---

## Brief créatif (pour @creative-strategy et @copywriter)

### Positionnement narratif
ImmoCrew n'est PAS un outil. C'est une ÉQUIPE. Le mandataire rêve d'avoir un directeur marketing, un graphiste, un rédacteur, un community manager. Il ne peut pas se les payer. ImmoCrew lui donne tout ça pour 197€/mois. C'est la démocratisation de l'équipe marketing.

### Angle émotionnel
"Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva." Le mandataire veut faire de l'immobilier — visiter des biens, rencontrer des vendeurs, closer des mandats. Pas écrire des posts Instagram à 22h. ImmoCrew lui rend son métier.

### Preuve sociale à construire
- Avant/après d'annonces (le livrable le plus visuel et convaincant)
- Témoignages clients beta dès le mois 1
- Statistiques d'engagement des posts (likes, vues, contacts entrants)

---

## Brief technique (pour @fullstack et @infrastructure)

### MVP — Ce qui doit exister au lancement
1. **Landing page** : hero + problème + solution + pricing + CTA + FAQ
2. **Formulaire d'onboarding client** : questionnaire qui alimente le project-context de chaque client (zone géo, spécialité, ton, biens en cours, comptes sociaux, logo/photo)
3. **Espace client simple** : le client se connecte, voit ses livrables du mois, les télécharge
4. **Paiement** : Stripe Checkout (abonnement mensuel + one-shots)
5. **Dashboard interne** : liste des clients, statut de production, dates de livraison

### Ce qui peut attendre le mois 2+
- Automatisation de la production (pipeline agents → livrables automatiques)
- Intégration Calendly pour le call d'onboarding
- Email automatiques (bienvenue, livraison, relance)

---

## Risques identifiés (brief pour @elon et @reviewer)

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|------------|
| Churn brutal (30-40% des mandataires quittent le métier en 2 ans) | Haute | Élevé | Cibler mandataires 1+ an d'XP. Contrats trimestriels minimum. |
| Livrables perçus comme génériques/IA | Moyenne | Critique | Investir dans l'onboarding (questionnaire détaillé). Personnalisation hyper-locale obligatoire. |
| Réseaux (IAD, SAFTI) internalisent le marketing IA | Moyenne | Élevé | Aller plus loin qu'eux (SEO local, personal branding complet, pas juste des templates). |
| Plafond solo à 50+ clients | Haute | Moyen | Automatiser dès le jour 1. Chaque client = un project-context pré-rempli, agents font 95%. |
| Saisonnalité immobilière (août, décembre) | Certaine | Moyen | Contrats trimestriels. Contenu "hors saison" (bilan annuel, préparation rentrée). |
| SEO lent (3-6 mois pour ranker) | Certaine | Faible | LinkedIn et groupes Facebook comme canaux rapides en attendant. |

---

## Historique des interventions agents

> Ce tableau est le journal de bord du projet. Chaque agent DOIT le compléter après chaque livrable.
> La colonne "Pourquoi" est obligatoire : elle capture le raisonnement, pas juste la décision.
> Tout agent démarrant une session DOIT lire ce tableau pour comprendre les décisions passées et leur justification.

| Agent | Date | Livrable produit | Décisions clés | Pourquoi / Alternatives écartées |
|-------|------|-----------------|----------------|----------------------------------|
| @elon | 2026-03-25 | Audit stratégique (verbal) | Choix de la verticale immobilier — mandataires indépendants. Pricing 497/197/97. Combo agence + SaaS. | Immobilier choisi car : marché de 84K+ mandataires, mal desservi en marketing digital, ticket moyen d'une commission rembourse 6-12 mois d'abonnement. Mandataires plutôt qu'agences car : plus nombreux, seuls (pas de marketing interne), pensent en entrepreneurs. Alternatives écartées : newsletter premium (trop lent à monétiser), SaaS SEO généraliste (marché encombré), marketplace micro-services (ne scale pas). |

---

## Performance des agents

> Ce tableau mesure la qualité de chaque intervention. Rempli par l'agent après livraison, validé/corrigé par @reviewer.
> Un agent avec 2+ interventions à <3/5 en spécificité → son prompt doit être revu.

| Agent | Date | Livrable | Complétude | Cohérence | Actionnabilité | Messages | Spécificité | Notes |
|-------|------|----------|------------|-----------|----------------|----------|-------------|-------|
| | | | | | | | | |

---

## Notes libres

### Contexte fondateur
Le fondateur dispose d'un framework multi-agents (Gradient Agents — 19 agents IA coordonnés) qui a déjà livré 4 projets de A à Z avec succès. Ce framework EST l'avantage compétitif : il permet de produire des livrables marketing de qualité professionnelle à un coût marginal quasi-nul. Le projet ImmoCrew est le premier projet conçu pour être opéré quasi-intégralement par les agents post-lancement.

### Philosophie produit
"Le meilleur test c'est le vol, pas la simulation." — Validation par l'action : dès la semaine 1, réécrire l'annonce d'un vrai mandataire et la lui envoyer gratuitement. Si ça génère de l'intérêt, on a la validation. Si ça tombe à plat, on a économisé 6 mois.

### Charge de travail cible post-lancement
- Production contenu par client : ~1-2h/mois (orchestration agents + QA)
- Acquisition : ~2-3h/semaine (LinkedIn, contenu, groupes)
- Objectif régime de croisière (30+ clients) : < 8h/semaine total
