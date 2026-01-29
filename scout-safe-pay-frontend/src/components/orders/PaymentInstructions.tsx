'use client';

import React from 'react';

export default function PaymentInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-4">Payment Instructions</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Review your order details</li>
        <li>Proceed to payment</li>
        <li>Enter payment information</li>
        <li>Confirm transaction</li>
      </ol>
    </div>
  );
}
