'use client';

import { useState } from 'react';
import { 
  Search, Shield, DollarSign, FileCheck, Truck, CheckCircle,
  AlertCircle, Info, ChevronRight, Phone, Mail, Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    number: 1,
    title: 'Browse & Search',
    icon: Search,
    description: 'Find your perfect vehicle using our advanced search filters',
    details: [
      'Search by make, model, price range, and more',
      'View detailed photos and specifications',
      'Compare multiple vehicles side-by-side',
      'Check vehicle history reports',
    ],
    tips: [
      'Set up price alerts for your dream car',
      'Save favorites to compare later',
      'Read seller ratings and reviews',
    ],
  },
  {
    number: 2,
    title: 'Contact Seller',
    icon: Phone,
    description: 'Get in touch with the seller and arrange a viewing',
    details: [
      'Send message directly through the platform',
      'Schedule a test drive appointment',
      'Ask questions about the vehicle',
      'Request additional photos or videos',
    ],
    tips: [
      'Always meet in a safe, public location',
      'Bring a knowledgeable friend or mechanic',
      'Test drive in various conditions',
    ],
  },
  {
    number: 3,
    title: 'Secure Payment',
    icon: Shield,
    description: 'Make a safe payment through our SafeTrade escrow system',
    details: [
      'Funds are held securely in escrow',
      'Multiple payment methods accepted',
      'Buyer and seller protection included',
      '24/7 transaction monitoring',
    ],
    tips: [
      'Never pay outside the platform',
      'All payments are encrypted and secure',
      'Full refund if vehicle doesn\'t match description',
    ],
  },
  {
    number: 4,
    title: 'Inspection & Verification',
    icon: FileCheck,
    description: 'Optional professional inspection for peace of mind',
    details: [
      'Certified mechanic inspection available',
      'Complete vehicle history check',
      'Documentation verification',
      'Test all features and systems',
    ],
    tips: [
      'Inspection report available within 24h',
      'Can negotiate price based on findings',
      'All inspections are independent',
    ],
  },
  {
    number: 5,
    title: 'Delivery & Transfer',
    icon: Truck,
    description: 'Receive your vehicle and complete ownership transfer',
    details: [
      'Free delivery within 50km (optional)',
      'Sign purchase agreement',
      'Transfer registration documents',
      'Receive all keys and documents',
    ],
    tips: [
      'Check all documents before signing',
      'Take photos of the vehicle condition',
      'Get insurance before driving away',
    ],
  },
  {
    number: 6,
    title: 'Release Payment',
    icon: CheckCircle,
    description: 'Confirm receipt and release funds to seller',
    details: [
      'Inspect vehicle thoroughly',
      'Verify all features work correctly',
      'Confirm all documents received',
      'Release payment through platform',
    ],
    tips: [
      'You have 48h inspection period',
      'Can request repair or refund if issues found',
      'Leave a review after completion',
    ],
  },
];

const faqs = [
  {
    question: 'How does the SafeTrade escrow system work?',
    answer: 'When you make a payment, your funds are held securely in our escrow account. The seller only receives payment after you confirm that the vehicle matches the description and you\'re satisfied with your purchase. This protects both buyers and sellers.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept bank transfers, credit cards, and SEPA payments. All transactions are processed through secure, encrypted channels and comply with EU banking regulations.',
  },
  {
    question: 'Can I get a refund if the vehicle doesn\'t match the listing?',
    answer: 'Yes! If the vehicle significantly differs from the description, or has undisclosed issues, you can request a full refund within the 48-hour inspection period. Our team will review the case and mediate if necessary.',
  },
  {
    question: 'Is vehicle inspection mandatory?',
    answer: 'No, professional inspection is optional but highly recommended. Our certified mechanics can provide a detailed report for €150-300 depending on the vehicle type. This can save you thousands in potential repair costs.',
  },
  {
    question: 'What documents do I need?',
    answer: 'You\'ll need a valid ID, proof of address, and payment method. For registration transfer, you\'ll also need proof of insurance and residency documentation as required by your local authorities.',
  },
  {
    question: 'How long does the entire process take?',
    answer: 'From initial contact to vehicle delivery, the process typically takes 3-7 days. Private sales are usually faster (3-5 days) while dealer sales might take up to 7 days due to additional paperwork.',
  },
];

export default function PurchaseGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-sm font-semibold">
          Buyer's Guide
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          How to Buy a Vehicle Safely
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Follow our step-by-step guide to purchase your next vehicle with confidence and complete protection
        </p>
      </div>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-2 border-blue-200">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  100% Secure Payments
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your money is protected in escrow until you confirm delivery
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Verified Sellers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All sellers are ID-verified and rated by previous buyers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Money-Back Guarantee
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  48-hour inspection period with full refund option
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Step-by-Step Process */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          6 Simple Steps to Your New Vehicle
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.number;
              
              return (
                <Card
                  key={step.number}
                  className={`
                    cursor-pointer transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 shadow-lg scale-105' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200'
                    }
                  `}
                  onClick={() => setActiveStep(step.number)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                        ${isActive 
                          ? 'bg-blue-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                        }
                      `}>
                        <span className={`
                          font-bold text-lg
                          ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}
                        `}>
                          {step.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Step Details */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 sticky top-24 h-fit">
            <div className="p-8 space-y-6">
              {steps.filter(s => s.number === activeStep).map((step) => {
                const Icon = step.icon;
                
                return (
                  <div key={step.number} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2">Step {step.number} of 6</Badge>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {step.description}
                    </p>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        What Happens
                      </h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                            <span className="text-yellow-600">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      {activeStep > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveStep(activeStep - 1)}
                          className="flex-1"
                        >
                          Previous Step
                        </Button>
                      )}
                      {activeStep < 6 && (
                        <Button
                          onClick={() => setActiveStep(activeStep + 1)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Next Step
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know about buying vehicles on our platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                    {faq.question}
                  </h3>
                  <ChevronRight className={`
                    h-5 w-5 text-gray-400 transition-transform
                    ${expandedFaq === idx ? 'rotate-90' : ''}
                  `} />
                </div>
                {expandedFaq === idx && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
        <div className="p-12 text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Browse thousands of verified listings with complete buyer protection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8"
            >
              <Search className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
