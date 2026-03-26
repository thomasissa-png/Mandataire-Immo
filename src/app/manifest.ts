import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ImmoCrew — L'\u00E9quipe marketing des mandataires immobiliers",
    short_name: "ImmoCrew",
    description:
      "Posts, articles SEO, annonces storytelling, scripts vid\u00E9o. 100% personnalis\u00E9s pour ta zone. \u00C0 partir de 150\u20AC/mois.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F6F2",
    theme_color: "#1B2A4A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
