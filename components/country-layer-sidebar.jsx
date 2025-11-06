"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, X, Download, Search, Info } from "lucide-react"
import { countriesData } from "@/utils/countries-layers"

export default function CountryLayerSidebar({
  onLayerToggle,
  onCountrySelect,
  selectedCountry,
  visibleLayers,
  onShowDownloadModal,
  onShowMetadata,
}) {
  const [expandedCountries, setExpandedCountries] = useState({
    ghana: true,
    nigeria: false,
    benin: false,
    burkina: false,
    cote: false,
    mali: false,
  })
  const [expandedCategories, setExpandedCategories] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleCountry = (countryId) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [countryId]: !prev[countryId],
    }))
  }

  const toggleCategory = (categoryKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }))
  }

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countriesData

    return countriesData
      .map((country) => ({
        ...country,
        layers: country.layers.filter(
          (layer) =>
            layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            layer.category.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((country) => country.layers.length > 0 || country.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const visibleCount = visibleLayers.length
  const totalLayers = countriesData.reduce((sum, c) => sum + c.layers.length, 0)

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 absolute md:relative z-30 md:z-10 h-full w-96 bg-card border-r border-border flex flex-col transition-transform duration-300 overflow-hidden shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-border space-y-4 bg-secondary/20">
      
      <div>
          <div className="flex items-center">
          <img src="/logo2.png" alt="GeoPortal" className="w-[250px] h-[60px] pb-4" />
          
          </div>
        </div>

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
          const countryLayers = country.layers.filter(
            (layer) =>
              !searchQuery ||
              layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              layer.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )

          const layersByCategory = countryLayers.reduce((acc, layer) => {
            if (!acc[layer.category]) {
              acc[layer.category] = []
            }
            acc[layer.category].push(layer)
            return acc
          }, {})

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
                  <p className="text-xs text-muted-foreground mt-0.5">{countryLayers.length} layers available</p>
                </div>
                {expandedCountries[country.id] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {/* Layers List by Category */}
              {expandedCountries[country.id] && (
                <div className="border-t border-border bg-background/50">
                  {Object.entries(layersByCategory).map(([category, layers]) => {
                    const categoryKey = `${country.id}-${category}`
                    const isExpanded = expandedCategories[categoryKey] !== false

                    return (
                      <div key={categoryKey}>
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(categoryKey)}
                          className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/30 transition-colors border-b border-border last:border-b-0"
                        >
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {category}
                          </span>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            {layers.length}
                          </span>
                        </button>

                        {/* Category Layers */}
                        {isExpanded && (
                          <div className="space-y-1 px-2 py-2">
                            {layers.map((layer) => {
                              const isVisible = visibleLayers.some((l) => l.id === layer.id)

                              return (
                                <div
                                  key={layer.id}
                                  className="flex items-center gap-2 p-2.5 rounded hover:bg-secondary/40 transition-colors group"
                                >
                                  <Checkbox
                                    checked={isVisible}
                                    onCheckedChange={() => onLayerToggle(layer.id)}
                                    className="border-border"
                                  />
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-offset-1 ring-border"
                                    style={{ backgroundColor: layer.color }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{layer.name}</p>
                                    <p className="text-xs text-muted-foreground">{layer.category}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onShowMetadata(layer, country.name)}
                                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
