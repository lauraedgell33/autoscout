'use client';

import { useTranslations } from 'next-intl';

export default function AddNewVehicle() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Add New Vehicle</h1>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Make</label>
                <input type="text" placeholder="e.g., BMW" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Model</label>
                <input type="text" placeholder="e.g., X5" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Year</label>
                <input type="number" placeholder="2024" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price</label>
                <input type="number" placeholder="50000" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                rows={5}
                placeholder="Describe your vehicle..."
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              List Vehicle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
