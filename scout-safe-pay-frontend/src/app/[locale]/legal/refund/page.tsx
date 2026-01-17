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
              This Refund Policy explains the circumstances under which refunds are available for transactions on AutoScout24 SafeTrade, and the process for requesting a refund.
            </p>
          </div>

          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Refund Overview</h2>
            <p className="text-gray-700 mb-4">
              AutoScout24 SafeTrade operates an escrow service that protects both buyers and sellers. Refunds are available in specific circumstances as outlined in this policy.
            </p>
            <p className="text-gray-700">
              All refunds are subject to verification and must be requested within the specified timeframes.
            </p>
          </section>

          {/* 2. Buyer Refund Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">2. Buyer Refund Rights</h2>
            
            <div className="space-y-6">
              {/* Pre-Inspection */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.1 Pre-Inspection Cancellation</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Timeframe:</strong> Before vehicle inspection begins
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Refund Amount:</strong> Full payment minus service fees (2.5%)
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Conditions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Buyer has not yet inspected the vehicle</li>
                  <li>No formal inspection appointment has been scheduled</li>
                  <li>Request must be submitted through the platform</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Processing Time:</strong> 5-7 business days
                </p>
              </div>

              {/* Vehicle Misrepresentation */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.2 Vehicle Misrepresentation</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Timeframe:</strong> Within 7 business days of inspection
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Refund Amount:</strong> Full payment (100%) including service fees
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Eligible Reasons:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Vehicle condition significantly different from listing</li>
                  <li>Undisclosed major defects or damage</li>
                  <li>Incorrect mileage or VIN information</li>
                  <li>Misrepresented service history</li>
                  <li>Safety issues not mentioned in listing</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Required Evidence:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Detailed photos/videos of discrepancies</li>
                  <li>Independent inspection report (if applicable)</li>
                  <li>Original listing screenshots</li>
                  <li>Communication records with seller</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Processing Time:</strong> 7-10 business days (after investigation)
                </p>
              </div>

              {/* Seller Cancellation */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.3 Seller-Initiated Cancellation</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Timeframe:</strong> Any time after payment
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Refund Amount:</strong> Full payment (100%) + compensation (€100)
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Automatic Processing:</strong> When seller cancels after payment received
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Processing Time:</strong> 3-5 business days
                </p>
              </div>

              {/* Failed Inspection */}
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">2.4 Failed Mechanical Inspection</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Timeframe:</strong> Within inspection period (7 days)
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Refund Amount:</strong> Full payment minus inspection costs (if applicable)
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Conditions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Professional inspection identifies major safety issues</li>
                  <li>Vehicle fails mandatory safety standards</li>
                  <li>Cost of repairs exceeds 10% of purchase price</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Required:</strong> Official inspection report from certified mechanic
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Processing Time:</strong> 7-10 business days
                </p>
              </div>
            </div>
          </section>

          {/* 3. Non-Refundable Situations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">3. Non-Refundable Situations</h2>
            <p className="text-gray-700 mb-4">
              Refunds will NOT be granted in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Change of Mind:</strong> Buyer simply changes their mind after inspection acceptance</li>
              <li><strong>Minor Cosmetic Issues:</strong> Small scratches, dents, or wear consistent with vehicle age</li>
              <li><strong>Personal Preferences:</strong> Color, interior details, or subjective preferences</li>
              <li><strong>Post-Acceptance Issues:</strong> Problems discovered after formal acceptance</li>
              <li><strong>Buyer's Remorse:</strong> After completion of transaction and vehicle transfer</li>
              <li><strong>Third-Party Financing:</strong> Issues related to buyer's financing arrangements</li>
              <li><strong>Late Requests:</strong> Refund requests after the 7-day inspection period</li>
            </ul>
          </section>

          {/* 4. Service Fee Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Service Fee Refunds</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Buyer Service Fees (2.5%)</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                  <li><strong>Refunded:</strong> Vehicle misrepresentation, seller cancellation, failed inspection</li>
                  <li><strong>Not Refunded:</strong> Buyer cancellation, change of mind</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Seller Service Fees (1.5%)</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                  <li><strong>Refunded:</strong> Buyer cancellation before inspection</li>
                  <li><strong>Not Refunded:</strong> Completed sales, seller cancellation (fees forfeited + penalty)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Refund Process */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">5. How to Request a Refund</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 1: Submit Request</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Log into your AutoScout24 SafeTrade account</li>
                  <li>Navigate to the transaction in question</li>
                  <li>Click "Request Refund" button</li>
                  <li>Select refund reason from dropdown</li>
                  <li>Provide detailed explanation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 2: Submit Evidence</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Upload photos/videos showing issues</li>
                  <li>Attach inspection reports (if applicable)</li>
                  <li>Include communication records</li>
                  <li>Provide any additional documentation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 3: Review Process</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Our team reviews your request within 48 hours</li>
                  <li>We may contact you for additional information</li>
                  <li>We may contact the seller for their response</li>
                  <li>Independent verification may be conducted</li>
                  <li>Decision communicated via email and platform notification</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 4: Refund Issuance</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Approved refunds processed within stated timeframes</li>
                  <li>Funds returned to original bank account</li>
                  <li>Confirmation email sent with transaction details</li>
                  <li>Bank processing may take additional 3-5 business days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              If you disagree with our refund decision:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Appeal Process:</strong> Submit an appeal within 7 days of decision with new evidence</li>
              <li><strong>Mediation:</strong> Request independent mediation through our platform</li>
              <li><strong>Arbitration:</strong> Final resolution through binding arbitration</li>
              <li><strong>Legal Action:</strong> You retain the right to pursue legal remedies</li>
            </ul>
          </section>

          {/* 7. Special Circumstances */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Special Circumstances</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Fraudulent Listings</h3>
                <p className="text-gray-700">
                  If a listing is determined to be fraudulent, full refund including all fees will be issued immediately, and the seller's account will be permanently banned.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Stolen Vehicles</h3>
                <p className="text-gray-700">
                  If a vehicle is discovered to be stolen, transaction will be immediately canceled, full refund issued, and authorities notified.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800">Force Majeure</h3>
                <p className="text-gray-700">
                  In cases of natural disasters, war, or other unforeseeable circumstances preventing transaction completion, refunds will be issued on a case-by-case basis.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Refund Timeline Summary */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Refund Timeline Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Refund Type</th>
                    <th className="px-4 py-3 text-left">Processing Time</th>
                    <th className="px-4 py-3 text-left">Bank Clearance</th>
                    <th className="px-4 py-3 text-left">Total Time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b bg-white">
                    <td className="px-4 py-3">Seller Cancellation</td>
                    <td className="px-4 py-3">3-5 days</td>
                    <td className="px-4 py-3">3-5 days</td>
                    <td className="px-4 py-3 font-semibold">6-10 days</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3">Buyer Pre-Inspection</td>
                    <td className="px-4 py-3">5-7 days</td>
                    <td className="px-4 py-3">3-5 days</td>
                    <td className="px-4 py-3 font-semibold">8-12 days</td>
                  </tr>
                  <tr className="border-b bg-white">
                    <td className="px-4 py-3">Misrepresentation</td>
                    <td className="px-4 py-3">7-10 days</td>
                    <td className="px-4 py-3">3-5 days</td>
                    <td className="px-4 py-3 font-semibold">10-15 days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">Failed Inspection</td>
                    <td className="px-4 py-3">7-10 days</td>
                    <td className="px-4 py-3">3-5 days</td>
                    <td className="px-4 py-3 font-semibold">10-15 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions about refunds or to request assistance:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> refunds@autoscout24-safetrade.com</li>
              <li><strong>Phone:</strong> +40 21 XXX XXXX (Mon-Fri, 9:00-18:00)</li>
              <li><strong>Live Chat:</strong> Available through your account dashboard</li>
            </ul>
          </section>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 font-semibold mb-2">
              ⚠️ Important Notice
            </p>
            <p className="text-gray-700">
              This Refund Policy is part of our Terms of Service. By using AutoScout24 SafeTrade, you agree to these refund terms. We reserve the right to update this policy at any time with notice to users.
            </p>
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
              <a href="/legal/terms" className="text-blue-300 hover:text-white">Terms of Service</a>
              <a href="/legal/privacy" className="text-blue-300 hover:text-white">Privacy Policy</a>
              <a href="/legal/cookies" className="text-blue-300 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
      <Footer />
    </>
  )
}
