'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Upload, Download, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { transactionService, Transaction } from '@/lib/api/transactions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeEvent } from '@/lib/realtime-client';

export default function TransactionDetailsPage() {
  const routeParams = useParams<{ locale: string; id: string }>();
  const locale = routeParams?.locale;
  const id = routeParams?.id;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const fetchTransaction = useCallback(async () => {
    if (!id) return;
    try {
      const data = await transactionService.get(id);
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  useRealtimeEvent('transaction.updated', (payload: any) => {
    const incomingId = payload?.id || payload?.transaction_id || payload?.transaction?.id;
    if (id && incomingId && String(incomingId) === String(id)) {
      fetchTransaction();
    }
  });

  useRealtimeEvent('transaction.status_changed', (payload: any) => {
    const incomingId = payload?.id || payload?.transaction_id || payload?.transaction?.id;
    if (id && incomingId && String(incomingId) === String(id)) {
      fetchTransaction();
    }
  });

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !transaction) return;
    setUploadingReceipt(true);
    
    try {
      await transactionService.uploadReceipt(transaction.id, e.target.files[0]);
      fetchTransaction();
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Failed to upload receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending_payment: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      payment_received: { label: 'Payment Received', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      inspection_scheduled: { label: 'Inspection Scheduled', color: 'bg-purple-100 text-purple-800', icon: Clock },
      inspection_completed: { label: 'Inspection Completed', color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle },
      funds_released: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      dispute: { label: 'In Dispute', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!transaction) {
    return <div className="max-w-4xl mx-auto p-6">
      <Card className="p-12 text-center">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Transaction not found</h3>
        <Link href={`/${locale}/buyer/transactions`}>
          <Button>Back to Transactions</Button>
        </Link>
      </Card>
    </div>;
  }

  const statusInfo = getStatusInfo(transaction.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/${locale}/buyer/transactions`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Transaction #{String(transaction.id).slice(0, 8)}</h1>
          <p className="text-gray-600 dark:text-gray-400">Created {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusInfo.color}`}>
          <StatusIcon className="h-4 w-4 mr-2" />
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Vehicle Details</h3>
            <div className="flex items-start space-x-4">
              <div className="h-24 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                {transaction.vehicle?.main_image && (
                  <img src={transaction.vehicle.main_image} alt="" className="h-full w-full object-cover rounded-lg" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {transaction.vehicle?.make} {transaction.vehicle?.model}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Year: {transaction.vehicle?.year}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  €{parseFloat(transaction.amount).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Transaction Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Transaction Created</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(transaction.created_at).toLocaleString()}</p>
                </div>
              </div>

              {transaction.status !== 'pending_payment' && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Funds secured in escrow</p>
                  </div>
                </div>
              )}

              {transaction.inspection_date && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Inspection Scheduled</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.inspection_date).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {transaction.status === 'funds_released' && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Transaction Completed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Funds released to seller</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          {transaction.status === 'pending_payment' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Upload Payment Receipt</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Upload your bank transfer receipt to speed up verification
              </p>
              <label className="block">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  disabled={uploadingReceipt}
                  className="hidden"
                />
                <Button disabled={uploadingReceipt} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingReceipt ? 'Uploading...' : 'Upload Receipt'}
                </Button>
              </label>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parties */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Parties</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Buyer</p>
                <p className="font-medium">{transaction.buyer?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.buyer?.email}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Seller</p>
                <p className="font-medium">{transaction.seller?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.seller?.email}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {transaction.payment_proof && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(String(transaction.payment_proof), '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />Download Receipt
                </Button>
              )}
              <Link href={`/${locale}/disputes/create?transaction=${transaction.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />Report Issue
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
