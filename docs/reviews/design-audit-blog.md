# Audit Design — Page Blog ImmoCrew
Date : 2026-04-01 | Auditeur : @design

---

## Scores par critère

| Critère | Score | Statut |
|---|---|---|
| Structure & Layout | 8/10 | Bon |
| Visuels & Thumbnails | 6/10 | A corriger |
| Responsive | 8/10 | Bon |
| Page article [slug] | 8/10 | Bon |
| Tokens & conformité design system | 9/10 | Très bon |

**Score global : 7.8/10**

---

## P0 — Bloquant

### P0-1 — Grille "3 colonnes" mais cards en format liste horizontale
**Fichier** : `BlogGrid.tsx` ligne 69-119

La grille déclare `desktop:grid-cols-3` mais chaque card est en `flex` horizontal (thumbnail 100px + contenu texte). Résultat : sur 3 colonnes desktop, les cards sont trop étroites pour ce layout — le thumbnail de 100px `flex-shrink-0` écrase la zone texte à ~200px. En dessous de ~380px de largeur de card, le titre `line-clamp-2` est illisible (3-4 mots par ligne).

**Correction** : passer les cards en layout vertical (flex-col) sur desktop 3 colonnes. Thumbnail en header de card (aspect-ratio 16:9, pleine largeur), contenu en dessous. Conserver le layout horizontal uniquement sur mobile 1 colonne où la largeur de card est suffisante.

```tsx
// Card desktop : layout vertical
<Link className="group flex flex-col bg-white rounded-xl border ...">
  {/* Thumbnail pleine largeur en haut */}
  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
    <Image fill ... />
  </div>
  {/* Contenu dessous */}
  <div className="flex flex-col flex-1 p-4"> ... </div>
</Link>
```

---

### P0-2 — Hero image article : 80px sur mobile = inutilisable
**Fichier** : `ArticleHeroImage.tsx` ligne 27

`h-[80px]` sur mobile rend l'image hero décorative sans valeur — trop petite pour créer une impression visuelle. Soit hausser à `h-[160px]` minimum sur mobile, soit supprimer le rendu mobile et afficher uniquement tablet+.

**Correction** :
```tsx
<figure className="relative w-full h-[160px] tablet:h-[260px] rounded-xl overflow-hidden mb-8">
```

---

## P1 — Majeur

### P1-1 — Badge "Nouveau" : contraste insuffisant
**Fichier** : `BlogGrid.tsx` ligne 99

`text-success-800` (#1B5E2A) sur `bg-success-50` (#E8F5E9). Contraste calculé : ~4.2:1. En dessous du seuil WCAG AA 4.5:1 pour le texte à 12px (`text-caption`).

**Correction** : passer à `bg-success-100 text-success-900` ou `bg-success-600 text-white` (contraste >7:1).

---

### P1-2 — focus-visible absent sur les boutons CategoryFilter
**Fichier** : `CategoryFilter.tsx` lignes 27-49

Les `<button>` de filtres n'ont pas de classe `focus-visible:ring-2 focus-visible:ring-offset-2`. Sur fond `bg-neutral-100`, le focus navigateur par défaut est quasi invisible. Non conforme WCAG 2.2 AA.

**Correction** : ajouter sur chaque button :
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

---

### P1-3 — Cards articles : hauteur non uniforme sur tablette 2 colonnes
**Fichier** : `BlogGrid.tsx`

Le layout horizontal (thumbnail + texte) sans `items-stretch` sur la grille produit des cards de hauteurs variables selon la longueur du titre. Sur 2 colonnes tablette, les lignes sont visuellement bancales.

**Correction** : les cards `<Link>` ont déjà `flex` mais pas `h-full` sur le conteneur grille. Ajouter `items-start` sur la grille et `h-full` sur chaque card, ou utiliser `grid` interne pour aligner.

---

### P1-4 — Partage social : icônes texte seules, touch targets 40px sur mobile
**Fichier** : `[slug]/page.tsx` lignes 207-231

Les boutons LinkedIn/Facebook/Twitter font `h-10` (40px). En dessous du minimum 44px WCAG mobile. Sur iPhone 375px, trois boutons en `flex gap-3` avec `px-4` : pas assez de surface tactile.

**Correction** : passer à `h-11 px-5` (44px). Ajouter icônes SVG à gauche du label pour recognition visuelle.

---

## P2 — Mineur

### P2-1 — Breadcrumb : séparateur `>` en texte brut
**Fichier** : `[slug]/page.tsx` ligne 149

`<span>&gt;</span>` s'affiche comme `>`. Remplacer par `/` ou `›` (`&rsaquo;`) plus élégant, ou par une icône SVG chevron-right 12px conforme au design system.

---

### P2-2 — Section hero blog : `max-w-4xl` incohérent avec `max-w-3xl` article
**Fichiers** : `blog/page.tsx` ligne 33 vs `[slug]/page.tsx` ligne 137

La page liste utilise `max-w-4xl` (896px), la page article `max-w-3xl` (768px). Le jump de largeur entre les deux pages est perceptible. Unifier à `max-w-3xl` sur les deux pour une expérience fluide.

---

### P2-3 — Grille articles liés : `gap-6` vs `gap-4` dans la grille principale
**Fichier** : `[slug]/page.tsx` ligne 261

Les articles liés utilisent `gap-6` (24px) alors que la grille principale utilise `gap-4` (16px). Incohérence mineure mais visible. Unifier à `gap-4`.

---

### P2-4 — Couleur `border-l-primary-700` hardcodée dans ArticleCover
**Fichier** : `ArticleCover.tsx` ligne 28

`border-l-primary-700` est un token primitif utilisé directement dans la logique métier des catégories. Acceptable ici car c'est un fichier de mapping de tokens, pas un composant — mais noter pour future migration vers tokens sémantiques de catégorie.

---

## Points forts (à conserver)

- Architecture composants claire : BlogGrid / CategoryFilter / ArticleCover séparés
- Design tokens bien utilisés partout — zéro couleur hex en dur dans les composants
- `getCategoryStyle()` + `border-l-4` coloré = identifiant visuel catégorie efficace et cohérent
- Empty state propre avec message contextualisé
- `aria-label` sur la tablist CategoryFilter, `role="tab"` correct
- `dangerouslySetInnerHTML` isolé dans `prose-immocrew` — styles markdown centralisés
- CTA article bien encadré dans `bg-primary-50 rounded-xl` avec prix dynamique via `formatPrice(PACK_MENSUEL)` — prix jamais hardcodé
- Breakpoints cohérents : utilisation de `tablet:` / `desktop:` (custom Tailwind) et non `md:` / `lg:` — conforme à la convention projet

---

## Résumé des corrections prioritaires

| # | Fichier | Correction | Criticité |
|---|---|---|---|
| 1 | BlogGrid.tsx | Cards vertical layout sur 3 colonnes desktop | P0 |
| 2 | ArticleHeroImage.tsx | Hero mobile min 160px | P0 |
| 3 | BlogGrid.tsx | Badge Nouveau — contraste WCAG | P1 |
| 4 | CategoryFilter.tsx | focus-visible sur boutons filtres | P1 |
| 5 | [slug]/page.tsx | Touch targets partage social 44px | P1 |
| 6 | [slug]/page.tsx | max-w-3xl uniformisé liste + article | P2 |

---

**Handoff → @fullstack**
- Fichiers produits : `docs/reviews/design-audit-blog.md`
- Corrections P0 à implémenter en priorité : layout card BlogGrid (vertical sur 3 col desktop) + hauteur hero image mobile (160px)
- Corrections P1 : contraste badge Nouveau, focus-visible CategoryFilter, touch targets partage social
- Corrections P2 : optionnelles, amélioration de polish
- Point d'attention : le changement de layout card (P0-1) impacte potentiellement `ArticleThumbnail.tsx` — vérifier que le composant supporte un ratio 16:9 pleine largeur
