'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  preview?: boolean;
}

interface FileState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({
  onFilesChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  preview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB limit`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    const totalFiles = files.length + fileArray.length;

    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validatedFiles = fileArray.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
      error: validateFile(file),
    }));

    setFiles((prev) => [...prev, ...validatedFiles]);
    onFilesChange?.([...files.map((f) => f.file), ...fileArray]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    onFilesChange?.(files.filter((_, i) => i !== index).map((f) => f.file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ backgroundColor: isDragging ? '#f0f9ff' : '#ffffff' }}
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition cursor-pointer"
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
          aria-label="File upload input"
        />

        <Upload
          size={32}
          className="mx-auto mb-2 text-gray-400"
        />
        <p className="text-sm font-medium text-gray-700">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxFiles} files, {(maxSize / 1024 / 1024).toFixed(2)}MB each
        </p>
      </motion.div>

      {/* Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((fileState, index) => (
              <motion.div
                key={`${fileState.file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  {preview && fileState.file.type.startsWith('image/') ? (
                    <img
                      src={getFileIcon(fileState.file) || ''}
                      alt={fileState.file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                      {fileState.file.name.split('.').pop()?.toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileState.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileState.file.size / 1024).toFixed(2)} KB
                    </p>

                    {fileState.status === 'uploading' && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fileState.progress}%` }}
                          className="h-full bg-as24-blue rounded-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {fileState.error && (
                      <AlertCircle size={18} className="text-red-500" />
                    )}
                    {fileState.status === 'success' && (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2 p-1 hover:bg-gray-200 rounded-lg transition"
                  aria-label="Remove file"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;
