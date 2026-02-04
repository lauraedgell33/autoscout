'use client';

/**
 * Payment History Component
 * Displays all user transactions with status and actions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  ChevronDown,
  Filter,
  Search,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useNotification } from '@/components/providers/NotificationProvider';

// Utility functions (replacing Stripe)
const formatAmount = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    succeeded: 'text-green-600',
    processing: 'text-primary-600',
    failed: 'text-red-600',
    refunded: 'text-yellow-600',
    bank_transfer_pending: 'text-orange-600',
  };
  return colors[status] || 'text-gray-600';
};

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'failed' | 'refunded';
  description: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  buyerName?: string;
  sellerName?: string;
}

interface PaymentHistoryProps {
  userId?: string;
  limit?: number;
  onPaymentClick?: (payment: Payment) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  userId,
  limit = 20,
  onPaymentClick,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { success, error: showError } = useNotification();

  // Fetch payment history
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = userId
        ? `/api/payments/history?userId=${userId}&limit=${limit}`
        : `/api/payments/history?limit=${limit}`;

      const response = await apiClient.get(endpoint);
      setPayments((response as { data?: { payments?: Payment[] } }).data?.payments || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load payments';
      setError(message);
      showError(message, { title: 'Error Loading Payments' });
    } finally {
      setLoading(false);
    }
  }, [userId, limit, showError]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = payments ?? [];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.buyerName?.toLowerCase().includes(query) ||
          p.sellerName?.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, filterStatus]);

  // Download receipt
  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const response = await apiClient.get(`/api/payments/${paymentId}/receipt`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([(response as any).data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('Receipt downloaded successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download receipt';
      showError(message, { title: 'Download Error' });
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      succeeded: { bg: 'bg-green-100', text: 'text-green-800' },
      processing: { bg: 'bg-blue-100', text: 'text-primary-700' },
      failed: { bg: 'bg-red-100', text: 'text-red-800' },
      refunded: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };

    const color = colors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
      >
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <p className="font-semibold text-red-900">Error Loading Payments</p>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <p className="text-gray-600 mt-1">
          {filteredPayments.length} of {payments.length} transactions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col sm:flex-row">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-lg"
          >
            <p className="text-gray-600 font-medium">No payments found</p>
            <p className="text-sm text-gray-500 mt-1">
              {payments.length === 0
                ? 'You have no payment history yet.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </motion.div>
        ) : (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {/* Main Row */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === payment.id ? null : payment.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-semibold text-gray-900">
                      {payment.description}
                    </p>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <p>ID: {payment.transactionId}</p>
                    <p>
                      {new Date(payment.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    {formatAmount(payment.amount, payment.currency)}
                  </p>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${
                      expandedId === payment.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedId === payment.id ? 'auto' : 0,
                  opacity: expandedId === payment.id ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-gray-200"
              >
                <div className="p-4 bg-gray-50 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Payment Method</p>
                    <p className="text-gray-900 mt-1">
                      {payment.paymentMethod || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Currency</p>
                    <p className="text-gray-900 mt-1">{payment.currency}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Buyer</p>
                    <p className="text-gray-900 mt-1">
                      {payment.buyerName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Seller</p>
                    <p className="text-gray-900 mt-1">
                      {payment.sellerName || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">Updated</p>
                    <p className="text-gray-900 mt-1">
                      {new Date(payment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3 border-t border-gray-200">
                  <button
                    onClick={() => handleDownloadReceipt(payment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                  {onPaymentClick && (
                    <button
                      onClick={() => onPaymentClick(payment)}
                      className="flex-1 px-4 py-2 border border-blue-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
