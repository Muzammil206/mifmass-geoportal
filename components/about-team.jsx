"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin } from "lucide-react"

const team = [
  {
    name: "Dr. Kwame Mensah",
    role: "Executive Director",
    bio: "Leading geospatial initiatives across West Africa with 15+ years of experience in GIS and data science.",
    email: "kwame@geoportal.org",
  },
  {
    name: "Amara Diallo",
    role: "Data Lead",
    bio: "Manages the comprehensive geospatial dataset collection and ensures data quality and accessibility.",
    email: "amara@geoportal.org",
  },
  {
    name: "Chioma Okonkwo",
    role: "Technical Director",
    bio: "Oversees platform development and maintains the infrastructure that serves geospatial data globally.",
    email: "chioma@geoportal.org",
  },
  {
    name: "Mohammed Traoré",
    role: "Regional Coordinator",
    bio: "Coordinates regional partnerships and stakeholder engagement across West African nations.",
    email: "mohammed@geoportal.org",
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

export default function AboutTeam() {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-4 text-foreground"
        >
          Meet Our Team
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
        >
          Dedicated professionals committed to advancing geospatial knowledge and data accessibility across West Africa.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4" />
              <h3 className="font-bold text-foreground mb-1 text-lg">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>
              <div className="flex gap-3">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  title={`Email ${member.name}`}
                >
                  <Mail className="w-4 h-4 text-primary" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  title={`LinkedIn profile`}
                >
                  <Linkedin className="w-4 h-4 text-primary" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
