# Audit UX — 3 features session 7b
# ImmoCrew — 2026-03-28

> Agent : @ux — Lead UX Researcher & Designer
> Scope : Feature 1 (Page profil), Feature 2 (Sauvegarde onboarding serveur), Feature 3 (Séquence email nurturing)
> Persona de référence : Sophie, 38 ans, mandataire IAD, non-technicienne

---

## Tableau de synthèse

| Feature | Score /10 | Statut | P0 | P1 |
|---|---|---|---|---|
| F1 — Page profil /dashboard/profile | 8/10 | GO conditionnel | 1 | 2 |
| F2 — Sauvegarde onboarding serveur | 9/10 | GO | 0 | 1 |
| F3 — Séquence email nurturing | 8.5/10 | GO conditionnel | 0 | 2 |

---

## Feature 1 — Page profil /dashboard/profile

### Résumé

Page de modification du profil accessible depuis le UserMenu ("Mon profil") et, implicitement, depuis le dashboard via l'état `profileIncomplete`. Architecture en 7 cartes empilées : 1 carte photo hors-section + 6 sections SECTIONS[] (Identité, Zone, Métier, Style, Réseaux, Bio). Chaque section a son propre bouton "Enregistrer" avec dirty tracking et feedback inline. Rendu SSR : données pré-remplies depuis la DB côté serveur.

**Fichiers lus :** `src/app/dashboard/profile/page.tsx`, `src/components/dashboard/ProfileForm.tsx`, `src/app/api/profile/route.ts`, `src/components/dashboard/UserMenu.tsx`

---

### Audit heuristique Nielsen (10 heuristiques)

| # | Heuristique | Statut | Evidence |
|---|---|---|---|
| H1 | Visibilité de l'état du système | PASS | Spinner "Enregistrement..." + "Enregistré !" 3s + spinner photo upload. Chaque section gère son état indépendamment. |
| H2 | Correspondance système/monde réel | PASS | Labels en tutoiement direct : "Ton identité", "Ta zone", "Ton métier", "Ton style". Vocabulaire Sophie. Icônes emoji compréhensibles. |
| H3 | Contrôle et liberté | PASS partiel | Le lien "← Retour au dashboard" existe. Mais : pas de "Annuler les modifications" par section — si Sophie modifie et veut annuler, elle doit retaper l'ancienne valeur manuellement. [FRICTION H3] |
| H4 | Cohérence et standards | PASS | Pattern uniforme : titre section → champs → bouton Enregistrer + feedback. Identique sur toutes les sections. |
| H5 | Prévention des erreurs | PASS partiel | Bouton désactivé si rien changé (dirty tracking). Validation prenom/nom/ville côté client ET côté API. Mais : pas de validation format téléphone, URL LinkedIn. [FRICTION H5] |
| H6 | Reconnaissance plutôt que rappel | PASS | Tout le profil est visible et éditable sur une seule page sans navigation cachée. Les placeholders donnent des exemples concrets ("Sophie", "06 12 34 56 78"). |
| H7 | Flexibilité et efficacité | PASS | Save par section = expert peut modifier un seul champ. Pré-remplissage serveur = pas de ressaisie. |
| H8 | Design esthétique et minimaliste | PASS partiel | 7 cartes sur une seule page = scroll long (environ 2000px sur mobile). Pas de navigation entre sections (tabs ou ancres). [FRICTION H8] |
| H9 | Aide à la reconnaissance des erreurs | PASS | Messages d'erreur en français humain : "Le prénom est requis", "Erreur réseau. Vérifie ta connexion." Pas de codes techniques. |
| H10 | Aide et documentation | PASS partiel | `helper` text sur bio_personnelle et confort_camera. Mais : 0 aide sur les champs gamme_prix, cible_clients, ce_qui_te_differencie. Sophie peut ne pas savoir quoi écrire. [FRICTION H10] |

---

### Points positifs

**P+ 1 — Dirty tracking par section, pas global.** Le bouton "Enregistrer" est désactivé tant que les champs de SA section n'ont pas changé par rapport à `initialData`. Empêche les sauvegardes accidentelles. Implémentation correcte via `useCallback` + comparaison champ par champ.

**P+ 2 — Upload photo auto-sauvegardé.** Après upload, le nouveau `photo_profil_key` est immédiatement PATCH sur `/api/profile` sans que Sophie ait à cliquer "Enregistrer". Le feedback "Enregistré !" s'affiche dans la carte identité. Expérience transparente.

**P+ 3 — Pré-remplissage serveur complet.** La page SSR fetch les données directement via `query()` et passe le profil à `ProfileForm`. Aucun champ ne part vide si l'onboarding a été complété. Cohérent avec la règle "Zéro duplication d'info" des préférences fondateur.

**P+ 4 — États d'erreur humains.** Messages côté client ("Le prénom est requis") ET côté API alignés. Le PATCH retourne `{ error: "message" }` et ProfileForm l'affiche directement dans la section concernée, pas dans un toast global.

**P+ 5 — Accessibilité solide.** `htmlFor` + `id` systématiques sur tous les champs. `role="alert"` sur erreurs, `role="status"` sur succès. `focus-visible:ring-2` sur tous les interactifs. `min-h-[44px]` respecté. `aria-label` sur les sections via `<section aria-label={section.title}>`.

---

### Problèmes détectés

**[P1] Aucun lien "Modifier mon profil" depuis le DashboardContent vers /dashboard/profile**

Constat : `DashboardContent.tsx` reçoit `profileIncomplete` mais aucun lien explicite vers `/dashboard/profile` n'apparaît dans les 60 premières lignes du composant. Le seul accès confirmé est via UserMenu → "Mon profil". Pour Sophie qui a le dashboard ouvert, la discoverability de la page profil est faible si elle ne passe pas par le menu utilisateur.

Correction : vérifier que le banner `profileIncomplete` contient bien un CTA `<a href="/dashboard/profile">`. Si absent, ajouter.

Sévérité : P1 (impact activation — Sophie doit compléter son profil pour personnaliser ses contenus).

**[P1] Pas de bouton "Annuler" par section — dirty tracking sans issue de secours**

Constat : une fois qu'un champ est modifié, le seul moyen d'annuler est de retaper l'ancienne valeur. Aucun bouton "Annuler" ou "Réinitialiser". Si Sophie modifie accidentellement un champ complexe (bio_personnelle, ce_qui_te_differencie), elle perd la valeur initiale.

Correction : ajouter un bouton "Annuler" (visible uniquement quand `dirty === true`) qui appelle `setData(prev => { ...prev, [champs de la section]: valeurs initialData })`. Libellé : "Annuler les modifs".

Sévérité : P1 (impact satisfaction — frustration si mauvaise manipulation).

**[P0 — technique, pas UX directe] initialData non mis à jour après sauvegarde réussie**

Constat : dans `handleSaveSection`, après un PATCH réussi, le statut passe à "success" mais `initialData` (passé en prop depuis le SSR) n'est PAS mis à jour. Conséquence : si Sophie sauvegarde une section puis modifie à nouveau un champ, `isSectionDirty` compare avec les valeurs AVANT la première sauvegarde, pas après. Le bouton Enregistrer peut rester actif sur des modifications déjà sauvegardées, ou pire, une rechargement de page est requis pour que le dirty tracking soit fiable.

Correction : après un PATCH réussi, mettre à jour une ref ou un state `savedData` pour que `isSectionDirty` compare avec la dernière valeur sauvegardée, pas `initialData` immuable.

Sévérité : P0 technique / P1 UX (le dirty tracking se désynchronise après la première sauvegarde en session).

**[P1 — accessibilité] Scroll long sans navigation d'ancres sur mobile**

Constat : 7 cartes empilées représentent environ 1800-2200px de scroll sur un écran 375px. Aucun mécanisme de navigation (tabs, ancres, sticky nav) ne permet de sauter directement à "Tes réseaux sociaux" ou "Ta bio". Sophie doit tout scroller pour atteindre la dernière section.

Correction : ajouter une mini-nav sticky ou des ancres de section en haut de page. Alternative légère : un `<nav>` avec des liens-ancres (#identite, #zone, etc.) affichés en flex-wrap horizontal sous le titre h1.

Sévérité : P1 (impact sur mobile — Sophie utilise probablement son téléphone).

---

### Tests UX

| Test | Critère de succès | Statut |
|---|---|---|
| Sophie modifie son prénom et sauvegarde | Bouton actif, spinner, "Enregistré !" visible 3s, champ conserve la valeur | ✅ |
| Sophie ne modifie rien et clique Enregistrer | Bouton désactivé, impossible de cliquer | ✅ |
| Sophie upload une photo | Preview immédiate, spinner, auto-save PATCH, "Enregistré !" | ✅ |
| Sophie envoie prenom vide | Message "Le prénom est requis" dans la section identité | ✅ |
| Sophie veut annuler une modification | Aucun bouton "Annuler" disponible | ❌ |
| Sophie veut retourner au dashboard | Lien "← Retour au dashboard" en haut | ✅ |
| Sophie accède au profil depuis UserMenu | Lien "Mon profil" dans le dropdown | ✅ |
| dirty tracking après 2ème sauvegarde | initialData non mis à jour → désynchronisation possible | ⚠️ |
| Mobile 375px : scroll jusqu'à la bio | ~2000px de scroll, pas d'ancres | ⚠️ |
| Accessibilité clavier complète | Tab, focus-visible sur tous les champs | ✅ |

**Score Feature 1 : 8/10**
Points perdus : -1 dirty tracking bug post-save / -0.5 absence annuler / -0.5 navigation mobile

---

## Feature 2 — Sauvegarde onboarding serveur

### Résumé

Mécanisme de persistance du brouillon d'onboarding en double couche : `sessionStorage` (local, immédiat) + API serveur PATCH `/api/onboarding/draft` (fire-and-forget, prioritaire au rechargement). Au mount de la page, un fetch GET `/api/onboarding/draft` récupère le brouillon serveur et l'applique par-dessus les données sessionStorage (`setData((prev) => ({ ...prev, ...serverData }))`). Le POST final `/api/onboarding` efface le brouillon (`onboarding_draft = NULL`). L'état de chargement du brouillon est géré par `draftLoaded`.

**Fichiers lus :** `src/app/api/onboarding/draft/route.ts`, `src/app/onboarding/page.tsx` (lignes 223-342), `src/app/api/onboarding/route.ts`

---

### Audit des comportements clés

**Comportement 1 — Chargement du brouillon au mount**

```
useEffect(() => {
  fetch("/api/onboarding/draft") → GET
  → si draft.data non vide : setData(prev => ({ ...prev, ...serverData }))
  → si draft.step > 0 : setCurrentStep(draft.step)
  → setDraftLoaded(true) dans finally
}, [])
```

Résultat : la priorité serveur > sessionStorage est effective. Le merge `{ ...prev, ...serverData }` applique le serveur PAR-DESSUS le sessionStorage, qui était chargé dans l'initializer des useState. Correct.

Cas edge : si le serveur retourne step=0 et data={} (pas de brouillon), le sessionStorage est conservé. Correct.

**Comportement 2 — Fire-and-forget**

```
fetch("/api/onboarding/draft", { method: "PATCH" }).catch(() => {})
```

Le `.catch(() => {})` absorbe les erreurs réseau silencieusement. La navigation (setCurrentStep) n'est pas awaited sur le PATCH. Correct — la navigation est immédiate, le serveur se met à jour en arrière-plan.

**Comportement 3 — Effacement du brouillon au POST final**

Dans `/api/onboarding/route.ts` ligne 140-148 :
```sql
ON CONFLICT (email) DO UPDATE SET
  onboarding_draft = NULL,
  onboarding_draft_step = 0,
  onboarding_draft_updated_at = NULL
```

Le brouillon est nettoyé atomiquement avec la sauvegarde définitive. Sophie ne peut pas revenir sur un brouillon après avoir terminé l'onboarding. Correct.

**Comportement 4 — Sophie revient après fermeture**

Si Sophie ferme le navigateur et revient : sessionStorage est perdu (variable de session). Le brouillon serveur est fetch au mount → ses données et son étape sont restaurées. Flow intact. Correct.

**Comportement 5 — JSONB merge côté serveur**

```sql
SET onboarding_draft = COALESCE(onboarding_draft, '{}'::jsonb) || $1::jsonb
```

Merge JSONB natif PostgreSQL. Chaque PATCH ne remplace que les clés envoyées, les autres sont conservées. Idempotent et non destructif. Correct.

---

### Points positifs

**P+ 1 — Double couche sessionStorage + serveur.** sessionStorage = feedback immédiat sur tab/refresh. Serveur = persistance cross-device et cross-browser. La combinaison couvre tous les cas de figure sans bloquer l'UX.

**P+ 2 — `draftLoaded` state correctement géré.** Le flag `draftLoaded` est passé à `false` initialement et passe à `true` dans le `finally` du fetch. Cela permet d'afficher un état de chargement ou de différer les interactions si nécessaire (même si cet usage n'est pas encore exploité — voir problème P1).

**P+ 3 — Cancelled flag anti-fuite mémoire.** `let cancelled = false` + vérifications `if (cancelled) return` dans le fetch asynchrone. Propre — évite les setState sur un composant démonté.

**P+ 4 — Enrichissement automatique à la fin.** Le POST final passe par `enrichProperty()` pour ajouter prix_m2_moyen, lat/lon, transactions récentes. Sophie ne voit rien de tout ça — c'est transparent et ajoute de la valeur métier.

**P+ 5 — Pré-remplissage prenom/nom depuis session.** Un `useEffect` applique `user.firstName` et `user.name` si les champs sont vides. Sophie ne ressaisit pas son prénom/nom saisis à l'inscription. Cohérent avec la règle fondateur "Zéro duplication d'info".

---

### Problèmes détectés

**[P1] Pas d'état de chargement visible pendant le fetch du brouillon serveur**

Constat : `draftLoaded` est bien géré mais aucun état de chargement n'est affiché dans l'UI pendant le fetch initial. Le résultat : si Sophie arrive sur l'onboarding avec un brouillon serveur à l'étape 4, elle voit PENDANT ~200-500ms l'étape 0 (Ton identité) avec les données sessionStorage, puis l'UI saute à l'étape 4 avec les données serveur. Ce flash de contenu est une friction visuelle mineure mais peut désorienter.

Correction : conditionner l'affichage du wizard à `draftLoaded === true`. Afficher un skeleton ou un spinner tant que `draftLoaded === false`. Le délai est court (<500ms) mais le jump de step est visible.

Sévérité : P1 (impact perceptif — pas bloquant, mais crée une impression d'"instabilité").

**[Observation — pas un bug] Les biens sont sérialisés en JSON string dans le brouillon**

Constat : les biens sont stockés sous `__biens__: JSON.stringify(biens)` dans le brouillon. Côté GET, un `JSON.parse(biensJson)` est effectué. C'est fonctionnel mais fragile : un JSON malformé dans le brouillon (edge case) est silencieusement ignoré et les biens du sessionStorage sont conservés. Comportement documenté dans le code et acceptable — à noter pour la robustesse.

Sévérité : observation (pas de correction urgente).

---

### Tests UX

| Test | Critère de succès | Statut |
|---|---|---|
| Fetch brouillon au mount | GET `/api/onboarding/draft` appelé, données appliquées | ✅ |
| Priorité serveur > sessionStorage | serverData merge sur prev (sessionStorage) | ✅ |
| Navigation non bloquée par PATCH | setCurrentStep s'exécute sans await le PATCH | ✅ |
| POST final efface le brouillon | `onboarding_draft = NULL` dans le UPSERT | ✅ |
| Sophie revient après fermeture navigateur | sessionStorage perdu, brouillon serveur restauré | ✅ |
| Flash de contenu au chargement | Step 0 affiché ~300ms puis jump à l'étape sauvegardée | ⚠️ |
| JSON biens malformé dans brouillon | Silencieusement ignoré, biens sessionStorage conservés | ✅ |
| PATCH serveur échoue (réseau coupé) | `.catch(() => {})` — sessionStorage conservé | ✅ |
| Idempotence PATCH | JSONB `||` merge — appels multiples sans effet destructif | ✅ |

**Score Feature 2 : 9/10**
Points perdus : -1 flash de contenu au chargement (état de chargement manquant)

---

## Feature 3 — Séquence email nurturing

### Résumé

Séquence de 3 emails post-inscription : J+2 (Pack Lancement prêt), J+7 (conseils publication, tous clients), J+14 (upsell Pack Mensuel, Lancement sans abonnement). Exécution via cron quotidien GET `/api/cron/nurturing` (protégé `CRON_SECRET`) et déclenchement manuel admin POST `/api/admin/send-nurturing`. Idempotence via table `email_logs`. Mode "log only" par défaut (aucun provider SMTP configuré encore). Templates HTML inline dans `email-templates.ts`, prix importés depuis `pricing.ts`.

**Fichiers lus :** `src/lib/email-templates.ts`, `src/lib/email.ts`, `src/app/api/cron/nurturing/route.ts`, `src/app/api/admin/send-nurturing/route.ts`

---

### Audit du ton et des CTA

**Email J+2 — "Ton kit marketing est prêt"**

Sujet : `Salut ${prenom} — ton kit marketing est prêt !`
- Tutoiement : OUI. "Salut", "tes réseaux", "tu ouvres".
- Registre complice : OUI. "Tu ouvres, tu copies, tu publies. 3 minutes par post." — concret, actionnable.
- CTA : "Voir mes contenus" → `${dashboardUrl}` (/dashboard). Clair, 1 seul CTA.
- Upsell : mentionné naturellement en fin d'email, pas agressif.
- Problème : le sujet contient "kit marketing" — terme professionnel. Sophie comprend probablement mais "tes contenus sont prêts" aurait été plus direct. Observation mineure.

**Email J+7 — "Tu as publié tes premiers posts ?"**

Sujet : `${prenom}, tu as publié tes premiers posts ?`
- Tutoiement : OUI.
- Registre complice : OUI. Conseils pratiques ("Les stories, c'est gratuit."), humains, pas condescendants.
- CTA : "Besoin d'aide ? Écris-nous" → `mailto:support@immocrew.fr`. Approprié — J+7 est un email de valeur/conseil, pas de vente. Le CTA de contact est juste.
- Problème : L'email J+7 est envoyé à TOUS les clients (pas seulement Pack Lancement). Un client Pack Mensuel déjà abonné reçoit donc cet email. Les conseils sont génériques et restent pertinents, mais le fallback prénom `"là"` (`client.first_name ?? "là"`) produit "Salut là," — awkward si le prénom n'est pas renseigné.

**Email J+14 — "2 semaines déjà — et si on passait au mensuel ?"**

Sujet : `2 semaines déjà — et si on passait au mensuel ?`
- Tutoiement : OUI.
- Registre : conversion assumée, mais approche narrative (rappel de ce qui a été livré, projection sur "dans 2 semaines tu auras tout utilisé"). Honnête et non agressif.
- CTA : "Voir le Pack Mensuel" → `${pricingUrl}` (/#pricing). Correct.
- Bonus : paragraphe parrainage "Tu connais un collègue mandataire...". Bonne mécanique de referral intégrée naturellement.
- Problème : le sujet "et si on passait au mensuel ?" est à la 1ère personne du pluriel ("on") alors que tout l'email est en "tu". Légère incohérence de registre.

**Prix importés depuis pricing.ts**

Confirmation : ligne 9 `import { PACK_MENSUEL } from "@/lib/pricing"`, lignes 107/214 : `const prixMensuel = PACK_MENSUEL.price`. Les prix ne sont pas hardcodés dans les templates. Correct.

---

### Points positifs

**P+ 1 — Idempotence double couche.** Côté cron : sous-requête `NOT IN (SELECT... WHERE email_type = '...' AND status = 'sent')`. Côté `sendEmail()` : `isEmailSent()` avant envoi. Deux vérifications indépendantes. Un email ne peut pas être envoyé deux fois même si le cron tourne deux fois par accident.

**P+ 2 — CRON_SECRET obligatoire.** La route cron vérifie l'absence de secret ET la valeur incorrecte. Retourne 500 si non configuré (alerte opérationnelle) et 401 si valeur incorrecte. Sécurité correcte.

**P+ 3 — Route admin avec auth.** `isAdminAuthenticated()` protège le déclenchement manuel. Le mode client unique (`{ client_id }`) permet de tester un email précis sans batch complet. Utile pour le debug.

**P+ 4 — Layout HTML email robuste.** Tables `role="presentation"`, CSS inline, `max-width: 600px`, gris de fond + blanc centré = compatible Gmail, Outlook, Apple Mail. Les couleurs ImmoCrew (bleuNuit, orange) sont cohérentes avec le design system.

**P+ 5 — Fallback texte plat.** Chaque template a une version `text:` complète pour les clients mail qui désactivent le HTML. Pas une réflexion de dernière minute — le contenu texte est rédigé proprement.

**P+ 6 — Logs d'échec.** Un `sendEmail()` qui échoue insère un log `status = 'failed'` dans `email_logs`. Le cron agrège les erreurs dans `results.errors[]`. L'admin peut voir ce qui a échoué.

---

### Problèmes détectés

**[P1] Fallback prénom `"là"` produit "Salut là,"**

Constat : `const prenom = client.first_name ?? "là"` dans les deux routes (cron et admin). Produit "Salut là, ton Pack Lancement est prêt." si `first_name` est NULL en base. Ce cas existe si un client s'est inscrit mais n'a pas complété l'onboarding.

Correction : remplacer `?? "là"` par un fallback plus neutre. Options :
- `?? "toi"` → "Salut toi," — correct en français
- `?? ""` puis supprimer la salutation si vide → complexe
- Recommandé : exclure les clients sans `first_name` de la séquence nurturing jusqu'à ce qu'ils aient complété leur profil. Ajouter `AND c.first_name IS NOT NULL` dans les WHERE du cron.

Sévérité : P1 (impact marque — "Salut là," est clairement généré par une machine, brise l'effet "ton équipe marketing").

**[P1] Sujet J+14 "on" incohérent avec le reste en "tu"**

Constat : sujet `"2 semaines déjà — et si on passait au mensuel ?"` utilise "on" (inclusif fondateur+Sophie), alors que tout le corps de l'email est en "tu". Ce mélange de registre est perceptible.

Correction : aligner sur "tu". Options :
- `"2 semaines déjà, ${prenom} — prêt·e pour la suite ?"` (avec prénom pour personnaliser)
- `"${prenom}, tes contenus du lancement s'épuisent — et après ?"` (concret, tension narrative)
- Recommandé : `"${prenom}, dans 2 semaines tu auras publié tout ton stock — et après ?"` — alarmiste positif, aligné sur l'argument de l'email.

Sévérité : P1 (impact ton de marque — incohérence registre).

**[Observation] Mode "log only" actif — aucun email réel envoyé**

Constat : `EMAIL_PROVIDER` n'est pas configuré → tous les emails passent en mode log console. C'est documenté dans le code et c'est normal pour le stade actuel (MVP pré-production). Aucune action UX requise — à noter pour le suivi opérationnel.

Sévérité : observation (à résoudre avant lancement).

**[Observation] J+7 envoyé à tous les clients incluant les abonnés Pack Mensuel**

Constat : la condition J+7 est `c.status != 'pending'` sans filtre sur le pack. Un client Pack Mensuel reçoit donc les conseils de publication. Le contenu reste pertinent (les conseils s'appliquent à tous), mais si la séquence évolue vers une logique différenciée par pack, ce filtre manquera.

Sévérité : observation (pas un bug aujourd'hui, à anticiper).

---

### Tests UX

| Test | Critère de succès | Statut |
|---|---|---|
| Ton tutoiement sur les 3 emails | 0 "vous" dans les corps d'email | ✅ |
| Prix importés depuis pricing.ts | `PACK_MENSUEL.price` utilisé, pas de valeur hardcodée | ✅ |
| CTA J+2 → /dashboard | `${dashboardUrl}` = baseUrl + "/dashboard" | ✅ |
| CTA J+7 → mailto:support | Lien de contact direct | ✅ |
| CTA J+14 → /#pricing | `${pricingUrl}` = baseUrl + "/#pricing" | ✅ |
| Idempotence email_logs | Double vérification cron + sendEmail() | ✅ |
| CRON_SECRET absent | 500 avec message d'alerte opérationnelle | ✅ |
| CRON_SECRET incorrect | 401 "Accès refusé" | ✅ |
| Admin déclenche manuellement un client | POST avec `client_id`, isEmailSent() vérifié | ✅ |
| Prénom NULL → fallback | "Salut là," — awkward | ❌ |
| Sujet J+14 cohérence registre | "on passait" vs "tu" dans le corps | ❌ |
| Email provider configuré | Mode log only actif | ⚠️ (normal pré-launch) |

**Score Feature 3 : 8.5/10**
Points perdus : -1 fallback prénom / -0.5 incohérence registre sujet J+14

---

## Métriques HEART globales

| Dimension | Feature impactée | Signal observable | Métrique | Cible | Méthode |
|---|---|---|---|---|---|
| **Happiness** | F1 Profil | Sophie repart après avoir modifié son profil | CSAT post-save (enquête 1 question) | >= 8/10 | Survey inline après 1ère sauvegarde |
| **Engagement** | F1 Profil | Nombre de sections remplies | Avg sections complétées par profil | >= 5/7 | Event PostHog `profile_section_saved` |
| **Adoption** | F2 Onboarding | Taux de reprise de brouillon serveur | % sessions où brouillon serveur appliqué vs sessionStorage seul | Mesurer baseline | Event `draft_restored_from_server` |
| **Retention** | F3 Email | Taux d'ouverture email nurturing | Open rate J+2 / J+7 / J+14 | J+2 >= 50%, J+7 >= 35%, J+14 >= 25% | Tracking Resend/Postmark |
| **Task success** | F2 Onboarding | Complétion onboarding après reprise | % qui terminent après restore depuis serveur | >= 75% | Event `onboarding_complete` filtré `draft_restored` |

---

## Récapitulatif des corrections à faire

### P0 — Bloquer avant production

| ID | Feature | Problème | Correction |
|---|---|---|---|
| F1-P0 | Profil | `initialData` non mis à jour après sauvegarde → dirty tracking se désynchronise | Introduire un state `savedData` mis à jour après chaque PATCH réussi. `isSectionDirty` compare avec `savedData` et non `initialData` immuable. |

### P1 — Corriger dans la session

| ID | Feature | Problème | Correction |
|---|---|---|---|
| F1-P1a | Profil | Absence de bouton "Annuler les modifs" par section | Ajouter bouton "Annuler" visible si `dirty === true`, qui reset les champs de la section à `savedData`. |
| F1-P1b | Profil | Navigation mobile longue, pas d'ancres | Ajouter nav d'ancres en flex-wrap sous le h1 sur mobile (<768px). |
| F2-P1 | Onboarding | Flash de contenu pendant fetch brouillon serveur | Conditionner l'affichage du wizard à `draftLoaded === true`. Afficher spinner tant que `false`. |
| F3-P1a | Email | Fallback prénom `"là"` → "Salut là," | Remplacer par `?? "toi"` OU exclure clients sans `first_name` du cron (`AND c.first_name IS NOT NULL`). |
| F3-P1b | Email | Sujet J+14 : "on passait" incohérent avec tutoiement | Réécrire : `"${prenom}, dans 2 semaines tu auras publié tout ton stock — et après ?"` |

---

## Handoff

**Handoff → @fullstack**

Fichiers produits : `/home/user/Mandataire-Immo/docs/ux/audit-features-session7b.md`

Décisions prises :
- Feature 1 et 3 : GO conditionnel — corrections P1 requises mais pas bloquantes pour la mise en production
- Feature 2 : GO — architecture correcte, 1 friction visuelle mineure à corriger
- 1 P0 identifié sur Feature 1 (dirty tracking initialData) — doit être corrigé avant que Sophie ne puisse éditer son profil en production

Points d'attention pour le code :
1. **F1-P0** — `ProfileForm.tsx` : remplacer la comparaison `isSectionDirty` de `initialData` (prop immuable) par un state `savedData` initialisé à `initialData` et mis à jour dans le `if (res.ok)` de `handleSaveSection`
2. **F1-P1a** — `ProfileForm.tsx` : ajouter bouton "Annuler" conditionnel à `dirty === true` dans le footer de chaque section
3. **F1-P1b** — `profile/page.tsx` : ajouter une nav d'ancres flex-wrap entre le sous-titre et `<ProfileForm>`
4. **F2-P1** — `onboarding/page.tsx` : wrapper le JSX du wizard dans `{draftLoaded ? <wizard> : <spinner>}`
5. **F3-P1a** — `nurturing/route.ts` et `admin/send-nurturing/route.ts` : `first_name ?? "toi"` ou ajouter `AND c.first_name IS NOT NULL`
6. **F3-P1b** — `email-templates.ts` ligne 214 : réécrire le sujet de `nurturingJ14`
