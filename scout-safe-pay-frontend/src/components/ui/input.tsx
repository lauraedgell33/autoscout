'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    id,
    disabled,
    required,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    
    const hasError = !!error;

    const inputClasses = `
      w-full px-4 py-2.5 
      border rounded-lg 
      bg-white
      text-[var(--color-gray-900)]
      placeholder:text-[var(--color-gray-400)]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-gray-100)]
      min-h-[44px]
      ${hasError 
        ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]' 
        : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
      }
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon || hasError ? 'pr-10' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-gray-700)] mb-1.5"
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
          
          {(rightIcon || hasError) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError ? (
                <AlertCircle 
                  className="text-[var(--color-error)]" 
                  size={20}
                  aria-hidden="true"
                />
              ) : (
                <span className="text-[var(--color-gray-400)]">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {error && (
          <p 
            id={errorId}
            className="mt-1.5 text-sm text-[var(--color-error)] flex items-center gap-1"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p 
            id={helperId}
            className="mt-1.5 text-sm text-[var(--color-gray-500)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
