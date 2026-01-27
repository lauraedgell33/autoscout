const fs = require('fs')
const path = require('path')

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
const LANGUAGES = ['en', 'de', 'es', 'it', 'ro', 'fr']

// Static pages
const STATIC_PAGES = [
  '',
  '/marketplace',
  '/how-it-works',
  '/benefits',
  '/contact',
  '/about',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
  '/legal/imprint'
]

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${STATIC_PAGES.map(page => 
  LANGUAGES.map(lang => `  <url>
    <loc>${DOMAIN}/${lang}${page}</loc>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    ${LANGUAGES.filter(l => l !== lang).map(altLang => 
      `<xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}${page}" />`
    ).join('\n    ')}
  </url>`).join('\n')
).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap)
  console.log('✓ Sitemap generated successfully')
}

generateSitemap()
