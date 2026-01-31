'use client';

import { useState } from 'react';

export default function BuyerSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });

  const handleSave = async () => {
    // Save settings logic
    alert('Settings saved!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Enable Notifications</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Email Alerts</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
