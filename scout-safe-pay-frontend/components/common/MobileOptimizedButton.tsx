'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function MobileOptimizedButton({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
}: MobileOptimizedButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-as24-blue disabled:opacity-50 disabled:cursor-not-allowed';

  // Ensure minimum touch target size of 44x44px
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px] min-w-[44px]',
    md: 'px-4 py-2.5 text-base min-h-[44px] min-w-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px] min-w-[48px]',
  };

  const variantClasses = {
    primary: 'bg-as24-blue text-white hover:bg-as24-blue/90 active:scale-95',
    secondary: 'border-2 border-as24-blue text-as24-blue hover:bg-as24-blue/5 active:scale-95',
    ghost: 'text-as24-blue hover:bg-as24-blue/10 active:scale-95',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
}

export default MobileOptimizedButton;
