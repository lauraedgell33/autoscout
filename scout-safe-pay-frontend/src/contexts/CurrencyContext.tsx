'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocale } from 'next-intl';

type Currency = 'EUR' | 'USD' | 'GBP' | 'RON';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Map locales to default currencies
const localeToCurrency: Record<string, Currency> = {
  en: 'GBP',
  de: 'EUR',
  es: 'EUR',
  it: 'EUR',
  ro: 'RON',
  fr: 'EUR',
};

// Currency symbols
const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  RON: 'RON',
};

// Exchange rates (base: EUR)
const exchangeRates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  RON: 4.97,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  // Auto-change currency when locale changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const defaultCurrency = localeToCurrency[locale] || 'EUR';
      setCurrencyState(defaultCurrency);
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  const formatPrice = (priceInEUR: number): string => {
    const convertedPrice = priceInEUR * exchangeRates[currency];
    const symbol = currencySymbols[currency];
    
    if (currency === 'RON') {
      return `${convertedPrice.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${symbol}`;
    }
    
    return `${symbol}${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
