import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ToastProvider } from '@/components/providers/toast-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { SkipLink } from '@/components/common/SkipLink';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'AutoScout24 SafeTrade';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  return {
    title: {
      template: `%s | ${appName}`,
      default: appName,
    },
    description: t('description'),
    applicationName: appName,
    authors: [{ name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AutoScout24 GmbH' }],
    keywords: [
      'vehicle marketplace',
      'car buying',
      'escrow service',
      'secure payments',
      'AutoScout24',
      'safe trade',
      'vehicle listing',
      'buy car online',
      'sell car online',
    ],
    creator: process.env.NEXT_PUBLIC_COMPANY_NAME,
    publisher: process.env.NEXT_PUBLIC_COMPANY_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'de': '/de',
        'es': '/es',
        'it': '/it',
        'ro': '/ro',
        'fr': '/fr',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: appUrl,
      siteName: appName,
      title: appName,
      description: t('description'),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: appName,
      description: t('description'),
      images: ['/images/og-image.jpg'],
      creator: '@autoscout24',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <>
        <ErrorBoundary>
          <SkipLink />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CurrencyProvider>
              <AuthProvider>
                <ToastProvider />
                <Navigation />
                <main id="main-content" className="min-h-screen focus:outline-none" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
                <CookieBanner />
              </AuthProvider>
            </CurrencyProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
    </>
  );
}
