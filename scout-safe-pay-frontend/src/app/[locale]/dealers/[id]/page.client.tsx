'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DealerPageClientProps {
  dealerId: number
}

export default function DealerPageClient({ dealerId }: DealerPageClientProps) {
  const t = useTranslations('dealers')
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back') || 'Back'}
        </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center text-blue-900">
              <Building2 className="w-6 h-6 mr-2" />
              Dealer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dealer Profile Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                The detailed dealer profile page is currently being updated. 
                Please check back later or contact us for more information.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push('/vehicles')}>
                  Browse Vehicles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
