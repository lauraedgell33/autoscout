# 🚀 PLAN COMPLET DE TESTARE ȘI PREGĂTIRE PENTRU PRODUCȚIE

**Data:** 30 Ianuarie 2026  
**Deadline:** Luni (3 februarie 2026)  
**Status:** 🟡 În planificare  
**Platforme:** Vercel (Frontend) + Forge (Backend)

---

## 📋 EXECUTIVE SUMMARY

Plan complet de testare a aplicației ScoutSafePay cu testarea tuturor componentelor:
- ✅ Interfață frontend (UI/UX)
- ✅ API endpoints backend
- ✅ Rutele și resursele backend
- ✅ Funcționalități critice
- ✅ Integrări externe
- ✅ Performance și securitate

**Durata estimată:** 3 zile lucru  
**Echipă:** 1 person full-time  
**Buffer:** 1 zi pentru remedierea bug-urilor

---

## 🔐 FAZA 1: PREGĂTIRE PENTRU TESTARE (2 ore)

### 1.1 Verificare Variabile de Mediu

#### Backend (Forge)
```bash
✓ APP_ENV=production
✓ APP_DEBUG=false
✓ DATABASE_CONNECTION=mysql
✓ STRIPE_SECRET_KEY=sk_live_*
✓ STRIPE_PUBLISHABLE_KEY=pk_live_*
✓ MAIL_MAILER=sendgrid
✓ JWT_SECRET=secret_key_set
✓ REDIS_HOST=redis_server
✓ WEBSOCKET_URL=wss://api.domain.com
✓ FRONTEND_URL=https://vercel-app.vercel.app
```

#### Frontend (Vercel)
```bash
✓ NEXT_PUBLIC_API_URL=https://api.domain.com
✓ NEXT_PUBLIC_STRIPE_KEY=pk_live_*
✓ NEXT_PUBLIC_WEBSOCKET_URL=wss://api.domain.com
✓ NEXT_PUBLIC_MAPBOX_TOKEN=mapbox_token
✓ NEXT_PUBLIC_APP_NAME=ScoutSafePay
```

### 1.2 Setup Test Accounts

**Admin Account:**
- Email: admin@test.com
- Password: SecurePassword123!
- Role: Administrator
- Status: ✓ Active

**Seller Account:**
- Email: seller@test.com
- Password: SecurePassword123!
- Role: Seller
- Status: ✓ Active

**Buyer Account:**
- Email: buyer@test.com
- Password: SecurePassword123!
- Role: User/Buyer
- Status: ✓ Active

**Test Stripe Cards:**
- Visa: 4242 4242 4242 4242 (Success)
- Visa Decline: 4000 0000 0000 0002 (Decline)
- 3D Secure: 4000 0025 0000 3155

### 1.3 Setup Monitoring Tools

- ✓ Enable Forge logging
- ✓ Enable Vercel analytics
- ✓ Setup error tracking (Sentry/similar)
- ✓ Setup performance monitoring
- ✓ Test email delivery (SendGrid)
- ✓ Test SMS (if applicable)

---

## 🧪 FAZA 2: TESTARE AUTENTIFICARE ȘI AUTORIZARE (2-3 ore)

### 2.1 Registrare Utilizator

**Happy Path:**
- [ ] Deschid signup page
- [ ] Introduc email valid
- [ ] Introduc parolă (min 8 caractere, upper+lower+number+special)
- [ ] Confirm parolă identică
- [ ] Bifez "Terms & Conditions"
- [ ] Click "Register"
- **Expected:** Email de confirmare trimis + redirect la email verification
- [ ] Verific email primit
- [ ] Click link de confirmare
- **Expected:** Account activat, redirect la login

**Edge Cases:**
- [ ] Email deja înregistrat → Error message "Email already exists"
- [ ] Parolă slabă → Validation message
- [ ] Parolă nepotrivită → "Passwords don't match"
- [ ] Email invalid → "Invalid email format"
- [ ] Terms neacceptate → "You must accept terms"
- [ ] Spam email → Verific folder Spam

### 2.2 Login

**Happy Path:**
- [ ] Deschid login page
- [ ] Introduc email
- [ ] Introduc parolă
- [ ] Click "Login"
- **Expected:** JWT token primit, redirect la dashboard
- [ ] Verific localStorage pentru token
- [ ] Token trebuie să conțină: user_id, email, role

**Edge Cases:**
- [ ] Email neexistent → "Invalid credentials"
- [ ] Parolă greșită → "Invalid credentials"
- [ ] Account neconfirmat → "Please verify email"
- [ ] Account blocked → "Account suspended"
- [ ] Login cu 2FA enabled → Cerere OTP

### 2.3 Two-Factor Authentication (2FA)

- [ ] Activez 2FA în settings
- [ ] Scan QR code cu Google Authenticator
- [ ] Verific backup codes salvate
- [ ] Logout și login cu 2FA
- [ ] Introduc OTP din app
- **Expected:** Login successful
- [ ] Introduc OTP greșit
- **Expected:** Error message, 3 tentative max
- [ ] După 3 tentative eșuate → Account locked 15 min

### 2.4 Password Reset

- [ ] Click "Forgot Password"
- [ ] Introduc email
- [ ] **Expected:** Email reset trimis
- [ ] Click link din email
- [ ] **Expected:** Reset password form deschis
- [ ] Introduc parolă nouă
- [ ] Confirm noua parolă
- [ ] Click "Reset"
- **Expected:** Parolă actualizată, redirect la login
- [ ] Login cu noua parolă
- **Expected:** Success

### 2.5 Token Management

**Access Token:**
- [ ] Verific durată de expirare (15 min standard)
- [ ] Token trebuie trimis în header: `Authorization: Bearer <token>`
- [ ] Token expirat → Auto-refresh cu refresh token
- [ ] Token refresh trebuie să returneze nou access token

**Refresh Token:**
- [ ] Verific durată de expirare (7 zile standard)
- [ ] Stockat în httpOnly cookie (secure)
- [ ] Nu trebuie accesibil din JavaScript
- [ ] Logout trebuie să invalideze refresh token

### 2.6 Role-Based Access Control (RBAC)

**Admin Capabilities:**
- [ ] Acces la Admin Dashboard
- [ ] Manage users (view, edit, delete, block)
- [ ] Manage listings (view, edit, delete, feature)
- [ ] View analytics
- [ ] Configure system settings
- [ ] View all transactions
- [ ] Access reports

**Seller Capabilities:**
- [ ] Create/edit/delete own listings
- [ ] View own orders
- [ ] View own sales
- [ ] Manage inventory
- [ ] View earnings report
- [ ] Withdraw funds

**Buyer Capabilities:**
- [ ] Search listings
- [ ] View listing details
- [ ] Make purchases
- [ ] View order history
- [ ] Rate/review sellers
- [ ] Message sellers

**Permission Validation:**
- [ ] Buyer trying to access admin panel → 403 Forbidden
- [ ] Seller trying to edit other seller's listing → 403 Forbidden
- [ ] Unauthenticated user accessing protected route → 401 Unauthorized

---

## 🔍 FAZA 3: TESTARE MODULUL CĂUTARE (PHASE 8) (3 ore)

### 3.1 Search Basic

- [ ] Deschid search page
- [ ] Introduc search term "Toyota Camry"
- **Expected:** Rezultate relevante afișate
- [ ] Verific relevance ranking
- [ ] Pagination funcționează (prev/next)
- [ ] Results count display corect

### 3.2 Advanced Filters

**Location Filter:**
- [ ] Select city "București"
- **Expected:** Doar rezultate din București
- [ ] Range select rază 50km
- **Expected:** Rezultate în rază selectată
- [ ] Geolocation "Use my location"
- **Expected:** Detetează locația curentă

**Price Filter:**
- [ ] Set min price: 5000
- [ ] Set max price: 15000
- **Expected:** Doar vehicule în range
- [ ] Filter range slider funcționează smooth
- [ ] Clear filter buton resetează

**Year Filter:**
- [ ] Select min year: 2015
- [ ] Select max year: 2023
- **Expected:** Doar vehicule în interval
- [ ] Year dropdown populate corect

**Brand/Model Filter:**
- [ ] Select brand "Toyota"
- **Expected:** Models dropdown se populate automat
- [ ] Select model "Camry"
- **Expected:** Doar Toyota Camry-uri
- [ ] Multi-select funcționează

**Mileage Filter:**
- [ ] Set max mileage: 100000 km
- **Expected:** Doar sub 100k km
- [ ] Slider functionality smooth

**Condition Filter:**
- [ ] Filter "New" → Doar noi
- [ ] Filter "Used" → Doar second-hand
- [ ] Multi-select condiționer

**Transmission Filter:**
- [ ] Filter "Automatic"
- [ ] Filter "Manual"
- [ ] Filter "CVT"

**Fuel Type Filter:**
- [ ] Filter "Petrol"
- [ ] Filter "Diesel"
- [ ] Filter "Hybrid"
- [ ] Filter "Electric"

### 3.3 Sorting

- [ ] Sort "Newest First" → Cele mai noi în top
- [ ] Sort "Price: Low to High" → Ordonare crescătoare
- [ ] Sort "Price: High to Low" → Ordonare descrescătoare
- [ ] Sort "Mileage: Low to High"
- [ ] Sort "Popularity" → Cele mai vizionate
- [ ] Sort "Ratings" → Highest rated first

### 3.4 Autocomplete & Suggestions

- [ ] Introduc "Toy" → "Toyota" suggestion
- [ ] Introduc "Cam" → "Camry" suggestion
- [ ] Click suggestion → Auto-complete field
- [ ] Recent searches saved
- [ ] Popular searches displayed

### 3.5 Search Performance

- [ ] Search response time < 500ms
- [ ] API pagination: 20 items per page
- [ ] Lazy load images
- [ ] Infinite scroll funcționează smooth
- [ ] No N+1 query problems

### 3.6 Save Search & Alerts

- [ ] Click "Save Search"
- **Expected:** Modal save search cu custom name
- [ ] Introduc nume "Toyota under 10k"
- [ ] Set alert "Email me when new match found"
- [ ] Click Save
- **Expected:** Salvat în favorites
- [ ] Verific email primit cu noul listing

---

## 💳 FAZA 4: TESTARE SISTEM PLĂȚI (2-3 ore)

### 4.1 Payment Flow - Bank Transfer

**Seller Perspective:**
- [ ] Listing creat cu preț 10,000 RON
- [ ] Listing published

**Buyer Perspective:**
- [ ] Deschid listing
- [ ] Click "Make Offer" sau "Buy Now"
- **Expected:** Payment options displayed (Bank, Card, Installment)
- [ ] Select "Bank Transfer"
- [ ] Payment details afișate cu IBAN, reference number
- [ ] Copy IBAN
- [ ] Click "I've sent the payment"
- **Expected:** Pending status afișat
- [ ] Verific SMS/email confirmare

**Backend Verification (Admin):**
- [ ] Transaction created în database
- [ ] Status: PENDING_VERIFICATION
- [ ] Reference number matcha cu transferul
- [ ] Webhook primit de la bancă (simulat)
- [ ] Status actualizat: CONFIRMED
- [ ] Funds locked in escrow

**Seller Notification:**
- [ ] Seller primește email: "Payment received and confirmed"
- [ ] Seller vede funds în "Pending Release"
- [ ] Click "Release Funds"
- **Expected:** Funds transferred to seller bank account
- [ ] Transaction status: COMPLETED

### 4.2 Payment Flow - Card Payment

- [ ] Click "Make Offer/Buy Now"
- [ ] Select "Credit/Debit Card"
- [ ] Stripe modal deschis
- [ ] Introduc card 4242 4242 4242 4242
- [ ] Introduc date expirare valid
- [ ] Introduc CVC
- [ ] Introduc name
- [ ] Click "Pay"
- **Expected:** Payment processed, order status COMPLETED
- [ ] Seller și buyer primesc confirmation email
- [ ] Invoice generat și disponibil download

### 4.3 Payment Decline & Errors

- [ ] Test cu card 4000 0000 0000 0002 (decline)
- **Expected:** Error message "Card declined"
- [ ] Payment status: FAILED
- [ ] Retry button available
- [ ] Test cu expired card
- **Expected:** Error message "Card expired"

### 4.4 Payment History

- [ ] Buyer navighează la "Orders"
- [ ] Verific toate achizițiile cu status, date, amount
- [ ] Click order → Details pagina
- **Expected:** Complet transaction info
- [ ] Invoice available pentru download (PDF)
- [ ] Verific PDF conține: invoice number, date, items, total, VAT

### 4.5 Installment Payments (dacă implementat)

- [ ] Select "Pay in Installments"
- [ ] Plan options displayed: 3x, 6x, 12x
- [ ] Select 6 instalments
- [ ] Calcul automat al ratelor
- [ ] Monthly payment amount corect
- [ ] Total cost with interest displayed
- [ ] First installment deducted imediat
- [ ] Next installments scheduled

### 4.6 Refund Flow

**Full Refund:**
- [ ] Buyer initiates refund din order page
- **Expected:** Refund reason form
- [ ] Selectez reason: "Seller didn't deliver"
- [ ] Submit refund request
- [ ] Seller primește notif refund request
- [ ] Seller acceptă/respinge
- [ ] Dacă acceptă: funds returned în 2-3 zile
- [ ] Status: REFUNDED

**Partial Refund:**
- [ ] Seller inițiază refund parțial din order
- [ ] Set amount
- [ ] Reason: "Negotiated price reduction"
- [ ] Process partial refund
- **Expected:** Customer refunded amount

### 4.7 Webhook Payments

- [ ] Test Stripe webhook POST → `/api/webhooks/stripe`
- **Expected:** 200 OK response
- [ ] Signature validation corect
- [ ] Event processing: payment.success, payment.failed
- [ ] Database updated accordingly
- [ ] Emails trimise

---

## 📊 FAZA 5: TESTARE ADMIN DASHBOARD (PHASE 9) (2-3 ore)

### 5.1 Analytics & KPIs

**Dashboard Overview:**
- [ ] Total Revenue displayed (sum all confirmed payments)
- [ ] Total Users (count users)
- [ ] Total Transactions (count transactions)
- [ ] Active Listings (count published listings)
- [ ] Month-over-month growth percentages
- [ ] Charts load corect și responsive

**Revenue Analytics:**
- [ ] Daily revenue chart → 7 days, 30 days, year to date
- [ ] By seller revenue breakdown
- [ ] By payment method (bank, card, installment)
- [ ] Conversion rate % (views → sales)
- [ ] Average transaction value

**User Analytics:**
- [ ] New users per day/week/month
- [ ] User retention rate
- [ ] Top sellers by revenue
- [ ] User growth trend
- [ ] Geographic distribution

**Transaction Analytics:**
- [ ] Total transactions count
- [ ] Success rate %
- [ ] Failed transactions rate
- [ ] Average processing time
- [ ] Pending transactions count

**Listing Analytics:**
- [ ] Total listings
- [ ] Published vs draft
- [ ] Most viewed listings
- [ ] Sold vs active listings
- [ ] Average days to sell

### 5.2 User Management

**View Users:**
- [ ] Table cu toți userii
- [ ] Coloane: ID, Name, Email, Role, Status, Joined Date, Actions
- [ ] Sort by name, email, joined date
- [ ] Filter by role (admin, seller, user)
- [ ] Filter by status (active, suspended, banned)
- [ ] Search user by email/name
- [ ] Pagination funcționează

**Edit User:**
- [ ] Click user → User detail page
- [ ] Edit fields: name, email, phone
- [ ] Change role (admin, seller, user)
- [ ] Set status (active, suspended, banned)
- [ ] Click Save → User updated
- [ ] Activity log shows change

**Delete User:**
- [ ] Click delete button
- **Expected:** Confirmation dialog
- [ ] Confirm delete
- **Expected:** User marked as deleted (soft delete)
- [ ] User nu mai apare în list

**User Verification:**
- [ ] Pending verifications queue
- [ ] Verify document (ID, proof of address)
- [ ] Approve/Reject
- [ ] Send verification status email

### 5.3 Listing Management

**View Listings:**
- [ ] Table cu toate listings
- [ ] Coloane: ID, Title, Seller, Price, Status, Views, Created
- [ ] Sort by price, views, date
- [ ] Filter by status (published, draft, sold, expired)
- [ ] Filter by category (car, motorcycle, etc.)
- [ ] Search listing by title
- [ ] Bulk actions: feature, promote, delete

**Feature Listing:**
- [ ] Select listing
- [ ] Click "Feature" button
- [ ] Set featured duration (7, 14, 30 days)
- [ ] Set featured price (if paid)
- [ ] Confirm
- **Expected:** Listing featured, appears in top
- [ ] Featured badge displayed

**Promote Listing:**
- [ ] Click "Promote"
- [ ] Set promotion type: sponsored, highlight, top
- [ ] Set duration
- [ ] Set budget
- [ ] Confirm
- **Expected:** Listing visibility increased

**Delete Listing:**
- [ ] Click delete
- **Expected:** Soft delete (recoverable)
- [ ] Notification trimis seller
- [ ] Recovery option pentru admin

### 5.4 Transaction Management

**View Transactions:**
- [ ] Tabel cu transacții
- [ ] Coloane: ID, Buyer, Seller, Amount, Status, Method, Date
- [ ] Filter by status (completed, pending, failed, refunded)
- [ ] Filter by payment method
- [ ] Filter by date range
- [ ] Search by transaction ID
- [ ] Export to CSV

**Transaction Details:**
- [ ] Click transaction → Detail view
- [ ] Full transaction info: buyer, seller, item, amount, fee
- [ ] Payment method details
- [ ] Timeline: created, confirmed, released
- [ ] Refund history (if applicable)

**Dispute Resolution:**
- [ ] Disputed transactions queue
- [ ] View dispute details și evidence
- [ ] Admin can referee: favor buyer sau seller
- [ ] Action taken și logged

### 5.5 Reports & Export

- [ ] Generate Revenue Report (date range)
- [ ] Download as PDF/Excel
- [ ] Generate User Report
- [ ] Generate Transaction Report
- [ ] Schedule automatic reports
- [ ] Email reports weekly/monthly

### 5.6 System Settings

**General Settings:**
- [ ] Site name, logo
- [ ] Primary domain
- [ ] Contact email
- [ ] Support phone

**Payment Settings:**
- [ ] Stripe API keys (masked display)
- [ ] Commission percentage
- [ ] Minimum withdrawal amount
- [ ] Processing fee settings
- [ ] Refund window (days)

**Email Settings:**
- [ ] SendGrid API key (masked)
- [ ] Email templates editable
- [ ] From address
- [ ] Reply-to address
- [ ] Test email send

**Security Settings:**
- [ ] JWT expiration time
- [ ] Rate limiting (requests/minute)
- [ ] Session timeout
- [ ] IP whitelist (optional)
- [ ] 2FA required for admin (yes/no)

**Notification Settings:**
- [ ] Email notifications enable/disable
- [ ] SMS notifications enable/disable
- [ ] Push notifications enable/disable
- [ ] Notification frequency

---

## 💬 FAZA 6: TESTARE SISTEM MESAJE ȘI NOTIFICAȚII (2 ore)

### 6.1 Direct Messaging

**Send Message:**
- [ ] Buyer deschide seller profile
- [ ] Click "Message Seller"
- [ ] Message form deschis
- [ ] Type message "Hi, interested in this vehicle"
- [ ] Click Send
- **Expected:** Message appears în conversation thread
- [ ] Seller primește real-time notif (dacă online)
- [ ] Seller vede notification badge

**Message History:**
- [ ] Deschid "Messages"
- [ ] Verific conversation list sorted by date
- [ ] Click conversation → Full chat history
- [ ] Scroll up → Load older messages
- [ ] Verific timestamps corecte
- [ ] Verific read receipts (delivered, read)

**Real-Time Updates:**
- [ ] Open conversation pe 2 browser windows
- [ ] Send message din window 1
- **Expected:** Message appears instantly pe window 2
- [ ] Typing indicator visible
- [ ] Seen status updates

### 6.2 Notifications

**Email Notifications:**
- [ ] New message → Email sent
- [ ] Payment received → Email sent
- [ ] Listing published → Email sent
- [ ] Offer received → Email sent
- [ ] Transaction completed → Email sent
- [ ] Verific email content corect
- [ ] Verific unsubscribe link funcționează

**Push Notifications:**
- [ ] Enable push notifications
- [ ] Deschid app
- [ ] Accept browser notification permission
- [ ] Se trimite test notification
- **Expected:** Notification appears pe desktop
- [ ] Click notification → App focused

**In-App Notifications:**
- [ ] Notification bell icon top-right
- [ ] Badge count shows unread
- [ ] Click bell → Notification list
- [ ] Mark as read
- [ ] Delete notification
- [ ] Notification stays 7 days

### 6.3 Notification Preferences

- [ ] Settings → Notifications
- [ ] Toggle email notifications
- [ ] Toggle push notifications
- [ ] Toggle SMS notifications (dacă available)
- [ ] Select notification categories: payments, messages, offers, updates
- [ ] Notification frequency: immediate, daily digest
- [ ] Save preferences

---

## 🔧 FAZA 7: TESTARE RESURSE BACKEND - CRUD OPERAȚII (3 ore)

### 7.1 Vehicles Resource

**CREATE Vehicle:**
```bash
POST /api/vehicles
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2021,
  "price": 15000,
  "mileage": 45000,
  "transmission": "automatic",
  "fuel_type": "petrol",
  "color": "white"
}
```
- [ ] Status code: 201 Created
- [ ] Response includes vehicle_id
- [ ] Vehicle created în database

**READ Vehicle:**
```bash
GET /api/vehicles/{id}
```
- [ ] Status code: 200 OK
- [ ] Response include all fields
- [ ] Verific data types (number vs string)

**UPDATE Vehicle:**
```bash
PUT /api/vehicles/{id}
{
  "price": 14500,
  "mileage": 46000
}
```
- [ ] Status code: 200 OK
- [ ] Fields actualizate în database
- [ ] Unchanged fields nu sunt afectate

**DELETE Vehicle:**
```bash
DELETE /api/vehicles/{id}
```
- [ ] Status code: 204 No Content
- [ ] Vehicle soft-deleted (is_deleted=true)
- [ ] Listing associated nu mai show vehicul

**LIST Vehicles:**
```bash
GET /api/vehicles?page=1&per_page=20&sort=created_at&order=desc
```
- [ ] Status code: 200 OK
- [ ] Returns paginated results
- [ ] Respects pagination params
- [ ] Sort & order funcționează

### 7.2 Listings Resource

**CREATE Listing:**
```bash
POST /api/listings
{
  "vehicle_id": 1,
  "title": "2021 Toyota Camry Excellent Condition",
  "description": "...",
  "price": 15000,
  "location": "București",
  "latitude": 44.4268,
  "longitude": 26.1025,
  "images": ["url1", "url2", "url3"],
  "condition": "used",
  "seller_id": 5
}
```
- [ ] Status code: 201 Created
- [ ] Listing ID returned
- [ ] Verify listing created și active

**READ Listing:**
- [ ] GET /api/listings/{id}
- [ ] Verific include vehicle details
- [ ] Include seller info (name, rating)
- [ ] Include view count
- [ ] Include images URLs

**UPDATE Listing:**
- [ ] Update description, price, location
- [ ] Verify changes persisted
- [ ] Activity log record change

**DELETE Listing:**
- [ ] Soft delete listing
- [ ] Listing no longer searchable
- [ ] Seller can recover în 30 zile

**LIST Listings:**
- [ ] Pagination funcționează
- [ ] Filtering by status, price, location
- [ ] Sorting by created, views, price
- [ ] Search by title
- [ ] Performance: <500ms

### 7.3 Users Resource

**GET User Profile:**
```bash
GET /api/users/{id}
```
- [ ] Return user info: name, email, phone, role, rating
- [ ] Include seller stats (listings, sales, rating)
- [ ] Include follower count
- [ ] Success rate % (for sellers)

**UPDATE User Profile:**
```bash
PUT /api/users/{id}
{
  "name": "John Doe",
  "phone": "0712345678",
  "bio": "Professional car dealer"
}
```
- [ ] Update profile fields
- [ ] Verify changes saved
- [ ] Email não pode sa fie schimbat din profile (only via email verification)

**GET User Listings:**
```bash
GET /api/users/{id}/listings
```
- [ ] Return seller's listings
- [ ] Paginated
- [ ] Only active listings visible (for public)
- [ ] All listings visible (for owner)

**GET User Reviews/Ratings:**
```bash
GET /api/users/{id}/reviews
```
- [ ] Return paginated reviews
- [ ] Average rating calculated
- [ ] Sort by newest

### 7.4 Transactions Resource

**GET Transaction:**
```bash
GET /api/transactions/{id}
```
- [ ] Return full transaction details
- [ ] Include buyer, seller, item, amount
- [ ] Include status history
- [ ] Include timeline (created, confirmed, etc.)

**LIST Transactions (Admin):**
```bash
GET /api/transactions?filter=status&value=completed
```
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Filter by seller
- [ ] Filter by buyer
- [ ] Pagination
- [ ] Export option

**UPDATE Transaction (Admin):**
```bash
PUT /api/transactions/{id}
{
  "status": "refunded",
  "refund_amount": 15000
}
```
- [ ] Process refund
- [ ] Verify amount transferred back
- [ ] Email notifications sent

### 7.5 Messages Resource

**CREATE Message:**
```bash
POST /api/messages
{
  "recipient_id": 5,
  "content": "Are you still selling?",
  "related_listing_id": 3
}
```
- [ ] Status code: 201 Created
- [ ] Message stored în database
- [ ] WebSocket notification sent

**READ Messages (Conversation):**
```bash
GET /api/messages/conversations/{user_id}
```
- [ ] Return list of conversations
- [ ] Sorted by last message date
- [ ] Unread count per conversation
- [ ] Last message preview

**GET Messages (Thread):**
```bash
GET /api/messages/thread/{other_user_id}
```
- [ ] Return full message history
- [ ] Paginated (oldest first)
- [ ] Verific timestamps, read status
- [ ] Lazy load older messages

**UPDATE Message (Mark Read):**
```bash
PUT /api/messages/{id}
{
  "read": true
}
```
- [ ] Mark message as read
- [ ] Update read_at timestamp
- [ ] WebSocket notif sender

**DELETE Message:**
- [ ] Soft delete message
- [ ] Removed from conversations (for user)
- [ ] Can be recovered (admin)

### 7.6 Reviews/Ratings Resource

**CREATE Review:**
```bash
POST /api/reviews
{
  "seller_id": 5,
  "transaction_id": 123,
  "rating": 5,
  "title": "Excellent seller!",
  "comment": "Very professional, smooth transaction"
}
```
- [ ] Status code: 201 Created
- [ ] Review created
- [ ] Seller rating updated (average)
- [ ] Buyer can only review after completed transaction

**READ Reviews:**
```bash
GET /api/reviews/seller/{seller_id}
```
- [ ] Return paginated reviews
- [ ] Average rating displayed
- [ ] Star breakdown (5★: 80%, 4★: 15%, etc.)
- [ ] Most helpful first
- [ ] Helpful vote count

**UPDATE/DELETE Review:**
- [ ] Buyer can edit/delete own review (7 days)
- [ ] Admin can moderate/delete any review

---

## ⚙️ FAZA 8: TESTARE OPȚIUNI ADMIN PANEL (2 ore)

### 8.1 Content Management

**Email Templates:**
- [ ] Edit "Welcome Email" template
- [ ] Edit "Payment Confirmation" template
- [ ] Edit "Listing Published" template
- [ ] Preview template
- [ ] Test send

**FAQ Management:**
- [ ] Add new FAQ
- [ ] Edit FAQ question & answer
- [ ] Delete FAQ
- [ ] Reorder FAQs (drag & drop)
- [ ] Publish/unpublish FAQ

**Pages Management (CMS):**
- [ ] Edit About Us page
- [ ] Edit Terms & Conditions
- [ ] Edit Privacy Policy
- [ ] Edit Contact page
- [ ] Rich text editor funcționează

### 8.2 Moderation

**Flagged Content:**
- [ ] Listings marked as inappropriate queue
- [ ] Messages flagged as harassment queue
- [ ] Reviews flagged as fake queue
- [ ] View flagged content details
- [ ] Action: Approve, Delete, Contact Seller
- [ ] Comment on action taken
- [ ] Automated notifications sent

**Spam Management:**
- [ ] Block user account
- [ ] Delete user listings
- [ ] Send warning email
- [ ] Spam score tracking

### 8.3 Promotions & Coupons

**Create Coupon:**
- [ ] Code: WELCOME20
- [ ] Discount: 20%
- [ ] Max uses: 100
- [ ] Valid date range
- [ ] Apply to categories
- [ ] Min purchase amount
- [ ] Save coupon

**Apply Coupon (User Perspective):**
- [ ] At checkout, enter code WELCOME20
- **Expected:** 20% discount applied
- [ ] Total updated
- [ ] Process payment

**Track Coupon Usage:**
- [ ] Admin sees: uses count, revenue impact
- [ ] Disable expired coupons

### 8.4 Permission Management

**Admin Roles:**
- [ ] Super Admin: All permissions
- [ ] Content Manager: Manage pages, FAQ, email templates
- [ ] Moderator: Moderate listings, messages, reviews
- [ ] Finance: Manage transactions, refunds, payouts
- [ ] Support: View user issues, respond support tickets
- [ ] Create new role with custom permissions

**Assign Permissions:**
- [ ] Drag & drop permissions to role
- [ ] Save role
- [ ] Assign user to role

---

## 🔗 FAZA 9: TESTARE INTEGRĂRI EXTERNE (2 ore)

### 9.1 Stripe Payment Gateway

**Live Credentials Test:**
- [ ] Stripe API keys configured corect
- [ ] Test transaction success
- [ ] Test transaction decline
- [ ] Webhook delivery successful (Stripe dashboard)
- [ ] Settlement working (funds appear în account în 2-3 days)

**Payment Methods:**
- [ ] Cards accepted corect
- [ ] ACH transfers (US)
- [ ] Alipay (China)
- [ ] Apple Pay / Google Pay mobile

### 9.2 Email Service (SendGrid/Similar)

**Email Delivery:**
- [ ] Verify sender email configured
- [ ] Send test email → Arrives în 2 min
- [ ] Check spam folder (should not appear)
- [ ] Email formatting corect
- [ ] Images loaded (no broken images)
- [ ] Links working
- [ ] Unsubscribe link functional

**Email Categories:**
- [ ] Welcome: Sent on signup
- [ ] Payment Confirmation: Sent after payment
- [ ] Listing Published: Sent on listing creation
- [ ] New Message: Sent on new message
- [ ] Offer Received: Sent on new offer

### 9.3 Maps Service (Mapbox/Google Maps)

**Map Display:**
- [ ] Listing page shows interactive map
- [ ] Location marker placed corect
- [ ] Map zooms to location
- [ ] Click marker → Shows location info
- [ ] Search by location autocomplete

**Geolocation:**
- [ ] "Use my location" button
- [ ] Browser geolocation permission
- [ ] Location detected corect
- [ ] Map centered on user location

### 9.4 SMS Service (Twilio/similar - if applicable)

- [ ] 2FA SMS sent on login
- [ ] Transaction SMS confirmation
- [ ] SMS content correct

### 9.5 Cloud Storage (AWS S3/etc)

**Image Upload:**
- [ ] Upload listing image
- [ ] File size validated (max 5MB)
- [ ] Image format validated (jpg, png, webp)
- [ ] Image hosted on CDN
- [ ] Fast image loading
- [ ] Image optimization (thumbnails)

**Document Upload:**
- [ ] Upload ID verification
- [ ] Stored securely
- [ ] Only admin access
- [ ] Encrypted at rest

---

## 🚀 FAZA 10: PERFORMANCE & SECURITATE (3 ore)

### 10.1 Performance Testing

**Load Testing:**
- [ ] Test 100 concurrent users
- [ ] Response time < 1 second
- [ ] API rate limiting working (100 req/min per user)
- [ ] Database query optimization
- [ ] No N+1 queries
- [ ] Caching enabled (Redis)

**Frontend Performance:**
- [ ] Page load time < 3 seconds (Vercel)
- [ ] Lighthouse score > 90
- [ ] Images lazy-loaded
- [ ] JavaScript code-split
- [ ] CSS minified
- [ ] Fonts optimized

**Backend Performance:**
- [ ] API response time < 200ms
- [ ] Database response time < 50ms
- [ ] Memory usage stable
- [ ] CPU usage < 70%

### 10.2 Security Testing

**SQL Injection:**
- [ ] Search field: `' OR '1'='1`
- **Expected:** No data leakage
- [ ] Input properly escaped/parameterized

**XSS (Cross-Site Scripting):**
- [ ] Comment field: `<script>alert('xss')</script>`
- **Expected:** Script não executa
- [ ] Input sanitized

**CSRF (Cross-Site Request Forgery):**
- [ ] CSRF token present în forms
- [ ] Token validation on backend
- [ ] Mismatched token → 403 error

**Authorization:**
- [ ] User cannot access other user's data
- [ ] Role-based access enforced
- [ ] Admin routes protected

**HTTPS & SSL:**
- [ ] All traffic encrypted (https://)
- [ ] SSL certificate valid
- [ ] HSTS header set
- [ ] No mixed content

**API Security:**
- [ ] Authentication required (JWT)
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Sensitive headers removed (X-Powered-By, etc.)
- [ ] API key rotation working

**Data Protection:**
- [ ] Passwords hashed (bcrypt)
- [ ] Sensitive data encrypted (DB)
- [ ] PII handled securely
- [ ] GDPR compliant (data export, deletion)

### 10.3 Browser Compatibility

- [ ] Chrome (latest) ✓
- [ ] Firefox (latest) ✓
- [ ] Safari (latest) ✓
- [ ] Edge (latest) ✓
- [ ] Mobile Chrome ✓
- [ ] Mobile Safari ✓

### 10.4 Mobile Responsiveness

- [ ] iPhone 12 Pro ✓
- [ ] iPhone SE ✓
- [ ] Samsung Galaxy S21 ✓
- [ ] iPad Pro ✓
- [ ] Tablet 10" ✓
- [ ] No horizontal scroll
- [ ] Touch interactions responsive

---

## 📱 FAZA 11: TESTARE MOBILE (1.5 ore)

### 11.1 Mobile UI/UX

- [ ] Navigation menu collapse properly
- [ ] Buttons large enough for touch (min 44x44px)
- [ ] Forms optimized for mobile
- [ ] Images scale properly
- [ ] No text overflow
- [ ] Bottom navigation bar if applicable

### 11.2 Mobile Features

- [ ] Camera integration (upload listing photos)
- [ ] Geolocation working
- [ ] Mobile notifications working
- [ ] Offline functionality (if applicable)
- [ ] Touch gestures (swipe, pinch zoom)

### 11.3 App Performance (Mobile)

- [ ] Page load time < 4 seconds (on 4G)
- [ ] Smooth scrolling (60 FPS)
- [ ] No jank
- [ ] Battery consumption reasonable
- [ ] Data consumption reasonable

---

## 🔍 FAZA 12: MONITORING & LOGGING (1.5 ore)

### 12.1 Setup Monitoring

**Error Tracking:**
- [ ] Sentry/Rollbar configured
- [ ] Errors captured automatically
- [ ] Alerts sent on critical errors
- [ ] Error trends visible

**Performance Monitoring:**
- [ ] APM tool configured (New Relic, Datadog, etc.)
- [ ] Response times monitored
- [ ] Database query times monitored
- [ ] Slowest endpoints identified
- [ ] Performance alerts set

**Logging:**
- [ ] All errors logged
- [ ] API requests logged
- [ ] Database queries logged (for slow query log)
- [ ] User actions logged (for audit trail)
- [ ] Logs centralized (ELK Stack, CloudWatch)

### 12.2 Alerting

- [ ] CPU usage > 80% → Alert
- [ ] Memory usage > 90% → Alert
- [ ] Error rate > 1% → Alert
- [ ] API response time > 2s → Alert
- [ ] Database connection pool exhausted → Alert
- [ ] Payment webhook failed → Alert

### 12.3 Dashboard Setup

- [ ] Real-time metrics dashboard
- [ ] Key metrics visible: requests/min, error rate, response time
- [ ] Can set custom time ranges
- [ ] Mobile-friendly dashboard

---

## 💾 FAZA 13: BACKUP & DISASTER RECOVERY (1.5 ore)

### 13.1 Database Backups

- [ ] Automated backups every 6 hours
- [ ] Backups stored on separate storage (not same server)
- [ ] Backups encrypted
- [ ] Retention: 30 days
- [ ] Test restore: restore backup to test DB

### 13.2 Application Backups

- [ ] Application code versioned (Git)
- [ ] Deployments tagged
- [ ] Easy rollback to previous version
- [ ] Test rollback procedure

### 13.3 Disaster Recovery Plan

- [ ] Document recovery procedures
- [ ] RTO (Recovery Time Objective): < 2 hours
- [ ] RPO (Recovery Point Objective): < 1 hour
- [ ] Test full disaster scenario quarterly

### 13.4 Failover & High Availability

- [ ] Database replication configured
- [ ] Automatic failover working
- [ ] Load balancing active
- [ ] Multiple app instances running

---

## 📚 FAZA 14: DOCUMENTARE & HANDOFF (2 ore)

### 14.1 Technical Documentation

**Deployment Guide:**
- [ ] Step-by-step Forge deployment
- [ ] Step-by-step Vercel deployment
- [ ] Database migration procedures
- [ ] Environment configuration

**Runbook for Common Issues:**
- [ ] Payment webhook failed → Recovery steps
- [ ] User locked out → Recovery
- [ ] High CPU usage → Debugging
- [ ] Database connection issues → Troubleshooting

**API Documentation:**
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Error codes documented
- [ ] Rate limits documented

### 14.2 User Documentation

**Admin Guide:**
- [ ] How to manage users
- [ ] How to manage listings
- [ ] How to process refunds
- [ ] How to view analytics

**Seller Guide:**
- [ ] How to create listing
- [ ] How to manage inventory
- [ ] How to withdraw funds
- [ ] How to handle orders

**Buyer Guide:**
- [ ] How to search listings
- [ ] How to make offer
- [ ] How to pay
- [ ] How to track order

### 14.3 Support Resources

- [ ] FAQ documentation
- [ ] Common issues & solutions
- [ ] Contact support form working
- [ ] Support email inbox monitored

---

## 📋 TESTING CHECKLIST SUMMARY

### Critical (Must Pass)
- [ ] User can login/logout
- [ ] User can search listings
- [ ] Payment flow works (both bank & card)
- [ ] Orders are created and tracked
- [ ] Admin can view transactions
- [ ] Emails are sent and received
- [ ] 0 critical errors
- [ ] HTTPS working
- [ ] Database backups working

### Important (Should Pass)
- [ ] 2FA working
- [ ] Search filters working
- [ ] Analytics dashboard working
- [ ] User management working
- [ ] Refunds working
- [ ] Real-time messaging working
- [ ] API performance < 500ms
- [ ] Mobile responsive
- [ ] Error tracking working

### Nice to Have
- [ ] Installment payments working
- [ ] Coupon system working
- [ ] Social login (if implemented)
- [ ] Advanced analytics
- [ ] Scheduled tasks running

---

## 📊 TESTING SCHEDULE

| Faza | Activitate | Durata | Status |
|------|-----------|--------|--------|
| 1 | Pregătire | 2 ore | Not Started |
| 2 | Auth Testing | 2-3 ore | Not Started |
| 3 | Search Testing | 3 ore | Not Started |
| 4 | Payment Testing | 2-3 ore | Not Started |
| 5 | Admin Dashboard | 2-3 ore | Not Started |
| 6 | Messaging & Notif. | 2 ore | Not Started |
| 7 | Backend CRUD | 3 ore | Not Started |
| 8 | Admin Options | 2 ore | Not Started |
| 9 | Integrări Externe | 2 ore | Not Started |
| 10 | Perf & Security | 3 ore | Not Started |
| 11 | Mobile Testing | 1.5 ore | Not Started |
| 12 | Monitoring | 1.5 ore | Not Started |
| 13 | Backup & DR | 1.5 ore | Not Started |
| 14 | Documentare | 2 ore | Not Started |
| **TOTAL** | **14 Faze** | **~36 ore** | **Pending** |

**Distribuție pe zile:**
- **Joi (30 ian):** Faze 1-2 (Pregătire + Auth)
- **Vineri (31 ian):** Faze 3-4 (Search + Payments)
- **Sâmbătă (1 feb):** Faze 5-6 (Admin + Messaging)
- **Duminică (2 feb):** Faze 7-8 (Backend CRUD + Admin Options)
- **Luni (3 feb):** Faze 9-14 (Integrări + Monitoring + Handoff)

---

## 🚨 BUG TRACKING & REMEDIATION

### Critical Bugs (Must fix before production)
- [ ] Payment flow broken
- [ ] Authentication not working
- [ ] Database errors
- [ ] API errors (500)
- [ ] Security vulnerabilities

### High Bugs (Should fix)
- [ ] Performance issues
- [ ] UI bugs
- [ ] Email delivery issues
- [ ] Search not working

### Medium Bugs (Nice to fix)
- [ ] UI cosmetics
- [ ] Performance optimizations
- [ ] Missing validations

### Low Bugs (Can defer)
- [ ] Typos
- [ ] UI improvements
- [ ] Non-critical features

---

## ✅ SIGN-OFF CRITERIA

**Production deployment is approved ONLY when:**
- ✅ All critical bugs fixed
- ✅ All critical tests passed
- ✅ Performance acceptable (>90 Lighthouse)
- ✅ Security audit passed
- ✅ Database backups working
- ✅ Monitoring & alerting configured
- ✅ Team trained on runbooks
- ✅ 24/7 support plan ready
- ✅ Rollback plan tested
- ✅ All documentation complete

---

## 📞 SUPPORT READINESS

**Pre-Production Checklist:**
- [ ] Support team trained
- [ ] Support email/chat monitored 24/7
- [ ] Escalation procedures documented
- [ ] On-call rotation setup
- [ ] Status page setup (statuspage.io)
- [ ] Customer communication plan

---

**Document Created:** 30 January 2026  
**Next Review:** Daily updates  
**Last Updated:** Initial creation

---

## 📎 APPENDIX

### A. API Endpoint Checklist

```
Authentication:
POST /api/auth/register ✓
POST /api/auth/login ✓
POST /api/auth/logout ✓
POST /api/auth/refresh ✓
POST /api/auth/2fa-setup ✓
POST /api/auth/verify-otp ✓

Users:
GET /api/users/{id} ✓
PUT /api/users/{id} ✓
GET /api/users/{id}/listings ✓
GET /api/users/{id}/reviews ✓

Listings:
POST /api/listings ✓
GET /api/listings/{id} ✓
PUT /api/listings/{id} ✓
DELETE /api/listings/{id} ✓
GET /api/listings (with filters) ✓

Search:
GET /api/search ✓
GET /api/search/filters ✓
POST /api/search/save ✓
GET /api/search/saved ✓

Vehicles:
POST /api/vehicles ✓
GET /api/vehicles/{id} ✓
PUT /api/vehicles/{id} ✓
DELETE /api/vehicles/{id} ✓

Payments:
POST /api/payments ✓
GET /api/payments/{id} ✓
POST /api/payments/{id}/verify ✓
POST /api/payments/{id}/refund ✓
GET /api/payments (history) ✓

Transactions:
GET /api/transactions ✓
GET /api/transactions/{id} ✓
PUT /api/transactions/{id} ✓

Messages:
POST /api/messages ✓
GET /api/messages/conversations ✓
GET /api/messages/thread/{id} ✓
PUT /api/messages/{id} ✓

Analytics:
GET /api/analytics/dashboard ✓
GET /api/analytics/revenue ✓
GET /api/analytics/users ✓
GET /api/analytics/transactions ✓

Admin:
GET /api/admin/users ✓
GET /api/admin/listings ✓
GET /api/admin/settings ✓
PUT /api/admin/settings ✓
```

### B. Test Data

Acces credentials și test data disponibile în fișierul `.env.test`

### C. Tools & Resources

- Postman collection: `./postman-collection.json`
- Load testing: Apache JMeter
- Security testing: OWASP ZAP
- Performance: Chrome DevTools, Lighthouse
