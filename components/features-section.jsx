"use client"

import { Globe, Download, Filter, Zap, Users, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function FeaturesSection() {
  const t = useTranslations()
  const mainFeatures = [
    {
      icon: Globe,
      title: t('Features.MultiCountryCoverage'),
      description: t('Features.MultiCountryCoverageDesc'),
    },
    {
      icon: Download,
      title: t('Features.MultipleExportFormats'),
      description: t('Features.MultipleExportFormatsDesc'),
    },
    {
      icon: Filter,
      title: t('Features.AdvancedFiltering'),
      description: t('Features.AdvancedFilteringDesc'),
    },
  ]

  const secondaryFeatures = [
    {
      icon: Zap,
      title: t('Features.RealTimeUpdates'),
      description: t('Features.RealTimeUpdatesDesc'),
    },
    {
      icon: Users,
      title: t('Features.CommunityDriven'),
      description: t('Features.CommunityDrivenDesc'),
    },
    {
      icon: BookOpen,
      title: t('Features.DocumentationGuides'),
      description: t('Features.DocumentationGuidesDesc'),
    },
  ]

  return (
    <motion.section
      className="py-7 border-t border-border bg-card/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-0 py-0">
        {/* Main Features */}
        <h2 className="text-3xl font-bold text-foreground text-center ">{t('Features.title')}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{t('Features.description')}</p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-5 rounded-lg border border-border bg-background hover:border-accent transition-colors"
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
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">{t('Features.additionalTitle')}</h3>
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
