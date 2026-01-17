import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('last_updated')}: January 15, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and understanding how you use our platform.
            </p>
            <p className="text-gray-700">
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Types of Cookies We Use</h2>
            
            {/* Essential Cookies */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-900">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">1. Essential Cookies (Required)</h3>
              <p className="text-gray-700 mb-3">
                These cookies are necessary for the website to function and cannot be disabled.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2">Cookie Name</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">auth_token</td>
                      <td className="px-4 py-2">Keeps you logged in</td>
                      <td className="px-4 py-2">30 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">session_id</td>
                      <td className="px-4 py-2">Maintains session state</td>
                      <td className="px-4 py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">csrf_token</td>
                      <td className="px-4 py-2">Security protection</td>
                      <td className="px-4 py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">cookie_consent</td>
                      <td className="px-4 py-2">Stores your cookie preferences</td>
                      <td className="px-4 py-2">12 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">2. Performance Cookies (Optional)</h3>
              <p className="text-gray-700 mb-3">
                These cookies help us understand how visitors interact with our website by collecting anonymous information.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-2">Cookie Name</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_ga</td>
                      <td className="px-4 py-2">Google Analytics - Distinguishes users</td>
                      <td className="px-4 py-2">2 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                      <td className="px-4 py-2">Google Analytics - Persists session state</td>
                      <td className="px-4 py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">_gid</td>
                      <td className="px-4 py-2">Google Analytics - Distinguishes users</td>
                      <td className="px-4 py-2">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Functionality Cookies */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">3. Functionality Cookies (Optional)</h3>
              <p className="text-gray-700 mb-3">
                These cookies enable enhanced functionality and personalization.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2">Cookie Name</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">user_preferences</td>
                      <td className="px-4 py-2">Stores UI preferences</td>
                      <td className="px-4 py-2">12 months</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">language</td>
                      <td className="px-4 py-2">Remembers language choice</td>
                      <td className="px-4 py-2">12 months</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">search_history</td>
                      <td className="px-4 py-2">Recent searches for quick access</td>
                      <td className="px-4 py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">4. Marketing Cookies (Optional)</h3>
              <p className="text-gray-700 mb-3">
                These cookies track your visits across websites to deliver relevant advertising.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-4 py-2">Cookie Name</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">_fbp</td>
                      <td className="px-4 py-2">Facebook Pixel - Ad targeting</td>
                      <td className="px-4 py-2">3 months</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">ads_id</td>
                      <td className="px-4 py-2">Ad personalization</td>
                      <td className="px-4 py-2">12 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use services from trusted third parties that may set their own cookies:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Google Analytics:</strong> To analyze website traffic and user behavior
                <br />
                <a href="https://policies.google.com/privacy" className="text-orange-500 hover:underline text-sm">Google Privacy Policy</a>
              </li>
              <li>
                <strong>Facebook Pixel:</strong> For advertising and remarketing
                <br />
                <a href="https://www.facebook.com/privacy/explanation" className="text-orange-500 hover:underline text-sm">Facebook Privacy Policy</a>
              </li>
              <li>
                <strong>Hotjar:</strong> For user experience analysis and heatmaps
                <br />
                <a href="https://www.hotjar.com/legal/policies/privacy/" className="text-orange-500 hover:underline text-sm">Hotjar Privacy Policy</a>
              </li>
            </ul>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">How to Manage Cookies</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Cookie Settings Panel</h3>
                <p className="text-gray-700 mb-3">
                  You can manage your cookie preferences through our Cookie Settings panel:
                </p>
                <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
                  Manage Cookie Preferences
                </button>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-3">
                  You can control cookies through your browser settings:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Cookies and site permissions → Manage cookies
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Opt-Out Links</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-orange-500 hover:underline">Opt-out browser add-on</a>
                  </li>
                  <li>
                    <strong>Facebook Ads:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-orange-500 hover:underline">Ad Settings</a>
                  </li>
                  <li>
                    <strong>All Advertising:</strong> <a href="http://www.youronlinechoices.com/" className="text-orange-500 hover:underline">Your Online Choices</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-700 font-semibold">
                ⚠️ Note: Disabling essential cookies may affect the functionality of the platform and prevent you from using certain features.
              </p>
            </div>
          </section>

          {/* Cookie Consent */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Cookie Consent</h2>
            <p className="text-gray-700 mb-4">
              When you first visit our website, you will see a cookie consent banner where you can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Accept all cookies</li>
              <li>Reject optional cookies (only essential cookies will be used)</li>
              <li>Customize your preferences for each cookie category</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can change your preferences at any time through the Cookie Settings panel.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our use of cookies:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> privacy@autoscout24-safetrade.com</li>
              <li><strong>Phone:</strong> +40 21 XXX XXXX</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-300">
              © 2026 AutoScout24 SafeTrade. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/legal/terms" className="text-blue-300 hover:text-white">Terms of Service</a>
              <a href="/legal/privacy" className="text-blue-300 hover:text-white">Privacy Policy</a>
              <a href="/legal/refund" className="text-blue-300 hover:text-white">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
      <Footer />
    </>
  )
}
