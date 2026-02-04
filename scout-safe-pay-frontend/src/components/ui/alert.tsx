'use client';

import React, { useEffect, useState, useId, useCallback } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X 
} from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
  autoClose?: number; // Auto close after X milliseconds
  role?: 'alert' | 'status';
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
    titleClass: 'text-green-900',
    buttonClass: 'text-green-500 hover:bg-green-100 focus:ring-green-500',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
    titleClass: 'text-red-900',
    buttonClass: 'text-red-500 hover:bg-red-100 focus:ring-red-500',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-900',
    buttonClass: 'text-amber-500 hover:bg-amber-100 focus:ring-amber-500',
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-900',
    buttonClass: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-500',
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
  autoClose,
  role = 'alert',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const alertId = useId();
  const titleId = title ? `${alertId}-title` : undefined;
  const descId = `${alertId}-desc`;

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, handleDismiss]);

  if (!isVisible) return null;

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={`
        relative flex gap-3 p-4
        border-2 rounded-xl
        animate-fadeIn
        ${config.containerClass}
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconClass}`} aria-hidden="true">
        {icon || <IconComponent size={20} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 
            id={titleId}
            className={`font-semibold text-sm mb-1 ${config.titleClass}`}
          >
            {title}
          </h3>
        )}
        <div id={descId} className="text-sm">
          {children}
        </div>
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={`
            flex-shrink-0 p-1 rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${config.buttonClass}
          `}
          aria-label="Dismiss alert"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// Inline alert for forms
interface InlineAlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

export function InlineAlert({ 
  variant = 'error', 
  children,
  className = '',
}: InlineAlertProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`
        flex items-center gap-2 
        text-sm py-2 px-3 
        rounded-lg
        ${config.containerClass}
        ${className}
      `}
    >
      <IconComponent size={16} className={config.iconClass} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

// Toast-style alert for notifications
interface ToastAlertProps extends AlertProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastAlert({
  position = 'top-right',
  ...props
}: ToastAlertProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-full max-w-sm`}>
      <Alert {...props} dismissible className="shadow-lg" />
    </div>
  );
}

export default Alert;
