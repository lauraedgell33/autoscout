# 🚗 AutoScout24 SafeTrade Payment System

A comprehensive vehicle marketplace with secure escrow payment protection.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.x-000000.svg)
![Filament](https://img.shields.io/badge/Filament-4.5-F59E0B.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Admin Panel](#-admin-panel)
- [API Testing](#-api-testing)
- [Development](#-development)

---

## ✨ Features

### 🛒 Marketplace
- ✅ Vehicle listings with advanced search & filters
- ✅ Dealer profiles and ratings
- ✅ Vehicle detail pages with image galleries
- ✅ Contact seller functionality
- ✅ Saved searches and price alerts

### 🔐 Authentication & User Management
- ✅ User registration (Buyer/Seller)
- ✅ JWT-based authentication
- ✅ Email verification
- ✅ Password reset
- ✅ User profiles with avatars

### 💰 SafeTrade Payment System
- ✅ Escrow payment protection
- ✅ Multiple payment methods (Bank Transfer, Credit Card, PayPal)
- ✅ Transaction management
- ✅ Payment proof upload
- ✅ Automatic fund release
- ✅ Dispute resolution

### 📊 Admin Panel (Filament)
- ✅ Custom AutoScout24 branding
- ✅ Dashboard with 5 advanced charts
- ✅ User management
- ✅ Dealer management
- ✅ Transaction monitoring
- ✅ Payment verification
- ✅ Activity logging
- ✅ Real-time notifications
- ✅ CSV bulk import/export
- ✅ PDF report generation
- ✅ Transaction wizard

### 👥 User Dashboards
- ✅ Buyer dashboard (purchases, watchlist)
- ✅ Seller dashboard (listings, sales)
- ✅ Transaction history
- ✅ Payment tracking
- ✅ Document management
- ✅ Messaging system

---

## 🛠 Tech Stack

### Backend
- **Framework:** Laravel 12.x
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Authentication:** Laravel Sanctum (JWT)
- **Admin Panel:** Filament 4.5.2
- **API:** RESTful JSON API
- **File Storage:** Local (dev) / S3 (prod)
- **Queue:** Redis
- **Cache:** Redis

### Frontend
- **Framework:** Next.js 16.1.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **State Management:** React Context
- **Icons:** Lucide React

### DevOps
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Logging:** Laravel Telescope

---

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm/yarn

### Installation

```bash
# Clone the repository
cd /path/to/scout

# Start everything with one command
./start-servers.sh
```

That's it! The application will be running at:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8002
- **Admin Panel:** http://localhost:8002/admin

### Stop Servers

```bash
./stop-servers.sh
```

---

## 📁 Project Structure

```
scout/
├── scout-safe-pay-backend/      # Laravel Backend
│   ├── app/
│   │   ├── Filament/            # Admin panel resources
│   │   ├── Http/Controllers/    # API controllers
│   │   ├── Models/              # Eloquent models
│   │   ├── Observers/           # Model observers
│   │   └── Notifications/       # Notification classes
│   ├── config/                  # Configuration files
│   ├── database/                # Migrations & seeders
│   ├── routes/                  # API routes
│   └── storage/                 # Logs, uploads, cache
│
├── scout-safe-pay-frontend/     # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities & API client
│   │   └── types/               # TypeScript types
│   ├── public/                  # Static assets
│   └── .env.local               # Environment variables
│
├── start-servers.sh             # Start both servers
├── stop-servers.sh              # Stop both servers
├── test-api.sh                  # API testing script
├── API-DOCUMENTATION.md         # Complete API docs
└── FRONTEND-FIX-GUIDE.md        # Frontend setup guide
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Documentation](scout-safe-pay-backend/API-DOCUMENTATION.md) | Complete REST API reference |
| [Frontend Fix Guide](FRONTEND-FIX-GUIDE.md) | Authentication setup & troubleshooting |
| [Admin Panel Guide](scout-safe-pay-backend/ADMIN-PANEL.md) | Filament admin features |

---

## 🎛 Admin Panel

### Access

**URL:** http://localhost:8002/admin

**Credentials:**
```
Email: admin@autoscout24.com
Password: password
```

### Features

1. **Dashboard**
   - Revenue chart (line)
   - Top dealers chart (bar)
   - Transaction success rate (doughnut)
   - Payment methods distribution (pie)
   - Monthly comparison chart (line)

2. **Resources**
   - **Users:** Complete CRUD, bulk import, filters
   - **Dealers:** Management, export, PDF reports
   - **Transactions:** Wizard, relation managers, tracking
   - **Payments:** Verification, proof upload
   - **Activity Logs:** Real-time monitoring

3. **Advanced Features**
   - Date range filters with quick ranges
   - Bulk CSV import/export
   - PDF report generation
   - Real-time notifications (30s polling)
   - Activity logging with Spatie
   - Transaction creation wizard

---

## 🧪 API Testing

### Automated Testing

```bash
./test-api.sh
```

### Manual Testing

```bash
# Register a new user
curl -X POST http://localhost:8002/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "user_type": "buyer"
  }'

# Login
curl -X POST http://localhost:8002/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'

# Get authenticated user
curl -X GET http://localhost:8002/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💻 Development

### Backend Development

```bash
cd scout-safe-pay-backend

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear cache
php artisan optimize:clear

# Start server
php artisan serve --port=8002
```

### Frontend Development

```bash
cd scout-safe-pay-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

#### Backend (.env)
```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8002

DB_CONNECTION=sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001,localhost:3002
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8002/api
NEXT_PUBLIC_APP_NAME="Scout Safe Pay"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔧 Troubleshooting

### Authentication Issues

1. **Backend not responding:**
   ```bash
   curl http://localhost:8002/api/user
   # Should return: {"message":"Unauthenticated."}
   ```

2. **CORS errors:**
   - Check `scout-safe-pay-backend/config/cors.php`
   - Ensure frontend URL is in `allowed_origins`

3. **Clear cache:**
   ```bash
   cd scout-safe-pay-backend
   php artisan config:clear
   php artisan optimize:clear
   ```

4. **Frontend issues:**
   ```bash
   cd scout-safe-pay-frontend
   rm -rf .next
   npm run dev
   ```

### Database Issues

```bash
# Reset database
cd scout-safe-pay-backend
php artisan migrate:fresh --seed
```

### Port Conflicts

```bash
# Check what's using port 8002
lsof -i :8002

# Check what's using port 3000
lsof -i :3000

# Kill process
kill -9 PID
```

---

## 📊 Status

| Component | Status | Port |
|-----------|--------|------|
| Backend API | ✅ Working | 8002 |
| Frontend | ✅ Working | 3001 |
| Admin Panel | ✅ Working | 8002/admin |
| Authentication | ✅ Fixed | - |
| Transactions | ✅ Working | - |
| Payments | ✅ Working | - |

---

## 🎯 Next Steps

1. ✅ Authentication working
2. ✅ Create Vehicle API (CRUD)
3. ✅ Cookie Management System (Complete with Filament + Frontend Banner)
4. 🔄 Connect marketplace to real data
5. 🔄 Implement payment gateway (Stripe/PayPal)
6. 🔄 Add messaging system
7. 🔄 Implement search engine (Elasticsearch)
8. 🔄 Add review system
9. 🔄 Deploy to production

---

## 📝 License

Proprietary - AutoScout24

---

## 👥 Team

- **Backend:** Laravel 12 + Filament 4.5.2
- **Frontend:** Next.js 16 + TypeScript
- **Admin:** Filament with custom branding

---

## 📞 Support

For issues or questions, check the documentation or contact support@autoscout24.com

---

**Last Updated:** 2026-01-15

**Version:** 1.0.0
