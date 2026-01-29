'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageContainer, SectionLayout, EmptyState, TwoColumnLayout } from '@/components/layout/LayoutComponents';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Payment Received',
    message: 'Your payment of €5,500 has been received for vehicle BMW 320i',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    title: 'Vehicle Verification',
    message: 'Your vehicle has been verified and is now live on the platform',
    type: 'info',
    timestamp: new Date(Date.now() - 86400000),
    read: false,
  },
  {
    id: '3',
    title: 'New Offer',
    message: 'You have received a new offer for your Mercedes C-Class',
    type: 'info',
    timestamp: new Date(Date.now() - 172800000),
    read: true,
  },
  {
    id: '4',
    title: 'Order Delivered',
    message: 'Your vehicle BMW 320i has been delivered to the buyer',
    type: 'success',
    timestamp: new Date(Date.now() - 259200000),
    read: true,
  },
];

export default function NotificationsPage() {
  const t = useTranslations();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'alert'>('all');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'success') return notif.type === 'success';
    if (filter === 'alert') return notif.type === 'alert';
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifs =>
      notifs.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifs => notifs.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="text-green-600" size={20} />;
      case 'alert':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'warning':
        return <Clock className="text-amber-600" size={20} />;
      default:
        return <Bell className="text-blue-600" size={20} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <PageContainer className="py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t('notifications') || 'Notifications'}
            </h1>
            <p className="text-gray-600">
              {t('manage_your_notifications') || 'Manage your alerts and updates'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filter</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'all'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Notifications
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'unread'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilter('success')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'success'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Success
                  </button>
                  <button
                    onClick={() => setFilter('alert')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filter === 'alert'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Alerts
                  </button>
                </div>

                {notifications.some(n => !n.read) && (
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="w-full mt-6"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-3">
              {filteredNotifications.length === 0 ? (
                <EmptyState
                  icon={<Bell />}
                  title={t('no_notifications') || 'No notifications'}
                  description={t('no_notifications_message') || 'You\'re all caught up!'}
                />
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg shadow border-l-4 transition-all hover:shadow-md ${
                        notification.read
                          ? 'border-l-gray-300 opacity-75'
                          : 'border-l-blue-600 border-l-4'
                      }`}
                    >
                      <div className="p-6 flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        <div className="flex-shrink-0 flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={18} className="text-gray-500" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </div>
      <Footer />
    </>
  );
}
