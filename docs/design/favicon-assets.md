# Favicon & Assets -- Specifications ImmoCrew

> Specs exactes pour tous les favicons, icones et assets meta du site.
> Couleurs issues de `docs/design/design-tokens.json`.
> Derniere mise a jour : 2026-04-19 (Session 12)

## Couleurs de reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (fond) | `#1B2A4A` | Fond du favicon, theme-color, tiles Windows |
| Secondary (accent) | `#F27A1A` | Icone maison (stroke) |
| Background | `#F8F6F2` | Background du manifest PWA |

## Logo / Icone

Le logo ImmoCrew est une **maison stylisee** (toit + porte) en stroke orange sur fond bleu marine.

SVG source : `src/app/icon.svg` (32x32) et `src/app/apple-icon.svg` (180x180).

## Inventaire des assets

### Fichiers Next.js (App Router convention)

| Fichier | Dimensions | Format | Statut | Notes |
|---------|------------|--------|--------|-------|
| `src/app/icon.svg` | 32x32 | SVG | EXISTE | Favicon principal (Next.js le sert comme `/icon.svg` + genere `/favicon.ico`) |
| `src/app/apple-icon.svg` | 180x180 | SVG | EXISTE | SVG source (conserve comme reference) |
| `src/app/apple-icon.tsx` | 180x180 | PNG (genere) | CREE S12 | Apple Touch Icon PNG dynamique (prioritaire sur le SVG) |
| `src/app/opengraph-image.tsx` | 1200x630 | PNG (genere) | EXISTE | OG image generee dynamiquement |
| `src/app/twitter-image.tsx` | 1200x630 | PNG (genere) | CREE S12 | Twitter Card (summary_large_image) |
| `src/app/manifest.ts` | -- | JSON | MIS A JOUR S12 | Icons SVG + PNG 192x192 + 512x512 |

### Fichiers publics statiques

| Fichier | Dimensions | Format | Statut | Notes |
|---------|------------|--------|--------|-------|
| `public/icon-192x192.png` | 192x192 | PNG | A GENERER (manuel) | Android Chrome icon (manifest) |
| `public/icon-512x512.png` | 512x512 | PNG | A GENERER (manuel) | Android Chrome splash (manifest) |
| `public/browserconfig.xml` | -- | XML | CREE S12 | Tiles Windows/Bing |
| `public/safari-pinned-tab.svg` | any | SVG mono | CREE S12 | Safari pinned tab (monochrome) |

### Metadata layout.tsx

| Meta | Statut | Valeur |
|------|--------|--------|
| `<meta name="theme-color">` | AJOUTE S12 | `#1B2A4A` |
| `<meta name="msapplication-TileColor">` | AJOUTE S12 | `#1B2A4A` |
| `<meta name="msapplication-config">` | AJOUTE S12 | `/browserconfig.xml` |
| `og:image` | EXISTE (via opengraph-image.tsx) | Auto-genere par Next.js |
| `twitter:image` | CREE S12 (via twitter-image.tsx) | Auto-genere par Next.js |

## Generation des PNG

Les fichiers PNG (192x192, 512x512) ne peuvent pas etre generes par du code.

**Option 1 (recommandee)** : utiliser [realfavicongenerator.net](https://realfavicongenerator.net)
1. Uploader `src/app/icon.svg`
2. Couleur theme : `#1B2A4A`
3. Telecharger le package
4. Extraire les PNG dans `public/`

**Option 2** : convertir le SVG avec ImageMagick ou Sharp
```bash
# Si ImageMagick est disponible
convert -background none -resize 192x192 src/app/icon.svg public/icon-192x192.png
convert -background none -resize 512x512 src/app/icon.svg public/icon-512x512.png
```

## JSON-LD Organization

Le `logo` dans le JSON-LD Organization pointe vers `https://immocrew.fr/icon.svg` (corrige S12).
Tous les fichiers qui referençaient `/logo.png` (layout.tsx, a-propos, blog, agent/blog) ont ete mis a jour.

Note : Google recommande un logo PNG 300x300 minimum. Quand un vrai logo PNG sera cree, mettre a jour le champ `logo` dans :
- `src/app/layout.tsx` (organizationJsonLd)
- `src/app/a-propos/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/agent/[slug]/blog/[articleId]/page.tsx`
