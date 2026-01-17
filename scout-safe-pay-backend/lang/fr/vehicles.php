<?php

return [
    'title' => 'Véhicules',
    'add_new' => 'Ajouter un Nouveau Véhicule',
    'edit' => 'Modifier le Véhicule',
    'delete' => 'Supprimer le Véhicule',
    'view_details' => 'Voir les Détails',
    
    'fields' => [
        'make' => 'Marque',
        'model' => 'Modèle',
        'year' => 'Année',
        'price' => 'Prix',
        'mileage' => 'Kilométrage',
        'fuel_type' => 'Type de Carburant',
        'transmission' => 'Transmission',
        'color' => 'Couleur',
        'doors' => 'Portes',
        'seats' => 'Places',
        'body_type' => 'Type de Carrosserie',
        'engine_size' => 'Cylindrée',
        'power_hp' => 'Puissance (CV)',
        'vin' => 'VIN',
        'location' => 'Localisation',
        'description' => 'Description',
        'status' => 'Statut',
        'images' => 'Images',
    ],
    
    'fuel_types' => [
        'petrol' => 'Essence',
        'diesel' => 'Diesel',
        'electric' => 'Électrique',
        'hybrid' => 'Hybride',
        'lpg' => 'GPL',
        'cng' => 'GNV',
    ],
    
    'transmissions' => [
        'manual' => 'Manuelle',
        'automatic' => 'Automatique',
        'semi_automatic' => 'Semi-Automatique',
    ],
    
    'body_types' => [
        'sedan' => 'Berline',
        'suv' => 'SUV',
        'hatchback' => 'Compacte',
        'coupe' => 'Coupé',
        'wagon' => 'Break',
        'van' => 'Utilitaire',
        'pickup' => 'Pick-up',
        'convertible' => 'Cabriolet',
    ],
    
    'statuses' => [
        'active' => 'Actif',
        'reserved' => 'Réservé',
        'sold' => 'Vendu',
        'inactive' => 'Inactif',
    ],
    
    'messages' => [
        'created' => 'Véhicule créé avec succès.',
        'updated' => 'Véhicule mis à jour avec succès.',
        'deleted' => 'Véhicule supprimé avec succès.',
        'not_found' => 'Véhicule non trouvé.',
        'featured' => 'Véhicule marqué comme en vedette.',
        'unfeatured' => 'Véhicule retiré des vedettes.',
    ],
    
    'filters' => [
        'search' => 'Rechercher des véhicules...',
        'price_min' => 'Prix Minimum',
        'price_max' => 'Prix Maximum',
        'year_min' => 'Année Minimum',
        'year_max' => 'Année Maximum',
        'mileage_max' => 'Kilométrage Maximum',
        'sort_by' => 'Trier Par',
    ],
    
    'sort_options' => [
        'newest' => 'Plus Récent d\'Abord',
        'oldest' => 'Plus Ancien d\'Abord',
        'price_asc' => 'Prix: Croissant',
        'price_desc' => 'Prix: Décroissant',
        'mileage_asc' => 'Kilométrage: Croissant',
        'mileage_desc' => 'Kilométrage: Décroissant',
    ],
];
