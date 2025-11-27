"use client"

import { motion } from "framer-motion"

const stats = [
  { number: "56+", label: "Datasets Available", description: "Across West African countries" },
  { number: "4", label: "Countries Covered", description: "Ghana, Nigeria, Benin, Côte d'Ivoire, " },
  { number: "1000+", label: "Daily Active Users", description: "Researchers and policymakers" },
  { number: "50k+", label: "Features Mapped", description: "Geographic features in our database" },
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

export default function AboutImpact() {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-8 text-foreground"
        >
          Our Impact
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-16 max-w-md mx-auto rounded-full shadow-lg shadow-orange-500/30"
        />

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.number}
              variants={itemVariants}
              className="p-6 lg:p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">{stat.label}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
