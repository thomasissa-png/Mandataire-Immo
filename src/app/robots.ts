import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"

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
          "/sign-in",
          "/sign-in/",
          "/sign-up",
          "/sign-up/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
