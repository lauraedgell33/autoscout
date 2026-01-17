<?php

return [
    'title' => 'Vehicule',
    'add_new' => 'Adaugă Vehicul Nou',
    'edit' => 'Editează Vehicul',
    'delete' => 'Șterge Vehicul',
    'view_details' => 'Vezi Detalii',
    
    'fields' => [
        'make' => 'Marcă',
        'model' => 'Model',
        'year' => 'An',
        'price' => 'Preț',
        'mileage' => 'Kilometraj',
        'fuel_type' => 'Tip Combustibil',
        'transmission' => 'Transmisie',
        'color' => 'Culoare',
        'doors' => 'Uși',
        'seats' => 'Locuri',
        'body_type' => 'Tip Caroserie',
        'engine_size' => 'Capacitate Motor',
        'power_hp' => 'Putere (CP)',
        'vin' => 'VIN',
        'location' => 'Locație',
        'description' => 'Descriere',
        'status' => 'Status',
        'images' => 'Imagini',
    ],
    
    'fuel_types' => [
        'petrol' => 'Benzină',
        'diesel' => 'Diesel',
        'electric' => 'Electric',
        'hybrid' => 'Hibrid',
        'lpg' => 'GPL',
        'cng' => 'GNC',
    ],
    
    'transmissions' => [
        'manual' => 'Manuală',
        'automatic' => 'Automată',
        'semi_automatic' => 'Semi-Automată',
    ],
    
    'body_types' => [
        'sedan' => 'Sedan',
        'suv' => 'SUV',
        'hatchback' => 'Hatchback',
        'coupe' => 'Coupe',
        'wagon' => 'Break',
        'van' => 'Dubă',
        'pickup' => 'Pickup',
        'convertible' => 'Decapotabil',
    ],
    
    'statuses' => [
        'active' => 'Activ',
        'reserved' => 'Rezervat',
        'sold' => 'Vândut',
        'inactive' => 'Inactiv',
    ],
    
    'messages' => [
        'created' => 'Vehicul creat cu succes.',
        'updated' => 'Vehicul actualizat cu succes.',
        'deleted' => 'Vehicul șters cu succes.',
        'not_found' => 'Vehicul negăsit.',
        'featured' => 'Vehicul marcat ca recomandat.',
        'unfeatured' => 'Vehicul eliminat din recomandate.',
    ],
    
    'filters' => [
        'search' => 'Caută vehicule...',
        'price_min' => 'Preț Minim',
        'price_max' => 'Preț Maxim',
        'year_min' => 'An Minim',
        'year_max' => 'An Maxim',
        'mileage_max' => 'Kilometraj Maxim',
        'sort_by' => 'Sortează După',
    ],
    
    'sort_options' => [
        'newest' => 'Cele Mai Noi',
        'oldest' => 'Cele Mai Vechi',
        'price_asc' => 'Preț: Crescător',
        'price_desc' => 'Preț: Descrescător',
        'mileage_asc' => 'Kilometraj: Crescător',
        'mileage_desc' => 'Kilometraj: Descrescător',
    ],
];
