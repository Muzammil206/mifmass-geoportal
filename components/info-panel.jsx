"use client"

import { X, MapPin, Info, Download, Database, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function InfoPanel({ feature, onClose }) {
  // Extract properties from the feature object
  // The map component passes { type, country, properties, geom_type, layer_id }
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

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[50vh]">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-border">
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
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1">
              {properties.name || properties.Name || properties.NAME || "Selected Feature"}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Details Group */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              Feature Information
            </h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
              {propertyEntries.slice(0, 5).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground capitalize font-medium truncate" title={key}>
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-foreground truncate" title={String(value)}>
                    {formatValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details Group */}
          {propertyEntries.length > 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Database className="w-4 h-4" />
                Attributes
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
                {propertyEntries.slice(5, 12).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground capitalize font-medium truncate" title={key}>
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-medium text-foreground truncate" title={String(value)}>
                      {formatValue(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata & System Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Metadata
            </h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground font-medium">Geometry Type</span>
                <span className="font-medium text-foreground capitalize">
                  {feature.geom_type?.toLowerCase() || "Unknown"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground font-medium">Layer ID</span>
                <span className="font-medium text-foreground truncate" title={feature.layer_id}>
                  {feature.layer_id || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground font-medium">Coordinates</span>
                <span className="font-medium text-foreground truncate">Click to View</span>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full" variant="secondary" size="sm">
                View Full Metadata
              </Button>
            </div>
          </div>
        </div>

        {/* Render remaining properties if any */}
        {propertyEntries.length > 12 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Additional Properties</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {propertyEntries.slice(12).map(([key, value]) => (
                <div key={key} className="text-sm p-3 bg-muted/20 rounded border border-border/30">
                  <span className="block text-xs text-muted-foreground capitalize mb-1">{key.replace(/_/g, " ")}</span>
                  <span className="block font-medium text-foreground truncate" title={String(value)}>
                    {formatValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
