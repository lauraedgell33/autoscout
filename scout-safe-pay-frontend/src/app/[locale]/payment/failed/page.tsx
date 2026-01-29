'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentFailedPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Unknown error occurred';
  const transactionId = searchParams.get('transaction_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-red-200">
        <CardHeader className="text-center bg-gradient-to-r from-red-500 to-red-600 text-white py-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <XCircle className="w-16 h-16" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Payment Failed</CardTitle>
          <p className="text-red-100 mt-2">We couldn't process your payment</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Error Message */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Error Details</h3>
                  <p className="text-red-700">{reason}</p>
                  {transactionId && (
                    <p className="text-sm text-red-600 mt-2">
                      Transaction ID: <code className="bg-red-100 px-2 py-1 rounded">{transactionId}</code>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Common Reasons for Payment Failure
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Card expired or invalid card details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Bank declined the transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Payment timeout or network error</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => router.back()}
                className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/${params.locale}/support/help`)}
                className="flex-1 h-14 border-2 text-lg"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Get Help
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                variant="link"
                onClick={() => router.push(`/${params.locale}`)}
                className="text-gray-600"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
