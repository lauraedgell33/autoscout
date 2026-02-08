'use client';

import { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, X, ChevronDown, Calendar, 
  Coins, MapPin, Fuel, Gauge, Settings, Car, Bike, Truck 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getMakesByCategory, getModelsByMake } from '@/lib/data/vehicleData';
import { VEHICLE_CATEGORIES } from '@/lib/constants/categories';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AdvancedFiltersProps {
  onApplyFilters: (filters: VehicleFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface VehicleFilters {
  search?: string;
  category?: string;
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

// Category icons and emojis
const CATEGORY_ICONS: Record<string, string> = {
  car: '🚗',
  motorcycle: '🏍️',
  truck: '🚚',
  van: '🚐',
  trailer: '🚛',
  caravan: '🚙',
  motorhome: '🏕️',
  construction: '🏗️',
  agricultural: '🚜',
  forklift: '🔧',
  boat: '⛵',
  atv: '🏁',
  quad: '🏁',
};

// Category-specific filter options
const FUEL_TYPES_BY_CATEGORY: Record<string, string[]> = {
  car: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'LPG', 'CNG'],
  motorcycle: ['Petrol', 'Electric'],
  truck: ['Diesel', 'Petrol', 'LPG', 'CNG', 'Electric'],
  van: ['Diesel', 'Petrol', 'Electric', 'Hybrid', 'LPG'],
  trailer: [],
  caravan: [],
  motorhome: ['Diesel', 'Petrol', 'LPG'],
  construction: ['Diesel', 'Electric'],
  agricultural: ['Diesel', 'Electric'],
  forklift: ['Diesel', 'Electric', 'LPG'],
  boat: ['Diesel', 'Petrol', 'Electric'],
  atv: ['Petrol', 'Electric'],
  quad: ['Petrol', 'Electric'],
};

const TRANSMISSIONS_BY_CATEGORY: Record<string, string[]> = {
  car: ['Manual', 'Automatic', 'Semi-automatic', 'CVT'],
  motorcycle: ['Manual', 'Automatic', 'Semi-automatic'],
  truck: ['Manual', 'Automatic', 'Semi-automatic'],
  van: ['Manual', 'Automatic'],
  trailer: [],
  caravan: [],
  motorhome: ['Manual', 'Automatic'],
  construction: ['Manual', 'Automatic', 'Hydrostatic'],
  agricultural: ['Manual', 'Automatic', 'CVT', 'Powershift'],
  forklift: ['Automatic', 'Hydrostatic'],
  boat: ['Manual', 'Automatic'],
  atv: ['Manual', 'Automatic', 'CVT'],
  quad: ['Manual', 'Automatic', 'CVT'],
};

const BODY_TYPES_BY_CATEGORY: Record<string, string[]> = {
  car: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Minivan'],
  motorcycle: ['Sport', 'Touring', 'Cruiser', 'Naked', 'Adventure', 'Scooter', 'Chopper', 'Enduro'],
  truck: ['Box', 'Flatbed', 'Tipper', 'Tanker', 'Refrigerated', 'Curtainsider', 'Chassis'],
  van: ['Panel Van', 'Minibus', 'Combi', 'Box Van', 'Chassis Cab'],
  trailer: ['Flatbed', 'Box', 'Tipper', 'Lowloader', 'Curtainsider', 'Refrigerated', 'Tanker'],
  caravan: ['Touring', 'Static', 'Folding', 'Fifth Wheel'],
  motorhome: ['Integrated', 'Semi-integrated', 'Alcove', 'Van Conversion', 'Low Profile'],
  construction: ['Excavator', 'Loader', 'Bulldozer', 'Crane', 'Roller', 'Grader', 'Dump Truck'],
  agricultural: ['Tractor', 'Combine', 'Harvester', 'Sprayer', 'Loader', 'Telehandler'],
  forklift: ['Counterbalance', 'Reach', 'Pallet', 'Rough Terrain', 'Sideloader'],
  boat: ['Speedboat', 'Sailboat', 'Yacht', 'Fishing', 'Pontoon', 'Inflatable', 'Jet Ski'],
  atv: ['Utility', 'Sport', 'Youth', 'Side-by-Side'],
  quad: ['Utility', 'Sport', 'Youth', 'Racing'],
};

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  car: ['GPS', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Cruise Control', 'Bluetooth', 'Apple CarPlay', 'Android Auto', 'Heated Seats', '360 Camera', 'Lane Assist', 'Blind Spot Monitor'],
  motorcycle: ['ABS', 'Traction Control', 'Heated Grips', 'Cruise Control', 'Quick Shifter', 'Riding Modes', 'LED Lights', 'USB Charging'],
  truck: ['GPS', 'Air Conditioning', 'Cruise Control', 'Sleeper Cab', 'Retarder', 'ABS', 'Parking Sensors', 'Refrigeration Unit'],
  van: ['GPS', 'Air Conditioning', 'Parking Sensors', 'Bluetooth', 'Cargo Barrier', 'Roof Rack', 'Tow Bar'],
  trailer: ['ABS', 'Hydraulic Ramp', 'Refrigeration', 'Tail Lift', 'Tracking System'],
  caravan: ['Air Conditioning', 'Heating', 'Solar Panel', 'Awning', 'TV', 'Shower', 'Oven', 'Fridge'],
  motorhome: ['Air Conditioning', 'Heating', 'Solar Panel', 'Awning', 'TV', 'Shower', 'Kitchen', 'Generator', 'Satellite Dish'],
  construction: ['Air Conditioning', 'Cab Protection', 'GPS', 'Camera System', 'Quick Coupler', 'Hydraulic Hammer'],
  agricultural: ['Air Conditioning', 'GPS Guidance', 'Auto Steer', 'Front Loader', 'PTO', 'Four-Wheel Drive', 'Cab Suspension'],
  forklift: ['Side Shift', 'Fork Positioner', 'Cabin', 'Four-Wheel Drive', 'Camera', 'Blue Light'],
  boat: ['GPS', 'Fish Finder', 'Trolling Motor', 'Bimini Top', 'Anchor', 'VHF Radio', 'Swim Platform'],
  atv: ['Winch', 'Four-Wheel Drive', 'Power Steering', 'Roof', 'Windshield', 'Storage'],
  quad: ['Winch', 'Four-Wheel Drive', 'Power Steering', 'Roof', 'Windshield', 'Storage'],
};

// Default fallbacks
const DEFAULT_FUEL_TYPES = ['Petrol', 'Diesel', 'Electric'];
const DEFAULT_TRANSMISSIONS = ['Manual', 'Automatic'];
const DEFAULT_BODY_TYPES = ['Standard'];
const DEFAULT_FEATURES = ['GPS', 'Air Conditioning'];

export default function AdvancedFilters({ onApplyFilters, onReset, isLoading }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({ category: 'car' });
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const { currency, getCurrencyInfo } = useCurrency();
  
  // Get current currency info
  const currencyInfo = getCurrencyInfo(currency);

  // Get makes for selected category
  const availableMakes = useMemo(() => {
    if (!filters.category) return [];
    return getMakesByCategory(filters.category);
  }, [filters.category]);

  // Get models for selected make
  const availableModels = useMemo(() => {
    if (!filters.category || !filters.make) return [];
    // Find the make ID from the make name
    const make = availableMakes.find(m => m.name === filters.make);
    if (!make) return [];
    return getModelsByMake(filters.category, make.id);
  }, [filters.category, filters.make, availableMakes]);

  // Popular makes for quick selection (top 8 for current category)
  const popularMakes = useMemo(() => {
    return availableMakes.slice(0, 8);
  }, [availableMakes]);

  // Category-specific options
  const fuelTypes = useMemo(() => {
    return FUEL_TYPES_BY_CATEGORY[filters.category || 'car'] || DEFAULT_FUEL_TYPES;
  }, [filters.category]);

  const transmissions = useMemo(() => {
    return TRANSMISSIONS_BY_CATEGORY[filters.category || 'car'] || DEFAULT_TRANSMISSIONS;
  }, [filters.category]);

  const bodyTypes = useMemo(() => {
    return BODY_TYPES_BY_CATEGORY[filters.category || 'car'] || DEFAULT_BODY_TYPES;
  }, [filters.category]);

  const features = useMemo(() => {
    return FEATURES_BY_CATEGORY[filters.category || 'car'] || DEFAULT_FEATURES;
  }, [filters.category]);

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    let newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters when parent changes
    if (key === 'category') {
      newFilters = { ...newFilters, make: undefined, model: undefined };
    } else if (key === 'make') {
      newFilters = { ...newFilters, model: undefined };
    }
    
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
    setFilters({ category: 'car' });
    setActiveFilterCount(0);
    onReset();
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-primary-600 shadow-xl">
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
            className="text-primary-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <label htmlFor="vehicle-search" className="sr-only">Search vehicles</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <Input
            id="vehicle-search"
            name="vehicle-search"
            type="text"
            placeholder="Search by make, model, or keyword..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            autoComplete="off"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
            {VEHICLE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange('category', cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                  filters.category === cat.id
                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <span className="text-2xl mb-1">{CATEGORY_ICONS[cat.id] || '🚗'}</span>
                <span className={`text-xs font-medium ${
                  filters.category === cat.id
                    ? 'text-accent-700 dark:text-accent-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Make Selection */}
        <div>
          <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Make
          </label>
          <select
            id="vehicle-make"
            name="vehicle-make"
            value={filters.make || ''}
            onChange={(e) => handleFilterChange('make', e.target.value || undefined)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="">All Makes ({availableMakes.length} available)</option>
            {availableMakes.map((make) => (
              <option key={make.id} value={make.name}>{make.name}</option>
            ))}
          </select>
          
          {/* Popular Makes Quick Select */}
          {popularMakes.length > 0 && !filters.make && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Popular:</span>
              <div className="inline-flex flex-wrap gap-1">
                {popularMakes.map((make) => (
                  <Badge
                    key={make.id}
                    variant="default"
                    className="cursor-pointer text-xs hover:bg-accent-500 hover:text-white transition-all"
                    onClick={() => handleFilterChange('make', make.name)}
                  >
                    {make.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model Selection */}
        {filters.make && (
          <div>
            <label htmlFor="vehicle-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <select
              id="vehicle-model"
              name="vehicle-model"
              value={filters.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value || undefined)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">All Models ({availableModels.length} available)</option>
              {availableModels.map((model) => (
                <option key={model.name} value={model.name}>{model.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price-min" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Coins className="h-4 w-4" aria-hidden="true" />
                Min Price ({currencyInfo?.symbol || currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium" aria-hidden="true">
                  {currencyInfo?.symbol || currency}
                </span>
                <Input
                  id="price-min"
                  name="price-min"
                  type="number"
                  placeholder="5,000"
                  value={filters.priceMin || ''}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="price-max" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Coins className="h-4 w-4" aria-hidden="true" />
                Max Price ({currencyInfo?.symbol || currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium" aria-hidden="true">
                  {currencyInfo?.symbol || currency}
                </span>
                <Input
                  id="price-max"
                  name="price-max"
                  type="number"
                  placeholder="50,000"
                  value={filters.priceMax || ''}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="h-10 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year-from" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Year From
              </label>
              <Input
                id="year-from"
                name="year-from"
                type="number"
                placeholder="2015"
                value={filters.yearFrom || ''}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
            <div>
              <label htmlFor="year-to" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Year To
              </label>
              <Input
                id="year-to"
                name="year-to"
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
              <label htmlFor="mileage-max" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Gauge className="h-4 w-4" aria-hidden="true" />
                Max Mileage (km)
              </label>
              <Input
                id="mileage-max"
                name="mileage-max"
                type="number"
                placeholder="100,000"
                value={filters.mileageMax || ''}
                onChange={(e) => handleFilterChange('mileageMax', e.target.value ? Number(e.target.value) : undefined)}
                className="h-10"
              />
            </div>
            <div>
              <label htmlFor="vehicle-location" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Location
              </label>
              <Input
                id="vehicle-location"
                name="vehicle-location"
                type="text"
                placeholder="Berlin, Hamburg..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Fuel Type - only show if category has fuel types */}
          {fuelTypes.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Fuel className="h-4 w-4" />
                Fuel Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {fuelTypes.map((fuel) => (
                  <Button
                    key={fuel}
                    variant={filters.fuelType === fuel ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('fuelType', filters.fuelType === fuel ? '' : fuel)}
                    className="justify-start"
                  >
                    {fuel}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Transmission - only show if category has transmissions */}
          {transmissions.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="h-4 w-4" />
                Transmission
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {transmissions.map((trans) => (
                  <Button
                    key={trans}
                    variant={filters.transmission === trans ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('transmission', filters.transmission === trans ? '' : trans)}
                  >
                    {trans}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Body Type */}
          {bodyTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {filters.category === 'motorcycle' ? 'Motorcycle Type' :
                 filters.category === 'truck' ? 'Truck Type' :
                 filters.category === 'boat' ? 'Boat Type' :
                 filters.category === 'construction' ? 'Equipment Type' :
                 filters.category === 'agricultural' ? 'Equipment Type' :
                 filters.category === 'forklift' ? 'Forklift Type' :
                 'Body Type'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {bodyTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filters.bodyType === type ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('bodyType', filters.bodyType === type ? '' : type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Features & Options
              </label>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="default"
                    className={`cursor-pointer transition-all ${
                      (filters.features || []).includes(feature)
                        ? 'bg-accent-500 text-white'
                        : 'hover:bg-primary-100 dark:hover:bg-primary-900'
                    }`}
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
          )}
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
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8"
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
