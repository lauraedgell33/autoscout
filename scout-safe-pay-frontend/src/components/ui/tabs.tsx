import React from 'react';

export const Tabs = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full ${className}`}>{children}</div>
);

export const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex border-b border-gray-200 ${className}`}>{children}</div>
);

export const TabsTrigger = ({
  value,
  onClick,
  active,
  children,
  className = '',
}: {
  value: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border-b-2 font-medium transition-colors ${
      active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
    } ${className}`}
  >
    {children}
  </button>
);

export const TabsContent = ({
  value,
  active,
  children,
  className = '',
}: {
  value: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`${active ? 'block' : 'hidden'} ${className}`}>{children}</div>
);
