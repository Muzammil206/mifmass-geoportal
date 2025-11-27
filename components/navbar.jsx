"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "./language-switcher"

export default function Navbar() {
  const t = useTranslations("Navigation")
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 h-[90px]">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo2.png" alt="West Africa GeoPortal" width={200} height={130} />
        </div>

        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Home
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("about")}
          </Link>
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("documentation")}
          </Link>
          <Link href="/docs/#working-with-layers" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("resources")}
          </Link>
          <Link href="/map">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md">
              <Map className="h-4 w-4" />
              Go to Map View
            </Button>
          </Link>

          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
