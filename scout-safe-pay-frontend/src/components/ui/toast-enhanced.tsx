'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
  progress?: boolean;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5000;
  const showProgress = toast.progress !== false;

  useEffect(() => {
    if (duration === Infinity) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    const iconProps = { size: 20, 'aria-hidden': true };
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="text-success-600" {...iconProps} />;
      case 'error':
        return <XCircle className="text-error-600" {...iconProps} />;
      case 'warning':
        return <AlertCircle className="text-warning-600" {...iconProps} />;
      case 'info':
        return <Info className="text-info-600" {...iconProps} />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'info':
        return 'bg-info-50 border-info-200';
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-500';
      case 'error':
        return 'bg-error-500';
      case 'warning':
        return 'bg-warning-500';
      case 'info':
        return 'bg-info-500';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-success-900';
      case 'error':
        return 'text-error-900';
      case 'warning':
        return 'text-warning-900';
      case 'info':
        return 'text-info-900';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm min-w-[320px] max-w-md',
        getBgColor()
      )}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium break-words', getTextColor())}>
          {toast.message}
        </p>
      </div>

      {/* Dismiss Button */}
      {toast.dismissible !== false && (
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      )}

      {/* Progress Bar */}
      {showProgress && duration !== Infinity && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-1', getProgressColor())}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

export interface EnhancedToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
}

export function EnhancedToastContainer({
  toasts,
  onDismiss,
  position = 'bottom-right',
  className,
}: EnhancedToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={cn(
        'fixed z-[9999] flex flex-col gap-3 pointer-events-none',
        positionClasses[position],
        className
      )}
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default EnhancedToastContainer;
