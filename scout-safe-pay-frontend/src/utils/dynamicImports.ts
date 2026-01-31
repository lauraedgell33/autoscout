/**
 * Dynamic Import Utilities
 * Lazy load heavy components to reduce initial bundle size
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import { createElement } from 'react'

/**
 * Simple loading component
 */
function LoadingFallback() {
  return createElement('div', {
    className: 'flex items-center justify-center p-8'
  }, createElement('div', {
    className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
  }))
}

/**
 * Create a dynamically imported component with loading state
 */
export function createDynamicComponent<T extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    ssr?: boolean
  }
) {
  return dynamic(importFn, {
    loading: LoadingFallback,
    ssr: options?.ssr ?? true
  })
}

/**
 * Preload a component before it's needed
 */
export async function preloadComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): Promise<void> {
  try {
    await importFn()
  } catch (error) {
    console.error('Failed to preload component:', error)
  }
}
