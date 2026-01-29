import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy')
  return {
    title: `${t('title')} | AutoScout24 SafeTrade`,
    description: 'Privacy policy and data protection information for AutoScout24 SafeTrade',
  }
}

export default async function PrivacyPolicy() {
  const t = await getTranslations('legal.privacy')
  const tCommon = await getTranslations('common')
  
  return (
    <>      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('last_updated')}: January 15, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-900">
            <p className="text-gray-700">
              {t('intro')}
            </p>
          </div>

          {/* 1. Data Controller */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section1_title')}</h2>
            <p className="text-gray-700 mb-4">{t('section1_intro')}</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section1_company_label')}:</strong> {t('section1_company_value')}</li>
              <li><strong>{t('section1_address_label')}:</strong> {t('section1_address_value')}</li>
              <li><strong>{t('section1_email_label')}:</strong> {t('section1_email_value')}</li>
              <li><strong>{t('section1_dpo_label')}:</strong> {t('section1_dpo_value')}</li>
            </ul>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section2_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_1_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_1_item1')}</li>
                  <li>{t('section2_1_item2')}</li>
                  <li>{t('section2_1_item3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_2_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_2_item1')}</li>
                  <li>{t('section2_2_item2')}</li>
                  <li>{t('section2_2_item3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_3_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_3_item1')}</li>
                  <li>{t('section2_3_item2')}</li>
                  <li>{t('section2_3_item3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_4_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_4_item1')}</li>
                  <li>{t('section2_4_item2')}</li>
                  <li>{t('section2_4_item3')}</li>
                  <li>{t('section2_4_item4')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_5_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_5_item1')}</li>
                  <li>{t('section2_5_item2')}</li>
                  <li>{t('section2_5_item3')}</li>
                  <li>{t('section2_5_item4')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section3_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section3_1_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section3_1_item1')}</li>
                  <li>{t('section3_1_item2')}</li>
                  <li>{t('section3_1_item3')}</li>
                  <li>{t('section3_1_item4')}</li>
                  <li>{t('section3_1_item5')}</li>
                  <li>{t('section3_1_item6')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section3_2_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section3_2_item1')}</li>
                  <li>{t('section3_2_item2')}</li>
                  <li>{t('section3_2_item3')}</li>
                  <li>{t('section3_2_item4')}</li>
                  <li>{t('section3_2_item5')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section3_3_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section3_3_item1')}</li>
                  <li>{t('section3_3_item2')}</li>
                  <li>{t('section3_3_item3')}</li>
                  <li>{t('section3_3_item4')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Legal Basis (GDPR) */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section4_title')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('section4_item1_label')}:</strong> {t('section4_item1_value')}</li>
              <li><strong>{t('section4_item2_label')}:</strong> {t('section4_item2_value')}</li>
              <li><strong>{t('section4_item3_label')}:</strong> {t('section4_item3_value')}</li>
              <li><strong>{t('section4_item4_label')}:</strong> {t('section4_item4_value')}</li>
            </ul>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section5_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_1_title')}</h3>
                <p className="text-gray-700">
                  {t('section5_1_content')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_2_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section5_2_item1')}</li>
                  <li>{t('section5_2_item2')}</li>
                  <li>{t('section5_2_item3')}</li>
                  <li>{t('section5_2_item4')}</li>
                  <li>{t('section5_2_item5')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_3_title')}</h3>
                <p className="text-gray-700">{t('section5_3_content')}</p>
              </div>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section6_title')}</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section6_item1_label')}:</strong> {t('section6_item1_value')}</li>
              <li><strong>{t('section6_item2_label')}:</strong> {t('section6_item2_value')}</li>
              <li><strong>{t('section6_item3_label')}:</strong> {t('section6_item3_value')}</li>
              <li><strong>{t('section6_item4_label')}:</strong> {t('section6_item4_value')}</li>
              <li><strong>{t('section6_item5_label')}:</strong> {t('section6_item5_value')}</li>
            </ul>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section7_title')}</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_1_title')}</h3>
                <p className="text-gray-700">{t('section7_1_content')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_2_title')}</h3>
                <p className="text-gray-700">{t('section7_2_content')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_3_title')}</h3>
                <p className="text-gray-700">{t('section7_3_content')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_4_title')}</h3>
                <p className="text-gray-700">{t('section7_4_content')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_5_title')}</h3>
                <p className="text-gray-700">{t('section7_5_content')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_6_title')}</h3>
                <p className="text-gray-700">{t('section7_6_content')}</p>
              </div>
            </div>

            <p className="text-gray-700 mt-6">
              {t('section7_exercise_prefix')} <strong>{t('section7_exercise_email')}</strong>. {t('section7_exercise_suffix')}
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section8_title')}</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section8_item1_label')}:</strong> {t('section8_item1_value')}</li>
              <li><strong>{t('section8_item2_label')}:</strong> {t('section8_item2_value')}</li>
              <li><strong>{t('section8_item3_label')}:</strong> {t('section8_item3_value')}</li>
              <li><strong>{t('section8_item4_label')}:</strong> {t('section8_item4_value')}</li>
              <li><strong>{t('section8_item5_label')}:</strong> {t('section8_item5_value')}</li>
            </ul>
            <p className="text-gray-700 mt-4">
              {t('section8_breach')}
            </p>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section9_title')}</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section9_item1_label')}:</strong> {t('section9_item1_value')}</li>
              <li><strong>{t('section9_item2_label')}:</strong> {t('section9_item2_value')}</li>
              <li><strong>{t('section9_item3_label')}:</strong> {t('section9_item3_value')}</li>
              <li><strong>{t('section9_item4_label')}:</strong> {t('section9_item4_value')}</li>
            </ul>
            <p className="text-gray-700 mt-4">
              {t('section9_manage')}
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section10_title')}</h2>
            <p className="text-gray-700">
              {t('section10_content')}
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section11_title')}</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section11_email_label')}:</strong> {t('section11_email_value')}</li>
              <li><strong>{t('section11_dpo_label')}:</strong> {t('section11_dpo_value')}</li>
              <li><strong>{t('section11_phone_label')}:</strong> {t('section11_phone_value')}</li>
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
      </div>    </>
  )
}
