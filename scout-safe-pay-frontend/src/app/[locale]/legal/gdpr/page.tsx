'use client';

import { useTranslations } from 'next-intl';

export default function GDPRConsent() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">GDPR Consent & Privacy</h1>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection Rights</h2>
            <p className="text-gray-700 mb-6">
              Under the General Data Protection Regulation (GDPR), you have rights regarding your personal data:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>Right to Access:</strong> You can request a copy of your personal data.</li>
              <li><strong>Right to Rectification:</strong> You can correct inaccurate personal data.</li>
              <li><strong>Right to Erasure:</strong> You can request deletion of your data under certain conditions.</li>
              <li><strong>Right to Data Portability:</strong> You can receive your data in a portable format.</li>
              <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              For any GDPR-related requests, please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="font-semibold text-gray-900">Data Protection Officer</p>
              <p className="text-gray-700">Email: dpo@autoscout.dev</p>
              <p className="text-gray-700">Address: Strada Exemplu, Nr. 123, București, România</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-gray-700">I consent to marketing communications</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-gray-700">I consent to analytics and tracking</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-gray-700">I consent to third-party data sharing</span>
              </label>
            </div>

            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
