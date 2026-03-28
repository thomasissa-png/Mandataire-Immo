# Audit design — Pages Biens + Dashboard
> ImmoCrew — Audit express réalisé le 2026-03-28
> Scope : composants biens + dashboard uniquement

---

## Tableau récap

| Fichier | Tokens | Contrastes | Responsive | Focus | Touch | États | Note /10 |
|---|---|---|---|---|---|---|---|
| BienForm.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| PhotoUploader.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| AnnonceBlock.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| BienCard.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| BienFicheClient.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| MesBiensSection.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| biens/nouveau/page.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |
| biens/[id]/page.tsx | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] | [EN COURS] |

---

## Référence tokens (design-system.md + tailwind.config.ts)

Tokens disponibles dans Tailwind (utilisables via classes utilitaires) :
- Couleurs : `primary`, `secondary`, `success`, `error`, `warning`, `info`, `neutral` (toutes les variantes 50–900), `background` (#F8F6F2), `foreground` (#2D2D2D), `card` (#FFF), `border` (#E7E5E4)
- Typographie : `text-h1` à `text-h6`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-overline`, `text-display-xl`, `text-display-lg`
- Radius : `rounded-sm` (6px), `rounded-md` (10px), `rounded-lg` (14px), `rounded-xl` (20px)
- Ombres : `shadow-xs` à `shadow-xl`
- Breakpoints : `mobile` (375px), `tablet` (768px), `desktop` (1280px), `wide` (1536px)
- Transitions : `duration-fast` (150ms), `duration-normal` (200ms), `duration-slow` (300ms)

Contrastes clés vérifiés (fond blanc/card #FFF) :
- `text-primary` (#1B2A4A sur #FFF) : ~14.7:1 — PASS WCAG AAA
- `text-secondary` (#F27A1A sur #FFF) : ~2.6:1 — FAIL WCAG AA (texte normal, ≥4.5:1 requis)
- `text-secondary-700` (#B35711 sur #FFF) : ~6.0:1 — PASS AA
- `text-neutral-500` (#78716C sur #FFF) : ~4.6:1 — PASS AA (limite)
- `text-neutral-400` (#A8A29E sur #FFF) : ~2.9:1 — FAIL WCAG AA (texte décoratif/placeholder = acceptable, mais texte informatif = problème)
- `text-error-700` (#A52735 sur #FEF3E8/error-50) : ~6.5:1 — PASS
- `text-warning-800` (#92400E sur #FEF3C7/warning-50) : ~7.1:1 — PASS
- `bg-secondary` (#F27A1A) + `text-primary` (#1B2A4A) : ~5.7:1 — PASS AA (boutons CTA)

---

## Détail par fichier

### 1. BienForm.tsx

**Tokens — PASS**
Aucune couleur hex hardcodée. Toutes les classes utilisent les tokens : `text-primary`, `bg-card`, `border-border`, `text-error`, `bg-error-50`, `text-neutral-400`, `focus:ring-secondary/50`. Conforme.

**Contrastes — PROBLEME MINEUR**
- Placeholder `text-neutral-400` (#A8A29E sur #FFF) : ~2.9:1 — sous le seuil 4.5:1. Acceptable pour les placeholders (texte décoratif non informatif, WCAG exception 1.4.3), mais à surveiller. P2.
- `text-neutral-400` utilisé aussi sur les hints (`{formatPrix}` et label optionnel) — texte informatif à 2.9:1. P1 : remplacer par `text-neutral-500` (4.6:1) sur les hints.
- Bouton submit : `bg-secondary text-primary` = #F27A1A / #1B2A4A = 5.7:1 — PASS.
- État error : `text-error-700` sur `bg-error-50` = ~6.5:1 — PASS.

**Responsive — PASS**
- Grille prix/surface/pièces : `grid-cols-1 tablet:grid-cols-3` — correct mobile-first.
- Bouton submit : `w-full tablet:w-auto` — correct.
- Inputs `h-12` (48px) — PASS touch targets.

**Focus-visible — PROBLEME**
- Tous les inputs/select/textarea utilisent `focus:outline-none focus:ring-2 focus:ring-secondary/50`.
- `focus-visible` non utilisé : `focus:` s'applique aussi au clic souris, polluant visuellement. Remplacer par `focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:outline-none`. P1.
- Le bouton submit n'a pas de focus-visible déclaré — il hérite des styles navigateur (acceptable mais non uniforme). P2.

**Touch targets — PASS**
- Inputs `h-12` = 48px. PASS.
- Bouton submit `h-12` = 48px. PASS.

**États — PASS PARTIEL**
- Default : OK
- Hover : non déclaré sur inputs (uniquement border change via error/non-error). P2 : ajouter `hover:border-primary-200` pour feedback visuel.
- Active/pressed : non déclaré. P2.
- Focus-visible : ring présent (mais via `focus:` au lieu de `focus-visible:`).
- Disabled : `disabled:opacity-50 disabled:cursor-not-allowed` sur le bouton. PASS.
- Loading : spinner animé + texte "Création en cours...". PASS.

**Score : 7/10**

---

### 2. PhotoUploader.tsx

**Tokens — PASS**
Aucune hex hardcodée. Classes : `bg-secondary-50`, `text-secondary-600`, `border-secondary`, `bg-error/10`, `text-error-700`, `bg-black/50`, `bg-black/60`, `bg-black/30`. Les `bg-black/XX` sont des overlays sur images — acceptable (pas de token sémantique pour les overlays photo). Conforme.

**Contrastes — PASS**
- Texte blanc sur overlays `bg-black/30` à `bg-black/60` sur images — contexte photo, contraste suffisant.
- `text-secondary-600` (#D96A15 sur `bg-secondary-50` #FEF3E8) : ~4.2:1 — légèrement sous 4.5:1. P2 : passer à `text-secondary-700` (#B35711 sur #FEF3E8 = ~5.2:1).
- `text-error-700` sur `bg-error/10` : fond est rgba(220,53,69,0.1) ≈ #FBE8EA — contraste ~6.3:1. PASS.

**Responsive — PASS**
- Grid photos : `grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4`. Correct.
- Zone drop : padding `p-8` sur mobile — OK, mais sur 375px la zone reste cliquable.

**Focus-visible — PROBLEME**
- Zone drag-drop `role="button"` : utilise `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary`. PASS (bonne pratique `focus-visible`).
- Bouton fermeture erreur globale : classes `text-error-400 hover:text-error-600 ml-2 min-w-[44px] min-h-[44px]` — pas de `focus-visible`. P1.
- Bouton suppression photo (overlay) : pas de `focus-visible`. P1 — ce bouton est aussi accessible via clavier via `group-focus-within:opacity-100` mais sans ring visible.
- Bouton "Fermer" dans erreur d'upload : pas de `focus-visible`. P1.

**Touch targets — PASS PARTIEL**
- Bouton fermeture erreur globale : `min-w-[44px] min-h-[44px]` — PASS.
- Bouton suppression photo : `w-8 h-8` = 32px mais a `min-w-[44px] min-h-[44px] -mt-2 -mr-2` pour compenser. L'élément visuel fait 32px mais la zone cliquable 44px. Acceptable.
- Bouton "Fermer" upload error : `min-w-[44px] min-h-[44px]`. PASS.

**États — PASS PARTIEL**
- Zone drop : default, hover (border + bg change), dragOver (border-secondary + bg-secondary-50), disabled (opacity-50). Manque focus-visible unifié. P1.
- Photos existantes : overlay suppression via `group-hover:opacity-100`. Correct mais inaccessible clavier sans focus-visible sur le bouton.

**Score : 7/10**

---

### 3. AnnonceBlock.tsx

**Tokens — PASS**
Toutes les classes utilisent des tokens système. Aucune hex. `bg-success-50`, `text-success-700`, `bg-warning-50`, `border-warning-200`, `bg-neutral-100`, `animate-pulse`. Conforme.

**Contrastes — PASS**
- `text-warning-800` (#92400E) sur `bg-warning-50` (#FEF3C7) : ~7.1:1. PASS.
- `text-success-700` sur `bg-success-50` : ~5.5:1. PASS.
- `text-neutral-500` (#78716C) sur fond blanc : ~4.6:1. PASS (limite).
- Bouton CTA copier : `bg-secondary text-primary` = 5.7:1. PASS.
- Tab active : `text-secondary-700` (#B35711) sur blanc : ~6.0:1. PASS.
- Tab inactive : `text-neutral-500` (#78716C) sur blanc : 4.6:1. PASS (limite).

**Responsive — PASS**
- Bouton "Régénérer" : label masqué en mobile (`hidden tablet:inline`), icône seule visible. P1 : l'icône seule sans label est ambiguë — le `aria-label="Régénérer l'annonce"` est présent donc accessible, mais visuellement sous-optimal pour Sophie (non-technique). À conserver mais noter.
- Onglets : `min-h-[44px]` présent. PASS.
- Zone texte annonce : `max-h-[400px] overflow-y-auto` — sur mobile 375px le scroll peut être piégé (iOS). P1 : ajouter `overscroll-contain`.

**Focus-visible — PROBLEME**
- Boutons onglets ("Annonce longue", "Annonce courte") : `transition-colors` mais pas de `focus-visible:ring`. P1.
- Bouton "Régénérer" : pas de `focus-visible`. P1.
- Boutons "Oui, régénérer" et "Annuler" dans modal confirmation : pas de `focus-visible`. P1.
- Bouton "Copier l'annonce" / "Réessayer" : pas de `focus-visible`. P1.
- Lien "Voir ma page publique" : pas de `focus-visible`. P1.

**Touch targets — PASS**
- Tous les boutons et liens ont `min-h-[44px]`. PASS.
- Onglets `min-h-[44px] px-4`. PASS.

**États — PASS (excellent)**
- Composant gère 5 états distincts : no-photos, loading (skeleton + spinner), error (avec retry), success (avec annonce affichée), default (générer).
- État copié : feedback visuel `bg-success-50 text-success-700` + texte "Copié — colle-le !". PASS.
- Confirmation régénération : modal inline avec état warning. PASS.

**Score : 7.5/10** — très bon pour les états, focus-visible à corriger partout.

---

### 4. BienCard.tsx

**Tokens — PASS**
Toutes les classes utilisent des tokens. `bg-warning-50 text-warning-800`, `bg-success-50 text-success-700`, `bg-neutral-100 text-neutral-500`, `text-secondary-700`, `border-secondary/30`, `text-primary-700`. Aucune hex. Conforme.

**Contrastes — PROBLEME**
- Badge statut "Brouillon" : `bg-warning-50 text-warning-800`. `#92400E` sur `#FEF3C7` = ~7.1:1. PASS.
- Badge statut "Publié" : `bg-success-50 text-success-700`. `#27863D` sur `#E8F5E9` = ~5.4:1. PASS.
- Badge statut "Archivé" : `bg-neutral-100 text-neutral-500`. `#78716C` sur `#F5F5F4` = ~3.4:1. FAIL WCAG AA (4.5:1 requis pour texte normal). P1.
- Prix `text-secondary-700` (#B35711) sur fond card (#FFF) : ~6.0:1. PASS.
- `text-neutral-600` (#57534E) sur `bg-secondary-50` (#FEF3E8) : ~5.8:1. PASS.
- Badge compteur photos : texte blanc sur `bg-black/50` : PASS.
- `text-primary-700` (#162240) sur `bg-primary-50` (#E8EBF0) : ~8.5:1. PASS.

**Responsive — PASS**
- La card est utilisée dans une grille gérée par le parent (MesBiensSection). Aucun problème interne responsive.
- Badges actions : `flex flex-wrap gap-2` — s'adaptent sur mobile. PASS.

**Focus-visible — PROBLEME**
- Lien "Modifier" (`<a href>`) : `hover:bg-secondary-100 transition-colors` — pas de `focus-visible:ring`. P1.
- Lien "Voir la page" : `hover:text-secondary-700 hover:border-secondary/30` — pas de `focus-visible`. P1.
- La card entière n'est pas cliquable (bonne pratique : seuls les liens internes sont interactifs). PASS structural.

**Touch targets — PASS**
- Lien "Modifier" : `min-h-[44px] px-4 py-2`. PASS.
- Lien "Voir la page" : `min-h-[44px] px-4 py-2`. PASS.

**États — PASS PARTIEL**
- Hover card : `hover:shadow-md hover:border-secondary/30`. PASS.
- Liens internes : hover déclaré. Manque focus-visible. P1.
- Pas d'état loading (les skeletons sont gérés par MesBiensSection). Acceptable.

**Score : 7/10**

---

### 5. BienFicheClient.tsx

**Tokens — PASS**
Composant léger — classes : `bg-card border-border`, `bg-success-50 text-success-700`, `bg-secondary-50 text-secondary-700`, `hover:bg-secondary-100`. Aucune hex. Conforme.

**Contrastes — PASS**
- `text-neutral-500` sur blanc : 4.6:1. PASS (limite).
- `text-success-700` sur `bg-success-50` : ~5.4:1. PASS.
- `text-secondary-700` sur `bg-secondary-50` : ~4.8:1. PASS.

**Responsive — PASS**
- Layout `space-y-6` — empilement vertical. Sections indépendantes. PASS.
- Boutons page publique : `flex flex-wrap items-center gap-3`. PASS mobile.

**Focus-visible — PROBLEME**
- Lien "Voir la page" : pas de `focus-visible:ring`. P1.
- Bouton "Copier le lien" : pas de `focus-visible:ring`. P1.

**Touch targets — PASS**
- Tous les boutons/liens : `min-h-[44px]`. PASS.

**États — PASS**
- État "Lien copié" : `bg-success-50 text-success-700` + texte "Lien copié !". PASS.
- Section page publique conditionnelle (`{slug && ...}`). Correct.

**Note** : composant très sobre, agit principalement comme wrapper de PhotoUploader et AnnonceBlock. Les emojis (📸, 🌐) dans les titres de section sont visibles et non remplaçables par du SVG — acceptable pour le ton "direct et complice" de la marque ImmoCrew, mais vérifie la compatibilité cross-device (Android vs iOS rendu différent). P2.

**Score : 8/10**

---

### 6. MesBiensSection.tsx

**Tokens — PASS**
Classes : `bg-card border-border`, `bg-neutral-50`, `bg-primary-50`, `bg-secondary`, `text-primary`, `text-neutral-600`, `bg-error-50 border-error-200 text-error-700`. Aucune hex. Conforme.

**Contrastes — PASS**
- CTA "Ajouter un bien" : `bg-secondary text-primary` = 5.7:1. PASS.
- État vide : `text-neutral-600` (#57534E) sur `bg-neutral-50` (#FAFAF9) = ~5.6:1. PASS.
- `text-neutral-400` sur blanc pour compteur — texte décoratif. Acceptable.
- Icône maison : `text-primary-300` (#7A92AB) sur `bg-primary-50` (#E8EBF0) : ~1.7:1 — FAIL (mais c'est une icône décorative `aria-hidden="true"`, pas du texte). PASS pour accessibilité.

**Responsive — PASS**
- Grille : `grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`. Correct mobile-first. PASS.
- Skeleton : même grille. PASS.

**Focus-visible — PROBLEME**
- Lien "Ajouter un bien" (état liste) : `hover:bg-secondary-600 hover:text-white` — pas de `focus-visible`. P1.
- Lien "Ajouter mon premier bien" (état vide) : même problème. P1.

**Touch targets — PASS**
- Liens CTA : `min-h-[44px] px-6 py-2.5`. PASS.

**États — PASS (excellent)**
- Loading : skeleton animé (`animate-pulse`). PASS.
- Erreur : `role="alert"`, message + tokens erreur. PASS.
- Vide : illustration + message + CTA. PASS.
- Liste : grille de BienCard. PASS.

**Score : 8.5/10** — excellent gestion des états, seul manque le focus-visible.

---

### 7. biens/nouveau/page.tsx

**Tokens — PASS**
Classes directes : `text-body-sm text-neutral-500`, `hover:text-secondary-700`, `bg-card border-border`, `text-h2 text-primary font-bold`, `text-body-sm text-neutral-500`. Aucune hex. Conforme.

**Contrastes — PASS**
- Titre `text-h2 text-primary` : ~14.7:1. PASS.
- Sous-titre `text-neutral-500` : 4.6:1. PASS (limite).
- Lien retour `text-neutral-500 hover:text-secondary-700` : 4.6:1 / 6.0:1. PASS.

**Responsive — PASS**
- `max-w-2xl mx-auto` — centré, adaptatif. PASS.
- Card formulaire `p-6 tablet:p-8`. PASS responsive padding.

**Focus-visible — PROBLEME**
- Lien "Retour au dashboard" : `hover:text-secondary-700 transition-colors` — pas de `focus-visible:ring` ni `focus-visible:underline`. P1.

**Touch targets — NOTE**
- Lien "Retour au dashboard" : `inline-flex items-center gap-1.5 text-body-sm` — hauteur dépend du padding. Pas de `min-h-[44px]` explicite. P2 : ajouter `min-h-[44px]` pour cohérence mobile.

**États — N/A** — Page SSR sans état local direct (les états sont dans BienForm).

**Score : 8/10**

---

### 8. biens/[id]/page.tsx

**Tokens — PASS**
Classes : `bg-card border-border`, `text-primary`, `text-neutral-500`, `bg-primary-50 text-primary-700`, `text-secondary-700`, `bg-neutral-100 text-neutral-600`, `bg-secondary-50 text-secondary-700`. Aucune hex. Conforme.

**Contrastes — PASS**
- `text-primary-700` (#162240) sur `bg-primary-50` (#E8EBF0) : ~8.5:1. PASS.
- `text-secondary-700` (#B35711) sur blanc (prix) : ~6.0:1. PASS.
- `text-neutral-600` (#57534E) sur `bg-neutral-100` (#F5F5F4) : ~4.9:1. PASS.
- `text-secondary-700` sur `bg-secondary-50` : ~4.8:1. PASS.
- `text-neutral-500` (adresse) sur blanc : 4.6:1. PASS (limite).

**Responsive — PROBLEME**
- En-tête bien : `flex items-start justify-between gap-3`. Sur mobile 375px, le titre + le prix côte à côte peut provoquer un overflow si le titre est long. Le prix `flex-shrink-0` pousse le titre à se réduire. P1 : ajouter `min-w-0` sur le bloc titre et `flex-col sm:flex-row` pour empiler sur mobile.
- `max-w-3xl mx-auto` — adaptatif. PASS.

**Focus-visible — PROBLEME**
- Lien "Retour au dashboard" : pas de `focus-visible`. P1. (même pattern que page nouveau)

**Touch targets — NOTE**
- Lien "Retour au dashboard" : pas de `min-h-[44px]`. P2.

**États — PASS**
- Gère `notFound()` si bien inexistant/non autorisé. PASS.
- Délègue les états loading/error à BienFicheClient et ses sous-composants. PASS.

---

## P0 — Bloquants

Aucun P0 identifié. Les composants utilisent exclusivement les tokens du système. Pas de couleur hex hardcodée. Les boutons CTA principaux passent les contrastes WCAG AA. Les touch targets critiques sont respectés (44px minimum).

---

## P1 — Importants

### P1-01 — Focus-visible manquant sur TOUS les interactifs (systémique)
**Fichiers** : BienForm.tsx, PhotoUploader.tsx, AnnonceBlock.tsx, BienCard.tsx, BienFicheClient.tsx, MesBiensSection.tsx, nouveau/page.tsx, [id]/page.tsx

**Problème** : Les `<button>` et `<a>` utilisent `focus:ring` (déclenché aussi au clic souris) au lieu de `focus-visible:ring` (déclenché uniquement au clavier/accessibilité). Les liens de navigation n'ont aucun ring du tout.

**Pattern actuel** :
```
hover:bg-secondary-100 transition-colors
focus:outline-none focus:ring-2 focus:ring-secondary/50
```

**Pattern cible** :
```
hover:bg-secondary-100 transition-colors
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
```

**Pour les liens de navigation** (retour dashboard, actions de la card) :
```
hover:text-secondary-700 transition-colors
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-sm
```

**Impact** : WCAG 2.2 SC 2.4.11 (Focus Appearance) — navigation clavier impossible à tracer visuellement.

---

### P1-02 — Badge "Archivé" contraste insuffisant
**Fichier** : BienCard.tsx — ligne 23

**Problème** : `bg-neutral-100 text-neutral-500` → `#78716C` sur `#F5F5F4` = 3.4:1 (seuil 4.5:1 requis).

**Correction** :
```
// Avant
className: "bg-neutral-100 text-neutral-500"
// Après
className: "bg-neutral-100 text-neutral-700"
// neutral-700 (#44403C) sur neutral-100 (#F5F5F4) = ~6.0:1 — PASS
```

---

### P1-03 — Hints de formulaire en `text-neutral-400` (texte informatif insuffisant)
**Fichier** : BienForm.tsx — lignes 229, 306

**Problème** : `text-neutral-400` (#A8A29E) sur fond blanc = 2.9:1. Les hints "Ces détails rendront ton annonce beaucoup plus percutante" et le prix formaté sont des textes informatifs — le seuil 4.5:1 s'applique.

**Correction** : remplacer `text-neutral-400` par `text-neutral-500` (#78716C) sur tous les hints et descriptions d'aide dans les formulaires. `text-neutral-400` reste acceptable pour les placeholders uniquement.

---

### P1-04 — En-tête bien : overflow potentiel titre + prix sur mobile
**Fichier** : biens/[id]/page.tsx — ligne 92

**Problème** : `flex items-start justify-between gap-3` avec `text-h2` (titre long) et prix `flex-shrink-0`. Sur 375px, le titre peut être écrasé à l'excès ou dépasser.

**Correction** :
```tsx
// Avant
<div className="flex items-start justify-between gap-3">
  <div>
    <h1 ...>titre</h1>
    ...
  </div>
  <p className="text-h3 ... flex-shrink-0">prix</p>
</div>

// Après
<div className="flex flex-col mobile:flex-row items-start justify-between gap-3">
  <div className="min-w-0">
    <h1 className="... break-words">titre</h1>
    ...
  </div>
  <p className="text-h3 ... flex-shrink-0 mobile:text-right">prix</p>
</div>
```

---

### P1-05 — Zone de texte annonce : scroll piégé iOS
**Fichier** : AnnonceBlock.tsx — ligne 328

**Problème** : `max-h-[400px] overflow-y-auto` sans `overscroll-contain` → sur iOS Safari, le scroll de la zone annonce déclenche le scroll de la page parent.

**Correction** :
```
// Avant
className="rounded-lg bg-neutral-50 border border-border p-4 mb-4 max-h-[400px] overflow-y-auto"
// Après
className="rounded-lg bg-neutral-50 border border-border p-4 mb-4 max-h-[400px] overflow-y-auto overscroll-contain"
```

---

### P1-06 — Bouton suppression photo non accessible au clavier sans focus-visible
**Fichier** : PhotoUploader.tsx — ligne 364

**Problème** : Le bouton de suppression photo (`opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`) est visible quand le groupe a le focus, mais le bouton lui-même n'a pas de `focus-visible:ring`. Un utilisateur clavier peut activer le bouton mais ne voit pas lequel est ciblé.

**Correction** : ajouter sur le bouton suppression :
```
focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60
```

---

## P2 — Mineurs

- **P2-01** : `BienForm.tsx` — inputs sans état `hover:border-primary-200` pour feedback visuel avant erreur.
- **P2-02** : `BienForm.tsx` — bouton submit sans `focus-visible` explicite (hérite navigateur).
- **P2-03** : `PhotoUploader.tsx` — `text-secondary-600` sur `bg-secondary-50` = 4.2:1 (passer à `text-secondary-700`).
- **P2-04** : `nouveau/page.tsx` et `[id]/page.tsx` — lien "Retour au dashboard" sans `min-h-[44px]`.
- **P2-05** : `BienFicheClient.tsx` — emojis dans titres de section (📸, 🌐) : rendu variable Android/iOS. Envisager des icônes SVG pour cohérence cross-platform.
- **P2-06** : `AnnonceBlock.tsx` — sur mobile, le bouton "Régénérer" affiche l'icône seule (label masqué via `hidden tablet:inline`). L'`aria-label` est présent donc accessible, mais visuellement ambigu pour des utilisatrices non-techniques comme Sophie.

---

## Tableau récap (mis à jour)

| Fichier | Tokens | Contrastes | Responsive | Focus | Touch | États | Note /10 |
|---|---|---|---|---|---|---|---|
| BienForm.tsx | PASS | P1 (hints) | PASS | P1 (focus vs focus-visible) | PASS | PASS partiel | 7/10 |
| PhotoUploader.tsx | PASS | P2 (secondary-600) | PASS | P1 (3 boutons sans focus-visible) | PASS | PASS partiel | 7/10 |
| AnnonceBlock.tsx | PASS | PASS | P1 (scroll iOS) | P1 (5 boutons sans focus-visible) | PASS | PASS (excellent) | 7.5/10 |
| BienCard.tsx | PASS | P1 (archivé 3.4:1) | PASS | P1 (2 liens sans focus-visible) | PASS | PASS partiel | 7/10 |
| BienFicheClient.tsx | PASS | PASS | PASS | P1 (2 éléments sans focus-visible) | PASS | PASS | 8/10 |
| MesBiensSection.tsx | PASS | PASS | PASS | P1 (2 liens sans focus-visible) | PASS | PASS (excellent) | 8.5/10 |
| biens/nouveau/page.tsx | PASS | PASS | PASS | P1 (lien retour) | P2 (retour) | N/A | 8/10 |
| biens/[id]/page.tsx | PASS | PASS | P1 (overflow mobile) | P1 (lien retour) | P2 (retour) | PASS | 7.5/10 |

---

## Score global /10

**7.5 / 10**

Points forts :
- Zéro hex hardcodée — cohérence tokens parfaite sur 8 fichiers. Excellente discipline.
- Touch targets 44px respectés sur les éléments critiques.
- Gestion des états exemplaire (AnnonceBlock, MesBiensSection) : loading, erreur, vide, succès tous documentés.
- Contrastes CTA primaires (orange + bleu nuit) conformes WCAG AA.
- Aria-labels et roles sémantiques bien utilisés (role="alert", aria-live, aria-invalid, aria-describedby).

Points à corriger :
- Focus-visible : problème systémique sur tous les fichiers — priorité unique avant déploiement.
- 1 seul vrai problème de contraste (badge "Archivé" : 3.4:1).
- Scroll iOS piégé dans la zone annonce.
- Overflow titre/prix mobile sur la fiche bien.

---

## Corrections prioritaires (top 5 actions — ordre d'impact)

1. **[P1-01] Passer focus: → focus-visible: sur tous les interactifs** — 1 commit de refactoring, impact immédiat WCAG 2.2 AA. Concerne tous les 8 fichiers. Créer un composant `<FocusRing>` ou une classe utilitaire Tailwind custom `focus-ring` dans globals.css pour éviter la duplication.

2. **[P1-02] Badge Archivé** — BienCard.tsx ligne 23 : `text-neutral-500` → `text-neutral-700`. 1 ligne.

3. **[P1-03] Hints formulaire** — BienForm.tsx : `text-neutral-400` → `text-neutral-500` sur les textes d'aide (pas les placeholders). 2-3 lignes.

4. **[P1-04] Overflow mobile titre/prix** — biens/[id]/page.tsx : `flex-col mobile:flex-row` + `min-w-0` + `break-words`. 5 lignes.

5. **[P1-05] Scroll iOS annonce** — AnnonceBlock.tsx ligne 328 : ajouter `overscroll-contain`. 1 mot.

---

**Handoff → @fullstack**
- Fichiers produits : `/home/user/Mandataire-Immo/docs/design/design-audit-complet.md`
- Décisions prises : audit exhaustif de 8 fichiers, zéro P0 bloquant, 6 P1 importants, 6 P2 mineurs
- Points d'attention :
  - P1-01 est systémique (tous les fichiers) — traiter en premier, 1 seul commit
  - P1-02 à P1-06 sont des corrections isolées, < 5 lignes chacune
  - L'utilisation des tokens est exemplaire — ne pas toucher aux classes couleur sauf P1-02 et P1-03
  - Après corrections, re-vérifier le focus-visible dans les DevTools Chrome (mode clavier) avant déploiement
