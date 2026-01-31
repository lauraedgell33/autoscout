// Comprehensive vehicle makes and models data
// Organized by category with all major manufacturers

export interface VehicleModel {
  name: string;
  years?: { from: number; to?: number };
}

export interface VehicleMake {
  id: string;
  name: string;
  country: string;
  models: VehicleModel[];
}

export interface VehicleCategory {
  id: string;
  name: string;
  makes: VehicleMake[];
}

// ============================================
// CARS - All major car manufacturers
// ============================================
export const CAR_MAKES: VehicleMake[] = [
  {
    id: 'abarth',
    name: 'Abarth',
    country: 'Italy',
    models: [
      { name: '124 Spider' }, { name: '500' }, { name: '595' }, { name: '695' },
      { name: 'Punto' }, { name: 'Grande Punto' }
    ]
  },
  {
    id: 'acura',
    name: 'Acura',
    country: 'Japan',
    models: [
      { name: 'ILX' }, { name: 'Integra' }, { name: 'MDX' }, { name: 'NSX' },
      { name: 'RDX' }, { name: 'RLX' }, { name: 'RSX' }, { name: 'TL' },
      { name: 'TLX' }, { name: 'TSX' }, { name: 'ZDX' }
    ]
  },
  {
    id: 'alfa-romeo',
    name: 'Alfa Romeo',
    country: 'Italy',
    models: [
      { name: '147' }, { name: '156' }, { name: '159' }, { name: '166' },
      { name: '4C' }, { name: 'Brera' }, { name: 'Giulia' }, { name: 'Giulietta' },
      { name: 'GT' }, { name: 'GTV' }, { name: 'MiTo' }, { name: 'Spider' },
      { name: 'Stelvio' }, { name: 'Tonale' }
    ]
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    country: 'UK',
    models: [
      { name: 'DB7' }, { name: 'DB9' }, { name: 'DB11' }, { name: 'DB12' },
      { name: 'DBS' }, { name: 'DBS Superleggera' }, { name: 'DBX' }, { name: 'Rapide' },
      { name: 'V8 Vantage' }, { name: 'V12 Vantage' }, { name: 'Vanquish' }, { name: 'Vantage' }
    ]
  },
  {
    id: 'audi',
    name: 'Audi',
    country: 'Germany',
    models: [
      { name: 'A1' }, { name: 'A2' }, { name: 'A3' }, { name: 'A4' }, { name: 'A5' },
      { name: 'A6' }, { name: 'A7' }, { name: 'A8' }, { name: 'e-tron' }, { name: 'e-tron GT' },
      { name: 'Q2' }, { name: 'Q3' }, { name: 'Q4 e-tron' }, { name: 'Q5' }, { name: 'Q7' },
      { name: 'Q8' }, { name: 'Q8 e-tron' }, { name: 'R8' }, { name: 'RS3' }, { name: 'RS4' },
      { name: 'RS5' }, { name: 'RS6' }, { name: 'RS7' }, { name: 'RS Q3' }, { name: 'RS Q8' },
      { name: 'S1' }, { name: 'S3' }, { name: 'S4' }, { name: 'S5' }, { name: 'S6' },
      { name: 'S7' }, { name: 'S8' }, { name: 'SQ5' }, { name: 'SQ7' }, { name: 'SQ8' },
      { name: 'TT' }, { name: 'TTS' }, { name: 'TT RS' }
    ]
  },
  {
    id: 'bentley',
    name: 'Bentley',
    country: 'UK',
    models: [
      { name: 'Arnage' }, { name: 'Azure' }, { name: 'Bentayga' }, { name: 'Continental GT' },
      { name: 'Continental Flying Spur' }, { name: 'Flying Spur' }, { name: 'Mulsanne' }
    ]
  },
  {
    id: 'bmw',
    name: 'BMW',
    country: 'Germany',
    models: [
      { name: '1 Series' }, { name: '2 Series' }, { name: '2 Series Active Tourer' },
      { name: '2 Series Gran Coupe' }, { name: '3 Series' }, { name: '4 Series' },
      { name: '5 Series' }, { name: '6 Series' }, { name: '7 Series' }, { name: '8 Series' },
      { name: 'i3' }, { name: 'i4' }, { name: 'i5' }, { name: 'i7' }, { name: 'i8' },
      { name: 'iX' }, { name: 'iX1' }, { name: 'iX2' }, { name: 'iX3' },
      { name: 'M2' }, { name: 'M3' }, { name: 'M4' }, { name: 'M5' }, { name: 'M8' },
      { name: 'X1' }, { name: 'X2' }, { name: 'X3' }, { name: 'X4' }, { name: 'X5' },
      { name: 'X6' }, { name: 'X7' }, { name: 'XM' }, { name: 'Z3' }, { name: 'Z4' }
    ]
  },
  {
    id: 'bugatti',
    name: 'Bugatti',
    country: 'France',
    models: [
      { name: 'Chiron' }, { name: 'Divo' }, { name: 'EB110' }, { name: 'Veyron' }
    ]
  },
  {
    id: 'cadillac',
    name: 'Cadillac',
    country: 'USA',
    models: [
      { name: 'ATS' }, { name: 'BLS' }, { name: 'CT4' }, { name: 'CT5' }, { name: 'CT6' },
      { name: 'CTS' }, { name: 'Escalade' }, { name: 'Lyriq' }, { name: 'SRX' },
      { name: 'STS' }, { name: 'XT4' }, { name: 'XT5' }, { name: 'XT6' }, { name: 'XTS' }
    ]
  },
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    country: 'USA',
    models: [
      { name: 'Aveo' }, { name: 'Blazer' }, { name: 'Bolt' }, { name: 'Camaro' },
      { name: 'Captiva' }, { name: 'Colorado' }, { name: 'Corvette' }, { name: 'Cruze' },
      { name: 'Equinox' }, { name: 'Malibu' }, { name: 'Orlando' }, { name: 'Silverado' },
      { name: 'Spark' }, { name: 'Suburban' }, { name: 'Tahoe' }, { name: 'Trailblazer' },
      { name: 'Traverse' }, { name: 'Trax' }, { name: 'Volt' }
    ]
  },
  {
    id: 'chrysler',
    name: 'Chrysler',
    country: 'USA',
    models: [
      { name: '200' }, { name: '300' }, { name: '300C' }, { name: 'Crossfire' },
      { name: 'Grand Voyager' }, { name: 'Pacifica' }, { name: 'PT Cruiser' },
      { name: 'Sebring' }, { name: 'Town & Country' }, { name: 'Voyager' }
    ]
  },
  {
    id: 'citroen',
    name: 'Citroën',
    country: 'France',
    models: [
      { name: 'Berlingo' }, { name: 'C1' }, { name: 'C2' }, { name: 'C3' }, { name: 'C3 Aircross' },
      { name: 'C3 Picasso' }, { name: 'C4' }, { name: 'C4 Cactus' }, { name: 'C4 Picasso' },
      { name: 'C4 X' }, { name: 'C5' }, { name: 'C5 Aircross' }, { name: 'C5 X' },
      { name: 'C6' }, { name: 'C8' }, { name: 'DS3' }, { name: 'DS4' }, { name: 'DS5' },
      { name: 'e-C4' }, { name: 'Grand C4 Picasso' }, { name: 'Jumpy' }, { name: 'Nemo' },
      { name: 'SpaceTourer' }, { name: 'Xsara' }, { name: 'Xsara Picasso' }
    ]
  },
  {
    id: 'cupra',
    name: 'Cupra',
    country: 'Spain',
    models: [
      { name: 'Ateca' }, { name: 'Born' }, { name: 'Formentor' }, { name: 'Leon' },
      { name: 'Tavascan' }, { name: 'Terramar' }
    ]
  },
  {
    id: 'dacia',
    name: 'Dacia',
    country: 'Romania',
    models: [
      { name: 'Dokker' }, { name: 'Duster' }, { name: 'Jogger' }, { name: 'Lodgy' },
      { name: 'Logan' }, { name: 'Sandero' }, { name: 'Sandero Stepway' }, { name: 'Spring' }
    ]
  },
  {
    id: 'daewoo',
    name: 'Daewoo',
    country: 'South Korea',
    models: [
      { name: 'Espero' }, { name: 'Kalos' }, { name: 'Lacetti' }, { name: 'Lanos' },
      { name: 'Leganza' }, { name: 'Matiz' }, { name: 'Nexia' }, { name: 'Nubira' }, { name: 'Tacuma' }
    ]
  },
  {
    id: 'dodge',
    name: 'Dodge',
    country: 'USA',
    models: [
      { name: 'Avenger' }, { name: 'Caliber' }, { name: 'Challenger' }, { name: 'Charger' },
      { name: 'Dart' }, { name: 'Durango' }, { name: 'Hornet' }, { name: 'Journey' },
      { name: 'Nitro' }, { name: 'Ram' }, { name: 'Viper' }
    ]
  },
  {
    id: 'ds',
    name: 'DS Automobiles',
    country: 'France',
    models: [
      { name: 'DS 3' }, { name: 'DS 3 Crossback' }, { name: 'DS 4' }, { name: 'DS 5' },
      { name: 'DS 7' }, { name: 'DS 9' }
    ]
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    country: 'Italy',
    models: [
      { name: '296 GTB' }, { name: '296 GTS' }, { name: '360' }, { name: '430' },
      { name: '458' }, { name: '488' }, { name: '599' }, { name: '612' },
      { name: '812' }, { name: 'California' }, { name: 'Daytona SP3' }, { name: 'F12' },
      { name: 'F8' }, { name: 'FF' }, { name: 'GTC4Lusso' }, { name: 'LaFerrari' },
      { name: 'Portofino' }, { name: 'Purosangue' }, { name: 'Roma' }, { name: 'SF90' }
    ]
  },
  {
    id: 'fiat',
    name: 'Fiat',
    country: 'Italy',
    models: [
      { name: '124 Spider' }, { name: '500' }, { name: '500C' }, { name: '500e' },
      { name: '500L' }, { name: '500X' }, { name: 'Bravo' }, { name: 'Doblo' },
      { name: 'Ducato' }, { name: 'Fiorino' }, { name: 'Freemont' }, { name: 'Grande Punto' },
      { name: 'Idea' }, { name: 'Multipla' }, { name: 'Panda' }, { name: 'Punto' },
      { name: 'Punto Evo' }, { name: 'Qubo' }, { name: 'Sedici' }, { name: 'Stilo' },
      { name: 'Talento' }, { name: 'Tipo' }, { name: 'Ulysse' }
    ]
  },
  {
    id: 'ford',
    name: 'Ford',
    country: 'USA',
    models: [
      { name: 'B-Max' }, { name: 'Bronco' }, { name: 'C-Max' }, { name: 'EcoSport' },
      { name: 'Edge' }, { name: 'Escape' }, { name: 'Expedition' }, { name: 'Explorer' },
      { name: 'F-150' }, { name: 'Fiesta' }, { name: 'Focus' }, { name: 'Fusion' },
      { name: 'Galaxy' }, { name: 'Grand C-Max' }, { name: 'GT' }, { name: 'Ka' },
      { name: 'Ka+' }, { name: 'Kuga' }, { name: 'Maverick' }, { name: 'Mondeo' },
      { name: 'Mustang' }, { name: 'Mustang Mach-E' }, { name: 'Puma' }, { name: 'Ranger' },
      { name: 'S-Max' }, { name: 'Taurus' }, { name: 'Tourneo Connect' }, { name: 'Tourneo Custom' },
      { name: 'Transit' }, { name: 'Transit Connect' }, { name: 'Transit Custom' }
    ]
  },
  {
    id: 'genesis',
    name: 'Genesis',
    country: 'South Korea',
    models: [
      { name: 'G70' }, { name: 'G80' }, { name: 'G90' }, { name: 'GV60' },
      { name: 'GV70' }, { name: 'GV80' }
    ]
  },
  {
    id: 'honda',
    name: 'Honda',
    country: 'Japan',
    models: [
      { name: 'Accord' }, { name: 'City' }, { name: 'Civic' }, { name: 'CR-V' },
      { name: 'CR-Z' }, { name: 'e' }, { name: 'e:Ny1' }, { name: 'FR-V' },
      { name: 'HR-V' }, { name: 'Insight' }, { name: 'Jazz' }, { name: 'Legend' },
      { name: 'NSX' }, { name: 'Odyssey' }, { name: 'Passport' }, { name: 'Pilot' },
      { name: 'Ridgeline' }, { name: 'S2000' }, { name: 'ZR-V' }
    ]
  },
  {
    id: 'hummer',
    name: 'Hummer',
    country: 'USA',
    models: [
      { name: 'H1' }, { name: 'H2' }, { name: 'H3' }, { name: 'EV' }
    ]
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    country: 'South Korea',
    models: [
      { name: 'Accent' }, { name: 'Bayon' }, { name: 'Coupe' }, { name: 'Elantra' },
      { name: 'Getz' }, { name: 'i10' }, { name: 'i20' }, { name: 'i30' },
      { name: 'i40' }, { name: 'Ioniq' }, { name: 'Ioniq 5' }, { name: 'Ioniq 6' },
      { name: 'ix20' }, { name: 'ix35' }, { name: 'ix55' }, { name: 'Kona' },
      { name: 'Kona Electric' }, { name: 'Matrix' }, { name: 'Nexo' }, { name: 'Palisade' },
      { name: 'Santa Fe' }, { name: 'Sonata' }, { name: 'Staria' }, { name: 'Terracan' },
      { name: 'Tucson' }, { name: 'Veloster' }
    ]
  },
  {
    id: 'infiniti',
    name: 'Infiniti',
    country: 'Japan',
    models: [
      { name: 'EX' }, { name: 'FX' }, { name: 'G' }, { name: 'M' }, { name: 'Q30' },
      { name: 'Q50' }, { name: 'Q60' }, { name: 'Q70' }, { name: 'QX30' }, { name: 'QX50' },
      { name: 'QX55' }, { name: 'QX60' }, { name: 'QX70' }, { name: 'QX80' }
    ]
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    country: 'UK',
    models: [
      { name: 'E-Pace' }, { name: 'F-Pace' }, { name: 'F-Type' }, { name: 'I-Pace' },
      { name: 'S-Type' }, { name: 'X-Type' }, { name: 'XE' }, { name: 'XF' },
      { name: 'XJ' }, { name: 'XK' }, { name: 'XKR' }
    ]
  },
  {
    id: 'jeep',
    name: 'Jeep',
    country: 'USA',
    models: [
      { name: 'Cherokee' }, { name: 'Commander' }, { name: 'Compass' }, { name: 'Gladiator' },
      { name: 'Grand Cherokee' }, { name: 'Grand Cherokee L' }, { name: 'Liberty' },
      { name: 'Patriot' }, { name: 'Renegade' }, { name: 'Wrangler' }
    ]
  },
  {
    id: 'kia',
    name: 'Kia',
    country: 'South Korea',
    models: [
      { name: 'Carens' }, { name: 'Carnival' }, { name: 'Ceed' }, { name: 'Cerato' },
      { name: 'e-Niro' }, { name: 'e-Soul' }, { name: 'EV6' }, { name: 'EV9' },
      { name: 'Magentis' }, { name: 'Niro' }, { name: 'Optima' }, { name: 'Picanto' },
      { name: 'Pro Ceed' }, { name: 'Rio' }, { name: 'Sedona' }, { name: 'Seltos' },
      { name: 'Sorento' }, { name: 'Soul' }, { name: 'Sportage' }, { name: 'Stinger' },
      { name: 'Stonic' }, { name: 'Venga' }, { name: 'XCeed' }
    ]
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini',
    country: 'Italy',
    models: [
      { name: 'Aventador' }, { name: 'Countach' }, { name: 'Diablo' }, { name: 'Gallardo' },
      { name: 'Huracan' }, { name: 'Murcielago' }, { name: 'Revuelto' }, { name: 'Urus' }
    ]
  },
  {
    id: 'lancia',
    name: 'Lancia',
    country: 'Italy',
    models: [
      { name: 'Delta' }, { name: 'Musa' }, { name: 'Phedra' }, { name: 'Thesis' },
      { name: 'Voyager' }, { name: 'Ypsilon' }
    ]
  },
  {
    id: 'land-rover',
    name: 'Land Rover',
    country: 'UK',
    models: [
      { name: 'Defender' }, { name: 'Discovery' }, { name: 'Discovery Sport' },
      { name: 'Freelander' }, { name: 'Range Rover' }, { name: 'Range Rover Evoque' },
      { name: 'Range Rover Sport' }, { name: 'Range Rover Velar' }
    ]
  },
  {
    id: 'lexus',
    name: 'Lexus',
    country: 'Japan',
    models: [
      { name: 'CT' }, { name: 'ES' }, { name: 'GS' }, { name: 'GX' }, { name: 'IS' },
      { name: 'LC' }, { name: 'LFA' }, { name: 'LS' }, { name: 'LX' }, { name: 'NX' },
      { name: 'RC' }, { name: 'RX' }, { name: 'RZ' }, { name: 'SC' }, { name: 'UX' }
    ]
  },
  {
    id: 'lincoln',
    name: 'Lincoln',
    country: 'USA',
    models: [
      { name: 'Aviator' }, { name: 'Continental' }, { name: 'Corsair' }, { name: 'MKC' },
      { name: 'MKS' }, { name: 'MKT' }, { name: 'MKX' }, { name: 'MKZ' },
      { name: 'Nautilus' }, { name: 'Navigator' }, { name: 'Town Car' }
    ]
  },
  {
    id: 'lotus',
    name: 'Lotus',
    country: 'UK',
    models: [
      { name: 'Eletre' }, { name: 'Elise' }, { name: 'Emira' }, { name: 'Europa' },
      { name: 'Evija' }, { name: 'Evora' }, { name: 'Exige' }
    ]
  },
  {
    id: 'maserati',
    name: 'Maserati',
    country: 'Italy',
    models: [
      { name: 'Ghibli' }, { name: 'GranCabrio' }, { name: 'GranTurismo' }, { name: 'Grecale' },
      { name: 'Levante' }, { name: 'MC20' }, { name: 'Quattroporte' }
    ]
  },
  {
    id: 'mazda',
    name: 'Mazda',
    country: 'Japan',
    models: [
      { name: '2' }, { name: '3' }, { name: '5' }, { name: '6' }, { name: 'CX-3' },
      { name: 'CX-30' }, { name: 'CX-5' }, { name: 'CX-60' }, { name: 'CX-7' },
      { name: 'CX-9' }, { name: 'CX-90' }, { name: 'MX-30' }, { name: 'MX-5' },
      { name: 'RX-7' }, { name: 'RX-8' }
    ]
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    country: 'UK',
    models: [
      { name: '540C' }, { name: '570GT' }, { name: '570S' }, { name: '600LT' },
      { name: '620R' }, { name: '650S' }, { name: '675LT' }, { name: '720S' },
      { name: '750S' }, { name: '765LT' }, { name: 'Artura' }, { name: 'Elva' },
      { name: 'GT' }, { name: 'P1' }, { name: 'Senna' }, { name: 'Speedtail' }
    ]
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    country: 'Germany',
    models: [
      { name: 'A-Class' }, { name: 'AMG GT' }, { name: 'B-Class' }, { name: 'C-Class' },
      { name: 'CL' }, { name: 'CLA' }, { name: 'CLC' }, { name: 'CLK' }, { name: 'CLS' },
      { name: 'E-Class' }, { name: 'EQA' }, { name: 'EQB' }, { name: 'EQC' }, { name: 'EQE' },
      { name: 'EQS' }, { name: 'EQV' }, { name: 'G-Class' }, { name: 'GL' }, { name: 'GLA' },
      { name: 'GLB' }, { name: 'GLC' }, { name: 'GLE' }, { name: 'GLK' }, { name: 'GLS' },
      { name: 'M-Class' }, { name: 'Maybach' }, { name: 'R-Class' }, { name: 'S-Class' },
      { name: 'SL' }, { name: 'SLC' }, { name: 'SLK' }, { name: 'SLR' }, { name: 'SLS' },
      { name: 'Sprinter' }, { name: 'V-Class' }, { name: 'Vaneo' }, { name: 'Viano' },
      { name: 'Vito' }, { name: 'X-Class' }
    ]
  },
  {
    id: 'mg',
    name: 'MG',
    country: 'UK/China',
    models: [
      { name: '3' }, { name: '4' }, { name: '5' }, { name: 'Cyberster' }, { name: 'EHS' },
      { name: 'HS' }, { name: 'Marvel R' }, { name: 'TF' }, { name: 'ZS' }, { name: 'ZS EV' }
    ]
  },
  {
    id: 'mini',
    name: 'MINI',
    country: 'UK',
    models: [
      { name: 'Clubman' }, { name: 'Convertible' }, { name: 'Countryman' }, { name: 'Coupe' },
      { name: 'Hatch' }, { name: 'John Cooper Works' }, { name: 'One' }, { name: 'Paceman' },
      { name: 'Roadster' }
    ]
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi',
    country: 'Japan',
    models: [
      { name: 'ASX' }, { name: 'Colt' }, { name: 'Eclipse' }, { name: 'Eclipse Cross' },
      { name: 'Galant' }, { name: 'Grandis' }, { name: 'i-MiEV' }, { name: 'L200' },
      { name: 'Lancer' }, { name: 'Mirage' }, { name: 'Outlander' }, { name: 'Pajero' },
      { name: 'Pajero Sport' }, { name: 'Space Star' }
    ]
  },
  {
    id: 'nissan',
    name: 'Nissan',
    country: 'Japan',
    models: [
      { name: '350Z' }, { name: '370Z' }, { name: 'Almera' }, { name: 'Ariya' },
      { name: 'Cube' }, { name: 'e-NV200' }, { name: 'GT-R' }, { name: 'Juke' },
      { name: 'Leaf' }, { name: 'Micra' }, { name: 'Murano' }, { name: 'Navara' },
      { name: 'Note' }, { name: 'NV200' }, { name: 'NV300' }, { name: 'Pathfinder' },
      { name: 'Patrol' }, { name: 'Primera' }, { name: 'Pulsar' }, { name: 'Qashqai' },
      { name: 'Rogue' }, { name: 'Sentra' }, { name: 'Terrano' }, { name: 'Tiida' },
      { name: 'Titan' }, { name: 'X-Trail' }, { name: 'Z' }
    ]
  },
  {
    id: 'opel',
    name: 'Opel',
    country: 'Germany',
    models: [
      { name: 'Adam' }, { name: 'Agila' }, { name: 'Ampera' }, { name: 'Antara' },
      { name: 'Astra' }, { name: 'Cascada' }, { name: 'Combo' }, { name: 'Corsa' },
      { name: 'Corsa-e' }, { name: 'Crossland' }, { name: 'Grandland' }, { name: 'Insignia' },
      { name: 'Karl' }, { name: 'Meriva' }, { name: 'Mokka' }, { name: 'Mokka-e' },
      { name: 'Movano' }, { name: 'Signum' }, { name: 'Vectra' }, { name: 'Vivaro' },
      { name: 'Zafira' }
    ]
  },
  {
    id: 'peugeot',
    name: 'Peugeot',
    country: 'France',
    models: [
      { name: '107' }, { name: '108' }, { name: '2008' }, { name: '206' }, { name: '207' },
      { name: '208' }, { name: '3008' }, { name: '301' }, { name: '307' }, { name: '308' },
      { name: '4007' }, { name: '4008' }, { name: '407' }, { name: '408' }, { name: '5008' },
      { name: '508' }, { name: '607' }, { name: '807' }, { name: 'Bipper' }, { name: 'Boxer' },
      { name: 'e-2008' }, { name: 'e-208' }, { name: 'e-308' }, { name: 'e-Rifter' },
      { name: 'Expert' }, { name: 'iOn' }, { name: 'Partner' }, { name: 'RCZ' },
      { name: 'Rifter' }, { name: 'Traveller' }
    ]
  },
  {
    id: 'polestar',
    name: 'Polestar',
    country: 'Sweden',
    models: [
      { name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }
    ]
  },
  {
    id: 'porsche',
    name: 'Porsche',
    country: 'Germany',
    models: [
      { name: '718 Boxster' }, { name: '718 Cayman' }, { name: '911' }, { name: '918 Spyder' },
      { name: '944' }, { name: '968' }, { name: 'Boxster' }, { name: 'Carrera GT' },
      { name: 'Cayenne' }, { name: 'Cayman' }, { name: 'Macan' }, { name: 'Panamera' },
      { name: 'Taycan' }
    ]
  },
  {
    id: 'renault',
    name: 'Renault',
    country: 'France',
    models: [
      { name: 'Arkana' }, { name: 'Austral' }, { name: 'Captur' }, { name: 'Clio' },
      { name: 'Espace' }, { name: 'Express' }, { name: 'Fluence' }, { name: 'Grand Scenic' },
      { name: 'Kadjar' }, { name: 'Kangoo' }, { name: 'Koleos' }, { name: 'Laguna' },
      { name: 'Latitude' }, { name: 'Master' }, { name: 'Megane' }, { name: 'Megane E-Tech' },
      { name: 'Modus' }, { name: 'Scenic' }, { name: 'Talisman' }, { name: 'Trafic' },
      { name: 'Twingo' }, { name: 'Twizy' }, { name: 'Vel Satis' }, { name: 'Wind' },
      { name: 'Zoe' }
    ]
  },
  {
    id: 'rolls-royce',
    name: 'Rolls-Royce',
    country: 'UK',
    models: [
      { name: 'Cullinan' }, { name: 'Dawn' }, { name: 'Ghost' }, { name: 'Phantom' },
      { name: 'Silver Seraph' }, { name: 'Spectre' }, { name: 'Wraith' }
    ]
  },
  {
    id: 'saab',
    name: 'Saab',
    country: 'Sweden',
    models: [
      { name: '9-3' }, { name: '9-5' }, { name: '9-7X' }, { name: '900' }, { name: '9000' }
    ]
  },
  {
    id: 'seat',
    name: 'SEAT',
    country: 'Spain',
    models: [
      { name: 'Alhambra' }, { name: 'Altea' }, { name: 'Arona' }, { name: 'Ateca' },
      { name: 'Cordoba' }, { name: 'Exeo' }, { name: 'Ibiza' }, { name: 'Leon' },
      { name: 'Mii' }, { name: 'Tarraco' }, { name: 'Toledo' }
    ]
  },
  {
    id: 'skoda',
    name: 'Škoda',
    country: 'Czech Republic',
    models: [
      { name: 'Citigo' }, { name: 'Enyaq' }, { name: 'Fabia' }, { name: 'Kamiq' },
      { name: 'Karoq' }, { name: 'Kodiaq' }, { name: 'Octavia' }, { name: 'Rapid' },
      { name: 'Roomster' }, { name: 'Scala' }, { name: 'Superb' }, { name: 'Yeti' }
    ]
  },
  {
    id: 'smart',
    name: 'Smart',
    country: 'Germany',
    models: [
      { name: '#1' }, { name: '#3' }, { name: 'Forfour' }, { name: 'Fortwo' }, { name: 'Roadster' }
    ]
  },
  {
    id: 'ssangyong',
    name: 'SsangYong',
    country: 'South Korea',
    models: [
      { name: 'Actyon' }, { name: 'Korando' }, { name: 'Kyron' }, { name: 'Musso' },
      { name: 'Rexton' }, { name: 'Rodius' }, { name: 'Tivoli' }, { name: 'Torres' }, { name: 'XLV' }
    ]
  },
  {
    id: 'subaru',
    name: 'Subaru',
    country: 'Japan',
    models: [
      { name: 'Ascent' }, { name: 'BRZ' }, { name: 'Crosstrek' }, { name: 'Forester' },
      { name: 'Impreza' }, { name: 'Legacy' }, { name: 'Levorg' }, { name: 'Outback' },
      { name: 'Solterra' }, { name: 'Tribeca' }, { name: 'WRX' }, { name: 'XV' }
    ]
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    country: 'Japan',
    models: [
      { name: 'Across' }, { name: 'Alto' }, { name: 'Baleno' }, { name: 'Celerio' },
      { name: 'Grand Vitara' }, { name: 'Ignis' }, { name: 'Jimny' }, { name: 'Kizashi' },
      { name: 'Liana' }, { name: 'S-Cross' }, { name: 'Splash' }, { name: 'Swift' },
      { name: 'SX4' }, { name: 'Vitara' }, { name: 'Wagon R+' }
    ]
  },
  {
    id: 'tesla',
    name: 'Tesla',
    country: 'USA',
    models: [
      { name: 'Cybertruck' }, { name: 'Model 3' }, { name: 'Model S' },
      { name: 'Model X' }, { name: 'Model Y' }, { name: 'Roadster' }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota',
    country: 'Japan',
    models: [
      { name: '4Runner' }, { name: 'Avalon' }, { name: 'Avensis' }, { name: 'Aygo' },
      { name: 'Aygo X' }, { name: 'bZ4X' }, { name: 'C-HR' }, { name: 'Camry' },
      { name: 'Celica' }, { name: 'Corolla' }, { name: 'Corolla Cross' }, { name: 'Crown' },
      { name: 'FJ Cruiser' }, { name: 'GR Supra' }, { name: 'GR86' }, { name: 'Highlander' },
      { name: 'Hilux' }, { name: 'iQ' }, { name: 'Land Cruiser' }, { name: 'Mirai' },
      { name: 'MR2' }, { name: 'Prius' }, { name: 'ProAce' }, { name: 'RAV4' },
      { name: 'Sequoia' }, { name: 'Sienna' }, { name: 'Supra' }, { name: 'Tacoma' },
      { name: 'Tundra' }, { name: 'Urban Cruiser' }, { name: 'Verso' }, { name: 'Yaris' },
      { name: 'Yaris Cross' }
    ]
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    country: 'Germany',
    models: [
      { name: 'Amarok' }, { name: 'Arteon' }, { name: 'Beetle' }, { name: 'Bora' },
      { name: 'Caddy' }, { name: 'California' }, { name: 'Caravelle' }, { name: 'CC' },
      { name: 'Crafter' }, { name: 'Eos' }, { name: 'Fox' }, { name: 'Golf' },
      { name: 'ID.3' }, { name: 'ID.4' }, { name: 'ID.5' }, { name: 'ID.7' },
      { name: 'ID. Buzz' }, { name: 'Jetta' }, { name: 'Lupo' }, { name: 'Multivan' },
      { name: 'New Beetle' }, { name: 'Passat' }, { name: 'Phaeton' }, { name: 'Polo' },
      { name: 'Scirocco' }, { name: 'Sharan' }, { name: 'T-Cross' }, { name: 'T-Roc' },
      { name: 'Taigo' }, { name: 'Tiguan' }, { name: 'Tiguan Allspace' }, { name: 'Touareg' },
      { name: 'Touran' }, { name: 'Transporter' }, { name: 'Up!' }
    ]
  },
  {
    id: 'volvo',
    name: 'Volvo',
    country: 'Sweden',
    models: [
      { name: 'C30' }, { name: 'C40' }, { name: 'C70' }, { name: 'EX30' }, { name: 'EX90' },
      { name: 'S40' }, { name: 'S60' }, { name: 'S80' }, { name: 'S90' }, { name: 'V40' },
      { name: 'V50' }, { name: 'V60' }, { name: 'V70' }, { name: 'V90' }, { name: 'XC40' },
      { name: 'XC60' }, { name: 'XC70' }, { name: 'XC90' }
    ]
  }
];

// ============================================
// MOTORCYCLES
// ============================================
export const MOTORCYCLE_MAKES: VehicleMake[] = [
  {
    id: 'aprilia',
    name: 'Aprilia',
    country: 'Italy',
    models: [
      { name: 'Dorsoduro' }, { name: 'RS 125' }, { name: 'RS 660' }, { name: 'RS4' },
      { name: 'RSV4' }, { name: 'Shiver' }, { name: 'SR GT' }, { name: 'SX 125' },
      { name: 'Tuareg 660' }, { name: 'Tuono' }
    ]
  },
  {
    id: 'benelli',
    name: 'Benelli',
    country: 'Italy',
    models: [
      { name: '302S' }, { name: '502C' }, { name: '752S' }, { name: 'BN 125' },
      { name: 'Imperiale 400' }, { name: 'Leoncino' }, { name: 'TRK 502' }
    ]
  },
  {
    id: 'bmw-moto',
    name: 'BMW Motorrad',
    country: 'Germany',
    models: [
      { name: 'C 400' }, { name: 'C 650' }, { name: 'CE 04' }, { name: 'F 750 GS' },
      { name: 'F 850 GS' }, { name: 'F 900 R' }, { name: 'F 900 XR' }, { name: 'G 310' },
      { name: 'K 1600' }, { name: 'M 1000' }, { name: 'R 1250 GS' }, { name: 'R 1250 R' },
      { name: 'R 1250 RS' }, { name: 'R 1250 RT' }, { name: 'R 18' }, { name: 'R NineT' },
      { name: 'S 1000 R' }, { name: 'S 1000 RR' }, { name: 'S 1000 XR' }
    ]
  },
  {
    id: 'ducati',
    name: 'Ducati',
    country: 'Italy',
    models: [
      { name: 'Diavel' }, { name: 'Hypermotard' }, { name: 'Monster' }, { name: 'Multistrada' },
      { name: 'Panigale V2' }, { name: 'Panigale V4' }, { name: 'Scrambler' },
      { name: 'Streetfighter V2' }, { name: 'Streetfighter V4' }, { name: 'SuperSport' },
      { name: 'XDiavel' }
    ]
  },
  {
    id: 'harley-davidson',
    name: 'Harley-Davidson',
    country: 'USA',
    models: [
      { name: 'Breakout' }, { name: 'CVO' }, { name: 'Electra Glide' }, { name: 'Fat Bob' },
      { name: 'Fat Boy' }, { name: 'Heritage Classic' }, { name: 'Iron 883' },
      { name: 'LiveWire' }, { name: 'Low Rider' }, { name: 'Nightster' }, { name: 'Pan America' },
      { name: 'Road Glide' }, { name: 'Road King' }, { name: 'Roadster' },
      { name: 'Softail' }, { name: 'Sport Glide' }, { name: 'Sportster' },
      { name: 'Street' }, { name: 'Street Bob' }, { name: 'Street Glide' }
    ]
  },
  {
    id: 'honda-moto',
    name: 'Honda Motorcycles',
    country: 'Japan',
    models: [
      { name: 'Africa Twin' }, { name: 'CB 125' }, { name: 'CB 300' }, { name: 'CB 500' },
      { name: 'CB 650' }, { name: 'CB 1000' }, { name: 'CBF' }, { name: 'CBR 125' },
      { name: 'CBR 300' }, { name: 'CBR 500' }, { name: 'CBR 600' }, { name: 'CBR 650' },
      { name: 'CBR 1000 RR' }, { name: 'CMX' }, { name: 'CRF' }, { name: 'Forza' },
      { name: 'GL 1800' }, { name: 'Goldwing' }, { name: 'Hornet' }, { name: 'MSX 125' },
      { name: 'NC 750' }, { name: 'NT 1100' }, { name: 'PCX' }, { name: 'Rebel' },
      { name: 'SH' }, { name: 'Transalp' }, { name: 'VFR' }, { name: 'X-ADV' }
    ]
  },
  {
    id: 'husqvarna',
    name: 'Husqvarna',
    country: 'Sweden',
    models: [
      { name: '401 Svartpilen' }, { name: '401 Vitpilen' }, { name: '701 Enduro' },
      { name: '701 Supermoto' }, { name: 'Norden 901' }
    ]
  },
  {
    id: 'indian',
    name: 'Indian Motorcycle',
    country: 'USA',
    models: [
      { name: 'Challenger' }, { name: 'Chief' }, { name: 'Chieftain' }, { name: 'FTR' },
      { name: 'Pursuit' }, { name: 'Roadmaster' }, { name: 'Scout' }, { name: 'Springfield' }
    ]
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    country: 'Japan',
    models: [
      { name: 'ER-6' }, { name: 'H2' }, { name: 'KLR' }, { name: 'KX' },
      { name: 'Ninja 125' }, { name: 'Ninja 250' }, { name: 'Ninja 300' }, { name: 'Ninja 400' },
      { name: 'Ninja 650' }, { name: 'Ninja 1000' }, { name: 'Ninja ZX-6R' }, { name: 'Ninja ZX-10R' },
      { name: 'Versys 650' }, { name: 'Versys 1000' }, { name: 'Vulcan' }, { name: 'W800' },
      { name: 'Z125' }, { name: 'Z400' }, { name: 'Z650' }, { name: 'Z900' }, { name: 'Z1000' },
      { name: 'ZZR' }
    ]
  },
  {
    id: 'ktm',
    name: 'KTM',
    country: 'Austria',
    models: [
      { name: '125 Duke' }, { name: '200 Duke' }, { name: '390 Duke' }, { name: '690' },
      { name: '790 Duke' }, { name: '890 Duke' }, { name: '1290 Super Duke' },
      { name: '1290 Super Adventure' }, { name: 'EXC' }, { name: 'RC 125' }, { name: 'RC 390' },
      { name: 'SX' }
    ]
  },
  {
    id: 'moto-guzzi',
    name: 'Moto Guzzi',
    country: 'Italy',
    models: [
      { name: 'Audace' }, { name: 'California' }, { name: 'Eldorado' }, { name: 'Griso' },
      { name: 'MGX-21' }, { name: 'Stelvio' }, { name: 'V7' }, { name: 'V85 TT' }, { name: 'V100' }
    ]
  },
  {
    id: 'mv-agusta',
    name: 'MV Agusta',
    country: 'Italy',
    models: [
      { name: 'Brutale' }, { name: 'Dragster' }, { name: 'F3' }, { name: 'Rush' },
      { name: 'Superveloce' }, { name: 'Turismo Veloce' }
    ]
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    country: 'India',
    models: [
      { name: 'Classic' }, { name: 'Continental GT' }, { name: 'Himalayan' },
      { name: 'Hunter' }, { name: 'Interceptor' }, { name: 'Meteor' }, { name: 'Super Meteor' }
    ]
  },
  {
    id: 'suzuki-moto',
    name: 'Suzuki Motorcycles',
    country: 'Japan',
    models: [
      { name: 'Burgman' }, { name: 'DR-Z' }, { name: 'GSX-R 600' }, { name: 'GSX-R 750' },
      { name: 'GSX-R 1000' }, { name: 'GSX-S 750' }, { name: 'GSX-S 1000' }, { name: 'Hayabusa' },
      { name: 'Katana' }, { name: 'SV 650' }, { name: 'V-Strom 650' }, { name: 'V-Strom 1050' }
    ]
  },
  {
    id: 'triumph',
    name: 'Triumph',
    country: 'UK',
    models: [
      { name: 'Bobber' }, { name: 'Bonneville' }, { name: 'Daytona' }, { name: 'Rocket 3' },
      { name: 'Scrambler' }, { name: 'Speed Triple' }, { name: 'Speed Twin' },
      { name: 'Street Triple' }, { name: 'Thruxton' }, { name: 'Tiger 660' },
      { name: 'Tiger 850' }, { name: 'Tiger 900' }, { name: 'Tiger 1200' }, { name: 'Trident' }
    ]
  },
  {
    id: 'yamaha-moto',
    name: 'Yamaha Motorcycles',
    country: 'Japan',
    models: [
      { name: 'FJR 1300' }, { name: 'FZ' }, { name: 'MT-03' }, { name: 'MT-07' },
      { name: 'MT-09' }, { name: 'MT-10' }, { name: 'NMAX' }, { name: 'R1' },
      { name: 'R125' }, { name: 'R3' }, { name: 'R6' }, { name: 'R7' },
      { name: 'Tenere 700' }, { name: 'TMAX' }, { name: 'Tracer 7' }, { name: 'Tracer 9' },
      { name: 'XJ6' }, { name: 'XMax' }, { name: 'XSR' }, { name: 'YZF' }
    ]
  }
];

// ============================================
// TRUCKS
// ============================================
export const TRUCK_MAKES: VehicleMake[] = [
  {
    id: 'daf',
    name: 'DAF',
    country: 'Netherlands',
    models: [
      { name: 'CF' }, { name: 'LF' }, { name: 'XD' }, { name: 'XF' }, { name: 'XG' }, { name: 'XG+' }
    ]
  },
  {
    id: 'iveco',
    name: 'Iveco',
    country: 'Italy',
    models: [
      { name: 'Daily' }, { name: 'Eurocargo' }, { name: 'S-Way' }, { name: 'Stralis' },
      { name: 'T-Way' }, { name: 'Trakker' }, { name: 'X-Way' }
    ]
  },
  {
    id: 'man',
    name: 'MAN',
    country: 'Germany',
    models: [
      { name: 'TGE' }, { name: 'TGL' }, { name: 'TGM' }, { name: 'TGS' }, { name: 'TGX' }
    ]
  },
  {
    id: 'mercedes-truck',
    name: 'Mercedes-Benz Trucks',
    country: 'Germany',
    models: [
      { name: 'Actros' }, { name: 'Antos' }, { name: 'Arocs' }, { name: 'Atego' },
      { name: 'Axor' }, { name: 'eActros' }, { name: 'Econic' }, { name: 'Sprinter' },
      { name: 'Unimog' }
    ]
  },
  {
    id: 'renault-trucks',
    name: 'Renault Trucks',
    country: 'France',
    models: [
      { name: 'C' }, { name: 'D' }, { name: 'D Wide' }, { name: 'K' }, { name: 'Master' },
      { name: 'T' }, { name: 'T High' }
    ]
  },
  {
    id: 'scania',
    name: 'Scania',
    country: 'Sweden',
    models: [
      { name: 'G Series' }, { name: 'L Series' }, { name: 'P Series' }, { name: 'R Series' },
      { name: 'S Series' }
    ]
  },
  {
    id: 'volvo-trucks',
    name: 'Volvo Trucks',
    country: 'Sweden',
    models: [
      { name: 'FE' }, { name: 'FH' }, { name: 'FH16' }, { name: 'FL' }, { name: 'FM' },
      { name: 'FMX' }, { name: 'VNL' }, { name: 'VNR' }
    ]
  }
];

// ============================================
// VANS
// ============================================
export const VAN_MAKES: VehicleMake[] = [
  {
    id: 'citroen-van',
    name: 'Citroën',
    country: 'France',
    models: [
      { name: 'Berlingo' }, { name: 'Dispatch' }, { name: 'Jumper' }, { name: 'Jumpy' },
      { name: 'Nemo' }, { name: 'SpaceTourer' }
    ]
  },
  {
    id: 'fiat-van',
    name: 'Fiat Professional',
    country: 'Italy',
    models: [
      { name: 'Doblo' }, { name: 'Ducato' }, { name: 'Fiorino' }, { name: 'Scudo' },
      { name: 'Talento' }
    ]
  },
  {
    id: 'ford-van',
    name: 'Ford',
    country: 'USA',
    models: [
      { name: 'Transit' }, { name: 'Transit Connect' }, { name: 'Transit Custom' },
      { name: 'Transit Courier' }, { name: 'Tourneo Connect' }, { name: 'Tourneo Custom' }
    ]
  },
  {
    id: 'iveco-van',
    name: 'Iveco',
    country: 'Italy',
    models: [
      { name: 'Daily' }
    ]
  },
  {
    id: 'mercedes-van',
    name: 'Mercedes-Benz',
    country: 'Germany',
    models: [
      { name: 'Citan' }, { name: 'eSprinter' }, { name: 'eVito' }, { name: 'Sprinter' },
      { name: 'V-Class' }, { name: 'Vito' }
    ]
  },
  {
    id: 'opel-van',
    name: 'Opel',
    country: 'Germany',
    models: [
      { name: 'Combo' }, { name: 'Movano' }, { name: 'Vivaro' }
    ]
  },
  {
    id: 'peugeot-van',
    name: 'Peugeot',
    country: 'France',
    models: [
      { name: 'Boxer' }, { name: 'Expert' }, { name: 'Partner' }, { name: 'Rifter' }
    ]
  },
  {
    id: 'renault-van',
    name: 'Renault',
    country: 'France',
    models: [
      { name: 'Express' }, { name: 'Kangoo' }, { name: 'Master' }, { name: 'Trafic' }
    ]
  },
  {
    id: 'volkswagen-van',
    name: 'Volkswagen',
    country: 'Germany',
    models: [
      { name: 'Caddy' }, { name: 'California' }, { name: 'Caravelle' }, { name: 'Crafter' },
      { name: 'ID. Buzz' }, { name: 'Multivan' }, { name: 'Transporter' }
    ]
  }
];

// ============================================
// TRAILERS
// ============================================
export const TRAILER_MAKES: VehicleMake[] = [
  {
    id: 'brenderup',
    name: 'Brenderup',
    country: 'Denmark',
    models: [
      { name: 'Box Trailer' }, { name: 'Car Transporter' }, { name: 'Flatbed' }, { name: 'Tilt Trailer' }
    ]
  },
  {
    id: 'humbaur',
    name: 'Humbaur',
    country: 'Germany',
    models: [
      { name: 'Box Trailer' }, { name: 'Car Transporter' }, { name: 'Cattle Trailer' },
      { name: 'Flatbed' }, { name: 'Horse Trailer' }, { name: 'Motorcycle Trailer' }
    ]
  },
  {
    id: 'ifor-williams',
    name: 'Ifor Williams',
    country: 'UK',
    models: [
      { name: 'Box Van' }, { name: 'Car Transporter' }, { name: 'Flatbed' },
      { name: 'Horse Trailer' }, { name: 'Livestock' }, { name: 'Tipper' }
    ]
  },
  {
    id: 'krone',
    name: 'Krone',
    country: 'Germany',
    models: [
      { name: 'Box' }, { name: 'Curtainsider' }, { name: 'Flatbed' }, { name: 'Mega Liner' },
      { name: 'Profi Liner' }, { name: 'Refrigerated' }
    ]
  },
  {
    id: 'schmitz-cargobull',
    name: 'Schmitz Cargobull',
    country: 'Germany',
    models: [
      { name: 'Box' }, { name: 'Curtainsider' }, { name: 'Flatbed' }, { name: 'Mega' },
      { name: 'Reefer' }, { name: 'Tipper' }
    ]
  }
];

// ============================================
// CARAVANS & MOTORHOMES
// ============================================
export const CARAVAN_MAKES: VehicleMake[] = [
  {
    id: 'adria',
    name: 'Adria',
    country: 'Slovenia',
    models: [
      { name: 'Action' }, { name: 'Adora' }, { name: 'Alpina' }, { name: 'Altea' }, { name: 'Aviva' }
    ]
  },
  {
    id: 'bailey',
    name: 'Bailey',
    country: 'UK',
    models: [
      { name: 'Alicanto' }, { name: 'Discovery' }, { name: 'Phoenix' }, { name: 'Pegasus' }, { name: 'Pursuit' }
    ]
  },
  {
    id: 'burstner',
    name: 'Bürstner',
    country: 'Germany',
    models: [
      { name: 'Averso' }, { name: 'Premio' }, { name: 'Premio Life' }
    ]
  },
  {
    id: 'dethleffs',
    name: 'Dethleffs',
    country: 'Germany',
    models: [
      { name: 'Beduin' }, { name: 'C\'go' }, { name: 'Camper' }, { name: 'Nomad' }
    ]
  },
  {
    id: 'fendt',
    name: 'Fendt',
    country: 'Germany',
    models: [
      { name: 'Bianco' }, { name: 'Diamant' }, { name: 'Opal' }, { name: 'Saphir' }, { name: 'Tendenza' }
    ]
  },
  {
    id: 'hobby',
    name: 'Hobby',
    country: 'Germany',
    models: [
      { name: 'De Luxe' }, { name: 'Excellent' }, { name: 'Maxia' }, { name: 'OnTour' }, { name: 'Prestige' }
    ]
  },
  {
    id: 'knaus',
    name: 'Knaus',
    country: 'Germany',
    models: [
      { name: 'Deseo' }, { name: 'Sport' }, { name: 'Südwind' }, { name: 'Travelino' }
    ]
  },
  {
    id: 'sprite',
    name: 'Sprite',
    country: 'UK',
    models: [
      { name: 'Alpine' }, { name: 'Cruzer' }, { name: 'Quattro' }, { name: 'Super Quattro' }
    ]
  },
  {
    id: 'swift',
    name: 'Swift',
    country: 'UK',
    models: [
      { name: 'Challenger' }, { name: 'Conqueror' }, { name: 'Elegance' }, { name: 'Sprite' }
    ]
  },
  {
    id: 'tabbert',
    name: 'Tabbert',
    country: 'Germany',
    models: [
      { name: 'Da Vinci' }, { name: 'Pep' }, { name: 'Puccini' }, { name: 'Rossini' }
    ]
  }
];

export const MOTORHOME_MAKES: VehicleMake[] = [
  {
    id: 'adria-mh',
    name: 'Adria',
    country: 'Slovenia',
    models: [
      { name: 'Compact' }, { name: 'Coral' }, { name: 'Matrix' }, { name: 'Sonic' }, { name: 'Twin' }
    ]
  },
  {
    id: 'autotrail',
    name: 'Auto-Trail',
    country: 'UK',
    models: [
      { name: 'Apache' }, { name: 'Delaware' }, { name: 'F-Line' }, { name: 'Frontier' }, { name: 'Tribute' }
    ]
  },
  {
    id: 'burstner-mh',
    name: 'Bürstner',
    country: 'Germany',
    models: [
      { name: 'Campeo' }, { name: 'Elegance' }, { name: 'Ixeo' }, { name: 'Lyseo' }, { name: 'Nexxo' }, { name: 'Travel Van' }
    ]
  },
  {
    id: 'carthago',
    name: 'Carthago',
    country: 'Germany',
    models: [
      { name: 'C-Compactline' }, { name: 'C-Tourer' }, { name: 'Chic C-Line' }, { name: 'Chic E-Line' }, { name: 'Liner' }
    ]
  },
  {
    id: 'chausson',
    name: 'Chausson',
    country: 'France',
    models: [
      { name: 'Flash' }, { name: 'Titanium' }, { name: 'Twist' }, { name: 'Welcome' }
    ]
  },
  {
    id: 'dethleffs-mh',
    name: 'Dethleffs',
    country: 'Germany',
    models: [
      { name: 'Advantage' }, { name: 'Esprit' }, { name: 'Globebus' }, { name: 'Pulse' }, { name: 'Trend' }
    ]
  },
  {
    id: 'hymer',
    name: 'Hymer',
    country: 'Germany',
    models: [
      { name: 'B-Klasse' }, { name: 'Exsis' }, { name: 'ML' }, { name: 'T-Klasse' }, { name: 'Venture' }
    ]
  },
  {
    id: 'knaus-mh',
    name: 'Knaus',
    country: 'Germany',
    models: [
      { name: 'BoxStar' }, { name: 'L!ve' }, { name: 'Sky' }, { name: 'Sun' }, { name: 'Van' }
    ]
  },
  {
    id: 'laika',
    name: 'Laika',
    country: 'Italy',
    models: [
      { name: 'Ecovip' }, { name: 'Kosmo' }, { name: 'Kreos' }
    ]
  },
  {
    id: 'pilote',
    name: 'Pilote',
    country: 'France',
    models: [
      { name: 'Galaxy' }, { name: 'Pacific' }, { name: 'Reference' }, { name: 'Van' }
    ]
  },
  {
    id: 'rapido',
    name: 'Rapido',
    country: 'France',
    models: [
      { name: 'Distinction' }, { name: 'M' }, { name: 'V' }
    ]
  }
];

// ============================================
// CONSTRUCTION MACHINERY
// ============================================
export const CONSTRUCTION_MAKES: VehicleMake[] = [
  {
    id: 'bobcat',
    name: 'Bobcat',
    country: 'USA',
    models: [
      { name: 'Compact Excavator' }, { name: 'Compact Track Loader' }, { name: 'Mini Excavator' },
      { name: 'Skid-Steer Loader' }, { name: 'Telehandler' }
    ]
  },
  {
    id: 'case',
    name: 'Case',
    country: 'USA',
    models: [
      { name: 'Backhoe Loader' }, { name: 'Crawler Excavator' }, { name: 'Mini Excavator' },
      { name: 'Skid Steer' }, { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar',
    country: 'USA',
    models: [
      { name: 'Backhoe Loader' }, { name: 'Bulldozer' }, { name: 'Excavator' },
      { name: 'Mini Excavator' }, { name: 'Motor Grader' }, { name: 'Skid Steer' },
      { name: 'Telehandler' }, { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'hitachi',
    name: 'Hitachi',
    country: 'Japan',
    models: [
      { name: 'Crawler Excavator' }, { name: 'Mini Excavator' }, { name: 'Wheel Excavator' },
      { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'jcb',
    name: 'JCB',
    country: 'UK',
    models: [
      { name: 'Backhoe Loader' }, { name: 'Compact Excavator' }, { name: 'Loadall' },
      { name: 'Mini Excavator' }, { name: 'Skid Steer' }, { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'komatsu',
    name: 'Komatsu',
    country: 'Japan',
    models: [
      { name: 'Bulldozer' }, { name: 'Crawler Excavator' }, { name: 'Mini Excavator' },
      { name: 'Motor Grader' }, { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'liebherr',
    name: 'Liebherr',
    country: 'Germany',
    models: [
      { name: 'Crane' }, { name: 'Crawler Excavator' }, { name: 'Mini Excavator' },
      { name: 'Tower Crane' }, { name: 'Wheel Excavator' }, { name: 'Wheel Loader' }
    ]
  },
  {
    id: 'volvo-ce',
    name: 'Volvo Construction',
    country: 'Sweden',
    models: [
      { name: 'Articulated Hauler' }, { name: 'Compact Excavator' }, { name: 'Crawler Excavator' },
      { name: 'Skid Steer' }, { name: 'Wheel Excavator' }, { name: 'Wheel Loader' }
    ]
  }
];

// ============================================
// AGRICULTURAL MACHINERY
// ============================================
export const AGRICULTURAL_MAKES: VehicleMake[] = [
  {
    id: 'case-ih',
    name: 'Case IH',
    country: 'USA',
    models: [
      { name: 'Combine Harvester' }, { name: 'Maxxum' }, { name: 'Optum' },
      { name: 'Puma' }, { name: 'Quadtrac' }, { name: 'Steiger' }
    ]
  },
  {
    id: 'claas',
    name: 'Claas',
    country: 'Germany',
    models: [
      { name: 'Arion' }, { name: 'Axion' }, { name: 'Jaguar' }, { name: 'Lexion' },
      { name: 'Tucano' }, { name: 'Xerion' }
    ]
  },
  {
    id: 'deutz-fahr',
    name: 'Deutz-Fahr',
    country: 'Germany',
    models: [
      { name: 'Agrofarm' }, { name: 'Agroplus' }, { name: 'Agrotron' }, { name: 'C9000' }
    ]
  },
  {
    id: 'fendt-ag',
    name: 'Fendt',
    country: 'Germany',
    models: [
      { name: '200 Vario' }, { name: '300 Vario' }, { name: '500 Vario' },
      { name: '700 Vario' }, { name: '900 Vario' }, { name: '1000 Vario' }, { name: 'Ideal' }
    ]
  },
  {
    id: 'john-deere',
    name: 'John Deere',
    country: 'USA',
    models: [
      { name: '5R Series' }, { name: '6M Series' }, { name: '6R Series' },
      { name: '7R Series' }, { name: '8R Series' }, { name: '9R Series' },
      { name: 'S Series Combine' }, { name: 'T Series Combine' }, { name: 'W Series Combine' }
    ]
  },
  {
    id: 'kubota',
    name: 'Kubota',
    country: 'Japan',
    models: [
      { name: 'L Series' }, { name: 'M Series' }, { name: 'M7 Series' }
    ]
  },
  {
    id: 'massey-ferguson',
    name: 'Massey Ferguson',
    country: 'USA',
    models: [
      { name: '4700' }, { name: '5700' }, { name: '6700' }, { name: '7700' }, { name: '8700' },
      { name: 'Activa' }, { name: 'Delta' }, { name: 'Ideal' }
    ]
  },
  {
    id: 'new-holland',
    name: 'New Holland',
    country: 'Italy',
    models: [
      { name: 'CR Combine' }, { name: 'CX Combine' }, { name: 'T4' }, { name: 'T5' },
      { name: 'T6' }, { name: 'T7' }, { name: 'T8' }, { name: 'T9' }
    ]
  },
  {
    id: 'valtra',
    name: 'Valtra',
    country: 'Finland',
    models: [
      { name: 'A Series' }, { name: 'G Series' }, { name: 'N Series' },
      { name: 'Q Series' }, { name: 'S Series' }, { name: 'T Series' }
    ]
  }
];

// ============================================
// FORKLIFTS
// ============================================
export const FORKLIFT_MAKES: VehicleMake[] = [
  {
    id: 'crown',
    name: 'Crown',
    country: 'USA',
    models: [
      { name: 'Counterbalance' }, { name: 'Order Picker' }, { name: 'Pallet Truck' },
      { name: 'Reach Truck' }, { name: 'Stacker' }
    ]
  },
  {
    id: 'hyster',
    name: 'Hyster',
    country: 'USA',
    models: [
      { name: 'Counterbalance Electric' }, { name: 'Counterbalance IC' },
      { name: 'Pallet Jack' }, { name: 'Reach Truck' }, { name: 'Warehouse' }
    ]
  },
  {
    id: 'jungheinrich',
    name: 'Jungheinrich',
    country: 'Germany',
    models: [
      { name: 'Counterbalance' }, { name: 'Order Picker' }, { name: 'Pallet Truck' },
      { name: 'Reach Truck' }, { name: 'Stacker' }
    ]
  },
  {
    id: 'linde',
    name: 'Linde',
    country: 'Germany',
    models: [
      { name: 'Counterbalance Electric' }, { name: 'Counterbalance IC' },
      { name: 'Order Picker' }, { name: 'Pallet Truck' }, { name: 'Reach Truck' },
      { name: 'Stacker' }, { name: 'Tow Tractor' }
    ]
  },
  {
    id: 'still',
    name: 'Still',
    country: 'Germany',
    models: [
      { name: 'Counterbalance' }, { name: 'Order Picker' }, { name: 'Pallet Truck' },
      { name: 'Reach Truck' }, { name: 'Stacker' }, { name: 'Tow Tractor' }
    ]
  },
  {
    id: 'toyota-forklift',
    name: 'Toyota Material Handling',
    country: 'Japan',
    models: [
      { name: 'Counterbalance Electric' }, { name: 'Counterbalance IC' },
      { name: 'Order Picker' }, { name: 'Pallet Jack' }, { name: 'Reach Truck' },
      { name: 'Stacker' }
    ]
  },
  {
    id: 'yale',
    name: 'Yale',
    country: 'USA',
    models: [
      { name: 'Counterbalance Electric' }, { name: 'Counterbalance IC' },
      { name: 'Pallet Truck' }, { name: 'Reach Truck' }, { name: 'Stacker' }
    ]
  }
];

// ============================================
// BOATS
// ============================================
export const BOAT_MAKES: VehicleMake[] = [
  {
    id: 'bayliner',
    name: 'Bayliner',
    country: 'USA',
    models: [
      { name: 'Bowrider' }, { name: 'Cruiser' }, { name: 'Deck Boat' }, { name: 'Trophy' }
    ]
  },
  {
    id: 'beneteau',
    name: 'Beneteau',
    country: 'France',
    models: [
      { name: 'Antares' }, { name: 'Barracuda' }, { name: 'Flyer' },
      { name: 'Gran Turismo' }, { name: 'Monte Carlo' }, { name: 'Swift Trawler' }
    ]
  },
  {
    id: 'boston-whaler',
    name: 'Boston Whaler',
    country: 'USA',
    models: [
      { name: 'Conquest' }, { name: 'Dauntless' }, { name: 'Montauk' }, { name: 'Outrage' }
    ]
  },
  {
    id: 'jeanneau',
    name: 'Jeanneau',
    country: 'France',
    models: [
      { name: 'Cap Camarat' }, { name: 'Leader' }, { name: 'Merry Fisher' }, { name: 'NC' }
    ]
  },
  {
    id: 'quicksilver',
    name: 'Quicksilver',
    country: 'UK',
    models: [
      { name: 'Activ' }, { name: 'Captur' }, { name: 'Commander' }, { name: 'Weekend' }
    ]
  },
  {
    id: 'sea-ray',
    name: 'Sea Ray',
    country: 'USA',
    models: [
      { name: 'Bowrider' }, { name: 'Cruiser' }, { name: 'Fly' },
      { name: 'Sundancer' }, { name: 'Sundeck' }
    ]
  },
  {
    id: 'yamaha-boat',
    name: 'Yamaha Boats',
    country: 'Japan',
    models: [
      { name: 'AR' }, { name: 'FSH' }, { name: 'Jet Boat' }, { name: 'SX' }
    ]
  }
];

// ============================================
// ATV & QUAD
// ============================================
export const ATV_MAKES: VehicleMake[] = [
  {
    id: 'can-am',
    name: 'Can-Am',
    country: 'Canada',
    models: [
      { name: 'Defender' }, { name: 'Maverick' }, { name: 'Outlander' }, { name: 'Renegade' }
    ]
  },
  {
    id: 'cfmoto',
    name: 'CFMoto',
    country: 'China',
    models: [
      { name: 'CForce' }, { name: 'UForce' }, { name: 'ZForce' }
    ]
  },
  {
    id: 'honda-atv',
    name: 'Honda ATV',
    country: 'Japan',
    models: [
      { name: 'FourTrax' }, { name: 'Pioneer' }, { name: 'Rancher' },
      { name: 'Rubicon' }, { name: 'Talon' }, { name: 'TRX' }
    ]
  },
  {
    id: 'kawasaki-atv',
    name: 'Kawasaki',
    country: 'Japan',
    models: [
      { name: 'Brute Force' }, { name: 'KFX' }, { name: 'Mule' },
      { name: 'Teryx' }, { name: 'Teryx KRX' }
    ]
  },
  {
    id: 'polaris',
    name: 'Polaris',
    country: 'USA',
    models: [
      { name: 'General' }, { name: 'Ranger' }, { name: 'RZR' },
      { name: 'Scrambler' }, { name: 'Sportsman' }
    ]
  },
  {
    id: 'suzuki-atv',
    name: 'Suzuki ATV',
    country: 'Japan',
    models: [
      { name: 'KingQuad' }, { name: 'LT-Z' }, { name: 'QuadSport' }
    ]
  },
  {
    id: 'yamaha-atv',
    name: 'Yamaha ATV',
    country: 'Japan',
    models: [
      { name: 'Grizzly' }, { name: 'Kodiak' }, { name: 'Raptor' },
      { name: 'Viking' }, { name: 'Wolverine' }, { name: 'YXZ' }
    ]
  }
];

// ============================================
// CATEGORY TO MAKES MAPPING
// ============================================
export const VEHICLE_DATA: Record<string, VehicleMake[]> = {
  car: CAR_MAKES,
  motorcycle: MOTORCYCLE_MAKES,
  truck: TRUCK_MAKES,
  van: VAN_MAKES,
  trailer: TRAILER_MAKES,
  caravan: CARAVAN_MAKES,
  motorhome: MOTORHOME_MAKES,
  construction: CONSTRUCTION_MAKES,
  agricultural: AGRICULTURAL_MAKES,
  forklift: FORKLIFT_MAKES,
  boat: BOAT_MAKES,
  atv: ATV_MAKES,
  quad: ATV_MAKES, // Same as ATV
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getMakesByCategory(category: string): VehicleMake[] {
  return VEHICLE_DATA[category.toLowerCase()] || [];
}

export function getModelsByMake(category: string, makeId: string): VehicleModel[] {
  const makes = getMakesByCategory(category);
  const make = makes.find(m => m.id === makeId);
  return make?.models || [];
}

export function getMakeById(category: string, makeId: string): VehicleMake | undefined {
  const makes = getMakesByCategory(category);
  return makes.find(m => m.id === makeId);
}

export function getAllMakes(): VehicleMake[] {
  const allMakes: VehicleMake[] = [];
  Object.values(VEHICLE_DATA).forEach(makes => {
    makes.forEach(make => {
      if (!allMakes.find(m => m.id === make.id)) {
        allMakes.push(make);
      }
    });
  });
  return allMakes.sort((a, b) => a.name.localeCompare(b.name));
}
