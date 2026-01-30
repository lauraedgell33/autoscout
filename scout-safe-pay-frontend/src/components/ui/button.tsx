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
      primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary)] shadow-sm hover:shadow-md active:scale-[0.98]',
      secondary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] focus-visible:ring-[var(--color-accent)] shadow-sm hover:shadow-md active:scale-[0.98]',
      outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus-visible:ring-[var(--color-primary)] active:scale-[0.98]',
      ghost: 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] focus-visible:ring-[var(--color-gray-500)] active:scale-[0.98]',
      danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)] focus-visible:ring-[var(--color-error)] shadow-sm hover:shadow-md active:scale-[0.98]',
      success: 'bg-[var(--color-success)] text-white hover:bg-[var(--color-success-dark)] focus-visible:ring-[var(--color-success)] shadow-sm hover:shadow-md active:scale-[0.98]',
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
