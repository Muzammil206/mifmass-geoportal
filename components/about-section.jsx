"use client"

import { motion } from "framer-motion"
import { Map, Database, Share2, Zap, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

const features = [
  {
    icon: Map,
    title: "Comprehensive Data",
    description: "Access extensive geospatial datasets for all West African countries",
  },
  {
    icon: Database,
    title: "Multiple Formats",
    description: "Download data in GeoJSON, Shapefile, and other standard formats",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share maps and data insights with colleagues and stakeholders",
  },
  {
    icon: Zap,
    title: "Fast Search",
    description: "Powered by Nominatim geocoding for quick location discovery",
  },
  {
    icon: Globe,
    title: "Regional Focus",
    description: "Specialized for West African geographic and environmental data",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "Built for teams and organizations working across the region",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function AboutSection() {
  const t = useTranslations()

  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="mb-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">About Us</span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 text-foreground"
          >
            Mapping West Africa's Future
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            The West Africa GeoPortal is a comprehensive geospatial data platform designed to empower researchers,
            policymakers, and development professionals with accessible geographic information across the region.
          </motion.p>
        </motion.div>

        {/* Mission and Vision */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16 lg:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Mission */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide unified access to authoritative geospatial data that enables informed decision-making for
              sustainable development across West Africa.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become the leading open-source geospatial platform for West Africa, fostering collaboration and
              innovation in regional data sharing and analysis.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16 lg:mb-20">
          <motion.h3
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Key Features
          </motion.h3>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground mb-6">Ready to explore West Africa's geospatial data?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/map">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore the Map
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary/50 bg-transparent">
                Learn More
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
