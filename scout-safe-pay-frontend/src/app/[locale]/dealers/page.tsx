import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import DealersPageClient from './page.client'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dealers' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function DealersPage() {
  return <DealersPageClient />
}
