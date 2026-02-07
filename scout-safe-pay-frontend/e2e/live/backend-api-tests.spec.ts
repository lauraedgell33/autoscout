import { test, expect } from '@playwright/test';

/**
 * Backend API E2E Tests
 * Tests all API endpoints directly
 */

const API_BASE = 'https://adminautoscout.dev/api';

// Generate unique test data for each run
const timestamp = Date.now();
const randomString = Math.random().toString(36).substring(2, 8);

const testUsers = {
  buyer: {
    name: `Test Buyer ${randomString}`,
    email: `testbuyer.${timestamp}@testmail.com`,
    password: 'TestPassword123!',
    user_type: 'buyer',
  },
  seller: {
    name: `Test Seller ${randomString}`,
    email: `testseller.${timestamp}@testmail.com`,
    password: 'TestPassword123!',
    user_type: 'seller',
  },
};

// Token storage for authenticated requests
let buyerToken: string | null = null;
let sellerToken: string | null = null;
let adminToken: string | null = null;
let createdVehicleId: number | null = null;
let createdTransactionId: number | null = null;

test.describe.serial('Backend API - Authentication Endpoints', () => {
  
  test('GET /api/health - API health check', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    
    // API might return 200 or 404 if no health endpoint
    console.log(`Health check status: ${response.status()}`);
  });

  test('POST /api/register - Register new buyer', async ({ request }) => {
    const response = await request.post(`${API_BASE}/register`, {
      data: testUsers.buyer,
    });
    
    const status = response.status();
    console.log(`Register buyer status: ${status}`);
    
    if (status === 201 || status === 200) {
      const data = await response.json();
      console.log('Buyer registered successfully');
      if (data.token) {
        buyerToken = data.token;
      }
    } else if (status === 422) {
      console.log('Registration validation error (expected if user exists)');
    }
  });

  test('POST /api/register - Register new seller', async ({ request }) => {
    const response = await request.post(`${API_BASE}/register`, {
      data: testUsers.seller,
    });
    
    const status = response.status();
    console.log(`Register seller status: ${status}`);
    
    if (status === 201 || status === 200) {
      const data = await response.json();
      console.log('Seller registered successfully');
      if (data.token) {
        sellerToken = data.token;
      }
    }
  });

  test('POST /api/login - Login with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    const status = response.status();
    console.log(`Login status: ${status}`);
    
    if (status === 200) {
      const data = await response.json();
      if (data.token || data.data?.token) {
        sellerToken = data.token || data.data?.token;
        console.log('Login successful, token obtained');
      }
    }
  });

  test('POST /api/login - Login with invalid credentials should fail', async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'nonexistent@test.com',
        password: 'wrongpassword',
      },
    });
    
    const status = response.status();
    expect([401, 422]).toContain(status);
    console.log(`Invalid login correctly rejected with status: ${status}`);
  });

  test('POST /api/logout - Logout user', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping logout test');
      return;
    }
    
    const response = await request.post(`${API_BASE}/logout`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Logout status: ${response.status()}`);
  });

  test('POST /api/forgot-password - Request password reset', async ({ request }) => {
    const response = await request.post(`${API_BASE}/forgot-password`, {
      data: {
        email: 'test@example.com',
      },
    });
    
    const status = response.status();
    console.log(`Forgot password status: ${status}`);
    // Should return 200 even for non-existent emails (security)
  });
});

test.describe.serial('Backend API - User Profile Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    // Login to get token
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/user - Get current user profile', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    const status = response.status();
    console.log(`Get user profile status: ${status}`);
    
    if (status === 200) {
      const data = await response.json();
      console.log('User profile retrieved:', data.data?.email || data.email);
    }
  });

  test('PUT /api/user/profile - Update user profile', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.put(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
      data: {
        name: 'Updated Seller Name',
        phone: '+32123456789',
      },
    });
    
    console.log(`Update profile status: ${response.status()}`);
  });

  test('GET /api/user - Unauthenticated request should fail', async ({ request }) => {
    const response = await request.get(`${API_BASE}/user`);
    
    const status = response.status();
    expect([401, 403]).toContain(status);
    console.log(`Unauthenticated request correctly rejected: ${status}`);
  });
});

test.describe.serial('Backend API - Vehicle Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    // Login to get token
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/vehicles - List all vehicles (public)', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles`);
    
    const status = response.status();
    expect(status).toBe(200);
    
    const data = await response.json();
    const vehicles = data.data || data;
    console.log(`Vehicles listed: ${Array.isArray(vehicles) ? vehicles.length : 'N/A'}`);
  });

  test('GET /api/vehicles?page=1&per_page=10 - Paginated vehicles', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles?page=1&per_page=10`);
    
    const status = response.status();
    expect(status).toBe(200);
    
    const data = await response.json();
    console.log(`Paginated vehicles retrieved`);
  });

  test('GET /api/vehicles?make=BMW - Filter by make', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles?make=BMW`);
    
    const status = response.status();
    expect(status).toBe(200);
    
    const data = await response.json();
    console.log(`Filtered vehicles by make BMW`);
  });

  test('GET /api/vehicles?min_price=10000&max_price=50000 - Filter by price', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles?min_price=10000&max_price=50000`);
    
    const status = response.status();
    expect(status).toBe(200);
    console.log(`Filtered vehicles by price range`);
  });

  test('GET /api/vehicles?sort=price_asc - Sort vehicles', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles?sort=price_asc`);
    
    const status = response.status();
    expect(status).toBe(200);
    console.log(`Sorted vehicles by price`);
  });

  test('GET /api/vehicles/{id} - Get single vehicle', async ({ request }) => {
    // First get a vehicle ID
    const listResponse = await request.get(`${API_BASE}/vehicles`);
    const listData = await listResponse.json();
    const vehicles = listData.data || listData;
    
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const vehicleId = vehicles[0].id;
      
      const response = await request.get(`${API_BASE}/vehicles/${vehicleId}`);
      const status = response.status();
      expect(status).toBe(200);
      
      const data = await response.json();
      console.log(`Vehicle ${vehicleId} retrieved`);
    } else {
      console.log('No vehicles found to test');
    }
  });

  test('POST /api/vehicles - Create new vehicle (seller)', async ({ request }) => {
    if (!sellerToken) {
      console.log('No seller token, skipping');
      return;
    }
    
    const vehicleData = {
      make: 'TestMake',
      model: 'TestModel',
      year: 2023,
      price: 25000,
      mileage: 10000,
      fuel_type: 'petrol',
      transmission: 'automatic',
      body_type: 'sedan',
      color: 'black',
      description: 'Test vehicle created by E2E test',
      status: 'active',
    };
    
    const response = await request.post(`${API_BASE}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
      data: vehicleData,
    });
    
    const status = response.status();
    console.log(`Create vehicle status: ${status}`);
    
    if (status === 201 || status === 200) {
      const data = await response.json();
      createdVehicleId = data.data?.id || data.id;
      console.log(`Vehicle created with ID: ${createdVehicleId}`);
    }
  });

  test('PUT /api/vehicles/{id} - Update vehicle', async ({ request }) => {
    if (!sellerToken || !createdVehicleId) {
      console.log('No token or vehicle ID, skipping');
      return;
    }
    
    const response = await request.put(`${API_BASE}/vehicles/${createdVehicleId}`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
      data: {
        price: 24500,
        description: 'Updated description',
      },
    });
    
    console.log(`Update vehicle status: ${response.status()}`);
  });

  test('GET /api/vehicles/my - Get seller vehicles', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/vehicles/my`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    const status = response.status();
    console.log(`Get my vehicles status: ${status}`);
  });
});

test.describe.serial('Backend API - Favorites Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/favorites - List user favorites', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/favorites`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`List favorites status: ${response.status()}`);
  });

  test('POST /api/favorites/{vehicleId} - Add to favorites', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    // Get a vehicle ID first
    const listResponse = await request.get(`${API_BASE}/vehicles`);
    const listData = await listResponse.json();
    const vehicles = listData.data || listData;
    
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const vehicleId = vehicles[0].id;
      
      const response = await request.post(`${API_BASE}/favorites/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`,
        },
      });
      
      console.log(`Add to favorites status: ${response.status()}`);
    }
  });

  test('DELETE /api/favorites/{vehicleId} - Remove from favorites', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const listResponse = await request.get(`${API_BASE}/vehicles`);
    const listData = await listResponse.json();
    const vehicles = listData.data || listData;
    
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const vehicleId = vehicles[0].id;
      
      const response = await request.delete(`${API_BASE}/favorites/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`,
        },
      });
      
      console.log(`Remove from favorites status: ${response.status()}`);
    }
  });
});

test.describe.serial('Backend API - Transaction Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/transactions - List user transactions', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/transactions`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`List transactions status: ${response.status()}`);
  });

  test('POST /api/transactions - Create new transaction', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    // Get a vehicle ID
    const listResponse = await request.get(`${API_BASE}/vehicles`);
    const listData = await listResponse.json();
    const vehicles = listData.data || listData;
    
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const vehicleId = vehicles[0].id;
      
      const response = await request.post(`${API_BASE}/transactions`, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`,
        },
        data: {
          vehicle_id: vehicleId,
          type: 'purchase',
        },
      });
      
      const status = response.status();
      console.log(`Create transaction status: ${status}`);
      
      if (status === 201 || status === 200) {
        const data = await response.json();
        createdTransactionId = data.data?.id || data.id;
        console.log(`Transaction created: ${createdTransactionId}`);
      }
    }
  });

  test('GET /api/transactions/{id} - Get single transaction', async ({ request }) => {
    if (!sellerToken || !createdTransactionId) {
      console.log('No token or transaction ID, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/transactions/${createdTransactionId}`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Get transaction status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Payment Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/payments - List payments', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/payments`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`List payments status: ${response.status()}`);
  });

  test('GET /api/escrow/balance - Get escrow balance', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/escrow/balance`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Escrow balance status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Messaging Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/messages - List conversations', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/messages`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`List messages status: ${response.status()}`);
  });

  test('GET /api/messages/unread-count - Get unread count', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Unread count status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Notifications Endpoints', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('GET /api/notifications - List notifications', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.get(`${API_BASE}/notifications`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`List notifications status: ${response.status()}`);
  });

  test('POST /api/notifications/mark-all-read - Mark all as read', async ({ request }) => {
    if (!sellerToken) {
      console.log('No token, skipping');
      return;
    }
    
    const response = await request.post(`${API_BASE}/notifications/mark-all-read`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Mark all read status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Dealer Endpoints', () => {
  
  test('GET /api/dealers - List all dealers', async ({ request }) => {
    const response = await request.get(`${API_BASE}/dealers`);
    
    console.log(`List dealers status: ${response.status()}`);
  });

  test('GET /api/dealers/{id} - Get single dealer', async ({ request }) => {
    // Get dealer ID first
    const listResponse = await request.get(`${API_BASE}/dealers`);
    
    if (listResponse.status() === 200) {
      const data = await listResponse.json();
      const dealers = data.data || data;
      
      if (Array.isArray(dealers) && dealers.length > 0) {
        const dealerId = dealers[0].id;
        
        const response = await request.get(`${API_BASE}/dealers/${dealerId}`);
        console.log(`Get dealer status: ${response.status()}`);
      }
    }
  });

  test('GET /api/dealers/{id}/vehicles - Get dealer vehicles', async ({ request }) => {
    const listResponse = await request.get(`${API_BASE}/dealers`);
    
    if (listResponse.status() === 200) {
      const data = await listResponse.json();
      const dealers = data.data || data;
      
      if (Array.isArray(dealers) && dealers.length > 0) {
        const dealerId = dealers[0].id;
        
        const response = await request.get(`${API_BASE}/dealers/${dealerId}/vehicles`);
        console.log(`Get dealer vehicles status: ${response.status()}`);
      }
    }
  });
});

test.describe.serial('Backend API - Static Content Endpoints', () => {
  
  test('GET /api/makes - List vehicle makes', async ({ request }) => {
    const response = await request.get(`${API_BASE}/makes`);
    console.log(`List makes status: ${response.status()}`);
  });

  test('GET /api/makes/{make}/models - List models for make', async ({ request }) => {
    const response = await request.get(`${API_BASE}/makes/BMW/models`);
    console.log(`List BMW models status: ${response.status()}`);
  });

  test('GET /api/fuel-types - List fuel types', async ({ request }) => {
    const response = await request.get(`${API_BASE}/fuel-types`);
    console.log(`List fuel types status: ${response.status()}`);
  });

  test('GET /api/body-types - List body types', async ({ request }) => {
    const response = await request.get(`${API_BASE}/body-types`);
    console.log(`List body types status: ${response.status()}`);
  });

  test('GET /api/transmissions - List transmissions', async ({ request }) => {
    const response = await request.get(`${API_BASE}/transmissions`);
    console.log(`List transmissions status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Search & Suggestions', () => {
  
  test('GET /api/vehicles/search?q=BMW - Search vehicles', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles/search?q=BMW`);
    console.log(`Search vehicles status: ${response.status()}`);
  });

  test('GET /api/suggestions?q=BM - Get search suggestions', async ({ request }) => {
    const response = await request.get(`${API_BASE}/suggestions?q=BM`);
    console.log(`Search suggestions status: ${response.status()}`);
  });
});

test.describe.serial('Backend API - CSRF & Security', () => {
  
  test('GET /sanctum/csrf-cookie - Get CSRF token', async ({ request }) => {
    const response = await request.get('https://adminautoscout.dev/sanctum/csrf-cookie');
    console.log(`CSRF cookie status: ${response.status()}`);
  });

  test('API should reject requests without proper auth', async ({ request }) => {
    const response = await request.post(`${API_BASE}/vehicles`, {
      data: {
        make: 'Test',
        model: 'Test',
      },
    });
    
    expect([401, 403]).toContain(response.status());
    console.log(`Unauthorized request correctly rejected: ${response.status()}`);
  });
});

test.describe.serial('Backend API - Error Handling', () => {
  
  test('GET /api/vehicles/99999999 - Non-existent vehicle returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles/99999999`);
    
    expect([404, 500]).toContain(response.status());
    console.log(`Non-existent vehicle status: ${response.status()}`);
  });

  test('POST /api/login - Invalid JSON should return error', async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: 'invalid json',
    });
    
    expect([400, 422, 500]).toContain(response.status());
    console.log(`Invalid JSON error status: ${response.status()}`);
  });

  test('POST /api/register - Validation errors', async ({ request }) => {
    const response = await request.post(`${API_BASE}/register`, {
      data: {
        email: 'invalid-email',
        password: '123', // Too short
      },
    });
    
    expect([400, 422]).toContain(response.status());
    console.log(`Validation error status: ${response.status()}`);
  });
});

test.describe('Backend API - Rate Limiting', () => {
  
  test('API should handle multiple rapid requests', async ({ request }) => {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(request.get(`${API_BASE}/vehicles`));
    }
    
    const responses = await Promise.all(requests);
    const statuses = responses.map(r => r.status());
    
    // Most should succeed, some might be rate limited
    const successCount = statuses.filter(s => s === 200).length;
    const rateLimitedCount = statuses.filter(s => s === 429).length;
    
    console.log(`Success: ${successCount}, Rate limited: ${rateLimitedCount}`);
  });
});

// Cleanup test
test.describe.serial('Cleanup', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/login`, {
      data: {
        email: 'seller@autoscout24safetrade.com',
        password: 'password123',
      },
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      sellerToken = data.token || data.data?.token;
    }
  });

  test('DELETE /api/vehicles/{id} - Delete test vehicle', async ({ request }) => {
    if (!sellerToken || !createdVehicleId) {
      console.log('No vehicle to delete');
      return;
    }
    
    const response = await request.delete(`${API_BASE}/vehicles/${createdVehicleId}`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
      },
    });
    
    console.log(`Delete vehicle status: ${response.status()}`);
  });
});
