'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import { PageContainer, EmptyState } from '@/components/layout/LayoutComponents';
import { Button } from '@/components/ui/button';
import { notificationService, type Notification as ApiNotification } from '@/lib/api/notifications';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useRealtimeEvent } from '@/lib/realtime-client';
import { getPermissionState, registerServiceWorker, requestPushPermission, type PushPermissionState } from '@/lib/push-notifications';
import { pushService } from '@/lib/api/push';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPage() {
  const t = useTranslations();
  const { error: showError, success } = useNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'alert'>('all');
  const [pushPermission, setPushPermission] = useState<PushPermissionState>('unsupported');
  const [pushLoading, setPushLoading] = useState(false);

  function mapNotification(notification: ApiNotification): Notification {
    const type = (notification.data?.type || notification.type || 'info') as Notification['type'];
    const normalizedType = ['success', 'alert', 'warning', 'info'].includes(type) ? type : 'info';

    return {
      id: notification.id,
      title: notification.data?.message?.slice(0, 50) || 'Notification',
      message: notification.data?.message || 'You have a new notification',
      type: normalizedType as Notification['type'],
      timestamp: new Date(notification.created_at),
      read: Boolean(notification.read_at),
    };
  }

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getAll(1, filter === 'unread');
        setNotifications(response.notifications.map(mapNotification));
      } catch (err) {
        showError('Failed to load notifications', { title: 'Error' });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [filter, showError]);

  useEffect(() => {
    setPushPermission(getPermissionState());
    registerServiceWorker().catch(() => {
      // ignore registration errors
    });
  }, []);

  const handleRealtimeNotification = (payload: ApiNotification | any) => {
    const incoming = mapNotification(payload as ApiNotification);
    setNotifications((prev) => {
      if (prev.some((item) => item.id === incoming.id)) {
        return prev;
      }
      return [incoming, ...prev];
    });
  };

  useRealtimeEvent('notification', handleRealtimeNotification);
  useRealtimeEvent('notification.created', handleRealtimeNotification);
  useRealtimeEvent('notification.new', handleRealtimeNotification);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (filter === 'unread') return !notif.read;
      if (filter === 'success') return notif.type === 'success';
      if (filter === 'alert') return notif.type === 'alert';
      return true;
    });
  }, [notifications, filter]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifs =>
        notifs.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      showError('Failed to mark notification as read', { title: 'Error' });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications(notifs => notifs.filter(n => n.id !== id));
      success('Notification deleted');
    } catch (err) {
      showError('Failed to delete notification', { title: 'Error' });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
      success('All notifications marked as read');
    } catch (err) {
      showError('Failed to mark all as read', { title: 'Error' });
    }
  };

  const handleEnablePush = async () => {
    try {
      setPushLoading(true);
      const permission = await requestPushPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        const registration = await registerServiceWorker();

        if (registration) {
          // Get the push subscription from the service worker
          const subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            // Subscribe device on the backend
            const { browserName, deviceName } = pushService.getDeviceInfo();
            await pushService.subscribe(
              subscription.toJSON() as any,
              deviceName,
              browserName
            );
            success('Push notifications enabled and device subscribed');
          } else {
            // If no subscription yet, try to subscribe now
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (vapidKey) {
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey,
              });

              const { browserName, deviceName } = pushService.getDeviceInfo();
              await pushService.subscribe(
                newSubscription.toJSON() as any,
                deviceName,
                browserName
              );
              success('Push notifications enabled and device subscribed');
            } else {
              success('Push notifications enabled (VAPID key not configured)');
            }
          }
        } else {
          success('Push notifications permission granted (Service Worker registration failed)');
        }
      } else if (permission === 'denied') {
        showError('Push notifications blocked in browser settings', { title: 'Permission Denied' });
      }
    } catch (err) {
      console.error('Push notification setup error:', err);
      showError('Failed to enable push notifications', { title: 'Error' });
    } finally {
      setPushLoading(false);
    }
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
    <>      <div className="min-h-screen bg-gray-50">
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

                <div className="mt-6 space-y-3">
                  <p className="text-xs text-gray-500">
                    Push notifications: {pushPermission === 'granted'
                      ? 'Enabled'
                      : pushPermission === 'denied'
                      ? 'Blocked'
                      : pushPermission === 'default'
                      ? 'Not enabled'
                      : 'Unsupported'}
                  </p>
                  <Button
                    onClick={handleEnablePush}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={pushLoading || pushPermission === 'granted' || pushPermission === 'unsupported'}
                  >
                    {pushLoading
                      ? 'Enabling...'
                      : pushPermission === 'granted'
                      ? 'Push Enabled'
                      : 'Enable Push Notifications'}
                  </Button>
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
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow h-24 animate-pulse" />
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
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
      </div>    </>
  );
}
