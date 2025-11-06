"use client"

import { X, MapPin, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InfoPanel({ feature, onClose }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto z-20 border-t md:border-t-0 md:border-l border-border bg-card/95 backdrop-blur-sm p-4 md:w-80 md:max-h-full md:overflow-y-auto animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{feature.type}</p>
            <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Feature Details */}
      <div className="space-y-3 mb-6">
        {Object.entries(feature).map(([key, value]) => {
          if (key === "type" || key === "name") return null
          return (
            <div key={key} className="flex justify-between items-start pb-3 border-b border-border/50">
              <span className="text-xs text-muted-foreground capitalize font-medium">{key}:</span>
              <span className="text-sm font-medium text-foreground text-right max-w-xs">{String(value)}</span>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-border text-foreground hover:bg-secondary/50 bg-transparent"
        >
          <Info className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-border text-foreground hover:bg-secondary/50 bg-transparent"
        >
          Download Data
        </Button>
      </div>
    </div>
  )
}
