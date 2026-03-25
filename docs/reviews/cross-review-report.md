# Revue croisee — ImmoCrew — 2026-03-25

> Produit par @reviewer | 2026-03-25
> Livrables audites : 27 fichiers docs/ + 26 fichiers src/ produits par 14 agents sur 5 phases
> Verdict : **GO avec reserves**

---

## Resume executif (non-technique)

ImmoCrew a un socle strategique solide : positionnement clair, personas bien definis, pricing coherent partout, et un code fonctionnel. Cependant, **une decision technique majeure n'a pas ete appliquee** : le code utilise encore Supabase alors que la decision est passee a Replit PostgreSQL. C'est le seul vrai bloquant. Les autres problemes (tracking PostHog absent, sitemap/robots manquants, mention IA a completer) sont des travaux de finition faisables en 1-2 jours. On peut avancer vers le lancement a condition de planifier la migration DB.

## Resume technique

- **Coherence globale** : excellente (14 agents, zero contradiction majeure sur le positionnement)
- **Blocage critique** : code source couple a Supabase (10 fichiers), decision utilisateur = Replit PostgreSQL
- **Recommandation** : GO avec reserves — migration DB a planifier avant deploiement production

---

## 1. Coherence inter-agents

### Prix : 497/197/97 -- COHERENT PARTOUT
Verifie dans : project-context.md, brand-platform.md, functional-specs.md, landing-page-copy.md, Pricing.tsx, growth-strategy.md, roadmap.md. Les trois prix sont identiques dans tous les livrables et dans le code. Le code affiche correctement "TTC" sous chaque prix. La phrase d'ancrage "197EUR/mois. Moins que ta commission sur un studio" est presente dans le copy ET dans le composant Pricing.tsx.

### Ton de marque : tutoiement + zero jargon -- COHERENT
Le tutoiement est systematique dans le copy (landing-page-copy.md), le code (Hero, Problem, Pillars, BeforeAfter, Pricing, FAQ, CTAFinal), le calendrier editorial, les scripts DM LinkedIn. Aucun vouvoiement detecte dans les livrables client-facing. Le brand-voice.md est respecte.

### Personas Sophie/Thomas -- COHERENT
Sophie est l'arbitre de chaque decision UX (mobile-first, magic link, copier-coller, 7 etapes onboarding). Thomas est traite comme persona secondaire avec parcours d'achat distinct (LinkedIn DM vs Facebook groupes). Les objections des deux personas sont couvertes dans la FAQ (10 questions). Le calendrier editorial cible les frustrations de Sophie semaine par semaine.

### Positionnement "resultats finis, pas des outils" -- COHERENT
Respecte dans : brand-platform.md (pilier 1 "C'est fait"), landing-page-copy.md (section 3 piliers), Pillars.tsx, growth-strategy.md (hook DM), social-strategy.md (mix contenu), seo-strategy.md (ciblage "mandataire" vs "agence"). L'angle anti-Cocoon-Immo ("marteau vs maison") est coherent entre la strategie et le copy.

### Directive IA (invisible dans le copy client) -- COHERENT
Le code ne mentionne jamais "IA" ou "intelligence artificielle" dans les composants client-facing sauf : (1) mention legale sous les avant/apres dans BeforeAfter.tsx ("Contenu produit avec assistance IA"), (2) FAQ question sur la transparence. C'est conforme a la directive du brand-platform et au legal-audit (AI Act). Le brand-voice.md interdit explicitement "notre IA" comme argument de vente.

---

## 2. Contradictions detectees

| Livrable A | Livrable B | Contradiction | Criticite | Resolution proposee |
|---|---|---|---|---|
| project-context.md (L48) | src/lib/supabase.ts + 9 fichiers src/ | **Decision "Replit PostgreSQL + Object Storage" non appliquee dans le code.** Tout le code utilise `@supabase/supabase-js` et `@supabase/ssr`. L'infra doc decrit aussi Supabase. | **BLOQUANT** | @fullstack doit migrer : remplacer le client Supabase par un ORM (Drizzle/Prisma) + driver pg natif. @infrastructure doit mettre a jour le schema SQL et la doc. Estimer 1-2 jours de travail. |
| project-context.md (L32) | brand-platform.md (L241) | Prix Cocoon-Immo : project-context dit "99-299EUR/mois", brand-platform dit "99-269EUR/mois". | **MINEUR** | Verifier le prix reel de Cocoon-Immo (derniere info : 99EUR libre-service, 269EUR cle-en-main). Aligner sur 99-269EUR dans project-context.md. @creative-strategy responsable. |
| project-context.md (L184) | brand-platform.md (L27) | Taille marche : @elon dit "84K+ mandataires", brand-platform (apres audit) dit "40-50K". Le chiffre @elon dans l'historique n'a pas ete corrige. | **MINEUR** | Pas d'impact operationnel (le brand-platform fait reference). Mettre une note dans l'historique que le chiffre a ete revise. |
| roadmap.md (L23) | project-context.md (L48) | Roadmap mentionne "donnees enregistrees en Supabase" pour l'onboarding. Incoherent avec la decision Replit PostgreSQL. | **MINEUR** | Sera corrige automatiquement lors de la migration DB. |
| infra/infrastructure.md (L5) | project-context.md (L48) | Doc infrastructure entierement basee sur Supabase (schema SQL, RLS, Storage, JWT). | **BLOQUANT** | @infrastructure doit produire une V2 alignee sur Replit PostgreSQL + Object Storage. Les concepts (tables, RLS, buckets) restent similaires mais l'implementation change. |
| @qa escalation | src/app/api/webhooks/stripe/route.ts | **`invoice.payment_failed` non gere dans le webhook Stripe.** @qa l'a signale, pas encore corrige. | **MAJEUR** | @fullstack doit ajouter le handler. Impact : un client dont le paiement echoue ne sera pas notifie, pas de downgrade automatique. |
| tracking-plan.md (16 events P0) | src/ (code) | **0 sur 15 events custom PostHog implementes.** Seul `page_view` auto est couvert. PostHogProvider existe mais aucun `posthog.capture()` dans le code. | **MAJEUR** | @fullstack doit implementer les 15 events P0 avant lancement. Sans tracking, impossible de mesurer le funnel AARRR ni les KPIs definis par @data-analyst. |

---

## 3. Gaps identifies

### Fichiers manquants
- `src/app/sitemap.ts` — absent. @seo l'a specifie dans metadata-templates.md avec le code pret. Non integre par @fullstack.
- `src/app/robots.ts` — absent. Meme situation.
- `docs/legal/rgpd-checklist.md` — prevu dans l'orchestration, fusionne dans legal-audit.md. Acceptable.
- `docs/legal/cgu-draft.md` — mentionne dans le legal-audit comme necessaire, non produit. Les CGV doivent exister AVANT le lancement.
- `docs/legal/privacy-policy.md` — mentionne dans le legal-audit, non produit.
- Structured data JSON-LD — @seo a fourni les templates, non integres dans le code.

### Fonctionnalites specifiees non codees
- Bandeau consentement cookies — requis par RGPD pour PostHog analytics. Absent du code.
- Page /mentions-legales — requise legalement. Absente.
- Page /cgv — requise pour le paiement. Absente.
- Page /confidentialite — requise RGPD. Absente.

### Livrables attendus Phase 4 (en cours)
L'orchestration-plan marque Phase 4 "EN COURS" mais les livrables @growth et @social sont presents dans docs/. Le statut devrait etre "TERMINE".

---

## 4. Conformite legale

### Mention IA (AI Act) -- PARTIELLEMENT CONFORME
- BeforeAfter.tsx : mention presente ("Contenu produit avec assistance IA — relu et valide par l'equipe ImmoCrew"). Conforme.
- FAQ : question sur la transparence IA presente et testee par @qa. Conforme.
- Espace client / livrables livres aux mandataires : **pas de mention IA sur les livrables eux-memes** — a verifier si l'AI Act l'exige sur chaque contenu genere ou seulement sur le service. Point a valider avec juriste.

### RGPD technique -- PARTIELLEMENT CONFORME
- PostHog EU configure : OUI (dans PostHogProvider).
- Bandeau consentement cookies : **ABSENT** — bloquant RGPD.
- Pages mentions legales / confidentialite : **ABSENTES** — bloquant legal.
- DPA sous-traitants : documentes dans legal-audit.md, a signer avant production.

### CGV / mentions legales -- NON PRODUITES
Le legal-audit recommande des CGV B2B avec garantie 14j, mais aucun draft n'a ete produit. @legal doit les rediger avant le lancement.

---

## 5. Decision DB pendante — Supabase vers Replit PostgreSQL

**Fichiers a adapter :**

| Fichier | Changement requis |
|---------|-------------------|
| `src/lib/supabase.ts` | Remplacer entierement par un client PostgreSQL natif (pg/Drizzle/Prisma) |
| `src/app/api/webhooks/stripe/route.ts` | Remplacer les appels Supabase par des requetes SQL directes |
| `src/app/api/webhooks/clerk/route.ts` | Idem |
| `src/app/api/leads/route.ts` | Idem |
| `src/app/dashboard/page.tsx` | Remplacer le client Supabase par le nouveau client DB |
| `src/app/admin/page.tsx` | Idem |
| `src/app/admin/clients/[id]/page.tsx` | Idem |
| `src/app/onboarding/page.tsx` | Idem (sauvegarde des etapes) |
| `docs/infra/infrastructure.md` | Reecrire les sections 3 (schema SQL), 4 (auth Clerk/Supabase JWT) |
| `.env.example` | Remplacer les vars SUPABASE_* par DATABASE_URL + OBJECT_STORAGE_* |

**Estimation** : 1-2 jours pour @fullstack + @infrastructure.

---

## 6. Score par phase

| Phase | Completude | Coherence | Actionnabilite | Score moyen |
|-------|------------|-----------|----------------|-------------|
| 0 — Fondations | 5/5 | 5/5 | 5/5 | **5.0** |
| 1 — Experience | 5/5 | 5/5 | 5/5 | **5.0** |
| 2 — Developpement | 4/5 | 3/5 | 3/5 | **3.3** |
| 3 — SEO/GEO | 5/5 | 5/5 | 4/5 | **4.7** |
| 4 — Acquisition | 5/5 | 5/5 | 4/5 | **4.7** |

**Phase 2 penalisee** par : code couple a Supabase (decision non appliquee), 0/15 events PostHog, invoice.payment_failed absent. Le code lui-meme est bien structure et le copy est correctement integre, mais ces 3 lacunes empechent un deploiement en production.

---

## 7. Top 5 actions prioritaires avant lancement

1. **Migrer de Supabase vers Replit PostgreSQL + Object Storage** — 10 fichiers a adapter. Sans ca, le code ne tourne pas sur l'infra cible. Agents : @fullstack + @infrastructure. Estimation : 1-2 jours. BLOQUANT.

2. **Produire les pages legales (CGV, mentions legales, politique de confidentialite)** — Obligatoires avant tout paiement Stripe en France. Agent : @legal. Estimation : 0.5 jour.

3. **Implementer les 15 events PostHog P0 + bandeau consentement cookies** — Sans tracking, zero visibilite sur le funnel. Sans bandeau, non-conforme RGPD. Agent : @fullstack. Estimation : 0.5 jour.

4. **Ajouter le handler `invoice.payment_failed` dans le webhook Stripe + integrer sitemap.ts et robots.ts** — Bug critique signale par @qa + fondations SEO manquantes. Agent : @fullstack. Estimation : 2h.

5. **Integrer les structured data JSON-LD (Organization, Service, FAQPage)** — Templates fournis par @seo, non implementes. Impact SEO et GEO des le lancement. Agent : @fullstack. Estimation : 2h.

---

## Recommandation

**GO avec reserves.**

Les fondations strategiques (positionnement, personas, pricing, ton, copy) sont excellentes et parfaitement alignees entre les 14 agents. Le code est fonctionnel et respecte le design system et le copy. Les strategies SEO, GEO, growth et social sont coherentes et actionnables.

Les reserves sont claires : la migration DB est un prealable non negociable, les pages legales sont obligatoires, et le tracking doit etre implemente pour mesurer quoi que ce soit. Ces 5 actions representent environ 3 jours de travail — pas un mur, mais un passage oblige avant tout deploiement en production.

---

**Handoff -> @orchestrator**
- Fichiers produits : `docs/reviews/cross-review-report.md`
- Decisions prises : GO avec reserves, 5 actions prioritaires ordonnees
- Points d'attention : migration Supabase -> Replit PostgreSQL (BLOQUANT, 10 fichiers), pages legales absentes (BLOQUANT legal), 0/15 events PostHog (MAJEUR). Agents a reinvoquer : @fullstack (migration DB + tracking + sitemap), @infrastructure (doc V2), @legal (CGV + mentions + confidentialite).
