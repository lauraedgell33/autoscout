'use client';

import { useTranslations } from 'next-intl';

export default function BulkUpload() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Bulk Vehicle Upload</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV File</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input type="file" accept=".csv" className="hidden" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded">
                Select CSV File
              </button>
              <p className="text-gray-600 mt-4">or drag and drop your file here</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">CSV Format Requirements</h3>
            <p className="text-gray-700 text-sm">
              Your CSV file should include columns: Make, Model, Year, Price, Description, Mileage, Body Type, Fuel Type
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded">
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
