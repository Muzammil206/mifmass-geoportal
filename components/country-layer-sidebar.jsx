"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Download, Search, Info, Loader, Globe } from "lucide-react"
import { countriesData } from "@/utils/countries-layers"

export default function CountryLayerSidebar({
  onLayerToggle,
  onCountrySelect,
  selectedCountry,
  visibleLayers,
  onShowDownloadModal,
  onShowMetadata,
  
  layerNotFound, // Add prop
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [countryLayers, setCountryLayers] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})

  useEffect(() => {
    if (!selectedCountry || countryLayers[selectedCountry]) return

    setLoading((prev) => ({ ...prev, [selectedCountry]: true }))
    const fetchLayers = async () => {
      try {
        const response = await fetch(`/api/layers/${selectedCountry}`)
        if (!response.ok) throw new Error("Failed to fetch layers")
        const data = await response.json()
        const formattedLayers = data.map((layer, index) => ({
          id: layer.layer_name.toLowerCase().replace(/\s+/g, "_"),
          name: layer.layer_name,
          geom_type: layer.geom_type,
          country: selectedCountry,
          color: `hsl(${(index * 45) % 360}, 70%, 50%)`,
        }))
        setCountryLayers((prev) => ({ ...prev, [selectedCountry]: formattedLayers }))
      } catch (err) {
        console.error(` Error fetching layers for ${selectedCountry}:`, err)
        setError((prev) => ({ ...prev, [selectedCountry]: "Failed to load layers" }))
      } finally {
        setLoading((prev) => ({ ...prev, [selectedCountry]: false }))
      }
    }
    fetchLayers()
  }, [selectedCountry]) // Removed countryLayers dependency to prevent infinite loop if not careful, though previous code checked existence.

  const currentLayers = countryLayers[selectedCountry] || []
  const isLoading = loading[selectedCountry]
  const hasError = error[selectedCountry]

  const filteredLayers = currentLayers.filter(
    (layer) =>
      !searchQuery ||
      layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layer.geom_type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const visibleCount = visibleLayers.length

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 absolute md:relative z-30 md:z-10 h-full w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 overflow-hidden shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 space-y-4 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className=" text-gray-900 text-sm">
              Data Layers {visibleCount} of {currentLayers.length} visible
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            Select Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              onCountrySelect(e.target.value)
              setSearchQuery("")
            }}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-colors cursor-pointer"
          >
            {countriesData.map((country) => (
              <option key={country.id} value={country.id} defaultValue={country.id === selectedCountry ? country.id : ''}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-3 bg-gray-50">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader className="w-6 h-6 animate-spin text-green-600" />
            <p className="text-sm text-gray-600">Loading layers...</p>
          </div>
        )}

        {hasError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{hasError}</p>
          </div>
        )}

        {!isLoading && layerNotFound && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <p className="text-sm font-medium text-yellow-800">Layer Not Found</p>
            <p className="text-xs text-yellow-700 mt-1">
              The layer "{layerNotFound}" could not be found in{" "}
              {countriesData.find((c) => c.id === selectedCountry)?.name || selectedCountry}. Please select another
              layer from the list below.
            </p>
          </div>
        )}

        {!isLoading && !hasError && filteredLayers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-sm text-gray-600">No layers found</p>
            <p className="text-xs text-gray-500">
              {searchQuery ? "Try a different search" : "Select a country to view layers"}
            </p>
          </div>
        )}

        {!isLoading &&
          !hasError &&
          filteredLayers.map((layer) => {
            const isVisible = visibleLayers.some((l) => l.id === layer.id)

            return (
              <div
                key={layer.id}
                className="p-4 bg-secondary/30 hover:bg-secondary/50 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all"
              >
                {/* Layer Card Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Checkbox
                    checked={isVisible}
                    onCheckedChange={() => onLayerToggle(layer.id, selectedCountry, layer)}
                    className="mt-1 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{layer.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{layer.geom_type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onShowMetadata(layer, countriesData.find((c) => c.id === selectedCountry)?.name, selectedCountry)
                    }
                    className="p-1.5 h-auto hover:bg-green-100 rounded-md transition-colors shrink-0 -mr-2"
                  >
                    <Info className="w-4 h-4 text-gray-500 hover:text-green-600" />
                  </Button>
                </div>

                {/* Color Indicator */}
                <div className="flex items-center gap-2 px-7">
                  <div
                    className="w-2 h-2 rounded-full border border-gray-300"
                    style={{ backgroundColor: layer.color }}
                  />
                  <p className="text-xs text-gray-500">{isVisible ? "Visible on map" : "Click to show"}</p>
                </div>
              </div>
            )
          })}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
        <Button
          onClick={onShowDownloadModal}
          disabled={visibleCount === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 disabled:bg-gray-300 disabled:text-gray-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Layers
        </Button>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
          <p>
            {visibleCount} layer{visibleCount !== 1 ? "s" : ""} ready to export
          </p>
        </div>
      </div>
    </aside>
  )
}
