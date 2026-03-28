# Audit Copy Complet — ImmoCrew
> @copywriter — 2026-03-28
> Référence : docs/copy/brand-voice.md + project-context.md
> Scope : 10 fichiers — Biens, Dashboard, Admin, Onboarding

---

## Tableau récapitulatif

| Fichier | Registre tu/vous | Mots interdits | Micro-copy états | CTA | UTF-8 | Note /10 |
|---|---|---|---|---|---|---|
| BienForm.tsx | OK | OK | OK | OK | OK | 9/10 |
| PhotoUploader.tsx | OK | OK | OK | OK | OK | 9/10 |
| AnnonceBlock.tsx | OK | 1 problème (livrable indirect) | OK | OK | OK | 8.5/10 |
| BienCard.tsx | OK | OK | OK | OK | OK | 9.5/10 |
| MesBiensSection.tsx | OK | OK | OK | 1 amélioration | OK | 9/10 |
| DashboardContent.tsx | OK | 3 occurrences "livrable" (aria-label) | Bonne couverture | OK | 2 bugs UTF-8 | 7.5/10 |
| DeliverableCard.tsx | OK | 1 occurrence "livrable" aria-label | Couverture complète | OK | 3 bugs UTF-8 P0 | 7/10 |
| admin/page.tsx | OK (admin interne) | 1 occurrence "livrable" (admin) | Partial | OK | 0 bug | 8/10 |
| admin/clients/[id]/page.tsx | OK (admin interne) | 4 occurrences "livrable" (admin) | Partial | OK | 1 bug UTF-8 | 7.5/10 |
| onboarding/page.tsx | OK | 2 occurrences "livrables" | Partiel | 1 CTA faible | 4 bugs UTF-8 P0 | 7/10 |

**Score global : 8.1/10**

---

## Problèmes classés P0 (bloquants — visibles utilisateur)

### P0-1 — DeliverableCard.tsx:219 — \u escape UTF-8 dans string JS (RÈGLE GLOBALE N°13)
```
// ACTUEL (INTERDIT)
Copi{"\u00e9"} — colle-le !

// CORRIGÉ
Copié — colle-le !
```

### P0-2 — DeliverableCard.tsx:279 — \u escape UTF-8 dans string JS
```
// ACTUEL (INTERDIT)
R{"\u00e9"}essayer

// CORRIGÉ
Réessayer
```

### P0-3 — DeliverableCard.tsx:350 — \u escapes multiples dans aide contextuelle
```
// ACTUEL (INTERDIT)
"Apr\u00e8s avoir copi\u00e9 \u2192 ouvre ton appli et colle le texte"

// CORRIGÉ
"Après avoir copié → ouvre ton appli et colle le texte"
```

### P0-4 — onboarding/page.tsx:593-594 — entités HTML dans JSX (semi-acceptable mais incohérent)
```
// ACTUEL
Ton &eacute;quipe se met au travail. Tu recevras tes premiers livrables sous 24h.

// CORRIGÉ (+ mot interdit "livrables" → remplacer)
Ton équipe se met au travail. Tes premiers contenus arrivent sous 24h.
```

### P0-5 — onboarding/page.tsx:592-594 — C&apos;est + &eacute; — entités HTML dans JSX
```
// ACTUEL
<h1>C&apos;est tout bon !</h1>
<p>On a tout ce qu&apos;il nous faut. Ton &eacute;quipe se met au travail.
Tu recevras tes premiers livrables sous 24h.</p>

// CORRIGÉ
<h1>{"C'est tout bon !"}</h1>
<p>{"On a tout ce qu'il nous faut. Ton équipe se met au travail. Tes premiers contenus arrivent sous 24h."}</p>
```

---

## Problèmes classés P1 (importants — brand voice, UX, crédibilité)

---

## GROUPE 1 — Biens (5 fichiers)

### BienForm.tsx — Note 9/10

**Registre** : Tutoiement uniforme. OK.

**Mots interdits** : Aucun. OK.

**UTF-8** : Pas de \u escapes dans les strings visibles. OK.

**Micro-copy — ce qui fonctionne bien**
- Erreurs de validation : "Choisis un type de bien", "L'adresse est obligatoire", "Le prix doit être supérieur à 0 €" — ton direct, sans formule corporative.
- Erreur de soumission : "Impossible de créer le bien. Réessaie dans quelques secondes." — bon niveau.
- Helper textarea : "Ces détails rendront ton annonce beaucoup plus percutante" — ton complice, concret.
- Placeholder description : "Toute info supplémentaire qui pourrait enrichir l'annonce : contexte du quartier, travaux récents, vue, luminosité..." — excellent, très dans le ton ImmoCrew.
- CTA submit : "Créer mon bien" — verbe d'action, 1re personne. OK.
- Loading CTA : "Création en cours..." — acceptable.

**1 amélioration P1**
- L100 : placeholder `points_forts` → "Parquet chêne, double exposition, cave, gardien, balcon 8m²..." — bon, mais on peut rendre encore plus vendeur.

  ```
  // ACTUEL
  placeholder="Parquet chêne, double exposition, cave, gardien, balcon 8m²..."

  // SUGGESTION (P1 — amélioration, pas correction obligatoire)
  placeholder="Parquet chêne, balcon plein sud 8m², cave, gardien — ce qui fait craquer les acheteurs"
  ```

**Verdict** : fichier très propre. Un seul point d'amélioration cosmétique.

---

### PhotoUploader.tsx — Note 9/10

**Registre** : Tutoiement uniforme. OK.

**Mots interdits** : Aucun. OK.

**UTF-8** : OK.

**Micro-copy — ce qui fonctionne**
- Zone drag-and-drop aria-label : "Glisse tes photos ici ou clique pour sélectionner" — parfait.
- Légende technique : "JPG, PNG ou WebP — max 5 Mo par photo" — clair, sans jargon.
- Erreur format : "Format non supporté. Utilise JPG, PNG ou WebP." — direct.
- Erreur taille : "Cette photo dépasse 5 Mo — réduis sa taille avant upload." — le mot "upload" est technique.
- Limite : "Maximum 10 photos par bien" — OK.
- Suppression impossible : "Impossible de supprimer cette photo. Réessaie." — bon.
- Erreur réseau : "Erreur réseau. Réessaie." — un peu froid.

**1 correction P1 (mot technique visible)**
- L176 : "Cette photo dépasse 5 Mo — réduis sa taille avant upload."

  ```
  // ACTUEL
  error: "Cette photo dépasse 5 Mo — réduis sa taille avant upload.",

  // CORRIGÉ
  error: "Cette photo dépasse 5 Mo — réduis-la avant de l'envoyer.",
  ```

**1 amélioration P1 (erreur réseau trop froide)**
- L225 : `setGlobalError("Erreur réseau. Réessaie.")`

  ```
  // ACTUEL
  setGlobalError("Erreur réseau. Réessaie.")

  // SUGGESTION
  setGlobalError("Problème de connexion. Réessaie dans quelques secondes.")
  ```

**Verdict** : très propre. 1 seul mot technique à corriger ("upload" → ligne 176).

---

### AnnonceBlock.tsx — Note 8.5/10

**Registre** : Tutoiement uniforme. OK.

**Mots interdits** : Le mot "livrable" n'apparaît pas. OK. Mais "Générer" est un verbe tech — acceptable ici car dans l'interface, pas en marketing.

**UTF-8** : OK.

**Micro-copy — états couverts (5/5)**
1. **Pas de photos** : "Ajoute au moins une photo pour générer ton annonce" + bouton désactivé — bon.
2. **Loading** : "Rédaction en cours... (30 secondes)" — le timing explicite est excellent pour la patience UX.
3. **Erreur** : message d'erreur dynamique + bouton "Réessayer" — bon.
4. **Défaut (photos présentes)** : "Tes photos sont prêtes. Génère ton annonce en un clic — on s'occupe du texte." — excellent ton complice.
5. **Succès** : copie avec confirmation "Copié — colle-le !" — parfait.

**1 correction P1 (modal confirmation trop froide)**
- L274 : "Écraser l'annonce existante ? Cette action est irréversible."

  ```
  // ACTUEL
  "Écraser l'annonce existante ? Cette action est irréversible."

  // CORRIGÉ — même info, ton moins juridique
  "Tu vas remplacer l'annonce existante. Impossible de revenir en arrière."
  ```

**1 amélioration P1 (CTA de confirmation modal)**
- L282 : "Oui, régénérer" → manque de personnalité

  ```
  // ACTUEL
  "Oui, régénérer"

  // SUGGESTION
  "Oui, réécrire l'annonce"
  ```

**Verdict** : très bon fichier. Le loading copy avec le timing "30 secondes" est une excellente pratique à garder.

---

### BienCard.tsx — Note 9.5/10

**Registre** : Tutoiement. OK. (labels courts — peu de texte d'interface).

**Mots interdits** : Aucun. OK.

**UTF-8** : OK.

**Badges statut** — tous pertinents :
- "Brouillon" / "Publié" / "Archivé" — vocab standard immobilier. OK.

**CTA**
- "Modifier" — verbe d'action, court. OK.
- "Voir la page" — OK.

**État vide** : géré dans MesBiensSection (voir ci-dessous). Pas de texte d'état vide dans BienCard elle-même — normal (c'est une card).

**Petit point** : L57 — l'alt de l'image sans photo utilise le titre ou `${bien.type_bien} — ${bien.adresse}` — correct côté accessibilité.

**Verdict** : le fichier le plus propre du scope. Rien à corriger.

---

### MesBiensSection.tsx — Note 9/10

**Registre** : Tutoiement uniforme. OK.

**Mots interdits** : Aucun. OK.

**UTF-8** : OK.

**États couverts (4/4)**
1. **Loading** : skeleton animé sans texte — acceptable (pas besoin de copy ici).
2. **Erreur** : message dynamique de l'API. Correct.
3. **Vide** : "Tu n'as pas encore ajouté de bien" + CTA "Ajouter mon premier bien" — bon.
4. **Liste** : grille de BienCard + bouton "Ajouter un bien".

**1 amélioration P1 (état vide — plus engageant)**
- L110 : "Tu n'as pas encore ajouté de bien"

  ```
  // ACTUEL
  "Tu n'as pas encore ajouté de bien"

  // SUGGESTION — plus motivant
  "Ton premier bien = ta première annonce personnalisée"
  ```

**1 amélioration P1 (état erreur — manque de récupération)**
- L19 : `throw new Error("Impossible de charger tes biens")` → l'erreur s'affiche sans CTA de retry.

  ```
  // SUGGESTION — ajouter sous le message d'erreur
  <button onClick={() => window.location.reload()} className="...">
    Réessayer
  </button>
  ```
  Note pour @fullstack : ajouter un bouton "Réessayer" dans l'état erreur de MesBiensSection.

**Verdict** : bon fichier. L'état vide peut être plus convaincant mais est fonctionnel.

---

## GROUPE 2 — Dashboard (2 fichiers)

### DashboardContent.tsx — Note 7.5/10

**Registre** : Tutoiement uniforme. OK. Quelques passages très bien : "Copie, colle, publie. Ton équipe a fait le reste." (L524) — parfait.

**Mots interdits — 3 occurrences**

1. L159 — aria-label "Livrable : ${title}" (dans DeliverableCard, mais l'attribut est défini là). Accessible uniquement aux lecteurs d'écran, pas visible — P1 modéré.
2. Le mot "livrable" n'apparaît pas en texte visible dans DashboardContent.tsx directement. OK.

**UTF-8 — 2 bugs**

1. L257 : `{"×"}` — le × (U+00D7) dans un JSX string avec échappement inutile. Pas un \u escape, mais incohérent avec le reste. Mineur.
2. L286 : `{"×"}` — même chose pour le bouton fermer du welcome banner.

Note : les C{"'"} et similaires (L275, etc.) sont une méthode correcte pour échapper les apostrophes dans JSX — pas des bugs UTF-8, c'est la convention React correcte.

**Analyse des textes visible — ce qui est bien**

- Empty state (L252-259) : "Bienvenue dans ton espace !" + "Ton équipe est au travail. Tes premiers contenus arrivent sous 24h." + "On t'envoie un email dès que c'est prêt." — excellent, ton complice, IA invisible, concret.
- Welcome banner (L273-287) : "Comment utiliser ton espace" + "Clique sur une carte pour voir le contenu, puis Copier pour le coller dans ton appli. C'est tout." — parfait. C'est tout = simplicité revendiquée.
- Plan du mois (L344-396) : section très bien écrite. Le "Salut {firstName} — ton plan du mois" est dans le ton. Les recommandations concrètes (lundi, mercredi, vendredi à 18h) sont dans l'esprit "concret avant tout".
- Footer : "Gérer mon abonnement (modifier, résilier)" — transparent, sans euphémisme.

**3 corrections P1**

**P1-1 — L332** : "Modifier mes infos (par email — sous 4h)" — le lien mailto pour modifier ses infos est acceptable mais crée une attente de réponse. Note : c'est une décision fonctionnelle, pas uniquement copy. Copy : le label est clair.

**P1-2 — L347 + L362** : "spécialisée {profile.type_biens}" — le genre féminin est hardcodé (spécialisée). Si le profil a un homme, ça ne match pas.

  ```
  // ACTUEL (L347)
  "On te connaît : mandataire {profile.reseau || ""} à {profile.ville || "ta zone"}, spécialisée {profile.type_biens || "immobilier"}."

  // CORRIGÉ — neutre
  "On te connaît : mandataire {profile.reseau || ""} à {profile.ville || "ta zone"}, spécialisé(e) en {profile.type_biens || "immobilier"}."
  ```
  Note pour @fullstack : idéalement récupérer le genre depuis le profil (champ civilite ou prenom heuristique). À défaut, neutraliser en "spécialisé(e)".

**P1-3 — L410** : CTA "S'abonner →" dans le bandeau "Passer au mensuel" — le verbe "s'abonner" est dans la liste des verbes à éviter (froid, administratif).

  ```
  // ACTUEL
  "S{"'"}abonner →"

  // CORRIGÉ — dans le guide CTA, "Commencer" est le verbe pour l'achat
  "Commencer le mensuel →"
  ```

**1 correction P1 — Annonces dans DashboardContent (L509)**

- L509 : "+ Ajouter un bien / Commander un Boost Mandat (100€)" — le "/" crée une ambiguïté. Deux CTA différents en un seul lien.

  ```
  // ACTUEL
  "+ Ajouter un bien / Commander un Boost Mandat (100€)"

  // SUGGESTION — séparer les actions
  "+ Ajouter un bien ou booster un mandat existant (100€)"
  ```

**1 amélioration cosmétique (P2)**

- L463 : état vide section biens : "+ Ajouter un bien pour recevoir tes annonces personnalisées" — très bon. Bénéfice explicite. Garder tel quel.

**Verdict** : dashboard très bien rédigé dans l'ensemble. Les problèmes sont ciblés : genre hardcodé (impacte la crédibilité avec les profils masculins), CTA abonnement à corriger, et 2 bugs UTF-8 mineurs.

---

### DeliverableCard.tsx — Note 7/10

**Registre** : Tutoiement uniforme. OK.

**Mots interdits — 1 occurrence visible (P1)**
- L159 : `aria-label={\`Livrable : ${title}\`}` — "Livrable" dans un aria-label est visible par les lecteurs d'écran. Les utilisateurs ayant des besoins d'accessibilité entendent "Livrable : [titre]".

  ```
  // ACTUEL
  aria-label={`Livrable : ${title}`}

  // CORRIGÉ
  aria-label={`Contenu : ${title}`}
  ```

**UTF-8 — 3 bugs P0 (déjà listés en tête de document)**

1. L219 : `Copi{"\u00e9"} — colle-le !` → `Copié — colle-le !`
2. L279 : `R{"\u00e9"}essayer` → `Réessayer`
3. L350 : `"Apr\u00e8s avoir copi\u00e9 \u2192 ouvre ton appli et colle le texte"` → `"Après avoir copié → ouvre ton appli et colle le texte"`

Ces trois bugs produisent du texte illisible ou des caractères étranges selon le contexte de rendu. P0 absolu.

**Micro-copy — états couverts (5/5)**
1. **Default** : preview 2 lignes — fonctionnel.
2. **Loading contenu** : "On charge ton contenu..." — ton complice, bon.
3. **Loading copie** : "Chargement..." — correct.
4. **Erreur** : "Oups, il y a eu un souci. Réessayer" — bon ton.
5. **Draft (en préparation)** : "En cours de rédaction — disponible sous 24h" — excellent. Promesse précise.

**Analyse du badge "En préparation" (L177)**
- "En préparation" pour le statut `draft` — bon choix. Évite "Brouillon" qui serait trop technique, et "En attente" qui serait passif.

**Aide contextuelle (L349-360)**
- "Après avoir copié → ouvre ton appli et colle le texte" — excellent micro-copy une fois les \u escapes corrigés.
- "Signaler un souci" — CTA doux, bien positionné.

**Aria-label copie (L191-192)**
```
aria-label={copied ? "Contenu copié" : loadingCopy ? "Chargement en cours" : `Copier le texte : ${title}`}
```
- "Contenu copié" — manque le complément d'action pour l'accessibilité.

  ```
  // SUGGESTION
  aria-label={copied ? "Copié — tu peux coller" : loadingCopy ? "Chargement en cours" : `Copier ${title}`}
  ```

**Verdict** : les 3 bugs UTF-8 P0 sont le principal problème. Une fois corrigés et l'aria-label "Livrable" mis à jour, le fichier passe à 9/10. Le micro-copy est par ailleurs très bien calibré.

---

## GROUPE 3 — Admin (2 fichiers)

> Note préalable : les pages admin ne sont pas des pages client-facing. Le ton y est donc différent — plus technique, plus dense. Les règles brand voice s'appliquent pour la cohérence globale mais les critères sont moins stricts que pour le dashboard. Les mots "livrable", "statut", "production" sont acceptables en admin car c'est de la terminologie opérationnelle interne.

### admin/page.tsx — Note 8/10

**Registre** : Page admin — pas de tutoiement requis. Textes très courts (labels de tableau). OK.

**Mots interdits** : Dans un contexte admin, "livrable" est acceptable (terminologie opérationnelle). Pas d'occurrence visible de mots interdits client-facing.

**UTF-8** : OK. Pas de \u escapes.

**Labels tableau**
- "Client" / "Pack" / "Statut" / "Date" / "Actions" — standard. OK.
- "Total clients" / "Actifs" / "Mensuels" / "Lancements" — clairs pour l'admin.

**État vide liste clients (L103)**
- "Aucun client pour le moment." — neutre, acceptable pour l'admin.

**Badge statut (non traduits) — P1**
- L158 : `{client.status || "pending"}` — les statuts s'affichent en anglais brut ("active", "inactive", "churned", "pending"). En admin, c'est acceptable fonctionnellement, mais un minimum de français améliore la lisibilité.

  ```
  // ACTUEL
  {client.status || "pending"}

  // SUGGESTION (P1 — cosmétique admin)
  const STATUS_LABELS: Record<string, string> = {
    active: "Actif",
    inactive: "Inactif",
    churned: "Résilié",
    pending: "En attente",
  }
  {STATUS_LABELS[client.status || "pending"] || client.status}
  ```

**Pack non traduit — P1 mineur**
- L147 : `{client.pack || "—"}` avec `capitalize` — "mensuel" → "Mensuel", "lancement" → "Lancement". Acceptable en l'état.

**Texte "Clients" (h1, L97)** : titre de section minimal. OK pour l'admin.

**Verdict** : page admin correcte. Le seul point notable est l'affichage des statuts en anglais (fonctionnel mais à améliorer).

---

### admin/clients/[id]/page.tsx — Note 7.5/10

**Registre** : Admin interne. OK.

**Mots interdits — 4 occurrences (contexte admin, donc P1 modéré)**
1. L169 : `Livrables ({deliverableList.length})` — en h2 visible dans l'admin.
2. L173 : `"Aucun livrable genere pour ce client."` — texte admin visible.
3. L168 : `"Production IA"` en h2 — le mot "IA" est visible en admin (acceptable en interne).

Règle : en admin, le mot "livrable" est terminologie opérationnelle. Mais pour cohérence, si l'admin est parfois montré au client (screenshots, partage), homogénéiser.

**UTF-8 — 1 bug (P1)**
- L173 : `"Aucun livrable genere pour ce client."` — "genere" sans accent. Bug de saisie, pas d'entité HTML.

  ```
  // ACTUEL
  "Aucun livrable genere pour ce client."

  // CORRIGÉ
  "Aucun contenu généré pour ce client."
  ```
  (Double correction : accent ET remplacement de "livrable" → "contenu")

**UTF-8 — 1 bug (P1)**
- L212 : `"Aucun paiement enregistre."` — "enregistre" sans accent.

  ```
  // ACTUEL
  "Aucun paiement enregistre."

  // CORRIGÉ
  "Aucun paiement enregistré."
  ```

**UTF-8 — entités HTML dans JSX**
- L186 : `{d.type} &middot; {d.month}` — l'entité `&middot;` dans du JSX dynamique. Acceptable techniquement (JSX supporte les entités HTML), mais incohérent avec le reste du code.

  ```
  // SUGGESTION (cosmétique)
  {d.type} · {d.month}
  // ou
  {d.type}{" · "}{d.month}
  ```

- L240 : `{payment.amount}&euro;` — entité `&euro;` dans JSX. Même remarque.

  ```
  // SUGGESTION
  {payment.amount} €
  ```

**Statuts affichés en anglais (P1)**
- L196-199 : le badge de statut affiche `d.status` ("delivered", "draft") en anglais brut pour les livrables.

  ```
  // ACTUEL
  {d.status}

  // SUGGESTION
  {d.status === "delivered" ? "Livré" : "En préparation"}
  ```

**Label "Stripe ID" et "ID interne" (L139-149)**
- Affichage brut des IDs techniques. Acceptable en admin (usage opérationnel). Pas de correctif nécessaire.

**Section "Production IA" (L159-163)**
- Le titre "Production IA" est fonctionnel pour l'admin. Le mot "IA" est acceptable en interne. Laisser tel quel.

**Verdict** : les bugs d'accents manquants ("genere", "enregistre") sont les corrections prioritaires. Les entités HTML dans JSX sont à harmoniser. Les statuts en anglais gagneraient à être traduits pour une interface admin plus professionnelle.

---

## GROUPE 4 — Onboarding (1 fichier)

### onboarding/page.tsx — Note 7/10

**Registre** : Tutoiement uniforme sur tout le wizard. OK.

**Mots interdits — 2 occurrences visibles**

1. L33 : `subtitle: "Facultatif — mais ça rend tes livrables beaucoup plus personnels"` — "livrables" visible dans le sous-titre de l'étape "Ton profil".

   ```
   // ACTUEL
   subtitle: "Facultatif — mais ça rend tes livrables beaucoup plus personnels"

   // CORRIGÉ
   subtitle: "Facultatif — mais ça rend tes contenus beaucoup plus personnels"
   ```

2. L594 (onboarding complet) : `Tu recevras tes premiers livrables sous 24h.` — dans l'écran de confirmation visible par le client.

   ```
   // ACTUEL
   Ton &eacute;quipe se met au travail. Tu recevras tes premiers livrables sous 24h.

   // CORRIGÉ (+ fix UTF-8 entité HTML)
   {"Ton équipe se met au travail. Tes premiers contenus arrivent sous 24h."}
   ```

**UTF-8 — 4 bugs (P0 et P1)**

1. L591 : `C&apos;est tout bon !` — entité HTML `&apos;` dans JSX. À remplacer.

   ```
   // ACTUEL
   C&apos;est tout bon !

   // CORRIGÉ
   {"C'est tout bon !"}
   ```

2. L593 : `On a tout ce qu&apos;il nous faut.` — même problème.

   ```
   // CORRIGÉ
   {"On a tout ce qu'il nous faut."}
   ```

3. L593-594 : `Ton &eacute;quipe...tes premiers livrables` — entité HTML `&eacute;`. Voir correction ci-dessus.

4. L590 : le `<h1>` utilise `C&apos;est` et le paragraphe suivant `&eacute;` et `&apos;` — les deux doivent être corrigés ensemble pour cohérence.

**Correction groupée onboarding page isComplete (L561-606) — à faire en une seule passe**
```tsx
// ACTUEL
<h1 className="font-display text-h1 text-primary mb-4">
  C&apos;est tout bon !
</h1>
<p className="text-body text-neutral-600 mb-8">
  On a tout ce qu&apos;il nous faut. Ton &eacute;quipe se met au travail.
  Tu recevras tes premiers livrables sous 24h.
</p>
<a href="/dashboard" ...>
  Voir mon espace client
</a>

// CORRIGÉ
<h1 className="font-display text-h1 text-primary mb-4">
  {"C'est tout bon !"}
</h1>
<p className="text-body text-neutral-600 mb-8">
  {"On a tout ce qu'il nous faut. Ton équipe se met au travail. Tes premiers contenus arrivent sous 24h."}
</p>
<a href="/dashboard" ...>
  Voir mon espace client
</a>
```

**Labels de champs — analyse**

Ce qui fonctionne très bien :
- `ton_communication` (L142-148) : "Comment tu parles à tes clients — donne un exemple de phrase que tu utilises souvent" + placeholder très concret et réaliste. Excellent.
- `ce_qui_te_differencie` (L155-161) : "Ce que tes clients disent de toi que les autres mandataires n'ont pas" — formulation puissante qui pousse à réfléchir.
- Placeholder `bio_personnelle` (L170) : "Avant l'immobilier, j'étais dans la restauration..." — storytelling dans l'exemple, parfait.
- `valeurs` (L149-153) : placeholder concret avec exemples réels.

**1 correction P1 — label "reseau" sans accent**
- L103 : `label: "Ton reseau"` — "reseau" sans accent. Visible dans le wizard.

  ```
  // ACTUEL
  label: "Ton reseau",

  // CORRIGÉ
  label: "Ton réseau",
  ```

**Placeholders sans accents (P1)**
Plusieurs placeholders manquent d'accents — visible si le placeholder s'affiche :

- L139 : `"Primo-accedants, familles, investisseurs..."` → `"Primo-accédants, familles, investisseurs..."`
- L186 (select) : `"Je n'ai jamais fait de video — ca me stresse"` → `"Je n'ai jamais fait de vidéo — ça me stresse"`
- L190 : `"J'ai deja fait quelques videos, ca va"` → `"J'ai déjà fait quelques vidéos, ça va"`
- L824 (points_forts bien) : `"Vue Loire, parquet chene, cave voutee, 5 min tramway"` → `"Vue Loire, parquet chêne, cave voûtée, 5 min tramway"`

Ces placeholders sont visibles par l'utilisateur quand les champs sont vides. Les fautes d'accent nuisent à la crédibilité.

**1 correction P1 — CTA final trop neutre**
- L1011 : `"Terminer"` pour le bouton de soumission final — trop administratif.

  ```
  // ACTUEL
  {isSubmitting ? "Envoi..." : "Terminer"}

  // CORRIGÉ — CTA plus motivant, dans le ton ImmoCrew
  {isSubmitting ? "Envoi en cours..." : "Envoyer mon profil"}
  ```
  Alternative possible : "C'est parti !" (plus émotionnel) ou "Lancer mon espace" (plus orienté résultat).

**Validation error (L449)**
- `"Merci de remplir tous les champs avant de continuer."` — "Merci de" est une formule polie mais légèrement passive.

  ```
  // ACTUEL
  "Merci de remplir tous les champs avant de continuer."

  // SUGGESTION
  "Remplis tous les champs pour continuer."
  ```

**Photo upload — alertes natives (P1)**
- L365 : `alert("La photo dépasse 5 Mo. Choisis une image plus légère.")` — utilise une `alert()` native du navigateur. Fonctionnel mais casse l'expérience visuelle du wizard.
- L370 : `alert("Format non supporté. Utilise JPG, PNG ou WebP.")` — idem.

  Note pour @fullstack : remplacer ces `alert()` par des messages d'erreur inline (state `photoError` à ajouter). Le copy des messages est déjà bon, juste le vecteur qui est à changer.

**helper photo_profil (L178)**
- `"Ta photo apparaîtra dans tes livrables et ton profil."` — "livrables" en helper visible.

  ```
  // ACTUEL
  helper: "Ta photo apparaîtra dans tes livrables et ton profil.",

  // CORRIGÉ
  helper: "Ta photo personnalise tes contenus et ton profil.",
  ```

**Verdict** : L'onboarding a le plus de corrections à faire — principalement des accents manquants dans les placeholders et les 4 bugs UTF-8 P0 dans l'écran de confirmation. Les labels et exemples sont par ailleurs très bien calibrés sur le persona Sophie.

---

## Corrections P1 classées par priorité d'impact

### Priorité 1 — Bugs visibles utilisateur (UTF-8 + accents)

| # | Fichier | Ligne | Problème | Correction |
|---|---|---|---|---|
| 1 | DeliverableCard.tsx | 219 | `\u00e9` dans string | `Copié — colle-le !` |
| 2 | DeliverableCard.tsx | 279 | `\u00e9` dans string | `Réessayer` |
| 3 | DeliverableCard.tsx | 350 | `\u00e8`, `\u00e9`, `\u2192` dans string | `"Après avoir copié → ouvre ton appli..."` |
| 4 | onboarding/page.tsx | 590-594 | Entités HTML `&apos;`, `&eacute;` + "livrables" | Voir correction groupée Groupe 4 |
| 5 | onboarding/page.tsx | 103 | "Ton reseau" sans accent | `"Ton réseau"` |
| 6 | onboarding/page.tsx | 139 | "Primo-accedants" | `"Primo-accédants"` |
| 7 | onboarding/page.tsx | 186 | "video — ca me stresse" | `"vidéo — ça me stresse"` |
| 8 | onboarding/page.tsx | 190 | "deja fait quelques videos, ca va" | `"déjà fait quelques vidéos, ça va"` |
| 9 | onboarding/page.tsx | 824 | "parquet chene, cave voutee" | `"parquet chêne, cave voûtée"` |
| 10 | admin/clients/[id]/page.tsx | 173 | "Aucun livrable genere" | `"Aucun contenu généré"` |
| 11 | admin/clients/[id]/page.tsx | 212 | "paiement enregistre" | `"paiement enregistré"` |

### Priorité 2 — Mots interdits (brand voice)

| # | Fichier | Ligne | Mot interdit | Correction |
|---|---|---|---|---|
| 1 | onboarding/page.tsx | 33 | "livrables" dans sous-titre | `"contenus"` |
| 2 | onboarding/page.tsx | 178 | "livrables" dans helper photo | `"contenus"` |
| 3 | DeliverableCard.tsx | 159 | "Livrable" dans aria-label | `"Contenu"` |

### Priorité 3 — CTA et ton

| # | Fichier | Ligne | Problème | Correction |
|---|---|---|---|---|
| 1 | DashboardContent.tsx | 410 | CTA "S'abonner" (verbe interdit) | `"Commencer le mensuel →"` |
| 2 | onboarding/page.tsx | 1011 | CTA "Terminer" (trop neutre) | `"Envoyer mon profil"` |
| 3 | AnnonceBlock.tsx | 274 | Ton juridique dans modal | `"Tu vas remplacer l'annonce existante..."` |
| 4 | onboarding/page.tsx | 449 | Validation error passive | `"Remplis tous les champs pour continuer."` |

### Priorité 4 — Genre et personnalisation

| # | Fichier | Ligne | Problème | Correction |
|---|---|---|---|---|
| 1 | DashboardContent.tsx | 347 | "spécialisée" hardcodé féminin | `"spécialisé(e) en"` |

### Priorité 5 — Entités HTML dans JSX (cohérence code)

| # | Fichier | Ligne | Problème | Correction |
|---|---|---|---|---|
| 1 | admin/clients/[id]/page.tsx | 186 | `&middot;` dans JSX | `" · "` |
| 2 | admin/clients/[id]/page.tsx | 240 | `&euro;` dans JSX | `" €"` |

### Améliorations optionnelles (P2 — nice to have)

| # | Fichier | Ligne | Suggestion |
|---|---|---|---|
| 1 | PhotoUploader.tsx | 176 | "avant upload" → "avant de l'envoyer" |
| 2 | PhotoUploader.tsx | 225 | "Erreur réseau. Réessaie." → "Problème de connexion. Réessaie dans quelques secondes." |
| 3 | MesBiensSection.tsx | 110 | "Tu n'as pas encore ajouté de bien" → "Ton premier bien = ta première annonce personnalisée" |
| 4 | AnnonceBlock.tsx | 282 | "Oui, régénérer" → "Oui, réécrire l'annonce" |
| 5 | MesBiensSection.tsx | — | Ajouter bouton "Réessayer" dans l'état erreur (note @fullstack) |
| 6 | onboarding/page.tsx | 365/370 | Remplacer `alert()` natifs par erreurs inline (note @fullstack) |

---

---

## Ce qui est déjà bien — à conserver absolument

Avant de corriger, voici ce que le codebase fait très bien et qu'il ne faut pas toucher :

1. **AnnonceBlock.tsx** — le message loading "Rédaction en cours... (30 secondes)" : donner le timing exact est une excellente pratique UX. Ne pas supprimer.
2. **DashboardContent.tsx** — l'empty state "Ton équipe est au travail. Tes premiers contenus arrivent sous 24h." : IA invisible, ton rassurant, promesse concrète. Modèle à suivre.
3. **DashboardContent.tsx** — le plan du mois avec jours et horaires précis ("lundi, mercredi, vendredi à 18h") : c'est exactement le niveau de concrétude demandé par le brand voice.
4. **DashboardContent.tsx** — "Copie, colle, publie. Ton équipe a fait le reste." : phrase parfaite. Résume le service en 6 mots.
5. **DeliverableCard.tsx** — badge "En préparation" pour les drafts : bien mieux que "Brouillon" ou "draft".
6. **BienForm.tsx** — les placeholders très concrets ("12 rue des Lilas, 69003 Lyon", "Parquet chêne...") : exactement dans le ton du persona Sophie.
7. **onboarding/page.tsx** — les labels `ton_communication` et `ce_qui_te_differencie` : formulations qui forcent la réflexion sans jargon.

---

## Handoff

**Handoff → @fullstack**

- Fichiers produits : `/home/user/Mandataire-Immo/docs/copy/copy-audit-complet.md`

- Corrections P0 à implémenter (bloquantes — affectent l'affichage) :
  1. `src/components/dashboard/DeliverableCard.tsx` L219 : remplacer `Copi{"\u00e9"}` par `Copié`
  2. `src/components/dashboard/DeliverableCard.tsx` L279 : remplacer `R{"\u00e9"}essayer` par `Réessayer`
  3. `src/components/dashboard/DeliverableCard.tsx` L350 : remplacer les 3 escapes `\u` par les vrais caractères UTF-8
  4. `src/app/onboarding/page.tsx` L590-594 : remplacer entités HTML (`&apos;`, `&eacute;`) par JSX strings avec vrais caractères UTF-8 — voir correction groupée Groupe 4

- Corrections P1 à implémenter (importantes) :
  - Onboarding : 5 placeholders avec accents manquants (lignes 103, 139, 186, 190, 824)
  - Onboarding : "livrables" → "contenus" (lignes 33, 178, 594)
  - Admin clients : "genere" → "généré" (L173), "enregistre" → "enregistré" (L212)
  - DashboardContent : "spécialisée" → "spécialisé(e) en" (L347)
  - DashboardContent : CTA "S'abonner" → "Commencer le mensuel" (L410)
  - onboarding : CTA "Terminer" → "Envoyer mon profil" (L1011)
  - DeliverableCard : aria-label "Livrable" → "Contenu" (L159)
  - AnnonceBlock : modal confirmation — ton à adoucir (L274)
  - onboarding : validation error → "Remplis tous les champs pour continuer." (L449)

- Améliorations UX signalées (P2 — optionnel) :
  - Remplacer les 2 `alert()` natifs en onboarding (L365, L370) par des erreurs inline (ajouter `photoError` state)
  - Ajouter un bouton "Réessayer" dans l'état erreur de `MesBiensSection`
  - Harmoniser `&middot;` et `&euro;` dans admin/clients/[id]/page.tsx (L186, L240)

- Formulations non négociables à ne pas modifier :
  - "Rédaction en cours... (30 secondes)" — AnnonceBlock.tsx
  - "Ton équipe est au travail. Tes premiers contenus arrivent sous 24h." — DashboardContent.tsx
  - "Copie, colle, publie. Ton équipe a fait le reste." — DashboardContent.tsx
  - "En cours de rédaction — disponible sous 24h" — DeliverableCard.tsx
  - "Copié — colle-le !" (une fois le bug UTF-8 corrigé) — DeliverableCard.tsx
