'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variantClasses = {
      primary: 'bg-primary-900 text-white hover:bg-primary-950 focus-visible:ring-primary-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all',
      secondary: 'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-400 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all',
      outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white focus-visible:ring-primary-500 hover:-translate-y-0.5 active:translate-y-0 transition-all',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400 hover:scale-105 active:scale-100 transition-all',
      danger: 'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-400 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all',
      success: 'bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-400 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-6 py-3.5 text-lg min-h-[52px]',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 
            className="animate-spin" 
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            aria-label="Loading"
          />
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
