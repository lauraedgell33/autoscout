'use client';

/**
 * Bank Transfer Verification Component
 * Shows transaction status and verification details
 * Displays seller confirmation status
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  FileText,
  User,
} from 'lucide-react';

interface BankTransferVerificationProps {
  transactionId: string;
  status?: 'pending' | 'awaiting_confirmation' | 'confirmed' | 'failed' | 'cancelled';
  amount?: number;
  currency?: string;
  sellerName?: string;
  uploadedAt?: string;
  confirmedAt?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

type TransactionStatus = 'pending' | 'awaiting_confirmation' | 'confirmed' | 'failed' | 'cancelled';

interface StatusInfo {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
}

export function BankTransferVerification({
  transactionId,
  status = 'pending',
  amount,
  currency = 'EUR',
  sellerName = 'Seller',
  uploadedAt,
  confirmedAt,
  loading = false,
  onRefresh,
}: BankTransferVerificationProps) {
  const [refreshing, setRefreshing] = useState(false);

  const statusInfo: Record<TransactionStatus, StatusInfo> = {
    pending: {
      label: 'Payment Pending',
      description: 'Waiting for payment transfer to be initiated',
      icon: <Clock size={24} />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
    },
    awaiting_confirmation: {
      label: 'Awaiting Seller Confirmation',
      description: 'Payment proof received. Waiting for seller to confirm receipt.',
      icon: <AlertCircle size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    },
    confirmed: {
      label: 'Payment Confirmed',
      description: 'Seller has confirmed receipt of payment. Transaction complete.',
      icon: <CheckCircle size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    failed: {
      label: 'Payment Failed',
      description: 'Payment could not be processed. Please try again.',
      icon: <XCircle size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
    },
    cancelled: {
      label: 'Transaction Cancelled',
      description: 'This transaction has been cancelled.',
      icon: <XCircle size={24} />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
    },
  };

  const currentStatus = statusInfo[status];

  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formattedAmount = amount
    ? new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency,
      }).format(amount / 100)
    : 'N/A';

  // Timeline steps
  const timeline = [
    {
      step: 1,
      label: 'Transfer Initiated',
      completed: true,
    },
    {
      step: 2,
      label: 'Proof Uploaded',
      completed: ['awaiting_confirmation', 'confirmed'].includes(status),
      timestamp: uploadedAt,
    },
    {
      step: 3,
      label: 'Seller Confirms',
      completed: status === 'confirmed',
      timestamp: confirmedAt,
    },
    {
      step: 4,
      label: 'Funds Released',
      completed: status === 'confirmed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-6 border border-gray-200 ${currentStatus.bgColor}`}
      >
        <div className="flex items-start gap-4">
          <div className={currentStatus.color}>
            {loading ? (
              <Loader size={32} className="animate-spin" />
            ) : (
              currentStatus.icon
            )}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${currentStatus.textColor} mb-1`}>
              {currentStatus.label}
            </h2>
            <p className={currentStatus.textColor}>
              {currentStatus.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transaction Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Amount</p>
          <p className="text-xl font-bold text-gray-900">{formattedAmount}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Currency</p>
          <p className="text-xl font-bold text-gray-900">{currency}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Transaction ID</p>
          <p className="text-sm font-mono text-gray-900 break-all">
            {transactionId.substring(0, 8)}...
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Seller</p>
          <p className="text-sm font-medium text-gray-900">{sellerName}</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 border border-gray-200"
      >
        <h3 className="font-semibold text-gray-900 mb-6">Transaction Progress</h3>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.step} className="flex gap-4">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    item.completed
                      ? 'bg-green-600 text-white'
                      : index === timeline.findIndex(t => !t.completed)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle size={20} />
                  ) : (
                    item.step
                  )}
                </motion.div>

                {/* Connector Line */}
                {index < timeline.length - 1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: 48,
                      backgroundColor: item.completed ? '#16a34a' : '#e5e7eb',
                    }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="w-1 mt-2"
                  />
                )}
              </div>

              {/* Step Info */}
              <div className="pt-2">
                <p
                  className={`font-semibold ${
                    item.completed
                      ? 'text-green-600'
                      : index === timeline.findIndex(t => !t.completed)
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </p>
                {item.timestamp && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Proof Document (if uploaded) */}
      {['awaiting_confirmation', 'confirmed'].includes(status) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-as24-blue" />
            <h3 className="font-semibold text-gray-900">Payment Proof</h3>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">proof-of-payment.pdf</p>
                <p className="text-sm text-gray-600">Uploaded on {uploadedAt}</p>
              </div>
            </div>
            <button className="text-as24-blue hover:text-as24-blue/80 font-medium text-sm">
              View
            </button>
          </div>
        </motion.div>
      )}

      {/* Seller Confirmation Message (if confirmed) */}
      {status === 'confirmed' && confirmedAt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-50 rounded-lg p-6 border border-green-200"
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Seller Confirmed</h3>
              <p className="text-sm text-green-800">
                The seller has confirmed receipt of your payment on{' '}
                {new Date(confirmedAt).toLocaleString()}. The transaction is now complete, and
                the funds have been released to the seller.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="w-full py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
      >
        {refreshing ? (
          <>
            <Loader size={18} className="animate-spin" />
            Refreshing...
          </>
        ) : (
          'Refresh Status'
        )}
      </button>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <details className="group cursor-pointer">
          <summary className="flex items-center gap-2 font-medium text-blue-900 hover:text-blue-800">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
            Need Help?
          </summary>
          <div className="mt-3 text-sm text-blue-800 space-y-2">
            <p>
              <strong>Awaiting Seller Confirmation?</strong> The seller has 48 hours to confirm
              receipt of your payment. If they don't confirm, the funds will be automatically
              returned.
            </p>
            <p>
              <strong>Payment Not Reflected?</strong> Bank transfers can take 1-3 business days
              depending on your bank and the seller's bank.
            </p>
            <p>
              <strong>Contact Support:</strong> If you need assistance, please reach out to our
              support team.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default BankTransferVerification;
