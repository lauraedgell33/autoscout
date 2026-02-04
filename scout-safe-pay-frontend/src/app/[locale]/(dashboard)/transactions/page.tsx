'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { transactionService } from '@/lib/api/transactions'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export default function TransactionsPage() {
  const router = useRouter()
  const t = useTranslations()
  const { user, loading: authLoading } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = useCallback(async () => {
    try {
      const data = await transactionService.list()
      setTransactions(data.data || [])
    } catch (err: unknown) {
      const error = err as { response?: { status: number } }
      if (error.response?.status === 401) {
        router.push('/login')
      } else {
        setError(t('transactions.failed_to_load'))
      }
    } finally {
      setLoading(false)
    }
  }, [router, t])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      loadTransactions()
    }
  }, [user, authLoading, router, loadTransactions])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full"></div></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('transactions.title')}</h1>
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded">{error}</div>}
      {(transactions ?? []).length === 0 ? (
        <Card><CardContent className="py-12 text-center text-gray-500">{t('transactions.no_transactions')}</CardContent></Card>
      ) : (
        (transactions ?? []).map((tx: any) => (
          <Card key={tx.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{tx.vehicle?.make} {tx.vehicle?.model}</h3>
                  <p className="text-sm text-gray-500">{tx.transaction_code}</p>
                </div>
                <Link href={`/transactions/${tx.id}`}><Button size="sm">{t('transactions.view_details')}</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
