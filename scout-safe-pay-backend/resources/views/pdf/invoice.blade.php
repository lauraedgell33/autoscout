<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $invoiceNumber }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
        }
        
        .company-info h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 28px;
        }
        
        .company-info p {
            margin: 3px 0;
            font-size: 12px;
            color: #7f8c8d;
        }
        
        .invoice-details {
            text-align: right;
            font-size: 12px;
        }
        
        .invoice-details p {
            margin: 5px 0;
        }
        
        .invoice-details strong {
            color: #2c3e50;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            background-color: #34495e;
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            font-weight: bold;
            font-size: 13px;
        }
        
        .section-content {
            padding: 0 15px;
            font-size: 12px;
        }
        
        .info-box {
            background-color: #ecf0f1;
            padding: 12px;
            border-left: 3px solid #3498db;
            margin-bottom: 15px;
            line-height: 1.8;
        }
        
        .info-label {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .invoice-table th {
            background-color: #34495e;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
        }
        
        .invoice-table td {
            padding: 12px;
            border-bottom: 1px solid #bdc3c7;
            font-size: 12px;
        }
        
        .invoice-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .text-right {
            text-align: right;
        }
        
        .totals-section {
            margin-top: 20px;
        }
        
        .totals-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
            font-size: 12px;
        }
        
        .totals-label {
            width: 150px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .totals-value {
            width: 120px;
            text-align: right;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 3px;
        }
        
        .total-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
            font-size: 14px;
        }
        
        .total-label {
            width: 150px;
            font-weight: bold;
            color: #fff;
            background-color: #2c3e50;
            padding: 8px;
        }
        
        .total-value {
            width: 120px;
            text-align: right;
            font-weight: bold;
            background-color: #34495e;
            color: white;
            padding: 8px;
        }
        
        .payment-info {
            background-color: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 12px;
        }
        
        .payment-label {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .notes-section {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 11px;
            color: #856404;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #bdc3c7;
            font-size: 10px;
            color: #95a5a6;
        }
        
        .due-notice {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 11px;
            color: #721c24;
        }
        
        strong {
            color: #2c3e50;
        }
        
        .break {
            page-break-after: avoid;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="company-info">
            <h1>INVOICE</h1>
            <p><strong>AutoScout Safe Pay</strong></p>
            <p>Professional Vehicle Transaction Services</p>
        </div>
        <div class="invoice-details">
            <p><strong>Invoice #:</strong> {{ $invoiceNumber }}</p>
            <p><strong>Invoice Date:</strong> {{ $invoiceDate }}</p>
            <p><strong>Due Date:</strong> {{ $invoiceDueDate }}</p>
            <p><strong>Transaction ID:</strong> TXN-{{ str_pad($transaction->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
    </div>

    <!-- Bill To -->
    <div class="section">
        <div class="section-title">BILL TO</div>
        <div class="section-content">
            <div class="info-box">
                <div class="info-label">{{ $user->name }}</div>
                <p style="margin: 8px 0;">
                    <strong>Email:</strong> {{ $user->email }}<br>
                    <strong>Phone:</strong> {{ $user->phone ?? 'Not provided' }}<br>
                    <strong>Address:</strong> {{ $user->address ?? 'Not provided' }}
                </p>
            </div>
        </div>
    </div>

    <!-- Vehicle Information -->
    <div class="section">
        <div class="section-title">VEHICLE INFORMATION</div>
        <div class="section-content">
            <div class="info-box">
                <div class="info-label">{{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})</div>
                <p style="margin: 8px 0;">
                    <strong>VIN:</strong> {{ $vehicle->vin ?? 'Not provided' }}<br>
                    <strong>License Plate:</strong> {{ $vehicle->license_plate ?? 'Not provided' }}<br>
                    <strong>From Seller:</strong> {{ $seller->name }}<br>
                    <strong>Transaction Status:</strong> {{ ucfirst(str_replace('_', ' ', $transaction->status)) }}
                </p>
            </div>
        </div>
    </div>

    <!-- Line Items -->
    <div class="section">
        <div class="section-title">INVOICE DETAILS</div>
        <div class="section-content">
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="width: 30%;" class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>Vehicle Sale</strong><br>
                            {{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})
                        </td>
                        <td class="text-right">
                            <strong>{{ number_format($subtotal, 2, ',', '.') }} {{ $currency }}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Platform Fee</strong><br>
                            ({{ $lineItems['platformFeePercentage'] }}% of transaction value)
                        </td>
                        <td class="text-right">
                            {{ number_format($platformFee, 2, ',', '.') }} {{ $currency }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>VAT / Tax</strong><br>
                            ({{ $lineItems['taxPercentage'] }}% applicable)
                        </td>
                        <td class="text-right">
                            {{ number_format($tax, 2, ',', '.') }} {{ $currency }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Totals -->
            <div class="totals-section">
                <div class="totals-row">
                    <div class="totals-label">Subtotal:</div>
                    <div class="totals-value">{{ number_format($subtotal, 2, ',', '.') }} {{ $currency }}</div>
                </div>
                <div class="totals-row">
                    <div class="totals-label">Platform Fee:</div>
                    <div class="totals-value">{{ number_format($platformFee, 2, ',', '.') }} {{ $currency }}</div>
                </div>
                <div class="totals-row">
                    <div class="totals-label">Tax:</div>
                    <div class="totals-value">{{ number_format($tax, 2, ',', '.') }} {{ $currency }}</div>
                </div>
                <div class="total-row">
                    <div class="total-label">TOTAL DUE:</div>
                    <div class="total-value">{{ number_format($total, 2, ',', '.') }} {{ $currency }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment Information -->
    <div class="section">
        <div class="section-title">PAYMENT INFORMATION</div>
        <div class="section-content">
            <div class="payment-info">
                <div class="payment-label">Payment Method:</div>
                <p>Bank Transfer (Escrow Protected)</p>
                
                <div class="payment-label" style="margin-top: 10px;">Payment Status:</div>
                <p><strong style="color: #27ae60;">{{ ucfirst($payment->status) }}</strong></p>
                
                <div class="payment-label" style="margin-top: 10px;">Payment Reference:</div>
                <p>{{ $transaction->payment_reference }}</p>
                
                <div class="payment-label" style="margin-top: 10px;">Verification Date:</div>
                <p>{{ $payment->verified_at ? $payment->verified_at->format('d/m/Y H:i') : 'Pending' }}</p>
            </div>

            <div class="notes-section">
                <strong>Important:</strong> This invoice confirms the payment has been verified and is being processed through our secure escrow system. The vehicle will be prepared for delivery upon payment confirmation.
            </div>
        </div>
    </div>

    <!-- Due Notice -->
    <div class="due-notice">
        <strong>Payment Received:</strong> Thank you for your payment. Your transaction is secured through our escrow protection system. This invoice is for your records and does not require payment - funds have already been received and verified.
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>AutoScout Safe Pay - Professional Vehicle Transaction Services</strong></p>
        <p>Invoice #{{ $invoiceNumber }} | Generated on {{ $invoiceDate }}</p>
        <p>For invoices and payment questions, contact: <strong>billing@scoutsafepay.com</strong></p>
        <p>Transaction support: <strong>support@scoutsafepay.com</strong></p>
        <p style="margin-top: 15px; font-style: italic;">
            This invoice is automatically generated by AutoScout Safe Pay platform.<br>
            For terms of service, please visit: www.scoutsafepay.com
        </p>
    </div>
</body>
</html>
