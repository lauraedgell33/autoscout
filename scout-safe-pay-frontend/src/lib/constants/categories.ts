// Static vehicle categories configuration
// Use this until /api/categories endpoint is implemented

export const VEHICLE_CATEGORIES = [
  { id: 'car', name: 'Car', slug: 'car' },
  { id: 'motorcycle', name: 'Motorcycle', slug: 'motorcycle' },
  { id: 'van', name: 'Van', slug: 'van' },
  { id: 'truck', name: 'Truck', slug: 'truck' },
  { id: 'trailer', name: 'Trailer', slug: 'trailer' },
  { id: 'caravan', name: 'Caravan', slug: 'caravan' },
  { id: 'motorhome', name: 'Motorhome', slug: 'motorhome' },
  { id: 'construction', name: 'Construction Machinery', slug: 'construction' },
  { id: 'agricultural', name: 'Agricultural Machinery', slug: 'agricultural' },
  { id: 'forklift', name: 'Forklift', slug: 'forklift' },
  { id: 'boat', name: 'Boat', slug: 'boat' },
  { id: 'atv', name: 'ATV', slug: 'atv' },
  { id: 'quad', name: 'Quad', slug: 'quad' },
] as const;

export type VehicleCategory = typeof VEHICLE_CATEGORIES[number];

export const getCategoryById = (id: string) => {
  return VEHICLE_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryBySlug = (slug: string) => {
  return VEHICLE_CATEGORIES.find(cat => cat.slug === slug);
};
