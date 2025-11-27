

import Navbar from "@/components/navbar"
import AboutHero from "@/components/about-hero"
import AboutMission from "@/components/about-mission"
import AboutImpact from "@/components/about-impact"
import AboutTeam from "@/components/about-team"
import PartnersSection from "@/components/partners"
import FooterSection from "@/components/footer-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AboutHero />
      <AboutMission />
      <AboutImpact />
      {/* <AboutTeam /> */}
      <PartnersSection />
      <FooterSection />
    </div>
  )
}
