"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { Search, Globe, Download, Filter, MapPin, Layers, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"
import layersData from "@/utils/layers.json"

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef(null)

  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearch.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      const query = debouncedSearch.toLowerCase()
      const results = []

      layersData.forEach((country) => {
        if (country.displayName.toLowerCase().includes(query)) {
          results.push({
            type: "country",
            id: country.country,
            name: country.displayName,
            subtitle: "Country Data Catalog",
            country: country.country,
          })
        }

        country.themes.forEach((theme) => {
          theme.layers.forEach((layer) => {
            if (
              layer.title.toLowerCase().includes(query) ||
              layer.metadata?.description?.toLowerCase().includes(query)
            ) {
              results.push({
                type: "layer",
                id: layer.id,
                name: layer.title,
                subtitle: `${country.displayName} • ${theme.name}`,
                country: country.country,
                layerId: layer.id,
              })
            }
          })
        })
      })

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedSearch,
          )}&limit=5&viewbox=-17.5,25.0,15.0,4.0&bounded=1&countrycodes=bj,bf,cv,ci,gm,gh,gn,gw,lr,ml,mr,ne,ng,sn,sl,tg`,
        )
        if (response.ok) {
          const data = await response.json()
          const places = data.map((place) => ({
            type: "location",
            id: place.place_id,
            name: place.display_name.split(",")[0],
            subtitle: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
          results.push(...places)
        }
      } catch (error) {
        console.error("Geocoding error:", error)
      }

      setSearchResults(results)
      setIsSearching(false)
      setShowResults(true)
    }

    performSearch()
  }, [debouncedSearch])

  const handleSelectResult = (result) => {
    setShowResults(false)
    setSearchQuery(result.name)

    if (result.type === "location") {
      router.push(`/map?lat=${result.lat}&lng=${result.lon}&zoom=12`)
    } else if (result.type === "country") {
      router.push(`/map?country=${result.id}`)
    } else if (result.type === "layer") {
      router.push(`/map?country=${result.country}&activeLayer=${result.layerId}`)
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
      className="relative overflow-hidden h-[80%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0  -z-10 overflow-hidden ">
        <Image src="/bg2.jpg" alt="Background" fill className="object-cover h-[80%]" priority />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <motion.div className="text-center space-y-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold  text-balance  drop-shadow-lg">
              {t("Hero.headline")}
            </h2>
            <p className="text-lg sm:text-xl  max-w-2xl mx-auto text-white  text-balance drop-shadow">
              {t("Hero.description")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2 max-w-2xl mx-auto w-full relative" ref={searchRef}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t("Hero.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                className="pl-10 h-12 bg-card/95 border-border text-foreground placeholder:text-muted-foreground"
              />

              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                  >
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleSelectResult(result)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-accent/10 cursor-pointer border-b border-border last:border-b-0 transition-colors group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                            {result.type === "location" && <MapPin className="w-4 h-4" />}
                            {result.type === "layer" && <Layers className="w-4 h-4" />}
                            {result.type === "country" && <Globe className="w-4 h-4" />}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                          </div>
                        </div>
                        {result.type !== "location" && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                            {result.type}
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleSelectResult({ type: "search", name: searchQuery })}
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t("Hero.searchButton")
              )}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/map">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Globe className="w-4 h-4 mr-2" />
                {t("Hero.openMap")}
              </Button>
            </Link>

            <Link href="/map">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary/50 bg-card/80"
              >
                <Filter className="w-4 h-4 mr-2" />
                {t("Hero.browseByTheme")}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-foreground hover:bg-secondary/50 bg-card/80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("Hero.exploreByCountry")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                {layersData.map((country) => (
                  <Link key={country.country} href={`/map?country=${country.country}`}>
                    <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                      {country.displayName}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
