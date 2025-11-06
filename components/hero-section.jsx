"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Globe, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Image from "next/image"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const mockDatasets = [
    { id: 1, name: "River Networks", country: "Nigeria", type: "Natural" },
    { id: 2, name: "Urban Settlements", country: "Ghana", type: "Infrastructure" },
    { id: 3, name: "Road Infrastructure", country: "Mali", type: "Infrastructure" },
    { id: 4, name: "Forest Coverage", country: "Côte d'Ivoire", type: "Natural" },
    { id: 5, name: "Population Density", country: "Nigeria", type: "Demographic" },
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const results = mockDatasets.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(query.toLowerCase()) ||
          dataset.country.toLowerCase().includes(query.toLowerCase()) ||
          dataset.type.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden ">
        <Image
          src="/bg2.jpg"
          alt="Background"
          fill
          className="object-cover"
        //   style={{
        //     filter: "brightness(1) contrast(1)",
        //   }}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <motion.div className="text-center space-y-8" variants={containerVariants} initial="hidden" animate="visible">
          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold  text-balance  drop-shadow-lg">
              Explore, Visualize, and Download Geospatial Data Across West Africa
            </h2>
            <p className="text-lg sm:text-xl  max-w-2xl mx-auto text-white  text-balance drop-shadow">
              Access comprehensive spatial datasets including rivers, settlements, infrastructure, and more across
              Nigeria, Ghana, Mali, and beyond.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="flex gap-2 max-w-2xl mx-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search datasets or countries..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="pl-10 h-12 bg-card/95 border-border text-foreground placeholder:text-muted-foreground"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href="/map"
                      className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 border-b border-border last:border-b-0 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.country} • {result.type}
                        </p>
                      </div>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{result.type}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground">Search</Button>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/map">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Globe className="w-4 h-4 mr-2" />
                Open Map Viewer
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-secondary/50 bg-card/80"
            >
              <Filter className="w-4 h-4 mr-2" />
              Browse by Theme
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-secondary/50 bg-card/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Explore by Country
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
