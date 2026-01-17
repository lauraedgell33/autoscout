export const categoryLabels: Record<string, { label: string; icon: string }> = {
  car: { label: 'Car', icon: '🚗' },
  motorcycle: { label: 'Motorcycle', icon: '🏍️' },
  van: { label: 'Van', icon: '🚐' },
  truck: { label: 'Truck', icon: '🚚' },
  trailer: { label: 'Trailer', icon: '🚛' },
  caravan: { label: 'Caravan', icon: '🚙' },
  motorhome: { label: 'Motorhome', icon: '🏕️' },
  construction_machinery: { label: 'Construction Machinery', icon: '🏗️' },
  agricultural_machinery: { label: 'Agricultural Machinery', icon: '🚜' },
  forklift: { label: 'Forklift', icon: '🔧' },
  boat: { label: 'Boat', icon: '⛵' },
  atv: { label: 'ATV', icon: '🛞' },
  quad: { label: 'Quad', icon: '🏁' },
}

export const getCategoryLabel = (category: string) => {
  return categoryLabels[category] || { label: category, icon: '🚗' }
}
