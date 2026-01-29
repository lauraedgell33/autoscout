'use client';

import { useTranslations } from 'next-intl';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LegalPage() {
  const t = useTranslations();

  const sections = [
    { href: '/legal/privacy', title: 'Privacy Policy', description: 'How we protect your data' },
    { href: '/legal/terms', title: 'Terms of Service', description: 'Terms and conditions' },
    { href: '/legal/cookies', title: 'Cookie Policy', description: 'About our cookies' },
    { href: '/legal/imprint', title: 'Imprint', description: 'Legal imprint' },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Legal Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link key={section.href} href={section.href}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
