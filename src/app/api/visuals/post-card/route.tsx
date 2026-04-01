import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

/**
 * GET /api/visuals/post-card
 * Génère un visuel branded pour un post social.
 * Formats : 1080x1080 (Instagram carré), 1080x1350 (4:5), 1200x630 (LinkedIn)
 *
 * Query params :
 * - type: "citation" | "stat" | "tip" | "quote"
 * - text: texte principal
 * - subtitle: sous-titre (optionnel)
 * - number: chiffre pour stat card (optionnel)
 * - author: auteur pour quote card (optionnel)
 * - format: "square" | "portrait" | "landscape" (défaut: square)
 * - theme: "orange" | "navy" | "white" (défaut: orange)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get("type") || "citation"
  const text = searchParams.get("text") || "Ton contenu ici"
  const subtitle = searchParams.get("subtitle") || ""
  const number = searchParams.get("number") || ""
  const author = searchParams.get("author") || ""
  const format = searchParams.get("format") || "square"
  const theme = searchParams.get("theme") || "orange"

  // Dimensions
  const dimensions: Record<string, { width: number; height: number }> = {
    square: { width: 1080, height: 1080 },
    portrait: { width: 1080, height: 1350 },
    landscape: { width: 1200, height: 630 },
  }
  const { width, height } = dimensions[format] || dimensions.square

  // Couleurs
  const themes: Record<string, { bg: string; text: string; accent: string; subtle: string }> = {
    orange: { bg: "#F27A1A", text: "#FFFFFF", accent: "#1B2A4A", subtle: "rgba(255,255,255,0.7)" },
    navy: { bg: "#1B2A4A", text: "#FFFFFF", accent: "#F27A1A", subtle: "rgba(255,255,255,0.6)" },
    white: { bg: "#FAFAF8", text: "#1B2A4A", accent: "#F27A1A", subtle: "#64748B" },
  }
  const colors = themes[theme] || themes.orange

  // Render le visuel selon le type
  let content: React.ReactElement

  switch (type) {
    case "stat":
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: colors.bg,
            padding: "80px",
          }}
        >
          <div style={{ fontSize: 180, fontWeight: 800, color: colors.text, lineHeight: 1 }}>
            {number}
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: colors.text, marginTop: 24, textAlign: "center", maxWidth: "80%" }}>
            {text}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: colors.subtle, marginTop: 16, textAlign: "center", maxWidth: "70%" }}>
              {subtitle}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.accent }}>Immo</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>Crew</div>
          </div>
        </div>
      )
      break

    case "tip":
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: colors.bg,
            padding: "80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: colors.accent, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: 800, color: colors.bg === "#1B2A4A" ? "#FFFFFF" : "#FFFFFF",
            }}>
              💡
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.subtle }}>
              CONSEIL
            </div>
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: colors.text, lineHeight: 1.3, maxWidth: "90%" }}>
            {text}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: colors.subtle, marginTop: 24, maxWidth: "80%", lineHeight: 1.5 }}>
              {subtitle}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.accent }}>Immo</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>Crew</div>
          </div>
        </div>
      )
      break

    case "quote":
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: colors.bg,
            padding: "80px",
          }}
        >
          <div style={{ fontSize: 120, color: colors.accent, lineHeight: 0.8, marginBottom: 20 }}>
            «
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, color: colors.text, lineHeight: 1.4, maxWidth: "90%", fontStyle: "italic" }}>
            {text}
          </div>
          {author && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40 }}>
              <div style={{ width: 4, height: 40, background: colors.accent, borderRadius: 2 }} />
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>
                {author}
              </div>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.accent }}>Immo</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>Crew</div>
          </div>
        </div>
      )
      break

    default: // citation
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: colors.bg,
            padding: "80px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 700, color: colors.text, lineHeight: 1.3, maxWidth: "85%" }}>
            {text}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: colors.subtle, marginTop: 24, maxWidth: "70%" }}>
              {subtitle}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.accent }}>Immo</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>Crew</div>
          </div>
        </div>
      )
  }

  return new ImageResponse(content, { width, height })
}
