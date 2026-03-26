# Plan d'audit — Design & UX du site web ImmoCrew

## Sujet
Audit complet du design et de l'experience utilisateur du site web : parcours client, design system, responsive, accessibilite, coherence visuelle, frictions mobiles.

## Contexte
- **Persona** : Sophie, mandataire IAD, 38 ans, iPhone, zero competences digitales
- **Stade** : Code termine, pre-lancement
- **Modele** : B2B (Sophie paie) + B2B2C (les livrables servent les clients de Sophie)

## Agents selectionnes

| Agent | Perimetre | Justification |
|-------|-----------|---------------|
| @ux | Parcours complet (landing → checkout → onboarding → dashboard), frictions mobiles, accessibilite, temps de completion | Sophie navigue sur iPhone entre deux visites — chaque friction = abandon |
| @design | Design system conformite, tokens, responsive, WCAG AA, coherence visuelle inter-pages | Sophie juge la credibilite du service sur son apparence en 3 secondes |
| @mandataire | Test terrain : Sophie parcourt le site et reagit comme une mandataire IAD reelle | Filtre de realite — un audit technique ne detecte pas les frictions emotionnelles |

## Criteres d'evaluation (echelle 1-5, seuil 4.5/5)

1. **Parcours landing** : le flow hero → pricing → checkout est-il fluide et sans friction ?
2. **Onboarding** : les 10 etapes sont-elles completables en < 10 min sur mobile ?
3. **Dashboard** : Sophie trouve-t-elle et utilise-t-elle ses livrables facilement ?
4. **Responsive** : le site fonctionne-t-il parfaitement sur iPhone 13 (375px) ?
5. **Accessibilite** : WCAG AA respecte (contrastes, focus, aria, navigation clavier) ?
6. **Design system** : tokens appliques partout, coherence typographique et chromatique ?
7. **Confiance** : le design inspire-t-il confiance a Sophie (pas cheap, pas trop corporate) ?

## Batches d'execution
- Batch 1 : @ux + @design (parcours + visuel)
- Batch 2 : @mandataire (test terrain)
- Batch 3 : @reviewer (validation croisee)
