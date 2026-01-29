<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff6600; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .payment-box { background: white; padding: 20px; border: 2px solid #ff6600; margin: 20px 0; border-radius: 8px; }
        .payment-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .payment-label { font-weight: bold; color: #666; }
        .payment-value { font-family: monospace; color: #000; }
        .amount { font-size: 24px; font-weight: bold; color: #ff6600; }
        .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Contract Semnat - Instrucțiuni de Plată</h1>
        </div>
        
        <div class="content">
            <h2>Bună {{ $buyerName }},</h2>
            
            <p>Contractul dumneavoastră pentru <strong>{{ $vehicleTitle }}</strong> a fost semnat cu succes!</p>
            
            <p>Vă rugăm efectuați plata prin transfer bancar folosind detaliile de mai jos:</p>
            
            <div class="payment-box">
                <h3 style="margin-top: 0; color: #ff6600;">💳 Detalii Transfer Bancar</h3>
                
                <div class="payment-row">
                    <span class="payment-label">IBAN:</span>
                    <span class="payment-value">{{ $iban }}</span>
                </div>
                
                <div class="payment-row">
                    <span class="payment-label">Beneficiar:</span>
                    <span class="payment-value">{{ $holder }}</span>
                </div>
                
                <div class="payment-row">
                    <span class="payment-label">Bancă:</span>
                    <span class="payment-value">{{ $bank }}</span>
                </div>
                
                <div class="payment-row">
                    <span class="payment-label">Sumă:</span>
                    <span class="amount">{{ $amount }} {{ $currency }}</span>
                </div>
                
                <div class="payment-row">
                    <span class="payment-label">Referință:</span>
                    <span class="payment-value" style="font-size: 18px; color: #ff6600;">{{ $reference }}</span>
                </div>
                
                <div class="payment-row" style="border-bottom: none;">
                    <span class="payment-label">Termen limită:</span>
                    <span class="payment-value">{{ $deadline }} ({{ $daysRemaining }} zile)</span>
                </div>
            </div>
            
            <div class="warning">
                <h4 style="margin-top: 0;">⚠️ FOARTE IMPORTANT:</h4>
                <ul style="margin: 10px 0;">
                    <li><strong>Includeți referința <span style="background: #ffeb3b; padding: 2px 5px;">{{ $reference }}</span> în descrierea plății!</strong></li>
                    <li>Plata trebuie efectuată în termen de {{ $daysRemaining }} zile</li>
                    <li>După efectuarea plății, aceasta va fi confirmată în maxim 24 de ore lucrătoare</li>
                    <li>Veți primi factura pe email imediat după confirmarea plății</li>
                </ul>
            </div>
            
            <p><strong>Pași pentru efectuarea plății:</strong></p>
            <ol>
                <li>Conectați-vă la internet banking</li>
                <li>Creați un transfer nou cu detaliile de mai sus</li>
                <li>În câmpul "Detalii plată" / "Descriere" introduceți: <strong>{{ $reference }}</strong></li>
                <li>Confirmați transferul</li>
            </ol>
            
            <p>Vă mulțumim pentru încredere!</p>
        </div>
        
        <div class="footer">
            <p>© 2026 AutoScout24 SafeTrade. Toate drepturile rezervate.</p>
            <p>Pentru asistență: support@autoscout24-safetrade.com | +40 123 456 789</p>
        </div>
    </div>
</body>
</html>
