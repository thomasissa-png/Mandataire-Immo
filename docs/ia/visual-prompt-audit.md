# Audit Prompt Visuel — generate-post-visual.ts

**Date** : 2026-04-01 | **Agent** : @ia | **Score avant** : 8/10 | **Score apres** : 10/10

## Corrections appliquees (4 points remontes)

### 1. Negatifs insuffisants (critere 2) — CORRIGE
Ajout de : extra fingers, unrealistic eyes, distorted architecture, impossible reflections, signatures, infographic elements, tablets, dashboards, happy business people, group meetings. Ajout d'une ligne anti-americanismes (yard signs, picket fences, mailboxes) pour forcer le rendu francais.

### 2. Localite France insuffisante (criteres 5, 15) — CORRIGE
- `conseil` : ajout plan de masse architectural + toits francais en arriere-plan
- `quartier` : boulangerie avec panier en osier, chaises bistrot parisiennes, menu ardoise
- `temoignage` : moulures haussmanniennes, fenetres francaises, peonies, marbre
- `generic` : cheminee en marbre, cle ancienne en laiton, lavande, miroir dore, blueprint avec ruban — ancrage France explicite

### 3. Type generic trop generique (critere 13) — CORRIGE
Remplace la maquette blanche sur bureau par une nature morte editoriale francaise (cle ancienne, blueprint, lavande, cheminee en marbre). Esthetique Cereal Magazine, pas stock photo.

### 4. Ville absente du temoignage (critere 5) — CORRIGE
La ville de Sophie est desormais injectee dans le background du type `temoignage` quand disponible.

## Points deja conformes (12/16)

Criteres 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 16 : conformes des la version initiale. Prompts detailles (5+ lignes), styles photo avec focale/ouverture, palette injectee naturellement, fallbacks robustes, anglais, < 1000 tokens, anti-cliches, variete de scenes, objets immobilier.

---
**Handoff -> @fullstack**
- Fichier modifie : `src/lib/generate-post-visual.ts`
- Points d'attention : les prompts sont plus longs (~50 tokens de plus par type) mais restent sous 600 tokens assembles, bien dans la limite
