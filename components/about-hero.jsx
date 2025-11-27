"use client"

import { motion } from "framer-motion"

export default function AboutHero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
      style={{
        backgroundImage:
          "url(/docs.jpg?height=1200&width=1600&query=west%20africa%20map%20geospatial%20landscape)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-sm font-medium text-white">About West Africa GeoPortal</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6 text-white drop-shadow-lg"
        >
          Mapping West Africa's Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-100 max-w-3xl mx-auto text-balance leading-relaxed drop-shadow-lg"
        >
          The West Africa GeoPortal is a comprehensive geospatial data platform empowering researchers, policymakers,
          and development professionals with accessible geographic intelligence across the region.
        </motion.p>
      </div>
    </section>
  )
}
