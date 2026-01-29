'use client';

import { useTranslations } from 'next-intl';
import { useVehicles } from '@/lib/hooks/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VehiclesPage() {
  const t = useTranslations();
  const { data: vehicles, isLoading } = useVehicles();

  return (
    <>      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('vehicles') || 'Available Vehicles'}
            </h1>
            <p className="text-xl text-gray-600">
              {t('browse_our_selection') || 'Browse our selection of quality vehicles'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{vehicle.name || vehicle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded"
                      />
                      <div>
                        <p className="text-gray-600">Category: {vehicle.category}</p>
                        <p className="text-gray-600">Year: {vehicle.year}</p>
                        <p className="text-gray-600">Mileage: {vehicle.mileage} km</p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-2xl font-bold text-blue-600">
                          €{vehicle.price.toLocaleString()}
                        </span>
                        <Link href={`/vehicle/${vehicle.id}`}>
                          <Button>View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No vehicles available</p>
            </div>
          )}
        </div>
      </div>    </>
  );
}
