"use client"

import { useEffect, useRef, useState } from "react"
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function GeoJSONMapComponent({ layers, onFeatureClick }) {
  const mapRef = useRef(null)
  const [popupInfo, setPopupInfo] = useState(null)
  const [loadedLayers, setLoadedLayers] = useState({})
  const [loading, setLoading] = useState({})

  const getGeoJSONUrl = (country, layerName) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    return `${baseUrl}/api/geojson/${country}/${layerName}`
  }

  const getLayerStyle = (layer) => {
    const baseColor = layer.color || "#FF6B6B"
    
    switch(layer.geom_type?.toUpperCase()) {
      case "MULTIPOLYGON":
      case "POLYGON":
        return {
          type: 'fill',
          paint: {
            'fill-color': baseColor,
            'fill-opacity': 0.6,
            'fill-outline-color': '#333333'
          }
        }
      
      case "LINESTRING":
      case "MULTILINESTRING":
        return {
          type: 'line',
          paint: {
            'line-color': baseColor,
            'line-width': 3,
            'line-opacity': 0.8
          }
        }
      
      case "POINT":
      case "MULTIPOINT":
        return {
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': baseColor,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        }
      
      default:
        return {
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': baseColor,
            'circle-opacity': 0.8
          }
        }
    }
  }

  // Load GeoJSON data for a layer
  const loadLayerData = async (layer) => {
    setLoading(prev => ({ ...prev, [layer.id]: true }))
    
    try {
      const url = getGeoJSONUrl(layer.country, layer.name || layer.layer_name)
      console.log(`Loading GeoJSON from: ${url}`)
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const geojson = await response.json()
      console.log(`Loaded ${geojson.features?.length || 0} features for ${layer.id}`)
      
      setLoadedLayers(prev => ({
        ...prev,
        [layer.id]: geojson
      }))
      
    } catch (error) {
      console.error(`Failed to load layer ${layer.id}:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [layer.id]: false }))
    }
  }

  // Load all layers
  useEffect(() => {
    layers.forEach(layer => {
      loadLayerData(layer)
    })
  }, [layers])

  const handleClick = (event) => {
    if (!mapRef.current) return

    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: layers.map(layer => `${layer.id}-layer`)
    })
    
    console.log("Clicked features:", features.length)

    if (features.length > 0) {
      const feature = features[0]
      const layer = layers.find(l => feature.source === l.id)
      
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
          layerName: layer.name || layer.layer_name
        })
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -4.4596,
          latitude: 9.0765,
          zoom: 5
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onClick={handleClick}
        interactiveLayerIds={layers.map(layer => `${layer.id}-layer`)}
      >
        {layers.map((layer) => {
          const styleConfig = getLayerStyle(layer)
          const layerData = loadedLayers[layer.id]

          if (!layerData) {
            console.log(`Layer ${layer.id} data not loaded yet`)
            return null
          }

          return (
            <Source
              key={layer.id}
              id={layer.id}
              type="geojson"
              data={layerData}
            >
              <Layer
                id={`${layer.id}-layer`}
                type={styleConfig.type}
                source={layer.id}
                paint={styleConfig.paint}
              />
            </Source>
          )
        })}

        {popupInfo && (
          <Popup
            longitude={popupInfo.lngLat.lng}
            latitude={popupInfo.lngLat.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
          >
            <div className="max-w-xs">
              <div className="font-bold text-sm mb-2 text-foreground">
                {popupInfo.layerName}
              </div>
              {popupInfo.properties && Object.entries(popupInfo.properties)
                .slice(0, 8)
                .map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <strong>{key}:</strong> {String(value)}
                  </div>
                ))
              }
            </div>
          </Popup>
        )}
      </Map>

      {/* Debug panel */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded text-sm max-w-md z-10">
        <div className="font-bold mb-2">🧭 GeoJSON Map</div>
        <div>Layers: {Object.keys(loadedLayers).length}/{layers.length} loaded</div>
        
        {layers.map(layer => (
          <div key={layer.id} className="flex items-center mt-1 text-xs">
            <div 
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: layer.color || '#FF6B6B' }}
            ></div>
            <span>
              {layer.name} - {loadedLayers[layer.id]?.features?.length || 0} features
              {loading[layer.id] && ' (loading...)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}