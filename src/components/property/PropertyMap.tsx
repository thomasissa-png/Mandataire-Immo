"use client"

import { useEffect, useRef } from "react"

interface PropertyMapProps {
  lat: number
  lon: number
  titre: string
}

/**
 * Carte Leaflet pour localiser le bien.
 * Charge Leaflet dynamiquement cote client (pas de SSR).
 * Utilise les tuiles OpenStreetMap (gratuit, sans cle API).
 */
export function PropertyMap({ lat, lon, titre }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Charger Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    // Charger Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L
      if (!L || !mapRef.current) return

      const map = L.map(mapRef.current).setView([lat, lon], 15)
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<strong>${titre}</strong>`)
        .openPopup()
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lon, titre])

  return (
    <div
      ref={mapRef}
      className="w-full h-80 rounded-lg overflow-hidden shadow-md"
      aria-label={`Carte du bien : ${titre}`}
    />
  )
}
