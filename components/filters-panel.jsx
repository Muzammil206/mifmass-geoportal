"use client"

export default function FiltersPanel({ filters, onFilterChange, categories }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/20 border border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Visibility Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Visibility</label>
        <select
          value={filters.visibility}
          onChange={(e) => onFilterChange({ ...filters, visibility: e.target.value })}
          className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
        >
          <option value="all">All Layers</option>
          <option value="visible">Visible Only</option>
          <option value="hidden">Hidden Only</option>
        </select>
      </div>
    </div>
  )
}
