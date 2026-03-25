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
_À compléter_

### 3.2 Droit de rétractation (14 jours)
_À compléter_

---

## 4. Mentions légales obligatoires

_À compléter_

---

## 5. Loi Hoguet — Analyse d'applicabilité

_À compléter_

---

## 6. Checklist de conformité pré-lancement

_À compléter_
