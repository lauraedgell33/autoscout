'use client';

import { useTranslations } from 'next-intl';

export default function InventoryManagement() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Inventory Management</h1>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Manage your vehicle inventory</p>
            <a href="/dealer/bulk-upload" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Bulk Upload
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No inventory yet</p>
            <a href="/dealer/bulk-upload" className="text-blue-600 hover:text-blue-700 font-semibold">
              Start by uploading vehicles →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
