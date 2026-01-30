'use client';

/**
 * Bank Transfer Payment Form Component
 * Handles bank transfer payment initiation and verification
 * EU Compliant - No third-party payment processors
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Copy,
  Check,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useNotification } from '@/components/providers/NotificationProvider';

interface BankTransferPaymentFormProps {
  transactionId: string;
  amount: number;
  currency?: string;
  sellerName?: string;
  sellerIBAN?: string;
  sellerBIC?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function BankTransferPaymentForm({
  transactionId,
  amount,
  currency = 'EUR',
  sellerName,
  sellerIBAN,
  sellerBIC,
  onSuccess,
  onError,
  disabled = false,
}: BankTransferPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { success, error: showError } = useNotification();

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(amount / 100);

  const reference = `AST-${transactionId.substring(0, 8).toUpperCase()}`;

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showError('Only PDF, JPG, and PNG files are accepted', {
          title: 'Invalid File',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB', { title: 'File Too Large' });
        return;
      }

      setProofFile(file);
    }
  };

  // Submit payment proof
  const handleSubmitProof = async () => {
    if (!proofFile) {
      showError('Please select a payment proof file', {
        title: 'Missing File',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('transactionId', transactionId);
      formData.append('proof', proofFile);

      const response = await fetch('/api/payments/verify-transfer', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment proof');
      }

      const data = await response.json();

      setSubmitted(true);
      success('Payment proof submitted successfully. Awaiting seller confirmation.');
      onSuccess?.(transactionId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit payment proof';
      showError(message, { title: 'Submission Error' });
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Check size={24} className="text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">
            Payment Proof Submitted
          </h3>
        </div>
        <p className="text-green-800 mb-4">
          Your payment proof has been submitted successfully. The seller will confirm
          receipt of the funds and the transaction will be completed.
        </p>
        <p className="text-sm text-green-700">
          Transaction ID: <strong>{transactionId}</strong>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 border border-gray-200">
      {/* Bank Transfer Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="flex-shrink-0 text-blue-600 mt-0.5" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Bank Transfer Required</p>
            <p>
              Please complete a bank transfer to the seller's account using the details below.
              Upload proof of payment once the transfer is complete.
            </p>
          </div>
        </div>
      </div>

      {/* Amount Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-as24-blue to-as24-blue/80 rounded-lg p-6 text-white"
      >
        <p className="text-sm opacity-90 mb-2">Amount to Transfer</p>
        <h2 className="text-4xl font-bold mb-4">{formattedAmount}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Reference</p>
            <p className="font-mono font-semibold">{reference}</p>
          </div>
          <div>
            <p className="opacity-80">Currency</p>
            <p className="font-semibold">{currency}</p>
          </div>
        </div>
      </motion.div>

      {/* Seller Bank Details */}
      {sellerIBAN && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-gray-200 rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={20} className="text-as24-blue" />
            <h3 className="font-semibold text-gray-900">Seller Bank Details</h3>
          </div>

          {/* Account Holder */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Account Holder
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-gray-900">{sellerName || 'N/A'}</span>
              <button
                onClick={() =>
                  copyToClipboard(sellerName || '', 'holder')
                }
                className="text-gray-400 hover:text-gray-600"
              >
                {copied === 'holder' ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          {/* IBAN */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              IBAN
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-gray-900 break-all">{sellerIBAN}</span>
              <button
                onClick={() => copyToClipboard(sellerIBAN, 'iban')}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
              >
                {copied === 'iban' ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          {/* BIC */}
          {sellerBIC && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                BIC/SWIFT
              </label>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-mono text-gray-900">{sellerBIC}</span>
                <button
                  onClick={() => copyToClipboard(sellerBIC, 'bic')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {copied === 'bic' ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reference */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Payment Reference
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-gray-900 font-semibold">{reference}</span>
              <button
                onClick={() => copyToClipboard(reference, 'reference')}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied === 'reference' ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Payment Proof */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6"
      >
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Upload Proof of Payment
          </p>
          <p className="text-xs text-gray-600 mb-4">
            Bank confirmation, screenshot, or receipt (PDF, JPG, PNG - max 5MB)
          </p>

          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={disabled || loading}
              className="hidden"
            />
            <span className="inline-block px-4 py-2 bg-as24-blue text-white rounded-lg hover:bg-as24-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition">
              {proofFile ? 'Change File' : 'Select File'}
            </span>
          </label>

          {proofFile && (
            <div className="mt-3 text-sm text-green-600 font-medium">
              ✓ {proofFile.name}
            </div>
          )}
        </div>
      </motion.div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitProof}
        disabled={!proofFile || loading || disabled}
        className="w-full py-3 bg-as24-blue text-white rounded-lg hover:bg-as24-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Check size={18} />
            Submit Payment Proof
          </>
        )}
      </button>

      {/* Legal Notice */}
      <p className="text-xs text-gray-600 text-center">
        This payment system complies with European regulations. Your transaction is
        protected by escrow service until both parties confirm completion.
      </p>
    </div>
  );
}

export default BankTransferPaymentForm;
