'use client';

import { useTranslations } from 'next-intl';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 mb-12">
            Find answers to common questions about our platform and services.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                <div className="flex items-center justify-between p-6">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  <ChevronDown 
                    className={`transition-transform ${expanded === index ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </div>
                {expanded === index && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our support team is here to help. Contact us anytime.
              </p>
              <a 
                href="/contact"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
