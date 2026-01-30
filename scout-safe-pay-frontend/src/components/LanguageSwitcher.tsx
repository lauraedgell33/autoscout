'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

type Locale = 'en' | 'de' | 'ro' | 'es' | 'it' | 'fr' | 'nl';

interface LocaleOption {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

const locales: LocaleOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  function onSelectChange(nextLocale: Locale) {
    startTransition(() => {
      router.push(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  }

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Change language. Current: ${currentLocale?.nativeName}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isPending ? (
          <div className="animate-spin" aria-hidden="true">
            <Globe size={20} />
          </div>
        ) : (
          <>
            <span className="text-xl" role="img" aria-label={`${currentLocale?.name} flag`}>
              {currentLocale?.flag}
            </span>
            <span className="font-medium hidden sm:inline">{currentLocale?.code.toUpperCase()}</span>
            <svg
              className={`w-4 h-4 transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-[var(--z-dropdown)] md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown menu */}
          <div 
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[calc(var(--z-dropdown)+1)] overflow-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <div className="py-1 max-h-[400px] overflow-y-auto">
              {locales.map((option) => (
                <button
                  key={option.code}
                  onClick={() => onSelectChange(option.code)}
                  disabled={isPending}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[52px] focus:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-700 disabled:opacity-50 ${
                    locale === option.code ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                  role="menuitem"
                  aria-current={locale === option.code ? 'true' : undefined}
                >
                  <span className="text-2xl flex-shrink-0" role="img" aria-label={`${option.name} flag`}>
                    {option.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {option.nativeName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {option.name}
                    </div>
                  </div>
                  {locale === option.code && (
                    <Check 
                      size={20} 
                      className="text-[var(--color-primary)] flex-shrink-0" 
                      aria-label="Selected"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div 
          className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-lg"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Changing language...</span>
        </div>
      )}
    </div>
  );
}
