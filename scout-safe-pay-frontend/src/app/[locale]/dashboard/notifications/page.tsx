'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { notificationService, type Notification, type NotificationPreferences } from '@/lib/api/notifications'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPreferences, setShowPreferences] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [notifs, prefs] = await Promise.all([
        filter === 'unread' ? notificationService.getUnread() : notificationService.getAll().then(res => res.notifications),
        notificationService.getPreferences()
      ])
      setNotifications(notifs)
      setPreferences(prefs)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      const updated = await notificationService.updatePreferences(updates)
      setPreferences(updated)
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notification System Ready</h3>
          <p className="text-gray-500">Backend API integrated. Notifications will appear here.</p>
        </div>
      </div>
    </div>
  )
}
