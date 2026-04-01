## Revue métier — Audit UX Dashboard complet
> Par @mandataire (Sophie) | 2026-04-01

### Verdict global
**À RETRAVAILLER** — Le dashboard est globalement solide et utilisable sur mobile. Mais il y a 4 problèmes qui m'empêchent de dire "fonce" : le parrainage est trop en bas, je ne sais pas clairement où publier mes articles, la page Bios manque le bouton "Regénérer" directement visible, et les annonces demandent trop de clics avant d'accéder aux portails.

---

### Parcours 1 — Connexion → Dashboard principal

**Score : 7/10**

Ce qui marche : la carte profil en haut, le plan du mois avec les liens directs vers chaque section — c'est clair, je comprends en 5 secondes ce que je dois faire. Le conseil "Le matin sur LinkedIn, le soir sur Instagram" — ça, c'est concret, c'est exactement ce que je voulais savoir.

Ce qui me gêne :

- **P1 — Parrainage enterré.** Le bloc parrainage apparaît APRÈS le plan du mois et AVANT mes biens. Sur mobile je dois scroller pas mal pour le trouver. Si je reçois un email "tes contenus sont prêts", j'ouvre le dashboard, je vais droit au plan du mois — je ne verrai jamais le parrainage. Il devrait être dans la sidebar ou dans un petit bandeau en haut.
- **P2 — Le plan du mois ne me dit pas QUAND publier.** On me dit "publie tes 12 posts", mais il n'y a pas de lien direct vers le calendrier depuis ce bloc (juste un lien en dessous). Le lien "Voir mon calendrier éditorial" est bien, mais il est visuellement noyé après les 5 blocs de contenu.
- **P2 — Les recommandations de lecture.** Deux articles du blog ImmoCrew dans le plan du mois — c'est une bonne idée, mais ça me sort du dashboard vers des pages externes. Si je clique par erreur, je perds le fil. Je préfèrerais que ces liens s'ouvrent dans un nouvel onglet (ce qui est le cas, vu le `target="_blank"` — OK c'est bien).

| Section | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Carte profil | Limpide | Utile | Facile | Naturel | OK |
| Plan du mois | Limpide | Très utile | Facile | Naturel | OK |
| Parrainage | Flou (trop bas) | Utile | Facile | Naturel | Repositionner |
| Bannière monthly update | Limpide | Utile | Facile | Naturel | OK |

---

### Parcours 2 — Mes posts → Copier un post Instagram

**Score : 8/10**

Ce qui marche : le filtre par plateforme (Instagram / LinkedIn / Facebook) est bien conçu — les boutons ont une taille correcte pour le mobile. Le conseil sous chaque post ("Publie entre 18h et 20h · Format carré ou 4:5") — c'est exactement ce qu'il me faut.

Ce qui me gêne :

- **P1 — Je dois cliquer sur le titre pour voir le contenu.** Le bouton "Copier" dans `DeliverableCard` — je ne sais pas à quoi il ressemble sans l'avoir vu. Si je dois chercher où cliquer pour ouvrir le post, c'est une friction. Le titre est cliquable, mais ce n'est pas évident sur mobile.
- **P2 — "Photo recommandée" vs "Visuel généré".** Quand il y a un `brief_visuel` sans `visual_key`, je vois "Photo recommandée : [description textuelle]". C'est utile, mais la distinction entre "description à réaliser moi-même" et "visuel téléchargeable" n'est pas flagrante au premier coup d'oeil.
- **P2 — L'heure de publication est dans le `tip` sous le post** — bien. Mais si je filtre sur Instagram et que j'ai 8 posts, le conseil se répète 8 fois. Ce serait plus propre d'avoir le conseil UNE FOIS en haut de la liste filtrée.

| Section | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Filtre plateforme | Limpide | Très utile | Facile | Naturel | OK |
| Conseil publication | Limpide | Très utile | Facile | Naturel | Dédupliquer |
| Brief visuel | Flou | Utile | Facile | Naturel | Clarifier |

---

### Parcours 3 — Calendrier éditorial → Planning du mois

**Score : 7/10**

Ce qui marche : la vue mensuelle avec les dots colorés sur mobile est lisible. La légende en bas est claire. La navigation entre mois fonctionne. Le modal "bottom sheet" sur mobile — bonne idée.

Ce qui me gêne :

- **P1 — Je clique sur un jour, le modal s'ouvre — mais je ne peux copier qu'APRÈS avoir développé chaque contenu.** Le bouton "Copier le texte" n'est visible qu'après un clic sur le titre du contenu dans le modal. Sur mobile à 21h, je veux copier en 2 taps maximum, pas 4.
- **P2 — Le modal montre "réseau + heure" mais pas le lien direct vers la page dédiée** (ex: "Voir mes posts"). Si je suis dans le calendrier et que je veux copier plusieurs posts d'un coup, je dois aller dans le modal → développer → copier → fermer → recommencer. Il manque un raccourci "Voir tous les posts du jour" ou mieux, la copie directe depuis le modal sans devoir développer.
- **P2 — Mars et avril sont-ils visibles ?** Le calendrier se base sur le mois courant (avril 2026 vu la date du jour). Les contenus du mois précédent sont accessibles via la navigation ← . C'est correct mais pas évident pour une nouvelle utilisatrice.

---

### Parcours 4 — Scripts vidéo → Préparer un Reel

**Score : 9/10**

C'est le parcours le mieux fichu du dashboard. Le bloc conseil en haut ("Smartphone en mode portrait, lumière naturelle face à toi, pas de montage nécessaire") — c'est EXACTEMENT ce dont j'avais besoin. Le "pas de montage nécessaire" m'enlève une peur réelle.

Sous chaque script : l'accroche, le lieu de tournage, la durée estimée. Parfait. Je sais QUOI dire, OÙ me placer, COMBIEN DE TEMPS tenir.

Ce qui me gêne :

- **P2 — Le `CONFORT_TIPS` (débutant / à l'aise / expert) n'est jamais affiché.** Le code définit ces conseils mais il n'y a aucun appel à cette logique dans le rendu. Je ne vois jamais "Tu n'as pas besoin de te filmer ! Les diaporamas marchent très bien." — pourtant c'est exactement ce que j'aurais besoin d'entendre. Soit c'est un bug, soit c'est une feature non connectée.

---

### Parcours 5 — Articles SEO → Lire et partager

**Score : 7/10**

Ce qui marche : le lien "Lire l'article en pleine page" depuis la liste — il reste DANS le dashboard (route `/dashboard/articles/[id]`). Le bouton "Copier" en haut à droite de la page article est visible. L'article est lisible avec le rendu markdown.

Ce qui me gêne :

- **P1 — Je ne sais pas où publier mes articles.** Le conseil dans la liste dit "Publiés automatiquement sur ta page mandataire". Mais on me dit aussi "Partage le lien sur LinkedIn". Concrètement : est-ce que je dois AUSSI les copier-coller quelque part, ou juste partager le lien ? C'est flou. Une phrase simple manque : "Tes articles sont en ligne sur ta page mandataire. Copie le lien de l'article et partage-le sur LinkedIn — c'est tout."
- **P2 — Sur la page article, pas de lien direct vers ma page mandataire** pour voir l'article tel que mes prospects le voient. Il y a un retour "← Articles" mais pas de lien "Voir l'article en public".

---

### Parcours 6 — Mes bios → Regénérer

**Score : 6/10**

C'est le parcours qui me déçoit le plus.

Ce qui marche : les 3 sections (Bio / Positionnement / Landing page) sont bien séparées. Le texte d'intro explique copier et regénérer.

Ce qui me gêne :

- **P0 — Le bouton "Regénérer" n'existe pas dans `StrategieContent.tsx`.** J'ai cherché dans le code — il n'y a aucun formulaire de commentaire, aucun bouton regénérer. La page affiche les livrables via `DeliverableCard` standard, et c'est tout. Soit la feature est dans `DeliverableCard` (possible que je n'aie pas vu), soit elle n'est pas encore implémentée. L'intro dit pourtant "clique sur un contenu, puis sur 'Regénérer' en bas" — si ce bouton n'existe pas, c'est une promesse non tenue.
- **P1 — Le contenu des bios n'est pas visible directement.** Je dois cliquer sur la carte pour ouvrir et lire ma bio. Sur mobile, l'aperçu tronqué me donnerait de l'assurance avant d'aller plus loin.

---

### Parcours 7 — Mes annonces → Exporter pour LeBonCoin

**Score : 8/10**

Ce qui marche vraiment bien : le modal portail avec titre + description séparés, chaque champ copiable individuellement, le compteur de caractères SeLoger ("1240/1500 car.") — c'est pro, c'est utile. Le bouton "Copier titre + description" en bas du modal — parfait.

Ce qui me gêne :

- **P1 — Il faut 3 clics pour arriver au modal portail.** Titre → ouvre le contenu / clic sur "Voir" → contenu expanded / bouton portail → modal. Sur mobile à 21h je veux taper "LeBonCoin" et copier. Le bouton portail devrait être visible DIRECTEMENT dans le header de l'annonce, pas uniquement après expansion.
- **P2 — Le bouton "Partager" crée un lien public.** C'est bien, mais je ne comprends pas pour qui c'est ce lien. "Partager à qui ?" — à un acheteur ? à mon notaire ? Un label clair ("Envoyer à un acheteur") éviterait la confusion.

---

### Parcours 8 — Ma page mandataire → Vérifier ma vitrine

**Score : 8/10**

Ce qui marche : le lien de ma page est affiché clairement, le bouton "Copier le lien" est immédiatement visible. L'explication de l'indexation Google ("Active cette option pour que ta page apparaisse dans Google quand quelqu'un cherche ton nom + ta ville") — c'est limpide, pas de jargon.

Ce qui me gêne :

- **P2 — La bio en aperçu est tronquée à 3 lignes.** Je vois juste le début. Le bouton "Voir ma page" ouvre dans le MÊME onglet (pas de `target="_blank"`). Je devrais pouvoir voir ma page publique sans quitter le dashboard.
- **P2 — Le lien "Modifier mon profil" apparaît 2 fois** dans la même vue (une fois dans le bloc info, une fois dans le bloc "Envie de modifier ?"). Doublon inutile.

---

### Parcours 9 — Mes biens → Ajouter un bien avec photos

**Score : 7/10**

Ce qui marche : la page liste "Mes biens" est propre. L'état vide avec le bouton "Ajouter un bien" est bien conçu. Le formulaire de création est dans un `BienForm` — je ne vois pas le contenu exact, mais la page a un layout correct.

Ce qui me gêne :

- **P1 — Je ne vois pas le formulaire `BienForm` dans le code fourni.** Je ne sais pas si les photos sont dans le formulaire de création ou seulement après. Si les photos ne sont pas dans le formulaire initial, c'est un problème : "Renseigne les infos de ton bien. Tu pourras ajouter les photos... juste après." — ça veut dire que je dois faire 2 étapes séparées. Pour quelqu'un qui rentre d'une visite avec les photos sur son téléphone, c'est frustrant.
- **P2 — Après création d'un bien, rien n'indique clairement que je serai redirigée vers la fiche.** Le retour "← Tableau de bord" (visible uniquement sur mobile) me renverrait vers le dashboard, pas vers ma fiche bien. La destination post-création doit être claire.

---

### Parcours 10 — Navigation globale

**Score : 7/10**

Ce qui marche : la sidebar desktop est propre, bien organisée en 2 sections ("Mon compte" / "Mes contenus"). Le menu mobile bottom nav a les 4 liens les plus importants.

Ce qui me gêne :

- **P1 — La bottom nav mobile a DEUX icônes "🏡"** — une pour "Annonces" et une pour "Biens". C'est exactement le même emoji. Sur mobile, je ne distingue pas les deux en un coup d'oeil. Changer l'icône de "Biens" en "🏘️" ou "📐" résoudrait ça en 2 secondes.
- **P1 — "Mes annonces" n'est pas dans la bottom nav mais "Biens" y est.** Pour moi, les annonces = usage quotidien (je dois les copier-coller sur LeBonCoin). Les biens = moins fréquent (j'ajoute un bien 1-2 fois par mois). L'ordre devrait être inversé ou les deux devraient y être.
- **P2 — Les liens blog (recommandations du mois) ouvrent dans un nouvel onglet** (`target="_blank"`) — c'est correct.
- **P2 — Pas de "Scripts vidéo" dans la bottom nav.** Ce serait utile d'y avoir accès direct quand je suis sur le terrain et que je veux relire mon script avant de filmer.

---

### Récapitulatif des problèmes par priorité

**P0 (bloquant)**
- Bouton "Regénérer" annoncé dans la bio mais absent du code visible — soit c'est dans `DeliverableCard` et je ne l'ai pas vu, soit c'est non implémenté (parcours 6)

**P1 (important — corriger avant lancement)**
- Parrainage trop bas dans le dashboard, invisible au premier scroll (parcours 1)
- Copier depuis le calendrier demande trop de taps (parcours 3)
- Boutons portail annonce invisibles sans expansion (parcours 7)
- Deux icônes 🏡 identiques dans la bottom nav mobile (parcours 10)
- "Annonces" absente de la bottom nav alors que "Biens" y est (parcours 10)
- `CONFORT_TIPS` scripté mais jamais affiché (parcours 4)

**P2 (amélioration)**
- Conseil publication répété 8 fois sur la page posts filtrée
- Manque d'explication sur la publication des articles (copier/lien ?)
- "Modifier mon profil" apparaît 2 fois dans Ma page mandataire
- "Voir ma page" devrait ouvrir dans un nouvel onglet
- Destination post-création d'un bien pas explicite

---

### Score global par parcours

| Parcours | Score | Statut |
|----------|-------|--------|
| 1 - Dashboard | 7/10 | Parrainage à repositionner |
| 2 - Posts | 8/10 | Dédupliquer le conseil |
| 3 - Calendrier | 7/10 | Copie en moins de taps |
| 4 - Scripts | 9/10 | CONFORT_TIPS à connecter |
| 5 - Articles | 7/10 | Clarifier la publication |
| 6 - Bios | 6/10 | Regénérer manquant (P0) |
| 7 - Annonces | 8/10 | Portail accessible direct |
| 8 - Ma page | 8/10 | Ouvrir dans nouvel onglet |
| 9 - Mes biens | 7/10 | Photos dans formulaire initial |
| 10 - Navigation | 7/10 | Bottom nav à corriger |

**Score moyen : 7,4/10**

---

### Ma réaction honnête

C'est 21h, je suis sur mon canapé, les gamins dorment. Je reçois l'email "tes contenus sont prêts". J'ouvre le dashboard sur mon téléphone.

La première impression est bonne — je vois mon nom, mon pack, le plan du mois. Je comprends quoi faire. Le fait d'avoir "LinkedIn 7h-9h / Instagram 18h-20h" écrit noir sur blanc, c'est la première fois qu'un outil me le dit clairement au lieu de me laisser chercher.

Mais quand je vais dans Mes bios pour regénérer ma bio Instagram (j'avais laissé un commentaire la semaine dernière), je ne trouve pas le bouton. L'intro dit "clique sur 'Regénérer' en bas" — je cherche, je cherche, rien. Là je commence à douter. Est-ce que ça a marché ma demande ? Est-ce que j'ai raté quelque chose ?

Sur les annonces, la logique est bonne mais je dois faire trop de clics avant d'arriver au modal LeBonCoin. Quand j'ai 3 annonces à mettre en ligne, je veux aller vite.

La navigation mobile avec deux icônes maison identiques — ça fait amateur. C'est un petit détail mais c'est le genre de chose que je remarquerais si je montrais ça à une collègue mandataire.

La partie scripts vidéo est vraiment bien faite — "pas de montage nécessaire", "lumière naturelle face à toi" — ça m'enlève mes peurs. C'est le parcours que je montrerais en premier à quelqu'un pour lui montrer que l'outil comprend notre métier.

Dans l'ensemble : l'outil est utilisable et utile. Mais les P0/P1 doivent être corrigés pour que je le recommande à une collègue sans hésitation.

---

**Handoff → @fullstack**
- Fichier produit : `/docs/reviews/sophie-ux-dashboard-complet.md`
- Verdict : **À RETRAVAILLER**
- Actions prioritaires :
  1. Vérifier si le bouton "Regénérer" existe dans `DeliverableCard` — si non, l'implémenter (P0)
  2. Corriger les icônes dupliquées dans la bottom nav mobile (P1 — 2 min)
  3. Remonter le parrainage ou le rendre accessible depuis la sidebar (P1)
  4. Ajouter "Annonces" à la bottom nav à la place ou en plus de "Biens" (P1)
  5. Connecter `CONFORT_TIPS` au rendu des scripts (P1)
  6. Rendre les boutons portail visibles sans expansion dans AnnonceRow (P1)
- Si verdict FONCE après corrections P0/P1 : le dashboard peut passer en production
