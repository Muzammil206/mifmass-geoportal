"use client"
import { motion } from "framer-motion"

import { Globe } from "lucide-react"

export default function PartnersSection() {
  const partners = [
    {
      name: "African Union",
      description: "Supporting geospatial data initiatives across Africa",
      color: "from-blue-600 to-blue-700",
      logo: "/au.jpg",
    },
    {
      name: "European Union",
      description: "Collaborative partner for data standards and technology",
      color: "from-yellow-500 to-blue-600",
      logo: "/eu.jpg",
    },
    {
      name: "MIMAF",
      description: "Advancing geospatial development in West Africa",
      color: "from-green-600 to-teal-600",
      logo: "/logo2.png",
    },
  ]

  return (
    <section id="partners" className="py-16 md:py-24 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Supported by Leading Organizations</h2>
                  <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-16 max-w-md mx-auto rounded-full shadow-lg shadow-orange-500/30"
        />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We collaborate with international partners committed to advancing geospatial data accessibility and
            development across Africa.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Gradient Header */}
              <div
                className={`h-40  flex items-center justify-center relative overflow-hidden`}
              >
                {/* Decorative circles */}
                <div className="absolute w-40 h-40 bg-white/10 rounded-full -top-20 -right-20 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute w-24 h-24 bg-white/10 rounded-full -bottom-10 -left-10" />

                {/* Logo/Icon */}
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} logo`}
                  className="relative z-10 w-24 h-24 object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{partner.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 p-8 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-4">
            <Globe className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Partnership Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Interested in collaborating with us? We welcome partnerships with organizations committed to advancing
                geospatial data accessibility and development across West Africa. Contact us to discuss potential
                collaborations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
