'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle, Upload, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function TransactionPaymentPage() {
  const [copied, setCopied] = useState(false)

  const paymentDetails = {
    accountHolder: 'AutoScout24 Escrow Services',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    bank: 'AutoScout24 GmbH',
    reference: 'AS24-TXN-2026-001234',
    amount: '€16,102.00',
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
        <p className="mt-2 text-gray-600">Transaction #{paymentDetails.reference}</p>
      </div>

      <Card className="border-teal-200 bg-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            Payment Instructions
          </CardTitle>
          <CardDescription>
            Make a bank transfer using the details below. Include the reference number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white rounded-lg">
            <div>
              <p className="text-sm text-gray-600">IBAN</p>
              <p className="text-lg font-mono font-semibold">{paymentDetails.iban}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(paymentDetails.iban)}>
              {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-teal-300">
            <div>
              <p className="text-sm text-teal-600 font-semibold">Reference (REQUIRED)</p>
              <p className="text-xl font-mono font-bold text-teal-700">{paymentDetails.reference}</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" size="sm" onClick={() => copyToClipboard(paymentDetails.reference)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-3xl font-bold text-teal-600">{paymentDetails.amount}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Payment Confirmation</CardTitle>
          <CardDescription>Upload screenshot or PDF of your bank transfer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
