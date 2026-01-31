import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/api/auth';

jest.mock('@/lib/api/auth');

describe('useAuth', () => {
  beforeEach(() => {
    // Clear store before each test
    useAuthStore.getState().logout();
    jest.clearAllMocks();
  });

  it('returns authenticated user when logged in', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };

    (authService.getUser as jest.Mock).mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
      result.current.setToken('mock-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('returns null when not logged in', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login function updates auth state', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    const mockToken = 'mock-auth-token';

    (authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const response = await authService.login('john@example.com', 'password');
      result.current.setUser(response.user);
      result.current.setToken(response.token);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout function clears auth state', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
      result.current.setToken('token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('token persists in localStorage', () => {
    const mockToken = 'persistent-token';
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken(mockToken);
    });

    const storedToken = localStorage.getItem('auth-token');
    expect(storedToken).toBe(mockToken);
  });

  it('restores user from localStorage on mount', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };

    localStorage.setItem('auth-token', 'stored-token');
    localStorage.setItem('auth-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuthStore());

    expect(result.current.token).toBe('stored-token');
    expect(result.current.user).toEqual(mockUser);
  });

  it('clears localStorage on logout', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken('token');
      result.current.setUser({ id: 1, name: 'Test' });
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('auth-token')).toBeNull();
    expect(localStorage.getItem('auth-user')).toBeNull();
  });
});
