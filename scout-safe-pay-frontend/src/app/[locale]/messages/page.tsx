'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import messageService, { Conversation } from '@/lib/api/messages'
import { useRealtimeEvent } from '@/lib/realtime-client'

export default function MessagesPage() {
  const t = useTranslations()
  const tCommon = useTranslations('common')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await messageService.getConversations()
      setConversations(data)
    } catch (err: any) {
      console.error('Failed to fetch conversations:', err)
      setError(err.response?.data?.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useRealtimeEvent('message.created', () => {
    fetchConversations()
  })

  useRealtimeEvent('message.new', () => {
    fetchConversations()
  })

  return (
    <>      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('messages.title')}</h1>
            <p className="text-gray-600 mt-2">{t('messages.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="mt-4 text-xl text-gray-600">{t('messages.no_conversations')}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.transaction_id}
                  href={`/messages/${conversation.transaction_id}`}
                  className="block border-b border-gray-200 hover:bg-gray-50 transition p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {conversation.other_party.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {conversation.transaction.vehicle.make} {conversation.transaction.vehicle.model}
                      </p>
                      {conversation.last_message && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {conversation.last_message.message}
                        </p>
                      )}
                    </div>
                    {conversation.unread_count > 0 && (
                      <span className="bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>    </>
  )
}
