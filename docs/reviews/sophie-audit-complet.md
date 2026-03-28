# Audit terrain Sophie — ImmoCrew, 10 scénarios d'usage concrets
> Par @mandataire (Sophie) | 2026-03-28

---

## Avant de commencer

Je suis Sophie, mandataire IAD depuis 2 ans à Angers. J'ai accepté de tester ImmoCrew parce que 197€/mois — si ça me donne vraiment une vente de plus par an, ça vaut le coup. Mais je ne suis pas patiente. Si ça coince, je ferme l'onglet.

Je teste depuis mon ordinateur portable, table de la salle à manger, 21h30, après avoir couché les enfants. J'ai 45 minutes maximum.

---

## S1 — Je m'inscris
> Fichiers : sign-up/page.tsx + AuthModal.tsx

**Ce que je vois**

Une modale centrée sur la page. En haut : "ImmoCrew" en gras, en dessous : "Crée ton espace en 30 secondes". Quatre champs : Prénom, Nom, Adresse email, Mot de passe. Un bouton "Créer mon compte". En bas : un lien "Tu as déjà un compte ? Se connecter". Un X pour fermer.

**Ce que je comprends (ou pas)**

Limpide. Quatre champs, c'est gérable. "30 secondes" comme accroche — ça me parle, c'est honnête au vu du formulaire. Le placeholder "Sophie" dans le champ Prénom, c'est une belle attention. Le texte sous l'email : "Tu utiliseras cette adresse pour te connecter" — utile, j'en ai besoin.

La règle du mot de passe (8 caractères minimum) est visible dans le placeholder. Bien. Aucun jargon.

**Ce qui me bloque**

Rien. Le formulaire est propre. Les erreurs apparaissent si je soumets sans remplir. Le bouton se grise pendant la création — je sais que ça travaille.

**Ce qui me frustre**

Deux petites choses :
- Le mot de passe, je ne vois pas si je l'ai bien tapé (pas de bouton "afficher"). Sur mobile après une journée de visites et les yeux qui piquent, c'est une source d'erreur classique.
- Le "30 secondes" dans le sous-titre sonne un peu marketing. C'est vrai que ça prend 30 secondes — mais ensuite arrive l'onboarding de 9 étapes. Je me suis sentie un peu bernée la première fois.

**Note** : 8/10
**Verdict** : PASS

---

## S2 — Je fais l'onboarding
> Fichiers : onboarding/page.tsx

**Ce que je vois**

9 étapes (j'en compte 9 dans le code — pas 10). Une barre de progression en haut avec "Étape X sur 9 · ~8 min". Un titre d'étape (ex. "Ton identité") + parfois un sous-titre. Les champs varient selon l'étape. Un bouton "Suivant" à droite, "Précédent" à gauche. En haut à droite : "Continuer plus tard" — ce bouton sauve et renvoie au dashboard.

Les étapes obligatoires : identité (prénom, nom, téléphone, photo), réseau, zone, spécialité, style. Les étapes optionnelles (clairement marquées "Facultatif") : profil LinkedIn/bio, biens en cours, vidéo, comptes sociaux.

**Ce que je comprends (ou pas)**

L'indication "~8 min" est honnête et rassurante. Les questions sont bien écrites — "Comment tu parles à tes clients — donne un exemple de phrase que tu utilises souvent" : c'est concret, je sais quoi écrire. "Ce que tes clients disent de toi" : idem, c'est du terrain, pas du jargon.

Ce que je ne comprends pas tout de suite : à quoi servent mes réponses ? On me pose des questions sur mon ton de communication, mes valeurs, mais je ne sais pas encore ce que ça va produire. J'aurais besoin d'un encart "Ces infos servent à personnaliser tes posts, tes annonces et tes scripts."

**Ce qui me bloque**

Le champ "photo de profil" dans la première étape — c'est optionnel en réalité mais il est mis au même niveau que Prénom/Nom qui sont obligatoires. J'ai passé 2 minutes à chercher une photo avant de réaliser que je pouvais passer.

Lors de la soumission finale, il y a un message "C'est tout bon ! Ton équipe se met au travail. Tu recevras tes premiers livrables sous 24h." — très bien. Mais je ne sais pas exactement ce que je vais recevoir. 12 posts ? Des articles ? Une annonce ? Le détail du pack manque ici.

**Ce qui me frustre**

- L'étape "Tes biens en cours" (étape optionnelle) propose d'ajouter un bien avec 8 champs : titre, type, adresse, prix, surface, pièces, points forts, lien annonce. C'est beaucoup d'un coup. Et l'autocomplétion d'adresse — c'est une bonne idée mais si ça coince (réseau lent), l'utilisateur ne sait pas quoi faire.
- 9 étapes, c'est 9 écrans. Même si c'est fluide, à 21h30 après une journée de terrain, j'aurais besoin d'un indicateur plus encourageant du genre "Tu es à mi-chemin" ou "Plus que 2 étapes".
- Pas de récapitulatif avant envoi. Je soumets dans le vide — j'aurais aimé voir un résumé de ce que j'ai saisi avant de confirmer.

**Note** : 7/10
**Verdict** : FRICTION

---

## S3 — J'arrive sur mon dashboard
> Fichiers : dashboard/DashboardContent.tsx

**Ce que je vois**

Si mes contenus sont prêts :
1. Une bannière de bienvenue (s'affiche une seule fois) : "Clique sur une carte pour voir le contenu, puis Copier pour le coller dans ton appli. C'est tout." — avec un X pour fermer.
2. (Si profil incomplet) : bandeau orange "Ton profil est incomplet — reprends l'onboarding".
3. Ma carte profil : ma photo ou mes initiales, mon prénom + réseau + ville, mon pack en badge, des "pills" avec mes infos (années d'expérience, transactions/an, type de biens). Un lien "Modifier mes infos (par email — sous 4h)".
4. "Ton plan du mois" : 4 recommandations numérotées selon mes contenus disponibles (bio, posts, vidéos, annonces).
5. "Mes biens" (section MesBiensSection).
6. (Si pack Lancement) : un bandeau "Continue sur ta lancée — passe au mensuel" avec un bouton "S'abonner".
7. Navigation par onglets : Biens & annonces, Calendrier & posts, Articles, Scripts vidéo, Emails.
8. Les livrables classés par section.

Si aucun livrable encore : un état vide avec "Bienvenue dans ton espace ! Ton équipe est au travail. Tes premiers contenus arrivent sous 24h."

**Ce que je comprends (ou pas)**

"Ton plan du mois" avec les 4 étapes numérotées — c'est exactement ce dont j'ai besoin. Je ne cherche pas, je suis un plan. Le ton est direct, pas corporate.

La phrase "On te connaît : mandataire IAD à Angers, spécialisée maisons." — quand je lis mon nom et ma ville dans le dashboard, je sens que c'est fait pour moi, pas pour les 18 000 autres mandataires du réseau.

**Ce qui me bloque**

"Modifier mes infos (par email — sous 4h)" — c'est le seul point qui me fait tiquer. Pour modifier mon profil, je dois envoyer un email ? En 2026 ? Ça casse la fluidité. Je comprends que c'est probablement voulu (service personnalisé), mais ça sonne comme une limitation, pas comme un avantage. Si je me suis trompée sur ma zone ou mon réseau, je dois attendre 4h ?

**Ce qui me frustre**

- La navigation par onglets disparaît si je n'ai qu'un seul type de contenu (`navItems.length > 1`). C'est logique techniquement mais au démarrage, si je n'ai que des posts, je n't vois pas la nav et je peux me demander si mes articles sont cachés quelque part.
- Le plan du mois recommande "3 posts/semaine : lundi, mercredi, vendredi à 18h" — c'est bien, mais c'est la même recommandation pour tout le monde. C'est pas si personnalisé que ça.

**Note** : 8/10
**Verdict** : PASS

---

## S4 — Je copie un post pour Instagram
> Fichiers : DashboardContent.tsx + DeliverableCard.tsx

**Ce que je vois**

Chaque post est une carte avec : une icône plateforme, un badge de type coloré ("Post" en fond jaune/beige), un titre (ex. "Instagram — La Doutre : ce que les acheteurs ne voient pas"), et un bouton "Copier" en haut à droite de la carte. En bas : un lien "Voir le contenu" pour déplier.

Quand je clique "Copier" sans avoir ouvert le contenu : le bouton affiche un spinner "Chargement..." le temps de récupérer le texte, puis bascule sur "Copié — colle-le !" en vert. Quand je déplie la carte, un aperçu des premières lignes est visible.

Après avoir copié et déplié : un texte en bas de carte "Après avoir copié → ouvre ton appli et colle le texte". Et un lien "Signaler un souci" à droite.

**Ce que je comprends (ou pas)**

Le flux est clair : je vois la carte, je clique "Copier", je vais sur Instagram, je colle. C'est exactement comme copier un SMS. "Copié — colle-le !" comme confirmation — parfait, aucune ambiguïté.

Le badge coloré par type de livrable (jaune pour post, bleu pour article...) — je n'avais pas fait attention au sens des couleurs mais c'est visuellement lisible.

**Ce qui me bloque**

Rien de bloquant. Si la connexion coince et que le chargement échoue, une erreur "Oups, il y a eu un souci. Réessayer" s'affiche — c'est géré.

**Ce qui me frustre**

- Le texte est copié en texte brut (la fonction `stripMarkdown` enlève le formatage). Sur Instagram c'est parfait. Mais si le post contient des emojis ou des sauts de ligne importants, je ne sais pas comment ça se colle réellement jusqu'à ce que j'essaie. Un exemple de rendu serait rassurant.
- "Voir le contenu" comme libellé du lien d'expansion — c'est un peu générique. "Lire le post" ou "Prévisualiser" serait plus intuitif.
- Je n'ai pas de moyen de savoir combien de caractères fait le post avant de copier. Pour Instagram, c'est moins critique, mais pour un futur post LinkedIn, ça compte.

**Note** : 9/10
**Verdict** : PASS

---

## S5 — J'ajoute un bien
> Fichiers : MesBiensSection.tsx + dashboard/biens/nouveau/page.tsx + BienForm.tsx

**Ce que je vois**

Dans le dashboard, la section "Mes biens" affiche un état vide avec un bouton "Ajouter mon premier bien" ou, si j'en ai déjà, un bouton "+ Ajouter un bien" en haut à droite de la section.

En cliquant, j'arrive sur un formulaire avec :
- Type de bien (liste déroulante : Appartement, Maison, Studio, Terrain, Local commercial, Autre)
- Adresse complète (champ texte)
- Prix (champ numérique avec symbole € à droite) + Surface (m²) + Pièces — les trois en grille responsive
- Points forts (textarea, optionnel, avec exemple dans le placeholder)
- Description détaillée (textarea, optionnel)
- Bouton "Créer mon bien"

**Ce que je comprends (ou pas)**

Le formulaire est bien. Les champs obligatoires sont marqués d'un *, les optionnels sont clairement identifiés. Le formatage du prix en temps réel ("285 000 €" qui apparaît en petit sous le champ quand je tape) — c'est une belle attention.

Les placeholders sont concrets : "Parquet chêne, double exposition, cave, gardien, balcon 8m²..." — je sais exactement ce qu'on attend.

**Ce qui me bloque**

Un problème réel : l'adresse est un champ texte libre, sans autocomplétion dans ce formulaire (contrairement à l'onboarding qui a l'autocomplétion API gouvernement). Je dois taper l'adresse à la main, et si je fais une faute de frappe, mon annonce générée sera fausse. C'est une source d'erreur sur un champ qui va impacter la qualité de l'annonce IA.

Il n'y a pas d'indication de ce qui va se passer après. Je clique "Créer mon bien" — je sais que ça va créer une fiche, mais je ne sais pas que je vais atterrir sur une page photos+annonce. Un sous-texte "Étape 1/3 — on passera ensuite aux photos et à l'annonce" me rassurerait.

**Ce qui me frustre**

- Pas de champ "Réseau de diffusion" ou "Lien annonce existante" pour lier à mon annonce SeLoger ou LeBonCoin déjà en ligne. Dans la vraie vie, le bien est déjà sur les portails, j'aimerais juste pointer vers lui.
- Le titre du bien est généré automatiquement : "Appartement — 12 rue des Lilas, 69003 Lyon". C'est fonctionnel mais je n'ai pas la main dessus. Si j'ai plusieurs appartements rue des Lilas (ça arrive), je ne sais pas comment les distinguer visuellement.

**Note** : 7/10
**Verdict** : FRICTION

---

## S6 — J'uploade des photos
> Fichiers : dashboard/biens/[id]/page.tsx + PhotoUploader.tsx

**Ce que je vois**

Une zone rectangulaire en pointillés avec une icône de nuage flèche-vers-le-haut, le texte "Glisse tes photos ici ou clique pour sélectionner" en gras, et en sous-texte "JPG, PNG ou WebP — max 5 Mo par photo — 0/10 photos". La zone change de couleur (fond jaune clair, bordure colorée) quand je glisse des fichiers dessus.

Pendant l'upload : la photo apparaît en preview semi-transparente avec une barre de progression. En cas d'erreur : le message s'affiche par-dessus la preview avec un bouton "Fermer". Une fois uploadée : la photo est affichée en grille avec un badge numéro de position et une croix de suppression (visible au survol).

**Ce que je comprends (ou pas)**

Très bon. "Glisse tes photos ici ou clique pour sélectionner" — clair, sans ambiguïté. Le compteur "2/10 photos" en temps réel — je sais où j'en suis. La barre de progression — je vois que ça travaille.

Le bouton de suppression qui n'est visible qu'au survol (hover) — ça évite les suppressions accidentelles sur mobile, bonne décision.

**Ce qui me bloque**

Une chose : quand j'uploade depuis mon téléphone (je prends les photos sur place avec mon iPhone), les photos sont souvent en format HEIC. Le composant n'accepte que JPG, PNG, WebP. Le message d'erreur "Format non supporté. Utilise JPG, PNG ou WebP." est correct mais je vais me retrouver bloquée parce que mes photos iPhone sont en HEIC par défaut.

Concrètement : je prends 6 photos de l'appartement, je rentre chez moi, je glisse mes photos — erreur sur toutes. Je dois d'abord les convertir. C'est une vraie friction terrain.

**Ce qui me frustre**

- Le drag-and-drop, c'est super sur ordinateur. Sur téléphone c'est inutilisable — on clique. C'est géré (clic = ouvre le sélecteur), mais l'instruction "Glisse tes photos" est trompeuse sur mobile.
- La suppression d'une photo existante est "optimistic" (elle disparaît tout de suite à l'écran) mais si la suppression serveur échoue, elle revient. Ce comportement peut déstabiliser.
- Pas de moyen de réordonner les photos. Si je veux que la photo de la cuisine passe en couverture, je dois tout supprimer et ré-uploader dans le bon ordre.

**Note** : 7/10
**Verdict** : FRICTION

---

## S7 — Je génère une annonce
> Fichiers : AnnonceBlock.tsx

**Ce que je vois**

**Si je n'ai pas de photos** : bloc avec un bouton "Générer mon annonce" grisé et non-cliquable, texte "Ajoute au moins une photo pour générer ton annonce".

**Si j'ai des photos** : bouton "Générer mon annonce" actif. Je clique : skeleton de chargement avec "Rédaction en cours... (30 secondes)" — je vois que ça travaille et je sais combien de temps attendre.

**Une fois générée** : deux onglets — "Annonce longue" et "Annonce courte (portails)". L'annonce s'affiche dans une zone scrollable (max 400px). Bouton principal "Copier l'annonce", bouton secondaire "Voir ma page publique". En haut à droite : petit bouton "Régénérer" avec icône de rotation. Si je clique Régénérer : un bandeau orange de confirmation "Écraser l'annonce existante ? Cette action est irréversible. / Oui, régénérer / Annuler".

**Ce que je comprends (ou pas)**

Excellent parcours. La distinction "Annonce longue" / "Annonce courte (portails)" — je comprends immédiatement : longue pour mes affichages, courte pour SeLoger et LeBonCoin qui ont des limites de caractères. C'est du vocabulaire terrain.

"30 secondes" dans l'état de chargement — honnête, ça évite que je croie que c'est planté.

La confirmation avant de régénérer ("Cette action est irréversible") — bonne pratique. J'ai failli écraser une annonce par accident une fois.

**Ce qui me bloque**

Rien de bloquant. Le timeout de 35 secondes côté code — si la génération prend plus longtemps, j'ai un message d'erreur clair avec un bouton "Réessayer".

**Ce qui me frustre**

- Pas de compteur de caractères sur l'annonce courte. Les portails immobiliers ont souvent des limites précises (SeLoger : 1500 caractères, LeBonCoin moins). Si mon annonce courte dépasse, je vais devoir la couper manuellement.
- Impossible de modifier l'annonce directement dans le champ. C'est en lecture seule. Si un détail est faux (j'ai tapé 65m² au lieu de 68m²), je ne peux pas corriger sans régénérer entièrement.
- La zone de texte est scrollable mais je ne vois pas sa longueur totale au premier coup d'oeil. Un sous-texte "Environ 400 mots" me donnerait une idée.

**Note** : 8/10
**Verdict** : PASS

---

## S8 — Je partage le lien de mon bien
> Fichiers : BienFicheClient.tsx

**Ce que je vois**

En bas de la page de mon bien (après les photos et l'annonce) : une section "Page publique" avec un titre, un sous-texte "Partage ce lien avec tes acheteurs potentiels par SMS, email ou dans tes annonces.", deux boutons côte à côte : "Voir la page" (qui ouvre dans un nouvel onglet) et "Copier le lien" (qui change en "Lien copié !" en vert après le clic).

**Note** : cette section n'apparaît que si le bien a un `slug` (URL publique générée). Si le slug est absent — ce qui peut arriver juste après la création avant que le système génère l'URL — la section est invisible.

**Ce que je comprends (ou pas)**

"Partage ce lien avec tes acheteurs par SMS, email ou dans tes annonces" — parfait. C'est exactement comment je travaille. Je comprends l'usage immédiatement.

"Copier le lien" + feedback "Lien copié !" — cohérent avec le reste de l'application. Bonne cohérence de pattern.

**Ce qui me bloque**

Si le bien vient d'être créé et que le slug n'est pas encore généré, la section "Page publique" n'apparaît pas du tout. Il n'y a aucun message pour expliquer quand ce lien sera disponible. Je risque de chercher le bouton et de penser que la feature n'existe pas, ou que j'ai raté quelque chose.

**Ce qui me frustre**

- L'URL de partage (ex. `immocrew.fr/bien/appartement-angers-la-doutre-285000`) — je ne sais pas à quoi elle ressemble avant de cliquer "Voir la page". Un aperçu du lien serait utile pour valider qu'elle est propre et partageable.
- Je ne sais pas ce que mon acheteur voit quand il ouvre la page. Est-ce que mes photos sont là ? Mon annonce ? Mon téléphone ? Un petit aperçu ou une capture dans la section "Page publique" me rassurerait.
- Pas de bouton de partage direct vers WhatsApp ou SMS. Sur mobile, un bouton "Partager" natif (l'API Web Share) serait 10x plus rapide que copier + ouvrir WhatsApp + coller.

**Note** : 7/10
**Verdict** : FRICTION

---

## S9 — Je veux passer au pack mensuel
> Fichiers : DashboardContent.tsx

**Ce que je vois**
[À remplir]

**Ce que je comprends (ou pas)**
[À remplir]

**Ce qui me bloque**
[À remplir]

**Ce qui me frustre**
[À remplir]

**Note** : [X]/10
**Verdict** : [PASS / FAIL / FRICTION]

---

## S10 — Je reviens après 2 semaines
> Fichiers : sign-in + dashboard

**Ce que je vois**
[À remplir]

**Ce que je comprends (ou pas)**
[À remplir]

**Ce qui me bloque**
[À remplir]

**Ce qui me frustre**
[À remplir]

**Note** : [X]/10
**Verdict** : [PASS / FAIL / FRICTION]

---

## Score global

| Scénario | Note | Verdict |
|----------|------|---------|
| S1 — Inscription | [X]/10 | |
| S2 — Onboarding | [X]/10 | |
| S3 — Dashboard | [X]/10 | |
| S4 — Copier un post | [X]/10 | |
| S5 — Ajouter un bien | [X]/10 | |
| S6 — Uploader photos | [X]/10 | |
| S7 — Générer annonce | [X]/10 | |
| S8 — Partager lien bien | [X]/10 | |
| S9 — Passer au mensuel | [X]/10 | |
| S10 — Retour après 2 semaines | [X]/10 | |
| **MOYENNE** | **/10** | |

---

## Top 5 corrections urgentes

1. [À remplir]
2. [À remplir]
3. [À remplir]
4. [À remplir]
5. [À remplir]

---

## Ma réaction honnête globale

[À remplir]
