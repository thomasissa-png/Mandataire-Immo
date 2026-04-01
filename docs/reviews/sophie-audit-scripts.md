## Revue métier — Scripts vidéo (ScriptsFiltered + prompt + formatScriptContent)
> Par @mandataire (Sophie) | 2026-04-01

### Verdict global
**À RETRAVAILLER** — Le fond est bon, il y a un vrai problème P0 bloquant côté route.ts, et deux points P1 qui cassent la promesse "filme et publie directement".

---

### Ce qui me plaît
- Le conseil "Tu n'as pas besoin de te filmer" dans CONFORT_TIPS est exactement ce dont j'ai besoin qu'on me dise. C'est rassurant, direct, ça change tout.
- Les 4 bullets du bloc tournage (portrait, lumière, pas de montage, vendredi 19h-21h) : limpide, je comprends en 10 secondes.
- Le brief tournage sous chaque script avec l'icône 📍 — je sais où aller avant même d'ouvrir le script complet.
- L'accroche visible sous le titre : je peux décider en 3 secondes si ce script m'intéresse.
- La structure scène par scène dans formatScriptContent — "Scène 1 — 5s / Comment filmer / Ce que tu dis" — c'est ce dont j'ai besoin sur mon téléphone entre deux visites.

### Ce qui me gêne

**P0 — Contradiction fatale : le prompt ignore le niveau débutant**
Dans `route.ts` ligne 156, le pack mensuel appelle `buildScriptVideoPrompt` avec `type_video: "face_camera"` en dur — alors que le prompt a été conçu pour ignorer face_camera quand confort = débutant et passer en diaporama automatiquement. Résultat : la logique conditionnelle `diaporamaInstructions` (ligne 92 du prompt) ne s'active jamais pour le pack mensuel. Sophie reçoit des scripts face caméra même si elle est débutante. C'est le problème le plus grave — ça casse la promesse de la page.

**P1 — CapCut recommandé dans le prompt mais absent de l'UI**
Le prompt mentionne "Suggérer l'appli de montage : CapCut ou InShot" dans les instructions diaporama. Mais si le script généré contient cette mention et que l'UI ne la reprend nulle part, Sophie se retrouve avec une instruction qu'elle ne comprend pas (elle ne monte rien, elle publie directement). Soit on vire cette mention du prompt, soit on l'affiche clairement dans l'UI avec une explication.

**P1 — Les champs `hook` et `brief_tournage` peuvent être nuls sans fallback visible**
Dans `ScriptsFiltered.tsx`, si `hook` ou `briefTournage` sont null (JSON mal formé, champ absent), le bloc sous le titre est vide. Sophie voit juste "Script vidéo · ~30s" sans accroche ni lieu. Elle n'a aucune info pour décider si ce script lui convient. Il faut un fallback texte ("Accroche non générée — ouvre le script pour le détail").

**P2 — CONFORT_TIPS affiché mais pas personnalisé**
Le bloc conseil en haut de page est identique pour tous les mandataires. Le message "Tu n'as pas besoin de te filmer !" ne s'affiche que pour les débutants selon le code — mais je ne vois pas de logique qui lit `confort_camera` du profil client pour sélectionner le bon message. Si c'est le cas, il faut vérifier que la prop est bien passée depuis la page parente. Sinon tout le monde voit le conseil débutant.

### Ce qui me manque
- Un lien ou un bouton "Publier sur Instagram" ou même juste le rappel "Ouvre Instagram Reels, appuie sur +" à la fin du script — le workflow s'arrête à "publie directement" sans dire comment.
- Sur mobile, les titres "Scène 1 — 5s / 📱 Comment filmer / 📝 Texte à l'écran" : est-ce que le markdown est bien rendu dans le composant d'affichage du contenu ? Si le `content` est du markdown brut et affiché tel quel, Sophie voit des `##` et des `**` au lieu d'un texte mis en forme.

---

### Détail par section

| Section | Clarté | Utilité | Faisabilité | Ton | Verdict |
|---------|--------|---------|-------------|-----|---------|
| Conseil global tournage | Limpide | Ça m'aide vraiment | Facile à intégrer | On se comprend | Garder |
| Accroche + brief sous chaque script | Limpide | Ça m'aide vraiment | Facile à intégrer | On se comprend | Garder (avec fallback) |
| Prompt débutant / diaporama | Limpide (côté code) | Bof (jamais activé) | Impossible — bug P0 | — | Corriger urgent |
| Format scène par scène | Limpide | Ça m'aide vraiment | Facile à intégrer | On se comprend | Garder si markdown rendu |
| Mention CapCut dans prompt | Flou | Bof | Impossible | — | Virer ou expliquer |

---

### Ma réaction honnête
Je lis la page : le conseil du haut me rassure, je me dis "OK, j'ai pas besoin de me filmer, c'est pour moi." Je clique sur un script, je lis la scène 1 — c'est concret, c'est court, j'y crois presque. Et là je vois "Face caméra — plan de la façade". Attends. On m'avait dit que je n'avais pas besoin de me filmer ? Pourquoi le script me demande de parler face caméra ? Je referme et je ne l'utilise pas. C'est exactement le scénario P0.

Si ce bug est corrigé et que je reçois un vrai script diaporama ("Photo 1 : façade depuis le trottoir, 3 secondes, texte : 'Ce pavillon à 30min d'Angers...'"), là je peux le faire seule un samedi matin avant les visites. La promesse est là, le produit n'est pas encore à la hauteur.

---

**Handoff → @fullstack**
- Fichier produit : `/docs/reviews/sophie-audit-scripts.md`
- P0 à corriger en priorité : `src/app/api/generate/pack-mensuel/route.ts` ligne 156 — remplacer `type_video: "face_camera"` par `type_video: ctx.confort_camera === "debutant" ? "diaporama" : "mix"` (ou lire `ctx.type_video` si le champ existe dans le profil client)
- P1 : ajouter un fallback dans `ScriptsFiltered.tsx` quand `hook` et `briefTournage` sont null
- P1 : vérifier que `confort_camera` est bien passé en prop à `ScriptsFiltered` pour sélectionner le bon CONFORT_TIPS
- P2 : vérifier que le `content` markdown est bien rendu (composant `DeliverableCard` ou modal d'expansion) — si c'est du texte brut, les `##` et `**` s'affichent tels quels
- Verdict : À RETRAVAILLER — resoumettre après correction P0+P1
