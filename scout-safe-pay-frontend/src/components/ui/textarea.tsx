'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { useId, useState, useCallback } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display */
  error?: string;
  /** Helper text to display below the textarea */
  helperText?: string;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether the textarea has a success state */
  success?: boolean;
  /** Label for the textarea */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error, 
    helperText, 
    showCharacterCount = false,
    success = false,
    label,
    required,
    maxLength,
    id: providedId,
    onChange,
    value,
    defaultValue,
    'aria-describedby': ariaDescribedBy,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const countId = `${id}-count`;
    
    const [charCount, setCharCount] = useState(() => {
      const initialValue = value || defaultValue || '';
      return typeof initialValue === 'string' ? initialValue.length : 0;
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    }, [onChange]);

    // Build aria-describedby
    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (error) describedByParts.push(errorId);
    if (helperText && !error) describedByParts.push(helperId);
    if (showCharacterCount && maxLength) describedByParts.push(countId);
    const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {required && (
              <>
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          id={id}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            `flex min-h-[120px] w-full rounded-xl 
            border-2 bg-gray-50 dark:bg-gray-800
            px-4 py-3 text-base
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900
            resize-y
            md:text-sm`,
            // Border states
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900' 
              : success
              ? 'border-green-500 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900'
              : 'border-gray-200 dark:border-gray-700 focus:border-primary-500',
            className
          )}
          {...props}
        />
        
        {/* Footer: Helper/Error text + Character count */}
        <div className="flex justify-between items-start mt-1.5 gap-4">
          {/* Error or helper text */}
          <div className="flex-1 min-w-0">
            {error && (
              <p 
                id={errorId}
                role="alert"
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{error}</span>
              </p>
            )}
            {helperText && !error && (
              <p 
                id={helperId}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
          
          {/* Character count */}
          {showCharacterCount && maxLength && (
            <p 
              id={countId}
              className={cn(
                "text-sm flex-shrink-0 tabular-nums",
                isOverLimit 
                  ? "text-red-600 dark:text-red-400 font-medium" 
                  : isNearLimit
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-400 dark:text-gray-500"
              )}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Simple textarea without extras (for compatibility)
const TextareaSimple = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-xl 
          border-2 border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          px-4 py-3 text-base
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary-500
          disabled:cursor-not-allowed disabled:opacity-50
          md:text-sm`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextareaSimple.displayName = "TextareaSimple"

export { Textarea, TextareaSimple }
