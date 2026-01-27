import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.refund')
  return {
    title: `${t('title')} | AutoScout24 SafeTrade`,
    description: 'Refund and cancellation policy for AutoScout24 SafeTrade transactions',
  }
}

export default async function RefundPolicy() {
  const t = await getTranslations('legal.refund')
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
            <p className="text-gray-700">
              {t('intro')}
            </p>
          </div>

          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section1_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section1_para1')}
            </p>
            <p className="text-gray-700">
              {t('section1_para2')}
            </p>
          </section>

          {/* 2. Buyer Refund Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section2_title')}</h2>
            
            <div className="space-y-6">
              {/* Pre-Inspection */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_1_title')}</h3>
                <p className="text-gray-700 mb-3"><strong>{t('section2_1_timeframe_label')}</strong> {t('section2_1_timeframe_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_1_refund_label')}</strong> {t('section2_1_refund_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_1_conditions_label')}</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_1_cond1')}</li>
                  <li>{t('section2_1_cond2')}</li>
                  <li>{t('section2_1_cond3')}</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>{t('section2_1_processing_label')}</strong> {t('section2_1_processing_value')}</p>
              </div>

              {/* Vehicle Misrepresentation */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_2_title')}</h3>
                <p className="text-gray-700 mb-3"><strong>{t('section2_2_timeframe_label')}</strong> {t('section2_2_timeframe_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_2_refund_label')}</strong> {t('section2_2_refund_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_2_eligible_label')}</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_2_reason1')}</li>
                  <li>{t('section2_2_reason2')}</li>
                  <li>{t('section2_2_reason3')}</li>
                  <li>{t('section2_2_reason4')}</li>
                  <li>{t('section2_2_reason5')}</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>{t('section2_2_evidence_label')}</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_2_evidence1')}</li>
                  <li>{t('section2_2_evidence2')}</li>
                  <li>{t('section2_2_evidence3')}</li>
                  <li>{t('section2_2_evidence4')}</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>{t('section2_2_processing_label')}</strong> {t('section2_2_processing_value')}</p>
              </div>

              {/* Seller Cancellation */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_3_title')}</h3>
                <p className="text-gray-700 mb-3"><strong>{t('section2_3_timeframe_label')}</strong> {t('section2_3_timeframe_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_3_refund_label')}</strong> {t('section2_3_refund_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_3_auto_label')}</strong> {t('section2_3_auto_value')}</p>
                <p className="text-gray-700 mt-3"><strong>{t('section2_3_processing_label')}</strong> {t('section2_3_processing_value')}</p>
              </div>

              {/* Failed Inspection */}
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section2_4_title')}</h3>
                <p className="text-gray-700 mb-3"><strong>{t('section2_4_timeframe_label')}</strong> {t('section2_4_timeframe_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_4_refund_label')}</strong> {t('section2_4_refund_value')}</p>
                <p className="text-gray-700 mb-3"><strong>{t('section2_4_conditions_label')}</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section2_4_cond1')}</li>
                  <li>{t('section2_4_cond2')}</li>
                  <li>{t('section2_4_cond3')}</li>
                </ul>
                <p className="text-gray-700 mt-3"><strong>{t('section2_4_required_label')}</strong> {t('section2_4_required_value')}</p>
                <p className="text-gray-700 mt-3"><strong>{t('section2_4_processing_label')}</strong> {t('section2_4_processing_value')}</p>
              </div>
            </div>
          </section>

          {/* 3. Non-Refundable Situations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section3_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section3_intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>{t('section3_item1_label')}</strong> {t('section3_item1_value')}</li>
              <li><strong>{t('section3_item2_label')}</strong> {t('section3_item2_value')}</li>
              <li><strong>{t('section3_item3_label')}</strong> {t('section3_item3_value')}</li>
              <li><strong>{t('section3_item4_label')}</strong> {t('section3_item4_value')}</li>
              <li><strong>{t('section3_item5_label')}</strong> {t('section3_item5_value')}</li>
              <li><strong>{t('section3_item6_label')}</strong> {t('section3_item6_value')}</li>
              <li><strong>{t('section3_item7_label')}</strong> {t('section3_item7_value')}</li>
            </ul>
          </section>

          {/* 4. Service Fee Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section4_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section4_buyer_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                  <li><strong>{t('section4_buyer_refunded_label')}</strong> {t('section4_buyer_refunded_value')}</li>
                  <li><strong>{t('section4_buyer_not_label')}</strong> {t('section4_buyer_not_value')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section4_seller_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                  <li><strong>{t('section4_seller_refunded_label')}</strong> {t('section4_seller_refunded_value')}</li>
                  <li><strong>{t('section4_seller_not_label')}</strong> {t('section4_seller_not_value')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Refund Process */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section5_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_step1_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section5_step1_item1')}</li>
                  <li>{t('section5_step1_item2')}</li>
                  <li><strong>{t('section5_step1_item3_label')}</strong> {t('section5_step1_item3_value')}</li>
                  <li>{t('section5_step1_item4')}</li>
                  <li>{t('section5_step1_item5')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_step2_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section5_step2_item1')}</li>
                  <li>{t('section5_step2_item2')}</li>
                  <li>{t('section5_step2_item3')}</li>
                  <li>{t('section5_step2_item4')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_step3_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section5_step3_item1')}</li>
                  <li>{t('section5_step3_item2')}</li>
                  <li>{t('section5_step3_item3')}</li>
                  <li>{t('section5_step3_item4')}</li>
                  <li>{t('section5_step3_item5')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('section5_step4_title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>{t('section5_step4_item1')}</li>
                  <li>{t('section5_step4_item2')}</li>
                  <li>{t('section5_step4_item3')}</li>
                  <li>{t('section5_step4_item4')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section6_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section6_intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>{t('section6_item1_label')}</strong> {t('section6_item1_value')}</li>
              <li><strong>{t('section6_item2_label')}</strong> {t('section6_item2_value')}</li>
              <li><strong>{t('section6_item3_label')}</strong> {t('section6_item3_value')}</li>
              <li><strong>{t('section6_item4_label')}</strong> {t('section6_item4_value')}</li>
            </ul>
          </section>

          {/* 7. Special Circumstances */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section7_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_fraud_title')}</h3>
                <p className="text-gray-700">
                  {t('section7_fraud_content')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_stolen_title')}</h3>
                <p className="text-gray-700">
                  {t('section7_stolen_content')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">{t('section7_force_title')}</h3>
                <p className="text-gray-700">
                  {t('section7_force_content')}
                </p>
              </div>
            </div>
          </section>

          {/* 8. Refund Timeline Summary */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section8_title')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">{t('table_header_type')}</th>
                    <th className="px-4 py-3 text-left">{t('table_header_processing')}</th>
                    <th className="px-4 py-3 text-left">{t('table_header_bank')}</th>
                    <th className="px-4 py-3 text-left">{t('table_header_total')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b bg-white">
                    <td className="px-4 py-3">{t('table_row1_type')}</td>
                    <td className="px-4 py-3">{t('table_row1_processing')}</td>
                    <td className="px-4 py-3">{t('table_row1_bank')}</td>
                    <td className="px-4 py-3 font-semibold">{t('table_row1_total')}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3">{t('table_row2_type')}</td>
                    <td className="px-4 py-3">{t('table_row2_processing')}</td>
                    <td className="px-4 py-3">{t('table_row2_bank')}</td>
                    <td className="px-4 py-3 font-semibold">{t('table_row2_total')}</td>
                  </tr>
                  <tr className="border-b bg-white">
                    <td className="px-4 py-3">{t('table_row3_type')}</td>
                    <td className="px-4 py-3">{t('table_row3_processing')}</td>
                    <td className="px-4 py-3">{t('table_row3_bank')}</td>
                    <td className="px-4 py-3 font-semibold">{t('table_row3_total')}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">{t('table_row4_type')}</td>
                    <td className="px-4 py-3">{t('table_row4_processing')}</td>
                    <td className="px-4 py-3">{t('table_row4_bank')}</td>
                    <td className="px-4 py-3 font-semibold">{t('table_row4_total')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('section9_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section9_intro')}
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('section9_email_label')}</strong> {t('section9_email_value')}</li>
              <li><strong>{t('section9_phone_label')}</strong> {t('section9_phone_value')}</li>
              <li><strong>{t('section9_chat_label')}</strong> {t('section9_chat_value')}</li>
            </ul>
          </section>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold mb-2">
              {t('notice_title')}
            </p>
            <p className="text-gray-700">
              {t('notice_content')}
            </p>
          </div>

          {/* Contact */}
          <div className="mt-12 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold mb-3">
              {t('contact_title')}
            </p>
            <ul className="text-gray-700 space-y-1">
              <li><strong>{t('contact_email_label')}</strong> {t('contact_email_value')}</li>
              <li><strong>{t('contact_phone_label')}</strong> {t('contact_phone_value')}</li>
            </ul>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </>
  )
}
