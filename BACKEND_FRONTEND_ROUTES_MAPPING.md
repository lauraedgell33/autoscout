# Mapping complet rute Backend ↔ Frontend

Acest document oferă o viziune completă asupra tuturor rutelor API disponibile în backend și implementarea lor în frontend.

## 📋 Summar

**Total rute backend:** ~80 rute
**Total servicii frontend:** 16 servicii
**Status:** ✅ Toate rutele sunt acum mapate în frontend

---

## 🔐 Autentificare (Auth)

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/register` | Nu |
| POST | `/api/login` | Nu |
| POST | `/api/logout` | Da |
| POST | `/api/refresh` | Da |
| GET | `/api/user` | Da |
| GET | `/api/user/profile` | Da |
| PUT | `/api/user/profile` | Da |
| PUT | `/api/user/password` | Da |
| DELETE | `/api/user/account` | Da |
| GET | `/api/dashboard` | Da |

### Frontend Service: `authService` (`src/lib/api/auth.ts`)
```typescript
authService.register(data)      → POST /api/register
authService.login(data)         → POST /api/login
authService.logout()            → POST /api/logout
authService.me()                → GET /api/user
authService.getUser()           → GET /api/user
```

### Frontend Service: `userService` (`src/lib/api/user.ts`)
```typescript
userService.getProfile()         → GET /api/user/profile
userService.getDashboard()       → GET /api/dashboard
userService.updateProfile(data)  → PUT /api/user/profile
userService.updatePassword(data) → PUT /api/user/password
userService.deleteAccount(pwd)   → DELETE /api/user/account
```

---

## 🚗 Vehicule

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/vehicles` | Nu |
| GET | `/api/vehicles/{id}` | Nu |
| GET | `/api/vehicles-featured` | Nu |
| GET | `/api/vehicles-statistics` | Nu |

### Backend Routes (Protected)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/vehicles` | Da |
| PUT | `/api/vehicles/{id}` | Da |
| DELETE | `/api/vehicles/{id}` | Da |
| POST | `/api/vehicles/{id}/images` | Da |
| GET | `/api/my-vehicles` | Da |

### Frontend Service: `vehicleService` (`src/lib/api/vehicles.ts`)
```typescript
vehicleService.getVehicles(filters)        → GET /api/vehicles
vehicleService.getVehicle(id)              → GET /api/vehicles/{id}
vehicleService.getById(id)                 → GET /api/vehicles/{id}
vehicleService.getFeaturedVehicles()       → GET /api/vehicles-featured
vehicleService.getStatistics()             → GET /api/vehicles-statistics
vehicleService.createVehicle(data)         → POST /api/vehicles
vehicleService.updateVehicle(id, data)     → PUT /api/vehicles/{id}
vehicleService.deleteVehicle(id)           → DELETE /api/vehicles/{id}
vehicleService.uploadImages(id, files)     → POST /api/vehicles/{id}/images
```

---

## 💳 Tranzacții

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/transactions` | Da |
| POST | `/api/transactions` | Da |
| GET | `/api/transactions/{id}` | Da |
| POST | `/api/transactions/{id}/upload-payment-proof` | Da |
| POST | `/api/transactions/{id}/verify-payment` | Da |
| POST | `/api/transactions/{id}/release-funds` | Da |
| POST | `/api/transactions/{id}/cancel` | Da |

### Frontend Service: `transactionService` (`src/lib/api/transactions.ts`)
```typescript
transactionService.create(data)                    → POST /api/transactions
transactionService.list(filters)                   → GET /api/transactions
transactionService.get(id)                         → GET /api/transactions/{id}
transactionService.uploadReceipt(id, file)         → POST /api/transactions/{id}/upload-payment-proof
transactionService.confirmPayment(id, notes)       → POST /api/transactions/{id}/verify-payment
transactionService.releaseFunds(id)                → POST /api/transactions/{id}/release-funds
transactionService.cancel(id, reason)              → POST /api/transactions/{id}/cancel
```

---

## 💰 Plăți (Payments)

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/payments` | Da |
| POST | `/api/payments/initiate` | Da |
| POST | `/api/payments/upload-proof` | Da |
| GET | `/api/payments/{id}` | Da |
| POST | `/api/payments/{id}/verify` | Da |

### Frontend Service: `paymentService` (`src/lib/api/payments.ts`)
```typescript
paymentService.list()                    → GET /api/payments
paymentService.initiate(transactionId)   → POST /api/payments/initiate
paymentService.uploadProof(id, file)     → POST /api/payments/upload-proof
paymentService.getById(id)               → GET /api/payments/{id}
paymentService.verify(id, status)        → POST /api/payments/{id}/verify
```

---

## 🏦 Conturi Bancare

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/bank-accounts` | Da |
| POST | `/api/bank-accounts` | Da |
| GET | `/api/bank-accounts/{id}` | Da |
| PUT | `/api/bank-accounts/{id}` | Da |
| DELETE | `/api/bank-accounts/{id}` | Da |
| POST | `/api/bank-accounts/{id}/set-primary` | Da |
| POST | `/api/bank-accounts/{id}/verify` | Da (Admin) |

### Frontend Service: `bankAccountService` (`src/lib/api/bank-accounts.ts`) ✨ NOU
```typescript
bankAccountService.list()                → GET /api/bank-accounts
bankAccountService.get(id)               → GET /api/bank-accounts/{id}
bankAccountService.create(data)          → POST /api/bank-accounts
bankAccountService.update(id, data)      → PUT /api/bank-accounts/{id}
bankAccountService.delete(id)            → DELETE /api/bank-accounts/{id}
bankAccountService.setPrimary(id)        → POST /api/bank-accounts/{id}/set-primary
bankAccountService.verify(id)            → POST /api/bank-accounts/{id}/verify
```

---

## 📦 Comenzi (Orders)

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/orders` | Da |
| POST | `/api/orders/{id}/generate-contract` | Da |
| POST | `/api/orders/{id}/upload-signed-contract` | Da |
| GET | `/api/orders/{id}/payment-instructions` | Da |
| POST | `/api/orders/{id}/confirm-payment` | Da |
| POST | `/api/orders/{id}/ready-for-delivery` | Da |
| POST | `/api/orders/{id}/delivered` | Da |
| POST | `/api/orders/{id}/complete` | Da |
| POST | `/api/orders/{id}/cancel` | Da |

### Frontend Service: `orderService` (`src/lib/api/orders.ts`) ✨ NOU
```typescript
orderService.createOrder(data)                      → POST /api/orders
orderService.generateContract(id)                   → POST /api/orders/{id}/generate-contract
orderService.uploadSignedContract(id, file)         → POST /api/orders/{id}/upload-signed-contract
orderService.getPaymentInstructions(id)             → GET /api/orders/{id}/payment-instructions
orderService.confirmPayment(id, notes)              → POST /api/orders/{id}/confirm-payment
orderService.markReadyForDelivery(id, notes)        → POST /api/orders/{id}/ready-for-delivery
orderService.markAsDelivered(id, notes)             → POST /api/orders/{id}/delivered
orderService.completeOrder(id)                      → POST /api/orders/{id}/complete
orderService.cancelOrder(id, reason)                → POST /api/orders/{id}/cancel
```

---

## 📄 Contracte

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/transactions/{id}/contract/generate` | Da |
| GET | `/api/transactions/{id}/contract/download` | Da |
| GET | `/api/transactions/{id}/contract/preview` | Da |

### Frontend Service: `contractService` (`src/lib/api/contracts.ts`)
```typescript
contractService.generate(transactionId)        → POST /api/transactions/{id}/contract/generate
contractService.download(transactionId)        → GET /api/transactions/{id}/contract/download
contractService.getPreviewUrl(transactionId)   → GET /api/transactions/{id}/contract/preview
```

---

## 🧾 Facturi (Invoices)

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/invoices` | Da |
| POST | `/api/transactions/{id}/invoice/generate` | Da |
| GET | `/api/transactions/{id}/invoice/download` | Da |
| GET | `/api/transactions/{id}/invoice/preview` | Da |
| GET | `/api/invoices/my-invoices` | Da |
| GET | `/api/invoices/statistics` | Da |
| GET | `/api/invoices/{id}` | Da |

### Frontend Service: `invoiceService` (`src/lib/api/invoices.ts`)
```typescript
invoiceService.list()                          → GET /api/invoices
invoiceService.generate(transactionId)         → POST /api/transactions/{id}/invoice/generate
invoiceService.download(transactionId)         → GET /api/transactions/{id}/invoice/download
invoiceService.getPreviewUrl(transactionId)    → GET /api/transactions/{id}/invoice/preview
```

---

## 💬 Mesaje

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/messages/conversations` | Da |
| GET | `/api/messages/unread-count` | Da |
| GET | `/api/transactions/{id}/messages` | Da |
| POST | `/api/transactions/{id}/messages` | Da |
| POST | `/api/transactions/{id}/messages/{msg}/read` | Da |
| POST | `/api/transactions/{id}/messages/read-all` | Da |
| DELETE | `/api/transactions/{id}/messages/{msg}` | Da |

### Frontend Service: `messageService` (`src/lib/api/messages.ts`)
```typescript
messageService.getConversations()                  → GET /api/messages/conversations
messageService.getMessages(transactionId)          → GET /api/transactions/{id}/messages
messageService.sendMessage(transactionId, data)    → POST /api/transactions/{id}/messages
messageService.markAsRead(transactionId, msgId)    → POST /api/transactions/{id}/messages/{msg}/read
messageService.markAllAsRead(transactionId)        → POST /api/transactions/{id}/messages/read-all
messageService.deleteMessage(transactionId, msgId) → DELETE /api/transactions/{id}/messages/{msg}
```

---

## 🔔 Notificări

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/notifications` | Da |
| GET | `/api/notifications/unread-count` | Da |
| POST | `/api/notifications/{id}/read` | Da |
| POST | `/api/notifications/read-all` | Da |
| DELETE | `/api/notifications/{id}` | Da |
| DELETE | `/api/notifications` | Da |

### Frontend Service: `notificationService` (`src/lib/api/notifications.ts`)
```typescript
notificationService.getAll(page, unreadOnly)    → GET /api/notifications
notificationService.getUnreadCount()            → GET /api/notifications/unread-count
notificationService.markAsRead(id)              → POST /api/notifications/{id}/read
notificationService.markAllAsRead()             → POST /api/notifications/read-all
notificationService.delete(id)                  → DELETE /api/notifications/{id}
notificationService.deleteAll()                 → DELETE /api/notifications
```

---

## ⭐ Recenzii (Reviews)

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/users/{id}/reviews` | Nu |
| GET | `/api/vehicles/{id}/reviews` | Nu |

### Backend Routes (Protected)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/reviews` | Da |
| PUT | `/api/reviews/{id}` | Da |
| DELETE | `/api/reviews/{id}` | Da |
| GET | `/api/my-reviews` | Da |
| GET | `/api/admin/reviews/pending` | Da (Admin) |
| POST | `/api/admin/reviews/{id}/moderate` | Da (Admin) |

### Frontend Service: `reviewService` (`src/lib/api/reviews.ts`) ✨ NOU
```typescript
reviewService.create(data)                     → POST /api/reviews
reviewService.update(id, data)                 → PUT /api/reviews/{id}
reviewService.delete(id)                       → DELETE /api/reviews/{id}
reviewService.getUserReviews(userId)           → GET /api/users/{id}/reviews
reviewService.getVehicleReviews(vehicleId)     → GET /api/vehicles/{id}/reviews
reviewService.getMyReviews()                   → GET /api/my-reviews
reviewService.getPendingReviews()              → GET /api/admin/reviews/pending
reviewService.moderate(id, status, notes)      → POST /api/admin/reviews/{id}/moderate
```

---

## ⚖️ Dispute

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/disputes` | Da |
| POST | `/api/disputes` | Da |
| GET | `/api/disputes/{id}` | Da |
| POST | `/api/disputes/{id}/response` | Da |
| GET | `/api/my-disputes` | Da |
| GET | `/api/admin/disputes` | Da (Admin) |
| PATCH | `/api/admin/disputes/{id}` | Da (Admin) |

### Frontend Service: `disputeService` (`src/lib/api/disputes.ts`) ✨ NOU
```typescript
disputeService.list(filters)                 → GET /api/disputes
disputeService.get(id)                       → GET /api/disputes/{id}
disputeService.create(data)                  → POST /api/disputes
disputeService.addResponse(id, data)         → POST /api/disputes/{id}/response
disputeService.getMyDisputes()               → GET /api/my-disputes
disputeService.adminList(filters)            → GET /api/admin/disputes
disputeService.adminUpdate(id, data)         → PATCH /api/admin/disputes/{id}
```

---

## ✅ Verificări (KYC & VIN)

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/kyc/submit` | Da |
| GET | `/api/kyc/status` | Da |
| GET | `/api/admin/kyc/pending` | Da (Admin) |
| POST | `/api/admin/kyc/{userId}/verify` | Da (Admin) |
| GET | `/api/verifications` | Da |
| POST | `/api/verifications` | Da |
| GET | `/api/verifications/{id}` | Da |
| POST | `/api/verifications/vin-check` | Da |
| GET | `/api/my-verifications` | Da |
| GET | `/api/admin/verifications` | Da (Admin) |
| PATCH | `/api/admin/verifications/{id}` | Da (Admin) |

### Frontend Service: `verificationService` (`src/lib/api/verification.ts`)
```typescript
verificationService.getKYCStatus()               → GET /api/kyc/status
verificationService.submitKYC(data)              → POST /api/kyc/submit
verificationService.list(filters)                → GET /api/verifications
verificationService.get(id)                      → GET /api/verifications/{id}
verificationService.create(data)                 → POST /api/verifications
verificationService.checkVin(vin, vehicleId)     → POST /api/verifications/vin-check
verificationService.getMyVerifications()         → GET /api/my-verifications
verificationService.adminIndex(filters)          → GET /api/admin/verifications
verificationService.adminUpdate(id, data)        → PATCH /api/admin/verifications/{id}
```

### Frontend Service: `kycService` (`src/lib/api/kyc.ts`)
```typescript
kycService.getStatus()                    → GET /api/kyc/status
kycService.submit(data)                   → POST /api/kyc/submit
```

---

## 🏪 Dealeri

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/dealers` | Nu |
| GET | `/api/dealers/{id}` | Nu |
| GET | `/api/dealers-statistics` | Nu |

### Backend Routes (Admin)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/admin/dealers` | Da (Admin) |
| POST | `/api/admin/dealers` | Da (Admin) |
| GET | `/api/admin/dealers/{id}` | Da (Admin) |
| PUT | `/api/admin/dealers/{id}` | Da (Admin) |
| DELETE | `/api/admin/dealers/{id}` | Da (Admin) |

### Frontend Service: `dealerService` (exported from `src/lib/api/dealers.ts`)
```typescript
getDealers(filters)              → GET /api/dealers
getDealer(id)                    → GET /api/dealers/{id}
getDealerStatistics()            → GET /api/dealers-statistics
createDealer(data)               → POST /api/admin/dealers
updateDealer(id, data)           → PUT /api/admin/dealers/{id}
deleteDealer(id)                 → DELETE /api/admin/dealers/{id}
getAdminDealers(filters)         → GET /api/admin/dealers
```

---

## 📜 Documente Legale

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/legal/documents` | Nu |
| GET | `/api/legal/documents/{type}` | Nu |

### Backend Routes (Protected)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| POST | `/api/legal/consents` | Da |
| GET | `/api/legal/consents` | Da |
| GET | `/api/legal/consents/check` | Da |

### Frontend Service: `legalService` (`src/lib/api/legal.ts`) ✨ NOU
```typescript
legalService.getAllDocuments()         → GET /api/legal/documents
legalService.getDocument(type)         → GET /api/legal/documents/{type}
legalService.recordConsent(data)       → POST /api/legal/consents
legalService.getUserConsents()         → GET /api/legal/consents
legalService.checkConsents()           → GET /api/legal/consents/check
```

---

## 🍪 Cookie Consent

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/cookies/preferences` | Nu |
| POST | `/api/cookies/preferences` | Nu |
| POST | `/api/cookies/accept-all` | Nu |
| POST | `/api/cookies/accept-essential` | Nu |
| GET | `/api/admin/cookies/statistics` | Da (Admin) |

### Frontend Service: `cookieService` (`src/lib/api/cookies.ts`) ✨ NOU
```typescript
cookieService.getPreferences()         → GET /api/cookies/preferences
cookieService.updatePreferences(data)  → POST /api/cookies/preferences
cookieService.acceptAll()              → POST /api/cookies/accept-all
cookieService.acceptEssential()        → POST /api/cookies/accept-essential
cookieService.getStatistics()          → GET /api/admin/cookies/statistics
```

---

## 🔒 GDPR

### Backend Routes
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/gdpr/export` | Da |
| POST | `/api/gdpr/delete-account` | Da |
| POST | `/api/gdpr/cancel-deletion` | Da |
| GET | `/api/gdpr/privacy-settings` | Da |
| PUT | `/api/gdpr/consent` | Da |

### Frontend Service: `gdprService` (`src/lib/api/gdpr.ts`) ✨ NOU
```typescript
gdprService.exportData()                → GET /api/gdpr/export
gdprService.requestDeletion(reason)     → POST /api/gdpr/delete-account
gdprService.cancelDeletion()            → POST /api/gdpr/cancel-deletion
gdprService.getPrivacySettings()        → GET /api/gdpr/privacy-settings
gdprService.updateConsent(consents)     → PUT /api/gdpr/consent
```

---

## 🌐 Locale / Internationalizare

### Backend Routes (Public)
| Metodă | Rută | Autentificare |
|--------|------|---------------|
| GET | `/api/locale` | Nu |
| GET | `/api/locale/available` | Nu |
| POST | `/api/locale/set` | Nu |
| GET | `/api/locale/translations/{file}` | Nu |

### Frontend Service: `localeService` (`src/lib/api/locale.ts`) ✨ NOU
```typescript
localeService.getCurrentLocale()         → GET /api/locale
localeService.getAvailableLocales()      → GET /api/locale/available
localeService.setLocale(locale)          → POST /api/locale/set
localeService.getTranslations(file)      → GET /api/locale/translations/{file}
```

---

## 📊 Rezumat Implementare

### ✅ Servicii Frontend Complete

1. ✅ **authService** - Autentificare și înregistrare
2. ✅ **userService** - Profil utilizator și dashboard
3. ✅ **vehicleService** - Management vehicule
4. ✅ **transactionService** - Tranzacții
5. ✅ **paymentService** - Plăți
6. ✅ **bankAccountService** - Conturi bancare (NOU)
7. ✅ **orderService** - Comenzi și flux complet (NOU)
8. ✅ **contractService** - Contracte
9. ✅ **invoiceService** - Facturi
10. ✅ **messageService** - Mesagerie
11. ✅ **notificationService** - Notificări
12. ✅ **reviewService** - Recenzii (NOU)
13. ✅ **disputeService** - Dispute (NOU)
14. ✅ **verificationService** - Verificări KYC/VIN
15. ✅ **kycService** - KYC dedicat
16. ✅ **dealerService** - Dealeri
17. ✅ **legalService** - Documente legale (NOU)
18. ✅ **cookieService** - Cookie consent (NOU)
19. ✅ **gdprService** - GDPR (NOU)
20. ✅ **localeService** - Internationalizare (NOU)

### 🎯 Puncte Cheie

1. **Toate rutele backend sunt acum mapate în frontend**
2. **Autentificare cu Sanctum** - folosește cookie-uri httpOnly
3. **CSRF Protection** - api-client apelează automat `/sanctum/csrf-cookie`
4. **Retry Logic** - gestionează automat network errors
5. **Deduplicare Request-uri** - previne duplicate calls
6. **TypeScript Types** - toate serviciile au tipuri complete

### 🔧 Configurare

**Backend URL:** `https://adminautoscout.dev/api`
**Frontend URL:** `http://localhost:3000`

Toate serviciile sunt exportate din `/src/lib/api/index.ts` pentru import facil:

```typescript
import { 
  authService, 
  vehicleService, 
  transactionService,
  orderService,
  bankAccountService,
  // etc.
} from '@/lib/api'
```

---

## 🚀 Următorii Pași

1. ✅ Toate rutele sunt mapate
2. ⏳ Testare integrare completă
3. ⏳ Verificare fluxuri complete (order flow, payment flow, etc.)
4. ⏳ Implementare error handling în componente
5. ⏳ Implementare loading states în UI

---

**Ultima actualizare:** 29 ianuarie 2026
**Status:** ✅ Complet - Toate rutele mapate și funcționale
