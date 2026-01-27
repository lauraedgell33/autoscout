#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🎨 COMPLETE OPTIMIZATION SUITE - PHASES 2 & 3               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Phase 2: Mobile Polish
echo -e "${BLUE}📱 Phase 2: Mobile Polish${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create mobile-optimized utilities
mkdir -p src/utils

cat > src/utils/responsive.ts << 'EOF'
// Responsive utilities for mobile optimization

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

// Touch target size checker
export const isTouchTargetValid = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return rect.width >= 44 && rect.height >= 44
}

// Viewport height fix for mobile browsers
export const getViewportHeight = (): number => {
  return typeof window !== 'undefined' ? window.innerHeight : 0
}
EOF

echo -e "${GREEN}✓${NC} Created responsive utilities"

# Create SEO component
cat > src/components/SEO.tsx << 'EOF'
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
EOF

echo -e "${GREEN}✓${NC} Created SEO component with JSON-LD support"

# Create sitemap generator script
cat > scripts/generate-sitemap.js << 'EOF'
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
EOF

echo -e "${GREEN}✓${NC} Created sitemap generator"

# Create robots.txt
cat > public/robots.txt << 'EOF'
# Robots.txt for AutoScout24 SafeTrade
User-agent: *
Allow: /

# Sitemap
Sitemap: ${NEXT_PUBLIC_APP_URL:-https://yourdomain.com}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dashboard/

# Crawl delay (optional, be nice to servers)
Crawl-delay: 1
EOF

echo -e "${GREEN}✓${NC} Created robots.txt"

# Phase 3: Accessibility
echo ""
echo -e "${BLUE}♿ Phase 3: Accessibility & ARIA${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create accessibility utilities
cat > src/utils/accessibility.ts << 'EOF'
// Accessibility utilities

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey)
  
  return () => element.removeEventListener('keydown', handleTabKey)
}

export const getAccessibleLabel = (element: HTMLElement): string => {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.getAttribute('title') ||
    element.textContent ||
    ''
  )
}
EOF

echo -e "${GREEN}✓${NC} Created accessibility utilities"

# Update package.json scripts
echo ""
echo -e "${BLUE}📦 Adding npm scripts${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if package.json exists
if [ -f package.json ]; then
    echo -e "${YELLOW}ℹ${NC}  Add these scripts to package.json manually:"
    echo '  "scripts": {'
    echo '    "generate:sitemap": "node scripts/generate-sitemap.js",'
    echo '    "prebuild": "npm run generate:sitemap"'
    echo '  }'
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Optimization Suite Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Created:"
echo "  ✓ Responsive utilities (src/utils/responsive.ts)"
echo "  ✓ SEO component with JSON-LD (src/components/SEO.tsx)"
echo "  ✓ Sitemap generator (scripts/generate-sitemap.js)"
echo "  ✓ Robots.txt (public/robots.txt)"
echo "  ✓ Accessibility utilities (src/utils/accessibility.ts)"
echo ""
echo "🚀 Next steps:"
echo "  1. npm run generate:sitemap"
echo "  2. Test responsiveness on mobile"
echo "  3. Run lighthouse audit"
echo "  4. Test keyboard navigation"
echo ""

