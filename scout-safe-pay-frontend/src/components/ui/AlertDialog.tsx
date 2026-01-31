'use client';

import React from 'react';
import * as RadixAlert from '@radix-ui/react-alert-dialog';
import { motion } from 'framer-motion';
import { modalBackdrop, modalContent } from '@/lib/animations/variants';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  isDangerous?: boolean;
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
}) => (
  <RadixAlert.Root open={open} onOpenChange={onOpenChange}>
    <RadixAlert.Portal>
      <motion.div variants={modalBackdrop} initial="hidden" animate="visible" exit="exit">
        <RadixAlert.Overlay className="fixed inset-0 bg-black/50 z-40" />
      </motion.div>
      <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit">
        <RadixAlert.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <RadixAlert.Title className="text-lg font-semibold text-gray-900">
            {title}
          </RadixAlert.Title>
          <RadixAlert.Description className="mt-2 text-sm text-gray-600">
            {description}
          </RadixAlert.Description>
          <div className="flex justify-end gap-3 mt-6">
            <RadixAlert.Cancel className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              {cancelLabel}
            </RadixAlert.Cancel>
            <RadixAlert.Action
              onClick={onAction}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {actionLabel}
            </RadixAlert.Action>
          </div>
        </RadixAlert.Content>
      </motion.div>
    </RadixAlert.Portal>
  </RadixAlert.Root>
);
