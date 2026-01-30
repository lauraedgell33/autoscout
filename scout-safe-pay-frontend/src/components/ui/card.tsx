'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  interactive?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  interactive = false,
  onClick,
  ...props 
}: CardProps) => {
  const hoverClasses = hoverable || interactive 
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' 
    : '';
  
  const interactiveClasses = interactive 
    ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2' 
    : '';

  const Component = interactive || onClick ? 'button' : 'div';

  return (
    <Component 
      className={`rounded-lg border border-[var(--color-gray-200)] bg-white shadow-sm ${hoverClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props as any}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`border-b border-[var(--color-gray-200)] px-6 py-4 ${className}`}>
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
  <h3 className={`text-xl font-bold text-[var(--color-gray-900)] ${className}`}>
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
  <p className={`text-sm text-[var(--color-gray-600)] mt-1 ${className}`}>
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
  <div className={`border-t border-[var(--color-gray-200)] px-6 py-4 bg-[var(--color-gray-50)] rounded-b-lg ${className}`}>
    {children}
  </div>
);
