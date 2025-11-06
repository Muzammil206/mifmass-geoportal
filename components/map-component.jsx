"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function MapComponent({ layers, onFeatureClick }) {
  const mapRef = useRef(null)
  const layerGroupsRef = useRef({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return

    const map = L.map("map").setView([9.0765, -4.4596], 5) // Center on West Africa

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    setIsInitialized(true)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update layers
  useEffect(() => {
    if (!mapRef.current || !isInitialized) return

    const map = mapRef.current

    // Remove old layer groups
    Object.values(layerGroupsRef.current).forEach((group) => map.removeLayer(group))
    layerGroupsRef.current = {}

    // Add visible layers
    layers.forEach((layer) => {
      const layerGroup = L.layerGroup().addTo(map)
      layerGroupsRef.current[layer.id] = layerGroup

      // Simulate geospatial data (in production, these would be GeoJSON from an API)
      if (layer.id === "rivers") {
        addRiversData(layerGroup, layer.color, onFeatureClick)
      } else if (layer.id === "settlements") {
        addSettlementsData(layerGroup, layer.color, onFeatureClick)
      } else if (layer.id === "administrative") {
        addAdministrativeData(layerGroup, layer.color, onFeatureClick)
      } else if (layer.id === "roads") {
        addRoadsData(layerGroup, layer.color, onFeatureClick)
      } else if (layer.id === "forests") {
        addForestsData(layerGroup, layer.color, onFeatureClick)
      } else if (layer.id === "population") {
        addPopulationData(layerGroup, layer.color, onFeatureClick)
      }
    })
  }, [layers, isInitialized, onFeatureClick])

  return <div id="map" className="w-full h-full" />
}

// Helper functions to add sample data
function addRiversData(group, color, onFeatureClick) {
  const riverLines = [
    [
      [9.5, -4],
      [9.0, -5],
      [8.5, -6],
    ],
    [
      [10.0, -3],
      [9.5, -4],
      [9.0, -5],
    ],
  ]

  riverLines.forEach((coords, idx) => {
    const polyline = L.polyline(coords, {
      color,
      weight: 3,
      opacity: 0.7,
    }).addTo(group)

    polyline.on("click", () => {
      onFeatureClick({
        type: "River",
        name: `River ${idx + 1}`,
        length: `${(Math.random() * 500 + 100).toFixed(0)} km`,
        category: "Natural",
      })
    })
  })
}

function addSettlementsData(group, color, onFeatureClick) {
  const settlements = [
    { name: "Lagos", coords: [6.5244, 3.3792], population: "15 million" },
    { name: "Accra", coords: [5.603, -0.1863], population: "4 million" },
    { name: "Bamako", coords: [12.6395, -8.0029], population: "2.5 million" },
    { name: "Niamey", coords: [13.5116, 2.1257], population: "1.3 million" },
  ]

  settlements.forEach((settlement) => {
    const marker = L.circleMarker([settlement.coords[0], settlement.coords[1]], {
      radius: 8,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    }).addTo(group)

    marker.on("click", () => {
      onFeatureClick({
        type: "Settlement",
        name: settlement.name,
        population: settlement.population,
        category: "Infrastructure",
      })
    })

    marker.bindPopup(`<strong>${settlement.name}</strong><br/>Population: ${settlement.population}`)
  })
}

function addAdministrativeData(group, color, onFeatureClick) {
  // Simplified country boundaries as rectangles
  const countries = [
    {
      name: "Nigeria",
      bounds: [
        [4, 2],
        [14, 15],
      ],
    },
    {
      name: "Ghana",
      bounds: [
        [1.5, -4],
        [11, 1],
      ],
    },
    {
      name: "Mali",
      bounds: [
        [10, -12],
        [25, 4],
      ],
    },
  ]

  countries.forEach((country) => {
    const rect = L.rectangle(country.bounds, {
      color,
      fill: false,
      weight: 2,
      opacity: 0.5,
      dashArray: "5, 5",
    }).addTo(group)

    rect.on("click", () => {
      onFeatureClick({
        type: "Administrative Region",
        name: country.name,
        level: "Country",
        category: "Administrative",
      })
    })
  })
}

function addRoadsData(group, color, onFeatureClick) {
  const roadLines = [
    [
      [6.5, 3.5],
      [7.0, 4.0],
      [7.5, 4.5],
    ],
    [
      [5.5, -0.5],
      [6.0, 0],
      [6.5, 0.5],
    ],
  ]

  roadLines.forEach((coords, idx) => {
    const polyline = L.polyline(coords, {
      color,
      weight: 2,
      opacity: 0.7,
    }).addTo(group)

    polyline.on("click", () => {
      onFeatureClick({
        type: "Road Network",
        name: `Road ${idx + 1}`,
        length: `${(Math.random() * 300 + 50).toFixed(0)} km`,
        category: "Infrastructure",
      })
    })
  })
}

function addForestsData(group, color, onFeatureClick) {
  const forests = [
    [
      [8, -2],
      [9, -1],
      [9, -3],
      [8, -4],
    ],
    [
      [11, -6],
      [12, -5],
      [12, -7],
      [11, -8],
    ],
  ]

  forests.forEach((coords, idx) => {
    const polygon = L.polygon(coords, {
      color,
      fill: true,
      fillOpacity: 0.3,
      weight: 1,
      opacity: 0.7,
    }).addTo(group)

    polygon.on("click", () => {
      onFeatureClick({
        type: "Forest Coverage",
        name: `Forest ${idx + 1}`,
        area: `${(Math.random() * 5000 + 1000).toFixed(0)} sq km`,
        category: "Natural",
      })
    })
  })
}

function addPopulationData(group, color, onFeatureClick) {
  const popCenters = [
    { name: "High Density Zone", coords: [6.5, 3.5], density: "Very High" },
    { name: "Medium Density Zone", coords: [8.0, 2.0], density: "Medium" },
    { name: "Low Density Zone", coords: [10.0, -2.0], density: "Low" },
  ]

  popCenters.forEach((center) => {
    const marker = L.circleMarker([center.coords[0], center.coords[1]], {
      radius: 10,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    }).addTo(group)

    marker.on("click", () => {
      onFeatureClick({
        type: "Population Density",
        name: center.name,
        density: center.density,
        category: "Demographic",
      })
    })
  })
}
