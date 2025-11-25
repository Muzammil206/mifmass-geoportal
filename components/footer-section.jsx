"use client"

import Link from "next/link"
import { Globe, Mail, Linkedin, Twitter, Youtube } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

export default function FooterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Explore Maps", href: "/map" },
        { label: "Download Data", href: "/map" },
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Tutorials", href: "#" },
        { label: "Case Studies", href: "#" },
        { label: "Publications", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Us", href: "#" },
        { label: "Our Mission", href: "#" },
        { label: "Partners", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Data License", href: "#" },
        { label: "Disclaimer", href: "#" },
      ],
    },
  ]
  const partners = ["African Union Commission", "European Union"]

  return (
    <footer className="border-t border-border bg-green-600">
      {/* Newsletter Section */}
      <div className="bg-green-700 border-b border-green-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-green-100">
                Get updates on new datasets, features, and announcements delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2 md:shrink-0">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg border border-green-500 bg-green-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button type="submit" className="whitespace-nowrap bg-white text-green-600 hover:bg-green-50">
                Subscribe
              </Button>
            </form>
          </div>
          {subscribed && <p className="text-sm text-white mt-2">Thank you for subscribing!</p>}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-white" />
              <h4 className="font-bold text-white">West Africa GeoPortal</h4>
            </div>
            <p className="text-xs text-green-100 mb-6">
              Making geospatial data accessible across West Africa for research, planning, and development.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-green-100 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="text-green-100 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="text-green-100 hover:text-white transition">
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h5 className="font-semibold text-white mb-4 text-sm">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.href} className="text-xs text-green-100 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partners Section */}
        <div className="border-t border-green-500 pt-8 mb-8">
          <p className="text-xs text-green-100 mb-4">Supported By:</p>
          <div className="flex flex-wrap gap-6">
            {partners.map((partner, idx) => (
              <p key={idx} className="text-sm font-medium text-green-50">
                {partner}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-green-100">© 2025 West Africa GeoPortal. All rights reserved.</p>
          <p className="text-xs text-green-100 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <a href="mailto:info@westafricageoportal.org" className="hover:text-white transition">
              info@westafricageoportal.org
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
