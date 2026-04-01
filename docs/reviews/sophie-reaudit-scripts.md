## Revue métier — Re-audit scripts vidéo post-correction
> Par @mandataire (Sophie) | 2026-04-01

### Verdict global
**GO — Score 9/10**

### Les 5 points vérifiés

| Point | Statut | Détail |
|-------|--------|--------|
| `pack-mensuel/route.ts` ~l.157 : `type_video` basé sur `confort_camera` | CORRIGE | `(ctx.confort_camera === "a_laise" \|\| ctx.confort_camera === "expert") ? "face_camera" : "diaporama"` — débutant → diaporama, c'est exactement ce qu'il faut |
| `pack-lancement/route.ts` ~l.223 : idem | CORRIGE | Même logique, même condition. Cohérent avec pack-mensuel |
| `weekly-batch/route.ts` l.151 : idem | CORRIGE | Identique. Les 3 routes sont alignées |
| `script-video.ts` : mention CapCut supprimée | CORRIGE | Aucune occurrence trouvée — CapCut est bien effacé |
| `ScriptsFiltered.tsx` : conseil tournage, brief, durée visibles | CORRIGE | Bloc conseil en haut de page (tip adapté au niveau débutant/confirmé), `briefTournage` affiché sous chaque script avec "Où filmer :", `duree` dans le label, `hook` visible |

### Ce qui me plaît
- Le conseil tournage en haut de la page est pile poil pour moi : "Tu n'as pas besoin de te filmer !" — c'est la première chose que je voulais lire
- La logique débutant = diaporama est appliquée aux 3 routes sans exception. Pas de cas oublié
- Le "Où filmer" sous chaque script, c'est concret — je sais exactement ce que je dois faire

### Ce qui me gêne (résiduel mineur)
- Le conseil général dit "Pas de montage nécessaire — filme et publie directement" : c'est vrai pour les débutants, mais un peu trompeur pour les scripts diaporama qui demandent quand même d'assembler les photos. Pas bloquant, mais ça peut surprendre
- Le conseil "Comment filmer" est affiché même si tous mes scripts sont des diaporamas (type débutant). Parler de "filme" quand c'est des diapos, c'est un léger décalage

### Ma réaction honnête
Le P0 est corrigé partout, proprement, avec cohérence entre les 3 routes. À 21h après mes visites, j'ouvre mon dashboard, je vois "Tu n'as pas besoin de te filmer", j'ai un brief tournage sous chaque script, une durée, une accroche. C'est utilisable. Je ne me retrouve plus avec un script "face caméra" alors que j'ai la trouille de me filmer. Le point mineur sur le conseil "filme" vs "diaporama" mériterait une passe, mais ça ne bloque rien.

---

**Handoff → @fullstack**
- Verdict : GO
- Correction optionnelle : adapter le conseil tournage selon le `confort_camera` du client (afficher la bonne ligne du `CONFORT_TIPS` plutôt que la liste générique)
