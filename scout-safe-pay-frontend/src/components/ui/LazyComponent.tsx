/**
 * Component wrapper pentru lazy loading
 */
'use client';

import { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

/**
 * Wrapper pentru lazy loading de componente cu fallback customizabil
 */
export function LazyComponent({ 
  loader, 
  fallback = <div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg" />,
  ...props 
}: LazyComponentProps) {
  const Component = lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * HOC pentru lazy loading de componente
 */
export function withLazyLoad<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  return (props: P) => (
    <LazyComponent loader={loader} fallback={fallback} {...props} />
  );
}

/**
 * Skeleton loader pentru conținut
 */
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton pentru card
 */
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 w-full rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

/**
 * Skeleton pentru listă
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
