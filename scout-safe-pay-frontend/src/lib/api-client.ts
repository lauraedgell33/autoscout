import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth-store';

/**
 * Client API optimizat cu retry logic și timeout
 */
class OptimizedAPIClient {
  private client: AxiosInstance;
  private requestQueue: Map<string, Promise<any>>;

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

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor cu retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number };
        
        // Handle 401 Unauthorized - logout user
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        
        // Retry logic pentru network errors
        if (!config._retry && error.code === 'ECONNABORTED') {
          config._retry = (config._retry || 0) + 1;
          
          if (config._retry < 3) {
            // Exponential backoff
            await new Promise(resolve => 
              setTimeout(resolve, Math.pow(2, config._retry!) * 1000)
            );
            return this.client(config);
          }
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
