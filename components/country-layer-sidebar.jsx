"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, X, Download, Search, Info, Loader } from 'lucide-react'
import { countriesData } from "@/utils/countries-layers"

export default function CountryLayerSidebar({
  onLayerToggle,
  onCountrySelect,
  selectedCountry,
  visibleLayers,
  onShowDownloadModal,
  onShowMetadata,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCountries, setExpandedCountries] = useState({
    ghana: true,
    nigeria_ona_river_basin: false,
    benin: false,
    burkina: false,
    cote: false,
    mali: false,
  })
  const [countryLayers, setCountryLayers] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})

  useEffect(() => {
    const fetchCountryLayers = async (countryId) => {
      if (countryLayers[countryId]) return // Already loaded

      setLoading((prev) => ({ ...prev, [countryId]: true }))
      try {
        const response = await fetch(`/api/layers/${countryId}`)
        if (!response.ok) throw new Error("Failed to fetch layers")
        const data = await response.json()
        const formattedLayers = data.map((layer, index) => ({
          id: layer.layer_name.toLowerCase().replace(/\s+/g, "_"),
          name: layer.layer_name,
          geom_type: layer.geom_type,
          country: countryId,
          color: `hsl(${(index * 45) % 360}, 70%, 50%)`,
        }))
        setCountryLayers((prev) => ({ ...prev, [countryId]: formattedLayers }))
      } catch (err) {
        console.error(`[v0] Error fetching layers for ${countryId}:`, err)
        setError((prev) => ({ ...prev, [countryId]: "Failed to load layers" }))
      } finally {
        setLoading((prev) => ({ ...prev, [countryId]: false }))
      }
    }

    // Fetch layers for expanded countries
    Object.entries(expandedCountries).forEach(([countryId, isExpanded]) => {
      if (isExpanded && !countryLayers[countryId]) {
        fetchCountryLayers(countryId)
      }
    })
  }, [expandedCountries, countryLayers])

  const toggleCountry = (countryId) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [countryId]: !prev[countryId],
    }))
  }

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countriesData

    return countriesData.filter((country) => {
      const layers = countryLayers[country.id] || []
      const matchingLayers = layers.filter(
        (layer) =>
          layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          layer.geom_type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      return matchingLayers.length > 0 || country.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [searchQuery, countryLayers])

  const visibleCount = visibleLayers.length
  const totalLayers = Object.values(countryLayers).reduce((sum, layers) => sum + (layers?.length || 0), 0)

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 absolute md:relative z-30 md:z-10 h-full w-96 bg-card border-r border-border flex flex-col transition-transform duration-300 overflow-hidden shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-border space-y-4 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-base">Data Layers</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {visibleCount} of {totalLayers} visible
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search countries & layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background border-border text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>

      {/* Countries List */}
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {filteredCountries.map((country) => {
          const layers = countryLayers[country.id] || []
          const isLoading = loading[country.id]
          const hasError = error[country.id]

          const filteredLayers = layers.filter(
            (layer) =>
              !searchQuery ||
              layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              layer.geom_type.toLowerCase().includes(searchQuery.toLowerCase()),
          )

          return (
            <div
              key={country.id}
              className="border border-border rounded-lg overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              {/* Country Header */}
              <button
                onClick={() => {
                  toggleCountry(country.id)
                  onCountrySelect(country.id)
                }}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors ${
                  selectedCountry === country.id ? "bg-secondary border-l-4 border-accent" : ""
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-foreground">{country.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isLoading ? "Loading..." : filteredLayers.length + " layers available"}
                  </p>
                </div>
                {expandedCountries[country.id] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Layers List */}
              {expandedCountries[country.id] && (
                <div className="border-t border-border bg-background/50">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {hasError && (
                    <div className="p-4 text-xs text-destructive text-center">{hasError}</div>
                  )}
                  {!isLoading && !hasError && filteredLayers.length === 0 && (
                    <div className="p-4 text-xs text-muted-foreground text-center">No layers available</div>
                  )}
                  {!isLoading &&
                    !hasError &&
                    filteredLayers.map((layer) => {
                      const isVisible = visibleLayers.some((l) => l.id === layer.id)

                      return (
                        <div
                          key={layer.id}
                          className="flex items-center gap-2 p-3 border-b border-border last:border-b-0 hover:bg-secondary/40 transition-colors group"
                        >
                          <Checkbox
                            checked={isVisible}
                            onCheckedChange={() => onLayerToggle(layer.id, country.id, layer)}
                            className="border-border"
                          />
                          <div
                            className="w-3 h-3 rounded-full shrink-0 ring-1 ring-offset-1 ring-border"
                            style={{ backgroundColor: layer.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{layer.name}</p>
                            <p className="text-xs text-muted-foreground">{layer.geom_type}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShowMetadata(layer, country.name, country.id)}
                            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-4 space-y-3 bg-secondary/20">
        <Button
          onClick={onShowDownloadModal}
          disabled={visibleCount === 0}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Layers
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {visibleCount} layer{visibleCount !== 1 ? "s" : ""} ready to export
        </p>
      </div>
    </aside>
  )
}
