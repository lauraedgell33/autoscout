'use client';

import { useTranslations } from 'next-intl';

export default function BankAccounts() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Bank Accounts</h1>
          <p className="text-gray-600 mb-8">Manage your bank accounts for receiving payments</p>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No bank accounts added</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
              Add Bank Account
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Information</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
              <p className="text-gray-700">
                Your bank account information is encrypted and securely stored. We never share your details with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
