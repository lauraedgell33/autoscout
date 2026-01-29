'use client';

import { useTranslations } from 'next-intl';

export default function PaymentMethods() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Payment Methods</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <p className="text-gray-600 text-center">No payment methods added</p>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                Add Payment Method
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Payment Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Credit Card</h3>
                <p className="text-gray-600 text-sm">Visa, Mastercard, Amex</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Bank Transfer</h3>
                <p className="text-gray-600 text-sm">Direct bank payment</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Digital Wallet</h3>
                <p className="text-gray-600 text-sm">PayPal, Apple Pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
