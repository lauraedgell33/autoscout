import React, { useState } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  value?: string;
  children?: React.ReactNode;
}

export const Select = ({ children, onValueChange, onChange, ...props }: SelectProps) => (
  <select
    {...props}
    onChange={(e) => {
      onValueChange?.(e.target.value);
      onChange?.(e);
    }}
    className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${props.className || ''}`}
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <button className={`px-4 py-2 border border-gray-300 rounded-lg text-left ${className}`}>{children}</button>
);

export const SelectContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-300 rounded-lg shadow-lg ${className}`}>{children}</div>
);

export const SelectItem = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => (
  <div className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${className}`} data-value={value}>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder || 'Select...'}</span>;
