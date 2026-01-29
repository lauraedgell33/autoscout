'use client';

import { useTranslations } from 'next-intl';

export default function TransactionHistory() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600 mb-8">View all your purchase transactions</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
