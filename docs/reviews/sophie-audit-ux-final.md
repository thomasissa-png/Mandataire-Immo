## Revue métier — Audit UX complet (6 features)
> Par @mandataire (Sophie) | 2026-04-01

### Verdict global
**À RETRAVAILLER** — 4 features passent, 2 ont des problèmes qui me bloqueraient sur le terrain.

---

### Tableau de synthèse

| # | Feature | Score | Priorité | Verdict |
|---|---------|-------|----------|---------|
| 1 | Page Posts (filtres + briefs visuels) | 7/10 | P1 | À retravailler |
| 2 | Calendrier éditorial + popover | 8/10 | P2 | GO avec réserve |
| 3 | Blog mandataire (section + page article) | 9/10 | — | GO |
| 4 | Stratégie (Bios & positionnement) | 7/10 | P1 | À retravailler |
| 5 | Articles SEO (liste + page detail) | 9/10 | — | GO |
| 6 | Annonces — modal portail | 9/10 | — | GO |

---

### Feature 1 — Page Posts

**Ce qui marche**
- Les filtres par plateforme sont clairs et tactiles (boutons ronds, assez grands pour le pouce)
- Les conseils d'heure sous chaque post — "Publie entre 18h et 20h" — sont directs et utiles
- Le brief visuel avec le lien "Télécharger le visuel prêt à publier" : si ça marche, c'est exactement ce que j'attends

**Ce qui me gêne**
- La date n'est pas affichée sur chaque post dans cette liste — je vois `typeLabel`, `title`, `status`, `createdAt` passés à `DeliverableCard` mais la date visible dans la card dépend de l'affichage interne. Si elle n'est pas lisible au premier coup d'oeil, je perds le fil de quand publier quoi.
- Facebook est dans les options de filtre alors que Sophie n'a que 287 abonnés là-bas et que la promesse ImmoCrew ne cible pas ce réseau en priorité. Afficher Facebook au même niveau qu'Instagram induit que je dois m'en occuper. Si un post est assigné à Facebook par défaut, je vais le poster là et perdre mon temps.
- Le "Télécharger le visuel prêt à publier" apparaît seulement si `canAutoGenerate` retourne vrai — on ne sait pas combien de posts auront vraiment ce lien. Si la moitié des posts l'ont et l'autre non, c'est perturbant.
- Le conseil d'heure est du texte gris très petit sous le post. À 21h sur mon téléphone, je vais le rater.

**Ce qui me manque**
- La date de publication suggérée par le calendrier devrait apparaître directement ici ("À publier le mardi 8 avril")
- Un indicateur "Visuel disponible / Non disponible" clair sur la card elle-même, pas en dessous

**P1** — Le risque Facebook + absence de date suggérée = friction réelle.

---

### Feature 2 — Calendrier éditorial

**Ce qui marche**
- La distribution Lun/Mar/Jeu/Sam/Mer/Ven est logique et lisible
- Le popover mobile en bottom sheet avec le handle : c'est exactement le bon pattern sur téléphone
- Les conseils réseau + heure dans le popover (TYPE_TIPS) : actionnable, précis, au bon endroit
- Le bouton "Copier le texte" pleine largeur en orange dans le popover : je ne peux pas le rater
- La légende en bas du calendrier : simple et utile

**Ce qui me gêne**
- Sur mobile, les jours n'affichent que des points colorés — je dois mémoriser la légende pour savoir ce que orange/bleu veut dire. À 21h après une journée de visites, je ne vais pas faire cet effort.
- Le résumé du mois dit juste "12 contenus prévus en avril" — pas de découpage clair du type "3 posts Instagram, 4 articles SEO, etc." visible en un clin d'oeil. Il y a les badges mais ils sont en bas, pas en haut.

**Ce qui me manque**
- Sur mobile, afficher une ou deux lettres (P, A, V) à l'intérieur des points plutôt que juste la couleur

**P2** — Problème de lisibilité sur mobile, pas bloquant mais dégradant l'expérience principale.

---

### Feature 3 — Blog mandataire

**Ce qui marche**
- La section "Mes articles" sur la landing est propre : titre, date, description, lien "Lire l'article" — mes clients comprendront
- La page article : header foncé avec mon nom et ma ville, contenu bien structuré, CTA "Contacter Sophie" en bas — parcours parfait pour un vendeur qui lit mon article
- Le SEO est bon : `generateMetadata` construit title + description depuis les métadonnées ou le début du contenu, `robots` suit le paramètre d'indexation du profil
- Le lien "Retour au profil de Sophie" en bas : le visiteur ne se perd pas

**Ce qui me gêne**
- Header ImmoCrew (pas Sophie) sur la page article publique — un vendeur qui arrive depuis Google voit d'abord "ImmoCrew" et non mon nom. C'est leur marque, pas la mienne.

**Ce qui me manque**
- Une image d'en-tête ou une photo pour humaniser la page article — c'est du texte pur pour l'instant

**Rien de bloquant** — la structure est solide.

---

### Feature 4 — Stratégie (Bios & positionnement)

**Ce qui marche**
- Les 3 sections (Bio / Positionnement / Landing page) sont bien séparées et clairement nommées
- Le hint sous chaque section ("Copie-la sur Instagram, LinkedIn et Facebook") est actionnable
- L'encart bleu intro est rassurant : "ces contenus sont ta fondation marketing"

**Ce qui me gêne**
- Le bouton "Regénérer" et le formulaire de commentaire sont dans le `DeliverableCard` (expand) — mais l'intro de la page dit "Clique pour voir, copier ou demander une réécriture". Ce texte est correct, mais rien dans la card ne dit explicitement "tu peux demander une réécriture" tant que tu n'as pas cliqué et développé. Sur mobile, si je ne développe pas, je passe à côté.
- Après réécriture, le badge "En validation" s'affiche — c'est bien. Mais je ne sais pas en combien de temps je vais recevoir la nouvelle version. L'absence d'estimation crée de l'anxiété ("est-ce que ça a marché ?").
- Le positionnement est décrit comme "ton argumentaire unique — à utiliser quand un prospect te demande pourquoi toi". C'est parfait. Mais si le contenu généré est long et dense, je ne vais pas le mémoriser. Il me faudrait une version courte "accroche 1 phrase" en tête de ce bloc.

**Ce qui me manque**
- Un texte ou icône visible sur la card fermée indiquant "Demander une réécriture" — une petite mention avant le clic
- Une estimation du délai après validation ("Ton contenu réécrit sera prêt dans 24h")

**P1** — Le manque d'indication visible de la fonction réécriture avant de cliquer = je risque de ne jamais m'en servir.

---

### Feature 5 — Articles SEO (liste + page detail)

**Ce qui marche**
- "Lire l'article" ouvre `/dashboard/articles/[id]` — dans le dashboard, avec la sidebar, exactement là où je m'attends à le trouver
- La page detail : retour en haut à gauche, copier en haut à droite — pattern mobile standard que je reconnais
- La date formatée ("15 mars 2026") est visible directement

**Ce qui me gêne**
- Le bouton "Lire l'article" n'apparaît que sur les articles en statut `delivered`. Les articles en `draft` n'ont pas de lien du tout. Si j'ai un article "En préparation", je ne peux pas le prévisualiser, même partiel. C'est frustrant.

**Rien de critique** — la feature est propre et fonctionnelle.

---

### Feature 6 — Annonces — modal portail

**Ce qui marche**
- Le modal avec titre + description séparés et bouton "Copier" par champ : exactement ce dont j'ai besoin quand je me connecte à LeBonCoin
- Le compteur de caractères "(1247/1500 car.)" pour SeLoger : je n'ai pas à compter moi-même
- "Copier titre + description" pleine largeur en orange en bas : la clé de sortie rapide
- Le bouton "Ouvrir" pour voir l'annonce partageable apparaît après avoir généré le lien — logique

**Ce qui me gêne**
- Le bouton "Ouvrir" n'est visible qu'après avoir cliqué "Partager" et généré le `shareUrl`. Si je veux montrer l'annonce à un acheteur sans passer par le copier d'abord, je dois faire deux clics. Ce n'est pas grave mais c'est un peu tordu.
- "Bien'ici" : ce portail est moins utilisé que les deux autres. Son inclusion n'est pas un problème en soi mais prend de la place pour rien si la majorité des mandataires ne l'utilisent pas.

**Rien de bloquant** — meilleure feature de l'audit.

---

### P0/P1/P2 consolidés

| Priorité | Problème | Feature | Action |
|----------|----------|---------|--------|
| P1 | Posts Facebook proposés par défaut sans que Sophie soit active là-bas — risque de gaspiller son temps | Posts | Masquer Facebook si le profil n'a pas ce réseau activé, ou le proposer en dernière position |
| P1 | Date de publication suggérée absente sur la card post | Posts | Ajouter "À publier le [date]" depuis la distribution calendrier |
| P1 | Bouton "Demander une réécriture" invisible avant d'ouvrir la card Stratégie | Stratégie | Ajouter une mention "Demande de réécriture possible" visible sur la card fermée |
| P1 | Pas d'estimation de délai après soumission d'une réécriture | Stratégie | Ajouter "Ton contenu sera relu sous 24h" dans le badge "En validation" |
| P2 | Points colorés seuls sur mobile dans le calendrier — légende non mémorisable | Calendrier | Ajouter une lettre dans le point (P/A/V/N) |
| P2 | Brief visuel + lien téléchargement trop petits et trop gris sur mobile | Posts | Augmenter la taille ou encapsuler dans un bloc visuel distinct |

---

### Ma réaction honnête

Je suis à 21h sur mon canapé. Le calendrier je comprends ce que c'est, je clique sur un jour, le contenu sort, je peux copier — ça c'est bien. Les annonces avec les modèles LeBonCoin/SeLoger séparés, c'est exactement ce dont j'avais besoin, je copie le titre, je copie la description, terminé en 30 secondes. Les articles blog sur ma page mandataire, ça m'impressionne vraiment — un client pourrait tomber dessus sur Google.

Ce qui me frustre : la page Posts ressemble à une liste mais sans me dire quand publier quoi concrètement. Et dans Stratégie, si je vois juste la card fermée avec "Ta bio", je ne sais pas que je peux demander une réécriture sans cliquer. Ce genre de fonctionnalité cachée, je ne la découvrirai peut-être jamais.

**Verdict : À RETRAVAILLER** sur les deux P1, puis GO.

---

**Handoff → @fullstack**
- Fichier produit : `docs/reviews/sophie-audit-ux-final.md`
- Corrections P1 prioritaires : (1) masquer/déprioriser Facebook si réseau non activé dans le profil, (2) injecter la date suggérée depuis `distributeDeliverables` dans la card Post, (3) ajouter une mention visible "Réécriture possible" sur la card stratégie fermée, (4) ajouter délai estimé dans le badge "En validation"
- Corrections P2 : lettres dans les points colorés du calendrier mobile
- Les features 3, 5, 6 sont en état GO — aucune correction requise
- Resoumettre pour validation après corrections P1
