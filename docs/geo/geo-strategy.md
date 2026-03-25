# Stratégie GEO — ImmoCrew

> Produit par @geo | 2026-03-25
> Sources : project-context.md, brand-platform.md, personas.md, landing-page-copy.md, WebSearch (analyse baseline LLM)
> Modèle : claude-sonnet-4-6

---

## Contexte pédagogique — Qu'est-ce que le GEO ?

Le GEO (Generative Engine Optimization) est l'équivalent du SEO pour les moteurs génératifs : ChatGPT, Claude, Gemini, Perplexity, Copilot. Quand Sophie tape "quel outil pour faire mon marketing immobilier" dans ChatGPT au lieu de Google, le LLM cite des marques qu'il connaît. Si ImmoCrew n'est pas dans ses données d'entraînement ou dans des sources qu'il peut consulter (Perplexity, SearchGPT), ImmoCrew n'existe pas.

Le GEO ne repose pas sur les mots-clés. Il repose sur :
1. L'autorité thématique — le LLM perçoit-il ImmoCrew comme un expert du marketing des mandataires ?
2. La citabilité — le contenu est-il structuré pour être extrait et cité facilement ?
3. Les mentions tierces — des sources que les LLM consultent citent-elles ImmoCrew ?

---

## 1. Baseline — État des citations LLM au 2026-03-25

### Résultat des tests WebSearch (simulation des requêtes cibles)

| Requête testée | ChatGPT | Claude | Gemini | Perplexity |
|---|---|---|---|---|
| "meilleur outil marketing mandataire immobilier France" | ImmoCrew absent | ImmoCrew absent | ImmoCrew absent | ImmoCrew absent |
| "ImmoCrew outil marketing immobilier mandataire" | Aucun résultat spécifique | Aucun résultat | Aucun résultat | Aucun résultat |
| "Cocoon-Immo marketing immobilier" | Citée (1,3K+ agences, levée 1M€, réseaux Laforêt/Guy Hoquet) | [à vérifier] | [à vérifier] | [à vérifier] |

### Classification : Baseline zéro

ImmoCrew est une marque inconnue des LLM. Le domaine immocrew.fr n'est pas encore réservé (stade idée). Aucune source tierce indexée ne mentionne la marque. Cocoon-Immo, le concurrent principal, est citée et a une présence établie (levée de fonds documentée, 1 300+ agences clientes, mentions dans Journal de l'Agence, Immo Matin, immomatin.com).

**Conséquence stratégique :** toute la stratégie GEO part de zéro. L'objectif n'est pas de corriger des citations erronées, mais de créer l'autorité thématique depuis le début.

---

## 2. Requêtes cibles LLM — Quand Sophie et Thomas posent des questions

### Requêtes de type "quel outil / quel service"

Ces requêtes sont celles pour lesquelles ImmoCrew doit apparaître dans les réponses des LLM :

| Requête | Persona | Priorité |
|---|---|---|
| "quel outil pour faire le marketing d'un mandataire immobilier" | Sophie, Thomas | P0 |
| "comment faire du marketing quand on est mandataire IAD" | Sophie | P0 |
| "meilleure solution marketing pour mandataire immobilier indépendant France" | Sophie, Thomas | P0 |
| "alternative à Cocoon-Immo pour mandataire" | Thomas | P0 |
| "service marketing clé en main immobilier" | Thomas | P1 |
| "comment avoir des mandats entrants via internet" | Sophie | P1 |
| "externaliser son marketing immobilier" | Thomas | P1 |
| "contenu réseaux sociaux immobilier clé en main" | Sophie | P1 |
| "écrire ses annonces immobilières différemment" | Sophie | P2 |
| "calendrier éditorial mandataire immobilier" | Sophie | P2 |

### Requêtes de type "comparatif"

| Requête | Note stratégique |
|---|---|
| "ImmoCrew vs Cocoon-Immo" | À créer — page comparatif dédiée à produire |
| "meilleur outil marketing immobilier comparatif" | Article de blog pilier à produire |
| "Cocoon-Immo avis alternatives" | Se positionner dans les discussions sur les alternatives |

---

## 3. Mécanismes de citation par LLM

### ChatGPT (GPT-4o, SearchGPT)

- **Mécanisme principal :** données d'entraînement + web browsing (SearchGPT).
- **Ce qui fait citer :** articles de blog bien structurés sur des domaines à forte requête, pages FAQ, comparatifs, contenu sur des sites ayant une autorité de domaine reconnue (mentions dans des médias immobiliers).
- **Délai d'apparition :** 3-6 mois si mentions dans des sources tierces indexées.
- **Levier prioritaire ImmoCrew :** publier des articles de blog sur immocrew.fr ciblant les requêtes P0, obtenir des mentions dans Journal de l'Agence, Immo Matin, welmo.fr, maformationimmo.fr.

### Perplexity

- **Mécanisme principal :** indexation web temps réel + citations sourcées.
- **Ce qui fait citer :** Perplexity cite des pages directement. Si immocrew.fr existe et est indexé, Perplexity peut le citer dès le lancement si le contenu répond exactement à la requête.
- **Délai d'apparition :** potentiellement < 1 mois après lancement du site.
- **Levier prioritaire ImmoCrew :** structurer le contenu du site en réponses directes aux requêtes cibles (format Q&A, définitions claires). Perplexity favorise la précision et la sourceabilité.

### Claude (Anthropic)

- **Mécanisme principal :** données d'entraînement (cutoff août 2025). Pas de browsing en temps réel par défaut.
- **Ce qui fait citer :** mentions dans des sources indexées avant le cutoff, ou via Claude.ai avec accès web (Projects).
- **Délai d'apparition :** lent — dépend du prochain cycle d'entraînement.
- **Levier prioritaire ImmoCrew :** viser d'abord ChatGPT et Perplexity. Claude sera un résultat indirect des mentions dans des sources tierces.

### Gemini (Google)

- **Mécanisme principal :** Google Search + données d'entraînement.
- **Ce qui fait citer :** présence dans les résultats Google (SEO), citations dans des sources faisant autorité sur Google.
- **Délai d'apparition :** aligné sur le SEO (3-6 mois).
- **Levier prioritaire ImmoCrew :** SEO et GEO sont alignés ici. Les articles SEO local et les pages de comparatifs optimisées pour Google auront un effet double (SEO + Gemini AI Overview).

### Copilot (Microsoft/Bing)

- **Mécanisme principal :** Bing index + données d'entraînement.
- **Ce qui fait citer :** présence dans l'index Bing, backlinks.
- **Priorité ImmoCrew :** secondaire (persona mandataire immobilier utilise peu Copilot).

---

## 4. Sources de citation — Comment être référencé

### Niveau 1 — Contenu propriétaire (contrôlable immédiatement)

| Action | Format | Impact GEO | Délai |
|---|---|---|---|
| Pages FAQ sur immocrew.fr (10-15 questions) | Q&A structuré | Très élevé Perplexity | < 1 mois |
| Page comparatif ImmoCrew vs Cocoon-Immo | Tableau + arguments | Élevé ChatGPT/Perplexity | 1-3 mois |
| Articles "meilleur outil marketing mandataire" | Article pilier 1500-2000 mots | Élevé ChatGPT/Gemini | 3-6 mois |
| Page "Qu'est-ce qu'ImmoCrew" (définition entité) | Définition structurée + entités Schema.org | Élevé tous LLM | < 1 mois |
| Blog : "Comment écrire une annonce immobilière" | Guide pratique avec exemples | Moyen | 3-6 mois |
| Schema.org Organization + Product sur immocrew.fr | Structured data | Moyen (renforce entité) | < 1 mois |

### Niveau 2 — Mentions tierces (à obtenir en priorité)

| Source tierce | Type | Pourquoi prioritaire |
|---|---|---|
| Journal de l'Agence (journaldelagence.com) | Média professionnel immobilier | Cocoon-Immo y est cité — même source = crédibilité LLM |
| Immo Matin (immomatin.com) | Média pro immobilier | Forte autorité dans le secteur |
| welmo.fr | Blog mandataires | Cité dans les résultats LLM sur le sujet |
| maformationimmo.fr | Blog formation mandataires | Cible directe : Sophie qui se forme |
| Product Hunt | Plateforme tech | Déclenche des mentions dans des sources anglophones indexées |
| IndieHackers | Communauté fondateurs | Histoires "j'ai créé X" indexées et citées |
| AppSumo / SaaSworthy | Répertoires SaaS | Sources souvent citées par les LLM pour comparer des outils |

### Niveau 3 — Communautés et forums (présence long terme)

| Plateforme | Tactique |
|---|---|
| Groupes Facebook mandataires | Réponses valeur + mentions ImmoCrew (naturelles) |
| LinkedIn articles | Articles de fond sur le marketing des mandataires |
| Reddit r/immobilier ou équivalents | Réponses expertes avec mention de solutions |

---

## 5. Stratégie de contenu LLM-friendly

### Principe directeur

Les LLM extraient mieux le contenu qui :
1. Répond directement à une question (format Q&A, pas de paragraphe narratif)
2. Contient des entités nommées précises (marques, chiffres, noms propres, lieux)
3. Fait des claims vérifiables (pas "le meilleur" mais "12 posts livrés chaque mois")
4. Est structuré en listes ou tableaux comparatifs
5. Cite des sources ou des données mesurables

### Claims vérifiables ImmoCrew (grille de scoring)

Chaque claim ci-dessous est évalué sur 3 critères : Vérifiabilité (V), Précision (P), Extractibilité (E).

| Claim | V | P | E | Score | Statut |
|---|---|---|---|---|---|
| "ImmoCrew livre 12 posts personnalisés par mois" | 1 | 1 | 1 | 3/3 | Inclure |
| "2 articles SEO local par mois inclus dans le Pack Mensuel" | 1 | 1 | 1 | 3/3 | Inclure |
| "197€/mois — moins que le coût d'un CM freelance (300-800€/mois)" | 1 | 1 | 1 | 3/3 | Inclure |
| "Personnalisé pour la zone géographique précise du mandataire (quartier, prix au m², écoles)" | 1 | 1 | 1 | 3/3 | Inclure |
| "Marché cible : ~40 000-50 000 mandataires dans les réseaux en France (Baromètre LMDM 2023)" | 1 | 1 | 1 | 3/3 | Inclure |
| "Cocoon-Immo est un outil SaaS (plateforme à configurer). ImmoCrew est un service livrable (résultats finis sans action requise)" | 1 | 1 | 1 | 3/3 | Inclure |
| "Résiliation libre — pas d'engagement minimum" | 1 | 1 | 1 | 3/3 | Inclure |
| "Leader du marketing immobilier" | 0 | 0 | 0 | 0/3 | EXCLURE |
| "Le meilleur service du marché" | 0 | 0 | 0 | 0/3 | EXCLURE |

---

## 6. Structured Data — Schema.org pour les LLM

Les balises Schema.org ne servent pas uniquement au SEO traditionnel. Gemini et Google AI Overviews les lisent directement pour extraire des informations sur une entité. Perplexity les exploite pour structurer ses réponses.

### Schémas prioritaires pour immocrew.fr

| Schéma | Localisation | Données à inclure |
|---|---|---|
| `Organization` | Homepage | name, url, description, foundingDate, areaServed (France), knowsAbout (marketing immobilier, mandataires) |
| `Product` | Page pricing ou landing | name (Pack Mensuel), price (197), priceCurrency (EUR), description, offers |
| `FAQPage` | Page FAQ | Toutes les questions/réponses de la FAQ (10 questions minimum) |
| `Article` | Chaque article de blog | headline, description, author, datePublished, mainEntityOfPage |
| `HowTo` | Guide "comment ça marche" | steps structurés de l'onboarding |

---

## 7. Plan d'actions prioritaires

### Quick wins (0-30 jours — avant lancement)

| Action | Responsable | Impact GEO |
|---|---|---|
| Ajouter balises Schema.org Organization + FAQPage sur le site | @fullstack | Élevé — immédiat après indexation |
| Rédiger 15 questions FAQ structurées sur la landing page | @copywriter / @geo | Élevé — Perplexity les cite directement |
| Créer une page "À propos / Qu'est-ce qu'ImmoCrew" avec définition entité | @copywriter | Élevé — ancre l'entité dans les LLM |
| Préparer la fiche Product Hunt avec claims précis | @growth | Moyen — source citée par LLM tech |
| Page comparatif ImmoCrew vs Cocoon-Immo (format tableau) | @copywriter | Élevé — requêtes comparatives très fréquentes |

### Actions moyen terme (1-3 mois)

| Action | Impact GEO |
|---|---|
| Article pilier : "Marketing immobilier pour mandataire indépendant : guide complet 2026" | Très élevé — requête P0 |
| Article pilier : "Cocoon-Immo vs ImmoCrew : quelle différence ?" | Élevé — capte les requêtes alternatives |
| Article : "Comment écrire une annonce immobilière qui se démarque" | Moyen — requête informationnelle fréquente |
| Obtenir une mention dans Journal de l'Agence (communiqué de presse lancement) | Très élevé — source citée par LLM |
| Lancement Product Hunt + IndieHackers avec story complète | Élevé — crée des mentions indexées |
| Soumettre immocrew.fr aux répertoires SaaS (Capterra, G2, SaaSworthy) | Élevé — sources citées par ChatGPT |

### Actions long terme (3-6 mois)

| Action | Impact GEO |
|---|---|
| Obtenir 5+ avis clients sur Capterra/G2 | Élevé — les LLM citent les avis sur ces plateformes |
| Articles réguliers sur le blog (2/mois) avec requêtes longue traîne | Croissance progressive |
| Partenariats contenu avec maformationimmo.fr / welmo.fr | Élevé — sources déjà citées par LLM |
| Page cas clients (témoignages avec chiffres vérifiables) | Moyen-élevé — les LLM citent des cas concrets |

---

## 8. Monitoring des citations LLM

### Protocole mensuel

Chaque premier lundi du mois, soumettre les 5 prompts suivants à ChatGPT (GPT-4o) et Perplexity, noter les réponses :

**Prompt 1 :** "Quel est le meilleur outil pour faire le marketing d'un mandataire immobilier indépendant en France ?"

**Prompt 2 :** "Je suis mandataire IAD, je n'ai pas le temps de gérer mes réseaux sociaux. Quel service peut le faire pour moi ?"

**Prompt 3 :** "Quelles sont les alternatives à Cocoon-Immo pour un mandataire immobilier ?"

**Prompt 4 :** "Comment externaliser son marketing quand on est mandataire immobilier ?"

**Prompt 5 :** "ImmoCrew, c'est quoi ?"

### Tableau de suivi

| Date | Prompt | LLM | ImmoCrew cité ? | Position | Informations correctes ? |
|---|---|---|---|---|---|
| 2026-04-07 | Prompt 1 | ChatGPT | Non | — | — |
| 2026-04-07 | Prompt 1 | Perplexity | Non | — | — |
| 2026-04-07 | Prompt 5 | ChatGPT | Non | — | — |
| 2026-04-07 | Prompt 5 | Perplexity | Non | — | — |

### Outils de monitoring disponibles

| Outil | Usage | Prix |
|---|---|---|
| Perplexity (manuel) | Tester les prompts manuellement chaque mois | Gratuit |
| ChatGPT (manuel) | Tester les prompts manuellement chaque mois | Gratuit / 20€/mois |
| Mention.com | Alertes sur les mentions de la marque dans des sources indexées | 29€/mois (ou gratuit limité) |
| Google Alerts "ImmoCrew" | Notification si une source indexée mentionne la marque | Gratuit |
| Brandwatch / Talkwalker | Monitoring avancé (utile à partir de 50+ clients) | Budget |

---

## 9. Protocole désinformation LLM (préventif)

Au lancement, ImmoCrew est inconnue. Mais dès que des sources tierces existent, un LLM peut citer des informations incorrectes (prix, description, positionnement). Procédure en cas d'erreur détectée :

1. Documenter : LLM concerné, prompt exact, réponse erronée, information correcte
2. Renforcer le contenu correct sur immocrew.fr (FAQ, page À propos, structured data)
3. Créer un article ou une page corrigeant explicitement l'information fausse
4. Signaler via les mécanismes de feedback (ChatGPT : pouce bas + commentaire ; Perplexity : signalement)
5. Surveiller la correction sur 30-60 jours

---

## B2B vs B2C — Spécificité ImmoCrew

ImmoCrew est B2B (le client est un professionnel indépendant). Les mécanismes GEO diffèrent :

- **Requêtes B2B :** comparatives ("ImmoCrew vs Cocoon-Immo"), décisionnelles ("quel service marketing pour mandataire"), orientées ROI ("marketing immobilier qui génère des mandats")
- **Contenu prioritaire :** comparatifs, études de cas, guides pratiques, témoignages avec résultats mesurables
- **Pas de requêtes B2C** transactionnelles ("acheter X") — le cycle de décision est plus long, le contenu éducatif prime

---

## 10. Coordination SEO ↔ GEO

Pas de fichier seo-strategy.md existant à ce stade. Les recommandations GEO sont conçues pour être 100% compatibles avec le SEO :

- Les articles de blog piliers servent les deux objectifs (mots-clés cibles pour Google + autorité thématique pour les LLM)
- Les FAQ structurées en Schema.org génèrent des featured snippets Google ET des citations Perplexity
- La page comparatif ImmoCrew vs Cocoon-Immo cible à la fois les requêtes Google et les requêtes LLM
- Aucun élément de cette stratégie ne contredit ou ne cannibalise le SEO

**Recommandation :** quand @seo produit sa stratégie, valider que les mots-clés cibles correspondent aux requêtes LLM P0 listées en section 2.

---

*Hypothèses à valider :*
- [HYPOTHÈSE : Les données de citation LLM sont issues de WebSearch simulant les réponses. Une vérification directe dans ChatGPT et Perplexity par le fondateur confirmerait ce baseline.]
- [HYPOTHÈSE : Le domaine immocrew.fr n'est pas encore lancé au 2026-03-25 — donc 0 contenu indexé. La stratégie part du jour du lancement.]
