'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { notificationService, type Notification, type NotificationPreferences } from '@/lib/api/notifications'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Check, CheckCheck, Trash2, Settings, Mail, Clock } from 'lucide-react'

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

  const unreadCount = (notifications || []).filter(n => !n.read_at).length

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-2">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                {unreadCount > 0 ? (
                  <>
                    <Badge className="bg-orange-500 hover:bg-orange-600">{unreadCount}</Badge>
                    <span>unread notifications</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4 text-green-500" />
                    <span>All caught up!</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                onClick={() => setShowPreferences(!showPreferences)}
                variant="outline"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className="flex-1 sm:flex-initial"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              variant={filter === 'unread' ? 'default' : 'outline'}
              className="flex-1 sm:flex-initial"
            >
              Unread
            </Button>
          </div>
        </Card>

        {/* Notifications List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <BellOff className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all hover:shadow-md ${
                  !notification.read_at ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !notification.read_at ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                        {notification.title || 'Notification'}
                      </h3>
                      {!notification.read_at && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-xs flex-shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message || 'You have a new notification'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0">
                    {!notification.read_at && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(notification.id)}
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
