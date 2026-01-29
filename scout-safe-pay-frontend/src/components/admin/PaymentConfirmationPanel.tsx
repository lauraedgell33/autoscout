'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download,
  Eye,
  AlertCircle,
  CreditCard,
  FileText
} from 'lucide-react';

interface Transaction {
  id: string;
  transaction_code: string;
  payment_reference: string;
  amount: number;
  currency: string;
  buyer: {
    name: string;
    email: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  bank_account_iban: string;
  payment_deadline: string;
  contract_signed_at: string;
  status: string;
}

export default function PaymentConfirmationPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'awaiting' | 'overdue'>('awaiting');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, [filterStatus]);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/payments/pending?filter=${filterStatus}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (transactionId: string) => {
    if (!confirm('Are you sure you want to confirm this payment?')) return;

    setConfirmingId(transactionId);
    try {
      const response = await fetch(`/api/orders/${transactionId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Payment confirmed successfully! Invoice will be generated automatically.');
        fetchPendingPayments(); // Refresh list
        setSelectedTransaction(null);
      } else {
        const error = await response.json();
        alert(`Failed to confirm payment: ${error.message}`);
      }
    } catch (error) {
      alert('Failed to confirm payment');
      console.error(error);
    } finally {
      setConfirmingId(null);
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.transaction_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.buyer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const daysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} />
          <h1 className="text-2xl font-bold">Payment Confirmation Panel</h1>
        </div>
        <p className="text-orange-100">
          Review and confirm pending bank transfer payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Awaiting Confirmation</p>
              <p className="text-2xl font-bold text-orange-600">
                {transactions.filter(tx => tx.status === 'awaiting_bank_transfer').length}
              </p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {transactions.filter(tx => isOverdue(tx.payment_deadline)).length}
              </p>
            </div>
            <AlertCircle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} EUR
              </p>
            </div>
            <CreditCard className="text-gray-500" size={32} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by transaction code, reference, buyer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('awaiting')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'awaiting'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Awaiting
            </button>
            <button
              onClick={() => setFilterStatus('overdue')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'overdue'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No pending payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((tx) => {
                  const overdue = isOverdue(tx.payment_deadline);
                  const days = daysRemaining(tx.payment_deadline);

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.transaction_code}</p>
                          <p className="text-xs text-gray-500 font-mono">{tx.payment_reference}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.buyer.name}</p>
                          <p className="text-xs text-gray-500">{tx.buyer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {tx.vehicle.make} {tx.vehicle.model}
                        </p>
                        <p className="text-xs text-gray-500">{tx.vehicle.year}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {overdue ? (
                            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                              Overdue
                            </span>
                          ) : days <= 2 ? (
                            <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                              {days} days left
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                              {days} days left
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(tx.payment_deadline).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTransaction(tx)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => confirmPayment(tx.id)}
                            disabled={confirmingId === tx.id}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle size={16} />
                            {confirmingId === tx.id ? 'Confirming...' : 'Confirm'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Transaction Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Transaction Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transaction Code</p>
                    <p className="font-semibold">{selectedTransaction.transaction_code}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Reference</p>
                    <p className="font-mono font-semibold">{selectedTransaction.payment_reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold text-lg">
                      {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold">{selectedTransaction.status}</p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bank Transfer Details</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">IBAN</p>
                  <p className="font-mono font-semibold">{selectedTransaction.bank_account_iban}</p>
                </div>
              </div>

              {/* Buyer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Buyer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold">{selectedTransaction.buyer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{selectedTransaction.buyer.email}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Vehicle</h3>
                <p className="font-semibold">
                  {selectedTransaction.vehicle.make} {selectedTransaction.vehicle.model} ({selectedTransaction.vehicle.year})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => confirmPayment(selectedTransaction.id)}
                  disabled={confirmingId === selectedTransaction.id}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 font-semibold"
                >
                  {confirmingId === selectedTransaction.id ? 'Confirming...' : 'Confirm Payment Received'}
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
