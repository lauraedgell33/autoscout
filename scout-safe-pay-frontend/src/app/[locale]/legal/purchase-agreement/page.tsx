import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal.purchase' })
  
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function PurchaseAgreement({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal.purchase' })
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-orange-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">AutoScout24 SafeTrade</span>
            </Link>
            <Link href={`/${locale}`} className="text-sm text-gray-600 hover:text-gray-900">
              {t('nav_back')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-8">{t('subtitle')}</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-900">
            <p className="text-gray-700">
              {t('intro')}
            </p>
          </div>

          {/* Agreement Header */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('header_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('header_intro_label')}</strong> {t('header_intro_value')}</p>
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2"><strong>{t('seller_label')}</strong></p>
                <p className="text-gray-700">[Seller Name]</p>
                <p className="text-gray-700 text-sm">[Seller Address]</p>
                <p className="text-gray-700 text-sm">[Seller Email]</p>
                <p className="text-gray-700 text-sm">[Seller Phone]</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2"><strong>{t('buyer_label')}</strong></p>
                <p className="text-gray-700">[Buyer Name]</p>
                <p className="text-gray-700 text-sm">[Buyer Address]</p>
                <p className="text-gray-700 text-sm">[Buyer Email]</p>
                <p className="text-gray-700 text-sm">[Buyer Phone]</p>
              </div>
            </div>
          </section>

          {/* 1. Vehicle Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section1_intro_label')}</strong> {t('section1_intro_value')}</p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_make')}</p>
                  <p className="font-semibold">[Vehicle Make]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_model')}</p>
                  <p className="font-semibold">[Vehicle Model]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_year')}</p>
                  <p className="font-semibold">[Year]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_vin')}</p>
                  <p className="font-semibold">[VIN Number]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_mileage')}</p>
                  <p className="font-semibold">[Mileage] km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_color')}</p>
                  <p className="font-semibold">[Color]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_fuel')}</p>
                  <p className="font-semibold">[Fuel Type]</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle_transmission')}</p>
                  <p className="font-semibold">[Transmission]</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Purchase Price */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2_title')}</h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">{t('price_vehicle')}</span>
                <span className="font-semibold text-gray-900">[Amount] EUR</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">{t('price_buyer_fee')}</span>
                <span className="font-semibold text-gray-900">[Fee] EUR</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">{t('price_seller_fee')}</span>
                <span className="font-semibold text-gray-900">[Fee] EUR</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-gray-900">{t('price_total_buyer')}</span>
                <span className="text-lg font-bold text-gray-900">[Total] EUR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-bold text-orange-600">{t('price_amount_seller')}</span>
                <span className="text-lg font-bold text-orange-600">[Net Amount] EUR</span>
              </div>
            </div>
          </section>

          {/* 3. Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section3_1_label')}</strong> {t('section3_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section3_2_label')}</strong> {t('section3_2_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section3_3_label')}</strong> {t('section3_3_value')}</p>
            <p className="text-gray-700"><strong>{t('section3_4_label')}</strong> {t('section3_4_value')}</p>
          </section>

          {/* 4. Seller Representations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section4_intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section4_item1')}</li>
              <li>{t('section4_item2')}</li>
              <li>{t('section4_item3')}</li>
              <li>{t('section4_item4')}</li>
              <li>{t('section4_item5')}</li>
              <li>{t('section4_item6')}</li>
              <li>{t('section4_item7')}</li>
              <li>{t('section4_item8')}</li>
            </ul>
          </section>

          {/* 5. Buyer Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('section5_intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('section5_item1')}</li>
              <li>{t('section5_item2')}</li>
              <li>{t('section5_item3')}</li>
              <li>{t('section5_item4')}</li>
              <li>{t('section5_item5')}</li>
              <li>{t('section5_item6')}</li>
              <li>{t('section5_item7')}</li>
            </ul>
          </section>

          {/* 6. Inspection Period */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section6_1_label')}</strong> {t('section6_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section6_2_label')}</strong> {t('section6_2_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section6_3_label')}</strong> {t('section6_3_value')}</p>
            <p className="text-gray-700"><strong>{t('section6_4_label')}</strong> {t('section6_4_value')}</p>
          </section>

          {/* 7. Acceptance or Rejection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section7_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section7_1_label')}</strong> {t('section7_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section7_2_label')}</strong> {t('section7_2_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section7_3_label')}</strong> {t('section7_3_value')}</p>
            <p className="text-gray-700"><strong>{t('section7_4_label')}</strong> {t('section7_4_value')}</p>
          </section>

          {/* 8. Transfer of Ownership */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section8_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section8_1_title_label')}</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>{t('section8_1_item1')}</li>
              <li>{t('section8_1_item2')}</li>
              <li>{t('section8_1_item3')}</li>
              <li>{t('section8_1_item4')}</li>
              <li>{t('section8_1_item5')}</li>
            </ul>
            <p className="text-gray-700 mt-4 mb-4"><strong>{t('section8_2_label')}</strong> {t('section8_2_value')}</p>
            <p className="text-gray-700"><strong>{t('section8_3_label')}</strong> {t('section8_3_value')}</p>
          </section>

          {/* 9. Vehicle Delivery */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section9_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section9_1_label')}</strong> {t('section9_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section9_2_label')}</strong> {t('section9_2_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section9_3_label')}</strong> {t('section9_3_value')}</p>
            <p className="text-gray-700"><strong>{t('section9_4_label')}</strong> {t('section9_4_value')}</p>
          </section>

          {/* 10. "As-Is" Sale */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section10_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section10_1_label')}</strong> {t('section10_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section10_2_label')}</strong> {t('section10_2_value')}</p>
            <p className="text-gray-700"><strong>{t('section10_3_label')}</strong> {t('section10_3_value')}</p>
          </section>

          {/* 11. Cancellation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section11_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section11_1_label')}</strong> {t('section11_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section11_2_label')}</strong> {t('section11_2_value')}</p>
            <p className="text-gray-700"><strong>{t('section11_3_label')}</strong> {t('section11_3_value')}</p>
          </section>

          {/* 12. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section12_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section12_1_label')}</strong> {t('section12_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section12_2_label')}</strong> {t('section12_2_value')}</p>
            <p className="text-gray-700"><strong>{t('section12_3_label')}</strong> {t('section12_3_value')}</p>
          </section>

          {/* 13. Platform Role */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section13_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section13_1_label')}</strong> {t('section13_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section13_2_label')}</strong> {t('section13_2_value')}</p>
            <p className="text-gray-700"><strong>{t('section13_3_label')}</strong> {t('section13_3_value')}</p>
          </section>

          {/* 14. Additional Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section14_title')}</h2>
            <p className="text-gray-700 mb-4"><strong>{t('section14_1_label')}</strong> {t('section14_1_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section14_2_label')}</strong> {t('section14_2_value')}</p>
            <p className="text-gray-700 mb-4"><strong>{t('section14_3_label')}</strong> {t('section14_3_value')}</p>
            <p className="text-gray-700"><strong>{t('section14_4_label')}</strong> {t('section14_4_value')}</p>
          </section>

          {/* Signatures */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section15_title')}</h2>
            <p className="text-gray-700 mb-6">
              {t('section15_intro')}
            </p>
            
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <p className="font-semibold text-gray-900">{t('signature_seller')}</p>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-gray-700">{t('signature_electronic')}</p>
                  <p className="text-sm text-gray-600">{t('signature_name')} [Seller Name]</p>
                  <p className="text-sm text-gray-600">{t('signature_date')} [Signature Date]</p>
                  <p className="text-sm text-gray-600">{t('signature_ip')} [IP Address]</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-semibold text-gray-900">{t('signature_buyer')}</p>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-gray-700">{t('signature_electronic')}</p>
                  <p className="text-sm text-gray-600">{t('signature_name')} [Buyer Name]</p>
                  <p className="text-sm text-gray-600">{t('signature_date')} [Signature Date]</p>
                  <p className="text-sm text-gray-600">{t('signature_ip')} [IP Address]</p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold mb-2">
              {t('notice_title')}
            </p>
            <p className="text-gray-700">
              {t('notice_text')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-300">
              {t('footer_copyright')}
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href={`/${locale}/legal/terms`} className="text-blue-300 hover:text-white">{t('footer_terms')}</Link>
              <Link href={`/${locale}/legal/privacy`} className="text-blue-300 hover:text-white">{t('footer_privacy')}</Link>
              <Link href={`/${locale}/legal/refund`} className="text-blue-300 hover:text-white">{t('footer_refund')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
