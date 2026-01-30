'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Search, Filter, Download, Eye, Package } from 'lucide-react';
import { transactionService, Transaction } from '@/lib/api/transactions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeEvent } from '@/lib/realtime-client';
import { Input } from '@/components/ui/input';

export default function BuyerTransactionsPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = { page: currentPage, per_page: 10 };
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await transactionService.list(filters);
      setTransactions((response.data ?? response) || []);
      setTotalPages(response.meta?.last_page ?? 1);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Set empty array on error to prevent crashes
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useRealtimeEvent('transaction.updated', () => {
    fetchTransactions();
  });

  useRealtimeEvent('transaction.status_changed', () => {
    fetchTransactions();
  });

  const filteredTransactions = (transactions ?? []).filter(transaction =>
    searchQuery === '' ||
    transaction.vehicle?.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.vehicle?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && transactions.length === 0) {
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
            My Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your purchase history
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by vehicle or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="payment_received">Payment Received</option>
            <option value="inspection_scheduled">Inspection Scheduled</option>
            <option value="inspection_completed">Inspection Completed</option>
            <option value="funds_released">Completed</option>
            <option value="dispute">Dispute</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start shopping to see your transactions here'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href={`/${params.locale}/marketplace`}>
                <Button>Browse Marketplace</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {(filteredTransactions || []).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{transaction.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-200 dark:bg-gray-700 rounded">
                          {transaction.vehicle?.main_image ? (
                            <img
                              src={transaction.vehicle.main_image}
                              alt={`${transaction.vehicle.make} ${transaction.vehicle.model}`}
                              className="h-full w-full object-cover rounded"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.vehicle?.make} {transaction.vehicle?.model}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.vehicle?.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        €{parseFloat(transaction.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/${params.locale}/transaction/${transaction.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
