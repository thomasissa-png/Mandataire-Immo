## Revue métier — Parcours d'onboarding complet
> Par @mandataire (Sophie) | 2026-04-01

---

### Verdict global
**À RETRAVAILLER** — Le fond est bon, les données sont bien pensées. Mais il y a deux problèmes qui me feraient décrocher à 21h : l'étape 7 (les biens) est trop lourde pour être optionnelle, et je ne sais pas ce qui se passe après que j'ai cliqué "Terminer". Est-ce que quelqu'un a vraiment reçu mes infos ? Quand est-ce que j'ai mes contenus ?

---

### Ce qui me plaît

- **Inscription ultra-simple.** Prénom, nom, email, mot de passe. Moins de 60 secondes. Header et Footer présents, pas une page blanche. La promesse "Crée ton espace en 30 secondes" est tenue.
- **Le brouillon automatique.** C'est vraiment bien pensé. Je ferme à 21h parce que mon fils se réveille, je rouvre le lendemain matin — mes réponses sont là. Sauvegarde serveur + sessionStorage, double filet. J'aurais peur si ça n'existait pas.
- **Le bouton "Continuer plus tard"** dans le header de l'onboarding. Direct, visible, ça me rassure dès l'entrée.
- **Les questions sur le style (étape 5).** "Comment tu parles à tes clients — donne un exemple de phrase" — c'est la première fois que je vois un outil qui me demande vraiment ça. Je comprends pourquoi on me le demande.
- **Les étapes optionnelles sont signalées.** Le "(optionnel)" dans l'indicateur de progression, c'est bien.
- **La redirection vers l'onboarding après l'inscription** (callbackUrl dans le sign-up) — le parcours ne se casse pas.
- **Le tutoiement partout.** Naturel, cohérent, pas un seul "vous" qui traîne.

---

### Ce qui me gêne

**P0 — L'étape 7 (Tes biens en cours) : formulaire trop complexe pour une étape optionnelle**
Quand j'arrive sur cette étape, je vois un bloc avec 8 champs par bien : titre, type, adresse, prix, surface, pièces, points forts, lien annonce. Et je peux en ajouter 5. C'est le formulaire le plus lourd de tout le parcours, et c'est optionnel. À 21h après mes visites, je passe. Mais alors, qui va me faire mes annonces ? La logique est cassée : si je ne remplis rien, les contenus seront génériques. Il manque un message du genre "Pas de bien en ce moment ? On s'en occupe quand tu ajoutes ton premier mandat depuis le dashboard." La bonne nouvelle : le lien d'annonce (LeBonCoin, Bien'ici) en premier est une excellente idée — ça réduit l'effort si j'ai le lien sous la main.

**P0 — La durée annoncée est fausse.**
L'indicateur dit "~8 min". J'ai compté : 9 étapes, dont l'étape biens avec jusqu'à 5 x 8 champs, l'étape style avec 3 champs textarea, l'étape photo avec upload. En réalité c'est 12-15 min si je remplis sérieusement. À 21h, si on m'annonce 8 min et que j'en suis à 15, je ferme. Soit on annonce 15 min honnêtement, soit on coupe des champs.

**P1 — L'étape 1 (Ton identité) me redemande prénom et nom.**
Je viens de les renseigner à l'inscription. Le code dit qu'il pré-remplit depuis la session (`user.firstName`, `user.name`) — mais seulement si les champs sont vides au montage. Dans les faits, si le brouillon serveur est chargé en premier et qu'il contient les noms, c'est OK. Mais si le brouillon est vide (premier visit), l'effet dépend de la vitesse de chargement. Sur mobile lent, je pourrais voir les champs vides une seconde. Le feeling "on me redemande ce que j'ai déjà dit" existe, même si c'est technique.

**P1 — Après "Terminer" : message de fin trop vague.**
"Tu recevras tes premiers contenus sous 24h." C'est une bonne promesse, mais je ne sais pas ce que je vais recevoir exactement. 12 posts ? Des annonces ? Un email de confirmation ? Le dashboard s'appelle "Voir mon espace client" — est-ce que mes contenus seront là ou est-ce que je vais trouver une page vide ? Cette incertitude me stresse plus qu'elle ne me rassure.

**P1 — L'étape "Tes réseaux sociaux" (étape 9) vient APRÈS "La vidéo" (étape 8).**
Logiquement, si je donne mon Instagram, vous pouvez adapter les scripts vidéo en conséquence. L'ordre devrait être inversé : réseaux sociaux avant vidéo.

**P2 — Le Google Sign-Up redirige vers `/dashboard`, pas `/onboarding`.**
Le sign-up credentials redirige bien vers `/onboarding`. Mais le bouton "Continuer avec Google" a `callbackUrl: "/dashboard"` — je saute l'onboarding entier si je m'inscris via Google. Ce sont mes données manquantes, les contenus seront génériques.

**P2 — L'indicateur d'étape (step dots) ne distingue pas visuellement les optionnelles de manière évidente.**
Le code utilise une bordure en tirets pour les étapes optionnelles. Sur mobile avec des petits points de 6px de haut, c'est quasi invisible. Je ne saurais pas que les 4 dernières étapes sont optionnelles sans lire le texte.

---

### Ce qui me manque

- **Un aperçu de ce que je vais recevoir.** Avant de commencer l'onboarding, un mini-récap : "À la fin, tu recevras : 12 posts personnalisés, 4 articles SEO, 4 scripts vidéo, 1 newsletter." Ça me motive à remplir sérieusement.
- **Une explication courte au début de chaque étape** sur pourquoi on me pose ces questions. Exemple étape 3 (Ta zone) : "On écrit tes contenus en mentionnant tes quartiers, tes rues, tes écoles — c'est ce qui te différencie des autres mandataires." Aujourd'hui, il n'y a aucune explication pour les étapes obligatoires.
- **Un email de confirmation** après la soumission. Je ferme le navigateur, j'ai rien dans ma boîte mail, comment je sais que c'est bien parti ?

---

### Détail par étape

| Étape | Contenu | Clarté | Utilité | Faisabilité | Ton | Score | Problème |
|-------|---------|--------|---------|-------------|-----|-------|----------|
| Sign-up | Prénom, nom, email, mdp, CGV | Limpide | Nécessaire | Facile | Naturel | 8/10 | Google → dashboard (P2) |
| Sign-in | Email, mdp, reset dispo | Limpide | OK | Facile | Naturel | 9/10 | — |
| 1. Identité | Prénom, nom, tél, photo | Limpide | Utile | Facile | Naturel | 7/10 | Redondance prénom/nom (P1) |
| 2. Réseau | Réseau, expérience, transactions | Limpide | Très utile | Facile | Naturel | 9/10 | — |
| 3. Zone | Ville, quartiers, dpt | Limpide | Essentiel | Facile | Naturel | 9/10 | Pas d'explication "pourquoi" |
| 4. Spécialité | Types, gamme, cible | Limpide | Utile | Facile | Naturel | 8/10 | — |
| 5. Style | Ton, valeurs, différence | Bien | Excellent | Moyen (textarea) | Très bon | 8/10 | Effort élevé mais justifié |
| 6. Profil | LinkedIn, bio | Bien | Utile | Facile | Naturel | 8/10 | — |
| 7. Biens | Formulaire répétable | Confus | Utile si rempli | Difficile | OK | 5/10 | P0 — trop lourd |
| 8. Vidéo | Confort caméra | Limpide | Utile | Facile | Naturel | 8/10 | Ordre avec étape 9 (P1) |
| 9. Réseaux | Instagram, Facebook, site | Limpide | Utile | Facile | Naturel | 7/10 | Ordre inversé (P1) |
| Fin | Message de confirmation | Flou | Insuffisant | — | OK | 5/10 | P1 — trop vague |

---

### Ma réaction honnête

Je suis Sophie, il est 21h15, les gamins dorment enfin. J'ouvre ImmoCrew. L'inscription se fait en 40 secondes, bien. L'onboarding commence, je lis "~8 min", je me dis OK. Les 6 premières étapes, ça roule — les questions sont bonnes, je comprends pourquoi on me les pose même si personne ne me l'explique vraiment. Étape 7 : les biens. Je vois le formulaire, je vois qu'il y a 8 champs, je lis "optionnel". Je passe. Étapes 8 et 9 : rapides. Je clique "Terminer". Il est 21h28, j'ai mis 13 minutes. L'écran me dit "Tu recevras tes premiers contenus sous 24h." Bon. Mais quoi exactement ? Et dans ma boîte mail, rien. J'espère que ça a bien marché. Je ferme et je vais me coucher.

Le lendemain matin, si mes contenus sont dans le dashboard et qu'ils sont vraiment personnalisés pour Angers-Sud avec mes quartiers, je suis conquise. Mais ce soir, je ne suis pas sûre à 100% que ça a bien fonctionné, et ça, c'est un problème.

---

### Corrections prioritaires

1. **P0** — Étape 7 : soit simplifier drastiquement (un seul champ "lien d'annonce" + message "on complète au fil des mandats"), soit accompagner d'un message qui explique ce qui se passe si je passe l'étape.
2. **P0** — Durée : corriger "~8 min" → "~12 min" ou couper des champs pour tenir la promesse.
3. **P1** — Google Sign-Up : changer callbackUrl de `/dashboard` vers `/onboarding`.
4. **P1** — Fin de parcours : détailler ce que je vais recevoir + envoyer un email de confirmation.
5. **P1** — Inverser étapes 8 et 9 (réseaux sociaux avant vidéo).

---

**Handoff → @fullstack**
- Fichier produit : `docs/reviews/sophie-audit-onboarding-v2.md`
- Verdict : À RETRAVAILLER
- Les 2 points P0 et les 3 points P1 sont des corrections directement actionnables dans `src/app/onboarding/page.tsx` et `src/components/AuthModal.tsx`
- Quand corrigé : me soumettre à nouveau pour validation
