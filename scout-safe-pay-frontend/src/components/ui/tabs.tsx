'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useId, useEffect } from 'react';

// Context for Tabs state
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabsId: string;
  orientation: 'horizontal' | 'vertical';
  registerTab: (value: string) => void;
  unregisterTab: (value: string) => void;
  tabs: string[];
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// Hook that allows optional context (for backwards compatibility)
const useOptionalTabsContext = () => {
  return useContext(TabsContext);
};

// Main Tabs container
interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  children, 
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  className = '' 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [tabs, setTabs] = useState<string[]>([]);
  const tabsId = useId();
  
  const activeTab = controlledValue !== undefined ? controlledValue : internalValue;
  
  const setActiveTab = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [controlledValue, onValueChange]);

  const registerTab = useCallback((value: string) => {
    setTabs(prev => prev.includes(value) ? prev : [...prev, value]);
  }, []);

  const unregisterTab = useCallback((value: string) => {
    setTabs(prev => prev.filter(v => v !== value));
  }, []);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabsId, orientation, registerTab, unregisterTab, tabs }}>
      <div 
        className={`w-full ${orientation === 'vertical' ? 'flex gap-4' : ''} ${className}`}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Tab list container
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { orientation, tabsId } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={`
        ${orientation === 'horizontal' 
          ? 'flex border-b border-gray-200 dark:border-gray-700' 
          : 'flex flex-col border-r border-gray-200 dark:border-gray-700 pr-4'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Individual tab trigger
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** @deprecated Use controlled Tabs with value/onValueChange instead */
  active?: boolean;
  /** @deprecated Use controlled Tabs with value/onValueChange instead */
  onClick?: () => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
  disabled = false,
  icon,
  active: activeProp,
  onClick: onClickProp,
}) => {
  // Use optional context hook for backwards compatibility
  const contextValue = useOptionalTabsContext();
  
  const activeTab = contextValue?.activeTab;
  const setActiveTab = contextValue?.setActiveTab;
  const tabsId = contextValue?.tabsId || 'tabs';
  const orientation = contextValue?.orientation || 'horizontal';
  const registerTab = contextValue?.registerTab;
  const unregisterTab = contextValue?.unregisterTab;
  const tabs = contextValue?.tabs || [];
  // Use activeProp for legacy usage, otherwise use context
  const isActive = activeProp !== undefined ? activeProp : activeTab === value;
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Register tab on mount (only if in context)
  useEffect(() => {
    if (registerTab && unregisterTab) {
      registerTab(value);
      return () => unregisterTab(value);
    }
  }, [value, registerTab, unregisterTab]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = tabs.indexOf(value);
    let nextIndex = -1;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      }
    } else {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      }
    }

    if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0 && setActiveTab) {
      setActiveTab(tabs[nextIndex]);
      // Focus the next tab button
      const nextButton = document.querySelector(`[data-tab-value="${tabs[nextIndex]}"]`) as HTMLButtonElement;
      nextButton?.focus();
    }
  }, [tabs, value, orientation, setActiveTab]);

  const handleClick = () => {
    if (disabled) return;
    if (onClickProp) {
      onClickProp();
    } else if (setActiveTab) {
      setActiveTab(value);
    }
  };

  return (
    <button
      ref={buttonRef}
      role="tab"
      type="button"
      id={`${tabsId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${tabsId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-tab-value={value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        relative px-4 py-2.5 font-medium text-sm
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-gray-900
        min-h-[44px]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
        ${orientation === 'horizontal' 
          ? 'border-b-2 -mb-px' 
          : 'border-r-2 -mr-px rounded-l-lg'
        }
        ${
          isActive 
            ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400' 
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

// Tab content panel
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  /** Keep content mounted when not active (for forms, etc.) */
  forceMount?: boolean;
  /** @deprecated Use controlled Tabs with value/onValueChange instead */
  active?: boolean;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  forceMount = false,
  active: activeProp,
}) => {
  // Use optional context hook for backwards compatibility
  const contextValue = useOptionalTabsContext();
  
  const activeTab = contextValue?.activeTab;
  const tabsId = contextValue?.tabsId || 'tabs';
  // Use activeProp for legacy usage, otherwise use context
  const isActive = activeProp !== undefined ? activeProp : activeTab === value;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div 
      role="tabpanel"
      id={`${tabsId}-panel-${value}`}
      aria-labelledby={`${tabsId}-tab-${value}`}
      tabIndex={0}
      hidden={!isActive}
      className={`
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg
        ${isActive ? 'animate-fadeIn' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Legacy compatibility exports (for backwards compatibility)
export const TabsTriggerLegacy = ({
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
    role="tab"
    aria-selected={active}
    className={`px-4 py-2.5 border-b-2 font-medium text-sm transition-colors min-h-[44px] ${
      active 
        ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400' 
        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    } ${className}`}
  >
    {children}
  </button>
);

export const TabsContentLegacy = ({
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
  <div 
    role="tabpanel"
    hidden={!active}
    className={`${active ? 'block' : 'hidden'} ${className}`}
  >
    {children}
  </div>
);
