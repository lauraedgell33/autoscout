'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadSignedContractProps {
  transactionId: string;
  contractUrl?: string;
  signedContractUrl?: string;
  onUploadSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function UploadSignedContract({
  transactionId,
  contractUrl,
  signedContractUrl,
  onUploadSuccess,
  onError,
}: UploadSignedContractProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('signed_contract', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${transactionId}/upload-signed-contract`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      toast.success('Signed contract uploaded successfully!');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset file after successful upload
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload contract');
      if (onError) {
        onError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          Upload Signed Contract
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Download the contract, sign it, and upload the signed version
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Contract Download Section */}
        {contractUrl && !signedContractUrl && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                  Step 1: Download Contract
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Download, review, and sign the contract before uploading it back.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(contractUrl, '_blank')}
                  className="rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Contract
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Already Uploaded */}
        {signedContractUrl ? (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  ✓ Signed Contract Uploaded
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Your signed contract has been successfully uploaded and is being reviewed.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(signedContractUrl, '_blank')}
                  className="border-green-300 hover:bg-green-100 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Uploaded Contract
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all
                ${dragActive 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                }
                ${file ? 'bg-gray-50 dark:bg-gray-800' : ''}
              `}
            >
              {!file ? (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Drag and drop your signed contract here
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    PDF only, max 5MB
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    disabled={uploading}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Upload Button */}
            {file && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Signed Contract
                  </>
                )}
              </Button>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                    How to sign the contract:
                  </p>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Download the contract PDF</li>
                    <li>Print it or use a digital signature tool</li>
                    <li>Sign in the designated fields</li>
                    <li>Scan or save as PDF</li>
                    <li>Upload the signed version here</li>
                  </ol>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
// Force rebuild
