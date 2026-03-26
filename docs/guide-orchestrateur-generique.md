# Guide Orchestrateur — Methode de travail Gradient Agents

> Ce document decrit comment faire travailler l'equipe Gradient Agents pour obtenir des livrables de qualite 9+/10. Il est generique et applicable a tout projet.
> Auteur : fondateur, base sur 4 sessions de production reelle.

---

## Principe fondamental

**Ne jamais livrer sans tester. Ne jamais tester sans generer de vrais outputs. Ne jamais corriger sans auditer depuis le point de vue du client final.**

---

## La boucle de qualite — a appliquer systematiquement

```
1. CONSTRUIRE  →  2. GENERER DE VRAIS OUTPUTS  →  3. AUDITER  →  4. CORRIGER  →  5. RE-GENERER  →  6. RE-AUDITER
      ↑                                                                                                    ↓
      ←←←←←←←←←←←←←←←←←←←←←←←←←←←←  si score < 9/10  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### Etape 1 — Construire
- @ia redige les prompts, @fullstack code l'infrastructure
- Lancer les deux en parallele quand ils sont independants
- Ne jamais valider un prompt en lisant le code — un prompt ne vaut que par son output

### Etape 2 — Generer de VRAIS outputs
- Creer un profil client realiste et complet (pas un profil minimal)
- Extraire les prompts en JSON via un script TypeScript
- Appeler l'API Claude avec ce profil et sauvegarder les outputs bruts
- Chaque output doit etre un vrai livrable que le client recevrait

### Etape 3 — Auditer avec DEUX perspectives

**Perspective 1 — Le client qui paie (persona principal)**

Utiliser l'agent `@mandataire` ou un agent testeur metier avec le persona du client. Grille de notation sur 10 :

| Critere | Ce qu'on evalue |
|---------|-----------------|
| Utilite | Le client va-t-il vraiment utiliser ce livrable au quotidien ? |
| Professionnalisme | Ca fait serieux aupres de ses pairs et partenaires ? |
| Fierte | Le client est-il fier de diffuser ca sous son nom ? |
| Rapport qualite/prix | Le client en a-t-il pour son argent ? |
| Efficacite commerciale | Ca va generer des resultats concrets (leads, ventes, contacts) ? |
| Personnalisation | C'est clairement fait pour CE client, pas generique ? |
| Authenticite | Ca sonne comme le client, pas comme un robot ? |

**Perspective 2 — Le client DU client (prospect final)**

Utiliser `@reviewer` avec un persona prospect. Grille simplifiee :

| Critere | Ce qu'on evalue |
|---------|-----------------|
| C'est pro ? | Premiere impression en 3 secondes |
| Envie de contacter ? | Apres lecture complete, est-ce que j'agis ? |
| Mieux qu'ailleurs ? | Compare avec la concurrence reelle du secteur |
| Confiance ? | Ca sonne vrai ou ca sent le marketing automatise ? |

**Lancer les deux audits en parallele** pour gagner du temps.

### Etape 4 — Corriger
- Lister les erreurs factuelles (chiffres inventes, lieux inexistants, dates obsoletes)
- Lister les problemes recurrents (meme defaut dans plusieurs outputs)
- @ia corrige les prompts en fonction des erreurs identifiees
- Les corrections doivent etre retrocompatibles (champs optionnels)

### Etape 5-6 — Re-generer et re-auditer
- Re-generer les outputs avec les prompts corriges
- Re-lancer les deux audits
- Comparer les scores v1 vs v2
- Objectif : 9/10 minimum sur les deux perspectives

---

## Les 6 regles d'or

### 1. L'onboarding est la fondation de la qualite

La qualite des outputs IA depend a 80% de la qualite des donnees d'entree. Investir dans un onboarding riche et structure :

- **Champs obligatoires** : tout ce sans quoi le livrable sera generique (identite, zone, style, donnees locales)
- **Champs facultatifs** : tout ce qui ameliore la qualite mais dont le livrable peut se passer (histoire perso, preferences visuelles)
- **Champs recurrents** : tout ce qui change chaque mois et ne peut pas etre capture une seule fois (nouveaux produits/biens, anecdotes, tendances)
- **Demander a Sophie** comment elle prefere mettre a jour ces infos (format, duree, frequence). Ne pas deviner — demander.

### 2. Anti-hallucination = priorite absolue

Le bloc suivant doit etre dans CHAQUE prompt :

```
## Regles anti-erreur absolues
- NE JAMAIS inventer de noms, lieux, commerces, ecoles qui ne sont pas dans les donnees fournies.
- NE JAMAIS inventer de chiffres, statistiques, ou annees d'experience.
- L'annee courante est [ANNEE]. Ne jamais mentionner une annee anterieure comme courante.
- Si les donnees detaillees ne sont pas disponibles, rester general. NE PAS inventer de details.
```

Quand c'est possible, remplacer la saisie manuelle par un enrichissement automatique (APIs publiques, bases de donnees ouvertes).

### 3. Tester les vrais outputs, pas les prompts

Lire un prompt et se dire "ca a l'air bien" ne vaut RIEN. Les erreurs n'apparaissent que dans les outputs reels :
- Hallucinations (lieux inventes, chiffres faux)
- Incoherences entre livrables (arret de metro different dans 2 outputs)
- Placeholders non remplaces (numeros de telephone factices)
- Erreurs reglementaires (mentions legales manquantes)

### 4. Toujours deux perspectives d'audit

Un livrable qui plait au client mais pas au prospect final est inutile. Un livrable qui impressionne le prospect mais que le client ne publierait jamais est aussi inutile. Les deux perspectives doivent atteindre 9/10.

### 5. Formulaire mensuel = retention

Pour les produits de contenu recurrent, le client doit pouvoir mettre a jour ses infos chaque mois. Regles :
- 10 champs maximum
- 10 minutes maximum
- Mobile-first
- 2 rappels maximum par mois
- Si pas de reponse : generer avec les donnees du mois precedent + signaler ce qui sera moins personnalise
- Montrer au client CE QUI A CHANGE dans ses livrables grace a ses infos

### 6. Paralleliser tout ce qui est independant

- @ia et @fullstack en parallele (prompts et infrastructure sont independants)
- Sophie et Marc en parallele (deux perspectives independantes)
- Corrections prompts et corrections code en parallele
- Ne sequencer que quand il y a une dependance de livrable documentee

---

## Pattern de lancement de projet

### Phase 0 — Fondations (sequentiel)
@creative-strategy → @product-manager → @data-analyst (chacun depend du precedent)
@legal en parallele de @creative-strategy

### Phase 1 — Experience utilisateur (sequentiel partiel)
@ux → @design + @copywriter en parallele (design et copy sont independants une fois les wireframes faits)

### Phase 2 — Developpement (sequentiel)
@infrastructure → @fullstack → @qa

### Phase 3+ — Contenu, acquisition, IA (parallelisable)
@seo + @geo en parallele
@growth + @social en parallele
@ia prompts en parallele de @fullstack code

### Revue finale
@reviewer (revue croisee) + @mandataire (audit metier) en parallele
Puis boucle de correction si score < 9/10

---

## Checklist avant de considerer un livrable comme "termine"

- [ ] Vrais outputs generes avec un profil client realiste
- [ ] Audit perspective client (persona principal) >= 9/10
- [ ] Audit perspective prospect (client du client) >= 9/10
- [ ] Zero hallucination (tous les noms, chiffres, lieux sont verifies)
- [ ] Zero placeholder (coordonnees reelles, dates correctes)
- [ ] Coherence inter-livrables (memes references dans tous les outputs)
- [ ] Donnees reglementaires presentes (selon le secteur)
- [ ] Mode d'emploi inclus si le livrable necessite une action technique du client

---

## Anti-patterns a eviter

| Anti-pattern | Pourquoi c'est un probleme | Que faire a la place |
|---|---|---|
| Valider un prompt sans generer d'output | Les erreurs sont invisibles dans le code | Toujours generer et auditer le resultat |
| Auditer seulement du point de vue du client | Le prospect final peut avoir une perception differente | Toujours auditer avec les 2 perspectives |
| Accepter un score de 7-8/10 | Les erreurs a 7/10 sont celles qui font resilier | Iterer jusqu'a 9/10 minimum |
| Laisser des champs libres sans exemples | Le client ecrira des generalites → output generique | Guider avec des exemples concrets dans les placeholders |
| Saisie manuelle de donnees verifiables | Le client ne le fera pas, l'IA inventera | Enrichissement automatique via APIs publiques |
| Formulaire mensuel de 20 champs | Le client l'abandonnera au 2e mois | Maximum 10 champs, 10 minutes |
| Livrer sans mode d'emploi | Le client ne sait pas quoi faire du fichier | 3 etapes concretes pour utiliser chaque livrable |

---

## Comment utiliser ce document

1. **Avant chaque projet** : relire les 6 regles d'or
2. **Apres chaque phase de production** : appliquer la boucle de qualite
3. **Avant de considerer un projet comme termine** : passer la checklist
4. **En cas de doute** : demander au client (pas deviner)

Ce document doit etre mis a jour apres chaque projet avec les lecons apprises. Les erreurs qui reviennent deviennent des regles. Les patterns qui marchent deviennent des standards.

---

*Gradient Agents — Guide orchestrateur generique v1.0*
*Mis a jour : 2026-03-26*
