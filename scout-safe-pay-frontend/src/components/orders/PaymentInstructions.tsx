'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle, Clock, AlertCircle, CreditCard, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentInstructionsProps {
  transaction: {
    id: string;
    amount: number;
    currency: string;
    payment_reference: string;
    payment_deadline: string;
    bank_account_iban: string;
    bank_account_holder: string;
    bank_name: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
    };
  };
  onPaymentProofUpload?: () => void;
}

export default function PaymentInstructions({ transaction, onPaymentProofUpload }: PaymentInstructionsProps) {
  const t = useTranslations('PaymentInstructions');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const daysRemaining = () => {
    const deadline = new Date(transaction.payment_deadline);
    const now = new Date();
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const days = daysRemaining();
  const isUrgent = days <= 2;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} />
          <h1 className="text-2xl font-bold">Payment Instructions</h1>
        </div>
        <p className="text-orange-100">
          Complete your purchase of {transaction.vehicle.make} {transaction.vehicle.model} ({transaction.vehicle.year})
        </p>
      </div>

      {/* Deadline Warning */}
      <div className={`${isUrgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border-2 rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          {isUrgent ? (
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
          ) : (
            <Clock className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          )}
          <div>
            <h3 className={`font-semibold ${isUrgent ? 'text-red-900' : 'text-blue-900'}`}>
              {isUrgent ? '⚠️ Payment Deadline Approaching!' : 'Payment Deadline'}
            </h3>
            <p className={isUrgent ? 'text-red-800' : 'text-blue-800'}>
              Please complete your bank transfer within <strong>{days} days</strong>
              <br />
              Deadline: <strong>{new Date(transaction.payment_deadline).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Bank Transfer Details */}
      <div className="bg-white border-2 border-orange-500 rounded-lg overflow-hidden">
        <div className="bg-orange-500 text-white px-6 py-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building size={24} />
            Bank Transfer Details
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Amount to Transfer:</span>
              <span className="text-3xl font-bold text-orange-600">
                {transaction.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} {transaction.currency}
              </span>
            </div>
          </div>

          {/* IBAN */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 font-medium">IBAN:</span>
              <button
                onClick={() => copyToClipboard(transaction.bank_account_iban, 'iban')}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm"
              >
                {copiedField === 'iban' ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="text-lg font-mono font-semibold text-gray-900 break-all">
              {formatIBAN(transaction.bank_account_iban)}
            </div>
          </div>

          {/* Account Holder */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 font-medium">Account Holder:</span>
              <button
                onClick={() => copyToClipboard(transaction.bank_account_holder, 'holder')}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm"
              >
                {copiedField === 'holder' ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {transaction.bank_account_holder}
            </div>
          </div>

          {/* Bank Name */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <span className="text-gray-600 font-medium block mb-2">Bank:</span>
            <div className="text-lg font-semibold text-gray-900">
              {transaction.bank_name}
            </div>
          </div>

          {/* Payment Reference - CRITICAL */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <span className="text-yellow-900 font-bold block">IMPORTANT - Payment Reference:</span>
                <span className="text-yellow-800 text-sm">You MUST include this reference in your transfer!</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-white rounded p-3">
              <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                {transaction.payment_reference}
              </div>
              <button
                onClick={() => copyToClipboard(transaction.payment_reference, 'reference')}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {copiedField === 'reference' ? (
                  <>
                    <CheckCircle size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Reference
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 How to Make the Payment:</h3>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Log in to your online banking or mobile banking app</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Create a new bank transfer using the IBAN above</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Enter the exact amount: <strong>{transaction.amount.toFixed(2)} {transaction.currency}</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>
              In the "Description" or "Payment details" field, enter: <br />
              <strong className="text-orange-600 font-mono">{transaction.payment_reference}</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Confirm and submit the transfer</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
            <span>Your payment will be confirmed within 24 business hours</span>
          </li>
        </ol>
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">✅ What Happens Next?</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
            <span>After completing the transfer, our team will verify your payment</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
            <span>You'll receive an email confirmation with your invoice</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
            <span>The dealer will prepare your vehicle for delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
            <span>You'll be contacted to schedule pickup or delivery</span>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div className="bg-gray-50 border rounded-lg p-4 text-center">
        <p className="text-gray-600">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@autoscout24-safetrade.com" className="text-orange-600 hover:underline font-semibold">
            support@autoscout24-safetrade.com
          </a>
          {' '}or call{' '}
          <a href="tel:+40123456789" className="text-orange-600 hover:underline font-semibold">
            +40 123 456 789
          </a>
        </p>
      </div>
    </div>
  );
}
