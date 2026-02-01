'use client';

import { useCurrency, CURRENCIES, Currency } from '@/contexts/CurrencyContext';
import { useState, useMemo } from 'react';

// Currency flags mapping
const currencyFlags: Record<Currency, string> = {
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  CHF: '🇨🇭',
  SEK: '🇸🇪',
  NOK: '🇳🇴',
  DKK: '🇩🇰',
  ISK: '🇮🇸',
  PLN: '🇵🇱',
  CZK: '🇨🇿',
  HUF: '🇭🇺',
  RON: '🇷🇴',
  BGN: '🇧🇬',
  UAH: '🇺🇦',
  MDL: '🇲🇩',
  BYN: '🇧🇾',
  RUB: '🇷🇺',
  RSD: '🇷🇸',
  ALL: '🇦🇱',
  MKD: '🇲🇰',
  BAM: '🇧🇦',
  HRK: '🇭🇷',
  GEL: '🇬🇪',
  AMD: '🇦🇲',
  AZN: '🇦🇿',
  TRY: '🇹🇷',
  USD: '🇺🇸',
};

// Popular currencies shown first
const popularCurrencies: Currency[] = ['EUR', 'USD', 'GBP', 'CHF', 'RON', 'PLN', 'CZK', 'HUF'];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  // Sort currencies: popular first, then alphabetically
  const sortedCurrencies = useMemo(() => {
    const filtered = searchQuery
      ? CURRENCIES.filter(
          (c) =>
            c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.country.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : CURRENCIES;

    return [...filtered].sort((a, b) => {
      const aPopular = popularCurrencies.indexOf(a.code);
      const bPopular = popularCurrencies.indexOf(b.code);
      
      if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
      if (aPopular !== -1) return -1;
      if (bPopular !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery]);

  function onSelectChange(newCurrency: Currency) {
    setCurrency(newCurrency);
    setIsOpen(false);
    setSearchQuery('');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currencyFlags[currency]}</span>
        <span className="font-medium text-sm">{currentCurrency?.symbol}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              id="currency-search"
              name="currency-search"
              type="text"
              placeholder="Search currency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoComplete="off"
              aria-label="Search currency"
              autoFocus
            />
          </div>
          
          {/* Currency list */}
          <div className="max-h-64 overflow-y-auto py-1">
            {sortedCurrencies.length > 0 ? (
              sortedCurrencies.map((option, index) => (
                <div key={option.code}>
                  {/* Separator after popular currencies */}
                  {!searchQuery && index === popularCurrencies.length && (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  )}
                  <button
                    onClick={() => onSelectChange(option.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currency === option.code ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                    }`}
                  >
                    <span className="text-xl">{currencyFlags[option.code]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {option.code} - {option.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {option.name}
                      </div>
                    </div>
                    {currency === option.code && (
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}
