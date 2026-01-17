'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieResponse {
  success: boolean;
  data?: {
    preferences: CookiePreferences;
    accepted_at?: string;
    expires_at?: string;
  };
  message?: string;
}

export default function CookieBanner() {
  const t = useTranslations();
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

  // Fetch current cookie preferences on mount
  useEffect(() => {
    const initializeBanner = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/cookies/preferences`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data: CookieResponse = await response.json();
          if (data.success && data.data) {
            setPreferences(data.data.preferences);
            // Show banner only if not all non-essential cookies are accepted
            const hasAcceptedAllNonEssential =
              data.data.preferences.functional &&
              data.data.preferences.analytics &&
              data.data.preferences.marketing;
            
            if (!hasAcceptedAllNonEssential) {
              setShowBanner(true);
            }
          } else {
            // No preferences yet, show banner
            setShowBanner(true);
          }
        } else {
          // Server error, show banner
          setShowBanner(true);
        }
      } catch (error) {
        // Fallback to localStorage when backend is unavailable
        const stored = localStorage.getItem('cookie_preferences');
        if (stored) {
          try {
            const storedPrefs = JSON.parse(stored);
            setPreferences(storedPrefs);
            // Don't show banner if user already made a choice
            const hasAcceptedAllNonEssential =
              storedPrefs.functional &&
              storedPrefs.analytics &&
              storedPrefs.marketing;
            if (!hasAcceptedAllNonEssential) {
              setShowBanner(true);
            }
          } catch {
            setShowBanner(true);
          }
        } else {
          setShowBanner(true);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeBanner();
  }, [apiBaseUrl]);

  const updatePreferences = async (newPreferences: CookiePreferences) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/cookies/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          functional: newPreferences.functional,
          analytics: newPreferences.analytics,
          marketing: newPreferences.marketing,
        }),
      });

      if (response.ok) {
        setPreferences(newPreferences);
        setShowBanner(false);
      } else {
        console.error('Failed to update cookie preferences');
      }
    } catch (error) {
      // Fallback to localStorage when backend is unavailable
      setPreferences(newPreferences);
      localStorage.setItem('cookie_preferences', JSON.stringify(newPreferences));
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAll = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/cookies/accept-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: CookieResponse = await response.json();
        if (data.success && data.data) {
          setPreferences(data.data.preferences);
          setShowBanner(false);
        }
      }
    } catch (error) {
      // Fallback to localStorage when backend is unavailable
      const allAccepted = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      };
      setPreferences(allAccepted);
      localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted));
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptEssential = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/cookies/accept-essential`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: CookieResponse = await response.json();
        if (data.success && data.data) {
          setPreferences(data.data.preferences);
          setShowBanner(false);
        }
      }
    } catch (error) {
      // Fallback to localStorage when backend is unavailable
      const essentialOnly = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      };
      setPreferences(essentialOnly);
      localStorage.setItem('cookie_preferences', JSON.stringify(essentialOnly));
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof Omit<CookiePreferences, 'essential'>) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
  };

  const handleSavePreferences = () => {
    updatePreferences(preferences);
  };

  if (!isInitialized || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('cookies.title') || '🍪 Cookie Settings'}
            </h2>
            <p className="text-sm text-gray-600">
              {t('cookies.description') || 'We use cookies to enhance your experience and analyze our traffic.'}
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={20} />
          </button>
        </div>

        {/* Expandable Section */}
        <div className="mb-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>{t('cookies.customize') || 'Customize Settings'}</span>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
              {/* Essential (Always enabled) */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="essential"
                  checked={true}
                  disabled
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                />
                <label htmlFor="essential" className="ml-3 cursor-not-allowed">
                  <span className="block text-sm font-medium text-gray-900">
                    {t('cookies.essential_title') || 'Essential Cookies'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('cookies.essential_desc') || 'Required for website functionality'}
                  </span>
                </label>
              </div>

              {/* Functional */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="functional"
                  checked={preferences.functional}
                  onChange={() => handlePreferenceChange('functional')}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <label htmlFor="functional" className="ml-3 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    {t('cookies.functional_title') || 'Functional Cookies'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('cookies.functional_desc') || 'Remember your preferences and choices'}
                  </span>
                </label>
              </div>

              {/* Analytics */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={preferences.analytics}
                  onChange={() => handlePreferenceChange('analytics')}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <label htmlFor="analytics" className="ml-3 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    {t('cookies.analytics_title') || 'Analytics Cookies'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('cookies.analytics_desc') || 'Help us understand how you use our site'}
                  </span>
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={preferences.marketing}
                  onChange={() => handlePreferenceChange('marketing')}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <label htmlFor="marketing" className="ml-3 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    {t('cookies.marketing_title') || 'Marketing Cookies'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('cookies.marketing_desc') || 'Personalize ads based on your interests'}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          {isExpanded && (
            <button
              onClick={handleSavePreferences}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  {t('cookies.saving') || 'Saving...'}
                </span>
              ) : (
                t('common.save') || 'Save Preferences'
              )}
            </button>
          )}

          <button
            onClick={handleAcceptEssential}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('cookies.essential_only') || 'Essential Only'}
          </button>

          <button
            onClick={handleAcceptAll}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                {t('cookies.accepting') || 'Accepting...'}
              </span>
            ) : (
              t('cookies.accept_all') || 'Accept All'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
