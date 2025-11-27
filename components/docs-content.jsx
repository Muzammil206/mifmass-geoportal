"use client"

import { motion } from "framer-motion"
import {
  Compass,
  Search,
  Layers,
  Lightbulb,
  Star,
  HelpCircle,
  Smartphone,
  MapPin,
  MousePointer,
  Navigation,
  Eye,
  Palette,
  Download,
  FileJson,
  FileSpreadsheet,
  Package,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Accessibility,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

function Section({ id, title, icon: Icon, children }) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-24 mb-16"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[oklch(0.52_0.15_152)]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[oklch(0.52_0.15_152)]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function InfoCard({ title, children, icon: Icon }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="w-5 h-5 text-[oklch(0.52_0.15_152)]" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{children}</CardContent>
    </Card>
  )
}

function StepList({ steps }) {
  return (
    <ol className="space-y-3 my-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[oklch(0.52_0.15_152)] text-white text-sm font-medium shrink-0">
            {index + 1}
          </span>
          <span className="text-muted-foreground">{step}</span>
        </li>
      ))}
    </ol>
  )
}

function FeatureList({ features }) {
  return (
    <ul className="space-y-2 my-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-muted-foreground">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

export function DocsContent() {
  return (
    <div className="flex-1 max-w-4xl">
      {/* Introduction */}
      <motion.div
        className="mb-12 p-6 bg-gradient-to-br from-[oklch(0.52_0.15_152)]/5 to-[oklch(0.52_0.15_152)]/10 rounded-2xl border border-[oklch(0.52_0.15_152)]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-3 text-foreground">Welcome to West Africa GeoPortal</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your gateway to exploring rich geospatial data from across West Africa. This powerful tool helps you
          visualize, analyze, and understand spatial patterns and relationships through an intuitive, web-based
          interface. Currently covering Nigeria, Ghana, Benin, Burkina Faso, Cote d&apos;Ivoire, and Mali.
        </p>
      </motion.div>

      {/* Getting Started */}
      <Section id="getting-started" title="Getting Started" icon={Compass}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <InfoCard title="First Time Users" icon={MapPin}>
            <ul className="space-y-2">
              <li>
                <strong>Access:</strong> Simply visit our website - no registration required
              </li>
              <li>
                <strong>Default View:</strong> Opens with an overview of West African countries
              </li>
              <li>
                <strong>Quick Start:</strong> Use the search bar to find locations or browse by country
              </li>
            </ul>
          </InfoCard>
          <InfoCard title="What You Can Do" icon={MousePointer}>
            <ul className="space-y-2">
              <li>Visualize multiple layers of geographic data</li>
              <li>Search for specific locations and features</li>
              <li>Analyze spatial patterns and relationships</li>
              <li>Download data in multiple formats</li>
            </ul>
          </InfoCard>
        </div>
      </Section>

      {/* Finding Data */}
      <Section id="finding-data" title="Finding Data" icon={Search}>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Access our comprehensive data collection through the country and layer selection panel on the map page.
        </p>

        <h3 className="text-lg font-semibold mb-4 text-foreground">Browse by Category</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            "Administrative Boundaries",
            "Infrastructure & Transportation",
            "Hydrology (Rivers & Water)",
            "Settlements & Population",
            "Environmental Features",
            "Roads & Routes",
          ].map((category) => (
            <div key={category} className="p-4 bg-muted rounded-lg text-sm font-medium text-foreground">
              {category}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4 text-foreground">Adding Data to Your Map</h3>
        <StepList
          steps={[
            "Select a country from the sidebar",
            "Browse available layers by category",
            "Toggle the checkbox to add/remove layers",
            "Click the info icon to view layer metadata",
            "Layers appear on the map with automatic styling",
          ]}
        />
      </Section>

      {/* Search & Navigation */}
      <Section id="navigation" title="Search & Navigation" icon={Navigation}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <InfoCard title="Find Locations" icon={Search}>
            <FeatureList
              features={[
                "Search any address, place name, or area",
                "Auto-complete suggests matches as you type",
                "Click results to zoom directly to locations",
                "Uses OpenStreetMap data for comprehensive coverage",
              ]}
            />
          </InfoCard>
          <InfoCard title="Map Navigation" icon={Navigation}>
            <ul className="space-y-2">
              <li>
                <strong>Zoom:</strong> Mouse wheel, +/- buttons, or double-click
              </li>
              <li>
                <strong>Pan:</strong> Click and drag anywhere on the map
              </li>
              <li>
                <strong>Reset:</strong> Click the compass to reset north orientation
              </li>
              <li>
                <strong>Your Location:</strong> Click the location button to find yourself
              </li>
            </ul>
          </InfoCard>
        </div>
      </Section>

      {/* Working with Layers */}
      <Section id="working-with-layers" title="Working with Layers" icon={Layers}>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Understanding Layer Types</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Points
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Individual locations like villages, facilities, and landmarks. Perfect for discrete features.
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-6 h-0.5 bg-green-500" />
                Lines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Linear features like roads, rivers, and routes. Ideal for networks and connections.
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-4 h-3 bg-orange-500/50 border border-orange-500" />
                Polygons
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Areas and boundaries like regions and land use zones. Best for coverage analysis.
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-foreground">Layer Management</h3>
        <FeatureList
          features={[
            "Toggle visibility with a single click",
            "View feature information by clicking on the map",
            "Automatic color coding for easy differentiation",
            "Access detailed metadata for each layer",
            "Multiple layer support for comparative analysis",
          ]}
        />
      </Section>

      {/* Downloading Data */}
      <Section id="downloading-data" title="Downloading Data" icon={Download}>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Export geospatial data in multiple formats for use in other applications and GIS software.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileJson className="w-5 h-5 text-blue-500" />
                GeoJSON
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Web-friendly format for use in web mapping applications and JavaScript libraries.
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-500" />
                CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Spreadsheet format for data analysis in Excel, Google Sheets, or statistical software.
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Shapefile
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Industry-standard format compatible with ArcGIS, QGIS, and professional GIS software.
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-foreground">How to Download</h3>
        <StepList
          steps={[
            "Enable at least one layer on the map",
            "Click the Download button in the toolbar",
            "Select the layers you want to export",
            "Choose your preferred format (GeoJSON, CSV, or Shapefile)",
            "Click Download to save the file",
          ]}
        />
      </Section>

      {/* Tips */}
      <Section id="tips" title="Tips for Effective Use" icon={Lightbulb}>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard title="For Quick Exploration">
            <StepList
              steps={[
                "Start with the search function to find areas of interest",
                "Select a country from the sidebar",
                "Add 2-3 relevant layers for comparison",
                "Click features to discover details",
              ]}
            />
          </InfoCard>
          <InfoCard title="For Detailed Analysis">
            <StepList
              steps={[
                "Combine related datasets (e.g., rivers with settlements)",
                "Use zoom levels for appropriate detail",
                "Access metadata for data source information",
                "Download data for offline analysis in GIS software",
              ]}
            />
          </InfoCard>
        </div>

        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              Performance Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-700">
            <ul className="space-y-1">
              <li>Load only the layers you need for your analysis</li>
              <li>Clear unused layers when switching between areas</li>
              <li>Use appropriate zoom levels for your analysis scope</li>
              <li>The platform automatically optimizes data loading</li>
            </ul>
          </CardContent>
        </Card>
      </Section>

      {/* Key Features */}
      <Section id="features" title="Key Features" icon={Star}>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard title="Intuitive Interface" icon={Monitor}>
            <FeatureList
              features={[
                "Clean, modern design focused on your data",
                "Logical workflow from discovery to analysis",
                "Responsive layout works on all devices",
              ]}
            />
          </InfoCard>
          <InfoCard title="Comprehensive Data" icon={Layers}>
            <FeatureList
              features={[
                "Multiple data categories and themes",
                "Coverage across 6 West African countries",
                "Metadata for informed decision making",
              ]}
            />
          </InfoCard>
          <InfoCard title="Powerful Visualization" icon={Eye}>
            <FeatureList
              features={[
                "Automatic styling for immediate understanding",
                "Flexible layer combinations",
                "High-performance rendering with MapLibre",
              ]}
            />
          </InfoCard>
          <InfoCard title="Drawing Tools" icon={Palette}>
            <FeatureList
              features={[
                "Draw points, lines, and polygons",
                "Measure distances and areas",
                "Export your drawings with the data",
              ]}
            />
          </InfoCard>
        </div>
      </Section>

      {/* Getting Help */}
      <Section id="help" title="Getting Help" icon={HelpCircle}>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Solutions</h3>
        <div className="space-y-4 mb-6">
          {[
            { q: "Map not loading?", a: "Check your internet connection and refresh the page." },
            {
              q: "Layers not showing?",
              a: "Ensure they're toggled on in the sidebar and you're at an appropriate zoom level.",
            },
            { q: "Search not working?", a: "Try a different search term or check your spelling." },
            { q: "Performance issues?", a: "Try reducing active layers or zooming in to a smaller area." },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground mb-1">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>

        <Card className="border-[oklch(0.52_0.15_152)]/30 bg-[oklch(0.52_0.15_152)]/5">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Need More Assistance?</strong>
              <br />
              Contact our support team for technical issues or suggest new datasets and features through our feedback
              system. Visit the About page for contact information.
            </p>
          </CardContent>
        </Card>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility" icon={Smartphone}>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard title="Cross-Platform Compatibility" icon={Monitor}>
            <FeatureList
              features={[
                "Works on desktop computers, tablets, and smartphones",
                "Compatible with all modern browsers",
                "Responsive design adapts to your screen size",
              ]}
            />
          </InfoCard>
          <InfoCard title="Accessibility Features" icon={Accessibility}>
            <FeatureList
              features={[
                "Keyboard navigation support",
                "High contrast visual elements",
                "Screen reader compatible",
                "Zoom-friendly interface",
              ]}
            />
          </InfoCard>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-[oklch(0.52_0.15_152)]/5 to-[oklch(0.52_0.15_152)]/10 rounded-2xl border border-[oklch(0.52_0.15_152)]/20 text-center">
          <p className="text-muted-foreground italic">
            Start exploring now - discover the power of spatial data at your fingertips. The platform is constantly
            evolving with new data and features, so check back regularly for updates.
          </p>
        </div>
      </Section>
    </div>
  )
}
