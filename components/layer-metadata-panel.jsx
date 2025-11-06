"use client"

import { X, Calendar, Database, Tag, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LayerMetadataPanel({ layer, country, onClose }) {
  if (!layer) return null

  return (
    <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4 ">
      <Card className="w-full max-w-md bg-card border-border animate-in slide-in-from-bottom-5 md:slide-in-from-center-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{country}</p>
            <h2 className="text-lg font-semibold text-foreground">{layer.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Tag className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Category</p>
              <p className="text-sm text-foreground">{layer.category}</p>
            </div>
          </div>

          {/* Data Type */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Database className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Data Type</p>
              <p className="text-sm text-foreground">Vector Polygon</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm text-foreground">March 15, 2024</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Description</p>
              <p className="text-sm text-foreground text-pretty">
                High-resolution geospatial dataset providing detailed information about {layer.name.toLowerCase()}{" "}
                across {country}. Suitable for analysis, planning, and research purposes.
              </p>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color }} />
            <span className="text-sm text-foreground font-medium">Display Color</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 border-border text-foreground bg-transparent">
            Close
          </Button>
          <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">Download Layer</Button>
        </div>
      </Card>
    </div>
  )
}
