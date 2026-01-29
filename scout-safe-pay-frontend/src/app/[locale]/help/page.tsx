'use client';

import { useTranslations } from 'next-intl';

export default function HelpCenter() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 border rounded-lg text-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                  <h3 className="font-semibold text-gray-900">Getting Started</h3>
                  <p className="text-gray-600 text-sm mt-2">Learn the basics of AutoScout SafePay</p>
                </a>
                <a href="#" className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition duration-200">
                  <h3 className="font-semibold text-gray-900">Buying Vehicles</h3>
                  <p className="text-gray-600 text-sm mt-2">Tips for finding and purchasing vehicles</p>
                </a>
                <a href="#" className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 transition duration-200">
                  <h3 className="font-semibold text-gray-900">Selling Vehicles</h3>
                  <p className="text-gray-600 text-sm mt-2">How to list and manage your vehicles</p>
                </a>
                <a href="#" className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition duration-200">
                  <h3 className="font-semibold text-gray-900">Payments & Security</h3>
                  <p className="text-gray-600 text-sm mt-2">Safe and secure payment options</p>
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group border rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">How do I create an account?</summary>
                  <p className="text-gray-600 mt-2 text-sm">Visit the registration page and fill in your details...</p>
                </details>
                <details className="group border rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">What payment methods are accepted?</summary>
                  <p className="text-gray-600 mt-2 text-sm">We accept credit cards, bank transfers, and digital wallets...</p>
                </details>
                <details className="group border rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">How long does shipping take?</summary>
                  <p className="text-gray-600 mt-2 text-sm">Delivery timelines vary based on location...</p>
                </details>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Still need help?</h3>
            <p className="text-gray-600 mb-6">Contact our support team</p>
            <a href="/support" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
