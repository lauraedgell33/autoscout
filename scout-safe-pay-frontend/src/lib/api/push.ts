import apiClient from './client'

export interface PushSubscriptionResponse {
  success: boolean
  message: string
  subscription_id?: string
}

export interface PushSubscription {
  id: string
  device_name: string
  browser_name?: string
  is_active: boolean
  last_used_at?: string
  created_at: string
}

export interface PushSubscriptionsListResponse {
  success: boolean
  subscriptions: PushSubscription[]
  total: number
  active_count: number
}

export const pushService = {
  /**
   * Subscribe a device to push notifications
   * Sends the Web Push Protocol subscription to the backend
   */
  async subscribe(
    subscription: PushSubscriptionJSON,
    deviceName?: string,
    browserName?: string
  ): Promise<PushSubscriptionResponse> {
    try {
      const response = await apiClient.post('/push-subscriptions/subscribe', {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        device_name: deviceName,
        browser_name: browserName,
      })

      return (response as any).data as PushSubscriptionResponse
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  },

  /**
   * Unsubscribe a device from push notifications
   */
  async unsubscribe(endpoint: string): Promise<PushSubscriptionResponse> {
    try {
      const response = await apiClient.post('/push-subscriptions/unsubscribe', {
        endpoint,
      })

      return (response as any).data as PushSubscriptionResponse
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      throw error
    }
  },

  /**
   * Get all push subscriptions for the current user
   */
  async listSubscriptions(): Promise<PushSubscriptionsListResponse> {
    try {
      const response = await apiClient.get('/push-subscriptions')
      return (response as any).data as PushSubscriptionsListResponse
    } catch (error) {
      console.error('Failed to fetch push subscriptions:', error)
      throw error
    }
  },

  /**
   * Remove a specific push subscription
   */
  async removeSubscription(subscriptionId: string): Promise<PushSubscriptionResponse> {
    try {
      const response = await apiClient.delete(`/push-subscriptions/${subscriptionId}`)
      return (response as any).data as PushSubscriptionResponse
    } catch (error) {
      console.error('Failed to remove push subscription:', error)
      throw error
    }
  },

  /**
   * Helper: Get device information for subscription metadata
   */
  getDeviceInfo() {
    const ua = navigator.userAgent
    let browserName = 'Unknown'
    let deviceName = 'Device'

    // Simple browser detection
    if (ua.includes('Chrome')) {
      browserName = 'Chrome'
    } else if (ua.includes('Safari')) {
      browserName = 'Safari'
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox'
    } else if (ua.includes('Edge')) {
      browserName = 'Edge'
    }

    // Device detection
    if (ua.includes('iPhone')) {
      deviceName = 'iPhone'
    } else if (ua.includes('iPad')) {
      deviceName = 'iPad'
    } else if (ua.includes('Android')) {
      deviceName = 'Android Device'
    } else if (ua.includes('Windows')) {
      deviceName = 'Windows PC'
    } else if (ua.includes('Mac')) {
      deviceName = 'Mac'
    }

    return { browserName, deviceName }
  },
}

export type PushSubscriptionJSON = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}
