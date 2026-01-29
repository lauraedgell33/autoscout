'use client';

import { useTranslations } from 'next-intl';

export default function VehicleSearch() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Search Vehicles</h1>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Make</label>
                  <input type="text" placeholder="Select make" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Model</label>
                  <input type="text" placeholder="Select model" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Year From</label>
                  <input type="number" placeholder="2010" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price Range</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Any price</option>
                    <option>$0 - $10,000</option>
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000+</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
                  Search
                </button>
                <button type="reset" className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No vehicles found matching your criteria</p>
          </div>
        </div>
      </div>
    </div>
  );
}
