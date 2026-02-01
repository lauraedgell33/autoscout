<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'AutoScout24 SafeTrade' }}</title>
    
    <style>
        /* AutoScout24 SafeTrade Brand Colors */
        :root {
            --as24-blue: #003281;
            --as24-orange: #FFA500;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #F3F4F6;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #F3F4F6;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #003281 0%, #0066CC 100%);
            padding: 32px 40px;
            text-align: center;
        }
        
        .email-logo-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }
        
        .email-logo-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 4px;
        }
        
        .email-body {
            padding: 40px;
        }
        
        .email-title {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px 0;
        }
        
        .email-subtitle {
            color: #4B5563;
            font-size: 16px;
            margin: 0 0 24px 0;
        }
        
        .email-content {
            color: #1F2937;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .email-content p {
            margin: 0 0 16px 0;
        }
        
        .button {
            display: inline-block;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 8px;
            margin: 24px 0;
        }
        
        .button-primary {
            background: linear-gradient(135deg, #003281 0%, #0066CC 100%);
            color: #ffffff !important;
        }
        
        .button-success {
            background-color: #10B981;
            color: #ffffff !important;
        }
        
        .button-warning {
            background-color: #F59E0B;
            color: #ffffff !important;
        }
        
        .info-box {
            background-color: #F9FAFB;
            border-left: 4px solid #003281;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 8px;
        }
        
        .email-footer {
            background-color: #F9FAFB;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        
        .footer-text {
            color: #6B7280;
            font-size: 13px;
            line-height: 1.6;
            margin: 8px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-header, .email-body, .email-footer {
                padding: 24px 20px !important;
            }
            .button {
                display: block;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h1 class="email-logo-text">🚗 AutoScout24</h1>
                <p class="email-logo-subtitle">SafeTrade Platform</p>
            </div>
            
            <div class="email-body">
                @yield('content')
            </div>
            
            <div class="email-footer">
                <p class="footer-text">
                    <strong>AutoScout24 SafeTrade</strong><br>
                    Secure Vehicle Trading Platform
                </p>
                <p class="footer-text" style="margin-top: 16px;">
                    © {{ date('Y') }} AutoScout24 SafeTrade. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
