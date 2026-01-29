'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Plus, Eye, Edit, Trash2, Package } from 'lucide-react';
import vehicleService, { Vehicle } from '@/lib/api/vehicles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SellerVehiclesPage({ params }: { params: { locale: string } }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles({ per_page: 100 });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      sold: 'bg-blue-100 text-blue-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      removed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Vehicles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{vehicles.length} total listings</p>
        </div>
        <Link href={`/${params.locale}/seller/vehicles/new`}>
          <Button><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No vehicles listed</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start selling by adding your first vehicle</p>
            <Link href={`/${params.locale}/seller/vehicles/new`}>
              <Button>Add Your First Vehicle</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                {vehicle.primary_image ? (
                  <img src={vehicle.primary_image} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(vehicle.status)}`}>
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-3">€{parseFloat(vehicle.price).toLocaleString()}</p>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex justify-between"><span>Year:</span><span>{vehicle.year}</span></div>
                  <div className="flex justify-between"><span>Mileage:</span><span>{vehicle.mileage?.toLocaleString()} km</span></div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/${params.locale}/vehicle/${vehicle.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
                  </Link>
                  <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteVehicle(vehicle.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
