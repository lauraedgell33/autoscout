'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const t = useTranslations();
  const [expanded, setExpanded] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is AutoScout24 SafeTrade?',
      answer: 'AutoScout24 SafeTrade is a secure vehicle marketplace that provides escrow protection for buyers and sellers, ensuring safe and reliable vehicle transactions.',
    },
    {
      question: 'How does the escrow service work?',
      answer: 'When you purchase a vehicle, funds are held securely by our escrow service until you confirm receipt and satisfaction with the vehicle. Only then are funds released to the seller.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-leading encryption and security measures to protect your personal and financial information.',
    },
    {
      question: 'How long does payment take to reach the seller?',
      answer: 'Payment is released to the seller within 5 business days after you confirm the vehicle delivery.',
    },
    {
      question: 'Can I cancel a transaction?',
      answer: 'You can cancel a transaction during the verification phase. After payment is confirmed, please contact our support team.',
    },
    {
      question: 'What happens if there\'s a dispute?',
      answer: 'Our dispute resolution team investigates both sides and makes a fair decision based on evidence and our terms.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Find answers to common questions about our platform and services.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-md transition-all rounded-2xl border border-gray-100"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <div className="flex items-center justify-between p-4 sm:p-5">
                <CardTitle className="text-sm sm:text-base font-semibold pr-4">{faq.question}</CardTitle>
                <ChevronDown 
                  className={`flex-shrink-0 text-gray-400 transition-transform ${expanded === index ? 'rotate-180' : ''}`}
                  size={18}
                />
              </div>
              {expanded === index && (
                <CardContent className="pt-0 pb-4 sm:pb-5 px-4 sm:px-5">
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-primary-50 border-primary-100 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Our support team is here to help. Contact us anytime.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-5 py-2.5 bg-primary-900 hover:bg-primary-950 text-white text-sm font-semibold rounded-xl transition"
            >
              Contact Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
