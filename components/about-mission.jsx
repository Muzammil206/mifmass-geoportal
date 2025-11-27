"use client"

import { motion } from "framer-motion"
import { Globe, Zap } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function AboutMission() {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Mission */}
          <motion.div
            variants={itemVariants}
            className="p-8 lg:p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To provide unified access to authoritative geospatial data that enables informed decision-making for
              sustainable development across West Africa, democratizing geographic information for all stakeholders.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={itemVariants}
            className="p-8 lg:p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To become the leading open-source geospatial platform for West Africa, fostering regional collaboration,
              innovation, and evidence-based policymaking through accessible, high-quality geographic data.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
