'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AdvancedFilters from '@/components/filters/AdvancedFilters';
import VehicleBadge, { StatusBadge, ConditionBadge, PriceBadge } from '@/components/vehicle/VehicleBadges';
import VehicleContactForm from '@/components/forms/VehicleContactForm';
import EnhancedVehicleCard from '@/components/vehicle/EnhancedVehicleCard';
import PurchaseGuide from '@/components/purchase/PurchaseGuide';

const mockVehicles = [
  {
    id: '1',
    title: 'BMW 320d xDrive Touring',
    make: 'BMW',
    model: '320d',
    year: 2021,
    price: 32500,
    originalPrice: 35000,
    mileage: 45000,
    fuelType: 'diesel',
    transmission: 'automatic',
    location: 'Bucharest, Romania',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    ],
    condition: 'excellent' as const,
    status: 'active' as const,
    isFeatured: true,
    isVerified: true,
    isNew: false,
    dealerRating: 4.8,
    viewCount: 234,
    savedCount: 45,
  },
  {
    id: '2',
    title: 'Audi A4 2.0 TDI quattro',
    make: 'Audi',
    model: 'A4',
    year: 2022,
    price: 38900,
    mileage: 15000,
    fuelType: 'diesel',
    transmission: 'automatic',
    location: 'Cluj-Napoca, Romania',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    ],
    condition: 'new' as const,
    status: 'active' as const,
    isFeatured: true,
    isVerified: true,
    isNew: true,
    dealerRating: 4.9,
    viewCount: 567,
    savedCount: 89,
  },
  {
    id: '3',
    title: 'Mercedes-Benz C 220d',
    make: 'Mercedes',
    model: 'C-Class',
    year: 2020,
    price: 29500,
    originalPrice: 32000,
    mileage: 65000,
    fuelType: 'diesel',
    transmission: 'automatic',
    location: 'Timișoara, Romania',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
    ],
    condition: 'good' as const,
    status: 'reserved' as const,
    isFeatured: false,
    isVerified: true,
    isNew: false,
    dealerRating: 4.6,
    viewCount: 189,
    savedCount: 32,
  },
  {
    id: '4',
    title: 'Volkswagen Golf GTI',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2019,
    price: 24500,
    mileage: 78000,
    fuelType: 'petrol',
    transmission: 'manual',
    location: 'Iași, Romania',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    ],
    condition: 'good' as const,
    status: 'active' as const,
    isFeatured: false,
    isVerified: false,
    isNew: false,
    viewCount: 145,
    savedCount: 23,
  },
];

export default function UIShowcase() {
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Frontend UI Components
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Îmbunătățiri pentru filtre, formulare, badge-uri și instrucțiuni de cumpărare
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="filters" className="py-3">
              🔍 Filtre Avansate
            </TabsTrigger>
            <TabsTrigger value="badges" className="py-3">
              🏷️ Badge-uri
            </TabsTrigger>
            <TabsTrigger value="cards" className="py-3">
              🚗 Carduri Vehicule
            </TabsTrigger>
            <TabsTrigger value="forms" className="py-3">
              📝 Formulare
            </TabsTrigger>
            <TabsTrigger value="guide" className="py-3">
              📖 Ghid Cumpărare
            </TabsTrigger>
          </TabsList>

          {/* Advanced Filters Tab */}
          <TabsContent value="filters" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Filtre Avansate pentru Căutare</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Filtre comprehensive cu căutare rapidă, mărci populare, range-uri de preț și an, 
                tipuri de combustibil, transmisie, caroserie și caracteristici.
              </p>
              <AdvancedFilters
                onFilterChange={(filters) => console.log('Filters:', filters)}
              />
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="p-6 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Badge-uri pentru Vehicule</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Badge-uri colorat pentru diverse statusuri și caracteristici ale vehiculelor.
                </p>

                <div className="space-y-6">
                  {/* Vehicle Badges */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Badge-uri Speciale</h3>
                    <div className="flex flex-wrap gap-3">
                      <VehicleBadge type="verified" size="md" />
                      <VehicleBadge type="featured" size="md" />
                      <VehicleBadge type="new" size="md" />
                      <VehicleBadge type="hot" size="md" />
                      <VehicleBadge type="deal" size="md" />
                      <VehicleBadge type="fast-delivery" size="md" />
                      <VehicleBadge type="warranty" size="md" />
                      <VehicleBadge type="premium" size="md" />
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Badge-uri Status</h3>
                    <div className="flex flex-wrap gap-3">
                      <StatusBadge status="active" />
                      <StatusBadge status="sold" />
                      <StatusBadge status="reserved" />
                      <StatusBadge status="pending" />
                      <StatusBadge status="draft" />
                    </div>
                  </div>

                  {/* Condition Badges */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Badge-uri Condiție</h3>
                    <div className="flex flex-wrap gap-3">
                      <ConditionBadge condition="new" />
                      <ConditionBadge condition="excellent" />
                      <ConditionBadge condition="good" />
                      <ConditionBadge condition="fair" />
                    </div>
                  </div>

                  {/* Price Badges */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Badge-uri Preț cu Reduceri</h3>
                    <div className="space-y-4">
                      <PriceBadge currentPrice={25000} originalPrice={28000} />
                      <PriceBadge currentPrice={32500} originalPrice={35000} />
                      <PriceBadge currentPrice={18900} />
                    </div>
                  </div>

                  {/* Size Variants */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Dimensiuni Diferite</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <VehicleBadge type="verified" size="sm" />
                      <VehicleBadge type="verified" size="md" />
                      <VehicleBadge type="verified" size="lg" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Vehicle Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Carduri Îmbunătățite pentru Vehicule</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Carduri moderne cu carusel de imagini, efecte hover, quick view și informații detaliate.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockVehicles.map((vehicle) => (
                  <EnhancedVehicleCard
                    key={vehicle.id}
                    {...vehicle}
                    onSave={() => console.log('Saved:', vehicle.id)}
                    onShare={() => console.log('Shared:', vehicle.id)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Formular de Contact</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Formular intuitiv cu template-uri predefinite pentru diferite tipuri de cereri.
                </p>
              </div>
              <div></div>
              
              <div className="lg:col-span-2">
                <VehicleContactForm
                  vehicleId={selectedVehicle.id}
                  vehicleTitle={selectedVehicle.title}
                  sellerName="Premium Auto Dealer"
                  sellerPhone="+40 722 123 456"
                  onSubmit={async (data) => {
                    console.log('Form submitted:', data);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Purchase Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ghid Complet de Cumpărare</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Instrucțiuni pas cu pas pentru achiziția sigură a unui vehicul.
              </p>
            </div>
            <PurchaseGuide />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">✨ Toate componentele sunt gata de integrare!</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Componentele sunt construite cu TypeScript, TailwindCSS, și shadcn/ui. 
              Sunt responsive, accesibile, și optimizate pentru performanță.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">✅ Responsive Design</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✅ Dark Mode Support</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✅ TypeScript</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✅ Accessibility</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✅ Animation Effects</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
