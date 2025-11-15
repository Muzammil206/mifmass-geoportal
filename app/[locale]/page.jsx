import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import FooterSection from "@/components/footer-section"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-brfrom-background via-background to-secondary/20">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FooterSection />
    </div>
  )
}