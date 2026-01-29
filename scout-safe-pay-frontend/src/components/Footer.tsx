'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AutoScout24</h3>
            <p className="text-gray-400">{t('safe_marketplace') || 'Safe and secure vehicle marketplace'}</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t('company') || 'Company'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('about') || 'About'}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">{t('careers') || 'Careers'}</Link></li>
              <li><Link href="/dealers" className="hover:text-white transition-colors">{t('dealers') || 'Dealers'}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact') || 'Contact'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t('support') || 'Support'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact_us') || 'Contact Us'}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t('faq') || 'FAQ'}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">{t('how_it_works') || 'How It Works'}</Link></li>
              <li><Link href="/benefits" className="hover:text-white transition-colors">{t('benefits') || 'Benefits'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t('legal') || 'Legal'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">{t('privacy') || 'Privacy'}</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">{t('terms') || 'Terms'}</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white transition-colors">{t('cookies') || 'Cookies'}</Link></li>
              <li><Link href="/legal/imprint" className="hover:text-white transition-colors">{t('imprint') || 'Imprint'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} AutoScout24 SafeTrade. {t('all_rights_reserved') || 'All rights reserved'}.</p>
        </div>
      </div>
    </footer>
  );
}
