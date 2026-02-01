import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { APIErrorHandler, ErrorRecovery } from '@/lib/error-handler';

/**
 * Client API optimizat cu retry logic și timeout
 */
class OptimizedAPIClient {
  private client: AxiosInstance;
  private requestQueue: Map<string, Promise<any>>;
  private maxRetries = 3;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api';
    
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // 🔒 httpOnly cookies support
    });

    this.requestQueue = new Map();

    // Request interceptor to add auth token and logging
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        (config as AxiosRequestConfig & { _requestId?: string })._requestId = requestId;

        if (process.env.NEXT_PUBLIC_API_DEBUG === 'true') {
          console.log('[API Request]', {
            id: requestId,
            method: config.method?.toUpperCase(),
            url: config.url,
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor cu retry logic
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NEXT_PUBLIC_API_DEBUG === 'true') {
          console.log('[API Response]', {
            id: (response.config as AxiosRequestConfig & { _requestId?: string })._requestId,
            status: response.status,
            url: response.config.url,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number; _requestId?: string };
        const status = error.response?.status;
        const retryCount = config._retry || 0;
        const isRetryable = APIErrorHandler.isRetryable(error);
        
        // Handle 401 Unauthorized - logout user
        if (status === 401) {
          ErrorRecovery.handleAuthError();
        }
        
        // Handle 403 Forbidden - check if it's email verification issue
        if (status === 403) {
          const errorMessage = (error.response?.data as any)?.message || '';
          const isEmailVerificationError = errorMessage.toLowerCase().includes('email') && 
                                          errorMessage.toLowerCase().includes('verif');
          
          if (isEmailVerificationError) {
            // Email not verified - redirect to verification notice (only once)
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname;
              // Don't redirect if already on verify-email, login, or register page
              const excludedPaths = ['/verify-email', '/login', '/register', '/email'];
              const shouldRedirect = !excludedPaths.some(path => currentPath.includes(path));
              
              if (shouldRedirect) {
                // Set flag to prevent multiple redirects
                const redirectKey = 'email_verification_redirect';
                const lastRedirect = sessionStorage.getItem(redirectKey);
                const now = Date.now();
                
                // Only redirect once per minute to prevent loops
                if (!lastRedirect || (now - parseInt(lastRedirect)) > 60000) {
                  sessionStorage.setItem(redirectKey, now.toString());
                  window.location.href = '/verify-email?required=true';
                }
              }
            }
          }
        }
        
        // Retry logic for network errors and retryable status codes
        if (isRetryable && retryCount < this.maxRetries) {
          config._retry = retryCount + 1;

          if (!error.response) {
            const shouldRetry = await ErrorRecovery.handleNetworkError();
            if (!shouldRetry) {
              return Promise.reject(error);
            }
          }

          let delay = ErrorRecovery.calculateBackoffDelay(retryCount);

          if (status === 429) {
            const retryAfter = error.response?.headers?.['retry-after'];
            const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : null;
            if (retryAfterMs && !Number.isNaN(retryAfterMs)) {
              delay = Math.max(delay, retryAfterMs);
            }
          }

          if (process.env.NEXT_PUBLIC_API_DEBUG === 'true') {
            console.warn('[API Retry]', {
              id: config._requestId,
              attempt: config._retry,
              delay,
              status,
              url: config.url,
            });
          }

          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client(config);
        }

        const errorReport = APIErrorHandler.createErrorReport(error, {
          requestId: config._requestId,
        });

        // Only log in development or if debug is enabled
        if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_API_DEBUG === 'true') {
          console.error('[API Error]', {
            ...errorReport,
            status: status,
            url: config?.url,
            message: error.message,
            responseData: error.response?.data,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Deduplicare request-uri - previne același request de multiple ori
   */
  private async dedupedRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  /**
   * GET request cu deduplicare
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const key = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    return this.dedupedRequest(key, async () => {
      const response = await this.client.get<T>(url, config);
      return response.data;
    });
  }

  /**
   * Get CSRF cookie before any mutating requests (POST, PUT, DELETE, PATCH)
   */
  async getCsrfCookie(): Promise<void> {
    await axios.get(`${this.client.defaults.baseURL?.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.getCsrfCookie();
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.getCsrfCookie();
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await this.getCsrfCookie();
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.getCsrfCookie();
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Batch requests - execută multiple request-uri în paralel
   */
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(req => req()));
  }
}

export const apiClient = new OptimizedAPIClient();
