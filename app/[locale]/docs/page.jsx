import Navbar from "@/components/navbar"
import FooterSection from "@/components/footer-section"
import { DocsHero } from "@/components/docs-hero"
import { DocsContent } from "@/components/docs-content"
import { DocsSidebar } from "@/components/docs-sidebar"

export const metadata = {
  title: "Documentation | West Africa GeoPortal",
  description:
    "Learn how to use the West Africa GeoPortal - explore, discover, and analyze geospatial data across West Africa.",
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <DocsHero />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <DocsSidebar />
          <DocsContent />
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
