<?php

return [
    'title' => 'Vehículos',
    'add_new' => 'Añadir Nuevo Vehículo',
    'edit' => 'Editar Vehículo',
    'delete' => 'Eliminar Vehículo',
    'view_details' => 'Ver Detalles',
    
    'fields' => [
        'make' => 'Marca',
        'model' => 'Modelo',
        'year' => 'Año',
        'price' => 'Precio',
        'mileage' => 'Kilometraje',
        'fuel_type' => 'Tipo de Combustible',
        'transmission' => 'Transmisión',
        'color' => 'Color',
        'doors' => 'Puertas',
        'seats' => 'Asientos',
        'body_type' => 'Tipo de Carrocería',
        'engine_size' => 'Cilindrada',
        'power_hp' => 'Potencia (CV)',
        'vin' => 'VIN',
        'location' => 'Ubicación',
        'description' => 'Descripción',
        'status' => 'Estado',
        'images' => 'Imágenes',
    ],
    
    'fuel_types' => [
        'petrol' => 'Gasolina',
        'diesel' => 'Diésel',
        'electric' => 'Eléctrico',
        'hybrid' => 'Híbrido',
        'lpg' => 'GLP',
        'cng' => 'GNC',
    ],
    
    'transmissions' => [
        'manual' => 'Manual',
        'automatic' => 'Automático',
        'semi_automatic' => 'Semiautomático',
    ],
    
    'body_types' => [
        'sedan' => 'Sedán',
        'suv' => 'SUV',
        'hatchback' => 'Compacto',
        'coupe' => 'Cupé',
        'wagon' => 'Familiar',
        'van' => 'Furgoneta',
        'pickup' => 'Pickup',
        'convertible' => 'Descapotable',
    ],
    
    'statuses' => [
        'active' => 'Activo',
        'reserved' => 'Reservado',
        'sold' => 'Vendido',
        'inactive' => 'Inactivo',
    ],
    
    'messages' => [
        'created' => 'Vehículo creado exitosamente.',
        'updated' => 'Vehículo actualizado exitosamente.',
        'deleted' => 'Vehículo eliminado exitosamente.',
        'not_found' => 'Vehículo no encontrado.',
        'featured' => 'Vehículo marcado como destacado.',
        'unfeatured' => 'Vehículo removido de destacados.',
    ],
    
    'filters' => [
        'search' => 'Buscar vehículos...',
        'price_min' => 'Precio Mínimo',
        'price_max' => 'Precio Máximo',
        'year_min' => 'Año Mínimo',
        'year_max' => 'Año Máximo',
        'mileage_max' => 'Kilometraje Máximo',
        'sort_by' => 'Ordenar Por',
    ],
    
    'sort_options' => [
        'newest' => 'Más Nuevo Primero',
        'oldest' => 'Más Antiguo Primero',
        'price_asc' => 'Precio: Menor a Mayor',
        'price_desc' => 'Precio: Mayor a Menor',
        'mileage_asc' => 'Kilometraje: Menor a Mayor',
        'mileage_desc' => 'Kilometraje: Mayor a Menor',
    ],
];
