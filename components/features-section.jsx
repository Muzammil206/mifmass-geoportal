"use client"

import { Globe, Download, Filter, Zap, Users, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  const mainFeatures = [
    {
      icon: Globe,
      title: "Multi-Country Coverage",
      description:
        "Access spatial data for Nigeria, Ghana, Mali, Benin, Burkina Faso, Côte d'Ivoire and more West African countries.",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Download datasets in GeoJSON, Shapefile, CSV, and GeoTIFF formats directly from the portal.",
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Filter by theme, country, resolution, and search across thousands of spatial datasets with ease.",
    },
  ]

  const secondaryFeatures = [
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Access the latest geospatial data with regular updates across all African countries.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Contribute your own datasets and collaborate with researchers and data scientists worldwide.",
    },
    {
      icon: BookOpen,
      title: "Documentation & Guides",
      description: "Comprehensive documentation, tutorials, and API guides for developers and analysts.",
    },
  ]

  return (
    <motion.section
      className="py-20 border-t border-border bg-card/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Features */}
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">Powerful Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore, analyze, and download comprehensive geospatial data for West African countries with our intuitive
          platform.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-lg border border-border bg-background hover:border-accent transition-colors"
              whileHover={{ y: -4 }}
            >
              <feature.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Features */}
        <div className="mt-12 pt-12 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">Additional Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {secondaryFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-lg border border-border bg-background/50 hover:border-accent transition-colors"
                whileHover={{ y: -4 }}
              >
                <feature.icon className="w-10 h-10 text-accent mb-4" />
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
