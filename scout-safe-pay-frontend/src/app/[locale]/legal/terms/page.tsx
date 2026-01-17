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
              Please read these Terms of Service carefully before using AutoScout24 SafeTrade. By accessing or using our platform, you agree to be bound by these terms.
            </p>
          </div>

          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the AutoScout24 SafeTrade platform ("Service"), you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
            <p className="text-gray-700">
              If you do not agree to these Terms of Service, you may not access or use the Service.
            </p>
          </section>

          {/* 2. Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">2. Definitions</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>"Platform"</strong> - The AutoScout24 SafeTrade website and mobile applications</li>
              <li><strong>"User"</strong> - Any individual or entity using the Service</li>
              <li><strong>"Buyer"</strong> - A User purchasing a vehicle through the Platform</li>
              <li><strong>"Seller"</strong> - A User listing and selling a vehicle through the Platform</li>
              <li><strong>"Dealer"</strong> - A professional vehicle dealer registered on the Platform</li>
              <li><strong>"Transaction"</strong> - The complete process of buying/selling a vehicle</li>
              <li><strong>"Escrow Service"</strong> - The secure payment holding service provided by the Platform</li>
            </ul>
          </section>

          {/* 3. User Registration */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">3. User Registration and Accounts</h2>
            <p className="text-gray-700 mb-4">
              <strong>3.1 Registration Requirements:</strong> To use certain features of the Service, you must register and create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>3.2 Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          {/* 4. Services Provided */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Services Provided</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Marketplace:</strong> Platform for Buyers and Sellers to connect and transact vehicle sales</li>
              <li><strong>Escrow Service:</strong> Secure payment holding until transaction conditions are met</li>
              <li><strong>Verification Services:</strong> Vehicle verification, VIN checks, and user identity verification</li>
              <li><strong>Dispute Resolution:</strong> Mediation services for transaction disputes</li>
            </ul>
          </section>

          {/* 5. Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              <strong>5.1 Payment Methods:</strong> All payments must be made via bank transfer to our designated escrow account.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>5.2 Service Fees:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Buyers: 2.5% transaction fee (minimum €50)</li>
              <li>Sellers: 1.5% transaction fee (minimum €30)</li>
              <li>All fees are clearly displayed before payment confirmation</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>5.3 Escrow Process:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Buyer transfers funds to escrow account</li>
              <li>Funds are held securely until vehicle inspection is completed</li>
              <li>Upon approval, funds are released to Seller minus applicable fees</li>
              <li>Escrow holding period: maximum 14 business days</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>5.4 Invoicing:</strong> All transactions include VAT-compliant invoices issued automatically.
            </p>
          </section>

          {/* 6. Seller Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Seller Obligations</h2>
            <p className="text-gray-700 mb-4">As a Seller, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and truthful vehicle information</li>
              <li>Disclose all known defects, damages, or issues</li>
              <li>Provide clear title and ownership documentation</li>
              <li>Allow vehicle inspection by Buyer or authorized inspector</li>
              <li>Deliver the vehicle in the condition described</li>
              <li>Comply with all applicable vehicle sales regulations</li>
              <li>Respond to Buyer inquiries within 48 hours</li>
            </ul>
          </section>

          {/* 7. Buyer Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Buyer Obligations</h2>
            <p className="text-gray-700 mb-4">As a Buyer, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Complete payment within the specified timeframe</li>
              <li>Conduct vehicle inspection within 7 business days</li>
              <li>Accept or reject the vehicle within inspection period</li>
              <li>Arrange vehicle pickup within 14 days of acceptance</li>
              <li>Complete all required registration documentation</li>
              <li>Communicate any issues or concerns promptly</li>
            </ul>
          </section>

          {/* 8. Transaction Process */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Transaction Process</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Purchase Agreement:</strong> Binding purchase agreement upon payment initiation</li>
              <li><strong>Inspection Period:</strong> 7 business days to inspect and confirm acceptance</li>
              <li><strong>Acceptance:</strong> Buyer must formally accept or reject within inspection period</li>
              <li><strong>Fund Release:</strong> Upon acceptance, funds released within 2 business days</li>
              <li><strong>Rejection:</strong> If vehicle doesn't match description, full refund minus inspection costs</li>
            </ul>
          </section>

          {/* 9. Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Cancellation and Refunds</h2>
            <p className="text-gray-700 mb-4"><strong>Buyer Cancellation:</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Before payment: No penalty</li>
              <li>After payment, before inspection: Service fee forfeited</li>
              <li>After inspection begins: Subject to dispute resolution</li>
            </ul>
            <p className="text-gray-700 mt-4"><strong>Seller Cancellation:</strong></p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Before payment: No penalty</li>
              <li>After payment: Full refund to Buyer + penalty fee to Seller</li>
              <li>Repeated cancellations may result in account suspension</li>
            </ul>
          </section>

          {/* 10. Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">10. Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">Users are prohibited from:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Listing stolen vehicles or vehicles without proper ownership</li>
              <li>Providing false or misleading information</li>
              <li>Circumventing the platform to avoid fees</li>
              <li>Engaging in fraudulent activities or scams</li>
              <li>Harassing or abusing other users</li>
              <li>Using automated systems to scrape data</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          {/* 11. Liability */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">11. Liability and Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              <strong>Platform Role:</strong> We are a marketplace facilitator and escrow service provider. We are not a party to transactions between Buyers and Sellers.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Limitation of Liability:</strong> Our liability is limited to the service fees paid for the specific transaction, except where prohibited by law.
            </p>
            <p className="text-gray-700">
              <strong>No Warranty:</strong> The Service is provided "AS IS" without warranties of any kind.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the European Union and Romania.
            </p>
            <p className="text-gray-700">
              Any disputes shall be subject to the exclusive jurisdiction of the courts in Bucharest, Romania.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">For questions about these Terms:</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> legal@autoscout24-safetrade.com</li>
              <li><strong>Phone:</strong> +40 21 XXX XXXX</li>
              <li><strong>Address:</strong> [Company Registered Address]</li>
            </ul>
          </section>

          {/* Acceptance */}
          <div className="mt-12 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold">
              By using AutoScout24 SafeTrade, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
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
              <a href="/legal/privacy" className="text-blue-300 hover:text-white">Privacy Policy</a>
              <a href="/legal/cookies" className="text-blue-300 hover:text-white">Cookie Policy</a>
              <a href="/legal/refund" className="text-blue-300 hover:text-white">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
