'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CheckCircle, Download, Home, Eye } from 'lucide-react';
import { transactionService } from '@/lib/api/transactions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [transaction, setTransaction] = useState<any>(null);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactionId = new URLSearchParams(window.location.search).get('transaction_id');
    if (transactionId) {
      fetchTransactionDetails(transactionId);
    }
  }, []);

  const fetchTransactionDetails = async (id: string) => {
    try {
      const data = await transactionService.get(id);
      setTransaction(data);
      // Bank details would be included in the response
      setBankDetails({
        account_holder: 'AutoScout SafePay',
        iban: 'DE89370400440532013000',
        bic_swift: 'COBADEFFXXX',
        bank_name: 'Commerzbank',
        reference: `REF-${id.slice(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInstructions = () => {
    const instructions = `
Payment Instructions
Transaction ID: ${transaction?.id}
Amount: €${transaction?.amount}

Bank Transfer Details:
Account Holder: ${bankDetails?.account_holder}
IBAN: ${bankDetails?.iban}
BIC/SWIFT: ${bankDetails?.bic_swift}
Bank: ${bankDetails?.bank_name}
Reference: ${bankDetails?.reference}

IMPORTANT: Please include the reference number in your transfer!
    `;
    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-instructions.txt';
    a.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Purchase Initiated Successfully!
              </h1>
              <p className="text-green-100 text-sm sm:text-base">
                Complete your bank transfer to secure the vehicle
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Bank Transfer Details */}
      <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Bank Transfer Instructions</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Holder</p>
              <p className="font-medium">{bankDetails?.account_holder}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p className="font-medium text-xl text-primary-600">€{parseFloat(transaction?.amount || '0').toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">IBAN</p>
              <p className="font-mono text-sm">{bankDetails?.iban}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">BIC/SWIFT</p>
              <p className="font-mono text-sm">{bankDetails?.bic_swift}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bank Name</p>
              <p className="font-medium">{bankDetails?.bank_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
              <p className="font-mono text-sm font-bold text-red-600">{bankDetails?.reference}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ IMPORTANT: Always include the reference number "{bankDetails?.reference}" in your transfer!
          </p>
        </div>

        <Button 
          onClick={downloadInstructions} 
          variant="outline" 
          className="w-full mt-4 rounded-xl border-2"
        >
          <Download className="h-4 w-4 mr-2" />Download Instructions
        </Button>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">What Happens Next?</h3>
        <ol className="space-y-3">
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
            <div>
              <p className="font-medium">Complete the bank transfer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transfer the amount to the provided bank details</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
            <div>
              <p className="font-medium">Upload receipt (optional)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Speed up verification by uploading proof of transfer</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
            <div>
              <p className="font-medium">We verify the payment</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usually within 1-2 business days</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">4</span>
            <div>
              <p className="font-medium">Schedule vehicle inspection</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Arrange a time to inspect the vehicle</p>
            </div>
          </li>
        </ol>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/${locale}/transaction/${transaction?.id}`} className="flex-1">
          <Button variant="outline" className="w-full rounded-xl border-2">
            <Eye className="h-4 w-4 mr-2" />View Transaction
          </Button>
        </Link>
        <Link href={`/${locale}/marketplace`} className="flex-1">
          <Button variant="outline" className="w-full rounded-xl border-2">
            <Home className="h-4 w-4 mr-2" />Back to Marketplace
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}
