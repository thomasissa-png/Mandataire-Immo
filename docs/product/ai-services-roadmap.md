# Roadmap Services IA — ImmoCrew

> Produit par @product-manager | 2026-03-25
> Sources : project-context.md, roadmap.md, functional-specs.md, infrastructure.md, personas.md, brand-platform.md

---

## 1. Postmortem — Comment le pipeline IA a été oublié

### 1.1 Constat

Le coeur du produit ImmoCrew — la génération de contenu personnalisé via Claude API — n'a pas été codé. Le repo contient 26 fichiers couvrant : landing page, paiement Stripe, onboarding 7 étapes, dashboard client, interface admin, tracking PostHog, conformité RGPD. Zéro appel à l'API Anthropic pour générer les livrables texte.

### 1.2 Analyse causale — 4 questions

**Q1 : La roadmap mentionnait-elle explicitement le pipeline IA au MVP ?**

Non clairement. La roadmap (S1-S2 MVP) liste : landing page, formulaire onboarding, paiement Stripe, espace client, mentions légales. La production de contenu IA y est décrite comme "production manuelle des premiers livrables via agents Gradient" côté S3-S4. L'hypothèse implicite : les semaines 1-2 livrent le conteneur (site + paiement), les semaines 3-4 livrent le contenu manuellement, l'automatisation arrive en M2-M3. Ce glissement "manuel d'abord" a rendu le pipeline IA optionnel dans la lecture du brief de @fullstack.

**Q2 : Les specs fonctionnelles décrivaient-elles les API de génération ?**

Partiellement. La section 6 (Pipeline de production) décrit le workflow en 5 étapes avec les agents impliqués, les livrables attendus et les contraintes IA — mais elle ne spécifie aucune route API concrète (`/api/generate/pack-mensuel`, `/api/generate/annonce`, etc.), aucun contrat d'interface, aucun prompt type. La section 6.3 indique "Bouton Lancer la production → appelle le pipeline Gradient" sans décrire l'implémentation technique. C'est une spec fonctionnelle (quoi faire) sans spec d'interface (comment l'appeler).

**Q3 : L'orchestrateur a-t-il donné le bon brief à @fullstack ?**

Non. Le brief @fullstack s'est concentré sur la plomberie (auth, paiement, CRUD). L'orchestration (voir `docs/orchestration-plan.md`) liste "26 fichiers, landing + API + dashboard + onboarding + admin" comme livrable Phase 2 — sans mentionner une seule route de génération IA. Le `prompts.ts` produit est un système de versioning de prompts d'images (probablement glissement vers un autre projet ou confusion) — et même lui n'appelle pas Claude API.

**Q4 : Qu'est-ce qui aurait dû être différent ?**

Trois corrections de process :

1. **Une epic dédiée "Pipeline IA" en P0** — pas en section 6 des specs, mais comme epic autonome avec ses propres user stories, routes API et critères d'acceptance techniques. Quand @fullstack reçoit un brief, une epic sans route API = une epic ignorée.
2. **Un critère de Definition of Done bloquant** — "Le MVP n'est pas terminé tant qu'un client test peut déclencher la génération d'un post et le voir dans son espace." Ce critère manquait.
3. **Un artefact `src/lib/ai.ts` comme fondation obligatoire** — comme `src/lib/stripe.ts` ou `src/lib/db.ts`, le client Claude API devait être un fichier fondation créé en premier, avant les composants.

### 1.3 Leçons à capitaliser

- Pour tout SaaS dont le produit est de la génération IA : la route `/api/generate` est aussi critique que la route `/api/webhooks/stripe`. Elle doit figurer dans le brief @fullstack avec le même niveau de détail.
- Une spec fonctionnelle qui décrit un workflow sans contrat d'interface technique ne sera pas implémentée.
- L'orchestrateur doit vérifier explicitement après Phase 2 : "Est-ce que le coeur du produit est codé ?" — pas seulement "combien de fichiers livrés ?"

---

## 2. Cartographie exhaustive des services IA

### Légende

- **Auto IA** : OUI total / OUI partiel / NON
- **P0** : à coder pour le premier client | **P1** : mois 2 | **P2** : mois 4+

---

### 2.1 Pack Lancement (497€ — one-shot)

| # | Livrable | Ce que Sophie reçoit | Auto IA | Input client_context | Prompt type | Output format | QA humaine | Priorité |
|---|----------|---------------------|---------|---------------------|-------------|---------------|------------|----------|
| L1 | Positionnement + mise en avant expertise | Document 1 page : différenciateurs, accroche, proposition de valeur personnalisée | OUI total | zone_geo, specialite, annees_exp, valeurs, resultats_cles | `positioning_statement` | Markdown | Relecture — valider cohérence avec la réalité du client | P0 |
| L2 | Bio optimisée (tous profils) | 4 versions : Instagram (150 car.), LinkedIn (300 car.), Google Business (750 car.), Présentation générale | OUI total | positioning_statement (L1), prenom, photo_dispo, zone, specialite | `bio_multiformat` | JSON `{instagram, linkedin, google, general}` | Relecture — vérifier exactitude (RSAC, réseau, années exp) | P0 |
| L3 | 5 templates annonces storytelling | 5 annonces rédigées (600-900 mots chacune) pour les types de biens du client, avec structure narrative : accroche quartier → histoire du bien → projection acheteur → CTA | OUI total | biens[] ou types_biens_frequents, zone_geo, prix_marche_m2, quartiers_references | `annonce_storytelling` | Markdown par annonce | Vérification données locales (prix, quartier, écoles) — obligatoire | P0 |
| L4 | 5 articles SEO local | Articles 900-1200 mots, optimisés sur requêtes "mandataire immobilier [ville]", "vendre appartement [quartier]", etc. | OUI total | zone_geo, specialite, mots_cles_seo (depuis @seo), marche_local | `article_seo_local` | Markdown avec frontmatter (title, metadesc, slug) | Vérification données de marché, facts-checking local | P0 |
| L5 | Calendrier éditorial 30 jours | Tableau 30 cases : date, plateforme, type de post, sujet, angle, hashtags | OUI total | zone_geo, biens[], sujets_prioritaires, frequence_publication, evenements_locaux | `editorial_calendar` | JSON `{date, platform, type, sujet, angle, hashtags[]}` | Vérification cohérence avec agenda réel du client | P1 |
| L6 | 20 posts prêts à publier | Textes complets (Instagram, Facebook, LinkedIn) avec hashtags, brief visuel Canva | OUI total | calendar (L5), zone_geo, biens[], ton_client, style | `post_social` x20 | JSON `{texte, hashtags[], brief_visuel, plateforme}` | Échantillon 5 posts sur 20 — vérifier ton et personnalisation | P0 |
| L7 | 10 scripts Reels | Découpage scène par scène : durée, texte voix off, indication visuelle, musique suggérée | OUI total | biens[], zone_geo, ton_client, profil_confort_video | `script_reel` x10 | Markdown par script (scènes numérotées) | Relecture complète — cohérence avec l'aisance réelle du client | P1 |
| L8 | Kit graphique personnalisé | **NON AUTOMATISABLE** — voir section 2.4 | NON | — | — | — | — | P2 |

---

### 2.2 Pack Mensuel (197€/mois — récurrent)

| # | Livrable | Ce que Sophie reçoit | Auto IA | Input client_context | Prompt type | Output format | QA humaine | Priorité |
|---|----------|---------------------|---------|---------------------|-------------|---------------|------------|----------|
| M1 | 12 posts réseaux sociaux | 4 Instagram + 4 Facebook + 4 LinkedIn — textes complets, hashtags, brief visuel | OUI total | biens_mois[], evenements_mois, ton_client, sujets_valides, historique_posts | `post_social` x12 | JSON array `{texte, hashtags[], brief_visuel, plateforme, date_suggeree}` | 3 posts sur 12 — vérifier fraîcheur et personnalisation | P0 |
| M2 | 4 scripts vidéo | Découpage scènes, voix off, visuels suggérés, durée cible (30-60s pour Reels, 2-3min pour YouTube Shorts) | OUI total | biens_mois[], zone_geo, sujets_mois, ton_client | `script_video` x4 | Markdown par script | 1 script sur 4 — vérifier que le format est réalisable par Sophie seule | P0 |
| M3 | 2 articles SEO local | Articles 900-1200 mots, requêtes longue traîne locales, maillage interne | OUI total | zone_geo, mots_cles_mois, marche_local, biens_recents | `article_seo_local` x2 | Markdown avec frontmatter | Vérification complète — données de marché, prix, exactitude géographique | P0 |
| M4 | 1 newsletter | Email HTML : édito mensuel, bien du mois mis en avant, conseil acheteur/vendeur, CTA visite | OUI total | biens_mois[], marche_local_mois, ton_client, historique_newsletters | `newsletter` | HTML email + version texte brut | Relecture complète — la newsletter porte la signature du client | P0 |
| M5 | 4 annonces immobilières personnalisées | Textes annonces pour les 4 biens actifs (ou renouvellement des annonces existantes) — storytelling local | OUI total | biens[] (titre, adresse, type, prix, surface, pieces, points_forts), zone_geo, quartier_data | `annonce_storytelling` x4 | Markdown par annonce (titre + corps 500-800 mots + accroche courte 150 car.) | Vérification obligatoire — données du bien + données locales | P0 |
| M6 | 1 email prospection vendeurs | Email froid personnalisé pour les propriétaires de la zone du client | OUI total | zone_geo, specialite, resultats_recents, ton_client | `email_prospection` | Texte brut + HTML | Relecture — vérifier les promesses implicites (conformité CGV) | P0 |

---

### 2.3 Boost Mandat (97€/bien — ponctuel)

| # | Livrable | Ce que Sophie reçoit | Auto IA | Input client_context | Prompt type | Output format | QA humaine | Priorité |
|---|----------|---------------------|---------|---------------------|-------------|---------------|------------|----------|
| B1 | Annonce storytelling du bien | Annonce complète 600-900 mots : accroche quartier, histoire du bien, projection acheteur type, CTA visite | OUI total | bien{titre, adresse, type, prix, surface, pieces, points_forts, lien_photos}, quartier_data | `annonce_storytelling_boost` | Markdown + version courte 200 car. pour SeLoger/LBC | Vérification données bien + données locales — obligatoire | P0 |
| B2 | 3 posts dédiés + 1 Reel | 2 posts Instagram + 1 LinkedIn + 1 script Reel de présentation du bien | OUI total | bien (depuis B1), ton_client, zone_geo | `post_boost_bien` x3 + `script_reel_boost` | JSON posts + Markdown script | Vérification mentions légales et prix exact | P0 |
| B3 | Mini landing page du bien | Page HTML standalone : photos, description, caractéristiques, carte, formulaire contact | OUI partiel | bien (depuis B1), annonce (depuis B1), client{nom, prenom, email, tel, photo} | `landing_bien` | HTML complet (auto-hébergeable) — le texte est généré, la structure est un template | QA complète — URL, liens, formulaire contact fonctionnel | P1 |
| B4 | Email blast acheteurs | Email court et percutant pour la liste d'acheteurs potentiels du client | OUI total | bien (depuis B1), acheteurs_criteres_sauvegardes[], ton_client | `email_blast_acheteurs` | HTML email + texte brut | Relecture — vérifier le ciblage (ne pas envoyer une maison à un chercheur d'appartement) | P0 |

---

### 2.4 Services non automatisables — Justification et alternatives

**Kit graphique personnalisé (L8 — Pack Lancement)**

Pourquoi NON : un kit graphique requiert du design vectoriel (logo, chartes couleurs, templates Canva cohérents) que les LLM de texte ne produisent pas. Les modèles de génération d'images (Midjourney, DALL-E, Stable Diffusion) peuvent générer des visuels mais pas des fichiers Canva éditables, des palettes de marque cohérentes ou des templates vectoriels.

Alternatives proposées :
- **P0 — Brief graphique IA** : générer un document structuré (couleurs hex, typos recommandées, moodboard textuel, directives) que Sophie peut utiliser dans Canva en autonomie. Prompt type : `design_brief`. Livrable : Markdown + JSON `{couleurs[], typos[], style_visual, moodboard_description}`.
- **P1 — Partenariat Canva** : intégrer un template Canva pré-rempli via l'API Canva (programmatique). Investissement : 1-2 jours dev.
- **P2 — Sous-traitance** : pool de 2-3 graphistes freelance, livraison en 72h, marge incluse dans le prix du pack.

**Décision recommandée pour le MVP** : livrer le brief graphique IA (P0) + indiquer dans les CGV que le kit graphique comprend un guide de style + templates Canva personnalisables. Sous-traitance graphiste à activer dès le 5e client pour valider la demande.

---

## 3. Architecture technique recommandée

### 3.1 Fichiers à créer en priorité

```
src/
├── lib/
│   ├── claude.ts          ← Client Anthropic, wrapper generateContent()
│   ├── client-context.ts  ← Compiler les données onboarding → prompt context
│   └── prompts/           ← Un fichier par type de prompt
│       ├── post-social.ts
│       ├── annonce-storytelling.ts
│       ├── article-seo.ts
│       ├── script-video.ts
│       ├── newsletter.ts
│       ├── email-prospection.ts
│       ├── positioning-statement.ts
│       └── bio-multiformat.ts
├── app/
│   └── api/
│       ├── generate/
│       │   ├── pack-lancement/route.ts   ← Génère les 7 livrables automatisables L1-L7
│       │   ├── pack-mensuel/route.ts     ← Génère les 6 livrables M1-M6
│       │   └── boost-mandat/route.ts     ← Génère les 4 livrables B1-B4
│       └── admin/
│           └── trigger-production/route.ts  ← Bouton admin "Lancer la production"
```

### 3.2 Workflow de génération (pseudo-code)

```
POST /api/admin/trigger-production
  → Lire client_context depuis DB (profil onboarding + biens)
  → Compiler en prompt context structuré (client-context.ts)
  → Appeler generateContent() par type de livrable (parallélisé)
  → Sauvegarder chaque livrable en DB (table livrables, statut "qa")
  → Notifier admin (email + dashboard update)

POST /api/generate/pack-mensuel
  Body: { client_id, mois }
  → Fetch client data
  → Parallel: [post_social x12, script_video x4, article_seo x2, newsletter x1, annonce x4, email_prospection x1]
  → Insert livrables (statut "qa")
  → Return { livrable_ids[], statuts[] }
```

### 3.3 Structure du client_context (input des prompts)

```typescript
interface ClientContext {
  // Identité
  prenom: string
  nom: string
  reseau: string  // IAD, SAFTI, etc.
  annees_experience: number
  specialite: string
  zone_geo: { ville: string; rayon_km: number; quartiers_refs: string[] }

  // Style
  ton: 'tutoiement' | 'vouvoiement'
  style: 'professionnel' | 'chaleureux' | 'dynamique'
  sujets_a_eviter: string[]

  // Biens actifs
  biens: Bien[]

  // Contexte marché (enrichi via API publiques)
  marche_local: { prix_m2_moyen: number; tendance: string; ecoles_ref: string[] }

  // Historique (pour éviter les répétitions)
  derniers_sujets_traites: string[]
}
```

---

## 4. Priorisation — Services à coder en premier

### Phase 0 — Foundation (avant le premier client)

| Priorité | Fichier | Effort estimé | Bloquant pour |
|----------|---------|---------------|---------------|
| 1 | `src/lib/claude.ts` | 2h | Tout |
| 2 | `src/lib/client-context.ts` | 3h | Tout |
| 3 | `src/lib/prompts/annonce-storytelling.ts` | 2h | L3, M5, B1 |
| 4 | `src/lib/prompts/post-social.ts` | 2h | L6, M1, B2 |
| 5 | `src/app/api/generate/pack-mensuel/route.ts` | 4h | M1-M6 |
| 6 | `src/app/api/admin/trigger-production/route.ts` | 2h | Bouton admin |

**Total Phase 0 : ~15h — 2 jours de dev.**

### Phase 1 — Pack Lancement complet (mois 1)

| Priorité | Service | Effort estimé |
|----------|---------|---------------|
| 7 | `positioning_statement` + `bio_multiformat` (L1, L2) | 3h |
| 8 | `article_seo_local` (L4) | 2h |
| 9 | `editorial_calendar` (L5) | 2h |
| 10 | `script_reel` (L7) | 2h |
| 11 | `design_brief` (L8 alternative) | 1h |
| 12 | `src/app/api/generate/pack-lancement/route.ts` | 3h |

**Total Phase 1 : ~13h — 2 jours de dev.**

### Phase 2 — Boost Mandat + automatisation (mois 2)

| Priorité | Service | Effort estimé |
|----------|---------|---------------|
| 13 | `email_prospection` (M6) | 1h |
| 14 | `newsletter` (M4) | 2h |
| 15 | Boost Mandat complet (B1-B4) + route `/api/generate/boost-mandat` | 5h |
| 16 | Cron job déclenchement mensuel automatique | 3h |
| 17 | Mini landing page bien (B3 — template HTML) | 4h |

**Total Phase 2 : ~15h — 2 jours de dev.**

---

## 5. Estimation temps totale par service

| Service | Prompt (rédaction) | Dev (route + tests) | Total |
|---------|--------------------|---------------------|-------|
| `post_social` | 2h | 2h | 4h |
| `annonce_storytelling` | 2h | 2h | 4h |
| `article_seo_local` | 2h | 2h | 4h |
| `script_video` / `script_reel` | 1h | 1h | 2h |
| `newsletter` | 1h | 1h | 2h |
| `email_prospection` | 1h | 1h | 2h |
| `positioning_statement` | 2h | 1h | 3h |
| `bio_multiformat` | 1h | 1h | 2h |
| `editorial_calendar` | 1h | 1h | 2h |
| `design_brief` | 1h | 1h | 2h |
| `landing_bien` (template) | 2h | 3h | 5h |
| Foundation (`claude.ts` + `client-context.ts`) | 0h | 5h | 5h |
| Routes API (3 endpoints generate) | 0h | 9h | 9h |
| **TOTAL** | **16h** | **30h** | **46h** |

**MVP fonctionnel (P0 seulement) : ~25h de dev — environ 3 jours.**

---

## Hypothèses à valider

- [HYPOTHESE : les 6 livrables du Pack Mensuel peuvent être générés en parallèle sans dépasser la limite de rate de l'API Anthropic en tier gratuit — à vérifier selon le plan API souscrit]
- [HYPOTHESE : budget tokens 2-3€/client/mois (mention project-context.md) — à mesurer sur le premier client réel avec des prompts finaux]
- [HYPOTHESE : la mini landing page bien (B3) utilise un template HTML statique avec injection de variables — si Vercel/Replit génère des pages dynamiques, l'effort est doublé]

---

*Document produit dans le cadre du framework Gradient Agents.*
*Référence : project-context.md, roadmap.md, functional-specs.md, infrastructure.md, personas.md*
