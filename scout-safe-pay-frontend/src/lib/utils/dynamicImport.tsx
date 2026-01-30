// Dynamic import utility for code splitting
import dynamic from 'next/dynamic';

export function dynamicComponent<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  options?: { loading?: React.ComponentType; ssr?: boolean }
) {
  return dynamic(importFunc, {
    loading: options?.loading || (() => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />),
    ssr: options?.ssr !== false,
  });
}

export default dynamicComponent;
