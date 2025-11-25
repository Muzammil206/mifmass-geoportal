 export const countriesData = [
  {
    id: "ghana_black_volta",
    name: "Ghana",
    region: "West Africa",
    center: [7.3697, -5.3596],
    bounds: [
      [1.5, -4],
      [11, 1],
    ],

  },
  {
    id: "nigeria_ona_river_basin",
    name: "Nigeria",
    region: "West Africa",
    center: [9.0765, 8.6753],
    bounds: [
      [4, 2],
      [14, 15],
    ],
  
  },
  {
    id: "benin_oueme",
    name: "Benin",
    region: "West Africa",
    center: [9.3077, 1.9369],
    bounds: [
      [6, 0.5],
      [12.5, 3.5],
    ],

  },
 
  {
    id: "cote_dlvoire",
    name: "Côte d'Ivoire",
    region: "West Africa",
    center: [7.54, -5.5471],
    bounds: [
      [4.5, -8.5],
      [10.5, -2],
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
