<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11pt; line-height: 1.4; color: #000; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ff6600; padding-bottom: 20px; }
        .header h1 { color: #ff6600; font-size: 24pt; margin: 10px 0; }
        .header h2 { font-size: 16pt; color: #333; margin: 5px 0; }
        .section { margin: 20px 0; }
        .section-title { font-size: 13pt; font-weight: bold; color: #ff6600; margin: 15px 0 10px; border-bottom: 2px solid #ff6600; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table.info td { padding: 8px; border: 1px solid #ddd; }
        table.info td:first-child { width: 40%; background: #f5f5f5; font-weight: bold; }
        .party-box { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .party-title { font-weight: bold; font-size: 12pt; color: #333; margin-bottom: 8px; }
        .signature-box { margin-top: 40px; padding: 20px 0; }
        .signature-line { width: 45%; float: left; text-align: center; }
        .signature-line .line { border-top: 2px solid #000; margin: 50px 20px 10px; }
        .footer { clear: both; margin-top: 60px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        .highlight { background: #ffeb3b; padding: 2px 5px; font-weight: bold; }
        ul { margin: 10px 0; padding-left: 25px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONTRACT DE VÂNZARE-CUMPĂRARE AUTOVEHICUL</h1>
        <h2>Nr. {{ $transaction->contract_number ?? 'N/A' }}</h2>
        <p>Data: {{ $transaction->contract_generated_at ? $transaction->contract_generated_at->format('d.m.Y') : date('d.m.Y') }}</p>
    </div>

    <div class="section">
        <div class="section-title">1. PĂRȚILE CONTRACTANTE</div>
        
        <div class="party-box">
            <div class="party-title">VÂNZĂTOR (Dealer)</div>
            <table class="info">
                <tr>
                    <td>Denumire / Nume</td>
                    <td>{{ $transaction->dealer->company_name ?? $transaction->dealer->name }}</td>
                </tr>
                <tr>
                    <td>CUI / CNP</td>
                    <td>{{ $transaction->dealer->company_registration ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>Adresă</td>
                    <td>{{ $transaction->dealer->address ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>Telefon</td>
                    <td>{{ $transaction->dealer->phone ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $transaction->dealer->email }}</td>
                </tr>
            </table>
        </div>

        <div class="party-box">
            <div class="party-title">CUMPĂRĂTOR</div>
            <table class="info">
                <tr>
                    <td>Nume</td>
                    <td>{{ $transaction->buyer->name }}</td>
                </tr>
                <tr>
                    <td>CNP</td>
                    <td>{{ $transaction->buyer->cnp ?? 'Se va completa' }}</td>
                </tr>
                <tr>
                    <td>CI / Pașaport</td>
                    <td>{{ $transaction->buyer->id_number ?? 'Se va completa' }}</td>
                </tr>
                <tr>
                    <td>Adresă</td>
                    <td>{{ $transaction->buyer->address ?? 'Se va completa' }}</td>
                </tr>
                <tr>
                    <td>Telefon</td>
                    <td>{{ $transaction->buyer->phone ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $transaction->buyer->email }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. OBIECTUL CONTRACTULUI</div>
        <p>Vânzătorul se obligă să transmită cumpărătorului următorul autovehicul:</p>
        
        <table class="info">
            <tr>
                <td>Marcă și Model</td>
                <td>{{ $transaction->vehicle->make }} {{ $transaction->vehicle->model }}</td>
            </tr>
            <tr>
                <td>An Fabricație</td>
                <td>{{ $transaction->vehicle->year }}</td>
            </tr>
            <tr>
                <td>Număr Identificare (VIN)</td>
                <td class="highlight">{{ $transaction->vehicle->vin }}</td>
            </tr>
            <tr>
                <td>Număr Înmatriculare</td>
                <td>{{ $transaction->vehicle->license_plate ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Capacitate Cilindrică</td>
                <td>{{ $transaction->vehicle->engine_capacity ?? 'N/A' }} cm³</td>
            </tr>
            <tr>
                <td>Putere Motor</td>
                <td>{{ $transaction->vehicle->horsepower ?? 'N/A' }} CP</td>
            </tr>
            <tr>
                <td>Combustibil</td>
                <td>{{ $transaction->vehicle->fuel_type ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Transmisie</td>
                <td>{{ $transaction->vehicle->transmission ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Kilometraj</td>
                <td>{{ number_format($transaction->vehicle->mileage ?? 0, 0, ',', '.') }} km</td>
            </tr>
            <tr>
                <td>Culoare</td>
                <td>{{ $transaction->vehicle->color ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">3. PREȚUL ȘI MODALITATEA DE PLATĂ</div>
        
        <table class="info">
            <tr>
                <td>Preț Total</td>
                <td class="highlight" style="font-size: 14pt;">{{ number_format($transaction->amount, 2, ',', '.') }} {{ $transaction->currency }}</td>
            </tr>
            <tr>
                <td>Modalitate Plată</td>
                <td>Transfer Bancar</td>
            </tr>
            <tr>
                <td>IBAN Beneficiar</td>
                <td>{{ $transaction->bank_account_iban }}</td>
            </tr>
            <tr>
                <td>Titular Cont</td>
                <td>{{ $transaction->bank_account_holder }}</td>
            </tr>
            <tr>
                <td>Bancă</td>
                <td>{{ $transaction->bank_name }}</td>
            </tr>
            <tr>
                <td>Referință Plată</td>
                <td class="highlight">{{ $transaction->payment_reference }}</td>
            </tr>
            <tr>
                <td>Termen Plată</td>
                <td>{{ $transaction->payment_deadline ? $transaction->payment_deadline->format('d.m.Y') : 'N/A' }}</td>
            </tr>
        </table>

        <p><strong>IMPORTANT:</strong> La efectuarea transferului bancar, cumpărătorul trebuie să menționeze obligatoriu referința: <span class="highlight">{{ $transaction->payment_reference }}</span></p>
    </div>

    <div class="section">
        <div class="section-title">4. OBLIGAȚIILE VÂNZĂTORULUI</div>
        <ul>
            <li>Să predea vehiculul în starea descrisă în prezentul contract</li>
            <li>Să predea toate documentele vehiculului (carte de identitate, certificate, manuale)</li>
            <li>Să predea toate cheile vehiculului</li>
            <li>Să asigure că vehiculul nu are sarcini, gajări sau litigii</li>
            <li>Să furnizeze toate informațiile cunoscute despre istoricul vehiculului</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">5. OBLIGAȚIILE CUMPĂRĂTORULUI</div>
        <ul>
            <li>Să efectueze plata integrală a prețului în termenul stabilit</li>
            <li>Să preia vehiculul la data convenită</li>
            <li>Să realizeze transferul de proprietate în termen de 90 de zile</li>
            <li>Să achite toate taxele și impozitele aferente transferului</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">6. GARANȚII ȘI DECLARAȚII</div>
        <ul>
            <li>Vânzătorul declară că este proprietarul legal al vehiculului</li>
            <li>Vehiculul nu face obiectul unor litigii, gajări sau sarcini</li>
            <li>Toate informațiile furnizate despre vehicul sunt corecte și complete</li>
            <li>Cumpărătorul a verificat vehiculul și îl acceptă în starea actuală</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">7. DISPOZIȚII FINALE</div>
        <ul>
            <li>Prezentul contract intră în vigoare la data semnării de ambele părți</li>
            <li>Transferul de proprietate se efectuează după confirmarea plății integrale</li>
            <li>Litigiile vor fi soluționate pe cale amiabilă sau, în lipsa unui acord, la instanțele judecătorești competente</li>
            <li>Contractul este reglementat de Codul Civil Român</li>
        </ul>
    </div>

    <div class="signature-box">
        <div class="signature-line">
            <div class="line"></div>
            <strong>VÂNZĂTOR</strong><br>
            {{ $transaction->dealer->company_name ?? $transaction->dealer->name }}<br>
            Data: _______________
        </div>

        <div class="signature-line">
            <div class="line"></div>
            <strong>CUMPĂRĂTOR</strong><br>
            {{ $transaction->buyer->name }}<br>
            Data: _______________
        </div>
    </div>

    <div class="footer">
        <p>Contract generat prin platforma AutoScout24 SafeTrade | {{ config('app.url') }}</p>
        <p>Pentru verificarea autenticității contractului, accesați: {{ route('verify-contract', $transaction->contract_number ?? '') }}</p>
    </div>
</body>
</html>
