<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff6600; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #ff6600; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info-box { background: white; padding: 15px; border-left: 4px solid #ff6600; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 AutoScout24 SafeTrade</h1>
        </div>
        
        <div class="content">
            <h2>Bună {{ $buyerName }},</h2>
            
            <p>Contractul pentru <strong>{{ $vehicleTitle }} ({{ $vehicleYear }})</strong> a fost generat cu succes!</p>
            
            <div class="info-box">
                <h3>📄 Detalii Contract</h3>
                <ul>
                    <li><strong>Vehicul:</strong> {{ $vehicleTitle }}</li>
                    <li><strong>Preț:</strong> {{ $amount }} {{ $currency }}</li>
                    <li><strong>Referință comandă:</strong> {{ $reference }}</li>
                    <li><strong>Dealer:</strong> {{ $dealerName }}</li>
                </ul>
            </div>
            
            <p><strong>Următorii pași:</strong></p>
            <ol>
                <li>Descărcați și citiți contractul cu atenție</li>
                <li>Semnați contractul (fizic sau electronic)</li>
                <li>Încărcați contractul semnat pe platformă</li>
                <li>Primiți instrucțiunile de plată</li>
            </ol>
            
            <center>
                <a href="{{ $contractUrl }}" class="button">📥 Descărcați Contractul</a>
            </center>
            
            <div class="info-box">
                <h4>⚠️ Important:</h4>
                <p>Vă rugăm să semnați și încărcați contractul în termen de 48 de ore pentru a menține rezervarea vehiculului.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2026 AutoScout24 SafeTrade. Toate drepturile rezervate.</p>
            <p>Pentru întrebări, contactați-ne la support@autoscout24-safetrade.com</p>
        </div>
    </div>
</body>
</html>
