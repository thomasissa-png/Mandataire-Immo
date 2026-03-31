# Audit Marc — Session 10

## Qui je suis
Marc Lefebvre, 42 ans, cadre commercial à Angers. Je suis propriétaire d'un T4 que j'envisage de vendre. Sophie m'a partagé un lien WhatsApp. Je ne la connais pas encore — je suis en train d'évaluer si elle est sérieuse.

---

## Score global : 7/10 — GO CONDITIONNEL

---

## Par output

| Output | Score | GC PASS/FAIL | Commentaire terrain |
|--------|-------|--------------|---------------------|
| Page annonce partagée `/annonce/[token]` | 8/10 | GC1 PASS, GC2 PASS, GC3 PASS, GC4 PASS, GC5 FAIL, GC6 FAIL, GC7 PASS, GC8 PASS | La page est propre, lisible, bouton d'appel visible en haut. Bon. Mais il n'y a pas de photo du bien — juste du texte. Je clique sur un lien WhatsApp et je vois du markdown rendu sans aucune image. Ce n'est pas comme ça que je cherche un appartement. Sans photo, la crédibilité s'effondre immédiatement. Le footer "Annonce générée par ImmoCrew" m'interroge : Sophie n'a pas rédigé elle-même son annonce ? C'est transparent mais ça donne une impression d'annonce industrielle. |
| Page mandataire `/agent/[slug]` | 7/10 | GC1 PASS, GC2 PASS, GC3 PASS, GC4 PASS, GC5 FAIL, GC6 PASS, GC7 PASS, GC8 PASS | Première impression correcte : photo (ou initiales), nom, réseau, ville, bouton appel en haut de page. La section "Ma méthode" avec les étapes numérotées rassure. La section témoignages est bien si elle est remplie. Problème majeur : si Sophie n'a pas saisi ses méthode_etapes, on affiche des étapes génériques par défaut ("Estimation gratuite et personnalisée de ton bien", etc.) — du coup sa page ressemble à celle de n'importe quel autre mandataire. Deuxième problème : aucune date de transaction, aucun bien vendu dans le passé visible. Je vois "Mes biens en vente" mais si la liste est vide, j'ai un message "Pas de bien en vente actuellement". Ca fait mandataire qui ne travaille pas. |
| Blog `/blog` + `/blog/[slug]` | 7/10 | GC1 PASS, GC2 PASS, GC3 PASS, GC4 FAIL, GC5 PASS, GC6 PASS, GC7 PASS, GC8 PASS | Le titre "Le marketing immobilier, sans les prises de tête" ne me parle pas directement — ça s'adresse à Sophie, pas à moi. Si Sophie partage un article sur "comment vendre son bien à Angers", ça peut m'être utile. Mais le blog est clairement positionné pour les mandataires, pas pour les vendeurs. Je ne m'identifie pas dans le contenu. Le CTA en bas d'article "Tu veux que ton marketing soit fait pour toi ?" confirme que ce site ne me parle pas — ça parle à Sophie. Ça ne m'incite pas à contacter Sophie pour vendre mon bien. |
| Landing page `/` | 6/10 | GC1 PASS, GC2 FAIL, GC3 FAIL, GC4 FAIL, GC5 PASS, GC6 N/A, GC7 FAIL, GC8 PASS | Je tombe sur ce site par curiosité après avoir reçu le lien de Sophie. Je comprends en quelques secondes que ce site vend un service de marketing aux mandataires — pas un service aux vendeurs. Je ne suis pas du tout la cible. La confusion est nulle (c'est bien) mais il n'y a rien pour moi. Aucun signal que Sophie est une vraie professionnelle digne de confiance pour VENDRE MON BIEN. Si je cherche à évaluer Sophie et que j'atterris sur immocrew.fr, je sors avec l'information "Sophie utilise un service de marketing externalisé" — est-ce rassurant ou inquiétant ? Cinquante-cinquante selon le profil. |

---

## Gates GC globales

| Gate | PASS/FAIL | Justification |
|------|-----------|---------------|
| GC1 Professionnalisme | PASS | La page annonce et la page mandataire sont visuellement propres, pas cheapes. La charte bleu marine / orange est cohérente et sérieuse. |
| GC2 Pertinence | FAIL | Le blog s'adresse aux mandataires, pas aux vendeurs. La landing page aussi. Sophie partage des contenus qui ne me parlent pas directement. Si je cherche de l'info pour vendre mon bien, je suis à côté. |
| GC3 Confiance | PASS partiel | La page mandataire donne confiance SI Sophie l'a bien remplie (bio, témoignages, méthode personnalisée). Mais avec les contenus par défaut, ça fait vide. |
| GC4 Action | FAIL partiel | Page annonce : OUI, j'appelle si le bien m'intéresse et s'il y a une photo. Page mandataire : OUI si bio et témoignages sont présents. Blog et landing page : NON, rien ne m'incite à contacter Sophie pour vendre mon bien. |
| GC5 Complétude | FAIL | Pas de photo sur la page annonce — information critique manquante pour un bien immobilier. Section biens vides = doute sur l'activité réelle. |
| GC6 Différenciation | PASS conditionnel | La page mandataire peut différencier Sophie si ses vraies étapes de méthode et ses vrais témoignages sont remplis. Les valeurs en badges aident. Par défaut, c'est générique. |
| GC7 Ton et registre | PASS partiel | Tutoiement sur la landing page = adapté pour Sophie cliente. Mais pour moi en tant que prospect vendeur sur la page annonce et la page mandataire, le ton est correct (vouvoiement implicite, neutre). |
| GC8 Zéro erreur factuelle | PASS | Rien d'inventé, pas de chiffre gonflé visible, les informations affichées dépendent des données renseignées par Sophie. |

---

## Ce qui fonctionne bien

- Le bouton "Appeler" en haut de la page annonce ET en haut de la page mandataire : je ne cherche pas, je contacte direct
- La section "Ma méthode" avec les étapes numérotées : ça structure, ça rassure sur le processus
- La section témoignages : quand elle est remplie, c'est la partie la plus convaincante pour moi
- Le footer de la page annonce qui dit "Annonce de Sophie, générée par ImmoCrew" : au moins c'est honnête, on ne me ment pas
- La page mandataire est construite pour le SEO local ("Mandataire IAD à Angers — Sophie Dupont") : si je cherche sur Google, je peux la trouver

## Ce qui me pose problème

1. **Pas de photo sur la page annonce** : c'est le deal-breaker numéro un. Une annonce immobilière sans photo en 2026, ça ne se fait pas. Je pense que c'est un bug ou que Sophie n'a pas joint de visuels.

2. **Section biens en vente vide** : "Pas de bien en vente actuellement" sur la page mandataire = mandataire sans activité visible. Même si ce n'est pas le cas, la perception est mauvaise.

3. **Le blog ne m'aide pas à décider de confier mon bien à Sophie** : les articles parlent de marketing pour mandataires. Si je suis un vendeur, je veux des articles sur "comment estimer son bien à Angers" ou "les 5 erreurs à éviter pour vendre rapidement". Rien de tout ça.

4. **La landing page immocrew.fr révèle que Sophie sous-traite son marketing** : pour certains prospects comme moi, ça peut semer un doute — "est-ce que Sophie maîtrise vraiment son activité ou elle délègue tout ?"

5. **Pas de section "Biens vendus récemment"** : je ne peux pas évaluer le track record de Sophie. Des chiffres comme "12 ventes en 2025 dans le secteur d'Angers-Sud" me rassureraient bien plus que des valeurs génériques.

## Ma réaction honnête

Je reçois le lien de Sophie sur WhatsApp. Je clique, je vois une page propre, le titre du bien, le prix, les caractéristiques. Mais pas de photo. Je scrolle, je lis le texte — l'annonce est bien rédigée, descriptive, avec des détails sur le quartier. C'est mieux que les annonces habituelles sur SeLoger. Je clique sur "Appeler" — ça, ça marche bien.

Ensuite je cherche Sophie sur Google. Je tombe sur sa page /agent. Première impression : c'est pro, c'est mieux qu'un simple profil IAD générique. La photo (ou les initiales), le nom, le réseau, la ville. Je lis la bio — si c'est bien rédigé, je suis rassuré. Je vois les étapes de sa méthode. J'essaie de trouver ses biens en vente — vide. Ça refroidit.

Je remonte sur la landing page ImmoCrew par curiosité. Je comprends que c'est le service qui génère le contenu de Sophie. Je ne suis pas choqué, mais je me pose la question : est-ce que Sophie est vraiment experte ou est-ce qu'une IA écrit pour elle ? Ce n'est pas bloquant pour moi mais pour d'autres vendeurs plus traditionnels, ça peut l'être.

Conclusion : si Sophie me rappelle et que l'entretien se passe bien, je prends rendez-vous. Mais la page seule ne me convainc pas encore de lui confier mon bien exclusivement.

---

## Verdict : GO CONDITIONNEL

Les pages sont techniquement solides et visuellement crédibles. Deux corrections critiques pour passer à GO :
1. La page annonce DOIT afficher les photos du bien — sans elles, l'annonce ne sert à rien pour un acheteur
2. La page mandataire doit afficher soit des biens actifs, soit des biens vendus récemment — une page vide nuit à la crédibilité de Sophie

---

**Handoff → @fullstack, @ux**
- Fichier produit : `/docs/reviews/marc-audit-session10.md`
- Correction prioritaire 1 (P0) : Implémenter l'affichage des photos dans `/annonce/[token]/page.tsx` — si `metadata` ou le contenu contient des URLs d'images, les afficher en galerie au-dessus du texte
- Correction prioritaire 2 (P1) : Ajouter une section "Biens récemment vendus" sur `/agent/[slug]` quand la liste biens actifs est vide, ou afficher un compteur de transactions passées visible
- Si verdict = GO CONDITIONNEL : corriger les 2 points ci-dessus et resoumettre pour validation
