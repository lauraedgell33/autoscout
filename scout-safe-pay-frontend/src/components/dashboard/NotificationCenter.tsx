// Notification Center component for dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'transaction' | 'message' | 'system' | 'payment' | 'dispute';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationCenterProps {
  notifications?: NotificationItem[];
  loading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

const typeIcons = {
  transaction: <AlertCircle size={18} className="text-blue-500" />,
  message: <MessageSquare size={18} className="text-purple-500" />,
  system: <Info size={18} className="text-gray-500" />,
  payment: <CheckCircle size={18} className="text-green-500" />,
  dispute: <AlertCircle size={18} className="text-red-500" />,
};

export function NotificationCenter({
  notifications = [],
  loading = false,
  onMarkAsRead,
  onDelete,
  onClearAll,
}: NotificationCenterProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onDelete?.(id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-as24-blue" />
          <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 bg-as24-orange text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No notifications yet</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-lg border transition ${
                notification.read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{typeIcons[notification.type]}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  {notification.action && (
                    <Link
                      href={notification.action.href}
                      className="text-sm text-as24-blue hover:text-as24-blue/80 font-medium mt-2 inline-block transition"
                    >
                      {notification.action.label} →
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700"
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-gray-500 hover:text-red-600"
                    title="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {notification.read && (
                <div className="absolute top-2 right-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

export default NotificationCenter;
