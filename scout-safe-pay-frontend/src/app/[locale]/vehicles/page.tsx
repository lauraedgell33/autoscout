'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { vehicleService, Vehicle } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function VehiclesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getVehicles({ status: 'active' });
        setVehicles(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

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
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{`${vehicle.make} ${vehicle.model}`}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <img 
                        src={vehicle.primary_image || '/placeholder-vehicle.jpg'} 
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover rounded"
                      />
                      <div>
                        <p className="text-gray-600">Category: {vehicle.category}</p>
                        <p className="text-gray-600">Year: {vehicle.year}</p>
                        <p className="text-gray-600">Mileage: {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</p>
                      </div>
                      
                      {/* Dealer Information */}
                      {vehicle.dealer && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {vehicle.dealer.logo_url && (
                                <img
                                  src={vehicle.dealer.logo_url}
                                  alt={vehicle.dealer.company_name}
                                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {vehicle.dealer.company_name}
                                </p>
                                {vehicle.dealer.review_stats && (
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-2 h-2 ${
                                          i < Math.floor(vehicle.dealer.review_stats?.average_rating || 0)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs text-gray-600">
                                      {vehicle.dealer.review_stats.average_rating?.toFixed(1)} ({vehicle.dealer.review_stats.total_reviews})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push(`/dealers/${vehicle.dealer.id}`)
                              }}
                              className="whitespace-nowrap flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Profile
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-2xl font-bold text-blue-600">
                          {vehicle.currency} {parseFloat(String(vehicle.price)).toLocaleString()}
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
