# Audit visuel responsive — Marc, 3 devices — Session 10

> Par @mandataire (Sophie, testeur-persona) | 2026-03-31

---

## Résumé

Score global : **7.8/10**

Bonne base — le design system est cohérent, les couleurs sont justes, l'espace est maîtrisé. Mais plusieurs pages ont des problèmes concrets sur mobile qui empêchent le GO.

---

## Par page

### 1. Landing page

| Device | Score | Problèmes détectés |
|--------|-------|--------------------|
| Mobile 375px | 7/10 | Hero : le mockup (`.mt-10 desktop:mt-0`) arrive après le texte — OK. Mais la carte mockup (`max-w-sm`) n'a pas de padding latéral propre sur 375px, le `px-4` du container la serre. Les 2 CTA Hero sont en `flex-col` sur mobile — correct, mais le bouton outline "Voir les tarifs" n'a pas de largeur fixe : rendu inégal sous le bouton primaire. |
| Tablette 768px | 8/10 | Layout Hero passe en `flex-row` (desktop:flex) — attention : `desktop:flex` = 1280px, donc à 768px le Hero reste en colonne (mockup sous le texte). Gap visuellement correct mais l'espace est sous-exploité entre 768 et 1279px. Pricing : les 2 cartes pack passent en `tablet:grid-cols-2` — bon. |
| Desktop 1280px | 8/10 | Hero split 60/40 propre. Max-width 1200px bien contenu. Section-padding `py-16` sur desktop — dans la limite acceptable. BeforeAfter : `desktop:space-y-16` entre les 2 exemples crée un gap de 64px, un peu excessif mais pas bloquant. Hover states présents sur les cartes pricing (shadow + translate). |

**Problèmes spécifiques :**
- `Hero.tsx` l. 7 : `desktop:flex` déclenche le layout 2 colonnes seulement à 1280px. Entre 768px et 1279px, le mockup reste empilé sous le texte — gaspillage d'espace sur iPad.
- `Pricing.tsx` l. 43 : les 2 cartes principales passent en `tablet:grid-cols-2` — bien. Mais `MensuelPricingCard` n'est pas lisible dans ce fichier, risque de hauteurs inégales.
- `HowItWorks.tsx` l. 39-41 : la ligne verticale de connexion (`absolute left-[27px]`) est en `hidden desktop:block` — disparaît sur tablette, acceptable visuellement.
- `BeforeAfter.tsx` l. 40 : grille `tablet:grid-cols-2` pour Avant/Après — correct. À 375px, les 2 blocs s'empilent, la border-l-4 rouge/verte reste lisible.
- `SocialProof.tsx` l. 100 : métriques en `grid-cols-2 tablet:grid-cols-4` — sur mobile, 2 colonnes pour 4 métriques. Chaque cellule fait ~160px, c'est juste mais lisible.
- `FAQ.tsx` l. 93 : bouton FAQ `min-h-[56px]` — touch target OK (>44px). Focus-visible géré (ring-2 ring-secondary).
- `Blog` CTA l. 75 (`blog/page.tsx`) : `text-white` sur `bg-secondary` — CORRECT.

---

### 2. Blog

| Device | Score | Problèmes détectés |
|--------|-------|--------------------|
| Mobile 375px | 8/10 | BlogGrid cards en `grid-cols-1` — OK. Thumbnail `w-[100px]` fixe avec image `fill` — correct. Titre `line-clamp-2` protège le layout. Padding card `p-4` suffisant. |
| Tablette 768px | 8/10 | `tablet:grid-cols-2` — layout 2 colonnes propre. Thumbnail 100px sur cards horizontales : ratio correct. |
| Desktop 1280px | 7/10 | `max-w-4xl` sur le container blog (800px) — lisible mais sous-exploite le desktop 1280px. Aucune grille 3 colonnes sur desktop : 2 colonnes à 1280px donne des cards très larges avec beaucoup d'espace vide à droite du texte. Fait "blog perso" plutôt que Linear/Notion. |

**Problèmes spécifiques :**
- `BlogGrid.tsx` l. 69 : `grid-cols-1 tablet:grid-cols-2` — pas de `desktop:grid-cols-3`. À 1280px les 2 cards occupent 800px max, chacune fait ~380px. Le texte `line-clamp-2` dans une card aussi large crée trop d'espace blanc sous la description.
- `blog/page.tsx` l. 34 : `max-w-4xl` sur le container — correct pour la lisibilité mais bride le potentiel desktop.

---

### 3. Annonce partageable `/annonce/[token]`

| Device | Score | Problèmes détectés |
|--------|-------|--------------------|
| Mobile 375px | 7/10 | Header `px-6 py-8` — correct. Boutons contact `flex flex-wrap gap-3` — s'empilent bien. Mais l. 127 : `pt-6` + `-mb-4` sur le container boutons crée un chevauchement visuel avec l'article en dessous : zone morte de ~16px entre les boutons et le bloc blanc. Sur mobile c'est confus. |
| Tablette 768px | 8/10 | `max-w-3xl` bien centré. Layout mono-colonne adapté au contenu. Boutons côte à côte à 768px (flex-wrap). |
| Desktop 1280px | 7/10 | Page utilise des classes hardcodées (`bg-[#F8F6F2]`, `text-[#1B2A4A]`, `text-[#F27A1A]`) au lieu des tokens Tailwind — violation du design system. Page correcte mais moins premium que la landing : pas de max-width sur le footer CTA, le lien "ImmoCrew" est le seul élément. |

**Problèmes spécifiques :**
- `annonce/[token]/page.tsx` l. 102 : `bg-[#F8F6F2]` — hardcodé, devrait être `bg-background`.
- L. 104 : `bg-[#1B2A4A]` — devrait être `bg-primary`.
- L. 167-168 : `text-[#1B2A4A]` et `text-[#F27A1A]` — devrait être `text-primary` et `text-secondary`.
- L. 126-127 : combo `-mb-4 pt-6` sur le wrapper boutons crée un overlap ambigu sur mobile. Un `mt-4` simple serait plus propre.
- L. 154 : le bloc article `p-6 md:p-10` utilise `md:` (Tailwind default 768px) et non `tablet:` (breakpoint custom). Incohérence de préfixe.
- L. 109 : titre `text-2xl md:text-3xl` — utilise des tailles Tailwind raw au lieu de tokens typographiques (`text-h1`, `text-display-lg`).

---

### 4. Page mandataire `/agent/[slug]`

| Device | Score | Problèmes détectés |
|--------|-------|--------------------|
| Mobile 375px | 8/10 | HeroSection centré, avatar 28x28 (112px) — bien visible. CTA `h-11` (44px) — touch target OK. `flex-col tablet:flex-row` sur les boutons — correct. |
| Tablette 768px | 8/10 | MaZoneSection `tablet:grid-cols-2` — bon. TemoignagesSection `tablet:grid-cols-2` — bon. MesBiensSection `tablet:grid-cols-2` — bon. |
| Desktop 1280px | 7/10 | `QuiSuisJeSection` : bio sur `max-w-3xl` centré — mono-colonne à 1280px pour un bloc de texte long. Stats (`flex flex-wrap gap-8`) flottent librement sans grille — peut paraître mal aligné si les 2 chiffres ne sont pas côte à côte sur la même ligne. `MaMethodeSection` : étapes en liste verticale sur max-w-3xl — correct mais fait "page formulaire" plus que landing premium. `MesBiensSection` : `desktop:grid-cols-3` — c'est le seul composant qui exploite vraiment le desktop. |

**Problèmes spécifiques :**
- `AgentPageSections.tsx` l. 104 : bouton "Appeler" sur fond `bg-primary` — `text-primary` (navy sur blanc) — CORRECT.
- L. 114 : bouton "Me contacter" — `bg-secondary text-white` — CORRECT.
- L. 159 : `text-muted-foreground` utilisé — ce token n'est pas défini dans tailwind.config.ts (seul `text-neutral-*` est défini). Risque de fallback non voulu.
- L. 161 : même problème `text-muted-foreground` × 2 dans QuiSuisJeSection.
- L. 255, 298 : `text-muted-foreground` répété dans MaZoneSection.
- L. 381 : `text-muted-foreground` dans MesBiensSection.
- `HeroSection` : pas de `section-padding` — utilise `section-padding bg-primary` — OK, bien défini.
- `ContactSection` l. 453 : `bg-primary` avec texte `text-white` — section finale bien contrastée.

---

## P0 visuels (bloquants)

1. **Hardcoded colors dans annonce partageable** (`annonce/[token]/page.tsx` l. 102, 104, 167, 168) — utilise `bg-[#F8F6F2]`, `bg-[#1B2A4A]`, `text-[#1B2A4A]`, `text-[#F27A1A]` au lieu des tokens. Si les couleurs changent, cette page dérive visuellement.

2. **Token `text-muted-foreground` non défini** (`AgentPageSections.tsx` l. 159, 161, 255, 298, 381) — token inexistant dans tailwind.config.ts. Sur certaines configurations le texte pourrait tomber sur une couleur inattendue ou transparente.

3. **Breakpoint `md:` dans annonce** (`annonce/[token]/page.tsx` l. 109, 154) — mélange `md:` (768px Tailwind default) et `tablet:` (custom). Peut créer des comportements imprévus selon l'ordre de résolution.

---

## P1 visuels (importants)

4. **Hero 2 colonnes seulement à 1280px** (`Hero.tsx` l. 7) — entre 768px et 1279px, le mockup reste empilé. Sur iPad Pro (1024px) par exemple, on a un long scroll avant les CTA pricing. Déclencher le layout 2 colonnes à `tablet:flex` plutôt que `desktop:flex`.

5. **Blog sans colonne 3 sur desktop** (`BlogGrid.tsx` l. 69) — `tablet:grid-cols-2` sans `desktop:grid-cols-3`. À 1280px les cards sont trop larges, espace blanc sous le texte. Ajouter `desktop:grid-cols-3` ou garder `max-w-4xl` avec un ratio thumbnail plus grand.

6. **Overlap boutons/contenu annonce mobile** (`annonce/[token]/page.tsx` l. 126-127) — le `-mb-4 pt-6` crée une zone ambiguë entre les boutons CTA et l'article. Remplacer par `mt-6 mb-2`.

---

## P2 visuels (cosmétiques)

7. `BeforeAfter.tsx` l. 32 : `desktop:space-y-16` (64px) entre les 2 exemples sur desktop — un peu aéré. `desktop:space-y-10` suffirait.

8. `AgentPageSections.tsx` `MaMethodeSection` l. 208 : section sans fond défini (`bg-background` absent) — fond par défaut `#F8F6F2` via body, mais une alternance de fonds entre sections (blanc / fond / blanc) rendrait la page plus structurée visuellement.

9. `SocialProof.tsx` l. 66 : témoignages en `tablet:grid-cols-3` — à 768px les 3 cards font ~230px chacune. C'est serré pour les citations longues avec `text-body`. Envisager `tablet:grid-cols-2 desktop:grid-cols-3`.

---

## Verdict : GO CONDITIONNEL

Les P0 sont des corrections rapides (remplacer les hardcoded colors, corriger le token muted-foreground). Le fond design est solide : tokens utilisés partout ailleurs, touch targets corrects, CTA orange avec `text-white` validé sur toutes les pages, breakpoints logiques. Corriger les 3 P0 + les P1 avant la mise en production.

---

**Handoff → @fullstack**
- Corriger `annonce/[token]/page.tsx` : remplacer les 4 hardcoded colors par leurs tokens, corriger les `md:` en `tablet:`, revoir le `-mb-4 pt-6`
- Corriger `AgentPageSections.tsx` : remplacer tous les `text-muted-foreground` par `text-neutral-500` ou `text-neutral-400`
- Améliorer `Hero.tsx` : passer `desktop:flex` en `tablet:flex` pour exploiter le layout 2 colonnes dès 768px
- Améliorer `BlogGrid.tsx` : ajouter `desktop:grid-cols-3`
