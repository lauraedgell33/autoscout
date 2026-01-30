'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'accent';
  fullscreen?: boolean;
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  fullscreen = false,
  className,
  label,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const variantClasses = {
    primary: 'border-primary-200 border-t-primary-900',
    secondary: 'border-gray-200 border-t-gray-900',
    white: 'border-white/20 border-t-white',
    accent: 'border-accent-200 border-t-accent-500',
  };

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={label || 'Loading'}
    >
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Loading"
      >
        {spinner}
        {label && (
          <p className="mt-4 text-sm font-medium text-gray-700">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
}

// Inline spinner for buttons
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default LoadingSpinner;
