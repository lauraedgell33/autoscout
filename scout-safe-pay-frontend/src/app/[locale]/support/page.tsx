'use client';

import { useTranslations } from 'next-intl';

export default function SupportTickets() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Support Tickets</h1>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Track and manage your support requests</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Create New Ticket
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No support tickets yet</p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              Create your first ticket →
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Select category</option>
                  <option>Billing</option>
                  <option>Technical Issue</option>
                  <option>Dispute</option>
                  <option>General Inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  rows={6}
                  placeholder="Provide detailed information about your issue"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
