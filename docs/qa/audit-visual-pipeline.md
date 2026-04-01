# Audit QA — Pipeline de generation de visuels

Date : 2026-04-01 | Auditeur : @qa

## 1. Coherence des types

| Point | Verdict | Detail |
|---|---|---|
| `GenerateVisualParams` matche weekly-batch | PASS | Les champs `briefVisuel`, `postContent`, `titre`, `plateforme`, `mandatairePrenom`, `ville` sont passes correctement (L119-127 weekly-batch) |
| `visual_key` stocke dans metadata JSONB | PASS | `jsonb_set(metadata, '{visual_key}', ...)` L130-133 weekly-batch |
| `canAutoGenerate` exclut les vraies photos | PASS | Whitelist par exclusion — 8 mots-cles de vraie photo detectes (L41-50 generate-post-visual) |

## 2. Gestion d'erreurs

| Point | Verdict | Detail |
|---|---|---|
| OPENAI_API_KEY manquante | PASS | `generatePostVisual` retourne `null` (L66). Mais `openai.ts` lance `throw` (L39) — pas de conflit car le check est en amont |
| Generation OpenAI echoue | PASS | try/catch L89-114 retourne `null`, le post est livre sans visuel |
| Upload Object Storage echoue | PASS | Couvert par le meme try/catch, retourne `null` |
| weekly-batch continue si visuel echoue | PASS | try/catch independant L119-137, n'affecte pas `deliverableIds` |

## 3. Securite

| Point | Verdict | Detail |
|---|---|---|
| Prompts sans donnees sensibles | PASS | Seuls brief, contenu, prenom, ville — pas de cles API ni emails |
| API /api/images/[key] sert les visuels | **FAIL** | **BUG BLOQUANT** — `ALLOWED_PREFIXES` = `["properties/", "clients/"]` mais les visuels sont stockes sous `visuals/posts/`. L'URL `/api/images/visuals%2Fposts%2F...` retourne 400. Aucun visuel ne sera jamais affiche. |

## 4. Performance

| Point | Verdict | Detail |
|---|---|---|
| Timeout 60s raisonnable | PASS | gpt-image-1 genere en 10-30s typiquement |
| Generation non-bloquante pour la livraison | **WARN** | Le code est sequentiel (`await generatePostVisual` L120-128), pas fire-and-forget malgre le commentaire. 3 visuels = +30-90s sur le batch. Non bloquant pour la livraison (le deliverable est deja insere), mais allonge le temps total du batch |
| Impact cout par batch | PASS | Max 3 visuels/semaine x ~0.04 USD = ~0.12 USD/semaine/client |

## 5. Coherence affichage (PostsFiltered)

| Point | Verdict | Detail |
|---|---|---|
| "Visuel genere" quand visual_key existe | PASS | L177-191 — affiche lien de telechargement |
| "Photo recommandee" sans visual_key | PASS | L194-196 — affiche le brief en texte |
| URL de telechargement correcte | **FAIL** | Pointe vers `/api/images/${visualKey}` qui rejecte le prefixe `visuals/` (voir bug #3) |

## 6. Coherence pack-mensuel

| Point | Verdict | Detail |
|---|---|---|
| brief_visuel stocke dans metadata | PASS | L99 — `brief_visuel: post.brief_visuel` dans metadata |
| Generation de visuels dans pack-mensuel | **ABSENT** | pack-mensuel ne genere PAS de visuels (pas d'import de `generatePostVisual`). 12 posts sans visuels. A prioriser si le pipeline weekly-batch en genere |

## 7. Modele OpenAI

| Point | Verdict | Detail |
|---|---|---|
| Modele reference | **WARN** | `gpt-image-1.5` (L7 openai.ts) — verifier que ce modele existe. La doc OpenAI connue reference `gpt-image-1` et `dall-e-3`. Si le modele n'existe pas, toutes les generations echouent silencieusement (retourne null) |

---

## Score global : 5 PASS / 2 FAIL / 2 WARN / 1 ABSENT

### Bugs a corriger (signales a @fullstack)

**BUG-1 (BLOQUANT)** — `src/app/api/images/[key]/route.ts` L18 : ajouter `"visuals/"` dans `ALLOWED_PREFIXES`. Sans ce fix, aucun visuel genere n'est accessible. Sophie voit "Voir et telecharger le visuel" mais le lien retourne une erreur 400.

**BUG-2 (MINEUR)** — `src/lib/openai.ts` L7 : verifier le nom du modele `gpt-image-1.5`. Si invalide, remplacer par `gpt-image-1`.

**BUG-3 (AMELIORATION)** — `src/app/api/generate/pack-mensuel/route.ts` : pas de generation de visuels pour les 12 posts du pack mensuel. Ajouter la meme logique que weekly-batch pour la parite fonctionnelle.

---

**Handoff → @fullstack**
- Fichier produit : `docs/qa/audit-visual-pipeline.md`
- Action requise : corriger BUG-1 (1 ligne, ALLOWED_PREFIXES), verifier BUG-2 (nom modele), evaluer BUG-3 (parite pack-mensuel)
- Point d'attention : BUG-1 rend 100% des visuels generes inaccessibles — priorite maximale
