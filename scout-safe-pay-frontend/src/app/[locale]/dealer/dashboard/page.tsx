'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Package, TrendingUp, DollarSign, Users, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { DashboardStatsGridSkeleton } from '@/components/skeletons/DashboardSkeletons';
import ProtectedRoute from '@/components/ProtectedRoute';

function DealerDashboardContent() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [stats, setStats] = useState({
    total_inventory: 0,
    active_listings: 0,
    sold_this_month: 0,
    revenue_this_month: '0',
    team_members: 0,
    pending_sales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use apiClient instead of direct fetch
      const data = await apiClient.get('/dealer/stats') as typeof stats;
      setStats(data);
      toast.success('Dashboard loaded successfully!');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6 animate-pulse"></div>
        <DashboardStatsGridSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your inventory and team</p>
        </div>
        <Link href={`/${locale}/seller/vehicles/new`}>
          <Button><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Inventory</p>
              <p className="text-2xl font-bold mt-1">{stats.total_inventory}</p>
            </div>
            <Package className="h-10 w-10 text-primary-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sold This Month</p>
              <p className="text-2xl font-bold mt-1">{stats.sold_this_month}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue (Month)</p>
              <p className="text-2xl font-bold mt-1">€{parseFloat(stats.revenue_this_month).toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-2xl font-bold mt-1">{stats.team_members}</p>
            </div>
            <Users className="h-10 w-10 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`/${locale}/dealer/inventory`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Package className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold mb-2">Inventory Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your vehicle stock</p>
          </Card>
        </Link>
        <Link href={`/${locale}/dealer/analytics`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View detailed reports</p>
          </Card>
        </Link>
        <Link href={`/${locale}/dealer/team`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Team Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage team access</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default function DealerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <DealerDashboardContent />
    </ProtectedRoute>
  );
}
