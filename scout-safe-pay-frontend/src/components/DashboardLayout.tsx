'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <aside className="w-64 bg-gray-50 p-6 rounded-lg">
        <nav className="space-y-2">
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
            Overview
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
            Transactions
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
