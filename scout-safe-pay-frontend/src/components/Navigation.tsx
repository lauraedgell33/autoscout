'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe, DollarSign } from 'lucide-react';

export default function Navigation() {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
  ];

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    setShowLanguageDropdown(false);
    // Switch language - implementation depends on i18n setup
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    setShowCurrencyDropdown(false);
    // Store in localStorage
    localStorage.setItem('selectedCurrency', code);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">AutoScout24</div>
            <div className="text-xs text-blue-500 font-semibold">SafeTrade</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href="/vehicles" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t('vehicles') || 'Vehicles'}
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t('how_it_works') || 'How It Works'}
            </Link>
            <Link 
              href="/faq" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t('faq') || 'FAQ'}
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t('contact') || 'Contact'}
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Globe size={18} />
                <span className="text-sm font-medium">{selectedLanguage.toUpperCase()}</span>
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                        selectedLanguage === lang.code ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <DollarSign size={18} />
                <span className="text-sm font-medium">{selectedCurrency}</span>
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencyChange(curr.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                        selectedCurrency === curr.code ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-bold">{curr.symbol}</span>
                      <span>{curr.name} ({curr.code})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 border-l border-gray-300 pl-4 ml-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {t('login') || 'Login'}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                {t('register') || 'Sign Up'}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <div className="space-y-2 pt-4">
              <Link
                href="/vehicles"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('vehicles') || 'Vehicles'}
              </Link>
              <Link
                href="/how-it-works"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('how_it_works') || 'How It Works'}
              </Link>
              <Link
                href="/faq"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('faq') || 'FAQ'}
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('contact') || 'Contact'}
              </Link>

              {/* Mobile Language & Currency */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-600 mb-2">
                  {t('language') || 'Language'}
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 mb-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLanguage === lang.code
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="px-4 py-2 text-sm font-semibold text-gray-600 mb-2">
                  {t('currency') || 'Currency'}
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 mb-4">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencyChange(curr.code)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCurrency === curr.code
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {curr.symbol} {curr.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 mt-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  {t('login') || 'Login'}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  {t('register') || 'Sign Up'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
