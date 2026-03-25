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
| @juridique | 2026-03-25 | Audit juridique complet (`docs/legal/legal-audit.md`) | RGPD : base légale par traitement, inventaire 6 sous-traitants avec DPA requis, transferts hors UE identifiés (Clerk, Replit, Anthropic). AI Act : risque limité, obligations de transparence uniquement. CGV : cadre B2B avec garantie commerciale 14j recommandée. Loi Hoguet : non-application confirmée. | Choix de base légale "exécution du contrat" plutôt que "consentement" pour les traitements principaux car plus robuste en B2B (pas de retrait possible). Recommandation de garantie 14j volontaire malgré non-obligation B2B car réduit la friction commerciale et protège contre requalification du statut d'agent commercial. 3 points marqués "À vérifier avec un juriste" : transferts USA post-DPF, obligation DPIA pour IA générative, et qualification de l'assistance à la commercialisation sous Hoguet. |
| @agent-factory | 2026-03-25 | Agent @mandataire (`.claude/agents/mandataire.md`) | Création d'un agent "testeur métier" incarnant Sophie (persona principal) enrichie de détails réalistes IAD : journée type, rapport à l'argent, vie réseau, vocabulaire terrain. Grille d'évaluation à 8 critères (clarté, jargon, utilité terrain, faisabilité, crédibilité, prix/valeur, ton, réalisme métier). Verdicts en 3 niveaux : FONCE / À RETRAVAILLER / ÇA NE MARCHERA PAS. | Agent conçu comme filtre de réalité terrain plutôt que comme producteur de contenu. Modèle Sonnet (pas Opus) car le rôle est évaluation/réaction, pas raisonnement complexe. Tools limités à Read/Glob/Grep (lecture seule) car l'agent ne produit pas de fichiers — il évalue. Alternative écartée : agent générique "QA utilisateur" — trop abstrait, on a préféré incarner le persona réel pour des retours plus authentiques. |
| @product-manager | 2026-03-25 | Roadmap 6 mois (`docs/product/roadmap.md`) | 4 phases (S1-2 MVP, S3-4 Beta, M2-3 Stabilisation, M4-6 Scale). Jalons datés d'avril à septembre 2026. Chaque phase : livrables, métriques, risques, dépendances. | Structure alignée sur le project-context (timeline 2 semaines MVP, beta S3, facturation M2). Risques repris du tableau existant et déclinés par phase. Pas de phase "réflexion stratégique" — chaque semaine a des livrables concrets. Alternative écartée : roadmap trimestrielle (trop vague pour un projet solo qui doit shipper vite). |
| @creative-strategy | 2026-03-25 | Complétion fiches personas (`docs/strategy/personas.md`) — sections 1.7-1.9 (Sophie) et 2.1-2.9 (Thomas) | Sophie : 7 objections/réponses, 8 canaux cartographiés (Facebook groupes prioritaire), 5 triggers (annonce réécrite = n°1). Thomas : démographie team leader 45 ans/55K€ CA, psychographie orientée délégation/premium, 7 frustrations (CM freelance décevant en tête), journée type sans marketing, objectifs scaling 15-18 ventes/an, parcours d'achat via LinkedIn/call, 7 objections (qualité vs prix, sur-mesure vs template), canaux (LinkedIn prioritaire), 5 triggers (livrable premium personnalisé = n°1). | Sections 1.1-1.3 et 1.4-1.6 déjà complétées par une session précédente — conservées telles quelles. Thomas conçu comme persona complémentaire à Sophie : même marché, profil différent (expérimenté, budget supérieur, exigence qualité). Différenciation des parcours d'achat : Sophie découvre via groupes Facebook, Thomas via LinkedIn DM. Différenciation des objections : Sophie bloque sur le prix, Thomas sur la qualité. Choix de positionner Thomas comme vecteur de croissance organique (recommandation filleuls = acquisition par lot). |
| @product-manager | 2026-03-25 | Spécifications fonctionnelles MVP (`docs/product/functional-specs.md`) | 7 sections couvrant landing page, onboarding, espace client, paiement Stripe, dashboard admin, intégrations IA, exigences légales. Sections 1-4 et 7 en P0 (bloquantes lancement), sections 5-6 en P1. Formulaire onboarding en 7 étapes (wizard) avec 30+ champs structurés. Pipeline IA semi-automatisé au MVP (déclenchement manuel, production auto, QA humaine). Stripe Checkout hosted avec webhooks pour création auto de comptes Clerk. Conformité légale intégrée dans chaque section (mentions IA, RGPD, CGV). | Choix de Stripe Checkout hosted (pas d'intégration custom) car plus rapide à implémenter et PCI-DSS géré par Stripe. Onboarding en 7 étapes plutôt que formulaire unique car : durée cible < 7 min, sauvegarde par étape, moins intimidant pour Sophie. Pipeline IA semi-automatisé au MVP (pas full-auto) car : volume faible (< 30 clients), QA humaine indispensable pour la confiance, automatisation complète prévue mois 2+. Stripe Customer Portal utilisé pour la gestion d'abonnement (pas de dev custom) car : gain de temps, conformité facturation, résiliation en autonomie. Exigences légales traitées comme section transverse plutôt que par fonctionnalité car : elles impactent toutes les sections et doivent être vérifiées globalement. |
| @data-analyst | 2026-03-25 | Framework KPIs (`docs/analytics/kpi-framework.md`) + Plan de tracking PostHog (`docs/analytics/tracking-plan.md`) | NSM = clients récurrents actifs (formule exacte, seuils, décomposition). Framework AARRR complet avec 5 domaines, 40+ KPIs, seuils d'alerte par domaine. 5 dashboards PostHog recommandés (executive, acquisition, activation, retention, revenue). 20+ events PostHog spécifiés (16 P0, 6 P1) avec propriétés détaillées. User properties en 4 catégories (identification, métier, commercial, engagement). 8 segments recommandés. Guide d'implémentation Next.js + Stripe webhooks. Conformité RGPD (instance EU, masquage, consentement). | Framework AARRR choisi plutôt que OKR ou Balanced Scorecard car : adapté au stade early-stage, orienté funnel (acquisition → referral), et standard SaaS. PostHog EU plutôt que US pour la conformité RGPD (données stockées en Europe). Events serveur (webhooks Stripe) pour les events paiement plutôt que côté client car : plus fiables, pas de dépendance au navigateur, pas de blocage par adblockers. Score d'engagement calculé (high/medium/low/inactive) plutôt que score numérique car : plus actionnable pour un solo founder, seuils clairs pour déclencher des interventions. Priorité P0/P1 alignée sur la roadmap (P0 = semaines 1-2 MVP, P1 = mois 1-2). |
| @ux | 2026-03-25 | Parcours utilisateurs (`docs/ux/user-flows.md`) + Wireframes textuels (`docs/ux/wireframes.md`) | 5 flows complets (Découverte, Onboarding, Espace client, Boost Mandat, Admin) avec étapes numérotées, points de friction Sophie et solutions UX, métriques de succès par flow. Wireframes pour 4 écrans (landing page 7 sections, onboarding wizard 7 étapes + confirmation, dashboard livrables avec modale d'aperçu, flow de paiement Stripe). Principes UX transversaux : mobile-first 375px, copier-coller comme interaction n°1, magic link par défaut, zéro jargon, 3 secondes max par écran. | Mobile-first car Sophie utilise principalement son iPhone (cf. personas.md). Magic link plutôt que mot de passe car Sophie oublie ses mots de passe (friction de connexion réduite). Copier-coller comme interaction principale plutôt que téléchargement car : plus rapide pour publier un post (30 sec vs ouvrir un fichier), adapté au workflow mobile. Onboarding en 7 étapes séparées plutôt que formulaire unique long car : sauvegarde par étape, barre de progression motivante, durée cible < 7 min respectée (estimée 6 min 40). Flèches haut/bas pour le classement mobile plutôt que drag-and-drop car : le drag-and-drop tactile est capricieux sur iPhone. Pricing placé APRÈS avant/après et témoignages car : Sophie doit comprendre la valeur avant de voir le prix (sinon choc prix = abandon). Alternative écartée : page multi-pages avec navigation — écartée car trop d'étapes de navigation, une landing page unique avec scroll est plus efficace pour la conversion. |
| @copywriter | 2026-03-25 | Copy landing page (`docs/copy/landing-page-copy.md`) + Guide de voix de marque (`docs/copy/brand-voice.md`) | 9 sections de landing page avec texte final prêt à intégrer (hero, problème/solution, 3 piliers, avant/après, social proof, pricing, FAQ 10 questions, CTA final, footer). Guide de voix : 5 principes, vocabulaire complet (mots à utiliser / interdits), 4 templates email/DM, guide CTA, checklist de relecture 10 points. Directive IA strictement respectée : zéro mention d'IA dans le copy client (sauf FAQ Q2 et mention légale sous avant/après). Deux annonces avant/après réalistes avec données géographiques vérifiables (La Doutre Angers, Aiguelongue Montpellier). Témoignages marqués comme templates à remplacer par vrais témoignages. | Choix de headline "Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva" (repris du brand-platform) plutôt qu'une headline prix ("Ton équipe marketing à 197€") car : l'identification émotionnelle convertit mieux qu'un prix en accroche — Sophie doit se reconnaître avant de voir le prix. Section "3 piliers" ajoutée entre problème/solution et avant/après car : les wireframes prévoyaient problème/solution directement suivi d'avant/après, mais les 3 piliers (C'est fait / C'est toi / C'est malin) du brand-platform méritent leur section — ils structurent la proposition de valeur. Annonces avant/après avec prix au m² réels et POI vérifiables plutôt que données inventées : renforce la crédibilité et montre concrètement le niveau de personnalisation. FAQ étendue à 10 questions (vs 9 dans wireframes) : ajout de la question CM freelance (objection majeure de Thomas, cf. personas.md). Templates de témoignages fournis mais marqués comme non-publiables en l'état — alternative écartée : inventer de faux témoignages (interdit par la règle zéro invention + risque juridique). |

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
