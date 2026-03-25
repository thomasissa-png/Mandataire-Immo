# Wireframes Textuels — ImmoCrew

> Produit par @ux | 2026-03-25
> Sources : user-flows.md, functional-specs.md, brand-platform.md, personas.md
> Convention : wireframes en markdown/ASCII, mobile-first (iPhone 375px → desktop 1280px)
> Palette de référence : bleu nuit #1B2A4A, orange #F27A1A, blanc cassé #F8F6F2, gris #2D2D2D, vert CTA #34A853

---

## Sommaire

1. [Landing page](#1-landing-page)
2. [Formulaire d'onboarding (wizard 7 étapes)](#2-formulaire-donboarding)
3. [Espace client (dashboard)](#3-espace-client)
4. [Flow de paiement (Stripe Checkout)](#4-flow-de-paiement)

---

## 1. Landing page

**URL** : `immocrew.fr`
**Objectif** : convertir un mandataire en client ou en lead en < 3 min de lecture
**Layout** : page unique, scroll vertical, 7 sections

### 1.1 Hero (above the fold)

```
┌─────────────────────────────────────────────────┐
│  [Logo ImmoCrew]                    [Menu ☰]    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Tu n'as pas choisi l'immobilier               │
│  pour passer tes soirées sur Canva.            │
│                                                  │
│  Chaque mois, reçois tes posts, articles        │
│  et annonces — 100% personnalisés pour          │
│  ta zone. Tu publies, on fait le reste.         │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │   Voir un exemple pour ma zone   │  ← CTA   │
│  │         (bouton orange)          │  principal│
│  └───────────────────────────────────┘          │
│                                                  │
│  ┌─────────────────────────────────┐            │
│  │  [Mockup : aperçu d'un post    │            │
│  │   Instagram personnalisé avec   │            │
│  │   le nom d'un quartier réel]    │            │
│  └─────────────────────────────────┘            │
│                                                  │
│  Pas d'engagement · Résiliation libre            │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Le titre H1 est la première chose lue. Doit créer une identification immédiate ("c'est moi !").
- Le CTA principal est orange (#F27A1A) sur fond blanc cassé (#F8F6F2). Taille minimum 48px de hauteur (zone de tap mobile).
- Le mockup de livrable montre un VRAI quartier français (pas un placeholder). Sophie doit voir que c'est personnalisé.
- La mention "Pas d'engagement" est visible DANS le hero — pas cachée plus bas.
- Mobile : le mockup passe sous le CTA (empilé). Le titre reste au-dessus.

**Responsive :**
- Mobile (375px) : tout empilé verticalement. Titre → sous-titre → CTA → mockup → mention rassurante.
- Desktop (1280px) : titre + CTA à gauche (60%), mockup à droite (40%).

### 1.2 Section Problème / Solution

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  On sait, parce qu'on connaît ton quotidien.    │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │ ❌ Tu postes 2 semaines,              │      │
│  │    puis plus rien pendant 3 mois      │      │
│  │                                       │      │
│  │ ✅ 12 posts prêts chaque mois.        │      │
│  │    Tu n'as qu'à publier.              │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │ ❌ Tes annonces disent toutes         │      │
│  │    "bel appartement lumineux"         │      │
│  │                                       │      │
│  │ ✅ Annonces storytelling qui          │      │
│  │    parlent de TON quartier            │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │ ❌ 45 min devant Canva pour           │      │
│  │    un résultat "bof"                  │      │
│  │                                       │      │
│  │ ✅ Tout est fait. Tu copies,          │      │
│  │    tu colles, tu publies.             │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │ ❌ Aucun mandat entrant               │      │
│  │    via le digital                     │      │
│  │                                       │      │
│  │ ✅ Articles SEO + posts = tu          │      │
│  │    existes sur Google et Instagram    │      │
│  └───────────────────────────────────────┘      │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Format problème/solution en cards empilées. Le problème en rouge/gris, la solution en vert/orange.
- Chaque card est courte (2 lignes max par partie). Sophie scanne, ne lit pas.
- Les problèmes reprennent ses MOTS exacts (cf. personas.md — frustrations).
- Mobile : cards empilées pleine largeur. Desktop : grille 2x2.

### 1.3 Section Avant / Après

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  La différence ? Regarde par toi-même.          │
│                                                  │
│  ┌──────────────────┬──────────────────┐        │
│  │    AVANT         │    APRÈS         │        │
│  │                  │                  │        │
│  │ "Bel appart T3  │ "Ce T3 à La     │        │
│  │  lumineux,       │  Doutre, c'est  │        │
│  │  proche          │  5 min à pied   │        │
│  │  commerces,      │  du marché du   │        │
│  │  parking.        │  samedi et de   │        │
│  │  145 000€"       │  l'école        │        │
│  │                  │  Montessori.    │        │
│  │                  │  Balcon plein   │        │
│  │                  │  sud face au    │        │
│  │                  │  parc, cave +   │        │
│  │                  │  parking.       │        │
│  │                  │  145 000€"      │        │
│  └──────────────────┴──────────────────┘        │
│                                                  │
│  [2e exemple avant/après — autre quartier]       │
│                                                  │
│  (label discret) Contenu produit avec            │
│  assistance IA — relu et validé par l'équipe     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Côte à côte sur desktop, empilé sur mobile (avant en haut, après en dessous avec flèche →).
- L'avant est visuellement "éteint" (fond gris clair), l'après est visuellement "allumé" (bordure orange, fond blanc).
- Les noms de quartier dans l'après sont RÉELS et vérifiables (Angers, Montpellier, Bordeaux).
- Mention IA discrète mais visible (obligation AI Act). Police petite, couleur gris clair.
- Minimum 2 exemples. Pas de carousel — tout visible d'un coup.

### 1.4 Section Social Proof

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  Elles font le même métier que toi.             │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │  "Je reçois, je publie, c'est tout. │       │
│  │   Je n'ai même pas ouvert Canva      │       │
│  │   depuis 2 mois."                    │       │
│  │                                      │       │
│  │   — Marie, mandataire IAD            │       │
│  │     Toulouse, 2 ans d'XP             │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │  [2e témoignage — mandataire SAFTI]  │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  Nos clients viennent de :                       │
│  [logo IAD] [logo SAFTI] [logo Capifrance]      │
│                                                  │
│  X livrables produits · X annonces réécrites    │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Au lancement (pas de vrais clients) : utiliser des verbatims du beta test ou des métriques du service ("X annonces réécrites").
- Les témoignages DOIVENT inclure : prénom, réseau, ville, ancienneté. Sophie s'identifie si le profil est proche du sien.
- Les logos réseau ne sont PAS présentés comme des partenariats (risque juridique). Formulation : "Nos clients viennent de".
- Mobile : témoignages empilés. Desktop : côte à côte.

### 1.5 Section Pricing

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  Choisis ton pack.                               │
│                                                  │
│  ┌─────────────┐┌──────────────┐┌─────────────┐│
│  │  LANCEMENT  ││  MENSUEL     ││  BOOST      ││
│  │             ││  ★ Populaire ││  MANDAT     ││
│  │  497€       ││              ││             ││
│  │  one-shot   ││  197€/mois   ││  97€/bien   ││
│  │             ││              ││             ││
│  │ • Position- ││ • 12 posts   ││ • Annonce   ││
│  │   nement    ││ • 4 scripts  ││   storytell ││
│  │ • Bio       ││   vidéo      ││ • 3 posts   ││
│  │ • 5 templa- ││ • 2 articles ││   dédiés    ││
│  │   tes       ││   SEO        ││ • 1 Reel    ││
│  │ • 5 art.    ││ • 1 news-    ││ • Mini      ││
│  │   SEO       ││   letter     ││   landing   ││
│  │ • Calendrier││ • 4 annonces ││ • Email     ││
│  │ • 20 posts  ││ • 1 email    ││   blast     ││
│  │ • 10 Reels  ││   prospect.  ││             ││
│  │ • Kit graph.││              ││             ││
│  │             ││              ││             ││
│  │ [Commencer] ││ [Commencer]  ││ [Booster]   ││
│  │             ││              ││             ││
│  │ Satisfait   ││ Sans         ││ Ponctuel    ││
│  │ ou remboursé││ engagement   ││             ││
│  │ 14 jours    ││              ││             ││
│  └─────────────┘└──────────────┘└─────────────┘│
│                                                  │
│  Tous les prix TTC. 197€/mois = moins que       │
│  ta commission sur un studio.                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Le Pack Mensuel est au CENTRE et mis en avant (bordure orange, badge "Populaire", légèrement plus grand).
- Les prix sont en TTC et en gros. Le HT est disponible au survol (tooltip) ou en petits caractères.
- Chaque livrable est listé explicitement. Pas de "et plus encore" — Sophie veut savoir EXACTEMENT ce qu'elle achète.
- La phrase d'ancrage de prix ("moins que ta commission sur un studio") est sous le pricing.
- Chaque CTA pointe vers Stripe Checkout avec le bon produit.
- Mobile : les 3 cards sont empilées verticalement, Pack Mensuel en premier (scrollé en premier).
- Mentions de garantie / engagement visibles DANS chaque card (pas en footnote).

### 1.6 Section FAQ

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  Tu as des questions ? C'est normal.             │
│                                                  │
│  ▸ C'est quoi exactement ImmoCrew ?             │
│  ─────────────────────────────────────          │
│  ▸ Le contenu est fait par une IA ?             │
│  ─────────────────────────────────────          │
│  ▸ Comment c'est personnalisé pour ma zone ?    │
│  ─────────────────────────────────────          │
│  ▸ 197€/mois, c'est rentable ?                  │
│  ─────────────────────────────────────          │
│  ▸ Je n'ai pas le temps de publier.             │
│  ─────────────────────────────────────          │
│  ▸ Mon réseau me donne déjà des templates.      │
│  ─────────────────────────────────────          │
│  ▸ Comment je reçois mes livrables ?            │
│  ─────────────────────────────────────          │
│  ▸ Je peux arrêter quand je veux ?              │
│  ─────────────────────────────────────          │
│  ▸ Qui est derrière ImmoCrew ?                  │
│  ─────────────────────────────────────          │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Format accordion : clic/tap sur une question → la réponse se déploie en dessous.
- Une seule question ouverte à la fois (les autres se ferment pour ne pas surcharger l'écran mobile).
- Les questions sont formulées avec les MOTS de Sophie (1re personne, tutoiement).
- Au moins une réponse mentionne explicitement l'IA (conformité AI Act).
- Mobile et desktop : même layout (pleine largeur).

### 1.7 CTA Final (footer de conversion)

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │                                       │      │
│  │  Prêt(e) à avoir ton                 │      │
│  │  équipe marketing ?                   │      │
│  │                                       │      │
│  │  ┌─────────────────────────────┐     │      │
│  │  │    Commencer maintenant     │     │      │
│  │  │       (bouton orange)       │     │      │
│  │  └─────────────────────────────┘     │      │
│  │                                       │      │
│  │  ou Voir un exemple gratuit           │      │
│  │     pour ma zone →                    │      │
│  │                                       │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│──────────────────────────────────────────────────│
│  FOOTER                                          │
│  ImmoCrew — L'équipe marketing                   │
│  des mandataires immobiliers                     │
│                                                  │
│  CGV · Politique de confidentialité ·            │
│  Mentions légales · contact@immocrew.fr          │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Fond bleu nuit (#1B2A4A), texte blanc. Contraste fort avec le reste de la page pour marquer la fin.
- 2 CTA : principal (bouton orange → Stripe) + secondaire (lien texte → formulaire lead).
- Le footer contient les liens légaux obligatoires (CGV, confidentialité, mentions).
- Bandeau cookies au premier chargement (overlay en bas de page, non bloquant).

---

## 2. Formulaire d'onboarding

**URL** : `immocrew.fr/onboarding`
**Objectif** : collecter les infos client en < 7 min via un wizard 7 étapes
**Layout** : une étape par écran, barre de progression en haut, boutons Précédent / Suivant en bas

### 2.0 Structure commune à toutes les étapes

```
┌─────────────────────────────────────────────────┐
│  [Logo ImmoCrew]                                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  ● ● ● ○ ○ ○ ○   Étape 3 sur 7                │
│  ═══════════░░░░░░░░░░  (barre de progression)  │
│                                                  │
│  ┌───────────────────────────────────────┐      │
│  │                                       │      │
│  │  Titre de l'étape                     │      │
│  │  Sous-titre rassurant                 │      │
│  │                                       │      │
│  │  [Champ 1]                            │      │
│  │  [Champ 2]                            │      │
│  │  [Champ 3]                            │      │
│  │                                       │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  │ (gris)   │         │    (orange)     │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
│  Sauvegardé automatiquement ✓                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Barre de progression : ronds pleins (étapes complétées), rond en cours (couleur orange), ronds vides (à venir). Avec le numéro "Étape X sur 7".
- Maximum 5 champs visibles par étape (pas de scroll vertical dans le formulaire sur mobile).
- Bouton "Suivant" orange, proéminent. Bouton "Précédent" gris, discret.
- Mention "Sauvegardé automatiquement" visible en bas — rassure Sophie qu'elle ne perd pas sa saisie.
- Validation inline en temps réel : bordure rouge + message d'erreur sous le champ si invalide.
- Mobile : champs pleine largeur, boutons collés en bas de l'écran (sticky bottom).

### 2.1 Étape 1 — Qui es-tu ?

```
┌─────────────────────────────────────────────────┐
│  ● ○ ○ ○ ○ ○ ○   Étape 1 sur 7                │
│  ═░░░░░░░░░░░░░░                                │
│                                                  │
│  Dis-nous qui tu es.                             │
│  Ça prend 1 minute — promis.                    │
│                                                  │
│  Prénom              Nom                         │
│  ┌──────────────┐   ┌──────────────┐            │
│  │ Sophie       │   │              │            │
│  └──────────────┘   └──────────────┘            │
│  (pré-rempli Stripe)                             │
│                                                  │
│  Ton réseau                                      │
│  ┌──────────────────────────┐                   │
│  │ IAD              ▾      │                   │
│  └──────────────────────────┘                   │
│                                                  │
│  Depuis combien de temps ?                       │
│  ┌──────────────────────────┐                   │
│  │ 1-2 ans            ▾    │                   │
│  └──────────────────────────┘                   │
│                                                  │
│  Combien de ventes par an (à peu près) ?         │
│  ┌──────────────────────────┐                   │
│  │ 4-6                ▾    │                   │
│  └──────────────────────────┘                   │
│                                                  │
│  Ta photo pro (optionnel)                        │
│  ┌────────────────────┐                         │
│  │  📷 Ajouter       │                         │
│  └────────────────────┘                         │
│                                                  │
│                         ┌─────────────────┐     │
│                         │    Suivant →    │     │
│                         └─────────────────┘     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Prénom pré-rempli depuis Stripe (donné au paiement). Bonne surprise pour Sophie : "Ils connaissent déjà mon prénom".
- Les labels sont des questions en langage courant ("Depuis combien de temps ?") pas des labels techniques ("Ancienneté").
- Les selects ont des options lisibles (pas de code, pas d'abréviation).
- La photo est clairement optionnelle (texte + style atténué). Pas de blocage si pas d'upload.
- Mobile : prénom et nom empilés (pas côte à côte).

### 2.2 Étape 2 — Où travailles-tu ?

```
┌─────────────────────────────────────────────────┐
│  ● ● ○ ○ ○ ○ ○   Étape 2 sur 7                │
│  ═══░░░░░░░░░░░░                                │
│                                                  │
│  Où est-ce que tu travailles ?                   │
│  On va personnaliser chaque contenu              │
│  pour TA zone.                                   │
│                                                  │
│  Ta ville principale                             │
│  ┌──────────────────────────────┐               │
│  │ Ang...  → Angers (49000) ✓  │  autocomplete │
│  └──────────────────────────────┘               │
│                                                  │
│  Tes quartiers préférés (3 max)                 │
│  ┌──────────────────────────────┐               │
│  │ La Doutre  ✕                │               │
│  │ Saint-Serge  ✕              │               │
│  │ + Ajouter un quartier       │               │
│  └──────────────────────────────┘               │
│                                                  │
│  Ton rayon d'action                              │
│  5 km ──────●────────── 50 km                   │
│              20 km                               │
│                                                  │
│  Type de zone                                    │
│  [■ Urbain] [■ Périurbain] [□ Rural]            │
│  [□ Littoral] [□ Montagne]                      │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Autocomplétion ville via API adresse.data.gouv.fr. Affiche le nom + code postal. Feedback visuel quand la ville est validée.
- Les quartiers sont des tags ajoutables avec un champ texte libre. Bouton "+" pour en ajouter. Croix pour supprimer. Maximum 3 visuellement indiqué.
- Slider tactile pour le rayon. Valeur affichée au-dessus du curseur en temps réel.
- Les multi-selects type de zone sont des boutons-toggles (pas des checkboxes classiques). Plus faciles à taper sur mobile.

### 2.3 Étape 3 — Ta spécialité

```
┌─────────────────────────────────────────────────┐
│  ● ● ● ○ ○ ○ ○   Étape 3 sur 7                │
│  ═════░░░░░░░░░░                                │
│                                                  │
│  Quel immobilier tu fais ?                       │
│  Pour que tes contenus parlent à                 │
│  TES clients.                                    │
│                                                  │
│  Types de biens                                  │
│  [■ Apparts] [■ Maisons] [□ Terrains]           │
│  [□ Locaux] [□ Prestige] [□ Neuf]               │
│                                                  │
│  Ta clientèle                                    │
│  [■ Primo-accédants] [■ Familles]               │
│  [□ Investisseurs] [□ Seniors] [□ Pros]         │
│                                                  │
│  Gamme de prix habituelle                        │
│  120K€ ────●──────●──── 800K€                   │
│        min 120K    max 350K                      │
│                                                  │
│  Une spécialité en plus ? (optionnel)            │
│  ┌──────────────────────────────┐               │
│  │ Ex : rénovation énergétique  │ placeholder   │
│  └──────────────────────────────┘               │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Boutons-toggles visuels pour les multi-selects (type de biens, clientèle). Sélection/déselection en un tap.
- Double slider pour la gamme de prix. Valeurs min et max affichées en temps réel.
- Le champ spécialité est clairement optionnel (style atténué, placeholder en gris).
- Pas de jargon : "Apparts" pas "Appartements T1-T5", "Familles" pas "Acquéreurs en résidence principale".

### 2.4 Étape 4 — Ton style

```
┌─────────────────────────────────────────────────┐
│  ● ● ● ● ○ ○ ○   Étape 4 sur 7                │
│  ═══════░░░░░░░░                                │
│                                                  │
│  Comment tu veux qu'on parle                     │
│  en ton nom ?                                    │
│                                                  │
│  Choisis le ton qui te ressemble                 │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │ ○ Professionnel et rassurant     │          │
│  │   Tu inspires confiance.         │          │
│  │   Sérieux mais pas froid.        │          │
│  ├───────────────────────────────────┤          │
│  │ ● Chaleureux et accessible       │ ← select │
│  │   Tu es proche de tes clients.   │          │
│  │   Humain et bienveillant.        │          │
│  ├───────────────────────────────────┤          │
│  │ ○ Dynamique et enthousiaste      │          │
│  │   Tu as de l'énergie à revendre. │          │
│  │   Positif et motivant.           │          │
│  ├───────────────────────────────────┤          │
│  │ ○ Expert et factuel              │          │
│  │   Tu parles chiffres et données. │          │
│  │   Précis et crédible.            │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  Avec tes clients, tu dis plutôt :              │
│  [● Tu] [○ Vous] [○ Ça dépend]                 │
│                                                  │
│  Ce qui te rend unique (en 2-3 phrases)         │
│  ┌──────────────────────────────────┐           │
│  │ Ex : "Je connais chaque rue     │ placeholder│
│  │ d'Angers, j'ai grandi ici."     │           │
│  └──────────────────────────────────┘           │
│  ┌───────────────┐                              │
│  │ 💡 Aide-moi  │  → affiche 3-4 suggestions  │
│  └───────────────┘                              │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Le choix du ton est présenté en radio cards (pas un select dropdown). Chaque option a un titre + 2 lignes de description. Sophie peut lire et se reconnaître.
- L'option sélectionnée a une bordure orange + fond légèrement coloré.
- Le bouton "Aide-moi" pour le textarea ouvre une modale avec 3-4 exemples de phrases à copier/adapter. Réduit le blocage page blanche.
- Le tutoiement/vouvoiement est en boutons radio visuels, pas un dropdown (3 options seulement).

### 2.5 Étape 5 — Tes biens

```
┌─────────────────────────────────────────────────┐
│  ● ● ● ● ● ○ ○   Étape 5 sur 7                │
│  ═════════░░░░░░                                │
│                                                  │
│  Quels biens tu as en mandat ?                   │
│  On va créer des annonces et des posts           │
│  pour chacun.                                    │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │  Bien n°1                         │          │
│  │                                   │          │
│  │  Titre : Appart T3 — La Doutre   │          │
│  │  Quartier : La Doutre, Angers     │          │
│  │  Type : Appartement  ▾            │          │
│  │  Prix : 189 000€                  │          │
│  │  Surface : 68 m²                  │          │
│  │  Pièces : 3                       │          │
│  │  Points forts :                   │          │
│  │  [Balcon plein sud ✕]             │          │
│  │  [Parking ✕]                      │          │
│  │  [+ Ajouter]                      │          │
│  │                                   │          │
│  │  Photos (optionnel) : 📷 Ajouter │          │
│  │  Lien annonce (optionnel) : 🔗   │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │  + Ajouter un autre bien          │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  Pas de bien en ce moment ? Pas grave,           │
│  tu pourras en ajouter plus tard.                │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Card par bien. Le 1er bien est affiché vide. Bouton "+" pour ajouter d'autres biens (max 10).
- Les champs obligatoires sont limités : titre, quartier, type, prix, surface, pièces. Le reste est optionnel.
- Points forts en tags (comme les quartiers — ajout/suppression facile).
- Message rassurant si pas de biens : "Tu pourras en ajouter plus tard." Le bouton Suivant reste cliquable même sans bien.
- Upload photos : compression automatique côté client. Barre de progression visible. Texte : "Tu pourras ajouter tes photos depuis ton espace plus tard."
- Mobile : les cards de biens occupent toute la largeur. Scroll vertical si plusieurs biens.

### 2.6 Étape 6 — Ta présence en ligne

```
┌─────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ○   Étape 6 sur 7                │
│  ═══════════░░░░                                │
│                                                  │
│  Tu es déjà quelque part en ligne ?             │
│  Partage tes comptes pour qu'on soit             │
│  cohérents avec ce qui existe.                   │
│                                                  │
│  Facebook   ┌──────────────────────────┐        │
│  (page pro) │ https://facebook.com/... │        │
│             └──────────────────────────┘        │
│                                                  │
│  Instagram  ┌──────────────────────────┐        │
│             │ @sophie.martin.immo      │        │
│             └──────────────────────────┘        │
│                                                  │
│  LinkedIn   ┌──────────────────────────┐        │
│             │                          │        │
│             └──────────────────────────┘        │
│                                                  │
│  Google     ┌──────────────────────────┐        │
│  Business   │                          │        │
│             └──────────────────────────┘        │
│                                                  │
│  Site web   ┌──────────────────────────┐        │
│             │                          │        │
│             └──────────────────────────┘        │
│                                                  │
│  Pas de comptes ? Pas de souci, on t'aide       │
│  à démarrer.                                     │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │    Suivant →    │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Tous les champs sont optionnels. Chaque champ a une icône du réseau social correspondant à gauche.
- Validation du format URL en temps réel (si quelque chose est saisi). Pas de message d'erreur si vide.
- Message rassurant en bas : "Pas de comptes ? Pas de souci." Sophie ne doit pas se sentir jugée.
- Étape la plus rapide du wizard (30 sec). Contribue à la sensation de vitesse.

### 2.7 Étape 7 — Tes préférences

```
┌─────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ●   Étape 7 sur 7                │
│  ═══════════════   Dernière étape !             │
│                                                  │
│  Dernière étape ! Dis-nous ce que                │
│  tu veux en priorité.                            │
│                                                  │
│  Classe tes contenus par priorité               │
│  (du plus important au moins important)          │
│                                                  │
│  ┌─ 1. ─────────────────────────────┐           │
│  │  ▲ ▼  Posts réseaux sociaux      │           │
│  ├─ 2. ─────────────────────────────┤           │
│  │  ▲ ▼  Annonces immobilières      │           │
│  ├─ 3. ─────────────────────────────┤           │
│  │  ▲ ▼  Articles SEO               │           │
│  ├─ 4. ─────────────────────────────┤           │
│  │  ▲ ▼  Scripts vidéo / Reels      │           │
│  ├─ 5. ─────────────────────────────┤           │
│  │  ▲ ▼  Newsletters                │           │
│  ├─ 6. ─────────────────────────────┤           │
│  │  ▲ ▼  Emails prospection         │           │
│  └───────────────────────────────────┘           │
│                                                  │
│  Sujets qui t'intéressent                       │
│  [■ Marché local] [□ Conseils acheteurs]        │
│  [■ Conseils vendeurs] [□ Vie du quartier]      │
│  [□ Actu immo] [□ Coulisses du métier]          │
│                                                  │
│  Un sujet à éviter ? (optionnel)                │
│  ┌──────────────────────────────┐               │
│  │ Ex : pas de politique        │ placeholder   │
│  └──────────────────────────────┘               │
│                                                  │
│  ☑ J'ai lu et j'accepte les CGV et la           │
│    Politique de Confidentialité.                  │
│                                                  │
│  (i) Tes informations sont utilisées pour        │
│  créer tes contenus marketing. Rien n'est        │
│  revendu. Tu peux tout supprimer quand tu veux. │
│                                                  │
│  ┌──────────┐         ┌─────────────────┐       │
│  │ Précédent│         │   Terminer ✓   │       │
│  └──────────┘         └─────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Classement par flèches haut/bas (pas de drag-and-drop sur mobile — trop capricieux). Numérotation automatique.
- Sur desktop : drag-and-drop disponible comme alternative.
- Checkbox CGV obligatoire avec liens cliquables vers les documents. Le bouton "Terminer" est grisé tant que la checkbox n'est pas cochée.
- Le texte RGPD simplifié est visible SANS cliquer (pas dans un accordion). Langage simple, pas juridique.
- Le bouton "Terminer" remplace "Suivant" — signale que c'est la fin. Couleur verte (#34A853) pour le sentiment d'accomplissement.
- Mention "Dernière étape !" en haut pour motiver Sophie.

### 2.8 Page de confirmation post-onboarding

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  ✓ C'est tout bon !                             │
│                                                  │
│  On prépare tes premiers livrables.             │
│                                                  │
│  Voici ce que tu vas recevoir :                  │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │  📦 Pack Lancement (7 jours)     │          │
│  │  • Ton positionnement            │          │
│  │  • Bio optimisée                 │          │
│  │  • 20 posts prêts à publier      │          │
│  │  • 5 articles SEO local          │          │
│  │  • 10 scripts Reels              │          │
│  │  • Calendrier éditorial 30 jours │          │
│  │  • Kit graphique                 │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  📅 Livraison estimée : [date J+7]              │
│                                                  │
│  On t'envoie un email quand c'est prêt.         │
│  En attendant, tu peux accéder à ton espace :    │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │    Accéder à mon espace           │          │
│  │       (bouton orange)             │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  💡 Astuce : ajoute immocrew.fr à tes           │
│  favoris pour y revenir facilement.              │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Sentiment de victoire : checkmark vert, message positif. Sophie vient de terminer un effort — il faut la féliciter.
- Récap concret de ce qu'elle va recevoir + date de livraison estimée. Aucune ambiguïté.
- CTA vers l'espace client (même si vide pour l'instant — elle voit que l'interface existe).
- Suggestion de bookmark : Sophie est sur iPhone, les bookmarks l'aideront à revenir sans chercher l'email.

---

## 3. Espace client

**URL** : `immocrew.fr/dashboard`
**Objectif** : consulter et télécharger ses livrables mensuels en < 5 min
**Layout** : sidebar (desktop) / bottom nav (mobile), contenu principal au centre

### 3.1 Navigation

```
MOBILE (bottom nav bar) :                  DESKTOP (sidebar) :
┌────────────────────────┐                 ┌──────────┬───────────────────┐
│                        │                 │          │                   │
│  [contenu principal]   │                 │  Logo    │  [contenu         │
│                        │                 │          │   principal]      │
│                        │                 │  ─────── │                   │
│                        │                 │          │                   │
├────────────────────────┤                 │  Mes     │                   │
│ 📋    📦    👤    ⚙️   │                 │  posts   │                   │
│ Posts  Tout  Profil Abo│                 │          │                   │
└────────────────────────┘                 │  Mon     │                   │
                                           │  profil  │                   │
                                           │          │                   │
                                           │  Mon abo │                   │
                                           │          │                   │
                                           │  ─────── │                   │
                                           │  Booster │                   │
                                           │  un bien │                   │
                                           └──────────┴───────────────────┘
```

**Annotations UX :**
- Mobile : bottom navigation bar avec 4 icônes + labels courts. Pattern natif iOS/Android, familier pour Sophie.
- Desktop : sidebar gauche fixe. Logo en haut, navigation verticale.
- Pas de terme technique dans la navigation : "Mes posts" (pas "Dashboard"), "Mon profil" (pas "Settings"), "Mon abo" (pas "Billing").
- Le bouton "Booster un bien" est visible dans la nav mais avec un style différent (fond orange, badge "97 euros") pour le distinguer comme action d'achat.

### 3.2 Page d'accueil — Livrables du mois

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  Bonjour Sophie !                                │
│  Voici tes contenus d'avril.  [● Livrés]        │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │  Tout télécharger (ZIP)    📥       │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ── Posts réseaux sociaux (12) ──────────       │
│                                                  │
│  ┌─────────────┐ ┌─────────────┐                │
│  │ Post 1      │ │ Post 2      │                │
│  │             │ │             │                │
│  │ "Ce T3 à   │ │ "3 erreurs  │                │
│  │  La Doutre  │ │  quand on   │                │
│  │  c'est..."  │ │  vend sa..."│                │
│  │             │ │             │                │
│  │ [Copier 📋]│ │ [Copier 📋]│                │
│  └─────────────┘ └─────────────┘                │
│                                                  │
│  ┌─────────────┐ ┌─────────────┐                │
│  │ Post 3      │ │ Post 4      │                │
│  │ ...         │ │ ...         │                │
│  │ [Copier 📋]│ │ [Copier 📋]│                │
│  └─────────────┘ └─────────────┘                │
│                                                  │
│  [Voir les 12 posts →]                           │
│                                                  │
│  ── Articles SEO (2) ───────────────────        │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │ "Acheter à La Doutre en 2026 :      │       │
│  │  prix, écoles, ambiance"             │       │
│  │                          [Lire] [📥] │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │ "Vendre sa maison à Angers :        │       │
│  │  5 conseils d'une pro locale"        │       │
│  │                          [Lire] [📥] │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ── Annonces (4) ───────────────────────        │
│  ── Scripts vidéo (4) ──────────────────        │
│  ── Newsletter (1) ─────────────────────        │
│  ── Email prospection (1) ──────────────        │
│                                                  │
│  ────────────────────────────────────────       │
│  📅 Mois précédents :                           │
│  [Mars 2026] [Février 2026] ...                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Le prénom de Sophie en haut. Badge vert "Livrés" (ou orange "En préparation" si pas encore prêts).
- Bouton "Tout télécharger" très visible en haut (c'est l'action rapide pour ceux qui veulent tout d'un coup).
- Les livrables sont groupés par catégorie avec un compteur (12 posts, 2 articles...).
- Chaque post affiche un aperçu texte (2-3 premières lignes) + bouton "Copier" directement visible (interaction n°1).
- Sur mobile : grille 1 colonne (cards empilées). Sur desktop : grille 2-3 colonnes.
- Les posts sont les premiers (catégorie la plus utilisée par Sophie). L'ordre est : posts → articles → annonces → scripts → newsletter → email.
- "Voir les 12 posts" : lien vers une vue étendue si seulement 4 affichés par défaut.
- Historique des mois en bas : boutons-tags cliquables. Navigation sans rechargement de page.
- Clic sur un livrable → modale avec texte complet + bouton "Copier le texte" + "Télécharger PDF".

### 3.3 Modale d'aperçu d'un livrable

```
┌─────────────────────────────────────────────────┐
│                                          [✕]    │
│                                                  │
│  Post 1 — Avril 2026                             │
│  Catégorie : Mandat en cours                     │
│                                                  │
│  ────────────────────────────────────────       │
│                                                  │
│  Ce T3 à La Doutre, c'est le genre              │
│  d'appart qui se vit.                            │
│                                                  │
│  À 5 minutes à pied du marché du samedi,        │
│  en face du parc, avec l'école Montessori        │
│  au bout de la rue. Le balcon plein sud          │
│  donne sur les toits d'Angers — et le café       │
│  du dimanche matin y est parfait.                │
│                                                  │
│  68m², 3 pièces, parking + cave.                │
│  189 000€.                                       │
│                                                  │
│  Tu cherches un cocon à Angers ?                │
│  Envoie-moi un message, je te fais visiter.     │
│                                                  │
│  #immobilier #angers #ladoutre                   │
│  #appartement #mandataire                        │
│                                                  │
│  ────────────────────────────────────────       │
│                                                  │
│  ┌──────────────────┐ ┌───────────────┐         │
│  │  Copier le texte  │ │  Télécharger  │         │
│  │     (orange)      │ │    (gris)     │         │
│  └──────────────────┘ └───────────────┘         │
│                                                  │
│  ← Post précédent    Post suivant →             │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Modale centrée (desktop) ou plein écran (mobile).
- Le texte est le contenu principal — grande taille de police, bien lisible.
- Bouton "Copier le texte" orange et proéminent. Au clic : texte copié dans le presse-papier + feedback "Copié !" (toast notification 2 sec).
- Navigation entre les livrables de la même catégorie (flèches gauche/droite) sans fermer la modale.
- Le bouton de fermeture (✕) est en haut à droite, zone de tap suffisante (48px).

### 3.4 Page Boost Mandat (depuis le dashboard)

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  🚀 Booster un bien                             │
│                                                  │
│  Mets le paquet sur ton nouveau mandat.          │
│  Annonce storytelling + 3 posts + 1 Reel         │
│  + mini landing page + email blast.              │
│                                                  │
│  97€ par bien — livré en 48-72h.                │
│                                                  │
│  Quel bien veux-tu booster ?                     │
│  ┌──────────────────────────────────┐           │
│  │  Appart T3 — La Doutre      ●  │           │
│  │  Maison 5p — Saint-Serge    ○  │           │
│  │  Studio — Gare              ○  │           │
│  └──────────────────────────────────┘           │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │    Payer 97€ et booster ce bien      │       │
│  │           (bouton orange)            │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  Paiement sécurisé par Stripe 🔒               │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Liste des biens en portefeuille sous forme de radio buttons. Le bien ajouté le plus récemment est pré-sélectionné.
- Résumé clair de ce qui est inclus (pas de page de détail supplémentaire — tout est visible).
- CTA direct vers Stripe Checkout. Un clic, pas deux.
- Mention "sécurisé par Stripe" + icône cadenas pour la réassurance.
- Si la carte est déjà enregistrée (client existant), le checkout Stripe est rapide (1 clic).

---

## 4. Flow de paiement

**Provider** : Stripe Checkout (hosted — pas d'intégration custom)
**Objectif** : paiement en < 2 min, zéro friction, carte enregistrée pour les achats suivants

### 4.1 Transition Landing → Stripe Checkout

```
ÉTAPE 1 : Landing page               ÉTAPE 2 : Stripe Checkout
┌──────────────────────┐             ┌──────────────────────┐
│                      │             │                      │
│  Pack Mensuel        │   clic →    │  ┌────────────────┐ │
│  197€/mois           │             │  │  ImmoCrew      │ │
│                      │             │  │  Pack Mensuel   │ │
│  [Commencer]─────────┼─────────────│  │  197€/mois     │ │
│                      │             │  └────────────────┘ │
│  OU                  │             │                      │
│                      │             │  Email               │
│  Pack Lancement      │   clic →    │  ┌────────────────┐ │
│  + Mensuel           │             │  │                │ │
│  694€ puis 197€/mois │             │  └────────────────┘ │
│                      │             │                      │
│  [Commencer]─────────┼─────────────│  Carte bancaire     │
│                      │             │  ┌────────────────┐ │
│                      │             │  │ 4242 •••• ••••│ │
│                      │             │  └────────────────┘ │
│                      │             │                      │
│                      │             │  [Payer 197€] ──────│──→ Page
│                      │             │                      │    bienvenue
└──────────────────────┘             │  🔒 Stripe          │
                                     └──────────────────────┘
```

**Annotations UX :**
- Le CTA sur la landing page mène directement à Stripe Checkout (pas de page intermédiaire de récapitulatif côté ImmoCrew — Stripe gère le récap).
- La page Stripe est pré-personnalisée : logo ImmoCrew, nom du produit, prix affiché clairement.
- Le checkout combine email + carte bancaire. Pas d'inscription Clerk à ce stade (le compte est créé automatiquement via webhook).
- Apple Pay / Google Pay activés pour les paiements mobiles (1 tap).
- Pour le combo Pack Lancement + Mensuel : Stripe gère les 2 produits en un seul checkout (694 euros immédiat + abonnement 197 euros/mois).

### 4.2 Post-paiement

```
PAIEMENT RÉUSSI :

┌─────────────────────────────────────────────────┐
│                                                  │
│  ✓ Paiement confirmé !                          │
│                                                  │
│  Merci Sophie. Bienvenue dans l'équipe.          │
│                                                  │
│  Voici ce qui va se passer :                     │
│                                                  │
│  1️⃣  Tu vas recevoir un email                   │
│     (vérifie tes spams au cas où)                │
│                                                  │
│  2️⃣  Complète ton profil en 5 min               │
│     pour qu'on personnalise tout                 │
│                                                  │
│  3️⃣  Tes livrables arrivent                     │
│     dans 7 jours max                             │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │   Compléter mon profil maintenant │          │
│  │          (bouton orange)          │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  Ou attends l'email, il arrive dans 5 min.      │
│                                                  │
└─────────────────────────────────────────────────┘


PAIEMENT ÉCHOUÉ :

┌─────────────────────────────────────────────────┐
│                                                  │
│  ✕ Le paiement n'a pas fonctionné.              │
│                                                  │
│  Pas de panique, ça arrive.                      │
│  Ta carte n'a pas été débitée.                   │
│                                                  │
│  ┌───────────────────────────────────┐          │
│  │       Réessayer le paiement       │          │
│  │          (bouton orange)          │          │
│  └───────────────────────────────────┘          │
│                                                  │
│  Si le problème persiste :                       │
│  contact@immocrew.fr                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Annotations UX :**
- Page de succès : les 3 étapes suivantes sont numérotées et visuelles (1, 2, 3). Sophie sait exactement quoi faire.
- Le CTA "Compléter mon profil" redirige vers l'onboarding (Flow 2). Le magic link est envoyé en parallèle par email comme backup.
- Mention "vérifie tes spams" proactive — les emails de nouveaux domaines finissent souvent en spam.
- Page d'échec : message rassurant ("Pas de panique"), confirmation que rien n'a été débité, bouton de re-essai direct, email de contact visible.

---

## Principes UX transversaux — Récapitulatif

### Mobile-first : checklist de design

| Critère | Spécification |
|---------|--------------|
| Largeur minimum | 375px (iPhone SE) |
| Taille de tap minimum | 48px x 48px pour tous les boutons et liens |
| Taille de police minimum | 16px pour le corps de texte (évite le zoom auto iOS) |
| Espacement vertical | 16px minimum entre les éléments interactifs |
| Images | Compression auto, lazy loading, format WebP avec fallback |
| Formulaires | Labels au-dessus des champs (pas à côté), champs pleine largeur |
| Navigation | Bottom nav bar (4 items max) |
| CTA | Sticky en bas de l'écran quand pertinent (onboarding, landing page) |

### Accessibilité (niveau A minimum)

| Critère | Spécification |
|---------|--------------|
| Contraste | Ratio 4.5:1 minimum (texte), 3:1 (grands titres) |
| Focus visible | Outline visible sur tous les éléments focusables |
| Alt text | Sur toutes les images (mockups, logos, photos) |
| Labels | Chaque champ de formulaire a un label visible |
| Hiérarchie | Un seul H1 par page, structure H2-H6 cohérente |

### Performance (cibles)

| Métrique | Cible |
|----------|-------|
| LCP (Largest Contentful Paint) | < 2s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Time to Interactive | < 3s |

---

## Handoff

**Destinataire principal** : @design (design haute fidélité, design tokens, composants)
**Destinataires secondaires** : @fullstack (implémentation), @copywriter (microcopy final)

**Ce document fournit** :
- Les wireframes textuels de chaque écran avec layout et annotations UX
- Les spécifications responsive (mobile-first)
- Les interactions clés (copier-coller, magic link, progression, modales)
- Les principes transversaux (accessibilité, performance, mobile)

**Ce qu'il faut produire ensuite** :
- @design : maquettes Figma / haute fidélité avec la palette et la typo du brand-platform.md
- @fullstack : implémentation des composants et pages en Next.js
- @copywriter : rédaction du microcopy (textes de boutons, messages d'erreur, emails transactionnels, textes de la landing)

---

*Document produit par @ux dans le cadre du framework Gradient Agents.*
*Wireframes calibrés pour Sophie (38 ans, mandataire IAD, non technique, iPhone) conformément aux parcours définis dans docs/ux/user-flows.md.*