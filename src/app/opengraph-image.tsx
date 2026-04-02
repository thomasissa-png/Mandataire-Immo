import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ImmoCrew — L'équipe marketing des mandataires immobiliers"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#1B2A4A",
          padding: "60px",
        }}
      >
        {/* Logo maison */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          style={{ marginBottom: "30px" }}
        >
          <path
            d="M8 22V14l8-6 8 6v8"
            stroke="#F27A1A"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 22v-5h6v5"
            stroke="#F27A1A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Titre */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: "20px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          ImmoCrew
        </div>

        {/* Sous-titre */}
        <div
          style={{
            fontSize: "28px",
            color: "#C5CCD9",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          L&apos;équipe marketing des mandataires immobiliers
        </div>

        {/* Ligne orange */}
        <div
          style={{
            width: "120px",
            height: "4px",
            backgroundColor: "#F27A1A",
            borderRadius: "2px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        />

        {/* Prix */}
        <div
          style={{
            fontSize: "22px",
            color: "#F27A1A",
            fontWeight: 600,
          }}
        >
          À partir de 100€/mois · Sans engagement
        </div>
      </div>
    ),
    { ...size }
  )
}
