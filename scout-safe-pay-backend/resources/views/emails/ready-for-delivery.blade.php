<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .delivery-box { background: white; padding: 20px; border: 2px solid #007bff; margin: 20px 0; border-radius: 8px; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚚 Vehiculul Este Pregătit!</h1>
        </div>
        
        <div class="content">
            <h2>Bună {{ $buyerName }},</h2>
            
            <p>Vă informăm că vehiculul dumneavoastră <strong>{{ $vehicleTitle }}</strong> este pregătit pentru livrare!</p>
            
            <div class="delivery-box">
                <h3 style="margin-top: 0; color: #007bff;">📦 Detalii Livrare</h3>
                
                <div class="info-row">
                    <strong>Data livrării:</strong> {{ $deliveryDate }}
                </div>
                
                <div class="info-row">
                    <strong>Adresă livrare:</strong><br>
                    {{ $deliveryAddress }}
                </div>
                
                <div class="info-row">
                    <strong>Contact livrare:</strong> {{ $deliveryContact }}
                </div>
                
                <div class="info-row" style="border-bottom: none;">
                    <strong>Dealer:</strong><br>
                    {{ $dealerName }}<br>
                    Telefon: {{ $dealerPhone }}<br>
                    Adresă: {{ $dealerAddress }}
                </div>
            </div>
            
            <h3>📋 Pregătire pentru livrare:</h3>
            <p>Vă rugăm să aveți la dumneavoastră:</p>
            <ul>
                <li>✅ Act de identitate (CI/Pașaport)</li>
                <li>✅ Copie după contract semnat</li>
                <li>✅ Confirmare plată (dacă este solicitat)</li>
            </ul>
            
            <p><strong>Veți primi:</strong></p>
            <ul>
                <li>📄 Carte de identitate vehicul</li>
                <li>🔑 Cheile vehiculului (toate seturile)</li>
                <li>📋 Manual de utilizare</li>
                <li>🔧 Certificat service (dacă există)</li>
                <li>📦 Accesorii incluse</li>
            </ul>
            
            <p>Pentru orice modificări de program, vă rugăm contactați dealerul direct.</p>
        </div>
        
        <div class="footer">
            <p>© 2026 AutoScout24 SafeTrade. Toate drepturile rezervate.</p>
            <p>Vă așteptăm cu drag!</p>
        </div>
    </div>
</body>
</html>
