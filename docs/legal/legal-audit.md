# Audit Juridique — ImmoCrew

> Date : 2026-03-25 | Auteur : Agent juridique | Statut : V1
> Ce document est un cadrage juridique actionnable. Il ne remplace pas un avis d'avocat.

---

## 1. RGPD — Conformité au Règlement Général sur la Protection des Données

### 1.1 Données collectées et base légale par traitement

ImmoCrew collecte des données de **professionnels** (B2B) et non de consommateurs finaux. Les personnes concernées sont les mandataires immobiliers clients.

| Traitement | Données | Base légale (Art. 6 RGPD) | Justification |
|------------|---------|---------------------------|---------------|
| Création de compte / authentification | Nom, prénom, email, mot de passe (hashé via Clerk) | **Exécution du contrat** (Art. 6.1.b) | Nécessaire pour fournir le service souscrit |
| Facturation et paiement | Nom, email, données bancaires (gérées par Stripe, non stockées chez nous) | **Obligation légale** (Art. 6.1.c) + Exécution du contrat | Obligation comptable et fiscale française (conservation 10 ans) |
| Onboarding / questionnaire client | Zone géographique, spécialité immobilière, ton de communication, URL réseaux sociaux, photo/logo | **Exécution du contrat** (Art. 6.1.b) | Données nécessaires à la personnalisation des livrables marketing |
| Génération de contenu via Claude API | Données du questionnaire transmises à l'API Anthropic | **Exécution du contrat** (Art. 6.1.b) | Production des livrables constitutifs du service |
| Analytics (PostHog) | Données de navigation anonymisées, événements d'usage | **Intérêt légitime** (Art. 6.1.f) | Amélioration du service. Impact minimal sur les droits des personnes (données professionnelles, anonymisées) |
| Prospection commerciale (email, LinkedIn) | Nom, prénom, email professionnel, réseau d'affiliation | **Intérêt légitime** (Art. 6.1.f) | Prospection B2B autorisée sans consentement préalable en France (Art. L.34-5 CPCE), avec opt-out obligatoire |
| Cookies essentiels (authentification) | Identifiants de session | **Exécution du contrat** (Art. 6.1.b) | Cookies strictement nécessaires — pas de consentement requis |
| Cookies analytics (PostHog) | Identifiants anonymes | **Consentement** (Art. 6.1.a) | Cookies non essentiels — bandeau de consentement obligatoire |

**Point important** : aucune donnée sensible au sens de l'Art. 9 RGPD n'est collectée (pas de données de santé, opinions politiques, données biométriques, etc.). Aucune donnée financière des clients finaux des mandataires n'est traitée.

### 1.2 Inventaire des sous-traitants (Article 28 RGPD)

Un **contrat de sous-traitance** (Data Processing Agreement — DPA) doit être signé avec chaque sous-traitant avant mise en production.

| Sous-traitant | Rôle | Localisation données | DPA disponible | Transfert hors UE | Action requise |
|---------------|------|---------------------|----------------|-------------------|----------------|
| **Supabase** (PostgreSQL) | Hébergement BDD (comptes, questionnaires, livrables) | Région UE disponible (Francfort, `eu-central-1`) | Oui, sur demande | Non si région EU sélectionnée | **ACTION** : sélectionner la région EU (Francfort) à la création du projet Supabase. Signer le DPA via le dashboard Supabase (Settings > Legal). |
| **Clerk** | Authentification, gestion des sessions | USA (AWS us-east-1 par défaut) | Oui, inclus dans les ToS | **Oui — USA** | **ACTION** : vérifier que Clerk s'appuie sur les Standard Contractual Clauses (SCC) post-Schrems II. Le DPA de Clerk inclut les SCC. Mentionner ce transfert dans la politique de confidentialité. *À vérifier avec un juriste : adéquation des garanties post-Data Privacy Framework.* |
| **Stripe** | Paiement, facturation | UE (Irlande) pour les données de clients européens | Oui, automatique | Non pour les données de paiement UE | **ACTION** : le DPA Stripe est automatiquement accepté via les ToS. Vérifier le paramétrage du compte Stripe sur l'entité Stripe Payments Europe Ltd. |
| **Replit** (hébergement) | Hébergement de l'application Next.js | USA | DPA disponible sur demande | **Oui — USA** | **ACTION** : demander le DPA à Replit (support@replit.com). Vérifier les SCC. Mentionner ce transfert dans la politique de confidentialité. *À vérifier avec un juriste : si risque jugé trop élevé, envisager migration vers Vercel (EU region) ou un hébergeur EU.* |
| **Anthropic** (Claude API) | Traitement IA — génération de contenu | USA | DPA disponible (API Terms) | **Oui — USA** | **ACTION** : accepter le DPA Anthropic (inclus dans les API Terms of Service). Les données envoyées via l'API ne sont PAS utilisées pour l'entraînement (politique Anthropic API depuis 2024). Mentionner ce transfert. Documenter que seules des données professionnelles non sensibles sont transmises. |
| **PostHog** | Analytics | UE (Francfort) si instance EU Cloud choisie | Oui | Non si EU Cloud | **ACTION** : sélectionner PostHog EU Cloud (eu.posthog.com). Signer le DPA via le dashboard. |

**Synthèse transferts hors UE** : Clerk, Replit et Anthropic impliquent des transferts vers les USA. Garanties : Standard Contractual Clauses (SCC) + EU-US Data Privacy Framework (si le sous-traitant est certifié). Ces transferts doivent être documentés dans la politique de confidentialité et dans le registre des traitements.

### 1.3 Durées de conservation

| Catégorie de données | Durée de conservation | Fondement |
|---------------------|----------------------|-----------|
| Données de compte (nom, email, profil) | Durée de la relation contractuelle + 3 ans après résiliation | Prescription civile (actions contractuelles) |
| Données de facturation | 10 ans après la clôture de l'exercice | Obligation comptable (Art. L.123-22 Code de commerce) |
| Livrables produits | Durée de la relation contractuelle + 1 an | Exécution du contrat + période de réclamation |
| Données d'onboarding (questionnaire) | Durée de la relation contractuelle. Suppression sous 30 jours après résiliation | Plus de finalité après fin du contrat |
| Logs de connexion | 1 an | Obligation LCEN (Art. 6 II) |
| Données analytics (PostHog) | 25 mois maximum | Recommandation CNIL |
| Données de prospection B2B | 3 ans après le dernier contact | Recommandation CNIL |

**ACTION** : implémenter une procédure automatique de purge des données à chaque résiliation client (script Supabase ou cron job).

### 1.4 Droits des personnes concernées

Les clients disposent des droits suivants (Articles 15 à 22 RGPD). **Chaque droit doit avoir un canal d'exercice identifié.**

| Droit | Applicable | Canal | Délai de réponse |
|-------|-----------|-------|------------------|
| **Accès** (Art. 15) | Oui | Email à dpo@immocrew.fr | 1 mois max |
| **Rectification** (Art. 16) | Oui | Email ou directement dans l'espace client | 1 mois max |
| **Effacement** (Art. 17) | Oui (hors obligations légales de conservation) | Email à dpo@immocrew.fr | 1 mois max |
| **Limitation** (Art. 18) | Oui | Email à dpo@immocrew.fr | 1 mois max |
| **Portabilité** (Art. 20) | Oui (données fournies par le client, format JSON/CSV) | Email à dpo@immocrew.fr | 1 mois max |
| **Opposition** (Art. 21) | Oui (prospection : opposition immédiate) | Lien de désinscription dans chaque email | Immédiat pour prospection, 1 mois sinon |

**ACTIONS** :
1. Créer l'adresse email dpo@immocrew.fr (ou privacy@immocrew.fr) avant lancement
2. Préparer un script d'export des données client au format JSON (pour le droit de portabilité)
3. Préparer un script de suppression complète (compte + données Supabase + demande de suppression aux sous-traitants)
4. Documenter la procédure interne de traitement des demandes (qui traite, sous quel délai, traçabilité)

### 1.5 Actions RGPD à mener avant lancement

| # | Action | Priorité | Statut |
|---|--------|----------|--------|
| 1 | **Rédiger la Politique de Confidentialité** et la publier sur le site (page dédiée, lien en footer) | Critique | À faire |
| 2 | **Créer le Registre des Traitements** (Art. 30 RGPD) — document interne listant tous les traitements décrits ci-dessus | Critique | À faire |
| 3 | **Signer les DPA** avec chaque sous-traitant (voir tableau 1.2) | Critique | À faire |
| 4 | **Configurer les régions EU** pour Supabase (Francfort) et PostHog (EU Cloud) | Haute | À faire |
| 5 | **Implémenter un bandeau de consentement cookies** (pour PostHog analytics). Outil recommandé : Tarteaucitron.js (gratuit, open source, conforme CNIL) | Haute | À faire |
| 6 | **Créer l'adresse DPO** (dpo@immocrew.fr) | Haute | À faire |
| 7 | **Ajouter les mentions d'information** dans le formulaire d'onboarding (finalité, durée, droits, destinataires) | Haute | À faire |
| 8 | **Analyse d'impact (AIPD/DPIA)** : non obligatoire a priori (pas de traitement à grande échelle de données sensibles, pas de profilage). *À vérifier avec un juriste si l'utilisation d'IA générative pour traiter des données professionnelles déclenche une obligation DPIA selon les critères CNIL.* | Moyenne | À évaluer |
| 9 | **Désignation d'un DPO** : non obligatoire (pas d'autorité publique, pas de traitement à grande échelle). Recommandé : désigner un point de contact interne. | Faible | Optionnel |

---

## 2. AI Act européen — Obligations de transparence

### 2.1 Classification du système IA selon le AI Act (Règlement UE 2024/1689)

Le AI Act est entré en vigueur le 1er août 2024, avec une application progressive (obligations de transparence : 2 août 2025, obligations complètes : 2 août 2026).

**Analyse de classification pour ImmoCrew :**

| Critère | Analyse | Résultat |
|---------|---------|----------|
| Risque inacceptable (Art. 5) | Pas de manipulation, scoring social, surveillance biométrique | **Non concerné** |
| Haut risque (Annexe III) | Pas d'emploi, crédit, justice, éducation, migration, infrastructure critique | **Non concerné** |
| Risque limité — Obligations de transparence (Art. 50) | Contenu généré par IA destiné à être publié | **Concerné** |
| IA à usage général (GPAI) — Art. 51-56 | ImmoCrew est un **déployeur** (utilisateur) de l'API Claude, pas un fournisseur de modèle. Les obligations GPAI incombent à Anthropic. | **Non concerné en tant que fournisseur** |

**Conclusion** : ImmoCrew est classé comme **déployeur d'un système IA à risque limité**. Les obligations principales sont des **obligations de transparence**.

### 2.2 Obligations concrètes

#### A. Obligation de transparence envers les clients (Art. 50.1)

> "Les fournisseurs veillent à ce que les systèmes d'IA destinés à interagir directement avec des personnes physiques soient conçus et développés de manière que les personnes concernées soient informées qu'elles interagissent avec un système d'IA."

**Application ImmoCrew** : les mandataires doivent savoir que le contenu est produit par IA.

**ACTIONS** :
1. **Sur le site / dans les CGV** : mentionner explicitement que les livrables sont produits à l'aide d'intelligence artificielle (Claude, Anthropic), avec relecture humaine avant livraison.
2. **Sur chaque livrable** : inclure une mention du type : *"Contenu produit avec assistance IA — relu et validé par l'équipe ImmoCrew."* Cette mention est destinée au mandataire client, pas à ses propres audiences.
3. **Dans le formulaire d'onboarding** : informer le client que ses données de profil sont transmises à un modèle IA (Anthropic Claude) pour la production des livrables.

#### B. Obligation de marquage du contenu IA (Art. 50.2)

> "Les fournisseurs de systèmes d'IA, y compris de systèmes d'IA à usage général, générant du contenu synthétique sous forme de [...] texte [...] veillent à ce que les sorties du système d'IA soient marquées dans un format lisible par machine et détectables comme ayant été générées ou manipulées par une IA."

**Analyse** : cette obligation vise les **fournisseurs** du modèle (Anthropic), pas les déployeurs. Anthropic doit s'assurer que les sorties de Claude sont marquables. Cependant, en tant que déployeur, ImmoCrew a une obligation de ne pas **supprimer activement** ces marquages s'ils existent.

**ACTIONS** :
1. Ne pas supprimer les métadonnées IA si elles sont ajoutées par Anthropic aux sorties.
2. *À vérifier avec un juriste : obligation éventuelle pour un déployeur de marquer les textes comme IA-generated avant publication sur les réseaux sociaux des clients. La question est : le mandataire qui publie un post rédigé par ImmoCrew doit-il mentionner que c'est rédigé par IA ?* La tendance réglementaire va vers plus de transparence. **Recommandation prudente** : laisser le choix au mandataire mais l'informer de l'obligation potentielle dans les CGV.

#### C. Obligation de supervision humaine

ImmoCrew prévoit déjà une **relecture humaine** de tous les livrables avant livraison. Cela constitue une bonne pratique conforme à l'esprit du AI Act.

**ACTION** : documenter le processus de relecture/QA dans une procédure interne (qui relit, quels critères de validation, traçabilité).

#### D. Obligation de littératie IA (Art. 4) — applicable depuis le 2 février 2025

> "Les fournisseurs et les déployeurs [...] prennent des mesures pour garantir, dans toute la mesure du possible, un niveau suffisant de littératie en matière d'IA."

**ACTION** : s'assurer que l'opérateur (fondateur) comprend les limites de l'IA générative (hallucinations, biais, erreurs factuelles). Documenter les garde-fous mis en place (prompts structurés, vérification des données locales, relecture humaine).

#### E. Synthèse AI Act — Risque faible, vigilance modérée

ImmoCrew est dans une position confortable : risque limité, contenu B2B (pas de manipulation de consommateurs vulnérables), relecture humaine systématique. Les obligations se résument essentiellement à de la **transparence** vis-à-vis des clients sur l'usage de l'IA.

---

## 3. CGV / CGU — Cadre contractuel

### 3.1 Points obligatoires pour un abonnement SaaS en France

ImmoCrew vend à des **professionnels** (B2B). Le Code de la consommation s'applique de manière limitée, mais certaines dispositions restent pertinentes. Les CGV doivent couvrir les points suivants :

| Clause | Contenu obligatoire | Fondement |
|--------|---------------------|-----------|
| **Identité du prestataire** | Nom/raison sociale, SIRET, adresse, email, n° TVA | Art. L.441-1 Code de commerce |
| **Description du service** | Détail précis de chaque offre (Pack Lancement, Pack Mensuel, Boost Mandat) avec livrables inclus, délais de livraison, format | Obligation d'information précontractuelle |
| **Prix et modalités de paiement** | Prix HT et TTC, devise, fréquence de facturation, moyens de paiement acceptés (Stripe), TVA applicable (20%) | Art. L.441-1 Code de commerce |
| **Durée et renouvellement** | Durée de l'abonnement (mensuel), conditions de renouvellement tacite, date limite de résiliation | Art. L.215-1 Code de la consommation (applicable aux pros depuis la loi Chatel) |
| **Résiliation** | Modalités de résiliation (email, espace client), préavis requis, conséquences (accès aux livrables passés) | Bonne pratique contractuelle |
| **Conditions de livraison** | Délais (24-48h pour livrables courants, J+7 pour Pack Lancement), format (PDF, texte, image), canal (espace client) | Art. L.216-1 et suivants |
| **Propriété intellectuelle** | Cession des droits sur les livrables au client après paiement. Le client est libre de publier, modifier, réutiliser. ImmoCrew conserve le droit de montrer les livrables en portfolio (sauf opposition). | Clarification indispensable |
| **Responsabilité et garanties** | Obligation de moyens (pas de résultat marketing garanti). Exclusion de responsabilité pour les résultats commerciaux. Plafond de responsabilité = montant des 3 derniers mois facturés. | Standard B2B |
| **Utilisation de l'IA** | Mention que les livrables sont produits avec assistance IA (cf. AI Act section 2). Relecture humaine avant livraison. | AI Act + transparence |
| **Données personnelles** | Renvoi vers la Politique de Confidentialité | RGPD Art. 13-14 |
| **Droit applicable et juridiction** | Droit français. Tribunal de commerce du siège social. | Clause standard B2B |
| **Médiation** | En B2B, pas d'obligation de médiation de la consommation. Mais clause de résolution amiable recommandée. | Bonne pratique |
| **Force majeure** | Définition et conséquences (suspension, résiliation sans indemnité) | Art. 1218 Code civil |
| **Modification des CGV** | Procédure de notification en cas de modification (email + délai de 30 jours) | Bonne pratique |

**ACTIONS** :
1. Rédiger les CGV en s'appuyant sur ce cadre. Faire relire par un juriste avant publication.
2. Prévoir un mécanisme d'acceptation des CGV lors de l'inscription (checkbox "J'ai lu et j'accepte les CGV" avec lien).
3. Conserver la preuve de l'acceptation (horodatage + version des CGV acceptées) dans Supabase.
4. Versionner les CGV (v1, v2...) et archiver chaque version.

### 3.2 Droit de rétractation (14 jours)

#### Contexte juridique

Le droit de rétractation de 14 jours (Art. L.221-18 Code de la consommation) s'applique aux contrats conclus **à distance** avec des **consommateurs**.

**Question clé** : les mandataires immobiliers indépendants sont-ils des consommateurs ou des professionnels ?

| Statut du mandataire | Analyse | Conséquence |
|---------------------|---------|-------------|
| Agent commercial inscrit au RSAC | **Professionnel** — le service est souscrit pour son activité professionnelle | Pas de droit de rétractation obligatoire |
| Micro-entrepreneur | **Professionnel** s'il souscrit pour son activité | Idem |
| Salarié achetant à titre personnel | Peu probable (le service est clairement B2B) | Rétractation applicable le cas échéant |

**Recommandation** : bien que juridiquement non obligatoire en B2B, **accorder volontairement une garantie "satisfait ou remboursé" de 14 jours** sur le Pack Lancement. Raisons :
- Argument commercial fort ("Essaye sans risque")
- Réduit la friction à l'achat
- Aligne le service sur les standards du marché SaaS
- Prévient tout litige avec un client qui se prévaudrait du statut de consommateur

**ACTIONS** :
1. Dans les CGV, préciser que le service s'adresse aux professionnels.
2. Offrir une garantie commerciale de 14 jours (remboursement sur demande, hors livrables déjà utilisés/publiés).
3. Pour les abonnements mensuels : pas de rétractation mais résiliation libre à la fin de chaque période mensuelle (pas d'engagement minimum sauf choix explicite du client).
4. *À vérifier avec un juriste : le statut d'agent commercial peut dans certains cas être requalifié — la garantie volontaire protège contre ce risque.*

---

## 4. Mentions légales obligatoires

Toute page web professionnelle en France doit afficher des mentions légales (Art. 6 III LCEN — Loi n° 2004-575).

### Mentions à inclure sur la page /mentions-legales

| Information | Détail | Obligation |
|-------------|--------|------------|
| **Raison sociale / nom** | Nom de la société ou de l'entrepreneur individuel | LCEN Art. 6 III |
| **Forme juridique** | SAS, SASU, EI, micro-entreprise, etc. | LCEN Art. 6 III |
| **Adresse du siège social** | Adresse postale complète | LCEN Art. 6 III |
| **Numéro SIRET / SIREN** | Numéro d'immatriculation | LCEN Art. 6 III |
| **Numéro de TVA intracommunautaire** | FR + 11 chiffres (dès assujettissement) | LCEN Art. 6 III |
| **Capital social** | Montant (si société) | LCEN Art. 6 III |
| **Responsable de la publication** | Nom du dirigeant | LCEN Art. 6 III |
| **Email de contact** | contact@immocrew.fr | LCEN Art. 6 III |
| **Numéro de téléphone** | Numéro professionnel | LCEN Art. 6 III |
| **Hébergeur** | Nom, raison sociale, adresse de Replit Inc. (350 Mission St, San Francisco, CA 94105, USA) | LCEN Art. 6 III |
| **Données personnelles** | Lien vers la Politique de Confidentialité + mention du droit de réclamation auprès de la CNIL | RGPD + LCEN |

### ACTIONS

1. **Créer la page /mentions-legales** sur le site (accessible depuis le footer de toutes les pages).
2. **Créer la structure juridique** d'ImmoCrew si ce n'est pas fait (SASU recommandée pour un fondateur solo avec perspective de croissance). *À valider avec un expert-comptable.*
3. **Réserver le domaine** immocrew.fr et créer les adresses email (contact@, dpo@).
4. Lien vers les CGV et la Politique de Confidentialité depuis cette page.

---

## 5. Loi Hoguet — Analyse d'applicabilité

### Contexte

La Loi Hoguet (Loi n° 70-9 du 2 janvier 1970) réglemente les activités d'**entremise et de gestion immobilières** : achat, vente, location, gestion de biens immobiliers pour le compte d'autrui. Elle impose une carte professionnelle (carte T, carte G) et des obligations strictes (garantie financière, assurance RCP, etc.).

### Analyse pour ImmoCrew

| Critère Loi Hoguet | Activité ImmoCrew | Conclusion |
|--------------------|-------------------|------------|
| Entremise immobilière (mise en relation acheteur/vendeur) | **Non** — ImmoCrew produit du contenu marketing, il ne met pas en relation des parties | Non soumis |
| Gestion immobilière | **Non** — aucune gestion de biens | Non soumis |
| Rédaction d'actes / compromis | **Non** — ImmoCrew rédige des textes marketing (annonces, posts), pas des actes juridiques | Non soumis |
| Perception de fonds pour compte de tiers | **Non** — ImmoCrew facture ses propres services | Non soumis |
| Conseil en investissement immobilier | **Non** — aucun conseil d'achat/vente/investissement | Non soumis |

### Conclusion

**ImmoCrew n'est PAS soumis à la Loi Hoguet.** Le service est un prestataire de marketing B2B qui produit du contenu pour des professionnels de l'immobilier. Il n'exerce aucune activité d'entremise, de gestion ou de conseil immobilier.

**Aucune carte professionnelle, garantie financière ou assurance spécifique Hoguet n'est requise.**

### Précautions à maintenir

1. **Ne jamais** inclure dans les livrables de conseils d'investissement immobilier ou d'estimations de prix à destination des clients finaux des mandataires.
2. **Ne jamais** intervenir dans une transaction (pas de mise en relation acheteur/vendeur, pas de rédaction de compromis).
3. **Ne pas** se présenter comme "agence immobilière" ou "conseil immobilier" — toujours comme "agence marketing" ou "service marketing".
4. Si un client demande un service qui relèverait de la Loi Hoguet (ex : rédiger un avis de valeur), **refuser** et rediriger vers un professionnel habilité.

*À vérifier avec un juriste : la rédaction d'annonces immobilières optimisées ne constitue-t-elle pas une forme d'assistance à la commercialisation ? Réponse attendue : non, tant qu'ImmoCrew ne publie pas lui-même les annonces et ne perçoit pas de commission sur les transactions. Mais une validation formelle est recommandée.*

---

## 6. Checklist de conformité pré-lancement

### Bloquants (à faire AVANT la mise en ligne)

- [ ] Créer la structure juridique (SASU / micro-entreprise) et obtenir le SIRET
- [ ] Rédiger et publier les **CGV** (cf. section 3)
- [ ] Rédiger et publier la **Politique de Confidentialité** (cf. section 1)
- [ ] Créer la page **Mentions Légales** (cf. section 4)
- [ ] Implémenter le **bandeau de consentement cookies** (Tarteaucitron.js ou équivalent)
- [ ] Configurer **Supabase en région EU** (Francfort)
- [ ] Configurer **PostHog EU Cloud** (eu.posthog.com)
- [ ] Signer les **DPA** : Supabase, Clerk, Stripe, Replit, Anthropic
- [ ] Créer l'adresse **dpo@immocrew.fr** (ou privacy@immocrew.fr)
- [ ] Ajouter la **mention IA** dans les CGV et le processus d'onboarding (cf. section 2)
- [ ] Implémenter la **checkbox d'acceptation des CGV** à l'inscription (avec horodatage)

### Importants (à faire dans les 30 premiers jours)

- [ ] Rédiger le **Registre des Traitements** (Art. 30 RGPD) — document interne
- [ ] Préparer les **scripts d'export et de suppression** de données client (portabilité + effacement)
- [ ] Documenter la **procédure de QA/relecture** des livrables IA (cf. section 2.2.C)
- [ ] Souscrire une **assurance RCP** (Responsabilité Civile Professionnelle) — recommandé pour tout prestataire de services B2B
- [ ] Mettre en place un **lien de désinscription** dans tous les emails commerciaux

### Souhaitables (dans les 3 premiers mois)

- [ ] Faire **valider les CGV par un juriste** spécialisé en droit du numérique
- [ ] Faire **valider l'analyse Loi Hoguet** par un juriste spécialisé en droit immobilier
- [ ] Implémenter une **purge automatique** des données à la résiliation
- [ ] Mettre en conformité avec les **évolutions du AI Act** (application complète août 2026)
- [ ] Envisager la certification **ISO 27001** ou un audit de sécurité si le volume de clients dépasse 100

---

> **Note finale** : cet audit est un cadrage initial. Il identifie les obligations et les actions concrètes. Il ne remplace pas une consultation juridique. Les points marqués "À vérifier avec un juriste" doivent être soumis à un professionnel du droit avant le lancement en production.
