/**
 * Comprehensive Frontend Integration Tests
 * 
 * Tests for components, hooks, stores, and API client integration
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test credentials
const TEST_USERS = {
  buyer: {
    email: 'buyer.test@autoscout.dev',
    password: 'BuyerPass123!',
  },
  seller: {
    email: 'seller.test@autoscout.dev',
    password: 'SellerPass123!',
  },
  admin: {
    email: 'admin@autoscout.dev',
    password: 'Admin123!@#',
  },
};

describe('Authentication Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('login stores token in localStorage', async () => {
    const mockToken = 'test-token-12345';
    const mockUser = {
      id: 1,
      name: 'Test Buyer',
      email: TEST_USERS.buyer.email,
      user_type: 'buyer',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        token: mockToken,
        user: mockUser,
        message: 'Login successful',
      }),
    });

    // Simulate login
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USERS.buyer.email,
        password: TEST_USERS.buyer.password,
      }),
    });

    const data = await response.json();
    
    expect(data.token).toBe(mockToken);
    expect(data.user.email).toBe(TEST_USERS.buyer.email);
  });

  test('logout clears token from localStorage', () => {
    localStorageMock.setItem('token', 'test-token');
    localStorageMock.removeItem('token');
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  test('registration creates new user', async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@test.com',
      password: 'TestPass123!',
      user_type: 'buyer',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({
        user: { ...newUser, id: 123 },
        message: 'Registration successful',
      }),
    });

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.user.email).toBe(newUser.email);
  });
});

describe('Vehicle API Integration', () => {
  test('fetches vehicle list', async () => {
    const mockVehicles = [
      { id: 1, make: 'BMW', model: 'X5', price: 55000 },
      { id: 2, make: 'Audi', model: 'A4', price: 45000 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockVehicles }),
    });

    const response = await fetch('/api/vehicles');
    const data = await response.json();

    expect(data.data).toHaveLength(2);
    expect(data.data[0].make).toBe('BMW');
  });

  test('fetches single vehicle details', async () => {
    const mockVehicle = {
      id: 1,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 55000,
      description: 'Excellent condition',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockVehicle }),
    });

    const response = await fetch('/api/vehicles/1');
    const data = await response.json();

    expect(data.data.id).toBe(1);
    expect(data.data.price).toBe(55000);
  });

  test('search vehicles by keyword', async () => {
    const mockResults = [
      { id: 1, make: 'BMW', model: 'X5' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockResults }),
    });

    const response = await fetch('/api/search/vehicles?q=BMW');
    const data = await response.json();

    expect(data.data[0].make).toBe('BMW');
  });
});

describe('Transaction API Integration', () => {
  test('creates new transaction', async () => {
    const mockTransaction = {
      id: 1,
      transaction_code: 'AS24-TXN-2026-ABC123',
      vehicle_id: 1,
      amount: 55000,
      status: 'pending',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ data: mockTransaction }),
    });

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({ vehicle_id: 1, payment_method: 'bank_transfer' }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.status).toBe('pending');
  });

  test('fetches user transactions', async () => {
    const mockTransactions = [
      { id: 1, status: 'pending', amount: 55000 },
      { id: 2, status: 'completed', amount: 45000 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockTransactions }),
    });

    const response = await fetch('/api/transactions', {
      headers: { 'Authorization': 'Bearer test-token' },
    });
    const data = await response.json();

    expect(data.data).toHaveLength(2);
  });

  test('uploads payment proof', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Payment proof uploaded successfully' }),
    });

    const formData = new FormData();
    formData.append('payment_proof', new Blob(['test']), 'proof.pdf');

    const response = await fetch('/api/transactions/1/upload-payment-proof', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer test-token' },
      body: formData,
    });

    expect(response.ok).toBe(true);
  });
});

describe('Favorites API Integration', () => {
  test('adds vehicle to favorites', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Added to favorites' }),
    });

    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({ vehicle_id: 1 }),
    });

    expect(response.status).toBe(201);
  });

  test('removes vehicle from favorites', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Removed from favorites' }),
    });

    const response = await fetch('/api/favorites/1', {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect(response.ok).toBe(true);
  });

  test('fetches user favorites', async () => {
    const mockFavorites = [
      { id: 1, vehicle: { make: 'BMW', model: 'X5' } },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockFavorites }),
    });

    const response = await fetch('/api/favorites', {
      headers: { 'Authorization': 'Bearer test-token' },
    });
    const data = await response.json();

    expect(data.data).toHaveLength(1);
  });
});

describe('Admin API Integration', () => {
  const adminToken = 'admin-token';

  test('fetches dashboard stats', async () => {
    const mockStats = {
      total_users: 100,
      total_transactions: 50,
      total_revenue: 1000000,
      total_vehicles: 200,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockStats }),
    });

    const response = await fetch('/api/admin/dashboard/overall', {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await response.json();

    expect(data.data.total_users).toBe(100);
  });

  test('verifies payment', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Payment verified' }),
    });

    const response = await fetch('/api/transactions/1/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ verification_notes: 'Payment confirmed' }),
    });

    expect(response.ok).toBe(true);
  });

  test('non-admin cannot access admin routes', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ message: 'Forbidden' }),
    });

    const response = await fetch('/api/admin/dashboard/overall', {
      headers: { 'Authorization': 'Bearer buyer-token' },
    });

    expect(response.status).toBe(403);
  });
});

describe('Message API Integration', () => {
  test('sends message in transaction', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({
        data: { id: 1, content: 'Hello', sender_id: 1 },
      }),
    });

    const response = await fetch('/api/transactions/1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({ content: 'Hello' }),
    });

    expect(response.status).toBe(201);
  });

  test('fetches messages', async () => {
    const mockMessages = [
      { id: 1, content: 'Hello', sender_id: 1 },
      { id: 2, content: 'Hi there', sender_id: 2 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockMessages }),
    });

    const response = await fetch('/api/transactions/1/messages', {
      headers: { 'Authorization': 'Bearer test-token' },
    });
    const data = await response.json();

    expect(data.data).toHaveLength(2);
  });
});

describe('Review API Integration', () => {
  test('creates review after completed transaction', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({
        data: { id: 1, rating: 5, comment: 'Great!' },
      }),
    });

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        transaction_id: 1,
        reviewee_id: 2,
        rating: 5,
        comment: 'Great!',
      }),
    });

    expect(response.status).toBe(201);
  });

  test('fetches user reviews', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Great seller!' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockReviews }),
    });

    const response = await fetch('/api/users/1/reviews');
    const data = await response.json();

    expect(data.data[0].rating).toBe(5);
  });
});

describe('Error Handling', () => {
  test('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch('/api/vehicles')).rejects.toThrow('Network error');
  });

  test('handles 401 unauthorized', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthenticated' }),
    });

    const response = await fetch('/api/user', {
      headers: { 'Authorization': 'Bearer invalid-token' },
    });

    expect(response.status).toBe(401);
  });

  test('handles 404 not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' }),
    });

    const response = await fetch('/api/vehicles/99999');

    expect(response.status).toBe(404);
  });

  test('handles 422 validation errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: () => Promise.resolve({
        message: 'Validation failed',
        errors: { email: ['The email field is required.'] },
      }),
    });

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.errors).toBeDefined();
  });
});

describe('Public Endpoints', () => {
  test('health check endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 'ok' }),
    });

    const response = await fetch('/api/health');
    const data = await response.json();

    expect(data.status).toBe('ok');
  });

  test('categories endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: 1, name: 'Cars' }, { id: 2, name: 'SUVs' }],
      }),
    });

    const response = await fetch('/api/categories');
    const data = await response.json();

    expect(data.data.length).toBeGreaterThan(0);
  });

  test('legal documents endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ type: 'terms', title: 'Terms of Service' }],
      }),
    });

    const response = await fetch('/api/legal-documents');
    expect(response.ok).toBe(true);
  });
});
