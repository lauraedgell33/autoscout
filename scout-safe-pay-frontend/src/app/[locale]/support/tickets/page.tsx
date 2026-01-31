'use client';

export default function SupportTicketsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No open tickets</p>
          <button className="px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600">
            Create New Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
