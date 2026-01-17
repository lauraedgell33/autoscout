import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { authService } from '@/lib/api/auth'

// Mock authService
jest.mock('@/lib/api/auth', () => ({
  authService: {
    me: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}))

// Test component that uses the auth context
function TestComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Logged in as {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
        </>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    ;(authService.me as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show not logged in when no user', async () => {
    ;(authService.me as jest.Mock).mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    })
  })

  it('should show logged in user when authenticated', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'buyer' as const,
    }

    ;(authService.me as jest.Mock).mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument()
    })
  })

  it('should handle login successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'buyer' as const,
      user_type: 'buyer' as const,
    }

    ;(authService.me as jest.Mock).mockRejectedValue(new Error('Unauthorized'))
    ;(authService.login as jest.Mock).mockResolvedValue({ user: mockUser })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    })

    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password')
    })
  })

  it('should handle logout', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'buyer' as const,
    }

    ;(authService.me as jest.Mock).mockResolvedValue(mockUser)
    ;(authService.logout as jest.Mock).mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument()
    })

    const logoutButton = screen.getByText('Logout')
    await userEvent.click(logoutButton)

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
    })
  })
})
