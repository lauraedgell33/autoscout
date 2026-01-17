<?php

return [
    'title' => 'Veicoli',
    'add_new' => 'Aggiungi Nuovo Veicolo',
    'edit' => 'Modifica Veicolo',
    'delete' => 'Elimina Veicolo',
    'view_details' => 'Vedi Dettagli',
    
    'fields' => [
        'make' => 'Marca',
        'model' => 'Modello',
        'year' => 'Anno',
        'price' => 'Prezzo',
        'mileage' => 'Chilometraggio',
        'fuel_type' => 'Tipo di Carburante',
        'transmission' => 'Trasmissione',
        'color' => 'Colore',
        'doors' => 'Porte',
        'seats' => 'Posti',
        'body_type' => 'Tipo di Carrozzeria',
        'engine_size' => 'Cilindrata',
        'power_hp' => 'Potenza (CV)',
        'vin' => 'VIN',
        'location' => 'Posizione',
        'description' => 'Descrizione',
        'status' => 'Stato',
        'images' => 'Immagini',
    ],
    
    'fuel_types' => [
        'petrol' => 'Benzina',
        'diesel' => 'Diesel',
        'electric' => 'Elettrico',
        'hybrid' => 'Ibrido',
        'lpg' => 'GPL',
        'cng' => 'Metano',
    ],
    
    'transmissions' => [
        'manual' => 'Manuale',
        'automatic' => 'Automatico',
        'semi_automatic' => 'Semi-Automatico',
    ],
    
    'body_types' => [
        'sedan' => 'Berlina',
        'suv' => 'SUV',
        'hatchback' => 'Berlina 3/5 Porte',
        'coupe' => 'Coupé',
        'wagon' => 'Station Wagon',
        'van' => 'Furgone',
        'pickup' => 'Pickup',
        'convertible' => 'Cabriolet',
    ],
    
    'statuses' => [
        'active' => 'Attivo',
        'reserved' => 'Riservato',
        'sold' => 'Venduto',
        'inactive' => 'Inattivo',
    ],
    
    'messages' => [
        'created' => 'Veicolo creato con successo.',
        'updated' => 'Veicolo aggiornato con successo.',
        'deleted' => 'Veicolo eliminato con successo.',
        'not_found' => 'Veicolo non trovato.',
        'featured' => 'Veicolo contrassegnato come in evidenza.',
        'unfeatured' => 'Veicolo rimosso dagli in evidenza.',
    ],
    
    'filters' => [
        'search' => 'Cerca veicoli...',
        'price_min' => 'Prezzo Minimo',
        'price_max' => 'Prezzo Massimo',
        'year_min' => 'Anno Minimo',
        'year_max' => 'Anno Massimo',
        'mileage_max' => 'Chilometraggio Massimo',
        'sort_by' => 'Ordina Per',
    ],
    
    'sort_options' => [
        'newest' => 'Più Recente Prima',
        'oldest' => 'Più Vecchio Prima',
        'price_asc' => 'Prezzo: Dal Più Basso',
        'price_desc' => 'Prezzo: Dal Più Alto',
        'mileage_asc' => 'Chilometraggio: Dal Più Basso',
        'mileage_desc' => 'Chilometraggio: Dal Più Alto',
    ],
];
