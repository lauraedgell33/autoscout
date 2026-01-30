'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface CookieConsent {
  necessary: boolean;
  marketing: boolean;
  analytics: boolean;
  preferences: boolean;
}

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>({
    necessary: true,
    marketing: false,
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const consent = JSON.parse(savedConsent);
      setPreferences(consent);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookieConsent = {
      necessary: true,
      marketing: true,
      analytics: true,
      preferences: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const rejected: CookieConsent = {
      necessary: true,
      marketing: false,
      analytics: false,
      preferences: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(rejected));
    setPreferences(rejected);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use cookies to enhance your experience. Please choose your preferences.
                  </p>
                </div>

                <button
                  onClick={() => setShowBanner(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-2"
                  aria-label="Close cookie banner"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
                >
                  Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-as24-blue hover:bg-as24-blue/90 rounded-lg transition"
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cookie Preferences
              </h2>

              <div className="space-y-3 mb-6">
                {[
                  {
                    id: 'necessary',
                    label: 'Necessary Cookies',
                    description: 'Required for website functionality',
                  },
                  {
                    id: 'analytics',
                    label: 'Analytics Cookies',
                    description: 'Help us understand how you use our site',
                  },
                  {
                    id: 'preferences',
                    label: 'Preference Cookies',
                    description: 'Remember your preferences',
                  },
                  {
                    id: 'marketing',
                    label: 'Marketing Cookies',
                    description: 'Used for targeted advertising',
                  },
                ].map((cookie) => (
                  <label
                    key={cookie.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={preferences[cookie.id as keyof CookieConsent]}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            [cookie.id]: e.target.checked,
                          }))
                        }
                        disabled={cookie.id === 'necessary'}
                        className="w-4 h-4 rounded border-gray-300 text-as24-blue focus:ring-as24-blue"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-as24-blue transition">
                        {cookie.label}
                      </p>
                      <p className="text-sm text-gray-500">{cookie.description}</p>
                    </div>
                    {cookie.id === 'necessary' && (
                      <Check size={18} className="text-as24-blue flex-shrink-0 mt-1" />
                    )}
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-as24-blue hover:bg-as24-blue/90 rounded-lg transition"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CookieConsentBanner;
