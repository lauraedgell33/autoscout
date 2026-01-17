<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #333; }
        .header { margin-bottom: 40px; }
        .company-info { float: left; width: 50%; }
        .company-info h1 { color: #1e40af; margin: 0 0 10px 0; font-size: 24pt; }
        .company-info .tagline { color: #f97316; font-weight: bold; margin-bottom: 10px; }
        .invoice-info { float: right; width: 40%; text-align: right; }
        .invoice-info h2 { margin: 0 0 15px 0; color: #1e40af; }
        .invoice-info .detail { margin: 5px 0; }
        .invoice-info .label { font-weight: bold; }
        .clearfix::after { content: ""; display: table; clear: both; }
        .parties { margin: 40px 0; }
        .party { display: inline-block; width: 48%; vertical-align: top; }
        .party-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; font-size: 12pt; }
        .party-content { line-height: 1.6; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .items-table thead { background: #1e40af; color: white; }
        .items-table th { padding: 12px; text-align: left; font-weight: bold; }
        .items-table td { padding: 12px; border-bottom: 1px solid #ddd; }
        .items-table .description { width: 50%; }
        .items-table .amount { text-align: right; width: 15%; }
        .items-table .total-row { background: #f3f4f6; font-weight: bold; }
        .items-table .grand-total { background: #f97316; color: white; font-size: 14pt; }
        .payment-info { margin: 30px 0; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; }
        .payment-info h3 { margin: 0 0 15px 0; color: #92400e; }
        .payment-info .bank-detail { margin: 8px 0; }
        .payment-info .bank-label { font-weight: bold; display: inline-block; width: 150px; }
        .terms { margin: 30px 0; font-size: 9pt; line-height: 1.6; }
        .terms h3 { font-size: 11pt; margin-bottom: 10px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #1e40af; text-align: center; font-size: 9pt; color: #666; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 10pt; font-weight: bold; margin-left: 10px; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header clearfix">
        <div class="company-info">
            <h1>AutoScout24</h1>
            <div class="tagline">SafeTrade Platform</div>
            <div>
                SafeTrade GmbH<br>
                Hauptstraße 123<br>
                10115 Berlin, Germany<br>
                VAT: DE123456789
            </div>
        </div>
        <div class="invoice-info">
            <h2>INVOICE 
                <span class="status-badge status-{{ $invoice->status }}">
                    {{ strtoupper($invoice->status) }}
                </span>
            </h2>
            <div class="detail">
                <span class="label">Invoice No:</span> {{ $invoice->invoice_number }}
            </div>
            <div class="detail">
                <span class="label">Date:</span> {{ $invoice->issued_at->format('d.m.Y') }}
            </div>
            <div class="detail">
                <span class="label">Due Date:</span> {{ $invoice->due_at->format('d.m.Y') }}
            </div>
            <div class="detail">
                <span class="label">Transaction:</span> #{{ $transaction->id }}
            </div>
        </div>
    </div>

    <div class="parties clearfix">
        <div class="party" style="margin-right: 4%;">
            <div class="party-title">BILL TO</div>
            <div class="party-content">
                <strong>{{ $buyer->name }}</strong><br>
                {{ $buyer->email }}<br>
                @if($buyer->phone)
                    Phone: {{ $buyer->phone }}<br>
                @endif
                @if($transaction->metadata && isset($transaction->metadata['buyer_address']))
                    {{ $transaction->metadata['buyer_address']['street'] }} {{ $transaction->metadata['buyer_address']['house_number'] }}<br>
                    {{ $transaction->metadata['buyer_address']['postal_code'] }} {{ $transaction->metadata['buyer_address']['city'] }}<br>
                    {{ $transaction->metadata['buyer_address']['country'] }}
                @endif
            </div>
        </div>
        <div class="party">
            <div class="party-title">SELLER</div>
            <div class="party-content">
                @if($dealer)
                    <strong>{{ $dealer->company_name }}</strong><br>
                    Tax ID: {{ $dealer->tax_id }}<br>
                @else
                    <strong>{{ $seller->name }}</strong><br>
                @endif
                {{ $seller->email }}<br>
                @if($seller->phone)
                    Phone: {{ $seller->phone }}
                @endif
            </div>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th class="description">Description</th>
                <th class="amount">Quantity</th>
                <th class="amount">Unit Price</th>
                <th class="amount">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="description">
                    <strong>{{ $vehicle->make }} {{ $vehicle->model }}</strong><br>
                    <small>
                        Year: {{ $vehicle->year }} | 
                        @if($vehicle->mileage) Mileage: {{ number_format($vehicle->mileage) }} km | @endif
                        VIN: {{ $vehicle->vin ?? 'N/A' }}
                    </small>
                </td>
                <td class="amount">1</td>
                <td class="amount">€{{ number_format($invoice->amount, 2) }}</td>
                <td class="amount">€{{ number_format($invoice->amount, 2) }}</td>
            </tr>
            <tr>
                <td class="description">
                    <strong>SafeTrade Service Fee</strong><br>
                    <small>Secure escrow & transaction management (2.5%)</small>
                </td>
                <td class="amount">1</td>
                <td class="amount">€{{ number_format(max($invoice->amount * 0.025, 25), 2) }}</td>
                <td class="amount">€{{ number_format(max($invoice->amount * 0.025, 25), 2) }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="3" style="text-align: right;">Subtotal (Net)</td>
                <td class="amount">€{{ number_format($invoice->amount + max($invoice->amount * 0.025, 25), 2) }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;">VAT ({{ $invoice->vat_percentage }}%)</td>
                <td class="amount">€{{ number_format(($invoice->amount + max($invoice->amount * 0.025, 25)) * ($invoice->vat_percentage / 100), 2) }}</td>
            </tr>
            <tr class="grand-total">
                <td colspan="3" style="text-align: right; font-size: 14pt;">TOTAL AMOUNT DUE</td>
                <td class="amount" style="font-size: 14pt;">€{{ number_format(($invoice->amount + max($invoice->amount * 0.025, 25)) * (1 + $invoice->vat_percentage / 100), 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="payment-info">
        <h3>💰 Payment Instructions</h3>
        <p>Please transfer the total amount to the following AutoScout24 SafeTrade escrow account:</p>
        <div class="bank-detail">
            <span class="bank-label">Bank Name:</span> Commerzbank AG
        </div>
        <div class="bank-detail">
            <span class="bank-label">Account Holder:</span> AutoScout24 SafeTrade GmbH
        </div>
        <div class="bank-detail">
            <span class="bank-label">IBAN:</span> DE89 3704 0044 0532 0130 00
        </div>
        <div class="bank-detail">
            <span class="bank-label">BIC/SWIFT:</span> COBADEFFXXX
        </div>
        <div class="bank-detail">
            <span class="bank-label">Reference:</span> <strong>{{ $invoice->invoice_number }} / TXN-{{ $transaction->id }}</strong>
        </div>
        <p style="margin-top: 15px;"><strong>⚠️ Important:</strong> Please include the reference number in your payment to ensure proper allocation.</p>
    </div>

    <div class="terms">
        <h3>Payment Terms & Conditions</h3>
        <ul style="margin: 0; padding-left: 20px;">
            <li>Payment is due within 7 days of invoice date (by {{ $invoice->due_at->format('d.m.Y') }})</li>
            <li>All payments must be made to the AutoScout24 SafeTrade escrow account listed above</li>
            <li>Funds will be held securely until vehicle delivery is confirmed by the buyer</li>
            <li>After confirmation, funds will be released to the seller within 2 business days</li>
            <li>If payment is not received by the due date, the transaction may be automatically cancelled</li>
            <li>For any payment queries, please contact: payments@autoscout24-safetrade.de</li>
        </ul>
    </div>

    <div class="footer">
        <strong>AutoScout24 SafeTrade GmbH</strong><br>
        Hauptstraße 123, 10115 Berlin, Germany | VAT: DE123456789<br>
        Email: support@autoscout24-safetrade.de | Phone: +49 (0) 800 123 4567<br>
        <br>
        This is a computer-generated invoice and does not require a signature.
    </div>
</body>
</html>
