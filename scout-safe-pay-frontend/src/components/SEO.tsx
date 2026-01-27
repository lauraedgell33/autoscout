'use client'

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image'
  noindex?: boolean
  jsonLd?: object
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  jsonLd
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
  const fullTitle = title ? `${title} | AutoScout24 SafeTrade` : 'AutoScout24 SafeTrade'
  
  return (
    <Head>
      {title && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={`${siteUrl}${canonical}`} />}
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="AutoScout24 SafeTrade" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@autoscout24" />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}
