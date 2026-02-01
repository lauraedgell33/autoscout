'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, CheckCircle, Clock, AlertTriangle, Building2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentInstructionsProps {
  transaction: any;
  onPaymentProofUpload?: () => Promise<void>;
}

export default function PaymentInstructions({
  transaction,
  onPaymentProofUpload,
}: PaymentInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const downloadInstructions = () => {
    const instructions = `
BANK TRANSFER PAYMENT INSTRUCTIONS
Transaction: ${transaction.transaction_code}
Amount: €${parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}

BANK DETAILS:
Account Holder: ${transaction.bank_account_holder || 'AutoScout24 SafePay Escrow'}
IBAN: ${transaction.bank_account_iban || transaction.escrow_account_iban || 'Not available'}
BIC/SWIFT: ${transaction.bank_bic_swift || 'Not available'}
Bank Name: ${transaction.bank_name || 'Commerzbank AG'}

PAYMENT REFERENCE (REQUIRED):
${transaction.payment_reference}

⚠️ IMPORTANT: 
- Always include the payment reference in your transfer
- Payment must be made within the deadline
- Contact support if you have any questions

Transaction Date: ${new Date(transaction.created_at).toLocaleDateString()}
    `.trim();

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-instructions-${transaction.transaction_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Instructions downloaded!');
  };

  const getDeadlineInfo = () => {
    if (!transaction.payment_deadline) return null;
    
    const deadline = new Date(transaction.payment_deadline);
    const now = new Date();
    const hoursLeft = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 0) {
      return { expired: true, text: 'Payment deadline expired', color: 'red' };
    } else if (hoursLeft < 24) {
      return { expired: false, text: `${hoursLeft} hours left`, color: 'orange' };
    } else {
      const daysLeft = Math.floor(hoursLeft / 24);
      return { expired: false, text: `${daysLeft} days left`, color: 'green' };
    }
  };

  const deadlineInfo = getDeadlineInfo();
  const iban = transaction.bank_account_iban || transaction.escrow_account_iban;
  const bic = transaction.bank_bic_swift || 'COBADEFFXXX';
  const bankName = transaction.bank_name || 'Commerzbank AG';
  const accountHolder = transaction.bank_account_holder || 'AutoScout24 SafePay Escrow';

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Bank Transfer Instructions
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Complete your payment via bank transfer to secure the vehicle
            </p>
          </div>
          {deadlineInfo && (
            <Badge className={`
              ${deadlineInfo.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' : ''}
              ${deadlineInfo.color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
              ${deadlineInfo.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' : ''}
            `}>
              <Clock className="w-3 h-3 mr-1" />
              {deadlineInfo.text}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Amount to Transfer */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Transfer</p>
              <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                €{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Bank Account Details</h4>
          
          {/* Account Holder */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Account Holder</p>
              <p className="font-medium text-gray-900 dark:text-white">{accountHolder}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(accountHolder, 'Account Holder')}
              className="ml-2"
            >
              {copied === 'Account Holder' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* IBAN */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">IBAN</p>
              <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">{iban}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(iban, 'IBAN')}
              className="ml-2"
            >
              {copied === 'IBAN' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* BIC/SWIFT */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">BIC/SWIFT Code</p>
              <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">{bic}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bic, 'BIC/SWIFT')}
              className="ml-2"
            >
              {copied === 'BIC/SWIFT' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Bank Name */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Bank Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{bankName}</p>
          </div>
        </div>

        {/* Payment Reference - CRITICAL */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                ⚠️ IMPORTANT: Payment Reference Required
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Always include this reference in your bank transfer. Without it, we cannot automatically verify your payment.
              </p>
              <div className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Reference</p>
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                    {transaction.payment_reference}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(transaction.payment_reference, 'Payment Reference')}
                  className="ml-2 border-yellow-300 hover:bg-yellow-100"
                >
                  {copied === 'Payment Reference' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Instructions */}
        <Button
          onClick={downloadInstructions}
          variant="outline"
          className="w-full rounded-xl border-2"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Instructions (TXT)
        </Button>

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Next Steps:</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary-600 dark:text-primary-400">1.</span>
              <span>Open your online banking or banking app</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary-600 dark:text-primary-400">2.</span>
              <span>Create a new transfer with the bank details above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary-600 dark:text-primary-400">3.</span>
              <span>Include the payment reference in the transfer description</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary-600 dark:text-primary-400">4.</span>
              <span>Submit the transfer (processing time: 1-2 business days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary-600 dark:text-primary-400">5.</span>
              <span>We'll notify you once payment is confirmed</span>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
