import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { authService } from '@/lib/api/auth';
import React from 'react';

// Mock authService
jest.mock('@/lib/api/auth', () => ({
  authService: {
    me: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('returns user when authenticated', async () => {
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      user_type: 'buyer',
    };

    (authService.me as jest.Mock).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('returns null when not authenticated', async () => {
    (authService.me as jest.Mock).mockRejectedValueOnce(new Error('Not authenticated'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('login updates auth state', async () => {
    const mockLoginResponse = {
      token: 'test-token',
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        user_type: 'buyer',
      },
    };

    (authService.me as jest.Mock).mockResolvedValueOnce(null);
    (authService.login as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Perform login
    await act(async () => {
      await result.current.login('user@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('user@example.com');
    });
  });

  it('logout clears auth state', async () => {
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      user_type: 'buyer',
    };

    (authService.me as jest.Mock).mockResolvedValueOnce(mockUser);
    (authService.logout as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for user to be loaded
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Perform logout
    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('handles login errors gracefully', async () => {
    (authService.me as jest.Mock).mockResolvedValueOnce(null);
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.login('user@example.com', 'wrong-password');
      });
    }).rejects.toThrow();

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('provides loading state during authentication check', () => {
    (authService.me as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
  });
});
