# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AutoScout24 SafeTrade is a vehicle marketplace with secure escrow payment protection. It's a **monorepo** with two main packages:
- `scout-safe-pay-backend/` - Laravel 12 API + Filament 4 admin panel
- `scout-safe-pay-frontend/` - Next.js 16 TypeScript frontend

## Development Commands

### Starting Servers
```bash
# Start both servers (recommended)
./start-servers.sh

# Or start individually:
cd scout-safe-pay-backend && php artisan serve --port=8002
cd scout-safe-pay-frontend && npm run dev  # Runs on port 3002
```

### Backend (Laravel)
```bash
cd scout-safe-pay-backend

# Run all tests
composer test
# Or: php artisan test

# Run specific test file
php artisan test tests/Feature/AuthenticationTest.php

# Run specific test method
php artisan test --filter=test_user_can_login

# Database operations
php artisan migrate
php artisan migrate:fresh --seed  # Reset and seed

# Clear cache
php artisan optimize:clear
```

### Frontend (Next.js)
```bash
cd scout-safe-pay-frontend

# Run unit tests
npm test
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Run E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:headed   # See browser
npm run test:e2e:ui       # Interactive UI

# Linting & type checking
npm run lint
npm run type-check

# Build
npm run build
```

## Architecture

### Backend Structure

**API Controllers** (`app/Http/Controllers/API/`): RESTful controllers handling all API endpoints. Authentication uses Laravel Sanctum with JWT tokens.

**Services** (`app/Services/`): Business logic is extracted into service classes:
- `EscrowAutomationService` - Handles escrow transaction state machine
- `FraudDetectionService` - Transaction fraud analysis
- `ContractGenerator`, `InvoiceGenerator` - PDF document generation
- `IbanValidationService` - Bank account validation
- `PaymentProofValidationService` - Payment proof verification

**Filament Admin** (`app/Filament/`): Admin panel with custom resources for managing users, dealers, transactions, payments, and disputes.

**Models** (`app/Models/`): Key models include `User`, `Vehicle`, `Transaction`, `Payment`, `Dealer`, `Dispute`. Most use Spatie ActivityLog for audit trails.

**Routes**: All API routes are in `routes/api.php`. Protected routes use `auth:sanctum` middleware.

### Frontend Structure

**App Router** (`src/app/[locale]/`): Uses Next.js App Router with `next-intl` for internationalization. All pages are nested under `[locale]` for multi-language support.

**State Management**:
- `src/store/auth-store.ts` - Zustand store for authentication state
- `src/lib/stores/` - Additional stores (cart, filters, UI state)

**API Client** (`src/lib/api-client.ts`): Axios-based client with retry logic, request deduplication, and automatic CSRF token handling.

**Components** (`src/components/`): Organized by feature (auth, dashboard, vehicle, payments, etc.) with shared UI components in `components/ui/` (shadcn/ui).

**Tests**:
- Unit tests: `src/__tests__/` using Jest + React Testing Library
- E2E tests: `e2e/` using Playwright

### Key Data Flows

**Transaction Escrow Flow**: `pending` → `payment_pending` → `payment_verified` → `inspection_scheduled` → `completed` (or `disputed`/`refunded`/`cancelled`)

**User Types**: `buyer`, `seller`, `dealer`, `admin` - stored in `user_type` field and managed with Spatie Permission roles.

## Conventions

### Backend
- API responses follow consistent JSON structure with `data`, `message`, `status` keys
- Use Form Requests for validation (`app/Http/Requests/`)
- Rate limiting is applied to sensitive endpoints via custom `rate.limit.ip` middleware
- Tests extend `Tests\TestCase` which sets up Spatie roles/permissions

### Frontend
- Use `@/` path alias for imports from `src/`
- Components use TypeScript interfaces for props
- API calls go through `apiClient` (not raw axios/fetch)
- Forms use React Hook Form with Zod validation schemas (`src/lib/schemas.ts`)

## Environment

### Backend (.env key variables)
- `DB_CONNECTION=sqlite` (dev) or `pgsql` (prod)
- `SANCTUM_STATEFUL_DOMAINS` - Frontend URLs for cookie auth

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL=http://localhost:8002/api`

## Access Points (Local Dev)

- Frontend: http://localhost:3002
- Backend API: http://localhost:8002/api
- Admin Panel: http://localhost:8002/admin (admin@autoscout24.com / password)
