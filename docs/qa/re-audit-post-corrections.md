# Re-audit QA technique post-corrections -- ImmoCrew

> Date : 2026-03-28
> Contexte : verification de solidite technique apres correction des P0 et P1 identifies dans l'audit QA initial.

---

## 1. TypeScript -- tsc --noEmit

**Resultat : PASS**

```
npx tsc --noEmit 2>&1 | grep "^src/"
# (aucune sortie -- 0 erreur TypeScript)
```

Zero erreur TypeScript dans src/. Le projet compile proprement.

---

## 2. Grep residuels

### 2.1 Sequences unicode \u00 dans src/

**Resultat : FAIL -- 30+ occurrences**

Fichiers impactes :
- `src/lib/blog.ts` (3 occurrences) -- "Strat\u00E9gie", "Mots-cl\u00E9s"
- `src/lib/editorial-calendar.ts` (1) -- "Strat\u00E9gie"
- `src/app/cgv/page.tsx` (14+) -- tous les accents dans les descriptions de packs
- `src/app/manifest.ts` (3) -- nom et description de l'app
- `src/app/opengraph-image.tsx` (2) -- alt text et contenu OG
- `src/components/dashboard/UserMenu.tsx` (1) -- "deconnecter" avec \u00e9 splitté
- `src/__tests__/components/*.test.tsx` (6+) -- FAQ, Header, Pricing tests

**Severite : P1** -- Les fichiers `src/lib/blog.ts`, `src/lib/editorial-calendar.ts`, `src/app/cgv/page.tsx`, `src/app/manifest.ts`, `src/app/opengraph-image.tsx` et `src/components/dashboard/UserMenu.tsx` contiennent des \u00XX dans les strings JS. Pas de risque fonctionnel (le rendu est correct), mais violation de la regle CLAUDE.md n.13 (caracteres UTF-8 obligatoires dans le code).

**Action requise** : remplacer chaque `\u00E9` par `e`, `\u00E8` par `e`, `\u00E0` par `a`, etc. avec les vrais caracteres accentues. Les fichiers de tests sont egalement concernes.

### 2.2 Entites &apos; dans src/app/ et src/components/

**Resultat : ACCEPTABLE -- usage JSX standard**

- `src/app/` : 7 occurrences (dashboard, opengraph, blog, bien)
- `src/components/` : 18 occurrences (landing/, CookieConsent, admin/)

**Analyse** : `&apos;` est l'entite HTML standard pour l'apostrophe en JSX. C'est une bonne pratique pour eviter les erreurs de parsing JSX. Pas de correction necessaire -- il s'agit de texte dans du JSX rendu, pas de strings JavaScript.

### 2.3 focus:ring- dans src/components/biens/ et Auth*

**Resultat : PASS -- 0 occurrence**

Les anciennes classes `focus:ring-` ont ete correctement remplacees par `focus-visible:ring-` (meilleure accessibilite). Verifie dans biens/ et Auth*.

### 2.4 "livrable" dans src/components/ (hors admin/)

**Resultat : PASS (avec reserve)**

2 occurrences trouvees :
- `src/components/dashboard/DashboardContent.tsx:448` -- commentaire de code (`{/* 2. ANNONCES (livrables uniquement... */}`). Non visible par l'utilisateur. Acceptable.
- `src/components/admin/TriggerProductionButton.tsx:84` -- message admin ("Production terminee : X livrables generes."). Interface admin uniquement, pas client-facing. Acceptable.

Aucune occurrence en surface client-facing.

### 2.5 text-neutral-400 dans src/components/biens/

**Resultat : FAIL PARTIEL -- 12 occurrences, analyse au cas par cas**

| Fichier | Usage | Verdict |
|---|---|---|
| AnnonceBlock.tsx:125 | Bouton disabled (`cursor-not-allowed`, `aria-disabled`) | ACCEPTABLE -- contraste reduit volontaire sur etat disabled |
| BienForm.tsx (x8) | `placeholder:text-neutral-400` sur inputs | ACCEPTABLE -- pseudo-classe placeholder, pas du texte visible permanent |
| BienForm.tsx:231, :268 | Unite decorative (euro, m2) avec `aria-hidden="true"` | ACCEPTABLE -- element purement decoratif, masque aux lecteurs d'ecran |
| BienForm.tsx:320 | Label "(optionnel)" | P2 -- texte informatif visible, devrait etre text-neutral-500 |
| BienFicheClient.tsx:59 | Compteur photos | P2 -- texte informatif visible, devrait etre text-neutral-500 |
| PhotoUploader.tsx:342 | Texte caption | P2 -- texte informatif visible, devrait etre text-neutral-500 |

**Severite globale : P2** -- 3 occurrences sont du texte visible (pas placeholder, pas disabled, pas aria-hidden) et devraient utiliser text-neutral-500 pour respecter les contrastes WCAG. Les 9 autres sont acceptables.

---

## 3. Securite sanitizer -- markdownRenderer.ts

**Resultat : PASS**

La fonction `sanitizeHtml` existe (lignes 155-171) et est appelee dans `markdownToHtml` (ligne 147, `return sanitizeHtml(html.join("\n"))`).

Couverture du sanitizer :
- Suppression `<script>` (contenu + self-closing)
- Suppression `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<style>` (contenu + self-closing)
- Suppression attributs `on*` (onclick, onerror, onload, etc.)
- Neutralisation URLs `javascript:` dans href/src/action
- Neutralisation URLs `data:text/html` dans src

Le sanitizer est minimaliste mais couvre les vecteurs XSS principaux. Pas de dependance externe.

---

## 4. Support HEIC

### 4.1 Frontend -- PhotoUploader.tsx

**Resultat : PASS**

```typescript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
```

`image/heic` et `image/heif` presents dans ALLOWED_TYPES (ligne 24).

### 4.2 Backend -- API route photos

**Resultat : PASS**

```typescript
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
}
```

HEIC/HEIF present dans ALLOWED_MIME_TYPES (ligne 18) et dans EXT_MAP (lignes 23-24). Coherence front/back validee.

---

## 5. Score global

### Synthese

| Verification | Statut | Severite residuelle |
|---|---|---|
| TypeScript tsc --noEmit | PASS | -- |
| Sequences \u00 | FAIL | P1 (30+ occurrences, violation regle framework) |
| Entites &apos; | PASS | -- (usage JSX standard) |
| focus:ring- | PASS | -- |
| "livrable" client-facing | PASS | -- |
| text-neutral-400 | FAIL PARTIEL | P2 (3 textes visibles, 9 acceptables) |
| Sanitizer XSS | PASS | -- |
| Support HEIC front | PASS | -- |
| Support HEIC back | PASS | -- |

### Note : 7.5/10

**Justification** : les corrections P0 (sanitizer, HEIC, focus-visible) sont bien implementees et solides. Le projet compile sans erreur TypeScript. Cependant :

- **-1.5 point** : les 30+ sequences `\u00XX` dans le code source sont une dette technique significative. Bien que fonctionnellement correctes (le rendu est identique), elles violent la regle framework CLAUDE.md n.13 et rendent le code moins lisible. C'est le P1 residuel le plus important.
- **-0.5 point** : 3 occurrences de `text-neutral-400` sur du texte visible (pas placeholder/disabled) dans les composants biens. Impact accessibilite mineur mais reel.
- **-0.5 point** : les fichiers de tests contiennent aussi des \u00XX, ce qui les rend difficiles a maintenir.

**Pour atteindre 9/10** :
1. Remplacer toutes les sequences \u00XX par les vrais caracteres UTF-8 dans src/ (blog.ts, editorial-calendar.ts, cgv/page.tsx, manifest.ts, opengraph-image.tsx, UserMenu.tsx, fichiers de tests)
2. Corriger les 3 text-neutral-400 restants en text-neutral-500 (BienForm.tsx label optionnel, BienFicheClient.tsx compteur, PhotoUploader.tsx caption)

---

**Handoff -> @fullstack**
- Fichier produit : `docs/qa/re-audit-post-corrections.md`
- P1 a corriger : remplacement des \u00XX par caracteres UTF-8 dans 8+ fichiers (voir section 2.1)
- P2 a corriger : 3 occurrences text-neutral-400 sur texte visible dans biens/ (voir section 2.5)
- Points positifs : TypeScript clean, sanitizer XSS solide, HEIC coherent front/back, focus-visible corrige
