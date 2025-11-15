"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import InfoPanel from "@/components/info-panel"
import DownloadModal from "@/components/download-modal"
import CountryLayerSidebar from "@/components/country-layer-sidebar"
import LayerMetadataPanel from "@/components/layer-metadata-panel"
import { getAllLayers } from "@/utils/countries-layers"
import dynamic from "next/dynamic";


const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
});

export default function MapPage() {
  const [layers, setLayers] = useState(getAllLayers())
  const [selectedCountry, setSelectedCountry] = useState("ghana")
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedLayerMetadata, setSelectedLayerMetadata] = useState(null)
  const [metadataLayer, setMetadataLayer] = useState(null)
  const [metadataCountry, setMetadataCountry] = useState(null)

  const toggleLayer = (layerId) => {
    setLayers(layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)))
  }

  const getVisibleLayers = () => layers.filter((l) => l.visible)

  const handleShowMetadata = (layer, countryName) => {
    setMetadataLayer(layer)
    setMetadataCountry(countryName)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-4 flex items-center justify-between z-40">
        
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
          visibleLayers={getVisibleLayers()}
          onShowDownloadModal={() => setShowDownloadModal(true)}
          onShowMetadata={handleShowMetadata}
        />

        {/* Map and Info Panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden z-0 max-w-6xl">
          <MapComponent layers={getVisibleLayers()} onFeatureClick={setSelectedFeature} />
          {selectedFeature && <InfoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal visibleLayers={getVisibleLayers()} onClose={() => setShowDownloadModal(false)} />
      )}

      {/* Layer Metadata Panel */}
      {metadataLayer && (
        <LayerMetadataPanel
          layer={metadataLayer}
          country={metadataCountry}
          onClose={() => {
            setMetadataLayer(null)
            setMetadataCountry(null)
          }}
        />
      )}
    </div>
  )
}
