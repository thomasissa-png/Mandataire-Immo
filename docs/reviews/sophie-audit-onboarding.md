# Revue métier — Onboarding ImmoCrew (10 étapes)
> Par @mandataire (Sophie) | 2026-03-28

---

## Verdict global

**À RETRAVAILLER** — Score 7,8/10. 3 FRICTION, 1 FAIL (scénario S5). Les étapes obligatoires sont globalement solides — le fond est bon, le ton est juste. Deux points bloquants avant prod : la fausse promesse du lien d'annonce à l'étape 7 et l'absence de confirmation que les biens créés apparaissent dans le dashboard.

---

## Étape 1 — Ton identité (prenom, nom, telephone, photo_profil)

**Ce qui est demandé** : prénom, nom, téléphone, photo de profil.

**Verdict : PASS**
**Note : 8/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Limpide — c'est les infos de base, pas de surprise |
| Utilité | Je comprends pourquoi : c'est mon identité dans les contenus |
| Faisabilité | Immédiat, j'ai tout en tête |
| Longueur | 2 minutes max |
| Ton | Naturel |
| Optionnel | N/A — obligatoire, et c'est logique |

**Commentaire Sophie :** Le prénom/nom sont pré-remplis depuis mon inscription — ça, c'est bien pensé, je n'ai pas à tout retaper. La photo, c'est marqué "optionnel" dans le helper mais ce champ est quand même sur la page obligatoire (étape 1, pas de subtitle "facultatif"). Un peu ambigu. Et l'alerte si je dépasse 5 Mo n'est pas très douce — un `alert()` navigateur, c'est moche.

**Point de friction mineur** : la validation bloque si je ne mets pas mon téléphone. Je peux comprendre pourquoi ImmoCrew en a besoin, mais nulle part on m'explique à quoi il va servir. Je me méfie — est-ce qu'on va me rappeler pour vendre ? Une ligne de contexte ("Pour qu'on puisse te contacter si besoin de précisions sur tes contenus") suffirait à lever le doute.

---

## Étape 2 — Ton réseau (reseau, experience_annees, nb_transactions_an)

**Ce qui est demandé** : nom du réseau (texte libre), années d'expérience, nombre de transactions par an.

**Verdict : FRICTION**
**Note : 6/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | OK pour le réseau et l'expérience. Le "nb de transactions/an" mérite un mot d'explication |
| Utilité | Pas expliquée — pourquoi vous avez besoin de savoir que je fais 5 ventes/an ? |
| Faisabilité | Facile à remplir |
| Longueur | Rapide |
| Ton | Naturel |
| Optionnel | N/A — obligatoire |

**Commentaire Sophie :** Le champ réseau en texte libre, c'est bien — je tape "IAD" et c'est plié. Mais "nb_transactions_an" sans contexte, ça m'interroge. Est-ce que si je mets 4, vous allez me juger moins sérieuse ? Est-ce que ça change les contenus ? Dites-moi à quoi ça sert — genre "On adapte la fréquence des posts selon ton activité" — et je remplis sans hésiter. Là, j'ai l'impression de remplir un questionnaire RH.

**Autre friction** : le champ "réseau" est en texte libre. C'est souple mais si je tape "iad" en minuscules ou "IAD France" au lieu de "IAD", est-ce que ça pose un problème pour la génération de contenus ? Un select avec les principaux réseaux (IAD, SAFTI, Capifrance, Orpi, indépendant, autre) serait plus fiable et plus rapide à remplir.

---

## Étape 3 — Ta zone (ville, quartiers, departement)

**Ce qui est demandé** : ville principale, quartiers où je travaille (textarea), département.

**Verdict : PASS**
**Note : 9/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Très clair — c'est exactement comme ça que je pense à mon activité |
| Utilité | Évidente : c'est ce qui personnalise les contenus ("le quartier La Doutre", "Angers-Sud") |
| Faisabilité | Immédiat — je connais ma zone par coeur |
| Longueur | 2 minutes |
| Ton | Bien — "Ta zone", ça sonne naturel |
| Optionnel | N/A — obligatoire et ça se justifie |

**Commentaire Sophie :** C'est l'étape qui me donne le plus confiance dans l'outil. "Ta zone" — c'est exactement comme ça qu'on parle entre mandataires. Le textarea pour les quartiers, c'est bien : je peux mettre "La Doutre, Centre-ville, Justices, Monplaisir" et vous savez où je travaille vraiment. Le département en texte libre, c'est correct même si un sélecteur serait plus propre.

**Seule réserve** : le placeholder pour les quartiers dit "La Doutre, Centre-ville, Doutre..." — "Doutre" et "La Doutre" sont répétés. Ça fait désordre sur un détail qui montre qu'on a pensé à Angers. A corriger.

---

## Étape 4 — Ta spécialité (type_biens, gamme_prix, cible_clients)

**Ce qui est demandé** : types de biens, gamme de prix, clients types — tous en texte libre.

**Verdict : PASS**
**Note : 8/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Clair — je sais quoi mettre |
| Utilité | Logique — ça sert à cibler les annonces et les posts |
| Faisabilité | Facile |
| Longueur | Rapide |
| Ton | OK |
| Optionnel | N/A — obligatoire |

**Commentaire Sophie :** Pas grand chose à dire, c'est propre. Les placeholders sont bien choisis et concrets ("100K - 300K EUR", "Primo-accédants, familles, investisseurs"). Je remplis sans réfléchir.

**Une friction potentielle** : "gamme_prix" en texte libre, ça peut donner n'importe quoi — "entre 100 et 300k", "100K-300K EUR", "de 100 000 à 300 000€". Est-ce que la génération de contenu sait lire tous ces formats ? Si l'IA sort ensuite "entre 100K-300K EUR€" dans un post parce qu'elle a mal parsé mon entrée, ça va me faire mal. Deux champs numériques (min/max) avec "€" affiché seraient plus solides.

---

## Étape 5 — Ton style (ton_communication, valeurs, ce_qui_te_differencie)

**Ce qui est demandé** : comment je parle à mes clients (exemple concret), mes 3 valeurs, ce qui me différencie des autres mandataires.

**Verdict : PASS**
**Note : 9/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Excellente — les labels sont des vraies questions, pas des champs abstraits |
| Utilité | C'est là que le contenu devient MIEN, pas générique. C'est le coeur de la promesse |
| Faisabilité | Ça demande un peu de réflexion — 5-7 minutes pour cette étape |
| Longueur | Raisonnable, mais c'est la plus dense des étapes obligatoires |
| Ton | C'est la meilleure étape côté ton — "Ce que tes clients disent de toi que les autres mandataires n'ont pas" — c'est une vraie question, ça me touche |
| Optionnel | N/A — obligatoire |

**Commentaire Sophie :** C'est la première fois que je vois un outil me demander ça. "Donne un exemple de phrase que tu utilises souvent" — ça, ça m'oblige à me mettre en mode terrain, pas en mode CV. Le placeholder pour `ton_communication` est parfait : "Je suis directe mais bienveillante. Quand un bien ne correspond pas, je le dis." — ça me ressemble et ça me donne l'envie d'écrire quelque chose de vrai.

**Seul bémol** : cette étape est la plus chronophage des obligatoires. Si je suis à 21h30 et que j'ai les yeux qui piquent, les trois textareas d'affilée, ça peut me décourager. Est-ce qu'on ne pourrait pas diviser en deux ? "Ton style" d'un côté, "Ce qui te différencie" de l'autre ? Ou au minimum donner une indication de temps : "~5 minutes pour cette étape, la plus importante".

---

## Étape 6 — Ton profil (linkedin_url, bio_personnelle) — OPTIONNEL

**Ce qui est demandé** : URL LinkedIn (optionnel), bio personnelle libre (optionnel avec note "si LinkedIn renseigné, on peut laisser vide").

**Verdict : PASS**
**Note : 9/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Très claire — les helpers expliquent le "pourquoi" de chaque champ |
| Utilité | Le lien LinkedIn pour enrichir la bio — logique |
| Faisabilité | Optionnel bien annoncé, je peux passer |
| Longueur | Rapide si LinkedIn renseigné, 5 min si bio manuelle |
| Ton | Le mieux de tout l'onboarding — "Mon meilleur souvenir : une famille qui a trouvé son bonheur en 3 visites" — je me reconnais |
| Optionnel | Bien marqué dans le titre ET dans le helper de `bio_personnelle` |

**Commentaire Sophie :** Le subtitle "Facultatif — mais ça rend tes contenus beaucoup plus personnels" — c'est exactement le bon angle. Tu ne me forces pas, tu m'expliques le bénéfice. Et le helper de `bio_personnelle` ("Si tu as renseigné ton LinkedIn, tu peux laisser ce champ vide — on s'en inspire") est la première fois de tout l'onboarding qu'on m'explique concrètement comment les données sont utilisées. Pourquoi ne pas faire ça sur toutes les étapes ?

**Un doute technique** : "on s'inspire de ton LinkedIn" — comment ? Est-ce qu'ImmoCrew fait une requête sur mon profil LinkedIn automatiquement ? Est-ce que LinkedIn le permet sans OAuth ? Je ne sais pas. Si ça ne marche pas vraiment, autant ne pas le promettre — ça pourrait me décevoir si mes contenus ne reflètent pas mon parcours.

---

## Étape 7 — Tes biens en cours (__biens__) — OPTIONNEL
[À REMPLIR]

## Étape 7 — Tes biens en cours (__biens__) — OPTIONNEL

**Ce qui est demandé** : pour chaque bien — lien d'annonce (mis en avant), titre, type, adresse (avec autocomplétion), prix, surface, pièces, points forts. Jusqu'à 5 biens.

**Verdict : FRICTION**
**Note : 6/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Chaque champ est clair, mais l'ensemble fait beaucoup |
| Utilité | Je comprends — mes biens servent à personnaliser les annonces et les posts. Mais pas dit explicitement |
| Faisabilité | Le lien d'annonce en premier, c'est une bonne idée — mais est-ce qu'il est vraiment utilisé automatiquement ? |
| Longueur | Le problème : 1 bien = 8 champs. 3 biens = 24 champs. C'est long |
| Ton | OK |
| Optionnel | Bien marqué — subtitle "tu pourras les ajouter plus tard" rassure |

**Commentaire Sophie — Scénario S4 :** Est-ce que les biens que je saisis ici vont apparaître dans "Mes biens" du dashboard après validation ? C'est la question critique. Le code envoie les biens via `POST /api/onboarding` dans le champ `biens` (JSON stringifié) — si cette API crée bien des property_pages liées à mon compte, alors oui. Mais rien dans l'interface ne me le confirme. Si je prends le temps de remplir 3 biens ici et qu'ils n'apparaissent pas dans mon espace, je vais croire que j'ai perdu mon temps.

**Commentaire Sophie — Scénario S5 :** Le lien d'annonce est mis en avant avec une belle encadré coloré et le texte "Colle le lien SeLoger, LeBonCoin, ou ton site — on récupère tout automatiquement." Bonne promesse. Mais est-ce que ça marche vraiment ? Si je colle mon lien SeLoger et que je dois quand même remplir les 7 champs manuels dessous, c'est une fausse promesse et ça va me mettre en rogne. Si l'import auto est réel, il faut que les champs se remplissent automatiquement après avoir collé l'URL — là ça deviendrait l'étape la plus fluide de tout l'onboarding. Pour l'instant, rien dans le code ne fait ce pré-remplissage : l'`onChange` du champ `lien_annonce` appelle juste `updateBien(index, "lien_annonce", e.target.value)`, pas de fetch. La promesse n'est pas tenue.

**Autre friction** : pourquoi demander un "Titre du bien" si on a déjà le lien d'annonce ? Le titre est sur SeLoger. Double saisie.

---

## Étape 8 — La vidéo (confort_camera) — OPTIONNEL

**Ce qui est demandé** : un seul champ select — niveau de confort devant la caméra (débutant / quelques vidéos / à l'aise).

**Verdict : PASS**
**Note : 10/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Ultra-clair — une seule question, trois choix |
| Utilité | Compris immédiatement : les scripts vidéo seront adaptés à mon niveau |
| Faisabilité | 10 secondes |
| Longueur | Parfait |
| Ton | "Je n'ai jamais fait de vidéo — ça me stresse" — MERCI. Quelqu'un a compris qu'on est nombreux dans ce cas |
| Optionnel | Bien marqué |

**Commentaire Sophie :** Cette étape, c'est celle que j'aurais envie de montrer à mes collègues mandataires pour dire "vous voyez, ils ont compris." Le libellé "ça me stresse" sur l'option débutant — c'est honnête et ça me fait me sentir normale, pas nulle. Je clique en 5 secondes. Modèle pour les autres étapes optionnelles.

---

## Étape 9 — Tes comptes (instagram, facebook, site_web) — OPTIONNEL
[À REMPLIR]

## Étape 9 — Tes comptes (instagram, facebook, site_web) — OPTIONNEL

**Ce qui est demandé** : pseudo Instagram, URL page Facebook, URL site web.

**Verdict : FRICTION**
**Note : 5/10**

| Critère | Évaluation |
|---------|-----------|
| Clarté | Les champs sont clairs |
| Utilité | PAS EXPLIQUÉE DU TOUT — c'est le problème principal |
| Faisabilité | Facile à remplir si on sait pourquoi |
| Longueur | Rapide |
| Ton | Neutre — ni bon ni mauvais |
| Optionnel | Bien marqué — subtitle "on peut travailler sans" |

**Commentaire Sophie :** Je remplis mon pseudo Instagram... et then what ? Est-ce qu'ImmoCrew va publier directement sur mon compte ? Non, ce n'est pas prévu dans la promesse ("tu publies, on fait le reste"). Est-ce que c'est pour formater les posts avec mon @ ? Peut-être. Est-ce pour des stats ? Je sais pas. Nulle part on m'explique à quoi ça sert.

Et surtout — il y a une incohérence : à l'étape 6, il y a déjà un champ `linkedin_url`. Là à l'étape 9, il y a `instagram`, `facebook`, `site_web`. Mais dans le code il y a aussi un champ `linkedin` (sans `_url`) dans `FIELD_LABELS` — mais il n'est pas dans le tableau `STEPS`. C'est quoi le LinkedIn de l'étape 9 ? Il existe dans le code mais n'est jamais affiché. Doublon avec l'étape 6 ? Données perdues ?

Le subtitle "Optionnel — on peut travailler sans" est honnête mais pas motivant. Pourquoi remplir si ça ne change rien ? Un peu de bénéfice concret : "Si tu nous donnes ton Instagram, on formate chaque post avec ton @ et les bons hashtags pour ta ville." — là je remplis.

---

## Scénarios transversaux

### S1 — Premier accès (21h30, excitée mais pressée)

**Durée estimée** : entre 15 et 25 minutes pour les 9 étapes, selon le soin apporté à l'étape 5 (Ton style) et l'étape 7 (Tes biens).

**Verdict : FRICTION**

L'indicateur de temps "~8 min" est affiché sur chaque étape — mais c'est le temps global annoncé, pas par étape. Est-ce que ça veut dire 8 minutes EN TOUT ? Ou 8 minutes par étape ? Dans le code, c'est affiché à chaque étape dans le compteur : `~8 min`. Si c'est le total global, c'est bien mais légèrement optimiste pour quelqu'un qui remplit soigneusement l'étape 5. Si c'est par étape, c'est inquiétant — je ne veux pas passer 80 minutes à remplir un formulaire.

La bonne nouvelle : le bouton "Continuer plus tard" est visible en haut à droite sur toutes les étapes. Si à 22h mes yeux piquent, je peux m'arrêter. Le brouillon est sauvegardé (sessionStorage + serveur). Ça, c'est crucial et bien fait.

### S2 — Abandon à l'étape 5 et retour le lendemain

**Verdict : PASS**

Le code sauvegarde dans `sessionStorage` à chaque changement ET envoie un fire-and-forget au `PATCH /api/onboarding/draft` à chaque étape validée. Au chargement, le brouillon serveur a la priorité sur le sessionStorage (bon choix — si je change de navigateur ou d'appareil, mes données sont là). La restauration de l'étape courante fonctionne : `setCurrentStep(draft.step)` si `draft.step > 0`. Mes réponses sont là, je repars de là où j'étais.

**Une limite** : la photo n'est pas persistée en sessionStorage (trop lourde) ni dans le brouillon serveur (elle est uploadée seulement au submit final). Si je ferme et reviens, je dois re-uploader ma photo. Ce n'est pas bloquant mais c'est à signaler à l'utilisateur : "Ta photo ne sera pas sauvegardée dans le brouillon — tu pourras l'ajouter au moment de valider."

### S3 — Repérer les étapes optionnelles

**Verdict : PASS (avec réserve)**

Les étapes optionnelles (6, 7, 8, 9) ont deux signaux visuels :
1. Le subtitle sous le titre ("Facultatif — mais ça rend tes contenus beaucoup plus personnels")
2. Le texte "(optionnel)" dans le compteur en haut à droite ("Étape 6 sur 9 (optionnel)")
3. Le bouton "Passer" discret à gauche du bouton "Suivant"

C'est bien pensé. Le bouton "Passer" en texte souligné discret — c'est le bon choix : visible si on cherche, pas stressant si on veut remplir.

**La réserve** : l'étape 7 (biens) a un seul bien vide affiché par défaut. Si je clique "Passer" sans avoir rien rempli, est-ce qu'un bien vide est quand même envoyé ? Dans le code, le submit filtre : `biens.filter((b) => b.titre.trim() !== "" || b.lien_annonce.trim() !== "")` — donc les biens vides sont exclus. Bien. Mais le filtre ne vérifie que `titre` ou `lien_annonce` — si j'ai rempli uniquement la surface sans titre ni lien, ce bien est exclu silencieusement. Comportement cohérent mais pas communiqué.

### S4 — Les biens créés dans l'onboarding apparaissent-ils dans le dashboard ?

**Verdict : À VÉRIFIER — risque FAIL**

Côté frontend, les biens sont envoyés en JSON stringifié dans le champ `biens` du POST `/api/onboarding`. Est-ce que cette API crée des `property_pages` liées au compte ? Je ne peux pas le vérifier sans lire `/api/onboarding/route.ts`. Si la réponse est non — si les biens restent juste dans le `client_context` mais n'apparaissent pas dans "Mes biens" — c'est une rupture critique dans l'expérience. Je prends le temps de tout remplir dans l'onboarding et rien n'apparaît dans mon espace. Mauvais départ.

**Recommandation** : ajouter un message de confirmation sur l'écran final : "Tes 2 biens ont été ajoutés à ton espace. Tu les retrouves dans 'Mes biens'."

### S5 — Le lien d'annonce pré-remplit-il les champs ?

**Verdict : FAIL — promesse non tenue**

Le message affiché : "Colle le lien SeLoger, LeBonCoin, ou ton site — on récupère tout automatiquement."

Dans le code, le champ `lien_annonce` fait uniquement `updateBien(index, "lien_annonce", e.target.value)` — pas de fetch, pas de scraping, pas de pré-remplissage des autres champs. La promesse "on récupère tout automatiquement" n'est pas implémentée. Si je colle mon URL SeLoger et que je dois quand même remplir les 7 champs à la main, je vais me sentir trompée. C'est le point le plus critique de tout l'onboarding.

Soit la promesse est tenue (fetch vers une API de scraping/parsing d'annonce au blur ou au clic d'un bouton "Importer"), soit le texte doit être corrigé : "Colle ton lien d'annonce — on l'utilisera pour enrichir tes contenus."

---

## Tableau récapitulatif

| Étape | Titre | Obligatoire | Verdict | Note |
|-------|-------|------------|---------|------|
| 1 | Ton identité | Oui | PASS | 8/10 |
| 2 | Ton réseau | Oui | FRICTION | 6/10 |
| 3 | Ta zone | Oui | PASS | 9/10 |
| 4 | Ta spécialité | Oui | PASS | 8/10 |
| 5 | Ton style | Oui | PASS | 9/10 |
| 6 | Ton profil | Non | PASS | 9/10 |
| 7 | Tes biens | Non | FRICTION | 6/10 |
| 8 | La vidéo | Non | PASS | 10/10 |
| 9 | Tes comptes | Non | FRICTION | 5/10 |

**Score global : 7,8/10**

---

## Verdict global

**À RETRAVAILLER** — 3 points bloquants, le reste est solide.

### Ce qui me plaît (ce que je garderais tel quel)

- Le titre "~8 min" et le bouton "Continuer plus tard" — je sais que c'est faisable et que je peux m'arrêter
- L'étape 3 (Ta zone) et l'étape 5 (Ton style) — les questions sonnent comme une conversation terrain, pas un formulaire corporate
- L'étape 8 (La vidéo) — une seule question, ton parfait, "ça me stresse" sur l'option débutant : chapeau
- Le brouillon serveur + sessionStorage — si je ferme à l'étape 5, je retrouve tout le lendemain
- Le pré-remplissage prénom/nom depuis l'inscription — évident mais souvent oublié
- Les étapes optionnelles bien signalées (subtitle + compteur + bouton Passer)
- L'autocomplétion d'adresse sur les biens — c'est un vrai confort de terrain

### Ce qui me gêne (ce que je changerais)

1. **Étape 7, lien d'annonce** : "on récupère tout automatiquement" est une promesse non tenue. Soit on la tient (scraping réel), soit on la supprime. C'est le point le plus urgent — une fausse promesse en onboarding, c'est une relation qui commence mal.

2. **Étape 9 (Tes comptes)** : zéro explication de pourquoi vous avez besoin de mes réseaux. Ajoutez une ligne de bénéfice concret par champ.

3. **Étape 2, champ réseau** : texte libre alors qu'il y a 5-6 réseaux qui couvrent 90% des mandataires. Un select avec "Autre" en option serait plus fiable pour la génération de contenu.

4. **Étape 1, champ téléphone** : pas d'explication de l'usage. Ajoutez un helper : "Pour vous contacter si besoin de précisions — jamais utilisé à des fins commerciales."

5. **Étape 7 — confirmation dans le dashboard** : ajouter sur l'écran final le récapitulatif des biens créés, avec un lien vers "Mes biens".

6. **Étape 5 — densité** : trois textareas en une étape pour la partie obligatoire la plus réflexive. Envisager de couper en deux sous-étapes ou d'ajouter "~5 minutes, c'est l'étape clé".

7. **Bug placeholder étape 3** : "La Doutre, Centre-ville, Doutre..." — "Doutre" est répété. Corriger.

### Ce qui me manque (ce dont j'aurais besoin en plus)

- Une phrase d'introduction AVANT de commencer les étapes : "En 9 étapes, on apprend à te connaître pour que tes posts, tes annonces et tes scripts soient vraiment toi — pas un template." Ça donne le sens avant de remplir le premier champ.
- Sur les étapes obligatoires, un helper court sur chaque champ expliquant comment cette donnée sera utilisée — comme c'est fait sur `linkedin_url` et `bio_personnelle` à l'étape 6. C'est le meilleur pattern du formulaire, à généraliser.
- Un écran de confirmation final plus riche : récap des biens créés, aperçu du premier livrable attendu, date de livraison estimée. "Tu recevras tes premiers contenus sous 24h" c'est bien — mais un "Voici ce que tu vas recevoir : 12 posts, 2 articles, 4 annonces" serait encore mieux.

### Ma réaction honnête

Bon début. Les étapes 3, 5 et 8 m'ont vraiment surprise — ça ne ressemble pas aux formulaires habituels. "Ce que tes clients disent de toi que les autres mandataires n'ont pas" — cette question m'a fait sourire parce qu'elle m'oblige à réfléchir à ce qui me rend unique, pas à cocher des cases.

Mais je serais en rogne si je colle mon lien SeLoger et que les champs restent vides. Cette promesse non tenue à l'étape 7 est le seul truc qui pourrait me faire douter de la crédibilité de l'outil dès les premières minutes. Corrigez ça en priorité absolue.

Et honnêtement — 9 étapes c'est beaucoup. Si j'arrive à 21h30 après une journée de 3 visites et 2 rendez-vous estimation, il y a une chance sur deux que je clique "Continuer plus tard" à l'étape 5. Ce n'est pas un échec — c'est la réalité du terrain. L'outil gère bien ce cas avec le brouillon. Mais si vous voulez maximiser le taux de complétion en une session, les étapes 1 à 5 (les obligatoires) doivent tenir en moins de 12 minutes chrono — ce qui est faisable avec quelques ajustements sur la densité de l'étape 5.

---

## Handoff

**Fichier produit** : `/docs/reviews/sophie-audit-onboarding.md`

**Actions prioritaires pour @fullstack :**

1. **P0 — Étape 7, fausse promesse lien d'annonce** : soit implémenter un fetch réel vers une API de parsing d'annonce (scraping SeLoger/LeBonCoin ou appel API), soit changer le texte en "Colle ton lien — on l'utilisera pour enrichir tes contenus" (sans promettre un import automatique).

2. **P0 — Vérifier que POST /api/onboarding crée des property_pages** : les biens saisis en onboarding doivent apparaître dans "Mes biens" du dashboard. Ajouter un message de confirmation sur l'écran final avec le décompte des biens créés.

3. **P1 — Étape 2, champ réseau** : passer en select (IAD, SAFTI, Capifrance, Orpi, Keller Williams, indépendant, autre) avec texte libre si "autre" sélectionné.

4. **P1 — Étape 9, helpers manquants** : ajouter une ligne d'explication concrète sur chaque champ réseaux sociaux.

5. **P2 — Étape 1, helper téléphone** : ajouter "Pour te contacter si besoin — jamais de prospection commerciale."

6. **P2 — Bug placeholder étape 3** : corriger "La Doutre, Centre-ville, Doutre..." → "La Doutre, Centre-ville, Justices..."

7. **P2 — Étape 5, indication de temps** : ajouter un texte d'intro "C'est l'étape la plus importante — prévois 5 minutes."

8. **P2 — Photo non persistée dans le brouillon** : ajouter un helper sur le champ photo : "La photo n'est pas sauvegardée dans le brouillon — tu pourras l'ajouter quand tu valides."

**Verdict** : À RETRAVAILLER (points P0 à corriger avant mise en production)

