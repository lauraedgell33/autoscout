'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocale } from 'next-intl';

// All European currencies + USD
export type Currency = 
  | 'EUR'  // Euro (Eurozone)
  | 'GBP'  // British Pound (UK)
  | 'CHF'  // Swiss Franc (Switzerland, Liechtenstein)
  | 'PLN'  // Polish Złoty (Poland)
  | 'RON'  // Romanian Leu (Romania)
  | 'CZK'  // Czech Koruna (Czech Republic)
  | 'HUF'  // Hungarian Forint (Hungary)
  | 'SEK'  // Swedish Krona (Sweden)
  | 'NOK'  // Norwegian Krone (Norway)
  | 'DKK'  // Danish Krone (Denmark)
  | 'BGN'  // Bulgarian Lev (Bulgaria)
  | 'HRK'  // Croatian Kuna (historical, now EUR)
  | 'ISK'  // Icelandic Króna (Iceland)
  | 'RSD'  // Serbian Dinar (Serbia)
  | 'UAH'  // Ukrainian Hryvnia (Ukraine)
  | 'MDL'  // Moldovan Leu (Moldova)
  | 'ALL'  // Albanian Lek (Albania)
  | 'MKD'  // Macedonian Denar (North Macedonia)
  | 'BAM'  // Bosnia-Herzegovina Convertible Mark
  | 'GEL'  // Georgian Lari (Georgia)
  | 'AMD'  // Armenian Dram (Armenia)
  | 'AZN'  // Azerbaijani Manat (Azerbaijan)
  | 'BYN'  // Belarusian Ruble (Belarus)
  | 'TRY'  // Turkish Lira (Turkey)
  | 'RUB'  // Russian Ruble (Russia)
  | 'USD'; // US Dollar (international)

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  country: string;
  rate: number; // Exchange rate to EUR
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  currencies: CurrencyInfo[];
  getCurrencyInfo: (code: Currency) => CurrencyInfo | undefined;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Comprehensive list of European currencies with exchange rates (approximate, base: EUR)
export const CURRENCIES: CurrencyInfo[] = [
  // Eurozone
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'Eurozone', rate: 1 },
  
  // Western Europe
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom', rate: 0.86 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland', rate: 0.94 },
  
  // Scandinavia
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', rate: 11.42 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', rate: 11.53 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', rate: 7.46 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', country: 'Iceland', rate: 149.50 },
  
  // Central Europe
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', country: 'Poland', rate: 4.32 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'Czech Republic', rate: 25.32 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary', rate: 395.50 },
  
  // Eastern Europe
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania', rate: 4.97 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'Bulgaria', rate: 1.96 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'Ukraine', rate: 40.85 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', country: 'Moldova', rate: 19.25 },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', country: 'Belarus', rate: 3.48 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'Russia', rate: 98.50 },
  
  // Balkans
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин', country: 'Serbia', rate: 117.20 },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', country: 'Albania', rate: 103.50 },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', country: 'North Macedonia', rate: 61.50 },
  { code: 'BAM', name: 'Convertible Mark', symbol: 'KM', country: 'Bosnia and Herzegovina', rate: 1.96 },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'Croatia (historical)', rate: 7.53 },
  
  // Caucasus
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', country: 'Georgia', rate: 2.92 },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', country: 'Armenia', rate: 427.50 },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', country: 'Azerbaijan', rate: 1.85 },
  
  // Turkey
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey', rate: 32.50 },
  
  // International
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', rate: 1.09 },
];

// Map locales to default currencies
const localeToCurrency: Record<string, Currency> = {
  en: 'GBP',
  de: 'EUR',
  es: 'EUR',
  it: 'EUR',
  ro: 'RON',
  fr: 'EUR',
  nl: 'EUR',
};

// Currency symbols map for quick access
const currencySymbols: Record<Currency, string> = CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr.symbol;
  return acc;
}, {} as Record<Currency, string>);

// Exchange rates map for quick access
const exchangeRates: Record<Currency, number> = CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr.rate;
  return acc;
}, {} as Record<Currency, number>);

// Locale format for specific currencies
const currencyLocales: Partial<Record<Currency, string>> = {
  RON: 'ro-RO',
  PLN: 'pl-PL',
  CZK: 'cs-CZ',
  HUF: 'hu-HU',
  SEK: 'sv-SE',
  NOK: 'nb-NO',
  DKK: 'da-DK',
  BGN: 'bg-BG',
  RSD: 'sr-RS',
  UAH: 'uk-UA',
  TRY: 'tr-TR',
  RUB: 'ru-RU',
  CHF: 'de-CH',
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

  const getCurrencyInfo = (code: Currency): CurrencyInfo | undefined => {
    return CURRENCIES.find(c => c.code === code);
  };

  const formatPrice = (priceInEUR: number): string => {
    const convertedPrice = priceInEUR * exchangeRates[currency];
    const symbol = currencySymbols[currency];
    const localeFormat = currencyLocales[currency] || 'en-US';
    
    // Currencies that put symbol after the number
    const symbolAfter = ['RON', 'PLN', 'CZK', 'HUF', 'SEK', 'NOK', 'DKK', 'BGN', 'RSD', 'UAH', 'TRY', 'RUB', 'CHF', 'ISK', 'ALL', 'MKD', 'BAM', 'HRK', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL'];
    
    const formattedNumber = convertedPrice.toLocaleString(localeFormat, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
    
    if (symbolAfter.includes(currency)) {
      return `${formattedNumber} ${symbol}`;
    }
    
    return `${symbol}${formattedNumber}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: CURRENCIES, getCurrencyInfo }}>
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
