<?php

return [
    'title' => 'Vehicles',
    'add_new' => 'Add New Vehicle',
    'edit' => 'Edit Vehicle',
    'delete' => 'Delete Vehicle',
    'view_details' => 'View Details',
    
    'fields' => [
        'make' => 'Make',
        'model' => 'Model',
        'year' => 'Year',
        'price' => 'Price',
        'mileage' => 'Mileage',
        'fuel_type' => 'Fuel Type',
        'transmission' => 'Transmission',
        'color' => 'Color',
        'doors' => 'Doors',
        'seats' => 'Seats',
        'body_type' => 'Body Type',
        'engine_size' => 'Engine Size',
        'power_hp' => 'Power (HP)',
        'vin' => 'VIN',
        'location' => 'Location',
        'description' => 'Description',
        'status' => 'Status',
        'images' => 'Images',
    ],
    
    'fuel_types' => [
        'petrol' => 'Petrol',
        'diesel' => 'Diesel',
        'electric' => 'Electric',
        'hybrid' => 'Hybrid',
        'lpg' => 'LPG',
        'cng' => 'CNG',
    ],
    
    'transmissions' => [
        'manual' => 'Manual',
        'automatic' => 'Automatic',
        'semi_automatic' => 'Semi-Automatic',
    ],
    
    'body_types' => [
        'sedan' => 'Sedan',
        'suv' => 'SUV',
        'hatchback' => 'Hatchback',
        'coupe' => 'Coupe',
        'wagon' => 'Wagon',
        'van' => 'Van',
        'pickup' => 'Pickup',
        'convertible' => 'Convertible',
    ],
    
    'statuses' => [
        'active' => 'Active',
        'reserved' => 'Reserved',
        'sold' => 'Sold',
        'inactive' => 'Inactive',
    ],
    
    'messages' => [
        'created' => 'Vehicle created successfully.',
        'updated' => 'Vehicle updated successfully.',
        'deleted' => 'Vehicle deleted successfully.',
        'not_found' => 'Vehicle not found.',
        'featured' => 'Vehicle marked as featured.',
        'unfeatured' => 'Vehicle removed from featured.',
    ],
    
    'filters' => [
        'search' => 'Search vehicles...',
        'price_min' => 'Min Price',
        'price_max' => 'Max Price',
        'year_min' => 'Min Year',
        'year_max' => 'Max Year',
        'mileage_max' => 'Max Mileage',
        'sort_by' => 'Sort By',
    ],
    
    'sort_options' => [
        'newest' => 'Newest First',
        'oldest' => 'Oldest First',
        'price_asc' => 'Price: Low to High',
        'price_desc' => 'Price: High to Low',
        'mileage_asc' => 'Mileage: Low to High',
        'mileage_desc' => 'Mileage: High to Low',
    ],
];
