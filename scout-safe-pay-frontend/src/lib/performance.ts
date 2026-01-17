// Performance optimization utilities
import React, { lazy, Suspense, ComponentType } from 'react';

/**
 * Dynamically import heavy components only when needed
 * Usage: const HeavyComponent = useLazyLoad(() => import('./HeavyComponent'))
 */
export function useLazyLoad<T = Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    fallback?: React.ReactNode;
    ssr?: boolean;
  }
) {
  const LazyComponent = lazy(importFunc);
  
  return LazyComponent;
}

/**
 * Preload critical resources
 */
export function preloadImage(src: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return entry;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Import statements (add at the top of file where needed)
import { lazy, Suspense, useEffect, useState } from 'react';
