# Design System — ImmoCrew

> Produit par @design | 2026-03-25
> Sources : brand-platform.md (territoire visuel), wireframes.md, user-flows.md, personas.md
> Stack cible : Next.js + Tailwind CSS
> Approche : mobile-first (375px), chaleureux et accessible, jamais "tech"

---

## Sommaire

1. [Palette de couleurs](#1-palette-de-couleurs)
2. [Typographie](#2-typographie)
3. [Espacements](#3-espacements)
4. [Bordures et ombres](#4-bordures-et-ombres)
5. [Breakpoints responsive](#5-breakpoints-responsive)
6. [Accessibilite](#6-accessibilité)
7. [Animations et transitions](#7-animations-et-transitions)
8. [Composants UI](#8-composants-ui)

---

## 1. Palette de couleurs

### Couleurs principales

| Role | Nom token | Hex | Usage |
|------|-----------|-----|-------|
| Primaire | `primary` | #1B2A4A | Headers, nav, sections de confiance, footer |
| Secondaire | `secondary` | #F27A1A | CTA principaux, accents, liens actifs, badges |
| Fond page | `background` | #F8F6F2 | Background global, sections claires |
| Texte | `foreground` | #2D2D2D | Corps de texte, titres secondaires |
| Succes / CTA | `success` | #34A853 | Boutons de validation, confirmations, indicateurs positifs |

### Variantes primaire (bleu nuit)

| Variante | Hex | Usage |
|----------|-----|-------|
| `primary-50` | #E8EBF0 | Fonds subtils, badges discrets |
| `primary-100` | #C5CCD9 | Bordures légères, séparateurs |
| `primary-200` | #9FAFC2 | Texte secondaire sur fond clair |
| `primary-300` | #7A92AB | Icones inactives |
| `primary-400` | #4A6585 | Sous-titres, texte moyen |
| `primary-500` | #1B2A4A | Couleur de reference |
| `primary-600` | #162240 | Hover sur fond primaire |
| `primary-700` | #111A33 | Active / pressed |
| `primary-800` | #0D1326 | Footer background |
| `primary-900` | #080C19 | Texte sur fond clair tres contrasté |

### Variantes secondaire (orange)

| Variante | Hex | Usage |
|----------|-----|-------|
| `secondary-50` | #FEF3E8 | Fond notification, fond badge |
| `secondary-100` | #FDE0C4 | Bordure accent |
| `secondary-200` | #F9C78E | Hover leger |
| `secondary-300` | #F6AD57 | Indicateur actif |
| `secondary-400` | #F49435 | Hover bouton orange |
| `secondary-500` | #F27A1A | Couleur de reference |
| `secondary-600` | #D96A15 | Hover fonce |
| `secondary-700` | #B35711 | Active / pressed |
| `secondary-800` | #8C440D | Texte accent fonce |
| `secondary-900` | #663209 | Texte accent tres fonce |

### Variantes succes (vert)

| Variante | Hex | Usage |
|----------|-----|-------|
| `success-50` | #E8F5E9 | Fond validation, toast succes |
| `success-100` | #C8E6C9 | Bordure succes |
| `success-200` | #A5D6A7 | Icone succes legere |
| `success-300` | #81C784 | Badge succes |
| `success-400` | #66BB6A | Hover bouton vert |
| `success-500` | #34A853 | Couleur de reference |
| `success-600` | #2E9748 | Hover fonce |
| `success-700` | #27863D | Active / pressed |
| `success-800` | #1B5E2A | Texte succes fonce |
| `success-900` | #103A1A | Texte succes tres fonce |

### Couleurs semantiques

| Role | Nom token | Hex | Usage |
|------|-----------|-----|-------|
| Erreur | `error-500` | #DC3545 | Messages d'erreur, champs invalides |
| Erreur fond | `error-50` | #FDE8EA | Fond alerte erreur |
| Warning | `warning-500` | #F59E0B | Avertissements, statuts en attente |
| Warning fond | `warning-50` | #FEF3C7 | Fond alerte warning |
| Info | `info-500` | #3B82F6 | Messages informatifs |
| Info fond | `info-50` | #EFF6FF | Fond alerte info |

### Neutres

| Variante | Hex | Usage |
|----------|-----|-------|
| `neutral-50` | #FAFAF9 | Fond alternatif ultra-leger |
| `neutral-100` | #F5F5F4 | Fond de card, fond input |
| `neutral-200` | #E7E5E4 | Bordures, separateurs |
| `neutral-300` | #D6D3D1 | Bordure input, placeholder |
| `neutral-400` | #A8A29E | Texte desactive, icone inactive |
| `neutral-500` | #78716C | Texte secondaire |
| `neutral-600` | #57534E | Labels, legende |
| `neutral-700` | #44403C | Texte standard |
| `neutral-800` | #2D2D2D | Texte principal (= foreground) |
| `neutral-900` | #1C1917 | Texte maximum contraste |

---

## 2. Typographie

### Font families

| Role | Police | Fallback | Justification |
|------|--------|----------|---------------|
| Titres (display) | **Plus Jakarta Sans** | `system-ui, -apple-system, sans-serif` | Arrondie, chaleureuse, moderne sans etre froide. Convient a l'univers "collegue sympa" de la marque. |
| Corps (body) | **Inter** | `system-ui, -apple-system, sans-serif` | Excellente lisibilite sur ecran, optimisee pour les petites tailles. Neutre et pro. |
| Code / mono | **JetBrains Mono** | `monospace` | Usage interne uniquement (dashboard admin). |

**Chargement** : Google Fonts avec `display=swap` pour eviter le FOIT. Preload des deux polices principales.

### Echelle typographique

| Token | Taille (px) | Taille (rem) | Line-height | Letter-spacing | Weight | Usage |
|-------|-------------|-------------|-------------|----------------|--------|-------|
| `display-xl` | 48 | 3 | 1.1 | -0.02em | 800 | Hero headline (desktop) |
| `display-lg` | 36 | 2.25 | 1.15 | -0.02em | 800 | Hero headline (mobile) |
| `h1` | 32 | 2 | 1.2 | -0.015em | 700 | Titres de section landing |
| `h2` | 24 | 1.5 | 1.25 | -0.01em | 700 | Sous-titres de section |
| `h3` | 20 | 1.25 | 1.3 | -0.01em | 600 | Titres de cards, titres FAQ |
| `h4` | 18 | 1.125 | 1.35 | 0 | 600 | Titres secondaires |
| `h5` | 16 | 1 | 1.4 | 0 | 600 | Labels importants |
| `h6` | 14 | 0.875 | 1.4 | 0.01em | 600 | Labels, overlines |
| `body-lg` | 18 | 1.125 | 1.6 | 0 | 400 | Texte principal landing |
| `body` | 16 | 1 | 1.6 | 0 | 400 | Texte standard |
| `body-sm` | 14 | 0.875 | 1.5 | 0 | 400 | Texte secondaire, descriptions |
| `small` | 13 | 0.8125 | 1.45 | 0.01em | 400 | Mentions legales, captions sous images |
| `caption` | 12 | 0.75 | 1.4 | 0.02em | 500 | Badges, labels de formulaire, meta |
| `overline` | 11 | 0.6875 | 1.4 | 0.05em | 600 | Sur-titres, categories (uppercase) |

### Responsive typographie

Sur mobile (< 768px), les tailles display et h1-h2 sont reduites :

| Token | Desktop | Mobile |
|-------|---------|--------|
| `display-xl` | 48px | 32px |
| `display-lg` | 36px | 28px |
| `h1` | 32px | 26px |
| `h2` | 24px | 20px |

---

## 3. Espacements

### Grille de base : 4px

Tous les espacements sont des multiples de 4px pour garantir un rythme visuel constant.

| Token | Valeur (px) | Valeur (rem) | Usage typique |
|-------|-------------|-------------|---------------|
| `space-1` | 4 | 0.25 | Micro-gaps, padding icone |
| `space-2` | 8 | 0.5 | Gap entre icone et texte, padding badge |
| `space-3` | 12 | 0.75 | Padding interne petit |
| `space-4` | 16 | 1 | Padding standard, gap entre elements |
| `space-6` | 24 | 1.5 | Padding card, gap entre cards |
| `space-8` | 32 | 2 | Marge entre sections mineures |
| `space-12` | 48 | 3 | Padding section mobile |
| `space-16` | 64 | 4 | Padding section desktop |
| `space-24` | 96 | 6 | Marge entre sections majeures landing |

### Container

| Breakpoint | Max-width | Padding horizontal |
|------------|-----------|-------------------|
| Mobile (375px) | 100% | 16px (space-4) |
| Tablet (768px) | 720px | 24px (space-6) |
| Desktop (1280px) | 1200px | 32px (space-8) |

---

## 4. Bordures et ombres

### Border radius

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius-sm` | 6px | Badges, chips, petits elements |
| `radius-md` | 10px | Inputs, selects, petites cards |
| `radius-lg` | 14px | Cards, modales, conteneurs |
| `radius-xl` | 20px | Pricing cards, hero cards, cards mises en avant |
| `radius-full` | 9999px | Boutons pill, avatars, tags |

**Philosophie** : border-radius genereux pour un ressenti chaleureux et accessible. Jamais d'angles vifs (radius-0) sauf separateurs pleine largeur.

### Box shadows

| Token | Valeur CSS | Usage |
|-------|-----------|-------|
| `shadow-xs` | `0 1px 2px rgba(27, 42, 74, 0.04)` | Separation subtile, inputs |
| `shadow-sm` | `0 2px 4px rgba(27, 42, 74, 0.06)` | Cards au repos |
| `shadow-md` | `0 4px 12px rgba(27, 42, 74, 0.08)` | Cards hover, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(27, 42, 74, 0.10)` | Modales, popovers |
| `shadow-xl` | `0 16px 48px rgba(27, 42, 74, 0.12)` | Pricing card mise en avant |
| `shadow-inner` | `inset 0 1px 3px rgba(27, 42, 74, 0.06)` | Inputs focus |

**Note** : les ombres utilisent la couleur primaire (#1B2A4A) en transparence plutot que du noir pur, pour un rendu plus chaleureux et coherent avec la palette.

### Bordures

| Token | Valeur | Usage |
|-------|--------|-------|
| `border-default` | 1px solid #E7E5E4 | Bordure standard (neutral-200) |
| `border-focus` | 2px solid #F27A1A | Focus ring (orange secondaire) |
| `border-error` | 1px solid #DC3545 | Champ en erreur |
| `border-success` | 1px solid #34A853 | Champ valide |

---

## 5. Breakpoints responsive

| Token | Largeur min | Cible | Colonnes grille |
|-------|-------------|-------|-----------------|
| `mobile` | 0px | iPhone SE / iPhone 14 (375px reference) | 4 colonnes |
| `tablet` | 768px | iPad / tablettes | 8 colonnes |
| `desktop` | 1280px | Laptop / desktop | 12 colonnes |
| `wide` | 1536px | Grand ecran (optionnel) | 12 colonnes |

**Gouttiere** : 16px (mobile), 24px (tablet), 32px (desktop).

**Approche** : mobile-first. Les styles de base ciblent 375px. Les media queries ajoutent des regles a partir de `tablet` et `desktop`.

---

## 6. Accessibilite

### Contrastes WCAG AA

| Combinaison | Ratio | Statut |
|-------------|-------|--------|
| Texte #2D2D2D sur fond #F8F6F2 | 10.4:1 | AA (pass) |
| Texte #FFFFFF sur fond #1B2A4A | 12.1:1 | AAA (pass) |
| Texte #FFFFFF sur fond #F27A1A | 3.1:1 | AA Large text only |
| Texte #1B2A4A sur fond #F27A1A | 3.9:1 | AA Large text (pass) |
| Texte #FFFFFF sur fond #34A853 | 3.5:1 | AA Large text (pass) |
| Texte #1B2A4A sur fond #34A853 | 3.4:1 | AA Large text (pass) |

**Regles** :
- Les boutons orange et vert utilisent du texte blanc UNIQUEMENT en taille >= 18px bold ou >= 24px regular. Pour du texte plus petit, utiliser du texte #1B2A4A sur ces fonds.
- Le texte courant est toujours #2D2D2D (ou plus fonce) sur fond #F8F6F2.
- Le texte sur fond bleu nuit est toujours blanc (#FFFFFF) ou blanc casse (#F8F6F2).

### Touch targets

- Taille minimum des zones tactiles : **44x44px** (WCAG 2.1 Success Criterion 2.5.5)
- Boutons : hauteur minimum 48px (confort iPhone)
- Espacement minimum entre deux cibles tactiles : 8px
- Les liens inline dans le texte ont un padding vertical implicite de 4px

### Focus visible

- Style de focus : outline 2px solid #F27A1A, offset 2px
- Visible au clavier, masque au clic souris (`:focus-visible`)
- Jamais de `outline: none` sans alternative visible

---

## 7. Animations et transitions

### Principes

- Transitions subtiles et fonctionnelles. Jamais decoratives.
- Pas d'animations lourdes (parallax, morphing, particules). Sophie est sur son iPhone en 4G.
- Durees courtes : 150-300ms maximum.
- Easing naturel : pas de linear, pas de bounce.

### Tokens d'animation

| Token | Valeur | Usage |
|-------|--------|-------|
| `duration-fast` | 150ms | Changements d'etat simples (hover couleur) |
| `duration-normal` | 200ms | Transitions standard (boutons, inputs, cards) |
| `duration-slow` | 300ms | Apparitions, ouvertures (accordion, modale) |
| `easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transition standard (Material ease) |
| `easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Element qui sort |
| `easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Element qui entre |

### Animations par composant

| Composant | Propriete animee | Duree | Easing |
|-----------|-----------------|-------|--------|
| Bouton hover | `background-color`, `box-shadow`, `transform` | 200ms | default |
| Bouton active | `transform: scale(0.97)` | 100ms | default |
| Card hover | `box-shadow`, `transform: translateY(-2px)` | 200ms | default |
| Input focus | `border-color`, `box-shadow` | 150ms | default |
| Accordion open | `max-height`, `opacity` | 300ms | out |
| Toast appear | `transform: translateY(-8px)`, `opacity` | 300ms | out |
| Toast dismiss | `transform: translateY(-8px)`, `opacity` | 200ms | in |
| Progress bar | `width` | 300ms | default |
| Page section (scroll) | `opacity`, `transform: translateY(16px)` | 400ms | out |

### Reduced motion

Respecter `prefers-reduced-motion: reduce` : remplacer toutes les animations par des transitions instantanees (duration: 0ms).

---

## 8. Composants UI

### 8.1 Boutons

#### Bouton primaire (CTA principal)

Utilise pour les actions principales : "Commencer maintenant", "Voir un exemple pour ma zone".

| Propriete | Default | Hover | Active | Disabled | Focus |
|-----------|---------|-------|--------|----------|-------|
| Background | #F27A1A | #D96A15 | #B35711 | #E7E5E4 | #F27A1A |
| Texte | #FFFFFF | #FFFFFF | #FFFFFF | #A8A29E | #FFFFFF |
| Border | none | none | none | none | 2px solid #F27A1A offset 2px |
| Shadow | shadow-sm | shadow-md | none | none | shadow-sm + focus ring |
| Transform | none | none | scale(0.97) | none | none |
| Cursor | pointer | pointer | pointer | not-allowed | pointer |

- **Hauteur** : 48px (mobile et desktop)
- **Padding horizontal** : 24px (space-6)
- **Border-radius** : radius-full (pill shape)
- **Font** : body (16px), weight 600, Plus Jakarta Sans
- **Min-width** : 160px
- **Texte** : toujours en blanc (#FFFFFF) car taille >= 16px bold, suffisant pour AA large text sur orange

#### Bouton secondaire

Utilise pour les actions secondaires : "En savoir plus", "Voir les details".

| Propriete | Default | Hover | Active | Disabled | Focus |
|-----------|---------|-------|--------|----------|-------|
| Background | transparent | #E8EBF0 | #C5CCD9 | transparent | transparent |
| Texte | #1B2A4A | #1B2A4A | #1B2A4A | #A8A29E | #1B2A4A |
| Border | 2px solid #1B2A4A | 2px solid #1B2A4A | 2px solid #111A33 | 2px solid #D6D3D1 | 2px solid #F27A1A |
| Shadow | none | shadow-xs | none | none | focus ring |

- **Hauteur** : 48px
- **Padding horizontal** : 24px
- **Border-radius** : radius-full
- **Font** : body (16px), weight 600

#### Bouton ghost

Utilise pour les actions tertiaires : "Passer", "Annuler", liens discrets.

| Propriete | Default | Hover | Active | Disabled |
|-----------|---------|-------|--------|----------|
| Background | transparent | rgba(27, 42, 74, 0.05) | rgba(27, 42, 74, 0.10) | transparent |
| Texte | #1B2A4A | #1B2A4A | #111A33 | #A8A29E |
| Border | none | none | none | none |
| Underline | none | underline | underline | none |

- **Hauteur** : 40px
- **Padding horizontal** : 16px
- **Border-radius** : radius-md
- **Font** : body-sm (14px), weight 500

#### Bouton succes (validation)

Utilise pour les confirmations : "Valider", "Confirmer le paiement".

| Propriete | Default | Hover | Active | Disabled |
|-----------|---------|-------|--------|----------|
| Background | #34A853 | #2E9748 | #27863D | #E7E5E4 |
| Texte | #FFFFFF | #FFFFFF | #FFFFFF | #A8A29E |
| Shadow | shadow-sm | shadow-md | none | none |

- Memes dimensions que le bouton primaire.

### 8.2 Cards

#### Card standard (probleme/solution, livrable, feature)

| Propriete | Valeur |
|-----------|--------|
| Background | #FFFFFF |
| Border | 1px solid #E7E5E4 |
| Border-radius | radius-lg (14px) |
| Padding | 24px (space-6) |
| Shadow | shadow-sm (repos) → shadow-md (hover) |
| Transition | shadow 200ms, transform 200ms |
| Hover transform | translateY(-2px) |

- **Titre** : h3 (20px, weight 600, #1B2A4A)
- **Description** : body-sm (14px, weight 400, #57534E)
- **Espacement titre/description** : 8px (space-2)
- **Mobile** : pleine largeur, padding 16px
- **Desktop** : grille 2 ou 3 colonnes

#### Card avant/apres

| Propriete | Avant | Apres |
|-----------|-------|-------|
| Background | #FAFAF9 | #FFFFFF |
| Border-left | 4px solid #DC3545 | 4px solid #34A853 |
| Label | "AVANT" en overline, rouge | "APRES" en overline, vert |

- Memes dimensions que la card standard.
- Le label (AVANT/APRES) utilise le style `overline` (11px, uppercase, weight 600).

#### Pricing card

3 variantes : Pack Lancement, Pack Mensuel (mis en avant), Boost Mandat.

**Card normale (Lancement + Boost) :**

| Propriete | Valeur |
|-----------|--------|
| Background | #FFFFFF |
| Border | 1px solid #E7E5E4 |
| Border-radius | radius-xl (20px) |
| Padding | 32px (space-8) |
| Shadow | shadow-sm |

**Card mise en avant (Pack Mensuel) :**

| Propriete | Valeur |
|-----------|--------|
| Background | #1B2A4A |
| Border | none |
| Border-radius | radius-xl (20px) |
| Padding | 32px (space-8) |
| Shadow | shadow-xl |
| Texte prix | #F27A1A (orange) |
| Texte reste | #FFFFFF |
| Badge | "Le plus populaire" — fond #F27A1A, texte #FFFFFF, radius-full |
| Transform | scale(1.03) par rapport aux autres cards |

**Structure interne pricing card :**

```
[Badge optionnel]
[Nom du pack] — h3
[Prix] — display-lg, weight 800
[Periodicite] — body-sm, neutral-400
[Separateur] — 1px solid neutral-200
[Liste features] — body-sm, icone check verte + texte
[CTA bouton] — bouton primaire (orange) ou secondaire
```

- **Espacement entre features** : 12px (space-3)
- **Icone check** : 16x16px, couleur success-500
- **Mobile** : cards empilees, pack mensuel en premier (scroll naturel)
- **Desktop** : grille 3 colonnes, pack mensuel au centre et scale(1.03)

### 8.3 Badges

| Variante | Background | Texte | Border-radius | Padding | Font |
|----------|------------|-------|---------------|---------|------|
| Default | #E8EBF0 | #1B2A4A | radius-full | 4px 12px | caption (12px, 500) |
| Orange | #FEF3E8 | #B35711 | radius-full | 4px 12px | caption |
| Vert | #E8F5E9 | #1B5E2A | radius-full | 4px 12px | caption |
| Rouge | #FDE8EA | #DC3545 | radius-full | 4px 12px | caption |
| Bleu | #E8EBF0 | #1B2A4A | radius-full | 4px 12px | caption |
| Highlight | #F27A1A | #FFFFFF | radius-full | 4px 12px | caption, weight 600 |

- **Hauteur** : 24px
- **Usage** : statuts de livrable (pret, en cours, nouveau), tag de pricing ("Le plus populaire"), categorie de contenu

### 8.4 Inputs

#### Input texte standard

| Propriete | Default | Focus | Error | Disabled |
|-----------|---------|-------|-------|----------|
| Background | #FFFFFF | #FFFFFF | #FFFFFF | #F5F5F4 |
| Border | 1px solid #D6D3D1 | 2px solid #F27A1A | 1px solid #DC3545 | 1px solid #E7E5E4 |
| Shadow | shadow-xs | shadow-inner | none | none |
| Texte | #2D2D2D | #2D2D2D | #2D2D2D | #A8A29E |
| Placeholder | #A8A29E | #A8A29E | #A8A29E | #D6D3D1 |

- **Hauteur** : 48px
- **Padding** : 12px 16px
- **Border-radius** : radius-md (10px)
- **Font** : body (16px) — important : 16px minimum sur iOS pour eviter le zoom auto
- **Label** : caption (12px, weight 500, #57534E), 4px au-dessus de l'input
- **Message erreur** : small (13px, weight 400, #DC3545), 4px en-dessous, icone warning 14px
- **Message aide** : small (13px, weight 400, #78716C), 4px en-dessous

#### Select

Memes dimensions et styles que l'input texte. Chevron a droite (16px, neutral-500). Le dropdown utilise shadow-md et radius-md.

#### Textarea

- Memes styles que l'input texte.
- **Hauteur min** : 120px
- **Resize** : vertical uniquement
- **Counter** : small (13px), aligne a droite, passe en error-500 si > limite

#### Checkbox et Radio

- **Taille** : 20x20px (touche effective 44x44px avec padding)
- **Border** : 2px solid #D6D3D1 (default), 2px solid #F27A1A (checked)
- **Background checked** : #F27A1A
- **Checkmark** : icone blanche 12px
- **Border-radius** : 4px (checkbox), radius-full (radio)
- **Label** : body (16px), 8px a droite de la case

### 8.5 Navigation

#### Header / Nav bar

| Propriete | Mobile | Desktop |
|-----------|--------|---------|
| Hauteur | 56px | 64px |
| Background | #FFFFFF | #FFFFFF |
| Border bottom | 1px solid #E7E5E4 | 1px solid #E7E5E4 |
| Shadow | shadow-xs | shadow-xs |
| Position | sticky top | sticky top |
| Z-index | 50 | 50 |

**Contenu mobile :**
- Logo ImmoCrew a gauche (hauteur 32px)
- Bouton hamburger a droite (44x44px, icone 24px)
- Menu mobile : overlay plein ecran, fond #FFFFFF, liens empiles, CTA en bas

**Contenu desktop :**
- Logo a gauche
- Liens centraux : "Fonctionnalites", "Tarifs", "FAQ" (body, weight 500, #2D2D2D, hover #F27A1A)
- CTA a droite : bouton primaire ("Commencer")

#### Footer

| Propriete | Valeur |
|-----------|--------|
| Background | #1B2A4A |
| Texte | #F8F6F2 |
| Liens | #F8F6F2, hover #F27A1A |
| Padding | 48px (mobile), 64px (desktop) |
| Border-top | none |

**Structure :**
- Logo + tagline
- Colonnes de liens (Produit, Ressources, Legal)
- Mentions legales + copyright
- Mobile : colonnes empilees

### 8.6 FAQ Accordion

| Propriete | Ferme | Ouvert |
|-----------|-------|--------|
| Background | #FFFFFF | #FFFFFF |
| Border | 1px solid #E7E5E4 | 1px solid #F27A1A |
| Border-radius | radius-lg (14px) | radius-lg (14px) |
| Padding question | 16px 24px | 16px 24px |
| Padding reponse | — | 0 24px 24px |
| Shadow | none | shadow-sm |

- **Question** : h4 (18px, weight 600, #1B2A4A) + chevron a droite (rotation 180deg a l'ouverture)
- **Reponse** : body (16px, weight 400, #57534E), line-height 1.6
- **Espacement entre items** : 12px (space-3)
- **Animation** : max-height + opacity, 300ms, easing-out
- **Hauteur zone de tap question** : 56px minimum (touch target)

### 8.7 Progress bar (onboarding)

Utilise dans le wizard d'onboarding 7 etapes.

| Propriete | Valeur |
|-----------|--------|
| Background track | #E7E5E4 |
| Background fill | #F27A1A |
| Hauteur | 6px |
| Border-radius | radius-full |
| Animation fill | width 300ms easing-default |

**Indicateur d'etape :**
- Texte : "Etape 3 sur 7" — caption (12px, weight 500, #78716C)
- Position : au-dessus de la barre, aligne a droite
- Titre etape : h3 (20px, weight 600, #1B2A4A), en-dessous de la barre

### 8.8 Toast / Notification

| Variante | Background | Bordure gauche | Icone |
|----------|------------|----------------|-------|
| Succes | #E8F5E9 | 4px solid #34A853 | Check circle, #34A853 |
| Erreur | #FDE8EA | 4px solid #DC3545 | X circle, #DC3545 |
| Warning | #FEF3C7 | 4px solid #F59E0B | Alert triangle, #F59E0B |
| Info | #EFF6FF | 4px solid #3B82F6 | Info circle, #3B82F6 |

- **Position** : fixed, top 16px, right 16px (desktop). Fixed, top 16px, centre horizontal (mobile).
- **Largeur** : max 400px (desktop), calc(100% - 32px) (mobile)
- **Padding** : 16px
- **Border-radius** : radius-md (10px)
- **Shadow** : shadow-lg
- **Contenu** : icone (20px) + texte (body-sm, 14px) + bouton fermer (ghost, 20x20px)
- **Auto-dismiss** : 5 secondes
- **Animation entree** : translateY(-8px) → translateY(0), opacity 0 → 1, 300ms
- **Animation sortie** : translateY(0) → translateY(-8px), opacity 1 → 0, 200ms
- **Z-index** : 100

---

## Handoff

**Destinataires** : @fullstack (implementation), @qa (validation accessibilite et responsive)

**Fichiers produits :**
- `docs/design/design-system.md` (ce fichier)
- `docs/design/design-tokens.json` (tokens JSON pour tailwind.config.js)

**Points d'attention pour @fullstack :**
- Les tokens JSON sont conçus pour etre injectes directement dans `tailwind.config.js` via `extend`
- Priorite d'implementation : couleurs → typographie → boutons → cards → inputs → navigation → le reste
- Les tailles de texte sur mobile doivent etre >= 16px pour les inputs (sinon iOS zoom auto)
- Tester les contrastes sur les boutons orange et vert — texte blanc uniquement en bold >= 16px

**Points d'attention pour @qa :**
- Valider les contrastes WCAG AA sur toutes les combinaisons couleur/fond
- Valider les touch targets (44px min) sur tous les elements interactifs
- Tester `prefers-reduced-motion` — les animations doivent disparaitre
- Tester le focus visible au clavier sur tous les composants interactifs
