<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter([
        env('APP_ENV') === 'local' ? 'http://localhost:3000' : null,
        env('APP_ENV') === 'local' ? 'http://localhost:3001' : null,
        env('APP_ENV') === 'local' ? 'http://localhost:3002' : null,
        env('APP_ENV') === 'local' ? 'http://localhost:3005' : null,
        env('FRONTEND_URL'),
        'https://autoscout24safetrade.com',
        'https://www.autoscout24safetrade.com',
    ]),

    'allowed_origins_patterns' => env('APP_ENV') === 'production' ? [
        '/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/',
    ] : [
        '/\.vercel\.app$/',
        '/\.vapor-farm-.*\.com$/',
    ],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-TOKEN'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
