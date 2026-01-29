'use client'

import { useState, useEffect } from 'react'
import { cookieService } from '@/lib/api'
import type { CookiePreferences } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings, X } from 'lucide-react'

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    checkCookieConsent()
  }, [])

  const checkCookieConsent = async () => {
    try {
      const consent = await cookieService.getPreferences()
      if (!consent) {
        // No consent given yet, show banner
        setShow(true)
      }
    } catch (error) {
      // Error fetching consent, show banner
      setShow(true)
    }
  }

  const handleAcceptAll = async () => {
    try {
      await cookieService.acceptAll()
      setShow(false)
    } catch (error) {
      console.error('Failed to save cookie preferences')
    }
  }

  const handleAcceptEssential = async () => {
    try {
      await cookieService.acceptEssential()
      setShow(false)
    } catch (error) {
      console.error('Failed to save cookie preferences')
    }
  }

  const handleSavePreferences = async () => {
    try {
      await cookieService.updatePreferences(preferences)
      setShow(false)
      setShowSettings(false)
    } catch (error) {
      console.error('Failed to save cookie preferences')
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
              {showSettings ? (
                <CookieSettings
                  preferences={preferences}
                  onPreferencesChange={setPreferences}
                  onSave={handleSavePreferences}
                  onBack={() => setShowSettings(false)}
                />
              ) : (
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Cookie className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        We value your privacy
                      </h3>
                      <p className="text-gray-600 mb-4">
                        We use cookies to enhance your browsing experience, serve personalized
                        content, and analyze our traffic. By clicking "Accept All", you consent
                        to our use of cookies.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAcceptAll}
                          className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          Accept All
                        </button>
                        <button
                          onClick={handleAcceptEssential}
                          className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                        >
                          Essential Only
                        </button>
                        <button
                          onClick={() => setShowSettings(true)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                          <Settings size={18} />
                          Customize
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Read our{' '}
                        <a href="/cookies" className="text-blue-600 hover:underline">
                          Cookie Policy
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                    <button
                      onClick={() => setShow(false)}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CookieSettingsProps {
  preferences: CookiePreferences
  onPreferencesChange: (preferences: CookiePreferences) => void
  onSave: () => void
  onBack: () => void
}

function CookieSettings({ preferences, onPreferencesChange, onSave, onBack }: CookieSettingsProps) {
  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Essential cookies cannot be disabled
    onPreferencesChange({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements relevant to you.',
      required: false,
    },
    {
      key: 'preferences' as const,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for a better experience.',
      required: false,
    },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Cookie Preferences</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Choose which cookies you want to allow. You can change these settings at any time.
      </p>

      <div className="space-y-4 mb-6">
        {cookieTypes.map((type) => (
          <div
            key={type.key}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{type.title}</h4>
                {type.required && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences[type.key]}
                onChange={() => togglePreference(type.key)}
                disabled={type.required}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                type.required ? 'bg-blue-400' : 'bg-gray-200'
              } peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}
