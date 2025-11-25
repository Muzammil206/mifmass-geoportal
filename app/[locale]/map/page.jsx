"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import MapComponent from "@/components/map-component"
import InfoPanel from "@/components/info-panel"
import DownloadModal from "@/components/download-modal"
import CountryLayerSidebar from "@/components/country-layer-sidebar"
import LayerMetadataPanel from "@/components/layer-metadata-panel"
import Image from "next/image"
import { countriesData } from "@/utils/countries-layers"

function MapContent() {
  const searchParams = useSearchParams()
  const [visibleLayers, setVisibleLayers] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("ghana_black_volta")
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedLayerMetadata, setSelectedLayerMetadata] = useState(null)
  const [metadataLayer, setMetadataLayer] = useState(null)
  const [metadataCountry, setMetadataCountry] = useState(null)
  const [metadataCountryId, setMetadataCountryId] = useState(null)
  const [layerNotFound, setLayerNotFound] = useState(null)

  const initialViewState =
    searchParams.get("lat") && searchParams.get("lng")
      ? {
          latitude: Number.parseFloat(searchParams.get("lat")),
          longitude: Number.parseFloat(searchParams.get("lng")),
          zoom: Number.parseFloat(searchParams.get("zoom") || 10),
        }
      : null

  const resolveCountryId = (param) => {
    if (!param) return null
    const lowerParam = param.toLowerCase()

    // 1. Try exact ID match
    const exactMatch = countriesData.find((c) => c.id.toLowerCase() === lowerParam)
    if (exactMatch) return exactMatch.id

    // 2. Try partial ID match (e.g. "nigeria" matches "nigeria_ona_river_basin")
    const partialIdMatch = countriesData.find((c) => c.id.toLowerCase().includes(lowerParam))
    if (partialIdMatch) return partialIdMatch.id

    // 3. Try name match
    const nameMatch = countriesData.find((c) => c.name.toLowerCase().includes(lowerParam))
    if (nameMatch) return nameMatch.id

    return null
  }

  useEffect(() => {
    const countryParam = searchParams.get("country")
    const activeLayerParam = searchParams.get("activeLayer")

    if (countryParam) {
      const resolvedId = resolveCountryId(countryParam)
      if (resolvedId) {
        setSelectedCountry(resolvedId)

        if (activeLayerParam) {
          fetch(`/api/layers/${resolvedId}`)
            .then((res) => res.json())
            .then((layers) => {
              const matchingLayer = layers.find(
                (l) =>
                  l.layer_name.toLowerCase().replace(/\s+/g, "_") === activeLayerParam ||
                  l.layer_name.toLowerCase() === activeLayerParam.toLowerCase(),
              )

              if (matchingLayer) {
                const formattedLayer = {
                  id: matchingLayer.layer_name.toLowerCase().replace(/\s+/g, "_"),
                  name: matchingLayer.layer_name,
                  geom_type: matchingLayer.geom_type,
                  country: resolvedId,
                  color: `hsl(0, 70%, 50%)`,
                }
                setVisibleLayers((prev) => {
                  if (!prev.some((l) => l.id === formattedLayer.id)) {
                    return [...prev, formattedLayer]
                  }
                  return prev
                })
                setLayerNotFound(null)
              } else {
                setLayerNotFound(activeLayerParam)
              }
            })
            .catch((err) => {
              console.error("Error loading initial layer:", err)
              setLayerNotFound(activeLayerParam)
            })
        }
      }
    }
  }, [searchParams])

  const toggleLayer = (layerId, countryId, layerData) => {
    setVisibleLayers((prev) => {
      const exists = prev.some((l) => l.id === layerId)
      if (exists) {
        return prev.filter((l) => l.id !== layerId)
      } else {
        return [
          ...prev,
          {
            ...layerData,
            id: layerId,
            country: countryId,
          },
        ]
      }
    })
  }

  const handleShowMetadata = (layer, countryName, countryId) => {
    setMetadataLayer(layer)
    setMetadataCountry(countryName)
    setMetadataCountryId(countryId)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-4 flex items-center justify-between z-40">
        <div>
          <Image src="/logo2.png" alt="GeoPortal Logo" width={150} height={90} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden border-border"
        >
          {sidebarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <CountryLayerSidebar
          onLayerToggle={toggleLayer}
          onCountrySelect={setSelectedCountry}
          selectedCountry={selectedCountry}
          visibleLayers={visibleLayers}
          onShowDownloadModal={() => setShowDownloadModal(true)}
          onShowMetadata={handleShowMetadata}
          layerNotFound={layerNotFound} // Pass not found state
        />

        {/* Map and Info Panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden z-0 max-w-6xl">
          <MapComponent
            layers={visibleLayers}
            onFeatureClick={setSelectedFeature}
            initialViewState={initialViewState} // Pass initial view state
          />
          {selectedFeature && <InfoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && <DownloadModal visibleLayers={visibleLayers} onClose={() => setShowDownloadModal(false)} />}

      {/* Layer Metadata Panel */}
      {metadataLayer && (
        <LayerMetadataPanel
          layer={metadataLayer}
          country={metadataCountry}
          countryId={metadataCountryId}
          onClose={() => {
            setMetadataLayer(null)
            setMetadataCountry(null)
            setMetadataCountryId(null)
          }}
        />
      )}
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading map...</div>}>
      <MapContent />
    </Suspense>
  )
}
