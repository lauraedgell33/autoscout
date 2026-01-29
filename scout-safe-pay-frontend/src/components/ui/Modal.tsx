import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { modalBackdrop, modalContent } from '@/lib/animations/variants';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    <RadixDialog.Portal>
      <motion.div variants={modalBackdrop} initial="hidden" animate="visible" exit="exit">
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
      </motion.div>
      <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit">
        <RadixDialog.Content className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <RadixDialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </RadixDialog.Title>
                {description && (
                  <RadixDialog.Description className="mt-1 text-sm text-gray-600">
                    {description}
                  </RadixDialog.Description>
                )}
              </div>
              <RadixDialog.Close className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={20} />
              </RadixDialog.Close>
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </RadixDialog.Content>
      </motion.div>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);
