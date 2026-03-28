## Revue métier — Audit Sophie 4 scénarios clés
> Par @mandataire (Sophie) | 2026-03-28

---

## S1 — Mon dashboard (DashboardContent.tsx)

### Ce qui me plaît
La sidebar desktop existe bien (ligne 262) — elle colle, elle a mes sections, je peux naviguer sans scroller dans tous les sens. L'état vide est honnête : "Ton équipe est au travail. Tes premiers contenus arrivent sous 24h." C'est la promesse, elle est là, noir sur blanc.

### Ce qui me gêne
Le "plan du mois" n'existe pas. Ce que j'ai, c'est une liste de livrables groupés par type — posts, articles, annonces — mais aucun encadré qui me dit "ce mois-ci, voilà ce qui est prévu pour toi". Pas de conseil du type "publie ce post lundi, cet article mercredi". C'est moi qui dois déduire quoi faire avec quoi. Si je suis crevée à 21h, je ferme l'onglet.

Les doublons : le composant `DashboardNav` (mobile) et la sidebar desktop (ligne 262) affichent les mêmes sections. C'est pas vraiment un doublon problème — c'est un responsive — mais la sidebar desktop n'apparaît que si des livrables existent, alors que les biens et annonces sont toujours là. Légère incohérence dans les `navItems` : "Mon profil" n'apparaît que si `strategie.length > 0`.

### Note : 6/10
### Verdict : FRICTION

---

## S2 — Mon profil (ProfileForm.tsx)

### Ce qui me plaît
Les 6 sections sont claires et bien nommées : Ton identité, Ta zone, Ton métier, Ton style, Tes réseaux sociaux, Ta bio. Je comprends tout de suite ce que chaque section attend de moi — pas de jargon. Les spécialités en pills avec des options pré-définies (Résidentiel, Luxe, Investissement locatif...) c'est bien : je clique, je n'écris pas. Le dirty tracking est implémenté (lignes 198-202) — si je modifie quelque chose et que je n'enregistre pas, ça détecte que la section a changé. Bien.

### Ce qui me gêne
Le champ "Ce que tes clients disent de toi" (clé `ce_qui_te_differencie`) a un label trompeur — le placeholder dit "Ex : Je connais chaque rue de La Doutre" mais le label dit "Ce que tes clients disent de toi". Ce sont deux choses différentes. Moi ce que MES clients disent de moi, je sais pas trop — mais ce que JE fais différemment, je peux le dire. Confusion garantie.

### Note : 8/10
### Verdict : PASS

---

## S3 — Ajout bien (BienForm.tsx + MesBiensSection.tsx)

### Ce qui me plaît
Le lien annonce est EN PREMIER, dans un encadré avec une bordure orange (border-warning-300 ligne 149). La phrase en dessous est parfaite : "On récupère les infos automatiquement — tu n'auras presque rien à remplir." C'est exactement ce que je veux entendre. L'état vide de MesBiensSection mentionne bien les annonces : "Tu peux aussi coller le lien d'une annonce existante (SeLoger, LeBonCoin) pour qu'on récupère les infos."

### Ce qui me gêne
Dans l'état vide, quand j'ai déjà des annonces générées par l'équipe, le message dit : "Tu as déjà X annonces générées par ton équipe. Ajoute tes biens pour recevoir des annonces avec TES photos." C'est bien mais les annonces générées s'affichent EN BAS de la page d'état vide, après le bouton CTA — risque que je les ratte si j'arrive sur mobile. L'ordre logique serait : "Voilà tes annonces déjà prêtes → maintenant ajoute tes biens pour les personnaliser encore plus".

### Note : 7/10
### Verdict : PASS (avec friction sur l'ordre de lecture mobile)

---

## S4 — Photos + annonce (PhotoUploader.tsx + AnnonceBlock.tsx)

### Ce qui me plaît
HEIC est accepté (ligne 24 de PhotoUploader.tsx : `"image/heic", "image/heif"`) — c'est le format iPhone par défaut, si ça n'était pas là j'aurais des erreurs à chaque fois. Les 2 onglets existent bien dans AnnonceBlock.tsx (type `TabId = "longue" | "courte"`, ligne 21). Le copier a un fallback textarea (lignes 94-101) pour les navigateurs qui bloquent le clipboard — ça c'est sérieux, ça marche même sur des téléphones vieux.

### Ce qui me gêne
La progression d'upload est simulée (`progress: 30` puis `progress: 80` manuellement — lignes 78 et 89 de PhotoUploader.tsx). Ce n'est pas une vraie barre de progression. Sur une photo de 4 Mo en 3G, je vais voir la barre sauter de 0 à 30% puis rester bloquée, ce qui me donne l'impression que ça plante. Rien n'indique non plus la limite de 5 Mo dans l'interface avant que j'essaie d'envoyer une photo — je dois me la prendre dans la gueule comme erreur.

### Note : 7/10
### Verdict : PASS (avec friction sur la fausse progression)

---

## Score global

| Scénario | Note | Verdict |
|----------|------|---------|
| S1 — Dashboard | 6/10 | FRICTION |
| S2 — Profil | 8/10 | PASS |
| S3 — Ajout bien | 7/10 | PASS |
| S4 — Photos + annonce | 7/10 | PASS |
| **Moyenne** | **7/10** | — |

### Verdict global : GO CONDITIONNEL

Trois scénarios sur quatre passent. Le dashboard est le point faible : il n'a pas de "plan du mois" — c'est juste une liste de livrables sans guide d'action. Pour une Sophie crevée à 21h, c'est insuffisant.

**Ce qui doit être corrigé avant GO complet :**
1. Dashboard — ajouter un bloc "Ce mois-ci" avec les contenus du mois en cours, dans l'ordre de publication suggéré. Pas une todo-liste — une phrase par livrable : "Publie ce post lundi, cet article jeudi."
2. BienForm/PhotoUploader — afficher la limite 5 Mo dans le helper texte du champ photos AVANT que l'erreur apparaisse.
3. ProfileForm — aligner le label "Ce que tes clients disent de toi" avec ce qu'on attend vraiment (différenciation, pas témoignage). Suggestion : "Ta différence" ou "Ce qui te rend unique".

**Ce qui est bien :** le lien SeLoger en premier avec encadré orange, le HEIC accepté, le dirty tracking sur le profil, les 2 onglets annonce. Ce sont des détails qui montrent que quelqu'un a pensé à la vraie vie terrain.

---

### Ma réaction honnête

Si j'arrive sur ce dashboard le premier soir après mon inscription, je vais me retrouver face à une liste groupée de trucs qui s'appellent "Post", "Article local", "Annonce"... et je vais pas savoir par quoi commencer. C'est le problème numéro un. La promesse d'ImmoCrew c'est "tu publies, on fait le reste" — mais là, "publier quoi en premier" c'est encore moi qui décide. Ce manque de guidage me ferait peut-être décrocher dès la première semaine.

Le reste — le profil, l'ajout de bien, les photos — c'est propre et ça tient la route pour une V1. Rien qui me ferait fuir, quelques frictions mais rien de bloquant.

---

**Handoff → @fullstack**
- Correction prioritaire S1 : ajouter un bloc "Plan du mois" dans DashboardContent.tsx — liste ordonnée des contenus du mois en cours avec suggestion de publication (quel contenu publier en premier, deuxième, etc.)
- Correction secondaire S4 : PhotoUploader.tsx — afficher "5 Mo max par photo" dans le texte helper du champ avant que l'erreur apparaisse
- Correction cosmétique S2 : ProfileForm.tsx — renommer le label `ce_qui_te_differencie` (actuellement "Ce que tes clients disent de toi") en "Ce qui te rend unique" et aligner le placeholder avec ce titre
- Si S1 corrigé → resoumettre S1 uniquement pour validation finale
- Fichiers concernés : `src/components/dashboard/DashboardContent.tsx`, `src/components/biens/PhotoUploader.tsx`, `src/components/dashboard/ProfileForm.tsx`
