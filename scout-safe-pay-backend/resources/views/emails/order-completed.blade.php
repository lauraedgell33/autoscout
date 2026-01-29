<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .success-box { background: #d4edda; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #ff6600; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Comanda Finalizată!</h1>
        </div>
        
        <div class="content">
            <h2>Bună {{ $buyerName }},</h2>
            
            <div class="success-box">
                <h1 style="color: #28a745; font-size: 48px; margin: 10px 0;">✅</h1>
                <h3>Comanda dumneavoastră a fost finalizată cu succes!</h3>
                <p><strong>{{ $vehicleTitle }}</strong></p>
            </div>
            
            <p>Vă mulțumim că ați ales AutoScout24 SafeTrade pentru achiziția vehiculului dumneavoastră!</p>
            
            <h3>🌟 Experiența dumneavoastră contează!</h3>
            <p>Ne-ar face plăcere să aflăm cum a fost experiența dumneavoastră cu <strong>{{ $dealerName }}</strong>.</p>
            
            <center>
                <a href="{{ $reviewUrl }}" class="button">⭐ Lasă un Review</a>
            </center>
            
            <h3>📱 Rămâneți conectat!</h3>
            <p>Urmăriți-ne pentru:</p>
            <ul>
                <li>Sfaturi de întreținere vehicul</li>
                <li>Oferte speciale pentru clienți</li>
                <li>Noutăți din industria auto</li>
            </ul>
            
            <p><strong>Vă dorim drum bun și kilometri mulți fără griji! 🚗💨</strong></p>
            
            <p style="margin-top: 30px;">Cu respect,<br>
            <strong>Echipa AutoScout24 SafeTrade</strong></p>
        </div>
        
        <div class="footer">
            <p>© 2026 AutoScout24 SafeTrade. Toate drepturile rezervate.</p>
            <p>Pentru asistență: support@autoscout24-safetrade.com</p>
        </div>
    </div>
</body>
</html>
