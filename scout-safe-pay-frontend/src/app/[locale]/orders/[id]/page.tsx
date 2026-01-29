'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PaymentInstructions from '@/components/orders/PaymentInstructions';
import UploadSignedContract from '@/components/orders/UploadSignedContract';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Transaction {
  id: string;
  transaction_code: string;
  amount: number;
  currency: string;
  status: string;
  payment_reference: string;
  payment_deadline: string;
  bank_account_iban: string;
  bank_account_holder: string;
  bank_name: string;
  contract_url?: string;
  signed_contract_url?: string;
  created_at: string;
  contract_generated_at?: string;
  contract_signed_at?: string;
  payment_confirmed_at?: string;
  ready_for_delivery_at?: string;
  delivered_at?: string;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
  };
  buyer: {
    id: number;
    name: string;
    email: string;
  };
  dealer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchTransaction();
    }
  }, [orderId]);

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      const data = await response.json();
      setTransaction(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleContractUploaded = () => {
    // Refresh transaction to get updated status and payment instructions
    fetchTransaction();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600">{error || 'Unable to load order details'}</p>
        </div>
      </div>
    );
  }

  const showContractUpload = 
    transaction.status === 'contract_generated' && 
    transaction.contract_url && 
    !transaction.signed_contract_url;

  const showPaymentInstructions = 
    transaction.status === 'awaiting_bank_transfer' || 
    transaction.status === 'contract_signed';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order #{transaction.transaction_code}
          </h1>
          <p className="text-gray-600">
            {transaction.vehicle.make} {transaction.vehicle.model} ({transaction.vehicle.year})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tracker */}
            <OrderStatusTracker
              currentStatus={transaction.status}
              createdAt={transaction.created_at}
              contractGeneratedAt={transaction.contract_generated_at}
              contractSignedAt={transaction.contract_signed_at}
              paymentConfirmedAt={transaction.payment_confirmed_at}
              readyForDeliveryAt={transaction.ready_for_delivery_at}
              deliveredAt={transaction.delivered_at}
            />

            {/* Contract Upload */}
            {showContractUpload && (
              <UploadSignedContract
                transactionId={transaction.id}
                contractUrl={transaction.contract_url}
                onUploadSuccess={handleContractUploaded}
                onError={(error) => alert(error)}
              />
            )}

            {/* Payment Instructions */}
            {showPaymentInstructions && (
              <PaymentInstructions
                transaction={transaction}
                onPaymentProofUpload={() => fetchTransaction()}
              />
            )}

            {/* Completed State */}
            {['payment_verified', 'ready_for_delivery', 'delivered', 'completed'].includes(transaction.status) && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  {transaction.status === 'payment_verified' && 'Payment Confirmed!'}
                  {transaction.status === 'ready_for_delivery' && 'Vehicle Ready for Delivery!'}
                  {transaction.status === 'delivered' && 'Vehicle Delivered!'}
                  {transaction.status === 'completed' && 'Order Completed!'}
                </h2>
                <p className="text-green-800">
                  {transaction.status === 'payment_verified' && 
                    'Your payment has been confirmed. The dealer will prepare your vehicle for delivery.'}
                  {transaction.status === 'ready_for_delivery' && 
                    'Your vehicle is ready! The dealer will contact you to schedule delivery.'}
                  {transaction.status === 'delivered' && 
                    'Congratulations on your new vehicle! Please confirm receipt.'}
                  {transaction.status === 'completed' && 
                    'Thank you for your purchase! We hope you enjoy your new vehicle.'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {transaction.vehicle.make} {transaction.vehicle.model}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.vehicle.year}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(transaction.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {transaction.payment_deadline && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Payment Deadline</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(transaction.payment_deadline).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dealer Info */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dealer Information</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{transaction.dealer.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a 
                    href={`mailto:${transaction.dealer.email}`}
                    className="text-orange-600 hover:underline"
                  >
                    {transaction.dealer.email}
                  </a>
                </div>

                {transaction.dealer.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a 
                      href={`tel:${transaction.dealer.phone}`}
                      className="text-orange-600 hover:underline"
                    >
                      {transaction.dealer.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-semibold text-orange-900 mb-2">Need Help?</h3>
              <p className="text-sm text-orange-800 mb-3">
                Our support team is here to assist you
              </p>
              <a
                href="mailto:support@autoscout24-safetrade.com"
                className="block text-center bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
