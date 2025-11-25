"use client"

import { useState } from "react"
import { X, Download, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import shpwrite from "@mapbox/shp-write"

const FORMATS = [
  { id: "geojson", label: "GeoJSON", description: "Standard geospatial format", ext: ".geojson" },
  { id: "shapefile", label: "Shapefile", description: "ArcGIS compatible format", ext: ".zip" },
  { id: "csv", label: "CSV", description: "Comma-separated values", ext: ".csv" },
  { id: "kml", label: "KML", description: "Google Earth format", ext: ".kml" },
]

export default function DownloadModal({ visibleLayers, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState("geojson")
  const [selectedLayers, setSelectedLayers] = useState(visibleLayers.map((l) => l.id))
  const [isDownloading, setIsDownloading] = useState(false)

  const handleToggleLayer = (layerId) => {
    setSelectedLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const handleDownload = async () => {
    if (selectedLayers.length === 0) return

    setIsDownloading(true)
    try {
      if (selectedFormat === "shapefile") {
        const layersToDownload = visibleLayers.filter((l) => selectedLayers.includes(l.id))

        for (const layer of layersToDownload) {
          const url = `/api/geojson/${layer.country}/${layer.name}`
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to fetch data for ${layer.name}`)

          const geojson = await res.json()

          if (!geojson || !geojson.features || geojson.features.length === 0) {
            console.warn(` No features found for layer: ${layer.name}`, geojson)
            continue
          }

          console.log(` Generating Shapefile for ${layer.name} with ${geojson.features.length} features`)

          const options = {
            folder: layer.name,
          }

          const content = await shpwrite.zip(geojson, options)

          let blobData
          if (typeof content === "string") {
            // Convert base64 string to Uint8Array
            const byteCharacters = atob(content)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            blobData = new Uint8Array(byteNumbers)
          } else {
            blobData = content
          }

          const blobUrl = URL.createObjectURL(new Blob([blobData], { type: "application/zip" }))
          const a = document.createElement("a")
          a.href = blobUrl
          a.download = `${layer.name}-${Date.now()}.zip`
          document.body.appendChild(a)
          a.click()
          URL.revokeObjectURL(blobUrl)
          document.body.removeChild(a)
        }

        onClose()
        return
      }

      const downloadPromises = visibleLayers
        .filter((l) => selectedLayers.includes(l.id))
        .map((layer) => {
          const url = `/api/download/${layer.country}/${layer.name}?format=${selectedFormat}`
          return fetch(url).then((res) => {
            if (!res.ok) throw new Error(`Failed to download ${layer.name}`)
            return res.blob()
          })
        })

      const blobs = await Promise.all(downloadPromises)

      const combinedBlob = new Blob(blobs, { type: "application/octet-stream" })
      const url = window.URL.createObjectURL(combinedBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `geospatial-data-${Date.now()}${FORMATS.find((f) => f.id === selectedFormat)?.ext || ""}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onClose()
    } catch (error) {
      console.error(" Download error:", error)
      alert("Failed to download data")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Export Data</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Export Format</label>
            <div className="space-y-2">
              {FORMATS.map((format) => (
                <label
                  key={format.id}
                  className="flex items-center gap-3 p-3 rounded border border-border cursor-pointer hover:bg-secondary/30 transition-colors"
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={selectedFormat === format.id}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{format.label}</p>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Layer Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Select Layers ({selectedLayers.length})</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {visibleLayers.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-secondary/30 transition-colors"
                >
                  <Checkbox
                    checked={selectedLayers.includes(layer.id)}
                    onCheckedChange={() => handleToggleLayer(layer.id)}
                    className="border-border"
                  />
                  <span className="text-sm text-foreground">{layer.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDownloading}
            className="flex-1 border-border text-foreground bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || selectedLayers.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isDownloading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
