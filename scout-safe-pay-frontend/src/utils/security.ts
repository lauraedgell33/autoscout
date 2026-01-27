/**
 * Input Validation & Sanitization Utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return dirty
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  }) as string
}

/**
 * Sanitize user input (removes all HTML)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000) // Limit length
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate phone number (international format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Validate credit card number (basic Luhn check)
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 13 || cleaned.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters')
  } else {
    score += 1
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters')
  } else {
    score += 1
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters')
  } else {
    score += 1
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers')
  } else {
    score += 1
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Add special characters')
  } else {
    score += 1
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255)
}

/**
 * Validate file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size
 */
export function isValidFileSize(
  file: File,
  maxSizeMB: number
): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

/**
 * SQL Injection prevention (basic check)
 */
export function containsSqlInjection(input: string): boolean {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
    'ALTER', 'EXEC', 'UNION', 'SCRIPT', '--', ';--', '/*', '*/',
    'xp_', 'sp_'
  ]
  
  const upperInput = input.toUpperCase()
  return sqlKeywords.some(keyword => upperInput.includes(keyword))
}

/**
 * Rate limit check (client-side)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime
  }
}

/**
 * CSRF Token utilities
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  return token === storedToken
}

/**
 * Content Security Policy violations reporter
 */
export function reportCspViolation(violation: SecurityPolicyViolationEvent): void {
  const report = {
    documentURI: violation.documentURI,
    violatedDirective: violation.violatedDirective,
    effectiveDirective: violation.effectiveDirective,
    originalPolicy: violation.originalPolicy,
    blockedURI: violation.blockedURI,
    statusCode: violation.statusCode,
    timestamp: new Date().toISOString()
  }
  
  // Send to logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service
    console.error('CSP Violation:', report)
  }
}

/**
 * Secure random string generator
 */
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  const bytes = Array.from(array)
  return btoa(String.fromCharCode(...bytes))
    .replace(/[+/=]/g, '')
    .slice(0, length)
}
