/**
 * Production-safe logger utility
 * Replaces console.log with proper logging that can be disabled in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  enabled: boolean
  level: LogLevel
  prefix?: string
}

class Logger {
  private config: LoggerConfig = {
    enabled: process.env.NODE_ENV === 'development',
    level: 'debug',
    prefix: '[App]'
  }

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.config.level)
    const requestedLevelIndex = levels.indexOf(level)
    
    return requestedLevelIndex >= currentLevelIndex
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const prefix = this.config.prefix ? `${this.config.prefix} ` : ''
    const formattedMessage = `[${timestamp}] ${prefix}[${level.toUpperCase()}] ${message}`

    switch (level) {
      case 'debug':
      case 'info':
        console.log(formattedMessage, ...args)
        break
      case 'warn':
        console.warn(formattedMessage, ...args)
        break
      case 'error':
        console.error(formattedMessage, ...args)
        break
    }
  }

  debug(message: string, ...args: any[]): void {
    this.formatMessage('debug', message, ...args)
  }

  info(message: string, ...args: any[]): void {
    this.formatMessage('info', message, ...args)
  }

  warn(message: string, ...args: any[]): void {
    this.formatMessage('warn', message, ...args)
  }

  error(message: string, error?: any, ...args: any[]): void {
    this.formatMessage('error', message, error, ...args)
    
    // In production, send to backend error logging (FREE alternative to Sentry)
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true') {
      // Send error to backend for centralized logging (FREE)
      if (typeof window !== 'undefined') {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/errors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            error: error ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            } : null,
            metadata: args,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        }).catch((fetchError) => {
          // Silent fail - don't break app if error logging fails
          console.error('Failed to log error to backend:', fetchError);
        });
      }
    }
  }
}

// Create default logger instance
export const logger = new Logger()

// Export class for custom loggers
export default Logger
