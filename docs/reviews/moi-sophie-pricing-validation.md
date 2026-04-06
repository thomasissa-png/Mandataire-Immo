# Double audit pricing — ImmoCrew
> @moi (Thomas) + @mandataire (Sophie) | 2026-04-02
> Sources lues : `src/lib/pricing.ts`, `src/components/landing/Pricing.tsx`, `src/app/page.tsx`, `src/app/cgv/page.tsx`, `src/components/landing/FAQ.tsx`, `docs/strategy/pricing-restructure.md`

---

## Audit Thomas (fondateur)

| Vérification | Résultat | Détail |
|---|---|---|
| 1. Packs corrects en DB (150/360/1200/100) | PASS | `pricing.ts` : stripeCents 15000/36000/120000/10000. `price` affiché : 120€/mois trimestriel (équivalent), 100€/mois annuel (équivalent) — conforme pricing-restructure.md |
| 2. Pricing.tsx : 3 cartes, trimestriel featured, badge "Recommandé" | PASS | `ABONNEMENT_PACKS` = [mensuel, trimestriel, annuel]. `featured: true` sur trimestriel. `badge: "Recommandé"` présent |
| 3. page.tsx metadata "À partir de 100€/mois" | PASS | `formatStartingPrice()` → `PRIX_MIN_MENSUEL` = `PACK_ANNUEL.price` = 100. Metadata dynamique, correct |
| 4. CGV articles 4/5/6/8/10 — 3 formules à jour | PASS | Art. 4 : 3 formules + Boost listés avec prix corrects (imports `pricing.ts`). Art. 5 : prélèvements 360€/3 mois, 1200€/12 mois. Art. 6 : délais setup + boost. Art. 8 : garantie 14j toutes formules. Art. 10 : résiliation mensuel/trimestriel+annuel/boost différenciée |
| 5. FAQ "Quelle formule choisir ?" présente | PASS | Question présente en position 5. Répond mensuel/trimestriel/annuel avec prix et économies |
| 6. Zéro mention "Pack Lancement" / "400€" dans code client-facing | **FAIL** | `src/lib/email-templates.ts` : 4 occurrences "Pack Lancement" dans les emails J+2 et J+14 (visibles clients). `src/lib/prompts/*.ts` : 7 fichiers de prompts avec "Pack Lancement" dans les commentaires (non client-facing mais à nettoyer). Route `/api/generate/pack-lancement/route.ts` toujours active |
| 7. Prix ronds, zéro charm pricing | PASS | 150/360/1200/100 — aucun .99, aucun .95. Conforme directive pricing-restructure.md |

**Verdict Thomas : 6/7 PASS. Blocage sur les emails nurturing J+2 et J+14 — "Pack Lancement" visible par les clients.**

---

## Audit Sophie (mandataire)

| Vérification | Résultat | Détail |
|---|---|---|
| 1. Les 3 formules lisibles en 10 secondes | PASS | Le guidage décisionnel ("Sans engagement ? → Mensuel. Meilleur rapport qualité-prix ? → Trimestriel. Tarif le plus bas ? → Annuel.") est direct. Je comprends vite |
| 2. Trimestriel mis en avant, envie de le choisir | PASS | Carte centrale agrandie (`scale-[1.03]`), fond sombre, badge orange "Recommandé" — l'œil va directement dessus |
| 3. Économie claire (90€ / 4 mois offerts) | PASS partiel | "Économise 20%" sur le trimestriel — mais 90€ économisés n'est PAS affiché sur la carte. C'est dans la FAQ seulement. Pour l'annuel, "4 mois offerts" EST visible sur la carte (`highlight`). Cohérence incomplète |
| 4. Setup mois 1 mentionné dans chaque formule | PASS | Première feature de `ABONNEMENT_FEATURES` : "Setup mois 1 inclus : positionnement, bio, charte visuelle" — commun aux 3 cartes |
| 5. Boost Mandat visible mais secondaire | PASS | Bloc séparé sous les 3 cartes, pas de badge, CTA `variant="secondary"`, libellé "Réservé aux abonnés" — clairement positionné en upsell |
| 6. Mobile : 3 cartes lisibles | PASS probable | `grid tablet:grid-cols-3 items-stretch` — en mobile les cartes s'empilent en colonne unique. L'ordre mensuel → trimestriel → annuel est conservé. Pas de screenshot disponible mais structure CSS correcte |

**Verdict Sophie : 5/6 PASS + 1 PASS partiel. L'économie du trimestriel ("90€ économisés") n'est pas affichée sur la carte — seulement le pourcentage. Le pourcentage, c'est abstrait. 90€, ça parle.**

---

## Verdict consolidé

**À RETRAVAILLER — 1 FAIL bloquant + 1 point d'amélioration**

### FAIL bloquant (Thomas)
`src/lib/email-templates.ts` : les emails automatiques J+2 et J+14 envoient aux clients un message avec "Ton Pack Lancement est prêt" — une offre supprimée. Un client qui reçoit ça est perdu. Corriger avant tout déploiement email.

### Amélioration (Sophie)
Carte trimestrielle : remplacer ou compléter "Économise 20%" par "Économise 90€ sur 3 mois". Le montant concret déclenche mieux que le pourcentage. Modèle annuel : cohérent — "4 mois offerts" fonctionne.

### Ce qui est solide
- Source unique de vérité `pricing.ts` — zéro hardcodage parasite dans le reste du code
- CGV entièrement dynamique via imports `pricing.ts` — aucun risque de désynchronisation
- FAQ "Quelle formule choisir ?" : réponse claire, tutoiement, chiffres concrets
- Boost Mandat correctement isolé des abonnements

---

**Handoff → @fullstack**
- Corriger `src/lib/email-templates.ts` : remplacer "Pack Lancement" par "tes premiers contenus" ou "ton mois de démarrage" (2 occurrences dans les balises HTML + 2 dans les fallbacks texte)
- Vérifier `/api/generate/pack-lancement/route.ts` : renommer ou rediriger vers le workflow mois 1
- Optionnel (P1) : ajouter "90€ économisés sur 3 mois" sur la carte trimestrielle dans `Pricing.tsx`
