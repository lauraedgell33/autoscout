'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';

type Currency = 'EUR' | 'USD' | 'GBP' | 'RON';

interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: CurrencyOption[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'RON', flag: '🇷🇴' },
];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find((c) => c.code === currency);

  function onSelectChange(newCurrency: Currency) {
    setCurrency(newCurrency);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg">{currentCurrency?.flag}</span>
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
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {currencies.map((option) => (
              <button
                key={option.code}
                onClick={() => onSelectChange(option.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currency === option.code ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <span className="text-2xl">{option.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{option.code}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{option.symbol}</div>
                </div>
                {currency === option.code && (
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
