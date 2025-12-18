import { Skeleton } from "@/components/skeleton"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-4 flex items-center justify-between z-40">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-96 border-r border-border bg-card flex flex-col h-full overflow-hidden">
          {/* Search Skeleton */}
          <div className="p-4 border-b border-border">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Stats Skeleton */}
          <div className="p-4 space-y-3 border-b border-border">
            <div className="flex gap-4">
              <Skeleton className="h-16 flex-1" />
              <Skeleton className="h-16 flex-1" />
            </div>
          </div>

          {/* Country/Layer List Skeleton */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Export Button Skeleton */}
          <div className="p-4 border-t border-border">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Map Area Skeleton */}
        <div className="flex-1 relative bg-muted/20 flex items-center justify-center max-w-6xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Loading....</p>
            </div>
          </div>

          {/* Decorative Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>
    </div>
  )
}
