'use client';

import React from 'react';

export default function PaymentConfirmationPanel() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-4">Payment Confirmation</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-mono text-sm">TRX-2024-001</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-bold">€0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Confirmed</span>
        </div>
      </div>
    </div>
  );
}
