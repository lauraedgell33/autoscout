// Dynamic import utility for code splitting
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const DefaultLoading = () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />;

export function dynamicComponent<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  options?: { loading?: () => ReactNode; ssr?: boolean }
) {
  return dynamic(importFunc, {
    loading: options?.loading ?? DefaultLoading,
    ssr: options?.ssr !== false,
  });
}

export default dynamicComponent;
