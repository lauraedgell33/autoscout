<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vehicle Purchase Contract</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 24pt; }
        .header .subtitle { color: #f97316; font-weight: bold; margin-top: 5px; }
        .section { margin-bottom: 25px; }
        .section-title { background: #1e40af; color: white; padding: 8px 15px; font-weight: bold; margin-bottom: 15px; }
        .info-box { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; background: #f9f9f9; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { width: 40%; font-weight: bold; }
        .info-value { width: 60%; }
        .vehicle-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .spec-item { padding: 5px 0; }
        .spec-label { font-weight: bold; color: #666; font-size: 9pt; }
        .spec-value { color: #000; }
        .price-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .price-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .price-table .label { font-weight: bold; width: 70%; }
        .price-table .amount { text-align: right; width: 30%; }
        .price-table .total { background: #f97316; color: white; font-size: 14pt; font-weight: bold; }
        .terms { font-size: 9pt; line-height: 1.6; margin-top: 30px; }
        .terms ol { padding-left: 20px; }
        .terms li { margin-bottom: 10px; }
        .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 45%; }
        .signature-line { border-top: 2px solid #000; margin-top: 60px; padding-top: 10px; }
        .footer { margin-top: 40px; text-align: center; font-size: 8pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 15px 0; font-size: 9pt; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AutoScout24 SafeTrade</h1>
        <div class="subtitle">VEHICLE PURCHASE CONTRACT</div>
        <div style="margin-top: 10px; font-size: 10pt;">
            Contract No: <strong>{{ $contract_number }}</strong> | Date: <strong>{{ $contract_date }}</strong>
        </div>
    </div>

    <div class="section">
        <div class="section-title">1. BUYER INFORMATION</div>
        <div class="info-box">
            <div class="info-row">
                <div class="info-label">Full Name:</div>
                <div class="info-value">{{ $buyer->name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $buyer->email }}</div>
            </div>
            @if($buyer->phone)
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">{{ $buyer->phone }}</div>
            </div>
            @endif
            @if($transaction->metadata && isset($transaction->metadata['buyer_address']))
            <div class="info-row">
                <div class="info-label">Address:</div>
                <div class="info-value">
                    {{ $transaction->metadata['buyer_address']['street'] }} {{ $transaction->metadata['buyer_address']['house_number'] }},
                    {{ $transaction->metadata['buyer_address']['postal_code'] }} {{ $transaction->metadata['buyer_address']['city'] }},
                    {{ $transaction->metadata['buyer_address']['country'] }}
                </div>
            </div>
            @endif
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. SELLER INFORMATION</div>
        <div class="info-box">
            @if($dealer)
            <div class="info-row">
                <div class="info-label">Company:</div>
                <div class="info-value">{{ $dealer->company_name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Tax ID:</div>
                <div class="info-value">{{ $dealer->tax_id }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Contact Person:</div>
                <div class="info-value">{{ $seller->name }}</div>
            </div>
            @else
            <div class="info-row">
                <div class="info-label">Full Name:</div>
                <div class="info-value">{{ $seller->name }}</div>
            </div>
            @endif
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $seller->email }}</div>
            </div>
            @if($seller->phone)
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">{{ $seller->phone }}</div>
            </div>
            @endif
        </div>
    </div>

    <div class="section">
        <div class="section-title">3. VEHICLE DETAILS</div>
        <div class="info-box">
            <div class="info-row">
                <div class="info-label">Make & Model:</div>
                <div class="info-value"><strong>{{ $vehicle->make }} {{ $vehicle->model }}</strong></div>
            </div>
            <div class="info-row">
                <div class="info-label">Year:</div>
                <div class="info-value">{{ $vehicle->year }}</div>
            </div>
            @if($vehicle->vin)
            <div class="info-row">
                <div class="info-label">VIN:</div>
                <div class="info-value">{{ $vehicle->vin }}</div>
            </div>
            @endif
            
            <div class="vehicle-specs">
                @if($vehicle->mileage)
                <div class="spec-item">
                    <div class="spec-label">Mileage</div>
                    <div class="spec-value">{{ number_format($vehicle->mileage) }} km</div>
                </div>
                @endif
                @if($vehicle->fuel_type)
                <div class="spec-item">
                    <div class="spec-label">Fuel Type</div>
                    <div class="spec-value">{{ ucfirst($vehicle->fuel_type) }}</div>
                </div>
                @endif
                @if($vehicle->transmission)
                <div class="spec-item">
                    <div class="spec-label">Transmission</div>
                    <div class="spec-value">{{ ucfirst($vehicle->transmission) }}</div>
                </div>
                @endif
                @if($vehicle->color)
                <div class="spec-item">
                    <div class="spec-label">Color</div>
                    <div class="spec-value">{{ ucfirst($vehicle->color) }}</div>
                </div>
                @endif
                @if($vehicle->engine_size)
                <div class="spec-item">
                    <div class="spec-label">Engine Size</div>
                    <div class="spec-value">{{ $vehicle->engine_size }} cc</div>
                </div>
                @endif
                @if($vehicle->power_hp)
                <div class="spec-item">
                    <div class="spec-label">Power</div>
                    <div class="spec-value">{{ $vehicle->power_hp }} HP</div>
                </div>
                @endif
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">4. FINANCIAL DETAILS</div>
        <table class="price-table">
            <tr>
                <td class="label">Vehicle Price (Net)</td>
                <td class="amount">€{{ number_format($net_amount, 2) }}</td>
            </tr>
            <tr>
                <td class="label">VAT (19%)</td>
                <td class="amount">€{{ number_format($vat_amount, 2) }}</td>
            </tr>
            <tr>
                <td class="label">SafeTrade Service Fee (2.5%)</td>
                <td class="amount">€{{ number_format(max($net_amount * 0.025, 25), 2) }}</td>
            </tr>
            <tr class="total">
                <td class="label">TOTAL AMOUNT</td>
                <td class="amount">€{{ number_format($total_amount, 2) }}</td>
            </tr>
        </table>

        <div class="warning">
            <strong>⚠️ Payment Instructions:</strong> The buyer must transfer the total amount to the AutoScout24 SafeTrade escrow account. Funds will be held securely until vehicle delivery is confirmed.
        </div>
    </div>

    <div class="section">
        <div class="section-title">5. TERMS AND CONDITIONS</div>
        <div class="terms">
            <ol>
                <li><strong>Payment:</strong> The buyer agrees to pay the total amount specified above. Payment must be made via bank transfer to the AutoScout24 SafeTrade secure escrow account within 7 days of contract signing.</li>
                
                <li><strong>Vehicle Condition:</strong> The seller warrants that the vehicle is in the condition as described in the listing and all specifications provided are accurate. Any known defects have been disclosed.</li>
                
                <li><strong>Ownership Transfer:</strong> The seller confirms that they are the legal owner of the vehicle and have the right to sell it. The vehicle is free from any liens, encumbrances, or legal claims.</li>
                
                <li><strong>Delivery:</strong> The vehicle will be made available for collection within 14 days of payment confirmation. The buyer is responsible for arranging transportation unless otherwise agreed.</li>
                
                <li><strong>Inspection Period:</strong> The buyer has 48 hours from vehicle collection to inspect and verify that it matches the description. Any discrepancies must be reported immediately to AutoScout24 SafeTrade.</li>
                
                <li><strong>SafeTrade Protection:</strong> This transaction is protected by AutoScout24 SafeTrade. Funds will be held in escrow until both parties confirm successful completion of the transaction.</li>
                
                <li><strong>Cancellation:</strong> Either party may cancel this contract within 24 hours of signing without penalty. After this period, cancellation terms will apply as per AutoScout24 SafeTrade policies.</li>
                
                <li><strong>Warranty:</strong> @if($dealer) As a dealer sale, statutory warranty obligations apply according to local consumer protection laws. @else This is a private sale and is sold "as is" with no warranty unless explicitly stated. @endif</li>
                
                <li><strong>Dispute Resolution:</strong> Any disputes arising from this contract will be handled through AutoScout24 SafeTrade dispute resolution process. If unresolved, disputes will be subject to arbitration under German law.</li>
                
                <li><strong>Data Protection:</strong> Both parties consent to AutoScout24 processing their personal data for the purpose of completing this transaction in accordance with GDPR regulations.</li>
            </ol>
        </div>
    </div>

    <div class="signatures">
        <div class="signature-box">
            <div><strong>BUYER</strong></div>
            <div class="signature-line">
                <div>{{ $buyer->name }}</div>
                <div style="font-size: 9pt; color: #666;">Date: _________________</div>
            </div>
        </div>
        
        <div class="signature-box">
            <div><strong>SELLER</strong></div>
            <div class="signature-line">
                <div>{{ $dealer ? $dealer->company_name : $seller->name }}</div>
                <div style="font-size: 9pt; color: #666;">Date: _________________</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>AutoScout24 SafeTrade</strong> | Secure Vehicle Marketplace<br>
        This contract is legally binding. Both parties should retain a copy for their records.<br>
        For support: support@autoscout24-safetrade.de | +49 (0) 800 123 4567
    </div>
</body>
</html>
