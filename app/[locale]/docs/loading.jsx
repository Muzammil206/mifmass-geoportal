import { Skeleton } from "@/components/skeleton"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col bg-background">
   

        {/* Map Area Skeleton */}
        <div className="flex-1 relative bg-muted/20 flex items-center justify-center w-full">
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
  )
}
