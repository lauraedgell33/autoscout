'use client';

import React, { useEffect } from 'react';
import * as RadixAlert from '@radix-ui/react-alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop, modalContent } from '@/lib/animations/variants';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  /** Whether the action is dangerous (delete, etc.) */
  isDangerous?: boolean;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Whether action button is loading */
  isLoading?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = 'Continue',
  cancelLabel = 'Cancel',
  onAction,
  isDangerous = false,
  showIcon = true,
  isLoading = false,
}) => {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  const IconComponent = isDangerous ? Trash2 : AlertTriangle;
  const iconBgColor = isDangerous 
    ? 'bg-red-100 dark:bg-red-900/30' 
    : 'bg-amber-100 dark:bg-amber-900/30';
  const iconColor = isDangerous 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-amber-600 dark:text-amber-400';

  return (
    <RadixAlert.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixAlert.Portal forceMount>
            <motion.div 
              variants={modalBackdrop} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
            >
              <RadixAlert.Overlay 
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
              <RadixAlert.Content 
                className="
                  relative bg-white dark:bg-gray-900 
                  rounded-2xl shadow-2xl 
                  max-w-md w-full p-6
                  border border-gray-200 dark:border-gray-700
                  focus:outline-none
                "
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  {showIcon && (
                    <div 
                      className={`
                        flex-shrink-0 w-12 h-12 rounded-full 
                        flex items-center justify-center
                        ${iconBgColor}
                      `}
                      aria-hidden="true"
                    >
                      <IconComponent className={`w-6 h-6 ${iconColor}`} />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <RadixAlert.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                      {title}
                    </RadixAlert.Title>
                    <RadixAlert.Description className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </RadixAlert.Description>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <RadixAlert.Cancel 
                    className="
                      px-4 py-2.5 text-sm font-medium 
                      text-gray-700 dark:text-gray-300
                      bg-gray-100 dark:bg-gray-800
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      rounded-xl transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                      dark:focus:ring-offset-gray-900
                      min-h-[44px]
                    "
                  >
                    {cancelLabel}
                  </RadixAlert.Cancel>
                  <RadixAlert.Action
                    onClick={onAction}
                    disabled={isLoading}
                    className={`
                      px-4 py-2.5 text-sm font-medium text-white 
                      rounded-xl transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      dark:focus:ring-offset-gray-900
                      min-h-[44px]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2
                      ${
                        isDangerous
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          : 'bg-accent-500 hover:bg-accent-600 focus:ring-accent-500'
                      }
                    `}
                  >
                    {isLoading && (
                      <svg 
                        className="animate-spin h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {actionLabel}
                  </RadixAlert.Action>
                </div>
              </RadixAlert.Content>
            </motion.div>
          </RadixAlert.Portal>
        )}
      </AnimatePresence>
    </RadixAlert.Root>
  );
};

// Confirmation dialog shorthand
export const ConfirmDialog = AlertDialog;

// Delete confirmation with preset styling
export const DeleteConfirmDialog: React.FC<Omit<AlertDialogProps, 'isDangerous' | 'actionLabel'> & { actionLabel?: string }> = (props) => (
  <AlertDialog 
    {...props} 
    isDangerous 
    actionLabel={props.actionLabel || 'Delete'}
  />
);
