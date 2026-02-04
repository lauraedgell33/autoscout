/**
 * Centralized API Error Handler
 * Provides consistent error handling across the application
 */

import { logger } from './logger'

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

// Error messages by type
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
  [ErrorType.AUTH]: 'Your session has expired. Please log in again.',
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.SERVER]: 'Something went wrong on our end. Please try again later.',
  [ErrorType.RATE_LIMIT]: 'Too many requests. Please wait a moment before trying again.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
}

export interface ApiError {
  type: ErrorType
  message: string
  originalError?: unknown
  statusCode?: number
  details?: Record<string, string[]>
}

/**
 * Parse an API error and return a standardized ApiError object
 */
export function parseApiError(error: unknown): ApiError {
  // Axios error with response
  if (isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as Record<string, unknown> | undefined

    // Determine error type based on status code
    let type = ErrorType.UNKNOWN
    if (!error.response) {
      type = ErrorType.NETWORK
    } else if (status === 401 || status === 403) {
      type = ErrorType.AUTH
    } else if (status === 404) {
      type = ErrorType.NOT_FOUND
    } else if (status === 422) {
      type = ErrorType.VALIDATION
    } else if (status === 429) {
      type = ErrorType.RATE_LIMIT
    } else if (status && status >= 500) {
      type = ErrorType.SERVER
    }

    // Extract message from response or use default
    const message = 
      (data?.message as string) || 
      (data?.error as string) || 
      ERROR_MESSAGES[type]

    // Extract validation errors if present
    const details = data?.errors as Record<string, string[]> | undefined

    return {
      type,
      message,
      originalError: error,
      statusCode: status,
      details,
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    // Network error
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK,
        message: ERROR_MESSAGES[ErrorType.NETWORK],
        originalError: error,
      }
    }

    return {
      type: ErrorType.UNKNOWN,
      message: error.message || ERROR_MESSAGES[ErrorType.UNKNOWN],
      originalError: error,
    }
  }

  // Unknown error type
  return {
    type: ErrorType.UNKNOWN,
    message: ERROR_MESSAGES[ErrorType.UNKNOWN],
    originalError: error,
  }
}

/**
 * Handle an API error - log it and optionally show a toast
 */
export function handleApiError(
  error: unknown,
  options: {
    showToast?: boolean
    logLevel?: 'error' | 'warn' | 'info'
    context?: string
  } = {}
): ApiError {
  const { showToast = true, logLevel = 'error', context } = options
  const apiError = parseApiError(error)

  // Log the error
  const logMessage = context 
    ? `[${context}] ${apiError.message}` 
    : apiError.message

  switch (logLevel) {
    case 'warn':
      logger.warn(logMessage, { error: apiError })
      break
    case 'info':
      logger.info(logMessage, { error: apiError })
      break
    default:
      logger.error(logMessage, { error: apiError })
  }

  // Show toast notification if available
  if (showToast && typeof window !== 'undefined') {
    showErrorToast(apiError.message)
  }

  return apiError
}

/**
 * Show an error toast notification
 */
function showErrorToast(message: string): void {
  // Check if toast function exists (from a toast library like react-hot-toast)
  if (typeof window !== 'undefined' && (window as WindowWithToast).toast) {
    (window as WindowWithToast).toast.error(message)
    return
  }

  // Fallback: dispatch custom event for toast handling
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: { type: 'error', message },
      })
    )
  }
}

/**
 * Show a success toast notification
 */
export function showSuccessToast(message: string): void {
  if (typeof window !== 'undefined' && (window as WindowWithToast).toast) {
    (window as WindowWithToast).toast.success(message)
    return
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: { type: 'success', message },
      })
    )
  }
}

/**
 * Wrap an async function with error handling
 */
export function withErrorHandling<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  options: {
    showToast?: boolean
    context?: string
    onError?: (error: ApiError) => void
  } = {}
): (...args: Args) => Promise<T | null> {
  return async (...args: Args): Promise<T | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      const apiError = handleApiError(error, {
        showToast: options.showToast ?? true,
        context: options.context,
      })

      if (options.onError) {
        options.onError(apiError)
      }

      return null
    }
  }
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosLikeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosLikeError).isAxiosError === true
  )
}

// Type definitions
interface AxiosLikeError {
  isAxiosError: boolean
  response?: {
    status: number
    data: unknown
  }
  message: string
}

interface WindowWithToast extends Window {
  toast?: {
    error: (message: string) => void
    success: (message: string) => void
  }
}

/**
 * Hook for handling errors in React components
 */
export function createErrorState() {
  return {
    error: null as ApiError | null,
    isError: false,
    clearError: () => {},
    setError: (_error: unknown) => {},
  }
}
