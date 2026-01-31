import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.cookies')
  return {
    title: `${t('title')} | AutoScout24 SafeTrade`,
    description: 'Information about how we use cookies and tracking technologies',
  }
}

export default async function CookiePolicy() {
  const t = await getTranslations('legal.cookies')
  const tCommon = await getTranslations('common')
  
  return (
    <>      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('last_updated')}: January 15, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('intro_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('intro_para1')}
            </p>
            <p className="text-gray-700">
              {t('intro_para2')}
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('types_title')}</h2>
            
            {/* Essential Cookies */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-900">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('essential_title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('essential_desc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2">{t('table_cookie_name')}</th>
                      <th className="px-4 py-2">{t('table_purpose')}</th>
                      <th className="px-4 py-2">{t('table_duration')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">auth_token</td>
                      <td className="px-4 py-2">{t('essential_auth_purpose')}</td>
                      <td className="px-4 py-2">{t('essential_auth_duration')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">session_id</td>
                      <td className="px-4 py-2">{t('essential_session_purpose')}</td>
                      <td className="px-4 py-2">{t('essential_session_duration')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">csrf_token</td>
                      <td className="px-4 py-2">{t('essential_csrf_purpose')}</td>
                      <td className="px-4 py-2">{t('essential_csrf_duration')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">cookie_consent</td>
                      <td className="px-4 py-2">{t('essential_consent_purpose')}</td>
                      <td className="px-4 py-2">{t('essential_consent_duration')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('performance_title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('performance_desc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-2">{t('table_cookie_name')}</th>
                      <th className="px-4 py-2">{t('table_purpose')}</th>
                      <th className="px-4 py-2">{t('table_duration')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_ga</td>
                      <td className="px-4 py-2">{t('performance_ga_purpose')}</td>
                      <td className="px-4 py-2">{t('performance_ga_duration')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                      <td className="px-4 py-2">{t('performance_ga_state_purpose')}</td>
                      <td className="px-4 py-2">{t('performance_ga_state_duration')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">_gid</td>
                      <td className="px-4 py-2">{t('performance_gid_purpose')}</td>
                      <td className="px-4 py-2">{t('performance_gid_duration')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Functionality Cookies */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('functionality_title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('functionality_desc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2">{t('table_cookie_name')}</th>
                      <th className="px-4 py-2">{t('table_purpose')}</th>
                      <th className="px-4 py-2">{t('table_duration')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">user_preferences</td>
                      <td className="px-4 py-2">{t('functionality_prefs_purpose')}</td>
                      <td className="px-4 py-2">{t('functionality_prefs_duration')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">language</td>
                      <td className="px-4 py-2">{t('functionality_lang_purpose')}</td>
                      <td className="px-4 py-2">{t('functionality_lang_duration')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">search_history</td>
                      <td className="px-4 py-2">{t('functionality_search_purpose')}</td>
                      <td className="px-4 py-2">{t('functionality_search_duration')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('marketing_title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('marketing_desc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-4 py-2">{t('table_cookie_name')}</th>
                      <th className="px-4 py-2">{t('table_purpose')}</th>
                      <th className="px-4 py-2">{t('table_duration')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_fbp</td>
                      <td className="px-4 py-2">{t('marketing_fbp_purpose')}</td>
                      <td className="px-4 py-2">{t('marketing_fbp_duration')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">ads_id</td>
                      <td className="px-4 py-2">{t('marketing_ads_purpose')}</td>
                      <td className="px-4 py-2">{t('marketing_ads_duration')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('third_party_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('third_party_intro')}
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('third_party_ga_label')}</strong> {t('third_party_ga_value')}</li>
              <li><strong>{t('third_party_fb_label')}</strong> {t('third_party_fb_value')}</li>
              <li><strong>{t('third_party_hotjar_label')}</strong> {t('third_party_hotjar_value')}</li>
            </ul>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('management_title')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('management_panel_title')}</h3>
                <p className="text-gray-700 mb-3">
                  {t('management_panel_desc')}
                </p>
                <button className="px-6 py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 font-semibold">
                  {t('management_panel_button')}
                </button>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('management_browser_title')}</h3>
                <p className="text-gray-700 mb-3">
                  {t('management_browser_desc')}
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>{t('management_browser_chrome_label')}</strong> {t('management_browser_chrome_value')}</li>
                  <li><strong>{t('management_browser_firefox_label')}</strong> {t('management_browser_firefox_value')}</li>
                  <li><strong>{t('management_browser_safari_label')}</strong> {t('management_browser_safari_value')}</li>
                  <li><strong>{t('management_browser_edge_label')}</strong> {t('management_browser_edge_value')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{t('management_optout_title')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>{t('management_optout_ga_label')}</strong> {t('management_optout_ga_value')}</li>
                  <li><strong>{t('management_optout_fb_label')}</strong> {t('management_optout_fb_value')}</li>
                  <li><strong>{t('management_optout_all_label')}</strong> {t('management_optout_all_value')}</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-700 font-semibold">
                {t('management_warning')}
              </p>
            </div>
          </section>

          {/* Cookie Consent */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('consent_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('consent_intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('consent_option1')}</li>
              <li>{t('consent_option2')}</li>
              <li>{t('consent_option3')}</li>
            </ul>
            <p className="text-gray-700 mt-4">
              {t('consent_change')}
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('updates_title')}</h2>
            <p className="text-gray-700">
              {t('updates_content')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('contact_intro')}
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>{t('contact_email_label')}</strong> {t('contact_email_value')}</li>
              <li><strong>{t('contact_phone_label')}</strong> {t('contact_phone_value')}</li>
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
