<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Vehicle Makes and Models by Category
    |--------------------------------------------------------------------------
    |
    | Comprehensive list of vehicle manufacturers and their models
    | organized by category (cars, trucks, motorcycles, etc.)
    |
    */

    'categories' => [
        'car' => 'Car',
        'motorcycle' => 'Motorcycle',
        'truck' => 'Truck',
        'van' => 'Van',
        'trailer' => 'Trailer',
        'caravan' => 'Caravan',
        'motorhome' => 'Motorhome',
        'construction' => 'Construction Machinery',
        'agricultural' => 'Agricultural Machinery',
        'forklift' => 'Forklift',
        'boat' => 'Boat',
        'atv' => 'ATV',
        'quad' => 'Quad',
    ],

    'makes' => [
        // ============================================
        // CARS
        // ============================================
        'car' => [
            'abarth' => [
                'name' => 'Abarth',
                'country' => 'Italy',
                'models' => ['124 Spider', '500', '595', '695', 'Punto', 'Grande Punto']
            ],
            'acura' => [
                'name' => 'Acura',
                'country' => 'Japan',
                'models' => ['ILX', 'Integra', 'MDX', 'NSX', 'RDX', 'RLX', 'RSX', 'TL', 'TLX', 'TSX', 'ZDX']
            ],
            'alfa-romeo' => [
                'name' => 'Alfa Romeo',
                'country' => 'Italy',
                'models' => ['147', '156', '159', '166', '4C', 'Brera', 'Giulia', 'Giulietta', 'GT', 'GTV', 'MiTo', 'Spider', 'Stelvio', 'Tonale']
            ],
            'aston-martin' => [
                'name' => 'Aston Martin',
                'country' => 'UK',
                'models' => ['DB7', 'DB9', 'DB11', 'DB12', 'DBS', 'DBS Superleggera', 'DBX', 'Rapide', 'V8 Vantage', 'V12 Vantage', 'Vanquish', 'Vantage']
            ],
            'audi' => [
                'name' => 'Audi',
                'country' => 'Germany',
                'models' => ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'e-tron GT', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'Q8 e-tron', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q3', 'RS Q8', 'S1', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8', 'TT', 'TTS', 'TT RS']
            ],
            'bentley' => [
                'name' => 'Bentley',
                'country' => 'UK',
                'models' => ['Arnage', 'Azure', 'Bentayga', 'Continental GT', 'Continental Flying Spur', 'Flying Spur', 'Mulsanne']
            ],
            'bmw' => [
                'name' => 'BMW',
                'country' => 'Germany',
                'models' => ['1 Series', '2 Series', '2 Series Active Tourer', '2 Series Gran Coupe', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'i3', 'i4', 'i5', 'i7', 'i8', 'iX', 'iX1', 'iX2', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z3', 'Z4']
            ],
            'bugatti' => [
                'name' => 'Bugatti',
                'country' => 'France',
                'models' => ['Chiron', 'Divo', 'EB110', 'Veyron']
            ],
            'cadillac' => [
                'name' => 'Cadillac',
                'country' => 'USA',
                'models' => ['ATS', 'BLS', 'CT4', 'CT5', 'CT6', 'CTS', 'Escalade', 'Lyriq', 'SRX', 'STS', 'XT4', 'XT5', 'XT6', 'XTS']
            ],
            'chevrolet' => [
                'name' => 'Chevrolet',
                'country' => 'USA',
                'models' => ['Aveo', 'Blazer', 'Bolt', 'Camaro', 'Captiva', 'Colorado', 'Corvette', 'Cruze', 'Equinox', 'Malibu', 'Orlando', 'Silverado', 'Spark', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax', 'Volt']
            ],
            'chrysler' => [
                'name' => 'Chrysler',
                'country' => 'USA',
                'models' => ['200', '300', '300C', 'Crossfire', 'Grand Voyager', 'Pacifica', 'PT Cruiser', 'Sebring', 'Town & Country', 'Voyager']
            ],
            'citroen' => [
                'name' => 'Citroën',
                'country' => 'France',
                'models' => ['Berlingo', 'C1', 'C2', 'C3', 'C3 Aircross', 'C3 Picasso', 'C4', 'C4 Cactus', 'C4 Picasso', 'C4 X', 'C5', 'C5 Aircross', 'C5 X', 'C6', 'C8', 'DS3', 'DS4', 'DS5', 'e-C4', 'Grand C4 Picasso', 'Jumpy', 'Nemo', 'SpaceTourer', 'Xsara', 'Xsara Picasso']
            ],
            'cupra' => [
                'name' => 'Cupra',
                'country' => 'Spain',
                'models' => ['Ateca', 'Born', 'Formentor', 'Leon', 'Tavascan', 'Terramar']
            ],
            'dacia' => [
                'name' => 'Dacia',
                'country' => 'Romania',
                'models' => ['Dokker', 'Duster', 'Jogger', 'Lodgy', 'Logan', 'Sandero', 'Sandero Stepway', 'Spring']
            ],
            'daewoo' => [
                'name' => 'Daewoo',
                'country' => 'South Korea',
                'models' => ['Espero', 'Kalos', 'Lacetti', 'Lanos', 'Leganza', 'Matiz', 'Nexia', 'Nubira', 'Tacuma']
            ],
            'dodge' => [
                'name' => 'Dodge',
                'country' => 'USA',
                'models' => ['Avenger', 'Caliber', 'Challenger', 'Charger', 'Dart', 'Durango', 'Hornet', 'Journey', 'Nitro', 'Ram', 'Viper']
            ],
            'ds' => [
                'name' => 'DS Automobiles',
                'country' => 'France',
                'models' => ['DS 3', 'DS 3 Crossback', 'DS 4', 'DS 5', 'DS 7', 'DS 9']
            ],
            'ferrari' => [
                'name' => 'Ferrari',
                'country' => 'Italy',
                'models' => ['296 GTB', '296 GTS', '360', '430', '458', '488', '599', '612', '812', 'California', 'Daytona SP3', 'F12', 'F8', 'FF', 'GTC4Lusso', 'LaFerrari', 'Portofino', 'Purosangue', 'Roma', 'SF90']
            ],
            'fiat' => [
                'name' => 'Fiat',
                'country' => 'Italy',
                'models' => ['124 Spider', '500', '500C', '500e', '500L', '500X', 'Bravo', 'Doblo', 'Ducato', 'Fiorino', 'Freemont', 'Grande Punto', 'Idea', 'Multipla', 'Panda', 'Punto', 'Punto Evo', 'Qubo', 'Sedici', 'Stilo', 'Talento', 'Tipo', 'Ulysse']
            ],
            'ford' => [
                'name' => 'Ford',
                'country' => 'USA',
                'models' => ['B-Max', 'Bronco', 'C-Max', 'EcoSport', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 'Fiesta', 'Focus', 'Fusion', 'Galaxy', 'Grand C-Max', 'GT', 'Ka', 'Ka+', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Puma', 'Ranger', 'S-Max', 'Taurus', 'Tourneo Connect', 'Tourneo Custom', 'Transit', 'Transit Connect', 'Transit Custom']
            ],
            'genesis' => [
                'name' => 'Genesis',
                'country' => 'South Korea',
                'models' => ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80']
            ],
            'honda' => [
                'name' => 'Honda',
                'country' => 'Japan',
                'models' => ['Accord', 'City', 'Civic', 'CR-V', 'CR-Z', 'e', 'e:Ny1', 'FR-V', 'HR-V', 'Insight', 'Jazz', 'Legend', 'NSX', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline', 'S2000', 'ZR-V']
            ],
            'hummer' => [
                'name' => 'Hummer',
                'country' => 'USA',
                'models' => ['H1', 'H2', 'H3', 'EV']
            ],
            'hyundai' => [
                'name' => 'Hyundai',
                'country' => 'South Korea',
                'models' => ['Accent', 'Bayon', 'Coupe', 'Elantra', 'Getz', 'i10', 'i20', 'i30', 'i40', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix20', 'ix35', 'ix55', 'Kona', 'Kona Electric', 'Matrix', 'Nexo', 'Palisade', 'Santa Fe', 'Sonata', 'Staria', 'Terracan', 'Tucson', 'Veloster']
            ],
            'infiniti' => [
                'name' => 'Infiniti',
                'country' => 'Japan',
                'models' => ['EX', 'FX', 'G', 'M', 'Q30', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX55', 'QX60', 'QX70', 'QX80']
            ],
            'jaguar' => [
                'name' => 'Jaguar',
                'country' => 'UK',
                'models' => ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'S-Type', 'X-Type', 'XE', 'XF', 'XJ', 'XK', 'XKR']
            ],
            'jeep' => [
                'name' => 'Jeep',
                'country' => 'USA',
                'models' => ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Grand Cherokee L', 'Liberty', 'Patriot', 'Renegade', 'Wrangler']
            ],
            'kia' => [
                'name' => 'Kia',
                'country' => 'South Korea',
                'models' => ['Carens', 'Carnival', 'Ceed', 'Cerato', 'e-Niro', 'e-Soul', 'EV6', 'EV9', 'Magentis', 'Niro', 'Optima', 'Picanto', 'Pro Ceed', 'Rio', 'Sedona', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic', 'Venga', 'XCeed']
            ],
            'lamborghini' => [
                'name' => 'Lamborghini',
                'country' => 'Italy',
                'models' => ['Aventador', 'Countach', 'Diablo', 'Gallardo', 'Huracan', 'Murcielago', 'Revuelto', 'Urus']
            ],
            'lancia' => [
                'name' => 'Lancia',
                'country' => 'Italy',
                'models' => ['Delta', 'Musa', 'Phedra', 'Thesis', 'Voyager', 'Ypsilon']
            ],
            'land-rover' => [
                'name' => 'Land Rover',
                'country' => 'UK',
                'models' => ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar']
            ],
            'lexus' => [
                'name' => 'Lexus',
                'country' => 'Japan',
                'models' => ['CT', 'ES', 'GS', 'GX', 'IS', 'LC', 'LFA', 'LS', 'LX', 'NX', 'RC', 'RX', 'RZ', 'SC', 'UX']
            ],
            'lincoln' => [
                'name' => 'Lincoln',
                'country' => 'USA',
                'models' => ['Aviator', 'Continental', 'Corsair', 'MKC', 'MKS', 'MKT', 'MKX', 'MKZ', 'Nautilus', 'Navigator', 'Town Car']
            ],
            'lotus' => [
                'name' => 'Lotus',
                'country' => 'UK',
                'models' => ['Eletre', 'Elise', 'Emira', 'Europa', 'Evija', 'Evora', 'Exige']
            ],
            'maserati' => [
                'name' => 'Maserati',
                'country' => 'Italy',
                'models' => ['Ghibli', 'GranCabrio', 'GranTurismo', 'Grecale', 'Levante', 'MC20', 'Quattroporte']
            ],
            'mazda' => [
                'name' => 'Mazda',
                'country' => 'Japan',
                'models' => ['2', '3', '5', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-7', 'CX-9', 'CX-90', 'MX-30', 'MX-5', 'RX-7', 'RX-8']
            ],
            'mclaren' => [
                'name' => 'McLaren',
                'country' => 'UK',
                'models' => ['540C', '570GT', '570S', '600LT', '620R', '650S', '675LT', '720S', '750S', '765LT', 'Artura', 'Elva', 'GT', 'P1', 'Senna', 'Speedtail']
            ],
            'mercedes-benz' => [
                'name' => 'Mercedes-Benz',
                'country' => 'Germany',
                'models' => ['A-Class', 'AMG GT', 'B-Class', 'C-Class', 'CL', 'CLA', 'CLC', 'CLK', 'CLS', 'E-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV', 'G-Class', 'GL', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'M-Class', 'Maybach', 'R-Class', 'S-Class', 'SL', 'SLC', 'SLK', 'SLR', 'SLS', 'Sprinter', 'V-Class', 'Vaneo', 'Viano', 'Vito', 'X-Class']
            ],
            'mg' => [
                'name' => 'MG',
                'country' => 'UK/China',
                'models' => ['3', '4', '5', 'Cyberster', 'EHS', 'HS', 'Marvel R', 'TF', 'ZS', 'ZS EV']
            ],
            'mini' => [
                'name' => 'MINI',
                'country' => 'UK',
                'models' => ['Clubman', 'Convertible', 'Countryman', 'Coupe', 'Hatch', 'John Cooper Works', 'One', 'Paceman', 'Roadster']
            ],
            'mitsubishi' => [
                'name' => 'Mitsubishi',
                'country' => 'Japan',
                'models' => ['ASX', 'Colt', 'Eclipse', 'Eclipse Cross', 'Galant', 'Grandis', 'i-MiEV', 'L200', 'Lancer', 'Mirage', 'Outlander', 'Pajero', 'Pajero Sport', 'Space Star']
            ],
            'nissan' => [
                'name' => 'Nissan',
                'country' => 'Japan',
                'models' => ['350Z', '370Z', 'Almera', 'Ariya', 'Cube', 'e-NV200', 'GT-R', 'Juke', 'Leaf', 'Micra', 'Murano', 'Navara', 'Note', 'NV200', 'NV300', 'Pathfinder', 'Patrol', 'Primera', 'Pulsar', 'Qashqai', 'Rogue', 'Sentra', 'Terrano', 'Tiida', 'Titan', 'X-Trail', 'Z']
            ],
            'opel' => [
                'name' => 'Opel',
                'country' => 'Germany',
                'models' => ['Adam', 'Agila', 'Ampera', 'Antara', 'Astra', 'Cascada', 'Combo', 'Corsa', 'Corsa-e', 'Crossland', 'Grandland', 'Insignia', 'Karl', 'Meriva', 'Mokka', 'Mokka-e', 'Movano', 'Signum', 'Vectra', 'Vivaro', 'Zafira']
            ],
            'peugeot' => [
                'name' => 'Peugeot',
                'country' => 'France',
                'models' => ['107', '108', '2008', '206', '207', '208', '3008', '301', '307', '308', '4007', '4008', '407', '408', '5008', '508', '607', '807', 'Bipper', 'Boxer', 'e-2008', 'e-208', 'e-308', 'e-Rifter', 'Expert', 'iOn', 'Partner', 'RCZ', 'Rifter', 'Traveller']
            ],
            'polestar' => [
                'name' => 'Polestar',
                'country' => 'Sweden',
                'models' => ['1', '2', '3', '4']
            ],
            'porsche' => [
                'name' => 'Porsche',
                'country' => 'Germany',
                'models' => ['718 Boxster', '718 Cayman', '911', '918 Spyder', '944', '968', 'Boxster', 'Carrera GT', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan']
            ],
            'renault' => [
                'name' => 'Renault',
                'country' => 'France',
                'models' => ['Arkana', 'Austral', 'Captur', 'Clio', 'Espace', 'Express', 'Fluence', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Latitude', 'Master', 'Megane', 'Megane E-Tech', 'Modus', 'Scenic', 'Talisman', 'Trafic', 'Twingo', 'Twizy', 'Vel Satis', 'Wind', 'Zoe']
            ],
            'rolls-royce' => [
                'name' => 'Rolls-Royce',
                'country' => 'UK',
                'models' => ['Cullinan', 'Dawn', 'Ghost', 'Phantom', 'Silver Seraph', 'Spectre', 'Wraith']
            ],
            'saab' => [
                'name' => 'Saab',
                'country' => 'Sweden',
                'models' => ['9-3', '9-5', '9-7X', '900', '9000']
            ],
            'seat' => [
                'name' => 'SEAT',
                'country' => 'Spain',
                'models' => ['Alhambra', 'Altea', 'Arona', 'Ateca', 'Cordoba', 'Exeo', 'Ibiza', 'Leon', 'Mii', 'Tarraco', 'Toledo']
            ],
            'skoda' => [
                'name' => 'Škoda',
                'country' => 'Czech Republic',
                'models' => ['Citigo', 'Enyaq', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Roomster', 'Scala', 'Superb', 'Yeti']
            ],
            'smart' => [
                'name' => 'Smart',
                'country' => 'Germany',
                'models' => ['#1', '#3', 'Forfour', 'Fortwo', 'Roadster']
            ],
            'ssangyong' => [
                'name' => 'SsangYong',
                'country' => 'South Korea',
                'models' => ['Actyon', 'Korando', 'Kyron', 'Musso', 'Rexton', 'Rodius', 'Tivoli', 'Torres', 'XLV']
            ],
            'subaru' => [
                'name' => 'Subaru',
                'country' => 'Japan',
                'models' => ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Levorg', 'Outback', 'Solterra', 'Tribeca', 'WRX', 'XV']
            ],
            'suzuki' => [
                'name' => 'Suzuki',
                'country' => 'Japan',
                'models' => ['Across', 'Alto', 'Baleno', 'Celerio', 'Grand Vitara', 'Ignis', 'Jimny', 'Kizashi', 'Liana', 'S-Cross', 'Splash', 'Swift', 'SX4', 'Vitara', 'Wagon R+']
            ],
            'tesla' => [
                'name' => 'Tesla',
                'country' => 'USA',
                'models' => ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster']
            ],
            'toyota' => [
                'name' => 'Toyota',
                'country' => 'Japan',
                'models' => ['4Runner', 'Avalon', 'Avensis', 'Aygo', 'Aygo X', 'bZ4X', 'C-HR', 'Camry', 'Celica', 'Corolla', 'Corolla Cross', 'Crown', 'FJ Cruiser', 'GR Supra', 'GR86', 'Highlander', 'Hilux', 'iQ', 'Land Cruiser', 'Mirai', 'MR2', 'Prius', 'ProAce', 'RAV4', 'Sequoia', 'Sienna', 'Supra', 'Tacoma', 'Tundra', 'Urban Cruiser', 'Verso', 'Yaris', 'Yaris Cross']
            ],
            'volkswagen' => [
                'name' => 'Volkswagen',
                'country' => 'Germany',
                'models' => ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'California', 'Caravelle', 'CC', 'Crafter', 'Eos', 'Fox', 'Golf', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'ID. Buzz', 'Jetta', 'Lupo', 'Multivan', 'New Beetle', 'Passat', 'Phaeton', 'Polo', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Taigo', 'Tiguan', 'Tiguan Allspace', 'Touareg', 'Touran', 'Transporter', 'Up!']
            ],
            'volvo' => [
                'name' => 'Volvo',
                'country' => 'Sweden',
                'models' => ['C30', 'C40', 'C70', 'EX30', 'EX90', 'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90']
            ],
        ],

        // ============================================
        // MOTORCYCLES
        // ============================================
        'motorcycle' => [
            'aprilia' => [
                'name' => 'Aprilia',
                'country' => 'Italy',
                'models' => ['Dorsoduro', 'RS 125', 'RS 660', 'RS4', 'RSV4', 'Shiver', 'SR GT', 'SX 125', 'Tuareg 660', 'Tuono']
            ],
            'benelli' => [
                'name' => 'Benelli',
                'country' => 'Italy',
                'models' => ['302S', '502C', '752S', 'BN 125', 'Imperiale 400', 'Leoncino', 'TRK 502']
            ],
            'bmw-moto' => [
                'name' => 'BMW Motorrad',
                'country' => 'Germany',
                'models' => ['C 400', 'C 650', 'CE 04', 'F 750 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'G 310', 'K 1600', 'M 1000', 'R 1250 GS', 'R 1250 R', 'R 1250 RS', 'R 1250 RT', 'R 18', 'R NineT', 'S 1000 R', 'S 1000 RR', 'S 1000 XR']
            ],
            'ducati' => [
                'name' => 'Ducati',
                'country' => 'Italy',
                'models' => ['Diavel', 'Hypermotard', 'Monster', 'Multistrada', 'Panigale V2', 'Panigale V4', 'Scrambler', 'Streetfighter V2', 'Streetfighter V4', 'SuperSport', 'XDiavel']
            ],
            'harley-davidson' => [
                'name' => 'Harley-Davidson',
                'country' => 'USA',
                'models' => ['Breakout', 'CVO', 'Electra Glide', 'Fat Bob', 'Fat Boy', 'Heritage Classic', 'Iron 883', 'LiveWire', 'Low Rider', 'Nightster', 'Pan America', 'Road Glide', 'Road King', 'Roadster', 'Softail', 'Sport Glide', 'Sportster', 'Street', 'Street Bob', 'Street Glide']
            ],
            'honda-moto' => [
                'name' => 'Honda Motorcycles',
                'country' => 'Japan',
                'models' => ['Africa Twin', 'CB 125', 'CB 300', 'CB 500', 'CB 650', 'CB 1000', 'CBF', 'CBR 125', 'CBR 300', 'CBR 500', 'CBR 600', 'CBR 650', 'CBR 1000 RR', 'CMX', 'CRF', 'Forza', 'GL 1800', 'Goldwing', 'Hornet', 'MSX 125', 'NC 750', 'NT 1100', 'PCX', 'Rebel', 'SH', 'Transalp', 'VFR', 'X-ADV']
            ],
            'husqvarna' => [
                'name' => 'Husqvarna',
                'country' => 'Sweden',
                'models' => ['401 Svartpilen', '401 Vitpilen', '701 Enduro', '701 Supermoto', 'Norden 901']
            ],
            'indian' => [
                'name' => 'Indian Motorcycle',
                'country' => 'USA',
                'models' => ['Challenger', 'Chief', 'Chieftain', 'FTR', 'Pursuit', 'Roadmaster', 'Scout', 'Springfield']
            ],
            'kawasaki' => [
                'name' => 'Kawasaki',
                'country' => 'Japan',
                'models' => ['ER-6', 'H2', 'KLR', 'KX', 'Ninja 125', 'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja 1000', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Versys 1000', 'Vulcan', 'W800', 'Z125', 'Z400', 'Z650', 'Z900', 'Z1000', 'ZZR']
            ],
            'ktm' => [
                'name' => 'KTM',
                'country' => 'Austria',
                'models' => ['125 Duke', '200 Duke', '390 Duke', '690', '790 Duke', '890 Duke', '1290 Super Duke', '1290 Super Adventure', 'EXC', 'RC 125', 'RC 390', 'SX']
            ],
            'moto-guzzi' => [
                'name' => 'Moto Guzzi',
                'country' => 'Italy',
                'models' => ['Audace', 'California', 'Eldorado', 'Griso', 'MGX-21', 'Stelvio', 'V7', 'V85 TT', 'V100']
            ],
            'mv-agusta' => [
                'name' => 'MV Agusta',
                'country' => 'Italy',
                'models' => ['Brutale', 'Dragster', 'F3', 'Rush', 'Superveloce', 'Turismo Veloce']
            ],
            'royal-enfield' => [
                'name' => 'Royal Enfield',
                'country' => 'India',
                'models' => ['Classic', 'Continental GT', 'Himalayan', 'Hunter', 'Interceptor', 'Meteor', 'Super Meteor']
            ],
            'suzuki-moto' => [
                'name' => 'Suzuki Motorcycles',
                'country' => 'Japan',
                'models' => ['Burgman', 'DR-Z', 'GSX-R 600', 'GSX-R 750', 'GSX-R 1000', 'GSX-S 750', 'GSX-S 1000', 'Hayabusa', 'Katana', 'SV 650', 'V-Strom 650', 'V-Strom 1050']
            ],
            'triumph' => [
                'name' => 'Triumph',
                'country' => 'UK',
                'models' => ['Bobber', 'Bonneville', 'Daytona', 'Rocket 3', 'Scrambler', 'Speed Triple', 'Speed Twin', 'Street Triple', 'Thruxton', 'Tiger 660', 'Tiger 850', 'Tiger 900', 'Tiger 1200', 'Trident']
            ],
            'yamaha-moto' => [
                'name' => 'Yamaha Motorcycles',
                'country' => 'Japan',
                'models' => ['FJR 1300', 'FZ', 'MT-03', 'MT-07', 'MT-09', 'MT-10', 'NMAX', 'R1', 'R125', 'R3', 'R6', 'R7', 'Tenere 700', 'TMAX', 'Tracer 7', 'Tracer 9', 'XJ6', 'XMax', 'XSR', 'YZF']
            ],
        ],

        // ============================================
        // TRUCKS
        // ============================================
        'truck' => [
            'daf' => [
                'name' => 'DAF',
                'country' => 'Netherlands',
                'models' => ['CF', 'LF', 'XD', 'XF', 'XG', 'XG+']
            ],
            'iveco' => [
                'name' => 'Iveco',
                'country' => 'Italy',
                'models' => ['Daily', 'Eurocargo', 'S-Way', 'Stralis', 'T-Way', 'Trakker', 'X-Way']
            ],
            'man' => [
                'name' => 'MAN',
                'country' => 'Germany',
                'models' => ['TGE', 'TGL', 'TGM', 'TGS', 'TGX']
            ],
            'mercedes-truck' => [
                'name' => 'Mercedes-Benz Trucks',
                'country' => 'Germany',
                'models' => ['Actros', 'Antos', 'Arocs', 'Atego', 'Axor', 'eActros', 'Econic', 'Sprinter', 'Unimog']
            ],
            'renault-trucks' => [
                'name' => 'Renault Trucks',
                'country' => 'France',
                'models' => ['C', 'D', 'D Wide', 'K', 'Master', 'T', 'T High']
            ],
            'scania' => [
                'name' => 'Scania',
                'country' => 'Sweden',
                'models' => ['G Series', 'L Series', 'P Series', 'R Series', 'S Series']
            ],
            'volvo-trucks' => [
                'name' => 'Volvo Trucks',
                'country' => 'Sweden',
                'models' => ['FE', 'FH', 'FH16', 'FL', 'FM', 'FMX', 'VNL', 'VNR']
            ],
        ],

        // ============================================
        // VANS
        // ============================================
        'van' => [
            'citroen-van' => [
                'name' => 'Citroën',
                'country' => 'France',
                'models' => ['Berlingo', 'Dispatch', 'Jumper', 'Jumpy', 'Nemo', 'SpaceTourer']
            ],
            'fiat-van' => [
                'name' => 'Fiat Professional',
                'country' => 'Italy',
                'models' => ['Doblo', 'Ducato', 'Fiorino', 'Scudo', 'Talento']
            ],
            'ford-van' => [
                'name' => 'Ford',
                'country' => 'USA',
                'models' => ['Transit', 'Transit Connect', 'Transit Custom', 'Transit Courier', 'Tourneo Connect', 'Tourneo Custom']
            ],
            'iveco-van' => [
                'name' => 'Iveco',
                'country' => 'Italy',
                'models' => ['Daily']
            ],
            'mercedes-van' => [
                'name' => 'Mercedes-Benz',
                'country' => 'Germany',
                'models' => ['Citan', 'eSprinter', 'eVito', 'Sprinter', 'V-Class', 'Vito']
            ],
            'opel-van' => [
                'name' => 'Opel',
                'country' => 'Germany',
                'models' => ['Combo', 'Movano', 'Vivaro']
            ],
            'peugeot-van' => [
                'name' => 'Peugeot',
                'country' => 'France',
                'models' => ['Boxer', 'Expert', 'Partner', 'Rifter']
            ],
            'renault-van' => [
                'name' => 'Renault',
                'country' => 'France',
                'models' => ['Express', 'Kangoo', 'Master', 'Trafic']
            ],
            'volkswagen-van' => [
                'name' => 'Volkswagen',
                'country' => 'Germany',
                'models' => ['Caddy', 'California', 'Caravelle', 'Crafter', 'ID. Buzz', 'Multivan', 'Transporter']
            ],
        ],

        // ============================================
        // TRAILERS
        // ============================================
        'trailer' => [
            'brenderup' => [
                'name' => 'Brenderup',
                'country' => 'Denmark',
                'models' => ['Box Trailer', 'Car Transporter', 'Flatbed', 'Tilt Trailer']
            ],
            'humbaur' => [
                'name' => 'Humbaur',
                'country' => 'Germany',
                'models' => ['Box Trailer', 'Car Transporter', 'Cattle Trailer', 'Flatbed', 'Horse Trailer', 'Motorcycle Trailer']
            ],
            'ifor-williams' => [
                'name' => 'Ifor Williams',
                'country' => 'UK',
                'models' => ['Box Van', 'Car Transporter', 'Flatbed', 'Horse Trailer', 'Livestock', 'Tipper']
            ],
            'krone' => [
                'name' => 'Krone',
                'country' => 'Germany',
                'models' => ['Box', 'Curtainsider', 'Flatbed', 'Mega Liner', 'Profi Liner', 'Refrigerated']
            ],
            'schmitz-cargobull' => [
                'name' => 'Schmitz Cargobull',
                'country' => 'Germany',
                'models' => ['Box', 'Curtainsider', 'Flatbed', 'Mega', 'Reefer', 'Tipper']
            ],
        ],

        // ============================================
        // CARAVANS
        // ============================================
        'caravan' => [
            'adria' => [
                'name' => 'Adria',
                'country' => 'Slovenia',
                'models' => ['Action', 'Adora', 'Alpina', 'Altea', 'Aviva']
            ],
            'bailey' => [
                'name' => 'Bailey',
                'country' => 'UK',
                'models' => ['Alicanto', 'Discovery', 'Phoenix', 'Pegasus', 'Pursuit']
            ],
            'burstner' => [
                'name' => 'Bürstner',
                'country' => 'Germany',
                'models' => ['Averso', 'Premio', 'Premio Life']
            ],
            'dethleffs' => [
                'name' => 'Dethleffs',
                'country' => 'Germany',
                'models' => ['Beduin', 'C\'go', 'Camper', 'Nomad']
            ],
            'fendt' => [
                'name' => 'Fendt',
                'country' => 'Germany',
                'models' => ['Bianco', 'Diamant', 'Opal', 'Saphir', 'Tendenza']
            ],
            'hobby' => [
                'name' => 'Hobby',
                'country' => 'Germany',
                'models' => ['De Luxe', 'Excellent', 'Maxia', 'OnTour', 'Prestige']
            ],
            'knaus' => [
                'name' => 'Knaus',
                'country' => 'Germany',
                'models' => ['Deseo', 'Sport', 'Südwind', 'Travelino']
            ],
            'sprite' => [
                'name' => 'Sprite',
                'country' => 'UK',
                'models' => ['Alpine', 'Cruzer', 'Quattro', 'Super Quattro']
            ],
            'swift' => [
                'name' => 'Swift',
                'country' => 'UK',
                'models' => ['Challenger', 'Conqueror', 'Elegance', 'Sprite']
            ],
            'tabbert' => [
                'name' => 'Tabbert',
                'country' => 'Germany',
                'models' => ['Da Vinci', 'Pep', 'Puccini', 'Rossini']
            ],
        ],

        // ============================================
        // MOTORHOMES
        // ============================================
        'motorhome' => [
            'adria-mh' => [
                'name' => 'Adria',
                'country' => 'Slovenia',
                'models' => ['Compact', 'Coral', 'Matrix', 'Sonic', 'Twin']
            ],
            'autotrail' => [
                'name' => 'Auto-Trail',
                'country' => 'UK',
                'models' => ['Apache', 'Delaware', 'F-Line', 'Frontier', 'Tribute']
            ],
            'burstner-mh' => [
                'name' => 'Bürstner',
                'country' => 'Germany',
                'models' => ['Campeo', 'Elegance', 'Ixeo', 'Lyseo', 'Nexxo', 'Travel Van']
            ],
            'carthago' => [
                'name' => 'Carthago',
                'country' => 'Germany',
                'models' => ['C-Compactline', 'C-Tourer', 'Chic C-Line', 'Chic E-Line', 'Liner']
            ],
            'chausson' => [
                'name' => 'Chausson',
                'country' => 'France',
                'models' => ['Flash', 'Titanium', 'Twist', 'Welcome']
            ],
            'dethleffs-mh' => [
                'name' => 'Dethleffs',
                'country' => 'Germany',
                'models' => ['Advantage', 'Esprit', 'Globebus', 'Pulse', 'Trend']
            ],
            'hymer' => [
                'name' => 'Hymer',
                'country' => 'Germany',
                'models' => ['B-Klasse', 'Exsis', 'ML', 'T-Klasse', 'Venture']
            ],
            'knaus-mh' => [
                'name' => 'Knaus',
                'country' => 'Germany',
                'models' => ['BoxStar', 'L!ve', 'Sky', 'Sun', 'Van']
            ],
            'laika' => [
                'name' => 'Laika',
                'country' => 'Italy',
                'models' => ['Ecovip', 'Kosmo', 'Kreos']
            ],
            'pilote' => [
                'name' => 'Pilote',
                'country' => 'France',
                'models' => ['Galaxy', 'Pacific', 'Reference', 'Van']
            ],
            'rapido' => [
                'name' => 'Rapido',
                'country' => 'France',
                'models' => ['Distinction', 'M', 'V']
            ],
        ],

        // ============================================
        // CONSTRUCTION MACHINERY
        // ============================================
        'construction' => [
            'bobcat' => [
                'name' => 'Bobcat',
                'country' => 'USA',
                'models' => ['Compact Excavator', 'Compact Track Loader', 'Mini Excavator', 'Skid-Steer Loader', 'Telehandler']
            ],
            'case' => [
                'name' => 'Case',
                'country' => 'USA',
                'models' => ['Backhoe Loader', 'Crawler Excavator', 'Mini Excavator', 'Skid Steer', 'Wheel Loader']
            ],
            'caterpillar' => [
                'name' => 'Caterpillar',
                'country' => 'USA',
                'models' => ['Backhoe Loader', 'Bulldozer', 'Excavator', 'Mini Excavator', 'Motor Grader', 'Skid Steer', 'Telehandler', 'Wheel Loader']
            ],
            'hitachi' => [
                'name' => 'Hitachi',
                'country' => 'Japan',
                'models' => ['Crawler Excavator', 'Mini Excavator', 'Wheel Excavator', 'Wheel Loader']
            ],
            'jcb' => [
                'name' => 'JCB',
                'country' => 'UK',
                'models' => ['Backhoe Loader', 'Compact Excavator', 'Loadall', 'Mini Excavator', 'Skid Steer', 'Wheel Loader']
            ],
            'komatsu' => [
                'name' => 'Komatsu',
                'country' => 'Japan',
                'models' => ['Bulldozer', 'Crawler Excavator', 'Mini Excavator', 'Motor Grader', 'Wheel Loader']
            ],
            'liebherr' => [
                'name' => 'Liebherr',
                'country' => 'Germany',
                'models' => ['Crane', 'Crawler Excavator', 'Mini Excavator', 'Tower Crane', 'Wheel Excavator', 'Wheel Loader']
            ],
            'volvo-ce' => [
                'name' => 'Volvo Construction',
                'country' => 'Sweden',
                'models' => ['Articulated Hauler', 'Compact Excavator', 'Crawler Excavator', 'Skid Steer', 'Wheel Excavator', 'Wheel Loader']
            ],
        ],

        // ============================================
        // AGRICULTURAL MACHINERY
        // ============================================
        'agricultural' => [
            'case-ih' => [
                'name' => 'Case IH',
                'country' => 'USA',
                'models' => ['Combine Harvester', 'Maxxum', 'Optum', 'Puma', 'Quadtrac', 'Steiger']
            ],
            'claas' => [
                'name' => 'Claas',
                'country' => 'Germany',
                'models' => ['Arion', 'Axion', 'Jaguar', 'Lexion', 'Tucano', 'Xerion']
            ],
            'deutz-fahr' => [
                'name' => 'Deutz-Fahr',
                'country' => 'Germany',
                'models' => ['Agrofarm', 'Agroplus', 'Agrotron', 'C9000']
            ],
            'fendt-ag' => [
                'name' => 'Fendt',
                'country' => 'Germany',
                'models' => ['200 Vario', '300 Vario', '500 Vario', '700 Vario', '900 Vario', '1000 Vario', 'Ideal']
            ],
            'john-deere' => [
                'name' => 'John Deere',
                'country' => 'USA',
                'models' => ['5R Series', '6M Series', '6R Series', '7R Series', '8R Series', '9R Series', 'S Series Combine', 'T Series Combine', 'W Series Combine']
            ],
            'kubota' => [
                'name' => 'Kubota',
                'country' => 'Japan',
                'models' => ['L Series', 'M Series', 'M7 Series']
            ],
            'massey-ferguson' => [
                'name' => 'Massey Ferguson',
                'country' => 'USA',
                'models' => ['4700', '5700', '6700', '7700', '8700', 'Activa', 'Delta', 'Ideal']
            ],
            'new-holland' => [
                'name' => 'New Holland',
                'country' => 'Italy',
                'models' => ['CR Combine', 'CX Combine', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9']
            ],
            'valtra' => [
                'name' => 'Valtra',
                'country' => 'Finland',
                'models' => ['A Series', 'G Series', 'N Series', 'Q Series', 'S Series', 'T Series']
            ],
        ],

        // ============================================
        // FORKLIFTS
        // ============================================
        'forklift' => [
            'crown' => [
                'name' => 'Crown',
                'country' => 'USA',
                'models' => ['Counterbalance', 'Order Picker', 'Pallet Truck', 'Reach Truck', 'Stacker']
            ],
            'hyster' => [
                'name' => 'Hyster',
                'country' => 'USA',
                'models' => ['Counterbalance Electric', 'Counterbalance IC', 'Pallet Jack', 'Reach Truck', 'Warehouse']
            ],
            'jungheinrich' => [
                'name' => 'Jungheinrich',
                'country' => 'Germany',
                'models' => ['Counterbalance', 'Order Picker', 'Pallet Truck', 'Reach Truck', 'Stacker']
            ],
            'linde' => [
                'name' => 'Linde',
                'country' => 'Germany',
                'models' => ['Counterbalance Electric', 'Counterbalance IC', 'Order Picker', 'Pallet Truck', 'Reach Truck', 'Stacker', 'Tow Tractor']
            ],
            'still' => [
                'name' => 'Still',
                'country' => 'Germany',
                'models' => ['Counterbalance', 'Order Picker', 'Pallet Truck', 'Reach Truck', 'Stacker', 'Tow Tractor']
            ],
            'toyota-forklift' => [
                'name' => 'Toyota Material Handling',
                'country' => 'Japan',
                'models' => ['Counterbalance Electric', 'Counterbalance IC', 'Order Picker', 'Pallet Jack', 'Reach Truck', 'Stacker']
            ],
            'yale' => [
                'name' => 'Yale',
                'country' => 'USA',
                'models' => ['Counterbalance Electric', 'Counterbalance IC', 'Pallet Truck', 'Reach Truck', 'Stacker']
            ],
        ],

        // ============================================
        // BOATS
        // ============================================
        'boat' => [
            'bayliner' => [
                'name' => 'Bayliner',
                'country' => 'USA',
                'models' => ['Bowrider', 'Cruiser', 'Deck Boat', 'Trophy']
            ],
            'beneteau' => [
                'name' => 'Beneteau',
                'country' => 'France',
                'models' => ['Antares', 'Barracuda', 'Flyer', 'Gran Turismo', 'Monte Carlo', 'Swift Trawler']
            ],
            'boston-whaler' => [
                'name' => 'Boston Whaler',
                'country' => 'USA',
                'models' => ['Conquest', 'Dauntless', 'Montauk', 'Outrage']
            ],
            'jeanneau' => [
                'name' => 'Jeanneau',
                'country' => 'France',
                'models' => ['Cap Camarat', 'Leader', 'Merry Fisher', 'NC']
            ],
            'quicksilver' => [
                'name' => 'Quicksilver',
                'country' => 'UK',
                'models' => ['Activ', 'Captur', 'Commander', 'Weekend']
            ],
            'sea-ray' => [
                'name' => 'Sea Ray',
                'country' => 'USA',
                'models' => ['Bowrider', 'Cruiser', 'Fly', 'Sundancer', 'Sundeck']
            ],
            'yamaha-boat' => [
                'name' => 'Yamaha Boats',
                'country' => 'Japan',
                'models' => ['AR', 'FSH', 'Jet Boat', 'SX']
            ],
        ],

        // ============================================
        // ATV & QUAD
        // ============================================
        'atv' => [
            'can-am' => [
                'name' => 'Can-Am',
                'country' => 'Canada',
                'models' => ['Defender', 'Maverick', 'Outlander', 'Renegade']
            ],
            'cfmoto' => [
                'name' => 'CFMoto',
                'country' => 'China',
                'models' => ['CForce', 'UForce', 'ZForce']
            ],
            'honda-atv' => [
                'name' => 'Honda ATV',
                'country' => 'Japan',
                'models' => ['FourTrax', 'Pioneer', 'Rancher', 'Rubicon', 'Talon', 'TRX']
            ],
            'kawasaki-atv' => [
                'name' => 'Kawasaki',
                'country' => 'Japan',
                'models' => ['Brute Force', 'KFX', 'Mule', 'Teryx', 'Teryx KRX']
            ],
            'polaris' => [
                'name' => 'Polaris',
                'country' => 'USA',
                'models' => ['General', 'Ranger', 'RZR', 'Scrambler', 'Sportsman']
            ],
            'suzuki-atv' => [
                'name' => 'Suzuki ATV',
                'country' => 'Japan',
                'models' => ['KingQuad', 'LT-Z', 'QuadSport']
            ],
            'yamaha-atv' => [
                'name' => 'Yamaha ATV',
                'country' => 'Japan',
                'models' => ['Grizzly', 'Kodiak', 'Raptor', 'Viking', 'Wolverine', 'YXZ']
            ],
        ],

        // ============================================
        // QUAD (same as ATV)
        // ============================================
        'quad' => [
            'can-am' => [
                'name' => 'Can-Am',
                'country' => 'Canada',
                'models' => ['Defender', 'Maverick', 'Outlander', 'Renegade']
            ],
            'cfmoto' => [
                'name' => 'CFMoto',
                'country' => 'China',
                'models' => ['CForce', 'UForce', 'ZForce']
            ],
            'honda-atv' => [
                'name' => 'Honda ATV',
                'country' => 'Japan',
                'models' => ['FourTrax', 'Pioneer', 'Rancher', 'Rubicon', 'Talon', 'TRX']
            ],
            'kawasaki-atv' => [
                'name' => 'Kawasaki',
                'country' => 'Japan',
                'models' => ['Brute Force', 'KFX', 'Mule', 'Teryx', 'Teryx KRX']
            ],
            'polaris' => [
                'name' => 'Polaris',
                'country' => 'USA',
                'models' => ['General', 'Ranger', 'RZR', 'Scrambler', 'Sportsman']
            ],
            'suzuki-atv' => [
                'name' => 'Suzuki ATV',
                'country' => 'Japan',
                'models' => ['KingQuad', 'LT-Z', 'QuadSport']
            ],
            'yamaha-atv' => [
                'name' => 'Yamaha ATV',
                'country' => 'Japan',
                'models' => ['Grizzly', 'Kodiak', 'Raptor', 'Viking', 'Wolverine', 'YXZ']
            ],
        ],
    ],
];
