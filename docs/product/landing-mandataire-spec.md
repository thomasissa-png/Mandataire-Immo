# Spec — Landing page mandataire (`/agent/[slug]`)

> Produit par @product-manager le 2026-03-31. Handoff → @fullstack.

---

## 1. Résumé

Page publique par mandataire, accessible à `/agent/[slug]` (ex : `/agent/sophie-martin`). Générée à partir des données `client_context`. Sert de vitrine personnelle référençable sur Google (opt-in), partageables sur les réseaux, et renforçant la crédibilité de Sophie auprès de ses prospects vendeurs/acheteurs.

---

## 2. User stories

1. En tant que Sophie, je veux partager un lien vers ma page mandataire afin de donner confiance à un vendeur qui hésite à me confier son mandat.
2. En tant que Sophie, je veux activer l'indexation Google de ma page afin que mon nom apparaisse dans les résultats de recherche locaux.
3. En tant que Sophie, je veux que ma bio soit générée par IA à partir de mon profil afin de ne pas avoir à rédiger moi-même mon accroche professionnelle.
4. En tant que Sophie (Pack Mensuel), je veux éditer ma page quand je veux afin de refléter mes nouveaux biens et mes nouvelles spécialités.
5. En tant que Sophie (Pack Lancement), je veux que ma page soit active pendant 1 mois afin de profiter de mon onboarding sans engagement supplémentaire.

---

## 3. Règles métier

- **Indexation Google** : désactivée par défaut (`noindex`). Sophie active le toggle dans ses réglages → `meta robots = index, follow`.
- **Bio IA** : générée automatiquement à l'activation (prompt `bio-multiformat.ts`), format `court` (3-4 lignes). Stockée dans `client_context.bio_generee`. Sophie peut l'éditer librement ensuite — l'édition écrase `bio_generee` sans relancer l'IA.
- **Accès par pack** :
  - Pack Lancement : page activée à la livraison J+2. Édition libre pendant 1 mois. Après 1 mois : page figée (readonly) ou désactivée si le client n'a pas souscrit au Pack Mensuel. Décision fondateur : figée par défaut (préférable à disparaître — conserve la valeur SEO).
  - Pack Mensuel : édition illimitée tant que l'abonnement est actif. Si résiliation → page figée (même règle que Pack Lancement expiré).
- **URL slug** : `prenom-nom` en minuscules, sans accents, tirets à la place des espaces (ex : `marie-dupont`). Généré à l'activation, non modifiable ensuite (risque de casser les liens partagés).
- **Biens affichés** : uniquement les biens ayant une `property_pages` avec `status = 'published'` liés au `clerk_user_id` du mandataire.
- **Page désactivée** : si `agent_page.status = 'inactive'`, renvoie 404.

---

## 4. Sections de la page

| # | Section | Données source (`client_context` sauf mention) | Obligatoire |
|---|---|---|---|
| 1 | **Hero** : photo, prénom + nom, réseau (ex : IAD), ville, accroche courte | `photo_profil_key`, `prenom`, `nom`, `reseau`, `ville`, `bio_generee` | Oui |
| 2 | **Qui suis-je** : bio longue, années d'expérience, nb transactions/an, valeurs (3 max) | `bio_personnelle` (éditable) ou `bio_generee`, `experience_annees`, `nb_transactions_an`, `valeurs` | Oui |
| 3 | **Ma zone** : départements, quartiers, spécialités, types de biens, gamme de prix | `departement`, `quartiers`, `specialites`, `type_biens`, `gamme_prix` | Oui |
| 4 | **Mes biens** : grille jusqu'à 6 biens publiés (photo, titre, ville, prix, lien `/bien/[slug]`) | `property_pages` liées au `clerk_user_id`, `status = 'published'` | Non (masqué si 0 bien) |
| 5 | **Contact** : bouton email, téléphone si renseigné, lien LinkedIn/Instagram si renseigné | `ce_qui_te_differencie` (tagline sous le nom), email (Auth), `linkedin_url`, `instagram`, `facebook`, `site_web` | Oui |
| 6 | **Réseaux** : icônes cliquables vers les profils sociaux | `linkedin_url`, `instagram`, `facebook`, `site_web` | Non (masqué si tout vide) |

---

## 5. API

### `GET /api/agent/[slug]`
- Données publiques du mandataire + biens publiés
- Auth : publique
- Cache : ISR 1h (sauf si `revalidatePath` déclenché post-édition)
- Response : `{ agent: AgentProfile, biens: PropertySummary[] }`

### `POST /api/agent/activate`
- Déclenche la génération IA de la bio + création de `agent_pages` avec `status = 'active'`
- Auth : session (clerk_user_id du mandataire)
- Body : `{ pack: 'lancement' | 'mensuel' }`
- Side effects : appel `bio-multiformat.ts` format `court`, insertion `agent_pages`, `revalidatePath('/agent/[slug]')`

### `PATCH /api/agent/[slug]`
- Édition des champs visibles (bio, photo, quartiers, tagline)
- Auth : session — vérifie que `clerk_user_id` correspond au slug
- Guard : retourne 403 si `agent_pages.edition_locked = true` (Pack Lancement expiré)
- Body : `Partial<AgentEditableFields>`
- Side effects : `UPDATE client_context`, `revalidatePath`

---

## 6. Migration SQL

```sql
-- Table agent_pages (complète la table client_context existante)
CREATE TABLE IF NOT EXISTS agent_pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id    TEXT NOT NULL UNIQUE REFERENCES client_context(clerk_user_id) ON DELETE CASCADE,
  slug             TEXT NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'frozen')),
  indexation       BOOLEAN NOT NULL DEFAULT FALSE,
  bio_generee      TEXT,
  edition_locked   BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at        TIMESTAMPTZ,
  activated_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_pages_slug ON agent_pages(slug);
CREATE INDEX IF NOT EXISTS idx_agent_pages_clerk ON agent_pages(clerk_user_id);
```

---

## 7. Critères d'acceptance

- [ ] GIVEN slug valide et `status = 'active'` WHEN GET `/agent/sophie-martin` THEN page rendue avec les 6 sections, status HTTP 200.
- [ ] GIVEN slug inexistant ou `status = 'inactive'` WHEN GET `/agent/inconnu` THEN 404.
- [ ] GIVEN Sophie active sa page WHEN POST `/api/agent/activate` THEN bio générée par IA stockée dans `bio_generee`, page accessible dans les 5 secondes.
- [ ] GIVEN Sophie Pack Mensuel WHEN PATCH `/api/agent/sophie-martin` THEN champs mis à jour, page revalidée, 200.
- [ ] GIVEN Sophie Pack Lancement + `edition_locked = true` WHEN PATCH THEN 403 avec message "Ton accès en édition a expiré — passe au Pack Mensuel pour continuer à modifier ta page."
- [ ] GIVEN `indexation = false` WHEN rendu HTML THEN `<meta name="robots" content="noindex, nofollow">` présent.
- [ ] GIVEN `indexation = true` WHEN rendu HTML THEN balise robots absente (défaut Google = index).
- [ ] GIVEN 0 bien publié WHEN page rendue THEN section "Mes biens" masquée (aucun espace vide affiché).
- [ ] GIVEN `linkedin_url`, `instagram`, `facebook` tous vides WHEN page rendue THEN section "Réseaux" masquée.
- [ ] GIVEN utilisateur non-authentifié WHEN PATCH `/api/agent/[slug]` THEN 401.

---

**Handoff → @fullstack**

- Fichier produit : `/docs/product/landing-mandataire-spec.md`
- Décisions tranchées : URL `/agent/[slug]`, bio IA opt-in éditable, Pack Lancement = figé après 1 mois, indexation opt-in toggle, 0 mention `/bien/[id]` (pattern existant à réutiliser tel quel)
- Points d'attention :
  - Le slug est généré à l'activation et **non modifiable** — prévoir un guard dans la route PATCH
  - `edition_locked` doit être posé par un cron ou un webhook Stripe (résiliation / expiration Pack Lancement à J+30)
  - Section "Mes biens" réutilise la query `property_pages WHERE clerk_user_id = $1 AND status = 'published'` déjà présente dans `src/app/bien/[id]/page.tsx`
  - ISR 1h + `revalidatePath` post-PATCH pour éviter les pages périmées
  - `generateMetadata` : title = `[Prénom Nom] — Mandataire [Réseau] à [Ville]`, description = 150 car. depuis `bio_generee`
