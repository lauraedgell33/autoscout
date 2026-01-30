'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { ArrowLeft, Send, Circle } from 'lucide-react'
import messageService, { ConversationDetail } from '@/lib/api/messages'
import realtimeClient, { useRealtimeEvent } from '@/lib/realtime-client'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MessageThreadPage({ params }: { params: { locale: string; id: string } }) {
  const routeParams = useParams()
  const transactionId = Number(params.id || routeParams.id)
  const currentUserId = useAuthStore((state) => state.user?.id)

  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const [otherOnline, setOtherOnline] = useState<boolean | null>(null)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const otherParty = useMemo(() => {
    if (!conversation || !currentUserId) return null
    const { buyer, seller } = conversation.transaction
    return buyer.id === currentUserId ? seller : buyer
  }, [conversation, currentUserId])

  const loadConversation = useCallback(async () => {
    try {
      setLoading(true)
      const data = await messageService.getMessages(transactionId)
      setConversation(data)
      await messageService.markAllAsRead(transactionId)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }, [transactionId])

  useEffect(() => {
    loadConversation()
  }, [loadConversation])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [conversation?.messages?.length])

  const sendTyping = (isTyping: boolean) => {
    realtimeClient.send('typing', {
      transaction_id: transactionId,
      is_typing: isTyping,
    })
  }

  const handleTypingChange = (value: string) => {
    setMessage(value)

    sendTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false)
    }, 1200)
  }

  const handleSend = async () => {
    if (!message.trim() || sending) return
    try {
      setSending(true)
      await messageService.sendMessage(transactionId, { message: message.trim() })
      setMessage('')
      sendTyping(false)
      await loadConversation()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  useRealtimeEvent('message.created', (payload: any) => {
    if (payload?.transaction_id && Number(payload.transaction_id) === transactionId) {
      loadConversation()
    }
  })

  useRealtimeEvent('message.new', (payload: any) => {
    if (payload?.transaction_id && Number(payload.transaction_id) === transactionId) {
      loadConversation()
    }
  })

  useRealtimeEvent('typing', (payload: any) => {
    if (payload?.transaction_id && Number(payload.transaction_id) === transactionId) {
      if (payload?.user_id && payload.user_id === currentUserId) return
      setOtherTyping(Boolean(payload?.is_typing))
    }
  })

  useRealtimeEvent('presence.update', (payload: any) => {
    if (!otherParty) return
    const matchesUser = payload?.user_id && Number(payload.user_id) === Number(otherParty.id)
    const matchesTransaction = payload?.transaction_id && Number(payload.transaction_id) === transactionId

    if (matchesUser || matchesTransaction) {
      setOtherOnline(Boolean(payload?.is_online ?? payload?.online ?? payload?.status === 'online'))
    }
  })

  useEffect(() => {
    return () => {
      sendTyping(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Conversation not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/${params.locale}/messages`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              {(otherParty?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {otherParty?.name || 'Conversation'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Circle className={`h-2 w-2 ${otherOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                {otherOnline === null ? 'Status unknown' : otherOnline ? 'Online' : 'Offline'}
                {otherTyping && <span className="text-blue-600">• typing...</span>}
              </div>
            </div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div ref={listRef} className="h-[60vh] overflow-y-auto p-6 space-y-4 bg-white">
            {conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.is_from_me
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className={`mt-1 text-xs ${msg.is_from_me ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => handleTypingChange(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={handleSend} disabled={!message.trim() || sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
