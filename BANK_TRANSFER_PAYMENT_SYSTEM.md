# 🏦 Sistem de Plăți prin Transfer Bancar + Contract

## 📋 Prezentare Generală

Sistemul NU folosește escrow. Plățile se fac prin **transfer bancar direct** după semnarea contractului - abordare standard pentru dealerii auto.

---

## ✅ Flux Legal Complet

### PASUL 1: Rezervare Online
**Pe site:**
- Client selectează mașina
- Completează datele personale
- Acceptă Termeni & Condiții
- ⚠️ **NU plătește încă**

**În sistem:**
```php
Status: 'draft' sau 'pending'
```

---

### PASUL 2: Generare Contract
**Dealerul generează automat:**
- Contract vânzare-cumpărare (PDF)
- Conține:
  - Date client (nume, CNP/CUI, adresă)
  - Date firmă dealer
  - Date vehicul (VIN, marca, model, an)
  - Preț final
  - Modalitate plată: Transfer Bancar
  - Termen de plată (ex: 3 zile)

**În sistem:**
```php
Status: 'contract_generated'
```

---

### PASUL 3: Semnare Contract
**Opțiuni legale:**
- ✅ Semnătură fizică (scanat + upload)
- ✅ Semnătură electronică calificată (certSIGN, DocuSign)

**⚠️ IMPORTANT:** FĂRĂ contract semnat = NU ceri plata

**În sistem:**
```php
Status: 'contract_signed'
Câmpuri: 
- signed_contract_url (PDF)
- signed_at (timestamp)
- signature_type ('physical' / 'electronic')
```

---

### PASUL 4: Afișare Instrucțiuni Plată
**După semnare, clientul primește:**
- IBAN dealer
- Sumă exactă
- Referință plată (ex: ORDER-12345)
- Termen limită

**În sistem:**
```php
Status: 'awaiting_bank_transfer'

Afișare pe pagina comenzii:
- bank_account_iban
- bank_account_holder
- bank_name
- payment_reference
- payment_deadline
```

---

### PASUL 5: Confirmare Plată (MANUAL)
**Dealerul:**
- Verifică extrasul bancar
- Marchează comanda ca plătită în admin
- Emite factură automată
- Pregătește livrarea

**În sistem:**
```php
Status: 'paid'
Câmpuri:
- payment_confirmed_at
- payment_confirmed_by (admin_user_id)
- payment_proof_url (optional - screenshot extras)
```

---

### PASUL 6: Livrare & Finalizare
**După livrare:**
```php
Status: 'delivered' -> 'completed'
```

---

## 🔧 Implementare Laravel

### 1. Statusuri Comandă (Enum/Migration)

```php
// database/migrations/xxxx_update_transactions_statuses.php

Schema::table('transactions', function (Blueprint $table) {
    $table->enum('status', [
        'draft',                    // Comandă inițială
        'pending',                  // În procesare
        'contract_generated',       // Contract generat
        'contract_signed',          // Contract semnat de client
        'awaiting_bank_transfer',   // Așteaptă plată
        'paid',                     // Plată confirmată
        'invoice_issued',           // Factură emisă
        'ready_for_delivery',       // Pregătit livrare
        'delivered',                // Livrat
        'completed',                // Finalizat
        'cancelled',                // Anulat
        'refunded'                  // Rambursat
    ])->default('draft')->change();
});
```

### 2. Câmpuri Noi în Transactions

```php
Schema::table('transactions', function (Blueprint $table) {
    // Contract
    $table->string('contract_url')->nullable();
    $table->string('signed_contract_url')->nullable();
    $table->timestamp('contract_generated_at')->nullable();
    $table->timestamp('contract_signed_at')->nullable();
    $table->enum('signature_type', ['physical', 'electronic'])->nullable();
    
    // Plată
    $table->string('bank_account_iban')->nullable();
    $table->string('bank_account_holder')->nullable();
    $table->string('bank_name')->nullable();
    $table->string('payment_reference')->unique()->nullable(); // ORDER-12345
    $table->timestamp('payment_deadline')->nullable();
    $table->timestamp('payment_confirmed_at')->nullable();
    $table->foreignId('payment_confirmed_by')->nullable()->constrained('users');
    $table->string('payment_proof_url')->nullable();
    
    // Factură
    $table->string('invoice_number')->unique()->nullable();
    $table->string('invoice_url')->nullable();
    $table->timestamp('invoice_issued_at')->nullable();
    
    // Livrare
    $table->timestamp('delivery_date')->nullable();
    $table->text('delivery_address')->nullable();
    $table->string('delivery_contact')->nullable();
});
```

### 3. Controller Flux Plată

```php
// app/Http/Controllers/API/OrderController.php

class OrderController extends Controller
{
    // 1. Creare comandă inițială
    public function createOrder(Request $request)
    {
        $transaction = Transaction::create([
            'buyer_id' => auth()->id(),
            'vehicle_id' => $request->vehicle_id,
            'status' => 'draft',
            'amount' => $vehicle->price,
            // ... alte date
        ]);
        
        return response()->json(['transaction' => $transaction]);
    }
    
    // 2. Generare contract (Admin/Dealer)
    public function generateContract(Transaction $transaction)
    {
        // Generare PDF contract
        $pdf = PDF::loadView('contracts.sale', [
            'transaction' => $transaction,
            'buyer' => $transaction->buyer,
            'vehicle' => $transaction->vehicle,
            'dealer' => $transaction->dealer,
        ]);
        
        $filename = "contract-{$transaction->id}.pdf";
        $pdf->save(storage_path("app/contracts/{$filename}"));
        
        $transaction->update([
            'contract_url' => url("storage/contracts/{$filename}"),
            'contract_generated_at' => now(),
            'status' => 'contract_generated',
            'payment_reference' => 'ORDER-' . strtoupper(Str::random(8)),
            'payment_deadline' => now()->addDays(3),
        ]);
        
        // Trimite email cu contract
        Mail::to($transaction->buyer)->send(new ContractGenerated($transaction));
        
        return response()->json(['message' => 'Contract generat']);
    }
    
    // 3. Upload contract semnat (Client)
    public function uploadSignedContract(Request $request, Transaction $transaction)
    {
        $request->validate([
            'signed_contract' => 'required|file|mimes:pdf|max:10240',
            'signature_type' => 'required|in:physical,electronic',
        ]);
        
        $path = $request->file('signed_contract')->store('signed_contracts', 'public');
        
        $transaction->update([
            'signed_contract_url' => Storage::url($path),
            'contract_signed_at' => now(),
            'signature_type' => $request->signature_type,
            'status' => 'awaiting_bank_transfer',
        ]);
        
        // Trimite email cu instrucțiuni plată
        Mail::to($transaction->buyer)->send(new PaymentInstructions($transaction));
        
        return response()->json([
            'message' => 'Contract semnat încărcat cu succes',
            'payment_details' => [
                'iban' => $transaction->bank_account_iban,
                'amount' => $transaction->amount,
                'reference' => $transaction->payment_reference,
                'deadline' => $transaction->payment_deadline,
            ]
        ]);
    }
    
    // 4. Confirmare plată (Admin - MANUAL)
    public function confirmPayment(Request $request, Transaction $transaction)
    {
        $request->validate([
            'payment_proof' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
        ]);
        
        $proofUrl = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');
            $proofUrl = Storage::url($path);
        }
        
        $transaction->update([
            'status' => 'paid',
            'payment_confirmed_at' => now(),
            'payment_confirmed_by' => auth()->id(),
            'payment_proof_url' => $proofUrl,
        ]);
        
        // Generare factură automată
        $this->generateInvoice($transaction);
        
        // Notificare client
        Mail::to($transaction->buyer)->send(new PaymentConfirmed($transaction));
        
        return response()->json(['message' => 'Plată confirmată']);
    }
    
    // 5. Generare factură automată
    protected function generateInvoice(Transaction $transaction)
    {
        $invoiceNumber = 'INV-' . now()->format('Y') . '-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT);
        
        $pdf = PDF::loadView('invoices.sale', [
            'transaction' => $transaction,
            'invoice_number' => $invoiceNumber,
        ]);
        
        $filename = "invoice-{$invoiceNumber}.pdf";
        $pdf->save(storage_path("app/invoices/{$filename}"));
        
        $transaction->update([
            'invoice_number' => $invoiceNumber,
            'invoice_url' => url("storage/invoices/{$filename}"),
            'invoice_issued_at' => now(),
            'status' => 'invoice_issued',
        ]);
    }
    
    // 6. Marcare livrare
    public function markAsDelivered(Transaction $transaction)
    {
        $transaction->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
        
        return response()->json(['message' => 'Comandă marcată ca livrată']);
    }
}
```

### 4. View pentru Instrucțiuni Plată (Frontend)

```tsx
// PaymentInstructions.tsx
export default function PaymentInstructions({ transaction }) {
  return (
    <div className="payment-instructions">
      <h2>✅ Contract Semnat - Instrucțiuni de Plată</h2>
      
      <div className="alert alert-info">
        Contractul dvs. a fost semnat cu succes. 
        Vă rugăm efectuați plata prin transfer bancar.
      </div>
      
      <div className="bank-details">
        <h3>Detalii Transfer Bancar</h3>
        <table>
          <tr>
            <td><strong>IBAN:</strong></td>
            <td>{transaction.bank_account_iban}</td>
          </tr>
          <tr>
            <td><strong>Beneficiar:</strong></td>
            <td>{transaction.bank_account_holder}</td>
          </tr>
          <tr>
            <td><strong>Bancă:</strong></td>
            <td>{transaction.bank_name}</td>
          </tr>
          <tr>
            <td><strong>Sumă:</strong></td>
            <td className="text-xl font-bold">{transaction.amount} EUR</td>
          </tr>
          <tr>
            <td><strong>Referință:</strong></td>
            <td className="font-mono">{transaction.payment_reference}</td>
          </tr>
          <tr>
            <td><strong>Termen limită:</strong></td>
            <td>{formatDate(transaction.payment_deadline)}</td>
          </tr>
        </table>
      </div>
      
      <div className="instructions">
        <h4>⚠️ IMPORTANT:</h4>
        <ul>
          <li>În descrierea plății includeți referința: <strong>{transaction.payment_reference}</strong></li>
          <li>După efectuarea plății, aceasta va fi confirmată în maxim 24h</li>
          <li>Veți primi factura pe email imediat după confirmarea plății</li>
        </ul>
      </div>
      
      <button onClick={copyToClipboard}>
        📋 Copiază Detalii Plată
      </button>
    </div>
  );
}
```

### 5. Admin Panel - Confirmare Plată

```tsx
// AdminPaymentConfirmation.tsx
export default function AdminPaymentConfirmation({ transaction }) {
  return (
    <div className="admin-confirm-payment">
      <h3>Confirmare Plată Primită</h3>
      
      <div className="transaction-info">
        <p><strong>Client:</strong> {transaction.buyer.name}</p>
        <p><strong>Sumă așteptată:</strong> {transaction.amount} EUR</p>
        <p><strong>Referință:</strong> {transaction.payment_reference}</p>
      </div>
      
      <form onSubmit={handleConfirm}>
        <div>
          <label>Data plății în extras:</label>
          <input type="date" name="payment_date" required />
        </div>
        
        <div>
          <label>Screenshot extras bancar (opțional):</label>
          <input type="file" name="payment_proof" accept=".pdf,.jpg,.png" />
        </div>
        
        <button type="submit">
          ✅ Confirmă Plată Primită
        </button>
      </form>
    </div>
  );
}
```

---

## 📧 Email-uri Automate

### 1. Contract Generat
```
Subiect: Contractul dvs. de achiziție - ORDER-ABC123

Bună {name},

Contractul pentru {vehicle} a fost generat.

🔗 Descărcați contractul: [LINK]

Următorii pași:
1. Citiți contractul cu atenție
2. Semnați contractul (fizic sau electronic)
3. Încărcați contractul semnat pe platformă
4. Primiți instrucțiunile de plată

Mulțumim!
```

### 2. Instrucțiuni Plată
```
Subiect: Instrucțiuni de plată - ORDER-ABC123

Contractul a fost semnat! ✅

Efectuați transferul bancar:
IBAN: RO49AAAA1B31007593840000
Sumă: 25.000 EUR
Referință: ORDER-ABC123
Termen: 3 zile

⚠️ Includeți referința în descrierea plății!
```

### 3. Confirmare Plată
```
Subiect: Plată confirmată - Factură atașată

Plata dvs. a fost confirmată! ✅

📄 Factură: [DOWNLOAD]
🚗 Pregătim vehiculul pentru livrare

Veți fi contactat pentru detalii livrare.
```

---

## ⚖️ Legalitate

✅ **Transfer bancar pentru vehicule = LEGAL 100%**

**Avantaje:**
- Trasabilitate completă
- Fără risc chargeback
- Acceptat de ANPC, ANAF
- Preferat de contabili

**Dezavantaje:**
- Nu e instant (1-3 zile)
- Necesită confirmare manuală

---

## 🔒 Securitate

- ✅ Contract semnat ÎNAINTE de plată
- ✅ Referință unică pentru fiecare tranzacție
- ✅ Confirmare manuală în admin
- ✅ Dovadă plată salvată
- ✅ Factură automată după confirmare

---

## 📝 TODO Implementation

1. ✅ Documentare completă
2. ⏳ Actualizare migrații (statusuri + câmpuri)
3. ⏳ Implementare OrderController
4. ⏳ Generare PDF contracte (DomPDF / Laravel-PDF)
5. ⏳ Upload contract semnat (endpoint + validare)
6. ⏳ Admin: confirmare plată manuală
7. ⏳ Generare factură automată
8. ⏳ Email-uri automate (Mailables)
9. ⏳ Frontend: PaymentInstructions component
10. ⏳ Frontend: Admin payment confirmation

---

**✅ Sistem complet legal, sigur și ușor de întreținut pentru dealeri auto!**
