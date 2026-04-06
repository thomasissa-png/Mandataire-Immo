## Revue métier — Batch 3 (Parrainage · Ma page · Pages légales)
> Par @mandataire (Sophie) | 2026-03-31

---

## FEATURE 1 — Système parrainage (ReferralSection + ReferralCodeInput + lib)

### Verdict global
**FONCE**

### Scénario terrain simulé
Je vois la section parrainage dans mon dashboard. Je lis "1 mois gratuit par filleul abonné". Je copy le lien, je le colle dans un DM WhatsApp à une collègue SAFTI qui se plaint de ne pas savoir quoi poster. Elle s'inscrit. Je vois son email masqué apparaître en "En attente". Quand elle paye, ça passe en "Converti" et le compteur de mois crédités monte.

### Ce qui me plaît
- Le code + le lien direct en deux clics — je copie, je colle, c'est fait
- L'astuce "DM LinkedIn convertit 3x plus" — concrète, utile, je vais le faire
- L'email masqué (j***@gmail.com) — ça me rassure sur la confidentialité
- Le badge pulsant vert quand ça convertit — je le vois même crevée à 21h
- Skeleton loader propre, état erreur avec bouton "Réessayer" — rien ne plante silencieusement

### Ce qui me gêne
- P1 : "3x plus" — d'où vient ce chiffre ? Si c'est inventé et qu'une collègue me demande la source, je vais avoir l'air idiote
- P2 : L'état "empty" dit "partage par DM LinkedIn, WhatsApp ou groupe Facebook" — mais pas de bouton de partage natif. Je dois quitter l'écran, ouvrir l'app, coller. Friction inutile
- P2 : Aucune explication sur le mécanisme précis du mois gratuit. Est-ce que ça s'applique automatiquement sur ma prochaine facture ? Est-ce que je dois faire quelque chose ?

### Valeur perçue : 8/10

---

## FEATURE 2 — Dashboard "Ma page" (/dashboard/ma-page)

### Verdict global
**A RETRAVAILLER**

### Scénario terrain simulé
J'ouvre "Ma page" depuis le menu. Si je n'ai pas encore de page : je vois mon aperçu (photo, nom, ville), un bouton "Activer ma page". Je clique. Ma page est créée à /agent/sophie-moreau. Je peux changer l'indexation Google. Si mon abonnement expire, la page est "frozen" et j'ai un bandeau rouge pour me réabonner.

### Ce qui me plaît
- L'aperçu de la future page avant activation — je sais exactement ce que ça donnera
- L'avertissement "edition_locked" avec lien direct vers les offres — clair, pas agressif
- L'état "frozen" rouge avec lien réabonnement — je comprends l'urgence sans être agressée

### Ce qui me gêne
- P0 : Une fois la page activée, je ne peux PAS modifier le contenu depuis cet écran. Je vois ma bio (line-clamp-3) et un bouton "Voir ma page". C'est tout. Où est le bouton pour éditer ma bio, changer ma photo, ajouter mes biens en avant ? La landing promet "tu pourras la modifier à tout moment" — ici je ne vois aucun outil d'édition
- P0 : "Aucune bio générée pour le moment" — si c'est le cas à l'activation, le message est sec. Pas d'indication sur quand elle sera générée, ni comment la déclencher
- P1 : L'IndexationToggle et son intérêt ne sont pas expliqués pour quelqu'un qui ne connaît pas le SEO. "Visible sur Google" vs "non indexée" — j'ai besoin d'une phrase d'explication en 10 mots
- P1 : Le lien de la page utilise l'URL brute `${baseUrl}/agent/${slug}`. Pas de bouton "Copier le lien" ni de bouton de partage direct — friction identique au parrainage
- P2 : L'émoji 🌐 dans le layout — c'est le seul endroit du dashboard avec un émoji. Cohérence à revoir

### Valeur perçue : 5/10 — la page existe, mais je ne peux rien faire avec depuis le dashboard

---

## FEATURE 3 — Pages légales (CGV · Confidentialité · À propos)

### Verdict global
**FONCE** pour les CGV et confidentialité | **FONCE** pour À propos

### Scénario terrain simulé
Avant d'acheter, je lis les CGV pour savoir si je suis engagée sur la durée. Non : "résiliation à tout moment sans motif ni pénalité." Je lis la garantie 14j sur le Pack Lancement. Je comprends que l'IA produit les textes mais qu'ils sont relus avant livraison. Je vérifie la politique de confidentialité : mes données clients ne sont pas stockées, juste mon nom/zone/spécialité. Je me sens en sécurité.

### Ce qui me plaît (CGV)
- Art. 7 "obligation de moyens" — ils ne promettent pas de mandats, c'est honnête et ça me protège si ça ne marche pas
- Art. 8 garantie 14j Pack Lancement — c'est la preuve qu'ils ont confiance dans ce qu'ils livrent
- Art. 10 résiliation Pack Mensuel "à tout moment, sans motif ni pénalité" — c'est le premier truc que je cherche
- Art. 12 transparence IA — je peux expliquer à mes clients si ils me demandent
- Prix dynamiques (PACK_LANCEMENT.price, PACK_MENSUEL.price) — jamais de désynchronisation entre la landing et les CGV

### Ce qui me plaît (Confidentialité)
- Tableau des sous-traitants avec localisation et garanties — c'est précis, ça inspire confiance
- Umami sans cookies bien expliqué — je n'aurai pas à gérer un bandeau cookie intrusif
- Durées de conservation claires par catégorie

### Ce qui me plaît (À propos)
- Section "Ce qu'ImmoCrew n'est pas" — exactement ce dont j'ai besoin pour répondre aux sceptiques
- Les 3 étapes avec "7 minutes" et "3 minutes par post" — des chiffres concrets que je retiens

### Ce qui me gêne
- P1 (CGV + Confidentialité) : Utilisation d'entités HTML (`&eacute;`, `&rsquo;`, `&laquo;`) dans des strings React au lieu de vrais caractères UTF-8. C'est une règle P0 du framework (CLAUDE.md règle 13) — les entités passent dans dangerouslySetInnerHTML mais c'est une dette technique
- P1 (CGV) : La garantie est mentionnée "14 jours" mais nulle part l'email contact@immocrew.fr n'est cliquable dans cet article 8. Je dois scroller jusqu'à l'article 14 pour trouver l'email cliquable
- P2 (À propos) : "accompagné une dizaine de professionnels de l'immobilier depuis 2022" — c'est la première fois qu'un chiffre d'expérience terrain apparaît. À valider : est-ce réel ou hypothèse ?
- P2 (À propos) : Thomas est fondateur, mais le site dit "l'équipe combine expertise". Si c'est un solo fondateur, "l'équipe" peut sembler trompeur face à un prospect méfiant

### Valeur perçue (légales) : 8/10 — sérieux, complet, rassure vraiment sur l'engagement

---

## Récapitulatif des problèmes par priorité

| # | Feature | Priorité | Problème |
|---|---------|----------|----------|
| 1 | Ma page | P0 | Aucun outil d'édition de la page une fois activée — la promesse "modifier à tout moment" n'est pas tenue dans l'UI |
| 2 | Ma page | P0 | État "aucune bio générée" sans indication de délai ni de déclenchement |
| 3 | Ma page | P1 | IndexationToggle sans explication accessible (non-SEO) |
| 4 | Ma page | P1 | Pas de bouton "Copier le lien" sur l'URL de la page activée |
| 5 | Parrainage | P1 | Chiffre "3x plus" sans source — créible ou inventé ? |
| 6 | Parrainage | P2 | Pas de précision sur l'application du mois gratuit (automatique ou action requise ?) |
| 7 | Parrainage | P2 | Pas de bouton de partage natif dans l'état "empty" |
| 8 | CGV | P1 | Email de demande de remboursement (Art. 8) non cliquable dans le corps de l'article |
| 9 | CGV + Confid. | P1 | Entités HTML dans les strings React (violation règle framework CLAUDE.md §13) |
| 10 | À propos | P2 | "L'équipe" si solo fondateur — vérifier cohérence avec réalité |

---

## Ma réaction honnête

**Parrainage** : ça, ça marche. Simple, visible, utile. L'astuce LinkedIn DM est le genre de conseil concret que je retiens. Je partagerais mon lien ce soir.

**Ma page** : la promesse est bonne — avoir sa propre URL /agent/sophie-moreau, c'est exactement ce que je veux pour envoyer aux clients vendeurs. Mais là où ça coince : une fois que j'ai activé la page, le dashboard me montre juste trois lignes de bio et un lien "Voir ma page". Et après ? Comment je change ma photo ? Comment j'ajoute mes biens en avant ? Si j'ouvre ma page et qu'il y a "Aucune bio générée", je vais appeler le support. C'est une feature à moitié finie — le moteur existe, mais le tableau de bord n'est pas là.

**Pages légales** : je ne lis jamais les CGV. Là j'ai lu. "Résiliation sans engagement" en premier paragraphe de l'article résiliation, garantie 14j sur le Pack Lancement, obligation de moyens (donc ils ne promettent pas de mandats) — c'est honnête. Les pages légales m'inspirent confiance, ce qui est rare.

---

**Handoff → @fullstack**
- P0 Ma page : implémenter les contrôles d'édition (bio, photo, biens) depuis /dashboard/ma-page — ou lier explicitement vers /dashboard/profile avec "Modifier les infos de ta page"
- P0 Ma page : état "aucune bio générée" — afficher délai estimé ou bouton "Déclencher la génération"
- P1 Ma page : ajouter CopyButton sur l'URL de la page activée (réutiliser le composant du parrainage)
- P1 CGV : rendre l'email contact@immocrew.fr cliquable (mailto:) dans l'article 8
- P1 CGV + Confid. : remplacer les entités HTML par des vrais caractères UTF-8 dans les strings React (hors dangerouslySetInnerHTML)
- P1 Parrainage : documenter la source du "3x plus" ou remplacer par une formulation sans chiffre non sourcé
