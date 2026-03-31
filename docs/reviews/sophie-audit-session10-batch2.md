# Revue métier — Batch 2 : 4 features dashboard
> Par @mandataire (Sophie) | 2026-03-31

---

## Feature 1 — Filtre par mois + archive

**Valeur perçue : 7/10**

Ce qui marche :
- Le filtre n'apparait que si j'ai du contenu sur plusieurs mois. C'est logique, pas intrusif.
- Le bouton Archives avec compteur est utile — je sais qu'il y a des trucs cachés.
- Touch targets 44px = je peux cliquer sans rater sur mon téléphone à 21h.

Ce qui coince :
- **P0** : Si j'archive un post et que la liste se vide, pas de feedback. L'erreur réseau est silencieuse (`catch {}` vide) — je ne sais pas si ça a marché ou pas. En vrai je re-cliquerais 3 fois et je paniserais.
- **P1** : Le filtre par mois n'affiche que les mois avec du contenu (`availableMonths`). Logique côté code, mais si j'ai du contenu en janvier et mars, il manque février dans la liste — déroutant.
- **P2** : Pas de confirmation quand j'archive. Je clique, ça disparait. Un undo de 5 secondes serait rassurant.

---

## Feature 2 — Calendrier éditorial

**Valeur perçue : 8/10**

Ce qui marche :
- La logique de placement est bonne : mardi/jeudi pour les posts, mercredi pour les articles, pas de dimanche. C'est du concret, pas "publie quand tu veux".
- La légende en bas + le résumé du mois = je comprends d'un coup d'oeil ce que j'ai à faire.
- État vide propre avec message rassurant.
- Navigation mois précédent/suivant fonctionne.

Ce qui coince :
- **P0** : Le placement des contenus dans le calendrier est calculé sur `distributeDeliverables` qui ignore `created_at` et `month` déjà renseignés — il redistribue à chaque render. Résultat : si je clique sur "mois suivant" puis "mois précédent", les jours assignés peuvent changer. Incohérent et désorientant.
- **P1** : Sur mobile, je vois des points colorés mais pas le type de contenu. Je dois cliquer pour savoir ce que c'est. Sur le terrain, je consulte depuis mon téléphone. Les points sans label = peu utile.
- **P1** : Le popover `CalendarDayPopover` n'est pas visible dans ce fichier — impossible d'évaluer ce qu'on voit au clic. Si c'est juste le titre du livrable sans lien direct, valeur limitée.
- **P2** : Les "Liens rapides" en bas (Posts, Articles SEO, Scripts, Emails) dupliquent la nav principale. Espace perdu.

---

## Feature 3 — Dashboard principal

**Valeur perçue : 9/10**

Ce qui marche vraiment :
- "Le matin (7h-9h) sur LinkedIn pour les pros, le soir (18h-20h) sur Instagram pour les particuliers" — c'est exactement ce que j'aurais besoin qu'on me dise. Pas de jargon, action précise.
- Le conseil vidéo ("Pas besoin que ce soit parfait — l'authenticité marche mieux que la production") = il me connait. C'est ma vraie peur.
- Les recommandations de lecture sont des vrais liens avec un résumé. Utile.
- Le bandeau profil incomplet avec les champs manquants nommés = je sais quoi corriger.
- La logique des bandeaux est bien ordonnée : pas de pack → profil incomplet → plan du mois. Priorités logiques.

Ce qui coince :
- **P1** : `showMonthlyBanner` apparait EN BAS de la page, après le CTA upgrade, après le parrainage, après "Mes biens". Je ne le vois jamais si ma page est longue. Ce bandeau devrait être dans le top 3.
- **P1** : Sur mobile avec un profil complet et un pack mensuel, la page a beaucoup d'éléments empilés : welcome banner + profil card + page mandataire card + plan du mois (5 blocs) + lien calendrier + recommandations + section parrainage + mes biens + footer. C'est long. Pas de hiérarchie visuelle forte entre ce que je fais CE SOIR vs ce qui est contextuel.
- **P2** : Le welcome banner s'appuie sur `localStorage`. Si j'ouvre sur un autre appareil (téléphone vs ordi), il réapparait. Mineur mais légèrement irritant.

---

## Feature 4 — Page profil

**Valeur perçue : 8/10**

Ce qui marche :
- Les sections sont logiques : identité → zone → métier → style → réseaux → bio. Je remplis dans l'ordre sans me perdre.
- Le helper sur `confort_camera` est humain — "ça me stresse" c'est exactement ce que je pense. Ça me met à l'aise.
- Le placeholder `bio_personnelle` avec exemple concret ("Avant l'immobilier, j'étais dans la restauration...") m'aide à comprendre ce qu'on attend de moi.
- Sauvegarde par section = si mon téléphone crashe, je ne perds pas tout.

Ce qui coince :
- **P0** : Pas d'indication visible sur la page de POURQUOI je remplis ça. La description dit "Modifie tes infos pour que tes contenus soient toujours dans le mille" — correct mais trop vague. Après onboarding, je ne sais pas que changer "quartiers" va changer mes prochains posts. Le lien cause-effet est invisible.
- **P1** : Le champ `photo de profil` est accessible depuis la dashboard card (clic sur la photo) mais il n'y a pas de section dédiée dans `ProfileForm` pour l'upload de photo — je cherche où uploader ma photo depuis le profil et je ne trouve pas directement.
- **P1** : `ProfileSectionNav` référencé mais non audité — si c'est une barre de navigation par ancre, ça aide sur desktop mais probablement invisible sur mobile (la page est courte).
- **P2** : `specialites` en type `pills` — le rendu n'est pas dans ce fichier. Si les pills ne sont pas assez grandes pour le tactile (44px min), problème sur mobile.

---

## Verdict global

| Feature | Score | Verdict |
|---------|-------|---------|
| Filtre par mois + archive | 7/10 | A RETRAVAILLER (feedback erreur silencieuse) |
| Calendrier éditorial | 8/10 | A RETRAVAILLER (redistribution aléatoire) |
| Dashboard principal | 9/10 | FONCE (P1 ordre bandeau monthly update) |
| Page profil | 8/10 | A RETRAVAILLER (lien cause-effet absent, photo introuvable) |

## Ma réaction honnête

À 21h après 3 visites, j'ouvre le dashboard. Le plan du mois est bien — je sais quoi faire, avec des vraies heures de publication. Le calendrier me rassure sur la répartition. Mais si j'archive un post et que rien ne se passe visuellement, je panique. Et sur le profil, je ne comprends pas que changer mes quartiers va changer mes posts du mois prochain — ce lien doit être explicite.

---

**Handoff → @fullstack**
- P0 prioritaire : feedback erreur silencieuse sur archive + redistribution aléatoire calendrier
- P1 : ordre bandeau monthly update (remonter en haut) + lien cause-effet sur page profil + photo profil introuvable depuis profil
- Dashboard principal peut passer en production sous réserve du P1 ordre
