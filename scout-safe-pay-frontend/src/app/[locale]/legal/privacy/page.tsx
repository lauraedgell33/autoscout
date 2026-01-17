import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
              AutoScout24 SafeTrade is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, process, and protect your information in compliance with GDPR and applicable data protection laws.
            </p>
          </div>

          {/* 1. Data Controller */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Data Controller</h2>
            <p className="text-gray-700 mb-4">AutoScout24 SafeTrade is the data controller responsible for your personal data.</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Company:</strong> AutoScout24 SafeTrade SRL</li>
              <li><strong>Address:</strong> [Company Registered Address]</li>
              <li><strong>Email:</strong> privacy@autoscout24-safetrade.com</li>
              <li><strong>DPO:</strong> dpo@autoscout24-safetrade.com</li>
            </ul>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.1 Account Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Full name, email address, phone number</li>
                  <li>Password (encrypted)</li>
                  <li>User type (buyer/seller/dealer)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.2 Identity Verification (KYC)</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Government-issued ID documents</li>
                  <li>Proof of address</li>
                  <li>Date of birth, nationality</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.3 Vehicle Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Vehicle details (make, model, year, VIN)</li>
                  <li>Photos and descriptions</li>
                  <li>Ownership documentation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.4 Transaction Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Bank account details for transfers</li>
                  <li>Payment confirmations</li>
                  <li>Invoice information</li>
                  <li>Communication between parties</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.5 Automatically Collected</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">3. How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">3.1 Service Provision</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Create and manage your account</li>
                  <li>Process vehicle listings and transactions</li>
                  <li>Facilitate communication between buyers and sellers</li>
                  <li>Provide escrow and payment services</li>
                  <li>Generate invoices and receipts</li>
                  <li>Verify vehicle and user identities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">3.2 Legal Compliance</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Comply with KYC/AML regulations</li>
                  <li>Prevent fraud and illegal activities</li>
                  <li>Respond to legal requests</li>
                  <li>Maintain transaction records as required by law</li>
                  <li>Tax reporting and invoicing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">3.3 Platform Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Analyze usage patterns</li>
                  <li>Improve platform functionality</li>
                  <li>Develop new features</li>
                  <li>Personalize user experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Legal Basis (GDPR) */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contract with you</li>
              <li><strong>Legal Obligation:</strong> Processing required by law (KYC/AML, tax reporting)</li>
              <li><strong>Legitimate Interest:</strong> Fraud prevention, security, platform improvement</li>
              <li><strong>Consent:</strong> Marketing communications, optional features</li>
            </ul>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Data Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">5.1 Between Users</h3>
                <p className="text-gray-700">
                  Necessary contact information is shared between buyer and seller to facilitate transactions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">5.2 Service Providers</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>KYC/Identity verification services</li>
                  <li>VIN check and vehicle history providers</li>
                  <li>Payment processing partners</li>
                  <li>Cloud hosting providers</li>
                  <li>Email and SMS notification services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">5.3 Legal Requirements</h3>
                <p className="text-gray-700">We may disclose information to law enforcement, tax authorities, and regulatory bodies when required by law.</p>
              </div>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Data Retention</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Account Data:</strong> While account is active + 1 year after deletion</li>
              <li><strong>Transaction Records:</strong> 7 years (legal requirement)</li>
              <li><strong>KYC Documents:</strong> 5 years after account closure</li>
              <li><strong>Communications:</strong> 2 years</li>
              <li><strong>Marketing Data:</strong> Deleted immediately upon withdrawal of consent</li>
            </ul>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Your Rights Under GDPR</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Access</h3>
                <p className="text-gray-700">Request a copy of all personal data we hold about you</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Rectification</h3>
                <p className="text-gray-700">Correct inaccurate or incomplete personal data</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Erasure</h3>
                <p className="text-gray-700">Request deletion of your personal data (subject to legal obligations)</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Data Portability</h3>
                <p className="text-gray-700">Receive your data in machine-readable format</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Object</h3>
                <p className="text-gray-700">Object to processing based on legitimate interests</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Right to Lodge a Complaint</h3>
                <p className="text-gray-700">File a complaint with your data protection authority</p>
              </div>
            </div>

            <p className="text-gray-700 mt-6">
              To exercise these rights, contact us at <strong>privacy@autoscout24-safetrade.com</strong>. We will respond within 30 days.
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Data Security</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Encryption:</strong> All data transmitted over HTTPS/TLS; sensitive data encrypted at rest</li>
              <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
              <li><strong>Secure Storage:</strong> Data stored in secure, EU-based data centers</li>
              <li><strong>Regular Audits:</strong> Security audits and penetration testing</li>
              <li><strong>Incident Response:</strong> 24/7 monitoring and breach response procedures</li>
            </ul>
            <p className="text-gray-700 mt-4">
              In case of data breach, we will notify you and authorities within 72 hours as required by GDPR.
            </p>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Cookies and Tracking</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Performance Cookies:</strong> Analyze usage and improve performance</li>
              <li><strong>Functionality Cookies:</strong> Remember preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant ads (requires consent)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Manage cookie preferences through our Cookie Settings or browser settings.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Our platform is not intended for users under 18. We do not knowingly collect children's data.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">11. Contact Us</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> privacy@autoscout24-safetrade.com</li>
              <li><strong>DPO:</strong> dpo@autoscout24-safetrade.com</li>
              <li><strong>Phone:</strong> +40 21 XXX XXXX</li>
            </ul>
          </section>

          {/* 12. Supervisory Authority */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">12. Supervisory Authority</h2>
            <p className="text-gray-700">
              <strong>Romanian Data Protection Authority (ANSPDCP)</strong><br />
              Website: www.dataprotection.ro<br />
              Email: anspdcp@dataprotection.ro
            </p>
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
              <a href="/legal/cookies" className="text-blue-300 hover:text-white">Cookie Policy</a>
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
