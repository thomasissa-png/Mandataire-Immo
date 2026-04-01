## Revue métier — Site public ImmoCrew (landing, blog, pages mandataire, biens, annonces)
> Par @mandataire (Sophie) | 2026-04-01

---

### Verdict global
**FONCE** — avec 3 P0 à corriger avant lancement.

---

### 1. Landing page — Première impression

**Score : 8,5/10**

Le hero, c'est le premier truc que je lis. "Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva." Là, je m'arrête. C'est exactement ce que je pense tous les soirs. Le ton est juste, direct, sans jargon. La phrase d'en dessous confirme : "on est ton équipe marketing". Je comprends l'offre en 5 secondes.

Le mockup dans le hero — le post Instagram sur La Doutre, Angers, avec le tramway ligne A et le prix au m² — c'est ce qui me convainc que c'est fait pour moi, pas pour une agence de com' quelque part à Paris.

La section Problème est la meilleure du site. Quatre cases : tu postes puis plus rien, tes annonces sont génériques, 45 minutes sur Canva pour un truc bof, zéro mandat entrant. Quelqu'un a vécu ma semaine avant d'écrire ça.

Le "Comment ça marche" — 3 étapes claires, 8 minutes de questionnaire, livraison en 48h. Je peux faire ça. L'aperçu du tableau de bord est utile mais il reste vague : "Publie 3 posts cette semaine" avec "2 posts quartier + 1 post expertise". Concrètement, à quelle heure ? Sur Facebook ou Instagram ? Le détail manque ici.

Le Before/After est excellent — les deux exemples (La Doutre Angers, Aiguelongue Montpellier) sont vrais, précis, avec de vrais chiffres. C'est la preuve concrète que ça marche. Je lirai les deux.

Les témoignages : le contenu est bon, mais un commentaire honnête s'impose — le fichier source dit lui-même que ce sont des projections pré-lancement, pas de vrais clients. Je le sentirais en lisant. "Premiers utilisateurs" dans le titre de section sonne faux quand on est à l'étape de lancement.

**P0 — Témoignages pré-lancement non signalés clairement.** Le titre "Ce que nos premiers utilisateurs en pensent" avec des métriques précises (6 appels vs 1 en un mois) sur des projections inventées, c'est un problème de crédibilité. Un lecteur méfiant va googler "Audrey M., Mandataire IAD Angers" et ne trouvera rien. Soit remplacer par "Résultats attendus" avec mention "basé sur des simulations", soit attendre d'avoir de vrais témoignages.

Le pricing est clair. 150€/mois avec le calcul "un mandat rembourse l'année entière" — c'est exactement le raisonnement que je fais. La comparaison 500-800€ freelance / 250-300€ outil / 150€ ImmoCrew est bien construite. La mention TTC est importante, je l'ai vue.

La FAQ est excellente. 12 questions, dont celle qui me préoccupait le plus : "Mon réseau me donne déjà des templates." La réponse sur l'uniforme vs le costume sur mesure est parfaite — c'est exactement ce que je ressens avec les templates IAD.

Le CTA final est sobre et efficace. "Tu n'as pas choisi l'immobilier pour faire du marketing. On s'en occupe. 150€, sans engagement." Pas d'exagération. Je clique.

**P1 — L'aperçu dashboard dans HowItWorks est trop vague.** "Publie 3 posts cette semaine" sans dire sur quel réseau, à quelle heure, et sans lien vers le contenu — c'est une todo liste, pas une stratégie. La promesse est "ton plan du mois personnalisé" mais l'exemple montre un plan générique. À enrichir ou à remplacer par un exemple plus spécifique.

---

### 2. Blog — Lecture d'un article

**Score : 8/10**

Le titre de la section blog — "Le marketing immobilier, sans les prises de tête. Des conseils concrets écrits pour les mandataires — pas pour les agences de com'." Je suis dedans immédiatement.

La structure d'un article est propre : fil d'Ariane, catégorie, temps de lecture, titre, description, contenu. Sur mobile, ça devrait bien passer — tout est en colonne, max-w-3xl.

Les boutons de partage (LinkedIn, Facebook, Twitter) sont sobres mais utiles. Je partage parfois des articles intéressants à des collègues.

Le CTA en bas de l'article — "Tu veux que ton marketing soit fait pour toi ?" avec le prix et le bouton — est bien positionné. Je viens de lire quelque chose d'utile, je suis dans l'état d'esprit pour agir.

**P2 — Le CTA du bas de la page blog** ("Découvrir ImmoCrew") renvoie vers la racine `/` sans ancre. Un lecteur qui clique depuis le blog atterrit en haut de la landing et doit rescroller jusqu'au pricing. Renvoyer vers `/#pricing` ou `/#avant-apres` serait plus direct.

---

### 3. Page mandataire — Ma future vitrine

**Score : 8/10**

La HeroSection est pro : photo ou initiales, nom, badge réseau, ville, bio courte, stats (années d'expérience et transactions/an), boutons Appeler et Me contacter. Sur mobile, ça tient.

Ce qui me rendrait fière : le badge "Mandataire IAD" visible dès le hero, mes stats affichées en gros, et les boutons de contact directement accessibles. Je partagerais ce lien à des prospects sans gêne.

Ce qui me gêne : la section "Qui suis-je" répète les stats d'expérience et transactions déjà affichées dans le hero. Deux fois au même endroit, c'est inutile.

**P1 — Doublon stats hero / QuiSuisJe.** Les chiffres d'expérience et transactions/an apparaissent dans HeroSection (lignes 101-119) ET dans QuiSuisJeSection (lignes 173+). À supprimer dans l'une des deux sections.

La section biens, la section blog, les témoignages, le formulaire de contact — tout est là. L'ordre est logique : je me présente, je montre mes biens, je partage mes articles, je rassure avec des avis, je donne mes contacts.

---

### 4. Page bien publique

**Score : 7,5/10**

Le header du bien est sobre et efficace : type, pièces, surface, titre storytelling, prix en orange, bouton imprimer. La hiérarchie d'information est juste.

L'annonce longue en storytelling — si c'est du même niveau que les exemples BeforeAfter — c'est ce qui différencie vraiment cette page d'une fiche SeLoger standard.

DVF, DPE, carte — ces données sont utiles pour un acheteur sérieux. Je les consulte moi-même sur d'autres sites. Bien d'avoir ça intégré.

**P0 — Le bouton "Télécharger en PDF" (PrintButton) est visible mais sa destination n'est pas claire.** Dans le code, c'est un `<PrintButton />` — s'il déclenche juste `window.print()`, l'acheteur imprime une page web non optimisée. Si c'est un vrai PDF généré, c'est bien. À vérifier que la mise en page imprimée est propre et professionnelle — c'est ce qu'un acheteur va montrer à son banquier ou à ses parents.

**P2 — Titre "Decouvrir ce bien"** (ligne 107 sans accent) — c'est un défaut d'encodage UTF-8. Doit être "Découvrir ce bien".

---

### 5. Annonce partageable

**Score : 8,5/10**

C'est la page que j'enverrais par WhatsApp ou SMS à un acheteur potentiel après une première conversation. Elle est propre.

Le header branded avec "Annonce immobilière" en orange et le nom du bien en grand, c'est professionnel. Les boutons Appeler et Envoyer un email sont en haut, visibles tout de suite — exactement là où un acheteur mobile va regarder.

La grille photos avec la grande photo en position 0 fonctionne bien — c'est le même principe que Leboncoin. Et le message "Photos disponibles sur demande" si pas de photos, c'est honnête et actionnable.

Le footer avec "Annonce générée par ImmoCrew" est discret mais présent — bonne pub indirecte pour moi si l'acheteur le remarque.

Ce qui me manque : pas de section "Contact en bas de page" après le contenu de l'annonce. L'acheteur lit tout, arrive en bas, et... doit rescroller pour trouver les boutons de contact en haut. Sur mobile, c'est pénible.

**P1 — Absence de CTA contact en bas de l'annonce partageable.** Après la lecture de l'annonce complète, il faut un second point de contact (téléphone + email) en bas de page, sans obliger à remonter.

---

### 6. Pages légales

**Score : 8/10**

Les CGV, la confidentialité, à-propos — elles existent, elles sont structurées, elles ont une date de mise à jour. C'est le minimum professionnel. Ça rassure un client qui vérifie avant de payer.

**P2 — Vérifier les accents dans le code des pages légales.** Sur la page bien publique j'ai vu "Decouvrir" et "pièces" côté display qui peut masquer des problèmes. À auditer avec un grep sur les entités HTML dans les pages légales si elles sont rédigées en dur.

---

### Tableau récap

| Section | Clarté | Utilité terrain | Faisabilité | Ton | Score |
|---------|--------|-----------------|-------------|-----|-------|
| Landing — Hero | Limpide | Ça m'aide vraiment | Facile | On se comprend | 9/10 |
| Landing — Problème | Limpide | Ça m'aide vraiment | — | On se comprend | 9/10 |
| Landing — HowItWorks | Limpide | Bof (exemple trop vague) | Facile | On se comprend | 7/10 |
| Landing — Before/After | Limpide | Ça m'aide vraiment | — | On se comprend | 9/10 |
| Landing — Témoignages | Flou (crédibilité) | Bof | — | Un peu forcé | 6/10 |
| Landing — Pricing | Limpide | Ça m'aide vraiment | Facile | On se comprend | 9/10 |
| Landing — FAQ | Limpide | Ça m'aide vraiment | — | On se comprend | 9/10 |
| Blog index | Limpide | Ça m'aide vraiment | Facile | On se comprend | 8/10 |
| Article blog | Limpide | Ça m'aide vraiment | — | On se comprend | 8/10 |
| Page mandataire | Limpide | Ça m'aide vraiment | — | On se comprend | 8/10 |
| Page bien | Limpide | Ça m'aide vraiment | — | On se comprend | 7,5/10 |
| Annonce partageable | Limpide | Ça m'aide vraiment | Facile | On se comprend | 8,5/10 |
| Pages légales | Limpide | Facile | — | Correct | 8/10 |

---

### Synthèse P0 / P1 / P2

**P0 — Bloquants avant lancement**
- Témoignages pré-lancement présentés comme vrais (SocialProof.tsx) — risque crédibilité majeur
- PrintButton sur la page bien : vérifier que le rendu imprimé/PDF est propre et professionnel

**P1 — À corriger rapidement**
- Aperçu dashboard dans HowItWorks trop vague (réseau cible, horaire, lien contenu manquants)
- Doublon stats expérience/transactions dans HeroSection ET QuiSuisJeSection de la page mandataire
- Absence de CTA contact en bas de l'annonce partageable (/annonce/[token])

**P2 — Améliorations souhaitables**
- CTA bas de page blog renvoie vers `/` au lieu de `/#pricing`
- "Decouvrir ce bien" sans accent sur la page bien (ligne 107 de bien/[id]/page.tsx)
- Audit encodage UTF-8 sur pages légales

---

### Ma réaction honnête

C'est le premier site qui me parle vraiment comme une mandataire, pas comme une "professionnelle de l'immobilier" ou un "consultant freelance". Le hero avec le post sur La Doutre, Angers — j'ai cru que quelqu'un avait écrit ça pour moi spécifiquement. La FAQ avec la question sur les templates réseau — c'est la conversation que j'ai dans ma tête depuis 2 ans.

Les témoignages, c'est le seul truc qui m'a freiné. Je les ai lus et j'ai pensé : "Audrey M., mandataire IAD Angers, c'est bizarre que je ne la connaisse pas." Je suis dans ce réseau, je connais des gens. Ça sent la projection. C'est le seul moment où j'ai douté. À corriger avant de lancer.

Le reste : je paierais 150€/mois pour ce service. La comparaison avec mon temps passé sur Canva, le calcul "un mandat de plus rembourse l'année" — c'est exactement comme ça que je raisonne. La page mandataire, je la partagerais à mes clients et à mon manager de secteur sans honte. L'annonce partageable est plus pro que ce que me fournit mon extranet IAD aujourd'hui.

---

**Handoff**
- Fichier produit : `/docs/reviews/sophie-audit-landing-blog.md`
- Verdict global : **FONCE** (sous réserve correction des 2 P0)
- P0 prioritaires : témoignages fictifs à traiter dans `src/components/landing/SocialProof.tsx` + vérification rendu impression `PrintButton`
- P1 : `src/components/landing/HowItWorks.tsx` (détailler l'exemple dashboard), `src/components/agent/AgentPageSections.tsx` (supprimer doublon stats), `src/app/annonce/[token]/page.tsx` (ajouter contact bas de page)
- Corriger les P0 et resoumettre pour validation finale si les témoignages restent en l'état
