'use client';

import { useState, useEffect } from 'react';

export default function BuyerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Initial data - using RAF to avoid synchronous setState warning
    const frame = requestAnimationFrame(() => {
      setNotifications([
        { id: 1, title: 'New vehicle available', message: 'A vehicle matching your criteria is now available', read: false },
        { id: 2, title: 'Purchase confirmed', message: 'Your purchase has been confirmed', read: true },
      ]);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border ${notif.read ? 'bg-white dark:bg-gray-800' : 'bg-primary-50 dark:bg-blue-900/20'}`}
          >
            <h3 className="font-medium text-gray-900 dark:text-white">{notif.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
