'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Package, TrendingUp, DollarSign, Eye, Plus, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { DashboardStatsGridSkeleton, TransactionListSkeleton } from '@/components/skeletons/DashboardSkeletons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getImageUrl } from '@/lib/utils';

interface SellerStats {
  total_listings: number;
  active_listings: number;
  sold_vehicles: number;
  total_revenue: string;
  pending_sales: number;
  average_price: string;
}

interface RecentSale {
  id: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    primary_image?: string;
  };
  amount: string;
  buyer_name: string;
  status: string;
  created_at: string;
}

interface SalesResponse {
  data?: RecentSale[];
}

function SellerDashboardContent() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const t = useTranslations();
  const [stats, setStats] = useState<SellerStats>({
    total_listings: 0,
    active_listings: 0,
    sold_vehicles: 0,
    total_revenue: '0',
    pending_sales: 0,
    average_price: '0'
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch seller stats using apiClient
      const statsData = await apiClient.get('/seller/stats') as SellerStats;
      setStats(statsData);

      // Fetch recent sales using apiClient
      const salesData = await apiClient.get('/seller/sales?per_page=5') as SalesResponse;
      setRecentSales(salesData.data ?? []);
      
      toast.success('Dashboard loaded successfully!');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      // Set empty arrays on error to prevent crashes
      setRecentSales([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6 animate-pulse"></div>
        <DashboardStatsGridSkeleton />
        <TransactionListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Seller Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your listings and track your sales
          </p>
        </div>
        <Link href={`/${locale}/seller/vehicles/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List New Vehicle
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.active_listings}
              </p>
            </div>
            <Package className="h-10 w-10 text-primary-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sold Vehicles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.sold_vehicles}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                €{parseFloat(stats.total_revenue).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                €{parseFloat(stats.average_price).toLocaleString()}
              </p>
            </div>
            <BarChart className="h-10 w-10 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Sales
          </h2>
          <Link href={`/${locale}/seller/sales`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {(recentSales ?? []).length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No sales yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              List your first vehicle to start selling
            </p>
            <Link href={`/${locale}/seller/vehicles/new`}>
              <Button>List a Vehicle</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(recentSales ?? []).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    {sale.vehicle.primary_image && (
                      <img
                        src={getImageUrl(sale.vehicle.primary_image)}
                        alt={`${sale.vehicle.make} ${sale.vehicle.model}`}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {sale.vehicle.make} {sale.vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sale.vehicle.year} • €{parseFloat(sale.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Buyer: {sale.buyer_name}
                    </p>
                  </div>
                </div>
                <Link href={`/${locale}/transaction/${sale.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`/${locale}/seller/vehicles`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Package className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              My Vehicles
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all your vehicle listings
            </p>
          </Card>
        </Link>

        <Link href={`/${locale}/seller/analytics`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <BarChart className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View detailed sales analytics
            </p>
          </Card>
        </Link>

        <Link href={`/${locale}/seller/bank-accounts`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <DollarSign className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Bank Accounts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage payout accounts
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
export default function SellerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['seller', 'dealer']}>
      <SellerDashboardContent />
    </ProtectedRoute>
  );
}