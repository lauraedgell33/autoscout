# 🚀 Ghid Rapid de Utilizare - API Services

Acest ghid oferă exemple practice de utilizare a serviciilor API în aplicația AutoScout.

---

## 📦 Import Servicii

```typescript
// Import individual
import { authService } from '@/lib/api'
import { vehicleService } from '@/lib/api'

// Import multiple
import { 
  authService, 
  vehicleService, 
  transactionService,
  orderService 
} from '@/lib/api'

// Import toate
import * as api from '@/lib/api'
```

---

## 🔐 Autentificare

### Register
```typescript
import { authService } from '@/lib/api'

const handleRegister = async () => {
  try {
    const response = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      user_type: 'buyer',
      phone: '+40123456789',
      country: 'Romania'
    })
    console.log('User registered:', response.user)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
```

### Login
```typescript
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'john@example.com',
      password: 'password123'
    })
    console.log('Logged in:', response.user)
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### Logout
```typescript
const handleLogout = async () => {
  try {
    await authService.logout()
    // Redirect to home
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
```

### Get Current User
```typescript
const loadUser = async () => {
  try {
    const user = await authService.me()
    console.log('Current user:', user)
  } catch (error) {
    console.error('Failed to load user:', error)
  }
}
```

---

## 🚗 Vehicule

### Listare Vehicule cu Filtre
```typescript
import { vehicleService } from '@/lib/api'

const loadVehicles = async () => {
  try {
    const response = await vehicleService.getVehicles({
      category: 'car',
      make: 'BMW',
      year_from: 2020,
      price_max: 50000,
      fuel_type: 'diesel',
      transmission: 'automatic',
      sort_by: 'price',
      sort_order: 'asc',
      page: 1,
      per_page: 20
    })
    
    console.log('Vehicles:', response.data)
    console.log('Total:', response.total)
    console.log('Current page:', response.current_page)
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  }
}
```

### Obține Vehicul Specific
```typescript
const loadVehicle = async (id: number) => {
  try {
    const vehicle = await vehicleService.getVehicle(id)
    console.log('Vehicle details:', vehicle)
  } catch (error) {
    console.error('Failed to load vehicle:', error)
  }
}
```

### Creează Vehicul
```typescript
const createVehicle = async () => {
  try {
    const vehicle = await vehicleService.createVehicle({
      make: 'BMW',
      model: 'X5',
      year: 2023,
      vin: 'WBAJE5C50KG123456',
      price: 65000,
      currency: 'EUR',
      description: 'Perfect condition, full options',
      mileage: 15000,
      fuel_type: 'diesel',
      transmission: 'automatic',
      color: 'Black',
      doors: 5,
      seats: 5,
      body_type: 'suv',
      engine_size: 3000,
      power_hp: 286,
      location_city: 'Bucharest',
      location_country: 'Romania',
      status: 'active'
    })
    
    console.log('Vehicle created:', vehicle)
  } catch (error) {
    console.error('Failed to create vehicle:', error)
  }
}
```

### Upload Imagini Vehicul
```typescript
const uploadVehicleImages = async (vehicleId: number, files: File[]) => {
  try {
    const result = await vehicleService.uploadImages(
      vehicleId, 
      files,
      0 // index of primary image
    )
    
    console.log('Images uploaded:', result.images)
    console.log('Primary image:', result.primary_image)
  } catch (error) {
    console.error('Failed to upload images:', error)
  }
}
```

---

## 💰 Comenzi (Order Flow Complet)

### 1. Creare Comandă (Buyer)
```typescript
import { orderService } from '@/lib/api'

const createOrder = async (vehicleId: number, amount: string) => {
  try {
    const order = await orderService.createOrder({
      vehicle_id: vehicleId,
      amount: amount,
      payment_method: 'bank_transfer'
    })
    
    console.log('Order created:', order)
    return order.transaction_id
  } catch (error) {
    console.error('Failed to create order:', error)
  }
}
```

### 2. Generare Contract (Dealer)
```typescript
const generateContract = async (transactionId: number) => {
  try {
    const result = await orderService.generateContract(transactionId)
    console.log('Contract generated:', result)
  } catch (error) {
    console.error('Failed to generate contract:', error)
  }
}
```

### 3. Upload Contract Semnat (Buyer)
```typescript
const uploadSignedContract = async (transactionId: number, file: File) => {
  try {
    const result = await orderService.uploadSignedContract(transactionId, file)
    console.log('Signed contract uploaded:', result)
  } catch (error) {
    console.error('Failed to upload contract:', error)
  }
}
```

### 4. Obține Instrucțiuni de Plată (Buyer)
```typescript
const getPaymentInstructions = async (transactionId: number) => {
  try {
    const instructions = await orderService.getPaymentInstructions(transactionId)
    
    console.log('Pay to:', instructions.account_holder)
    console.log('IBAN:', instructions.iban)
    console.log('BIC/SWIFT:', instructions.bic_swift)
    console.log('Amount:', instructions.amount, instructions.currency)
    console.log('Reference:', instructions.reference)
  } catch (error) {
    console.error('Failed to get payment instructions:', error)
  }
}
```

### 5. Confirmare Plată (Admin/Dealer)
```typescript
const confirmPayment = async (transactionId: number) => {
  try {
    const result = await orderService.confirmPayment(
      transactionId, 
      'Payment received and verified'
    )
    console.log('Payment confirmed:', result)
  } catch (error) {
    console.error('Failed to confirm payment:', error)
  }
}
```

### 6. Marcare Gata pentru Livrare (Dealer)
```typescript
const markReadyForDelivery = async (transactionId: number) => {
  try {
    const result = await orderService.markReadyForDelivery(
      transactionId,
      'Vehicle is ready for pickup'
    )
    console.log('Marked ready for delivery:', result)
  } catch (error) {
    console.error('Failed to mark ready:', error)
  }
}
```

### 7. Marcare Livrat (Buyer/Dealer)
```typescript
const markAsDelivered = async (transactionId: number) => {
  try {
    const result = await orderService.markAsDelivered(
      transactionId,
      'Vehicle delivered and inspected'
    )
    console.log('Marked as delivered:', result)
  } catch (error) {
    console.error('Failed to mark delivered:', error)
  }
}
```

---

## 🏦 Conturi Bancare

### Adaugă Cont Bancar
```typescript
import { bankAccountService } from '@/lib/api'

const addBankAccount = async () => {
  try {
    const account = await bankAccountService.create({
      account_holder_name: 'John Doe',
      iban: 'RO49AAAA1B31007593840000',
      bic_swift: 'AAAAROBB',
      bank_name: 'Sample Bank',
      is_primary: true
    })
    
    console.log('Bank account added:', account)
  } catch (error) {
    console.error('Failed to add bank account:', error)
  }
}
```

### Listare Conturi
```typescript
const loadBankAccounts = async () => {
  try {
    const accounts = await bankAccountService.list()
    console.log('Bank accounts:', accounts)
  } catch (error) {
    console.error('Failed to load accounts:', error)
  }
}
```

### Setare Cont Principal
```typescript
const setPrimaryAccount = async (accountId: number) => {
  try {
    const account = await bankAccountService.setPrimary(accountId)
    console.log('Primary account set:', account)
  } catch (error) {
    console.error('Failed to set primary:', error)
  }
}
```

---

## ⭐ Recenzii

### Adaugă Recenzie
```typescript
import { reviewService } from '@/lib/api'

const addReview = async (transactionId: number, reviewedUserId: number) => {
  try {
    const review = await reviewService.create({
      transaction_id: transactionId,
      reviewed_user_id: reviewedUserId,
      rating: 5,
      title: 'Excellent seller!',
      comment: 'Very professional and the car was exactly as described.'
    })
    
    console.log('Review created:', review)
  } catch (error) {
    console.error('Failed to create review:', error)
  }
}
```

### Obține Recenzii Vehicul
```typescript
const loadVehicleReviews = async (vehicleId: number) => {
  try {
    const reviews = await reviewService.getVehicleReviews(vehicleId)
    console.log('Vehicle reviews:', reviews)
  } catch (error) {
    console.error('Failed to load reviews:', error)
  }
}
```

---

## ⚖️ Dispute

### Creare Dispută
```typescript
import { disputeService } from '@/lib/api'

const createDispute = async (transactionId: number) => {
  try {
    const dispute = await disputeService.create({
      transaction_id: transactionId,
      reason: 'Vehicle not as described',
      description: 'The vehicle has undisclosed damage to the rear bumper.'
    })
    
    console.log('Dispute created:', dispute)
  } catch (error) {
    console.error('Failed to create dispute:', error)
  }
}
```

### Adaugă Răspuns la Dispută
```typescript
const addDisputeResponse = async (disputeId: number) => {
  try {
    const response = await disputeService.addResponse(disputeId, {
      message: 'The damage was mentioned in the description.'
    })
    
    console.log('Response added:', response)
  } catch (error) {
    console.error('Failed to add response:', error)
  }
}
```

---

## 💬 Mesaje

### Trimitere Mesaj
```typescript
import { messageService } from '@/lib/api'

const sendMessage = async (transactionId: number) => {
  try {
    const message = await messageService.sendMessage(transactionId, {
      message: 'When can I come to inspect the vehicle?'
    })
    
    console.log('Message sent:', message)
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
```

### Obține Conversații
```typescript
const loadConversations = async () => {
  try {
    const conversations = await messageService.getConversations()
    console.log('Conversations:', conversations)
  } catch (error) {
    console.error('Failed to load conversations:', error)
  }
}
```

---

## 🔔 Notificări

### Obține Notificări
```typescript
import { notificationService } from '@/lib/api'

const loadNotifications = async () => {
  try {
    const response = await notificationService.getAll(1, false)
    console.log('Notifications:', response.notifications)
    console.log('Unread count:', response.unread_count)
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
}
```

### Marchează ca Citit
```typescript
const markNotificationRead = async (notificationId: string) => {
  try {
    await notificationService.markAsRead(notificationId)
    console.log('Notification marked as read')
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}
```

---

## 🔒 GDPR

### Export Date Personale
```typescript
import { gdprService } from '@/lib/api'

const exportMyData = async () => {
  try {
    const blob = await gdprService.exportData()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-data.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export data:', error)
  }
}
```

### Cerere Ștergere Cont
```typescript
const requestAccountDeletion = async () => {
  try {
    const result = await gdprService.requestDeletion(
      'I no longer use the service'
    )
    
    console.log('Deletion requested')
    console.log('Deletion date:', result.deletion_date)
  } catch (error) {
    console.error('Failed to request deletion:', error)
  }
}
```

---

## 🍪 Cookie Consent

### Acceptă Toate Cookie-urile
```typescript
import { cookieService } from '@/lib/api'

const acceptAllCookies = async () => {
  try {
    const consent = await cookieService.acceptAll()
    console.log('All cookies accepted:', consent)
  } catch (error) {
    console.error('Failed to accept cookies:', error)
  }
}
```

### Setează Preferințe Personalizate
```typescript
const updateCookiePreferences = async () => {
  try {
    const consent = await cookieService.updatePreferences({
      essential: true,
      analytics: true,
      marketing: false,
      preferences: true
    })
    
    console.log('Cookie preferences updated:', consent)
  } catch (error) {
    console.error('Failed to update preferences:', error)
  }
}
```

---

## 🌐 Internationalizare

### Setează Limba
```typescript
import { localeService } from '@/lib/api'

const changeLanguage = async (locale: string) => {
  try {
    const result = await localeService.setLocale(locale)
    console.log('Language changed to:', result.locale)
    // Reload page or update i18n
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}
```

### Obține Limbi Disponibile
```typescript
const loadAvailableLanguages = async () => {
  try {
    const locales = await localeService.getAvailableLocales()
    console.log('Available languages:', locales)
  } catch (error) {
    console.error('Failed to load languages:', error)
  }
}
```

---

## 🎯 Best Practices

### 1. Error Handling
```typescript
import { AxiosError } from 'axios'

const handleApiCall = async () => {
  try {
    const result = await vehicleService.getVehicles()
    return result
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // Redirect to login
        console.log('Unauthorized - redirect to login')
      } else if (error.response?.status === 422) {
        // Validation errors
        console.log('Validation errors:', error.response.data.errors)
      } else {
        console.error('API error:', error.response?.data?.message)
      }
    } else {
      console.error('Network error:', error)
    }
  }
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const loadData = async () => {
  setLoading(true)
  setError(null)
  
  try {
    const data = await vehicleService.getVehicles()
    // Use data
  } catch (err) {
    setError('Failed to load vehicles')
  } finally {
    setLoading(false)
  }
}
```

### 3. React Query Integration
```typescript
import { useQuery } from '@tanstack/react-query'
import { vehicleService } from '@/lib/api'

const useVehicles = (filters?: VehicleFilters) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehicleService.getVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Usage
const { data, isLoading, error } = useVehicles({ category: 'car' })
```

---

## 📚 Referințe

- **Documentație Completă:** [BACKEND_FRONTEND_ROUTES_MAPPING.md](./BACKEND_FRONTEND_ROUTES_MAPPING.md)
- **Analiză și Remedieri:** [ANALIZA_COMPLETA_SI_REMEDIERE.md](./ANALIZA_COMPLETA_SI_REMEDIERE.md)
- **Backend API:** `https://adminautoscout.dev/api`

---

**Ultima actualizare:** 29 Ianuarie 2026
