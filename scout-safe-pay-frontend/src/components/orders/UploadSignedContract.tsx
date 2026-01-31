'use client';

import React, { useState } from 'react';

interface UploadSignedContractProps {
  transactionId?: string;
  contractUrl?: string;
  onUploadSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function UploadSignedContract({
  transactionId,
  contractUrl,
  onUploadSuccess,
  onError,
}: UploadSignedContractProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <h3 className="font-bold text-lg mb-4">Upload Signed Contract</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
        id="contract-upload"
      />
      <label htmlFor="contract-upload" className="cursor-pointer text-primary-600 hover:text-primary-700">
        Click to upload or drag and drop
      </label>
      {file && <p className="mt-4 text-green-600">✓ {file.name}</p>}
    </div>
  );
}
