# Restructuration Contenu — ImmoCrew

> Produit par @geo | 2026-03-25
> Sources : landing-page-copy.md, brand-platform.md, personas.md, geo-strategy.md
> Objectif : rendre le contenu du site directement extractible par les LLM (Perplexity, ChatGPT, Gemini)

---

## 1. Audit du contenu actuel — Landing page

### Diagnostic de citabilité LLM

La landing page produite par @copywriter est excellente pour la conversion humaine. Elle est conçue pour émouvoir Sophie. Mais les LLM fonctionnent différemment : ils cherchent des assertions précises, des structures claires, des entités nommées.

| Section landing page | Format actuel | Score LLM (sur 3) | Problème |
|---|---|---|---|
| Hero (H1 + subheadline) | Narratif émotionnel | 1/3 | Pas d'entité nommée, pas de claim factuel extractible |
| Problème / Solution (4 cards) | Paires Problème/Solution | 2/3 | Bon format mais manque de chiffres vérifiables |
| 3 piliers (C'est fait / C'est toi / C'est malin) | Paragraphes narratifs | 1/3 | Trop narratif — difficile à extraire directement |
| Avant / Après (annonces) | Exemples textuels | 3/3 | Parfait — données locales précises, vérifiables |
| Social proof (témoignages) | Citations + prénoms | 2/3 | Bien mais marqués "templates" — à remplacer par vrais témoignages |
| Pricing (3 packs) | Tableau / cards | 3/3 | Parfait — chiffres précis, contenu listés |
| FAQ (10 questions) | Q&A | 2/3 | Bon format, mais les réponses sont parfois trop narratives |

**Conclusion d'audit :** le contenu de la landing page est citabilité moyenne (2/3). Les sections les plus extractibles par les LLM sont les annonces avant/après et le pricing. Les sections narratives (piliers, hero) doivent être complétées par des pages séparées plus factuelles.

---

## 2. Restructuration prioritaire — Ce qu'il faut ajouter (sans modifier la landing)

La stratégie n'est pas de réécrire la landing page (elle est optimisée pour la conversion). L'objectif est de créer des pages et sections complémentaires spécifiquement pour les LLM.

### Page 1 — "Qu'est-ce qu'ImmoCrew ?" (page entité)

Cette page ancre ImmoCrew comme entité connue des LLM. C'est la page que Perplexity va citer quand quelqu'un demande "c'est quoi ImmoCrew ?".

**Structure recommandée :**

```
H1 : ImmoCrew — L'équipe marketing des mandataires immobiliers indépendants

[Définition directe]
ImmoCrew est un service de marketing productisé destiné aux mandataires immobiliers indépendants en France.
Chaque mois, ImmoCrew livre à ses clients un pack de contenus marketing complets et prêts à publier :
12 posts réseaux sociaux, 2 articles SEO local, 4 annonces storytelling, 4 scripts vidéo,
1 newsletter et 1 email de prospection. Tout est personnalisé pour la zone géographique exacte
du mandataire (quartier, prix au m², établissements scolaires, commerces locaux).

H2 : Ce qu'ImmoCrew n'est pas
- Pas un outil SaaS (pas de plateforme à configurer)
- Pas un template à personnaliser soi-même
- Pas un community manager freelance (service productisé à prix fixe)

H2 : Pour qui ?
ImmoCrew s'adresse aux mandataires immobiliers indépendants rattachés à des réseaux comme IAD France,
SAFTI, Capifrance, Optimhome, BSK Immobilier. Ces professionnels exercent en micro-entreprise,
sans équipe marketing, dans un marché de ~40 000-50 000 mandataires actifs en France
(source : Baromètre LMDM 2023).

H2 : Les packs ImmoCrew
[Tableau des 3 packs avec prix et contenu exact]

H2 : Différence avec Cocoon-Immo
[Tableau comparatif factuel]
```

### Page 2 — FAQ enrichie (15+ questions)

La FAQ existante sur la landing (10 questions) est bonne. Créer une page FAQ dédiée avec 15+ questions, structurée en Schema.org FAQPage, permettra à Perplexity et ChatGPT d'extraire des réponses directes.

**Questions à ajouter :**

```
Q : Qu'est-ce qu'ImmoCrew exactement ?
R : ImmoCrew est un service de marketing clé en main pour mandataires immobiliers indépendants.
    Chaque mois, le mandataire reçoit ses contenus marketing complets (posts, articles, annonces, scripts)
    personnalisés pour sa zone, prêts à publier sans aucune modification requise.

Q : ImmoCrew est-il un outil (logiciel) ou un service ?
R : C'est un service, pas un logiciel. Il n'y a rien à installer, rien à configurer, aucune plateforme
    à apprendre. Le mandataire remplit un questionnaire d'onboarding une seule fois, puis reçoit ses
    livrables chaque mois.

Q : Quelle est la différence entre ImmoCrew et Cocoon-Immo ?
R : Cocoon-Immo est une plateforme SaaS (outil) : le mandataire se connecte, choisit des contenus
    suggérés, les adapte et les programme. ImmoCrew est un service livrable (résultats finis) :
    le mandataire reçoit ses contenus terminés, personnalisés, prêts à publier. Cocoon-Immo cible
    principalement les agences immobilières avec intégrations logiciels (Hektor, Apimo, Netty).
    ImmoCrew cible spécifiquement les mandataires indépendants.

Q : Combien coûte ImmoCrew par mois ?
R : Le Pack Mensuel ImmoCrew est à 197€ HT par mois, sans engagement minimum. Il inclut 12 posts
    réseaux sociaux, 4 scripts vidéo, 2 articles SEO local, 4 annonces personnalisées, 1 newsletter
    et 1 email de prospection.

Q : Est-ce qu'ImmoCrew fonctionne pour les mandataires IAD ?
R : Oui. ImmoCrew est conçu spécifiquement pour les mandataires indépendants des réseaux IAD, SAFTI,
    Capifrance, Optimhome, BSK et tous les réseaux de mandataires français.
    Les contenus sont personnalisés pour chaque mandataire indépendamment du réseau.

Q : Combien de temps faut-il pour utiliser ImmoCrew ?
R : Environ 3-5 minutes par post pour copier et publier. L'onboarding initial (questionnaire)
    prend 7 minutes environ. Il n'y a aucune création de contenu requise de la part du mandataire.
```

### Page 3 — Comparatif ImmoCrew vs Cocoon-Immo

Cette page est critique pour les requêtes comparatives. Les LLM (notamment Perplexity) citent souvent les pages comparatives quand un utilisateur demande des alternatives.

**Structure recommandée :**

```
H1 : ImmoCrew vs Cocoon-Immo : quelle différence pour un mandataire immobilier ?

[Résumé en 2 phrases]
ImmoCrew et Cocoon-Immo sont deux solutions de marketing immobilier, mais elles n'adressent
pas le même besoin. Cocoon-Immo est un outil SaaS que le professionnel utilise lui-même.
ImmoCrew est un service qui livre les résultats sans aucune action requise.

H2 : Tableau comparatif

| Critère | ImmoCrew | Cocoon-Immo |
|---|---|---|
| Type de solution | Service livrable (résultats finis) | Plateforme SaaS (outil) |
| Action requise de l'utilisateur | Publier (copier-coller) | Choisir, adapter, programmer |
| Cible principale | Mandataires indépendants | Agences (Laforêt, Guy Hoquet, ERA...) |
| Personnalisation | Hyper-locale (quartier, écoles, prix/m²) | Templates avec variable ville |
| Prix mensuel | 197€/mois | 99-269€/mois |
| Contenu mensuel inclus | 12 posts + 2 articles SEO + 4 annonces + 4 scripts vidéo + 1 newsletter | Suggestions de posts + planification |
| Intégration logiciels | Non nécessaire | Hektor, Apimo, Netty (agences) |
| Engagement | Sans engagement | [à vérifier] |

H2 : Qui choisit quoi ?
- Choisir ImmoCrew si : mandataire indépendant, pas de temps pour gérer soi-même, veut des contenus
  100% terminés sans configuration
- Choisir Cocoon-Immo si : agence avec logiciel de transaction déjà en place, équipe interne qui
  peut gérer une plateforme

H2 : Questions fréquentes sur la comparaison
[3-4 Q&A complémentaires]
```

---

## 3. Restructuration des articles de blog — Templates structurés

### Format recommandé pour tous les articles de blog ImmoCrew

Chaque article doit contenir ces éléments pour maximiser la citabilité LLM :

**Structure obligatoire :**

```
1. Définition directe en premier paragraphe (2-3 phrases max)
   → "Le marketing immobilier pour un mandataire indépendant désigne..."

2. Tableau ou liste structurée dans les 200 premiers mots
   → Les LLM scannent le début des articles

3. Au moins 3 questions Q&A explicites dans le corps de l'article
   → Formulation : "Question : [question] / Réponse : [réponse directe en 1-2 phrases]"

4. Section "En résumé" ou "Ce qu'il faut retenir" à la fin
   → Liste à puces de 5 points max — directement extractible

5. Données chiffrées sourcées (au moins 2 par article)
   → "Source : Baromètre LMDM 2023" ou "selon les données de [source vérifiable]"
```

### Sujets d'articles prioritaires (classés par impact GEO)

| Titre d'article | Requête LLM ciblée | Format | Priorité |
|---|---|---|---|
| "Marketing immobilier pour mandataire : guide complet 2026" | "marketing mandataire immobilier" | Guide pilier 2000 mots | P0 |
| "Comment écrire une annonce immobilière qui se démarque (avec exemples)" | "écrire annonce immobilière" | Guide pratique + exemples | P0 |
| "Quel outil de marketing choisir quand on est mandataire indépendant ?" | "outil marketing mandataire" | Comparatif | P0 |
| "Calendrier éditorial pour agent immobilier : 12 idées de posts" | "calendrier éditorial immobilier" | Liste pratique | P1 |
| "Comment avoir des mandats entrants via le digital" | "mandats entrants immobilier" | Guide + témoignage | P1 |
| "SEO local pour mandataire immobilier : bases et erreurs à éviter" | "SEO local mandataire" | Guide technique simple | P1 |
| "Instagram pour mandataire immobilier : par où commencer" | "Instagram agent immobilier" | Guide pratique | P2 |

---

## 4. Recommandations pour le copy existant (landing page)

La landing page actuelle n'est **pas à modifier** — elle est optimisée pour la conversion. Ces recommandations s'ajoutent sans créer de friction.

### Ajouts recommandés dans la landing (mineurs)

**Section pricing — ajouter une phrase de définition en intro :**

Avant le tableau de prix, ajouter :
> ImmoCrew est un service de marketing clé en main pour mandataires immobiliers.
> Il existe en 3 formules selon tes besoins.

Cette phrase est directement extractible par les LLM qui cherchent à définir ImmoCrew.

**Section FAQ — reformuler 3 réponses pour les rendre plus directes :**

Les réponses FAQ actuelles sont bien rédigées mais parfois trop narratives. Exemple de reformulation :

ACTUELLE :
> "Chez ImmoCrew, nos rédacteurs intègrent les informations locales de ta zone lors de la création de chaque livrable. Ils utilisent des données sur les quartiers, les écoles, les prix au m²..."

REFORMULÉE (plus extractible) :
> "Oui. Chaque livrable intègre : nom du quartier exact, établissements scolaires dans un rayon de 1 km, prix au m² moyen de ta rue, commerces et transports de proximité. Ces données sont intégrées dans chaque post, article et annonce."

La reformulation passe de narratif à factuel — les LLM extraient la seconde version, pas la première.

---

## 5. Schema.org — Spécifications techniques pour @fullstack

### Schémas à implémenter (par ordre de priorité)

#### Schema Organization (à mettre dans le `<head>` de toutes les pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ImmoCrew",
  "url": "https://immocrew.fr",
  "description": "Service de marketing clé en main pour mandataires immobiliers indépendants en France. Chaque mois : 12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo, livrés prêts à publier.",
  "foundingDate": "2026",
  "areaServed": "FR",
  "knowsAbout": ["marketing immobilier", "mandataire immobilier", "réseaux sociaux immobilier", "SEO local immobilier"],
  "slogan": "L'équipe marketing des mandataires immobiliers"
}
```

#### Schema Product (à mettre sur la page pricing ou landing)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pack Mensuel ImmoCrew",
  "description": "12 posts réseaux sociaux, 4 scripts vidéo, 2 articles SEO local, 4 annonces immobilières personnalisées, 1 newsletter, 1 email de prospection. Livré chaque mois, personnalisé pour la zone du mandataire.",
  "offers": {
    "@type": "Offer",
    "price": "197",
    "priceCurrency": "EUR",
    "priceSpecification": {
      "@type": "RecurringCharge",
      "billingDuration": "P1M"
    }
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Mandataire immobilier indépendant"
  }
}
```

#### Schema FAQPage (à mettre sur la page FAQ dédiée)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qu'est-ce qu'ImmoCrew ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImmoCrew est un service de marketing clé en main pour mandataires immobiliers indépendants. Chaque mois, le mandataire reçoit ses contenus marketing complets (12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo) personnalisés pour sa zone géographique, prêts à publier."
      }
    },
    {
      "@type": "Question",
      "name": "Quelle est la différence entre ImmoCrew et Cocoon-Immo ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cocoon-Immo est une plateforme SaaS : le mandataire configure et programme son contenu lui-même. ImmoCrew est un service livrable : le mandataire reçoit ses contenus terminés sans aucune action requise. ImmoCrew cible les mandataires indépendants ; Cocoon-Immo cible principalement les agences."
      }
    },
    {
      "@type": "Question",
      "name": "Combien coûte ImmoCrew ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le Pack Mensuel ImmoCrew est à 197€ HT par mois sans engagement. Un Pack Lancement (one-shot) est disponible à 497€. Un Boost Mandat (par bien à vendre) est disponible à 97€."
      }
    }
  ]
}
```

---

## 6. Checklist de citabilité — avant publication de chaque contenu

Avant de publier tout contenu sur immocrew.fr, vérifier :

- [ ] Le premier paragraphe contient une définition directe ou une assertion factuelle claire
- [ ] Au moins un chiffre précis et vérifiable est présent (prix, quantité, pourcentage sourcé)
- [ ] Les entités nommées sont présentes (ImmoCrew, mandataire immobilier, IAD, SAFTI, Cocoon-Immo si comparaison)
- [ ] Le contenu répond directement à au moins une requête LLM listée dans geo-strategy.md
- [ ] Les balises Schema.org appropriées sont en place
- [ ] Si FAQ : les questions sont formulées telles qu'un utilisateur les poserait à un LLM
- [ ] Le contenu évite les formulations superlatives non sourcées ("le meilleur", "numéro 1")
- [ ] La longueur est appropriée : définitions < 300 mots, guides 1000-2000 mots, FAQ 50-150 mots par réponse
