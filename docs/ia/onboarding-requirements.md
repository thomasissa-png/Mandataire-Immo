# Onboarding Requirements -- Donnees necessaires par prompt

> Par @ia | 2026-03-25
> Ce document liste toutes les informations necessaires pour que les 10 prompts produisent des livrables de qualite 9-10/10.
> Chaque champ est classe en obligatoire, facultatif, ou recurrent (a collecter regulierement).

---

## Infos obligatoires (a demander a l'onboarding)

| Champ | Pourquoi | Quel prompt l'utilise | Etape onboarding |
|-------|----------|-----------------------|------------------|
| `prenom` | Personnalisation de tous les livrables, signature | Tous les 10 prompts | Etape 1 - Identite |
| `nom` | Signature, bio, email | Tous les 10 prompts | Etape 1 - Identite |
| `reseau` | Terminologie correcte (IAD, SAFTI, etc.), mention legale | Tous les 10 prompts | Etape 1 - Identite |
| `email_contact` | Signature emails, CTA landing, liens mailto reels (zero placeholder) | email-prospection, landing-bien, annonce-storytelling | Etape 1 - Identite |
| `telephone_contact` | CTA appel, signature, liens tel: reels | email-prospection, landing-bien, annonce-storytelling | Etape 1 - Identite |
| `annees_experience` | Eviter l'erreur critique "5 ans" au lieu de "2 ans" -- chiffre exact injecte | post-social, article-seo, script-video, newsletter, email-prospection, positioning, bio, editorial-calendar | Etape 1 - Identite |
| `zone_geo.ville` | Ancrage local de tous les contenus | Tous les 10 prompts | Etape 2 - Zone |
| `zone_geo.departement` | Contexte geographique | Tous les 10 prompts | Etape 2 - Zone |
| `zone_geo.quartiers[]` | Hyper-localisation des posts, articles, annonces | Tous les 10 prompts | Etape 2 - Zone |
| `specialite` | Adaptation du ton et des sujets (ancien, neuf, investissement, etc.) | Tous les 10 prompts | Etape 2 - Zone |
| `ton` | Calibration du style de redaction | Tous les 10 prompts | Etape 3 - Communication |
| `valeurs` | Piliers de differenciation, positionnement | post-social, positioning, bio, newsletter | Etape 3 - Communication |
| `ce_qui_differencie` | Argument central du positionnement, bio, posts | post-social, positioning, bio, email-prospection | Etape 3 - Communication |
| `cible_clients` | Adaptation des contenus au public vise | Tous sauf landing-bien | Etape 3 - Communication |
| `nb_transactions_an` | Credibilite, volume affiche | post-social, article-seo, script-video, newsletter, email-prospection, positioning, bio | Etape 3 - Communication |
| `gamme_prix` | Coherence des exemples de prix dans les contenus | post-social, article-seo, annonce-storytelling, newsletter, email-prospection, positioning, bio | Etape 3 - Communication |

---

## Infos facultatives (ameliorent la qualite)

| Champ | Pourquoi | Quel prompt l'utilise | Etape onboarding |
|-------|----------|-----------------------|------------------|
| `donnees_locales.prix_m2_moyen` | Chiffre du mois newsletter, articles SEO, credibilite locale | post-social, article-seo, annonce-storytelling, newsletter, email-prospection, editorial-calendar, landing-bien | Etape 4 - Donnees locales |
| `donnees_locales.commerces[]` | References hyper-locales dans les posts et annonces (evite l'invention) | post-social, article-seo, annonce-storytelling, script-video, editorial-calendar, landing-bien | Etape 4 - Donnees locales |
| `donnees_locales.ecoles[]` | Argument "familles" dans les annonces et articles | post-social, article-seo, annonce-storytelling, script-video, editorial-calendar, landing-bien | Etape 4 - Donnees locales |
| `donnees_locales.transports[]` | Accessibilite dans les annonces, coherence inter-livrables (arret tramway) | post-social, article-seo, annonce-storytelling, script-video, editorial-calendar, landing-bien | Etape 4 - Donnees locales |
| `donnees_locales.ambiance_quartier` | Ton des descriptions de quartier dans les annonces et landing | annonce-storytelling, landing-bien, editorial-calendar | Etape 4 - Donnees locales |
| `histoire.parcours_avant_immo` | Storytelling du positionnement, bio generale, newsletter edito | positioning, bio-multiformat, newsletter | Etape 5 - Histoire |
| `histoire.pourquoi_immobilier` | Motivation personnelle dans la bio et le positionnement | positioning, bio-multiformat, newsletter | Etape 5 - Histoire |
| `histoire.anecdote_memorable` | Humanisation dans les bios, edito newsletter, posts coulisses | positioning, bio-multiformat, newsletter | Etape 5 - Histoire |
| `confort_camera` | Adaptation des scripts video (diaporama vs face camera) | script-video | Etape 5 - Histoire |
| `reseaux_sociaux.instagram` | Lien dans les bios, posts, CTA | post-social, bio-multiformat, editorial-calendar, landing-bien | Etape 6 - Presence en ligne |
| `reseaux_sociaux.facebook` | Lien dans les bios, posts | post-social, bio-multiformat, editorial-calendar, landing-bien | Etape 6 - Presence en ligne |
| `reseaux_sociaux.linkedin` | Lien dans les bios, posts pro | post-social, bio-multiformat, editorial-calendar | Etape 6 - Presence en ligne |
| `reseaux_sociaux.site_web` | CTA articles SEO, bio, newsletter | article-seo, bio-multiformat, newsletter, email-prospection | Etape 6 - Presence en ligne |
| `biens[].dpe` | Mention legale obligatoire depuis 2021 dans les annonces | annonce-storytelling, landing-bien | A chaque ajout de bien |
| `certifications[]` | Credibilite dans les bios (Google Business, LinkedIn) | bio-multiformat | Etape 5 - Histoire |
| `langues[]` | Mention dans les bios si pertinent (zone touristique) | bio-multiformat | Etape 5 - Histoire |
| `couleur_principale` | Personnalisation visuelle de la landing page | landing-bien | Etape 6 - Presence en ligne |
| `couleur_accent` | Personnalisation visuelle des CTA landing page | landing-bien | Etape 6 - Presence en ligne |

---

## Infos a demander regulierement (pas a l'onboarding mais chaque mois)

| Champ | Pourquoi | Frequence |
|-------|----------|-----------|
| `biens[]` (mise a jour) | Biens en vente pour les posts, annonces, scripts video, newsletter "bien du mois" | A chaque nouveau mandat / vente |
| `anecdote_mois` | Edito personnalise de la newsletter -- sans ca, l'IA invente une anecdote generique | Mensuel (avant generation newsletter) |
| `sujets_prioritaires` | Orienter les posts et le calendrier editorial sur les sujets importants du moment | Mensuel |
| `historique_sujets` | Eviter les repetitions dans les posts et newsletters | Auto-alimente par le systeme |
| `evenements_locaux` | Integrer les evenements du quartier dans le calendrier editorial | Mensuel |
| `resultats_recents` | Argument de credibilite dans l'email prospection ("3 ventes ce trimestre") | Trimestriel |
| `bien_du_mois` | Mise en avant prioritaire dans la newsletter | Mensuel |
| `donnees_locales.tendance_marche` | Actualisation du chiffre du mois newsletter + articles SEO marche | Trimestriel |
| `donnees_locales.prix_m2_moyen` | Les prix evoluent -- le chiffre doit rester a jour | Semestriel |

---

## Parcours onboarding recommande

### Etape 1 - Identite (obligatoire, 2 min)
- Prenom, nom, reseau, email, telephone, annees d'experience

### Etape 2 - Zone (obligatoire, 2 min)
- Ville, departement, quartiers de reference, specialite

### Etape 3 - Communication (obligatoire, 3 min)
- Ton de communication (choix parmi presets), valeurs, ce qui differencie, cible clients, nb transactions/an, gamme de prix

### Etape 4 - Donnees locales (facultatif mais fortement recommande, 5 min)
- Prix m2 moyen, commerces de reference (3-5), ecoles (2-3), transports (2-3), ambiance quartier
- **Impact** : sans ces donnees, les livrables restent generaux au lieu d'etre hyper-localises. C'est la difference entre un livrable note 7/10 et 9/10.

### Etape 5 - Histoire personnelle (facultatif, 3 min)
- Parcours avant l'immo, pourquoi l'immobilier, anecdote memorable, confort camera
- **Impact** : sans ces donnees, le positionnement et la bio sont generiques. Avec, ils sont authentiques et differenciants.

### Etape 6 - Presence en ligne (facultatif, 1 min)
- Liens Instagram, Facebook, LinkedIn, site web
- Couleurs preferees (si pertinent)

### Etape 7 - Biens en cours (si applicable, 5 min par bien)
- Pour chaque bien : titre, type, adresse, prix, surface, pieces, points forts, DPE

---

## Matrice champ x prompt

| Champ | post-social | annonce | article-seo | script-video | newsletter | email | positioning | bio | calendrier | landing |
|-------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| prenom/nom | x | x | x | x | x | x | x | x | x | x |
| reseau | x | x | x | x | x | x | x | x | x | x |
| email_contact | | x | | | | x | | | | x |
| telephone_contact | | x | | | | x | | | | x |
| annees_experience | x | | x | x | x | x | x | x | x | |
| zone_geo | x | x | x | x | x | x | x | x | x | x |
| ton | x | x | x | x | x | x | x | x | x | x |
| valeurs | x | | | | | | x | x | x | |
| ce_qui_differencie | x | x | x | x | x | x | x | x | x | |
| donnees_locales | x | x | x | x | x | x | x | | x | x |
| histoire | | | | | x | | x | x | | |
| confort_camera | | | | x | | | | | | |
| biens[] | x | x | x | x | x | x | x | x | x | x |
| biens[].dpe | | x | | | | | | | | x |
| anecdote_mois | | | | | x | | | | | |

---

*Document produit par @ia -- 2026-03-25*
