import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations()
  
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-bold">AutoScout24</span>
            </div>
            <p className="text-sm text-blue-200">{t('footer.about_text')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.quick_links')}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/marketplace" className="block text-blue-200 hover:text-white">{t('footer.marketplace')}</Link>
              <Link href="/how-it-works" className="block text-blue-200 hover:text-white">{t('footer.how_it_works')}</Link>
              <Link href="/benefits" className="block text-blue-200 hover:text-white">{t('footer.benefits')}</Link>
              <Link href="/dealers" className="block text-blue-200 hover:text-white">{t('footer.dealers')}</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/contact" className="block text-blue-200 hover:text-white">{t('footer.contact')}</Link>
              <a href="#" className="block text-blue-200 hover:text-white">{t('footer.about')}</a>
              <a href="#" className="block text-blue-200 hover:text-white">{t('footer.careers')}</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-blue-200 hover:text-white">{t('footer.privacy')}</a>
              <a href="#" className="block text-blue-200 hover:text-white">{t('footer.terms')}</a>
              <a href="#" className="block text-blue-200 hover:text-white">{t('footer.imprint')}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-sm text-blue-200">
          <p>&copy; 2026 AutoScout24 SafeTrade. {t('footer.rights_reserved')}</p>
        </div>
      </div>
    </footer>
  )
}
