'use client';

export default function SellerAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">€12,450</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vehicles Sold</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Listings</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">5</p>
        </div>
      </div>
    </div>
  );
}
