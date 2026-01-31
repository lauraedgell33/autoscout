'use client'

import { useTranslations } from 'next-intl'
import { Building2, Mail, Phone } from 'lucide-react'

export default function ImprintPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('pages.imprint.title')}</h1>
          <p className="text-blue-100">Legal information about AutoScout24 SafeTrade</p>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-primary-600" />
                  {t('pages.imprint.company_info')}
                </h2>
                <div className="ml-9 space-y-2">
                  <p className="font-semibold text-gray-900">AutoScout24 SafeTrade GmbH</p>
                  <p>Oranienburger Straße 123</p>
                  <p>10178 Berlin, Germany</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('pages.imprint.legal_reps')}</h2>
                <div className="ml-9 space-y-2">
                  <p>Managing Directors: Sarah Johnson, Michael Chen</p>
                  <p>Register Court: Amtsgericht Charlottenburg, Berlin</p>
                  <p>Registration Number: HRB 12345 B</p>
                  <p>VAT ID: DE123456789</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-primary-600" />
                  {t('pages.imprint.contact_info')}
                </h2>
                <div className="ml-9 space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('pages.imprint.phone')}:</p>
                      <p>+49 30 555 1234</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('pages.imprint.email')}:</p>
                      <p>legal@autoscout24-safetrade.de</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('pages.imprint.liability')}</h2>
                <p className="ml-9">
                  {t('pages.imprint.liability_text')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('pages.imprint.copyright')}</h2>
                <p className="ml-9">
                  © 2024 AutoScout24 SafeTrade. {t('pages.imprint.all_rights_reserved')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
