// Error handling and recovery utilities
import { AxiosError } from 'axios';

export class APIErrorHandler {
  /**
   * Parse API error response
   */
  static parseError(error: any): {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
    isNetworkError: boolean;
    isValidationError: boolean;
    isAuthError: boolean;
    isServerError: boolean;
  } {
    if (!error.response) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
        isValidationError: false,
        isAuthError: false,
        isServerError: false,
      };
    }

    const { status, data } = error.response;

    // Validation error (422)
    if (status === 422) {
      return {
        message: data?.message || 'Validation error',
        statusCode: status,
        errors: data?.errors || {},
        isNetworkError: false,
        isValidationError: true,
        isAuthError: false,
        isServerError: false,
      };
    }

    // Auth error (401, 403)
    if (status === 401 || status === 403) {
      return {
        message: status === 401 ? 'Unauthorized. Please login.' : 'Forbidden. Access denied.',
        statusCode: status,
        isNetworkError: false,
        isValidationError: false,
        isAuthError: true,
        isServerError: false,
      };
    }

    // Server error (5xx)
    if (status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        statusCode: status,
        isNetworkError: false,
        isValidationError: false,
        isAuthError: false,
        isServerError: true,
      };
    }

    // Generic error
    return {
      message: data?.message || error.message || 'An error occurred',
      statusCode: status,
      isNetworkError: false,
      isValidationError: false,
      isAuthError: false,
      isServerError: false,
    };
  }

  /**
   * Handle error and show appropriate message
   */
  static handleError(error: any, options: { showToast?: boolean; toast?: any } = {}) {
    const parsedError = this.parseError(error);

    if (options.showToast && options.toast) {
      const toastType = parsedError.isServerError ? 'error' : 'error';
      options.toast(parsedError.message, { type: toastType });
    }

    console.error('[API Error]', parsedError);

    return parsedError;
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: any): string {
    const parsed = this.parseError(error);

    if (parsed.isNetworkError) {
      return 'No internet connection. Please check your network.';
    }

    if (parsed.isAuthError) {
      return 'Your session has expired. Please log in again.';
    }

    if (parsed.isServerError) {
      return 'Server error. Our team has been notified. Please try again later.';
    }

    if (parsed.isValidationError) {
      const messages = Object.values(parsed.errors || {})
        .flat()
        .join(', ');
      return messages || 'Please check your input and try again.';
    }

    return parsed.message;
  }

  /**
   * Get validation errors as object
   */
  static getValidationErrors(error: any): Record<string, string> {
    const parsed = this.parseError(error);

    if (!parsed.isValidationError) {
      return {};
    }

    const errors: Record<string, string> = {};

    Object.entries(parsed.errors || {}).forEach(([key, messages]) => {
      if (Array.isArray(messages)) {
        errors[key] = messages[0] || 'Invalid input';
      } else {
        errors[key] = String(messages);
      }
    });

    return errors;
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: any): boolean {
    if (!error.response) {
      return true; // Network errors are retryable
    }

    const status = error.response.status;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];

    return retryableStatuses.includes(status);
  }

  /**
   * Create error report for logging
   */
  static createErrorReport(error: any, context: any = {}) {
    const parsed = this.parseError(error);

    return {
      timestamp: new Date().toISOString(),
      message: parsed.message,
      statusCode: parsed.statusCode,
      type: parsed.isNetworkError
        ? 'network'
        : parsed.isValidationError
        ? 'validation'
        : parsed.isAuthError
        ? 'auth'
        : parsed.isServerError
        ? 'server'
        : 'unknown',
      context,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      retryable: this.isRetryable(error),
      originalError: error.toString(),
    };
  }
}

/**
 * Error recovery strategies
 */
export class ErrorRecovery {
  /**
   * Handle authentication error
   */
  static handleAuthError() {
    // Clear auth store
    const { logout } = require('@/store/auth-store').useAuthStore.getState();
    logout();

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Handle network error with offline support
   */
  static async handleNetworkError(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('Application is offline');
      return false;
    }

    // Retry after delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  /**
   * Handle rate limiting (429)
   */
  static calculateBackoffDelay(attemptCount: number): number {
    const baseDelay = 1000; // 1 second
    const exponentialDelay = baseDelay * Math.pow(2, attemptCount);
    const maxDelay = 32000; // 32 seconds
    const jitter = Math.random() * 1000;

    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  /**
   * Fallback to cached data
   */
  static getCachedData(key: string): any {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const maxAge = 5 * 60 * 1000; // 5 minutes

        if (Date.now() - timestamp < maxAge) {
          console.log(`Using cached data for ${key}`);
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
    }

    return null;
  }

  /**
   * Cache data for fallback
   */
  static setCachedData(key: string, data: any): void {
    try {
      localStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }
}

export default { APIErrorHandler, ErrorRecovery };
