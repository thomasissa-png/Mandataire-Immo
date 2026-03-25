# Parcours Utilisateurs — ImmoCrew

> Produit par @ux | 2026-03-25
> Sources : project-context.md, brand-platform.md, personas.md, functional-specs.md, roadmap.md
> Référence ton : docs/strategy/brand-platform.md (tutoiement, direct, complice, zéro jargon)

---

## Sommaire

1. [Flow 1 — Découverte : LinkedIn/Facebook vers Landing page](#flow-1--découverte)
2. [Flow 2 — Onboarding : Formulaire 7 étapes vers Paiement vers Bienvenue](#flow-2--onboarding)
3. [Flow 3 — Espace client : Login vers Livrables vers Téléchargement](#flow-3--espace-client)
4. [Flow 4 — Boost Mandat : Upsell depuis l'espace client](#flow-4--boost-mandat)
5. [Flow 5 — Admin : Gestion clients et production](#flow-5--admin)

---

## Flow 1 — Découverte

**Scénario** : Sophie, mandataire IAD à Angers, voit un post dans un groupe Facebook ou reçoit un DM LinkedIn avec une de ses annonces réécrite. Elle arrive sur immocrew.fr et doit comprendre le service en moins de 30 secondes.

**Point d'entrée** : lien dans un post Facebook / DM LinkedIn / résultat Google

### Étapes

| # | Étape | Écran / Action | Ce que Sophie voit | Ce que Sophie pense |
|---|-------|---------------|-------------------|-------------------|
| 1 | **Exposition initiale** | Post dans un groupe Facebook "Mandataires immobiliers France" montrant un avant/après d'annonce. OU DM LinkedIn avec son annonce réécrite gratuitement. | Un avant/après saisissant : son "Bel appartement lumineux, proche commerces" vs une version storytelling avec le nom de son quartier. | "C'est exactement la mienne ! Comment ils ont fait ? C'est vachement mieux." |
| 2 | **Clic vers le site** | Clic sur le lien dans le post/DM → atterrissage sur `immocrew.fr` | Hero : "Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva." Sous-titre : le service résumé en une phrase. CTA orange visible. | "Ah, c'est un service. Ça fait quoi exactement ?" |
| 3 | **Scroll section problème** | Scroll vers la section "problème/solution" | 3-4 problèmes formulés avec ses mots : irrégularité, annonces banales, page blanche à 22h, zéro mandat entrant. | "On dirait qu'ils me connaissent. C'est exactement ça." |
| 4 | **Scroll avant/après** | Section avec 2-3 exemples avant/après d'annonces | Annonces "avant" (génériques) vs "après" (storytelling hyper-local avec quartier, écoles, ambiance). | "C'est vraiment mieux. Et c'est personnalisé pour chaque zone ?" |
| 5 | **Scroll preuve sociale** | Section témoignages / chiffres | Témoignage d'une mandataire IAD similaire (même profil, même réseau). Nombre de livrables déjà produits. | "Si elle ça lui marche, pourquoi pas moi ?" |
| 6 | **Scroll pricing** | Section 3 packs côte à côte | Pack Mensuel mis en avant (197 euros/mois), Pack Lancement (497 euros), Boost Mandat (97 euros). | "197 euros/mois... c'est pas donné mais c'est moins cher qu'un CM freelance. Et le Pack Lancement ?" |
| 7 | **Scroll FAQ** | Section accordion FAQ | Réponses aux 8-9 objections principales (prix, IA, personnalisation, engagement). | "OK, pas d'engagement, je peux arrêter quand je veux. Et le contenu est vraiment personnalisé." |
| 8a | **CTA principal** | Clic sur "Commencer maintenant" → redirigé vers Stripe Checkout (Pack Lancement ou Mensuel) | Page Stripe avec résumé de la commande. | "Allez, je me lance." → Passe au Flow 2. |
| 8b | **CTA secondaire** | Clic sur "Voir un exemple pour ma zone" → mini formulaire (prénom + ville + email) | Formulaire 3 champs ultra simple. | "Ça ne coûte rien d'essayer, je mets juste mon email." |
| 9 | **Sortie sans action** | Ferme le site → retargeting organique (voit d'autres posts ImmoCrew dans les jours suivants) | Nouveaux avant/après dans son feed Facebook/LinkedIn. | "J'y repense... Faut que j'y retourne." |

### Points de friction pour Sophie

| Friction | Risque | Solution UX |
|----------|--------|-------------|
| **Page trop longue, trop de texte** | Sophie scrolle sur son iPhone en 30 secondes. Si elle ne comprend pas vite, elle part. | Hero ultra clair (5 secondes max). Sections courtes. Beaucoup d'espace blanc. Titre de chaque section = bénéfice, pas fonctionnalité. |
| **Le prix choque avant qu'elle comprenne la valeur** | Elle voit "197 euros" et ferme la page avant de lire les bénéfices. | Placer le pricing APRÈS les avant/après et les témoignages. Ancrer le prix avec la comparaison : "Moins que ta commission sur un studio." |
| **Elle doute que ce soit vraiment personnalisé** | "C'est sûrement du contenu IA générique avec le nom de ma ville en variable." | Les avant/après montrent des données hyper-locales (nom de quartier, écoles, ambiance). CTA "Voir un exemple pour MA zone" renforce la personnalisation. |
| **Elle ne comprend pas ce qu'elle va recevoir concrètement** | Confusion entre "outil" et "service". | Lister explicitement : "12 posts, 2 articles, 4 annonces, 4 scripts vidéo." Utiliser un mockup visuel d'un livrable complet. |
| **Elle a peur de l'engagement** | "Et si ça ne marche pas et que je suis bloquée ?" | Mention visible "Sans engagement" + garantie 14 jours sur le Pack Lancement. Pas de mention "contrat" ou "abonnement" (dire "chaque mois"). |
| **Le site n'est pas crédible (nouveau, pas d'avis)** | "C'est tout neuf, personne ne connaît." | Miser sur les avant/après (preuve de compétence). Mettre le nom et la photo du fondateur (transparence). Ajouter les logos des réseaux ciblés (IAD, SAFTI — pas "partenaires" mais "nos clients viennent de"). |

### Métriques de succès

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux de rebond landing page (mobile) | < 55% | PostHog |
| Temps moyen sur la page | > 2 minutes | PostHog |
| Taux de scroll jusqu'au pricing | > 40% | PostHog (scroll tracking) |
| Taux de clic CTA principal | > 5% des visiteurs | PostHog |
| Taux de clic CTA secondaire (lead magnet) | > 8% des visiteurs | PostHog |
| Taux de conversion visiteur → paiement | > 2% | Stripe + PostHog |

---

## Flow 2 — Onboarding

**Scénario** : Sophie vient de payer (Pack Lancement 497 euros ou Pack Mensuel 197 euros via Stripe Checkout). Elle est redirigée vers la page de bienvenue, puis doit compléter le formulaire d'onboarding en 7 étapes pour que ses livrables soient personnalisés. Le tout doit prendre moins de 7 minutes.

**Point d'entrée** : redirection post-paiement Stripe → `immocrew.fr/bienvenue`

### Étapes

| # | Étape | Écran / Action | Ce que Sophie voit | Ce que Sophie pense | Durée cible |
|---|-------|---------------|-------------------|-------------------|-------------|
| 1 | **Page de bienvenue** | `immocrew.fr/bienvenue` — page de succès post-paiement | Confetti discret. "Bienvenue dans l'équipe, Sophie !" (prénom récupéré via Stripe). Explication claire de la suite : "Complète ton profil en 5 min pour qu'on prépare tes premiers livrables." Bouton "C'est parti" en orange. | "OK, j'ai payé, c'est fait. Qu'est-ce qui se passe maintenant ?" | 15 sec |
| 2 | **Formulaire — Étape 1/7 : Identité** | Wizard avec barre de progression (1/7). Champs : prénom (pré-rempli), nom, réseau (select), ancienneté (select), nb ventes/an (select), photo (optionnel), logo (optionnel). | Formulaire simple, 5 champs obligatoires. Bulle d'aide : "On a besoin de ça pour personnaliser tes contenus." | "C'est facile, je connais tout ça." | 45 sec |
| 3 | **Formulaire — Étape 2/7 : Zone géo** | Champs : ville (autocomplétion), quartiers préférés (3 max), rayon d'action (slider), type de zone (multi-select). | Autocomplétion de la ville qui fonctionne bien. Slider visuel pour le rayon. | "OK, je mets Angers et mes 3 quartiers où j'ai le plus de mandats." | 45 sec |
| 4 | **Formulaire — Étape 3/7 : Spécialité** | Champs : types de biens (multi-select), clientèle (multi-select), gamme de prix (double slider), niche (optionnel). | Multi-selects visuels avec icônes. Double slider intuitif. | "Appartements et maisons, primo-accédants et familles, 120-350K. Facile." | 40 sec |
| 5 | **Formulaire — Étape 4/7 : Ton et branding** | Champs : ton de communication (select avec descriptions claires), tutoiement/vouvoiement (select), ce qui te différencie (textarea), valeurs (multi-select). | Descriptions sous chaque option de ton : "Professionnel et rassurant = tu inspires confiance, tu rassures tes clients." Placeholder dans le textarea : "Ex : Je connais chaque rue d'Angers..." | "Chaleureux et accessible, c'est moi. Et vouvoiement pour mes clients. Pour la description, je mets 2-3 phrases." | 1 min 15 |
| 6 | **Formulaire — Étape 5/7 : Biens en cours** | Champs répétables : titre du bien, adresse/quartier, type, prix, surface, pièces, points forts (3 max), photos (optionnel), lien annonce (optionnel). Bouton "Ajouter un autre bien." | Interface type cards. Un bien pré-affiché vide. Bouton + pour en ajouter d'autres. Mention : "Tu pourras en ajouter d'autres plus tard." | "J'ai 3 biens en ce moment. Je mets les infos principales. Les photos, je verrai après." | 1 min 30 |
| 7 | **Formulaire — Étape 6/7 : Présence digitale** | Champs : Facebook, Instagram, LinkedIn, Google Business, site web, YouTube (tous optionnels). | Tous les champs sont optionnels. Texte rassurant : "Pas de page Facebook ? Pas de souci, on t'aide à démarrer." | "Je mets ma page Facebook et mon Instagram. Le reste, j'ai pas." | 30 sec |
| 8 | **Formulaire — Étape 7/7 : Préférences contenu** | Champs : contenus prioritaires (drag-and-drop ou classement numéroté), sujets à aborder (multi-select), sujets à éviter (texte libre), fréquence (select). Checkbox CGV + RGPD. | Drag-and-drop simple pour classer ses priorités. Checkbox légales en bas avec lien vers CGV et politique de confidentialité. | "Posts en 1er, annonces en 2e. J'évite la politique. 3 posts par semaine c'est bien. Je coche les CGV." | 1 min |
| 9 | **Page de confirmation** | "C'est tout bon ! On prépare tes premiers livrables." Récapitulatif visuel de ce qu'elle va recevoir (avec les délais). Lien vers l'espace client. Lien vers le magic link de connexion (email envoyé automatiquement). | Récap : "Tu vas recevoir ton Pack Lancement dans 7 jours : 20 posts, 5 articles SEO..." Timeline visuelle. Bouton "Accéder à mon espace." | "Super, c'est clair. Je sais ce que je vais recevoir et quand. Je suis rassurée." | 15 sec |

**Durée totale estimée : 6 min 40 sec** (sous les 7 min cibles)

### Points de friction pour Sophie

| Friction | Risque | Solution UX |
|----------|--------|-------------|
| **Trop de champs, elle abandonne à l'étape 3** | Abandon en milieu de formulaire. Perte d'un client qui a déjà PAYÉ. | Sauvegarde automatique à chaque étape. Barre de progression visible (elle voit qu'elle avance). Si elle quitte, email de relance à J+1 : "Tu n'as pas terminé ton profil — il te reste 3 étapes !" |
| **Elle ne sait pas quoi mettre dans "ce qui te différencie"** | Champ textarea vide = livrables moins personnalisés. | Placeholder avec exemple concret. Bouton "Aide-moi" qui propose 3-4 phrases types à adapter. Mention : "On peut affiner ensemble plus tard." |
| **L'upload de photos est trop lourd sur mobile** | Les photos de biens sont lourdes (iPhone 5-10 Mo). Upload qui échoue = frustration. | Compression automatique côté client (max 2 Mo après compression). Texte : "Tu pourras ajouter tes photos plus tard depuis ton espace." Ne pas bloquer si pas de photo. |
| **Le drag-and-drop ne marche pas bien sur mobile** | Sophie est sur iPhone. Le drag-and-drop tactile est capricieux. | Alternative mobile : classement par numéros (1, 2, 3) au lieu du drag-and-drop. Ou boutons flèches haut/bas pour réordonner. |
| **Elle ne comprend pas les implications RGPD/IA** | Inquiétude : "Mes données sont envoyées à une IA ?" | Texte simple sous la checkbox : "Tes informations sont utilisées uniquement pour créer tes contenus marketing. Rien n'est revendu. Tu peux tout supprimer quand tu veux." Pas de jargon juridique dans le formulaire (le lien CGV est là pour les détails). |
| **Elle ne reçoit pas l'email de bienvenue** | Elle attend un email, ne le voit pas (spam), panique. | Page de confirmation affiche un message : "Un email arrive dans 5 min. Vérifie tes spams si tu ne le vois pas." Lien direct vers l'espace client sur la page de confirmation (pas dépendant de l'email). |

### Métriques de succès

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux de complétion du formulaire (acheteurs) | > 85% | PostHog (event par étape) |
| Durée moyenne de complétion | < 7 min | PostHog (timestamps étape 1 → confirmation) |
| Étape avec le plus d'abandons | Identifier et corriger | PostHog (funnel par étape) |
| Taux de remplissage champ "ce qui te différencie" | > 60% | Supabase query |
| Taux de complétion depuis mobile | > 80% (pas d'écart vs desktop) | PostHog (device split) |
| Délai entre paiement et fin d'onboarding | < 24h | PostHog + Stripe timestamps |

---

## Flow 3 — Espace client

**Scénario** : Sophie a payé et complété son onboarding il y a 10 jours. Elle reçoit un email : "Tes livrables d'avril sont prêts !" Elle clique sur le lien, se connecte via magic link, consulte ses livrables, en télécharge quelques-uns pour les publier sur ses réseaux.

**Point d'entrée** : email de livraison mensuelle → lien magic link → `immocrew.fr/dashboard`

### Étapes

| # | Étape | Écran / Action | Ce que Sophie voit | Ce que Sophie pense |
|---|-------|---------------|-------------------|-------------------|
| 1 | **Email de livraison** | Email mensuel : "Sophie, tes 12 posts et 2 articles d'avril sont prêts !" Bouton "Voir mes livrables" (lien magic link Clerk). | Email court et direct. Un bouton orange bien visible. Aperçu d'un post en image dans l'email. | "Ah cool, c'est arrivé ! Je regarde ça." |
| 2 | **Connexion magic link** | Clic sur le bouton → email Clerk avec magic link → clic sur le lien → connectée automatiquement → redirection `/dashboard`. | Pas de mot de passe. Un clic dans l'email et elle est connectée. | "Ah c'est pratique, pas besoin de mot de passe. J'y suis directement." |
| 3 | **Dashboard — vue d'ensemble** | Page d'accueil dashboard. "Bonjour Sophie, voici tes livrables d'avril." Badge vert "Livrés". Grille de livrables par catégorie. | Son prénom. Le mois en cours. Un badge rassurant "Livrés". Grille claire : posts (12), scripts vidéo (4), articles SEO (2), annonces (4), newsletter (1), email prospection (1). | "C'est clair. Je vois tout d'un coup d'oeil. Les 12 posts sont là." |
| 4 | **Aperçu d'un livrable** | Clic sur un post → modal ou page avec le texte complet. Bouton "Copier le texte" + "Télécharger". | Le texte du post en grand, lisible. Bouton "Copier" qui copie dans le presse-papier. | "Ah c'est bon ça ! Je copie, je colle dans Instagram, c'est fait." |
| 5 | **Copier un post** | Clic "Copier le texte" → texte copié dans le presse-papier → notification "Copié !" | Notification discrète "Copié !" en haut de l'écran. | "Parfait, je vais sur Instagram et je colle. 30 secondes." |
| 6 | **Télécharger tout** | Clic "Tout télécharger" → ZIP avec tous les livrables du mois organisés par dossier. | Téléchargement d'un ZIP. Dossiers : "Posts", "Articles", "Annonces", "Scripts-video", "Newsletter", "Email-prospection". | "Je garde tout sur mon téléphone. Comme ça je publie quand je veux dans la semaine." |
| 7 | **Consulter l'historique** | Clic sur "Mois précédents" → liste des mois passés (mars, février...). Clic sur un mois → mêmes livrables. | Navigation simple entre les mois. Même interface. | "Ah je peux retrouver les posts de mars pour les republier. Pratique." |
| 8 | **Modifier son profil** | Menu "Mon profil" → accès aux données d'onboarding en édition. Ajout d'un nouveau bien en mandat. | Même formulaire que l'onboarding mais pré-rempli. Elle peut modifier un champ, ajouter un bien. | "J'ai un nouveau mandat, je l'ajoute comme ça mes prochains posts en parlent." |
| 9 | **Gérer l'abonnement** | Menu "Mon abonnement" → statut, prochaine date de prélèvement, lien vers Stripe Customer Portal. | Infos claires : "Actif — prochain prélèvement le 15 mai — 197 euros." Bouton "Gérer" vers Stripe. | "Je vois mon abonnement, c'est transparent. Et si je veux arrêter, je peux." |

### Points de friction pour Sophie

| Friction | Risque | Solution UX |
|----------|--------|-------------|
| **Elle ne retrouve pas l'email de livraison** | Pas de connexion → ne voit pas ses livrables → pense que le service ne fonctionne pas. | Alternative : elle peut aller directement sur `immocrew.fr/dashboard` et se connecter avec son email (magic link envoyé à la demande). Bookmark suggéré à l'onboarding. |
| **Le magic link expire ou atterrit dans les spams** | Impossible de se connecter → frustration. | Page de login avec champ email : "Entre ton email, on t'envoie un lien de connexion." Texte : "Pas d'email ? Vérifie tes spams ou réessaie." Connexion email + mot de passe en backup (optionnel, créé depuis le profil). |
| **Elle ne sait pas quoi faire des livrables** | Elle voit les textes mais ne sait pas comment les publier sur Instagram/Facebook. | Mini-guide intégré au dashboard : "Comment publier tes posts" (3 étapes visuelles : copier → ouvrir Instagram → coller → publier). Affiché uniquement le 1er mois (puis masquable). |
| **Le ZIP est trop lourd à télécharger sur mobile** | Téléchargement lent ou échoué en 4G. | Privilégier le copier-coller individuel sur mobile. Le ZIP est utile sur desktop. Sur mobile, mettre en avant les boutons "Copier" individuels plutôt que "Tout télécharger". |
| **Elle ne pense pas à mettre à jour ses biens** | Livrables du mois suivant sans ses nouveaux mandats. | Email de rappel 5 jours avant la production mensuelle : "Sophie, as-tu de nouveaux biens ? Mets à jour ton profil avant le [date] pour qu'on les intègre." Lien direct vers la page "Mes biens". |

### Métriques de succès

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux d'ouverture email de livraison | > 70% | Outil emailing |
| Taux de connexion au dashboard / mois | > 80% des clients actifs | PostHog |
| Nombre de livrables consultés par visite | > 5 | PostHog |
| Taux d'utilisation "Copier le texte" | > 50% des livrables consultés | PostHog |
| Taux de téléchargement ZIP | > 30% des clients / mois | PostHog |
| Temps moyen par session dashboard | 3-8 min (ni trop court = pas consulté, ni trop long = confusion) | PostHog |
| Taux de mise à jour profil / mois | > 20% des clients | Supabase |

---

## Flow 4 — Boost Mandat

**Scénario** : Sophie vient de signer un nouveau mandat exclusif pour une maison avec jardin à La Doutre (Angers). Elle veut maximiser la visibilité de ce bien. Depuis son espace client, elle commande un Boost Mandat à 97 euros pour recevoir une annonce storytelling, 3 posts dédiés, 1 script Reel, une mini landing page et un email blast.

**Point d'entrée** : dashboard client → section "Boost Mandat" OU email proactif d'ImmoCrew quand Sophie ajoute un bien

### Étapes

| # | Étape | Écran / Action | Ce que Sophie voit | Ce que Sophie pense |
|---|-------|---------------|-------------------|-------------------|
| 1 | **Déclencheur — ajout de bien** | Sophie ajoute un nouveau bien dans "Mon profil" → popup ou bandeau : "Tu veux booster ce bien ? Reçois une annonce storytelling + 3 posts + 1 Reel dédiés pour 97 euros." | Proposition contextuelle non intrusive. Aperçu de ce que le Boost inclut. Bouton "Booster ce bien" + "Non merci, pas cette fois". | "Ah tiens, c'est pas bête. 97 euros pour mettre le paquet sur ce bien." |
| 2 | **Alternative — depuis le dashboard** | Bouton permanent "Booster un bien" sur le dashboard (à côté des livrables mensuels). | Card visible : "Boost Mandat — 97 euros. Fais briller ton nouveau bien." avec liste des livrables inclus. | "Je sais que ça existe, je commanderai quand j'aurai un beau mandat." |
| 3 | **Sélection du bien** | Clic "Booster ce bien" → si déclenché depuis l'ajout, le bien est pré-sélectionné. Sinon, select parmi les biens en portefeuille. | Liste déroulante avec ses biens. Le bien ajouté en dernier est pré-sélectionné. | "C'est la maison à La Doutre, c'est bien ça." |
| 4 | **Récapitulatif et paiement** | Page récap : bien sélectionné, livrables inclus (annonce storytelling, 3 posts, 1 script Reel, mini landing page, email blast). Bouton "Payer 97 euros" → Stripe Checkout. | Récap clair de ce qu'elle va recevoir. Prix affiché. Délai de livraison indiqué (48-72h). | "97 euros, je reçois tout ça en 3 jours. Je sais exactement ce que j'achète." |
| 5 | **Paiement Stripe** | Stripe Checkout (one-shot, 97 euros). Carte déjà enregistrée (si paiement précédent). | Page Stripe avec carte pré-remplie. Un clic pour confirmer. | "Ma carte est déjà enregistrée, c'est rapide." |
| 6 | **Confirmation** | Page de confirmation : "C'est commandé ! Ton Boost Mandat pour [nom du bien] arrive dans 48-72h." Email de confirmation envoyé. | Confirmation claire avec délai. Retour facile vers le dashboard. | "OK c'est fait. Dans 3 jours j'ai tout pour lancer ce bien." |
| 7 | **Livraison** | Email + notification dashboard : "Le Boost pour ta maison à La Doutre est prêt !" Livrables disponibles dans une section dédiée du dashboard. | Section "Boosts" séparée des livrables mensuels. Mêmes boutons copier/télécharger. | "Super, je publie l'annonce ce soir et les posts dans la semaine." |

### Points de friction pour Sophie

| Friction | Risque | Solution UX |
|----------|--------|-------------|
| **Elle ne sait pas que le Boost existe** | Revenue d'upsell manquée. | 3 points de contact : 1) popup à l'ajout de bien, 2) card permanente sur le dashboard, 3) email proactif quand un bien est ajouté au profil. |
| **Elle hésite sur le prix (97 euros en plus du mensuel)** | Blocage prix → pas d'achat. | Contextualiser la valeur : "97 euros = la commission de 2m² sur ton bien à 189 000 euros." Montrer un avant/après d'annonce boost vs annonce standard. |
| **Elle ne comprend pas la différence avec le mensuel** | "J'ai déjà des posts dans mon pack mensuel, non ?" | Expliquer clairement : "Ton pack mensuel couvre ta communication générale. Le Boost, c'est du contenu 100% dédié à UN bien précis — pour maximiser les contacts acheteurs sur ce mandat." |
| **Le paiement ajoute une étape** | Friction checkout → abandon. | Stripe avec carte enregistrée = 1 clic. Pas de re-saisie des coordonnées bancaires. |

### Métriques de succès

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux de conversion popup "Boost" (à l'ajout de bien) | > 15% | PostHog |
| Nombre de Boosts commandés / mois | 10 (objectif MRR) | Stripe |
| Taux de clients ayant commandé au moins 1 Boost | > 30% après 3 mois | Stripe + Supabase |
| Délai moyen de livraison Boost | < 72h | Admin dashboard |
| Taux de ré-achat Boost (2e commande) | > 40% | Stripe |

---

## Flow 5 — Admin

**Scénario** : Le fondateur (admin) gère sa base de clients depuis le dashboard interne. Il voit qui a payé, qui a complété l'onboarding, où en est la production de chaque client, et il déclenche les livraisons.

**Point d'entrée** : `immocrew.fr/admin` (protégé, accès admin uniquement)

### Étapes

| # | Étape | Écran / Action | Ce que l'admin voit | Action requise |
|---|-------|---------------|--------------------|--------------------|
| 1 | **Vue d'ensemble** | Dashboard admin. Liste de tous les clients avec colonnes : nom, pack, statut onboarding, statut production mois en cours, date dernière livraison. | Tableau trié par urgence : clients en attente de production en haut (badge orange). Clients livrés en bas (badge vert). | Scanner rapidement : qui a besoin de livrables ? |
| 2 | **Fiche client** | Clic sur un client → fiche complète. Données d'onboarding, biens en cours, historique des livrables, historique des paiements, notes. | Toutes les infos du project-context client en un endroit. Bouton "Lancer la production" + "Marquer comme livré". | Consulter le profil avant de lancer la production. Vérifier que les données sont à jour. |
| 3 | **Lancement production** | Bouton "Lancer la production" → déclenche le pipeline agents Gradient pour ce client (au MVP : rappel manuel, pas d'automatisation). | Confirmation : "Production lancée pour Sophie Martin — Pack Mensuel avril." Statut passe à "En production" (badge bleu). | Lancer les agents, produire les livrables, faire la QA. |
| 4 | **Upload des livrables** | Section "Livrables" de la fiche client → upload des fichiers produits par les agents (posts, articles, annonces, etc.) organisés par catégorie. | Interface d'upload par catégorie. Drag-and-drop de fichiers. Preview avant validation. | Uploader les livrables après QA. Vérifier les aperçus. |
| 5 | **Livraison** | Bouton "Livrer" → les livrables deviennent visibles dans l'espace client. Email de livraison envoyé automatiquement. Statut passe à "Livré" (badge vert). | Confirmation : "Livrables d'avril livrés à Sophie Martin. Email envoyé." | Cliquer sur "Livrer" quand tout est prêt. |
| 6 | **Suivi des paiements** | Colonne "Paiement" : statut Stripe (actif, en retard, résilié). Alertes sur les paiements échoués. | Badges : vert (à jour), rouge (paiement échoué), gris (résilié). | Relancer les paiements échoués. Contacter les résiliés si pertinent. |
| 7 | **Notifications** | Section "À faire" en haut du dashboard : onboardings incomplets (> 48h), productions en retard, paiements échoués, profils mis à jour par le client. | Liste priorisée d'actions. Chaque item est cliquable et mène à l'action. | Traiter les urgences en premier. |

### Points de friction (admin)

| Friction | Risque | Solution UX |
|----------|--------|-------------|
| **Trop de clients, perte de vue** | Un client tombe dans l'oubli, livraison en retard. | Tri par urgence automatique. Alertes visuelles (badges couleur). Section "À faire" toujours visible. |
| **Production manuelle chronophage** | Au-delà de 15 clients, le temps explose. | Au MVP : process standardisé (1 clic → rappel de lancer les agents). Mois 2+ : automatisation pipeline agents. |
| **Pas de vue d'ensemble de la rentabilité** | Difficile de suivre le MRR et le churn. | Ligne de résumé en haut du dashboard : "X clients actifs — MRR X euros — X productions en cours — X en retard." |

### Métriques de succès

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Temps moyen entre paiement et livraison (Pack Lancement) | < 7 jours | Admin dashboard |
| Temps moyen entre début de mois et livraison mensuelle | < 5 jours ouvrés | Admin dashboard |
| Taux de livraison dans les délais | > 95% | Admin dashboard |
| Temps admin par client par mois | < 30 min (hors production IA) | Tracking manuel |
| Nombre de relances paiement échoué / mois | < 2 | Stripe |

---

## Synthèse des parcours — Vue croisée

### Points de contact critiques pour Sophie (moments où on la perd ou on la garde)

| Moment critique | Flow | Risque de perte | Indicateur de succès |
|----------------|------|-----------------|---------------------|
| Premier atterrissage sur le site | Flow 1, étape 2 | Rebond immédiat si le hero n'est pas clair | Taux de rebond < 55% |
| Scroll jusqu'au pricing | Flow 1, étape 6 | Abandon si le prix apparaît avant la compréhension de la valeur | Scroll > 40% jusqu'au pricing |
| Paiement Stripe | Flow 1→2 transition | Abandon au checkout (hésitation prix) | Taux de conversion checkout > 60% |
| Complétion onboarding | Flow 2, étapes 2-8 | Abandon si trop long ou trop complexe | Taux de complétion > 85% |
| 1re connexion au dashboard | Flow 3, étape 3 | Confusion si l'interface n'est pas limpide | Taux de 1re connexion dans les 24h > 90% |
| 1re utilisation d'un livrable (copier-coller) | Flow 3, étape 5 | Si elle ne publie pas, elle ne voit pas de résultat → churn | Taux de copier-coller > 50% |
| Renouvellement mois 2 | Flow 3 (récurrence) | Churn si les livrables mois 2 sont perçus comme moins bons | Rétention mois 1→2 : 100% |
| 1er Boost commandé | Flow 4 | Revenu d'upsell manqué | > 30% des clients en 3 mois |

### Principes UX transversaux

1. **3 secondes max** pour comprendre chaque écran (Sophie n'a pas le temps de réfléchir)
2. **Zéro jargon** : pas de "dashboard", pas de "livrables" côté client — dire "tes posts", "tes articles", "ton espace"
3. **Mobile-first** : chaque écran doit être conçu d'abord pour l'iPhone de Sophie (375px), puis élargi pour desktop
4. **Progression visible** : barre de progression dans l'onboarding, badges de statut dans le dashboard, confirmations claires à chaque action
5. **Réassurance continue** : textes de soutien ("C'est bientôt fini", "Tu peux modifier plus tard", "Pas d'engagement")
6. **Copier-coller comme interaction principale** : Sophie ne doit pas créer, elle doit copier. Le bouton "Copier" est l'interaction n°1 du dashboard.
7. **Magic link par défaut** : pas de mot de passe sauf si Sophie le choisit. Réduction de la friction de connexion.
8. **Email comme fil rouge** : chaque étape clé déclenche un email (bienvenue, onboarding incomplet, livraison, rappel mise à jour profil, Boost proposition)

---

## Handoff

**Destinataire principal** : @design (wireframes visuels, design system, composants)
**Destinataires secondaires** : @fullstack (implémentation des flows), @copywriter (textes de chaque écran)

**Ce document fournit** :
- Les 5 parcours utilisateurs complets avec étapes, points de friction et métriques
- Les principes UX à respecter pour chaque écran
- Les interactions clés (copier-coller, magic link, progression visible)

**Ce qu'il faut produire ensuite** :
- @design : wireframes visuels haute-fidélité basés sur les wireframes textuels (docs/ux/wireframes.md)
- @fullstack : implémentation des 5 flows en Next.js + Clerk + Stripe + Supabase
- @copywriter : microcopy de chaque écran (boutons, messages, emails transactionnels)

---

*Document produit par @ux dans le cadre du framework Gradient Agents.*
*Toutes les décisions UX sont calibrées pour Sophie (38 ans, mandataire IAD, non technique, mobile-first) conformément à docs/strategy/personas.md et docs/strategy/brand-platform.md.*
