## Revue métier — Blog ImmoCrew (liste + article)
> Par @mandataire (Sophie) | 2026-04-01

### Verdict global
**FONCE — avec 2 corrections P1 à faire vite**

---

### Ce qui me plaît

- Le titre "Le marketing immobilier, sans les prises de tête" — c'est exactement ce que je cherche. Je comprends en 3 secondes que c'est fait pour moi.
- "Des conseils écrits pour les mandataires — pas pour les agences de com'" — ça, ça me parle. Quelqu'un a compris que je n'ai pas de budget com' et pas de temps.
- Les filtres par catégorie en pills : sur mon téléphone à 21h, je peux filtrer "SEO local" d'un tap. C'est rapide, ça marche, pas besoin de scroller toute la page.
- La durée de lecture affichée sur chaque carte — c'est le premier truc que je regarde. Si c'est "12 min de lecture", je reporte à demain. Si c'est "4 min", je le lis maintenant.
- La mise en page article : le titre, le résumé, puis le contenu. Pas de pub, pas de pop-up, pas de "rejoins ma newsletter" qui surgit au bout de 10 secondes. Juste le texte. Merci.
- Les articles similaires en bas — logique, utile. Je n'ai pas à retourner à la liste pour trouver quoi lire ensuite.
- Le CTA dans l'article ("Tu veux que ton marketing soit fait pour toi ?") — honnête, direct, pas agressif. Il arrive après le contenu, pas avant. C'est la bonne place.

---

### Ce qui me gêne

**P0 — Le CTA sur la page liste pointe vers le mauvais endroit**
"Découvrir les offres" envoie vers `/#pricing`. Mais moi je suis arrivée depuis LinkedIn, je ne connais pas encore ImmoCrew. Je clique, je tombe sur la landing page au milieu des tarifs, sans avoir vu ce que c'est. C'est trop brutal. Soit tu m'envoies vers une page d'accueil complète, soit tu mets un vrai CTA d'inscription. Là, c'est entre les deux et ça ne marche ni dans un sens ni dans l'autre.

**P1 — L'état "blog vide" sur mobile n'est pas assez utile**
Si je filtre sur une catégorie et qu'il n'y a rien, j'ai juste "Aucun article dans cette catégorie pour l'instant". OK mais : c'est quand les prochains ? Tu pourrais me proposer de revenir, ou me suggérer une catégorie voisine. Un état vide propre, ça finit le travail.

**P1 — Les boutons de partage social (LinkedIn, Facebook, Twitter)**
Je ne vais pas partager un article que je viens de lire sur un blog que je ne connais pas encore. Ces boutons en bas de l'article prennent de la place pour une action que je ne ferai jamais à ce stade. Par contre, si l'article est bon, ce que je veux c'est m'inscrire — et ce CTA arrive APRÈS les boutons de partage. L'ordre est à revoir : CTA d'abord, partage ensuite (ou partage supprimé).

**P2 — La thumbnail "photo de ville" sur les cards**
Une photo de ville générique en 100x100px à gauche de la card, ça apporte quoi ? C'est trop petit pour être beau, trop générique pour être informatif. L'icône catégorie (l'alternative quand il n'y a pas de photo de ville) est plus lisible et plus cohérente. Je préfèrerais des icônes catégorie partout plutôt qu'une photo de ville minuscule.

---

### Ce qui me manque

- Un indicateur "article lu" — si je parcours la liste et que j'ai déjà lu 3 articles, comment je sais lesquels ? Même un simple point sur la card aiderait.
- Sur la page article, le lien "retour au blog" ou un breadcrumb visible au-dessus du titre — le fil d'Ariane en caption gris est là mais il disparaît sur mobile. Je me retrouve à devoir scroller tout en haut pour retrouver la liste.

---

### Détail par section

| Section | Clarté | Utilité terrain | Faisabilité | Ton | Verdict |
|---------|--------|-----------------|-------------|-----|---------|
| Hero page blog | Limpide | Ça m'aide vraiment | — | On se comprend | Solide |
| Filtres catégorie | Limpide | Ça m'aide vraiment | Facile à intégrer | — | Bien |
| Cards articles | Limpide | Bof (thumbnail petite) | — | — | À affiner |
| CTA page liste | Flou | Bof | — | Un peu forcé | À retravailler (P0) |
| En-tête article | Limpide | Ça m'aide vraiment | — | On se comprend | Solide |
| CTA article | Limpide | Ça m'aide vraiment | — | On se comprend | Bien |
| Partage social | Limpide | Ça ne sert à rien (pour l'instant) | — | — | Ordre à inverser (P1) |
| Articles similaires | Limpide | Ça m'aide vraiment | — | — | Solide |

---

### Ma réaction honnête

Je tombe sur ce blog à 21h depuis mon canapé, les enfants viennent de s'endormir. Le titre me parle, je scrolle les cards, les filtres fonctionnent, je clique sur un article — et là, c'est bien. C'est lisible sur mon téléphone, le texte n'est pas trop petit, et il y a une vraie conclusion qui m'explique quoi faire lundi matin. C'est la première fois que je lis un truc sur le "SEO local pour mandataires" sans avoir l'impression qu'on m'explique ce que c'est comme si j'avais 15 ans.

Le seul moment où je décroche : le CTA en bas de la page liste. "Découvrir les offres" qui m'envoie au milieu des tarifs, alors que je ne sais pas encore ce qu'ImmoCrew fait exactement — c'est trop tôt. Donne-moi une raison de vouloir payer avant de me montrer le prix.

Globalement, ce blog me donne envie de faire confiance à ImmoCrew. C'est rare. La plupart des blogs "conseils immobilier" ont l'air écrits par des gens qui n'ont jamais fait de visite de leur vie. Celui-là, non.

**Score : 7,5/10**

---

**Handoff → @fullstack**
- Fichier produit : `/docs/reviews/sophie-audit-blog.md`
- Corrections P0 : CTA `/#pricing` → revoir la destination ou reformuler l'accroche pour que l'arrivée soit cohérente avec le contexte "première visite depuis LinkedIn"
- Corrections P1 : (1) état vide de catégorie — ajouter suggestion de catégorie voisine ou lien "voir tous les articles" ; (2) inverser l'ordre CTA / boutons de partage sur la page article
- Corrections P2 : uniformiser les thumbnails vers icône catégorie plutôt que photo de ville 100x100px
- Si verdict = FONCE : le blog peut rester en l'état pour un lancement, les P1/P2 sont des améliorations itératives
