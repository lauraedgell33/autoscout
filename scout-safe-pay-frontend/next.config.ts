import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Bundle analyzer (only in analyze mode) - optional dependency
let withBundleAnalyzer: any = (config: any) => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  // @next/bundle-analyzer not installed, skip
  console.log('Bundle analyzer not available, skipping...');
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Turbopack configuration - DISABLED FOR DEBUGGING
  // turbopack: {
  //   root: __dirname,
  // },
  
  // Enable TypeScript checking for production builds
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.vapor-farm-x1.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.autoscout24.com',
      },
      {
        protocol: 'https',
        hostname: 'prod.pictures.autoscout24.net',
      },
      {
        protocol: 'https',
        hostname: '*.autoscout24.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'adminautoscout.dev',
      },
      // Allow localhost only in development
      ...(process.env.NODE_ENV !== 'production' ? [{
        protocol: 'http' as const,
        hostname: 'localhost',
      }] : []),
    ],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Compression
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'date-fns'],
    scrollRestoration: true,
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // DNS Prefetch Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy (formerly Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              process.env.NODE_ENV === 'production' 
                ? "connect-src 'self' https://*.vapor-farm-x1.com https://*.cloudfront.net https://*.vercel.app https://adminautoscout.dev https://www.autoscout24safetrade.com https://*.tile.openstreetmap.org"
                : "connect-src 'self' http://localhost:8000 http://localhost:8002 https://*.vapor-farm-x1.com https://*.cloudfront.net https://*.tile.openstreetmap.org",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },
          // Strict Transport Security (HSTS) - only for HTTPS
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }] : []),
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
