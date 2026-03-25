# Audit UX — ImmoCrew Frontend

> Produit par @ux | 2026-03-25
> Périmètre : landing page (Header, Hero, Problem, Pricing, FAQ, Footer, CTAButton, CookieConsent) + onboarding wizard + dashboard
> Référence : wireframes.md, personas.md (Sophie, 38 ans, iPhone, mandataire IAD)

---

## Score global : 7.5 / 10

Le frontend est solide techniquement et bien structuré. Les frictions identifiées sont ciblées et corrigeables rapidement. Le principal risque est l'onboarding (7 étapes sans sauvegarde = abandon potentiel élevé pour Sophie sur mobile).

---

## Tableau de synthèse

| Composant | Responsive | Conformité wireframe | Accessibilité | Verdict |
|---|---|---|---|---|
| Header | ✅ Bon — hamburger 44px, overlay plein écran | ✅ Conforme | ✅ aria-label, aria-expanded | Livrable |
| Hero | ✅ Empilé mobile, 60/40 desktop | ⚠️ CTA pointe #avant-apres, wireframe dit #pricing | ⚠️ Mockup sans alt, section sans aria-label | Mineur à corriger |
| Problem | ✅ 1 col mobile, 2 col tablet | ✅ Conforme problème/solution | ⚠️ SVG icones sans aria-hidden | Mineur |
| Pricing | ⚠️ 3 cartes tablet : scale-[1.03] peut causer overflow horizontal | ✅ 3 packs, badge, CTA distinct | ⚠️ CTAButton = `<a>` sans role button | Majeur sur mobile |
| FAQ | ✅ Pleine largeur, max-w-3xl | ✅ Accordion conforme | ⚠️ aria-expanded OK mais panel sans id/aria-controls | Mineur |
| Footer | ✅ Empilé mobile, flex desktop | ✅ Conforme | ⚠️ Liens internes sans aria-current | Mineur |
| CTAButton | ✅ h-12 = 48px (conforme tap zone) | ✅ | ⚠️ `<a>` utilisé comme bouton (href="/api/checkout") sans role | Majeur |
| CookieConsent | ✅ Empilé mobile, flex tablet | N/A | ⚠️ Pas de role="dialog", pas de focus trap, pas d'aria-live | Majeur |
| Onboarding | ✅ max-w-xl centré | ⚠️ Wizard 7 étapes sans sauvegarde draft, pas de skip optionnel | ⚠️ Labels corrects, mais pas d'aria-required | CRITIQUE |
| Dashboard | ✅ Grid responsive 2/4 cols | ✅ Empty state conforme wireframe | ⚠️ Stats "0" sans aria-label, emoji ✏️ sans aria-hidden | Majeur |

---

## Problèmes par sévérité

### CRITIQUE

**[C1] Onboarding — Perte de données sans sauvegarde draft**
`src/app/onboarding/page.tsx` — state React pur, aucune persistance localStorage/sessionStorage.
Sophie remplit 4 étapes sur son iPhone entre deux visites, reçoit un appel, ferme l'onglet — tout est perdu. Le `beforeunload` tracke l'abandon mais ne récupère rien.
Conséquence : taux d'abandon step 4-5 potentiellement >50% sur mobile.

**[C2] Onboarding — 7 étapes sans indication de durée ni possibilité de skip**
Aucun champ n'est marqué obligatoire vs optionnel (sauf "biens_actuels" dans le placeholder). Sophie ne sait pas combien de temps ça prend. Pas de "Compléter plus tard" pour les étapes 6-7 (biens en cours, comptes sociaux).

---

### MAJEUR

**[M1] CookieConsent — Pas de focus trap ni role ARIA**
`src/components/CookieConsent.tsx:41` — div fixe sans `role="dialog"`, sans `aria-modal`, sans `aria-labelledby`. Le focus n'est pas piégé dans le bandeau à l'apparition. Navigation clavier impacte toute la page derrière.

**[M2] Pricing — Overflow horizontal potentiel sur tablet étroit (768-900px)**
`src/components/landing/Pricing.tsx:93` — la carte featured a `tablet:scale-[1.03]`. Sur un tablet 768px avec 3 colonnes et padding, la transformation scale peut déborder le viewport. Aucun `overflow-x: hidden` sur le container.

**[M3] CTAButton vers `/api/checkout` — Balise `<a>` pour une action serveur**
`src/components/landing/CTAButton.tsx` — le composant est systématiquement un `<a>`. Pour les hrefs `/api/checkout?pack=*`, sémantiquement c'est un bouton d'action, pas une navigation. Ni `role="button"` ni `<button>` utilisé. Impact screen reader : annoncé comme "lien" et non comme "bouton Démarrer mon lancement".

**[M4] Dashboard — Emoji ✏️ rendu sans aria-hidden**
`src/app/dashboard/page.tsx:92` — `&#9997;` affiché dans un div décoratif sans `aria-hidden="true"`. VoiceOver lira "pencil emoji" à chaque chargement du dashboard.

---

### MINEUR

**[m1] Hero — CTA principal pointe `#avant-apres` au lieu de `#pricing`**
`src/components/landing/Hero.tsx:22` — wireframe section 1.1 spécifie le CTA principal orange vers `#pricing`. Le code pointe `#avant-apres`. Friction potentielle : l'utilisateur convaincu doit rescroller pour acheter.

**[m2] Hero mockup — Image/div sans attribut alt ou aria-label**
`src/components/landing/Hero.tsx:36-73` — le bloc mockup (simulacre de post Instagram) est un div décoratif sans `aria-hidden="true"`. Un screen reader lira tout le contenu interne comme du texte significatif.

**[m3] Problem — SVG icones (✕ et ✓) sans aria-hidden**
`src/components/landing/Problem.tsx:44,63` — les SVG sont décoratifs (le texte adjacent porte le sens) mais sans `aria-hidden="true"`. Duplication d'information pour les screen readers.

**[m4] FAQ — Panel sans id couplé au bouton**
`src/components/landing/FAQ.tsx:77-113` — `aria-expanded` est présent sur le bouton mais le panneau réponse n'a pas d'`id` et le bouton n'a pas d'`aria-controls`. La relation bouton/panneau n'est pas annoncée correctement par tous les screen readers.

**[m5] Onboarding — Champs sans aria-required**
`src/app/onboarding/page.tsx:220,226` — les inputs n'ont pas `aria-required="true"` pour les champs obligatoires. Sophie utilise iPhone + VoiceOver potentiellement.

**[m6] Accents manquants dans les strings hardcodées (Problem.tsx, Pricing.tsx, onboarding/page.tsx)**
Plusieurs chaînes de caractères hardcodées manquent d'accents ("prets", "cle en main", "Demarrer"). Incohérence avec les entités HTML correctement encodées ailleurs. Risque faible sur le rendu mais signal de qualité négatif.

---

## Top 5 corrections prioritaires

| Priorité | Correction | Fichier | Impact |
|---|---|---|---|
| 1 | Persister le state onboarding dans `sessionStorage` (hydratation au montage) | `onboarding/page.tsx` | Réduction abandon mobile estimée significative |
| 2 | Marquer étapes 6-7 comme optionnelles, ajouter "Compléter plus tard" | `onboarding/page.tsx` | Réduction friction, time-to-completion réduit |
| 3 | Ajouter `role="dialog"` + focus trap sur CookieConsent | `CookieConsent.tsx` | Conformité WCAG 2.2 AA, navigation clavier |
| 4 | Corriger destination CTA Hero : `#avant-apres` → `#pricing` (ou ajouter 2e CTA secondaire) | `Hero.tsx:22` | Conversion directe |
| 5 | Ajouter `aria-hidden="true"` sur SVG décoratifs + emoji dashboard + mockup Hero | Problem.tsx, Hero.tsx, dashboard/page.tsx | Accessibilité screen reader |

---

## Points positifs (à conserver)

- **Tap zones** : tous les boutons et liens interactifs sont à 48px min (h-12) — conforme WCAG 2.5.5.
- **Focus visible global** : `globals.css` définit `:focus-visible` avec outline-secondary, cohérent sur tout le projet.
- **Reduced motion** : pris en charge dans `globals.css` — transitions désactivées si `prefers-reduced-motion`.
- **Tracking granulaire** : chaque CTA tracke `location` + `label` + `href`, chaque étape onboarding tracke abandon et completion.
- **Empty state dashboard** : excellent — warm, précis sur ce qui va arriver, pas de "0 éléments" angoissant.
- **Contenu Problem.tsx** : correspondance directe avec les douleurs de Sophie (Canva, porte-à-porte, templates génériques IAD) — bon travail d'identification du persona.

---

## Hypothèses à valider

Aucune — audit basé exclusivement sur le code existant et les wireframes documentés.

---

**Handoff → @design**
- Fichiers produits : `docs/ux/ux-audit.md`
- Décisions prises : 7.5/10, CRITIQUE sur persistance onboarding et durée wizard, MAJEUR sur CookieConsent ARIA + overflow Pricing tablet
- Points d'attention : corriger `Hero.tsx:22` (destination CTA) avant tout test de conversion — c'est le problème le plus rapide à corriger avec le plus grand impact potentiel. L'onboarding sans sauvegarde est le risque rétention numéro 1 pour Sophie sur mobile.
