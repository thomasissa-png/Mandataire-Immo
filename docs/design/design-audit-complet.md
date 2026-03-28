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

> Audit en cours...

---

### 2. PhotoUploader.tsx

> Audit en cours...

---

### 3. AnnonceBlock.tsx

> Audit en cours...

---

### 4. BienCard.tsx

> Audit en cours...

---

### 5. BienFicheClient.tsx

> Audit en cours...

---

### 6. MesBiensSection.tsx

> Audit en cours...

---

### 7. biens/nouveau/page.tsx

> Audit en cours...

---

### 8. biens/[id]/page.tsx

> Audit en cours...

---

## P0 — Bloquants

> À compléter après lecture de tous les fichiers

---

## P1 — Importants

> À compléter après lecture de tous les fichiers

---

## P2 — Mineurs

> À compléter après lecture de tous les fichiers

---

## Score global /10

> À compléter en fin d'audit

---

## Corrections prioritaires (top 5 actions)

> À compléter en fin d'audit
