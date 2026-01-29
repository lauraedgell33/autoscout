<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .success-box { background: #d4edda; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #ff6600; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info-box { background: white; padding: 15px; border: 1px solid #ddd; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Plata Confirmată!</h1>
        </div>
        
        <div class="content">
            <h2>Bună {{ $buyerName }},</h2>
            
            <div class="success-box">
                <h3 style="margin-top: 0;">🎉 Plata dumneavoastră a fost confirmată cu succes!</h3>
                <p>Vă mulțumim pentru achiziționarea vehiculului <strong>{{ $vehicleTitle }}</strong>.</p>
            </div>
            
            <div class="info-box">
                <h3>📄 Factura dumneavoastră</h3>
                <p><strong>Număr factură:</strong> {{ $invoiceNumber }}</p>
                <p><strong>Sumă plătită:</strong> {{ $amount }} {{ $currency }}</p>
                <center>
                    <a href="{{ $invoiceUrl }}" class="button">📥 Descarcă Factura</a>
                </center>
            </div>
            
            <h3>📦 Următorii pași:</h3>
            <ol>
                <li>Vehiculul va fi pregătit pentru livrare</li>
                <li>Veți fi contactat de {{ $dealerName }} pentru programarea livrării</li>
                <li>Veți primi toate documentele necesare (carte de identitate vehicul, etc.)</li>
            </ol>
            
            <div class="info-box">
                <h4>📞 Contact Dealer:</h4>
                <p><strong>{{ $dealerName }}</strong><br>
                Telefon: {{ $dealerPhone }}</p>
            </div>
            
            <p>Pentru orice întrebări, nu ezitați să ne contactați!</p>
        </div>
        
        <div class="footer">
            <p>© 2026 AutoScout24 SafeTrade. Toate drepturile rezervate.</p>
            <p>Mulțumim pentru încredere!</p>
        </div>
    </div>
</body>
</html>
