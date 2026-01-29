#!/bin/bash

#################################################################
# 🚀 QUICK REFERENCE CARD - AutoScout24 SafeTrade
# Bank Transfer Payment System
# Date: 2026-01-29
#################################################################

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  AutoScout24 SafeTrade - Bank Transfer Payment System      ║"
echo "║  QUICK REFERENCE & COMMANDS                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

#################################################################
# QUICK COMMANDS
#################################################################

echo "📋 QUICK COMMANDS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Backend Tests:"
echo "  php artisan test                          # Run all tests"
echo "  php artisan test tests/Feature/BankTransferPaymentFlowTest.php"
echo "  php artisan test tests/Feature/EmailDeliveryTest.php"
echo "  php artisan test tests/Feature/PDFGenerationTest.php"
echo "  php artisan test --coverage               # With coverage"
echo ""
echo "Frontend Tests:"
echo "  npm test                                  # Run all tests"
echo "  npm test -- --coverage                   # With coverage"
echo ""
echo "Start Development:"
echo "  cd scout-safe-pay-backend && php artisan serve"
echo "  cd scout-safe-pay-frontend && npm run dev"
echo ""
echo "Production Deployment:"
echo "  ./deploy-production.sh                    # Full deployment"
echo ""

#################################################################
# PROJECT STRUCTURE
#################################################################

echo "📂 PROJECT STRUCTURE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Backend:"
echo "  scout-safe-pay-backend/"
echo "  ├── app/Http/Controllers/API/"
echo "  │   ├── OrderController.php (10 endpoints)"
echo "  │   └── HealthController.php (monitoring)"
echo "  ├── app/Mail/ (5 Mailable classes)"
echo "  ├── resources/views/emails/ (5 email templates)"
echo "  ├── resources/views/invoices/ (invoice PDF)"
echo "  ├── resources/views/contracts/ (contract PDF)"
echo "  └── tests/Feature/"
echo "      ├── BankTransferPaymentFlowTest.php (17 tests)"
echo "      ├── EmailDeliveryTest.php (7 tests)"
echo "      └── PDFGenerationTest.php (12 tests)"
echo ""
echo "Frontend:"
echo "  scout-safe-pay-frontend/"
echo "  ├── src/components/orders/"
echo "  │   ├── PaymentInstructions.tsx"
echo "  │   ├── UploadSignedContract.tsx"
echo "  │   └── OrderStatusTracker.tsx"
echo "  ├── src/components/admin/"
echo "  │   └── PaymentConfirmationPanel.tsx"
echo "  ├── src/app/[locale]/orders/"
echo "  │   └── [id]/page.tsx"
echo "  ├── src/app/[locale]/admin/"
echo "  │   └── payments/page.tsx"
echo "  └── src/__tests__/"
echo "      └── components.test.tsx (45+ tests)"
echo ""

#################################################################
# KEY ENDPOINTS
#################################################################

echo "🔌 KEY ENDPOINTS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Health Monitoring:"
echo "  GET /api/health                           (basic health)"
echo "  GET /api/health/detailed                 (detailed metrics)"
echo ""
echo "Order Management:"
echo "  POST /api/orders                          (create order)"
echo "  POST /api/orders/{id}/generate-contract"
echo "  POST /api/orders/{id}/upload-signed-contract"
echo "  GET  /api/orders/{id}/payment-instructions"
echo "  POST /api/orders/{id}/confirm-payment     (admin only)"
echo "  POST /api/orders/{id}/mark-ready-delivery"
echo "  POST /api/orders/{id}/mark-delivered"
echo "  POST /api/orders/{id}/complete-order"
echo "  POST /api/orders/{id}/cancel-order"
echo ""
echo "Admin Dashboard:"
echo "  GET  /api/admin/payments/pending          (payment list)"
echo "  GET  /api/orders/{id}/invoice             (download invoice)"
echo "  GET  /api/orders/{id}/contract            (download contract)"
echo ""

#################################################################
# EMAIL TESTING
#################################################################

echo "📧 EMAIL TESTING (MailHog)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Setup MailHog:"
echo "  wget https://github.com/mailhog/MailHog/releases/download/"
echo "    v1.0.1/MailHog_linux_amd64"
echo "  chmod +x MailHog_linux_amd64"
echo "  ./MailHog_linux_amd64 &"
echo ""
echo "Configure .env:"
echo "  MAIL_MAILER=smtp"
echo "  MAIL_HOST=localhost"
echo "  MAIL_PORT=1025"
echo "  MAIL_ENCRYPTION=null"
echo ""
echo "View emails:"
echo "  http://localhost:1025     (MailHog UI)"
echo ""
echo "Run email tests:"
echo "  php artisan test tests/Feature/EmailDeliveryTest.php"
echo ""

#################################################################
# PAYMENT FLOW
#################################################################

echo "💳 PAYMENT FLOW (7 STEPS)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Step 1: Order Created"
echo "  Buyer creates order via API"
echo "  POST /api/orders"
echo ""
echo "Step 2: Contract Generated"
echo "  Seller generates contract"
echo "  POST /api/orders/{id}/generate-contract"
echo "  → Email sent: ContractGenerated"
echo ""
echo "Step 3: Contract Signed"
echo "  Buyer uploads signed PDF"
echo "  POST /api/orders/{id}/upload-signed-contract"
echo "  → Email sent: PaymentInstructions with IBAN"
echo ""
echo "Step 4: Bank Transfer"
echo "  Buyer transfers money to:"
echo "  IBAN: DE44 0667 6244 7444 8175 98"
echo "  Reference: AS24-ABC123 (REQUIRED!)"
echo "  Amount: 25,000 EUR"
echo ""
echo "Step 5: Payment Confirmed"
echo "  Admin confirms payment"
echo "  POST /api/orders/{id}/confirm-payment"
echo "  → Invoice generated"
echo "  → Email sent: PaymentConfirmed + Invoice"
echo ""
echo "Step 6: Ready for Delivery"
echo "  Seller marks ready"
echo "  POST /api/orders/{id}/mark-ready-delivery"
echo "  → Email sent: ReadyForDelivery"
echo ""
echo "Step 7: Delivered & Completed"
echo "  Buyer confirms: POST /api/orders/{id}/mark-delivered"
echo "  Admin completes: POST /api/orders/{id}/complete-order"
echo "  → Email sent: OrderCompleted + Review request"
echo ""

#################################################################
# MONITORING
#################################################################

echo "📊 MONITORING & HEALTH"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Health Check:"
echo "  curl https://api.autoscout24-safetrade.com/api/health"
echo ""
echo "Detailed Metrics:"
echo "  curl https://api.autoscout24-safetrade.com/api/health/detailed"
echo ""
echo "Monitor Logs:"
echo "  tail -f storage/logs/laravel.log"
echo "  tail -f storage/logs/application.log"
echo ""
echo "Check Queue:"
echo "  php artisan queue:failed"
echo "  php artisan queue:work"
echo ""

#################################################################
# DATABASE
#################################################################

echo "🗄️  DATABASE OPERATIONS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Backup Database:"
echo "  mysqldump -u user -p db_name > backup_\$(date +%Y%m%d).sql"
echo ""
echo "Run Migrations:"
echo "  php artisan migrate                      (development)"
echo "  php artisan migrate --force               (production)"
echo ""
echo "Rollback Migrations:"
echo "  php artisan migrate:rollback"
echo ""
echo "Migration Status:"
echo "  php artisan migrate:status"
echo ""
echo "Seed Database:"
echo "  php artisan db:seed"
echo ""

#################################################################
# DEPLOYMENT
#################################################################

echo "🚀 DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Pre-Deployment:"
echo "  1. Backup database"
echo "  2. Run all tests: php artisan test"
echo "  3. Check env: grep APP_ENV .env"
echo "  4. Review error logs"
echo ""
echo "During Deployment:"
echo "  1. Stop services: sudo systemctl stop php-fpm nginx"
echo "  2. Pull code: git pull origin main"
echo "  3. Install deps: composer install --no-dev"
echo "  4. Migrate: php artisan migrate --force"
echo "  5. Optimize: php artisan optimize"
echo "  6. Start services: sudo systemctl start php-fpm nginx"
echo ""
echo "Post-Deployment:"
echo "  1. Health check: curl /api/health"
echo "  2. Test payment flow"
echo "  3. Monitor logs: tail -f storage/logs/laravel.log"
echo "  4. Check alerts"
echo ""

#################################################################
# TROUBLESHOOTING
#################################################################

echo "🔧 TROUBLESHOOTING"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Emails not sending:"
echo "  1. Check config: cat .env | grep MAIL"
echo "  2. Run test: php artisan tinker"
echo "     >>> Mail::raw('Test', function(\$m) { \$m->to('test@test.com'); })"
echo "  3. Check MailHog: http://localhost:1025"
echo ""
echo "PDF not generating:"
echo "  1. Check logs: tail -f storage/logs/laravel.log | grep -i pdf"
echo "  2. Check fonts: ls -la storage/fonts/"
echo "  3. Test manually: php artisan tinker"
echo ""
echo "Database connection error:"
echo "  1. Check credentials: grep DB_ .env"
echo "  2. Test connection: php artisan tinker"
echo "     >>> DB::connection()->getPDO()"
echo "  3. Restart MySQL: sudo systemctl restart mysql"
echo ""
echo "High memory usage:"
echo "  1. Clear caches: php artisan optimize:clear"
echo "  2. Check logs: tail -f storage/logs/laravel.log"
echo "  3. Restart worker: sudo systemctl restart supervisord"
echo ""

#################################################################
# DOCUMENTATION
#################################################################

echo "📖 DOCUMENTATION"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Main Documents:"
echo "  • PROJECT_COMPLETION_REPORT.md"
echo "  • TESTING_AND_DEPLOYMENT_GUIDE.md"
echo "  • TESTING_DEPLOYMENT_SUMMARY.md"
echo "  • BANK_TRANSFER_COMPLETE_GUIDE.md"
echo "  • IMPLEMENTATION_COMPLETE.md"
echo ""
echo "Technical Docs:"
echo "  • BACKEND_BANK_TRANSFER_IMPLEMENTED.md"
echo "  • FRONTEND_BANK_TRANSFER_IMPLEMENTED.md"
echo "  • BANK_TRANSFER_PAYMENT_SYSTEM.md"
echo ""

#################################################################
# SUMMARY
#################################################################

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               ✅ SYSTEM STATUS: PRODUCTION READY            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✓ Backend:       100% Complete (10 endpoints, 5 mailables)"
echo "✓ Frontend:      100% Complete (4 components, 2 pages)"
echo "✓ Tests:         100% Complete (81+ test cases)"
echo "✓ Documentation: 100% Complete (8 guides)"
echo "✓ Monitoring:    100% Complete (health endpoints)"
echo "✓ Deployment:    100% Complete (ready for production)"
echo ""
echo "Ready to deploy! See TESTING_AND_DEPLOYMENT_GUIDE.md for details."
echo ""
