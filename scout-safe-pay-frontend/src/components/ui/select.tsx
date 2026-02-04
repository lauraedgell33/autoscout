'use client';

import React, { useState, useRef, useEffect, createContext, useContext, useCallback, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Context for Select component
interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  listboxId: string;
  triggerId: string;
  items: string[];
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  'aria-label'?: string;
}

export const Select = ({ 
  children, 
  value: controlledValue, 
  defaultValue = '', 
  onValueChange,
  disabled = false,
  required = false,
  name,
  'aria-label': ariaLabel,
}: SelectProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [items, setItems] = useState<string[]>([]);
  
  const generatedId = useId();
  const listboxId = `select-listbox-${generatedId}`;
  const triggerId = `select-trigger-${generatedId}`;
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  }, [controlledValue, onValueChange]);

  const registerItem = useCallback((itemValue: string) => {
    setItems(prev => prev.includes(itemValue) ? prev : [...prev, itemValue]);
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setItems(prev => prev.filter(v => v !== itemValue));
  }, []);

  // Reset active index when opening
  useEffect(() => {
    if (open) {
      const currentIndex = items.indexOf(value);
      // eslint-disable-next-line react-compiler/react-compiler -- Sync activeIndex based on dropdown state
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      // eslint-disable-next-line react-compiler/react-compiler -- Reset activeIndex when closing
      setActiveIndex(-1);
    }
  }, [open, items, value]);

  return (
    <SelectContext.Provider value={{ 
      value, 
      onValueChange: handleValueChange, 
      open, 
      setOpen, 
      activeIndex,
      setActiveIndex,
      listboxId,
      triggerId,
      items,
      registerItem,
      unregisterItem,
    }}>
      <div className="relative inline-block w-full">
        {children}
        {/* Hidden input for form submission */}
        {name && (
          <input 
            type="hidden" 
            name={name} 
            value={value} 
            required={required}
            aria-hidden="true"
          />
        )}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectTrigger = ({ 
  children, 
  className = '',
  disabled = false,
  placeholder,
}: SelectTriggerProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  
  const { open, setOpen, activeIndex, setActiveIndex, listboxId, triggerId, items, onValueChange } = context;
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open && activeIndex >= 0 && items[activeIndex]) {
          onValueChange(items[activeIndex]);
        } else {
          setOpen(!open);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setActiveIndex(Math.max(activeIndex - 1, 0));
        }
        break;
      case 'Home':
        e.preventDefault();
        if (open) setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        if (open) setActiveIndex(items.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        if (open) {
          setOpen(false);
        }
        break;
    }
  }, [open, setOpen, activeIndex, setActiveIndex, items, onValueChange]);

  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      onClick={() => !disabled && setOpen(!open)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        flex items-center justify-between w-full px-4 py-2.5
        border-2 rounded-xl bg-white text-left
        min-h-[44px]
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
        ${open ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}
        ${className}
      `}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
    >
      <span className="truncate text-gray-900">{children}</span>
      <ChevronDown 
        className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
        aria-hidden="true"
      />
    </button>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent = ({ children, className = '' }: SelectContentProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  
  const { open, setOpen, listboxId, triggerId } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const trigger = document.getElementById(triggerId);
        if (trigger && !trigger.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen, triggerId]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={triggerId}
      tabIndex={-1}
      className={`
        absolute z-50 w-full mt-1
        bg-white border-2 border-gray-200 rounded-xl
        shadow-lg max-h-60 overflow-auto
        py-1
        animate-fadeIn
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export const SelectItem = ({ 
  children, 
  value, 
  className = '',
  disabled = false,
}: SelectItemProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  
  const { 
    value: selectedValue, 
    onValueChange, 
    activeIndex, 
    setActiveIndex, 
    listboxId, 
    items,
    registerItem,
    unregisterItem,
  } = context;
  
  const isSelected = selectedValue === value;
  const itemIndex = items.indexOf(value);
  const isActive = activeIndex === itemIndex;
  const itemRef = useRef<HTMLDivElement>(null);

  // Register/unregister item
  useEffect(() => {
    registerItem(value);
    return () => unregisterItem(value);
  }, [value, registerItem, unregisterItem]);

  // Scroll into view when active
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isActive]);

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setActiveIndex(itemIndex);
    }
  };

  return (
    <div
      ref={itemRef}
      id={`${listboxId}-option-${itemIndex}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        flex items-center justify-between
        px-4 py-2.5 cursor-pointer
        transition-colors duration-150
        min-h-[40px]
        ${disabled 
          ? 'opacity-50 cursor-not-allowed text-gray-400' 
          : isActive
          ? 'bg-primary-50 text-primary-900'
          : isSelected
          ? 'bg-primary-100 text-primary-900'
          : 'text-gray-700 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <Check className="w-4 h-4 text-primary-600 flex-shrink-0 ml-2" aria-hidden="true" />
      )}
    </div>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue = ({ placeholder = 'Select...' }: SelectValueProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  
  const { value } = context;
  
  if (!value) {
    return <span className="text-gray-400">{placeholder}</span>;
  }
  
  return <span className="text-gray-900">{value}</span>;
};
