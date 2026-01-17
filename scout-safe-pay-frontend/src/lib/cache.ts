import { useState, useEffect } from 'react';

/**
 * Cache storage pentru React Query și alte date
 */
class FrontendCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Setează o valoare în cache cu TTL
   */
  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Obține o valoare din cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Verifică dacă a expirat
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Șterge o cheie din cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Șterge toate cheile care încep cu un prefix
   */
  deleteByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Curăță cache-ul complet
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Curăță valorile expirate
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const frontendCache = new FrontendCache();

// Cleanup periodic (la fiecare 5 minute)
if (typeof window !== 'undefined') {
  setInterval(() => {
    frontendCache.cleanup();
  }, 300000);
}

/**
 * Hook pentru utilizarea cache-ului
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300000
): { data: T | null; loading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(frontendCache.get<T>(key));
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      frontendCache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pe mount dacă nu există date
  useEffect(() => {
    if (!data) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
