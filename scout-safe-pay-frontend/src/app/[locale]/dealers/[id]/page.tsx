import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import DealerPageClient from './page.client'

interface PageProps {
  params: {
    locale: string
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'dealers' })

  return {
    title: t('dealerProfile'),
    description: t('dealerProfileDescription'),
  }
}

export default function DealerPage({ params }: PageProps) {
  const dealerId = parseInt(params.id)

  if (isNaN(dealerId)) {
    notFound()
  }

  return <DealerPageClient dealerId={dealerId} />
}