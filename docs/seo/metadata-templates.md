# Metadata Templates — ImmoCrew

> Produit par @seo | 2026-03-25
> Sources : seo-strategy.md, keyword-map.md, layout.tsx (audit code), landing-page-copy.md
> Stack : Next.js 14 App Router — export `metadata` et `generateMetadata`

---

## 1. Corrections layout.tsx — Metadata globales

### Problème actuel

Le layout.tsx existant contient des strings sans accents (encodage ASCII). Exemple : "equipe" au lieu de "équipe", "recois" au lieu de "reçois".

### Correction à appliquer dans `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    template: "%s | ImmoCrew",
  },
  description:
    "Chaque mois, reçois tes posts, tes articles SEO et tes annonces — 100% personnalisés pour ta zone. Tu publies, on fait le reste. À partir de 197€/mois.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    description:
      "Posts, articles SEO, annonces storytelling, scripts vidéo. 100% personnalisés pour ta zone. À partir de 197€/mois.",
    type: "website",
    locale: "fr_FR",
    url: "https://immocrew.fr",
    siteName: "ImmoCrew",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    description:
      "Posts, articles SEO, annonces storytelling. 100% personnalisés. À partir de 197€/mois.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
```

Note : le champ `title` utilise maintenant le format `{ default, template }` pour que les pages enfants puissent afficher "Titre de la page | ImmoCrew" automatiquement.

---

## 2. Templates metadata par type de page

### 2.1 Landing page principale (/)

Fichier : `src/app/page.tsx`

```typescript
export const metadata: Metadata = {
  title: "ImmoCrew — Marketing pour mandataires immobiliers | 197€/mois",
  description:
    "Externalise ton marketing immobilier. Chaque mois : 12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo — 100% personnalisés pour ta zone. À partir de 197€/mois.",
  alternates: {
    canonical: "https://immocrew.fr",
  },
  openGraph: {
    title: "ImmoCrew — Marketing pour mandataires immobiliers | 197€/mois",
    description:
      "12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo par mois. 100% personnalisés pour ta zone. Tu publies, on fait le reste.",
    url: "https://immocrew.fr",
  },
}
```

Règles pour le title landing :
- Longueur : 50-60 caractères idéalement (60 max avant troncature Google)
- Inclure le prix (197€/mois) — différenciant fort dans les SERPs
- Mot-clé cible : "mandataires immobiliers" en position centrale

### 2.2 Page Tarifs (/tarifs)

Fichier : `src/app/tarifs/page.tsx` (à créer)

```typescript
export const metadata: Metadata = {
  title: "Tarifs — Pack marketing immobilier mandataire | ImmoCrew",
  description:
    "Pack Mensuel 197€/mois · Pack Lancement 497€ · Boost Mandat 97€. Marketing complet pour mandataires immobiliers indépendants. Sans engagement, résiliation libre.",
  alternates: {
    canonical: "https://immocrew.fr/tarifs",
  },
  openGraph: {
    title: "Tarifs ImmoCrew — Marketing immobilier pour mandataires",
    description:
      "Pack mensuel 197€ · Pack lancement 497€ · Boost mandat 97€. Tout inclus : posts, articles SEO, annonces, scripts vidéo.",
    url: "https://immocrew.fr/tarifs",
  },
}
```

### 2.3 Hub Blog (/blog)

Fichier : `src/app/blog/page.tsx` (à créer)

```typescript
export const metadata: Metadata = {
  title: "Blog ImmoCrew — Marketing et SEO pour mandataires immobiliers",
  description:
    "Conseils concrets de marketing digital pour mandataires immobiliers indépendants : réseaux sociaux, SEO local, annonces, personal branding. Gratuit.",
  alternates: {
    canonical: "https://immocrew.fr/blog",
  },
  openGraph: {
    title: "Blog ImmoCrew — Marketing et SEO pour mandataires immobiliers",
    description:
      "Guides pratiques pour votre présence digitale : posts, annonces, SEO local, Google Business Profile.",
    url: "https://immocrew.fr/blog",
  },
}
```

### 2.4 Articles de blog — Template generateMetadata

Fichier : `src/app/blog/[slug]/page.tsx` (à créer)

```typescript
// Types pour les articles (à adapter selon structure Supabase)
type Article = {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
}

// Fonction de génération des metadata par article
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Récupérer l'article depuis Supabase ou fichier MDX
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: "Article introuvable",
    }
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://immocrew.fr/blog/${params.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["ImmoCrew"],
      url: `https://immocrew.fr/blog/${params.slug}`,
      images: article.image
        ? [{ url: article.image, width: 1200, height: 630 }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  }
}
```

### 2.5 Landing pages locales — Template generateMetadata

Fichier : `src/app/marketing-immobilier-[ville]/page.tsx` (Phase 2)

```typescript
// Villes cibles Phase 2
const VILLES = {
  lyon: { nom: "Lyon", departement: "Rhône (69)", marche: "marché lyonnais" },
  toulouse: { nom: "Toulouse", departement: "Haute-Garonne (31)", marche: "marché toulousain" },
  bordeaux: { nom: "Bordeaux", departement: "Gironde (33)", marche: "marché bordelais" },
  marseille: { nom: "Marseille", departement: "Bouches-du-Rhône (13)", marche: "marché marseillais" },
  nantes: { nom: "Nantes", departement: "Loire-Atlantique (44)", marche: "marché nantais" },
}

export async function generateMetadata({
  params,
}: {
  params: { ville: string }
}): Promise<Metadata> {
  const ville = VILLES[params.ville as keyof typeof VILLES]
  if (!ville) return { title: "Page introuvable" }

  return {
    title: `Marketing immobilier ${ville.nom} — Pour mandataires | ImmoCrew`,
    description: `Externalisez votre marketing immobilier à ${ville.nom}. Posts personnalisés pour le ${ville.marche}, articles SEO local, annonces storytelling. À partir de 197€/mois.`,
    alternates: {
      canonical: `https://immocrew.fr/marketing-immobilier-${params.ville}`,
    },
    openGraph: {
      title: `Marketing immobilier ${ville.nom} — Pour mandataires | ImmoCrew`,
      description: `Contenu marketing personnalisé pour le ${ville.marche}. Posts, articles SEO, annonces. À partir de 197€/mois.`,
      url: `https://immocrew.fr/marketing-immobilier-${params.ville}`,
    },
  }
}
```

---

## 3. Fichiers techniques SEO à créer

### 3.1 `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from "next"

// À remplacer par une vraie requête Supabase quand le blog est implémenté
async function getBlogSlugs(): Promise<string[]> {
  // const { data } = await supabase.from("articles").select("slug").eq("published", true)
  // return data?.map((a) => a.slug) ?? []
  return [] // Phase 1 : retourne un tableau vide
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://immocrew.fr"
  const blogSlugs = await getBlogSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tarifs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
```

### 3.2 `src/app/robots.ts`

```typescript
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/onboarding",
          "/onboarding/",
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://immocrew.fr/sitemap.xml",
  }
}
```

---

## 4. Structured Data JSON-LD

### 4.1 Organization (layout.tsx — toutes les pages)

Injecter dans `src/app/layout.tsx` via un composant `<Script>` ou directement dans `<head>` :

```typescript
// Composant JsonLd à créer dans src/components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Données Organization :

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ImmoCrew",
  "url": "https://immocrew.fr",
  "logo": "https://immocrew.fr/logo.png",
  "description": "Équipe marketing externalisée pour mandataires immobiliers indépendants. Posts, articles SEO, annonces storytelling, scripts vidéo — 100% personnalisés.",
  "foundingDate": "2026",
  "areaServed": "FR",
  "serviceArea": {
    "@type": "Country",
    "name": "France"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": "French"
  },
  "sameAs": [
    "https://www.linkedin.com/company/immocrew",
    "https://www.instagram.com/immocrew"
  ]
}
```

### 4.2 Service (page.tsx — landing)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Pack Mensuel ImmoCrew",
  "description": "Service de marketing externalisé pour mandataires immobiliers indépendants. Chaque mois : 12 posts personnalisés, 2 articles SEO local, 4 annonces storytelling, 4 scripts vidéo, 1 newsletter, 1 email prospection.",
  "provider": {
    "@type": "Organization",
    "name": "ImmoCrew",
    "url": "https://immocrew.fr"
  },
  "areaServed": "FR",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Packs ImmoCrew",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Pack Mensuel",
        "description": "12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo, 1 newsletter, 1 email prospection — par mois",
        "price": "197",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "RecurringCharges",
          "billingIncrement": 1,
          "billingPeriod": "P1M"
        }
      },
      {
        "@type": "Offer",
        "name": "Pack Lancement",
        "description": "Positionnement, bio optimisée, 5 templates annonces, 5 articles SEO local, calendrier éditorial 30j, 20 posts, 10 scripts Reels, kit graphique",
        "price": "497",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Boost Mandat",
        "description": "Annonce storytelling, 3 posts + 1 Reel dédiés, mini landing page, email blast acheteurs",
        "price": "97",
        "priceCurrency": "EUR"
      }
    ]
  }
}
```

### 4.3 FAQPage (section FAQ de la landing)

Questions basées sur les objections réelles de Sophie et Thomas (personas.md) :

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Est-ce que le contenu est vraiment personnalisé pour ma zone ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui. Lors de l'onboarding, tu nous indiques ta zone géographique précise (quartier, communes), tes biens en portefeuille, ton ton de communication et ton style. Chaque contenu est rédigé avec les données locales réelles : noms des quartiers, des écoles, des commerces, prix au m² de ta zone. Ce n'est pas un template avec le nom de ta ville en variable."
      }
    },
    {
      "@type": "Question",
      "name": "Combien de temps dois-je consacrer à ImmoCrew chaque mois ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Environ 15-20 minutes par mois. Tu reçois tes livrables par email, tu les ouvres, tu copies-colles sur tes réseaux, et c'est tout. Pas de logiciel à apprendre, pas de template à adapter, pas de Canva."
      }
    },
    {
      "@type": "Question",
      "name": "Quelle est la différence avec Cocoon-Immo ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cocoon-Immo est une plateforme — un outil que tu utilises toi-même pour créer ton contenu. ImmoCrew, c'est une équipe qui fait le travail à ta place. Tu ne crées rien. Tu reçois tes posts, articles et annonces déjà rédigés, prêts à publier. De plus, ImmoCrew est conçu spécifiquement pour les mandataires indépendants, pas pour les agences."
      }
    },
    {
      "@type": "Question",
      "name": "Et si le contenu ne me convient pas ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Satisfaction garantie 14 jours. Si après le premier mois tu n'es pas satisfait, on te rembourse intégralement. Sans question. En pratique, chaque livrable est validé par notre équipe avant envoi — si quelque chose ne correspond pas à ton style ou à ta zone, on le reprend."
      }
    },
    {
      "@type": "Question",
      "name": "Est-ce que ça fonctionne vraiment pour un mandataire indépendant solo ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImmoCrew a été conçu exclusivement pour les mandataires indépendants — pas pour les agences, pas pour les équipes. Sophie, mandataire IAD depuis 2 ans avec 4-5 ventes par an, est exactement notre client cible. On connaît tes contraintes : pas d'équipe, pas de budget marketing, pas le temps d'apprendre Canva."
      }
    },
    {
      "@type": "Question",
      "name": "Puis-je arrêter quand je veux ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui. Le Pack Mensuel est sans engagement. Tu peux résilier à tout moment depuis ton espace client, sans frais, sans préavis."
      }
    }
  ]
}
```

### 4.4 Article (pages de blog — [slug]/page.tsx)

Template à générer dynamiquement :

```typescript
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://immocrew.fr/og-image.jpg",
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt || article.publishedAt,
  "author": {
    "@type": "Organization",
    "name": "ImmoCrew",
    "url": "https://immocrew.fr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ImmoCrew",
    "logo": {
      "@type": "ImageObject",
      "url": "https://immocrew.fr/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://immocrew.fr/blog/${article.slug}`
  }
}
```

### 4.5 BreadcrumbList (pages blog et secondaires)

```typescript
// Exemple pour un article de blog
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://immocrew.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://immocrew.fr/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": article.title,
      "item": `https://immocrew.fr/blog/${article.slug}`
    }
  ]
}
```

---

## 5. Récapitulatif — Checklist d'implémentation

### Priorité 1 — Semaine 1 (fondations)

- [ ] Corriger layout.tsx : remplacer les strings sans accents par les versions correctes
- [ ] Ajouter `title: { default, template }` dans layout.tsx pour les pages enfants
- [ ] Ajouter `og:image` (créer le visuel `/public/og-image.jpg` — 1200x630px)
- [ ] Ajouter `twitter:card` et `twitter:images` dans layout.tsx
- [ ] Créer `src/app/sitemap.ts`
- [ ] Créer `src/app/robots.ts`
- [ ] Créer `src/components/JsonLd.tsx`
- [ ] Implémenter JSON-LD Organization dans layout.tsx
- [ ] Implémenter JSON-LD Service dans page.tsx (landing)

### Priorité 2 — Semaine 2-3 (blog et FAQ)

- [ ] Implémenter JSON-LD FAQPage dans le composant FAQ de la landing
- [ ] Créer `src/app/blog/page.tsx` avec metadata hub blog
- [ ] Créer `src/app/blog/[slug]/page.tsx` avec generateMetadata et JSON-LD Article
- [ ] Valider les structured data via [Rich Results Test Google](https://search.google.com/test/rich-results)

### Priorité 3 — Mois 2-3 (pages secondaires)

- [ ] Créer `src/app/tarifs/page.tsx` avec metadata dédiées
- [ ] Créer les landing pages locales avec generateMetadata dynamique

---

## 6. Validation et tests

Après implémentation, tester systématiquement :
- [Rich Results Test](https://search.google.com/test/rich-results) : FAQPage, Article, Service
- [Open Graph Debugger Facebook](https://developers.facebook.com/tools/debug/) : og:image, og:title, og:description
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) : twitter:card
- [Google Search Console](https://search.google.com/search-console) : Coverage, Sitemaps
- [PageSpeed Insights](https://pagespeed.web.dev/) : Core Web Vitals LCP / INP / CLS
