import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import FooterSection from "@/components/footer-section"
import AboutImpact from "@/components/about-impact"
import PartnersSection from "@/components/partners"

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-brfrom-background via-background to-secondary/20">
      <Navbar />
      <HeroSection />
      
      <AboutImpact />
      <FeaturesSection />
      <PartnersSection />
      <FooterSection />
    </div>
  )
}