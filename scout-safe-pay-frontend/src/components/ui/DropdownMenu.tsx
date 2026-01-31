'use client';

import React from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'end',
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <RadixDropdown.Root open={open} onOpenChange={setOpen}>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RadixDropdown.Content
              align={align}
              className="z-50 min-w-[200px] bg-white rounded-md shadow-lg border border-gray-200 p-1"
            >
              {items.map((item, index) => (
                <RadixDropdown.Item
                  key={index}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    item.isDanger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </RadixDropdown.Item>
              ))}
            </RadixDropdown.Content>
          </motion.div>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};
