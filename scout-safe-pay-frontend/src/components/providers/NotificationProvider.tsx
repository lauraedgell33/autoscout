// In-app notification system with toast, banner, and center
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import realtimeClient from '@/lib/realtime-client';
import { useAuthStore } from '@/store/auth-store';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
      dismissible: notification.dismissible ?? true,
    };

    setNotifications((prev) => [...prev, fullNotification]);

    // Auto-dismiss after duration
    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, fullNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    const unsubscribers: Array<() => void> = [];

    if (token) {
      realtimeClient.connect(token).catch(() => {
        // Connection errors are handled internally
      });

      const handleRealtimeNotification = (data: any) => {
        const message = data?.message || data?.data?.message;
        if (!message) return;

        const type = (data?.type || data?.data?.type || 'info') as NotificationType;
        const safeType: NotificationType = ['success', 'error', 'warning', 'info'].includes(type)
          ? type
          : 'info';

        addNotification({
          type: safeType,
          title: data?.title || data?.data?.title,
          message,
          duration: 6000,
        });
      };

      unsubscribers.push(realtimeClient.on('notification', handleRealtimeNotification));
      unsubscribers.push(realtimeClient.on('notification.created', handleRealtimeNotification));
      unsubscribers.push(realtimeClient.on('notification.new', handleRealtimeNotification));
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      realtimeClient.disconnect();
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

/**
 * Hook to use notification system
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return {
    notify: context.addNotification,
    remove: context.removeNotification,
    clear: context.clearNotifications,
    success: (message: string, options?: Omit<Notification, 'type' | 'message' | 'id'>) =>
      context.addNotification({ type: 'success', message, ...options }),
    error: (message: string, options?: Omit<Notification, 'type' | 'message' | 'id'>) =>
      context.addNotification({ type: 'error', message, ...options }),
    warning: (message: string, options?: Omit<Notification, 'type' | 'message' | 'id'>) =>
      context.addNotification({ type: 'warning', message, ...options }),
    info: (message: string, options?: Omit<Notification, 'type' | 'message' | 'id'>) =>
      context.addNotification({ type: 'info', message, ...options }),
  };
}

/**
 * Notification Container - displays all notifications
 */
function NotificationContainer() {
  const { notifications, removeNotification } = useContext(NotificationContext)!;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual Notification Toast
 */
function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgMap = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textMap = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`mb-3 pointer-events-auto min-w-[350px] border rounded-lg p-4 shadow-lg ${bgMap[notification.type]}`}
    >
      <div className="flex items-start gap-3">
        {iconMap[notification.type]}

        <div className="flex-1 min-w-0">
          {notification.title && (
            <h3 className={`font-semibold ${textMap[notification.type]}`}>
              {notification.title}
            </h3>
          )}
          <p className={`text-sm ${textMap[notification.type]}`}>
            {notification.message}
          </p>

          {notification.action && (
            <button
              onClick={() => {
                notification.action?.onClick();
                onDismiss();
              }}
              className={`text-sm font-medium mt-2 underline hover:no-underline ${textMap[notification.type]}`}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {notification.dismissible && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${textMap[notification.type]} hover:opacity-70 transition`}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default NotificationProvider;
