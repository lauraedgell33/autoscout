'use client';

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { ChevronDown } from 'lucide-react';

// Context for Select component
interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Select = ({ children, value: controlledValue, defaultValue = '', onValueChange }: SelectProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  
  const { open, setOpen } = context;
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
};

export const SelectContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  
  const { open, setOpen } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if click is on trigger button
        const trigger = contentRef.current.parentElement?.querySelector('button');
        if (trigger && !trigger.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${className}`}
      role="listbox"
    >
      {children}
    </div>
  );
};

// Store for item labels
const SelectItemsContext = createContext<Map<string, React.ReactNode>>(new Map());

export const SelectItem = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => {
  const context = useContext(SelectContext);
  const itemsMap = useContext(SelectItemsContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  // Register this item's label
  useEffect(() => {
    itemsMap.set(value, children);
    return () => {
      itemsMap.delete(value);
    };
  }, [value, children, itemsMap]);

  return (
    <div
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100 text-gray-900' : 'hover:bg-gray-100'
      } ${className}`}
      role="option"
      aria-selected={isSelected}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  
  const { value } = context;
  
  // For empty string value, show placeholder
  if (!value) {
    return <span className="text-gray-500">{placeholder || 'Select...'}</span>;
  }
  
  return <span>{value || placeholder || 'Select...'}</span>;
};
