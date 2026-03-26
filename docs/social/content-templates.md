# Templates de Contenu — ImmoCrew

> Produit par @social | 2026-03-26
> Sources : social-strategy.md, editorial-calendar.md, brand-voice.md, personas.md
> Usage : templates prêts à l'emploi pour le pipeline IA + production manuelle. Variables entre crochets à remplacer.

---

## Variables globales du pipeline IA

Chaque template utilise des variables standardisées. Le pipeline IA les remplace automatiquement depuis le profil d'onboarding du mandataire.

| Variable | Valeur exemple | Source dans le profil |
|----------|---------------|----------------------|
| `{{prenom}}` | Sophie | Onboarding champ "Prénom" |
| `{{zone_geo}}` | Angers | Onboarding champ "Zone principale" |
| `{{quartier}}` | La Doutre | Onboarding champ "Quartier cible" |
| `{{ville}}` | Angers | Onboarding champ "Ville" |
| `{{reseau}}` | IAD | Onboarding champ "Réseau de mandataires" |
| `{{type_bien}}` | appartement T3 | Variable du livrable "Boost Mandat" |
| `{{adresse_bien}}` | rue des Tanneurs | Variable du livrable "Boost Mandat" |
| `{{prix_m2_zone}}` | 2 650€/m² | Base de données prix locaux |
| `{{ecole_proche}}` | école Jeanne d'Arc | Base de données locale |
| `{{transport_proche}}` | tramway ligne A | Base de données locale |
| `{{specialite}}` | appartements familiaux | Onboarding champ "Spécialité" |
| `{{annee_experience}}` | 3 ans | Onboarding champ "Années d'expérience" |
| `{{nom_client_temoignage}}` | Marc et Julie | Variable du livrable témoignage |
| `{{resultat_client}}` | vendu en 11 jours | Variable du livrable témoignage |

---

## SECTION 1 — TEMPLATES LINKEDIN

> Plateforme : LinkedIn profil personnel (fondateur ImmoCrew ou mandataire pour usage direct)
> Ton : direct, complice, tutoiement, zéro jargon
> Longueur : 800-1 300 caractères (optimal LinkedIn 2025 — sous la limite "voir plus")
> Hashtags : 3-5 maximum, toujours `#mandataireimmobilier` en premier

---

### LK-01 — Post témoignage client

**Format :** Post texte court + image résultat (optionnel)
**Pilier :** Preuve sociale
**Longueur recommandée :** 900-1 100 caractères
**Moment de publication :** Vendredi 8h-9h

**Structure :**
1. Hook — le résultat concret en ouverture (2 lignes max)
2. Contexte — qui est le client, sa situation avant
3. Ce qui a changé — le détail du travail fait
4. Résultat — chiffré si possible, sinon qualitatif
5. CTA — question qui invite au commentaire ou DM

---

**Template :**

```
{{nom_client_temoignage}} cherchait des vendeurs à {{quartier}}.
En 6 semaines, 3 mandats entrants. Voilà ce qu'on a fait.

Quand {{prenom_client}} nous a contactés, ses annonces ressemblaient à 95% de celles qu'on voit sur SeLoger : "Beau T3 lumineux, proche commerces, calme." Efficace pour se fondre dans la masse. Pas pour se démarquer.

On a retravaillé chaque texte avec ce que les acheteurs de {{quartier}} cherchent vraiment : la proximité du {{transport_proche}}, les écoles à 5 minutes, les prix au m² qui tiennent ({{prix_m2_zone}} dans le secteur), le calme de la rue.

6 semaines plus tard : 3 contacts vendeurs directs. {{resultat_client}}.

Tu es mandataire à {{zone_geo}} et tes annonces se ressemblent toutes ? Dis-moi en commentaire ce que tu vends en ce moment — je te montre ce qu'on ferait.

#mandataireimmobilier #immobilier #marketingimmobilier
```

**Variantes de hook (A/B testing) :**
- Version A (résultat) : "{{nom_client_temoignage}} cherchait des vendeurs à {{quartier}}. En 6 semaines, 3 mandats entrants."
- Version B (problème) : "Ses annonces étaient bonnes. Mais toutes les autres aussi. C'est là que ça coince."
- Version C (surprise) : "Ce qui a changé pour {{prenom_client}} à {{ville}}, c'est pas son réseau. C'est ses annonces."

**CTA recommandés :**
- "Dis-moi en commentaire ce que tu vends en ce moment."
- "Tu te reconnais dans cette situation ? Je lis les DMs."
- "Envoie-moi l'URL d'une de tes annonces — je te montre ce qu'on ferait."

---

### LK-02 — Post conseil immobilier (tips actionnables)

**Format :** Post texte court ou carrousel PDF (5-8 slides)
**Pilier :** Valeur / éducatif
**Longueur recommandée :** Texte court 1 000-1 300 caractères / Carrousel : 5-8 slides de 20-40 mots chacune
**Moment de publication :** Mardi 8h-9h (carrousel) ou Jeudi 12h (texte)

**Structure texte court :**
1. Hook — affirmation contre-intuitive ou observation terrain
2. Liste numérotée — 3 à 5 points concrets
3. Explication courte de chaque point (1-2 lignes)
4. CTA — action à faire immédiatement

---

**Template texte court :**

```
La phrase "proche commerces" dans tes annonces ne sert à rien.
Voilà ce qui marche à la place — 3 alternatives concrètes.

1. Le nom exact.
"À 200m du marché du Ralliement, place Victor-Hugo." Pas "proche du centre." Les acheteurs de {{quartier}} connaissent les rues par cœur.

2. Le temps de trajet réel.
"7 minutes à pied du {{transport_proche}}." Pas "bien desservi." Le chiffre, pas l'adjectif.

3. Ce que ça veut dire pour leur vie.
"Tes enfants vont à l'{{ecole_proche}} — à 4 minutes à pied sans traverser une grande route." Ça, les parents se souviennent.

Ces trois éléments tiennent en 2 lignes. Pas besoin de réécrire toute l'annonce.

Tu as une annonce en ligne en ce moment ? Envoie-moi l'URL en commentaire ou en DM — je te montre le résultat.

#mandataireimmobilier #marketingimmobilier #conseillerimmobilier
```

**Structure carrousel (slides) :**
- Slide 1 — Hook titre : "5 phrases à bannir de tes annonces (et ce qui marche à la place)"
- Slide 2 — Phrase 1 bannie + alternative concrète
- Slide 3 — Phrase 2 bannie + alternative concrète
- Slide 4 — Phrase 3 bannie + alternative concrète
- Slide 5 — Phrase 4 bannie + alternative concrète
- Slide 6 — Phrase 5 bannie + alternative concrète
- Slide 7 — Récap + CTA ("Sauvegarde ce post. Applique ça à ta prochaine annonce.")
- Slide 8 (optionnel) — Avant/après réel avec `{{quartier}}`

**Template slide 1 (carrousel) :**
```
5 phrases à bannir de tes annonces immobilières
(et ce qui marche à la place)

→ Pour les mandataires de {{zone_geo}} qui veulent se démarquer
```

**CTA recommandés :**
- "Sauvegarde ce post — tu en auras besoin avant ta prochaine annonce."
- "Lequel tu vas tester en premier ? Dis-moi en commentaire."
- "Tag un mandataire qui a besoin de lire ça."

---

### LK-03 — Post coulisses / storytelling fondateur

**Format :** Post texte court
**Pilier :** Storytelling
**Longueur recommandée :** 800-1 100 caractères
**Moment de publication :** Vendredi 12h ou Jeudi soir

**Structure :**
1. Hook — situation vécue, moment précis (pas de généralité)
2. Ce que j'ai observé — le problème vu de l'intérieur
3. Ce que j'ai décidé — la décision prise, le "pourquoi ImmoCrew"
4. Ce que ça donne aujourd'hui — résultat ou progression
5. CTA — ouverture vers la communauté

---

**Template :**

```
J'ai relu 50 profils LinkedIn de mandataires cette semaine.
Ce que j'ai trouvé m'a pas surpris — mais ça m'a quand même serré le cœur.

47 profils sur 50 n'avaient pas posté depuis plus de 3 semaines.
Sur les 3 restants, 2 avaient publié le même visuel Canva fourni par leur réseau.

Ces gens-là connaissent leur métier. Ils savent ce qu'est un bon bien, ils savent estimer, ils savent négocier. Mais ils disparaissent des réseaux parce que personne ne leur a expliqué comment faire autrement. Et les templates de leur réseau, c'est le même visuel pour 18 000 mandataires.

C'est pour ça que j'ai créé ImmoCrew.
Pas pour vendre un outil de plus. Pour qu'un mandataire à {{zone_geo}} puisse publier quelque chose qui lui ressemble, sans y passer ses soirées.

Si tu es mandataire et que tu te reconnais dans ces 47 profils — ça m'intéresse de discuter.

#mandataireimmobilier #iad #safti #immobilier
```

**Variantes de hook :**
- "J'ai passé une heure à lire des posts de mandataires cette semaine. Observation honnête."
- "On m'a posé une question difficile hier : 'Qu'est-ce qui prouve que ça marche ?'"
- "Il m'a fallu 3 mois pour comprendre pourquoi les mandataires arrêtent de poster."

**CTA recommandés :**
- "Si tu te reconnais dans ces 47 profils — ça m'intéresse de discuter."
- "Qu'est-ce qui t'a fait arrêter de poster, toi ? Je lis les commentaires."
- "Tu veux que je jette un oeil à ton profil ? DM ouvert."

---

### LK-04 — Post annonce bien (Boost Mandat LinkedIn)

**Format :** Post image + texte
**Pilier :** Preuve sociale / Promotion ponctuelle
**Longueur recommandée :** 600-900 caractères (plus court — l'image porte une partie du message)
**Moment de publication :** Vendredi 8h ou Mardi 12h

**Structure :**
1. Hook — ce qui rend CE bien unique dans CE quartier (pas générique)
2. Détails locaux — 2-3 éléments hyper-locaux nommés
3. Prix et situation — clair, sans tournure commerciale
4. CTA — action directe pour les acheteurs ou les curieux

---

**Template :**

```
{{quartier}}, {{ville}}.
Un {{type_bien}} qui coche tout ce que cherchent les familles de ce quartier.

Rue {{adresse_bien}} — {{prix_m2_zone}} le m² dans le secteur, ce bien est à {{prix_bien}}.

Ce qui fait la différence ici : l'{{ecole_proche}} à 4 minutes à pied, le {{transport_proche}} à deux pas, et cette lumière en fin d'après-midi qui fait qu'on ne veut pas partir des visites.

3 pièces, {{surface}}m², {{etage}}. Disponible à partir de {{date_disponibilite}}.

Tu cherches dans ce secteur ou tu connais quelqu'un qui cherche ? Envoie-moi un message directement.

{{prenom}} — mandataire {{reseau}} à {{ville}}

#immobilier #{{ville_hashtag}} #mandataireimmobilier #conseillerimmobilier
```

**Variantes de hook :**
- "Le {{quartier}} comme tu ne l'as jamais vu dans une annonce."
- "Pourquoi ce {{type_bien}} à {{quartier}} va partir vite."
- "Ce n'est pas juste un appartement. C'est une adresse."

**CTA recommandés :**
- "Tu cherches dans ce secteur ? Envoie-moi un message directement."
- "Visite disponible cette semaine. Un DM suffit."
- "Tu connais quelqu'un qui cherche dans {{quartier}} ? Passe-lui ce post."

---

## SECTION 2 — TEMPLATES INSTAGRAM / REELS

> Plateforme : Instagram @immocrew
> Ton : direct, complice, visuel — le texte accompagne, l'image ou la vidéo porte le message
> Longueur caption : 150-300 mots (Instagram favorise les captions moyennes en 2025)
> Hashtags : 20-25 par post, mix niche + thématique + découverte (voir social-strategy.md section 3.4)

---

### IG-01 — Carrousel avant/après annonce

**Format :** Carrousel 5-7 images (Canva Free — palette #1B2A4A + #F27A1A + #F8F6F2)
**Pilier :** Preuve sociale
**Longueur caption :** 150-250 mots
**Moment de publication :** Mercredi 12h-13h

**Slides structure :**
- Slide 1 — Cover accrocheuse : "Avant / Après — une annonce à {{quartier}}" (fond sombre, typographie ImmoCrew)
- Slide 2 — L'annonce originale (texte blanc sur fond rouge/orange) — anonymisée
- Slide 3 — "Problème : 3 choses qui manquent" (liste simple, fond blanc)
- Slide 4 — La version réécrite (texte blanc sur fond #1B2A4A)
- Slide 5 — Détail : "Ce qu'on a ajouté — les données locales" (liste des 3 éléments ImmoCrew)
- Slide 6 — CTA final : "Tu veux ça pour ta zone ? → lien en bio"

**Template caption :**

```
Avant. Après. Même bien, même ville.

Ce {{type_bien}} à {{quartier}} avait une bonne annonce.
Sauf qu'elle ressemblait à 200 autres annonces sur SeLoger.

Ce qu'on a changé :
→ "proche commerces" → "à 3 minutes du marché {{nom_marche}}"
→ "bien desservi" → "tramway {{transport_proche}} à 4 minutes à pied"
→ "calme" → "rue {{adresse_bien}}, sans passage de voitures"

Le bien n'a pas changé.
Les mots, si.

Glisse les slides pour voir les deux versions.

Si ton annonce ressemble à celle du "avant" — c'est normal, tout le monde débute pareil.
Et c'est exactement là qu'on intervient.

👉 Lien en bio pour voir un exemple pour ta zone.

.
.
#mandataireimmobilier #conseillerimmobilier #marketingimmobilier #immocrew #annonceimmobiliere #immobilierFrance #venteimmobiliere #mandataireIAD #conseillerSAFTI #agentimmobilier #prospectionimmobiliere #immobilier #entrepreneur #marketingdigital #independant #{{ville_hashtag}} #{{quartier_hashtag}} #annoncesimmobilieres #vendreunbien #photographeimmobilier
```

**Variantes de hook caption :**
- "On a récrit cette annonce en 20 minutes. Glisse pour voir."
- "Même appartement. Mêmes photos. Texte différent. Résultat différent."
- "Cette annonce se fondait dans la masse. Puis on l'a retravaillée."

---

### IG-02 — Reel conseil express (30-60 secondes)

**Format :** Reel vertical 9:16, 30-60 sec, voix off + texte à l'écran (CapCut)
**Pilier :** Valeur / éducatif
**Longueur caption :** 100-200 mots
**Moment de publication :** Lundi 12h-13h ou 19h-20h

**Script Reel — structure :**
- 0-3 sec : Hook visuel (texte à l'écran qui interpelle, sans intro)
- 3-20 sec : Le problème — lecture rapide d'une annonce générique type
- 20-45 sec : La solution — 3 points concrets en voix off + texte
- 45-60 sec : CTA — une action unique

**Template script Reel (conseils annonce) :**

```
[0-3 sec — TEXTE ÉCRAN]
"La phrase qu'on lit dans 80% des annonces en France"

[3-12 sec — VOIX OFF + TEXTE]
"Bel appartement lumineux, proche commerces, calme, idéalement situé."
Tu l'as déjà lue. Tu l'as peut-être déjà écrite.
Et tes acheteurs l'ont déjà oubliée.

[12-35 sec — VOIX OFF + 3 TEXTES À L'ÉCRAN EN SUCCESSION]
"Voilà ce qui marche à la place."

1 — Le nom exact, pas l'adjectif.
PAS "proche commerces" → OUI "3 minutes du marché {{nom_marche}}"

2 — Le chiffre, pas le flou.
PAS "bien desservi" → OUI "tramway à 4 minutes à pied"

3 — La vie, pas le bien.
PAS "idéal pour une famille" → OUI "{{ecole_proche}} à 5 minutes sans traverser une grande route"

[35-55 sec — VOIX OFF]
Ces trois changements tiennent en deux phrases.
Et tes acheteurs s'en souviennent.

[55-60 sec — TEXTE ÉCRAN + VOIX OFF]
"Tu veux voir ça pour une vraie annonce dans ta zone ? Lien dans la description."
```

**Template caption Reel :**

```
3 changements, 2 phrases, une annonce dont les acheteurs se souviennent.

Tes annonces immobilières méritent mieux que "proche commerces."

Les acheteurs de {{zone_geo}} ne cherchent pas un appartement. Ils cherchent une adresse, une école, une rue. Donne-leur ça.

La méthode complète → lien en bio.

.
.
#mandataireimmobilier #immobilier #conseillerimmobilier #marketingimmobilier #annonceimmobiliere #immobilierFrance #reelsimmobilier #conseilimmobilier #mandataireIAD #agentimmobilier #immocrew #astucesimmobilier #vendreunbien
```

---

### IG-03 — Post image / quote visuel

**Format :** Image carrée ou portrait (Canva Free), texte centré sur fond de couleur ImmoCrew
**Pilier :** Valeur ou Storytelling
**Longueur caption :** 100-180 mots
**Moment de publication :** Vendredi 12h

**Structure du visuel (Canva) :**
- Fond : #1B2A4A (bleu marine ImmoCrew)
- Citation centrale : typographie bold, blanc, 2-3 lignes max
- Logo ImmoCrew en bas à droite

**Template quote — problème de Sophie :**

```
[VISUEL — TEXTE CENTRÉ]
"Tes acheteurs ne cherchent pas un appartement.
Ils cherchent une adresse, une école, une vie."

— ImmoCrew
```

**Template caption :**

```
Et pourtant, 80% des annonces qu'on lit parlent encore de "lumineux" et "proche commodités."

C'est pas une critique — c'est comme ça qu'on apprend à rédiger des annonces.
Le problème, c'est que tous les autres aussi.

Ce qui fait la différence à {{zone_geo}} : le nom de l'école, le temps de trajet réel vers le centre, le prix au m² qui prouve que le bien est bien situé.

Ces détails, les acheteurs s'en souviennent.

Qu'est-ce qui différencie vraiment ta zone, toi ? → commentaires ouverts.

.
.
#mandataireimmobilier #immobilier #marketingimmobilier #conseillerimmobilier #immocrew #vendreunbien #annoncesimmobilieres #{{ville_hashtag}} #agentimmobilier #immobilierFrance
```

**Autres quotes prêtes à l'emploi :**
- "Publier 2 semaines et disparaître 3 mois. C'est pas un problème de motivation. C'est un problème de système."
- "Tes posts ne ressemblent pas à toi. Ils ressemblent au template de ton réseau. Ça se voit."
- "Un mandat entrant, ça ne vient pas du porte-à-porte. Ça vient d'un acheteur qui t'a lu et qui t'a choisi."

---

### IG-04 — Reel coulisses / avant-après live

**Format :** Reel vertical 9:16, 45-60 sec, voix off + écran partagé (texte avant / texte après)
**Pilier :** Preuve sociale ou Storytelling
**Longueur caption :** 150-220 mots
**Moment de publication :** Lundi ou Jeudi 19h

**Template script Reel (avant/après live) :**

```
[0-3 sec — TEXTE ÉCRAN]
"On réécrit une vraie annonce en direct — {{quartier}}, {{ville}}"

[3-15 sec — VOIX OFF + TEXTE : VERSION ORIGINALE AFFICHÉE]
"Voilà l'annonce de départ."
[lecture de l'annonce originale — 3-4 lignes génériques]
"Propre. Correcte. Indifférenciable."

[15-35 sec — VOIX OFF + TEXTE : VERSION RÉÉCRITE APPARAÎT]
"Voilà ce qu'on a fait."
[lecture de la version ImmoCrew — avec données locales nommées]
"On a gardé les mêmes faits.
On a ajouté {{quartier}}, l'{{ecole_proche}}, le {{transport_proche}},
et {{prix_m2_zone}} le m² dans le secteur."

[35-55 sec — VOIX OFF]
"Ce n'est pas de la magie.
C'est juste connaître ce que cherchent vraiment les acheteurs de ce quartier."

[55-60 sec — TEXTE ÉCRAN]
"Tu veux voir ça pour ta zone ? → lien en bio"
```

**Template caption :**

```
Même bien, même ville, mêmes faits. Texte différent.

Ce qu'on a fait pour cette annonce à {{quartier}} :
→ 0 adjectif vague supplémentaire
→ 3 données locales réelles ajoutées
→ Temps de lecture : identique

Les acheteurs de {{ville}} savent que {{quartier}} c'est {{element_local_1}}. Autant le dire.

Si ton annonce mérite ça — envoie-moi l'URL en DM ou via le lien en bio.

.
.
#mandataireimmobilier #immobilier #annonceimmobiliere #immocrew #avantapres #conseillerimmobilier #marketingimmobilier #{{ville_hashtag}} #agentimmobilier #immobilierFrance #reelsimmobilier #mandataireIAD #vendreunbien
```

---

## SECTION 3 — TEMPLATES STORIES INSTAGRAM

> Format : Stories verticales 9:16, durée affichage 24h
> Ton : encore plus direct et informel que les posts — c'est la coulisse, le temps réel
> Longueur texte à l'écran : 10-20 mots maximum par story
> Objectif : trafic vers le post ou le lien bio, engagement via stickers (sondage, question)

---

### ST-01 — Story relais de post (amplification)

**Usage :** Publier dans les 2h après un post pour booster la portée
**Structure :** 2-3 stories en séquence

```
[Story 1 — TEXTE + FLÈCHE VERS LE POST]
"On vient de poster quelque chose qui va t'aider."
[Partage du post avec sticker lien ou flèche]

[Story 2 — TEXTE CENTRÉ]
"Si tu es mandataire à {{zone_geo}} —
c'est fait pour toi."

[Story 3 — STICKER SONDAGE]
Question : "Tes annonces ressemblent à ça ?"
Option A : "Franchement oui"
Option B : "Non j'ai ma méthode"
```

---

### ST-02 — Story coulisses production

**Usage :** Montrer en temps réel la production d'un livrable ImmoCrew
**Structure :** 3 stories en séquence "avant pendant après"

```
[Story 1 — IMAGE capture d'écran annonce originale]
Texte overlay : "L'annonce de départ. Classique."

[Story 2 — IMAGE ou GIF "en cours"]
Texte overlay : "On travaille dessus pour {{quartier}}..."
[GIF chargement ou écriture — CapCut]

[Story 3 — IMAGE capture de la version réécrite]
Texte overlay : "Résultat.
Tu veux ça pour ta zone ? → lien en bio"
[Sticker lien pointant vers immocrew.fr]
```

---

### ST-03 — Story témoignage / résultat client

**Usage :** Partager un retour client en temps réel (capture d'écran DM ou message WhatsApp anonymisé)
**Structure :** 2 stories

```
[Story 1 — CAPTURE D'ÉCRAN DM anonymisé]
Texte overlay en haut : "On a reçu ça ce matin."
[NB : anonymiser le prénom si accord non obtenu, ou demander l'accord explicite]

[Story 2 — TEXTE CENTRÉ fond #1B2A4A]
"C'est pour ça qu'on fait ce boulot.
Tu veux la même chose pour ta zone ?
→ lien en bio"
[Sticker lien]
```

---

### ST-04 — Story question / engagement

**Usage :** Collecter des insights sur les frustrations de Sophie pour nourrir le contenu
**Structure :** 1-2 stories avec stickers interactifs

```
[Story 1 — FOND COULEUR + STICKER QUESTION]
Texte : "Quelle est ta galère n°1 avec tes réseaux sociaux en ce moment ?"
[Sticker question ouvert — les réponses nourrissent le calendrier éditorial]

OU

[Story 1 — FOND COULEUR + STICKER SONDAGE]
"Tu postes sur Instagram en ce moment ?"
Option A : "Régulièrement"
Option B : "Rarement / plus du tout"

[Story 2 — si résultats disponibles — partage des résultats]
"[X]% d'entre vous ont répondu 'rarement'.
C'est exactement pour ça qu'ImmoCrew existe.
→ swipe up / lien bio"
```

---

## SECTION 4 — TEMPLATES FACEBOOK GROUPES

> Canal : groupes Facebook de mandataires (pas une page ImmoCrew)
> Ton : celui d'un professionnel qui aide, pas d'une marque qui vend
> Règle absolue : ratio 10 réponses d'aide pour 1 mention ImmoCrew (voir social-strategy.md section 6)
> Format : réponse à une question existante dans le groupe, pas un post proactif de marque

---

### FB-01 — Réponse à une question sur les annonces

**Usage :** Quand un mandataire poste "Comment améliorer mes annonces ?" ou "Pourquoi mes annonces ne convertissent pas ?"
**Structure :** Réponse directe, valeur d'abord, mention ImmoCrew en option si naturel

```
Bonne question — et tu n'es pas seul dans ce cas.

Ce que j'ai constaté, c'est que la plupart des annonces immobilières souffrent du même problème : elles décrivent le bien, mais elles ne racontent pas l'adresse.

Trois choses concrètes à changer dès maintenant :

1. Remplace les adjectifs par des noms propres. Pas "proche commerces" — "3 minutes du marché [nom du marché de ta ville]". Les acheteurs locaux reconnaissent immédiatement.

2. Mets le prix au m² du secteur dans l'annonce. Les acheteurs cherchent à valider que c'est bien positionné. Aidez-les.

3. Nomme l'école la plus proche avec son temps de trajet à pied. Pour les familles, c'est souvent le critère n°1. "École [nom] à 5 minutes à pied" — pas "proche des écoles."

Ces trois changements tiennent en 2-3 lignes et changent vraiment la perception.

Si tu veux qu'on regarde ensemble une annonce concrète, envoie-moi un DM — je te fais un retour gratuit.
```

**Variante avec mention ImmoCrew (à n'utiliser qu'après 3-4 réponses d'aide dans le groupe) :**

```
[...même contenu...]

PS : c'est exactement ce qu'on fait chez ImmoCrew pour les mandataires qui veulent déléguer ça complètement — je te laisse voir si ça t'intéresse, mais les conseils au-dessus marchent aussi tout seul.
```

---

### FB-02 — Réponse à une question sur les réseaux sociaux

**Usage :** Quand un mandataire poste "Comment poster régulièrement ?" ou "J'ai arrêté de poster, comment reprendre ?"

```
Je comprends la galère — j'ai parlé à des dizaines de mandataires qui sont exactement dans ce cas.

Ce qui coince, c'est rarement la motivation. C'est le système (ou l'absence de système).

Voilà ce qui marche pour reprendre sans s'épuiser :

1. Choisis 3 types de posts, pas plus. Par exemple : un conseil immobilier, une annonce en cours, un "j'ai appris que..." terrain. Quand tu sais que tu vas alterner entre ces 3 formats, tu n'as plus la page blanche.

2. Prépare 4 posts d'un coup le dimanche soir. 45 minutes, une fois par semaine. Mieux qu'essayer de trouver une idée chaque jour.

3. Commence par LinkedIn. C'est le plus tolérant sur la fréquence et le plus direct pour les contacts mandats. Instagram vient après.

La régularité compte plus que la perfection. Un post moyen publié vaut mieux qu'un post parfait jamais publié.

Tu veux un calendrier éditorial clé en main pour repartir ? Je peux t'en envoyer un.
```

---

### FB-03 — Réponse à une question sur le budget marketing

**Usage :** Quand un mandataire demande "Combien investir dans son marketing ?" ou "CM freelance — ça vaut le coup ?"

```
Honnêtement, ça dépend de ce que tu attends et de ton CA.

Si tu fais 4-5 transactions par an à 3-5K€ de commission par vente, ton budget marketing devrait être de l'ordre de 3-8% du CA — soit 400-900€/mois maximum pour que ça reste rentable.

Pour un CM freelance à 500-800€/mois : l'expérience de beaucoup de mandataires que je connais, c'est des résultats décevants parce que le CM ne connaît pas vraiment le métier. Il poste des trucs génériques, pas de la connaissance terrain.

Ce qui marche mieux en pratique :
- Des outils de templates ton-réseau si tu as le temps de les adapter vraiment
- Une formation courte pour apprendre les bases (2-3 heures sur YouTube, ça couvre 80% des besoins)
- Un service spécialisé mandataires si tu veux déléguer sans y penser

Le critère clé : est-ce que le prestataire connaît vraiment l'immobilier, ton réseau (IAD, SAFTI...), et ta zone ? Si c'est non, c'est souvent de l'argent gaspillé.
```

---

### FB-04 — Post proactif (valeur pure, sans promo)

**Usage :** Post dans un groupe quand la règle 10:1 est respectée — on n'est pas en train de vendre
**Structure :** Conseil concret + ouverture discussion

```
Partage d'expérience — ce que j'ai observé chez les mandataires qui ont le plus de mandats entrants en ce moment.

Sans exception, ils ont tous ces deux choses :
→ Un profil Google Business rempli et actif (avis récents, photos de biens, horaires à jour)
→ Des annonces qui mentionnent les références locales (les vraies rues, les vraies écoles, les vrais prix au m²)

Pas de stratégie compliquée. Pas de budget pub. Juste de la cohérence et du local.

Le profil Google Business, c'est gratuit et ça prend 30 minutes à bien remplir. Et contrairement aux réseaux sociaux, il reste visible des mois après sans republier.

Est-ce que vous avez votre profil Google Business à jour ? Curieux de savoir si c'est quelque chose que vous utilisez ou non dans votre zone.
```

---

## SECTION 5 — SÉQUENCES DM LINKEDIN (outbound)

> Protocole DM outbound : 50 DMs/semaine, séquence 3 messages (voir social-strategy.md section 2.4)
> Envoi : jeudi après publication du carrousel LinkedIn
> Relance J+3 (dimanche), J+7 (jeudi suivant)
> Cible : mandataires IAD, SAFTI, Capifrance actifs sur LinkedIn

---

### DM-01 — Message 1 (J0) : annonce réécrite offerte

**Objet :** Livraison gratuite, sans demande
**Longueur :** 8-12 lignes

```
Salut {{prenom_prospect}},

J'ai vu ton annonce pour le {{type_bien}} à {{quartier_prospect}} sur {{plateforme_annonce}}.
Je me suis permis de la réécrire — juste pour te montrer ce qu'on fait.

Ta version :
"{{extrait_annonce_originale}}"

Ce que ça donnerait avec nous :
"{{version_reecrite — 4-5 lignes avec {{quartier_prospect}}, données locales, école, transport, prix m²}}"

C'est gratuit, c'est cadeau. Si ça t'intéresse de recevoir ce genre de texte chaque mois (posts, articles, annonces — tout pour ta zone), tu peux voir un exemple ici : immocrew.fr

Bonne journée !
[Prénom fondateur]
```

**Note pipeline IA :** Ce message est généré automatiquement depuis le livrable "Boost Mandat" en utilisant les données de la recherche outbound (annonce trouvée sur SeLoger/LeBonCoin + réécriture via pipeline ImmoCrew).

---

### DM-02 — Message 2 (J+3) : relance douce

**Objet :** Question ouverte, pas de pitch
**Longueur :** 4-6 lignes

```
Salut {{prenom_prospect}},

Je t'avais envoyé une version réécrite de ton annonce jeudi — tu as eu l'occasion de la voir ?

Curieux de savoir ce que tu en penses. Est-ce que ça ressemble à ce que tu fais d'habitude, ou c'est vraiment différent de ton approche ?

Bonne semaine !
[Prénom fondateur]
```

---

### DM-03 — Message 3 (J+7) : proposition directe, pas de relance après

**Objet :** Offre claire, pas d'insistance
**Longueur :** 5-7 lignes

```
Salut {{prenom_prospect}},

Dernière fois que je t'écris — promis.

Si tu cherches à avoir des posts, des articles et des annonces personnalisées pour {{ville_prospect}} chaque mois sans y passer de temps, c'est ce qu'on fait chez ImmoCrew.

197€/mois, sans engagement. Premier mois : tu vois les livrables, tu décides si tu continues.

Si ça t'intéresse : immocrew.fr — ou réponds ici et je t'explique en 5 minutes.

Bonne continuation !
[Prénom fondateur]
```

---

## SECTION 6 — WORKFLOW D'AUTOMATISATION IA

> Cette section documente comment le pipeline IA génère chaque template automatiquement.
> Objectif : zéro production manuelle régulière — tout est automatisé ou semi-automatisé.

---

### 6.1 Pipeline de génération mensuelle (Pack Mensuel)

**Déclencheur :** 1er du mois, automatique pour chaque client actif

| Étape | Action IA | Template source | Output |
|-------|-----------|----------------|--------|
| 1 | Lecture du profil onboarding | Variables `{{prenom}}`, `{{zone_geo}}`, `{{quartier}}`, `{{specialite}}` | Brief personnalisé |
| 2 | Génération 12 posts LinkedIn/Instagram | LK-01, LK-02, LK-03, IG-01, IG-02, IG-03 | 12 posts avec variables remplacées |
| 3 | Génération 4 scripts Reels | IG-02, IG-04 | 4 scripts voix off |
| 4 | Génération 2 articles SEO | Templates SEO (docs/seo/) | 2 articles avec données locales |
| 5 | Génération 4 annonces personnalisées | LK-04 + template annonce | 4 annonces hyper-locales |
| 6 | Génération 1 newsletter | Template newsletter (docs/copy/) | 1 newsletter prête |
| 7 | Stockage dans espace client | Route `/api/generate/pack-mensuel` | Dashboard client mis à jour |

**Prompt système (à compléter dans `src/lib/prompts/social-post.ts`) :**

```
Tu es un expert en marketing immobilier pour mandataires indépendants en France.
Tu rédiges des posts pour {{prenom}}, mandataire {{reseau}} spécialisé {{specialite}} dans la zone {{zone_geo}} / quartier {{quartier}}.

Règles absolues :
- Tutoiement systématique (pas de "vous")
- Zéro jargon marketing (pas de "funnel", "KPI", "lead", "ROI")
- Données locales réelles : cite {{ecole_proche}}, {{transport_proche}}, {{prix_m2_zone}}
- Ton : comme un collègue qui aide, direct, bienveillant
- L'IA est invisible : jamais de mention "IA", "généré", "algorithme"
- CTA court : 3-6 mots, à la 1re personne si possible

Format de sortie : [voir template correspondant]
```

---

### 6.2 Pipeline outbound DM (outreach hebdomadaire)

**Déclencheur :** Jeudi matin, semi-automatique (validation fondateur avant envoi)

| Étape | Action | Template | Automatisation |
|-------|--------|---------|---------------|
| 1 | Scraping mandataires actifs LinkedIn | — | Manuel (recherche LinkedIn filtrée) |
| 2 | Récupération d'une annonce par prospect | — | Manuel ou semi-auto (recherche SeLoger) |
| 3 | Réécriture annonce | Prompt réécriture Claude | Automatique via `/api/generate/boost-mandat` (reecriture d'annonce) |
| 4 | Génération DM-01 personnalisé | DM-01 template | Automatique — variables remplacées |
| 5 | Validation + envoi | — | Manuel (validation fondateur, envoi LinkedIn) |
| 6 | Relance J+3 (DM-02) | DM-02 template | Rappel automatique dans dashboard |
| 7 | Relance J+7 (DM-03) | DM-03 template | Rappel automatique dans dashboard |

---

### 6.3 Règles d'adaptation par plateforme (pipeline IA)

Le même angle de contenu est décliné automatiquement sur 3 formats :

| Angle source | LinkedIn | Instagram | YouTube Short |
|-------------|----------|-----------|--------------|
| Article SEO publié | Carrousel 5 slides (LK-02) | Quote visuel (IG-03) | Script 30 sec (IG-02) |
| Témoignage client | Post texte (LK-01) | Carrousel avant/après (IG-01) | Reel avant/après (IG-04) |
| Tip conseil | Post texte court (LK-02) | Reel conseil (IG-02) | Short YouTube |
| Annonce bien | Post image + texte (LK-04) | Carrousel annonce (IG-01 adapté) | — |

**Instruction pipeline :** pour chaque livrable mensuel, le pipeline génère automatiquement les 3 déclinaisons depuis l'angle central. Un seul brief client alimente 3 formats.

---

## Checklist de validation avant publication

Basée sur la checklist brand-voice.md, adaptée au social :

- [ ] Tutoiement partout — aucun "vous"
- [ ] Aucun jargon marketing (funnel, KPI, ROI, leads, optimiser)
- [ ] IA invisible — pas de mention "IA", "généré", "algorithme"
- [ ] Au moins une donnée locale réelle (nom de quartier, école, transport, prix m²)
- [ ] Hook en ouverture — les 2 premières lignes donnent envie de lire la suite
- [ ] CTA clair en fin de post — une seule action demandée
- [ ] Longueur adaptée à la plateforme (LinkedIn < 1 300 car, Instagram 150-300 mots)
- [ ] Hashtags conformes (3-5 sur LinkedIn, 20-25 sur Instagram, toujours `#mandataireimmobilier`)
- [ ] Variables `{{...}}` toutes remplacées — aucune variable visible dans le post final
- [ ] Relecture à voix haute — si ça sonne bizarre, reformuler

---

## Hypothèses à valider

- [HYPOTHÈSE : Les hooks "résultat concret en ouverture" (LK-01 Version A) performent mieux que les hooks "problème" (Version B) sur LinkedIn pour cette audience. À tester avec A/B sur les 4 premières semaines.]
- [HYPOTHÈSE : 20-25 hashtags Instagram est optimal en 2025. À valider avec les analytics Instagram Insights après mois 1.]
- [HYPOTHÈSE : Les stories séquence 3 slides (ST-01) génèrent plus de trafic vers le post que le partage simple. À mesurer via les insights stories.]

---

**Handoff → @copywriter**

Fichiers produits :
- `/home/user/Mandataire-Immo/docs/social/content-templates.md`

Décisions prises :
- 4 templates LinkedIn produits (LK-01 témoignage, LK-02 conseil/carrousel, LK-03 coulisses, LK-04 annonce bien)
- 4 templates Instagram produits (IG-01 carrousel avant/après, IG-02 Reel conseil, IG-03 quote, IG-04 Reel coulisses)
- 4 templates Stories produits (ST-01 relais post, ST-02 coulisses, ST-03 témoignage, ST-04 engagement)
- 4 templates Facebook groupes produits (FB-01 à FB-04 — valeur pure, ratio 10:1 aide/promo)
- 3 templates DM LinkedIn outbound (DM-01 à DM-03 — séquence J0/J+3/J+7)
- Workflow d'automatisation IA documenté (pipeline mensuel, pipeline outbound DM, règles de déclinaison multi-formats)
- Variables `{{...}}` standardisées et alignées avec le profil onboarding client
- Tutoiement systématique, zéro jargon, IA invisible — conforme brand-voice.md

Points d'attention :
- Les stats "réelles" dans certains templates (taux de réponse, nombre de mandats) doivent être remplies avec les vraies données au moment de la publication — jamais inventées
- La séquence DM-03 est un message de clôture : pas de relance après, même si pas de réponse
- Les templates Facebook groupes ne sont pas des posts de marque — le fondateur poste en son nom propre, ImmoCrew n'est mentionné qu'en mention naturelle après 3-4 interactions d'aide
- Le prompt système de la section 6.1 est une V1 à affiner avec les retours des premiers livrables générés
- `@legal` doit valider l'anonymisation des captures d'écran dans ST-03 (droit à l'image, données personnelles)
- Les routes `/api/generate/pack-mensuel` et `/api/generate/boost-mandat` sont deja implementees — les workflows 6.1 et 6.2 peuvent les utiliser directement
