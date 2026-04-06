## Revue métier — Page Support + SupportSection + Sidebar
> Par @mandataire (Sophie) | 2026-04-02

### Verdict global
**FONCE** — avec 2 P1 à corriger en parallèle

### Score /10 : 8/10

---

### Ce qui me plaît

- Le formulaire est simple : je choisis un type, j'écris, j'envoie. Rien de superflu.
- Les 4 types de feedback sont clairs — "Problème ou bug" et "Suggestion d'amélioration", je comprends tout de suite où cliquer.
- Le message de confirmation "On te répond sous 24h" est rassurant. C'est concret, ça m'engage sur un délai.
- Le fallback email en bas (contact@immocrew.fr) est bien visible — si le formulaire plante, je ne suis pas bloquée.
- Le bouton "Envoyer" est orange avec text-white : conforme, bien visible.
- L'état disabled du bouton quand le champ est vide : bien géré, ça évite les envois vides.
- Focus-visible sur le textarea et les boutons : correct.

---

### Ce qui me gêne

**P0 — Aucun**

**P1 — Support absent de la nav desktop principale**
Le lien Support est séparé du reste par un `<hr>` en bas de la sidebar. Il n'est pas dans NAV_SECTIONS. Sur mobile, il est dans le menu "Plus" qu'il faut dérouler. Si j'ai un bug à 21h et que je cherche de l'aide, je dois fouiller. Ce n'est pas bloquant mais c'est irritant.

**P1 — Pas d'état d'erreur visible si l'API tombe**
Le catch redirige vers mailto: sans prévenir l'utilisateur. Du coup si mon client mail ne s'ouvre pas (cas fréquent sur mobile navigateur), le message part dans le vide et je ne sais pas si ça a marché. Il manque un message d'erreur explicite : "L'envoi a échoué — écris-nous à contact@immocrew.fr".

**P2 — Le titre duplique l'icône**
Page.tsx déclare icon="💬" dans DashboardPageLayout ET SupportSection a son propre 💬 dans le h2. Résultat visuel : deux fois la même icône en haut de page. Ça fait un peu brouillon.

**P2 — "Décris ton retour ici..." trop vague**
Le placeholder du textarea ne guide pas. "Décris le problème ou ton idée en quelques mots" serait plus utile, surtout pour quelqu'un qui ne sait pas trop quoi écrire.

---

### Ce qui me manque

- Un accusé de réception par email après envoi (pas urgent, mais si je ferme l'onglet dans les 5 secondes, je n'ai aucune trace).
- La confirmation disparaît après 5 secondes — c'est court si je lis lentement.

---

### Détail par section

| Section | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Sélecteur de type | Limpide | Aide vraiment | Facile | Naturel | OK |
| Textarea | Limpide | Aide vraiment | Facile | Naturel | OK |
| Bouton Envoyer | Limpide | Aide vraiment | Facile | Naturel | OK |
| Message confirmation | Limpide | Aide vraiment | — | Naturel | OK |
| Bloc email fallback | Limpide | Aide vraiment | Facile | Naturel | OK |
| Lien sidebar (desktop) | Flou | Bof | — | — | P1 |
| Gestion erreur API | Incompréhensible | Ça ne sert à rien | — | — | P1 |

---

### Ma réaction honnête

J'ouvre Support, j'ai mon formulaire direct. Je clique "Problème ou bug", j'écris deux lignes, j'envoie. C'est fait en 30 secondes. Ça, c'est bien.

Ce qui me ferait tiquer dans la vraie vie : si l'envoi plante silencieusement et que mon navigateur mobile n'ouvre pas le client mail automatiquement — je pense que mon message est parti alors qu'il n'est allé nulle part. Ce genre de truc, ça crée de la défiance. Un simple "Oups, l'envoi a échoué — écris-nous directement à contact@immocrew.fr" règle le problème.

Le reste, c'est du détail. La page est propre, le ton est bon, ça ne m'infantilise pas.

---

**Handoff → @fullstack**
- P1 : ajouter un message d'erreur visible dans le catch de handleSubmit au lieu de rediriger silencieusement vers mailto
- P1 : déplacer le lien Support dans NAV_SECTIONS (ou au moins le rendre accessible depuis la nav mobile sans passer par "Plus")
- P2 : supprimer l'icône 💬 dans SupportSection (page.tsx en passe déjà une via DashboardPageLayout)
- P2 : améliorer le placeholder textarea
- Verdict : GO sur la page — les P1 sont des corrections rapides, rien de bloquant pour un lancement
