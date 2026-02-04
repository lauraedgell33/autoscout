'use client';

import React, { useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop, modalContent } from '@/lib/animations/variants';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Custom class for the content container */
  contentClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  contentClassName = '',
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <motion.div 
              variants={modalBackdrop} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
            >
              <RadixDialog.Overlay 
                className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm" 
              />
            </motion.div>
            <motion.div 
              variants={modalContent} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <RadixDialog.Content 
                className={`
                  relative bg-white dark:bg-gray-900 
                  rounded-2xl shadow-2xl 
                  ${sizeClasses[size]} w-full 
                  max-h-[90vh] overflow-y-auto
                  focus:outline-none
                  border border-gray-200 dark:border-gray-700
                  ${contentClassName}
                `}
                aria-describedby={description ? undefined : undefined}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <RadixDialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                      </RadixDialog.Title>
                      {description && (
                        <RadixDialog.Description className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {description}
                        </RadixDialog.Description>
                      )}
                    </div>
                    {showCloseButton && (
                      <RadixDialog.Close 
                        className="
                          inline-flex items-center justify-center 
                          h-9 w-9 rounded-lg 
                          text-gray-400 dark:text-gray-500
                          hover:text-gray-600 dark:hover:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-gray-800
                          transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                          dark:focus:ring-offset-gray-900
                          min-h-[44px] min-w-[44px]
                        "
                        aria-label="Close dialog"
                      >
                        <X size={20} aria-hidden="true" />
                      </RadixDialog.Close>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="mt-6">{children}</div>
                </div>
              </RadixDialog.Content>
            </motion.div>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};

// Utility components for consistent modal layouts
export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </div>
);
