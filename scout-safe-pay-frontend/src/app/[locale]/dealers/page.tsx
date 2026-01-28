import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import DealersPageClient from './page.client'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'dealers' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function DealersPage() {
  return <DealersPageClient />
}