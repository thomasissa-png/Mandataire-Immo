## Revue métier — Dashboard + Profil + Biens + Admin (v2)
> Par @mandataire (Sophie) | 2026-03-28

---

### Verdict global
**À RETRAVAILLER — 7.2/10**

La plateforme est construite par quelqu'un qui connaît le terrain immobilier. Le cœur (annonce IA en 2 onglets, upload HEIC, plan du mois avec horaires précis, pills spécialités) est au niveau premium. 4 pages sur 8 passent directement (P2, P3, P5, P6). Les 4 autres ont des frictions réparables rapidement : fautes d'accent sur l'interface, impossibilité de modifier un bien depuis sa fiche, manque de contexte sur la mise à jour mensuelle, admin sans suivi de livraison mensuelle. Corrections estimées : 2 jours de dev max.

---

### P1 — Dashboard principal
**Fichier :** `src/components/dashboard/DashboardContent.tsx`

**Ce qui me plaît**

La sidebar desktop avec les sections cliquables — c'est utile, je vois d'un coup d'oeil "Biens & annonces", "Calendrier & posts", "Scripts vidéo". Sur mobile la nav horizontale scrollable fonctionne. La profile card compacte en haut avec mon réseau et ma ville, c'est bien — ça me rappelle que le contenu est fait pour moi.

Le plan du mois est le vrai truc qui m'a arrêtée. Il me dit exactement quoi faire dans quel ordre : d'abord les bios, ensuite les posts, ensuite les vidéos. Les horaires de publication sont donnés (7h-9h LinkedIn, 18h-20h Instagram). Les liens blog intégrés dans les recommandations — ça c'est une bonne idée, ça m'explique le "pourquoi" sans me noyer.

Le CTA "Commencer le mensuel →" est là, bien placé après le plan, pas avant. Ça respecte la logique : montrez-moi la valeur d'abord, demandez l'argent ensuite.

Le bandeau "Dis-nous ce qui a changé ce mois-ci" — 10 min, tes prochains contenus seront encore plus dans le mille. Simple, honnête, pas agressif.

**Ce qui me gêne**

Le bloc "On te connaît" récite mes données profil de façon mécanique : "tu travailles surtout l'immobilier dans la gamme X pour Y". C'est une liste de variables, pas une vraie phrase humaine. Si une collègue m'écrivait comme ça je penserais qu'elle a rempli un formulaire. La phrase "Voici ton plan d'action personnalisé" arrive juste après et semble naïve — je vois que c'est du template.

La déduplication bio/positionnement est bien implémentée techniquement (`uniqueStrategie.reduce`) mais il n'y a pas de message explicatif pour moi. Si j'ai deux bios dans mes livrables du mois dernier et un ce mois-ci, je ne sais pas lequel est le bon. Un simple "Dernière version — mise à jour le [date]" éviterait la confusion.

Les annonces de biens sont dans `MesBiensSection`, correctement séparée des livrables stratégiques. Ça OK. Mais dans la nav, la pastille "Biens & annonces" compte `biensCount + annonces.length` — mes biens self-service ET les annonces IA livrées par ImmoCrew. Je ne distingue pas les deux dans le compteur. Si j'ai 3 biens et 2 annonces IA, j'ai "(5)" — ça ne veut rien dire.

La section "Mon profil et identité" s'appelle comme ça dans le code mais dans la nav elle affiche "Mon profil" avec un compteur de livrables stratégiques (bio, positionnement, calendrier...). Ce n'est pas logique — ce n'est pas MON profil éditable, c'est MES livrables de stratégie. Je risque de chercher où modifier mes infos.

La nav mobile apparaît APRÈS le bandeau welcome, le bandeau pack, le bandeau profil incomplet, la profile card ET le plan du mois. Sur mobile c'est un défilement long avant d'arriver à la navigation. Sur desktop ça va, la sidebar est sticky.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Presque. Le plan du mois avec les liens blog et les horaires précis, c'est du détail qu'on ne trouve pas dans les outils de templates. Le "On te connaît" en revanche sonne creux — ça casse la promesse premium. À ce prix, je veux que ce texte me prouve qu'on me connaît VRAIMENT, pas qu'on liste mes champs de base de données.

**Note : 7/10 — FRICTION**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Sidebar/nav | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Plan du mois | Limpide | Ça m'aide vraiment | Facile | Presque | PASS |
| "On te connaît" | Limpide | Bof | Facile | Un peu trop lisse | FRICTION |
| Déduplication | Flou | Bof | — | — | FRICTION |
| Compteur nav "Biens" | Flou | Bof | — | — | FRICTION |
| CTA mensuel | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |

---

### P2 — Page profil
**Fichier :** `src/components/dashboard/ProfileForm.tsx`

**Ce qui me plaît**

6 sections bien séparées avec une icône et un titre clair : Ton identité, Ta zone, Ton métier, Ton style, Tes réseaux sociaux, Ta bio. Je comprends du premier coup ce qu'on me demande dans chaque section. Pas de jargon.

Les spécialités en pills cliquables — Résidentiel, Commercial, Terrain, Neuf, etc. — c'est exactement comme ça que j'aurais fait si j'avais eu le choix. Je coche, je décoche, c'est visuel et rapide. Infiniment mieux qu'un champ texte libre "spécialités".

Le système de sauvegarde section par section avec feedback immédiat ("Enregistré !" en vert, spinner pendant l'envoi) — c'est professionnel. Le bouton Enregistrer grisé quand rien n'a changé (dirty tracking), ça évite les clics inutiles.

Le champ "Ce qui te rend unique" — bonne formulation. Direct, concret. Le placeholder "Je connais chaque rue de La Doutre, j'y vis depuis 10 ans" — c'est exactement le genre d'exemple qui me parle. Quelqu'un qui connaît le terrain a écrit ça.

Le champ "Ton rapport à la vidéo" avec l'option "Je n'ai jamais fait de vidéo — ça me stresse" — ça montre qu'on a pensé à des gens comme moi. Je ne me sens pas jugée.

Upload photo avec HEIC accepté — essentiel pour iPhone. La limite 5 Mo et les formats acceptés sont affichés AVANT l'upload, dans la description sous le label. C'est bien.

**Ce qui me gêne**

Le label du champ différenciation est "Ce qui te rend unique" — parfait. Mais le placeholder de la bio dit "Avant l'immobilier, j'étais dans la restauration" — l'exemple casse le fil car le helper dit "Cette bio nous aide à personnaliser tes textes avec ta vraie personnalité." Où est-ce que cette bio va s'afficher ? Sur mes posts ? Dans mes annonces ? Dans ma page publique ImmoCrew ? Je ne sais pas. Sans destination claire, je ne sais pas quoi écrire.

La section "Tes réseaux sociaux" — les champs LinkedIn, Instagram, Facebook, Site web. Bien. Mais il n'y a aucune explication du POURQUOI on me demande ça. Est-ce que ImmoCrew va poster à ma place sur ces comptes ? Est-ce que c'est juste pour les mentionner dans mes contenus ? Une ligne de contexte éviterait la méfiance.

Le champ "Transactions par an" et "Années d'expérience" sont des champs texte libres. Je peux taper n'importe quoi. Un `type="number"` ou même juste le bon inputMode serait plus propre.

L'upload photo fait partie de la section "identite" côté logique mais visuellement il est AVANT les sections, séparé. Si j'ai une erreur sur l'upload (ex : "La photo dépasse 5 Mo"), l'erreur s'affiche sous la zone d'upload, PAS dans la section identite. C'est cohérent mais il n'y a pas de message de succès visible après upload — juste le statut "identite: success" qui disparaît au bout de 3 secondes. Si je suis sur mobile et que j'ai raté ça, je me demande si ça a marché.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Oui sur la structure et les interactions. Les pills, le dirty tracking, le feedback par section — c'est du niveau Notion ou Linear, pas du niveau d'un formulaire WordPress. Ce qui manque c'est le "pourquoi" de chaque section — une seule ligne d'explication suffirait à me convaincre que remplir ce formulaire va vraiment améliorer mes contenus.

**Note : 8/10 — PASS (avec friction sur le "pourquoi")**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Structure 6 sections | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Pills spécialités | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| "Ce qui te rend unique" | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Destination de la bio | Flou | Bof | — | — | FRICTION |
| Raison des réseaux sociaux | Flou | Bof | — | — | FRICTION |
| Upload photo feedback | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |

---

### P3 — Ajout bien
**Fichier :** `src/components/biens/BienForm.tsx`

**Ce qui me plaît**

Le lien d'annonce existante EN PREMIER, encadré orange (border-warning-300), avec le message "On récupère les infos automatiquement — tu n'auras presque rien à remplir." C'est la bonne promesse au bon endroit. Quand j'arrive sur ce formulaire avec mon lien SeLoger dans le presse-papiers, je le colle et c'est parti. La logique d'ordre est excellente.

La grille Prix + Surface + Pièces en 3 colonnes sur tablette/desktop, une colonne sur mobile — ça s'adapte bien. Le suffixe "€" et "m²" à droite du champ, formatage français du prix en temps réel ("285 000 €" sous le champ) — c'est du détail professionnel qui me rassure.

Le champ "Points forts" avec le placeholder "Parquet chêne, double exposition, cave, gardien, balcon 8m²" — très bien, ça me montre le niveau de détail attendu. Ce n'est pas générique.

La validation claire : messages d'erreur sous chaque champ, rouge, avec texte explicite ("Le prix doit être supérieur à 0 €"). Rien de cryptique.

**Ce qui me gêne**

La description placeholder pour le lien dit "Colle le lien SeLoger, LeBonCoin ou Bien'ici" — mais le label dit "Lien d'annonce existante" et le champ est optionnel. C'est logique. En revanche, si je colle un lien et que le scraping automatique ne fonctionne pas (timeout, site bloqué), est-ce qu'on me prévient ? Ou est-ce que le formulaire se remplit normalement et je réalise plus tard que les champs sont vides ? Je ne vois pas de feedback visible sur le résultat du scraping.

Le bouton de soumission dit "Créer mon bien" — ça m'envoie vers `/dashboard/biens/[id]`. C'est logique. Mais nulle part dans ce formulaire il n'est dit POURQUOI j'ajoute ce bien — pour générer une annonce IA ? Pour avoir une page publique ? Pour que ça apparaisse dans mon dashboard ? Une ligne d'introduction en tête de formulaire ("Ajoute un bien pour générer ton annonce et ta page publique en un clic") aiderait à me donner envie de remplir soigneusement.

Le champ "Description détaillée" (optionnel) vient après les Points forts. Ce n'est pas forcément intuitif — je pourrais croire que les Points forts suffiront et ignorer la description, alors que c'est peut-être la partie la plus utile pour l'IA. Un hint "Plus tu détailles ici, meilleure sera ton annonce" serait bienvenu.

Le label "Pièces" n'a pas d'astérisque rouge et est réellement optionnel dans la validation, mais dans la grille il est au même niveau visuel que Prix et Surface qui sont obligatoires. Confusion possible.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Le formulaire est propre et bien structuré. L'encadré orange sur le lien d'annonce, ça c'est une signature visuelle forte — ça dit clairement "commence par là". Ce qui le ramènerait au niveau premium : expliquer la promesse en tête, et clarifier ce que le scraping va faire (ou pas faire) pour mes données.

**Note : 7.5/10 — PASS**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Lien annonce en premier (orange) | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Grille Prix/Surface/Pièces | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Feedback scraping | Flou | Bof | — | — | FRICTION |
| Contexte du formulaire | Flou | Bof | — | — | FRICTION |
| Validation et erreurs | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |

---

### P4 — Fiche bien
**Fichiers :** `src/app/dashboard/biens/[id]/page.tsx` + `src/components/biens/BienFicheClient.tsx`

**Ce qui me plaît**

La structure de la page est impeccable. En-tête avec titre, adresse, prix bien affiché (formaté en euros), badges surface et pièces — je vois d'un coup d'oeil les infos clés de mon bien. Points forts affichés en pastille colorée.

L'ordre des sections dans `BienFicheClient` : Photos d'abord, puis Annonce, puis Page publique. C'est la logique métier correcte — je mets les photos, ça débloque la génération d'annonce, puis j'ai ma page publique. L'UI reflète exactement mon parcours.

Le "Retour au dashboard" avec la flèche — discret mais présent, je ne suis jamais coincée sur la page.

La section Page publique avec le lien et le bouton "Copier le lien" — "Partage ce lien avec tes acheteurs potentiels par SMS, email ou dans tes annonces." Une phrase, concret, actionnable. C'est exactement comment j'aurais envie qu'on m'explique quoi faire avec ça.

**Ce qui me gêne**

La Page publique n'est disponible qu'après génération de l'annonce — le message est "La page publique sera disponible après la génération de ton annonce." C'est logique mais frustrant si j'upload mes photos et que je veux partager la page tout de suite, même sans annonce rédigée. Un vendeur qui attend peut-être vouloir juste envoyer "regarde mes photos" à un acheteur.

Il n'y a pas de bouton pour modifier les infos du bien (prix, surface, adresse) depuis cette fiche. Si je me suis trompée sur le prix ou si le bien a été renégocié, je dois aller où ? Ce n'est pas visible sur cette page. Pour un mandataire qui gère 4-5 biens en simultané, cette action va arriver régulièrement.

Il n'y a pas de statut visible du bien — est-il "en vente", "sous compromis", "vendu" ? Sur la fiche il n'y a que les infos statiques. Si j'ai signé un compromis hier, je n'ai aucun moyen de marquer le bien comme "sous promesse" pour me souvenir de ne plus le promouvoir.

La section Photos et la section Annonce sont deux composants distincts côté client, liés par `photoCount` (passé via callback). Ça fonctionne mais si l'upload de photos passe par plusieurs tentatives (erreurs réseau), le compteur peut désynchro avec l'état réel. Je n'ai pas de moyen visuel de "rafraîchir" la page sans perdre ma progression.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Presque. La structure en 3 sections logiques est claire et professionnelle. Ce qui manque pour atteindre le premium : modifier les infos du bien depuis la fiche, et un statut de vente (en vente / sous compromis / vendu). Ce sont des fonctionnalités que j'attends d'un outil immobilier, pas d'un formulaire.

**Note : 7/10 — FRICTION**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| En-tête bien | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Ordre Photos→Annonce→Page | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Page publique SMS-friendly | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Modifier les infos du bien | Absent | Bof | — | — | FAIL |
| Statut du bien | Absent | Bof | — | — | FRICTION |

---

### P5 — Upload photos
**Fichier :** `src/components/biens/PhotoUploader.tsx`

**Ce qui me plaît**

"JPG, PNG, WebP ou HEIC — max 5 Mo par photo — 0/10 photos" — tout est là avant l'upload, dans la zone de dépôt elle-même. Pas besoin de cliquer pour découvrir la limite. HEIC est dans la liste des formats acceptés, c'est essentiel — 90% de mes photos viennent de mon iPhone.

Le drag-and-drop avec état visuel (border colorée, fond légèrement coloré quand je survole) — professionnel. Le focus clavier fonctionne.

Les miniatures en temps réel pendant l'upload avec la barre de progression — c'est rassurant. Je vois que ça travaille. La photo qui s'affiche en preview même si elle charge encore, c'est une bonne UX.

Le bouton de suppression par photo avec hover effect — discret au repos, visible au survol. Pas intrusif. Le rollback optimiste si la suppression échoue — l'image réapparaît automatiquement et un message d'erreur s'affiche. Bien géré.

Le compteur "0/10 photos" mis à jour en temps réel — je sais où j'en suis sans compter.

**Ce qui me gêne**

Le message "5 Mo par photo" est dans la zone de dépôt — bien. Mais si je glisse une photo de 8 Mo, l'erreur dit "Cette photo dépasse 5 Mo — réduis sa taille avant upload." Concrètement comment je réduis la taille d'une photo sur iPhone ? Aucune aide, aucun lien, aucun conseil pratique. Pour une mandataire qui n'est pas une experte tech, c'est un mur. Une seule ligne suffirait : "Sur iPhone : envoie la photo par mail à toi-même, ouvre-la, enregistre-la — elle sera compressée."

Si une photo échoue à l'upload (erreur réseau), il y a un message d'erreur dans la miniature avec un bouton "Fermer". Mais fermer l'erreur ne relance pas l'upload — elle disparaît. Je dois la re-sélectionner manuellement. Un bouton "Réessayer" directement sur la miniature éviterait ça.

Le badge "ordre" (numéro) en bas à gauche de chaque photo — je ne sais pas si cet ordre a une importance pour l'annonce générée. Est-ce que la première photo sera la photo principale de ma page publique ? Si oui, c'est une information cruciale à donner ici ("La première photo sera mise en avant sur ta page publique").

Il n'y a pas de système de réorganisation des photos (drag-to-reorder). Si j'upload dans le mauvais ordre, je dois tout supprimer et recommencer.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Techniquement oui — le drag-and-drop, les previews temps réel, le HEIC, le rollback optimiste. Ça tient la comparaison avec des outils premium. Ce qui manque c'est la guidabilité pratique (aide pour réduire la taille), le "réessayer" sur erreur, et l'explication de l'ordre des photos.

**Note : 7.5/10 — PASS**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Limite 5 Mo visible avant upload | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| HEIC accepté | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Aide pour réduire taille photo | Absent | Bof | — | — | FRICTION |
| Bouton Réessayer sur erreur | Absent | Bof | — | — | FRICTION |
| Ordre photos et impact annonce | Flou | Bof | — | — | FRICTION |

---

### P6 — Annonce générée
**Fichier :** `src/components/biens/AnnonceBlock.tsx`

**Ce qui me plaît**

Les 2 onglets "Annonce longue" / "Annonce courte (portails)" — exactement ce dont j'ai besoin. La longue pour ma page web, la courte pour SeLoger et LeBonCoin qui limitent les caractères. L'étiquette "(portails)" dans le nom de l'onglet, c'est le bon mot, le mien.

Le bouton "Copier l'annonce" qui passe à "Copié — colle-le !" avec une coche verte pendant 2,5 secondes — c'est satisfaisant, ça confirme que l'action a marché. Le fallback document.execCommand si navigator.clipboard échoue, c'est bien géré côté technique.

Le lien "Voir ma page publique" à côté du bouton Copier — direct, sans chercher. Je copie l'annonce ET je peux ouvrir ma page dans le même geste.

Le titre de l'annonce et l'accroche courte affichés en en-tête de la card une fois générée — "Appartement T3 lumineux La Doutre / Vue Loire exceptionnelle" par exemple — ça donne envie. C'est la première preuve que l'IA a travaillé.

La gestion des états : pas de photos → bouton grisé avec tooltip, loading → skeleton animé avec timer "30 secondes", erreur → bouton réessayer, succès → onglets. Chaque état est géré, c'est professionnel.

Le bouton "Régénérer" avec confirmation ("Écraser l'annonce existante ? Cette action est irréversible.") — c'est bien d'avoir cette sécurité. Je n'aurais pas aimé écraser mon annonce par un faux clic.

**Ce qui me gêne**

La zone de texte de l'annonce est dans un div avec `max-h-[400px] overflow-y-auto`. Sur mobile avec une annonce longue, je me retrouve à scroller à l'intérieur d'un div à l'intérieur de la page. C'est souvent une galère — je scroll la page au lieu de scroller l'annonce. Une solution simple : limiter la hauteur seulement sur desktop, laisser le texte s'étaler sur mobile.

Une fois que j'ai copié l'annonce longue et que je veux la coller sur SeLoger, il faut que je repasse sur l'onglet "Annonce courte" pour copier celle-là aussi. Deux clics, deux copies. Logique mais légèrement fastidieux si je travaille vite. Un bouton "Copier tout" ou un lien direct "Portails : copier la version courte" juste sous le bouton principal aurait du sens.

Il n'y a pas d'indication du nombre de caractères de l'annonce courte. Sur LeBonCoin la limite est 5000 caractères, sur SeLoger 2000. Si mon annonce courte fait 3000 caractères et que SeLoger refuse, je vais passer du temps à comprendre pourquoi. Un compteur simple ("1340 / 2000 car.") serait une vraie valeur ajoutée.

L'état "pas de photos" désactive le bouton avec un div `aria-disabled="true"` au lieu d'un `button disabled` — techniquement c'est un problème d'accessibilité mais surtout le message "Ajoute au moins une photo pour générer ton annonce" ne donne pas d'ancre cliquable pour remonter vers la section Photos. Un lien "Ajouter des photos ↑" serait plus direct.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Oui sur le cœur du parcours : états bien gérés, copier fonctionne, onglets logiques, confirmation avant régénération. Ce qui pousserait vers le 9/10 : le compteur de caractères pour les portails, et le scroll mobile de la zone de texte.

**Note : 8/10 — PASS**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| 2 onglets longue/courte | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Copier + "Copié — colle-le !" | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Tous les états UI gérés | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Scroll annonce sur mobile | Flou | Bof | Impossible dans mon quotidien | — | FRICTION |
| Compteur caractères portails | Absent | Bof | — | — | FRICTION |
| Lien "Ajouter photos ↑" | Absent | Bof | — | — | FRICTION |

---

### P7 — Mise à jour mensuelle
**Fichier :** `src/app/dashboard/monthly-update/page.tsx`

**Ce qui me plaît**

3 étapes, barre de progression, titre de l'étape affiché ("Tes biens ce mois-ci", "Ton mois en bref", "Recap et validation") — je sais où j'en suis. Le scroll vers le haut automatique entre les étapes, c'est un détail propre.

Étape 2 — les questions sont en français parlé : "Un truc marquant ce mois-ci ?", "Un événement dans ta zone ce mois-ci ?", "Les prix dans ton secteur ce mois-ci ?", "Ton focus du mois — sur quoi tu veux communiquer ?" C'est exactement le niveau de langage qui ne m'intimide pas. Les exemples dans les placeholders sont concrets et ancrés dans la réalité ("Foire d'Angers du 12 au 15", "J'ai vendu le T3 Beaurepaire en 48h").

Les sujets prioritaires en checkboxes avec des libellés métier vrais : "Primo-accédants", "Investissement locatif", "Estimation / prospection vendeurs", "Marché local / prix". Ce ne sont pas des catégories marketing, ce sont mes catégories terrain.

L'écran de confirmation final est bien : "C'est enregistré ! On s'occupe du reste. Tes contenus arrivent sous 48h." Simple, rassurant, délai annoncé.

**Ce qui me gêne**

On ne m'explique pas ce que cette mise à jour mensuelle va concrètement changer dans mes contenus. Le bandeau du dashboard dit "10 min, et tes prochains contenus seront encore plus dans le mille" — mais sur la page elle-même, il n'y a aucun rappel de la valeur. Si je suis sur cette page à 21h30 après une longue journée, j'ai besoin d'un rappel motivant en haut : "Ces 3 questions vont personnaliser tes 12 posts de mars. Ça prend 5 minutes."

Étape 1 — "Ajoute ou retire des biens. Max 10 biens." C'est clair mais il n'y a pas de lien direct vers "/dashboard/biens" si je veux ajouter un bien avec photos et annonce complète. Si j'ai un nouveau mandat, je dois quitter cette page, aller dans mes biens, créer le bien complet, et revenir ici pour l'ajouter. Un bouton "Ajouter un bien complet →" en complément du mini-formulaire serait bien.

Les accents manquent dans plusieurs placeholders et labels de l'étape 2 : "Etape", "C'est enregistre", "personalises", "evenements", "ca rend ta newsletter unique". C'est une question de soin — pour un service premium à 150€/mois, les fautes d'accent sur l'interface donnent une mauvaise impression. C'est le genre de détail que mes clients vendeurs voient.

L'étape 3 (récap) ne me permet pas de modifier les réponses en place — je dois cliquer "Précédent" et naviguer à l'étape concernée. Pour une mise à jour rapide, ça ajoute 2-3 clics inutiles. Un lien "Modifier" à côté de chaque bloc de récap serait plus rapide.

Si je n'envoie pas (je quitte la page à mi-chemin), mes réponses sont perdues. Il n'y a pas de sauvegarde automatique des brouillons. Ce n'est pas dramatique mais c'est un risque si j'ai une interruption (enfant qui se réveille, appel de client).

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Le fond est solide — les questions sont les bonnes, le langage est le bon. La forme a quelques accrocs : les fautes d'accent sur l'interface baissent la perception de qualité, et l'absence de contexte en tête de page enlève l'envie de remplir. À corriger rapidement, ça ne coûte rien.

**Note : 6.5/10 — FRICTION**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| 3 étapes avec progression | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Questions en français parlé | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Accents manquants dans l'UI | — | — | — | Un peu trop lisse | FRICTION |
| Contexte en tête de page | Absent | Bof | — | — | FRICTION |
| Modification depuis récap | Absent | Bof | — | — | FRICTION |
| Sauvegarde brouillon | Absent | Bof | — | — | FRICTION |

---

### P8 — Admin
**Fichiers :** `src/app/admin/page.tsx` + `src/app/admin/clients/[id]/page.tsx`

Note : je suis Sophie, pas Thomas. L'admin c'est pour Thomas — je l'évalue du point de vue "si Thomas me montre ça, est-ce que ça me semble crédible pour gérer 30 clients ?"

**Ce qui me plaît — page liste**

4 stats en grid (Total clients, Actifs, Mensuels, Lancements) — Thomas voit d'un coup d'oeil son MRR potentiel. Simple et direct.

La table clients avec colonnes Nom, Pack, Statut, Date, Actions. Compact, lisible. Les badges colorés (vert = actif, orange = inactif, rouge = churned) — visuels, pas besoin de lire.

Le bloc "Generate SEO article" avec le prochain sujet prévu — ça montre que le système a une logique éditoriale autonome, Thomas peut déclencher la production en un clic.

**Ce qui me plaît — page détail client**

La section Context data (ClientContextCard) — Thomas voit ce que Sophie a rempli dans son profil. C'est la base de toute la production.

Le bouton TriggerProductionButton avec le pack en paramètre — Thomas peut lancer la génération pour n'importe quel client manuellement. C'est l'action principale d'un opérateur de service productisé.

La section livrables avec le statut (delivered / draft) et la date — Thomas peut voir en un coup d'oeil si un client a reçu ses contenus ce mois.

**Ce qui me gêne — page liste**

Il n'y a pas de colonne "Dernier contenu livré" ou "Mois en cours : livré/non". Pour un service mensuel, Thomas a besoin de savoir EN UN COUP D'OEIL quels clients sont à jour et quels clients n'ont pas encore reçu leur pack de mars. Aujourd'hui il doit ouvrir chaque fiche une par une.

Il n'y a pas de filtre ou de tri par statut, pack, ou date. Si Thomas a 30 clients, trouver les clients "actifs / pack mensuel / pas encore livrés ce mois" implique de scroller toute la liste. C'est un vrai problème opérationnel à 30 clients.

L'accès admin est protégé par "cookie ADMIN_PASSWORD" — commentaire dans le code. Pas de 2FA, pas de session expirante visible. C'est une question de sécurité basique à documenter.

**Ce qui me gêne — page détail client**

La section "Production IA" avec TriggerProductionButton — je ne vois pas ce que ce bouton fait exactement en termes de livrables générés. Il prend le pack en paramètre mais je ne sais pas si ça génère 12 posts + 2 articles + 4 scripts ou autre chose selon les règles du pack. Pour Thomas c'est important de savoir ce qu'il déclenche.

Il n'y a pas de champ "Note interne" par client. Thomas ne peut pas laisser de note du type "client difficile — attention au ton" ou "a demandé à se concentrer sur La Doutre en avril". Sur une liste de 30 clients, la mémoire ne suffit pas.

Les accents manquent aussi ici : "Aucun livrable genere pour ce client", "C'est enregistre", "personalises". Même problème que P7 — ça donne l'impression d'une interface développée vite.

**Question VALEUR — "Est-ce au niveau d'un SaaS premium ?"**

Pour un MVP à 0-5 clients : suffisant. Pour opérer 30 clients/mois : manque le tableau de bord de suivi mensuel et les filtres. Ce sont les deux choses qui feront gagner du temps à Thomas chaque mois.

**Note : 6/10 — FRICTION**

| Élément | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Stats globales (4 KPIs) | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Badges statut colorés | Limpide | Ça m'aide vraiment | Facile | On se comprend | PASS |
| Suivi livraison mensuelle par client | Absent | Bof | — | — | FAIL |
| Filtres/tri liste clients | Absent | Bof | — | — | FRICTION |
| Note interne par client | Absent | Bof | — | — | FRICTION |
| Accents manquants | — | — | — | Un peu trop lisse | FRICTION |

---

### Score global + top 3 corrections

**Score global : 7.2/10 — À RETRAVAILLER**

| Page | Note | Statut |
|------|------|--------|
| P1 — Dashboard principal | 7/10 | FRICTION |
| P2 — Page profil | 8/10 | PASS |
| P3 — Ajout bien | 7.5/10 | PASS |
| P4 — Fiche bien | 7/10 | FRICTION |
| P5 — Upload photos | 7.5/10 | PASS |
| P6 — Annonce générée | 8/10 | PASS |
| P7 — Mise à jour mensuelle | 6.5/10 | FRICTION |
| P8 — Admin | 6/10 | FRICTION |

---

**Top 3 corrections — dans cet ordre**

**1. Corriger tous les accents manquants (P7 + P8) — URGENT**

Pages concernées : `monthly-update/page.tsx` et `admin/clients/[id]/page.tsx`.
Mots à corriger : "Etape" → "Étape", "C'est enregistre" → "C'est enregistré", "personalises" → "personnalisés", "evenements" → "événements", "ca rend" → "ça rend", "Aucun livrable genere" → "Aucun livrable généré", "Recap" → "Récap", "Verifie" → "Vérifie".

Pourquoi c'est urgent : pour un service à 150€/mois, les fautes de frappe sur l'interface (accents manquants) donnent l'impression d'un produit bâclé. C'est la première chose qu'un client ou un prospect remarquera. Ce n'est pas une question de goût — c'est une question de crédibilité. Coût de correction : 30 minutes.

**2. Ajouter un bouton "Modifier les infos du bien" sur la fiche bien (P4) — FONCTIONNEL**

Page concernée : `BienFicheClient.tsx`.
Ce qui manque : un bouton ou un lien "Modifier le bien" depuis la fiche `/dashboard/biens/[id]` qui ouvre un formulaire d'édition (prix, surface, adresse, points forts). Actuellement cette action n'est pas possible depuis la fiche.

Pourquoi c'est important : le prix d'un bien change (renégociation, baisse), l'adresse peut être précisée après signature du mandat. C'est une action fréquente dans mon métier. Si je ne peux pas le faire depuis la fiche, je dois aller chercher où dans le dashboard — et potentiellement je ne trouve pas. Coût : une page d'édition ou un drawer avec le même formulaire que l'ajout.

**3. Ajouter le contexte en tête de la mise à jour mensuelle (P7) — RAPIDE**

Page concernée : `monthly-update/page.tsx`.
Ce qui manque : une ligne d'introduction au-dessus de la barre de progression. Quelque chose comme : "Ces 3 questions prennent 5 minutes et vont personnaliser tes 12 posts + 2 articles + 4 scripts de [mois en cours]. Plus tu es précise, meilleurs sont les résultats."

Pourquoi c'est important : cette page est un formulaire demandant un effort. Si je n'ai pas de raison claire de le remplir soigneusement, je bâcle. La motivation vient de savoir ce que ça va changer concrètement dans mes contenus. Coût : 2 lignes de texte.

---

**Ma réaction honnête**

La plateforme est clairement construite par quelqu'un qui comprend le métier. Le lien d'annonce en premier dans le formulaire, les onglets longue/courte pour les portails, le HEIC accepté, les pills de spécialités — ce sont des détails qui prouvent qu'on a réfléchi à mon quotidien, pas qu'on a fait un formulaire générique.

Mais il y a un fossé entre les 5 éléments qui sont vraiment bien (le plan du mois, l'upload photos, l'annonce générée, les pills du profil, la structure fiche bien) et les accrocs qui cassent l'impression premium : les fautes d'accent sur la mise à jour mensuelle, l'impossibilité de modifier un bien depuis sa fiche, le "On te connaît" du dashboard qui sonne creux.

À 150€/mois je m'attends à un niveau d'attention aux détails comparable à Notion ou Linear. Pas un outil parfait, mais un outil soigné. On est à 80% de ce niveau. Les 3 corrections ci-dessus représentent au maximum 2 jours de dev et elles feraient passer la note de 7.2 à 8.5 facilement.

Ce qui me donnerait envie de recommander ImmoCrew à une collègue : l'annonce générée en 30 secondes. C'est le "wow moment" de la plateforme. Tout le reste doit être à la hauteur de cette promesse.

---

**Handoff → @fullstack**
- Fichier produit : `/home/user/Mandataire-Immo/docs/reviews/sophie-audit-dashboard-v2.md`
- Verdict : À RETRAVAILLER
- Corrections prioritaires (dans l'ordre) :
  1. Corriger les accents dans `monthly-update/page.tsx` et `admin/clients/[id]/page.tsx`
  2. Ajouter bouton/page d'édition bien depuis `BienFicheClient.tsx`
  3. Ajouter texte d'introduction en tête de `monthly-update/page.tsx`
- Corrections secondaires (backlog) :
  - Compteur de caractères dans `AnnonceBlock.tsx` (annonce courte → limite portails)
  - Bouton "Réessayer" sur erreur d'upload dans `PhotoUploader.tsx`
  - Explication ordre photos et photo principale dans `PhotoUploader.tsx`
  - Statut bien (en vente / sous compromis / vendu) dans fiche bien
  - Suivi livraison mensuelle par client dans admin liste
  - Clarifier destination de la bio dans `ProfileForm.tsx` (helper)
  - Clarifier "pourquoi" des réseaux sociaux dans `ProfileForm.tsx`
  - Corriger texte "On te connaît" dans `DashboardContent.tsx` — le rendre humain, pas une liste de variables
