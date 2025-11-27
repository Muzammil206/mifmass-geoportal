"use client"

import { motion } from "framer-motion"
import { BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function DocsHero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative text-white py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 
      "
      style={{
        backgroundImage:
          "url(/docs.jpg?height=1200&width=1600&query=west%20africa%20map%20geospatial%20landscape)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      >
      
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">User Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Documentation</h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 text-pretty">
            Learn how to explore, discover, and analyze geospatial data across West Africa with our comprehensive
            platform guide.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-foreground bg-white rounded-full border-0 shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
