'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UploadSignedContractProps {
  transactionId: string;
  contractUrl?: string;
  onUploadSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function UploadSignedContract({ 
  transactionId, 
  contractUrl,
  onUploadSuccess, 
  onError 
}: UploadSignedContractProps) {
  const t = useTranslations('UploadContract');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureType, setSignatureType] = useState<'physical' | 'electronic'>('physical');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile?.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (droppedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(droppedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('signed_contract', file);
      formData.append('signature_type', signatureType);

      const response = await fetch(`/api/orders/${transactionId}/upload-signed-contract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setUploadComplete(true);
      onUploadSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Contract Uploaded Successfully!</h2>
          <p className="text-green-800 mb-4">
            Your signed contract has been received. You will now receive payment instructions via email.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            View Payment Instructions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Upload size={32} />
          <h1 className="text-2xl font-bold">Upload Signed Contract</h1>
        </div>
        <p className="text-orange-100">
          Please sign and upload the contract to proceed with payment
        </p>
      </div>

      {/* Download Contract */}
      {contractUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900">Purchase Contract</h3>
                <p className="text-sm text-blue-700">Download, sign, and upload</p>
              </div>
            </div>
            <a
              href={contractUrl}
              download
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download Contract
            </a>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Instructions:</h3>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Download the contract using the button above</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Read the contract carefully</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Sign the contract (physically or electronically)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Scan or save as PDF if signed physically</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Upload the signed PDF below</span>
          </li>
        </ol>
      </div>

      {/* Signature Type Selection */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Signature Type:</h3>
        <div className="flex gap-4">
          <label className="flex-1">
            <input
              type="radio"
              name="signatureType"
              value="physical"
              checked={signatureType === 'physical'}
              onChange={(e) => setSignatureType(e.target.value as 'physical')}
              className="mr-2"
            />
            <span className="text-gray-700">Physical Signature (scanned)</span>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              name="signatureType"
              value="electronic"
              checked={signatureType === 'electronic'}
              onChange={(e) => setSignatureType(e.target.value as 'electronic')}
              className="mr-2"
            />
            <span className="text-gray-700">Electronic Signature</span>
          </label>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="contract-upload"
        />

        {!file ? (
          <>
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Signed Contract
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your PDF here, or click to browse
            </p>
            <label
              htmlFor="contract-upload"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            <p className="text-sm text-gray-500 mt-3">
              PDF only, max 10MB
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileText className="text-green-600" size={32} />
              <div className="text-left">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="ml-4 text-red-600 hover:text-red-700"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && !error && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </span>
          ) : (
            'Upload Signed Contract'
          )}
        </button>
      )}

      {/* Legal Notice */}
      <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Legal Notice:</strong> By uploading this signed contract, you confirm that:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>You have read and understood all contract terms</li>
          <li>The signature is legally binding</li>
          <li>All information provided is accurate</li>
          <li>You agree to proceed with the purchase under these terms</li>
        </ul>
      </div>
    </div>
  );
}
