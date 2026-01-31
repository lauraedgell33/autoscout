'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Eye, 
  Mail,
  Lock,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react'

export default function SettingsPage() {
  const t = useTranslations()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    newMessages: true,
    priceDrops: true,
    transactions: true,
    systemUpdates: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  })

  // Language and region
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('EUR')

  const handleSaveSettings = async () => {
    setMessage('')
    setError('')
    
    try {
      // API call to save settings would go here
      setMessage('Settings saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setError('Failed to save settings')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      // API call to delete account
      alert('Account deletion request submitted. You will receive a confirmation email.')
    } catch (err) {
      setError('Failed to delete account')
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-accent-500" />
            Settings
          </h1>

          {message && (
            <Card className="bg-green-50 border-green-200 text-green-700 p-3 mb-5 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                {message}
              </div>
            </Card>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200 text-red-700 p-3 mb-5 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                {error}
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          <Card className="p-4 sm:p-5 mb-5 rounded-2xl border border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent-500" />
              Notification Preferences
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-xs text-gray-500">Receive text messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newMessages}
                      onChange={(e) => setNotifications({...notifications, newMessages: e.target.checked})}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-xs text-gray-700">New Messages</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.priceDrops}
                      onChange={(e) => setNotifications({...notifications, priceDrops: e.target.checked})}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-xs text-gray-700">Price Drops on Favorites</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.transactions}
                      onChange={(e) => setNotifications({...notifications, transactions: e.target.checked})}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-xs text-gray-700">Transaction Updates</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.systemUpdates}
                      onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-xs text-gray-700">System Updates</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketing}
                      onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-xs text-gray-700">Marketing & Promotions</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-4 sm:p-5 mb-5 rounded-2xl border border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent-500" />
              Privacy & Security
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Public Profile</p>
                  <p className="text-xs text-gray-500">Make your profile visible to others</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.profileVisible}
                    onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Show Email</p>
                  <p className="text-xs text-gray-500">Display email on public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Show Phone</p>
                  <p className="text-xs text-gray-500">Display phone on public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showPhone}
                    onChange={(e) => setPrivacy({...privacy, showPhone: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Allow Messages</p>
                  <p className="text-xs text-gray-500">Let other users contact you</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={(e) => setPrivacy({...privacy, allowMessages: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Language & Region */}
          <Card className="p-4 sm:p-5 mb-5 rounded-2xl border border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-500" />
              Language & Region
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CHF">CHF (Fr)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3 mb-5">
            <Button
              onClick={handleSaveSettings}
              className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-xl flex-1 sm:flex-initial"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="p-4 sm:p-5 border-red-200 bg-red-50 rounded-2xl">
            <h2 className="text-base sm:text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              Danger Zone
            </h2>
            
            <div className="p-4 bg-white rounded-xl border border-red-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Delete Account</h3>
              <p className="text-xs text-gray-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
