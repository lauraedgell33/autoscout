<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | AutoScout24 Integration
    |--------------------------------------------------------------------------
    |
    | AutoScout24 API configuration for dealer sync, vehicle import/export,
    | and payment guarantee verification.
    |
    */

    'autoscout24' => [
        'api_url' => env('AUTOSCOUT24_API_URL', 'https://api.autoscout24.com/v1'),
        'api_key' => env('AUTOSCOUT24_API_KEY'),
        'api_secret' => env('AUTOSCOUT24_API_SECRET'),
        'webhook_secret' => env('AUTOSCOUT24_WEBHOOK_SECRET'),
        'escrow_account_id' => env('AUTOSCOUT24_ESCROW_ACCOUNT_ID'),
        'guarantee_enabled' => env('AUTOSCOUT24_GUARANTEE_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Bank API Integration
    |--------------------------------------------------------------------------
    |
    | Configuration for bank statement reconciliation services.
    | Supported providers: Banking Circle, Railsbank, or direct bank API
    |
    */

    'bank' => [
        'provider' => env('BANK_API_PROVIDER', 'banking_circle'), // banking_circle, railsbank, or custom
        'api_url' => env('BANK_API_URL'),
        'api_key' => env('BANK_API_KEY'),
        'api_secret' => env('BANK_API_SECRET'),
        'auto_reconciliation_enabled' => env('BANK_AUTO_RECONCILIATION', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | OCR Service Configuration
    |--------------------------------------------------------------------------
    |
    | Payment proof OCR extraction service configuration.
    | Supported: aws (Textract), google (Vision AI), tesseract (local)
    |
    */

    'ocr' => [
        'provider' => env('OCR_PROVIDER', 'aws'), // aws, google, or tesseract
    ],

    'aws' => [
        'textract_key' => env('AWS_TEXTRACT_KEY', env('AWS_ACCESS_KEY_ID')),
        'textract_secret' => env('AWS_TEXTRACT_SECRET', env('AWS_SECRET_ACCESS_KEY')),
        'region' => env('AWS_DEFAULT_REGION', 'eu-central-1'),
    ],

    'google' => [
        'vision_api_key' => env('GOOGLE_VISION_API_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compliance & KYC Services
    |--------------------------------------------------------------------------
    |
    | PEP screening and sanctions list checking services.
    | Providers: worldcheck (Refinitiv), dowjones, complyadvantage
    |
    */

    'compliance' => [
        // PEP (Politically Exposed Person) screening
        'pep_provider' => env('COMPLIANCE_PEP_PROVIDER'), // worldcheck, dowjones, complyadvantage
        'pep_api_key' => env('COMPLIANCE_PEP_API_KEY'),
        'pep_api_url' => env('COMPLIANCE_PEP_API_URL'),

        // Sanctions screening (OFAC, EU, UN)
        'sanctions_provider' => env('COMPLIANCE_SANCTIONS_PROVIDER'), // ofac, dowjones, complyadvantage
        'sanctions_api_key' => env('COMPLIANCE_SANCTIONS_API_KEY'),
        'sanctions_api_url' => env('COMPLIANCE_SANCTIONS_API_URL'),

        // KYC verification providers
        'kyc_provider' => env('COMPLIANCE_KYC_PROVIDER'), // onfido, jumio, sumsub
        'kyc_api_key' => env('COMPLIANCE_KYC_API_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Law Enforcement & Stolen Vehicle Databases
    |--------------------------------------------------------------------------
    |
    | Integration with Interpol and national police databases for
    | stolen vehicle verification.
    |
    */

    'interpol' => [
        'api_key' => env('INTERPOL_API_KEY'),
        'api_url' => env('INTERPOL_API_URL', 'https://api.interpol.int/vehicles'),
    ],

    'police' => [
        'api_key' => env('POLICE_API_KEY'),
        'api_url' => env('POLICE_API_URL'),
        'auto_report_enabled' => env('POLICE_AUTO_REPORT', false),
        'report_url' => env('POLICE_REPORT_URL'),
    ],

];
