# FAZA 2 Phase 7 - Contract & Invoice Generation

**Current Status:** 🚀 READY TO START  
**Previous Phase:** Phase 6 - Email Notifications (✅ COMPLETE)  
**Date:** January 29, 2026

---

## 📋 Phase Overview

Contract and Invoice generation system - creating automated PDF documents for transactions and payments with email delivery integration.

**Objective:** Implement professional PDF contract and invoice generation triggered by transaction events.

---

## Priority Tasks for Phase 7

### Task 1: Contract Generation System (HIGH PRIORITY)
**Estimated Time:** 1-1.5 hours

**Components:**
1. Install barryvdh/laravel-dompdf package
2. Create ContractGenerator service
3. Create contract Blade template (PDF view)
4. Integrate with TransactionController (trigger on funds_released)
5. Test contract generation and email delivery

**Deliverables:**
- `app/Services/ContractGenerator.php` (service for PDF generation)
- `resources/views/pdf/contract.blade.php` (contract template)
- Integration point: TransactionController::releaseFunds()

**Key Features:**
- Auto-generates when funds released
- Includes: buyer details, seller details, vehicle info, amount, terms, signatures section
- PDF stored on disk or S3
- Sent to both parties via email
- Contract number assigned (unique identifier)

---

### Task 2: Invoice Generation System (HIGH PRIORITY)
**Estimated Time:** 1-1.5 hours

**Components:**
1. Create InvoiceGenerator service
2. Create invoice Blade template (PDF view)
3. Integrate with PaymentController (trigger on payment_verified)
4. Integrate with TransactionController (trigger on fees calculation)
5. Test invoice generation and email delivery

**Deliverables:**
- `app/Services/InvoiceGenerator.php` (service for invoice generation)
- `resources/views/pdf/invoice.blade.php` (invoice template)
- Integration points: PaymentController::verify(), TransactionController for fees

**Key Features:**
- Auto-generates after payment verification
- Includes: invoice number, date, amount, payment method, fee breakdown
- Line items: transaction amount, platform fees, other charges
- Tax calculations if applicable
- Invoice number auto-increment with formatting (INV-2026-001, etc.)

---

### Task 3: PDF Storage & Distribution (MEDIUM PRIORITY)
**Estimated Time:** 30 minutes

**Components:**
1. Configure PDF storage location (disk configuration)
2. Add PDF download endpoints to API
3. Set up email attachments with PDFs
4. Create storage folder structure

**Deliverables:**
- PDF storage configuration
- Contract download endpoint
- Invoice download endpoint
- Email attachment integration

---

### Task 4: Advanced Search Implementation (MEDIUM PRIORITY)
**Estimated Time:** 2-3 hours

**Components:**
1. Set up Laravel Scout with Algolia or local driver
2. Implement searchable indices on key models
3. Create search API endpoints
4. Add filtering and sorting

**Deliverables:**
- Vehicle search with filters
- Transaction history search
- User search for admin panel
- Message/conversation search

---

## Implementation Plan

### Step 1: Install & Configure DOMPDF
```bash
composer require barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

### Step 2: Create Contract Service
```php
// app/Services/ContractGenerator.php
- generate(Transaction $transaction, string $savePath = null)
- getContractNumber()
- formatContractDate()
```

### Step 3: Create Contract Template
```blade
// resources/views/pdf/contract.blade.php
- Buyer/Seller information
- Vehicle details
- Transaction amount and terms
- Signature fields
- Footer with contract number and date
```

### Step 4: Create Invoice Service
```php
// app/Services/InvoiceGenerator.php
- generate(Payment $payment, string $savePath = null)
- getInvoiceNumber()
- calculateLineItems()
- addTaxes()
```

### Step 5: Create Invoice Template
```blade
// resources/views/pdf/invoice.blade.php
- Invoice header with number/date
- Line items table
- Amount summary (subtotal, fees, tax, total)
- Payment method and terms
- Footer with company info
```

### Step 6: Integrate with Controllers
```php
// TransactionController::releaseFunds()
- Generate contract
- Email contract to both parties

// PaymentController::verify()
- Generate invoice
- Email invoice to buyer
```

---

## Technical Stack

**PDF Generation:**
- Package: barryvdh/laravel-dompdf (wraps mPDF/DomPDF)
- Template Engine: Blade
- Storage: Local disk or S3
- Email Delivery: Laravel Mail with attachments

**Numbering & Storage:**
- Contract Numbers: Contract format (CONT-2026-001)
- Invoice Numbers: Invoice format (INV-2026-001)
- Auto-increment: Database sequence or counter
- Storage Path: `/storage/documents/contracts/`, `/storage/documents/invoices/`

**Integration Pattern:**
- Service classes handle generation logic
- Controllers trigger generation on events
- Emails attach generated PDFs
- Database stores document metadata (path, number, date)

---

## Database Considerations

### Contract Tracking Table (Optional)
```sql
CREATE TABLE contracts (
    id BIGINT PRIMARY KEY,
    transaction_id BIGINT UNIQUE,
    contract_number VARCHAR(50) UNIQUE,
    file_path VARCHAR(255),
    file_url VARCHAR(500),
    generated_at TIMESTAMP,
    sent_to_buyer_at TIMESTAMP,
    sent_to_seller_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
```

### Invoice Tracking Table (Optional)
```sql
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY,
    payment_id BIGINT UNIQUE,
    invoice_number VARCHAR(50) UNIQUE,
    file_path VARCHAR(255),
    file_url VARCHAR(500),
    subtotal DECIMAL(12,2),
    fees DECIMAL(12,2),
    tax DECIMAL(12,2),
    total DECIMAL(12,2),
    generated_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);
```

---

## Sample Contract Template Structure

```blade
<h1>CONTRACT FOR VEHICLE SALE</h1>

<div class="contract-header">
    <p>Contract Number: {{ $contractNumber }}</p>
    <p>Date: {{ $contractDate }}</p>
</div>

<div class="parties">
    <h2>PARTIES TO THE AGREEMENT</h2>
    <p><strong>BUYER:</strong> {{ $transaction->buyer->name }}</p>
    <p><strong>SELLER:</strong> {{ $transaction->seller->name }}</p>
</div>

<div class="vehicle-details">
    <h2>VEHICLE DETAILS</h2>
    <p>Make: {{ $transaction->vehicle->make }}</p>
    <p>Model: {{ $transaction->vehicle->model }}</p>
    <p>Year: {{ $transaction->vehicle->year }}</p>
    <p>VIN: {{ $transaction->vehicle->vin }}</p>
</div>

<div class="terms">
    <h2>PURCHASE TERMS</h2>
    <p>Purchase Price: {{ $transaction->amount }} {{ $transaction->currency }}</p>
    <p>Payment Status: Verified & Released to Seller</p>
</div>

<div class="signatures">
    <p>BUYER: _________________ Date: _______</p>
    <p>SELLER: _________________ Date: _______</p>
</div>
```

---

## Sample Invoice Template Structure

```blade
<div class="invoice-header">
    <h1>INVOICE</h1>
    <p>Invoice #: {{ $invoiceNumber }}</p>
    <p>Date: {{ $invoiceDate }}</p>
</div>

<div class="bill-info">
    <div class="bill-to">
        <h3>BILL TO:</h3>
        <p>{{ $payment->user->name }}</p>
        <p>{{ $payment->user->email }}</p>
    </div>
</div>

<table class="line-items">
    <tr>
        <th>Description</th>
        <th>Amount</th>
    </tr>
    <tr>
        <td>Vehicle Sale - {{ $transaction->vehicle->make }} {{ $transaction->vehicle->model }}</td>
        <td>{{ $transaction->amount }}</td>
    </tr>
    <tr>
        <td>Platform Fee (2.5%)</td>
        <td>{{ $platformFee }}</td>
    </tr>
    @if($tax > 0)
    <tr>
        <td>Tax</td>
        <td>{{ $tax }}</td>
    </tr>
    @endif
</table>

<div class="totals">
    <p>Subtotal: {{ $subtotal }}</p>
    <p>Total: {{ $total }} {{ $transaction->currency }}</p>
</div>
```

---

## Success Criteria

Phase 7 will be considered COMPLETE when:

✅ Contract generation service created and tested
✅ Invoice generation service created and tested
✅ Contract template renders correctly (no HTML errors in PDF)
✅ Invoice template renders correctly (no HTML errors in PDF)
✅ TransactionController triggers contract generation on funds_released
✅ PaymentController triggers invoice generation on payment_verified
✅ Emails attach generated PDFs successfully
✅ PDF download endpoints working
✅ All error handling and logging in place
✅ Both contracts and invoices tested end-to-end

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1 - Frontend Setup | ✅ Complete | 100% |
| Phase 2 - User Auth | ✅ Complete | 100% |
| Phase 3 - KYC System | ✅ Complete | 100% |
| Phase 4 - Payment System | ✅ Complete | 100% |
| Phase 5 - Push Notifications | ✅ Complete | 95% (VAPID pending) |
| Phase 6 - Email Notifications | ✅ Complete | 100% |
| **Phase 7 - Contract/Invoice** | 🚀 Starting | 0% |
| Phase 8 - Advanced Search | ⏳ Queued | 0% |
| Phase 9 - Admin Dashboard | ⏳ Queued | 0% |
| Phase 10 - Deployment & Testing | ⏳ Queued | 0% |

---

## Commands to Start

Ready to proceed with Phase 7. Next command:

```
"continua cu Phase 7 - implementeaza Contract Generation si Invoice Generation systems"
```

or

```
"implementeaza Contract Generator service si Invoice Generator service ca in planul din sus"
```

---

## Notes

- All previous phases fully operational and tested
- Email system ready to attach PDFs
- Storage infrastructure available
- Queue system processing all async jobs
- Error handling patterns established in email phase
- Ready to scale up with PDF generation

**Recommendation:** Start with Contract Generation first (simpler template, clearer requirements), then move to Invoice Generation.

---

**Phase 6 Completion Status:** ✅ COMPLETE (Email Notification System)  
**Phase 7 Status:** 🚀 READY TO START  
**Next Action:** Await user confirmation to proceed with Phase 7
