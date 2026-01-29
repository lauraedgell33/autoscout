'use client';

import { useTranslations } from 'next-intl';

export default function RefundsPolicy() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p>
                AutoScout SafePay is committed to providing a secure and reliable marketplace for vehicle transactions. 
                This refund policy outlines the conditions under which refunds may be issued.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Eligibility</h2>
              <p>Refunds may be issued in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment was made in error or duplicate</li>
                <li>Vehicle condition does not match the listing description</li>
                <li>Transaction is cancelled within 24 hours of completion</li>
                <li>Vehicle is not delivered as agreed</li>
                <li>Dispute resolution finds in favor of the buyer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Timeline</h2>
              <p>
                Once a refund is approved, it will be processed within 5-10 business days. The timeframe depends on your 
                payment method and financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your account</li>
                <li>Navigate to your transaction history</li>
                <li>Select the transaction and click "Request Refund"</li>
                <li>Provide documentation supporting your request</li>
                <li>Our team will review and respond within 3-5 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Refundable Items</h2>
              <p>The following are generally not refundable:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fees for seller services and advertising</li>
                <li>Completed transactions after delivery</li>
                <li>Transactions involving verified fraud or misrepresentation by buyer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
              <p>
                If you have any questions about our refund policy, please contact our support team at 
                <a href="mailto:support@autoscout.dev" className="text-blue-600 hover:text-blue-700"> support@autoscout.dev</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
