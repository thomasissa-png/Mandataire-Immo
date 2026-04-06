# Framework de KPIs — ImmoCrew

> Produit par @data-analyst | 2026-03-25
> Sources : project-context.md, product-vision.md, functional-specs.md, personas.md
> Outil d'analytics : PostHog (tier gratuit)

---

## 1. North Star Metric

### Definition

**Nombre de clients recurrents actifs** : nombre de clients ayant un abonnement actif (Mensuel 150 EUR/mois, Trimestriel 120 EUR/mois, Annuel 100 EUR/mois) avec un paiement a jour (pas en impaye, pas en pause, pas annule).

### Formule

```
NSM = COUNT(clients WHERE plan = "mensuel" AND payment_status = "active" AND last_payment_date >= DATE_SUB(NOW(), INTERVAL 35 DAY))
```

Le seuil de 35 jours (et non 30) permet d'absorber les retards de paiement Stripe sans declasser un client actif a tort.

### Frequence de mesure

| Frequence | Usage |
|-----------|-------|
| **Quotidienne** | Dashboard PostHog — suivi en temps reel |
| **Hebdomadaire** | Review operationnelle — detection des tendances |
| **Mensuelle** | Rapport strategique — comparaison aux objectifs |

### Seuils et alertes

| Seuil | Valeur (mois 6) | Action |
|-------|-----------------|--------|
| Objectif | 30 clients actifs | Trajectoire nominale |
| Warning | < 20 clients actifs au mois 4 | Revoir la strategie d'acquisition, accelerer LinkedIn DM |
| Critique | < 10 clients actifs au mois 4 | Pivoter : revoir le pricing, tester un nouveau canal, envisager le paid |
| Excellence | > 35 clients actifs au mois 6 | Preparer le scaling : automatisation, recrutement ou partenariat |

### Decomposition de la NSM

La North Star se decompose en 3 leviers actionnables :

```
NSM = Nouveaux abonnes du mois - Churns du mois + Reactivations
```

- **Nouveaux abonnes** : depend de l'acquisition et de la conversion
- **Churns** : depend de la retention et de la qualite des livrables
- **Reactivations** : clients ayant annule puis repris (objectif : faible, signe que le churn initial est maitrise)

---

## 2. Framework AARRR adapte a ImmoCrew

### Vue d'ensemble

```
ACQUISITION → ACTIVATION → RETENTION → REVENUE → REFERRAL
  Visiteur      Lead       Client       MRR      Ambassadeur
  Landing    Onboarding   Mois 2+    Paiement   Parrainage
```

### 2.1 Acquisition — "Comment les mandataires decouvrent ImmoCrew"

| KPI | Formule | Objectif M6 | Frequence | Source PostHog |
|-----|---------|-------------|-----------|----------------|
| Visiteurs uniques / mois | COUNT(distinct user_id WHERE page_view) | 1 500 | Hebdo | Event `page_view` |
| Visiteurs par canal | GROUP BY utm_source | LinkedIn 40%, Facebook 30%, SEO 20%, Direct 10% | Hebdo | Property `utm_source` |
| Leads generes / mois | COUNT(onboarding_start OR lead_form_submit) | 15-20 | Hebdo | Events onboarding |
| Taux de conversion landing | leads / visiteurs uniques | 1-2% | Hebdo | Funnel PostHog |
| CTA click rate | cta_clicks / page_views | > 5% | Hebdo | Event `cta_click` |
| Cout par lead (CAC partiel) | 0 EUR (organique) | 0 EUR | Mensuel | Manuel |

**Seuils d'alerte Acquisition :**
- WARNING : < 500 visiteurs/mois au mois 3 → intensifier le contenu LinkedIn et Facebook
- CRITIQUE : < 5 leads/mois → revoir le message, le CTA, ou tester un nouveau canal

### 2.2 Activation — "Le mandataire comprend la valeur et s'engage"

| KPI | Formule | Objectif | Frequence | Source PostHog |
|-----|---------|----------|-----------|----------------|
| Taux de completion onboarding | onboarding_complete / onboarding_start | > 80% | Hebdo | Funnel events onboarding |
| Temps moyen d'onboarding | AVG(onboarding_complete.timestamp - onboarding_start.timestamp) | < 7 min | Hebdo | PostHog session |
| Taux d'abandon par etape | DROP(step_N) / start_step_N | Identifier l'etape problematique | Hebdo | Funnel multi-etapes |
| Premier livrable consulte | COUNT(deliverable_view WHERE first_time = true) / COUNT(new_clients) | > 90% en 48h | Hebdo | Event `deliverable_view` |
| Premier livrable telecharge | COUNT(deliverable_download WHERE first_time = true) / COUNT(new_clients) | > 70% en 7 jours | Hebdo | Event `deliverable_download` |
| Conversion lead → client payant | payment_success / onboarding_start | 20-30% | Mensuel | Funnel complet |

**Seuils d'alerte Activation :**
- WARNING : taux completion onboarding < 60% → simplifier le formulaire, reduire les champs
- CRITIQUE : premier livrable consulte < 50% → le client ne s'engage pas, revoir la communication post-paiement

### 2.3 Retention — "Le mandataire reste mois apres mois"

| KPI | Formule | Objectif | Frequence | Source PostHog |
|-----|---------|----------|-----------|----------------|
| Retention a 1 mois | clients_actifs_M2 / clients_actifs_M1 (cohorte) | > 95% | Mensuel | Cohorte PostHog |
| Retention a 3 mois | clients_actifs_M4 / clients_actifs_M1 (cohorte) | > 90% | Mensuel | Cohorte PostHog |
| Churn mensuel | clients_annules_mois / clients_actifs_debut_mois | < 5% | Mensuel | Event `subscription_cancel` |
| NPS | Score enquete trimestrielle (-100 a +100) | >= 60 | Trimestriel | Enquete externe (Typeform) + event PostHog |
| Taux d'utilisation des livrables | livrables_telecharges / livrables_livres | > 70% | Mensuel | Events `deliverable_download` |
| Frequence de connexion | sessions_espace_client / mois / client | >= 2 / mois | Mensuel | Event `login` |
| Delai moyen de livraison | AVG(livraison_date - debut_mois) | < 48h | Par livraison | Donnees internes |

**Seuils d'alerte Retention :**
- WARNING : churn mensuel > 8% → analyser les raisons (enquete sortie), verifier qualite livrables
- CRITIQUE : retention 3 mois < 75% → probleme produit fondamental, arreter l'acquisition et fixer la retention
- WARNING : NPS < 40 → livrables percus comme generiques, renforcer la personnalisation

### 2.4 Revenue — "Le business est viable et croissant"

| KPI | Formule | Objectif M6 | Frequence | Source |
|-----|---------|-------------|-----------|--------|
| MRR (Monthly Recurring Revenue) | SUM(abonnements_actifs * prix_mensuel) | 5 900 EUR | Mensuel | Stripe + PostHog |
| ARR (Annual Recurring Revenue) | MRR * 12 | 70 800 EUR | Mensuel | Calcule |
| ARPU (Average Revenue Per User) | MRR / nombre_clients_actifs | ~120-150 EUR (mix formules) | Mensuel | Calcule |
| LTV (Lifetime Value) | ARPU * duree_moyenne_abonnement_mois | > 2 000 EUR (cible 10+ mois) | Trimestriel | Calcule |
| CAC (Cout Acquisition Client) | depenses_acquisition / nouveaux_clients | 0 EUR (organique) | Mensuel | Manuel |
| Ratio LTV/CAC | LTV / CAC | Infini (organique) — surveiller si paid demarre | Trimestriel | Calcule |
| Revenue par offre | GROUP BY offre (Mensuel, Trimestriel, Annuel, Boost) | Abonnements > 80% du CA | Mensuel | Stripe |
| Taux d'impaye | paiements_echoues / paiements_tentes | < 3% | Mensuel | Event `payment_failed` |
| Taux d'upsell Boost | clients_boost / clients_mensuels | > 30% | Mensuel | Stripe |

**Seuils d'alerte Revenue :**
- WARNING : MRR < 3 000 EUR au mois 4 → accelerer l'acquisition ou revoir le pricing
- CRITIQUE : taux d'impaye > 10% → probleme de paiement, verifier l'integration Stripe
- WARNING : < 1 Boost Mandat / mois → l'upsell ne fonctionne pas, revoir la communication

### 2.5 Referral — "Les clients recommandent ImmoCrew"

| KPI | Formule | Objectif M6 | Frequence | Source |
|-----|---------|-------------|-----------|--------|
| Taux de parrainage | clients_parraines / clients_actifs | > 10% | Mensuel | Suivi manuel + code parrain |
| Recommandations team leaders | nombre_team_leaders_actifs | 2 | Trimestriel | CRM manuel |
| Clients par team leader | clients_recrutes_via_team_leader / team_leaders_actifs | 5-15 | Trimestriel | CRM manuel |
| Score bouche-a-oreille | "Comment avez-vous connu ImmoCrew?" = "Recommandation" | > 20% des nouveaux | Mensuel | Champ onboarding |
| Avis/temoignages collectes | COUNT(temoignages_publies) | 10+ | Trimestriel | Manuel |

**Seuils d'alerte Referral :**
- WARNING : 0 parrainage au mois 3 → lancer un programme de parrainage formel (mois offert, reduction)
- CRITIQUE : 0 team leader au mois 6 → revoir l'approche partenariats (offre trop chere, pas assez de valeur pour le team leader)

---

## 3. Tableau de bord PostHog — Dashboards recommandes

### Dashboard 1 : Vue executive (check quotidien — 2 min)

**Widgets :**
1. **NSM** — Nombre de clients recurrents actifs (chiffre unique, trend 30j)
2. **MRR** — Graphe en ligne, derniers 6 mois
3. **Nouveaux clients cette semaine** — Compteur
4. **Churns ce mois** — Compteur avec alerte si > 0
5. **Visiteurs uniques (7 derniers jours)** — Graphe en barres

### Dashboard 2 : Acquisition (review hebdomadaire)

**Widgets :**
1. **Funnel d'acquisition** : visiteur → CTA click → lead → paiement → client actif
2. **Visiteurs par source** (utm_source) — Pie chart
3. **Taux de conversion landing page** — Trend 30j
4. **Pages les plus vues** — Tableau
5. **Top CTAs cliques** — Tableau avec taux de clic
6. **Leads generes par semaine** — Graphe en barres

### Dashboard 3 : Activation & Onboarding (review hebdomadaire)

**Widgets :**
1. **Funnel onboarding** : start → etape 1 → ... → etape 7 → complete (taux de drop par etape)
2. **Temps moyen par etape** — Graphe en barres
3. **Taux de completion global** — Chiffre unique + trend
4. **Premier livrable consulte dans les 48h** — Pourcentage
5. **Premier livrable telecharge dans les 7j** — Pourcentage

### Dashboard 4 : Retention & Engagement (review mensuelle)

**Widgets :**
1. **Cohortes de retention** — Matrice de retention PostHog (M0, M1, M2, M3...)
2. **Churn mensuel** — Trend 6 mois
3. **Frequence de connexion** — Distribution (0, 1, 2, 3+ sessions/mois)
4. **Livrables telecharges / livres** — Ratio par client
5. **NPS** — Gauge (mis a jour trimestriellement)
6. **Clients a risque** — Liste des clients avec 0 connexion depuis 2+ semaines

### Dashboard 5 : Revenue (review mensuelle)

**Widgets :**
1. **MRR breakdown** — Stacked bar (Mensuel + Trimestriel + Annuel + Boost)
2. **MRR evolution** — Ligne avec objectif en pointille
3. **ARPU** — Trend
4. **Paiements echoues** — Compteur + liste
5. **Taux d'upsell Boost Mandat** — Pourcentage

---

## 4. Systeme d'alertes automatiques

### Configuration PostHog (Actions + Webhooks)

| Alerte | Condition | Canal | Frequence |
|--------|-----------|-------|-----------|
| **Nouveau client** | Event `payment_success` WHERE plan = "mensuel" | Email + Slack | Temps reel |
| **Churn detecte** | Event `subscription_cancel` | Email + Slack | Temps reel |
| **Paiement echoue** | Event `payment_failed` | Email | Temps reel |
| **Onboarding abandonne** | `onboarding_start` sans `onboarding_complete` apres 48h | Email | Quotidien |
| **Client inactif** | 0 `login` event depuis 14 jours pour un client actif | Email | Hebdomadaire |
| **Churn mensuel > 8%** | Calcul mensuel | Email | Mensuel |
| **MRR sous objectif** | MRR < seuil du mois (trajectoire lineaire vers 5 900 EUR) | Email | Mensuel |
| **NPS < 40** | Resultat enquete | Email | Trimestriel |

### Alertes prioritaires (a implementer au MVP)

**P0 — Jour 1 :**
- Nouveau client (celebrer + demarrer la production)
- Paiement echoue (relancer immediatement)
- Subscription cancel (comprendre pourquoi, tenter de retenir)

**P1 — Mois 1 :**
- Onboarding abandonne (email de relance automatique)
- Client inactif 14j (check proactif)

**P2 — Mois 2+ :**
- Alertes sur seuils KPIs (MRR, churn, retention)
- Rapports automatiques hebdomadaires

---

## 5. Objectifs par phase (aligne sur la roadmap)

| Phase | Periode | NSM | MRR | Retention 3M | NPS | Priorite analytics |
|-------|---------|-----|-----|--------------|-----|--------------------|
| MVP | S1-S2 (avril) | 0 | 0 EUR | N/A | N/A | Installer PostHog, events landing page |
| Beta | S3-S4 (avril) | 3-5 | 600-1 000 EUR | N/A | N/A | Events onboarding + paiement |
| Stabilisation | M2-M3 (mai-juin) | 10-15 | 2 000-3 000 EUR | Premiere mesure | Premiere mesure | Events espace client, cohortes retention |
| Scale | M4-M6 (juil-sept) | 20-30 | 4 000-5 900 EUR | >= 90% | >= 60 | Dashboards complets, alertes automatiques |

---

## 6. Segments d'analyse recommandes

### Segments utilisateurs

| Segment | Definition | Pourquoi |
|---------|------------|----------|
| Par plan | Mensuel / Trimestriel / Annuel / Avec Boost | Comprendre la valeur percue par offre |
| Par reseau | IAD / SAFTI / Capifrance / Autre | Adapter l'acquisition par reseau |
| Par anciennete client | < 1 mois / 1-3 mois / 3-6 mois / 6+ mois | Identifier les moments critiques de churn |
| Par anciennete metier | < 1 an / 1-2 ans / 3-5 ans / 5+ ans | Adapter le message et les livrables |
| Par zone geo | Grandes villes / Villes moyennes / Rural | Verifier que l'hyper-local fonctionne partout |
| Par engagement | Actif (2+ sessions/mois) / Passif (1/mois) / Inactif (0) | Predire le churn et intervenir |
| Par canal d'acquisition | LinkedIn / Facebook / SEO / Parrainage / Team leader | Optimiser les efforts d'acquisition |
| Par nb transactions/an | 1-3 / 4-6 / 7-10 / 10+ | Correler volume d'activite et retention |

### Cohortes PostHog a creer

1. **Cohorte par mois d'inscription** — pour la matrice de retention
2. **Cohorte "a risque"** — clients avec 0 login depuis 14j ET abonnement actif
3. **Cohorte "power users"** — clients qui telechargent 100% des livrables + commandent des Boosts
4. **Cohorte "team leader referral"** — clients venus via un partenariat team leader

---

*Document produit par @data-analyst dans le cadre du framework Gradient Agents.*
*Reference : project-context.md, product-vision.md, functional-specs.md, personas.md*
