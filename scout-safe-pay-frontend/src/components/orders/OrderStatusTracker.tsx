'use client';

import React from 'react';

interface OrderStatusTrackerProps {
  currentStatus?: string;
  createdAt?: string;
  contractGeneratedAt?: string;
  contractSignedAt?: string;
  paymentConfirmedAt?: string;
  readyForDeliveryAt?: string;
  deliveredAt?: string;
}

interface OrderStatus {
  step: string;
  status: 'completed' | 'active' | 'pending';
}

export default function OrderStatusTracker({
  currentStatus = 'pending',
  createdAt,
  contractGeneratedAt,
  contractSignedAt,
  paymentConfirmedAt,
  readyForDeliveryAt,
  deliveredAt,
}: OrderStatusTrackerProps) {
  const steps: OrderStatus[] = [
    { step: 'Order Placed', status: 'completed' },
    { step: 'Payment Confirmed', status: currentStatus === 'payment_confirmed' ? 'completed' : 'active' },
    { step: 'Contract Signed', status: contractSignedAt ? 'completed' : 'pending' },
    { step: 'Delivery', status: deliveredAt ? 'completed' : 'pending' },
  ];

  return (
    <div className="py-8">
      <div className="flex justify-between">
        {steps.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                item.status === 'completed'
                  ? 'bg-green-600'
                  : item.status === 'active'
                  ? 'bg-primary-600'
                  : 'bg-gray-300'
              }`}
            >
              {item.status === 'completed' ? '✓' : idx + 1}
            </div>
            <p className="mt-2 text-sm text-gray-700">{item.step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
