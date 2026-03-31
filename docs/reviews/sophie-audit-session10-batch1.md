## Revue métier — BATCH 1 (Landing, Blog, Annonce partagée, Landing mandataire)
> Par @mandataire (Sophie) | 2026-03-31

---

## Feature 1 — Landing page principale

**Score valeur perçue : 8/10**

**Ce qui marche**
- Le hero me parle direct : "Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva." — c'est exactement ma vie
- Le mockup hero avec le vrai quartier (La Doutre, Angers) et le prix au m² — concret, crédible, pas générique
- BeforeAfter : c'est la section la plus forte. Je lis l'avant, je reconnais mes annonces. Je lis l'après, je veux ça.
- Ancrage comparatif prix (freelance 500-800€ vs ImmoCrew 150€) — utile, je comprends la valeur en 5 secondes
- "Un seul mandat rembourse l'abonnement" — c'est exactement comme je raisonne

**Problèmes**

- **P0 — Témoignages inventés** : le commentaire dans le code est explicite ("projections pré-lancement"). Audrey M., Karim B., Stéphanie L. n'existent pas. Si je montre ça à une collègue et qu'elle cherche ces gens sur IAD ou Instagram, elle ne les trouve pas. Ça fait faux. C'est le problème le plus grave.
- **P1 — Pricing incohérent** : la page affiche 150€/mois Pack Mensuel partout dans le copy, mais project-context.md dit 197€/mois dans la promesse unique. Laquelle croire ? Si je m'abonne à 150€ et que la facture est différente, je suis en colère.
- **P1 — Aucune photo réelle du service** : le mockup hero est un bloc HTML codé à la main — ce n'est pas une vraie capture du dashboard. Quand je reçois mes contenus, à quoi ça ressemble vraiment ? Un PDF ? Un espace client ? Un email ? Je ne sais pas.
- **P2 — Section SocialProof titre trompeur** : "Ce que nos premiers utilisateurs en pensent" — mais il n'y a pas d'utilisateurs. Le titre implique qu'il y en a.

---

## Feature 2 — Blog

**Score valeur perçue : 7/10**

**Ce qui marche**
- Le titre de la page blog : "Le marketing immobilier, sans les prises de tête" — je comprends que c'est pour moi
- Filtre par catégorie — utile si j'arrive sur le blog et que je cherche quelque chose de précis
- Cards compactes avec thumbnail, lecture facile, temps de lecture affiché — je sais si j'ai 5 minutes ou 15 minutes

**Problèmes**

- **P0 — Contenu blog non visible dans le code** : `getAllArticles()` charge depuis `@/lib/blog` mais je n'ai pas accès aux articles eux-mêmes dans cet audit. Si le blog est vide ou avec 2-3 articles génériques, la promesse "Nouveaux guides chaque mois" sonne creux. Une section blog vide me fait fuir — ça donne l'impression que le service est à l'abandon.
- **P1 — CTA bas de blog trop générique** : "Tu veux que quelqu'un le fasse à ta place ?" — correct, mais la phrase d'accroche répète ce que la landing dit déjà. Rien de spécifique au fait que je viens de lire un article sur le SEO local ou les annonces.
- **P2 — Pas de newsletter** : le blog conseille de "poster régulièrement" à ses lecteurs mandataires, mais ImmoCrew ne capte pas les emails. Aucun formulaire d'inscription, aucun "reçois le prochain guide". Je lis, je pars, je ne reviens jamais.

---

## Feature 3 — Liens partageables annonces (/annonce/[token])

**Score valeur perçue : 8/10**

**Ce qui marche**
- Le rendu est propre : fond crème, typo lisible, header bleu primaire avec le titre de l'annonce
- L'annonce est rendue depuis le markdown — si le contenu est bien écrit (comme les exemples BeforeAfter), ça va avoir de la gueule
- robots: noindex — intelligent, une annonce partagée ne doit pas se retrouver en résultat Google orphelin
- Le footer "Annonce générée par ImmoCrew" avec lien vers le site — publicité passive bien intégrée, pas agressive

**Problèmes**

- **P1 — Pas de photo dans l'annonce partageable** : je partage un lien à un acheteur potentiel, il tombe sur du texte seul. Mes concurrents sur LeBonCoin ont 10 photos. Ici, rien. Le contenu peut être excellent, sans visuel c'est une page froide.
- **P1 — Pas d'infos pratiques visibles en haut** : prix, surface, nombre de pièces, ville — ces données sont dans le contenu markdown mais pas structurées dans un bloc "résumé". L'acheteur doit lire tout l'article pour trouver le prix. Sur mobile, c'est rédhibitoire.
- **P2 — Pas de bouton "Contacter le mandataire"** : je partage ce lien, l'acheteur est intéressé, il cherche comment me joindre. Il n'y a pas de bouton. Il doit me chercher lui-même. C'est une opportunité perdue à chaque partage.

---

## Feature 4 — Landing mandataire (/agent/[slug])

**Score valeur perçue : 7/10**

**Ce qui marche**
- La structure des sections est cohérente avec un vrai profil mandataire : Qui suis-je, Ma méthode, Ma zone, Mes biens, Témoignages, Contact
- Les fallbacks sont bien gérés : si pas de photo, initiales ; si pas d'étapes de méthode, des étapes génériques correctes
- Le header de contact en hero (bouton Appeler + bouton Me contacter) — c'est le bon emplacement, je contacte au premier écran
- SEO conditionnel selon `indexation` — je peux choisir si ma page apparaît dans Google

**Problèmes**

- **P0 — Méthode par défaut "vous" alors que tout le site est en "tu"** : les étapes DEFAULT_METHODE utilisent "votre bien", "votre accompagnement" — alors que la plateforme entière tutoie. Rupture de ton immédiate. Un client qui lit ma page va se demander pourquoi je change de registre.
- **P1 — Section "Mes biens" sans état vide visible** : si je n'ai aucun bien publié, la section disparaît ? Ou affiche un bloc vide ? Le code n'affiche pas de message "je n'ai pas de bien en ce moment, contactez-moi". C'est une occasion de mettre un CTA à la place.
- **P1 — Pas de date de dernière mise à jour** : ma page mandataire peut être figée depuis 6 mois. L'acheteur ne le sait pas mais Google le sait — une page non mise à jour perd en crédibilité SEO.
- **P2 — ReseauxSection non lue dans cet audit** : composant importé mais non consulté faute de place — à vérifier que les liens Instagram/Facebook s'ouvrent bien en nouvel onglet et ne redirigent pas vers immocrew.fr si les champs sont vides.

---

## Synthèse

| Feature | Score | Verdict |
|---------|-------|---------|
| Landing page | 8/10 | À RETRAVAILLER (P0 témoignages + P1 incohérence prix) |
| Blog | 7/10 | À RETRAVAILLER (P0 contenu vide à risque + P1 pas de capture email) |
| Annonce partageable | 8/10 | À RETRAVAILLER (P1 pas de photo, pas de résumé, pas de contact) |
| Landing mandataire | 7/10 | À RETRAVAILLER (P0 rupture tu/vous + P1 état vide biens) |

**P0 à traiter en priorité absolue avant tout lancement**
1. Supprimer ou remplacer les témoignages inventés — une citation "Résultats attendus après 30 jours" est plus honnête que trois faux prénoms
2. Corriger les étapes DEFAULT_METHODE de "votre" en "ton/ta/tes"
3. Vérifier et unifier le prix affiché : 150€ dans le code vs 197€ dans le brief — lequel est le vrai ?
