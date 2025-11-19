"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from 'lucide-react'
import MapComponent from "@/components/map-component"
import InfoPanel from "@/components/info-panel"
import DownloadModal from "@/components/download-modal"
import CountryLayerSidebar from "@/components/country-layer-sidebar"
import LayerMetadataPanel from "@/components/layer-metadata-panel"

export default function MapPage() {
  const [visibleLayers, setVisibleLayers] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("ghana")
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedLayerMetadata, setSelectedLayerMetadata] = useState(null)
  const [metadataLayer, setMetadataLayer] = useState(null)
  const [metadataCountry, setMetadataCountry] = useState(null)
  const [metadataCountryId, setMetadataCountryId] = useState(null)

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
          <h1 className="text-xl md:text-2xl font-bold text-foreground">GeoPortal</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Explore geospatial data across West Africa</p>
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
        />

        {/* Map and Info Panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden z-0 max-w-6xl">
          <MapComponent layers={visibleLayers} onFeatureClick={setSelectedFeature} />
          {selectedFeature && <InfoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal visibleLayers={visibleLayers} onClose={() => setShowDownloadModal(false)} />
      )}

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
