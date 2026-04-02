# Plan de Tracking PostHog — ImmoCrew

> Produit par @data-analyst | 2026-03-25
> Sources : project-context.md, functional-specs.md, kpi-framework.md
> Outil : PostHog (tier gratuit)
> Convention de nommage : snake_case, verbe_nom (ex : `cta_click`, `deliverable_download`)

---

## 1. Events Landing Page

### 1.1 page_view (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `page_view` |
| **Trigger** | Chargement complet de toute page du site |
| **Priorite** | P0 — indispensable des le MVP |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `page_url` | string | `/`, `/onboarding`, `/espace-client` | Oui |
| `page_title` | string | `Accueil`, `Onboarding`, `Mon espace` | Oui |
| `utm_source` | string | `linkedin`, `facebook`, `google`, `direct` | Non |
| `utm_medium` | string | `social`, `organic`, `referral` | Non |
| `utm_campaign` | string | `dm-avant-apres-mars26` | Non |
| `referrer` | string | `https://linkedin.com/...` | Auto (PostHog) |
| `device_type` | string | `mobile`, `desktop`, `tablet` | Auto (PostHog) |

---

### 1.2 cta_click (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `cta_click` |
| **Trigger** | Clic sur tout bouton CTA de la landing page |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `cta_id` | string | `hero_main`, `hero_secondary`, `pricing_mensuel`, `pricing_trimestriel`, `pricing_annuel`, `pricing_boost`, `footer_main`, `footer_lead` | Oui |
| `cta_text` | string | `Commencer maintenant`, `Voir un exemple pour ma zone` | Oui |
| `cta_location` | string | `hero`, `pricing`, `footer`, `social_proof` | Oui |
| `target_url` | string | `/onboarding`, `https://checkout.stripe.com/...` | Oui |

---

### 1.3 pricing_view (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `pricing_view` |
| **Trigger** | La section pricing entre dans le viewport (scroll atteint la section) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `time_on_page_before_view` | number (sec) | `12` | Oui |
| `scroll_depth_percent` | number | `65` | Oui |

---

### 1.4 faq_expand (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `faq_expand` |
| **Trigger** | Clic sur une question FAQ (accordion) |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `question_id` | string | `faq_1`, `faq_2`, ..., `faq_9` | Oui |
| `question_text` | string | `C'est quoi exactement ImmoCrew ?` | Oui |
| `is_open` | boolean | `true` (ouverture) / `false` (fermeture) | Oui |

---

### 1.5 lead_form_submit (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `lead_form_submit` |
| **Trigger** | Soumission du formulaire "Voir un exemple pour ma zone" (lead magnet) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `ville` | string | `Angers` | Oui |
| `source` | string | `footer_cta`, `hero_cta` | Oui |

---

### 1.6 scroll_depth (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `scroll_depth` |
| **Trigger** | L'utilisateur atteint 25%, 50%, 75%, 100% de la page |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `depth_percent` | number | `25`, `50`, `75`, `100` | Oui |
| `page_url` | string | `/` | Oui |

---

## 2. Events Onboarding

### 2.1 onboarding_start (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `onboarding_start` |
| **Trigger** | Premiere affichage de l'etape 1 du formulaire d'onboarding |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `source` | string | `post_payment`, `invitation`, `direct` | Oui |
| `plan_purchased` | string | `mensuel`, `trimestriel`, `annuel`, `boost` | Oui |

---

### 2.2 onboarding_step_complete (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `onboarding_step_complete` |
| **Trigger** | Validation reussie d'une etape du wizard (clic "Suivant" + validation champs) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `step_number` | number | `1`, `2`, ..., `7` | Oui |
| `step_name` | string | `identite`, `zone_geo`, `specialite`, `ton_branding`, `biens_en_cours`, `reseaux_sociaux`, `recapitulatif` | Oui |
| `time_on_step` | number (sec) | `45` | Oui |
| `fields_filled` | number | `5` (sur 7 disponibles) | Oui |
| `fields_total` | number | `7` | Oui |

---

### 2.3 onboarding_step_abandon (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `onboarding_step_abandon` |
| **Trigger** | L'utilisateur quitte la page onboarding sans avoir complete l'etape en cours (beforeunload ou navigation) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `step_number` | number | `3` | Oui |
| `step_name` | string | `specialite` | Oui |
| `time_on_step` | number (sec) | `120` | Oui |
| `fields_filled` | number | `1` | Oui |

---

### 2.4 onboarding_complete (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `onboarding_complete` |
| **Trigger** | Soumission reussie de la derniere etape (recapitulatif valide) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `total_time` | number (sec) | `320` | Oui |
| `plan_purchased` | string | `lancement`, `mensuel` | Oui |
| `reseau` | string | `IAD`, `SAFTI`, `Capifrance` | Oui |
| `ville` | string | `Angers` | Oui |
| `anciennete` | string | `1-2 ans` | Oui |

---

## 3. Events Espace Client

### 3.1 login (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `login` |
| **Trigger** | Connexion reussie a l'espace client (via Clerk) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `method` | string | `email`, `google`, `magic_link` | Oui |
| `days_since_last_login` | number | `3` | Oui |

---

### 3.2 deliverable_view (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `deliverable_view` |
| **Trigger** | Le client ouvre/consulte un livrable dans son espace |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `deliverable_id` | string | `del_2026_04_post_01` | Oui |
| `deliverable_type` | string | `post_instagram`, `post_facebook`, `article_seo`, `script_video`, `annonce`, `newsletter`, `email_prospection` | Oui |
| `deliverable_month` | string | `2026-04` | Oui |
| `pack_type` | string | `mensuel`, `trimestriel`, `annuel`, `boost` | Oui |
| `is_first_view` | boolean | `true` / `false` | Oui |

---

### 3.3 deliverable_download (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `deliverable_download` |
| **Trigger** | Le client telecharge un livrable (clic bouton "Telecharger" ou "Copier le texte") |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `deliverable_id` | string | `del_2026_04_post_01` | Oui |
| `deliverable_type` | string | `post_instagram`, `article_seo`, `annonce` | Oui |
| `download_format` | string | `copy_text`, `pdf`, `image_png`, `docx` | Oui |
| `pack_type` | string | `mensuel`, `trimestriel`, `annuel`, `boost` | Oui |

---

### 3.4 deliverable_feedback (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `deliverable_feedback` |
| **Trigger** | Le client donne un feedback sur un livrable (pouce haut/bas ou commentaire) |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `deliverable_id` | string | `del_2026_04_post_01` | Oui |
| `deliverable_type` | string | `post_instagram` | Oui |
| `rating` | string | `positive`, `negative` | Oui |
| `comment` | string | `Trop generique, ne mentionne pas mon quartier` | Non |

---

### 3.5 profile_update (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `profile_update` |
| **Trigger** | Le client modifie son profil / ses preferences dans l'espace client |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `fields_updated` | array[string] | `["ville", "quartiers", "ton"]` | Oui |
| `update_count` | number | `3` (nombre de champs modifies) | Oui |

---

### 3.6 support_contact (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `support_contact` |
| **Trigger** | Le client utilise le formulaire de contact ou le chat support depuis l'espace client |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `channel` | string | `form`, `email`, `chat` | Oui |
| `category` | string | `livrable`, `paiement`, `technique`, `autre` | Non |

---

## 4. Events Paiement

### 4.1 checkout_start (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `checkout_start` |
| **Trigger** | Redirection vers Stripe Checkout (clic sur un CTA d'achat) |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `plan` | string | `mensuel`, `trimestriel`, `annuel`, `boost` | Oui |
| `price` | number | `150`, `120`, `100` | Oui |
| `currency` | string | `EUR` | Oui |
| `source_page` | string | `landing_pricing`, `landing_hero`, `espace_client` | Oui |
| `coupon_code` | string | `PARRAIN20` | Non |

---

### 4.2 payment_success (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `payment_success` |
| **Trigger** | Webhook Stripe `checkout.session.completed` ou `invoice.payment_succeeded` |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `plan` | string | `mensuel`, `trimestriel`, `annuel`, `boost` | Oui |
| `amount` | number | `150` | Oui |
| `currency` | string | `EUR` | Oui |
| `is_first_payment` | boolean | `true` / `false` | Oui |
| `stripe_customer_id` | string | `cus_abc123` | Oui |
| `payment_method` | string | `card`, `sepa_debit` | Oui |
| `coupon_code` | string | `PARRAIN20` | Non |

---

### 4.3 payment_failed (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `payment_failed` |
| **Trigger** | Webhook Stripe `invoice.payment_failed` |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `plan` | string | `mensuel` | Oui |
| `amount` | number | `150` | Oui |
| `failure_reason` | string | `card_declined`, `insufficient_funds`, `expired_card` | Oui |
| `retry_count` | number | `1`, `2`, `3` | Oui |
| `stripe_customer_id` | string | `cus_abc123` | Oui |

---

### 4.4 subscription_cancel (P0)

| Champ | Valeur |
|-------|--------|
| **Nom** | `subscription_cancel` |
| **Trigger** | Webhook Stripe `customer.subscription.deleted` ou annulation via Stripe Customer Portal |
| **Priorite** | P0 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `plan` | string | `mensuel` | Oui |
| `months_subscribed` | number | `3` | Oui |
| `cancel_reason` | string | `too_expensive`, `not_useful`, `switching_competitor`, `quitting_business`, `other` | Oui |
| `cancel_feedback` | string | texte libre | Non |
| `mrr_lost` | number | `150` | Oui |

---

### 4.5 subscription_reactivate (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `subscription_reactivate` |
| **Trigger** | Un ancien client se reabonne (nouveau paiement apres une annulation) |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `plan` | string | `mensuel` | Oui |
| `months_since_cancel` | number | `2` | Oui |
| `previous_months_subscribed` | number | `4` | Oui |

---

## 5. Events Engagement

### 5.1 session_start (P0 — automatique PostHog)

| Champ | Valeur |
|-------|--------|
| **Nom** | `$session_start` (event natif PostHog) |
| **Trigger** | Automatique — PostHog gere nativement les sessions |
| **Priorite** | P0 (aucune implementation necessaire) |

**Proprietes natives PostHog :** `$session_id`, `$session_duration`, `$entry_url`, `$referrer`

---

### 5.2 session_end (P0 — automatique PostHog)

| Champ | Valeur |
|-------|--------|
| **Nom** | Calcule par PostHog via session recordings |
| **Trigger** | Automatique |
| **Priorite** | P0 (configuration : activer Session Recordings dans PostHog) |

**Metriques derivees :**
- `session_duration` : duree totale de la session
- `pages_per_session` : nombre de pages vues dans la session
- `bounce_rate` : sessions avec 1 seule page vue / total sessions

---

### 5.3 return_visit (P1)

| Champ | Valeur |
|-------|--------|
| **Nom** | `return_visit` |
| **Trigger** | Un utilisateur deja identifie revient sur le site apres 24h+ d'absence |
| **Priorite** | P1 |

**Proprietes :**

| Propriete | Type | Exemple | Obligatoire |
|-----------|------|---------|-------------|
| `days_since_last_visit` | number | `5` | Oui |
| `visit_count` | number | `3` (3eme visite) | Oui |
| `is_client` | boolean | `true` / `false` | Oui |

---

## 6. Proprietes utilisateur (User Properties)

Ces proprietes sont attachees au profil utilisateur PostHog (via `posthog.identify()`) et permettent la segmentation.

### 6.1 Proprietes d'identification

| Propriete | Type | Source | Moment de mise a jour |
|-----------|------|--------|----------------------|
| `user_id` | string | Clerk user ID | A la creation du compte |
| `email` | string | Clerk | A la creation du compte |
| `prenom` | string | Onboarding etape 1 | Onboarding |
| `nom` | string | Onboarding etape 1 | Onboarding |

### 6.2 Proprietes metier

| Propriete | Type | Source | Moment de mise a jour |
|-----------|------|--------|----------------------|
| `reseau_immo` | string | Onboarding etape 1 | Onboarding + profile_update |
| `anciennete_metier` | string | Onboarding etape 1 | Onboarding |
| `nb_transactions_an` | string | Onboarding etape 1 | Onboarding + annuellement |
| `zone_geo_ville` | string | Onboarding etape 2 | Onboarding + profile_update |
| `zone_geo_code_postal` | string | Onboarding etape 2 | Onboarding |
| `zone_geo_type` | array[string] | Onboarding etape 2 | Onboarding |
| `specialite_biens` | array[string] | Onboarding etape 3 | Onboarding |
| `clientele_cible` | array[string] | Onboarding etape 3 | Onboarding |
| `ton_communication` | string | Onboarding etape 4 | Onboarding + profile_update |

### 6.3 Proprietes commerciales

| Propriete | Type | Source | Moment de mise a jour |
|-----------|------|--------|----------------------|
| `plan` | string (`mensuel`, `trimestriel`, `annuel`, `boost`, `churned`, `lead`) | Stripe webhooks | A chaque changement de statut |
| `signup_date` | date | Creation du compte Clerk | Une seule fois |
| `first_payment_date` | date | Premier `payment_success` | Une seule fois |
| `mrr_contribution` | number | Stripe | A chaque paiement |
| `total_spent` | number | Stripe (cumul) | A chaque paiement |
| `months_subscribed` | number | Calcule | Mensuel |
| `acquisition_channel` | string | `utm_source` du premier `page_view` | Une seule fois (first touch) |
| `referral_source` | string | Champ onboarding "Comment avez-vous connu ImmoCrew?" | Onboarding |
| `coupon_used` | string | Stripe | Premier paiement |

### 6.4 Proprietes d'engagement

| Propriete | Type | Source | Moment de mise a jour |
|-----------|------|--------|----------------------|
| `last_login_date` | date | Event `login` | A chaque login |
| `login_count_30d` | number | Calcule | Quotidien |
| `deliverables_downloaded_30d` | number | Events `deliverable_download` | Quotidien |
| `deliverables_download_rate` | number (%) | downloaded / delivered | Mensuel |
| `engagement_score` | string (`high`, `medium`, `low`, `inactive`) | Calcule (voir ci-dessous) | Hebdomadaire |

**Calcul du score d'engagement :**

| Score | Criteres |
|-------|----------|
| **high** | 3+ logins/mois ET > 80% livrables telecharges ET feedback donne |
| **medium** | 1-2 logins/mois ET > 50% livrables telecharges |
| **low** | 1 login/mois OU < 50% livrables telecharges |
| **inactive** | 0 login depuis 14+ jours |

---

## 7. Segments recommandes PostHog

### 7.1 Segments par plan

| Segment | Filtre PostHog |
|---------|----------------|
| Leads (non payants) | `plan = "lead"` |
| Abonnes annuels | `plan = "annuel"` |
| Abonnes mensuels actifs | `plan = "mensuel"` |
| Abonnes + Boost | `plan = "mensuel" AND has_boost = true` |
| Churned | `plan = "churned"` |

### 7.2 Segments par reseau

| Segment | Filtre PostHog |
|---------|----------------|
| IAD | `reseau_immo = "IAD"` |
| SAFTI | `reseau_immo = "SAFTI"` |
| Capifrance | `reseau_immo = "Capifrance"` |
| Autres reseaux | `reseau_immo NOT IN ("IAD", "SAFTI", "Capifrance")` |

### 7.3 Segments par anciennete client

| Segment | Filtre PostHog |
|---------|----------------|
| Nouveaux (< 30j) | `signup_date > NOW() - 30d` |
| Etablis (1-3 mois) | `signup_date BETWEEN NOW() - 90d AND NOW() - 30d` |
| Fideles (3-6 mois) | `signup_date BETWEEN NOW() - 180d AND NOW() - 90d` |
| Veterans (6+ mois) | `signup_date < NOW() - 180d` |

### 7.4 Segments par engagement

| Segment | Filtre PostHog |
|---------|----------------|
| Power users | `engagement_score = "high"` |
| Engages | `engagement_score = "medium"` |
| A risque | `engagement_score = "low"` |
| Inactifs (alerte churn) | `engagement_score = "inactive" AND plan = "mensuel"` |

### 7.5 Segments par canal d'acquisition

| Segment | Filtre PostHog |
|---------|----------------|
| LinkedIn | `acquisition_channel = "linkedin"` |
| Facebook | `acquisition_channel = "facebook"` |
| SEO / Google | `acquisition_channel = "google"` |
| Parrainage | `referral_source CONTAINS "parrainage"` |
| Team leader | `referral_source CONTAINS "team_leader"` |

---

## 8. Implementation technique — Guide rapide

### 8.1 Installation PostHog (Next.js)

```javascript
// lib/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init('phc_VOTRE_CLE', {
    api_host: 'https://eu.posthog.com', // EU pour RGPD
    capture_pageview: true,              // page_view automatique
    capture_pageleave: true,             // session_end
    session_recording: {
      maskAllInputs: true,               // RGPD : masquer les champs
    },
  })
}

export default posthog
```

### 8.2 Identification utilisateur (apres login Clerk)

```javascript
// Apres authentification Clerk reussie
posthog.identify(clerkUser.id, {
  email: clerkUser.email,
  prenom: clerkUser.firstName,
  plan: 'mensuel',
  reseau_immo: 'IAD',
  signup_date: clerkUser.createdAt,
  zone_geo_ville: 'Angers',
})
```

### 8.3 Exemple d'event custom

```javascript
// cta_click
posthog.capture('cta_click', {
  cta_id: 'pricing_mensuel',
  cta_text: 'Commencer maintenant',
  cta_location: 'pricing',
  target_url: '/checkout/mensuel',
})

// onboarding_step_complete
posthog.capture('onboarding_step_complete', {
  step_number: 2,
  step_name: 'zone_geo',
  time_on_step: 45,
  fields_filled: 4,
  fields_total: 5,
})

// deliverable_download
posthog.capture('deliverable_download', {
  deliverable_id: 'del_2026_04_post_01',
  deliverable_type: 'post_instagram',
  download_format: 'copy_text',
  pack_type: 'mensuel',
})
```

### 8.4 Events serveur (webhooks Stripe)

```javascript
// api/webhooks/stripe.ts — apres reception webhook
import { PostHog } from 'posthog-node'
const posthogServer = new PostHog('phc_VOTRE_CLE', { host: 'https://eu.posthog.com' })

// payment_success
posthogServer.capture({
  distinctId: stripeCustomerId,
  event: 'payment_success',
  properties: {
    plan: 'mensuel',
    amount: 150,
    currency: 'EUR',
    is_first_payment: true,
    stripe_customer_id: stripeCustomerId,
    payment_method: 'card',
  },
})
```

---

## 9. Priorites d'implementation

### P0 — Avant le lancement (semaines 1-2)

| Event | Zone |
|-------|------|
| `page_view` | Landing |
| `cta_click` | Landing |
| `pricing_view` | Landing |
| `lead_form_submit` | Landing |
| `onboarding_start` | Onboarding |
| `onboarding_step_complete` | Onboarding |
| `onboarding_step_abandon` | Onboarding |
| `onboarding_complete` | Onboarding |
| `checkout_start` | Paiement |
| `payment_success` | Paiement |
| `payment_failed` | Paiement |
| `subscription_cancel` | Paiement |
| `login` | Espace client |
| `deliverable_view` | Espace client |
| `deliverable_download` | Espace client |
| User properties (identification) | Global |

### P1 — Mois 1-2

| Event | Zone |
|-------|------|
| `faq_expand` | Landing |
| `scroll_depth` | Landing |
| `deliverable_feedback` | Espace client |
| `profile_update` | Espace client |
| `support_contact` | Espace client |
| `return_visit` | Engagement |
| `subscription_reactivate` | Paiement |
| Segments et cohortes | PostHog |
| Dashboards complets | PostHog |

---

## 10. Conformite RGPD

### Bandeau cookies
PostHog doit etre charge **apres** le consentement cookies (bandeau obligatoire, cf. `docs/legal/legal-audit.md`).

```javascript
// Ne charger PostHog qu'apres consentement
if (userConsent.analytics === true) {
  posthog.opt_in_capturing()
} else {
  posthog.opt_out_capturing()
}
```

### Instance EU
Utiliser l'instance EU de PostHog (`eu.posthog.com`) pour stocker les donnees en Europe.

### Masquage des donnees sensibles
- Activer `maskAllInputs` dans les session recordings
- Ne jamais tracker de donnees financières des clients des mandataires
- Les emails sont trackes uniquement via `posthog.identify()` (lie au compte, pas aux events individuels)

### Politique de retention
- Configurer la retention des donnees PostHog a 12 mois (suffisant pour les cohortes, conforme RGPD)

---

*Document produit par @data-analyst dans le cadre du framework Gradient Agents.*
*Reference : project-context.md, functional-specs.md, kpi-framework.md*
