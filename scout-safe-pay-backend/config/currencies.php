<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supported Currencies
    |--------------------------------------------------------------------------
    |
    | All European currencies with exchange rates (base: EUR)
    | Exchange rates are approximate and should be updated periodically
    |
    */

    'default' => 'EUR',
    'base' => 'EUR',

    'currencies' => [
        // Eurozone
        'EUR' => [
            'name' => 'Euro',
            'symbol' => '€',
            'country' => 'Eurozone',
            'rate' => 1.00,
            'decimal_places' => 2,
            'symbol_position' => 'before',
        ],

        // Western Europe
        'GBP' => [
            'name' => 'British Pound',
            'symbol' => '£',
            'country' => 'United Kingdom',
            'rate' => 0.86,
            'decimal_places' => 2,
            'symbol_position' => 'before',
        ],
        'CHF' => [
            'name' => 'Swiss Franc',
            'symbol' => 'CHF',
            'country' => 'Switzerland',
            'rate' => 0.94,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],

        // Scandinavia
        'SEK' => [
            'name' => 'Swedish Krona',
            'symbol' => 'kr',
            'country' => 'Sweden',
            'rate' => 11.42,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'NOK' => [
            'name' => 'Norwegian Krone',
            'symbol' => 'kr',
            'country' => 'Norway',
            'rate' => 11.53,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'DKK' => [
            'name' => 'Danish Krone',
            'symbol' => 'kr',
            'country' => 'Denmark',
            'rate' => 7.46,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'ISK' => [
            'name' => 'Icelandic Króna',
            'symbol' => 'kr',
            'country' => 'Iceland',
            'rate' => 149.50,
            'decimal_places' => 0,
            'symbol_position' => 'after',
        ],

        // Central Europe
        'PLN' => [
            'name' => 'Polish Złoty',
            'symbol' => 'zł',
            'country' => 'Poland',
            'rate' => 4.32,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'CZK' => [
            'name' => 'Czech Koruna',
            'symbol' => 'Kč',
            'country' => 'Czech Republic',
            'rate' => 25.32,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'HUF' => [
            'name' => 'Hungarian Forint',
            'symbol' => 'Ft',
            'country' => 'Hungary',
            'rate' => 395.50,
            'decimal_places' => 0,
            'symbol_position' => 'after',
        ],

        // Eastern Europe
        'RON' => [
            'name' => 'Romanian Leu',
            'symbol' => 'lei',
            'country' => 'Romania',
            'rate' => 4.97,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'BGN' => [
            'name' => 'Bulgarian Lev',
            'symbol' => 'лв',
            'country' => 'Bulgaria',
            'rate' => 1.96,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'UAH' => [
            'name' => 'Ukrainian Hryvnia',
            'symbol' => '₴',
            'country' => 'Ukraine',
            'rate' => 40.85,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'MDL' => [
            'name' => 'Moldovan Leu',
            'symbol' => 'L',
            'country' => 'Moldova',
            'rate' => 19.25,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'BYN' => [
            'name' => 'Belarusian Ruble',
            'symbol' => 'Br',
            'country' => 'Belarus',
            'rate' => 3.48,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'RUB' => [
            'name' => 'Russian Ruble',
            'symbol' => '₽',
            'country' => 'Russia',
            'rate' => 98.50,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],

        // Balkans
        'RSD' => [
            'name' => 'Serbian Dinar',
            'symbol' => 'дин',
            'country' => 'Serbia',
            'rate' => 117.20,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'ALL' => [
            'name' => 'Albanian Lek',
            'symbol' => 'L',
            'country' => 'Albania',
            'rate' => 103.50,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'MKD' => [
            'name' => 'Macedonian Denar',
            'symbol' => 'ден',
            'country' => 'North Macedonia',
            'rate' => 61.50,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'BAM' => [
            'name' => 'Convertible Mark',
            'symbol' => 'KM',
            'country' => 'Bosnia and Herzegovina',
            'rate' => 1.96,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'HRK' => [
            'name' => 'Croatian Kuna',
            'symbol' => 'kn',
            'country' => 'Croatia (historical)',
            'rate' => 7.53,
            'decimal_places' => 2,
            'symbol_position' => 'after',
            'deprecated' => true, // Croatia now uses EUR
        ],

        // Caucasus
        'GEL' => [
            'name' => 'Georgian Lari',
            'symbol' => '₾',
            'country' => 'Georgia',
            'rate' => 2.92,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'AMD' => [
            'name' => 'Armenian Dram',
            'symbol' => '֏',
            'country' => 'Armenia',
            'rate' => 427.50,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],
        'AZN' => [
            'name' => 'Azerbaijani Manat',
            'symbol' => '₼',
            'country' => 'Azerbaijan',
            'rate' => 1.85,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],

        // Turkey
        'TRY' => [
            'name' => 'Turkish Lira',
            'symbol' => '₺',
            'country' => 'Turkey',
            'rate' => 32.50,
            'decimal_places' => 2,
            'symbol_position' => 'after',
        ],

        // International
        'USD' => [
            'name' => 'US Dollar',
            'symbol' => '$',
            'country' => 'United States',
            'rate' => 1.09,
            'decimal_places' => 2,
            'symbol_position' => 'before',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency Groups
    |--------------------------------------------------------------------------
    |
    | Group currencies by region for easier selection
    |
    */

    'groups' => [
        'eurozone' => ['EUR'],
        'western_europe' => ['GBP', 'CHF'],
        'scandinavia' => ['SEK', 'NOK', 'DKK', 'ISK'],
        'central_europe' => ['PLN', 'CZK', 'HUF'],
        'eastern_europe' => ['RON', 'BGN', 'UAH', 'MDL', 'BYN', 'RUB'],
        'balkans' => ['RSD', 'ALL', 'MKD', 'BAM', 'HRK'],
        'caucasus' => ['GEL', 'AMD', 'AZN'],
        'other' => ['TRY', 'USD'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Popular Currencies
    |--------------------------------------------------------------------------
    |
    | Most commonly used currencies, shown first in selectors
    |
    */

    'popular' => ['EUR', 'GBP', 'USD', 'CHF', 'PLN', 'RON', 'CZK', 'HUF', 'SEK', 'NOK', 'DKK'],
];
