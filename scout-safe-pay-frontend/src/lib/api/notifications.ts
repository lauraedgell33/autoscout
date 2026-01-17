import apiClient from './client'

export interface Notification {
  id: string
  type: string
  data: {
    transaction_id?: string
    reference_number?: string
    vehicle_name?: string
    amount?: number
    message: string
    url?: string
    type?: string
    priority?: string
  }
  read_at: string | null
  created_at: string
}

export interface NotificationResponse {
  success: boolean
  notifications: Notification[]
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  unread_count: number
}

export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  transaction_updates: boolean
  payment_updates: boolean
  marketing_emails: boolean
}

export const notificationService = {
  // Get all notifications
  async getAll(page = 1, unreadOnly = false): Promise<NotificationResponse> {
    const response = await apiClient.get('/notifications', {
      params: { page, unread_only: unreadOnly }
    })
    return response.data
  },

  // Get unread notifications
  async getUnread(): Promise<Notification[]> {
    const response = await this.getAll(1, true)
    return response.notifications
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data.unread_count
  },

  // Get user preferences
  async getPreferences(): Promise<NotificationPreferences> {
    // Mock implementation - adjust based on your API
    return {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      transaction_updates: true,
      payment_updates: true,
      marketing_emails: false
    }
  },

  // Update user preferences
  async updatePreferences(updates: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    // Mock implementation - adjust based on your API
    const current = await this.getPreferences()
    return { ...current, ...updates }
  },

  // Mark as read
  async markAsRead(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`)
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all')
  },

  // Delete notification
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`)
  },

  // Delete all notifications
  async deleteAll(): Promise<void> {
    await apiClient.delete('/notifications')
  },

  // Format notification for display
  formatNotification(notification: Notification) {
    const { data } = notification
    
    return {
      id: notification.id,
      title: this.getNotificationTitle(data.type || notification.type),
      message: data.message,
      url: data.url || `/dashboard/transactions/${data.transaction_id}`,
      isRead: !!notification.read_at,
      priority: data.priority || 'normal',
      createdAt: notification.created_at,
      icon: this.getNotificationIcon(data.type || notification.type),
      color: this.getNotificationColor(data.type || notification.type)
    }
  },

  getNotificationTitle(type: string): string {
    const titles: Record<string, string> = {
      'payment_received': '💰 Payment Received',
      'payment_released': '✅ Payment Released',
      'transaction_status': '🔔 Transaction Update',
      'inspection_reminder': '⏰ Inspection Reminder',
      'dispute_opened': '⚠️ Dispute Opened',
      'dispute_resolved': '✅ Dispute Resolved',
      'verification_approved': '✅ Verification Approved',
      'verification_rejected': '❌ Verification Rejected'
    }
    return titles[type] || '🔔 Notification'
  },

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'payment_received': '💰',
      'payment_released': '✅',
      'transaction_status': '🔔',
      'inspection_reminder': '⏰',
      'dispute_opened': '⚠️',
      'dispute_resolved': '✅',
      'verification_approved': '✅',
      'verification_rejected': '❌'
    }
    return icons[type] || '🔔'
  },

  getNotificationColor(type: string): string {
    const colors: Record<string, string> = {
      'payment_received': 'green',
      'payment_released': 'green',
      'transaction_status': 'blue',
      'inspection_reminder': 'orange',
      'dispute_opened': 'red',
      'dispute_resolved': 'green',
      'verification_approved': 'green',
      'verification_rejected': 'red'
    }
    return colors[type] || 'gray'
  }
}
