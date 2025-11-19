"use client"

import Link from 'next/link'
import Image from "next/image"
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './language-switcher'

export default function Navbar() {
  const t = useTranslations('Navigation');
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 h-[90px]">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-auto" src="/logo2.png" alt="West Africa GeoPortal" width={200} height={130} />
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t('about')}
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t('documentation')}
          </Link>
          <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t('resources')}
          </Link> 
          <LanguageSwitcher />
          
        </div>
      </div>
    </nav>
  )
}
