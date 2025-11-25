"use client"

import { useEffect, useRef, useState } from "react"
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { NavigationControl, GeolocateControl, ScaleControl } from "react-map-gl/maplibre"

export default function GeoJSONMapComponent({ layers, onFeatureClick, initialViewState }) {
  const mapRef = useRef(null)
  const [popupInfo, setPopupInfo] = useState(null)
  const [loadedLayers, setLoadedLayers] = useState({})
  const [loading, setLoading] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (initialViewState && mapRef.current) {
      mapRef.current.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom || 10,
        duration: 2000,
      })
    }
  }, [initialViewState])

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // West Africa bounding box:
      // West: -17.5, South: 4.0, East: 15.0, North: 25.0
      const viewbox = "-17.5,25.0,15.0,4.0" // format: left,top,right,bottom

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json` +
          `&q=${encodeURIComponent(query)}` +
          `&viewbox=${viewbox}` +
          `&bounded=1` + // Restrict results to viewbox
          `&limit=5` +
          `&countrycodes=bj,bf,cv,ci,gm,gh,gn,gw,lr,ml,mr,ne,ng,sn,sl,tg`, // West African country codes
      )
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Fly to selected location
  const flyToLocation = (result) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [Number.parseFloat(result.lon), Number.parseFloat(result.lat)],
        zoom: 12,
        duration: 1500,
      })

      // Clear search and results after selection
      setSearchQuery("")
      setSearchResults([])

      // Optional: Show popup for the searched location
      setPopupInfo({
        lngLat: { lng: Number.parseFloat(result.lon), lat: Number.parseFloat(result.lat) },
        properties: { name: result.display_name },
        layerName: "Searched Location",
      })
    }
  }

  const getGeoJSONUrl = (country, layerName) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    return `${baseUrl}/api/geojson/${country}/${layerName}`
  }

  const getLayerStyle = (layer) => {
    const baseColor = layer.color || "#FF6B6B"

    switch (layer.geom_type?.toUpperCase()) {
      case "MULTIPOLYGON":
      case "POLYGON":
        return {
          type: "fill",
          paint: {
            "fill-color": baseColor,
            "fill-opacity": 0.6,
            "fill-outline-color": "#333333",
          },
        }

      case "LINESTRING":
      case "MULTILINESTRING":
        return {
          type: "line",
          paint: {
            "line-color": baseColor,
            "line-width": 3,
            "line-opacity": 0.8,
          },
        }

      case "POINT":
      case "MULTIPOINT":
        return {
          type: "circle",
          paint: {
            "circle-radius": 6,
            "circle-color": baseColor,
            "circle-opacity": 0.8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        }

      default:
        return {
          type: "circle",
          paint: {
            "circle-radius": 6,
            "circle-color": baseColor,
            "circle-opacity": 0.8,
          },
        }
    }
  }

  // Load GeoJSON data for a layer
  const loadLayerData = async (layer) => {
    setLoading((prev) => ({ ...prev, [layer.id]: true }))

    try {
      const url = getGeoJSONUrl(layer.country, layer.name || layer.layer_name)
      console.log(`Loading GeoJSON from: ${url}`)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const geojson = await response.json()
      console.log(`Loaded ${geojson.features?.length || 0} features for ${layer.id}`)

      setLoadedLayers((prev) => ({
        ...prev,
        [layer.id]: geojson,
      }))
    } catch (error) {
      console.error(`Failed to load layer ${layer.id}:`, error)
    } finally {
      setLoading((prev) => ({ ...prev, [layer.id]: false }))
    }
  }

  // Load all layers
  useEffect(() => {
    layers.forEach((layer) => {
      loadLayerData(layer)
    })
  }, [layers])

  const handleClick = (event) => {
    if (!mapRef.current) return

    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: layers.map((layer) => `${layer.id}-layer`),
    })

    console.log("Clicked features:", features.length)

    if (features.length > 0) {
      const feature = features[0]
      const layer = layers.find((l) => feature.source === l.id)

      if (layer) {
        const featureData = {
          type: layer.name || layer.layer_name,
          country: layer.country,
          properties: feature.properties,
          geom_type: layer.geom_type,
          layer_id: layer.id,
        }

        onFeatureClick(featureData)
        setPopupInfo({
          lngLat: event.lngLat,
          properties: feature.properties,
          layerName: layer.name || layer.layer_name,
        })
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-2 min-w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <div className="absolute right-2 top-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => flyToLocation(result)}
              >
                <div className="font-medium text-sm">{result.display_name}</div>
                <div className="text-xs text-gray-500">
                  {result.type} • {result.class}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Map
        ref={mapRef}
        initialViewState={
          initialViewState || {
            longitude: -4.4596,
            latitude: 9.0765,
            zoom: 5,
          }
        }
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onClick={handleClick}
        interactiveLayerIds={layers.map((layer) => `${layer.id}-layer`)}
      >
        {layers.map((layer) => {
          const styleConfig = getLayerStyle(layer)
          const layerData = loadedLayers[layer.id]

          if (!layerData) {
            console.log(`Layer ${layer.id} data not loaded yet`)
            return null
          }

          return (
            <Source key={layer.id} id={layer.id} type="geojson" data={layerData}>
              <Layer id={`${layer.id}-layer`} type={styleConfig.type} source={layer.id} paint={styleConfig.paint} />
            </Source>
          )
        })}
        <NavigationControl position="bottom-right" showCompass={true} showZoom={true} />

        <GeolocateControl
          position="top-right"
          trackUserLocation={true}
          showUserLocation={true}
          onGeolocate={(e) => {
            console.log("User location:", e.coords)
          }}
        />

        <ScaleControl position="bottom-left" unit="metric" />

        {popupInfo && (
          <Popup
            longitude={popupInfo.lngLat.lng}
            latitude={popupInfo.lngLat.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
          >
            <div className="max-w-xs">
              <div className="font-bold text-sm mb-2 text-foreground">{popupInfo.layerName}</div>
              {popupInfo.properties &&
                Object.entries(popupInfo.properties)
                  .slice(0, 8)
                  .map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  ))}
            </div>
          </Popup>
        )}
      </Map>

      {/* Debug panel */}
      <div className="absolute top-4 right-8 bg-black/90 text-white p-4 rounded text-sm max-w-md z-10">
        <div className="font-bold mb-2">🧭Display layer information</div>
        <div>
          Layers: {Object.keys(loadedLayers).length}/{layers.length} loaded
        </div>

        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center mt-1 text-xs">
            <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: layer.color || "#FF6B6B" }}></div>
            <span>
              {layer.name} - {loadedLayers[layer.id]?.features?.length || 0} features
              {loading[layer.id] && " (loading...)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
