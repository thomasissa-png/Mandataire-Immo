# Vision Produit — ImmoCrew

> Produit par @product-manager | 2026-03-25
> Sources : project-context.md, brand-platform.md, personas.md, legal-audit.md

---

## 1. Mission

**Donner à chaque mandataire immobilier indépendant une équipe marketing complète, sans qu'il ait besoin de compétences digitales, de temps supplémentaire, ni d'un budget d'agence.**

ImmoCrew transforme un marche de 80 000+ mandataires sous-servis en clients recurrents en livrant chaque mois du contenu marketing fini, hyper-personnalise et pret a publier. Le mandataire ne touche a rien sauf le bouton "publier".

---

## 2. Vision a 12 mois

**A mars 2027, ImmoCrew est la reference marketing des mandataires independants en France :**

- **60+ clients recurrents** (pack mensuel actif) avec un MRR de 12 000 EUR+
- **Retention a 90% a 3 mois** — un client qui reste 3 mois reste 12 mois
- **Acquisition 100% organique** — SEO, LinkedIn, groupes Facebook, bouche-a-oreille
- **2 partenariats team leaders** actifs (chaque partenariat = 5-15 clients par lot)
- **NPS >= 60** — les clients recommandent spontanement
- **Operations en < 8h/semaine** — production quasi-integralement geree par les agents Gradient
- **Marque reconnue** dans les groupes Facebook et LinkedIn des mandataires IAD, SAFTI, Capifrance

---

## 3. Principes produit

### Principe 1 — "Livre, ne donne pas d'outils"
ImmoCrew ne donne jamais un template, un tutoriel ou une plateforme a configurer. Chaque interaction produit un **resultat fini** que le client peut utiliser en 3 minutes. Si le client doit apprendre quelque chose, on a echoue.

### Principe 2 — "Hyper-local ou rien"
Chaque contenu mentionne des elements specifiques a la zone du mandataire : nom du quartier, ecoles, transports, prix au m2 reels, commerces. Un contenu qui pourrait fonctionner pour n'importe quelle ville est un contenu rejete. La personnalisation est notre avantage structurel.

### Principe 3 — "Zero jargon, zero friction"
Le produit parle le langage du mandataire, pas celui du marketing digital. Pas de "funnel", pas de "KPI", pas de "content strategy". L'interface, les emails, les livrables — tout est ecrit comme parlerait un collegue bienveillant qui tutoie.

### Principe 4 — "La confiance avant le contrat"
Chaque prospect recoit de la valeur avant de payer : une annonce reecrite gratuitement, des tips concrets dans les groupes, un exemple personnalise pour sa zone. On prouve d'abord, on vend ensuite.

### Principe 5 — "Automatiser pour humaniser"
L'IA produit 95% du volume. Le temps humain libere est reinvesti dans la personnalisation, la QA et la relation client. L'objectif n'est pas de remplacer l'humain mais de lui donner le temps d'etre humain la ou ca compte.

---

## 4. Modele economique

### Offres validees

| Offre | Type | Prix | Contenu livre | Cible |
|-------|------|------|---------------|-------|
| **Pack Lancement** | One-shot | 497 EUR | Positionnement, bio optimisee, 5 templates annonces, 5 articles SEO local, calendrier editorial 30j, 20 posts, 10 scripts Reels, kit graphique | Nouveaux clients — onboarding complet |
| **Pack Mensuel** | Abonnement | 197 EUR/mois | 12 posts, 4 scripts video, 2 articles SEO, 1 newsletter, 4 annonces personnalisees, 1 email prospection | Coeur du business — recurrence |
| **Boost Mandat** | One-shot (upsell) | 97 EUR/mandat | Annonce storytelling, 3 posts + 1 Reel dedies, mini landing page, email blast acheteurs | Ponctuel — par bien a vendre |

### Scenario de revenus objectif (mois 6)

| Source | Volume | CA mensuel |
|--------|--------|------------|
| Packs mensuels | 15 clients | 2 955 EUR |
| Packs lancement | 2/mois | 994 EUR |
| Boosts mandat | 10/mois | 970 EUR |
| **Total MRR equivalent** | | **~5 900 EUR** |

### Cout marginal par client

- Production contenu via agents Gradient : ~2-3 EUR/client/mois (tokens IA)
- Temps humain (orchestration + QA) : ~1-2h/client/mois
- Infrastructure (Supabase, Replit, Clerk, Stripe) : < 100 EUR/mois total
- **Marge brute estimee : > 85%**

---

## 5. Metriques produit cles

### North Star Metric
**Nombre de clients recurrents actifs** (abonnes au pack mensuel avec paiement a jour)

### Metriques de sante produit

| Metrique | Objectif 6 mois | Frequence de mesure |
|----------|-----------------|---------------------|
| Clients recurrents actifs | 30 | Hebdomadaire |
| MRR | 5 900 EUR | Mensuel |
| Taux de retention a 3 mois | >= 90% | Mensuel (cohortes) |
| NPS client | >= 60 | Trimestriel |
| Delai de livraison (pack mensuel) | < 48h apres debut de mois | Par livraison |
| Delai de livraison (pack lancement) | < 7 jours apres onboarding | Par client |
| Taux d'utilisation des livrables | > 70% des posts publies par le client | Mensuel (suivi manuel) |
| Cout de production par client | < 5 EUR/mois (tokens IA) | Mensuel |
| Temps operateur par client | < 2h/mois | Mensuel |
| Churn mensuel | < 5% | Mensuel |

### Metriques d'acquisition

| Metrique | Objectif 6 mois | Canal |
|----------|-----------------|-------|
| Leads qualifies / mois | 15-20 | Tous canaux |
| Taux de conversion lead -> client | 20-30% | Tous canaux |
| CAC (cout d'acquisition client) | 0 EUR (organique) | — |
| Nombre de DMs LinkedIn envoyes / semaine | 50 | LinkedIn |
| Taux de reponse DMs | >= 20% | LinkedIn |

---

## 6. Positionnement dans l'ecosysteme

### Carte du marche

```
                    RESULTAT FINI (livre)
                         ^
                         |
                    ImmoCrew
                    197 EUR/mois
                    Mandataires solo
                         |
    LOW-TOUCH --------+------------ HIGH-TOUCH
    (self-service)     |            (accompagne)
                       |
         Cocoon-Immo   |     CM Freelance
         99-269 EUR    |     300-800 EUR
         Agences       |     Tout secteur
                       |
                    OUTIL (a utiliser)
```

### Positionnement vs alternatives

| Critere | ImmoCrew | Cocoon-Immo | CM Freelance | Templates reseau (IAD/SAFTI) |
|---------|----------|-------------|--------------|------------------------------|
| Ce qu'on livre | Resultats finis | Plateforme + suggestions | Contenu variable | Templates generiques |
| Personnalisation | Hyper-locale (quartier, rue, ecoles) | Nom de ville en variable | Depend du freelance | Logo du reseau uniquement |
| Effort client | 3 min/jour (copier-coller) | 30+ min/jour (configurer, adapter) | 2-3h/semaine (briefer, valider) | 1h+ (adapter des templates) |
| Cible | Mandataires independants | Agences immobilieres | Toute taille | Mandataires du reseau |
| Prix | 197 EUR/mois | 99-269 EUR/mois | 300-800 EUR/mois | Inclus (gratuit, generique) |
| Connaissance immobilier | Specialise mandataires | Specialise agences | Generaliste | Generique reseau |
| Regularite | Garanti chaque mois | Depend de l'utilisation | Depend du freelance | Depend de la motivation |

### Notre avantage structurel (moat)

1. **Cout marginal quasi-nul** — les agents Gradient produisent le contenu a ~3 EUR/client. Aucun CM freelance ne peut rivaliser sur le ratio qualite/prix.
2. **Specialisation verticale** — chaque prompt, chaque template, chaque workflow est calibre pour le mandataire immobilier. Un nouvel entrant met des mois a atteindre ce niveau de specialisation.
3. **Donnees hyper-locales** — le questionnaire d'onboarding alimente un profil riche qui ameliore la qualite a chaque livraison. Plus un client reste, meilleur le contenu devient.
4. **Effets reseau via team leaders** — chaque team leader convaincu amene 5-15 filleuls. L'acquisition devient exponentielle, pas lineaire.

---

## 7. Risques produit et mitigations

| Risque | Impact | Mitigation produit |
|--------|--------|-------------------|
| Livrables percus comme generiques/IA | Critique — churn immediat | Onboarding detaille, personnalisation hyper-locale obligatoire, QA humaine avant livraison |
| Churn eleve (mandataires quittent le metier) | Eleve — 30-40% de turnover dans le metier | Cibler mandataires 1+ an d'XP, contrats trimestriels optionnels, contenu "hors saison" |
| Reseaux (IAD, SAFTI) internalisent le marketing IA | Eleve — risque a 12-18 mois | Aller plus loin que les templates reseau (SEO local, personal branding, storytelling) |
| Plafond operationnel solo a 50+ clients | Moyen — limite la croissance | Automatiser des le jour 1, chaque client = un project-context pre-rempli, agents font 95% |
| Non-conformite RGPD / AI Act | Moyen — risque legal | Politique de confidentialite, bandeau cookies, mention IA sur livrables (cf. legal-audit.md) |

---

*Document produit par @product-manager dans le cadre du framework Gradient Agents.*
*Reference : project-context.md, brand-platform.md, personas.md, legal-audit.md*
