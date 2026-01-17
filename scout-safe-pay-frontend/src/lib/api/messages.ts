import apiClient from './client'

export interface Message {
  id: number
  transaction_id: number
  sender: {
    id: number
    name: string
    email: string
  }
  receiver: {
    id: number
    name: string
    email: string
  }
  message: string
  attachments: string[] | null
  is_read: boolean
  read_at: string | null
  is_system_message: boolean
  is_from_me: boolean
  created_at: string
  updated_at: string
}

export interface Conversation {
  transaction_id: number
  transaction: {
    id: number
    amount: string
    status: string
    vehicle: {
      id: number
      make: string
      model: string
      year: number
      primary_image: string | null
    }
  }
  other_party: {
    id: number
    name: string
    email: string
  }
  last_message: {
    message: string
    created_at: string
    is_from_me: boolean
  } | null
  unread_count: number
}

export interface ConversationDetail {
  messages: Message[]
  transaction: {
    id: number
    amount: string
    status: string
    buyer: {
      id: number
      name: string
    }
    seller: {
      id: number
      name: string
    }
    vehicle: {
      id: number
      make: string
      model: string
      year: number
    }
  }
}

export interface SendMessageData {
  message: string
  attachments?: string[]
}

export const messageService = {
  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/messages/conversations')
    return response.data.conversations
  },

  /**
   * Get messages for a transaction
   */
  async getMessages(transactionId: number): Promise<ConversationDetail> {
    const response = await apiClient.get(`/transactions/${transactionId}/messages`)
    return response.data
  },

  /**
   * Send a message
   */
  async sendMessage(transactionId: number, data: SendMessageData): Promise<Message> {
    const response = await apiClient.post(`/transactions/${transactionId}/messages`, data)
    return response.data.data
  },

  /**
   * Mark message as read
   */
  async markAsRead(transactionId: number, messageId: number): Promise<void> {
    await apiClient.post(`/transactions/${transactionId}/messages/${messageId}/read`)
  },

  /**
   * Mark all messages as read
   */
  async markAllAsRead(transactionId: number): Promise<void> {
    await apiClient.post(`/transactions/${transactionId}/messages/read-all`)
  },

  /**
   * Delete a message
   */
  async deleteMessage(transactionId: number, messageId: number): Promise<void> {
    await apiClient.delete(`/transactions/${transactionId}/messages/${messageId}`)
  },

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/messages/unread-count')
    return response.data.unread_count
  },

  /**
   * Format message timestamp
   */
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  },
}

export default messageService
