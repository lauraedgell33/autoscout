<?php

return [
    'title' => 'Fahrzeuge',
    'add_new' => 'Neues Fahrzeug hinzufügen',
    'edit' => 'Fahrzeug bearbeiten',
    'delete' => 'Fahrzeug löschen',
    'view_details' => 'Details anzeigen',
    
    'fields' => [
        'make' => 'Marke',
        'model' => 'Modell',
        'year' => 'Baujahr',
        'price' => 'Preis',
        'mileage' => 'Kilometerstand',
        'fuel_type' => 'Kraftstoffart',
        'transmission' => 'Getriebe',
        'color' => 'Farbe',
        'doors' => 'Türen',
        'seats' => 'Sitzplätze',
        'body_type' => 'Karosserietyp',
        'engine_size' => 'Hubraum',
        'power_hp' => 'Leistung (PS)',
        'vin' => 'FIN',
        'location' => 'Standort',
        'description' => 'Beschreibung',
        'status' => 'Status',
        'images' => 'Bilder',
    ],
    
    'fuel_types' => [
        'petrol' => 'Benzin',
        'diesel' => 'Diesel',
        'electric' => 'Elektro',
        'hybrid' => 'Hybrid',
        'lpg' => 'LPG',
        'cng' => 'Erdgas',
    ],
    
    'transmissions' => [
        'manual' => 'Manuell',
        'automatic' => 'Automatik',
        'semi_automatic' => 'Halbautomatik',
    ],
    
    'body_types' => [
        'sedan' => 'Limousine',
        'suv' => 'SUV',
        'hatchback' => 'Schrägheck',
        'coupe' => 'Coupé',
        'wagon' => 'Kombi',
        'van' => 'Van',
        'pickup' => 'Pickup',
        'convertible' => 'Cabrio',
    ],
    
    'statuses' => [
        'active' => 'Aktiv',
        'reserved' => 'Reserviert',
        'sold' => 'Verkauft',
        'inactive' => 'Inaktiv',
    ],
    
    'messages' => [
        'created' => 'Fahrzeug erfolgreich erstellt.',
        'updated' => 'Fahrzeug erfolgreich aktualisiert.',
        'deleted' => 'Fahrzeug erfolgreich gelöscht.',
        'not_found' => 'Fahrzeug nicht gefunden.',
        'featured' => 'Fahrzeug als hervorgehoben markiert.',
        'unfeatured' => 'Fahrzeug aus Hervorhebung entfernt.',
    ],
    
    'filters' => [
        'search' => 'Fahrzeuge suchen...',
        'price_min' => 'Mindestpreis',
        'price_max' => 'Höchstpreis',
        'year_min' => 'Baujahr ab',
        'year_max' => 'Baujahr bis',
        'mileage_max' => 'Max. Kilometerstand',
        'sort_by' => 'Sortieren nach',
    ],
    
    'sort_options' => [
        'newest' => 'Neueste zuerst',
        'oldest' => 'Älteste zuerst',
        'price_asc' => 'Preis: Niedrig bis Hoch',
        'price_desc' => 'Preis: Hoch bis Niedrig',
        'mileage_asc' => 'Kilometerstand: Niedrig bis Hoch',
        'mileage_desc' => 'Kilometerstand: Hoch bis Niedrig',
    ],
];
