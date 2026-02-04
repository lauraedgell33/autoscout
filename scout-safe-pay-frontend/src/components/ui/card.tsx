'use client';

import React, { forwardRef, useCallback } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  interactive?: boolean;
  /** Accessible label for interactive cards */
  'aria-label'?: string;
  /** ID of element that labels this card */
  'aria-labelledby'?: string;
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'border border-gray-200 bg-white shadow-sm',
  elevated: 'border-0 bg-white shadow-lg',
  outlined: 'border-2 border-gray-200 bg-transparent shadow-none',
  filled: 'border-0 bg-gray-50 shadow-none',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hoverable = false,
  interactive = false,
  variant = 'default',
  padding = 'none',
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props 
}, ref) => {
  const isClickable = interactive || !!onClick;
  
  const hoverClasses = hoverable || isClickable 
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5' 
    : '';
  
  const interactiveClasses = isClickable 
    ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2' 
    : '';

  // Handle keyboard interaction for interactive cards
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
    onKeyDown?.(e);
  }, [isClickable, onClick, onKeyDown]);

  return (
    <div 
      ref={ref}
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClasses} 
        ${interactiveClasses} 
        ${className}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg ${className}`}>
    {children}
  </div>
);
