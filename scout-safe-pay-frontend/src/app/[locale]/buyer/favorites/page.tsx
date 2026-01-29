'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Heart, X, Eye, Package } from 'lucide-react';
import { favoritesService } from '@/lib/api/favorites';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface FavoriteVehicle {
  id: number;
  vehicle_id: number;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: string;
    mileage: number;
    fuel_type: string;
    transmission: string;
    primary_image: string;
    location_city: string;
    location_country: string;
  };
  created_at: string;
}

export default function BuyerFavoritesPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesService.list();
      setFavorites(response.data || []);
      toast.success(`Loaded ${response.data.length} favorites`);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      toast.error(error.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (vehicleId: number, favoriteId: number) => {
    try {
      await favoritesService.remove(vehicleId);
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast.error(error.response?.data?.message || 'Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {favorites.length} saved {favorites.length === 1 ? 'vehicle' : 'vehicles'}
          </p>
        </div>
        <Link href={`/${params.locale}/marketplace`}>
          <Button>Browse Vehicles</Button>
        </Link>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start adding vehicles to your favorites to see them here
            </p>
            <Link href={`/${params.locale}/marketplace`}>
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                  {favorite.vehicle.primary_image ? (
                    <img
                      src={favorite.vehicle.primary_image}
                      alt={`${favorite.vehicle.make} ${favorite.vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFavorite(favorite.vehicle_id, favorite.id)}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-red-600" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {favorite.vehicle.make} {favorite.vehicle.model}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-3">
                  €{parseFloat(favorite.vehicle.price).toLocaleString()}
                </p>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {favorite.vehicle.year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {favorite.vehicle.mileage?.toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {favorite.vehicle.fuel_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {favorite.vehicle.transmission}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/${params.locale}/vehicle/${favorite.vehicle_id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/${params.locale}/checkout/${favorite.vehicle_id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
