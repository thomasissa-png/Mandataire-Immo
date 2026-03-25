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

**Objectif** : Collecter toutes les informations nécessaires pour produire des livrables hyper-personnalisés dès le premier mois. Ce questionnaire alimente le `project-context` de chaque client, utilisé par les agents Gradient pour la production.

**URL** : `immocrew.fr/onboarding` (accessible après paiement ou sur invitation)

**Principe UX** : formulaire multi-étapes (wizard), 5-7 min max, sauvegarde automatique à chaque étape, reprise possible.

### 2.1 Étape 1 — Identité professionnelle

**User story** : En tant que nouveau client, je renseigne qui je suis professionnellement pour que mes livrables reflètent mon identité.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Prénom | Texte | Oui | Sophie |
| Nom | Texte | Oui | Martin |
| Réseau d'affiliation | Select (IAD, SAFTI, Capifrance, MegAgence, Propriétés-Privées, Autre, Indépendant) | Oui | IAD |
| Ancienneté dans l'immobilier | Select (< 1 an, 1-2 ans, 3-5 ans, 5+ ans) | Oui | 1-2 ans |
| Nombre de ventes / an (approximatif) | Select (1-3, 4-6, 7-10, 10+) | Oui | 4-6 |
| Photo professionnelle | Upload image (JPG/PNG, max 5 Mo) | Non | photo-sophie.jpg |
| Logo personnel (si existant) | Upload image (JPG/PNG/SVG, max 5 Mo) | Non | logo-sophie.png |

### 2.2 Étape 2 — Zone géographique

**User story** : En tant que mandataire, je définis ma zone d'intervention pour que chaque contenu mentionne mes quartiers, écoles, transports et commerces locaux.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Ville principale | Texte avec autocomplétion (API adresse.data.gouv.fr) | Oui | Angers |
| Code postal | Auto-rempli depuis la ville | Oui | 49000 |
| Quartiers de prédilection (3 max) | Texte libre multi-entrée | Non | La Doutre, Saint-Serge, Lac de Maine |
| Rayon d'action (km) | Slider (5-50 km) | Oui | 20 km |
| Type de zone | Multi-select (Urbain, Périurbain, Rural, Littoral, Montagne) | Oui | Urbain, Périurbain |

### 2.3 Étape 3 — Spécialité immobilière

**User story** : En tant que mandataire, je précise mes spécialités pour que les livrables ciblent les bons acheteurs et vendeurs.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Types de biens | Multi-select (Appartements, Maisons, Terrains, Locaux commerciaux, Immobilier de prestige, Neuf/VEFA) | Oui | Appartements, Maisons |
| Clientèle principale | Multi-select (Primo-accédants, Familles, Investisseurs, Seniors, Professionnels) | Oui | Primo-accédants, Familles |
| Gamme de prix habituelle | Double slider (min-max, en K€) | Oui | 120K€ — 350K€ |
| Spécificité ou niche (optionnel) | Texte libre | Non | Spécialiste rénovation énergétique |

### 2.4 Étape 4 — Ton de communication et personal branding

**User story** : En tant que mandataire, je choisis le ton de mes contenus pour qu'ils me ressemblent et que je puisse les publier sans honte.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Ton de communication | Select avec descriptions (Professionnel et rassurant / Chaleureux et accessible / Dynamique et enthousiaste / Expert et factuel) | Oui | Chaleureux et accessible |
| Tutoiement ou vouvoiement avec les clients | Select (Tutoiement, Vouvoiement, Mixte selon le contexte) | Oui | Vouvoiement |
| Ce qui te différencie (en 2-3 phrases) | Textarea (max 500 car.) | Non | "Je connais chaque rue d'Angers, j'ai grandi ici. J'accompagne mes clients de A à Z, même après la vente." |
| Valeurs ou engagements à mettre en avant | Multi-select (Proximité, Transparence, Expertise locale, Réactivité, Accompagnement humain, Autre) | Non | Proximité, Expertise locale |

### 2.5 Étape 5 — Biens en cours (portefeuille actuel)

**User story** : En tant que mandataire, je partage mes biens en mandat pour que les agents produisent des annonces et posts dédiés à mes vrais biens.

**Champs** (répétable — bouton "Ajouter un bien", max 10 biens au MVP) :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Titre du bien | Texte | Oui | Appartement T3 — La Doutre |
| Adresse ou quartier | Texte | Oui | 12 rue Plantagenêt, Angers |
| Type | Select (Appartement, Maison, Terrain, Local, Autre) | Oui | Appartement |
| Prix de vente | Nombre (€) | Oui | 189 000 |
| Surface (m²) | Nombre | Oui | 68 |
| Nombre de pièces | Nombre | Oui | 3 |
| Points forts (3 max) | Texte libre multi-entrée | Non | Balcon plein sud, Parking, Cave |
| Photos du bien | Upload multiple (max 10 images, 5 Mo chacune) | Non | — |
| Lien annonce existante (SeLoger, LeBonCoin...) | URL | Non | https://www.seloger.com/... |

### 2.6 Étape 6 — Présence digitale existante

**User story** : En tant que mandataire, je partage mes comptes sociaux et mon site pour que les livrables soient cohérents avec ce qui existe déjà.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Page Facebook pro | URL | Non | https://facebook.com/sophie.martin.immo |
| Compte Instagram | URL ou @handle | Non | @sophie.martin.immo |
| Profil LinkedIn | URL | Non | https://linkedin.com/in/sophie-martin |
| Google Business Profile | URL | Non | — |
| Site web personnel | URL | Non | — |
| Chaîne YouTube | URL | Non | — |

### 2.7 Étape 7 — Préférences de contenu

**User story** : En tant que mandataire, je choisis les types de contenus qui m'intéressent le plus et les sujets que je veux aborder.

**Champs** :
| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Contenus prioritaires | Classement drag-and-drop (Posts réseaux sociaux, Articles SEO, Annonces immobilières, Scripts vidéo/Reels, Newsletters, Emails prospection) | Oui | 1. Posts, 2. Annonces, 3. Articles SEO |
| Sujets à aborder | Multi-select (Marché local, Conseils acheteurs, Conseils vendeurs, Vie du quartier, Actualités immobilières, Coulisses du métier, Témoignages clients) | Non | Marché local, Conseils vendeurs |
| Sujets à éviter | Texte libre | Non | "Pas de politique, pas de religion" |
| Fréquence de publication souhaitée | Select (3/semaine, 5/semaine, Quotidien) | Oui | 3/semaine |

### 2.8 Mentions légales du formulaire

**User story** : En tant que client, je suis informé de l'usage de mes données avant de soumettre le formulaire (obligation RGPD Art. 13).

**Éléments obligatoires** (cf. `docs/legal/legal-audit.md` sections 1.1, 1.4, 2.2.A) :
- Texte d'information sous le formulaire : "Les informations recueillies sont nécessaires à la production de tes livrables marketing. Elles sont transmises à notre système IA (Anthropic Claude) pour la génération de contenu, puis relues par notre équipe avant livraison. Durée de conservation : durée du contrat. Tu peux exercer tes droits (accès, rectification, suppression) en contactant dpo@immocrew.fr. Politique de confidentialité complète : [lien]."
- Checkbox obligatoire : "J'ai lu et j'accepte les [CGV] et la [Politique de Confidentialité]" (avec liens cliquables)
- Horodatage de l'acceptation stocké en base (Supabase) avec version des CGV acceptées

**Critères d'acceptation globaux du formulaire** :
- [ ] Formulaire multi-étapes avec indicateur de progression (étape X/7)
- [ ] Sauvegarde automatique à chaque étape (le client peut revenir plus tard)
- [ ] Validation en temps réel des champs (erreurs affichées inline)
- [ ] Responsive mobile (beaucoup de mandataires remplissent sur smartphone)
- [ ] Durée de complétion testée < 7 minutes
- [ ] Les données sont stockées dans Supabase (table `client_profiles` ou équivalent)
- [ ] Les données alimentent le `project-context` du client pour les agents Gradient
- [ ] Mention d'information RGPD visible avant soumission
- [ ] Checkbox CGV obligatoire avec horodatage
- [ ] Mention explicite du traitement IA (obligation AI Act)
- [ ] Le client peut modifier ses informations après soumission depuis son espace client (cf. section 3)

---

## 3. Espace client (P0)

**Objectif** : Permettre au client de se connecter, consulter ses livrables du mois en cours, les télécharger, et accéder à l'historique des mois précédents. Interface simple, zéro friction.

**URL** : `immocrew.fr/dashboard` (protégée par authentification Clerk)

**Principe UX** : Le client ouvre, voit ses livrables, télécharge, ferme. Pas de configuration, pas de settings complexes. Temps passé cible : < 5 min/visite.

### 3.1 Authentification (Clerk)

**User story** : En tant que client, je me connecte simplement à mon espace avec mon email, sans mémoriser un mot de passe compliqué.

**Spécifications** :
- Provider : Clerk (auth hébergée)
- Méthodes de connexion : Email + mot de passe, Magic link (email), Google OAuth (optionnel)
- Création de compte : automatique après paiement Stripe (le webhook Stripe crée le compte Clerk — cf. section 4)
- Pas d'inscription libre : le compte est créé uniquement après un paiement validé ou une invitation admin

**Critères d'acceptation** :
- [ ] Connexion par email + mot de passe fonctionnelle
- [ ] Connexion par magic link fonctionnelle (préférence UX pour les mandataires peu techniques)
- [ ] Redirection vers `/dashboard` après connexion
- [ ] Redirection vers `/login` si accès non authentifié à `/dashboard`
- [ ] Session persistante (cookie Clerk) — pas de re-login à chaque visite
- [ ] Page de reset mot de passe fonctionnelle
- [ ] Les cookies d'authentification Clerk sont classés "strictement nécessaires" (pas de consentement requis — cf. `docs/legal/legal-audit.md` section 1.1)

### 3.2 Page d'accueil du dashboard

**User story** : En tant que client connecté, je vois immédiatement mes livrables du mois en cours et leur statut (en préparation / livrés / à télécharger).

**Contenu attendu** :
- Message de bienvenue personnalisé : "Bonjour [Prénom], voici tes livrables de [mois en cours]"
- Statut global du mois : badge "En préparation" (orange) / "Livrés" (vert) / "En retard" (rouge)
- Grille de livrables du mois en cours, organisée par catégorie :
  - Posts réseaux sociaux (12) — avec aperçu texte
  - Scripts vidéo / Reels (4) — avec aperçu texte
  - Articles SEO (2) — avec titre et lien de lecture
  - Newsletter (1) — avec aperçu
  - Annonces immobilières (4) — avec aperçu par bien
  - Email prospection (1) — avec aperçu
- Bouton "Tout télécharger" (ZIP) pour le mois complet
- Bouton de téléchargement individuel par livrable

**Critères d'acceptation** :
- [ ] La page affiche les livrables du mois en cours par défaut
- [ ] Chaque livrable a un statut (en attente / livré)
- [ ] Téléchargement individuel (fichier texte / PDF / image selon le type)
- [ ] Téléchargement groupé en ZIP fonctionnel
- [ ] Aperçu du contenu sans télécharger (lecture inline)
- [ ] Interface responsive mobile
- [ ] Chargement de la page < 2s

### 3.3 Historique des mois précédents

**User story** : En tant que client abonné depuis plusieurs mois, je peux retrouver les livrables des mois passés pour les réutiliser ou les republier.

**Contenu attendu** :
- Liste des mois passés (ordre antéchronologique) avec nombre de livrables par mois
- Clic sur un mois → affiche les livrables du mois sélectionné (même grille que 3.2)
- Téléchargement groupé par mois toujours disponible

**Critères d'acceptation** :
- [ ] Tous les mois depuis l'abonnement sont listés
- [ ] Navigation entre les mois sans rechargement de page
- [ ] Les livrables restent téléchargeables tant que le client a un abonnement actif
- [ ] Les livrables restent accessibles 30 jours après résiliation (cf. `docs/legal/legal-audit.md` section 1.3 — durée conservation livrables)

### 3.4 Modification du profil

**User story** : En tant que client, je peux mettre à jour mes informations (nouveau bien en mandat, changement de zone, nouveau logo) pour que les prochains livrables soient à jour.

**Contenu attendu** :
- Accès aux données du formulaire d'onboarding (cf. section 2) en mode édition
- Possibilité d'ajouter/supprimer des biens en cours
- Possibilité de modifier la zone géographique, le ton, les préférences
- Les modifications sont prises en compte pour la prochaine livraison mensuelle

**Critères d'acceptation** :
- [ ] Tous les champs de l'onboarding sont modifiables
- [ ] Les modifications sont sauvegardées en base (Supabase)
- [ ] Le `project-context` du client est mis à jour automatiquement
- [ ] Notification à l'admin (cf. section 5) qu'un client a modifié son profil
- [ ] Exercice du droit de rectification RGPD (Art. 16) satisfait par cette fonctionnalité

### 3.5 Gestion de l'abonnement

**User story** : En tant que client, je peux voir mon abonnement en cours, télécharger mes factures, et résilier si je le souhaite.

**Contenu attendu** :
- Statut de l'abonnement (actif / en pause / résilié)
- Date du prochain prélèvement
- Historique des paiements avec lien vers les factures Stripe (portal Stripe)
- Bouton "Gérer mon abonnement" → redirige vers le Stripe Customer Portal (pas de gestion custom)
- Bouton "Résilier" clairement accessible (pas caché — transparence et conformité)

**Critères d'acceptation** :
- [ ] Le statut d'abonnement est synchronisé avec Stripe (via webhooks)
- [ ] Le lien vers le Stripe Customer Portal fonctionne
- [ ] Les factures sont accessibles et téléchargeables
- [ ] La résiliation est possible en autonomie (pas besoin de contacter le support)
- [ ] Après résiliation : accès maintenu jusqu'à la fin de la période payée
- [ ] Après résiliation : accès en lecture seule aux livrables pendant 30 jours supplémentaires

---

## 4. Paiement Stripe (P0)

**Objectif** : Gérer les 3 types de paiement (abonnement mensuel, one-shot lancement, one-shot boost) via Stripe, avec création automatique du compte client et synchronisation des statuts.

**Provider** : Stripe (entité Stripe Payments Europe Ltd — données de paiement UE, cf. `docs/legal/legal-audit.md` section 1.2)

### 4.1 Produits Stripe à créer

| Produit Stripe | Type | Prix TTC | Prix HT (TVA 20%) | Mode | Récurrence |
|----------------|------|----------|-------------------|------|------------|
| Pack Mensuel | Abonnement | 197€ | 164,17€ | `subscription` | Mensuel, renouvellement automatique |
| Pack Lancement | Paiement unique | 497€ | 414,17€ | `payment` | One-shot |
| Boost Mandat | Paiement unique | 97€ | 80,83€ | `payment` | One-shot (achetable plusieurs fois) |

**Note** : le Pack Lancement est souvent acheté en combo avec le Pack Mensuel. Prévoir un flux de checkout combiné (lancement + premier mois d'abonnement = 694€ en un seul checkout).

### 4.2 Flux de checkout

**User story** : En tant que mandataire convaincu par la landing page, je clique sur un CTA, je suis redirigé vers une page de paiement claire, je paie, et mon compte est créé automatiquement.

**Flux détaillé** :

1. **CTA sur la landing page** → lien vers Stripe Checkout (mode hosted)
2. **Page Stripe Checkout** : le client saisit email + carte bancaire. Stripe gère PCI-DSS.
3. **Paiement réussi** → redirection vers `immocrew.fr/bienvenue` (page de succès)
4. **Webhook Stripe** `checkout.session.completed` → déclenche :
   - Création du compte Clerk (avec email du client)
   - Création du profil client en base (Supabase, table `clients`)
   - Envoi d'un email de bienvenue avec lien vers le formulaire d'onboarding
   - Enregistrement du paiement en base
5. **Le client reçoit un email** : "Bienvenue chez ImmoCrew ! Complète ton profil en 5 min pour recevoir tes premiers livrables." + lien magic link vers l'onboarding

**Critères d'acceptation** :
- [ ] Stripe Checkout fonctionne pour les 3 produits
- [ ] Le checkout combiné (Pack Lancement + Pack Mensuel) fonctionne
- [ ] Redirection post-paiement vers page de succès
- [ ] Le compte Clerk est créé automatiquement via webhook
- [ ] L'email de bienvenue est envoyé dans les 5 min post-paiement
- [ ] Le client peut accéder à l'onboarding sans re-saisir ses informations
- [ ] En cas d'échec de paiement : message d'erreur clair, pas de compte créé

### 4.3 Webhooks Stripe

**User story** : En tant qu'admin, les statuts de paiement sont synchronisés automatiquement pour que je sache en temps réel qui est client actif, qui a résilié, qui est en impayé.

**Webhooks à implémenter** :

| Événement Stripe | Action côté ImmoCrew |
|-----------------|---------------------|
| `checkout.session.completed` | Créer compte Clerk + profil Supabase + email bienvenue |
| `invoice.paid` | Marquer le mois comme "payé" dans Supabase. Déclencher la production des livrables du mois. |
| `invoice.payment_failed` | Marquer le client comme "impayé". Envoyer un email de relance (Stripe gère les retries automatiques). |
| `customer.subscription.updated` | Mettre à jour le statut d'abonnement en base (changement de plan, pause...) |
| `customer.subscription.deleted` | Marquer le client comme "résilié". Conserver l'accès lecture 30 jours. |

**Critères d'acceptation** :
- [ ] Endpoint webhook sécurisé (`/api/webhooks/stripe`) avec vérification de signature Stripe
- [ ] Chaque événement est traité de manière idempotente (rejouable sans doublon)
- [ ] Les statuts en base sont synchronisés en temps réel avec Stripe
- [ ] Log de chaque événement webhook pour debug (table `webhook_logs` dans Supabase)

### 4.4 Stripe Customer Portal

**User story** : En tant que client, je peux gérer mon abonnement (changer de carte, voir mes factures, résilier) depuis un portail hébergé par Stripe sans qu'ImmoCrew ait à développer ces écrans.

**Spécifications** :
- Activer le Stripe Customer Portal dans le dashboard Stripe
- Configurer : modification de carte, téléchargement de factures, résiliation d'abonnement
- Lien d'accès depuis l'espace client (cf. section 3.5)

**Critères d'acceptation** :
- [ ] Le Customer Portal est activé et configuré
- [ ] Le lien depuis l'espace client génère une session portal valide
- [ ] Le client peut résilier sans contacter le support (conformité UX et juridique)
- [ ] Les factures Stripe incluent les mentions légales obligatoires (SIRET, TVA, adresse)

### 4.5 Boost Mandat (achat ponctuel)

**User story** : En tant que client abonné, je veux acheter un Boost Mandat pour un bien spécifique, en plus de mon pack mensuel.

**Flux** :
1. Depuis l'espace client → bouton "Commander un Boost Mandat" (97€)
2. Formulaire rapide : sélection du bien (parmi les biens du profil) ou saisie d'un nouveau bien
3. Redirection vers Stripe Checkout (paiement unique 97€)
4. Webhook → enregistrement de la commande boost + notification admin
5. Livrables boost livrés sous 48-72h dans l'espace client

**Critères d'acceptation** :
- [ ] Le Boost est achetable uniquement par un client existant (abonnement actif ou Pack Lancement acheté)
- [ ] Le bien concerné est identifié dans la commande
- [ ] Le paiement one-shot fonctionne indépendamment de l'abonnement
- [ ] Les livrables boost sont distincts des livrables mensuels dans l'espace client

---

## 5. Dashboard interne — admin (P1)

**Objectif** : Donner au fondateur une vue complète de tous les clients, du statut de production de chaque livrable, et des métriques business essentielles. Opérable en solo.

**URL** : `immocrew.fr/admin` (protégée par rôle Clerk `admin`)

**Accès** : réservé au fondateur (rôle admin Clerk). Aucun client ne peut accéder à cette section.

### 5.1 Liste des clients

**User story** : En tant qu'admin, je vois tous mes clients avec leur statut en un coup d'oeil pour savoir qui a besoin de quoi.

**Contenu attendu** :
- Tableau avec colonnes : Prénom/Nom, Réseau, Zone géo, Pack souscrit, Statut abonnement (actif/impayé/résilié), Date d'inscription, Statut production mois en cours
- Filtres : par statut (actif, impayé, résilié), par réseau, par pack
- Tri : par date d'inscription, par statut production
- Recherche par nom
- Clic sur un client → fiche détaillée (données onboarding + historique livrables + historique paiements)

**Critères d'acceptation** :
- [ ] Tous les clients sont listés avec données synchronisées (Clerk + Supabase + Stripe)
- [ ] Filtres et tri fonctionnels
- [ ] Fiche client accessible en 1 clic
- [ ] Les statuts de paiement sont mis à jour en temps réel via webhooks Stripe

### 5.2 Suivi de production

**User story** : En tant qu'admin, je sais exactement où en est la production de chaque client pour le mois en cours, et je peux marquer les livrables comme "produits" ou "livrés".

**Contenu attendu** :
- Vue kanban ou tableau par client : colonnes "À produire" / "En production" / "QA" / "Livré"
- Pour chaque client, liste des livrables du mois avec checkbox de statut
- Bouton "Uploader les livrables" : upload fichiers (texte, images, PDF) dans l'espace client correspondant
- Date de livraison cible par client (J+7 pour Pack Lancement, J+2 du mois pour Pack Mensuel)
- Indicateur visuel : en avance (vert), dans les temps (bleu), en retard (rouge)

**Critères d'acceptation** :
- [ ] Chaque client a un suivi de production pour le mois en cours
- [ ] Les livrables peuvent être uploadés par l'admin et apparaissent dans l'espace client
- [ ] Le changement de statut est enregistré avec horodatage
- [ ] Les retards sont visibles immédiatement (coloration rouge si > date cible)
- [ ] L'admin peut ajouter des notes internes par client (non visibles par le client)

### 5.3 Métriques business

**User story** : En tant qu'admin, je vois les KPIs essentiels pour piloter mon activité sans aller dans Stripe ou Supabase manuellement.

**Contenu attendu** :
- **MRR** (Monthly Recurring Revenue) : calculé depuis les abonnements actifs Stripe
- **Nombre de clients actifs** : abonnements en cours + clients Pack Lancement en phase de livraison
- **Churn du mois** : nombre de résiliations / clients début de mois
- **Revenus du mois** : total encaissé (abonnements + one-shots)
- **Clients en impayé** : liste avec nombre de jours de retard
- **Livrables en retard** : nombre de clients dont les livrables ne sont pas encore livrés

**Critères d'acceptation** :
- [ ] Les métriques sont calculées automatiquement (pas de saisie manuelle)
- [ ] Les données Stripe sont synchronisées (webhooks)
- [ ] Affichage sur une seule page (pas de navigation complexe)
- [ ] Rafraîchissement des données à chaque chargement de page

---

## 6. Intégrations IA (P1)

**Objectif** : Décrire le pipeline de production des livrables par les agents Gradient, de l'onboarding client à la livraison dans l'espace client. Au MVP, ce pipeline est semi-automatisé (déclenchement manuel, production automatique, QA humaine).

**Stack IA** : Claude API (Anthropic) via le framework Gradient Agents (19 agents coordonnés)

### 6.1 Pipeline de production

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Onboarding │────>│  Project-context  │────>│  Agents Gradient │
│  (client)   │     │  client (JSON)    │     │  (@copywriter,   │
│  Section 2  │     │  Supabase         │     │   @seo, @geo,    │
└─────────────┘     └──────────────────┘     │   @social, etc.) │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────v─────────┐
                                              │  Livrables bruts │
                                              │  (textes, scripts)│
                                              └────────┬─────────┘
                                                       │
                                              ┌────────v─────────┐
                                              │  QA humaine      │
                                              │  (admin)         │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────v─────────┐
                                              │  Espace client   │
                                              │  (Section 3)     │
                                              └──────────────────┘
```

### 6.2 Étape 1 — Génération du project-context client

**User story** : En tant que système, je transforme les données d'onboarding du client en un document structuré (project-context) que les agents IA peuvent consommer.

**Spécifications** :
- Les données du formulaire d'onboarding (section 2) sont compilées en un document JSON/Markdown structuré
- Ce document contient : identité, zone géo (avec données enrichies : écoles, transports, prix m² via APIs publiques), spécialité, ton, biens en cours, comptes sociaux, préférences
- Stockage : Supabase (table `client_contexts` ou champ JSONB dans `clients`)
- Mis à jour automatiquement si le client modifie son profil (section 3.4)

**Critères d'acceptation** :
- [ ] Le project-context est généré automatiquement après complétion de l'onboarding
- [ ] Il contient toutes les données nécessaires à la production de contenu personnalisé
- [ ] Il est mis à jour quand le client modifie son profil
- [ ] Format lisible par les agents Gradient (Markdown ou JSON structuré)

### 6.3 Étape 2 — Déclenchement de la production

**User story** : En tant qu'admin, je déclenche la production des livrables du mois pour chaque client (ou par lot).

**MVP (semi-automatisé)** :
- L'admin déclenche manuellement la production pour chaque client depuis le dashboard admin (section 5.2)
- Bouton "Lancer la production" → appelle le pipeline Gradient avec le project-context du client
- La production est asynchrone (pas de blocage UI — notification quand c'est terminé)

**Futur (mois 2+, automatisé)** :
- Cron job en début de mois : pour chaque client actif, déclencher automatiquement la production
- Webhook `invoice.paid` → déclenche la production du mois correspondant

**Critères d'acceptation MVP** :
- [ ] L'admin peut déclencher la production manuellement par client
- [ ] Le project-context du client est transmis aux agents
- [ ] La production ne bloque pas l'interface admin
- [ ] Le statut de production est visible dans le dashboard (section 5.2)

### 6.4 Étape 3 — Production par les agents Gradient

**User story** : En tant que système IA, je produis les livrables du mois en respectant le profil, le ton et la zone géographique du client.

**Agents impliqués et rôle** :
| Agent | Rôle | Livrables produits |
|-------|------|--------------------|
| `@copywriter` | Rédaction de tous les textes (posts, articles, annonces, emails) | Posts (12), articles SEO (2), newsletter (1), email prospection (1) |
| `@seo` | Optimisation SEO des articles et annonces (mots-clés locaux, meta descriptions) | Mots-clés intégrés aux articles et annonces |
| `@geo` | Enrichissement hyper-local (données quartier, écoles, transports, prix m²) | Données locales injectées dans tous les livrables |
| `@social` | Adaptation des posts aux formats sociaux (Instagram, Facebook, LinkedIn) | 12 posts formatés par plateforme |
| `@creative-strategy` | Calendrier éditorial, angles créatifs, sujets du mois | Plan éditorial mensuel |
| `@design` | Directives visuelles pour les posts (au MVP : descriptions pour Canva, pas de génération d'images) | Briefs visuels par post |

**Livrables produits par mois (Pack Mensuel)** :
- 12 posts réseaux sociaux (texte + brief visuel)
- 4 scripts vidéo / Reels (avec découpage scènes, texte voix off, suggestions visuelles)
- 2 articles SEO (800-1200 mots, optimisés pour "mandataire immobilier + [ville]")
- 1 newsletter (texte prêt à envoyer)
- 4 annonces immobilières personnalisées (pour les biens en cours du client)
- 1 email de prospection vendeurs

**Contraintes IA** :
- Chaque livrable doit mentionner des éléments hyper-locaux (principe produit n°2 — "Hyper-local ou rien")
- Le ton de chaque livrable respecte les préférences du client (tutoiement/vouvoiement, style)
- Les données factuelles (prix m², écoles, transports) doivent être vérifiées (QA humaine)
- Budget tokens estimé : 2-3€/client/mois

### 6.5 Étape 4 — QA humaine

**User story** : En tant qu'admin, je relis chaque lot de livrables avant livraison pour vérifier la qualité, la personnalisation et l'exactitude des données.

**Checklist QA** :
- [ ] Les données locales sont exactes (prix m², noms de quartiers, écoles)
- [ ] Le ton correspond au profil du client
- [ ] Les annonces concernent bien les biens en cours du client
- [ ] Aucune hallucination IA (informations inventées sur le quartier ou le bien)
- [ ] Le contenu est suffisamment personnalisé (ne pourrait pas fonctionner pour un autre mandataire)
- [ ] Les livrables portent la mention IA obligatoire : "Contenu produit avec assistance IA — relu et validé par l'équipe ImmoCrew" (obligation AI Act, cf. `docs/legal/legal-audit.md` section 2.2.A)

**Critères d'acceptation** :
- [ ] L'admin peut relire chaque livrable dans le dashboard avant de le rendre visible au client
- [ ] L'admin peut modifier un livrable avant livraison (corrections mineures)
- [ ] L'admin peut relancer la production d'un livrable spécifique (si qualité insuffisante)
- [ ] La mention IA est incluse sur chaque livrable livré
- [ ] Temps de QA cible : < 30 min par client

### 6.6 Étape 5 — Livraison dans l'espace client

**User story** : En tant qu'admin, une fois la QA terminée, je publie les livrables dans l'espace client. Le client reçoit une notification.

**Spécifications** :
- L'admin marque les livrables comme "validés" dans le dashboard → ils deviennent visibles dans l'espace client (section 3.2)
- Un email de notification est envoyé au client : "Tes livrables de [mois] sont prêts ! Connecte-toi pour les découvrir."
- Les livrables sont stockés dans Supabase Storage (fichiers texte, PDF, images)

**Critères d'acceptation** :
- [ ] Les livrables validés apparaissent dans l'espace client en temps réel
- [ ] L'email de notification est envoyé automatiquement
- [ ] Les fichiers sont stockés de manière sécurisée (accès restreint au client propriétaire)
- [ ] Le statut dans le dashboard admin passe à "Livré"

---

## 7. Exigences légales transverses (P0)

**Objectif** : Garantir la conformité juridique du MVP avant mise en ligne. Toutes les exigences ci-dessous sont **bloquantes** pour le lancement.

**Référence complète** : `docs/legal/legal-audit.md`

### 7.1 Mentions IA obligatoires (AI Act — Art. 50)

**User story** : En tant que client ou visiteur, je suis informé que le contenu est produit avec assistance IA, conformément au Règlement européen sur l'IA.

**Implémentation requise** :

| Emplacement | Mention | Référence |
|-------------|---------|-----------|
| **CGV** (clause dédiée) | "Les livrables sont produits à l'aide d'intelligence artificielle (Claude, Anthropic), avec relecture et validation humaine avant livraison." | `legal-audit.md` section 2.2.A |
| **Formulaire d'onboarding** (étape mentions, cf. section 2.8) | "Tes données de profil sont transmises à un modèle IA (Anthropic Claude) pour la production des livrables." | `legal-audit.md` section 2.2.A |
| **Chaque livrable livré** (en-tête ou pied de page) | "Contenu produit avec assistance IA — relu et validé par l'équipe ImmoCrew." | `legal-audit.md` section 2.2.A |
| **FAQ de la landing page** (cf. section 1.6) | Réponse transparente à "Le contenu est fait par une IA ?" | `legal-audit.md` section 2.2.A |
| **Landing page** (sous les avant/après, cf. section 1.3) | Label discret sous chaque exemple de livrable | `legal-audit.md` section 2.2.A |

**Critères d'acceptation** :
- [ ] La mention IA est présente dans les CGV
- [ ] La mention IA est présente dans l'onboarding
- [ ] La mention IA est présente sur chaque livrable
- [ ] La mention IA est présente dans la FAQ
- [ ] Les métadonnées IA des sorties Claude ne sont pas supprimées activement (cf. `legal-audit.md` section 2.2.B)

### 7.2 Bandeau de consentement cookies

**User story** : En tant que visiteur, je peux accepter ou refuser les cookies non essentiels (analytics) avant qu'ils ne soient déposés, conformément à la directive ePrivacy et aux recommandations CNIL.

**Spécifications** :
- Outil recommandé : Tarteaucitron.js (gratuit, open source, conforme CNIL) — cf. `legal-audit.md` section 1.5
- Cookies à catégoriser :
  - **Strictement nécessaires** (pas de consentement) : cookies Clerk (authentification), cookies de session
  - **Analytics** (consentement requis) : PostHog (si EU Cloud configuré — `eu.posthog.com`)
- Le bandeau doit apparaître au premier chargement de chaque page publique
- PostHog ne doit PAS charger tant que le consentement n'est pas donné

**Critères d'acceptation** :
- [ ] Le bandeau cookies apparaît au premier chargement
- [ ] L'utilisateur peut accepter, refuser ou paramétrer les cookies
- [ ] PostHog ne charge pas avant le consentement explicite
- [ ] Le choix est mémorisé (pas de re-affichage à chaque visite)
- [ ] Le choix est modifiable (lien "Gérer mes cookies" en footer)
- [ ] PostHog est configuré sur EU Cloud (`eu.posthog.com`)

### 7.3 Conditions Générales de Vente (CGV)

**User story** : En tant que client, j'ai accès aux CGV avant et pendant mon abonnement. Les CGV couvrent l'ensemble des obligations légales B2B.

**Page** : `immocrew.fr/cgv` (accessible depuis le footer de toutes les pages)

**Contenu obligatoire** (cf. `legal-audit.md` section 3.1) :
- Identité du prestataire (raison sociale, SIRET, adresse, email, TVA)
- Description détaillée de chaque offre (Pack Lancement, Pack Mensuel, Boost Mandat) avec livrables, délais, formats
- Prix HT et TTC, modalités de paiement (Stripe), TVA 20%
- Durée et renouvellement de l'abonnement (mensuel, renouvellement tacite)
- Conditions de résiliation (libre, via espace client ou email, préavis : fin du mois en cours)
- Délais de livraison (24-48h livrables courants, J+7 Pack Lancement)
- Propriété intellectuelle : cession des droits sur les livrables au client après paiement
- Responsabilité : obligation de moyens, pas de résultat marketing garanti
- Mention IA : livrables produits avec assistance IA + relecture humaine
- Garantie commerciale 14 jours sur le Pack Lancement (satisfait ou remboursé, cf. `legal-audit.md` section 3.2)
- Données personnelles : renvoi vers la Politique de Confidentialité
- Droit applicable : droit français, tribunal de commerce du siège social
- Force majeure, modification des CGV (notification 30 jours)

**Mécanisme d'acceptation** :
- Checkbox "J'ai lu et j'accepte les CGV" obligatoire à l'inscription (formulaire d'onboarding, section 2.8)
- Horodatage de l'acceptation + version des CGV acceptées stockés en base (Supabase)
- Les CGV sont versionnées (v1, v2...) et chaque version est archivée

**Critères d'acceptation** :
- [ ] Page CGV publiée et accessible en footer
- [ ] Checkbox d'acceptation avec horodatage
- [ ] Versionnement des CGV
- [ ] Relecture par un juriste recommandée avant lancement (cf. `legal-audit.md` section 6)

### 7.4 Politique de Confidentialité

**User story** : En tant que client ou visiteur, j'ai accès à une politique de confidentialité complète qui m'informe de l'usage de mes données.

**Page** : `immocrew.fr/confidentialite` (accessible depuis le footer de toutes les pages)

**Contenu obligatoire** (cf. `legal-audit.md` sections 1.1 à 1.4) :
- Identité du responsable de traitement
- Données collectées et finalités (cf. tableau section 1.1 du legal audit)
- Bases légales par traitement (exécution du contrat, obligation légale, intérêt légitime, consentement)
- Destinataires des données : sous-traitants (Supabase, Clerk, Stripe, Anthropic, PostHog, Replit)
- Transferts hors UE : Clerk (USA), Replit (USA), Anthropic (USA) — avec mention des garanties (SCC, DPF)
- Durées de conservation (cf. tableau section 1.3 du legal audit)
- Droits des personnes : accès, rectification, effacement, limitation, portabilité, opposition
- Canal d'exercice des droits : dpo@immocrew.fr
- Droit de réclamation auprès de la CNIL
- Cookies : renvoi vers le bandeau de consentement

**Critères d'acceptation** :
- [ ] Page publiée et accessible en footer
- [ ] Tous les sous-traitants sont listés avec leur localisation
- [ ] Les transferts hors UE sont mentionnés avec les garanties
- [ ] L'adresse dpo@immocrew.fr est créée et fonctionnelle
- [ ] Les durées de conservation sont spécifiées

### 7.5 Mentions Légales

**User story** : En tant que visiteur, j'accède aux mentions légales obligatoires conformément à la LCEN.

**Page** : `immocrew.fr/mentions-legales` (accessible depuis le footer de toutes les pages)

**Contenu obligatoire** (cf. `legal-audit.md` section 4) :
- Raison sociale / nom de l'entrepreneur
- Forme juridique, capital social (si société)
- Adresse du siège social
- SIRET / SIREN
- TVA intracommunautaire
- Responsable de la publication
- Email de contact : contact@immocrew.fr
- Téléphone professionnel
- Hébergeur : Replit Inc., 350 Mission St, San Francisco, CA 94105, USA
- Lien vers CGV et Politique de Confidentialité

**Critères d'acceptation** :
- [ ] Page publiée et accessible en footer
- [ ] Toutes les mentions LCEN sont présentes
- [ ] Les informations sont à jour (SIRET, adresse...)

### 7.6 RGPD — Actions techniques

**User story** : En tant que service conforme au RGPD, les données sont hébergées en EU quand possible, et les droits des personnes sont exerçables.

**Actions techniques bloquantes pour le lancement** :
| Action | Détail | Statut |
|--------|--------|--------|
| Supabase en région EU | Sélectionner `eu-central-1` (Francfort) à la création du projet | À faire |
| PostHog EU Cloud | Configurer sur `eu.posthog.com` | À faire |
| DPA sous-traitants | Signer les DPA avec Supabase, Clerk, Stripe, Replit, Anthropic | À faire |
| Adresse DPO | Créer dpo@immocrew.fr | À faire |
| Procédure de suppression | Script de suppression complète des données client sur demande (Supabase + demande aux sous-traitants) | À faire |
| Procédure d'export | Script d'export des données client au format JSON/CSV (droit de portabilité) | À faire |

**Critères d'acceptation** :
- [ ] Supabase est en région EU (Francfort)
- [ ] PostHog est sur EU Cloud
- [ ] Les 5 DPA sont signés (ou en cours de signature)
- [ ] dpo@immocrew.fr reçoit les emails
- [ ] Un processus de réponse aux demandes de droits existe (même manuel au MVP)

### 7.7 Checklist de conformité pré-lancement

Synthèse des éléments bloquants (cf. `legal-audit.md` section 6) :

- [ ] Structure juridique créée (SASU / micro-entreprise) avec SIRET
- [ ] CGV rédigées et publiées (section 7.3)
- [ ] Politique de Confidentialité rédigée et publiée (section 7.4)
- [ ] Mentions Légales publiées (section 7.5)
- [ ] Bandeau cookies implémenté (section 7.2)
- [ ] Mentions IA intégrées partout (section 7.1)
- [ ] Supabase en région EU
- [ ] PostHog EU Cloud
- [ ] DPA signés avec les 5 sous-traitants
- [ ] Adresse dpo@immocrew.fr créée
- [ ] Checkbox CGV avec horodatage dans l'onboarding
- [ ] Domaine immocrew.fr réservé avec certificat SSL

---

*Document produit par @product-manager dans le cadre du framework Gradient Agents.*
