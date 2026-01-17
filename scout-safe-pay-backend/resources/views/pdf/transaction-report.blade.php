<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Report - {{ $transaction->transaction_code }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 12px; color: #333; line-height: 1.6; }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; }
        
        /* Header */
        .header { border-bottom: 3px solid #FF6C0C; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #FF6C0C; margin-bottom: 5px; }
        .company-info { font-size: 10px; color: #666; }
        
        /* Title */
        .report-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 10px; text-align: center; }
        .report-subtitle { font-size: 12px; color: #666; margin-bottom: 30px; text-align: center; }
        
        /* Info Boxes */
        .info-grid { display: table; width: 100%; margin-bottom: 30px; }
        .info-box { display: table-cell; width: 48%; padding: 15px; background: #f8f9fa; border-radius: 5px; vertical-align: top; }
        .info-box + .info-box { margin-left: 4%; }
        .info-box h3 { font-size: 14px; color: #FF6C0C; margin-bottom: 10px; border-bottom: 2px solid #FF6C0C; padding-bottom: 5px; }
        .info-row { margin-bottom: 8px; }
        .info-label { font-weight: bold; color: #555; display: inline-block; width: 140px; }
        .info-value { color: #333; }
        
        /* Status Badge */
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-pending { background: #fff3cd; color: #856404; }
        .badge-completed { background: #d4edda; color: #155724; }
        .badge-cancelled { background: #f8d7da; color: #721c24; }
        
        /* Financial Section */
        .financial-section { background: #f0f8ff; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #16A34A; }
        .financial-section h3 { font-size: 16px; color: #16A34A; margin-bottom: 15px; }
        .amount-row { display: table; width: 100%; margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
        .amount-label { display: table-cell; font-weight: bold; color: #555; }
        .amount-value { display: table-cell; text-align: right; font-size: 16px; font-weight: bold; color: #16A34A; }
        .total-row { border-top: 2px solid #16A34A; padding-top: 10px; margin-top: 10px; }
        .total-row .amount-value { font-size: 20px; color: #FF6C0C; }
        
        /* Timeline */
        .timeline { margin: 30px 0; }
        .timeline h3 { font-size: 16px; color: #FF6C0C; margin-bottom: 15px; border-bottom: 2px solid #FF6C0C; padding-bottom: 5px; }
        .timeline-item { padding: 10px 0; border-left: 2px solid #ddd; padding-left: 20px; margin-left: 10px; position: relative; }
        .timeline-item:before { content: ''; position: absolute; left: -6px; top: 15px; width: 10px; height: 10px; border-radius: 50%; background: #FF6C0C; }
        .timeline-date { font-size: 10px; color: #999; }
        .timeline-content { font-weight: bold; color: #333; }
        
        /* Footer */
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999; }
        
        /* Page Break */
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">AutoScout24 SafeTrade</div>
            <div class="company-info">
                Secure Vehicle Transaction Platform<br>
                Generated: {{ now()->format('d/m/Y H:i') }}
            </div>
        </div>
        
        <!-- Title -->
        <div class="report-title">Transaction Report</div>
        <div class="report-subtitle">{{ $transaction->transaction_code }}</div>
        
        <!-- Transaction Info Grid -->
        <div class="info-grid">
            <div class="info-box">
                <h3>Transaction Details</h3>
                <div class="info-row">
                    <span class="info-label">Transaction Code:</span>
                    <span class="info-value">{{ $transaction->transaction_code }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="badge badge-{{ $transaction->status }}">{{ ucwords(str_replace('_', ' ', $transaction->status)) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">{{ ucwords(str_replace('_', ' ', $transaction->payment_method)) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Created:</span>
                    <span class="info-value">{{ $transaction->created_at->format('d/m/Y H:i') }}</span>
                </div>
            </div>
            
            <div class="info-box">
                <h3>Parties Involved</h3>
                <div class="info-row">
                    <span class="info-label">Buyer:</span>
                    <span class="info-value">{{ $transaction->buyer->name }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Seller:</span>
                    <span class="info-value">{{ $transaction->seller->name }}</span>
                </div>
                @if($transaction->dealer)
                <div class="info-row">
                    <span class="info-label">Dealer:</span>
                    <span class="info-value">{{ $transaction->dealer->name }}</span>
                </div>
                @endif
            </div>
        </div>
        
        <!-- Vehicle Info -->
        @if($transaction->vehicle)
        <div class="info-box" style="display: block; width: 100%; margin-bottom: 30px;">
            <h3>Vehicle Information</h3>
            <div class="info-row">
                <span class="info-label">Make & Model:</span>
                <span class="info-value">{{ $transaction->vehicle->make }} {{ $transaction->vehicle->model }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Year:</span>
                <span class="info-value">{{ $transaction->vehicle->year }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">VIN:</span>
                <span class="info-value">{{ $transaction->vehicle->vin }}</span>
            </div>
            @if($transaction->vehicle->license_plate)
            <div class="info-row">
                <span class="info-label">License Plate:</span>
                <span class="info-value">{{ $transaction->vehicle->license_plate }}</span>
            </div>
            @endif
            <div class="info-row">
                <span class="info-label">Mileage:</span>
                <span class="info-value">{{ number_format($transaction->vehicle->mileage) }} km</span>
            </div>
        </div>
        @endif
        
        <!-- Financial Summary -->
        <div class="financial-section">
            <h3>Financial Summary</h3>
            <div class="amount-row">
                <div class="amount-label">Transaction Amount:</div>
                <div class="amount-value">€{{ number_format($transaction->amount, 2) }}</div>
            </div>
            <div class="amount-row">
                <div class="amount-label">Commission Rate:</div>
                <div class="amount-value">{{ $transaction->commission_rate }}%</div>
            </div>
            <div class="amount-row">
                <div class="amount-label">Commission Amount:</div>
                <div class="amount-value">€{{ number_format($transaction->commission_amount, 2) }}</div>
            </div>
            <div class="amount-row total-row">
                <div class="amount-label">Net to Seller:</div>
                <div class="amount-value">€{{ number_format($transaction->amount - $transaction->commission_amount, 2) }}</div>
            </div>
        </div>
        
        <!-- Timeline -->
        @if($transaction->payments->count() > 0)
        <div class="timeline">
            <h3>Payment History</h3>
            @foreach($transaction->payments as $payment)
            <div class="timeline-item">
                <div class="timeline-date">{{ $payment->created_at->format('d/m/Y H:i') }}</div>
                <div class="timeline-content">
                    {{ ucwords(str_replace('_', ' ', $payment->payment_type)) }} - 
                    €{{ number_format($payment->amount, 2) }} 
                    ({{ ucfirst($payment->status) }})
                </div>
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Notes -->
        @if($transaction->notes)
        <div class="info-box" style="display: block; width: 100%; margin-top: 30px;">
            <h3>Notes</h3>
            <p style="margin-top: 10px; color: #666;">{{ $transaction->notes }}</p>
        </div>
        @endif
        
        <!-- Footer -->
        <div class="footer">
            <p>This is an official document generated by AutoScout24 SafeTrade Platform</p>
            <p>For inquiries, contact: support@autoscout24.com</p>
        </div>
    </div>
</body>
</html>
