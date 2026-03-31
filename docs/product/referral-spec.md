# Spec — Système de parrainage ImmoCrew

> Produit par @product-manager | 2026-03-31
> Sources : project-context.md, docs/product/functional-specs.md
> Statut : V1

---

## Contexte et objectif

ImmoCrew acquiert aujourd'hui 100% en organique (LinkedIn, Facebook, SEO). Le parrainage est un canal viral à coût nul — parfaitement aligné avec la contrainte "budget acquisition 0€". Un mandataire satisfait recommande naturellement à ses collègues. Le système structure et récompense ce comportement.

**KPI associé** : Nombre de clients récurrents actifs (North Star). Chaque filleul converti = +1 client récurrent.

---

## Règles métier

| Règle | Valeur | Justification |
|---|---|---|
| Récompense parrain | 1 mois gratuit (150€ de valeur) | Suffisant pour motiver sans grever la marge |
| Récompense filleul | 1 semaine gratuite (~37€ de valeur) | Lève la friction à l'inscription, incite à saisir le code |
| Déclencheur crédit parrain | Premier paiement Stripe du filleul validé (`invoice.payment_succeeded`) | Pas de crédit avant cash encaissé |
| Déclencheur crédit filleul | À la souscription, avant le premier prélèvement | Trial Stripe de 7 jours sur l'abonnement |
| Limite parrainages | Illimitée | Incentive de recommandation maximal |
| Cumulabilité | 1 code par souscription filleul | Pas de cumul de codes |
| Eligibilité parrain | Tout abonné Pack Mensuel actif | Pas d'abonné inactif ou Pack Lancement seul |
| Code parrainage | `IMMOCREW-{PRENOM}{4_ALPHANUMERIQUES}` (ex: IMMOCREW-SOPHIE7K2M) | Lisible, personnalisé, shareable en DM |

---

## Schéma base de données

### Table `referral_codes`

```sql
CREATE TABLE referral_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code          VARCHAR(30) NOT NULL UNIQUE,  -- ex: IMMOCREW-SOPHIE7K2M
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
```

### Table `referrals`

```sql
CREATE TABLE referrals (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id      UUID NOT NULL REFERENCES referral_codes(id),
  referrer_user_id      UUID NOT NULL REFERENCES users(id),  -- parrain
  referee_user_id       UUID REFERENCES users(id),           -- filleul (null avant inscription)
  referee_email         VARCHAR(255),                        -- email saisi au checkout avant inscription
  status                VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending : code saisi, filleul pas encore abonné
    -- converted : filleul a payé, crédits attribués
    -- expired : filleul ne s'est jamais abonné (cleanup 90j)
  referrer_credit_months  INT NOT NULL DEFAULT 0,            -- mois crédités au parrain
  referee_trial_days      INT NOT NULL DEFAULT 0,            -- jours trial attribués au filleul
  converted_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX idx_referrals_referee  ON referrals(referee_user_id);
CREATE INDEX idx_referrals_code     ON referrals(referral_code_id);
```

### Extension table `users` (colonnes à ajouter)

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  referral_credit_months_remaining INT NOT NULL DEFAULT 0;
  -- mois gratuits disponibles (décrémentés à chaque cycle de facturation)
```

**Note** : pas de table `subscriptions` séparée au MVP — l'état Stripe est source de vérité. Le `referral_credit_months_remaining` est une colonne locale synchronisée par webhook.

---

## Logique de génération du code

```
code = "IMMOCREW-" + prenom_majuscule(4 premiers chars max) + random_alphanum(4)
```

Exemples :
- Sophie Durand → `IMMOCREW-SOPH7K2M`
- Thomas Bernard → `IMMOCREW-THOM4X9P`
- Éric Martin → `IMMOCREW-ERIC2B7Q` (accent retiré, normalisation ASCII)

Collision : si le code existe déjà en base → regénérer (max 5 tentatives, après fallback `IMMOCREW-USER{uuid[0:6]}`).

---

## Endpoints API

### `GET /api/referral/my-code`

Retourne le code du parrain connecté. Crée le code s'il n'existe pas encore.

**Auth** : Bearer (session NextAuth obligatoire)

**Response 200** :
```json
{
  "code": "IMMOCREW-SOPH7K2M",
  "stats": {
    "total_referrals": 3,
    "converted": 1,
    "pending": 2,
    "credit_months_remaining": 1
  }
}
```

**Response 403** : utilisateur sans abonnement actif (`{ "error": "subscription_required" }`)

---

### `POST /api/referral/validate`

Appelé au checkout quand le filleul saisit son code. Valide le code et retourne les infos pour affichage UI.

**Auth** : publique (pas de session requise — filleul pas encore inscrit)

**Request body** :
```json
{
  "code": "IMMOCREW-SOPH7K2M"
}
```

**Response 200** :
```json
{
  "valid": true,
  "referrer_first_name": "Sophie",
  "discount_label": "1 semaine offerte sur ton premier mois"
}
```

**Response 200** (code invalide — pas d'erreur 4xx pour ne pas exposer la base) :
```json
{
  "valid": false,
  "error": "code_not_found"
}
```

**Rate limit** : 10 req/min par IP (protection brute-force)

---

### `POST /api/webhooks/stripe`

Webhook existant — ajouter le handler `invoice.payment_succeeded` pour les cas de parrainage.

**Logique dans le handler** :

```
SI invoice.payment_succeeded
  ET c'est le premier paiement de l'abonnement (invoice.billing_reason = "subscription_create")
  ET un referral "pending" existe pour cet utilisateur
ALORS
  1. Passer referral.status → "converted"
  2. Incrémenter referral_credit_months_remaining du parrain +1
  3. Enregistrer referrer_credit_months = 1, referee_trial_days = 7
  4. Logguer l'événement dans referrals.converted_at

SI début de cycle de facturation mensuel
  ET referral_credit_months_remaining > 0
ALORS
  Appeler Stripe API pour créer un crédit (Customer Balance Credit) = -150€
  Décrémenter referral_credit_months_remaining -1
```

**Note implémentation** : le crédit parrain est appliqué via [Stripe Customer Balance](https://stripe.com/docs/billing/customer/balance) (`stripe.customers.createBalanceTransaction`). Stripe déduit automatiquement le solde de la prochaine facture.

---

### `GET /api/referral/list`

Retourne la liste des parrainages du parrain connecté.

**Auth** : Bearer

**Response 200** :
```json
{
  "referrals": [
    {
      "id": "uuid",
      "referee_email": "jean.dupont@gmail.com",
      "status": "converted",
      "converted_at": "2026-03-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "referee_email": "marie.martin@gmail.com",
      "status": "pending",
      "created_at": "2026-03-28T14:00:00Z"
    }
  ]
}
```

---

## Flux utilisateur — Parrain (Sophie)

```
[Dashboard ImmoCrew]
       │
       ▼
[Section "Parraine tes collègues"]
  → Affichage du code IMMOCREW-SOPH7K2M
  → Bouton "Copier le lien" (URL pré-remplie vers checkout avec ?ref=IMMOCREW-SOPH7K2M)
  → Compteur : "1 filleul converti — 1 mois gratuit crédité"
  → Liste des parrainages (email masqué : j**@gmail.com + statut)
       │
  [Sophie partage son code par DM LinkedIn ou dans un groupe Facebook]
       │
  [Filleul souscrit avec le code]
       │
  [Webhook Stripe → crédit +1 mois]
       │
  [Notification email Sophie]
     "🎉 Ton filleul a rejoint ImmoCrew ! Un mois gratuit a été crédité sur ton compte."
```

---

## Flux utilisateur — Filleul (Jean)

```
[Page pricing ou checkout]
       │
       ▼
[Champ optionnel "Code parrainage"]
  → Jean saisit IMMOCREW-SOPH7K2M
  → Appel POST /api/referral/validate
  → Affichage : "Code valide — 1 semaine offerte sur ton abonnement ✓"
       │
       ▼
[Jean finalise la souscription Stripe]
  → Trial Stripe 7 jours appliqué via `trial_period_days: 7` sur subscription
  → Referral créé en base avec status "pending"
       │
       ▼
[Après 7 jours — premier prélèvement 150€]
  → invoice.payment_succeeded webhook
  → Referral → status "converted"
  → Crédit parrain +1 mois
```

---

## Écrans UI

### Écran 1 — Section parrainage dans le dashboard

**URL** : `/dashboard` (section scrollable ou onglet dédié)

**Contenu** :
```
┌─────────────────────────────────────────────────────┐
│  Parraine tes collègues mandataires                 │
│  Gagne 1 mois gratuit par filleul abonné            │
│                                                     │
│  Ton code :  [IMMOCREW-SOPH7K2M]  [Copier]         │
│  Lien direct : [immocrew.fr/rejoindre?ref=...]  [Copier] │
│                                                     │
│  Tes parrainages : 2 en attente · 1 converti        │
│  Crédit disponible : 1 mois (valeur 150€)           │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ j**@gmail.com     Converti    15 mars 2026   │   │
│  │ m**@gmail.com     En attente  28 mars 2026   │   │
│  │ p**@gmail.com     En attente  30 mars 2026   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**5 états UI** :

| État | Comportement |
|---|---|
| Défaut | Code visible, stats chargées, liste des parrainages |
| Loading | Skeleton sur le code et la liste pendant `GET /api/referral/my-code` |
| Vide (aucun parrainage) | "Tu n'as pas encore parrainé de collègue. Partage ton code !" + boutons copier |
| Erreur API | "Impossible de charger tes parrainages. Réessaie dans quelques instants." |
| Crédit crédité (succès) | Badge "1 mois gratuit crédité !" visible pendant 7 jours après conversion |

---

### Écran 2 — Champ code parrainage au checkout

**URL** : `/checkout` ou intégré dans la page pricing (Stripe Checkout ou form custom)

**Contenu** :
```
┌─────────────────────────────────────────────────────┐
│  Code parrainage (optionnel)                        │
│  ┌────────────────────────────────────────────┐     │
│  │ IMMOCREW-SOPH7K2M                      [×] │     │
│  └────────────────────────────────────────────┘     │
│  ✓ Code valide — 1 semaine offerte sur ton abonnement│
└─────────────────────────────────────────────────────┘
```

**5 états UI** :

| État | Comportement | Message |
|---|---|---|
| Défaut | Champ vide, label "Code parrainage (optionnel)" | — |
| Loading | Spinner pendant `POST /api/referral/validate` (déclenché on blur) | "Vérification..." |
| Valide | Bordure verte + coche | "Code valide — 1 semaine offerte sur ton abonnement" |
| Invalide | Bordure rouge + croix | "Code invalide. Vérifie avec ton parrain." |
| Succès (post-inscription) | Champ masqué, confirmation dans le récap commande | "1 semaine offerte appliquée" |

---

## Critères d'acceptance

### Flux parrain

- [ ] GIVEN Sophie est abonnée Pack Mensuel WHEN elle accède à son dashboard THEN son code IMMOCREW-SOPH7K2M est visible et copiable
- [ ] GIVEN Sophie clique "Copier le lien" WHEN l'action s'exécute THEN le presse-papier contient `https://immocrew.fr/rejoindre?ref=IMMOCREW-SOPH7K2M` et un toast "Lien copié !" s'affiche pendant 3 secondes
- [ ] GIVEN un filleul a payé son premier mois WHEN le webhook `invoice.payment_succeeded` est reçu THEN `referral_credit_months_remaining` de Sophie est incrémenté de 1 dans les 60 secondes
- [ ] GIVEN Sophie a 1 crédit disponible WHEN Stripe déclenche son prochain cycle de facturation THEN la facture est réduite de 150€ via Customer Balance Credit

### Flux filleul

- [ ] GIVEN Jean arrive sur `/checkout` avec `?ref=IMMOCREW-SOPH7K2M` WHEN la page charge THEN le champ code est pré-rempli et validé automatiquement
- [ ] GIVEN Jean saisit un code valide WHEN il finalise sa souscription THEN l'abonnement Stripe démarre avec `trial_period_days: 7`
- [ ] GIVEN Jean saisit un code invalide WHEN il soumet le formulaire THEN le code est ignoré (pas de trial) et un message d'erreur s'affiche sans bloquer la souscription

### Cas limites

- [ ] GIVEN Sophie n'est pas abonnée WHEN elle accède à `/api/referral/my-code` THEN réponse 403 `subscription_required`
- [ ] GIVEN un code est soumis 11 fois en 1 minute depuis la même IP WHEN la 11e requête arrive THEN réponse 429 (rate limit)
- [ ] GIVEN Sophie utilise son propre code comme filleul WHEN elle soumet le formulaire THEN le code est rejeté avec message "Tu ne peux pas utiliser ton propre code"
- [ ] GIVEN un filleul utilise un code puis annule avant 7 jours (avant premier paiement) WHEN l'abonnement est annulé THEN aucun crédit n'est accordé au parrain (status reste "pending")
- [ ] GIVEN deux souscriptions simultanées utilisent le même code WHEN les deux webhooks arrivent THEN un seul referral est créé (idempotence via contrainte unique sur `referral_code_id + referee_user_id`)

### Données existantes

- [ ] GIVEN un utilisateur existant sans code WHEN il accède à l'API `GET /my-code` THEN un code est généré et persisté automatiquement (pas d'erreur "code not found")

---

## Events analytics (Umami)

| Event | Trigger | Propriétés |
|---|---|---|
| `referral_code_copied` | Clic "Copier" (code ou lien) | `type: code|link`, `user_id` |
| `referral_code_validated` | Réponse valide de `/api/referral/validate` | `code`, `referrer_id` |
| `referral_code_invalid` | Réponse invalide de `/api/referral/validate` | `code_prefix` (pas le code complet) |
| `referral_converted` | Webhook `invoice.payment_succeeded` avec parrainage | `referrer_id`, `referee_id` |
| `referral_credit_applied` | Stripe Customer Balance Credit créé | `user_id`, `amount: 150` |

---

## Dépendances et ordre d'implémentation

```
1. Migration DB (tables referral_codes + referrals + colonne users)
2. Génération et persistance du code (GET /api/referral/my-code)
3. Validation du code au checkout (POST /api/referral/validate)
4. Intégration checkout — champ UI + pré-remplissage ?ref=
5. Extension webhook Stripe (invoice.payment_succeeded)
6. Application du crédit via Stripe Customer Balance
7. Section dashboard parrain (UI + GET /api/referral/list)
8. Email notification parrain à la conversion
```

Chaque étape est indépendante une fois la migration DB réalisée. Les étapes 2 à 7 peuvent être développées en parallèle après l'étape 1.

---

## Questions ouvertes (à valider avec le fondateur)

| Question | Proposition retenue | Alternative |
|---|---|---|
| Email parrain masqué ou complet dans la liste ? | Masqué (`j**@gmail.com`) — RGPD prudent | Complet si les parrains sont des contacts directs |
| Le filleul voit-il qui est le parrain ? | Non — juste "Code valide, 1 semaine offerte" | Afficher "Code de Sophie D." pour la social proof |
| Expiration du code parrainage ? | Pas d'expiration | Expirer après 90 jours sans conversion (cleanup BDD) |
| Notification parrain par email ? | Oui, email simple "Ton filleul a rejoint ImmoCrew" | In-app only (badge dashboard) |

---

**Handoff → @fullstack**
- Fichier produit : `/home/user/Mandataire-Immo/docs/product/referral-spec.md`
- Décisions prises : code format `IMMOCREW-{PRENOM}{4_ALPHANUM}`, crédit via Stripe Customer Balance, trial 7j filleul via `trial_period_days`, déclencheur sur `invoice.payment_succeeded`, rate limit 10 req/min sur validate
- Points d'attention :
  - Idempotence du webhook Stripe (Stripe peut renvoyer le même event plusieurs fois — vérifier `referrals.status != 'converted'` avant d'appliquer le crédit)
  - Auto-parrainage à bloquer côté API (comparer `referral_codes.user_id` avec l'utilisateur connecté)
  - Migration DB à exécuter en premier (toutes les autres tâches en dépendent)
  - Le champ `?ref=` dans l'URL doit survivre aux redirections du parcours d'inscription (stocker en `localStorage` ou cookie dès l'arrivée sur le site)
