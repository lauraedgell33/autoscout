'use client';

export default function HelpCenterPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• How to buy a vehicle</li>
            <li>• How to sell a vehicle</li>
            <li>• Payment methods</li>
            <li>• Account setup</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• How does escrow work?</li>
            <li>• Refund policy</li>
            <li>• Security & safety</li>
            <li>• Contact support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
