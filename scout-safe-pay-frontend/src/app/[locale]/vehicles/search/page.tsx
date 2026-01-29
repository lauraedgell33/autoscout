'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import vehicleService, { Vehicle } from '@/lib/api/vehicles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/routing';

export default function VehicleSearchPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
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
              type="text"
              placeholder="Search by make, model, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Make</label>
              <Input
                placeholder="e.g., BMW"
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min Price (€)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.price_min}
                onChange={(e) => setFilters({...filters, price_min: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Price (€)</label>
              <Input
                type="number"
                placeholder="100000"
                value={filters.price_max}
                onChange={(e) => setFilters({...filters, price_max: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year From</label>
              <Input
                type="number"
                placeholder="2015"
                value={filters.year_from}
                onChange={(e) => setFilters({...filters, year_from: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year To</label>
              <Input
                type="number"
                placeholder="2024"
                value={filters.year_to}
                onChange={(e) => setFilters({...filters, year_to: e.target.value})}
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
      {vehicles.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {vehicles.length} vehicles found
            </h2>
            <select className="px-4 py-2 border rounded-lg">
              <option>Sort by: Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Year: Newest First</option>
              <option>Mileage: Low to High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/${params.locale}/vehicle/${vehicle.id}`}>
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
        </div>
      )}
    </div>
  );
}
