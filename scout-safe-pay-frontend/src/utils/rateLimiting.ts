/**
 * Rate Limiting Utilities
 * Client-side rate limiting to prevent abuse
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

interface RateLimitRecord {
  count: number
  resetTime: number
  blocked: boolean
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout | null = null
  
  constructor() {
    // Cleanup expired records every minute
    if (typeof window !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
    }
  }
  
  /**
   * Check if request is allowed
   */
  check(key: string, config: RateLimitConfig): {
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
  } {
    const now = Date.now()
    const record = this.store.get(key)
    
    // No record or expired - allow request
    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      })
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }
    
    // Previously blocked - still blocked
    if (record.blocked && now < record.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      }
    }
    
    // Increment counter
    record.count++
    
    // Exceeded limit - block
    if (record.count > config.maxRequests) {
      record.blocked = true
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      }
    }
    
    // Still under limit
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime
    }
  }
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key)
  }
  
  /**
   * Cleanup expired records
   */
  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.store.entries())
    for (const [key, record] of entries) {
      if (now > record.resetTime) {
        this.store.delete(key)
      }
    }
  }
  
  /**
   * Destroy rate limiter
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configurations for different actions
 */
export const RATE_LIMITS = {
  // API calls
  API_GENERAL: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  API_SEARCH: { maxRequests: 30, windowMs: 60000 }, // 30 searches per minute
  API_WRITE: { maxRequests: 10, windowMs: 60000 }, // 10 writes per minute
  
  // Authentication
  LOGIN: { maxRequests: 5, windowMs: 300000 }, // 5 login attempts per 5 minutes
  REGISTER: { maxRequests: 3, windowMs: 3600000 }, // 3 registrations per hour
  PASSWORD_RESET: { maxRequests: 3, windowMs: 3600000 }, // 3 resets per hour
  
  // Forms
  CONTACT_FORM: { maxRequests: 5, windowMs: 3600000 }, // 5 submissions per hour
  MESSAGE_SEND: { maxRequests: 20, windowMs: 60000 }, // 20 messages per minute
  
  // File uploads
  FILE_UPLOAD: { maxRequests: 10, windowMs: 300000 }, // 10 uploads per 5 minutes
} as const

/**
 * React hook for rate limiting
 */
export function useRateLimit(key: string, config: RateLimitConfig) {
  const check = () => rateLimiter.check(key, config)
  const reset = () => rateLimiter.reset(key)
  
  return { check, reset }
}

/**
 * Rate limit decorator for async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  key: string,
  config: RateLimitConfig
): T {
  return (async (...args: Parameters<T>) => {
    const result = rateLimiter.check(key, config)
    
    if (!result.allowed) {
      throw new Error(
        config.message || 
        `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`
      )
    }
    
    return fn(...args)
  }) as T
}

/**
 * Exponential backoff utility
 */
export class ExponentialBackoff {
  private attempt = 0
  private maxAttempts: number
  private baseDelay: number
  private maxDelay: number
  
  constructor(
    maxAttempts: number = 5,
    baseDelay: number = 1000,
    maxDelay: number = 30000
  ) {
    this.maxAttempts = maxAttempts
    this.baseDelay = baseDelay
    this.maxDelay = maxDelay
  }
  
  /**
   * Execute function with exponential backoff
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn()
      this.reset()
      return result
    } catch (error) {
      this.attempt++
      
      if (this.attempt >= this.maxAttempts) {
        this.reset()
        throw error
      }
      
      const delay = Math.min(
        this.baseDelay * Math.pow(2, this.attempt - 1),
        this.maxDelay
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
      return this.execute(fn)
    }
  }
  
  reset(): void {
    this.attempt = 0
  }
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}
