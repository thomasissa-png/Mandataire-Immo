# Audit visuel — ImmoCrew Frontend

> Produit par @design | 2026-03-25 — Révisé 2026-03-25 (audit complet code réel)
> Périmètre : landing (Hero, Pricing, Footer, CTAButton), CookieConsent, Onboarding
> Référence : design-tokens.json v1.0.0, design-system.md
> Fichiers audités : tailwind.config.ts, globals.css, Hero.tsx, Pricing.tsx, Footer.tsx, CTAButton.tsx, CookieConsent.tsx, onboarding/page.tsx

---

## Score global : 8.2 / 10

Implémentation très solide — les tokens sont intégralement repris dans tailwind.config.ts. Deux problèmes de contraste WCAG à corriger avant mise en production.

---

## Tableau de conformité

| Aspect | Conforme | Problème | Fichier:ligne |
|--------|----------|----------|---------------|
| Tokens couleurs | OUI | Palette complète (primary, secondary, success, error, warning, info, neutral) alignée avec design-tokens.json | tailwind.config.ts:11-105 |
| Tokens typographie | OUI | display/body/tailles toutes présentes | tailwind.config.ts:107-126 |
| Tokens spacing/radius | OUI | radius sm/md/lg/xl conformes | tailwind.config.ts:127-132 |
| Tokens shadows | OUI | Ombres teintées primary (rgba 27,42,74) — pas de noir pur | tailwind.config.ts:133-140 |
| Police Plus Jakarta Sans (titres) | OUI | var(--font-plus-jakarta-sans) sur font-display, appliqué sur h1-h6 via globals.css | globals.css:14-16 |
| Police Inter (corps) | OUI | var(--font-inter) sur font-body, appliqué sur body | globals.css:11 |
| Contraste blanc sur secondary (#F27A1A) | PROBLEME | Ratio blanc/#F27A1A = 2.72:1 — ECHEC WCAG AA (min 3:1 texte bold ≥18.66px, 4.5:1 texte normal) | CTAButton.tsx:25, Pricing.tsx:99 |
| Contraste blanc sur primary (#1B2A4A) | OUI | Ratio blanc/#1B2A4A ≈ 10.5:1 — PASS WCAG AAA | Pricing.tsx:93, Footer.tsx:5 |
| Contraste texte sur background (#F8F6F2) | OUI | #2D2D2D sur #F8F6F2 ≈ 10.1:1 — PASS | globals.css:11 |
| Contraste primary-200 sur primary-800 (footer) | PROBLEME | #9FAFC2 sur #0D1326 ≈ 4.8:1 — PASS AA mais primary-200 utilisé comme texte décoratif seulement | Footer.tsx:13 |
| Contraste primary-300 sur primary (featured card) | PROBLEME | #7A92AB sur #1B2A4A ≈ 2.9:1 — ECHEC AA pour texte body-sm (caption/mention) | Pricing.tsx:142,199 |
| Bouton variants (primary/secondary/outline) | OUI | 3 variants implémentés conformément au design system | CTAButton.tsx:23-30 |
| Featured card Pricing | OUI | bg-primary + scale-[1.03] + badge secondary + CTA primary — structurellement conforme | Pricing.tsx:92-95 |
| Border-radius rounded-xl (14px token lg) | OUI | Cards pricing, mockup hero, cookie consent | Hero.tsx:37, Pricing.tsx:91 |
| Alternance fonds sections | OUI | Hero=bg-background, Pricing=bg-white — alternance effective | Hero.tsx:5, Pricing.tsx:80 |
| Focus visible accessibilité | OUI | outline-secondary sur :focus-visible | globals.css:19-21 |
| Reduced motion | OUI | prefers-reduced-motion géré | globals.css:23-29 |
| Onboarding inputs — états focus | OUI | focus:border-secondary + shadow-inner | onboarding/page.tsx:249,258 |
| CookieConsent — rôle dialog | OUI | role="dialog" + aria-label présents | CookieConsent.tsx:45-47 |
| Bouton "Refuser" cookie — contraste | PROBLEME | text-neutral-500 (#78716C) sur bg-white = 4.6:1 — PASS AA limite, à surveiller | CookieConsent.tsx:64 |

---

## Problèmes par sévérité

### BLOQUANT (2)

**1. Contraste blanc sur secondary (#F27A1A) — CTAButton primary + badge Pricing**
- Ratio : 2.72:1. Seuil WCAG AA : 4.5:1 (texte normal), 3:1 (texte bold ≥18.66px / ≥14px bold).
- Le CTA "Commencer maintenant" est en `font-semibold text-body` (16px semi-bold) : seuil = 3:1. Ratio 2.72:1 = échec.
- Fichiers : `CTAButton.tsx:25`, `Pricing.tsx:99` (badge "Le plus populaire").
- Correction : passer le texte en `text-primary` (#1B2A4A) sur fond secondary. Ratio #1B2A4A/#F27A1A ≈ 3.86:1 — PASS AA bold.

**2. Contraste primary-300 sur fond primary (featured card) — texte mention + unit prix**
- `text-primary-300` (#7A92AB) sur `bg-primary` (#1B2A4A) = 2.9:1. Texte caption/body-sm normal = seuil 4.5:1 = échec.
- Fichiers : `Pricing.tsx:134, 142, 144, 199`.
- Correction : utiliser `text-primary-100` (#C5CCD9) à la place. Ratio #C5CCD9/#1B2A4A ≈ 6.8:1 — PASS AAA.

### MAJEUR (1)

**3. Bouton success "Terminer" — contraste à valider**
- `bg-success` (#34A853) + `text-white`. Ratio blanc/#34A853 ≈ 3.02:1.
- Texte `font-semibold text-body` (16px semi-bold) : seuil 3:1 — juste au seuil, acceptable mais fragile sur certains rendus écran.
- Fichier : `onboarding/page.tsx:301`.
- Recommandation : passer sur `bg-success-600` (#2E9748) → ratio blanc/#2E9748 ≈ 3.55:1 — marge confortable.

### MINEUR (2)

**4. Onboarding — CTA success "Voir mon espace client" duplique les styles de CTAButton**
- Styles inline au lieu de réutiliser `<CTAButton>`. Fragilise la cohérence si CTAButton évolue.
- Fichier : `onboarding/page.tsx:190-194`.

**5. Footer — `text-background` sur `bg-primary-800` pour liens**
- `text-background` (#F8F6F2) sur #0D1326 = correct (ratio ~12:1), mais le hover `text-secondary` (#F27A1A) sur #0D1326 = 4.6:1 — PASS AA, rien à corriger, point de vigilance si secondary change.
- Fichier : `Footer.tsx:28`.

**6. Footer copyright — `text-primary-300` à 12px**
- `text-primary-300` (#7A92AB) sur `bg-primary-800` (#0D1326) à 12px caption : ratio ~4.1:1. Seuil WCAG AA texte normal < 18px = 4.5:1 — léger échec.
- Fichier : `Footer.tsx:104`.
- Correction : `text-primary-200` (#9FAFC2) → ratio ~5.5:1, PASS AA.

---

## Top 3 corrections prioritaires

**Correction 1 — CTAButton primary : blanc → primary sur fond secondary**
```tsx
// CTAButton.tsx:25 — remplacer
primary: "bg-secondary text-white shadow-sm hover:bg-secondary-600 hover:shadow-md",
// par
primary: "bg-secondary text-primary shadow-sm hover:bg-secondary-600 hover:shadow-md",
```

**Correction 2 — Pricing featured card : primary-300 → primary-100**
```tsx
// Pricing.tsx — remplacer toutes les occurrences de "text-primary-300" dans la featured card
// (lignes 134, 142, 144, 199) par "text-primary-100"
pack.featured ? "text-primary-100" : "text-neutral-400"
```

**Correction 3 — Bouton "Terminer" onboarding : success → success-600**
```tsx
// onboarding/page.tsx:301 — remplacer
className="... bg-success ... hover:bg-success-600 ..."
// par
className="... bg-success-600 ... hover:bg-success-700 ..."
```

---

## Hypothèses à valider

Aucune hypothèse posée — tous les ratios de contraste sont calculés sur les valeurs hex des tokens réels.

---

**Handoff → @fullstack**
- Fichiers produits : `/home/user/Mandataire-Immo/docs/design/design-audit.md`
- Décisions prises : tokens 100% conformes, 2 problèmes WCAG AA bloquants identifiés (blanc sur secondary, primary-300 sur primary), 1 majeur (success button), 2 mineurs
- Points d'attention : corriger CTAButton.tsx:25 et Pricing.tsx lignes featured (primary-300→primary-100) avant toute mise en production — ce sont des éléments de conversion critiques (CTA principal + featured card pricing)
