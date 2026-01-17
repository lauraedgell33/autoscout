// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampler: (samplingContext) => {
    if (samplingContext.transactionContext.name.includes('health')) {
      return 0
    }
    return 0.1
  },

  // Filter out certain errors
  beforeSend(event, hint) {
    // Filter out expected errors
    if (event.exception) {
      const error = hint.originalException
      
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message)
        if (message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT')) {
          // These are expected in development
          return null
        }
      }
    }

    return event
  },
})
