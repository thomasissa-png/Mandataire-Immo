import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#1B2A4A",
          borderRadius: "40px",
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 32 32"
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
      </div>
    ),
    { ...size }
  )
}
