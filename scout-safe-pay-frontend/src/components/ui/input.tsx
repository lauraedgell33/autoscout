'use client';

import React, { useId, useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  success?: boolean;
  successMessage?: string;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    success,
    successMessage,
    showPasswordToggle,
    id,
    disabled,
    required,
    type,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const successId = `${inputId}-success`;
    
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Build aria-describedby
    const describedByParts: string[] = [];
    if (error) describedByParts.push(errorId);
    if (successMessage && hasSuccess) describedByParts.push(successId);
    if (helperText && !error && !hasSuccess) describedByParts.push(helperId);
    const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

    const inputClasses = `
      w-full px-4 py-2.5 
      border-2 rounded-xl 
      bg-white
      text-gray-900
      placeholder:text-gray-400
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
      min-h-[44px]
      ${hasError 
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
        : hasSuccess
        ? 'border-green-400 focus:border-green-500 focus:ring-green-200 bg-green-50'
        : isFocused
        ? 'border-primary-500 focus:ring-primary-200'
        : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-primary-200'
      }
      ${leftIcon ? 'pl-11' : ''}
      ${rightIcon || hasError || hasSuccess || (isPassword && showPasswordToggle) ? 'pr-11' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
            {required && <span className="sr-only"> (required)</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={ariaDescribedBy}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            {hasError && !isPassword && (
              <AlertCircle 
                className="text-red-500" 
                size={20}
                aria-hidden="true"
              />
            )}
            {hasSuccess && !isPassword && (
              <CheckCircle 
                className="text-green-500" 
                size={20}
                aria-hidden="true"
              />
            )}
            {rightIcon && !hasError && !hasSuccess && !isPassword && (
              <span className="text-gray-400" aria-hidden="true">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p 
            id={errorId}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5 animate-fadeIn"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={14} className="flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {/* Success message */}
        {successMessage && hasSuccess && (
          <p 
            id={successId}
            className="mt-1.5 text-sm text-green-600 flex items-center gap-1.5 animate-fadeIn"
            role="status"
          >
            <CheckCircle size={14} className="flex-shrink-0" aria-hidden="true" />
            {successMessage}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && !hasSuccess && (
          <p 
            id={helperId}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
