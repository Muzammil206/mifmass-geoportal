"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Info, Download, Database, Tag, Calendar, User, Mail, Globe, Building, Scale, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InfoPanel({ feature, onClose, layerContext, onShowMetadata, onShowDownloadModal }) {
  const [downloading, setDownloading] = useState(false)
  const [showFullMetadata, setShowFullMetadata] = useState(false)
  const [layerMetadata, setLayerMetadata] = useState(null)
  const [metadataLoading, setMetadataLoading] = useState(false)
  const [metadataError, setMetadataError] = useState(null)

  // Debug logging
  useEffect(() => {
    console.log('InfoPanel mounted with feature:', feature)
    console.log('Layer context:', layerContext)
  }, [feature, layerContext])

  // Fetch layer metadata when component mounts or layer changes
  useEffect(() => {
    async function fetchLayerMetadata() {
      if (!feature?.layer_id) {
        console.log('No layer_id found in feature:', feature)
        return
      }
      
      try {
        setMetadataLoading(true)
        setMetadataError(null)
        console.log('Fetching metadata for layer:', feature.layer_id)
        
        const response = await fetch(`/api/metadata/${feature.layer_id}`)
        console.log('Metadata response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Metadata data received:', data)
          setLayerMetadata(data[0] || data)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error fetching layer metadata:', error)
        setMetadataError(error.message)
      } finally {
        setMetadataLoading(false)
      }
    }

    fetchLayerMetadata()
  }, [feature?.layer_id])

  const handleDownload = () => {
    if (onShowDownloadModal) {
      onShowDownloadModal()
    }
  }

  const handleShowMetadata = () => {
    console.log("Showing metadata for feature:", feature)
    if (onShowMetadata && layerContext) {
      onShowMetadata(
        {
          id: feature.layer_id,
          name: layerMetadata?.title || feature.name,
          geom_type: layerContext.geomType || "UNKNOWN",
          category: layerMetadata?.table_type || "Map Feature",
        },
        layerContext.country,
        layerContext.country,
      )
    }
    setShowFullMetadata(true)
  }

  const properties = feature.properties || {}
  const propertyEntries = Object.entries(properties)

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === "object") return JSON.stringify(value)
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time")) {
      try {
        return new Date(value).toLocaleDateString()
      } catch (e) {
        return String(value)
      }
    }
    return String(value)
  }

  // Helper to check if value should be displayed
  const shouldDisplay = (value) => {
    return value && value !== "NA" && value !== "null" && value.trim() !== ""
  }

  // Metadata field component
  const MetadataField = ({ icon: Icon, label, value, loading = false }) => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground min-w-20">{label}:</span>
          <Skeleton className="h-4 flex-1 max-w-32" />
        </div>
      )
    }
    
    if (!shouldDisplay(value)) return null
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground min-w-20">{label}:</span>
        <span className="font-medium text-foreground truncate" title={value}>
          {value}
        </span>
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 flex flex-col h-[70vh] min-h-[400px] max-h-[80vh]">
      {/* Header Section - Fixed */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-background/95">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal uppercase tracking-wider">
                {feature.type || "Feature"}
              </Badge>
              {feature.country && (
                <Badge variant="secondary" className="text-xs font-normal capitalize">
                  {feature.country}
                </Badge>
              )}
              {layerMetadata?.table_type && (
                <Badge variant="outline" className="text-xs font-normal">
                  {layerMetadata.table_type}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1">
              {properties.name || properties.Name || properties.NAME || "Selected Feature"}
            </h3>
            {layerMetadata?.title && layerMetadata.title !== properties.name && (
              <p className="text-sm text-muted-foreground mt-1">{layerMetadata.title}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex gap-2 bg-transparent"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="w-4 h-4" />
            {downloading ? "Downloading..." : "Download"}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-6">
         

          {/* Error Alert */}
          {metadataError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load metadata: {metadataError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Primary Details Group */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4" />
                Feature Information
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
                {propertyEntries.length > 0 ? (
                  propertyEntries.slice(0, 5).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground capitalize font-medium truncate" title={key}>
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium text-foreground truncate" title={String(value)}>
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    No properties available
                  </div>
                )}
              </div>
            </div>

            {/* Layer Metadata Group */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Database className="w-4 h-4" />
                Layer Information
                {metadataLoading && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    Loading...
                  </Badge>
                )}
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
                <MetadataField 
                  icon={Tag} 
                  label="Category" 
                  value={layerMetadata?.table_type}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Database} 
                  label="Data Type" 
                  value={layerMetadata?.spatial_representation}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={MapPin} 
                  label="Geometry" 
                  value={layerMetadata?.geometry_type}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Scale} 
                  label="Scale" 
                  value={layerMetadata?.equivalent_scale}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Globe} 
                  label="CRS" 
                  value={layerMetadata?.reference_system}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Calendar} 
                  label="Updated" 
                  value={layerMetadata?.production_date}
                  loading={metadataLoading}
                />
              </div>
            </div>

            {/* Contact & Organization */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Building className="w-4 h-4" />
                Source & Contact
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
                <MetadataField 
                  icon={Building} 
                  label="Organization" 
                  value={layerMetadata?.organization}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={User} 
                  label="Contact" 
                  value={layerMetadata?.metadata_contact}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Mail} 
                  label="Email" 
                  value={layerMetadata?.metadata_contact_email}
                  loading={metadataLoading}
                />
                <MetadataField 
                  icon={Building} 
                  label="Distributor" 
                  value={layerMetadata?.distributor}
                  loading={metadataLoading}
                />
                
                {/* Constraints */}
                {(layerMetadata?.access_constraints || layerMetadata?.use_constraints) && (
                  <div className="pt-2 border-t border-border/30">
                    <div className="text-xs text-muted-foreground font-medium mb-2">Constraints:</div>
                    {layerMetadata.access_constraints && (
                      <div className="text-xs text-amber-600 mb-1" title={layerMetadata.access_constraints}>
                        🔒 {layerMetadata.access_constraints.substring(0, 60)}...
                      </div>
                    )}
                    {layerMetadata.use_constraints && (
                      <div className="text-xs text-blue-600" title={layerMetadata.use_constraints}>
                        📝 {layerMetadata.use_constraints.substring(0, 60)}...
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full" 
                  variant="secondary" 
                  size="sm"
                  onClick={handleShowMetadata}
                  disabled={metadataLoading || !layerMetadata}
                >
                  {metadataLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                      Loading Metadata...
                    </>
                  ) : (
                    "View Full Metadata"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Properties */}
          {propertyEntries.length > 5 && (
            <div className="mt-6">
              <Separator className="mb-4" />
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Additional Properties ({propertyEntries.length - 5} more)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {propertyEntries.slice(5).map(([key, value]) => (
                  <div key={key} className="text-sm p-3 bg-muted/20 rounded border border-border/30">
                    <span className="block text-xs text-muted-foreground capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="block font-medium text-foreground truncate" title={String(value)}>
                      {formatValue(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Abstract Section */}
          {layerMetadata?.abstract && (
            <div className="mt-6">
              <Separator className="mb-4" />
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Layer Description
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-foreground leading-relaxed">
                  {layerMetadata.abstract}
                </p>
              </div>
            </div>
          )}

          {/* Keywords */}
          {layerMetadata?.keywords && (
            <div className="mt-6">
              <Separator className="mb-4" />
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {layerMetadata.keywords.split(',').map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}