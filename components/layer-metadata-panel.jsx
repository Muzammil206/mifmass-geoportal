"use client"

import { useState, useEffect } from "react"
import { 
  X, Calendar, Database, Tag, Info, 
  Globe, User, Mail, Scale, Lock, 
  RefreshCw, MapPin, FileText, Building 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function LayerMetadataPanel({ layer, country, onClose }) {
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/metadata/${layer.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status}`)
        }
        
        const data = await response.json()
        setMetadata(data[0] || data) // Handle both response formats
        console.log('Fetched metadata:', data[0])
      } catch (err) {
        console.error('Error fetching metadata:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (layer?.id) {
      fetchMetadata()
    }
  }, [layer?.id])

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Helper function to check if value exists and should be displayed
  const shouldDisplay = (value) => {
    return value && value !== "NA" && value !== "null" && value.trim() !== ""
  }

  // Render metadata field component
  const MetadataField = ({ icon: Icon, label, value, children }) => {
    if (!shouldDisplay(value) && !children) return null
    
    return (
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          {children || <p className="text-sm text-foreground break-words">{value}</p>}
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card border-border animate-in slide-in-from-bottom-5 md:slide-in-from-center-0">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded mt-1" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border animate-in slide-in-from-bottom-5 md:slide-in-from-center-0">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Error</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-destructive mb-4">Failed to load metadata: {error}</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!layer || !metadata) return null

  return (
    <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border animate-in slide-in-from-bottom-5 md:slide-in-from-center-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {metadata.country_schema || country}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {metadata.table_type}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-foreground truncate">
              {metadata.title || layer.name}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="shrink-0 ml-4 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Basic Information</h3>
            
            <MetadataField icon={Info} label="Abstract" value={metadata.abstract} />
            <MetadataField icon={Tag} label="Category" value={metadata.table_type} />
            <MetadataField icon={Database} label="Data Type" value={metadata.spatial_representation} />
            <MetadataField icon={MapPin} label="Geometry Type" value={metadata.geometry_type} />
            <MetadataField icon={Scale} label="Scale" value={metadata.equivalent_scale} />
          </div>

          {/* Temporal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Temporal Information</h3>
            
            <MetadataField icon={Calendar} label="Production Date" value={metadata.production_date} />
            <MetadataField icon={Calendar} label="Edition Date" value={formatDate(metadata.edition_date)} />
            <MetadataField icon={RefreshCw} label="Update Frequency" value={metadata.maintenance_frequency} />
          </div>

          {/* Contact & Organization */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Contact & Organization</h3>
            
            <MetadataField icon={Building} label="Organization" value={metadata.organization} />
            <MetadataField icon={User} label="Contact Role" value={metadata.contact_role} />
            <MetadataField icon={Mail} label="Contact Email" value={metadata.email} />
            <MetadataField icon={User} label="Metadata Contact" value={metadata.metadata_contact} />
            <MetadataField icon={FileText} label="Metadata Contact Role" value={metadata.metadata_contact_role} />
            <MetadataField icon={Mail} label="Metadata Contact Email" value={metadata.metadata_contact_email} />
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Technical Details</h3>
            
            <MetadataField icon={Globe} label="Reference System" value={metadata.reference_system} />
            <MetadataField icon={Building} label="Distributor" value={metadata.distributor} />
            <MetadataField icon={FileText} label="Hierarchy Level" value={metadata.hierarchy_level} />
            <MetadataField icon={Info} label="Lineage Statement" value={metadata.lineage_statement} />
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Constraints</h3>
            
            <MetadataField icon={Lock} label="Access Constraints" value={metadata.access_constraints} />
            <MetadataField icon={Lock} label="Use Constraints" value={metadata.use_constraints} />
          </div>

          {/* Keywords */}
          {shouldDisplay(metadata.keywords) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {metadata.keywords.split(',').map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Administrative Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">Administrative</h3>
            
            <MetadataField icon={User} label="Updated By" value={metadata.updated_by} />
            <MetadataField icon={Calendar} label="Created" value={formatDate(metadata.created_at)} />
            <MetadataField icon={Calendar} label="Last Updated" value={formatDate(metadata.updated_at)} />
          </div>

          {/* Color Legend */}
          {layer.color && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color }} />
              <span className="text-sm text-foreground font-medium">Display Color</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button className="flex-1">
            Download Layer
          </Button>
        </div>
      </Card>
    </div>
  )
}