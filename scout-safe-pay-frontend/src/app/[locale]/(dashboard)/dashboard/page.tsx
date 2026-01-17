'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations()
  
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>{t('dashboard.total_balance')}</CardDescription>
            <CardTitle className="text-teal-600">€12,450.00</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t('dashboard.active_transactions')}</CardDescription>
            <CardTitle>3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t('dashboard.completed')}</CardDescription>
            <CardTitle>27</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recent_transactions')}</CardTitle>
          <CardDescription>{t('dashboard.recent_activities')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold">Mercedes-Benz A 200</p>
                  <p className="text-sm text-gray-600">{t('dashboard.transaction_number')}{i}234567</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€16,102.00</p>
                  <p className="text-sm text-teal-600">{t('dashboard.in_escrow')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">{t('dashboard.view_all')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-auto py-6">
              <span className="text-lg">+ New Transaction</span>
            </Button>
            <Button variant="outline" className="h-auto py-6">
              <span className="text-lg">Add Funds</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
