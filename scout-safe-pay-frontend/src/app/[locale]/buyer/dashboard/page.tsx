'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Package, CreditCard, Heart, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { transactionService, Transaction } from '@/lib/api/transactions';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface DashboardStats {
  total_purchases: number;
  pending_transactions: number;
  completed_transactions: number;
  favorites_count: number;
  total_spent: string;
}

export default function BuyerDashboardPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_purchases: 0,
    pending_transactions: 0,
    completed_transactions: 0,
    favorites_count: 0,
    total_spent: '0'
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch transactions using the centralized API client
      const transactionsResponse = await transactionService.list({ per_page: 5 });
      setRecentTransactions(transactionsResponse.data);

      // Calculate stats
      const pending = (transactionsResponse.data || []).filter(t => 
        ['pending_payment', 'payment_received', 'inspection_scheduled'].includes(t.status)
      ).length;
      
      const completed = (transactionsResponse.data || []).filter(t => 
        ['funds_released'].includes(t.status)
      ).length;

      const total = parseFloat((transactionsResponse.data || []).reduce((sum, t) => 
        sum + parseFloat(t.amount), 0
      ).toFixed(2));

      setStats({
        total_purchases: (transactionsResponse.data || []).length,
        pending_transactions: pending,
        completed_transactions: completed,
        favorites_count: 0, // Will be fetched from favorites API
        total_spent: total.toString()
      });
      
      toast.success('Dashboard loaded successfully!');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      payment_received: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      inspection_scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      inspection_completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      funds_released: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      dispute: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            {user?.name ? `Welcome back, ${user.name}!` : 'Buyer Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your purchase activity overview
          </p>
        </div>
        <Link href={`/${params.locale}/marketplace`}>
          <Button>Browse Vehicles</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total_purchases}
              </p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.pending_transactions}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.completed_transactions}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                €{parseFloat(stats.total_spent).toLocaleString()}
              </p>
            </div>
            <CreditCard className="h-10 w-10 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <Link href={`/${params.locale}/buyer/transactions`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {(recentTransactions ?? []).length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start browsing vehicles to make your first purchase
            </p>
            <Link href={`/${params.locale}/marketplace`}>
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(recentTransactions || []).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {transaction.vehicle?.main_image ? (
                      <img
                        src={transaction.vehicle.main_image}
                        alt={`${transaction.vehicle.make} ${transaction.vehicle.model}`}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {transaction.vehicle?.make} {transaction.vehicle?.model}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.vehicle?.year} • €{parseFloat(transaction.amount).toLocaleString()}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <Link href={`/${params.locale}/transaction/${transaction.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`/${params.locale}/buyer/favorites`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Heart className="h-8 w-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              My Favorites
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage your saved vehicles
            </p>
          </Card>
        </Link>

        <Link href={`/${params.locale}/buyer/payment-methods`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CreditCard className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Payment Methods
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your payment options
            </p>
          </Card>
        </Link>

        <Link href={`/${params.locale}/disputes`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <AlertCircle className="h-8 w-8 text-yellow-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Disputes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage any transaction disputes
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
