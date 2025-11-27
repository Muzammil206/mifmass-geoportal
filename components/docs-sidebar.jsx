"use client"

import { useState } from "react"
import {
  Compass,
  Search,
  Layers,
  Lightbulb,
  Star,
  HelpCircle,
  Smartphone,
  ChevronRight,
  Map,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sections = [
  { id: "getting-started", title: "Getting Started", icon: Compass },
  { id: "finding-data", title: "Finding Data", icon: Search },
  { id: "navigation", title: "Search & Navigation", icon: Map },
  { id: "working-with-layers", title: "Working with Layers", icon: Layers },
  { id: "downloading-data", title: "Downloading Data", icon: Download },
  { id: "tips", title: "Tips for Effective Use", icon: Lightbulb },
  { id: "features", title: "Key Features", icon: Star },
  { id: "help", title: "Getting Help", icon: HelpCircle },
  { id: "accessibility", title: "Accessibility", icon: Smartphone },
]

export function DocsSidebar() {
  const [activeSection, setActiveSection] = useState("getting-started")

  const handleClick = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="sticky top-24">
        <nav className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 px-3">
            On This Page
          </h3>
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <li key={section.id}>
                  <button
                    onClick={() => handleClick(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                      activeSection === section.id
                        ? "bg-[oklch(0.52_0.15_152)] text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{section.title}</span>
                    {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
