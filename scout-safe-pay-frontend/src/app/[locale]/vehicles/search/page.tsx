'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, Filter, SlidersHorizontal, MapPin, Map } from 'lucide-react';
import vehicleService, { Vehicle } from '@/lib/api/vehicles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/routing';

// Dynamic import for Leaflet map (requires window)
const VehicleMap = dynamic(() => import('@/components/map/VehicleMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center"><p>Loading map...</p></div>
});

export default function VehicleSearchPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    price_min: '',
    price_max: '',
    year_from: '',
    year_to: '',
    fuel_type: '',
    transmission: '',
    mileage_max: '',
    location_city: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchParams: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams[key] = value;
      });
      
      const response = await vehicleService.getVehicles(searchParams);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Vehicle Search</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Find your perfect vehicle with detailed filters</p>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="search-query"
              name="search"
              type="text"
              placeholder="Search by make, model, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-10"
              autoComplete="off"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search-make" className="block text-sm font-medium mb-1">Make</label>
              <Input
                id="search-make"
                name="make"
                placeholder="e.g., BMW"
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="search-min-price" className="block text-sm font-medium mb-1">Min Price (€)</label>
              <Input
                id="search-min-price"
                name="minPrice"
                type="number"
                placeholder="0"
                value={filters.price_min}
                onChange={(e) => setFilters({...filters, price_min: e.target.value})}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="search-max-price" className="block text-sm font-medium mb-1">Max Price (€)</label>
              <Input
                id="search-max-price"
                name="maxPrice"
                type="number"
                placeholder="100000"
                value={filters.price_max}
                onChange={(e) => setFilters({...filters, price_max: e.target.value})}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="search-year-from" className="block text-sm font-medium mb-1">Year From</label>
              <Input
                id="search-year-from"
                name="yearFrom"
                type="number"
                placeholder="2015"
                value={filters.year_from}
                onChange={(e) => setFilters({...filters, year_from: e.target.value})}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="search-year-to" className="block text-sm font-medium mb-1">Year To</label>
              <Input
                id="search-year-to"
                name="yearTo"
                type="number"
                placeholder="2024"
                value={filters.year_to}
                onChange={(e) => setFilters({...filters, year_to: e.target.value})}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                value={filters.fuel_type}
                onChange={(e) => setFilters({...filters, fuel_type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="">All</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => setFilters({...filters, transmission: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="">All</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Mileage (km)</label>
              <Input
                type="number"
                placeholder="100000"
                value={filters.mileage_max}
                onChange={(e) => setFilters({...filters, mileage_max: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => setFilters({
              search: '', make: '', price_min: '', price_max: '', year_from: '', year_to: '',
              fuel_type: '', transmission: '', mileage_max: '', location_city: ''
            })}>
              Clear Filters
            </Button>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search Vehicles'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {(vehicles || []).length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {(vehicles || []).length} vehicles found
            </h2>
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded transition ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded transition flex items-center gap-1 ${
                    viewMode === 'map'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Map
                </button>
              </div>
              <select className="px-4 py-2 border rounded-lg">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Year: Newest First</option>
                <option>Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/${locale}/vehicle/${vehicle.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      {vehicle.primary_image && (
                        <img src={vehicle.primary_image} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        €{parseFloat(vehicle.price).toLocaleString()}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>Year: {vehicle.year}</div>
                        <div>Mileage: {vehicle.mileage?.toLocaleString()} km</div>
                        <div className="capitalize">Fuel: {vehicle.fuel_type}</div>
                        <div className="capitalize">Trans: {vehicle.transmission}</div>
                      </div>
                      {vehicle.location_city && (
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {vehicle.location_city}, {vehicle.location_country}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Show first vehicle with coordinates or a generic map */}
              {(() => {
                const vehicleWithCoords = (vehicles ?? []).find(v => v.latitude && v.longitude);
                return vehicleWithCoords ? (
                  <VehicleMap
                    latitude={vehicleWithCoords.latitude!}
                    longitude={vehicleWithCoords.longitude!}
                    title="Search Results Map"
                    height="600px"
                    zoom={12}
                  />
                ) : (
                  <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Map data not available for selected vehicles</p>
                    </div>
                  </div>
                );
              })()}
              <p className="text-sm text-gray-600 mt-4 text-center">
                Showing location of first result with available coordinates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
