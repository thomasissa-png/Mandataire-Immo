import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    short_name: "ImmoCrew",
    description:
      "Posts, articles SEO, annonces storytelling, scripts vidéo. 100% personnalisés pour ta zone. À partir de 150€/mois.",
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
