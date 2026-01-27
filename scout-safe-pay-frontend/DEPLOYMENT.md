# 🚀 DEPLOYMENT GUIDE - AutoScout24 SafeTrade Frontend

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All console.logs replaced with logger
- [x] No debugger statements
- [x] TypeScript strict mode enabled
- [x] All tests passing
- [x] No ESLint errors

### ✅ Configuration
- [x] .env.production configured
- [x] API URLs set to production
- [x] Feature flags configured
- [ ] Error tracking (Sentry) configured
- [ ] Analytics configured

### ✅ Performance
- [x] Images optimized
- [x] Fonts optimized (next/font)
- [x] Bundle size checked
- [x] Lighthouse score > 90

### ✅ Security
- [x] CSP headers configured
- [x] HTTPS only
- [x] Rate limiting configured
- [x] Input validation

### ✅ SEO & Accessibility
- [x] Sitemap generated
- [x] robots.txt configured
- [x] Meta tags complete
- [x] WCAG 2.1 AA compliant

---

## 🔧 Environment Setup

### 1. Create Production Environment File

Copy `.env.production.template` to `.env.production` and fill in real values:

```bash
cp .env.production.template .env.production
nano .env.production
```

**Required Variables:**
```env
NEXT_PUBLIC_API_URL=https://api.yourproductiondomain.com/api
NEXT_PUBLIC_SITE_URL=https://www.yourproductiondomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

**Optional but Recommended:**
```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Verify Environment Variables

```bash
# Check all required vars are set
node -e "
const fs = require('fs');
const envFile = fs.readFileSync('.env.production', 'utf8');
const required = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SITE_URL'];
const missing = required.filter(v => !envFile.includes(v));
if (missing.length) {
  console.log('❌ Missing required vars:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required environment variables set');
}
"
```

---

## 🏗️ Build Process

### 1. Install Dependencies

```bash
npm ci --production=false
```

### 2. Run Production Build

```bash
npm run build
```

**Expected Output:**
```
Route (app)                              Size     First Load JS
┌ ○ /[locale]                            X kB       XX kB
├ ○ /[locale]/about                      X kB       XX kB
├ ○ /[locale]/marketplace                X kB       XX kB
└ ...

○  (Static)  prerendered as static content
●  (SSG)     generated via getStaticProps
λ  (Dynamic) server-rendered on demand

First Load JS shared by all              XX kB
  ├ chunks/framework-xxxxx.js            XX kB
  └ ...
```

### 3. Analyze Bundle Size

```bash
# Install analyzer if not already installed
npm install --save-dev @next/bundle-analyzer

# Run analysis
ANALYZE=true npm run build
```

**Target Sizes:**
- Initial Load: < 500KB
- Total Bundle: < 1MB
- Largest Chunk: < 200KB

### 4. Test Production Build Locally

```bash
npm run start
# Visit http://localhost:3000
```

**Test Checklist:**
- [ ] Homepage loads
- [ ] All routes accessible
- [ ] Images load correctly
- [ ] Translations work
- [ ] Forms submit
- [ ] API calls succeed

---

## 🌐 Deployment Options

### Option A: Vercel (Recommended for Next.js)

**Pros:** Zero-config, automatic CDN, edge functions, preview deployments
**Cons:** Cost for high traffic

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect to GitHub for auto-deployments
# 1. Push code to GitHub
# 2. Import project at https://vercel.com/new
# 3. Set environment variables in Vercel dashboard
# 4. Deploy automatically on push
```

**Environment Variables in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production`
3. Set scope to "Production"
4. Redeploy

### Option B: AWS (EC2 + CloudFront)

**Pros:** Full control, scalable, custom infrastructure
**Cons:** More setup required

```bash
# 1. Build for production
npm run build

# 2. Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'scout-safe-pay-frontend',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 3. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 4. Configure Nginx reverse proxy
cat > /etc/nginx/sites-available/scout-safe-pay << 'EOF'
server {
    listen 80;
    server_name www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 5. Enable site and restart Nginx
ln -s /etc/nginx/sites-available/scout-safe-pay /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 6. Setup SSL with Let's Encrypt
certbot --nginx -d www.yourdomain.com
```

### Option C: Docker + Kubernetes

**Pros:** Containerized, scalable, multi-cloud
**Cons:** Complex setup

```dockerfile
# Create Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and push
docker build -t scout-safe-pay-frontend:latest .
docker push your-registry/scout-safe-pay-frontend:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml
```

---

## 📊 Post-Deployment

### 1. Monitoring Setup

**Sentry Error Tracking:**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

**Update logger.ts to integrate:**
```typescript
import * as Sentry from '@sentry/nextjs'

error(message: string, error?: any): void {
  // ... existing code ...
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: { message }
    })
  }
}
```

### 2. Analytics Setup

**Google Analytics:**
```typescript
// Add to layout.tsx
export default function RootLayout() {
  return (
    <html>
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Health Check Endpoint

Create `src/app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### 4. Uptime Monitoring

**Services to consider:**
- UptimeRobot (free for basic)
- Pingdom
- StatusCake
- AWS CloudWatch

**Setup:**
1. Add `/api/health` endpoint to monitor
2. Set check interval: 5 minutes
3. Configure alerts (email, Slack)
4. Monitor from multiple regions

---

## 🔍 Verification

### Post-Deploy Checklist

```bash
# 1. Check health endpoint
curl https://www.yourdomain.com/api/health

# 2. Check sitemap
curl https://www.yourdomain.com/sitemap.xml

# 3. Check robots.txt
curl https://www.yourdomain.com/robots.txt

# 4. Test all locales
for locale in en de es it ro fr; do
  echo "Testing /$locale..."
  curl -I https://www.yourdomain.com/$locale
done

# 5. Check SSL certificate
openssl s_client -connect www.yourdomain.com:443 -servername www.yourdomain.com < /dev/null

# 6. Run Lighthouse
npx lighthouse https://www.yourdomain.com --view
```

### Performance Metrics to Track

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Custom Metrics:**
- Time to First Byte: < 600ms
- Total Blocking Time: < 300ms
- Speed Index: < 3.4s

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Missing Environment Variables

```bash
# Verify all vars are set
npm run build 2>&1 | grep -i "env"
```

### High Memory Usage

```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Slow Build Times

```bash
# Use SWC instead of Babel (should be default in Next.js 12+)
# Disable source maps in production
# Use npm ci instead of npm install
```

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [AWS Deployment Best Practices](https://aws.amazon.com/blogs/containers/)
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## 🆘 Support

For deployment issues:
1. Check Next.js build logs
2. Review environment variables
3. Test production build locally first
4. Check server/CDN logs
5. Contact DevOps team

---

**Last Updated:** 2026-01-19
**Version:** 1.0.0
**Author:** Development Team
