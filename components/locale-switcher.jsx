"use client"

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './ui/button'

export default function LocaleSwitcher() {
  const locale = useLocale()       // current locale, e.g., 'en' or 'fr'
  const pathname = usePathname()   // current path, e.g., '/about'

  // Remove the current locale from pathname
  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] === locale) segments.shift()
  const pathWithoutLocale = '/' + segments.join('/')

  // Determine next locale
  const nextLocale = locale === 'en' ? 'fr' : 'en'

  // Default locale ('en') should not include prefix
  const href = nextLocale === 'en' ? pathWithoutLocale : `/${nextLocale}${pathWithoutLocale}`

  return (
    <Link href={href} replace>
      <Button>
        Switch to {nextLocale === 'en' ? 'English' : 'French'}
      </Button>
    </Link>
  )
}
