'use client';

import { useState } from 'react';
import { 
  Search, SlidersHorizontal, X, ChevronDown, Calendar, 
  DollarSign, MapPin, Fuel, Gauge, Settings 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdvancedFiltersProps {
  onApplyFilters: (filters: VehicleFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface VehicleFilters {
  search?: string;
  make?: string;
  model?: string;
  priceMin?: number;
  priceMax?: number;
  yearFrom?: number;
  yearTo?: number;
  mileageMax?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  location?: string;
  features?: string[];
  condition?: string;
  dealer?: boolean;
}

const MAKES = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Ford', 'Opel', 'Renault'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-automatic'];
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Van', 'Truck', 'Wagon'];
const FEATURES = ['GPS', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Cruise Control', 'Bluetooth'];

export default function AdvancedFilters({ onApplyFilters, onReset, isLoading }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Count active filters
    const count = Object.values(newFilters).filter(v => 
      v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
    ).length;
    setActiveFilterCount(count);
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    handleFilterChange('features', newFeatures);
  };

  const handleReset = () => {
    setFilters({});
    setActiveFilterCount(0);
    onReset();
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Search Filters
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeFilterCount > 0 ? `${activeFilterCount} filters active` : 'Refine your search'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by make, model, or keyword..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Popular Makes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Popular Makes
          </label>
          <div className="flex flex-wrap gap-2">
            {MAKES.map((make) => (
              <Badge
                key={make}
                variant={filters.make === make ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  filters.make === make
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={() => handleFilterChange('make', filters.make === make ? '' : make)}
              >
                {make}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="h-4 w-4" />
                Min Price (€)
              </label>
              <Input
                type="number"
                placeholder="5,000"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="h-4 w-4" />
                Max Price (€)
              </label>
              <Input
                type="number"
                placeholder="50,000"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" />
                Year From
              </label>
              <Input
                type="number"
                placeholder="2015"
                value={filters.yearFrom || ''}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" />
                Year To
              </label>
              <Input
                type="number"
                placeholder={new Date().getFullYear().toString()}
                value={filters.yearTo || ''}
                onChange={(e) => handleFilterChange('yearTo', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
          </div>

          {/* Mileage & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Gauge className="h-4 w-4" />
                Max Mileage (km)
              </label>
              <Input
                type="number"
                placeholder="100,000"
                value={filters.mileageMax || ''}
                onChange={(e) => handleFilterChange('mileageMax', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Input
                type="text"
                placeholder="Berlin, Hamburg..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Fuel className="h-4 w-4" />
              Fuel Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {FUEL_TYPES.map((fuel) => (
                <Button
                  key={fuel}
                  variant={filters.fuelType === fuel ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('fuelType', filters.fuelType === fuel ? '' : fuel)}
                  className="justify-start"
                >
                  {fuel}
                </Button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Settings className="h-4 w-4" />
              Transmission
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TRANSMISSIONS.map((trans) => (
                <Button
                  key={trans}
                  variant={filters.transmission === trans ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('transmission', filters.transmission === trans ? '' : trans)}
                >
                  {trans}
                </Button>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {BODY_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={filters.bodyType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('bodyType', filters.bodyType === type ? '' : type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features & Options
            </label>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((feature) => (
                <Badge
                  key={feature}
                  variant={(filters.features || []).includes(feature) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                  {(filters.features || []).includes(feature) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={activeFilterCount === 0}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All ({activeFilterCount})
        </Button>
        <Button
          onClick={handleApply}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
