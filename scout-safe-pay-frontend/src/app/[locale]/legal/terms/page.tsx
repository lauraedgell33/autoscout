import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.terms')
  return {
    title: `${t('title')} | AutoScout24 SafeTrade`,
    description: 'Terms and conditions for using AutoScout24 SafeTrade platform',
  }
}

export default async function TermsOfService() {
  const t = await getTranslations('legal.terms')
  const tCommon = await getTranslations('common')
  
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('last_updated')}: January 15, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-900">
            <p className="text-gray-700 font-semibold">
              {t('intro')}
            </p>
          </div>

          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section1_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section1_para1')}
            </p>
            <p className="text-gray-700">
              {t('section1_para2')}
            </p>
          </section>

          {/* 2. Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section2_title')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('section2_def1_label')}</strong> - {t('section2_def1_value')}</li>
              <li><strong>{t('section2_def2_label')}</strong> - {t('section2_def2_value')}</li>
              <li><strong>{t('section2_def3_label')}</strong> - {t('section2_def3_value')}</li>
              <li><strong>{t('section2_def4_label')}</strong> - {t('section2_def4_value')}</li>
              <li><strong>{t('section2_def5_label')}</strong> - {t('section2_def5_value')}</li>
              <li><strong>{t('section2_def6_label')}</strong> - {t('section2_def6_value')}</li>
              <li><strong>{t('section2_def7_label')}</strong> - {t('section2_def7_value')}</li>
            </ul>
          </section>

          {/* 3. User Registration */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section3_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section3_1_title_label')}</strong> {t('section3_1_title_value')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section3_1_item1')}</li>
              <li>{t('section3_1_item2')}</li>
              <li>{t('section3_1_item3')}</li>
              <li>{t('section3_1_item4')}</li>
              <li>{t('section3_1_item5')}</li>
            </ul>
            <p className="text-gray-700 mt-4"><strong>{t('section3_2_title_label')}</strong> {t('section3_2_title_value')}</p>
          </section>

          {/* 4. Services Provided */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section4_title')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('section4_item1_label')}</strong> {t('section4_item1_value')}</li>
              <li><strong>{t('section4_item2_label')}</strong> {t('section4_item2_value')}</li>
              <li><strong>{t('section4_item3_label')}</strong> {t('section4_item3_value')}</li>
              <li><strong>{t('section4_item4_label')}</strong> {t('section4_item4_value')}</li>
            </ul>
          </section>

          {/* 5. Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section5_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section5_1_title_label')}</strong> {t('section5_1_title_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section5_2_title_label')}</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section5_2_item1')}</li>
              <li>{t('section5_2_item2')}</li>
              <li>{t('section5_2_item3')}</li>
            </ul>
            <p className="text-gray-700 mt-4"><strong>{t('section5_3_title_label')}</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section5_3_item1')}</li>
              <li>{t('section5_3_item2')}</li>
              <li>{t('section5_3_item3')}</li>
              <li>{t('section5_3_item4')}</li>
            </ul>
            <p className="text-gray-700 mt-4"><strong>{t('section5_4_title_label')}</strong> {t('section5_4_title_value')}</p>
          </section>

          {/* 6. Seller Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section6_title')}</h2>
            <p className="text-gray-700 mb-4">{t('section6_intro')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section6_item1')}</li>
              <li>{t('section6_item2')}</li>
              <li>{t('section6_item3')}</li>
              <li>{t('section6_item4')}</li>
              <li>{t('section6_item5')}</li>
              <li>{t('section6_item6')}</li>
              <li>{t('section6_item7')}</li>
            </ul>
          </section>

          {/* 7. Buyer Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section7_title')}</h2>
            <p className="text-gray-700 mb-4">{t('section7_intro')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section7_item1')}</li>
              <li>{t('section7_item2')}</li>
              <li>{t('section7_item3')}</li>
              <li>{t('section7_item4')}</li>
              <li>{t('section7_item5')}</li>
              <li>{t('section7_item6')}</li>
            </ul>
          </section>

          {/* 8. Transaction Process */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section8_title')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('section8_item1_label')}</strong> {t('section8_item1_value')}</li>
              <li><strong>{t('section8_item2_label')}</strong> {t('section8_item2_value')}</li>
              <li><strong>{t('section8_item3_label')}</strong> {t('section8_item3_value')}</li>
              <li><strong>{t('section8_item4_label')}</strong> {t('section8_item4_value')}</li>
              <li><strong>{t('section8_item5_label')}</strong> {t('section8_item5_value')}</li>
            </ul>
          </section>

          {/* 9. Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section9_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section9_buyer_title_label')}</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section9_buyer_item1')}</li>
              <li>{t('section9_buyer_item2')}</li>
              <li>{t('section9_buyer_item3')}</li>
            </ul>
            <p className="text-gray-700 mt-4"><strong>{t('section9_seller_title_label')}</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section9_seller_item1')}</li>
              <li>{t('section9_seller_item2')}</li>
              <li>{t('section9_seller_item3')}</li>
            </ul>
          </section>

          {/* 10. Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section10_title')}</h2>
            <p className="text-gray-700 mb-4">{t('section10_intro')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section10_item1')}</li>
              <li>{t('section10_item2')}</li>
              <li>{t('section10_item3')}</li>
              <li>{t('section10_item4')}</li>
              <li>{t('section10_item5')}</li>
              <li>{t('section10_item6')}</li>
              <li>{t('section10_item7')}</li>
            </ul>
          </section>

          {/* 11. Liability */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section11_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section11_platform_label')}</strong> {t('section11_platform_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section11_limitation_label')}</strong> {t('section11_limitation_value')}</p>
            <p className="text-gray-700"><strong>{t('section11_warranty_label')}</strong> {t('section11_warranty_value')}</p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section12_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section12_para1')}
            </p>
            <p className="text-gray-700">
              {t('section12_para2')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section13_title')}</h2>
            <p className="text-gray-700 mb-4">{t('section13_intro')}</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section13_email_label')}</strong> {t('section13_email_value')}</li>
              <li><strong>{t('section13_phone_label')}</strong> {t('section13_phone_value')}</li>
              <li><strong>{t('section13_address_label')}</strong> {t('section13_address_value')}</li>
            </ul>
          </section>

          {/* Acceptance */}
          <div className="mt-12 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold">
              {t('acceptance')}
            </p>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </>
  )
}
