<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dealer Report - {{ $dealer->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 12px; color: #333; line-height: 1.6; }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; }
        
        .header { border-bottom: 3px solid #FF6C0C; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #FF6C0C; margin-bottom: 5px; }
        .company-info { font-size: 10px; color: #666; }
        
        .report-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 10px; text-align: center; }
        .report-subtitle { font-size: 12px; color: #666; margin-bottom: 30px; text-align: center; }
        
        .info-section { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .info-section h3 { font-size: 16px; color: #FF6C0C; margin-bottom: 15px; border-bottom: 2px solid #FF6C0C; padding-bottom: 5px; }
        .info-row { display: table; width: 100%; margin-bottom: 10px; }
        .info-label { display: table-cell; font-weight: bold; color: #555; width: 180px; }
        .info-value { display: table-cell; color: #333; }
        
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-active { background: #d4edda; color: #155724; }
        .badge-pending { background: #fff3cd; color: #856404; }
        .badge-verified { background: #d1ecf1; color: #0c5460; }
        
        .stats-grid { display: table; width: 100%; margin-bottom: 30px; }
        .stat-box { display: table-cell; width: 31%; padding: 20px; background: #f0f8ff; border-radius: 5px; text-align: center; }
        .stat-box + .stat-box { margin-left: 3.5%; }
        .stat-number { font-size: 28px; font-weight: bold; color: #FF6C0C; margin-bottom: 5px; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        
        .transactions-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .transactions-table th { background: #FF6C0C; color: white; padding: 10px; text-align: left; font-size: 11px; }
        .transactions-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 11px; }
        .transactions-table tr:hover { background: #f8f9fa; }
        
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AutoScout24 SafeTrade</div>
            <div class="company-info">
                Dealer Performance Report<br>
                Generated: {{ now()->format('d/m/Y H:i') }}
            </div>
        </div>
        
        <div class="report-title">Dealer Report</div>
        <div class="report-subtitle">{{ $dealer->name }}</div>
        
        <div class="info-section">
            <h3>Company Information</h3>
            <div class="info-row">
                <div class="info-label">Company Name:</div>
                <div class="info-value">{{ $dealer->company_name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">VAT Number:</div>
                <div class="info-value">{{ $dealer->vat_number }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $dealer->email }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">{{ $dealer->phone ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Address:</div>
                <div class="info-value">
                    {{ $dealer->address ?? '' }}
                    {{ $dealer->city ? ', ' . $dealer->city : '' }}
                    {{ $dealer->postal_code ? ' ' . $dealer->postal_code : '' }}
                    {{ $dealer->country ? ', ' . $dealer->country : '' }}
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value">
                    <span class="badge badge-{{ $dealer->status }}">{{ ucfirst($dealer->status) }}</span>
                    @if($dealer->is_verified)
                    <span class="badge badge-verified">Verified</span>
                    @endif
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Commission Rate:</div>
                <div class="info-value">{{ $dealer->commission_rate }}%</div>
            </div>
            <div class="info-row">
                <div class="info-label">Member Since:</div>
                <div class="info-value">{{ $dealer->created_at->format('d/m/Y') }}</div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">{{ $dealer->transactions()->count() }}</div>
                <div class="stat-label">Total Transactions</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">€{{ number_format($dealer->transactions()->sum('amount'), 2) }}</div>
                <div class="stat-label">Total Volume</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">€{{ number_format($dealer->transactions()->sum('commission_amount'), 2) }}</div>
                <div class="stat-label">Total Commission</div>
            </div>
        </div>
        
        @if($dealer->transactions()->count() > 0)
        <h3 style="font-size: 16px; color: #FF6C0C; margin: 30px 0 15px; border-bottom: 2px solid #FF6C0C; padding-bottom: 5px;">Recent Transactions</h3>
        <table class="transactions-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Code</th>
                    <th>Buyer</th>
                    <th>Amount</th>
                    <th>Commission</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dealer->transactions()->latest()->limit(10)->get() as $transaction)
                <tr>
                    <td>{{ $transaction->created_at->format('d/m/Y') }}</td>
                    <td>{{ $transaction->transaction_code }}</td>
                    <td>{{ $transaction->buyer->name }}</td>
                    <td>€{{ number_format($transaction->amount, 2) }}</td>
                    <td>€{{ number_format($transaction->commission_amount, 2) }}</td>
                    <td>{{ ucwords(str_replace('_', ' ', $transaction->status)) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
        
        <div class="footer">
            <p>This is an official document generated by AutoScout24 SafeTrade Platform</p>
            <p>For inquiries, contact: support@autoscout24.com</p>
        </div>
    </div>
</body>
</html>
