 export const countriesData = [
  {
    id: "ghana",
    name: "Ghana",
    region: "West Africa",
    center: [7.3697, -5.3596],
    bounds: [
      [1.5, -4],
      [11, 1],
    ],
    layers: [
      { id: "gh_district", name: "Districts", category: "Administrative", color: "#0891b2", visible: false },
      { id: "gh_forest", name: "Forest Reserves", category: "Natural", color: "#10b981", visible: false },
      { id: "gh_geology", name: "Geology", category: "Natural", color: "#d97706", visible: false },
      { id: "gh_landcover", name: "Land Cover", category: "Natural", color: "#84cc16", visible: false },
      { id: "gh_regions", name: "Regions", category: "Administrative", color: "#6366f1", visible: true },
      { id: "gh_rivers", name: "Rivers", category: "Natural", color: "#3b82f6", visible: true },
      { id: "gh_soil", name: "Soil Type", category: "Natural", color: "#92400e", visible: false },
      { id: "gh_spots", name: "Spot Heights", category: "Topographic", color: "#78716c", visible: false },
      { id: "gh_villages", name: "Villages", category: "Infrastructure", color: "#ef4444", visible: false },
    ],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    region: "West Africa",
    center: [9.0765, 8.6753],
    bounds: [
      [4, 2],
      [14, 15],
    ],
    layers: [
      { id: "ng_state", name: "States", category: "Administrative", color: "#6366f1", visible: false },
      { id: "ng_lga", name: "Local Govt Areas", category: "Administrative", color: "#8b5cf6", visible: false },
      { id: "ng_vegetation", name: "Vegetation", category: "Natural", color: "#10b981", visible: false },
      { id: "ng_soil", name: "Soil Type", category: "Natural", color: "#92400e", visible: false },
      { id: "ng_elevation", name: "Elevation", category: "Topographic", color: "#78716c", visible: false },
      { id: "ng_roads", name: "Road Networks", category: "Infrastructure", color: "#f59e0b", visible: false },
      { id: "ng_settlements", name: "Settlements", category: "Infrastructure", color: "#ef4444", visible: false },
    ],
  },
  {
    id: "benin",
    name: "Benin",
    region: "West Africa",
    center: [9.3077, 1.9369],
    bounds: [
      [6, 0.5],
      [12.5, 3.5],
    ],
    layers: [
      { id: "bn_departments", name: "Departments", category: "Administrative", color: "#6366f1", visible: false },
      { id: "bn_forests", name: "Forests", category: "Natural", color: "#10b981", visible: false },
      { id: "bn_wetlands", name: "Wetlands", category: "Natural", color: "#06b6d4", visible: false },
      { id: "bn_settlements", name: "Settlements", category: "Infrastructure", color: "#ef4444", visible: false },
      { id: "bn_water", name: "Water Bodies", category: "Natural", color: "#3b82f6", visible: false },
    ],
  },
  {
    id: "burkina",
    name: "Burkina Faso",
    region: "West Africa",
    center: [12.2383, -1.5616],
    bounds: [
      [10, -5],
      [14.5, 2.5],
    ],
    layers: [
      { id: "bk_regions", name: "Regions", category: "Administrative", color: "#6366f1", visible: false },
      { id: "bk_vegetation", name: "Vegetation", category: "Natural", color: "#10b981", visible: false },
      { id: "bk_water", name: "Water Resources", category: "Natural", color: "#3b82f6", visible: false },
      { id: "bk_settlements", name: "Settlements", category: "Infrastructure", color: "#ef4444", visible: false },
      { id: "bk_soil", name: "Soil", category: "Natural", color: "#92400e", visible: false },
      { id: "bk_land_use", name: "Land Use", category: "Natural", color: "#84cc16", visible: false },
    ],
  },
  {
    id: "cote",
    name: "Côte d'Ivoire",
    region: "West Africa",
    center: [7.54, -5.5471],
    bounds: [
      [4.5, -8.5],
      [10.5, -2],
    ],
    layers: [
      { id: "ci_regions", name: "Regions", category: "Administrative", color: "#6366f1", visible: false },
      { id: "ci_forest", name: "Forest Coverage", category: "Natural", color: "#10b981", visible: false },
      { id: "ci_cocoa", name: "Cocoa Regions", category: "Infrastructure", color: "#d97706", visible: false },
      { id: "ci_roads", name: "Roads", category: "Infrastructure", color: "#f59e0b", visible: false },
      { id: "ci_elevation", name: "Elevation", category: "Topographic", color: "#78716c", visible: false },
    ],
  },
  {
    id: "mali",
    name: "Mali",
    region: "West Africa",
    center: [17.5707, -3.9962],
    bounds: [
      [10, -12],
      [25, 4],
    ],
    layers: [
      { id: "ml_regions", name: "Regions", category: "Administrative", color: "#6366f1", visible: false },
      { id: "ml_vegetation", name: "Vegetation", category: "Natural", color: "#10b981", visible: false },
      { id: "ml_water", name: "Water Resources", category: "Natural", color: "#3b82f6", visible: false },
    ],
  },
]

export const getCountryById = (id) => countriesData.find((c) => c.id === id)

export const getAllLayers = () => {
  const layers = []
  countriesData.forEach((country) => {
    layers.push(...country.layers)
  })
  return layers
}

export const getVisibleLayersCount = () => {
  return getAllLayers().filter((l) => l.visible).length
}
