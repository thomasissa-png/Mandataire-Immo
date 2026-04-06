# Re-audit Marc — Session 10 post-corrections
> Par @mandataire (Sophie jouant Marc Lefebvre, 42 ans, prospect vendeur Angers) | 2026-03-31
> Score précédent : 7/10 GO CONDITIONNEL

## Score global : 8.5/10 — GO CONDITIONNEL

---

## Vérification corrections contenu

| # | Correction | Vérifié | Score | Impact Marc |
|---|---|---|---|---|
| C1 | Photos annonce — `getAnnoncePhotos()` + galerie | OUI — fonction présente L51-81, galerie L205-230 | 9/10 | Fort : je vois enfin les photos du bien avant de contacter. Grille 2-3 colonnes, première photo grande = impression pro. C'est ce que j'attends quand on me partage une annonce. |
| C2 | Stats hero mandataire (experience + transactions) | OUI — L100-118, conditionnel, gros chiffres orange, séparateur vertical | 9/10 | Très bien : "8 ans d'expérience · 15 transactions/an" en orange, ça me rassure immédiatement. Je veux vendre ma maison à quelqu'un qui a fait ses preuves, pas à un débutant. |

---

## Vérification corrections visuelles

| # | Correction | Vérifié | Score | Impact visuel |
|---|---|---|---|---|
| V1 | Tokens annonce — bg-primary, text-secondary, bg-background | OUI — L154, L158, L183, L193 utilisent les tokens corrects | 9/10 | Cohérence garantie. Rien de cassé sur la page annonce côté couleurs. |
| V2 | Breakpoints `tablet:` sur page annonce | OUI — L161 `tablet:text-h1`, L207 `tablet:grid-cols-3`, L211 `tablet:min-h-[360px]` | 9/10 | La galerie passe bien à 3 colonnes sur tablette. La photo principale tient bien. |
| V3 | Overlap boutons/contenu fix (`mt-6 mb-2` L178) | OUI — vérifiée L178 : `mt-6 mb-2` | 8/10 | Espacement propre entre les boutons contact et la galerie. |
| V4 | `text-muted-foreground` → `text-neutral-500` | OUI — AgentPageSections.tsx L176, L187, L196... token remplacé | 9/10 | Rendu cohérent, plus de classes inconnues du système. |
| V5 | Hero 2 colonnes dès tablette (`tablet:flex`) | OUI — Hero.tsx L7 : `tablet:flex tablet:items-center` | 9/10 | Sur iPad/768px, le texte et le mockup sont côte à côte. C'est lisible, pas empilé. |
| V6 | Blog 3 colonnes desktop (`desktop:grid-cols-3`) | OUI — BlogGrid.tsx L69 : `desktop:grid-cols-3` | 8/10 | La grille gagne en densité sur grand écran. 3 articles visibles d'un coup = je browse plus facilement. |

---

## Audit responsive post-corrections

| Page | Mobile 375px | Tablette 768px | Desktop 1280px | Score |
|---|---|---|---|---|
| Annonce `/annonce/[token]` | Header plein-large, galerie 2 colonnes, boutons empilés. Lisible. | Galerie 3 colonnes + photo grande à gauche. Breakpoints `tablet:` OK. | Max-w-3xl centré, spacieux. Rien de cassé. | 8.5/10 |
| Mandataire `/agent/[slug]` | Hero centré, stats empilées (pas de séparateur horizontal superflu). Photo ronde bien cadrée. | `tablet:flex` active les CTA côte à côte. Stats orange visibles. | Section Qui-suis-je max-w-3xl, biens en grille. Dense mais pas chargé. | 8/10 |
| Landing `/` | Hero empilé (texte puis mockup). CTA lisibles. Texte un peu long sur petit écran. | 2 colonnes avec `tablet:flex`. Mockup à droite. Équilibré. | Texte h1 large, mockup clair. Impression pro. | 8/10 |
| Blog `/blog` | 1 colonne, cards compactes avec thumbnail. Filtre visible. | 2 colonnes `tablet:grid-cols-2`. OK. | 3 colonnes `desktop:grid-cols-3`. Bon débit visuel. | 8/10 |

---

## P0 restants

**Un seul problème significatif détecté — pas bloquant mais à surveiller :**

**Annonce sans photos : état vide non signalé à Marc.**
La galerie ne s'affiche que si `photos.length > 0` (L205 : `{photos.length > 0 && ...}`). Si le bien n'a pas de photos dans `property_pages`, Marc voit directement le contenu texte sans aucune indication que c'est normal. Pas de message "Photos à venir" ni placeholder. Pour un prospect vendeur qui évalue le sérieux du mandataire, cette absence non expliquée peut inquiéter.

Correction suggérée : ajouter un bloc conditionnel `{photos.length === 0 && <p className="...">Photos du bien disponibles sur demande</p>}` entre les boutons contact et l'article.

**Pas d'autres P0 introduits par les corrections.**

---

## Verdict final : GO CONDITIONNEL

Les 6 corrections sont toutes effectives et correctement implémentées. Pas de régression introduite. Le passage de 7/10 à 8.5/10 est justifié.

Ce qui a le plus changé mon impression en tant que Marc :
1. Les photos — c'est la première chose que je regarde sur une annonce. Avant c'était vide, maintenant c'est là.
2. Les stats du mandataire — "8 ans, 15 transactions/an" en orange, ça crédibilise instantanément.

Ce qui empêche le GO franc : l'état vide photos non géré (décrit ci-dessus) + le hero landing reste un peu long sur mobile 375px (le copy est excellent mais dense). Rien de bloquant pour une mise en production.

**Handoff → @fullstack**
- Corriger l'état vide galerie photos (message "Photos à venir" ou placeholder)
- Optionnel : évaluer si le texte hero sur mobile 375px peut être légèrement raccourci (sous-titre)
- Si corrigé : GO sans réserve, re-soumission @mandataire non nécessaire
