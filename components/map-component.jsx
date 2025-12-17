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
  const [layerBounds, setLayerBounds] = useState({})
  const [recentlyZoomedLayers, setRecentlyZoomedLayers] = useState(new Set()) // Track recently zoomed layers

  useEffect(() => {
    if (initialViewState && mapRef.current) {
      mapRef.current.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom || 10,
        duration: 2000,
      })
    }
  }, [initialViewState])

  // Function to calculate bounds from GeoJSON
  const calculateBounds = (geojson) => {
    if (!geojson?.features?.length) return null

    let minLng = 180
    let maxLng = -180
    let minLat = 90
    let maxLat = -90

    const processCoordinates = (coords) => {
      if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) {
        // Nested arrays (Polygon, MultiLineString, etc.)
        coords.forEach(ring => {
          if (Array.isArray(ring[0])) {
            ring.forEach(coord => {
              const [lng, lat] = coord
              minLng = Math.min(minLng, lng)
              maxLng = Math.max(maxLng, lng)
              minLat = Math.min(minLat, lat)
              maxLat = Math.max(maxLat, lat)
            })
          }
        })
      } else if (Array.isArray(coords[0])) {
        // Array of coordinates (LineString, etc.)
        coords.forEach(coord => {
          const [lng, lat] = coord
          minLng = Math.min(minLng, lng)
          maxLng = Math.max(maxLng, lng)
          minLat = Math.min(minLat, lat)
          maxLat = Math.max(maxLat, lat)
        })
      } else {
        // Single coordinate (Point)
        const [lng, lat] = coords
        minLng = Math.min(minLng, lng)
        maxLng = Math.max(maxLng, lng)
        minLat = Math.min(minLat, lat)
        maxLat = Math.max(maxLat, lat)
      }
    }

    geojson.features.forEach(feature => {
      if (feature.geometry) {
        const { type, coordinates } = feature.geometry
        switch (type) {
          case 'Point':
            processCoordinates(coordinates)
            break
          case 'MultiPoint':
          case 'LineString':
            coordinates.forEach(coord => processCoordinates(coord))
            break
          case 'MultiLineString':
          case 'Polygon':
            coordinates.forEach(ring => processCoordinates(ring))
            break
          case 'MultiPolygon':
            coordinates.forEach(polygon => {
              polygon.forEach(ring => processCoordinates(ring))
            })
            break
        }
      }
    })

    // Add some padding
    const padding = 0.01
    return [
      [minLng - padding, minLat - padding],
      [maxLng + padding, maxLat + padding]
    ]
  }

  // Function to zoom to a specific layer
  const zoomToLayer = async (layerId, showPopup = true) => {
    const bounds = layerBounds[layerId]
    const layer = layers.find(l => l.id === layerId)
    
    if (!bounds || !mapRef.current) {
      console.log(`No bounds available for layer: ${layerId}`)
      return false
    }

    try {
      // Mark this layer as recently zoomed
      setRecentlyZoomedLayers(prev => new Set([...prev, layerId]))
      
      // Remove from recently zoomed after 3 seconds
      setTimeout(() => {
        setRecentlyZoomedLayers(prev => {
          const newSet = new Set(prev)
          newSet.delete(layerId)
          return newSet
        })
      }, 3000)

      await new Promise((resolve) => {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          duration: 1500,
          maxZoom: 16
        }, resolve)
      })

      if (showPopup) {
        setPopupInfo({
          lngLat: {
            lng: (bounds[0][0] + bounds[1][0]) / 2,
            lat: (bounds[0][1] + bounds[1][1]) / 2
          },
          properties: { message: `Zoomed to ${layer?.name || layerId}` },
          layerName: "Layer Zoom"
        })

        setTimeout(() => {
          setPopupInfo(null)
        }, 3000)
      }

      return true

    } catch (error) {
      console.error('Error zooming to layer:', error)
      return false
    }
  }

  // Function to zoom to all visible layers
  const zoomToAllLayers = () => {
    const allBounds = Object.values(layerBounds).filter(bounds => bounds !== null)
    
    if (allBounds.length === 0 || !mapRef.current) {
      console.log('No layers with bounds available')
      return
    }

    // Calculate combined bounds
    let combinedBounds = allBounds[0]
    allBounds.forEach(bounds => {
      combinedBounds = [
        [
          Math.min(combinedBounds[0][0], bounds[0][0]),
          Math.min(combinedBounds[0][1], bounds[0][1])
        ],
        [
          Math.max(combinedBounds[1][0], bounds[1][0]),
          Math.max(combinedBounds[1][1], bounds[1][1])
        ]
      ]
    })

    try {
      mapRef.current.fitBounds(combinedBounds, {
        padding: 50,
        duration: 2000,
        maxZoom: 12
      })

      setPopupInfo({
        lngLat: {
          lng: (combinedBounds[0][0] + combinedBounds[1][0]) / 2,
          lat: (combinedBounds[0][1] + combinedBounds[1][1]) / 2
        },
        properties: { message: `Zoomed to all ${allBounds.length} layers` },
        layerName: "All Layers"
      })

      setTimeout(() => setPopupInfo(null), 3000)

    } catch (error) {
      console.error('Error zooming to all layers:', error)
    }
  }

  // Auto-zoom immediately when a layer finishes loading
  useEffect(() => {
    // Check each layer that has bounds but hasn't been zoomed to yet
    layers.forEach(layer => {
      if (layerBounds[layer.id] && 
          loadedLayers[layer.id] && 
          !recentlyZoomedLayers.has(layer.id) &&
          !loading[layer.id]) {
        console.log(`Auto-zooming to newly loaded layer: ${layer.id}`)
        zoomToLayer(layer.id, true)
      }
    })
  }, [layerBounds, loadedLayers, layers])

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const viewbox = "-17.5,25.0,15.0,4.0"
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json` +
          `&q=${encodeURIComponent(query)}` +
          `&viewbox=${viewbox}` +
          `&bounded=1` +
          `&limit=5` +
          `&countrycodes=bj,bf,cv,ci,gm,gh,gn,gw,lr,ml,mr,ne,ng,sn,sl,tg`,
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
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const flyToLocation = (result) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [Number.parseFloat(result.lon), Number.parseFloat(result.lat)],
        zoom: 12,
        duration: 1500,
      })

      setSearchQuery("")
      setSearchResults([])

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
            "circle-radius": 4,
            "circle-color": baseColor,
            "circle-opacity": 0.8,
            "circle-stroke-width": 1,
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

      // Calculate and store bounds for this layer
      const bounds = calculateBounds(geojson)
      if (bounds) {
        setLayerBounds(prev => ({
          ...prev,
          [layer.id]: bounds
        }))
      }

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

  // Function to select and load a layer with auto-zoom
  const selectLayer = (layer) => {
    if (loadedLayers[layer.id]) {
      // Layer already loaded, just zoom to it
      zoomToLayer(layer.id, true)
    } else {
      // Load layer and it will auto-zoom when loaded
      loadLayerData(layer)
    }
  }

  // Load all layers initially - they will auto-zoom as they load
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

  const handleHover = (event) => {
  if (!mapRef.current) return

  const features = mapRef.current.queryRenderedFeatures(event.point, {
    layers: layers.map(layer => `${layer.id}-layer`)
  })

  if (!features.length) {
    setPopupInfo(null)
    return
  }

  const feature = features[0]
  const layer = layers.find(l => feature.source === l.id)

  if (!layer) return

  setPopupInfo({
    lngLat: event.lngLat,
    properties: feature.properties,
    layerName: layer.name || layer.layer_name,
  })
}
const handleMouseLeave = () => {
  setPopupInfo(null)
}


  return (
    <div className="w-full h-full relative">
      {/* Search Box */}
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

         onMouseMove={handleHover}
         onMouseLeave={handleMouseLeave}
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

      {/* Layer Information Panel */}
      <div className="absolute top-4 right-8 bg-black/90 text-white p-4 rounded text-sm max-w-md z-10">
        <div className="font-bold mb-2">🗺️ Layer Controls</div>
        
        {/* Zoom to All Button */}
        <button
          onClick={zoomToAllLayers}
          disabled={Object.keys(layerBounds).length === 0}
          className="w-full mb-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded text-xs font-medium transition-colors"
        >
          🔍 Zoom to All Layers
        </button>

        <div className="mb-2">
          Layers: {Object.keys(loadedLayers).length}/{layers.length} loaded
        </div>

        {/* Auto-zoom status */}
        {recentlyZoomedLayers.size > 0 && (
          <div className="mb-3 p-2 bg-blue-500 rounded text-xs">
            ⚡ Auto-zoomed to {recentlyZoomedLayers.size} layer(s)
          </div>
        )}

        {layers.map((layer) => {
          const hasBounds = !!layerBounds[layer.id]
          const isLoading = loading[layer.id]
          const isLoaded = !!loadedLayers[layer.id]
          const wasRecentlyZoomed = recentlyZoomedLayers.has(layer.id)
          
          return (
            <div key={layer.id} className="flex items-center justify-between mt-2 text-xs group">
              <div className="flex items-center flex-1">
                <div 
                  className="w-3 h-3 mr-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: layer.color || "#FF6B6B" }}
                ></div>
                <span className="truncate flex-1">
                  {layer.name} - {loadedLayers[layer.id]?.features?.length || 0} features
                  {isLoading && " (loading...)"}
                  {wasRecentlyZoomed && " (recently zoomed)"}
                </span>
              </div>
              
              <button
                onClick={() => selectLayer(layer)}
                disabled={isLoading}
                className={`ml-2 px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : isLoaded 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                title={isLoaded ? `Zoom to ${layer.name}` : `Load and zoom to ${layer.name}`}
              >
                {isLoading ? '...' : isLoaded ? 'Zoom' : 'Load'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}