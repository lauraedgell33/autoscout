# Backend Architecture - Cookie Consent & Favorites

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js/React)                     │
│                                                                       │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │  Cookie Consent UI   │         │   Favorites UI       │          │
│  │  - Banner/Modal      │         │   - Heart Icon       │          │
│  │  - Preferences       │         │   - Favorites List   │          │
│  └──────────────────────┘         └──────────────────────┘          │
└────────────┬────────────────────────────────┬─────────────────────────┘
             │                                │
             │ HTTP/JSON                      │ HTTP/JSON + JWT
             │ + Cookies                      │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LARAVEL BACKEND API (routes/api.php)             │
│                                                                       │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  Cookie Consent Routes         │  │  Favorites Routes        │  │
│  │  (Public)                      │  │  (Protected)             │  │
│  │                                │  │                          │  │
│  │  GET  /api/cookies/preferences │  │  GET    /api/favorites   │  │
│  │  POST /api/cookies/preferences │  │  POST   /api/favorites   │  │
│  │  POST /api/cookies/accept-all  │  │  DELETE /api/favorites/  │  │
│  │  POST /api/cookies/accept-     │  │         {vehicle_id}     │  │
│  │       essential                │  │  GET    /api/favorites/  │  │
│  │                                │  │         check/{id}       │  │
│  └────────────┬───────────────────┘  └──────────┬───────────────┘  │
│               │                                   │                  │
│               ▼                                   ▼                  │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  CookieConsentController       │  │  FavoritesController     │  │
│  │  (Api namespace)               │  │  (API namespace)         │  │
│  │                                │  │                          │  │
│  │  • show()                      │  │  • index()               │  │
│  │  • update()                    │  │  • store()               │  │
│  │  • acceptAll()                 │  │  • destroy()             │  │
│  │  • acceptEssential()           │  │  • check()               │  │
│  │                                │  │                          │  │
│  │  ✨ Returns cookie in response │  │  ✨ Full CRUD + logging  │  │
│  └────────────┬───────────────────┘  └──────────┬───────────────┘  │
│               │                                   │                  │
│               ▼                                   ▼                  │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  CookieService                 │  │  Eloquent Models         │  │
│  │                                │  │                          │  │
│  │  • getOrCreatePreference()     │  │  • Favorite              │  │
│  │  • updatePreferences()         │  │  • User                  │  │
│  │  • acceptAll()                 │  │  • Vehicle               │  │
│  │  • acceptEssentialOnly()       │  │                          │  │
│  └────────────┬───────────────────┘  └──────────┬───────────────┘  │
│               │                                   │                  │
└───────────────┼───────────────────────────────────┼──────────────────┘
                │                                   │
                ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL DATABASE                               │
│                                                                       │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  cookie_preferences            │  │  favorites               │  │
│  │  ────────────────────────────  │  │  ──────────────────────  │  │
│  │  • id (PK)                     │  │  • id (PK)               │  │
│  │  • user_id (FK, nullable)      │  │  • user_id (FK)          │  │
│  │  • session_id (UUID)           │  │  • vehicle_id (FK)       │  │
│  │  • essential (boolean)         │  │  • created_at            │  │
│  │  • functional (boolean)        │  │  • updated_at            │  │
│  │  • analytics (boolean)         │  │                          │  │
│  │  • marketing (boolean)         │  │  UNIQUE(user_id,         │  │
│  │  • accepted_at                 │  │         vehicle_id)      │  │
│  │  • expires_at                  │  │                          │  │
│  │  • ip_address                  │  │  CASCADE on delete       │  │
│  │  • user_agent                  │  │                          │  │
│  └────────────────────────────────┘  └──────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  users                         │  │  vehicles                │  │
│  │  (existing table)              │  │  (existing table)        │  │
│  └────────────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Cookie Consent Flow
```
1. User visits site → Frontend requests /api/cookies/preferences
2. Backend creates/retrieves CookiePreference
3. Backend returns JSON + Sets cookie_consent_id cookie
4. Frontend displays consent banner with current preferences
5. User accepts all → Frontend POSTs to /api/cookies/accept-all
6. Backend updates preferences + Returns cookie_consent_id
7. Frontend stores consent state, hides banner
```

### Favorites Flow
```
1. User clicks ❤️ on vehicle → Frontend POSTs to /api/favorites
   Body: { "vehicle_id": 123 }
2. Backend validates auth token (JWT)
3. Backend checks if vehicle exists
4. Backend creates Favorite record (if not exists)
5. Backend returns Favorite with vehicle data
6. Frontend updates UI to show filled heart

To remove:
1. User clicks ❤️ again → Frontend DELETEs /api/favorites/123
2. Backend validates auth + ownership
3. Backend deletes Favorite record
4. Frontend updates UI to show empty heart
```

## Security Features

### Cookie Consent
- ✅ Cookie set with `secure` flag (HTTPS only)
- ✅ Cookie set with `httpOnly` flag (no JS access)
- ✅ Cookie uses `SameSite=lax` policy
- ✅ 1-year expiration (525600 minutes)
- ✅ UUID-based session_id for tracking

### Favorites
- ✅ All endpoints require authentication (Sanctum JWT)
- ✅ Users can only manage their own favorites
- ✅ Database foreign key constraints
- ✅ Unique constraint prevents duplicates
- ✅ Cascade delete on user/vehicle deletion
- ✅ Comprehensive logging for debugging
- ✅ Error handling with try-catch blocks

## Relationships

```
User (1) ───< HasMany >─── (N) Favorite (N) ───< BelongsTo >─── (1) Vehicle
    │                           │                                    │
    │                           │                                    │
    └─── Can have many favorites─┘                                   │
                                                                      │
                                └───── Each favorite is for one vehicle

User.favorites → Collection of Favorite models
Vehicle.favorites → Collection of Favorite models
Favorite.user → User model
Favorite.vehicle → Vehicle model
```

## Test Coverage

### Cookie Consent Tests (5 tests)
```php
✓ test_show_preferences_returns_cookie()
✓ test_update_preferences_returns_cookie()
✓ test_accept_all_returns_cookie()
✓ test_accept_essential_returns_cookie()
✓ test_cookie_preferences_persist()
```

### Favorites Tests (11 tests)
```php
✓ test_authenticated_user_can_view_favorites()
✓ test_unauthenticated_user_cannot_access_favorites()
✓ test_user_can_add_vehicle_to_favorites()
✓ test_adding_duplicate_favorite_returns_existing()
✓ test_user_can_remove_vehicle_from_favorites()
✓ test_removing_non_existent_favorite_returns_404()
✓ test_user_can_check_if_vehicle_is_favorited()
✓ test_check_returns_false_for_non_favorited_vehicle()
✓ test_adding_non_existent_vehicle_to_favorites_fails()
✓ test_favorites_include_vehicle_data()
```

## Performance Optimizations

### Database Indexes
```sql
-- Favorites table
INDEX idx_user_id (user_id)        -- Fast lookup by user
INDEX idx_vehicle_id (vehicle_id)  -- Fast lookup by vehicle
UNIQUE KEY unique_user_vehicle (user_id, vehicle_id)  -- Prevent duplicates
```

### Query Optimization
- Eager loading of relationships (`with(['vehicle', 'dealer', 'seller'])`)
- Selective column loading (only needed fields)
- Indexed foreign keys for fast joins
- Unique constraints at database level

## Deployment Checklist

- [ ] Run migration: `php artisan migrate`
- [ ] Clear all caches
- [ ] Run tests: `php artisan test`
- [ ] Update API documentation
- [ ] Test in staging environment
- [ ] Monitor Laravel logs
- [ ] Update frontend to use new endpoints
- [ ] Test cookie consent flow end-to-end
- [ ] Test favorites flow end-to-end
- [ ] Verify HTTPS cookies work in production
- [ ] Check database indexes are created
