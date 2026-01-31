# AutoScout24 SafeTrade - Documentation

## 📋 Overview
AutoScout24 SafeTrade is a secure vehicle marketplace platform with escrow payment protection. Built with Next.js 16 frontend and Laravel 11 backend.

---

## 🏗️ Architecture

### Frontend Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **State Management:** Zustand + React Context
- **Internationalization:** next-intl (7 languages)
- **Icons:** Lucide React

### Backend Stack
- **Framework:** Laravel 11
- **Database:** MySQL/PostgreSQL
- **Admin Panel:** Filament
- **Authentication:** Laravel Sanctum
- **API:** RESTful

---

## 🌍 Supported Languages
- 🇬🇧 English (en)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)
- 🇮🇹 Italian (it)
- 🇳🇱 Dutch (nl)
- 🇷🇴 Romanian (ro)

---

## 💱 Supported Currencies (26+)

### Major Currencies
| Code | Symbol | Name | Country |
|------|--------|------|---------|
| EUR | € | Euro | Eurozone |
| USD | $ | US Dollar | United States |
| GBP | £ | British Pound | United Kingdom |
| CHF | Fr. | Swiss Franc | Switzerland |

### Nordic Currencies
| Code | Symbol | Name | Country |
|------|--------|------|---------|
| SEK | kr | Swedish Krona | Sweden |
| NOK | kr | Norwegian Krone | Norway |
| DKK | kr | Danish Krone | Denmark |
| ISK | kr | Icelandic Króna | Iceland |

### Central/Eastern European
| Code | Symbol | Name | Country |
|------|--------|------|---------|
| PLN | zł | Polish Zloty | Poland |
| CZK | Kč | Czech Koruna | Czech Republic |
| HUF | Ft | Hungarian Forint | Hungary |
| RON | lei | Romanian Leu | Romania |
| BGN | лв | Bulgarian Lev | Bulgaria |
| UAH | ₴ | Ukrainian Hryvnia | Ukraine |
| MDL | L | Moldovan Leu | Moldova |

### Balkan Currencies
| Code | Symbol | Name | Country |
|------|--------|------|---------|
| RSD | дин | Serbian Dinar | Serbia |
| ALL | L | Albanian Lek | Albania |
| MKD | ден | Macedonian Denar | North Macedonia |
| BAM | KM | Bosnia Mark | Bosnia |
| HRK | kn | Croatian Kuna | Croatia |

### Caucasus & Other
| Code | Symbol | Name | Country |
|------|--------|------|---------|
| GEL | ₾ | Georgian Lari | Georgia |
| AMD | ֏ | Armenian Dram | Armenia |
| AZN | ₼ | Azerbaijani Manat | Azerbaijan |
| TRY | ₺ | Turkish Lira | Turkey |
| RUB | ₽ | Russian Ruble | Russia |
| BYN | Br | Belarusian Ruble | Belarus |

---

## 🚗 Vehicle Categories

See [VEHICLE_CATEGORIES.md](./VEHICLE_CATEGORIES.md) for complete details.

| Category | Makes | Fuel Types | Body Types |
|----------|-------|------------|------------|
| 🚗 Cars | 60+ | 7 | 8 |
| 🏍️ Motorcycles | 17+ | 2 | 8 |
| 🚚 Trucks | 7+ | 5 | 7 |
| 🚐 Vans | 9+ | 5 | 5 |
| 🚛 Trailers | 8+ | - | 7 |
| 🚙 Caravans | 9+ | - | 4 |
| 🏕️ Motorhomes | 9+ | 3 | 5 |
| 🏗️ Construction | 9+ | 2 | 7 |
| 🚜 Agricultural | 8+ | 2 | 6 |
| 🔧 Forklifts | 9+ | 3 | 5 |
| ⛵ Boats | 10+ | 3 | 7 |
| 🏁 ATV/Quad | 7+ | 2 | 4 |

---

## 📁 Project Structure

```
scout-safe-pay-frontend/
├── src/
│   ├── app/[locale]/           # Pages (App Router)
│   │   ├── marketplace/        # Vehicle marketplace
│   │   ├── dashboard/          # User dashboards
│   │   ├── admin/              # Admin redirect
│   │   └── ...
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── filters/            # Filter components
│   │   ├── vehicle/            # Vehicle components
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx
│   │   └── CurrencyContext.tsx
│   ├── lib/
│   │   ├── api/                # API services
│   │   ├── data/               # Static data (vehicleData)
│   │   └── constants/          # Constants
│   └── messages/               # i18n translations
├── docs/                       # Documentation
└── public/                     # Static assets

scout-safe-pay-backend/
├── app/
│   ├── Http/Controllers/API/   # API Controllers
│   ├── Models/                 # Eloquent Models
│   └── Filament/               # Admin Panel
├── config/
│   ├── vehicles.php            # Vehicle makes/models
│   └── currencies.php          # Currency config
├── routes/
│   └── api.php                 # API routes
└── tests/                      # PHPUnit tests
```

---

## 🔐 Authentication

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password |
| Buyer | buyer@test.com | password |
| Seller | seller@test.com | password |

### Auth Flow
1. User registers/logs in via `/api/login`
2. Receives Sanctum token
3. Token stored in localStorage
4. Sent in Authorization header for protected routes

---

## 🎨 Theming

### Dark/Light Mode
- Uses `next-themes` package
- System preference detection
- Manual toggle in header
- Persists to localStorage

### CSS Variables
```css
--color-primary: #1e40af;
--color-accent: #f97316;
--color-success: #22c55e;
--color-error: #ef4444;
```

---

## 📱 Key Features

### For Buyers
- Browse vehicles by category
- Advanced search filters
- Multi-currency display
- Secure escrow payments
- Transaction tracking

### For Sellers
- List vehicles with images
- Manage listings
- Bank account management
- Sales analytics
- Transaction history

### For Admin
- Filament admin panel
- User management
- Vehicle moderation
- Payment verification
- Dispute resolution

---

## 🔗 API Endpoints

### Public Routes
```
GET  /api/health                    - Health check
GET  /api/vehicles                  - List vehicles
GET  /api/vehicles/{id}             - Get vehicle
GET  /api/vehicle-data/categories   - Get categories
GET  /api/vehicle-data/makes/{cat}  - Get makes
GET  /api/dealers                   - List dealers
```

### Protected Routes (require auth)
```
GET  /api/user                      - Current user
POST /api/vehicles                  - Create vehicle
PUT  /api/vehicles/{id}             - Update vehicle
GET  /api/transactions              - List transactions
POST /api/transactions              - Create transaction
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- MySQL/PostgreSQL
- Composer

### Frontend Setup
```bash
cd scout-safe-pay-frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend Setup
```bash
cd scout-safe-pay-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 📞 Support
For issues or questions, contact the development team.
