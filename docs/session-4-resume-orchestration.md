# Resume Session 4 — Comment le fondateur a fait travailler l'equipe Gradient Agents

> Pour un orchestrateur qui reprend le projet en autonomie.
> Date : 2026-03-26 | Projet : ImmoCrew | Branche : claude/update-gradient-agents-l9MVz

---

## Methode de travail du fondateur — a reproduire en autonomie

### 1. Boucle "Construire → Tester avec Sophie → Corriger → Re-tester"

Le fondateur ne se contente JAMAIS d'un livrable sans le tester. La boucle est :

1. **@ia/@fullstack produisent** les livrables (prompts, code, routes)
2. **Generer de VRAIS outputs** avec la cle API et un profil client realiste (pas juste lire les prompts)
3. **@mandataire (Sophie) audite les vrais outputs** — pas les prompts, les RESULTATS. Grille : utilite, pro, fierte, rapport qualite/prix, efficacite commerciale + perspective client
4. **@reviewer (Marc, prospect) audite les memes outputs** — perspective acheteur/vendeur : "c'est pro ? ca me donne envie ? c'est mieux qu'ailleurs ? ca me donne confiance ?"
5. **Identifier les corrections** a partir des scores et des citations precises
6. **@ia corrige les prompts** en fonction des erreurs identifiees
7. **Re-generer et re-tester** jusqu'a atteindre 9/10

Cette boucle a fait passer les scores de Sophie 8.62→9.06 et Marc 7.7→9.1 en une seule iteration.

### 2. Double grille d'evaluation — Sophie ET Marc

Le fondateur insiste sur DEUX perspectives :

**Sophie (mandataire, la cliente qui paie)** — 10 criteres :
- Utilite, Professionnalisme, Fierte, Rapport qualite/prix, Efficacite commerciale
- Pro percu (client), Attractivite (client), Credibilite (client)
- Personnalisation, Authenticite

**Marc (prospect, le client de Sophie)** — 4 criteres :
- C'est pro ?
- Ca me donne envie de contacter Sophie ?
- C'est mieux que ce qui se fait ailleurs ?
- Ca me donne confiance ?

### 3. Tester AVANT de deployer — generer les vrais outputs

Le fondateur a fourni sa cle API Anthropic pour generer 10 vrais outputs avec le profil Sophie (Angers, La Doutre, IAD, 2 ans d'experience, 2 biens). La generation se fait via curl (le SDK Node.js timeout dans l'environnement Replit) :

```bash
# Extraire les prompts en JSON
npx tsx /tmp/extract-prompts-v2.ts

# Generer via curl
curl -s --max-time 120 https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @/tmp/sophie-prompts-v2/$name.json
```

### 4. Onboarding = fondation de la qualite

Le fondateur a identifie que la qualite des outputs depend directement de la qualite des donnees d'onboarding. L'onboarding est passe de 7 etapes (dont un textarea libre pour les biens) a 10 etapes structurees :

- Etapes 1-5 : identite, reseau, zone, specialite, style (OBLIGATOIRES)
- Etape 6 : quartier en detail — prix m2, commerces, ecoles, transports, ambiance (OBLIGATOIRE)
- Etape 7 : histoire perso (FACULTATIF)
- Etape 8 : biens structures avec 7 champs par bien (FACULTATIF)
- Etape 9 : confort camera (FACULTATIF)
- Etape 10 : reseaux sociaux (FACULTATIF)

### 5. Anti-hallucination = regle n°1

Les erreurs les plus graves identifiees par les audits etaient des INVENTIONS de l'IA :
- "5 ans de transactions" au lieu de 2
- Boulangerie "Daveau" inexistante dans La Doutre
- "DPE : non communique" (illegale depuis 2021)
- Place Louis Imbach (centre-ville) au lieu de place de la Laiterie (La Doutre)

Le bloc anti-hallucination ajoute dans chaque prompt resout ca. L'enrichissement auto via API gouv + DVF fournit des donnees verifiees au lieu de laisser l'IA inventer.

### 6. Paralleliser les audits

Le fondateur lance Sophie ET Marc en parallele pour gagner du temps. Les deux audits informent des corrections differentes (Sophie = utilisabilite metier, Marc = confiance prospect).

---

## Decisions d'architecture cles a comprendre

| Decision | Pourquoi | Alternative ecartee |
|----------|----------|---------------------|
| claude-sonnet-4-6 pour la generation de contenu | Cout 5x inferieur a Opus, qualite suffisante (validee 9/10) | Opus — trop cher pour 30 clients x 24 livrables/mois |
| Appels Claude sequentiels (pas paralleles) | Eviter le rate limiting API Anthropic | Parallel — risque de 429 en production |
| Enrichissement auto API gouv + DVF | Donnees locales verifiees au lieu d'inventees par l'IA | Saisie manuelle — Sophie ne le fera pas |
| Onboarding 10 etapes au lieu de 7 | Les prompts ont besoin de donnees locales, histoire, confort camera | 7 etapes — livrables generiques |
| Formulaire mensuel 10 champs, 10 min | Sophie dit "10 min max sinon j'arrete" | Email/WhatsApp — Sophie ne repond pas |
| Types DB bio/brief/calendrier/positionnement | Dashboard affichait tout comme "Post" | Un seul type "post" — confusion UX |
| Variation prix/m2 dans les prompts | Marc notait le meme chiffre dans 8 outputs | Aucune variation — perception robotique |

---

## Ce qui est en production-ready

- Pipeline IA complet : 10 prompts → 3 routes generate → dashboard
- Onboarding 10 etapes → persistance client_context JSONB
- Formulaire mensuel avec bandeau dashboard (seuil 25 jours)
- Enrichissement auto (API Adresse gouv + DVF)
- Pages legales VERSI completes (SIRET, adresse, TVA)
- Favicon SVG
- Portal Stripe
- Trigger production admin

## Ce qui reste a faire (post-production)

1. Tests E2E Playwright (reportes depuis Phase 2)
2. Integration visuels Versiroom (home staging IA)
3. Templates contenu social (timeout Phase 4)
4. Guide d'utilisation pour Sophie (newsletter via Brevo, landing via Carrd)
5. Livrable Google Business Profile (demande par Sophie dans l'audit)

---

*Ce document est destine a un orchestrateur IA qui reprend le projet. Il decrit comment le fondateur fait travailler l'equipe pour que l'orchestrateur puisse reproduire la boucle en autonomie.*
