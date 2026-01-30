'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  showValidationIcon?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      leftIcon,
      rightIcon,
      className,
      inputSize = 'md',
      variant = 'default',
      showValidationIcon = true,
      type = 'text',
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    // Use React 18+ useId for unique IDs if available, fallback to random
    const inputId = id || `input-${React.useId?.() || Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const variantClasses = {
      default: cn(
        'border border-gray-300 bg-white',
        error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
        success && 'border-success-500 focus:border-success-500 focus:ring-success-500',
        !error && !success && 'focus:border-primary-500 focus:ring-primary-500'
      ),
      filled: cn(
        'border-0 bg-gray-100',
        error && 'bg-error-50 focus:bg-error-50',
        success && 'bg-success-50 focus:bg-success-50',
        !error && !success && 'focus:bg-gray-50'
      ),
      outlined: cn(
        'border-2 border-gray-300 bg-transparent',
        error && 'border-error-500 focus:border-error-600',
        success && 'border-success-500 focus:border-success-600',
        !error && !success && 'focus:border-primary-600'
      ),
    };

    const ValidationIcon = () => {
      if (!showValidationIcon) return null;
      
      if (error) {
        return (
          <AlertCircle 
            className="w-5 h-5 text-error-500" 
            aria-hidden="true"
          />
        );
      }
      
      if (success) {
        return (
          <CheckCircle2 
            className="w-5 h-5 text-success-500" 
            aria-hidden="true"
          />
        );
      }
      
      return null;
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2 transition-colors',
              error ? 'text-error-700' : 'text-gray-700',
              disabled && 'text-gray-400',
              isFocused && !error && 'text-primary-700'
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
              'placeholder:text-gray-400',
              sizeClasses[inputSize],
              variantClasses[variant],
              leftIcon && 'pl-10',
              (rightIcon || showValidationIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right Icons Container */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Validation Icon */}
            <ValidationIcon />

            {/* Password Toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            )}

            {/* Right Icon */}
            {rightIcon && !showValidationIcon && !isPassword && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id={`${inputId}-error`}
            className="mt-2 text-sm text-error-600 flex items-start gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
