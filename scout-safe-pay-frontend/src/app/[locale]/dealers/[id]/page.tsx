'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Package, MapPin, Star, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';

interface Dealer {
  id: number;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  total_sales: number;
  active_listings: number;
}

export default function DealerPage() {
  const params = useParams();
  const dealerId = params.id as string;
  const locale = params.locale as string;
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealer();
    fetchVehicles();
  }, [dealerId]);

  const fetchDealer = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/${dealerId}`);
      const data = await response.json();
      setDealer(data);
    } catch (error) {
      console.error('Error fetching dealer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/${dealerId}/vehicles`);
      const data = await response.json();
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!dealer) {
    return <div className="max-w-4xl mx-auto p-6">
      <Card className="p-12 text-center">
        <h3 className="text-lg font-medium mb-2">Dealer not found</h3>
        <Link href={`/${locale}/dealers`}>
          <Button>Back to Dealers</Button>
        </Link>
      </Card>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Link href={`/${locale}/dealers`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Dealers
        </Button>
      </Link>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dealer.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span>{(dealer.rating ?? 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{dealer.city}, {dealer.country}</span>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{dealer.description}</p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                {dealer.phone}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {dealer.email}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
              <div className="text-2xl font-bold">{dealer.total_sales}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Listings</div>
              <div className="text-2xl font-bold">{dealer.active_listings}</div>
            </Card>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Vehicles</h2>
        {vehicles.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No vehicles available from this dealer</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/${locale}/vehicle/${vehicle.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                    {vehicle.primary_image && (
                      <img src={getImageUrl(vehicle.primary_image)} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">€{parseFloat(vehicle.price).toLocaleString()}</p>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>Year: {vehicle.year}</div>
                      <div>Mileage: {vehicle.mileage?.toLocaleString()} km</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}