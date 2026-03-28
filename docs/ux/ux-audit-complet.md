# UX Audit Complet — ImmoCrew
> Agent : @ux | Date : 2026-03-28 | Persona : Sophie, 38 ans, mandataire IAD

## Tableau récapitulatif par page

| Page | Clarté /10 | Navigation /10 | Mobile /10 | Feedback /10 | A11y /10 | Note globale |
|---|---|---|---|---|---|---|
| Landing Hero | — | — | — | — | — | — |
| AuthModal sign-up | — | — | — | — | — | — |
| Onboarding wizard | — | — | — | — | — | — |
| Dashboard — état vide | — | — | — | — | — | — |
| Dashboard — MesBiensSection | — | — | — | — | — | — |
| Dashboard — DashboardContent | — | — | — | — | — | — |
| /biens/nouveau — BienForm | — | — | — | — | — | — |
| /biens/[id] — BienFicheClient | — | — | — | — | — | — |
| PhotoUploader | — | — | — | — | — | — |
| AnnonceBlock | — | — | — | — | — | — |
| /admin — liste clients | — | — | — | — | — | — |
| /admin — AdminGate login | — | — | — | — | — | — |
| /admin/clients/[id] | — | — | — | — | — | — |
| TriggerProductionButton | — | — | — | — | — | — |

---

## Parcours 1 — Inscription de Sophie

> Simulation : Landing → CTA → AuthModal sign-up → Onboarding 9 étapes → Dashboard

### Cognitive walkthrough — étape par étape

**Étape 1 — Landing Hero (page.tsx / Hero.tsx)**

Q1 : Sophie sait-elle quoi faire ? OUI — le h1 "Tu n'as pas choisi l'immobilier pour passer tes soirées sur Canva." parle directement à son vécu. La promesse est claire.
Q2 : L'action est-elle visible ? OUI — deux CTAs côte à côte : "Voir un exemple concret" (primary) + "Voir les tarifs" (outline). Sur mobile ils passent en stack vertical (flex-col tablet:flex-row).
Q3 : Lien but-action clair ? OUI — les labels sont concrets, pas "En savoir plus".
Q4 : Feedback immédiat ? OUI — ancres vers #avant-apres et #pricing, scroll fluide attendu.

**Friction Hero — P1** : Le CTA principal envoie vers `#avant-apres` (section BeforeAfter), PAS vers l'inscription. Sophie doit encore scroller pour trouver le CTA d'inscription. Le parcours inscription démarre donc tard. Sur mobile avec un écran court, cette section peut être hors viewport sans que Sophie ne voie jamais le CTA d'inscription dans le Hero.

**Étape 2 — Navigation vers l'inscription**

Le Header contient un bouton "S'inscrire" ou "Se connecter" (non audité ici — le fichier Header.tsx n'est pas dans le scope, mais l'architecture sign-up/page.tsx confirme qu'une route dédiée existe). La route `/sign-up` est une page pleine qui affiche l'AuthModal centré sur un fond vide avec Header + Footer visibles — conforme à la préférence fondateur "modal auth, pas page pleine", MAIS l'implémentation est un rendu d'AuthModal sur une page dédiée avec `isOpen={true}` et `onClose={() => router.push("/")}`. Techniquement c'est une page, pas un modal par-dessus le contenu courant.

**[FRICTION H3 — P1]** : À l'étape "clic CTA inscription", si Sophie était en train de lire la landing, elle est redirigée vers `/sign-up` et perd le contexte de la page (prix, avant/après). L'overlay modal par-dessus la landing courante n'est pas implémenté — le Header.tsx déclenche probablement un router.push vers /sign-up. Correction : déclencher l'AuthModal via state dans le Header, en overlay sur la page courante.

**Étape 3 — AuthModal sign-up (AuthModal.tsx)**

Q1 : Sophie sait-elle quoi faire ? OUI — sous-titre "Crée ton espace en 30 secondes" est rassurant. Les labels de champs sont en français courant.
Q2 : Actions visibles ? OUI — formulaire compact, CTA "Créer mon compte" bien visible, pleine largeur, couleur contrastée (secondary sur fond clair).
Q3 : Lien but-action clair ? OUI.
Q4 : Feedback ? OUI — état loading "Création du compte...", état erreur avec role="alert", focus-trap implémenté, Escape fonctionne.

**Points forts de l'AuthModal :**
- Focus-trap complet (getFocusableElements, shift+Tab)
- Escape key handled
- Scroll lock body
- Restauration du focus au close
- Validation inline côté client (password < 8 chars)
- autoComplete attributes corrects (email, given-name, family-name, new-password)
- Les champs Prénom/Nom collectés ici seront pré-remplis dans l'onboarding étape 1 (useEffect vérifié dans onboarding/page.tsx)

**[FRICTION H1 — P1]** : Il n'y a pas d'indicateur de force du mot de passe. Sophie peut taper "12345678" (8 chars numériques) et créer le compte. Pas bloquant pour l'UX mais risque de sécurité et d'échec si une validation serveur est plus stricte.

**[FRICTION H5 — P0]** : Validation du mot de passe uniquement à la soumission (pas en temps réel). Si Sophie tape 5 caractères et clique, elle découvre l'erreur après le clic. Correction : valider la longueur on-blur ou onchange avec un indicateur visuel.

**[FRICTION H9 — P1]** : Le champ password a `placeholder="8 caractères minimum"` mais pas d'aria-describedby explicitant la règle. Si Sophie utilise un screen reader, elle n'entend que le label "Mot de passe", pas la contrainte. Correction : ajouter un `<p id="password-hint">` avec la règle, et aria-describedby sur l'input.

**Étape 4 — Onboarding wizard (onboarding/page.tsx)**

Données pré-remplies : OUI — le `useEffect` au mount récupère `user.firstName` et `user.name` depuis la session NextAuth et pré-remplit `prenom`/`nom`. Conforme à la règle "zéro duplication".

Persistance sessionStorage : OUI — chaque changement déclenche la sauvegarde (step, data, biens). Si Sophie recharge accidentellement, elle reprend là où elle était.

Bouton "Continuer plus tard" : OUI — visible dans le header, renvoie vers /dashboard.

**Structure des 9 étapes (STEPS array) :**
1. Ton identité — prenom, nom, telephone, photo_profil (obligatoire)
2. Ton réseau — reseau, experience_annees, nb_transactions_an (obligatoire)
3. Ta zone — ville, quartiers, departement (obligatoire)
4. Ta spécialité — type_biens, gamme_prix, cible_clients (obligatoire)
5. Ton style — ton_communication, valeurs, ce_qui_te_differencie (obligatoire)
6. Ton profil — linkedin_url, bio_personnelle (optionnel)
7. Tes biens en cours — biens (optionnel)
8. La vidéo — confort_camera (optionnel)
9. Tes comptes — instagram, facebook, site_web (optionnel)

**[FRICTION H1 — P0]** : La progress bar est calculée `((currentStep + 1) / STEPS.length) * 100`. STEPS.length = 9, donc l'étape 1 affiche 11%, l'étape 9 affiche 100%. Or sur les 9 étapes, 4 sont optionnelles. Sophie voit "Étape 6 — Ton profil" avec "Facultatif" mais la barre de progression affiche 67%. Elle ne sait pas combien d'étapes obligatoires restent vs optionnelles. Correction : distinguer visuellement les étapes obligatoires (bloquantes) des optionnelles dans la progress bar ou ajouter une mention "X étapes obligatoires restantes".

**[FRICTION H6 — P1]** : L'étape 1 pré-remplit Prénom et Nom depuis la session, mais le champ `telephone` est obligatoire et vide par défaut — Sophie doit le saisir alors qu'aucune communication par téléphone n'est mentionnée dans la value prop. Pour un outil marketing digital, ce champ parait surprenant comme obligatoire.

**[FRICTION H8 — P1]** : L'étape 7 (Tes biens en cours) est optionnelle et présente un formulaire complet pour jusqu'à 5 biens (titre, type, adresse, prix, surface, pièces, points_forts, lien_annonce). C'est cognitif lourd pour une étape marquée "Facultatif — tu pourras les ajouter plus tard". Sophie risque d'abandonner ici. Cette étape devrait être simplifiée ou déplacée dans le dashboard post-inscription via MesBiensSection.

**[FRICTION H2 — P1]** : Le label `reseau` (étape 2) est un champ texte libre avec placeholder "IAD, SAFTI, Capifrance, indépendant...". Pour Sophie qui est chez IAD, ce champ est clair. Mais une liste déroulante avec les réseaux principaux + "Autre" serait plus rapide et réduirait les variations d'orthographe (ex: "iad", "IAD France", "i@d") qui pourraient impacter la qualité des livrables personnalisés.

**[FRICTION H5 — P1]** : Le message de validation d'étape est générique : "Merci de remplir tous les champs avant de continuer." Sans mention du champ manquant. Sophie ne sait pas lequel est vide. Correction : `setValidationError(`Le champ "${FIELD_LABELS[emptyRequired[0]].label}" est obligatoire.`)` ou surligner les champs vides en rouge.

**[FRICTION H4 — P1]** : `reseau` dans FIELD_LABELS a `label: "Ton reseau"` sans accent (devrait être "Ton réseau"). Détail minuscule mais visible côté UI.

**Étape 5 — État de complétion onboarding**

L'écran de succès ("C'est tout bon !") est sobre et rassurant. CTA "Voir mon espace client" redirige vers `/dashboard`. Un check vert, un titre clair, une promesse "Tu recevras tes premiers livrables sous 24h". Conforme à la préférence fondateur "coaching, pas bibliothèque".

**[FRICTION H7 — P1]** : `\u00E9` utilisé dans l'écran de succès ligne 593 : `"Tu recevras tes premiers livrables sous 24h."` → le texte contient `ton &eacute;quipe` (entité HTML dans une string JSX). Non conforme à la règle CLAUDE.md §13 "Caractères UTF-8 obligatoires". Fichier : `src/app/onboarding/page.tsx:593`. Correction : remplacer `ton &eacute;quipe se met au travail` par `ton équipe se met au travail`.

**Étape 6 — Dashboard (état vide post-onboarding)**

L'état vide du dashboard affiche : titre "Bienvenue dans ton espace !", message "Ton équipe est au travail. Tes premiers contenus arrivent sous 24h." et "On t'envoie un email dès que c'est prêt.". Clair, rassurant.

**[FRICTION H1 — P1]** : L'état vide ne montre aucun indicateur de progression ("étape 2/3 : en attente de production"). Sophie ne sait pas si sa demande a bien été prise en compte côté admin. Un bandeau "Onboarding reçu — production planifiée" avec un état visuel (ex: timeline à 3 étapes : Profil reçu ✓ → Production en cours → Livrables prêts) aiderait à réduire l'anxiété d'attente.

**[FRICTION H3 — P1]** : L'état vide du dashboard NE propose PAS d'action intermédiaire pendant l'attente (ex: ajouter un bien via MesBiensSection). Sophie attend passivement 24h. MesBiensSection est un onglet séparé dans le layout mais elle ne le voit pas depuis l'état vide. Correction : ajouter un CTA "En attendant, ajoute ton premier bien" dans l'état vide.

### Résultats des critères — Parcours 1

| Page | Clarté /10 | Navigation /10 | Mobile /10 | Feedback /10 | A11y /10 | Note globale |
|---|---|---|---|---|---|---|
| Landing Hero | 9 | 7 | 8 | 7 | 8 | **7.8** |
| AuthModal sign-up | 9 | 8 | 8 | 8 | 7 | **8.0** |
| Onboarding wizard | 7 | 8 | 7 | 7 | 7 | **7.2** |
| Dashboard — état vide | 8 | 5 | 8 | 6 | 7 | **6.8** |

### Tests UX — Parcours 1

| Test | Critère de succès | Statut |
|---|---|---|
| Sophie peut s'inscrire et atteindre le dashboard sans aide | Zéro impasse dans le flow, labels compréhensibles | ✅ (flow complet, pas de cul-de-sac) |
| Charge cognitive (≤ 3 actions/écran) | Chaque écran a ≤ 3 actions principales | ⚠️ (étape 7 onboarding : 8 champs pour 1 bien) |
| Time-to-value (≤ 3 étapes avant valeur perçue) | Inscription → dashboard en ≤ 3 étapes | ❌ (9 étapes d'onboarding avant dashboard — justifiable mais dense) |
| Edge case : état vide dashboard | Comportement documenté, rassurant | ⚠️ (rassurant mais passif, pas d'action proposée) |
| Edge case : erreur sign-up | role="alert", message humain | ✅ |
| Accessibilité WCAG 2.2 AA | Focus-trap, aria-labels, autoComplete | ⚠️ (aria-describedby manquant sur password field) |

---

## Parcours 2 — Ajout d'un bien et génération d'annonce

> Simulation : Dashboard → "Ajouter un bien" → BienForm → Photos → Générer annonce → Copier → Page publique

### Cognitive walkthrough — étape par étape

**Étape 1 — Dashboard → section MesBiens (MesBiensSection.tsx)**

Q1 : Sophie sait-elle qu'elle peut ajouter un bien ici ? OUI — deux points d'entrée dans le dashboard :
- MesBiensSection (état vide) : CTA "Ajouter mon premier bien" → `/dashboard/biens/nouveau`
- MesBiensSection (avec biens) : bouton "Ajouter un bien" en top-right de la section header
- DashboardContent section "biens" (CTA email) → état vide : lien mailto

**Problème de duplication :** DashboardContent affiche une section "Mes biens et annonces" basée sur `profile.biens` (données de l'onboarding), ET MesBiensSection affiche les biens self-service (property_pages). Ces deux systèmes coexistent dans le dashboard. Sophie voit ses biens en double si elle a renseigné des biens en onboarding : une fois dans la "section biens legacy" de DashboardContent (profile.biens), une fois dans MesBiensSection (API /biens).

**[FRICTION H4 — P0]** : Deux systèmes de biens distincts visibles en même temps dans le dashboard (profile.biens de l'onboarding + PropertyPage du self-service). Sophie ne comprend pas pourquoi elle voit "Bien 1 — T3 Lyon" en haut (section DashboardContent) et potentiellement rien en bas (MesBiensSection vide). Le modèle mental est cassé. Correction : unifier ou clairement distinguer les deux sections avec des titres explicites ("Biens déclarés à l'inscription" vs "Biens avec annonces IA"), ou supprimer la section legacy de DashboardContent au profit de MesBiensSection.

**Étape 2 — MesBiensSection → état vide (MesBiensSection.tsx)**

Q1 : CTA "Ajouter mon premier bien" est-il clair ? OUI — icône +, label explicite.
Q2 : Visible ? OUI — centré dans la section, couleur secondary contrastée.
Q4 : Feedback au clic ? OUI — navigation vers /dashboard/biens/nouveau.

État de chargement : skeleton animé (3 cartes placeholder) — PASS H1.
État d'erreur : alerte role="alert" avec message texte — PASS H9.

**Étape 3 — /dashboard/biens/nouveau + BienForm (BienForm.tsx)**

Q1 : Sophie comprend-elle la page ? OUI — titre "Ajouter un bien", sous-titre "Renseigne les infos de ton bien. Tu pourras ajouter les photos et générer l'annonce juste après." annonce le flow progressif.
Q2 : Les champs sont-ils visibles ? OUI — formulaire lisible, champs en stack, grille responsive pour Prix/Surface/Pièces.
Q3 : Lien but-action ? OUI.
Q4 : Feedback ? OUI — validation inline par champ (les erreurs apparaissent sous chaque champ), état "Enregistrement..." sur le bouton submit, gestion d'erreur réseau.

**Points forts BienForm :**
- Validation champ-par-champ avec aria-invalid + aria-describedby + role="alert"
- Le champ prix a inputMode="numeric", step="1000" — adapté mobile
- Après succès, redirect vers `/dashboard/biens/${id}` — flow progressif conforme
- Retour dashboard visible en haut (lien avec flèche)

**[FRICTION H5 — P1]** : Le champ "Adresse complète" est un input texte libre SANS autocomplete API. Dans l'onboarding (étape Biens), l'autocomplete via `api-adresse.data.gouv.fr` est implémenté. BienForm n'a pas cette aide. Sophie doit taper l'adresse exacte sans assistance. Correction : ajouter l'autocomplete adresse dans BienForm comme dans l'onboarding.

**[FRICTION H8 — P1]** : Le champ "Points forts" (textarea libre) et "Description détaillée" (textarea libre) sont demandés AVANT de générer l'annonce. Pour Sophie qui ne sait pas quoi écrire ("tu écris l'annonce à ma place ou pas ?"), ce champ crée de la confusion. Ces champs sont utiles pour la génération IA mais leur label ne l'indique pas. Correction : ajouter un helper text "Ces infos nous permettront de personnaliser ton annonce. Tu peux être bref — 2-3 mots suffisent."

**[FRICTION H2 — P1]** : Le titre du bien est généré automatiquement côté serveur comme `${type_bien} — ${adresse}` (ligne 108). Sophie ne peut pas donner un nom custom à son bien. Si elle a deux T3 dans le même immeuble, ils auront le même nom. Pas bloquant mais limitant pour la gestion multi-biens.

**[FRICTION H6 — P0]** : Le formulaire NE PRÉ-REMPLIT PAS les données de l'onboarding. Si Sophie a déjà renseigné un bien en onboarding (étape 7), ces données sont dans `profile.biens` mais ne sont pas injectées dans le BienForm. Elle re-saisit tout. Violation de la règle "zéro duplication". Correction : si des biens existent dans client_context, proposer de les importer.

**Étape 4 — /dashboard/biens/[id] + PhotoUploader (PhotoUploader.tsx)**

Accès : après soumission du BienForm, redirect automatique vers la fiche bien.
Q1 : Sophie comprend qu'elle doit ajouter des photos ? OUI — la section "Photos (0)" est en premier dans BienFicheClient, avant l'annonce.

**PhotoUploader — États documentés :**
- État défaut : zone drag-and-drop avec label "Glisse tes photos ici ou clique pour choisir"
- État upload en cours : barre de progression simulée (30% → 60% → 100%), preview de l'image
- État erreur par photo : message d'erreur sous la thumbnail, bouton retry
- État erreur global : alerte en haut de la zone
- Limite : 10 photos max, 5 Mo par photo, JPG/PNG/WebP

**[FRICTION H1 — P1]** : La progression est simulée (30% → 60% via setTimeout) et non réelle. Si l'upload réel prend 8 secondes mais la barre atteint 60% en 1 seconde, Sophie peut penser que ça bloque à 60%. Correction : utiliser XMLHttpRequest avec onprogress pour une vraie progression, ou afficher "Upload en cours..." sans barre.

**[FRICTION H7 — P1]** : Aucun raccourci ou indication pour réordonner les photos. L'ordre des photos impact la photo principale (cover). Sophie ne peut pas choisir quelle photo est en premier sans supprimer et re-uploader. Correction : drag-and-drop pour réordonner, ou bouton "Définir comme photo principale".

**[FRICTION H5 — P1]** : Le composant accepte les formats via `accept="image/jpeg,image/png,image/webp"` (à vérifier dans le code non lu — non visible dans les 80 premières lignes). Si cette restriction n'est pas sur l'input, Sophie peut sélectionner un HEIC (iPhone) et voir une erreur après coup. `ALLOWED_TYPES` est validé côté JS mais si `accept` manque sur l'input HTML, le dialogue fichier ne filtre pas.

**Étape 5 — Génération d'annonce (AnnonceBlock.tsx)**

**Points forts AnnonceBlock :**
- Bloquer la génération si 0 photo ("Ajoute au moins une photo...") — cohérent avec le flow progressif
- Timeout 35s avec message humain en cas de timeout
- Onglets "Annonce longue" / "Annonce courte (portails)" — bonne segmentation par usage
- Bouton "Copier l'annonce" → feedback "Copié — colle-le !" pendant 2.5s
- Confirmation avant régénération ("Écraser l'annonce existante ? Cette action est irréversible.")
- Fallback clipboard (document.execCommand pour vieux navigateurs)
- aria-live="polite" sur le loading state

**[FRICTION H1 — P1]** : Pendant la génération (30 secondes), le seul feedback est le spinner + "Rédaction en cours... (30 secondes)". Sophie ne sait pas si le serveur travaille vraiment ou si ça bloque. Les skeleton lines animées sont visuellement rassurantes mais ne montrent pas de progression réelle. Correction : messages progressifs type "Analyse de tes photos... → Rédaction en cours... → Finalisation..." via un step counter.

**[FRICTION H6 — P1]** : L'annonce générée affiche titre + texte mais PAS les données du bien (surface, prix, adresse) pour contextualiser. Sophie doit mémoriser que cette annonce correspond à son T3 de la rue des Lilas. Correction : afficher en haut du bloc "Pour : Appartement — 12 rue des Lilas, Lyon" en petit texte de contexte.

**[FRICTION H3 — P1]** : Après avoir copié l'annonce, Sophie ne sait pas où la coller. Le texte "Copié — colle-le !" est encourageant mais sans indication du use-case (SeLoger, LeBonCoin, email). Correction : ajouter sous le bouton copier une ligne helper "Pour SeLoger / LeBonCoin / email acheteurs" en caption.

**Étape 6 — Page publique (BienFicheClient.tsx)**

Section "Page publique" visible si un slug existe. Deux actions :
- "Voir la page" (ouvre /bien/[slug] en nouvel onglet)
- "Copier le lien" (clipboard) avec feedback "Lien copié !" 2.5s

**[FRICTION H1 — P1]** : La section "Page publique" n'explique PAS quand le slug est créé. Sophie ne sait pas si la page existe déjà ou si elle doit générer l'annonce d'abord. Si `slug` est null, la section disparaît silencieusement. Correction : si pas de slug, afficher "Ta page publique sera créée après la génération de l'annonce."

**[FRICTION H3 — P1]** : Depuis BienFicheClient, il n'y a pas de bouton "Retour à mes biens". Le retour se fait via le breadcrumb de NouveauBienPage mais sur la fiche d'un bien existant (`/dashboard/biens/[id]/page.tsx`), un lien retour devrait être visible. (Note : la page `[id]/page.tsx` n'a pas été lue intégralement — à vérifier.)

### Résultats des critères — Parcours 2

| Page | Clarté /10 | Navigation /10 | Mobile /10 | Feedback /10 | A11y /10 | Note globale |
|---|---|---|---|---|---|---|
| MesBiensSection (état vide) | 8 | 8 | 9 | 9 | 8 | **8.4** |
| /biens/nouveau — BienForm | 8 | 8 | 8 | 8 | 8 | **8.0** |
| PhotoUploader | 8 | 7 | 7 | 7 | 7 | **7.2** |
| AnnonceBlock | 9 | 8 | 8 | 8 | 8 | **8.2** |
| Page publique (BienFicheClient) | 8 | 6 | 8 | 8 | 8 | **7.6** |
| Dashboard — DashboardContent section biens | 5 | 6 | 7 | 6 | 7 | **6.2** |

### Tests UX — Parcours 2

| Test | Critère de succès | Statut |
|---|---|---|
| Sophie peut ajouter un bien et copier l'annonce sans aide | Flow complet sans impasse | ✅ (flow complet sauf confusion biens legacy vs self-service) |
| Charge cognitive (≤ 3 actions/écran) | ≤ 3 actions par écran | ✅ |
| Time-to-value (bien créé → annonce copiée) | ≤ 5 étapes | ✅ (4 étapes : formulaire → photos → générer → copier) |
| Edge case : 0 photo avant génération | Bouton désactivé + message explicatif | ✅ |
| Edge case : erreur API génération | Message humain + bouton "Réessayer" | ✅ |
| Edge case : timeout 35s | Message "La génération a pris trop longtemps — réessaie" | ✅ |
| Edge case : double-soumission régénération | Modal de confirmation | ✅ |
| Accessibilité WCAG 2.2 AA | aria-invalid, aria-describedby, role="alert", min-h-[44px] | ✅ |

---

## Parcours 3 — Back-office admin

> Simulation : /admin → AdminGate login → liste clients → fiche client → trigger production
> Note : persona admin = Thomas (fondateur), pas Sophie. Critères UX adaptés en conséquence.

### Cognitive walkthrough — étape par étape

**Étape 1 — AdminGate login (/admin → layout.tsx → AdminGate.tsx)**

Mécanisme : le layout admin vérifie `isAdminAuthenticated()` (cookie serveur). Si non auth, render AdminGate (formulaire mot de passe simple). Après succès, `window.location.reload()` pour que le cookie soit lu côté serveur.

Q1 : Thomas sait-il quoi faire ? OUI — titre "Admin ImmoCrew", champ unique mot de passe, autoFocus sur le champ.
Q2 : Action visible ? OUI.
Q3 : Lien but-action ? OUI.
Q4 : Feedback ? OUI — état "Vérification...", message d'erreur en rouge.

**[FRICTION H9 — P1]** : Le message d'erreur est `data.error || "Erreur inconnue"`. Si l'API retourne "Mot de passe incorrect" c'est clair. Mais "Erreur inconnue" ou "Erreur réseau" ne donnent pas d'instruction à Thomas. Correction : "Mot de passe incorrect — réessaie" comme fallback explicite.

**[FRICTION H1 — P1]** : Après succès, `window.location.reload()` peut créer un flash blanc pendant le rechargement (SSR reprend le dessus). Pas d'état de transition visible. Correction : afficher "Accès accordé — chargement..." pendant 500ms avant le reload.

**[FRICTION H3 — P0]** : Les pages `/admin/clients/[id]` ont leur propre header qui duplique le header `/admin` (même structure copy-paste). Mais la fiche client n'a pas de lien "Retour liste". Le code montre `href="/admin"` dans le breadcrumb — c'est présent (ligne 87 de la fiche). PASS.

**Étape 2 — /admin — Liste clients (admin/page.tsx)**

Structure : stats (4 KPIs : total, actifs, mensuels, lancements) → bouton génération article SEO → liste clients en tableau.

Q1 : Thomas trouve-t-il la liste clients ? OUI — tableau clair avec colonnes Client/Pack/Statut/Date/Actions.
Q2 : Le lien "Voir" vers la fiche client est-il visible ? OUI — colonne Actions, texte "Voir" en couleur secondary.

**[FRICTION H7 — P1]** : Le tableau n'est pas triable ni filtrable. Quand Thomas aura 30 clients, chercher un client spécifique nécessitera un scroll visuel. Correction : ajouter un champ de recherche par email/nom en haut du tableau.

**[FRICTION H1 — P1]** : Le titre `<h1>Clients</h1>` apparaît APRÈS les stats et le bouton génération article. La hiérarchie visuelle est inversée (KPIs avant le titre de section). Correction : remettre le h1 en premier.

**[FRICTION H8 — P1]** : La section "Generate SEO article" (GenerateArticleButton) est positionnée entre les stats et la liste clients. C'est une action rare (une fois par mois) mais elle occupe de l'espace visuel permanent au-dessus de la liste. Correction : déplacer en bas de page ou dans une section "Outils".

**Étape 3 — /admin/clients/[id] — Fiche client**

Structure : header admin sticky → infos client (grille 2 col) → ClientContextCard → Production IA → Livrables récents → Paiements.

Q1 : Thomas trouve-t-il les infos dont il a besoin ? OUI — email, pack, statut, dates, Stripe ID.
Q2 : Le TriggerProductionButton est-il visible ? OUI — section "Production IA" bien séparée.

**ClientContextCard (non lu intégralement)** : affiche le contexte client (données onboarding). Probablement un JSON rendu en tableau ou liste — à vérifier.

**[FRICTION H6 — P1]** : La grille "infos client" affiche `clerk_user_id` (ligne 20 du schéma) — ce champ est devenu obsolète depuis la migration NextAuth (project-context.md : "migration depuis Clerk effectuée le 2026-03-26"). Afficher un champ vide ou "—" avec l'ancien label crée de la confusion. Correction : renommer en "Auth ID (interne)" ou masquer si null.

**Étape 4 — TriggerProductionButton (TriggerProductionButton.tsx)**

**Points forts :**
- Lock localStorage pour éviter double-soumission (clé + expiration 10 min)
- Sélecteur de mois pour le pack mensuel
- Feedback résultat : succès (compteur de livrables générés) ou erreur avec détails et hint
- Restauration du loading state au rechargement si génération en cours

**[FRICTION H1 — P0]** : Pendant la génération (plusieurs minutes), le seul feedback est le bouton désactivé avec texte "Generation..." et le bandeau bleu "Generation en cours... Cela peut prendre plusieurs minutes (appels Claude API séquentiels)". Thomas ne sait pas à quelle étape est la génération. Si la fenêtre se ferme, le lock expire en 10 min mais la génération continue côté serveur — Thomas ne le sait pas. Correction : ajouter un polling `/api/admin/production-status/{clientId}` avec un indicateur de progression (ex: "Génération 3/19 agents...").

**[FRICTION H5 — P1]** : Il n'y a pas de bouton "Pack Boost" visible dans TriggerProductionButton. Les boutons sont "Lancer Pack Mensuel" et "Lancer Pack Lancement". La logique `handleTrigger("boost")` existe côté code mais aucun bouton UI ne le déclenche. Thomas doit aller en API pour lancer un Boost. Correction : ajouter un bouton "Lancer Boost Mandat" avec un sélecteur d'ID de bien.

**[FRICTION H9 — P1]** : Le message d'erreur en cas de fail inclut `data.details` et `data.hint` en raw (whitespace-pre-wrap). Si l'erreur est un stack trace PostgreSQL, Thomas voit du SQL brut. Correction : un mapping d'erreurs humain côté admin (les erreurs techniques sont loggées en console, pas affichées brutes).

**[FRICTION H4 — P1]** : Le texte du bouton en loading est "Generation..." sans accent (devrait être "Génération..."). Violation règle UTF-8. Fichier : `src/components/admin/TriggerProductionButton.tsx:133 et 142`.

**[FRICTION H4 — P1]** : Le bandeau info loading contient "Generation en cours... Cela peut prendre plusieurs minutes (appels Claude API sequentiels)." — "sequentiels" sans accent. Fichier : `TriggerProductionButton.tsx:167`.

### Résultats des critères — Parcours 3

| Page | Clarté /10 | Navigation /10 | Mobile /10 | Feedback /10 | A11y /10 | Note globale |
|---|---|---|---|---|---|---|
| AdminGate login | 9 | 8 | 8 | 7 | 7 | **7.8** |
| /admin — liste clients | 7 | 7 | 6 | 7 | 7 | **6.8** |
| /admin/clients/[id] | 8 | 8 | 6 | 7 | 7 | **7.2** |
| TriggerProductionButton | 7 | 7 | 6 | 6 | 7 | **6.6** |

### Tests UX — Parcours 3

| Test | Critère de succès | Statut |
|---|---|---|
| Accéder à /admin, trouver un client, lancer la production | Flow sans impasse | ✅ |
| Feedback génération IA | Loading visible, résultat clair succès/erreur | ⚠️ (loading ok, mais pas de progression step-by-step) |
| Edge case : double-soumission | Lock localStorage avec expiration 10 min | ✅ |
| Edge case : production déjà en cours au reload | Restauration du loading state depuis localStorage | ✅ |
| Bouton Boost Mandat disponible | Bouton UI présent | ❌ (logique présente mais bouton absent de l'UI) |
| Accessibilité WCAG 2.2 AA | Focus visible, labels, role | ⚠️ (min-h sur les boutons non vérifié — boutons h-10 = 40px < 44px recommandé) |

---

## Frictions P0 (bloquent le parcours ou violent les règles critiques)

| ID | Parcours | Écran | Description | Fichier : ligne | Correction |
|---|---|---|---|---|---|
| P0-01 | 1 | AuthModal sign-up | Validation mot de passe uniquement à la soumission — Sophie ne sait pas que son mot de passe est trop court avant de cliquer | `AuthModal.tsx:172` | Valider `password.length >= 8` onBlur et afficher un indicateur visuel en temps réel |
| P0-02 | 1 | Onboarding wizard | Progress bar affiche % total (9 étapes) alors que 4 sont optionnelles — Sophie ne sait pas combien d'étapes obligatoires restent | `onboarding/page.tsx:266` | Afficher "X/5 étapes obligatoires" ou distinguer les étapes obligatoires/optionnelles dans la barre |
| P0-03 | 2 | Dashboard DashboardContent | Double affichage des biens (section legacy profile.biens + MesBiensSection PropertyPage) — modèle mental cassé pour Sophie | `DashboardContent.tsx:454-514` | Supprimer la section biens legacy de DashboardContent si MesBiensSection est présente, ou les fusionner |
| P0-04 | 2 | BienForm | Le formulaire ne pré-remplit pas les biens déjà saisis en onboarding (profile.biens) — violation "zéro duplication" | `BienForm.tsx` (pas de pre-fill) | À la création, proposer d'importer un bien existant depuis client_context.biens |
| P0-05 | 3 | TriggerProductionButton | Bouton "Pack Boost" absent de l'UI malgré la logique présente dans handleTrigger("boost") | `TriggerProductionButton.tsx:54` | Ajouter un bouton "Lancer Boost Mandat" (nécessite aussi un sélecteur de bien) |

## Frictions P1 (dégradent l'expérience)

| ID | Parcours | Écran | Description | Fichier : ligne | Correction |
|---|---|---|---|---|---|
| P1-01 | 1 | Landing Hero | CTA primary "Voir un exemple" → ancre #avant-apres, pas vers l'inscription — retarde le parcours d'inscription | `Hero.tsx:23` | Ajouter un 3e CTA "Commencer maintenant" ou s'assurer que le CTA Pricing section déclenche l'inscription |
| P1-02 | 1 | sign-up/page.tsx | AuthModal implémenté comme page dédiée, pas en overlay sur la landing — Sophie perd le contexte prix/avant-après | `sign-up/page.tsx` | Déclencher AuthModal via state React dans le Header, en overlay sur la page courante |
| P1-03 | 1 | AuthModal — champ password | Pas d'aria-describedby ni d'id pour l'hint "8 caractères minimum" — screen readers ne lisent pas la contrainte | `AuthModal.tsx:104-107` | Ajouter `<p id="password-hint" className="text-caption...">8 caractères minimum</p>` + `aria-describedby="password-hint"` |
| P1-04 | 1 | Onboarding — étape 7 biens | Formulaire 8 champs par bien dans une étape optionnelle — charge cognitive excessive pour du facultatif | `onboarding/page.tsx:43-45` | Simplifier à 2-3 champs (type, adresse, prix) en onboarding, renvoyer vers MesBiensSection pour le reste |
| P1-05 | 1 | Onboarding — validation | Message d'erreur générique "Merci de remplir tous les champs" sans indiquer le champ manquant | `onboarding/page.tsx:449` | Indiquer le premier champ vide : `setValidationError(\`"${FIELD_LABELS[emptyRequired[0]].label}" est obligatoire.\`)` |
| P1-06 | 1 | Onboarding — FIELD_LABELS | Label `"Ton reseau"` sans accent | `onboarding/page.tsx:101` | Corriger en `"Ton réseau"` |
| P1-07 | 1 | Onboarding — succès screen | Entité HTML `&eacute;` dans une string JSX (ligne 593) — violation règle UTF-8 CLAUDE.md §13 | `onboarding/page.tsx:593` | Remplacer `ton &eacute;quipe` par `ton équipe` |
| P1-08 | 1 | Dashboard — état vide | Pas d'action proposée pendant l'attente de 24h — Sophie attend passivement | `DashboardContent.tsx:246-261` | Ajouter CTA "En attendant, ajoute ton premier bien" ou un indicateur de statut "Production planifiée" |
| P1-09 | 2 | BienForm — adresse | Pas d'autocomplete adresse (contrairement à l'onboarding) | `BienForm.tsx:180-198` | Intégrer `api-adresse.data.gouv.fr` avec debounce, comme dans onboarding/page.tsx |
| P1-10 | 2 | BienForm — champs texte | "Points forts" et "Description détaillée" sans helper text — Sophie ne sait pas pourquoi on lui demande | `BienForm.tsx` | Ajouter helper text "Ces infos personnalisent ton annonce IA — 2-3 mots suffisent" |
| P1-11 | 2 | PhotoUploader — progression | Barre de progression simulée (30%/60%/100% setTimeout) — pas la vraie progression de l'upload | `PhotoUploader.tsx:77-80` | Utiliser XMLHttpRequest onprogress ou supprimer la barre au profit d'un spinner simple |
| P1-12 | 2 | AnnonceBlock — contexte | Annonce affichée sans référence au bien (titre, adresse) — Sophie perd le contexte | `AnnonceBlock.tsx:212` | Afficher en haut du bloc "Pour : [titre du bien]" — nécessite de passer la prop `bienTitre` à AnnonceBlock |
| P1-13 | 2 | AnnonceBlock — post-copie | Aucune indication de use-case post-copie ("où coller cette annonce ?") | `AnnonceBlock.tsx:337-384` | Ajouter sous le bouton copier : "Pour SeLoger, LeBonCoin, email acheteurs" en caption |
| P1-14 | 2 | BienFicheClient — page publique | Section "Page publique" absente si pas de slug, sans explication | `BienFicheClient.tsx:80-170` | Afficher un message conditionnel "Ta page sera créée après la génération" si slug null |
| P1-15 | 3 | /admin liste | Tableau non filtrable/triable — difficile quand la liste grandit | `admin/page.tsx:111-181` | Ajouter un input de recherche par email/nom |
| P1-16 | 3 | /admin liste | Titre h1 "Clients" positionné après les stats et le bouton article | `admin/page.tsx:97` | Remonter le h1 en haut de la section liste |
| P1-17 | 3 | AdminGate | Pas de transition visible après succès avant reload | `AdminGate.tsx:39` | Afficher "Accès accordé..." pendant 500ms |
| P1-18 | 3 | TriggerProductionButton | Pas de progression step-by-step pendant la génération (plusieurs minutes) | `TriggerProductionButton.tsx:105-170` | Polling `/api/admin/production-status/[id]` toutes les 10s |
| P1-19 | 3 | TriggerProductionButton | Champs sans accent : "Generation...", "sequentiels" | `TriggerProductionButton.tsx:133,142,167` | Corriger les accents (règle UTF-8 CLAUDE.md §13) |
| P1-20 | 3 | /admin/clients/[id] | Champ `clerk_user_id` affiché (obsolète depuis migration NextAuth) | `admin/clients/[id]/page.tsx:20` | Masquer ou renommer "Auth ID (interne)" |

## Audit heuristique Nielsen 10

*(à remplir)*

## HEART Framework — Métriques de succès

*(à remplir)*

## Score global

*(à remplir)*

## Hypothèses à valider

*(à remplir)*
