# Spec fonctionnelle — Upload photos + Annonce complète + Page publique du bien

**Projet** : ImmoCrew
**Persona** : Sophie, mandataire IAD — veut une annonce prête à publier sans effort technique
**Date** : 2026-03-28
**Rattachement produit** : Boost Mandat (100€/bien) — upsell réservé aux abonnés Pack Mensuel
**KPI North Star impacté** : rétention abonnés Pack Mensuel (une feature Boost réussie = renouvellement du pack)

---

## 1. Contexte et scope

### Ce qui existe déjà (à réutiliser)

| Fichier | Rôle |
|---|---|
| `src/app/api/upload-photo/route.ts` | Upload photo de profil base64 → Object Storage. Logique de validation et upload à réutiliser directement. |
| `src/lib/storage.ts` | `uploadFile()`, `getFileContent()`, `deleteFile()` — API Object Storage Replit |
| `src/app/api/generate/boost-mandat/route.ts` | Génère l'annonce storytelling (B1), 3 posts (B2), 1 Reel (B2), landing HTML (B3), email blast (B4) pour un bien |
| `src/lib/prompts/annonce-storytelling.ts` | Prompt annonce storytelling 600-900 mots. Supporte `bien_unique` + `donnees_locales` DVF |
| `src/lib/prompts/annonce-enrichie.ts` | Prompt annonce enrichie avec DPE/DVF — version longue storytelling + courte portail (SeLoger 1500 car.) |
| `src/app/bien/[id]/page.tsx` | Page publique du bien — galerie photos, annonce, carte DVF/DPE, contact. Fonctionne déjà. |
| `src/types/property.ts` | `PropertyPage`, `PropertyPhoto` — types complets. `photos_originales: PropertyPhoto[]` est déjà dans le schéma. |
| `sql/008_definitive_fix.sql` | Table `property_pages` avec colonnes `photos_originales JSONB`, `annonce_longue`, `titre_annonce`, `slug`, `status` |

### Ce qui manque (à construire)

1. Un endpoint pour uploader N photos liées à un `property_page_id`
2. Un endpoint pour créer une `property_page` depuis le dashboard Sophie (sans passer par l'admin)
3. Un endpoint pour générer l'annonce complète depuis la `property_page` (version self-service, pas admin-only)
4. Un endpoint pour servir les photos via URL publique (proxy Object Storage)
5. Les composants UI dashboard : formulaire bien, upload multi-photos, bloc annonce générée avec copier-coller

---

## 2. User stories

### US-01 — Saisir un bien à vendre

**En tant que** Sophie (mandataire connectée),
**je veux** créer une fiche pour un de mes biens en saisissant ses caractéristiques (type, adresse, prix, surface, pièces, points forts),
**afin d'** avoir une base de données de mes mandats dans ImmoCrew.

**Critères d'acceptance :**
- [ ] Le formulaire contient au minimum : type de bien (liste), adresse, prix, surface, nombre de pièces, points forts (textarea)
- [ ] Après soumission, la fiche est sauvegardée en base (status `draft`) et Sophie est redirigée vers la page de la fiche
- [ ] Si un champ obligatoire est manquant, un message d'erreur apparaît sous le champ concerné (pas un alert JS)
- [ ] Sophie peut créer plusieurs biens (pas de limite à 1)

**Edge cases :**
- Prix = 0 ou négatif → erreur "Prix invalide"
- Adresse non géolocalisable → le bien est sauvegardé sans lat/lon, l'enrichissement DVF sera impossible (message d'avertissement non bloquant)

---

### US-02 — Uploader des photos pour un bien

**En tant que** Sophie,
**je veux** ajouter entre 3 et 10 photos pour un de mes biens depuis mon dashboard,
**afin que** mes annonces et ma page publique contiennent de vraies photos du logement.

**Critères d'acceptance :**
- [ ] Upload multiple : Sophie peut sélectionner plusieurs fichiers en une fois (ou les déposer en drag-and-drop)
- [ ] Formats acceptés : JPG, PNG, WebP — taille max par fichier : 5 Mo
- [ ] Aperçu de chaque photo uploadée avec possibilité de la supprimer individuellement
- [ ] Chaque photo est stockée sous la clé `clients/{email}/biens/{property_page_id}/{ordre}_{timestamp}.{ext}` dans Object Storage
- [ ] Les photos sont sauvegardées dans `property_pages.photos_originales` (JSONB, format `PropertyPhoto[]`)
- [ ] Si une photo dépasse 5 Mo, elle est rejetée avec un message "Cette photo dépasse 5 Mo — réduis sa taille avant upload"
- [ ] Le bouton "Générer mon annonce" s'active uniquement quand au moins 1 photo est uploadée

**Edge cases :**
- Upload de 11 photos → la 11e est bloquée avec "Maximum 10 photos par bien"
- Echec réseau pendant upload → message d'erreur par photo, les autres photos uploadées avec succès restent sauvegardées
- Photo corrompue → rejetée silencieusement avec message d'erreur

---

### US-03 — Générer une annonce complète prête à copier-coller

**En tant que** Sophie,
**je veux** générer en un clic une annonce immobilière complète pour mon bien,
**afin de** pouvoir la copier-coller directement sur SeLoger, LeBonCoin ou Bien'ici sans reformater.

**Critères d'acceptance :**
- [ ] Le bouton "Générer mon annonce" déclenche la génération IA (appel backend, pas bloquant — état loading visible)
- [ ] L'annonce générée contient : titre accrocheur, accroche courte, description storytelling 600-900 mots, récapitulatif caractéristiques (prix, surface, pièces, DPE si dispo), points d'intérêt du quartier (DVF), lien vers la page publique du bien
- [ ] L'annonce est présentée dans un bloc texte avec un bouton "Copier l'annonce" (clipboard API)
- [ ] Une version courte (≤1500 caractères, format SeLoger/LeBonCoin) est générée en parallèle et disponible via onglet "Version courte"
- [ ] L'annonce est sauvegardée dans `property_pages.annonce_longue`, `annonce_courte`, `titre_annonce`, `accroche_courte`
- [ ] La page publique du bien est automatiquement mise en `status: published` après génération réussie

**Edge cases :**
- Adresse non géolocalisée → annonce générée sans données DVF, avec mention "Données quartier non disponibles"
- Timeout IA (>30s) → message d'erreur "La génération a pris trop longtemps — réessaie" sans perte des données du bien
- Régénération : si une annonce existe déjà, confirmation "Écraser l'annonce existante ?"

---

### US-04 — Accéder à la page publique du bien et la partager

**En tant que** Sophie,
**je veux** avoir un lien partageable vers la page publique de mon bien,
**afin de** l'envoyer à des acheteurs potentiels par SMS/email et l'intégrer dans mes annonces portails.

**Critères d'acceptance :**
- [ ] La page publique est accessible à `/bien/[slug]` sans authentification
- [ ] Le slug est généré automatiquement à partir de l'adresse et du type de bien (ex: `appartement-3-pieces-lyon-6-1234`)
- [ ] Sophie dispose d'un bouton "Copier le lien" dans son dashboard (copie `https://immocrew.fr/bien/[slug]`)
- [ ] La page affiche : photos en galerie, annonce storytelling, carte, DVF, DPE si disponible, formulaire de contact mandataire
- [ ] Les métadonnées Open Graph sont générées (titre, description, image de prévisualisation = 1re photo)

**Edge cases :**
- Deux biens avec la même adresse → slug suffixé avec un compteur (ex: `appartement-3-pieces-lyon-6-1234-2`)
- Bien en `draft` → la page `/bien/[slug]` renvoie une 404

---

### US-05 — Voir et gérer mes biens depuis le dashboard

**En tant que** Sophie,
**je veux** voir la liste de tous mes biens avec leur statut (brouillon, publié, archivé),
**afin de** suivre mes mandats actifs et accéder rapidement à chaque fiche.

**Critères d'acceptance :**
- [ ] La section "Mes biens" du dashboard liste tous les biens de Sophie (filtrés par `client_id`)
- [ ] Chaque carte bien affiche : photo principale (ou placeholder), titre, prix, statut, lien "Voir la page publique"
- [ ] Actions disponibles par bien : "Modifier", "Ajouter des photos", "Générer annonce", "Archiver"
- [ ] État vide : si aucun bien, un CTA "Ajouter mon premier bien" s'affiche

**Edge cases :**
- Sophie a 0 bien → état vide avec CTA
- Bien archivé → sa page publique renvoie 404

---

## 3. Parcours utilisateur — Flux principal

```
[Dashboard Sophie]
      ↓
  Section "Mes biens"
      ↓
  Bouton "Ajouter un bien"
      ↓
  [Formulaire bien] → saisie type/adresse/prix/surface/pièces/points forts
      ↓  [POST /api/biens]
  Création en base (status: draft) + géocodage + enrichissement DVF async
      ↓
  [Fiche bien — onglet "Photos"]
      ↓
  Zone upload drag-and-drop (3-10 photos)
      ↓  [POST /api/biens/[id]/photos] × N photos
  Preview + ordre configurable
      ↓
  Bouton "Générer mon annonce" (actif dès 1 photo)
      ↓  [POST /api/biens/[id]/generate-annonce]
  État loading (spinner, "Rédaction en cours...")
      ↓
  [Bloc annonce générée]
    ├── Onglet "Annonce longue" (600-900 mots) + bouton "Copier"
    ├── Onglet "Annonce courte" (≤1500 car. portails) + bouton "Copier"
    └── Bouton "Voir ma page publique" → /bien/[slug] (nouvel onglet)
```

---

## 4. Endpoints API à créer

### POST `/api/biens`

Crée une nouvelle fiche bien (authentification Sophie requise, pas admin).

**Body :**
```json
{
  "titre": "Appartement lumineux Croix-Rousse",
  "type_bien": "Appartement",
  "adresse": "12 rue Leynaud, 69001 Lyon",
  "prix": 320000,
  "surface": 68,
  "pieces": 3,
  "points_forts": "Parquet chêne, double exposition, cave",
  "description_detaillee": "..."  // optionnel
}
```

**Comportement :**
1. Authentifier Sophie via session NextAuth (`getSessionUser()`)
2. Insérer dans `property_pages` avec `client_id` et `client_email` de la session, `status: draft`
3. Générer un `slug` unique à partir de l'adresse (slugify + unicité en base)
4. Déclencher en async (fire-and-forget) : géocodage BAN + enrichissement DVF → `UPDATE property_pages SET lat, lon, city, postcode, dvf_prix_m2_moyen ...`
5. Retourner `{ id, slug }`

**Réponses :**
- `201` : `{ id: "uuid", slug: "appartement-3-pieces-lyon-1-abc" }`
- `400` : champ obligatoire manquant
- `401` : non authentifiée

---

### POST `/api/biens/[id]/photos`

Upload une photo liée à un bien. Appelé N fois (une par photo).

**Réutilise la logique de** `src/app/api/upload-photo/route.ts` (validation base64, vérification MIME, limite 5 Mo, `uploadFile()`).

**Body :**
```json
{
  "photo": "data:image/jpeg;base64,...",
  "piece": "salon",
  "ordre": 1
}
```

**Comportement :**
1. Vérifier que le `property_page_id` appartient à Sophie (`client_id` = session user id)
2. Valider le fichier (MIME, taille)
3. Stocker sous la clé `clients/{email}/biens/{id}/{ordre}_{timestamp}.{ext}`
4. Ajouter l'entrée `PropertyPhoto` dans `property_pages.photos_originales` (JSONB array append)
5. Retourner `{ key, url: "/api/photos/[key]" }`

**Réponses :**
- `201` : `{ key, url }`
- `400` : format/taille invalide
- `403` : bien n'appartient pas à Sophie
- `409` : déjà 10 photos sur ce bien

---

### DELETE `/api/biens/[id]/photos/[key]`

Supprime une photo d'un bien.

**Comportement :**
1. Vérifier ownership (Sophie est propriétaire du bien)
2. Supprimer le fichier de Object Storage (`deleteFile(key)`)
3. Retirer l'entrée de `property_pages.photos_originales`

---

### POST `/api/biens/[id]/generate-annonce`

Génère l'annonce complète pour un bien. Version self-service (authentification Sophie, pas admin-only).

**Comportement :**
1. Vérifier ownership + statut du bien
2. Récupérer le `client_context` de Sophie (via `getClientContext(client_id)`)
3. Récupérer les données du bien depuis `property_pages` (incl. DVF, DPE, photos)
4. Appeler `buildAnnonceStorytellingPrompt()` avec `bien_unique` + `donnees_locales` DVF
5. Appeler `buildAnnonceEnrichiePrompt()` pour la version courte portails (≤1500 car.)
6. Construire le lien page publique : `https://immocrew.fr/bien/[slug]`
7. Injecter le lien dans le CTA de l'annonce longue et courte
8. Sauvegarder dans `property_pages` : `annonce_longue`, `annonce_courte`, `titre_annonce`, `accroche_courte`
9. Passer le bien en `status: published` + `published_at: NOW()`
10. Retourner `{ annonce_longue, annonce_courte, titre_annonce, accroche_courte, page_url }`

**Réponses :**
- `200` : `{ annonce_longue, annonce_courte, titre_annonce, accroche_courte, page_url }`
- `400` : aucune photo uploadée (pré-requis bloquant)
- `403` : ownership
- `504` : timeout IA

---

### GET `/api/photos/[...key]`

Sert une photo depuis Object Storage avec le bon `Content-Type`.

**Pourquoi :** Replit Object Storage ne génère pas d'URL publiques directes. Les photos sont accessibles uniquement via l'API Node — il faut un proxy.

**Comportement :**
1. Lire le fichier via `getFileContent(key)` (`src/lib/storage.ts`)
2. Déduire le `Content-Type` à partir de l'extension de la clé
3. Retourner la réponse avec headers `Cache-Control: public, max-age=31536000, immutable`

**Note de sécurité :** Les photos de biens publiés sont publiques (page `/bien/[slug]` sans auth). Les photos de biens en `draft` ne doivent être accessibles qu'à Sophie — ajouter une vérification de session pour les clés `clients/*/biens/*` appartenant à un bien en `draft`.

---

## 5. Modifications de schéma SQL

La table `property_pages` couvre déjà les besoins. **Aucune nouvelle table nécessaire.**

Un seul ajout de colonne requis pour tracer l'état de la génération d'annonce :

```sql
-- Migration 009_photo_upload.sql
ALTER TABLE property_pages
  ADD COLUMN IF NOT EXISTS annonce_generated_at TIMESTAMPTZ;

-- Index pour filtrer les biens par statut depuis le dashboard Sophie
CREATE INDEX IF NOT EXISTS idx_property_pages_client_status
  ON property_pages (client_id, status);
```

La colonne `photos_originales JSONB DEFAULT '[]'` existe déjà. L'append se fait via :

```sql
UPDATE property_pages
SET photos_originales = photos_originales || $1::jsonb,
    updated_at = NOW()
WHERE id = $2 AND client_id = $3
```

---

## 6. Composants UI à créer ou modifier

### Nouveaux composants

| Composant | Chemin | Description |
|---|---|---|
| `BienForm` | `src/components/biens/BienForm.tsx` | Formulaire de création/édition d'un bien. Champs : type (select), adresse, prix, surface, pièces, points forts, description. Validation côté client (zod ou react-hook-form). |
| `PhotoUploader` | `src/components/biens/PhotoUploader.tsx` | Zone drag-and-drop + input file multiple. Preview des photos uploadées. Bouton suppression par photo. Barre de progression par upload. Limite 10 photos / 5 Mo. Réutilise la logique base64 de `upload-photo/route.ts`. |
| `AnnonceBlock` | `src/components/biens/AnnonceBlock.tsx` | Affiche l'annonce générée avec 2 onglets (Longue / Courte). Bouton "Copier" (clipboard). Lien "Voir ma page publique". État loading (skeleton). État vide ("Pas encore d'annonce générée"). |
| `BienCard` | `src/components/biens/BienCard.tsx` | Carte bien dans la liste du dashboard. Photo principale (ou placeholder), titre, prix formaté, badge statut (Brouillon / Publié / Archivé), actions rapides. |
| `MesBiensSection` | `src/components/dashboard/MesBiensSection.tsx` | Section "Mes biens" dans le dashboard. Liste des `BienCard`. État vide avec CTA. Bouton "Ajouter un bien". |

### Composants existants à modifier

| Composant | Modification |
|---|---|
| `src/app/dashboard/page.tsx` | Ajouter la section `MesBiensSection` dans la page dashboard Sophie |
| `src/app/bien/[id]/page.tsx` | Aucune modification requise — la page publique fonctionne déjà avec les données de `property_pages` |

### Nouveaux écrans (routes App Router)

| Route | Description |
|---|---|
| `/dashboard/biens/nouveau` | Formulaire de création d'un bien (`BienForm`) |
| `/dashboard/biens/[id]` | Fiche bien — onglets : "Photos" (`PhotoUploader`) / "Annonce" (`AnnonceBlock`) / "Aperçu" (lien page publique) |

### États UI obligatoires par composant interactif

**PhotoUploader :**
- Défaut : zone drag-and-drop vide avec message "Glisse tes photos ici ou clique pour sélectionner"
- Loading : barre de progression par photo en cours d'upload
- Vide (après suppression de toutes les photos) : même état que défaut
- Erreur : message par photo rejetée (taille, format), en rouge sous la photo
- Succès : preview de la photo avec coche verte + bouton de suppression

**AnnonceBlock :**
- Défaut : bouton "Générer mon annonce" actif si ≥1 photo présente, désactivé sinon (tooltip "Ajoute au moins une photo")
- Loading : skeleton de texte + spinner + message "Rédaction en cours... (30 secondes)"
- Erreur : message d'erreur + bouton "Réessayer"
- Succès : texte de l'annonce affiché, onglets Longue/Courte, bouton "Copier"
- Régénération : si annonce existe, bouton secondaire "Régénérer" avec modal de confirmation

---

## 7. Dépendances — fichiers existants à réutiliser

| Besoin | Fichier source | Ce qu'on réutilise |
|---|---|---|
| Upload fichier | `src/app/api/upload-photo/route.ts` | Validation base64, détection MIME, limite 5 Mo, appel `uploadFile()` |
| Stockage | `src/lib/storage.ts` | `uploadFile()`, `getFileContent()`, `deleteFile()` |
| Auth session | `src/lib/getSessionUser.ts` | `getSessionUser()` pour identifier Sophie |
| Génération annonce longue | `src/lib/prompts/annonce-storytelling.ts` | `buildAnnonceStorytellingPrompt()` avec `bien_unique` + `donnees_locales` |
| Génération annonce courte | `src/lib/prompts/annonce-enrichie.ts` | Prompt version portail SeLoger (≤1500 car.) |
| DB queries | `src/lib/db.ts` | `query()` pour les SELECT/INSERT/UPDATE sur `property_pages` |
| Génération JSON Claude | `src/lib/claude.ts` | `generateJSON()` |
| Page publique | `src/app/bien/[id]/page.tsx` | Aucune modification — consomme les données `property_pages` déjà sauvegardées |
| Types | `src/types/property.ts` | `PropertyPage`, `PropertyPhoto` |

---

## 8. Plan d'exécution par dépendances

```
[1] Migration SQL 009  →  précède tout
[2] GET /api/photos/[...key]  →  précède les composants UI qui affichent des photos
[3] POST /api/biens  →  précède l'upload photos et la génération
[4] POST /api/biens/[id]/photos  →  dépend de [1] [2] [3]
[5] DELETE /api/biens/[id]/photos/[key]  →  dépend de [4]
[6] POST /api/biens/[id]/generate-annonce  →  dépend de [3] [4]
[7] BienForm + route /dashboard/biens/nouveau  →  dépend de [3]
[8] PhotoUploader  →  dépend de [4] [5]
[9] AnnonceBlock  →  dépend de [6]
[10] BienCard + MesBiensSection + dashboard  →  dépend de [7] [8] [9]
```

[2], [3] et [7] sont parallélisables après [1].

---

## Hypothèses à valider

- [HYPOTHESE] Le lien de page publique est `https://immocrew.fr/bien/[slug]` — à confirmer selon le domaine de production final
- [HYPOTHESE] Les photos de biens publiés sont publiques sans auth (nécessaire pour Open Graph / SEO). Si Sophie veut des pages privées, ajouter une option "page privée avec mot de passe" post-V1
- [HYPOTHESE] La génération d'annonce est déclenchée manuellement par Sophie (pas automatique à l'upload). Si le fondateur préfère une génération automatique post-upload, l'`AnnonceBlock` passe en mode "auto-généré, modifiable"
- [HYPOTHESE] Le lien vers la page publique est injecté en bas de l'annonce longue et courte comme CTA ("Voir la fiche complète avec photos : [url]")

---

**Handoff → @fullstack**

Fichiers produits :
- `/home/user/Mandataire-Immo/docs/product/photo-upload-spec.md`

Décisions prises :
- Pas de nouvelle table SQL — `property_pages` couvre tous les besoins avec une seule colonne supplémentaire (`annonce_generated_at`)
- Les photos sont servies via un proxy API Next.js `/api/photos/[...key]` — pas d'URL Object Storage directes
- La génération d'annonce réutilise `buildAnnonceStorytellingPrompt()` + `buildAnnonceEnrichiePrompt()` existants, en mode self-service (auth Sophie, pas admin-only)
- Le slug est généré côté serveur à la création du bien (slugify de l'adresse + unicité en base)
- Le lien page publique est injecté dans l'annonce générée comme CTA final

Points d'attention :
- L'endpoint `POST /api/biens/[id]/generate-annonce` DOIT passer le bien en `status: published` — la page `/bien/[id]` ne répond qu'aux biens published
- Le proxy photos doit gérer le cache agressif (immutable, 1 an) pour les biens publiés
- La sécurité du proxy photos : biens en `draft` → vérification session obligatoire, biens `published` → accès libre
- `buildAnnonceEnrichiePrompt()` dans `annonce-enrichie.ts` s'attend à un format de données légèrement différent de `annonce-storytelling.ts` — vérifier la compatibilité avant d'appeler les deux en parallèle
