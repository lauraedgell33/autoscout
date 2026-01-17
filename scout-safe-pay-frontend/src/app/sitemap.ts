import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
const locales = ['en', 'de', 'es', 'it', 'ro', 'fr']

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/marketplace',
    '/how-it-works',
    '/benefits',
    '/login',
    '/register',
    '/legal/terms',
    '/legal/privacy',
    '/legal/cookies',
    '/legal/refund',
    '/legal/purchase-agreement',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Add all routes for all locales
  locales.forEach(locale => {
    routes.forEach(route => {
      sitemap.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/marketplace' ? 'hourly' : 'weekly',
        priority: route === '' ? 1.0 : route === '/marketplace' ? 0.9 : 0.8,
      })
    })
  })

  return sitemap
}
