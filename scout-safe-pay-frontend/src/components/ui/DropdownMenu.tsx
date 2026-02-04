'use client';

import React from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  /** Accessible label for the menu */
  'aria-label'?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  'aria-label': ariaLabel,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <RadixDropdown.Root open={open} onOpenChange={setOpen}>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <AnimatePresence>
        {open && (
          <RadixDropdown.Portal forceMount>
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <RadixDropdown.Content
                align={align}
                side={side}
                sideOffset={sideOffset}
                aria-label={ariaLabel}
                className="
                  z-50 min-w-[180px] 
                  bg-white dark:bg-gray-900 
                  rounded-xl shadow-lg 
                  border border-gray-200 dark:border-gray-700 
                  p-1.5
                  focus:outline-none
                "
              >
                {items.map((item, index) => (
                  <RadixDropdown.Item
                    key={index}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 
                      text-sm rounded-lg cursor-pointer 
                      transition-colors duration-150
                      focus:outline-none
                      min-h-[40px]
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      ${
                        item.isDanger
                          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800'
                      }
                    `}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {item.shortcut}
                      </span>
                    )}
                  </RadixDropdown.Item>
                ))}
              </RadixDropdown.Content>
            </motion.div>
          </RadixDropdown.Portal>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

// Separator for dropdown menus
export const DropdownMenuSeparator: React.FC = () => (
  <RadixDropdown.Separator className="h-px my-1 bg-gray-200 dark:bg-gray-700" />
);

// Label for dropdown menu groups
export const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RadixDropdown.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {children}
  </RadixDropdown.Label>
);
