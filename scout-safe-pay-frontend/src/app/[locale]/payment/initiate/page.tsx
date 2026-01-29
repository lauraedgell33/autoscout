'use client';

import { useTranslations } from 'next-intl';

export default function InitiatePayment() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Initiate Payment</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Vehicle</label>
              <input
                type="text"
                placeholder="Select vehicle"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Select payment method</option>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Digital Wallet</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Vehicle Price:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance:</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
