<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AutoScout24WebhookController;
use App\Http\Controllers\API\BankAccountController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\LegalController;
use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\API\DisputeController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\KYCController;
use App\Http\Controllers\API\ContractController;
use App\Http\Controllers\API\InvoiceController;
use App\Http\Controllers\API\LocaleController;
use App\Http\Controllers\Api\CookieConsentController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\SettingsController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\API\PushSubscriptionController;
use App\Http\Controllers\API\SearchController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ErrorLogController;
use App\Http\Controllers\API\FavoritesController;
use App\Http\Controllers\API\Admin\ReviewModerationController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

// Public settings endpoints
Route::get('/settings', [SettingsController::class, 'index']);
Route::prefix('frontend')->group(function () {
    Route::get('/settings', [SettingsController::class, 'frontendSettings']);
    Route::get('/contact-settings', [SettingsController::class, 'contactSettings']);
    Route::get('/locales', [LocaleController::class, 'getAvailableLocales']);
});

// Locale routes (public)
Route::prefix('locale')->group(function () {
    Route::get('/', [LocaleController::class, 'getCurrentLocale']);
    Route::get('/available', [LocaleController::class, 'getAvailableLocales']);
    Route::post('/set', [LocaleController::class, 'setLocale']);
    Route::get('/translations/{file}', [LocaleController::class, 'getTranslations']);
});

// Public routes - with rate limiting
Route::middleware('rate.limit.ip:5,1')->post('/register', [AuthController::class, 'register']);
Route::middleware('rate.limit.ip:5,1')->post('/login', [AuthController::class, 'login']);

// Error logging routes (FREE Sentry alternative)
Route::post('/errors', [ErrorLogController::class, 'log']);
Route::post('/security/violations', [ErrorLogController::class, 'logViolation']);

// AutoScout24 Webhooks (no auth - signature verified internally)
Route::post('/webhooks/autoscout24', [AutoScout24WebhookController::class, 'handleWebhook']);

// Public legal documents
Route::get('/legal-documents', [LegalController::class, 'getAllDocuments']);
Route::get('/legal/documents', [LegalController::class, 'getAllDocuments']);
Route::get('/legal/documents/{type}', [LegalController::class, 'getDocument']);
Route::get('/legal/terms', [LegalController::class, 'getTerms']);
Route::get('/legal/privacy', [LegalController::class, 'getPrivacy']);
Route::get('/legal/cookies', [LegalController::class, 'getCookies']);

// Public vehicle routes (browsing)
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
Route::get('/vehicles-featured', [VehicleController::class, 'featured']);
Route::get('/vehicles-statistics', [VehicleController::class, 'statistics']);

// Public category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Search routes (public) - with rate limiting
Route::middleware('rate.limit.ip:30,1')->prefix('search')->group(function () {
    Route::get('/vehicles', [SearchController::class, 'searchVehicles']);
    Route::get('/filters', [SearchController::class, 'getFilters']);
});

// Protected search routes
Route::middleware('auth:sanctum')->prefix('search')->group(function () {
    Route::get('/transactions', [SearchController::class, 'searchTransactions']);
    Route::get('/messages', [SearchController::class, 'searchMessages']);
});

// Public dealer routes
Route::get('/dealers', [App\Http\Controllers\API\DealerController::class, 'index']);
Route::get('/dealers/{dealer}', [App\Http\Controllers\API\DealerController::class, 'show']);
Route::get('/dealers-statistics', [App\Http\Controllers\API\DealerController::class, 'statistics']);

// Public review routes
Route::get('/reviews', [App\Http\Controllers\API\ReviewController::class, 'index']);
Route::get('/users/{user}/reviews', [App\Http\Controllers\API\ReviewController::class, 'getUserReviews']);
Route::get('/vehicles/{vehicle}/reviews', [App\Http\Controllers\API\ReviewController::class, 'getVehicleReviews']);

// Cookie consent routes (public)
Route::prefix('cookies')->group(function () {
    Route::get('/preferences', [CookieConsentController::class, 'show']);
    Route::post('/preferences', [CookieConsentController::class, 'update']);
    Route::post('/accept-all', [CookieConsentController::class, 'acceptAll']);
    Route::post('/accept-essential', [CookieConsentController::class, 'acceptEssential']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // User Profile
    Route::get('/user/profile', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    Route::delete('/user/account', [AuthController::class, 'deleteAccount']);
    
    // Dashboard
    Route::get('/dashboard', [AuthController::class, 'dashboard']);
    
    // KYC
    Route::post('/kyc/submit', [KYCController::class, 'submit'])->middleware('throttle:10,60');
    Route::get('/kyc/status', [KYCController::class, 'status']);
    
    // Vehicles (CRUD)
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);
    Route::post('/vehicles/{vehicle}/images', [VehicleController::class, 'uploadImages'])->middleware('throttle:10,60');
    Route::get('/my-vehicles', [VehicleController::class, 'myVehicles']);
    
    // Favorites
    Route::get('/favorites', [FavoritesController::class, 'index']);
    Route::post('/favorites', [FavoritesController::class, 'store']);
    Route::delete('/favorites/{vehicle_id}', [FavoritesController::class, 'destroy']);
    Route::get('/favorites/check/{vehicle_id}', [FavoritesController::class, 'check']);
    
    // Transactions (Bank Transfer Escrow Flow)
    Route::get('transactions', [TransactionController::class, 'index']);
    Route::get('transactions/statistics', [TransactionController::class, 'statistics']);
    Route::post('transactions', [TransactionController::class, 'store']);
    Route::get('transactions/{id}', [TransactionController::class, 'show']);
    Route::post('transactions/{id}/upload-payment-proof', [TransactionController::class, 'uploadPaymentProof'])->middleware('throttle:10,60');
    Route::post('transactions/{id}/upload-receipt', [TransactionController::class, 'uploadReceipt'])->middleware('throttle:10,60');
    Route::post('transactions/{id}/confirm-payment', [TransactionController::class, 'confirmPayment']);
    Route::post('transactions/{id}/schedule-inspection', [TransactionController::class, 'scheduleInspection']);
    Route::post('transactions/{id}/complete-inspection', [TransactionController::class, 'completeInspection']);
    Route::post('transactions/{id}/verify-payment', [TransactionController::class, 'verifyPayment']);
    Route::post('transactions/{id}/release-funds', [TransactionController::class, 'releaseFunds']);
    Route::post('transactions/{id}/raise-dispute', [TransactionController::class, 'raiseDispute']);
    Route::post('transactions/{id}/refund', [TransactionController::class, 'refund']);
    Route::post('transactions/{id}/cancel', [TransactionController::class, 'cancel']);
    
    // Contracts
    Route::post('transactions/{transaction}/contract/generate', [ContractController::class, 'generate'])->name('api.contracts.generate');
    Route::get('transactions/{transaction}/contract/download', [ContractController::class, 'download'])->name('api.contracts.download');
    Route::get('transactions/{transaction}/contract/preview', [ContractController::class, 'preview'])->name('api.contracts.preview');
    
    // Invoices
    Route::get('invoices', [InvoiceController::class, 'index']);
    Route::post('transactions/{transaction}/invoice/generate', [InvoiceController::class, 'generate'])->name('api.invoices.generate');
    Route::get('transactions/{transaction}/invoice/download', [InvoiceController::class, 'download'])->name('api.invoices.download');
    Route::get('transactions/{transaction}/invoice/preview', [InvoiceController::class, 'preview'])->name('api.invoices.preview');
    
    // Payments
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments/initiate', [PaymentController::class, 'initiate']);
    Route::post('payments/upload-proof', [PaymentController::class, 'uploadProof'])->middleware('throttle:10,60');
    Route::get('payments/{payment}', [PaymentController::class, 'show']);
    Route::post('payments/{payment}/verify', [PaymentController::class, 'verify']);
    
    // Bank Accounts (Verified Bank Transfer System)
    Route::get('bank-accounts', [BankAccountController::class, 'index']);
    Route::post('bank-accounts', [BankAccountController::class, 'store']);
    Route::get('bank-accounts/{bank_account}', [BankAccountController::class, 'show']);
    Route::put('bank-accounts/{bank_account}', [BankAccountController::class, 'update']);
    Route::delete('bank-accounts/{bank_account}', [BankAccountController::class, 'destroy']);
    Route::post('bank-accounts/{bank_account}/set-primary', [BankAccountController::class, 'setPrimary']);
    Route::post('bank-accounts/{bank_account}/verify', [BankAccountController::class, 'verify']); // Admin only
    
    // Legal - User consents
    Route::post('legal/consents', [LegalController::class, 'recordConsent']);
    Route::get('legal/consents', [LegalController::class, 'getUserConsents']);
    Route::get('legal/consents/check', [LegalController::class, 'checkConsents']);
    
    // Verifications (KYC, VIN checks)
    Route::get('verifications', [VerificationController::class, 'index']);
    Route::post('verifications', [VerificationController::class, 'store']);
    Route::get('verifications/{id}', [VerificationController::class, 'show']);
    Route::post('verifications/vin-check', [VerificationController::class, 'checkVin']);
    Route::get('my-verifications', [VerificationController::class, 'myVerifications']);
    
    // Disputes
    Route::get('disputes', [DisputeController::class, 'index']);
    Route::post('disputes', [DisputeController::class, 'store']);
    Route::get('disputes/{id}', [DisputeController::class, 'show']);
    Route::post('disputes/{id}/response', [DisputeController::class, 'addResponse']);
    Route::get('my-disputes', [DisputeController::class, 'myDisputes']);
    
    // Messages
    Route::get('messages', [App\Http\Controllers\API\MessageController::class, 'allMessages']);
    Route::get('messages/conversations', [App\Http\Controllers\API\MessageController::class, 'conversations']);
    Route::get('messages/unread-count', [App\Http\Controllers\API\MessageController::class, 'unreadCount']);
    Route::get('transactions/{transaction}/messages', [App\Http\Controllers\API\MessageController::class, 'index']);
    Route::post('transactions/{transaction}/messages', [App\Http\Controllers\API\MessageController::class, 'store']);
    Route::post('transactions/{transaction}/messages/{message}/read', [App\Http\Controllers\API\MessageController::class, 'markAsRead']);
    Route::post('transactions/{transaction}/messages/read-all', [App\Http\Controllers\API\MessageController::class, 'markAllAsRead']);
    Route::delete('transactions/{transaction}/messages/{message}', [App\Http\Controllers\API\MessageController::class, 'destroy']);
    
    // Reviews
    Route::post('reviews', [App\Http\Controllers\API\ReviewController::class, 'store']);
    Route::put('reviews/{review}', [App\Http\Controllers\API\ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [App\Http\Controllers\API\ReviewController::class, 'destroy']);
    Route::get('my-reviews', [App\Http\Controllers\API\ReviewController::class, 'myReviews']);
    Route::post('reviews/{review}/flag', [App\Http\Controllers\API\ReviewController::class, 'flag']);
    Route::post('reviews/{review}/vote', [App\Http\Controllers\API\ReviewController::class, 'vote']);
    
    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{id}', [NotificationController::class, 'delete']);
    Route::delete('notifications', [NotificationController::class, 'deleteAll']);
    
    // Push Notifications - PWA Device Subscriptions
    Route::post('push-subscriptions/subscribe', [PushSubscriptionController::class, 'subscribe']);
    Route::post('push-subscriptions/unsubscribe', [PushSubscriptionController::class, 'unsubscribe']);
    Route::get('push-subscriptions', [PushSubscriptionController::class, 'list']);
    Route::delete('push-subscriptions/{id}', [PushSubscriptionController::class, 'destroy']);
    
    // GDPR - Privacy & Data Rights
    Route::prefix('gdpr')->group(function () {
        Route::get('/export', [App\Http\Controllers\API\GdprController::class, 'exportData']);
        Route::post('/delete-account', [App\Http\Controllers\API\GdprController::class, 'requestDeletion']);
        Route::post('/cancel-deletion', [App\Http\Controllers\API\GdprController::class, 'cancelDeletion']);
        Route::get('/privacy-settings', [App\Http\Controllers\API\GdprController::class, 'getPrivacySettings']);
        Route::put('/consent', [App\Http\Controllers\API\GdprController::class, 'updateConsent']);
    });
    
    // Bank Transfer Payment System (New Order Flow)
    Route::prefix('orders')->group(function () {
        // 1. Create initial order (buyer)
        Route::post('/', [OrderController::class, 'createOrder'])->name('api.orders.create');
        
        // 2. Generate contract (dealer)
        Route::post('/{transaction}/generate-contract', [OrderController::class, 'generateContract'])->name('api.orders.generate-contract');
        
        // 3. Upload signed contract (buyer)
        Route::post('/{transaction}/upload-signed-contract', [OrderController::class, 'uploadSignedContract'])->name('api.orders.upload-contract');
        
        // 4. Get payment instructions (buyer - after contract upload)
        Route::get('/{transaction}/payment-instructions', [OrderController::class, 'getPaymentInstructions'])->name('api.orders.payment-instructions');
        
        // 5. Confirm payment received (admin/dealer - manual)
        Route::post('/{transaction}/confirm-payment', [OrderController::class, 'confirmPayment'])->name('api.orders.confirm-payment');
        
        // 6. Mark vehicle ready for delivery (dealer)
        Route::post('/{transaction}/ready-for-delivery', [OrderController::class, 'markReadyForDelivery'])->name('api.orders.ready-delivery');
        
        // 7. Mark vehicle as delivered (dealer/buyer)
        Route::post('/{transaction}/delivered', [OrderController::class, 'markAsDelivered'])->name('api.orders.delivered');
        
        // 8. Complete order (automatic after delivery confirmation)
        Route::post('/{transaction}/complete', [OrderController::class, 'completeOrder'])->name('api.orders.complete');
        
        // 9. Cancel order (buyer/dealer - before payment confirmed)
        Route::post('/{transaction}/cancel', [OrderController::class, 'cancelOrder'])->name('api.orders.cancel');
    });
});


// Invoice Routes
Route::middleware('auth:sanctum')->prefix('invoices')->group(function () {
    Route::post('/generate', [App\Http\Controllers\API\InvoiceController::class, 'generate']);
    Route::get('/my-invoices', [App\Http\Controllers\API\InvoiceController::class, 'myInvoices']);
    Route::get('/statistics', [App\Http\Controllers\API\InvoiceController::class, 'statistics']);
    Route::get('/{id}', [App\Http\Controllers\API\InvoiceController::class, 'show']);
    Route::post('/{id}/upload-proof', [App\Http\Controllers\API\InvoiceController::class, 'uploadPaymentProof'])->middleware('throttle:10,60');
    Route::post('/{id}/verify', [App\Http\Controllers\API\InvoiceController::class, 'verifyPayment']);
    Route::post('/{id}/cancel', [App\Http\Controllers\API\InvoiceController::class, 'cancel']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard & Analytics
    Route::prefix('dashboard')->group(function () {
        Route::get('/overall', [DashboardController::class, 'getOverallStats']);
        Route::get('/transactions', [DashboardController::class, 'getTransactionAnalytics']);
        Route::get('/revenue', [DashboardController::class, 'getRevenueAnalytics']);
        Route::get('/users', [DashboardController::class, 'getUserAnalytics']);
        Route::get('/vehicles', [DashboardController::class, 'getVehicleAnalytics']);
        Route::get('/compliance', [DashboardController::class, 'getComplianceAnalytics']);
        Route::get('/engagement', [DashboardController::class, 'getEngagementAnalytics']);
        Route::get('/payments', [DashboardController::class, 'getPaymentAnalytics']);
        Route::get('/comprehensive', [DashboardController::class, 'getComprehensiveReport']);
        Route::post('/export', [DashboardController::class, 'exportReport']);
    });

    // Dealer management
    Route::get('/dealers', [App\Http\Controllers\API\DealerController::class, 'index']);
    Route::post('/dealers', [App\Http\Controllers\API\DealerController::class, 'store']);
    Route::get('/dealers/{dealer}', [App\Http\Controllers\API\DealerController::class, 'show']);
    Route::put('/dealers/{dealer}', [App\Http\Controllers\API\DealerController::class, 'update']);
    Route::delete('/dealers/{dealer}', [App\Http\Controllers\API\DealerController::class, 'destroy']);
    
    // KYC Management
    Route::get('/kyc/pending', [KYCController::class, 'pending']);
    Route::post('/kyc/{userId}/verify', [KYCController::class, 'verify']);
    
    // Verifications management
    Route::get('verifications', [VerificationController::class, 'adminIndex']);
    Route::patch('verifications/{id}', [VerificationController::class, 'adminUpdate']);
    
    // Disputes management
    Route::get('disputes', [DisputeController::class, 'adminIndex']);
    Route::patch('disputes/{id}', [DisputeController::class, 'adminUpdate']);
    
    // Reviews management
    Route::get('reviews/pending', [App\Http\Controllers\API\ReviewController::class, 'pending']);
    Route::post('reviews/{review}/moderate', [App\Http\Controllers\API\ReviewController::class, 'moderate']);
    
    // Review moderation (new enhanced endpoints)
    Route::prefix('reviews')->group(function () {
        Route::get('/pending', [ReviewModerationController::class, 'pending']);
        Route::get('/flagged', [ReviewModerationController::class, 'flagged']);
        Route::post('/{review}/verify', [ReviewModerationController::class, 'verify']);
        Route::post('/{review}/reject', [ReviewModerationController::class, 'reject']);
        Route::get('/statistics', [ReviewModerationController::class, 'statistics']);
    });
    
    // Cookie statistics
    Route::get('/cookies/statistics', [CookieConsentController::class, 'statistics']);
    
    // Error Logs (FREE Sentry alternative)
    Route::get('/errors', [ErrorLogController::class, 'index']);
    Route::get('/errors/statistics', [ErrorLogController::class, 'statistics']);
    Route::get('/errors/{index}', [ErrorLogController::class, 'show']);
});
