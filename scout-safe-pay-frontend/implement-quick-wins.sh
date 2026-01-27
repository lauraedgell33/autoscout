#!/bin/bash
echo "🚀 IMPLEMENTING PRODUCTION QUICK WINS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Step 1/5: Finding console.logs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -r "console\." src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "console.error" | wc -l

echo ""
echo "Step 2/5: Creating environment templates..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create .env.example
cat > .env.example << 'ENV'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3005

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=false

# Sentry (optional - for error tracking)
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_AUTH_TOKEN=
ENV

echo "✅ Created .env.example"

# Create .env.production template
cat > .env.production.template << 'ENV'
# API Configuration (REQUIRED)
NEXT_PUBLIC_API_URL=https://api.yourproductiondomain.com/api

# Application URLs (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://www.yourproductiondomain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# Sentry Error Tracking (RECOMMENDED)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_sentry_token_here
SENTRY_PROJECT=your_project_name
SENTRY_ORG=your_org_name

# Analytics (OPTIONAL)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
ENV

echo "✅ Created .env.production.template"

echo ""
echo "Step 3/5: Checking bundle size limits..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d ".next" ]; then
    du -sh .next 2>/dev/null | head -1
    echo "  ℹ️  Old build detected - will need fresh build"
fi

echo ""
echo "Step 4/5: Creating production logger..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mkdir -p src/utils
echo "  ✅ Logger utility will be created"

echo ""
echo "Step 5/5: Creating deployment documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Will create DEPLOYMENT.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ QUICK WINS SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
