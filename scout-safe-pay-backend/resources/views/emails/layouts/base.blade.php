<!DOCTYPE html>
<html lang="{{ $locale ?? 'en' }}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $title ?? 'AutoScout24 SafeTrade' }}</title>
    
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <style>
        table { border-collapse: collapse; }
        td { font-family: Arial, sans-serif; }
    </style>
    <![endif]-->
    
    <style>
        /**
         * AutoScout24 SafeTrade Email Design System
         * Based on frontend design-tokens.css
         */
        
        /* Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Design System Colors - Matching Frontend */
        :root {
            /* Primary - AutoScout24 Brand */
            --color-primary: #003281;
            --color-primary-dark: #002060;
            --color-primary-light: #0047AB;
            
            /* Accent - Orange */
            --color-accent: #FFA500;
            --color-accent-dark: #FF8C00;
            --color-accent-light: #FFB733;
            
            /* Semantic Colors */
            --color-success: #10B981;
            --color-success-light: #D1FAE5;
            --color-success-dark: #047857;
            
            --color-error: #EF4444;
            --color-error-light: #FEE2E2;
            --color-error-dark: #DC2626;
            
            --color-warning: #F59E0B;
            --color-warning-light: #FEF3C7;
            --color-warning-dark: #D97706;
            
            --color-info: #3B82F6;
            --color-info-light: #DBEAFE;
            --color-info-dark: #2563EB;
            
            /* Neutrals - Gray Scale */
            --color-gray-50: #F9FAFB;
            --color-gray-100: #F3F4F6;
            --color-gray-200: #E5E7EB;
            --color-gray-300: #D1D5DB;
            --color-gray-400: #9CA3AF;
            --color-gray-500: #6B7280;
            --color-gray-600: #4B5563;
            --color-gray-700: #374151;
            --color-gray-800: #1F2937;
            --color-gray-900: #111827;
            
            /* Spacing */
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --spacing-2xl: 48px;
            
            /* Border Radius */
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background-color: #F3F4F6;
            color: #111827;
            -webkit-font-smoothing: antialiased;
            line-height: 1.5;
        }
        
        /* Preheader - hidden preview text */
        .preheader {
            display: none !important;
            visibility: hidden;
            opacity: 0;
            color: transparent;
            height: 0;
            width: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            mso-hide: all;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #F3F4F6;
            padding: 48px 16px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #003281 0%, #0047AB 100%);
            padding: 32px 48px;
            text-align: center;
        }
        
        .email-logo-text {
            color: #ffffff;
            font-size: 26px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        
        .email-logo-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 6px;
            font-weight: 500;
        }
        
        .email-body {
            padding: 48px;
        }
        
        .email-title {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px 0;
            letter-spacing: -0.3px;
        }
        
        .email-subtitle {
            color: #4B5563;
            font-size: 16px;
            margin: 0 0 24px 0;
        }
        
        .email-content {
            color: #1F2937;
            font-size: 15px;
            line-height: 1.7;
        }
        
        .email-content p {
            margin: 0 0 16px 0;
        }
        
        /* Buttons - Using Design System */
        .button {
            display: inline-block;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 12px;
            margin: 24px 4px;
            text-align: center;
        }
        
        .button-primary {
            background: linear-gradient(135deg, #003281 0%, #0047AB 100%);
            color: #ffffff !important;
        }
        
        .button-accent {
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: #ffffff !important;
        }
        
        .button-success {
            background: linear-gradient(135deg, #047857 0%, #10B981 100%);
            color: #ffffff !important;
        }
        
        .button-warning {
            background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
            color: #ffffff !important;
        }
        
        .button-danger {
            background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
            color: #ffffff !important;
        }
        
        .button-outline {
            background: transparent;
            color: #003281 !important;
            border: 2px solid #003281;
        }
        
        /* Info Boxes - Using Design System */
        .info-box {
            background-color: #F9FAFB;
            border-left: 4px solid #003281;
            padding: 16px 24px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .alert-box {
            padding: 16px 24px;
            margin: 24px 0;
            border-radius: 8px;
        }
        
        .alert-success {
            background-color: #D1FAE5;
            border-left: 4px solid #10B981;
        }
        
        .alert-warning {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
        }
        
        .alert-danger {
            background-color: #FEE2E2;
            border-left: 4px solid #EF4444;
        }
        
        .alert-info {
            background-color: #DBEAFE;
            border-left: 4px solid #3B82F6;
        }
        
        /* Card Styles */
        .card {
            background-color: #F9FAFB;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            border: 1px solid #E5E7EB;
        }
        
        .card-highlight {
            background: linear-gradient(135deg, #DBEAFE 0%, #ffffff 100%);
            border: 2px solid #3B82F6;
        }
        
        /* Vehicle Card */
        .vehicle-card {
            background-color: #F9FAFB;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            border: 1px solid #E5E7EB;
        }
        
        .vehicle-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        /* Status Badges */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .badge-success {
            background-color: #10B981;
            color: #ffffff;
        }
        
        .badge-warning {
            background-color: #F59E0B;
            color: #ffffff;
        }
        
        .badge-danger {
            background-color: #EF4444;
            color: #ffffff;
        }
        
        .badge-info {
            background-color: #3B82F6;
            color: #ffffff;
        }
        
        .badge-primary {
            background-color: #003281;
            color: #ffffff;
        }
        
        /* Footer */
        .email-footer {
            background-color: #F9FAFB;
            padding: 32px 48px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        
        .footer-text {
            color: #6B7280;
            font-size: 13px;
            line-height: 1.6;
            margin: 8px 0;
        }
        
        .social-links {
            margin: 16px 0;
        }
        
        .social-link {
            display: inline-block;
            width: 36px;
            height: 36px;
            background-color: #E5E7EB;
            border-radius: 50%;
            margin: 0 6px;
            text-decoration: none;
            line-height: 36px;
            font-size: 16px;
        }
        
        .footer-links {
            margin: 16px 0;
        }
        
        .footer-links a {
            color: #003281;
            text-decoration: none;
            font-size: 12px;
            margin: 0 10px;
        }
        
        .unsubscribe-text {
            color: #9CA3AF;
            font-size: 11px;
            margin-top: 16px;
        }
        
        .unsubscribe-text a {
            color: #6B7280;
            text-decoration: underline;
        }
        
        /* Utility Classes */
        .text-primary { color: #003281 !important; }
        .text-accent { color: #FFA500 !important; }
        .text-success { color: #10B981 !important; }
        .text-warning { color: #F59E0B !important; }
        .text-danger { color: #EF4444 !important; }
        .text-muted { color: #6B7280 !important; }
        .text-center { text-align: center; }
        .text-bold { font-weight: 700; }
        .text-semibold { font-weight: 600; }
        
        .bg-primary { background-color: #003281 !important; }
        .bg-success { background-color: #D1FAE5 !important; }
        .bg-warning { background-color: #FEF3C7 !important; }
        .bg-danger { background-color: #FEE2E2 !important; }
        .bg-info { background-color: #DBEAFE !important; }
        
        /* Mobile Responsiveness */
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 16px 8px !important;
            }
            .email-header {
                padding: 24px 16px !important;
            }
            .email-body {
                padding: 24px 16px !important;
            }
            .email-footer {
                padding: 24px 16px !important;
            }
            .email-title {
                font-size: 22px !important;
            }
            .button {
                display: block !important;
                width: 100% !important;
                margin: 8px 0 !important;
                box-sizing: border-box;
            }
            .email-logo-text {
                font-size: 22px !important;
            }
            .info-box, .alert-box, .card {
                padding: 16px !important;
            }
            .vehicle-image {
                height: 140px !important;
            }
            .hide-mobile {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <!-- Preheader text (preview in email clients) -->
    <div class="preheader">
        {{ $preheader ?? '' }}
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    
    <div class="email-wrapper" role="article" aria-roledescription="email" aria-label="{{ $title ?? 'Email from AutoScout24 SafeTrade' }}">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <h1 class="email-logo-text">🚗 AutoScout24</h1>
                <p class="email-logo-subtitle">SafeTrade Platform</p>
            </div>
            
            <!-- Body -->
            <div class="email-body">
                @yield('content')
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <!-- Social Links -->
                <div class="social-links">
                    <a href="https://facebook.com/autoscout24" class="social-link" aria-label="Facebook">📘</a>
                    <a href="https://twitter.com/autoscout24" class="social-link" aria-label="Twitter">🐦</a>
                    <a href="https://linkedin.com/company/autoscout24" class="social-link" aria-label="LinkedIn">💼</a>
                    <a href="https://instagram.com/autoscout24" class="social-link" aria-label="Instagram">📷</a>
                </div>
                
                <p class="footer-text">
                    <strong>AutoScout24 SafeTrade</strong><br>
                    Europe's Trusted Secure Vehicle Trading Platform
                </p>
                
                <!-- Footer Links -->
                <div class="footer-links">
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/help">Help Center</a>
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/privacy">Privacy</a>
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/terms">Terms</a>
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/contact">Contact</a>
                </div>
                
                <p class="footer-text" style="margin-top: 16px;">
                    © {{ date('Y') }} AutoScout24 SafeTrade. All rights reserved.
                </p>
                
                <!-- Unsubscribe -->
                @if(isset($unsubscribeUrl))
                <p class="unsubscribe-text">
                    Don't want these emails? <a href="{{ $unsubscribeUrl }}">Unsubscribe</a> or 
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/profile/notifications">manage preferences</a>
                </p>
                @else
                <p class="unsubscribe-text">
                    <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/profile/notifications">Manage email preferences</a>
                </p>
                @endif
            </div>
        </div>
    </div>
</body>
</html>
