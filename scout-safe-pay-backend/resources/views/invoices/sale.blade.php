<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10pt; line-height: 1.3; color: #000; }
        .header { border-bottom: 3px solid #ff6600; margin-bottom: 20px; padding-bottom: 15px; }
        .company-info { float: left; width: 50%; }
        .invoice-info { float: right; width: 45%; text-align: right; }
        .company-logo { font-size: 20pt; font-weight: bold; color: #ff6600; margin-bottom: 10px; }
        .invoice-title { font-size: 24pt; font-weight: bold; color: #333; margin: 10px 0; }
        .invoice-number { font-size: 14pt; color: #ff6600; }
        .clear { clear: both; }
        .section { margin: 20px 0; }
        .section-title { font-size: 11pt; font-weight: bold; background: #f5f5f5; padding: 8px; margin: 15px 0 10px; }
        .buyer-seller { width: 100%; margin: 20px 0; }
        .party-box { width: 48%; float: left; border: 1px solid #ddd; padding: 12px; min-height: 120px; }
        .party-box:last-child { float: right; }
        .party-title { font-weight: bold; font-size: 11pt; color: #ff6600; margin-bottom: 8px; }
        table.items { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table.items th { background: #ff6600; color: white; padding: 10px; text-align: left; font-size: 10pt; }
        table.items td { border: 1px solid #ddd; padding: 10px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { background: #f5f5f5; font-weight: bold; }
        .grand-total { background: #ff6600; color: white; font-size: 12pt; }
        .payment-info { background: #f9f9f9; border: 2px solid #ff6600; padding: 15px; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 8pt; text-align: center; color: #666; }
        .stamp-box { float: right; width: 200px; min-height: 100px; border: 2px dashed #ccc; text-align: center; padding: 10px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <div class="company-logo">🚗 AutoScout24 SafeTrade</div>
            <strong>{{ $transaction->dealer->company_name ?? $transaction->dealer->name }}</strong><br>
            CUI/CIF: {{ $transaction->dealer->company_registration ?? 'N/A' }}<br>
            Nr. Reg. Com.: {{ $transaction->dealer->trade_register ?? 'N/A' }}<br>
            Adresă: {{ $transaction->dealer->address ?? 'N/A' }}<br>
            Telefon: {{ $transaction->dealer->phone ?? 'N/A' }}<br>
            Email: {{ $transaction->dealer->email }}
        </div>

        <div class="invoice-info">
            <div class="invoice-title">FACTURĂ</div>
            <div class="invoice-number">Nr. {{ $transaction->invoice_number }}</div>
            <br>
            <strong>Data emiterii:</strong> {{ $transaction->invoice_generated_at ? $transaction->invoice_generated_at->format('d.m.Y') : date('d.m.Y') }}<br>
            <strong>Data scadență:</strong> {{ $transaction->invoice_generated_at ? $transaction->invoice_generated_at->addDays(30)->format('d.m.Y') : date('d.m.Y') }}<br>
            <strong>Serie:</strong> AS{{ date('Y') }}
        </div>
        
        <div class="clear"></div>
    </div>

    <div class="buyer-seller">
        <div class="party-box">
            <div class="party-title">FURNIZOR (Vânzător)</div>
            <strong>{{ $transaction->dealer->company_name ?? $transaction->dealer->name }}</strong><br>
            CUI: {{ $transaction->dealer->company_registration ?? 'N/A' }}<br>
            {{ $transaction->dealer->address ?? 'N/A' }}<br>
            Cont IBAN: {{ $transaction->bank_account_iban }}<br>
            Bancă: {{ $transaction->bank_name }}
        </div>

        <div class="party-box">
            <div class="party-title">CLIENT (Cumpărător)</div>
            <strong>{{ $transaction->buyer->name }}</strong><br>
            CNP: {{ $transaction->buyer->cnp ?? 'N/A' }}<br>
            CI: {{ $transaction->buyer->id_number ?? 'N/A' }}<br>
            {{ $transaction->buyer->address ?? 'N/A' }}<br>
            Telefon: {{ $transaction->buyer->phone ?? 'N/A' }}
        </div>

        <div class="clear"></div>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%;">Nr.</th>
                <th style="width: 45%;">Denumire produs / serviciu</th>
                <th style="width: 10%;" class="text-center">UM</th>
                <th style="width: 10%;" class="text-right">Cant.</th>
                <th style="width: 15%;" class="text-right">Preț unitar</th>
                <th style="width: 15%;" class="text-right">Valoare</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">1</td>
                <td>
                    <strong>Autovehicul {{ $transaction->vehicle->make }} {{ $transaction->vehicle->model }}</strong><br>
                    <small>
                        An: {{ $transaction->vehicle->year }} | 
                        VIN: {{ $transaction->vehicle->vin }}<br>
                        Km: {{ number_format($transaction->vehicle->mileage ?? 0, 0, ',', '.') }} | 
                        Combustibil: {{ $transaction->vehicle->fuel_type ?? 'N/A' }} | 
                        Putere: {{ $transaction->vehicle->horsepower ?? 'N/A' }} CP
                    </small>
                </td>
                <td class="text-center">buc</td>
                <td class="text-right">1</td>
                <td class="text-right">{{ number_format($transaction->amount, 2, ',', '.') }}</td>
                <td class="text-right">{{ number_format($transaction->amount, 2, ',', '.') }}</td>
            </tr>

            @php
                $subtotal = $transaction->amount;
                $vatRate = 0.19; // TVA 19%
                $vatAmount = $subtotal * $vatRate;
                $total = $subtotal + $vatAmount;
            @endphp

            <tr class="total-row">
                <td colspan="5" class="text-right">SUBTOTAL (fără TVA):</td>
                <td class="text-right">{{ number_format($subtotal, 2, ',', '.') }} {{ $transaction->currency }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="5" class="text-right">TVA 19%:</td>
                <td class="text-right">{{ number_format($vatAmount, 2, ',', '.') }} {{ $transaction->currency }}</td>
            </tr>
            <tr class="grand-total">
                <td colspan="5" class="text-right">TOTAL DE PLATĂ:</td>
                <td class="text-right">{{ number_format($total, 2, ',', '.') }} {{ $transaction->currency }}</td>
            </tr>
        </tbody>
    </table>

    <div class="payment-info">
        <strong style="font-size: 11pt; color: #ff6600;">INFORMAȚII PLATĂ:</strong><br>
        Plata a fost efectuată prin <strong>Transfer Bancar</strong><br>
        Data plății: <strong>{{ $transaction->payment_confirmed_at ? $transaction->payment_confirmed_at->format('d.m.Y H:i') : 'N/A' }}</strong><br>
        Referință: <strong>{{ $transaction->payment_reference }}</strong><br>
        <br>
        <em>Plata a fost confirmată și înregistrată în sistem.</em>
    </div>

    <div class="section">
        <div class="section-title">MENȚIUNI LEGALE</div>
        <ul style="font-size: 9pt; margin: 10px 0; padding-left: 20px;">
            <li>Factură emisă conform Legii 227/2015 privind Codul Fiscal</li>
            <li>TVA calculată conform art. 291 din Codul Fiscal</li>
            <li>Autovehiculul se vinde cu toate accesoriile și documentele menționate în contract</li>
            <li>Transferul de proprietate se realizează conform legislației în vigoare</li>
            <li>Cumpărătorul are obligația de a realiza transferul de proprietate în termen de 90 de zile</li>
        </ul>
    </div>

    <div style="margin-top: 40px;">
        <div style="float: left; width: 45%;">
            <strong>ÎNTOCMIT:</strong><br>
            <div style="margin-top: 40px; border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">
                Semnătură / Nume
            </div>
        </div>

        <div class="stamp-box">
            <strong>ȘTAMPILA<br>FIRMEI</strong>
        </div>

        <div class="clear"></div>
    </div>

    <div class="footer">
        <p><strong>Factură generată electronic prin platforma AutoScout24 SafeTrade</strong></p>
        <p>{{ config('app.url') }} | support@autoscout24-safetrade.com</p>
        <p>Pentru verificarea autenticității facturii, accesați: {{ route('verify-invoice', $transaction->invoice_number ?? '') }}</p>
        <p style="margin-top: 10px; font-size: 7pt;">
            Documentul este valabil fără semnătură și ștampilă conform Legii 227/2015 Art. 319 alin. (29)
        </p>
    </div>
</body>
</html>
